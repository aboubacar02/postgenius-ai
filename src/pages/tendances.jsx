import { useState } from 'react'
import { Clock, ExternalLink, Flame, Play, RefreshCw, Sparkles, TrendingUp } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'

const NICHES = [
  {
    emoji: '💻',
    name: 'Tech',
    color: 'from-cyan-400 to-blue-600',
    tags: ['#tech', '#astuce', '#viral'],
    ideas: [
      '3 applis gratuites qui valent de l’or en 2026 (tu les ignores sûrement)',
      'Pourquoi ton téléphone ralentit chaque année — et comment l’éviter',
      'L’erreur que tout le monde fait avec son stockage',
      'J’ai testé l’IA qui gère mes e-mails pendant 30 jours',
      'Le raccourci secret qui change ta façon de travailler'
    ]
  },
  {
    emoji: '🎮',
    name: 'Gaming',
    color: 'from-rose-600 to-red-500',
    tags: ['#gaming', '#gamer', '#viral'],
    ideas: [
      'Le boss qui a détruit des milliers de joueurs (histoire vraie)',
      'Je suis passé de Bronze à Diamant en 7 jours',
      'Les 5 erreurs des débutants que tout le monde fait',
      'Cette mécanique cachée change absolument tout',
      'Speedrun : le record que personne ne croyait possible'
    ]
  },
  {
    emoji: '💼',
    name: 'Business',
    color: 'from-amber-400 to-orange-500',
    tags: ['#business', '#entrepreneur', '#argent'],
    ideas: [
      'Le business à 0€ que je recommande en 2026',
      'J’ai facturé 1000€ mon premier client freelance (voici comment)',
      'La mentalité qui sépare les gens bloqués de ceux qui avancent',
      '3 erreurs qui ruinent ton side hustle en silence',
      'Le pitch de vente en 30 secondes qui convertit vraiment'
    ]
  },
  {
    emoji: '📖',
    name: 'Storytime',
    color: 'from-fuchsia-500 to-purple-600',
    tags: ['#storytime', '#histoire', '#tiktokfrance'],
    ideas: [
      'J’ai livré des pizzas pour rembourser mes dettes (histoire vraie)',
      'Le client qui a changé ma vie en 5 minutes',
      'J’ai rencontré mon patron par hasard en vacances',
      'La nuit où tout a failli s’effondrer',
      'J’ai été arnaqué en ligne, voici ce que j’ai appris'
    ]
  },
  {
    emoji: '💄',
    name: 'Beauté',
    color: 'from-pink-400 to-rose-500',
    tags: ['#beaute', '#skincare', '#astucebeaute'],
    ideas: [
      'La routine skincare à 15€ qui fonctionne vraiment',
      'Le produit que les esthéticiennes ne veulent pas que tu connaisses',
      'J’ai testé le « no poo » pendant 60 jours (résultat choquant)',
      'L’erreur de maquillage qui te vieillit de 10 ans',
      'Les produits de pharmacie qui rivalisent avec le luxe'
    ]
  },
  {
    emoji: '🏋️',
    name: 'Fitness',
    color: 'from-emerald-400 to-teal-600',
    tags: ['#fitness', '#sport', '#bienetre'],
    ideas: [
      'Je n’ai pas fait de sport depuis 6 mois, voici ce qui s’est passé',
      'Le jeûne 16/8 expliqué simplement (et honnêtement)',
      'L’exercice de 10 minutes qui a changé mon dos',
      'Pourquoi tu ne perds pas de poids malgré tes efforts',
      'Manger des protéines comme un pro sans se ruiner'
    ]
  },
  {
    emoji: '🍳',
    name: 'Cuisine',
    color: 'from-orange-400 to-amber-600',
    tags: ['#cuisine', '#recette', '#food'],
    ideas: [
      'Le dîner à 2€ que tu peux faire ce soir',
      'L’astuce du chef pour des pâtes parfaites à chaque fois',
      'J’ai cuisiné comme ma grand-mère pendant une semaine',
      'Le dessert en 3 ingrédients qui impressionne tout le monde',
      'L’erreur qui rend tes plats fades sans que tu le saches'
    ]
  },
  {
    emoji: '💶',
    name: 'Finance',
    color: 'from-lime-400 to-emerald-600',
    tags: ['#finance', '#investissement', '#conseils'],
    ideas: [
      'J’ai investi 100€ et voici ce que j’ai appris',
      'Le piège des crédits que personne n’explique',
      'Budget 50/30/20 : la méthode qui change tout',
      '3 erreurs financières des moins de 30 ans',
      'Comment négocier son salaire (et obtenir +15%)'
    ]
  }
]

