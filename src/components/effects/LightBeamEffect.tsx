/**
 * LightBeamEffect - 光束特效组件
 * 从主Logo发射偏振光束到悬停的模块，模拟不同光学效果
 *
 * Design concept:
 * - Light beams emanate from central logo (light source)
 * - Beams animate towards hovered module with polarization colors
 * - Each module type reacts differently (filter, split, rotate, etc.)
 */

import { useRef, useEffect, useState, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

// Polarization colors matching the game physics
const POLARIZATION_COLORS = {
  deg0: '#ff4444',    // 0° - Red (horizontal)
  deg45: '#ffaa00',   // 45° - Orange
  deg90: '#44ff44',   // 90° - Green (vertical)
  deg135: '#4488ff',  // 135° - Blue
}

// Module color mapping for beam effects
const MODULE_COLORS: Record<string, string> = {
  chronicles: '#C9A227',        // Warm Amber
  opticalDesignStudio: '#6366F1', // Indigo
  formulaLab: '#0891B2',        // Deep Cyan
  polarquest: '#F59E0B',        // Warm Orange
  creativeLab: '#EC4899',       // Vivid Pink
  labGroup: '#10B981',          // Bright Emerald
}

// Optical effect types for each module
type OpticalEffect = 'absorb' | 'split' | 'transmit' | 'refract' | 'interfere' | 'rotate'

const MODULE_EFFECTS: Record<string, OpticalEffect> = {
  chronicles: 'absorb',         // Light absorbed through amber glass (history)
  opticalDesignStudio: 'split', // Light splits like beam splitter
  formulaLab: 'transmit',       // Light transmits through polarizer
  polarquest: 'refract',        // Light refracts like prism
  creativeLab: 'interfere',     // Light creates interference (art)
  labGroup: 'rotate',           // Light rotates polarization (wave plate)
}

interface Position {
  x: number
  y: number
}

interface LightBeamEffectProps {
  logoRef: React.RefObject<HTMLDivElement | null>
  hoveredModule: string | null
  moduleRefs: Map<string, HTMLDivElement | null>
}

// Individual beam particle for animation
interface BeamParticle {
  id: number
  progress: number
  color: string
  offset: number
}

export function LightBeamEffect({ logoRef, hoveredModule, moduleRefs }: LightBeamEffectProps) {
  const { theme } = useTheme()
  const svgRef = useRef<SVGSVGElement>(null)
  const [logoPos, setLogoPos] = useState<Position>({ x: 0, y: 0 })
  const [targetPos, setTargetPos] = useState<Position>({ x: 0, y: 0 })
  const [particles, setParticles] = useState<BeamParticle[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const particleIdRef = useRef(0)

  // Calculate positions when hover changes
  const updatePositions = useCallback(() => {
    if (!logoRef.current) return

    const logoRect = logoRef.current.getBoundingClientRect()
    const newLogoPos = {
      x: logoRect.left + logoRect.width / 2,
      y: logoRect.top + logoRect.height / 2,
    }
    setLogoPos(newLogoPos)

    if (hoveredModule) {
      const moduleRef = moduleRefs.get(hoveredModule)
      if (moduleRef) {
        const moduleRect = moduleRef.getBoundingClientRect()
        setTargetPos({
          x: moduleRect.left + moduleRect.width / 2,
          y: moduleRect.top + moduleRect.height / 2,
        })
      }
    }
  }, [logoRef, hoveredModule, moduleRefs])

  // Update positions on hover change and scroll/resize
  useEffect(() => {
    updatePositions()

    const handleScroll = () => updatePositions()
    const handleResize = () => updatePositions()

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [updatePositions])

  // Animate beam particles
  useEffect(() => {
    if (hoveredModule) {
      setIsAnimating(true)

      // Create new particles continuously
      const createParticle = () => {
        const colors = Object.values(POLARIZATION_COLORS)
        const effect = MODULE_EFFECTS[hoveredModule] || 'transmit'

        // Different particle patterns based on effect
        let newParticles: BeamParticle[] = []

        if (effect === 'split') {
          // Create multiple beams that split
          newParticles = [
            { id: particleIdRef.current++, progress: 0, color: colors[0], offset: 0 },
            { id: particleIdRef.current++, progress: 0, color: colors[2], offset: 15 },
            { id: particleIdRef.current++, progress: 0, color: colors[3], offset: -15 },
          ]
        } else if (effect === 'interfere') {
          // Create interfering wave pattern
          newParticles = [
            { id: particleIdRef.current++, progress: 0, color: colors[1], offset: Math.sin(Date.now() / 200) * 10 },
            { id: particleIdRef.current++, progress: 0, color: colors[3], offset: Math.cos(Date.now() / 200) * 10 },
          ]
        } else {
          // Single beam with module color
          const moduleColor = MODULE_COLORS[hoveredModule] || '#22d3ee'
          newParticles = [
            { id: particleIdRef.current++, progress: 0, color: moduleColor, offset: 0 },
          ]
        }

        setParticles(prev => [...prev.slice(-20), ...newParticles])
      }

      const intervalId = setInterval(createParticle, 80)

      // Animate particles
      const animate = () => {
        setParticles(prev =>
          prev
            .map(p => ({ ...p, progress: p.progress + 0.03 }))
            .filter(p => p.progress < 1.2)
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
    } else {
      setIsAnimating(false)
      setParticles([])
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [hoveredModule])

  if (!hoveredModule || !isAnimating) return null

  const effect = MODULE_EFFECTS[hoveredModule] || 'transmit'
  const moduleColor = MODULE_COLORS[hoveredModule] || '#22d3ee'

  // Calculate beam path
  const dx = targetPos.x - logoPos.x
  const dy = targetPos.y - logoPos.y
  const angle = Math.atan2(dy, dx)

  // Perpendicular offset direction
  const perpX = -Math.sin(angle)
  const perpY = Math.cos(angle)

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ width: '100vw', height: '100vh' }}
    >
      <defs>
        {/* Main beam gradient */}
        <linearGradient id="beam-main-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={moduleColor} stopOpacity="0.8" />
          <stop offset="50%" stopColor={moduleColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={moduleColor} stopOpacity="0" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="beam-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Particle glow */}
        <filter id="particle-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main beam line (subtle background) */}
      <line
        x1={logoPos.x}
        y1={logoPos.y}
        x2={targetPos.x}
        y2={targetPos.y}
        stroke={moduleColor}
        strokeWidth="2"
        strokeOpacity="0.2"
        filter="url(#beam-glow)"
      />

      {/* Animated wave pattern along beam */}
      {effect === 'transmit' && (
        <path
          d={generateWavePath(logoPos, targetPos, Date.now() / 500)}
          fill="none"
          stroke={moduleColor}
          strokeWidth="2"
          strokeOpacity="0.4"
          filter="url(#beam-glow)"
        />
      )}

      {/* Particle trails */}
      {particles.map(particle => {
        const progress = Math.min(particle.progress, 1)

        // Calculate particle position along beam
        let x = logoPos.x + dx * progress + perpX * particle.offset
        let y = logoPos.y + dy * progress + perpY * particle.offset

        // Apply effect-specific modifications
        if (effect === 'refract' && progress > 0.6) {
          // Bend light after midpoint (prism effect)
          const bendProgress = (progress - 0.6) / 0.4
          x += Math.sin(bendProgress * Math.PI) * 30 * (particle.offset > 0 ? 1 : -1)
        }

        if (effect === 'rotate' && progress > 0.5) {
          // Spiral rotation effect
          const rotateProgress = (progress - 0.5) * 2
          const spiralAngle = rotateProgress * Math.PI * 2
          x += Math.cos(spiralAngle) * 10 * rotateProgress
          y += Math.sin(spiralAngle) * 10 * rotateProgress
        }

        // Particle size and opacity based on progress
        const size = 4 + Math.sin(progress * Math.PI) * 4
        const opacity = Math.sin(progress * Math.PI) * 0.9

        return (
          <g key={particle.id}>
            {/* Particle core */}
            <circle
              cx={x}
              cy={y}
              r={size}
              fill={particle.color}
              opacity={opacity}
              filter="url(#particle-glow)"
            />

            {/* Particle trail */}
            {progress > 0.05 && (
              <line
                x1={x - dx * 0.05}
                y1={y - dy * 0.05}
                x2={x}
                y2={y}
                stroke={particle.color}
                strokeWidth={size * 0.8}
                strokeOpacity={opacity * 0.5}
                strokeLinecap="round"
                filter="url(#beam-glow)"
              />
            )}
          </g>
        )
      })}

      {/* Effect-specific decorations at target */}
      {renderEffectDecoration(effect, targetPos, moduleColor, theme)}

      {/* Source glow at logo */}
      <circle
        cx={logoPos.x}
        cy={logoPos.y}
        r="20"
        fill={moduleColor}
        opacity="0.3"
        filter="url(#beam-glow)"
        style={{
          animation: 'pulse 1s ease-in-out infinite',
        }}
      />
    </svg>
  )
}

// Generate sine wave path along beam
function generateWavePath(start: Position, end: Position, time: number): string {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const angle = Math.atan2(dy, dx)

  const perpX = -Math.sin(angle)
  const perpY = Math.cos(angle)

  const points: string[] = []
  const segments = 30

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const baseX = start.x + dx * t
    const baseY = start.y + dy * t

    // Sine wave oscillation
    const wave = Math.sin(t * Math.PI * 4 + time) * 8 * (1 - Math.abs(t - 0.5) * 2)
    const x = baseX + perpX * wave
    const y = baseY + perpY * wave

    if (i === 0) {
      points.push(`M ${x} ${y}`)
    } else {
      points.push(`L ${x} ${y}`)
    }
  }

  return points.join(' ')
}

// Render effect-specific decorations at target module
function renderEffectDecoration(
  effect: OpticalEffect,
  pos: Position,
  color: string,
  _theme: 'dark' | 'light'
) {
  switch (effect) {
    case 'absorb':
      // Warm glow absorption effect
      return (
        <g>
          <circle
            cx={pos.x}
            cy={pos.y}
            r="40"
            fill={color}
            opacity="0.15"
            filter="url(#beam-glow)"
          />
          <circle
            cx={pos.x}
            cy={pos.y}
            r="25"
            fill={color}
            opacity="0.25"
            style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
          />
        </g>
      )

    case 'split':
      // Beam splitter effect - multiple diverging lines
      return (
        <g filter="url(#beam-glow)">
          {[0, 45, 90, 135].map((angle, i) => (
            <line
              key={angle}
              x1={pos.x}
              y1={pos.y}
              x2={pos.x + Math.cos((angle * Math.PI) / 180) * 40}
              y2={pos.y + Math.sin((angle * Math.PI) / 180) * 40}
              stroke={Object.values(POLARIZATION_COLORS)[i]}
              strokeWidth="3"
              strokeOpacity="0.6"
              strokeLinecap="round"
            />
          ))}
          <circle cx={pos.x} cy={pos.y} r="8" fill={color} opacity="0.5" />
        </g>
      )

    case 'transmit':
      // Polarizer transmission - intensity bars
      return (
        <g filter="url(#beam-glow)">
          <rect
            x={pos.x - 25}
            y={pos.y - 30}
            width="50"
            height="60"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.3"
            rx="4"
          />
          {/* Polarizer lines */}
          {[-20, -10, 0, 10, 20].map(offset => (
            <line
              key={offset}
              x1={pos.x + offset}
              y1={pos.y - 25}
              x2={pos.x + offset}
              y2={pos.y + 25}
              stroke={color}
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
          ))}
        </g>
      )

    case 'refract':
      // Prism refraction - rainbow dispersion
      return (
        <g filter="url(#beam-glow)">
          {/* Prism shape */}
          <path
            d={`M ${pos.x} ${pos.y - 35} L ${pos.x + 30} ${pos.y + 20} L ${pos.x - 30} ${pos.y + 20} Z`}
            fill={color}
            fillOpacity="0.2"
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.5"
          />
          {/* Rainbow dispersion */}
          {['#ff4444', '#ff8844', '#ffff44', '#44ff44', '#4488ff'].map((c, i) => (
            <line
              key={i}
              x1={pos.x}
              y1={pos.y}
              x2={pos.x + 35 + i * 5}
              y2={pos.y + 30 + i * 8}
              stroke={c}
              strokeWidth="2"
              strokeOpacity="0.6"
            />
          ))}
        </g>
      )

    case 'interfere':
      // Interference pattern - concentric rings
      return (
        <g filter="url(#beam-glow)">
          {[15, 30, 45].map((r, i) => (
            <circle
              key={r}
              cx={pos.x}
              cy={pos.y}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeOpacity={0.5 - i * 0.15}
              style={{
                animation: `ripple ${1.5 + i * 0.3}s ease-out infinite`,
              }}
            />
          ))}
        </g>
      )

    case 'rotate':
      // Wave plate rotation - spinning indicator
      return (
        <g filter="url(#beam-glow)">
          <circle
            cx={pos.x}
            cy={pos.y}
            r="30"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.3"
            strokeDasharray="8 4"
            style={{
              animation: 'spin 3s linear infinite',
              transformOrigin: `${pos.x}px ${pos.y}px`,
            }}
          />
          {/* Rotation arrows */}
          <path
            d={`M ${pos.x + 20} ${pos.y - 10} A 25 25 0 0 1 ${pos.x + 10} ${pos.y + 20}`}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeOpacity="0.6"
            markerEnd="url(#arrow)"
            style={{
              animation: 'spin 2s linear infinite',
              transformOrigin: `${pos.x}px ${pos.y}px`,
            }}
          />
        </g>
      )

    default:
      return null
  }
}
