import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Sun, Moon, Globe } from 'lucide-react'

interface LanguageThemeSwitcherProps {
  className?: string
  compact?: boolean
}

export function LanguageThemeSwitcher({ className, compact = false }: LanguageThemeSwitcherProps) {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(newLang)
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <button
          onClick={toggleLanguage}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)] hover:text-[var(--accent-cyan)]"
          title={t('common.language')}
        >
          <Globe className="w-4 h-4" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)] hover:text-[var(--accent-cyan)]"
          title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Language Switcher */}
      <div className="flex items-center rounded-lg border border-[var(--border-color)] overflow-hidden">
        <button
          onClick={() => i18n.changeLanguage('en')}
          className={cn(
            'px-3 py-1.5 text-xs font-medium transition-colors',
            i18n.language === 'en'
              ? 'bg-[var(--accent-cyan)] text-black'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
          )}
        >
          EN
        </button>
        <button
          onClick={() => i18n.changeLanguage('zh')}
          className={cn(
            'px-3 py-1.5 text-xs font-medium transition-colors',
            i18n.language === 'zh'
              ? 'bg-[var(--accent-cyan)] text-black'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
          )}
        >
          中文
        </button>
      </div>

      {/* Theme Switcher */}
      <button
        onClick={toggleTheme}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-color)]',
          'text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)]',
          'transition-all'
        )}
        title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
      >
        {theme === 'dark' ? (
          <>
            <Sun className="w-4 h-4" />
            <span className="text-xs">{t('common.lightMode')}</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4" />
            <span className="text-xs">{t('common.darkMode')}</span>
          </>
        )}
      </button>
    </div>
  )
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation()

  return (
    <div className={cn('flex items-center rounded-lg border border-[var(--border-color)] overflow-hidden', className)}>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={cn(
          'px-3 py-1.5 text-xs font-medium transition-colors',
          i18n.language === 'en'
            ? 'bg-[var(--accent-cyan)] text-black'
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
        )}
      >
        EN
      </button>
      <button
        onClick={() => i18n.changeLanguage('zh')}
        className={cn(
          'px-3 py-1.5 text-xs font-medium transition-colors',
          i18n.language === 'zh'
            ? 'bg-[var(--accent-cyan)] text-black'
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
        )}
      >
        中文
      </button>
    </div>
  )
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-lg border border-[var(--border-color)]',
        'text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)]',
        'transition-all',
        className
      )}
      title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
