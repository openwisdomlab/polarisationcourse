/**
 * Life Scene SVG Illustrations
 * 生活场景SVG插图 - 用于课程演示中的真实案例展示
 * Enhanced with richer details, better sizing, and hover interactions
 */
import { useTheme } from '@/contexts/ThemeContext'
import { useState } from 'react'

// 通用样式
const useColors = () => {
  const { theme } = useTheme()
  return {
    bg: theme === 'dark' ? '#1e293b' : '#f1f5f9',
    primary: theme === 'dark' ? '#22d3ee' : '#0891b2',
    secondary: theme === 'dark' ? '#a78bfa' : '#7c3aed',
    accent: theme === 'dark' ? '#fbbf24' : '#f59e0b',
    text: theme === 'dark' ? '#e2e8f0' : '#334155',
    muted: theme === 'dark' ? '#64748b' : '#94a3b8',
    success: theme === 'dark' ? '#4ade80' : '#22c55e',
    danger: theme === 'dark' ? '#f87171' : '#ef4444',
  }
}

// ==================== 新增插图 ====================

// 电磁波传播 - 用于光波演示
export function LightWaveIllustration() {
  const colors = useColors()
  const [hover, setHover] = useState(false)

  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full h-auto cursor-pointer transition-transform hover:scale-[1.02]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <defs>
        <linearGradient id="wave-e-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="wave-b-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* 背景网格 */}
      <g opacity="0.1">
        {[...Array(16)].map((_, i) => (
          <line key={`v${i}`} x1={20 + i * 20} y1="20" x2={20 + i * 20} y2="140" stroke={colors.text} strokeWidth="0.5" />
        ))}
        {[...Array(6)].map((_, i) => (
          <line key={`h${i}`} x1="20" y1={30 + i * 25} x2="300" y2={30 + i * 25} stroke={colors.text} strokeWidth="0.5" />
        ))}
      </g>

      {/* 传播方向箭头 */}
      <line x1="20" y1="80" x2="300" y2="80" stroke={colors.muted} strokeWidth="1.5" strokeDasharray="4,2" />
      <polygon points="300,80 290,76 290,84" fill={colors.muted} />
      <text x="310" y="84" fill={colors.muted} fontSize="8" fontWeight="bold">k</text>

      {/* 电场波 (E) - 垂直平面 */}
      <path
        d={`M 30,80
            Q 50,${hover ? 35 : 45} 70,80
            T 110,80 T 150,80 T 190,80 T 230,80 T 270,80`}
        fill="none"
        stroke="url(#wave-e-grad)"
        strokeWidth="3"
        className="transition-all duration-500"
      />

      {/* 磁场波 (B) - 水平平面 (透视效果) */}
      <path
        d={`M 30,80
            Q 50,80 70,${hover ? 55 : 60}
            Q 90,80 110,${hover ? 105 : 100}
            Q 130,80 150,${hover ? 55 : 60}
            Q 170,80 190,${hover ? 105 : 100}
            Q 210,80 230,${hover ? 55 : 60}
            Q 250,80 270,${hover ? 105 : 100}`}
        fill="none"
        stroke="url(#wave-b-grad)"
        strokeWidth="2.5"
        strokeDasharray={hover ? "none" : "8,4"}
        className="transition-all duration-500"
      />

      {/* 电场矢量指示 */}
      <g transform="translate(70, 80)">
        <line x1="0" y1="0" x2="0" y2="-25" stroke="#fbbf24" strokeWidth="2" />
        <polygon points="0,-25 -4,-18 4,-18" fill="#fbbf24" />
      </g>

      {/* 磁场矢量指示 */}
      <g transform="translate(110, 80)">
        <line x1="0" y1="0" x2="12" y2="8" stroke="#8b5cf6" strokeWidth="2" />
        <polygon points="12,8 4,6 8,12" fill="#8b5cf6" />
      </g>

      {/* 标签 */}
      <text x="75" y="35" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">E</text>
      <text x="130" y="120" textAnchor="middle" fill="#8b5cf6" fontSize="10" fontWeight="bold">B</text>

      {/* 波长标注 */}
      <g transform="translate(145, 140)">
        <line x1="0" y1="0" x2="80" y2="0" stroke={colors.text} strokeWidth="1" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke={colors.text} strokeWidth="1" />
        <line x1="80" y1="-3" x2="80" y2="3" stroke={colors.text} strokeWidth="1" />
        <text x="40" y="12" textAnchor="middle" fill={colors.text} fontSize="9">λ</text>
      </g>

      {/* 光源 */}
      <g transform="translate(10, 80)">
        <circle cx="0" cy="0" r="8" fill={colors.accent} opacity="0.8" />
        <circle cx="0" cy="0" r="4" fill="white" />
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1={10 * Math.cos(i * Math.PI / 4)}
            y1={10 * Math.sin(i * Math.PI / 4)}
            x2={14 * Math.cos(i * Math.PI / 4)}
            y2={14 * Math.sin(i * Math.PI / 4)}
            stroke={colors.accent}
            strokeWidth="1.5"
            opacity={hover ? 1 : 0.6}
            className="transition-opacity duration-300"
          />
        ))}
      </g>

      {/* 悬停提示 */}
      {hover && (
        <text x="160" y="20" textAnchor="middle" fill={colors.text} fontSize="9" opacity="0.8">
          E ⊥ B ⊥ k (相互垂直)
        </text>
      )}
    </svg>
  )
}

// 偏振类型对比 - 线偏振、圆偏振、椭圆偏振
export function PolarizationTypesIllustration() {
  const colors = useColors()
  const [activeType, setActiveType] = useState<'linear' | 'circular' | 'elliptical' | null>(null)

  return (
    <svg viewBox="0 0 320 140" className="w-full h-auto">
      {/* 线偏振 */}
      <g
        transform="translate(55, 70)"
        onMouseEnter={() => setActiveType('linear')}
        onMouseLeave={() => setActiveType(null)}
        className="cursor-pointer"
      >
        <circle cx="0" cy="0" r="35" fill="none" stroke={colors.muted} strokeWidth="1" strokeDasharray="2" />
        <line x1="0" y1="-30" x2="0" y2="30" stroke="#fbbf24" strokeWidth={activeType === 'linear' ? 4 : 3}
          className="transition-all duration-200" />
        <polygon points="0,-30 -5,-22 5,-22" fill="#fbbf24" />
        <polygon points="0,30 -5,22 5,22" fill="#fbbf24" />
        <text x="0" y="55" textAnchor="middle" fill={colors.text} fontSize="10" fontWeight={activeType === 'linear' ? 'bold' : 'normal'}>
          Linear
        </text>
        <text x="0" y="68" textAnchor="middle" fill={colors.muted} fontSize="8">δ = 0°</text>
        {activeType === 'linear' && (
          <circle cx="0" cy="0" r="38" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.5" />
        )}
      </g>

      {/* 圆偏振 */}
      <g
        transform="translate(160, 70)"
        onMouseEnter={() => setActiveType('circular')}
        onMouseLeave={() => setActiveType(null)}
        className="cursor-pointer"
      >
        <circle cx="0" cy="0" r="25" fill="none" stroke="#22c55e" strokeWidth={activeType === 'circular' ? 4 : 3}
          className="transition-all duration-200" />
        {/* 旋转箭头 */}
        <path d="M 25,0 A 25,25 0 0,1 17,17" fill="none" stroke="#22c55e" strokeWidth="2" />
        <polygon points="17,17 14,10 22,13" fill="#22c55e" />
        <text x="0" y="55" textAnchor="middle" fill={colors.text} fontSize="10" fontWeight={activeType === 'circular' ? 'bold' : 'normal'}>
          Circular
        </text>
        <text x="0" y="68" textAnchor="middle" fill={colors.muted} fontSize="8">δ = 90°, Ex=Ey</text>
        {activeType === 'circular' && (
          <circle cx="0" cy="0" r="38" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.5" />
        )}
      </g>

      {/* 椭圆偏振 */}
      <g
        transform="translate(265, 70)"
        onMouseEnter={() => setActiveType('elliptical')}
        onMouseLeave={() => setActiveType(null)}
        className="cursor-pointer"
      >
        <ellipse cx="0" cy="0" rx="30" ry="18" fill="none" stroke="#a855f7" strokeWidth={activeType === 'elliptical' ? 4 : 3}
          transform="rotate(-30)" className="transition-all duration-200" />
        {/* 旋转箭头 */}
        <path d="M 22,-12 A 30,18 -30 0,1 26,5" fill="none" stroke="#a855f7" strokeWidth="2" />
        <polygon points="26,5 20,1 24,9" fill="#a855f7" />
        <text x="0" y="55" textAnchor="middle" fill={colors.text} fontSize="10" fontWeight={activeType === 'elliptical' ? 'bold' : 'normal'}>
          Elliptical
        </text>
        <text x="0" y="68" textAnchor="middle" fill={colors.muted} fontSize="8">δ = any</text>
        {activeType === 'elliptical' && (
          <circle cx="0" cy="0" r="38" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.5" />
        )}
      </g>

      {/* 顶部标题 */}
      <text x="160" y="15" textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="bold">
        Polarization States
      </text>
    </svg>
  )
}

