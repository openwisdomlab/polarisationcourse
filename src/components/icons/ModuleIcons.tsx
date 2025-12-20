/**
 * Module Icons - SVG icons for the 9 creative modules
 * 模块图标 - 9个创意模块的SVG图标
 *
 * Designed to work well in both light and dark themes with consistent style
 */

import { cn } from '@/lib/utils'

interface IconProps {
  className?: string
  size?: number
  primaryColor?: string
  secondaryColor?: string
}

// 1. Chronicles of Light - 光的编年史 (Hourglass with light)
export function ChroniclesIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="chronicles-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#C9A227'} />
          <stop offset="100%" stopColor={secondaryColor || '#92650F'} />
        </linearGradient>
        <filter id="chronicles-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Hourglass frame */}
      <path
        d="M12 8 L36 8 L36 12 L28 20 L28 28 L36 36 L36 40 L12 40 L12 36 L20 28 L20 20 L12 12 Z"
        fill="none"
        stroke="url(#chronicles-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sand/light particles flowing */}
      <circle cx="24" cy="16" r="2" fill="url(#chronicles-grad)" opacity="0.9" />
      <circle cx="24" cy="24" r="1.5" fill="url(#chronicles-grad)" opacity="0.7" filter="url(#chronicles-glow)" />
      <circle cx="24" cy="32" r="2.5" fill="url(#chronicles-grad)" opacity="0.8" />
      {/* Light rays */}
      <path
        d="M24 4 L24 6 M18 6 L20 8 M30 6 L28 8"
        stroke="url(#chronicles-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

// 2. Device Library - 偏振器件库 (Crystal prism with light)
export function DeviceLibraryIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="device-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#4169E1'} />
          <stop offset="100%" stopColor={secondaryColor || '#1D4ED8'} />
        </linearGradient>
        <linearGradient id="device-light" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor={primaryColor || '#4169E1'} stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Crystal/prism shape */}
      <path
        d="M24 6 L38 18 L38 30 L24 42 L10 30 L10 18 Z"
        fill="none"
        stroke="url(#device-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner crystal structure */}
      <path
        d="M24 6 L24 42 M10 18 L38 30 M38 18 L10 30"
        stroke="url(#device-grad)"
        strokeWidth="1"
        opacity="0.4"
      />
      {/* Light beam through crystal */}
      <path
        d="M4 24 L10 24"
        stroke="url(#device-light)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Refracted beams */}
      <path
        d="M38 20 L44 16 M38 24 L44 24 M38 28 L44 32"
        stroke="url(#device-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  )
}

// 3. Optical Bench - 光路设计室 (Optical bench with components)
export function OpticalBenchIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="bench-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#6366F1'} />
          <stop offset="100%" stopColor={secondaryColor || '#4338CA'} />
        </linearGradient>
        <filter id="bench-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Optical rail/bench */}
      <rect x="4" y="34" width="40" height="4" rx="2" fill="url(#bench-grad)" opacity="0.3" />
      {/* Light source */}
      <circle cx="10" cy="24" r="4" fill="url(#bench-grad)" filter="url(#bench-glow)" />
      <path d="M14 24 L44 24" stroke="url(#bench-grad)" strokeWidth="2" strokeLinecap="round" opacity="0.6" filter="url(#bench-glow)" />
      {/* Polarizer */}
      <rect x="20" y="16" width="4" height="16" rx="1" fill="url(#bench-grad)" opacity="0.8" />
      <path d="M22 18 L22 30" stroke="white" strokeWidth="0.5" opacity="0.5" />
      {/* Analyzer */}
      <rect x="32" y="16" width="4" height="16" rx="1" fill="url(#bench-grad)" opacity="0.8" />
      <path d="M34 20 L34 28" stroke="white" strokeWidth="0.5" opacity="0.5" transform="rotate(45 34 24)" />
      {/* Detector */}
      <rect x="40" y="20" width="6" height="8" rx="1" fill="url(#bench-grad)" />
    </svg>
  )
}

