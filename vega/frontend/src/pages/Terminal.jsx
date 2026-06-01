import React, { useState } from 'react';
import { Search } from 'lucide-react';
import useVegaStore from '../store/useVegaStore';
import SignalCard from '../components/SignalCard';
import PositionRow from '../components/PositionRow';
import TradingViewChart from '../components/TradingViewChart';

const formatTVSymbol = (symbol) => {
  const nseStocks = ['RELIANCE','TCS','INFY','HDFCBANK','ICICIBANK','SBIN','BHARTIARTL','ITC','ASIANPAINT','TITAN','KOTAKBANK','AXISBANK','HINDUNILVR','BAJFINANCE','LT','MARUTI','HCLTECH','SUNPHARMA'];
  if (nseStocks.includes(symbol.toUpperCase())) return `NSE:${symbol.toUpperCase()}`;

  const cryptoMap = { 'BTC': 'BINANCE:BTCUSDT', 'ETH': 'BINANCE:ETHUSDT', 'BNB': 'BINANCE:BNBUSDT' };
  if (cryptoMap[symbol.toUpperCase()]) return cryptoMap[symbol.toUpperCase()];

  if (symbol.includes(':')) return symbol.toUpperCase();

  return `NSE:${symbol.toUpperCase()}`;
};

const Terminal = () => {
  const [inputSymbol, setInputSymbol] = useState('RELIANCE');
  const [chartSymbol, setChartSymbol] = useState('NSE:RELIANCE');
  const { signals, positions } = useVegaStore();

  const handleSymbolSubmit = (e) => {
    e.preventDefault();
    setChartSymbol(formatTVSymbol(inputSymbol));
  };

  return (
    <div className="h-[calc(100vh-92px)] flex flex-col p-4 gap-4 overflow-hidden">
      <div className="flex flex-1 gap-4 min-h-0">
        {/* LEFT PANEL - CHART */}
        <div className="flex-[6] bg-surface rounded-2xl border border-border flex flex-col overflow-hidden shadow-2xl relative">
          <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-surface2/30 backdrop-blur-sm z-10">
            <form onSubmit={handleSymbolSubmit} className="flex items-center gap-3 bg-bg/50 px-4 py-2 rounded-xl border border-border focus-within:border-primary/50 transition-all">
              <Search size={14} className="text-text-faint" />
              <input
                type="text"
                value={inputSymbol}
                onChange={(e) => setInputSymbol(e.target.value)}
                placeholder="RELIANCE, BTC, NASDAQ:AAPL..."
                className="bg-transparent border-none outline-none text-xs font-bold text-text placeholder:text-text-faint w-48"
              />
            </form>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-text-faint uppercase tracking-widest">Active: {chartSymbol}</span>
            </div>
          </div>
          <div className="flex-1 w-full">
            <TradingViewChart symbol={chartSymbol} />
          </div>
        </div>

        {/* RIGHT PANEL - SIGNALS & INVENTORY */}
        <div className="flex-[4] flex flex-col gap-4 min-h-0">
          {/* SIGNALS */}
          <div className="flex-[6] bg-surface rounded-2xl border border-border flex flex-col overflow-hidden shadow-xl">
             <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-surface2/30">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Signal Pulse</span>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                   <span className="text-[9px] font-mono font-black text-success uppercase">Scanning</span>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
               {signals.length > 0 ? (
                 signals.map((signal, idx) => (
                   <SignalCard key={idx} signal={signal} />
                 ))
               ) : (
                 <div className="h-full flex items-center justify-center text-text-faint font-black text-[10px] uppercase tracking-widest italic">
                    Awaiting Signal Pulse...
                 </div>
               )}
             </div>
          </div>

          {/* INVENTORY */}
          <div className="flex-[4] bg-surface rounded-2xl border border-border flex flex-col overflow-hidden shadow-lg">
             <div className="h-12 border-b border-border flex items-center px-6 bg-surface2/30">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Active Inventory</span>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar">
               <table className="w-full text-left">
                 <thead className="sticky top-0 bg-surface text-[9px] font-black text-text-faint uppercase tracking-widest border-b border-border">
                   <tr>
                     <th className="px-6 py-4">Symbol</th>
                     <th className="px-6 py-4">Side</th>
                     <th className="px-6 py-4 text-right">P&L</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border/10">
                   {positions.length > 0 ? (
                     positions.map((pos, idx) => (
                       <PositionRow key={idx} pos={pos} />
                     ))
                   ) : (
                     <tr>
                       <td colSpan="3" className="py-20 text-center text-text-faint font-black text-[10px] uppercase tracking-widest">No Positions</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="h-8 flex items-center justify-between px-6 bg-surface/40 backdrop-blur-sm rounded-xl border border-border/50">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-success" />
               <span className="text-[8px] font-black text-text-faint uppercase tracking-widest">Node: Online</span>
            </div>
         </div>
         <div className="text-[8px] font-black text-text-faint uppercase tracking-[0.2em]">
            VEGA 2.0
         </div>
      </footer>
    </div>
  );
};

export default Terminal;
