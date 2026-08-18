export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })

  const body = await req.json().catch(() => ({}))
  const { plan, amount, currency } = body

  return Response.json({
    success: true,
    message: `Paiement de ${amount || 0} ${currency || 'EUR'} pour le plan ${plan || 'unknown'} enregistré.`,
    redirect: null,
    paymentId: `demo_${Date.now()}`
  })
}
