/**
 * Animated Module Icons for Homepage
 * 首页模块动画图标
 *
 * Design inspired by PolarCraftLogo with:
 * - Light beam animations
 * - Polarization colors (0°=red, 45°=orange, 90°=green, 135°=blue)
 * - Glow effects and pulse animations
 * - Interactive hover states
 */

import { cn } from '@/lib/utils'

interface AnimatedIconProps {
  className?: string
  size?: number
  isHovered?: boolean
  theme?: 'dark' | 'light'
}

// Polarization colors matching PolarCraftLogo
const POLAR_COLORS = {
  deg0: '#ff4444',    // 0° - Red (horizontal)
  deg45: '#ffaa00',   // 45° - Orange
  deg90: '#44ff44',   // 90° - Green (vertical)
  deg135: '#4488ff',  // 135° - Blue
}

/**
 * 1. History Module Icon - 实验内容与历史故事
 * Design: Hourglass with flowing light particles
 */
export function HistoryModuleIcon({ className, size = 64, isHovered, theme = 'dark' }: AnimatedIconProps) {
  const primaryColor = theme === 'dark' ? '#fbbf24' : '#d97706'
  const glowColor = theme === 'dark' ? 'rgba(251, 191, 36, 0.6)' : 'rgba(217, 119, 6, 0.4)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-500', className)}
    >
      <defs>
        <linearGradient id="history-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="50%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>
        <linearGradient id="history-light-flow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={POLAR_COLORS.deg0} stopOpacity="0.9" />
          <stop offset="33%" stopColor={POLAR_COLORS.deg45} stopOpacity="0.8" />
          <stop offset="66%" stopColor={POLAR_COLORS.deg90} stopOpacity="0.8" />
          <stop offset="100%" stopColor={POLAR_COLORS.deg135} stopOpacity="0.9" />
        </linearGradient>
        <filter id="history-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer decorative ring */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke="url(#history-grad)"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.3"
        className={isHovered ? 'animate-spin' : ''}
        style={{ animationDuration: '20s' }}
      />

      {/* Hourglass frame */}
      <path
        d="M18 10 L46 10 L46 16 L36 28 L36 36 L46 48 L46 54 L18 54 L18 48 L28 36 L28 28 L18 16 Z"
        fill="none"
        stroke="url(#history-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={isHovered ? 'url(#history-glow)' : undefined}
      />

      {/* Top sand/light */}
      <path
        d="M22 14 L42 14 L42 18 L35 26 L29 26 L22 18 Z"
        fill="url(#history-light-flow)"
        opacity={isHovered ? 0.8 : 0.5}
        className="transition-opacity duration-300"
      />

      {/* Bottom sand/light */}
      <path
        d="M22 50 L42 50 L42 46 L35 38 L29 38 L22 46 Z"
        fill="url(#history-light-flow)"
        opacity={isHovered ? 0.9 : 0.6}
        className="transition-opacity duration-300"
      />

      {/* Flowing light particles */}
      <g className={isHovered ? 'animate-pulse' : ''}>
        <circle cx="32" cy="20" r="2" fill={POLAR_COLORS.deg0} opacity="0.8" filter="url(#history-glow)" />
        <circle cx="32" cy="28" r="1.5" fill={POLAR_COLORS.deg45} opacity="0.9" filter="url(#history-glow)" />
        <circle cx="32" cy="36" r="1.5" fill={POLAR_COLORS.deg90} opacity="0.9" filter="url(#history-glow)" />
        <circle cx="32" cy="44" r="2" fill={POLAR_COLORS.deg135} opacity="0.8" filter="url(#history-glow)" />
      </g>

      {/* Center glow */}
      <circle
        cx="32"
        cy="32"
        r="4"
        fill={glowColor}
        filter="url(#history-glow)"
        className={isHovered ? 'animate-ping' : 'animate-pulse'}
        style={{ animationDuration: isHovered ? '1s' : '2s' }}
      />

      {/* Timeline markers */}
      <g opacity={isHovered ? 0.8 : 0.4} className="transition-opacity duration-300">
        <circle cx="12" cy="32" r="2" fill={POLAR_COLORS.deg0} />
        <circle cx="52" cy="32" r="2" fill={POLAR_COLORS.deg90} />
        <line x1="14" y1="32" x2="18" y2="32" stroke="url(#history-grad)" strokeWidth="1" />
        <line x1="46" y1="32" x2="50" y2="32" stroke="url(#history-grad)" strokeWidth="1" />
      </g>
    </svg>
  )
}

/**
 * 2. Arsenal Module Icon - 光学器件和典型光路
 * Design: Crystal prism with refracted light beams
 */
