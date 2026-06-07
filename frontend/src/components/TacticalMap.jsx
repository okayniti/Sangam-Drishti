import React, { useState, useMemo, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { MapPin, X, Navigation, AlertTriangle, Radio } from 'lucide-react';

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function getZoneColors(ratio, isDarkMode) {
  if (ratio > 0.85) {
    return { fill: isDarkMode ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.1)', stroke: '#ef4444', text: isDarkMode ? '#fca5a5' : '#b91c1c' };
  }
  if (ratio > 0.5) {
    return { fill: isDarkMode ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.1)', stroke: '#f59e0b', text: isDarkMode ? '#fcd34d' : '#b45309' };
  }
  return { fill: isDarkMode ? 'rgba(16,185,129,0.10)' : 'rgba(16,185,129,0.1)', stroke: '#10b981', text: isDarkMode ? '#6ee7b7' : '#047857' };
}

function getVolunteerColor(status) {
  switch (status) {
    case 'Available': return '#10b981';
    case 'En Route':  return '#f59e0b';
    case 'On Scene':  return '#a855f7';
    default:          return '#64748b';
  }
}

function getIncidentColor(priority) {
  switch (priority) {
    case 'CRITICAL': return '#ef4444';
    case 'WARNING':  return '#f59e0b';
    case 'ROUTINE':  return '#6366f1';
    default:         return '#64748b';
  }
}

export default function TacticalMap() {
  const { crowdZones, volunteers, incidents, dispatch } = useSocket();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // To properly catch the class change from App.jsx, we can use an observer
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED');

  // Compute top 3 nearest available volunteers for the selected incident
  const nearestVolunteers = useMemo(() => {
    if (!selectedIncident) return [];
    return volunteers
      .filter((v) => v.status === 'Available')
      .map((v) => ({
        ...v,
        distance: calculateDistance(selectedIncident.x, selectedIncident.y, v.x, v.y),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [selectedIncident, volunteers]);

  const handleIncidentClick = (e, incident) => {
    e.stopPropagation();
    if (incident.status === 'RESOLVED') return;
    setSelectedIncident(incident);
  };

  const handleDispatch = async (volunteerId) => {
    if (!selectedIncident) return;
    await dispatch(volunteerId, selectedIncident.id);
    setSelectedIncident(null);
  };

  return (
    <div className="glass-card flex flex-col relative overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-widest uppercase">
            Tactical Map
          </h2>
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40 px-1.5 py-0.5 rounded">
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> En Route
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> On Scene
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Incident
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 relative min-h-0 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300" onClick={() => setSelectedIncident(null)}>
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="tac-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800/60" strokeWidth="0.5" />
            </pattern>
            {/* Glow filter for volunteers */}
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Stronger glow for incidents */}
            <filter id="hazard-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="700" fill="url(#tac-grid)" />

          {/* Perimeter border */}
          <rect x="10" y="10" width="980" height="680" rx="12" fill="none"
                stroke="currentColor" className="text-indigo-200 dark:text-indigo-500/20" strokeWidth="1.5" strokeDasharray="8 6" />

          {/* ─── Crowd Zones ──────────────────────────────────────── */}
          {crowdZones.map((zone) => {
            const ratio = zone.currentOccupancy / zone.capacity;
            const pct = Math.round(ratio * 100);
            const colors = getZoneColors(ratio, isDarkMode);
            return (
              <g key={zone.id}>
                {/* Zone base rectangle */}
                <rect
                  x={zone.x} y={zone.y}
                  width={zone.width} height={zone.height}
                  rx="6"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="1"
                  strokeOpacity="0.7"
                  strokeDasharray={zone.anomaly ? '6 4' : 'none'}
                />
                {/* Anomaly flash overlay */}
                {zone.anomaly && (
                  <rect
                    x={zone.x} y={zone.y}
                    width={zone.width} height={zone.height}
                    rx="6"
                    fill={isDarkMode ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.05)'}
                  >
                    <animate
                      attributeName="fill-opacity"
                      values="0.3;0.8;0.3"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </rect>
                )}
                {/* Zone label */}
                <text
                  x={zone.x + zone.width / 2} y={zone.y + 20}
                  textAnchor="middle" fill={colors.text}
                  fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif"
                >
                  {zone.name}
                </text>
                {/* Capacity readout */}
                <text
                  x={zone.x + zone.width / 2} y={zone.y + 36}
                  textAnchor="middle" fill="currentColor" className="text-slate-500 dark:text-slate-400"
                  fontSize="9" fontFamily="JetBrains Mono, monospace"
                >
                  {zone.currentOccupancy.toLocaleString()}/{zone.capacity.toLocaleString()} ({pct}%)
                </text>
                {/* Anomaly warning badge inside zone */}
                {zone.anomaly && (
                  <g>
                    <rect
                      x={zone.x + zone.width / 2 - 42} y={zone.y + zone.height - 26}
                      width="84" height="18" rx="4"
                      fill={isDarkMode ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.15)'} stroke="#ef4444" strokeWidth="0.8"
                    />
                    <text
                      x={zone.x + zone.width / 2} y={zone.y + zone.height - 13}
                      textAnchor="middle" fill={isDarkMode ? '#fca5a5' : '#b91c1c'}
                      fontSize="8" fontWeight="800" fontFamily="Inter, sans-serif"
                      letterSpacing="1"
                    >
                      ⚠ CAPACITY ALERT
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ─── Dispatch Route Lines ─────────────────────────────── */}
          {volunteers
            .filter((v) => v.status === 'En Route' && v.assignedIncidentId)
            .map((v) => {
              const inc = incidents.find((i) => i.id === v.assignedIncidentId);
              if (!inc) return null;
              return (
                <line
                  key={`route-${v.id}`}
                  x1={v.x} y1={v.y}
                  x2={inc.x} y2={inc.y}
                  stroke="rgba(245,158,11,0.5)"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-18"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </line>
              );
            })}

          {/* ─── Active Incidents ──────────────────────────────────── */}
          {activeIncidents.map((incident) => {
            const color = getIncidentColor(incident.priority);
            const isSelected = selectedIncident?.id === incident.id;
            return (
              <g
                key={incident.id}
                className="cursor-pointer"
                onClick={(e) => handleIncidentClick(e, incident)}
              >
                {/* Outer pulse ring */}
                <circle cx={incident.x} cy={incident.y} r="8"
                        fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.4">
                  <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* Core marker */}
                <circle
                  cx={incident.x} cy={incident.y} r="9"
                  fill={`${color}cc`} stroke={color} strokeWidth="1.5"
                  filter="url(#hazard-glow)"
                />
                {/* Exclamation icon */}
                <text
                  x={incident.x} y={incident.y + 3.5}
                  textAnchor="middle" fill="white"
                  fontSize="10" fontWeight="900" fontFamily="Inter, sans-serif"
                >
                  !
                </text>
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={incident.x} cy={incident.y} r="28"
                    fill="none" stroke="#3b82f6" strokeWidth="1.5"
                    strokeDasharray="4 3" strokeOpacity="0.8"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${incident.x} ${incident.y}`}
                      to={`360 ${incident.x} ${incident.y}`}
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* ─── Volunteers ───────────────────────────────────────── */}
          {volunteers.map((v) => {
            const color = getVolunteerColor(v.status);
            return (
              <g key={v.id}>
                {/* Outer glow ring */}
                <circle
                  cx={v.x} cy={v.y} r="15"
                  fill={`${color}11`} stroke={`${color}55`} strokeWidth="1"
                />
                {/* Main circle */}
                <circle
                  cx={v.x} cy={v.y} r="12"
                  fill={`${color}20`} stroke={color} strokeWidth="1.5"
                  filter="url(#node-glow)"
                />
                {/* Initials */}
                <text
                  x={v.x} y={v.y + 3.5}
                  textAnchor="middle" fill={color}
                  fontSize="8" fontWeight="800" fontFamily="Inter, sans-serif"
                >
                  {v.initials}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ─── Proximity Dispatch Panel (bottom overlay) ─────────────── */}
      {selectedIncident && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 animate-slide-up z-40 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    selectedIncident.priority === 'CRITICAL'
                      ? 'text-red-500 dark:text-red-400'
                      : selectedIncident.priority === 'WARNING'
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-indigo-500 dark:text-indigo-400'
                  }`}
                />
                <span
                  className={`status-badge ${
                    selectedIncident.priority === 'CRITICAL'
                      ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                      : selectedIncident.priority === 'WARNING'
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                      : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'
                  }`}
                >
                  {selectedIncident.priority}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {selectedIncident.id}
                </span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-100 leading-snug">
                {selectedIncident.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedIncident(null)}
              className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <p className="section-title mb-2 flex items-center gap-1.5">
              <Radio className="w-3 h-3" />
              Nearest Available Responders
            </p>
            {nearestVolunteers.length > 0 ? (
              <div className="space-y-2">
                {nearestVolunteers.map((v, i) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/70 rounded-lg px-3 py-2.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/12 border-2 border-emerald-300 dark:border-emerald-500/35 flex items-center justify-center transition-colors">
                          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                            {v.initials}
                          </span>
                        </div>
                        <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center text-[8px] font-bold text-white transition-colors">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 transition-colors">
                          {v.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono transition-colors">
                          {Math.round(v.distance)}m • {v.id}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDispatch(v.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-md text-[10px] font-bold text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                    >
                      <Navigation className="w-3 h-3" />
                      DISPATCH
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-600 italic py-2">
                No available volunteers for dispatch
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
