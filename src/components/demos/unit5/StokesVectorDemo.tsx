/**
 * 斯托克斯矢量演示 - Unit 5
 * 用四个参数 [S₀, S₁, S₂, S₃] 完整描述光的偏振状态
 * 重新设计：纯 DOM + SVG + Framer Motion
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SliderControl, ControlPanel, InfoCard, ValueDisplay } from '../DemoControls'

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
function stokesToParams(stokes: StokesVector): {
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

  let type = '部分偏振'
  if (dop > 0.99) {
    if (Math.abs(ellipticity) < 0.01) type = '线偏振'
    else if (Math.abs(ellipticity) > 0.99) type = S3 > 0 ? '右旋圆偏振' : '左旋圆偏振'
    else type = '椭圆偏振'
  } else if (dop < 0.01) {
    type = '自然光'
  }

  return { dop, angle, ellipticity, type }
}

// 庞加莱球可视化（2D投影）
function PoincareSphereView({ stokes }: { stokes: StokesVector }) {
  const { S0, S1, S2, S3 } = stokes
  const dop = Math.sqrt(S1 * S1 + S2 * S2 + S3 * S3) / (S0 + 0.001)

  // 归一化坐标
  const x = dop > 0.01 ? S1 / (S0 * dop + 0.001) : 0
  const y = dop > 0.01 ? S2 / (S0 * dop + 0.001) : 0
  const z = dop > 0.01 ? S3 / (S0 * dop + 0.001) : 0

  const width = 280
  const height = 280
  const centerX = width / 2
  const centerY = height / 2
  const radius = 100

  // 关键点位置
  const keyPoints = [
    { label: 'H', x: radius, y: 0, color: '#ef4444' },
    { label: 'V', x: -radius, y: 0, color: '#ef4444' },
    { label: '+45°', x: 0, y: -radius, color: '#22c55e' },
    { label: '-45°', x: 0, y: radius, color: '#22c55e' },
  ]

  // 当前点位置（俯视图：S1-S2平面）
  const pointX = centerX + x * radius
  const pointY = centerY - y * radius // SVG y轴向下

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* 背景 */}
      <rect x={0} y={0} width={width} height={height} fill="#0f172a" rx={12} />

      {/* 标题 */}
      <text x={centerX} y={25} textAnchor="middle" fill="#94a3b8" fontSize={12}>
        庞加莱球 (俯视图: S₁-S₂平面)
      </text>

      {/* 球的投影 - 赤道圆 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="#374151"
        strokeWidth={2}
      />

      {/* 内部同心圆 */}
      {[0.25, 0.5, 0.75].map((r) => (
        <circle
          key={r}
          cx={centerX}
          cy={centerY}
          r={radius * r}
          fill="none"
          stroke="#1f2937"
          strokeWidth={1}
          strokeDasharray="4,4"
        />
      ))}

      {/* 坐标轴 */}
      <line
        x1={centerX - radius - 20}
        y1={centerY}
        x2={centerX + radius + 20}
        y2={centerY}
        stroke="#ef4444"
        strokeWidth={1.5}
      />
      <line
        x1={centerX}
        y1={centerY - radius - 20}
        x2={centerX}
        y2={centerY + radius + 20}
        stroke="#22c55e"
        strokeWidth={1.5}
      />

      {/* 轴标签 */}
      <text x={centerX + radius + 25} y={centerY + 5} fill="#ef4444" fontSize={14} fontWeight="bold">
        S₁
      </text>
      <text x={centerX + 5} y={centerY - radius - 25} fill="#22c55e" fontSize={14} fontWeight="bold">
        S₂
      </text>

      {/* 关键点 */}
      {keyPoints.map((point, i) => (
        <g key={i}>
          <circle
            cx={centerX + point.x}
            cy={centerY - point.y}
            r={6}
            fill={point.color}
          />
          <text
            x={centerX + point.x + (point.x > 0 ? 12 : -12)}
            y={centerY - point.y + 4}
            textAnchor={point.x > 0 ? 'start' : 'end'}
            fill="#94a3b8"
            fontSize={11}
          >
            {point.label}
          </text>
        </g>
      ))}

      {/* 当前偏振状态点 */}
      {dop > 0.01 && (
        <>
          {/* 从原点到点的连线 */}
          <motion.line
            x1={centerX}
            y1={centerY}
            x2={pointX}
            y2={pointY}
            stroke="#fbbf24"
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          {/* 点 */}
          <motion.circle
            cx={pointX}
            cy={pointY}
            r={10}
            fill="#fbbf24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <motion.circle
            cx={pointX}
            cy={pointY}
            r={15}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={2}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      )}

      {/* S3指示（高度） */}
      <g transform={`translate(${width - 35}, ${centerY})`}>
        <line x1={0} y1={-60} x2={0} y2={60} stroke="#3b82f6" strokeWidth={2} />
        <text x={5} y={-65} fill="#3b82f6" fontSize={12} fontWeight="bold">S₃</text>
        <text x={10} y={-45} fill="#94a3b8" fontSize={9}>RCP</text>
        <text x={10} y={55} fill="#94a3b8" fontSize={9}>LCP</text>
        {/* S3值指示 */}
        <motion.circle
          cx={0}
          cy={-z * 50}
          r={6}
          fill="#3b82f6"
          animate={{ cy: -z * 50 }}
          transition={{ duration: 0.3 }}
        />
      </g>
    </svg>
  )
}

