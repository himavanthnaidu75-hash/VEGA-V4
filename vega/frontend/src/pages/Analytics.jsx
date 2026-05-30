import React, { useEffect, useRef, useState } from 'react';
import useVegaStore from '../store/useVegaStore';
import { createChart } from 'lightweight-charts';
import { Target, ShieldAlert, BarChart3, TrendingUp, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
  const chartContainerRef = useRef();
  const [stats, setStats] = useState({ win_rate: 0, avg_rr: 0, profit_factor: 0, max_drawdown: 0 });
  const [perfData, setPerfData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, p] = await Promise.all([axios.get('/api/stats'), axios.get('/api/performance')]);
        setStats(s.data);
        setPerfData(p.data);
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: 'transparent' }, textColor: '#F7F7F5' },
      grid: { vertLines: { visible: false }, horzLines: { color: 'rgba(255,255,255,0.02)' } },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });
    const line = chart.addLineSeries({ color: '#F5C518', lineWidth: 2 });
    line.setData(perfData);
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [perfData]);

  const cards = [
    { label: 'Win Rate', val: `${stats.win_rate}%`, icon: Target, color: 'text-success' },
    { label: 'Avg R:R', val: stats.avg_rr, icon: TrendingUp, color: 'text-secondary' },
    { label: 'Profit Factor', val: stats.profit_factor, icon: BarChart3, color: 'text-white' },
    { label: 'Max Drawdown', val: `-${stats.max_drawdown}%`, icon: ShieldAlert, color: 'text-danger' },
  ];

  return (
    <div className="pt-24 px-10 pb-10 space-y-10 h-screen overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-4 gap-8">
        {cards.map((c, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{c.label}</p>
              <c.icon size={14} className="text-primary/20" />
            </div>
            <p className={`text-2xl font-mono font-black ${c.color}`}>{c.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 bg-white/5 border border-white/10 rounded-[3rem] p-10 h-[400px] flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary/40 mb-8">Session Equity Growth</h3>
          <div ref={chartContainerRef} className="flex-1 w-full" />
        </div>
        <div className="col-span-4 bg-white/5 border border-white/10 rounded-[3rem] p-8 flex flex-col h-[400px]">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary/40 mb-8">Market Activity Heatmap</h3>
          <div className="flex-1 grid grid-cols-6 gap-2">
            {Array.from({length: 24}).map((_, i) => (
              <div key={i} className={`rounded-md ${i % 3 === 0 ? 'bg-success/20' : i % 4 === 0 ? 'bg-danger/20' : 'bg-white/5'}`} title={`Hour ${i}`} />
            ))}
          </div>
          <div className="mt-6 flex justify-between text-[8px] font-black text-primary/20 uppercase tracking-widest">
             <span>09:15</span>
             <span>15:30</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
        <h3 className="text-xs font-black uppercase tracking-widest text-primary/40 mb-8 text-center">Strategy Breakdown</h3>
        <table className="w-full text-left">
           <thead>
             <tr className="border-b border-white/5">
                <th className="pb-6 text-[10px] font-black uppercase text-primary/20">Strategy</th>
                <th className="pb-6 text-[10px] font-black uppercase text-primary/20">Signals</th>
                <th className="pb-6 text-[10px] font-black uppercase text-primary/20">Win Rate</th>
                <th className="pb-6 text-[10px] font-black uppercase text-primary/20">Total P&L</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
             {['Supertrend', 'EMA Cross', 'RSI Rev'].map(s => (
               <tr key={s} className="group">
                 <td className="py-6 text-sm font-bold text-white group-hover:text-secondary transition-colors">{s}</td>
                 <td className="py-6 font-mono text-xs text-primary/60">42</td>
                 <td className="py-6 font-mono text-xs text-success font-bold">68%</td>
                 <td className="py-6 font-mono text-xs text-success font-bold">+₹14,200</td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
