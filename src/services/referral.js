// Système de parrainage (démo, persistance localStorage).
// - Chaque utilisateur a un code de parrainage et un lien partageable (?ref=CODE).
// - Quand une personne parrainée paie un abonnement, le parrain gagne un abonnement Pro.
// - Des paliers de récompenses se débloquent selon le nombre de parrainages.

const OWN_KEY = 'pg-referral'
const REFERRER_KEY = 'pg-referrer'
const REGISTRY_KEY = 'pg-referrals-registry'

export const REWARD_TIERS = [
  { min: 1, labelKey: 'referral.tier1' },
  { min: 3, labelKey: 'referral.tier3' },
  { min: 5, labelKey: 'referral.tier5' },
  { min: 10, labelKey: 'referral.tier10' }
]

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* stockage indisponible */
  }
}

function evaluateTiers(count) {
  return REWARD_TIERS.filter((tier) => count >= tier.min).map((tier) => tier.min)
}

function mergeTiers(earned) {
  return [...new Set(Array.isArray(earned) ? earned : [])]
}

function buildLink(code) {
  return `${window.location.origin}${window.location.pathname}?ref=${code}`
}

export function getReferralCode() {
  const own = readJSON(OWN_KEY, null)
  if (own?.code) return own.code
  const code = 'PG-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  writeJSON(OWN_KEY, { code, count: 0, earnedTiers: [], pro: false })
  return code
}

export function getReferral() {
  const own = readJSON(OWN_KEY, null) || {
    code: getReferralCode(),
    count: 0,
    earnedTiers: [],
    pro: false
  }
  const code = own.code
  const registry = readJSON(REGISTRY_KEY, {})
  const entry = registry[code]
  const count = Math.max(own.count || 0, entry?.count || 0)
  const earnedTiers = mergeTiers([...(own.earnedTiers || []), ...(entry?.earnedTiers || [])])
  const pro = !!(own.pro || entry?.pro)
  return { code, count, earnedTiers, pro, link: buildLink(code) }
}

export function getReferrer() {
  return readJSON(REFERRER_KEY, null)
}

export function captureReferrer() {
  try {
    const params = new URLSearchParams(window.location.search)
    const ref = (params.get('ref') || '').trim().toUpperCase()
    if (!ref) return null
    const own = getReferralCode()
    if (ref === own) return null
    writeJSON(REFERRER_KEY, ref)
    return ref
  } catch {
    return null
  }
}

export function creditReferrerForPayment() {
  const ref = getReferrer()
  const own = getReferralCode()
  if (!ref || ref === own) return null
  const registry = readJSON(REGISTRY_KEY, {})
  const entry = registry[ref] || { count: 0, earnedTiers: [], pro: false }
  entry.count += 1
  entry.pro = true
  entry.earnedTiers = evaluateTiers(entry.count)
  registry[ref] = entry
  writeJSON(REGISTRY_KEY, registry)
  return { referrer: ref, count: entry.count, earnedTiers: entry.earnedTiers, pro: true }
}
