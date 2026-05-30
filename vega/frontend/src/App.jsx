import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Terminal from './pages/Terminal';
import Scanner from './pages/Scanner';
import Config from './pages/Config';
import Analytics from './pages/Analytics';
import TopBar from './components/TopBar';
import MarketTicker from './components/MarketTicker';

const ProtectedRoute = ({ children }) => {
  const isDone = localStorage.getItem('vega_onboarding_done') === 'true';
  if (!isDone) return <Navigate to="/onboarding" />;
  return children;
};

function App() {
  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem('vega_theme_v2'));
    if (theme) {
      document.documentElement.style.setProperty('--color-primary', theme.primary);
      document.documentElement.style.setProperty('--color-secondary', theme.secondary);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-ink">
        <TopBar />
        <MarketTicker />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/terminal" element={<ProtectedRoute><Terminal /></ProtectedRoute>} />
          <Route path="/scanner" element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
          <Route path="/config" element={<ProtectedRoute><Config /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
