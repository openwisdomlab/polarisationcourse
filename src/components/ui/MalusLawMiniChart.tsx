/**
 * MalusLawMiniChart - Inline Micro-Visualization for Malus's Law
 *
 * A compact SVG chart showing I = I_0 * cos^2(theta) with:
 * - Interactive angle marker synced to the selected polarizer's angle
 * - Real-time intensity readout
 * - Compact enough to embed in floating property panels
 *
 * Design: "Diegetic UI" — looks like a readout on a precision instrument
 */

import { useMemo } from 'react'

// ========== Types ==========

interface MalusLawMiniChartProps {
  /** Current polarizer angle in degrees (0-180) */
  angle: number
  /** Input intensity (0-100) */
  inputIntensity?: number
  /** Input polarization angle (0-180) */
  inputPolarization?: number
  /** Width of the chart in pixels */
  width?: number
  /** Height of the chart in pixels */
  height?: number
  /** Show numerical readout below chart */
  showReadout?: boolean
}

// ========== Constants ==========

const CHART_PADDING = { top: 4, right: 4, bottom: 14, left: 20 }
const CURVE_POINTS = 90 // Number of points to sample the cos^2 curve
const GRID_LINES_Y = 4  // Horizontal grid lines (0%, 25%, 50%, 75%, 100%)

// ========== Component ==========

export function MalusLawMiniChart({
  angle,
  inputIntensity = 100,
  inputPolarization = 0,
  width = 160,
  height = 80,
  showReadout = true,
}: MalusLawMiniChartProps) {
  const plotWidth = width - CHART_PADDING.left - CHART_PADDING.right
  const plotHeight = height - CHART_PADDING.top - CHART_PADDING.bottom

  // Compute the cos^2 curve path
  const curvePath = useMemo(() => {
    const points: string[] = []
    for (let i = 0; i <= CURVE_POINTS; i++) {
      const theta = (i / CURVE_POINTS) * 180 // degrees
      const angleDiff = theta - inputPolarization
      const intensity = Math.pow(Math.cos((angleDiff * Math.PI) / 180), 2)

      const x = CHART_PADDING.left + (theta / 180) * plotWidth
      const y = CHART_PADDING.top + (1 - intensity) * plotHeight

      points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    }
    return points.join(' ')
  }, [plotWidth, plotHeight, inputPolarization])

  // Current angle marker position
  const angleDiff = angle - inputPolarization
  const currentIntensity = inputIntensity * Math.pow(Math.cos((angleDiff * Math.PI) / 180), 2)
  const normalizedIntensity = currentIntensity / inputIntensity
  const markerX = CHART_PADDING.left + (angle / 180) * plotWidth
  const markerY = CHART_PADDING.top + (1 - normalizedIntensity) * plotHeight

  // Intensity color: green at 100%, yellow at 50%, red at 0%
  const intensityColor = useMemo(() => {
    const t = normalizedIntensity
    if (t > 0.5) {
      // Green to yellow
      const r = Math.round(255 * (1 - (t - 0.5) * 2))
      return `rgb(${r}, 255, 68)`
    } else {
      // Yellow to red
      const g = Math.round(255 * t * 2)
      return `rgb(255, ${g}, 68)`
    }
  }, [normalizedIntensity])

  return (
    <div className="inline-block" style={{ width, fontFamily: "'JetBrains Mono', monospace" }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Background */}
        <rect
          x={CHART_PADDING.left}
          y={CHART_PADDING.top}
          width={plotWidth}
          height={plotHeight}
          fill="rgba(0, 0, 0, 0.3)"
          rx={2}
        />

        {/* Grid lines */}
        {Array.from({ length: GRID_LINES_Y + 1 }).map((_, i) => {
          const y = CHART_PADDING.top + (i / GRID_LINES_Y) * plotHeight
          return (
            <line
              key={`grid-${i}`}
              x1={CHART_PADDING.left}
              y1={y}
              x2={CHART_PADDING.left + plotWidth}
              y2={y}
              stroke="rgba(100, 200, 255, 0.1)"
              strokeWidth={0.5}
            />
          )
        })}

        {/* Y-axis labels */}
        <text x={CHART_PADDING.left - 2} y={CHART_PADDING.top + 4} textAnchor="end" fill="rgba(100, 200, 255, 0.5)" fontSize={7}>
          I₀
        </text>
        <text x={CHART_PADDING.left - 2} y={CHART_PADDING.top + plotHeight + 3} textAnchor="end" fill="rgba(100, 200, 255, 0.5)" fontSize={7}>
          0
        </text>

        {/* X-axis labels */}
        <text x={CHART_PADDING.left} y={height - 1} textAnchor="middle" fill="rgba(100, 200, 255, 0.5)" fontSize={7}>
          0°
        </text>
        <text x={CHART_PADDING.left + plotWidth / 2} y={height - 1} textAnchor="middle" fill="rgba(100, 200, 255, 0.5)" fontSize={7}>
          90°
        </text>
        <text x={CHART_PADDING.left + plotWidth} y={height - 1} textAnchor="middle" fill="rgba(100, 200, 255, 0.5)" fontSize={7}>
          180°
        </text>

        {/* Cos^2 curve */}
        <path
          d={curvePath}
          fill="none"
          stroke="rgba(0, 240, 255, 0.6)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Filled area under curve up to current angle */}
        <path
          d={`${curvePath.split('L').slice(0, Math.ceil((angle / 180) * CURVE_POINTS) + 1).join('L')} L${markerX.toFixed(1)},${CHART_PADDING.top + plotHeight} L${CHART_PADDING.left},${CHART_PADDING.top + plotHeight} Z`}
          fill="rgba(0, 240, 255, 0.08)"
        />

        {/* Vertical marker line at current angle */}
        <line
          x1={markerX}
          y1={CHART_PADDING.top}
          x2={markerX}
          y2={CHART_PADDING.top + plotHeight}
          stroke={intensityColor}
          strokeWidth={1}
          strokeDasharray="2,2"
          opacity={0.6}
        />

        {/* Marker dot at current intensity */}
        <circle
          cx={markerX}
          cy={markerY}
          r={3.5}
          fill={intensityColor}
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth={1}
        />

        {/* Glow behind marker */}
        <circle
          cx={markerX}
          cy={markerY}
          r={6}
          fill={intensityColor}
          opacity={0.2}
        />
      </svg>

      {/* Numerical readout */}
      {showReadout && (
        <div className="flex items-center justify-between px-1 mt-0.5" style={{ fontSize: 9 }}>
          <span className="text-cyan-400/70">
            cos²({angleDiff.toFixed(0)}°)
          </span>
          <span style={{ color: intensityColor, fontWeight: 600 }}>
            {currentIntensity.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default MalusLawMiniChart
