/**
 * Device Icons - SVG visualizations for polarization optical devices
 * 器件图标 - 偏振光学器件的SVG可视化
 *
 * Redesigned with modern, consistent style matching ModuleIcons
 * 重新设计，与模块图标保持一致的现代风格
 */

import { cn } from '@/lib/utils'

interface DeviceIconProps {
  className?: string
  size?: number
  theme?: 'dark' | 'light'
  primaryColor?: string
  secondaryColor?: string
}

// Linear Polarizer - 线偏振片
export function LinearPolarizerIcon({
  className,
  size = 64,
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const primary = primaryColor || '#6366f1'
  const secondary = secondaryColor || '#4f46e5'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="lp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="lp-disc" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.2" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.4" />
        </linearGradient>
        <filter id="lp-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer mount ring */}
      <circle
        cx="32" cy="32" r="27"
        fill="none"
        stroke="url(#lp-grad)"
        strokeWidth="3"
        opacity="0.8"
      />

      {/* Polarizer disc */}
      <circle cx="32" cy="32" r="22" fill="url(#lp-disc)" />

      {/* Half-filled transmission effect */}
      <path
        d="M32 10 A22 22 0 0 1 32 54"
        fill="url(#lp-grad)"
        opacity="0.35"
      />

      {/* Central transmission axis */}
      <line
        x1="32" y1="12" x2="32" y2="52"
        stroke="url(#lp-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#lp-glow)"
      />

      {/* Subtle grid lines */}
      {[-12, -6, 6, 12].map((offset) => (
        <line
          key={offset}
          x1={32 + offset}
          y1={14 + Math.abs(offset) * 0.6}
          x2={32 + offset}
          y2={50 - Math.abs(offset) * 0.6}
          stroke="url(#lp-grad)"
          strokeWidth="1"
          opacity="0.25"
        />
      ))}

      {/* Direction arrows */}
      <path d="M32 6 L28 14 L36 14 Z" fill="url(#lp-grad)" opacity="0.8" />
      <path d="M32 58 L28 50 L36 50 Z" fill="url(#lp-grad)" opacity="0.8" />
    </svg>
  )
}

// Circular Polarizer - 圆偏振片
export function CircularPolarizerIcon({
  className,
  size = 64,
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const primary = primaryColor || '#8b5cf6'
  const secondary = secondaryColor || '#7c3aed'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="cp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="cp-disc" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.15" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.3" />
        </linearGradient>
        <filter id="cp-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle
        cx="32" cy="32" r="27"
        fill="none"
        stroke="url(#cp-grad)"
        strokeWidth="3"
        opacity="0.8"
      />

      {/* Disc background */}
      <circle cx="32" cy="32" r="22" fill="url(#cp-disc)" />

      {/* Spiral pattern - circular polarization */}
      <path
        d="M32 14 Q46 18, 48 32 Q50 46, 36 50 Q22 54, 16 40 Q12 28, 24 18 Q32 14, 32 14"
        fill="none"
        stroke="url(#cp-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
        filter="url(#cp-glow)"
      />

      {/* Inner spiral */}
      <path
        d="M32 20 Q42 22, 44 32 Q46 42, 36 44 Q26 46, 22 36 Q18 28, 28 22 Q32 20, 32 20"
        fill="none"
        stroke="url(#cp-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Center dot with glow */}
      <circle cx="32" cy="32" r="4" fill="url(#cp-grad)" filter="url(#cp-glow)" />

      {/* Rotation arrow */}
      <path
        d="M44 18 L48 14 L50 20"
        fill="none"
        stroke="url(#cp-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  )
}

// Quarter Wave Plate - 四分之一波片
export function QuarterWavePlateIcon({
  className,
  size = 64,
  theme = 'dark',
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const isDark = theme === 'dark'
  const primary = primaryColor || '#a855f7'
  const secondary = secondaryColor || '#9333ea'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="qwp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="qwp-crystal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.15" />
          <stop offset="50%" stopColor={secondary} stopOpacity="0.35" />
          <stop offset="100%" stopColor={primary} stopOpacity="0.15" />
        </linearGradient>
        <filter id="qwp-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Mount ring */}
      <circle
        cx="32" cy="32" r="27"
        fill="none"
        stroke="url(#qwp-grad)"
        strokeWidth="3"
        opacity="0.8"
      />

      {/* Crystal plate */}
      <circle cx="32" cy="32" r="22" fill="url(#qwp-crystal)" />

      {/* Birefringent pattern */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={14 + i * 9}
          y="16"
          width="5"
          height="32"
          rx="1"
          fill="url(#qwp-grad)"
          opacity="0.2"
        />
      ))}

      {/* Fast axis (F) */}
      <line
        x1="10" y1="32" x2="54" y2="32"
        stroke="#f472b6"
        strokeWidth="2"
        strokeDasharray="4 3"
        filter="url(#qwp-glow)"
      />
      <text x="56" y="35" fontSize="8" fill="#f472b6" fontWeight="bold">F</text>

      {/* Slow axis (S) */}
      <line
        x1="32" y1="10" x2="32" y2="54"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeDasharray="4 3"
        filter="url(#qwp-glow)"
      />
      <text x="35" y="9" fontSize="8" fill="#22d3ee" fontWeight="bold">S</text>

      {/* λ/4 label */}
      <rect x="22" y="28" width="20" height="12" rx="3" fill={isDark ? '#1e1b4b' : '#faf5ff'} opacity="0.9" />
      <text x="32" y="38" fontSize="11" fill="url(#qwp-grad)" textAnchor="middle" fontWeight="bold">λ/4</text>
    </svg>
  )
}

