// Proxy serveur vers Gemini : la clé API reste côté serveur, avec rate-limiting
// et limites de taille pour empêcher l'abus par un tiers.
import { createGeminiServer, QuotaExhaustedError } from '../server/gemini.mjs'
import { loadServerEnv } from '../server/env.mjs'

const WINDOW_MS = 60_000
const LIMITS = { script: 6, analyze: 12, tts: 5 }
const MAX_PROMPT = 30000
const MAX_TEXT = 6000
const MAX_BODY = 128 * 1024

function readJsonBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    let body = ''
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > maxBytes) {
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

export default function geminiProxy() {
  const env = loadServerEnv()
  // GEMINI_API_KEYS : plusieurs clés séparées par des virgules (rotation automatique).
  // GEMINI_API_KEY : une seule clé (repli).
  const rawKeys = env.GEMINI_API_KEYS || env.GEMINI_API_KEY || ''
  const server = createGeminiServer(rawKeys)
  const hits = new Map()

  function limited(ip, action) {
    const now = Date.now()
    const entry = hits.get(ip) || {}
    const fresh = (entry[action] || []).filter((t) => now - t < WINDOW_MS)
    if (fresh.length >= LIMITS[action]) {
      entry[action] = fresh
      hits.set(ip, entry)
      return true
    }
    fresh.push(now)
    entry[action] = fresh
    hits.set(ip, entry)
    return false
  }

  function send(res, status, data) {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }

  return {
    name: 'gemini-proxy',
    configureServer(devServer) {
      devServer.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/gemini/')) return next()
        if (req.method !== 'POST') return send(res, 405, { error: 'POST requis' })

        const action = req.url.split('/')[3]
        if (!LIMITS[action]) return send(res, 404, { error: 'Action inconnue' })

        const ip = req.socket.remoteAddress || 'unknown'
        if (limited(ip, action)) {
          return send(res, 429, { error: 'Trop de requêtes — réessaie dans une minute' })
        }

        let body
        try {
          body = await readJsonBody(req, MAX_BODY)
        } catch {
          return send(res, 400, { error: 'Requête invalide' })
        }

        try {
          if (action === 'script' || action === 'analyze') {
            const prompt = String(body.prompt || '')
            if (!prompt || prompt.length > MAX_PROMPT) {
              return send(res, 400, { error: 'Prompt trop long' })
            }
            const data = await server.generateContent(prompt)
            return send(res, 200, data)
          }
          if (action === 'tts') {
            const text = String(body.text || '')
            if (!text || text.length > MAX_TEXT) {
              return send(res, 400, { error: 'Texte trop long' })
            }
            const data = await server.synthesizeVoice({ text, voice: body.voice, style: body.style })
            return send(res, 200, data)
          }
          return send(res, 404, { error: 'Action inconnue' })
        } catch (err) {
          console.error('Gemini proxy error:', err.message || err)
          if (err instanceof QuotaExhaustedError) {
            return send(res, 429, {
              error: 'Quota IA atteint sur toutes les clés — réessaie dans quelques instants'
            })
          }
          return send(res, 502, { error: 'IA indisponible, réessaie dans quelques secondes' })
        }
      })
    }
  }
}
