/**
 * TheoryBlock - 渐进式理论展示组件
 * 默认显示核心洞察，逐层点击展开更深层理论
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TheoryBlockProps {
  theory: {
    formula: string
    foundationText: string
    applicationText: string
    researchText: string
    keyInsight: string
    realWorldExample: string
  }
  color: string
}

export function TheoryBlock({ theory, color }: TheoryBlockProps) {
  // 0 = just insight, 1 = foundation, 2 = application, 3 = research
  const [revealLevel, setRevealLevel] = useState<0 | 1 | 2 | 3>(0)

  const goDeeper = () => {
    if (revealLevel < 3) {
      setRevealLevel((revealLevel + 1) as 1 | 2 | 3)
    }
  }

  return (
    <div className="space-y-4">
      {/* Key Insight — always visible */}
      <div
        className="rounded-lg p-4"
        style={{
          borderLeft: `2px solid ${color}`,
          backgroundColor: `${color}08`,
        }}
      >
        <p className="text-sm italic" style={{ color: color, opacity: 0.8 }}>
          <span className="mr-2">&#9889;</span>
          {theory.keyInsight}
        </p>
      </div>

      {/* "Go deeper" button — visible when level < 1 */}
      {revealLevel < 1 && (
        <button
          onClick={goDeeper}
          className="text-xs font-mono transition-colors"
          style={{ color: `${color}44` }}
          onMouseEnter={(e) => (e.currentTarget.style.color = color)}
          onMouseLeave={(e) => (e.currentTarget.style.color = `${color}44`)}
        >
          Go deeper &rarr;
        </button>
      )}

      {/* Foundation text — expands on first click */}
      <AnimatePresence>
        {revealLevel >= 1 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="text-[15px] font-light leading-relaxed text-white/70">
              {theory.foundationText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Go deeper" button — visible when level == 1 */}
      {revealLevel === 1 && (
        <button
          onClick={goDeeper}
          className="text-xs font-mono transition-colors"
          style={{ color: `${color}44` }}
          onMouseEnter={(e) => (e.currentTarget.style.color = color)}
          onMouseLeave={(e) => (e.currentTarget.style.color = `${color}44`)}
        >
          Go deeper &rarr;
        </button>
      )}

      {/* Application text — expands on second click */}
      <AnimatePresence>
        {revealLevel >= 2 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="text-[15px] font-light leading-relaxed text-white/60">
              {theory.applicationText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Research level" button — visible when level == 2 */}
      {revealLevel === 2 && (
        <button
          onClick={goDeeper}
          className="text-xs font-mono transition-colors"
          style={{ color: `${color}44` }}
          onMouseEnter={(e) => (e.currentTarget.style.color = color)}
          onMouseLeave={(e) => (e.currentTarget.style.color = `${color}44`)}
        >
          Research level &rarr;
        </button>
      )}

      {/* Research text — expands on third click */}
      <AnimatePresence>
        {revealLevel >= 3 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="font-mono text-sm text-white/50">
              {theory.researchText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real World Example — collapsible details, always at bottom */}
      <details className="group">
        <summary className="text-xs text-white/40 cursor-pointer select-none hover:text-white/60 transition-colors">
          Real-world example
        </summary>
        <div className="pl-4 mt-2 border-l border-white/10">
          <p className="text-sm text-white/50 leading-relaxed">
            {theory.realWorldExample}
          </p>
        </div>
      </details>
    </div>
  )
}
