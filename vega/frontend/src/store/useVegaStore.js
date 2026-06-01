import { create } from 'zustand';

const useVegaStore = create((set) => ({
  status: 'DISCONNECTED',
  pnl: 0,
  pnlPct: 0,
  positions: [],
  signals: [],
  tickers: {},
  isKilled: false,

  setStatus: (status) => set({ status }),
  setPnl: (pnl, pnlPct) => set({ pnl, pnlPct }),
  setPositions: (positions) => set({ positions }),
  setSignals: (signals) => set({ signals }),

  addSignal: (signal) => set((state) => ({
    signals: [signal, ...state.signals].slice(0, 50)
  })),

  updateTickers: (tickerData) => set((state) => ({
    tickers: { ...state.tickers, ...tickerData }
  })),

  setKilled: (val) => set((state) => ({
    isKilled: val,
    status: val ? 'KILLED' : state.status
  })),
}));

export default useVegaStore;
