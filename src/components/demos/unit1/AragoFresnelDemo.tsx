/**
 * 阿拉戈-菲涅尔定律演示 - Unit 1
 * Arago-Fresnel Laws Demonstration
 *
 * 核心原理：
 * 1. 两束正交偏振光无法产生干涉条纹
 * 2. 加入检偏器后，干涉条纹重新出现
 * 3. 连接"波动性"与"矢量性"的关键桥梁
 *
 * 阿拉戈-菲涅尔四定律：
 * 1. 两束同源同向线偏振光可以干涉
 * 2. 两束正交偏振光不能干涉
 * 3. 普通光分出的两束正交偏振光，即使再经偏振片转为同向，也不能干涉（因为非相干）
 * 4. 从偏振光分出的正交分量，经检偏器转为同向后可以干涉
 */
import { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDemoTheme } from '../demoThemeColors'
import { cn } from '@/lib/utils'
import {
  SliderControl,
  ControlPanel,
  InfoCard,
  Toggle,
} from '../DemoControls'
import {
  DemoHeader,
  VisualizationPanel,
  ChartPanel,
  InfoGrid,
  StatCard,
  FormulaHighlight,
} from '../DemoLayout'

// 计算干涉条纹强度
function calculateInterferencePattern(
  x: number,         // 屏幕位置
  wavelength: number, // 波长 (nm)
  slitSeparation: number, // 双缝间距 (μm)
  screenDistance: number, // 屏幕距离 (mm)
  pol1: number,      // 偏振角1 (度)
  pol2: number,      // 偏振角2 (度)
  analyzerAngle: number | null, // 检偏器角度 (null表示无检偏器)
  intensity1: number = 1,
  intensity2: number = 1,
): number {
  // 路径差引起的相位差
  const pathDiff = (slitSeparation * 1e-6) * (x * 1e-3) / (screenDistance * 1e-3)
  const phaseDiff = (2 * Math.PI * pathDiff) / (wavelength * 1e-9)

  // 偏振角转弧度
  const theta1 = pol1 * Math.PI / 180
  const theta2 = pol2 * Math.PI / 180

  if (analyzerAngle === null) {
    // 无检偏器时，计算直接叠加
    // 干涉项只在偏振有重叠时出现
    // I = I1 + I2 + 2√(I1·I2)·cos(δ)·cos²((θ1-θ2)/2)
    const coherenceFactor = Math.cos((theta1 - theta2) / 2) ** 2
    const interference = 2 * Math.sqrt(intensity1 * intensity2) * Math.cos(phaseDiff) * coherenceFactor

    return intensity1 + intensity2 + interference
  } else {
    // 有检偏器时，先投影到检偏器方向，再干涉
    const analyzerRad = analyzerAngle * Math.PI / 180

    // 两束光通过检偏器后的振幅
    const amp1 = Math.sqrt(intensity1) * Math.cos(theta1 - analyzerRad)
    const amp2 = Math.sqrt(intensity2) * Math.cos(theta2 - analyzerRad)

    // 完全相干干涉
    // I = |E1 + E2|² = A1² + A2² + 2·A1·A2·cos(δ)
    return amp1 * amp1 + amp2 * amp2 + 2 * amp1 * amp2 * Math.cos(phaseDiff)
  }
}

// 干涉条纹可见度计算
function calculateVisibility(
  pol1: number,
  pol2: number,
  analyzerAngle: number | null,
): number {
  const theta1 = pol1 * Math.PI / 180
  const theta2 = pol2 * Math.PI / 180

  if (analyzerAngle === null) {
    // 无检偏器：可见度 = |cos(θ1 - θ2)|
    return Math.abs(Math.cos(theta1 - theta2))
  } else {
    // 有检偏器：取决于两束光投影到检偏器方向的分量
    const analyzerRad = analyzerAngle * Math.PI / 180
    const amp1 = Math.abs(Math.cos(theta1 - analyzerRad))
    const amp2 = Math.abs(Math.cos(theta2 - analyzerRad))

    if (amp1 + amp2 < 0.01) return 0
    return (2 * amp1 * amp2) / (amp1 * amp1 + amp2 * amp2)
  }
}

