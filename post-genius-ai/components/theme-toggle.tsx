'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export type ThemeName = 'dark' | 'light'

/** Shared theme hook backed by the `dark` class on <html> + localStorage. */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>('dark')

  useEffect(() => {
    setThemeState(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  }, [])

  function setTheme(next: ThemeName) {
    setThemeState(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('pg-theme', next)
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }

  return { theme, setTheme }
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>
        }
      />
      <TooltipContent>{isDark ? 'Thème clair' : 'Thème sombre'}</TooltipContent>
    </Tooltip>
  )
}
