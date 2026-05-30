import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Play, Loader2 } from 'lucide-react';

const DiagnosticPanel = () => {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);

  const runDiagnostics = async () => {
    setRunning(true);
    setResults([]);
    try {
      const { data } = await axios.get('/api/diagnostics/run');
      // Simulate sequential animation
      for (const step of data.steps) {
        setResults(prev => [...prev, step]);
        await new Promise(r => setTimeout(r, 600));
      }
    } catch (e) {
      console.error('Diagnostics failed', e);
      setResults(prev => [...prev, { name: 'Critical Failure', status: 'FAIL', detail: 'API Communication Error' }]);
    } finally {
      setRunning(false);
    }
  };

  const getIcon = (status) => {
    switch (status) {
      case 'PASS': return <CheckCircle2 size={14} className="text-success" />;
      case 'FAIL': return <XCircle size={14} className="text-danger" />;
      default: return <AlertCircle size={14} className="text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[9px] font-black text-text-faint uppercase tracking-widest">System Health Diagnostics</span>
        <button
          onClick={runDiagnostics}
          disabled={running}
          className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-bg transition-all disabled:opacity-50"
        >
          {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
          {running ? 'Running...' : 'Run Diagnostics'}
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between bg-bg/50 border border-border p-3 rounded-xl"
            >
              <div className="flex items-center gap-3">
                {getIcon(r.status)}
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-text uppercase tracking-tight">{r.name}</span>
                  <span className="text-[8px] font-bold text-text-faint uppercase">{r.detail}</span>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold text-text-dim">{r.latency}ms</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {!running && results.length === 0 && (
          <div className="py-12 text-center text-text-faint text-[9px] font-black uppercase tracking-widest italic">
            Diagnostics Ready
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticPanel;
