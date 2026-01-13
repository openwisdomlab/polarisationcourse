/**
 * MicroLearningCard - 微学习卡片
 *
 * 设计理念：
 * - 每张卡片只传达一个核心概念
 * - 渐进式深度 - 标题 → 简述 → 深入
 * - 动手优先 - 鼓励互动而非被动阅读
 * - 连接性 - 引导到相关内容
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Play,
  Lightbulb,
  BookOpen,
  FlaskConical,
  Gamepad2,
  Eye
} from 'lucide-react'

export type CardType = 'concept' | 'vocabulary' | 'formula' | 'experiment' | 'application' | 'fun-fact'

export interface MicroLearningContent {
  id: string
  type: CardType
  title: { en: string; zh: string }
  // 一句话核心（总是显示）
  oneLiner: { en: string; zh: string }
  // 简单解释（展开后显示）
  simpleExplanation?: { en: string; zh: string }
  // 公式（仅公式卡和深度模式）
  formula?: {
    latex: string
    description: { en: string; zh: string }
  }
  // 深入内容（深度模式）
  deepDive?: { en: string; zh: string }
  // 动手建议
  tryThis?: { en: string; zh: string }
  // 相关链接
  relatedDemo?: string
  relatedGame?: string
  relatedCalculator?: string
  // 视觉元素
  emoji?: string
  color?: string
}

// 卡片类型配置
const CARD_TYPE_CONFIG: Record<CardType, {
  icon: React.ReactNode
  defaultColor: string
  labelEn: string
  labelZh: string
}> = {
  concept: {
    icon: <Lightbulb className="w-4 h-4" />,
    defaultColor: '#22d3ee',
    labelEn: 'Key Concept',
    labelZh: '核心概念'
  },
  vocabulary: {
    icon: <BookOpen className="w-4 h-4" />,
    defaultColor: '#a78bfa',
    labelEn: 'Vocabulary',
    labelZh: '术语'
  },
  formula: {
    icon: <span className="text-xs font-bold">f(x)</span>,
    defaultColor: '#f59e0b',
    labelEn: 'Formula',
    labelZh: '公式'
  },
  experiment: {
    icon: <FlaskConical className="w-4 h-4" />,
    defaultColor: '#10b981',
    labelEn: 'Experiment',
    labelZh: '实验'
  },
  application: {
    icon: <Eye className="w-4 h-4" />,
    defaultColor: '#ec4899',
    labelEn: 'Application',
    labelZh: '应用'
  },
  'fun-fact': {
    icon: <span className="text-sm">✨</span>,
    defaultColor: '#6366f1',
    labelEn: 'Fun Fact',
    labelZh: '趣味知识'
  }
}

interface MicroLearningCardProps {
  content: MicroLearningContent
  depthLevel?: 'simple' | 'formulas' | 'theory'
  defaultExpanded?: boolean
  onTryDemo?: () => void
}

export function MicroLearningCard({
  content,
  depthLevel = 'simple',
  defaultExpanded = false,
  onTryDemo
}: MicroLearningCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const config = CARD_TYPE_CONFIG[content.type]
  const color = content.color || config.defaultColor

  const shouldShowFormula = content.formula && depthLevel !== 'simple'
  const shouldShowDeepDive = content.deepDive && depthLevel === 'theory'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border overflow-hidden transition-shadow',
        isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md',
        theme === 'dark'
          ? 'bg-slate-800/80 border-slate-700'
          : 'bg-white border-gray-200'
      )}
    >
      {/* 卡片头部 - 总是可见 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="p-4 flex items-start gap-3">
          {/* 类型图标 */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
            style={{ backgroundColor: color }}
          >
            {content.emoji || config.icon}
          </div>

          <div className="flex-1 min-w-0">
            {/* 类型标签 */}
            <span
              className="text-[10px] font-medium uppercase tracking-wider"
              style={{ color }}
            >
              {isZh ? config.labelZh : config.labelEn}
            </span>

            {/* 标题 */}
            <h3 className={cn(
              'font-semibold text-sm mt-0.5 mb-1',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? content.title.zh : content.title.en}
            </h3>

            {/* 一句话核心 */}
            <p className={cn(
              'text-sm leading-relaxed',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? content.oneLiner.zh : content.oneLiner.en}
            </p>
          </div>

          {/* 展开/收起指示器 */}
          <div className={cn(
            'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors',
            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
          )}>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" style={{ color }} />
            ) : (
              <ChevronDown className="w-4 h-4" style={{ color }} />
            )}
          </div>
        </div>
      </button>

      {/* 展开内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={cn(
              'px-4 pb-4 space-y-4',
              theme === 'dark' ? 'border-t border-slate-700' : 'border-t border-gray-100'
            )}>
              {/* 简单解释 */}
              {content.simpleExplanation && (
                <div className="pt-4">
                  <p className={cn(
                    'text-sm leading-relaxed',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    {isZh ? content.simpleExplanation.zh : content.simpleExplanation.en}
                  </p>
                </div>
              )}

              {/* 公式 */}
              {shouldShowFormula && content.formula && (
                <div className={cn(
                  'p-3 rounded-lg',
                  theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
                )}>
                  <div className="font-mono text-center text-lg mb-2" style={{ color }}>
                    {content.formula.latex}
                  </div>
                  <p className={cn(
                    'text-xs text-center',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  )}>
                    {isZh ? content.formula.description.zh : content.formula.description.en}
                  </p>
                </div>
              )}

              {/* 深入内容 */}
              {shouldShowDeepDive && content.deepDive && (
                <div className={cn(
                  'p-3 rounded-lg border-l-2',
                  theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'
                )} style={{ borderColor: color }}>
                  <p className={cn(
                    'text-xs leading-relaxed',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {isZh ? content.deepDive.zh : content.deepDive.en}
                  </p>
                </div>
              )}

              {/* 动手试试 */}
              {content.tryThis && (
                <div className={cn(
                  'p-3 rounded-lg flex items-start gap-2',
                  theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
                )}>
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                  )}>
                    {isZh ? content.tryThis.zh : content.tryThis.en}
                  </p>
                </div>
              )}

              {/* 相关链接 */}
              <div className="flex flex-wrap gap-2 pt-2">
                {content.relatedDemo && (
                  <Link
                    to={`/demos/${content.relatedDemo}`}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      theme === 'dark'
                        ? 'bg-slate-700 text-cyan-400 hover:bg-slate-600'
                        : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                    )}
                  >
                    <Play className="w-3 h-3" />
                    {isZh ? '互动演示' : 'Demo'}
                  </Link>
                )}
                {content.relatedGame && (
                  <Link
                    to={content.relatedGame}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      theme === 'dark'
                        ? 'bg-slate-700 text-pink-400 hover:bg-slate-600'
                        : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                    )}
                  >
                    <Gamepad2 className="w-3 h-3" />
                    {isZh ? '游戏挑战' : 'Game'}
                  </Link>
                )}
                {content.relatedCalculator && (
                  <Link
                    to={content.relatedCalculator}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      theme === 'dark'
                        ? 'bg-slate-700 text-purple-400 hover:bg-slate-600'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    )}
                  >
                    <span className="text-xs">f(x)</span>
                    {isZh ? '计算器' : 'Calculator'}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// 预定义的微学习内容
