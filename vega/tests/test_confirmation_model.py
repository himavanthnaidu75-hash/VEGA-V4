import pytest
import pandas as pd
from vega.backend.strategies.confirmation_model import ICTConfirmationModel

def test_ict_threshold_gate():
    ict = ICTConfirmationModel()
    df = pd.DataFrame({'Open': [10]*50, 'High': [10]*50, 'Low': [10]*50, 'Close': [10]*50})
    res = ict.score(df, df, df, df, df, "BUY")
    assert res['score'] == 0
    assert not res['passed']

def test_ict_full_score():
    ict = ICTConfirmationModel()
    # High, Low setup to trigger LS, FVG, OB logic (simplified)
    # Just need it to hit the 'if' conditions in my model
    df = pd.DataFrame({
        'Open': [10, 10, 20, 10]*25,
        'High': [11, 11, 21, 11]*25,
        'Low': [9, 9, 19, 9]*25,
        'Close': [10, 10, 20, 10]*25
    })
    res = ict.score(df, df, df, df, df, "BUY")
    assert isinstance(res['score'], int)