// 光学实验台 - 用于光学平台演示
export function OpticalBenchIllustration() {
  const colors = useColors()
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)

  return (
    <svg viewBox="0 0 320 140" className="w-full h-auto">
      {/* 光学平台底座 */}
      <rect x="10" y="100" width="300" height="20" rx="3" fill={colors.bg} stroke={colors.muted} strokeWidth="2" />
      <line x1="10" y1="108" x2="310" y2="108" stroke={colors.muted} strokeWidth="1" strokeDasharray="10,5" />

      {/* 刻度 */}
      {[...Array(15)].map((_, i) => (
        <g key={i} transform={`translate(${25 + i * 20}, 105)`}>
          <line x1="0" y1="0" x2="0" y2="5" stroke={colors.muted} strokeWidth="1" />
          <text x="0" y="15" textAnchor="middle" fill={colors.muted} fontSize="6">{i * 2}</text>
        </g>
      ))}

      {/* 激光器 */}
      <g
        transform="translate(25, 65)"
        onMouseEnter={() => setHoveredComponent('laser')}
        onMouseLeave={() => setHoveredComponent(null)}
        className="cursor-pointer"
      >
        <rect x="-15" y="-20" width="35" height="40" rx="3" fill={colors.text} />
        <rect x="20" y="-5" width="10" height="10" rx="1" fill={colors.danger} />
        <circle cx="30" cy="0" r="6" fill={colors.danger} opacity="0.8" />
        {hoveredComponent === 'laser' && (
          <>
            <rect x="-17" y="-22" width="60" height="44" rx="5" fill="none" stroke={colors.accent} strokeWidth="2" />
            <text x="10" y="-28" textAnchor="middle" fill={colors.accent} fontSize="8">HeNe Laser</text>
          </>
        )}
      </g>

      {/* 光束 */}
      <line x1="55" y1="65" x2="300" y2="65" stroke={colors.danger} strokeWidth="3" opacity="0.8" />
      <line x1="55" y1="65" x2="300" y2="65" stroke="white" strokeWidth="1" opacity="0.5" />

      {/* 偏振片1 */}
      <g
        transform="translate(100, 65)"
        onMouseEnter={() => setHoveredComponent('polarizer1')}
        onMouseLeave={() => setHoveredComponent(null)}
        className="cursor-pointer"
      >
        <rect x="-3" y="-30" width="6" height="60" fill={colors.primary} opacity="0.6" stroke={colors.primary} strokeWidth="1" />
        <line x1="0" y1="-25" x2="0" y2="25" stroke={colors.primary} strokeWidth="2" />
        {hoveredComponent === 'polarizer1' && (
          <>
            <circle cx="0" cy="0" r="35" fill="none" stroke={colors.accent} strokeWidth="2" />
            <text x="0" y="-38" textAnchor="middle" fill={colors.accent} fontSize="8">Polarizer</text>
          </>
        )}
      </g>

      {/* 样品位置 */}
      <g
        transform="translate(170, 65)"
        onMouseEnter={() => setHoveredComponent('sample')}
        onMouseLeave={() => setHoveredComponent(null)}
        className="cursor-pointer"
      >
        <rect x="-15" y="-25" width="30" height="50" rx="2" fill={colors.secondary} opacity="0.3" stroke={colors.secondary} strokeWidth="2" />
        <text x="0" y="5" textAnchor="middle" fill={colors.secondary} fontSize="8">?</text>
        {hoveredComponent === 'sample' && (
          <>
            <rect x="-17" y="-27" width="34" height="54" rx="4" fill="none" stroke={colors.accent} strokeWidth="2" />
            <text x="0" y="-32" textAnchor="middle" fill={colors.accent} fontSize="8">Sample</text>
          </>
        )}
      </g>

      {/* 偏振片2 (检偏器) */}
      <g
        transform="translate(230, 65)"
        onMouseEnter={() => setHoveredComponent('analyzer')}
        onMouseLeave={() => setHoveredComponent(null)}
        className="cursor-pointer"
      >
        <rect x="-3" y="-30" width="6" height="60" fill={colors.success} opacity="0.6" stroke={colors.success} strokeWidth="1" />
        <line x1="-20" y1="0" x2="20" y2="0" stroke={colors.success} strokeWidth="2" />
        {/* 旋转刻度盘 */}
        <circle cx="0" cy="0" r="22" fill="none" stroke={colors.muted} strokeWidth="1" strokeDasharray="2" />
        {hoveredComponent === 'analyzer' && (
          <>
            <circle cx="0" cy="0" r="35" fill="none" stroke={colors.accent} strokeWidth="2" />
            <text x="0" y="-38" textAnchor="middle" fill={colors.accent} fontSize="8">Analyzer</text>
          </>
        )}
      </g>

      {/* 探测器 */}
      <g
        transform="translate(285, 65)"
        onMouseEnter={() => setHoveredComponent('detector')}
        onMouseLeave={() => setHoveredComponent(null)}
        className="cursor-pointer"
      >
        <rect x="-10" y="-20" width="25" height="40" rx="3" fill={colors.text} />
        <rect x="-7" y="-15" width="8" height="30" fill={colors.bg} />
        {hoveredComponent === 'detector' && (
          <>
            <rect x="-12" y="-22" width="29" height="44" rx="5" fill="none" stroke={colors.accent} strokeWidth="2" />
            <text x="3" y="-28" textAnchor="middle" fill={colors.accent} fontSize="8">Detector</text>
          </>
        )}
      </g>

      {/* 标题 */}
      <text x="160" y="15" textAnchor="middle" fill={colors.text} fontSize="10" fontWeight="bold">
        Optical Bench Setup
      </text>
    </svg>
  )
}

