/**
 * LessonPage - 课时页面容器
 * Lesson Page Container
 *
 * 包装现有 Demo 组件，添加课程上下文（问题引导、理论、反思）
 * Wraps existing Demo components with course context (guiding questions, theory, reflection)
 */

import { Suspense, lazy, useMemo, useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useCourseProgress } from '@/hooks'
import { CourseLayout } from '../components/CourseLayout'
import { LevelBadge, LevelSelector } from '../components/LevelBadge'
import { getLessonById } from '../meta/units'
import { COURSE_LAYER_CONFIG, type DifficultyLevel } from '../meta/course.config'
import type { LessonDefinition } from '../meta/units'
import {
  BookOpen,
  CheckCircle,
  Clock,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  Play,
  Target,
  Eye,
} from 'lucide-react'

// 延迟加载 Demo 组件的映射
// 复用现有的 /demos 组件（使用命名导出）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEMO_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'em-wave': lazy(() => import('@/components/demos/basics/ElectromagneticWaveDemo').then(m => ({ default: m.ElectromagneticWaveDemo }))),
  'polarization-intro': lazy(() => import('@/components/demos/basics/PolarizationIntroDemo').then(m => ({ default: m.PolarizationIntroDemo }))),
  'polarization-types-unified': lazy(() => import('@/components/demos/basics/PolarizationTypesUnifiedDemo').then(m => ({ default: m.PolarizationTypesUnifiedDemo }))),
  'optical-bench': lazy(() => import('@/components/demos/basics/InteractiveOpticalBenchDemo').then(m => ({ default: m.InteractiveOpticalBenchDemo }))),
  'birefringence': lazy(() => import('@/components/demos/unit1/BirefringenceDemo').then(m => ({ default: m.BirefringenceDemo }))),
  'malus': lazy(() => import('@/components/demos/unit1/MalusLawDemo').then(m => ({ default: m.MalusLawDemo }))),
  'waveplate': lazy(() => import('@/components/demos/unit1/WaveplateDemo').then(m => ({ default: m.WaveplateDemo }))),
  'fresnel': lazy(() => import('@/components/demos/unit2/FresnelDemo').then(m => ({ default: m.FresnelDemo }))),
  'brewster': lazy(() => import('@/components/demos/unit2/BrewsterDemo').then(m => ({ default: m.BrewsterDemo }))),
  'chromatic': lazy(() => import('@/components/demos/unit3/ChromaticDemo').then(m => ({ default: m.ChromaticDemo }))),
  'optical-rotation': lazy(() => import('@/components/demos/unit3/OpticalRotationDemo').then(m => ({ default: m.OpticalRotationDemo }))),
  'anisotropy': lazy(() => import('@/components/demos/unit3/AnisotropyDemo').then(m => ({ default: m.AnisotropyDemo }))),
  'rayleigh': lazy(() => import('@/components/demos/unit4/RayleighScatteringDemo').then(m => ({ default: m.RayleighScatteringDemo }))),
  'mie-scattering': lazy(() => import('@/components/demos/unit4/MieScatteringDemo').then(m => ({ default: m.MieScatteringDemo }))),
  'monte-carlo-scattering': lazy(() => import('@/components/demos/unit4/MonteCarloScatteringDemo').then(m => ({ default: m.MonteCarloScatteringDemo }))),
  'stokes': lazy(() => import('@/components/demos/unit5/StokesVectorDemo').then(m => ({ default: m.StokesVectorDemo }))),
  'mueller': lazy(() => import('@/components/demos/unit5/MuellerMatrixDemo').then(m => ({ default: m.MuellerMatrixDemo }))),
  'jones': lazy(() => import('@/components/demos/unit5/JonesMatrixDemo').then(m => ({ default: m.JonesMatrixDemo }))),
  'polarimetric-microscopy': lazy(() => import('@/components/demos/unit5/PolarimetricMicroscopyDemo').then(m => ({ default: m.PolarimetricMicroscopyDemo }))),
}

