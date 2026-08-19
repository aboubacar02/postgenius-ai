import { supabase, isConfigured } from './supabase'

export async function getCurrentSession() {
  if (!isConfigured || !supabase) return null
  try {
    const { data } = await supabase.auth.getSession()
    return data.session
  } catch {
    return null
  }
}

export function onAuthChange(callback) {
  if (!isConfigured || !supabase) return { unsubscribe: () => {} }
  try {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })
  } catch {
    return { unsubscribe: () => {} }
  }
}

export async function signIn(email, password) {
  if (!isConfigured || !supabase) {
    throw new Error('Authentification indisponible : Supabase n\'est pas configuré.')
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session
}

export async function signInWithGoogle() {
  if (!isConfigured || !supabase) {
    throw new Error('Authentification Google indisponible : Supabase n\'est pas configuré.')
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  })
  if (error) throw error
  return data
}

export async function signUp(email, password) {
  if (!isConfigured || !supabase) {
    throw new Error('Inscription indisponible : Supabase n\'est pas configuré.')
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin }
  })
  if (error) throw error
  return data
}

export async function signOut() {
  if (!isConfigured || !supabase) {
    throw new Error('Déconnexion indisponible : Supabase n\'est pas configuré.')
  }
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function updatePassword(newPassword) {
  if (!isConfigured || !supabase) throw new Error('Supabase n\'est pas configuré.')
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  return data.user
}

export async function updateProfile(metadata) {
  if (!isConfigured || !supabase) throw new Error('Supabase n\'est pas configuré.')
  const { data, error } = await supabase.auth.updateUser({ data: metadata })
  if (error) throw error
  return data.user
}
