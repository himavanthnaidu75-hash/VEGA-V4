import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ThreeBackground from '../components/ThreeBackground';
import { Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/auth/signup', formData);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.detail || 'Handshake failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <ThreeBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 bg-ink/40 backdrop-blur-3xl p-12 rounded-[3rem] border border-white/10 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">VEGA <span className="text-secondary">2.0</span></h1>
          <p className="text-[9px] font-bold text-primary/40 uppercase tracking-[0.4em]">Establish New Terminal Node</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 text-danger text-[10px] font-bold uppercase tracking-tight">
            <AlertCircle size={14} /> {error}
          </motion.div>
        )}

        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
            <input
              type="email" required placeholder="Access Identity (Email)"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-secondary/50 transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
            <input
              type="password" required placeholder="Encryption Key (Password)"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-secondary/50 transition-all"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all text-[10px] tracking-[0.2em] mt-8"
          >
            {loading ? 'SYNCHRONIZING...' : 'INITIALIZE LINK'}
          </button>

          <div className="flex items-center gap-4 my-8">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[8px] font-black text-primary/20 uppercase tracking-widest">or</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <button
            type="button"
            className="w-full bg-secondary text-ink font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all text-[10px] tracking-[0.2em] shadow-[0_10px_30px_rgba(245,197,24,0.2)]"
            onClick={() => window.location.href = '/auth/google/login'}
          >
            LINK WITH GOOGLE CLOUD
          </button>
        </form>

        <p className="text-center mt-10 text-[9px] font-bold text-primary/20 uppercase tracking-[0.3em]">
          Existing uplink? <a href="/" className="text-secondary hover:underline">Verify Identity</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
