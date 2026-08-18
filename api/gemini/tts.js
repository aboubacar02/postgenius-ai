export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })

  const body = await req.json().catch(() => ({}))
  const { text, voice = 'Kore', style = 'energetic' } = body

  if (!text || text.length > 4000) {
    return Response.json({ error: 'Le texte est requis (max 4000 caractères)' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS?.split(',')[0]?.trim()
  if (!apiKey) {
    return Response.json({ error: 'Clé Gemini manquante' }, { status: 500 })
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-tts:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: {
            responseModalities: ['audio'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice }
              }
            }
          }
        }),
        signal: AbortSignal.timeout(30000),
      }
    )

    if (!r.ok) {
      const err = await r.json().catch(() => ({}))
      return Response.json({ error: err?.error?.message || `Gemini TTS error ${r.status}` }, { status: r.status })
    }

    const data = await r.json()
    const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
    if (!audioData) {
      return Response.json({ error: 'Pas de données audio dans la réponse' }, { status: 500 })
    }

    return Response.json({ audioBase64: audioData, mimeType: 'audio/wav' })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 502 })
  }
}
