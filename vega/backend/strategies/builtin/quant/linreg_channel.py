from vega.backend.strategies.base import BaseStrategy
from vega.backend.utils.indicators import linear_regression_channel
import pandas as pd
class LinearRegressionChannelStrategy(BaseStrategy):
    def __init__(self): super().__init__("LinReg Channel", "1h", "quant")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 50: return {}
        u, m, l = linear_regression_channel(df['Close'], 50)
        c = df['Close'].iloc[-1]
        if c <= l.iloc[-1]:
            return {'side':'BUY','entry':c,'sl':c*0.98,'tp':m.iloc[-1],'confidence_boost':15,'reason':'Touch lower band'}
        if c >= u.iloc[-1]:
            return {'side':'SELL','entry':c,'sl':c*1.02,'tp':m.iloc[-1],'confidence_boost':15,'reason':'Touch upper band'}
        return {}
