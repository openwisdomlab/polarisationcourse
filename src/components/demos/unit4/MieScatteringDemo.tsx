/**
 * 米氏散射演示 - Unit 4
 * 演示粒径与波长可比时的散射特性
 * 采用纯DOM + SVG + Framer Motion一体化设计
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'

// 波长到RGB颜色转换
function wavelengthToRGB(wavelength: number): string {
  let R = 0, G = 0, B = 0

  if (wavelength >= 380 && wavelength < 440) {
    R = -(wavelength - 440) / (440 - 380)
    B = 1
  } else if (wavelength >= 440 && wavelength < 490) {
    G = (wavelength - 440) / (490 - 440)
    B = 1
  } else if (wavelength >= 490 && wavelength < 510) {
    G = 1
    B = -(wavelength - 510) / (510 - 490)
  } else if (wavelength >= 510 && wavelength < 580) {
    R = (wavelength - 510) / (580 - 510)
    G = 1
  } else if (wavelength >= 580 && wavelength < 645) {
    R = 1
    G = -(wavelength - 645) / (645 - 580)
  } else if (wavelength >= 645 && wavelength <= 780) {
    R = 1
  }

  return `rgb(${Math.round(R * 255)}, ${Math.round(G * 255)}, ${Math.round(B * 255)})`
}

// 米氏散射相函数（简化模型）
function miePhaseFunction(angle: number, sizeParameter: number): number {
  const theta = (angle * Math.PI) / 180
  const x = sizeParameter

  // 简化的米氏散射相函数
  // 前向散射增强随粒径增大
  const forwardScatter = Math.pow(1 + Math.cos(theta), x / 2)
  const backScatter = 0.1 + 0.3 * Math.pow((1 - Math.cos(theta)) / 2, 2)

  // 归一化
  const total = forwardScatter + backScatter
  return (forwardScatter / total)
}

// 散射强度随尺寸参数变化
function mieIntensity(sizeParameter: number): number {
  // 米氏散射效率在x≈4时达到峰值
  if (sizeParameter < 0.1) {
    return Math.pow(sizeParameter, 4) // 瑞利区
  } else if (sizeParameter < 10) {
    // 米氏区 - 振荡行为简化
    return 2 + Math.sin(sizeParameter) * 0.5
  } else {
    return 2 // 几何光学区
  }
}

// 米氏散射图示
function MieScatteringDiagram({
  particleSize,
  wavelength,
}: {
  particleSize: number
  wavelength: number
}) {
  // 尺寸参数 x = 2πr/λ
  const sizeParameter = (2 * Math.PI * particleSize * 1000) / wavelength
  const lightColor = wavelengthToRGB(wavelength)

  // 计算散射模式
  const scatterAngles = useMemo(() => {
    const angles: { angle: number; intensity: number }[] = []
    for (let a = 0; a < 360; a += 5) {
      angles.push({
        angle: a,
        intensity: miePhaseFunction(a, sizeParameter),
      })
    }
    return angles
  }, [sizeParameter])

  // 找到最大强度用于归一化
  const maxIntensity = Math.max(...scatterAngles.map((s) => s.intensity))

  // 生成散射图形路径
  const scatterPath = useMemo(() => {
    const cx = 300
    const cy = 200
    const maxRadius = 120

    const points = scatterAngles.map((s) => {
      const normalizedIntensity = s.intensity / maxIntensity
      const r = 30 + normalizedIntensity * maxRadius
      const rad = ((s.angle - 90) * Math.PI) / 180
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
      }
    })

    let path = `M ${points[0].x},${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x},${points[i].y}`
    }
    path += ' Z'

    return path
  }, [scatterAngles, maxIntensity])

  // 判断散射类型
  const getScatterType = () => {
    if (sizeParameter < 0.1) return { type: '瑞利散射', color: '#22d3ee' }
    if (sizeParameter < 10) return { type: '米氏散射', color: '#f472b6' }
    return { type: '几何光学', color: '#fbbf24' }
  }

  const scatterType = getScatterType()

  return (
    <svg viewBox="0 0 600 400" className="w-full h-auto">
      <defs>
        <radialGradient id="particleGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#94a3b8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#64748b" stopOpacity="0.3" />
        </radialGradient>
        <filter id="scatterGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect x="0" y="0" width="600" height="400" fill="#0f172a" rx="8" />

      {/* 坐标参考线 */}
      <line x1="50" y1="200" x2="550" y2="200" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      <line x1="300" y1="50" x2="300" y2="350" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

      {/* 入射光 */}
      <motion.line
        x1="50"
        y1="200"
        x2="270"
        y2="200"
        stroke={lightColor}
        strokeWidth="6"
        filter="url(#scatterGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <polygon points="265,195 275,200 265,205" fill={lightColor} />
      <text x="80" y="180" fill={lightColor} fontSize="12">入射光 λ={wavelength}nm</text>

      {/* 散射强度分布（极坐标图） */}
      <motion.path
        d={scatterPath}
        fill={scatterType.color}
        fillOpacity="0.2"
        stroke={scatterType.color}
        strokeWidth="2"
        filter="url(#scatterGlow)"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* 粒子 */}
      <motion.circle
        cx="300"
        cy="200"
        r={Math.max(5, Math.min(30, particleSize * 20))}
        fill="url(#particleGradient)"
        stroke="#94a3b8"
        strokeWidth="2"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 前向散射标注 */}
      <g transform="translate(450, 200)">
        <line x1="0" y1="0" x2="60" y2="0" stroke={scatterType.color} strokeWidth="2" />
        <polygon points="55,-5 65,0 55,5" fill={scatterType.color} />
        <text x="30" y="-15" textAnchor="middle" fill={scatterType.color} fontSize="11">前向散射</text>
      </g>

      {/* 后向散射标注 */}
      <g transform="translate(150, 200)">
        <line x1="0" y1="0" x2="-60" y2="0" stroke={scatterType.color} strokeWidth="1" opacity="0.5" />
        <text x="-30" y="-15" textAnchor="middle" fill="#94a3b8" fontSize="11">后向散射</text>
      </g>

      {/* 角度标注 */}
      {[0, 45, 90, 135, 180].map((angle) => {
        const rad = ((angle - 90) * Math.PI) / 180
        const r = 140
        const x = 300 + r * Math.cos(rad)
        const y = 200 + r * Math.sin(rad)
        return (
          <text
            key={angle}
            x={x}
            y={y}
            textAnchor="middle"
            fill="#64748b"
            fontSize="10"
          >
            {angle}°
          </text>
        )
      })}

      {/* 散射类型标识 */}
      <g transform="translate(300, 360)">
        <rect x="-80" y="-15" width="160" height="30" fill="rgba(30,41,59,0.9)" rx="6" stroke={scatterType.color} strokeWidth="1" />
        <text x="0" y="5" textAnchor="middle" fill={scatterType.color} fontSize="14" fontWeight="500">
          {scatterType.type}
        </text>
      </g>

      {/* 尺寸参数显示 */}
      <g transform="translate(50, 360)">
        <text x="0" y="0" fill="#94a3b8" fontSize="12">
          尺寸参数 x = 2πr/λ = {sizeParameter.toFixed(2)}
        </text>
      </g>

      {/* 粒子尺寸比较 */}
      <g transform="translate(480, 80)">
        <rect x="-40" y="-15" width="110" height="90" fill="rgba(30,41,59,0.8)" rx="6" />
        <text x="15" y="5" textAnchor="middle" fill="#94a3b8" fontSize="10">尺寸比较</text>

        {/* 粒子 */}
        <circle cx="15" cy="35" r={Math.max(3, Math.min(15, particleSize * 10))} fill="#94a3b8" />
        <text x="15" y="60" textAnchor="middle" fill="#64748b" fontSize="9">r={particleSize.toFixed(2)}μm</text>

        {/* 波长指示 */}
        <line x1="-20" y1="35" x2="50" y2="35" stroke={lightColor} strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      </g>
    </svg>
  )
}

