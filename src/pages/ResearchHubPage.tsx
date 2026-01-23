/**
 * Research Hub Page - Virtual Lab & Research Module
 * 研究中心页面 - 虚拟课题组模块
 *
 * Entry point for:
 * - Lab: Virtual laboratory for research simulation
 * - Applications: Real-world application cases
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { PersistentHeader } from '@/components/shared/PersistentHeader'
import {
  FlaskRound, Lightbulb, Microscope,
  Sparkles, ChevronRight
} from 'lucide-react'
import type { ModuleTab } from '@/components/shared'

// Sub-module configuration
const SUB_MODULES: ModuleTab[] = [
  {
    id: 'lab',
    route: '/lab',
    icon: FlaskRound,
    label: 'Virtual Lab',
    labelZh: '虚拟实验室',
    description: 'Participate in ESRT/ORIC level research topics, record data and analyze like a scientist',
    descriptionZh: '参与ESRT/ORIC级别研究课题，像科学家一样记录数据和分析',
    status: 'active',
  },
  {
    id: 'applications',
    route: '/applications',
    icon: Lightbulb,
    label: 'Applications',
    labelZh: '应用案例',
    description: 'Real-world applications in biomedicine, materials science, industrial inspection, and more',
    descriptionZh: '生物医学、材料科学、工业检测等领域的实际应用案例',
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
              ? 'border-teal-500/30 bg-slate-800/80 hover:border-teal-500/60'
              : 'border-teal-300 bg-white hover:border-teal-400 hover:shadow-teal-500/10'
          )
    )}>
      {/* Background decoration */}
      {!isComingSoon && (
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-teal-500/10 blur-2xl" />
      )}

      {/* Icon */}
      <div className={cn(
        'relative w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        featured && 'w-14 h-14',
        isComingSoon
          ? theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
          : 'bg-gradient-to-br from-teal-500 to-emerald-600'
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
            theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
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

function ResearchHubOverview() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-sm mb-4">
          <Microscope className="w-4 h-4" />
          <span>{isZh ? '研究与应用' : 'Research & Applications'}</span>
        </div>
        <h2 className={cn(
          'text-2xl sm:text-3xl font-bold mb-3',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '虚拟课题组' : 'Virtual Lab'}
        </h2>
        <p className={cn(
          'text-base max-w-2xl mx-auto',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh
            ? '参与ESRT/ORIC级别研究课题，记录数据并像科学家一样进行分析'
            : 'Participate in ESRT/ORIC level research topics, record data and analyze like a scientist'}
        </p>
      </div>

      {/* Module cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
            theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
          )} />
          <h3 className={cn(
            'font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '研究指南' : 'Research Guide'}
          </h3>
        </div>
        <div className={cn(
          'text-sm space-y-2',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          <p>
            {isZh
              ? '「虚拟实验室」提供不同层级的研究课题，从PSRT问题驱动的入门研究到ORIC独立原创研究。'
              : '"Virtual Lab" provides research topics at different levels, from PSRT problem-driven introductory research to ORIC independent original research.'}
          </p>
          <p>
            {isZh
              ? '「应用案例」展示偏振光在海洋学、生物医学、材料科学、工业检测、自动驾驶等领域的实际应用。'
              : '"Applications" showcases real-world uses of polarized light in oceanography, biomedicine, materials science, industrial inspection, autonomous driving, and more.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export function ResearchHubPage() {
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
        moduleName={isZh ? '虚拟课题组' : 'Virtual Lab'}
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
        <ResearchHubOverview />
      </main>
    </div>
  )
}

export default ResearchHubPage
