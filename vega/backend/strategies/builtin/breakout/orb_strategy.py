from backend.strategies.base import BaseStrategy
import pandas as pd

class ORBStrategy(BaseStrategy):
    def __init__(self): super().__init__("ORB", "1m", "breakout")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 30: return {}
        h15 = df['High'].iloc[:15].max()
        l15 = df['Low'].iloc[:15].min()
        c = df['Close'].iloc[-1]
        if c > h15:
            return {'side':'BUY','entry':c,'sl':l15,'tp':c+(c-l15)*1.5,'confidence_boost':20,'reason':'ORB Breakout High'}
        if c < l15:
            return {'side':'SELL','entry':c,'sl':h15,'tp':c-(h15-c)*1.5,'confidence_boost':20,'reason':'ORB Breakdown Low'}
        return {}
