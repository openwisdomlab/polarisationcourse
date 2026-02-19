/**
 * 菲涅尔方程演示 - Unit 2 (Redesigned with DemoLayout)
 * 演示s偏振和p偏振的反射/透射系数随入射角的变化
 * 采用纯DOM + SVG + Framer Motion一体化设计
 *
 * Physics Engine Migration:
 * - Uses solveFresnel() from unified physics engine for all Fresnel calculations
 * - Uses brewsterAngle() and criticalAngle() for accurate angle computation
 * - No more hardcoded Fresnel equations - all physics delegated to engine
 *
 * 支持难度分层:
 * - foundation: 隐藏方程，简化为"反射光可以变成偏振光"
 * - application: 显示菲涅尔方程图、布儒斯特角标记
 * - research: 边界条件推导、复折射率、DataExportPanel
 *
 * Verification: At n1=1, n2=1.5, Brewster angle should be ~56.31°
 * At this angle, Rp should be exactly 0 (no p-polarization reflection)
 */
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard, Toggle } from '../DemoControls'
import { useDemoTheme } from '../demoThemeColors'
import { DemoHeader, VisualizationPanel, DemoMainLayout, InfoGrid, ChartPanel, StatCard } from '../DemoLayout'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { DifficultyLevel } from '../DifficultyStrategy'
import { WhyButton, DataExportPanel } from '../DifficultyStrategy'
// Import Fresnel solver from unified physics engine
import {
  solveFresnel,
  brewsterAngle as computeBrewsterAngle,
  criticalAngle as computeCriticalAngle,
  REFRACTIVE_INDICES,
} from '@/core/physics/unified'

// 组件属性接口
interface FresnelDemoProps {
  difficultyLevel?: DifficultyLevel
}

/**
 * Calculate Fresnel coefficients using unified physics engine
 * This replaces the hardcoded implementation - all physics now delegated to engine
 *
 * Verification conditions:
 * - At normal incidence (0°): Rs = Rp = ((n1-n2)/(n1+n2))²
 * - At Brewster angle: Rp = 0, Rs > 0
 * - At critical angle (if n1 > n2): Total internal reflection begins
 */
function fresnelEquations(theta1: number, n1: number, n2: number) {
  // Convert degrees to radians for physics engine
  const thetaRad = (theta1 * Math.PI) / 180

  // Use unified physics engine's Fresnel solver
  const coefficients = solveFresnel(n1, n2, thetaRad)

  // Extract amplitude coefficients (rs, rp) from reflectance (Rs, Rp)
  // Physics: R = r², so r = ±√R (sign determined by phase)
  const rs = coefficients.rs.real // Get real part of complex amplitude
  const rp = coefficients.rp.real
  const ts = coefficients.ts.real
  const tp = coefficients.tp.real

  return {
    rs,
    rp,
    ts,
    tp,
    theta2: coefficients.isTIR ? 90 : (coefficients.thetaT * 180) / Math.PI,
    totalReflection: coefficients.isTIR,
    // Also expose power coefficients for direct use
    Rs: coefficients.Rs,
    Rp: coefficients.Rp,
    Ts: coefficients.Ts,
    Tp: coefficients.Tp,
  }
}