// 尺寸参数效应图
function SizeParameterChart({
  currentSize,
  wavelength,
}: {
  currentSize: number
  wavelength: number
}) {
  const currentX = (2 * Math.PI * currentSize * 1000) / wavelength

  const { pathData, regions } = useMemo(() => {
    const points: string[] = []

    for (let x = 0.01; x <= 20; x += 0.1) {
      const intensity = mieIntensity(x)
      const chartX = 40 + (Math.log10(x) + 2) * 55 // 对数刻度
      const chartY = 130 - intensity * 30

      points.push(`${x < 0.02 ? 'M' : 'L'} ${chartX},${chartY}`)
    }

    return {
      pathData: points.join(' '),
      regions: [
        { name: '瑞利', xStart: 0.01, xEnd: 0.1, color: '#22d3ee' },
        { name: '米氏', xStart: 0.1, xEnd: 10, color: '#f472b6' },
        { name: '几何', xStart: 10, xEnd: 20, color: '#fbbf24' },
      ],
    }
  }, [])

  // 当前点的X坐标（对数刻度）
  const currentChartX = 40 + (Math.log10(Math.max(0.01, currentX)) + 2) * 55
  const currentIntensity = mieIntensity(currentX)
  const currentChartY = 130 - currentIntensity * 30

  return (
    <svg viewBox="0 0 300 160" className="w-full h-auto">
      {/* 背景区域 */}
      {regions.map((region) => {
        const x1 = 40 + (Math.log10(region.xStart) + 2) * 55
        const x2 = 40 + (Math.log10(region.xEnd) + 2) * 55
        return (
          <rect
            key={region.name}
            x={Math.max(40, x1)}
            y="30"
            width={Math.min(x2 - x1, 260 - x1 + 40)}
            height="100"
            fill={region.color}
            opacity="0.1"
          />
        )
      })}

      <rect x="40" y="30" width="220" height="100" fill="transparent" stroke="#374151" strokeWidth="1" rx="4" />

      {/* 坐标轴 */}
      <line x1="40" y1="130" x2="270" y2="130" stroke="#475569" strokeWidth="1" />
      <line x1="40" y1="30" x2="40" y2="130" stroke="#475569" strokeWidth="1" />

      {/* X轴刻度（对数） */}
      {[0.01, 0.1, 1, 10].map((x) => {
        const chartX = 40 + (Math.log10(x) + 2) * 55
        return (
          <g key={x}>
            <line x1={chartX} y1="130" x2={chartX} y2="135" stroke="#94a3b8" strokeWidth="1" />
            <text x={chartX} y="147" textAnchor="middle" fill="#94a3b8" fontSize="9">{x}</text>
          </g>
        )
      })}

      {/* 区域标签 */}
      {regions.map((region) => {
        const x = 40 + (Math.log10(Math.sqrt(region.xStart * region.xEnd)) + 2) * 55
        return (
          <text key={region.name} x={x} y="45" textAnchor="middle" fill={region.color} fontSize="9">
            {region.name}
          </text>
        )
      })}

      {/* 效率曲线 */}
      <path d={pathData} fill="none" stroke="#ffffff" strokeWidth="2" />

      {/* 当前点 */}
      <motion.circle
        cx={currentChartX}
        cy={currentChartY}
        r="6"
        fill="#fbbf24"
        animate={{ cx: currentChartX, cy: currentChartY }}
        transition={{ duration: 0.2 }}
      />

      {/* 轴标签 */}
      <text x="155" y="158" textAnchor="middle" fill="#94a3b8" fontSize="10">尺寸参数 x</text>
      <text x="15" y="85" fill="#94a3b8" fontSize="9" transform="rotate(-90 15 85)">Q</text>
    </svg>
  )
}

