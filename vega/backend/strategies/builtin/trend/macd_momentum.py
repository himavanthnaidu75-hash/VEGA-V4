from backend.strategies.base import BaseStrategy
from backend.utils.indicators import macd
import pandas as pd

class MACDMomentumStrategy(BaseStrategy):
    def __init__(self): super().__init__("MACD Momentum", "5m", "trend")
    def generate_signal(self, df: pd.DataFrame):
        if len(df) < 50: return {}
        ml, sl, h = macd(df['Close'])
        curr_ml, curr_sl, curr_h = ml.iloc[-1], sl.iloc[-1], h.iloc[-1]
        prev_ml, prev_sl, prev_h = ml.iloc[-2], sl.iloc[-2], h.iloc[-2]
        if curr_ml > 0 and curr_ml > curr_sl and prev_ml <= prev_sl and curr_h > prev_h:
            return {'side':'BUY','entry':df['Close'].iloc[-1],'sl':df['Low'].iloc[-5:].min(),'tp':df['Close'].iloc[-1]*1.03,'confidence_boost':15,'reason':'MACD Cross Above 0'}
        if curr_ml < 0 and curr_ml < curr_sl and prev_ml >= prev_sl and curr_h < prev_h:
            return {'side':'SELL','entry':df['Close'].iloc[-1],'sl':df['High'].iloc[-5:].max(),'tp':df['Close'].iloc[-1]*0.97,'confidence_boost':15,'reason':'MACD Cross Below 0'}
        return {}
