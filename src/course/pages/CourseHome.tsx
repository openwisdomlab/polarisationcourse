/**
 * CourseHome - 《偏振光下的世界》课程首页
 * Course Home Page for "The World Under Polarized Light"
 *
 * 课程入口页面，展示课程愿景、单元结构和难度层级
 * Course entry page showing vision, unit structure and difficulty levels
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useCourseProgress } from '@/hooks'
import { CourseLayout } from '../components/CourseLayout'
import { LevelInfoCard } from '../components/LevelBadge'
import { ProgressTracker } from '../components/ProgressTracker'
import { COURSE_UNITS } from '../meta/units'
import {
  COURSE_LAYER_CONFIG,
  WORLD_UNDER_POLARIZED_LIGHT,
  type DifficultyLevel,
} from '../meta/course.config'
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Lightbulb,
  Play,
  Sparkles,
  Target,
  Telescope,
  Zap,
  Eye,
  Compass,
  FlaskConical,
  ArrowRight,
} from 'lucide-react'

// 图标映射
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Zap,
  Sparkles,
  Target,
  Telescope,
}

export function CourseHome() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const { progress, setPreferredDifficulty } = useCourseProgress()
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(
    progress.preferredDifficulty
  )
  const [animationPhase, setAnimationPhase] = useState(0)

  const isDark = theme === 'dark'
  const isZh = i18n.language === 'zh'

  // 动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((p) => (p + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // 更新难度偏好
  const handleDifficultyChange = (level: DifficultyLevel) => {
    setSelectedDifficulty(level)
    setPreferredDifficulty(level)
  }

  return (
    <CourseLayout showNav>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl mb-8">
        {/* 动画背景 */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? `conic-gradient(from ${animationPhase}deg at 50% 50%,
                  rgba(6, 182, 212, 0.15) 0deg,
                  rgba(99, 102, 241, 0.15) 60deg,
                  rgba(139, 92, 246, 0.15) 120deg,
                  rgba(245, 158, 11, 0.15) 180deg,
                  rgba(8, 145, 178, 0.15) 240deg,
                  rgba(201, 162, 39, 0.15) 300deg,
                  rgba(6, 182, 212, 0.15) 360deg)`
              : `conic-gradient(from ${animationPhase}deg at 50% 50%,
                  rgba(6, 182, 212, 0.1) 0deg,
                  rgba(99, 102, 241, 0.1) 60deg,
                  rgba(139, 92, 246, 0.1) 120deg,
                  rgba(245, 158, 11, 0.1) 180deg,
                  rgba(8, 145, 178, 0.1) 240deg,
                  rgba(201, 162, 39, 0.1) 300deg,
                  rgba(6, 182, 212, 0.1) 360deg)`,
          }}
        />

        {/* 光线动画 */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 45 * Math.cos(((animationPhase + i * 60) * Math.PI) / 180)}
              y2={50 + 45 * Math.sin(((animationPhase + i * 60) * Math.PI) / 180)}
              stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}
              strokeWidth="0.3"
            />
          ))}
        </svg>

        {/* 内容 */}
        <div
          className={`relative z-10 p-8 md:p-12 ${
            isDark ? 'bg-slate-900/80' : 'bg-white/80'
          }`}
        >
          {/* 徽章 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isDark
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-cyan-500/20 text-cyan-700'
              }`}
            >
              {WORLD_UNDER_POLARIZED_LIGHT.badge}
            </span>
          </div>

          {/* 标题 */}
          <h1
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
              isDark
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600'
            }`}
          >
            {isZh ? '偏振光下的世界' : 'The World Under Polarized Light'}
          </h1>

          {/* 副标题 */}
          <p
            className={`text-lg md:text-xl mb-6 max-w-3xl ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {isZh
              ? '从冰洲石的神奇双像到现代医学成像，探索偏振光揭示的隐秘世界'
              : 'From the mysterious double images of Iceland spar to modern medical imaging, explore the hidden world revealed by polarized light'}
          </p>

          {/* 核心问题引导 */}
          <div
            className={`p-4 rounded-xl mb-6 border ${
              isDark
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3
                  className={`font-semibold mb-1 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {isZh ? '为什么用偏振光看世界？' : 'Why see the world through polarized light?'}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {isZh
                    ? '偏振光是自然界隐藏的第五种"颜色"——它能揭示材料内部应力、测量糖溶液浓度、帮助蜜蜂导航，甚至让我们看穿浑浊的水下世界。'
                    : 'Polarization is nature\'s hidden "fifth color" — it reveals internal stress in materials, measures sugar concentration, helps bees navigate, and even lets us see through murky underwater worlds.'}
                </p>
              </div>
            </div>
          </div>

          {/* CTA 按钮 */}
          <div className="flex flex-wrap gap-4">
            <Link
              to={`${COURSE_LAYER_CONFIG.routePrefix}/unit/unit-0`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5" />
              {isZh ? '开始学习' : 'Start Learning'}
            </Link>
            <Link
              to="/demos"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                isDark
                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <FlaskConical className="w-5 h-5" />
              {isZh ? '浏览演示' : 'Explore Demos'}
            </Link>
          </div>
        </div>
      </section>

      {/* 难度选择区域 */}
      <section className="mb-8">
        <div
          className={`rounded-2xl p-6 ${
            isDark ? 'bg-slate-800' : 'bg-white shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Compass className="w-5 h-5 text-cyan-500" />
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isZh ? '选择你的学习层级' : 'Choose Your Learning Level'}
            </h2>
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isZh
              ? '课程内容会根据你选择的层级自动调整深度和难度'
              : 'Course content will automatically adjust depth and difficulty based on your selection'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['foundation', 'application', 'research'] as DifficultyLevel[]).map(
              (level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={`text-left transition-all ${
                    selectedDifficulty === level
                      ? 'ring-2 ring-cyan-500 scale-[1.02]'
                      : 'hover:scale-[1.01]'
                  }`}
                >
                  <LevelInfoCard level={level} />
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* 单元网格 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isZh ? '课程单元' : 'Course Units'}
          </h2>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {COURSE_UNITS.length} {isZh ? '个单元' : 'units'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COURSE_UNITS.map((unit) => {
            const IconComponent = ICON_MAP[unit.icon] || BookOpen
            return (
              <Link
                key={unit.id}
                to={`${COURSE_LAYER_CONFIG.routePrefix}/unit/${unit.id}`}
                className={`group block rounded-xl p-5 transition-all hover:scale-[1.02] ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700'
                    : 'bg-white shadow-sm hover:shadow-md'
                }`}
                style={{
                  borderLeft: `4px solid ${unit.color}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${unit.color}20`, color: unit.color }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${unit.color}20`,
                          color: unit.color,
                        }}
                      >
                        {isZh ? `单元 ${unit.number}` : `Unit ${unit.number}`}
                      </span>
                    </div>
                    <h3
                      className={`font-semibold mb-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {t(unit.titleKey)}
                    </h3>
                    <p
                      className={`text-sm line-clamp-2 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {t(unit.subtitleKey)}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span
                        className={`text-xs ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        {unit.lessons.length} {isZh ? '课时' : 'lessons'}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 进度追踪 */}
      <section className="mb-8">
        <ProgressTracker detailed showUnits />
      </section>

      {/* 快速链接 */}
      <section
        className={`rounded-2xl p-6 ${
          isDark ? 'bg-slate-800' : 'bg-white shadow-sm'
        }`}
      >
        <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {isZh ? '相关资源' : 'Related Resources'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/demos', label: isZh ? '交互演示' : 'Interactive Demos', icon: FlaskConical },
            { href: '/games', label: isZh ? '趣味游戏' : 'Puzzle Games', icon: Target },
            { href: '/optical-studio', label: isZh ? '光学设计室' : 'Optical Studio', icon: Compass },
            { href: '/calc', label: isZh ? '计算工具' : 'Calculators', icon: Telescope },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                isDark
                  ? 'bg-slate-700/50 hover:bg-slate-700 text-gray-300'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
              <ArrowRight className="w-3 h-3 ml-auto opacity-50" />
            </Link>
          ))}
        </div>
      </section>
    </CourseLayout>
  )
}

export default CourseHome
