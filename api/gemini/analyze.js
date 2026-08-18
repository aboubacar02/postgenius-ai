export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })

  const body = await req.json().catch(() => ({}))
  const { prompt } = body

  if (!prompt) return Response.json({ error: 'Prompt requis' }, { status: 400 })

  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS?.split(',')[0]?.trim()
  if (!apiKey) return Response.json({ error: 'Clé Gemini manquante' }, { status: 500 })

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 2048, responseMimeType: 'application/json' }
        }),
        signal: AbortSignal.timeout(20000),
      }
    )

    if (!r.ok) {
      const err = await r.json().catch(() => ({}))
      return Response.json({ error: err?.error?.message || `Gemini error ${r.status}` }, { status: r.status })
    }

    const data = await r.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    const parsed = JSON.parse(text)
    return Response.json(parsed)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 502 })
  }
}
