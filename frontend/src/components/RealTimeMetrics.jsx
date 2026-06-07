import React from 'react';
import { useSocket } from '../context/SocketContext';
import {
  Activity,
  Users,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Shield,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const PIE_COLORS = {
  Critical: '#ef4444',
  Warning: '#f59e0b',
  Routine: '#6366f1',
  Resolved: '#10b981',
};

export default function RealTimeMetrics() {
  const { incidents, volunteers, crowdZones } = useSocket();

  // ─── Compute Stats ────────────────────────────────────────────────────
  const volStats = {
    available: volunteers.filter((v) => v.status === 'Available').length,
    enRoute: volunteers.filter((v) => v.status === 'En Route').length,
    onScene: volunteers.filter((v) => v.status === 'On Scene').length,
    total: volunteers.length,
  };

  const incStats = {
    critical: incidents.filter(
      (i) => i.priority === 'CRITICAL' && i.status !== 'RESOLVED'
    ).length,
    warning: incidents.filter(
      (i) => i.priority === 'WARNING' && i.status !== 'RESOLVED'
    ).length,
    routine: incidents.filter(
      (i) => i.priority === 'ROUTINE' && i.status !== 'RESOLVED'
    ).length,
    resolved: incidents.filter((i) => i.status === 'RESOLVED').length,
    total: incidents.length,
  };

  const pieData = [
    { name: 'Critical', value: incStats.critical },
    { name: 'Warning', value: incStats.warning },
    { name: 'Routine', value: incStats.routine },
    { name: 'Resolved', value: incStats.resolved },
  ].filter((d) => d.value > 0);

  const anomalyCount = crowdZones.filter((z) => z.anomaly).length;

  // ─── Custom Tooltip ───────────────────────────────────────────────────
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-[11px] font-semibold" style={{ color: d.payload.fill }}>
          {d.name}: {d.value}
        </p>
      </div>
    );
  };

  return (
    <div className="glass-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <Activity className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-widest uppercase">
          Real-Time Metrics
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* ─── Top Stats Row ──────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 dark:bg-slate-900/90 rounded-lg p-2.5 border border-slate-200 dark:border-slate-800 text-center transition-colors">
            <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
              Active
            </p>
            <p className="text-xl font-extrabold text-red-500 dark:text-red-400 tabular-nums">
              {incStats.critical + incStats.warning + incStats.routine}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/90 rounded-lg p-2.5 border border-slate-200 dark:border-slate-800 text-center transition-colors">
            <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
              Resolved
            </p>
            <p className="text-xl font-extrabold text-emerald-500 dark:text-emerald-400 tabular-nums">
              {incStats.resolved}
            </p>
          </div>
          <div className={`bg-slate-50 dark:bg-slate-900/90 rounded-lg p-2.5 border text-center transition-colors ${anomalyCount > 0 ? 'border-red-300 dark:border-red-500/50 animate-pulse-critical' : 'border-slate-200 dark:border-slate-800'}`}>
            <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
              Anomalies
            </p>
            <p className={`text-xl font-extrabold tabular-nums ${anomalyCount > 0 ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-slate-600'}`}>
              {anomalyCount}
            </p>
          </div>
        </div>

        {/* ─── Incident Distribution Chart ────────────────────────── */}
        <div className="bg-slate-50 dark:bg-slate-900/90 rounded-lg p-3 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <span className="section-title">Active Operational Alerts</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[90px] h-[90px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={18}
                    outerRadius={36}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[entry.name]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {[
                { label: 'Critical', value: incStats.critical, color: 'text-red-500 dark:text-red-400', dot: 'bg-red-500' },
                { label: 'Warning', value: incStats.warning, color: 'text-amber-500 dark:text-amber-400', dot: 'bg-amber-500' },
                { label: 'Routine', value: incStats.routine, color: 'text-indigo-500 dark:text-indigo-400', dot: 'bg-indigo-500' },
                { label: 'Resolved', value: incStats.resolved, color: 'text-emerald-500 dark:text-emerald-400', dot: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className={`text-[10px] ${item.color} flex items-center gap-1.5 font-medium`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                    {item.label}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Volunteer Deployment ───────────────────────────────── */}
        <div className="bg-slate-50 dark:bg-slate-900/90 rounded-lg p-3 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-2 mb-2.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span className="section-title">Active Sevadars Deployed</span>
            <span className="ml-auto text-[9px] font-mono text-slate-400 dark:text-slate-600">
              {volStats.total} TOTAL
            </span>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Available', value: volStats.available, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'En Route', value: volStats.enRoute, color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
              { label: 'On Scene', value: volStats.onScene, color: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] ${item.text} font-medium`}>
                    {item.label}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${item.text}`}>
                    {item.value}/{volStats.total}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                    style={{
                      width: `${
                        volStats.total > 0
                          ? (item.value / volStats.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Zone Capacity Monitor ──────────────────────────────── */}
        <div className="bg-slate-50 dark:bg-slate-900/90 rounded-lg p-3 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-2 mb-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
            <span className="section-title">Ghat / Sector Telemetry</span>
            {anomalyCount > 0 && (
              <span className="ml-auto flex items-center gap-1 text-[9px] font-bold text-red-500 dark:text-red-400">
                <AlertTriangle className="w-3 h-3" />
                {anomalyCount} ALERT{anomalyCount > 1 ? 'S' : ''}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {crowdZones.map((zone) => {
              const ratio = zone.currentOccupancy / zone.capacity;
              const pct = Math.round(ratio * 100);
              const barColor =
                ratio > 0.85
                  ? 'bg-red-500'
                  : ratio > 0.5
                  ? 'bg-amber-500'
                  : 'bg-emerald-500';
              const textColor =
                ratio > 0.85
                  ? 'text-red-600 dark:text-red-400'
                  : ratio > 0.5
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400';

              return (
                <div
                  key={zone.id}
                  className={zone.anomaly ? 'animate-pulse-critical' : ''}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate mr-2 font-medium">
                      {zone.name}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {zone.anomaly && (
                        <AlertTriangle className="w-3 h-3 text-red-500 dark:text-red-400" />
                      )}
                      <span
                        className={`text-[10px] font-mono font-bold ${textColor}`}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
