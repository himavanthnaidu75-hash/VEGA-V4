import pandas as pd
from vega.backend.utils.indicators import find_swing_highs, find_swing_lows, liquidity_sweep, find_fvg, find_order_blocks
class ICTConfirmationModel:
    def score(self, d1, d5, d15, d1h, dd, side):
        s = 0; b = {'ms':0,'ls':0,'fvg':0,'ob':0}
        sh = find_swing_highs(d15['High'])
        if side=="BUY" and len(d15[sh])>1:
            if d15[sh]['High'].iloc[-1]>d15[sh]['High'].iloc[-2]: b['ms']=25; s+=25
        ls = liquidity_sweep(d5['High'], d5['Low'], d5['Close'])
        if (side=="BUY" and (ls.iloc[-5:]=='bull_sweep').any()) or (side=="SELL" and (ls.iloc[-5:]=='bear_sweep').any()):
            b['ls']=25; s+=25
        if not find_fvg(d5['High'], d5['Low'], d5['Close']).empty: b['fvg']=25; s+=25
        if not find_order_blocks(d5['Open'], d5['High'], d5['Low'], d5['Close']).empty: b['ob']=25; s+=25
        return {'score':s, 'passed':s>=65, 'breakdown':b}