// 主演示组件
export function MieScatteringDemo() {
  const [particleSize, setParticleSize] = useState(0.5) // μm
  const [wavelength, setWavelength] = useState(550) // nm

  // 尺寸参数
  const sizeParameter = (2 * Math.PI * particleSize * 1000) / wavelength

  // 散射类型判断
  const getScatterInfo = () => {
    if (sizeParameter < 0.1) {
      return {
        type: '瑞利散射区',
        description: '粒径远小于波长，散射强度∝λ⁻⁴',
        color: 'cyan',
      }
    }
    if (sizeParameter < 10) {
      return {
        type: '米氏散射区',
        description: '粒径与波长可比，前向散射增强',
        color: 'pink',
      }
    }
    return {
      type: '几何光学区',
      description: '粒径远大于波长，可用几何光学描述',
      color: 'orange',
    }
  }

  const scatterInfo = getScatterInfo()

  // 粒子预设
  const presets = [
    { name: '空气分子', size: 0.001, λ: 550 },
    { name: '烟雾颗粒', size: 0.1, λ: 550 },
    { name: '花粉', size: 0.5, λ: 550 },
    { name: '云滴', size: 5, λ: 550 },
  ]

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
          米氏散射交互演示
        </h2>
        <p className="text-gray-400 mt-1">
          探索粒径与波长可比时的散射特性
        </p>
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-pink-950/90 border border-pink-500/30 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <MieScatteringDiagram particleSize={particleSize} wavelength={wavelength} />
          </div>

          {/* 散射特征摘要 */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-600/30 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900/50 rounded-lg text-center">
                <div className="text-gray-500 text-xs mb-1">尺寸参数 x</div>
                <div className={`font-mono text-xl text-${scatterInfo.color}-400`}>
                  {sizeParameter.toFixed(3)}
                </div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg text-center">
                <div className="text-gray-500 text-xs mb-1">散射区域</div>
                <div className={`font-bold text-lg text-${scatterInfo.color}-400`}>
                  {scatterInfo.type}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              {scatterInfo.description}
            </p>
          </div>
        </div>

        {/* 右侧：控制与学习 */}
        <div className="space-y-4">
          {/* 参数控制 */}
          <ControlPanel title="参数控制">
            <SliderControl
              label="粒子半径 r"
              value={particleSize}
              min={0.001}
              max={5}
              step={0.001}
              unit=" μm"
              onChange={setParticleSize}
              formatValue={(v) => v.toFixed(3)}
              color="purple"
            />
            <SliderControl
              label="波长 λ"
              value={wavelength}
              min={400}
              max={700}
              step={10}
              unit=" nm"
              onChange={setWavelength}
              color="cyan"
            />

            {/* 粒子预设 */}
            <div className="pt-2">
              <div className="text-xs text-gray-500 mb-2">典型粒子</div>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => { setParticleSize(p.size); setWavelength(p.λ) }}
                    className="px-2 py-1.5 text-xs bg-slate-700/50 text-gray-300 rounded hover:bg-slate-600 transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </ControlPanel>

          {/* 计算结果 */}
          <ControlPanel title="物理参数">
            <div className="space-y-3">
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">尺寸参数公式</div>
                <div className="font-mono text-sm text-white">
                  x = 2πr/λ = 2π × {particleSize.toFixed(3)} × 1000 / {wavelength}
                </div>
                <div className={`font-mono text-lg text-${scatterInfo.color}-400 mt-1`}>
                  x = {sizeParameter.toFixed(4)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-900/50 rounded-lg">
                  <div className="text-gray-500">粒径/波长</div>
                  <div className="text-cyan-400 font-mono">{((particleSize * 1000) / wavelength).toFixed(3)}</div>
                </div>
                <div className="p-2 bg-slate-900/50 rounded-lg">
                  <div className="text-gray-500">散射效率</div>
                  <div className="text-pink-400 font-mono">{mieIntensity(sizeParameter).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </ControlPanel>

          {/* 尺寸参数效应图 */}
          <ControlPanel title="散射区域划分">
            <SizeParameterChart currentSize={particleSize} wavelength={wavelength} />
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <span className="text-cyan-400">x&lt;0.1 瑞利</span>
              <span className="text-pink-400">0.1≤x≤10 米氏</span>
              <span className="text-orange-400">x&gt;10 几何</span>
            </div>
          </ControlPanel>

          {/* 散射特征 */}
          <ControlPanel title="米氏散射特征">
            <ul className="text-xs text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-pink-400">•</span>
                <span>前向散射增强：大粒子的散射光主要集中在前进方向</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400">•</span>
                <span>散射与波长弱相关：云和雾呈白色（各波长散射相近）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400">•</span>
                <span>散射图案复杂：存在多个散射瓣和干涉效应</span>
              </li>
            </ul>
          </ControlPanel>
        </div>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="米氏散射理论" color="purple">
          <p className="text-xs text-gray-300">
            由Gustav Mie在1908年发展，完整描述球形粒子对电磁波的散射。适用于粒径与波长可比的情况(x≈1-10)。
          </p>
        </InfoCard>
        <InfoCard title="前向散射" color="cyan">
          <p className="text-xs text-gray-300">
            米氏散射的显著特征是前向散射增强。粒子越大，散射越集中在前进方向，形成尖锐的前向散射峰。
          </p>
        </InfoCard>
        <InfoCard title="自然现象" color="orange">
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• 云和雾的白色</li>
            <li>• 牛奶的乳白色</li>
            <li>• 日晕和虹</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
