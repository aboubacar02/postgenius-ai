'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CURRENT_USER, DAILY_CREDITS, PRICING_PLANS } from '@/lib/mock-data'
import { useTheme } from '@/components/theme-toggle'

export function SettingsPageClient() {
  const [name, setName] = useState(CURRENT_USER.name)
  const [email, setEmail] = useState(CURRENT_USER.email)
  const [language, setLanguage] = useState('fr')
  const { theme, setTheme } = useTheme()
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [autoSubtitles, setAutoSubtitles] = useState(true)

  const currentPlan = PRICING_PLANS.find((p) => p.name === CURRENT_USER.plan)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Compte
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-balance font-heading md:text-4xl">
          Paramètres
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Gère ton profil, tes préférences de génération, ta facturation et ta sécurité.
        </p>
      </div>

      <Tabs defaultValue="profil">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="facturation">Facturation</TabsTrigger>
          <TabsTrigger value="securite">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="mt-6">
          <Card className="border-border/60 bg-card/60">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">Informations du profil</CardTitle>
              <CardDescription>Visible par toi seul dans cette démo.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarFallback className="text-base">{CURRENT_USER.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{name}</span>
                  <Badge variant="secondary" className="w-fit rounded-full">
                    Plan {CURRENT_USER.plan}
                  </Badge>
                </div>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nom complet</FieldLabel>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Adresse email</FieldLabel>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <FieldDescription>Utilisée pour la connexion et les reçus de facturation.</FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => toast.success('Profil mis à jour (démo)')}>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card className="border-border/60 bg-card/60">
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
                    <SelectTrigger id="lang" className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectGroup>
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
            <Card className="border-border/60 bg-card/60">
              <CardHeader>
                <CardTitle className="font-heading text-lg font-semibold">Plan actuel</CardTitle>
                <CardDescription>Gère ton abonnement et ta consommation.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full bg-primary text-primary-foreground">
                      {CURRENT_USER.plan}
                    </Badge>
                    <span className="font-mono text-lg font-semibold">
                      {currentPlan?.price}€<span className="text-sm text-muted-foreground">/mois</span>
                    </span>
                  </div>
                  <Button variant="outline">Changer de plan</Button>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Crédits journaliers utilisés</span>
                    <span className="font-mono">
                      {DAILY_CREDITS.used}/{DAILY_CREDITS.total}
                    </span>
                  </div>
                  <Progress value={(DAILY_CREDITS.used / DAILY_CREDITS.total) * 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60">
              <CardHeader>
                <CardTitle className="font-heading text-lg font-semibold">Moyen de paiement</CardTitle>
                <CardDescription>Aucune carte enregistrée dans cette démo.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={() => toast('Ajout de carte indisponible en démo')}
                >
                  Ajouter une carte
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="securite" className="mt-6">
          <Card className="border-border/60 bg-card/60">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">Sécurité</CardTitle>
              <CardDescription>Change ton mot de passe et gère tes sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="current-pw">Mot de passe actuel</FieldLabel>
                  <Input id="current-pw" type="password" placeholder="••••••••" />
                </Field>
                <Field orientation="responsive">
                  <Field>
                    <FieldLabel htmlFor="new-pw">Nouveau mot de passe</FieldLabel>
                    <Input id="new-pw" type="password" placeholder="••••••••" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-pw">Confirmer</FieldLabel>
                    <Input id="confirm-pw" type="password" placeholder="••••••••" />
                  </Field>
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => toast.success('Mot de passe mis à jour (démo)')}>
                Mettre à jour
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
