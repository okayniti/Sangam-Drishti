// ═══════════════════════════════════════════════════════════════════════════════
// MAHAKUMBH SOP KNOWLEDGE BASE — Embedded Standard Operating Procedures
// Used as the "Retrieval" context in the RAG pipeline for the Situational Advisor.
// These SOPs are injected into the Gemini system prompt so every AI response
// is grounded in real Mela management protocols.
// ═══════════════════════════════════════════════════════════════════════════════

const MAHAKUMBH_SOPS = {
  crowdManagement: `
## CROWD DENSITY MANAGEMENT — Standard Operating Procedure

### Density Thresholds & Response Levels
- **GREEN (0–60% capacity):** Normal operations. Maintain routine patrol density.
- **AMBER (60–80% capacity):** Heightened alert. Deploy additional Sevadars to entry/exit corridors. 
  Activate one-way flow protocols on all pontoon bridges. PA system announces: "Snaan kripya sheeghrata se karein."
- **RED (80–90% capacity):** Critical. Close secondary entry gates. Divert incoming pilgrim flow to 
  adjacent sectors via Kali Marg arterial. Request NDRF standby at all pontoon bridge exits. 
  Notify District Magistrate (DM) office.
- **BLACK (>90% capacity):** Emergency. Close ALL entry gates to the affected ghat/sector. 
  Activate emergency exit corridors. Deploy NDRF crowd dispersal teams. PA system switches to 
  emergency evacuation announcements in Hindi, English, and regional languages. 
  Notify State Emergency Operations Center (SEOC).

### Pontoon Bridge Protocols
- Maximum bridge load: 5,000 persons at any time per pontoon bridge.
- Bridge monitoring via structural stress sensors every 30 seconds.
- If load exceeds 80%: activate one-way flow (Sangam-side to city-side only).
- If load exceeds 95%: IMMEDIATE closure. Divert to adjacent bridges.
- Bridge marshals stationed every 50 meters with walkie-talkie communication.

### Gate Management
- 12 primary entry gates, each with turnstile counters.
- Dynamic gate closure decisions made by Sector Commander based on real-time density data.
- Gate closure notification propagated to all PA systems within 30 seconds.
- Re-opening requires density to drop below 70% for at least 10 minutes.
`,

  stampedeProtocol: `
## STAMPEDE PREVENTION & RESPONSE — Standard Operating Procedure

### Early Warning Indicators
- Sudden unidirectional crowd flow exceeding 2m/s average velocity.
- Density exceeding 6 persons/sq meter in any zone.
- Multiple simultaneous "fall" reports from field marshals.
- Crowd pressure reports from pontoon bridge sensors.

### Immediate Response (First 60 Seconds)
1. Sound emergency siren at the affected zone (3 short bursts).
2. Activate emergency PA: "Kripya shaant rahein, apni jagah pe khade rahein" (Please remain calm, stay where you are).
3. Deploy ALL available NDRF units to the zone perimeter.
4. Open emergency exit corridors (pre-designated in sector blueprints).
5. Halt ALL incoming pedestrian traffic within 500m radius.

### Sustained Response (1–10 Minutes)
1. Medical rapid response teams dispatched to the zone center.
2. Ambulances pre-positioned at emergency vehicle access points.
3. Establish triage area at nearest medical camp.
4. Notify all hospitals within 15km radius (Swaroop Rani, Tej Bahadur Sapru, etc.).
5. Deploy drone for aerial crowd assessment.

### Post-Incident
1. Preserve scene for investigation.
2. Collect CCTV footage from all cameras covering the zone.
3. File FIR at nearest police station.
4. Conduct debrief with all responding units within 4 hours.
`,

  waterRescue: `
## WATER RESCUE & DROWNING RESPONSE — Standard Operating Procedure

### Risk Zones
- Sector 2 deep bathing zone (river depth >6 feet).
- Sangam confluence point (strong undercurrents during peak flow).
- Pontoon bridge edges (gap between bridge and riverbank).

### Prevention Measures
- Lifeguard posts every 100 meters along bathing ghats.
- Orange buoy rope barriers marking safe bathing perimeter.
- PA announcements every 15 minutes: "Deep water boundary ke bahar na jayein."
- Current speed monitoring via river gauges — if >2 knots, restrict bathing.

### Drowning Alert Response
1. Lifeguard enters water immediately (response time target: <30 seconds).
2. Throw ring buoys to victim — 3 buoys stationed per 100m stretch.
3. Alert NDRF Rescue Squad via radio channel (dedicated water rescue channel).
4. NDRF deploys rescue boat (3 boats pre-staged along bathing stretch).
5. If victim submerged >60 seconds: call for dive team.
6. Medical team on standby at nearest ghat-side first aid post.
7. If victim recovered: CPR administered immediately, transport to medical camp.

### River Current Advisory Levels
- **Normal (<1.5 knots):** Open bathing. Standard lifeguard deployment.
- **Elevated (1.5–2.5 knots):** Restricted bathing. Double lifeguard posts. PA warnings.
- **Dangerous (>2.5 knots):** Close all bathing zones. Barrier extension deployed.
`,

  medicalEmergency: `
## MEDICAL EMERGENCY ESCALATION — Standard Operating Procedure

### Triage Categories (Mass Casualty Incident)
- **T1 (Immediate/Red):** Life-threatening injuries requiring immediate intervention.
  Transport to nearest hospital within 15 minutes (Golden Hour protocol).
- **T2 (Urgent/Yellow):** Serious but stable. Can wait up to 1 hour.
  Treat at sector medical camp.
- **T3 (Delayed/Green):** Walking wounded, minor injuries.
  Treat at first-aid post.
- **T4 (Expectant/Black):** Deceased or unsurvivable injuries.
  Record and cover. Notify mortuary services.

### Medical Resource Deployment
- 6 sector medical camps (one per sector), each with 20-bed capacity.
- 15 first-aid posts distributed across all ghats.
- 12 ambulances on 24/7 standby (4 ALS, 8 BLS).
- Helicopter evacuation available for T1 cases (helipad at Parade Ground).

### Heat Stroke Protocol (Peak Season)
- Water distribution stations every 200 meters.
- Cooling tents at each sector entry point.
- If ambient temperature >42°C: mandatory 2-hour bathing window closure (11AM–1PM).
- Oral Rehydration Salt (ORS) packets distributed free at all entry gates.
`,

  lostPersons: `
## LOST PERSON TRACKING — Standard Operating Procedure

### Registration & Reporting
- Lost person reports filed at any of 8 Lost & Found centers.
- Mandatory data capture: Name, age, photo (if available), last known location,
  clothing description, medical conditions, emergency contact.
- Each case assigned unique tracking ID (LP-XXXX format).

### Search Protocol
- Immediate PA announcement in affected sector + adjacent sectors.
- Announcement repeated every 10 minutes for 2 hours.
- If child (<12 years): Escalate to PRIORITY search. Deploy 2 dedicated search teams.
- If elderly (>65 years) or medical dependency: Escalate to PRIORITY search.
- Share photo + description with all sector marshal teams via WhatsApp group.

### Technology-Assisted Search
- Face recognition matching against CCTV feeds (if photo available).
- GPS wristband database query (for pilgrims who registered with wristbands).
- PA system + digital display boards at all major intersections.

### Reunification
- Reunification point: Central Lost & Found Center, Sector 4.
- Identity verification required before handover.
- Case closed with timestamp and confirmation photo.
`,

  vipManagement: `
## VIP & AKHARA PROCESSION MANAGEMENT — Standard Operating Procedure

### Procession Route Clearance
- Route clearance begins 2 hours before scheduled procession.
- All cross-traffic halted 30 minutes before procession arrival.
- Sector Police deployed every 25 meters along procession route.
- Barricading team deploys crash barriers along full route.

### Akhara Procession Specific
- Each Akhara assigned specific time slot for Shahi Snan.
- Maximum procession width: 15 meters (enforced by barricade positioning).
- Speed of procession: approximately 2 km/h.
- Medical team embedded within procession (1 ambulance per Akhara).

### VIP Movement
- VIP vehicles restricted to designated VIP corridor.
- Escort: 2 pilot vehicles, 1 ambulance.
- VIP ghat access via separate dedicated entry (Gate 12).
- Aerial security: drone surveillance during VIP bathing window.
`
};