const BEST_TIMES = [
  {
    platform: 'TikTok',
    emoji: '🎵',
    color: 'from-fuchsia-500 to-purple-600',
    window: '19h – 22h',
    secondary: 'Créneau secondaire : 12h – 14h',
    advice:
      'Poste après le pic de 19h : les utilisateurs scrollent massivement en soirée. Le midi fonctionne pour les employés au bureau.',
    strength: 92
  },
  {
    platform: 'Reels',
    emoji: '📸',
    color: 'from-pink-400 to-rose-600',
    window: '11h – 13h',
    secondary: 'Créneau secondaire : 19h – 21h',
    advice:
      'Instagram favorise la pause déjeuner et le soir. Une re-publication le lendemain sur le bon créneau relance le reach.',
    strength: 85
  },
  {
    platform: 'Shorts',
    emoji: '▶️',
    color: 'from-red-500 to-rose-600',
    window: '17h – 20h',
    secondary: 'Créneau secondaire : weekend matin',
    advice:
      'YouTube a un pic en fin de journée et un fort trafic le samedi matin. Publier à heure régulière aide l’algorithme.',
    strength: 88
  }
]

const VIRAL_FORMATS = [
  { emoji: '📅', name: 'Day in the Life', desc: 'Une journée de vie accélérée, rythmée par la voix off.' },
  { emoji: '🎬', name: 'POV', desc: 'Point de vue immersif : « POV : tu viens de décrocher ton premier client ».' },
  { emoji: '🆚', name: 'Toi vs Moi', desc: 'Contraste entre la méthode facile et la méthode efficace.' },
  { emoji: '🔄', name: 'Avant / Après', desc: 'Transformation choc, le visuel parle tout seul.' },
  { emoji: '❌', name: 'Les 3 erreurs', desc: 'Liste punchy d’erreurs que tout le monde commet.' },
  { emoji: '⚡', name: 'Q&A éclair', desc: '3 questions / réponses rapides, rythme très soutenu.' },
  { emoji: '📖', name: 'Chapter 1 / Partie 2', desc: 'Storytime à épisodes qui pousse à s’abonner pour la suite.' },
  { emoji: '🏆', name: 'Le défi', desc: 'Lance un défi à la communauté : commentaires et duos garantis.' },
  { emoji: '⏱️', name: 'Récap en 60 s', desc: 'Tout ce qu’il faut savoir sur un sujet, ultra dense.' },
  { emoji: '🤫', name: 'Le secret', desc: '« Ce que personne ne te dit sur X » : curiosity gap maximal.' }
]

const RESOURCES = [
  {
    title: 'Montage CapCut : le guide complet pour TikTok',
    channel: '@FormationMontage',
    duration: '12:45',
    desc: 'Sous-titres automatiques, zoomin et transitions qui retiennent le spectateur.',
    url: 'https://www.youtube.com/results?search_query=tutoriel+montage+capcut+tiktok+francais',
    grad: 'from-fuchsia-500 via-purple-600 to-slate-900'
  },
  {
    title: 'Rétention TikTok : garder le spectateur jusqu’à la fin',
    channel: '@AlgorithmeAcademy',
    duration: '9:20',
    desc: 'Les 3 leviers de rétention et les erreurs qui tuent tes vidéos.',
    url: 'https://www.youtube.com/results?search_query=retention+tiktok+garder+spectateur+tutoriel',
    grad: 'from-cyan-400 via-blue-600 to-slate-900'
  },
  {
    title: 'L’algorithme YouTube Shorts décodé',
    channel: '@CreatorLab',
    duration: '15:02',
    desc: 'Comment le classement fonctionne et comment être proposé à plus de monde.',
    url: 'https://www.youtube.com/results?search_query=algorithme+youtube+shorts+fonctionnement',
    grad: 'from-rose-600 via-red-500 to-slate-900'
  },
  {
    title: 'Storytelling viral : la structure en 3 actes',
    channel: '@StorytellerFR',
    duration: '11:38',
    desc: 'Construis des histoires qui captivent dès la première seconde.',
    url: 'https://www.youtube.com/results?search_query=storytelling+viral+tiktok+structure',
    grad: 'from-amber-400 via-rose-500 to-fuchsia-600'
  },
  {
    title: 'Sous-titres style CapCut en 5 minutes',
    channel: '@QuickTutos',
    duration: '5:15',
    desc: 'Le style de sous-titres qui booste ta rétention sur mobile.',
    url: 'https://www.youtube.com/results?search_query=sous-titre+automatique+capcut+style+tiktok',
    grad: 'from-emerald-400 via-teal-500 to-cyan-600'
  },
  {
    title: 'Hook : la science des 3 premières secondes',
    channel: '@GrowthVideo',
    duration: '8:44',
    desc: 'Pourquoi tes hooks ne fonctionnent pas et comment les réécrire.',
    url: 'https://www.youtube.com/results?search_query=hook+3+premieres+secondes+tiktok',
    grad: 'from-violet-500 via-purple-600 to-fuchsia-600'
  }
]

