import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Info, Sun, Moon } from 'lucide-react';

const WaveBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-10 overflow-hidden">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor" className="text-orange-100 dark:text-orange-900/30" />
      <path d="M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z" fill="currentColor" className="text-orange-200 dark:text-orange-800/30" />
      <path d="M0,70 Q25,50 50,70 T100,70 L100,100 L0,100 Z" fill="currentColor" className="text-orange-300 dark:text-orange-700/30" />
    </svg>
  </div>
);

export default function Login({ onLogin, isDarkMode, setIsDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex h-screen w-full bg-orange-50 dark:bg-tactical-black font-sans overflow-hidden relative transition-colors duration-300">
      <WaveBackground />
      
      {/* ─── LEFT PANEL: Cultural Vector Art Canvas ─── */}
      <div className="hidden md:flex md:w-[42%] bg-white/50 dark:bg-slate-950/80 backdrop-blur-sm relative flex-col border-r border-slate-200/60 dark:border-slate-800 p-10 justify-center items-center overflow-hidden z-10 transition-colors duration-300">
        
        {/* Minimal Vector Artwork - Temple, Flags, Kalash, Sangam River */}
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
            
            {/* Background Decorative Stars/Diamonds */}
            <path d="M 60 80 L 65 70 L 70 80 L 65 90 Z" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
            <path d="M 320 120 L 325 110 L 330 120 L 325 130 Z" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
            <circle cx="80" cy="220" r="3" fill="currentColor" className="text-slate-200 dark:text-slate-700" />
            <circle cx="340" cy="260" r="4" fill="currentColor" className="text-slate-200 dark:text-slate-700" />

            {/* Central Temple Spires (Shikhars) */}
            {/* Left smaller spire */}
            <path d="M 120 280 L 150 160 L 180 280 Z" stroke="currentColor" className="text-slate-500 dark:text-slate-600" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M 120 280 L 180 280" stroke="currentColor" className="text-slate-500 dark:text-slate-600" strokeWidth="2" strokeLinecap="round"/>
            <line x1="130" y1="240" x2="170" y2="240" stroke="currentColor" className="text-slate-400 dark:text-slate-700" strokeWidth="1" />
            <line x1="140" y1="200" x2="160" y2="200" stroke="currentColor" className="text-slate-400 dark:text-slate-700" strokeWidth="1" />
            <circle cx="150" cy="160" r="4" fill="currentColor" className="text-slate-500 dark:text-slate-600" />
            {/* Flag */}
            <path d="M 150 160 L 150 130 L 175 145 Z" fill="#f97316" />

            {/* Main Center Spire */}
            <path d="M 160 280 L 200 80 L 240 280 Z" stroke="currentColor" className="text-slate-600 dark:text-slate-500" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M 160 280 L 240 280" stroke="currentColor" className="text-slate-600 dark:text-slate-500" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="175" y1="230" x2="225" y2="230" stroke="currentColor" className="text-slate-400 dark:text-slate-700" strokeWidth="1.5" />
            <line x1="185" y1="180" x2="215" y2="180" stroke="currentColor" className="text-slate-400 dark:text-slate-700" strokeWidth="1.5" />
            <line x1="193" y1="130" x2="207" y2="130" stroke="currentColor" className="text-slate-400 dark:text-slate-700" strokeWidth="1.5" />
            <circle cx="200" cy="80" r="5" fill="currentColor" className="text-slate-600 dark:text-slate-500" />
            {/* Flag */}
            <path d="M 200 80 L 200 40 L 235 60 L 210 65 L 235 75 Z" fill="#ea580c" />

            {/* Right smaller spire */}
            <path d="M 220 280 L 250 170 L 280 280 Z" stroke="currentColor" className="text-slate-500 dark:text-slate-600" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M 220 280 L 280 280" stroke="currentColor" className="text-slate-500 dark:text-slate-600" strokeWidth="2" strokeLinecap="round"/>
            <line x1="230" y1="240" x2="270" y2="240" stroke="currentColor" className="text-slate-400 dark:text-slate-700" strokeWidth="1" />
            <line x1="240" y1="205" x2="260" y2="205" stroke="currentColor" className="text-slate-400 dark:text-slate-700" strokeWidth="1" />
            <circle cx="250" cy="170" r="3" fill="currentColor" className="text-slate-500 dark:text-slate-600" />
            {/* Flag */}
            <path d="M 250 170 L 250 145 L 270 157 Z" fill="#f97316" />

            {/* Kalash with Coconut and Swastik */}
            <g transform="translate(260, 240)">
              {/* Coconut Leaves */}
              <path d="M 20 15 Q 5 5, 0 15 Q 5 20, 20 15" fill="#22c55e" opacity="0.8"/>
              <path d="M 20 15 Q 35 5, 40 15 Q 35 20, 20 15" fill="#22c55e" opacity="0.8"/>
              <path d="M 20 15 Q 20 0, 15 -5 Q 25 0, 20 15" fill="#16a34a" />
              {/* Pot */}
              <path d="M 10 15 Q 0 40, 20 40 Q 40 40, 30 15 Z" stroke="#b45309" strokeWidth="2" fill="currentColor" className="text-amber-50 dark:text-amber-900/40" />
              {/* Swastik */}
              <path d="M 15 22 L 20 22 L 20 32 M 20 22 L 20 17 L 25 17 M 15 27 L 15 22 M 20 27 L 25 27 L 25 32" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
            </g>

            {/* Flowing Geometric Dual-Lines (Sangam River Currents) */}
            <path d="M 0 310 Q 100 280, 200 320 T 400 310" stroke="#3b82f6" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
            <path d="M 0 330 Q 100 300, 200 340 T 400 330" stroke="#0ea5e9" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
            <path d="M 0 350 Q 100 320, 200 360 T 400 350" stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
            <path d="M 0 370 Q 100 340, 200 380 T 400 370" stroke="#93c5fd" strokeWidth="1" opacity="0.3" strokeLinecap="round" />

          </svg>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Login Interface ─── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white/30 dark:bg-slate-950/50 backdrop-blur-sm relative z-10">
        
        {/* Toggle Theme Button */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 shadow-sm transition-all"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Branding Block */}
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <div className="flex flex-col items-center">
             <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 16 4 L 24 18 L 8 18 Z" stroke="#ea580c" strokeWidth="2" strokeLinejoin="round" fill="currentColor" className="text-orange-50 dark:text-orange-950/50" />
                <path d="M 16 4 L 16 18" stroke="#ea580c" strokeWidth="2" />
                <path d="M 4 22 Q 10 18, 16 22 T 28 22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <path d="M 4 26 Q 10 22, 16 26 T 28 26" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
             </svg>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xl font-bold text-slate-800 dark:text-white leading-none">SangamDrishti</span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mt-0.5">ICCC</span>
          </div>
        </div>

        <div className="w-full max-w-sm flex flex-col">
          
          {/* Floating Login Card */}
          <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 w-full transition-colors duration-300 ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
            
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Login Card</h2>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium py-2 px-3 rounded border border-red-100 dark:border-red-500/20 text-center transition-colors">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">
                  Email:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">
                  Password:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg w-full flex items-center justify-center space-x-2 shadow-md transition-all"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Demo Account Accent Container */}
          <div 
            onClick={handleDemoFill}
            className="cursor-pointer bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/50 text-sky-900 dark:text-sky-300 rounded-xl p-4 mt-4 transition-all hover:bg-sky-100 dark:hover:bg-sky-900/40 hover:border-sky-300 dark:hover:border-sky-700 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-sm font-semibold text-sky-800 dark:text-sky-300">Demo credentials</h3>
            </div>
            <div className="text-xs font-mono text-sky-700 dark:text-sky-400/80 space-y-1 ml-6">
              <div>Email: admin@sangamdrishti.in</div>
              <div>Password: Mahakumbh2028</div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Shake animation keyframes */}
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
