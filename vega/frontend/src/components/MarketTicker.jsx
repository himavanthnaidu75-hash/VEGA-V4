import React from 'react';
import useVegaStore from '../store/useVegaStore';

const MarketTicker = () => {
  const tickers = useVegaStore((state) => state.tickers);

  // Transform tickers object into array of [symbol, price]
  const tickerEntries = Object.entries(tickers);

  // Use some defaults if tickers is empty
  const displayTickers = tickerEntries.length > 0 ? tickerEntries : [
    ["NIFTY 50", "22,453.20"], ["SENSEX", "73,876.15"], ["BANK NIFTY", "47,211.80"],
    ["RELIANCE", "2,987.40"], ["TCS", "4,120.55"], ["HDFCBANK", "1,442.10"]
  ];

  return (
    <div className="h-[36px] bg-[#000] border-b border-border flex items-center overflow-hidden z-20">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-12 px-6">
            {displayTickers.map(([symbol, price]) => (
              <div key={symbol} className="flex items-center gap-2">
                <span className="text-[10px] font-black text-text-faint uppercase tracking-widest">{symbol}</span>
                <span className="text-[11px] font-mono font-bold text-primary">{price}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MarketTicker;
