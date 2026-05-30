import React from 'react';

const GreeksDisplay = () => (
  <div className="grid grid-cols-5 gap-4 p-4 bg-black/40 border border-white/5 rounded-xl">
    {['Delta', 'Gamma', 'Theta', 'Vega', 'IV'].map(g => (
      <div key={g} className="text-center">
        <p className="text-[8px] text-primary/30 uppercase font-black mb-1">{g}</p>
        <p className="text-xs font-mono font-bold text-secondary">0.00</p>
      </div>
    ))}
  </div>
);

export default GreeksDisplay;
