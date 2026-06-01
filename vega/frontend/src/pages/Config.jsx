import React, { useState, useEffect } from 'react';
import {
  Settings,
  Link as LinkIcon,
  Shield,
  Palette,
  List,
  Send,
  Smartphone,
  Save,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Plus,
  X
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import api from '../api';

const TabButton = ({ id, active, icon: Icon, label, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
      active
      ? 'bg-primary text-bg shadow-lg shadow-primary/20 scale-105'
      : 'text-text-dim hover:text-text hover:bg-white/5'
    }`}
  >
    <Icon size={14} />
    {label}
  </button>
);

const Config = () => {
  const [activeTab, setActiveTab] = useState('broker');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showBrokerCreds, setShowBrokerCreds] = useState(false);
  const [showKillToken, setShowKillToken] = useState(false);

  // Local Settings State
  const [settings, setSettings] = useState({
    DHAN_CLIENT_ID: '',
    DHAN_ACCESS_TOKEN: '',
    TOTAL_CAPITAL: 100000,
    MAX_RISK_PER_TRADE: 1.0,
    MAX_DAILY_LOSS: 3.0,
    DAILY_PROFIT_TARGET: 6.0,
    MIN_RR_RATIO: 1.5,
    POSITION_SIZING: 'atr',
    TRAILING_SL: true,
    KILL_TOKEN: '',
    TELEGRAM_BOT_TOKEN: '',
    TELEGRAM_CHAT_ID: '',
    WATCHLIST: ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'BHARTIARTL', 'ITC', 'ASIANPAINT', 'TITAN']
  });

  // Theme State
  const [theme, setTheme] = useState({
    primary: localStorage.getItem('vega_primary_color') || '#F5C518',
    bg: localStorage.getItem('vega_bg_color') || '#111318',
    style: localStorage.getItem('vega_bg_type') || 'Deep Space',
    intensity: parseInt(localStorage.getItem('vega_bg_intensity') || '50')
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('vega_settings_v2');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedTheme = localStorage.getItem('vega_theme_v2');
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme);
      setTheme(parsed);
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus('Saving...');
    try {
      localStorage.setItem('vega_settings_v2', JSON.stringify(settings));
      // Optional: Call API if endpoint exists
      // await api.post('/settings', settings);
      setSaveStatus('Success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (e) {
      setSaveStatus('Error');
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = () => {
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--bg', theme.bg);
    localStorage.setItem('vega_primary_color', theme.primary);
    localStorage.setItem('vega_bg_color', theme.bg);
    localStorage.setItem('vega_bg_type', theme.style);
    localStorage.setItem('vega_bg_intensity', (theme.intensity/100).toString());
    localStorage.setItem('vega_theme_v2', JSON.stringify(theme));
  };

  const resetTheme = () => {
    const defaults = { primary: '#F5C518', bg: '#111318', style: 'Deep Space', intensity: 50 };
    setTheme(defaults);
    document.documentElement.style.setProperty('--primary', defaults.primary);
    document.documentElement.style.setProperty('--bg', defaults.bg);
    localStorage.setItem('vega_theme_v2', JSON.stringify(defaults));
  };

  const testBroker = async () => {
    try {
       const { data } = await api.get('/diagnostics/run');
       alert('Connection Status: ' + (data.status === 'PASS' ? 'Connected' : 'Failed'));
    } catch (e) {
       alert('Connection Failed: Backend Unreachable');
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-10 selection:bg-primary/20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-syne italic text-text uppercase tracking-tight flex items-center gap-4">
            <Settings size={32} className="text-primary" />
            System Configuration
          </h1>
          <p className="text-[11px] font-black text-text-dim uppercase tracking-[0.3em] mt-2">Manage your VEGA node intelligence and safety</p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-3 bg-primary px-8 py-4 rounded-2xl text-bg font-black text-[12px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {saveStatus || 'Save All Settings'}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 p-2 bg-surface rounded-2xl border border-border shadow-lg overflow-x-auto">
        <TabButton id="broker" active={activeTab === 'broker'} icon={LinkIcon} label="Broker" onClick={setActiveTab} />
        <TabButton id="risk" active={activeTab === 'risk'} icon={Shield} label="Risk" onClick={setActiveTab} />
        <TabButton id="theme" active={activeTab === 'theme'} icon={Palette} label="Theme" onClick={setActiveTab} />
        <TabButton id="watchlist" active={activeTab === 'watchlist'} icon={List} label="Watchlist" onClick={setActiveTab} />
        <TabButton id="security" active={activeTab === 'security'} icon={Smartphone} label="Security" onClick={setActiveTab} />
        <TabButton id="telegram" active={activeTab === 'telegram'} icon={Send} label="Telegram" onClick={setActiveTab} />
      </div>

      <div className="bg-surface rounded-3xl border border-border p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Tab 1: Broker */}
        {activeTab === 'broker' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-black font-syne text-text uppercase italic">Connect Your Broker</h2>
              <p className="text-xs font-bold text-text-dim uppercase tracking-widest mt-2">Link your Dhan account to enable live trading. Your credentials are stored locally and never sent to third parties.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1">Dhan Client ID</label>
                <div className="relative">
                  <input
                    type={showBrokerCreds ? 'text' : 'password'}
                    value={settings.DHAN_CLIENT_ID}
                    onChange={e => setSettings({...settings, DHAN_CLIENT_ID: e.target.value})}
                    placeholder="Enter Client ID"
                    className="w-full bg-bg/50 border border-border rounded-2xl py-4 px-6 text-sm font-mono focus:border-primary/50 transition-all outline-none"
                  />
                  <button onClick={() => setShowBrokerCreds(!showBrokerCreds)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-faint hover:text-text">
                    {showBrokerCreds ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-[9px] text-text-dim italic">Found in Dhan Profile > API Access</p>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1">Access Token</label>
                <div className="relative">
                  <textarea
                    value={settings.DHAN_ACCESS_TOKEN}
                    onChange={e => setSettings({...settings, DHAN_ACCESS_TOKEN: e.target.value})}
                    placeholder="Paste Access Token"
                    className={`w-full bg-bg/50 border border-border rounded-2xl py-4 px-6 text-sm font-mono focus:border-primary/50 transition-all outline-none h-32 ${!showBrokerCreds ? 'blur-sm select-none' : ''}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button onClick={testBroker} className="flex items-center gap-2 bg-white/5 border border-border px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
                 <RefreshCw size={14} /> Test Connection
               </button>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-danger" />
                  <span className="text-[9px] font-black text-text-faint uppercase tracking-widest">Disconnected</span>
               </div>
            </div>
          </div>
        )}

        {/* Tab 2: Risk */}
        {activeTab === 'risk' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-black font-syne text-text uppercase italic">Risk Management</h2>
              <p className="text-xs font-bold text-text-dim uppercase tracking-widest mt-2">These settings protect your capital. VEGA will automatically pause trading if daily loss exceeds your limit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { label: 'Starting Capital (₹)', key: 'TOTAL_CAPITAL', desc: 'How much money are you trading with?' },
                 { label: 'Max Risk Per Trade (%)', key: 'MAX_RISK_PER_TRADE', desc: 'Maximum % of capital to risk on a single trade. Default: 1%' },
                 { label: 'Max Daily Loss (%)', key: 'MAX_DAILY_LOSS', desc: 'VEGA stops trading if you lose this much in a day. Default: 3%' },
                 { label: 'Daily Profit Target (%)', key: 'DAILY_PROFIT_TARGET', desc: 'VEGA locks in profits and stops when you hit this. Default: 6%' },
                 { label: 'Min Reward:Risk Ratio', key: 'MIN_RR_RATIO', desc: 'Only enter trades where potential profit is at least X times the risk.' }
               ].map(field => (
                 <div key={field.key} className="space-y-4">
                    <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1">{field.label}</label>
                    <input
                      type="number"
                      value={settings[field.key]}
                      onChange={e => setSettings({...settings, [field.key]: parseFloat(e.target.value)})}
                      className="w-full bg-bg/50 border border-border rounded-2xl py-4 px-6 text-sm font-mono focus:border-primary/50 transition-all outline-none"
                    />
                    <p className="text-[9px] text-text-dim italic">{field.desc}</p>
                 </div>
               ))}

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1">Position Sizing Method</label>
                  <select
                    value={settings.POSITION_SIZING}
                    onChange={e => setSettings({...settings, POSITION_SIZING: e.target.value})}
                    className="w-full bg-bg/50 border border-border rounded-2xl py-4 px-6 text-sm font-black uppercase tracking-widest focus:border-primary/50 outline-none"
                  >
                    <option value="atr">ATR-based (Volatility Adjusted)</option>
                    <option value="fixed">Fixed (Constant Amount)</option>
                    <option value="kelly">Kelly Criterion (Optimal Growth)</option>
                  </select>
                  <p className="text-[9px] text-text-dim italic uppercase">Mathematical approach to determine share quantity.</p>
               </div>

               <div className="flex items-center justify-between p-6 bg-bg/40 rounded-3xl border border-border">
                  <div className="space-y-1">
                     <span className="text-[10px] font-black text-text uppercase tracking-widest">Trailing Stop Loss</span>
                     <p className="text-[9px] text-text-faint font-bold uppercase tracking-widest">Secure profits by moving SL as price rises</p>
                  </div>
                  <button
                    onClick={() => setSettings({...settings, TRAILING_SL: !settings.TRAILING_SL})}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.TRAILING_SL ? 'bg-primary' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.TRAILING_SL ? 'left-7' : 'left-1'}`} />
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* Tab 3: Theme */}
        {activeTab === 'theme' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-black font-syne text-text uppercase italic">Personalize VEGA</h2>
              <p className="text-xs font-bold text-text-dim uppercase tracking-widest mt-2">Make it yours. Changes apply instantly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                 <div>
                   <label className="text-[10px] font-black text-text uppercase tracking-widest block ml-1 mb-2">Accent Color</label>
                   <p className="text-[9px] text-text-dim uppercase font-bold mb-4 tracking-widest">Used for highlights, active states, and logo</p>
                   <HexColorPicker color={theme.primary} onChange={c => setTheme({...theme, primary: c})} className="!w-full !h-40" />
                   <div className="flex gap-2 mt-4">
                      {['#F5C518', '#3B82F6', '#00D4A0', '#FF4560', '#A855F7'].map(c => (
                        <button key={c} onClick={() => setTheme({...theme, primary: c})} className="w-8 h-8 rounded-full border border-white/10 hover:scale-110 transition-transform" style={{backgroundColor: c}} />
                      ))}
                   </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-text uppercase tracking-widest block ml-1 mb-2">Background</label>
                    <p className="text-[9px] text-text-dim uppercase font-bold mb-4 tracking-widest">The base color of the interface</p>
                    <HexColorPicker color={theme.bg} onChange={c => setTheme({...theme, bg: c})} className="!w-full !h-40" />
                 </div>
               </div>

               <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1 mb-6">Background Style</label>
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         { id: 'Deep Space', desc: 'Stars and rotating meshes' },
                         { id: 'Particle Network', desc: 'Connecting nodes on hover' },
                         { id: 'Clean Dark', desc: 'Minimalist static background' }
                       ].map(s => (
                         <button
                           key={s.id}
                           onClick={() => setTheme({...theme, style: s.id})}
                           className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${theme.style === s.id ? 'bg-primary/10 border-primary/40 text-primary shadow-xl' : 'bg-bg/50 border-border text-text-dim'}`}
                         >
                           <div className="text-left">
                             <span className="text-[10px] font-black uppercase tracking-widest block">{s.id}</span>
                             <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">{s.desc}</span>
                           </div>
                           {theme.style === s.id && <CheckCircle2 size={16} />}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                     <div className="flex justify-between items-end">
                       <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1">Effect Intensity</label>
                       <span className="text-[10px] font-mono font-bold text-primary">{theme.intensity}%</span>
                     </div>
                     <input type="range" min="0" max="100" value={theme.intensity} onChange={e => setTheme({...theme, intensity: parseInt(e.target.value)})} className="w-full accent-primary" />
                     <p className="text-[9px] text-text-dim italic">How dramatic is the background effect?</p>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={updateTheme} className="flex-1 py-4 bg-primary text-bg font-black uppercase text-[10px] rounded-2xl tracking-widest shadow-lg shadow-primary/10 hover:brightness-110">Apply Changes</button>
                    <button onClick={resetTheme} className="px-6 py-4 bg-white/5 border border-border text-text-faint font-black uppercase text-[10px] rounded-2xl hover:text-text transition-all">Reset</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Tab 4: Watchlist */}
        {activeTab === 'watchlist' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-black font-syne text-text uppercase italic">Your Watchlist</h2>
              <p className="text-xs font-bold text-text-dim uppercase tracking-widest mt-2">VEGA scans these symbols every minute for trading opportunities. Current count: {settings.WATCHLIST.length}</p>
            </div>

            <div className="flex flex-wrap gap-3 p-6 bg-bg/40 rounded-[32px] border border-border min-h-[200px] content-start">
               {settings.WATCHLIST.map(s => (
                 <div key={s} className="bg-surface border border-border-bright px-4 py-2 rounded-xl flex items-center gap-3 group hover:border-danger/40 transition-all shadow-sm">
                    <span className="text-[11px] font-black uppercase italic font-syne tracking-widest">{s}</span>
                    <button onClick={() => setSettings({...settings, WATCHLIST: settings.WATCHLIST.filter(x => x !== s)})} className="text-text-faint hover:text-danger">
                       <X size={12} />
                    </button>
                 </div>
               ))}
               {settings.WATCHLIST.length === 0 && (
                 <div className="w-full h-32 flex items-center justify-center text-text-faint font-black text-[10px] uppercase tracking-widest italic opacity-40">No symbols active</div>
               )}
            </div>

            <div className="flex gap-4">
               <input
                 type="text"
                 placeholder="Type symbol (e.g. BTC) and press Enter..."
                 onKeyDown={e => {
                   if (e.key === 'Enter') {
                     const val = e.target.value.toUpperCase().trim();
                     if (val && !settings.WATCHLIST.includes(val)) {
                        setSettings({...settings, WATCHLIST: [...settings.WATCHLIST, val]});
                        e.target.value = '';
                     }
                   }
                 }}
                 className="flex-1 bg-bg/50 border border-border rounded-2xl py-5 px-8 text-sm font-black uppercase tracking-widest outline-none focus:border-primary/50 transition-all shadow-inner"
               />
               <div className="flex gap-2">
                 <button onClick={() => setSettings({...settings, WATCHLIST: ['RELIANCE','TCS','INFY','HDFCBANK','ICICIBANK','SBIN','BHARTIARTL','ITC','ASIANPAINT','TITAN']})} className="px-6 bg-white/5 border border-border rounded-2xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">Top 10</button>
               </div>
            </div>
          </div>
        )}

        {/* Tab 5: Security */}
        {activeTab === 'security' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-black font-syne text-text uppercase italic">Security Settings</h2>
              <p className="text-xs font-bold text-text-dim uppercase tracking-widest mt-2">Keep your VEGA node secure. Unauthorized access can be catastrophic.</p>
            </div>

            <div className="space-y-8 max-w-lg">
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1">Emergency Kill Token</label>
                 <div className="relative">
                   <input
                     type={showKillToken ? 'text' : 'password'}
                     value={settings.KILL_TOKEN}
                     onChange={e => setSettings({...settings, KILL_TOKEN: e.target.value})}
                     className="w-full bg-bg/50 border border-border rounded-2xl py-5 px-8 text-sm font-mono outline-none shadow-inner"
                   />
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                     <button
                       onClick={() => setShowKillToken(!showKillToken)}
                       className="p-2 text-text-faint hover:text-text transition-colors"
                     >
                       {showKillToken ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                     <button onClick={() => {navigator.clipboard.writeText(settings.KILL_TOKEN); alert('Token copied!')}} className="p-2 text-text-faint hover:text-text transition-colors">
                       <Copy size={18} />
                     </button>
                   </div>
                 </div>
                 <p className="text-[9px] text-text-dim italic uppercase tracking-[0.15em] leading-relaxed border-l-2 border-primary pl-4">This token is required to activate the Kill Switch. Keep it secret. Anyone with this token can immediately stop all your trades.</p>
               </div>

               <div className="bg-danger/10 border border-danger/30 p-8 rounded-[32px] flex items-start gap-6">
                  <div className="p-3 bg-danger/20 rounded-2xl">
                    <Shield size={24} className="text-danger" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-black text-danger uppercase tracking-widest">Critical Security Warning</h4>
                    <p className="text-[9px] text-text-dim leading-relaxed uppercase tracking-widest font-bold">Never share your Client Secret, Access Token, or Kill Token. Local storage is used for convenience, but ensure your system user is protected.</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Tab 6: Telegram */}
        {activeTab === 'telegram' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-black font-syne text-text uppercase italic">Telegram Pulse Alerts</h2>
              <p className="text-xs font-bold text-text-dim uppercase tracking-widest mt-2">Get real-time notifications about trades, signals, and daily summaries on Telegram.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1">Bot API Token</label>
                    <input
                      type="password"
                      value={settings.TELEGRAM_BOT_TOKEN}
                      onChange={e => setSettings({...settings, TELEGRAM_BOT_TOKEN: e.target.value})}
                      placeholder="Paste token from @BotFather"
                      className="w-full bg-bg/50 border border-border rounded-2xl py-5 px-8 text-sm font-mono outline-none shadow-inner"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-faint uppercase tracking-widest block ml-1">Personal Chat ID</label>
                    <input
                      type="text"
                      value={settings.TELEGRAM_CHAT_ID}
                      onChange={e => setSettings({...settings, TELEGRAM_CHAT_ID: e.target.value})}
                      placeholder="Your numerical Chat ID"
                      className="w-full bg-bg/50 border border-border rounded-2xl py-5 px-8 text-sm font-mono outline-none shadow-inner"
                    />
                  </div>

                  <button className="w-full py-5 bg-white/5 border border-border rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-3">
                    <Send size={16} /> Send System Test Message
                  </button>
               </div>

               <div className="bg-bg/40 border border-border p-10 rounded-[40px] space-y-8 shadow-inner">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-primary" />
                     <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-text">Setup Guide</h4>
                  </div>
                  <ol className="space-y-6 text-[10px] font-bold text-text-dim uppercase tracking-widest leading-loose">
                    <li className="flex gap-4"><span className="text-primary opacity-40">01</span> Open Telegram and search for @BotFather</li>
                    <li className="flex gap-4"><span className="text-primary opacity-40">02</span> Type /newbot and follow instructions</li>
                    <li className="flex gap-4"><span className="text-primary opacity-40">03</span> Copy Bot Token and paste to the left</li>
                    <li className="flex gap-4"><span className="text-primary opacity-40">04</span> Message @userinfobot to get your Chat ID</li>
                    <li className="flex gap-4"><span className="text-primary opacity-40">05</span> Save settings and send test message</li>
                  </ol>
               </div>
            </div>
          </div>
        )}
      </div>

      <footer className="flex justify-between items-center text-[10px] font-black text-text-faint uppercase tracking-[0.4em] opacity-40 pt-10 border-t border-border">
        <div className="flex gap-10">
          <span>VEGA NODE v2.0.0</span>
          <span>UPTIME: 100.0%</span>
        </div>
        <span>SYSTEM_STATUS: OK</span>
      </footer>
    </div>
  );
};

export default Config;
