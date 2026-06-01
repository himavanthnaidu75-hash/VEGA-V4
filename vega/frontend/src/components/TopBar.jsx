import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import useVegaStore from '../store/useVegaStore';
import KillSwitch from './KillSwitch';

const TopBar = () => {
  const { pnl, status } = useVegaStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const istTime = time.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const pnlColor = pnl >= 0 ? 'text-success' : 'text-danger';

  const navItemClass = ({ isActive }) => `
    px-6 h-full flex items-center text-[11px] font-black tracking-widest uppercase transition-all border-x border-transparent
    ${isActive
      ? 'bg-primary-dim text-primary border-primary/20 shadow-[inset_0_-2px_0_var(--primary)]'
      : 'text-text-dim hover:text-text hover:bg-white/5'}
  `;

  return (
    <div className="h-[56px] bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between z-20 px-4">
      <div className="flex items-center h-full">
        <div className="text-xl font-black font-syne text-primary italic mr-12 select-none uppercase tracking-tighter">
          VEGA
        </div>

        <nav className="flex h-full">
          <NavLink to="/terminal" className={navItemClass}>Terminal</NavLink>
          <NavLink to="/scanner" className={navItemClass}>Scanner</NavLink>
          <NavLink to="/analytics" className={navItemClass}>Analytics</NavLink>
          <NavLink to="/config" className={navItemClass}>Config</NavLink>
        </nav>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black text-text-faint uppercase tracking-widest">Daily P&L</span>
          <div className={`text-lg font-mono font-black ${pnlColor} transition-all duration-300`}>
            {pnl >= 0 ? '+' : ''}{pnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
          </div>
        </div>

        <div className="flex items-center gap-4 border-l border-border pl-8">
          <div className="flex flex-col items-end">
             <span className="text-[9px] font-black text-text-faint uppercase tracking-widest">System</span>
             <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'LIVE' ? 'bg-success' : 'bg-primary'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
             </div>
          </div>

          <div className="flex flex-col items-end min-w-[80px]">
             <span className="text-[9px] font-black text-text-faint uppercase tracking-widest">IST</span>
             <span className="text-[11px] font-mono font-bold tracking-wider">{istTime}</span>
          </div>
        </div>

        <KillSwitch />
      </div>
    </div>
  );
};

export default TopBar;
