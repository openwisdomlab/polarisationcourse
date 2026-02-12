/**
 * MysteryCard - 谜题卡片组件
 * 以"问题"为锚点的单元入口，将课程从"学习"转变为"解谜"
 *
 * 设计理念：
 * - 用引人入胜的问题替代学术标题
 * - 学生点击是为了"寻找答案"，而不是"开始学习"
 * - 融入神秘感和探索欲
 */

import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  Lock,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Play,
  FlaskConical,
  Gamepad2,
  Award,
} from 'lucide-react'

// 谜题卡片的数据类型
export interface MysteryData {
  id: string
  unitNumber: number
  // 核心谜题问题（从 thinkingQuestions 提取）
  mysteryQuestion: {
    en: string
    zh: string
  }
  // 引导性提示
  teaser: {
    en: string
    zh: string
  }
  // 单元颜色
  color: string
  // 图标
  icon: React.ReactNode
  // 关联的演示模块
  relatedDemos: string[]
  // 关联的游戏关卡
  relatedGames?: string[]
  // 解锁的"光学道具"
  unlockedItems?: {
    id: string
    nameEn: string
    nameZh: string
    icon: string // emoji or icon name
    description: {
      en: string
      zh: string
    }
  }[]
  // 进度
  progress: number
  // 状态
  status: 'locked' | 'available' | 'in-progress' | 'completed'
  // 难度等级
  difficulty: 'foundation' | 'application' | 'research'
  // 预估完成时间（分钟）
  estimatedTime: number
}

interface MysteryCardProps {
  mystery: MysteryData
  theme: 'dark' | 'light'
  onStartQuest?: (mysteryId: string) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
}

// 难度标签颜色和图标
const difficultyConfig = {
  foundation: { color: '#22c55e', icon: '🌱', label: { en: 'Foundation', zh: '基础层' } },
  application: { color: '#06b6d4', icon: '🔬', label: { en: 'Application', zh: '应用层' } },
  research: { color: '#a855f7', icon: '🚀', label: { en: 'Research', zh: '研究层' } },
}

