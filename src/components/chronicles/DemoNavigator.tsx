/**
 * DemoNavigator - 光学演示馆导航组件
 *
 * 设计原则：
 * 1. 以光学演示馆的内容结构作为导航逻辑
 * 2. 按单元组织演示项目 (Unit 0-5)
 * 3. 点击演示项目可以筛选关联的时间线事件
 * 4. 提供直达演示页面的链接
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Atom,
  Play,
  Lightbulb,
  Zap,
  Sparkles,
  Target,
  Telescope,
  Waves,
  ExternalLink,
  Filter,
  X
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

// Demo data structure matching DemosPage
interface DemoItem {
  id: string
  titleKey: string
  unit: number
  descriptionKey: string
  visualType: '2D' | '3D'
  difficulty: 'foundation' | 'application' | 'research'
  relatedEvents?: { year: number; track: 'optics' | 'polarization' }[]
}

// Unit configuration
interface UnitConfig {
  id: number
  titleEn: string
  titleZh: string
  icon: LucideIcon
  color: string
}

const UNITS: UnitConfig[] = [
  { id: 0, titleEn: 'Optical Basics', titleZh: '光学基础', icon: Waves, color: '#6366f1' },
  { id: 1, titleEn: 'Polarization States', titleZh: '偏振态', icon: Lightbulb, color: '#f59e0b' },
  { id: 2, titleEn: 'Interface Reflection', titleZh: '界面反射', icon: Zap, color: '#10b981' },
  { id: 3, titleEn: 'Transparent Media', titleZh: '透明介质', icon: Sparkles, color: '#ec4899' },
  { id: 4, titleEn: 'Scattering', titleZh: '散射', icon: Target, color: '#8b5cf6' },
  { id: 5, titleEn: 'Full Polarimetry', titleZh: '全偏振', icon: Telescope, color: '#0ea5e9' },
]

// Demo list - simplified version matching DemosPage structure
const DEMOS: DemoItem[] = [
  // Unit 0 - Optical Basics
  { id: 'light-wave', titleKey: 'basics.demos.lightWave.title', unit: 0, descriptionKey: 'basics.demos.lightWave.description', visualType: '2D', difficulty: 'foundation' },
  { id: 'polarization-intro', titleKey: 'basics.demos.polarizationIntro.title', unit: 0, descriptionKey: 'basics.demos.polarizationIntro.description', visualType: '2D', difficulty: 'foundation' },
  { id: 'polarization-types', titleKey: 'basics.demos.polarizationTypes.title', unit: 0, descriptionKey: 'basics.demos.polarizationTypes.description', visualType: '2D', difficulty: 'application' },
  { id: 'optical-bench', titleKey: 'basics.demos.opticalBench.title', unit: 0, descriptionKey: 'basics.demos.opticalBench.description', visualType: '2D', difficulty: 'application' },
  // Unit 1
  { id: 'polarization-state', titleKey: 'demos.polarizationState.title', unit: 1, descriptionKey: 'demos.polarizationState.description', visualType: '3D', difficulty: 'foundation' },
  { id: 'malus', titleKey: 'demos.malus.title', unit: 1, descriptionKey: 'demos.malus.description', visualType: '2D', difficulty: 'application',
    relatedEvents: [{ year: 1808, track: 'polarization' }, { year: 1809, track: 'polarization' }] },
  { id: 'birefringence', titleKey: 'demos.birefringence.title', unit: 1, descriptionKey: 'demos.birefringence.description', visualType: '3D', difficulty: 'application',
    relatedEvents: [{ year: 1669, track: 'polarization' }] },
  { id: 'waveplate', titleKey: 'demos.waveplate.title', unit: 1, descriptionKey: 'demos.waveplate.description', visualType: '3D', difficulty: 'research' },
  // Unit 2
  { id: 'fresnel', titleKey: 'demos.fresnel.title', unit: 2, descriptionKey: 'demos.fresnel.description', visualType: '2D', difficulty: 'research',
    relatedEvents: [{ year: 1823, track: 'polarization' }] },
  { id: 'brewster', titleKey: 'demos.brewster.title', unit: 2, descriptionKey: 'demos.brewster.description', visualType: '2D', difficulty: 'application',
    relatedEvents: [{ year: 1815, track: 'polarization' }] },
  // Unit 3
  { id: 'anisotropy', titleKey: 'demos.anisotropy.title', unit: 3, descriptionKey: 'demos.anisotropy.description', visualType: '2D', difficulty: 'foundation' },
  { id: 'chromatic', titleKey: 'demos.chromatic.title', unit: 3, descriptionKey: 'demos.chromatic.description', visualType: '2D', difficulty: 'application' },
  { id: 'optical-rotation', titleKey: 'demos.opticalRotation.title', unit: 3, descriptionKey: 'demos.opticalRotation.description', visualType: '2D', difficulty: 'application',
    relatedEvents: [{ year: 1811, track: 'polarization' }, { year: 1848, track: 'polarization' }] },
  // Unit 4
  { id: 'rayleigh', titleKey: 'demos.rayleigh.title', unit: 4, descriptionKey: 'demos.rayleigh.description', visualType: '2D', difficulty: 'foundation',
    relatedEvents: [{ year: 1871, track: 'optics' }] },
  { id: 'mie-scattering', titleKey: 'demos.mieScattering.title', unit: 4, descriptionKey: 'demos.mieScattering.description', visualType: '2D', difficulty: 'research',
    relatedEvents: [{ year: 1908, track: 'optics' }] },
  { id: 'monte-carlo-scattering', titleKey: 'demos.monteCarloScattering.title', unit: 4, descriptionKey: 'demos.monteCarloScattering.description', visualType: '2D', difficulty: 'research' },
  // Unit 5
  { id: 'stokes', titleKey: 'demos.stokes.title', unit: 5, descriptionKey: 'demos.stokes.description', visualType: '3D', difficulty: 'research',
    relatedEvents: [{ year: 1852, track: 'polarization' }] },
  { id: 'mueller', titleKey: 'demos.mueller.title', unit: 5, descriptionKey: 'demos.mueller.description', visualType: '2D', difficulty: 'research',
    relatedEvents: [{ year: 1943, track: 'polarization' }] },
  { id: 'jones', titleKey: 'demos.jones.title', unit: 5, descriptionKey: 'demos.jones.description', visualType: '2D', difficulty: 'research',
    relatedEvents: [{ year: 1941, track: 'polarization' }] },
  { id: 'calculator', titleKey: 'demos.calculator.title', unit: 5, descriptionKey: 'demos.calculator.description', visualType: '2D', difficulty: 'application' },
  { id: 'polarimetric-microscopy', titleKey: 'demos.polarimetricMicroscopy.title', unit: 5, descriptionKey: 'demos.polarimetricMicroscopy.description', visualType: '2D', difficulty: 'research' },
]

// Difficulty configuration
const DIFFICULTY_CONFIG = {
  foundation: { emoji: '🌱', color: '#22c55e' },
  application: { emoji: '🔬', color: '#3b82f6' },
  research: { emoji: '🚀', color: '#a855f7' },
}

interface DemoNavigatorProps {
  className?: string
  selectedDemos: string[]  // Selected demo IDs for filtering
  onFilterChange: (selectedDemos: string[]) => void
  highlightedDemos?: Set<string>  // Demos highlighted from timeline event click
  onEventClick?: (year: number, track: 'optics' | 'polarization') => void  // Callback to scroll to event
}

export function DemoNavigator({
  className,
  selectedDemos,
  onFilterChange,
  highlightedDemos,
  onEventClick: _onEventClick  // Reserved for future event navigation
}: DemoNavigatorProps) {
  const { theme } = useTheme()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isZh = i18n.language === 'zh'

  // Suppress unused variable warning
  void _onEventClick

  // State management
  const [isExpanded, setIsExpanded] = useState(false)  // Mobile expand/collapse
  const [expandedUnits, setExpandedUnits] = useState<Set<number>>(new Set([0, 1]))  // Expanded units

  // Selected demos count
  const hasFilter = selectedDemos.length > 0
  const filterCount = selectedDemos.length

  // Get demos for a unit
  const getDemosForUnit = useCallback((unitId: number) => {
    return DEMOS.filter(d => d.unit === unitId)
  }, [])

  // Toggle unit expand/collapse
  const toggleUnit = useCallback((unitId: number) => {
    setExpandedUnits(prev => {
      const next = new Set(prev)
      if (next.has(unitId)) {
        next.delete(unitId)
      } else {
        next.add(unitId)
      }
      return next
    })
  }, [])

  // Toggle demo selection for filtering
  const toggleDemoFilter = useCallback((demoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSelected = selectedDemos.includes(demoId)
      ? selectedDemos.filter(id => id !== demoId)
      : [...selectedDemos, demoId]
    onFilterChange(newSelected)
  }, [selectedDemos, onFilterChange])

  // Clear all filters
  const clearFilter = useCallback(() => {
    onFilterChange([])
  }, [onFilterChange])

  // Check if demo is highlighted
  const isDemoHighlighted = useCallback((demoId: string) => {
    return highlightedDemos?.has(demoId) ?? false
  }, [highlightedDemos])

  // Navigate to demo page
  const goToDemo = useCallback((demoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/demos/${demoId}`)
  }, [navigate])

  return (
    <div className={cn(
      'fixed left-4 top-1/2 -translate-y-1/2 z-30',
      'flex flex-col items-start gap-1',
      className
    )}>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'md:hidden p-2 rounded-full shadow-lg transition-all mb-2',
          theme === 'dark'
            ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        )}
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Main container */}
      <div className={cn(
        'transition-all duration-300',
        'md:opacity-100 md:translate-x-0',
        isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full md:opacity-100 md:translate-x-0',
        'pointer-events-auto'
      )}>
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between gap-2 mb-2 px-2 py-1.5 rounded-lg',
          theme === 'dark' ? 'bg-slate-800/90' : 'bg-white/90',
          'shadow-sm backdrop-blur-sm'
        )}>
          <div className="flex items-center gap-1.5">
            <Atom className={cn(
              'w-4 h-4',
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            )} />
            <span className={cn(
              'text-xs font-semibold',
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            )}>
              {isZh ? '光学演示馆' : 'Optical Demos'}
            </span>
          </div>

          {/* Clear filter button */}
          {hasFilter && (
            <button
              onClick={clearFilter}
              className={cn(
                'p-1.5 rounded-md transition-all flex items-center gap-1',
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-900/30'
                  : 'text-red-500 hover:bg-red-50'
              )}
              title={isZh ? '清除筛选' : 'Clear filter'}
            >
              <X className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">{filterCount}</span>
            </button>
          )}
        </div>

        {/* Filter status indicator */}
        <AnimatePresence>
          {hasFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'mb-2 px-2 py-1.5 rounded-md text-xs',
                theme === 'dark' ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
              )}
            >
              <div className="flex items-center gap-1.5">
                <Filter className="w-3 h-3" />
                <span>
                  {isZh
                    ? `筛选 ${filterCount} 个演示的事件`
                    : `Filtering events for ${filterCount} demo${filterCount > 1 ? 's' : ''}`
                  }
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unit list */}
        <div className={cn(
          'flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1',
          'scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent'
        )}>
          {UNITS.map((unit) => {
            const UnitIcon = unit.icon
            const isUnitExpanded = expandedUnits.has(unit.id)
            const demos = getDemosForUnit(unit.id)

            return (
              <div key={unit.id} className="relative">
                {/* Unit header row */}
                <div
                  className={cn(
                    'group flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer',
                    'shadow-sm hover:shadow-md',
                    theme === 'dark'
                      ? 'bg-slate-800/90 text-gray-300 hover:bg-slate-700'
                      : 'bg-white/90 text-gray-700 hover:bg-gray-50'
                  )}
                  style={{
                    borderLeftWidth: '3px',
                    borderLeftColor: unit.color
                  }}
                  onClick={() => toggleUnit(unit.id)}
                >
                  {/* Unit icon */}
                  <div
                    className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${unit.color}20` }}
                  >
                    <UnitIcon className="w-3 h-3" style={{ color: unit.color }} />
                  </div>

                  {/* Unit title */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-[11px]">
                      {isZh ? `${unit.id}. ${unit.titleZh}` : `${unit.id}. ${unit.titleEn}`}
                    </div>
                    <div className={cn(
                      'text-[10px]',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      {demos.length} {isZh ? '演示' : 'demos'}
                    </div>
                  </div>

                  {/* Expand/collapse button */}
                  <button
                    className={cn(
                      'flex-shrink-0 p-0.5 rounded transition-colors',
                      theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                    )}
                  >
                    {isUnitExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Demo list */}
                <AnimatePresence>
                  {isUnitExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={cn('ml-3 mt-1 pl-2 border-l-2 space-y-0.5')}
                        style={{ borderColor: `${unit.color}40` }}
                      >
                        {demos.map((demo) => {
                          const isSelected = selectedDemos.includes(demo.id)
                          const isHighlighted = isDemoHighlighted(demo.id)
                          const diffConfig = DIFFICULTY_CONFIG[demo.difficulty]
                          const hasEvents = demo.relatedEvents && demo.relatedEvents.length > 0

                          return (
                            <div
                              key={demo.id}
                              className={cn(
                                'group flex items-center gap-1.5 px-1.5 py-1.5 rounded text-[11px] transition-all cursor-pointer',
                                isHighlighted
                                  ? theme === 'dark'
                                    ? 'bg-cyan-900/40 text-cyan-300 ring-1 ring-cyan-500/50'
                                    : 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-300'
                                  : isSelected
                                    ? theme === 'dark'
                                      ? 'bg-indigo-900/30 text-indigo-300'
                                      : 'bg-indigo-50 text-indigo-700'
                                    : theme === 'dark'
                                      ? 'hover:bg-slate-700/50 text-gray-400'
                                      : 'hover:bg-gray-100 text-gray-600'
                              )}
                              onClick={(e) => {
                                if (hasEvents) {
                                  toggleDemoFilter(demo.id, e)
                                }
                              }}
                            >
                              {/* Difficulty badge */}
                              <span
                                className="flex-shrink-0 text-[9px] px-1 py-0.5 rounded"
                                style={{
                                  backgroundColor: `${diffConfig.color}20`,
                                }}
                                title={demo.difficulty}
                              >
                                {diffConfig.emoji}
                              </span>

                              {/* Demo title */}
                              <span className="flex-1 truncate">
                                {t(demo.titleKey)}
                              </span>

                              {/* Visual type badge */}
                              <span className={cn(
                                'flex-shrink-0 px-1 py-0.5 rounded text-[8px] font-medium',
                                demo.visualType === '3D'
                                  ? theme === 'dark'
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-purple-100 text-purple-600'
                                  : theme === 'dark'
                                    ? 'bg-cyan-500/20 text-cyan-300'
                                    : 'bg-cyan-100 text-cyan-600'
                              )}>
                                {demo.visualType}
                              </span>

                              {/* Related events indicator */}
                              {hasEvents && (
                                <button
                                  onClick={(e) => toggleDemoFilter(demo.id, e)}
                                  className={cn(
                                    'flex-shrink-0 p-0.5 rounded transition-all',
                                    isSelected
                                      ? theme === 'dark'
                                        ? 'text-indigo-400 bg-indigo-500/20'
                                        : 'text-indigo-600 bg-indigo-100'
                                      : 'opacity-0 group-hover:opacity-100',
                                    theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                                  )}
                                  title={isZh ? '筛选相关事件' : 'Filter related events'}
                                >
                                  <Filter className="w-3 h-3" />
                                </button>
                              )}

                              {/* Go to demo button */}
                              <button
                                onClick={(e) => goToDemo(demo.id, e)}
                                className={cn(
                                  'flex-shrink-0 p-0.5 rounded transition-all opacity-0 group-hover:opacity-100',
                                  theme === 'dark' ? 'hover:bg-slate-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                                )}
                                title={isZh ? '前往演示' : 'Go to demo'}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Bottom: Go to demos button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3"
        >
          <button
            onClick={() => navigate('/demos')}
            className={cn(
              'w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium',
              'transition-all hover:scale-105',
              theme === 'dark'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400'
            )}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isZh ? '进入演示馆' : 'All Demos'}</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// Export demos data for use in other components
export { DEMOS, UNITS }
export type { DemoItem, UnitConfig }
