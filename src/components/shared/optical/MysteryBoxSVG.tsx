/**
 * MysteryBoxSVG - 神秘黑盒元件
 *
 * Optical Detective mode component that hides an unknown optical element.
 * Players must probe it with different polarization states to deduce its identity.
 *
 * Visual design: Mysterious crate with question mark and animated glow effect
 */

import { useEffect, useState } from 'react'
import type { InteractiveSVGProps } from './types'

export interface MysteryBoxSVGProps extends InteractiveSVGProps {
  /** Hidden element type (shown only when solved) */
  hiddenElementType?: string
  /** Hidden element angle */
  hiddenElementAngle?: number
  /** Whether the mystery has been solved */
  isSolved?: boolean
  /** Callback when player clicks to submit guess */
  onGuess?: () => void
  /** Size multiplier (default: 1) */
  size?: number
  /** Show hint glow animation */
  showHint?: boolean
}

export function MysteryBoxSVG({
  x,
  y,
  locked,
  selected,
  onClick,
  onGuess,
  hiddenElementType,
  hiddenElementAngle,
  isSolved = false,
  isDark = true,
  size = 1,
  showHint = false,
}: MysteryBoxSVGProps) {
  const [pulsePhase, setPulsePhase] = useState(0)

  // Animated pulse effect for mystery box
  useEffect(() => {
    if (isSolved) return // No animation when solved
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [isSolved])

  // Colors based on state
  const boxColor = isDark ? '#374151' : '#9ca3af'
  const borderColor = isSolved
    ? '#22c55e' // Green when solved
    : selected
      ? '#a855f7' // Purple when selected
      : '#7c3aed' // Default purple
  const glowColor = showHint ? '#fbbf24' : '#a855f7'
  const questionMarkColor = isSolved ? '#22c55e' : '#f9fafb'

  // Pulse opacity for glow effect
  const pulseOpacity = Math.sin((pulsePhase * Math.PI) / 180) * 0.3 + 0.5

  // Get display text for solved state
  const getSolvedLabel = () => {
    if (!isSolved || !hiddenElementType) return '?'
    const angleStr = hiddenElementAngle !== undefined ? `@${hiddenElementAngle}°` : ''
    switch (hiddenElementType) {
      case 'polarizer':
        return `P${angleStr}`
      case 'halfWavePlate':
        return `λ/2${angleStr}`
      case 'quarterWavePlate':
        return `λ/4${angleStr}`
      case 'rotator':
        return `R${angleStr}`
      case 'opticalRotator':
        return `OR${angleStr}`
      case 'retarder':
        return `Ret${angleStr}`
      default:
        return '✓'
    }
  }

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${size})`}
      style={{ cursor: locked ? 'not-allowed' : 'pointer' }}
      onClick={onClick}
    >
      {/* Outer glow effect (animated) */}
      {!isSolved && (
        <rect
          x="-6"
          y="-6"
          width="12"
          height="12"
          rx="2"
          fill="none"
          stroke={glowColor}
          strokeWidth="1"
          opacity={pulseOpacity}
          filter="url(#mysteryGlow)"
        />
      )}

      {/* Selection indicator */}
      {selected && !locked && (
        <rect
          x="-6.5"
          y="-6.5"
          width="13"
          height="13"
          rx="2.5"
          fill="none"
          stroke="#a855f7"
          strokeWidth="0.5"
          strokeDasharray="2,1"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;6"
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
      )}

      {/* Main box body - crate style */}
      <rect
        x="-5"
        y="-5"
        width="10"
        height="10"
        rx="1.5"
        fill={boxColor}
        stroke={borderColor}
        strokeWidth="0.6"
      />

      {/* Crate slat lines (horizontal) */}
      <line x1="-4" y1="-2" x2="4" y2="-2" stroke={borderColor} strokeWidth="0.3" opacity="0.5" />
      <line x1="-4" y1="2" x2="4" y2="2" stroke={borderColor} strokeWidth="0.3" opacity="0.5" />

      {/* Crate cross braces (diagonal) */}
      <line x1="-4" y1="-4" x2="4" y2="4" stroke={borderColor} strokeWidth="0.2" opacity="0.3" />
      <line x1="4" y1="-4" x2="-4" y2="4" stroke={borderColor} strokeWidth="0.2" opacity="0.3" />

      {/* Center icon: Question mark or checkmark */}
      {isSolved ? (
        // Solved: Show revealed type
        <text
          textAnchor="middle"
          y="1"
          fill={questionMarkColor}
          fontSize="3.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {getSolvedLabel()}
        </text>
      ) : (
        // Unsolved: Question mark with animation
        <g>
          <text
            textAnchor="middle"
            y="2"
            fill={questionMarkColor}
            fontSize="7"
            fontWeight="bold"
            fontFamily="serif"
            opacity={0.9}
          >
            ?
          </text>
          {/* Sparkle effects */}
          <circle
            cx="3"
            cy="-3"
            r="0.5"
            fill="#fbbf24"
            opacity={Math.sin(((pulsePhase + 90) * Math.PI) / 180) * 0.5 + 0.5}
          />
          <circle
            cx="-3"
            cy="2"
            r="0.4"
            fill="#fbbf24"
            opacity={Math.sin(((pulsePhase + 180) * Math.PI) / 180) * 0.5 + 0.5}
          />
        </g>
      )}

      {/* Lock indicator */}
      {locked && (
        <text x="4" y="-4" fontSize="2">
          🔒
        </text>
      )}

      {/* Guess button (when selected and not solved) */}
      {selected && !locked && !isSolved && onGuess && (
        <g
          transform="translate(0, 9)"
          onClick={(e) => {
            e.stopPropagation()
            onGuess()
          }}
          style={{ cursor: 'pointer' }}
        >
          <rect x="-6" y="-2" width="12" height="4" rx="1" fill="#a855f7" opacity="0.9" />
          <text textAnchor="middle" y="1" fill="white" fontSize="2.5" fontWeight="bold">
            DEDUCE
          </text>
        </g>
      )}

      {/* Solved badge */}
      {isSolved && (
        <g transform="translate(4, -4)">
          <circle r="2" fill="#22c55e" />
          <text textAnchor="middle" y="0.8" fill="white" fontSize="2.5" fontWeight="bold">
            ✓
          </text>
        </g>
      )}
    </g>
  )
}

/**
 * SVG filter definitions for mystery box glow effect
 * Include this in your SVG defs section
 */
export function MysteryBoxDefs() {
  return (
    <defs>
      <filter id="mysteryGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      {/* Gradient for solved state */}
      <linearGradient id="solvedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
    </defs>
  )
}