export function ArsenalModuleIcon({ className, size = 64, isHovered, theme = 'dark' }: AnimatedIconProps) {
  const primaryColor = theme === 'dark' ? '#22d3ee' : '#0891b2'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-500', className)}
    >
      <defs>
        <linearGradient id="arsenal-crystal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.9" />
          <stop offset="50%" stopColor="#a5f3fc" stopOpacity="0.7" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="arsenal-beam-in" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
        </linearGradient>
        <filter id="arsenal-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Incoming white light beam */}
      <line
        x1="4"
        y1="32"
        x2="22"
        y2="32"
        stroke="url(#arsenal-beam-in)"
        strokeWidth={isHovered ? 4 : 3}
        strokeLinecap="round"
        filter="url(#arsenal-glow)"
        className="transition-all duration-300"
      />

      {/* Crystal prism */}
      <path
        d="M24 12 L48 32 L24 52 Z"
        fill="none"
        stroke="url(#arsenal-crystal)"
        strokeWidth="3"
        strokeLinejoin="round"
        filter={isHovered ? 'url(#arsenal-glow)' : undefined}
      />

      {/* Crystal facets */}
      <path
        d="M24 12 L36 32 L24 52 M36 32 L48 32"
        stroke="url(#arsenal-crystal)"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Refracted light beams - spread out on hover */}
      <g className="transition-all duration-500">
        {/* Red beam (0°) */}
        <line
          x1="40"
          y1="27"
          x2={isHovered ? 60 : 54}
          y2={isHovered ? 14 : 18}
          stroke={POLAR_COLORS.deg0}
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#arsenal-glow)"
          opacity={isHovered ? 1 : 0.7}
          className="transition-all duration-300"
        />
        {/* Orange beam (45°) */}
        <line
          x1="44"
          y1="29"
          x2={isHovered ? 62 : 56}
          y2={isHovered ? 24 : 26}
          stroke={POLAR_COLORS.deg45}
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#arsenal-glow)"
          opacity={isHovered ? 1 : 0.7}
          className="transition-all duration-300"
        />
        {/* Green beam (90°) */}
        <line
          x1="46"
          y1="32"
          x2={isHovered ? 62 : 56}
          y2="32"
          stroke={POLAR_COLORS.deg90}
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#arsenal-glow)"
          opacity={isHovered ? 1 : 0.7}
          className="transition-all duration-300"
        />
        {/* Blue beam (135°) */}
        <line
          x1="44"
          y1="35"
          x2={isHovered ? 62 : 56}
          y2={isHovered ? 40 : 38}
          stroke={POLAR_COLORS.deg135}
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#arsenal-glow)"
          opacity={isHovered ? 1 : 0.7}
          className="transition-all duration-300"
        />
        {/* Extra violet beam on hover */}
        <line
          x1="40"
          y1="37"
          x2={isHovered ? 60 : 54}
          y2={isHovered ? 50 : 46}
          stroke="#a855f7"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#arsenal-glow)"
          opacity={isHovered ? 1 : 0.7}
          className="transition-all duration-300"
        />
      </g>

      {/* Crystal center glow */}
      <circle
        cx="36"
        cy="32"
        r={isHovered ? 6 : 4}
        fill={primaryColor}
        opacity={isHovered ? 0.5 : 0.3}
        filter="url(#arsenal-glow)"
        className="transition-all duration-300"
      />
    </svg>
  )
}

/**
 * 3. Theory Module Icon - 基本理论和计算模拟
 * Design: Mathematical formulas with light waves
 */
