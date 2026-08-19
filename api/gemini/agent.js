export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const body = await req.json().catch(() => ({}))
  const { messages = [], trends = '' } = body

  if (!messages.length) {
    return Response.json({ error: 'Messages requis' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS?.split(',')[0]?.trim()

  if (!apiKey) {
    return Response.json({ error: 'Clé Gemini manquante — ajoute GEMINI_API_KEYS dans Vercel.' }, { status: 503 })
  }

  const systemPrompt = `Tu es Post Genius, un assistant IA spécialisé dans la création de contenu viral pour les réseaux sociaux (TikTok, Instagram Reels, YouTube Shorts).
Tu parles en français, tu es concis, actionnable, et tu donnes des conseils concrets.
Tu connais les tendances actuelles, les algorithmes, les hooks viraux, et les techniques de rétention.

Tendances du moment:
${trends}

Format: réponds en 2-3 phrases max, avec des points actionnables quand c'est possible.`

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Compris, je suis Post Genius. Comment puis-je t\'aider à créer du contenu viral ?' }] },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ]

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.7, maxOutputTokens: 500 } }),
        signal: AbortSignal.timeout(30000),
      }
    )

    if (!r.ok) {
      const err = await r.json().catch(() => ({}))
      console.error('Gemini agent error:', r.status, err?.error?.message)
      return Response.json({ error: err?.error?.message || `Gemini error ${r.status}` }, { status: 502 })
    }

    const data = await r.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!text) {
      return Response.json({ error: 'Gemini a renvoyé une réponse vide' }, { status: 502 })
    }
    return Response.json({ reply: text })
  } catch (err) {
    console.error('Gemini agent fetch error:', err.message)
    return Response.json({ error: err.message }, { status: 502 })
  }
}
