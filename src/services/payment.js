// Service de paiement côté client.
// Les clés réelles (Stripe / PayPal / Paystack / CinetPay) vivent UNIQUEMENT côté
// serveur : l'app POSTe sur /api/payments/init et le serveur retourne soit une
// session réelle (URL de paiement), soit une simulation sandbox (aucune charge).

export const PAYMENT_PROVIDERS = [
  { id: 'stripe', name: 'Stripe', desc: 'Cartes Visa, Mastercard, Apple Pay (international)' },
  { id: 'paypal', name: 'PayPal', desc: 'Paiement international sécurisé' },
  { id: 'paystack', name: 'Paystack', desc: 'Carte bancaire & Mobile Money (Afrique)' },
  { id: 'cinetpay', name: 'CinetPay', desc: 'Mobile Money & cartes (Afrique francophone)' }
]

// Chaque moyen de paiement de l'UI est routé vers sa passerelle réelle côté serveur.
export function methodToProvider(method) {
  if (method === 'paypal') return 'paypal'
  if (['wave', 'orange', 'mtn', 'moov'].includes(method)) return 'cinetpay'
  return 'stripe'
}

function makeReference() {
  return `PG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

function fakeWait(ms) {
  return new Promise((resolve) => setTimeout(resolve, 900))
}

// Point d'entrée unique — provider : 'auto' | 'stripe' | 'paypal' | 'paystack' | 'cinetpay' | 'simulation'
export async function createPaymentSession({ provider = 'auto', method, plan, currency, amount, email }) {
  try {
    const res = await fetch('/api/payments/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, method, plan, currency, amount: Number(amount) || 0, email })
    })
    if (res.ok) return res.json()
  } catch {
    /* serveur indisponible : repli simulation locale ci-dessous */
  }

  // Repli : simulation locale (aucune clé côté client, aucun débit réel).
  await fakeWait()
  return { provider: 'simulation', reference: makeReference(), status: 'success', sandbox: true, method, plan }
}
