/**
 * 色偏振演示 - Unit 3
 * 演示双折射材料中白光的彩色干涉效应
 * 采用纯DOM + SVG + Framer Motion一体化设计
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { MediaGalleryPanel } from './MediaGalleryPanel'

// 波长到RGB颜色转换
function wavelengthToRGB(wavelength: number): [number, number, number] {
  let R = 0, G = 0, B = 0

  if (wavelength >= 380 && wavelength < 440) {
    R = -(wavelength - 440) / (440 - 380)
    G = 0
    B = 1
  } else if (wavelength >= 440 && wavelength < 490) {
    R = 0
    G = (wavelength - 440) / (490 - 440)
    B = 1
  } else if (wavelength >= 490 && wavelength < 510) {
    R = 0
    G = 1
    B = -(wavelength - 510) / (510 - 490)
  } else if (wavelength >= 510 && wavelength < 580) {
    R = (wavelength - 510) / (580 - 510)
    G = 1
    B = 0
  } else if (wavelength >= 580 && wavelength < 645) {
    R = 1
    G = -(wavelength - 645) / (645 - 580)
    B = 0
  } else if (wavelength >= 645 && wavelength <= 780) {
    R = 1
    G = 0
    B = 0
  }

  // 边缘衰减
  let factor = 1
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380)
  } else if (wavelength >= 700 && wavelength <= 780) {
    factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700)
  }

  return [R * factor, G * factor, B * factor]
}

// 计算透过强度（考虑相位延迟）
function calculateTransmission(
  wavelength: number,
  thickness: number,
  birefringence: number,
  polarizerAngle: number,
  analyzerAngle: number
): number {
  // 相位延迟 δ = 2π × Δn × d / λ
  const phaseRetardation = (2 * Math.PI * birefringence * thickness * 1000) / wavelength

  // 假设样品45度放置，偏振角相对于样品
  const theta1 = ((polarizerAngle - 45) * Math.PI) / 180
  const theta2 = ((analyzerAngle - 45) * Math.PI) / 180

  // 简化的透过率公式
  const transmission =
    Math.pow(Math.cos(theta1 - theta2), 2) -
    Math.sin(2 * theta1) * Math.sin(2 * theta2) * Math.pow(Math.sin(phaseRetardation / 2), 2)

  return Math.max(0, Math.min(1, transmission))
}

// 计算混合颜色
function calculateMixedColor(
  thickness: number,
  birefringence: number,
  polarizerAngle: number,
  analyzerAngle: number
): { r: number; g: number; b: number; hex: string } {
  let totalR = 0, totalG = 0, totalB = 0
  let totalWeight = 0

  // 对可见光谱积分
  for (let wavelength = 400; wavelength <= 700; wavelength += 5) {
    const transmission = calculateTransmission(
      wavelength,
      thickness,
      birefringence,
      polarizerAngle,
      analyzerAngle
    )
    const [r, g, b] = wavelengthToRGB(wavelength)
    totalR += r * transmission
    totalG += g * transmission
    totalB += b * transmission
    totalWeight += transmission
  }

  if (totalWeight < 0.01) {
    return { r: 0, g: 0, b: 0, hex: '#000000' }
  }

  // 归一化并增强对比度
  const maxChannel = Math.max(totalR, totalG, totalB, 0.01)
  const r = Math.min(1, (totalR / maxChannel) * 1.2)
  const g = Math.min(1, (totalG / maxChannel) * 1.2)
  const b = Math.min(1, (totalB / maxChannel) * 1.2)

  const hex = `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`

  return { r, g, b, hex }
}

// 光路示意图
function OpticalPathDiagram({
  thickness,
  birefringence,
  polarizerAngle,
  analyzerAngle,
  resultColor,
}: {
  thickness: number
  birefringence: number
  polarizerAngle: number
  analyzerAngle: number
  resultColor: string
}) {
  return (
    <svg viewBox="0 0 700 280" className="w-full h-auto">
      <defs>
        <linearGradient id="whiteLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="17%" stopColor="#f97316" />
          <stop offset="33%" stopColor="#eab308" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="67%" stopColor="#06b6d4" />
          <stop offset="83%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="glowWhite" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowResult" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect x="0" y="0" width="700" height="280" fill="#0f172a" rx="8" />

      {/* 白光光源 */}
      <g transform="translate(50, 140)">
        <motion.circle
          r="25"
          fill="url(#whiteLight)"
          filter="url(#glowWhite)"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="0" y="50" textAnchor="middle" fill="#94a3b8" fontSize="12">白光源</text>
      </g>

      {/* 入射光束（彩虹色） */}
      <rect x="75" y="133" width="60" height="14" fill="url(#whiteLight)" opacity="0.8" />

      {/* 起偏器 */}
      <g transform="translate(145, 140)">
        <rect x="-8" y="-45" width="16" height="90" fill="#1e3a5f" stroke="#22d3ee" strokeWidth="2" rx="3" />
        <motion.line
          x1="0"
          y1="-35"
          x2="0"
          y2="35"
          stroke="#22d3ee"
          strokeWidth="3"
          transform={`rotate(${polarizerAngle})`}
        />
        <text x="0" y="65" textAnchor="middle" fill="#22d3ee" fontSize="11">起偏器</text>
        <text x="0" y="78" textAnchor="middle" fill="#94a3b8" fontSize="10">{polarizerAngle}°</text>
      </g>

      {/* 偏振光束（单色） */}
      <rect x="161" y="136" width="80" height="8" fill="#22d3ee" opacity="0.7" />

      {/* 双折射样品 */}
      <g transform="translate(280, 140)">
        <rect
          x="-40"
          y="-50"
          width={80 + thickness * 80}
          height="100"
          fill="rgba(168, 216, 234, 0.3)"
          stroke="#67e8f9"
          strokeWidth="2"
          rx="5"
        />
        {/* 光轴指示 */}
        <line x1="-30" y1="-40" x2={40 + thickness * 80} y2="-40" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x={(thickness * 80) / 2} y="-25" textAnchor="middle" fill="#a78bfa" fontSize="9">快轴</text>
        <text x={(thickness * 80) / 2} y="70" textAnchor="middle" fill="#67e8f9" fontSize="11">双折射样品</text>
        <text x={(thickness * 80) / 2} y="85" textAnchor="middle" fill="#94a3b8" fontSize="10">
          d={thickness.toFixed(2)}mm, Δn={birefringence.toFixed(3)}
        </text>
      </g>

      {/* 样品内光分离 */}
      <g transform={`translate(${250}, 140)`}>
        <line x1="0" y1="0" x2={50 + thickness * 40} y2="-12" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
        <line x1="0" y1="0" x2={50 + thickness * 40} y2="12" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
        <text x={60 + thickness * 40} y="-15" fill="#ef4444" fontSize="9">o光</text>
        <text x={60 + thickness * 40} y="18" fill="#22c55e" fontSize="9">e光</text>
      </g>

      {/* 出射光束（颜色变化） */}
      <rect x={330 + thickness * 80} y="136" width="80" height="8" fill={resultColor} opacity="0.7" />

      {/* 检偏器 */}
      <g transform={`translate(${420 + thickness * 80}, 140)`}>
        <rect x="-8" y="-45" width="16" height="90" fill="#1e3a5f" stroke="#a78bfa" strokeWidth="2" rx="3" />
        <motion.line
          x1="0"
          y1="-35"
          x2="0"
          y2="35"
          stroke="#a78bfa"
          strokeWidth="3"
          transform={`rotate(${analyzerAngle})`}
        />
        <text x="0" y="65" textAnchor="middle" fill="#a78bfa" fontSize="11">检偏器</text>
        <text x="0" y="78" textAnchor="middle" fill="#94a3b8" fontSize="10">{analyzerAngle}°</text>
      </g>

      {/* 最终光束 */}
      <rect x={436 + thickness * 80} y="136" width="80" height="8" fill={resultColor} />

      {/* 观察屏 */}
      <g transform={`translate(${570 + thickness * 50}, 140)`}>
        <motion.rect
          x="-30"
          y="-50"
          width="60"
          height="100"
          fill={resultColor}
          stroke="#475569"
          strokeWidth="2"
          rx="6"
          filter="url(#glowResult)"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <text x="0" y="70" textAnchor="middle" fill="#94a3b8" fontSize="11">观察屏</text>
      </g>

      {/* 标注线 */}
      <path
        d="M 50 200 L 50 230 L 650 230 L 650 200"
        fill="none"
        stroke="#475569"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.5"
      />
      <text x="350" y="250" textAnchor="middle" fill="#64748b" fontSize="11">
        光路传播方向 →
      </text>
    </svg>
  )
}

