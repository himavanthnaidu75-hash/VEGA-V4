import React, { useState, useEffect } from 'react';
import useVegaStore from '../store/useVegaStore';
import KillSwitch from './KillSwitch';

const TopBar = () => {
  const { pnl, pnlPct, status, positions } = useVegaStore();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-ink/90 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-8">
      <div className="flex items-center gap-8">
        <div className="flex flex-col">
          <span className="text-secondary font-black text-2xl tracking-tighter leading-none italic">VEGA</span>
          <span className="text-[8px] text-primary/40 tracking-[0.3em] font-bold uppercase">v2.0</span>
        </div>

        <div className="h-8 w-[1px] bg-white/10"></div>

        <div className="flex flex-col">
          <span className={`text-lg font-mono font-bold leading-none ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>
            {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-primary/40 font-mono font-bold uppercase tracking-tight">
            Session P&L ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="text-right">
          <div className="text-xs font-mono text-primary/80 font-bold uppercase">{time} IST</div>
          <div className="text-[10px] text-primary/30 uppercase font-black tracking-widest">Grid Active</div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'RUNNING' ? 'bg-success' : status === 'KILLED' ? 'bg-kill' : 'bg-secondary'}`}></div>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary/80">{status}</span>
        </div>

        <div className="px-4 py-1 rounded bg-white/5 border border-white/10 flex flex-col items-center">
          <span className="text-[7px] text-primary/30 font-black uppercase tracking-widest">Positions</span>
          <span className="text-xs font-mono font-black text-secondary leading-none">{positions.length}</span>
        </div>

        <KillSwitch />
      </div>
    </div>
  );
};

export default TopBar;
