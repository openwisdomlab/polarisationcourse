/**
 * Optical Anisotropy Demo
 * 光学各向异性演示 - 展示材料光学性质随方向变化的特性
 *
 * Redesigned with DemoLayout components for consistent UI.
 */
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  SliderControl,
  ControlPanel,
  Toggle,
  PresetButtons,
} from '../DemoControls'
import { useDemoTheme } from '../demoThemeColors'
import {
  DemoHeader,
  VisualizationPanel,
  DemoMainLayout,
  InfoGrid,
  StatCard,
  FormulaHighlight,
} from '../DemoLayout'

// 材料类型
type MaterialType = 'isotropic' | 'uniaxial' | 'biaxial' | 'stressed'

interface MaterialInfo {
  name: string
  nameZh: string
  no: number // ordinary refractive index
  ne: number // extraordinary refractive index (for uniaxial)
  ny?: number // for biaxial
  color: string
}

const MATERIALS: Record<MaterialType, MaterialInfo> = {
  isotropic: {
    name: 'Glass (Isotropic)',
    nameZh: '玻璃（各向同性）',
    no: 1.52,
    ne: 1.52,
    color: '#94a3b8',
  },
  uniaxial: {
    name: 'Calcite (Uniaxial)',
    nameZh: '方解石（单轴晶体）',
    no: 1.658,
    ne: 1.486,
    color: '#22d3ee',
  },
  biaxial: {
    name: 'Mica (Biaxial)',
    nameZh: '云母（双轴晶体）',
    no: 1.552,
    ne: 1.582,
    ny: 1.588,
    color: '#a78bfa',
  },
  stressed: {
    name: 'Stressed Plastic',
    nameZh: '受力塑料',
    no: 1.49,
    ne: 1.52,
    color: '#4ade80',
  },
}

