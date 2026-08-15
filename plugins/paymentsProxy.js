// Proxy serveur pour initialiser les paiements. Les secrets (Paystack/CinetPay)
// restent sur le serveur ; le client n'envoie jamais de clé.
import { createPaymentsServer } from '../server/payments.mjs'
import { loadServerEnv } from '../server/env.mjs'

const WINDOW_MS = 60_000
const LIMIT = 10
const MAX_BODY = 16 * 1024

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

export default function paymentsProxy() {
  const env = loadServerEnv()
  const server = createPaymentsServer(env)
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
    name: 'payments-proxy',
    configureServer(devServer) {
      devServer.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/payments/init')) return next()
        if (req.method !== 'POST') return send(res, 405, { error: 'POST requis' })

        const ip = req.socket.remoteAddress || 'unknown'
        if (limited(ip)) return send(res, 429, { error: 'Trop de requêtes — réessaie dans une minute' })

        let body
        try {
          body = await readJsonBody(req, MAX_BODY)
        } catch {
          return send(res, 400, { error: 'Requête invalide' })
        }

        try {
          const amount = Number(body.amount)
          if (!Number.isFinite(amount) || amount < 0 || amount > 10000) {
            return send(res, 400, { error: 'Montant invalide' })
          }
          const session = await server.init({
            provider: String(body.provider || 'auto'),
            method: String(body.method || ''),
            plan: String(body.plan || ''),
            amount,
            currency: String(body.currency || 'EUR'),
            email: String(body.email || '')
          })
          return send(res, 200, session)
        } catch (err) {
          console.error('Payments proxy error:', err.message || err)
          return send(res, 502, { error: 'Paiement indisponible pour le moment' })
        }
      })
    }
  }
}
