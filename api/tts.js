// Endpoint TTS de production (voix Microsoft Edge, sans clé).
// Miroir du plugin de dev (plugins/edgeTtsDev.js) : renvoie un flux MP3 brut
// consommable directement par <audio> ou un Blob, avec les voix fr-FR-*Neural.
export const config = { runtime: 'nodejs' }

import { synthesize } from '../server/edgeTts.mjs'

const MAX_BODY = 128 * 1024

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(new Error('Corps trop volumineux'))
        req.destroy()
        return
      }
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('JSON invalide'))
      }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'POST requis' }))
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Requête invalide' }))
  }

  const text = String(body.text || '')
  if (!text) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Le texte est requis' }))
  }
  if (text.length > 5000) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Texte trop long (5000 caractères max)' }))
  }

  const voice = String(body.voice || 'fr-FR-HenriNeural')
  const lang = String(body.lang || 'fr-FR')

  try {
    const audio = await synthesize(text, voice, lang)
    res.statusCode = 200
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', audio.length)
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.end(audio)
  } catch (err) {
    console.error('Edge TTS error:', err.message || err)
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Synthèse vocale indisponible', detail: String(err.message || err) }))
  }
}