function seedFromString(input) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export default function TendancesPage() {
  const [lot, setLot] = useState(0)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit gap-1.5 border-primary-30 bg-primary-10 text-primary">
          <Flame className="size-3" />
          Mis à jour aujourd&apos;hui
        </Badge>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Idées &amp; Tendances
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Des sujets viraux du moment par niche, et les meilleures formations YouTube pour passer
          au niveau supérieur.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="flex flex-col gap-4 lg:col-span-8">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <TrendingUp className="size-3 text-primary" />
              Idées virales du jour
            </span>
            <Button variant="outline" size="sm" onClick={() => setLot((l) => l + 1)}>
              <RefreshCw data-icon="inline-start" />
              Nouveau lot
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {NICHES.map((niche, n) => {
              const seed = seedFromString(niche.name + lot)
              const offset = seed % niche.ideas.length
              const rotated = [
                ...niche.ideas.slice(offset),
                ...niche.ideas.slice(0, offset)
              ].slice(0, 4)
              const viral = 58 + (seed % 40)
              return (
                <Card key={niche.name} className="glass premium-edge">
                  <CardHeader className="flex flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-base ${niche.color}`}
                      >
                        {niche.emoji}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">{niche.name}</CardTitle>
                        <div className="flex items-center gap-1.5">
                          {niche.tags.map((t) => (
                            <span key={t} className="font-mono text-[10px] text-muted-foreground">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-xs font-medium text-primary">{viral}</span>
                      <Progress value={viral} gradient className="h-1 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ol className="flex flex-col gap-2">
                      {rotated.map((idea) => (
                        <li
                          key={idea}
                          className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-0.5 font-mono text-[11px] font-medium text-primary">
                            {String(niche.ideas.indexOf(idea) + 1).padStart(2, '0')}
                          </span>
                          <span className="line-clamp-2">{idea}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4 lg:col-span-4">
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <Clock className="size-3 text-primary" />
            Meilleurs horaires de publication
          </span>
          <div className="grid grid-cols-1 gap-4">
            {BEST_TIMES.map((bt) => (
              <Card key={bt.platform} className="glass premium-edge">
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <span>{bt.emoji}</span>
                      {bt.platform}
                    </span>
                    <span className="font-mono text-[10px] text-primary">{bt.strength}/100</span>
                  </div>
                  <div
                    className={`rounded-lg bg-gradient-to-br px-3 py-2.5 text-center text-lg font-bold text-white ${bt.color}`}
                  >
                    {bt.window}
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{bt.secondary}</span>
                  <p className="text-xs leading-relaxed text-muted-foreground">{bt.advice}</p>
                  <Progress value={bt.strength} gradient className="h-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <section className="flex flex-col gap-4">
        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <Sparkles className="size-3 text-primary" />
          Formats viraux du moment
        </span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {VIRAL_FORMATS.map((f) => (
            <div
              key={f.name}
              className="lift premium-edge flex flex-col gap-1.5 rounded-lg border border-border-60 bg-card-60 p-3.5 transition-colors hover:border-primary-40"
            >
              <span className="text-xl">{f.emoji}</span>
              <span className="text-sm font-semibold text-foreground">{f.name}</span>
              <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <Flame className="size-3 text-primary" />
          Ressources &amp; Formations
        </span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lift premium-edge group flex flex-col gap-3 rounded-lg border border-border-60 bg-card-60 p-4 transition-colors hover:border-primary-40"
            >
              <div
                className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${r.grad}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.22),transparent_55%)]" />
                <div className="flex size-10 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <Play className="size-4 fill-white text-white" />
                </div>
                <span className="absolute right-1.5 bottom-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
                  {r.duration}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="line-clamp-2 text-sm leading-snug font-medium text-foreground">
                  {r.title}
                </span>
                <span className="text-xs text-muted-foreground">{r.channel}</span>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-primary">
                Regarder sur YouTube
                <ExternalLink className="size-3" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
