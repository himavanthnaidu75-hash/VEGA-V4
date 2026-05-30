import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Filter, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import useVegaStore from '../store/useVegaStore';

const Scanner = () => {
  const [signals, setSignals] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [minScore, setMinScore] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });

  const liveSignals = useVegaStore((state) => state.signals);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const { data } = await axios.get('/api/signals');
        setSignals(data);
      } catch (e) {
        console.error('Failed to fetch signals', e);
      }
    };
    fetchSignals();
  }, []);

  // Merge live signals into list
  const mergedSignals = useMemo(() => {
    const combined = [...liveSignals, ...signals];
    // Remove duplicates based on symbol + strategy
    const unique = [];
    const seen = new Set();
    for (const s of combined) {
      const id = `${s.symbol}-${s.strategy}`;
      if (!seen.has(id)) {
        unique.push(s);
        seen.add(id);
      }
    }
    return unique;
  }, [liveSignals, signals]);

  const filteredSignals = useMemo(() => {
    return mergedSignals
      .filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()))
      .filter(s => typeFilter === 'ALL' || s.strategy_type === typeFilter)
      .filter(s => s.score >= minScore)
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [mergedSignals, search, typeFilter, minScore, sortConfig]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-8">
        {/* Header & Filter Bar */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black font-syne italic text-text mb-2 uppercase tracking-tight">Institutional Scanner</h1>
              <p className="text-[11px] font-black text-text-dim uppercase tracking-[0.3em]">Cross-Referencing 169+ Quantitative Nodes</p>
            </div>
            <div className="flex items-center gap-4 bg-surface/50 border border-border p-2 rounded-xl">
               <div className="flex items-center gap-2 px-4 py-2 border-r border-border">
                  <Clock size={14} className="text-primary" />
                  <span className="text-[10px] font-mono font-bold text-text-dim">NEXT CYCLE: 42s</span>
               </div>
               <div className="px-4">
                  <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">Active nodes: 169</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface p-4 rounded-2xl border border-border">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search symbol..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-bg/50 border border-border rounded-xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:border-primary/40 transition-all placeholder:text-text-faint"
              />
            </div>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-bg/50 border border-border rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-primary/40 text-text appearance-none cursor-pointer"
            >
              <option value="ALL">All Strategy Types</option>
              <option value="TREND">Trend Following</option>
              <option value="REVERSION">Mean Reversion</option>
              <option value="BREAKOUT">Breakout</option>
              <option value="QUANT">Quantitative</option>
            </select>

            <div className="md:col-span-2 flex items-center gap-6 px-4">
              <span className="text-[9px] font-black text-text-dim uppercase tracking-widest whitespace-nowrap">Min ICT Score: {minScore}</span>
              <input
                type="range"
                min="0" max="100"
                value={minScore}
                onChange={e => setMinScore(parseInt(e.target.value))}
                className="flex-1 accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg/20 border-b border-border text-[9px] font-black text-text-faint uppercase tracking-widest">
                <th className="px-8 py-5 cursor-pointer hover:text-text transition-colors" onClick={() => requestSort('symbol')}>Symbol</th>
                <th className="px-8 py-5">HTF Bias</th>
                <th className="px-8 py-5 cursor-pointer hover:text-text" onClick={() => requestSort('active_strategies')}>Nodes Active</th>
                <th className="px-8 py-5">Best Signal</th>
                <th className="px-8 py-5 cursor-pointer hover:text-text" onClick={() => requestSort('score')}>ICT Confidence</th>
                <th className="px-8 py-5 text-right">Last Scan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredSignals.map((s, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group cursor-default">
                  <td className="px-8 py-6">
                    <div className="text-[14px] font-black font-syne text-text italic uppercase tracking-tight">{s.symbol}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-2 ${s.htf_bias === 'BULLISH' ? 'text-success' : 'text-danger'}`}>
                       {s.htf_bias === 'BULLISH' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                       <span className="text-[10px] font-black uppercase tracking-widest">{s.htf_bias || 'NEUTRAL'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-bg/50 border border-border px-3 py-1 rounded-lg text-[10px] font-mono font-bold text-primary">
                      {s.active_strategies || 1}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase ${s.side === 'BUY' ? 'text-success' : 'text-danger'}`}>
                      {s.side} @ {s.price?.toFixed(2) || '---'}
                    </span>
                  </td>
                  <td className="px-8 py-6 w-[240px]">
                    <div className="flex flex-col gap-2">
                       <div className="flex justify-between items-end">
                         <span className="text-lg font-mono font-black text-primary leading-none">{s.score}</span>
                         <span className="text-[8px] font-black text-text-faint uppercase">Confidence</span>
                       </div>
                       <div className="h-1.5 bg-bg/50 rounded-full overflow-hidden border border-border/50">
                         <div
                           className="h-full bg-primary shadow-[0_0_12px_rgba(245,197,24,0.4)] transition-all duration-1000"
                           style={{ width: `${s.score}%` }}
                         />
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-[10px] font-mono font-bold text-text-dim italic">
                      {s.timestamp ? new Date(s.timestamp).toLocaleTimeString() : 'JUST NOW'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredSignals.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-40 text-center">
                    <p className="text-[10px] font-black text-text-faint uppercase tracking-[0.5em] italic">No Nodes Detected in Current Filter Plane</p>
                  </td>
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
