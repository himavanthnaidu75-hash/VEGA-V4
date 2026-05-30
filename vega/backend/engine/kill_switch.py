import os, signal, asyncio, json
from vega.backend.utils.logger import logger
from vega.backend.utils.notifier import notifier

class KillSwitch:
    _instance = None
    def __new__(cls, *args, **kwargs):
        if not cls._instance: cls._instance = super(KillSwitch, cls).__new__(cls)
        return cls._instance

    def __init__(self, broker=None, ws_manager=None):
        if hasattr(self, 'broker'): return
        self.broker, self.ws_manager, self.is_killed = broker, ws_manager, False

    async def execute(self, reason="manual"):
        if self.is_killed: return
        self.is_killed = True
        logger.critical(f"KILL: {reason}")
        if self.ws_manager: await self.ws_manager.broadcast(json.dumps({"type":"kill_switch","data":{"reason":reason}}))

        try:
            for o in self.broker.get_orders():
                if o.status == "PENDING": self.broker.cancel_order(o.order_id)
            for p in self.broker.get_positions():
                self.broker.place_order(p.symbol, p.qty, "SELL" if p.side=="BUY" else "BUY", "MARKET", 0, "MIS")
        except Exception as e:
            err_msg = f"Kill switch cleanup failed: {e}"
            logger.error(err_msg)
            await notifier.send(f"⚠️ {err_msg}")

        await notifier.send(f"🚨 SYSTEM KILLED: {reason}")
        await asyncio.sleep(2)
        os.kill(os.getpid(), signal.SIGTERM)