// 4. Demo Gallery - 偏振演示馆 (Wave with polarization)
export function DemoGalleryIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="demo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#0891B2'} />
          <stop offset="100%" stopColor={secondaryColor || '#0E7490'} />
        </linearGradient>
        <filter id="demo-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Polarizer disc */}
      <circle cx="24" cy="24" r="16" fill="none" stroke="url(#demo-grad)" strokeWidth="2.5" />
      {/* Polarization axis - half filled effect */}
      <path
        d="M24 8 A16 16 0 0 1 24 40"
        fill="url(#demo-grad)"
        opacity="0.4"
      />
      {/* Transmission axis */}
      <path
        d="M24 10 L24 38"
        stroke="url(#demo-grad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Wave indicators */}
      <path
        d="M8 24 Q12 20, 16 24 T24 24"
        fill="none"
        stroke="url(#demo-grad)"
        strokeWidth="1.5"
        opacity="0.6"
        filter="url(#demo-glow)"
      />
      <path
        d="M24 24 Q28 28, 32 24 T40 24"
        fill="none"
        stroke="url(#demo-grad)"
        strokeWidth="1.5"
        opacity="0.4"
        filter="url(#demo-glow)"
      />
      {/* Angle indicator */}
      <circle cx="24" cy="24" r="4" fill="url(#demo-grad)" opacity="0.6" />
    </svg>
  )
}

// 5. PolarQuest - 偏振探秘 (Hexagonal puzzle with light)
export function PolarQuestIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="quest-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#DAA520'} />
          <stop offset="100%" stopColor={secondaryColor || '#D97706'} />
        </linearGradient>
        <filter id="quest-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Main hexagon */}
      <path
        d="M24 4 L40 14 L40 34 L24 44 L8 34 L8 14 Z"
        fill="none"
        stroke="url(#quest-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner hexagon pattern */}
      <path
        d="M24 12 L32 17 L32 27 L24 32 L16 27 L16 17 Z"
        fill="url(#quest-grad)"
        opacity="0.2"
      />
      {/* Light beam through puzzle */}
      <path
        d="M4 24 L44 24"
        stroke="url(#quest-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
        filter="url(#quest-glow)"
      />
      {/* Center light effect */}
      <circle cx="24" cy="24" r="5" fill="url(#quest-grad)" opacity="0.8" filter="url(#quest-glow)" />
      {/* Connecting nodes */}
      <circle cx="24" cy="12" r="2" fill="url(#quest-grad)" opacity="0.6" />
      <circle cx="32" cy="17" r="2" fill="url(#quest-grad)" opacity="0.6" />
      <circle cx="16" cy="17" r="2" fill="url(#quest-grad)" opacity="0.6" />
    </svg>
  )
}

// 6. Gallery/Studio - 偏振造物局 (Creative sparkle with polarization art)
export function GalleryIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="gallery-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#D97A8A'} />
          <stop offset="100%" stopColor={secondaryColor || '#E11D48'} />
        </linearGradient>
        <filter id="gallery-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Main star sparkle */}
      <path
        d="M24 4 L26 18 L40 18 L28 26 L32 40 L24 30 L16 40 L20 26 L8 18 L22 18 Z"
        fill="url(#gallery-grad)"
        opacity="0.3"
      />
      <path
        d="M24 4 L26 18 L40 18 L28 26 L32 40 L24 30 L16 40 L20 26 L8 18 L22 18 Z"
        fill="none"
        stroke="url(#gallery-grad)"
        strokeWidth="2"
        strokeLinejoin="round"
        filter="url(#gallery-glow)"
      />
      {/* Center diamond */}
      <path
        d="M24 16 L28 24 L24 32 L20 24 Z"
        fill="url(#gallery-grad)"
        opacity="0.6"
      />
      {/* Small decorative sparkles */}
      <circle cx="10" cy="10" r="1.5" fill="url(#gallery-grad)" opacity="0.5" />
      <circle cx="38" cy="12" r="1.5" fill="url(#gallery-grad)" opacity="0.5" />
      <circle cx="36" cy="38" r="1.5" fill="url(#gallery-grad)" opacity="0.5" />
    </svg>
  )
}

// 7. Lab Group - 虚拟课题组 (Lab flask with light research)
export function LabGroupIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="lab-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#3AAE8C'} />
          <stop offset="100%" stopColor={secondaryColor || '#059669'} />
        </linearGradient>
        <linearGradient id="lab-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#3AAE8C'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={primaryColor || '#3AAE8C'} stopOpacity="0.7" />
        </linearGradient>
        <filter id="lab-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Flask body */}
      <path
        d="M18 6 L18 16 L8 38 L8 42 L40 42 L40 38 L30 16 L30 6"
        fill="none"
        stroke="url(#lab-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Flask neck */}
      <rect x="18" y="4" width="12" height="4" rx="1" fill="url(#lab-grad)" opacity="0.4" />
      {/* Liquid inside */}
      <path
        d="M12 32 L36 32 L40 38 L40 42 L8 42 L8 38 Z"
        fill="url(#lab-liquid)"
      />
      {/* Light beam inside liquid */}
      <path
        d="M16 36 L32 36"
        stroke="url(#lab-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
        filter="url(#lab-glow)"
      />
      {/* Bubbles */}
      <circle cx="20" cy="36" r="2" fill="url(#lab-grad)" opacity="0.5" />
      <circle cx="28" cy="38" r="1.5" fill="url(#lab-grad)" opacity="0.5" />
      <circle cx="24" cy="34" r="1" fill="url(#lab-grad)" opacity="0.6" />
    </svg>
  )
}