// Half Wave Plate - 二分之一波片
export function HalfWavePlateIcon({
  className,
  size = 64,
  theme = 'dark',
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const isDark = theme === 'dark'
  const primary = primaryColor || '#06b6d4'
  const secondary = secondaryColor || '#0891b2'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="hwp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="hwp-crystal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.15" />
          <stop offset="50%" stopColor={secondary} stopOpacity="0.35" />
          <stop offset="100%" stopColor={primary} stopOpacity="0.15" />
        </linearGradient>
        <filter id="hwp-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Mount ring */}
      <circle
        cx="32" cy="32" r="27"
        fill="none"
        stroke="url(#hwp-grad)"
        strokeWidth="3"
        opacity="0.8"
      />

      {/* Crystal plate */}
      <circle cx="32" cy="32" r="22" fill="url(#hwp-crystal)" />

      {/* Birefringent pattern - thicker */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={13 + i * 9}
          y="14"
          width="6"
          height="36"
          rx="1"
          fill="url(#hwp-grad)"
          opacity="0.25"
        />
      ))}

      {/* Rotation indicator arrows */}
      <g stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" filter="url(#hwp-glow)">
        <path d="M16 16 L22 22" />
        <path d="M48 16 L42 22" />
        <path d="M16 48 L22 42" />
        <path d="M48 48 L42 42" />
      </g>

      {/* λ/2 label */}
      <rect x="22" y="28" width="20" height="12" rx="3" fill={isDark ? '#164e63' : '#ecfeff'} opacity="0.9" />
      <text x="32" y="38" fontSize="11" fill="url(#hwp-grad)" textAnchor="middle" fontWeight="bold">λ/2</text>
    </svg>
  )
}

// Polarizing Beam Splitter (PBS) - 偏振分束器
export function PBSIcon({
  className,
  size = 64,
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const primary = primaryColor || '#6366f1'
  const secondary = secondaryColor || '#4f46e5'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="pbs-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="pbs-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.2" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.35" />
        </linearGradient>
        <filter id="pbs-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Cube body */}
      <rect
        x="12" y="12" width="40" height="40" rx="4"
        fill="url(#pbs-face)"
        stroke="url(#pbs-grad)"
        strokeWidth="2.5"
      />

      {/* Diagonal beam splitter coating */}
      <line
        x1="12" y1="52" x2="52" y2="12"
        stroke="#10b981"
        strokeWidth="4"
        opacity="0.7"
        filter="url(#pbs-glow)"
      />

      {/* Input beam */}
      <path
        d="M2 32 L10 32"
        stroke="#fbbf24"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#pbs-glow)"
      />
      <path d="M6 28 L10 32 L6 36" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* P output (transmitted) */}
      <path
        d="M54 32 L62 32"
        stroke="#10b981"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#pbs-glow)"
      />
      <path d="M58 28 L62 32 L58 36" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="56" y="44" fontSize="9" fill="#10b981" fontWeight="bold">P</text>

      {/* S output (reflected) */}
      <path
        d="M32 2 L32 10"
        stroke="#ec4899"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#pbs-glow)"
      />
      <path d="M28 6 L32 2 L36 6" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="38" y="10" fontSize="9" fill="#ec4899" fontWeight="bold">S</text>
    </svg>
  )
}

