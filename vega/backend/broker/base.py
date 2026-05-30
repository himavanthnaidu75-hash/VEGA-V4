from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Optional, Callable, Dict
import pandas as pd

@dataclass
class Position:
    symbol: str
    qty: int
    side: str
    entry_price: float
    current_price: float
    pnl: float
    product: str

@dataclass
class Order:
    order_id: str
    symbol: str
    qty: int
    side: str
    order_type: str
    price: float
    status: str
    filled_qty: int = 0

@dataclass
class OrderResult:
    success: bool
    order_id: str
    message: str

@dataclass
class FundSummary:
    available_cash: float
    used_margin: float
    total_equity: float

class BrokerInterface(ABC):
    @abstractmethod
    def connect(self) -> bool: pass
    @abstractmethod
    def test_connection(self) -> Dict: pass
    @abstractmethod
    def get_positions(self) -> List[Position]: pass
    @abstractmethod
    def get_orders(self) -> List[Order]: pass
    @abstractmethod
    def get_funds(self) -> FundSummary: pass
    @abstractmethod
    def place_order(self, symbol: str, qty: int, side: str, order_type: str, price: float, product: str) -> OrderResult: pass
    @abstractmethod
    def cancel_order(self, order_id: str) -> bool: pass
    @abstractmethod
    def modify_order(self, order_id: str, price: float, qty: int) -> bool: pass
    @abstractmethod
    def get_live_price(self, symbol: str) -> float: pass
    @abstractmethod
    def get_ohlcv(self, symbol: str, interval: str, from_date: str = "", to_date: str = "") -> pd.DataFrame: pass
    @abstractmethod
    def subscribe_live_feed(self, symbols: List[str], callback: Callable) -> None: pass
