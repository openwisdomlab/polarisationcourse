/**
 * Optical Components - Visual SVG components for the optical bench
 * 光学元件 - 光路设计室的可视化SVG元件
 *
 * Provides detailed, realistic visualizations of optical components
 */

import { useTheme } from '@/contexts/ThemeContext'

interface ComponentProps {
  x: number
  y: number
  rotation: number
  selected?: boolean
  polarizationAngle?: number
  onClick?: (e?: React.MouseEvent) => void
}

// Light Source / Emitter with realistic design
export function EmitterViz({ x, y, rotation, selected, onClick }: ComponentProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      onClick={onClick}
      className="cursor-pointer"
    >
      {/* Selection ring */}
      {selected && (
        <circle r="35" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2" opacity="0.8">
          <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Base/housing */}
      <rect x="-24" y="-18" width="48" height="36" rx="4"
        fill={isDark ? '#1e293b' : '#f1f5f9'}
        stroke={isDark ? '#475569' : '#cbd5e1'}
        strokeWidth="2"
      />

      {/* Heat sink fins */}
      {[-12, -6, 0, 6, 12].map((offset) => (
        <rect key={offset} x="-26" y={offset - 1} width="4" height="2"
          fill={isDark ? '#334155' : '#94a3b8'} rx="0.5"
        />
      ))}

      {/* LED/bulb aperture */}
      <circle r="12" fill={isDark ? '#0f172a' : '#e2e8f0'} stroke={isDark ? '#334155' : '#94a3b8'} strokeWidth="1.5" />

      {/* Glowing element */}
      <circle r="8" fill="#fbbf24">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle r="5" fill="#fef3c7" />

      {/* Lens cover */}
      <ellipse cx="20" cy="0" rx="4" ry="14" fill="none" stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth="1.5" />

      {/* Emission glow */}
      <ellipse cx="28" cy="0" rx="6" ry="10" fill="#fbbf24" opacity="0.3">
        <animate attributeName="rx" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="1.5s" repeatCount="indefinite" />
      </ellipse>
    </g>
  )
}