// Non-Polarizing Beam Splitter - 非偏振分束器
export function NPBSIcon({
  className,
  size = 64,
  theme = 'dark',
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const isDark = theme === 'dark'
  const primary = primaryColor || '#64748b'
  const secondary = secondaryColor || '#475569'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="npbs-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="npbs-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.15" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.3" />
        </linearGradient>
        <filter id="npbs-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Cube body */}
      <rect
        x="12" y="12" width="40" height="40" rx="4"
        fill="url(#npbs-face)"
        stroke="url(#npbs-grad)"
        strokeWidth="2.5"
      />

      {/* Metal coating diagonal */}
      <line
        x1="12" y1="52" x2="52" y2="12"
        stroke="url(#npbs-grad)"
        strokeWidth="3"
        opacity="0.6"
      />

      {/* 50/50 label */}
      <rect x="20" y="26" width="24" height="14" rx="3" fill={isDark ? '#1e293b' : '#f1f5f9'} opacity="0.9" />
      <text x="32" y="37" fontSize="10" fill="url(#npbs-grad)" textAnchor="middle" fontWeight="bold">50:50</text>

      {/* Input arrow */}
      <path
        d="M2 32 L10 32"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#npbs-glow)"
      />

      {/* Output indicators */}
      <path d="M54 32 L60 32" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />
      <path d="M32 2 L32 8" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />
    </svg>
  )
}

// Calcite Beam Displacer - 方解石分束位移器
export function CalciteDisplacerIcon({
  className,
  size = 64,
  theme = 'dark',
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const isDark = theme === 'dark'
  const primary = primaryColor || '#22d3ee'
  const secondary = secondaryColor || '#06b6d4'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="calc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="calc-crystal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.2" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.4" />
        </linearGradient>
        <filter id="calc-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Crystal body - parallelogram shape */}
      <path
        d="M14 50 L24 14 L50 14 L40 50 Z"
        fill="url(#calc-crystal)"
        stroke="url(#calc-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Crystal cleavage lines */}
      {[10, 20, 30].map((offset) => (
        <path
          key={offset}
          d={`M${18 + offset * 0.3} 42 L${28 + offset * 0.3} 18`}
          stroke="url(#calc-grad)"
          strokeWidth="1"
          opacity="0.25"
        />
      ))}

      {/* Input beam */}
      <path
        d="M2 32 L14 32"
        stroke="#fbbf24"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#calc-glow)"
      />

      {/* O-ray output (ordinary ray) */}
      <path
        d="M40 32 L58 32"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#calc-glow)"
      />
      <circle cx="60" cy="32" r="3" fill="#ef4444" opacity="0.8" />
      <text x="58" y="44" fontSize="8" fill="#ef4444" fontWeight="bold">o</text>

      {/* E-ray output (extraordinary ray - displaced) */}
      <path
        d="M40 22 L58 22"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#calc-glow)"
      />
      <circle cx="60" cy="22" r="3" fill="#22c55e" opacity="0.8" />
      <text x="58" y="18" fontSize="8" fill="#22c55e" fontWeight="bold">e</text>

      {/* Walk-off indicator */}
      <path
        d="M54 22 L54 32"
        stroke={isDark ? '#94a3b8' : '#64748b'}
        strokeWidth="1.5"
        strokeDasharray="2 2"
        opacity="0.6"
      />
    </svg>
  )
}

// Glan-Thompson Prism - 格兰-汤姆逊棱镜
export function GlanThompsonIcon({
  className,
  size = 64,
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const primary = primaryColor || '#3b82f6'
  const secondary = secondaryColor || '#2563eb'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="glan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="glan-crystal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.15" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.3" />
        </linearGradient>
        <filter id="glan-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* First prism half */}
      <path
        d="M10 14 L30 14 L30 50 L10 50 Z"
        fill="url(#glan-crystal)"
        stroke="url(#glan-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Second prism half */}
      <path
        d="M34 14 L54 14 L54 50 L34 50 Z"
        fill="url(#glan-crystal)"
        stroke="url(#glan-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Cement layer (Canada balsam) */}
      <rect x="30" y="14" width="4" height="36" fill="#fbbf24" opacity="0.35" />

      {/* Diagonal interface */}
      <line
        x1="30" y1="50" x2="34" y2="14"
        stroke="#fbbf24"
        strokeWidth="2.5"
        opacity="0.7"
        filter="url(#glan-glow)"
      />

      {/* Input beam */}
      <path d="M2 32 L10 32" stroke="#fbbf24" strokeWidth="2.5" filter="url(#glan-glow)" />

      {/* Transmitted e-ray */}
      <path d="M54 32 L62 32" stroke="#22c55e" strokeWidth="2.5" filter="url(#glan-glow)" />
      <circle cx="62" cy="32" r="2" fill="#22c55e" />

      {/* Rejected o-ray (reflected out) */}
      <path
        d="M32 14 L32 4"
        stroke="#ef4444"
        strokeWidth="2"
        strokeDasharray="3 2"
        opacity="0.7"
      />
      <circle cx="32" cy="4" r="2" fill="#ef4444" opacity="0.7" />
    </svg>
  )
}

