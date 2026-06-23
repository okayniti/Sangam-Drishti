// ═══════════════════════════════════════════════════════════════════════════════
// SERVER — Express + Socket.io HTTP Server for Event Ops Command Center
// Integrates REST API routes, CORS, and real-time WebSocket communication.
// ═══════════════════════════════════════════════════════════════════════════════

require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const controller = require('./controller');
const advisorRoute = require('./advisorRoute');
const telemetry = require('./telemetrySimulator');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

// ─── CORS Configuration ────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(express.json());

// ─── Socket.io Instance ────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// ─── REST API Routes ───────────────────────────────────────────────────────
app.use('/api', controller);
app.use('/api', advisorRoute);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ─── Socket.io Connection Handler ──────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[SOCKET] Client connected: ${socket.id}`);

  // Send full state snapshot immediately on connect
  socket.emit('state:sync', telemetry.getState());

  socket.on('disconnect', (reason) => {
    console.log(`[SOCKET] Client disconnected: ${socket.id} (${reason})`);
  });
});

// ─── Initialize Telemetry Simulator ────────────────────────────────────────
telemetry.init(io);

// ─── Start Server ──────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║                                                   ║');
  console.log('║   ⚡ EVENT OPS COMMAND CENTER — BACKEND ONLINE   ║');
  console.log(`║   🌐 HTTP Server:  http://localhost:${PORT}          ║`);
  console.log('║   🔌 Socket.io:   Ready for connections           ║');
  console.log('║   📡 Telemetry:   Simulator active                ║');
  console.log('║                                                   ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('');
});
