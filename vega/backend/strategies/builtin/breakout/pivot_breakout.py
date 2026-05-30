from vega.backend.strategies.base import BaseStrategy
from vega.backend.utils.indicators import classic_pivots, rsi
import pandas as pd
class PivotBreakoutStrategy(BaseStrategy):
    def __init__(self): super().__init__("Pivot Breakout", "15m", "breakout")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 50: return {}
        p = classic_pivots(df['High'].max(), df['Low'].min(), df['Close'].iloc[-1])
        r = rsi(df['Close']).iloc[-1]
        c = df['Close'].iloc[-1]
        if c > p['R1'] and r > 55:
            return {'side':'BUY','entry':c,'sl':p['PP'],'tp':p['R2'],'confidence_boost':15,'reason':'R1 breakout + RSI momentum'}
        if c < p['S1'] and r < 45:
            return {'side':'SELL','entry':c,'sl':p['PP'],'tp':p['S2'],'confidence_boost':15,'reason':'S1 breakdown + RSI weakness'}
        return {}
