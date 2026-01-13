/**
 * PolarizedLightHero - Interactive Polarized Light Demonstration Effect
 * 偏振光演示特效 - 首页顶部动态展示
 *
 * Features:
 * - Animated light wave propagation
 * - Interactive polarizer filter
 * - Real-time intensity calculation (Malus's Law visualization)
 * - Beautiful gradient effects representing different polarization states
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

interface PolarizedLightHeroProps {
  className?: string
  height?: number
}

export function PolarizedLightHero({ className, height = 200 }: PolarizedLightHeroProps) {
  const { theme } = useTheme()
  const [polarizer1Angle, setPolarizer1Angle] = useState(0)
  const [polarizer2Angle, setPolarizer2Angle] = useState(45)
  const [time, setTime] = useState(0)
  const [isDragging, setIsDragging] = useState<1 | 2 | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 2) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  // Calculate transmitted intensity using Malus's Law
  const angleDiff = Math.abs(polarizer2Angle - polarizer1Angle)
  const transmittedIntensity = Math.cos((angleDiff * Math.PI) / 180) ** 2

  // Handle mouse/touch interaction
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent, which: 1 | 2) => {
    e.preventDefault()
    setIsDragging(which)
  }, [])

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX

    // Calculate angle based on x position
    const relativeX = clientX - rect.left
    const angle = Math.round(((relativeX / rect.width) * 180 - 90 + 360) % 180)

    if (isDragging === 1) {
      setPolarizer1Angle(angle)
    } else {
      setPolarizer2Angle(angle)
    }
  }, [isDragging])

  const handleUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleUp)
      window.addEventListener('touchmove', handleMove)
      window.addEventListener('touchend', handleUp)
      return () => {
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleUp)
        window.removeEventListener('touchmove', handleMove)
        window.removeEventListener('touchend', handleUp)
      }
    }
  }, [isDragging, handleMove, handleUp])

  // Get polarization color based on angle
  const getPolarizationColor = (angle: number) => {
    const normalizedAngle = ((angle % 180) + 180) % 180
    if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff3366' // 0° - Red
    if (normalizedAngle < 67.5) return '#ffaa00' // 45° - Orange
    if (normalizedAngle < 112.5) return '#00ff88' // 90° - Green
    return '#4488ff' // 135° - Blue
  }

  // Generate wave path
  const generateWavePath = (
    startX: number,
    endX: number,
    y: number,
    amplitude: number,
    wavelength: number,
    phase: number
  ) => {
    const points: string[] = []
    for (let x = startX; x <= endX; x += 2) {
      const waveY = y + amplitude * Math.sin(((x - startX) / wavelength) * 2 * Math.PI + (phase * Math.PI) / 180)
      points.push(`${x},${waveY}`)
    }
    return `M ${points.join(' L ')}`
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl',
        theme === 'dark' ? 'bg-slate-900/50' : 'bg-white/50',
        className
      )}
      style={{ height }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? `linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(34,211,238,0.1) 50%, rgba(139,92,246,0.1) 100%)`
            : `linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(34,211,238,0.05) 50%, rgba(139,92,246,0.05) 100%)`,
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 200"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Light source gradient */}
          <radialGradient id="hero-light-source" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffaa00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffaa00" stopOpacity="0" />
          </radialGradient>

          {/* Wave gradient based on polarization */}
          <linearGradient id="hero-wave-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getPolarizationColor(polarizer1Angle)} stopOpacity="0.8" />
            <stop offset="100%" stopColor={getPolarizationColor(polarizer1Angle)} stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="hero-wave-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getPolarizationColor(polarizer2Angle)} stopOpacity={transmittedIntensity * 0.8} />
            <stop offset="100%" stopColor={getPolarizationColor(polarizer2Angle)} stopOpacity={transmittedIntensity * 0.3} />
          </linearGradient>

          {/* Polarizer filter pattern */}
          <pattern id="polarizer-lines" width="4" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="2" x2="4" y2="2" stroke={theme === 'dark' ? '#ffffff' : '#000000'} strokeWidth="0.5" opacity="0.3" />
          </pattern>

          {/* Glow filter */}
          <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Light source */}
        <circle cx="50" cy="100" r="30" fill="url(#hero-light-source)" filter="url(#hero-glow)" />
        <circle cx="50" cy="100" r="15" fill="#ffffff" opacity="0.9" />

        {/* Unpolarized light waves (before first polarizer) */}
        <g opacity="0.6">
          {[0, 30, 60, 90, 120, 150].map((angle, i) => (
            <path
              key={`unpol-${i}`}
              d={generateWavePath(80, 230, 100, 15 * Math.cos((angle * Math.PI) / 180), 40, time + angle)}
              fill="none"
              stroke={getPolarizationColor(angle)}
              strokeWidth="2"
              opacity={0.4}
            />
          ))}
        </g>

        {/* First Polarizer */}
        <g
          style={{ cursor: 'grab' }}
          onMouseDown={(e) => handleInteraction(e, 1)}
          onTouchStart={(e) => handleInteraction(e, 1)}
        >
          <rect
            x="230"
            y="40"
            width="40"
            height="120"
            fill={theme === 'dark' ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)'}
            stroke={getPolarizationColor(polarizer1Angle)}
            strokeWidth="2"
            rx="4"
          />
          {/* Polarizer lines */}
          <g transform={`rotate(${polarizer1Angle}, 250, 100)`}>
            {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((offset) => (
              <line
                key={`p1-${offset}`}
                x1="235"
                y1={100 + offset}
                x2="265"
                y2={100 + offset}
                stroke={getPolarizationColor(polarizer1Angle)}
                strokeWidth="2"
                opacity="0.6"
              />
            ))}
          </g>
          <text
            x="250"
            y="175"
            textAnchor="middle"
            className={cn('text-xs font-medium', subTextColor)}
            fill="currentColor"
          >
            P1: {polarizer1Angle}°
          </text>
        </g>

        {/* Polarized light (between polarizers) */}
        <g opacity="0.8" filter="url(#hero-glow)">
          <path
            d={generateWavePath(280, 480, 100, 20, 50, time)}
            fill="none"
            stroke="url(#hero-wave-1)"
            strokeWidth="3"
          />
          {/* E-field oscillation indicator */}
          <g transform={`rotate(${polarizer1Angle}, 380, 100)`}>
            <line
              x1="380"
              y1={100 - 25 * Math.sin((time * Math.PI) / 180)}
              x2="380"
              y2={100 + 25 * Math.sin((time * Math.PI) / 180)}
              stroke={getPolarizationColor(polarizer1Angle)}
              strokeWidth="2"
              opacity="0.8"
            />
          </g>
        </g>

        {/* Second Polarizer (Analyzer) */}
        <g
          style={{ cursor: 'grab' }}
          onMouseDown={(e) => handleInteraction(e, 2)}
          onTouchStart={(e) => handleInteraction(e, 2)}
        >
          <rect
            x="480"
            y="40"
            width="40"
            height="120"
            fill={theme === 'dark' ? 'rgba(34,211,238,0.2)' : 'rgba(34,211,238,0.1)'}
            stroke={getPolarizationColor(polarizer2Angle)}
            strokeWidth="2"
            rx="4"
          />
          {/* Polarizer lines */}
          <g transform={`rotate(${polarizer2Angle}, 500, 100)`}>
            {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((offset) => (
              <line
                key={`p2-${offset}`}
                x1="485"
                y1={100 + offset}
                x2="515"
                y2={100 + offset}
                stroke={getPolarizationColor(polarizer2Angle)}
                strokeWidth="2"
                opacity="0.6"
              />
            ))}
          </g>
          <text
            x="500"
            y="175"
            textAnchor="middle"
            className={cn('text-xs font-medium', subTextColor)}
            fill="currentColor"
          >
            P2: {polarizer2Angle}°
          </text>
        </g>

        {/* Transmitted light (after analyzer) */}
        {transmittedIntensity > 0.01 && (
          <g opacity={transmittedIntensity} filter="url(#hero-glow)">
            <path
              d={generateWavePath(530, 750, 100, 20 * transmittedIntensity, 50, time)}
              fill="none"
              stroke="url(#hero-wave-2)"
              strokeWidth={3 * transmittedIntensity}
            />
          </g>
        )}

        {/* Detector/Screen */}
        <rect
          x="750"
          y="60"
          width="30"
          height="80"
          fill={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
          stroke={theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}
          strokeWidth="1"
          rx="4"
        />
        {/* Detected light indicator */}
        <rect
          x="755"
          y="65"
          width="20"
          height="70"
          fill={getPolarizationColor(polarizer2Angle)}
          opacity={transmittedIntensity * 0.8}
          rx="2"
        />
      </svg>

      {/* Overlay info */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
        <div className={cn('text-xs', subTextColor)}>
          <span className="opacity-70">Drag polarizers to adjust • </span>
          <span className={textColor}>Malus's Law: I = I₀ cos²θ</span>
        </div>
        <div className={cn(
          'px-3 py-1 rounded-full text-xs font-medium',
          theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
        )}>
          Intensity: {Math.round(transmittedIntensity * 100)}%
        </div>
      </div>

      {/* Angle indicator */}
      <div className={cn(
        'absolute top-3 right-4 px-3 py-1 rounded-full text-xs',
        theme === 'dark' ? 'bg-slate-800/80 text-gray-300' : 'bg-white/80 text-gray-600'
      )}>
        Δθ = {Math.abs(polarizer2Angle - polarizer1Angle)}°
      </div>
    </div>
  )
}

export default PolarizedLightHero