// 旋光现象 - 糖水旋光
export function OpticalRotationIllustration() {
  const colors = useColors()
  const [concentration, setConcentration] = useState(2) // 模拟浓度 1-3

  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full h-auto cursor-pointer"
      onClick={() => setConcentration(c => c === 3 ? 1 : c + 1)}
    >
      {/* 背景 */}
      <rect x="0" y="0" width="320" height="160" fill={colors.bg} rx="5" />

      {/* 光源 */}
      <g transform="translate(25, 80)">
        <circle cx="0" cy="0" r="12" fill={colors.accent} />
        <circle cx="0" cy="0" r="6" fill="white" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1={14 * Math.cos(angle * Math.PI / 180)}
            y1={14 * Math.sin(angle * Math.PI / 180)}
            x2={18 * Math.cos(angle * Math.PI / 180)}
            y2={18 * Math.sin(angle * Math.PI / 180)}
            stroke={colors.accent}
            strokeWidth="2"
          />
        ))}
      </g>

      {/* 第一个偏振片 */}
      <g transform="translate(65, 80)">
        <rect x="-4" y="-35" width="8" height="70" fill={colors.primary} opacity="0.5" stroke={colors.primary} strokeWidth="2" />
        <line x1="0" y1="-30" x2="0" y2="30" stroke={colors.primary} strokeWidth="3" />
        <text x="0" y="-42" textAnchor="middle" fill={colors.muted} fontSize="8">P1</text>
      </g>

      {/* 入射偏振光 */}
      <g transform="translate(85, 80)">
        <line x1="0" y1="0" x2="35" y2="0" stroke="#fbbf24" strokeWidth="3" />
        <polygon points="35,0 28,-4 28,4" fill="#fbbf24" />
        {/* 偏振方向 - 垂直 */}
        <g transform="translate(18, 0)">
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#fbbf24" strokeWidth="2" />
        </g>
      </g>

      {/* 糖水管 */}
      <g transform="translate(130, 80)">
        {/* 玻璃管 */}
        <rect x="0" y="-30" width="80" height="60" rx="10" fill={colors.bg} stroke={colors.muted} strokeWidth="2" />

        {/* 糖水 (浓度变化) */}
        <rect x="5" y="-25" width="70" height="50" rx="8"
          fill={concentration === 1 ? '#fef3c7' : concentration === 2 ? '#fde68a' : '#fbbf24'}
          opacity="0.6" />

        {/* 糖分子示意 */}
        {[...Array(concentration * 3)].map((_, i) => (
          <g key={i} transform={`translate(${15 + (i % 4) * 18}, ${-15 + Math.floor(i / 4) * 20})`}>
            <circle cx="0" cy="0" r="4" fill={colors.accent} opacity="0.6" />
            <circle cx="6" cy="3" r="3" fill={colors.accent} opacity="0.4" />
          </g>
        ))}

        {/* 螺旋光路 */}
        <path
          d={`M 0,0 Q 20,${-10 * concentration} 40,0 T 80,0`}
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          strokeDasharray="4,2"
        />

        <text x="40" y="45" textAnchor="middle" fill={colors.text} fontSize="8">
          Sugar solution
        </text>
      </g>

      {/* 旋转后的偏振光 */}
      <g transform="translate(220, 80)">
        <line x1="0" y1="0" x2="35" y2="0" stroke="#22c55e" strokeWidth="3" />
        <polygon points="35,0 28,-4 28,4" fill="#22c55e" />
        {/* 偏振方向 - 已旋转 */}
        <g transform={`translate(18, 0) rotate(${concentration * 30})`}>
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#22c55e" strokeWidth="2" />
        </g>
      </g>

      {/* 第二个偏振片 (检偏器) */}
      <g transform="translate(265, 80)">
        <rect x="-4" y="-35" width="8" height="70" fill={colors.secondary} opacity="0.5" stroke={colors.secondary} strokeWidth="2" />
        <line x1="-25" y1="0" x2="25" y2="0" stroke={colors.secondary} strokeWidth="3" />
        <text x="0" y="-42" textAnchor="middle" fill={colors.muted} fontSize="8">P2</text>
      </g>

      {/* 旋转角度指示 */}
      <g transform="translate(175, 130)">
        <text x="0" y="0" textAnchor="middle" fill={colors.text} fontSize="10" fontWeight="bold">
          θ = {concentration * 30}°
        </text>
        <text x="0" y="15" textAnchor="middle" fill={colors.muted} fontSize="8">
          (Click to change concentration)
        </text>
      </g>

      {/* 公式 */}
      <text x="160" y="20" textAnchor="middle" fill={colors.text} fontSize="10">
        θ = [α] · c · l
      </text>
    </svg>
  )
}

// Stokes参数 - 庞加莱球
export function StokesPoincareSphereIllustration() {
  const colors = useColors()
  const [highlightedAxis, setHighlightedAxis] = useState<'s1' | 's2' | 's3' | null>(null)

  return (
    <svg viewBox="0 0 320 160" className="w-full h-auto">
      <defs>
        <radialGradient id="sphere-grad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* 庞加莱球 */}
      <g transform="translate(160, 85)">
        {/* 球体 */}
        <circle cx="0" cy="0" r="55" fill="url(#sphere-grad)" stroke={colors.secondary} strokeWidth="1.5" />

        {/* 赤道面 */}
        <ellipse cx="0" cy="0" rx="55" ry="18" fill="none" stroke={colors.muted} strokeWidth="1" strokeDasharray="3" />

        {/* S1轴 (水平/垂直偏振) */}
        <g
          onMouseEnter={() => setHighlightedAxis('s1')}
          onMouseLeave={() => setHighlightedAxis(null)}
          className="cursor-pointer"
        >
          <line x1="-65" y1="0" x2="65" y2="0"
            stroke={highlightedAxis === 's1' ? '#ef4444' : colors.danger}
            strokeWidth={highlightedAxis === 's1' ? 3 : 2} />
          <polygon points="65,0 58,-4 58,4" fill={colors.danger} />
          <text x="75" y="4" fill={colors.danger} fontSize="10" fontWeight="bold">S₁</text>
          {highlightedAxis === 's1' && (
            <text x="0" y="-70" textAnchor="middle" fill={colors.danger} fontSize="8">
              Horizontal ↔ Vertical
            </text>
          )}
          {/* 端点标记 */}
          <circle cx="-55" cy="0" r="4" fill={colors.danger} opacity="0.5" />
          <text x="-55" y="15" textAnchor="middle" fill={colors.muted} fontSize="7">V</text>
          <circle cx="55" cy="0" r="4" fill={colors.danger} opacity="0.5" />
          <text x="55" y="15" textAnchor="middle" fill={colors.muted} fontSize="7">H</text>
        </g>

        {/* S2轴 (+45°/-45°偏振) */}
        <g
          onMouseEnter={() => setHighlightedAxis('s2')}
          onMouseLeave={() => setHighlightedAxis(null)}
          className="cursor-pointer"
        >
          <line x1="-40" y1="12" x2="40" y2="-12"
            stroke={highlightedAxis === 's2' ? '#22c55e' : colors.success}
            strokeWidth={highlightedAxis === 's2' ? 3 : 2} />
          <polygon points="40,-12 32,-8 35,-16" fill={colors.success} />
          <text x="50" y="-12" fill={colors.success} fontSize="10" fontWeight="bold">S₂</text>
          {highlightedAxis === 's2' && (
            <text x="0" y="-70" textAnchor="middle" fill={colors.success} fontSize="8">
              +45° ↔ -45°
            </text>
          )}
        </g>

        {/* S3轴 (圆偏振) */}
        <g
          onMouseEnter={() => setHighlightedAxis('s3')}
          onMouseLeave={() => setHighlightedAxis(null)}
          className="cursor-pointer"
        >
          <line x1="0" y1="65" x2="0" y2="-65"
            stroke={highlightedAxis === 's3' ? '#3b82f6' : colors.primary}
            strokeWidth={highlightedAxis === 's3' ? 3 : 2} />
          <polygon points="0,-65 -4,-58 4,-58" fill={colors.primary} />
          <text x="10" y="-60" fill={colors.primary} fontSize="10" fontWeight="bold">S₃</text>
          {highlightedAxis === 's3' && (
            <text x="0" y="-70" textAnchor="middle" fill={colors.primary} fontSize="8">
              RCP ↔ LCP
            </text>
          )}
          {/* 端点标记 */}
          <circle cx="0" cy="-55" r="4" fill={colors.primary} opacity="0.5" />
          <text x="12" y="-52" fill={colors.muted} fontSize="7">R</text>
          <circle cx="0" cy="55" r="4" fill={colors.primary} opacity="0.5" />
          <text x="12" y="58" fill={colors.muted} fontSize="7">L</text>
        </g>

        {/* 示例偏振态点 */}
        <circle cx="35" cy="-25" r="5" fill={colors.accent} stroke="white" strokeWidth="1.5" />
        <line x1="0" y1="0" x2="35" y2="-25" stroke={colors.accent} strokeWidth="1.5" strokeDasharray="3" />
      </g>

      {/* 公式 */}
      <text x="160" y="15" textAnchor="middle" fill={colors.text} fontSize="10" fontWeight="bold">
        Poincaré Sphere: S = (S₀, S₁, S₂, S₃)
      </text>

      {/* 图例 */}
      <g transform="translate(25, 130)">
        <circle cx="0" cy="0" r="4" fill={colors.accent} />
        <text x="10" y="4" fill={colors.muted} fontSize="8">= Polarization state</text>
      </g>
    </svg>
  )
}

