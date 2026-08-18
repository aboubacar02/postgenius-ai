import { useState } from 'react'
import { CreditCard, ShieldCheck, SlidersHorizontal, User, Settings } from 'lucide-react'
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
import { ReferralCard } from '../components/referral/referral-card'
import { AuthCard } from '../components/auth/auth-card'
import { PRICING_PLANS } from '../lib/mock-data'
import { useApp, isUnlimitedPlan } from '../lib/app-context'
import { useI18n, LANGUAGES } from '../lib/i18n'
import { updatePassword } from '../services/auth'
import { cn } from '../lib/utils'

export default function SettingsPage() {
  const { user, isSignedIn, plan, creditsUsed, creditsTotal, theme, setTheme } = useApp()
  const { t, lang, setLang } = useI18n()
  const display = user || { name: 'Utilisateur', email: 'utilisateur@postgenius.ai', initials: 'U', plan: 'Starter' }
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
                    'relative flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all active:scale-95 min-h-[44px]',
                    active
                      ? 'bg-primary/10 font-bold text-primary shadow-sm'
                      : 'text-pg-muted hover:bg-white/[0.04] hover:text-pg-text'
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-sm" />
                  )}
                  <Icon className="size-5" />
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
                      <FieldDescription className="text-xs text-pg-muted">
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
                      <FieldDescription className="text-xs text-pg-muted">
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
                      <FieldDescription className="text-xs text-pg-muted">
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
                      <FieldDescription className="text-xs text-pg-muted">
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

                  <FieldSeparator className="bg-border" />

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

                {/* 2FA Section */}
                <FieldSeparator className="my-2" />
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-pg-text">Double authentification (2FA)</span>
                      <span className="text-xs text-pg-muted">
                        Ajoute une couche de sécurité supplémentaire à ton compte.
                      </span>
                    </div>
                    <Switch
                      id="twofa-switch"
                      checked={false}
                      onCheckedChange={() => toast.info('2FA bientôt disponible.')}
                    />
                  </div>
                  <p className="text-xs text-zinc-600">
                    La double authentification sera disponible prochainement via email ou application d'authentification.
                  </p>
                </div>
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
