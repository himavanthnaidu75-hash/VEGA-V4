import React from 'react';
import useVegaStore from '../store/useVegaStore';
import { Activity, Target, ShieldAlert, Briefcase, Zap } from 'lucide-react';
import SignalCard from '../components/SignalCard';
import PositionRow from '../components/PositionRow';

const Dashboard = () => {
  const { pnl, pnlPct, positions, signals } = useVegaStore();

  const stats = [
    { label: 'Session P&L', val: `₹${pnl.toLocaleString()}`, color: pnl >= 0 ? 'text-success' : 'text-danger', icon: Activity },
    { label: 'Open Exposure', val: positions.length, color: 'text-secondary', icon: Briefcase },
    { label: 'Active Signals', val: signals.length, color: 'text-white', icon: Zap },
    { label: 'Risk Status', val: 'NOMINAL', color: 'text-success', icon: ShieldAlert },
  ];

  return (
    <div className="pt-24 px-8 pb-10 space-y-8 h-screen overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">{s.label}</p>
              <s.icon size={14} className="text-primary/20" />
            </div>
            <p className={`text-3xl font-mono font-black ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Equity Summary */}
        <div className="col-span-8 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 h-[400px] flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-primary/40">Portfolio Performance</h3>
          <div className="flex-1 flex items-center justify-center border-t border-white/5 relative">
             <div className="absolute inset-0 bg-gradient-to-t from-secondary/5 to-transparent opacity-50" />
             <p className="text-primary/10 uppercase font-black text-4xl tracking-tighter italic">Engine Pulsing...</p>
          </div>
        </div>

        {/* Recent Signals */}
        <div className="col-span-4 space-y-6 flex flex-col h-[400px]">
           <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex-1 flex flex-col overflow-hidden">
             <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 text-primary/40">Latest High-Conf Signals</h3>
             <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {signals.slice(0, 5).map((s, i) => <SignalCard key={i} sig={s} />)}
                {signals.length === 0 && <div className="h-full flex items-center justify-center text-[10px] text-primary/10 uppercase tracking-widest italic">Scanning universe...</div>}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
