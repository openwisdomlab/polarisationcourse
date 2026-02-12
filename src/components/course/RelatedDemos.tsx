/**
 * RelatedDemos - 相关演示推荐组件
 * Suggests related demos based on the current demo's unit and difficulty
 */

import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  ArrowRight,
  BookOpen,
  Beaker,
  Rocket,
  CheckCircle,
  Bookmark,
} from 'lucide-react'

interface DemoItem {
  id: string
  titleKey: string
  unit: number
  descriptionKey: string
  visualType: '2D' | '3D'
  difficulty: 'foundation' | 'application' | 'research'
}

interface RelatedDemosProps {
  currentDemoId: string
  allDemos: DemoItem[]
  completedDemos: string[]
  bookmarkedDemos: string[]
  theme: 'dark' | 'light'
  onBookmark?: (demoId: string) => void
}

// 计算两个演示之间的相关性分数
const calculateRelevance = (current: DemoItem, other: DemoItem): number => {
  let score = 0

  // 同一单元加分
  if (current.unit === other.unit) {
    score += 3
  }

  // 相邻单元加分
  if (Math.abs(current.unit - other.unit) === 1) {
    score += 2
  }

  // 相同难度加分
  if (current.difficulty === other.difficulty) {
    score += 1
  }

  // 相邻难度加分
  const difficultyOrder = ['foundation', 'application', 'research']
  const currentIdx = difficultyOrder.indexOf(current.difficulty)
  const otherIdx = difficultyOrder.indexOf(other.difficulty)
  if (Math.abs(currentIdx - otherIdx) === 1) {
    score += 0.5
  }

  // 相同可视化类型加分
  if (current.visualType === other.visualType) {
    score += 0.5
  }

  return score
}

// 难度图标映射
const DifficultyIcon = ({ difficulty }: { difficulty: DemoItem['difficulty'] }) => {
  switch (difficulty) {
    case 'foundation':
      return <BookOpen className="w-3 h-3" />
    case 'application':
      return <Beaker className="w-3 h-3" />
    case 'research':
      return <Rocket className="w-3 h-3" />
  }
}

// 难度颜色映射
const getDifficultyColor = (difficulty: DemoItem['difficulty']) => {
  switch (difficulty) {
    case 'foundation':
      return 'bg-green-500/20 text-green-500'
    case 'application':
      return 'bg-blue-500/20 text-blue-500'
    case 'research':
      return 'bg-purple-500/20 text-purple-500'
  }
}

export function RelatedDemos({
  currentDemoId,
  allDemos,
  completedDemos,
  bookmarkedDemos,
  theme,
  onBookmark,
}: RelatedDemosProps) {
  const { t } = useTranslation()

  // 找到当前演示
  const currentDemo = useMemo(() => {
    return allDemos.find(d => d.id === currentDemoId)
  }, [currentDemoId, allDemos])

  // 计算相关演示
  const relatedDemos = useMemo(() => {
    if (!currentDemo) return []

    return allDemos
      .filter(d => d.id !== currentDemoId)
      .map(demo => ({
        ...demo,
        relevance: calculateRelevance(currentDemo, demo),
        isCompleted: completedDemos.includes(demo.id),
        isBookmarked: bookmarkedDemos.includes(demo.id),
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 4) // 显示前4个最相关的
  }, [currentDemo, allDemos, currentDemoId, completedDemos, bookmarkedDemos])

  // 下一个推荐（同单元下一个难度或下一单元）
  const nextRecommended = useMemo(() => {
    if (!currentDemo) return null

    // 优先找同单元下一个难度的
    const difficultyOrder = ['foundation', 'application', 'research']
    const currentDiffIdx = difficultyOrder.indexOf(currentDemo.difficulty)

    if (currentDiffIdx < 2) {
      const nextDifficulty = difficultyOrder[currentDiffIdx + 1]
      const next = allDemos.find(
        d => d.unit === currentDemo.unit &&
          d.difficulty === nextDifficulty &&
          d.id !== currentDemoId
      )
      if (next) return next
    }

    // 然后找下一个单元
    const nextUnit = allDemos.find(
      d => d.unit === currentDemo.unit + 1 &&
        d.id !== currentDemoId
    )
    if (nextUnit) return nextUnit

    // 最后返回任意未完成的
    return allDemos.find(
      d => d.id !== currentDemoId && !completedDemos.includes(d.id)
    ) || null
  }, [currentDemo, allDemos, currentDemoId, completedDemos])

  if (!currentDemo || relatedDemos.length === 0) {
    return null
  }

  return (
    <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        <BookOpen className="w-5 h-5" />
        {t('related.title')}
      </h3>

      {/* 下一步推荐 */}
      {nextRecommended && (
        <Link
          to="/demos/$demoId"
          params={{ demoId: nextRecommended.id }}
          className={`block mb-4 p-4 rounded-xl border-2 transition-all hover:-translate-y-0.5 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-700 hover:border-cyan-500'
              : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 hover:border-cyan-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-xs font-medium mb-1 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {t('related.nextRecommended')}
              </div>
              <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t(nextRecommended.titleKey)}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('course.unit')} {nextRecommended.unit}
              </div>
            </div>
            <ArrowRight className={`w-5 h-5 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            }`} />
          </div>
        </Link>
      )}

      {/* 相关演示列表 */}
      <div className="space-y-2">
        {relatedDemos.map((demo, idx) => (
          <motion.div
            key={demo.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link
              to="/demos/$demoId"
              params={{ demoId: demo.id }}
              className={`group flex items-center gap-3 p-3 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'hover:bg-slate-700/50'
                  : 'hover:bg-white hover:shadow-sm'
              }`}
            >
              {/* 完成状态 */}
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                demo.isCompleted
                  ? 'bg-green-500/20 text-green-500'
                  : theme === 'dark'
                    ? 'bg-slate-700 text-gray-500'
                    : 'bg-gray-200 text-gray-400'
              }`}>
                {demo.isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-xs">{idx + 1}</span>
                )}
              </div>

              {/* 演示信息 */}
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {t(demo.titleKey)}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {t('course.unit')} {demo.unit}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${
                    getDifficultyColor(demo.difficulty)
                  }`}>
                    <DifficultyIcon difficulty={demo.difficulty} />
                  </span>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {demo.visualType}
                  </span>
                </div>
              </div>

              {/* 收藏按钮 */}
              {onBookmark && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onBookmark(demo.id)
                  }}
                  className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                    demo.isBookmarked
                      ? 'text-yellow-500'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-yellow-500'
                        : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <Bookmark
                    className="w-4 h-4"
                    fill={demo.isBookmarked ? 'currentColor' : 'none'}
                  />
                </button>
              )}

              {/* 箭头 */}
              <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 查看全部 */}
      <Link
        to="/demos"
        className={`mt-4 text-sm flex items-center justify-center gap-1 py-2 rounded-lg transition-colors ${
          theme === 'dark'
            ? 'text-cyan-400 hover:bg-slate-700/50'
            : 'text-cyan-600 hover:bg-white'
        }`}
      >
        {t('related.viewAll')}
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

export default RelatedDemos
