/**
 * OpticalMineSVG - 光学地雷元件SVG组件
 *
 * Danger zone that triggers level failure if touched by light above threshold.
 * Can be bypassed with specific polarization state (safe state).
 *
 * Visualizes:
 * - Danger level meter (approaching trigger threshold)
 * - Safe state indicator (if configured)
 * - Warning/explosion animation when triggered
 * - Skull/hazard icon
 *
 * Design Philosophy: Create tension without frustration
 * Players can see how close they are to triggering the mine,
 * giving them feedback to adjust their optical setup.
 */

import type { JonesVector } from '@/core/physics'
import { analyzePolarization } from '@/core/physics'
import type { BaseSVGProps, SensorState } from './types'

export interface OpticalMineSVGProps extends BaseSVGProps {
  sensorState: SensorState | undefined
  mineThreshold: number
  safeJones?: JonesVector
  safeStateName?: string
  safeStateNameZh?: string
  isAnimating?: boolean
  size?: number
  lang?: 'en' | 'zh'
}

export function OpticalMineSVG({
  x,
  y,
  sensorState,
  mineThreshold,
  safeJones,
  safeStateName,
  safeStateNameZh,
  isAnimating = true,
  size = 1,
  isDark = true,
  lang = 'en',
}: OpticalMineSVGProps) {
  const intensity = sensorState?.receivedIntensity ?? 0
  const triggered = (sensorState as unknown as { triggered?: boolean })?.triggered ?? false
  const inSafeState = (sensorState as unknown as { inSafeState?: boolean })?.inSafeState ?? false
  const dangerLevel = (sensorState as unknown as { dangerLevel?: number })?.dangerLevel ?? 0

  // Get safe state analysis for display
  const safeStateAnalysis = safeJones ? analyzePolarization(safeJones) : null
  const displaySafeState = lang === 'zh' ? safeStateNameZh : safeStateName

  // Danger color gradient: gray -> yellow -> orange -> red -> BOOM
  const getDangerColor = () => {
    if (triggered) return '#ef4444' // Red - triggered!
    if (inSafeState) return '#22c55e' // Green - safe state bypass
    if (dangerLevel >= 0.9) return '#ef4444' // Red - imminent!
    if (dangerLevel >= 0.7) return '#f97316' // Orange - danger
    if (dangerLevel >= 0.4) return '#eab308' // Yellow - warning
    if (dangerLevel > 0) return '#94a3b8' // Gray - some light detected
    return '#64748b' // Dark gray - safe
  }

  const dangerColor = getDangerColor()

  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      {/* Explosion effect when triggered */}
      {triggered && (
        <>
          <circle r="10" fill="#ef4444" opacity="0.4">
            {isAnimating && (
              <animate
                attributeName="r"
                values="8;14;8"
                dur="0.3s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle r="6" fill="#fbbf24" opacity="0.5">
            {isAnimating && (
              <animate
                attributeName="r"
                values="5;9;5"
                dur="0.25s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </>
      )}

      {/* Warning glow when approaching threshold */}
      {!triggered && dangerLevel > 0.5 && !inSafeState && (
        <circle r="7" fill={dangerColor} opacity={0.1 + dangerLevel * 0.2}>
          {isAnimating && (
            <animate
              attributeName="r"
              values="6;8;6"
              dur={1.5 - dangerLevel}
              repeatCount="indefinite"
            />
          )}
        </circle>
      )}

      {/* Safe state glow */}
      {inSafeState && (
        <circle r="7" fill="#22c55e" opacity="0.2">
          {isAnimating && (
            <animate
              attributeName="r"
              values="6;8;6"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      )}

      {/* Mine body (hexagonal shape for hazard feel) */}
      <path
        d="M 0,-5 L 4.33,-2.5 L 4.33,2.5 L 0,5 L -4.33,2.5 L -4.33,-2.5 Z"
        fill={triggered ? '#7f1d1d' : inSafeState ? '#166534' : isDark ? '#1e293b' : '#e2e8f0'}
        stroke={triggered ? '#ef4444' : inSafeState ? '#22c55e' : dangerColor}
        strokeWidth="0.6"
      />

      {/* Hazard stripes */}
      <g opacity="0.3">
        <path d="M -2,-4 L 2,-4 L 3,-2 L -3,-2 Z" fill={dangerColor} />
        <path d="M -3,0 L 3,0 L 3.5,2 L -3.5,2 Z" fill={dangerColor} />
      </g>

      {/* Skull icon (simplified) */}
      <g fill={triggered ? '#ffffff' : dangerColor}>
        {/* Skull outline */}
        <ellipse cx="0" cy="-0.5" rx="2.5" ry="2.2" opacity="0.8" />
        {/* Eyes */}
        <circle cx="-0.8" cy="-0.8" r="0.5" fill={isDark ? '#0f172a' : '#f8fafc'} />
        <circle cx="0.8" cy="-0.8" r="0.5" fill={isDark ? '#0f172a' : '#f8fafc'} />
        {/* Nose */}
        <path d="M 0,0.2 L -0.3,0.8 L 0.3,0.8 Z" fill={isDark ? '#0f172a' : '#f8fafc'} />
        {/* Mouth */}
        <rect x="-1.5" y="1.2" width="3" height="0.8" rx="0.2" fill={isDark ? '#0f172a' : '#f8fafc'} />
        <line x1="-0.5" y1="1.2" x2="-0.5" y2="2" stroke={dangerColor} strokeWidth="0.2" />
        <line x1="0.5" y1="1.2" x2="0.5" y2="2" stroke={dangerColor} strokeWidth="0.2" />
      </g>

      {/* Danger meter (vertical bar on side) */}
      <g transform="translate(5.5, -4)">
        {/* Bar background */}
        <rect width="1.5" height="8" rx="0.3" fill={isDark ? '#334155' : '#cbd5e1'} />
        {/* Bar fill (from bottom) */}
        <rect
          y={8 - 8 * dangerLevel}
          width="1.5"
          height={8 * dangerLevel}
          rx="0.3"
          fill={dangerColor}
        >
          {isAnimating && dangerLevel > 0.5 && (
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="0.5s"
              repeatCount="indefinite"
            />
          )}
        </rect>
        {/* Threshold line */}
        <line
          x1="0"
          y1={8 - 8 * (mineThreshold / 100)}
          x2="1.5"
          y2={8 - 8 * (mineThreshold / 100)}
          stroke="#ef4444"
          strokeWidth="0.3"
        />
      </g>

      {/* Intensity value */}
      <text
        y="8"
        textAnchor="middle"
        fill={dangerColor}
        fontSize="1.8"
        fontWeight="bold"
      >
        {Math.round(intensity)}%
      </text>

      {/* Threshold label */}
      <text
        y="10"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="1.3"
      >
        &lt;{mineThreshold}%
      </text>

      {/* Safe state hint (if configured) */}
      {safeStateAnalysis && displaySafeState && (
        <text
          y="-8"
          textAnchor="middle"
          fill="#22c55e"
          fontSize="1.2"
          opacity="0.7"
        >
          Safe: {displaySafeState}
        </text>
      )}

      {/* Safe state indicator dot */}
      {safeJones && (
        <circle
          cx="-4"
          cy="-4"
          r="0.8"
          fill={inSafeState ? '#22c55e' : '#64748b'}
        >
          {isAnimating && inSafeState && (
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      )}

      {/* TRIGGERED text */}
      {triggered && (
        <text
          y="-8"
          textAnchor="middle"
          fill="#ef4444"
          fontSize="2"
          fontWeight="bold"
        >
          {isAnimating && (
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="0.2s"
              repeatCount="indefinite"
            />
          )}
          {lang === 'zh' ? '爆炸!' : 'BOOM!'}
        </text>
      )}
    </g>
  )
}