export function MysteryCard({
  mystery,
  theme,
  onStartQuest,
  isExpanded = false,
  onToggleExpand,
}: MysteryCardProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'zh' ? 'zh' : 'en'
  const [isHovered, setIsHovered] = useState(false)

  const isClickable = mystery.status !== 'locked'
  const diffConfig = difficultyConfig[mystery.difficulty]

  // 状态图标
  const statusIcon = useMemo(() => {
    switch (mystery.status) {
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case 'in-progress':
        return <Sparkles className="w-5 h-5" style={{ color: mystery.color }} />
      default:
        return <HelpCircle className="w-5 h-5" style={{ color: mystery.color }} />
    }
  }, [mystery.status, mystery.color])

  // 卡片背景效果
  const cardBackground = useMemo(() => {
    if (mystery.status === 'locked') {
      return theme === 'dark'
        ? 'bg-slate-800/30 border-slate-700/50'
        : 'bg-gray-100/50 border-gray-200/50'
    }
    return theme === 'dark'
      ? 'bg-slate-800/70 border-slate-600'
      : 'bg-white border-gray-200'
  }, [mystery.status, theme])

  return (
    <motion.div
      className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 ${cardBackground} ${
        isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
      style={{
        borderColor: isHovered && isClickable ? mystery.color : undefined,
        boxShadow: isHovered && isClickable ? `0 0 30px ${mystery.color}30` : undefined,
        opacity: mystery.status === 'locked' ? 0.6 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => isClickable && onToggleExpand?.()}
      whileHover={isClickable ? { scale: 1.02, y: -4 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* 神秘光效背景 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: mystery.status !== 'locked'
            ? `radial-gradient(circle at ${isHovered ? '50%' : '30%'} 0%, ${mystery.color}15 0%, transparent 60%)`
            : undefined,
          transition: 'background 0.5s ease',
        }}
      />

      {/* 锁定状态的迷雾效果 */}
      {mystery.status === 'locked' && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)'
                : 'linear-gradient(180deg, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.9) 100%)',
              backdropFilter: 'blur(2px)',
            }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <Lock className={`w-10 h-10 mx-auto mb-2 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`} />
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                {t('course.mystery.unlockHint')}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* 卡片主体内容 */}
      <div className={`relative z-10 p-6 ${mystery.status === 'locked' ? 'opacity-30' : ''}`}>
        {/* 顶部标签栏 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* 单元编号 */}
            <span
              className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: `${mystery.color}20`, color: mystery.color }}
            >
              {mystery.unitNumber === 0 ? t('course.units.basics.title') : `${t('course.unit')} ${mystery.unitNumber}`}
            </span>
            {/* 难度标签 */}
            <span
              className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
              style={{ backgroundColor: `${diffConfig.color}15`, color: diffConfig.color }}
            >
              <span>{diffConfig.icon}</span>
              {diffConfig.label[lang]}
            </span>
          </div>
          {/* 状态图标 */}
          {statusIcon}
        </div>

        {/* 谜题图标和问号动效 */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center relative"
            style={{ backgroundColor: `${mystery.color}15` }}
            animate={isHovered && isClickable ? { rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
          >
            <span style={{ color: mystery.color }}>{mystery.icon}</span>
            {mystery.status === 'available' && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: mystery.color }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ?
              </motion.div>
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            {/* 核心谜题问题 - 大号醒目 */}
            <h3 className={`text-lg font-bold mb-2 leading-snug ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {mystery.mysteryQuestion[lang]}
            </h3>
            {/* 引导性提示 - 小字 */}
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {mystery.teaser[lang]}
            </p>
          </div>
        </div>

        {/* 进度条 */}
        {mystery.status !== 'locked' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                {t('course.mystery.progress')}
              </span>
              <span style={{ color: mystery.color }}>{mystery.progress}%</span>
            </div>
            <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: mystery.color }}
                initial={{ width: 0 }}
                animate={{ width: `${mystery.progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* 快捷入口按钮 */}
        {mystery.status !== 'locked' && (
          <div className="flex flex-wrap gap-2">
            {/* 开始探索 */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onStartQuest?.(mystery.id)
              }}
              className="px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2"
              style={{ backgroundColor: mystery.color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-4 h-4" />
              {mystery.status === 'completed'
                ? t('course.mystery.review')
                : t('course.mystery.explore')
              }
            </motion.button>

            {/* 演示入口 */}
            {mystery.relatedDemos.length > 0 && (
              <Link
                to="/demos/$demoId"
                params={{ demoId: mystery.relatedDemos[0] }}
                onClick={(e) => e.stopPropagation()}
                className={`px-3 py-2 rounded-full text-sm flex items-center gap-1.5 transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                {t('course.mystery.demo')}
              </Link>
            )}

            {/* 游戏入口 */}
            {mystery.relatedGames && mystery.relatedGames.length > 0 && (
              <Link
                to={mystery.relatedGames[0]}
                onClick={(e) => e.stopPropagation()}
                className={`px-3 py-2 rounded-full text-sm flex items-center gap-1.5 transition-colors ${
                  theme === 'dark'
                    ? 'bg-pink-900/30 text-pink-400 hover:bg-pink-900/50'
                    : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                {t('course.mystery.play')}
              </Link>
            )}
          </div>
        )}

        {/* 展开详情 */}
        <AnimatePresence>
          {isExpanded && mystery.status !== 'locked' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                {/* 可解锁的光学道具预览 */}
                {mystery.unlockedItems && mystery.unlockedItems.length > 0 && (
                  <div className="mb-4">
                    <h4 className={`text-sm font-medium mb-2 flex items-center gap-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <Award className="w-4 h-4" style={{ color: mystery.color }} />
                      {t('course.mystery.rewards')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {mystery.unlockedItems.map((item) => (
                        <div
                          key={item.id}
                          className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                            theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
                          }`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <p className={`text-xs font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {item[`name${lang === 'zh' ? 'Zh' : 'En'}` as 'nameZh' | 'nameEn']}
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {item.description[lang]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 预估时间和更多信息 */}
                <div className="flex items-center gap-4 text-xs">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    ⏱️ {mystery.estimatedTime} {t('course.mystery.minutes')}
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    📚 {mystery.relatedDemos.length} {t('course.mystery.demos')}
                  </span>
                  {mystery.relatedGames && (
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      🎮 {mystery.relatedGames.length} {t('course.mystery.games')}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 展开指示器 */}
        {mystery.status !== 'locked' && (
          <motion.div
            className={`absolute bottom-2 right-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
            animate={{ rotate: isExpanded ? 90 : 0 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        )}
      </div>

      {/* 完成状态的庆祝效果 */}
      {mystery.status === 'completed' && (
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <polygon
              points="80,0 80,80 0,0"
              fill={mystery.color}
              opacity="0.15"
            />
            <text
              x="55"
              y="25"
              fill={mystery.color}
              fontSize="20"
              textAnchor="middle"
            >
              ✓
            </text>
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}

export default MysteryCard
