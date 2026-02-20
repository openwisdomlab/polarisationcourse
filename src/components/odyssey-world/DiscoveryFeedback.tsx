/**
 * DiscoveryFeedback.tsx -- 环境响应动画组件
 *
 * 为每个已达成的发现渲染对应的环境响应 SVG 元素。
 * 四种响应类型:
 * - illuminate: 柔和的径向渐变照明 (马吕斯定律、三偏振片惊喜)
 * - color-shift: 表面颜色平滑过渡 (半波旋转)
 * - pattern: 暗区中显现的磷光图案 (完全消光)
 * - particle-burst: 水晶闪烁粒子 (圆偏振)
 *
 * 设计原则 (The Witness 品质):
 * - 柔和弹簧动画 (低刚度 40-60, 高阻尼 15-20)
 * - 温和色调 (暖金、柔蓝、淡绿)
 * - 低不透明度 (15-40%) 不干扰光束视觉主导地位
 * - 所有效果在触发后持续可见
 */

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DISCOVERY_CONFIGS, type DiscoveryConfig } from './hooks/useDiscoveryState'

interface DiscoveryFeedbackProps {
  achievedDiscoveries: Set<string>
  newlyAchieved: string | null
}

// ── 弹簧动画配置 (The Witness 风格: 柔和有机) ──────────────────────────

const SPRING_CONFIG = {
  stiffness: 50,
  damping: 18,
  mass: 1,
}

// ── 照明响应 ────────────────────────────────────────────────────────────

/**
 * 径向渐变照明: 暖金色光晕从目标区域扩散
 * 用于马吕斯定律和三偏振片惊喜
 */
function IlluminateResponse({
  config,
  isNew,
}: {
  config: DiscoveryConfig
  isNew: boolean
}) {
  const color = config.response.params.color as string
  const radius = (config.response.params.radius as number) ?? 60
  const targetOpacity = (config.response.params.opacity as number) ?? 0.3
  const gradientId = `illuminate-grad-${config.id}`

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', ...SPRING_CONFIG }}
    >
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0%" stopColor={color} stopOpacity={targetOpacity} />
          <stop offset="60%" stopColor={color} stopOpacity={targetOpacity * 0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <motion.ellipse
        cx={0}
        cy={0}
        initial={{ rx: 0, ry: 0 }}
        animate={{ rx: radius, ry: radius * 0.5 }}
        transition={{
          type: 'spring',
          stiffness: isNew ? 40 : 60,
          damping: 15,
          delay: isNew ? 0.1 : 0,
        }}
        fill={`url(#${gradientId})`}
        style={{ pointerEvents: 'none' }}
      />
      {/* 核心亮点 */}
      <motion.ellipse
        cx={0}
        cy={0}
        initial={{ rx: 0, ry: 0 }}
        animate={{ rx: radius * 0.3, ry: radius * 0.15 }}
        transition={{
          type: 'spring',
          stiffness: 45,
          damping: 18,
          delay: isNew ? 0.3 : 0,
        }}
        fill={color}
        opacity={targetOpacity * 0.5}
        style={{ pointerEvents: 'none' }}
      />
    </motion.g>
  )
}

// ── 颜色变化响应 ────────────────────────────────────────────────────────

/**
 * 表面颜色过渡: 装饰表面平滑变色
 * 用于半波旋转
 */
function ColorShiftResponse({
  config,
}: {
  config: DiscoveryConfig
}) {
  const color = config.response.params.color as string
  const targetOpacity = (config.response.params.opacity as number) ?? 0.25

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* 颜色漂移表面 -- 等距菱形 */}
      <motion.polygon
        points="0,-20 35,0 0,20 -35,0"
        fill={color}
        initial={{ opacity: 0 }}
        animate={{ opacity: targetOpacity }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        style={{ pointerEvents: 'none' }}
      />
      {/* 边缘柔化 */}
      <motion.polygon
        points="0,-28 45,0 0,28 -45,0"
        fill="none"
        stroke={color}
        strokeWidth={1}
        initial={{ opacity: 0 }}
        animate={{ opacity: targetOpacity * 0.4 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{ pointerEvents: 'none' }}
      />
    </motion.g>
  )
}

// ── 图案响应 ────────────────────────────────────────────────────────────

/**
 * 磷光图案: 暗区中逐渐显现的几何线条
 * 用于完全消光 -- "黑暗中的发现"
 */