// 8. Applications - 偏振应用图鉴 (Connected nodes showing applications)
export function ApplicationsIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="apps-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#E57373'} />
          <stop offset="100%" stopColor={secondaryColor || '#EF4444'} />
        </linearGradient>
        <filter id="apps-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Center node */}
      <circle cx="24" cy="24" r="6" fill="url(#apps-grad)" opacity="0.8" filter="url(#apps-glow)" />
      {/* Outer ring */}
      <circle cx="24" cy="24" r="14" fill="none" stroke="url(#apps-grad)" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.4" />
      {/* Connecting lines */}
      <path d="M24 10 L24 18" stroke="url(#apps-grad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 30 L24 38" stroke="url(#apps-grad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 24 L18 24" stroke="url(#apps-grad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 24 L38 24" stroke="url(#apps-grad)" strokeWidth="2" strokeLinecap="round" />
      {/* Corner connections */}
      <path d="M14 14 L19 19" stroke="url(#apps-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M34 14 L29 19" stroke="url(#apps-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M14 34 L19 29" stroke="url(#apps-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M34 34 L29 29" stroke="url(#apps-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Outer nodes */}
      <circle cx="24" cy="6" r="3" fill="url(#apps-grad)" opacity="0.6" />
      <circle cx="24" cy="42" r="3" fill="url(#apps-grad)" opacity="0.6" />
      <circle cx="6" cy="24" r="3" fill="url(#apps-grad)" opacity="0.6" />
      <circle cx="42" cy="24" r="3" fill="url(#apps-grad)" opacity="0.6" />
      {/* Decorative asterisk in center */}
      <path d="M24 21 L24 27 M21 24 L27 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}

// 9. Experiments - 偏振实验手册 (Lightning/experiment symbol)
export function ExperimentsIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="exp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#2AA198'} />
          <stop offset="100%" stopColor={secondaryColor || '#0D9488'} />
        </linearGradient>
        <filter id="exp-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Lightning bolt */}
      <path
        d="M28 4 L16 22 L22 22 L18 44 L34 22 L26 22 L32 4 Z"
        fill="url(#exp-grad)"
        opacity="0.3"
      />
      <path
        d="M28 4 L16 22 L22 22 L18 44 L34 22 L26 22 L32 4 Z"
        fill="none"
        stroke="url(#exp-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#exp-glow)"
      />
      {/* Energy sparks */}
      <circle cx="10" cy="16" r="2" fill="url(#exp-grad)" opacity="0.5" />
      <circle cx="38" cy="32" r="2" fill="url(#exp-grad)" opacity="0.5" />
      <circle cx="40" cy="14" r="1.5" fill="url(#exp-grad)" opacity="0.4" />
      <circle cx="8" cy="34" r="1.5" fill="url(#exp-grad)" opacity="0.4" />
      {/* Light waves */}
      <path
        d="M6 24 Q8 22, 10 24 T14 24"
        fill="none"
        stroke="url(#exp-grad)"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M34 24 Q36 26, 38 24 T42 24"
        fill="none"
        stroke="url(#exp-grad)"
        strokeWidth="1.5"
        opacity="0.5"
      />
    </svg>
  )
}

