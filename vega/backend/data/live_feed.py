import asyncio, json, yfinance as yf
from vega.backend.utils.logger import logger

class LiveFeed:
    def __init__(self, broker, ws_manager=None):
        self.broker, self.ws, self.prices = broker, ws_manager, {}
    async def start(self):
        asyncio.create_task(self._polling_loop())
    async def _polling_loop(self):
        from vega.backend.config import settings
        while True:
            for s in settings.WATCHLIST.split(","):
                try:
                    p = yf.Ticker(f"{s}.NS").fast_info['lastPrice']
                    self.prices[s] = p
                    if self.ws: await self.ws.broadcast(json.dumps({"type":"ticker_update","data":{"symbol":s,"price":p}}))
                except: pass
            await asyncio.sleep(30)
