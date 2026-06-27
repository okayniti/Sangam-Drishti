# SangamDrishti: Mahakumbh 2028 Integrated Command & Control Center (ICCC)

> **An AI-augmented, real-time crowd telemetry and tactical emergency personnel dispatch platform designed for the extreme operational scale of Prayagraj 2028 — powered by RAG-grounded situational intelligence.**

<img width="1920" height="1080" alt="SangamDrishti Dashboard" src="https://github.com/user-attachments/assets/f5579b80-e611-4f13-bcca-4a8b96749d8e" />

---

## 🚀 The Core Problem & Proposed Innovative Solutions

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

### 4. 🤖 DRISHTI AI — Dual-Engine Situational Intelligence Advisor
An embedded AI advisor that provides grounded, context-aware intelligence to ICCC operators using a **dual-engine architecture**:
- **✨ Gemini Engine** — When a Google Gemini API key is configured, responses are powered by **Gemini 2.0 Flash** with full RAG (Retrieval-Augmented Generation), injecting live telemetry + SOPs into every prompt.
- **⚡ Offline Analysis Engine** — When Gemini is unavailable (no key, rate limit, or quota), the system **seamlessly falls back** to a rule-based analysis engine that reads live telemetry directly and generates contextual, SOP-grounded responses. **No API key required — the demo always works.**
- **Embedded SOPs** — 6 comprehensive Mahakumbh Standard Operating Procedures (Crowd Management, Stampede Prevention, Water Rescue, Medical Emergency, Lost Persons, VIP/Akhara Procession) serve as the knowledge base.
- **Actionable Recommendations** — The AI speaks like a seasoned incident commander, referencing actual incident IDs, zone names, and density percentages.

---

## ✨ User Experience Flow

SangamDrishti features a premium, cinematic boot sequence designed for operational immersion:

1. **🔄 Splash Screen** — A branded SangamDrishti logo with animated orange pulse rings displays for 4 seconds while the app initializes.
2. **🔐 Secure Login Gateway** — A split-screen authentication interface featuring cultural vector artwork (temple spires, flowing Sangam river currents, Kalash) on the left and a glassmorphic login card on the right.
3. **⚡ System Boot Sequence** — After authentication, a tactical Command Center bootup panel animates through system initialization steps (verifying auth, connecting telemetry, syncing sectors, loading positions) in real-time.
4. **📊 Live Dashboard** — The full ICCC dashboard loads only once real data is streaming — no empty zero-state screens.

---

## 🔐 Demo Access

When you access the platform, you will be greeted by our premium Command Center gateway. Use the following credentials to access the live dashboard:
- **Email:** `admin@sangamdrishti.in`
- **Password:** `Mahakumbh2028`

> 💡 *You can also click the "Demo credentials" card at the bottom of the login screen to auto-fill and sign in instantly.*

---

## 🏗️ Architecture & Tech Stack

SangamDrishti is constructed as a highly modular full-stack application within a mono-repo architecture. It relies on in-memory state arrays with automated ID indexing to act as an instant-bootstrap database—meaning zero external database connection strings are required for rapid review.

```text
SangamDrishti/
├── package.json                # Root task runner scripts (concurrently)
├── backend/                    # 🟢 Live Telemetry & API Engine
│   ├── package.json
│   ├── server.js               # Express + Socket.io Server (Port 3001)
│   ├── telemetrySimulator.js   # Ticks every 4s: shifts coords, fluctuates density, injects alerts
│   ├── controller.js           # REST mutation endpoints (/api/dispatch, /api/inject)
│   ├── advisorRoute.js         # RAG advisor endpoint — Gemini 2.0 Flash integration
│   └── mahakumbhSOP.js         # Embedded SOP knowledge base (6 protocol categories)
└── frontend/                   # 🔵 Tactical User Interface
    ├── package.json
    ├── index.html              # Branded splash screen with pulse animation
    ├── vite.config.js          # API Proxy routing
    ├── tailwind.config.js      # Custom tactical dark theme & animations
    └── src/
        ├── App.jsx             # Master layout with navigation tabs & theme toggle
        ├── context/            # SocketContext for state:sync websocket persistence
        └── components/
            ├── Login.jsx               # Split-screen auth gateway with cultural SVG art
            ├── SystemBootScreen.jsx    # Cinematic boot sequence with live data gating
            ├── TacticalMap.jsx         # SVG canvas rendering Ghats, responders, and alerts
            ├── TriagePipeline.jsx      # 3-column Kanban matrix
            ├── RealTimeMetrics.jsx     # Live telemetry, deployment bars, and pie charts
            ├── ControlPanel.jsx        # System overrides and manual alert injection
            └── SituationalAdvisor.jsx  # DRISHTI AI chat panel (RAG + Gemini)
```

**Key Technologies Used:**
- **Frontend:** Vite, React, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Node.js, Express, Socket.io (Native WebSockets)
- **AI/ML:** Google Gemini 2.0 Flash (optional), RAG (Retrieval-Augmented Generation), Rule-Based Offline Analysis Engine, Embedded SOP Knowledge Base

---

## 🎨 Design Features

- **🌗 Light/Dark Mode Toggle** — Full dual-theme support with a high-fidelity cyber-grid tactical aesthetic in dark mode (`slate-950` blacks, glowing borders) and warm pastel orange tones in light mode.
- **🌊 Animated Wave Background** — Subtle pastel orange SVG wave layers visible in both themes.
- **🏛️ Cultural Vector Artwork** — Custom SVG illustrations of temple spires, prayer flags, Kalash, and Sangam river currents on the login screen.
- **📱 Responsive Layout** — Optimized for desktop command center displays with responsive breakpoints.

---

## 💻 Local Installation & Quick Start

Follow these steps to boot the entire integrated command center locally in seconds:

**Step 1: Install Dependencies**  
Install all packages for both the frontend and backend using our unified root script.
```bash
npm install
npm run install:all
```

**Step 2: Configure AI Advisor (Optional)**  
To enable Gemini-powered AI responses, add your Google Gemini API key:
```bash
# Create backend/.env file
echo GEMINI_API_KEY=your_key_here > backend/.env
```
> 💡 *Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). **This is optional** — the AI Advisor works fully without it using the built-in offline analysis engine.*

**Step 3: Boot the Systems**  
Launch both the Express/Socket.io backend and the Vite frontend simultaneously.
```bash
npm run dev
```

**Step 4: To access the Dashboard**  
Open your browser and navigate to the tactical system UI:  
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🌍 Live Global Production Deployments

The system is fully deployed and actively running live telemetry.

| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | Vercel | [sangam-drishti.vercel.app](https://sangam-drishti.vercel.app/) |
| **Backend** | Render | [sangam-drishti-backend.onrender.com](https://sangam-drishti-backend.onrender.com/) |

> ⚠️ *The backend URL is a WebSocket data pipeline stream — it is not designed to be opened directly in a browser.*

---

*Configuration Profile: Prayagraj 2028 Mega-Crowd Protocol Enabled*
