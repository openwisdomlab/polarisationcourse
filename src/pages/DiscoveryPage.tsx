/**
 * DiscoveryPage - 渐进式探索入口
 *
 * 设计理念 (参考 Google Learn About):
 * 1. 以问题和好奇心为入口，而非信息菜单
 * 2. 渐进式披露 - 先展示核心体验，深度内容按需展开
 * 3. Stop & Think 检查点 - 促进主动思考
 * 4. 深度控制 - 简化/深入按钮
 * 5. 相关发现 - 引导网状探索
 *
 * 核心原则：
 * - 避免信息过载
 * - 引导式探索
 * - 动手优先
 */

import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Eye,
  ChevronRight,
  ChevronDown,
  Play,
  Lightbulb,
  BookOpen,
  Gamepad2,
  FlaskConical,
  ArrowRight,
  ArrowLeft,
  Compass,
  HelpCircle,
  Check,
  RefreshCw,
  Minus,
  Plus,
  X,
  MessageCircle
} from 'lucide-react'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { PersistentHeader } from '@/components/shared/PersistentHeader'

// 发现主题定义 - 每个主题聚焦一个核心问题
interface DiscoveryTopic {
  id: string
  question: { en: string; zh: string }
  teaser: { en: string; zh: string }
  emoji: string
  color: string
  stage: 1 | 2 | 3
  // 核心体验 - 最小化入口
  quickDemo?: string  // Demo ID for instant gratification
  // 扩展内容
  relatedTopics: string[]
}

// 精选的发现主题 - 按学习阶段组织
const DISCOVERY_TOPICS: DiscoveryTopic[] = [
  // 阶段1: 看见偏振
  {
    id: 'sunglasses-magic',
    question: {
      en: 'Why do polarized sunglasses reduce glare?',
      zh: '偏振太阳镜为什么能减少眩光？'
    },
    teaser: {
      en: 'Tilt your head while wearing polarized sunglasses near water...',
      zh: '戴着偏振太阳镜在水边歪头试试...'
    },
    emoji: '🕶️',
    color: '#22c55e',
    stage: 1,
    quickDemo: 'polarization-intro',
    relatedTopics: ['lcd-screen', 'photography-filter']
  },
  {
    id: 'lcd-screen',
    question: {
      en: 'Why does your phone screen go dark when tilted?',
      zh: '手机屏幕为什么歪着看会变暗？'
    },
    teaser: {
      en: 'Try looking at an LCD through polarized sunglasses...',
      zh: '试试透过偏振太阳镜看液晶屏...'
    },
    emoji: '📱',
    color: '#06b6d4',
    stage: 1,
    quickDemo: 'polarization-types-unified',
    relatedTopics: ['sunglasses-magic', 'three-polarizers']
  },
  {
    id: 'three-polarizers',
    question: {
      en: 'Can adding a filter let MORE light through?',
      zh: '加一片滤镜反而能让更多光通过？'
    },
    teaser: {
      en: 'This paradox surprised even Einstein!',
      zh: '这个悖论连爱因斯坦都惊讶！'
    },
    emoji: '🔮',
    color: '#8b5cf6',
    stage: 1,
    quickDemo: 'malus',
    relatedTopics: ['lcd-screen', 'quantum-eraser']
  },
  // 阶段2: 理解规律
  {
    id: 'rainbow-crystal',
    question: {
      en: 'How does a crystal create two images?',
      zh: '一块晶体怎么能产生两个像？'
    },
    teaser: {
      en: 'Calcite creates magic right on your desk',
      zh: '方解石在你桌上就能变魔术'
    },
    emoji: '💎',
    color: '#f59e0b',
    stage: 2,
    quickDemo: 'birefringence',
    relatedTopics: ['waveplate-magic', 'stress-patterns']
  },
  {
    id: 'waveplate-magic',
    question: {
      en: 'How can you twist light without touching it?',
      zh: '怎么不碰光就能扭转它？'
    },
    teaser: {
      en: 'Waveplates are the Swiss army knife of optics',
      zh: '波片是光学界的瑞士军刀'
    },
    emoji: '🌀',
    color: '#ec4899',
    stage: 2,
    quickDemo: 'waveplate',
    relatedTopics: ['rainbow-crystal', 'circular-polarization']
  },
  {
    id: 'sky-blue',
    question: {
      en: 'Why is the sky blue? (And why is sunset red?)',
      zh: '天空为什么是蓝色的？（日落为什么是红色的？）'
    },
    teaser: {
      en: 'The answer involves dancing molecules and scattered light',
      zh: '答案涉及跳舞的分子和散射的光'
    },
    emoji: '🌅',
    color: '#3b82f6',
    stage: 2,
    quickDemo: 'rayleigh',
    relatedTopics: ['polarized-sky', 'bee-navigation']
  },
  // 阶段3: 测量与应用
  {
    id: 'stress-patterns',
    question: {
      en: 'How can you see stress in transparent plastic?',
      zh: '怎么能看到透明塑料里的应力？'
    },
    teaser: {
      en: 'Engineers use this to prevent disasters',
      zh: '工程师用这个来预防灾难'
    },
    emoji: '🔬',
    color: '#6366f1',
    stage: 3,
    quickDemo: 'chromatic',
    relatedTopics: ['rainbow-crystal', 'medical-imaging']
  },
  {
    id: 'medical-imaging',
    question: {
      en: 'How do doctors see through your skin?',
      zh: '医生怎么能看穿你的皮肤？'
    },
    teaser: {
      en: 'Polarized light reveals what\'s invisible to the eye',
      zh: '偏振光揭示肉眼看不见的东西'
    },
    emoji: '🏥',
    color: '#10b981',
    stage: 3,
    quickDemo: 'mie-scattering',
    relatedTopics: ['stress-patterns', 'astronomy']
  }
]