export function TheoryModuleIcon({ className, size = 64, isHovered, theme = 'dark' }: AnimatedIconProps) {
  const primaryColor = theme === 'dark' ? '#818cf8' : '#4f46e5'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-500', className)}
    >
      <defs>
        <linearGradient id="theory-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor="#a5b4fc" />
        </linearGradient>
        <filter id="theory-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Matrix brackets */}
      <g opacity={isHovered ? 1 : 0.8} className="transition-opacity duration-300">
        <path
          d="M12 16 L8 16 L8 48 L12 48"
          fill="none"
          stroke="url(#theory-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M52 16 L56 16 L56 48 L52 48"
          fill="none"
          stroke="url(#theory-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Matrix elements - Jones vectors */}
      <g filter={isHovered ? 'url(#theory-glow)' : undefined}>
        {/* cos θ */}
        <text
          x="20"
          y="28"
          fill="url(#theory-grad)"
          fontSize="10"
          fontFamily="serif"
          fontStyle="italic"
          opacity={isHovered ? 1 : 0.7}
        >
          cos
        </text>
        <text
          x="38"
          y="28"
          fill={POLAR_COLORS.deg0}
          fontSize="10"
          fontFamily="serif"
          fontStyle="italic"
        >
          θ
        </text>

        {/* sin θ */}
        <text
          x="20"
          y="44"
          fill="url(#theory-grad)"
          fontSize="10"
          fontFamily="serif"
          fontStyle="italic"
          opacity={isHovered ? 1 : 0.7}
        >
          sin
        </text>
        <text
          x="38"
          y="44"
          fill={POLAR_COLORS.deg90}
          fontSize="10"
          fontFamily="serif"
          fontStyle="italic"
        >
          θ
        </text>
      </g>

      {/* Wave visualization at top */}
      <path
        d={isHovered
          ? "M8 8 Q16 2, 24 8 T40 8 T56 8"
          : "M12 10 Q20 6, 28 10 T44 10 T52 10"
        }
        fill="none"
        stroke="url(#theory-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#theory-glow)"
        opacity="0.6"
        className="transition-all duration-500"
      />

      {/* Wave visualization at bottom */}
      <path
        d={isHovered
          ? "M8 56 Q16 62, 24 56 T40 56 T56 56"
          : "M12 54 Q20 58, 28 54 T44 54 T52 54"
        }
        fill="none"
        stroke="url(#theory-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#theory-glow)"
        opacity="0.6"
        className="transition-all duration-500"
      />

      {/* Floating polarization dots */}
      <g className={isHovered ? 'animate-pulse' : ''} style={{ animationDuration: '1.5s' }}>
        <circle cx="48" cy="20" r="3" fill={POLAR_COLORS.deg0} opacity="0.6" filter="url(#theory-glow)" />
        <circle cx="16" cy="56" r="3" fill={POLAR_COLORS.deg90} opacity="0.6" filter="url(#theory-glow)" />
      </g>

      {/* Center glow */}
      <circle
        cx="32"
        cy="32"
        r={isHovered ? 8 : 0}
        fill={primaryColor}
        opacity="0.2"
        filter="url(#theory-glow)"
        className="transition-all duration-500"
      />
    </svg>
  )
}

/**
 * 4. Games Module Icon - 课程内容的游戏化改造
 * Design: Game controller with polarization light effects
 */
export function GamesModuleIcon({ className, size = 64, isHovered, theme = 'dark' }: AnimatedIconProps) {
  const primaryColor = theme === 'dark' ? '#34d399' : '#059669'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-500', className)}
    >
      <defs>
        <linearGradient id="games-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
        <filter id="games-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Controller body */}
      <path
        d="M8 28 Q8 20 16 20 L48 20 Q56 20 56 28 L56 40 Q56 48 48 48 L40 48 L36 56 L28 56 L24 48 L16 48 Q8 48 8 40 Z"
        fill="none"
        stroke="url(#games-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        filter={isHovered ? 'url(#games-glow)' : undefined}
      />

      {/* D-pad */}
      <g>
        <rect x="16" y="30" width="4" height="10" rx="1" fill="url(#games-grad)" opacity="0.6" />
        <rect x="13" y="33" width="10" height="4" rx="1" fill="url(#games-grad)" opacity="0.6" />
      </g>

      {/* Action buttons - polarization colors */}
      <g className={isHovered ? 'animate-pulse' : ''} style={{ animationDuration: '0.8s' }}>
        <circle cx="44" cy="28" r="3.5" fill={POLAR_COLORS.deg90} filter="url(#games-glow)" />
        <circle cx="50" cy="34" r="3.5" fill={POLAR_COLORS.deg0} filter="url(#games-glow)" />
        <circle cx="44" cy="40" r="3.5" fill={POLAR_COLORS.deg135} filter="url(#games-glow)" />
        <circle cx="38" cy="34" r="3.5" fill={POLAR_COLORS.deg45} filter="url(#games-glow)" />
      </g>

      {/* Light beam effects on hover */}
      {isHovered && (
        <g>
          <line x1="44" y1="8" x2="44" y2="16" stroke={POLAR_COLORS.deg90} strokeWidth="2" strokeLinecap="round" filter="url(#games-glow)" opacity="0.8" />
          <line x1="50" y1="12" x2="54" y2="8" stroke={POLAR_COLORS.deg0} strokeWidth="2" strokeLinecap="round" filter="url(#games-glow)" opacity="0.8" />
          <line x1="38" y1="12" x2="34" y2="8" stroke={POLAR_COLORS.deg45} strokeWidth="2" strokeLinecap="round" filter="url(#games-glow)" opacity="0.8" />
        </g>
      )}

      {/* Center light indicator */}
      <circle
        cx="32"
        cy="34"
        r={isHovered ? 4 : 3}
        fill={primaryColor}
        filter="url(#games-glow)"
        className="transition-all duration-300"
      />

      {/* Decorative waves */}
      <path
        d={isHovered
          ? "M4 38 Q8 34, 12 38"
          : "M6 38 Q8 36, 10 38"
        }
        fill="none"
        stroke="url(#games-grad)"
        strokeWidth="1.5"
        opacity="0.5"
        className="transition-all duration-300"
      />
      <path
        d={isHovered
          ? "M52 38 Q56 34, 60 38"
          : "M54 38 Q56 36, 58 38"
        }
        fill="none"
        stroke="url(#games-grad)"
        strokeWidth="1.5"
        opacity="0.5"
        className="transition-all duration-300"
      />
    </svg>
  )
}

