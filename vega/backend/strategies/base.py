import pandas as pd
class BaseStrategy:
    def __init__(self, name, timeframe, strategy_type):
        self.name, self.timeframe, self.strategy_type, self.enabled = name, timeframe, strategy_type, True
    def generate_signal(self, df: pd.DataFrame): return {}
