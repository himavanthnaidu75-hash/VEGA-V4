from backend.strategies.base import BaseStrategy
from backend.utils.indicators import ema
import pandas as pd
class EMAConfluenceStrategy(BaseStrategy):
    def __init__(self): super().__init__("EMA Confluence", "5m", "trend")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 200: return {}
        e9, e21, e50, e200 = ema(df['Close'], 9), ema(df['Close'], 21), ema(df['Close'], 50), ema(df['Close'], 200)
        c, l, h = df['Close'].iloc[-1], df['Low'].iloc[-1], df['High'].iloc[-1]
        if c > e9.iloc[-1] > e21.iloc[-1] > e50.iloc[-1] > e200.iloc[-1] and l <= e21.iloc[-1]:
            return {'side':'BUY','entry':c,'sl':e50.iloc[-1],'tp':c+(c-e50.iloc[-1])*1.5,'confidence_boost':20,'reason':'EMA Pullback'}
        if c < e9.iloc[-1] < e21.iloc[-1] < e50.iloc[-1] < e200.iloc[-1] and h >= e21.iloc[-1]:
            return {'side':'SELL','entry':c,'sl':e50.iloc[-1],'tp':c-(e50.iloc[-1]-c)*1.5,'confidence_boost':20,'reason':'EMA Pullback Inverse'}
        return {}
