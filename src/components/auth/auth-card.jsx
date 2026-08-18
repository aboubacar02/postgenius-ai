import { useState } from 'react'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { toast } from '../../components/ui/sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Field, FieldGroup, FieldLabel } from '../../components/ui/field'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import { useApp } from '../../lib/app-context'
import { useI18n } from '../../lib/i18n'
import { signInWithGoogle } from '../../services/auth'
import { cn } from '../../lib/utils'

function GoogleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export function AuthCard() {
  const { signIn, signUp } = useApp()
  const { t } = useI18n()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    if (mode === 'register' && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      if (mode === 'login') await signIn(email, password)
      else await signUp(email, password)
      toast.success(mode === 'login' ? 'Connexion réussie !' : 'Compte créé avec succès !')
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  async function googleSignIn() {
    setGoogleLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message || 'Connexion Google échouée.')
      setGoogleLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border border-white/[0.06] bg-zinc-900/60 backdrop-blur-xl rounded-2xl">
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
      <CardHeader className="p-6 pb-4">
        <CardTitle className="font-heading text-xl font-bold text-zinc-100">
          {mode === 'login' ? 'Bienvenue' : 'Créer un compte'}
        </CardTitle>
        <CardDescription className="text-sm text-zinc-500">
          {mode === 'login' ? 'Connecte-toi pour accéder à ton studio.' : 'Rejoins Post Genius et crée du contenu viral.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-6 pb-6">
        {/* Google button */}
        <button
          type="button"
          onClick={googleSignIn}
          disabled={googleLoading || loading}
          className={cn(
            'group flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-semibold text-zinc-200 transition-all hover:bg-white/[0.06] hover:border-white/[0.15] active:scale-[0.98] disabled:opacity-50',
            googleLoading && 'cursor-wait'
          )}
        >
          {googleLoading ? (
            <Loader2 className="size-5 animate-spin text-zinc-500" />
          ) : (
            <GoogleIcon className="size-5 shrink-0" />
          )}
          <span>{googleLoading ? 'Connexion...' : 'Continuer avec Google'}</span>
        </button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1 bg-white/[0.06]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">ou</span>
          <Separator className="flex-1 bg-white/[0.06]" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="auth-email" className="text-xs font-bold text-zinc-400">
                Email
              </FieldLabel>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-600" />
                <Input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@email.com"
                  className="h-11 rounded-xl border-white/[0.06] bg-white/[0.03] pl-10 focus:border-indigo-500/50"
                />
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="auth-password" className="text-xs font-bold text-zinc-400">
                Mot de passe
              </FieldLabel>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-600" />
                <Input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-white/[0.06] bg-white/[0.03] pl-10 pr-10 focus:border-indigo-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>
            {mode === 'register' && (
              <Field>
                <FieldLabel htmlFor="auth-confirm" className="text-xs font-bold text-zinc-400">
                  Confirmer le mot de passe
                </FieldLabel>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-600" />
                  <Input
                    id="auth-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-white/[0.06] bg-white/[0.03] pl-10 pr-10 focus:border-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>
            )}
          </FieldGroup>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => { setMode((m) => (m === 'login' ? 'register' : 'login')); setError(null); }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {mode === 'login' ? 'Créer un compte' : 'Déjà un compte ? Se connecter'}
            </button>
            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="rounded-xl bg-indigo-600 px-6 font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                mode === 'login' ? 'Se connecter' : "S'inscrire"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
