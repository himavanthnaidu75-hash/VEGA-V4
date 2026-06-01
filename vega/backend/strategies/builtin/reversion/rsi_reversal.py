from backend.strategies.base import BaseStrategy
from backend.utils.indicators import rsi
import pandas as pd

class RSIReversalStrategy(BaseStrategy):
    def __init__(self): super().__init__("RSI Reversal", "5m", "reversion")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 30: return {}
        r = rsi(df['Close'], 14).iloc[-1]
        c = df['Close'].iloc[-1]
        if r < 30:
            return {'side':'BUY','entry':c,'sl':df['Low'].iloc[-5:].min(),'tp':c*1.03,'confidence_boost':10,'reason':'RSI Oversold'}
        if r > 70:
            return {'side':'SELL','entry':c,'sl':df['High'].iloc[-5:].max(),'tp':c*0.97,'confidence_boost':10,'reason':'RSI Overbought'}
        return {}
