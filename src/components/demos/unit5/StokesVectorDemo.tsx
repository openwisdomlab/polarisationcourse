/**
 * 斯托克斯矢量演示 - Unit 5
 * 用四个参数 [S₀, S₁, S₂, S₃] 完整描述光的偏振状态
 * 重新设计：使用 DemoLayout 统一布局组件，改进 SVG 可视化
 *
 * 支持难度分层:
 * - foundation: 简化显示，隐藏复杂公式，聚焦直观理解
 * - application: 完整显示斯托克斯参数和可视化
 * - research: 添加Mueller矩阵计算、高级分析
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SliderControl, ControlPanel, InfoCard, ValueDisplay } from '../DemoControls'
import { DemoHeader, VisualizationPanel, InfoGrid, ChartPanel, StatCard } from '../DemoLayout'
import { useDemoTheme } from '../demoThemeColors'

// 难度级别类型
type DifficultyLevel = 'foundation' | 'application' | 'research'

// 组件属性接口
interface StokesVectorDemoProps {
  difficultyLevel?: DifficultyLevel
}

// 斯托克斯矢量类型
interface StokesVector {
  S0: number // 总强度
  S1: number // 水平/垂直偏振分量差
  S2: number // +45°/-45°偏振分量差
  S3: number // 右旋/左旋圆偏振分量差
}

// 从偏振参数计算斯托克斯矢量
function calculateStokes(
  intensity: number,
  polarizationAngle: number,
  ellipticity: number,
  dop: number
): StokesVector {
  const psi = (polarizationAngle * Math.PI) / 180
  const chi = Math.atan(ellipticity)

  return {
    S0: intensity,
    S1: intensity * dop * Math.cos(2 * chi) * Math.cos(2 * psi),
    S2: intensity * dop * Math.cos(2 * chi) * Math.sin(2 * psi),
    S3: intensity * dop * Math.sin(2 * chi),
  }
}

// 从斯托克斯矢量计算偏振参数
function stokesToParams(stokes: StokesVector, t: (key: string) => string): {
  dop: number
  angle: number
  ellipticity: number
  type: string
} {
  const { S0, S1, S2, S3 } = stokes

  const dop = Math.sqrt(S1 * S1 + S2 * S2 + S3 * S3) / (S0 + 0.001)
  const angle = (0.5 * Math.atan2(S2, S1) * 180) / Math.PI
  const chi = 0.5 * Math.asin(S3 / (S0 * dop + 0.001))
  const ellipticity = Math.tan(chi)

  let type = t('demos.stokes.types.partial')
  if (dop > 0.99) {
    if (Math.abs(ellipticity) < 0.01) type = t('demos.stokes.types.linear')
    else if (Math.abs(ellipticity) > 0.99) type = S3 > 0 ? t('demos.stokes.types.rightCircular') : t('demos.stokes.types.leftCircular')
    else type = t('demos.stokes.types.elliptical')
  } else if (dop < 0.01) {
    type = t('demos.stokes.types.natural')
  }

  return { dop, angle, ellipticity, type }
}

// 庞加莱球可视化（2D投影）
function PoincareSphereView({ stokes, t }: { stokes: StokesVector; t: (key: string) => string }) {
  const dt = useDemoTheme()
  const { S0, S1, S2, S3 } = stokes
  const dop = Math.sqrt(S1 * S1 + S2 * S2 + S3 * S3) / (S0 + 0.001)

  // 归一化坐标
  const x = dop > 0.01 ? S1 / (S0 * dop + 0.001) : 0
  const y = dop > 0.01 ? S2 / (S0 * dop + 0.001) : 0
  const z = dop > 0.01 ? S3 / (S0 * dop + 0.001) : 0

  const width = 300
  const height = 300
  const centerX = width / 2
  const centerY = height / 2
  const radius = 105

  const textColor = dt.textSecondary
  const gridColor = dt.isDark ? '#1e293b' : '#e2e8f0'
  const axisGridColor = dt.isDark ? '#334155' : '#cbd5e1'
  const bgGrad1 = dt.isDark ? '#0c1425' : '#f0f4f8'
  const bgGrad2 = dt.isDark ? '#111d35' : '#e8eef4'

  // 关键点位置
  const keyPoints = [
    { label: 'H', x: radius, y: 0, color: '#ef4444' },
    { label: 'V', x: -radius, y: 0, color: '#ef4444' },
    { label: '+45', x: 0, y: -radius, color: '#22c55e' },
    { label: '-45', x: 0, y: radius, color: '#22c55e' },
  ]

  // 当前点位置（俯视图：S1-S2平面）
  const pointX = centerX + x * radius
  const pointY = centerY - y * radius // SVG y轴向下

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        {/* 背景渐变 */}
        <radialGradient id="sphere-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={bgGrad2} />
          <stop offset="100%" stopColor={bgGrad1} />
        </radialGradient>
        {/* 球面渐变 */}
        <radialGradient id="sphere-fill" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={dt.isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)'} />
          <stop offset="100%" stopColor={dt.isDark ? 'rgba(30,41,59,0.02)' : 'rgba(241,245,249,0.02)'} />
        </radialGradient>
        {/* 点光晕 */}
        <radialGradient id="point-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(251,191,36,0.6)" />
          <stop offset="50%" stopColor="rgba(251,191,36,0.15)" />
          <stop offset="100%" stopColor="rgba(251,191,36,0)" />
        </radialGradient>
        {/* 柔光滤镜 */}
        <filter id="stokes-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="stokes-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect x={0} y={0} width={width} height={height} fill="url(#sphere-bg)" rx={12} />

      {/* 标题 */}
      <text x={centerX} y={24} textAnchor="middle" fill={textColor} fontSize={11} fontWeight="500" letterSpacing="0.05em">
        {t('demos.stokes.ui.poincareSphere')}
      </text>

      {/* 球的投影 - 赤道圆（带渐变填充） */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="url(#sphere-fill)"
        stroke={axisGridColor}
        strokeWidth={1.5}
      />

      {/* 内部同心圆 */}
      {[0.25, 0.5, 0.75].map((r) => (
        <circle
          key={r}
          cx={centerX}
          cy={centerY}
          r={radius * r}
          fill="none"
          stroke={gridColor}
          strokeWidth={0.8}
          strokeDasharray="3,5"
          opacity={0.7}
        />
      ))}

      {/* 对角线参考线 */}
      <line
        x1={centerX - radius * 0.707}
        y1={centerY - radius * 0.707}
        x2={centerX + radius * 0.707}
        y2={centerY + radius * 0.707}
        stroke={gridColor}
        strokeWidth={0.5}
        strokeDasharray="2,4"
        opacity={0.5}
      />
      <line
        x1={centerX + radius * 0.707}
        y1={centerY - radius * 0.707}
        x2={centerX - radius * 0.707}
        y2={centerY + radius * 0.707}
        stroke={gridColor}
        strokeWidth={0.5}
        strokeDasharray="2,4"
        opacity={0.5}
      />

      {/* 坐标轴 */}
      <line
        x1={centerX - radius - 18}
        y1={centerY}
        x2={centerX + radius + 18}
        y2={centerY}
        stroke="#ef4444"
        strokeWidth={1.2}
        opacity={0.8}
      />
      <line
        x1={centerX}
        y1={centerY - radius - 18}
        x2={centerX}
        y2={centerY + radius + 18}
        stroke="#22c55e"
        strokeWidth={1.2}
        opacity={0.8}
      />

      {/* 轴标签 */}
      <text x={centerX + radius + 24} y={centerY + 4} fill="#ef4444" fontSize={13} fontWeight="bold" fontFamily="monospace">
        S&#x2081;
      </text>
      <text x={centerX + 5} y={centerY - radius - 22} fill="#22c55e" fontSize={13} fontWeight="bold" fontFamily="monospace">
        S&#x2082;
      </text>

      {/* 关键点 */}
      {keyPoints.map((point, i) => (
        <g key={i}>
          <circle
            cx={centerX + point.x}
            cy={centerY - point.y}
            r={4}
            fill={point.color}
            opacity={0.9}
          />
          <circle
            cx={centerX + point.x}
            cy={centerY - point.y}
            r={7}
            fill="none"
            stroke={point.color}
            strokeWidth={1}
            opacity={0.3}
          />
          <text
            x={centerX + point.x + (point.x > 0 ? 14 : point.x < 0 ? -14 : 0)}
            y={centerY - point.y + (point.y > 0 ? -10 : point.y < 0 ? 14 : 4)}
            textAnchor={point.x > 0 ? 'start' : point.x < 0 ? 'end' : 'middle'}
            fill={textColor}
            fontSize={10}
            fontWeight="500"
          >
            {point.label}
          </text>
        </g>
      ))}

      {/* 当前偏振状态点 */}
      {dop > 0.01 && (
        <>
          {/* 光晕 */}
          <motion.circle
            cx={pointX}
            cy={pointY}
            r={22}
            fill="url(#point-glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          {/* 从原点到点的连线 */}
          <motion.line
            x1={centerX}
            y1={centerY}
            x2={pointX}
            y2={pointY}
            stroke="#fbbf24"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.8}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          {/* 外圈脉冲 */}
          <motion.circle
            cx={pointX}
            cy={pointY}
            r={12}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={1.5}
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* 点 */}
          <motion.circle
            cx={pointX}
            cy={pointY}
            r={6}
            fill="#fbbf24"
            stroke="#fef3c7"
            strokeWidth={1.5}
            filter="url(#stokes-glow-soft)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          />
        </>
      )}

      {/* S3指示（高度）- 右侧竖直轴 */}
      <g transform={`translate(${width - 32}, ${centerY})`}>
        <line x1={0} y1={-55} x2={0} y2={55} stroke="#3b82f6" strokeWidth={1.5} opacity={0.7} />
        {/* 刻度线 */}
        {[-1, -0.5, 0, 0.5, 1].map(v => (
          <line key={v} x1={-3} y1={-v * 45} x2={3} y2={-v * 45} stroke="#3b82f6" strokeWidth={1} opacity={0.5} />
        ))}
        <text x={5} y={-58} fill="#3b82f6" fontSize={13} fontWeight="bold" fontFamily="monospace">S&#x2083;</text>
        <text x={8} y={-42} fill={textColor} fontSize={8} opacity={0.8}>RCP</text>
        <text x={8} y={50} fill={textColor} fontSize={8} opacity={0.8}>LCP</text>
        {/* S3值指示 */}
        <motion.circle
          cx={0}
          cy={-z * 45}
          r={5}
          fill="#3b82f6"
          stroke="#93c5fd"
          strokeWidth={1}
          filter="url(#stokes-glow-soft)"
          animate={{ cy: -z * 45 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </g>
    </svg>
  )
}