function PatternResponse({
  config,
  isNew,
}: {
  config: DiscoveryConfig
  isNew: boolean
}) {
  const color = config.response.params.color as string
  const targetOpacity = (config.response.params.opacity as number) ?? 0.2
  const patternId = `pattern-${config.id}`

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', ...SPRING_CONFIG }}
    >
      <defs>
        <pattern
          id={patternId}
          width={12}
          height={12}
          patternUnits="userSpaceOnUse"
        >
          {/* 几何光点 -- 水晶晶格暗示 */}
          <circle cx={2} cy={2} r={0.8} fill={color} opacity={0.6} />
          <circle cx={8} cy={8} r={0.8} fill={color} opacity={0.4} />
          <line
            x1={0}
            y1={6}
            x2={12}
            y2={6}
            stroke={color}
            strokeWidth={0.3}
            opacity={0.3}
          />
          <line
            x1={6}
            y1={0}
            x2={6}
            y2={12}
            stroke={color}
            strokeWidth={0.3}
            opacity={0.3}
          />
        </pattern>
      </defs>
      {/* 图案显现区域 */}
      <motion.rect
        x={-30}
        y={-15}
        width={60}
        height={30}
        rx={4}
        fill={`url(#${patternId})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: targetOpacity }}
        transition={{
          duration: isNew ? 2 : 0.5,
          ease: 'easeIn',
        }}
        style={{ pointerEvents: 'none' }}
      />
      {/* 边缘发光 */}
      <motion.rect
        x={-30}
        y={-15}
        width={60}
        height={30}
        rx={4}
        fill="none"
        stroke={color}
        strokeWidth={0.5}
        initial={{ opacity: 0 }}
        animate={{ opacity: targetOpacity * 0.5 }}
        transition={{ duration: 2.5, ease: 'easeIn' }}
        style={{ pointerEvents: 'none' }}
      />
    </motion.g>
  )
}

// ── 粒子爆发响应 ────────────────────────────────────────────────────────

/**
 * 水晶闪烁粒子: 小圆旋转爆发 -> 持续微光
 * 用于圆偏振 -- 暗示旋转运动
 */
function ParticleBurstResponse({
  config,
  isNew,
}: {
  config: DiscoveryConfig
  isNew: boolean
}) {
  const color = config.response.params.color as string
  const particleCount = (config.response.params.particleCount as number) ?? 10
  const shimmerCount = (config.response.params.shimmerCount as number) ?? 4

  // 生成粒子角度和距离
  const particles = useMemo(() => {
    const result = []
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const burstRadius = 25 + Math.random() * 15
      const settleRadius = 12 + Math.random() * 8
      const size = 1.5 + Math.random() * 1.5
      const delay = i * 0.05
      result.push({ angle, burstRadius, settleRadius, size, delay })
    }
    return result
  }, [particleCount])

  // 微光粒子 (持续轨道运动)
  const shimmerParticles = useMemo(() => {
    const result = []
    for (let i = 0; i < shimmerCount; i++) {
      const angle = (i / shimmerCount) * Math.PI * 2
      const radius = 10 + Math.random() * 5
      const size = 1 + Math.random() * 1
      const duration = 3 + Math.random() * 2
      result.push({ angle, radius, size, duration })
    }
    return result
  }, [shimmerCount])

  return (
    <g style={{ pointerEvents: 'none' }}>
      <AnimatePresence>
        {/* 爆发粒子 -- 只在首次触发时完整播放 */}
        {isNew &&
          particles.map((p, i) => (
            <motion.circle
              key={`burst-${i}`}
              cx={0}
              cy={0}
              r={p.size}
              fill={color}
              initial={{
                opacity: 0.8,
                cx: 0,
                cy: 0,
              }}
              animate={{
                opacity: [0.8, 0.6, 0],
                cx: [0, Math.cos(p.angle) * p.burstRadius],
                cy: [0, Math.sin(p.angle) * p.burstRadius],
              }}
              transition={{
                duration: 2.5,
                delay: p.delay,
                ease: 'easeOut',
              }}
            />
          ))}
      </AnimatePresence>

      {/* 持续微光粒子 -- 轨道运动 */}
      {shimmerParticles.map((sp, i) => (
        <motion.circle
          key={`shimmer-${i}`}
          r={sp.size}
          fill={color}
          initial={{
            opacity: 0,
            cx: Math.cos(sp.angle) * sp.radius,
            cy: Math.sin(sp.angle) * sp.radius,
          }}
          animate={{
            opacity: [0, 0.4, 0.2, 0.4],
            cx: [
              Math.cos(sp.angle) * sp.radius,
              Math.cos(sp.angle + Math.PI * 0.5) * sp.radius,
              Math.cos(sp.angle + Math.PI) * sp.radius,
              Math.cos(sp.angle + Math.PI * 1.5) * sp.radius,
            ],
            cy: [
              Math.sin(sp.angle) * sp.radius,
              Math.sin(sp.angle + Math.PI * 0.5) * sp.radius,
              Math.sin(sp.angle + Math.PI) * sp.radius,
              Math.sin(sp.angle + Math.PI * 1.5) * sp.radius,
            ],
          }}
          transition={{
            duration: sp.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: isNew ? 2.5 : 0,
          }}
        />
      ))}
    </g>
  )
}

// ── 单个发现响应渲染器 ──────────────────────────────────────────────────

function DiscoveryResponseRenderer({
  config,
  isNew,
}: {
  config: DiscoveryConfig
  isNew: boolean
}) {
  switch (config.response.type) {
    case 'illuminate':
      return <IlluminateResponse config={config} isNew={isNew} />
    case 'color-shift':
      return <ColorShiftResponse config={config} />
    case 'pattern':
      return <PatternResponse config={config} isNew={isNew} />
    case 'particle-burst':
      return <ParticleBurstResponse config={config} isNew={isNew} />
    default:
      return null
  }
}

// ── 主组件 ──────────────────────────────────────────────────────────────

/**
 * DiscoveryFeedback -- 环境响应层
 *
 * 渲染在 IsometricScene 的 Layer 2 (物体) 和 Layer 3 (光束) 之间，
 * 确保环境效果出现在光束后面 (光束视觉主导 -- VISL-03)。
 *
 * 每个已达成的发现在其对应的 discovery-area-* 位置渲染持久效果。
 */
export function DiscoveryFeedback({
  achievedDiscoveries,
  newlyAchieved,
}: DiscoveryFeedbackProps) {
  if (achievedDiscoveries.size === 0) return null

  return (
    <g className="layer-discovery-feedback" style={{ pointerEvents: 'none' }}>
      {DISCOVERY_CONFIGS.map((config) => {
        if (!achievedDiscoveries.has(config.id)) return null

        return (
          <g key={config.id}>
            <DiscoveryResponseRenderer
              config={config}
              isNew={newlyAchieved === config.id}
            />
          </g>
        )
      })}
    </g>
  )
}
