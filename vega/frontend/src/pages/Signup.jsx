import React from 'react';
import { motion } from 'framer-motion';
import ThreeBackground from '../components/ThreeBackground';
import { Mail, Lock, UserPlus } from 'lucide-react';

const Signup = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <ThreeBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 bg-ink/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/10 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">VEGA <span className="text-secondary">2.0</span></h1>
          <p className="text-[9px] font-bold text-primary/40 uppercase tracking-[0.4em]">Initialize New Account</p>
        </div>

        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
            <input type="email" placeholder="Terminal ID (Email)" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-secondary/50" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
            <input type="password" placeholder="Access Code (Password)" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-secondary/50" />
          </div>

          <button className="w-full bg-white/5 border border-white/10 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-[10px] tracking-widest mt-8">
            CREATE TERMINAL ACCOUNT
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[8px] font-black text-primary/20 uppercase">OR</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <button
            className="w-full bg-secondary text-ink font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all text-[10px] tracking-widest shadow-lg"
            onClick={() => window.location.href = '/auth/google/login'}
          >
            SIGNUP WITH GOOGLE
          </button>
        </form>

        <p className="text-center mt-8 text-[9px] font-bold text-primary/30 uppercase tracking-widest">
          Already verified? <a href="/" className="text-secondary hover:underline cursor-pointer">Login</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
