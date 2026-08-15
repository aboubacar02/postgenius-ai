import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { toast } from '../ui/sonner'
import { Globe, LogIn, LogOut, Settings, Sparkles, User, Zap } from 'lucide-react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu'
import { ThemeToggle } from '../theme-toggle'
import { GradientAvatar } from '../media/gradient-avatar'
import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Studio', end: true },
  { href: '/tendances', label: 'Trending' },
  { href: '/historique', label: 'History' },
  { href: '/tarifs', label: 'Wallet' },
  { href: '/parametres', label: 'Profile' }
]

export function Topbar() {
  const navigate = useNavigate()
  const { user, creditsLeft, creditsTotal, logout } = useApp()
  const [lang, setLang] = useState('FR')
  const display = user || { name: 'Camille Aubert', email: 'camille.aubert@postgenius.ai', initials: 'CA', plan: 'Starter' }

  return (
    <header className="fixed top-0 z-40 w-full border-b border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary-15 text-primary">
            <Sparkles className="size-4" />
          </span>
          <span className="font-heading text-[18px] font-extrabold tracking-tight text-primary">
            PostGenius AI
          </span>
        </Link>

        {/* Desktop Nav — pills Stitch */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95',
                  isActive
                    ? 'bg-primary/10 font-bold text-primary'
                    : 'text-muted-foreground hover:bg-surface-variant/50 hover:text-primary'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => setLang((l) => (l === 'FR' ? 'EN' : 'FR'))}
            aria-label="Changer de langue"
          >
            <Globe data-icon="inline-start" />
            {lang}
          </Button>

          <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-card/60 px-3 py-1.5 backdrop-blur-md md:flex">
            <Zap className="size-3.5 text-warning" />
            <span className="font-mono text-[12px] font-medium tracking-wider text-muted-foreground">
              {Math.min(creditsLeft, creditsTotal)} / {creditsTotal} crédits
            </span>
          </div>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon-sm" aria-label="Menu du compte">
                <GradientAvatar initials={display.initials} className="size-6 text-[10px]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="truncate text-sm font-medium text-foreground">{display.name}</p>
                <p className="truncate text-xs text-muted-foreground">{display.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user ? (
                <>
                  <DropdownMenuItem onClick={() => navigate('/parametres')}>
                    <User />
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/parametres')}>
                    <Settings />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-muted-foreground hover:bg-destructive-10 hover:text-destructive"
                    onClick={() => {
                      logout()
                      toast.success('Déconnexion réussie')
                    }}
                  >
                    <LogOut />
                    Déconnexion
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate('/parametres')}>
                  <LogIn />
                  Se connecter / Créer un compte
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
