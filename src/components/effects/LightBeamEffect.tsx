/**
 * LightBeamEffect - 模块悬停光束特效组件
 * 当鼠标悬停在模块卡片上时，从Logo发射柔和的光束效果
 *
 * Design concept:
 * - Beams appear as soft diffused light curves, not sharp straight lines
 * - Gentle quadratic bezier paths simulate natural light propagation
 * - Flowing dash animation creates sense of energy flow
 * - Very subtle to complement rather than dominate the visual
 * - Particles follow curved paths for organic feel
 */

import { useRef, useEffect, useState, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

// Module effect types matching the 6 modules
export type ModuleEffectType =
  | 'history' // Warm flowing particles like candlelight
  | 'arsenal' // Precise laser beam with particles
  | 'theory' // Wave/oscillation pattern
  | 'games' // Playful bouncing particles
  | 'gallery' // Colorful artistic sparkles
  | 'research' // Scientific measurement beam

// Color configurations for each module - subtle glow values
const MODULE_COLORS: Record<ModuleEffectType, { primary: string; secondary: string; glow: string }> = {
  history: { primary: '#fbbf24', secondary: '#f59e0b', glow: 'rgba(251, 191, 36, 0.06)' },
  arsenal: { primary: '#22d3ee', secondary: '#06b6d4', glow: 'rgba(34, 211, 238, 0.06)' },
  theory: { primary: '#818cf8', secondary: '#6366f1', glow: 'rgba(129, 140, 248, 0.06)' },
  games: { primary: '#34d399', secondary: '#10b981', glow: 'rgba(52, 211, 153, 0.06)' },
  gallery: { primary: '#f472b6', secondary: '#ec4899', glow: 'rgba(244, 114, 182, 0.06)' },
  research: { primary: '#2dd4bf', secondary: '#14b8a6', glow: 'rgba(45, 212, 191, 0.06)' },
}

interface Position {
  x: number
  y: number
}

interface LightBeamEffectProps {
  logoRef: React.RefObject<HTMLDivElement | null>
  /** Right logo ref for beam between two logos */
  logoRightRef?: React.RefObject<HTMLDivElement | null>
  containerRef?: React.RefObject<HTMLDivElement | null>
  /** Currently hovered module ID - only show effect when this is set */
  activeModule?: ModuleEffectType | null
  /** Target position (center of hovered card) */
  targetRef?: React.RefObject<HTMLElement | null>
  /** Left logo hover state for interactive effects */
  leftLogoActive?: boolean
  /** Right logo hover state for interactive effects */
  rightLogoActive?: boolean
}

// Particle configuration for different effects
interface BeamParticle {
  id: number
  progress: number
  opacity: number
  offset: number // Perpendicular offset for variety
  size: number
  speed: number
}

// 计算二次贝塞尔曲线的控制点，产生柔和的弧形路径
function getCurveControlPoint(start: Position, end: Position, curveFactor = 0.08): Position {
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2
  const dx = end.x - start.x
  const dy = end.y - start.y
  const angle = Math.atan2(dy, dx)
  const dist = Math.sqrt(dx * dx + dy * dy)
  // 垂直方向偏移以形成弧线
  const perpX = -Math.sin(angle)
  const perpY = Math.cos(angle)
  return {
    x: midX + perpX * dist * curveFactor,
    y: midY + perpY * dist * curveFactor,
  }
}

// 沿二次贝塞尔曲线插值位置
function getPointOnCurve(start: Position, ctrl: Position, end: Position, t: number): Position {
  const mt = 1 - t
  return {
    x: mt * mt * start.x + 2 * mt * t * ctrl.x + t * t * end.x,
    y: mt * mt * start.y + 2 * mt * t * ctrl.y + t * t * end.y,
  }
}

export function LightBeamEffect({
  logoRef,
  logoRightRef,
  activeModule,
  targetRef,
  leftLogoActive = false,
  rightLogoActive = false,
}: LightBeamEffectProps) {
  const { theme } = useTheme()
  const svgRef = useRef<SVGSVGElement>(null)
  const [logoPos, setLogoPos] = useState<Position>({ x: 0, y: 0 })
  const [logoRightPos, setLogoRightPos] = useState<Position>({ x: 0, y: 0 })
  const [targetPos, setTargetPos] = useState<Position>({ x: 0, y: 0 })
  const [particles, setParticles] = useState<BeamParticle[]>([])
  const [logoBeamParticles, setLogoBeamParticles] = useState<BeamParticle[]>([])
  const [beamOpacity, setBeamOpacity] = useState(0)
  const [logoBeamOpacity, setLogoBeamOpacity] = useState(0)
  const animationRef = useRef<number | null>(null)
  const logoBeamAnimationRef = useRef<number | null>(null)
  const particleIdRef = useRef(0)
  const logoParticleIdRef = useRef(0)

  // Check if logo beam should be active
  const isLogoBeamActive = leftLogoActive || rightLogoActive

  // Calculate left logo center position
  const updateLogoPosition = useCallback(() => {
    if (!logoRef.current) return

    const logoRect = logoRef.current.getBoundingClientRect()
    setLogoPos({
      x: logoRect.left + logoRect.width / 2,
      y: logoRect.top + logoRect.height / 2,
    })
  }, [logoRef])

  // Calculate right logo center position
  const updateLogoRightPosition = useCallback(() => {
    if (!logoRightRef?.current) return

    const logoRect = logoRightRef.current.getBoundingClientRect()
    setLogoRightPos({
      x: logoRect.left + logoRect.width / 2,
      y: logoRect.top + logoRect.height / 2,
    })
  }, [logoRightRef])

  // Calculate target position (center of hovered card)
  const updateTargetPosition = useCallback(() => {
    if (!targetRef?.current) return

    const targetRect = targetRef.current.getBoundingClientRect()
    setTargetPos({
      x: targetRect.left + targetRect.width / 2,
      y: targetRect.top + targetRect.height / 2,
    })
  }, [targetRef])

  // Update positions on mount and resize
  useEffect(() => {
    updateLogoPosition()
    updateLogoRightPosition()
    updateTargetPosition()

    window.addEventListener('resize', updateLogoPosition)
    window.addEventListener('scroll', updateLogoPosition, true)
    window.addEventListener('resize', updateLogoRightPosition)
    window.addEventListener('scroll', updateLogoRightPosition, true)
    window.addEventListener('resize', updateTargetPosition)
    window.addEventListener('scroll', updateTargetPosition, true)

    return () => {
      window.removeEventListener('resize', updateLogoPosition)
      window.removeEventListener('scroll', updateLogoPosition, true)
      window.removeEventListener('resize', updateLogoRightPosition)
      window.removeEventListener('scroll', updateLogoRightPosition, true)
      window.removeEventListener('resize', updateTargetPosition)
      window.removeEventListener('scroll', updateTargetPosition, true)
    }
  }, [updateLogoPosition, updateLogoRightPosition, updateTargetPosition])

  // Update target position when targetRef changes
  useEffect(() => {
    updateTargetPosition()
  }, [targetRef?.current, updateTargetPosition])

  // Update right logo position when ref changes
  useEffect(() => {
    updateLogoRightPosition()
  }, [logoRightRef?.current, updateLogoRightPosition])

  // Smooth fade in/out with exponential easing for natural feel
  useEffect(() => {
    if (activeModule) {
      // Fade in - gradual
      const fadeIn = setInterval(() => {
        setBeamOpacity((prev) => Math.min(prev + 0.1, 1))
      }, 30)

      setTimeout(() => clearInterval(fadeIn), 400)

      return () => clearInterval(fadeIn)
    } else {
      // Fade out - exponential decay for smooth disappearance
      const fadeOut = setInterval(() => {
        setBeamOpacity((prev) => {
          if (prev <= 0.03) {
            clearInterval(fadeOut)
            return 0
          }
          return prev * 0.85
        })
      }, 30)

      return () => clearInterval(fadeOut)
    }
  }, [activeModule])

  // Smooth fade in/out of logo beam based on logo hover
  useEffect(() => {
    if (isLogoBeamActive) {
      const fadeIn = setInterval(() => {
        setLogoBeamOpacity((prev) => Math.min(prev + 0.08, 1))
      }, 30)

      setTimeout(() => clearInterval(fadeIn), 500)

      return () => clearInterval(fadeIn)
    } else {
      const fadeOut = setInterval(() => {
        setLogoBeamOpacity((prev) => {
          if (prev <= 0.03) {
            clearInterval(fadeOut)
            return 0
          }
          return prev * 0.88
        })
      }, 30)

      return () => clearInterval(fadeOut)
    }
  }, [isLogoBeamActive])

  // Animate logo beam particles - follow curved path
  useEffect(() => {
    if (!isLogoBeamActive || logoBeamOpacity <= 0 || !logoRightRef) {
      setLogoBeamParticles([])
      return
    }

    const createParticle = () => {
      setLogoBeamParticles((prev) => [
        ...prev.slice(-2),
        {
          id: logoParticleIdRef.current++,
          progress: 0,
          opacity: 0.1 + Math.random() * 0.12,
          offset: (Math.random() - 0.5) * 4,
          size: 1.5 + Math.random() * 2,
          speed: 0.35 + Math.random() * 0.15,
        },
      ])
    }

    const intervalId = setInterval(createParticle, 300)

    // Slower particle movement (0.012) matching original project design
    const animate = () => {
      setLogoBeamParticles((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + p.speed * 0.012 }))
          .filter((p) => p.progress < 1.1)
      )
      logoBeamAnimationRef.current = requestAnimationFrame(animate)
    }
    logoBeamAnimationRef.current = requestAnimationFrame(animate)

    return () => {
      clearInterval(intervalId)
      if (logoBeamAnimationRef.current) {
        cancelAnimationFrame(logoBeamAnimationRef.current)
      }
    }
  }, [isLogoBeamActive, logoBeamOpacity, logoPos, logoRightPos, logoRightRef])

  // Animate particles based on module type
  useEffect(() => {
    if (!activeModule || beamOpacity <= 0) {
      setParticles([])
      return
    }

    // Create particles based on module type
    const createParticle = () => {
      if (!activeModule) return

      const particleConfig = getParticleConfig(activeModule)

      setParticles((prev) => [
        ...prev.slice(-particleConfig.maxParticles),
        {
          id: particleIdRef.current++,
          progress: 0,
          opacity: 0.3 + Math.random() * 0.3,
          offset: (Math.random() - 0.5) * particleConfig.spread,
          size: particleConfig.minSize + Math.random() * (particleConfig.maxSize - particleConfig.minSize),
          speed: particleConfig.speed * (0.8 + Math.random() * 0.4),
        },
      ])
    }

    const particleConfig = getParticleConfig(activeModule)
    const intervalId = setInterval(createParticle, particleConfig.interval)

    // Slower movement (0.012) for graceful flow
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + p.speed * 0.012 }))
          .filter((p) => p.progress < 1.1)
      )
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      clearInterval(intervalId)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [activeModule, beamOpacity, logoPos, targetPos])

  // Don't render if no active module and no logo beam
  if (!activeModule && beamOpacity <= 0 && logoBeamOpacity <= 0) return null

  const colors = activeModule ? MODULE_COLORS[activeModule] : MODULE_COLORS.history

  // 计算柔和弧线的控制点
  const moduleCtrl = getCurveControlPoint(logoPos, targetPos, 0.06)
  const logoCtrl = getCurveControlPoint(logoPos, logoRightPos, 0.05)

  // 构建二次贝塞尔曲线路径
  const moduleBeamPath = `M ${logoPos.x} ${logoPos.y} Q ${moduleCtrl.x} ${moduleCtrl.y} ${targetPos.x} ${targetPos.y}`
  const logoBeamPath = `M ${logoPos.x} ${logoPos.y} Q ${logoCtrl.x} ${logoCtrl.y} ${logoRightPos.x} ${logoRightPos.y}`

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ width: '100vw', height: '100vh' }}
    >
      <defs>
        {/* 流动能量动画 */}
        <style>{`
          @keyframes beam-energy-flow {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -24; }
          }
        `}</style>

        {/* 柔和扩散光晕 - 较大的模糊半径模拟自然光散射 */}
        <filter id="beam-soft-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 粒子光晕 - 中等模糊 */}
        <filter id="particle-soft-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Logo beam gradient - cyan to magenta - very subtle */}
        <linearGradient
          id="logo-beam-gradient"
          x1={logoPos.x}
          y1={logoPos.y}
          x2={logoRightPos.x}
          y2={logoRightPos.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
          <stop offset="30%" stopColor="#22d3ee" stopOpacity="0.1" />
          <stop offset="70%" stopColor="#E91E8C" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#E91E8C" stopOpacity="0.2" />
        </linearGradient>

        {/* Module beam gradient - gentle fade from source to target */}
        <linearGradient
          id="module-beam-gradient"
          x1={logoPos.x}
          y1={logoPos.y}
          x2={targetPos.x}
          y2={targetPos.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.25" />
          <stop offset="40%" stopColor={colors.primary} stopOpacity="0.12" />
          <stop offset="80%" stopColor={colors.secondary} stopOpacity="0.06" />
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Logo-to-Logo beam - shows when either logo is hovered */}
      {logoBeamOpacity > 0 && logoRightPos.x > 0 && (
        <g>
          {/* 柔和扩散弧线 - 宽光束模拟自然光 */}
          <path
            d={logoBeamPath}
            fill="none"
            stroke="url(#logo-beam-gradient)"
            strokeWidth={theme === 'dark' ? 3 : 2}
            strokeOpacity={logoBeamOpacity * 0.1}
            filter="url(#beam-soft-glow)"
            strokeLinecap="round"
          />

          {/* 流动能量虚线 - 创造方向性动感 */}
          <path
            d={logoBeamPath}
            fill="none"
            stroke="url(#logo-beam-gradient)"
            strokeWidth={1}
            strokeOpacity={logoBeamOpacity * 0.15}
            strokeDasharray="6 18"
            strokeLinecap="round"
            style={{ animation: 'beam-energy-flow 3s linear infinite' }}
          />

          {/* 粒子沿弧线流动 */}
          {logoBeamParticles.map((particle) => {
            const t = Math.min(particle.progress, 1)
            const pos = getPointOnCurve(logoPos, logoCtrl, logoRightPos, t)
            const sizeProgress = Math.sin(t * Math.PI)
            const opacity = sizeProgress * particle.opacity * logoBeamOpacity * 0.15
            // Color interpolation from cyan to magenta
            const r = Math.round(34 + (233 - 34) * t)
            const g = Math.round(211 + (30 - 211) * t)
            const b = Math.round(238 + (140 - 238) * t)

            return (
              <circle
                key={particle.id}
                cx={pos.x}
                cy={pos.y}
                r={particle.size * sizeProgress}
                fill={`rgb(${r}, ${g}, ${b})`}
                opacity={opacity}
                filter="url(#particle-soft-glow)"
              />
            )
          })}

          {/* 端点柔和光晕 */}
          <circle
            cx={logoPos.x}
            cy={logoPos.y}
            r={leftLogoActive ? 6 : 4}
            fill="#22d3ee"
            opacity={logoBeamOpacity * (leftLogoActive ? 0.1 : 0.04)}
            filter="url(#beam-soft-glow)"
          />
          <circle
            cx={logoRightPos.x}
            cy={logoRightPos.y}
            r={rightLogoActive ? 6 : 4}
            fill="#E91E8C"
            opacity={logoBeamOpacity * (rightLogoActive ? 0.1 : 0.04)}
            filter="url(#beam-soft-glow)"
          />
        </g>
      )}

      {/* Module beam - shows when hovering a module card */}
      {beamOpacity > 0 && activeModule && (
        <g>
          {/* 柔和扩散弧线 - 宽模糊模拟漫反射光 */}
          <path
            d={moduleBeamPath}
            fill="none"
            stroke="url(#module-beam-gradient)"
            strokeWidth={theme === 'dark' ? 4 : 3}
            strokeOpacity={beamOpacity * 0.08}
            filter="url(#beam-soft-glow)"
            strokeLinecap="round"
          />

          {/* 流动能量虚线 - 方向性流动感 */}
          <path
            d={moduleBeamPath}
            fill="none"
            stroke={colors.primary}
            strokeWidth={1}
            strokeOpacity={beamOpacity * 0.1}
            strokeDasharray="4 16"
            strokeLinecap="round"
            style={{ animation: 'beam-energy-flow 2.5s linear infinite' }}
          />

          {/* Module-specific effects */}
          {renderModuleEffect(activeModule, {
            logoPos,
            targetPos,
            ctrlPoint: moduleCtrl,
            particles,
            beamOpacity,
            colors,
          })}

          {/* 光源处柔和光晕 */}
          <circle
            cx={logoPos.x}
            cy={logoPos.y}
            r={5}
            fill={colors.primary}
            opacity={beamOpacity * 0.05}
            filter="url(#beam-soft-glow)"
          />

          {/* 目标处柔和光晕 */}
          <circle
            cx={targetPos.x}
            cy={targetPos.y}
            r={6}
            fill={colors.secondary}
            opacity={beamOpacity * 0.04}
            filter="url(#beam-soft-glow)"
          />
        </g>
      )}
    </svg>
  )
}

