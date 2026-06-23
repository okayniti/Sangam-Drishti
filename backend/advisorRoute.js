// ═══════════════════════════════════════════════════════════════════════════════
// ADVISOR ROUTE — RAG-powered Situational Advisor using Google Gemini
// Receives operator queries, enriches them with live telemetry context + SOPs,
// and returns grounded AI recommendations.
// ═══════════════════════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const telemetry = require('./telemetrySimulator');
const { getRelevantSOPs, formatLiveContext } = require('./mahakumbhSOP');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

// POST /api/advisor — Handle advisor chat messages
router.post('/advisor', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(500).json({
        success: false,
        error: 'Gemini API key not configured. Add your key to backend/.env',
      });
    }

    // 1. Grab live telemetry state
    const state = telemetry.getState();

    // 2. Build contextual system prompt with live data + relevant SOPs
    const liveContext = formatLiveContext(state);
    const relevantSOPs = getRelevantSOPs(state);

    const contextualPrompt = `${SYSTEM_INSTRUCTION}

---

${liveContext}

---

## RELEVANT STANDARD OPERATING PROCEDURES

${relevantSOPs}

---

Respond to the operator's query below using the live data and SOPs above. Always ground your answers in the actual current state.`;

    // 3. Build conversation for Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const chat = model.startChat({
      systemInstruction: contextualPrompt,
      history: conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    });

    // 4. Send user message and get response
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    // 5. Build context metadata for the frontend
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

    res.json({
      success: true,
      response,
      context: contextMeta,
    });

  } catch (err) {
    console.error('[ADVISOR] Gemini API error:', err);

    // Handle specific Gemini errors
    if (err.message?.includes('API_KEY')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Gemini API key. Check your backend/.env configuration.',
      });
    }
    if (err.message?.includes('quota') || err.message?.includes('rate')) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit reached. Please wait a moment before trying again.',
      });
    }

    res.status(500).json({
      success: false,
      error: 'AI advisor encountered an error. Please try again.',
      details: err.message,
    });
  }
});

module.exports = router;
