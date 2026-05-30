import { create } from 'zustand';

const useVegaStore = create((set) => ({
  status: 'PAUSED',
  pnl: 0,
  pnlPct: 0,
  positions: [],
  signals: [],
  tickers: {},
  logs: [],
  killToken: localStorage.getItem('vega_kill_token') || '',

  setStatus: (status) => set({ status }),
  setPnl: (pnl, pnlPct) => set({ pnl, pnlPct }),
  setPositions: (positions) => set({ positions }),
  addSignal: (signal) => set((state) => ({ signals: [signal, ...state.signals].slice(0, 50) })),
  updateTicker: (symbol, price) => set((state) => ({
    tickers: { ...state.tickers, [symbol]: price }
  })),
  setKillToken: (token) => {
    localStorage.setItem('vega_kill_token', token);
    set({ killToken: token });
  },
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 100) })),
}));

export default useVegaStore;