// Demo 加载占位符
function DemoLoader() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <div
      className={`flex items-center justify-center h-96 rounded-xl ${
        isDark ? 'bg-slate-800' : 'bg-gray-100'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading demo...
        </span>
      </div>
    </div>
  )
}

export function LessonPage() {
  const { unitId, lessonId } = useParams<{ unitId: string; lessonId: string }>()
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const {
    progress,
    setPreferredDifficulty,
    completeDemo,
    isCompleted,
    setLastViewedDemo,
    updateDemoTime,
  } = useCourseProgress()
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(
    progress.preferredDifficulty
  )
  const [startTime] = useState(Date.now())

  const isDark = theme === 'dark'
  const isZh = i18n.language === 'zh'

  // 获取课时数据
  const lessonData = useMemo(() => {
    if (!lessonId) return null
    return getLessonById(lessonId)
  }, [lessonId])

  // 如果课时不存在，重定向
  if (!lessonData) {
    return <Navigate to={COURSE_LAYER_CONFIG.routePrefix} replace />
  }

  const { unit, lesson } = lessonData

  // 验证 unitId 匹配
  if (unitId && unit.id !== unitId) {
    return <Navigate to={`${COURSE_LAYER_CONFIG.routePrefix}/unit/${unit.id}/lesson/${lessonId}`} replace />
  }

  // 记录访问和学习时间
  useEffect(() => {
    if (lesson.demoId) {
      setLastViewedDemo(lesson.demoId)
    }

    // 组件卸载时记录学习时间
    return () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      if (lesson.demoId && elapsed > 10) {
        // 至少停留10秒才记录
        updateDemoTime(lesson.demoId, elapsed)
      }
    }
  }, [lesson.demoId, setLastViewedDemo, updateDemoTime, startTime])

  // 处理难度变更
  const handleDifficultyChange = (level: DifficultyLevel) => {
    setSelectedDifficulty(level)
    setPreferredDifficulty(level)
  }

  // 标记为完成
  const handleMarkComplete = () => {
    if (lesson.demoId) {
      completeDemo(lesson.demoId)
    }
  }

  // 获取当前难度的问题
  const currentQuestions = lesson.guidingQuestions[selectedDifficulty] || []

  // 获取上一个/下一个课时
  const lessonIndex = unit.lessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = lessonIndex > 0 ? unit.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < unit.lessons.length - 1 ? unit.lessons[lessonIndex + 1] : null

  // 获取 Demo 组件
  const DemoComponent = lesson.demoId ? DEMO_COMPONENTS[lesson.demoId] : null

  // 面包屑
  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: isZh ? '偏振光下的世界' : 'The World', href: COURSE_LAYER_CONFIG.routePrefix },
    { label: t(unit.titleKey), href: `${COURSE_LAYER_CONFIG.routePrefix}/unit/${unit.id}` },
    { label: t(lesson.titleKey), current: true },
  ]

  const completed = lesson.demoId ? isCompleted(lesson.demoId) : false

  return (
    <CourseLayout
      breadcrumbs={breadcrumbs}
      backLink={{
        href: `${COURSE_LAYER_CONFIG.routePrefix}/unit/${unit.id}`,
        label: t(unit.titleKey),
      }}
      accentColor={unit.color}
      bottomNav={{
        prev: prevLesson
          ? {
              href: `${COURSE_LAYER_CONFIG.routePrefix}/unit/${unit.id}/lesson/${prevLesson.id}`,
              label: t(prevLesson.titleKey),
            }
          : undefined,
        next: nextLesson
          ? {
              href: `${COURSE_LAYER_CONFIG.routePrefix}/unit/${unit.id}/lesson/${nextLesson.id}`,
              label: t(nextLesson.titleKey),
            }
          : undefined,
      }}
      sidebar={
        <LessonSidebar
          lesson={lesson}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={handleDifficultyChange}
          questions={currentQuestions}
          completed={completed}
          onMarkComplete={handleMarkComplete}
          isDark={isDark}
          isZh={isZh}
        />
      }
    >
      {/* 课时标题 */}
      <div className="mb-6">
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
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            •
          </span>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isZh ? `课时 ${lessonIndex + 1}` : `Lesson ${lessonIndex + 1}`}
          </span>
          {completed && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
        </div>
        <h1
          className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t(lesson.titleKey)}
        </h1>
        <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t(lesson.descriptionKey)}
        </p>
      </div>

      {/* 问题引导（移动端显示） */}
      <div className="lg:hidden mb-6">
        <GuidingQuestions
          questions={currentQuestions}
          difficulty={selectedDifficulty}
          isDark={isDark}
          isZh={isZh}
        />
      </div>

      {/* Demo 组件 */}
      {DemoComponent ? (
        <div className="mb-6">
          <Suspense fallback={<DemoLoader />}>
            <div
              className={`rounded-xl overflow-hidden ${
                isDark ? 'bg-slate-800' : 'bg-white shadow-sm'
              }`}
            >
              <DemoComponent difficulty={selectedDifficulty} />
            </div>
          </Suspense>
        </div>
      ) : (
        <div
          className={`rounded-xl p-8 text-center mb-6 ${
            isDark ? 'bg-slate-800' : 'bg-gray-100'
          }`}
        >
          <BookOpen className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isZh ? '该课时暂无交互演示' : 'No interactive demo available for this lesson'}
          </p>
        </div>
      )}

      {/* 相关资源 */}
      {lesson.resources.length > 0 && (
        <div
          className={`rounded-xl p-5 ${
            isDark ? 'bg-slate-800' : 'bg-white shadow-sm'
          }`}
        >
          <h3
            className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {isZh ? '更多资源' : 'More Resources'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {lesson.resources.map((resource, index) => (
              <Link
                key={index}
                to={resource.path}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isDark
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {resource.type === 'demo' && <Eye className="w-3.5 h-3.5" />}
                {resource.type === 'game' && <Play className="w-3.5 h-3.5" />}
                {resource.type === 'tool' && <Target className="w-3.5 h-3.5" />}
                {resource.type === 'experiment' && <Lightbulb className="w-3.5 h-3.5" />}
                {t(resource.labelKey)}
                <ExternalLink className="w-3 h-3 opacity-50" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </CourseLayout>
  )
}

// 侧边栏组件
interface LessonSidebarProps {
  lesson: LessonDefinition
  selectedDifficulty: DifficultyLevel
  onDifficultyChange: (level: DifficultyLevel) => void
  questions: string[]
  completed: boolean
  onMarkComplete: () => void
  isDark: boolean
  isZh: boolean
}

function LessonSidebar({
  lesson,
  selectedDifficulty,
  onDifficultyChange,
  questions,
  completed,
  onMarkComplete,
  isDark,
  isZh,
}: LessonSidebarProps) {
  return (
    <div className="space-y-4">
      {/* 难度选择 */}
      <div>
        <h3
          className={`text-sm font-semibold mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {isZh ? '学习层级' : 'Learning Level'}
        </h3>
        <LevelSelector
          value={selectedDifficulty}
          onChange={onDifficultyChange}
          availableLevels={lesson.difficulties}
          direction="vertical"
          size="sm"
        />
      </div>

      {/* 问题引导 */}
      <GuidingQuestions
        questions={questions}
        difficulty={selectedDifficulty}
        isDark={isDark}
        isZh={isZh}
      />

      {/* 学习目标 */}
      <div>
        <h3
          className={`text-sm font-semibold mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {isZh ? '学习目标' : 'Objectives'}
        </h3>
        <ul className="space-y-1.5">
          {lesson.objectives.map((obj, index) => (
            <li
              key={index}
              className={`text-xs flex items-start gap-1.5 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              <Target className="w-3 h-3 mt-0.5 flex-shrink-0 text-cyan-500" />
              {obj}
            </li>
          ))}
        </ul>
      </div>

      {/* 预估时间 */}
      <div
        className={`flex items-center gap-2 text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        <Clock className="w-4 h-4" />
        <span>
          {lesson.estimatedMinutes} {isZh ? '分钟' : 'min'}
        </span>
      </div>

      {/* 完成按钮 */}
      <button
        onClick={onMarkComplete}
        disabled={completed}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          completed
            ? isDark
              ? 'bg-green-500/20 text-green-400 cursor-default'
              : 'bg-green-100 text-green-700 cursor-default'
            : isDark
            ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
            : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
        }`}
      >
        <CheckCircle className="w-4 h-4" />
        {completed
          ? isZh
            ? '已完成'
            : 'Completed'
          : isZh
          ? '标记为完成'
          : 'Mark as Complete'}
      </button>
    </div>
  )
}

// 问题引导组件
interface GuidingQuestionsProps {
  questions: string[]
  difficulty: DifficultyLevel
  isDark: boolean
  isZh: boolean
}

function GuidingQuestions({
  questions,
  difficulty,
  isDark,
  isZh,
}: GuidingQuestionsProps) {
  if (questions.length === 0) return null

  return (
    <div
      className={`rounded-lg p-3 ${
        isDark ? 'bg-amber-500/10' : 'bg-amber-50'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-4 h-4 text-amber-500" />
        <h3
          className={`text-sm font-semibold ${
            isDark ? 'text-amber-400' : 'text-amber-700'
          }`}
        >
          {isZh ? '思考问题' : 'Think About'}
        </h3>
        <LevelBadge level={difficulty} size="sm" showLabel={false} />
      </div>
      <ul className="space-y-1.5">
        {questions.map((q, index) => (
          <li
            key={index}
            className={`text-xs flex items-start gap-1.5 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <MessageCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-500" />
            {q}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LessonPage
