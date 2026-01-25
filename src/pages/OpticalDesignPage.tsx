/**
 * Optical Design Page - 光学设计室 (模块化重构版)
 *
 * 三大子模块:
 * 1. 偏振器件 (DeviceGallery) - 器件图鉴，丰富的器件库
 * 2. 偏振光路 (OpticalPaths) - 经典光路实验，含详细原理解析
 * 3. 自由设计 (FreeDesign) - 简化的自由设计画布
 *
 * 参考 DemosPage 的架构设计
 */

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { PersistentHeader } from '@/components/shared/PersistentHeader'
import {
  BookOpen,
  Lightbulb,
  Pencil,
  ChevronRight,
  Menu,
  X,
  FlaskConical,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'

// Import KaTeX for rendering mathematical formulas 导入 KaTeX 用于渲染数学公式
import 'katex/dist/katex.min.css';

// Lazy load sub-modules
import { DeviceGalleryModule } from '@/components/optical-design/DeviceGalleryModule'
import { OpticalPathsModule } from '@/components/optical-design/OpticalPathsModule'
import { FreeDesignModule } from '@/components/optical-design/FreeDesignModule'

// ============================================
// Types
// ============================================

type ModuleId = 'devices' | 'paths' | 'design'

interface ModuleInfo {
  id: ModuleId
  titleKey: string
  descriptionKey: string
  icon: React.ReactNode
  color: string
  gradient: {
    dark: string
    light: string
  }
}

// ============================================
// Module Definitions
// ============================================

const MODULES: ModuleInfo[] = [
  {
    id: 'devices',
    titleKey: 'opticalDesign.modules.devices.title',
    descriptionKey: 'opticalDesign.modules.devices.description',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'cyan',
    gradient: {
      dark: 'from-cyan-400/20 to-blue-400/20',
      light: 'from-cyan-100 to-blue-100',
    },
  },
  {
    id: 'paths',
    titleKey: 'opticalDesign.modules.paths.title',
    descriptionKey: 'opticalDesign.modules.paths.description',
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'amber',
    gradient: {
      dark: 'from-amber-400/20 to-orange-400/20',
      light: 'from-amber-100 to-orange-100',
    },
  },
  {
    id: 'design',
    titleKey: 'opticalDesign.modules.design.title',
    descriptionKey: 'opticalDesign.modules.design.description',
    icon: <Pencil className="w-5 h-5" />,
    color: 'purple',
    gradient: {
      dark: 'from-purple-400/20 to-pink-400/20',
      light: 'from-purple-100 to-pink-100',
    },
  },
]

// ============================================
// Loading Component
// ============================================

function ModuleLoading() {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-4" />
        <p className="text-gray-400">{t('common.loading')}</p>
      </div>
    </div>
  )
}

// ============================================
// Module Card Component
// ============================================

interface ModuleCardProps {
  module: ModuleInfo
  isActive: boolean
  onClick: () => void
}

