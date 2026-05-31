from backend.strategies.base import BaseStrategy
from backend.utils.indicators import value_bp_ratio
import pandas as pd
class ValueStrategy(BaseStrategy):
    def __init__(self): super().__init__("Value (3.3)", "1d", "reversion")
    def generate_signal(self, df: pd.DataFrame):
        if 'book_value' not in df.columns or len(df) < 50: return {}
        bp = value_bp_ratio(df['book_value'], df['Close'])
        if bp.iloc[-1] > bp.rolling(50).mean().iloc[-1] * 1.3: return {'side':'BUY','entry':df['Close'].iloc[-1],'sl':df['Close'].iloc[-1]*0.9,'tp':df['Close'].iloc[-1]*1.1,'confidence_boost':15,'reason':'value'}
        return {}
