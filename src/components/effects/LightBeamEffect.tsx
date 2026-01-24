/**
 * LightBeamEffect - 模块悬停光束特效组件
 * 当鼠标悬停在模块卡片上时，从Logo发射特定主题的光束效果
 *
 * Design concept:
 * - Beams only appear when hovering over module cards
 * - Each module has a unique effect matching its theme
 * - Effects are subtle and don't overwhelm the main visual
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

// Color configurations for each module
const MODULE_COLORS: Record<ModuleEffectType, { primary: string; secondary: string; glow: string }> = {
  history: { primary: '#fbbf24', secondary: '#f59e0b', glow: 'rgba(251, 191, 36, 0.4)' },
  arsenal: { primary: '#22d3ee', secondary: '#06b6d4', glow: 'rgba(34, 211, 238, 0.4)' },
  theory: { primary: '#818cf8', secondary: '#6366f1', glow: 'rgba(129, 140, 248, 0.4)' },
  games: { primary: '#34d399', secondary: '#10b981', glow: 'rgba(52, 211, 153, 0.4)' },
  gallery: { primary: '#f472b6', secondary: '#ec4899', glow: 'rgba(244, 114, 182, 0.4)' },
  research: { primary: '#2dd4bf', secondary: '#14b8a6', glow: 'rgba(45, 212, 191, 0.4)' },
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

  // Smooth fade in/out of beam based on activeModule
  useEffect(() => {
    if (activeModule) {
      // Fade in
      const fadeIn = setInterval(() => {
        setBeamOpacity((prev) => Math.min(prev + 0.2, 1))
      }, 20)

      setTimeout(() => clearInterval(fadeIn), 200)

      return () => clearInterval(fadeIn)
    } else {
      // Fade out
      const fadeOut = setInterval(() => {
        setBeamOpacity((prev) => {
          if (prev <= 0.05) {
            clearInterval(fadeOut)
            return 0
          }
          return prev - 0.1
        })
      }, 20)

      return () => clearInterval(fadeOut)
    }
  }, [activeModule])

  // Smooth fade in/out of logo beam based on logo hover
  useEffect(() => {
    if (isLogoBeamActive) {
      // Fade in
      const fadeIn = setInterval(() => {
        setLogoBeamOpacity((prev) => Math.min(prev + 0.15, 1))
      }, 20)

      setTimeout(() => clearInterval(fadeIn), 300)

      return () => clearInterval(fadeIn)
    } else {
      // Fade out
      const fadeOut = setInterval(() => {
        setLogoBeamOpacity((prev) => {
          if (prev <= 0.05) {
            clearInterval(fadeOut)
            return 0
          }
          return prev - 0.08
        })
      }, 20)

      return () => clearInterval(fadeOut)
    }
  }, [isLogoBeamActive])

  // Animate logo beam particles
  useEffect(() => {
    if (!isLogoBeamActive || logoBeamOpacity <= 0 || !logoRightRef) {
      setLogoBeamParticles([])
      return
    }

    // Create particles for logo beam
    const createParticle = () => {
      setLogoBeamParticles((prev) => [
        ...prev.slice(-12),
        {
          id: logoParticleIdRef.current++,
          progress: 0,
          opacity: 0.5 + Math.random() * 0.4,
          offset: (Math.random() - 0.5) * 15,
          size: 2 + Math.random() * 3,
          speed: 0.8 + Math.random() * 0.4,
        },
      ])
    }

    const intervalId = setInterval(createParticle, 80)

    // Animate particles
    const animate = () => {
      setLogoBeamParticles((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + p.speed * 0.015 }))
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
          opacity: 0.4 + Math.random() * 0.4,
          offset: (Math.random() - 0.5) * particleConfig.spread,
          size: particleConfig.minSize + Math.random() * (particleConfig.maxSize - particleConfig.minSize),
          speed: particleConfig.speed * (0.8 + Math.random() * 0.4),
        },
      ])
    }

    const particleConfig = getParticleConfig(activeModule)
    const intervalId = setInterval(createParticle, particleConfig.interval)

    // Animate particles
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + p.speed * 0.02 }))
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
  const dx = targetPos.x - logoPos.x
  const dy = targetPos.y - logoPos.y
  const angle = Math.atan2(dy, dx)

  // Perpendicular direction for particle offsets
  const perpX = -Math.sin(angle)
  const perpY = Math.cos(angle)

  // Logo beam calculations
  const logoDx = logoRightPos.x - logoPos.x
  const logoDy = logoRightPos.y - logoPos.y
  const logoAngle = Math.atan2(logoDy, logoDx)
  const logoPerpX = -Math.sin(logoAngle)
  const logoPerpY = Math.cos(logoAngle)

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ width: '100vw', height: '100vh' }}
    >
      <defs>
        {/* Soft glow filter */}
        <filter id="module-beam-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Particle glow */}
        <filter id="module-particle-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Logo beam gradient - cyan to magenta */}
        <linearGradient
          id="logo-beam-gradient"
          x1={logoPos.x}
          y1={logoPos.y}
          x2={logoRightPos.x}
          y2={logoRightPos.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
          <stop offset="30%" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#E91E8C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E91E8C" stopOpacity="0.6" />
        </linearGradient>

        {/* Module beam gradient */}
        <linearGradient
          id="module-beam-gradient"
          x1={logoPos.x}
          y1={logoPos.y}
          x2={targetPos.x}
          y2={targetPos.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.3" />
          <stop offset="50%" stopColor={colors.primary} stopOpacity="0.15" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Logo-to-Logo beam - shows when either logo is hovered */}
      {logoBeamOpacity > 0 && logoRightPos.x > 0 && (
        <g>
          {/* Main beam line between logos */}
          <line
            x1={logoPos.x}
            y1={logoPos.y}
            x2={logoRightPos.x}
            y2={logoRightPos.y}
            stroke="url(#logo-beam-gradient)"
            strokeWidth={theme === 'dark' ? 3 : 2}
            strokeOpacity={logoBeamOpacity * 0.5}
            filter="url(#module-beam-glow)"
            strokeLinecap="round"
          />

          {/* Flowing particles between logos */}
          {logoBeamParticles.map((particle) => {
            const progress = Math.min(particle.progress, 1)
            const x = logoPos.x + logoDx * progress + logoPerpX * particle.offset * Math.sin(progress * Math.PI * 2)
            const y = logoPos.y + logoDy * progress + logoPerpY * particle.offset * Math.sin(progress * Math.PI * 2)
            const sizeProgress = Math.sin(progress * Math.PI)
            const opacity = sizeProgress * particle.opacity * logoBeamOpacity * 0.6
            // Color interpolation from cyan to magenta
            const colorProgress = progress
            const r = Math.round(34 + (233 - 34) * colorProgress)
            const g = Math.round(211 + (30 - 211) * colorProgress)
            const b = Math.round(238 + (140 - 238) * colorProgress)
            const particleColor = `rgb(${r}, ${g}, ${b})`

            return (
              <circle
                key={particle.id}
                cx={x}
                cy={y}
                r={particle.size * sizeProgress}
                fill={particleColor}
                opacity={opacity}
                filter="url(#module-particle-glow)"
              />
            )
          })}

          {/* Glow at left logo (cyan) */}
          <circle
            cx={logoPos.x}
            cy={logoPos.y}
            r={leftLogoActive ? 16 : 10}
            fill="#22d3ee"
            opacity={logoBeamOpacity * (leftLogoActive ? 0.4 : 0.2)}
            filter="url(#module-beam-glow)"
          />

          {/* Glow at right logo (magenta) */}
          <circle
            cx={logoRightPos.x}
            cy={logoRightPos.y}
            r={rightLogoActive ? 16 : 10}
            fill="#E91E8C"
            opacity={logoBeamOpacity * (rightLogoActive ? 0.4 : 0.2)}
            filter="url(#module-beam-glow)"
          />
        </g>
      )}

      {/* Module beam - shows when hovering a module card */}
      {beamOpacity > 0 && activeModule && (
        <g>
          {/* Main beam line - very subtle */}
          <line
            x1={logoPos.x}
            y1={logoPos.y}
            x2={targetPos.x}
            y2={targetPos.y}
            stroke="url(#module-beam-gradient)"
            strokeWidth={theme === 'dark' ? 2 : 1.5}
            strokeOpacity={beamOpacity * 0.4}
            filter="url(#module-beam-glow)"
            strokeLinecap="round"
          />

          {/* Module-specific effects */}
          {renderModuleEffect(activeModule, {
            logoPos,
            targetPos,
            particles,
            beamOpacity,
            colors,
            perpX,
            perpY,
            angle,
          })}

          {/* Source glow at logo - subtle */}
          <circle
            cx={logoPos.x}
            cy={logoPos.y}
            r={12}
            fill={colors.primary}
            opacity={beamOpacity * 0.15}
            filter="url(#module-beam-glow)"
          />
        </g>
      )}
    </svg>
  )
}