/**
 * 5. Gallery Module Icon - 成果展示
 * Design: Star/award with radiating light
 */
export function GalleryModuleIcon({ className, size = 64, isHovered, theme = 'dark' }: AnimatedIconProps) {
  const primaryColor = theme === 'dark' ? '#f472b6' : '#db2777'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-500', className)}
    >
      <defs>
        <linearGradient id="gallery-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor="#f9a8d4" />
        </linearGradient>
        <linearGradient id="gallery-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={POLAR_COLORS.deg0} />
          <stop offset="33%" stopColor={POLAR_COLORS.deg45} />
          <stop offset="66%" stopColor={POLAR_COLORS.deg90} />
          <stop offset="100%" stopColor={POLAR_COLORS.deg135} />
        </linearGradient>
        <filter id="gallery-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke="url(#gallery-grad)"
        strokeWidth="1"
        strokeDasharray={isHovered ? "8 4" : "4 4"}
        opacity="0.4"
        className={isHovered ? 'animate-spin' : ''}
        style={{ animationDuration: '10s' }}
      />

      {/* Star shape */}
      <path
        d="M32 6 L36 24 L54 24 L40 34 L44 52 L32 42 L20 52 L24 34 L10 24 L28 24 Z"
        fill="url(#gallery-grad)"
        opacity={isHovered ? 0.4 : 0.2}
        className="transition-opacity duration-300"
      />
      <path
        d="M32 6 L36 24 L54 24 L40 34 L44 52 L32 42 L20 52 L24 34 L10 24 L28 24 Z"
        fill="none"
        stroke="url(#gallery-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        filter={isHovered ? 'url(#gallery-glow)' : undefined}
      />

      {/* Inner diamond */}
      <path
        d="M32 20 L38 32 L32 44 L26 32 Z"
        fill="url(#gallery-rainbow)"
        opacity={isHovered ? 0.8 : 0.5}
        filter="url(#gallery-glow)"
        className="transition-opacity duration-300"
      />

      {/* Radiating light rays on hover */}
      <g opacity={isHovered ? 1 : 0} className="transition-opacity duration-500">
        <line x1="32" y1="4" x2="32" y2="0" stroke={POLAR_COLORS.deg0} strokeWidth="2" strokeLinecap="round" filter="url(#gallery-glow)" />
        <line x1="56" y1="16" x2="60" y2="12" stroke={POLAR_COLORS.deg45} strokeWidth="2" strokeLinecap="round" filter="url(#gallery-glow)" />
        <line x1="60" y1="32" x2="64" y2="32" stroke={POLAR_COLORS.deg90} strokeWidth="2" strokeLinecap="round" filter="url(#gallery-glow)" />
        <line x1="56" y1="48" x2="60" y2="52" stroke={POLAR_COLORS.deg135} strokeWidth="2" strokeLinecap="round" filter="url(#gallery-glow)" />
        <line x1="8" y1="16" x2="4" y2="12" stroke={POLAR_COLORS.deg135} strokeWidth="2" strokeLinecap="round" filter="url(#gallery-glow)" />
        <line x1="4" y1="32" x2="0" y2="32" stroke={POLAR_COLORS.deg90} strokeWidth="2" strokeLinecap="round" filter="url(#gallery-glow)" />
        <line x1="8" y1="48" x2="4" y2="52" stroke={POLAR_COLORS.deg45} strokeWidth="2" strokeLinecap="round" filter="url(#gallery-glow)" />
      </g>

      {/* Center glow */}
      <circle
        cx="32"
        cy="32"
        r={isHovered ? 8 : 5}
        fill={primaryColor}
        opacity={isHovered ? 0.6 : 0.4}
        filter="url(#gallery-glow)"
        className={`transition-all duration-300 ${isHovered ? 'animate-pulse' : ''}`}
      />

      {/* Sparkle dots */}
      <g className={isHovered ? 'animate-pulse' : ''}>
        <circle cx="12" cy="12" r="2" fill={POLAR_COLORS.deg0} opacity="0.6" />
        <circle cx="52" cy="12" r="2" fill={POLAR_COLORS.deg45} opacity="0.6" />
        <circle cx="52" cy="52" r="2" fill={POLAR_COLORS.deg90} opacity="0.6" />
        <circle cx="12" cy="52" r="2" fill={POLAR_COLORS.deg135} opacity="0.6" />
      </g>
    </svg>
  )
}