// 偏振椭圆可视化
function PolarizationEllipseView({ stokes }: { stokes: StokesVector }) {
  const params = stokesToParams(stokes)
  const width = 200
  const height = 200
  const centerX = width / 2
  const centerY = height / 2
  const maxRadius = 70

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
  const axisEndX = centerX + maxRadius * 1.1 * Math.cos(axisAngle)
  const axisEndY = centerY - maxRadius * 1.1 * Math.sin(axisAngle)

  const isRightHanded = stokes.S3 > 0

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* 背景 */}
      <rect x={0} y={0} width={width} height={height} fill="#0f172a" rx={12} />

      {/* 参考圆 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius}
        fill="none"
        stroke="#1f2937"
        strokeWidth={1}
        strokeDasharray="4,4"
      />

      {/* 参考轴 */}
      <line x1={20} y1={centerY} x2={width - 20} y2={centerY} stroke="#374151" strokeWidth={1} />
      <line x1={centerX} y1={20} x2={centerX} y2={height - 20} stroke="#374151" strokeWidth={1} />

      {/* 偏振椭圆 */}
      <motion.path
        d={ellipsePath}
        fill={isRightHanded ? 'rgba(34, 211, 238, 0.1)' : 'rgba(244, 114, 182, 0.1)'}
        stroke={isRightHanded ? '#22d3ee' : '#f472b6'}
        strokeWidth={3}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* 长轴方向 */}
      <motion.line
        x1={centerX - (axisEndX - centerX)}
        y1={centerY + (centerY - axisEndY)}
        x2={axisEndX}
        y2={axisEndY}
        stroke="#fbbf24"
        strokeWidth={2}
        strokeDasharray="6,4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />

      {/* 角度标注 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <path
          d={`M ${centerX + 25} ${centerY} A 25 25 0 0 ${params.angle >= 0 ? 0 : 1} ${
            centerX + 25 * Math.cos(axisAngle)
          } ${centerY - 25 * Math.sin(axisAngle)}`}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={2}
        />
        <text
          x={centerX + 35 * Math.cos(axisAngle / 2)}
          y={centerY - 35 * Math.sin(axisAngle / 2)}
          fill="#fbbf24"
          fontSize={12}
          textAnchor="middle"
        >
          {params.angle.toFixed(0)}°
        </text>
      </motion.g>

      {/* 旋转方向指示 */}
      {Math.abs(params.ellipticity) > 0.05 && (
        <g transform={`translate(${centerX}, ${centerY})`}>
          <motion.path
            d={isRightHanded
              ? 'M 30 0 A 30 30 0 0 1 0 -30'
              : 'M 30 0 A 30 30 0 0 0 0 30'
            }
            fill="none"
            stroke={isRightHanded ? '#22d3ee' : '#f472b6'}
            strokeWidth={2}
            markerEnd="url(#arrowhead)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />
        </g>
      )}

      {/* 箭头定义 */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={isRightHanded ? '#22d3ee' : '#f472b6'}
          />
        </marker>
      </defs>

      {/* 标签 */}
      <text x={centerX} y={height - 10} textAnchor="middle" fill="#94a3b8" fontSize={11}>
        偏振椭圆 {Math.abs(params.ellipticity) > 0.05 ? (isRightHanded ? '(右旋)' : '(左旋)') : '(线偏振)'}
      </text>
    </svg>
  )
}

