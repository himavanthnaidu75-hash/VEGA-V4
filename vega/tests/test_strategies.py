import pytest
import pandas as pd
import numpy as np
from backend.strategies.builtin.trend.ema_confluence import EMAConfluenceStrategy

def test_ema_confluence_signal():
    strat = EMAConfluenceStrategy()
    df = pd.DataFrame({
        'Open': np.linspace(100, 110, 250),
        'High': np.linspace(101, 111, 250),
        'Low': np.linspace(99, 109, 250),
        'Close': np.linspace(100, 110, 250),
        'Volume': np.random.rand(250)
    })
    sig = strat.generate_signal(df)
    # Signal might be None depending on random data, but call shouldn't crash
    assert sig is None or isinstance(sig, dict)
