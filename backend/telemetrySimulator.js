// ═══════════════════════════════════════════════════════════════════════════════
// TELEMETRY SIMULATOR — Mahakumbh 2028 Integrated Command Control Center
// Maintains live in-memory state for Operational Alerts, Sevadars/NDRF/Police,
// and Ghat/Sector Zones. Ticks every 4s: shifts responder coords, fluctuates
// pilgrim density, injects structured Mela incident alerts via Socket.io.
// ═══════════════════════════════════════════════════════════════════════════════

let io = null;
let simulatorPaused = false;
let tickInterval = null;

// ─── MAHAKUMBH MELA INCIDENT TEMPLATES ──────────────────────────────────────
const INCIDENT_TEMPLATES = [
  { desc: 'Severe crowd stagnation & surge building at Pontoon Bridge No. 3', priority: 'CRITICAL' },
  { desc: 'Sudden density spike over 90% at Sangam Ghat VIP platform', priority: 'CRITICAL' },
  { desc: 'Stampede risk — uncontrolled pilgrim influx at Triveni Sangam entry', priority: 'CRITICAL' },
  { desc: 'Structural stress alert on Pontoon Bridge No. 5 — overload detected', priority: 'CRITICAL' },
  { desc: 'Drowning alert — pilgrim swept by current near Sector 2 deep bathing zone', priority: 'CRITICAL' },
  { desc: 'Mass lost-and-found report logged at Sector 4 Lost & Found Center', priority: 'WARNING' },
  { desc: 'High river current advisory flag raised near Sector 2 deep bathing perimeter', priority: 'WARNING' },
  { desc: 'Temporary medical camp at Sector 6 reporting overcapacity', priority: 'WARNING' },
  { desc: 'Water tanker supply disruption along Kali Marg — pilgrim dehydration risk', priority: 'WARNING' },
  { desc: 'PA system malfunction at Dashashwamedh Ghat Entry corridor', priority: 'WARNING' },
  { desc: 'VIP convoy route clearance request — Akhara procession approaching', priority: 'WARNING' },
  { desc: 'E-Rickshaw transit bottleneck detected along Kali Marg main arterial approach', priority: 'ROUTINE' },
  { desc: 'Minor sanitation overflow at portable facility block near Akharas Camp', priority: 'ROUTINE' },
  { desc: 'Lost elderly pilgrim reported near Sector 3 Pontoon Bridge', priority: 'ROUTINE' },
  { desc: 'Unauthorized vendor encroachment blocking pedestrian corridor Sector 5', priority: 'ROUTINE' },
  { desc: 'Lighting failure reported along riverbank path between Sector 2–3', priority: 'ROUTINE' },
];

// ─── GLOBAL STATE: MELA RESPONDERS (Sevadars / NDRF / Sector Police) ────────
const volunteers = [
  { id: 'SEV-001', name: 'Rajesh Tiwari',     initials: 'MS', x: 180, y: 250, status: 'Available', assignedIncidentId: null, designation: 'Mela Sevadar' },
  { id: 'SEV-002', name: 'Priya Verma',       initials: 'MS', x: 450, y: 180, status: 'Available', assignedIncidentId: null, designation: 'Mela Sevadar' },
  { id: 'SEV-003', name: 'Cmdr. R. Kapoor',   initials: 'ND', x: 700, y: 350, status: 'Available', assignedIncidentId: null, designation: 'NDRF Rescue Squad' },
  { id: 'SEV-004', name: 'SI Sneha Patel',    initials: 'SP', x: 300, y: 500, status: 'Available', assignedIncidentId: null, designation: 'Sector Police' },
  { id: 'SEV-005', name: 'Vikram Dwivedi',    initials: 'MS', x: 550, y: 420, status: 'Available', assignedIncidentId: null, designation: 'Mela Sevadar' },
  { id: 'SEV-006', name: 'Lt. Anjali Desai',  initials: 'ND', x: 150, y: 600, status: 'Available', assignedIncidentId: null, designation: 'NDRF Rescue Squad' },
  { id: 'SEV-007', name: 'ASI Karan Singh',   initials: 'SP', x: 820, y: 150, status: 'Available', assignedIncidentId: null, designation: 'Sector Police' },
  { id: 'SEV-008', name: 'Meera Pandey',      initials: 'MS', x: 600, y: 580, status: 'Available', assignedIncidentId: null, designation: 'Mela Sevadar' },
];

