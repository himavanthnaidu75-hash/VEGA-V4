import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ThreeBackground from '../components/ThreeBackground';
import { Sun, Moon, Zap, Shield, Briefcase } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    theme: 'dark',
    background: 'deepspace',
    capital: 100000,
    broker: 'paper'
  });
  const navigate = useNavigate();

  const handleComplete = () => {
    localStorage.setItem('vega_onboarding_done', 'true');
    localStorage.setItem('vega_theme_v2', JSON.stringify({
      primary: '#F7F7F5',
      secondary: '#F5C518',
      background: config.background,
      intensity: 1
    }));
    navigate('/dashboard');
  };

  return (
    <div className="relative w-full h-screen bg-ink overflow-hidden flex items-center justify-center">
      <ThreeBackground />

      <motion.div
        layout className="z-10 bg-white/5 backdrop-blur-3xl p-12 rounded-[3rem] border border-white/10 w-full max-w-xl shadow-2xl text-center"
      >
        <div className="mb-10">
          <span className="text-[10px] font-black uppercase text-secondary tracking-[0.4em]">Initialization Phase {step}/3</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity:0, x: 20 }} animate={{ opacity:1, x: 0 }} exit={{ opacity:0, x: -20 }}>
              <h2 className="text-3xl font-black text-white mb-4">Choose Interface Aesthetic</h2>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <button onClick={() => { setConfig({...config, theme:'dark'}); setStep(2); }} className="p-8 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center gap-4 hover:border-secondary transition-all">
                  <Moon className="text-primary/40" />
                  <span className="text-xs font-bold uppercase tracking-widest">Obsidian Dark</span>
                </button>
                <button onClick={() => { setConfig({...config, theme:'light'}); setStep(2); }} className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-4 hover:border-secondary transition-all">
                  <Sun className="text-primary/40" />
                  <span className="text-xs font-bold uppercase tracking-widest">Alabaster Light</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity:0, x: 20 }} animate={{ opacity:1, x: 0 }} exit={{ opacity:0, x: -20 }}>
              <h2 className="text-3xl font-black text-white mb-4">Select Background Projection</h2>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <button onClick={() => { setConfig({...config, background:'deepspace'}); setStep(3); }} className="p-8 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center gap-4 hover:border-secondary transition-all">
                  <Zap className="text-secondary" />
                  <span className="text-xs font-bold uppercase tracking-widest">Deep Space</span>
                </button>
                <button onClick={() => { setConfig({...config, background:'aurora'}); setStep(3); }} className="p-8 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center gap-4 hover:border-secondary transition-all">
                  <Shield className="text-success" />
                  <span className="text-xs font-bold uppercase tracking-widest">Aurora Pulse</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity:0, x: 20 }} animate={{ opacity:1, x: 0 }} exit={{ opacity:0, x: -20 }}>
              <h2 className="text-3xl font-black text-white mb-4">Deploy Capital & Broker</h2>
              <div className="space-y-6 mt-8">
                <div className="text-left">
                  <label className="text-[10px] font-black uppercase text-primary/30 tracking-widest ml-4 mb-2 block">Initial Deployment (INR)</label>
                  <input
                    type="number" value={config.capital}
                    onChange={e => setConfig({...config, capital: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-secondary font-mono text-xl outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setConfig({...config, broker:'dhan'})} className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest ${config.broker === 'dhan' ? 'bg-secondary text-ink border-secondary' : 'bg-white/5 border-white/10 text-primary/40'}`}>Dhan HQ</button>
                  <button onClick={() => setConfig({...config, broker:'paper'})} className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest ${config.broker === 'paper' ? 'bg-secondary text-ink border-secondary' : 'bg-white/5 border-white/10 text-primary/40'}`}>Paper Trade</button>
                </div>
                <button onClick={handleComplete} className="w-full bg-white text-ink font-black py-5 rounded-2xl text-[10px] tracking-widest mt-6 hover:brightness-90 transition-all">INITIALIZE ENGINE</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Onboarding;
