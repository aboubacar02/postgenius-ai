import { useState } from 'react'
import { CreditCard, ShieldCheck, SlidersHorizontal, User, Settings, Loader2 } from 'lucide-react'
import { toast } from '../components/ui/sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldSeparator, FieldError } from '../components/ui/field'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Switch } from '../components/ui/switch'
import { Select, SelectContent, SelectItem, SelectValue } from '../components/ui/select'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Separator } from '../components/ui/separator'
import { ReferralCard } from '../components/referral/referral-card'
import { PRICING_PLANS } from '../lib/mock-data'
import { useApp, isUnlimitedPlan } from '../lib/app-context'
import { useI18n, LANGUAGES } from '../lib/i18n'
import { updatePassword, signInWithGoogle } from '../services/auth'
import { cn } from '../lib/utils'

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

function AuthCard() {
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
        {/* Google button — premium style */}
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

export default function SettingsPage() {
  const { user, isSignedIn, plan, creditsUsed, creditsTotal, theme, setTheme } = useApp()
  const { t, lang, setLang } = useI18n()
  const display = user || { name: 'Camille Aubert', email: 'camille.aubert@postgenius.ai', initials: 'CA', plan }
  const [tab, setTab] = useState('profil')
  const [name, setName] = useState(display.name)
  const [email, setEmail] = useState(display.email)
  const [language, setLanguage] = useState(lang)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [autoSubtitles, setAutoSubtitles] = useState(true)
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  const SETTINGS_NAV = [
    { id: 'profil', label: t('settings.profile'), icon: User },
    { id: 'facturation', label: t('settings.billing'), icon: CreditCard },
    { id: 'preferences', label: t('settings.preferences'), icon: SlidersHorizontal },
    { id: 'securite', label: t('settings.security'), icon: ShieldCheck }
  ]

  const currentPlan = PRICING_PLANS.find((p) => p.name === display.plan) || PRICING_PLANS[1]
  const usedPct = Math.min(100, (creditsUsed / creditsTotal) * 100)

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-4 pb-16 pt-4 sm:px-8">
      {/* Header */}
      <div className="reveal flex flex-col gap-2">
        <span className="eyebrow text-primary flex items-center gap-1.5">
          <Settings className="size-3.5" />
          {t('settings.badge')}
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-pg-text md:text-3xl">
          {t('settings.title')}
        </h1>
        <p className="max-w-xl text-[15px] text-pg-muted">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sidebar nav */}
        <aside className="lg:col-span-3">
          <nav className="flex flex-row gap-1 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:gap-1">
            {SETTINGS_NAV.map((item) => {
              const Icon = item.icon
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    'relative flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all active:scale-95',
                    active
                      ? 'bg-primary/10 font-bold text-primary shadow-sm'
                      : 'text-pg-muted hover:bg-white/[0.04] hover:text-pg-text'
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-sm" />
                  )}
                  <Icon className="size-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-9">
          {tab === 'profil' && (
            <>
              {!isSignedIn && (
                <div className="mb-2 reveal-1">
                  <AuthCard />
                </div>
              )}

              <Card className="reveal-2 border border-white/[0.06] bg-pg-surface rounded-xl p-6">
                <CardHeader className="p-0 pb-5">
                  <CardTitle className="font-heading text-lg font-bold text-pg-text">
                    {t('settings.profileInfo')}
                  </CardTitle>
                  <CardDescription className="text-xs text-pg-muted">
                    {isSignedIn
                      ? t('settings.profileInfoDesc')
                      : t('settings.profileInfoDescSigned')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 p-0">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 opacity-60 blur-sm" />
                      <Avatar className="relative size-14 border-2 border-background">
                        <AvatarFallback className="bg-pg-surface font-bold text-pg-text">
                          {display.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-bold text-pg-text">{name}</span>
                      <Badge variant="secondary" className="w-fit rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">
                        {t('topbar.plan', { plan: display.plan })}
                      </Badge>
                    </div>
                  </div>

                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="name" className="text-xs font-bold text-pg-text/80">
                        {t('settings.fullName')}
                      </FieldLabel>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isSignedIn}
                        className="rounded-xl border-white/[0.06] bg-white/[0.04]"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="email" className="text-xs font-bold text-pg-text/80">
                        {t('settings.email')}
                      </FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isSignedIn}
                        className="rounded-xl border-white/[0.06] bg-white/[0.04]"
                      />
                      <FieldDescription className="text-[11px] text-pg-muted">
                        {t('settings.emailDesc')}
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </CardContent>
                {isSignedIn && (
                  <CardFooter className="justify-end p-0 pt-2">
                    <Button
                      onClick={() => toast.success(t('settings.saved'))}
                      className="rounded-xl bg-primary px-6 font-bold text-white shadow-sm"
                    >
                      {t('settings.save')}
                    </Button>
                  </CardFooter>
                )}
              </Card>
              <div className="reveal-3">
                <ReferralCard />
              </div>
            </>
          )}

          {tab === 'preferences' && (
            <Card className="reveal border border-white/[0.06] bg-pg-surface rounded-xl p-6">
              <CardHeader className="p-0 pb-5">
                <CardTitle className="font-heading text-lg font-bold text-pg-text">
                  {t('settings.preferences')}
                </CardTitle>
                <CardDescription className="text-xs text-pg-muted">
                  {t('settings.preferencesDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-0 p-0">
                <FieldGroup>
                  <Field orientation="responsive">
                    <FieldLabel htmlFor="lang" className="text-xs font-bold text-pg-text/80">
                      {t('settings.language')}
                    </FieldLabel>
                    <Select
                      value={language}
                      onValueChange={(value) => {
                        if (value) {
                          setLanguage(value)
                          setLang(value)
                        }
                      }}
                    >
                      <SelectValue placeholder={t('common.selectPlaceholder')} />
                      <SelectContent>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.flag} {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <FieldSeparator />

                  <Field orientation="horizontal">
                    <div className="flex flex-col gap-0.5">
                      <FieldLabel htmlFor="theme-switch" className="text-xs font-bold text-pg-text/80">
                        {t('settings.darkTheme')}
                      </FieldLabel>
                      <FieldDescription className="text-[11px] text-pg-muted">
                        {t('settings.darkThemeDesc')}
                      </FieldDescription>
                    </div>
                    <Switch
                      id="theme-switch"
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </Field>

                  <FieldSeparator />

                  <Field orientation="horizontal">
                    <div className="flex flex-col gap-0.5">
                      <FieldLabel htmlFor="notifs" className="text-xs font-bold text-pg-text/80">
                        {t('settings.emailNotifs')}
                      </FieldLabel>
                      <FieldDescription className="text-[11px] text-pg-muted">
                        {t('settings.emailNotifsDesc')}
                      </FieldDescription>
                    </div>
                    <Switch id="notifs" checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                  </Field>

                  <FieldSeparator />

                  <Field orientation="horizontal">
                    <div className="flex flex-col gap-0.5">
                      <FieldLabel htmlFor="subs" className="text-xs font-bold text-pg-text/80">
                        {t('settings.autoSubs')}
                      </FieldLabel>
                      <FieldDescription className="text-[11px] text-pg-muted">
                        {t('settings.autoSubsDesc')}
                      </FieldDescription>
                    </div>
                    <Switch id="subs" checked={autoSubtitles} onCheckedChange={setAutoSubtitles} />
                  </Field>
                </FieldGroup>
              </CardContent>
              <CardFooter className="justify-end p-0 pt-4">
                <Button
                  onClick={() => toast.success(t('settings.prefsSaved'))}
                  className="rounded-xl bg-primary px-6 font-bold text-white shadow-sm"
                >
                  {t('settings.save')}
                </Button>
              </CardFooter>
            </Card>
          )}

          {tab === 'facturation' && (
            <div className="flex flex-col gap-6">
              <Card className="reveal border border-white/[0.06] bg-pg-surface rounded-xl p-6">
                <CardHeader className="p-0 pb-5">
                  <CardTitle className="font-heading text-lg font-bold text-pg-text">
                    {t('settings.currentPlan')}
                  </CardTitle>
                  <CardDescription className="text-xs text-pg-muted">
                    {t('settings.currentPlanDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 p-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Badge className="rounded-full border-0 bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm">
                        {display.plan}
                      </Badge>
                      <span className="font-mono text-xl font-black text-pg-text">
                        {currentPlan.price}€
                        <span className="text-sm font-medium text-pg-muted">
                          /{t(currentPlan.price === 0 ? 'pricing.period.forever' : 'pricing.period.month')}
                        </span>
                      </span>
                    </div>
                    <Button variant="outline" className="rounded-xl border-white/[0.06] bg-white/[0.04] font-semibold">
                      {t('pricing.changePlan')}
                    </Button>
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex items-center gap-6">
                    <div className="relative flex size-28 shrink-0 items-center justify-center">
                      <svg className="size-28 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-white/5" strokeWidth="2.5" />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="url(#usage-grad)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeDasharray={`${(usedPct / 100) * 100} 100`}
                          className="transition-[stroke-dasharray] duration-700"
                        />
                        <defs>
                          <linearGradient id="usage-grad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#22d3ee" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute text-2xl font-black text-pg-text">
                        {Math.round(usedPct)}%
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <span className="text-sm font-bold text-pg-text">{t('settings.dailyCredits')}</span>
                      <span className="font-mono text-xs text-pg-muted">
                        {isUnlimitedPlan(display.plan)
                          ? t('settings.unlimited')
                          : t('settings.today', { used: Math.min(creditsUsed, creditsTotal), total: creditsTotal })}
                      </span>
                      <Progress value={usedPct} gradient className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="reveal-1 border border-white/[0.06] bg-pg-surface rounded-xl p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="font-heading text-lg font-bold text-pg-text">
                    {t('settings.paymentMethod')}
                  </CardTitle>
                  <CardDescription className="text-xs text-pg-muted">
                    {t('settings.paymentMethodDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Button
                    variant="outline"
                    onClick={() => toast(t('settings.addCardUnavailable'))}
                    className="rounded-xl border-white/[0.06] bg-white/[0.04] font-semibold hover:border-primary/30"
                  >
                    {t('settings.addCard')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {tab === 'securite' && (
            <Card className="reveal border border-white/[0.06] bg-pg-surface rounded-xl p-6">
              <CardHeader className="p-0 pb-5">
                <CardTitle className="font-heading text-lg font-bold text-pg-text">
                  {t('settings.security')}
                </CardTitle>
                <CardDescription className="text-xs text-pg-muted">
                  {isSignedIn
                    ? t('settings.securityDescSigned')
                    : t('settings.securityDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-0">
                {isSignedIn ? (
                  <FieldGroup>
                    <Field orientation="responsive">
                      <Field>
                        <FieldLabel htmlFor="new-pw" className="text-xs font-bold text-pg-text/80">
                          {t('settings.newPassword')}
                        </FieldLabel>
                        <Input
                          id="new-pw"
                          type="password"
                          placeholder="••••••••"
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          className="rounded-xl border-white/[0.06] bg-white/[0.04]"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="confirm-pw" className="text-xs font-bold text-pg-text/80">
                          {t('settings.confirmPassword')}
                        </FieldLabel>
                        <Input
                          id="confirm-pw"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPw}
                          onChange={(e) => setConfirmPw(e.target.value)}
                          className="rounded-xl border-white/[0.06] bg-white/[0.04]"
                        />
                      </Field>
                    </Field>
                  </FieldGroup>
                ) : (
                  <p className="text-sm text-pg-muted">{t('settings.useProfileTab')}</p>
                )}
              </CardContent>
              {isSignedIn && (
                <CardFooter className="justify-end p-0 pt-4">
                  <Button
                    disabled={!newPw || newPw !== confirmPw}
                    onClick={async () => {
                      try {
                        await updatePassword(newPw)
                        setNewPw('')
                        setConfirmPw('')
                        toast.success(t('settings.updated'))
                      } catch {
                        toast.error(t('settings.updateFail'))
                      }
                    }}
                    className="rounded-xl bg-primary px-6 font-bold text-white shadow-sm"
                  >
                    {t('settings.update')}
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
