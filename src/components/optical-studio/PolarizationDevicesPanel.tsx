/**
 * PolarizationDevicesPanel - 偏振器件百科面板
 *
 * 专门展示偏振相关器件的详细目录，包括：
 * - 偏振器（Polarizers）
 * - 检偏器（Analyzers）
 * - 调制器（Modulators）
 * - 波片（Wave Plates）
 * - 分束器（Splitters）
 *
 * 功能特点：
 * 1. 分类浏览 - 按器件类型分类
 * 2. 详细信息 - 原理、规格、应用
 * 3. 难度分级 - 基础/进阶/高级
 * 4. 演示链接 - 链接到相关课程演示
 * 5. 搜索过滤 - 快速找到目标器件
 */

import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/shared'
import {
  Search,
  X,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  BookOpen,
  Sparkles,
  Layers,
  Filter,
  Activity,
  Scan,
  Circle,
  Disc,
  Triangle,
  MoreHorizontal,
  Lightbulb,
  GraduationCap,
  Info,
  Zap,
} from 'lucide-react'
import {
  DEVICES,
  DEVICE_CATEGORIES,
  DIFFICULTY_CONFIG,
  type Device,
  type DeviceCategory,
} from '@/data/optical-devices'
import MathText from '../MathText'

// ============================================
// Category Icons Mapping
// ============================================

const CategoryIcon: Record<string, React.ReactNode> = {
  polarizers: <Circle className="w-4 h-4" />,
  waveplates: <Layers className="w-4 h-4" />,
  splitters: <Triangle className="w-4 h-4" />,
  retarders: <Disc className="w-4 h-4" />,
  analyzers: <Scan className="w-4 h-4" />,
  modulators: <Activity className="w-4 h-4" />,
  other: <MoreHorizontal className="w-4 h-4" />,
}

// Category colors
const CategoryColors: Record<string, string> = {
  polarizers: '#3b82f6',
  waveplates: '#8b5cf6',
  splitters: '#10b981',
  retarders: '#f59e0b',
  analyzers: '#06b6d4',
  modulators: '#ec4899',
  other: '#6b7280',
}

// ============================================
// Device Card Component
// ============================================

interface DeviceCardProps {
  device: Device
  isExpanded: boolean
  onToggle: () => void
}

