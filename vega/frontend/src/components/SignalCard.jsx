import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SignalCard = ({ sig }) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
    className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center hover:border-secondary/50 transition-all"
  >
    <div className="flex gap-4 items-center">
      <div className={`p-2 rounded-lg ${sig.side === 'BUY' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
        {sig.side === 'BUY' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
      </div>
      <div>
        <div className="text-sm font-bold text-white">{sig.symbol}</div>
        <div className="text-[9px] text-primary/30 uppercase font-bold tracking-tighter">{sig.strategy_name}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-lg font-mono font-black text-secondary leading-none">{sig.ict_score}</div>
      <div className="text-[7px] text-primary/20 uppercase font-bold tracking-widest">ICT SCORE</div>
    </div>
  </motion.div>
);

export default SignalCard;
