import asyncio, json
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from vega.backend.config import settings
from vega.backend.utils.logger import logger
from vega.backend.utils.notifier import notifier
from vega.backend.broker import get_broker
from vega.backend.engine.orchestrator import TradingOrchestrator
from vega.backend.engine.scheduler import VegaScheduler
from vega.backend.models import create_db_and_tables
from vega.backend.auth import google_router
from vega.backend.strategies.builtin import get_builtin_strategies
from vega.backend.strategies.external import get_external_strategies
from vega.backend.engine.kill_switch import KillSwitch
from vega.backend.data.live_feed import LiveFeed

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

mgr = ConnectionManager()
brk = get_broker()
orch = TradingOrchestrator(brk, ws_manager=mgr)
sched = VegaScheduler(orch)
kill_sw_inst = KillSwitch(brk, ws_manager=mgr)
feed_inst = LiveFeed(brk, ws_manager=mgr)

import vega.backend.engine.kill_switch as ks_mod
ks_mod.kill_switch = kill_sw_inst

@app.on_event("startup")
async def startup():
    create_db_and_tables()
    orch.set_strategies(get_builtin_strategies() + get_external_strategies())
    asyncio.create_task(notifier.start_bot())
    asyncio.create_task(feed_inst.start())
    sched.start()
    asyncio.create_task(broadcast_loop())
    logger.info("VEGA 2.0 Backend Fully Operational")

async def broadcast_loop():
    while True:
        try:
            pos = brk.get_positions()
            pnl = sum(p.pnl for p in pos)
            await mgr.broadcast(json.dumps({"type": "positions_update", "data": [vars(p) for p in pos]}))
            await mgr.broadcast(json.dumps({"type": "daily_pnl", "data": {"pnl": pnl, "pct": (pnl/settings.TOTAL_CAPITAL)*100 if settings.TOTAL_CAPITAL > 0 else 0}}))
            st = "KILLED" if kill_sw_inst.is_killed else ("RUNNING" if orch.is_running else "PAUSED")
            await mgr.broadcast(json.dumps({"type": "system_status", "data": {"status": st}}))
            await asyncio.sleep(5)
        except: await asyncio.sleep(5)

@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await mgr.connect(ws)
    try:
        while True: await ws.receive_text()
    except WebSocketDisconnect: mgr.disconnect(ws)

@app.post("/kill")
async def manual_kill(token: str):
    if token == settings.KILL_TOKEN: await kill_sw_inst.execute(reason="API Call"); return {"ok":True}
    raise HTTPException(401)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)
