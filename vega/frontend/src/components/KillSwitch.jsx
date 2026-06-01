import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import useVegaStore from '../store/useVegaStore';

const KillSwitch = () => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const requestRef = useRef();
  const startTimeRef = useRef();
  const isKilled = useVegaStore(state => state.isKilled);

  const HOLD_DURATION = 3000; // 3 seconds

  const animate = (time) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    const newProgress = Math.min(elapsed / HOLD_DURATION, 1);

    setProgress(newProgress);

    if (newProgress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      executeKill();
    }
  };

  const executeKill = async () => {
    setHolding(false);
    setProgress(0);
    try {
      const token = localStorage.getItem('vega_kill_token') || 'change_this_before_going_live';
      await api.post('/kill', { token });
      console.log('Kill signal sent successfully');
    } catch (err) {
      console.error('Kill signal failed:', err);
      // Even if API fails, we show local killed state for safety
      useVegaStore.getState().setKilled(true);
    }
  };

  const startHolding = () => {
    if (isKilled) return;
    setHolding(true);
    startTimeRef.current = null;
    requestRef.current = requestAnimationFrame(animate);
  };

  const stopHolding = () => {
    setHolding(false);
    setProgress(0);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  // SVG ring properties
  const size = 44;
  const strokeWidth = 4;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <div
      className="relative flex items-center justify-center group cursor-pointer"
      onMouseDown={startHolding}
      onMouseUp={stopHolding}
      onMouseLeave={stopHolding}
      onTouchStart={startHolding}
      onTouchEnd={stopHolding}
    >
      <div className={`
        w-[120px] h-[36px] bg-kill text-white font-mono font-black text-[10px] tracking-[0.2em]
        flex items-center justify-center transition-all active:scale-95 select-none
        ${holding ? 'brightness-125' : 'hover:brightness-110'}
        ${isKilled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
      `}>
        {holding ? 'HOLDING...' : 'KILL SWITCH'}
      </div>

      <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full ml-4">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 69, 96, 0.2)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--danger)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: offset,
              transition: holding ? 'none' : 'stroke-dashoffset 0.2s ease-out'
            }}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default KillSwitch;
