import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Terminal from './pages/Terminal';
import Scanner from './pages/Scanner';
import Config from './pages/Config';
import Analytics from './pages/Analytics';
import TopBar from './components/TopBar';
import MarketTicker from './components/MarketTicker';
import ThreeBackground from './components/ThreeBackground';
import useWebSocket from './hooks/useWebSocket';
import useVegaStore from './store/useVegaStore';

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isKilled = useVegaStore((state) => state.isKilled);

  return (
    <div className="relative min-h-screen flex flex-col text-text font-sans overflow-hidden">
      {!isLoginPage && <ThreeBackground />}
      {!isLoginPage && <MarketTicker />}
      {!isLoginPage && <TopBar />}

      <main className="flex-1 relative z-10 overflow-auto">
        {children}
      </main>

      {isKilled && (
        <div className="fixed inset-0 z-[9999] bg-kill flex items-center justify-center animate-pulse">
          <h1 className="text-9xl font-black font-syne text-white tracking-tighter italic">SYSTEM KILLED</h1>
        </div>
      )}
    </div>
  );
};

function App() {
  useWebSocket(); // Initialize global socket connection

  // Load theme from localStorage on boot
  useEffect(() => {
    const primary = localStorage.getItem('vega_primary_color');
    const bg = localStorage.getItem('vega_bg_color');
    if (primary) document.documentElement.style.setProperty('--primary', primary);
    if (bg) document.documentElement.style.setProperty('--bg', bg);
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/config" element={<Config />} />
          <Route path="*" element={<Navigate to="/terminal" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
