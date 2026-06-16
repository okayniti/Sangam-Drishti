// ═══════════════════════════════════════════════════════════════════════════════
// APP — Master layout for Event Ops Command Center
// 2-row grid: TacticalMap + RealTimeMetrics (top), TriagePipeline + ControlPanel (bottom)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useSocket } from './context/SocketContext';
import TacticalMap from './components/TacticalMap';
import TriagePipeline from './components/TriagePipeline';
import RealTimeMetrics from './components/RealTimeMetrics';
import ControlPanel from './components/ControlPanel';
import Login from './components/Login';
import { Shield, Clock, Wifi, WifiOff, Activity, Sun, Moon } from 'lucide-react';

const WaveBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor" className="text-orange-100 dark:text-orange-900" />
      <path d="M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z" fill="currentColor" className="text-orange-200 dark:text-orange-800" />
      <path d="M0,70 Q25,50 50,70 T100,70 L100,100 L0,100 Z" fill="currentColor" className="text-orange-300/80 dark:text-orange-700" />
    </svg>
  </div>
);

export default function App() {
  const { connected, paused, incidents, volunteers } = useSocket();
  const [clock, setClock] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Strictly inject dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      now.setFullYear(2028);
      setClock(now);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const deployedUnits = volunteers.filter((v) => v.status !== 'Available').length;

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
  }

  return (
    <div className="h-screen flex flex-col bg-orange-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden animate-fade-in relative transition-colors duration-300">
      <WaveBackground />
      {/* ─── Header Bar ──────────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex flex-col border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl z-50 transition-colors duration-300">
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 16 4 L 24 18 L 8 18 Z" stroke="#ea580c" strokeWidth="2" strokeLinejoin="round" fill="#fff7ed" />
                <path d="M 16 4 L 16 18" stroke="#ea580c" strokeWidth="2" />
                <path d="M 4 22 Q 10 18, 16 22 T 28 22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <path d="M 4 26 Q 10 22, 16 26 T 28 26" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 animate-pulse" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                MAHAKUMBH 2028 ICCC
                <span className="text-[9px] font-mono font-medium text-slate-500 dark:text-slate-600 bg-slate-100 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">
                  v2.0
                </span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-600 font-mono tracking-widest uppercase">
                Sector-Wise Telemetry Engine
              </p>
            </div>
          </div>

          {/* Center Stats */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <Activity className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-100">{activeIncidents}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <Activity className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-100">{deployedUnits}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">DEPLOYED</span>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {paused && (
              <span className="status-badge bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 px-2.5 py-1">
                ⏸ PAUSED
              </span>
            )}
            <div className="hidden sm:flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
              <span className="text-xs font-mono font-medium tabular-nums text-slate-600 dark:text-slate-400">
                {clock.toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {connected ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-red-500" />
              )}
              <div
                className={`w-2 h-2 rounded-full ${
                  connected
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                    : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                }`}
              />
              <span
                className={`text-[10px] font-bold tracking-wider ${
                  connected ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {connected ? 'LINK ACTIVE' : 'DISCONNECTED'}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Top Nav Tabs ────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 px-5 bg-slate-50 dark:bg-slate-900/90 pt-2 transition-colors duration-300 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 rounded-t-lg ${
              activeTab === 'overview'
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-500 shadow-[0_-4px_24px_-10px_rgba(245,158,11,0.1)] dark:shadow-[0_-4px_24px_-10px_rgba(245,158,11,0.3)]'
                : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-900/50'
            }`}
          >
            <span>🛰️</span> Overview Dashboard
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 rounded-t-lg ${
              activeTab === 'pipeline'
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-500 shadow-[0_-4px_24px_-10px_rgba(245,158,11,0.1)] dark:shadow-[0_-4px_24px_-10px_rgba(245,158,11,0.3)]'
                : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-900/50'
            }`}
          >
            <span>📋</span> Incident Triage Pipeline
          </button>
          <button
            onClick={() => setActiveTab('control')}
            className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 rounded-t-lg ${
              activeTab === 'control'
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-500 shadow-[0_-4px_24px_-10px_rgba(245,158,11,0.1)] dark:shadow-[0_-4px_24px_-10px_rgba(245,158,11,0.3)]'
                : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-900/50'
            }`}
          >
            <span>🎛️</span> Control Panel & Settings
          </button>
        </div>
      </header>

      {/* ─── Main Dashboard Area ─────────────────────────────────────── */}
      <main className="flex-1 p-3 min-h-0 overflow-hidden flex flex-col z-10">
        {activeTab === 'overview' && (
          <div className="flex-1 grid grid-cols-[1fr_380px] gap-3 min-h-0 animate-fade-in">
            <TacticalMap />
            <RealTimeMetrics />
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="flex-1 min-h-0 animate-fade-in flex flex-col">
            <TriagePipeline />
          </div>
        )}

        {activeTab === 'control' && (
          <div className="flex-1 max-w-4xl mx-auto w-full min-h-0 animate-fade-in flex flex-col pt-8">
            <ControlPanel />
          </div>
        )}
      </main>
    </div>
  );
}
