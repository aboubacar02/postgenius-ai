// Passerelles de paiement côté serveur. Les secrets (Paystack/CinetPay) ne sont
// jamais transmis au client : l'app POSTe uniquement le montant, la devise et le
// moyen choisi sur /api/payments/init.
export function createPaymentsServer(env) {
  const paystackLive = !!env.PAYSTACK_SECRET_KEY
  const cinetpayLive = !!env.CINETPAY_API_KEY && !!env.CINETPAY_SITE_ID

  const makeReference = () =>
    `PG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  const toIso = (currency) =>
    currency === 'FCFA' ? 'XOF' : currency === '$' ? 'USD' : 'EUR'

  async function paystackInitialize({ email, amount, currency }) {
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
        metadata: { app: 'postgenius' }
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

  async function cinetpayInitialize({ email, amount, currency }) {
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
        description: 'Abonnement PostGenius',
        notify_url: 'https://votre-domaine.com/api/webhooks/cinetpay',
        return_url: 'https://votre-domaine.com/parametres',
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

  return {
    live: { paystack: paystackLive, cinetpay: cinetpayLive },
    async init({ provider = 'auto', method, plan, amount, currency, email }) {
      if (provider === 'paystack') {
        return { ...(await paystackInitialize({ email, amount, currency })), method, plan }
      }
      if (provider === 'cinetpay') {
        return { ...(await cinetpayInitialize({ email, amount, currency })), method, plan }
      }
      if (paystackLive) {
        return { ...(await paystackInitialize({ email, amount, currency })), method, plan }
      }
      if (cinetpayLive) {
        return { ...(await cinetpayInitialize({ email, amount, currency })), method, plan }
      }
      return { provider: 'simulation', reference: makeReference(), status: 'success', sandbox: true, method, plan }
    }
  }
}
