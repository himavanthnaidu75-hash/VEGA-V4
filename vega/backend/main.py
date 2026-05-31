import asyncio, json
from typing import List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Header, Body
from backend.config import settings
from backend.utils.logger import logger
from backend.utils.notifier import notifier
from backend.broker import get_broker
from backend.engine.orchestrator import TradingOrchestrator
from backend.engine.scheduler import VegaScheduler
from backend.models import create_db_and_tables, engine as db_engine
from backend.models.trade import Trade
from backend.auth import google_router
from backend.strategies.builtin import get_builtin_strategies
from backend.strategies.external import get_external_strategies
from backend.engine.kill_switch import KillSwitch
from backend.data.live_feed import LiveFeed
from backend.data.fetcher import fetcher
from sqlmodel import Session, select, func
from datetime import datetime
from pydantic import BaseModel

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

import backend.engine.kill_switch as ks_mod
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

class KillBody(BaseModel):
    token: Optional[str] = None

@app.post("/kill")
async def manual_kill(
    x_kill_token: Optional[str] = Header(None),
    body: KillBody = Body(None)
):
    token = x_kill_token or (body.token if body else None)
    if token == settings.KILL_TOKEN:
        await kill_sw_inst.execute(reason="Manual Overrride")
        return {"status": "purged"}
    raise HTTPException(status_code=401)

@app.get("/api/ohlcv")
def get_ohlcv(symbol: str, interval: str = "5m"):
    df = fetcher.get_ohlcv(symbol, interval)
    if df.empty: return []
    res = []
    for idx, row in df.iterrows():
        res.append({
            "time": int(idx.timestamp()),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
            "volume": float(row["Volume"])
        })
    return res

@app.get("/api/signals")
def get_signals():
    return orchestrator.active_signals

@app.get("/api/trades")
def get_trades():
    with Session(db_engine) as sess:
        return sess.exec(select(Trade).order_by(Trade.created_at.desc())).all()

def calculate_metrics(trades: List[Trade]):
    if not trades:
        return {"pnl": 0.0, "winRate": 0.0, "profitFactor": 0.0, "drawdown": 0.0}

    total_pnl = sum(t.pnl for t in trades if t.pnl is not None)
    wins = [t.pnl for t in trades if t.pnl is not None and t.pnl > 0]
    losses = [abs(t.pnl) for t in trades if t.pnl is not None and t.pnl < 0]

    win_rate = (len(wins) / len(trades)) * 100 if trades else 0
    profit_factor = sum(wins) / sum(losses) if losses else (sum(wins) if wins else 0)

    peak = settings.TOTAL_CAPITAL
    current = settings.TOTAL_CAPITAL
    max_dd = 0
    for t in trades:
        if t.pnl is not None:
            current += t.pnl
            if current > peak: peak = current
            dd = (peak - current) / peak * 100
            if dd > max_dd: max_dd = dd

    return {
        "pnl": total_pnl,
        "winRate": round(win_rate, 2),
        "profitFactor": round(profit_factor, 2),
        "drawdown": round(max_dd, 2)
    }

@app.get("/api/performance")
def get_performance():
    with Session(db_engine) as sess:
        trades = sess.exec(select(Trade).where(Trade.status == "CLOSED").order_by(Trade.exit_time)).all()
        cumulative = 0
        perf = []
        for t in trades:
            if t.pnl is not None:
                cumulative += t.pnl
                time_val = int(t.exit_time.timestamp()) if t.exit_time else int(t.created_at.timestamp())
                perf.append({"time": time_val, "value": settings.TOTAL_CAPITAL + cumulative})

        if not perf:
            now = int(datetime.utcnow().timestamp())
            perf = [{"time": now - 3600, "value": settings.TOTAL_CAPITAL}, {"time": now, "value": settings.TOTAL_CAPITAL}]

        return {"history": perf, "stats": calculate_metrics(trades)}

@app.get("/api/stats")
def get_stats_endpoint():
    with Session(db_engine) as sess:
        trades = sess.exec(select(Trade).where(Trade.status == "CLOSED")).all()
        return calculate_metrics(trades)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)