function ModuleCard({ module, isActive, onClick }: ModuleCardProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const colorClasses = {
    cyan: {
      active: theme === 'dark'
        ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
        : 'border-cyan-500 bg-cyan-50 shadow-lg',
      hover: theme === 'dark'
        ? 'hover:border-cyan-400/50 hover:bg-cyan-400/5'
        : 'hover:border-cyan-300 hover:bg-cyan-50/50',
      icon: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
    },
    amber: {
      active: theme === 'dark'
        ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
        : 'border-amber-500 bg-amber-50 shadow-lg',
      hover: theme === 'dark'
        ? 'hover:border-amber-400/50 hover:bg-amber-400/5'
        : 'hover:border-amber-300 hover:bg-amber-50/50',
      icon: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
    },
    purple: {
      active: theme === 'dark'
        ? 'border-purple-400 bg-purple-400/10 shadow-[0_0_20px_rgba(167,139,250,0.2)]'
        : 'border-purple-500 bg-purple-50 shadow-lg',
      hover: theme === 'dark'
        ? 'hover:border-purple-400/50 hover:bg-purple-400/5'
        : 'hover:border-purple-300 hover:bg-purple-50/50',
      icon: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
    },
  }

  const colors = colorClasses[module.color as keyof typeof colorClasses]

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border-2 transition-all duration-300 text-left',
        theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-200',
        isActive ? colors.active : colors.hover
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          'p-2 rounded-lg',
          isActive
            ? (theme === 'dark' ? `bg-${module.color}-400/20` : `bg-${module.color}-100`)
            : (theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'),
          colors.icon
        )}>
          {module.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-semibold text-sm',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {t(module.titleKey)}
          </h3>
          <p className={cn(
            'text-xs truncate mt-0.5',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {t(module.descriptionKey)}
          </p>
        </div>
        <ChevronRight className={cn(
          'w-4 h-4 transition-transform',
          isActive && 'rotate-90',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )} />
      </div>
    </button>
  )
}

// ============================================
// Principles Quick Reference
// ============================================

interface Principle {
  id: string
  icon: string
  titleKey: string
  formula?: string
  color: string
  linkedDemo?: string
}

const PRINCIPLES: Principle[] = [
  {
    id: 'orthogonality',
    icon: '⊥',
    titleKey: 'opticalDesign.principles.orthogonality',
    color: '#22d3ee',
    linkedDemo: 'polarization-types',
  },
  {
    id: 'malus',
    icon: '∠',
    titleKey: 'opticalDesign.principles.malus',
    formula: 'I = I₀cos²θ',
    color: '#3b82f6',
    linkedDemo: 'malus',
  },
  {
    id: 'birefringence',
    icon: '◇',
    titleKey: 'opticalDesign.principles.birefringence',
    color: '#8b5cf6',
    linkedDemo: 'birefringence',
  },
  {
    id: 'interference',
    icon: '∿',
    titleKey: 'opticalDesign.principles.interference',
    formula: 'φ=0: + | φ=π: −',
    color: '#f59e0b',
    linkedDemo: 'waveplate',
  },
]

function PrinciplesReference() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={cn(
      'rounded-xl border overflow-hidden transition-all duration-300',
      theme === 'dark'
        ? 'bg-slate-900/50 border-slate-700/50'
        : 'bg-white border-gray-200'
    )}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center justify-between p-3 transition-colors',
          theme === 'dark'
            ? 'hover:bg-slate-800/50'
            : 'hover:bg-gray-50'
        )}
      >
        <div className="flex items-center gap-2">
          <FlaskConical className={cn(
            'w-4 h-4',
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          )} />
          <span className={cn(
            'text-sm font-medium',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {t('opticalDesign.principlesTitle')}
          </span>
        </div>
        <ChevronRight className={cn(
          'w-4 h-4 transition-transform duration-300',
          expanded && 'rotate-90',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )} />
      </button>

      {/* Compact Icons - Always Visible */}
      {!expanded && (
        <div className="px-3 pb-3 flex gap-2">
          {PRINCIPLES.map((p) => (
            <Link
              key={p.id}
              to={`/demos?demo=${p.linkedDemo}`}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg text-lg font-bold transition-all',
                'hover:scale-110 hover:shadow-lg',
                theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
              )}
              style={{ color: p.color }}
              title={t(p.titleKey)}
            >
              {p.icon}
            </Link>
          ))}
        </div>
      )}

      {/* Expanded Content */}
      {expanded && (
        <div className="p-3 pt-0 space-y-2">
          {PRINCIPLES.map((p) => (
            <Link
              key={p.id}
              to={`/demos?demo=${p.linkedDemo}`}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg transition-colors',
                theme === 'dark'
                  ? 'hover:bg-slate-800'
                  : 'hover:bg-gray-50'
              )}
            >
              <span
                className="w-8 h-8 flex items-center justify-center rounded-lg text-lg font-bold"
                style={{ backgroundColor: `${p.color}20`, color: p.color }}
              >
                {p.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  'text-sm font-medium',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {t(p.titleKey)}
                </div>
                {p.formula && (
                  <div className={cn(
                    'text-xs font-mono',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {p.formula}
                  </div>
                )}
              </div>
              <ArrowRight className={cn(
                'w-4 h-4',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Main Page Component
// ============================================

export function OpticalDesignPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile, isTablet } = useIsMobile()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeModule, setActiveModule] = useState<ModuleId>('devices')
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  const isCompact = isMobile || isTablet

  // Handle URL query parameter for direct module linking
  useEffect(() => {
    const moduleParam = searchParams.get('module') as ModuleId | null
    if (moduleParam && MODULES.some((m) => m.id === moduleParam)) {
      setActiveModule(moduleParam)
    }
  }, [searchParams])

  // Update URL when module changes
  const handleModuleChange = (moduleId: ModuleId) => {
    setActiveModule(moduleId)
    setSearchParams({ module: moduleId }, { replace: true })
    if (isCompact) {
      setShowMobileSidebar(false)
    }
  }

  // Render active module component
  const renderModule = () => {
    switch (activeModule) {
      case 'devices':
        return <DeviceGalleryModule />
      case 'paths':
        return <OpticalPathsModule />
      case 'design':
        return <FreeDesignModule />
      default:
        return <DeviceGalleryModule />
    }
  }

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col',
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
          : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
      )}
    >
      {/* Header */}
      <PersistentHeader
        moduleKey="opticalDesignStudio"
        moduleNameKey="home.opticalDesignStudio.title"
      />

      {/* Mobile Menu Button */}
      {isCompact && (
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className={cn(
            'fixed top-16 left-4 z-40 p-2 rounded-lg shadow-lg',
            theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'
          )}
        >
          {showMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex pt-14">
        {/* Sidebar */}
        <aside
          className={cn(
            'flex-shrink-0 flex flex-col border-r',
            theme === 'dark' ? 'bg-[#0d0d1a]/90 border-slate-800' : 'bg-white/90 border-gray-200',
            isCompact
              ? cn(
                  'fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300',
                  showMobileSidebar ? 'translate-x-0' : '-translate-x-full',
                  'pt-24'
                )
              : 'w-72 sticky top-14 h-[calc(100vh-3.5rem)]'
          )}
        >
          {/* Logo / Title */}
          <div
            className={cn(
              'p-4 border-b',
              theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'p-2 rounded-xl',
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-cyan-400/20 to-purple-400/20'
                    : 'bg-gradient-to-br from-cyan-100 to-purple-100'
                )}
              >
                <Sparkles
                  className={cn('w-6 h-6', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}
                />
              </div>
              <div>
                <h1
                  className={cn(
                    'font-bold text-lg',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {t('opticalDesign.title')}
                </h1>
                <p
                  className={cn(
                    'text-xs',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}
                >
                  {t('opticalDesign.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Module List */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            <div
              className={cn(
                'text-xs font-medium uppercase tracking-wider mb-2',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}
            >
              {t('opticalDesign.modulesLabel')}
            </div>
            {MODULES.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                isActive={activeModule === module.id}
                onClick={() => handleModuleChange(module.id)}
              />
            ))}
          </div>

          {/* Principles Reference */}
          <div className={cn('p-4 border-t', theme === 'dark' ? 'border-slate-800' : 'border-gray-200')}>
            <PrinciplesReference />
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {isCompact && showMobileSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Main Content */}
        <main className={cn('flex-1 overflow-hidden', isCompact ? 'ml-0' : 'ml-0')}>
          <Suspense fallback={<ModuleLoading />}>{renderModule()}</Suspense>
        </main>
      </div>
    </div>
  )
}

export default OpticalDesignPage
