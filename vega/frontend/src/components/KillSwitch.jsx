import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const KillSwitch = () => {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

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
      const token = prompt("Enter KILL TOKEN:");
      await axios.post('/kill?token=' + token);
    } catch (e) {
      console.error("Kill failed", e);
    }
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => { setShowModal(true); setCountdown(3); }}
        className="bg-kill text-white px-6 py-2 rounded font-black uppercase tracking-tighter shadow-lg hover:scale-105 active:scale-95 transition-all"
      >
        KILL SWITCH
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-2xl"
          >
            <div className="text-center">
              <h2 className="text-6xl font-black text-kill mb-4 animate-pulse">INITIATING PURGE</h2>
              <p className="text-2xl font-mono text-white mb-8">SQUARING OFF ALL POSITIONS IN {countdown}...</p>
              <button onClick={() => setShowModal(false)} className="text-primary/40 hover:text-white uppercase text-xs tracking-widest">Abort</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KillSwitch;
