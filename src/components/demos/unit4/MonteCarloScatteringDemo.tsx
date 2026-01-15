/**
 * 蒙特卡洛散射演示 - Unit 4
 * 演示光子在浑浊介质中的多次散射传输
 * 采用Monte Carlo方法模拟光子随机行走
 */
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { Play, Pause, RotateCcw } from 'lucide-react'

// 光子状态
interface Photon {
  id: number
  x: number
  y: number
  dirX: number
  dirY: number
  weight: number
  polarization: number // 偏振角度 0-180
  scattered: number // 散射次数
  history: { x: number; y: number }[]
  alive: boolean
}

// 散射相函数 - Henyey-Greenstein
function henyeyGreenstein(g: number): number {
  if (Math.abs(g) < 0.01) {
    // 各向同性散射
    return Math.acos(2 * Math.random() - 1)
  }
  const xi = Math.random()
  const cosTheta = (1 / (2 * g)) * (1 + g * g - Math.pow((1 - g * g) / (1 - g + 2 * g * xi), 2))
  return Math.acos(Math.max(-1, Math.min(1, cosTheta)))
}

// 创建新光子
function createPhoton(id: number, entryY: number): Photon {
  return {
    id,
    x: 0,
    y: entryY,
    dirX: 1,
    dirY: 0,
    weight: 1,
    polarization: 0, // 初始水平偏振
    scattered: 0,
    history: [{ x: 0, y: entryY }],
    alive: true,
  }
}

// 模拟一步光子传输
function stepPhoton(
  photon: Photon,
  meanFreePath: number,
  g: number, // 各向异性因子
  albedo: number, // 单次散射反照率
  mediumWidth: number,
  mediumHeight: number
): Photon {
  if (!photon.alive) return photon

  // 随机步长（指数分布）
  const stepLength = -meanFreePath * Math.log(Math.random())

  // 移动光子
  const newX = photon.x + photon.dirX * stepLength
  const newY = photon.y + photon.dirY * stepLength

  // 检查是否离开介质
  if (newX > mediumWidth || newX < 0 || newY > mediumHeight || newY < -mediumHeight / 2) {
    return {
      ...photon,
      x: newX,
      y: newY,
      alive: false,
      history: [...photon.history, { x: newX, y: newY }],
    }
  }

  // 散射事件
  if (Math.random() > albedo) {
    // 吸收
    return {
      ...photon,
      x: newX,
      y: newY,
      weight: 0,
      alive: false,
      history: [...photon.history, { x: newX, y: newY }],
    }
  }

  // 散射角度（Henyey-Greenstein相函数）
  const theta = henyeyGreenstein(g)
  const phi = Math.random() * 2 * Math.PI

  // 更新方向
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)
  const cosPhi = Math.cos(phi)

  // 2D简化：只考虑平面内散射
  const newDirX = photon.dirX * cosTheta - photon.dirY * sinTheta * cosPhi
  const newDirY = photon.dirX * sinTheta * cosPhi + photon.dirY * cosTheta

  // 归一化
  const norm = Math.sqrt(newDirX * newDirX + newDirY * newDirY)

  // 偏振变化（简化模型）
  const polarizationChange = (Math.random() - 0.5) * theta * (180 / Math.PI) * 0.5
  const newPolarization = (photon.polarization + polarizationChange + 180) % 180

  return {
    ...photon,
    x: newX,
    y: newY,
    dirX: newDirX / norm,
    dirY: newDirY / norm,
    weight: photon.weight * albedo,
    polarization: newPolarization,
    scattered: photon.scattered + 1,
    history: [...photon.history, { x: newX, y: newY }],
    alive: true,
  }
}

// 偏振角度到颜色
function polarizationToColor(angle: number, alpha: number = 1): string {
  // 0° 红色, 45° 黄色, 90° 绿色, 135° 蓝色
  const hue = (angle * 2) % 360
  return `hsla(${hue}, 70%, 60%, ${alpha})`
}

