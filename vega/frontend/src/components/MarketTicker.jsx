import React from 'react';
import useVegaStore from '../store/useVegaStore';

const MarketTicker = () => {
  const { logs } = useVegaStore(); // Mock ticker items using logs or constants
  const items = [
    { s: 'NIFTY 50', p: '22,453.20', c: '+1.2%' },
    { s: 'RELIANCE', p: '2,945.30', c: '+0.8%' },
    { s: 'HDFCBANK', p: '1,452.10', c: '-0.4%' },
    { s: 'TCS', p: '3,892.45', c: '+2.1%' },
    { s: 'INFY', p: '1,623.00', c: '+0.2%' },
    { s: 'ICICIBANK', p: '1,012.35', c: '+1.1%' },
    { s: 'SBIN', p: '752.40', c: '-1.2%' },
  ];

  return (
    <div className="fixed top-16 left-0 w-full h-8 bg-black/40 backdrop-blur-md border-b border-white/5 z-40 flex items-center overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap px-8">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-3 mr-12 group cursor-default">
            <span className="text-[9px] font-black text-primary/40 uppercase group-hover:text-secondary transition-colors">{item.s}</span>
            <span className="text-[9px] font-mono text-white/80">{item.p}</span>
            <span className={`text-[9px] font-black ${item.c.startsWith('+') ? 'text-success' : 'text-danger'}`}>
              {item.c}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MarketTicker;
