// ═══════════════════════════════════════════════════════════════════════════════
// SOCKET CONTEXT — Unified state management syncing global UI with socket events
// Connects to backend Socket.io, listens for state:sync broadcasts,
// and exposes dispatch/resolve/inject action helpers via React Context.
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const API_BASE = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : '/api';

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState({
    incidents: [],
    volunteers: [],
    crowdZones: [],
    paused: false,
    timestamp: null,
  });

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[SOCKET] Connected:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('[SOCKET] Disconnected:', reason);
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('[SOCKET] Connection error:', err.message);
      setConnected(false);
    });

    socket.on('state:sync', (data) => {
      setState(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ─── Action Helpers ─────────────────────────────────────────────────────
  const dispatch = useCallback(async (volunteerId, incidentId) => {
    try {
      const res = await fetch(`${API_BASE}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerId, incidentId }),
      });
      return await res.json();
    } catch (err) {
      console.error('[API] Dispatch failed:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const resolve = useCallback(async (incidentId) => {
    try {
      const res = await fetch(`${API_BASE}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId }),
      });
      return await res.json();
    } catch (err) {
      console.error('[API] Resolve failed:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const inject = useCallback(async (description, priority, x, y) => {
    try {
      const res = await fetch(`${API_BASE}/inject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, priority, x, y }),
      });
      return await res.json();
    } catch (err) {
      console.error('[API] Inject failed:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const togglePause = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/toggle-pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return await res.json();
    } catch (err) {
      console.error('[API] Toggle pause failed:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const value = {
    ...state,
    connected,
    dispatch,
    resolve,
    inject,
    togglePause,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
