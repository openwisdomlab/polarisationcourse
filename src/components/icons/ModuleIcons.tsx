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
          <stop offset="0%" stopColor={primaryColor || '#8B5CF6'} />
          <stop offset="100%" stopColor={secondaryColor || '#7C3AED'} />
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

// Export a map for easy lookup
export const ModuleIconMap = {
  chronicles: ChroniclesIcon,
  deviceLibrary: DeviceLibraryIcon,
  opticalBench: OpticalBenchIcon,
  formulaLab: DemoGalleryIcon,
  polarquest: PolarQuestIcon,
  gallery: GalleryIcon,
  labGroup: LabGroupIcon,
  applications: ApplicationsIcon,
  experiments: ExperimentsIcon,
}

export type ModuleIconKey = keyof typeof ModuleIconMap
