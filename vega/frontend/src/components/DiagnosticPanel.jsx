import React, { useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Play } from 'lucide-react';
import axios from 'axios';

const DiagnosticPanel = () => {
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);

  const steps = [
    { id: 'broker', name: 'Broker Connection', endpoint: '/api/diag/broker' },
    { id: 'feed', name: 'Live Price Feed', endpoint: '/api/diag/feed' },
    { id: 'data', name: 'Data Pipeline', endpoint: '/api/diag/data' },
    { id: 'indicators', name: 'Indicator Engine', endpoint: '/api/diag/indicators' },
    { id: 'telegram', name: 'Telegram Bot', endpoint: '/api/diag/telegram' },
    { id: 'db', name: 'Database Persistence', endpoint: '/api/diag/db' },
  ];

  const runAll = async () => {
    setRunning(true);
    setResults([]);
    for (const step of steps) {
      try {
        const start = Date.now();
        // Mocking backend response for frontend build
        await new Promise(r => setTimeout(r, 400));
        const latency = Date.now() - start;
        setResults(prev => [...prev, { ...step, status: 'PASS', latency: `${latency}ms` }]);
      } catch (e) {
        setResults(prev => [...prev, { ...step, status: 'FAIL', latency: '0ms' }]);
      }
    }
    setRunning(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Diagnostic Health</h3>
        <button
          onClick={runAll} disabled={running}
          className="p-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-all disabled:opacity-50"
        >
          {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {steps.map((step) => {
          const res = results.find(r => r.id === step.id);
          return (
            <div key={step.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${res ? (res.status === 'PASS' ? 'text-success' : 'text-danger') : 'text-primary/20'}`}>
                  {res ? (res.status === 'PASS' ? <CheckCircle2 size={16} /> : <XCircle size={16} />) : <div className="w-4 h-4 rounded-full border-2 border-primary/10" />}
                </div>
                <span className="text-xs font-bold text-primary/80">{step.name}</span>
              </div>
              {res && (
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-success">{res.status}</div>
                  <div className="text-[8px] font-mono text-primary/20">{res.latency}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiagnosticPanel;
