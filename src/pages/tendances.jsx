import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Clock,
  Eye,
  ExternalLink,
  Flame,
  Info,
  Loader2,
  Music,
  Play,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  Video,
  X
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { AudioTrendsLibrary } from '../components/media/audio-trends-library'
import { useI18n } from '../lib/i18n'
import { searchYoutube } from '../services/youtube'

export const NICHES = [
  {
    emoji: '💻',
    name: 'Tech',
    color: 'from-cyan-400 to-blue-600',
    tags: ['#tech', '#astuce', '#viral'],
    ideas: [
      '3 applis gratuites qui valent de l\'or en 2026 (tu les ignores sûrement)',
      'Pourquoi ton téléphone ralentit chaque année — et comment l\'éviter',
      'L\'erreur que tout le monde fait avec son stockage',
      'J\'ai testé l\'IA qui gère mes e-mails pendant 30 jours',
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
      'J\'ai facturé 1000€ mon premier client freelance (voici comment)',
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
      'J\'ai livré des pizzas pour rembourser mes dettes (histoire vraie)',
      'Le client qui a changé ma vie en 5 minutes',
      'J\'ai rencontré mon patron par hasard en vacances',
      'La nuit où tout a failli s\'effondrer',
      'J\'ai été arnaqué en ligne, voici ce que j\'ai appris'
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
      'J\'ai testé le « no poo » pendant 60 jours (résultat choquant)',
      'L\'erreur de maquillage qui te vieillit de 10 ans',
      'Les produits de pharmacie qui rivalisent avec le luxe'
    ]
  },
  {
    emoji: '🏋️',
    name: 'Fitness',
    color: 'from-emerald-400 to-teal-600',
    tags: ['#fitness', '#sport', '#bienetre'],
    ideas: [
      'Je n\'ai pas fait de sport depuis 6 mois, voici ce qui s\'est passé',
      'Le jeûne 16/8 expliqué simplement (et honnêtement)',
      'L\'exercice de 10 minutes qui a changé mon dos',
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
      'L\'astuce du chef pour des pâtes parfaites à chaque fois',
      'J\'ai cuisiné comme ma grand-mère pendant une semaine',
      'Le dessert en 3 ingrédients qui impressionne tout le monde',
      'L\'erreur qui rend tes plats fades sans que tu le saches'
    ]
  },
  {
    emoji: '💶',
    name: 'Finance',
    color: 'from-lime-400 to-emerald-600',
    tags: ['#finance', '#investissement', '#conseils'],
    ideas: [
      'J\'ai investi 100€ et voici ce que j\'ai appris',
      'Le piège des crédits que personne n\'explique',
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
      'YouTube a un pic en fin de journée et un fort trafic le samedi matin. Publier à heure régulière aide l\'algorithme.',
    strength: 88
  }
]

const VIRAL_FORMATS = [
  { emoji: '📅', name: 'Day in the Life', desc: 'Une journée de vie accélérée, rythmée par la voix off.' },
  { emoji: '🎬', name: 'POV Immersion', desc: 'Point de vue immersif : « POV : tu viens de doubler tes revenus en 30 jours ».' },
  { emoji: '🆚', name: 'Toi vs Moi', desc: 'Contraste entre la méthode facile et la méthode ultra-efficace.' },
  { emoji: '🔄', name: 'Avant / Après', desc: 'Transformation choc, le visuel et les chiffres parlent tout seuls.' },
  { emoji: '❌', name: 'Les 3 Erreurs', desc: 'Liste punchy d\'erreurs méconnues qui détruisent la rétention.' },
  { emoji: '⚡', name: 'Q&A Éclair', desc: '3 questions / réponses rapides, rythme très soutenu.' },
  { emoji: '📖', name: 'Storytime Cliffhanger', desc: 'Storytime à épisodes qui force le spectateur à s\'abonner.' },
  { emoji: '🏆', name: 'Le Défi Viral', desc: 'Lance un défi à la communauté : commentaires et partages garantis.' },
  { emoji: '⏱️', name: 'Récap en 60 s', desc: 'Tout ce qu\'il faut savoir sur un sujet, ultra dense et actionnable.' },
  { emoji: '🤫', name: 'Le Secret Révélé', desc: '« Ce que personne ne te dit » : curiosity gap maximal dès 0.5s.' }
]

const RESOURCES = [
  {
    title: 'Montage CapCut : le guide complet pour TikTok',
    channel: '@FormationMontage',
    duration: '12:45',
    poster: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=720&auto=format&fit=crop&q=80',
    desc: 'Sous-titres automatiques, zoomin et transitions qui retiennent le spectateur.',
    url: 'https://www.youtube.com/results?search_query=tutoriel+montage+capcut+tiktok+francais',
    grad: 'from-fuchsia-500 via-purple-600 to-slate-900'
  },
  {
    title: 'Rétention TikTok : garder le spectateur jusqu\'à la fin',
    channel: '@AlgorithmeAcademy',
    duration: '9:20',
    poster: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=720&auto=format&fit=crop&q=80',
    desc: 'Les 3 leviers de rétention et les erreurs qui tuent tes vidéos.',
    url: 'https://www.youtube.com/results?search_query=retention+tiktok+garder+spectateur+tutoriel',
    grad: 'from-cyan-400 via-blue-600 to-slate-900'
  },
  {
    title: 'L\'algorithme YouTube Shorts décodé',
    channel: '@CreatorLab',
    duration: '15:02',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&auto=format&fit=crop&q=80',
    desc: 'Comment le classement fonctionne et comment être proposé à plus de monde.',
    url: 'https://www.youtube.com/results?search_query=algorithme+youtube+shorts+fonctionnement',
    grad: 'from-rose-600 via-red-500 to-slate-900'
  },
  {
    title: 'Storytelling viral : la structure en 3 actes',
    channel: '@StorytellerFR',
    duration: '11:38',
    poster: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=720&auto=format&fit=crop&q=80',
    desc: 'Construis des histoires qui captivent dès la première seconde.',
    url: 'https://www.youtube.com/results?search_query=storytelling+viral+tiktok+structure',
    grad: 'from-amber-400 via-rose-500 to-fuchsia-600'
  },
  {
    title: 'Sous-titres style CapCut en 5 minutes',
    channel: '@QuickTutos',
    duration: '5:15',
    poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=720&auto=format&fit=crop&q=80',
    desc: 'Le style de sous-titres qui booste ta rétention sur mobile.',
    url: 'https://www.youtube.com/results?search_query=sous-titre+automatique+capcut+style+tiktok',
    grad: 'from-emerald-400 via-teal-500 to-cyan-600'
  },
  {
    title: 'Hook : la science des 3 premières secondes',
    channel: '@GrowthVideo',
    duration: '8:44',
    poster: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=720&auto=format&fit=crop&q=80',
    desc: 'Pourquoi tes hooks ne fonctionnent pas et comment les réécrire.',
    url: 'https://www.youtube.com/results?search_query=hook+3+premieres+secondes+tiktok',
    grad: 'from-violet-500 via-purple-600 to-fuchsia-600'
  }
]

const VIRAL_VIDEOS = [
  {
    id: 'bunny',
    youtubeId: 'aqz-KE-bpKQ',
    title: 'Storytime : le jour où tout a changé',
    channel: '@BlenderMovie',
    duration: '9:56',
    poster: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
    views: '12 M',
    grad: 'from-amber-400 to-orange-500',
    niche: 'Storytime'
  },
  {
    id: 'spring',
    youtubeId: 'WhWc3b3KhnY',
    title: 'Spring — l\'émotion en 8 minutes',
    channel: '@BlenderMovie',
    duration: '7:43',
    poster: 'https://i.ytimg.com/vi/WhWc3b3KhnY/hqdefault.jpg',
    views: '4,1 M',
    grad: 'from-rose-500 to-pink-600',
    niche: 'Storytime'
  },
  {
    id: 'coffee',
    youtubeId: 'Y-rmzh0PI3c',
    title: 'Coffee Run — le format court qui inspire',
    channel: '@BlenderMovie',
    duration: '3:02',
    poster: 'https://i.ytimg.com/vi/Y-rmzh0PI3c/hqdefault.jpg',
    views: '9,3 M',
    grad: 'from-lime-400 to-emerald-600',
    niche: 'Short'
  },
  {
    id: 'sintel',
    youtubeId: 'eRsGyueVLvQ',
    title: 'Sintel — le voyage qui change tout',
    channel: '@BlenderMovie',
    duration: '14:48',
    poster: 'https://i.ytimg.com/vi/eRsGyueVLvQ/hqdefault.jpg',
    views: '5,4 M',
    grad: 'from-cyan-400 to-blue-600',
    niche: 'Narration'
  },
  {
    id: 'tears',
    youtubeId: 'R6MlUcmOul8',
    title: 'Tears of Steel — la SF qui casse les codes',
    channel: '@BlenderMovie',
    duration: '12:14',
    poster: 'https://i.ytimg.com/vi/R6MlUcmOul8/hqdefault.jpg',
    views: '3,2 M',
    grad: 'from-emerald-400 to-teal-600',
    niche: 'Cinéma'
  },
  {
    id: 'dream',
    youtubeId: 'TLkA0RELQ1g',
    title: 'Elephants Dream — l\'histoire derrière la 3D',
    channel: '@BlenderMovie',
    duration: '10:53',
    poster: 'https://i.ytimg.com/vi/TLkA0RELQ1g/hqdefault.jpg',
    views: '6,8 M',
    grad: 'from-fuchsia-500 to-purple-600',
    niche: 'Cinéma'
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
  const { t } = useI18n()
  const [lot, setLot] = useState(0)
  const [activeVideo, setActiveVideo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [liveMode, setLiveMode] = useState(false)
  const [liveResults, setLiveResults] = useState([])
  const [searchNotice, setSearchNotice] = useState('')

  async function runSearch() {
    const q = searchQuery.trim()
    if (!q || searching) return
    setSearching(true)
    setSearchNotice('')
    try {
      const data = await searchYoutube(q)
      if (data.live && data.items.length > 0) {
        setLiveResults(data.items)
        setLiveMode(true)
      } else if (data.live) {
        setSearchNotice(t('trending.noResults'))
      } else {
        setSearchNotice(t('trending.noKey'))
      }
    } catch {
      setSearchNotice(t('trending.noKey'))
    } finally {
      setSearching(false)
    }
  }

  function resetSearch() {
    setLiveMode(false)
    setLiveResults([])
    setSearchQuery('')
    setSearchNotice('')
  }

  useEffect(() => {
    if (!activeVideo) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveVideo(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeVideo])

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-4 pb-16 pt-4 sm:px-8">
      {/* Header — standard pattern */}
      <div className="reveal flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Flame className="size-3.5" />
          </span>
          <span className="eyebrow text-primary">
            {t('trending.updated')}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-pg-text">
          {t('trending.title')}
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-pg-muted">
          {t('trending.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Niche ideas */}
        <section className="flex flex-col gap-4 lg:col-span-8">
          <div className="reveal-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-pg-muted">
              <TrendingUp className="size-3 text-primary" />
              {t('trending.ideasToday')}
            </span>
            <Button variant="outline" size="sm" onClick={() => setLot((l) => l + 1)} className="rounded-xl border-white/[0.06] bg-white/[0.04] font-semibold">
              <RefreshCw data-icon="inline-start" />
              {t('trending.newBatch')}
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
                <Card
                  key={niche.name}
                  className="reveal border border-white/[0.06] bg-pg-surface rounded-xl"
                  style={{ animationDelay: `${n * 50 + 100}ms` }}
                >
                  <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 pb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-base ${niche.color}`}
                      >
                        {niche.emoji}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">{niche.name}</CardTitle>
                        <div className="flex items-center gap-1.5">
                          {niche.tags.map((t) => (
                            <span key={t} className="font-mono text-[10px] text-pg-muted">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="rounded-full border border-primary/30 bg-primary/15 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                        {viral}
                      </span>
                      <Progress value={viral} gradient className="h-1 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <ol className="flex flex-col gap-2">
                      {rotated.map((idea) => (
                        <li
                          key={idea}
                          className="flex items-start gap-2 text-sm leading-relaxed text-pg-muted"
                        >
                          <span className="mt-0.5 font-mono text-[11px] font-bold text-primary">
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

        {/* Best times sidebar */}
        <section className="flex flex-col gap-4 lg:col-span-4">
          <span className="reveal-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-pg-muted">
            <Clock className="size-3 text-primary" />
            {t('trending.bestTimes')}
          </span>
          <div className="grid grid-cols-1 gap-4">
            {BEST_TIMES.map((bt, i) => (
              <Card
                key={bt.platform}
                className="reveal border border-white/[0.06] bg-pg-surface rounded-xl"
                style={{ animationDelay: `${i * 60 + 150}ms` }}
              >
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-pg-text">
                      <span>{bt.emoji}</span>
                      {bt.platform}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-primary">{bt.strength}/100</span>
                  </div>
                  <div
                    className={`rounded-xl bg-gradient-to-br px-3 py-2.5 text-center text-lg font-bold text-white ${bt.color}`}
                  >
                    {bt.window}
                  </div>
                  <span className="text-[11px] font-semibold text-pg-muted">{bt.secondary}</span>
                  <p className="text-xs leading-relaxed text-pg-muted">{bt.advice}</p>
                  <Progress value={bt.strength} gradient className="h-1.5" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Videos section */}
      <section className="flex flex-col gap-4">
        <div className="reveal-2 flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-pg-muted">
            <Play className="size-3 text-primary" />
            {t('trending.videos')}
          </span>
          <p className="text-xs text-pg-muted">{t('trending.videosDesc')}</p>
        </div>

        <form
          className="reveal-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            runSearch()
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-pg-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('trending.searchPlaceholder')}
              className="h-11 w-full rounded-xl border border-white/[0.04] bg-white/[0.03] pl-10 pr-3 text-sm text-pg-text outline-none backdrop-blur-sm transition-colors placeholder:text-pg-muted focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <Button type="submit" size="default" disabled={!searchQuery.trim() || searching} className="rounded-xl">
            {searching ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
            <span className="hidden sm:inline">{t('trending.search')}</span>
          </Button>
          {liveMode && (
            <Button type="button" variant="outline" size="icon" onClick={resetSearch} aria-label={t('trending.clearSearch')} className="rounded-xl">
              <X className="size-4" />
            </Button>
          )}
        </form>

        {liveMode && (
          <span className="flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-2.5 py-1 text-[10px] font-bold text-primary">
            <Video className="size-3" />
            {t('trending.liveBadge')}
          </span>
        )}
        {searchNotice && !liveMode && (
          <div className="flex items-center gap-1.5 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
            <Info className="size-3.5 shrink-0" />
            {searchNotice}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(liveMode ? liveResults : VIRAL_VIDEOS).map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveVideo(v)}
              className="reveal border border-white/[0.06] bg-pg-surface group flex flex-col gap-3 overflow-hidden rounded-xl p-3 text-left transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.06]"
              style={{ animationDelay: `${i * 50 + 200}ms` }}
            >
              <div
                className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl ${v.grad || 'bg-gradient-to-br from-slate-500 to-slate-700'}`}
              >
                <img
                  src={v.poster}
                  alt={v.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.15),transparent_55%)]" />
                <div className="flex size-12 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <Play className="size-5 fill-white text-white" />
                </div>
                {v.duration && (
                  <span className="absolute right-2 bottom-2 rounded-lg bg-black/70 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
                    {v.duration}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 px-1">
                <span className="line-clamp-2 text-sm leading-snug font-bold text-pg-text transition-colors group-hover:text-indigo-400">
                  {v.title}
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-pg-muted">{v.channel}</span>
                  {v.views && (
                    <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold text-primary">
                      <Eye className="size-3" />
                      {v.views}
                    </span>
                  )}
                </div>
                {v.niche && (
                  <span className="w-fit rounded-full border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-pg-muted">
                    {v.niche}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Viral formats */}
      <section className="flex flex-col gap-4">
        <span className="reveal flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-pg-muted">
          <Sparkles className="size-3 text-primary" />
          {t('trending.viralFormats')}
        </span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {VIRAL_FORMATS.map((f, i) => (
            <div
              key={f.name}
              className="reveal border border-white/[0.06] bg-pg-surface rounded-xl p-4 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 40 + 250}ms` }}
            >
              <span className="text-xl">{f.emoji}</span>
              <span className="mt-1 block text-sm font-bold text-pg-text">{f.name}</span>
              <p className="mt-1 text-xs leading-relaxed text-pg-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="flex flex-col gap-4">
        <span className="reveal flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-pg-muted">
          <Flame className="size-3 text-primary" />
          {t('trending.resources')}
        </span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r, i) => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal border border-white/[0.06] bg-pg-surface group flex flex-col gap-3 overflow-hidden rounded-xl p-4 transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.06]"
              style={{ animationDelay: `${i * 50 + 300}ms` }}
            >
              <div
                className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-zinc-950"
              >
                {r.poster && (
                  <img
                    src={r.poster}
                    alt={r.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="flex size-10 items-center justify-center rounded-full bg-black/50 ring-1 ring-white/30 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:ring-primary/50">
                  <Play className="size-4 fill-white text-white ml-0.5" />
                </div>
                <span className="absolute right-2 bottom-2 rounded-lg bg-black/80 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
                  {r.duration}
                </span>
              </div>
              <div className="flex flex-col gap-1 px-1">
                <span className="line-clamp-2 text-sm leading-snug font-bold text-pg-text transition-colors group-hover:text-indigo-400">
                  {r.title}
                </span>
                <span className="text-xs text-pg-muted">{r.channel}</span>
                <p className="line-clamp-2 text-xs leading-relaxed text-pg-muted">{r.desc}</p>
              </div>
              <span className="flex items-center gap-1 px-1 text-xs font-semibold text-primary">
                {t('trending.watch')}
                <ExternalLink className="size-3" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Audio Trends Library */}
      <section className="reveal flex flex-col gap-4">
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-pg-muted">
          <Music className="size-3 text-primary" />
          {t('trending.audioLibrary')}
        </span>
        <AudioTrendsLibrary />
      </section>

      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="fade-in-up w-full max-w-4xl overflow-hidden rounded-xl border border-white/[0.06] bg-pg-surface shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-bold text-pg-text">{activeVideo.title}</span>
                <span className="text-xs text-pg-muted">
                  {activeVideo.channel} · {activeVideo.views}
                </span>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setActiveVideo(null)} aria-label={t('trending.close')} className="rounded-xl">
                <X />
              </Button>
            </div>
            {activeVideo.youtubeId ? (
              <iframe
                key={activeVideo.id}
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&playsinline=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="aspect-video w-full border-0 bg-black"
              />
            ) : (
              <video
                key={activeVideo.id}
                src={activeVideo.src}
                poster={activeVideo.poster}
                controls
                autoPlay
                className="aspect-video w-full bg-black"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
