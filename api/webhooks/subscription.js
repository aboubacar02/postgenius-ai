import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'nodejs' }

const PLANS = { starter: 'Starter', pro: 'Pro', studio: 'Studio' }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})

  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.VITE_SUPABASE_URL

  if (!serviceRole || !supabaseUrl) {
    res.status(500).json({ error: 'Service role key manquante' })
    return
  }

  const supabase = createClient(supabaseUrl, serviceRole)

  // Le webhook reçoit : { user_id, plan } après confirmation de paiement côté provider.
  const userId = body.user_id
  const planRaw = String(body.plan || '').toLowerCase()
  const plan = PLANS[planRaw] || 'Pro'

  if (!userId) {
    res.status(400).json({ error: 'user_id requis' })
    return
  }

  const { error } = await supabase.from('subscriptions').upsert({
    user_id: userId,
    plan,
    provider: String(body.provider || ''),
    reference: String(body.reference || ''),
    status: 'active',
    started_at: new Date().toISOString()
  }, { onConflict: 'user_id' })

  if (error) {
    console.error('Webhook subscriptions error:', error.message)
    res.status(500).json({ error: 'Échec de l\'activation du plan' })
    return
  }

  res.status(200).json({ success: true, plan })
}