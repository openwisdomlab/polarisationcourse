/**
 * ProgressTracker - 课程进度追踪组件
 * Course Progress Tracker Component
 *
 * 显示用户在课程中的学习进度
 * Displays user's learning progress in the course
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useCourseProgress } from '@/hooks'
import { COURSE_UNITS } from '../meta/units'
import { COURSE_LAYER_CONFIG } from '../meta/course.config'
import {
  CheckCircle,
  Clock,
  Flame,
  Target,
} from 'lucide-react'

interface ProgressTrackerProps {
  // 是否显示详细信息
  detailed?: boolean
  // 是否显示单元进度
  showUnits?: boolean
  // 是否紧凑模式
  compact?: boolean
}

export function ProgressTracker({
  detailed = true,
  showUnits = true,
  compact = false,
}: ProgressTrackerProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { progress, calculateUnitProgress } = useCourseProgress()
  const isDark = theme === 'dark'

  // 计算总体进度
  const overallProgress = useMemo(() => {
    const allDemoIds = COURSE_UNITS.flatMap(unit =>
      unit.lessons.map(lesson => lesson.demoId).filter(Boolean)
    ) as string[]
    if (allDemoIds.length === 0) return 0
    const completed = allDemoIds.filter(id =>
      progress.completedDemos.includes(id)
    ).length
    return Math.round((completed / allDemoIds.length) * 100)
  }, [progress.completedDemos])

  // 计算各单元进度
  const unitProgressData = useMemo(() => {
    return COURSE_UNITS.map(unit => {
      const demoIds = unit.lessons
        .map(lesson => lesson.demoId)
        .filter(Boolean) as string[]
      return {
        unit,
        progress: calculateUnitProgress(demoIds),
        completed: demoIds.filter(id => progress.completedDemos.includes(id)).length,
        total: demoIds.length,
      }
    })
  }, [progress.completedDemos, calculateUnitProgress])

  // 格式化学习时间
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  if (compact) {
    return (
      <div
        className={`flex items-center gap-4 p-3 rounded-lg ${
          isDark ? 'bg-slate-800' : 'bg-white shadow-sm'
        }`}
      >
        {/* 进度环 */}
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={isDark ? '#334155' : '#E5E7EB'}
              strokeWidth="4"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${overallProgress * 1.256} 125.6`}
            />
          </svg>
          <span
            className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {overallProgress}%
          </span>
        </div>

        {/* 统计信息 */}
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('worldCourse.progress.title')}
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {progress.completedDemos.length} / {unitProgressData.reduce((acc, u) => acc + u.total, 0)} {t('worldCourse.progress.lessons')}
          </div>
        </div>

        {/* 连续天数 */}
        {progress.streakDays > 0 && (
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="w-4 h-4" />
            <span className="font-bold">{progress.streakDays}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl p-6 ${
        isDark ? 'bg-slate-800' : 'bg-white shadow-sm'
      }`}
    >
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('worldCourse.progress.title')}
        </h3>
        <Link
          to={`${COURSE_LAYER_CONFIG.routePrefix}`}
          className="text-sm text-cyan-500 hover:text-cyan-400"
        >
          {t('worldCourse.progress.viewAll')}
        </Link>
      </div>

      {/* 总体进度条 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('worldCourse.progress.overall')}
          </span>
          <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {overallProgress}%
          </span>
        </div>
        <div
          className={`h-3 rounded-full overflow-hidden ${
            isDark ? 'bg-slate-700' : 'bg-gray-200'
          }`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* 统计数据 */}
      {detailed && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formatTime(progress.totalTimeSpent)}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {t('worldCourse.progress.timeSpent')}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {progress.streakDays}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {t('worldCourse.progress.streak')}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {progress.completedDemos.length}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {t('worldCourse.progress.completed')}
            </div>
          </div>
        </div>
      )}

      {/* 单元进度 */}
      {showUnits && (
        <div className="space-y-3">
          {unitProgressData.map(({ unit, progress: unitProgress, completed, total }) => (
            <Link
              key={unit.id}
              to={`${COURSE_LAYER_CONFIG.routePrefix}/unit/${unit.id}`}
              className={`block p-3 rounded-lg transition-colors ${
                isDark
                  ? 'bg-slate-700/50 hover:bg-slate-700'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: unit.color }}
                  >
                    {unit.number}
                  </span>
                  <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t(unit.titleKey)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {unitProgress === 100 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {completed}/{total}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`h-1.5 rounded-full overflow-hidden ${
                  isDark ? 'bg-slate-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${unitProgress}%`,
                    backgroundColor: unit.color,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProgressTracker
