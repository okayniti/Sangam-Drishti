import React, { useState, useMemo } from 'react';
import { useSocket } from '../context/SocketContext';
import {
  Layers,
  AlertTriangle,
  Navigation,
  CheckCircle2,
  Clock,
  X,
  User,
  Radio,
  Zap,
} from 'lucide-react';

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

const PRIORITY_STYLES = {
  CRITICAL: {
    card: 'bg-red-50 dark:bg-red-500/8 border-red-200 dark:border-red-500/25',
    badge: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30',
    icon: 'text-red-500 dark:text-red-400',
  },
  WARNING: {
    card: 'bg-amber-50 dark:bg-amber-500/8 border-amber-200 dark:border-amber-500/25',
    badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30',
    icon: 'text-amber-500 dark:text-amber-400',
  },
  ROUTINE: {
    card: 'bg-indigo-50 dark:bg-indigo-500/8 border-indigo-200 dark:border-indigo-500/25',
    badge: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30',
    icon: 'text-indigo-500 dark:text-indigo-400',
  },
};

export default function TriagePipeline() {
  const { incidents, volunteers, dispatch, resolve } = useSocket();
  const [dispatchModal, setDispatchModal] = useState(null);

  // Categorize incidents into pipeline columns
  const unassigned = incidents.filter((i) => i.status === 'UNASSIGNED');
  const active = incidents.filter((i) =>
    ['DISPATCHED', 'ACTIVE'].includes(i.status)
  );
  const resolved = incidents
    .filter((i) => i.status === 'RESOLVED')
    .slice(-12)
    .reverse();

  // Nearest available volunteers for the dispatch modal
  const nearestVolunteers = useMemo(() => {
    if (!dispatchModal) return [];
    return volunteers
      .filter((v) => v.status === 'Available')
      .map((v) => ({
        ...v,
        distance: calculateDistance(dispatchModal.x, dispatchModal.y, v.x, v.y),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [dispatchModal, volunteers]);

  const handleDispatch = async (volunteerId) => {
    if (!dispatchModal) return;
    await dispatch(volunteerId, dispatchModal.id);
    setDispatchModal(null);
  };

  // ─── Incident Card Sub-component ──────────────────────────────────────
  const IncidentCard = ({ incident, actions }) => {
    const style = PRIORITY_STYLES[incident.priority] || PRIORITY_STYLES.ROUTINE;
    const assignedVol = incident.assignedVolunteerId
      ? volunteers.find((v) => v.id === incident.assignedVolunteerId)
      : null;
    const isCriticalUnassigned =
      incident.priority === 'CRITICAL' && incident.status === 'UNASSIGNED';

    return (
      <div
        className={`border rounded-lg p-2.5 ${style.card} ${
          isCriticalUnassigned ? 'border-l-2 border-l-red-500 shadow-[inset_2px_0_8px_-4px_rgba(239,68,68,0.4)]' : ''
        } transition-colors duration-300`}
      >
        {/* Top row: priority badge + ID */}
        <div className="flex items-center justify-between mb-1.5">
          <span className={`status-badge ${style.badge}`}>
            {isCriticalUnassigned && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-1" />
            )}
            {incident.priority}
          </span>
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-600">
            {incident.id}
          </span>
        </div>

        {/* Description */}
        <p className="text-[11px] text-slate-700 dark:text-slate-100 leading-relaxed mb-2 transition-colors">
          {incident.description}
        </p>

        {/* Assigned volunteer (if any) */}
        {assignedVol && (
          <div className="flex items-center gap-1.5 mb-2 bg-white/60 dark:bg-slate-950/50 rounded px-2 py-1 transition-colors">
            <User className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
              {assignedVol.name}
            </span>
            <span
              className={`status-badge ml-auto ${
                assignedVol.status === 'En Route'
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
              }`}
            >
              {assignedVol.status}
            </span>
          </div>
        )}

        {/* Footer: timestamp + actions */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-500 dark:text-slate-600 font-mono flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {new Date(incident.createdAt).toLocaleTimeString('en-US', {
              hour12: false,
            })}
          </span>
          {actions}
        </div>

        {/* Resolved timestamp */}
        {incident.resolvedAt && (
          <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[9px] text-emerald-600 font-mono flex items-center gap-1 transition-colors">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Resolved{' '}
            {new Date(incident.resolvedAt).toLocaleTimeString('en-US', {
              hour12: false,
            })}
          </div>
        )}
      </div>
    );
  };

  // ─── Column Component ─────────────────────────────────────────────────
  const Column = ({ icon: Icon, iconColor, title, count, children }) => (
    <div className="bg-white/80 dark:bg-slate-900/90 flex flex-col min-h-0 transition-colors">
      <div className="flex-shrink-0 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-100 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-600 bg-slate-100 dark:bg-slate-800/40 px-1.5 py-0.5 rounded transition-colors">
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">{children}</div>
    </div>
  );

  return (
    <div className="glass-card flex flex-col overflow-hidden relative transition-colors">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <Layers className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-widest uppercase">
          Triage Pipeline
        </h2>
      </div>

      {/* Three-column grid */}
      <div className="flex-1 grid grid-cols-3 gap-px bg-slate-200 dark:bg-slate-950/40 min-h-0 overflow-hidden transition-colors">
        {/* Column A: Unassigned */}
        <Column
          icon={AlertTriangle}
          iconColor="text-red-500 dark:text-red-400"
          title="Unassigned Triage"
          count={unassigned.length}
        >
          {unassigned.map((inc) => (
            <IncidentCard
              key={inc.id}
              incident={inc}
              actions={
                <button
                  onClick={() => setDispatchModal(inc)}
                  className="flex items-center gap-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[9px] font-bold transition-all active:scale-95"
                >
                  <Navigation className="w-2.5 h-2.5" />
                  Dispatch
                </button>
              }
            />
          ))}
          {unassigned.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-700 transition-colors">
              <CheckCircle2 className="w-6 h-6 mb-1.5" />
              <p className="text-[10px] italic">All clear</p>
            </div>
          )}
        </Column>

        {/* Column B: Active */}
        <Column
          icon={Zap}
          iconColor="text-amber-500 dark:text-amber-400"
          title="Active Dispatch"
          count={active.length}
        >
          {active.map((inc) => (
            <IncidentCard
              key={inc.id}
              incident={inc}
              actions={
                <button
                  onClick={() => resolve(inc.id)}
                  className="flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-bold transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Mitigate
                </button>
              }
            />
          ))}
          {active.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-700 transition-colors">
              <Navigation className="w-6 h-6 mb-1.5" />
              <p className="text-[10px] italic">No active dispatches</p>
            </div>
          )}
        </Column>

        {/* Column C: Resolved */}
        <Column
          icon={CheckCircle2}
          iconColor="text-emerald-500 dark:text-emerald-400"
          title="Resolved Logs"
          count={resolved.length}
        >
          {resolved.map((inc) => (
            <IncidentCard key={inc.id} incident={inc} actions={null} />
          ))}
          {resolved.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-700 transition-colors">
              <Layers className="w-6 h-6 mb-1.5" />
              <p className="text-[10px] italic">No resolved incidents</p>
            </div>
          )}
        </Column>
      </div>

      {/* ─── Proximity Dispatch Modal ───────────────────────────────── */}
      {dispatchModal && (
        <div
          className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in transition-colors"
          onClick={() => setDispatchModal(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 w-[440px] shadow-2xl shadow-black/20 dark:shadow-black/50 animate-slide-up transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-wide">
                  PROXIMITY DISPATCH
                </h3>
              </div>
              <button
                onClick={() => setDispatchModal(null)}
                className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-800/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Incident Summary */}
            <div
              className={`p-3 rounded-lg mb-4 border transition-colors ${
                PRIORITY_STYLES[dispatchModal.priority]?.card
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`status-badge ${
                    PRIORITY_STYLES[dispatchModal.priority]?.badge
                  }`}
                >
                  {dispatchModal.priority}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 transition-colors">
                  {dispatchModal.id}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-100 leading-relaxed transition-colors">
                {dispatchModal.description}
              </p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono mt-1 transition-colors">
                Coordinates: ({Math.round(dispatchModal.x)},{' '}
                {Math.round(dispatchModal.y)})
              </p>
            </div>

            {/* Nearest Volunteers */}
            <p className="section-title mb-3 flex items-center gap-1.5 transition-colors">
              <Navigation className="w-3 h-3" />
              Top 3 Nearest Available Responders
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
                          {Math.round(v.distance)}m away • {v.id}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDispatch(v.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                    >
                      <Navigation className="w-3 h-3" />
                      DISPATCH
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 dark:text-slate-600 transition-colors">
                <User className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs italic">
                  No available volunteers for dispatch
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
