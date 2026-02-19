/**
 * BeamPathBar.tsx — 水平光束路径条
 *
 * 核心可视化组件：展示光束通过光学元件前后的状态变化
 * 输入光束 → 光学元件(可拖拽调参) → 输出光束
 * 160px 高度，全宽
 */

import { useRef, useCallback, useEffect } from 'react'
import type { BeamState } from './store'
import { PolarizerSVG } from './optical-elements/PolarizerSVG'

// ── Types ────────────────────────────────────────────────────

interface BeamPathBarProps {
  inputBeam: BeamState
  outputBeam: BeamState
  elementType: 'polarizer' | 'crystal' | 'surface' | 'scatter' | 'generic'
  color: string
  paramValue: number
  onParamChange: (value: number) => void
  stationId: string
  formula?: string
}

// ── Beam CSS animation keyframes (injected once) ─────────────

const BEAM_STYLE_ID = 'beam-path-bar-styles'

function ensureBeamStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(BEAM_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = BEAM_STYLE_ID
  style.textContent = `
    @keyframes flowBeam {
      from { background-position: 0 0; }
      to { background-position: 40px 0; }
    }
  `
  document.head.appendChild(style)
}

// ── Readout Panel ────────────────────────────────────────────

function ReadoutPanel({
  beam,
  label,
  color,
  paramLabel,
  paramValue,
}: {
  beam: BeamState
  label: string
  color: string
  paramLabel?: string
  paramValue?: number
}) {
  return (
    <div
      className="font-mono text-[11px] leading-snug rounded-lg px-3 py-2 shrink-0 select-none"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}15`,
      }}
    >
      <div className="text-[9px] uppercase tracking-widest opacity-40 mb-1">
        {label}
      </div>
      <div style={{ color }}>
        I = {beam.intensity.toFixed(2)}
      </div>
      {paramLabel != null && paramValue != null && (
        <div className="opacity-60">
          {paramLabel} = {paramValue.toFixed(1)}&deg;
        </div>
      )}
    </div>
  )
}

// ── Beam Segment ─────────────────────────────────────────────

function BeamSegment({
  color,
  intensityRatio,
  isOutput,
}: {
  color: string
  intensityRatio: number
  isOutput: boolean
}) {
  const height = isOutput ? Math.max(1, 6 * intensityRatio) : 1.5
  const opacity = isOutput ? Math.max(0.15, intensityRatio) : 1

  return (
    <div className="flex-1 flex items-center min-w-[40px]">
      <div
        className="w-full rounded-full"
        style={{
          height: `${height}px`,
          opacity,
          background: `repeating-linear-gradient(
            90deg,
            ${color}cc 0px,
            ${color}40 10px,
            ${color}cc 20px,
            ${color}40 30px,
            ${color}cc 40px
          )`,
          backgroundSize: '40px 100%',
          boxShadow: `0 0 ${6 * intensityRatio}px ${color}60, 0 0 ${12 * intensityRatio}px ${color}30`,
          animation: 'flowBeam 1.2s linear infinite',
        }}
      />
    </div>
  )
}

// ── Element Placeholder ──────────────────────────────────────
// 非偏振器类型的占位圆

function ElementPlaceholder({ color, size }: { color: string; size: number }) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="placeholder-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>
      <circle
        cx={40}
        cy={40}
        r={24}
        fill={`${color}10`}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.5}
      />
      <circle
        cx={40}
        cy={40}
        r={4}
        fill={color}
        opacity={0.6}
      />
    </svg>
  )
}

// ── Main Component ───────────────────────────────────────────

export function BeamPathBar({
  inputBeam,
  outputBeam,
  elementType,
  color,
  paramValue,
  onParamChange,
  stationId: _stationId,
  formula: _formula,
}: BeamPathBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartValueRef = useRef(0)

  // 注入 CSS 动画样式
  useEffect(() => {
    ensureBeamStyles()
  }, [])

  // 光束强度比
  const intensityRatio =
    inputBeam.intensity > 0
      ? outputBeam.intensity / inputBeam.intensity
      : 0

  // ── Drag handlers (1px = 1 degree) ──

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDraggingRef.current = true
      dragStartXRef.current = e.clientX
      dragStartValueRef.current = paramValue
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [paramValue],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return
      const dx = e.clientX - dragStartXRef.current
      const newValue = dragStartValueRef.current + dx // 1px = 1 degree
      onParamChange(newValue)
    },
    [onParamChange],
  )

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  // ── Render the optical element SVG ──

  const elementSize = 64

  const renderElement = () => {
    if (elementType === 'polarizer') {
      return (
        <PolarizerSVG
          angle={paramValue}
          color={color}
          size={elementSize}
        />
      )
    }
    return <ElementPlaceholder color={color} size={elementSize} />
  }

  // ── Param label for readout panels ──
  const paramLabel =
    elementType === 'polarizer'
      ? '\u03B8' // θ
      : elementType === 'surface'
        ? '\u03B8i' // θi
        : elementType === 'crystal'
          ? '\u03B4' // δ
          : null

  // ── Stokes S1 to angle (偏振方位角) ──
  const inputAngle =
    inputBeam.stokes[1] !== 0 || inputBeam.stokes[2] !== 0
      ? (Math.atan2(inputBeam.stokes[2], inputBeam.stokes[1]) * 180) / (2 * Math.PI)
      : 0
  const outputAngle =
    outputBeam.stokes[1] !== 0 || outputBeam.stokes[2] !== 0
      ? (Math.atan2(outputBeam.stokes[2], outputBeam.stokes[1]) * 180) / (2 * Math.PI)
      : 0

  return (
    <div
      ref={containerRef}
      className="flex items-center h-40 px-6 rounded-xl transition-colors duration-300 group/bar"
      style={{
        border: `1px solid ${color}15`,
        background: `linear-gradient(135deg, ${color}04, transparent 60%)`,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = `${color}30`
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = `${color}15`
      }}
    >
      {/* Input readout */}
      <ReadoutPanel
        beam={inputBeam}
        label="Input"
        color={color}
        paramLabel="\u03B8"
        paramValue={inputAngle}
      />

      {/* Input beam segment */}
      <BeamSegment color={color} intensityRatio={1} isOutput={false} />

      {/* Optical element (draggable) */}
      <div
        className="shrink-0 mx-2 flex flex-col items-center gap-1"
        style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {renderElement()}
      </div>

      {/* Output beam segment */}
      <BeamSegment color={color} intensityRatio={intensityRatio} isOutput />

      {/* Output readout */}
      <ReadoutPanel
        beam={outputBeam}
        label="Output"
        color={color}
        paramLabel={paramLabel ?? undefined}
        paramValue={paramLabel ? outputAngle : undefined}
      />

      {/* Drag hint */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-mono tracking-widest uppercase opacity-0 group-hover/bar:opacity-20 transition-opacity pointer-events-none select-none">
        &larr; drag element to adjust &rarr;
      </div>
    </div>
  )
}
