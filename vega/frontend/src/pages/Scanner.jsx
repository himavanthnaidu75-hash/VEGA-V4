import React from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Scanner = () => {
  return (
    <div className="pt-24 px-8 h-screen flex flex-col pb-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Quantum Scanner</h2>
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
            <Search size={14} className="text-primary/30" />
            <input placeholder="Search Symbol..." className="bg-transparent text-xs font-bold outline-none w-48" />
          </div>
          <button className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-primary/30">Asset</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-primary/30">HTF Bias</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-primary/30">Active Strats</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-primary/30">ICT Score</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-primary/30">Last Pulse</th>
              <th className="p-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 overflow-y-auto">
            {['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'ADANIENT'].map((s, i) => (
              <tr key={s} className="hover:bg-white/5 transition-all group">
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="font-black text-sm text-white group-hover:text-secondary transition-colors">{s}</span>
                    <span className="text-[9px] text-primary/20 uppercase font-bold">NSE Equity</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className={`flex items-center gap-2 text-xs font-black ${i % 2 === 0 ? 'text-success' : 'text-danger'}`}>
                    {i % 2 === 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {i % 2 === 0 ? 'BULLISH' : 'BEARISH'}
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono font-bold text-primary/60">12 Enabled</span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: `${85 - i*8}%` }}></div>
                    </div>
                    <span className="text-xs font-mono font-black text-secondary">{85 - i*8}%</span>
                  </div>
                </td>
                <td className="p-6 text-[10px] font-mono text-primary/30 uppercase">12:45:00</td>
                <td className="p-6 text-right">
                  <button className="text-[9px] font-black uppercase tracking-widest text-primary/30 hover:text-white transition-colors">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scanner;
