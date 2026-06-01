from backend.strategies.base import BaseStrategy
from backend.utils.indicators import bb_squeeze, bollinger_bands
import pandas as pd

class BBSqueezeStrategy(BaseStrategy):
    def __init__(self): super().__init__("BB Squeeze", "5m", "reversion")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 30: return {}
        sq = bb_squeeze(df['High'], df['Low'], df['Close'])
        if sq.iloc[-6:-1].all() and not sq.iloc[-1]: # Squeeze released
            u, m, l = bollinger_bands(df['Close'])
            curr = df['Close'].iloc[-1]
            if curr > u.iloc[-1]: return {'side':'BUY','entry':curr,'sl':m.iloc[-1],'tp':curr*1.05,'confidence_boost':25,'reason':'Squeeze release up'}
            if curr < l.iloc[-1]: return {'side':'SELL','entry':curr,'sl':m.iloc[-1],'tp':curr*0.95,'confidence_boost':25,'reason':'Squeeze release down'}
        return {}
