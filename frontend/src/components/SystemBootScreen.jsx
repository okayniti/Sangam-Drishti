// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM BOOT SCREEN — Command Center bootup sequence after login
// Shows animated status lines that check off as systems come online,
// then fades into the live dashboard once all data is synced.
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { Shield, Check, Loader2 } from 'lucide-react';

const BOOT_STEPS = [
  { id: 'auth', label: 'Authentication verified', delay: 400 },
  { id: 'socket', label: 'Connecting to Telemetry Engine', delay: 1200 },
  { id: 'sectors', label: 'Syncing Sector & Ghat Data', delay: 2000 },
  { id: 'sevadars', label: 'Loading Sevadar Positions', delay: 2800 },
  { id: 'incidents', label: 'Fetching Active Incident Feed', delay: 3400 },
  { id: 'dashboard', label: 'Initializing Dashboard', delay: 4000 },
];

export default function SystemBootScreen({ connected, hasData, onReady }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isExiting, setIsExiting] = useState(false);

  // Animate steps completing one by one
  useEffect(() => {
    const timers = BOOT_STEPS.map((step) =>
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step.id]);
      }, step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Once all animation steps are done AND we have real data, exit
  useEffect(() => {
    const allStepsDone = completedSteps.length === BOOT_STEPS.length;
    if (allStepsDone && connected && hasData) {
      // Small extra delay for the last checkmark to feel satisfying
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onReady(), 600);
      }, 500);
      return () => clearTimeout(exitTimer);
    }
  }, [completedSteps, connected, hasData, onReady]);

  // If all animation steps done but still no data, keep last step spinning
  const allAnimDone = completedSteps.length === BOOT_STEPS.length;
  const waitingForData = allAnimDone && (!connected || !hasData);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Subtle background pulse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/[0.03] blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md px-8">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 16 4 L 24 18 L 8 18 Z" stroke="#ea580c" strokeWidth="2" strokeLinejoin="round" fill="#0f172a" />
              <path d="M 16 4 L 16 18" stroke="#ea580c" strokeWidth="2" />
              <path d="M 4 22 Q 10 18, 16 22 T 28 22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              <path d="M 4 26 Q 10 22, 16 26 T 28 26" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">SangamDrishti ICCC</h1>
            <p className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">System Initialization</p>
          </div>
        </div>

        {/* Boot sequence card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-2xl">
          <div className="space-y-3">
            {BOOT_STEPS.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isLastStep = index === BOOT_STEPS.length - 1;
              const isWaiting = isLastStep && waitingForData;
              const isActive =
                !isCompleted &&
                (index === 0 || completedSteps.includes(BOOT_STEPS[index - 1].id));

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isCompleted || isActive || isWaiting
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-20 translate-x-2'
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    {isCompleted && !isWaiting ? (
                      <Check className="w-4 h-4 text-emerald-400" strokeWidth={3} />
                    ) : isActive || isWaiting ? (
                      <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-xs font-mono transition-colors duration-300 ${
                      isCompleted && !isWaiting
                        ? 'text-emerald-400'
                        : isActive || isWaiting
                        ? 'text-orange-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {isWaiting ? 'Waiting for live telemetry link...' : step.label}
                    {isCompleted && !isWaiting && (
                      <span className="text-slate-600 ml-2">✓</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom status bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'
                }`}
              />
              <span className="text-[10px] font-mono text-slate-500">
                {connected ? 'LINK ESTABLISHED' : 'ESTABLISHING LINK...'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-600">
              MAHAKUMBH 2028
            </span>
          </div>
        </div>

        {/* Security footer */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <Shield className="w-3 h-3 text-slate-700" />
          <span className="text-[9px] text-slate-700 font-mono tracking-wider">
            ENCRYPTED TACTICAL CHANNEL
          </span>
        </div>
      </div>
    </div>
  );
}
