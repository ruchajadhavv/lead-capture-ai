const OpenAI = require('openai');

// Create client lazily so missing env vars don't crash the server at startup.
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;


function normalizeScore(rawScore) {
  const s = String(rawScore || '').toLowerCase();
  if (s === 'hot') return 'Hot';
  if (s === 'warm') return 'Warm';
  if (s === 'cold') return 'Cold';
  return 'Warm';
}

const buildPrompt = (lead) => {
  const { firstName, lastName, email, businessName, message } = lead;

  return `You are a lead qualification assistant.

Task:
1) Score the lead as Hot, Warm, or Cold.
2) Provide a one-line reason.
3) Draft a personalized first-response email to the lead.

Rules:
- Use only the information provided.
- If message is empty or unclear, make reasonable assumptions and keep the reason specific.
- Output must be valid JSON only with keys: aiScore, aiScoreReason, aiEmailDraft.
- aiScoreReason must be exactly one line.

Lead:
- firstName: ${firstName}
- lastName: ${lastName}
- email: ${email}
- businessName: ${businessName}
- message: ${message}`;
};

async function qualifyLead(lead) {
  // If API key is missing, degrade gracefully so lead capture never breaks.
  if (!process.env.OPENAI_API_KEY) {
    return {
      aiScore: 'Warm',
      aiScoreReason: 'OPENAI_API_KEY not set; defaulted to Warm.',
      aiEmailDraft: `Hi ${lead.firstName},\n\nThanks for reaching out about ${lead.businessName}. Could you share a bit more detail about your needs?\n\nBest regards,\n`,
    };
  }

  const prompt = buildPrompt(lead);


  if (!openai) {
    return {
      aiScore: 'Warm',
      aiScoreReason: 'OPENAI client unavailable; defaulted to Warm.',
      aiEmailDraft: `Hi ${lead.firstName},\n\nThanks for reaching out about ${lead.businessName}. Could you share a bit more detail about your needs?\n\nBest regards,\n`,
    };
  }

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content:
          'Return only JSON matching the requested schema. No extra text.',
      },
      { role: 'user', content: prompt },
    ],
  });

  const content = completion?.choices?.[0]?.message?.content || '{}';

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    // If the model returned extra text, try to salvage JSON.
    const match = String(content).match(/\{[\s\S]*\}/);
    parsed = match ? JSON.parse(match[0]) : {};
  }

  const aiScore = normalizeScore(parsed.aiScore);
  const aiScoreReason = String(parsed.aiScoreReason || '').trim();
  const aiEmailDraft = String(parsed.aiEmailDraft || '').trim();

  return {
    aiScore,
    aiScoreReason: aiScoreReason || 'Insufficient info; defaulted to Warm.',
    aiEmailDraft:
      aiEmailDraft ||
      `Hi ${lead.firstName},\n\nThanks for reaching out about ${lead.businessName}. I’d love to learn more about what you’re looking for and share how we can help.\n\nBest regards,\n`,
  };
}

module.exports = { qualifyLead };

