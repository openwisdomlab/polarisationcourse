/**
 * QuantumLockSVG - 量子锁元件SVG组件
 *
 * High-fidelity sensor requiring >99% Jones vector match.
 * Visualizes:
 * - Target polarization state (dashed ellipse)
 * - Received polarization state (solid ellipse)
 * - Fidelity percentage with color-coded progress bar
 * - Lock/unlock animation
 *
 * Design Philosophy: "Show, Don't Tell"
 * Players see how close their polarization is to the target without
 * reading formulas - the ellipses overlap when they're getting warmer.
 */

import type { JonesVector } from '@/core/physics'
import { analyzePolarization, jonesIntensity } from '@/core/physics'
import type { BaseSVGProps, SensorState } from './types'

export interface QuantumLockSVGProps extends BaseSVGProps {
  sensorState: SensorState | undefined
  targetJones: JonesVector
  requiredFidelity: number
  requiredIntensity: number
  targetName?: string
  targetNameZh?: string
  showTargetHint?: boolean
  isAnimating?: boolean
  size?: number
  lang?: 'en' | 'zh'
}

/**
 * Generate SVG path for a polarization ellipse
 */
function generateEllipsePath(
  jones: JonesVector,
  scale: number = 3.5
): { path: string; color: string; type: string; handedness: 'right' | 'left' | 'none' } {
  const analysis = analyzePolarization(jones)
  const intensity = jonesIntensity(jones)

  // Normalize for visualization
  const normalizedIntensity = Math.min(1, intensity / 100)
  const baseScale = scale * Math.sqrt(Math.max(0.3, normalizedIntensity))

  // Calculate ellipse parameters
  const chi = analysis.ellipticity
  const cosChi = Math.cos(Math.abs(chi))
  const sinChi = Math.sin(Math.abs(chi))

  const majorAxis = Math.max(0.8, baseScale * cosChi)
  const minorAxis = Math.max(0.2, baseScale * sinChi)

  // Generate ellipse path
  const theta = (analysis.orientation * Math.PI) / 180
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  let path = ''
  const steps = 32
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI
    const x = majorAxis * Math.cos(t) * cosTheta - minorAxis * Math.sin(t) * sinTheta
    const y = majorAxis * Math.cos(t) * sinTheta + minorAxis * Math.sin(t) * cosTheta
    path += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`
  }
  path += ' Z'

  // Color based on type
  let color: string
  switch (analysis.type) {
    case 'linear':
      color = '#22c55e' // Green
      break
    case 'circular':
      color = analysis.handedness === 'right' ? '#f97316' : '#8b5cf6'
      break
    case 'elliptical':
      color = '#eab308' // Yellow
      break
  }

  return { path, color, type: analysis.type, handedness: analysis.handedness }
}

/**
 * Get fidelity color (red -> orange -> yellow -> green)
 */
function getFidelityColor(fidelity: number, requiredFidelity: number): string {
  if (fidelity >= requiredFidelity) return '#22c55e' // Green - unlocked!
  if (fidelity >= 0.95) return '#84cc16' // Lime - almost there
  if (fidelity >= 0.90) return '#eab308' // Yellow - getting warm
  if (fidelity >= 0.70) return '#f97316' // Orange - needs work
  return '#ef4444' // Red - way off
}

export function QuantumLockSVG({
  x,
  y,
  sensorState,
  targetJones,
  requiredFidelity,
  requiredIntensity,
  targetName,
  targetNameZh,
  showTargetHint = true,
  isAnimating = true,
  size = 1,
  isDark = true,
  lang = 'en',
}: QuantumLockSVGProps) {
  const activated = sensorState?.activated ?? false
  const intensity = sensorState?.receivedIntensity ?? 0
  const fidelity = sensorState?.fidelity ?? 0

  // Generate ellipse data
  const targetEllipse = generateEllipsePath(targetJones)
  const receivedEllipse = sensorState?.receivedJones
    ? generateEllipsePath(sensorState.receivedJones)
    : null

  const fidelityColor = getFidelityColor(fidelity, requiredFidelity)
  const displayName = lang === 'zh' ? targetNameZh : targetName

  // Fidelity bar dimensions
  const barWidth = 8
  const barHeight = 1.2
  const fillWidth = barWidth * Math.min(1, fidelity)
  const thresholdX = barWidth * requiredFidelity

  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      {/* Background glow when activated */}
      {activated && (
        <circle r="8" fill="#22c55e" opacity="0.2">
          {isAnimating && (
            <animate attributeName="r" values="7;9;7" dur="1.5s" repeatCount="indefinite" />
          )}
        </circle>
      )}

      {/* Lock body */}
      <rect
        x="-5"
        y="-5"
        width="10"
        height="10"
        rx="2"
        fill={activated ? '#166534' : isDark ? '#1e293b' : '#e2e8f0'}
        stroke={activated ? '#22c55e' : '#64748b'}
        strokeWidth="0.6"
      />

      {/* Lock shackle (animated when unlocking) */}
      <path
        d={activated ? 'M -2.5 -5 V -7 A 2.5 2.5 0 0 1 2.5 -7 V -4' : 'M -2.5 -5 V -7 A 2.5 2.5 0 0 1 2.5 -7 V -5'}
        fill="none"
        stroke={activated ? '#22c55e' : '#64748b'}
        strokeWidth="1"
        strokeLinecap="round"
      >
        {activated && isAnimating && (
          <animate
            attributeName="d"
            values="M -2.5 -5 V -7 A 2.5 2.5 0 0 1 2.5 -7 V -5;M -2.5 -5 V -7 A 2.5 2.5 0 0 1 2.5 -7 V -3"
            dur="0.5s"
            fill="freeze"
          />
        )}
      </path>

      {/* Target ellipse (ghost/reference) - always show if hint enabled */}
      {showTargetHint && (
        <path
          d={targetEllipse.path}
          fill="none"
          stroke={targetEllipse.color}
          strokeWidth="0.4"
          strokeDasharray="0.8,0.4"
          opacity="0.5"
        >
          {isAnimating && (
            <animate
              attributeName="strokeDashoffset"
              values="0;2.4"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </path>
      )}

      {/* Received ellipse (actual state) */}
      {receivedEllipse && (
        <path
          d={receivedEllipse.path}
          fill={receivedEllipse.color}
          fillOpacity={activated ? 0.4 : 0.25}
          stroke={receivedEllipse.color}
          strokeWidth="0.5"
        >
          {isAnimating && !activated && (
            <animate
              attributeName="fillOpacity"
              values="0.2;0.35;0.2"
              dur="1.2s"
              repeatCount="indefinite"
            />
          )}
        </path>
      )}

      {/* Fidelity progress bar */}
      <g transform="translate(-4, 6)">
        {/* Bar background */}
        <rect
          width={barWidth}
          height={barHeight}
          rx="0.3"
          fill={isDark ? '#334155' : '#cbd5e1'}
        />
        {/* Bar fill */}
        <rect
          width={fillWidth}
          height={barHeight}
          rx="0.3"
          fill={fidelityColor}
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
        <line
          x1={thresholdX}
          y1="-0.3"
          x2={thresholdX}
          y2={barHeight + 0.3}
          stroke="#ffffff"
          strokeWidth="0.3"
          opacity="0.6"
        />
      </g>

      {/* Fidelity percentage */}
      <text
        y="9"
        textAnchor="middle"
        fill={fidelityColor}
        fontSize="1.8"
        fontWeight="bold"
      >
        {(fidelity * 100).toFixed(1)}%
      </text>

      {/* Required fidelity label */}
      <text
        y="11"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="1.3"
      >
        ≥{(requiredFidelity * 100).toFixed(0)}%
      </text>

      {/* Target state name (if provided) */}
      {displayName && (
        <text
          y="-9"
          textAnchor="middle"
          fill={targetEllipse.color}
          fontSize="1.5"
          fontWeight="bold"
        >
          {displayName}
        </text>
      )}

      {/* Intensity indicator */}
      <text
        x="4.5"
        y="-4"
        textAnchor="start"
        fill={intensity >= requiredIntensity ? '#22c55e' : '#f97316'}
        fontSize="1.4"
      >
        {Math.round(intensity)}%
      </text>

      {/* Status indicator */}
      <circle
        cx="4"
        cy="4"
        r="0.9"
        fill={activated ? '#22c55e' : '#ef4444'}
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

      {/* Quantum symbol */}
      <text
        x="-4"
        y="-4"
        fill={isDark ? '#94a3b8' : '#64748b'}
        fontSize="2"
        opacity="0.5"
      >
        ψ
      </text>
    </g>
  )
}