export function AnisotropyDemo() {
  const { i18n } = useTranslation()
  const dt = useDemoTheme()
  const isZh = i18n.language === 'zh'

  const [materialType, setMaterialType] = useState<MaterialType>('uniaxial')
  const [lightAngle, setLightAngle] = useState(45) // 入射光与光轴夹角
  const [showOpticAxis, setShowOpticAxis] = useState(true)
  const [showIndicatrix, setShowIndicatrix] = useState(true)
  const [animating, setAnimating] = useState(true)
  const [stressLevel, setStressLevel] = useState(50) // 仅用于stressed材料

  const material = MATERIALS[materialType]

  // 计算折射率椭球参数
  const indicatrixParams = useMemo(() => {
    const deltaTheta = lightAngle * Math.PI / 180

    if (materialType === 'isotropic') {
      return {
        nEffective: material.no,
        eccentricity: 0,
        phaseDelay: 0,
      }
    }

    // 有效折射率（单轴晶体）
    const nEffective = (material.no * material.ne) /
      Math.sqrt(
        Math.pow(material.no * Math.sin(deltaTheta), 2) +
        Math.pow(material.ne * Math.cos(deltaTheta), 2)
      )

    // 双折射强度
    const birefringence = Math.abs(material.ne - material.no)

    // 相位延迟（假设厚度为1mm，波长589nm）
    const thickness = 1e-3 // 1mm
    const wavelength = 589e-9 // 钠黄光
    const phaseDelay = (2 * Math.PI * birefringence * thickness) / wavelength

    return {
      nEffective,
      eccentricity: birefringence / material.no,
      phaseDelay: phaseDelay % (2 * Math.PI),
      birefringence,
    }
  }, [materialType, lightAngle, material])

  // 根据应力调整双折射（仅用于stressed材料）
  const effectiveBirefringence = useMemo(() => {
    if (materialType === 'stressed') {
      return (stressLevel / 100) * 0.03 // 最大应力双折射约0.03
    }
    return indicatrixParams.birefringence || 0
  }, [materialType, stressLevel, indicatrixParams])

  return (
    <div className="space-y-5">
      {/* Header */}
      <DemoHeader
        title={isZh ? '光学各向异性' : 'Optical Anisotropy'}
        subtitle={isZh ? '探索材料光学性质随方向变化的特性' : 'Explore how optical properties vary with direction in materials'}
        gradient="cyan"
      />

      {/* Formula */}
      <FormulaHighlight
        formula="n(θ) = n_o · n_e / √(n_o² sin²θ + n_e² cos²θ)"
        description={isZh ? '有效折射率随入射角与光轴夹角变化' : 'Effective refractive index varies with angle to optic axis'}
      />

      {/* Main Layout */}
      <DemoMainLayout
        controlsWidth="normal"
        visualization={
          <div className="space-y-5">
            {/* SVG Visualization */}
            <VisualizationPanel variant="blue">
              <svg viewBox="0 0 400 320" className="w-full h-auto max-h-[420px]">
                <defs>
                  {/* 渐变定义 */}
                  <linearGradient id="aniso-beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="aniso-o-ray" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff4444" />
                    <stop offset="100%" stopColor="#ff6666" />
                  </linearGradient>
                  <linearGradient id="aniso-e-ray" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#44ff44" />
                    <stop offset="100%" stopColor="#66ff66" />
                  </linearGradient>
                  <filter id="aniso-glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 背景 */}
                <rect
                  x="0" y="0" width="400" height="320"
                  fill={dt.canvasBg}
                />

                {/* 标题 */}
                <text
                  x="200" y="16"
                  textAnchor="middle"
                  className={cn(
                    'text-xs font-semibold',
                    dt.isDark ? 'fill-cyan-400' : 'fill-cyan-600'
                  )}
                >
                  {isZh ? '光学各向异性' : 'Optical Anisotropy'}
                </text>
                <text
                  x="200" y="28"
                  textAnchor="middle"
                  style={{ fontSize: '9px' }}
                  fill={dt.textSecondary}
                >
                  {isZh ? material.nameZh : material.name}
                </text>

                {/* 折射率椭球（光率体）- 中央显示 */}
                {showIndicatrix && (
                  <g transform="translate(155, 155)">
                    {/* 椭球轮廓 */}
                    {materialType === 'isotropic' ? (
                      // 各向同性 - 圆球
                      <circle
                        cx="0" cy="0"
                        r="48"
                        fill={`${material.color}20`}
                        stroke={material.color}
                        strokeWidth="1.5"
                      />
                    ) : materialType === 'biaxial' ? (
                      // 双轴晶体 - 三轴不等的椭球
                      <ellipse
                        cx="0" cy="0"
                        rx="56"
                        ry="44"
                        fill={`${material.color}20`}
                        stroke={material.color}
                        strokeWidth="1.5"
                        transform="rotate(-15)"
                      />
                    ) : (
                      // 单轴晶体 - 旋转椭球
                      <>
                        <ellipse
                          cx="0" cy="0"
                          rx={36 + (material.ne - material.no) * 120}
                          ry="48"
                          fill={`${material.color}20`}
                          stroke={material.color}
                          strokeWidth="1.5"
                        />
                        {/* 负晶体标记 */}
                        {material.ne < material.no && (
                          <text
                            x="0" y="-58"
                            textAnchor="middle"
                            style={{ fontSize: '9px' }}
                            fill={dt.isDark ? '#22d3ee' : '#0891b2'}
                          >
                            {isZh ? '负晶体 (ne < no)' : 'Negative (ne < no)'}
                          </text>
                        )}
                      </>
                    )}

                    {/* 光轴 */}
                    {showOpticAxis && materialType !== 'isotropic' && (
                      <>
                        <line
                          x1="0" y1="-70"
                          x2="0" y2="70"
                          stroke={dt.isDark ? '#fbbf24' : '#f59e0b'}
                          strokeWidth="1.5"
                          strokeDasharray="4,4"
                        />
                        <text
                          x="6" y="-62"
                          style={{ fontSize: '9px' }}
                          fill={dt.isDark ? '#fbbf24' : '#d97706'}
                        >
                          {isZh ? '光轴' : 'Axis'}
                        </text>
                      </>
                    )}

                    {/* 入射光方向指示器 */}
                    <g transform={`rotate(${-90 + lightAngle})`}>
                      <line
                        x1="-80" y1="0"
                        x2="-55" y2="0"
                        stroke="url(#aniso-beam-grad)"
                        strokeWidth="2.5"
                        filter="url(#aniso-glow)"
                      />
                      <polygon
                        points="-55,0 -62,-3 -62,3"
                        fill="#fbbf24"
                      />
                      <text
                        x="-85" y="3"
                        textAnchor="end"
                        style={{ fontSize: '9px' }}
                        fill={dt.isDark ? '#fbbf24' : '#d97706'}
                      >
                        {isZh ? '入射光' : 'Light'}
                      </text>
                    </g>

                    {/* o光和e光 - 仅在非各向同性时显示 */}
                    {materialType !== 'isotropic' && (
                      <>
                        {/* o光 - 垂直于光轴 */}
                        <motion.g
                          animate={animating ? {
                            opacity: [0.6, 1, 0.6],
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <line
                            x1="0" y1="0"
                            x2={48 * Math.cos((90 + lightAngle) * Math.PI / 180)}
                            y2={48 * Math.sin((90 + lightAngle) * Math.PI / 180)}
                            stroke="url(#aniso-o-ray)"
                            strokeWidth="2"
                          />
                          <circle
                            cx={36 * Math.cos((90 + lightAngle) * Math.PI / 180)}
                            cy={36 * Math.sin((90 + lightAngle) * Math.PI / 180)}
                            r="3"
                            fill="none"
                            stroke="#ff4444"
                            strokeWidth="1.5"
                          />
                          <text
                            x={56 * Math.cos((90 + lightAngle) * Math.PI / 180)}
                            y={56 * Math.sin((90 + lightAngle) * Math.PI / 180)}
                            textAnchor="middle"
                            style={{ fontSize: '9px' }}
                            className="fill-red-400"
                          >
                            o
                          </text>
                        </motion.g>

                        {/* e光 - 在主截面内 */}
                        <motion.g
                          animate={animating ? {
                            opacity: [0.6, 1, 0.6],
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                          <line
                            x1="0" y1="0"
                            x2={48 * Math.cos(lightAngle * Math.PI / 180)}
                            y2={-48 * Math.sin(lightAngle * Math.PI / 180)}
                            stroke="url(#aniso-e-ray)"
                            strokeWidth="2"
                          />
                          <line
                            x1={30 * Math.cos(lightAngle * Math.PI / 180) - 3}
                            y1={-30 * Math.sin(lightAngle * Math.PI / 180) - 3}
                            x2={30 * Math.cos(lightAngle * Math.PI / 180) + 3}
                            y2={-30 * Math.sin(lightAngle * Math.PI / 180) + 3}
                            stroke="#44ff44"
                            strokeWidth="1.5"
                          />
                          <line
                            x1={30 * Math.cos(lightAngle * Math.PI / 180) - 3}
                            y1={-30 * Math.sin(lightAngle * Math.PI / 180) + 3}
                            x2={30 * Math.cos(lightAngle * Math.PI / 180) + 3}
                            y2={-30 * Math.sin(lightAngle * Math.PI / 180) - 3}
                            stroke="#44ff44"
                            strokeWidth="1.5"
                          />
                          <text
                            x={56 * Math.cos(lightAngle * Math.PI / 180)}
                            y={-56 * Math.sin(lightAngle * Math.PI / 180)}
                            textAnchor="middle"
                            style={{ fontSize: '9px' }}
                            className="fill-green-400"
                          >
                            e
                          </text>
                        </motion.g>
                      </>
                    )}

                    {/* 角度标注 */}
                    <path
                      d={`M -24,0 A 24,24 0 0,${lightAngle > 0 ? 0 : 1} ${-24 * Math.cos(lightAngle * Math.PI / 180)},${24 * Math.sin(lightAngle * Math.PI / 180)}`}
                      fill="none"
                      stroke={dt.textSecondary}
                      strokeWidth="1"
                    />
                    <text
                      x={-34 * Math.cos(lightAngle * Math.PI / 360)}
                      y={16 * Math.sin(lightAngle * Math.PI / 360)}
                      style={{ fontSize: '9px' }}
                      fill={dt.textSecondary}
                    >
                      θ={lightAngle}°
                    </text>
                  </g>
                )}

                {/* 应力示意图 - 仅用于stressed材料 */}
                {materialType === 'stressed' && (
                  <g transform="translate(155, 270)">
                    <rect
                      x="-60" y="-12"
                      width="120" height="24"
                      fill={`${material.color}20`}
                      stroke={material.color}
                      strokeWidth="1.5"
                      rx="4"
                    />
                    {/* 应力箭头 */}
                    <motion.g
                      animate={{
                        x: [-2, 2, -2],
                      }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <polygon points="-72,-6 -60,-6 -60,-10 -54,0 -60,10 -60,6 -72,6" fill="#ef4444" />
                      <polygon points="72,-6 60,-6 60,-10 54,0 60,10 60,6 72,6" fill="#ef4444" />
                    </motion.g>
                    <text
                      x="0" y="3"
                      textAnchor="middle"
                      style={{ fontSize: '9px' }}
                      fill={dt.textPrimary}
                    >
                      {isZh ? `应力: ${stressLevel}%` : `Stress: ${stressLevel}%`}
                    </text>
                  </g>
                )}

                {/* 折射率数值显示 */}
                <g transform="translate(330, 90)">
                  <rect
                    x="-48" y="-18"
                    width="96" height={materialType === 'biaxial' ? '62' : '50'}
                    rx="5"
                    fill={dt.canvasBgAlt}
                    stroke={dt.isDark ? '#334155' : '#e2e8f0'}
                    strokeWidth="1"
                  />
                  <text
                    x="0" y="-4"
                    textAnchor="middle"
                    style={{ fontSize: '9px', fontWeight: 600 }}
                    fill={dt.isDark ? '#22d3ee' : '#0891b2'}
                  >
                    {isZh ? '折射率' : 'Refractive Index'}
                  </text>
                  <text
                    x="0" y="10"
                    textAnchor="middle"
                    style={{ fontSize: '9px' }}
                    fill={dt.isDark ? '#ff6b6b' : '#dc2626'}
                  >
                    n<tspan fontSize="6" dy="1">o</tspan><tspan dy="-1"> = {material.no.toFixed(3)}</tspan>
                  </text>
                  <text
                    x="0" y="23"
                    textAnchor="middle"
                    style={{ fontSize: '9px' }}
                    fill={dt.isDark ? '#4ade80' : '#16a34a'}
                  >
                    n<tspan fontSize="6" dy="1">e</tspan><tspan dy="-1"> = {material.ne.toFixed(3)}</tspan>
                  </text>
                  {materialType === 'biaxial' && material.ny && (
                    <text
                      x="0" y="36"
                      textAnchor="middle"
                      style={{ fontSize: '9px' }}
                      fill={dt.isDark ? '#a78bfa' : '#7c3aed'}
                    >
                      n<tspan fontSize="6" dy="1">y</tspan><tspan dy="-1"> = {material.ny.toFixed(3)}</tspan>
                    </text>
                  )}
                </g>

                {/* 图例 */}
                <g transform="translate(65, 265)">
                  <text
                    x="0" y="0"
                    style={{ fontSize: '9px', fontWeight: 600 }}
                    fill={dt.textPrimary}
                  >
                    {isZh ? '图例' : 'Legend'}
                  </text>
                  <circle cx="6" cy="12" r="2.5" fill="none" stroke="#ff4444" strokeWidth="1.5" />
                  <text x="14" y="14" style={{ fontSize: '8px' }} fill={dt.textSecondary}>
                    {isZh ? 'o光（寻常光）' : 'o-ray (ordinary)'}
                  </text>
                  <g transform="translate(0, 14)">
                    <line x1="4" y1="10" x2="8" y2="14" stroke="#44ff44" strokeWidth="1.5" />
                    <line x1="8" y1="10" x2="4" y2="14" stroke="#44ff44" strokeWidth="1.5" />
                  </g>
                  <text x="14" y="26" style={{ fontSize: '8px' }} fill={dt.textSecondary}>
                    {isZh ? 'e光（非寻常光）' : 'e-ray (extraordinary)'}
                  </text>
                </g>
              </svg>
            </VisualizationPanel>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                label={isZh ? '有效折射率' : 'Effective n'}
                value={indicatrixParams.nEffective.toFixed(4)}
                color="cyan"
              />
              <StatCard
                label={isZh ? '双折射 Δn' : 'Birefringence Δn'}
                value={effectiveBirefringence.toFixed(4)}
                color="green"
              />
              <StatCard
                label={isZh ? '相位延迟' : 'Phase Delay'}
                value={`${(indicatrixParams.phaseDelay * 180 / Math.PI).toFixed(1)}`}
                unit="°"
                color="purple"
              />
            </div>
          </div>
        }
        controls={
          <div className="space-y-5">
            <ControlPanel title={isZh ? '材料类型' : 'Material Type'}>
              <PresetButtons
                options={[
                  { label: isZh ? '各向同性' : 'Isotropic', value: 'isotropic' },
                  { label: isZh ? '单轴晶体' : 'Uniaxial', value: 'uniaxial' },
                  { label: isZh ? '双轴晶体' : 'Biaxial', value: 'biaxial' },
                  { label: isZh ? '应力材料' : 'Stressed', value: 'stressed' },
                ]}
                value={materialType}
                onChange={(v) => setMaterialType(v as MaterialType)}
              />
            </ControlPanel>

            <ControlPanel title={isZh ? '参数控制' : 'Parameters'}>
              <SliderControl
                label={isZh ? '光与光轴夹角 θ' : 'Angle to Optic Axis θ'}
                value={lightAngle}
                min={0}
                max={90}
                step={1}
                unit="°"
                onChange={setLightAngle}
                color="cyan"
              />

              {materialType === 'stressed' && (
                <SliderControl
                  label={isZh ? '应力水平' : 'Stress Level'}
                  value={stressLevel}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={setStressLevel}
                  color="green"
                />
              )}

              <Toggle
                label={isZh ? '显示光轴' : 'Show Optic Axis'}
                checked={showOpticAxis}
                onChange={setShowOpticAxis}
              />
              <Toggle
                label={isZh ? '显示光率体' : 'Show Indicatrix'}
                checked={showIndicatrix}
                onChange={setShowIndicatrix}
              />
              <Toggle
                label={isZh ? '动画效果' : 'Animation'}
                checked={animating}
                onChange={setAnimating}
              />
            </ControlPanel>
          </div>
        }
      />

      {/* Knowledge Cards */}
      <InfoGrid columns={2}>
        <div className={cn(
          'rounded-2xl border p-4 space-y-2 text-xs',
          dt.isDark
            ? 'bg-slate-800/30 border-slate-700/40'
            : 'bg-white/60 border-slate-200/60'
        )}>
          <h4 className={cn('text-sm font-semibold mb-2', dt.isDark ? 'text-cyan-400' : 'text-cyan-600')}>
            {isZh ? '各向异性类型' : 'Anisotropy Types'}
          </h4>
          <div className={cn("space-y-2", dt.bodyClass)}>
            <p>
              <strong>{isZh ? '各向同性：' : 'Isotropic: '}</strong>
              {isZh
                ? '光学性质与方向无关，如玻璃、水'
                : 'Properties same in all directions, e.g. glass, water'}
            </p>
            <p>
              <strong>{isZh ? '单轴晶体：' : 'Uniaxial: '}</strong>
              {isZh
                ? '有一个光轴，如方解石、石英'
                : 'One optic axis, e.g. calcite, quartz'}
            </p>
            <p>
              <strong>{isZh ? '双轴晶体：' : 'Biaxial: '}</strong>
              {isZh
                ? '有两个光轴，如云母、长石'
                : 'Two optic axes, e.g. mica, feldspar'}
            </p>
            <p>
              <strong>{isZh ? '应力诱导：' : 'Stress-induced: '}</strong>
              {isZh
                ? '外力使各向同性材料产生双折射'
                : 'External stress causes birefringence in isotropic materials'}
            </p>
          </div>
        </div>
        <div className={cn(
          'rounded-2xl border p-4 space-y-2 text-xs',
          dt.isDark
            ? 'bg-slate-800/30 border-slate-700/40'
            : 'bg-white/60 border-slate-200/60'
        )}>
          <h4 className={cn('text-sm font-semibold mb-2', dt.isDark ? 'text-purple-400' : 'text-purple-600')}>
            {isZh ? '物理意义' : 'Physical Significance'}
          </h4>
          <div className={cn("space-y-2", dt.bodyClass)}>
            <p>
              <strong>{isZh ? '光率体：' : 'Indicatrix: '}</strong>
              {isZh
                ? '折射率随方向变化的几何表示，各向同性为球，单轴为旋转椭球'
                : 'Geometric representation of refractive index variation; sphere for isotropic, ellipsoid of revolution for uniaxial'}
            </p>
            <p>
              <strong>{isZh ? '双折射：' : 'Birefringence: '}</strong>
              {isZh
                ? 'Δn = |ne - no|，决定了o光和e光之间的相位差'
                : 'Δn = |ne - no|, determines the phase difference between o-ray and e-ray'}
            </p>
          </div>
        </div>
      </InfoGrid>
    </div>
  )
}
