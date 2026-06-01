import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

const ThemeCustomizer = () => {
  const [accent, setAccent] = useState(localStorage.getItem('vega_primary_color') || '#F5C518');
  const [bg, setBg] = useState(localStorage.getItem('vega_bg_color') || '#111318');
  const [bgType, setBgType] = useState(localStorage.getItem('vega_bg_type') || 'Deep Space');
  const [intensity, setIntensity] = useState(parseFloat(localStorage.getItem('vega_bg_intensity') || '0.5'));

  const presets = ['#F5C518', '#3B82F6', '#00D4A0', '#FF4560', '#A855F7'];

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', accent);
    localStorage.setItem('vega_primary_color', accent);
  }, [accent]);

  useEffect(() => {
    document.documentElement.style.setProperty('--bg', bg);
    localStorage.setItem('vega_bg_color', bg);
  }, [bg]);

  useEffect(() => {
    localStorage.setItem('vega_bg_type', bgType);
  }, [bgType]);

  useEffect(() => {
    localStorage.setItem('vega_bg_intensity', intensity.toString());
  }, [intensity]);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[9px] font-black text-text-faint uppercase tracking-widest">Accent Color</label>
          <div className="custom-color-picker">
            <HexColorPicker color={accent} onChange={setAccent} />
          </div>
          <div className="flex gap-2 mt-4">
            {presets.map(p => (
              <button
                key={p}
                className="w-6 h-6 rounded-full border border-white/10"
                style={{ backgroundColor: p }}
                onClick={() => setAccent(p)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[9px] font-black text-text-faint uppercase tracking-widest">Background Color</label>
          <div className="custom-color-picker">
            <HexColorPicker color={bg} onChange={setBg} />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-border">
        <div className="flex flex-col gap-2">
           <label className="text-[9px] font-black text-text-faint uppercase tracking-widest">Background Engine</label>
           <div className="flex gap-2 bg-bg/50 p-1 rounded-xl border border-border">
             {['Deep Space', 'Aurora', 'Off'].map(t => (
               <button
                 key={t}
                 onClick={() => setBgType(t)}
                 className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${bgType === t ? 'bg-primary text-bg' : 'text-text-dim hover:text-text'}`}
               >
                 {t}
               </button>
             ))}
           </div>
        </div>

        <div className="flex flex-col gap-4">
           <div className="flex justify-between items-end">
             <label className="text-[9px] font-black text-text-faint uppercase tracking-widest">Atmosphere Intensity</label>
             <span className="text-[10px] font-mono font-bold text-primary">{Math.round(intensity * 100)}%</span>
           </div>
           <input
             type="range" min="0" max="1" step="0.01"
             value={intensity}
             onChange={e => setIntensity(parseFloat(e.target.value))}
             className="w-full accent-primary"
           />
        </div>
      </div>

      <style>{`
        .custom-color-picker .react-colorful {
          width: 100%;
          height: 120px;
        }
        .custom-color-picker .react-colorful__saturation {
          border-radius: 12px 12px 0 0;
        }
        .custom-color-picker .react-colorful__hue {
          height: 12px;
          border-radius: 0 0 12px 12px;
        }
        .custom-color-picker .react-colorful__pointer {
          width: 16px;
          height: 16px;
        }
      `}</style>
    </div>
  );
};

export default ThemeCustomizer;
