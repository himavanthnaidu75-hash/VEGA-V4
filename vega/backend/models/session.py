from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class TradingSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: str  # YYYY-MM-DD
    mode: str
    total_pnl: float = 0.0
    trades_count: int = 0
    win_count: int = 0
    strategy_enabled_json: str = "{}"
