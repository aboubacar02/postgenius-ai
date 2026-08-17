import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { Tooltip } from './ui/tooltip'
import { useApp } from '../lib/app-context'
import { useI18n } from '../lib/i18n'

export function ThemeToggle() {
  const { theme, setTheme } = useApp()
  const { t } = useI18n()
  const isDark = theme === 'dark'

  return (
    <Tooltip content={isDark ? t('common.themeLight') : t('common.themeDark')}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label={isDark ? t('common.themeToLight') : t('common.themeToDark')}
      >
        {isDark ? <Sun /> : <Moon />}
      </Button>
    </Tooltip>
  )
}
