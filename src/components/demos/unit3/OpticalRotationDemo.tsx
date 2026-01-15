/**
 * 旋光性演示 - Unit 3
 * 演示糖溶液等手性物质对偏振面的旋转
 * 采用纯DOM + SVG + Framer Motion一体化设计
 *
 * 增强:
 * - 溶液波动动画效果
 * - 暗色模式文字对比度优化
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

// 旋光率数据 (deg/(dm·g/mL)) - 以钠黄光 (589nm) 为标准
const SPECIFIC_ROTATIONS: Record<string, { value: number; direction: 'd' | 'l' }> = {
  sucrose: { value: 66.5, direction: 'd' }, // 蔗糖 (右旋)
  glucose: { value: 52.7, direction: 'd' }, // 葡萄糖 (右旋)
  fructose: { value: -92, direction: 'l' }, // 果糖 (左旋)
  tartaric: { value: 12, direction: 'd' }, // 酒石酸 (右旋)
}

// 光谱线定义
interface SpectralLine {
  id: string
  name: string
  wavelength: number // nm
  color: string // hex color
}

const SPECTRAL_LINES: SpectralLine[] = [
  { id: 'na-d', name: '钠黄光 (Na D)', wavelength: 589, color: '#fbbf24' },
  { id: 'h-alpha', name: '氢红光 (Hα)', wavelength: 656, color: '#ef4444' },
  { id: 'hg-green', name: '汞绿光', wavelength: 546, color: '#22c55e' },
  { id: 'h-beta', name: '氢蓝光 (Hβ)', wavelength: 486, color: '#3b82f6' },
  { id: 'hg-violet', name: '汞紫光', wavelength: 436, color: '#a855f7' },
]

// 多色光各波长成分 (用于色散效果)
const POLYCHROMATIC_COMPONENTS = [
  { wavelength: 656, color: '#ef4444', name: '红' }, // Hα
  { wavelength: 589, color: '#fbbf24', name: '黄' }, // Na D
  { wavelength: 546, color: '#22c55e', name: '绿' }, // Hg green
  { wavelength: 486, color: '#3b82f6', name: '蓝' }, // Hβ
  { wavelength: 436, color: '#a855f7', name: '紫' }, // Hg violet
]

// 根据波长计算比旋光度 (Drude方程简化形式)
// [α]λ ≈ [α]D × (589/λ)²
function calculateSpecificRotationAtWavelength(specificRotationD: number, wavelength: number): number {
  return specificRotationD * Math.pow(589 / wavelength, 2)
}

// 计算旋光角度
function calculateRotation(specificRotation: number, concentration: number, pathLength: number): number {
  // α = [α] × c × l
  return specificRotation * concentration * pathLength
}

// 光源模式类型
type LightMode = 'monochromatic' | 'polychromatic'

// 旋光仪光路图
function OpticalRotationDiagram({
  substance,
  concentration,
  pathLength,
  analyzerAngle,
  lightMode,
  wavelength,
  lightColor,
  theme,
}: {
  substance: string
  concentration: number
  pathLength: number
  analyzerAngle: number
  lightMode: LightMode
  wavelength: number
  lightColor: string
  theme: 'dark' | 'light'
}) {
  const specificRotationD = SPECIFIC_ROTATIONS[substance]?.value || 66.5

  // 根据波长计算实际比旋光度
  const specificRotation = lightMode === 'monochromatic'
    ? calculateSpecificRotationAtWavelength(specificRotationD, wavelength)
    : specificRotationD // 多色光模式下使用标准值（各波长分开显示）

  const rotationAngle = calculateRotation(specificRotation, concentration, pathLength)
  const isRightRotation = rotationAngle >= 0

  // 检偏器与偏振光的角度差
  const angleDiff = Math.abs(rotationAngle - analyzerAngle)
  const intensity = Math.pow(Math.cos((angleDiff * Math.PI) / 180), 2)

  // 多色光模式下计算各波长的旋转角和强度
  const polychromaticData = useMemo(() => {
    if (lightMode !== 'polychromatic') return []
    return POLYCHROMATIC_COMPONENTS.map(comp => {
      const specRot = calculateSpecificRotationAtWavelength(specificRotationD, comp.wavelength)
      const rot = calculateRotation(specRot, concentration, pathLength)
      const diff = Math.abs(rot - analyzerAngle)
      const inten = Math.pow(Math.cos((diff * Math.PI) / 180), 2)
      return {
        ...comp,
        rotation: rot,
        intensity: inten,
      }
    })
  }, [lightMode, specificRotationD, concentration, pathLength, analyzerAngle])

  return (
    <svg viewBox="0 0 700 300" className="w-full h-auto">
      <defs>
        <linearGradient id="tubeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3" />
        </linearGradient>
        {/* 增强的溶液渐变 - 更像真实液体 */}
        <linearGradient id="solutionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" stopOpacity={0.15 + concentration * 0.35}>
            <animate attributeName="stop-opacity" values={`${0.15 + concentration * 0.35};${0.25 + concentration * 0.4};${0.15 + concentration * 0.35}`} dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="30%" stopColor="#fbbf24" stopOpacity={0.25 + concentration * 0.45}>
            <animate attributeName="stop-opacity" values={`${0.25 + concentration * 0.45};${0.35 + concentration * 0.5};${0.25 + concentration * 0.45}`} dur="2.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="70%" stopColor="#f59e0b" stopOpacity={0.35 + concentration * 0.5}>
            <animate attributeName="stop-opacity" values={`${0.35 + concentration * 0.5};${0.45 + concentration * 0.55};${0.35 + concentration * 0.5}`} dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#d97706" stopOpacity={0.2 + concentration * 0.4}>
            <animate attributeName="stop-opacity" values={`${0.2 + concentration * 0.4};${0.3 + concentration * 0.45};${0.2 + concentration * 0.4}`} dur="3.5s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        {/* 液体波纹效果 */}
        <filter id="liquidWave" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="2" seed="1" result="noise">
            <animate attributeName="baseFrequency" values="0.02 0.05;0.025 0.06;0.02 0.05" dur="4s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="lightGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* 气泡效果 */}
        <radialGradient id="bubbleGradient" cx="30%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 背景 */}
      <rect x="0" y="0" width="700" height="300" fill={theme === 'dark' ? '#0f172a' : '#f8fafc'} rx="8" />

      {/* 光源 */}
      <g transform="translate(50, 150)">
        {lightMode === 'monochromatic' ? (
          <motion.circle
            r="20"
            fill={lightColor}
            filter="url(#lightGlow)"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ) : (
          /* 多色光源 - 彩虹渐变 */
          <>
            <defs>
              <radialGradient id="polychromaticGradient">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#22c55e" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
              </radialGradient>
            </defs>
            <motion.circle
              r="20"
              fill="url(#polychromaticGradient)"
              filter="url(#lightGlow)"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </>
        )}
        <text x="0" y="45" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="11">
          {lightMode === 'monochromatic' ? '单色光源' : '多色光源'}
        </text>
      </g>

      {/* 光束到起偏器 */}
      {lightMode === 'monochromatic' ? (
        <motion.rect
          x="70"
          y="145"
          width="50"
          height="10"
          fill={lightColor}
          opacity="0.7"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        /* 多色光 - 多条彩色光束 */
        <g>
          {POLYCHROMATIC_COMPONENTS.map((comp, i) => (
            <motion.rect
              key={comp.wavelength}
              x="70"
              y={140 + i * 4}
              width="50"
              height="3"
              fill={comp.color}
              opacity="0.7"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
            />
          ))}
        </g>
      )}

      {/* 起偏器 */}
      <g transform="translate(130, 150)">
        <rect x="-8" y="-40" width="16" height="80" fill={theme === 'dark' ? '#1e3a5f' : '#e0f2fe'} stroke="#22d3ee" strokeWidth="2" rx="3" />
        <line x1="0" y1="-30" x2="0" y2="30" stroke="#22d3ee" strokeWidth="3" />
        <text x="0" y="55" textAnchor="middle" fill="#22d3ee" fontSize="11">起偏器</text>
        <text x="0" y="68" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">0°</text>
      </g>

      {/* 偏振光 (水平偏振) */}
      {lightMode === 'monochromatic' ? (
        <rect x="146" y="146" width="50" height="8" fill={lightColor} opacity="0.8" />
      ) : (
        <g>
          {POLYCHROMATIC_COMPONENTS.map((comp, i) => (
            <rect
              key={comp.wavelength}
              x="146"
              y={143 + i * 3}
              width="50"
              height="2"
              fill={comp.color}
              opacity="0.8"
            />
          ))}
        </g>
      )}

      {/* 偏振指示器 - 入射 */}
      <g transform="translate(175, 150)">
        <line x1="-12" y1="0" x2="12" y2="0" stroke={lightColor} strokeWidth="2" />
        <text x="0" y="-20" textAnchor="middle" fill={lightColor} fontSize="9">0°</text>
      </g>

      {/* 样品管 */}
      <g transform="translate(315, 150)">
        {/* 管壁 */}
        <rect
          x={-80}
          y="-30"
          width={160 + pathLength * 60}
          height="60"
          fill="url(#tubeGradient)"
          stroke="#67e8f9"
          strokeWidth="2"
          rx="30"
        />
        {/* 溶液 - 带波动效果 */}
        <rect
          x={-75}
          y="-25"
          width={150 + pathLength * 60}
          height="50"
          fill="url(#solutionGradient)"
          rx="25"
          filter="url(#liquidWave)"
        />
        {/* 气泡动画 */}
        {concentration > 0.2 && (
          <>
            <motion.circle
              cx={-50 + Math.random() * 20}
              cy={10}
              r={2}
              fill="url(#bubbleGradient)"
              animate={{
                cy: [-15, -25],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.circle
              cx={-20 + pathLength * 30}
              cy={5}
              r={3}
              fill="url(#bubbleGradient)"
              animate={{
                cy: [-10, -22],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 0.8,
              }}
            />
            <motion.circle
              cx={10 + pathLength * 40}
              cy={12}
              r={2.5}
              fill="url(#bubbleGradient)"
              animate={{
                cy: [-8, -20],
                opacity: [0.7, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: 1.5,
              }}
            />
          </>
        )}
        {/* 标注 */}
        <text x={(pathLength * 60) / 2} y="50" textAnchor="middle" fill="#67e8f9" fontSize="11">
          样品管 (L={pathLength.toFixed(1)} dm)
        </text>
        <text x={(pathLength * 60) / 2} y="65" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">
          c={concentration.toFixed(2)} g/mL
        </text>
      </g>

      {/* 偏振面旋转指示 - 沿管路显示螺旋演化 */}
      {lightMode === 'monochromatic' ? (
        [0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => {
          const x = 240 + t * (100 + pathLength * 60)
          const currentAngle = rotationAngle * t
          // 渐变透明度使演化过程更清晰
          const opacity = 0.3 + t * 0.5
          return (
            <g key={i} transform={`translate(${x}, 150)`}>
              {/* 偏振方向线 */}
              <motion.line
                x1="-12"
                y1="0"
                x2="12"
                y2="0"
                stroke={lightColor}
                strokeWidth="2.5"
                transform={`rotate(${currentAngle})`}
                initial={{ opacity: 0 }}
                animate={{ opacity }}
                transition={{ delay: i * 0.08 }}
              />
              {/* 垂直方向参考线（辅助理解旋转） */}
              <motion.line
                x1="0"
                y1="-8"
                x2="0"
                y2="8"
                stroke={lightColor}
                strokeWidth="1"
                strokeDasharray="2 2"
                transform={`rotate(${currentAngle})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: opacity * 0.4 }}
                transition={{ delay: i * 0.08 }}
              />
            </g>
          )
        })
      ) : (
        /* 多色光 - 各波长分开演化 */
        [0, 0.5, 1].map((t, i) => {
          const x = 240 + t * (100 + pathLength * 60)
          const opacity = 0.4 + t * 0.4
          return (
            <g key={i} transform={`translate(${x}, 150)`}>
              {polychromaticData.map((comp, j) => {
                const currentAngle = comp.rotation * t
                return (
                  <motion.line
                    key={comp.wavelength}
                    x1="-10"
                    y1="0"
                    x2="10"
                    y2="0"
                    stroke={comp.color}
                    strokeWidth="2"
                    transform={`rotate(${currentAngle})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: opacity * 0.7 }}
                    transition={{ delay: i * 0.08 + j * 0.02 }}
                  />
                )
              })}
            </g>
          )
        })
      )}

      {/* 出射偏振光 */}
      {lightMode === 'monochromatic' ? (
        <rect
          x={410 + pathLength * 60}
          y="146"
          width="60"
          height="8"
          fill={lightColor}
          opacity="0.8"
        />
      ) : (
        /* 多色光 - 各波长因旋转角不同而分开 */
        <g>
          {polychromaticData.map((comp) => {
            // 根据旋转角差异计算垂直偏移（展示色散效果）
            const angleOffset = comp.rotation - polychromaticData[2].rotation // 以绿光为基准
            const yOffset = angleOffset * 0.15
            return (
              <rect
                key={comp.wavelength}
                x={410 + pathLength * 60}
                y={147 + yOffset}
                width="60"
                height="2"
                fill={comp.color}
                opacity="0.8"
              />
            )
          })}
        </g>
      )}

      {/* 偏振指示器 - 出射 */}
      <g transform={`translate(${440 + pathLength * 60}, 150)`}>
        {lightMode === 'monochromatic' ? (
          <>
            <motion.line
              x1="-12"
              y1="0"
              x2="12"
              y2="0"
              stroke={lightColor}
              strokeWidth="2.5"
              transform={`rotate(${rotationAngle})`}
            />
            <text x="0" y="-20" textAnchor="middle" fill={lightColor} fontSize="9">
              {rotationAngle >= 0 ? '+' : ''}{rotationAngle.toFixed(1)}°
            </text>
          </>
        ) : (
          /* 多色光 - 显示各波长的旋转角 */
          <>
            {polychromaticData.map((comp) => (
              <motion.line
                key={comp.wavelength}
                x1="-10"
                y1="0"
                x2="10"
                y2="0"
                stroke={comp.color}
                strokeWidth="1.5"
                transform={`rotate(${comp.rotation})`}
                opacity="0.7"
              />
            ))}
            <text x="0" y="-25" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="8">
              色散
            </text>
          </>
        )}
      </g>

      {/* 检偏器 */}
      <g transform={`translate(${500 + pathLength * 60}, 150)`}>
        <rect x="-8" y="-40" width="16" height="80" fill={theme === 'dark' ? '#1e3a5f' : '#ede9fe'} stroke="#a78bfa" strokeWidth="2" rx="3" />
        <motion.line
          x1="0"
          y1="-30"
          x2="0"
          y2="30"
          stroke="#a78bfa"
          strokeWidth="3"
          transform={`rotate(${analyzerAngle})`}
        />
        <text x="0" y="55" textAnchor="middle" fill="#a78bfa" fontSize="11">检偏器</text>
        <text x="0" y="68" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">{analyzerAngle.toFixed(0)}°</text>
      </g>

      {/* 到屏幕的光束 */}
      {lightMode === 'monochromatic' ? (
        <rect
          x={516 + pathLength * 60}
          y="146"
          width="40"
          height="8"
          fill={lightColor}
          opacity={Math.max(0.2, intensity)}
        />
      ) : (
        /* 多色光 - 各波长不同强度 */
        <g>
          {polychromaticData.map((comp) => {
            const angleOffset = comp.rotation - polychromaticData[2].rotation
            const yOffset = angleOffset * 0.15
            return (
              <rect
                key={comp.wavelength}
                x={516 + pathLength * 60}
                y={147 + yOffset}
                width="40"
                height="2"
                fill={comp.color}
                opacity={Math.max(0.2, comp.intensity)}
              />
            )
          })}
        </g>
      )}

      {/* 屏幕/探测器 */}
      <g transform={`translate(${580 + pathLength * 60}, 150)`}>
        {lightMode === 'monochromatic' ? (
          /* 单色光 - 显示光源颜色 */
          <>
            <motion.rect
              x="-25"
              y="-35"
              width="50"
              height="70"
              fill={lightColor}
              opacity={intensity * 0.8}
              stroke="#475569"
              strokeWidth="2"
              rx="6"
              animate={{ opacity: [intensity * 0.7, intensity * 0.9, intensity * 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <text x="0" y="55" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="11">
              {(intensity * 100).toFixed(0)}%
            </text>
          </>
        ) : (
          /* 多色光 - 显示各波长强度条 */
          <>
            <rect
              x="-25"
              y="-35"
              width="50"
              height="70"
              fill={theme === 'dark' ? '#1e293b' : '#f1f5f9'}
              stroke={theme === 'dark' ? '#475569' : '#cbd5e1'}
              strokeWidth="2"
              rx="6"
            />
            {polychromaticData.map((comp, i) => (
              <g key={comp.wavelength}>
                <rect
                  x="-20"
                  y={-25 + i * 12}
                  width={36 * comp.intensity}
                  height="8"
                  fill={comp.color}
                  opacity={0.8}
                  rx="2"
                />
                <text
                  x="22"
                  y={-19 + i * 12}
                  fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
                  fontSize="7"
                >
                  {(comp.intensity * 100).toFixed(0)}%
                </text>
              </g>
            ))}
            <text x="0" y="55" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="9">
              色散强度
            </text>
          </>
        )}
      </g>

      {/* 旋转方向标注 */}
      {lightMode === 'monochromatic' ? (
        <g transform="translate(350, 230)">
          <rect x="-80" y="-15" width="160" height="30" fill={theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(241,245,249,0.9)'} rx="6" />
          <text x="0" y="5" textAnchor="middle" fill={lightColor} fontSize="13" fontWeight="500">
            {isRightRotation ? '右旋 (d/+)' : '左旋 (l/-)'}: α = {rotationAngle.toFixed(1)}°
          </text>
        </g>
      ) : (
        <g transform="translate(350, 230)">
          <rect x="-100" y="-15" width="200" height="30" fill={theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(241,245,249,0.9)'} rx="6" />
          <text x="0" y="5" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#475569'} fontSize="12" fontWeight="500">
            旋光色散: 短波长旋转角更大 (Drude方程)
          </text>
        </g>
      )}

      {/* 旋转弧线指示 - 仅单色光模式显示 */}
      {lightMode === 'monochromatic' && (
        <g transform={`translate(${440 + pathLength * 60}, 90)`}>
          <path
            d={`M 0 0 A 25 25 0 ${Math.abs(rotationAngle) > 180 ? 1 : 0} ${isRightRotation ? 1 : 0} ${25 * Math.sin((rotationAngle * Math.PI) / 180)} ${25 - 25 * Math.cos((rotationAngle * Math.PI) / 180)}`}
            fill="none"
            stroke={lightColor}
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <motion.polygon
            points="-4,-8 4,0 -4,8"
            fill={lightColor}
            transform={`translate(${25 * Math.sin((rotationAngle * Math.PI) / 180)}, ${25 - 25 * Math.cos((rotationAngle * Math.PI) / 180)}) rotate(${rotationAngle + 90})`}
          />
        </g>
      )}
    </svg>
  )
}

// 浓度-旋光角曲线
function RotationChart({
  substance,
  pathLength,
  currentConcentration,
  theme,
}: {
  substance: string
  pathLength: number
  currentConcentration: number
  theme: 'dark' | 'light'
}) {
  const specificRotation = SPECIFIC_ROTATIONS[substance]?.value || 66.5
  const isPositive = specificRotation >= 0
  const maxRotation = Math.abs(specificRotation * 1.0 * pathLength)

  const { pathData } = useMemo(() => {
    const points: string[] = []

    for (let c = 0; c <= 1; c += 0.05) {
      const rotation = calculateRotation(specificRotation, c, pathLength)
      const x = 40 + c * 220
      const y = 100 - (rotation / maxRotation) * 60

      points.push(`${c === 0 ? 'M' : 'L'} ${x},${y}`)
    }

    return { pathData: points.join(' ') }
  }, [specificRotation, pathLength, maxRotation])

  const currentRotation = calculateRotation(specificRotation, currentConcentration, pathLength)
  const currentX = 40 + currentConcentration * 220
  const currentY = 100 - (currentRotation / maxRotation) * 60

  return (
    <svg viewBox="0 0 300 160" className="w-full h-auto">
      <rect x="40" y="30" width="220" height="100" fill={theme === 'dark' ? '#1e293b' : '#f1f5f9'} rx="4" />

      {/* 坐标轴 */}
      <line x1="40" y1="100" x2="270" y2="100" stroke={theme === 'dark' ? '#475569' : '#94a3b8'} strokeWidth="1" />
      <line x1="40" y1="30" x2="40" y2="130" stroke={theme === 'dark' ? '#475569' : '#94a3b8'} strokeWidth="1" />

      {/* X轴刻度 */}
      {[0, 0.5, 1].map((c) => {
        const x = 40 + c * 220
        return (
          <g key={c}>
            <line x1={x} y1="130" x2={x} y2="135" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} strokeWidth="1" />
            <text x={x} y="147" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">{c}</text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      <text x="30" y="104" textAnchor="end" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">0°</text>
      <text x="30" y="44" textAnchor="end" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">
        {isPositive ? '+' : ''}{maxRotation.toFixed(0)}°
      </text>

      {/* 曲线 */}
      <path
        d={pathData}
        fill="none"
        stroke={isPositive ? '#22d3ee' : '#f472b6'}
        strokeWidth="2.5"
      />

      {/* 当前点 */}
      <motion.circle
        cx={currentX}
        cy={currentY}
        r="6"
        fill="#fbbf24"
        animate={{ cx: currentX, cy: currentY }}
        transition={{ duration: 0.2 }}
      />

      {/* 轴标签 */}
      <text x="155" y="158" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="11">浓度 c (g/mL)</text>
      <text x="15" y="70" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10" transform="rotate(-90 15 70)">α</text>
    </svg>
  )
}

// 主演示组件
export function OpticalRotationDemo() {
  const { theme } = useTheme()
  const [substance, setSubstance] = useState('sucrose')
  const [concentration, setConcentration] = useState(0.3)
  const [pathLength, setPathLength] = useState(1.0)
  const [analyzerAngle, setAnalyzerAngle] = useState(0)

  // 光源设置
  const [lightMode, setLightMode] = useState<LightMode>('monochromatic')
  const [selectedWavelengthId, setSelectedWavelengthId] = useState('na-d')

  // 获取选中的光谱线信息
  const selectedSpectralLine = SPECTRAL_LINES.find(l => l.id === selectedWavelengthId) || SPECTRAL_LINES[0]
  const lightColor = selectedSpectralLine.color
  const wavelength = selectedSpectralLine.wavelength

  // 根据波长计算实际比旋光度
  const specificRotationD = SPECIFIC_ROTATIONS[substance]?.value || 66.5
  const specificRotation = lightMode === 'monochromatic'
    ? calculateSpecificRotationAtWavelength(specificRotationD, wavelength)
    : specificRotationD

  const rotationAngle = calculateRotation(specificRotation, concentration, pathLength)

  // 透过强度
  const angleDiff = Math.abs(rotationAngle - analyzerAngle)
  const intensity = Math.pow(Math.cos((angleDiff * Math.PI) / 180), 2)

  // 物质选项
  const substances = [
    { value: 'sucrose', label: '蔗糖', rotation: '+66.5°' },
    { value: 'glucose', label: '葡萄糖', rotation: '+52.7°' },
    { value: 'fructose', label: '果糖', rotation: '-92.0°' },
    { value: 'tartaric', label: '酒石酸', rotation: '+12.0°' },
  ]

  // 主题相关样式
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className={cn(
          "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
          theme === 'dark'
            ? 'from-white via-cyan-100 to-white'
            : 'from-gray-800 via-cyan-600 to-gray-800'
        )}>
          旋光性交互演示
        </h2>
        <p className={textMuted}>
          α = [α] × c × L —— 探索手性物质对偏振面的旋转效应
        </p>
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="space-y-4">
          <div className={cn(
            "rounded-xl border p-4",
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-cyan-950/90 border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)]'
              : 'bg-gradient-to-br from-slate-50 via-white to-cyan-50 border-cyan-200 shadow-lg'
          )}>
            <OpticalRotationDiagram
              substance={substance}
              concentration={concentration}
              pathLength={pathLength}
              analyzerAngle={analyzerAngle}
              lightMode={lightMode}
              wavelength={wavelength}
              lightColor={lightColor}
              theme={theme}
            />
          </div>

          {/* 测量结果摘要 */}
          <div className={cn(
            "rounded-xl border p-4",
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-600/30'
              : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-sm'
          )}>
            {/* 光源信息 */}
            <div className={cn("flex items-center justify-center gap-2 mb-3 pb-2 border-b", theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200')}>
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: lightMode === 'monochromatic' ? lightColor : '#a855f7' }}
              />
              <span className={cn("text-sm", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {lightMode === 'monochromatic'
                  ? `${selectedSpectralLine.name} (λ = ${wavelength} nm)`
                  : '多色光 (旋光色散)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className={cn("p-3 rounded-lg", theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100')}>
                <div className={cn("text-xs mb-1", theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>旋光角 α</div>
                <div
                  className="font-mono text-xl"
                  style={{ color: lightMode === 'monochromatic' ? lightColor : (rotationAngle >= 0 ? '#22d3ee' : '#f472b6') }}
                >
                  {rotationAngle >= 0 ? '+' : ''}{rotationAngle.toFixed(1)}°
                </div>
              </div>
              <div className={cn("p-3 rounded-lg", theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100')}>
                <div className={cn("text-xs mb-1", theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>旋光方向</div>
                <div
                  className="font-bold text-lg"
                  style={{ color: lightMode === 'monochromatic' ? lightColor : (rotationAngle >= 0 ? '#22d3ee' : '#f472b6') }}
                >
                  {rotationAngle >= 0 ? '右旋 (d)' : '左旋 (l)'}
                </div>
              </div>
              <div className={cn("p-3 rounded-lg", theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100')}>
                <div className={cn("text-xs mb-1", theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>透过强度</div>
                <div
                  className="font-mono text-xl"
                  style={{ color: lightMode === 'monochromatic' ? lightColor : '#a78bfa' }}
                >
                  {(intensity * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：控制与学习 */}
        <div className="space-y-4">
          {/* 光源设置 */}
          <ControlPanel title="光源设置">
            {/* 光源模式切换 */}
            <div className="flex gap-2 mb-3">
              <motion.button
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                  lightMode === 'monochromatic'
                    ? theme === 'dark'
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                      : 'bg-amber-100 border border-amber-300 text-amber-700'
                    : theme === 'dark'
                      ? 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:bg-slate-700/50'
                      : 'bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200'
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setLightMode('monochromatic')}
              >
                单色光
              </motion.button>
              <motion.button
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                  lightMode === 'polychromatic'
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-red-500/20 via-green-500/20 to-violet-500/20 border border-purple-500/50 text-purple-300'
                      : 'bg-gradient-to-r from-red-100 via-green-100 to-violet-100 border border-purple-300 text-purple-700'
                    : theme === 'dark'
                      ? 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:bg-slate-700/50'
                      : 'bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200'
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setLightMode('polychromatic')}
              >
                多色光
              </motion.button>
            </div>

            {/* 单色光波长选择 */}
            {lightMode === 'monochromatic' && (
              <div className="space-y-2">
                <div className={cn("text-xs mb-2", theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>选择光谱线</div>
                {SPECTRAL_LINES.map((line) => (
                  <motion.button
                    key={line.id}
                    className={cn(
                      "w-full py-2 px-3 rounded-lg flex justify-between items-center transition-colors",
                      selectedWavelengthId === line.id
                        ? 'border-2'
                        : theme === 'dark'
                          ? 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:bg-slate-700/50'
                          : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
                    )}
                    style={selectedWavelengthId === line.id ? {
                      backgroundColor: theme === 'dark' ? `${line.color}20` : `${line.color}15`,
                      borderColor: `${line.color}80`,
                      color: line.color,
                    } : {}}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedWavelengthId(line.id)}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: line.color }}
                      />
                      <span className="font-medium">{line.name}</span>
                    </span>
                    <span className="font-mono text-sm opacity-80">
                      {line.wavelength} nm
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* 多色光说明 */}
            {lightMode === 'polychromatic' && (
              <div className={cn("p-3 rounded-lg border", theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-purple-50 border-purple-200')}>
                <div className={cn("text-xs space-y-2", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  <p className={cn("font-medium", theme === 'dark' ? 'text-purple-400' : 'text-purple-600')}>旋光色散效应</p>
                  <p>不同波长的光具有不同的比旋光度，导致各色光旋转角度不同。</p>
                  <p className={cn("font-mono text-[10px]", theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                    Drude方程: [α]<sub>λ</sub> ≈ [α]<sub>D</sub> × (589/λ)²
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {POLYCHROMATIC_COMPONENTS.map(comp => (
                      <span
                        key={comp.wavelength}
                        className="px-2 py-0.5 rounded text-[10px] font-mono"
                        style={{ backgroundColor: theme === 'dark' ? `${comp.color}30` : `${comp.color}20`, color: comp.color }}
                      >
                        {comp.name} {comp.wavelength}nm
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ControlPanel>

          {/* 物质选择 */}
          <ControlPanel title="物质选择">
            <div className="space-y-2">
              {substances.map((s) => (
                <motion.button
                  key={s.value}
                  className={cn(
                    "w-full py-2 px-3 rounded-lg flex justify-between items-center transition-colors",
                    substance === s.value
                      ? theme === 'dark'
                        ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                        : 'bg-cyan-100 border border-cyan-300 text-cyan-700'
                      : theme === 'dark'
                        ? 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:bg-slate-700/50'
                        : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
                  )}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSubstance(s.value)}
                >
                  <span className="font-medium">{s.label}</span>
                  <span className={cn("font-mono text-sm", s.rotation.startsWith('-') ? 'text-pink-400' : 'text-cyan-400')}>
                    [α] = {s.rotation}
                  </span>
                </motion.button>
              ))}
            </div>
          </ControlPanel>

          {/* 实验参数 */}
          <ControlPanel title="实验参数">
            <SliderControl
              label="溶液浓度 c"
              value={concentration}
              min={0.05}
              max={1.0}
              step={0.05}
              unit=" g/mL"
              onChange={setConcentration}
              color="orange"
            />
            <SliderControl
              label="光程长度 L"
              value={pathLength}
              min={0.5}
              max={2.0}
              step={0.1}
              unit=" dm"
              onChange={setPathLength}
              color="cyan"
            />
            <SliderControl
              label="检偏器角度"
              value={analyzerAngle}
              min={-90}
              max={90}
              step={1}
              unit="°"
              onChange={setAnalyzerAngle}
              color="purple"
            />

            <div className="flex gap-2 mt-2">
              <motion.button
                className={cn(
                  "flex-1 py-2 rounded-lg border transition-colors text-sm",
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30'
                    : 'bg-gradient-to-r from-cyan-100 to-purple-100 text-cyan-700 border-cyan-300 hover:bg-cyan-200'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAnalyzerAngle(Math.round(rotationAngle))}
              >
                最亮位置 (平行)
              </motion.button>
              <motion.button
                className={cn(
                  "flex-1 py-2 rounded-lg border transition-colors text-sm",
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30'
                    : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300 hover:bg-purple-200'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // 消光位置：检偏器与偏振方向垂直（差90°）
                  const extinctionAngle = rotationAngle - 90
                  // 保持在 -90 到 90 范围内
                  setAnalyzerAngle(Math.round(extinctionAngle > 90 ? extinctionAngle - 180 : extinctionAngle < -90 ? extinctionAngle + 180 : extinctionAngle))
                }}
              >
                消光位置 (正交)
              </motion.button>
            </div>
          </ControlPanel>

          {/* 公式与参数 */}
          <ControlPanel title="计算公式">
            <div className={cn("p-3 rounded-lg text-center", theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100')}>
              <div className={cn("font-mono text-lg mb-2", theme === 'dark' ? 'text-white' : 'text-gray-800')}>
                α = [α]<sub>λ</sub> × c × L
              </div>
              <div className={cn("text-xs space-y-1", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {lightMode === 'monochromatic' && wavelength !== 589 && (
                  <p className="text-[10px] text-gray-500 mb-1">
                    [α]<sub>{wavelength}</sub> = [α]<sub>D</sub> × (589/{wavelength})² = {specificRotationD.toFixed(1)} × {(Math.pow(589/wavelength, 2)).toFixed(3)} = <span style={{ color: lightColor }}>{specificRotation.toFixed(1)}°</span>
                  </p>
                )}
                <p>α = {specificRotation.toFixed(1)} × {concentration.toFixed(2)} × {pathLength.toFixed(1)}</p>
                <p
                  className="font-mono"
                  style={{ color: lightMode === 'monochromatic' ? lightColor : (rotationAngle >= 0 ? '#22d3ee' : '#f472b6') }}
                >
                  α = {rotationAngle.toFixed(2)}°
                </p>
              </div>
            </div>
            <div className={cn("mt-3 text-xs", theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
              <p>[α]<sub>λ</sub> = 波长λ时的比旋光度</p>
              <p>[α]<sub>D</sub> = {specificRotationD >= 0 ? '+' : ''}{specificRotationD.toFixed(1)}° (589nm钠光)</p>
              <p>c = 浓度 (g/mL)</p>
              <p>L = 光程 (dm)</p>
              {lightMode === 'monochromatic' && (
                <p className={cn("mt-1 pt-1 border-t", theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200')} style={{ color: lightColor }}>
                  当前: λ = {wavelength} nm
                </p>
              )}
            </div>
          </ControlPanel>

          {/* 浓度-旋光角曲线 */}
          <ControlPanel title="浓度-旋光角关系">
            <RotationChart
              substance={substance}
              pathLength={pathLength}
              currentConcentration={concentration}
              theme={theme}
            />
          </ControlPanel>
        </div>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="旋光性原理" color="cyan">
          <p className={cn("text-xs", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
            手性分子具有不重合的镜像结构，可使线偏振光的偏振面发生旋转。右旋(d/+)为顺时针，左旋(l/-)为逆时针。
          </p>
        </InfoCard>
        <InfoCard title="比旋光度" color="purple">
          <p className={cn("text-xs", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
            [α]是物质的特征常数，定义为单位浓度(1 g/mL)和单位光程(1 dm)时的旋光角。依赖于波长和温度。
          </p>
        </InfoCard>
        <InfoCard title="应用场景" color="orange">
          <ul className={cn("text-xs space-y-1", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
            <li>• 糖度计测量糖浓度</li>
            <li>• 手性药物对映体鉴定</li>
            <li>• 食品工业质量控制</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
