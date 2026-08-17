import { synthesize, DEFAULT_VOICE } from '../server/edgeTts.mjs'

export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  let text = ''
  let voice = DEFAULT_VOICE
  let lang = 'fr-FR'

  if (req.method === 'POST' && req.body) {
    text = req.body.text || ''
    voice = req.body.voice || voice
    lang = req.body.lang || lang
  } else {
    const url = new URL(req.url, 'http://localhost')
    text = url.searchParams.get('text') || ''
    voice = url.searchParams.get('voice') || voice
    lang = url.searchParams.get('lang') || lang
  }

  if (!text || text.length > 4000) {
    res.status(400).json({ error: 'Le texte est requis (max 4000 caractères)' })
    return
  }

  try {
    const audio = await synthesize(text, voice, lang)
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', audio.length)
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.send(audio)
  } catch (err) {
    console.error('Edge TTS error:', err.message || err)
    res.status(502).json({ error: 'Synthèse vocale indisponible', detail: String(err.message || err) })
  }
}