// 斯托克斯矢量显示
function StokesVectorDisplay({ stokes }: { stokes: StokesVector }) {
  const { S0, S1, S2, S3 } = stokes

  const components = [
    { label: 'S₀', value: S0, color: '#ffffff', desc: '总强度' },
    { label: 'S₁', value: S1, color: '#ef4444', desc: 'H-V' },
    { label: 'S₂', value: S2, color: '#22c55e', desc: '±45°' },
    { label: 'S₃', value: S3, color: '#3b82f6', desc: 'R-L' },
  ]

  return (
    <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 p-4">
      <h4 className="text-sm font-medium text-cyan-400 mb-3">斯托克斯矢量</h4>
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl text-gray-500 font-light">[</span>
        <div className="space-y-2">
          {components.map((comp, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="w-8 font-mono text-sm" style={{ color: comp.color }}>
                {comp.label}
              </span>
              <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: comp.color }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(Math.abs(comp.value) / (Math.abs(S0) + 0.001) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              </div>
              <span className="w-16 text-right font-mono text-cyan-400 text-sm">
                {comp.value >= 0 ? '+' : ''}{comp.value.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">{comp.desc}</span>
            </motion.div>
          ))}
        </div>
        <span className="text-2xl text-gray-500 font-light">]</span>
      </div>
    </div>
  )
}

// 预设偏振状态
const PRESETS = [
  { name: '水平线偏振 (H)', angle: 0, ellipticity: 0, dop: 1, color: '#ef4444' },
  { name: '垂直线偏振 (V)', angle: 90, ellipticity: 0, dop: 1, color: '#ef4444' },
  { name: '+45°线偏振', angle: 45, ellipticity: 0, dop: 1, color: '#22c55e' },
  { name: '-45°线偏振', angle: -45, ellipticity: 0, dop: 1, color: '#22c55e' },
  { name: '右旋圆偏振 (R)', angle: 0, ellipticity: 1, dop: 1, color: '#3b82f6' },
  { name: '左旋圆偏振 (L)', angle: 0, ellipticity: -1, dop: 1, color: '#f472b6' },
  { name: '右旋椭圆偏振', angle: 30, ellipticity: 0.5, dop: 1, color: '#22d3ee' },
  { name: '自然光', angle: 0, ellipticity: 0, dop: 0, color: '#94a3b8' },
]

