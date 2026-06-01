from backend.strategies.base import BaseStrategy
from backend.utils.indicators import sma
import pandas as pd
class TwoMAStrategy(BaseStrategy):
    def __init__(self, f=50, s=200): super().__init__(f"Two MA ({f}/{s})", "1h", "trend"); self.f, self.s = f, s
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < self.s: return {}
        fma, sma_ = sma(df['Close'], self.f), sma(df['Close'], self.s)
        if fma.iloc[-1] > sma_.iloc[-1] and fma.iloc[-2] <= sma_.iloc[-2]: return {'side':'BUY','entry':df['Close'].iloc[-1],'sl':sma_.iloc[-1],'tp':df['Close'].iloc[-1]*1.1,'confidence_boost':10,'reason':'cross'}
        return {}