/**
 * 6. Research Module Icon - 虚拟课题组
 * Design: Flask with polarized light experiment
 */
export function ResearchModuleIcon({ className, size = 64, isHovered, theme = 'dark' }: AnimatedIconProps) {
  const primaryColor = theme === 'dark' ? '#2dd4bf' : '#0d9488'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('transition-all duration-500', className)}
    >
      <defs>
        <linearGradient id="research-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor="#5eead4" />
        </linearGradient>
        <linearGradient id="research-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0.7" />
        </linearGradient>
        <filter id="research-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Flask outline */}
      <path
        d="M24 8 L24 20 L12 48 L12 54 L52 54 L52 48 L40 20 L40 8"
        fill="none"
        stroke="url(#research-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={isHovered ? 'url(#research-glow)' : undefined}
      />

      {/* Flask neck */}
      <rect x="24" y="4" width="16" height="6" rx="2" fill="url(#research-grad)" opacity="0.4" />

      {/* Liquid inside */}
      <path
        d="M16 42 L48 42 L52 48 L52 54 L12 54 L12 48 Z"
        fill="url(#research-liquid)"
      />

      {/* Light beam through liquid */}
      <g filter="url(#research-glow)">
        <line
          x1="8"
          y1="46"
          x2="20"
          y2="46"
          stroke={POLAR_COLORS.deg0}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={isHovered ? 1 : 0.7}
        />
        <line
          x1="44"
          y1="46"
          x2="56"
          y2="46"
          stroke={POLAR_COLORS.deg90}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={isHovered ? 1 : 0.7}
        />
      </g>

      {/* Bubbles with polarization colors */}
      <g className={isHovered ? 'animate-bounce' : ''} style={{ animationDuration: '1s' }}>
        <circle cx="24" cy="48" r="3" fill={POLAR_COLORS.deg0} opacity="0.6" filter="url(#research-glow)" />
        <circle cx="36" cy="50" r="2.5" fill={POLAR_COLORS.deg45} opacity="0.6" filter="url(#research-glow)" />
        <circle cx="30" cy="46" r="2" fill={POLAR_COLORS.deg90} opacity="0.7" filter="url(#research-glow)" />
        <circle cx="40" cy="48" r="1.5" fill={POLAR_COLORS.deg135} opacity="0.6" filter="url(#research-glow)" />
      </g>

      {/* Rising bubbles on hover */}
      {isHovered && (
        <g className="animate-pulse" style={{ animationDuration: '0.5s' }}>
          <circle cx="28" cy="38" r="1.5" fill={POLAR_COLORS.deg45} opacity="0.5" />
          <circle cx="34" cy="34" r="1" fill={POLAR_COLORS.deg90} opacity="0.4" />
          <circle cx="38" cy="40" r="1.5" fill={POLAR_COLORS.deg0} opacity="0.5" />
        </g>
      )}

      {/* Data/formula indicators */}
      <g opacity={isHovered ? 0.8 : 0.4} className="transition-opacity duration-300">
        <text x="4" y="36" fill="url(#research-grad)" fontSize="8" fontFamily="serif" fontStyle="italic">λ</text>
        <text x="54" y="36" fill="url(#research-grad)" fontSize="8" fontFamily="serif" fontStyle="italic">θ</text>
      </g>

      {/* Sparkle effects */}
      <g opacity={isHovered ? 1 : 0.5} className="transition-opacity duration-300">
        <circle cx="56" cy="12" r="2" fill={primaryColor} filter="url(#research-glow)" />
        <circle cx="8" cy="16" r="1.5" fill={primaryColor} filter="url(#research-glow)" />
      </g>
    </svg>
  )
}

// Export map for easy lookup
export const HomeModuleIconMap = {
  history: HistoryModuleIcon,
  arsenal: ArsenalModuleIcon,
  theory: TheoryModuleIcon,
  games: GamesModuleIcon,
  gallery: GalleryModuleIcon,
  research: ResearchModuleIcon,
}

export type HomeModuleIconKey = keyof typeof HomeModuleIconMap
