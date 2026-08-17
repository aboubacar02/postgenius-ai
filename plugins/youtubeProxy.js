// Proxy serveur pour la recherche YouTube. La clé YOUTUBE_API_KEY reste côté
// serveur ; le client n'envoie que le mot-clé à chercher.
import { createYoutubeServer } from '../server/youtube.mjs'
import { loadServerEnv } from '../server/env.mjs'

const WINDOW_MS = 60_000
const LIMIT = 30

export default function youtubeProxy() {
  const env = loadServerEnv()
  const server = createYoutubeServer(env)
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
    name: 'youtube-proxy',
    configureServer(devServer) {
      devServer.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/youtube/search')) return next()
        if (req.method !== 'GET') return send(res, 405, { error: 'GET requis' })

        const ip = req.socket.remoteAddress || 'unknown'
        if (limited(ip)) {
          return send(res, 429, { error: 'Trop de requêtes — réessaie dans une minute' })
        }

        const url = new URL(req.url, 'http://localhost')
        const q = String(url.searchParams.get('q') || '').trim().slice(0, 120)
        const maxResults = url.searchParams.get('max') || '12'

        try {
          const data = await server.search({ q, maxResults })
          return send(res, 200, { q, ...data })
        } catch (err) {
          console.error('YouTube proxy error:', err.message || err)
          return send(res, 502, { error: 'YouTube indisponible pour le moment', live: false, items: [] })
        }
      })
    }
  }
}
