/**
 * LightBeamEffect - 光束特效组件
 * 从主Logo发射偏振光束到悬停的模块的图标上，产生柔和的光学效果
 *
 * Design concept:
 * - Light beams emanate from central logo (light source)
 * - Beams animate slowly and softly towards hovered module's icon
 * - Module icons glow/pulse in response, avoiding information coverage
 */

import { useRef, useEffect, useState, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

// Module color mapping for beam effects
const MODULE_COLORS: Record<string, string> = {
  chronicles: '#C9A227',        // Warm Amber
  opticalDesignStudio: '#6366F1', // Indigo
  formulaLab: '#0891B2',        // Deep Cyan
  polarquest: '#F59E0B',        // Warm Orange
  creativeLab: '#EC4899',       // Vivid Pink
  labGroup: '#10B981',          // Bright Emerald
}

interface Position {
  x: number
  y: number
}

interface LightBeamEffectProps {
  logoRef: React.RefObject<HTMLDivElement | null>
  hoveredModule: string | null
  moduleRefs: Map<string, HTMLDivElement | null>
  iconRefs?: Map<string, HTMLDivElement | null>
}

// Individual beam particle for soft animation
interface BeamParticle {
  id: number
  progress: number
  opacity: number
}

export function LightBeamEffect({ logoRef, hoveredModule, moduleRefs, iconRefs }: LightBeamEffectProps) {
  useTheme() // Keep hook for consistency but theme not used in simplified version
  const svgRef = useRef<SVGSVGElement>(null)
  const [logoPos, setLogoPos] = useState<Position>({ x: 0, y: 0 })
  const [targetPos, setTargetPos] = useState<Position>({ x: 0, y: 0 })
  const [particles, setParticles] = useState<BeamParticle[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [beamOpacity, setBeamOpacity] = useState(0)
  const animationRef = useRef<number | null>(null)
  const particleIdRef = useRef(0)

  // Calculate positions when hover changes - prioritize icon position
  const updatePositions = useCallback(() => {
    if (!logoRef.current) return

    const logoRect = logoRef.current.getBoundingClientRect()
    const newLogoPos = {
      x: logoRect.left + logoRect.width / 2,
      y: logoRect.top + logoRect.height / 2,
    }
    setLogoPos(newLogoPos)

    if (hoveredModule) {
      // First try to get icon position, fall back to module card position
      const iconRef = iconRefs?.get(hoveredModule)
      const moduleRef = moduleRefs.get(hoveredModule)

      if (iconRef) {
        // Target the icon specifically
        const iconRect = iconRef.getBoundingClientRect()
        setTargetPos({
          x: iconRect.left + iconRect.width / 2,
          y: iconRect.top + iconRect.height / 2,
        })
      } else if (moduleRef) {
        // Fall back to top area of card (where icon is)
        const moduleRect = moduleRef.getBoundingClientRect()
        setTargetPos({
          x: moduleRect.left + moduleRect.width / 2,
          y: moduleRect.top + 48, // Target icon area at top
        })
      }
    }
  }, [logoRef, hoveredModule, moduleRefs, iconRefs])

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

  // Smooth fade in/out of beam
  useEffect(() => {
    if (hoveredModule) {
      // Fade in
      const fadeIn = setInterval(() => {
        setBeamOpacity(prev => Math.min(prev + 0.1, 1))
      }, 50)

      setTimeout(() => clearInterval(fadeIn), 500)

      return () => clearInterval(fadeIn)
    } else {
      // Fade out
      const fadeOut = setInterval(() => {
        setBeamOpacity(prev => {
          if (prev <= 0.1) {
            clearInterval(fadeOut)
            return 0
          }
          return prev - 0.15
        })
      }, 30)

      return () => clearInterval(fadeOut)
    }
  }, [hoveredModule])

  // Animate beam particles - slower and softer
  useEffect(() => {
    if (hoveredModule) {
      setIsAnimating(true)

      // Create new particles at slower interval for softer effect
      const createParticle = () => {
        setParticles(prev => [
          ...prev.slice(-8), // Keep fewer particles
          {
            id: particleIdRef.current++,
            progress: 0,
            opacity: 0.6 + Math.random() * 0.3,
          },
        ])
      }

      // Slower particle creation (200ms instead of 80ms)
      const intervalId = setInterval(createParticle, 200)

      // Animate particles with slower movement
      const animate = () => {
        setParticles(prev =>
          prev
            .map(p => ({ ...p, progress: p.progress + 0.012 })) // Slower speed
            .filter(p => p.progress < 1.1)
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
      // Keep animating briefly during fade out
      if (beamOpacity > 0) {
        const animate = () => {
          setParticles(prev =>
            prev
              .map(p => ({ ...p, progress: p.progress + 0.015 }))
              .filter(p => p.progress < 1.1)
          )
          if (beamOpacity > 0) {
            animationRef.current = requestAnimationFrame(animate)
          }
        }
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
        setParticles([])
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [hoveredModule, beamOpacity])

  if (!isAnimating && beamOpacity <= 0) return null

  const moduleColor = MODULE_COLORS[hoveredModule || ''] || '#22d3ee'

  // Calculate beam path
  const dx = targetPos.x - logoPos.x
  const dy = targetPos.y - logoPos.y

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ width: '100vw', height: '100vh' }}
    >
      <defs>
        {/* Soft beam gradient - fades along the path */}
        <linearGradient id="beam-soft-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={moduleColor} stopOpacity="0.4" />
          <stop offset="40%" stopColor={moduleColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={moduleColor} stopOpacity="0.1" />
        </linearGradient>

        {/* Very soft glow filter */}
        <filter id="beam-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Particle soft glow */}
        <filter id="particle-soft-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main soft beam line - very subtle */}
      <line
        x1={logoPos.x}
        y1={logoPos.y}
        x2={targetPos.x}
        y2={targetPos.y}
        stroke={moduleColor}
        strokeWidth="3"
        strokeOpacity={0.12 * beamOpacity}
        filter="url(#beam-soft-glow)"
        strokeLinecap="round"
      />

      {/* Soft flowing particles along beam */}
      {particles.map(particle => {
        const progress = Math.min(particle.progress, 1)

        // Calculate particle position along beam with slight curve
        const curveOffset = Math.sin(progress * Math.PI) * 3
        const x = logoPos.x + dx * progress + curveOffset * (-dy / Math.sqrt(dx*dx + dy*dy || 1))
        const y = logoPos.y + dy * progress + curveOffset * (dx / Math.sqrt(dx*dx + dy*dy || 1))

        // Soft particle appearance - grows and fades
        const sizeProgress = Math.sin(progress * Math.PI)
        const size = 3 + sizeProgress * 5
        const opacity = sizeProgress * particle.opacity * beamOpacity * 0.5

        return (
          <circle
            key={particle.id}
            cx={x}
            cy={y}
            r={size}
            fill={moduleColor}
            opacity={opacity}
            filter="url(#particle-soft-glow)"
          />
        )
      })}

      {/* Subtle source glow at logo - very soft pulse */}
      <circle
        cx={logoPos.x}
        cy={logoPos.y}
        r="15"
        fill={moduleColor}
        opacity={0.15 * beamOpacity}
        filter="url(#beam-soft-glow)"
      />

      {/* Very subtle target glow at icon - just a hint */}
      <circle
        cx={targetPos.x}
        cy={targetPos.y}
        r="20"
        fill={moduleColor}
        opacity={0.1 * beamOpacity}
        filter="url(#beam-soft-glow)"
      />
    </svg>
  )
}