// 干涉图样Canvas组件
function InterferencePattern({
  pol1,
  pol2,
  analyzerAngle,
  wavelength,
  slitSeparation,
  screenDistance,
  showAnalyzer,
}: {
  pol1: number
  pol2: number
  analyzerAngle: number
  wavelength: number
  slitSeparation: number
  screenDistance: number
  showAnalyzer: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dt = useDemoTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 400
    const height = 150
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // 清除背景
    ctx.fillStyle = dt.canvasBg
    ctx.fillRect(0, 0, width, height)

    // 计算干涉图样
    const effectiveAnalyzer = showAnalyzer ? analyzerAngle : null
    const intensities: number[] = []
    let maxI = 0

    for (let x = 0; x < width; x++) {
      const screenX = (x - width / 2) * 0.05 // 转换为mm
      const I = calculateInterferencePattern(
        screenX, wavelength, slitSeparation, screenDistance,
        pol1, pol2, effectiveAnalyzer
      )
      intensities.push(I)
      if (I > maxI) maxI = I
    }

    // 归一化并绘制
    if (maxI > 0) {
      for (let x = 0; x < width; x++) {
        const normalizedI = intensities[x] / maxI
        const brightness = Math.min(255, Math.floor(normalizedI * 255))

        // 根据波长着色
        const hue = 240 - ((wavelength - 380) / 400) * 240 // 蓝到红
        ctx.fillStyle = `hsl(${hue}, 80%, ${brightness * 50 / 255}%)`
        ctx.fillRect(x, 0, 1, height)
      }
    }

    // 绘制中心标记
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.stroke()
    ctx.setLineDash([])

    // 可见度文字
    const visibility = calculateVisibility(pol1, pol2, effectiveAnalyzer)
    ctx.fillStyle = '#fff'
    ctx.font = '12px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`V = ${(visibility * 100).toFixed(1)}%`, width - 10, 20)

  }, [pol1, pol2, analyzerAngle, wavelength, slitSeparation, screenDistance, showAnalyzer, dt.isDark])

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg"
      style={{ width: 400, height: 150 }}
    />
  )
}