// 10. OpticsLab / Optical Design Studio - 光学设计室 (Optical bench with components and polarized light path)
export function OpticsLabIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        {/* Main gradient - Indigo theme */}
        <linearGradient id="opticslab-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#6366F1'} />
          <stop offset="100%" stopColor={secondaryColor || '#4338CA'} />
        </linearGradient>
        {/* Polarized light colors */}
        <linearGradient id="opticslab-polar-0" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4444" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff6666" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="opticslab-polar-45" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffaa00" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffcc44" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="opticslab-polar-90" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#44ff44" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#66ff66" stopOpacity="0.5" />
        </linearGradient>
        {/* Glow filter */}
        <filter id="opticslab-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Soft glow for beams */}
        <filter id="opticslab-beam-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hexagonal optical table outline */}
      <path
        d="M8 38 L4 24 L8 10 L40 10 L44 24 L40 38 Z"
        fill="none"
        stroke="url(#opticslab-grad)"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Optical rail/bench base */}
      <rect x="6" y="36" width="36" height="4" rx="2" fill="url(#opticslab-grad)" opacity="0.4" />

      {/* Light source emitter */}
      <g>
        <rect x="6" y="20" width="6" height="12" rx="2" fill="url(#opticslab-grad)" opacity="0.9" />
        {/* Emitter aperture */}
        <circle cx="12" cy="26" r="2.5" fill="url(#opticslab-polar-0)" filter="url(#opticslab-glow)" />
        {/* Emitter glow ring */}
        <circle cx="12" cy="26" r="4" fill="none" stroke="#ff4444" strokeWidth="0.5" opacity="0.5" />
      </g>

      {/* Main light beam - 0° polarization (red) */}
      <path
        d="M14 26 L19 26"
        stroke="url(#opticslab-polar-0)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#opticslab-beam-glow)"
      />

      {/* First polarizer */}
      <g>
        <rect x="19" y="17" width="3" height="18" rx="1" fill="url(#opticslab-grad)" opacity="0.85" />
        {/* Polarization axis indicator */}
        <line x1="20.5" y1="19" x2="20.5" y2="33" stroke="white" strokeWidth="0.8" opacity="0.6" />
        {/* Polarizer mount */}
        <circle cx="20.5" cy="26" r="1" fill="url(#opticslab-grad)" />
      </g>

      {/* Light beam after first polarizer - 45° (orange) */}
      <path
        d="M22 26 L27 26"
        stroke="url(#opticslab-polar-45)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#opticslab-beam-glow)"
      />

      {/* Rotator / Wave plate (45° rotation) */}
      <g>
        <ellipse cx="27" cy="26" rx="2.5" ry="6" fill="none" stroke="url(#opticslab-grad)" strokeWidth="2" opacity="0.8" />
        {/* Rotation indicator */}
        <path d="M25.5 22 L28.5 22" stroke="url(#opticslab-grad)" strokeWidth="1" opacity="0.6" />
        <path d="M25.5 30 L28.5 30" stroke="url(#opticslab-grad)" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Light beam after rotator - 90° (green) */}
      <path
        d="M29.5 26 L34 26"
        stroke="url(#opticslab-polar-90)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#opticslab-beam-glow)"
      />

      {/* Analyzer (second polarizer) */}
      <g>
        <rect x="34" y="17" width="3" height="18" rx="1" fill="url(#opticslab-grad)" opacity="0.85" />
        {/* Crossed polarization axis */}
        <line x1="35.5" y1="20" x2="35.5" y2="32" stroke="white" strokeWidth="0.8" opacity="0.4" transform="rotate(45 35.5 26)" />
        {/* Polarizer mount */}
        <circle cx="35.5" cy="26" r="1" fill="url(#opticslab-grad)" />
      </g>

      {/* Final output beam - attenuated */}
      <path
        d="M37 26 L40 26"
        stroke="url(#opticslab-polar-90)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
        filter="url(#opticslab-beam-glow)"
      />

      {/* Detector/sensor */}
      <g>
        <rect x="40" y="20" width="5" height="12" rx="1.5" fill="url(#opticslab-grad)" opacity="0.95" />
        {/* Sensor active area */}
        <rect x="41" y="22" width="3" height="8" rx="0.5" fill="#44ff44" opacity="0.4" />
        {/* Detection indicator */}
        <circle cx="42.5" cy="26" r="1.5" fill="#44ff44" opacity="0.8" filter="url(#opticslab-glow)" />
      </g>

      {/* Polarization state indicators at top */}
      <g opacity="0.7">
        <circle cx="12" cy="8" r="2" fill="#ff4444" />
        <circle cx="24" cy="8" r="2" fill="#ffaa00" />
        <circle cx="36" cy="8" r="2" fill="#44ff44" />
        {/* Connecting line */}
        <path d="M14 8 L22 8 M26 8 L34 8" stroke="url(#opticslab-grad)" strokeWidth="0.5" strokeDasharray="1 1" />
      </g>

      {/* Decorative corner markers */}
      <path d="M4 14 L4 10 L8 10" stroke="url(#opticslab-grad)" strokeWidth="1" opacity="0.5" />
      <path d="M44 14 L44 10 L40 10" stroke="url(#opticslab-grad)" strokeWidth="1" opacity="0.5" />
      <path d="M4 34 L4 38 L8 38" stroke="url(#opticslab-grad)" strokeWidth="1" opacity="0.5" />
      <path d="M44 34 L44 38 L40 38" stroke="url(#opticslab-grad)" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

