/**
 * Education Hub Page - History & Experiments Module
 * 教育中心页面 - 历史故事与实验内容模块
 *
 * Entry point for:
 * - Chronicles: Historical stories of optics
 * - Course: P-SRT structured course content
 * - Learning Hub: Learning center
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { PersistentHeader } from '@/components/shared/PersistentHeader'
import {
  BookOpen, History, GraduationCap,
  Sparkles, ChevronRight
} from 'lucide-react'
import type { ModuleTab } from '@/components/shared'

// Sub-module configuration
const SUB_MODULES: ModuleTab[] = [
  {
    id: 'chronicles',
    route: '/chronicles',
    icon: History,
    label: 'Chronicles of Light',
    labelZh: '光之编年史',
    description: 'Explore the history of optics from 1669 to present through interactive stories',
    descriptionZh: '通过互动故事探索从1669年至今的光学发展史',
    status: 'active',
  },
  {
    id: 'course',
    route: '/course',
    icon: GraduationCap,
    label: 'P-SRT Course',
    labelZh: 'P-SRT课程',
    description: 'Structured course content with progressive experiments and research training',
    descriptionZh: '结构化课程内容，包含渐进式实验和研究训练',
    status: 'active',
  },
  {
    id: 'learn',
    route: '/learn',
    icon: BookOpen,
    label: 'Learning Hub',
    labelZh: '学习中心',
    description: 'Personalized learning paths and progress tracking',
    descriptionZh: '个性化学习路径和进度跟踪',
    status: 'active',
  },
]

interface SubModuleCardProps {
  module: ModuleTab
  featured?: boolean
}

function SubModuleCard({ module, featured = false }: SubModuleCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const Icon = module.icon
  const isComingSoon = module.status === 'coming-soon'

  const cardContent = (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border-2 transition-all',
      featured ? 'p-6 sm:p-8' : 'p-5',
      isComingSoon
        ? cn(
            'border-dashed cursor-not-allowed opacity-60',
            theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-gray-300 bg-gray-50'
          )
        : cn(
            'hover:-translate-y-1 hover:shadow-xl cursor-pointer',
            theme === 'dark'
              ? 'border-amber-500/30 bg-slate-800/80 hover:border-amber-500/60'
              : 'border-amber-300 bg-white hover:border-amber-400 hover:shadow-amber-500/10'
          )
    )}>
      {/* Background decoration */}
      {!isComingSoon && (
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-amber-500/10 blur-2xl" />
      )}

      {/* Icon */}
      <div className={cn(
        'relative w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        featured && 'w-14 h-14',
        isComingSoon
          ? theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
          : 'bg-gradient-to-br from-amber-500 to-orange-600'
      )}>
        <Icon className={cn(
          featured ? 'w-7 h-7' : 'w-6 h-6',
          isComingSoon
            ? theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            : 'text-white'
        )} />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <h3 className={cn(
            'font-bold',
            featured ? 'text-xl' : 'text-lg',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? module.labelZh : module.label}
          </h3>
          {isComingSoon && (
            <span className={cn(
              'text-[10px] px-2 py-0.5 rounded-full',
              theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
            )}>
              {isZh ? '即将推出' : 'Coming Soon'}
            </span>
          )}
        </div>

        <p className={cn(
          'text-sm leading-relaxed',
          featured && 'text-base',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh ? module.descriptionZh : module.description}
        </p>

        {/* Enter button */}
        {!isComingSoon && (
          <div className={cn(
            'mt-4 flex items-center gap-2 font-medium',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          )}>
            <span className="text-sm">{isZh ? '进入' : 'Enter'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  )

  if (isComingSoon) {
    return cardContent
  }

  return (
    <Link to={module.route}>
      {cardContent}
    </Link>
  )
}

function EducationHubOverview() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm mb-4">
          <BookOpen className="w-4 h-4" />
          <span>{isZh ? '三个学习模块' : 'Three Learning Modules'}</span>
        </div>
        <h2 className={cn(
          'text-2xl sm:text-3xl font-bold mb-3',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '历史与实验' : 'History & Experiments'}
        </h2>
        <p className={cn(
          'text-base max-w-2xl mx-auto',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh
            ? '结合历史发展历程，重现经典实验，从历史视角探索物理本质'
            : 'Recreate classic optical experiments since 1669, exploring the physical essence from a historical perspective'}
        </p>
      </div>

      {/* Module cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {SUB_MODULES.map((module, index) => (
          <SubModuleCard
            key={module.id}
            module={module}
            featured={index === 0}
          />
        ))}
      </div>

      {/* Quick tips */}
      <div className={cn(
        'rounded-xl p-4 sm:p-6',
        theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
      )}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className={cn(
            'w-5 h-5',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          )} />
          <h3 className={cn(
            'font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '推荐学习路径' : 'Recommended Learning Path'}
          </h3>
        </div>
        <div className={cn(
          'text-sm space-y-2',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          <p>
            {isZh
              ? '建议先从「光之编年史」了解偏振光的发现历程，建立直觉认识。'
              : 'Start with "Chronicles of Light" to understand the discovery history of polarized light and build intuition.'}
          </p>
          <p>
            {isZh
              ? '然后进入「P-SRT课程」进行系统学习，从基础层到研究层逐步深入。'
              : 'Then enter the "P-SRT Course" for systematic learning, progressing from foundation to research level.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export function EducationHubPage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc]'
    )}>
      {/* Header */}
      <PersistentHeader
        moduleKey="chronicles"
        moduleName={isZh ? '光的编年史' : 'Chronicles of Light'}
        variant="glass"
        className={cn(
          'sticky top-0 z-40',
          theme === 'dark'
            ? 'bg-slate-900/80 border-b border-slate-700'
            : 'bg-white/80 border-b border-gray-200'
        )}
      />

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <EducationHubOverview />
      </main>
    </div>
  )
}

export default EducationHubPage
