/**
 * Combined Logo - X-Institute + Open Wisdom Lab
 *
 * Design based on official logos:
 * - Left: X-Institute (深圳零一学院) blue infinity/α symbol
 * - Separator: Vertical line
 * - Right: Open Wisdom Lab stylized eye with magenta feathers
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
  // Colors matching official branding
  const xInstituteBlue = '#1E3A8A' // Darker blue for X-Institute
  const separatorColor = theme === 'dark' ? '#4B5563' : '#9CA3AF'
  const owlMagenta = '#D946A0' // Magenta/pink for feathers
  const owlMagentaDark = '#BE185D'
  const owlBlue = '#1E40AF' // Blue for eye

  return (
    <svg
      height={height}
      viewBox="0 0 520 80"
      fill="none"
      className={cn('transition-all duration-300', className)}
    >
      <defs>
        {/* Gradient for X-Institute symbol */}
        <linearGradient id="x-inst-grad-footer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={xInstituteBlue} />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        {/* Gradient for owl feathers */}
        <linearGradient id="owl-feather-grad-footer" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={owlMagenta} />
          <stop offset="100%" stopColor={owlMagentaDark} />
        </linearGradient>
      </defs>

      {/* ===== Left: X-Institute Logo ===== */}
      <g transform="translate(0, 5)">
        {/* X-Institute infinity/α-like symbol - based on official logo */}
        <g transform="translate(5, 5)">
          {/* Main infinity-like shape with crossing */}
          {/* Left loop */}
          <path
            d="M 25 35
               C 5 35, 5 15, 25 15
               L 35 15
               C 45 15, 50 20, 55 30"
            stroke="url(#x-inst-grad-footer)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Diagonal crossing line */}
          <path
            d="M 35 55 L 58 12"
            stroke="url(#x-inst-grad-footer)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Bottom continuation */}
          <path
            d="M 25 55
               C 5 55, 5 35, 25 35"
            stroke="url(#x-inst-grad-footer)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Right extension */}
          <path
            d="M 50 40
               C 55 50, 50 58, 35 55"
            stroke="url(#x-inst-grad-footer)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Chinese text: 深圳零一学院 */}
        <text
          x="78"
          y="32"
          fontFamily="'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', sans-serif"
          fontSize="20"
          fontWeight="600"
          fill={xInstituteBlue}
        >
          深圳零一学院
        </text>

        {/* English text: X-Institute */}
        <text
          x="78"
          y="56"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="16"
          fontWeight="600"
          fill={xInstituteBlue}
        >
          X-Institute
        </text>
      </g>

      {/* ===== Separator ===== */}
      <line
        x1="240"
        y1="12"
        x2="240"
        y2="68"
        stroke={separatorColor}
        strokeWidth="1.5"
      />

      {/* ===== Right: Open Wisdom Lab Logo ===== */}
      <g transform="translate(260, 5)">
        {/* Stylized eye with feather/wing elements */}
        <g transform="translate(0, 0)">
          {/* Feather/wing elements - radiating upward from eye */}
          {/* Feather 1 - leftmost */}
          <path
            d="M 22 28 C 25 10, 40 0, 50 2"
            stroke="url(#owl-feather-grad-footer)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Feather 2 */}
          <path
            d="M 28 26 C 35 8, 55 -2, 68 2"
            stroke="url(#owl-feather-grad-footer)"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Feather 3 */}
          <path
            d="M 34 25 C 45 10, 65 5, 80 10"
            stroke="url(#owl-feather-grad-footer)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Feather 4 - rightmost */}
          <path
            d="M 40 28 C 52 18, 70 15, 85 22"
            stroke="url(#owl-feather-grad-footer)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eye shape - almond/leaf shape */}
          <path
            d="M 5 45
               Q 30 25, 55 45
               Q 30 65, 5 45"
            stroke={owlBlue}
            strokeWidth="3"
            fill="none"
          />

          {/* Iris - blue circle */}
          <circle
            cx="30"
            cy="45"
            r="12"
            fill={owlBlue}
          />

          {/* Pupil - white center */}
          <circle
            cx="30"
            cy="45"
            r="5"
            fill="white"
          />

          {/* Eye highlight */}
          <circle
            cx="34"
            cy="42"
            r="2.5"
            fill="white"
            opacity="0.9"
          />
        </g>

        {/* OPEN WISDOM LAB text - stacked */}
        <g transform="translate(100, 8)">
          <text
            x="0"
            y="16"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="17"
            fontWeight="800"
            fill={owlBlue}
            letterSpacing="1.5"
          >
            OPEN
          </text>
          <text
            x="0"
            y="36"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="17"
            fontWeight="800"
            fill={owlBlue}
            letterSpacing="1.5"
          >
            WISDOM
          </text>
          <text
            x="0"
            y="56"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="17"
            fontWeight="800"
            fill={owlBlue}
            letterSpacing="1.5"
          >
            LAB
          </text>
        </g>
      </g>
    </svg>
  )
}
