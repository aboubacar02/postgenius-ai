import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Plus, Search, Sparkles, Zap } from 'lucide-react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu'
import { GradientAvatar } from '../media/gradient-avatar'
import { AppDrawer } from './app-drawer'
import { useApp, isUnlimitedPlan } from '../../lib/app-context'
import { useI18n, LANGUAGES } from '../../lib/i18n'

export function Topbar({ onOpenCommandPalette }) {
  const navigate = useNavigate()
  const { user, creditsLeft, creditsTotal, plan, logout } = useApp()
  const { t, lang, setLang } = useI18n()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const display = user
  const currentLang = LANGUAGES.find((l) => l.id === lang) || LANGUAGES[0]

  return (
    <>
      <AppDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-white/[0.07] bg-pg-bg/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-3 px-4 md:px-8">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <Link to="/" className="pg-brand flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-500 text-white">
              <Sparkles className="size-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDrawerOpen(true)}
              aria-label={t('topbar.menu')}
            >
              <Menu />
            </Button>
          </div>

          <div className="hidden flex-1 md:block" />

          <div className="flex items-center gap-2">
            {/* SEARCH */}
            <button
              type="button"
              onClick={() => onOpenCommandPalette?.(true)}
              className="hidden h-9 w-[240px] items-center gap-2.5 rounded-full border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl px-3.5 text-left text-xs text-zinc-500 transition-all duration-200 hover:border-white/[0.15] hover:bg-zinc-800/60 hover:text-zinc-400 hover:shadow-lg hover:shadow-black/10 md:flex"
            >
              <Search className="size-3.5 text-zinc-600" />
              <span className="flex-1 font-medium">{t('topbar.search') || 'Rechercher...'}</span>
              <span className="flex items-center gap-0.5 rounded-md border border-white/[0.08] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-zinc-600">
                ⌘K
              </span>
            </button>

            {/* CREDITS */}
            <div className="hidden h-9 items-center gap-2 rounded-pg border border-white/[0.08] bg-white/[0.025] px-3 text-xs sm:flex">
              <Zap className="size-4 text-pg-amber" />
              <span className="font-medium text-pg-text">
                {isUnlimitedPlan(plan) ? '∞' : `${Math.min(creditsLeft, creditsTotal)} / ${creditsTotal}`}
              </span>
              <span className="text-pg-subtle">crédits</span>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/generateur')}
              className="pg-button-primary hidden sm:inline-flex items-center gap-1.5 rounded-pg bg-gradient-to-r from-primary to-purple-500 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="size-4" />
              Nouvelle vidéo
            </button>

            {/* AVATAR OR LOGIN */}
            {display ? (
              <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-xs font-bold text-white">
                {display.initials}
              </div>
            ) : (
              <Link to="/login" className="ml-1 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
