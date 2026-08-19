import { supabase, isConfigured, getLocalUser, setLocalUser } from './supabase'

export async function getCurrentSession() {
  if (!isConfigured || !supabase) {
    const local = getLocalUser()
    return local ? { user: local } : null
  }
  try {
    const { data } = await supabase.auth.getSession()
    return data.session
  } catch {
    return getLocalUser() ? { user: getLocalUser() } : null
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
    const localUser = {
      id: 'local-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16),
      email,
      user_metadata: { full_name: email.split('@')[0] },
      aud: 'authenticated'
    }
    setLocalUser(localUser)
    return { user: localUser }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session
}

export async function signInWithGoogle() {
  if (!isConfigured || !supabase) {
    const localUser = {
      id: 'local-google-' + Date.now(),
      email: 'utilisateur@gmail.com',
      user_metadata: { full_name: 'Utilisateur Google' },
      aud: 'authenticated'
    }
    setLocalUser(localUser)
    window.location.reload()
    return
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
    const localUser = {
      id: 'local-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16),
      email,
      user_metadata: { full_name: email.split('@')[0] },
      aud: 'authenticated'
    }
    setLocalUser(localUser)
    return { user: localUser, session: { user: localUser } }
  }
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  if (!isConfigured || !supabase) {
    setLocalUser(null)
    return
  }
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function updatePassword(newPassword) {
  if (!isConfigured || !supabase) return getLocalUser()
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  return data.user
}

export async function updateProfile(metadata) {
  if (!isConfigured || !supabase) {
    const local = getLocalUser()
    if (local) {
      local.user_metadata = { ...local.user_metadata, ...metadata }
      setLocalUser(local)
    }
    return local
  }
  const { data, error } = await supabase.auth.updateUser({ data: metadata })
  if (error) throw error
  return data.user
}
