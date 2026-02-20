/**
 * EnvironmentPopup.tsx -- 环境属性弹窗组件
 *
 * 上下文弹窗，附着在被点击的场景元素上:
 * - 光源: 波长滑块、强度滑块、偏振方式下拉
 * - 环境区域: 介质类型下拉、折射率滑块
 *
 * HTML 叠加层 (非 SVG)，使用 CSS 绝对定位 + transform。
 * Framer Motion AnimatePresence 提供进出动画。
 * 点击外部区域关闭弹窗。
 */

import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import {
  useEnvironmentProperties,
  MEDIUM_REFRACTIVE_INDICES,
  MEDIUM_LABELS,
  POLARIZATION_OPTIONS,
  POLARIZATION_LABELS,
} from './hooks/useEnvironmentProperties'

// ── 波长到可见光颜色转换 ──────────────────────────────────────────────

/**
 * 将波长 (nm) 转换为 CSS 颜色
 *
 * 基于 CIE 近似算法，380-780nm 可见光范围。
 * 紫外/红外区域平滑衰减到黑色。
 */
function wavelengthToColor(wavelength: number): string {
  let r: number, g: number, b: number

  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380)
    g = 0
    b = 1
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0
    g = (wavelength - 440) / (490 - 440)
    b = 1
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0
    g = 1
    b = -(wavelength - 510) / (510 - 490)
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510)
    g = 1
    b = 0
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1
    g = -(wavelength - 645) / (645 - 580)
    b = 0
  } else if (wavelength >= 645 && wavelength <= 780) {
    r = 1
    g = 0
    b = 0
  } else {
    r = 0
    g = 0
    b = 0
  }

  // 边缘衰减因子
  let factor: number
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + (0.7 * (wavelength - 380)) / (420 - 380)
  } else if (wavelength >= 420 && wavelength <= 700) {
    factor = 1.0
  } else if (wavelength > 700 && wavelength <= 780) {
    factor = 0.3 + (0.7 * (780 - wavelength)) / (780 - 700)
  } else {
    factor = 0
  }

  return `rgb(${Math.round(r * factor * 255)}, ${Math.round(g * factor * 255)}, ${Math.round(b * factor * 255)})`
}

// ── 光源属性面板 ──────────────────────────────────────────────────────

interface LightSourcePanelProps {
  properties: Record<string, number | string | boolean>
  onUpdate: (key: string, value: number | string) => void
}

