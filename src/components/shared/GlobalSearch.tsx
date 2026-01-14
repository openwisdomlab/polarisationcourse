/**
 * GlobalSearch - 全局搜索组件
 * Global search component with modal interface
 *
 * Features:
 * - Search across demos, pages, optical devices, timeline events
 * - Keyboard shortcut (Cmd/Ctrl + K) to open
 * - Categorized results with navigation
 * - Bilingual support (English/Chinese)
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Search,
  X,
  Play,
  BookOpen,
  Calculator,
  Palette,
  Users,
  Gamepad2,
  Clock,
  Microscope,
  ArrowRight,
  Command,
  CornerDownLeft,
} from 'lucide-react'

// Import searchable data
import { TIMELINE_EVENTS } from '@/data/timeline-events'
import { DEVICES as OPTICAL_DEVICES } from '@/data/optical-devices'
import { PSRT_CURRICULUM } from '@/data/psrt-curriculum'

// ============================================================================
// Search Result Types
// ============================================================================

export type SearchCategory = 'demos' | 'pages' | 'devices' | 'timeline' | 'course'

export interface SearchResult {
  id: string
  titleEn: string
  titleZh: string
  descriptionEn?: string
  descriptionZh?: string
  category: SearchCategory
  path: string
  icon?: React.ReactNode
  meta?: string
}

// ============================================================================
// Searchable Content Registry
// ============================================================================

// Page routes data
const PAGE_ROUTES: SearchResult[] = [
  {
    id: 'demos',
    titleEn: 'Demo Gallery',
    titleZh: '偏振演示馆',
    descriptionEn: 'Interactive physics demos',
    descriptionZh: '交互式物理演示',
    category: 'pages',
    path: '/demos',
    icon: <Play className="w-4 h-4" />,
  },
  {
    id: 'optical-studio',
    titleEn: 'Optical Design Studio',
    titleZh: '光学设计室',
    descriptionEn: 'Design optical systems',
    descriptionZh: '设计光学系统',
    category: 'pages',
    path: '/optical-studio',
    icon: <Palette className="w-4 h-4" />,
  },
  {
    id: 'calc',
    titleEn: 'Calculation Workshop',
    titleZh: '计算工坊',
    descriptionEn: 'Jones, Stokes, Mueller calculators',
    descriptionZh: 'Jones、Stokes、Mueller计算器',
    category: 'pages',
    path: '/calc',
    icon: <Calculator className="w-4 h-4" />,
  },
  {
    id: 'calc-jones',
    titleEn: 'Jones Calculator',
    titleZh: 'Jones计算器',
    descriptionEn: 'Jones matrix operations',
    descriptionZh: 'Jones矩阵运算',
    category: 'pages',
    path: '/calc/jones',
    icon: <Calculator className="w-4 h-4" />,
  },
  {
    id: 'calc-stokes',
    titleEn: 'Stokes Calculator',
    titleZh: 'Stokes计算器',
    descriptionEn: 'Stokes vector calculations',
    descriptionZh: 'Stokes向量计算',
    category: 'pages',
    path: '/calc/stokes',
    icon: <Calculator className="w-4 h-4" />,
  },
  {
    id: 'calc-mueller',
    titleEn: 'Mueller Calculator',
    titleZh: 'Mueller计算器',
    descriptionEn: 'Mueller matrix operations',
    descriptionZh: 'Mueller矩阵运算',
    category: 'pages',
    path: '/calc/mueller',
    icon: <Calculator className="w-4 h-4" />,
  },
  {
    id: 'calc-poincare',
    titleEn: 'Poincaré Sphere',
    titleZh: '庞加莱球',
    descriptionEn: '3D polarization visualization',
    descriptionZh: '3D偏振态可视化',
    category: 'pages',
    path: '/calc/poincare',
    icon: <Calculator className="w-4 h-4" />,
  },
  {
    id: 'lab',
    titleEn: 'Research Lab',
    titleZh: '虚拟课题组',
    descriptionEn: 'Research simulation',
    descriptionZh: '科研模拟',
    category: 'pages',
    path: '/lab',
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: 'games',
    titleEn: 'Games Hub',
    titleZh: '游戏中心',
    descriptionEn: 'Polarization puzzle games',
    descriptionZh: '偏振光益智游戏',
    category: 'pages',
    path: '/games',
    icon: <Gamepad2 className="w-4 h-4" />,
  },
  {
    id: 'games-2d',
    titleEn: '2D Puzzle Game',
    titleZh: '2D益智游戏',
    descriptionEn: 'SVG-based puzzle game',
    descriptionZh: '基于SVG的益智游戏',
    category: 'pages',
    path: '/games/2d',
    icon: <Gamepad2 className="w-4 h-4" />,
  },
  {
    id: 'games-3d',
    titleEn: '3D Voxel Game',
    titleZh: '3D体素游戏',
    descriptionEn: 'Minecraft-style puzzle',
    descriptionZh: 'Minecraft风格的益智游戏',
    category: 'pages',
    path: '/games/3d',
    icon: <Gamepad2 className="w-4 h-4" />,
  },
  {
    id: 'chronicles',
    titleEn: 'Chronicles',
    titleZh: '光的编年史',
    descriptionEn: 'History of optics',
    descriptionZh: '光学历史',
    category: 'pages',
    path: '/chronicles',
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: 'course',
    titleEn: 'Course',
    titleZh: '课程',
    descriptionEn: 'Structured learning path',
    descriptionZh: '结构化学习路径',
    category: 'pages',
    path: '/course',
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: 'experiments',
    titleEn: 'Experiments Lab',
    titleZh: '偏振造物局',
    descriptionEn: 'Creative experiments',
    descriptionZh: '创意实验',
    category: 'pages',
    path: '/experiments',
    icon: <Microscope className="w-4 h-4" />,
  },
]

// Demo data (will be populated from translation keys)
const DEMO_ITEMS: { id: string; titleKey: string; descriptionKey: string; unit: number }[] = [
  { id: 'em-wave', titleKey: 'basics.demos.emWave.title', descriptionKey: 'basics.demos.emWave.description', unit: 0 },
  { id: 'polarization-intro', titleKey: 'basics.demos.polarizationIntro.title', descriptionKey: 'basics.demos.polarizationIntro.description', unit: 0 },
  { id: 'polarization-types-unified', titleKey: 'basics.demos.polarizationTypesUnified.title', descriptionKey: 'basics.demos.polarizationTypesUnified.description', unit: 0 },
  { id: 'optical-bench', titleKey: 'basics.demos.opticalBench.title', descriptionKey: 'basics.demos.opticalBench.description', unit: 0 },
  { id: 'polarization-state', titleKey: 'demos.polarizationState.title', descriptionKey: 'demos.polarizationState.description', unit: 1 },
  { id: 'malus-law', titleKey: 'demos.malusLaw.title', descriptionKey: 'demos.malusLaw.description', unit: 1 },
  { id: 'birefringence', titleKey: 'demos.birefringence.title', descriptionKey: 'demos.birefringence.description', unit: 1 },
  { id: 'waveplate', titleKey: 'demos.waveplate.title', descriptionKey: 'demos.waveplate.description', unit: 1 },
  { id: 'fresnel', titleKey: 'demos.fresnel.title', descriptionKey: 'demos.fresnel.description', unit: 2 },
  { id: 'brewster', titleKey: 'demos.brewster.title', descriptionKey: 'demos.brewster.description', unit: 2 },
  { id: 'chromatic', titleKey: 'demos.chromatic.title', descriptionKey: 'demos.chromatic.description', unit: 3 },
  { id: 'anisotropy', titleKey: 'demos.anisotropy.title', descriptionKey: 'demos.anisotropy.description', unit: 3 },
  { id: 'optical-rotation', titleKey: 'demos.opticalRotation.title', descriptionKey: 'demos.opticalRotation.description', unit: 3 },
  { id: 'rayleigh-scattering', titleKey: 'demos.rayleighScattering.title', descriptionKey: 'demos.rayleighScattering.description', unit: 4 },
  { id: 'mie-scattering', titleKey: 'demos.mieScattering.title', descriptionKey: 'demos.mieScattering.description', unit: 4 },
  { id: 'stokes-vector', titleKey: 'demos.stokesVector.title', descriptionKey: 'demos.stokesVector.description', unit: 5 },
  { id: 'mueller-matrix', titleKey: 'demos.muellerMatrix.title', descriptionKey: 'demos.muellerMatrix.description', unit: 5 },
  { id: 'jones-matrix', titleKey: 'demos.jonesMatrix.title', descriptionKey: 'demos.jonesMatrix.description', unit: 5 },
]

// ============================================================================
// Search Component
// ============================================================================

interface GlobalSearchProps {
  className?: string
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Build searchable data
  const searchData = useMemo((): SearchResult[] => {
    const results: SearchResult[] = []

    // Add page routes
    results.push(...PAGE_ROUTES)

    // Add demos with translated titles
    DEMO_ITEMS.forEach(demo => {
      const titleEn = t(demo.titleKey, { lng: 'en' })
      const titleZh = t(demo.titleKey, { lng: 'zh' })
      const descEn = t(demo.descriptionKey, { lng: 'en' })
      const descZh = t(demo.descriptionKey, { lng: 'zh' })

      results.push({
        id: `demo-${demo.id}`,
        titleEn: titleEn !== demo.titleKey ? titleEn : demo.id,
        titleZh: titleZh !== demo.titleKey ? titleZh : demo.id,
        descriptionEn: descEn !== demo.descriptionKey ? descEn : undefined,
        descriptionZh: descZh !== demo.descriptionKey ? descZh : undefined,
        category: 'demos',
        path: `/demos/${demo.id}`,
        icon: <Play className="w-4 h-4" />,
        meta: `Unit ${demo.unit}`,
      })
    })

    // Add optical devices
    if (OPTICAL_DEVICES) {
      OPTICAL_DEVICES.forEach((device) => {
        results.push({
          id: `device-${device.id}`,
          titleEn: device.nameEn,
          titleZh: device.nameZh,
          descriptionEn: device.descriptionEn,
          descriptionZh: device.descriptionZh,
          category: 'devices',
          path: '/optical-studio',
          icon: <Microscope className="w-4 h-4" />,
          meta: device.category,
        })
      })
    }

    // Add timeline events
    if (TIMELINE_EVENTS) {
      TIMELINE_EVENTS.forEach((event) => {
        results.push({
          id: `timeline-${event.year}-${event.titleEn}`,
          titleEn: event.titleEn,
          titleZh: event.titleZh,
          descriptionEn: event.descriptionEn,
          descriptionZh: event.descriptionZh,
          category: 'timeline',
          path: '/',
          icon: <Clock className="w-4 h-4" />,
          meta: String(event.year),
        })
      })
    }

    // Add course units
    if (PSRT_CURRICULUM) {
      PSRT_CURRICULUM.forEach((unit) => {
        results.push({
          id: `course-${unit.id}`,
          titleEn: unit.titleEn,
          titleZh: unit.titleZh,
          descriptionEn: unit.subtitleEn,
          descriptionZh: unit.subtitleZh,
          category: 'course',
          path: '/course',
          icon: <BookOpen className="w-4 h-4" />,
          meta: `Unit ${unit.unitNumber}`,
        })
      })
    }

    return results
  }, [t])

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase().trim()
    const words = lowerQuery.split(/\s+/)

    return searchData
      .filter(item => {
        const titleMatch = item.titleEn.toLowerCase().includes(lowerQuery) ||
          item.titleZh.includes(lowerQuery)
        const descMatch = item.descriptionEn?.toLowerCase().includes(lowerQuery) ||
          item.descriptionZh?.includes(lowerQuery)
        const metaMatch = item.meta?.toLowerCase().includes(lowerQuery)

        // Also try matching individual words
        const wordsMatch = words.every(word =>
          item.titleEn.toLowerCase().includes(word) ||
          item.titleZh.includes(word) ||
          item.descriptionEn?.toLowerCase().includes(word) ||
          item.descriptionZh?.includes(word)
        )

        return titleMatch || descMatch || metaMatch || wordsMatch
      })
      .slice(0, 20) // Limit to 20 results
  }, [query, searchData])

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: Record<SearchCategory, SearchResult[]> = {
      pages: [],
      demos: [],
      devices: [],
      timeline: [],
      course: [],
    }

    filteredResults.forEach(result => {
      groups[result.category].push(result)
    })

    return groups
  }, [filteredResults])

  // Category labels
  const categoryLabels: Record<SearchCategory, { en: string; zh: string }> = {
    pages: { en: 'Pages', zh: '页面' },
    demos: { en: 'Demos', zh: '演示' },
    devices: { en: 'Optical Devices', zh: '光学器件' },
    timeline: { en: 'Timeline', zh: '时间线' },
    course: { en: 'Course', zh: '课程' },
  }

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Handle keyboard navigation in results
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
      e.preventDefault()
      handleSelect(filteredResults[selectedIndex])
    }
  }, [filteredResults, selectedIndex])

  // Handle result selection
  const handleSelect = useCallback((result: SearchResult) => {
    setIsOpen(false)
    navigate(result.path)
  }, [navigate])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && filteredResults.length > 0) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`)
      selectedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex, filteredResults.length])

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg transition-colors',
          theme === 'dark'
            ? 'hover:bg-slate-800 text-gray-400 hover:text-white'
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900',
          className
        )}
        title={isZh ? '搜索 (⌘K)' : 'Search (⌘K)'}
      >
        <Search className="w-5 h-5" />
        <span className={cn(
          'hidden sm:flex items-center gap-1 text-xs',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>
          <Command className="w-3 h-3" />
          <span>K</span>
        </span>
      </button>

      {/* Search modal backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Search modal */}
      {isOpen && (
        <div
          className={cn(
            'fixed top-[10%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-2xl',
            'rounded-2xl shadow-2xl overflow-hidden',
            theme === 'dark'
              ? 'bg-slate-900 border border-slate-700'
              : 'bg-white border border-gray-200'
          )}
        >
          {/* Search input */}
          <div className={cn(
            'flex items-center gap-3 px-4 py-3 border-b',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}>
            <Search className={cn(
              'w-5 h-5 flex-shrink-0',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder={isZh ? '搜索演示、页面、器件...' : 'Search demos, pages, devices...'}
              className={cn(
                'flex-1 bg-transparent outline-none text-base',
                theme === 'dark'
                  ? 'text-white placeholder:text-gray-500'
                  : 'text-gray-900 placeholder:text-gray-400'
              )}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className={cn(
                  'p-1 rounded',
                  theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                )}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium',
                theme === 'dark'
                  ? 'bg-slate-800 text-gray-400'
                  : 'bg-gray-100 text-gray-500'
              )}
            >
              ESC
            </button>
          </div>

          {/* Search results */}
          <div
            ref={resultsRef}
            className="max-h-[60vh] overflow-y-auto"
          >
            {query && filteredResults.length === 0 && (
              <div className={cn(
                'py-12 text-center',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {isZh ? '未找到匹配结果' : 'No results found'}
                </p>
              </div>
            )}

            {filteredResults.length > 0 && (
              <div className="py-2">
                {(['pages', 'demos', 'devices', 'course', 'timeline'] as SearchCategory[]).map(category => {
                  const items = groupedResults[category]
                  if (items.length === 0) return null

                  return (
                    <div key={category}>
                      {/* Category header */}
                      <div className={cn(
                        'px-4 py-2 text-xs font-medium uppercase tracking-wider',
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      )}>
                        {isZh ? categoryLabels[category].zh : categoryLabels[category].en}
                      </div>

                      {/* Category items */}
                      {items.map((item) => {
                        const globalIndex = filteredResults.indexOf(item)
                        const isSelected = globalIndex === selectedIndex

                        return (
                          <button
                            key={item.id}
                            data-index={globalIndex}
                            onClick={() => handleSelect(item)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                              isSelected
                                ? theme === 'dark'
                                  ? 'bg-slate-800'
                                  : 'bg-gray-100'
                                : theme === 'dark'
                                  ? 'hover:bg-slate-800/50'
                                  : 'hover:bg-gray-50'
                            )}
                          >
                            {/* Icon */}
                            <div className={cn(
                              'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                              theme === 'dark'
                                ? 'bg-slate-700 text-cyan-400'
                                : 'bg-gray-100 text-cyan-600'
                            )}>
                              {item.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  'font-medium truncate',
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                )}>
                                  {isZh ? item.titleZh : item.titleEn}
                                </span>
                                {item.meta && (
                                  <span className={cn(
                                    'text-xs px-1.5 py-0.5 rounded flex-shrink-0',
                                    theme === 'dark'
                                      ? 'bg-slate-700 text-gray-400'
                                      : 'bg-gray-200 text-gray-500'
                                  )}>
                                    {item.meta}
                                  </span>
                                )}
                              </div>
                              {(item.descriptionEn || item.descriptionZh) && (
                                <p className={cn(
                                  'text-xs truncate mt-0.5',
                                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                )}>
                                  {isZh ? item.descriptionZh : item.descriptionEn}
                                </p>
                              )}
                            </div>

                            {/* Arrow indicator */}
                            {isSelected && (
                              <ArrowRight className={cn(
                                'w-4 h-4 flex-shrink-0',
                                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                              )} />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Empty state with suggestions */}
            {!query && (
              <div className={cn(
                'py-8 px-4',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                <p className="text-sm text-center mb-4">
                  {isZh ? '快速访问' : 'Quick access'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {PAGE_ROUTES.slice(0, 6).map(route => (
                    <button
                      key={route.id}
                      onClick={() => handleSelect(route)}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg text-left transition-colors',
                        theme === 'dark'
                          ? 'hover:bg-slate-800'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      <span className={cn(
                        'w-6 h-6 rounded flex items-center justify-center',
                        theme === 'dark'
                          ? 'bg-slate-700 text-cyan-400'
                          : 'bg-gray-100 text-cyan-600'
                      )}>
                        {route.icon}
                      </span>
                      <span className="text-sm truncate">
                        {isZh ? route.titleZh : route.titleEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with keyboard hints */}
          <div className={cn(
            'px-4 py-2 border-t flex items-center justify-between text-xs',
            theme === 'dark'
              ? 'border-slate-700 text-gray-500'
              : 'border-gray-200 text-gray-400'
          )}>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className={cn(
                  'px-1.5 py-0.5 rounded',
                  theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                )}>↑</kbd>
                <kbd className={cn(
                  'px-1.5 py-0.5 rounded',
                  theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                )}>↓</kbd>
                <span>{isZh ? '导航' : 'Navigate'}</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className={cn(
                  'px-1.5 py-0.5 rounded flex items-center',
                  theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                )}>
                  <CornerDownLeft className="w-3 h-3" />
                </kbd>
                <span>{isZh ? '选择' : 'Select'}</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className={cn(
                'px-1.5 py-0.5 rounded',
                theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
              )}>ESC</kbd>
              <span>{isZh ? '关闭' : 'Close'}</span>
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default GlobalSearch