// 11. CreativeLab - 偏振造物局 (Creative workshop with polarization art)
export function CreativeLabIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="creative-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#EC4899'} />
          <stop offset="100%" stopColor={secondaryColor || '#DB2777'} />
        </linearGradient>
        <linearGradient id="creative-rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4444" />
          <stop offset="33%" stopColor="#44ff44" />
          <stop offset="66%" stopColor="#4444ff" />
          <stop offset="100%" stopColor="#ff4444" />
        </linearGradient>
        <filter id="creative-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Paintbrush/wand shape */}
      <path
        d="M8 40 L16 32 L24 24 L32 16 L36 12"
        fill="none"
        stroke="url(#creative-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Brush tip with polarization colors */}
      <path
        d="M36 12 L40 8 L44 10 L42 14 L38 16 Z"
        fill="url(#creative-grad)"
        opacity="0.8"
      />
      {/* Color sparkles representing polarization states */}
      <circle cx="18" cy="14" r="3" fill="#ff4444" opacity="0.7" filter="url(#creative-glow)" />
      <circle cx="28" cy="10" r="2.5" fill="#44ff44" opacity="0.7" filter="url(#creative-glow)" />
      <circle cx="12" cy="22" r="2" fill="#4444ff" opacity="0.7" filter="url(#creative-glow)" />
      <circle cx="22" cy="36" r="2.5" fill="#ffaa00" opacity="0.7" filter="url(#creative-glow)" />
      {/* Decorative stars */}
      <path d="M38 28 L40 30 L42 28 L40 32 Z" fill="url(#creative-grad)" opacity="0.5" />
      <path d="M6 12 L8 14 L10 12 L8 16 Z" fill="url(#creative-grad)" opacity="0.5" />
      {/* Arc representing creative flow */}
      <path
        d="M10 30 Q24 10, 38 20"
        fill="none"
        stroke="url(#creative-rainbow)"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        opacity="0.6"
      />
    </svg>
  )
}

// 12. SimulationLab - 仿真工坊 (Computation/simulation with matrices)
export function SimulationLabIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="sim-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#8B5CF6'} />
          <stop offset="100%" stopColor={secondaryColor || '#7C3AED'} />
        </linearGradient>
        <filter id="sim-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Main gear */}
      <circle cx="24" cy="24" r="12" fill="none" stroke="url(#sim-grad)" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="5" fill="url(#sim-grad)" opacity="0.3" />
      {/* Gear teeth */}
      <path d="M24 8 L22 12 L26 12 Z" fill="url(#sim-grad)" />
      <path d="M24 40 L22 36 L26 36 Z" fill="url(#sim-grad)" />
      <path d="M8 24 L12 22 L12 26 Z" fill="url(#sim-grad)" />
      <path d="M40 24 L36 22 L36 26 Z" fill="url(#sim-grad)" />
      <path d="M12.7 12.7 L15.5 14.1 L14.1 15.5 Z" fill="url(#sim-grad)" />
      <path d="M35.3 35.3 L32.5 33.9 L33.9 32.5 Z" fill="url(#sim-grad)" />
      <path d="M12.7 35.3 L14.1 32.5 L15.5 33.9 Z" fill="url(#sim-grad)" />
      <path d="M35.3 12.7 L33.9 15.5 L32.5 14.1 Z" fill="url(#sim-grad)" />
      {/* Matrix brackets */}
      <path d="M18 20 L16 20 L16 28 L18 28" fill="none" stroke="url(#sim-grad)" strokeWidth="1.5" opacity="0.8" />
      <path d="M30 20 L32 20 L32 28 L30 28" fill="none" stroke="url(#sim-grad)" strokeWidth="1.5" opacity="0.8" />
      {/* Matrix elements */}
      <circle cx="21" cy="22" r="1" fill="url(#sim-grad)" filter="url(#sim-glow)" />
      <circle cx="27" cy="22" r="1" fill="url(#sim-grad)" filter="url(#sim-glow)" />
      <circle cx="21" cy="26" r="1" fill="url(#sim-grad)" filter="url(#sim-glow)" />
      <circle cx="27" cy="26" r="1" fill="url(#sim-grad)" filter="url(#sim-glow)" />
      {/* Binary/code elements */}
      <text x="4" y="14" fill="url(#sim-grad)" fontSize="6" opacity="0.5" fontFamily="monospace">01</text>
      <text x="38" y="42" fill="url(#sim-grad)" fontSize="6" opacity="0.5" fontFamily="monospace">10</text>
    </svg>
  )
}

