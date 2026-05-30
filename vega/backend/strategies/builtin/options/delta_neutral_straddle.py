from vega.backend.strategies.base import BaseStrategy
from vega.backend.utils.indicators import iv_rank, bs_delta
import pandas as pd

class DeltaNeutralStraddleStrategy(BaseStrategy):
    def __init__(self):
        super().__init__("Delta Neutral", "1d", "options")

    def generate_signal(self, df: pd.DataFrame):
        if 'iv' not in df.columns or len(df) < 50: return {}
        ivr = iv_rank(df['iv'].iloc[-1], df['iv'])
        s = df['Close'].iloc[-1]

        # High IVR straddle sell
        if ivr > 60:
            # Net delta would be near zero for ATM
            return {
                'side': 'SELL',
                'entry': s,
                'sl': s * 1.10,
                'tp': s * 0.90,
                'confidence_boost': 20,
                'reason': f"High IVR {ivr:.2f}. ATM Straddle setup."
            }
        return {}
