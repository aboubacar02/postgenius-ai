// Charge les variables d'environnement SERVEUR depuis .env.
// Les secrets (GEMINI_API_KEY, PAYSTACK_SECRET_KEY, CINETPAY_API_KEY, ...) ne doivent
// PAS porter le préfixe VITE_ pour ne jamais être embarqués dans le bundle front.
import { readFileSync } from 'node:fs'

export function loadServerEnv() {
  const env = { ...process.env }
  try {
    const raw = readFileSync('.env', 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !(m[1] in env)) env[m[1]] = m[2].trim()
    }
  } catch {
    /* pas de fichier .env */
  }
  return env
}