/**
 * Format the SOP knowledge base into a single string for injection into
 * the Gemini system prompt. Only includes SOPs relevant to the current
 * situation based on active incidents and zone anomalies.
 */
function getRelevantSOPs(state) {
  const { incidents, crowdZones } = state;

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const descriptions = activeIncidents.map(i => i.description.toLowerCase()).join(' ');
  const hasAnomalies = crowdZones.some(z => z.anomaly);

  // Always include crowd management (core SOP)
  let relevantSOPs = [MAHAKUMBH_SOPS.crowdManagement];

  // Include stampede protocol if crowd anomalies or stampede-related incidents
  if (hasAnomalies || descriptions.includes('stampede') || descriptions.includes('surge') || descriptions.includes('stagnation') || descriptions.includes('density')) {
    relevantSOPs.push(MAHAKUMBH_SOPS.stampedeProtocol);
  }

  // Include water rescue if drowning/water-related incidents
  if (descriptions.includes('drown') || descriptions.includes('river') || descriptions.includes('current') || descriptions.includes('water') || descriptions.includes('bathing')) {
    relevantSOPs.push(MAHAKUMBH_SOPS.waterRescue);
  }

  // Include medical if medical-related
  if (descriptions.includes('medical') || descriptions.includes('hospital') || descriptions.includes('injury') || descriptions.includes('overcapacity') || descriptions.includes('dehydration')) {
    relevantSOPs.push(MAHAKUMBH_SOPS.medicalEmergency);
  }

  // Include lost persons if relevant
  if (descriptions.includes('lost') || descriptions.includes('missing') || descriptions.includes('found')) {
    relevantSOPs.push(MAHAKUMBH_SOPS.lostPersons);
  }

  // Include VIP if relevant
  if (descriptions.includes('vip') || descriptions.includes('akhara') || descriptions.includes('procession') || descriptions.includes('convoy')) {
    relevantSOPs.push(MAHAKUMBH_SOPS.vipManagement);
  }

  return relevantSOPs.join('\n\n---\n\n');
}

