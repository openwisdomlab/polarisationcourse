/**
 * PSRTQuestStage - 游戏化 P-SRT 闯关流程组件
 *
 * 将 P-SRT 的四个阶段映射为游戏关卡流程：
 * P (Phenomenon) = Mission Brief (任务简报) - 展示奇怪的现象
 * S (Story) = Lore (背景故事) - 解锁历史档案
 * R (Reasoning) = Gameplay (核心玩法) - 互动实验与逻辑推导
 * T (Theory) = Level Clear (通关) - 总结理论，获得徽章
 */

import { useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Eye,
  Scroll,
  FlaskConical,
  Award,
  CheckCircle,
  Lock,
  Play,
  Gamepad2,
  Lightbulb,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react'

// P-SRT 阶段类型
export type PSRTStage = 'phenomenon' | 'story' | 'reasoning' | 'theory'

// 阶段配置
const STAGE_CONFIG: Record<PSRTStage, {
  icon: React.ReactNode
  color: string
  gameLabel: { en: string; zh: string }
  description: { en: string; zh: string }
  action: { en: string; zh: string }
}> = {
  phenomenon: {
    icon: <Eye className="w-5 h-5" />,
    color: '#f59e0b', // amber
    gameLabel: { en: 'Mission Brief', zh: '任务简报' },
    description: {
      en: 'Observe a mysterious phenomenon and ask questions',
      zh: '观察神秘现象，提出问题'
    },
    action: { en: 'Observe', zh: '观察' }
  },
  story: {
    icon: <Scroll className="w-5 h-5" />,
    color: '#8b5cf6', // violet
    gameLabel: { en: 'Lore Archive', zh: '历史档案' },
    description: {
      en: 'Unlock historical discoveries and scientist stories',
      zh: '解锁历史发现和科学家故事'
    },
    action: { en: 'Explore', zh: '探索' }
  },
  reasoning: {
    icon: <FlaskConical className="w-5 h-5" />,
    color: '#06b6d4', // cyan
    gameLabel: { en: 'Gameplay', zh: '核心玩法' },
    description: {
      en: 'Conduct experiments and reasoning to find answers',
      zh: '进行实验和推理，寻找答案'
    },
    action: { en: 'Experiment', zh: '实验' }
  },
  theory: {
    icon: <Award className="w-5 h-5" />,
    color: '#22c55e', // green
    gameLabel: { en: 'Level Clear', zh: '通关奖励' },
    description: {
      en: 'Master the theory and earn your badge',
      zh: '掌握理论，获得徽章'
    },
    action: { en: 'Complete', zh: '完成' }
  }
}

// 单个阶段的数据
export interface StageData {
  stage: PSRTStage
  title: { en: string; zh: string }
  content: { en: string; zh: string }
  status: 'locked' | 'available' | 'completed'
  // 关联资源
  demoLink?: string
  gameLink?: string
  chronicleLink?: string // 链接到光学编年史
  // 完成奖励
  reward?: {
    type: 'badge' | 'item' | 'insight'
    id: string
    name: { en: string; zh: string }
    icon: string
  }
}

// Quest 数据（一个完整的探究流程）
export interface QuestData {
  id: string
  unitId: string
  title: { en: string; zh: string }
  mysteryQuestion: { en: string; zh: string }
  stages: StageData[]
  color: string
  estimatedTime: number // 分钟
}

interface PSRTQuestStageProps {
  quest: QuestData
  theme: 'dark' | 'light'
  onStageComplete?: (questId: string, stage: PSRTStage) => void
  onQuestComplete?: (questId: string) => void
}

// 单个阶段卡片
function StageCard({
  stageData,
  stageConfig,
  theme,
  isActive,
  stageIndex,
  onStart
}: {
  stageData: StageData
  stageConfig: typeof STAGE_CONFIG[PSRTStage]
  theme: 'dark' | 'light'
  isActive: boolean
  stageIndex: number
  onStart: () => void
}) {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'zh' ? 'zh' : 'en'

  const isClickable = stageData.status !== 'locked'

  return (
    <motion.div
      className={`relative rounded-xl border-2 overflow-hidden transition-all duration-300 ${
        stageData.status === 'locked'
          ? theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-50 border-gray-200'
          : theme === 'dark' ? 'bg-slate-800/70 border-slate-600' : 'bg-white border-gray-200'
      }`}
      style={{
        borderColor: isActive ? stageConfig.color : undefined,
        boxShadow: isActive ? `0 0 20px ${stageConfig.color}30` : undefined,
        opacity: stageData.status === 'locked' ? 0.5 : 1,
      }}
      whileHover={isClickable ? { scale: 1.02 } : {}}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: stageIndex * 0.1 }}
    >
      {/* 阶段编号指示器 */}
      <div
        className="absolute top-0 left-0 w-8 h-8 flex items-center justify-center text-xs font-bold text-white"
        style={{
          backgroundColor: stageData.status === 'completed'
            ? '#22c55e'
            : stageData.status === 'locked'
              ? '#64748b'
              : stageConfig.color,
          clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)'
        }}
      >
        {stageData.status === 'completed' ? '✓' : stageIndex + 1}
      </div>

      <div className="p-4 pl-10">
        {/* 阶段标题行 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span style={{ color: stageConfig.color }}>{stageConfig.icon}</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: `${stageConfig.color}20`, color: stageConfig.color }}
            >
              {stageConfig.gameLabel[lang]}
            </span>
          </div>
          {stageData.status === 'completed' && (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          )}
          {stageData.status === 'locked' && (
            <Lock className="w-4 h-4 text-gray-400" />
          )}
        </div>

        {/* 阶段内容 */}
        <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {stageData.title[lang]}
        </h4>
        <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {stageData.content[lang]}
        </p>

        {/* 操作按钮 */}
        {stageData.status !== 'locked' && (
          <div className="flex flex-wrap gap-2">
            {stageData.demoLink && (
              <Link
                to={stageData.demoLink}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50'
                    : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
                }`}
              >
                <FlaskConical className="w-3 h-3" />
                Demo
              </Link>
            )}
            {stageData.gameLink && (
              <Link
                to={stageData.gameLink}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-pink-900/30 text-pink-400 hover:bg-pink-900/50'
                    : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                }`}
              >
                <Gamepad2 className="w-3 h-3" />
                Game
              </Link>
            )}
            {stageData.chronicleLink && (
              <Link
                to={stageData.chronicleLink}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-violet-900/30 text-violet-400 hover:bg-violet-900/50'
                    : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                }`}
              >
                <Scroll className="w-3 h-3" />
                Chronicle
              </Link>
            )}
            {stageData.status === 'available' && (
              <button
                onClick={onStart}
                className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white transition-all hover:scale-105"
                style={{ backgroundColor: stageConfig.color }}
              >
                <Play className="w-3 h-3" />
                {stageConfig.action[lang]}
              </button>
            )}
          </div>
        )}

        {/* 奖励预览 */}
        {stageData.reward && stageData.status !== 'locked' && (
          <div className={`mt-3 pt-2 border-t flex items-center gap-2 ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
          }`}>
            <span className="text-lg">{stageData.reward.icon}</span>
            <span className={`text-xs ${
              stageData.status === 'completed'
                ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {stageData.status === 'completed' ? '✓ ' : '🔒 '}
              {stageData.reward.name[lang]}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function PSRTQuestStage({
  quest,
  theme,
}: PSRTQuestStageProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'zh' ? 'zh' : 'en'
  const navigate = useNavigate()

  // 计算当前活跃阶段
  const activeStageIndex = useMemo(() => {
    const firstAvailable = quest.stages.findIndex(s => s.status === 'available')
    return firstAvailable >= 0 ? firstAvailable : quest.stages.length - 1
  }, [quest.stages])

  // 计算整体进度
  const progress = useMemo(() => {
    const completed = quest.stages.filter(s => s.status === 'completed').length
    return Math.round((completed / quest.stages.length) * 100)
  }, [quest.stages])

  // 是否全部完成
  const isQuestComplete = progress === 100

  const handleStageStart = (stageIndex: number) => {
    const stage = quest.stages[stageIndex]
    // 优先跳转到 demo
    if (stage.demoLink) {
      navigate({ to: stage.demoLink as string })
    } else if (stage.gameLink) {
      navigate({ to: stage.gameLink as string })
    } else if (stage.chronicleLink) {
      navigate({ to: stage.chronicleLink as string })
    }
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      theme === 'dark'
        ? 'bg-slate-800/50 border-slate-700'
        : 'bg-white border-gray-200'
    }`}>
      {/* Quest 头部 */}
      <div
        className="p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${quest.color}15 0%, transparent 60%)`
        }}
      >
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-10">
          <svg viewBox="0 0 100 100">
            <circle cx="80" cy="20" r="60" fill={quest.color} />
          </svg>
        </div>

        <div className="relative z-10">
          {/* 标题行 */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className="text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block"
                style={{ backgroundColor: `${quest.color}20`, color: quest.color }}
              >
                {t('course.quest.title')}
              </span>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {quest.title[lang]}
              </h3>
            </div>
            {isQuestComplete && (
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">{t('course.quest.completed')}</span>
              </motion.div>
            )}
          </div>

          {/* 核心问题 */}
          <div className={`p-4 rounded-xl mb-4 ${
            theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
          }`}>
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: quest.color }} />
              <div>
                <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('course.quest.coreQuestion')}
                </p>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {quest.mysteryQuestion[lang]}
                </p>
              </div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: quest.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span style={{ color: quest.color }}>{progress}%</span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                <Clock className="w-4 h-4 inline mr-1" />
                ~{quest.estimatedTime} min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* P-SRT 四阶段流程 */}
      <div className="p-6 pt-0">
        {/* 阶段连接线和卡片 */}
        <div className="relative">
          {/* 连接线 */}
          <div
            className={`absolute left-4 top-0 bottom-0 w-0.5 ${
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            }`}
          />
          {/* 进度线 */}
          <motion.div
            className="absolute left-4 top-0 w-0.5"
            style={{ backgroundColor: quest.color }}
            initial={{ height: 0 }}
            animate={{ height: `${(activeStageIndex / (quest.stages.length - 1)) * 100}%` }}
            transition={{ duration: 0.8 }}
          />

          {/* 阶段卡片 */}
          <div className="space-y-4 relative z-10 ml-8">
            {quest.stages.map((stageData, index) => (
              <StageCard
                key={stageData.stage}
                stageData={stageData}
                stageConfig={STAGE_CONFIG[stageData.stage]}
                theme={theme}
                isActive={index === activeStageIndex}
                stageIndex={index}
                onStart={() => handleStageStart(index)}
              />
            ))}
          </div>
        </div>

        {/* 底部 CTA */}
        {!isQuestComplete && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => handleStageStart(activeStageIndex)}
              className="px-6 py-3 rounded-full text-white font-medium flex items-center gap-2 mx-auto transition-all hover:scale-105"
              style={{ backgroundColor: quest.color }}
            >
              <Play className="w-5 h-5" />
              {t('course.quest.continue')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* 完成奖励展示 */}
        {isQuestComplete && (
          <motion.div
            className={`mt-6 p-4 rounded-xl text-center ${
              theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-50'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('course.quest.allComplete')}
              </span>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('course.quest.rewardsEarned')}
            </p>
            {/* 奖励列表 */}
            <div className="flex justify-center gap-4 mt-3">
              {quest.stages
                .filter(s => s.reward)
                .map(s => (
                  <div
                    key={s.reward!.id}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-2xl">{s.reward!.icon}</span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {s.reward!.name[lang]}
                    </span>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default PSRTQuestStage