// Mueller矩阵 - 光学元件变换
export function MuellerMatrixIllustration() {
  const colors = useColors()
  const [selectedElement, setSelectedElement] = useState<'polarizer' | 'qwp' | 'hwp' | null>(null)

  const elements = {
    polarizer: { name: 'Polarizer', color: '#22d3ee', matrix: '½[1,1,0,0;1,1,0,0;0,0,0,0;0,0,0,0]' },
    qwp: { name: 'λ/4 Plate', color: '#a78bfa', matrix: '[1,0,0,0;0,1,0,0;0,0,0,-1;0,0,1,0]' },
    hwp: { name: 'λ/2 Plate', color: '#4ade80', matrix: '[1,0,0,0;0,1,0,0;0,0,-1,0;0,0,0,-1]' },
  }

  return (
    <svg viewBox="0 0 320 160" className="w-full h-auto">
      {/* 输入Stokes矢量 */}
      <g transform="translate(30, 80)">
        <rect x="-20" y="-35" width="40" height="70" rx="3" fill={colors.primary} opacity="0.2" stroke={colors.primary} strokeWidth="2" />
        <text x="0" y="-5" textAnchor="middle" fill={colors.primary} fontSize="12" fontWeight="bold">S</text>
        <text x="0" y="12" textAnchor="middle" fill={colors.muted} fontSize="8">Input</text>
      </g>

      {/* 箭头 */}
      <line x1="55" y1="80" x2="85" y2="80" stroke={colors.muted} strokeWidth="2" />
      <polygon points="85,80 78,76 78,84" fill={colors.muted} />

      {/* Mueller矩阵 */}
      <g transform="translate(130, 80)">
        <rect x="-35" y="-45" width="70" height="90" rx="5"
          fill={selectedElement ? elements[selectedElement].color : colors.secondary}
          opacity="0.2"
          stroke={selectedElement ? elements[selectedElement].color : colors.secondary}
          strokeWidth="2" />

        {/* 4x4矩阵格子 */}
        <g transform="translate(-25, -35)">
          {[0, 1, 2, 3].map(row => (
            [0, 1, 2, 3].map(col => (
              <rect
                key={`${row}-${col}`}
                x={col * 12}
                y={row * 12}
                width="11"
                height="11"
                fill={colors.bg}
                stroke={colors.muted}
                strokeWidth="0.5"
              />
            ))
          ))}
        </g>

        <text x="0" y="5" textAnchor="middle" fill={colors.secondary} fontSize="14" fontWeight="bold">M</text>
        <text x="0" y="55" textAnchor="middle" fill={colors.muted} fontSize="8">4×4 Matrix</text>
      </g>

      {/* 箭头 */}
      <line x1="175" y1="80" x2="205" y2="80" stroke={colors.muted} strokeWidth="2" />
      <polygon points="205,80 198,76 198,84" fill={colors.muted} />

      {/* 输出Stokes矢量 */}
      <g transform="translate(240, 80)">
        <rect x="-20" y="-35" width="40" height="70" rx="3" fill={colors.success} opacity="0.2" stroke={colors.success} strokeWidth="2" />
        <text x="0" y="-5" textAnchor="middle" fill={colors.success} fontSize="12" fontWeight="bold">S'</text>
        <text x="0" y="12" textAnchor="middle" fill={colors.muted} fontSize="8">Output</text>
      </g>

      {/* 公式 */}
      <text x="160" y="15" textAnchor="middle" fill={colors.text} fontSize="10" fontWeight="bold">
        S' = M · S (Mueller Calculus)
      </text>

      {/* 光学元件选择器 */}
      <g transform="translate(270, 40)">
        {(['polarizer', 'qwp', 'hwp'] as const).map((elem, i) => (
          <g
            key={elem}
            transform={`translate(0, ${i * 25})`}
            onMouseEnter={() => setSelectedElement(elem)}
            onMouseLeave={() => setSelectedElement(null)}
            className="cursor-pointer"
          >
            <circle cx="0" cy="0" r="8"
              fill={elements[elem].color}
              opacity={selectedElement === elem ? 1 : 0.5}
              stroke={selectedElement === elem ? 'white' : 'none'}
              strokeWidth="2"
            />
            <text x="15" y="4" fill={colors.text} fontSize="7">
              {elements[elem].name}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

// ==================== 改进原有插图 ====================

// 3D眼镜工作原理 - 增强版
export function ThreeGlassesIllustration() {
  const colors = useColors()
  const [showDetail, setShowDetail] = useState(false)

  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full h-auto cursor-pointer"
      onClick={() => setShowDetail(!showDetail)}
    >
      <defs>
        <linearGradient id="screen-grad-3d" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* 3D屏幕 */}
      <g transform="translate(15, 35)">
        <rect x="0" y="0" width="85" height="60" rx="4" fill={colors.bg} stroke={colors.muted} strokeWidth="2" />
        <text x="42" y="-8" textAnchor="middle" fill={colors.text} fontSize="9" fontWeight="bold">3D Screen</text>

        {/* 左右图像 */}
        <circle cx="25" cy="25" r="12" fill="#ef4444" opacity="0.6" />
        <circle cx="60" cy="25" r="12" fill="#3b82f6" opacity="0.6" />
        <text x="25" y="50" textAnchor="middle" fill={colors.muted} fontSize="7">L</text>
        <text x="60" y="50" textAnchor="middle" fill={colors.muted} fontSize="7">R</text>

        {/* 圆偏振指示 */}
        <g transform="translate(25, 25)">
          <path d="M -8,0 A 8,8 0 1,1 8,0" fill="none" stroke="#ef4444" strokeWidth="2" />
          <polygon points="8,0 4,-4 4,4" fill="#ef4444" />
        </g>
        <g transform="translate(60, 25)">
          <path d="M 8,0 A 8,8 0 1,1 -8,0" fill="none" stroke="#3b82f6" strokeWidth="2" />
          <polygon points="-8,0 -4,-4 -4,4" fill="#3b82f6" />
        </g>
      </g>

      {/* 光线传播 */}
      <line x1="100" y1="55" x2="150" y2="65" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" />
      <line x1="100" y1="75" x2="150" y2="65" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />

      {/* 3D眼镜 */}
      <g transform="translate(150, 45)">
        <rect x="0" y="0" width="110" height="40" rx="20" fill="none" stroke={colors.text} strokeWidth="2" />
        <ellipse cx="30" cy="20" rx="22" ry="16" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="2" />
        <ellipse cx="80" cy="20" rx="22" ry="16" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="2" />

        {/* 圆偏振符号 */}
        <path d="M 22,14 A 8,8 0 1,1 38,14" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <polygon points="38,14 34,10 34,18" fill="#ef4444" transform="scale(0.7) translate(20, 8)" />

        <path d="M 72,26 A 8,8 0 1,0 88,26" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        <polygon points="88,26 84,22 84,30" fill="#3b82f6" transform="scale(0.7) translate(54, 15)" />
      </g>

      {/* 眼睛 */}
      <g transform="translate(175, 105)">
        <ellipse cx="0" cy="0" rx="12" ry="8" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
        <circle cx="0" cy="0" r="4" fill={colors.text} />
        <line x1="0" y1="-25" x2="0" y2="-10" stroke="#ef4444" strokeWidth="2" />
        <text x="0" y="18" textAnchor="middle" fill={colors.muted} fontSize="7">Left</text>
      </g>
      <g transform="translate(235, 105)">
        <ellipse cx="0" cy="0" rx="12" ry="8" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
        <circle cx="0" cy="0" r="4" fill={colors.text} />
        <line x1="0" y1="-25" x2="0" y2="-10" stroke="#3b82f6" strokeWidth="2" />
        <text x="0" y="18" textAnchor="middle" fill={colors.muted} fontSize="7">Right</text>
      </g>

      {/* 立体感说明 */}
      <g transform="translate(295, 65)">
        <text x="0" y="0" textAnchor="middle" fill={colors.text} fontSize="8">🎬</text>
        <text x="0" y="12" textAnchor="middle" fill={colors.muted} fontSize="6">3D!</text>
      </g>

      {/* 点击提示 */}
      <text x="160" y="150" textAnchor="middle" fill={colors.muted} fontSize="7">
        {showDetail ? 'Left: ↻ CW | Right: ↺ CCW' : 'Click for details'}
      </text>
    </svg>
  )
}

// 偏光太阳镜钓鱼场景 - 增强版
export function PolarizedFishingIllustration() {
  const colors = useColors()
  const [withPolarizer, setWithPolarizer] = useState(true)

  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full h-auto cursor-pointer"
      onClick={() => setWithPolarizer(!withPolarizer)}
    >
      {/* 天空 */}
      <rect x="0" y="0" width="320" height="80" fill="#87ceeb" />

      {/* 太阳 */}
      <g transform="translate(280, 30)">
        <circle cx="0" cy="0" r="18" fill="#fbbf24" />
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1={22 * Math.cos(i * Math.PI / 4)}
            y1={22 * Math.sin(i * Math.PI / 4)}
            x2={28 * Math.cos(i * Math.PI / 4)}
            y2={28 * Math.sin(i * Math.PI / 4)}
            stroke="#fbbf24"
            strokeWidth="2"
          />
        ))}
      </g>

      {/* 水面 */}
      <rect x="0" y="80" width="320" height="80" fill="#3b82f6" opacity="0.6" />

      {/* 水面反光 - 根据偏振状态显示 */}
      {!withPolarizer && (
        <g opacity="0.9">
          <line x1="30" y1="82" x2="80" y2="82" stroke="white" strokeWidth="3" />
          <line x1="120" y1="85" x2="180" y2="85" stroke="white" strokeWidth="3" />
          <line x1="200" y1="82" x2="270" y2="82" stroke="white" strokeWidth="3" />
        </g>
      )}

      {/* 水波纹 */}
      <g opacity="0.3">
        <path d="M 0,100 Q 40,95 80,100 T 160,100 T 240,100 T 320,100" fill="none" stroke="white" strokeWidth="1" />
        <path d="M 0,120 Q 40,115 80,120 T 160,120 T 240,120 T 320,120" fill="none" stroke="white" strokeWidth="1" />
      </g>

      {/* 人物头部和眼睛 */}
      <g transform="translate(160, 50)">
        {/* 眼镜 */}
        {withPolarizer ? (
          <g>
            <rect x="-35" y="-12" width="70" height="24" rx="12" fill="none" stroke={colors.text} strokeWidth="2" />
            <rect x="-30" y="-8" width="25" height="16" rx="8" fill={colors.primary} opacity="0.4" stroke={colors.primary} strokeWidth="1" />
            <rect x="5" y="-8" width="25" height="16" rx="8" fill={colors.primary} opacity="0.4" stroke={colors.primary} strokeWidth="1" />
            <text x="0" y="28" textAnchor="middle" fill={colors.primary} fontSize="9" fontWeight="bold">Polarized</text>
          </g>
        ) : (
          <g>
            <ellipse cx="-15" cy="0" rx="12" ry="8" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
            <circle cx="-15" cy="0" r="4" fill={colors.text} />
            <ellipse cx="15" cy="0" rx="12" ry="8" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
            <circle cx="15" cy="0" r="4" fill={colors.text} />
            <text x="0" y="28" textAnchor="middle" fill={colors.muted} fontSize="9">Bare eyes</text>
          </g>
        )}
      </g>

      {/* 视线 */}
      <line
        x1="160"
        y1="60"
        x2="160"
        y2={withPolarizer ? 130 : 85}
        stroke={withPolarizer ? colors.primary : colors.muted}
        strokeWidth="2"
        strokeDasharray={withPolarizer ? "none" : "4,2"}
      />

      {/* 鱼 */}
      <g transform="translate(160, 120)" opacity={withPolarizer ? 1 : 0.2}>
        <path d="M -20,0 Q 0,-12 20,0 Q 0,12 -20,0" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
        <circle cx="12" cy="-2" r="3" fill="white" />
        <circle cx="13" cy="-2" r="1.5" fill="black" />
        {/* 鱼鳍 */}
        <path d="M 0,-8 L 5,-15 L 8,-5" fill="#f97316" />
        <path d="M -18,0 L -28,-5 L -28,5 Z" fill="#f97316" />
      </g>

      {/* 钓竿 */}
      <line x1="200" y1="30" x2="160" y2="95" stroke={colors.text} strokeWidth="2" />
      <line x1="160" y1="95" x2="160" y2="115" stroke={colors.muted} strokeWidth="1" />

      {/* 状态提示 */}
      <g transform="translate(55, 140)">
        <rect x="-40" y="-12" width="80" height="20" rx="4"
          fill={withPolarizer ? colors.success : colors.danger} opacity="0.2" />
        <text x="0" y="3" textAnchor="middle"
          fill={withPolarizer ? colors.success : colors.danger} fontSize="9" fontWeight="bold">
          {withPolarizer ? '✓ Clear view!' : '✗ Glare!'}
        </text>
      </g>

      {/* 切换提示 */}
      <text x="265" y="150" textAnchor="middle" fill={colors.muted} fontSize="7">
        Click to toggle
      </text>
    </svg>
  )
}

