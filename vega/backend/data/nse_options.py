import requests
import pandas as pd
import numpy as np
from typing import Dict
from backend.utils.logger import logger
from backend.utils.indicators import bs_call_price, bs_put_price

class NSEOptions:
    def __init__(self):
        self.session = requests.Session()
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "*/*",
            "Referer": "https://www.nseindia.com/option-chain"
        }
        self.cookies_initialized = False

    def _init_session(self):
        try:
            self.session.get("https://www.nseindia.com", headers=self.headers, timeout=10)
            self.cookies_initialized = True
        except:
            logger.error("Failed to initialize NSE session")

    def get_option_chain(self, symbol: str = "NIFTY") -> Dict:
        if not self.cookies_initialized: self._init_session()
        url = f"https://www.nseindia.com/api/option-chain-indices?symbol={symbol}"
        try:
            res = self.session.get(url, headers=self.headers, timeout=10)
            if res.status_code == 200: return {"source": "nse", "data": res.json()}
        except: pass
        return self.generate_synthetic(symbol)

    def generate_synthetic(self, symbol, spot=22000, iv=0.15):
        strikes = np.round(np.linspace(spot*0.9, spot*1.1, 21) / 50) * 50
        data = []
        for K in strikes:
            data.append({
                "strikePrice": K,
                "CE": {"lastPrice": bs_call_price(spot, K, 7/365, 0.07, iv), "impliedVolatility": iv*100},
                "PE": {"lastPrice": bs_put_price(spot, K, 7/365, 0.07, iv), "impliedVolatility": iv*100}
            })
        return {"source": "synthetic", "iv_estimate": iv, "data": {"records": {"data": data}}}

nse_options = NSEOptions()
