// Proxy serveur pour la selection d'images/videos B-roll. La cle Pexels (si configuree)
// reste cote serveur ; le client n'envoie que le mot-cle a chercher.
import { createBrollServer } from '../server/broll.mjs'
import { loadServerEnv } from '../server/env.mjs'

const WINDOW_MS = 60_000
const LIMIT = 60

export default function brollProxy() {
  const env = loadServerEnv()
  const server = createBrollServer(env)
  const hits = new Map()

  function limited(ip) {
    const now = Date.now()
    const fresh = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
    if (fresh.length >= LIMIT) {
      hits.set(ip, fresh)
      return true
    }
    fresh.push(now)
    hits.set(ip, fresh)
    return false
  }

  function send(res, status, data) {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }

  return {
    name: 'broll-proxy',
    configureServer(devServer) {
      devServer.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/broll')) return next()
        if (req.method !== 'GET') return send(res, 405, { error: 'GET requis' })

        const ip = req.socket.remoteAddress || 'unknown'
        if (limited(ip)) {
          return send(res, 429, { error: 'Trop de requetes — reessaie dans une minute' })
        }

        const url = new URL(req.url, 'http://localhost')
        const q = String(url.searchParams.get('q') || '').trim().slice(0, 80)
        const wantVideo = url.pathname === '/api/broll/video'

        try {
          if (wantVideo) {
            const data = await server.brollVideo({ q })
            return send(res, 200, { q, ...data })
          }
          const data = await server.broll({ q })
          return send(res, 200, { q, ...data })
        } catch (err) {
          console.error('Broll proxy error:', err.message || err)
          return send(res, 502, { error: 'B-roll indisponible pour le moment' })
        }
      })
    }
  }
}
