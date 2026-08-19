// Service de paiement côté client.
// Les clés réelles (Stripe / PayPal / Paystack / CinetPay) vivent UNIQUEMENT côté
// serveur : l'app POSTe sur /api/payments/init et le serveur retourne une
// session réelle (URL de paiement) ou une erreur explicite.

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

// Point d'entrée unique — provider : 'auto' | 'stripe' | 'paypal' | 'paystack' | 'cinetpay'
export async function createPaymentSession({ provider = 'auto', method, plan, currency, amount, email }) {
  const res = await fetch('/api/payments/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, method, plan, currency, amount: Number(amount) || 0, email })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Paiement indisponible (${res.status})`)
  }
  return data
}
