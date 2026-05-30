import React, { useEffect, useRef } from 'react';
import useVegaStore from '../store/useVegaStore';
import { createChart } from 'lightweight-charts';
import { Activity, Briefcase, Zap, ShieldAlert } from 'lucide-react';
import SignalCard from '../components/SignalCard';

const Dashboard = () => {
  const { pnl, positions, signals } = useVegaStore();
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: 'transparent' }, textColor: '#F7F7F5' },
      grid: { vertLines: { visible: false }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });
    const lineSeries = chart.addLineSeries({ color: '#F5C518', lineWidth: 2 });
    // Mock data for equity curve based on PnL
    lineSeries.setData([
      { time: '2024-01-01', value: 100000 },
      { time: '2024-01-02', value: 102000 },
      { time: '2024-01-03', value: 101500 },
      { time: '2024-01-04', value: 100000 + pnl },
    ]);
    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [pnl]);

  const stats = [
    { label: 'Session P&L', val: `₹${pnl.toLocaleString()}`, color: pnl >= 0 ? 'text-success' : 'text-danger', icon: Activity },
    { label: 'Exposure', val: positions.length, color: 'text-secondary', icon: Briefcase },
    { label: 'Signals', val: signals.length, color: 'text-white', icon: Zap },
    { label: 'Risk', val: 'NOMINAL', color: 'text-success', icon: ShieldAlert },
  ];

  return (
    <div className="pt-24 px-8 pb-10 space-y-8 h-screen overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-primary/30">{s.label}</p>
              <s.icon size={12} className="text-primary/20" />
            </div>
            <p className={`text-2xl font-mono font-black ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 h-[400px]">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-6">Equity Growth Projection</h3>
           <div ref={chartContainerRef} className="w-full h-full" />
        </div>
        <div className="col-span-4 bg-white/5 border border-white/10 rounded-[2rem] p-6 h-[400px] flex flex-col">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-4">Live Signals</h3>
           <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
             {signals.slice(0, 5).map((s, i) => <SignalCard key={i} sig={s} />)}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
