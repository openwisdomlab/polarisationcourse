/**
 * PolarWorldLogo - 偏振光下的新世界 Logo
 * A New World Under Polarized Light - Dynamic Polarization Logo
 *
 * Design concept:
 * - 动态旋转的双正交偏振波形
 * - 精简有力的线条设计，极强视觉冲击
 * - 流畅的SVG动画展现偏振光的动态美
 * - 渐变色代表不同偏振态
 */

import { cn } from '@/lib/utils'

interface PolarWorldLogoProps {
  className?: string
  size?: number
  animated?: boolean
  theme?: 'dark' | 'light'
  showText?: boolean
}

export function PolarWorldLogo({
  className,
  size = 120,
  animated = true,
  theme = 'dark',
  showText = false
}: PolarWorldLogoProps) {
  // 偏振光标志色
  const colors = {
    primary: '#22d3ee',    // 青色 - 水平偏振
    secondary: '#a855f7',  // 紫色 - 垂直偏振
    accent: '#f43f5e',     // 玫红 - 圆偏振
    glow: theme === 'dark' ? 'rgba(34, 211, 238, 0.7)' : 'rgba(8, 145, 178, 0.5)',
    core: theme === 'dark' ? '#ffffff' : '#0f172a',
  }

  // 生成唯一ID避免SVG filter冲突
  const id = `pw-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="transition-all duration-300"
      >
        <defs>
          {/* 主渐变 - 偏振光谱 */}
          <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values={`${colors.primary};${colors.secondary};${colors.accent};${colors.primary}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="100%" stopColor={colors.secondary}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values={`${colors.secondary};${colors.accent};${colors.primary};${colors.secondary}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
          </linearGradient>

          {/* 光晕滤镜 */}
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 强光晕 */}
          <filter id={`${id}-glow-strong`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 背景光晕 - 脉动效果 */}
        <circle
          cx="50"
          cy="50"
          r="30"
          fill={colors.glow}
          opacity={animated ? undefined : 0.4}
          filter={`url(#${id}-glow-strong)`}
        >
          {animated && (
            <animate
              attributeName="opacity"
              values="0.3;0.6;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* 外环 - 代表偏振片 */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={`url(#${id}-grad)`}
          strokeWidth="3"
          strokeLinecap="round"
          filter={`url(#${id}-glow)`}
          opacity="0.8"
        />

        {/* 核心偏振波形 - 旋转的正弦波 */}
        <g filter={`url(#${id}-glow)`}>
          {/* 主波形 - 水平偏振态 */}
          <g>
            {animated && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 50 50;360 50 50"
                dur="6s"
                repeatCount="indefinite"
              />
            )}
            <path
              d="M 20 50 Q 30 35, 40 50 T 60 50 T 80 50"
              fill="none"
              stroke={colors.primary}
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* 波形箭头 */}
            <path
              d="M 76 46 L 82 50 L 76 54"
              fill="none"
              stroke={colors.primary}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* 正交波形 - 垂直偏振态，相位差90度 */}
          <g opacity="0.7">
            {animated && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="90 50 50;450 50 50"
                dur="6s"
                repeatCount="indefinite"
              />
            )}
            <path
              d="M 20 50 Q 30 35, 40 50 T 60 50 T 80 50"
              fill="none"
              stroke={colors.secondary}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* 中心核心 - 光源点 */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill={colors.core}
          filter={`url(#${id}-glow-strong)`}
        >
          {animated && (
            <animate
              attributeName="r"
              values="7;9;7"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* 核心内圈 - 渐变色 */}
        <circle
          cx="50"
          cy="50"
          r="5"
          fill={`url(#${id}-grad)`}
        >
          {animated && (
            <animate
              attributeName="r"
              values="4;6;4"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </svg>

      {/* Optional text label */}
      {showText && (
        <div className={cn(
          'absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          偏振光下的新世界
        </div>
      )}
    </div>
  )
}