// ─── GLOBAL STATE: MAHAKUMBH GHAT & SECTOR ZONES ───────────────────────────
const crowdZones = [
  { id: 'GHAT-A', name: 'Triveni Sangam Bathing Ghat',  x: 50,  y: 50,  width: 280, height: 200, capacity: 50000, currentOccupancy: 28000, anomaly: false },
  { id: 'SECT-B', name: 'Sector 3 Pontoon Bridge',      x: 400, y: 30,  width: 220, height: 160, capacity: 15000, currentOccupancy: 8000,  anomaly: false },
  { id: 'SECT-C', name: 'Kali Marg Sector Intersection', x: 680, y: 80,  width: 260, height: 200, capacity: 25000, currentOccupancy: 14000, anomaly: false },
  { id: 'GHAT-D', name: 'Dashashwamedh Ghat Entry',     x: 80,  y: 340, width: 250, height: 200, capacity: 30000, currentOccupancy: 16000, anomaly: false },
  { id: 'CAMP-E', name: 'Akharas & Sadhu Camp Area',    x: 420, y: 360, width: 260, height: 210, capacity: 20000, currentOccupancy: 10000, anomaly: false },
];

// ─── GLOBAL STATE: INCIDENTS ────────────────────────────────────────────────
let incidentCounter = 3;
const incidents = [
  {
    id: 'INC-001',
    description: 'Severe crowd stagnation & surge building at Pontoon Bridge No. 3',
    priority: 'CRITICAL',
    x: 500, y: 110,
    status: 'UNASSIGNED',
    assignedVolunteerId: null,
    createdAt: Date.now() - 120000,
    resolvedAt: null,
  },
  {
    id: 'INC-002',
    description: 'High river current advisory flag raised near Sector 2 deep bathing perimeter',
    priority: 'WARNING',
    x: 200, y: 150,
    status: 'UNASSIGNED',
    assignedVolunteerId: null,
    createdAt: Date.now() - 60000,
    resolvedAt: null,
  },
  {
    id: 'INC-003',
    description: 'Lost elderly pilgrim reported near Sector 3 Pontoon Bridge',
    priority: 'ROUTINE',
    x: 480, y: 420,
    status: 'UNASSIGNED',
    assignedVolunteerId: null,
    createdAt: Date.now() - 30000,
    resolvedAt: null,
  },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function generateIncidentId() {
  incidentCounter++;
  return `INC-${String(incidentCounter).padStart(3, '0')}`;
}

// ─── CORE TICK (every 4 seconds) ────────────────────────────────────────────
function tick() {
  if (simulatorPaused) return;

  // 1) Shift volunteer positions to simulate dynamic walking patterns
  volunteers.forEach((v) => {
    if (v.status === 'Available') {
      // Random walk — subtle drift
      v.x = clamp(v.x + (Math.random() - 0.5) * 14, 25, 965);
      v.y = clamp(v.y + (Math.random() - 0.5) * 14, 25, 675);
    } else if (v.status === 'En Route' && v.assignedIncidentId) {
      // Move toward assigned incident
      const incident = incidents.find((i) => i.id === v.assignedIncidentId);
      if (incident) {
        const dx = incident.x - v.x;
        const dy = incident.y - v.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 20) {
          // Arrived on scene
          v.status = 'On Scene';
          v.x = incident.x + (Math.random() - 0.5) * 8;
          v.y = incident.y + (Math.random() - 0.5) * 8;
          incident.status = 'ACTIVE';
        } else {
          const speed = Math.min(28, dist * 0.25);
          v.x += (dx / dist) * speed;
          v.y += (dy / dist) * speed;
        }
      }
    } else if (v.status === 'On Scene') {
      // Slight jitter at scene
      v.x = clamp(v.x + (Math.random() - 0.5) * 3, 25, 965);
      v.y = clamp(v.y + (Math.random() - 0.5) * 3, 25, 675);
    }
  });

  // 2) Fluctuate pilgrim density by random integers
  crowdZones.forEach((z) => {
    const delta = Math.floor((Math.random() - 0.42) * 2800);
    z.currentOccupancy = clamp(
      z.currentOccupancy + delta,
      Math.floor(z.capacity * 0.08),
      z.capacity
    );
    const ratio = z.currentOccupancy / z.capacity;
    z.anomaly = ratio > 0.85;
  });

  // 3) Maybe inject a structured mock incident (12% chance per tick)
  if (Math.random() < 0.12) {
    injectRandomIncident();
  }

  // 4) Broadcast complete state snapshot
  broadcastState();
}

