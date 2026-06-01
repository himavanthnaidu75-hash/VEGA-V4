from backend.strategies.base import BaseStrategy
from backend.utils.indicators import ema, iv_rank
import pandas as pd
class DirectionalSpreadStrategy(BaseStrategy):
    def __init__(self): super().__init__("Directional Spread", "1d", "options")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 50 or 'iv' not in df.columns: return {}
        e50 = ema(df['Close'], 50)
        ivr = iv_rank(df['iv'].iloc[-1], df['iv'])
        c = df['Close'].iloc[-1]
        if ivr < 40:
            if c > e50.iloc[-1]:
                return {'side':'BUY','entry':c,'sl':c*0.97,'tp':c*1.05,'confidence_boost':20,'reason':'Trend Up + Low IVR'}
            if c < e50.iloc[-1]:
                return {'side':'SELL','entry':c,'sl':c*1.03,'tp':c*0.95,'confidence_boost':20,'reason':'Trend Down + Low IVR'}
        return {}
