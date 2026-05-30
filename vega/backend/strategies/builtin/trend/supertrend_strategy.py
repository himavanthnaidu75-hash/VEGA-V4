from vega.backend.strategies.base import BaseStrategy
from vega.backend.utils.indicators import supertrend
import pandas as pd

class SupertrendStrategy(BaseStrategy):
    def __init__(self): super().__init__("Supertrend", "5m", "trend")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 50: return {}
        st, dr = supertrend(df['High'], df['Low'], df['Close'])
        c = df['Close'].iloc[-1]
        if dr.iloc[-1] == 1 and dr.iloc[-2] == -1:
            return {'side':'BUY','entry':c,'sl':st.iloc[-1],'tp':c+(c-st.iloc[-1])*1.5,'confidence_boost':15,'reason':'ST Flip Bullish'}
        if dr.iloc[-1] == -1 and dr.iloc[-2] == 1:
            return {'side':'SELL','entry':c,'sl':st.iloc[-1],'tp':c-(st.iloc[-1]-c)*1.5,'confidence_boost':15,'reason':'ST Flip Bearish'}
        return {}
