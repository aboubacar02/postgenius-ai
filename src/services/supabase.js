import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = supabaseUrl && supabaseAnonKey && !supabaseAnonKey.startsWith('sb_')

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

export const CREDITS_PER_DAY = 5

/**
 * Récupère les crédits consommés aujourd'hui pour un utilisateur.
 * Table attendue dans Supabase :
 *   user_credits (user_id uuid, date date, credits_used int)
 */
export async function getCreditsUsed(userId) {
  const today = new Date().toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('user_credits')
    .select('credits_used')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()

  if (error) throw error
  return data?.credits_used ?? 0
}

/**
 * Enregistre la consommation d'un crédit pour la journée.
 */
export async function incrementCreditsUsed(userId) {
  const today = new Date().toISOString().slice(0, 10)

  const { data: existing, error: selectError } = await supabase
    .from('user_credits')
    .select('id, credits_used')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()

  if (selectError) throw selectError

  if (existing) {
    const { error } = await supabase
      .from('user_credits')
      .update({ credits_used: existing.credits_used + 1 })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('user_credits')
      .insert({ user_id: userId, date: today, credits_used: 1 })
    if (error) throw error
  }
}

/**
 * Sauvegarde un script généré dans l'historique.
 * Table attendue : generated_scripts (id, user_id, network, topic, result, created_at)
 */
export async function saveGeneratedScript(userId, network, topic, result) {
  const { error } = await supabase
    .from('generated_scripts')
    .insert({ user_id: userId, network, topic, result })
  if (error) throw error
}

export async function fetchGeneratedScripts(userId, limit = 50) {
  const { data, error } = await supabase
    .from('generated_scripts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function deleteGeneratedScript(userId, scriptId) {
  const { error } = await supabase
    .from('generated_scripts')
    .delete()
    .eq('user_id', userId)
    .eq('id', scriptId)
  if (error) throw error
}
