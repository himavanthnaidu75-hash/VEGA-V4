from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class Trade(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    symbol: str
    strategy_name: str
    ict_score: int
    ict_breakdown: str
    side: str
    entry_price: float
    exit_price: Optional[float] = None
    sl: float
    tp: float
    qty: int
    broker_order_id: str
    status: str
    pnl: Optional[float] = None
    entry_time: datetime
    exit_time: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
