import pytest
from vega.backend.engine.risk_manager import RiskManager
from vega.backend.config import settings

def test_kelly_sizing():
    rm = RiskManager()
    qty = rm.calculate_position_size(100, 95, method="kelly", wr=0.8, aw=2, al=1)
    # 100000 * 0.25 / 100 = 250
    assert qty == 250

def test_rr_ratio_rejection():
    rm = RiskManager()
    signal = {'entry': 100, 'sl': 98, 'tp': 101}
    valid, reason = rm.validate_trade(signal, 0, 0)
    assert not valid
    assert "Low RR" in reason

def test_circuit_breakers():
    rm = RiskManager()
    signal = {'entry': 100, 'sl': 95, 'tp': 110}
    v, r = rm.validate_trade(signal, 0, settings.MAX_OPEN_POSITIONS)
    assert not v
    assert "Max positions" in r
    v, r = rm.validate_trade(signal, -settings.TOTAL_CAPITAL * 0.04, 0)
    assert not v
    assert "Daily loss" in r
