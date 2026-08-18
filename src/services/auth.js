import { supabase } from './supabase'

export async function getCurrentSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthChange(callback) {
  if (!supabase) return { unsubscribe: () => {} }
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}

export async function signIn(email, password) {
  if (!supabase) throw new Error('Supabase non configuré. Ajoute les clés API dans le dashboard Vercel.')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase non configuré. Ajoute les clés API dans le dashboard Vercel.')
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  })
  if (error) throw error
  return data
}

export async function signUp(email, password) {
  if (!supabase) throw new Error('Supabase non configuré. Ajoute les clés API dans le dashboard Vercel.')
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data.session
}

export async function signOut() {
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function updatePassword(newPassword) {
  if (!supabase) throw new Error('Supabase non configuré.')
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  return data.user
}

export async function updateProfile(metadata) {
  if (!supabase) throw new Error('Supabase non configuré.')
  const { data, error } = await supabase.auth.updateUser({ data: metadata })
  if (error) throw error
  return data.user
}
