/**
 * Device Icons - SVG visualizations for polarization optical devices
 * 器件图标 - 偏振光学器件的SVG可视化
 *
 * Visual representations of various optical devices for the device library
 */

import { cn } from '@/lib/utils'

interface DeviceIconProps {
  className?: string
  size?: number
  theme?: 'dark' | 'light'
}

// Linear Polarizer - 线偏振片
export function LinearPolarizerIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="polarizer-frame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#475569' : '#94a3b8'} />
          <stop offset="100%" stopColor={isDark ? '#334155' : '#cbd5e1'} />
        </linearGradient>
      </defs>

      {/* Outer ring/mount */}
      <circle cx="32" cy="32" r="28" fill="none" stroke="url(#polarizer-frame)" strokeWidth="4" />

      {/* Polarizer disc */}
      <circle cx="32" cy="32" r="24" fill={isDark ? '#1e1e3f' : '#e0e7ff'} />

      {/* Half-filled effect for transmission */}
      <path
        d="M32 8 A24 24 0 0 1 32 56"
        fill="#6366f1"
        opacity="0.4"
      />

      {/* Transmission axis lines */}
      <g stroke="#6366f1" strokeWidth="1.5">
        <line x1="32" y1="10" x2="32" y2="54" opacity="0.8" />
        {[-16, -10, -4, 4, 10, 16].map((offset) => (
          <line
            key={offset}
            x1={32 + offset}
            y1={12 + Math.abs(offset) * 0.8}
            x2={32 + offset}
            y2={52 - Math.abs(offset) * 0.8}
            opacity="0.3"
          />
        ))}
      </g>

      {/* Axis arrows */}
      <polygon points="32,6 29,12 35,12" fill="#6366f1" opacity="0.8" />
      <polygon points="32,58 29,52 35,52" fill="#6366f1" opacity="0.8" />
    </svg>
  )
}

// Circular Polarizer - 圆偏振片
export function CircularPolarizerIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      {/* Outer ring */}
      <circle cx="32" cy="32" r="28" fill="none" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="4" />

      {/* Disc background */}
      <circle cx="32" cy="32" r="24" fill={isDark ? '#1e1e3f' : '#e0e7ff'} />

      {/* Circular polarization spiral */}
      <path
        d="M32 12
           Q44 16, 48 28
           Q52 40, 40 48
           Q28 56, 16 44
           Q8 32, 16 20
           Q24 12, 32 12"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Inner spiral */}
      <path
        d="M32 18
           Q40 20, 44 28
           Q48 36, 40 42
           Q32 48, 24 42
           Q18 36, 22 28
           Q26 22, 32 18"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Center dot */}
      <circle cx="32" cy="32" r="4" fill="#8b5cf6" />
    </svg>
  )
}

// Quarter Wave Plate - 四分之一波片
export function QuarterWavePlateIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="qwp-crystal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Mount ring */}
      <circle cx="32" cy="32" r="28" fill="none" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="4" />

      {/* Crystal plate */}
      <circle cx="32" cy="32" r="24" fill="url(#qwp-crystal)" />

      {/* Fast axis */}
      <line x1="10" y1="32" x2="54" y2="32" stroke="#f472b6" strokeWidth="2" strokeDasharray="4 2" />
      <text x="56" y="34" fontSize="8" fill="#f472b6" fontWeight="bold">F</text>

      {/* Slow axis */}
      <line x1="32" y1="10" x2="32" y2="54" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2" />
      <text x="34" y="8" fontSize="8" fill="#22d3ee" fontWeight="bold">S</text>

      {/* Birefringent pattern */}
      <g opacity="0.3">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={12 + i * 10} y="14" width="5" height="36" rx="1" fill="#8b5cf6" />
        ))}
      </g>

      {/* λ/4 label */}
      <text x="32" y="36" fontSize="10" fill={isDark ? '#e2e8f0' : '#1e293b'} textAnchor="middle" fontWeight="bold">λ/4</text>
    </svg>
  )
}