// 光子轨迹可视化
function PhotonVisualization({
  photons,
  mediumWidth,
  mediumHeight,
  showPolarization,
}: {
  photons: Photon[]
  mediumWidth: number
  mediumHeight: number
  showPolarization: boolean
}) {
  const scale = 500 / mediumWidth
  const offsetX = 50
  const offsetY = 200

  return (
    <svg viewBox="0 0 600 400" className="w-full h-auto">
      <defs>
        <linearGradient id="mediumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#334155" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1e293b" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <polygon points="0,0 6,3 0,6" fill="#22d3ee" />
        </marker>
      </defs>

      {/* 背景 */}
      <rect x="0" y="0" width="600" height="400" fill="#0f172a" rx="8" />

      {/* 介质区域 */}
      <rect
        x={offsetX}
        y={offsetY - mediumHeight * scale / 2}
        width={mediumWidth * scale}
        height={mediumHeight * scale}
        fill="url(#mediumGradient)"
        stroke="#475569"
        strokeWidth="2"
        rx="4"
      />

      {/* 介质标签 */}
      <text
        x={offsetX + mediumWidth * scale / 2}
        y={offsetY - mediumHeight * scale / 2 - 10}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="12"
      >
        浑浊介质
      </text>

      {/* 入射光指示 */}
      <line
        x1="10"
        y1={offsetY}
        x2={offsetX - 5}
        y2={offsetY}
        stroke="#22d3ee"
        strokeWidth="3"
        markerEnd="url(#arrowhead)"
      />
      <text x="20" y={offsetY - 15} fill="#22d3ee" fontSize="10">
        入射光
      </text>

      {/* 光子轨迹 */}
      {photons.map((photon) => (
        <g key={photon.id}>
          {photon.history.length > 1 && (
            <motion.path
              d={`M ${photon.history.map((p) =>
                `${offsetX + p.x * scale},${offsetY + p.y * scale}`
              ).join(' L ')}`}
              fill="none"
              stroke={showPolarization ? polarizationToColor(photon.polarization, 0.6) : '#22d3ee'}
              strokeWidth={1.5}
              strokeOpacity={photon.weight * 0.8}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          {/* 散射点 */}
          {photon.history.slice(1, -1).map((p, i) => (
            <circle
              key={i}
              cx={offsetX + p.x * scale}
              cy={offsetY + p.y * scale}
              r="3"
              fill={showPolarization ? polarizationToColor(photon.polarization) : '#f472b6'}
              opacity={photon.weight * 0.7}
            />
          ))}
          {/* 当前位置 */}
          {photon.alive && (
            <motion.circle
              cx={offsetX + photon.x * scale}
              cy={offsetY + photon.y * scale}
              r="5"
              fill={showPolarization ? polarizationToColor(photon.polarization) : '#fbbf24'}
              filter="url(#glow)"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </g>
      ))}

      {/* 透射/反射区域标签 */}
      <text
        x={offsetX + mediumWidth * scale + 30}
        y={offsetY}
        fill="#22c55e"
        fontSize="11"
        textAnchor="start"
      >
        透射
      </text>
      <text
        x={offsetX - 30}
        y={offsetY + 50}
        fill="#ef4444"
        fontSize="11"
        textAnchor="end"
      >
        反射/后向散射
      </text>

      {/* 偏振色标 */}
      {showPolarization && (
        <g transform="translate(500, 320)">
          <text x="0" y="-10" fill="#94a3b8" fontSize="10" textAnchor="middle">偏振角</text>
          {[0, 45, 90, 135].map((angle, i) => (
            <g key={angle} transform={`translate(${(i - 1.5) * 25}, 0)`}>
              <rect
                x="-10"
                y="0"
                width="20"
                height="15"
                fill={polarizationToColor(angle)}
                rx="2"
              />
              <text x="0" y="25" fill="#94a3b8" fontSize="8" textAnchor="middle">
                {angle}°
              </text>
            </g>
          ))}
        </g>
      )}

      {/* 统计信息 */}
      <g transform="translate(50, 360)">
        <text fill="#94a3b8" fontSize="11">
          活跃光子: {photons.filter(p => p.alive).length} |
          透射: {photons.filter(p => !p.alive && p.x > mediumWidth).length} |
          反射: {photons.filter(p => !p.alive && p.x < 0).length} |
          吸收: {photons.filter(p => !p.alive && p.weight === 0).length}
        </text>
      </g>
    </svg>
  )
}

// 散射统计图
function ScatteringStats({
  photons,
  mediumWidth,
  theme,
}: {
  photons: Photon[]
  mediumWidth: number
  theme: string
}) {
  const stats = useMemo(() => {
    const transmitted = photons.filter(p => !p.alive && p.x >= mediumWidth)
    const reflected = photons.filter(p => !p.alive && p.x <= 0)
    const absorbed = photons.filter(p => !p.alive && p.weight === 0)
    const alive = photons.filter(p => p.alive)

    const avgScattering = photons.length > 0
      ? photons.reduce((sum, p) => sum + p.scattered, 0) / photons.length
      : 0

    const avgPolarization = transmitted.length > 0
      ? transmitted.reduce((sum, p) => sum + p.polarization, 0) / transmitted.length
      : 0

    return {
      total: photons.length,
      transmitted: transmitted.length,
      reflected: reflected.length,
      absorbed: absorbed.length,
      alive: alive.length,
      avgScattering: avgScattering.toFixed(1),
      transmittance: photons.length > 0 ? (transmitted.length / photons.length * 100).toFixed(1) : '0',
      avgPolarization: avgPolarization.toFixed(1),
    }
  }, [photons, mediumWidth])

  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className={`p-2 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'} rounded-lg`}>
        <div className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>透射率</div>
        <div className="text-emerald-400 font-mono text-lg">{stats.transmittance}%</div>
      </div>
      <div className={`p-2 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'} rounded-lg`}>
        <div className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>平均散射次数</div>
        <div className="text-pink-400 font-mono text-lg">{stats.avgScattering}</div>
      </div>
      <div className={`p-2 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'} rounded-lg`}>
        <div className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>透射光偏振角</div>
        <div className="text-cyan-400 font-mono text-lg">{stats.avgPolarization}°</div>
      </div>
      <div className={`p-2 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'} rounded-lg`}>
        <div className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>状态分布</div>
        <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-mono text-sm`}>
          T:{stats.transmitted} R:{stats.reflected} A:{stats.absorbed}
        </div>
      </div>
    </div>
  )
}

// 主演示组件
export function MonteCarloScatteringDemo() {
  const { theme } = useTheme()
  const [meanFreePath, setMeanFreePath] = useState(0.5) // 平均自由程
  const [anisotropy, setAnisotropy] = useState(0.8) // 各向异性因子 g
  const [albedo, setAlbedo] = useState(0.9) // 单次散射反照率
  const [photonCount, setPhotonCount] = useState(50)
  const [showPolarization, setShowPolarization] = useState(true)

  const [photons, setPhotons] = useState<Photon[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const animationRef = useRef<number | undefined>(undefined)

  const mediumWidth = 5 // 介质宽度
  const mediumHeight = 4 // 介质高度

  // 初始化光子
  const initPhotons = useCallback(() => {
    const newPhotons: Photon[] = []
    for (let i = 0; i < photonCount; i++) {
      // 随机入射位置
      const entryY = (Math.random() - 0.5) * mediumHeight * 0.6
      newPhotons.push(createPhoton(i, entryY))
    }
    setPhotons(newPhotons)
    setIsRunning(false)
  }, [photonCount, mediumHeight])

  // 重置
  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    initPhotons()
  }, [initPhotons])

  // 模拟步进
  const step = useCallback(() => {
    setPhotons(prev =>
      prev.map(photon =>
        stepPhoton(photon, meanFreePath, anisotropy, albedo, mediumWidth, mediumHeight)
      )
    )
  }, [meanFreePath, anisotropy, albedo, mediumWidth, mediumHeight])

  // 动画循环
  useEffect(() => {
    if (!isRunning) return

    let lastTime = 0
    const interval = 100 // ms between steps

    const animate = (time: number) => {
      if (time - lastTime > interval) {
        step()
        lastTime = time
      }

      // 检查是否所有光子都已完成
      const aliveCount = photons.filter(p => p.alive).length
      if (aliveCount > 0) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsRunning(false)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, step, photons])

  // 初始化
  useEffect(() => {
    initPhotons()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 切换运行状态
  const toggleRunning = useCallback(() => {
    if (photons.length === 0 || photons.every(p => !p.alive)) {
      initPhotons()
      setIsRunning(true)
    } else {
      setIsRunning(prev => !prev)
    }
  }, [photons, initPhotons])

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold bg-gradient-to-r ${theme === 'dark' ? 'from-white via-cyan-100 to-white' : 'from-cyan-600 via-cyan-500 to-cyan-600'} bg-clip-text text-transparent`}>
          蒙特卡洛散射模拟
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
          光子在浑浊介质中的随机行走与多次散射
        </p>
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="space-y-4">
          <div className={`rounded-xl bg-gradient-to-br ${theme === 'dark' ? 'from-slate-900/90 via-slate-900/95 to-cyan-950/90 border-cyan-500/30' : 'from-white via-gray-50 to-cyan-50 border-cyan-200'} border p-4 ${theme === 'dark' ? 'shadow-[0_15px_40px_rgba(0,0,0,0.5)]' : 'shadow-lg'}`}>
            <PhotonVisualization
              photons={photons}
              mediumWidth={mediumWidth}
              mediumHeight={mediumHeight}
              showPolarization={showPolarization}
            />
          </div>

          {/* 控制按钮 */}
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={toggleRunning}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors ${
                isRunning
                  ? 'bg-orange-600 hover:bg-orange-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              {isRunning ? '暂停' : '开始模拟'}
            </motion.button>
            <motion.button
              onClick={reset}
              className={`px-6 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${theme === 'dark' ? 'text-white' : 'text-gray-700'} flex items-center gap-2 font-medium`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={18} />
              重置
            </motion.button>
          </div>

          {/* 统计信息 */}
          <div className={`rounded-xl bg-gradient-to-br ${theme === 'dark' ? 'from-slate-900/80 to-slate-800/80 border-slate-600/30' : 'from-white to-gray-50 border-gray-200'} border p-4`}>
            <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-3`}>模拟统计</h3>
            <ScatteringStats photons={photons} mediumWidth={mediumWidth} theme={theme} />
          </div>
        </div>

        {/* 右侧：控制与学习 */}
        <div className="space-y-4">
          {/* 参数控制 */}
          <ControlPanel title="介质参数">
            <SliderControl
              label="平均自由程 MFP"
              value={meanFreePath}
              min={0.1}
              max={2}
              step={0.1}
              unit=" (单位长度)"
              onChange={setMeanFreePath}
              color="cyan"
            />
            <SliderControl
              label="各向异性因子 g"
              value={anisotropy}
              min={-0.9}
              max={0.99}
              step={0.05}
              onChange={setAnisotropy}
              formatValue={(v) => v.toFixed(2)}
              color="purple"
            />
            <SliderControl
              label="单次散射反照率 ω"
              value={albedo}
              min={0.5}
              max={1}
              step={0.05}
              onChange={setAlbedo}
              formatValue={(v) => v.toFixed(2)}
              color="green"
            />
            <SliderControl
              label="光子数量"
              value={photonCount}
              min={10}
              max={200}
              step={10}
              onChange={(v) => { setPhotonCount(v); reset(); }}
              color="orange"
            />
          </ControlPanel>

          {/* 显示选项 */}
          <ControlPanel title="显示选项">
            <label className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <input
                type="checkbox"
                checked={showPolarization}
                onChange={(e) => setShowPolarization(e.target.checked)}
                className={`w-4 h-4 rounded ${theme === 'dark' ? 'border-gray-600 bg-slate-800' : 'border-gray-300 bg-white'}`}
              />
              显示偏振状态（颜色编码）
            </label>
          </ControlPanel>

          {/* 参数说明 */}
          <ControlPanel title="参数说明">
            <div className={`space-y-3 text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className={`p-2 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'} rounded-lg`}>
                <span className="text-cyan-400 font-medium">平均自由程 (MFP):</span>
                <p className="mt-1">光子两次散射事件之间的平均距离。值越小，散射越频繁，介质越浑浊。</p>
              </div>
              <div className={`p-2 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'} rounded-lg`}>
                <span className="text-pink-400 font-medium">各向异性因子 (g):</span>
                <p className="mt-1">g=0 各向同性散射，g&gt;0 前向散射为主，g&lt;0 后向散射为主。云滴 g≈0.85。</p>
              </div>
              <div className={`p-2 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'} rounded-lg`}>
                <span className="text-emerald-400 font-medium">单次散射反照率 (ω):</span>
                <p className="mt-1">散射/(散射+吸收)，ω=1 无吸收，ω&lt;1 部分吸收。</p>
              </div>
            </div>
          </ControlPanel>

          {/* MC方法原理 */}
          <ControlPanel title="蒙特卡洛方法原理">
            <ul className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} space-y-2`}>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">1.</span>
                <span>光子从入射面进入介质，初始方向沿入射方向</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">2.</span>
                <span>随机采样步长（指数分布），光子移动到新位置</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">3.</span>
                <span>根据反照率决定散射/吸收，散射方向由相函数决定</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">4.</span>
                <span>重复直到光子离开介质（透射/反射）或被吸收</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">5.</span>
                <span>大量光子统计得到透射率、反照率等宏观量</span>
              </li>
            </ul>
          </ControlPanel>
        </div>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="蒙特卡洛模拟" color="cyan">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Monte Carlo方法通过随机采样模拟物理过程。在光传输中，每个光子独立追踪，大量光子的统计结果收敛于解析解。适用于复杂几何和多次散射。
          </p>
        </InfoCard>
        <InfoCard title="Henyey-Greenstein相函数" color="purple">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            HG相函数 p(θ) = (1-g²)/(1+g²-2g·cosθ)^(3/2) 用单参数g描述散射的方向分布。生物组织典型值 g=0.8-0.95，云滴 g≈0.85。
          </p>
        </InfoCard>
        <InfoCard title="偏振退极化" color="orange">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            多次散射导致偏振态随机化（退极化）。入射偏振光经过多次散射后趋于非偏振。透射光的偏振度与散射次数、各向异性相关。
          </p>
        </InfoCard>
      </div>
    </div>
  )
}
