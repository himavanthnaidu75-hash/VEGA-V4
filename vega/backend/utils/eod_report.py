from backend.utils.notifier import notifier
from backend.utils.logger import logger

class EODReport:
    async def send(self, session_data):
        msg = f"🏁 VEGA End-of-Day Report\nDate: {session_data.date}\nP&L: ₹{session_data.total_pnl:.2f}\nTrades: {session_data.trades_count}"
        await notifier.send(msg)
        logger.info("EOD Report Sent.")