// 当前发现状态
interface DiscoveryState {
  currentTopicId: string | null
  expandedSections: string[]
  completedCheckpoints: string[]
  depthLevel: 'simple' | 'formulas' | 'theory'
}

// 入口卡片组件 - 单个问题入口
function QuestionEntryCard({
  topic,
  onClick,
  isActive
}: {
  topic: DiscoveryTopic
  onClick: () => void
  isActive: boolean
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative p-5 rounded-2xl text-left transition-all border-2',
        'group cursor-pointer overflow-hidden',
        theme === 'dark'
          ? 'bg-slate-800/60 hover:bg-slate-800'
          : 'bg-white/80 hover:bg-white shadow-sm hover:shadow-md',
        isActive ? 'ring-2 ring-offset-2' : ''
      )}
      style={{
        borderColor: isActive ? topic.color : 'transparent',
        // @ts-ignore
        '--ring-color': topic.color
      }}
    >
      {/* 背景装饰 */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: topic.color }}
      />

      {/* Emoji */}
      <span className="text-3xl mb-3 block">{topic.emoji}</span>

      {/* 问题 */}
      <h3 className={cn(
        'font-semibold text-base mb-2 leading-snug',
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      )}>
        {isZh ? topic.question.zh : topic.question.en}
      </h3>

      {/* 引子 */}
      <p className={cn(
        'text-sm leading-relaxed',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? topic.teaser.zh : topic.teaser.en}
      </p>

      {/* 探索箭头 */}
      <div className={cn(
        'absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center',
        'opacity-0 group-hover:opacity-100 transition-opacity',
        theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
      )}>
        <ArrowRight className="w-4 h-4" style={{ color: topic.color }} />
      </div>

      {/* 阶段标识 */}
      <div
        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
        style={{ backgroundColor: topic.color }}
      >
        {topic.stage}
      </div>
    </motion.button>
  )
}

