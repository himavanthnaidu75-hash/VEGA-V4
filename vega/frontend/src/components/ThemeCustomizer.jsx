import React from 'react';

const ThemeCustomizer = () => {
  const updateColor = (variable, value) => {
    document.documentElement.style.setProperty(variable, value);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-8">Environment Customizer</h3>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-[9px] font-black text-primary/30 uppercase tracking-widest mb-3">Primary Accent</label>
            <div className="flex gap-4">
              <input type="color" defaultValue="#F5C518" onChange={e => updateColor('--color-secondary', e.target.value)} className="w-12 h-12 bg-transparent border-none cursor-pointer" />
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[10px] font-mono text-white/60">HEX CODE</span>
                <span className="text-xs font-black uppercase text-secondary">Dynamic</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-black text-primary/30 uppercase tracking-widest mb-3">UI Base</label>
            <div className="flex gap-4">
              <input type="color" defaultValue="#0A0F2C" onChange={e => updateColor('--color-ink', e.target.value)} className="w-12 h-12 bg-transparent border-none cursor-pointer" />
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[10px] font-mono text-white/60">HEX CODE</span>
                <span className="text-xs font-black uppercase text-secondary">Dynamic</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-black text-primary/30 uppercase tracking-widest mb-4">Background Projection</label>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-secondary/10 border border-secondary/30 rounded-2xl text-[10px] font-black text-secondary uppercase tracking-widest">Deep Space</button>
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-primary/40 uppercase tracking-widest hover:bg-white/10 transition-all">Aurora Borealis</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
