/**
 * PolarizationWave Component
 * Extracted from HomePage for better organization
 */

import { motion } from 'framer-motion'


function PolarizationWave({ theme }: { theme: 'dark' | 'light' }) {
  const exColor = theme === 'dark' ? '#22d3ee' : '#0891b2' // 水平分量 Ex (cyan)
  const eyColor = theme === 'dark' ? '#a855f7' : '#7c3aed' // 垂直分量 Ey (purple)

  return (
    <svg
      viewBox="0 0 500 120"
      className="w-full max-w-2xl mx-auto"
      style={{ height: '80px' }}
    >
      {/* Ex - 水平电场分量 (正弦波) */}
      <motion.path
        d="M 0,60 Q 31.25,30 62.5,60 T 125,60 T 187.5,60 T 250,60 T 312.5,60 T 375,60 T 437.5,60 T 500,60"
        fill="none"
        stroke={exColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Ey - 垂直电场分量 (余弦波，相位差π/2) */}
      <motion.path
        d="M 0,60 Q 31.25,90 62.5,60 T 125,60 T 187.5,60 T 250,60 T 312.5,60 T 375,60 T 437.5,60 T 500,60"
        fill="none"
        stroke={eyColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.7 }}
        transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
      />

      {/* 传播方向箭头 */}
      <motion.path
        d="M 480,60 L 495,60 M 490,55 L 495,60 L 490,65"
        fill="none"
        stroke={theme === 'dark' ? '#64748b' : '#94a3b8'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5 }}
      />

      {/* Ex标签 */}
      <motion.text
        x="8"
        y="35"
        fontSize="10"
        fill={exColor}
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 2 }}
      >
        Ex
      </motion.text>

      {/* Ey标签 */}
      <motion.text
        x="8"
        y="95"
        fontSize="10"
        fill={eyColor}
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 2.3 }}
      >
        Ey
      </motion.text>

      {/* 相位指示小球 - 沿Ex分量运动 */}
      <motion.circle
        r="3.5"
        fill={exColor}
        style={{ filter: `drop-shadow(0 0 6px ${exColor})` }}
        initial={{ cx: 0, cy: 60 }}
        animate={{
          cx: [0, 62.5, 125, 187.5, 250, 312.5, 375, 437.5, 500],
          cy: [60, 30, 60, 90, 60, 30, 60, 90, 60],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* 相位指示小球 - 沿Ey分量运动（相位差π/2） */}
      <motion.circle
        r="3.5"
        fill={eyColor}
        style={{ filter: `drop-shadow(0 0 6px ${eyColor})` }}
        initial={{ cx: 0, cy: 60 }}
        animate={{
          cx: [0, 62.5, 125, 187.5, 250, 312.5, 375, 437.5, 500],
          cy: [60, 90, 60, 30, 60, 90, 60, 30, 60],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </svg>
  )
}

export default PolarizationWave