// 手机屏幕与偏光太阳镜 - 增强版
export function PhonePolarizerIllustration() {
  const colors = useColors()
  const [angle, setAngle] = useState(0) // 0, 45, 90

  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full h-auto cursor-pointer"
      onClick={() => setAngle(a => (a + 45) % 135)}
    >
      {/* 手机 */}
      <g transform="translate(40, 25)">
        <rect x="0" y="0" width="60" height="110" rx="8" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
        <rect x="4" y="12" width="52" height="86" fill="#3b82f6" opacity={1 - angle / 180} />
        <circle cx="30" cy="105" r="4" fill={colors.muted} />
        <text x="30" y="8" textAnchor="middle" fill={colors.muted} fontSize="5">LCD</text>

        {/* 偏振方向指示 */}
        <g transform="translate(30, 55)">
          <line x1="-20" y1="0" x2="20" y2="0" stroke={colors.primary} strokeWidth="2" />
          <text x="0" y="-25" textAnchor="middle" fill={colors.muted} fontSize="7">0° polarized</text>
        </g>
      </g>

      {/* 发出的偏振光 */}
      <g transform="translate(110, 80)">
        <line x1="0" y1="0" x2="60" y2="0" stroke={colors.primary} strokeWidth="3" opacity="0.8" />
        <g transform="translate(30, 0)">
          <line x1="0" y1="-15" x2="0" y2="15" stroke={colors.primary} strokeWidth="2" />
        </g>
      </g>

      {/* 眼镜 (可旋转) */}
      <g transform="translate(200, 80)">
        <rect x="-30" y="-25" width="60" height="50" rx="20" fill="none" stroke={colors.text} strokeWidth="2" />
        <rect x="-25" y="-18" width="50" height="36" rx="15" fill={colors.secondary} opacity="0.3" />

        {/* 偏振方向 (旋转) */}
        <g transform={`rotate(${angle})`}>
          <line x1="-20" y1="0" x2="20" y2="0" stroke={colors.secondary} strokeWidth="3" />
        </g>

        <text x="0" y="38" textAnchor="middle" fill={colors.muted} fontSize="8">θ = {angle}°</text>
      </g>

      {/* 透过光强显示 */}
      <g transform="translate(265, 80)">
        {angle === 90 ? (
          <>
            <line x1="-8" y1="-8" x2="8" y2="8" stroke={colors.danger} strokeWidth="3" />
            <line x1="8" y1="-8" x2="-8" y2="8" stroke={colors.danger} strokeWidth="3" />
            <text x="0" y="35" textAnchor="middle" fill={colors.danger} fontSize="9" fontWeight="bold">Blocked!</text>
          </>
        ) : (
          <>
            <ellipse cx="0" cy="0" rx="12" ry="8" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
            <circle cx="0" cy="0" r="4" fill={colors.text} opacity={angle === 0 ? 1 : 0.5} />
            <text x="0" y="35" textAnchor="middle"
              fill={angle === 0 ? colors.primary : colors.muted} fontSize="9" fontWeight="bold">
              {angle === 0 ? 'Bright' : 'Dim'}
            </text>
          </>
        )}
      </g>

      {/* 强度公式 */}
      <text x="160" y="145" textAnchor="middle" fill={colors.text} fontSize="9">
        I = I₀ × cos²({angle}°) = {Math.round(Math.cos(angle * Math.PI / 180) ** 2 * 100)}%
      </text>

      {/* 点击提示 */}
      <text x="160" y="15" textAnchor="middle" fill={colors.muted} fontSize="7">
        Click to rotate glasses
      </text>
    </svg>
  )
}

