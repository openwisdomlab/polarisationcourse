/**
 * GuidedExplorationPath - 引导式探索路径
 *
 * 设计理念：
 * - 线性叙事结构，但允许跳跃
 * - 每个节点只展示最核心的内容
 * - 渐进式深度 - 基础 → 应用 → 研究
 * - 多入口多出口的网状连接
 */

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Lock,
  Play,
  Gamepad2,
  FlaskConical,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Star,
  Sparkles
} from 'lucide-react'

// 路径节点类型
export interface PathNode {
  id: string
  title: { en: string; zh: string }
  description: { en: string; zh: string }
  type: 'concept' | 'demo' | 'experiment' | 'game' | 'checkpoint'
  // 内容（根据类型不同）
  demoId?: string
  gameRoute?: string
  experimentId?: string
  // 核心要点（最多3个）
  keyPoints?: { en: string; zh: string }[]
  // Stop & Think 问题
  thinkQuestion?: { en: string; zh: string }
  // 时间估计（分钟）
  duration?: number
  // 是否可选
  optional?: boolean
}

// 探索路径定义
export interface ExplorationPath {
  id: string
  title: { en: string; zh: string }
  description: { en: string; zh: string }
  targetAudience: { en: string; zh: string }
  estimatedTime: number // 分钟
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  color: string
  nodes: PathNode[]
  prerequisites?: string[]
  rewards?: { en: string; zh: string }[]
}

// 节点类型配置
const NODE_TYPE_CONFIG = {
  concept: {
    icon: <BookOpen className="w-4 h-4" />,
    color: '#22d3ee',
    labelEn: 'Learn',
    labelZh: '学习'
  },
  demo: {
    icon: <Play className="w-4 h-4" />,
    color: '#10b981',
    labelEn: 'Explore',
    labelZh: '探索'
  },
  experiment: {
    icon: <FlaskConical className="w-4 h-4" />,
    color: '#f59e0b',
    labelEn: 'Try',
    labelZh: '尝试'
  },
  game: {
    icon: <Gamepad2 className="w-4 h-4" />,
    color: '#ec4899',
    labelEn: 'Play',
    labelZh: '游戏'
  },
  checkpoint: {
    icon: <Lightbulb className="w-4 h-4" />,
    color: '#8b5cf6',
    labelEn: 'Reflect',
    labelZh: '反思'
  }
}

