from backend.config import settings
from backend.utils.logger import logger
from backend.utils.indicators import atr
import pandas as pd

class OrderManager:
    def __init__(self, broker):
        self.broker = broker

    async def update_trailing_sl(self, trade, current_price):
        if not settings.TRAILING_SL: return

        # Fetch ATR for trailing calculation
        df = self.broker.get_ohlcv(trade.symbol, "5m")
        if df.empty: return

        atr_val = atr(df['High'], df['Low'], df['Close'], 14).iloc[-1]
        mult = settings.TRAILING_SL_ATR_MULTIPLIER

        new_sl = trade.sl
        if trade.side == "BUY":
            trail_sl = current_price - (atr_val * mult)
            if trail_sl > trade.sl:
                new_sl = trail_sl
                logger.info(f"Trailing SL Up for {trade.symbol}: {new_sl:.2f}")
        else:
            trail_sl = current_price + (atr_val * mult)
            if trail_sl < trade.sl:
                new_sl = trail_sl
                logger.info(f"Trailing SL Down for {trade.symbol}: {new_sl:.2f}")

        # In a real broker, we might modify the order on the exchange
        # For our local model, we update the trade object/DB
        return new_sl
