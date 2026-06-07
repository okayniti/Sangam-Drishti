// ═══════════════════════════════════════════════════════════════════════════════
// CONTROL PANEL — System overrides, manual incident injection, and quick actions
// Provides simulator pause/resume, manual incident creation form, and
// pre-built quick-action buttons for emergency scenarios.
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import {
  Settings,
  Zap,
  Pause,
  Play,
  Radio,
  Send,
  AlertTriangle,
  ShieldAlert,
  Siren,
  Wifi,
  WifiOff,
  ServerCrash,
} from 'lucide-react';

export default function ControlPanel() {
  const { inject, togglePause, paused, connected, incidents, volunteers } =
    useSocket();
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('WARNING');
  const [injecting, setInjecting] = useState(false);

  const handleInject = async () => {
    if (!description.trim()) return;
    setInjecting(true);
    await inject(description, priority);
    setDescription('');
    setInjecting(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInject();
    }
  };

  return (
    <div className="glass-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b border-slate-800/50">
        <Settings className="w-4 h-4 text-indigo-400" />
        <h2 className="text-xs font-bold text-slate-200 tracking-widest uppercase">
          Control Panel
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* ─── System Status ─────────────────────────────────────── */}
        <div className="bg-zinc-800/40 rounded-lg p-3 border border-slate-800/30">
          <div className="flex items-center justify-between mb-2">
            <span className="section-title block">System Status</span>
            <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono">
              Configuration Profile: Prayagraj 2028 Mega-Crowd Protocol Enabled
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 flex items-center gap-1.5">
                {connected ? (
                  <Wifi className="w-3 h-3 text-emerald-500" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-500" />
                )}
                Connection
              </span>
              <span
                className={`status-badge ${
                  connected
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {connected ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-slate-600" />
                Simulator
              </span>
              <span
                className={`status-badge ${
                  paused
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {paused ? 'PAUSED' : 'ACTIVE'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <ServerCrash className="w-3 h-3 text-slate-600" />
                Total Alerts
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-300">
                {incidents.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-slate-600" />
                Sevadars Online
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-300">
                {volunteers.length}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Simulator Controls ────────────────────────────────── */}
        <div className="bg-zinc-800/40 rounded-lg p-3 border border-slate-800/30">
          <span className="section-title mb-2 block">Simulator Override</span>
          <button
            onClick={togglePause}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-bold tracking-wide transition-all duration-200 active:scale-[0.98] ${
              paused
                ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/15'
                : 'bg-amber-600/90 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/15'
            }`}
          >
            {paused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
            {paused ? 'RESUME SIMULATOR' : 'PAUSE SIMULATOR'}
          </button>
        </div>

        {/* ─── Manual Incident Injector ──────────────────────────── */}
        <div className="bg-zinc-800/40 rounded-lg p-3 border border-slate-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Siren className="w-3.5 h-3.5 text-amber-400" />
            <span className="section-title">Manual Injection</span>
          </div>
          <div className="space-y-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe incident scenario..."
              rows={2}
              className="w-full bg-zinc-900/70 border border-slate-700/40 rounded-lg px-3 py-2 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 resize-none transition-colors"
            />
            <div className="flex gap-1">
              {['CRITICAL', 'WARNING', 'ROUTINE'].map((p) => {
                const isActive = priority === p;
                const colors = {
                  CRITICAL: isActive
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : 'text-slate-500 border-slate-700/30 hover:border-red-500/20',
                  WARNING: isActive
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'text-slate-500 border-slate-700/30 hover:border-amber-500/20',
                  ROUTINE: isActive
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                    : 'text-slate-500 border-slate-700/30 hover:border-indigo-500/20',
                };
                return (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 px-2 py-1.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all border ${colors[p]}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleInject}
              disabled={!description.trim() || injecting}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600/90 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-[10px] font-bold tracking-wide transition-all duration-200 active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" />
              {injecting ? 'INJECTING...' : 'INJECT INCIDENT'}
            </button>
          </div>
        </div>

        {/* ─── Quick Actions ─────────────────────────────────────── */}
        <div className="bg-zinc-800/40 rounded-lg p-3 border border-slate-800/30">
          <span className="section-title mb-2 block">Quick Actions</span>
          <div className="space-y-1.5">
            <button
              onClick={() =>
                inject(
                  'EMERGENCY EVACUATION DRILL — All zones, all sectors',
                  'CRITICAL'
                )
              }
              className="w-full flex items-center gap-2 px-3 py-2 bg-red-600/15 hover:bg-red-600/25 border border-red-500/20 hover:border-red-500/35 rounded-lg text-[10px] font-bold text-red-400 transition-all active:scale-[0.98]"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Trigger Evacuation Drill
            </button>
            <button
              onClick={() =>
                inject(
                  'MASS MEDICAL ALERT — All medical volunteers report immediately',
                  'WARNING'
                )
              }
              className="w-full flex items-center gap-2 px-3 py-2 bg-amber-600/15 hover:bg-amber-600/25 border border-amber-500/20 hover:border-amber-500/35 rounded-lg text-[10px] font-bold text-amber-400 transition-all active:scale-[0.98]"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Mass Medical Alert
            </button>
            <button
              onClick={() =>
                inject(
                  'COMMS CHECK — System-wide communication relay test',
                  'ROUTINE'
                )
              }
              className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/20 hover:border-indigo-500/35 rounded-lg text-[10px] font-bold text-indigo-400 transition-all active:scale-[0.98]"
            >
              <Radio className="w-3.5 h-3.5" />
              System Comms Check
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
