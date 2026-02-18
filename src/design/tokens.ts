/**
 * Design Tokens - PolarCraft Design System
 * 统一的设计令牌，用于保持视觉一致性
 */

// ── Color Tokens for Demo System ──

/** Gradient definitions used across demo visualizations */
export const DEMO_GRADIENTS = {
  cyan: { from: '#22d3ee', via: '#60a5fa', to: '#67e8f9' },
  blue: { from: '#60a5fa', via: '#818cf8', to: '#93c5fd' },
  green: { from: '#34d399', via: '#2dd4bf', to: '#67e8f9' },
  orange: { from: '#fb923c', via: '#fbbf24', to: '#fde047' },
} as const

/** Color tokens for dark theme demo components */
export const DEMO_COLORS_DARK = {
  cyan: { text: '#22d3ee', bg: 'rgba(34,211,238,0.05)', border: 'rgba(34,211,238,0.2)' },
  blue: { text: '#60a5fa', bg: 'rgba(96,165,250,0.05)', border: 'rgba(96,165,250,0.2)' },
  green: { text: '#34d399', bg: 'rgba(52,211,153,0.05)', border: 'rgba(52,211,153,0.2)' },
  orange: { text: '#fb923c', bg: 'rgba(251,146,60,0.05)', border: 'rgba(251,146,60,0.2)' },
} as const

/** Color tokens for light theme demo components */
export const DEMO_COLORS_LIGHT = {
  cyan: { text: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
  blue: { text: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  green: { text: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  orange: { text: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
} as const

// ── Spacing Tokens ──

/** Consistent spacing scale (in pixels) for padding and margins */
export const SPACING = {
  /** 4px - Tight spacing for inline elements */
  xs: 4,
  /** 8px - Compact spacing for related elements */
  sm: 8,
  /** 12px - Default inner padding */
  md: 12,
  /** 16px - Standard section padding */
  lg: 16,
  /** 20px - Panel padding on desktop */
  xl: 20,
  /** 24px - Large section gaps */
  '2xl': 24,
  /** 32px - Page-level spacing */
  '3xl': 32,
} as const

// ── Touch Target Tokens ──

/** Minimum touch target size in pixels (WCAG 2.5.5 AAA) */
export const MIN_TOUCH_TARGET = 44

/** Tailwind class string for minimum touch target */
export const MIN_TOUCH_TARGET_CLASS = 'min-h-[44px] min-w-[44px]' as const

// ── Polarization Color Map ──

/**
 * Maps polarization angles (in degrees) to representative colors.
 * 偏振角度到颜色的映射，用于可视化光的偏振方向
 */
export const POLARIZATION_COLORS: Record<number, string> = {
  0: '#ff4444',    // red - 水平偏振
  45: '#ffaa00',   // orange - 45度偏振
  90: '#44ff44',   // green - 垂直偏振
  135: '#4444ff',  // blue - 135度偏振
} as const
