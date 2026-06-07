# SangamDrishti: Mahakumbh 2028 Integrated Command & Control Center (ICCC)

> **A real-time, data-driven crowd telemetry and tactical emergency personnel dispatch platform designed for the extreme operational scale of Prayagraj 2028.**

---

## 🚀 The Core Problem & Our Innovative Solutions

Managing the largest human gathering on earth requires systems that look beyond generic CRUD applications and instead function as elite, real-time tactical engines. **SangamDrishti** provides three standout pillars built specifically for Mahakumbh operational logic:

### 1. Real-Time Sector & Ghat Telemetry Engine
Continuous, live background data streams track pilgrim footfall density across highly critical zones (e.g., Triveni Sangam Ghat, Sector 3 Pontoon Bridge, and Akhara Camps). The system automatically triggers **flashing capacity alerts** when sectors exceed safe operational thresholds, predicting bottlenecks before they occur.

### 2. Geometric Proximity Dispatch Engine
Eliminates human cognitive overhead during high-stakes crises. A single-click action on an unassigned alert instantly runs a geometric proximity calculation, pinging the coordinates of the incident against the live telemetry coordinates of all responders. It automatically surfaces and sorts the **top 3 nearest available Mela Sevadars, NDRF Rescue Squads, and Sector Police units** for immediate, targeted deployment.

### 3. 3-Column Operational Triage Pipeline
A fluid Kanban matrix that breaks alerts into actionable states:
- **Unassigned Triage:** High-priority items glow with a pulsing critical accent to demand immediate dispatch attention.
- **Active Dispatch:** Live tracking of units currently En Route or On Scene.
- **Archived/Resolved Logs:** A historical ledger of mitigated crises, providing vital accountability and post-incident review data.

---

## 🏗️ Architecture & Tech Stack

SangamDrishti is constructed as a highly modular full-stack application within a mono-repo architecture. It relies on in-memory state arrays with automated ID indexing to act as an instant-bootstrap database—meaning zero external database connection strings are required for rapid hackathon review.

```text
SangamDrishti/
├── package.json               # Root task runner scripts (concurrently)
├── backend/                   # 🟢 Live Telemetry & API Engine
│   ├── package.json
│   ├── server.js              # Express + Socket.io Server (Port 3001)
│   ├── telemetrySimulator.js  # Ticks every 4s: shifts coords, fluctuates density, injects alerts
│   └── controller.js          # REST mutation endpoints (/api/dispatch, /api/inject)
└── frontend/                  # 🔵 Tactical User Interface
    ├── package.json
    ├── vite.config.js         # API Proxy routing
    ├── tailwind.config.js     # Custom tactical dark theme & animations
    └── src/
        ├── App.jsx            # Master layout with top navigation tabs
        ├── context/           # SocketContext for state:sync websocket persistence
        └── components/
            ├── TacticalMap.jsx     # SVG canvas rendering Ghats, responders, and alerts
            ├── TriagePipeline.jsx  # 3-column Kanban matrix
            ├── RealTimeMetrics.jsx # Live telemetry, deployment bars, and pie charts
            └── ControlPanel.jsx    # System overrides and manual alert injection
```

**Key Technologies Used:**
- **Frontend:** Vite, React, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Node.js, Express, Socket.io (Native WebSockets)

---

## 💻 Local Installation & Quick Start

Follow these steps to boot the entire integrated command center locally in seconds:

**Step 1: Install Dependencies**  
Install all packages for both the frontend and backend using our unified root script.
```bash
npm run install:all
```

**Step 2: Boot the Systems**  
Launch both the Express/Socket.io backend and the Vite frontend simultaneously.
```bash
npm run dev
```

**Step 3: Access the Dashboard**  
Open your browser and navigate to the tactical system UI:  
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🌍 Live Global Production Deployments

For the hackathon review panel, the system is fully deployed and actively running live telemetry.

- **Frontend Hosting Interface:** [https://sangam-drishti.vercel.app/]
- **Live WebSocket Backend Engine:** [https://sangam-drishti-backend.onrender.com/]

---
*Configuration Profile: Prayagraj 2028 Mega-Crowd Protocol Enabled*
