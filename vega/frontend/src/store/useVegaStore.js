import { create } from 'zustand';

const useVegaStore = create((set) => ({
  status: 'PAUSED',
  pnl: 0,
  pnlPct: 0,
  positions: [],
  signals: [],
  logs: [],
  setStatus: (status) => set({ status }),
  setPnl: (pnl, pnlPct) => set({ pnl, pnlPct }),
  setPositions: (positions) => set({ positions }),
  addSignal: (signal) => set((state) => ({ signals: [signal, ...state.signals].slice(0, 50) })),
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 100) })),
}));

export default useVegaStore;
