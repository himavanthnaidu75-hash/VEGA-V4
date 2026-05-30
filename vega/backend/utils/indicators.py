import numpy as np
import pandas as pd
from scipy import stats
from scipy.optimize import brentq
from typing import Tuple, Optional, Dict

def ema(s, p): return s.ewm(span=p, adjust=False).mean()
def sma(s, p): return s.rolling(p).mean()
def wma(s, p):
    weights = np.arange(1, p + 1)
    return s.rolling(p).apply(lambda x: np.dot(x, weights)/weights.sum(), raw=True)
def hma(s, p):
    h = wma(s, p//2); f = wma(s, p)
    return wma(2*h-f, int(np.sqrt(p)))
def atr(h, l, c, p=14):
    tr = pd.concat([h-l, (h-c.shift(1)).abs(), (l-c.shift(1)).abs()], axis=1).max(axis=1)
    return tr.ewm(span=p, adjust=False).mean()
def supertrend(h, l, c, p=10, m=3.0):
    at = atr(h, l, c, p)
    hl2 = (h+l)/2
    ub = hl2+m*at
    lb = hl2-m*at
    st = np.zeros(len(c))
    dr = np.ones(len(c), dtype=int)
    cl = c.values
    ubv, lbv = ub.values, lb.values
    for i in range(1, len(c)):
        if cl[i]>ubv[i-1]: dr[i]=1
        elif cl[i]<lbv[i-1]: dr[i]=-1
        else: dr[i]=dr[i-1]
        st[i] = lbv[i] if dr[i]==1 else ubv[i]
    return pd.Series(st, index=c.index), pd.Series(dr, index=c.index)
def adx(h, l, c, p=14):
    tr = pd.concat([h-l, (h-c.shift(1)).abs(), (l-c.shift(1)).abs()], axis=1).max(axis=1)
    pdm = h.diff().where((h.diff()>-l.diff())&(h.diff()>0), 0.0)
    mdm = (-l.diff()).where((-l.diff()>h.diff())&(-l.diff()>0), 0.0)
    as_ = tr.ewm(span=p, adjust=False).mean()
    pdi = 100*pdm.ewm(span=p, adjust=False).mean()/as_
    mdi = 100*mdm.ewm(span=p, adjust=False).mean()/as_
    dx = 100*(pdi-mdi).abs()/(pdi+mdi).replace(0, np.nan)
    return dx.ewm(span=p, adjust=False).mean(), pdi, mdi
def macd(s, f=12, sl=26, si=9):
    fe, se = ema(s, f), ema(s, sl)
    ml = fe-se
    sli = ema(ml, si)
    return ml, sli, ml-sli
def rsi(s, p=14):
    d = s.diff()
    g = d.where(d>0, 0.0).ewm(span=p, adjust=False).mean()
    l_ = (-d.where(d<0, 0.0)).ewm(span=p, adjust=False).mean()
    rs = g/l_
    res = 100-(100/(1+rs))
    res[(l_==0)&(g>0)]=100.0
    res[(l_==0)&(g==0)]=50.0
    return res
def vwap_bands(h, l, c, v, m=2.0):
    tp = (h+l+c)/3
    vw = (tp*v).cumsum()/v.cumsum()
    var = ((tp-vw)**2*v).cumsum()/v.cumsum()
    std = np.sqrt(var)
    return vw+m*std, vw, vw-m*std
def bollinger_bands(s, p=20, d=2.0):
    m = sma(s, p); st = s.rolling(p).std()
    return m+d*st, m, m-d*st
def bb_squeeze(h, l, c, bp=20, kp=20):
    bu, _, bl = bollinger_bands(c, bp); ku = ema(c, kp)+1.5*atr(h,l,c,kp); kl = ema(c, kp)-1.5*atr(h,l,c,kp)
    return (bu<ku)&(bl>kl)
def zscore(s, p=20): return (s-s.rolling(p).mean())/s.rolling(p).std().replace(0, np.nan)
def linear_regression_channel(s, p=50):
    x = np.arange(p)
    m, u, l = [pd.Series(index=s.index, dtype=float) for _ in range(3)]
    for i in range(p-1, len(s)):
        y = s.iloc[i-p+1:i+1].values
        sl, ic, _, _, _ = stats.linregress(x, y)
        ft = sl*x+ic
        sd = (y-ft).std()
        m.iloc[i], u.iloc[i], l.iloc[i] = ft[-1], ft[-1]+2*sd, ft[-1]-2*sd
    return u, m, l
def hurst_exponent(s, minl=2, maxl=100):
    ts = s.dropna().values
    n = len(ts)
    if n<maxl: maxl=n//2
    lags = range(minl, maxl)
    rs = []
    for lag in lags:
        segs = n//lag
        rl = []
        for sn in range(segs):
            seg = ts[sn*lag:(sn+1)*lag]
            dev = np.cumsum(seg-seg.mean())
            r = dev.max()-dev.min()
            sd = seg.std()
            if sd>0: rl.append(r/sd)
        if rl: rs.append(np.mean(rl))
    if len(rs)<2: return 0.5
    sl, _, _, _, _ = stats.linregress(np.log(list(lags)[:len(rs)]), np.log(rs))
    return sl
def kalman_filter(s, pv=1e-4, mv=1e-2):
    fl = np.zeros(len(s))
    xe, pe = s.iloc[0], 1.0
    for i, m in enumerate(s):
        pp = pe+pv
        k = pp/(pp+mv)
        xe = xe+k*(m-xe)
        pe = (1-k)*pp
        fl[i] = xe
    return pd.Series(fl, index=s.index)
def bs_call_price(S, K, T, r, sigma):
    from scipy.stats import norm
    if T<=0: return max(S-K, 0.0)
    d1 = (np.log(S/K)+(r+0.5*sigma**2)*T)/(sigma*np.sqrt(T))
    d2 = d1-sigma*np.sqrt(T)
    return S*norm.cdf(d1)-K*np.exp(-r*T)*norm.cdf(d2)
def bs_put_price(S, K, T, r, sigma):
    from scipy.stats import norm
    if T<=0: return max(K-S, 0.0)
    d1 = (np.log(S/K)+(r+0.5*sigma**2)*T)/(sigma*np.sqrt(T))
    d2 = d1-sigma*np.sqrt(T)
    return K*np.exp(-r*T)*norm.cdf(-d2)-S*norm.cdf(-d1)
def bs_delta(S, K, T, r, sigma, opt="call"):
    from scipy.stats import norm
    d1 = (np.log(S/K)+(r+0.5*sigma**2)*T)/(sigma*np.sqrt(T))
    return norm.cdf(d1) if opt=="call" else norm.cdf(d1)-1
def bs_gamma(S, K, T, r, sigma):
    from scipy.stats import norm
    d1 = (np.log(S/K)+(r+0.5*sigma**2)*T)/(sigma*np.sqrt(T))
    return norm.pdf(d1)/(S*sigma*np.sqrt(T))
def bs_theta(S, K, T, r, sigma, opt="call"):
    from scipy.stats import norm
    d1 = (np.log(S/K)+(r+0.5*sigma**2)*T)/(sigma*np.sqrt(T))
    d2 = d1-sigma*np.sqrt(T)
    t1 = -(S*norm.pdf(d1)*sigma)/(2*np.sqrt(T))
    if opt=="call": return (t1-r*K*np.exp(-r*T)*norm.cdf(d2))/365
    return (t1+r*K*np.exp(-r*T)*norm.cdf(-d2))/365
def bs_vega(S, K, T, r, sigma):
    from scipy.stats import norm
    d1 = (np.log(S/K)+(r+0.5*sigma**2)*T)/(sigma*np.sqrt(T))
    return S*norm.pdf(d1)*np.sqrt(T)*0.01
def implied_volatility(price, S, K, T, r, opt="call"):
    try:
        f = lambda s: (bs_call_price(S,K,T,r,s) if opt=="call" else bs_put_price(S,K,T,r,s))-price
        return brentq(f, 1e-6, 10.0)
    except: return 0.0
def iv_rank(curr, hist):
    mn, mx = hist.min(), hist.max()
    return (curr-mn)/(mx-mn)*100 if mx!=mn else 50.0
def find_swing_highs(h, lb=5):
    res = pd.Series(False, index=h.index)
    for i in range(lb, len(h)-lb):
        if h.iloc[i]>h.iloc[i-lb:i].max() and h.iloc[i]>h.iloc[i+1:i+lb+1].max(): res.iloc[i]=True
    return res
def find_swing_lows(l, lb=5):
    res = pd.Series(False, index=l.index)
    for i in range(lb, len(l)-lb):
        if l.iloc[i]<l.iloc[i-lb:i].min() and l.iloc[i]<l.iloc[i+1:i+lb+1].min(): res.iloc[i]=True
    return res
def find_fvg(h, l, c):
    f = []
    for i in range(2, len(c)):
        if l.iloc[i]>h.iloc[i-2]: f.append({'index':i,'type':'bull','top':l.iloc[i],'bottom':h.iloc[i-2]})
        elif h.iloc[i]<l.iloc[i-2]: f.append({'index':i,'type':'bear','top':h.iloc[i-2],'bottom':l.iloc[i]})
    return pd.DataFrame(f) if f else pd.DataFrame(columns=['index','type','top','bottom'])
def find_order_blocks(o, h, l, c):
    ob = []
    for i in range(1, len(c)-3):
        if abs(c.iloc[i]-o.iloc[i])>abs(c-o).rolling(20).mean().iloc[i]*1.5:
            ob.append({'index':i,'type':'bullish_ob' if c.iloc[i]<o.iloc[i] else 'bearish_ob','top':h.iloc[i],'bottom':l.iloc[i]})
    return pd.DataFrame(ob) if ob else pd.DataFrame(columns=['index','type','top','bottom'])
def liquidity_sweep(h, l, c, lb=5):
    sh, sl = find_swing_highs(h, lb), find_swing_lows(l, lb)
    rs = pd.Series(None, index=c.index, dtype=object)
    for i in range(lb+1, len(c)):
        ph, pl = h[sh].iloc[:i], l[sl].iloc[:i]
        if len(ph)>0 and h.iloc[i]>ph.iloc[-1] and c.iloc[i]<ph.iloc[-1]: rs.iloc[i]='bear_sweep'
        if len(pl)>0 and l.iloc[i]<pl.iloc[-1] and c.iloc[i]>pl.iloc[-1]: rs.iloc[i]='bull_sweep'
    return rs
def classic_pivots(h, l, c):
    pp = (h+l+c)/3
    return {'PP':pp,'R1':2*pp-l,'S1':2*pp-h,'R2':pp+h-l,'S2':pp-(h-l)}
def kelly_fraction(wr, aw, al):
    if al==0: return 0.0
    b = aw/al
    return max(0.0, min((wr*b-(1-wr))/b, 0.25))
def price_momentum_return(P, T, S): return (P.shift(S)/P.shift(S+T))-1
def price_momentum_vol(R, T, S): return R.shift(S).rolling(window=T).std()
def sue_score(E, E0, s): return (E-E0)/s if s>0 else 0.0
def value_bp_ratio(B, P): return B/P
def fractal_dimension(s, p=20):
    def _hfd(x):
        n=len(x)
        if n<4: return 1.5
        km=n//2; lk=[]
        for k in range(1,km+1):
            lm=[]
            for m in range(k):
                st=(n-m-1)//k
                if st<1: continue
                sd=np.abs(np.diff(x[m::k])).sum(); nm=(n-1)/(st*k); lm.append(sd*nm/k)
            if lm: lk.append(np.mean(lm))
        if len(lk)<2: return 1.5
        sl, _, _, _, _ = stats.linregress(np.log(1/np.arange(1,len(lk)+1)), np.log(lk)); return sl
    return s.rolling(window=p).apply(_hfd)
def commodity_selection_index(h, l, c, av, at, p=14, k=1.0): return (at/c.replace(0, np.nan))*av*np.sqrt(p)*k
def volume_profile_poc(c, v, b=50):
    h, e = np.histogram(c, bins=b, weights=v)
    return (e[np.argmax(h)]+e[np.argmax(h)+1])/2
