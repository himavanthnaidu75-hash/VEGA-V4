import React from 'react';
import useVegaStore from '../store/useVegaStore';
import useWebSocket from '../hooks/useWebSocket';
import SignalCard from '../components/SignalCard';
import PositionRow from '../components/PositionRow';
import GreeksDisplay from '../components/GreeksDisplay';
import { Target } from 'lucide-react';

const Terminal = () => {
  useWebSocket();
  const { positions, signals } = useVegaStore();

  return (
    <div className="pt-24 px-8 pb-10 grid grid-cols-12 gap-8 h-screen overflow-hidden">
      <div className="col-span-8 flex flex-col gap-6">
        <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl relative flex items-center justify-center">
          <Target size={100} className="text-white/5 animate-pulse" />
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full"></span>
            <span className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Real-time Feed: NIFTY 50</span>
          </div>
        </div>
        <GreeksDisplay />
      </div>

      <div className="col-span-4 flex flex-col gap-8 h-full overflow-hidden">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Signal Scanner</h3>
            <span className="text-[8px] font-mono text-success/60">ACTIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {signals.map((s, i) => <SignalCard key={i} sig={s} />)}
            {signals.length === 0 && <div className="h-full flex items-center justify-center text-[10px] text-primary/10 uppercase tracking-widest">Awaiting Pulse...</div>}
          </div>
        </div>

        <div className="h-[35%] bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5">
             <h3 className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Active Portfolio</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {positions.map((p, i) => <PositionRow key={i} pos={p} />)}
            {positions.length === 0 && <div className="h-full flex items-center justify-center text-[10px] text-primary/10 uppercase tracking-widest">No Exposure</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
