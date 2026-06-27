// ═══════════════════════════════════════════════════════════════════════════════
// SITUATIONAL ADVISOR — RAG-powered AI Chat Panel (Gemini 2.0 Flash)
// Provides grounded, context-aware intelligence to ICCC operators using
// live telemetry data + Mahakumbh SOPs as retrieval context.
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import {
  Sparkles,
  Send,
  User,
  Bot,
  AlertTriangle,
  Shield,
  Activity,
  Users,
  Zap,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';

const QUICK_PROMPTS = [
  { label: '📊 Situation Brief', prompt: 'Give me a full situation briefing of the current state — crowd zones, active incidents, and responder deployment.' },
  { label: '🔴 Critical Assessment', prompt: 'Assess all critical incidents. Which one needs the most urgent attention right now and why?' },
  { label: '👥 Crowd Risk', prompt: 'Which crowd zones are at highest risk of exceeding capacity? What preventive actions should we take?' },
  { label: '🚨 Stampede Risk', prompt: 'Evaluate the current stampede risk across all sectors. Are there any early warning indicators?' },
  { label: '🏥 Deploy Recommendation', prompt: 'Based on the current situation, recommend the optimal deployment of available responders.' },
  { label: '📋 Shift Handoff', prompt: 'Generate a concise shift handoff report summarizing the current operational status.' },
];

// ─── Simple Markdown Renderer ─────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];
  let listType = 'ul';

  const flushList = () => {
    if (listItems.length > 0) {
      const Tag = listType;
      elements.push(
        <Tag key={`list-${elements.length}`} className={`${listType === 'ol' ? 'list-decimal' : 'list-disc'} pl-5 space-y-1 my-2`}>
          {listItems.map((item, i) => (
            <li key={i} className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </Tag>
      );
      listItems = [];
      inList = false;
    }
  };

  const formatInline = (line) => {
    return line
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-slate-800 dark:text-slate-100">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-[10px] font-mono">$1</code>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={i} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-3 mb-1.5 uppercase tracking-wider">
          {line.replace('### ', '')}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={i} className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-3 mb-1.5 border-b border-slate-200 dark:border-slate-700 pb-1">
          {line.replace('## ', '')}
        </h3>
      );
    } else if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={i} className="text-base font-extrabold text-slate-900 dark:text-white mt-3 mb-2">
          {line.replace('# ', '')}
        </h2>
      );
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(line.replace(/^\d+\.\s/, ''));
    }
    // Bullet lists
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(line.replace(/^[-*]\s/, ''));
    }
    // Horizontal rule
    else if (line.trim() === '---') {
      flushList();
      elements.push(<hr key={i} className="border-slate-200 dark:border-slate-700 my-3" />);
    }
    // Empty line
    else if (line.trim() === '') {
      flushList();
    }
    // Regular paragraph
    else {
      flushList();
      elements.push(
        <p key={i} className="text-xs leading-relaxed my-1.5" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    }
  }
  flushList();
  return elements;
}

// ─── Context Badge ────────────────────────────────────────────────────────
const ContextBadge = ({ context }) => {
  if (!context) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/25">
        <AlertTriangle className="w-2.5 h-2.5" />
        {context.activeIncidents} Active
      </span>
      {context.criticalIncidents > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/25 animate-pulse">
          <Zap className="w-2.5 h-2.5" />
          {context.criticalIncidents} Critical
        </span>
      )}
      {context.anomalyZones > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/25">
          <Activity className="w-2.5 h-2.5" />
          {context.anomalyZones} Zone Alerts
        </span>
      )}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25">
        <Users className="w-2.5 h-2.5" />
        {context.availableResponders}/{context.totalResponders} Available
      </span>
    </div>
  );
};

