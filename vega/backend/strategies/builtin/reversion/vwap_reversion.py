from vega.backend.strategies.base import BaseStrategy
from vega.backend.utils.indicators import vwap_bands, adx
import pandas as pd

class VWAPReversionStrategy(BaseStrategy):
    def __init__(self): super().__init__("VWAP Reversion", "5m", "reversion")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 20 or 'Volume' not in df.columns: return {}
        u, v, l = vwap_bands(df['High'], df['Low'], df['Close'], df['Volume'])
        a, _, _ = adx(df['High'], df['Low'], df['Close'])
        c = df['Close'].iloc[-1]
        if c < l.iloc[-1] and a.iloc[-1] < 20:
            return {'side':'BUY','entry':c,'sl':c*0.99, 'tp':v.iloc[-1], 'confidence_boost':15, 'reason':'VWAP Oversold'}
        if c > u.iloc[-1] and a.iloc[-1] < 20:
            return {'side':'SELL','entry':c,'sl':c*1.01, 'tp':v.iloc[-1], 'confidence_boost':15, 'reason':'VWAP Overbought'}
        return {}
