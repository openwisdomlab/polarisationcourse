/**
 * Combined Logo - X-Institute + Open Wisdom Lab
 *
 * Design:
 * - Left: X-Institute (深圳零一学院) blue geometric α symbol
 * - Separator: Vertical line
 * - Right: Open Wisdom Lab stylized eye with pink feathers
 */

import { cn } from '@/lib/utils'

interface CombinedLogoProps {
  className?: string
  height?: number
  theme?: 'dark' | 'light'
}

export function CombinedLogo({
  className,
  height = 60,
  theme = 'dark'
}: CombinedLogoProps) {
  // Colors
  const xInstituteBlue = '#2563EB' // Blue for X-Institute
  const separatorColor = theme === 'dark' ? '#4B5563' : '#9CA3AF'
  const owlPink = '#E91E8C'
  const owlPinkDark = '#C01670'
  const owlBlue = '#2563EB'

  return (
    <svg
      height={height}
      viewBox="0 0 520 80"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        {/* Gradient for X-Institute symbol */}
        <linearGradient id="x-inst-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={xInstituteBlue} />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        {/* Gradient for owl feathers */}
        <linearGradient id="owl-feather-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={owlPink} />
          <stop offset="100%" stopColor={owlPinkDark} />
        </linearGradient>
      </defs>

      {/* ===== Left: X-Institute Logo ===== */}
      <g transform="translate(0, 5)">
        {/* X-Institute α-like geometric symbol */}
        <g transform="translate(5, 8)">
          {/* Main α shape - geometric interpretation */}
          <path
            d="M 0 30
               Q 0 15 15 15
               L 30 15
               Q 40 15 45 25
               L 55 45
               Q 60 55 50 55
               Q 40 55 35 45
               L 30 35
               Q 28 32 25 32
               L 15 32
               Q 5 32 5 45
               Q 5 55 15 55
               L 20 55"
            stroke="url(#x-inst-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Crossing line of α */}
          <path
            d="M 35 55 L 55 15"
            stroke="url(#x-inst-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Chinese text: 深圳零一学院 */}
        <text
          x="75"
          y="30"
          fontFamily="'Microsoft YaHei', 'PingFang SC', sans-serif"
          fontSize="18"
          fontWeight="500"
          fill={xInstituteBlue}
        >
          深圳零一学院
        </text>

        {/* English text: X-Institute */}
        <text
          x="75"
          y="55"
          fontFamily="Arial, sans-serif"
          fontSize="16"
          fontWeight="600"
          fill={xInstituteBlue}
        >
          X-Institute
        </text>
      </g>

      {/* ===== Separator ===== */}
      <line
        x1="235"
        y1="15"
        x2="235"
        y2="65"
        stroke={separatorColor}
        strokeWidth="1.5"
      />

      {/* ===== Right: Open Wisdom Lab Logo ===== */}
      <g transform="translate(255, 5)">
        {/* Stylized eye with feather/wing elements */}
        <g transform="translate(0, 5)">
          {/* Feather/wing elements - radiating from top-right */}
          <path
            d="M 30 35 Q 45 10 65 5"
            stroke="url(#owl-feather-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 32 32 Q 55 5 75 3"
            stroke="url(#owl-feather-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 35 30 Q 60 8 80 8"
            stroke="url(#owl-feather-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 38 30 Q 62 15 82 18"
            stroke="url(#owl-feather-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eye shape - outer */}
          <ellipse
            cx="30"
            cy="42"
            rx="25"
            ry="18"
            stroke={owlBlue}
            strokeWidth="3"
            fill="none"
          />

          {/* Iris */}
          <circle
            cx="30"
            cy="42"
            r="10"
            fill={owlBlue}
          />

          {/* Pupil */}
          <circle
            cx="30"
            cy="42"
            r="4"
            fill="white"
          />

          {/* Eye highlight */}
          <circle
            cx="33"
            cy="39"
            r="2"
            fill="white"
            opacity="0.8"
          />
        </g>

        {/* OPEN WISDOM LAB text - stacked */}
        <g transform="translate(95, 0)">
          <text
            x="0"
            y="22"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fontWeight="700"
            fill={owlBlue}
            letterSpacing="2"
          >
            OPEN
          </text>
          <text
            x="0"
            y="42"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fontWeight="700"
            fill={owlBlue}
            letterSpacing="2"
          >
            WISDOM
          </text>
          <text
            x="0"
            y="62"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fontWeight="700"
            fill={owlBlue}
            letterSpacing="2"
          >
            LAB
          </text>
        </g>
      </g>
    </svg>
  )
}
