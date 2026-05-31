from backend.strategies.base import BaseStrategy
from backend.utils.indicators import sue_score
import pandas as pd
class EarningsMomentumStrategy(BaseStrategy):
    def __init__(self): super().__init__("Earnings Momentum (3.2)", "1d", "trend")
    def generate_signal(self, df: pd.DataFrame):
        if 'eps' not in df.columns or 'eps_0' not in df.columns or 'eps_std' not in df.columns: return {}
        sue = sue_score(df['eps'].iloc[-1], df['eps_0'].iloc[-1], df['eps_std'].iloc[-1])
        if sue > 1.5: return {'side':'BUY','entry':df['Close'].iloc[-1],'sl':df['Close'].iloc[-1]*0.95,'tp':df['Close'].iloc[-1]*1.15,'confidence_boost':25,'reason':'earnings'}
        return {}
