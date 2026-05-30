import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, Activity, Briefcase } from 'lucide-react';

const Analytics = () => {
  const stats = [
    { label: 'Total P&L', val: '+₹42,500', color: 'text-success', icon: Activity },
    { label: 'Win Rate', val: '64%', color: 'text-secondary', icon: Target },
    { label: 'Profit Factor', val: '2.4', color: 'text-white', icon: Briefcase },
    { label: 'Drawdown', val: '-2.1%', color: 'text-danger', icon: ShieldAlert },
  ];

  return (
    <div className="pt-24 px-8 space-y-8 h-screen overflow-y-auto pb-10 custom-scrollbar">
      {/* Stat Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-4">{s.label}</p>
            <div className="flex justify-between items-end">
              <span className={`text-2xl font-mono font-black ${s.color}`}>{s.val}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6 h-[400px] flex items-center justify-center relative">
          <p className="text-primary/20 uppercase text-xs tracking-widest font-bold">Equity Growth Curve (lightweight-charts)</p>
        </div>
        <div className="col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-6">Strategy Contribution</h3>
          <div className="flex-1 space-y-4 overflow-y-auto">
             {['Supertrend', 'EMA Cross', 'RSI Rev'].map(st => (
               <div key={st} className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                 <span className="text-xs font-bold">{st}</span>
                 <span className="text-xs font-mono text-success">+₹12.4k</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
import { Target, ShieldAlert } from 'lucide-react';
export default Analytics;
