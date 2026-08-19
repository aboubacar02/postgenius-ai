export const config = { runtime: 'edge' }

import { fetchWithKeyRotation } from './_rotate.js'

export default async function handler(req) {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })

  const body = await req.json().catch(() => ({}))
  const { text, voice = 'Kore', style = 'energetic' } = body

  if (!text || text.length > 4000) {
    return Response.json({ error: 'Le texte est requis (max 4000 caractères)' }, { status: 400 })
  }

  try {
    // "gemini-3.1-flash-tts-preview" was a hallucinated model name.
    // use gemini-2.5-flash which supports responseModalities: ['AUDIO'].
    const data = await fetchWithKeyRotation({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice }
          }
        }
      }
    }, 'gemini-2.5-flash')

    const part = data.candidates?.[0]?.content?.parts?.[0]
    const audioData = part?.inlineData?.data
    if (!audioData) {
      return Response.json({ error: 'Pas de données audio dans la réponse' }, { status: 500 })
    }

    return Response.json({ mimeType: part.inlineData.mimeType, base64: audioData })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 502 })
  }
}
