import React from 'react';
import { motion } from 'framer-motion';

const SignalCard = ({ signal }) => {
  const isLong = signal.side === 'BUY' || signal.side === 'LONG';

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-bg/50 border border-border p-4 rounded-xl hover:border-primary/30 transition-all group cursor-default"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-[13px] font-black text-text leading-none mb-1 uppercase italic">{signal.symbol}</h4>
          <p className="text-[9px] font-black text-text-faint uppercase tracking-widest">{signal.strategy}</p>
        </div>
        <div className={`px-2 py-1 rounded text-[8px] font-black uppercase ${isLong ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {isLong ? 'Long' : 'Short'}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-text-faint uppercase mb-1">ICT Score</span>
          <span className="text-2xl font-mono font-black text-primary leading-none tracking-tighter">
            {signal.score}
          </span>
        </div>

        <div className="flex gap-1.5 pb-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${signal.ict_steps?.[i] ? 'bg-primary shadow-[0_0_8px_rgba(245,197,24,0.5)]' : 'bg-white/5'}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SignalCard;
