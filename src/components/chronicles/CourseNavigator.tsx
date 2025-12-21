/**
 * CourseNavigator - 课程导航组件
 * 在时间线左侧提供快速跳转到不同课程单元的导航条
 * 设计参考右侧的 CenturyNavigator，但带有增强的交互效果
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useCourseProgress } from '@/hooks'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Zap,
  Sparkles,
  Target,
  Telescope,
  BookOpen,
  Play,
  CheckCircle,
  FlaskConical,
  Gamepad2,
  ChevronDown,
  GraduationCap
} from 'lucide-react'

// Course unit data matching CoursePage structure
const COURSE_UNITS = [
  {
    id: 'unit1',
    icon: Lightbulb,
    color: '#C9A227', // amber
    demos: ['light-wave', 'polarization-intro', 'polarization-types', 'birefringence', 'malus'],
    games: ['/game2d?level=0', '/game2d?level=1'],
  },
  {
    id: 'unit2',
    icon: Zap,
    color: '#6366F1', // indigo
    demos: ['fresnel', 'brewster'],
    games: [],
  },
  {
    id: 'unit3',
    icon: Sparkles,
    color: '#0891B2', // cyan
    demos: ['anisotropy', 'chromatic', 'optical-rotation', 'waveplate'],
    games: ['/game2d?level=3'],
  },
  {
    id: 'unit4',
    icon: Target,
    color: '#F59E0B', // orange
    demos: ['rayleigh', 'mie-scattering', 'monte-carlo-scattering'],
    games: [],
  },
  {
    id: 'unit5',
    icon: Telescope,
    color: '#8B5CF6', // violet
    demos: ['stokes', 'mueller', 'jones', 'polarimetric-microscopy'],
    games: [],
  },
]

interface CourseNavigatorProps {
  className?: string
}

export function CourseNavigator({ className }: CourseNavigatorProps) {
  const { theme } = useTheme()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isZh = i18n.language === 'zh'
  const { progress } = useCourseProgress()
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeUnit, setActiveUnit] = useState<string | null>(null)
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null)
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null)

  // Calculate unit progress
  const getUnitProgress = (unitId: string) => {
    const unit = COURSE_UNITS.find(u => u.id === unitId)
    if (!unit) return 0
    const completed = unit.demos.filter(d => progress.completedDemos.includes(d)).length
    return Math.round((completed / unit.demos.length) * 100)
  }

  // Get unit title
  const getUnitTitle = (unitId: string) => {
    return t(`course.units.${unitId}.title`)
  }

  // Get unit subtitle
  const getUnitSubtitle = (unitId: string) => {
    return t(`course.units.${unitId}.subtitle`)
  }

  // Handle unit click
  const handleUnitClick = (unitId: string) => {
    if (activeUnit === unitId) {
      setShowQuickActions(showQuickActions === unitId ? null : unitId)
    } else {
      setActiveUnit(unitId)
      setShowQuickActions(unitId)
    }
  }

  // Navigate to course page with unit focus
  const navigateToCourse = (unitId: string) => {
    navigate(`/course?unit=${unitId}`)
  }

  // Navigate to first demo of unit
  const navigateToDemo = (unitId: string) => {
    const unit = COURSE_UNITS.find(u => u.id === unitId)
    if (unit && unit.demos.length > 0) {
      navigate(`/demos/${unit.demos[0]}`)
    }
  }

  // Navigate to first game of unit
  const navigateToGame = (unitId: string) => {
    const unit = COURSE_UNITS.find(u => u.id === unitId)
    if (unit && unit.games.length > 0) {
      navigate(unit.games[0])
    }
  }

  // Close quick actions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowQuickActions(null)
    }
    if (showQuickActions) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showQuickActions])

  return (
    <div className={cn(
      'fixed left-4 top-1/2 -translate-y-1/2 z-30',
      'flex flex-col items-start gap-1',
      className
    )}>
      {/* Toggle button for mobile */}
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

      {/* Header label */}
      <div className={cn(
        'hidden md:flex items-center gap-1.5 mb-2 px-2',
        'transition-all duration-300',
        isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full md:opacity-100 md:translate-x-0'
      )}>
        <GraduationCap className={cn(
          'w-4 h-4',
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        )} />
        <span className={cn(
          'text-xs font-semibold',
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        )}>
          {isZh ? '课程导航' : 'Course'}
        </span>
      </div>

      {/* Navigator bar */}
      <div className={cn(
        'flex flex-col gap-1.5 transition-all duration-300',
        'md:opacity-100 md:translate-x-0',
        isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full md:opacity-100 md:translate-x-0',
        'pointer-events-auto'
      )}>
        {COURSE_UNITS.map((unit, index) => {
          const Icon = unit.icon
          const unitProgress = getUnitProgress(unit.id)
          const isActive = activeUnit === unit.id
          const isHovered = hoveredUnit === unit.id
          const isQuickActionsOpen = showQuickActions === unit.id
          const hasGames = unit.games.length > 0

          return (
            <div key={unit.id} className="relative">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  handleUnitClick(unit.id)
                }}
                onMouseEnter={() => setHoveredUnit(unit.id)}
                onMouseLeave={() => setHoveredUnit(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  'shadow-sm hover:shadow-lg min-w-[140px]',
                  isActive || isQuickActionsOpen
                    ? theme === 'dark'
                      ? 'text-white border-2'
                      : 'text-gray-900 border-2'
                    : theme === 'dark'
                      ? 'bg-slate-800/90 text-gray-400 hover:text-white hover:bg-slate-700 border border-transparent'
                      : 'bg-white/90 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                )}
                style={{
                  backgroundColor: isActive || isQuickActionsOpen
                    ? `${unit.color}20`
                    : undefined,
                  borderColor: isActive || isQuickActionsOpen ? unit.color : undefined,
                }}
              >
                {/* Icon with colored background */}
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${unit.color}30` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: unit.color }} />
                </div>

                {/* Unit number */}
                <span className="font-mono whitespace-nowrap">
                  {isZh ? `第${index + 1}单元` : `Unit ${index + 1}`}
                </span>

                {/* Progress indicator */}
                <div className="flex-1 flex items-center justify-end gap-1">
                  {unitProgress === 100 ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <div className="relative w-8 h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all"
                        style={{
                          width: `${unitProgress}%`,
                          backgroundColor: unit.color,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Expand indicator */}
                <ChevronDown
                  className={cn(
                    'w-3 h-3 transition-transform',
                    isQuickActionsOpen ? 'rotate-180' : ''
                  )}
                  style={{ color: unit.color }}
                />

                {/* Glow effect on hover */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-lg opacity-0 transition-opacity pointer-events-none',
                    isHovered || isActive ? 'opacity-100' : ''
                  )}
                  style={{
                    boxShadow: `0 0 20px ${unit.color}30, inset 0 0 10px ${unit.color}10`,
                  }}
                />
              </motion.button>

              {/* Extended tooltip with unit details */}
              <AnimatePresence>
                {isHovered && !isQuickActionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      'absolute left-full ml-3 top-0 w-64 p-3 rounded-lg shadow-xl z-50',
                      'pointer-events-none',
                      theme === 'dark'
                        ? 'bg-slate-900 border border-slate-700'
                        : 'bg-white border border-gray-200'
                    )}
                  >
                    {/* Unit title */}
                    <div className="flex items-start gap-2 mb-2">
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${unit.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: unit.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          'text-sm font-bold leading-tight',
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>
                          {getUnitTitle(unit.id)}
                        </h4>
                        <p className={cn(
                          'text-xs mt-0.5',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>
                          {getUnitSubtitle(unit.id)}
                        </p>
                      </div>
                    </div>

                    {/* Demo count */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className={cn(
                        'flex items-center gap-1',
                        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                      )}>
                        <FlaskConical className="w-3 h-3" />
                        {unit.demos.length} {isZh ? '演示' : 'demos'}
                      </span>
                      {hasGames && (
                        <span className={cn(
                          'flex items-center gap-1',
                          theme === 'dark' ? 'text-pink-400' : 'text-pink-600'
                        )}>
                          <Gamepad2 className="w-3 h-3" />
                          {unit.games.length} {isZh ? '游戏' : 'games'}
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          {isZh ? '进度' : 'Progress'}
                        </span>
                        <span style={{ color: unit.color }}>{unitProgress}%</span>
                      </div>
                      <div className={cn(
                        'h-1.5 rounded-full overflow-hidden',
                        theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                      )}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${unitProgress}%`,
                            backgroundColor: unit.color,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick action buttons */}
              <AnimatePresence>
                {isQuickActionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={cn(
                      'mt-1 ml-2 pl-3 border-l-2 space-y-1',
                    )}
                    style={{ borderColor: `${unit.color}50` }}
                    >
                      {/* View Course */}
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 }}
                        onClick={() => navigateToCourse(unit.id)}
                        className={cn(
                          'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs w-full transition-colors',
                          theme === 'dark'
                            ? 'hover:bg-slate-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600'
                        )}
                      >
                        <BookOpen className="w-3.5 h-3.5" style={{ color: unit.color }} />
                        <span>{isZh ? '查看课程' : 'View Course'}</span>
                      </motion.button>

                      {/* Start Demo */}
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => navigateToDemo(unit.id)}
                        className={cn(
                          'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs w-full transition-colors',
                          theme === 'dark'
                            ? 'hover:bg-slate-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600'
                        )}
                      >
                        <FlaskConical className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{isZh ? '开始演示' : 'Start Demo'}</span>
                      </motion.button>

                      {/* Play Game (if available) */}
                      {hasGames && (
                        <motion.button
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                          onClick={() => navigateToGame(unit.id)}
                          className={cn(
                            'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs w-full transition-colors',
                            theme === 'dark'
                              ? 'hover:bg-slate-700 text-gray-300'
                              : 'hover:bg-gray-100 text-gray-600'
                          )}
                        >
                          <Gamepad2 className="w-3.5 h-3.5 text-pink-500" />
                          <span>{isZh ? '开始游戏' : 'Play Game'}</span>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {/* View all courses button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2"
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

      {/* Progress indicator line */}
      <div className={cn(
        'hidden md:block absolute right-0 top-10 bottom-10 w-0.5 rounded-full translate-x-3',
        theme === 'dark'
          ? 'bg-gradient-to-b from-amber-500/30 via-indigo-500/30 to-violet-500/30'
          : 'bg-gradient-to-b from-amber-300 via-indigo-300 to-violet-300'
      )}>
        {/* Active indicator */}
        {activeUnit && (
          <motion.div
            layoutId="activeUnitIndicator"
            className={cn(
              'absolute w-2 h-2 rounded-full translate-x-[-3px] transition-all duration-300'
            )}
            style={{
              backgroundColor: COURSE_UNITS.find(u => u.id === activeUnit)?.color,
              top: `${(COURSE_UNITS.findIndex(u => u.id === activeUnit) / (COURSE_UNITS.length - 1)) * 100}%`,
            }}
          />
        )}
      </div>
    </div>
  )
}
