import pytest
from backend.engine.risk_manager import RiskManager
from backend.utils.indicators import kelly_fraction

def test_calculate_position_size_atr():
    rm = RiskManager()
    qty = rm.calculate_position_size(100.0, 90.0, method='atr')
    assert qty >= 1

def test_calculate_position_size_fixed():
    rm = RiskManager()
    qty = rm.calculate_position_size(100.0, 95.0, method='fixed')
    assert qty >= 1

def test_kelly_fraction():
    f = kelly_fraction(0.6, 2.0, 1.0)
    assert 0.0 <= f <= 0.25
