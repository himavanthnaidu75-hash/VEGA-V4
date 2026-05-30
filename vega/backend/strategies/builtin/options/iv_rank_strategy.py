from vega.backend.strategies.base import BaseStrategy
from vega.backend.utils.indicators import iv_rank
import pandas as pd

class IVRankStrategy(BaseStrategy):
    def __init__(self): super().__init__("IV Rank", "1d", "options")
    def generate_signal(self, df: pd.DataFrame):
        if 'iv' not in df.columns or len(df) < 100: return {}
        ivr = iv_rank(df['iv'].iloc[-1], df['iv'])
        c = df['Close'].iloc[-1]
        if ivr > 60:
            return {'side':'SELL','entry':c,'sl':c*1.05,'tp':c*0.95,'confidence_boost':15,'reason':'High IV Rank Sell'}
        if ivr < 20:
            return {'side':'BUY','entry':c,'sl':c*0.95,'tp':c*1.05,'confidence_boost':15,'reason':'Low IV Rank Buy'}
        return {}