// 方解石双折射 - 增强版
export function CalciteIllustration() {
  const colors = useColors()
  const [showRays, setShowRays] = useState(true)

  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full h-auto cursor-pointer"
      onClick={() => setShowRays(!showRays)}
    >
      {/* 背景纸张 */}
      <rect x="15" y="110" width="290" height="40" fill="white" stroke={colors.muted} strokeWidth="1" />
      <text x="90" y="135" textAnchor="middle" fill={colors.text} fontSize="11">CALCITE</text>

      {/* 方解石晶体 */}
      <g transform="translate(70, 30)">
        <path d="M 0,45 L 20,0 L 140,0 L 160,25 L 160,70 L 140,115 L 20,115 L 0,90 Z"
              fill={colors.primary} opacity="0.15" stroke={colors.primary} strokeWidth="2" />

        {/* 晶体内部纹理 */}
        <line x1="20" y1="0" x2="20" y2="115" stroke={colors.primary} strokeWidth="0.5" opacity="0.3" />
        <line x1="70" y1="0" x2="70" y2="115" stroke={colors.primary} strokeWidth="0.5" opacity="0.3" />
        <line x1="120" y1="0" x2="120" y2="115" stroke={colors.primary} strokeWidth="0.5" opacity="0.3" />

        {/* 光轴 */}
        <line x1="80" y1="15" x2="80" y2="100" stroke={colors.accent} strokeWidth="1" strokeDasharray="4,2" />
        <text x="95" y="58" fill={colors.accent} fontSize="7">Optic Axis</text>

        {/* 入射光 */}
        <line x1="-40" y1="57" x2="0" y2="57" stroke="#fbbf24" strokeWidth="3" />
        <polygon points="0,57 -8,53 -8,61" fill="#fbbf24" />

        {showRays && (
          <>
            {/* o光 (寻常光) */}
            <line x1="0" y1="57" x2="160" y2="45" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="160" y1="45" x2="210" y2="38" stroke="#ef4444" strokeWidth="2.5" />
            {/* o光偏振方向 (垂直纸面) */}
            <circle cx="185" cy="42" r="4" fill="none" stroke="#ef4444" strokeWidth="1.5" />
            <circle cx="185" cy="42" r="1" fill="#ef4444" />

            {/* e光 (非寻常光) */}
            <line x1="0" y1="57" x2="160" y2="70" stroke="#22c55e" strokeWidth="2.5" />
            <line x1="160" y1="70" x2="210" y2="80" stroke="#22c55e" strokeWidth="2.5" />
            {/* e光偏振方向 (平行纸面) */}
            <g transform="translate(185, 75)">
              <line x1="-5" y1="-5" x2="5" y2="5" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="5" y1="-5" x2="-5" y2="5" stroke="#22c55e" strokeWidth="1.5" />
            </g>
          </>
        )}
      </g>

      {/* 双像效果 */}
      <g transform="translate(70, 30)">
        <text x="50" y="80" fill="#ef4444" fontSize="9" opacity="0.8">CALCITE</text>
        <text x="70" y="92" fill="#22c55e" fontSize="9" opacity="0.8">CALCITE</text>
      </g>

      {/* 图例 */}
      <g transform="translate(260, 35)">
        <circle cx="0" cy="0" r="4" fill="none" stroke="#ef4444" strokeWidth="2" />
        <circle cx="0" cy="0" r="1" fill="#ef4444" />
        <text x="12" y="4" fill={colors.muted} fontSize="8">o-ray</text>

        <g transform="translate(0, 18)">
          <line x1="-4" y1="-4" x2="4" y2="4" stroke="#22c55e" strokeWidth="2" />
          <line x1="4" y1="-4" x2="-4" y2="4" stroke="#22c55e" strokeWidth="2" />
        </g>
        <text x="12" y="22" fill={colors.muted} fontSize="8">e-ray</text>
      </g>

      {/* 维京船 */}
      <g transform="translate(265, 105)">
        <path d="M 0,30 Q 22,22 45,30 L 38,30 L 22,15 L 8,30 Z" fill={colors.muted} />
        <line x1="22" y1="5" x2="22" y2="30" stroke={colors.muted} strokeWidth="1.5" />
        <path d="M 22,8 L 38,18 L 22,23 Z" fill={colors.muted} />
        <text x="22" y="45" textAnchor="middle" fill={colors.muted} fontSize="6">Sunstone</text>
      </g>

      {/* 交互提示 */}
      <text x="160" y="12" textAnchor="middle" fill={colors.muted} fontSize="7">
        Click to {showRays ? 'hide' : 'show'} ray paths
      </text>
    </svg>
  )
}

// 日落湖面反射 - 增强版
export function SunsetLakeIllustration() {
  const colors = useColors()

  return (
    <svg viewBox="0 0 320 160" className="w-full h-auto">
      <defs>
        <linearGradient id="noon-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
        <linearGradient id="sunset-sky-v2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      {/* 左边：中午 */}
      <g>
        <rect x="0" y="0" width="160" height="80" fill="url(#noon-sky)" />
        <circle cx="80" cy="25" r="15" fill="#fbbf24" />
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1={80 + 18 * Math.cos(i * Math.PI / 4)}
            y1={25 + 18 * Math.sin(i * Math.PI / 4)}
            x2={80 + 24 * Math.cos(i * Math.PI / 4)}
            y2={25 + 24 * Math.sin(i * Math.PI / 4)}
            stroke="#fbbf24"
            strokeWidth="2"
          />
        ))}

        {/* 水面 */}
        <rect x="0" y="80" width="160" height="80" fill="#3b82f6" opacity="0.5" />

        {/* 入射光和透射光 */}
        <line x1="80" y1="40" x2="80" y2="80" stroke={colors.accent} strokeWidth="2" />
        <line x1="80" y1="80" x2="80" y2="130" stroke={colors.primary} strokeWidth="2" opacity="0.7" />

        {/* 小反射 */}
        <line x1="80" y1="80" x2="95" y2="65" stroke={colors.muted} strokeWidth="1" opacity="0.5" />

        {/* 鱼 (清晰可见) */}
        <g transform="translate(80, 115)">
          <path d="M -15,0 Q 0,-10 15,0 Q 0,10 -15,0" fill="#f97316" />
          <circle cx="10" cy="-2" r="2" fill="white" />
        </g>

        {/* 标签 */}
        <text x="80" y="12" textAnchor="middle" fill={colors.text} fontSize="9" fontWeight="bold">Noon</text>
        <rect x="55" y="145" width="50" height="12" rx="2" fill={colors.success} opacity="0.2" />
        <text x="80" y="154" textAnchor="middle" fill={colors.success} fontSize="8">~2% reflect</text>
      </g>

      {/* 分隔线 */}
      <line x1="160" y1="0" x2="160" y2="160" stroke={colors.muted} strokeWidth="1" />

      {/* 右边：日落 */}
      <g transform="translate(160, 0)">
        <rect x="0" y="0" width="160" height="80" fill="url(#sunset-sky-v2)" />
        <circle cx="140" cy="65" r="20" fill="#ef4444" />

        {/* 水面 */}
        <rect x="0" y="80" width="160" height="80" fill="#1e3a5f" />

        {/* 强反射 */}
        <ellipse cx="120" cy="95" rx="25" ry="8" fill="#ef4444" opacity="0.5" />
        <line x1="100" y1="88" x2="140" y2="88" stroke="#fbbf24" strokeWidth="2" />
        <line x1="110" y1="92" x2="130" y2="92" stroke="#fbbf24" strokeWidth="1" />

        {/* 掠入射光 */}
        <line x1="20" y1="30" x2="80" y2="80" stroke={colors.accent} strokeWidth="2" />
        {/* 强反射 */}
        <line x1="80" y1="80" x2="140" y2="30" stroke={colors.danger} strokeWidth="2" />
        {/* 弱透射 */}
        <line x1="80" y1="80" x2="90" y2="120" stroke={colors.primary} strokeWidth="1" opacity="0.3" />

        {/* 鱼 (几乎不可见) */}
        <g transform="translate(80, 115)" opacity="0.2">
          <path d="M -15,0 Q 0,-10 15,0 Q 0,10 -15,0" fill={colors.muted} />
        </g>

        {/* 标签 */}
        <text x="80" y="12" textAnchor="middle" fill={colors.text} fontSize="9" fontWeight="bold">Sunset</text>
        <rect x="55" y="145" width="50" height="12" rx="2" fill={colors.danger} opacity="0.2" />
        <text x="80" y="154" textAnchor="middle" fill={colors.danger} fontSize="8">~50% reflect</text>
      </g>
    </svg>
  )
}