// ─── Typing Indicator ─────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-start gap-3 animate-fade-in">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl rounded-tl-md px-4 py-3 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mr-1">DRISHTI AI analyzing</span>
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function SituationalAdvisor() {
  const { incidents, volunteers, crowdZones } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latestContext, setLatestContext] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const cooldownRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    cooldownRef.current = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(cooldownRef.current);
  }, [cooldown]);

  // Compute live stats for the header
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED').length;
  const criticalIncidents = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const anomalyZones = crowdZones.filter(z => z.anomaly).length;

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading || cooldown > 0) return;

    setInput('');
    setError(null);

    // Add user message
    const newUserMsg = { role: 'user', content: userMessage, timestamp: Date.now() };
    setMessages(prev => [...prev, newUserMsg]);

    // Build conversation history for Gemini (exclude current message — it's sent via sendMessage)
    const conversationHistory = messages
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    setIsLoading(true);

    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : '/api';
      const res = await fetch(`${API_BASE}/advisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, conversationHistory }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Unknown error occurred');
        setIsLoading(false);
        return;
      }

      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
        context: data.context,
        engine: data.engine || 'gemini',
      }]);
      setLatestContext(data.context);
      setCooldown(3); // 3-second cooldown between requests

    } catch (err) {
      console.error('[ADVISOR] Error:', err);
      setError('Failed to reach the AI advisor. Check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setLatestContext(null);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div className="glass-card flex flex-col overflow-hidden h-full transition-colors">
      {/* ─── Header ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-wide flex items-center gap-2">
                DRISHTI AI
                <span className="text-[8px] font-mono font-medium text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-1.5 py-0.5 rounded">
                  RAG • Gemini 2.0
                </span>
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Situational Intelligence Advisor — Grounded in Live Telemetry + SOPs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearConversation}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Live context badges */}
        <div className="px-5 pb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Live Context:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/25">
              <AlertTriangle className="w-2.5 h-2.5" />
              {activeIncidents} Incidents
            </span>
            {criticalIncidents > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-200 dark:bg-red-500/25 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-500/35 animate-pulse">
                <Zap className="w-2.5 h-2.5" />
                {criticalIncidents} Critical
              </span>
            )}
            {anomalyZones > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/25">
                <Activity className="w-2.5 h-2.5" />
                {anomalyZones} Zone Alerts
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25">
              <Shield className="w-2.5 h-2.5" />
              {volunteers.filter(v => v.status === 'Available').length}/{volunteers.length} Responders
            </span>
          </div>
        </div>
      </div>

      {/* ─── Messages Area ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
        {/* Welcome message when empty */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-1">
              DRISHTI AI Advisor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
              I have real-time awareness of all active incidents, crowd zone densities, responder positions, 
              and Mahakumbh SOPs. Ask me anything about the current situation.
            </p>

            {/* Quick prompt chips */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 max-w-2xl">
              {QUICK_PROMPTS.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(qp.prompt)}
                  className="text-left px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all group"
                >
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {qp.label}
                  </span>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">
                    {qp.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 animate-fade-in ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-500/20'
                : 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-indigo-500/20'
            }`}>
              {msg.role === 'user'
                ? <User className="w-4 h-4 text-white" />
                : <Bot className="w-4 h-4 text-white" />
              }
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-lg shadow-orange-500/10'
                : 'bg-slate-100 dark:bg-slate-800/80 rounded-2xl rounded-tl-md px-4 py-3 border border-slate-200 dark:border-slate-700'
            }`}>
              {msg.role === 'user' ? (
                <p className="text-xs leading-relaxed">{msg.content}</p>
              ) : (
                <div className="prose-sm">
                  {renderMarkdown(msg.content)}
                </div>
              )}

              {/* Timestamp + engine indicator */}
              <div className={`mt-2 flex items-center gap-2 text-[8px] font-mono ${
                msg.role === 'user' ? 'text-white/60' : 'text-slate-400 dark:text-slate-600'
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                {msg.engine && (
                  <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase ${
                    msg.engine === 'gemini'
                      ? 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                      : 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {msg.engine === 'gemini' ? '✨ Gemini' : '⚡ Live Analysis'}
                  </span>
                )}
              </div>

              {/* Context badge for AI responses */}
              {msg.context && (
                <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <ContextBadge context={msg.context} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 rounded-xl animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Quick Prompts (when in conversation) ────────────────────── */}
      {messages.length > 0 && !isLoading && (
        <div className="flex-shrink-0 px-5 pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider whitespace-nowrap mr-1">Quick:</span>
            {QUICK_PROMPTS.slice(0, 4).map((qp, i) => (
              <button
                key={i}
                onClick={() => sendMessage(qp.prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Input Area ──────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask DRISHTI AI about the current situation..."
              disabled={isLoading}
              className="w-full px-4 py-3 pr-12 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500/50 transition-all disabled:opacity-50"
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading || cooldown > 0}
            className="flex-shrink-0 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all disabled:opacity-30 disabled:shadow-none active:scale-95 px-3 min-w-[40px]"
          >
            {cooldown > 0 ? (
              <span className="text-[10px] font-bold font-mono">{cooldown}s</span>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[8px] text-slate-400 dark:text-slate-600 mt-2 text-center font-mono">
          Powered by Gemini 2.0 Flash • Grounded in live ICCC telemetry + Mahakumbh SOPs
        </p>
      </div>
    </div>
  );
}
