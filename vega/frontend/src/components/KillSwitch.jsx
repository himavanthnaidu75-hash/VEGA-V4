import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import useVegaStore from '../store/useVegaStore';

const KillSwitch = () => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isKilled, setIsKilled] = useState(false);
  const timerRef = useRef();
  const { killToken } = useVegaStore();

  const startHold = () => {
    setHolding(true);
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / 3000) * 100, 100);
      setProgress(p);
      if (p === 100) {
        clearInterval(timerRef.current);
        handleKill();
      }
    }, 16);
  };

  const cancelHold = () => {
    setHolding(false);
    setProgress(0);
    clearInterval(timerRef.current);
  };

  const handleKill = async () => {
    try {
      setIsKilled(true);
      await axios.post('/kill', {}, {
        headers: { 'X-Kill-Token': killToken }
      });
    } catch (e) {
      console.error("Kill failed", e);
      setIsKilled(false);
    }
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative">
      <button
        onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold}
        onTouchStart={startHold} onTouchEnd={cancelHold}
        className={`relative w-32 h-10 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${isKilled ? 'bg-kill text-white' : 'bg-white/5 border border-white/10 text-primary/40'}`}
      >
        <span className="relative z-10">{isKilled ? 'PURGED' : holding ? 'HOLDING...' : 'KILL SYSTEM'}</span>
        {holding && (
           <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="absolute inset-0 bg-kill opacity-20 rounded-xl" />
        )}
      </button>

      {holding && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <svg className="w-10 h-10 rotate-[-90deg]">
            <circle cx="20" cy="20" r={radius} fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <circle
              cx="20" cy="20" r={radius} fill="transparent" stroke="var(--color-kill)" strokeWidth="4"
              strokeDasharray={circumference} strokeDashoffset={circumference - (progress/100) * circumference}
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      <AnimatePresence>
        {isKilled && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="fixed inset-0 z-[200] bg-kill flex items-center justify-center">
            <h1 className="text-9xl font-black italic tracking-tighter text-white animate-pulse">SYSTEM PURGED</h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KillSwitch;
