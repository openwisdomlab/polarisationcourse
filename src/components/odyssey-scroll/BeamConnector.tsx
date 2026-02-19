/**
 * BeamConnector — 工作站之间的 SVG 弧线连接器
 * 模拟光束从上一个站的输出端（右侧）弯向下一个站的输入端（左侧）
 * 使用 Framer Motion scroll-driven pathLength 动画
 */
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface BeamConnectorProps {
  color: string
  height?: number
}

export function BeamConnector({ color, height = 120 }: BeamConnectorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const pathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  const h = height
  const d = `M 170,0 C 170,${h / 2} 30,${h / 2} 30,${h}`

  return (
    <div ref={ref} className="w-full" style={{ height }}>
      <svg
        viewBox={`0 0 200 ${h}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        {/* Glow layer (behind) */}
        <defs>
          <filter id={`beam-glow-${color.replace('#', '')}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
          </filter>
        </defs>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeOpacity={0.1}
          filter={`url(#beam-glow-${color.replace('#', '')})`}
        />

        {/* Main beam path */}
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeOpacity={0.3}
          style={{ pathLength }}
        />
      </svg>
    </div>
  )
}