// 粒子配置 - 减少数量和速度以获得更含蓄的视觉效果
function getParticleConfig(moduleType: ModuleEffectType) {
  switch (moduleType) {
    case 'history':
      // 温暖缓慢流动 - 烛光感
      return { maxParticles: 2, interval: 400, spread: 8, minSize: 1, maxSize: 2, speed: 0.35 }
    case 'arsenal':
      // 快速精准 - 激光感
      return { maxParticles: 3, interval: 250, spread: 4, minSize: 1, maxSize: 1.5, speed: 0.7 }
    case 'theory':
      // 波动振荡
      return { maxParticles: 3, interval: 220, spread: 10, minSize: 1, maxSize: 2, speed: 0.5 }
    case 'games':
      // 活泼弹跳
      return { maxParticles: 3, interval: 200, spread: 14, minSize: 1, maxSize: 2.5, speed: 0.55 }
    case 'gallery':
      // 星光闪烁
      return { maxParticles: 3, interval: 280, spread: 10, minSize: 1, maxSize: 2, speed: 0.4 }
    case 'research':
      // 科学测量
      return { maxParticles: 2, interval: 250, spread: 6, minSize: 1, maxSize: 1.5, speed: 0.55 }
  }
}

// Render module-specific visual effects - 粒子沿弧线流动
function renderModuleEffect(
  moduleType: ModuleEffectType,
  {
    logoPos,
    targetPos,
    ctrlPoint,
    particles,
    beamOpacity,
    colors,
  }: {
    logoPos: Position
    targetPos: Position
    ctrlPoint: Position
    particles: BeamParticle[]
    beamOpacity: number
    colors: { primary: string; secondary: string; glow: string }
  }
) {
  switch (moduleType) {
    case 'history':
      // 温暖流动粒子 - 柔和闪烁
      return (
        <g>
          {particles.map((particle) => {
            const t = Math.min(particle.progress, 1)
            const pos = getPointOnCurve(logoPos, ctrlPoint, targetPos, t)
            const flicker = 0.8 + Math.sin(t * Math.PI * 3) * 0.2
            const sizeProgress = Math.sin(t * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.12 * flicker

            return (
              <circle
                key={particle.id}
                cx={pos.x}
                cy={pos.y}
                r={particle.size * sizeProgress * 1.2}
                fill={colors.primary}
                opacity={opacity}
                filter="url(#particle-soft-glow)"
              />
            )
          })}
        </g>
      )

    case 'arsenal':
      // 快速流线粒子 - 椭圆拖尾
      return (
        <g>
          {particles.map((particle) => {
            const t = Math.min(particle.progress, 1)
            const pos = getPointOnCurve(logoPos, ctrlPoint, targetPos, t)
            const sizeProgress = Math.sin(t * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.12
            const dx = targetPos.x - logoPos.x
            const dy = targetPos.y - logoPos.y
            const angle = Math.atan2(dy, dx)

            return (
              <ellipse
                key={particle.id}
                cx={pos.x}
                cy={pos.y}
                rx={particle.size * sizeProgress * 1.8}
                ry={particle.size * sizeProgress * 0.4}
                fill={colors.primary}
                opacity={opacity}
                transform={`rotate(${(angle * 180) / Math.PI}, ${pos.x}, ${pos.y})`}
                filter="url(#particle-soft-glow)"
              />
            )
          })}
        </g>
      )

    case 'theory':
      // 波动振荡粒子 - 垂直于路径的正弦偏移
      return (
        <g>
          {particles.map((particle) => {
            const t = Math.min(particle.progress, 1)
            const pos = getPointOnCurve(logoPos, ctrlPoint, targetPos, t)
            // 垂直方向波动偏移
            const dx = targetPos.x - logoPos.x
            const dy = targetPos.y - logoPos.y
            const angle = Math.atan2(dy, dx)
            const perpX = -Math.sin(angle)
            const perpY = Math.cos(angle)
            const waveOffset = Math.sin(t * Math.PI * 5) * 6 * (1 - t * 0.5)
            const sizeProgress = Math.sin(t * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.1

            return (
              <circle
                key={particle.id}
                cx={pos.x + perpX * waveOffset}
                cy={pos.y + perpY * waveOffset}
                r={particle.size * sizeProgress}
                fill={colors.primary}
                opacity={opacity}
                filter="url(#particle-soft-glow)"
              />
            )
          })}
        </g>
      )

    case 'games':
      // 活泼弹跳粒子 - 多色变换
      return (
        <g>
          {particles.map((particle) => {
            const t = Math.min(particle.progress, 1)
            const pos = getPointOnCurve(logoPos, ctrlPoint, targetPos, t)
            const bounce = Math.abs(Math.sin(t * Math.PI * 2.5)) * 6 * (1 - t)
            const sizeProgress = Math.sin(t * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.12
            // Alternate colors for playful effect
            const hueShift = (particle.id % 3) * 30
            const particleColor = shiftHue(colors.primary, hueShift)

            return (
              <circle
                key={particle.id}
                cx={pos.x}
                cy={pos.y - bounce}
                r={particle.size * sizeProgress}
                fill={particleColor}
                opacity={opacity}
                filter="url(#particle-soft-glow)"
              />
            )
          })}
        </g>
      )

    case 'gallery':
      // 星光旋转粒子
      return (
        <g>
          {particles.map((particle) => {
            const t = Math.min(particle.progress, 1)
            const pos = getPointOnCurve(logoPos, ctrlPoint, targetPos, t)
            const sizeProgress = Math.sin(t * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.1
            const rotation = t * 270
            const s = particle.size * sizeProgress

            return (
              <g key={particle.id} transform={`translate(${pos.x}, ${pos.y}) rotate(${rotation})`}>
                {/* 4-point star */}
                <path
                  d={`M 0 ${-s}
                      L ${s * 0.2} 0
                      L 0 ${s}
                      L ${-s * 0.2} 0 Z
                      M ${-s} 0
                      L 0 ${s * 0.2}
                      L ${s} 0
                      L 0 ${-s * 0.2} Z`}
                  fill={colors.primary}
                  opacity={opacity}
                  filter="url(#particle-soft-glow)"
                />
              </g>
            )
          })}
        </g>
      )

    case 'research':
      // 科学数据点粒子 - 菱形
      return (
        <g>
          {particles.map((particle) => {
            const t = Math.min(particle.progress, 1)
            const pos = getPointOnCurve(logoPos, ctrlPoint, targetPos, t)
            const sizeProgress = Math.sin(t * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.1

            return (
              <rect
                key={particle.id}
                x={pos.x - particle.size * sizeProgress}
                y={pos.y - particle.size * sizeProgress}
                width={particle.size * sizeProgress * 2}
                height={particle.size * sizeProgress * 2}
                fill={colors.primary}
                opacity={opacity}
                transform={`rotate(45, ${pos.x}, ${pos.y})`}
                filter="url(#particle-soft-glow)"
              />
            )
          })}
        </g>
      )

    default:
      return null
  }
}

// Simple hue shift for color variation
function shiftHue(hexColor: string, degrees: number): string {
  // Parse hex color
  const r = parseInt(hexColor.slice(1, 3), 16) / 255
  const g = parseInt(hexColor.slice(3, 5), 16) / 255
  const b = parseInt(hexColor.slice(5, 7), 16) / 255

  // Convert to HSL
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  const l = (max + min) / 2
  const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)

  if (max !== min) {
    if (max === r) h = ((g - b) / (max - min)) % 6
    else if (max === g) h = (b - r) / (max - min) + 2
    else h = (r - g) / (max - min) + 4
    h *= 60
    if (h < 0) h += 360
  }

  // Shift hue
  h = (h + degrees) % 360

  // Convert back to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r1 = 0,
    g1 = 0,
    b1 = 0
  if (h < 60) {
    r1 = c
    g1 = x
  } else if (h < 120) {
    r1 = x
    g1 = c
  } else if (h < 180) {
    g1 = c
    b1 = x
  } else if (h < 240) {
    g1 = x
    b1 = c
  } else if (h < 300) {
    r1 = x
    b1 = c
  } else {
    r1 = c
    b1 = x
  }

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`
}