// Stop & Think 检查点组件
function StopAndThink({
  question,
  hint,
  onComplete,
  isCompleted
}: {
  question: { en: string; zh: string }
  hint?: { en: string; zh: string }
  onComplete: () => void
  isCompleted: boolean
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [showHint, setShowHint] = useState(false)
  const [userThinking, setUserThinking] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-xl border-l-4 border-amber-500',
        theme === 'dark'
          ? 'bg-amber-500/10'
          : 'bg-amber-50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h4 className={cn(
            'font-medium text-sm mb-2',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
          )}>
            {isZh ? '停下来想一想' : 'Stop & Think'}
          </h4>
          <p className={cn(
            'text-sm mb-3',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {isZh ? question.zh : question.en}
          </p>

          {/* 互动按钮 */}
          <div className="flex items-center gap-2 flex-wrap">
            {!isCompleted && (
              <>
                <button
                  onClick={() => setUserThinking(true)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    userThinking
                      ? 'bg-amber-500 text-white'
                      : theme === 'dark'
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {isZh ? '我在思考...' : "I'm thinking..."}
                </button>
                {userThinking && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={onComplete}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    {isZh ? '我想好了！' : 'Got it!'}
                  </motion.button>
                )}
              </>
            )}
            {isCompleted && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Check className="w-3 h-3" />
                {isZh ? '已完成思考' : 'Thought through'}
              </span>
            )}
            {hint && !isCompleted && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs transition-colors',
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {showHint
                  ? (isZh ? '隐藏提示' : 'Hide hint')
                  : (isZh ? '给我提示' : 'Give me a hint')}
              </button>
            )}
          </div>

          {/* 提示内容 */}
          <AnimatePresence>
            {showHint && hint && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  'text-xs mt-2 pt-2 border-t',
                  theme === 'dark'
                    ? 'text-gray-400 border-gray-700'
                    : 'text-gray-600 border-gray-200'
                )}
              >
                💡 {isZh ? hint.zh : hint.en}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// 深度控制按钮
function DepthControls({
  currentDepth,
  onDepthChange
}: {
  currentDepth: 'simple' | 'formulas' | 'theory'
  onDepthChange: (depth: 'simple' | 'formulas' | 'theory') => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const depths = [
    { key: 'simple' as const, label: isZh ? '简单' : 'Simple', icon: <Eye className="w-3 h-3" /> },
    { key: 'formulas' as const, label: isZh ? '公式' : 'Formulas', icon: <BookOpen className="w-3 h-3" /> },
    { key: 'theory' as const, label: isZh ? '理论' : 'Theory', icon: <FlaskConical className="w-3 h-3" /> }
  ]

  return (
    <div className={cn(
      'inline-flex items-center gap-1 p-1 rounded-lg',
      theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
    )}>
      {depths.map(depth => (
        <button
          key={depth.key}
          onClick={() => onDepthChange(depth.key)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
            currentDepth === depth.key
              ? 'bg-cyan-500 text-white shadow-sm'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          )}
        >
          {depth.icon}
          {depth.label}
        </button>
      ))}
    </div>
  )
}