// 橱窗摄影对比 - 增强版
export function WindowPhotographyIllustration() {
  const colors = useColors()

  return (
    <svg viewBox="0 0 320 160" className="w-full h-auto">
      {/* 左边：有反光 */}
      <g>
        <rect x="10" y="20" width="130" height="95" fill={colors.bg} stroke={colors.text} strokeWidth="2" />

        {/* 橱窗内容 (模糊) */}
        <rect x="25" y="40" width="35" height="50" fill={colors.secondary} opacity="0.2" />
        <rect x="70" y="35" width="45" height="60" fill={colors.primary} opacity="0.2" />

        {/* 反光遮挡 */}
        <rect x="10" y="20" width="130" height="95" fill="white" opacity="0.4" />
        <line x1="20" y1="30" x2="60" y2="60" stroke="white" strokeWidth="4" />
        <line x1="80" y1="35" x2="130" y2="75" stroke="white" strokeWidth="4" />

        {/* 相机 */}
        <g transform="translate(75, 130)">
          <rect x="-18" y="-12" width="36" height="22" rx="4" fill={colors.text} />
          <circle cx="0" cy="0" r="8" fill={colors.muted} />
          <circle cx="0" cy="0" r="5" fill="#1e293b" />
        </g>

        <text x="75" y="12" textAnchor="middle" fill={colors.text} fontSize="8" fontWeight="bold">Without Filter</text>
      </g>

      {/* 分隔线 */}
      <line x1="160" y1="0" x2="160" y2="160" stroke={colors.muted} strokeWidth="1" />

      {/* 右边：无反光 */}
      <g transform="translate(160, 0)">
        <rect x="10" y="20" width="130" height="95" fill={colors.bg} stroke={colors.text} strokeWidth="2" />

        {/* 橱窗内容 (清晰) */}
        <rect x="25" y="40" width="35" height="50" fill={colors.secondary} stroke={colors.secondary} strokeWidth="1" />
        <rect x="70" y="35" width="45" height="60" fill={colors.primary} stroke={colors.primary} strokeWidth="1" />

        {/* 相机 + 偏振滤镜 */}
        <g transform="translate(75, 130)">
          <rect x="-18" y="-12" width="36" height="22" rx="4" fill={colors.text} />
          <circle cx="0" cy="0" r="8" fill={colors.primary} />
          <circle cx="0" cy="0" r="10" fill="none" stroke={colors.primary} strokeWidth="2" />
          <circle cx="0" cy="0" r="5" fill="#1e293b" />
        </g>

        <text x="75" y="12" textAnchor="middle" fill={colors.text} fontSize="8" fontWeight="bold">With Polarizer</text>
      </g>

      {/* 布儒斯特角说明 */}
      <text x="160" y="155" textAnchor="middle" fill={colors.muted} fontSize="7">
        Reflected glare is horizontally polarized
      </text>
    </svg>
  )
}

// 应力光弹性 - 增强版
export function PhotoelasticityIllustration() {
  const colors = useColors()

  return (
    <svg viewBox="0 0 320 160" className="w-full h-auto">
      {/* 光源 */}
      <circle cx="12" cy="80" r="6" fill={colors.accent} />
      <line x1="18" y1="80" x2="30" y2="80" stroke={colors.accent} strokeWidth="2" />

      {/* 偏振片1 */}
      <g transform="translate(40, 80)">
        <rect x="-5" y="-35" width="10" height="70" fill={colors.primary} opacity="0.4" stroke={colors.primary} strokeWidth="1" />
        <line x1="0" y1="-30" x2="0" y2="30" stroke={colors.primary} strokeWidth="2" />
        <text x="0" y="-40" textAnchor="middle" fill={colors.muted} fontSize="7">P</text>
      </g>

      {/* 塑料模型 */}
      <g transform="translate(75, 45)">
        <path d="M 0,35 L 35,0 L 120,0 L 155,35 L 155,70 L 120,70 L 80,50 L 35,70 L 0,70 Z"
              fill="none" stroke={colors.text} strokeWidth="2" />

        {/* 应力彩色条纹 - 更丰富 */}
        <path d="M 15,55 Q 40,40 65,55" fill="none" stroke="#ef4444" strokeWidth="3" />
        <path d="M 18,50 Q 43,35 68,50" fill="none" stroke="#f97316" strokeWidth="3" />
        <path d="M 21,45 Q 46,30 71,45" fill="none" stroke="#fbbf24" strokeWidth="3" />
        <path d="M 24,40 Q 49,25 74,40" fill="none" stroke="#84cc16" strokeWidth="3" />
        <path d="M 27,35 Q 52,20 77,35" fill="none" stroke="#22c55e" strokeWidth="3" />
        <path d="M 30,30 Q 55,15 80,30" fill="none" stroke="#06b6d4" strokeWidth="3" />

        <path d="M 95,20 Q 120,35 95,50" fill="none" stroke="#3b82f6" strokeWidth="3" />
        <path d="M 100,18 Q 125,33 100,48" fill="none" stroke="#8b5cf6" strokeWidth="3" />
        <path d="M 105,16 Q 130,31 105,46" fill="none" stroke="#d946ef" strokeWidth="3" />
        <path d="M 110,14 Q 135,29 110,44" fill="none" stroke="#ec4899" strokeWidth="3" />

        {/* 应力箭头 */}
        <polygon points="0,35 -12,28 -12,42" fill={colors.danger} />
        <polygon points="155,35 167,28 167,42" fill={colors.danger} />

        <text x="77" y="82" textAnchor="middle" fill={colors.muted} fontSize="7">Stressed plastic</text>
      </g>

      {/* 偏振片2 */}
      <g transform="translate(250, 80)">
        <rect x="-5" y="-35" width="10" height="70" fill={colors.secondary} opacity="0.4" stroke={colors.secondary} strokeWidth="1" />
        <line x1="-25" y1="0" x2="25" y2="0" stroke={colors.secondary} strokeWidth="2" />
        <text x="0" y="-40" textAnchor="middle" fill={colors.muted} fontSize="7">A</text>
      </g>

      {/* 观察者 */}
      <g transform="translate(285, 80)">
        <ellipse cx="0" cy="0" rx="10" ry="7" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
        <circle cx="0" cy="0" r="3" fill={colors.text} />
      </g>

      {/* 底部说明 */}
      <text x="160" y="150" textAnchor="middle" fill={colors.text} fontSize="8">
        Stress patterns reveal force distribution
      </text>
    </svg>
  )
}

