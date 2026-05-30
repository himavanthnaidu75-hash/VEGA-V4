import React, { useEffect, useRef, useState } from 'react';
import useVegaStore from '../store/useVegaStore';
import { createChart } from 'lightweight-charts';
import { Activity, Briefcase, Zap, ShieldAlert, TrendingUp } from 'lucide-react';
import api from '../api';
import SignalCard from '../components/SignalCard';

const Dashboard = () => {
  const { pnl, positions, signals } = useVegaStore();
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const [perfData, setPerfData] = useState([]);

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        const res = await api.get('/performance');
        setPerfData(res.data);
      } catch (e) {
        console.error("Performance sync failure", e);
      }
    };
    fetchPerf();
    const interval = setInterval(fetchPerf, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: { background: { color: 'transparent' }, textColor: '#F7F7F5' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.02)' }, horzLines: { color: 'rgba(255,255,255,0.02)' } },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
      width: chartContainerRef.current.clientWidth,
      height: 320,
    });

    const lineSeries = chartRef.current.addLineSeries({
      color: '#F5C518',
      lineWidth: 3,
      lineType: 2,
      priceLineVisible: false
    });

    if (perfData.length > 0) {
      lineSeries.setData(perfData);
    }

    chartRef.current.timeScale().fitContent();

    const handleResize = () => {
      if (chartRef.current) chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current.remove();
    };
  }, [perfData]);

  const stats = [
    { label: 'Session P&L', val: `₹${pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: pnl >= 0 ? 'text-success' : 'text-danger', icon: Activity },
    { label: 'Market Exposure', val: positions.length, color: 'text-secondary', icon: Briefcase },
    { label: 'System Pulses', val: signals.length, color: 'text-white', icon: Zap },
    { label: 'Uptime Status', val: 'NOMINAL', color: 'text-success', icon: ShieldAlert },
  ];

  return (
    <div className="pt-24 px-10 pb-10 space-y-10 h-screen overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.07] transition-all group">
            <div className="flex justify-between items-start mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/20 group-hover:text-primary/40 transition-colors">{s.label}</p>
              <s.icon size={14} className="text-primary/20 group-hover:text-secondary transition-colors" />
            </div>
            <p className={`text-3xl font-mono font-black tracking-tighter ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col shadow-2xl relative overflow-hidden">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary/30">Equity Matrix</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
                 <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-ping" />
                 <span className="text-[8px] font-black text-secondary uppercase tracking-tighter">Live Sync</span>
              </div>
           </div>
           <div ref={chartContainerRef} className="flex-1 w-full" />
        </div>

        <div className="col-span-4 bg-white/5 border border-white/10 rounded-[3rem] p-8 flex flex-col shadow-2xl overflow-hidden">
           <div className="flex items-center gap-3 mb-8">
              <TrendingUp size={16} className="text-primary/30" />
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary/30">Intelligence Feed</h3>
           </div>
           <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
             {signals.slice(0, 10).map((s, i) => <SignalCard key={i} sig={s} />)}
             {signals.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center opacity-10">
                 <Zap size={48} className="mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Scanning Grid...</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
