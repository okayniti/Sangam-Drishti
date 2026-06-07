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
import { Shield, Clock, Wifi, WifiOff, Activity } from 'lucide-react';

export default function App() {
  const { connected, paused, incidents, volunteers } = useSocket();
  const [clock, setClock] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-tactical-black font-sans text-white overflow-hidden animate-fade-in">
      {/* ─── Header Bar ──────────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex flex-col border-b border-slate-800/50 bg-zinc-950/90 backdrop-blur-xl z-50">
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-7 h-7 text-indigo-500" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
                MAHAKUMBH 2028 INTEGRATED COMMAND CONTROL CENTER (ICCC)
                <span className="text-[9px] font-mono font-medium text-slate-600 bg-slate-800/50 px-1.5 py-0.5 rounded">
                  v2.0
                </span>
              </h1>
              <p className="text-[10px] text-slate-600 font-mono tracking-widest">
                SECTOR-WISE CROWD TELEMETRY & TACTICAL SEVADAR DISPATCH ENGINE
              </p>
            </div>
          </div>

          {/* Center Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-800/40 border border-slate-800/30">
              <Activity className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-bold text-slate-300">{activeIncidents}</span>
              <span className="text-[10px] text-slate-600">ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-800/40 border border-slate-800/30">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-slate-300">{deployedUnits}</span>
              <span className="text-[10px] text-slate-600">DEPLOYED</span>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5">
            {paused && (
              <span className="status-badge bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1">
                ⏸ PAUSED
              </span>
            )}
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-xs font-mono font-medium tabular-nums">
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
                  connected ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {connected ? 'LINK ACTIVE' : 'DISCONNECTED'}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Top Nav Tabs ────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 px-5 bg-zinc-950/60 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 rounded-t-lg ${
              activeTab === 'overview'
                ? 'text-amber-400 bg-amber-500/10 border-amber-500 shadow-[0_-4px_24px_-10px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span>🛰️</span> Overview Dashboard
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 rounded-t-lg ${
              activeTab === 'pipeline'
                ? 'text-amber-400 bg-amber-500/10 border-amber-500 shadow-[0_-4px_24px_-10px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span>📋</span> Incident Triage Pipeline
          </button>
          <button
            onClick={() => setActiveTab('control')}
            className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 rounded-t-lg ${
              activeTab === 'control'
                ? 'text-amber-400 bg-amber-500/10 border-amber-500 shadow-[0_-4px_24px_-10px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span>🎛️</span> Control Panel & Settings
          </button>
        </div>
      </header>

      {/* ─── Main Dashboard Area ─────────────────────────────────────── */}
      <main className="flex-1 p-3 min-h-0 overflow-hidden flex flex-col">
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
