/**
 * SensorSVG - 光传感器元件SVG组件
 * 显示激活状态、接收光强和偏振要求
 *
 * Enhanced for Master Class Campaign:
 * - Shows target vs actual polarization ellipses
 * - Displays fidelity percentage for quantum locks
 */

import type { JonesVector } from '@/core/physics'
import { analyzePolarization, jonesIntensity } from '@/core/physics'
import type { BaseSVGProps, SensorState, GetPolarizationColorFn } from './types'

export interface SensorSVGProps extends BaseSVGProps {
  sensorState: SensorState | undefined
  requiredIntensity: number
  requiredPolarization?: number
  isAnimating?: boolean
  getPolarizationColor?: GetPolarizationColorFn
  size?: number

  // Enhanced props for advanced sensors
  showPolarizationEllipse?: boolean
  targetJones?: JonesVector
  showFidelity?: boolean
}

/**
 * Generate SVG path for a polarization ellipse
 */
function generateEllipsePath(
  jones: JonesVector,
  scale: number = 2.5
): { path: string; color: string; label: string } {
  const analysis = analyzePolarization(jones)
  const intensity = jonesIntensity(jones)

  // Normalize for visualization
  const normalizedIntensity = Math.min(1, intensity / 100)
  const baseScale = scale * Math.sqrt(normalizedIntensity)

  // Calculate ellipse parameters from ellipticity angle
  const chi = analysis.ellipticity
  const cosChi = Math.cos(Math.abs(chi))
  const sinChi = Math.sin(Math.abs(chi))

  const majorAxis = Math.max(0.5, baseScale * cosChi)
  const minorAxis = Math.max(0.1, baseScale * sinChi)

  // Generate ellipse path
  const theta = (analysis.orientation * Math.PI) / 180
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  let path = ''
  const steps = 24
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI
    const x = majorAxis * Math.cos(t) * cosTheta - minorAxis * Math.sin(t) * sinTheta
    const y = majorAxis * Math.cos(t) * sinTheta + minorAxis * Math.sin(t) * cosTheta
    path += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`
  }
  path += ' Z'

  // Color based on polarization type
  let color: string
  let label: string
  switch (analysis.type) {
    case 'linear':
      color = '#22c55e' // Green
      label = `${Math.round(analysis.orientation)}°`
      break
    case 'circular':
      color = analysis.handedness === 'right' ? '#f97316' : '#8b5cf6' // Orange RCP, Purple LCP
      label = analysis.handedness === 'right' ? 'RCP' : 'LCP'
      break
    case 'elliptical':
      color = '#eab308' // Yellow
      label = `E${Math.round(analysis.orientation)}°`
      break
  }

  return { path, color, label }
}

export function SensorSVG({
  x,
  y,
  sensorState,
  requiredIntensity,
  requiredPolarization,
  isDark = true,
  isAnimating = true,
  getPolarizationColor,
  size = 1,
  showPolarizationEllipse = false,
  targetJones,
  showFidelity = false,
}: SensorSVGProps) {
  const activated = sensorState?.activated ?? false
  const intensity = sensorState?.receivedIntensity ?? 0
  const fidelity = sensorState?.fidelity

  // Get ellipse data if available
  const receivedEllipse =
    showPolarizationEllipse && sensorState?.receivedJones
      ? generateEllipsePath(sensorState.receivedJones)
      : null

  const targetEllipse =
    showPolarizationEllipse && targetJones
      ? generateEllipsePath(targetJones)
      : null

  // 默认色彩函数
  const getColor =
    getPolarizationColor ||
    ((angle: number) => {
      const normalizedAngle = ((angle % 180) + 180) % 180
      if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff4444'
      if (normalizedAngle < 67.5) return '#ffaa00'
      if (normalizedAngle < 112.5) return '#44ff44'
      return '#4444ff'
    })

  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      {/* 激活时的外发光 */}
      {activated && (
        <circle r="6" fill="#22c55e" opacity="0.3">
          {isAnimating && (
            <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
          )}
        </circle>
      )}

      {/* 主体外壳 */}
      <rect
        x="-4"
        y="-4"
        width="8"
        height="8"
        rx="1.5"
        fill={activated ? '#166534' : isDark ? '#1e293b' : '#e2e8f0'}
        stroke={activated ? '#22c55e' : '#64748b'}
        strokeWidth="0.5"
      />

      {/* 偏振椭圆可视化区域 */}
      {showPolarizationEllipse && (
        <g>
          {/* Target ellipse (ghost/reference) */}
          {targetEllipse && (
            <path
              d={targetEllipse.path}
              fill="none"
              stroke={targetEllipse.color}
              strokeWidth="0.3"
              strokeDasharray="0.5,0.3"
              opacity="0.6"
            />
          )}

          {/* Received ellipse (actual state) */}
          {receivedEllipse && (
            <path
              d={receivedEllipse.path}
              fill={receivedEllipse.color}
              fillOpacity="0.3"
              stroke={receivedEllipse.color}
              strokeWidth="0.4"
            >
              {isAnimating && (
                <animate
                  attributeName="fillOpacity"
                  values="0.2;0.4;0.2"
                  dur="1s"
                  repeatCount="indefinite"
                />
              )}
            </path>
          )}
        </g>
      )}

      {/* 感应透镜 (only show when not using ellipse) */}
      {!showPolarizationEllipse && (
        <circle
          r="2.5"
          fill={activated ? '#4ade80' : isDark ? '#334155' : '#cbd5e1'}
          stroke={activated ? '#86efac' : '#94a3b8'}
          strokeWidth="0.3"
        >
          {activated && isAnimating && (
            <animate attributeName="opacity" values="0.8;1;0.8" dur="0.5s" repeatCount="indefinite" />
          )}
        </circle>
      )}

      {/* 状态LED */}
      <circle cx="3" cy="-3" r="0.8" fill={activated ? '#22c55e' : '#ef4444'}>
        {isAnimating && (
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
        )}
      </circle>

      {/* 所需强度标签 */}
      <text y="7" textAnchor="middle" fill={activated ? '#22c55e' : '#94a3b8'} fontSize="1.8">
        ≥{requiredIntensity}%
      </text>

      {/* 接收强度显示 */}
      <text
        y="-6"
        textAnchor="middle"
        fill={activated ? '#22c55e' : '#f97316'}
        fontSize="2"
        fontWeight="bold"
      >
        {Math.round(intensity)}%
      </text>

      {/* Fidelity percentage (for quantum locks) */}
      {showFidelity && fidelity !== undefined && (
        <text
          y="9.5"
          textAnchor="middle"
          fill={fidelity >= 0.99 ? '#22c55e' : fidelity >= 0.9 ? '#eab308' : '#f97316'}
          fontSize="1.5"
          fontWeight="bold"
        >
          F: {(fidelity * 100).toFixed(1)}%
        </text>
      )}

      {/* 所需偏振角度指示 (legacy, only when not using ellipse) */}
      {!showPolarizationEllipse && requiredPolarization !== undefined && (
        <circle cx="-3" cy="-3" r="1" fill={getColor(requiredPolarization)} opacity="0.8" />
      )}

      {/* Ellipse labels (target/actual) */}
      {showPolarizationEllipse && targetEllipse && (
        <text
          x="-3.5"
          y="-3"
          fill={targetEllipse.color}
          fontSize="1.2"
          opacity="0.7"
          textAnchor="end"
        >
          T
        </text>
      )}
      {showPolarizationEllipse && receivedEllipse && (
        <text
          x="3.5"
          y="-3"
          fill={receivedEllipse.color}
          fontSize="1.2"
          textAnchor="start"
        >
          A
        </text>
      )}
    </g>
  )
}