/** 光源属性面板: 波长、强度、偏振方式 */
function LightSourcePanel({ properties, onUpdate }: LightSourcePanelProps) {
  const wavelength = (properties.wavelength as number) ?? 550
  const intensity = (properties.intensity as number) ?? 1
  const polarization = (properties.polarization as string) ?? 'horizontal'

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold tracking-wider text-amber-300/90 uppercase">
        Light Source
      </div>

      {/* 波长滑块 + 颜色预览 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/70">Wavelength</span>
          <div className="flex items-center gap-1.5">
            <div
              className="h-3 w-3 rounded-full border border-white/20"
              style={{ backgroundColor: wavelengthToColor(wavelength) }}
            />
            <span className="text-xs font-mono text-white/90">{wavelength} nm</span>
          </div>
        </div>
        <input
          type="range"
          min={380}
          max={780}
          step={1}
          value={wavelength}
          onChange={(e) => onUpdate('wavelength', Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10
            [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>

      {/* 强度滑块 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/70">Intensity</span>
          <span className="text-xs font-mono text-white/90">{intensity.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={intensity}
          onChange={(e) => onUpdate('intensity', Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10
            [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>

      {/* 偏振方式下拉 */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-white/70">Polarization</span>
        <select
          value={polarization}
          onChange={(e) => onUpdate('polarization', e.target.value)}
          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/90
            outline-none focus:border-amber-400/50"
        >
          {POLARIZATION_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-gray-800 text-white">
              {POLARIZATION_LABELS[opt]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

// ── 环境属性面板 ──────────────────────────────────────────────────────

interface EnvironmentPanelProps {
  properties: Record<string, number | string | boolean>
  onUpdate: (key: string, value: number | string) => void
}

/** 环境属性面板: 介质类型、折射率 */
function EnvironmentPanel({ properties, onUpdate }: EnvironmentPanelProps) {
  const mediumType = (properties.mediumType as string) ?? 'glass'
  const refractiveIndex = (properties.refractiveIndex as number) ?? 1.52

  // 介质类型变更时自动更新折射率
  const handleMediumChange = useCallback(
    (newMedium: string) => {
      onUpdate('mediumType', newMedium)
      const standardIndex = MEDIUM_REFRACTIVE_INDICES[newMedium]
      if (standardIndex !== undefined) {
        onUpdate('refractiveIndex', standardIndex)
      }
    },
    [onUpdate],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold tracking-wider text-cyan-300/90 uppercase">
        Medium
      </div>

      {/* 介质类型下拉 */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-white/70">Material</span>
        <select
          value={mediumType}
          onChange={(e) => handleMediumChange(e.target.value)}
          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/90
            outline-none focus:border-cyan-400/50"
        >
          {Object.keys(MEDIUM_LABELS).map((key) => (
            <option key={key} value={key} className="bg-gray-800 text-white">
              {MEDIUM_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      {/* 折射率滑块 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/70">Refractive Index</span>
          <span className="text-xs font-mono text-white/90">{refractiveIndex.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={1.0}
          max={2.5}
          step={0.01}
          value={refractiveIndex}
          onChange={(e) => onUpdate('refractiveIndex', Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10
            [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
    </div>
  )
}

// ── 弹窗主组件 ──────────────────────────────────────────────────────

/**
 * EnvironmentPopup -- 上下文属性弹窗
 *
 * 绝对定位在视口上方，跟踪目标元素的屏幕位置。
 * 箭头指向目标元素。Framer Motion 动画进出。
 * 点击外部关闭。
 */
export function EnvironmentPopup() {
  const popupTarget = useOdysseyWorldStore((s) => s.environmentPopupTarget)
  const closePopup = useOdysseyWorldStore((s) => s.closeEnvironmentPopup)
  const popupRef = useRef<HTMLDivElement>(null)

  const { properties, elementType, updateProperty, elementScreenPos } =
    useEnvironmentProperties(popupTarget)

  // 点击外部关闭弹窗
  useEffect(() => {
    if (!popupTarget) return

    const handlePointerDown = (e: PointerEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup()
      }
    }

    // 延迟添加监听器，防止打开弹窗的点击事件立即触发关闭
    const timer = setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerDown)
    }, 0)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [popupTarget, closePopup])

  // 弹窗偏移量 (弹窗在元素上方显示)
  const popupOffsetY = -120
  const popupWidth = 200

  // 视口边界夹紧 (防止弹窗超出屏幕)
  const clampedX = Math.max(
    popupWidth / 2 + 8,
    Math.min(
      (typeof window !== 'undefined' ? window.innerWidth : 1200) - popupWidth / 2 - 8,
      elementScreenPos.x,
    ),
  )
  const clampedY = Math.max(
    8,
    elementScreenPos.y + popupOffsetY,
  )

  return (
    <AnimatePresence>
      {popupTarget && (
        <motion.div
          ref={popupRef}
          key={popupTarget}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="pointer-events-auto absolute z-50"
          style={{
            left: clampedX,
            top: clampedY,
            transform: 'translate(-50%, 0)',
            width: popupWidth,
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* 弹窗主体 */}
          <div
            className="rounded-lg border border-white/10 p-3 shadow-xl"
            style={{
              background: 'rgba(20, 20, 30, 0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* 根据元素类型渲染不同面板 */}
            {elementType === 'light-source' && (
              <LightSourcePanel properties={properties} onUpdate={updateProperty} />
            )}
            {elementType === 'environment' && (
              <EnvironmentPanel properties={properties} onUpdate={updateProperty} />
            )}
          </div>

          {/* 箭头指针 (指向目标元素) */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: -8,
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid rgba(20, 20, 30, 0.85)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
