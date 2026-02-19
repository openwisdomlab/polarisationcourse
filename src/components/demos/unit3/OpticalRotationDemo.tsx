/**
 * 旋光性演示 - Unit 3
 * 演示糖溶液等手性物质对偏振面的旋转
 * 采用纯DOM + SVG + Framer Motion一体化设计
 *
 * 增强:
 * - 溶液波动动画效果
 * - 暗色模式文字对比度优化
 *
 * 支持难度分层:
 * - foundation: 隐藏公式和曲线图，只显示蔗糖，简化说明
 * - application: 完整控件 + TaskModeWrapper"神秘物质"测量任务
 * - research: 多色光模式，ORD曲线，DataExportPanel
 *
 * Redesigned with DemoLayout components for consistent UI.
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { useDemoTheme } from '../demoThemeColors'
import { cn } from '@/lib/utils'
import { PolarizationPhysics } from '@/hooks/usePolarizationSimulation'
import {
  DemoHeader,
  VisualizationPanel,
  DemoMainLayout,
  InfoGrid,
  ChartPanel,
  StatCard,
  FormulaHighlight,
} from '../DemoLayout'
import type { DifficultyLevel } from '../DifficultyStrategy'
import { WhyButton, TaskModeWrapper, DataExportPanel } from '../DifficultyStrategy'
import {
  CHIRAL_MATERIALS,
  specificRotationAtWavelength,
  rotationAngle as calcRotationAngle,
  rotatoryDispersionCurve,
  SPECTRAL_LINES as ENGINE_SPECTRAL_LINES,
} from '@/core/physics/unified/OpticalActivity'

// 组件属性接口
interface OpticalRotationDemoProps {
  difficultyLevel?: DifficultyLevel
}

// 将引擎光谱线映射为演示所用格式
const SPECTRAL_LINES = ENGINE_SPECTRAL_LINES.map(l => ({
  id: l.id,
  name: l.nameZh,
  wavelength: l.wavelengthNm,
  color: l.color,
}))

// 物质键名映射：demo使用 'tartaric'，引擎使用 'tartaricAcid'
const SUBSTANCE_KEY_MAP: Record<string, string> = {
  tartaric: 'tartaricAcid',
}

/** 获取引擎中的比旋光度（589 nm D线参考波长） */
function getSpecificRotationD(substance: string): number {
  const engineKey = SUBSTANCE_KEY_MAP[substance] || substance
  return CHIRAL_MATERIALS[engineKey]?.specificRotation ?? 66.5
}

/** 获取引擎中的手性材料对象 */
function getChiralMaterial(substance: string) {
  const engineKey = SUBSTANCE_KEY_MAP[substance] || substance
  return CHIRAL_MATERIALS[engineKey] ?? CHIRAL_MATERIALS.sucrose
}

