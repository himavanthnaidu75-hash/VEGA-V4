import React, { useEffect, useRef, useState } from 'react';
import useVegaStore from '../store/useVegaStore';
import useWebSocket from '../hooks/useWebSocket';
import SignalCard from '../components/SignalCard';
import PositionRow from '../components/PositionRow';
import GreeksDisplay from '../components/GreeksDisplay';
import { createChart, ColorType } from 'lightweight-charts';
import axios from 'axios';

const Terminal = () => {
  useWebSocket();
  const { positions, signals } = useVegaStore();
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const [symbol, setSymbol] = useState('RELIANCE');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#F7F7F5',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00B37E', downColor: '#E83535', borderVisible: false,
      wickUpColor: '#00B37E', wickDownColor: '#E83535',
    });

    const ema9 = chart.addLineSeries({ color: '#FFFFFF', lineWidth: 1, title: 'EMA 9' });
    const ema21 = chart.addLineSeries({ color: '#F5C518', lineWidth: 1, title: 'EMA 21' });
    const ema50 = chart.addLineSeries({ color: '#2962FF', lineWidth: 2, title: 'EMA 50' });
    const ema200 = chart.addLineSeries({ color: '#FF6D00', lineWidth: 2, title: 'EMA 200' });

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/ohlcv?symbol=${symbol}&interval=5m`);
        const data = res.data;
        if (data.length > 0) {
          candlestickSeries.setData(data);

          // Calculate EMAs (simplified frontend calculation for visualization)
          const calcEMA = (data, p) => {
            const k = 2 / (p + 1);
            let emaData = [];
            let prev = data[0].close;
            for (let i = 0; i < data.length; i++) {
              const val = data[i].close * k + prev * (1 - k);
              emaData.push({ time: data[i].time, value: val });
              prev = val;
            }
            return emaData;
          };

          ema9.setData(calcEMA(data, 9));
          ema21.setData(calcEMA(data, 21));
          ema50.setData(calcEMA(data, 50));
          ema200.setData(calcEMA(data, 200));
        }
      } catch (e) {
        console.error("Chart fetch failed", e);
      }
    };

    fetchData();
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol]);

  return (
    <div className="pt-24 px-8 pb-10 grid grid-cols-12 gap-8 h-screen overflow-hidden">
      <div className="col-span-8 flex flex-col gap-6">
        <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden">
          <div ref={chartContainerRef} className="w-full h-full" />
          <div className="absolute top-6 left-6 flex items-center gap-4 z-10">
            <select
              value={symbol} onChange={e => setSymbol(e.target.value)}
              className="bg-ink border border-white/10 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest outline-none text-secondary"
            >
              {['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'NIFTY'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_10px_#00B37E]" />
              <span className="text-[9px] font-black uppercase text-primary/40 tracking-widest">5M PULSE</span>
            </div>
          </div>
        </div>
        <GreeksDisplay />
      </div>

      <div className="col-span-4 flex flex-col gap-8 h-full overflow-hidden">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5">
            <h3 className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Signal Scanner</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {signals.map((s, i) => <SignalCard key={i} sig={s} />)}
            {signals.length === 0 && <div className="h-full flex items-center justify-center text-[10px] text-primary/10 uppercase tracking-widest">Awaiting Pulse...</div>}
          </div>
        </div>

        <div className="h-[35%] bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5">
             <h3 className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Active Portfolio</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {positions.map((p, i) => <PositionRow key={i} pos={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
