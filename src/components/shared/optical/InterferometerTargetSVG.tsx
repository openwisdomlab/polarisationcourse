/**
 * InterferometerTargetSVG - 干涉仪目标元件SVG组件
 *
 * Dual-port sensor for Mach-Zehnder style puzzles.
 * Two sensors (Port A and Port B) must be satisfied simultaneously:
 * - Port A: Bright port (requires HIGH intensity from constructive interference)
 * - Port B: Dark port (requires LOW intensity from destructive interference)
 *
 * Visualizes:
 * - Port type indicator (sun/moon icon)
 * - Intensity bar with threshold markers
 * - Connected port status
 * - Visibility/contrast ratio
 */

import type { BaseSVGProps, SensorState } from './types'

export interface InterferometerTargetSVGProps extends BaseSVGProps {
  sensorState: SensorState | undefined
  portType: 'bright' | 'dark'
  minIntensity?: number // For bright port
  maxIntensity?: number // For dark port
  linkedPortSatisfied?: boolean
  portLabel?: string
  portLabelZh?: string
  isAnimating?: boolean
  size?: number
  lang?: 'en' | 'zh'
}

export function InterferometerTargetSVG({
  x,
  y,
  sensorState,
  portType,
  minIntensity = 90,
  maxIntensity = 5,
  linkedPortSatisfied = false,
  portLabel,
  portLabelZh,
  isAnimating = true,
  size = 1,
  isDark = true,
  lang = 'en',
}: InterferometerTargetSVGProps) {
  const intensity = sensorState?.receivedIntensity ?? 0
  const isBrightPort = portType === 'bright'

  // Check if this port is satisfied
  const portSatisfied = isBrightPort
    ? intensity >= minIntensity
    : intensity <= maxIntensity

  // Both ports need to be satisfied for activation
  const fullyActivated = portSatisfied && linkedPortSatisfied

  // Calculate progress towards goal
  const progress = isBrightPort
    ? Math.min(1, intensity / minIntensity)
    : intensity <= maxIntensity
      ? 1 - (intensity / maxIntensity)
      : 0

  // Color based on progress
  const getProgressColor = () => {
    if (portSatisfied) return '#22c55e' // Green - goal met
    if (isBrightPort) {
      if (progress >= 0.8) return '#84cc16' // Lime - almost there
      if (progress >= 0.5) return '#eab308' // Yellow - halfway
      return '#f97316' // Orange - needs more
    } else {
      // Dark port - less is better
      if (intensity <= maxIntensity * 2) return '#84cc16'
      if (intensity <= maxIntensity * 4) return '#eab308'
      return '#ef4444' // Red - too bright
    }
  }

  const displayLabel = lang === 'zh' ? portLabelZh : portLabel

  // Bar dimensions
  const barWidth = 8
  const barHeight = 1.5

  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      {/* Activation glow */}
      {fullyActivated && (
        <circle r="8" fill="#22c55e" opacity="0.25">
          {isAnimating && (
            <animate attributeName="r" values="7;9;7" dur="1.5s" repeatCount="indefinite" />
          )}
        </circle>
      )}

      {/* Main body */}
      <rect
        x="-5"
        y="-5"
        width="10"
        height="10"
        rx="2"
        fill={fullyActivated ? '#166534' : isDark ? '#1e293b' : '#e2e8f0'}
        stroke={portSatisfied ? '#22c55e' : '#64748b'}
        strokeWidth="0.6"
      />

      {/* Port type icon */}
      {isBrightPort ? (
        // Sun icon for bright port
        <g fill={portSatisfied ? '#fbbf24' : '#94a3b8'}>
          <circle r="2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1={2.8 * Math.cos((angle * Math.PI) / 180)}
              y1={2.8 * Math.sin((angle * Math.PI) / 180)}
              x2={3.8 * Math.cos((angle * Math.PI) / 180)}
              y2={3.8 * Math.sin((angle * Math.PI) / 180)}
              stroke={portSatisfied ? '#fbbf24' : '#94a3b8'}
              strokeWidth="0.5"
            />
          ))}
          {isAnimating && portSatisfied && (
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </g>
      ) : (
        // Moon icon for dark port
        <g fill={portSatisfied ? '#8b5cf6' : '#94a3b8'}>
          <path d="M 0,-2.5 A 2.5,2.5 0 1 0 0,2.5 A 2,2 0 1 1 0,-2.5" />
          {isAnimating && portSatisfied && (
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </g>
      )}

      {/* Intensity bar */}
      <g transform="translate(-4, 5.5)">
        {/* Bar background */}
        <rect
          width={barWidth}
          height={barHeight}
          rx="0.4"
          fill={isDark ? '#334155' : '#cbd5e1'}
        />

        {/* Bar fill */}
        <rect
          width={barWidth * (intensity / 100)}
          height={barHeight}
          rx="0.4"
          fill={getProgressColor()}
        >
          {isAnimating && (
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="0.8s"
              repeatCount="indefinite"
            />
          )}
        </rect>

        {/* Threshold marker */}
        {isBrightPort ? (
          // Min threshold for bright
          <line
            x1={barWidth * (minIntensity / 100)}
            y1="-0.3"
            x2={barWidth * (minIntensity / 100)}
            y2={barHeight + 0.3}
            stroke="#ffffff"
            strokeWidth="0.4"
            opacity="0.7"
          />
        ) : (
          // Max threshold for dark
          <line
            x1={barWidth * (maxIntensity / 100)}
            y1="-0.3"
            x2={barWidth * (maxIntensity / 100)}
            y2={barHeight + 0.3}
            stroke="#ef4444"
            strokeWidth="0.4"
            opacity="0.7"
          />
        )}
      </g>

      {/* Intensity value */}
      <text
        y="9.5"
        textAnchor="middle"
        fill={getProgressColor()}
        fontSize="1.8"
        fontWeight="bold"
      >
        {Math.round(intensity)}%
      </text>

      {/* Requirement label */}
      <text
        y="11.5"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="1.3"
      >
        {isBrightPort ? `≥${minIntensity}%` : `≤${maxIntensity}%`}
      </text>

      {/* Port label */}
      {displayLabel && (
        <text
          y="-7"
          textAnchor="middle"
          fill={isBrightPort ? '#fbbf24' : '#8b5cf6'}
          fontSize="1.5"
          fontWeight="bold"
        >
          {displayLabel}
        </text>
      )}

      {/* Linked port status indicator */}
      <circle
        cx="4"
        cy="-4"
        r="0.8"
        fill={linkedPortSatisfied ? '#22c55e' : '#64748b'}
      >
        {isAnimating && linkedPortSatisfied && (
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* This port status indicator */}
      <circle
        cx="-4"
        cy="-4"
        r="0.8"
        fill={portSatisfied ? '#22c55e' : '#ef4444'}
      >
        {isAnimating && (
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Connection line between indicators (visual hint) */}
      <line
        x1="-3"
        y1="-4"
        x2="3"
        y2="-4"
        stroke={fullyActivated ? '#22c55e' : '#64748b'}
        strokeWidth="0.3"
        strokeDasharray={fullyActivated ? 'none' : '0.5,0.3'}
      />

      {/* Port type letter */}
      <text
        x={isBrightPort ? '-4' : '4'}
        y="4"
        textAnchor="middle"
        fill={isDark ? '#64748b' : '#94a3b8'}
        fontSize="1.8"
        fontWeight="bold"
        opacity="0.5"
      >
        {isBrightPort ? 'A' : 'B'}
      </text>
    </g>
  )
}
