// Détection automatique de la devise selon le pays de l'utilisateur.
// Utilise d'abord la géolocalisation IP (via une API gratuite, côté client),
// puis retombe sur le fuseau horaire / la langue du navigateur.

import { CURRENCIES, setStoredCurrency } from '../lib/currencies'

// Mapping pays (code ISO alpha-2) → id de devise.
export const COUNTRY_CURRENCY = {
  // Afrique de l'Ouest — FCFA (UEMOA)
  CI: 'xof',
  SN: 'xof',
  ML: 'xof',
  BF: 'xof',
  BJ: 'xof',
  TG: 'xof',
  NE: 'xof',
  GN: 'xof',
  // Europe / zone euro
  FR: 'eur',
  BE: 'eur',
  CH: 'eur',
  LU: 'eur',
  MC: 'eur',
  // International
  US: 'usd',
  CA: 'usd',
  GB: 'usd',
  AU: 'usd',
  // Défaut international
  _: 'usd'
}

// Ordre de fallback : locale du navigateur → fuseau horaire.
const TIMEZONE_HINTS = [
  { zone: /Africa\/(Abidjan|Dakar|Bamako|Ouagadougou|Porto-Novo|Lome|Conakry|Nouakchott|Niamey)/, id: 'xof' },
  { zone: /Africa\/Europe_?\b/i, id: 'eur' },
  { zone: /Europe\//, id: 'eur' },
  { zone: /America\/New_York|America\/Los_Angeles|America\/Chicago|America\/Denver/, id: 'usd' }
]

export function currencyFromLocale() {
  try {
    const lang = navigator.language || ''
    const upper = lang.toUpperCase()
    if (upper.includes('-')) {
      const country = upper.split('-')[1]
      const id = COUNTRY_CURRENCY[country]
      if (id) return id
    }
  } catch {
    /* API navigateur indisponible */
  }

  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    for (const hint of TIMEZONE_HINTS) {
      if (hint.zone.test(zone)) return hint.id
    }
  } catch {
    /* timezone indisponible */
  }

  return 'usd'
}

export async function detectCurrency() {
  const id = currencyFromLocale()
  const found = CURRENCIES.find((c) => c.id === id)
  if (found) {
    setStoredCurrency(id)
    return found
  }
  return CURRENCIES[2]
}