function DeviceCard({ device, isExpanded, onToggle }: DeviceCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[device.difficulty]
  const categoryColor = CategoryColors[device.category] || '#6b7280'

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200 overflow-hidden',
        isExpanded ? 'shadow-lg' : 'hover:shadow-md',
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700/50'
          : 'bg-white border-gray-200'
      )}
      style={{
        borderColor: isExpanded ? categoryColor : undefined,
        boxShadow: isExpanded ? `0 0 0 1px ${categoryColor}40` : undefined,
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-3 p-3 text-left transition-colors',
          isExpanded
            ? theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50'
            : theme === 'dark' ? 'hover:bg-slate-700/20' : 'hover:bg-gray-50'
        )}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
          style={{
            backgroundColor: `${categoryColor}15`,
            color: categoryColor,
          }}
        >
          {device.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className={cn(
              'font-semibold text-sm truncate',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? device.nameZh : device.nameEn}
            </h4>
            <Badge color={difficulty.color} size="sm">
              {isZh ? difficulty.labelZh : difficulty.labelEn}
            </Badge>
          </div>
          <p className={cn(
            'text-xs line-clamp-1',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {isZh ? device.descriptionZh : device.descriptionEn}
          </p>
        </div>

        {/* Expand indicator */}
        <div className={cn(
          'shrink-0 transition-transform duration-200',
          isExpanded && 'rotate-180'
        )}>
          <ChevronDown className={cn(
            'w-4 h-4',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )} />
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={cn(
          'border-t',
          theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100'
        )}>
          {/* Principle Section */}
          <div className="p-3 space-y-3">
            {/* Working Principle */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Lightbulb className={cn('w-3.5 h-3.5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
                <span className={cn(
                  'text-[10px] font-semibold uppercase tracking-wide',
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
                )}>
                  {isZh ? '工作原理' : 'Working Principle'}
                </span>
              </div>
              <p className={cn(
                'text-xs leading-relaxed',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                {isZh ? device.principleZh : device.principleEn}
              </p>
            </div>

            {/* Formula */}
            {device.mathFormula && (
              <div className={cn(
                'p-2 rounded-lg',
                theme === 'dark'
                  ? 'bg-cyan-500/10 border border-cyan-500/20'
                  : 'bg-cyan-50 border border-cyan-200'
              )}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className={cn('w-3 h-3', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                  <span className={cn(
                    'text-[10px] font-semibold',
                    theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
                  )}>
                    {isZh ? '核心公式' : 'Key Formula'}
                  </span>
                </div>
                <code className={cn(
                  'text-sm font-mono block',
                  theme === 'dark' ? 'text-cyan-300' : 'text-cyan-800'
                )}>
                  {device.mathFormula}
                </code>
              </div>
            )}

            {/* Specifications */}
            {device.specifications && device.specifications.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Info className={cn('w-3.5 h-3.5', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
                  <span className={cn(
                    'text-[10px] font-semibold uppercase tracking-wide',
                    theme === 'dark' ? 'text-violet-400' : 'text-violet-700'
                  )}>
                    {isZh ? '技术规格' : 'Specifications'}
                  </span>
                </div>
                <div className={cn(
                  'rounded-lg overflow-hidden border',
                  theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                )}>
                  {device.specifications.map((spec, idx) => (
                    <div
                      key={spec.key}
                      className={cn(
                        'flex items-center justify-between px-2.5 py-1.5 text-xs',
                        idx % 2 === 0
                          ? theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-50'
                          : theme === 'dark' ? 'bg-slate-800/60' : 'bg-white'
                      )}
                    >
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        {spec.key}
                      </span>
                      <span className={cn('font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                        {MathText({ text: isZh ? spec.valueZh : spec.valueEn })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications */}
            {device.applications && (
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className={cn('w-3.5 h-3.5', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')} />
                  <span className={cn(
                    'text-[10px] font-semibold uppercase tracking-wide',
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                  )}>
                    {isZh ? '应用场景' : 'Applications'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(isZh ? device.applications.zh : device.applications.en).map((app, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px]',
                        theme === 'dark'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      )}
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Devices */}
            {device.relatedDevices && device.relatedDevices.length > 0 && (
              <div className={cn(
                'flex items-center gap-2 pt-2 border-t',
                theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100'
              )}>
                <span className={cn(
                  'text-[10px]',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  {isZh ? '相关器件:' : 'Related:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {device.relatedDevices.map((relId) => {
                    const relDevice = DEVICES.find(d => d.id === relId)
                    if (!relDevice) return null
                    return (
                      <span
                        key={relId}
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[10px]',
                          theme === 'dark'
                            ? 'bg-slate-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {isZh ? relDevice.nameZh : relDevice.nameEn}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className={cn(
            'flex items-center justify-between px-3 py-2 border-t',
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-gray-50 border-gray-100'
          )}>
            {device.benchComponentType ? (
              <span className={cn(
                'text-[10px] px-2 py-0.5 rounded-full',
                theme === 'dark'
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'bg-violet-100 text-violet-700'
              )}>
                {isZh ? '可在工作台使用' : 'Available on bench'}
              </span>
            ) : (
              <span className={cn(
                'text-[10px]',
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              )}>
                {isZh ? '仅供参考' : 'Reference only'}
              </span>
            )}
            <Link
              to="/demos"
              className={cn(
                'flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors',
                theme === 'dark'
                  ? 'text-cyan-400 hover:bg-cyan-500/10'
                  : 'text-cyan-600 hover:bg-cyan-50'
              )}
            >
              <GraduationCap className="w-3 h-3" />
              {isZh ? '学习更多' : 'Learn More'}
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Category Filter Chip
// ============================================

interface CategoryChipProps {
  category: typeof DEVICE_CATEGORIES[number]
  isActive: boolean
  count: number
  onClick: () => void
}

function CategoryChip({ category, isActive, count, onClick }: CategoryChipProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const color = category.id === 'all' ? '#6366f1' : CategoryColors[category.id as string] || '#6b7280'

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
        isActive
          ? 'scale-105'
          : 'opacity-70 hover:opacity-100'
      )}
      style={{
        backgroundColor: isActive ? `${color}20` : theme === 'dark' ? '#1e293b' : '#f1f5f9',
        color: isActive ? color : theme === 'dark' ? '#94a3b8' : '#64748b',
        border: `1px solid ${isActive ? color : 'transparent'}`,
        boxShadow: isActive ? `0 2px 8px ${color}30` : undefined,
      }}
    >
      {category.id !== 'all' && CategoryIcon[category.id as string]}
      <span>{isZh ? category.labelZh : category.labelEn}</span>
      <span className={cn(
        'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
        isActive
          ? theme === 'dark' ? 'bg-white/20' : 'bg-black/10'
          : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
      )}>
        {count}
      </span>
    </button>
  )
}

// ============================================
// Main Panel Component
// ============================================

interface PolarizationDevicesPanelProps {
  onClose?: () => void
  compact?: boolean
}

export function PolarizationDevicesPanel({ onClose, compact: _compact = false }: PolarizationDevicesPanelProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | 'all'>('all')
  const [expandedDeviceId, setExpandedDeviceId] = useState<string | null>(null)

  // Filter devices
  const filteredDevices = useMemo(() => {
    let devices = DEVICES

    // Category filter
    if (selectedCategory !== 'all') {
      devices = devices.filter(d => d.category === selectedCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      devices = devices.filter(d =>
        d.nameEn.toLowerCase().includes(query) ||
        d.nameZh.includes(searchQuery) ||
        d.descriptionEn.toLowerCase().includes(query) ||
        d.descriptionZh.includes(searchQuery)
      )
    }

    return devices
  }, [selectedCategory, searchQuery])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: DEVICES.length }
    DEVICES.forEach(d => {
      counts[d.category] = (counts[d.category] || 0) + 1
    })
    return counts
  }, [])

  const handleDeviceToggle = useCallback((deviceId: string) => {
    setExpandedDeviceId(prev => prev === deviceId ? null : deviceId)
  }, [])

  return (
    <div className={cn(
      'flex flex-col h-full',
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    )}>
      {/* Header */}
      <div className={cn(
        'shrink-0 p-4 border-b',
        theme === 'dark'
          ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-slate-800'
          : 'bg-gradient-to-r from-indigo-50 to-violet-50 border-gray-200'
      )}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              theme === 'dark'
                ? 'bg-gradient-to-br from-indigo-500/30 to-violet-500/30'
                : 'bg-gradient-to-br from-indigo-100 to-violet-100'
            )}>
              <BookOpen className={cn(
                'w-5 h-5',
                theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
              )} />
            </div>
            <div>
              <h2 className={cn(
                'font-bold text-base',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '偏振器件百科' : 'Polarization Devices'}
              </h2>
              <p className={cn(
                'text-xs',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                {isZh ? `收录 ${DEVICES.length} 种专业偏振光学器件` : `${DEVICES.length} professional polarization optical devices`}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-lg transition-colors',
                theme === 'dark'
                  ? 'hover:bg-slate-800 text-gray-400'
                  : 'hover:bg-white text-gray-500'
              )}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )} />
          <input
            type="text"
            placeholder={isZh ? '搜索器件名称或描述...' : 'Search device name or description...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm',
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 focus:border-indigo-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded',
                theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
              )}
            >
              <X className={cn('w-3 h-3', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className={cn(
        'shrink-0 px-4 py-3 border-b overflow-x-auto',
        theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
      )}>
        <div className="flex gap-2">
          {DEVICE_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              isActive={selectedCategory === cat.id}
              count={categoryCounts[cat.id] || 0}
              onClick={() => setSelectedCategory(cat.id as DeviceCategory | 'all')}
            />
          ))}
        </div>
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredDevices.length === 0 ? (
          <div className={cn(
            'text-center py-12',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            <Filter className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {isZh ? '未找到匹配的器件' : 'No matching devices found'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className={cn(
                'mt-2 text-xs px-3 py-1 rounded-full',
                theme === 'dark'
                  ? 'bg-slate-800 text-indigo-400 hover:bg-slate-700'
                  : 'bg-gray-100 text-indigo-600 hover:bg-gray-200'
              )}
            >
              {isZh ? '清除筛选' : 'Clear filters'}
            </button>
          </div>
        ) : (
          filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              isExpanded={expandedDeviceId === device.id}
              onToggle={() => handleDeviceToggle(device.id)}
            />
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className={cn(
        'shrink-0 px-4 py-2 border-t flex items-center justify-between text-xs',
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-800 text-gray-500'
          : 'bg-gray-50 border-gray-200 text-gray-400'
      )}>
        <span>
          {isZh
            ? `显示 ${filteredDevices.length} / ${DEVICES.length} 个器件`
            : `Showing ${filteredDevices.length} of ${DEVICES.length} devices`}
        </span>
        <Link
          to="/demos"
          className={cn(
            'flex items-center gap-1 transition-colors',
            theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
          )}
        >
          <GraduationCap className="w-3 h-3" />
          {isZh ? '课程演示' : 'Course Demos'}
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

export default PolarizationDevicesPanel
