import asyncio, json
from datetime import datetime
from sqlmodel import Session, select
from vega.backend.models import engine as db_engine
from vega.backend.models.trade import Trade
from vega.backend.engine.scanner import Scanner
from vega.backend.engine.risk_manager import RiskManager
from vega.backend.engine.order_manager import OrderManager
from vega.backend.config import settings
from vega.backend.utils.notifier import notifier
from vega.backend.utils.logger import logger

class TradingOrchestrator:
    def __init__(self, broker, ws_manager=None):
        self.broker, self.ws_manager = broker, ws_manager
        self.scanner, self.risk_manager = Scanner(), RiskManager()
        self.order_manager = OrderManager(broker)
        self.strategies, self.is_running = [], False
        self.current_mode = settings.DEFAULT_TRADE_MODE

    def set_strategies(self, s): self.strategies = s

    async def _broadcast(self, msg):
        if self.ws_manager: await self.ws_manager.broadcast(json.dumps(msg))

    async def run_scan_cycle(self):
        if not self.is_running: return
        symbols = settings.WATCHLIST.split(",")
        signals = await self.scanner.scan_all(symbols, self.strategies)
        for sig in signals:
            await self._broadcast({"type": "new_signal", "data": sig})
            with Session(db_engine) as sess:
                open_pos = sess.exec(select(Trade).where(Trade.status == "OPEN")).all()
                valid, reason = self.risk_manager.validate_trade(sig, sum(t.pnl or 0 for t in open_pos), len(open_pos))
                if valid:
                    qty = self.risk_manager.calculate_position_size(sig['entry'], sig['sl'])
                    res = self.broker.place_order(sig['symbol'], qty, sig['side'], "MARKET", sig['entry'], "MIS")
                    if res.success:
                        t = Trade(symbol=sig['symbol'], strategy_name=sig['strategy_name'], ict_score=sig['ict_score'], ict_breakdown=str(sig['ict_breakdown']), side=sig['side'], entry_price=sig['entry'], sl=sig['sl'], tp=sig['tp'], qty=qty, broker_order_id=res.order_id, status="OPEN", entry_time=datetime.utcnow())
                        sess.add(t); sess.commit()
                        await self._broadcast({"type": "order_update", "data": vars(t)})
                        await notifier.send(f"Trade: {sig['side']} {sig['symbol']} @ {sig['entry']}")

    async def manage_positions(self):
        while True: # Position management always runs until process kill
            with Session(db_engine) as sess:
                for t in sess.exec(select(Trade).where(Trade.status == "OPEN")).all():
                    cp = self.broker.get_live_price(t.symbol)
                    new_sl = await self.order_manager.update_trailing_sl(t, cp)
                    if new_sl and new_sl != t.sl:
                        dt = sess.get(Trade, t.id); dt.sl = new_sl; sess.add(dt); sess.commit(); t.sl = new_sl
                    if (t.side == "BUY" and (cp <= t.sl or cp >= t.tp)) or (t.side == "SELL" and (cp >= t.sl or cp <= t.tp)):
                        res = self.broker.place_order(t.symbol, t.qty, "SELL" if t.side == "BUY" else "BUY", "MARKET", cp, "MIS")
                        if res.success:
                            dt = sess.get(Trade, t.id); dt.status, dt.exit_price, dt.exit_time = "CLOSED", cp, datetime.utcnow()
                            dt.pnl = (cp - t.entry_price) * t.qty if t.side == "BUY" else (t.entry_price - cp) * t.qty
                            sess.add(dt); sess.commit()
                            await self._broadcast({"type": "order_update", "data": vars(dt)})
            await asyncio.sleep(10)

    async def pre_market_prompt(self):
        m = await notifier.wait_for_response(600)
        self.current_mode = "fno" if m == "2" else "equities"
        self.is_running = True
        asyncio.create_task(self.manage_positions())
