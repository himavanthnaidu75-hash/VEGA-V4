import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Terminal from './pages/Terminal';
import Scanner from './pages/Scanner';
import Config from './pages/Config';
import Analytics from './pages/Analytics';
import TopBar from './components/TopBar';
import MarketTicker from './components/MarketTicker';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ink">
        <TopBar />
        <MarketTicker />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/config" element={<Config />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