// Polarizer with detailed visualization
export function PolarizerViz({ x, y, rotation, selected, polarizationAngle = 0, onClick }: ComponentProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      onClick={onClick}
      className="cursor-pointer"
    >
      {/* Selection ring */}
      {selected && (
        <circle r="35" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2" opacity="0.8">
          <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Mounting ring */}
      <circle r="26" fill="none" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="4" />

      {/* Polarizer disc background */}
      <circle r="22" fill={isDark ? '#1e1e3f' : '#e0e7ff'} />

      {/* Polarization pattern - lines indicating transmission axis */}
      <g transform={`rotate(${polarizationAngle})`}>
        {/* Main transmission axis */}
        <line x1="0" y1="-20" x2="0" y2="20" stroke="#6366f1" strokeWidth="2" opacity="0.8" />

        {/* Parallel lines pattern */}
        {[-16, -12, -8, -4, 4, 8, 12, 16].map((offset) => (
          <line
            key={offset}
            x1={offset}
            y1={-Math.sqrt(400 - offset * offset)}
            x2={offset}
            y2={Math.sqrt(400 - offset * offset)}
            stroke="#6366f1"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}

        {/* Axis indicator arrows */}
        <polygon points="0,-22 -3,-18 3,-18" fill="#6366f1" opacity="0.8" />
        <polygon points="0,22 -3,18 3,18" fill="#6366f1" opacity="0.8" />
      </g>

      {/* Outer frame */}
      <circle r="24" fill="none" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1.5" />

      {/* Rotation indicator notch */}
      <rect x="-2" y="-28" width="4" height="4" rx="1" fill={isDark ? '#64748b' : '#94a3b8'} />
    </g>
  )
}

// Wave Plate with birefringent visualization
export function WavePlateViz({ x, y, rotation, selected, onClick }: ComponentProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      onClick={onClick}
      className="cursor-pointer"
    >
      {/* Selection ring */}
      {selected && (
        <circle r="35" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2" opacity="0.8">
          <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Mounting ring */}
      <circle r="26" fill="none" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="4" />

      {/* Wave plate crystal */}
      <defs>
        <linearGradient id={`waveplate-grad-${x}-${y}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <circle r="22" fill={`url(#waveplate-grad-${x}-${y})`} />

      {/* Fast/Slow axis indicators */}
      <g>
        {/* Fast axis - horizontal */}
        <line x1="-20" y1="0" x2="20" y2="0" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="22" y="4" fontSize="8" fill="#f472b6" fontWeight="bold">F</text>

        {/* Slow axis - vertical */}
        <line x1="0" y1="-20" x2="0" y2="20" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="4" y="-18" fontSize="8" fill="#22d3ee" fontWeight="bold">S</text>
      </g>

      {/* Crystal pattern */}
      <g opacity="0.2">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={-18 + i * 12} y="-18" width="6" height="36" fill="#8b5cf6" rx="1" />
        ))}
      </g>

      {/* Outer frame */}
      <circle r="24" fill="none" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1.5" />
    </g>
  )
}

// Mirror with reflective surface
export function MirrorViz({ x, y, rotation, selected, onClick }: ComponentProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      onClick={onClick}
      className="cursor-pointer"
    >
      {/* Selection ring */}
      {selected && (
        <circle r="35" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2" opacity="0.8">
          <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Mirror mount */}
      <rect x="-4" y="-26" width="8" height="52" rx="2" fill={isDark ? '#334155' : '#94a3b8'} />

      {/* Mirror surface */}
      <defs>
        <linearGradient id={`mirror-grad-${x}-${y}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="30%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      <rect x="-2" y="-24" width="4" height="48" fill={`url(#mirror-grad-${x}-${y})`} />

      {/* Reflection effect lines */}
      {[-16, -8, 0, 8, 16].map((offset) => (
        <line key={offset} x1="-1" y1={offset - 2} x2="-1" y2={offset + 2} stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
      ))}

      {/* Back coating indicator */}
      <rect x="2" y="-24" width="2" height="48" fill={isDark ? '#1e293b' : '#64748b'} opacity="0.8" />
    </g>
  )
}

// Beam Splitter (PBS cube)
export function SplitterViz({ x, y, rotation, selected, onClick }: ComponentProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      onClick={onClick}
      className="cursor-pointer"
    >
      {/* Selection ring */}
      {selected && (
        <rect x="-32" y="-32" width="64" height="64" rx="4" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2" opacity="0.8">
          <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite" />
        </rect>
      )}

      {/* Cube body */}
      <rect x="-24" y="-24" width="48" height="48" rx="2"
        fill={isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'}
        stroke={isDark ? '#6366f1' : '#818cf8'}
        strokeWidth="2"
      />

      {/* Diagonal coating */}
      <line x1="-24" y1="24" x2="24" y2="-24" stroke="#10b981" strokeWidth="3" opacity="0.6" />

      {/* Coating pattern */}
      {[-16, -8, 0, 8, 16].map((offset) => (
        <line
          key={offset}
          x1={-24 + offset}
          y1={24 - offset}
          x2={-20 + offset}
          y2={20 - offset}
          stroke="#10b981"
          strokeWidth="1"
          opacity="0.3"
        />
      ))}

      {/* Input/output ports */}
      <circle cx="-24" cy="0" r="3" fill={isDark ? '#475569' : '#94a3b8'} />
      <circle cx="24" cy="0" r="3" fill={isDark ? '#475569' : '#94a3b8'} />
      <circle cx="0" cy="-24" r="3" fill={isDark ? '#475569' : '#94a3b8'} />

      {/* P and S labels */}
      <text x="16" y="4" fontSize="8" fill="#10b981" fontWeight="bold">P</text>
      <text x="-4" y="-14" fontSize="8" fill="#ec4899" fontWeight="bold">S</text>
    </g>
  )
}

// Detector/Sensor with display
export function SensorViz({ x, y, rotation, selected, onClick }: ComponentProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      onClick={onClick}
      className="cursor-pointer"
    >
      {/* Selection ring */}
      {selected && (
        <rect x="-32" y="-24" width="64" height="48" rx="4" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2" opacity="0.8">
          <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite" />
        </rect>
      )}

      {/* Sensor body */}
      <rect x="-28" y="-20" width="56" height="40" rx="4"
        fill={isDark ? '#1e293b' : '#f1f5f9'}
        stroke={isDark ? '#475569' : '#cbd5e1'}
        strokeWidth="2"
      />

      {/* Aperture */}
      <rect x="-30" y="-12" width="6" height="24" rx="1" fill={isDark ? '#0f172a' : '#1e293b'} />

      {/* Sensor chip */}
      <rect x="-20" y="-10" width="12" height="20" rx="1" fill={isDark ? '#4c1d95' : '#8b5cf6'} opacity="0.6" />

      {/* Display screen */}
      <rect x="-4" y="-14" width="28" height="28" rx="2" fill={isDark ? '#0f172a' : '#1e293b'} />
      <rect x="-2" y="-12" width="24" height="24" rx="1" fill="#10b981" opacity="0.2" />

      {/* Display reading */}
      <text x="10" y="2" fontSize="10" fill="#10b981" fontWeight="bold" textAnchor="middle">
        100%
      </text>

      {/* LED indicators */}
      <circle cx="16" cy="16" r="2" fill="#10b981">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
      </circle>
    </g>
  )
}

// Lens component
export function LensViz({ x, y, rotation, selected, onClick }: ComponentProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      onClick={onClick}
      className="cursor-pointer"
    >
      {/* Selection ring */}
      {selected && (
        <circle r="32" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2" opacity="0.8">
          <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Lens mount */}
      <circle r="26" fill="none" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="4" />

      {/* Lens glass - convex */}
      <defs>
        <linearGradient id={`lens-grad-${x}-${y}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="20%" stopColor="#22d3ee" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.3" />
          <stop offset="80%" stopColor="#22d3ee" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Lens shape - biconvex */}
      <ellipse cx="-4" cy="0" rx="4" ry="22" fill={`url(#lens-grad-${x}-${y})`} stroke="#22d3ee" strokeWidth="1.5" />
      <ellipse cx="4" cy="0" rx="4" ry="22" fill={`url(#lens-grad-${x}-${y})`} stroke="#22d3ee" strokeWidth="1.5" />

      {/* Focus indicator */}
      <circle cx="20" cy="0" r="2" fill="#f97316" opacity="0.6" />
      <line x1="8" y1="0" x2="18" y2="0" stroke="#f97316" strokeWidth="1" strokeDasharray="2 1" opacity="0.5" />

      {/* Outer frame */}
      <circle r="24" fill="none" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1.5" />
    </g>
  )
}

// Light beam visualization with polarization
// Supports linear, circular, and elliptical polarization visualization
interface LightBeamProps {
  x1: number
  y1: number
  x2: number
  y2: number
  polarizationAngle?: number
  intensity?: number // 0-100
  showPolarization?: boolean
  animated?: boolean
  // Enhanced polarization properties from Jones vector analysis
  polarizationType?: 'linear' | 'circular' | 'elliptical'
  handedness?: 'right' | 'left' | 'none'
  ellipticity?: number // 0 = linear, ±π/4 = circular
}

export function LightBeam({
  x1,
  y1,
  x2,
  y2,
  polarizationAngle = 0,
  intensity = 100,
  showPolarization = true,
  animated = true,
  polarizationType = 'linear',
  handedness = 'none',
  ellipticity = 0,
}: LightBeamProps) {
  // Calculate polarization color based on state
  const getPolarizationColor = (angle: number, type: string, hand: string) => {
    if (type === 'circular') {
      // Circular polarization: blue for RCP, pink for LCP
      return hand === 'right' ? '#3b82f6' : '#ec4899'
    }
    if (type === 'elliptical') {
      // Elliptical: purple tint based on ellipticity
      return '#a855f7'
    }
    // Linear polarization: color by angle
    const colors: Record<number, string> = {
      0: '#ef4444',   // Red - horizontal
      45: '#f97316',  // Orange
      90: '#22c55e',  // Green - vertical
      135: '#3b82f6', // Blue
    }
    return colors[Math.round(angle / 45) * 45 % 180] || '#fbbf24'
  }

  const beamColor = showPolarization
    ? getPolarizationColor(polarizationAngle, polarizationType, handedness)
    : '#fbbf24'
  const opacity = Math.max(0.1, intensity / 100)

  // Calculate beam length and angle
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI

  const id = `beam-${Math.round(x1)}-${Math.round(y1)}-${Math.round(x2)}-${Math.round(y2)}`

  // Generate polarization visualization elements
  const renderPolarizationIndicator = () => {
    if (!showPolarization || length < 60) return null

    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2

    if (polarizationType === 'circular') {
      // Circular polarization: animated rotating helix
      const direction = handedness === 'right' ? 1 : -1
      return (
        <g transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
          {/* Helix representation */}
          {[0, 1, 2, 3, 4].map((i) => {
            const t = (i / 4) * 2 * Math.PI
            const xPos = (i - 2) * 10
            const yOff = Math.sin(t) * 6
            return (
              <circle
                key={i}
                cx={xPos}
                cy={yOff}
                r="2"
                fill={beamColor}
                opacity={0.6 + (i / 10)}
              >
                <animate
                  attributeName="cy"
                  values={`${yOff};${-yOff};${yOff}`}
                  dur="0.5s"
                  repeatCount="indefinite"
                  begin={`${i * 0.1 * direction}s`}
                />
              </circle>
            )
          })}
          {/* Rotation direction arrow */}
          <g transform="translate(25, 0)">
            <circle
              cx="0"
              cy="0"
              r="6"
              fill="none"
              stroke={beamColor}
              strokeWidth="1.5"
              strokeDasharray="2 2"
              opacity="0.7"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={direction > 0 ? '0' : '360'}
                to={direction > 0 ? '360' : '0'}
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fontSize="8"
              fill={beamColor}
              fontWeight="bold"
            >
              {handedness === 'right' ? 'R' : 'L'}
            </text>
          </g>
        </g>
      )
    }

    if (polarizationType === 'elliptical') {
      // Elliptical polarization: animated ellipse
      const ellipticityAbs = Math.abs(ellipticity)
      const axisRatio = Math.tan(ellipticityAbs)
      const direction = ellipticity > 0 ? 1 : -1
      return (
        <g transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
          {/* Ellipse showing polarization shape */}
          <ellipse
            cx="0"
            cy="0"
            rx="12"
            ry={Math.max(3, 12 * axisRatio)}
            fill="none"
            stroke={beamColor}
            strokeWidth="1.5"
            opacity="0.6"
            transform={`rotate(${polarizationAngle - angle})`}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`${polarizationAngle - angle}`}
              to={`${polarizationAngle - angle + 360 * direction}`}
              dur="2s"
              repeatCount="indefinite"
            />
          </ellipse>
          {/* Field vector */}
          <line
            x1="0"
            y1="0"
            x2="10"
            y2="0"
            stroke={beamColor}
            strokeWidth="2"
            opacity="0.8"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to={`${360 * direction}`}
              dur="1s"
              repeatCount="indefinite"
            />
          </line>
        </g>
      )
    }

    // Linear polarization: oscillating arrow
    return (
      <g transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
        {/* Oscillation plane indicator */}
        <g transform={`rotate(${polarizationAngle - angle})`}>
          <line
            x1="0"
            y1="-8"
            x2="0"
            y2="8"
            stroke="white"
            strokeWidth="2"
            opacity="0.6"
          >
            <animate
              attributeName="y1"
              values="-8;-10;-8"
              dur="0.3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y2"
              values="8;10;8"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </line>
          {/* Arrow heads */}
          <polygon
            points="0,-10 -2,-6 2,-6"
            fill="white"
            opacity="0.6"
          >
            <animate
              attributeName="points"
              values="0,-10 -2,-6 2,-6;0,-12 -3,-8 3,-8;0,-10 -2,-6 2,-6"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </polygon>
          <polygon
            points="0,10 -2,6 2,6"
            fill="white"
            opacity="0.6"
          >
            <animate
              attributeName="points"
              values="0,10 -2,6 2,6;0,12 -3,8 3,8;0,10 -2,6 2,6"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </polygon>
        </g>
        {/* Angle indicator */}
        <text
          x="18"
          y="4"
          fontSize="9"
          fill={beamColor}
          fontWeight="bold"
          opacity="0.8"
        >
          {Math.round(polarizationAngle)}°
        </text>
      </g>
    )
  }

  return (
    <g>
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={beamColor} stopOpacity={opacity * 0.8} />
          <stop offset="50%" stopColor={beamColor} stopOpacity={opacity} />
          <stop offset="100%" stopColor={beamColor} stopOpacity={opacity * 0.6} />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main beam */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={`url(#${id}-grad)`}
        strokeWidth="6"
        strokeLinecap="round"
        filter={`url(#${id}-glow)`}
        opacity={opacity}
      />

      {/* Inner bright core */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={beamColor}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={opacity}
      />

      {/* Animated energy particles */}
      {animated && (
        <g>
          {[0, 0.25, 0.5, 0.75].map((offset, i) => (
            <circle key={i} r="3" fill={beamColor} opacity={opacity * 0.6}>
              <animateMotion
                path={`M${x1},${y1} L${x2},${y2}`}
                dur="1s"
                begin={`${offset}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      )}

      {/* Polarization state indicator */}
      {renderPolarizationIndicator()}
    </g>
  )
}

// Component map for dynamic rendering
export const OpticalComponentMap = {
  emitter: EmitterViz,
  polarizer: PolarizerViz,
  waveplate: WavePlateViz,
  mirror: MirrorViz,
  splitter: SplitterViz,
  sensor: SensorViz,
  lens: LensViz,
}

export type OpticalComponentType = keyof typeof OpticalComponentMap
