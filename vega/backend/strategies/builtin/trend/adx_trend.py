from backend.strategies.base import BaseStrategy
from backend.utils.indicators import adx
import pandas as pd

class ADXTrendStrategy(BaseStrategy):
    def __init__(self): super().__init__("ADX Trend", "15m", "trend")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 30: return {}
        a, p, m = adx(df['High'], df['Low'], df['Close'])
        adx_val = a.iloc[-1]
        pdi, mdi = p.iloc[-1], m.iloc[-1]
        prev_pdi, prev_mdi = p.iloc[-2], m.iloc[-2]
        if adx_val > 25:
            if pdi > mdi and prev_pdi <= prev_mdi:
                return {'side':'BUY','entry':df['Close'].iloc[-1],'sl':df['Low'].iloc[-10:].min(),'tp':df['Close'].iloc[-1]*1.05,'confidence_boost':15,'reason':'ADX Strong + DI Cross'}
            if mdi > pdi and prev_mdi <= prev_pdi:
                return {'side':'SELL','entry':df['Close'].iloc[-1],'sl':df['High'].iloc[-10:].max(),'tp':df['Close'].iloc[-1]*0.95,'confidence_boost':15,'reason':'ADX Strong + DI Cross Inverse'}
        return {}
