from vega.backend.strategies.base import BaseStrategy
from vega.backend.utils.indicators import price_momentum_return, price_momentum_vol
import pandas as pd
class PriceMomentumStrategy(BaseStrategy):
    def __init__(self): super().__init__("Price Momentum (3.1)", "1d", "trend")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 13: return {}
        r = price_momentum_return(df['Close'], 12, 1)
        v = price_momentum_vol(df['Close'].pct_change(), 12, 1)
        s = r.iloc[-1] / v.iloc[-1] if v.iloc[-1] > 0 else 0
        if s > 1.5: return {'side':'BUY','entry':df['Close'].iloc[-1],'sl':df['Close'].iloc[-1]*0.95,'tp':df['Close'].iloc[-1]*1.15,'confidence_boost':25,'reason':'momentum'}
        return {}