// 偏振椭圆可视化
function PolarizationEllipseView({ stokes, t }: { stokes: StokesVector; t: (key: string) => string }) {
  const dt = useDemoTheme()
  const params = stokesToParams(stokes, t)
  const width = 300
  const height = 300
  const centerX = width / 2
  const centerY = height / 2
  const maxRadius = 80

  const textColor = dt.textSecondary
  const gridColor = dt.isDark ? '#1e293b' : '#e2e8f0'
  const axisColor = dt.isDark ? '#334155' : '#cbd5e1'
  const bgGrad1 = dt.isDark ? '#0c1425' : '#f0f4f8'
  const bgGrad2 = dt.isDark ? '#111d35' : '#e8eef4'

  const isRightHanded = stokes.S3 > 0
  const ellipseColor = isRightHanded ? '#22d3ee' : '#f472b6'
  const ellipseFill = isRightHanded ? 'rgba(34,211,238,0.08)' : 'rgba(244,114,182,0.08)'

  // 生成椭圆路径
  const ellipsePath = useMemo(() => {
    const a = maxRadius
    const b = Math.abs(params.ellipticity) * maxRadius || 1
    const angle = (params.angle * Math.PI) / 180

    let d = ''
    const segments = 64
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * 2 * Math.PI
      const ex = a * Math.cos(t)
      const ey = b * Math.sin(t)
      const x = centerX + ex * Math.cos(angle) - ey * Math.sin(angle)
      const y = centerY - (ex * Math.sin(angle) + ey * Math.cos(angle))

      if (i === 0) {
        d += `M ${x} ${y}`
      } else {
        d += ` L ${x} ${y}`
      }
    }
    d += ' Z'
    return d
  }, [params.angle, params.ellipticity, centerX, centerY, maxRadius])

  // 长轴端点
  const axisAngle = (params.angle * Math.PI) / 180
  const axisEndX = centerX + maxRadius * 1.15 * Math.cos(axisAngle)
  const axisEndY = centerY - maxRadius * 1.15 * Math.sin(axisAngle)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <radialGradient id="ellipse-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={bgGrad2} />
          <stop offset="100%" stopColor={bgGrad1} />
        </radialGradient>
        <radialGradient id="ellipse-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isRightHanded ? 'rgba(34,211,238,0.12)' : 'rgba(244,114,182,0.12)'} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <marker
          id="stokes-arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill={ellipseColor}
          />
        </marker>
      </defs>

      {/* 背景 */}
      <rect x={0} y={0} width={width} height={height} fill="url(#ellipse-bg)" rx={12} />

      {/* 背景光晕 */}
      <circle cx={centerX} cy={centerY} r={maxRadius * 1.2} fill="url(#ellipse-glow)" />

      {/* 参考圆 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius}
        fill="none"
        stroke={gridColor}
        strokeWidth={0.8}
        strokeDasharray="4,6"
        opacity={0.6}
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius * 0.5}
        fill="none"
        stroke={gridColor}
        strokeWidth={0.5}
        strokeDasharray="3,5"
        opacity={0.4}
      />

      {/* 参考轴 */}
      <line x1={20} y1={centerY} x2={width - 20} y2={centerY} stroke={axisColor} strokeWidth={0.8} opacity={0.6} />
      <line x1={centerX} y1={20} x2={centerX} y2={height - 20} stroke={axisColor} strokeWidth={0.8} opacity={0.6} />

      {/* 轴端标签 */}
      <text x={width - 16} y={centerY - 6} fill={textColor} fontSize={9} textAnchor="end" opacity={0.6}>x</text>
      <text x={centerX + 8} y={26} fill={textColor} fontSize={9} opacity={0.6}>y</text>

      {/* 偏振椭圆 */}
      <motion.path
        d={ellipsePath}
        fill={ellipseFill}
        stroke={ellipseColor}
        strokeWidth={2.5}
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* 长轴方向 */}
      <motion.line
        x1={centerX - (axisEndX - centerX)}
        y1={centerY + (centerY - axisEndY)}
        x2={axisEndX}
        y2={axisEndY}
        stroke="#fbbf24"
        strokeWidth={1.5}
        strokeDasharray="5,4"
        opacity={0.7}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      />

      {/* 角度标注弧 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}>
        <path
          d={`M ${centerX + 24} ${centerY} A 24 24 0 0 ${params.angle >= 0 ? 0 : 1} ${
            centerX + 24 * Math.cos(axisAngle)
          } ${centerY - 24 * Math.sin(axisAngle)}`}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={1.5}
          opacity={0.8}
        />
        <text
          x={centerX + 34 * Math.cos(axisAngle / 2)}
          y={centerY - 34 * Math.sin(axisAngle / 2)}
          fill="#fbbf24"
          fontSize={11}
          fontWeight="600"
          textAnchor="middle"
        >
          {params.angle.toFixed(0)}
        </text>
      </motion.g>

      {/* 旋转方向指示箭头 */}
      {Math.abs(params.ellipticity) > 0.05 && (
        <g transform={`translate(${centerX}, ${centerY})`}>
          <motion.path
            d={isRightHanded
              ? 'M 30 0 A 30 30 0 0 1 0 -30'
              : 'M 30 0 A 30 30 0 0 0 0 30'
            }
            fill="none"
            stroke={ellipseColor}
            strokeWidth={1.5}
            markerEnd="url(#stokes-arrowhead)"
            opacity={0.8}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />
        </g>
      )}

      {/* 底部标签 */}
      <text x={centerX} y={height - 10} textAnchor="middle" fill={textColor} fontSize={10} fontWeight="500">
        {t('demos.stokes.ui.polarizationEllipse')} {Math.abs(params.ellipticity) > 0.05 ? (isRightHanded ? t('demos.stokes.ui.rightHanded') : t('demos.stokes.ui.leftHanded')) : t('demos.stokes.ui.linearPol')}
      </text>
    </svg>
  )
}

