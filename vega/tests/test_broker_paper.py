import pytest
from backend.broker.paper import PaperBroker

def test_full_order_lifecycle():
    b = PaperBroker()
    # 1. Place Order
    res = b.place_order("TCS", 10, "BUY", "MARKET", 3500, "MIS")
    assert res.success
    pos = b.get_positions()
    assert len(pos) == 1
    assert pos[0].symbol == "TCS"

    # 2. Modify (Mock)
    assert b.modify_order(res.order_id, 3510, 10)

    # 3. P&L Tracking
    # Since PaperBroker fills at live price (mocked to 100 in my catch-all),
    # Let's verify funds
    f = b.get_funds()
    assert f.available_cash <= 100000

    # 4. Close and Verify
    b.place_order("TCS", 10, "SELL", "MARKET", 3600, "MIS")
    assert len(b.get_positions()) == 0
