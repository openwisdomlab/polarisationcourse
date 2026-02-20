/**
 * PolarizationLegend.tsx -- 渐进式偏振编码图例
 *
 * HTML 叠加层 (非 SVG)，定位在场景视口右下角。
 * 随着学生通过交互发现每种偏振编码方面，图例项逐一显现:
 *
 * 1. 方位角 (orientation): "Color = Direction"
 * 2. 强度 (intensity): "Brightness = Intensity"
 * 3. 椭圆度 (ellipticity): "Shape = Polarization Type"
 * 4. 强度-不透明度 (intensityOpacity): "Width = Strength"
 *
 * 设计风格: 半透明毛玻璃 HUD，与场景 HUD 一致。
 * 每个项目通过 Framer Motion AnimatePresence 从下方淡入。
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface PolarizationLegendProps {
  discoveredEncodings: {
    orientation: boolean
    intensity: boolean
    ellipticity: boolean
    intensityOpacity: boolean
  }
}

// ── 图例项数据 ──────────────────────────────────────────────────────────

interface LegendItem {
  key: 'orientation' | 'intensity' | 'ellipticity' | 'intensityOpacity'
  labelKey: string
  preview: React.ReactNode
}

/** 方位角预览: 三条不同色调的线 */
function OrientationPreview() {
  return (
    <svg width={36} height={14} viewBox="0 0 36 14">
      <line x1={2} y1={7} x2={10} y2={7} stroke="hsl(0, 90%, 55%)" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={14} y1={7} x2={22} y2={7} stroke="hsl(120, 90%, 55%)" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={26} y1={7} x2={34} y2={7} stroke="hsl(240, 90%, 55%)" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  )
}

/** 强度预览: 三条不同不透明度的线 */
function IntensityPreview() {
  return (
    <svg width={36} height={14} viewBox="0 0 36 14">
      <line x1={2} y1={7} x2={10} y2={7} stroke="hsl(45, 80%, 55%)" strokeWidth={2.5} strokeLinecap="round" opacity={1} />
      <line x1={14} y1={7} x2={22} y2={7} stroke="hsl(45, 80%, 55%)" strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />
      <line x1={26} y1={7} x2={34} y2={7} stroke="hsl(45, 80%, 55%)" strokeWidth={2.5} strokeLinecap="round" opacity={0.1} />
    </svg>
  )
}

/** 椭圆度预览: 直线、椭圆标记、螺旋 */
function EllipticityPreview() {
  return (
    <svg width={36} height={14} viewBox="0 0 36 14">
      {/* 直线 -- 线偏振 */}
      <line x1={2} y1={7} x2={10} y2={7} stroke="hsl(180, 70%, 55%)" strokeWidth={2} strokeLinecap="round" />
      {/* 椭圆标记 -- 椭圆偏振 */}
      <ellipse cx={18} cy={7} rx={4} ry={2.5} fill="none" stroke="hsl(180, 70%, 55%)" strokeWidth={1.2} />
      {/* 圆圈 -- 圆偏振 */}
      <circle cx={30} cy={7} r={3} fill="none" stroke="hsl(180, 70%, 55%)" strokeWidth={1.2} />
    </svg>
  )
}

/** 强度-宽度预览: 粗细不同的线 */
function IntensityOpacityPreview() {
  return (
    <svg width={36} height={14} viewBox="0 0 36 14">
      <line x1={2} y1={7} x2={10} y2={7} stroke="hsl(90, 70%, 55%)" strokeWidth={4} strokeLinecap="round" />
      <line x1={14} y1={7} x2={22} y2={7} stroke="hsl(90, 70%, 55%)" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={26} y1={7} x2={34} y2={7} stroke="hsl(90, 70%, 55%)" strokeWidth={1} strokeLinecap="round" />
    </svg>
  )
}

const LEGEND_ITEMS: LegendItem[] = [
  {
    key: 'orientation',
    labelKey: 'odyssey.ui.colorDirection',
    preview: <OrientationPreview />,
  },
  {
    key: 'intensity',
    labelKey: 'odyssey.ui.brightnessIntensity',
    preview: <IntensityPreview />,
  },
  {
    key: 'ellipticity',
    labelKey: 'odyssey.ui.shapePolarizationType',
    preview: <EllipticityPreview />,
  },
  {
    key: 'intensityOpacity',
    labelKey: 'odyssey.ui.widthStrength',
    preview: <IntensityOpacityPreview />,
  },
]

// ── 弹簧动画配置 ────────────────────────────────────────────────────────

const ITEM_SPRING = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 15,
}

// ── 主组件 ──────────────────────────────────────────────────────────────

/**
 * PolarizationLegend -- 渐进式偏振编码图例
 *
 * 定位在场景视口右下角 (不与小地图重叠)。
 * 标题在第一个编码被发现后出现。
 * 每个图例项通过 AnimatePresence 从下方弹入。
 */
export function PolarizationLegend({ discoveredEncodings }: PolarizationLegendProps) {
  const { t } = useTranslation()
  const visibleItems = LEGEND_ITEMS.filter((item) => discoveredEncodings[item.key])
  const hasAny = visibleItems.length > 0

  if (!hasAny) return null

  return (
    <motion.div
      className="absolute right-4 bottom-24 z-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={ITEM_SPRING}
      style={{
        background: 'rgba(20, 20, 30, 0.7)',
        backdropFilter: 'blur(6px)',
        borderRadius: 6,
        padding: '8px 12px',
        minWidth: 140,
        maxWidth: 180,
        pointerEvents: 'none',
      }}
    >
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.5 }}
        style={{
          fontVariant: 'small-caps',
          fontSize: 10,
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: 6,
          letterSpacing: '0.05em',
        }}
      >
        {t('odyssey.ui.polarization')}
      </motion.div>

      {/* 图例项列表 */}
      <AnimatePresence mode="sync">
        {visibleItems.map((item) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={ITEM_SPRING}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 4,
            }}
          >
            {/* 视觉预览 */}
            <div style={{ flexShrink: 0 }}>{item.preview}</div>

            {/* 文字标签 */}
            <span
              style={{
                fontSize: 9,
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.2,
              }}
            >
              {t(item.labelKey)}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
