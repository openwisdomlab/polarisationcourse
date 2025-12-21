/**
 * CourseNavigator - 课程导航组件 (重构版)
 *
 * 功能：
 * 1. 显示所有课程单元和演示的层级结构
 * 2. 支持复选框多选课程模块进行筛选历史事件
 * 3. 显示每个模块关联的历史事件数量
 * 4. 多对多关系：一个演示可关联多个事件，一个事件可关联多个演示
 */

import { useState, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useCourseProgress } from '@/hooks'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  History,
  Filter,
  X,
  Check,
  Square,
  CheckSquare,
  FlaskConical,
  Play,
  Eye,
  Lightbulb,
  Zap,
  Sparkles,
  Target,
  Telescope,
  Beaker
} from 'lucide-react'

// 导入课程-事件映射数据
import {
  UNIT_INFO,
  getEventCountByDemo,
  getDemosByUnit,
} from '@/data/course-event-mapping'

// 单元图标映射
const UNIT_ICONS = [Lightbulb, Zap, Sparkles, Beaker, Target, Telescope]

interface CourseNavigatorProps {
  className?: string
  selectedDemos: string[]
  onFilterChange: (selectedDemos: string[]) => void
}

export function CourseNavigator({
  className,
  selectedDemos,
  onFilterChange
}: CourseNavigatorProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const isZh = i18n.language === 'zh'
  const { progress } = useCourseProgress()

  // 状态管理
  const [isExpanded, setIsExpanded] = useState(false)          // 移动端展开/折叠
  const [expandedUnits, setExpandedUnits] = useState<Set<number>>(new Set([0])) // 展开的单元
  const [isFilterMode, setIsFilterMode] = useState(false)       // 是否处于筛选模式

  // 计算选中的演示数量和是否有筛选
  const hasFilter = selectedDemos.length > 0
  const filterCount = selectedDemos.length

  // 按单元分组的演示
  const demosByUnit = useMemo(() => {
    return UNIT_INFO.map(unit => ({
      ...unit,
      demos: getDemosByUnit(unit.id),
      Icon: UNIT_ICONS[unit.id] || FlaskConical
    }))
  }, [])

  // 切换单元展开/折叠
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

  // 切换演示选择
  const toggleDemo = useCallback((demoId: string) => {
    const newSelected = selectedDemos.includes(demoId)
      ? selectedDemos.filter(id => id !== demoId)
      : [...selectedDemos, demoId]
    onFilterChange(newSelected)
  }, [selectedDemos, onFilterChange])

  // 选择整个单元的所有演示
  const selectUnit = useCallback((unitId: number) => {
    const unitDemos = getDemosByUnit(unitId).map(d => d.id)
    const allSelected = unitDemos.every(id => selectedDemos.includes(id))

    if (allSelected) {
      // 取消选择该单元所有演示
      onFilterChange(selectedDemos.filter(id => !unitDemos.includes(id)))
    } else {
      // 选择该单元所有演示
      const newSelected = [...new Set([...selectedDemos, ...unitDemos])]
      onFilterChange(newSelected)
    }
  }, [selectedDemos, onFilterChange])

  // 清除所有筛选
  const clearFilter = useCallback(() => {
    onFilterChange([])
    setIsFilterMode(false)
  }, [onFilterChange])

  // 检查单元是否全选
  const isUnitSelected = useCallback((unitId: number) => {
    const unitDemos = getDemosByUnit(unitId).map(d => d.id)
    return unitDemos.every(id => selectedDemos.includes(id))
  }, [selectedDemos])

  // 检查单元是否部分选择
  const isUnitPartiallySelected = useCallback((unitId: number) => {
    const unitDemos = getDemosByUnit(unitId).map(d => d.id)
    const someSelected = unitDemos.some(id => selectedDemos.includes(id))
    const allSelected = unitDemos.every(id => selectedDemos.includes(id))
    return someSelected && !allSelected
  }, [selectedDemos])

  // 获取演示的进度状态
  const isDemoCompleted = useCallback((demoId: string) => {
    return progress.completedDemos.includes(demoId)
  }, [progress.completedDemos])

  return (
    <div className={cn(
      'fixed left-4 top-1/2 -translate-y-1/2 z-30',
      'flex flex-col items-start gap-1',
      className
    )}>
      {/* 移动端切换按钮 */}
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

      {/* 主容器 */}
      <div className={cn(
        'transition-all duration-300',
        'md:opacity-100 md:translate-x-0',
        isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full md:opacity-100 md:translate-x-0',
        'pointer-events-auto'
      )}>
        {/* 头部：标题和筛选控制 */}
        <div className={cn(
          'flex items-center justify-between gap-2 mb-2 px-2 py-1.5 rounded-lg',
          theme === 'dark' ? 'bg-slate-800/90' : 'bg-white/90',
          'shadow-sm'
        )}>
          <div className="flex items-center gap-1.5">
            <GraduationCap className={cn(
              'w-4 h-4',
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            )} />
            <span className={cn(
              'text-xs font-semibold',
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            )}>
              {isZh ? '课程章节' : 'Chapters'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* 筛选模式切换 */}
            <button
              onClick={() => setIsFilterMode(!isFilterMode)}
              className={cn(
                'p-1.5 rounded-md transition-all',
                isFilterMode
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
              title={isZh ? '筛选历史事件' : 'Filter timeline events'}
            >
              <Filter className="w-3.5 h-3.5" />
            </button>

            {/* 清除筛选 */}
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
        </div>

        {/* 筛选状态提示 */}
        <AnimatePresence>
          {hasFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'mb-2 px-2 py-1.5 rounded-md text-xs',
                theme === 'dark' ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700'
              )}
            >
              <div className="flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                <span>
                  {isZh
                    ? `显示 ${filterCount} 个模块相关事件`
                    : `Showing events for ${filterCount} module${filterCount > 1 ? 's' : ''}`
                  }
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 课程单元列表 */}
        <div className={cn(
          'flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1',
          'scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent'
        )}>
          {demosByUnit.map((unit) => {
            const Icon = unit.Icon
            const isExpanded = expandedUnits.has(unit.id)
            const isSelected = isUnitSelected(unit.id)
            const isPartial = isUnitPartiallySelected(unit.id)

            return (
              <div key={unit.id} className="relative">
                {/* 单元标题行 */}
                <div
                  className={cn(
                    'group flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer',
                    'shadow-sm hover:shadow-md',
                    theme === 'dark'
                      ? 'bg-slate-800/90 text-gray-300 hover:bg-slate-700'
                      : 'bg-white/90 text-gray-700 hover:bg-gray-50',
                    isSelected && 'ring-2 ring-offset-1',
                    isPartial && 'ring-1 ring-offset-1'
                  )}
                  style={{
                    borderLeftWidth: '3px',
                    borderLeftColor: unit.color,
                    ...(isSelected || isPartial ? { ringColor: unit.color } : {})
                  }}
                >
                  {/* 筛选模式：复选框 */}
                  {isFilterMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        selectUnit(unit.id)
                      }}
                      className={cn(
                        'flex-shrink-0 p-0.5 rounded transition-colors',
                        theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                      )}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4" style={{ color: unit.color }} />
                      ) : isPartial ? (
                        <div className="relative">
                          <Square className="w-4 h-4" style={{ color: unit.color }} />
                          <div
                            className="absolute inset-1 rounded-sm"
                            style={{ backgroundColor: unit.color }}
                          />
                        </div>
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  )}

                  {/* 单元图标 */}
                  <div
                    className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${unit.color}20` }}
                  >
                    <Icon className="w-3 h-3" style={{ color: unit.color }} />
                  </div>

                  {/* 单元标题 */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => toggleUnit(unit.id)}
                  >
                    <div className="font-medium truncate text-[11px]">
                      {isZh ? unit.titleZh : unit.titleEn}
                    </div>
                    <div className={cn(
                      'text-[10px]',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      {unit.demos.length} {isZh ? '演示' : 'demos'}
                    </div>
                  </div>

                  {/* 展开/折叠按钮 */}
                  <button
                    onClick={() => toggleUnit(unit.id)}
                    className={cn(
                      'flex-shrink-0 p-0.5 rounded transition-colors',
                      theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                    )}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* 演示列表 */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={cn(
                        'ml-3 mt-1 pl-2 border-l-2 space-y-0.5',
                      )}
                      style={{ borderColor: `${unit.color}40` }}
                      >
                        {unit.demos.map((demo) => {
                          const isSelected = selectedDemos.includes(demo.id)
                          const eventCount = getEventCountByDemo(demo.id)
                          const isCompleted = isDemoCompleted(demo.id)

                          return (
                            <div
                              key={demo.id}
                              className={cn(
                                'group flex items-center gap-1.5 px-1.5 py-1 rounded text-[11px] transition-all',
                                isSelected
                                  ? theme === 'dark'
                                    ? 'bg-blue-900/30 text-blue-300'
                                    : 'bg-blue-50 text-blue-700'
                                  : theme === 'dark'
                                    ? 'hover:bg-slate-700/50 text-gray-400'
                                    : 'hover:bg-gray-100 text-gray-600'
                              )}
                            >
                              {/* 筛选模式：复选框 */}
                              {isFilterMode && (
                                <button
                                  onClick={() => toggleDemo(demo.id)}
                                  className="flex-shrink-0"
                                >
                                  {isSelected ? (
                                    <CheckSquare className="w-3.5 h-3.5" style={{ color: unit.color }} />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-gray-400" />
                                  )}
                                </button>
                              )}

                              {/* 完成状态 */}
                              {!isFilterMode && isCompleted && (
                                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                              )}

                              {/* 演示标题 */}
                              <span
                                className={cn(
                                  'flex-1 truncate cursor-pointer',
                                  isCompleted && !isFilterMode && 'line-through opacity-60'
                                )}
                                onClick={() => {
                                  if (isFilterMode) {
                                    toggleDemo(demo.id)
                                  } else {
                                    navigate(demo.route)
                                  }
                                }}
                              >
                                {isZh ? demo.titleZh : demo.titleEn}
                              </span>

                              {/* 关联事件数量 */}
                              {eventCount > 0 && (
                                <span className={cn(
                                  'flex-shrink-0 px-1 py-0.5 rounded text-[9px] font-medium',
                                  theme === 'dark'
                                    ? 'bg-amber-900/30 text-amber-400'
                                    : 'bg-amber-50 text-amber-600'
                                )}>
                                  <History className="w-2.5 h-2.5 inline mr-0.5" />
                                  {eventCount}
                                </span>
                              )}

                              {/* 跳转到演示 */}
                              {!isFilterMode && (
                                <button
                                  onClick={() => navigate(demo.route)}
                                  className={cn(
                                    'flex-shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity',
                                    theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                                  )}
                                >
                                  <Play className="w-3 h-3" style={{ color: unit.color }} />
                                </button>
                              )}
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

        {/* 底部：开始学习按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3"
        >
          <Link
            to="/course"
            className={cn(
              'flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium',
              'transition-all hover:scale-105',
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400'
            )}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isZh ? '开始学习' : 'Start Learning'}</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
