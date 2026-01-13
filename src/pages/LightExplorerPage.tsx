/**
 * LightExplorerPage - 光的探索者（渐进式编年史）
 *
 * 基于 Google Learn About 理念设计的渐进式探索体验
 * 取代原有信息过载的 ChroniclesPage
 *
 * 核心理念：
 * - 问题驱动：从好奇心问题开始
 * - 渐进深入：每次只呈现少量内容
 * - 个性化路径：让用户选择自己的学习旅程
 */

import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Compass,
  ArrowRight,
  Sparkles,
  History
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { PersistentHeader } from '@/components/shared'
import { PathEntryCard, ExplorationJourney } from '@/components/chronicles/exploration'
import { EXPLORATION_PATHS, getPathById } from '@/data/exploration-paths'

export function LightExplorerPage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // 当前选中的探索路径
  const [activePathId, setActivePathId] = useState<string | null>(null)

  // 获取当前路径
  const activePath = activePathId ? getPathById(activePathId) : null

  // 开始探索
  const handleStartExploration = useCallback((pathId: string) => {
    setActivePathId(pathId)
  }, [])

  // 返回入口
  const handleBackToEntry = useCallback(() => {
    setActivePathId(null)
  }, [])

  // 如果正在探索某个路径，显示沉浸式探索视图
  if (activePath) {
    return (
      <div className={cn(
        'min-h-screen',
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
          : 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc]'
      )}>
        <ExplorationJourney
          path={activePath}
          theme={theme}
          onBack={handleBackToEntry}
        />
      </div>
    )
  }

  // 入口页面：显示所有探索路径
  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fffbeb]'
    )}>
      {/* Header */}
      <PersistentHeader
        moduleKey="chronicles"
        moduleName={isZh ? '光的探索者' : 'Light Explorer'}
        variant="glass"
        className={cn(
          'sticky top-0 z-40',
          theme === 'dark'
            ? 'bg-slate-900/80 border-b border-slate-700'
            : 'bg-white/80 border-b border-gray-200'
        )}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          {/* 动态光效装饰 */}
          <div className="relative inline-block mb-6">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 blur-2xl"
              style={{
                background: `radial-gradient(circle, ${theme === 'dark' ? '#fbbf24' : '#f59e0b'}40 0%, transparent 70%)`
              }}
            />
            <span className="relative text-6xl sm:text-7xl">💡</span>
          </div>

          <h1 className={cn(
            'text-3xl sm:text-4xl font-bold mb-4',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '开始你的光学探索之旅' : 'Start Your Journey into Light'}
          </h1>

          <p className={cn(
            'text-lg max-w-2xl mx-auto',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '选择一个你感兴趣的问题，我们将带你踏上穿越400年光学发现的奇妙旅程。'
              : 'Choose a question that sparks your curiosity, and we\'ll guide you through 400 years of optical discoveries.'}
          </p>
        </motion.div>

        {/* 探索理念说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            'mb-10 p-5 rounded-2xl flex items-start gap-4',
            theme === 'dark'
              ? 'bg-slate-800/30 border border-slate-700'
              : 'bg-white/60 border border-gray-200'
          )}
        >
          <Compass className={cn(
            'w-6 h-6 flex-shrink-0 mt-0.5',
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          )} />
          <div>
            <h3 className={cn(
              'text-sm font-medium mb-1',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '探索式学习' : 'Exploration-Based Learning'}
            </h3>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh
                ? '每次只呈现一点内容，让你按自己的节奏深入探索。没有压力，只有好奇心。'
                : 'We reveal content one piece at a time, letting you explore at your own pace. No pressure, just curiosity.'}
            </p>
          </div>
        </motion.div>

        {/* 探索路径入口卡片 */}
        <div className="space-y-4">
          <h2 className={cn(
            'text-sm font-medium mb-4 flex items-center gap-2',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            <Sparkles className="w-4 h-4" />
            {isZh ? '选择你想探索的问题' : 'Choose a question to explore'}
          </h2>

          {EXPLORATION_PATHS.map((path, index) => (
            <PathEntryCard
              key={path.id}
              path={path}
              theme={theme}
              index={index}
              onClick={() => handleStartExploration(path.id)}
            />
          ))}
        </div>

        {/* 底部：链接到完整编年史（高级用户） */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={cn(
            'mt-12 p-5 rounded-2xl',
            theme === 'dark'
              ? 'bg-slate-800/20 border border-slate-700/50'
              : 'bg-gray-50 border border-gray-200'
          )}
        >
          <div className="flex items-start gap-4">
            <History className={cn(
              'w-5 h-5 flex-shrink-0 mt-0.5',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )} />
            <div className="flex-1">
              <h3 className={cn(
                'text-sm font-medium mb-1',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                {isZh ? '想要更深入的探索？' : 'Want a deeper dive?'}
              </h3>
              <p className={cn(
                'text-sm mb-3',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              )}>
                {isZh
                  ? '访问完整的光学编年史，包含时间线、科学家网络、知识图谱等高级功能。'
                  : 'Visit the full Chronicles of Light with timeline, scientist networks, knowledge graphs and more.'}
              </p>
              <Link
                to="/chronicles"
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-medium transition-colors',
                  theme === 'dark'
                    ? 'text-cyan-400 hover:text-cyan-300'
                    : 'text-cyan-600 hover:text-cyan-700'
                )}
              >
                {isZh ? '查看完整编年史' : 'View Full Chronicles'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 学习方式说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              emoji: '🎯',
              titleEn: 'Question-Driven',
              titleZh: '问题驱动',
              descEn: 'Start with what you\'re curious about',
              descZh: '从你好奇的问题开始'
            },
            {
              emoji: '📖',
              titleEn: 'Story-Based',
              titleZh: '故事讲述',
              descEn: 'Learn through fascinating narratives',
              descZh: '通过引人入胜的故事学习'
            },
            {
              emoji: '🔬',
              titleEn: 'Hands-On',
              titleZh: '动手实践',
              descEn: 'Try experiments at home',
              descZh: '在家尝试实验'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'p-4 rounded-xl text-center',
                theme === 'dark' ? 'bg-slate-800/30' : 'bg-white/60'
              )}
            >
              <span className="text-2xl mb-2 block">{item.emoji}</span>
              <h4 className={cn(
                'text-sm font-medium mb-1',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? item.titleZh : item.titleEn}
              </h4>
              <p className={cn(
                'text-xs',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              )}>
                {isZh ? item.descZh : item.descEn}
              </p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}

export default LightExplorerPage