// Wollaston Prism - 沃拉斯顿棱镜
export function WollastonPrismIcon({
  className,
  size = 64,
  theme = 'dark',
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const isDark = theme === 'dark'
  const primary = primaryColor || '#22d3ee'
  const secondary = secondaryColor || '#0891b2'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="woll-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="woll-crystal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.2" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.35" />
        </linearGradient>
        <filter id="woll-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* First wedge */}
      <path
        d="M10 50 L32 10 L32 50 Z"
        fill="url(#woll-crystal)"
        stroke="url(#woll-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Second wedge */}
      <path
        d="M32 10 L54 50 L32 50 Z"
        fill="url(#woll-crystal)"
        stroke="url(#woll-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Optic axis indicators */}
      <line x1="16" y1="38" x2="26" y2="38" stroke="#f472b6" strokeWidth="2" strokeDasharray="3 2" opacity="0.7" />
      <line x1="38" y1="22" x2="38" y2="42" stroke="#f472b6" strokeWidth="2" strokeDasharray="3 2" opacity="0.7" />

      {/* Input beam */}
      <path
        d="M2 38 L18 38"
        stroke="#fbbf24"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#woll-glow)"
      />

      {/* Diverging output beams */}
      <path
        d="M44 28 L60 18"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#woll-glow)"
      />
      <circle cx="60" cy="18" r="3" fill="#ef4444" opacity="0.8" />

      <path
        d="M44 44 L60 54"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#woll-glow)"
      />
      <circle cx="60" cy="54" r="3" fill="#22c55e" opacity="0.8" />

      {/* Angle indicator arc */}
      <path
        d="M52 28 Q58 36, 52 44"
        fill="none"
        stroke={isDark ? '#94a3b8' : '#64748b'}
        strokeWidth="1.5"
        opacity="0.5"
      />
    </svg>
  )
}

// Wire Grid Polarizer - 金属线栅偏振器
export function WireGridPolarizerIcon({
  className,
  size = 64,
  theme = 'dark',
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const isDark = theme === 'dark'
  const primary = primaryColor || '#f59e0b'
  const secondary = secondaryColor || '#d97706'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="wg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="wg-frame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#475569' : '#94a3b8'} />
          <stop offset="100%" stopColor={isDark ? '#334155' : '#cbd5e1'} />
        </linearGradient>
        <filter id="wg-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer frame */}
      <rect
        x="10" y="10" width="44" height="44" rx="5"
        fill="none"
        stroke="url(#wg-frame)"
        strokeWidth="3"
      />

      {/* Substrate background */}
      <rect x="14" y="14" width="36" height="36" rx="3" fill={isDark ? '#1e293b' : '#f8fafc'} opacity="0.5" />

      {/* Wire grid pattern */}
      <g stroke="url(#wg-grad)" strokeWidth="2" filter="url(#wg-glow)">
        {[18, 24, 30, 36, 42].map((x) => (
          <line key={x} x1={x} y1="16" x2={x} y2="48" opacity="0.85" />
        ))}
      </g>

      {/* Transmitted polarization arrow */}
      <path d="M32 52 L32 62" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" filter="url(#wg-glow)" />
      <path d="M28 58 L32 62 L36 58" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Reflected polarization arrow (blocked) */}
      <path d="M56 32 L62 32" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" opacity="0.6" />
    </svg>
  )
}