// 13. Course - 课程模块 (Book with light rays - represents structured learning)
export function CourseIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="course-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#3B82F6'} />
          <stop offset="100%" stopColor={secondaryColor || '#1D4ED8'} />
        </linearGradient>
        <linearGradient id="course-light" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4444" stopOpacity="0.8" />
          <stop offset="33%" stopColor="#ffaa00" stopOpacity="0.8" />
          <stop offset="66%" stopColor="#44ff44" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4488ff" stopOpacity="0.8" />
        </linearGradient>
        <filter id="course-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Open book shape */}
      <path
        d="M6 12 C6 8, 12 6, 24 6 C36 6, 42 8, 42 12 L42 38 C42 40, 36 42, 24 42 C12 42, 6 40, 6 38 Z"
        fill="none"
        stroke="url(#course-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Book spine */}
      <path
        d="M24 6 L24 42"
        stroke="url(#course-grad)"
        strokeWidth="2"
        opacity="0.6"
      />
      {/* Pages texture left */}
      <path
        d="M10 14 L20 14 M10 20 L18 20 M10 26 L20 26 M10 32 L16 32"
        stroke="url(#course-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Pages texture right */}
      <path
        d="M28 14 L38 14 M30 20 L38 20 M28 26 L38 26 M32 32 L38 32"
        stroke="url(#course-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Light rays emanating from book */}
      <path
        d="M24 2 L24 6"
        stroke="url(#course-light)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#course-glow)"
      />
      <path
        d="M16 4 L18 8"
        stroke="url(#course-light)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
        filter="url(#course-glow)"
      />
      <path
        d="M32 4 L30 8"
        stroke="url(#course-light)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
        filter="url(#course-glow)"
      />
      {/* Light orb above book */}
      <circle cx="24" cy="0" r="2" fill="url(#course-light)" filter="url(#course-glow)" opacity="0.8" />
      {/* Decorative sparkles */}
      <circle cx="8" cy="8" r="1" fill="url(#course-grad)" opacity="0.5" />
      <circle cx="40" cy="8" r="1" fill="url(#course-grad)" opacity="0.5" />
    </svg>
  )
}

// 14. OpenData - 开放数据 (Database with sharing/open science)
export function OpenDataIcon({ className, size = 48, primaryColor, secondaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="data-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#64748B'} />
          <stop offset="100%" stopColor={secondaryColor || '#475569'} />
        </linearGradient>
        <filter id="data-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Database cylinder */}
      <ellipse cx="24" cy="12" rx="14" ry="5" fill="none" stroke="url(#data-grad)" strokeWidth="2.5" />
      <path d="M10 12 L10 36" stroke="url(#data-grad)" strokeWidth="2.5" />
      <path d="M38 12 L38 36" stroke="url(#data-grad)" strokeWidth="2.5" />
      <ellipse cx="24" cy="36" rx="14" ry="5" fill="none" stroke="url(#data-grad)" strokeWidth="2.5" />
      {/* Middle section line */}
      <ellipse cx="24" cy="24" rx="14" ry="5" fill="none" stroke="url(#data-grad)" strokeWidth="1.5" opacity="0.4" />
      {/* Data rows/bars */}
      <rect x="14" y="16" width="8" height="2" rx="1" fill="url(#data-grad)" opacity="0.6" />
      <rect x="26" y="16" width="6" height="2" rx="1" fill="url(#data-grad)" opacity="0.4" />
      <rect x="14" y="28" width="10" height="2" rx="1" fill="url(#data-grad)" opacity="0.5" />
      <rect x="28" y="28" width="4" height="2" rx="1" fill="url(#data-grad)" opacity="0.3" />
      {/* Open/share symbol */}
      <circle cx="38" cy="8" r="6" fill="none" stroke="url(#data-grad)" strokeWidth="1.5" opacity="0.7" />
      <path d="M35 8 L41 8 M38 5 L38 11" stroke="url(#data-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      {/* Connection dots */}
      <circle cx="8" cy="40" r="2" fill="url(#data-grad)" opacity="0.5" filter="url(#data-glow)" />
      <circle cx="40" cy="40" r="2" fill="url(#data-grad)" opacity="0.5" filter="url(#data-glow)" />
      <path d="M10 40 L24 44 L38 40" fill="none" stroke="url(#data-grad)" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
    </svg>
  )
}

