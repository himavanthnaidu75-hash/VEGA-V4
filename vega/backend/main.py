import asyncio, json
from typing import List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Header
from vega.backend.config import settings
from vega.backend.utils.logger import logger
from vega.backend.utils.notifier import notifier
from vega.backend.broker import get_broker
from vega.backend.engine.orchestrator import TradingOrchestrator
from vega.backend.engine.scheduler import VegaScheduler
from vega.backend.models import create_db_and_tables, engine as db_engine
from vega.backend.models.trade import Trade
from vega.backend.auth import google_router
from vega.backend.strategies.builtin import get_builtin_strategies
from vega.backend.strategies.external import get_external_strategies
from vega.backend.engine.kill_switch import KillSwitch
from vega.backend.data.live_feed import LiveFeed
from sqlmodel import Session, select
from datetime import datetime

app = FastAPI(title="VEGA 2.0")
app.include_router(google_router)

class ConnectionManager:
    def __init__(self): self.active: List[WebSocket] = []
    async def connect(self, ws: WebSocket): await ws.accept(); self.active.append(ws)
    def disconnect(self, ws: WebSocket): self.active.remove(ws)
    async def broadcast(self, msg: str):
        for c in self.active:
            try: await c.send_text(msg)
            except: pass

manager = ConnectionManager()
broker = get_broker()
orchestrator = TradingOrchestrator(broker, ws_manager=manager)
scheduler = VegaScheduler(orchestrator)
kill_sw_inst = KillSwitch(broker, ws_manager=manager)
feed_inst = LiveFeed(broker, ws_manager=manager)

import vega.backend.engine.kill_switch as ks_mod
ks_mod.kill_switch = kill_sw_inst

@app.on_event("startup")
async def startup():
    create_db_and_tables()
    orchestrator.set_strategies(get_builtin_strategies() + get_external_strategies())
    asyncio.create_task(notifier.start_bot())
    asyncio.create_task(feed_inst.start())
    scheduler.start()
    asyncio.create_task(broadcast_loop())
    logger.info("VEGA 2.0 Backend Fully Operational")

async def broadcast_loop():
    while True:
        try:
            pos = broker.get_positions()
            pnl = sum(p.pnl for p in pos)
            await manager.broadcast(json.dumps({"type": "positions_update", "data": [vars(p) for p in pos]}))
            await manager.broadcast(json.dumps({"type": "daily_pnl", "data": {"pnl": pnl, "pct": (pnl/settings.TOTAL_CAPITAL)*100 if settings.TOTAL_CAPITAL > 0 else 0}}))
            st = "KILLED" if kill_sw_inst.is_killed else ("RUNNING" if orchestrator.is_running else "PAUSED")
            await manager.broadcast(json.dumps({"type": "system_status", "data": {"status": st}}))
            await asyncio.sleep(5)
        except: await asyncio.sleep(5)

@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True: await websocket.receive_text()
    except WebSocketDisconnect: manager.disconnect(websocket)

@app.post("/kill")
async def manual_kill(x_kill_token: Optional[str] = Header(None)):
    if x_kill_token == settings.KILL_TOKEN:
        await kill_sw_inst.execute(reason="Manual Overrride")
        return {"status": "purged"}
    raise HTTPException(status_code=401)

@app.get("/api/performance")
def get_performance():
    with Session(db_engine) as sess:
        trades = sess.exec(select(Trade).order_by(Trade.exit_time)).all()
        cumulative = 0
        perf = []
        for t in trades:
            if t.pnl is not None:
                cumulative += t.pnl
                date_str = t.exit_time.strftime("%Y-%m-%d") if t.exit_time else t.created_at.strftime("%Y-%m-%d")
                perf.append({"time": date_str, "value": 100000 + cumulative})
        if not perf:
            perf = [{"time": datetime.now().strftime("%Y-%m-%d"), "value": 100000}]
        return perf

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)
