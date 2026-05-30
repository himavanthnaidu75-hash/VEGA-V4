import React from 'react';
import { motion } from 'framer-motion';
import ThreeBackground from '../components/ThreeBackground';
import { Shield, Zap, Cpu, Globe } from 'lucide-react';

const Login = () => {
  return (
    <div className="relative w-full min-h-screen bg-ink overflow-x-hidden">
      <ThreeBackground />

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 bg-white/5 backdrop-blur-3xl p-12 rounded-[2.5rem] border border-white/10 w-full max-w-lg shadow-[0_0_100px_rgba(0,0,0,0.5)] text-center"
        >
          <div className="mb-10 inline-block p-4 bg-secondary/10 rounded-2xl border border-secondary/20">
             <Cpu size={48} className="text-secondary" />
          </div>
          <h1 className="text-6xl font-black text-white mb-2 tracking-tighter italic">VEGA <span className="text-secondary">2.0</span></h1>
          <p className="text-primary/40 font-bold uppercase text-[10px] tracking-[0.4em] mb-12">Institutional Grade Quant Hub</p>

          <button
            className="w-full bg-secondary text-ink font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_40px_rgba(245,197,24,0.2)] group"
            onClick={() => window.location.href = '/auth/google/login'}
          >
            INITIALIZE AUTH PROTOCOL
            <Zap size={18} className="group-hover:fill-current" />
          </button>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="py-32 px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: "169+ STRATEGIES", desc: "vectorized signal engine", icon: Cpu },
          { title: "ICT MODEL", desc: "4-step institutional filter", icon: Shield },
          { title: "ZERO LATENCY", desc: "direct broker fiber link", icon: Zap },
          { title: "GLOBAL MARKETS", desc: "NSE / BSE ecosystem", icon: Globe },
        ].map((f, i) => (
          <motion.div
            key={i} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 50 }}
            className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-default group"
          >
            <f.icon size={24} className="text-secondary mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-black text-white mb-2 tracking-tight">{f.title}</h3>
            <p className="text-xs font-bold text-primary/30 uppercase tracking-widest leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      <footer className="py-20 text-center border-t border-white/5">
         <p className="text-[10px] font-black text-primary/20 uppercase tracking-[0.5em]">VEGA Autonomous Trading System © 2024</p>
      </footer>
    </div>
  );
};

export default Login;
