/**
 * Module Navigation Tabs Component
 * 模块导航标签组件
 *
 * Reusable tabs component for navigating between different sub-modules
 * within a main module (e.g., different game modes in PolarQuest)
 */

import { Link, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

export interface ModuleTab {
  id: string
  route: string
  icon: LucideIcon
  label: string
  labelZh: string
  description?: string
  descriptionZh?: string
  status?: 'active' | 'coming-soon' | 'beta'
}

interface ModuleTabsProps {
  tabs: ModuleTab[]
  colorTheme?: 'purple' | 'amber' | 'yellow' | 'cyan' | 'green' | 'pink'
  className?: string
}

const colorClasses = {
  purple: {
    active: 'border-purple-500 text-purple-400',
    hover: 'hover:border-purple-500/50 hover:text-purple-400',
    badge: 'bg-purple-500/20 text-purple-400',
  },
  amber: {
    active: 'border-amber-500 text-amber-400',
    hover: 'hover:border-amber-500/50 hover:text-amber-400',
    badge: 'bg-amber-500/20 text-amber-400',
  },
  yellow: {
    active: 'border-yellow-500 text-yellow-400',
    hover: 'hover:border-yellow-500/50 hover:text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-400',
  },
  cyan: {
    active: 'border-cyan-500 text-cyan-400',
    hover: 'hover:border-cyan-500/50 hover:text-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-400',
  },
  green: {
    active: 'border-green-500 text-green-400',
    hover: 'hover:border-green-500/50 hover:text-green-400',
    badge: 'bg-green-500/20 text-green-400',
  },
  pink: {
    active: 'border-pink-500 text-pink-400',
    hover: 'hover:border-pink-500/50 hover:text-pink-400',
    badge: 'bg-pink-500/20 text-pink-400',
  },
}

export function ModuleTabs({ tabs, colorTheme = 'purple', className }: ModuleTabsProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const location = useLocation()
  const isZh = i18n.language === 'zh'
  const colors = colorClasses[colorTheme]

  return (
    <div className={cn(
      'flex flex-wrap gap-2 p-1.5 rounded-xl',
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100',
      className
    )}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = location.pathname === tab.route
        const isComingSoon = tab.status === 'coming-soon'
        const isBeta = tab.status === 'beta'

        const content = (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className="font-medium text-sm">
              {isZh ? tab.labelZh : tab.label}
            </span>
            {isComingSoon && (
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full',
                theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              )}>
                {isZh ? '即将推出' : 'Soon'}
              </span>
            )}
            {isBeta && (
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full',
                colors.badge
              )}>
                Beta
              </span>
            )}
          </div>
        )

        if (isComingSoon) {
          return (
            <div
              key={tab.id}
              className={cn(
                'flex-1 min-w-[120px] px-4 py-2.5 rounded-lg border-2 border-transparent',
                'opacity-50 cursor-not-allowed',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}
            >
              {content}
            </div>
          )
        }

        return (
          <Link
            key={tab.id}
            to={tab.route}
            className={cn(
              'flex-1 min-w-[120px] px-4 py-2.5 rounded-lg border-2 transition-all',
              isActive
                ? cn('border-current', colors.active, theme === 'dark' ? 'bg-slate-700/50' : 'bg-white shadow-sm')
                : cn('border-transparent', colors.hover, theme === 'dark' ? 'text-gray-400' : 'text-gray-600')
            )}
          >
            {content}
          </Link>
        )
      })}
    </div>
  )
}

// Card-style navigation for larger displays
interface ModuleCardNavProps {
  tabs: ModuleTab[]
  colorTheme?: 'purple' | 'amber' | 'yellow' | 'cyan' | 'green' | 'pink'
  className?: string
}

export function ModuleCardNav({ tabs, colorTheme = 'purple', className }: ModuleCardNavProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const location = useLocation()
  const isZh = i18n.language === 'zh'
  const colors = colorClasses[colorTheme]

  return (
    <div className={cn('grid gap-3', className)} style={{
      gridTemplateColumns: `repeat(${Math.min(tabs.length, 4)}, minmax(0, 1fr))`
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = location.pathname === tab.route
        const isComingSoon = tab.status === 'coming-soon'
        const isBeta = tab.status === 'beta'

        const cardContent = (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                isActive
                  ? colors.badge
                  : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
              )}>
                <Icon className="w-5 h-5" />
              </div>
              {(isComingSoon || isBeta) && (
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full ml-auto',
                  isComingSoon
                    ? theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                    : colors.badge
                )}>
                  {isComingSoon ? (isZh ? '即将推出' : 'Soon') : 'Beta'}
                </span>
              )}
            </div>
            <h3 className={cn(
              'font-semibold mb-1',
              isActive ? '' : theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? tab.labelZh : tab.label}
            </h3>
            {(tab.description || tab.descriptionZh) && (
              <p className={cn(
                'text-xs line-clamp-2',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh ? tab.descriptionZh : tab.description}
              </p>
            )}
          </>
        )

        if (isComingSoon) {
          return (
            <div
              key={tab.id}
              className={cn(
                'p-4 rounded-xl border-2 border-dashed',
                'opacity-50 cursor-not-allowed',
                theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50'
              )}
            >
              {cardContent}
            </div>
          )
        }

        return (
          <Link
            key={tab.id}
            to={tab.route}
            className={cn(
              'p-4 rounded-xl border-2 transition-all hover:-translate-y-1',
              isActive
                ? cn('border-current', colors.active, theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-md')
                : cn(
                    'border-transparent',
                    theme === 'dark'
                      ? 'bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'
                      : 'bg-white hover:shadow-md hover:border-gray-200'
                  )
            )}
          >
            {cardContent}
          </Link>
        )
      })}
    </div>
  )
}
