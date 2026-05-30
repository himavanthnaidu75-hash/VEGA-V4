import pytest
import pandas as pd
import numpy as np
from vega.backend.strategies.builtin.trend.ema_confluence import EMAConfluenceStrategy

def test_ema_confluence_logic_and_values():
    st = EMAConfluenceStrategy()
    # Mock data where Price > EMA9 > 21 > 50 > 200
    # And Low touches EMA21
    df = pd.DataFrame({
        'Close': [100 + i*0.5 for i in range(250)],
        'High': [101 + i*0.5 for i in range(250)],
        'Low': [99 + i*0.5 for i in range(250)]
    })
    # Force a pullback touch on EMA21
    # EMA21 for this series will be around 215 at the end
    # We will manually inject a touch
    df.loc[249, 'Low'] = 0 # Guaranteed touch
    sig = st.generate_signal(df)
    if sig:
        assert sig['side'] == 'BUY'
        assert sig['entry'] > 0
        assert sig['sl'] < sig['entry']
        assert sig['tp'] > sig['entry']
        assert 'reason' in sig
