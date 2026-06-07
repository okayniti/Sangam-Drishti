import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldAlert, Key } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@sangamdrishti.in' && password === 'Mahakumbh2028') {
      setError('');
      onLogin();
    } else {
      setError('Invalid credentials. Please check and try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@sangamdrishti.in');
    setPassword('Mahakumbh2028');
    setError('');
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 font-sans overflow-hidden">
      
      {/* ─── LEFT PANEL: Cultural Graphic Canvas (Hidden on mobile) ─── */}
      <div className="hidden md:flex flex-col w-[40%] relative bg-gradient-to-br from-slate-900 to-zinc-950 border-r border-slate-800/50 p-10 justify-between">
        
        {/* Subtle Decorative Background Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridPattern)" />
          </svg>
        </div>

        <div className="z-10 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <ShieldAlert className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              SangamDrishti
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            Mahakumbh 2028 Integrated Command & Control Center. Advanced crowd telemetry, tactical dispatch, and situational awareness grid.
          </p>
        </div>

        {/* Minimal Vector Graphics */}
        <div className="z-10 flex-1 flex items-center justify-center relative">
          <div className="relative w-64 h-64">
            {/* Minimal River Flow / Sangam Curves */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-indigo-500/20 stroke-current drop-shadow-lg" fill="none" strokeWidth="1.5">
              <path d="M 0 50 Q 25 20, 50 50 T 100 50" />
              <path d="M 0 60 Q 25 30, 50 60 T 100 60" />
              <path d="M 0 70 Q 25 40, 50 70 T 100 70" />
            </svg>
            {/* Minimal Temple Spire Outline */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-orange-500/30 stroke-current drop-shadow-md" fill="none" strokeWidth="1">
              <polygon points="50,10 30,80 70,80" />
              <line x1="50" y1="10" x2="50" y2="80" />
              <circle cx="50" cy="10" r="2" fill="currentColor" />
              <rect x="45" y="80" width="10" height="20" />
            </svg>
          </div>
        </div>

        <div className="z-10 text-xs text-slate-600 font-mono tracking-widest uppercase">
          Prayagraj 2028 Protocol | System Secure
        </div>
      </div>

      {/* ─── RIGHT PANEL: Command Center Overlay ─── */}
      <div className="flex-1 relative flex items-center justify-center p-6 bg-zinc-950">
        
        {/* Blurred Dashboard Backdrop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-zinc-950 to-zinc-950"></div>
        </div>

        {/* Floating Login Card */}
        <div className={`relative w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2">Welcome back</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sign in to manage sevadars, crowd alerts, and incidents from your integrated command center.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  placeholder="admin@sangamdrishti.in"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5" />
                <p className="text-xs text-red-400 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-orange-900/20"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-700/50"></div>
            <span className="px-3 text-xs text-slate-500 font-semibold tracking-wider">OR</span>
            <div className="flex-1 border-t border-slate-700/50"></div>
          </div>

          {/* Demo Info Block */}
          <div className="bg-sky-950/30 border border-sky-900/50 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-sky-400 mb-1 flex items-center gap-1.5">
                  <Key className="w-4 h-4" /> Reviewer Access
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Email: admin@sangamdrishti.in<br/>
                  Pass: Mahakumbh2028
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full bg-sky-900/40 hover:bg-sky-800/50 text-sky-300 border border-sky-800/50 text-xs font-medium py-2 rounded-lg transition-all"
            >
              Try Demo Credentials
            </button>
          </div>

        </div>
      </div>
      
      {/* Shake animation keyframes via style tag for simplicity without modifying tailwind config */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}} />
    </div>
  );
}
