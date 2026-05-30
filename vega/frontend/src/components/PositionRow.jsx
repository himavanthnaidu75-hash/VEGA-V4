import React from 'react';

const PositionRow = ({ pos }) => (
  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-1 h-6 rounded-full ${pos.side === 'BUY' ? 'bg-success' : 'bg-danger'}`}></div>
      <div>
        <div className="text-xs font-bold">{pos.symbol}</div>
        <div className="text-[8px] text-primary/40 font-mono">{pos.qty} @ {pos.entry_price.toFixed(1)}</div>
      </div>
    </div>
    <div className="text-right font-mono text-xs font-bold">
      <span className={pos.pnl >= 0 ? 'text-success' : 'text-danger'}>
        {pos.pnl >= 0 ? '+' : ''}₹{pos.pnl.toFixed(2)}
      </span>
    </div>
  </div>
);

export default PositionRow;
