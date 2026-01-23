/**
 * Theory Hub Page - Theory & Simulation Module
 * 理论中心页面 - 基本理论和计算模拟模块
 *
 * Entry point for:
 * - Demos: Interactive physics demonstrations
 * - Calculation Workshop: Jones, Stokes, Mueller calculators
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { PersistentHeader } from '@/components/shared/PersistentHeader'
import {
  FlaskConical, Calculator, Atom,
  Sparkles, ChevronRight
} from 'lucide-react'
import type { ModuleTab } from '@/components/shared'

// Sub-module configuration
const SUB_MODULES: ModuleTab[] = [
  {
    id: 'demos',
    route: '/demos',
    icon: FlaskConical,
    label: 'Interactive Demos',
    labelZh: '交互演示',
    description: 'Explore 20+ interactive physics demonstrations with real-time parameter control',
    descriptionZh: '探索20+交互式物理演示，实时调整参数观察变化',
    status: 'active',
  },
  {
    id: 'calc',
    route: '/calc',
    icon: Calculator,
    label: 'Calculation Workshop',
    labelZh: '计算工坊',
    description: 'Jones matrices, Stokes vectors, Mueller matrices, and Poincare sphere visualization',
    descriptionZh: 'Jones矩阵、Stokes矢量、Mueller矩阵计算器和庞加莱球可视化',
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
              ? 'border-indigo-500/30 bg-slate-800/80 hover:border-indigo-500/60'
              : 'border-indigo-300 bg-white hover:border-indigo-400 hover:shadow-indigo-500/10'
          )
    )}>
      {/* Background decoration */}
      {!isComingSoon && (
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-indigo-500/10 blur-2xl" />
      )}

      {/* Icon */}
      <div className={cn(
        'relative w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        featured && 'w-14 h-14',
        isComingSoon
          ? theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
          : 'bg-gradient-to-br from-indigo-500 to-purple-600'
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
            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
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

function TheoryHubOverview() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm mb-4">
          <Atom className="w-4 h-4" />
          <span>{isZh ? '演示与计算' : 'Demos & Calculations'}</span>
        </div>
        <h2 className={cn(
          'text-2xl sm:text-3xl font-bold mb-3',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '理论与模拟' : 'Theory & Simulation'}
        </h2>
        <p className={cn(
          'text-base max-w-2xl mx-auto',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh
            ? '交互式物理演示和专业计算工具——调整参数，即时验证Jones矩阵和Stokes参数'
            : 'Interactive physics demos and calculation tools — change parameters and instantly verify Jones matrices and Stokes parameters'}
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
            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
          )} />
          <h3 className={cn(
            'font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '学习建议' : 'Learning Tips'}
          </h3>
        </div>
        <div className={cn(
          'text-sm space-y-2',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          <p>
            {isZh
              ? '「交互演示」涵盖6个单元的核心概念，从马吕斯定律到全偏振测量，每个演示都支持三个难度等级。'
              : '"Interactive Demos" covers core concepts across 6 units, from Malus\'s Law to full polarimetry, with three difficulty levels per demo.'}
          </p>
          <p>
            {isZh
              ? '在「计算工坊」中，可以进行Jones矩阵、Stokes矢量、Mueller矩阵的计算，并在庞加莱球上可视化偏振态。'
              : 'In the "Calculation Workshop", perform calculations with Jones matrices, Stokes vectors, Mueller matrices, and visualize polarization states on the Poincare sphere.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export function TheoryHubPage() {
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
        moduleName={isZh ? '理论与模拟' : 'Theory & Simulation'}
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
        <TheoryHubOverview />
      </main>
    </div>
  )
}

export default TheoryHubPage
