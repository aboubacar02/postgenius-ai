'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import {
  Gauge,
  Globe,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { CURRENT_USER } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/generateur', label: 'Générateur', icon: Sparkles },
  { href: '/score-viral', label: 'Score viral', icon: Gauge },
  { href: '/historique', label: 'Historique', icon: History },
  { href: '/tarifs', label: 'Tarifs', icon: Wallet },
  { href: '/parametres', label: 'Paramètres', icon: Settings },
] as const

const PAGE_TITLES: Record<string, string> = {
  '/': 'Tableau de bord',
  '/generateur': 'Générateur de scénario',
  '/score-viral': 'Score viral',
  '/historique': 'Historique',
  '/tarifs': 'Tarifs',
  '/parametres': 'Paramètres',
}

export function Topbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<'FR' | 'EN'>('FR')
  const title = PAGE_TITLES[pathname] ?? 'PostGenius AI'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl lg:pl-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="size-4" />
            </div>
            <span className="font-heading text-[15px] font-bold tracking-tight">
              PostGenius <span className="text-primary">AI</span>
            </span>
          </div>
          <nav className="flex flex-col gap-0.5 px-3 py-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors',
                    active
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted/60 hover:text-foreground',
                  )}
                >
                  <Icon className={cn('size-4', active && 'text-primary')} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </SheetContent>

        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </Button>
      </Sheet>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <h1 className="truncate font-heading text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

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

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Menu du compte">
              <span className="flex size-6 items-center justify-center rounded-full bg-muted font-mono text-[11px] font-medium text-foreground">
                {CURRENT_USER.initials}
              </span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="truncate text-sm font-medium text-foreground">{CURRENT_USER.name}</p>
            <p className="truncate text-xs text-muted-foreground">{CURRENT_USER.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => (window.location.href = '/parametres')}>
              <User />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = '/parametres')}>
              <Settings />
              Paramètres
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => toast.success('Déconnexion simulée — aucune session réelle n’est active.')}
          >
            <LogOut />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