// Half Wave Plate - 二分之一波片
export function HalfWavePlateIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="hwp-crystal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Mount ring */}
      <circle cx="32" cy="32" r="28" fill="none" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="4" />

      {/* Crystal plate */}
      <circle cx="32" cy="32" r="24" fill="url(#hwp-crystal)" />

      {/* Rotation indicator arrows */}
      <path
        d="M18 18 L22 22 M46 18 L42 22 M18 46 L22 42 M46 46 L42 42"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Birefringent pattern - thicker */}
      <g opacity="0.3">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={12 + i * 10} y="12" width="6" height="40" rx="1" fill="#06b6d4" />
        ))}
      </g>

      {/* λ/2 label */}
      <text x="32" y="36" fontSize="10" fill={isDark ? '#e2e8f0' : '#1e293b'} textAnchor="middle" fontWeight="bold">λ/2</text>
    </svg>
  )
}

// Polarizing Beam Splitter (PBS) - 偏振分束器
export function PBSIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      {/* Cube body */}
      <rect x="10" y="10" width="44" height="44" rx="3"
        fill={isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)'}
        stroke={isDark ? '#6366f1' : '#818cf8'}
        strokeWidth="2"
      />

      {/* Diagonal beam splitter coating */}
      <line x1="10" y1="54" x2="54" y2="10" stroke="#10b981" strokeWidth="4" opacity="0.6" />

      {/* Coating pattern lines */}
      {[8, 16, 24, 32, 40].map((offset) => (
        <line
          key={offset}
          x1={10 + offset * 0.5}
          y1={54 - offset * 0.5}
          x2={14 + offset * 0.5}
          y2={50 - offset * 0.5}
          stroke="#10b981"
          strokeWidth="1.5"
          opacity="0.3"
        />
      ))}

      {/* Input arrow */}
      <path d="M2 32 L8 32 M5 29 L8 32 L5 35" stroke={isDark ? '#fbbf24' : '#d97706'} strokeWidth="2" strokeLinecap="round" />

      {/* P output (transmitted) */}
      <path d="M56 32 L62 32 M59 29 L62 32 L59 35" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      <text x="58" y="42" fontSize="7" fill="#10b981" fontWeight="bold">P</text>

      {/* S output (reflected) */}
      <path d="M32 2 L32 8 M29 5 L32 2 L35 5" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
      <text x="38" y="8" fontSize="7" fill="#ec4899" fontWeight="bold">S</text>
    </svg>
  )
}

// Non-Polarizing Beam Splitter - 非偏振分束器
export function NPBSIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      {/* Cube body */}
      <rect x="10" y="10" width="44" height="44" rx="3"
        fill={isDark ? 'rgba(156, 163, 175, 0.15)' : 'rgba(156, 163, 175, 0.1)'}
        stroke={isDark ? '#9ca3af' : '#6b7280'}
        strokeWidth="2"
      />

      {/* Metal coating diagonal */}
      <line x1="10" y1="54" x2="54" y2="10" stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="3" opacity="0.5" />

      {/* 50/50 label */}
      <text x="32" y="35" fontSize="10" fill={isDark ? '#e2e8f0' : '#1e293b'} textAnchor="middle" fontWeight="bold">50:50</text>

      {/* Bidirectional arrows */}
      <path d="M2 32 L8 32 M5 29 L8 32 L5 35" stroke={isDark ? '#fbbf24' : '#d97706'} strokeWidth="2" strokeLinecap="round" />
      <path d="M56 32 L62 32" stroke={isDark ? '#fbbf24' : '#d97706'} strokeWidth="2" opacity="0.5" />
      <path d="M32 2 L32 8" stroke={isDark ? '#fbbf24' : '#d97706'} strokeWidth="2" opacity="0.5" />
    </svg>
  )
}

// Calcite Beam Displacer - 方解石分束位移器
export function CalciteDisplacerIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="calcite-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#a5f3fc' : '#67e8f9'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isDark ? '#06b6d4' : '#0891b2'} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Crystal body - parallelogram shape */}
      <path
        d="M12 50 L22 14 L52 14 L42 50 Z"
        fill="url(#calcite-grad)"
        stroke={isDark ? '#22d3ee' : '#06b6d4'}
        strokeWidth="2"
      />

      {/* Crystal cleavage lines */}
      <path d="M20 40 L30 16" stroke={isDark ? '#22d3ee' : '#06b6d4'} strokeWidth="1" opacity="0.3" />
      <path d="M28 40 L38 16" stroke={isDark ? '#22d3ee' : '#06b6d4'} strokeWidth="1" opacity="0.3" />
      <path d="M36 40 L46 16" stroke={isDark ? '#22d3ee' : '#06b6d4'} strokeWidth="1" opacity="0.3" />

      {/* Input beam */}
      <path d="M2 32 L12 32" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />

      {/* O-ray output */}
      <path d="M42 32 L58 32" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <text x="60" y="30" fontSize="7" fill="#ef4444" fontWeight="bold">o</text>

      {/* E-ray output (displaced) */}
      <path d="M42 22 L58 22" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
      <text x="60" y="20" fontSize="7" fill="#22c55e" fontWeight="bold">e</text>

      {/* Walk-off indicator */}
      <path d="M52 22 L52 32" stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth="1" strokeDasharray="2 1" />
    </svg>
  )
}