// =================================================================
// Learning Mode Icons - PSRT, ESRT, ORIC, SURF
// Custom SVG icons for research-oriented learning stages
// =================================================================

// PSRT - Problem-driven Scientific Research Training (Foundation level)
// Icon: Seedling with light rays - represents growth and discovery
export function PSRTIcon({ className, size = 32, primaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="psrt-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={primaryColor || '#22c55e'} />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
        <filter id="psrt-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Soil/ground */}
      <path
        d="M4 26 Q16 28, 28 26"
        fill="none"
        stroke="url(#psrt-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Main stem */}
      <path
        d="M16 26 L16 14"
        stroke="url(#psrt-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <path
        d="M16 18 Q10 16, 8 12 Q10 14, 16 16"
        fill="url(#psrt-grad)"
        opacity="0.8"
      />
      {/* Right leaf */}
      <path
        d="M16 14 Q22 12, 24 8 Q22 10, 16 12"
        fill="url(#psrt-grad)"
        opacity="0.9"
      />
      {/* Light rays from top */}
      <path
        d="M16 4 L16 8"
        stroke="url(#psrt-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#psrt-glow)"
        opacity="0.7"
      />
      <path
        d="M10 6 L12 9"
        stroke="url(#psrt-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M22 6 L20 9"
        stroke="url(#psrt-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Question mark accent */}
      <circle cx="26" cy="20" r="4" fill="none" stroke="url(#psrt-grad)" strokeWidth="1.5" opacity="0.6" />
      <text x="24.5" y="22.5" fontSize="6" fill="url(#psrt-grad)" fontWeight="bold" opacity="0.7">?</text>
    </svg>
  )
}