// 天空散射 - 增强版
export function SkyScatteringIllustration() {
  const colors = useColors()

  return (
    <svg viewBox="0 0 320 160" className="w-full h-auto">
      <defs>
        <linearGradient id="blue-sky-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="sunset-grad-v2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>

      {/* 左边：蓝天 */}
      <g>
        <rect x="0" y="0" width="160" height="160" fill="url(#blue-sky-grad)" />

        {/* 太阳 */}
        <circle cx="80" cy="25" r="15" fill="#fbbf24" />

        {/* 白光入射 */}
        <line x1="80" y1="40" x2="80" y2="80" stroke="white" strokeWidth="3" />

        {/* 散射的蓝光 */}
        <g opacity="0.8">
          <line x1="80" y1="80" x2="45" y2="115" stroke="#3b82f6" strokeWidth="2" />
          <line x1="80" y1="80" x2="115" y2="115" stroke="#3b82f6" strokeWidth="2" />
          <line x1="80" y1="80" x2="35" y2="80" stroke="#3b82f6" strokeWidth="2" />
          <line x1="80" y1="80" x2="125" y2="80" stroke="#3b82f6" strokeWidth="2" />
          <line x1="80" y1="80" x2="60" y2="60" stroke="#3b82f6" strokeWidth="2" />
          <line x1="80" y1="80" x2="100" y2="60" stroke="#3b82f6" strokeWidth="2" />
        </g>

        {/* 散射粒子 */}
        <circle cx="80" cy="80" r="4" fill={colors.muted} opacity="0.5" />

        {/* 观察者 */}
        <g transform="translate(55, 135)">
          <ellipse cx="0" cy="0" rx="8" ry="5" fill={colors.bg} stroke="white" strokeWidth="1" />
          <path d="M -8,5 Q 0,15 8,5" fill="none" stroke="white" strokeWidth="1" />
        </g>

        <text x="80" y="155" textAnchor="middle" fill="white" fontSize="8">Blue Sky</text>
      </g>

      {/* 分隔线 */}
      <line x1="160" y1="0" x2="160" y2="160" stroke="white" strokeWidth="1" opacity="0.3" />

      {/* 右边：日落 */}
      <g transform="translate(160, 0)">
        <rect x="0" y="0" width="160" height="160" fill="url(#sunset-grad-v2)" />

        {/* 太阳在地平线 */}
        <circle cx="140" cy="120" r="20" fill="#ef4444" />

        {/* 长路径光线 */}
        <line x1="15" y1="120" x2="120" y2="120" stroke="#ef4444" strokeWidth="3" opacity="0.7" />

        {/* 蓝光被散射掉 */}
        <g opacity="0.4">
          <line x1="40" y1="120" x2="25" y2="95" stroke="#3b82f6" strokeWidth="1" />
          <line x1="60" y1="120" x2="45" y2="90" stroke="#3b82f6" strokeWidth="1" />
          <line x1="80" y1="120" x2="65" y2="85" stroke="#3b82f6" strokeWidth="1" />
          <line x1="100" y1="120" x2="85" y2="80" stroke="#3b82f6" strokeWidth="1" />
        </g>

        {/* 观察者 */}
        <g transform="translate(25, 130)">
          <ellipse cx="0" cy="0" rx="8" ry="5" fill={colors.bg} stroke="white" strokeWidth="1" />
        </g>

        <text x="80" y="155" textAnchor="middle" fill="white" fontSize="8">Sunset</text>
      </g>

      {/* 公式 */}
      <rect x="130" y="5" width="60" height="16" rx="3" fill="rgba(0,0,0,0.3)" />
      <text x="160" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">I ∝ 1/λ⁴</text>
    </svg>
  )
}

// 白云与蓝天对比 - 增强版
export function CloudsVsSkyIllustration() {
  const colors = useColors()

  return (
    <svg viewBox="0 0 320 160" className="w-full h-auto">
      {/* 蓝天背景 */}
      <rect x="0" y="0" width="320" height="160" fill="#60a5fa" />

      {/* 白云 */}
      <g>
        <ellipse cx="70" cy="45" rx="40" ry="22" fill="white" />
        <ellipse cx="45" cy="52" rx="28" ry="18" fill="white" />
        <ellipse cx="95" cy="52" rx="28" ry="18" fill="white" />
        <ellipse cx="70" cy="60" rx="35" ry="15" fill="white" />
      </g>
      <g transform="translate(160, 25)">
        <ellipse cx="70" cy="35" rx="45" ry="25" fill="white" />
        <ellipse cx="40" cy="42" rx="30" ry="20" fill="white" />
        <ellipse cx="100" cy="42" rx="30" ry="20" fill="white" />
      </g>

      {/* 太阳 */}
      <circle cx="280" cy="30" r="20" fill="#fbbf24" />

      {/* 对比说明 */}
      <g transform="translate(35, 105)">
        {/* 空气分子 */}
        <circle cx="0" cy="0" r="2" fill={colors.primary} />
        <circle cx="12" cy="4" r="2" fill={colors.primary} />
        <circle cx="6" cy="-6" r="2" fill={colors.primary} />
        <text x="6" y="18" textAnchor="middle" fill={colors.text} fontSize="7" fontWeight="bold">Air molecules</text>
        <text x="6" y="28" textAnchor="middle" fill={colors.text} fontSize="6">(~0.3nm)</text>
        <text x="6" y="42" textAnchor="middle" fill="#3b82f6" fontSize="7">→ Blue</text>
      </g>

      <g transform="translate(130, 105)">
        {/* 水滴 */}
        <circle cx="8" cy="0" r="10" fill="white" stroke={colors.muted} strokeWidth="1" />
        <text x="8" y="20" textAnchor="middle" fill={colors.text} fontSize="7" fontWeight="bold">Water droplets</text>
        <text x="8" y="30" textAnchor="middle" fill={colors.text} fontSize="6">(~10μm)</text>
        <text x="8" y="44" textAnchor="middle" fill="white" fontSize="7">→ White</text>
      </g>

      <g transform="translate(230, 105)">
        <text x="30" y="0" textAnchor="middle" fill={colors.text} fontSize="7" fontWeight="bold">Mie scattering</text>
        <text x="30" y="12" textAnchor="middle" fill={colors.text} fontSize="6">All λ equally</text>
        {/* 多色箭头 */}
        <line x1="10" y1="22" x2="50" y2="22" stroke="#ef4444" strokeWidth="2" />
        <line x1="10" y1="27" x2="50" y2="27" stroke="#22c55e" strokeWidth="2" />
        <line x1="10" y1="32" x2="50" y2="32" stroke="#3b82f6" strokeWidth="2" />
        <text x="30" y="48" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">= White</text>
      </g>
    </svg>
  )
}

// 导出所有插图映射
export const LIFE_SCENE_ILLUSTRATIONS: Record<string, React.ComponentType> = {
  // 新增插图
  'light-wave': LightWaveIllustration,
  'polarization-types': PolarizationTypesIllustration,
  'optical-bench': OpticalBenchIllustration,
  'optical-rotation': OpticalRotationIllustration,
  'stokes': StokesPoincareSphereIllustration,
  'mueller': MuellerMatrixIllustration,

  // 原有插图 (增强版)
  'polarization-state': ThreeGlassesIllustration,
  'polarization-intro': PolarizedFishingIllustration,
  'malus': PhonePolarizerIllustration,
  'birefringence': CalciteIllustration,
  'waveplate': ThreeGlassesIllustration,
  'fresnel': SunsetLakeIllustration,
  'brewster': WindowPhotographyIllustration,
  'anisotropy': PhotoelasticityIllustration,
  'chromatic': PhotoelasticityIllustration,
  'rayleigh': SkyScatteringIllustration,
  'mie-scattering': CloudsVsSkyIllustration,
}
