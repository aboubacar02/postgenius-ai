import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Clapperboard,
  Flame,
  Gauge,
  History,
  Languages,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  Video,
  Wallet,
  X
} from 'lucide-react'
import { useApp } from '../../lib/app-context'
import { useI18n, LANGUAGES } from '../../lib/i18n'
import { cn } from '../../lib/utils'

export function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate()
  const { theme, setTheme } = useApp()
  const { t, lang, setLang } = useI18n()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange((prev) => !prev)
      } else if (e.key === 'Escape' && open) {
        e.preventDefault()
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  useEffect(() => {
    if (open) {
      setSearch('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const actions = [
    {
      id: 'gen-script',
      category: 'Studios & Création',
      icon: Sparkles,
      title: 'Créer un Script Viral',
      desc: 'Générateur IA multi-plateformes',
      shortcut: 'G',
      action: () => navigate('/generateur')
    },
    {
      id: 'gen-faceless',
      category: 'Studios & Création',
      icon: Clapperboard,
      title: 'Studio Vidéo Faceless',
      desc: 'Timeline multipiste et voix Edge TTS',
      shortcut: 'F',
      action: () => navigate('/faceless')
    },
    {
      id: 'score-hook',
      category: 'Studios & Création',
      icon: Gauge,
      title: 'Diagnostic Hook & Rétention',
      desc: 'Simulateur de chute de rétention',
      shortcut: 'S',
      action: () => navigate('/score-viral')
    },
    {
      id: 'trends-radar',
      category: 'Studios & Création',
      icon: Flame,
      title: 'Tendances & Niches Virales',
      desc: 'Idées de contenu par niche',
      shortcut: 'T',
      action: () => navigate('/tendances')
    },
    {
      id: 'nav-dash',
      category: 'Navigation',
      icon: Video,
      title: 'Tableau de Bord',
      desc: 'Vue d\'ensemble des performances',
      shortcut: 'D',
      action: () => navigate('/')
    },
    {
      id: 'nav-hist',
      category: 'Navigation',
      icon: History,
      title: 'Historique des Scripts',
      desc: 'Tous vos scripts enregistrés',
      shortcut: 'H',
      action: () => navigate('/historique')
    },
    {
      id: 'nav-pricing',
      category: 'Navigation',
      icon: Wallet,
      title: 'Forfaits & Crédits Pro',
      desc: 'Cartes bancaires et Mobile Money',
      shortcut: 'P',
      action: () => navigate('/tarifs')
    },
    {
      id: 'nav-settings',
      category: 'Navigation',
      icon: Settings,
      title: 'Paramètres du Compte',
      desc: 'Profil, clé API et parrainage',
      shortcut: ',',
      action: () => navigate('/parametres')
    },
    {
      id: 'act-theme',
      category: 'Préférences',
      icon: theme === 'dark' ? Sun : Moon,
      title: theme === 'dark' ? 'Mode Clair' : 'Mode Sombre',
      desc: 'Basculer l\'ambiance',
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark')
    },
    {
      id: 'act-lang',
      category: 'Préférences',
      icon: Languages,
      title: `Langue (${lang.toUpperCase()})`,
      desc: 'Basculer entre les langues',
      action: () => {
        const next = lang === 'fr' ? 'en' : lang === 'en' ? 'es' : lang === 'es' ? 'de' : 'fr'
        setLang(next)
      }
    }
  ]

  const filtered = actions.filter((item) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  })

  function handleSelect(item) {
    onOpenChange(false)
    item.action()
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault()
      handleSelect(filtered[selectedIndex])
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-pg-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md/95 shadow-pg-lg modal-glow flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="relative flex items-center border-b border-white/[0.06] px-5 py-4">
          <Search className="size-5 text-primary shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher une action, un studio..."
            className="w-full bg-transparent text-base font-medium text-pg-text placeholder:text-pg-subtle outline-none"
          />
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-pg-muted hover:bg-white/[0.06] hover:text-pg-text transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Action Results */}
        <div className="max-h-[380px] overflow-y-auto p-3 flex flex-col gap-1 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-pg-muted">
              Aucun résultat pour <span className="font-semibold text-pg-text">« {search} »</span>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const active = idx === selectedIndex
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'group flex items-center justify-between gap-3 rounded-pg-lg px-4 py-3 text-left transition-all',
                    active
                      ? 'bg-primary/15 text-pg-text border border-primary/20'
                      : 'text-pg-muted hover:bg-white/[0.04] border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                        active ? 'bg-primary text-white' : 'bg-white/[0.04] text-pg-muted group-hover:text-primary'
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className={cn('text-sm font-semibold truncate', active ? 'text-pg-text font-bold' : 'text-pg-text/90')}>
                        {item.title}
                      </span>
                      <span className="text-xs text-pg-muted truncate">{item.desc}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] font-bold text-pg-muted">
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={cn('size-4 transition-transform', active ? 'text-primary translate-x-0.5' : 'text-transparent')} />
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/20 px-5 py-3 text-xs text-pg-muted">
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5">↑↓</kbd> Naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5">Entrée</kbd> Valider
            </span>
          </div>
          <span className="font-mono text-[11px] text-primary">PostGenius Studio</span>
        </div>
      </div>
    </div>
  )
}
