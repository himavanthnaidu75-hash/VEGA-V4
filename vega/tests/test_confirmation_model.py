import pytest
import pandas as pd
import numpy as np
from backend.strategies.confirmation_model import ICTConfirmationModel

def test_ict_score_structure():
    model = ICTConfirmationModel()
    # Mock data with 60 rows to satisfy strategy requirements
    df = pd.DataFrame({
        'Open': np.random.rand(60),
        'High': np.random.rand(60),
        'Low': np.random.rand(60),
        'Close': np.random.rand(60),
        'Volume': np.random.rand(60)
    })
    res = model.score(df, df, df, df, df, 'BUY')
    assert 'score' in res
    assert 0 <= res['score'] <= 100