// 光谱透过率图
function SpectrumChart({
  thickness,
  birefringence,
  polarizerAngle,
  analyzerAngle,
}: {
  thickness: number
  birefringence: number
  polarizerAngle: number
  analyzerAngle: number
}) {
  const { pathData, spectrumGradient } = useMemo(() => {
    const points: string[] = []

    for (let wavelength = 400; wavelength <= 700; wavelength += 3) {
      const transmission = calculateTransmission(
        wavelength,
        thickness,
        birefringence,
        polarizerAngle,
        analyzerAngle
      )
      const x = 40 + ((wavelength - 400) / 300) * 250
      const y = 130 - transmission * 100

      points.push(`${wavelength === 400 ? 'M' : 'L'} ${x},${y}`)
    }

    // 生成光谱渐变
    const stops: string[] = []
    for (let i = 0; i <= 10; i++) {
      const wavelength = 400 + (i / 10) * 300
      const [r, g, b] = wavelengthToRGB(wavelength)
      stops.push(`rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`)
    }

    return {
      pathData: points.join(' '),
      spectrumGradient: stops,
    }
  }, [thickness, birefringence, polarizerAngle, analyzerAngle])

  return (
    <svg viewBox="0 0 320 170" className="w-full h-auto">
      <defs>
        <linearGradient id="spectrumBg" x1="0%" y1="0%" x2="100%" y2="0%">
          {spectrumGradient.map((color, i) => (
            <stop key={i} offset={`${i * 10}%`} stopColor={color} stopOpacity="0.2" />
          ))}
        </linearGradient>
      </defs>

      {/* 背景 */}
      <rect x="40" y="30" width="250" height="100" fill="url(#spectrumBg)" rx="4" />

      {/* 坐标轴 */}
      <line x1="40" y1="130" x2="300" y2="130" stroke="#475569" strokeWidth="1" />
      <line x1="40" y1="30" x2="40" y2="130" stroke="#475569" strokeWidth="1" />

      {/* X轴刻度 */}
      {[400, 500, 600, 700].map((wl) => {
        const x = 40 + ((wl - 400) / 300) * 250
        const [r, g, b] = wavelengthToRGB(wl)
        return (
          <g key={wl}>
            <line x1={x} y1="130" x2={x} y2="135" stroke="#94a3b8" strokeWidth="1" />
            <text x={x} y="148" textAnchor="middle" fill={`rgb(${r * 255}, ${g * 255}, ${b * 255})`} fontSize="10">
              {wl}
            </text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      {[0, 0.5, 1].map((val, i) => {
        const y = 130 - val * 100
        return (
          <g key={i}>
            <text x="30" y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10">{val}</text>
          </g>
        )
      })}

      {/* 透过率曲线 */}
      <path d={pathData} fill="none" stroke="#ffffff" strokeWidth="2.5" />

      {/* 轴标签 */}
      <text x="170" y="165" textAnchor="middle" fill="#94a3b8" fontSize="11">波长 (nm)</text>
      <text x="15" y="85" fill="#94a3b8" fontSize="10" transform="rotate(-90 15 85)">T</text>
    </svg>
  )
}

// 颜色显示面板
function ColorDisplayPanel({
  color,
}: {
  color: { r: number; g: number; b: number; hex: string }
}) {
  return (
    <div className="space-y-3">
      <div
        className="w-full h-24 rounded-xl border-2 border-slate-600 shadow-lg transition-colors duration-300"
        style={{
          backgroundColor: color.hex,
          boxShadow: `0 0 30px ${color.hex}40`,
        }}
      />
      <div className="flex justify-between items-center text-xs">
        <div className="space-y-1">
          <div className="text-gray-500">RGB</div>
          <div className="font-mono text-gray-300">
            ({Math.round(color.r * 255)}, {Math.round(color.g * 255)}, {Math.round(color.b * 255)})
          </div>
        </div>
        <div className="space-y-1 text-right">
          <div className="text-gray-500">HEX</div>
          <div className="font-mono text-gray-300 uppercase">{color.hex}</div>
        </div>
      </div>
    </div>
  )
}

// 主演示组件
export function ChromaticDemo() {
  const [thickness, setThickness] = useState(0.1)
  const [birefringence, setBirefringence] = useState(0.01)
  const [polarizerAngle, setPolarizerAngle] = useState(0)
  const [analyzerAngle, setAnalyzerAngle] = useState(90)

  // 预设材料
  const materials = [
    { name: '塑料薄膜', br: 0.005 },
    { name: '云母片', br: 0.04 },
    { name: '方解石', br: 0.172 },
    { name: '石英', br: 0.009 },
  ]

  // 计算结果
  const resultColor = calculateMixedColor(thickness, birefringence, polarizerAngle, analyzerAngle)

  // 计算相位延迟
  const phaseRetardation = (2 * Math.PI * birefringence * thickness * 1000) / 550 // 在550nm处
  const retardationOrders = phaseRetardation / (2 * Math.PI)
  const opticalPathDiff = birefringence * thickness * 1000 // nm

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
          色偏振交互演示
        </h2>
        <p className="text-gray-400 mt-1">
          探索双折射材料产生的彩色干涉效应
        </p>
      </div>

      {/* 真实实验场景展示 - 在交互演示上方 */}
      <MediaGalleryPanel />

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="space-y-4">
          {/* 光路图 */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-purple-950/90 border border-purple-500/30 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <OpticalPathDiagram
              thickness={thickness}
              birefringence={birefringence}
              polarizerAngle={polarizerAngle}
              analyzerAngle={analyzerAngle}
              resultColor={resultColor.hex}
            />
          </div>

          {/* 观察到的颜色 */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-600/30 p-4">
            <h4 className="text-sm font-semibold text-white mb-3">观察到的颜色</h4>
            <ColorDisplayPanel color={resultColor} />
          </div>
        </div>

        {/* 右侧：控制与学习 */}
        <div className="space-y-4">
          {/* 样品参数 */}
          <ControlPanel title="样品参数">
            <SliderControl
              label="样品厚度 d"
              value={thickness}
              min={0.01}
              max={0.5}
              step={0.01}
              unit=" mm"
              onChange={setThickness}
              color="cyan"
            />
            <SliderControl
              label="双折射率 Δn"
              value={birefringence}
              min={0.001}
              max={0.2}
              step={0.001}
              onChange={setBirefringence}
              formatValue={(v) => v.toFixed(3)}
              color="purple"
            />

            {/* 材料预设 */}
            <div className="pt-2">
              <div className="text-xs text-gray-500 mb-2">预设材料</div>
              <div className="grid grid-cols-2 gap-2">
                {materials.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setBirefringence(m.br)}
                    className={`px-2 py-1.5 text-xs rounded transition-colors ${
                      Math.abs(birefringence - m.br) < 0.0001
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          </ControlPanel>

          {/* 偏振设置 */}
          <ControlPanel title="偏振片设置">
            <SliderControl
              label="起偏器角度"
              value={polarizerAngle}
              min={0}
              max={180}
              step={5}
              unit="°"
              onChange={setPolarizerAngle}
              color="cyan"
            />
            <SliderControl
              label="检偏器角度"
              value={analyzerAngle}
              min={0}
              max={180}
              step={5}
              unit="°"
              onChange={setAnalyzerAngle}
              color="purple"
            />

            <div className="flex gap-2 pt-2">
              <motion.button
                className="flex-1 py-1.5 text-xs bg-slate-700/50 text-gray-300 rounded hover:bg-slate-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAnalyzerAngle(polarizerAngle)}
              >
                平行设置
              </motion.button>
              <motion.button
                className="flex-1 py-1.5 text-xs bg-slate-700/50 text-gray-300 rounded hover:bg-slate-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAnalyzerAngle((polarizerAngle + 90) % 180)}
              >
                正交设置
              </motion.button>
            </div>
          </ControlPanel>

          {/* 相位延迟信息 */}
          <ControlPanel title="相位延迟">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 bg-slate-900/50 rounded-lg">
                <div className="text-gray-500 text-xs">光程差 Δn×d</div>
                <div className="text-cyan-400 font-mono">{opticalPathDiff.toFixed(1)} nm</div>
              </div>
              <div className="p-2 bg-slate-900/50 rounded-lg">
                <div className="text-gray-500 text-xs">相位延迟 (550nm)</div>
                <div className="text-purple-400 font-mono">{(phaseRetardation * 180 / Math.PI).toFixed(0)}°</div>
              </div>
              <div className="p-2 bg-slate-900/50 rounded-lg col-span-2">
                <div className="text-gray-500 text-xs">延迟级次</div>
                <div className="text-orange-400 font-mono">{retardationOrders.toFixed(2)} λ</div>
              </div>
            </div>
          </ControlPanel>

          {/* 光谱透过率 */}
          <ControlPanel title="光谱透过率">
            <SpectrumChart
              thickness={thickness}
              birefringence={birefringence}
              polarizerAngle={polarizerAngle}
              analyzerAngle={analyzerAngle}
            />
            <p className="text-xs text-gray-400 mt-2">
              不同波长的透过率不同，导致出射光呈现特定颜色。
            </p>
          </ControlPanel>
        </div>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="色偏振原理" color="cyan">
          <p className="text-xs text-gray-300">
            白光通过双折射材料时，不同波长的光经历不同的相位延迟，在检偏器后发生干涉，产生特征颜色。
          </p>
        </InfoCard>
        <InfoCard title="米歇尔-列维色表" color="purple">
          <p className="text-xs text-gray-300">
            光程差与颜色的对应关系构成米歇尔-列维色表，是矿物鉴定的重要工具。低级次：灰→白→黄，高级次：彩色序列。
          </p>
        </InfoCard>
        <InfoCard title="应用场景" color="orange">
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• 矿物岩石鉴定</li>
            <li>• 应力分析（光弹性）</li>
            <li>• 液晶显示技术</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