// 斯托克斯矢量柱状图可视化
function StokesBarChart({ stokes, t }: { stokes: StokesVector; t: (key: string) => string }) {
  const dt = useDemoTheme()
  const { S0, S1, S2, S3 } = stokes

  const components = [
    { label: 'S\u2080', value: S0, color: dt.isDark ? '#e2e8f0' : '#334155', desc: t('demos.stokes.ui.totalIntensity') },
    { label: 'S\u2081', value: S1, color: '#ef4444', desc: t('demos.stokes.ui.hvDiff') },
    { label: 'S\u2082', value: S2, color: '#22c55e', desc: t('demos.stokes.ui.pm45Diff') },
    { label: 'S\u2083', value: S3, color: '#3b82f6', desc: t('demos.stokes.ui.rlDiff') },
  ]

  return (
    <div className="space-y-2.5">
      {/* 矢量括号表示 */}
      <div className="flex items-center justify-center gap-2">
        <span className={cn(
          'text-2xl font-extralight select-none',
          dt.isDark ? 'text-slate-600' : 'text-slate-300'
        )}>[</span>
        <div className="space-y-2">
          {components.map((comp, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2.5"
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              <span className="w-6 font-mono text-xs font-semibold" style={{ color: comp.color }}>
                {comp.label}
              </span>
              <div className={cn(
                'w-20 h-2 rounded-full overflow-hidden',
                dt.isDark ? 'bg-slate-700/60' : 'bg-gray-200/80'
              )}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: comp.color }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(Math.abs(comp.value) / (Math.abs(S0) + 0.001) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                />
              </div>
              <span className={cn(
                'w-14 text-right font-mono text-xs font-semibold tabular-nums',
                dt.isDark ? 'text-cyan-400' : 'text-cyan-600'
              )}>
                {comp.value >= 0 ? '+' : ''}{comp.value.toFixed(2)}
              </span>
              <span className={cn(
                'text-[10px] hidden sm:inline',
                dt.mutedTextClass
              )}>{comp.desc}</span>
            </motion.div>
          ))}
        </div>
        <span className={cn(
          'text-2xl font-extralight select-none',
          dt.isDark ? 'text-slate-600' : 'text-slate-300'
        )}>]</span>
      </div>
    </div>
  )
}

