// Devises, conversion et moyens de paiement par marché.

export const CURRENCIES = [
  {
    id: 'xof',
    code: 'FCFA',
    flag: '🌍',
    label: 'FCFA — Afrique de l’Ouest',
    rateEur: 655.957,
    locale: 'fr-FR',
    hint: 'Wave · Orange Money · MTN MoMo'
  },
  {
    id: 'eur',
    code: '€',
    flag: '🇪🇺',
    label: 'EUR — Europe',
    rateEur: 1,
    locale: 'fr-FR',
    hint: 'Carte bancaire · PayPal'
  },
  {
    id: 'usd',
    code: '$',
    flag: '🇺🇸',
    label: 'USD — International',
    rateEur: 1.09,
    locale: 'en-US',
    hint: 'Carte bancaire · PayPal'
  }
]

export const MOBILE_PAYMENTS = [
  { id: 'wave', name: 'Wave', emoji: '🌊', desc: 'Wave Money — CI, Sénégal, Mali' },
  { id: 'orange', name: 'Orange Money', emoji: '🟠', desc: 'Afrique de l’Ouest & centrale' },
  { id: 'mtn', name: 'MTN MoMo', emoji: '🟡', desc: 'Afrique de l’Ouest & centrale' },
  { id: 'moov', name: 'Moov Money', emoji: '🔵', desc: 'Côte d’Ivoire, Bénin, Togo' }
]

export const CARD_PAYMENTS = [
  { id: 'card', name: 'Carte bancaire', emoji: '💳', desc: 'Visa, Mastercard, CB' },
  { id: 'paypal', name: 'PayPal', emoji: '🅿️', desc: 'Paiement international sécurisé' },
  { id: 'apple', name: 'Apple Pay', emoji: '', desc: 'Paiement sans contact iOS' }
]

export function formatPrice(priceEur, currency) {
  if (!currency) return `${priceEur}€`
  if (currency.id === 'xof') {
    return `${new Intl.NumberFormat('fr-FR').format(Math.round(priceEur * currency.rateEur))} FCFA`
  }
  if (currency.id === 'usd') {
    return `${new Intl.NumberFormat('en-US').format(Math.round(priceEur * currency.rateEur))}$`
  }
  return `${priceEur}€`
}

export function defaultCurrency() {
  try {
    const saved = localStorage.getItem('pg-currency')
    if (saved) {
      const found = CURRENCIES.find((c) => c.id === saved)
      if (found) return found
    }
  } catch {
    /* stockage indisponible */
  }
  return CURRENCIES[1]
}
