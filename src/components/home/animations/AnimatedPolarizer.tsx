/**
 * AnimatedPolarizer Component
 * Extracted from HomePage for better organization
 */

import { motion } from 'framer-motion'


function AnimatedPolarizer({
  theme,
  angle = 0
}: {
  theme: 'dark' | 'light'
  angle?: 0 | 90
}) {
  const color = theme === 'dark' ? '#22d3ee' : '#0891b2'
  const isHorizontal = angle === 0

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-16 h-16"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* 外圆环 - 偏振片边框 */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.4"
      />

      {/* 偏振片透射轴线（多条平行线模拟偏振片的栅格结构） */}
      {Array.from({ length: 12 }).map((_, i) => {
        const offset = -27.5 + i * 5 // 从-27.5到+27.5，间隔5
        return (
          <motion.line
            key={i}
            x1={isHorizontal ? 15 : 50 + offset}
            y1={isHorizontal ? 50 + offset : 15}
            x2={isHorizontal ? 85 : 50 + offset}
            y2={isHorizontal ? 50 + offset : 85}
            stroke={color}
            strokeWidth="1.2"
            opacity="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )
      })}

      {/* 透射轴方向指示器（加粗的中心线） */}
      <motion.line
        x1={isHorizontal ? 10 : 50}
        y1={isHorizontal ? 50 : 10}
        x2={isHorizontal ? 90 : 50}
        y2={isHorizontal ? 50 : 90}
        stroke={color}
        strokeWidth="2.5"
        opacity="0.9"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      {/* 透射轴箭头 */}
      <motion.path
        d={isHorizontal
          ? "M 85,50 L 90,50 M 87,47 L 90,50 L 87,53"
          : "M 50,10 L 50,5 M 47,8 L 50,5 L 53,8"
        }
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1 }}
      />

      {/* 中心光点 - 表示光通过偏振片 */}
      <motion.circle
        cx="50"
        cy="50"
        r="6"
        fill={color}
        initial={{ opacity: 0.3, scale: 0.5 }}
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />

      {/* 角度标记 */}
      <motion.text
        x="50"
        y="95"
        fontSize="10"
        fill={color}
        textAnchor="middle"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2 }}
      >
        {angle}°
      </motion.text>
    </motion.svg>
  )
}

export default AnimatedPolarizer
