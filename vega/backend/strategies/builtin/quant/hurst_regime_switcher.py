from vega.backend.strategies.base import BaseStrategy
from vega.backend.utils.indicators import hurst_exponent
import pandas as pd

class HurstRegimeSwitcher(BaseStrategy):
    def __init__(self, orchestrator=None):
        super().__init__("Hurst Switcher", "1d", "quant")
        self.orchestrator = orchestrator

    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 100: return {}
        h = hurst_exponent(df['Close'])
        if self.orchestrator:
            if h > 0.55: # Trending
                for s in self.orchestrator.strategies:
                    if s.strategy_type == "trend": s.enabled = True
                    if s.strategy_type == "reversion": s.enabled = False
            elif h < 0.45: # Reverting
                for s in self.orchestrator.strategies:
                    if s.strategy_type == "trend": s.enabled = False
                    if s.strategy_type == "reversion": s.enabled = True
        return {} # Switcher doesn't trade
