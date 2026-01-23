/**
 * LightBeamEffect - 光束特效组件
 * 从主Logo发射偏振光束跟随鼠标移动，产生柔和的光学效果
 *
 * Design concept:
 * - Light beams emanate from central logo (light source)
 * - Beams follow mouse cursor with smooth animation
 * - Creates polarization color cycling effect based on angle
 */

import { useRef, useEffect, useState, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

// Polarization colors based on angle (physics-based)
const POLARIZATION_COLORS = [
  '#ff4444', // 0° - Red
  '#ffaa00', // 45° - Orange
  '#44ff44', // 90° - Green
  '#4488ff', // 135° - Blue
]

interface Position {
  x: number
  y: number
}

interface LightBeamEffectProps {
  logoRef: React.RefObject<HTMLDivElement | null>
  /** Container ref to constrain beam effect area */
  containerRef?: React.RefObject<HTMLDivElement | null>
}

// Individual beam particle for soft animation
interface BeamParticle {
  id: number
  progress: number
  opacity: number
  color: string
}

// Get polarization color based on angle
function getPolarizationColor(angle: number): string {
  // Normalize angle to 0-180 range (polarization is symmetric)
  const normalizedAngle = ((angle % 180) + 180) % 180
  const index = Math.floor((normalizedAngle / 45) % 4)
  const nextIndex = (index + 1) % 4
  const fraction = (normalizedAngle % 45) / 45

  // Interpolate between colors
  const color1 = POLARIZATION_COLORS[index]
  const color2 = POLARIZATION_COLORS[nextIndex]

  // Simple hex color interpolation
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)
  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)

  const r = Math.round(r1 + (r2 - r1) * fraction)
  const g = Math.round(g1 + (g2 - g1) * fraction)
  const b = Math.round(b1 + (b2 - b1) * fraction)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function LightBeamEffect({ logoRef, containerRef }: LightBeamEffectProps) {
  const { theme } = useTheme()
  const svgRef = useRef<SVGSVGElement>(null)
  const [logoPos, setLogoPos] = useState<Position>({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 })
  const [particles, setParticles] = useState<BeamParticle[]>([])
  const [isActive, setIsActive] = useState(false)
  const [beamOpacity, setBeamOpacity] = useState(0)
  const animationRef = useRef<number | null>(null)
  const particleIdRef = useRef(0)
  const lastMouseMoveRef = useRef<number>(0)

  // Calculate logo center position
  const updateLogoPosition = useCallback(() => {
    if (!logoRef.current) return

    const logoRect = logoRef.current.getBoundingClientRect()
    setLogoPos({
      x: logoRect.left + logoRect.width / 2,
      y: logoRect.top + logoRect.height / 2,
    })
  }, [logoRef])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Check if mouse is within container bounds if containerRef provided
      if (containerRef?.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const isInContainer =
          e.clientX >= containerRect.left &&
          e.clientX <= containerRect.right &&
          e.clientY >= containerRect.top &&
          e.clientY <= containerRect.bottom

        if (!isInContainer) {
          setIsActive(false)
          return
        }
      }

      setMousePos({ x: e.clientX, y: e.clientY })
      setIsActive(true)
      lastMouseMoveRef.current = Date.now()
    }

    const handleMouseLeave = () => {
      setIsActive(false)
    }

    updateLogoPosition()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', updateLogoPosition)
    window.addEventListener('scroll', updateLogoPosition, true)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', updateLogoPosition)
      window.removeEventListener('scroll', updateLogoPosition, true)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [updateLogoPosition, containerRef])

  // Auto-hide beam after inactivity
  useEffect(() => {
    const checkInactivity = setInterval(() => {
      if (Date.now() - lastMouseMoveRef.current > 2000) {
        setIsActive(false)
      }
    }, 500)

    return () => clearInterval(checkInactivity)
  }, [])

  // Smooth fade in/out of beam
  useEffect(() => {
    if (isActive) {
      // Fade in
      const fadeIn = setInterval(() => {
        setBeamOpacity(prev => Math.min(prev + 0.15, 1))
      }, 30)

      setTimeout(() => clearInterval(fadeIn), 300)

      return () => clearInterval(fadeIn)
    } else {
      // Fade out
      const fadeOut = setInterval(() => {
        setBeamOpacity(prev => {
          if (prev <= 0.05) {
            clearInterval(fadeOut)
            return 0
          }
          return prev - 0.08
        })
      }, 30)

      return () => clearInterval(fadeOut)
    }
  }, [isActive])

  // Calculate beam angle for color
  const dx = mousePos.x - logoPos.x
  const dy = mousePos.y - logoPos.y
  const beamAngle = Math.atan2(dy, dx) * (180 / Math.PI)
  const beamColor = getPolarizationColor(beamAngle + 90) // Offset for visual effect

  // Animate beam particles
  useEffect(() => {
    if (isActive || beamOpacity > 0) {
      // Create new particles
      const createParticle = () => {
        if (!isActive) return

        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
        setParticles(prev => [
          ...prev.slice(-12), // Keep more particles for smoother effect
          {
            id: particleIdRef.current++,
            progress: 0,
            opacity: 0.5 + Math.random() * 0.4,
            color: getPolarizationColor(angle + 90 + (Math.random() - 0.5) * 20),
          },
        ])
      }

      const intervalId = setInterval(createParticle, 120)

      // Animate particles
      const animate = () => {
        setParticles(prev =>
          prev
            .map(p => ({ ...p, progress: p.progress + 0.018 }))
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
      setParticles([])
      return
    }
  }, [isActive, beamOpacity, dx, dy])

  // Don't render if completely hidden
  if (beamOpacity <= 0 && !isActive) return null

  // Calculate distance for beam length limiting
  const distance = Math.sqrt(dx * dx + dy * dy)
  const maxDistance = 600 // Maximum beam length
  const effectiveDistance = Math.min(distance, maxDistance)
  const ratio = distance > 0 ? effectiveDistance / distance : 0

  const targetX = logoPos.x + dx * ratio
  const targetY = logoPos.y + dy * ratio

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ width: '100vw', height: '100vh' }}
    >
      <defs>
        {/* Soft glow filter for beam */}
        <filter id="beam-mouse-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Particle glow */}
        <filter id="particle-mouse-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient along beam path */}
        <linearGradient
          id="beam-mouse-gradient"
          x1={logoPos.x}
          y1={logoPos.y}
          x2={targetX}
          y2={targetY}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={beamColor} stopOpacity="0.5" />
          <stop offset="60%" stopColor={beamColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={beamColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main beam line - soft gradient */}
      <line
        x1={logoPos.x}
        y1={logoPos.y}
        x2={targetX}
        y2={targetY}
        stroke="url(#beam-mouse-gradient)"
        strokeWidth={theme === 'dark' ? 4 : 3}
        strokeOpacity={beamOpacity * 0.6}
        filter="url(#beam-mouse-glow)"
        strokeLinecap="round"
      />

      {/* Secondary beam for more glow effect */}
      <line
        x1={logoPos.x}
        y1={logoPos.y}
        x2={targetX}
        y2={targetY}
        stroke={beamColor}
        strokeWidth={theme === 'dark' ? 2 : 1.5}
        strokeOpacity={beamOpacity * 0.3}
        strokeLinecap="round"
      />

      {/* Particles flowing along beam */}
      {particles.map(particle => {
        const progress = Math.min(particle.progress, 1)

        // Calculate particle position along beam
        const curveOffset = Math.sin(progress * Math.PI) * 4
        const pDx = targetX - logoPos.x
        const pDy = targetY - logoPos.y
        const pDist = Math.sqrt(pDx * pDx + pDy * pDy) || 1

        const x = logoPos.x + pDx * progress + curveOffset * (-pDy / pDist)
        const y = logoPos.y + pDy * progress + curveOffset * (pDx / pDist)

        // Particle appearance - grows and fades
        const sizeProgress = Math.sin(progress * Math.PI)
        const size = 2 + sizeProgress * 6
        const opacity = sizeProgress * particle.opacity * beamOpacity * 0.7

        return (
          <circle
            key={particle.id}
            cx={x}
            cy={y}
            r={size}
            fill={particle.color}
            opacity={opacity}
            filter="url(#particle-mouse-glow)"
          />
        )
      })}

      {/* Source glow at logo */}
      <circle
        cx={logoPos.x}
        cy={logoPos.y}
        r={theme === 'dark' ? 20 : 16}
        fill={beamColor}
        opacity={beamOpacity * 0.2}
        filter="url(#beam-mouse-glow)"
      />

      {/* Subtle cursor glow */}
      <circle
        cx={targetX}
        cy={targetY}
        r={theme === 'dark' ? 12 : 10}
        fill={beamColor}
        opacity={beamOpacity * 0.15}
        filter="url(#particle-mouse-glow)"
      />
    </svg>
  )
}
