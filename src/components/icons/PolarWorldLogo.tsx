/**
 * PolarWorldLogo - 偏振光下的新世界 Logo
 * A New World Under Polarized Light - Main brand logo
 *
 * Design concept:
 * - Clean, modern design representing polarized light discovery
 * - A stylized "P" shape formed by intersecting light beams
 * - Represents the transformation of light through polarization
 * - Vibrant gradient colors representing different polarization states
 */

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface PolarWorldLogoProps {
  className?: string
  size?: number
  animated?: boolean
  theme?: 'dark' | 'light'
  showText?: boolean
}

export function PolarWorldLogo({
  className,
  size = 120,
  animated = true,
  theme = 'dark',
  showText = false
}: PolarWorldLogoProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!animated) return
    const interval = setInterval(() => {
      setPhase(p => (p + 2) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [animated])

  // Color palette representing polarization states
  const colors = {
    primary: '#22d3ee',    // Cyan - horizontal polarization
    secondary: '#8b5cf6',  // Violet - vertical polarization
    accent: '#f59e0b',     // Orange - 45° polarization
    highlight: '#ec4899',  // Pink - circular polarization
    glow: theme === 'dark' ? 'rgba(34, 211, 238, 0.4)' : 'rgba(34, 211, 238, 0.3)',
  }

  // Dynamic color cycling for the animated gradient
  const gradientAngle = animated ? phase : 0

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="transition-all duration-300"
      >
        <defs>
          {/* Main gradient */}
          <linearGradient
            id="pw-main-grad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientTransform={`rotate(${gradientAngle}, 0.5, 0.5)`}
          >
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="50%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.highlight} />
          </linearGradient>

          {/* Glow filter */}
          <filter id="pw-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft glow for background */}
          <filter id="pw-soft-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
          </filter>
        </defs>

        {/* Background glow effect */}
        {animated && (
          <circle
            cx="50"
            cy="50"
            r="35"
            fill={colors.glow}
            filter="url(#pw-soft-glow)"
            opacity={0.5 + 0.2 * Math.sin(phase * Math.PI / 180)}
          />
        )}

        {/* Main logo shape - stylized lens/prism with light beam */}
        <g filter="url(#pw-glow)">
          {/* Outer ring - represents the polarizer/lens */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#pw-main-grad)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Inner arc - represents light passing through */}
          <path
            d="M 25 50 Q 50 20 75 50"
            fill="none"
            stroke={colors.primary}
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Diverging beams after polarization - 3 colors representing different states */}
          <g>
            {/* Central beam */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="85"
              stroke={colors.primary}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Left beam - shifted polarization */}
            <line
              x1="50"
              y1="50"
              x2="28"
              y2="78"
              stroke={colors.secondary}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Right beam - shifted polarization */}
            <line
              x1="50"
              y1="50"
              x2="72"
              y2="78"
              stroke={colors.accent}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>

          {/* Central focus point - where polarization happens */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill={theme === 'dark' ? '#ffffff' : '#1e293b'}
            className={animated ? 'animate-pulse' : ''}
          />
          <circle
            cx="50"
            cy="50"
            r="4"
            fill="url(#pw-main-grad)"
          />
        </g>
      </svg>

      {/* Optional text label */}
      {showText && (
        <div className={cn(
          'absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          偏振光下的新世界
        </div>
      )}
    </div>
  )
}
