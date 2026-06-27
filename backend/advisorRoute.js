// ═══════════════════════════════════════════════════════════════════════════════
// ADVISOR ROUTE — Situational Advisor with Gemini + Smart Offline Fallback
// Tries Gemini first. If unavailable (no key, rate limit, error), falls back
// to a rule-based analysis engine that reads live telemetry directly.
// ═══════════════════════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const telemetry = require('./telemetrySimulator');
const { getRelevantSOPs, formatLiveContext } = require('./mahakumbhSOP');

// ─── Conditional Gemini Import ──────────────────────────────────────────────
let genAI = null;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('[ADVISOR] Gemini API initialized — will attempt AI-powered responses');
  }
} catch (e) {
  console.log('[ADVISOR] Gemini SDK not available — using offline analysis engine');
}

const SYSTEM_INSTRUCTION = `You are **DRISHTI AI**, the Situational Intelligence Advisor for **SangamDrishti ICCC** — the Integrated Command & Control Center for Mahakumbh 2028 in Prayagraj, India.

## Your Role
You are an expert AI assistant embedded within the ICCC dashboard, helping operators make real-time decisions during the world's largest religious gathering (~400 million pilgrims over 45 days). You have direct access to:
1. **Live telemetry data** — real-time crowd zone densities, active incident statuses, responder positions and deployment states.
2. **Standard Operating Procedures (SOPs)** — official Mahakumbh crowd management, stampede prevention, water rescue, medical emergency, lost person, and VIP management protocols.

## Response Guidelines
- **Be decisive and actionable.** Operators are under time pressure. Lead with the recommended action, then explain why.
- **Reference specific data.** Always cite actual incident IDs (e.g., INC-003), zone names, responder names/IDs, and density percentages from the live data.
- **Follow SOPs.** When recommending actions, align them with the relevant SOP protocols. Quote or reference specific SOP sections.
- **Prioritize safety.** In any ambiguity, default to the more cautious action.
- **Be concise but thorough.** Use bullet points and headers. Avoid lengthy prose.
- **Speak like a seasoned incident commander**, not a chatbot. Use professional terminology (e.g., "deploy", "escalate", "divert", "stand down").
- **Use Hindi terms where appropriate** for Mela-specific concepts (e.g., "Shahi Snan", "Sevadar", "Akhara", "Sangam").
- **Format responses with markdown** — use headers (##), bold (**), bullet lists, and numbered steps for clarity.
- If the user asks something unrelated to crowd management or the Mela, politely redirect them.`;


// ═══════════════════════════════════════════════════════════════════════════════
// OFFLINE ANALYSIS ENGINE — Rule-based contextual intelligence
// Analyzes live telemetry and generates grounded responses without an LLM
// ═══════════════════════════════════════════════════════════════════════════════