// 多色光各波长成分 (用于色散效果)
const POLYCHROMATIC_COMPONENTS = [
  { wavelength: 656, color: '#ef4444', name: '红' }, // Hα
  { wavelength: 589, color: '#fbbf24', name: '黄' }, // Na D
  { wavelength: 546, color: '#22c55e', name: '绿' }, // Hg green
  { wavelength: 486, color: '#3b82f6', name: '蓝' }, // Hβ
  { wavelength: 436, color: '#a855f7', name: '紫' }, // Hg violet
]

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
}: {
  substance: string
  concentration: number
  pathLength: number
  analyzerAngle: number
  lightMode: LightMode
  wavelength: number
  lightColor: string
}) {
  const dt = useDemoTheme()
  const specificRotationD = getSpecificRotationD(substance)

  // 根据波长计算实际比旋光度（统一物理引擎 Drude 方程）
  const specificRotation = lightMode === 'monochromatic'
    ? specificRotationAtWavelength(specificRotationD, wavelength)
    : specificRotationD // 多色光模式下使用标准值（各波长分开显示）

  const rotation = calcRotationAngle(specificRotation, concentration, pathLength)
  const isRightRotation = rotation >= 0

  // 检偏器与偏振光的角度差 - 使用统一物理引擎的Malus定律
  const intensity = PolarizationPhysics.malusIntensity(rotation, analyzerAngle, 1.0)

  // 多色光模式下计算各波长的旋转角和强度 - 使用统一物理引擎
  const polychromaticData = useMemo(() => {
    if (lightMode !== 'polychromatic') return []
    return POLYCHROMATIC_COMPONENTS.map(comp => {
      const specRot = specificRotationAtWavelength(specificRotationD, comp.wavelength)
      const rot = calcRotationAngle(specRot, concentration, pathLength)
      const inten = PolarizationPhysics.malusIntensity(rot, analyzerAngle, 1.0)
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
      <rect x="0" y="0" width="700" height="300" fill={dt.canvasBg} rx="8" />

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
        <text x="0" y="45" textAnchor="middle" fill={dt.textSecondary} fontSize="11">
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
        <rect x="-8" y="-40" width="16" height="80" fill={dt.isDark ? '#1e3a5f' : '#e0f2fe'} stroke="#22d3ee" strokeWidth="2" rx="3" />
        <line x1="0" y1="-30" x2="0" y2="30" stroke="#22d3ee" strokeWidth="3" />
        <text x="0" y="55" textAnchor="middle" fill="#22d3ee" fontSize="11">起偏器</text>
        <text x="0" y="68" textAnchor="middle" fill={dt.textSecondary} fontSize="10">0°</text>
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
        <text x={(pathLength * 60) / 2} y="65" textAnchor="middle" fill={dt.textSecondary} fontSize="10">
          c={concentration.toFixed(2)} g/mL
        </text>
      </g>

      {/* 偏振面旋转指示 - 沿管路显示螺旋演化 */}
      {lightMode === 'monochromatic' ? (
        [0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => {
          const x = 240 + t * (100 + pathLength * 60)
          const currentAngle = rotation * t
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
        /* 多色光 - 各波长同轴传播（物理上光束不分离） */
        <g>
          {polychromaticData.map((comp) => (
            <rect
              key={comp.wavelength}
              x={410 + pathLength * 60}
              y="146"
              width="60"
              height="8"
              fill={comp.color}
              opacity="0.6"
            />
          ))}
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
              transform={`rotate(${rotation})`}
            />
            <text x="0" y="-20" textAnchor="middle" fill={lightColor} fontSize="9">
              {rotation >= 0 ? '+' : ''}{rotation.toFixed(1)}°
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
            <text x="0" y="-25" textAnchor="middle" fill={dt.textSecondary} fontSize="8">
              色散
            </text>
          </>
        )}
      </g>

      {/* 检偏器 */}
      <g transform={`translate(${500 + pathLength * 60}, 150)`}>
        <rect x="-8" y="-40" width="16" height="80" fill={dt.isDark ? '#1e3a5f' : '#ede9fe'} stroke="#a78bfa" strokeWidth="2" rx="3" />
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
        <text x="0" y="68" textAnchor="middle" fill={dt.textSecondary} fontSize="10">{analyzerAngle.toFixed(0)}°</text>
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
        /* 多色光 - 各波长同轴传播，强度由检偏器决定 */
        <g>
          {polychromaticData.map((comp) => (
            <rect
              key={comp.wavelength}
              x={516 + pathLength * 60}
              y="146"
              width="40"
              height="8"
              fill={comp.color}
              opacity={Math.max(0.2, comp.intensity) * 0.6}
            />
          ))}
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
              stroke={dt.isDark ? '#475569' : '#94a3b8'}
              strokeWidth="2"
              rx="6"
              animate={{ opacity: [intensity * 0.7, intensity * 0.9, intensity * 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <text x="0" y="55" textAnchor="middle" fill={dt.textSecondary} fontSize="11">
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
              fill={dt.detectorFill}
              stroke={dt.infoPanelStroke}
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
                  fill={dt.textSecondary}
                  fontSize="7"
                >
                  {(comp.intensity * 100).toFixed(0)}%
                </text>
              </g>
            ))}
            <text x="0" y="55" textAnchor="middle" fill={dt.textSecondary} fontSize="9">
              色散强度
            </text>
          </>
        )}
      </g>

      {/* 旋转方向标注 */}
      {lightMode === 'monochromatic' ? (
        <g transform="translate(350, 230)">
          <rect x="-80" y="-15" width="160" height="30" fill={dt.infoPanelBg} rx="6" />
          <text x="0" y="5" textAnchor="middle" fill={lightColor} fontSize="13" fontWeight="500">
            {isRightRotation ? '右旋 (d/+)' : '左旋 (l/-)'}: α = {rotation.toFixed(1)}°
          </text>
        </g>
      ) : (
        <g transform="translate(350, 230)">
          <rect x="-100" y="-15" width="200" height="30" fill={dt.infoPanelBg} rx="6" />
          <text x="0" y="5" textAnchor="middle" fill={dt.textSecondary} fontSize="12" fontWeight="500">
            旋光色散: 短波长旋转角更大 (Drude方程)
          </text>
        </g>
      )}

      {/* 旋转弧线指示 - 仅单色光模式显示 */}
      {lightMode === 'monochromatic' && (
        <g transform={`translate(${440 + pathLength * 60}, 90)`}>
          <path
            d={`M 0 0 A 25 25 0 ${Math.abs(rotation) > 180 ? 1 : 0} ${isRightRotation ? 1 : 0} ${25 * Math.sin((rotation * Math.PI) / 180)} ${25 - 25 * Math.cos((rotation * Math.PI) / 180)}`}
            fill="none"
            stroke={lightColor}
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <motion.polygon
            points="-4,-8 4,0 -4,8"
            fill={lightColor}
            transform={`translate(${25 * Math.sin((rotation * Math.PI) / 180)}, ${25 - 25 * Math.cos((rotation * Math.PI) / 180)}) rotate(${rotation + 90})`}
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
}: {
  substance: string
  pathLength: number
  currentConcentration: number
}) {
  const dt = useDemoTheme()
  const specificRotation = getSpecificRotationD(substance)
  const isPositive = specificRotation >= 0
  const maxRotation = Math.abs(specificRotation * 1.0 * pathLength)

  const { pathData } = useMemo(() => {
    const points: string[] = []

    for (let c = 0; c <= 1; c += 0.05) {
      const rotation = calcRotationAngle(specificRotation, c, pathLength)
      const x = 40 + c * 220
      const y = 100 - (rotation / maxRotation) * 60

      points.push(`${c === 0 ? 'M' : 'L'} ${x},${y}`)
    }

    return { pathData: points.join(' ') }
  }, [specificRotation, pathLength, maxRotation])

  const currentRotation = calcRotationAngle(specificRotation, currentConcentration, pathLength)
  const currentX = 40 + currentConcentration * 220
  const currentY = 100 - (currentRotation / maxRotation) * 60

  return (
    <svg viewBox="0 0 300 160" className="w-full h-auto">
      <rect x="40" y="30" width="220" height="100" fill={dt.canvasBgAlt} rx="4" />

      {/* 坐标轴 */}
      <line x1="40" y1="100" x2="270" y2="100" stroke={dt.axisColor} strokeWidth="1" />
      <line x1="40" y1="30" x2="40" y2="130" stroke={dt.axisColor} strokeWidth="1" />

      {/* X轴刻度 */}
      {[0, 0.5, 1].map((c) => {
        const x = 40 + c * 220
        return (
          <g key={c}>
            <line x1={x} y1="130" x2={x} y2="135" stroke={dt.textSecondary} strokeWidth="1" />
            <text x={x} y="147" textAnchor="middle" fill={dt.textSecondary} fontSize="10">{c}</text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      <text x="30" y="104" textAnchor="end" fill={dt.textSecondary} fontSize="10">0°</text>
      <text x="30" y="44" textAnchor="end" fill={dt.textSecondary} fontSize="10">
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
      <text x="155" y="158" textAnchor="middle" fill={dt.textSecondary} fontSize="11">浓度 c (g/mL)</text>
      <text x="15" y="70" fill={dt.textSecondary} fontSize="10" transform="rotate(-90 15 70)">α</text>
    </svg>
  )
}

// 波长 → 近似可见光颜色映射
function wavelengthToColor(nm: number): string {
  if (nm < 440) return '#7c3aed'
  if (nm < 490) return '#3b82f6'
  if (nm < 510) return '#06b6d4'
  if (nm < 560) return '#22c55e'
  if (nm < 590) return '#eab308'
  if (nm < 630) return '#f97316'
  return '#ef4444'
}

// ORD（旋光色散）曲线
function ORDChart({
  substance,
  concentration,
  pathLength,
  currentWavelength,
}: {
  substance: string
  concentration: number
  pathLength: number
  currentWavelength: number
}) {
  const dt = useDemoTheme()
  const material = getChiralMaterial(substance)

  const ordData = useMemo(() => {
    return rotatoryDispersionCurve(material, concentration, pathLength, 400, 700, 5)
  }, [material, concentration, pathLength])

  if (ordData.length === 0) return null

  // 计算Y轴范围
  const rotations = ordData.map(d => d.rotationDeg)
  const maxRot = Math.max(...rotations.map(Math.abs))
  const yMax = Math.ceil(maxRot / 10) * 10 || 10

  // SVG坐标映射
  const chartL = 45
  const chartR = 275
  const chartT = 25
  const chartB = 125
  const chartW = chartR - chartL
  const chartH = chartB - chartT
  const yMid = chartT + chartH / 2

  const toX = (wl: number) => chartL + ((wl - 400) / 300) * chartW
  const toY = (rot: number) => yMid - (rot / yMax) * (chartH / 2)

  // 当前波长的旋转角
  const specRot = specificRotationAtWavelength(material.specificRotation, currentWavelength)
  const currentRot = calcRotationAngle(specRot, concentration, pathLength)
  const curX = toX(currentWavelength)
  const curY = toY(currentRot)

  return (
    <svg viewBox="0 0 300 160" className="w-full h-auto">
      {/* 背景 */}
      <rect x={chartL} y={chartT} width={chartW} height={chartH} fill={dt.canvasBgAlt} rx="4" />

      {/* 光谱色带背景 */}
      {ordData.slice(0, -1).map((d, i) => {
        const next = ordData[i + 1]
        const x1 = toX(d.wavelengthNm)
        const x2 = toX(next.wavelengthNm)
        return (
          <rect
            key={d.wavelengthNm}
            x={x1}
            y={chartT}
            width={x2 - x1}
            height={chartH}
            fill={wavelengthToColor(d.wavelengthNm)}
            opacity={0.06}
          />
        )
      })}

      {/* 零线 */}
      <line
        x1={chartL} y1={yMid} x2={chartR} y2={yMid}
        stroke={dt.axisColor} strokeWidth="0.5" strokeDasharray="4 3"
      />

      {/* 坐标轴 */}
      <line x1={chartL} y1={chartT} x2={chartL} y2={chartB} stroke={dt.axisColor} strokeWidth="1" />
      <line x1={chartL} y1={chartB} x2={chartR} y2={chartB} stroke={dt.axisColor} strokeWidth="1" />

      {/* X轴刻度 */}
      {[400, 500, 600, 700].map(wl => {
        const x = toX(wl)
        return (
          <g key={wl}>
            <line x1={x} y1={chartB} x2={x} y2={chartB + 4} stroke={dt.textSecondary} strokeWidth="1" />
            <text x={x} y={chartB + 14} textAnchor="middle" fill={dt.textSecondary} fontSize="9">{wl}</text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      <text x={chartL - 4} y={chartT + 4} textAnchor="end" fill={dt.textSecondary} fontSize="9">
        +{yMax.toFixed(0)}°
      </text>
      <text x={chartL - 4} y={yMid + 3} textAnchor="end" fill={dt.textSecondary} fontSize="9">0°</text>
      <text x={chartL - 4} y={chartB + 2} textAnchor="end" fill={dt.textSecondary} fontSize="9">
        -{yMax.toFixed(0)}°
      </text>

      {/* ORD曲线 - 光谱色描边 */}
      {ordData.slice(0, -1).map((d, i) => {
        const next = ordData[i + 1]
        return (
          <line
            key={d.wavelengthNm}
            x1={toX(d.wavelengthNm)}
            y1={toY(d.rotationDeg)}
            x2={toX(next.wavelengthNm)}
            y2={toY(next.rotationDeg)}
            stroke={wavelengthToColor(d.wavelengthNm)}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )
      })}

      {/* 当前波长垂直线 */}
      <line
        x1={curX} y1={chartT} x2={curX} y2={chartB}
        stroke={dt.textMuted} strokeWidth="1" strokeDasharray="3 3"
      />

      {/* 当前波长点 */}
      <circle cx={curX} cy={curY} r="5" fill="#fbbf24" stroke="#fff" strokeWidth="1.5" />

      {/* 当前值标签 */}
      <text
        x={curX}
        y={curY - 10}
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="9"
        fontWeight="bold"
      >
        {currentRot >= 0 ? '+' : ''}{currentRot.toFixed(1)}°
      </text>

      {/* 轴标签 */}
      <text x={(chartL + chartR) / 2} y={chartB + 26} textAnchor="middle" fill={dt.textSecondary} fontSize="10">
        波长 λ (nm)
      </text>
      <text x="8" y={yMid + 3} fill={dt.textSecondary} fontSize="9" transform={`rotate(-90 8 ${yMid})`}>
        α (°)
      </text>
    </svg>
  )
}

// 主演示组件
export function OpticalRotationDemo({ difficultyLevel = 'application' }: OpticalRotationDemoProps) {
  const dt = useDemoTheme()

  // 判断难度级别
  const isFoundation = difficultyLevel === 'foundation'
  const isResearch = difficultyLevel === 'research'

  const [substance, setSubstance] = useState('sucrose')
  const [concentration, setConcentration] = useState(0.3)
  const [pathLength, setPathLength] = useState(1.0)
  const [analyzerAngle, setAnalyzerAngle] = useState(0)

  // 应用模式: 神秘物质测量任务状态
  const [mysteryTaskCompleted, setMysteryTaskCompleted] = useState(false)

  // 光源设置 - 基础模式默认单色光
  const [lightMode, setLightMode] = useState<LightMode>('monochromatic')
  const [selectedWavelengthId, setSelectedWavelengthId] = useState('na-d')

  // 获取选中的光谱线信息
  const selectedSpectralLine = SPECTRAL_LINES.find(l => l.id === selectedWavelengthId) || SPECTRAL_LINES[0]
  const lightColor = selectedSpectralLine.color
  const wavelength = selectedSpectralLine.wavelength

  // 根据波长计算实际比旋光度
  const specificRotationD = getSpecificRotationD(substance)
  const specificRotation = lightMode === 'monochromatic'
    ? specificRotationAtWavelength(specificRotationD, wavelength)
    : specificRotationD

  const rotationAngle = calcRotationAngle(specificRotation, concentration, pathLength)

  // 透过强度 - 使用统一物理引擎的Malus定律
  const intensity = PolarizationPhysics.malusIntensity(rotationAngle, analyzerAngle, 1.0)

  // 物质选项
  const substances = [
    { value: 'sucrose', label: CHIRAL_MATERIALS.sucrose.nameZh, rotation: `+${CHIRAL_MATERIALS.sucrose.specificRotation}°` },
    { value: 'glucose', label: CHIRAL_MATERIALS.glucose.nameZh, rotation: `+${CHIRAL_MATERIALS.glucose.specificRotation}°` },
    { value: 'fructose', label: CHIRAL_MATERIALS.fructose.nameZh, rotation: `${CHIRAL_MATERIALS.fructose.specificRotation}°` },
    { value: 'tartaric', label: CHIRAL_MATERIALS.tartaricAcid.nameZh, rotation: `+${CHIRAL_MATERIALS.tartaricAcid.specificRotation}°` },
  ]

  return (
    <div className="space-y-5">
      {/* 标题 */}
      <DemoHeader
        title="旋光性交互演示"
        subtitle="α = [α] × c × L -- 探索手性物质对偏振面的旋转效应"
        gradient="green"
      />

      {/* 核心公式 - 基础难度隐藏 */}
      {!isFoundation && (
        <FormulaHighlight
          formula="α = [α]_λ × c × L"
          description="旋光角 = 比旋光度 × 浓度 × 光程长度"
        />
      )}

      {/* 基础难度: 简化说明 */}
      {isFoundation && (
        <WhyButton>
          <div className="space-y-2 text-sm">
            <p>某些物质（如糖溶液）可以旋转光的偏振方向！</p>
            <p>溶液浓度越高、管子越长，偏振面旋转得越多。</p>
            <p>这就是旋光仪测量糖浓度的原理。</p>
          </div>
        </WhyButton>
      )}

      {/* 主体内容 */}
      <DemoMainLayout
        controlsWidth="wide"
        visualization={
          <div className="space-y-5">
            {/* 光路图 */}
            <VisualizationPanel variant="blue">
              <OpticalRotationDiagram
                substance={substance}
                concentration={concentration}
                pathLength={pathLength}
                analyzerAngle={analyzerAngle}
                lightMode={lightMode}
                wavelength={wavelength}
                lightColor={lightColor}
              />
            </VisualizationPanel>

            {/* 测量结果 Stat Cards */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                label="旋光角 α"
                value={`${rotationAngle >= 0 ? '+' : ''}${rotationAngle.toFixed(1)}`}
                unit="°"
                color={rotationAngle >= 0 ? 'cyan' : 'pink'}
              />
              <StatCard
                label="旋光方向"
                value={rotationAngle >= 0 ? '右旋 (d)' : '左旋 (l)'}
                color={rotationAngle >= 0 ? 'green' : 'pink'}
              />
              <StatCard
                label="透过强度"
                value={`${(intensity * 100).toFixed(0)}`}
                unit="%"
                color="purple"
              />
            </div>

            {/* 光源信息面板 */}
            <div className={cn(
              "rounded-2xl border p-4",
              dt.isDark
                ? 'bg-slate-800/30 border-slate-700/40'
                : 'bg-white/60 border-slate-200/60'
            )}>
              <div className={cn("flex items-center justify-center gap-2", dt.mutedTextClass)}>
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: lightMode === 'monochromatic' ? lightColor : '#a855f7' }}
                />
                <span className="text-sm">
                  {lightMode === 'monochromatic'
                    ? `${selectedSpectralLine.name} (λ = ${wavelength} nm)`
                    : '多色光 (旋光色散)'}
                </span>
              </div>
            </div>
          </div>
        }
        controls={
          <div className="space-y-5">
            {/* 光源设置 */}
            <ControlPanel title="光源设置">
              {/* 光源模式切换 */}
              <div className="flex gap-2 mb-3">
                <motion.button
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                    lightMode === 'monochromatic'
                      ? dt.isDark
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                        : 'bg-amber-100 border border-amber-300 text-amber-700'
                      : dt.isDark
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
                      ? dt.isDark
                        ? 'bg-gradient-to-r from-red-500/20 via-green-500/20 to-violet-500/20 border border-purple-500/50 text-purple-300'
                        : 'bg-gradient-to-r from-red-100 via-green-100 to-violet-100 border border-purple-300 text-purple-700'
                      : dt.isDark
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
                  <div className={cn("text-xs mb-2", dt.mutedTextClass)}>选择光谱线</div>
                  {SPECTRAL_LINES.map((line) => (
                    <motion.button
                      key={line.id}
                      className={cn(
                        "w-full py-2 px-3 rounded-lg flex justify-between items-center transition-colors",
                        selectedWavelengthId === line.id
                          ? 'border-2'
                          : dt.isDark
                            ? 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:bg-slate-700/50'
                            : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
                      )}
                      style={selectedWavelengthId === line.id ? {
                        backgroundColor: dt.isDark ? `${line.color}20` : `${line.color}15`,
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
                <div className={cn("p-3 rounded-xl border", dt.isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-purple-50 border-purple-200')}>
                  <div className={cn("text-xs space-y-2", dt.bodyClass)}>
                    <p className={cn("font-medium", dt.isDark ? 'text-purple-400' : 'text-purple-600')}>旋光色散效应</p>
                    <p>不同波长的光具有不同的比旋光度，导致各色光旋转角度不同。</p>
                    <p className={cn("font-mono text-[10px]", dt.mutedTextClass)}>
                      Drude方程: [α]<sub>λ</sub> ≈ [α]<sub>D</sub> × (589/λ)²&nbsp;&nbsp;[α]<sub>D</sub>为589 nm参考波长比旋光度
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {POLYCHROMATIC_COMPONENTS.map(comp => (
                        <span
                          key={comp.wavelength}
                          className="px-2 py-0.5 rounded text-[10px] font-mono"
                          style={{ backgroundColor: dt.isDark ? `${comp.color}30` : `${comp.color}20`, color: comp.color }}
                        >
                          {comp.name} {comp.wavelength}nm
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </ControlPanel>

            {/* 物质选择 - 基础模式仅蔗糖 */}
            {!isFoundation && (
              <ControlPanel title="物质选择">
                <div className="space-y-2">
                  {substances.map((s) => (
                    <motion.button
                      key={s.value}
                      className={cn(
                        "w-full py-2 px-3 rounded-lg flex justify-between items-center transition-colors",
                        substance === s.value
                          ? dt.isDark
                            ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                            : 'bg-cyan-100 border border-cyan-300 text-cyan-700'
                          : dt.isDark
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
            )}

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
                    dt.isDark
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
                    dt.isDark
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

            {/* 计算公式 - 基础难度隐藏 */}
            {!isFoundation && (
              <ChartPanel title="计算公式">
                <div className={cn("p-3 rounded-xl text-center", dt.isDark ? 'bg-slate-900/50' : 'bg-gray-50')}>
                  <div className={cn("font-mono text-lg mb-2", dt.isDark ? 'text-white' : 'text-gray-800')}>
                    α = [α]<sub>λ</sub> × c × L
                  </div>
                  <div className={cn("text-xs space-y-1", dt.mutedTextClass)}>
                    {lightMode === 'monochromatic' && wavelength !== 589 && (
                      <p className={cn("text-[10px] mb-1", dt.mutedTextClass)}>
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
                <div className={cn("mt-3 text-xs", dt.mutedTextClass)}>
                  <p>[α]<sub>λ</sub> = 波长λ时的比旋光度</p>
                  <p>[α]<sub>D</sub> = {specificRotationD >= 0 ? '+' : ''}{specificRotationD.toFixed(1)}° (589nm钠光)</p>
                  <p>c = 浓度 (g/mL)</p>
                  <p>L = 光程 (dm)</p>
                  {lightMode === 'monochromatic' && (
                    <p className={cn("mt-1 pt-1 border-t", dt.isDark ? 'border-slate-700/50' : 'border-gray-200')} style={{ color: lightColor }}>
                      当前: λ = {wavelength} nm
                    </p>
                  )}
                </div>
              </ChartPanel>
            )}

            {/* 浓度-旋光角曲线 - 基础难度隐藏 */}
            {!isFoundation && (
              <ChartPanel title="浓度-旋光角关系" subtitle="α vs c">
                <RotationChart
                  substance={substance}
                  pathLength={pathLength}
                  currentConcentration={concentration}
                />
              </ChartPanel>
            )}

            {/* ORD曲线 - 研究难度显示 */}
            {isResearch && (
              <ChartPanel title="旋光色散曲线 (ORD)" subtitle="α vs λ">
                <ORDChart
                  substance={substance}
                  concentration={concentration}
                  pathLength={pathLength}
                  currentWavelength={wavelength}
                />
              </ChartPanel>
            )}

            {/* 应用模式: 神秘物质测量任务 */}
            {difficultyLevel === 'application' && (
              <TaskModeWrapper
                taskTitle="Mystery Substance Identification"
                taskTitleZh="神秘物质鉴定"
                taskDescription="Adjust the analyzer angle to find the extinction position. From the rotation angle, identify which substance is in the tube."
                taskDescriptionZh="调节检偏器角度找到消光位置，根据旋光角推断管中的物质种类。"
                isCompleted={mysteryTaskCompleted}
              >
                <div className={cn('p-3 rounded-lg text-sm', dt.isDark ? 'bg-slate-800/50' : 'bg-gray-50')}>
                  <p className={dt.bodyClass}>
                    管中装有浓度为 0.30 g/mL、光程 1.0 dm 的未知溶液。
                    使用检偏器找到消光位置，计算旋光角 α，然后对比各物质的比旋光度 [α]<sub>D</sub> 进行鉴定。
                  </p>
                  {Math.abs(analyzerAngle - rotationAngle) < 2 && !mysteryTaskCompleted && (
                    <motion.button
                      className={cn(
                        'mt-3 px-4 py-2 rounded-lg text-sm font-medium',
                        dt.isDark
                          ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                          : 'bg-green-100 text-green-700 border border-green-300'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMysteryTaskCompleted(true)}
                    >
                      确认鉴定结果
                    </motion.button>
                  )}
                </div>
              </TaskModeWrapper>
            )}

            {/* 研究模式: 数据导出 */}
            {isResearch && (
              <DataExportPanel
                title="Optical Rotation Data"
                titleZh="旋光数据"
                data={{
                  'substance': substance,
                  '[α]_D (°)': specificRotationD,
                  '[α]_λ (°)': specificRotation,
                  'c (g/mL)': concentration,
                  'L (dm)': pathLength,
                  'α (°)': rotationAngle,
                  'λ (nm)': wavelength,
                  'I_transmitted': intensity,
                  'analyzer (°)': analyzerAngle,
                }}
              />
            )}
          </div>
        }
      />

      {/* 知识卡片 */}
      <InfoGrid columns={3}>
        <InfoCard title="旋光性原理" color="cyan">
          <p className={cn("text-xs", dt.bodyClass)}>
            手性分子具有不重合的镜像结构，可使线偏振光的偏振面发生旋转。右旋(d/+)为顺时针，左旋(l/-)为逆时针。
          </p>
        </InfoCard>
        <InfoCard title="比旋光度" color="purple">
          <p className={cn("text-xs", dt.bodyClass)}>
            [α]是物质的特征常数，定义为单位浓度(1 g/mL)和单位光程(1 dm)时的旋光角。依赖于波长和温度。
          </p>
        </InfoCard>
        <InfoCard title="应用场景" color="orange">
          <ul className={cn("text-xs space-y-1", dt.bodyClass)}>
            <li>• 糖度计测量糖浓度</li>
            <li>• 手性药物对映体鉴定</li>
            <li>• 食品工业质量控制</li>
          </ul>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
