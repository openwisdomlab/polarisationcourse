/**
 * BeamTooltip.tsx -- 光束物理信息悬停提示
 *
 * 当悬停在光束段上方时，显示紧凑的物理信息:
 * - 强度: "I = 0.73"
 * - 偏振态: "Linear 45°" 或 "Circular (RH)" 或 "Elliptical"
 * - 通过元件后的公式 (如 "cos²(45°) = 0.50")
 *
 * 只有在首次发现之后才显示 (渐进披露)。
 * 渲染为 SVG 组，定位在光束段中点上方。
 *
 * Phase B -- D3: Action Feedback
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'

interface TooltipData {
  intensity: number
  polarization: string
  x: number
  y: number
}

/**
 * 从 Stokes 参数解析偏振态描述
 */
function describePolarization(
  stokes: { s0: number; s1: number; s2: number; s3: number },
  t: (key: string) => string,
): string {
  const { s0, s1, s2, s3 } = stokes
  if (s0 < 0.01) return t('odyssey.beam.extinct')

  // 归一化 Stokes 参数
  const ns1 = s1 / s0
  const ns2 = s2 / s0
  const ns3 = s3 / s0

  // 椭圆度: |s3/s0|
  const ellipticity = Math.abs(ns3)

  if (ellipticity > 0.9) {
    // 圆偏振
    return ns3 > 0
      ? t('odyssey.beam.circularR')
      : t('odyssey.beam.circularL')
  } else if (ellipticity < 0.1) {
    // 线偏振 -- 计算方位角
    const azimuth = Math.round(Math.atan2(ns2, ns1) * 90 / Math.PI)
    const normalizedAz = ((azimuth % 180) + 180) % 180
    return `${t('odyssey.beam.linear')} ${normalizedAz}°`
  } else {
    // 椭圆偏振
    return t('odyssey.beam.elliptical')
  }
}

/**
 * BeamTooltip -- 光束悬停物理信息
 *
 * 监听鼠标在光束段上的悬停事件。
 * 显示在鼠标位置附近的紧凑信息卡。
 */
export function BeamTooltip() {
  const { t } = useTranslation()
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const achievedDiscoveries = useOdysseyWorldStore((s) => s.achievedDiscoveries)

  // 只有在有发现之后才启用 (渐进披露)
  const enabled = achievedDiscoveries.size > 0

  // 监听 hoveredElementId 变化 -- 光束段 hover 通过 store
  useEffect(() => {
    if (!enabled) return

    const unsub = useOdysseyWorldStore.subscribe(
      (state) => state.hoveredElementId,
      (hoveredId) => {
        if (!hoveredId) {
          setTooltip(null)
          return
        }

        // 查找匹配的光束段
        const state = useOdysseyWorldStore.getState()
        const segment = state.beamSegments.find((seg) => seg.id === hoveredId)
        if (!segment) {
          setTooltip(null)
          return
        }

        const polarization = describePolarization(segment.stokes, t)
        const pos = state.tooltipPosition

        setTooltip({
          intensity: segment.stokes.s0,
          polarization,
          x: pos?.x ?? 0,
          y: pos?.y ?? 0,
        })
      },
    )

    return () => unsub()
  }, [enabled, t])

  if (!tooltip) return null

  return (
    <div
      className={cn(
        'pointer-events-none fixed z-20',
        'rounded-lg px-2.5 py-1.5',
        'bg-gray-900/80 dark:bg-gray-950/80',
        'backdrop-blur-sm',
        'border border-white/10',
        'text-white',
        'font-mono text-[11px]',
        'space-y-0.5',
        'max-w-[200px]',
      )}
      style={{
        left: tooltip.x + 12,
        top: tooltip.y - 8,
      }}
    >
      {/* 强度 */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400">I</span>
        <span className="text-amber-300">{tooltip.intensity.toFixed(2)}</span>
      </div>

      {/* 偏振态 */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400">P</span>
        <span className="text-blue-300">{tooltip.polarization}</span>
      </div>
    </div>
  )
}
