/**
 * TimelineExploration - Dual-Track Exploration Experience
 * 双轨探索时间线：将偏振光作为主角的交互式历史叙事
 *
 * Left Track (30%): The Context Stream - General Optics history
 * Right Track (70%): The Mystery Deck - Polarization rotating cards
 *
 * Design: Cyberpunk Lab meets History Museum
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Eye, EyeOff, ChevronLeft, ChevronRight, BookOpen,
  Calendar, HelpCircle, Sparkles, Sun, Zap, ArrowRight
} from 'lucide-react'

// ============================================
// Types
// ============================================
interface TimelineEvent {
  year: number
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  scientistEn?: string
  scientistZh?: string
  category: 'discovery' | 'theory' | 'experiment' | 'application'
  importance: 1 | 2 | 3
  track: 'optics' | 'polarization'
  details?: { en: string[]; zh: string[] }
  story?: { en: string; zh: string }
  scientistBio?: {
    birthYear?: number
    deathYear?: number
    nationality?: string
    portraitEmoji?: string
    bioEn?: string
    bioZh?: string
  }
  thinkingQuestion?: { en: string; zh: string }
  linkTo?: {
    year: number
    trackTarget: 'optics' | 'polarization'
    descriptionEn: string
    descriptionZh: string
  }
}

interface TimelineExplorationProps {
  events: TimelineEvent[]
  isZh: boolean
  onReadStory?: (event: TimelineEvent) => void
}

// ============================================
// Mystery Title Generator - Creates catchy hook titles
// ============================================
const getMysteryTitle = (event: TimelineEvent, isZh: boolean): { hook: string; question: string } => {
  const mysteryMap: Record<number, { hookEn: string; hookZh: string; questionEn: string; questionZh: string }> = {
    // Polarization events mystery titles
    1669: {
      hookEn: 'The Double Vision',
      hookZh: '双影之谜',
      questionEn: 'Why does one crystal show two images?',
      questionZh: '为什么一块晶体能看到两个影像？'
    },
    1808: {
      hookEn: 'The Sunset Secret',
      hookZh: '夕阳的秘密',
      questionEn: 'What did a palace window reveal about light?',
      questionZh: '宫殿的窗户揭示了光的什么秘密？'
    },
    1809: {
      hookEn: 'The Cosine Prophecy',
      hookZh: '余弦预言',
      questionEn: 'Can mathematics predict light intensity?',
      questionZh: '数学能预测光的强度吗？'
    },
    1815: {
      hookEn: 'The Perfect Angle',
      hookZh: '完美角度',
      questionEn: 'At what angle does reflection become pure?',
      questionZh: '什么角度的反射最纯净？'
    },
    1817: {
      hookEn: 'The Sugar Mystery',
      hookZh: '糖的旋转',
      questionEn: 'Why does sugar twist light?',
      questionZh: '为什么糖溶液能旋转光？'
    },
    1828: {
      hookEn: 'The Prism Perfected',
      hookZh: '棱镜之完美',
      questionEn: 'How to create pure polarized light?',
      questionZh: '如何创造纯净的偏振光？'
    },
    1845: {
      hookEn: 'Magnetism Meets Light',
      hookZh: '磁与光的邂逅',
      questionEn: 'Can magnets twist light?',
      questionZh: '磁铁能扭转光线吗？'
    },
    1848: {
      hookEn: 'Mirror Molecules',
      hookZh: '镜像分子',
      questionEn: 'Are molecules left or right handed?',
      questionZh: '分子有左右手之分吗？'
    },
    1852: {
      hookEn: 'Light\'s DNA',
      hookZh: '光的DNA',
      questionEn: 'Can we encode light\'s state in numbers?',
      questionZh: '能用数字编码光的状态吗？'
    },
    1871: {
      hookEn: 'Why Blue Skies?',
      hookZh: '天为何蓝',
      questionEn: 'Why is scattered light polarized?',
      questionZh: '为什么散射光是偏振的？'
    },
    1892: {
      hookEn: 'The Polarization Sphere',
      hookZh: '偏振球面',
      questionEn: 'Can we visualize all polarization states?',
      questionZh: '能将所有偏振态可视化吗？'
    },
    1932: {
      hookEn: 'The Plastic Revolution',
      hookZh: '塑料革命',
      questionEn: 'Can film replace crystals?',
      questionZh: '薄膜能取代晶体吗？'
    },
    1941: {
      hookEn: 'Matrix Magic',
      hookZh: '矩阵魔法',
      questionEn: 'Can 2x2 matrices describe light?',
      questionZh: '2x2矩阵能描述光吗？'
    },
    1943: {
      hookEn: 'The Complete Picture',
      hookZh: '完整图景',
      questionEn: 'How to handle partially polarized light?',
      questionZh: '如何处理部分偏振光？'
    },
    1971: {
      hookEn: 'Screens of Light',
      hookZh: '光之屏幕',
      questionEn: 'Can polarization create displays?',
      questionZh: '偏振能创造显示屏吗？'
    },
    2008: {
      hookEn: 'Alien Vision',
      hookZh: '外星视觉',
      questionEn: 'Can animals see circular polarization?',
      questionZh: '动物能看到圆偏振吗？'
    },
    2015: {
      hookEn: 'Medical Light',
      hookZh: '医学之光',
      questionEn: 'Can light detect cancer?',
      questionZh: '光能检测癌症吗？'
    },
    2020: {
      hookEn: 'Nanoscale Control',
      hookZh: '纳米调控',
      questionEn: 'Can we control light at the nanoscale?',
      questionZh: '能在纳米尺度控制光吗？'
    },
    2023: {
      hookEn: 'Quantum Precision',
      hookZh: '量子精度',
      questionEn: 'Can quantum enhance polarimetry?',
      questionZh: '量子能增强偏振测量吗？'
    },
  }

  const mystery = mysteryMap[event.year]
  if (mystery) {
    return {
      hook: isZh ? mystery.hookZh : mystery.hookEn,
      question: isZh ? mystery.questionZh : mystery.questionEn
    }
  }

  // Default fallback for events without custom mystery
  return {
    hook: isZh ? `${event.year}年之谜` : `Mystery of ${event.year}`,
    question: event.thinkingQuestion
      ? (isZh ? event.thinkingQuestion.zh : event.thinkingQuestion.en)
      : (isZh ? '这项发现如何改变了我们对光的理解？' : 'How did this change our understanding of light?')
  }
}

// ============================================
// Mystery Flip Card Component
// ============================================
interface MysteryCardProps {
  event: TimelineEvent
  isZh: boolean
  isActive: boolean
  onReadStory?: (event: TimelineEvent) => void
}

function MysteryCard({ event, isZh, isActive, onReadStory }: MysteryCardProps) {
  const { theme } = useTheme()
  const [isFlipped, setIsFlipped] = useState(false)
  const mystery = getMysteryTitle(event, isZh)

  const categoryColors = {
    discovery: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/50', glow: 'cyan' },
    theory: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/50', glow: 'purple' },
    experiment: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/50', glow: 'green' },
    application: { bg: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/50', glow: 'orange' },
  }

  const colors = categoryColors[event.category]

  return (
    <div
      className={cn(
        'relative w-full h-[420px] cursor-pointer perspective-1000',
        isActive ? 'z-20' : 'z-10'
      )}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face - The Mystery */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden rounded-2xl overflow-hidden',
            'border-2 backdrop-blur-xl',
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95'
              : 'bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95',
            colors.border
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Glassmorphism texture overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className={cn(
              'absolute inset-0',
              theme === 'dark'
                ? 'bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_50%)]'
                : 'bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_50%)]'
            )} />
          </div>

          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-50"
            animate={isActive ? {
              boxShadow: [
                `0 0 20px rgba(34,211,238,0.3)`,
                `0 0 40px rgba(34,211,238,0.5)`,
                `0 0 20px rgba(34,211,238,0.3)`,
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="relative z-10 h-full flex flex-col p-6">
            {/* Year - The hook */}
            <motion.div
              className="text-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className={cn(
                'text-7xl font-black tracking-tighter font-mono',
                theme === 'dark'
                  ? 'text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600'
                  : 'text-transparent bg-clip-text bg-gradient-to-b from-cyan-600 to-cyan-800'
              )}>
                {event.year}
              </span>
            </motion.div>

            {/* Hook Title */}
            <motion.h3
              className={cn(
                'text-2xl font-bold text-center mb-6',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {mystery.hook}
            </motion.h3>

            {/* The Question - Center piece */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                className={cn(
                  'relative p-6 rounded-xl border',
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-cyan-500/30'
                    : 'bg-gray-100/50 border-cyan-400/30'
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <HelpCircle className={cn(
                  'absolute -top-3 -left-3 w-6 h-6',
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                )} />
                <p className={cn(
                  'text-lg text-center italic font-medium',
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  "{mystery.question}"
                </p>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-cyan-100 text-cyan-700 border border-cyan-300'
              )}>
                <Eye className="w-4 h-4" />
                {isZh ? '点击揭晓' : 'Click to Reveal'}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Back Face - The Revelation */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden rounded-2xl overflow-hidden rotate-y-180',
            'border-2 backdrop-blur-xl',
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-900/95 via-cyan-950/50 to-slate-900/95 border-cyan-400'
              : 'bg-gradient-to-br from-white/95 via-cyan-50/50 to-white/95 border-cyan-500'
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Glowing border effect */}
          <div className={cn(
            'absolute inset-0 rounded-2xl',
            theme === 'dark' ? 'shadow-[inset_0_0_30px_rgba(34,211,238,0.2)]' : 'shadow-[inset_0_0_30px_rgba(6,182,212,0.1)]'
          )} />

          <div className="relative z-10 h-full flex flex-col p-6 overflow-y-auto">
            {/* Title & Year */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                <span className={cn(
                  'text-sm font-mono',
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                )}>
                  {event.year}
                </span>
              </div>
              <h3 className={cn(
                'text-xl font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? event.titleZh : event.titleEn}
              </h3>
            </div>

            {/* Scientist */}
            {event.scientistEn && (
              <div className="flex items-center gap-2 mb-4">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-lg',
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                )}>
                  {event.scientistBio?.portraitEmoji || '👤'}
                </div>
                <span className={cn(
                  'text-sm font-medium',
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {isZh ? event.scientistZh : event.scientistEn}
                </span>
              </div>
            )}

            {/* Description */}
            <p className={cn(
              'text-sm leading-relaxed mb-4',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? event.descriptionZh : event.descriptionEn}
            </p>

            {/* Key Details */}
            {event.details && (
              <div className={cn(
                'flex-1 p-3 rounded-lg mb-4',
                theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100/50'
              )}>
                <ul className="space-y-1.5">
                  {(isZh ? event.details.zh : event.details.en).slice(0, 3).map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Zap className={cn(
                        'w-3.5 h-3.5 mt-0.5 flex-shrink-0',
                        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                      )} />
                      <span className={cn(
                        'text-xs',
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-auto pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(false)
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                )}
              >
                <EyeOff className="w-3.5 h-3.5" />
                {isZh ? '查看问题' : 'View Question'}
              </button>

              {event.story && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onReadStory?.(event)
                  }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    theme === 'dark'
                      ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                      : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                  )}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {isZh ? '阅读故事' : 'Read Story'}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================
// Context Stream Node (Left Track)
// ============================================
interface ContextNodeProps {
  event: TimelineEvent
  isZh: boolean
  isHighlighted: boolean
  isConnected: boolean
  onClick: () => void
}

function ContextNode({ event, isZh, isHighlighted, isConnected, onClick }: ContextNodeProps) {
  const { theme } = useTheme()

  return (
    <motion.div
      className={cn(
        'relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all',
        isHighlighted
          ? theme === 'dark'
            ? 'bg-amber-500/20 border border-amber-500/50'
            : 'bg-amber-100 border border-amber-400'
          : theme === 'dark'
            ? 'hover:bg-slate-800/50'
            : 'hover:bg-gray-100',
        isConnected && 'ring-2 ring-cyan-400/50'
      )}
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Year Badge */}
      <div className={cn(
        'flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2',
        isHighlighted
          ? theme === 'dark'
            ? 'bg-amber-500/30 border-amber-400 text-amber-300'
            : 'bg-amber-200 border-amber-500 text-amber-800'
          : theme === 'dark'
            ? 'bg-slate-800 border-amber-500/30 text-amber-400/70'
            : 'bg-gray-100 border-amber-300 text-amber-600'
      )}>
        {event.year}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          'text-sm font-semibold truncate',
          isHighlighted
            ? theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
            : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        )}>
          {isZh ? event.titleZh : event.titleEn}
        </h4>
        {event.scientistEn && (
          <p className={cn(
            'text-xs truncate',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          )}>
            {isZh ? event.scientistZh : event.scientistEn}
          </p>
        )}
      </div>

      {/* Connection indicator */}
      {isConnected && (
        <motion.div
          className="absolute -right-2 top-1/2 -translate-y-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <ArrowRight className={cn(
            'w-4 h-4',
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          )} />
        </motion.div>
      )}
    </motion.div>
  )
}

// ============================================
// Connection Line SVG
// ============================================
interface ConnectionLineProps {
  startX: number
  startY: number
  endX: number
  endY: number
  isActive: boolean
}

function ConnectionLine({ startX, startY, endX, endY, isActive }: ConnectionLineProps) {
  const { theme } = useTheme()

  // Calculate control points for bezier curve
  const midX = (startX + endX) / 2
  const controlX1 = startX + (midX - startX) * 0.5
  const controlX2 = endX - (endX - midX) * 0.5

  const pathD = `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ zIndex: 5 }}
    >
      <defs>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={theme === 'dark' ? '#f59e0b' : '#d97706'} />
          <stop offset="50%" stopColor={theme === 'dark' ? '#8b5cf6' : '#7c3aed'} />
          <stop offset="100%" stopColor={theme === 'dark' ? '#22d3ee' : '#06b6d4'} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <AnimatePresence>
        {isActive && (
          <>
            {/* Glow effect */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="url(#connectionGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
            {/* Main line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 1,
                strokeDashoffset: [0, -24]
              }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{
                pathLength: { duration: 0.5 },
                opacity: { duration: 0.3 },
                strokeDashoffset: { duration: 1, repeat: Infinity, ease: 'linear' }
              }}
            />
          </>
        )}
      </AnimatePresence>
    </svg>
  )
}

// ============================================
// Main TimelineExploration Component
// ============================================
export function TimelineExploration({ events, isZh, onReadStory }: TimelineExplorationProps) {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const leftTrackRef = useRef<HTMLDivElement>(null)
  const rightTrackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const nodeRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  // Filter events by track
  const opticsEvents = useMemo(() =>
    events.filter(e => e.track === 'optics').sort((a, b) => a.year - b.year),
    [events]
  )
  const polarizationEvents = useMemo(() =>
    events.filter(e => e.track === 'polarization').sort((a, b) => a.year - b.year),
    [events]
  )

  // Active card state
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [connectionCoords, setConnectionCoords] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null)

  const activeCard = polarizationEvents[activeCardIndex]

  // Find the closest optics event to the active polarization event
  const connectedOpticsEvent = useMemo(() => {
    if (!activeCard) return null

    // Find optics events that are close in time (within 15 years)
    const nearby = opticsEvents.filter(e => Math.abs(e.year - activeCard.year) <= 15)
    if (nearby.length === 0) {
      // Find the closest one
      return opticsEvents.reduce((closest, e) =>
        Math.abs(e.year - activeCard.year) < Math.abs(closest.year - activeCard.year) ? e : closest
      , opticsEvents[0])
    }
    // Return the closest one
    return nearby.reduce((closest, e) =>
      Math.abs(e.year - activeCard.year) < Math.abs(closest.year - activeCard.year) ? e : closest
    , nearby[0])
  }, [activeCard, opticsEvents])

  // Scroll sync and connection line update
  useEffect(() => {
    if (!connectedOpticsEvent || !containerRef.current) return

    const nodeEl = nodeRefs.current.get(connectedOpticsEvent.year)
    const cardEl = cardRefs.current.get(activeCard?.year || 0)

    if (nodeEl && cardEl) {
      // Scroll the left track to show the connected node
      nodeEl.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // Calculate connection line coordinates
      const containerRect = containerRef.current.getBoundingClientRect()
      const nodeRect = nodeEl.getBoundingClientRect()
      const cardRect = cardEl.getBoundingClientRect()

      setConnectionCoords({
        startX: nodeRect.right - containerRect.left,
        startY: nodeRect.top + nodeRect.height / 2 - containerRect.top,
        endX: cardRect.left - containerRect.left,
        endY: cardRect.top + cardRect.height / 2 - containerRect.top,
      })
    }
  }, [activeCardIndex, connectedOpticsEvent, activeCard])

  // Intersection Observer for active card detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const year = parseInt(entry.target.getAttribute('data-year') || '0')
            const index = polarizationEvents.findIndex(e => e.year === year)
            if (index !== -1 && index !== activeCardIndex) {
              setActiveCardIndex(index)
            }
          }
        })
      },
      {
        root: rightTrackRef.current,
        threshold: 0.5,
        rootMargin: '-40% 0px -40% 0px'
      }
    )

    cardRefs.current.forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [polarizationEvents, activeCardIndex])

  // Navigation handlers
  const handlePrevCard = useCallback(() => {
    if (activeCardIndex > 0) {
      setActiveCardIndex(activeCardIndex - 1)
      const prevYear = polarizationEvents[activeCardIndex - 1]?.year
      const el = cardRefs.current.get(prevYear)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeCardIndex, polarizationEvents])

  const handleNextCard = useCallback(() => {
    if (activeCardIndex < polarizationEvents.length - 1) {
      setActiveCardIndex(activeCardIndex + 1)
      const nextYear = polarizationEvents[activeCardIndex + 1]?.year
      const el = cardRefs.current.get(nextYear)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeCardIndex, polarizationEvents])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative rounded-2xl border overflow-hidden',
        theme === 'dark'
          ? 'bg-slate-900/50 border-slate-700'
          : 'bg-white/50 border-gray-200'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between px-6 py-4 border-b',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-4">
          <h3 className={cn(
            'text-lg font-bold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '双轨探索' : 'Dual-Track Exploration'}
          </h3>
          <div className="flex items-center gap-3 text-sm">
            <span className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-full',
              theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
            )}>
              <Sun className="w-3.5 h-3.5" />
              {isZh ? '背景' : 'Context'}
            </span>
            <span className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-full',
              theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
            )}>
              <Sparkles className="w-3.5 h-3.5" />
              {isZh ? '偏振之旅' : 'Polarization Journey'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevCard}
            disabled={activeCardIndex === 0}
            className={cn(
              'p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
              theme === 'dark'
                ? 'hover:bg-slate-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className={cn(
            'text-sm font-mono px-2',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {activeCardIndex + 1} / {polarizationEvents.length}
          </span>
          <button
            onClick={handleNextCard}
            disabled={activeCardIndex === polarizationEvents.length - 1}
            className={cn(
              'p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
              theme === 'dark'
                ? 'hover:bg-slate-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[600px] relative">
        {/* Connection Line */}
        {connectionCoords && (
          <ConnectionLine
            startX={connectionCoords.startX}
            startY={connectionCoords.startY}
            endX={connectionCoords.endX}
            endY={connectionCoords.endY}
            isActive={true}
          />
        )}

        {/* Left Track - Context Stream (30%) */}
        <div
          ref={leftTrackRef}
          className={cn(
            'w-[30%] border-r overflow-y-auto custom-scrollbar p-4',
            theme === 'dark' ? 'border-slate-700 bg-slate-900/30' : 'border-gray-200 bg-gray-50/30'
          )}
        >
          <div className="mb-4">
            <h4 className={cn(
              'text-sm font-semibold flex items-center gap-2',
              theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
            )}>
              <Sun className="w-4 h-4" />
              {isZh ? '光学发展脉络' : 'Optics Context'}
            </h4>
            <p className={cn(
              'text-xs mt-1',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            )}>
              {isZh ? '同时期的重要光学发现' : 'Contemporary optics discoveries'}
            </p>
          </div>

          {/* Timeline Line */}
          <div className="relative">
            <div className={cn(
              'absolute left-7 top-0 bottom-0 w-0.5',
              theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-200'
            )} />

            <div className="space-y-3">
              {opticsEvents.map((event) => (
                <div
                  key={event.year}
                  ref={(el) => { if (el) nodeRefs.current.set(event.year, el) }}
                >
                  <ContextNode
                    event={event}
                    isZh={isZh}
                    isHighlighted={connectedOpticsEvent?.year === event.year}
                    isConnected={connectedOpticsEvent?.year === event.year}
                    onClick={() => {
                      // Find and scroll to nearest polarization event
                      const nearest = polarizationEvents.reduce((closest, e, idx) =>
                        Math.abs(e.year - event.year) < Math.abs(polarizationEvents[closest].year - event.year)
                          ? idx
                          : closest
                      , 0)
                      setActiveCardIndex(nearest)
                      const el = cardRefs.current.get(polarizationEvents[nearest].year)
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Track - Mystery Deck (70%) */}
        <div
          ref={rightTrackRef}
          className={cn(
            'w-[70%] overflow-y-auto custom-scrollbar p-6 snap-y snap-mandatory',
            theme === 'dark' ? 'bg-gradient-to-b from-slate-900/50 to-slate-800/50' : 'bg-gradient-to-b from-white/50 to-gray-50/50'
          )}
        >
          <div className="mb-6">
            <h4 className={cn(
              'text-sm font-semibold flex items-center gap-2',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
            )}>
              <Sparkles className="w-4 h-4" />
              {isZh ? '偏振光之谜' : 'Polarization Mysteries'}
            </h4>
            <p className={cn(
              'text-xs mt-1',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            )}>
              {isZh ? '点击卡片揭晓历史发现' : 'Click cards to reveal historical discoveries'}
            </p>
          </div>

          <div className="space-y-8">
            {polarizationEvents.map((event, index) => (
              <div
                key={event.year}
                data-year={event.year}
                ref={(el) => { if (el) cardRefs.current.set(event.year, el) }}
                className="snap-center"
              >
                <MysteryCard
                  event={event}
                  isZh={isZh}
                  isActive={index === activeCardIndex}
                  onReadStory={onReadStory}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with current context */}
      <div className={cn(
        'px-6 py-3 border-t flex items-center justify-between',
        theme === 'dark' ? 'border-slate-700 bg-slate-900/50' : 'border-gray-200 bg-gray-50/50'
      )}>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className={cn('w-4 h-4', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {isZh ? '当前：' : 'Current: '}
          </span>
          <span className={cn(
            'font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {activeCard?.year} - {isZh ? activeCard?.titleZh : activeCard?.titleEn}
          </span>
        </div>

        {connectedOpticsEvent && (
          <div className="flex items-center gap-2 text-sm">
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
              {isZh ? '相关背景：' : 'Related: '}
            </span>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs',
              theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
            )}>
              {connectedOpticsEvent.year} - {isZh ? connectedOpticsEvent.titleZh : connectedOpticsEvent.titleEn}
            </span>
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(100, 116, 139, 0.5)' : 'rgba(156, 163, 175, 0.5)'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'rgba(100, 116, 139, 0.7)' : 'rgba(156, 163, 175, 0.7)'};
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}

export default TimelineExploration