export const MICRO_LEARNING_CARDS: MicroLearningContent[] = [
  {
    id: 'what-is-polarization',
    type: 'concept',
    title: {
      en: 'What is Polarization?',
      zh: '什么是偏振？'
    },
    oneLiner: {
      en: 'Light waves vibrating in a single direction instead of all directions.',
      zh: '光波只在一个方向振动，而不是所有方向。'
    },
    simpleExplanation: {
      en: 'Imagine shaking a rope. You can shake it up and down, left and right, or any direction. Ordinary light is like shaking in all directions at once. Polarized light is like shaking in just one direction.',
      zh: '想象抖动一根绳子。你可以上下抖、左右抖或任何方向。普通光就像同时向所有方向抖。偏振光就像只向一个方向抖。'
    },
    tryThis: {
      en: 'Try rotating polarized sunglasses while looking at your phone screen!',
      zh: '试试戴着偏振太阳镜旋转着看手机屏幕！'
    },
    relatedDemo: 'polarization-intro',
    emoji: '〰️'
  },
  {
    id: 'malus-law',
    type: 'formula',
    title: {
      en: "Malus's Law",
      zh: '马吕斯定律'
    },
    oneLiner: {
      en: 'The intensity of light through a polarizer depends on the angle.',
      zh: '通过偏振片的光强度取决于角度。'
    },
    simpleExplanation: {
      en: "When polarized light hits a polarizer at an angle, some light gets blocked. The more tilted, the less light passes through. At 90°, no light passes at all!",
      zh: '当偏振光以一定角度照射偏振片时，部分光被阻挡。倾斜越大，通过的光越少。在90°时，完全没有光通过！'
    },
    formula: {
      latex: 'I = I₀ cos²(θ)',
      description: {
        en: 'I = transmitted intensity, I₀ = initial intensity, θ = angle between polarization and filter',
        zh: 'I = 透射强度，I₀ = 初始强度，θ = 偏振方向与滤光片的夹角'
      }
    },
    deepDive: {
      en: 'This law was discovered by Étienne-Louis Malus in 1809 when he observed light reflected from a window through a calcite crystal. The cos² dependence comes from projecting the electric field vector onto the transmission axis.',
      zh: '这个定律是马吕斯在1809年通过方解石晶体观察窗户反射光时发现的。cos²的关系来自将电场矢量投影到透光轴上。'
    },
    relatedDemo: 'malus',
    relatedCalculator: '/calc/jones',
    color: '#f59e0b'
  },
  {
    id: 'birefringence',
    type: 'vocabulary',
    title: {
      en: 'Birefringence',
      zh: '双折射'
    },
    oneLiner: {
      en: 'A crystal that splits light into two beams with different polarizations.',
      zh: '一种将光分成两束不同偏振光的晶体。'
    },
    simpleExplanation: {
      en: 'Some crystals, like calcite, have different "speeds" for light vibrating in different directions. This causes one ray to bend more than the other, creating two images!',
      zh: '某些晶体（如方解石）对不同方向振动的光有不同的"速度"。这导致一束光比另一束弯曲更多，产生两个像！'
    },
    tryThis: {
      en: 'Put a clear calcite crystal over text - you\'ll see double!',
      zh: '把透明方解石放在文字上——你会看到双影！'
    },
    relatedDemo: 'birefringence',
    emoji: '💎'
  },
  {
    id: 'rayleigh-scattering',
    type: 'concept',
    title: {
      en: 'Why is the sky blue?',
      zh: '天空为什么是蓝色的？'
    },
    oneLiner: {
      en: 'Small molecules scatter blue light more than red light.',
      zh: '小分子散射蓝光比红光更多。'
    },
    simpleExplanation: {
      en: 'Air molecules are much smaller than light wavelengths. They bounce short (blue) waves more than long (red) waves. That\'s why we see blue sky overhead and red sunsets when light travels through more atmosphere.',
      zh: '空气分子比光波长小得多。它们弹射短波（蓝色）比长波（红色）更多。这就是我们在头顶看到蓝天，在光穿过更多大气时看到红色日落的原因。'
    },
    formula: {
      latex: 'I ∝ 1/λ⁴',
      description: {
        en: 'Scattering intensity is inversely proportional to the 4th power of wavelength',
        zh: '散射强度与波长的四次方成反比'
      }
    },
    relatedDemo: 'rayleigh',
    color: '#3b82f6'
  },
  {
    id: 'lcd-polarization',
    type: 'application',
    title: {
      en: 'LCD Screens',
      zh: '液晶显示屏'
    },
    oneLiner: {
      en: 'Your phone screen uses polarizers to control what you see.',
      zh: '你的手机屏幕使用偏振片来控制显示内容。'
    },
    simpleExplanation: {
      en: 'LCD screens have two polarizers at 90° to each other (normally blocking all light). Liquid crystals between them twist the light\'s polarization, letting it through. Electrically controlled pixels decide which areas are bright or dark.',
      zh: '液晶屏有两个互成90°的偏振片（通常阻挡所有光）。它们之间的液晶会扭转光的偏振，让光通过。电控像素决定哪些区域明亮或黑暗。'
    },
    tryThis: {
      en: 'Look at an LCD through polarized sunglasses and rotate them - the screen will appear to turn on and off!',
      zh: '透过偏振太阳镜看液晶屏并旋转眼镜——屏幕会看起来忽明忽暗！'
    },
    relatedDemo: 'polarization-types-unified',
    emoji: '📱'
  }
]

// 卡片组组件
export function MicroLearningCardStack({
  cards,
  depthLevel = 'simple',
  maxVisible = 3
}: {
  cards: MicroLearningContent[]
  depthLevel?: 'simple' | 'formulas' | 'theory'
  maxVisible?: number
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [showAll, setShowAll] = useState(false)

  const visibleCards = showAll ? cards : cards.slice(0, maxVisible)
  const hasMore = cards.length > maxVisible

  return (
    <div className="space-y-3">
      {visibleCards.map(card => (
        <MicroLearningCard
          key={card.id}
          content={card}
          depthLevel={depthLevel}
        />
      ))}

      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className={cn(
            'w-full py-3 rounded-xl border-2 border-dashed text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'border-slate-700 text-gray-400 hover:border-slate-600 hover:text-gray-300'
              : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
          )}
        >
          {isZh
            ? `显示更多 (${cards.length - maxVisible})`
            : `Show more (${cards.length - maxVisible})`}
        </button>
      )}
    </div>
  )
}

export default MicroLearningCard
