import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

const ThemeCustomizer = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('vega_theme_v2');
    return saved ? JSON.parse(saved) : {
      primary: '#F7F7F5',
      secondary: '#F5C518',
      background: 'deepspace',
      intensity: 1
    };
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
    localStorage.setItem('vega_theme_v2', JSON.stringify(theme));
  }, [theme]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-10 overflow-y-auto max-h-full custom-scrollbar">
      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-primary/40 tracking-widest block">Primary Color</label>
          <HexColorPicker color={theme.primary} onChange={(c) => setTheme({ ...theme, primary: c })} style={{ width: '100%' }} />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-primary/40 tracking-widest block">Accent Color</label>
          <HexColorPicker color={theme.secondary} onChange={(c) => setTheme({ ...theme, secondary: c })} style={{ width: '100%' }} />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-black uppercase text-primary/40 tracking-widest block mb-4">Background Mode</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme({ ...theme, background: 'deepspace' })}
              className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest ${theme.background === 'deepspace' ? 'bg-secondary text-ink' : 'bg-white/5 border border-white/10 text-primary/40 hover:bg-white/10'}`}
            >
              Deep Space
            </button>
            <button
              onClick={() => setTheme({ ...theme, background: 'aurora' })}
              className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest ${theme.background === 'aurora' ? 'bg-secondary text-ink' : 'bg-white/5 border border-white/10 text-primary/40 hover:bg-white/10'}`}
            >
              Aurora
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-primary/40 tracking-widest block mb-4">Motion Intensity</label>
          <input
            type="range" min="0" max="2" step="0.1"
            value={theme.intensity}
            onChange={(e) => setTheme({ ...theme, intensity: parseFloat(e.target.value) })}
            className="w-full accent-secondary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
