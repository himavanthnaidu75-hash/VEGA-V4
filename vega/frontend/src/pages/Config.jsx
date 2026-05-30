import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, RefreshCw, Plus, X } from 'lucide-react';
import ThemeCustomizer from '../components/ThemeCustomizer';
import DiagnosticPanel from '../components/DiagnosticPanel';

const Config = () => {
  const [config, setConfig] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axios.get('/api/config');
        setConfig(data);
        setWatchlist(data.WATCHLIST.split(','));
      } catch (e) {
        console.error('Failed to fetch config', e);
      }
    };
    fetchConfig();
  }, []);

  const saveConfig = async (updates) => {
    setSaving(true);
    try {
      const merged = { ...config, ...updates };
      if (updates.WATCHLIST === undefined) merged.WATCHLIST = watchlist.join(',');
      await axios.patch('/api/config', merged);
      setConfig(merged);
    } catch (e) {
      console.error('Save failed', e);
    } finally {
      setSaving(false);
    }
  };

  const addSymbol = () => {
    if (newSymbol && !watchlist.includes(newSymbol.toUpperCase())) {
      setWatchlist([...watchlist, newSymbol.toUpperCase()]);
      setNewSymbol('');
    }
  };

  const removeSymbol = (s) => {
    setWatchlist(watchlist.filter(x => x !== s));
  };

  if (!config) return <div className="p-20 text-center text-text-faint font-syne italic">Synchronizing Configuration...</div>;

  return (
    <div className="p-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Broker & Risk */}
      <div className="space-y-8">
        <section className="bg-surface rounded-3xl border border-border p-8">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-dim mb-8">Node Connectivity</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {['paper', 'dhan', 'angel', 'zerodha'].map(b => (
               <div key={b} className="bg-bg/50 border border-border p-4 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${config.BROKER === b ? 'bg-success shadow-[0_0_8px_var(--success)]' : 'bg-white/5'}`} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{b}</span>
                  </div>
                  <button
                    onClick={() => saveConfig({ BROKER: b })}
                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${config.BROKER === b ? 'bg-primary text-bg' : 'text-text-faint hover:text-primary hover:bg-primary/5'}`}
                  >
                    {config.BROKER === b ? 'ACTIVE' : 'CONNECT'}
                  </button>
               </div>
             ))}
           </div>
        </section>

        <section className="bg-surface rounded-3xl border border-border p-8">
           <div className="flex justify-between items-center mb-8">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-dim">Risk Thresholds</h3>
             <button
               onClick={() => saveConfig()}
               className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:brightness-110"
             >
               {saving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
               Commit Changes
             </button>
           </div>

           <div className="grid grid-cols-2 gap-6">
             {[
               { label: 'Total Capital', key: 'TOTAL_CAPITAL', type: 'number', prefix: '₹' },
               { label: 'Risk Per Trade', key: 'MAX_RISK_PER_TRADE', type: 'number', suffix: '%' },
               { label: 'Max Positions', key: 'MAX_OPEN_POSITIONS', type: 'number' },
               { label: 'Daily Loss Limit', key: 'MAX_DAILY_LOSS', type: 'number', suffix: '%' },
             ].map(field => (
               <div key={field.key} className="space-y-2">
                 <label className="text-[9px] font-black text-text-faint uppercase tracking-widest ml-1">{field.label}</label>
                 <div className="relative">
                   {field.prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint font-mono text-xs">{field.prefix}</span>}
                   <input
                     type={field.type}
                     value={config[field.key]}
                     onChange={e => setConfig({...config, [field.key]: e.target.value})}
                     className={`w-full bg-bg/50 border border-border rounded-xl py-3 ${field.prefix ? 'pl-8' : 'px-4'} pr-4 text-xs font-mono font-bold outline-none focus:border-primary/40 transition-all text-text`}
                   />
                   {field.suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-faint font-mono text-xs">{field.suffix}</span>}
                 </div>
               </div>
             ))}
           </div>
        </section>

        <section className="bg-surface rounded-3xl border border-border p-8">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-dim mb-8">Universe Watchlist</h3>
           <div className="flex flex-wrap gap-2 mb-6">
              {watchlist.map(s => (
                <div key={s} className="bg-bg/50 border border-border pl-3 pr-1 py-1 rounded-lg flex items-center gap-2 group hover:border-danger/30 transition-all">
                  <span className="text-[10px] font-black tracking-tight uppercase italic font-syne">{s}</span>
                  <button onClick={() => removeSymbol(s)} className="p-1 text-text-faint hover:text-danger">
                    <X size={10} />
                  </button>
                </div>
              ))}
           </div>
           <div className="flex gap-2">
             <input
               type="text"
               placeholder="ADD SYMBOL (e.g. INFY)"
               value={newSymbol}
               onChange={e => setNewSymbol(e.target.value.toUpperCase())}
               onKeyDown={e => e.key === 'Enter' && addSymbol()}
               className="flex-1 bg-bg/50 border border-border rounded-xl py-3 px-4 text-[10px] font-black uppercase outline-none focus:border-primary/40 transition-all"
             />
             <button onClick={addSymbol} className="bg-white/5 border border-border p-3 rounded-xl text-text hover:bg-primary hover:text-bg transition-all">
               <Plus size={16} />
             </button>
           </div>
        </section>
      </div>

      {/* Right Column: Theme & Diagnostics */}
      <div className="space-y-8">
        <section className="bg-surface rounded-3xl border border-border p-8">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-dim mb-8">Visual Atmosphere</h3>
           <ThemeCustomizer />
        </section>

        <section className="bg-surface rounded-3xl border border-border p-8">
           <DiagnosticPanel />
        </section>
      </div>
    </div>
  );
};

export default Config;
