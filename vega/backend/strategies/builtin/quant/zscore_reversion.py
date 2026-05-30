from vega.backend.strategies.base import BaseStrategy
from vega.backend.utils.indicators import zscore
import pandas as pd

class ZScoreReversionStrategy(BaseStrategy):
    def __init__(self): super().__init__("Z-Score", "15m", "quant")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 20: return {}
        z = zscore(df['Close']).iloc[-1]
        c = df['Close'].iloc[-1]
        if z < -2.0:
            return {'side':'BUY','entry':c,'sl':c*0.98,'tp':df['Close'].rolling(20).mean().iloc[-1],'confidence_boost':15,'reason':'Z-Score Oversold'}
        if z > 2.0:
            return {'side':'SELL','entry':c,'sl':c*1.02,'tp':df['Close'].rolling(20).mean().iloc[-1],'confidence_boost':15,'reason':'Z-Score Overbought'}
        return {}