// ESRT - Experimental Science Research Training (Application level)
// Icon: Microscope with light beam - represents hands-on experimentation
export function ESRTIcon({ className, size = 32, primaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="esrt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#06b6d4'} />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
        <filter id="esrt-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Microscope eyepiece */}
      <rect x="13" y="4" width="6" height="4" rx="1" fill="url(#esrt-grad)" />
      {/* Microscope tube */}
      <path
        d="M14 8 L14 14 L10 14 L10 16 L22 16 L22 14 L18 14 L18 8"
        fill="none"
        stroke="url(#esrt-grad)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Objective lens */}
      <rect x="14" y="16" width="4" height="3" rx="0.5" fill="url(#esrt-grad)" opacity="0.8" />
      {/* Stage */}
      <rect x="8" y="22" width="16" height="2" rx="1" fill="url(#esrt-grad)" />
      {/* Base */}
      <path
        d="M6 28 L26 28 L24 24 L8 24 Z"
        fill="url(#esrt-grad)"
        opacity="0.6"
      />
      {/* Light beam from objective */}
      <path
        d="M16 19 L16 22"
        stroke="url(#esrt-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#esrt-glow)"
        opacity="0.9"
      />
      <circle cx="16" cy="21" r="2" fill="url(#esrt-grad)" opacity="0.3" filter="url(#esrt-glow)" />
      {/* Measurement scale marks */}
      <path d="M25 12 L27 12" stroke="url(#esrt-grad)" strokeWidth="1" opacity="0.5" />
      <path d="M25 14 L28 14" stroke="url(#esrt-grad)" strokeWidth="1" opacity="0.5" />
      <path d="M25 16 L27 16" stroke="url(#esrt-grad)" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

// ORIC - Original Research & Innovation Contribution (Research level)
// Icon: Rocket with trajectory - represents frontier exploration
export function ORICIcon({ className, size = 32, primaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="oric-grad" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={primaryColor || '#a855f7'} />
          <stop offset="100%" stopColor="#d8b4fe" />
        </linearGradient>
        <linearGradient id="oric-flame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <filter id="oric-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Rocket body */}
      <path
        d="M16 4 Q20 8, 20 16 L18 20 L14 20 L12 16 Q12 8, 16 4"
        fill="url(#oric-grad)"
      />
      {/* Rocket window */}
      <circle cx="16" cy="12" r="2.5" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.7" />
      <circle cx="16" cy="12" r="1" fill="#fff" opacity="0.5" />
      {/* Left fin */}
      <path
        d="M12 16 L8 22 L12 20"
        fill="url(#oric-grad)"
        opacity="0.8"
      />
      {/* Right fin */}
      <path
        d="M20 16 L24 22 L20 20"
        fill="url(#oric-grad)"
        opacity="0.8"
      />
      {/* Flame */}
      <path
        d="M14 20 L16 28 L18 20"
        fill="url(#oric-flame)"
        filter="url(#oric-glow)"
      />
      <path
        d="M15 20 L16 25 L17 20"
        fill="#fef3c7"
        opacity="0.8"
      />
      {/* Trajectory trail */}
      <path
        d="M6 28 Q10 24, 14 22"
        fill="none"
        stroke="url(#oric-grad)"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.4"
      />
      {/* Stars */}
      <circle cx="6" cy="8" r="1" fill="url(#oric-grad)" opacity="0.5" />
      <circle cx="26" cy="6" r="0.8" fill="url(#oric-grad)" opacity="0.4" />
      <circle cx="28" cy="14" r="0.6" fill="url(#oric-grad)" opacity="0.3" />
    </svg>
  )
}

// SURF - Student Undergraduate Research Fellowship (Advanced Research)
// Icon: Globe with network connections - represents global research impact
export function SURFIcon({ className, size = 32, primaryColor }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        <linearGradient id="surf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor || '#f59e0b'} />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
        <filter id="surf-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Globe outline */}
      <circle cx="16" cy="16" r="11" fill="none" stroke="url(#surf-grad)" strokeWidth="2" />
      {/* Latitude lines */}
      <ellipse cx="16" cy="16" rx="11" ry="4" fill="none" stroke="url(#surf-grad)" strokeWidth="1" opacity="0.4" />
      <ellipse cx="16" cy="16" rx="11" ry="8" fill="none" stroke="url(#surf-grad)" strokeWidth="1" opacity="0.3" />
      {/* Longitude line */}
      <ellipse cx="16" cy="16" rx="4" ry="11" fill="none" stroke="url(#surf-grad)" strokeWidth="1" opacity="0.4" />
      {/* Network nodes */}
      <circle cx="10" cy="12" r="2" fill="url(#surf-grad)" filter="url(#surf-glow)" />
      <circle cx="22" cy="14" r="2" fill="url(#surf-grad)" filter="url(#surf-glow)" />
      <circle cx="14" cy="22" r="2" fill="url(#surf-grad)" filter="url(#surf-glow)" />
      <circle cx="20" cy="20" r="1.5" fill="url(#surf-grad)" opacity="0.7" />
      {/* Connection lines */}
      <path d="M10 12 L22 14" stroke="url(#surf-grad)" strokeWidth="1" opacity="0.6" />
      <path d="M22 14 L20 20" stroke="url(#surf-grad)" strokeWidth="1" opacity="0.6" />
      <path d="M20 20 L14 22" stroke="url(#surf-grad)" strokeWidth="1" opacity="0.6" />
      <path d="M14 22 L10 12" stroke="url(#surf-grad)" strokeWidth="1" opacity="0.6" />
      {/* Wave/signal emanating */}
      <path
        d="M26 8 Q28 10, 26 12"
        fill="none"
        stroke="url(#surf-grad)"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M28 6 Q31 10, 28 14"
        fill="none"
        stroke="url(#surf-grad)"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  )
}

// Export a map for easy lookup - all 9 homepage modules + extras
export const ModuleIconMap = {
  // 9 main homepage modules
  chronicles: ChroniclesIcon,
  opticalDesignStudio: OpticsLabIcon, // Main mapping for Optical Design Studio
  opticsLab: OpticsLabIcon,
  formulaLab: DemoGalleryIcon,
  polarquest: PolarQuestIcon,
  creativeLab: CreativeLabIcon,
  labGroup: LabGroupIcon,
  applications: ApplicationsIcon,
  simulationLab: SimulationLabIcon,
  openData: OpenDataIcon,
  // Course module
  course: CourseIcon,
  // Learning mode icons
  psrt: PSRTIcon,
  esrt: ESRTIcon,
  oric: ORICIcon,
  surf: SURFIcon,
  // Legacy/alternate names for backward compatibility
  deviceLibrary: DeviceLibraryIcon,
  opticalBench: OpticalBenchIcon,
  gallery: GalleryIcon,
  experiments: ExperimentsIcon,
}

export type ModuleIconKey = keyof typeof ModuleIconMap
