import React, { useState } from 'react';
import DiagnosticPanel from '../components/DiagnosticPanel';
import ThemeCustomizer from '../components/ThemeCustomizer';
import useVegaStore from '../store/useVegaStore';
import { Shield, Key, Map, Layers } from 'lucide-react';

const Config = () => {
  const [activeTab, setActiveTab] = useState('broker');
  const { killToken, setKillToken } = useVegaStore();

  return (
    <div className="pt-24 px-10 grid grid-cols-12 gap-10 h-screen overflow-hidden">
      <div className="col-span-7 bg-white/5 border border-white/10 rounded-[3rem] p-10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="flex gap-10 mb-12 border-b border-white/5">
          {[
            { id: 'broker', label: 'Protocol', icon: Shield },
            { id: 'risk', label: 'Risk', icon: Layers },
            { id: 'watchlist', label: 'Universe', icon: Map },
            { id: 'security', label: 'Security', icon: Key },
            { id: 'theme', label: 'Interface', icon: Layers },
          ].map(tab => (
            <button
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? 'text-secondary border-b-2 border-secondary' : 'text-primary/20 hover:text-primary/40'}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
           {activeTab === 'risk' && (
             <div className="space-y-10">
               <div className="grid grid-cols-2 gap-10">
                 <div className="col-span-2">
                   <label className="block text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] mb-4">Core Deployment Capital (INR)</label>
                   <input type="number" defaultValue="100000" className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-6 font-mono text-2xl text-secondary outline-none focus:border-secondary/40 shadow-inner" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] mb-4">Risk Scalar (%)</label>
                   <input type="number" defaultValue="1" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 font-mono text-white outline-none focus:border-secondary/40" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] mb-4">Node Capacity (Max Pos)</label>
                   <input type="number" defaultValue="5" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 font-mono text-white outline-none focus:border-secondary/40" />
                 </div>
               </div>
               <button className="w-full bg-secondary text-ink font-black py-6 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_15px_40px_rgba(245,197,24,0.2)] text-[10px] tracking-[0.3em]">SYNCHRONIZE PARAMETERS</button>
             </div>
           )}

           {activeTab === 'security' && (
             <div className="space-y-8">
                <div>
                   <label className="block text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] mb-4">Manual Override Token (Kill Switch)</label>
                   <div className="relative">
                      <input
                        type="password"
                        value={killToken}
                        onChange={e => setKillToken(e.target.value)}
                        placeholder="Enter Secure Token"
                        className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-6 font-mono text-lg text-secondary outline-none focus:border-secondary/40 pr-20"
                      />
                      <Key className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/20" size={20} />
                   </div>
                   <p className="mt-4 text-[9px] text-primary/20 font-bold uppercase tracking-widest leading-relaxed px-4 italic">Warning: This token is required to execute the emergency purge protocol. It is stored locally on this terminal node.</p>
                </div>
             </div>
           )}

           {activeTab === 'broker' && (
             <div className="space-y-8">
                <div className="p-10 bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 rounded-[3rem] flex justify-between items-center shadow-2xl group overflow-hidden relative">
                  <div className="absolute -right-10 -top-10 text-secondary/5 group-hover:text-secondary/10 transition-colors duration-1000 rotate-12">
                     <Shield size={200} />
                  </div>
                  <div className="z-10">
                    <h4 className="font-black text-2xl mb-2 text-white tracking-tighter italic">DHAN HQ <span className="text-[10px] text-secondary/60 not-italic font-bold ml-3 tracking-[0.2em] border border-secondary/30 px-3 py-1 rounded-full uppercase">Fiber Uplink</span></h4>
                    <p className="text-primary/40 text-[10px] uppercase font-black tracking-[0.3em]">Protocol active: VEGA_NODE_01</p>
                  </div>
                  <div className="z-10 flex items-center gap-3 px-6 py-2 rounded-full bg-success/10 border border-success/20">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_10px_#00B37E]" />
                    <span className="text-[10px] text-success font-black uppercase tracking-[0.2em]">Live</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  {['Zerodha Kite', 'Angel One', 'Paper SIM'].map(b => (
                    <button key={b} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all">Connect {b}</button>
                  ))}
                </div>
             </div>
           )}

           {activeTab === 'theme' && <ThemeCustomizer />}
        </div>
      </div>

      <div className="col-span-5 h-full overflow-hidden pb-10">
        <DiagnosticPanel />
      </div>
    </div>
  );
};

export default Config;
