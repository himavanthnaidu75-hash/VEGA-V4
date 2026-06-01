import React, { useState, useEffect } from 'react';
import { XCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../api';

const PositionRow = ({ pos }) => {
  const [pulse, setPulse] = useState(false);
  const isLong = pos.side === 'BUY';
  const pnlColor = pos.pnl >= 0 ? 'text-success' : 'text-danger';

  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(timer);
  }, [pos.current_price]);

  const closePosition = async () => {
    try {
      await api.post('/orders/close', { symbol: pos.symbol });
    } catch (e) {
      console.error('Failed to close position', e);
    }
  };

  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <span className="text-[13px] font-black text-text font-syne italic uppercase tracking-tight">{pos.symbol}</span>
          <span className="text-[8px] font-black text-text-faint uppercase tracking-widest">{pos.product || 'MIS'}</span>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${isLong ? 'text-success' : 'text-danger'}`}>
           {isLong ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
           {isLong ? 'Long' : 'Short'}
        </div>
      </td>
      <td className="px-8 py-5">
         <div className="flex flex-col">
            <span className="text-[11px] font-mono font-bold text-text-dim">{pos.entry_price.toFixed(2)}</span>
            <div className="flex gap-2">
               <span className="text-[7px] font-black text-success uppercase">TP: {pos.tp?.toFixed(1)}</span>
               <span className="text-[7px] font-black text-danger uppercase">SL: {pos.sl?.toFixed(1)}</span>
            </div>
         </div>
      </td>
      <td className="px-8 py-5">
        <span className={`text-[11px] font-mono font-black transition-all duration-300 ${pulse ? 'text-primary scale-110' : 'text-text'}`}>
          {pos.current_price.toFixed(2)}
        </span>
      </td>
      <td className="px-8 py-5 text-right">
        <div className="flex items-center justify-end gap-6">
           <div className="flex flex-col items-end">
              <span className={`text-[13px] font-mono font-black ${pnlColor}`}>
                {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}
              </span>
              <span className="text-[8px] font-black text-text-faint uppercase tracking-widest">Unrealized</span>
           </div>
           <button
             onClick={closePosition}
             className="p-2 text-text-faint hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
             title="Square Off"
           >
             <XCircle size={16} />
           </button>
        </div>
      </td>
    </tr>
  );
};

export default PositionRow;
