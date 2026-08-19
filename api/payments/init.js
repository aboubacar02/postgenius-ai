import { createPaymentsServer } from '../../server/payments.mjs'

export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
  } catch {
    res.status(400).json({ error: 'Requête invalide' })
    return
  }

  const amount = Number(body.amount)
  if (!Number.isFinite(amount) || amount < 0 || amount > 10000) {
    res.status(400).json({ error: 'Montant invalide' })
    return
  }

  const server = createPaymentsServer(process.env)

  try {
    const session = await server.init({
      provider: String(body.provider || 'auto'),
      method: String(body.method || ''),
      plan: String(body.plan || ''),
      amount,
      currency: String(body.currency || 'EUR'),
      email: String(body.email || '')
    })
    res.status(200).json(session)
  } catch (err) {
    console.error('Payments error:', err.message || err)
    res.status(502).json({ error: 'Paiement indisponible pour le moment' })
  }
}