import React, { useState, useEffect } from 'react';
import useVegaStore from '../store/useVegaStore';
import { Search, Filter, Activity, Zap } from 'lucide-react';
import axios from 'axios';

const Scanner = () => {
  const { signals } = useVegaStore();
  const [dbSignals, setDbSignals] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [minConf, setMinConf] = useState(65);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await axios.get('/api/signals');
        setDbSignals(res.data);
      } catch (e) { console.error(e); }
    };
    fetchSignals();
  }, []);

  const allSignals = [...signals, ...dbSignals].filter((s, i, self) =>
    i === self.findIndex((t) => t.symbol === s.symbol && t.strategy_name === s.strategy_name)
  );

  const filtered = allSignals.filter(s => {
    const matchType = filterType === 'all' || s.strategy_name.toLowerCase().includes(filterType);
    const matchConf = s.ict_score >= minConf;
    return matchType && matchConf;
  });

  return (
    <div className="pt-24 px-10 h-screen flex flex-col pb-10">
      <div className="flex justify-between items-end mb-10">
        <div>
           <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Quantum Grid</h2>
           <p className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.4em]">Multi-Timeframe Signal Matrix</p>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[8px] font-black text-primary/30 uppercase tracking-widest ml-2">Min ICT Score</label>
            <input
              type="range" min="0" max="100" value={minConf} onChange={e => setMinConf(parseInt(e.target.value))}
              className="accent-secondary w-32 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[8px] font-black text-primary/30 uppercase tracking-widest ml-2">Engine Type</label>
            <select
              value={filterType} onChange={e => setFilterType(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-secondary outline-none"
            >
              <option value="all">ALL STRATEGIES</option>
              <option value="ema">TREND (EMA)</option>
              <option value="rsi">REVERSION (RSI)</option>
              <option value="breakout">BREAKOUT</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white/5 sticky top-0 z-10 border-b border-white/5 backdrop-blur-md">
              <tr>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-primary/20">Protocol / Asset</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-primary/20">Signal Side</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-primary/20">ICT Score</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-primary/20">Parameters</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-primary/20">Last Pulse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((s, i) => (
                <tr key={i} className="hover:bg-white/[0.03] transition-all group">
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-white group-hover:text-secondary transition-colors">{s.symbol}</span>
                      <span className="text-[9px] text-primary/30 uppercase font-bold tracking-tighter">{s.strategy_name}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${s.side === 'BUY' ? 'bg-success/10 border-success/20 text-success' : 'bg-danger/10 border-danger/20 text-danger'}`}>
                      {s.side}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${s.ict_score}%` }} className="h-full bg-secondary shadow-[0_0_10px_#F5C518]" />
                      </div>
                      <span className="text-xs font-mono font-black text-secondary">{s.ict_score}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex gap-4 font-mono text-[10px] text-primary/40">
                       <span title="Entry">E: {s.entry}</span>
                       <span title="Stop Loss" className="text-danger/40">S: {s.sl}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2">
                       <Activity size={10} className="text-success animate-pulse" />
                       <span className="text-[10px] font-mono text-primary/20 tracking-tighter">10:45:00.245</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan="5" className="p-20 text-center text-[10px] font-black uppercase text-primary/10 tracking-[0.5em]">Searching Multi-Dimensional Universe...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
