/**
 * PolarCraft Logo - Main brand logo
 * PolarCraft 标志 - 简洁有冲击力的品牌标志
 *
 * Design concept:
 * - Clean, bold design with strong visual impact
 * - Central prism splitting light into polarization colors
 * - Minimal elements for maximum recognition
 */

import { cn } from '@/lib/utils'

interface PolarCraftLogoProps {
  className?: string
  size?: number
  animated?: boolean
  theme?: 'dark' | 'light'
}

export function PolarCraftLogo({
  className,
  size = 80,
  animated = true,
  theme = 'dark'
}: PolarCraftLogoProps) {
  // Polarization colors - vibrant and distinct
  const colors = {
    cyan: '#22d3ee',
    violet: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f59e0b',
    center: theme === 'dark' ? '#ffffff' : '#0f172a',
    glow: theme === 'dark' ? 'rgba(34, 211, 238, 0.6)' : 'rgba(8, 145, 178, 0.4)',
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        {/* Gradient for center prism */}
        <linearGradient id="prism-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.cyan} />
          <stop offset="50%" stopColor={colors.violet} />
          <stop offset="100%" stopColor={colors.pink} />
        </linearGradient>

        {/* Glow filter */}
        <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Strong glow for center */}
        <filter id="center-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Light beams radiating from center - simplified to 4 main beams */}
      <g filter="url(#logo-glow)">
        {/* Horizontal beam - cyan */}
        <line
          x1="10"
          y1="50"
          x2="90"
          y2="50"
          stroke={colors.cyan}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Vertical beam - violet */}
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke={colors.violet}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Diagonal beam 1 - pink */}
        <line
          x1="18"
          y1="82"
          x2="82"
          y2="18"
          stroke={colors.pink}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Diagonal beam 2 - orange */}
        <line
          x1="18"
          y1="18"
          x2="82"
          y2="82"
          stroke={colors.orange}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>

      {/* Central prism - bold hexagon */}
      <g filter="url(#center-glow)">
        <path
          d="M50 25 L72 37 L72 63 L50 75 L28 63 L28 37 Z"
          fill="url(#prism-gradient)"
          opacity="0.95"
        />

        {/* Inner highlight */}
        <path
          d="M50 33 L62 41 L62 59 L50 67 L38 59 L38 41 Z"
          fill={theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)'}
        />
      </g>

      {/* Bright center core */}
      <circle
        cx="50"
        cy="50"
        r="10"
        fill={colors.center}
        filter="url(#center-glow)"
        className={animated ? 'animate-pulse' : ''}
        opacity="0.95"
      />
    </svg>
  )
}