// 主演示组件
export function StokesVectorDemo() {
  const { t } = useTranslation()
  const [intensity, setIntensity] = useState(1)
  const [polarizationAngle, setPolarizationAngle] = useState(0)
  const [ellipticity, setEllipticity] = useState(0)
  const [dop, setDop] = useState(1)

  // 计算斯托克斯矢量
  const stokes = calculateStokes(intensity, polarizationAngle, ellipticity, dop)
  const params = stokesToParams(stokes)

  // 应用预设
  const applyPreset = (preset: typeof PRESETS[0]) => {
    setPolarizationAngle(preset.angle)
    setEllipticity(preset.ellipticity)
    setDop(preset.dop)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          斯托克斯矢量演示
        </h2>
        <p className="text-gray-400 text-sm mt-1">Stokes Vector - 偏振态的完整数学描述</p>
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="space-y-4">
          {/* 庞加莱球和偏振椭圆 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 p-3">
              <PoincareSphereView stokes={stokes} />
            </div>
            <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 p-3">
              <PolarizationEllipseView stokes={stokes} />
            </div>
          </div>

          {/* 斯托克斯矢量显示 */}
          <StokesVectorDisplay stokes={stokes} />

          {/* 偏振状态 */}
          <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 p-4">
            <h4 className="text-sm font-medium text-cyan-400 mb-3">当前偏振状态</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400">{params.type}</div>
                <div className="text-xs text-gray-500 mt-1">偏振类型</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">{(params.dop * 100).toFixed(0)}%</div>
                <div className="text-xs text-gray-500 mt-1">偏振度 (DOP)</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：控制面板 */}
        <div className="space-y-4">
          <ControlPanel title="偏振参数">
            <SliderControl
              label="光强度 I"
              value={intensity}
              min={0.1}
              max={2}
              step={0.1}
              onChange={setIntensity}
              color="white"
            />
            <SliderControl
              label="偏振角度 ψ"
              value={polarizationAngle}
              min={-90}
              max={90}
              step={5}
              unit="°"
              onChange={setPolarizationAngle}
              color="yellow"
            />
            <SliderControl
              label="椭圆度 ε"
              value={ellipticity}
              min={-1}
              max={1}
              step={0.1}
              onChange={setEllipticity}
              color="cyan"
            />
            <SliderControl
              label="偏振度 DOP"
              value={dop}
              min={0}
              max={1}
              step={0.05}
              onChange={setDop}
              color="green"
            />
          </ControlPanel>

          <ControlPanel title="预设偏振状态">
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-2 py-1.5 text-xs bg-slate-700/50 rounded hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span className="text-gray-300">{preset.name}</span>
                </button>
              ))}
            </div>
          </ControlPanel>

          <ControlPanel title="计算值">
            <ValueDisplay label="方位角 ψ" value={params.angle.toFixed(1)} unit="°" />
            <ValueDisplay
              label="椭圆度 ε"
              value={params.ellipticity.toFixed(2)}
              color={params.ellipticity > 0 ? 'cyan' : params.ellipticity < 0 ? 'purple' : 'gray'}
            />
            <ValueDisplay
              label="旋向"
              value={
                Math.abs(params.ellipticity) > 0.01
                  ? (params.ellipticity > 0 ? '右旋 (R)' : '左旋 (L)')
                  : '线偏振'
              }
              color={params.ellipticity > 0 ? 'cyan' : params.ellipticity < 0 ? 'purple' : 'yellow'}
            />
          </ControlPanel>
        </div>
      </div>

      {/* 底部知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="斯托克斯参数含义" color="cyan">
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• <strong className="text-white">S₀</strong>: 总光强度（总是正值）</li>
            <li>• <strong className="text-red-400">S₁</strong>: 水平偏振 - 垂直偏振 强度差</li>
            <li>• <strong className="text-green-400">S₂</strong>: +45°偏振 - -45°偏振 强度差</li>
            <li>• <strong className="text-blue-400">S₃</strong>: 右旋圆偏振 - 左旋圆偏振 强度差</li>
          </ul>
        </InfoCard>

        <InfoCard title="庞加莱球" color="purple">
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• <strong>赤道：</strong>线偏振态（H, V, ±45°）</li>
            <li>• <strong>北极：</strong>右旋圆偏振 (RCP)</li>
            <li>• <strong>南极：</strong>左旋圆偏振 (LCP)</li>
            <li>• <strong>其他：</strong>椭圆偏振态</li>
            <li>• <strong>球心：</strong>完全非偏振（自然光）</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
