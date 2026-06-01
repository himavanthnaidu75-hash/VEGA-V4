from backend.strategies.base import BaseStrategy
from backend.utils.indicators import volume_profile_poc
import pandas as pd
class VolumeProfileBreakoutStrategy(BaseStrategy):
    def __init__(self): super().__init__("Volume Breakout", "15m", "breakout")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 100 or 'Volume' not in df.columns: return {}
        poc = volume_profile_poc(df['Close'], df['Volume'])
        std = df['Close'].std()
        vah, val = poc + std, poc - std
        c, p = df['Close'].iloc[-1], df['Close'].iloc[-2]
        if c > vah and p <= vah:
            return {'side':'BUY','entry':c,'sl':poc,'tp':c+(c-poc)*2,'confidence_boost':20,'reason':'Above Value Area'}
        if c < val and p >= val:
            return {'side':'SELL','entry':c,'sl':poc,'tp':c-(poc-c)*2,'confidence_boost':20,'reason':'Below Value Area'}
        return {}
