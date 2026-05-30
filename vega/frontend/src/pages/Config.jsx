import React, { useState } from 'react';
import DiagnosticPanel from '../components/DiagnosticPanel';
import ThemeCustomizer from '../components/ThemeCustomizer';

const Config = () => {
  const [activeTab, setActiveTab] = useState('broker');

  return (
    <div className="pt-24 px-8 grid grid-cols-12 gap-8 h-screen overflow-hidden">
      <div className="col-span-7 bg-white/5 border border-white/10 rounded-2xl p-8 overflow-y-auto custom-scrollbar">
        <div className="flex gap-8 mb-10 border-b border-white/5">
          {['Broker', 'Risk', 'Watchlist', 'Theme'].map(tab => (
            <button
              key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.toLowerCase() ? 'text-secondary border-b-2 border-secondary' : 'text-primary/30 hover:text-primary/60'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {activeTab === 'risk' && (
             <div className="space-y-8">
               <div className="grid grid-cols-2 gap-8">
                 <div className="col-span-2">
                   <label className="block text-[10px] font-black text-primary/30 uppercase tracking-widest mb-4">Total Trading Capital (INR)</label>
                   <input type="number" defaultValue="100000" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 font-mono text-xl text-secondary outline-none focus:border-secondary/50 transition-all" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-primary/30 uppercase tracking-widest mb-4">Max Risk Per Trade (%)</label>
                   <input type="number" defaultValue="1" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-white outline-none focus:border-secondary/50" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-primary/30 uppercase tracking-widest mb-4">Max Open Positions</label>
                   <input type="number" defaultValue="5" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-white outline-none focus:border-secondary/50" />
                 </div>
               </div>
               <button className="w-full bg-secondary text-ink font-black py-5 rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg text-xs tracking-widest">COMMIT SYSTEM CHANGES</button>
             </div>
           )}
           {activeTab === 'broker' && (
             <div className="space-y-6">
                <div className="p-8 bg-secondary/5 border border-secondary/20 rounded-3xl flex justify-between items-center shadow-inner">
                  <div>
                    <h4 className="font-black text-xl mb-1 text-white">Dhan HQ <span className="text-[10px] text-secondary/40 font-bold ml-2">FREE API</span></h4>
                    <p className="text-primary/40 text-[10px] uppercase font-bold tracking-widest">Verified Account: VEGA_DHAN_01</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/20 border border-success/30">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-[9px] text-success font-black uppercase tracking-tighter">Connected</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <button className="p-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/40 hover:bg-white/10 hover:text-white transition-all">Connect Zerodha Kite</button>
                  <button className="p-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/40 hover:bg-white/10 hover:text-white transition-all">Connect AngelOne</button>
                </div>
             </div>
           )}
           {activeTab === 'theme' && <ThemeCustomizer />}
        </div>
      </div>

      <div className="col-span-5 h-full overflow-hidden pb-8">
        <DiagnosticPanel />
      </div>
    </div>
  );
};

export default Config;
