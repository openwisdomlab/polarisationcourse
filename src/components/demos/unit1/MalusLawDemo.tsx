/**
 * 马吕斯定律交互演示 - DOM + SVG + Framer Motion 版本
 * I = I₀ × cos²(θ)
 * 参考设计：高级玻璃态UI风格
 */
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'

// 光强条组件
function LightBar({
  label,
  intensity,
  color,
  showValue = true,
}: {
  label: string
  intensity: number
  color: 'blue' | 'orange'
  showValue?: boolean
}) {
  const colors = {
    blue: {
      gradient: 'linear-gradient(90deg, rgba(132,194,255,0.1), rgba(104,171,255,0.8), rgba(42,118,255,0.95))',
      glow: 'rgba(76,142,255,0.6)',
    },
    orange: {
      gradient: 'linear-gradient(90deg, rgba(255,195,156,0.08), rgba(255,153,102,0.82), rgba(255,96,96,0.9))',
      glow: 'rgba(255,145,108,0.7)',
    },
  }

  const colorSet = colors[color]

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        <span className="w-8 font-mono text-sm text-blue-200">{label}</span>
        <div className="flex-1 h-5 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border border-blue-500/30 overflow-hidden relative shadow-inner">
          <motion.div
            className="absolute inset-[2px] rounded-full"
            style={{
              background: colorSet.gradient,
              boxShadow: `0 0 14px ${colorSet.glow}`,
            }}
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: Math.max(0.05, intensity),
              opacity: Math.max(0.2, intensity),
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>
      {showValue && (
        <div className="text-xs text-gray-400 ml-11">
          {color === 'orange' ? `透射光强 I ≈ ${intensity.toFixed(3)}（相对值）` : ''}
        </div>
      )}
    </div>
  )
}

