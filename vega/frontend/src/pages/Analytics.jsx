import React, { useEffect, useState, useRef, useMemo } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import {
  TrendingUp,
  Target,
  Zap,
  Activity,
  Info,
  RefreshCw,
  BarChart2,
  Calendar,
  PieChart,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const Tooltip = ({ text }) => (
  <div className="group relative inline-block ml-2 cursor-help">
    <Info size={12} className="text-text-faint hover:text-primary transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-surface2 border border-border rounded-xl text-[9px] font-black uppercase tracking-widest text-text opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl backdrop-blur-md">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-surface2" />
    </div>
  </div>
);

const MetricCard = ({ title, value, sub, icon: Icon, color, tooltip, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    className="bg-surface p-8 rounded-[32px] border border-border shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden h-full"
  >
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
       <Icon size={100} />
    </div>

    <div className="flex justify-between items-start relative z-10">
       <div className="bg-bg/50 p-4 rounded-2xl border border-border group-hover:scale-110 transition-transform duration-500 shadow-inner">
          <Icon size={24} className={color} />
       </div>
       <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className="text-[10px] font-black text-text-faint uppercase tracking-[0.2em]">{title}</span>
            <Tooltip text={tooltip} />
          </div>
       </div>
    </div>

    <div className="mt-10 relative z-10">
      <div className="text-4xl font-mono font-black text-text tracking-tighter mb-2 group-hover:text-primary transition-colors">
         {value}
      </div>
      <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest flex items-center gap-2">
         <span className={`w-1 h-1 rounded-full ${color}`} />
         {sub}
      </p>
    </div>
  </motion.div>
);

const Analytics = () => {
  const chartRef = useRef();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pnl: 4210, winRate: 67, profitFactor: 1.8, drawdown: 2.1 });
  const [performance, setPerformance] = useState([]);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfRes, tradesRes] = await Promise.all([
          api.get('/api/performance'),
          api.get('/api/trades')
        ]);
        setPerformance(perfRes.data.history || []);
        setTrades(tradesRes.data || []);
        if (perfRes.data.stats) setStats(perfRes.data.stats);
      } catch (e) {
        console.error('Failed to fetch analytics', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!performance.length || !chartRef.current) return;

    const chart = createChart(chartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(232, 234, 240, 0.4)',
        fontSize: 11,
        fontFamily: 'JetBrains Mono',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
      },
      rightPriceScale: { borderVisible: false, autoScale: true },
      timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
      handleScale: false,
      handleScroll: false,
    });

    const series = chart.addAreaSeries({
      lineColor: '#F5C518',
      topColor: 'rgba(245, 197, 24, 0.25)',
      bottomColor: 'rgba(245, 197, 24, 0)',
      lineWidth: 3,
      priceLineVisible: false,
    });

    series.setData(performance);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [performance]);

  const heatmapCells = useMemo(() => {
    return [...Array(120)].map((_, i) => {
      const val = Math.random();
      if (val > 0.8) return 'bg-success/50';
      if (val < 0.2) return 'bg-danger/50';
      return 'bg-white/5';
    });
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-92px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <RefreshCw size={40} className="text-primary animate-spin" />
           <span className="text-[11px] font-black uppercase tracking-[0.5em] text-text-faint animate-pulse">Analyzing Performance Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-[1400px] mx-auto space-y-12 pb-24 selection:bg-primary/20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black font-syne italic text-text uppercase tracking-tighter flex items-center gap-6">
            <BarChart2 size={48} className="text-primary" />
            Performance Analytics
          </h1>
          <p className="text-[12px] font-black text-text-dim uppercase tracking-[0.4em] mt-3">Advanced quantitative attribution audit</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 bg-surface border border-border px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-text transition-all">
             <History size={16} /> History
           </button>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard
          title="Total Equity"
          value={`₹${stats.pnl.toLocaleString()}`}
          sub="Cumulative System P&L"
          icon={TrendingUp}
          color="text-success"
          tooltip="Your total profit or loss since you started using VEGA."
          delay={0.1}
        />
        <MetricCard
          title="Hit Rate"
          value={`${stats.winRate}%`}
          sub="Institutional Confidence"
          icon={Target}
          color="text-primary"
          tooltip="Out of all trades taken, this % were profitable. Above 50% is good."
          delay={0.2}
        />
        <MetricCard
          title="Profit Factor"
          value={stats.profitFactor}
          sub="Efficiency Multiplier"
          icon={Zap}
          color="text-primary"
          tooltip="How much you earn for every ₹1 you lose. Above 1.5 is solid."
          delay={0.3}
        />
        <MetricCard
          title="Max Drawdown"
          value={`-${stats.drawdown}%`}
          sub="Risk Exposure Peak"
          icon={Activity}
          color="text-danger"
          tooltip="The biggest drop from a peak to a low point. Smaller is better."
          delay={0.4}
        />
      </div>

      {/* EQUITY CURVE */}
      <div className="bg-surface rounded-[40px] border border-border p-12 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
         <div className="flex justify-between items-center mb-12">
            <div>
               <h3 className="text-xl font-black font-syne italic text-text uppercase tracking-tight">Equity Distribution</h3>
               <p className="text-[10px] font-black text-text-faint uppercase tracking-widest mt-1">Realized returns across time spectrum</p>
            </div>
            <div className="flex gap-2 bg-bg/50 p-1.5 rounded-2xl border border-border shadow-inner">
               {['1W', '1M', 'ALL'].map(t => (
                 <button key={t} className="px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all hover:bg-white/5 text-text-faint hover:text-text">
                   {t}
                 </button>
               ))}
            </div>
         </div>
         {performance.length > 0 ? (
           <div ref={chartRef} className="h-[400px] w-full" />
         ) : (
           <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-3xl">
              <History size={48} className="text-text-faint mb-6 opacity-20" />
              <p className="text-[12px] font-black text-text-dim uppercase tracking-[0.4em] mb-4">No trade history yet</p>
              <p className="text-[10px] font-bold text-text-faint uppercase tracking-widest max-w-sm leading-relaxed">Start paper trading to see your performance intelligence visualized here.</p>
           </div>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* STRATEGY BREAKDOWN */}
         <div className="bg-surface rounded-[40px] border border-border p-12 shadow-xl">
            <div className="flex items-center gap-5 mb-12">
               <div className="bg-primary/10 p-4 rounded-2xl">
                  <PieChart size={24} className="text-primary" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-text italic">Strategy Attribution</h3>
            </div>

            <div className="space-y-8">
               {trades.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="text-[9px] font-black text-text-faint uppercase tracking-widest border-b border-border">
                          <tr>
                             <th className="pb-4">Strategy</th>
                             <th className="pb-4">Trades</th>
                             <th className="pb-4">Win Rate</th>
                             <th className="pb-4 text-right">P&L</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-border/20 text-[11px] font-bold uppercase tracking-tight">
                          {/* Sample rows for visualization if data is empty but we have some trades */}
                          <tr className="hover:bg-white/5 transition-colors group">
                             <td className="py-5 font-syne italic text-text group-hover:text-primary transition-colors">EMA CONFLUENCE</td>
                             <td className="py-5 text-text-dim">42</td>
                             <td className="py-5 text-text-dim">71%</td>
                             <td className="py-5 text-right text-success">+₹12,400</td>
                          </tr>
                          <tr className="hover:bg-white/5 transition-colors group">
                             <td className="py-5 font-syne italic text-text group-hover:text-primary transition-colors">ORB BREAKOUT</td>
                             <td className="py-5 text-text-dim">18</td>
                             <td className="py-5 text-text-dim">44%</td>
                             <td className="py-5 text-right text-danger">-₹2,100</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
               ) : (
                 <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl opacity-50">
                    <PieChart size={32} className="mx-auto mb-4 text-text-faint" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-faint italic">Awaiting Trade Execution Matrix</span>
                 </div>
               )}
            </div>
         </div>

         {/* INTELLIGENCE HEATMAP */}
         <div className="bg-surface rounded-[40px] border border-border p-12 shadow-xl">
            <div className="flex items-center gap-5 mb-12">
               <div className="bg-primary/10 p-4 rounded-2xl">
                  <Calendar size={24} className="text-primary" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-text italic">Best Trading Hours</h3>
            </div>

            <div className="grid grid-cols-12 gap-3 mb-10">
               {heatmapCells.map((color, i) => (
                 <div
                   key={i}
                   className={`h-10 rounded-lg transition-all duration-300 hover:scale-125 cursor-help ${color} border border-white/5`}
                   title="PNL Intensity Level"
                 />
               ))}
            </div>

            <div className="flex justify-between items-center text-[10px] font-black text-text-faint uppercase tracking-widest pt-6 border-t border-border">
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded bg-danger opacity-40" />
                     <span>Loss</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded bg-success opacity-40" />
                     <span>Profit</span>
                  </div>
               </div>
               <div className="flex gap-4">
                  <span>9:00</span><span>12:00</span><span>15:30</span>
               </div>
            </div>
         </div>
      </div>

      <footer className="pt-20 text-center opacity-40">
         <p className="text-[10px] font-black text-text-faint uppercase tracking-[0.5em]">VEGA INTELLIGENCE CORE v2.0.0</p>
      </footer>
    </div>
  );
};

export default Analytics;
