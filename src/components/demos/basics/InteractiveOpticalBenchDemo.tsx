/**
 * InteractiveOpticalBenchDemo - 交互式光学实验台（双偏振片）
 * 展示级联马吕斯定律：光源 → 偏振片1 → 偏振片2 → 探测器
 * 物理公式：I_out = I₀ · cos²(θ₁) · cos²(θ₂ - θ₁)
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDemoTheme } from '../demoThemeColors'
import { cn } from '@/lib/utils'
import { ControlPanel, SliderControl, Toggle, InfoCard, Formula } from '../DemoControls'
import {
  DemoHeader,
  VisualizationPanel,
  DemoMainLayout,
  StatCard,
  FormulaHighlight,
  TipBanner,
} from '../DemoLayout'

// 导入共享模块
import { getPolarizationColor } from '@/lib/polarization'
import { getMalusTransmission } from '@/lib/opticsPhysics'
import {
  EmitterSVG,
  PolarizerSVG,
  SensorSVG,
  LightBeamDefs,
  type OpticalComponent,
  type SensorState,
} from '@/components/shared/optical'
import { useLightTracer } from '@/hooks/useLightTracer'

// 教育意义明确的预设（光源固定0°）
const PRESETS = [
  {
    nameZh: '平行对齐（全透射）',
    nameEn: 'Parallel (Full Transmission)',
    p1: 0, p2: 0,
    desc: 'I = I₀ · 1 · 1 = 100%',
  },
  {
    nameZh: '45° 夹角（50% 透射）',
    nameEn: '45° Gap (50% Transmission)',
    p1: 0, p2: 45,
    desc: 'I = I₀ · 1 · cos²45° = 50%',
  },
  {
    nameZh: '正交偏振（全阻断）',
    nameEn: 'Crossed (Fully Blocked)',
    p1: 0, p2: 90,
    desc: 'I = I₀ · 1 · cos²90° = 0%',
  },
  {
    nameZh: '三偏振片预演',
    nameEn: '3-Polarizer Preview',
    p1: 45, p2: 90,
    desc: 'P1=45°: I₁=50%，P2=90°: I₂=25%',
  },
]

export function InteractiveOpticalBenchDemo() {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const dt = useDemoTheme()

  // 光源固定0°，两个偏振片角度可调
  const EMITTER_ANGLE = 0
  const [polarizer1Angle, setPolarizer1Angle] = useState(0)
  const [polarizer2Angle, setPolarizer2Angle] = useState(45)
  const [showPolarization, setShowPolarization] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1)

  // 双偏振片光学元件配置
  const components: OpticalComponent[] = useMemo(
    () => [
      {
        id: 'emitter',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: EMITTER_ANGLE,
        direction: 'right',
        locked: true,
      },
      {
        id: 'polarizer1',
        type: 'polarizer',
        x: 35,
        y: 50,
        angle: 0,
        polarizationAngle: polarizer1Angle,
        locked: false,
      },
      {
        id: 'polarizer2',
        type: 'polarizer',
        x: 65,
        y: 50,
        angle: 0,
        polarizationAngle: polarizer2Angle,
        locked: false,
      },
      {
        id: 'sensor',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 1,
        locked: true,
      },
    ],
    [polarizer1Angle, polarizer2Angle]
  )

  const { beams, sensorStates } = useLightTracer(components, {})

  // 级联马吕斯定律计算
  const t1 = getMalusTransmission(EMITTER_ANGLE, polarizer1Angle)         // 光源→P1
  const t2 = getMalusTransmission(polarizer1Angle, polarizer2Angle)        // P1→P2
  const intensity1 = t1 * 100
  const intensity2 = t1 * t2 * 100
  const angleDiff1 = Math.abs(EMITTER_ANGLE - polarizer1Angle) % 180
  const angleDiff2 = Math.abs(polarizer1Angle - polarizer2Angle) % 180

  // 处理预设选择
  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index)
    setPolarizer1Angle(PRESETS[index].p1)
    setPolarizer2Angle(PRESETS[index].p2)
  }

  // 传感器状态
  const sensorState: SensorState | undefined = sensorStates[0]

  // 实时 cos² 曲线数据（θ₂ 从 0° 到 180°，P1 角度固定）
  const curvePoints = useMemo(() => {
    const pts = []
    for (let angle = 0; angle <= 180; angle += 3) {
      const t = getMalusTransmission(EMITTER_ANGLE, polarizer1Angle) *
                getMalusTransmission(polarizer1Angle, angle)
      pts.push({ angle, intensity: t * 100 })
    }
    return pts
  }, [polarizer1Angle])

  return (
    <div className="space-y-5">
      <DemoHeader
        title={isZh ? '双偏振片光学实验台' : 'Dual-Polarizer Optical Bench'}
        subtitle={isZh
          ? '光源（0°）→ 偏振片1 → 偏振片2 → 探测器：级联马吕斯定律'
          : 'Source (0°) → Polarizer 1 → Polarizer 2 → Detector: cascaded Malus\'s Law'}
        gradient="cyan"
      />

      <DemoMainLayout
        visualization={
          <div className="space-y-4">
            {/* 主光路 SVG */}
            <VisualizationPanel variant="blue">
              <svg viewBox="0 0 100 72" className="w-full h-auto max-h-[300px]" style={{ background: dt.canvasBg }}>
                <defs>
                  <LightBeamDefs />
                  <pattern id="bench-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke={dt.gridLineColor} strokeWidth="0.2" />
                  </pattern>
                </defs>
                <rect width="100" height="72" fill="url(#bench-grid)" />

                {/* 光束 */}
                {beams.map((beam, i) => {
                  const opacity = Math.max(0.15, beam.intensity / 100)
                  const strokeWidth = Math.max(0.5, (beam.intensity / 100) * 2.5)
                  const color = showPolarization ? getPolarizationColor(beam.polarization) : '#ffffaa'
                  return (
                    <g key={i}>
                      <line
                        x1={beam.startX} y1={beam.startY}
                        x2={beam.endX} y2={beam.endY}
                        stroke={color} strokeWidth={strokeWidth}
                        strokeOpacity={opacity} filter="url(#glow)"
                        strokeLinecap="round"
                      />
                      <line
                        x1={beam.startX} y1={beam.startY}
                        x2={beam.endX} y2={beam.endY}
                        stroke={color} strokeWidth={strokeWidth * 3}
                        strokeOpacity={opacity * 0.25}
                        strokeLinecap="round"
                      />
                    </g>
                  )
                })}

                {/* 光源 */}
                <EmitterSVG
                  x={10} y={50}
                  polarization={EMITTER_ANGLE}
                  direction="right"
                  isAnimating={isAnimating}
                  showPolarization={showPolarization}
                  getPolarizationColor={getPolarizationColor}
                />
                <text x="10" y="63" textAnchor="middle" fill={dt.textSecondary} fontSize="2.2">
                  {isZh ? '光源 0°' : 'Source 0°'}
                </text>

                {/* 偏振片1 */}
                <PolarizerSVG
                  x={35} y={50}
                  polarizationAngle={polarizer1Angle}
                  locked={false} selected={false}
                  onClick={() => {}} onRotate={() => {}}
                  getPolarizationColor={getPolarizationColor}
                  isDark={dt.isDark}
                />
                <text x="35" y="63" textAnchor="middle" fill={dt.textSecondary} fontSize="2.2">
                  {isZh ? `P₁  ${polarizer1Angle}°` : `P₁  ${polarizer1Angle}°`}
                </text>

                {/* 偏振片2 */}
                <PolarizerSVG
                  x={65} y={50}
                  polarizationAngle={polarizer2Angle}
                  locked={false} selected={false}
                  onClick={() => {}} onRotate={() => {}}
                  getPolarizationColor={getPolarizationColor}
                  isDark={dt.isDark}
                />
                <text x="65" y="63" textAnchor="middle" fill={dt.textSecondary} fontSize="2.2">
                  {isZh ? `P₂  ${polarizer2Angle}°` : `P₂  ${polarizer2Angle}°`}
                </text>

                {/* 探测器 */}
                <SensorSVG
                  x={90} y={50}
                  sensorState={sensorState}
                  requiredIntensity={1}
                  isDark={dt.isDark}
                  isAnimating={isAnimating}
                  getPolarizationColor={getPolarizationColor}
                />
                <text x="90" y="63" textAnchor="middle" fill={dt.textSecondary} fontSize="2.2">
                  {isZh ? '探测器' : 'Detector'}
                </text>

                {/* 中间光强标注 */}
                <text x="22.5" y="38" textAnchor="middle" fill={dt.textSecondary} fontSize="2" opacity="0.8">
                  I₀=100%
                </text>
                <text x="50" y="38" textAnchor="middle" fill="#22c55e" fontSize="2" opacity="0.9">
                  I₁={intensity1.toFixed(0)}%
                </text>
                <text x="77.5" y="38" textAnchor="middle" fill="#f59e0b" fontSize="2" opacity="0.9">
                  I₂={intensity2.toFixed(0)}%
                </text>
              </svg>
            </VisualizationPanel>

            {/* 统计卡片 - 4格 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                label={isZh ? '源→P₁ 角度差' : 'Src→P₁ Δθ'}
                value={`${angleDiff1}`}
                unit="°"
                color="cyan"
              />
              <StatCard
                label={isZh ? 'P₁后强度 I₁' : 'After P₁  I₁'}
                value={`${intensity1.toFixed(1)}`}
                unit="%"
                color="green"
              />
              <StatCard
                label={isZh ? 'P₁→P₂ 角度差' : 'P₁→P₂ Δθ'}
                value={`${angleDiff2}`}
                unit="°"
                color="purple"
              />
              <StatCard
                label={isZh ? 'P₂后强度 I₂' : 'After P₂  I₂'}
                value={`${intensity2.toFixed(1)}`}
                unit="%"
                color="yellow"
              />
            </div>

            {/* 实时 cos² 曲线：I₂ vs θ₂（P1固定） */}
            <div className={cn(
              "rounded-2xl border p-4",
              dt.isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-gray-200 shadow-sm"
            )}>
              <p className={cn("text-xs font-medium mb-2", dt.mutedTextClass)}>
                {isZh ? `实时曲线：I₂ vs θ₂（P₁固定在 ${polarizer1Angle}°）` : `I₂ vs θ₂  (P₁ fixed at ${polarizer1Angle}°)`}
              </p>
              <svg viewBox="0 0 200 80" className="w-full h-auto">
                {/* 背景 */}
                <rect width="200" height="80" fill={dt.isDark ? '#0f172a' : '#f8fafc'} rx="6" />
                {/* 网格线 */}
                {[0, 25, 50, 75, 100].map(pct => (
                  <line
                    key={pct}
                    x1="20" y1={8 + (1 - pct / 100) * 60}
                    x2="195" y2={8 + (1 - pct / 100) * 60}
                    stroke={dt.isDark ? 'rgba(100,116,139,0.2)' : 'rgba(156,163,175,0.3)'}
                    strokeWidth="0.5"
                  />
                ))}
                {[0, 45, 90, 135, 180].map(deg => (
                  <line
                    key={deg}
                    x1={20 + (deg / 180) * 175} y1="8"
                    x2={20 + (deg / 180) * 175} y2="68"
                    stroke={dt.isDark ? 'rgba(100,116,139,0.2)' : 'rgba(156,163,175,0.3)'}
                    strokeWidth="0.5"
                    strokeDasharray={deg === 90 ? '2 1' : undefined}
                  />
                ))}
                {/* 曲线 */}
                <polyline
                  points={curvePoints.map(p => `${20 + (p.angle / 180) * 175},${8 + (1 - p.intensity / 100) * 60}`).join(' ')}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* 当前 θ₂ 位置点 */}
                <circle
                  cx={20 + (polarizer2Angle / 180) * 175}
                  cy={8 + (1 - intensity2 / 100) * 60}
                  r="3"
                  fill="#f59e0b"
                  stroke={dt.isDark ? '#1e293b' : '#ffffff'}
                  strokeWidth="1"
                />
                {/* Y轴标签 */}
                <text x="18" y="10" textAnchor="end" fontSize="5" fill={dt.textSecondary}>100%</text>
                <text x="18" y="40" textAnchor="end" fontSize="5" fill={dt.textSecondary}>50%</text>
                <text x="18" y="70" textAnchor="end" fontSize="5" fill={dt.textSecondary}>0%</text>
                {/* X轴标签 */}
                <text x="20" y="76" textAnchor="middle" fontSize="5" fill={dt.textSecondary}>0°</text>
                <text x="107" y="76" textAnchor="middle" fontSize="5" fill={dt.textSecondary}>90°</text>
                <text x="195" y="76" textAnchor="middle" fontSize="5" fill={dt.textSecondary}>180°</text>
                {/* 当前值标注 */}
                <text
                  x={Math.min(185, Math.max(35, 20 + (polarizer2Angle / 180) * 175))}
                  y={Math.max(14, 8 + (1 - intensity2 / 100) * 60 - 4)}
                  textAnchor="middle" fontSize="5.5" fill="#f59e0b" fontWeight="600"
                >
                  {intensity2.toFixed(0)}%
                </text>
              </svg>
            </div>
          </div>
        }
        controls={
          <div className="space-y-4">
            {/* 预设配置 */}
            <ControlPanel title={isZh ? '典型配置' : 'Typical Configurations'}>
              <div className="space-y-2">
                {PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => handlePresetSelect(i)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl border transition-all text-sm",
                      selectedPreset === i
                        ? dt.isDark
                          ? 'bg-cyan-400/20 border-cyan-400/50 text-cyan-300'
                          : 'bg-cyan-100 border-cyan-300 text-cyan-700'
                        : dt.isDark
                          ? 'bg-slate-800/50 border-slate-700 text-gray-400 hover:border-slate-600'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    <div className="font-medium">{isZh ? preset.nameZh : preset.nameEn}</div>
                    <div className={cn("text-xs mt-0.5 font-mono", dt.mutedTextClass)}>{preset.desc}</div>
                  </button>
                ))}
              </div>
            </ControlPanel>

            {/* 偏振片1 */}
            <ControlPanel title={isZh ? '偏振片 P₁ 角度' : 'Polarizer P₁ Angle'}>
              <SliderControl
                label={isZh ? 'P₁ 角度' : 'P₁ Angle'}
                value={polarizer1Angle}
                min={0} max={180} step={5}
                unit="°"
                onChange={(v) => { setPolarizer1Angle(v); setSelectedPreset(null) }}
                color="green"
              />
            </ControlPanel>

            {/* 偏振片2 */}
            <ControlPanel title={isZh ? '偏振片 P₂ 角度' : 'Polarizer P₂ Angle'}>
              <SliderControl
                label={isZh ? 'P₂ 角度' : 'P₂ Angle'}
                value={polarizer2Angle}
                min={0} max={180} step={5}
                unit="°"
                onChange={(v) => { setPolarizer2Angle(v); setSelectedPreset(null) }}
                color="cyan"
              />
            </ControlPanel>

            {/* 显示选项 */}
            <ControlPanel title={isZh ? '显示选项' : 'Display Options'}>
              <Toggle
                label={isZh ? '显示偏振颜色' : 'Show Polarization Colors'}
                checked={showPolarization}
                onChange={setShowPolarization}
              />
              <Toggle
                label={isZh ? '动画效果' : 'Animation'}
                checked={isAnimating}
                onChange={setIsAnimating}
              />
            </ControlPanel>

            <InfoCard title={isZh ? '级联马吕斯定律' : 'Cascaded Malus\'s Law'} color="cyan">
              <Formula highlight>I₂ = I₀ · cos²θ₁ · cos²(θ₂−θ₁)</Formula>
              <p className={cn("text-xs mt-2", dt.mutedTextClass)}>
                {isZh
                  ? '每个偏振片独立应用马吕斯定律。正交时（θ差=90°）光强为零，45°时透射一半。'
                  : 'Each polarizer independently applies Malus\'s Law. Zero at 90° crossing, half at 45°.'}
              </p>
            </InfoCard>
          </div>
        }
        controlsWidth="narrow"
      />

      <FormulaHighlight
        formula="I₂ = I₀ · cos²θ₁ · cos²(θ₂ − θ₁)"
        description={isZh
          ? '级联马吕斯定律：每一级偏振片按 cos²θ 衰减，多级叠加后光强急剧下降'
          : 'Cascaded Malus\'s Law: each polarizer attenuates by cos²θ, multiple stages cause rapid intensity drop'}
      />

      <TipBanner color="cyan">
        {isZh
          ? '试试"三偏振片预演"配置：P₁=45°、P₂=90° — 两个"正交"偏振片之间插入45°偏振片，反而让光能通过！这是三偏振片悖论的核心。'
          : 'Try "3-Polarizer Preview": P₁=45°, P₂=90° — inserting a 45° polarizer between two "crossed" polarizers actually allows light through! This is the three-polarizer paradox.'}
      </TipBanner>
    </div>
  )
}
