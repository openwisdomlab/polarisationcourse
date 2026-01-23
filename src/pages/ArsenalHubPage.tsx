/**
 * Arsenal Hub Page - Optical Arsenal Module
 * 光学兵器库页面 - 光学器件和典型光路模块
 *
 * Entry point for:
 * - Optical Studio: Device library and light path design
 * - Hardware: Commercial polarization components
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { PersistentHeader } from '@/components/shared/PersistentHeader'
import {
  Microscope, Cpu, Wrench,
  Sparkles, ChevronRight
} from 'lucide-react'
import type { ModuleTab } from '@/components/shared'

// Sub-module configuration
const SUB_MODULES: ModuleTab[] = [
  {
    id: 'optical-studio',
    route: '/optical-studio',
    icon: Microscope,
    label: 'Optical Design Studio',
    labelZh: '光学设计室',
    description: 'Browse 80+ optical devices, design custom light paths, and simulate classic experiments',
    descriptionZh: '浏览80+光学器件，设计自定义光路，模拟经典实验',
    status: 'active',
  },
  {
    id: 'hardware',
    route: '/hardware',
    icon: Cpu,
    label: 'Hardware Components',
    labelZh: '硬件器件',
    description: 'Explore commercial polarization components with detailed specifications and applications',
    descriptionZh: '探索商业偏振元器件，包含详细规格和应用案例',
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
              ? 'border-cyan-500/30 bg-slate-800/80 hover:border-cyan-500/60'
              : 'border-cyan-300 bg-white hover:border-cyan-400 hover:shadow-cyan-500/10'
          )
    )}>
      {/* Background decoration */}
      {!isComingSoon && (
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-cyan-500/10 blur-2xl" />
      )}

      {/* Icon */}
      <div className={cn(
        'relative w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        featured && 'w-14 h-14',
        isComingSoon
          ? theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
          : 'bg-gradient-to-br from-cyan-500 to-blue-600'
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
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
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

function ArsenalHubOverview() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm mb-4">
          <Wrench className="w-4 h-4" />
          <span>{isZh ? '两个工具模块' : 'Two Tool Modules'}</span>
        </div>
        <h2 className={cn(
          'text-2xl sm:text-3xl font-bold mb-3',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '光学兵器库' : 'Optical Arsenal'}
        </h2>
        <p className={cn(
          'text-base max-w-2xl mx-auto',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh
            ? '探索商业化偏振元器件，了解原理与应用，设计典型光路'
            : 'Explore commercial polarization components, learn principles and applications, design typical optical paths'}
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
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          )} />
          <h3 className={cn(
            'font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '使用建议' : 'Usage Tips'}
          </h3>
        </div>
        <div className={cn(
          'text-sm space-y-2',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          <p>
            {isZh
              ? '「光学设计室」提供完整的光学设计工作流：从器件库选择元件，拖拽到工作台，实时模拟光路。'
              : 'The "Optical Design Studio" provides a complete optical design workflow: select components from the device library, drag to the workbench, and simulate light paths in real-time.'}
          </p>
          <p>
            {isZh
              ? '在「硬件器件」中可以了解商业化产品的参数规格，为实验采购提供参考。'
              : 'In "Hardware Components" you can learn about commercial product specifications to guide experimental procurement.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export function ArsenalHubPage() {
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
        moduleName={isZh ? '光学兵器库' : 'Optical Arsenal'}
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
        <ArsenalHubOverview />
      </main>
    </div>
  )
}

export default ArsenalHubPage