// Particle configuration for each module type
function getParticleConfig(moduleType: ModuleEffectType) {
  switch (moduleType) {
    case 'history':
      // Warm, slow flowing particles like candlelight
      return { maxParticles: 8, interval: 200, spread: 20, minSize: 2, maxSize: 5, speed: 0.8 }
    case 'arsenal':
      // Fast, precise laser particles
      return { maxParticles: 10, interval: 100, spread: 6, minSize: 1.5, maxSize: 3, speed: 1.4 }
    case 'theory':
      // Wave-like oscillating particles
      return { maxParticles: 12, interval: 80, spread: 30, minSize: 2, maxSize: 4, speed: 1.0 }
    case 'games':
      // Playful bouncing particles
      return { maxParticles: 15, interval: 60, spread: 40, minSize: 2, maxSize: 6, speed: 1.2 }
    case 'gallery':
      // Colorful sparkle particles
      return { maxParticles: 10, interval: 150, spread: 25, minSize: 2, maxSize: 5, speed: 0.9 }
    case 'research':
      // Scientific measurement particles
      return { maxParticles: 8, interval: 120, spread: 10, minSize: 1.5, maxSize: 3, speed: 1.1 }
  }
}

// Render module-specific visual effects
function renderModuleEffect(
  moduleType: ModuleEffectType,
  {
    logoPos,
    targetPos,
    particles,
    beamOpacity,
    colors,
    perpX,
    perpY,
    angle,
  }: {
    logoPos: Position
    targetPos: Position
    particles: BeamParticle[]
    beamOpacity: number
    colors: { primary: string; secondary: string; glow: string }
    perpX: number
    perpY: number
    angle: number
  }
) {
  const dx = targetPos.x - logoPos.x
  const dy = targetPos.y - logoPos.y

  switch (moduleType) {
    case 'history':
      // Warm flowing particles with flickering effect
      return (
        <g>
          {particles.map((particle) => {
            const progress = Math.min(particle.progress, 1)
            const flicker = 0.7 + Math.sin(progress * Math.PI * 4) * 0.3
            const x = logoPos.x + dx * progress + perpX * particle.offset * (1 - progress * 0.5)
            const y = logoPos.y + dy * progress + perpY * particle.offset * (1 - progress * 0.5)
            const sizeProgress = Math.sin(progress * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.5 * flicker

            return (
              <circle
                key={particle.id}
                cx={x}
                cy={y}
                r={particle.size * sizeProgress}
                fill={colors.primary}
                opacity={opacity}
                filter="url(#module-particle-glow)"
              />
            )
          })}
        </g>
      )

    case 'arsenal':
      // Precise laser beam with trailing particles
      return (
        <g>
          {/* Sharp center beam */}
          <line
            x1={logoPos.x}
            y1={logoPos.y}
            x2={targetPos.x}
            y2={targetPos.y}
            stroke={colors.primary}
            strokeWidth={1}
            strokeOpacity={beamOpacity * 0.6}
            strokeLinecap="round"
          />
          {/* Fast particles */}
          {particles.map((particle) => {
            const progress = Math.min(particle.progress, 1)
            const x = logoPos.x + dx * progress + perpX * particle.offset * 0.3
            const y = logoPos.y + dy * progress + perpY * particle.offset * 0.3
            const sizeProgress = Math.sin(progress * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.6

            return (
              <ellipse
                key={particle.id}
                cx={x}
                cy={y}
                rx={particle.size * sizeProgress * 1.5}
                ry={particle.size * sizeProgress * 0.5}
                fill={colors.primary}
                opacity={opacity}
                transform={`rotate(${angle * 180 / Math.PI}, ${x}, ${y})`}
                filter="url(#module-particle-glow)"
              />
            )
          })}
        </g>
      )

    case 'theory':
      // Wave pattern with oscillating path
      return (
        <g>
          {/* Wave path */}
          <path
            d={generateWavePath(logoPos, targetPos, beamOpacity * 8)}
            fill="none"
            stroke={colors.primary}
            strokeWidth={1.5}
            strokeOpacity={beamOpacity * 0.4}
            filter="url(#module-beam-glow)"
          />
          {/* Particles following wave */}
          {particles.map((particle) => {
            const progress = Math.min(particle.progress, 1)
            const waveOffset = Math.sin(progress * Math.PI * 6) * 15 * (1 - progress)
            const x = logoPos.x + dx * progress + perpX * waveOffset
            const y = logoPos.y + dy * progress + perpY * waveOffset
            const sizeProgress = Math.sin(progress * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.5

            return (
              <circle
                key={particle.id}
                cx={x}
                cy={y}
                r={particle.size * sizeProgress}
                fill={colors.primary}
                opacity={opacity}
                filter="url(#module-particle-glow)"
              />
            )
          })}
        </g>
      )

    case 'games':
      // Playful bouncing particles with varied colors
      return (
        <g>
          {particles.map((particle) => {
            const progress = Math.min(particle.progress, 1)
            const bounce = Math.abs(Math.sin(progress * Math.PI * 3)) * 20
            const x = logoPos.x + dx * progress + perpX * particle.offset
            const y = logoPos.y + dy * progress + perpY * particle.offset - bounce * (1 - progress)
            const sizeProgress = Math.sin(progress * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.6
            // Alternate colors for playful effect
            const hueShift = (particle.id % 3) * 30
            const particleColor = shiftHue(colors.primary, hueShift)

            return (
              <circle
                key={particle.id}
                cx={x}
                cy={y}
                r={particle.size * sizeProgress}
                fill={particleColor}
                opacity={opacity}
                filter="url(#module-particle-glow)"
              />
            )
          })}
        </g>
      )

    case 'gallery':
      // Sparkle effect with star shapes
      return (
        <g>
          {particles.map((particle) => {
            const progress = Math.min(particle.progress, 1)
            const x = logoPos.x + dx * progress + perpX * particle.offset * Math.sin(progress * Math.PI * 2)
            const y = logoPos.y + dy * progress + perpY * particle.offset * Math.sin(progress * Math.PI * 2)
            const sizeProgress = Math.sin(progress * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.5
            const rotation = progress * 360

            return (
              <g key={particle.id} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
                {/* 4-point star */}
                <path
                  d={`M 0 ${-particle.size * sizeProgress * 2}
                      L ${particle.size * sizeProgress * 0.3} 0
                      L 0 ${particle.size * sizeProgress * 2}
                      L ${-particle.size * sizeProgress * 0.3} 0 Z
                      M ${-particle.size * sizeProgress * 2} 0
                      L 0 ${particle.size * sizeProgress * 0.3}
                      L ${particle.size * sizeProgress * 2} 0
                      L 0 ${-particle.size * sizeProgress * 0.3} Z`}
                  fill={colors.primary}
                  opacity={opacity}
                  filter="url(#module-particle-glow)"
                />
              </g>
            )
          })}
        </g>
      )

    case 'research':
      // Scientific measurement beam with tick marks
      return (
        <g>
          {/* Main precise beam */}
          <line
            x1={logoPos.x}
            y1={logoPos.y}
            x2={targetPos.x}
            y2={targetPos.y}
            stroke={colors.primary}
            strokeWidth={1}
            strokeOpacity={beamOpacity * 0.5}
            strokeDasharray="8 4"
          />
          {/* Measurement tick marks */}
          {Array.from({ length: 5 }).map((_, i) => {
            const progress = (i + 1) / 6
            const x = logoPos.x + dx * progress
            const y = logoPos.y + dy * progress
            const tickLength = 6

            return (
              <line
                key={`tick-${i}`}
                x1={x - perpX * tickLength}
                y1={y - perpY * tickLength}
                x2={x + perpX * tickLength}
                y2={y + perpY * tickLength}
                stroke={colors.primary}
                strokeWidth={1}
                strokeOpacity={beamOpacity * 0.4}
              />
            )
          })}
          {/* Data point particles */}
          {particles.map((particle) => {
            const progress = Math.min(particle.progress, 1)
            const x = logoPos.x + dx * progress + perpX * particle.offset * 0.5
            const y = logoPos.y + dy * progress + perpY * particle.offset * 0.5
            const sizeProgress = Math.sin(progress * Math.PI)
            const opacity = sizeProgress * particle.opacity * beamOpacity * 0.5

            return (
              <rect
                key={particle.id}
                x={x - particle.size * sizeProgress}
                y={y - particle.size * sizeProgress}
                width={particle.size * sizeProgress * 2}
                height={particle.size * sizeProgress * 2}
                fill={colors.primary}
                opacity={opacity}
                transform={`rotate(45, ${x}, ${y})`}
                filter="url(#module-particle-glow)"
              />
            )
          })}
        </g>
      )

    default:
      return null
  }
}

// Generate wave path for theory module
function generateWavePath(start: Position, end: Position, amplitude: number): string {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const angle = Math.atan2(dy, dx)
  const perpX = -Math.sin(angle)
  const perpY = Math.cos(angle)

  const points: string[] = [`M ${start.x} ${start.y}`]
  const segments = 20

  for (let i = 1; i <= segments; i++) {
    const t = i / segments
    const wave = Math.sin(t * Math.PI * 4) * amplitude * (1 - t * 0.5)
    const x = start.x + dx * t + perpX * wave
    const y = start.y + dy * t + perpY * wave
    points.push(`L ${x} ${y}`)
  }

  return points.join(' ')
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
