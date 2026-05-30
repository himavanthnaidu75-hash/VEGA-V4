import yfinance as yf
import pandas as pd
from datetime import datetime
from vega.backend.utils.logger import logger

class DataFetcher:
    def __init__(self):
        self.cache = {}

    def get_ohlcv(self, symbol: str, interval: str = "5m", period: str = "5d") -> pd.DataFrame:
        key = f"{symbol}_{interval}"
        if key in self.cache:
            if (datetime.now() - self.cache[key]['t']).total_seconds() < 60:
                return self.cache[key]['d']

        yf_sym = f"{symbol}.NS" if not symbol.endswith(".NS") else symbol
        try:
            df = yf.download(yf_sym, period=period, interval=interval, progress=False)
            if not df.empty:
                df = df[['Open', 'High', 'Low', 'Close', 'Volume']]
                self.cache[key] = {'t': datetime.now(), 'd': df}
                return df
        except Exception as e:
            logger.error(f"Fetch error for {symbol}: {e}")
        return pd.DataFrame()

fetcher = DataFetcher()