// 微型演示卡片 - 简化版demo入口
function MiniDemoCard({
  demoId,
  topic,
  onExpand
}: {
  demoId: string
  topic: DiscoveryTopic
  onExpand: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-xl border',
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700'
          : 'bg-white border-gray-200'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${topic.color}20` }}
          >
            <Play className="w-4 h-4" style={{ color: topic.color }} />
          </div>
          <span className={cn(
            'text-sm font-medium',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '动手试试' : 'Try it yourself'}
          </span>
        </div>
        <Link
          to={`/demos/${demoId}`}
          className={cn(
            'text-xs px-3 py-1 rounded-full transition-colors',
            theme === 'dark'
              ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {isZh ? '全屏演示' : 'Full demo'} →
        </Link>
      </div>

      {/* 嵌入式演示预览区 */}
      <div
        className={cn(
          'aspect-video rounded-lg flex items-center justify-center cursor-pointer group',
          theme === 'dark' ? 'bg-slate-900' : 'bg-gray-100'
        )}
        onClick={onExpand}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: `${topic.color}20` }}
          >
            <Play className="w-6 h-6" style={{ color: topic.color }} />
          </div>
          <p className={cn(
            'text-xs',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {isZh ? '点击开始互动' : 'Click to interact'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// 相关发现组件
function RelatedDiscoveries({
  topics,
  currentTopicId,
  onSelect
}: {
  topics: DiscoveryTopic[]
  currentTopicId: string
  onSelect: (topicId: string) => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const currentTopic = topics.find(t => t.id === currentTopicId)
  const relatedTopics = currentTopic?.relatedTopics
    .map(id => topics.find(t => t.id === id))
    .filter(Boolean) as DiscoveryTopic[]

  if (!relatedTopics?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'p-4 rounded-xl',
        theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-50'
      )}
    >
      <h4 className={cn(
        'text-sm font-medium mb-3 flex items-center gap-2',
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      )}>
        <MessageCircle className="w-4 h-4" />
        {isZh ? '你可能也想知道...' : 'You might also wonder...'}
      </h4>
      <div className="space-y-2">
        {relatedTopics.map(topic => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.id)}
            className={cn(
              'w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors group',
              theme === 'dark'
                ? 'hover:bg-slate-700/50'
                : 'hover:bg-white'
            )}
          >
            <span className="text-xl">{topic.emoji}</span>
            <span className={cn(
              'text-sm flex-1',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              {isZh ? topic.question.zh : topic.question.en}
            </span>
            <ChevronRight
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: topic.color }}
            />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// 学习阶段导航
function StageNavigator({
  currentStage,
  onStageChange
}: {
  currentStage: 1 | 2 | 3 | null
  onStageChange: (stage: 1 | 2 | 3 | null) => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const stages = [
    { num: 1, label: isZh ? '看见偏振' : 'See', color: '#22c55e', icon: '👁️' },
    { num: 2, label: isZh ? '理解规律' : 'Understand', color: '#06b6d4', icon: '📐' },
    { num: 3, label: isZh ? '测量应用' : 'Apply', color: '#8b5cf6', icon: '🔬' }
  ] as const

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onStageChange(null)}
        className={cn(
          'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
          currentStage === null
            ? 'bg-gray-500 text-white'
            : theme === 'dark'
              ? 'bg-slate-800 text-gray-400 hover:text-white'
              : 'bg-gray-100 text-gray-600 hover:text-gray-900'
        )}
      >
        {isZh ? '全部' : 'All'}
      </button>
      {stages.map(stage => (
        <button
          key={stage.num}
          onClick={() => onStageChange(stage.num)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5',
            currentStage === stage.num
              ? 'text-white'
              : theme === 'dark'
                ? 'bg-slate-800 text-gray-400 hover:text-white'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
          )}
          style={{
            backgroundColor: currentStage === stage.num ? stage.color : undefined
          }}
        >
          <span>{stage.icon}</span>
          <span className="hidden sm:inline">{stage.label}</span>
        </button>
      ))}
    </div>
  )
}

// 主页面组件
export default function DiscoveryPage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // 状态
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    searchParams.get('topic')
  )
  const [filterStage, setFilterStage] = useState<1 | 2 | 3 | null>(null)
  const [depthLevel, setDepthLevel] = useState<'simple' | 'formulas' | 'theory'>('simple')
  const [completedCheckpoints, setCompletedCheckpoints] = useState<string[]>([])
  const [showDemoModal, setShowDemoModal] = useState(false)

  // 更新URL
  useEffect(() => {
    if (selectedTopicId) {
      setSearchParams({ topic: selectedTopicId })
    } else {
      setSearchParams({})
    }
  }, [selectedTopicId, setSearchParams])

  // 筛选主题
  const filteredTopics = useMemo(() => {
    if (filterStage === null) return DISCOVERY_TOPICS
    return DISCOVERY_TOPICS.filter(t => t.stage === filterStage)
  }, [filterStage])

  const selectedTopic = DISCOVERY_TOPICS.find(t => t.id === selectedTopicId)

  // 处理检查点完成
  const handleCheckpointComplete = (checkpointId: string) => {
    setCompletedCheckpoints(prev => [...prev, checkpointId])
  }

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    )}>
      <PersistentHeader />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-3xl md:text-4xl font-bold mb-3',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
          >
            {isZh ? '发现偏振' : 'Discover Polarization'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, delay: 0.1 }}
            className={cn(
              'text-lg',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}
          >
            {isZh
              ? '从一个问题开始，探索光的隐藏世界'
              : 'Start with a question, explore the hidden world of light'}
          </motion.p>
        </div>

        {/* 控制栏 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <StageNavigator
            currentStage={filterStage}
            onStageChange={setFilterStage}
          />
          <div className="flex items-center gap-3">
            <DepthControls
              currentDepth={depthLevel}
              onDepthChange={setDepthLevel}
            />
            <LanguageThemeSwitcher />
          </div>
        </div>

        {/* 主内容区 */}
        <AnimatePresence mode="wait">
          {!selectedTopicId ? (
            // 问题网格视图
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* 引导提示 */}
              <div className={cn(
                'text-center py-6 mb-6 rounded-2xl',
                theme === 'dark' ? 'bg-slate-800/30' : 'bg-white/50'
              )}>
                <Compass className={cn(
                  'w-8 h-8 mx-auto mb-3',
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                )} />
                <p className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {isZh
                    ? '选择一个让你好奇的问题，开始你的探索之旅'
                    : 'Pick a question that makes you curious to start your journey'}
                </p>
              </div>

              {/* 问题卡片网格 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTopics.map(topic => (
                  <QuestionEntryCard
                    key={topic.id}
                    topic={topic}
                    onClick={() => setSelectedTopicId(topic.id)}
                    isActive={false}
                  />
                ))}
              </div>

              {/* 底部链接 */}
              <div className="mt-8 text-center">
                <Link
                  to="/demos"
                  className={cn(
                    'inline-flex items-center gap-2 text-sm transition-colors',
                    theme === 'dark'
                      ? 'text-gray-500 hover:text-gray-300'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  {isZh ? '想看完整演示目录？' : 'Want the full demo catalog?'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ) : (
            // 探索详情视图
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              {/* 返回按钮 */}
              <button
                onClick={() => setSelectedTopicId(null)}
                className={cn(
                  'flex items-center gap-2 mb-6 text-sm transition-colors',
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                {isZh ? '返回问题列表' : 'Back to questions'}
              </button>

              {selectedTopic && (
                <div className="space-y-6">
                  {/* 主题标题 */}
                  <div className={cn(
                    'p-6 rounded-2xl',
                    theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-sm'
                  )}>
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{selectedTopic.emoji}</span>
                      <div className="flex-1">
                        <h2 className={cn(
                          'text-xl font-bold mb-2',
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>
                          {isZh ? selectedTopic.question.zh : selectedTopic.question.en}
                        </h2>
                        <p className={cn(
                          'text-sm',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {isZh ? selectedTopic.teaser.zh : selectedTopic.teaser.en}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 动手试试 - 核心互动 */}
                  {selectedTopic.quickDemo && (
                    <MiniDemoCard
                      demoId={selectedTopic.quickDemo}
                      topic={selectedTopic}
                      onExpand={() => navigate(`/demos/${selectedTopic.quickDemo}`)}
                    />
                  )}

                  {/* Stop & Think 检查点 */}
                  <StopAndThink
                    question={{
                      en: `Before diving deeper: What do you think is happening here? Why might ${selectedTopic.question.en.toLowerCase().replace('?', '')}?`,
                      zh: `在深入之前：你觉得这里发生了什么？为什么${selectedTopic.question.zh.replace('？', '')}？`
                    }}
                    hint={{
                      en: 'Think about what makes polarized light special compared to ordinary light.',
                      zh: '想想偏振光和普通光相比有什么特别之处。'
                    }}
                    onComplete={() => handleCheckpointComplete(`${selectedTopic.id}-think`)}
                    isCompleted={completedCheckpoints.includes(`${selectedTopic.id}-think`)}
                  />

                  {/* 深入内容 - 根据深度级别显示 */}
                  <div className={cn(
                    'p-5 rounded-xl border',
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700'
                      : 'bg-white border-gray-200'
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={cn(
                        'font-medium flex items-center gap-2',
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        <BookOpen className="w-4 h-4" />
                        {isZh ? '了解更多' : 'Learn More'}
                      </h3>
                      <DepthControls
                        currentDepth={depthLevel}
                        onDepthChange={setDepthLevel}
                      />
                    </div>

                    {/* 根据深度显示不同内容 */}
                    <div className={cn(
                      'text-sm leading-relaxed',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {depthLevel === 'simple' && (
                        <p>
                          {isZh
                            ? '偏振光就像只在一个方向振动的波。普通光在所有方向振动，但偏振滤镜只让特定方向的振动通过。就像栅栏只让特定方向的绳波通过一样。'
                            : 'Polarized light is like a wave that only vibrates in one direction. Regular light vibrates in all directions, but a polarizing filter only lets vibrations in a specific direction pass through. It\'s like a fence that only allows rope waves in a specific orientation to pass.'}
                        </p>
                      )}
                      {depthLevel === 'formulas' && (
                        <div className="space-y-3">
                          <p>
                            {isZh
                              ? '当偏振光通过偏振片时，透射强度遵循马吕斯定律：'
                              : 'When polarized light passes through a polarizer, the transmitted intensity follows Malus\'s Law:'}
                          </p>
                          <div className={cn(
                            'p-3 rounded-lg font-mono text-center',
                            theme === 'dark' ? 'bg-slate-900' : 'bg-gray-100'
                          )}>
                            I = I₀ cos²(θ)
                          </div>
                          <p className="text-xs text-gray-500">
                            {isZh
                              ? '其中 θ 是光的偏振方向和偏振片透光轴的夹角'
                              : 'Where θ is the angle between the light\'s polarization and the polarizer\'s axis'}
                          </p>
                        </div>
                      )}
                      {depthLevel === 'theory' && (
                        <div className="space-y-3">
                          <p>
                            {isZh
                              ? '从电磁波理论角度，偏振描述的是电场矢量 E 的振动方向。对于平面单色波，电场可以表示为 Jones 矢量的形式。'
                              : 'From electromagnetic theory, polarization describes the oscillation direction of the electric field vector E. For plane monochromatic waves, the electric field can be represented as a Jones vector.'}
                          </p>
                          <div className={cn(
                            'p-3 rounded-lg font-mono text-sm space-y-2',
                            theme === 'dark' ? 'bg-slate-900' : 'bg-gray-100'
                          )}>
                            <div>E = [Ex, Ey]ᵀ exp(i(kz - ωt))</div>
                            <div className="text-xs opacity-70">
                              {isZh ? '线偏振: δ = 0 或 π' : 'Linear: δ = 0 or π'}
                              <br />
                              {isZh ? '圆偏振: |Ex| = |Ey|, δ = ±π/2' : 'Circular: |Ex| = |Ey|, δ = ±π/2'}
                            </div>
                          </div>
                          <Link
                            to="/calc/jones"
                            className="inline-flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400"
                          >
                            {isZh ? '试试 Jones 计算器' : 'Try the Jones Calculator'} →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 游戏挑战 */}
                  <div className={cn(
                    'p-4 rounded-xl flex items-center gap-4',
                    theme === 'dark'
                      ? 'bg-pink-500/10 border border-pink-500/20'
                      : 'bg-pink-50 border border-pink-100'
                  )}>
                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                      <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={cn(
                        'font-medium text-sm',
                        theme === 'dark' ? 'text-pink-300' : 'text-pink-700'
                      )}>
                        {isZh ? '准备好挑战了吗？' : 'Ready for a challenge?'}
                      </h4>
                      <p className={cn(
                        'text-xs',
                        theme === 'dark' ? 'text-pink-400/70' : 'text-pink-600/70'
                      )}>
                        {isZh ? '用你学到的知识来解决光学谜题' : 'Use what you learned to solve optical puzzles'}
                      </p>
                    </div>
                    <Link
                      to="/games/2d"
                      className="px-4 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition-colors"
                    >
                      {isZh ? '开始' : 'Play'}
                    </Link>
                  </div>

                  {/* 相关发现 */}
                  <RelatedDiscoveries
                    topics={DISCOVERY_TOPICS}
                    currentTopicId={selectedTopic.id}
                    onSelect={setSelectedTopicId}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
