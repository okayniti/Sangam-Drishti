// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLER — Pure atomic mutation endpoints for the Event Ops Command Center.
// Each route calls into telemetrySimulator functions and triggers an
// immediate Socket.io broadcast of the updated state.
// ═══════════════════════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const telemetry = require('./telemetrySimulator');

// POST /api/dispatch — Assign a volunteer to an incident
router.post('/dispatch', (req, res) => {
  const { volunteerId, incidentId } = req.body;
  if (!volunteerId || !incidentId) {
    return res.status(400).json({ success: false, error: 'volunteerId and incidentId are required' });
  }
  const result = telemetry.dispatchVolunteer(volunteerId, incidentId);
  res.json(result);
});

// POST /api/resolve — Mark an incident as resolved
router.post('/resolve', (req, res) => {
  const { incidentId } = req.body;
  if (!incidentId) {
    return res.status(400).json({ success: false, error: 'incidentId is required' });
  }
  const result = telemetry.resolveIncident(incidentId);
  res.json(result);
});

// POST /api/inject — Manually inject a new incident
router.post('/inject', (req, res) => {
  const { description, priority, x, y } = req.body;
  const result = telemetry.injectIncident(description, priority, x, y);
  res.json(result);
});

// POST /api/toggle-pause — Pause or resume the telemetry simulator
router.post('/toggle-pause', (req, res) => {
  const result = telemetry.togglePause();
  res.json(result);
});

// GET /api/state — Retrieve current state snapshot
router.get('/state', (req, res) => {
  res.json(telemetry.getState());
});

module.exports = router;
