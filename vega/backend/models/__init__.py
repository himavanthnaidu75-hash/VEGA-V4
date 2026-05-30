from sqlmodel import create_engine, SQLModel
from vega.backend.config import settings
from .trade import Trade
from .session import TradingSession

sqlite_url = f"sqlite:///{settings.DB_PATH}"
engine = create_engine(sqlite_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