// 预定义的探索路径
export const EXPLORATION_PATHS: ExplorationPath[] = [
  {
    id: 'polarization-basics',
    title: {
      en: 'Polarization Basics',
      zh: '偏振基础'
    },
    description: {
      en: 'Discover what polarization is and why it matters',
      zh: '发现什么是偏振以及它为什么重要'
    },
    targetAudience: {
      en: 'Anyone curious about light',
      zh: '对光感到好奇的任何人'
    },
    estimatedTime: 15,
    difficulty: 'beginner',
    color: '#22c55e',
    nodes: [
      {
        id: 'intro',
        title: { en: 'What is Polarization?', zh: '什么是偏振？' },
        description: {
          en: 'Light as a wave that can vibrate in different directions',
          zh: '光是一种可以在不同方向振动的波'
        },
        type: 'concept',
        keyPoints: [
          { en: 'Light is a wave', zh: '光是一种波' },
          { en: 'Waves can vibrate in different directions', zh: '波可以在不同方向振动' },
          { en: 'Polarization describes the vibration direction', zh: '偏振描述振动方向' }
        ],
        duration: 3
      },
      {
        id: 'demo-intro',
        title: { en: 'See Polarization', zh: '看见偏振' },
        description: {
          en: 'Interactive visualization of polarized light',
          zh: '偏振光的互动可视化'
        },
        type: 'demo',
        demoId: 'polarization-intro',
        duration: 3
      },
      {
        id: 'checkpoint-1',
        title: { en: 'Stop & Think', zh: '停下来想想' },
        description: {
          en: 'Reflect on what you\'ve learned',
          zh: '反思你学到的东西'
        },
        type: 'checkpoint',
        thinkQuestion: {
          en: 'If light can vibrate in any direction, what makes "polarized" light special?',
          zh: '如果光可以向任何方向振动，"偏振"光有什么特别之处？'
        },
        duration: 2
      },
      {
        id: 'experiment-sunglasses',
        title: { en: 'Try It Yourself', zh: '亲自尝试' },
        description: {
          en: 'Discover polarization with sunglasses',
          zh: '用太阳镜发现偏振'
        },
        type: 'experiment',
        experimentId: 'polarizer-sunglasses',
        duration: 5
      },
      {
        id: 'game-level1',
        title: { en: 'Test Your Knowledge', zh: '测试你的知识' },
        description: {
          en: 'Solve a simple polarization puzzle',
          zh: '解决一个简单的偏振谜题'
        },
        type: 'game',
        gameRoute: '/games/2d?level=0',
        optional: true,
        duration: 3
      }
    ],
    rewards: [
      { en: 'Understand polarization basics', zh: '理解偏振基础' },
      { en: 'Know why polarized sunglasses work', zh: '知道偏振太阳镜为什么有效' }
    ]
  },
  {
    id: 'malus-law-journey',
    title: {
      en: "Malus's Law Adventure",
      zh: '马吕斯定律之旅'
    },
    description: {
      en: 'Discover the mathematics behind polarizers',
      zh: '发现偏振片背后的数学'
    },
    targetAudience: {
      en: 'Learners ready for formulas',
      zh: '准备好学习公式的学习者'
    },
    estimatedTime: 20,
    difficulty: 'intermediate',
    color: '#f59e0b',
    prerequisites: ['polarization-basics'],
    nodes: [
      {
        id: 'setup',
        title: { en: 'The Question', zh: '问题' },
        description: {
          en: 'How much light passes through a polarizer?',
          zh: '有多少光能通过偏振片？'
        },
        type: 'concept',
        keyPoints: [
          { en: 'Polarizers filter light', zh: '偏振片过滤光' },
          { en: 'The amount depends on the angle', zh: '通过量取决于角度' }
        ],
        duration: 2
      },
      {
        id: 'demo-malus',
        title: { en: 'See the Pattern', zh: '看到规律' },
        description: {
          en: 'Watch intensity change with angle',
          zh: '观察强度随角度变化'
        },
        type: 'demo',
        demoId: 'malus',
        duration: 5
      },
      {
        id: 'reveal',
        title: { en: 'The Formula', zh: '公式' },
        description: {
          en: 'I = I₀ cos²(θ) - the intensity follows cosine squared!',
          zh: 'I = I₀ cos²(θ) - 强度遵循余弦平方！'
        },
        type: 'concept',
        keyPoints: [
          { en: 'I = transmitted intensity', zh: 'I = 透射强度' },
          { en: 'I₀ = initial intensity', zh: 'I₀ = 初始强度' },
          { en: 'θ = angle between polarization and filter', zh: 'θ = 偏振方向与滤光片的夹角' }
        ],
        duration: 3
      },
      {
        id: 'checkpoint-2',
        title: { en: 'Predict', zh: '预测' },
        description: {
          en: 'What happens at 45°? At 90°?',
          zh: '在45°时会发生什么？在90°时呢？'
        },
        type: 'checkpoint',
        thinkQuestion: {
          en: 'At 45°, is half the light transmitted? More? Less?',
          zh: '在45°时，是一半的光透过吗？更多？更少？'
        },
        duration: 2
      },
      {
        id: 'game-malus',
        title: { en: 'Apply It', zh: '应用它' },
        description: {
          en: 'Use your new knowledge to solve puzzles',
          zh: '用你的新知识解决谜题'
        },
        type: 'game',
        gameRoute: '/games/2d?level=2',
        duration: 5
      }
    ],
    rewards: [
      { en: 'Understand Malus\'s Law', zh: '理解马吕斯定律' },
      { en: 'Predict polarizer behavior', zh: '预测偏振片行为' },
      { en: 'Use the cos² formula', zh: '使用cos²公式' }
    ]
  }
]

interface GuidedExplorationPathProps {
  path: ExplorationPath
  onComplete?: () => void
  startNode?: number
}

