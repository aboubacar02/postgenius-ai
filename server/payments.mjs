// Passerelles de paiement côté serveur. Les secrets (Stripe, PayPal, Paystack,
// CinetPay) ne sont jamais transmis au client : l'app POSTe uniquement le montant,
// la devise, le plan et le moyen choisi sur /api/payments/init.
// Sans clé configurée, le provider retombe en simulation sandbox (aucun débit).
export function createPaymentsServer(env) {
  const stripeLive = !!env.STRIPE_SECRET_KEY
  const paypalLive = !!env.PAYPAL_CLIENT_ID && !!env.PAYPAL_CLIENT_SECRET
  const paystackLive = !!env.PAYSTACK_SECRET_KEY
  const cinetpayLive = !!env.CINETPAY_API_KEY && !!env.CINETPAY_SITE_ID

  const paypalBase =
    env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

  const makeReference = () =>
    `PG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  const toIso = (currency) =>
    currency === 'FCFA' ? 'XOF' : currency === '$' ? 'USD' : 'EUR'

  const siteUrl = env.SITE_URL || 'http://localhost:5173'

  async function paystackInitialize({ email, amount, currency, plan }) {
    const reference = makeReference()
    if (!paystackLive) {
      return { provider: 'paystack', reference, status: 'success', sandbox: true, authorization_url: null }
    }
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email || 'client@postgenius.ai',
        amount: Math.round(amount * 100),
        currency: toIso(currency),
        reference,
        metadata: { app: 'postgenius', plan }
      })
    })
    const json = await res.json()
    if (!json.status) throw new Error(json.message || 'Erreur Paystack')
    return {
      provider: 'paystack',
      reference: json.data.reference,
      status: 'pending',
      sandbox: false,
      authorization_url: json.data.authorization_url
    }
  }

  async function cinetpayInitialize({ email, amount, currency, plan }) {
    const reference = makeReference()
    if (!cinetpayLive) {
      return { provider: 'cinetpay', reference, status: 'success', sandbox: true, payment_url: null }
    }
    const res = await fetch('https://api.cinetpay.com/v2/payment/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: env.CINETPAY_API_KEY,
        site_id: env.CINETPAY_SITE_ID,
        transaction_id: reference,
        amount: String(amount),
        currency: toIso(currency),
        description: `Abonnement PostGenius ${plan}`,
        notify_url: `${siteUrl}/api/webhooks/cinetpay`,
        return_url: `${siteUrl}/parametres?payment=success`,
        channels: 'ALL',
        customer_id: email || 'client@postgenius.ai',
        customer_name: email || 'Client PostGenius'
      })
    })
    const json = await res.json()
    if (json.code !== '201' && json.code !== 201) throw new Error(json.message || 'Erreur CinetPay')
    return {
      provider: 'cinetpay',
      reference,
      status: 'pending',
      sandbox: false,
      payment_url: json.data?.payment_url
    }
  }

  async function stripeInitialize({ email, amount, currency, plan }) {
    const reference = makeReference()
    if (!stripeLive) {
      return { provider: 'stripe', reference, status: 'success', sandbox: true, authorization_url: null }
    }
    const params = new URLSearchParams({
      mode: 'payment',
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': toIso(currency).toLowerCase(),
      'line_items[0][price_data][unit_amount]': String(Math.round(amount * 100)),
      'line_items[0][price_data][product_data][name]': `PostGenius — plan ${plan}`,
      success_url: `${siteUrl}/parametres?payment=success&ref=${reference}`,
      cancel_url: `${siteUrl}/parametres?payment=cancel`,
      metadata: { app: 'postgenius', plan }
    })
    if (email) params.set('customer_email', email)

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })
    const json = await res.json()
    if (!res.ok || json.error) throw new Error(json.error?.message || 'Erreur Stripe')
    return {
      provider: 'stripe',
      reference: json.id,
      status: 'pending',
      sandbox: false,
      authorization_url: json.url
    }
  }

  async function paypalAccessToken() {
    const res = await fetch(`${paypalBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    })
    const json = await res.json()
    if (!json.access_token) throw new Error('Authentification PayPal impossible')
    return json.access_token
  }

  async function paypalInitialize({ amount, currency, plan }) {
    const reference = makeReference()
    if (!paypalLive) {
      return { provider: 'paypal', reference, status: 'success', sandbox: true, approval_url: null }
    }
    const token = await paypalAccessToken()
    const res = await fetch(`${paypalBase}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: reference,
            description: `PostGenius — plan ${plan}`,
            amount: { currency_code: toIso(currency), value: String(amount) }
          }
        ],
        application_context: {
          brand_name: 'PostGenius',
          user_action: 'PAY_NOW',
          return_url: `${siteUrl}/parametres?payment=success`,
          cancel_url: `${siteUrl}/parametres?payment=cancel`
        }
      })
    })
    const json = await res.json()
    if (json.status !== 'CREATED') throw new Error('Commande PayPal impossible')
    const link = json.links?.find((l) => l.rel === 'approve')
    return {
      provider: 'paypal',
      reference: json.id,
      status: 'pending',
      sandbox: false,
      approval_url: link?.href || null
    }
  }

  function resolveProvider(method, explicit) {
    if (explicit && explicit !== 'auto') return explicit
    if (method === 'paypal') return 'paypal'
    if (['wave', 'orange', 'mtn', 'moov'].includes(method)) return 'cinetpay'
    return 'stripe'
  }

  return {
    live: { stripe: stripeLive, paypal: paypalLive, paystack: paystackLive, cinetpay: cinetpayLive },
    async init({ provider = 'auto', method, plan, amount, currency, email }) {
      const target = resolveProvider(method, provider)
      if (target === 'stripe') {
        return { ...(await stripeInitialize({ email, amount, currency, plan })), method, plan }
      }
      if (target === 'paypal') {
        return { ...(await paypalInitialize({ amount, currency, plan })), method, plan }
      }
      if (target === 'paystack') {
        return { ...(await paystackInitialize({ email, amount, currency, plan })), method, plan }
      }
      if (target === 'cinetpay') {
        return { ...(await cinetpayInitialize({ email, amount, currency, plan })), method, plan }
      }
      return { provider: 'simulation', reference: makeReference(), status: 'success', sandbox: true, method, plan }
    }
  }
}
