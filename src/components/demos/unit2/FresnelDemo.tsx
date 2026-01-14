/**
 * 菲涅尔方程演示 - Unit 2
 * 演示s偏振和p偏振的反射/透射系数随入射角的变化
 * 采用纯DOM + SVG + Framer Motion一体化设计
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'

// 菲涅尔方程计算
function fresnelEquations(theta1: number, n1: number, n2: number) {
  const rad = (theta1 * Math.PI) / 180
  const sinTheta1 = Math.sin(rad)
  const cosTheta1 = Math.cos(rad)

  // 斯涅尔定律
  const sinTheta2 = (n1 / n2) * sinTheta1

  // 全内反射检查
  if (sinTheta2 > 1) {
    return {
      rs: 1,
      rp: 1,
      ts: 0,
      tp: 0,
      theta2: 90,
      totalReflection: true,
    }
  }

  const cosTheta2 = Math.sqrt(1 - sinTheta2 * sinTheta2)
  const theta2 = (Math.asin(sinTheta2) * 180) / Math.PI

  // s偏振（垂直于入射面）
  const rs = (n1 * cosTheta1 - n2 * cosTheta2) / (n1 * cosTheta1 + n2 * cosTheta2)
  const ts = (2 * n1 * cosTheta1) / (n1 * cosTheta1 + n2 * cosTheta2)

  // p偏振（平行于入射面）
  const rp = (n2 * cosTheta1 - n1 * cosTheta2) / (n2 * cosTheta1 + n1 * cosTheta2)
  const tp = (2 * n1 * cosTheta1) / (n2 * cosTheta1 + n1 * cosTheta2)

  return {
    rs,
    rp,
    ts,
    tp,
    theta2,
    totalReflection: false,
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

// 光线SVG可视化
function FresnelDiagram({
  incidentAngle,
  n1,
  n2,
  showS,
  showP,
}: {
  incidentAngle: number
  n1: number
  n2: number
  showS: boolean
  showP: boolean
}) {
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

  // 反射率和透射率（考虑折射率和角度因子）
  const Rs = fresnel.rs * fresnel.rs
  const Rp = fresnel.rp * fresnel.rp

  // 透射率需要考虑介质阻抗匹配因子：T = (n₂cosθ₂)/(n₁cosθ₁) × t²
  // 这确保能量守恒：R + T = 1（在界面处的能量通量）
  const rad1 = (incidentAngle * Math.PI) / 180
  const rad2 = (fresnel.theta2 * Math.PI) / 180
  const cosTheta1 = Math.cos(rad1)
  const cosTheta2 = Math.cos(rad2)

  const impedanceFactor = fresnel.totalReflection
    ? 0
    : (n2 * cosTheta2) / (n1 * cosTheta1)

  const Ts = impedanceFactor * fresnel.ts * fresnel.ts
  const Tp = impedanceFactor * fresnel.tp * fresnel.tp

  // 布儒斯特角
  const brewsterAngle = (Math.atan(n2 / n1) * 180) / Math.PI

  return (
    <svg viewBox="0 0 600 360" className="w-full h-auto">
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

      {/* s偏振反射光 - s和p偏振沿同一方向传播，仅强度不同 */}
      {showS && Rs > 0.01 && (
        <motion.line
          x1={cx}
          y1={cy}
          x2={reflectEnd.x}
          y2={reflectEnd.y}
          stroke="#22d3ee"
          strokeWidth={Math.max(1, 4 * Rs)}
          strokeOpacity={Math.max(0.3, Rs)}
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
      )}

      {/* p偏振反射光 - 与s偏振同一路径，用不同颜色和线宽表示强度差异 */}
      {showP && Rp > 0.01 && (
        <motion.line
          x1={cx}
          y1={cy}
          x2={reflectEnd.x}
          y2={reflectEnd.y}
          stroke="#f472b6"
          strokeWidth={Math.max(1, 4 * Rp)}
          strokeOpacity={Math.max(0.3, Rp)}
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        />
      )}

      {/* 反射光标签 */}
      <text x={reflectEnd.x + 20} y={reflectEnd.y - 10} fill="#94a3b8" fontSize="12">
        反射光
      </text>

      {/* s偏振折射光 - 遵循斯涅尔定律，s和p偏振沿同一折射方向 */}
      {showS && !fresnel.totalReflection && Ts > 0.01 && (
        <motion.line
          x1={cx}
          y1={cy}
          x2={refractEnd.x}
          y2={refractEnd.y}
          stroke="#22d3ee"
          strokeWidth={Math.max(1, 4 * Ts)}
          strokeOpacity={Math.max(0.3, Ts)}
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
      )}

      {/* p偏振折射光 - 与s偏振同一路径 */}
      {showP && !fresnel.totalReflection && Tp > 0.01 && (
        <motion.line
          x1={cx}
          y1={cy}
          x2={refractEnd.x}
          y2={refractEnd.y}
          stroke="#f472b6"
          strokeWidth={Math.max(1, 4 * Tp)}
          strokeOpacity={Math.max(0.3, Tp)}
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.35 }}
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
  // 生成曲线数据
  const { rsPath, rpPath, brewsterAngle, criticalAngle } = useMemo(() => {
    const rsPoints: string[] = []
    const rpPoints: string[] = []

    const brewster = (Math.atan(n2 / n1) * 180) / Math.PI
    const critical = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : 90

    for (let angle = 0; angle <= 90; angle += 1) {
      const f = fresnelEquations(angle, n1, n2)
      const Rs = f.rs * f.rs
      const Rp = f.rp * f.rp

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
  const currentRs = currentFresnel.rs * currentFresnel.rs
  const currentRp = currentFresnel.rp * currentFresnel.rp
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
  const [incidentAngle, setIncidentAngle] = useState(45)
  const [n1, setN1] = useState(1.0)
  const [n2, setN2] = useState(1.5)
  const [showS, setShowS] = useState(true)
  const [showP, setShowP] = useState(true)

  const fresnel = fresnelEquations(incidentAngle, n1, n2)
  const Rs = fresnel.rs * fresnel.rs
  const Rp = fresnel.rp * fresnel.rp

  // 透射率需要考虑介质阻抗匹配因子：T = (n₂cosθ₂)/(n₁cosθ₁) × t²
  const rad1 = (incidentAngle * Math.PI) / 180
  const rad2 = (fresnel.theta2 * Math.PI) / 180
  const cosTheta1 = Math.cos(rad1)
  const cosTheta2 = Math.cos(rad2)

  const impedanceFactor = fresnel.totalReflection
    ? 0
    : (n2 * cosTheta2) / (n1 * cosTheta1)

  const Ts = impedanceFactor * fresnel.ts * fresnel.ts
  const Tp = impedanceFactor * fresnel.tp * fresnel.tp

  // 布儒斯特角
  const brewsterAngle = (Math.atan(n2 / n1) * 180) / Math.PI
  // 临界角
  const criticalAngle = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null

  // 材料预设
  const materials = [
    { name: '空气→玻璃', n1: 1.0, n2: 1.5 },
    { name: '空气→水', n1: 1.0, n2: 1.33 },
    { name: '玻璃→空气', n1: 1.5, n2: 1.0 },
    { name: '水→空气', n1: 1.33, n2: 1.0 },
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
            描述电磁波在两种<strong>各向同性</strong>介质界面反射和透射的振幅比。s偏振和p偏振<strong>沿同一方向传播</strong>，仅强度不同（用线宽表示）。注意：只有在双折射晶体（各向异性）中才会出现不同方向的折射光。
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
