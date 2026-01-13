/**
 * PolarWorldLogo - 偏振光下的新世界 Logo
 * A New World Under Polarized Light - Main brand logo
 *
 * Design concept:
 * - Bold, impactful design with strong visual presence
 * - Central crystal prism with colorful light beams
 * - Animated glow effects for dynamic feel
 * - Clean and memorable silhouette
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
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (!animated) return
    const interval = setInterval(() => {
      setRotation(r => (r + 0.3) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [animated])

  // Vibrant polarization colors
  const colors = {
    cyan: '#22d3ee',
    blue: '#3b82f6',
    violet: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f59e0b',
    center: theme === 'dark' ? '#ffffff' : '#0f172a',
  }

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        className="transition-all duration-300"
      >
        <defs>
          {/* Central prism gradient */}
          <linearGradient id="pw-prism-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.cyan} />
            <stop offset="33%" stopColor={colors.blue} />
            <stop offset="66%" stopColor={colors.violet} />
            <stop offset="100%" stopColor={colors.pink} />
          </linearGradient>

          {/* Glow filter */}
          <filter id="pw-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Intense glow for center */}
          <filter id="pw-intense-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ring gradient */}
          <linearGradient id="pw-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.cyan} />
            <stop offset="25%" stopColor={colors.blue} />
            <stop offset="50%" stopColor={colors.violet} />
            <stop offset="75%" stopColor={colors.pink} />
            <stop offset="100%" stopColor={colors.cyan} />
          </linearGradient>
        </defs>

        {/* Outer rotating ring */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '60px 60px' }}>
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke="url(#pw-ring-grad)"
            strokeWidth="2"
            strokeDasharray="8 4"
            opacity="0.5"
          />
        </g>

        {/* Inner counter-rotating ring */}
        <g style={{ transform: `rotate(${-rotation * 0.7}deg)`, transformOrigin: '60px 60px' }}>
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="url(#pw-ring-grad)"
            strokeWidth="1.5"
            strokeDasharray="12 6"
            opacity="0.3"
          />
        </g>

        {/* Light beams - bold and impactful */}
        <g filter="url(#pw-glow)">
          {/* Horizontal beam - cyan */}
          <line x1="5" y1="60" x2="115" y2="60" stroke={colors.cyan} strokeWidth="6" strokeLinecap="round" />

          {/* Vertical beam - violet */}
          <line x1="60" y1="5" x2="60" y2="115" stroke={colors.violet} strokeWidth="6" strokeLinecap="round" />

          {/* Diagonal beam 1 - pink */}
          <line x1="15" y1="105" x2="105" y2="15" stroke={colors.pink} strokeWidth="4" strokeLinecap="round" opacity="0.9" />

          {/* Diagonal beam 2 - orange */}
          <line x1="15" y1="15" x2="105" y2="105" stroke={colors.orange} strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        </g>

        {/* Central crystal prism */}
        <g filter="url(#pw-intense-glow)">
          <path
            d="M60 30 L80 44 L80 76 L60 90 L40 76 L40 44 Z"
            fill="url(#pw-prism-grad)"
            opacity="0.95"
          />
          {/* Inner highlight */}
          <path
            d="M60 40 L70 48 L70 72 L60 80 L50 72 L50 48 Z"
            fill={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.6)'}
          />
        </g>

        {/* Bright center core */}
        <circle
          cx="60"
          cy="60"
          r="12"
          fill={colors.center}
          filter="url(#pw-intense-glow)"
          className={animated ? 'animate-pulse' : ''}
          opacity="0.95"
        />
      </svg>

      {/* Optional text label */}
      {showText && (
        <div className={cn(
          'absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          PolarCraft
        </div>
      )}
    </div>
  )
}
