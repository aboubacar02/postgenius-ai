import { useState } from 'react'
import { CreditCard, ShieldCheck, SlidersHorizontal, User } from 'lucide-react'
import { toast } from '../components/ui/sonner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
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
import { PRICING_PLANS } from '../lib/mock-data'
import { useApp } from '../lib/app-context'
import { updatePassword } from '../services/auth'

function AuthCard() {
  const { signIn, signUp } = useApp()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'login') await signIn(email, password)
      else await signUp(email, password)
      toast.success(mode === 'login' ? 'Connexion réussie' : 'Compte créé — bienvenue !')
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass premium-edge">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold">
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Connecte-toi pour synchroniser crédits et historique.'
            : 'Crée un compte pour sauvegarder tes scripts et profiter des crédits quotidiens.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="auth-email">Adresse email</FieldLabel>
              <Input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="auth-password">Mot de passe</FieldLabel>
              <Input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
          </FieldGroup>
          {error && <FieldError>{error}</FieldError>}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
              className="text-xs font-medium text-primary hover:underline"
            >
              {mode === 'login' ? 'Créer un compte' : 'J’ai déjà un compte'}
            </button>
            <Button type="submit" disabled={loading || !email || !password}>
              {loading ? 'Patientez…' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  const { user, isSignedIn, plan, creditsUsed, creditsTotal, theme, setTheme, logout } = useApp()
  const display = user || { name: 'Camille Aubert', email: 'camille.aubert@postgenius.ai', initials: 'CA', plan }
  const [name, setName] = useState(display.name)
  const [email, setEmail] = useState(display.email)
  const [language, setLanguage] = useState('fr')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [autoSubtitles, setAutoSubtitles] = useState(true)
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  const currentPlan = PRICING_PLANS.find((p) => p.name === display.plan) || PRICING_PLANS[1]
  const usedPct = Math.min(100, (creditsUsed / creditsTotal) * 100)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Compte
        </span>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Paramètres
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Gère ton profil, tes préférences de génération, ta facturation et ta sécurité.
        </p>
      </div>

      <Tabs defaultValue="profil">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
          <TabsTrigger value="profil">
            <User data-icon="inline-start" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <SlidersHorizontal data-icon="inline-start" />
            Préférences
          </TabsTrigger>
          <TabsTrigger value="facturation">
            <CreditCard data-icon="inline-start" />
            Facturation
          </TabsTrigger>
          <TabsTrigger value="securite">
            <ShieldCheck data-icon="inline-start" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="mt-6">
          {!isSignedIn && (
            <div className="mb-6">
              <AuthCard />
            </div>
          )}
          <Card className="glass premium-edge">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">Informations du profil</CardTitle>
              <CardDescription>
                {isSignedIn
                  ? 'Visible par toi seul dans cette démo.'
                  : 'Connecte-toi pour modifier tes informations.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarFallback className="text-base">{display.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{name}</span>
                  <Badge variant="secondary" className="w-fit rounded-full">
                    Plan {display.plan}
                  </Badge>
                </div>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nom complet</FieldLabel>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isSignedIn} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Adresse email</FieldLabel>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isSignedIn} />
                  <FieldDescription>Utilisée pour la connexion et les reçus de facturation.</FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
            {isSignedIn && (
              <CardFooter className="justify-end">
                <Button onClick={() => toast.success('Profil mis à jour (démo)')}>Enregistrer</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">Préférences</CardTitle>
              <CardDescription>Langue de l&apos;interface, thème et options de génération.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field orientation="responsive">
                  <FieldLabel htmlFor="lang">Langue</FieldLabel>
                  <Select
                    value={language}
                    onValueChange={(value) => {
                      if (value) setLanguage(value)
                    }}
                  >
                    <SelectValue />
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <FieldSeparator />

                <Field orientation="horizontal">
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel htmlFor="theme-switch">Thème sombre</FieldLabel>
                    <FieldDescription>PostGenius est conçu pour le mode sombre.</FieldDescription>
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
                    <FieldLabel htmlFor="notifs">Notifications par email</FieldLabel>
                    <FieldDescription>Reçois un résumé quand tes crédits se réinitialisent.</FieldDescription>
                  </div>
                  <Switch id="notifs" checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                </Field>

                <FieldSeparator />

                <Field orientation="horizontal">
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel htmlFor="subs">Sous-titres générés automatiquement</FieldLabel>
                    <FieldDescription>Ajoute les sous-titres à chaque script généré.</FieldDescription>
                  </div>
                  <Switch id="subs" checked={autoSubtitles} onCheckedChange={setAutoSubtitles} />
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => toast.success('Préférences enregistrées (démo)')}>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="facturation" className="mt-6">
          <div className="flex flex-col gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="font-heading text-lg font-semibold">Plan actuel</CardTitle>
                <CardDescription>Gère ton abonnement et ta consommation.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full bg-primary text-primary-foreground">
                      {display.plan}
                    </Badge>
                    <span className="font-mono text-lg font-semibold">
                      {currentPlan.price}€<span className="text-sm text-muted-foreground">/{currentPlan.period}</span>
                    </span>
                  </div>
                  <Button variant="outline">Changer de plan</Button>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Crédits journaliers utilisés</span>
                    <span className="font-mono">
                      {Math.min(creditsUsed, creditsTotal)}/{creditsTotal}
                    </span>
                  </div>
                  <Progress value={usedPct} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="font-heading text-lg font-semibold">Moyen de paiement</CardTitle>
                <CardDescription>Aucune carte enregistrée dans cette démo.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => toast('Ajout de carte indisponible en démo')}>
                  Ajouter une carte
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="securite" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">Sécurité</CardTitle>
              <CardDescription>
                {isSignedIn
                  ? 'Change ton mot de passe et gère tes sessions.'
                  : 'Connecte-toi pour modifier ton mot de passe.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSignedIn ? (
                <FieldGroup>
                  <Field orientation="responsive">
                    <Field>
                      <FieldLabel htmlFor="new-pw">Nouveau mot de passe</FieldLabel>
                      <Input id="new-pw" type="password" placeholder="••••••••" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirm-pw">Confirmer</FieldLabel>
                      <Input id="confirm-pw" type="password" placeholder="••••••••" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
                    </Field>
                  </Field>
                </FieldGroup>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Utilise l&apos;onglet Profil pour créer un compte ou te connecter.
                </p>
              )}
            </CardContent>
            {isSignedIn && (
              <CardFooter className="justify-end">
                <Button
                  disabled={!newPw || newPw !== confirmPw}
                  onClick={async () => {
                    try {
                      await updatePassword(newPw)
                      setNewPw('')
                      setConfirmPw('')
                      toast.success('Mot de passe mis à jour')
                    } catch (e) {
                      toast.error('Impossible de mettre à jour le mot de passe')
                    }
                  }}
                >
                  Mettre à jour
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}