// 光强条组件 - Enhanced with refined gradients
function IntensityBar({
  label,
  value,
  color,
  maxValue = 1,
}: {
  label: string
  value: number
  color: 'cyan' | 'pink' | 'green'
  maxValue?: number
}) {
  const colors = {
    cyan: {
      gradient: 'linear-gradient(90deg, rgba(34,211,238,0.05), rgba(34,211,238,0.4), rgba(34,211,238,0.7), rgba(6,182,212,0.95))',
      glow: 'rgba(34,211,238,0.5)',
      text: 'text-cyan-400',
      textLight: 'text-cyan-600',
      trackDark: 'from-slate-800/80 to-slate-900/80 border-cyan-500/10',
      trackLight: 'from-slate-100 to-slate-200 border-cyan-200/30',
    },
    pink: {
      gradient: 'linear-gradient(90deg, rgba(244,114,182,0.05), rgba(244,114,182,0.4), rgba(244,114,182,0.7), rgba(236,72,153,0.95))',
      glow: 'rgba(244,114,182,0.5)',
      text: 'text-pink-400',
      textLight: 'text-pink-600',
      trackDark: 'from-slate-800/80 to-slate-900/80 border-pink-500/10',
      trackLight: 'from-slate-100 to-slate-200 border-pink-200/30',
    },
    green: {
      gradient: 'linear-gradient(90deg, rgba(74,222,128,0.05), rgba(74,222,128,0.4), rgba(74,222,128,0.7), rgba(34,197,94,0.95))',
      glow: 'rgba(74,222,128,0.5)',
      text: 'text-emerald-400',
      textLight: 'text-emerald-600',
      trackDark: 'from-slate-800/80 to-slate-900/80 border-emerald-500/10',
      trackLight: 'from-slate-100 to-slate-200 border-emerald-200/30',
    },
  }

  const dt = useDemoTheme()
  const colorSet = colors[color]
  const percentage = Math.min(1, value / maxValue)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={cn('text-xs font-medium', dt.isDark ? colorSet.text : colorSet.textLight)}>{label}</span>
        <span className={cn('font-mono text-xs tabular-nums font-semibold', dt.isDark ? colorSet.text : colorSet.textLight)}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <div className={cn(
        'h-3.5 rounded-full border overflow-hidden relative',
        'bg-gradient-to-b shadow-inner',
        dt.isDark ? colorSet.trackDark : colorSet.trackLight,
      )}>
        <motion.div
          className="absolute inset-[1.5px] rounded-full origin-left"
          style={{
            background: colorSet.gradient,
            boxShadow: `0 0 10px ${colorSet.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: Math.max(0.02, percentage) }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// 光线SVG可视化 with Draggable Light Source
function FresnelDiagram({
  incidentAngle,
  n1,
  n2,
  showS,
  showP,
  onAngleChange,
  enableDrag = false,
  isZh,
}: {
  incidentAngle: number
  n1: number
  n2: number
  showS: boolean
  showP: boolean
  onAngleChange?: (angle: number) => void
  enableDrag?: boolean
  isZh: boolean
}) {
  const dt = useDemoTheme()
  const svgRef = useRef<SVGSVGElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const fresnel = fresnelEquations(incidentAngle, n1, n2)
  const rad = (incidentAngle * Math.PI) / 180
  const refractRad = (fresnel.theta2 * Math.PI) / 180

  // SVG坐标系中心点
  const cx = 300
  const cy = 190
  const rayLength = 150

  // 入射光起点和方向
  const incidentStart = {
    x: cx - rayLength * Math.sin(rad),
    y: cy - rayLength * Math.cos(rad),
  }

  // 反射光终点
  const reflectEnd = {
    x: cx + rayLength * Math.sin(rad),
    y: cy - rayLength * Math.cos(rad),
  }

  // 折射光终点
  const refractEnd = fresnel.totalReflection
    ? { x: cx, y: cy }
    : {
        x: cx + rayLength * Math.sin(refractRad),
        y: cy + rayLength * Math.cos(refractRad),
      }

  // Calculate angle from mouse position
  const calculateAngleFromMouse = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current || !onAngleChange) return

    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    const viewBox = svg.viewBox.baseVal

    // Convert client coordinates to SVG coordinates
    const scaleX = viewBox.width / rect.width
    const scaleY = viewBox.height / rect.height
    const svgX = (clientX - rect.left) * scaleX + viewBox.x
    const svgY = (clientY - rect.top) * scaleY + viewBox.y

    // Calculate angle from interface center (cx, cy)
    const dx = svgX - cx
    const dy = cy - svgY // Invert Y because SVG Y is downward

    // Only consider upper half (incident medium)
    if (dy > 0) {
      // atan2 gives angle from positive X axis, we want angle from normal (Y axis)
      const angle = Math.atan2(-dx, dy) * (180 / Math.PI)
      // Clamp to valid range [0, 89]
      const clampedAngle = Math.max(0, Math.min(89, Math.abs(angle)))
      onAngleChange(Math.round(clampedAngle))
    }
  }, [onAngleChange, cx, cy])

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enableDrag || !onAngleChange) return
    e.preventDefault()
    setIsDragging(true)
    calculateAngleFromMouse(e.clientX, e.clientY)
  }, [enableDrag, onAngleChange, calculateAngleFromMouse])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    calculateAngleFromMouse(e.clientX, e.clientY)
  }, [isDragging, calculateAngleFromMouse])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
    return undefined
  }, [isDragging, handleMouseMove, handleMouseUp])

  // 反射率 - 直接使用物理引擎计算的功率系数
  // Physics: R = |r|², T = (n₂cosθ₂)/(n₁cosθ₁)|t|²
  const Rs = fresnel.Rs
  const Rp = fresnel.Rp
  const Ts = fresnel.Ts
  const Tp = fresnel.Tp

  // 布儒斯特角 - 使用物理引擎计算
  // Physics: tan(θB) = n₂/n₁, verified by engine
  const brewsterAngle = computeBrewsterAngle(n1, n2) * (180 / Math.PI)

  // Medium labels
  const medium1Label = isZh ? `介质1: n\u2081 = ${n1.toFixed(2)}` : `Medium 1: n\u2081 = ${n1.toFixed(2)}`
  const medium2Label = isZh ? `介质2: n\u2082 = ${n2.toFixed(2)}` : `Medium 2: n\u2082 = ${n2.toFixed(2)}`
  const normalLabel = isZh ? '法线' : 'Normal'
  const incidentLabel = isZh ? '入射光' : 'Incident'
  const reflectedLabel = isZh ? '反射光' : 'Reflected'
  const refractedLabel = isZh ? '折射光' : 'Refracted'
  const tirLabel = isZh ? '全内反射' : 'Total Internal Reflection'
  const dragHint = isZh ? '拖拽调整角度' : 'Drag to adjust'
  const brewsterHintLabel = isZh
    ? `接近布儒斯特角 \u03B8B = ${brewsterAngle.toFixed(1)}\u00B0`
    : `Near Brewster angle \u03B8B = ${brewsterAngle.toFixed(1)}\u00B0`
  const sLabel = isZh ? 's偏振' : 's-pol'
  const pLabel = isZh ? 'p偏振' : 'p-pol'

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 380"
      className={cn('w-full h-auto', enableDrag ? 'cursor-crosshair' : '')}
      onMouseDown={handleMouseDown}
    >
      <defs>
        {/* 渐变定义 - improved medium backgrounds */}
        <linearGradient id="fresnel-medium1Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={dt.isDark ? '#1a3152' : '#bfdbfe'} stopOpacity={dt.isDark ? 0.6 : 0.5} />
          <stop offset="100%" stopColor={dt.isDark ? '#1e3a5f' : '#dbeafe'} stopOpacity={dt.isDark ? 0.25 : 0.3} />
        </linearGradient>
        <linearGradient id="fresnel-medium2Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={dt.isDark ? '#1a4033' : '#bbf7d0'} stopOpacity={dt.isDark ? 0.25 : 0.3} />
          <stop offset="100%" stopColor={dt.isDark ? '#164e3a' : '#a7f3d0'} stopOpacity={dt.isDark ? 0.55 : 0.45} />
        </linearGradient>
        {/* Interface gradient line */}
        <linearGradient id="fresnel-interfaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={dt.isDark ? '#475569' : '#94a3b8'} stopOpacity="0.1" />
          <stop offset="20%" stopColor={dt.isDark ? '#94a3b8' : '#64748b'} stopOpacity="0.8" />
          <stop offset="50%" stopColor={dt.isDark ? '#e2e8f0' : '#475569'} stopOpacity="1" />
          <stop offset="80%" stopColor={dt.isDark ? '#94a3b8' : '#64748b'} stopOpacity="0.8" />
          <stop offset="100%" stopColor={dt.isDark ? '#475569' : '#94a3b8'} stopOpacity="0.1" />
        </linearGradient>
        {/* 发光效果 */}
        <filter id="fresnel-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="fresnel-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 介质1（上方 - 空气/低折射率） */}
      <rect x="30" y="10" width="540" height="180" fill="url(#fresnel-medium1Gradient)" rx="12" ry="12" />
      {/* Subtle pattern for medium 1 */}
      <rect x="30" y="10" width="540" height="180" fill={dt.isDark ? 'rgba(96,165,250,0.02)' : 'rgba(59,130,246,0.03)'} rx="12" ry="12" />
      <text x="70" y="40" fill={dt.isDark ? '#60a5fa' : '#2563eb'} fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">
        {medium1Label}
      </text>

      {/* 介质2（下方 - 玻璃/高折射率） */}
      <rect x="30" y="190" width="540" height="180" fill="url(#fresnel-medium2Gradient)" rx="12" ry="12" />
      {/* Subtle pattern for medium 2 */}
      <rect x="30" y="190" width="540" height="180" fill={dt.isDark ? 'rgba(74,222,128,0.02)' : 'rgba(34,197,94,0.03)'} rx="12" ry="12" />
      <text x="70" y="350" fill={dt.isDark ? '#4ade80' : '#16a34a'} fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">
        {medium2Label}
      </text>

      {/* 界面 - enhanced with gradient line */}
      <line x1="30" y1={cy} x2="570" y2={cy} stroke="url(#fresnel-interfaceGrad)" strokeWidth="2.5" />
      {/* Subtle interface dashes */}
      <line x1="30" y1={cy} x2="570" y2={cy} stroke={dt.isDark ? 'rgba(148,163,184,0.2)' : 'rgba(71,85,105,0.15)'} strokeWidth="1" strokeDasharray="6 4" />

      {/* 法线 */}
      <line x1={cx} y1="30" x2={cx} y2="355" stroke={dt.textSecondary} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      <text x={cx + 8} y="45" fill={dt.textMuted} fontSize="10" fontFamily="system-ui, sans-serif">
        {normalLabel}
      </text>

      {/* 入射光（黄色/amber） */}
      <motion.line
        x1={incidentStart.x}
        y1={incidentStart.y}
        x2={cx}
        y2={cy}
        stroke="#fbbf24"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#fresnel-glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      {/* 入射光箭头 */}
      <motion.polygon
        points={`${cx - 7},${cy - 4} ${cx},${cy} ${cx - 7},${cy + 4}`}
        fill="#fbbf24"
        transform={`rotate(${incidentAngle + 180}, ${cx}, ${cy})`}
        animate={{ opacity: 1 }}
      />
      <text
        x={incidentStart.x - 10}
        y={incidentStart.y - 12}
        fill="#fbbf24"
        fontSize="11"
        fontWeight="600"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
      >
        {incidentLabel}
      </text>

      {/* Draggable light source handle */}
      {enableDrag && (
        <g>
          {/* Outer glow for drag target */}
          <motion.circle
            cx={incidentStart.x}
            cy={incidentStart.y}
            r="18"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity={isDragging ? 1 : 0.4}
            animate={{
              scale: isDragging ? 1.2 : 1,
              opacity: isDragging ? 1 : 0.4,
            }}
            transition={{ duration: 0.15 }}
          />
          {/* Inner drag handle */}
          <motion.circle
            cx={incidentStart.x}
            cy={incidentStart.y}
            r="8"
            fill="#fbbf24"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="1.5"
            style={{ cursor: 'grab' }}
            animate={{
              scale: isDragging ? 1.3 : 1,
            }}
            transition={{ duration: 0.15 }}
          />
          {/* Drag hint text */}
          {!isDragging && (
            <text
              x={incidentStart.x}
              y={incidentStart.y - 26}
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="8"
              opacity="0.6"
              fontFamily="system-ui, sans-serif"
            >
              {dragHint}
            </text>
          )}
        </g>
      )}

      {/* 反射光 - s和p偏振沿同一方向传播，仅强度不同 */}
      {/* 先绘制较弱的偏振（在下层），再绘制较强的偏振（在上层） */}
      {showS && showP && Rs > 0.01 && Rp > 0.01 && (
        // 当两者都显示时，弱的在下层
        Rs >= Rp ? (
          <>
            <motion.line
              x1={cx}
              y1={cy}
              x2={reflectEnd.x}
              y2={reflectEnd.y}
              stroke="#f472b6"
              strokeWidth={Math.max(1.5, 5 * Rp)}
              strokeOpacity={Math.max(0.4, Rp)}
              strokeLinecap="round"
              filter="url(#fresnel-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.line
              x1={cx}
              y1={cy}
              x2={reflectEnd.x}
              y2={reflectEnd.y}
              stroke="#22d3ee"
              strokeWidth={Math.max(1.5, 5 * Rs)}
              strokeOpacity={Math.max(0.4, Rs)}
              strokeLinecap="round"
              filter="url(#fresnel-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
          </>
        ) : (
          <>
            <motion.line
              x1={cx}
              y1={cy}
              x2={reflectEnd.x}
              y2={reflectEnd.y}
              stroke="#22d3ee"
              strokeWidth={Math.max(1.5, 5 * Rs)}
              strokeOpacity={Math.max(0.4, Rs)}
              strokeLinecap="round"
              filter="url(#fresnel-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.line
              x1={cx}
              y1={cy}
              x2={reflectEnd.x}
              y2={reflectEnd.y}
              stroke="#f472b6"
              strokeWidth={Math.max(1.5, 5 * Rp)}
              strokeOpacity={Math.max(0.4, Rp)}
              strokeLinecap="round"
              filter="url(#fresnel-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
          </>
        )
      )}

      {/* 仅显示s偏振反射光（p未选中或p太弱） */}
      {showS && Rs > 0.01 && (!showP || Rp <= 0.01) && (
        <motion.line
          x1={cx}
          y1={cy}
          x2={reflectEnd.x}
          y2={reflectEnd.y}
          stroke="#22d3ee"
          strokeWidth={Math.max(1.5, 5 * Rs)}
          strokeOpacity={Math.max(0.4, Rs)}
          strokeLinecap="round"
          filter="url(#fresnel-glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
      )}

      {/* 仅显示p偏振反射光（s未选中或s太弱） */}
      {showP && Rp > 0.01 && (!showS || Rs <= 0.01) && (
        <motion.line
          x1={cx}
          y1={cy}
          x2={reflectEnd.x}
          y2={reflectEnd.y}
          stroke="#f472b6"
          strokeWidth={Math.max(1.5, 5 * Rp)}
          strokeOpacity={Math.max(0.4, Rp)}
          strokeLinecap="round"
          filter="url(#fresnel-glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
      )}

      {/* 反射光标签 */}
      <text x={reflectEnd.x + 15} y={reflectEnd.y - 12} fill={dt.textSecondary} fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="500">
        {reflectedLabel}
      </text>

      {/* 折射光 - s和p偏振沿同一方向传播（斯涅尔定律），仅强度不同 */}
      {showS && showP && !fresnel.totalReflection && Ts > 0.01 && Tp > 0.01 && (
        // 当两者都显示时，弱的在下层
        Ts >= Tp ? (
          <>
            <motion.line
              x1={cx}
              y1={cy}
              x2={refractEnd.x}
              y2={refractEnd.y}
              stroke="#f472b6"
              strokeWidth={Math.max(1.5, 5 * Tp)}
              strokeOpacity={Math.max(0.4, Tp)}
              strokeLinecap="round"
              filter="url(#fresnel-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            />
            <motion.line
              x1={cx}
              y1={cy}
              x2={refractEnd.x}
              y2={refractEnd.y}
              stroke="#22d3ee"
              strokeWidth={Math.max(1.5, 5 * Ts)}
              strokeOpacity={Math.max(0.4, Ts)}
              strokeLinecap="round"
              filter="url(#fresnel-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            />
          </>
        ) : (
          <>
            <motion.line
              x1={cx}
              y1={cy}
              x2={refractEnd.x}
              y2={refractEnd.y}
              stroke="#22d3ee"
              strokeWidth={Math.max(1.5, 5 * Ts)}
              strokeOpacity={Math.max(0.4, Ts)}
              strokeLinecap="round"
              filter="url(#fresnel-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            />
            <motion.line
              x1={cx}
              y1={cy}
              x2={refractEnd.x}
              y2={refractEnd.y}
              stroke="#f472b6"
              strokeWidth={Math.max(1.5, 5 * Tp)}
              strokeOpacity={Math.max(0.4, Tp)}
              strokeLinecap="round"
              filter="url(#fresnel-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            />
          </>
        )
      )}

      {/* 仅显示s偏振折射光（p未选中或p太弱） */}
      {showS && !fresnel.totalReflection && Ts > 0.01 && (!showP || Tp <= 0.01) && (
        <motion.line
          x1={cx}
          y1={cy}
          x2={refractEnd.x}
          y2={refractEnd.y}
          stroke="#22d3ee"
          strokeWidth={Math.max(1.5, 5 * Ts)}
          strokeOpacity={Math.max(0.4, Ts)}
          strokeLinecap="round"
          filter="url(#fresnel-glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
      )}

      {/* 仅显示p偏振折射光（s未选中或s太弱） */}
      {showP && !fresnel.totalReflection && Tp > 0.01 && (!showS || Ts <= 0.01) && (
        <motion.line
          x1={cx}
          y1={cy}
          x2={refractEnd.x}
          y2={refractEnd.y}
          stroke="#f472b6"
          strokeWidth={Math.max(1.5, 5 * Tp)}
          strokeOpacity={Math.max(0.4, Tp)}
          strokeLinecap="round"
          filter="url(#fresnel-glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
      )}

      {/* 折射光标签 */}
      {!fresnel.totalReflection && (
        <text x={refractEnd.x + 15} y={refractEnd.y + 18} fill={dt.textSecondary} fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="500">
          {refractedLabel}
        </text>
      )}

      {/* 全内反射标注 */}
      {fresnel.totalReflection && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x={cx - 5} y={cy + 30} width={isZh ? 80 : 175} height="24" rx="6" fill={dt.isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)'} stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
          <text x={cx + (isZh ? 35 : 82)} y={cy + 47} fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">
            {tirLabel}
          </text>
        </motion.g>
      )}

      {/* 角度标注 - 入射角 (refined arc) */}
      <path
        d={`M ${cx} ${cy - 40} A 40 40 0 0 0 ${cx - 40 * Math.sin(rad)} ${cy - 40 * Math.cos(rad)}`}
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        opacity="0.8"
      />
      <text
        x={cx - 25 - 15 * Math.sin(rad / 2)}
        y={cy - 50}
        fill="#fbbf24"
        fontSize="12"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
      >
        {'\u03B8\u2081'} = {incidentAngle}{'\u00B0'}
      </text>

      {/* 角度标注 - 折射角 (refined arc) */}
      {!fresnel.totalReflection && (
        <>
          <path
            d={`M ${cx} ${cy + 40} A 40 40 0 0 1 ${cx + 40 * Math.sin(refractRad)} ${cy + 40 * Math.cos(refractRad)}`}
            fill="none"
            stroke="#4ade80"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            opacity="0.8"
          />
          <text
            x={cx + 15 + 15 * Math.sin(refractRad / 2)}
            y={cy + 60}
            fill="#4ade80"
            fontSize="12"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            {'\u03B8\u2082'} = {fresnel.theta2.toFixed(1)}{'\u00B0'}
          </text>
        </>
      )}

      {/* 图例 - refined styling */}
      <g transform="translate(450, 28)">
        <rect x="0" y="0" width="110" height={showS && showP ? 58 : 35} fill={dt.infoPanelBg} rx="8" stroke={dt.infoPanelStroke} strokeWidth="0.5" />
        {showS && (
          <g>
            <line x1="12" y1="18" x2="38" y2="18" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
            <text x="46" y="22" fill="#22d3ee" fontSize="11" fontWeight="500" fontFamily="system-ui, sans-serif">{sLabel}</text>
          </g>
        )}
        {showP && (
          <g>
            <line x1="12" y1={showS ? 40 : 18} x2="38" y2={showS ? 40 : 18} stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
            <text x="46" y={showS ? 44 : 22} fill="#f472b6" fontSize="11" fontWeight="500" fontFamily="system-ui, sans-serif">{pLabel}</text>
          </g>
        )}
      </g>

      {/* Incidence point glow */}
      <circle cx={cx} cy={cy} r="4" fill={dt.isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)'} />
      <circle cx={cx} cy={cy} r="8" fill="none" stroke={dt.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} strokeWidth="1" />

      {/* 布儒斯特角提示 */}
      {Math.abs(incidentAngle - brewsterAngle) < 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x={cx - (isZh ? 95 : 115)} y="2" width={isZh ? 190 : 230} height="22" rx="6" fill={dt.isDark ? 'rgba(34,211,238,0.1)' : 'rgba(34,211,238,0.08)'} stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
          <text
            x={cx}
            y="17"
            textAnchor="middle"
            fill="#22d3ee"
            fontSize="12"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            {brewsterHintLabel}
          </text>
        </motion.g>
      )}
    </svg>
  )
}

// 菲涅尔曲线图 - Enhanced with better styling
function FresnelCurveChart({
  n1,
  n2,
  currentAngle,
  isZh,
}: {
  n1: number
  n2: number
  currentAngle: number
  isZh: boolean
}) {
  const dt = useDemoTheme()

  // 生成曲线数据 - 使用物理引擎计算
  // Physics: All calculations delegated to unified engine's solveFresnel()
  const { rsPath, rpPath, rsAreaPath, rpAreaPath, brewsterAngle, criticalAngle } = useMemo(() => {
    const rsPoints: string[] = []
    const rpPoints: string[] = []
    const rsAreaPoints: string[] = []
    const rpAreaPoints: string[] = []

    // Use physics engine for Brewster and critical angle calculations
    // Brewster: tan(θB) = n₂/n₁ (radians returned by engine)
    // Critical: sin(θc) = n₂/n₁ (only when n₁ > n₂)
    const brewster = computeBrewsterAngle(n1, n2) * (180 / Math.PI)
    const critical = n1 > n2 ? computeCriticalAngle(n1, n2) * (180 / Math.PI) : 90

    for (let angle = 0; angle <= 90; angle += 1) {
      // Use physics engine for Fresnel calculations
      const f = fresnelEquations(angle, n1, n2)
      // Use power coefficients directly from engine
      const Rs = f.Rs
      const Rp = f.Rp

      const x = 50 + (angle / 90) * 230
      const yRs = 140 - Rs * 110
      const yRp = 140 - Rp * 110

      rsPoints.push(`${angle === 0 ? 'M' : 'L'} ${x},${yRs}`)
      rpPoints.push(`${angle === 0 ? 'M' : 'L'} ${x},${yRp}`)

      rsAreaPoints.push(`${angle === 0 ? 'M' : 'L'} ${x},${yRs}`)
      rpAreaPoints.push(`${angle === 0 ? 'M' : 'L'} ${x},${yRp}`)
    }

    // Close area paths
    rsAreaPoints.push(`L ${50 + 230},140 L 50,140 Z`)
    rpAreaPoints.push(`L ${50 + 230},140 L 50,140 Z`)

    return {
      rsPath: rsPoints.join(' '),
      rpPath: rpPoints.join(' '),
      rsAreaPath: rsAreaPoints.join(' '),
      rpAreaPath: rpAreaPoints.join(' '),
      brewsterAngle: brewster,
      criticalAngle: critical,
    }
  }, [n1, n2])

  const currentX = 50 + (currentAngle / 90) * 230
  const currentFresnel = fresnelEquations(currentAngle, n1, n2)
  // Use power coefficients directly from physics engine
  const currentRs = currentFresnel.Rs
  const currentRp = currentFresnel.Rp
  const currentYs = 140 - currentRs * 110
  const currentYp = 140 - currentRp * 110

  const angleLabel = isZh ? '\u03B8 (\u5EA6)' : '\u03B8 (deg)'

  return (
    <svg viewBox="0 0 320 175" className="w-full h-auto">
      <defs>
        {/* Area fill gradients */}
        <linearGradient id="fresnel-rsAreaFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="fresnel-rpAreaFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* 背景网格 */}
      <rect x="50" y="30" width="230" height="110" fill={dt.canvasBgAlt} rx="4" />

      {/* Fine grid lines */}
      {[0.25, 0.5, 0.75].map((val) => {
        const y = 140 - val * 110
        return (
          <line key={val} x1="50" y1={y} x2="280" y2={y} stroke={dt.gridLineColor} strokeWidth="0.5" strokeDasharray="2 3" />
        )
      })}
      {[15, 30, 45, 60, 75].map((angle) => {
        const x = 50 + (angle / 90) * 230
        return (
          <line key={angle} x1={x} y1="30" x2={x} y2="140" stroke={dt.gridLineColor} strokeWidth="0.5" strokeDasharray="2 3" />
        )
      })}

      {/* 坐标轴 */}
      <line x1="50" y1="140" x2="285" y2="140" stroke={dt.axisColor} strokeWidth="1.5" />
      <line x1="50" y1="28" x2="50" y2="140" stroke={dt.axisColor} strokeWidth="1.5" />

      {/* X轴刻度 */}
      {[0, 30, 45, 60, 90].map((angle) => {
        const x = 50 + (angle / 90) * 230
        return (
          <g key={angle}>
            <line x1={x} y1="140" x2={x} y2="145" stroke={dt.textSecondary} strokeWidth="1" />
            <text x={x} y="156" textAnchor="middle" fill={dt.textSecondary} fontSize="9" fontFamily="system-ui, sans-serif">{angle}{'\u00B0'}</text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      {[0, 0.25, 0.5, 0.75, 1].map((val) => {
        const y = 140 - val * 110
        return (
          <g key={val}>
            <line x1="45" y1={y} x2="50" y2={y} stroke={dt.textSecondary} strokeWidth="1" />
            <text x="40" y={y + 3} textAnchor="end" fill={dt.textSecondary} fontSize="9" fontFamily="system-ui, sans-serif">{val}</text>
          </g>
        )
      })}

      {/* 布儒斯特角标记 */}
      {n1 < n2 && (
        <>
          <line
            x1={50 + (brewsterAngle / 90) * 230}
            y1="30"
            x2={50 + (brewsterAngle / 90) * 230}
            y2="140"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeDasharray="4 2"
            opacity="0.7"
          />
          <text
            x={50 + (brewsterAngle / 90) * 230}
            y="25"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="10"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            {'\u03B8'}B
          </text>
        </>
      )}

      {/* 临界角标记 */}
      {n1 > n2 && criticalAngle < 90 && (
        <>
          <rect
            x={50 + (criticalAngle / 90) * 230}
            y="30"
            width={230 - (criticalAngle / 90) * 230}
            height="110"
            fill={dt.isDark ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.04)'}
          />
          <line
            x1={50 + (criticalAngle / 90) * 230}
            y1="30"
            x2={50 + (criticalAngle / 90) * 230}
            y2="140"
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="4 2"
            opacity="0.7"
          />
          <text
            x={50 + (criticalAngle / 90) * 230}
            y="25"
            textAnchor="middle"
            fill="#ef4444"
            fontSize="10"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            {'\u03B8'}c
          </text>
        </>
      )}

      {/* Rs area fill */}
      <path d={rsAreaPath} fill="url(#fresnel-rsAreaFill)" />

      {/* Rp area fill */}
      <path d={rpAreaPath} fill="url(#fresnel-rpAreaFill)" />

      {/* Rs曲线 */}
      <path d={rsPath} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Rp曲线 */}
      <path d={rpPath} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* 当前位置指示线 */}
      <line x1={currentX} y1="30" x2={currentX} y2="140" stroke={dt.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'} strokeWidth="1" />

      {/* 当前点标记 */}
      <motion.circle
        cx={currentX}
        cy={currentYs}
        r="5"
        fill="#22d3ee"
        stroke={dt.isDark ? '#0f172a' : '#fff'}
        strokeWidth="2"
        animate={{ cx: currentX, cy: currentYs }}
        transition={{ duration: 0.2 }}
      />
      <motion.circle
        cx={currentX}
        cy={currentYp}
        r="5"
        fill="#f472b6"
        stroke={dt.isDark ? '#0f172a' : '#fff'}
        strokeWidth="2"
        animate={{ cx: currentX, cy: currentYp }}
        transition={{ duration: 0.2 }}
      />

      {/* 轴标签 */}
      <text x="165" y="172" textAnchor="middle" fill={dt.textSecondary} fontSize="10" fontFamily="system-ui, sans-serif">{angleLabel}</text>
      <text x="18" y="90" fill={dt.textSecondary} fontSize="10" fontFamily="system-ui, sans-serif" transform="rotate(-90 18 90)">R</text>

      {/* 图例 */}
      <g transform="translate(210, 38)">
        <rect x="-4" y="-8" width="70" height="36" fill={dt.infoPanelBg} rx="4" stroke={dt.infoPanelStroke} strokeWidth="0.5" />
        <line x1="2" y1="2" x2="22" y2="2" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
        <text x="28" y="6" fill="#22d3ee" fontSize="10" fontWeight="500" fontFamily="system-ui, sans-serif">Rs</text>
        <line x1="2" y1="18" x2="22" y2="18" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
        <text x="28" y="22" fill="#f472b6" fontSize="10" fontWeight="500" fontFamily="system-ui, sans-serif">Rp</text>
      </g>
    </svg>
  )
}

// 主演示组件
export function FresnelDemo({ difficultyLevel = 'application' }: FresnelDemoProps) {
  const dt = useDemoTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // 判断难度级别
  const isFoundation = difficultyLevel === 'foundation'
  const isResearch = difficultyLevel === 'research'

  const [incidentAngle, setIncidentAngle] = useState(45)
  const [n1, setN1] = useState(1.0)
  const [n2, setN2] = useState(1.5)
  const [showS, setShowS] = useState(true)
  const [showP, setShowP] = useState(true)
  const [enableDrag, setEnableDrag] = useState(true)

  // All Fresnel calculations now delegated to physics engine
  const fresnel = fresnelEquations(incidentAngle, n1, n2)
  // Use power coefficients directly from physics engine
  const Rs = fresnel.Rs
  const Rp = fresnel.Rp
  const Ts = fresnel.Ts
  const Tp = fresnel.Tp

  // Use physics engine for Brewster and critical angle calculations
  // Verification: At n1=1.0, n2=1.5, Brewster angle should be ~56.31°
  const brewsterAngle = computeBrewsterAngle(n1, n2) * (180 / Math.PI)
  // Critical angle only exists when n1 > n2 (total internal reflection)
  const criticalAngle = n1 > n2 ? computeCriticalAngle(n1, n2) * (180 / Math.PI) : null

  // 材料预设 - Using REFRACTIVE_INDICES from physics engine where available
  const materials = [
    { name: isZh ? '空气→玻璃' : 'Air\u2192Glass', nameZh: '空气→玻璃', n1: REFRACTIVE_INDICES.air, n2: REFRACTIVE_INDICES.glass },
    { name: isZh ? '空气→水' : 'Air\u2192Water', nameZh: '空气→水', n1: REFRACTIVE_INDICES.air, n2: REFRACTIVE_INDICES.water },
    { name: isZh ? '玻璃→空气' : 'Glass\u2192Air', nameZh: '玻璃→空气', n1: REFRACTIVE_INDICES.glass, n2: REFRACTIVE_INDICES.air },
    { name: isZh ? '水→空气' : 'Water\u2192Air', nameZh: '水→空气', n1: REFRACTIVE_INDICES.water, n2: REFRACTIVE_INDICES.air },
    { name: isZh ? '空气→钻石' : 'Air\u2192Diamond', nameZh: '空气→钻石', n1: REFRACTIVE_INDICES.air, n2: REFRACTIVE_INDICES.diamond },
  ]

  // i18n labels
  const titleLabel = isZh ? '菲涅尔方程交互演示' : 'Interactive Fresnel Equations'
  const subtitleLabel = isZh ? '探索s偏振和p偏振光在界面反射/折射时的行为差异' : 'Explore s and p polarization behavior at material interfaces'
  const paramLabel = isZh ? '参数控制' : 'Parameters'
  const angleLabel = isZh ? '入射角 \u03B8\u2081' : 'Incident Angle \u03B8\u2081'
  const n1Label = isZh ? '介质1折射率 n\u2081' : 'Medium 1 Index n\u2081'
  const n2Label = isZh ? '介质2折射率 n\u2082' : 'Medium 2 Index n\u2082'
  const sPolLabel = isZh ? 's偏振' : 's-polarization'
  const pPolLabel = isZh ? 'p偏振' : 'p-polarization'
  const dragLabel = isZh ? '拖拽调整入射角' : 'Drag to Adjust Angle'
  const presetLabel = isZh ? '快速预设' : 'Quick Presets'
  const reflTransLabel = isZh ? '反射率与透射率' : 'Reflectance & Transmittance'
  const rsLabel = isZh ? 'Rs (s偏振反射率)' : 'Rs (s-pol reflectance)'
  const tsLabel = isZh ? 'Ts (s偏振透射率)' : 'Ts (s-pol transmittance)'
  const rpLabel = isZh ? 'Rp (p偏振反射率)' : 'Rp (p-pol reflectance)'
  const tpLabel = isZh ? 'Tp (p偏振透射率)' : 'Tp (p-pol transmittance)'
  const refAngleLabel = isZh ? '折射角 \u03B8\u2082' : 'Refraction Angle \u03B8\u2082'
  const brewsterLabel = isZh ? '布儒斯特角' : 'Brewster Angle'
  const criticalLabel = isZh ? '临界角' : 'Critical Angle'
  const curveTitle = isZh ? '反射率曲线 R(\u03B8)' : 'Reflectance Curves R(\u03B8)'
  const curveSubtitle = isZh ? '当前入射角标记' : 'Current angle marked'
  const curveNote = isZh
    ? '圆点表示当前入射角对应的反射率。在布儒斯特角处，p偏振反射率为零。'
    : 'Dots mark current angle reflectance. At Brewster angle, p-pol reflectance is zero.'
  const formulaTitle = isZh ? '菲涅尔方程' : 'Fresnel Equations'
  const fresnelCardTitle = isZh ? '菲涅尔方程' : 'Fresnel Equations'
  const fresnelCardDesc = isZh
    ? '描述电磁波在两种介质界面反射和透射的振幅比。s偏振（垂直于入射面）和p偏振（平行于入射面）有不同的反射特性。'
    : 'Describes amplitude ratios of reflected and transmitted EM waves at an interface. s-polarization (perpendicular to incidence plane) and p-polarization (parallel) have different reflection characteristics.'
  const brewsterCardTitle = isZh ? '布儒斯特角' : "Brewster's Angle"
  const brewsterCardDesc = isZh
    ? '当 \u03B8\u2081 + \u03B8\u2082 = 90\u00B0 时，p偏振反射光消失。此时 tan(\u03B8B) = n\u2082/n\u2081。应用于偏振镜片和减反射涂层。'
    : 'When \u03B8\u2081 + \u03B8\u2082 = 90\u00B0, p-polarized reflection vanishes. tan(\u03B8B) = n\u2082/n\u2081. Applied in polarizing lenses and anti-reflection coatings.'
  const tirCardTitle = isZh ? '全内反射' : 'Total Internal Reflection'
  const tirCardDesc = isZh
    ? '当光从高折射率介质进入低折射率介质，且入射角大于临界角时发生。应用于光纤通信和全内反射棱镜。'
    : 'Occurs when light travels from a denser to rarer medium with incidence angle exceeding the critical angle. Applied in fiber optics and TIR prisms.'
  const tirValue = isZh ? '全反射' : 'TIR'
  const noTIR = isZh ? '无 (n\u2081 < n\u2082)' : 'N/A (n\u2081 < n\u2082)'

  // Build visualization section
  const visualization = (
    <div className="space-y-4">
      {/* 光线图 */}
      <VisualizationPanel variant="default">
        <FresnelDiagram
          incidentAngle={incidentAngle}
          n1={n1}
          n2={n2}
          showS={showS}
          showP={showP}
          enableDrag={enableDrag}
          onAngleChange={setIncidentAngle}
          isZh={isZh}
        />
      </VisualizationPanel>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard
          label={refAngleLabel}
          value={fresnel.totalReflection ? tirValue : `${fresnel.theta2.toFixed(1)}\u00B0`}
          color={fresnel.totalReflection ? 'red' : 'green'}
        />
        <StatCard
          label={brewsterLabel}
          value={`${brewsterAngle.toFixed(1)}\u00B0`}
          color="yellow"
        />
        <StatCard
          label={criticalLabel}
          value={criticalAngle != null ? `${criticalAngle.toFixed(1)}\u00B0` : noTIR}
          color={criticalAngle != null ? 'red' : 'blue'}
        />
        <StatCard
          label="Rs + Ts"
          value={(Rs + Ts).toFixed(4)}
          color="cyan"
        />
      </div>

      {/* 反射率/透射率条 */}
      <div className={cn(
        'rounded-xl border p-4 space-y-2.5',
        dt.isDark ? 'bg-slate-800/30 border-slate-700/40' : 'bg-white/60 border-slate-200/60',
      )}>
        <h4 className={cn('text-xs font-semibold mb-3', dt.isDark ? 'text-gray-300' : 'text-gray-700')}>
          {reflTransLabel}
        </h4>
        {showS && (
          <>
            <IntensityBar label={rsLabel} value={Rs} color="cyan" />
            <IntensityBar label={tsLabel} value={Ts} color="green" />
          </>
        )}
        {showS && showP && <div className={cn('h-px my-1', dt.isDark ? 'bg-slate-700/60' : 'bg-slate-200')} />}
        {showP && (
          <>
            <IntensityBar label={rpLabel} value={Rp} color="pink" />
            <IntensityBar label={tpLabel} value={Tp} color="green" />
          </>
        )}
      </div>
    </div>
  )

  // Build controls section
  const controls = (
    <div className="space-y-4">
      {/* 参数控制 */}
      <ControlPanel title={paramLabel}>
        <SliderControl
          label={angleLabel}
          value={incidentAngle}
          min={0}
          max={89}
          step={1}
          unit={'\u00B0'}
          onChange={setIncidentAngle}
          color="orange"
        />
        {/* 折射率控制 - 基础难度只用预设 */}
        {!isFoundation && (
          <>
            <SliderControl
              label={n1Label}
              value={n1}
              min={1.0}
              max={2.5}
              step={0.05}
              onChange={setN1}
              formatValue={(v) => v.toFixed(2)}
              color="blue"
            />
            <SliderControl
              label={n2Label}
              value={n2}
              min={1.0}
              max={2.5}
              step={0.05}
              onChange={setN2}
              formatValue={(v) => v.toFixed(2)}
              color="green"
            />
          </>
        )}

        {/* 偏振选择 - 基础难度隐藏 */}
        {!isFoundation && (
          <div className="flex gap-4 pt-2">
            <label className={cn('flex items-center gap-2 text-sm cursor-pointer', dt.mutedTextClass)}>
              <input
                type="checkbox"
                checked={showS}
                onChange={(e) => setShowS(e.target.checked)}
                className="rounded border-cyan-500 text-cyan-500 focus:ring-cyan-500"
              />
              <span className={dt.isDark ? 'text-cyan-400' : 'text-cyan-600'}>{sPolLabel}</span>
            </label>
            <label className={cn('flex items-center gap-2 text-sm cursor-pointer', dt.mutedTextClass)}>
              <input
                type="checkbox"
                checked={showP}
                onChange={(e) => setShowP(e.target.checked)}
                className="rounded border-pink-500 text-pink-500 focus:ring-pink-500"
              />
              <span className={dt.isDark ? 'text-pink-400' : 'text-pink-600'}>{pPolLabel}</span>
            </label>
          </div>
        )}

        {/* 交互选项 */}
        <div className={cn('pt-2 border-t mt-2', dt.borderClass)}>
          <Toggle
            label={dragLabel}
            checked={enableDrag}
            onChange={setEnableDrag}
          />
        </div>

        {/* 材料预设 */}
        <div className="pt-2">
          <div className={cn('text-xs mb-2', dt.subtleTextClass)}>{presetLabel}</div>
          <div className="grid grid-cols-2 gap-1.5">
            {materials.map((m) => (
              <button
                key={m.name}
                onClick={() => { setN1(m.n1); setN2(m.n2) }}
                className={cn(
                  'px-2 py-1.5 text-xs border rounded-lg transition-all duration-150 active:scale-[0.97]',
                  dt.isDark
                    ? 'bg-slate-800/40 text-gray-400 border-slate-600/50 hover:border-cyan-400/25 hover:text-gray-300'
                    : 'bg-white/80 text-gray-500 border-gray-200 hover:border-cyan-300 hover:text-gray-700',
                )}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      </ControlPanel>

      {/* 基础难度: 简化说明 */}
      {isFoundation && (
        <WhyButton>
          <div className="space-y-2 text-sm">
            <p>{isZh ? '光照射到玻璃表面时，一部分被反射，一部分透过。' : 'When light hits a glass surface, part is reflected and part is transmitted.'}</p>
            <p>{isZh
              ? '反射光可以变成偏振光！在一个特殊角度（布儒斯特角），反射光完全变成偏振光。'
              : 'Reflected light can become polarized! At a special angle (Brewster angle), reflected light becomes fully polarized.'}</p>
            <p>{isZh
              ? '这就是为什么偏光太阳镜可以减少眩光 -- 它们阻挡了反射产生的偏振光。'
              : 'This is why polarized sunglasses reduce glare -- they block polarized light from reflections.'}</p>
          </div>
        </WhyButton>
      )}

      {/* 公式显示 - 基础难度隐藏 */}
      {!isFoundation && (
        <div className={cn(
          'rounded-xl border p-3',
          dt.isDark
            ? 'bg-gradient-to-br from-cyan-900/10 via-slate-800/30 to-blue-900/10 border-cyan-500/15'
            : 'bg-gradient-to-br from-cyan-50/60 via-white to-blue-50/60 border-cyan-200/50',
        )}>
          <div className={cn('text-[11px] font-medium mb-2', dt.mutedTextClass)}>{formulaTitle}</div>
          <div className={cn('font-mono text-xs space-y-1.5', dt.bodyClass)}>
            <p>rs = (n{'\u2081'}cos{'\u03B8\u2081'} - n{'\u2082'}cos{'\u03B8\u2082'}) / (n{'\u2081'}cos{'\u03B8\u2081'} + n{'\u2082'}cos{'\u03B8\u2082'})</p>
            <p>rp = (n{'\u2082'}cos{'\u03B8\u2081'} - n{'\u2081'}cos{'\u03B8\u2082'}) / (n{'\u2082'}cos{'\u03B8\u2081'} + n{'\u2081'}cos{'\u03B8\u2082'})</p>
            <p className={cn('pt-1.5 font-semibold', dt.isDark ? 'text-cyan-400' : 'text-cyan-600')}>
              Rs = rs{'\u00B2'}, Rp = rp{'\u00B2'}
            </p>
          </div>
        </div>
      )}

      {/* 反射率曲线 - 基础难度隐藏 */}
      {!isFoundation && (
        <ChartPanel title={curveTitle} subtitle={curveSubtitle}>
          <FresnelCurveChart n1={n1} n2={n2} currentAngle={incidentAngle} isZh={isZh} />
          <p className={cn('text-[11px] mt-2 leading-relaxed', dt.mutedTextClass)}>
            {curveNote}
          </p>
        </ChartPanel>
      )}

      {/* 研究级别: 边界条件推导和数据导出 */}
      {isResearch && (
        <>
          <ChartPanel title={isZh ? '边界条件推导' : 'Boundary Condition Derivation'}>
            <div className={cn('p-3 rounded-lg font-mono text-xs space-y-2', dt.isDark ? 'bg-slate-800/60 text-purple-300' : 'bg-gray-50 text-purple-700')}>
              <div className={cn('font-sans font-medium mb-2', dt.mutedTextClass)}>
                {isZh ? 'Maxwell方程组界面连续性条件:' : 'Maxwell equation interface continuity:'}
              </div>
              <p>E{'\u2081'}// = E{'\u2082'}//  ({isZh ? '切向电场连续' : 'tangential E continuous'})</p>
              <p>H{'\u2081'}// = H{'\u2082'}//  ({isZh ? '切向磁场连续' : 'tangential H continuous'})</p>
              <div className={cn('pt-2 mt-2 border-t text-[10px]', dt.borderClass, dt.mutedTextClass)}>
                <p>{isZh ? '对s偏振: E平行于界面，直接应用边界条件' : 's-pol: E parallel to interface, direct BC application'}</p>
                <p>{isZh ? '对p偏振: E有法向分量，需考虑介电常数不连续' : 'p-pol: E has normal component, dielectric discontinuity'}</p>
              </div>
            </div>
          </ChartPanel>

          <DataExportPanel
            title={isZh ? '菲涅尔系数数据' : 'Fresnel Coefficient Data'}
            titleZh="菲涅尔系数数据"
            data={{
              'θ_incident (°)': incidentAngle,
              'n1': n1,
              'n2': n2,
              'Rs': Rs,
              'Rp': Rp,
              'Ts': Ts,
              'Tp': Tp,
              'θ_refracted (°)': fresnel.totalReflection ? 90 : fresnel.theta2,
              'θ_Brewster (°)': brewsterAngle,
              'TIR': fresnel.totalReflection ? 'yes' : 'no',
            }}
          />
        </>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <DemoHeader
        title={titleLabel}
        subtitle={subtitleLabel}
        gradient="cyan"
        badge="Unit 2"
      />

      {/* 主体内容 - two column layout */}
      <DemoMainLayout
        visualization={visualization}
        controls={controls}
        controlsWidth="wide"
      />

      {/* 知识卡片 */}
      <InfoGrid columns={3}>
        <InfoCard title={fresnelCardTitle} color="cyan">
          <p className={cn('text-xs leading-relaxed', dt.bodyClass)}>
            {fresnelCardDesc}
          </p>
        </InfoCard>
        <InfoCard title={brewsterCardTitle} color="orange">
          <p className={cn('text-xs leading-relaxed', dt.bodyClass)}>
            {brewsterCardDesc}
          </p>
        </InfoCard>
        <InfoCard title={tirCardTitle} color="purple">
          <p className={cn('text-xs leading-relaxed', dt.bodyClass)}>
            {tirCardDesc}
          </p>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
