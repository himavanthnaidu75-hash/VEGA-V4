from backend.strategies.base import BaseStrategy
from backend.utils.indicators import iv_rank, adx
import pandas as pd
class IronCondorStrategy(BaseStrategy):
    def __init__(self): super().__init__("Iron Condor", "1d", "options")
    def generate_signal(self, df: pd.DataFrame):
        if 'iv' not in df.columns or len(df) < 30: return {}
        ivr = iv_rank(df['iv'].iloc[-1], df['iv'])
        a, _, _ = adx(df['High'], df['Low'], df['Close'])
        if ivr > 60 and a.iloc[-1] < 20:
            return {'side':'SELL','entry':df['Close'].iloc[-1],'sl':df['Close'].iloc[-1]*1.05,'tp':df['Close'].iloc[-1]*0.95,'confidence_boost':25,'reason':'High IVR + Ranging'}
        return {}