// 光路示意图SVG
function OpticalSetupDiagram({
  pol1,
  pol2,
  analyzerAngle,
  showAnalyzer,
  animate,
}: {
  pol1: number
  pol2: number
  analyzerAngle: number
  showAnalyzer: boolean
  animate: boolean
}) {
  const dt = useDemoTheme()
  const timeRef = useRef(0)

  useEffect(() => {
    if (animate) {
      const interval = setInterval(() => {
        timeRef.current += 1
      }, 50)
      return () => clearInterval(interval)
    }
    return undefined
  }, [animate])

  return (
    <svg viewBox="0 0 600 200" className="w-full h-auto">
      <defs>
        <filter id="glowAF" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="beamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="beamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4ecdc4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4ecdc4" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* 背景 */}
      <rect x="0" y="0" width="600" height="200" fill={dt.canvasBg} rx="8" />

      {/* 光源 */}
      <motion.circle
        cx="40"
        cy="100"
        r="15"
        fill="#fbbf24"
        filter="url(#glowAF)"
        animate={animate ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <text x="40" y="135" textAnchor="middle" fill={dt.textSecondary} fontSize="10">偏振光源</text>

      {/* 双缝 */}
      <rect x="140" y="20" width="10" height="60" fill={dt.axisColor} />
      <rect x="140" y="120" width="10" height="60" fill={dt.axisColor} />
      <rect x="142" y="80" width="6" height="15" fill={dt.detectorFill} /> {/* 上缝 */}
      <rect x="142" y="105" width="6" height="15" fill={dt.detectorFill} /> {/* 下缝 */}
      <text x="145" y="195" textAnchor="middle" fill={dt.textSecondary} fontSize="10">双缝</text>

      {/* 偏振片1和2（在双缝后） */}
      <g>
        {/* 上缝偏振片 */}
        <rect x="170" y="72" width="5" height="25" fill="rgba(255, 107, 107, 0.3)" stroke="#ff6b6b" strokeWidth="1" />
        <line
          x1="172.5"
          y1="72"
          x2="172.5"
          y2="97"
          stroke="#ff6b6b"
          strokeWidth="2"
          transform={`rotate(${pol1}, 172.5, 84.5)`}
        />
        <text x="172.5" y="65" textAnchor="middle" fill="#ff6b6b" fontSize="10">P1: {pol1}deg</text>

        {/* 下缝偏振片 */}
        <rect x="170" y="103" width="5" height="25" fill="rgba(78, 205, 196, 0.3)" stroke="#4ecdc4" strokeWidth="1" />
        <line
          x1="172.5"
          y1="103"
          x2="172.5"
          y2="128"
          stroke="#4ecdc4"
          strokeWidth="2"
          transform={`rotate(${pol2}, 172.5, 115.5)`}
        />
        <text x="172.5" y="140" textAnchor="middle" fill="#4ecdc4" fontSize="10">P2: {pol2}deg</text>
      </g>

      {/* 光束1 (上缝) */}
      <motion.line
        x1="55"
        y1="100"
        x2="140"
        y2="87"
        stroke="#fbbf24"
        strokeWidth="3"
        strokeOpacity="0.6"
      />
      <motion.line
        x1="175"
        y1="87"
        x2={showAnalyzer ? 380 : 550}
        y2="100"
        stroke="url(#beamGrad1)"
        strokeWidth="3"
        animate={animate ? { strokeDashoffset: [0, -20] } : {}}
        strokeDasharray="10 5"
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      />

      {/* 光束2 (下缝) */}
      <motion.line
        x1="55"
        y1="100"
        x2="140"
        y2="113"
        stroke="#fbbf24"
        strokeWidth="3"
        strokeOpacity="0.6"
      />
      <motion.line
        x1="175"
        y1="113"
        x2={showAnalyzer ? 380 : 550}
        y2="100"
        stroke="url(#beamGrad2)"
        strokeWidth="3"
        animate={animate ? { strokeDashoffset: [0, -20] } : {}}
        strokeDasharray="10 5"
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      />

      {/* 检偏器（可选） */}
      {showAnalyzer && (
        <g>
          <rect x="380" y="60" width="8" height="80" fill="rgba(167, 139, 250, 0.3)" stroke="#a78bfa" strokeWidth="2" rx="2" />
          <line
            x1="384"
            y1="60"
            x2="384"
            y2="140"
            stroke="#a78bfa"
            strokeWidth="3"
            transform={`rotate(${analyzerAngle}, 384, 100)`}
          />
          <text x="384" y="50" textAnchor="middle" fill="#a78bfa" fontSize="10">检偏器: {analyzerAngle}deg</text>

          {/* 检偏器后的光束 */}
          <motion.line
            x1="388"
            y1="100"
            x2="550"
            y2="100"
            stroke="#a78bfa"
            strokeWidth="3"
            strokeOpacity="0.7"
            animate={animate ? { strokeDashoffset: [0, -20] } : {}}
            strokeDasharray="10 5"
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          />
        </g>
      )}

      {/* 屏幕 */}
      <rect x="550" y="40" width="10" height="120" fill={dt.detectorFill} stroke={dt.axisColor} strokeWidth="1" rx="2" />
      <text x="555" y="175" textAnchor="middle" fill={dt.textSecondary} fontSize="10">屏幕</text>

      {/* 偏振状态说明 */}
      <g transform="translate(480, 15)">
        <rect x="0" y="0" width="110" height="55" fill={dt.infoPanelBg} rx="4" stroke={dt.infoPanelStroke} />
        <text x="10" y="15" fill={dt.textSecondary} fontSize="10">偏振状态:</text>
        <line x1="10" y1="28" x2="30" y2="28" stroke="#ff6b6b" strokeWidth="2" />
        <text x="35" y="31" fill="#ff6b6b" fontSize="10">光束1 ({pol1}deg)</text>
        <line x1="10" y1="43" x2="30" y2="43" stroke="#4ecdc4" strokeWidth="2" />
        <text x="35" y="46" fill="#4ecdc4" fontSize="10">光束2 ({pol2}deg)</text>
      </g>
    </svg>
  )
}

// 偏振矢量可视化
function PolarizationVectorDiagram({
  pol1,
  pol2,
  analyzerAngle,
  showAnalyzer,
}: {
  pol1: number
  pol2: number
  analyzerAngle: number
  showAnalyzer: boolean
}) {
  const dt = useDemoTheme()
  return (
    <svg viewBox="0 0 200 200" className="w-full h-auto">
      <defs>
        <marker id="arrowRed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff6b6b" />
        </marker>
        <marker id="arrowCyan" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#4ecdc4" />
        </marker>
        <marker id="arrowPurple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
        </marker>
      </defs>

      {/* 背景和坐标轴 */}
      <circle cx="100" cy="100" r="80" fill={dt.detectorFill} stroke={dt.axisColor} strokeWidth="1" />
      <line x1="20" y1="100" x2="180" y2="100" stroke={dt.axisColor} strokeWidth="1" />
      <line x1="100" y1="20" x2="100" y2="180" stroke={dt.axisColor} strokeWidth="1" />

      {/* 偏振矢量1 */}
      <line
        x1="100"
        y1="100"
        x2={100 + 60 * Math.cos(pol1 * Math.PI / 180)}
        y2={100 - 60 * Math.sin(pol1 * Math.PI / 180)}
        stroke="#ff6b6b"
        strokeWidth="3"
        markerEnd="url(#arrowRed)"
      />

      {/* 偏振矢量2 */}
      <line
        x1="100"
        y1="100"
        x2={100 + 60 * Math.cos(pol2 * Math.PI / 180)}
        y2={100 - 60 * Math.sin(pol2 * Math.PI / 180)}
        stroke="#4ecdc4"
        strokeWidth="3"
        markerEnd="url(#arrowCyan)"
      />

      {/* 检偏器方向 */}
      {showAnalyzer && (
        <>
          <line
            x1={100 - 80 * Math.cos(analyzerAngle * Math.PI / 180)}
            y1={100 + 80 * Math.sin(analyzerAngle * Math.PI / 180)}
            x2={100 + 80 * Math.cos(analyzerAngle * Math.PI / 180)}
            y2={100 - 80 * Math.sin(analyzerAngle * Math.PI / 180)}
            stroke="#a78bfa"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          {/* 投影到检偏器方向 */}
          <line
            x1="100"
            y1="100"
            x2={100 + 50 * Math.cos(pol1 * Math.PI / 180) * Math.cos((pol1 - analyzerAngle) * Math.PI / 180) * Math.cos(analyzerAngle * Math.PI / 180)}
            y2={100 - 50 * Math.cos(pol1 * Math.PI / 180) * Math.cos((pol1 - analyzerAngle) * Math.PI / 180) * Math.sin(analyzerAngle * Math.PI / 180)}
            stroke="#ff6b6b"
            strokeWidth="2"
            strokeOpacity="0.5"
            strokeDasharray="3 2"
          />
        </>
      )}

      {/* 角度标注 */}
      <text x="160" y="95" fill={dt.textSecondary} fontSize="10">0deg</text>
      <text x="95" y="18" fill={dt.textSecondary} fontSize="10">90deg</text>

      {/* 夹角 */}
      <text x="100" y="195" fill={dt.textSecondary} fontSize="11" textAnchor="middle">
        {`\u0394\u03B8 = ${Math.abs(pol1 - pol2)}\u00B0`} {Math.abs(pol1 - pol2) === 90 ? '(正交)' : ''}
      </text>
    </svg>
  )
}

// 主演示组件
export function AragoFresnelDemo() {
  const { t } = useTranslation()
  const dt = useDemoTheme()

  // 状态
  const [pol1, setPol1] = useState(0)      // 光束1偏振角
  const [pol2, setPol2] = useState(90)     // 光束2偏振角（默认正交）
  const [analyzerAngle, setAnalyzerAngle] = useState(45)
  const [showAnalyzer, setShowAnalyzer] = useState(false)
  const [wavelength] = useState(550)       // 波长（nm）- 可后续扩展为可调参数
  const [animate, setAnimate] = useState(true)

  // 干涉参数
  const slitSeparation = 100 // μm
  const screenDistance = 500 // mm

  // 计算可见度
  const visibility = useMemo(() => {
    return calculateVisibility(pol1, pol2, showAnalyzer ? analyzerAngle : null)
  }, [pol1, pol2, analyzerAngle, showAnalyzer])

  // 判断是否正交
  const isOrthogonal = Math.abs(Math.abs(pol1 - pol2) - 90) < 1

  // 投影重叠
  const projectionOverlap = useMemo(() => {
    if (!showAnalyzer) return null
    return Math.abs(
      Math.cos((pol1 - analyzerAngle) * Math.PI / 180) *
      Math.cos((pol2 - analyzerAngle) * Math.PI / 180)
    ) * 100
  }, [pol1, pol2, analyzerAngle, showAnalyzer])

  // 预设配置
  const presets = [
    { label: '正交偏振', pol1: 0, pol2: 90, analyzer: false, analyzerAngle: 45 },
    { label: '正交+45deg检偏', pol1: 0, pol2: 90, analyzer: true, analyzerAngle: 45 },
    { label: '平行偏振', pol1: 45, pol2: 45, analyzer: false, analyzerAngle: 45 },
    { label: '45deg夹角', pol1: 0, pol2: 45, analyzer: false, analyzerAngle: 45 },
  ]

  return (
    <div className="space-y-5">
      {/* 标题 */}
      <DemoHeader
        title={t('demoUi.aragoFresnel.title') || '阿拉戈-菲涅尔定律'}
        subtitle={t('demoUi.aragoFresnel.subtitle') || '正交偏振光的干涉与检偏器的作用'}
        gradient="pink"
      />

      {/* 预设按钮 */}
      <div className="flex justify-center gap-3 flex-wrap">
        {presets.map((preset, i) => (
          <motion.button
            key={i}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              pol1 === preset.pol1 && pol2 === preset.pol2 && showAnalyzer === preset.analyzer
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                : `${dt.inactiveButtonClass} hover:border-slate-500`
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setPol1(preset.pol1)
              setPol2(preset.pol2)
              setShowAnalyzer(preset.analyzer)
              setAnalyzerAngle(preset.analyzerAngle)
            }}
          >
            {preset.label}
          </motion.button>
        ))}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="偏振夹角"
          value={`${Math.abs(pol1 - pol2)}`}
          unit="deg"
          color={isOrthogonal ? 'red' : 'green'}
        />
        <StatCard
          label="干涉可见度"
          value={`${(visibility * 100).toFixed(1)}`}
          unit="%"
          color={visibility > 0.5 ? 'green' : visibility > 0.1 ? 'orange' : 'red'}
        />
        <StatCard
          label="检偏器"
          value={showAnalyzer ? `${analyzerAngle}deg` : 'OFF'}
          color="purple"
        />
        <StatCard
          label="投影重叠"
          value={projectionOverlap !== null ? `${projectionOverlap.toFixed(0)}` : '--'}
          unit={projectionOverlap !== null ? '%' : ''}
          color="cyan"
        />
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 左侧：光路图和干涉图样 */}
        <div className="lg:col-span-2 space-y-5">
          {/* 光路示意图 */}
          <VisualizationPanel variant="indigo">
            <div className="px-1 pb-3">
              <h3 className={cn("text-sm font-semibold", dt.isDark ? "text-white" : "text-gray-800")}>光路示意图</h3>
            </div>
            <OpticalSetupDiagram
              pol1={pol1}
              pol2={pol2}
              analyzerAngle={analyzerAngle}
              showAnalyzer={showAnalyzer}
              animate={animate}
            />
          </VisualizationPanel>

          {/* 干涉图样 */}
          <ChartPanel
            title="干涉图样"
            subtitle={`可见度 V = ${(visibility * 100).toFixed(1)}%`}
          >
            <div className="flex justify-center">
              <InterferencePattern
                pol1={pol1}
                pol2={pol2}
                analyzerAngle={analyzerAngle}
                wavelength={wavelength}
                slitSeparation={slitSeparation}
                screenDistance={screenDistance}
                showAnalyzer={showAnalyzer}
              />
            </div>

            {/* 状态说明 */}
            <div className={cn(
              "mt-3 p-3 rounded-lg text-center text-sm border",
              isOrthogonal && !showAnalyzer
                ? dt.isDark
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : 'bg-red-50 border-red-200 text-red-700'
                : dt.isDark
                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                  : 'bg-green-50 border-green-200 text-green-700'
            )}>
              {isOrthogonal && !showAnalyzer ? (
                <>正交偏振光无法产生干涉条纹 -- 阿拉戈-菲涅尔第二定律</>
              ) : showAnalyzer ? (
                <>检偏器将两束光投影到同一方向，干涉条纹重新出现！</>
              ) : (
                <>偏振方向有重叠分量，可以产生干涉</>
              )}
            </div>
          </ChartPanel>
        </div>

        {/* 右侧：控制面板 */}
        <div className="space-y-5">
          {/* 偏振矢量图 */}
          <ControlPanel title="偏振矢量图">
            <PolarizationVectorDiagram
              pol1={pol1}
              pol2={pol2}
              analyzerAngle={analyzerAngle}
              showAnalyzer={showAnalyzer}
            />
          </ControlPanel>

          {/* 参数控制 */}
          <ControlPanel title="参数控制">
            <SliderControl
              label="光束1偏振角"
              value={pol1}
              min={0}
              max={180}
              step={5}
              unit="deg"
              onChange={setPol1}
              color="orange"
            />
            <SliderControl
              label="光束2偏振角"
              value={pol2}
              min={0}
              max={180}
              step={5}
              unit="deg"
              onChange={setPol2}
              color="cyan"
            />

            {/* 检偏器开关 */}
            <div className={cn("flex items-center justify-between py-2 border-t", dt.borderClass)}>
              <span className={`text-xs ${dt.mutedTextClass}`}>启用检偏器</span>
              <Toggle
                label=""
                checked={showAnalyzer}
                onChange={setShowAnalyzer}
              />
            </div>

            {showAnalyzer && (
              <SliderControl
                label="检偏器角度"
                value={analyzerAngle}
                min={0}
                max={180}
                step={5}
                unit="deg"
                onChange={setAnalyzerAngle}
                color="purple"
              />
            )}

            {/* 动画控制 */}
            <motion.button
              onClick={() => setAnimate(!animate)}
              className={`w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                animate
                  ? 'bg-pink-400/20 text-pink-400 border border-pink-400/50'
                  : `border ${dt.inactiveButtonClass}`
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {animate ? '暂停动画' : '播放动画'}
            </motion.button>
          </ControlPanel>
        </div>
      </div>

      {/* 公式说明 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormulaHighlight
          formula="I = I1 + I2 + 2sqrt(I1 I2) cos(d) cos2(Dth/2)"
          description="无检偏器时：当 Dth = 90deg 时，cos2(45deg) 趋向零，干涉项消失"
        />
        <FormulaHighlight
          formula="I = |E1 cos(th1-a) + E2 cos(th2-a) e^(id)|2"
          description="有检偏器时：检偏器角度 a 将两束光投影到同一方向"
        />
      </div>

      {/* 知识卡片 */}
      <InfoGrid columns={2} className="lg:grid-cols-4">
        <InfoCard title="阿拉戈-菲涅尔第一定律" color="cyan">
          <p className={`text-xs ${dt.bodyClass}`}>
            两束来自同一偏振光源、偏振方向相同的相干光可以产生干涉。这是最基本的干涉条件。
          </p>
        </InfoCard>
        <InfoCard title="阿拉戈-菲涅尔第二定律" color="orange">
          <p className={`text-xs ${dt.bodyClass}`}>
            两束正交偏振的光不能产生干涉条纹，因为它们在任何方向上的投影分量不相关。这是本演示的核心现象。
          </p>
        </InfoCard>
        <InfoCard title="检偏器的作用" color="purple">
          <p className={`text-xs ${dt.bodyClass}`}>
            检偏器将两束正交光投影到同一方向。虽然各自强度减半，但投影后的分量可以干涉，条纹重新出现。
          </p>
        </InfoCard>
        <InfoCard title="相干性要求" color="orange">
          <p className={`text-xs ${dt.bodyClass}`}>
            阿拉戈-菲涅尔第三定律指出：从自然光分出的两束正交偏振光即使通过偏振片转为同向，也不能干涉，因为它们本身不相干。
          </p>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