// Glan-Thompson Prism - 格兰-汤姆逊棱镜
export function GlanThompsonIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="glan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Two prism halves */}
      <path d="M8 12 L30 12 L30 52 L8 52 Z" fill="url(#glan-grad)" stroke={isDark ? '#3b82f6' : '#2563eb'} strokeWidth="2" />
      <path d="M34 12 L56 12 L56 52 L34 52 Z" fill="url(#glan-grad)" stroke={isDark ? '#3b82f6' : '#2563eb'} strokeWidth="2" />

      {/* Cement layer */}
      <rect x="30" y="12" width="4" height="40" fill={isDark ? '#fbbf24' : '#f59e0b'} opacity="0.3" />

      {/* Diagonal interface */}
      <line x1="30" y1="52" x2="34" y2="12" stroke={isDark ? '#fbbf24' : '#f59e0b'} strokeWidth="2" opacity="0.5" />

      {/* Input beam */}
      <path d="M2 32 L8 32" stroke="#fbbf24" strokeWidth="2" />

      {/* Transmitted e-ray */}
      <path d="M56 32 L62 32" stroke="#22c55e" strokeWidth="2" />

      {/* Rejected o-ray (reflected out) */}
      <path d="M32 12 L32 4" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 1" opacity="0.6" />
    </svg>
  )
}

// Wollaston Prism - 沃拉斯顿棱镜
export function WollastonPrismIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="wollaston-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* First wedge */}
      <path d="M8 52 L32 8 L32 52 Z" fill="url(#wollaston-grad)" stroke={isDark ? '#22d3ee' : '#0891b2'} strokeWidth="2" />

      {/* Second wedge */}
      <path d="M32 8 L56 52 L32 52 Z" fill="url(#wollaston-grad)" stroke={isDark ? '#22d3ee' : '#0891b2'} strokeWidth="2" />

      {/* Optic axis indicators */}
      <line x1="14" y1="40" x2="26" y2="40" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="2 1" />
      <line x1="38" y1="20" x2="38" y2="44" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="2 1" />

      {/* Input beam */}
      <path d="M2 40 L20 40" stroke="#fbbf24" strokeWidth="2" />

      {/* Diverging output beams */}
      <path d="M44 30 L60 20" stroke="#ef4444" strokeWidth="2" />
      <path d="M44 44 L60 54" stroke="#22c55e" strokeWidth="2" />

      {/* Angle indicator */}
      <path d="M52 30 Q56 37, 52 44" fill="none" stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth="1" />
    </svg>
  )
}

// Wire Grid Polarizer - 金属线栅偏振器
export function WireGridPolarizerIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      {/* Frame */}
      <rect x="8" y="8" width="48" height="48" rx="4" fill="none" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="2" />

      {/* Wire grid pattern */}
      <g stroke={isDark ? '#fbbf24' : '#d97706'} strokeWidth="1.5">
        {[16, 22, 28, 34, 40, 46].map((x) => (
          <line key={x} x1={x} y1="12" x2={x} y2="52" opacity="0.8" />
        ))}
      </g>

      {/* Substrate */}
      <rect x="12" y="12" width="40" height="40" rx="2" fill={isDark ? '#1e293b' : '#f1f5f9'} opacity="0.3" />

      {/* Transmitted polarization arrow */}
      <path d="M32 56 L32 62" stroke="#22c55e" strokeWidth="2" />
      <polygon points="32,64 29,60 35,60" fill="#22c55e" />

      {/* Reflected polarization arrow */}
      <path d="M56 32 L62 32" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
    </svg>
  )
}

