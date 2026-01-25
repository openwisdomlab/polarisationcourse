/**
 * Gallery Hub Page - Showcase & Gallery Module
 * 作品展示页面 - 成果展示模块
 *
 * Entry point for:
 * - Experiments: Creative experiments and DIY projects
 * - Merchandise: Educational merchandise and products
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { PersistentHeader } from '@/components/shared/PersistentHeader'
import {
  Palette, ShoppingBag, Image,
  Sparkles, ChevronRight
} from 'lucide-react'
import type { ModuleTab } from '@/components/shared'

// Sub-module configuration
const SUB_MODULES: ModuleTab[] = [
  {
    id: 'experiments',
    route: '/experiments',
    icon: Palette,
    label: 'Creative Experiments',
    labelZh: '创意实验',
    description: 'DIY projects, chromatic polarization art, and hands-on optical experiments',
    descriptionZh: 'DIY项目、色偏振艺术和动手光学实验',
    status: 'active',
  },
  {
    id: 'merchandise',
    route: '/merchandise',
    icon: ShoppingBag,
    label: 'Merchandise',
    labelZh: '周边产品',
    description: 'Educational merchandise, polarization kits, and creative products',
    descriptionZh: '教育周边、偏振套件和创意产品',
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
              ? 'border-pink-500/30 bg-slate-800/80 hover:border-pink-500/60'
              : 'border-pink-300 bg-white hover:border-pink-400 hover:shadow-pink-500/10'
          )
    )}>
      {/* Background decoration */}
      {!isComingSoon && (
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-pink-500/10 blur-2xl" />
      )}

      {/* Icon */}
      <div className={cn(
        'relative w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        featured && 'w-14 h-14',
        isComingSoon
          ? theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
          : 'bg-gradient-to-br from-pink-500 to-rose-600'
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
            theme === 'dark' ? 'text-pink-400' : 'text-pink-600'
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

function GalleryHubOverview() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-400 text-sm mb-4">
          <Image className="w-4 h-4" />
          <span>{isZh ? '创意与展示' : 'Creativity & Showcase'}</span>
        </div>
        <h2 className={cn(
          'text-2xl sm:text-3xl font-bold mb-3',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '作品展示' : 'Showcase'}
        </h2>
        <p className={cn(
          'text-base max-w-2xl mx-auto',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh
            ? '学生个性化研究成果展示，包括色偏振画、创意产品和DIY装置'
            : 'Student personalized research showcase, including chromatic polarization art, creative products and DIY devices'}
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
            theme === 'dark' ? 'text-pink-400' : 'text-pink-600'
          )} />
          <h3 className={cn(
            'font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '创作灵感' : 'Creative Inspiration'}
          </h3>
        </div>
        <div className={cn(
          'text-sm space-y-2',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          <p>
            {isZh
              ? '「创意实验」包含多种DIY项目：透明胶带双折射艺术、偏振摄影技术、手机屏幕实验等。'
              : '"Creative Experiments" includes various DIY projects: tape birefringence art, polarization photography techniques, phone screen experiments, and more.'}
          </p>
          <p>
            {isZh
              ? '在「周边产品」中可以找到偏振教育套件和创意文创产品，将光学之美带入日常生活。'
              : 'In "Merchandise" you can find polarization education kits and creative products that bring the beauty of optics into daily life.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export function GalleryHubPage() {
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
        moduleKey="creativeLab"
        moduleName={isZh ? '偏振造物局' : 'Polarization Workshop'}
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
        <GalleryHubOverview />
      </main>
    </div>
  )
}

export default GalleryHubPage