function injectRandomIncident() {
  const template =
    INCIDENT_TEMPLATES[Math.floor(Math.random() * INCIDENT_TEMPLATES.length)];
  const id = generateIncidentId();

  // Place incident within one of the zones for realism
  const zone = crowdZones[Math.floor(Math.random() * crowdZones.length)];
  const x = zone.x + Math.random() * zone.width;
  const y = zone.y + Math.random() * zone.height;

  const incident = {
    id,
    description: template.desc,
    priority: template.priority,
    x: Math.round(x),
    y: Math.round(y),
    status: 'UNASSIGNED',
    assignedVolunteerId: null,
    createdAt: Date.now(),
    resolvedAt: null,
  };
  incidents.push(incident);
  return incident;
}

// ─── MUTATION FUNCTIONS ─────────────────────────────────────────────────────

/**
 * Dispatch an available volunteer to an incident.
 * Sets volunteer status to "En Route" and pins them to the incident.
 */
function dispatchVolunteer(volunteerId, incidentId) {
  const volunteer = volunteers.find((v) => v.id === volunteerId);
  const incident = incidents.find((i) => i.id === incidentId);

  if (!volunteer) return { success: false, error: 'Volunteer not found' };
  if (!incident) return { success: false, error: 'Incident not found' };
  if (volunteer.status !== 'Available')
    return { success: false, error: 'Volunteer is not available' };
  if (incident.status === 'RESOLVED')
    return { success: false, error: 'Incident already resolved' };

  volunteer.status = 'En Route';
  volunteer.assignedIncidentId = incidentId;
  incident.status = 'DISPATCHED';
  incident.assignedVolunteerId = volunteerId;

  broadcastState();
  return { success: true, volunteer, incident };
}

/**
 * Mark an incident as resolved and free the assigned volunteer.
 */
function resolveIncident(incidentId) {
  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) return { success: false, error: 'Incident not found' };
  if (incident.status === 'RESOLVED')
    return { success: false, error: 'Already resolved' };

  incident.status = 'RESOLVED';
  incident.resolvedAt = Date.now();

  // Release assigned volunteer
  if (incident.assignedVolunteerId) {
    const volunteer = volunteers.find(
      (v) => v.id === incident.assignedVolunteerId
    );
    if (volunteer) {
      volunteer.status = 'Available';
      volunteer.assignedIncidentId = null;
    }
  }

  broadcastState();
  return { success: true, incident };
}

/**
 * Manually inject a new incident with custom parameters.
 */
function injectIncident(description, priority, x, y) {
  const id = generateIncidentId();
  const incident = {
    id,
    description: description || 'Manual incident report',
    priority: priority || 'WARNING',
    x: x != null ? x : Math.round(50 + Math.random() * 880),
    y: y != null ? y : Math.round(50 + Math.random() * 600),
    status: 'UNASSIGNED',
    assignedVolunteerId: null,
    createdAt: Date.now(),
    resolvedAt: null,
  };
  incidents.push(incident);
  broadcastState();
  return { success: true, incident };
}

/**
 * Toggle simulator pause state.
 */
function togglePause() {
  simulatorPaused = !simulatorPaused;
  broadcastState();
  return { success: true, paused: simulatorPaused };
}

/**
 * Return a complete snapshot of all current state.
 */
function getState() {
  return {
    incidents: [...incidents],
    volunteers: [...volunteers],
    crowdZones: [...crowdZones],
    paused: simulatorPaused,
    timestamp: Date.now(),
  };
}

/**
 * Broadcast the full state to all connected Socket.io clients.
 */
function broadcastState() {
  if (io) {
    io.emit('state:sync', getState());
  }
}

// ─── INITIALIZATION ─────────────────────────────────────────────────────────
function init(socketIo) {
  io = socketIo;
  tickInterval = setInterval(tick, 4000);
  console.log('[TELEMETRY] Mahakumbh 2028 simulator online — ticking every 4 seconds');
  console.log(
    `[TELEMETRY] Seeded: ${volunteers.length} responders, ${crowdZones.length} ghats/sectors, ${incidents.length} alerts`
  );
}

module.exports = {
  init,
  getState,
  dispatchVolunteer,
  resolveIncident,
  injectIncident,
  togglePause,
};
