from vega.backend.strategies.base import BaseStrategy
from vega.backend.utils.indicators import kalman_filter
import pandas as pd
class KalmanFilterTrendStrategy(BaseStrategy):
    def __init__(self): super().__init__("Kalman Trend", "15m", "quant")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 50: return {}
        k = kalman_filter(df['Close'])
        c, p = df['Close'].iloc[-1], df['Close'].iloc[-2]
        if c > k.iloc[-1] and p <= k.iloc[-2]:
            return {'side':'BUY','entry':c,'sl':c*0.99,'tp':c*1.05,'confidence_boost':10,'reason':'Kalman trend flip bullish'}
        if c < k.iloc[-1] and p >= k.iloc[-2]:
            return {'side':'SELL','entry':c,'sl':c*1.01,'tp':c*0.95,'confidence_boost':10,'reason':'Kalman trend flip bearish'}
        return {}
