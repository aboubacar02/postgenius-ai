import { useState } from 'react'
import { Loader2 } from 'lucide-react'
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

export function GoogleIconComponent({ className }) {
  return <GoogleIcon className={className} />
}

export function AuthCard() {
  const { signIn, signUp } = useApp()
  const { t } = useI18n()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'login') await signIn(email, password)
      else await signUp(email, password)
      toast.success(mode === 'login' ? t('settings.loginSuccess') : t('settings.signUpSuccess'))
    } catch (err) {
      setError(err.message || t('settings.genericError'))
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
      setError(err.message || t('settings.googleFail'))
      setGoogleLoading(false)
    }
  }

  return (
    <Card className="border border-white/[0.06] bg-pg-surface rounded-xl p-6">
      <CardHeader className="p-0 pb-5">
        <CardTitle className="font-heading text-lg font-bold text-pg-text">
          {mode === 'login' ? t('settings.signIn') : t('settings.signUp')}
        </CardTitle>
        <CardDescription className="text-xs text-pg-muted">
          {mode === 'login' ? t('settings.signInDesc') : t('settings.signUpDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 p-0">
        <button
          type="button"
          onClick={googleSignIn}
          disabled={googleLoading || loading}
          className={cn(
            'group flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-pg-surface px-4 text-sm font-semibold text-pg-text shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-white/[0.12] active:scale-[0.98] disabled:opacity-50',
            googleLoading && 'cursor-wait'
          )}
        >
          {googleLoading ? (
            <Loader2 className="size-5 animate-spin text-pg-subtle" />
          ) : (
            <GoogleIcon className="size-5 shrink-0" />
          )}
          <span>{googleLoading ? t('settings.waiting') : t('settings.google')}</span>
        </button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1 bg-border" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-pg-muted">
            {t('settings.or')}
          </span>
          <Separator className="flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="auth-email" className="text-xs font-bold text-pg-text/80">
                {t('settings.email')}
              </FieldLabel>
              <Input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('settings.emailPlaceholder')}
                className="rounded-xl border-white/[0.06] bg-white/[0.04] focus:border-primary"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="auth-password" className="text-xs font-bold text-pg-text/80">
                {t('settings.password')}
              </FieldLabel>
              <Input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl border-white/[0.06] bg-white/[0.04] focus:border-primary"
              />
            </Field>
          </FieldGroup>
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {mode === 'login' ? t('settings.createAccount') : t('settings.haveAccount')}
            </button>
            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="rounded-xl bg-primary px-6 font-bold text-white shadow-sm"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                mode === 'login' ? t('settings.signInBtn') : t('settings.signUpBtn')
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
