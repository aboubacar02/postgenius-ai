import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { History, LogOut, Menu, Plus, Search, Settings, Sparkles, Zap } from 'lucide-react'
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
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-white/[0.08] bg-[#090A0F]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-3 px-4 md:px-8">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <Link to="/" className="pg-brand flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 text-white shadow-[0_0_16px_rgba(56,189,248,0.4)]">
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
              className="hidden h-9 w-[240px] items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] backdrop-blur-xl px-3.5 text-left text-xs text-zinc-400 transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/[0.06] hover:text-zinc-200 hover:shadow-[0_0_16px_rgba(56,189,248,0.12)] md:flex"
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
              className="pg-button-primary hidden sm:inline-flex items-center gap-1.5 rounded-pg bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all hover:shadow-[0_0_32px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="size-4" />
              Nouvelle vidéo
            </button>

            {/* AVATAR + LOGOUT */}
            {display ? (
              <>
                <button
                  type="button"
                  onClick={() => logout?.()}
                  title="Déconnexion"
                  className="flex h-9 items-center gap-1.5 rounded-pg border border-red-500/20 bg-red-500/10 px-2.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                >
                  <LogOut className="size-3.5" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-xs font-bold text-white transition-all hover:ring-2 hover:ring-indigo-500/40 cursor-pointer">
                      {display.initials}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 border-white/[0.1] bg-[#0d0f16]/95 backdrop-blur-xl shadow-[0_0_24px_rgba(99,102,241,0.15)]">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-zinc-100">{user?.user_metadata?.full_name || user?.name || 'Utilisateur'}</span>
                        <span className="text-xs text-zinc-500">{user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/[0.06]" />
                    <DropdownMenuItem onClick={() => navigate('/historique')} className="gap-2 text-zinc-400 focus:bg-white/[0.06] focus:text-zinc-200">
                      <History className="size-4" />
                      Historique
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/parametres')} className="gap-2 text-zinc-400 focus:bg-white/[0.06] focus:text-zinc-200">
                      <Settings className="size-4" />
                      Paramètres
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/[0.06]" />
                    <DropdownMenuItem onClick={() => logout?.()} className="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400">
                      <LogOut className="size-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
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
