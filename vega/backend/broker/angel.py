from vega.backend.broker.base import BrokerInterface, OrderResult, Position, Order, FundSummary
class AngelBroker(BrokerInterface):
    def connect(self): return False
    def test_connection(self): return {"connected": False}
    def get_positions(self): return []
    def get_orders(self): return []
    def get_funds(self): return FundSummary(0,0,0)
    def place_order(self, *a, **kw): raise NotImplementedError("Angel One not fully implemented — use paper or dhan")
    def cancel_order(self, oid): return False
    def modify_order(self, oid, p, q): return False
    def get_live_price(self, s): return 100.0
    def get_ohlcv(self, s, i, f="", t=""): return None
    def subscribe_live_feed(self, s, c): pass
