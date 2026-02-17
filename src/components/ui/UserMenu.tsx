/**
 * UserMenu - Header user avatar/dropdown or login button
 * 用户菜单：未登录显示登录按钮，已登录显示头像和下拉菜单
 */

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { User, LogOut } from 'lucide-react'
import { AuthDialog } from './AuthDialog'

interface UserMenuProps {
  compact?: boolean
}

export function UserMenu({ compact = false }: UserMenuProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isDark = theme === 'dark'

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showDropdown])

  if (!isAuthenticated) {
    return (
      <>
        <button
          onClick={() => setShowAuthDialog(true)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
            isDark
              ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
              : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
          )}
        >
          <User className="w-4 h-4" />
          {!compact && t('auth.login')}
        </button>
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </>
    )
  }

  // Authenticated state
  const initials = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : '?'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={cn(
          'flex items-center gap-2 px-2 py-1 rounded-lg transition-all',
          isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100',
        )}
      >
        {/* Avatar */}
        <div className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
          'bg-gradient-to-br from-cyan-500 to-blue-500 text-white',
        )}>
          {initials}
        </div>
        {!compact && (
          <span className={cn(
            'text-sm font-medium max-w-[100px] truncate',
            isDark ? 'text-slate-200' : 'text-slate-700',
          )}>
            {user?.displayName}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className={cn(
          'absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border z-50',
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
        )}>
          {/* User info */}
          <div className={cn(
            'px-3 py-2 border-b',
            isDark ? 'border-slate-700' : 'border-slate-100',
          )}>
            <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>
              {user?.displayName}
            </p>
            <p className={cn('text-xs truncate', isDark ? 'text-slate-400' : 'text-slate-500')}>
              {user?.email}
            </p>
          </div>

          {/* Actions */}
          <div className="py-1">
            <button
              onClick={() => {
                logout()
                setShowDropdown(false)
              }}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors',
                isDark
                  ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <LogOut className="w-4 h-4" />
              {t('auth.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
