import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PreMarketModal = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-ink border border-white/10 p-10 rounded-[2rem] max-w-md w-full text-center">
        <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">Market Protocol Initialized</h2>
        <p className="text-primary/40 text-xs font-bold mb-8 uppercase tracking-widest">Select target universe for today's session</p>
        <div className="grid grid-cols-1 gap-4">
          <button onClick={() => onSelect('1')} className="py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-secondary hover:text-ink transition-all uppercase text-xs tracking-widest">1. NSE Equities</button>
          <button onClick={() => onSelect('2')} className="py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-secondary hover:text-ink transition-all uppercase text-xs tracking-widest">2. F&O Segment</button>
          <button onClick={() => onSelect('3')} className="py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-secondary hover:text-ink transition-all uppercase text-xs tracking-widest">3. Index Futures</button>
        </div>
        <p className="mt-8 text-[9px] text-primary/20 uppercase font-bold tracking-[0.3em]">Auto-selecting Equities in 10:00</p>
      </motion.div>
    </div>
  );
};

export default PreMarketModal;
