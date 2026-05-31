import asyncio
from typing import List, Dict
from backend.data.fetcher import fetcher
from backend.strategies.confirmation_model import ICTConfirmationModel

class Scanner:
    def __init__(self):
        self.ict_model = ICTConfirmationModel()

    async def scan_symbol(self, symbol: str, strategies: List) -> List[Dict]:
        timeframes = ["1m", "5m", "15m", "1h", "1d"]
        df_map = {}
        for tf in timeframes:
            df = fetcher.get_ohlcv(symbol, tf)
            if df.empty: return []
            df_map[tf] = df

        signals = []
        for st in strategies:
            if not st.enabled: continue
            df_st = df_map.get(st.timeframe, df_map["5m"])
            sig = st.generate_signal(df_st)
            if sig and sig.get('side'):
                ict = self.ict_model.score(df_map["1m"], df_map["5m"], df_map["15m"], df_map["1h"], df_map["1d"], sig['side'])
                if ict['passed']:
                    sig.update({'symbol': symbol, 'strategy_name': st.name, 'ict_score': ict['score'], 'ict_breakdown': ict['breakdown']})
                    signals.append(sig)
        return signals

    async def scan_all(self, symbols: List[str], strategies: List) -> List[Dict]:
        tasks = [self.scan_symbol(s, strategies) for s in symbols]
        results = await asyncio.gather(*tasks)
        all_sig = [s for r in results for s in r]
        all_sig.sort(key=lambda x: x.get('ict_score', 0), reverse=True)
        return all_sig
