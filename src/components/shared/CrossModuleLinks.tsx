/**
 * CrossModuleLinks - 跨模块推荐组件
 * Recommends related content from other modules based on the current demo.
 * Uses the learningPaths prerequisite data to surface cross-links.
 */

import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Compass, Gamepad2, Wrench, FlaskConical, Image, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDemoPrerequisites, type CrossModuleLink } from '@/data/learningPaths'

const MODULE_ICONS: Record<CrossModuleLink['module'], React.ReactNode> = {
  chronicles: <BookOpen className="w-4 h-4" />,
  studio: <Wrench className="w-4 h-4" />,
  demos: <Compass className="w-4 h-4" />,
  games: <Gamepad2 className="w-4 h-4" />,
  gallery: <Image className="w-4 h-4" />,
  research: <FlaskConical className="w-4 h-4" />,
}

const MODULE_COLORS: Record<CrossModuleLink['module'], { dark: string; light: string }> = {
  chronicles: { dark: 'text-amber-400 bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/20', light: 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100' },
  studio: { dark: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30 hover:bg-cyan-400/20', light: 'text-cyan-700 bg-cyan-50 border-cyan-200 hover:bg-cyan-100' },
  demos: { dark: 'text-violet-400 bg-violet-400/10 border-violet-400/30 hover:bg-violet-400/20', light: 'text-violet-700 bg-violet-50 border-violet-200 hover:bg-violet-100' },
  games: { dark: 'text-green-400 bg-green-400/10 border-green-400/30 hover:bg-green-400/20', light: 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100' },
  gallery: { dark: 'text-pink-400 bg-pink-400/10 border-pink-400/30 hover:bg-pink-400/20', light: 'text-pink-700 bg-pink-50 border-pink-200 hover:bg-pink-100' },
  research: { dark: 'text-orange-400 bg-orange-400/10 border-orange-400/30 hover:bg-orange-400/20', light: 'text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100' },
}

interface CrossModuleLinksProps {
  demoId: string
  theme: 'dark' | 'light'
}

export function CrossModuleLinks({ demoId, theme }: CrossModuleLinksProps) {
  const { t } = useTranslation()
  const prereq = getDemoPrerequisites(demoId)

  if (!prereq?.crossLinks?.length) return null

  return (
    <div className={cn(
      'rounded-xl border p-4',
      theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-50 border-gray-200'
    )}>
      <p className={cn(
        'text-xs font-medium uppercase tracking-wider mb-3',
        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
      )}>
        {t('learningPaths.explore')}
      </p>
      <div className="flex flex-wrap gap-2">
        {prereq.crossLinks.map((link, i) => {
          const colors = MODULE_COLORS[link.module]
          const colorClass = theme === 'dark' ? colors.dark : colors.light
          return (
            <Link
              key={i}
              to={link.path}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                colorClass
              )}
            >
              {MODULE_ICONS[link.module]}
              {t(link.labelKey)}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
