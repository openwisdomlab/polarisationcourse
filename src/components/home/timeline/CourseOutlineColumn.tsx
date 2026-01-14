/**
 * CourseOutlineColumn Component
 * Extracted from HomePage for better organization
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { BookOpen, Sparkles, Lightbulb, Zap, Target, Telescope, ChevronDown, ChevronRight, Layers, Eye, Users } from 'lucide-react'
import { COURSE_TIMELINE_MAPPINGS, type CourseTimelineMapping } from '@/data/course-timeline-integration'
import { PSRT_CURRICULUM } from '@/data/psrt-curriculum'

interface CourseOutlineColumnProps {
  theme: 'dark' | 'light'
  isZh: boolean
  activeUnitId: string | null
  onUnitClick: (unitId: string | null, years?: number[]) => void
}

function CourseOutlineColumn({
  theme,
  isZh,
  activeUnitId,
  onUnitClick,
}: CourseOutlineColumnProps) {
  const unitColors = ['#22D3EE', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899']
  const unitIcons = [
    <Lightbulb key="1" className="w-5 h-5" />,
    <Zap key="2" className="w-5 h-5" />,
    <Sparkles key="3" className="w-5 h-5" />,
    <Target key="4" className="w-5 h-5" />,
    <Telescope key="5" className="w-5 h-5" />,
  ]

  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null)

  const handleUnitClick = (unitId: string, mapping?: CourseTimelineMapping) => {
    if (expandedUnitId === unitId) {
      // Clicking same unit - collapse and clear filter
      setExpandedUnitId(null)
      onUnitClick(null)
    } else {
      // Clicking different unit - expand and filter
      setExpandedUnitId(unitId)
      onUnitClick(unitId, mapping?.relatedTimelineYears)
    }
  }

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden',
      theme === 'dark'
        ? 'bg-slate-800/50 border-slate-700'
        : 'bg-white/80 border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'p-4 border-b',
        theme === 'dark'
          ? 'bg-slate-800/80 border-slate-700'
          : 'bg-gray-50/80 border-gray-200'
      )}>
        <h2 className={cn(
          'text-sm font-bold flex items-center gap-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          <BookOpen className="w-4 h-4 text-amber-500" />
          {isZh ? '课程大纲' : 'Course Outline'}
        </h2>
        <p className={cn(
          'text-xs mt-1',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>
          {isZh ? '点击单元展开详情' : 'Click unit to expand details'}
        </p>
      </div>

      {/* Show All Button */}
      <div className="p-3 pb-0">
        <button
          onClick={() => {
            setExpandedUnitId(null)
            onUnitClick(null)
          }}
          className={cn(
            'w-full text-left p-3 rounded-xl border transition-all duration-200',
            !activeUnitId
              ? theme === 'dark'
                ? 'bg-slate-700 border-cyan-500 shadow-lg'
                : 'bg-white border-cyan-500 shadow-lg'
              : theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                : 'bg-gray-50 border-gray-200 hover:bg-white'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-cyan-500 to-blue-500"
            >
              <Layers className="w-4 h-4" />
            </div>
            <span className={cn(
              'text-sm font-medium',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '显示全部' : 'Show All'}
            </span>
          </div>
        </button>
      </div>

      {/* Units list - Accordion style */}
      <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
        {PSRT_CURRICULUM.map((unit, index) => {
          const mapping = COURSE_TIMELINE_MAPPINGS.find(m => m.unitNumber === unit.unitNumber)
          const color = unitColors[index % unitColors.length]
          const isExpanded = expandedUnitId === unit.id
          const isActive = activeUnitId === unit.id
          const totalDemos = unit.sections.reduce((sum, s) => sum + s.relatedDemos.length, 0)
          const totalEvents = mapping?.keyEvents?.length || 0

          return (
            <div key={unit.id} className="space-y-2">
              {/* Unit header card - always visible */}
              <motion.button
                layout
                onClick={() => handleUnitClick(unit.id, mapping)}
                className={cn(
                  'w-full text-left p-3 rounded-xl border transition-all duration-200',
                  isExpanded || isActive
                    ? theme === 'dark'
                      ? 'bg-slate-700 shadow-lg'
                      : 'bg-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-slate-800/50 hover:bg-slate-700'
                      : 'bg-gray-50 hover:bg-white'
                )}
                style={{
                  borderColor: (isExpanded || isActive) ? color : theme === 'dark' ? '#334155' : '#e5e7eb',
                  boxShadow: (isExpanded || isActive) ? `0 4px 20px ${color}20` : undefined,
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Unit number */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {unit.unitNumber}
                  </div>

                  {/* Unit info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color }}>{unitIcons[index]}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={cn(
                          'flex items-center gap-0.5',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>
                          <Eye className="w-3 h-3" />
                          {totalDemos}
                        </span>
                        <span className={cn(
                          'flex items-center gap-0.5',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>
                          <Users className="w-3 h-3" />
                          {totalEvents}
                        </span>
                      </div>
                    </div>
                    <h3 className={cn(
                      'text-sm font-semibold leading-tight',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {isZh ? unit.titleZh : unit.titleEn}
                    </h3>
                    <p className={cn(
                      'text-xs mt-1 line-clamp-1',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      {isZh ? unit.subtitleZh : unit.subtitleEn}
                    </p>
                  </div>

                  <ChevronDown className={cn(
                    'w-4 h-4 flex-shrink-0 transition-transform',
                    isExpanded && 'rotate-180',
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  )} />
                </div>
              </motion.button>

              {/* Expanded content - Accordion style */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className={cn(
                      'rounded-xl border p-3 space-y-2',
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700'
                        : 'bg-white/80 border-gray-200'
                    )}
                      style={{ borderColor: `${color}30` }}
                    >
                      {/* Course Sections */}
                      <div>
                        <h4 className={cn(
                          'text-xs font-semibold flex items-center gap-1.5 mb-2',
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>
                          <BookOpen className="w-3.5 h-3.5" style={{ color }} />
                          {isZh ? '课程内容' : 'Course Content'}
                        </h4>
                        <div className="space-y-1.5">
                          {unit.sections.map((section) => (
                            <Link
                              key={section.id}
                              to={section.relatedDemos[0] ? `/demos/${section.relatedDemos[0]}` : '/demos'}
                              className={cn(
                                'group flex items-start gap-2 p-2 rounded-lg transition-all',
                                theme === 'dark'
                                  ? 'hover:bg-slate-700/50'
                                  : 'hover:bg-gray-100'
                              )}
                            >
                              {/* Section number */}
                              <div
                                className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
                                style={{
                                  backgroundColor: `${color}15`,
                                  color,
                                }}
                              >
                                {section.id}
                              </div>

                              {/* Section info */}
                              <div className="flex-1 min-w-0">
                                <h5 className={cn(
                                  'text-xs font-medium leading-tight',
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                )}>
                                  {isZh ? section.titleZh : section.titleEn}
                                </h5>
                                <p className={cn(
                                  'text-[10px] mt-0.5 leading-snug line-clamp-2',
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                )}>
                                  {isZh ? section.descriptionZh : section.descriptionEn}
                                </p>
                              </div>

                              {/* Arrow */}
                              <ChevronRight className={cn(
                                'w-3 h-3 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity',
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              )} />
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Stats footer */}
                      <div className={cn(
                        'flex items-center justify-between pt-2 border-t text-xs',
                        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                      )}>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'flex items-center gap-1',
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          )}>
                            <Eye className="w-3 h-3" />
                            {totalDemos} {isZh ? '演示' : 'demos'}
                          </span>
                        </div>
                        <Link
                          to="/demos"
                          className={cn(
                            'text-xs font-medium transition-colors',
                            theme === 'dark'
                              ? 'text-cyan-400 hover:text-cyan-300'
                              : 'text-cyan-600 hover:text-cyan-700'
                          )}
                          style={{ color }}
                        >
                          {isZh ? '浏览演示' : 'View Demos'} →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CourseOutlineColumn
