import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { Tooltip } from './ui/tooltip'
import { useApp } from '../lib/app-context'

export function ThemeToggle() {
  const { theme, setTheme } = useApp()
  const isDark = theme === 'dark'

  return (
    <Tooltip content={isDark ? 'Thème clair' : 'Thème sombre'}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
      >
        {isDark ? <Sun /> : <Moon />}
      </Button>
    </Tooltip>
  )
}