/**
 * Format the live telemetry state into a human-readable briefing
 * for injection into the Gemini system prompt.
 */
function formatLiveContext(state) {
  const { incidents, volunteers, crowdZones } = state;

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED');

  const criticalCount = activeIncidents.filter(i => i.priority === 'CRITICAL').length;
  const warningCount = activeIncidents.filter(i => i.priority === 'WARNING').length;
  const routineCount = activeIncidents.filter(i => i.priority === 'ROUTINE').length;

  const availableVols = volunteers.filter(v => v.status === 'Available');
  const enRouteVols = volunteers.filter(v => v.status === 'En Route');
  const onSceneVols = volunteers.filter(v => v.status === 'On Scene');

  let context = `## LIVE SITUATION REPORT — ${new Date().toISOString()}\n\n`;

  // Incident Summary
  context += `### Active Incidents: ${activeIncidents.length} total\n`;
  context += `- 🔴 CRITICAL: ${criticalCount}\n`;
  context += `- 🟡 WARNING: ${warningCount}\n`;
  context += `- 🔵 ROUTINE: ${routineCount}\n`;
  context += `- ✅ RESOLVED (session): ${resolvedIncidents.length}\n\n`;

  // Active Incident Details
  if (activeIncidents.length > 0) {
    context += `### Active Incident Details:\n`;
    activeIncidents.forEach(inc => {
      const assignedVol = inc.assignedVolunteerId 
        ? volunteers.find(v => v.id === inc.assignedVolunteerId)
        : null;
      const age = Math.round((Date.now() - inc.createdAt) / 60000);
      context += `- **[${inc.id}] ${inc.priority}** — ${inc.description}\n`;
      context += `  Status: ${inc.status} | Location: (${Math.round(inc.x)}, ${Math.round(inc.y)}) | Age: ${age} min\n`;
      if (assignedVol) {
        context += `  Assigned: ${assignedVol.name} (${assignedVol.designation}) — ${assignedVol.status}\n`;
      }
    });
    context += '\n';
  }

  // Responder Status
  context += `### Responder Deployment:\n`;
  context += `- Available: ${availableVols.length}/${volunteers.length}\n`;
  context += `- En Route: ${enRouteVols.length}\n`;
  context += `- On Scene: ${onSceneVols.length}\n\n`;

  context += `#### Available Responders:\n`;
  availableVols.forEach(v => {
    context += `- ${v.name} (${v.id}) — ${v.designation} — Position: (${Math.round(v.x)}, ${Math.round(v.y)})\n`;
  });
  context += '\n';

  // Crowd Zone Status
  context += `### Crowd Zone Status:\n`;
  crowdZones.forEach(z => {
    const pct = Math.round((z.currentOccupancy / z.capacity) * 100);
    const level = pct > 90 ? '🚨 BLACK' : pct > 80 ? '🔴 RED' : pct > 60 ? '🟡 AMBER' : '🟢 GREEN';
    context += `- **${z.name}** (${z.id}): ${z.currentOccupancy.toLocaleString()}/${z.capacity.toLocaleString()} (${pct}%) — ${level}`;
    if (z.anomaly) context += ' ⚠️ ANOMALY DETECTED';
    context += '\n';
  });

  return context;
}

module.exports = { getRelevantSOPs, formatLiveContext, MAHAKUMBH_SOPS };
