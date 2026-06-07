/**
 * Handy Dandy Lawns — Chat Worker
 * ─────────────────────────────────────────────────────────────────
 * Deploy: Cloudflare Workers dashboard → Create Worker → paste this
 * Env vars to set in Worker Settings → Variables:
 *   ANTHROPIC_API_KEY  →  your sk-ant-... key
 *   ALLOWED_ORIGIN     →  https://yourdomain.com  (or leave blank for *)
 * ─────────────────────────────────────────────────────────────────
 */

const SYSTEM = `You are a friendly assistant for Handy Dandy Lawns LLC, a lawn care and landscaping company serving the Tampa Bay area in Florida.

Answer warmly and concisely — 1 to 3 sentences unless more detail is genuinely needed.

Business info:
- Phone: 813-591-7986 (call or text anytime)
- Service area: Tampa Bay, Florida
- Free estimates on everything — no obligation
- Tagline: "Quality Work. Reliable Service. A Lawn You'll Love."

Services offered:
• Edging — crisp borders along walkways, driveways, and beds
• Trimming — hedges, shrubs, and string-trimming for a polished finish
• Landscaping — design, planting, and curb-appeal refreshes
• Mulch — installs that protect beds and lock in moisture
• Gutter Cleaning — keeps gutters clear to protect your home
• Pressure Washing — driveways, patios, and siding restored to like-new
• Junk Removal — haul away debris and unwanted items
• Tree Work — trimming, removal, and general tree care
• Small Engine Repairs — lawn mowers and small equipment

Rules:
- Never quote specific prices. Estimates are always free — direct to 813-591-7986
- For booking or urgent needs, direct them to call or text 813-591-7986
- If asked about a service not listed, say you're unsure and suggest calling
- Keep responses short and friendly — this is a chat widget, not an essay`;

function cors(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const headers = cors(env);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers });
    }

    // Parse request body
    let messages;
    try {
      const body = await request.json();
      messages = body.messages;
      if (!Array.isArray(messages) || messages.length === 0) throw new Error();
    } catch {
      return new Response(
        JSON.stringify({ reply: 'Invalid request. Call us at 813-591-7986!' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...headers } }
      );
    }

    // Call Anthropic
    try {
      const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: SYSTEM,
          messages,
        }),
      });

      const data = await apiRes.json();
      const reply = data.content?.[0]?.text
        || "Sorry about that! Give us a call at 813-591-7986 and we'll help you out.";

      return new Response(
        JSON.stringify({ reply }),
        { headers: { 'Content-Type': 'application/json', ...headers } }
      );
    } catch {
      return new Response(
        JSON.stringify({ reply: "I'm having trouble right now. Please call 813-591-7986!" }),
        { headers: { 'Content-Type': 'application/json', ...headers } }
      );
    }
  },
};
