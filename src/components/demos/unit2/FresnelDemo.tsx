/**
 * 菲涅尔方程演示 - Unit 2 (Refactored with Unified Physics Engine)
 * 演示s偏振和p偏振的反射/透射系数随入射角的变化
 * 采用纯DOM + SVG + Framer Motion一体化设计
 *
 * Physics Engine Migration:
 * - Uses solveFresnel() from unified physics engine for all Fresnel calculations
 * - Uses brewsterAngle() and criticalAngle() for accurate angle computation
 * - No more hardcoded Fresnel equations - all physics delegated to engine
 *
 * Verification: At n1=1, n2=1.5, Brewster angle should be ~56.31°
 * At this angle, Rp should be exactly 0 (no p-polarization reflection)
 */
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard, Toggle } from '../DemoControls'
import { useTranslation } from 'react-i18next'
// Import Fresnel solver from unified physics engine
import {
  solveFresnel,
  brewsterAngle as computeBrewsterAngle,
  criticalAngle as computeCriticalAngle,
  REFRACTIVE_INDICES,
} from '@/core/physics/unified'

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

// 光强条组件
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
      gradient: 'linear-gradient(90deg, rgba(34,211,238,0.1), rgba(34,211,238,0.8), rgba(6,182,212,0.95))',
      glow: 'rgba(34,211,238,0.6)',
      text: 'text-cyan-400',
    },
    pink: {
      gradient: 'linear-gradient(90deg, rgba(244,114,182,0.1), rgba(244,114,182,0.8), rgba(236,72,153,0.95))',
      glow: 'rgba(244,114,182,0.6)',
      text: 'text-pink-400',
    },
    green: {
      gradient: 'linear-gradient(90deg, rgba(74,222,128,0.1), rgba(74,222,128,0.8), rgba(34,197,94,0.95))',
      glow: 'rgba(74,222,128,0.6)',
      text: 'text-green-400',
    },
  }

  const colorSet = colors[color]
  const percentage = Math.min(1, value / maxValue)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${colorSet.text}`}>{label}</span>
        <span className={`font-mono text-sm ${colorSet.text}`}>{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-4 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600/50 overflow-hidden relative shadow-inner">
        <motion.div
          className="absolute inset-[2px] rounded-full origin-left"
          style={{
            background: colorSet.gradient,
            boxShadow: `0 0 12px ${colorSet.glow}`,
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
}: {
  incidentAngle: number
  n1: number
  n2: number
  showS: boolean
  showP: boolean
  onAngleChange?: (angle: number) => void
  enableDrag?: boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const fresnel = fresnelEquations(incidentAngle, n1, n2)
  const rad = (incidentAngle * Math.PI) / 180
  const refractRad = (fresnel.theta2 * Math.PI) / 180

  // SVG坐标系中心点
  const cx = 300
  const cy = 180
  const rayLength = 140

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

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 360"
      className={`w-full h-auto ${enableDrag ? 'cursor-crosshair' : ''}`}
      onMouseDown={handleMouseDown}
    >
      <defs>
        {/* 渐变定义 */}
        <linearGradient id="medium1Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="medium2Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e5f3a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1e5f3a" stopOpacity="0.4" />
        </linearGradient>
        {/* 发光效果 */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 介质1（上方 - 空气/低折射率） */}
      <rect x="40" y="20" width="520" height="160" fill="url(#medium1Gradient)" rx="8" />
      <text x="80" y="50" fill="#60a5fa" fontSize="14" fontWeight="500">
        介质1: n₁ = {n1.toFixed(2)}
      </text>

      {/* 介质2（下方 - 玻璃/高折射率） */}
      <rect x="40" y="180" width="520" height="160" fill="url(#medium2Gradient)" rx="8" />
      <text x="80" y="320" fill="#4ade80" fontSize="14" fontWeight="500">
        介质2: n₂ = {n2.toFixed(2)}
      </text>

      {/* 界面 */}
      <line x1="40" y1="180" x2="560" y2="180" stroke="#64748b" strokeWidth="2" strokeDasharray="8 4" />

      {/* 法线 */}
      <line x1={cx} y1="40" x2={cx} y2="320" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      <text x={cx + 10} y="55" fill="#94a3b8" fontSize="11">法线</text>

      {/* 入射光（黄色） */}
      <motion.line
        x1={incidentStart.x}
        y1={incidentStart.y}
        x2={cx}
        y2={cy}
        stroke="#fbbf24"
        strokeWidth="4"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      {/* 入射光箭头 */}
      <motion.polygon
        points={`${cx - 8},${cy - 5} ${cx},${cy} ${cx - 8},${cy + 5}`}
        fill="#fbbf24"
        transform={`rotate(${incidentAngle + 180}, ${cx}, ${cy})`}
        animate={{ opacity: 1 }}
      />
      <text
        x={incidentStart.x - 30}
        y={incidentStart.y - 10}
        fill="#fbbf24"
        fontSize="12"
        fontWeight="500"
      >
        入射光
      </text>

      {/* Draggable light source handle */}
      {enableDrag && (
        <g>
          {/* Outer glow for drag target */}
          <motion.circle
            cx={incidentStart.x}
            cy={incidentStart.y}
            r="20"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
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
            r="10"
            fill="#fbbf24"
            stroke="#fff"
            strokeWidth="2"
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
              y={incidentStart.y - 28}
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="9"
              opacity="0.7"
            >
              拖拽调整角度
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
              filter="url(#glow)"
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
              filter="url(#glow)"
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
              filter="url(#glow)"
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
              filter="url(#glow)"
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
          filter="url(#glow)"
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
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
      )}

      {/* 反射光标签 */}
      <text x={reflectEnd.x + 20} y={reflectEnd.y - 10} fill="#94a3b8" fontSize="12">
        反射光
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
              filter="url(#glow)"
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
              filter="url(#glow)"
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
              filter="url(#glow)"
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
              filter="url(#glow)"
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
          filter="url(#glow)"
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
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
      )}

      {/* 折射光标签 */}
      {!fresnel.totalReflection && (
        <text x={refractEnd.x + 20} y={refractEnd.y + 20} fill="#94a3b8" fontSize="12">
          折射光
        </text>
      )}

      {/* 全内反射标注 */}
      {fresnel.totalReflection && (
        <text x={cx + 20} y={cy + 60} fill="#ef4444" fontSize="14" fontWeight="bold">
          全内反射
        </text>
      )}

      {/* 角度标注 - 入射角 */}
      <path
        d={`M ${cx} ${cy - 40} A 40 40 0 0 0 ${cx - 40 * Math.sin(rad)} ${cy - 40 * Math.cos(rad)}`}
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <text
        x={cx - 25 - 15 * Math.sin(rad / 2)}
        y={cy - 50}
        fill="#fbbf24"
        fontSize="13"
        fontWeight="500"
      >
        θ₁ = {incidentAngle}°
      </text>

      {/* 角度标注 - 折射角 */}
      {!fresnel.totalReflection && (
        <>
          <path
            d={`M ${cx} ${cy + 40} A 40 40 0 0 1 ${cx + 40 * Math.sin(refractRad)} ${cy + 40 * Math.cos(refractRad)}`}
            fill="none"
            stroke="#4ade80"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          <text
            x={cx + 15 + 15 * Math.sin(refractRad / 2)}
            y={cy + 60}
            fill="#4ade80"
            fontSize="13"
            fontWeight="500"
          >
            θ₂ = {fresnel.theta2.toFixed(1)}°
          </text>
        </>
      )}

      {/* 图例 */}
      <g transform="translate(450, 40)">
        <rect x="0" y="0" width="100" height="70" fill="rgba(30,41,59,0.8)" rx="6" />
        {showS && (
          <g>
            <line x1="10" y1="20" x2="40" y2="20" stroke="#22d3ee" strokeWidth="3" />
            <text x="48" y="24" fill="#22d3ee" fontSize="11">s偏振</text>
          </g>
        )}
        {showP && (
          <g>
            <line x1="10" y1="45" x2="40" y2="45" stroke="#f472b6" strokeWidth="3" />
            <text x="48" y="49" fill="#f472b6" fontSize="11">p偏振</text>
          </g>
        )}
      </g>

      {/* 布儒斯特角提示 */}
      {Math.abs(incidentAngle - brewsterAngle) < 2 && (
        <motion.text
          x={cx}
          y="15"
          textAnchor="middle"
          fill="#22d3ee"
          fontSize="14"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          接近布儒斯特角 θB = {brewsterAngle.toFixed(1)}°
        </motion.text>
      )}
    </svg>
  )
}

// 菲涅尔曲线图
function FresnelCurveChart({
  n1,
  n2,
  currentAngle,
}: {
  n1: number
  n2: number
  currentAngle: number
}) {
  // 生成曲线数据 - 使用物理引擎计算
  // Physics: All calculations delegated to unified engine's solveFresnel()
  const { rsPath, rpPath, brewsterAngle, criticalAngle } = useMemo(() => {
    const rsPoints: string[] = []
    const rpPoints: string[] = []

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

      const x = 40 + (angle / 90) * 220
      const yRs = 130 - Rs * 100
      const yRp = 130 - Rp * 100

      rsPoints.push(`${angle === 0 ? 'M' : 'L'} ${x},${yRs}`)
      rpPoints.push(`${angle === 0 ? 'M' : 'L'} ${x},${yRp}`)
    }

    return {
      rsPath: rsPoints.join(' '),
      rpPath: rpPoints.join(' '),
      brewsterAngle: brewster,
      criticalAngle: critical,
    }
  }, [n1, n2])

  const currentX = 40 + (currentAngle / 90) * 220
  const currentFresnel = fresnelEquations(currentAngle, n1, n2)
  // Use power coefficients directly from physics engine
  const currentRs = currentFresnel.Rs
  const currentRp = currentFresnel.Rp
  const currentYs = 130 - currentRs * 100
  const currentYp = 130 - currentRp * 100

  return (
    <svg viewBox="0 0 300 160" className="w-full h-auto">
      {/* 背景网格 */}
      <rect x="40" y="30" width="220" height="100" fill="#1e293b" rx="4" />

      {/* 坐标轴 */}
      <line x1="40" y1="130" x2="270" y2="130" stroke="#475569" strokeWidth="1" />
      <line x1="40" y1="30" x2="40" y2="130" stroke="#475569" strokeWidth="1" />

      {/* 网格线 */}
      <line x1="40" y1="80" x2="270" y2="80" stroke="#374151" strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1="150" y1="30" x2="150" y2="130" stroke="#374151" strokeWidth="0.5" strokeDasharray="3 3" />

      {/* X轴刻度 */}
      {[0, 45, 90].map((angle) => {
        const x = 40 + (angle / 90) * 220
        return (
          <g key={angle}>
            <line x1={x} y1="130" x2={x} y2="135" stroke="#94a3b8" strokeWidth="1" />
            <text x={x} y="147" textAnchor="middle" fill="#94a3b8" fontSize="10">{angle}°</text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      {[0, 0.5, 1].map((val, i) => {
        const y = 130 - val * 100
        return (
          <g key={i}>
            <line x1="35" y1={y} x2="40" y2={y} stroke="#94a3b8" strokeWidth="1" />
            <text x="30" y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10">{val}</text>
          </g>
        )
      })}

      {/* 布儒斯特角标记 */}
      {n1 < n2 && (
        <>
          <line
            x1={40 + (brewsterAngle / 90) * 220}
            y1="30"
            x2={40 + (brewsterAngle / 90) * 220}
            y2="130"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <text
            x={40 + (brewsterAngle / 90) * 220}
            y="25"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
          >
            θB
          </text>
        </>
      )}

      {/* 临界角标记 */}
      {n1 > n2 && criticalAngle < 90 && (
        <>
          <line
            x1={40 + (criticalAngle / 90) * 220}
            y1="30"
            x2={40 + (criticalAngle / 90) * 220}
            y2="130"
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <text
            x={40 + (criticalAngle / 90) * 220}
            y="25"
            textAnchor="middle"
            fill="#ef4444"
            fontSize="9"
          >
            θc
          </text>
        </>
      )}

      {/* Rs曲线 */}
      <path d={rsPath} fill="none" stroke="#22d3ee" strokeWidth="2.5" />

      {/* Rp曲线 */}
      <path d={rpPath} fill="none" stroke="#f472b6" strokeWidth="2.5" />

      {/* 当前点标记 */}
      <motion.circle
        cx={currentX}
        cy={currentYs}
        r="5"
        fill="#22d3ee"
        animate={{ cx: currentX, cy: currentYs }}
        transition={{ duration: 0.2 }}
      />
      <motion.circle
        cx={currentX}
        cy={currentYp}
        r="5"
        fill="#f472b6"
        animate={{ cx: currentX, cy: currentYp }}
        transition={{ duration: 0.2 }}
      />

      {/* 轴标签 */}
      <text x="155" y="158" textAnchor="middle" fill="#94a3b8" fontSize="11">θ (度)</text>
      <text x="15" y="85" fill="#94a3b8" fontSize="11" transform="rotate(-90 15 85)">R</text>

      {/* 图例 */}
      <g transform="translate(200, 40)">
        <line x1="0" y1="0" x2="20" y2="0" stroke="#22d3ee" strokeWidth="2" />
        <text x="25" y="4" fill="#22d3ee" fontSize="10">Rs</text>
        <line x1="0" y1="15" x2="20" y2="15" stroke="#f472b6" strokeWidth="2" />
        <text x="25" y="19" fill="#f472b6" fontSize="10">Rp</text>
      </g>
    </svg>
  )
}

// 主演示组件
export function FresnelDemo() {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

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
    { name: isZh ? '空气→玻璃' : 'Air→Glass', nameZh: '空气→玻璃', n1: REFRACTIVE_INDICES.air, n2: REFRACTIVE_INDICES.glass },
    { name: isZh ? '空气→水' : 'Air→Water', nameZh: '空气→水', n1: REFRACTIVE_INDICES.air, n2: REFRACTIVE_INDICES.water },
    { name: isZh ? '玻璃→空气' : 'Glass→Air', nameZh: '玻璃→空气', n1: REFRACTIVE_INDICES.glass, n2: REFRACTIVE_INDICES.air },
    { name: isZh ? '水→空气' : 'Water→Air', nameZh: '水→空气', n1: REFRACTIVE_INDICES.water, n2: REFRACTIVE_INDICES.air },
    { name: isZh ? '空气→钻石' : 'Air→Diamond', nameZh: '空气→钻石', n1: REFRACTIVE_INDICES.air, n2: REFRACTIVE_INDICES.diamond },
  ]

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
          菲涅尔方程交互演示
        </h2>
        <p className="text-gray-400 mt-1">
          探索s偏振和p偏振光在界面反射/折射时的行为差异
        </p>
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="space-y-4">
          {/* 光线图 */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-cyan-950/90 border border-cyan-500/30 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <FresnelDiagram
              incidentAngle={incidentAngle}
              n1={n1}
              n2={n2}
              showS={showS}
              showP={showP}
              enableDrag={enableDrag}
              onAngleChange={setIncidentAngle}
            />
          </div>

          {/* 反射率/透射率条 */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-600/30 p-4 space-y-3">
            <h4 className="text-sm font-semibold text-white mb-3">反射率与透射率</h4>
            {showS && (
              <>
                <IntensityBar label="Rs (s偏振反射率)" value={Rs} color="cyan" />
                <IntensityBar label="Ts (s偏振透射率)" value={Ts} color="green" />
              </>
            )}
            {showP && (
              <>
                <IntensityBar label="Rp (p偏振反射率)" value={Rp} color="pink" />
                <IntensityBar label="Tp (p偏振透射率)" value={Tp} color="green" />
              </>
            )}
          </div>
        </div>

        {/* 右侧：控制与学习 */}
        <div className="space-y-4">
          {/* 参数控制 */}
          <ControlPanel title="参数控制">
            <SliderControl
              label="入射角 θ₁"
              value={incidentAngle}
              min={0}
              max={89}
              step={1}
              unit="°"
              onChange={setIncidentAngle}
              color="orange"
            />
            <SliderControl
              label="介质1折射率 n₁"
              value={n1}
              min={1.0}
              max={2.5}
              step={0.05}
              onChange={setN1}
              formatValue={(v) => v.toFixed(2)}
              color="blue"
            />
            <SliderControl
              label="介质2折射率 n₂"
              value={n2}
              min={1.0}
              max={2.5}
              step={0.05}
              onChange={setN2}
              formatValue={(v) => v.toFixed(2)}
              color="green"
            />

            {/* 偏振选择 */}
            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showS}
                  onChange={(e) => setShowS(e.target.checked)}
                  className="rounded border-cyan-500 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-cyan-400">s偏振</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showP}
                  onChange={(e) => setShowP(e.target.checked)}
                  className="rounded border-pink-500 text-pink-500 focus:ring-pink-500"
                />
                <span className="text-pink-400">p偏振</span>
              </label>
            </div>

            {/* 交互选项 */}
            <div className="pt-2 border-t border-slate-700/50 mt-2">
              <Toggle
                label={isZh ? '拖拽调整入射角' : 'Drag to Adjust Angle'}
                checked={enableDrag}
                onChange={setEnableDrag}
              />
            </div>

            {/* 材料预设 */}
            <div className="pt-2">
              <div className="text-xs text-gray-500 mb-2">快速预设</div>
              <div className="grid grid-cols-2 gap-2">
                {materials.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => { setN1(m.n1); setN2(m.n2) }}
                    className="px-2 py-1.5 text-xs bg-slate-700/50 text-gray-300 rounded hover:bg-slate-600 transition-colors"
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          </ControlPanel>

          {/* 计算结果 */}
          <ControlPanel title="计算结果">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="text-gray-400">
                折射角 θ₂ = <span className="text-green-400 font-mono">
                  {fresnel.totalReflection ? '全反射' : `${fresnel.theta2.toFixed(1)}°`}
                </span>
              </div>
              <div className="text-gray-400">
                布儒斯特角 = <span className="text-yellow-400 font-mono">{brewsterAngle.toFixed(1)}°</span>
              </div>
              {criticalAngle && (
                <div className="col-span-2 text-gray-400">
                  临界角 = <span className="text-red-400 font-mono">{criticalAngle.toFixed(1)}°</span>
                  <span className="text-gray-500 text-xs ml-2">(全内反射)</span>
                </div>
              )}
            </div>

            {/* 公式显示 */}
            <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
              <div className="text-xs text-gray-500 mb-2">菲涅尔方程</div>
              <div className="font-mono text-xs text-gray-300 space-y-1">
                <p>rs = (n₁cosθ₁ - n₂cosθ₂) / (n₁cosθ₁ + n₂cosθ₂)</p>
                <p>rp = (n₂cosθ₁ - n₁cosθ₂) / (n₂cosθ₁ + n₁cosθ₂)</p>
                <p className="text-cyan-400 pt-1">Rs = rs², Rp = rp²</p>
              </div>
            </div>
          </ControlPanel>

          {/* 反射率曲线 */}
          <ControlPanel title="反射率曲线 R(θ)">
            <FresnelCurveChart n1={n1} n2={n2} currentAngle={incidentAngle} />
            <p className="text-xs text-gray-400 mt-2">
              红点表示当前入射角对应的反射率。在布儒斯特角处，p偏振反射率为零。
            </p>
          </ControlPanel>
        </div>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="菲涅尔方程" color="cyan">
          <p className="text-xs text-gray-300">
            描述电磁波在两种介质界面反射和透射的振幅比。s偏振（垂直于入射面）和p偏振（平行于入射面）有不同的反射特性。
          </p>
        </InfoCard>
        <InfoCard title="布儒斯特角" color="orange">
          <p className="text-xs text-gray-300">
            当 θ₁ + θ₂ = 90° 时，p偏振反射光消失。此时 tan(θB) = n₂/n₁。应用于偏振镜片和减反射涂层。
          </p>
        </InfoCard>
        <InfoCard title="全内反射" color="purple">
          <p className="text-xs text-gray-300">
            当光从高折射率介质进入低折射率介质，且入射角大于临界角时发生。应用于光纤通信和全内反射棱镜。
          </p>
        </InfoCard>
      </div>
    </div>
  )
}