export function GuidedExplorationPath({
  path,
  onComplete,
  startNode = 0
}: GuidedExplorationPathProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const navigate = useNavigate()

  const [currentNodeIndex, setCurrentNodeIndex] = useState(startNode)
  const [completedNodes, setCompletedNodes] = useState<string[]>([])
  const [isStarted, setIsStarted] = useState(false)

  const currentNode = path.nodes[currentNodeIndex]
  const nodeConfig = NODE_TYPE_CONFIG[currentNode?.type || 'concept']
  const progress = (completedNodes.length / path.nodes.length) * 100

  // 标记节点完成
  const completeCurrentNode = () => {
    if (!completedNodes.includes(currentNode.id)) {
      setCompletedNodes(prev => [...prev, currentNode.id])
    }
  }

  // 前进到下一节点
  const goToNextNode = () => {
    completeCurrentNode()
    if (currentNodeIndex < path.nodes.length - 1) {
      setCurrentNodeIndex(prev => prev + 1)
    } else {
      onComplete?.()
    }
  }

  // 返回上一节点
  const goToPrevNode = () => {
    if (currentNodeIndex > 0) {
      setCurrentNodeIndex(prev => prev - 1)
    }
  }

  // 跳转到特定节点
  const jumpToNode = (index: number) => {
    setCurrentNodeIndex(index)
  }

  // 处理节点动作
  const handleNodeAction = () => {
    switch (currentNode.type) {
      case 'demo':
        if (currentNode.demoId) {
          navigate(`/demos/${currentNode.demoId}`)
        }
        break
      case 'game':
        if (currentNode.gameRoute) {
          navigate(currentNode.gameRoute)
        }
        break
      case 'experiment':
        // 在当前页面展示实验模块
        break
      default:
        goToNextNode()
    }
  }

  if (!isStarted) {
    // 路径介绍页
    return (
      <div className={cn(
        'rounded-2xl overflow-hidden',
        theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-lg'
      )}>
        <div
          className="h-2"
          style={{ backgroundColor: path.color }}
        />
        <div className="p-6 space-y-5">
          {/* 标题 */}
          <div>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white mb-3"
              style={{ backgroundColor: path.color }}
            >
              <Sparkles className="w-3 h-3" />
              {path.difficulty === 'beginner'
                ? (isZh ? '入门' : 'Beginner')
                : path.difficulty === 'intermediate'
                  ? (isZh ? '进阶' : 'Intermediate')
                  : (isZh ? '高级' : 'Advanced')}
            </span>
            <h2 className={cn(
              'text-xl font-bold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? path.title.zh : path.title.en}
            </h2>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? path.description.zh : path.description.en}
            </p>
          </div>

          {/* 元信息 */}
          <div className="flex items-center gap-4 text-sm">
            <span className={cn(
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              ⏱️ ~{path.estimatedTime} {isZh ? '分钟' : 'min'}
            </span>
            <span className={cn(
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              📍 {path.nodes.length} {isZh ? '个站点' : 'stops'}
            </span>
          </div>

          {/* 路线预览 */}
          <div className={cn(
            'p-4 rounded-xl',
            theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
          )}>
            <h3 className={cn(
              'text-sm font-medium mb-3',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              {isZh ? '路线预览' : 'Path Preview'}
            </h3>
            <div className="space-y-2">
              {path.nodes.slice(0, 4).map((node, idx) => {
                const config = NODE_TYPE_CONFIG[node.type]
                return (
                  <div
                    key={node.id}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: config.color }}
                    >
                      {idx + 1}
                    </div>
                    <span className={cn(
                      'text-sm',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {isZh ? node.title.zh : node.title.en}
                    </span>
                    {node.optional && (
                      <span className={cn(
                        'text-xs px-1.5 py-0.5 rounded',
                        theme === 'dark' ? 'bg-slate-600 text-gray-400' : 'bg-gray-200 text-gray-500'
                      )}>
                        {isZh ? '可选' : 'Optional'}
                      </span>
                    )}
                  </div>
                )
              })}
              {path.nodes.length > 4 && (
                <span className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  +{path.nodes.length - 4} {isZh ? '更多' : 'more'}...
                </span>
              )}
            </div>
          </div>

          {/* 你将学会 */}
          {path.rewards && (
            <div>
              <h3 className={cn(
                'text-sm font-medium mb-2',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                {isZh ? '你将学会' : 'You will learn'}
              </h3>
              <ul className="space-y-1">
                {path.rewards.map((reward, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Star className="w-3 h-3 text-amber-500" />
                    <span className={cn(
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {isZh ? reward.zh : reward.en}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 开始按钮 */}
          <button
            onClick={() => setIsStarted(true)}
            className="w-full py-3 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{ backgroundColor: path.color }}
          >
            {isZh ? '开始探索' : 'Start Journey'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // 探索进行中
  return (
    <div className={cn(
      'rounded-2xl overflow-hidden',
      theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-lg'
    )}>
      {/* 进度条 */}
      <div className={cn(
        'h-1',
        theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
      )}>
        <motion.div
          className="h-full"
          style={{ backgroundColor: path.color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* 节点导航 */}
      <div className={cn(
        'px-4 py-3 flex items-center gap-1 overflow-x-auto',
        theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50'
      )}>
        {path.nodes.map((node, idx) => {
          const config = NODE_TYPE_CONFIG[node.type]
          const isCompleted = completedNodes.includes(node.id)
          const isCurrent = idx === currentNodeIndex

          return (
            <button
              key={node.id}
              onClick={() => jumpToNode(idx)}
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                isCurrent && 'ring-2 ring-offset-2',
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isCurrent
                    ? 'text-white'
                    : theme === 'dark'
                      ? 'bg-slate-600 text-gray-400'
                      : 'bg-gray-200 text-gray-500'
              )}
              style={{
                backgroundColor: isCurrent && !isCompleted ? config.color : undefined,
                // @ts-ignore
                '--tw-ring-color': config.color
              }}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs font-medium">{idx + 1}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* 当前节点内容 */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNode.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {/* 节点标题 */}
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: nodeConfig.color }}
              >
                {nodeConfig.icon}
              </div>
              <div>
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: nodeConfig.color }}
                >
                  {isZh ? nodeConfig.labelZh : nodeConfig.labelEn}
                </span>
                <h3 className={cn(
                  'font-semibold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? currentNode.title.zh : currentNode.title.en}
                </h3>
              </div>
            </div>

            {/* 描述 */}
            <p className={cn(
              'text-sm leading-relaxed',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              {isZh ? currentNode.description.zh : currentNode.description.en}
            </p>

            {/* 关键要点 */}
            {currentNode.keyPoints && (
              <div className={cn(
                'p-4 rounded-xl space-y-2',
                theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
              )}>
                {currentNode.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2"
                  >
                    <span style={{ color: nodeConfig.color }}>•</span>
                    <span className={cn(
                      'text-sm',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {isZh ? point.zh : point.en}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 思考问题 */}
            {currentNode.thinkQuestion && (
              <div className={cn(
                'p-4 rounded-xl border-l-4',
                theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
              )} style={{ borderColor: '#8b5cf6' }}>
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
                  )}>
                    {isZh ? currentNode.thinkQuestion.zh : currentNode.thinkQuestion.en}
                  </p>
                </div>
              </div>
            )}

            {/* 动作按钮 */}
            {(currentNode.type === 'demo' || currentNode.type === 'game') && (
              <button
                onClick={handleNodeAction}
                className="w-full py-3 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ backgroundColor: nodeConfig.color }}
              >
                {currentNode.type === 'demo' && (
                  <>
                    <Play className="w-4 h-4" />
                    {isZh ? '打开演示' : 'Open Demo'}
                  </>
                )}
                {currentNode.type === 'game' && (
                  <>
                    <Gamepad2 className="w-4 h-4" />
                    {isZh ? '开始游戏' : 'Play Game'}
                  </>
                )}
              </button>
            )}

            {/* 导航 */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={goToPrevNode}
                disabled={currentNodeIndex === 0}
                className={cn(
                  'flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-colors',
                  currentNodeIndex === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : '',
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                {isZh ? '上一步' : 'Back'}
              </button>

              <span className={cn(
                'text-xs',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                {currentNodeIndex + 1} / {path.nodes.length}
              </span>

              <button
                onClick={goToNextNode}
                className={cn(
                  'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white',
                )}
                style={{ backgroundColor: path.color }}
              >
                {currentNodeIndex === path.nodes.length - 1
                  ? (isZh ? '完成' : 'Finish')
                  : currentNode.optional
                    ? (isZh ? '跳过' : 'Skip')
                    : (isZh ? '继续' : 'Continue')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GuidedExplorationPath
