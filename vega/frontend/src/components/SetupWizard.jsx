import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ShieldCheck, Zap, ArrowRight, Settings, CheckCircle2 } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

const SetupWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [capital, setCapital] = useState(100000);
  const [mode, setMode] = useState('Paper Trading');
  const [accent, setAccent] = useState('#F5C518');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      localStorage.setItem('vega_setup_complete', 'true');
      localStorage.setItem('vega_primary_color', accent);
      localStorage.setItem('vega_settings_v2', JSON.stringify({ TOTAL_CAPITAL: capital, TRADING_MODE: mode }));
      document.documentElement.style.setProperty('--primary', accent);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-2xl bg-bg/80">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-surface rounded-[40px] border border-border shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" style={{ backgroundColor: accent }} />

        <div className="p-16 space-y-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center" style={{ backgroundColor: `${accent}15`, color: accent }}>
                    <Rocket size={48} className="animate-bounce" />
                  </div>
                  <div className="space-y-4">
                    <h1 className="text-5xl font-black font-syne italic text-text uppercase tracking-tighter">Welcome to VEGA</h1>
                    <p className="text-[12px] font-black text-text-dim uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">You're about to deploy an institutional-grade quant trading system.</p>
                  </div>
                </div>
                <div className="bg-bg/40 border border-border p-8 rounded-3xl text-center">
                  <p className="text-[11px] font-bold text-text-dim uppercase tracking-[0.2em]">Deployment Readiness: <span className="text-success">READY</span></p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-black font-syne text-text uppercase italic">Connect & Configure</h2>
                  <p className="text-[10px] font-black text-text-faint uppercase tracking-widest">Base operational parameters</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1">Trading Capital (₹)</label>
                    <input
                      type="number"
                      value={capital}
                      onChange={e => setCapital(e.target.value)}
                      className="w-full bg-bg/50 border border-border rounded-2xl py-5 px-8 text-xl font-mono focus:border-primary/50 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1">Trading Mode</label>
                    <div className="flex gap-4">
                       {['Paper Trading', 'Live Trading'].map(m => (
                         <button
                           key={m}
                           onClick={() => setMode(m)}
                           className={`flex-1 py-5 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-bg/50 border-border text-text-dim hover:text-text'}`}
                           style={mode === m ? { color: accent, borderColor: `${accent}40`, backgroundColor: `${accent}15` } : {}}
                         >
                           {m}
                         </button>
                       ))}
                    </div>
                    {mode === 'Paper Trading' && <p className="text-[9px] text-text-dim italic uppercase tracking-widest text-center mt-2">Recommended: Test with simulated funds before going live.</p>}
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1">Node Identity Color</label>
                     <div className="flex gap-4">
                        {['#F5C518', '#3B82F6', '#00D4A0', '#FF4560', '#A855F7'].map(c => (
                          <button key={c} onClick={() => setAccent(c)} className="w-10 h-10 rounded-full border-2 border-white/10 transition-transform hover:scale-110" style={{backgroundColor: c, borderColor: accent === c ? 'white' : 'transparent'}} />
                        ))}
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center text-success border border-success/20 shadow-[0_0_40px_rgba(0,212,160,0.2)]">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black font-syne text-text uppercase italic tracking-tight">VEGA is Ready to Deploy</h2>
                    <p className="text-[10px] font-black text-text-faint uppercase tracking-[0.3em]">Node synchronization complete</p>
                  </div>
                </div>

                <div className="space-y-4 bg-bg/40 p-8 rounded-[32px] border border-border">
                   {[
                     'Scan 10 symbols every 60 seconds',
                     'Filter signals through 22 quant strategies',
                     'Only enter trades with 65%+ ICT confidence',
                     'Automatically close all positions at 3:15 PM IST'
                   ].map((t, i) => (
                     <div key={i} className="flex items-center gap-4 text-[10px] font-black text-text-dim uppercase tracking-widest">
                        <Zap size={12} className="text-primary" style={{ color: accent }} />
                        {t}
                     </div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleNext}
            className="w-full py-6 rounded-2xl bg-primary text-bg font-black text-[14px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-primary/20"
            style={{ backgroundColor: accent }}
          >
            {step === 1 ? 'Get Started' : step === 2 ? 'Continue' : 'Launch Terminal'}
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="px-16 pb-12 flex justify-between items-center opacity-40">
           <div className="flex gap-2">
              {[1,2,3].map(i => (
                <div key={i} className={`h-1 w-8 rounded-full transition-all ${step >= i ? 'bg-primary' : 'bg-white/10'}`} style={step >= i ? { backgroundColor: accent } : {}} />
              ))}
           </div>
           <span className="text-[9px] font-black text-text uppercase tracking-widest">VERIFICATION: PASS</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SetupWizard;
