import threading, uuid, yfinance as yf, pandas as pd
from vega.backend.broker.base import BrokerInterface, OrderResult, Position, Order, FundSummary
from vega.backend.config import settings

class PaperBroker(BrokerInterface):
    def __init__(self):
        self.p, self.o, self.cap, self.lock = {}, {}, settings.TOTAL_CAPITAL, threading.Lock()
    def connect(self): return True
    def test_connection(self): return {"connected":True}
    def get_live_price(self, s):
        try: return yf.Ticker(f"{s}.NS").fast_info['lastPrice']
        except: return 100.0
    def place_order(self, sym, qty, side, type, price, prod):
        with self.lock:
            oid = str(uuid.uuid4())
            self.o[oid] = Order(oid, sym, qty, side, type, price, "FILLED")
            cp = self.get_live_price(sym)
            if side=="BUY": self.p[sym]=Position(sym,qty,side,cp,cp,0.0,prod)
            else: self.p.pop(sym,None)
            return OrderResult(True, oid, "OK")
    def get_positions(self): return list(self.p.values())
    def get_orders(self): return list(self.o.values())
    def get_funds(self): return FundSummary(self.cap, 0.0, self.cap)
    def cancel_order(self, oid): return True
    def modify_order(self, oid, p, q): return True
    def get_ohlcv(self, s, i, f="", t=""):
        from vega.backend.data.fetcher import fetcher
        return fetcher.get_ohlcv(s, i)
    def subscribe_live_feed(self, s, c): pass
