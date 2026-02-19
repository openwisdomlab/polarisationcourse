/**
 * InquiryPanel - 探究式学习面板
 *
 * Glass morphism面板，POR三阶段可视化
 * - 预测(predict): 问题 + 选项按钮
 * - 观察(observe): 引导操作提示
 * - 反思(reflect): 揭示原理 + 公式
 *
 * 旅程指示: 水平圆点（完成=实色, 当前=呼吸glow, 未来=暗淡）
 * 收起态: 单行 "x/y 已探索 — 继续引导？"
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { useInquiry } from './useInquiry'
import { useInquiryStore } from '@/stores/inquiryStore'
import { CelebrationOverlay } from './CelebrationOverlay'
import { ChevronRight, Compass, Sparkles } from 'lucide-react'

interface InquiryPanelProps {
  position?: 'top' | 'bottom'
  className?: string
}

// MathText简易渲染 (处理简单公式字符串)
function FormulaDisplay({ formula }: { formula: string }) {
  const { theme } = useTheme()
  return (
    <div
      className={cn(
        'font-mono text-base px-4 py-2 rounded-lg mt-2',
        theme === 'dark'
          ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20'
          : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
      )}
    >
      {formula}
    </div>
  )
}

export function InquiryPanel({ position = 'top', className }: InquiryPanelProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const {
    session,
    activePoints,
    completedCount,
    totalCount,
    isGuidedMode,
    currentPhase,
  } = useInquiry()

  const makePrediction = useInquiryStore((s) => s.makePrediction)
  const advancePhase = useInquiryStore((s) => s.advancePhase)
  const skipToFreeExploration = useInquiryStore((s) => s.skipToFreeExploration)
  const startSession = useInquiryStore((s) => s.startSession)
  const dismissCelebration = useInquiryStore((s) => s.dismissCelebration)

  const lang = i18n.language?.startsWith('zh') ? 'zh' : 'en'

  if (!session || activePoints.length === 0) return null

  const currentPoint = activePoints[session.currentPointIndex]
  if (!currentPoint && isGuidedMode) return null

  // 非引导模式的收起态
  if (!isGuidedMode) {
    const hasMore = completedCount < totalCount
    if (!hasMore) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-xl px-4 py-2.5 flex items-center justify-between',
          'backdrop-blur-xl border',
          theme === 'dark'
            ? 'bg-slate-900/40 border-white/8'
            : 'bg-white/70 border-black/6',
          position === 'bottom' ? 'mt-3' : 'mb-3',
          className
        )}
      >
        <span
          className={cn(
            'text-sm',
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          )}
        >
          {completedCount}/{totalCount}{' '}
          {lang === 'zh' ? '已探索' : 'explored'}
          {' — '}
          <button
            onClick={() =>
              startSession(
                session.demoId,
                activePoints,
                'application',
                true
              )
            }
            className={cn(
              'underline underline-offset-2 hover:no-underline',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )}
          >
            {lang === 'zh' ? '继续引导？' : 'Resume guided?'}
          </button>
        </span>
      </motion.div>
    )
  }

  return (
    <div className={cn(position === 'bottom' ? 'mt-3' : 'mb-3', className)}>
      <motion.div
        layout
        className={cn(
          'rounded-2xl p-5 border relative overflow-hidden',
          'backdrop-blur-xl',
          theme === 'dark'
            ? 'bg-slate-900/40 border-white/8 shadow-lg shadow-black/20'
            : 'bg-white/70 border-black/6 shadow-lg shadow-black/5'
        )}
      >
        {/* 庆祝动画层 */}
        <CelebrationOverlay
          show={session.showCelebration}
          onDismiss={dismissCelebration}
        />

        {/* 旅程指示器 */}
        <div className="flex items-center gap-1.5 mb-4">
          {activePoints.map((point, i) => {
            const isCompleted = session.completedPoints.includes(point.id)
            const isCurrent = i === session.currentPointIndex
            return (
              <motion.div
                key={point.id}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  isCompleted
                    ? theme === 'dark'
                      ? 'bg-emerald-400'
                      : 'bg-emerald-500'
                    : isCurrent
                      ? theme === 'dark'
                        ? 'bg-cyan-400'
                        : 'bg-cyan-500'
                      : theme === 'dark'
                        ? 'bg-slate-600'
                        : 'bg-slate-300'
                )}
                animate={
                  isCurrent
                    ? {
                        boxShadow: [
                          '0 0 0 0 rgba(34,211,238,0.4)',
                          '0 0 8px 2px rgba(34,211,238,0.2)',
                          '0 0 0 0 rgba(34,211,238,0.4)',
                        ],
                      }
                    : {}
                }
                transition={
                  isCurrent ? { repeat: Infinity, duration: 2 } : {}
                }
              />
            )
          })}
          <div className="flex-1" />
          <button
            onClick={skipToFreeExploration}
            className={cn(
              'text-xs px-2 py-0.5 rounded-md transition-colors',
              theme === 'dark'
                ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            )}
          >
            {lang === 'zh' ? '自由探索' : 'Free explore'}
          </button>
        </div>

        {/* POR阶段内容 */}
        <AnimatePresence mode="wait">
          {currentPhase === 'predict' && currentPoint && (
            <PredictPhase
              key={`predict-${currentPoint.id}`}
              point={currentPoint}
              lang={lang}
              theme={theme}
              onPredict={(id) => makePrediction(id, activePoints)}
            />
          )}
          {currentPhase === 'observe' && currentPoint && (
            <ObservePhase
              key={`observe-${currentPoint.id}`}
              lang={lang}
              theme={theme}
              wasCorrect={session.predictionCorrect}
              onAdvance={() => advancePhase(activePoints)}
            />
          )}
          {currentPhase === 'reflect' && currentPoint && (
            <ReflectPhase
              key={`reflect-${currentPoint.id}`}
              point={currentPoint}
              lang={lang}
              theme={theme}
              onAdvance={() => advancePhase(activePoints)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ============================================
// 阶段子组件
// ============================================

const phaseVariants = {
  initial: { opacity: 0, x: 20, filter: 'blur(4px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, x: -20, filter: 'blur(4px)' },
}

function PredictPhase({
  point,
  lang,
  theme,
  onPredict,
}: {
  point: ReturnType<typeof useInquiry>['activePoints'][0]
  lang: 'zh' | 'en'
  theme: string
  onPredict: (id: string) => void
}) {
  return (
    <motion.div
      variants={phaseVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {/* 阶段标签 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🟡</span>
        <span
          className={cn(
            'text-xs font-medium uppercase tracking-wider',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          )}
        >
          {lang === 'zh' ? '预测' : 'Predict'}
        </span>
      </div>

      {/* 问题 */}
      <p
        className={cn(
          'font-serif text-lg leading-relaxed mb-4',
          theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
        )}
      >
        {point.question[lang]}
      </p>

      {/* 预测选项 */}
      {point.predictions && (
        <div className="flex flex-wrap gap-2">
          {point.predictions.map((pred) => (
            <motion.button
              key={pred.id}
              onClick={() => onPredict(pred.id)}
              className={cn(
                'rounded-xl px-5 py-3 text-sm font-medium',
                'border transition-colors',
                theme === 'dark'
                  ? 'bg-slate-800/60 border-slate-600/50 text-slate-200 hover:bg-slate-700/80 hover:border-cyan-400/40'
                  : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-cyan-50 hover:border-cyan-300'
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {pred.label[lang]}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function ObservePhase({
  lang,
  theme,
  wasCorrect,
  onAdvance,
}: {
  lang: 'zh' | 'en'
  theme: string
  wasCorrect: boolean | null
  onAdvance: () => void
}) {
  return (
    <motion.div
      variants={phaseVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔵</span>
        <span
          className={cn(
            'text-xs font-medium uppercase tracking-wider',
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          )}
        >
          {lang === 'zh' ? '观察' : 'Observe'}
        </span>
      </div>

      {/* 预测结果反馈 */}
      {wasCorrect !== null && (
        <div
          className={cn(
            'text-sm mb-2 flex items-center gap-1.5',
            wasCorrect
              ? theme === 'dark'
                ? 'text-emerald-400'
                : 'text-emerald-600'
              : theme === 'dark'
                ? 'text-amber-400'
                : 'text-amber-600'
          )}
        >
          {wasCorrect ? (
            <>
              <Sparkles className="w-4 h-4" />
              {lang === 'zh' ? '预测正确！' : 'Correct prediction!'}
            </>
          ) : (
            <>
              <Compass className="w-4 h-4" />
              {lang === 'zh' ? '让我们来验证...' : "Let's verify..."}
            </>
          )}
        </div>
      )}

      <p
        className={cn(
          'font-serif text-lg leading-relaxed mb-4',
          theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
        )}
      >
        {lang === 'zh'
          ? '现在试试！操作控件观察结果。'
          : 'Now try it! Use the controls to observe.'}
      </p>

      <motion.button
        onClick={onAdvance}
        className={cn(
          'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium',
          'border transition-colors',
          theme === 'dark'
            ? 'bg-blue-500/15 border-blue-400/30 text-blue-300 hover:bg-blue-500/25'
            : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {lang === 'zh' ? '我观察到了' : "I've observed it"}
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}

function ReflectPhase({
  point,
  lang,
  theme,
  onAdvance,
}: {
  point: ReturnType<typeof useInquiry>['activePoints'][0]
  lang: 'zh' | 'en'
  theme: string
  onAdvance: () => void
}) {
  return (
    <motion.div
      variants={phaseVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🟣</span>
        <span
          className={cn(
            'text-xs font-medium uppercase tracking-wider',
            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
          )}
        >
          {lang === 'zh' ? '反思' : 'Reflect'}
        </span>
      </div>

      {/* 反思内容 */}
      {point.reflection && (
        <p
          className={cn(
            'font-serif text-lg leading-relaxed mb-3',
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          )}
        >
          {point.reflection[lang]}
        </p>
      )}

      {/* 揭示公式 */}
      {point.formula && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FormulaDisplay formula={point.formula} />
        </motion.div>
      )}

      <motion.button
        onClick={onAdvance}
        className={cn(
          'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium mt-4',
          'border transition-colors',
          theme === 'dark'
            ? 'bg-purple-500/15 border-purple-400/30 text-purple-300 hover:bg-purple-500/25'
            : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {lang === 'zh' ? '继续' : 'Continue'}
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}
