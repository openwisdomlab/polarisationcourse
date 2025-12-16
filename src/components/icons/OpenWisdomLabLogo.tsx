/**
 * Open Wisdom Lab Logo - 猫头鹰实验室标志
 *
 * Design concept:
 * - Stylized owl icon representing wisdom and insight
 * - Pink/magenta color scheme for the owl
 * - Blue "OPEN WISDOM LAB" text
 * - Works in both dark and light themes
 */

import { cn } from '@/lib/utils'

interface OpenWisdomLabLogoProps {
  className?: string
  height?: number
  theme?: 'dark' | 'light'
}

export function OpenWisdomLabLogo({
  className,
  height = 40,
  theme = 'dark'
}: OpenWisdomLabLogoProps) {
  // Color scheme - enhanced for better website integration
  const colors = {
    owlPrimary: theme === 'dark' ? '#E91E8C' : '#D91A7D',    // Pink/Magenta for owl
    owlSecondary: theme === 'dark' ? '#D91A7D' : '#C01670',  // Darker pink for details
    textBlue: theme === 'dark' ? '#22D3EE' : '#0891B2',      // Cyan to match site theme
    textBlueDark: theme === 'dark' ? '#06B6D4' : '#0E7490',  // Darker cyan for emphasis
  }

  const textColor = colors.textBlue

  return (
    <svg
      height={height}
      viewBox="0 0 300 80"
      fill="none"
      className={cn(
        'transition-all duration-500 ease-out',
        'hover:scale-110 hover:drop-shadow-[0_0_25px_rgba(233,30,140,0.4)]',
        'cursor-pointer',
        className
      )}
      style={{
        filter: theme === 'dark'
          ? 'drop-shadow(0 2px 8px rgba(233,30,140,0.2))'
          : 'drop-shadow(0 2px 6px rgba(217,26,125,0.15))'
      }}
    >
      <defs>
        {/* Owl gradient */}
        <linearGradient id="owl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.owlPrimary} />
          <stop offset="100%" stopColor={colors.owlSecondary} />
        </linearGradient>
      </defs>

      {/* Owl Icon */}
      <g transform="translate(10, 10)">
        {/* Owl body - simplified stylized shape */}
        <path
          d="M30 5 Q35 0 40 5 L45 20 Q45 35 40 45 L30 50 L20 45 Q15 35 15 20 L20 5 Q25 0 30 5"
          fill="url(#owl-grad)"
        />

        {/* Left eye */}
        <circle cx="25" cy="18" r="6" fill="white" />
        <circle cx="26" cy="18" r="3" fill="#1a1a1a" />

        {/* Right eye */}
        <circle cx="35" cy="18" r="6" fill="white" />
        <circle cx="36" cy="18" r="3" fill="#1a1a1a" />

        {/* Beak */}
        <path
          d="M30 24 L28 28 L30 27 L32 28 Z"
          fill={colors.owlSecondary}
        />

        {/* Left wing accent */}
        <path
          d="M18 25 Q15 30 16 35"
          stroke={colors.owlSecondary}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right wing accent */}
        <path
          d="M42 25 Q45 30 44 35"
          stroke={colors.owlSecondary}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Head feather tufts */}
        <path
          d="M22 8 L20 3"
          stroke={colors.owlPrimary}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M38 8 L40 3"
          stroke={colors.owlPrimary}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* "OPEN WISDOM LAB" Text - Enhanced gradient */}
      <defs>
        <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={textColor} />
          <stop offset="100%" stopColor={colors.textBlueDark} />
        </linearGradient>
      </defs>

      <g transform="translate(75, 0)">
        {/* OPEN */}
        <text
          x="0"
          y="28"
          fontFamily="Arial, sans-serif"
          fontSize="20"
          fontWeight="700"
          fill="url(#text-grad)"
          letterSpacing="1.5"
        >
          OPEN
        </text>

        {/* WISDOM */}
        <text
          x="0"
          y="50"
          fontFamily="Arial, sans-serif"
          fontSize="20"
          fontWeight="700"
          fill="url(#text-grad)"
          letterSpacing="1.5"
        >
          WISDOM
        </text>

        {/* LAB */}
        <text
          x="0"
          y="72"
          fontFamily="Arial, sans-serif"
          fontSize="20"
          fontWeight="700"
          fill="url(#text-grad)"
          letterSpacing="1.5"
        >
          LAB
        </text>
      </g>
    </svg>
  )
}
