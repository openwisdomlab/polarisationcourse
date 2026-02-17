/**
 * AuthDialog - Login/Register modal
 * 两个标签页: 登录 / 注册
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './dialog'

type Tab = 'login' | 'register'

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  const { login, register, isLoading, error, clearError } = useAuthStore()

  const isDark = theme === 'dark'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let success: boolean
    if (tab === 'login') {
      success = await login(email, password)
    } else {
      success = await register(email, password, displayName)
    }
    if (success) {
      setEmail('')
      setPassword('')
      setDisplayName('')
      onOpenChange(false)
    }
  }

  const switchTab = (newTab: Tab) => {
    setTab(newTab)
    clearError()
  }

  const inputClass = cn(
    'w-full px-3 py-2 rounded-lg border text-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
    isDark
      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500',
  )

  const buttonClass = cn(
    'w-full py-2.5 rounded-lg font-medium text-sm transition-all',
    'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
    'hover:from-cyan-600 hover:to-blue-600',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'sm:max-w-[400px]',
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200',
        )}
      >
        <DialogHeader>
          <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            {tab === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
          </DialogTitle>
        </DialogHeader>

        {/* Tab switcher */}
        <div className={cn(
          'flex rounded-lg p-1',
          isDark ? 'bg-slate-800' : 'bg-slate-100',
        )}>
          {(['login', 'register'] as Tab[]).map((t_) => (
            <button
              key={t_}
              onClick={() => switchTab(t_)}
              className={cn(
                'flex-1 py-1.5 text-sm font-medium rounded-md transition-all',
                tab === t_
                  ? isDark
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'bg-white text-slate-900 shadow-sm'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-300'
                    : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {t_ === 'login' ? t('auth.login') : t('auth.register')}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <div>
              <label className={cn('block text-xs font-medium mb-1', isDark ? 'text-slate-300' : 'text-slate-600')}>
                {t('auth.displayName')}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass}
                placeholder={t('auth.displayNamePlaceholder')}
                required
                minLength={1}
                maxLength={50}
              />
            </div>
          )}

          <div>
            <label className={cn('block text-xs font-medium mb-1', isDark ? 'text-slate-300' : 'text-slate-600')}>
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder={t('auth.emailPlaceholder')}
              required
            />
          </div>

          <div>
            <label className={cn('block text-xs font-medium mb-1', isDark ? 'text-slate-300' : 'text-slate-600')}>
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder={t('auth.passwordPlaceholder')}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button type="submit" disabled={isLoading} className={buttonClass}>
            {isLoading
              ? '...'
              : tab === 'login'
                ? t('auth.loginButton')
                : t('auth.registerButton')}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