// 偏振片组件
function PolarizerCircle({
  angle,
  label,
  sublabel,
  isBase = false,
}: {
  angle: number
  label: string
  sublabel: string
  isBase?: boolean
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-400 mb-2">{label}</span>
      <span className="text-[10px] text-gray-500 mb-2">{sublabel}</span>
      <div className="relative w-24 h-24 rounded-full border border-blue-500/40 bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-[0_0_15px_rgba(60,105,240,0.3),inset_0_0_15px_rgba(0,0,0,0.7)] flex items-center justify-center">
        {/* 透光轴 */}
        <motion.div
          className="absolute w-[2px] h-[70px] rounded-full"
          style={{
            background: isBase
              ? 'linear-gradient(180deg, rgba(200,211,255,0.9), rgba(84,144,255,0.9))'
              : 'linear-gradient(180deg, rgba(192,132,252,0.9), rgba(139,92,246,0.9))',
            boxShadow: isBase
              ? '0 0 8px rgba(111,153,255,0.85)'
              : '0 0 8px rgba(167,139,250,0.85)',
          }}
          animate={{ rotate: angle }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
        {/* 角度显示 */}
        <motion.div
          className="absolute bottom-2 text-[10px] text-blue-100 font-mono"
          key={angle}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          θ = {angle.toFixed(1)}°
        </motion.div>
      </div>
    </div>
  )
}

// SVG 曲线图组件
function MalusCurveChart({ currentAngle, intensity }: { currentAngle: number; intensity: number }) {
  // 生成 cos² 曲线路径
  const curvePath = useMemo(() => {
    const points: string[] = []
    for (let theta = 0; theta <= 180; theta += 2) {
      const x = 30 + (theta / 180) * 240
      const y = 130 - Math.pow(Math.cos((theta * Math.PI) / 180), 2) * 100
      points.push(`${theta === 0 ? 'M' : 'L'} ${x},${y}`)
    }
    return points.join(' ')
  }, [])

  // 当前点位置
  const pointX = 30 + (currentAngle / 180) * 240
  const pointY = 130 - intensity * 100

  return (
    <svg viewBox="0 0 300 160" className="w-full h-auto">
      {/* 坐标轴 */}
      <line x1="30" y1="130" x2="280" y2="130" stroke="#d1dcff" strokeWidth="1.2" />
      <line x1="30" y1="130" x2="30" y2="25" stroke="#d1dcff" strokeWidth="1.2" />

      {/* 网格线 */}
      <line x1="30" y1="80" x2="280" y2="80" stroke="rgba(127,150,233,0.25)" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="30" y1="30" x2="280" y2="30" stroke="rgba(127,150,233,0.25)" strokeWidth="0.7" strokeDasharray="3 3" />

      {/* X轴刻度 */}
      {[0, 45, 90, 135, 180].map((theta) => {
        const x = 30 + (theta / 180) * 240
        return (
          <g key={theta}>
            <line x1={x} y1="130" x2={x} y2="135" stroke="#bcc6ff" strokeWidth="0.8" />
            <text x={x} y="148" textAnchor="middle" fill="#d9e0ff" fontSize="10">
              {theta}°
            </text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      {[0, 0.5, 1].map((val, i) => {
        const y = 130 - val * 100
        return (
          <g key={i}>
            <line x1="25" y1={y} x2="30" y2={y} stroke="#bcc6ff" strokeWidth="0.8" />
            <text x="20" y={y + 4} textAnchor="end" fill="#d9e0ff" fontSize="10">
              {val.toFixed(1)}
            </text>
          </g>
        )
      })}

      {/* 曲线 */}
      <path d={curvePath} fill="none" stroke="#4f9ef7" strokeWidth="2.5" />

      {/* 当前点 */}
      <motion.circle
        cx={pointX}
        cy={pointY}
        r="6"
        fill="#ff7e67"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        animate={{ cx: pointX, cy: pointY }}
        transition={{ duration: 0.2 }}
      />

      {/* 点标签 */}
      <motion.text
        x={pointX + 8}
        y={pointY - 8}
        fill="#fce9e5"
        fontSize="10"
        animate={{ x: pointX + 8, y: pointY - 8 }}
        transition={{ duration: 0.2 }}
        style={{
          paintOrder: 'stroke',
          stroke: 'rgba(0,0,0,0.7)',
          strokeWidth: 3,
          strokeLinejoin: 'round',
        }}
      >
        θ={currentAngle.toFixed(0)}°, I/I₀≈{intensity.toFixed(2)}
      </motion.text>

      {/* 轴标题 */}
      <text x="155" y="158" textAnchor="middle" fill="#f0f3ff" fontSize="11">
        θ（度）
      </text>
      <text
        x="12"
        y="80"
        textAnchor="middle"
        fill="#f0f3ff"
        fontSize="11"
        transform="rotate(-90 12 80)"
      >
        I / I₀
      </text>
    </svg>
  )
}

// 解释文本生成
function getExplanation(angle: number): string {
  if (Math.abs(angle) < 5 || Math.abs(angle - 180) < 5) {
    return '两个偏振片几乎平行，透射光强几乎等于 I₀，几乎没有损失。'
  }
  if (Math.abs(angle - 90) < 5) {
    return '两个偏振片接近正交（90°），理论上透射光强趋近 0，几乎看不到光。'
  }
  if (Math.abs(angle - 45) < 5) {
    return '当 θ≈45° 时，cos²θ ≈ 0.5，透射光强大约是一半 I₀。'
  }
  return '随着 θ 增大，从 0°→90°，透射光强单调减小；再从 90°→180° 又逐渐回升。'
}

// 主组件
export function MalusLawDemo() {
  const [angle, setAngle] = useState(30)
  const [incidentIntensity, setIncidentIntensity] = useState(1)
  const [autoPlay, setAutoPlay] = useState(false)
  const [speed, setSpeed] = useState(0.5)

  // 计算透射强度
  const cosTheta = Math.cos((angle * Math.PI) / 180)
  const cos2Theta = cosTheta * cosTheta
  const transmittedIntensity = incidentIntensity * cos2Theta

  // 自动旋转
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setAngle((prev) => {
        let next = prev + speed
        if (next > 180) next -= 180
        return next
      })
    }, 16)

    return () => clearInterval(interval)
  }, [autoPlay, speed])

  return (
    <div className="space-y-6">
      {/* 头部标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
          马吕斯定律交互演示
        </h2>
        <p className="text-gray-400 mt-1">
          I = I₀ · cos²θ —— 线偏振光通过理想偏振片时，透射光强与夹角 θ 的关系
        </p>
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-blue-950/90 border border-blue-500/30 p-5 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <h3 className="text-lg font-semibold text-white mb-4">偏振片与光束可视化</h3>

          {/* 光学装置 */}
          <div className="rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/30 p-4 space-y-4">
            {/* 入射光 */}
            <LightBar label="I₀" intensity={incidentIntensity} color="blue" />

            {/* 偏振片 */}
            <div className="flex justify-around items-center py-4">
              <PolarizerCircle
                angle={0}
                label="第一个偏振片"
                sublabel="（起偏器，参考方向）"
                isBase
              />
              <div className="flex flex-col items-center text-gray-500">
                <motion.div
                  className="w-16 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs mt-1">偏振光</span>
              </div>
              <PolarizerCircle
                angle={angle}
                label="第二个偏振片"
                sublabel="（检偏器，旋转）"
              />
            </div>

            {/* 透射光 */}
            <LightBar label="I" intensity={transmittedIntensity} color="orange" showValue />
          </div>

          {/* 解释框 */}
          <div className="mt-4 p-4 rounded-lg bg-slate-800/70 border border-blue-400/20">
            <h4 className="text-sm font-semibold text-white mb-2">当前物理意义</h4>
            <motion.p
              className="text-sm text-gray-300"
              key={Math.floor(angle / 10)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {getExplanation(angle)}
            </motion.p>
            <p className="text-xs text-gray-500 mt-2">
              这里假设入射光已经是完全线偏振光，且偏振片理想、无吸收。
            </p>
          </div>
        </div>

        {/* 右侧：控制与学习 */}
        <div className="space-y-4">
          {/* 控件 */}
          <ControlPanel title="交互控制">
            <SliderControl
              label="偏振片夹角 θ"
              value={angle}
              min={0}
              max={180}
              step={0.5}
              unit="°"
              onChange={setAngle}
              color="purple"
            />

            <SliderControl
              label="入射光强 I₀（相对值）"
              value={incidentIntensity}
              min={0.1}
              max={1}
              step={0.01}
              onChange={setIncidentIntensity}
              color="blue"
            />

            <div className="flex items-center gap-4 pt-2">
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  autoPlay
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_8px_20px_rgba(239,87,74,0.5)]'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_8px_20px_rgba(25,96,230,0.5)]'
                }`}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAutoPlay(!autoPlay)}
              >
                {autoPlay ? '暂停自动旋转' : '开始自动旋转'}
              </motion.button>

              <div className="flex-1">
                <SliderControl
                  label="旋转速度"
                  value={speed}
                  min={0.1}
                  max={2}
                  step={0.1}
                  unit="°/帧"
                  onChange={setSpeed}
                  color="orange"
                />
              </div>
            </div>
          </ControlPanel>

          {/* 公式与实时计算 */}
          <ControlPanel title="马吕斯定律公式 & 实时计算">
            <div className="text-center py-2">
              <span className="font-mono text-lg bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                I = I₀ · cos²θ
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div className="text-gray-400">
                I₀ = <span className="text-cyan-400 font-mono">{incidentIntensity.toFixed(3)}</span>
              </div>
              <div className="text-gray-400">
                θ = <span className="text-purple-400 font-mono">{angle.toFixed(2)}°</span>
              </div>
              <div className="text-gray-400">
                cos θ ≈ <span className="text-cyan-400 font-mono">{cosTheta.toFixed(4)}</span>
              </div>
              <div className="text-gray-400">
                cos²θ ≈ <span className="text-cyan-400 font-mono">{cos2Theta.toFixed(4)}</span>
              </div>
              <div className="col-span-2 text-gray-400 pt-1 border-t border-slate-700 mt-1">
                I = I₀ · cos²θ ≈{' '}
                <span className="text-orange-400 font-mono font-semibold">
                  {incidentIntensity.toFixed(3)} × {cos2Theta.toFixed(4)} = {transmittedIntensity.toFixed(4)}
                </span>
              </div>
              <div className="col-span-2 text-gray-400">
                透射比 I/I₀ = cos²θ ≈{' '}
                <span className="text-orange-400 font-mono font-semibold">{cos2Theta.toFixed(4)}</span>
              </div>
            </div>
          </ControlPanel>

          {/* 曲线图 */}
          <ControlPanel title="函数曲线：I/I₀ = cos²θ">
            <MalusCurveChart currentAngle={angle} intensity={cos2Theta} />
            <p className="text-xs text-gray-400 mt-2">
              横轴为角度 θ（0°–180°），纵轴为透射比 I/I₀。红点表示当前 θ 所对应的瞬时光强位置。
            </p>
          </ControlPanel>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
        <p className="text-sm text-gray-400">
          <strong className="text-cyan-400">学习提示：</strong>
          可以先猜测 θ=0°、45°、90° 时的透射光强，再通过拖动滑块验证，并观察曲线形状，加深对 cos²θ 关系的理解。
        </p>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="马吕斯定律" color="cyan">
          <p className="text-xs text-gray-300">
            当线偏振光通过偏振片时，透射光强 I = I₀cos²θ，其中 θ 为偏振方向与透光轴的夹角。
          </p>
        </InfoCard>
        <InfoCard title="应用场景" color="purple">
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• 偏光太阳镜减少眩光</li>
            <li>• LCD显示器的亮度控制</li>
            <li>• 摄影中的偏振滤镜</li>
          </ul>
        </InfoCard>
        <InfoCard title="特殊角度" color="orange">
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• θ = 0°: I = I₀ (完全透过)</li>
            <li>• θ = 45°: I = I₀/2 (半透过)</li>
            <li>• θ = 90°: I = 0 (完全阻挡)</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
