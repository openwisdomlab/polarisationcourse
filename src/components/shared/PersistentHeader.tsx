/**
 * PersistentHeader - 持久化顶部导航栏组件
 * Persistent header with PolarCraft logo and module-specific branding
 *
 * 设计理念：
 * - 左上角始终显示 PolarCraft 主 logo，点击返回首页
 * - 支持显示当前模块的图标和名称
 * - 与首页设计保持视觉一致性
 */

import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { PolarCraftLogo, ModuleIconMap, type ModuleIconKey } from '@/components/icons'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { UserMenu } from '@/components/ui/UserMenu'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

// Module configuration for color theming
const MODULE_THEMES: Record<string, {
  primary: string
  primaryLight: string
  gradient: string
  textDark: string
  textLight: string
}> = {
  chronicles: {
    primary: '#C9A227',
    primaryLight: '#D4B84A',
    gradient: 'from-[#C9A227] to-amber-600',
    textDark: 'text-[#C9A227]',
    textLight: 'text-amber-700',
  },
  opticalDesignStudio: {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    gradient: 'from-[#6366F1] to-indigo-600',
    textDark: 'text-[#6366F1]',
    textLight: 'text-indigo-600',
  },
  formulaLab: {
    primary: '#0891B2',
    primaryLight: '#22D3EE',
    gradient: 'from-[#0891B2] to-cyan-600',
    textDark: 'text-[#0891B2]',
    textLight: 'text-cyan-700',
  },
  polarquest: {
    primary: '#F59E0B',
    primaryLight: '#FBBF24',
    gradient: 'from-[#F59E0B] to-amber-500',
    textDark: 'text-[#F59E0B]',
    textLight: 'text-amber-600',
  },
  creativeLab: {
    primary: '#EC4899',
    primaryLight: '#F472B6',
    gradient: 'from-[#EC4899] to-pink-500',
    textDark: 'text-[#EC4899]',
    textLight: 'text-pink-600',
  },
  labGroup: {
    primary: '#10B981',
    primaryLight: '#34D399',
    gradient: 'from-[#10B981] to-emerald-500',
    textDark: 'text-[#10B981]',
    textLight: 'text-emerald-600',
  },
  // Course module theme
  course: {
    primary: '#F59E0B',
    primaryLight: '#FBBF24',
    gradient: 'from-[#F59E0B] to-orange-500',
    textDark: 'text-[#F59E0B]',
    textLight: 'text-amber-600',
  },
  // Game-specific themes
  game3d: {
    primary: '#F59E0B',
    primaryLight: '#FBBF24',
    gradient: 'from-[#F59E0B] to-amber-500',
    textDark: 'text-[#F59E0B]',
    textLight: 'text-amber-600',
  },
  game2d: {
    primary: '#F59E0B',
    primaryLight: '#FBBF24',
    gradient: 'from-[#F59E0B] to-amber-500',
    textDark: 'text-[#F59E0B]',
    textLight: 'text-amber-600',
  },
}

interface PersistentHeaderProps {
  /** Module key for icon and theming */
  moduleKey?: ModuleIconKey | 'game3d' | 'game2d' | 'course'
  /** Module name translation key */
  moduleNameKey?: string
  /** Custom module name (overrides translation) */
  moduleName?: string
  /** Show language/theme switcher */
  showSettings?: boolean
  /** Compact mode for mobile */
  compact?: boolean
  /** Additional right-side content */
  rightContent?: ReactNode
  /** Additional center content */
  centerContent?: ReactNode
  /** Custom class name */
  className?: string
  /** Background style: transparent for overlays, solid for regular pages */
  variant?: 'transparent' | 'solid' | 'glass'
  /** Show breadcrumb separator */
  showBreadcrumb?: boolean
}

export function PersistentHeader({
  moduleKey,
  moduleNameKey,
  moduleName,
  showSettings = true,
  compact = false,
  rightContent,
  centerContent,
  className,
  variant = 'glass',
  showBreadcrumb = true,
}: PersistentHeaderProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const moduleTheme = moduleKey ? MODULE_THEMES[moduleKey] : null
  const ModuleIcon = moduleKey && moduleKey in ModuleIconMap
    ? ModuleIconMap[moduleKey as ModuleIconKey]
    : null

  const displayName = moduleName || (moduleNameKey ? t(moduleNameKey) : null)

  // Background styles based on variant
  const bgStyles = {
    transparent: 'bg-transparent',
    solid: theme === 'dark'
      ? 'bg-slate-900/95 border-b border-slate-700/50'
      : 'bg-white/95 border-b border-slate-200/50',
    glass: theme === 'dark'
      ? 'bg-black/60 backdrop-blur-md border-b border-white/10'
      : 'bg-white/60 backdrop-blur-md border-b border-black/10',
  }

  return (
    <header
      className={cn(
        'flex items-center justify-between px-4 py-2 z-50',
        bgStyles[variant],
        className
      )}
    >
      {/* Left section: Logo + Module branding */}
      <div className="flex items-center gap-2">
        {/* Main PolarCraft Logo - always links to home */}
        <Link
          to="/"
          className={cn(
            'flex items-center gap-2 group transition-all duration-300',
            'hover:opacity-80'
          )}
          title={t('common.home')}
        >
          <PolarCraftLogo
            size={compact ? 28 : 32}
            theme={theme}
            animated={false}
            className="transition-transform group-hover:scale-105"
          />
          {!compact && (
            <span className={cn(
              'font-bold text-lg tracking-tight',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )}>
              PolarCraft
            </span>
          )}
        </Link>

        {/* Breadcrumb separator + Module info */}
        {moduleKey && displayName && showBreadcrumb && (
          <>
            <ChevronRight
              className={cn(
                'w-4 h-4',
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              )}
            />
            <div className="flex items-center gap-2">
              {/* Module Icon */}
              {ModuleIcon && (
                <ModuleIcon
                  size={compact ? 20 : 24}
                  primaryColor={moduleTheme?.primary}
                  secondaryColor={moduleTheme?.primaryLight}
                  className="transition-transform hover:scale-110"
                />
              )}
              {/* Module Name */}
              {!compact && (
                <span className={cn(
                  'font-medium text-sm',
                  theme === 'dark' ? moduleTheme?.textDark : moduleTheme?.textLight,
                  !moduleTheme && (theme === 'dark' ? 'text-slate-300' : 'text-slate-600')
                )}>
                  {displayName}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Center section */}
      {centerContent && (
        <div className="flex-1 flex justify-center">
          {centerContent}
        </div>
      )}

      {/* Right section: Settings + Auth + Custom content */}
      <div className="flex items-center gap-2">
        {rightContent}
        {showSettings && (
          <LanguageThemeSwitcher compact={compact} />
        )}
        <UserMenu compact={compact} />
      </div>
    </header>
  )
}

/**
 * MiniLogo - Smaller logo for inline use
 * 用于内联显示的小型 logo
 */
export function MiniLogo({
  size = 24,
  className
}: {
  size?: number
  className?: string
}) {
  const { theme } = useTheme()

  return (
    <Link to="/" className={cn('inline-flex items-center', className)}>
      <PolarCraftLogo size={size} theme={theme} animated={false} />
    </Link>
  )
}