// UC2 Polarizer Cube - UC2偏振片模块
export function UC2PolarizerIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      {/* 3D cube effect */}
      <path d="M32 4 L56 16 L56 48 L32 60 L8 48 L8 16 Z" fill={isDark ? '#1e293b' : '#e2e8f0'} stroke={isDark ? '#10b981' : '#059669'} strokeWidth="2" />

      {/* Top face */}
      <path d="M32 4 L56 16 L32 28 L8 16 Z" fill={isDark ? '#334155' : '#f1f5f9'} stroke={isDark ? '#10b981' : '#059669'} strokeWidth="1" />

      {/* Polarizer insert (circular) */}
      <ellipse cx="32" cy="38" rx="16" ry="10" fill={isDark ? '#1e1e3f' : '#e0e7ff'} stroke="#6366f1" strokeWidth="1.5" />

      {/* Polarization lines */}
      <line x1="32" y1="30" x2="32" y2="46" stroke="#6366f1" strokeWidth="1.5" />
      <line x1="20" y1="38" x2="44" y2="38" stroke="#6366f1" strokeWidth="0.5" opacity="0.5" />

      {/* Mounting holes */}
      <circle cx="14" cy="24" r="2" fill={isDark ? '#0f172a' : '#1e293b'} />
      <circle cx="50" cy="24" r="2" fill={isDark ? '#0f172a' : '#1e293b'} />

      {/* UC2 label */}
      <text x="32" y="54" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">UC2</text>
    </svg>
  )
}

// Nicol Prism - 尼科尔棱镜
export function NicolPrismIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="nicol-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Elongated prism shape */}
      <path d="M6 20 L22 8 L58 44 L42 56 Z" fill="url(#nicol-grad)" stroke={isDark ? '#8b5cf6' : '#7c3aed'} strokeWidth="2" />

      {/* Diagonal cement layer (Canada balsam) */}
      <line x1="20" y1="18" x2="44" y2="46" stroke={isDark ? '#fcd34d' : '#f59e0b'} strokeWidth="3" opacity="0.5" />

      {/* Input beam */}
      <path d="M2 26 L14 22" stroke="#fbbf24" strokeWidth="2" />

      {/* Output e-ray */}
      <path d="M50 50 L60 56" stroke="#22c55e" strokeWidth="2" />

      {/* Rejected o-ray (exits side) */}
      <path d="M32 32 L40 24" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 1" opacity="0.6" />
    </svg>
  )
}

// Map device IDs to their icon components
export const DeviceIconMap: Record<string, React.ComponentType<DeviceIconProps>> = {
  'linear-polarizer': LinearPolarizerIcon,
  'circular-polarizer': CircularPolarizerIcon,
  'wire-grid-polarizer': WireGridPolarizerIcon,
  'quarter-wave-plate': QuarterWavePlateIcon,
  'half-wave-plate': HalfWavePlateIcon,
  'pbs': PBSIcon,
  'npbs': NPBSIcon,
  'calcite-splitter': CalciteDisplacerIcon,
  'glan-thompson': GlanThompsonIcon,
  'glan-taylor': GlanThompsonIcon, // Similar appearance
  'glan-laser': GlanThompsonIcon,
  'glan-foucault': GlanThompsonIcon,
  'wollaston-prism': WollastonPrismIcon,
  'rochon-prism': WollastonPrismIcon, // Similar appearance
  'senarmont-prism': WollastonPrismIcon,
  'nicol-prism': NicolPrismIcon,
  'uc2-polarizer-cube': UC2PolarizerIcon,
  'uc2-waveplate-holder': UC2PolarizerIcon,
  'uc2-led-matrix': UC2PolarizerIcon,
}

// Default fallback icon for devices without specific icons
export function DefaultDeviceIcon({ className, size = 64, theme = 'dark' }: DeviceIconProps) {
  const isDark = theme === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <circle cx="32" cy="32" r="24" fill="none" stroke={isDark ? '#6366f1' : '#818cf8'} strokeWidth="2" />
      <circle cx="32" cy="32" r="16" fill={isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'} />
      <circle cx="32" cy="32" r="6" fill={isDark ? '#6366f1' : '#818cf8'} />
    </svg>
  )
}
