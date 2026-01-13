/**
 * PolarWorldLogo - 偏振光下的新世界 Logo
 * A New World Under Polarized Light - Main brand logo
 *
 * Design concept:
 * - A stylized world/globe representing "新世界" (New World)
 * - Polarized light beams in 4 directions with characteristic colors
 * - Dynamic wave patterns showing light interference
 * - Animated glow and pulse effects
 * - Crystal/prism at center representing optical transformation
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
      setRotation(r => (r + 0.5) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [animated])

  // Polarization angle colors - vibrant and distinct
  const colors = {
    deg0: '#ff3366',    // 0° - Magenta-Red (horizontal)
    deg45: '#ffaa00',   // 45° - Golden Orange
    deg90: '#00ff88',   // 90° - Cyan-Green (vertical)
    deg135: '#4488ff',  // 135° - Electric Blue
    center: theme === 'dark' ? '#ffffff' : '#1e293b',
    glow: theme === 'dark' ? 'rgba(34, 211, 238, 0.8)' : 'rgba(8, 145, 178, 0.6)',
    ring: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
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
          {/* Radial gradient for center glow */}
          <radialGradient id="pw-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.glow} stopOpacity="1" />
            <stop offset="50%" stopColor={colors.glow} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
          </radialGradient>

          {/* Beam gradients */}
          <linearGradient id="pw-beam-0" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={colors.deg0} stopOpacity="0" />
            <stop offset="20%" stopColor={colors.deg0} stopOpacity="0.9" />
            <stop offset="80%" stopColor={colors.deg0} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.deg0} stopOpacity="0" />
          </linearGradient>

          <linearGradient id="pw-beam-90" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={colors.deg90} stopOpacity="0" />
            <stop offset="20%" stopColor={colors.deg90} stopOpacity="0.9" />
            <stop offset="80%" stopColor={colors.deg90} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.deg90} stopOpacity="0" />
          </linearGradient>

          <linearGradient id="pw-beam-45" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.deg45} stopOpacity="0" />
            <stop offset="20%" stopColor={colors.deg45} stopOpacity="0.8" />
            <stop offset="80%" stopColor={colors.deg45} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.deg45} stopOpacity="0" />
          </linearGradient>

          <linearGradient id="pw-beam-135" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={colors.deg135} stopOpacity="0" />
            <stop offset="20%" stopColor={colors.deg135} stopOpacity="0.8" />
            <stop offset="80%" stopColor={colors.deg135} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.deg135} stopOpacity="0" />
          </linearGradient>

          {/* Crystal gradient */}
          <linearGradient id="pw-crystal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.deg135} stopOpacity="0.8" />
            <stop offset="25%" stopColor={colors.deg90} stopOpacity="0.6" />
            <stop offset="50%" stopColor={colors.deg45} stopOpacity="0.8" />
            <stop offset="75%" stopColor={colors.deg0} stopOpacity="0.6" />
            <stop offset="100%" stopColor={colors.deg135} stopOpacity="0.8" />
          </linearGradient>

          {/* World ring gradient */}
          <linearGradient id="pw-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.deg0} />
            <stop offset="25%" stopColor={colors.deg45} />
            <stop offset="50%" stopColor={colors.deg90} />
            <stop offset="75%" stopColor={colors.deg135} />
            <stop offset="100%" stopColor={colors.deg0} />
          </linearGradient>

          {/* Glow filters */}
          <filter id="pw-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="pw-intense-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer rotating ring - represents the world */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '60px 60px' }}>
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#pw-ring)"
            strokeWidth="2"
            strokeDasharray="8 4 2 4"
            opacity="0.6"
          />
        </g>

        {/* Second ring - counter rotation */}
        <g style={{ transform: `rotate(${-rotation * 0.7}deg)`, transformOrigin: '60px 60px' }}>
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="url(#pw-ring)"
            strokeWidth="1.5"
            strokeDasharray="12 6"
            opacity="0.4"
          />
        </g>

        {/* Light beams - 4 polarization directions */}
        <g filter="url(#pw-glow)">
          {/* 0° beam (horizontal) */}
          <line
            x1="5"
            y1="60"
            x2="115"
            y2="60"
            stroke="url(#pw-beam-0)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* 90° beam (vertical) */}
          <line
            x1="60"
            y1="5"
            x2="60"
            y2="115"
            stroke="url(#pw-beam-90)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* 45° beam */}
          <line
            x1="15"
            y1="105"
            x2="105"
            y2="15"
            stroke="url(#pw-beam-45)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* 135° beam */}
          <line
            x1="15"
            y1="15"
            x2="105"
            y2="105"
            stroke="url(#pw-beam-135)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Wave patterns on beams */}
        <g opacity="0.5">
          {/* Horizontal wave */}
          <path
            d="M 25 60 Q 32 55, 40 60 T 55 60"
            fill="none"
            stroke={colors.deg0}
            strokeWidth="1.5"
          />
          <path
            d="M 65 60 Q 72 65, 80 60 T 95 60"
            fill="none"
            stroke={colors.deg0}
            strokeWidth="1.5"
          />

          {/* Vertical wave */}
          <path
            d="M 60 25 Q 55 32, 60 40 T 60 55"
            fill="none"
            stroke={colors.deg90}
            strokeWidth="1.5"
          />
          <path
            d="M 60 65 Q 65 72, 60 80 T 60 95"
            fill="none"
            stroke={colors.deg90}
            strokeWidth="1.5"
          />
        </g>

        {/* Central crystal/prism - heart of the optical system */}
        <g filter="url(#pw-intense-glow)">
          {/* Hexagonal prism */}
          <path
            d="M60 35 L75 45 L75 75 L60 85 L45 75 L45 45 Z"
            fill="url(#pw-crystal)"
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)'}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inner crystal facets */}
          <path
            d="M60 35 L60 60 M75 45 L60 60 M75 75 L60 60 M60 85 L60 60 M45 75 L60 60 M45 45 L60 60"
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'}
            strokeWidth="0.8"
          />
        </g>

        {/* Central light core - pulsing */}
        <circle
          cx="60"
          cy="60"
          r="12"
          fill="url(#pw-center-glow)"
          className={animated ? 'animate-pulse' : ''}
        />
        <circle
          cx="60"
          cy="60"
          r="6"
          fill={colors.center}
          opacity="0.95"
        />

        {/* Polarization markers at beam endpoints */}
        <g>
          {/* 0° markers */}
          <circle cx="8" cy="60" r="3" fill={colors.deg0} filter="url(#pw-glow)" />
          <circle cx="112" cy="60" r="3" fill={colors.deg0} filter="url(#pw-glow)" />

          {/* 90° markers */}
          <circle cx="60" cy="8" r="3" fill={colors.deg90} filter="url(#pw-glow)" />
          <circle cx="60" cy="112" r="3" fill={colors.deg90} filter="url(#pw-glow)" />

          {/* 45° markers */}
          <circle cx="17" cy="103" r="2.5" fill={colors.deg45} filter="url(#pw-glow)" />
          <circle cx="103" cy="17" r="2.5" fill={colors.deg45} filter="url(#pw-glow)" />

          {/* 135° markers */}
          <circle cx="17" cy="17" r="2.5" fill={colors.deg135} filter="url(#pw-glow)" />
          <circle cx="103" cy="103" r="2.5" fill={colors.deg135} filter="url(#pw-glow)" />
        </g>

        {/* Decorative arcs - orbit-like paths */}
        <g opacity="0.3" style={{ transform: `rotate(${rotation * 0.3}deg)`, transformOrigin: '60px 60px' }}>
          <ellipse
            cx="60"
            cy="60"
            rx="40"
            ry="20"
            fill="none"
            stroke={colors.deg90}
            strokeWidth="0.8"
            strokeDasharray="3 5"
          />
        </g>
        <g opacity="0.3" style={{ transform: `rotate(${-rotation * 0.3 + 60}deg)`, transformOrigin: '60px 60px' }}>
          <ellipse
            cx="60"
            cy="60"
            rx="40"
            ry="20"
            fill="none"
            stroke={colors.deg0}
            strokeWidth="0.8"
            strokeDasharray="3 5"
          />
        </g>
      </svg>

      {/* Optional text label */}
      {showText && (
        <div className={cn(
          'absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          偏振光下的新世界
        </div>
      )}
    </div>
  )
}
