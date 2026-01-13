/**
 * UnitOverview - 课程单元总览页面
 * Course Unit Overview Page
 *
 * 展示单元的课时列表、学习目标和相关资源
 * Shows unit lessons, learning objectives and related resources
 */

import { useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useCourseProgress } from '@/hooks'
import { CourseLayout } from '../components/CourseLayout'
import { LevelBadge } from '../components/LevelBadge'
import { getUnitById, COURSE_UNITS, type LessonDefinition } from '../meta/units'
import { COURSE_LAYER_CONFIG } from '../meta/course.config'
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Gamepad2,
  Lightbulb,
  Target,
  Wrench,
  FlaskConical,
} from 'lucide-react'

export function UnitOverview() {
  const { unitId } = useParams<{ unitId: string }>()
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const { progress, isCompleted } = useCourseProgress()
  const isDark = theme === 'dark'
  const isZh = i18n.language === 'zh'

  // 获取单元数据
  const unit = useMemo(() => {
    if (!unitId) return null
    return getUnitById(unitId)
  }, [unitId])

  // 如果单元不存在，重定向到课程首页
  if (!unit) {
    return <Navigate to={COURSE_LAYER_CONFIG.routePrefix} replace />
  }

  // 计算单元进度
  const unitProgress = useMemo(() => {
    const demoIds = unit.lessons
      .map((l) => l.demoId)
      .filter(Boolean) as string[]
    if (demoIds.length === 0) return 0
    const completed = demoIds.filter((id) => progress.completedDemos.includes(id)).length
    return Math.round((completed / demoIds.length) * 100)
  }, [unit, progress.completedDemos])

  // 计算总学习时间
  const totalMinutes = useMemo(() => {
    return unit.lessons.reduce((acc, lesson) => acc + lesson.estimatedMinutes, 0)
  }, [unit])

  // 获取上一个/下一个单元
  const currentIndex = COURSE_UNITS.findIndex((u) => u.id === unit.id)
  const prevUnit = currentIndex > 0 ? COURSE_UNITS[currentIndex - 1] : null
  const nextUnit = currentIndex < COURSE_UNITS.length - 1 ? COURSE_UNITS[currentIndex + 1] : null

  // 面包屑
  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: isZh ? '偏振光下的世界' : 'The World Under Polarized Light', href: COURSE_LAYER_CONFIG.routePrefix },
    { label: t(unit.titleKey), current: true },
  ]

  return (
    <CourseLayout
      breadcrumbs={breadcrumbs}
      backLink={{
        href: COURSE_LAYER_CONFIG.routePrefix,
        label: isZh ? '返回课程' : 'Back to Course',
      }}
      accentColor={unit.color}
      bottomNav={{
        prev: prevUnit
          ? {
              href: `${COURSE_LAYER_CONFIG.routePrefix}/unit/${prevUnit.id}`,
              label: t(prevUnit.titleKey),
            }
          : undefined,
        next: nextUnit
          ? {
              href: `${COURSE_LAYER_CONFIG.routePrefix}/unit/${nextUnit.id}`,
              label: t(nextUnit.titleKey),
            }
          : undefined,
      }}
    >
      {/* 单元头部 */}
      <div
        className={`rounded-2xl p-6 mb-6 ${
          isDark ? 'bg-slate-800' : 'bg-white shadow-sm'
        }`}
        style={{
          borderTop: `4px solid ${unit.color}`,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${unit.color}20` }}
          >
            <BookOpen className="w-8 h-8" style={{ color: unit.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-sm font-bold px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${unit.color}20`,
                  color: unit.color,
                }}
              >
                {isZh ? `单元 ${unit.number}` : `Unit ${unit.number}`}
              </span>
              <span
                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {unit.lessons.length} {isZh ? '课时' : 'lessons'}
              </span>
            </div>
            <h1
              className={`text-2xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t(unit.titleKey)}
            </h1>
            <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t(unit.subtitleKey)}
            </p>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-opacity-20" style={{ borderColor: unit.color }}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {totalMinutes} {isZh ? '分钟' : 'min'}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {isZh ? '预计时长' : 'Est. Duration'}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {unitProgress}%
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {isZh ? '完成进度' : 'Progress'}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {unit.lessons.filter((l) => l.demoId && isCompleted(l.demoId)).length}/{unit.lessons.length}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {isZh ? '已完成课时' : 'Completed'}
            </div>
          </div>
        </div>
      </div>

      {/* 核心问题 */}
      <div
        className={`rounded-xl p-4 mb-6 border ${
          isDark
            ? 'bg-slate-800/50 border-slate-700'
            : 'bg-amber-50 border-amber-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3
              className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {isZh ? '核心问题' : 'Core Question'}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t(unit.coreQuestion)}
            </p>
          </div>
        </div>
      </div>

      {/* 课时列表 */}
      <div className="mb-6">
        <h2
          className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          {isZh ? '课时列表' : 'Lessons'}
        </h2>
        <div className="space-y-3">
          {unit.lessons.map((lesson, index) => {
            const completed = lesson.demoId ? isCompleted(lesson.demoId) : false
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                unitId={unit.id}
                completed={completed}
                isDark={isDark}
                isZh={isZh}
                t={t}
              />
            )
          })}
        </div>
      </div>

      {/* 学习目标 */}
      <div
        className={`rounded-xl p-5 mb-6 ${
          isDark ? 'bg-slate-800' : 'bg-white shadow-sm'
        }`}
      >
        <h2
          className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          {isZh ? '学习目标' : 'Learning Objectives'}
        </h2>
        <ul className="space-y-2">
          {unit.objectives.map((obj, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  isDark ? 'text-green-400' : 'text-green-500'
                }`}
              />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t(obj)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 相关资源 */}
      {(unit.relatedGames?.length || unit.relatedTools?.length) && (
        <div
          className={`rounded-xl p-5 ${
            isDark ? 'bg-slate-800' : 'bg-white shadow-sm'
          }`}
        >
          <h2
            className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {isZh ? '相关资源' : 'Related Resources'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unit.relatedGames?.map((game, index) => (
              <Link
                key={`game-${index}`}
                to={game}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-slate-700/50 hover:bg-slate-700'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Gamepad2 className="w-5 h-5 text-pink-500" />
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? '趣味游戏' : 'Puzzle Game'}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {game}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ml-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </Link>
            ))}
            {unit.relatedTools?.map((tool, index) => (
              <Link
                key={`tool-${index}`}
                to={tool}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-slate-700/50 hover:bg-slate-700'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Wrench className="w-5 h-5 text-blue-500" />
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? '计算工具' : 'Calculator'}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {tool}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ml-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </CourseLayout>
  )
}

// 课时卡片组件
interface LessonCardProps {
  lesson: LessonDefinition
  index: number
  unitId: string
  completed: boolean
  isDark: boolean
  isZh: boolean
  t: (key: string) => string
}

function LessonCard({
  lesson,
  index,
  unitId,
  completed,
  isDark,
  isZh,
  t,
}: LessonCardProps) {
  return (
    <Link
      to={`${COURSE_LAYER_CONFIG.routePrefix}/unit/${unitId}/lesson/${lesson.id}`}
      className={`group block rounded-xl p-4 transition-all hover:scale-[1.01] ${
        isDark
          ? 'bg-slate-800 hover:bg-slate-700'
          : 'bg-white shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* 序号/完成状态 */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            completed
              ? 'bg-green-500 text-white'
              : isDark
              ? 'bg-slate-700 text-gray-400'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {completed ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <span className="text-sm font-medium">{index + 1}</span>
          )}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t(lesson.titleKey)}
            </h3>
            {lesson.demoId && (
              <FlaskConical className="w-4 h-4 text-cyan-500" />
            )}
          </div>
          <p
            className={`text-sm line-clamp-2 mb-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t(lesson.descriptionKey)}
          </p>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs flex items-center gap-1 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              <Clock className="w-3 h-3" />
              {lesson.estimatedMinutes} {isZh ? '分钟' : 'min'}
            </span>
            <div className="flex gap-1">
              {lesson.difficulties.map((level) => (
                <LevelBadge key={level} level={level} size="sm" showLabel={false} />
              ))}
            </div>
          </div>
        </div>

        {/* 箭头 */}
        <ChevronRight
          className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}
        />
      </div>
    </Link>
  )
}

export default UnitOverview
