/**
 * InteractiveOpticalBenchDemo - 交互式光学实验台
 * 演示如何复用共享的光学组件库
 * 用户可以交互式探索光线在光学系统中的传播
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ControlPanel, SliderControl, Toggle, InfoCard, PresetButtons, Formula } from '../DemoControls'

// 导入共享模块
import { getPolarizationColor, POLARIZATION_DISPLAY_CONFIG } from '@/lib/polarization'
import { applyMalusLaw, getMalusTransmission } from '@/lib/opticsPhysics'
import {
  EmitterSVG,
  PolarizerSVG,
  SensorSVG,
  LightBeamDefs,
  type OpticalComponent,
  type SensorState,
} from '@/components/shared/optical'
import { useLightTracer } from '@/hooks/useLightTracer'

// 预设配置
const PRESETS = [
  { name: 'Perfect Match', polarizer: 0 },
  { name: '45° Angle', polarizer: 45 },
  { name: 'Crossed (90°)', polarizer: 90 },
  { name: '60° Angle', polarizer: 60 },
  { name: '30° Angle', polarizer: 30 },
]

export function InteractiveOpticalBenchDemo() {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // 交互状态
  const [emitterPolarization, setEmitterPolarization] = useState(0)
  const [polarizerAngle, setPolarizerAngle] = useState(45)
  const [showPolarization, setShowPolarization] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1)

  // 动态生成光学元件配置
  const components: OpticalComponent[] = useMemo(
    () => [
      {
        id: 'emitter',
        type: 'emitter',
        x: 15,
        y: 50,
        angle: 0,
        polarizationAngle: emitterPolarization,
        direction: 'right',
        locked: true,
      },
      {
        id: 'polarizer',
        type: 'polarizer',
        x: 50,
        y: 50,
        angle: 0,
        polarizationAngle: polarizerAngle,
        locked: false,
      },
      {
        id: 'sensor',
        type: 'sensor',
        x: 85,
        y: 50,
        angle: 0,
        requiredIntensity: 1,
        locked: true,
      },
    ],
    [emitterPolarization, polarizerAngle]
  )

  // 使用共享的光路追踪Hook
  const { beams, sensorStates } = useLightTracer(components, {})

  // 计算物理量
  const angleDiff = Math.abs(emitterPolarization - polarizerAngle) % 180
  const transmission = getMalusTransmission(emitterPolarization, polarizerAngle)
  const outputIntensity = applyMalusLaw(100, emitterPolarization, polarizerAngle)

  // 处理预设选择
  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index)
    setPolarizerAngle(PRESETS[index].polarizer)
  }

  // 传感器状态
  const sensorState: SensorState | undefined = sensorStates[0]

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* 可视化区域 */}
      <div className="flex-1 min-w-0">
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
          <svg viewBox="0 0 100 70" className="w-full h-auto max-h-[280px]" style={{ background: '#0a0a1a' }}>
            <defs>
              <LightBeamDefs />
              <pattern id="demo-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100" height="70" fill="url(#demo-grid)" />

            {/* 标题 */}
            <text x="50" y="8" textAnchor="middle" fill="#94a3b8" fontSize="3">
              {isZh ? '马吕斯定律实验' : "Malus's Law Experiment"}
            </text>

            {/* 光束 */}
            {beams.map((beam, i) => {
              const opacity = Math.max(0.2, beam.intensity / 100)
              const strokeWidth = Math.max(0.5, (beam.intensity / 100) * 2)
              const color = showPolarization ? getPolarizationColor(beam.polarization) : '#ffffaa'

              return (
                <g key={i}>
                  <line
                    x1={beam.startX}
                    y1={beam.startY}
                    x2={beam.endX}
                    y2={beam.endY}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeOpacity={opacity}
                    filter="url(#glow)"
                    strokeLinecap="round"
                  />
                  <line
                    x1={beam.startX}
                    y1={beam.startY}
                    x2={beam.endX}
                    y2={beam.endY}
                    stroke={color}
                    strokeWidth={strokeWidth * 3}
                    strokeOpacity={opacity * 0.3}
                    strokeLinecap="round"
                  />
                </g>
              )
            })}

            {/* 光源 */}
            <EmitterSVG
              x={15}
              y={50}
              polarization={emitterPolarization}
              direction="right"
              isAnimating={isAnimating}
              showPolarization={showPolarization}
              getPolarizationColor={getPolarizationColor}
            />
            <text x="15" y="62" textAnchor="middle" fill="#94a3b8" fontSize="2">
              {isZh ? '光源' : 'Source'}
            </text>

            {/* 偏振片 */}
            <PolarizerSVG
              x={50}
              y={50}
              polarizationAngle={polarizerAngle}
              locked={false}
              selected={false}
              onClick={() => {}}
              onRotate={() => {}}
              getPolarizationColor={getPolarizationColor}
              isDark={true}
            />
            <text x="50" y="62" textAnchor="middle" fill="#94a3b8" fontSize="2">
              {isZh ? '偏振片' : 'Polarizer'}
            </text>

            {/* 传感器 */}
            <SensorSVG
              x={85}
              y={50}
              sensorState={sensorState}
              requiredIntensity={1}
              isDark={true}
              isAnimating={isAnimating}
              getPolarizationColor={getPolarizationColor}
            />
            <text x="85" y="62" textAnchor="middle" fill="#94a3b8" fontSize="2">
              {isZh ? '探测器' : 'Detector'}
            </text>
          </svg>
        </div>

        {/* 物理量显示 */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">{isZh ? '角度差' : 'Angle Diff'}</div>
            <div className="text-xl font-mono text-cyan-400">{angleDiff}°</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">{isZh ? '透射率' : 'Transmission'}</div>
            <div className="text-xl font-mono text-green-400">{(transmission * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">{isZh ? '输出光强' : 'Output I'}</div>
            <div className="text-xl font-mono text-yellow-400">{outputIntensity.toFixed(1)}%</div>
          </div>
        </div>

        {/* 偏振颜色图例 */}
        {showPolarization && (
          <div className="mt-4 flex justify-center gap-4">
            {POLARIZATION_DISPLAY_CONFIG.map(({ angle, label, color }) => (
              <div key={angle} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-72 space-y-4">
        <ControlPanel title={isZh ? '光源参数' : 'Source Parameters'}>
          <SliderControl
            label={isZh ? '偏振角度' : 'Polarization'}
            value={emitterPolarization}
            min={0}
            max={180}
            step={5}
            unit="°"
            onChange={(v) => {
              setEmitterPolarization(v)
              setSelectedPreset(null)
            }}
            color="red"
          />
        </ControlPanel>

        <ControlPanel title={isZh ? '偏振片参数' : 'Polarizer Parameters'}>
          <SliderControl
            label={isZh ? '偏振片角度' : 'Filter Angle'}
            value={polarizerAngle}
            min={0}
            max={180}
            step={5}
            unit="°"
            onChange={(v) => {
              setPolarizerAngle(v)
              setSelectedPreset(null)
            }}
            color="cyan"
          />

          <PresetButtons
            options={PRESETS.map((p, i) => ({ value: i, label: p.name }))}
            value={selectedPreset ?? -1}
            onChange={(v) => handlePresetSelect(v as number)}
            columns={2}
          />
        </ControlPanel>

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

        <InfoCard title={isZh ? '马吕斯定律' : "Malus's Law"} color="cyan">
          <Formula highlight>I = I₀ × cos²(θ)</Formula>
          <p className="text-xs text-slate-400 mt-2">
            {isZh
              ? '其中 θ 是入射光偏振方向与偏振片透光轴之间的夹角。当 θ = 0° 时透射率最大，θ = 90° 时完全阻挡。'
              : 'Where θ is the angle between the incident polarization and the filter axis. Maximum transmission at θ = 0°, complete blocking at θ = 90°.'}
          </p>
        </InfoCard>

        <div className="text-xs text-slate-500 text-center">
          {isZh
            ? '此Demo使用共享的光学组件库构建'
            : 'Built with shared optical component library'}
        </div>
      </div>
    </div>
  )
}
