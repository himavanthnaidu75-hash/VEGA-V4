from pydantic_settings import BaseSettings
from typing import Literal, Optional

class Settings(BaseSettings):
    BROKER: Literal["paper", "dhan", "angel", "zerodha"] = "paper"
    DHAN_CLIENT_ID: str = ""
    DHAN_ACCESS_TOKEN: str = ""
    TOTAL_CAPITAL: float = 100000.0
    MAX_RISK_PER_TRADE: float = 0.01
    MAX_OPEN_POSITIONS: int = 5
    MAX_DAILY_LOSS: float = 0.03
    MAX_DAILY_PROFIT: float = 0.06
    MIN_RR_RATIO: float = 1.5
    POSITION_SIZING: str = "atr"
    TRAILING_SL: bool = True
    TRAILING_SL_ATR_MULTIPLIER: float = 1.5
    TRADING_MODE: str = "SIMULATION"
    DEFAULT_TRADE_MODE: str = "equities"
    ICT_MIN_CONFIDENCE: int = 65
    WATCHLIST: str = "RELIANCE,TCS,INFY,HDFCBANK,ICICIBANK,SBIN,BHARTIARTL,ITC,ASIANPAINT,TITAN"
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_CHAT_ID: str = ""
    KILL_TOKEN: str = "change_me"
    JWT_SECRET: str = "super_secret_jwt_key"
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    PORT: int = 8000
    DB_PATH: str = "vega.db"
    class Config: env_file = ".env"; extra = "ignore"
settings = Settings()
