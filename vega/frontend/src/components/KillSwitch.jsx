import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import useVegaStore from '../store/useVegaStore';

const KillSwitch = () => {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { killToken } = useVegaStore();

  useEffect(() => {
    let timer;
    if (showModal && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showModal && countdown === 0) {
      handleKill();
    }
    return () => clearTimeout(timer);
  }, [showModal, countdown]);

  const handleKill = async () => {
    try {
      await axios.post('/kill', {}, {
        headers: { 'X-Kill-Token': killToken }
      });
    } catch (e) {
      console.error("Kill protocol failed", e);
      alert("Kill Failed: Check token in Settings");
    }
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => { setShowModal(true); setCountdown(3); }}
        className="bg-kill text-white px-6 py-2 rounded-xl font-black uppercase tracking-tighter shadow-lg hover:scale-105 active:scale-95 transition-all"
      >
        KILL SWITCH
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-3xl"
          >
            <div className="text-center">
              <h2 className="text-7xl font-black text-kill mb-4 animate-pulse italic">INITIATING PURGE</h2>
              <p className="text-2xl font-mono text-white/60 mb-12 uppercase tracking-widest">Executing Square-off in {countdown}...</p>
              <button onClick={() => setShowModal(false)} className="px-8 py-3 border border-white/10 rounded-full text-primary/40 hover:text-white uppercase text-[10px] font-black tracking-[0.3em] transition-all">Abort Protocol</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KillSwitch;