// UC2 Polarizer Cube - UC2偏振片模块
export function UC2PolarizerIcon({
  className,
  size = 64,
  theme = 'dark',
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const isDark = theme === 'dark'
  const primary = primaryColor || '#10b981'
  const secondary = secondaryColor || '#059669'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="uc2-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="uc2-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.15" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.3" />
        </linearGradient>
        <filter id="uc2-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 3D cube - main body */}
      <path
        d="M32 6 L54 18 L54 46 L32 58 L10 46 L10 18 Z"
        fill="url(#uc2-face)"
        stroke="url(#uc2-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Top face */}
      <path
        d="M32 6 L54 18 L32 30 L10 18 Z"
        fill={isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'}
        stroke="url(#uc2-grad)"
        strokeWidth="1.5"
      />

      {/* Polarizer insert (circular window) */}
      <ellipse
        cx="32" cy="38" rx="14" ry="8"
        fill={isDark ? '#1e1e3f' : '#e0e7ff'}
        stroke="#6366f1"
        strokeWidth="2"
      />

      {/* Polarization lines */}
      <line x1="32" y1="32" x2="32" y2="44" stroke="#6366f1" strokeWidth="2" filter="url(#uc2-glow)" />
      <line x1="22" y1="38" x2="42" y2="38" stroke="#6366f1" strokeWidth="1" opacity="0.4" />

      {/* Mounting holes */}
      <circle cx="16" cy="24" r="2.5" fill={isDark ? '#0f172a' : '#1e293b'} />
      <circle cx="48" cy="24" r="2.5" fill={isDark ? '#0f172a' : '#1e293b'} />

      {/* UC2 label */}
      <text x="32" y="54" fontSize="9" fill="url(#uc2-grad)" textAnchor="middle" fontWeight="bold">UC2</text>
    </svg>
  )
}

// Nicol Prism - 尼科尔棱镜
export function NicolPrismIcon({
  className,
  size = 64,
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const primary = primaryColor || '#8b5cf6'
  const secondary = secondaryColor || '#7c3aed'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="nicol-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="nicol-crystal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.2" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.35" />
        </linearGradient>
        <filter id="nicol-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Elongated prism shape */}
      <path
        d="M8 22 L22 10 L56 44 L42 56 Z"
        fill="url(#nicol-crystal)"
        stroke="url(#nicol-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Diagonal cement layer (Canada balsam) */}
      <line
        x1="22" y1="20" x2="42" y2="46"
        stroke="#fcd34d"
        strokeWidth="4"
        opacity="0.6"
        filter="url(#nicol-glow)"
      />

      {/* Input beam */}
      <path
        d="M2 28 L16 22"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#nicol-glow)"
      />

      {/* Output e-ray */}
      <path
        d="M48 50 L60 58"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#nicol-glow)"
      />
      <circle cx="60" cy="58" r="3" fill="#22c55e" opacity="0.8" />

      {/* Rejected o-ray (exits side) */}
      <path
        d="M32 33 L42 24"
        stroke="#ef4444"
        strokeWidth="2"
        strokeDasharray="3 2"
        opacity="0.7"
      />
      <circle cx="42" cy="24" r="2" fill="#ef4444" opacity="0.7" />
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
  'glan-taylor': GlanThompsonIcon,
  'glan-laser': GlanThompsonIcon,
  'glan-foucault': GlanThompsonIcon,
  'wollaston-prism': WollastonPrismIcon,
  'rochon-prism': WollastonPrismIcon,
  'senarmont-prism': WollastonPrismIcon,
  'nicol-prism': NicolPrismIcon,
  'uc2-polarizer-cube': UC2PolarizerIcon,
  'uc2-waveplate-holder': UC2PolarizerIcon,
  'uc2-led-matrix': UC2PolarizerIcon,
}

// Default fallback icon for devices without specific icons
export function DefaultDeviceIcon({
  className,
  size = 64,
  primaryColor,
  secondaryColor
}: DeviceIconProps) {
  const primary = primaryColor || '#6366f1'
  const secondary = secondaryColor || '#4f46e5'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="default-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <filter id="default-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle
        cx="32" cy="32" r="24"
        fill="none"
        stroke="url(#default-grad)"
        strokeWidth="2.5"
        opacity="0.8"
      />

      {/* Middle ring with fill */}
      <circle
        cx="32" cy="32" r="16"
        fill="url(#default-grad)"
        opacity="0.2"
      />

      {/* Inner glow circle */}
      <circle
        cx="32" cy="32" r="8"
        fill="url(#default-grad)"
        filter="url(#default-glow)"
      />

      {/* Decorative dots */}
      <circle cx="32" cy="12" r="2" fill="url(#default-grad)" opacity="0.6" />
      <circle cx="32" cy="52" r="2" fill="url(#default-grad)" opacity="0.6" />
      <circle cx="12" cy="32" r="2" fill="url(#default-grad)" opacity="0.6" />
      <circle cx="52" cy="32" r="2" fill="url(#default-grad)" opacity="0.6" />
    </svg>
  )
}