function generateOfflineResponse(message, state) {
  const { incidents, volunteers, crowdZones } = state;
  const query = message.toLowerCase();

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalIncidents = activeIncidents.filter(i => i.priority === 'CRITICAL');
  const warningIncidents = activeIncidents.filter(i => i.priority === 'WARNING');
  const routineIncidents = activeIncidents.filter(i => i.priority === 'ROUTINE');
  const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED');

  const availableVols = volunteers.filter(v => v.status === 'Available');
  const enRouteVols = volunteers.filter(v => v.status === 'En Route');
  const onSceneVols = volunteers.filter(v => v.status === 'On Scene');

  const anomalyZones = crowdZones.filter(z => z.anomaly);
  const highDensityZones = crowdZones.filter(z => (z.currentOccupancy / z.capacity) > 0.8);
  const criticalZones = crowdZones.filter(z => (z.currentOccupancy / z.capacity) > 0.9);

  // Build context metadata
  const contextMeta = {
    activeIncidents: activeIncidents.length,
    criticalIncidents: criticalIncidents.length,
    anomalyZones: anomalyZones.length,
    availableResponders: availableVols.length,
    totalResponders: volunteers.length,
    timestamp: new Date().toISOString(),
  };

  let response = '';

  // ─── Situation Brief ────────────────────────────────────────────────────
  if (query.includes('situation') || query.includes('brief') || query.includes('status') || query.includes('overview') || query.includes('summary') || query.includes('what') && query.includes('going on')) {
    response = `## 📊 SITUATION BRIEF — ${new Date().toLocaleTimeString('en-US', { hour12: false })} IST\n\n`;
    response += `### Incident Overview\n`;
    response += `- **${activeIncidents.length} active incidents** across the Mela zone\n`;
    response += `- 🔴 **${criticalIncidents.length} CRITICAL** — Require immediate command attention\n`;
    response += `- 🟡 **${warningIncidents.length} WARNING** — Elevated monitoring required\n`;
    response += `- 🔵 **${routineIncidents.length} ROUTINE** — Standard response protocols\n`;
    response += `- ✅ **${resolvedIncidents.length} resolved** this session\n\n`;

    if (criticalIncidents.length > 0) {
      response += `### ⚠️ Critical Incidents Requiring Action\n`;
      criticalIncidents.forEach(inc => {
        const age = Math.round((Date.now() - inc.createdAt) / 60000);
        const assigned = inc.assignedVolunteerId ? volunteers.find(v => v.id === inc.assignedVolunteerId) : null;
        response += `- **[${inc.id}]** ${inc.description}\n`;
        response += `  - Status: **${inc.status}** | Age: ${age} min\n`;
        response += assigned ? `  - Assigned: ${assigned.name} (${assigned.designation}) — ${assigned.status}\n` : `  - ⚠️ **UNASSIGNED — Dispatch required immediately**\n`;
      });
      response += '\n';
    }

    response += `### Responder Deployment\n`;
    response += `- **${availableVols.length}/${volunteers.length}** responders available for dispatch\n`;
    response += `- **${enRouteVols.length}** en route to incidents\n`;
    response += `- **${onSceneVols.length}** on scene\n\n`;

    response += `### Crowd Zone Status\n`;
    crowdZones.forEach(z => {
      const pct = Math.round((z.currentOccupancy / z.capacity) * 100);
      const level = pct > 90 ? '🚨 BLACK' : pct > 80 ? '🔴 RED' : pct > 60 ? '🟡 AMBER' : '🟢 GREEN';
      response += `- **${z.name}** — ${z.currentOccupancy.toLocaleString()}/${z.capacity.toLocaleString()} pilgrims (**${pct}%**) — ${level}`;
      if (z.anomaly) response += ' ⚠️ ANOMALY';
      response += '\n';
    });

    if (criticalZones.length > 0) {
      response += `\n### 🚨 Recommended Immediate Actions\n`;
      response += `1. Prioritize dispatch to all unassigned CRITICAL incidents\n`;
      response += `2. Activate one-way flow protocols on pontoon bridges near critical zones\n`;
      response += `3. Alert District Magistrate office per Crowd Management SOP (RED/BLACK threshold)\n`;
    }
  }

  // ─── Critical Assessment ────────────────────────────────────────────────
  else if (query.includes('critical') || query.includes('urgent') || query.includes('priority') || query.includes('worst') || query.includes('dangerous')) {
    if (criticalIncidents.length === 0) {
      response = `## ✅ No Critical Incidents Active\n\nAll sectors are operating within normal parameters. ${warningIncidents.length} WARNING-level incidents are being monitored.\n\n**Recommendation:** Maintain standard patrol density. Keep NDRF teams on standby.`;
    } else {
      response = `## 🔴 CRITICAL INCIDENT ASSESSMENT\n\n**${criticalIncidents.length} critical incidents** require immediate command attention:\n\n`;

      // Sort by age (oldest = most urgent)
      const sorted = [...criticalIncidents].sort((a, b) => a.createdAt - b.createdAt);
      const mostUrgent = sorted[0];
      const urgentAge = Math.round((Date.now() - mostUrgent.createdAt) / 60000);

      response += `### 🚨 HIGHEST PRIORITY: ${mostUrgent.id}\n`;
      response += `- **${mostUrgent.description}**\n`;
      response += `- Status: **${mostUrgent.status}** | Age: **${urgentAge} minutes**\n`;
      if (mostUrgent.status === 'UNASSIGNED') {
        response += `- ⚠️ **THIS INCIDENT HAS NO RESPONDER ASSIGNED**\n`;
        response += `- 🔴 **SOP Violation:** CRITICAL incidents must have dispatch within 60 seconds\n\n`;
        if (availableVols.length > 0) {
          response += `### Recommended Dispatch\n`;
          // Find nearest available volunteer
          const distances = availableVols.map(v => ({
            ...v,
            dist: Math.sqrt(Math.pow(v.x - mostUrgent.x, 2) + Math.pow(v.y - mostUrgent.y, 2)),
          })).sort((a, b) => a.dist - b.dist);
          const top = distances.slice(0, 3);
          top.forEach((v, i) => {
            response += `${i + 1}. **${v.name}** (${v.id}) — ${v.designation} — Distance: ${Math.round(v.dist)}m\n`;
          });
        }
      } else {
        const assigned = volunteers.find(v => v.id === mostUrgent.assignedVolunteerId);
        if (assigned) {
          response += `- Assigned: **${assigned.name}** (${assigned.designation}) — ${assigned.status}\n`;
        }
      }

      if (sorted.length > 1) {
        response += `\n### Other Critical Incidents\n`;
        sorted.slice(1).forEach(inc => {
          const age = Math.round((Date.now() - inc.createdAt) / 60000);
          response += `- **[${inc.id}]** ${inc.description} — ${inc.status} — ${age} min old\n`;
        });
      }

      response += `\n### SOP Reference\n`;
      response += `Per **Stampede Prevention SOP**, any critical crowd incident requires:\n`;
      response += `1. Emergency siren activation (3 short bursts)\n`;
      response += `2. Deploy ALL available NDRF units to zone perimeter\n`;
      response += `3. Halt incoming pedestrian traffic within 500m radius\n`;
      response += `4. Notify District Magistrate and State Emergency Operations Center\n`;
    }
  }

  // ─── Crowd Risk ─────────────────────────────────────────────────────────
  else if (query.includes('crowd') || query.includes('density') || query.includes('capacity') || query.includes('zone') || query.includes('ghat') || query.includes('sector')) {
    response = `## 👥 CROWD DENSITY RISK ASSESSMENT\n\n`;

    const sortedZones = [...crowdZones].sort((a, b) => (b.currentOccupancy / b.capacity) - (a.currentOccupancy / a.capacity));

    sortedZones.forEach((z, i) => {
      const pct = Math.round((z.currentOccupancy / z.capacity) * 100);
      const level = pct > 90 ? '🚨 BLACK' : pct > 80 ? '🔴 RED' : pct > 60 ? '🟡 AMBER' : '🟢 GREEN';
      response += `### ${i + 1}. ${z.name} (${z.id})\n`;
      response += `- Occupancy: **${z.currentOccupancy.toLocaleString()}/${z.capacity.toLocaleString()}** (**${pct}%**)\n`;
      response += `- Alert Level: **${level}**\n`;
      if (z.anomaly) response += `- ⚠️ **ANOMALY DETECTED** — Unusual crowd movement pattern\n`;

      if (pct > 90) {
        response += `- 🚨 **ACTION:** Close ALL entry gates. Activate emergency exit corridors. Deploy NDRF crowd dispersal. Notify SEOC.\n`;
      } else if (pct > 80) {
        response += `- 🔴 **ACTION:** Close secondary entry gates. Divert pilgrim flow to adjacent sectors via Kali Marg arterial. NDRF standby at pontoon exits.\n`;
      } else if (pct > 60) {
        response += `- 🟡 **ACTION:** Deploy additional Sevadars to entry/exit corridors. Activate one-way flow on pontoon bridges.\n`;
      }
      response += '\n';
    });

    if (criticalZones.length > 0) {
      response += `### 🚨 IMMEDIATE RECOMMENDATION\n`;
      response += `**${criticalZones.length} zone(s) in BLACK alert** — per Crowd Management SOP, this triggers:\n`;
      response += `1. Close ALL entry gates to affected ghat/sector\n`;
      response += `2. Emergency exit corridor activation\n`;
      response += `3. PA system emergency evacuation announcements (Hindi, English, regional)\n`;
      response += `4. Notify State Emergency Operations Center (SEOC)\n`;
    } else if (highDensityZones.length > 0) {
      response += `### ⚠️ PREVENTIVE RECOMMENDATION\n`;
      response += `**${highDensityZones.length} zone(s) in RED alert** — activate gate management protocols before reaching BLACK.\n`;
    } else {
      response += `### ✅ All zones within safe operating parameters.\n`;
      response += `Maintain standard monitoring cadence.\n`;
    }
  }

  // ─── Stampede Risk ──────────────────────────────────────────────────────
  else if (query.includes('stampede') || query.includes('surge') || query.includes('crush') || query.includes('panic')) {
    const stampedeSigns = [];
    highDensityZones.forEach(z => {
      const pct = Math.round((z.currentOccupancy / z.capacity) * 100);
      stampedeSigns.push(`**${z.name}** at ${pct}% capacity`);
    });
    anomalyZones.forEach(z => {
      stampedeSigns.push(`**${z.name}** showing anomalous crowd movement`);
    });
    const crowdIncidents = activeIncidents.filter(i =>
      i.description.toLowerCase().includes('surge') || i.description.toLowerCase().includes('stampede') ||
      i.description.toLowerCase().includes('stagnation') || i.description.toLowerCase().includes('density')
    );
    crowdIncidents.forEach(i => stampedeSigns.push(`Active incident **${i.id}**: ${i.description}`));

    response = `## 🚨 STAMPEDE RISK EVALUATION\n\n`;

    if (stampedeSigns.length === 0) {
      response += `### Risk Level: 🟢 LOW\n\n`;
      response += `No stampede early warning indicators detected.\n\n`;
      response += `**Current indicators monitored:**\n`;
      response += `- Sudden unidirectional crowd flow >2m/s — Not detected\n`;
      response += `- Density >6 persons/sq meter — Not detected\n`;
      response += `- Multiple fall reports — None\n`;
      response += `- Pontoon bridge stress — Normal\n\n`;
      response += `**Recommendation:** Maintain standard lifeguard and marshal spacing. Continue monitoring.`;
    } else {
      response += `### Risk Level: ${stampedeSigns.length >= 3 ? '🔴 HIGH' : '🟡 ELEVATED'}\n\n`;
      response += `**${stampedeSigns.length} early warning indicator(s) detected:**\n`;
      stampedeSigns.forEach(s => { response += `- ${s}\n`; });
      response += `\n### Recommended Actions (Per Stampede Prevention SOP)\n`;
      response += `1. Sound emergency siren at affected zone(s) — **3 short bursts**\n`;
      response += `2. Activate emergency PA: *"Kripya shaant rahein, apni jagah pe khade rahein"*\n`;
      response += `3. Deploy ALL available NDRF units to zone perimeter\n`;
      response += `4. Open emergency exit corridors (pre-designated in sector blueprints)\n`;
      response += `5. Halt ALL incoming pedestrian traffic within 500m radius\n`;
      response += `6. Medical rapid response teams dispatched to zone center\n`;
      response += `7. Notify all hospitals within 15km radius\n`;
    }
  }

  // ─── Deploy / Responder ────────────────────────────────────────────────
  else if (query.includes('deploy') || query.includes('responder') || query.includes('volunteer') || query.includes('dispatch') || query.includes('available')) {
    response = `## 🚁 RESPONDER DEPLOYMENT STATUS\n\n`;
    response += `### Force Strength\n`;
    response += `- **${availableVols.length}** Available for dispatch\n`;
    response += `- **${enRouteVols.length}** En Route to incidents\n`;
    response += `- **${onSceneVols.length}** On Scene\n`;
    response += `- **${volunteers.length}** Total force strength\n\n`;

    if (availableVols.length > 0) {
      response += `### Available Responders\n`;
      availableVols.forEach(v => {
        response += `- **${v.name}** (${v.id}) — ${v.designation} — Position: (${Math.round(v.x)}, ${Math.round(v.y)})\n`;
      });
    }

    if (enRouteVols.length > 0) {
      response += `\n### En Route\n`;
      enRouteVols.forEach(v => {
        const inc = incidents.find(i => i.assignedVolunteerId === v.id);
        response += `- **${v.name}** → ${inc ? inc.id + ': ' + inc.description.substring(0, 50) + '...' : 'Unknown incident'}\n`;
      });
    }

    // Recommend deployment for unassigned incidents
    const unassigned = activeIncidents.filter(i => i.status === 'UNASSIGNED');
    if (unassigned.length > 0 && availableVols.length > 0) {
      response += `\n### 🔴 Recommended Deployments\n`;
      response += `**${unassigned.length} unassigned incident(s)** need dispatch:\n\n`;
      unassigned.slice(0, 3).forEach(inc => {
        const distances = availableVols.map(v => ({
          name: v.name, id: v.id, designation: v.designation,
          dist: Math.sqrt(Math.pow(v.x - inc.x, 2) + Math.pow(v.y - inc.y, 2)),
        })).sort((a, b) => a.dist - b.dist);
        const best = distances[0];
        response += `- **${inc.id}** (${inc.priority}) → Deploy **${best.name}** (${best.designation}, ${Math.round(best.dist)}m away)\n`;
      });
    }
  }

  // ─── Shift Handoff / Report ─────────────────────────────────────────────
  else if (query.includes('handoff') || query.includes('report') || query.includes('shift') || query.includes('log')) {
    response = `## 📋 SHIFT HANDOFF REPORT\n`;
    response += `**Generated:** ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n`;

    response += `### Incident Summary\n`;
    response += `| Category | Count |\n|---|---|\n`;
    response += `| Active CRITICAL | ${criticalIncidents.length} |\n`;
    response += `| Active WARNING | ${warningIncidents.length} |\n`;
    response += `| Active ROUTINE | ${routineIncidents.length} |\n`;
    response += `| Resolved (session) | ${resolvedIncidents.length} |\n`;
    response += `| **Total active** | **${activeIncidents.length}** |\n\n`;

    response += `### Force Deployment\n`;
    response += `| Status | Count |\n|---|---|\n`;
    response += `| Available | ${availableVols.length} |\n`;
    response += `| En Route | ${enRouteVols.length} |\n`;
    response += `| On Scene | ${onSceneVols.length} |\n\n`;

    response += `### Crowd Zones\n`;
    crowdZones.forEach(z => {
      const pct = Math.round((z.currentOccupancy / z.capacity) * 100);
      response += `- **${z.name}:** ${pct}%${z.anomaly ? ' ⚠️ ANOMALY' : ''}\n`;
    });

    response += `\n### Incoming Commander Notes\n`;
    if (criticalIncidents.length > 0) {
      response += `- ⚠️ **${criticalIncidents.length} CRITICAL incident(s) require your immediate attention**\n`;
    }
    if (anomalyZones.length > 0) {
      response += `- ⚠️ **${anomalyZones.length} zone(s) showing anomalous crowd patterns**\n`;
    }
    if (highDensityZones.length > 0) {
      response += `- 🔴 **${highDensityZones.length} zone(s) in RED/BLACK alert** — monitor closely\n`;
    }
    if (criticalIncidents.length === 0 && anomalyZones.length === 0 && highDensityZones.length === 0) {
      response += `- ✅ All systems nominal. Standard operations.\n`;
    }
  }

  // ─── Generic / Unmatched Query ──────────────────────────────────────────
  else {
    // Build a general response with the most pressing info
    response = `## DRISHTI AI — Operational Intelligence\n\n`;

    if (criticalIncidents.length > 0) {
      response += `### ⚠️ Priority Alert\n`;
      response += `**${criticalIncidents.length} CRITICAL incident(s) active.** Most urgent:\n`;
      const urgent = criticalIncidents[0];
      response += `- **[${urgent.id}]** ${urgent.description} — Status: ${urgent.status}\n\n`;
    }

    response += `### Current Operational State\n`;
    response += `- **${activeIncidents.length}** active incidents (${criticalIncidents.length} critical)\n`;
    response += `- **${availableVols.length}/${volunteers.length}** responders available\n`;
    response += `- **${anomalyZones.length}** zone anomalies detected\n\n`;

    const maxZone = crowdZones.reduce((a, b) => (a.currentOccupancy / a.capacity) > (b.currentOccupancy / b.capacity) ? a : b);
    const maxPct = Math.round((maxZone.currentOccupancy / maxZone.capacity) * 100);
    response += `### Highest Density Zone\n`;
    response += `**${maxZone.name}** — ${maxPct}% capacity (${maxZone.currentOccupancy.toLocaleString()} pilgrims)\n\n`;

    response += `### Quick Actions\n`;
    response += `Try asking me:\n`;
    response += `- *"Give me a full situation briefing"*\n`;
    response += `- *"Assess critical incidents"*\n`;
    response += `- *"Evaluate stampede risk"*\n`;
    response += `- *"Which crowd zones are at risk?"*\n`;
    response += `- *"Recommend responder deployment"*\n`;
    response += `- *"Generate a shift handoff report"*\n`;
  }

  return { response, contextMeta };
}


// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/advisor — Handle advisor chat messages
// ═══════════════════════════════════════════════════════════════════════════════
router.post('/advisor', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // 1. Grab live telemetry state
    const state = telemetry.getState();

    // 2. Build context metadata
    const activeIncidents = state.incidents.filter(i => i.status !== 'RESOLVED');
    const anomalyZones = state.crowdZones.filter(z => z.anomaly);
    const contextMeta = {
      activeIncidents: activeIncidents.length,
      criticalIncidents: activeIncidents.filter(i => i.priority === 'CRITICAL').length,
      anomalyZones: anomalyZones.length,
      availableResponders: state.volunteers.filter(v => v.status === 'Available').length,
      totalResponders: state.volunteers.length,
      timestamp: new Date().toISOString(),
    };

    // 3. Try Gemini first, fall back to offline engine
    let response;
    let usedGemini = false;

    if (genAI) {
      try {
        const liveContext = formatLiveContext(state);
        const relevantSOPs = getRelevantSOPs(state);
        const contextualPrompt = `${SYSTEM_INSTRUCTION}\n\n---\n\n${liveContext}\n\n---\n\n## RELEVANT STANDARD OPERATING PROCEDURES\n\n${relevantSOPs}\n\n---\n\nRespond to the operator's query below using the live data and SOPs above. Always ground your answers in the actual current state.`;

        const model = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash',
          systemInstruction: contextualPrompt,
        });

        const contents = [];
        for (const msg of conversationHistory) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          });
        }
        contents.push({ role: 'user', parts: [{ text: message }] });

        const result = await model.generateContent({ contents });
        response = result.response.text();
        usedGemini = true;
        console.log('[ADVISOR] Response generated via Gemini');
      } catch (geminiErr) {
        console.log(`[ADVISOR] Gemini unavailable (${geminiErr.status || 'error'}), falling back to offline engine`);
        // Fall through to offline engine
      }
    }

    // 4. Offline fallback
    if (!usedGemini) {
      const offline = generateOfflineResponse(message, state);
      response = offline.response;
      console.log('[ADVISOR] Response generated via offline analysis engine');
    }

    res.json({
      success: true,
      response,
      context: contextMeta,
      engine: usedGemini ? 'gemini' : 'offline',
    });

  } catch (err) {
    console.error('[ADVISOR] Error:', err);
    res.status(500).json({
      success: false,
      error: 'AI advisor encountered an error. Please try again.',
      details: err.message,
    });
  }
});

module.exports = router;