// 预设偏振状态 - 使用 i18n keys
const PRESET_KEYS = [
  { i18nKey: 'demos.stokes.presets.horizontalH', angle: 0, ellipticity: 0, dop: 1, color: '#ef4444' },
  { i18nKey: 'demos.stokes.presets.verticalV', angle: 90, ellipticity: 0, dop: 1, color: '#ef4444' },
  { i18nKey: 'demos.stokes.presets.plus45', angle: 45, ellipticity: 0, dop: 1, color: '#22c55e' },
  { i18nKey: 'demos.stokes.presets.minus45', angle: -45, ellipticity: 0, dop: 1, color: '#22c55e' },
  { i18nKey: 'demos.stokes.presets.rightCircular', angle: 0, ellipticity: 1, dop: 1, color: '#3b82f6' },
  { i18nKey: 'demos.stokes.presets.leftCircular', angle: 0, ellipticity: -1, dop: 1, color: '#f472b6' },
  { i18nKey: 'demos.stokes.presets.rightElliptical', angle: 30, ellipticity: 0.5, dop: 1, color: '#22d3ee' },
  { i18nKey: 'demos.stokes.presets.naturalLight', angle: 0, ellipticity: 0, dop: 0, color: '#94a3b8' },
]

// Mueller矩阵显示组件 (研究级别)
function MuellerMatrixDisplay({ stokes }: { stokes: StokesVector }) {
  const dt = useDemoTheme()
  const { S0, S1, S2, S3 } = stokes
  const dop = Math.sqrt(S1 * S1 + S2 * S2 + S3 * S3) / (S0 + 0.001)

  // 示例：计算通过线性偏振片（水平方向）后的斯托克斯矢量
  // Mueller矩阵 for 水平偏振片
  const M_H = [
    [0.5, 0.5, 0, 0],
    [0.5, 0.5, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]

  // S' = M · S
  const S_out = [
    M_H[0][0] * S0 + M_H[0][1] * S1 + M_H[0][2] * S2 + M_H[0][3] * S3,
    M_H[1][0] * S0 + M_H[1][1] * S1 + M_H[1][2] * S2 + M_H[1][3] * S3,
    M_H[2][0] * S0 + M_H[2][1] * S1 + M_H[2][2] * S2 + M_H[2][3] * S3,
    M_H[3][0] * S0 + M_H[3][1] * S1 + M_H[3][2] * S2 + M_H[3][3] * S3,
  ]

  return (
    <ChartPanel title="Mueller Matrix Calculation">
      <div className="space-y-2.5">
        {/* 输入矢量 */}
        <div className={cn('px-3 py-2 rounded-lg text-xs', dt.isDark ? 'bg-slate-800/60' : 'bg-gray-50')}>
          <span className={dt.mutedTextClass}>Input S = </span>
          <span className={cn('font-mono font-semibold', dt.isDark ? 'text-cyan-400' : 'text-cyan-600')}>
            [{S0.toFixed(2)}, {S1.toFixed(2)}, {S2.toFixed(2)}, {S3.toFixed(2)}]
          </span>
        </div>

        {/* Mueller矩阵 */}
        <div className={cn('px-3 py-2 rounded-lg text-xs', dt.isDark ? 'bg-slate-800/60' : 'bg-gray-50')}>
          <div className={cn('mb-1.5 font-medium', dt.mutedTextClass)}>Horizontal Polarizer M_H:</div>
          <div className="font-mono text-[11px] leading-relaxed tracking-tight">
            {M_H.map((row, i) => (
              <div key={i} className={dt.isDark ? 'text-purple-300' : 'text-purple-600'}>
                [{row.map(v => v.toFixed(1)).join(', ')}]
              </div>
            ))}
          </div>
        </div>

        {/* 输出矢量 */}
        <div className={cn('px-3 py-2 rounded-lg text-xs', dt.isDark ? 'bg-slate-800/60' : 'bg-gray-50')}>
          <span className={dt.mutedTextClass}>Output S' = M S = </span>
          <span className={cn('font-mono font-semibold', dt.isDark ? 'text-orange-400' : 'text-orange-600')}>
            [{S_out.map(v => v.toFixed(2)).join(', ')}]
          </span>
        </div>

        {/* 透射率 */}
        <div className={cn('text-xs px-1 flex items-center gap-2', dt.mutedTextClass)}>
          <span>Transmittance:</span>
          <span className={cn('font-mono font-bold', dt.isDark ? 'text-emerald-400' : 'text-emerald-600')}>
            {((S_out[0] / S0) * 100).toFixed(1)}%
          </span>
          {dop > 0.99 && Math.abs(S1 / S0) > 0.5 && (
            <span className={cn('text-[10px]', dt.isDark ? 'text-emerald-400/70' : 'text-emerald-600/70')}>
              (polarization aligned)
            </span>
          )}
        </div>
      </div>
    </ChartPanel>
  )
}

// 主演示组件
export function StokesVectorDemo({ difficultyLevel = 'application' }: StokesVectorDemoProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const dt = useDemoTheme()
  const [intensity, setIntensity] = useState(1)
  const [polarizationAngle, setPolarizationAngle] = useState(0)
  const [ellipticity, setEllipticity] = useState(0)
  const [dop, setDop] = useState(1)

  // 判断难度级别
  const isFoundation = difficultyLevel === 'foundation'
  const isResearch = difficultyLevel === 'research'

  // 计算斯托克斯矢量
  const stokes = calculateStokes(intensity, polarizationAngle, ellipticity, dop)
  const params = stokesToParams(stokes, t)

  // 应用预设
  const applyPreset = (preset: typeof PRESET_KEYS[0]) => {
    setPolarizationAngle(preset.angle)
    setEllipticity(preset.ellipticity)
    setDop(preset.dop)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 标题区 */}
      <DemoHeader
        title={t('demos.stokes.demoTitle')}
        subtitle={t('demos.stokes.demoSubtitle')}
        gradient="cyan"
        badge="Stokes"
      />

      {/* 主内容区：两列布局 */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* 左侧：可视化 */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* 庞加莱球和偏振椭圆 - 双面板 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <VisualizationPanel variant="indigo" noPadding className="overflow-hidden">
              <PoincareSphereView stokes={stokes} t={t} />
            </VisualizationPanel>
            <VisualizationPanel variant="indigo" noPadding className="overflow-hidden">
              <PolarizationEllipseView stokes={stokes} t={t} />
            </VisualizationPanel>
          </div>

          {/* 斯托克斯矢量柱状图 */}
          <ChartPanel title={t('demos.stokes.ui.stokesVector')}>
            <StokesBarChart stokes={stokes} t={t} />
          </ChartPanel>

          {/* 关键数值统计卡片 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label={t('demos.stokes.ui.polarizationType')}
              value={params.type}
              color="cyan"
            />
            <StatCard
              label={t('demos.stokes.ui.dop')}
              value={`${(params.dop * 100).toFixed(0)}%`}
              color="yellow"
            />
            {!isFoundation && (
              <>
                <StatCard
                  label={t('demos.stokes.ui.azimuth')}
                  value={params.angle.toFixed(1)}
                  unit="\u00B0"
                  color="orange"
                />
                <StatCard
                  label={t('demos.stokes.ui.handedness')}
                  value={
                    Math.abs(params.ellipticity) > 0.01
                      ? (params.ellipticity > 0 ? t('demos.stokes.ui.rightHandedR') : t('demos.stokes.ui.leftHandedL'))
                      : t('demos.stokes.types.linear')
                  }
                  color={params.ellipticity > 0 ? 'cyan' : params.ellipticity < 0 ? 'pink' : 'orange'}
                />
              </>
            )}
          </div>
        </div>

        {/* 右侧：控制面板 */}
        <div className="w-full lg:w-80 space-y-4">
          {/* 参数控件 */}
          <ControlPanel title={t('demos.stokes.ui.polarizationParams')}>
            {/* 基础级别简化控件 */}
            {isFoundation ? (
              <>
                <SliderControl
                  label="偏振角度"
                  value={polarizationAngle}
                  min={-90}
                  max={90}
                  step={15}
                  unit="°"
                  onChange={setPolarizationAngle}
                  color="orange"
                />
                <SliderControl
                  label="椭圆度 (圆/线)"
                  value={ellipticity}
                  min={-1}
                  max={1}
                  step={0.25}
                  onChange={setEllipticity}
                  color="cyan"
                />
              </>
            ) : (
              <>
                <SliderControl
                  label={t('demos.stokes.ui.lightIntensity')}
                  value={intensity}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onChange={setIntensity}
                  color="cyan"
                />
                <SliderControl
                  label={t('demos.stokes.ui.polarizationAngle')}
                  value={polarizationAngle}
                  min={-90}
                  max={90}
                  step={5}
                  unit="°"
                  onChange={setPolarizationAngle}
                  color="orange"
                />
                <SliderControl
                  label={t('demos.stokes.ui.ellipticity')}
                  value={ellipticity}
                  min={-1}
                  max={1}
                  step={0.1}
                  onChange={setEllipticity}
                  color="cyan"
                />
                <SliderControl
                  label={t('demos.stokes.ui.dop')}
                  value={dop}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={setDop}
                  color="green"
                />
              </>
            )}
          </ControlPanel>

          {/* 预设状态 */}
          <ControlPanel title={t('demos.stokes.ui.presetStates')}>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_KEYS.map((preset) => (
                <button
                  key={preset.i18nKey}
                  onClick={() => applyPreset(preset)}
                  className={cn(
                    'px-2.5 py-2 text-[11px] rounded-lg flex items-center gap-2 transition-all duration-200',
                    'border',
                    theme === 'dark'
                      ? 'bg-slate-800/40 hover:bg-slate-700/60 border-slate-700/40 hover:border-slate-600/60'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200/60 hover:border-gray-300',
                  )}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-white/10"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span className={dt.isDark ? 'text-gray-300' : 'text-gray-600'}>{t(preset.i18nKey)}</span>
                </button>
              ))}
            </div>
          </ControlPanel>

          {/* 基础级别: 简化说明 */}
          {isFoundation && (
            <ControlPanel title="简单理解">
              <div className="space-y-2 text-sm">
                <div className={cn('p-2.5 rounded-lg', dt.isDark ? 'bg-slate-800/50' : 'bg-gray-50')}>
                  <p className={dt.bodyClass}>
                    <strong className={dt.isDark ? 'text-cyan-400' : 'text-cyan-600'}>偏振类型:</strong> {params.type}
                  </p>
                </div>
                <div className={cn('p-2.5 rounded-lg', dt.isDark ? 'bg-slate-800/50' : 'bg-gray-50')}>
                  <p className={dt.bodyClass}>
                    椭圆度=0 <strong className="text-orange-400">线偏振</strong>
                  </p>
                  <p className={dt.bodyClass}>
                    椭圆度=&#xB1;1 <strong className="text-cyan-400">圆偏振</strong>
                  </p>
                </div>
              </div>
            </ControlPanel>
          )}

          {/* 非基础级别: 计算值 */}
          {!isFoundation && (
            <ControlPanel title={t('demos.stokes.ui.calculatedValues')}>
              <ValueDisplay label={t('demos.stokes.ui.azimuth')} value={params.angle.toFixed(1)} unit="°" />
              <ValueDisplay
                label={t('demos.stokes.ui.ellipticity')}
                value={params.ellipticity.toFixed(2)}
                color={params.ellipticity > 0 ? 'cyan' : params.ellipticity < 0 ? 'purple' : 'cyan'}
              />
              <ValueDisplay
                label={t('demos.stokes.ui.handedness')}
                value={
                  Math.abs(params.ellipticity) > 0.01
                    ? (params.ellipticity > 0 ? t('demos.stokes.ui.rightHandedR') : t('demos.stokes.ui.leftHandedL'))
                    : t('demos.stokes.types.linear')
                }
                color={params.ellipticity > 0 ? 'cyan' : params.ellipticity < 0 ? 'purple' : 'orange'}
              />
            </ControlPanel>
          )}

          {/* 研究级别: Mueller矩阵 */}
          {isResearch && (
            <MuellerMatrixDisplay stokes={stokes} />
          )}
        </div>
      </div>

      {/* 底部知识卡片 */}
      <InfoGrid columns={isResearch ? 3 : 2}>
        {/* 基础级别: 简化知识卡片 */}
        {isFoundation ? (
          <>
            <InfoCard title="偏振光类型" color="cyan">
              <ul className={cn(
                'text-xs space-y-1.5',
                dt.bodyClass
              )}>
                <li>&#8226; <strong className="text-orange-400">线偏振</strong>: 电场只在一个方向振动</li>
                <li>&#8226; <strong className="text-cyan-400">圆偏振</strong>: 电场旋转，描绘圆形</li>
                <li>&#8226; <strong className="text-purple-400">椭圆偏振</strong>: 介于两者之间</li>
              </ul>
            </InfoCard>
            <InfoCard title="庞加莱球" color="purple">
              <p className={cn(
                'text-xs leading-relaxed',
                dt.bodyClass
              )}>
                球面上每个点代表一种偏振状态。赤道是线偏振，两极是圆偏振。球心是自然光。
              </p>
            </InfoCard>
          </>
        ) : (
          <>
            <InfoCard title={t('demos.stokes.ui.stokesParams')} color="cyan">
              <ul className={cn(
                'text-xs space-y-1',
                dt.bodyClass
              )}>
                <li>&#8226; <strong className={dt.isDark ? 'text-white' : 'text-gray-800'}>S&#x2080;</strong>: {t('demos.stokes.ui.totalIntensity')}</li>
                <li>&#8226; <strong className="text-red-400">S&#x2081;</strong>: {t('demos.stokes.ui.hvDiff')}</li>
                <li>&#8226; <strong className="text-green-400">S&#x2082;</strong>: {t('demos.stokes.ui.pm45Diff')}</li>
                <li>&#8226; <strong className="text-blue-400">S&#x2083;</strong>: {t('demos.stokes.ui.rlDiff')}</li>
              </ul>
            </InfoCard>

            <InfoCard title={t('demos.stokes.ui.poincareSphereInfo')} color="purple">
              <ul className={cn(
                'text-xs space-y-1',
                dt.bodyClass
              )}>
                <li>&#8226; <strong>{t('demos.stokes.ui.equator')}:</strong> {t('demos.stokes.ui.linearStates')}</li>
                <li>&#8226; <strong>{t('demos.stokes.ui.northPole')}:</strong> {t('demos.stokes.ui.rcp')}</li>
                <li>&#8226; <strong>{t('demos.stokes.ui.southPole')}:</strong> {t('demos.stokes.ui.lcp')}</li>
                <li>&#8226; <strong>{t('demos.stokes.ui.center')}:</strong> {t('demos.stokes.ui.unpolarized')}</li>
              </ul>
            </InfoCard>

            {/* 研究级别: Mueller矩阵知识卡片 */}
            {isResearch && (
              <InfoCard title="Mueller Matrix" color="orange">
                <ul className={cn(
                  'text-xs space-y-1',
                  dt.bodyClass
                )}>
                  <li>&#8226; 4x4 matrix describes optical elements</li>
                  <li>&#8226; S' = M S (matrix multiplication)</li>
                  <li>&#8226; Cascading: M_total = M_n ... M_1</li>
                  <li>&#8226; Includes depolarization effects</li>
                </ul>
              </InfoCard>
            )}
          </>
        )}
      </InfoGrid>
    </div>
  )
}
