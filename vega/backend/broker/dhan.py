from dhanhq import dhanhq
import pandas as pd
from typing import List, Dict
from vega.backend.broker.base import BrokerInterface, Position, Order, OrderResult, FundSummary
from vega.backend.config import settings
from vega.backend.utils.mapping import get_security_id

class DhanBroker(BrokerInterface):
    def __init__(self):
        self.dhan = dhanhq(settings.DHAN_CLIENT_ID, settings.DHAN_ACCESS_TOKEN)
    def connect(self):
        try: return self.dhan.get_profile().get('status') == 'success'
        except: return False
    def test_connection(self):
        import time; s = time.time()
        try:
            p = self.dhan.get_profile()
            if p.get('status') == 'success': return {"connected": True, "latency_ms": int((time.time()-s)*1000), "account_id": p['data']['client_id'], "message": "OK"}
        except: pass
        return {"connected": False, "latency_ms": 0, "account_id": "N/A", "message": "Fail"}
    def get_positions(self):
        r = self.dhan.get_positions()
        if r.get('status') == 'success':
            return [Position(p['tradingSymbol'], int(p['netQty']), "BUY" if int(p['netQty'])>0 else "SELL", float(p['avgPrice']), float(p['lastPrice']), float(p['realizedProfit'])+float(p['unrealizedProfit']), p['productType']) for p in r['data']]
        return []
    def get_orders(self):
        r = self.dhan.get_order_list()
        if r.get('status') == 'success':
            return [Order(o['orderId'], o['tradingSymbol'], int(o['quantity']), o['transactionType'], o['orderType'], float(o['price']), o['orderStatus'], int(o['filledQty'])) for o in r['data']]
        return []
    def get_funds(self):
        r = self.dhan.get_fund_limits()
        if r.get('status') == 'success':
            d = r['data']; return FundSummary(float(d['availabelBalance']), float(d['utilisedLimit']), float(d['equityAmount']))
        return FundSummary(0, 0, 0)
    def place_order(self, symbol, qty, side, order_type, price, product):
        try:
            sid = get_security_id(symbol)
            r = self.dhan.place_order(tag="VEGA", transaction_type=side, exchange_segment="NSE_EQ", product_type=product, order_type=order_type, validity="DAY", trading_symbol=symbol, security_id=sid, quantity=qty, price=price)
            if r.get('status') == 'success': return OrderResult(True, r['data']['orderId'], "OK")
            return OrderResult(False, "", r.get('remarks', 'Error'))
        except Exception as e: return OrderResult(False, "", str(e))
    def cancel_order(self, oid): return self.dhan.cancel_order(oid).get('status') == 'success'
    def modify_order(self, oid, p, q): return self.dhan.modify_order(oid, "LIMIT", q, p).get('status') == 'success'
    def get_live_price(self, s):
        import yfinance as yf
        return yf.Ticker(f"{s}.NS").fast_info['lastPrice']
    def get_ohlcv(self, s, i, f="", t=""):
        from vega.backend.data.fetcher import fetcher
        return fetcher.get_ohlcv(s, i)
    def subscribe_live_feed(self, s, c): pass
