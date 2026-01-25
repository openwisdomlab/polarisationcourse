/**
 * PolarizationLockDemo - 偏振隐写术密码锁演示
 *
 * 基于真实物理原理的设计：
 * 1. 密码用特定偏振方向的材料印刷在文件上
 * 2. 自然光（非偏振光）下，密码不可见（所有方向光混合，无对比度）
 * 3. 用偏振观察镜观察时，只有特定方向的光通过
 * 4. 密码区域和背景的偏振特性不同 → 产生对比度 → 密码可见
 * 5. 旋转偏振镜，对比度按 cos²θ 变化（马吕斯定律）
 *
 * 真实应用场景：
 * - 防伪标签（证件、钞票）
 * - 3D电影眼镜原理
 * - LCD屏幕工作原理
 * - 偏振太阳镜消除眩光
 */
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Eye,
  EyeOff,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
  Info,
} from 'lucide-react'
import { InfoCard, Formula, SliderControl } from '../DemoControls'

// ============ 物理常量和计算 ============

// 密码偏振方向（假设密码用90°垂直偏振材料印刷）
const SECRET_POLARIZATION_ANGLE = 90

// 背景偏振方向（0°水平偏振）
const BACKGROUND_POLARIZATION_ANGLE = 0

/**
 * 计算偏振光通过偏振片后的强度（马吕斯定律）
 * I = I₀ × cos²(θ)
 * θ = 偏振片透过轴与入射光偏振方向的夹角
 */
function calculateTransmission(polarizationAngle: number, filterAngle: number): number {
  const theta = Math.abs(polarizationAngle - filterAngle) * (Math.PI / 180)
  return Math.cos(theta) ** 2
}

/**
 * 计算密码的可见对比度
 * 对比度 = |密码区透过率 - 背景区透过率|
 * 当偏振镜与密码偏振方向平行时，对比度最大
 */
function calculateContrast(filterAngle: number): number {
  const secretTransmission = calculateTransmission(SECRET_POLARIZATION_ANGLE, filterAngle)
  const bgTransmission = calculateTransmission(BACKGROUND_POLARIZATION_ANGLE, filterAngle)
  return Math.abs(secretTransmission - bgTransmission)
}

// ============ 子组件 ============

/**
 * 非偏振光源 - 灯泡发出的自然光
 * 用多方向箭头表示振动方向是随机的
 */
function UnpolarizedLightSource({ isZh }: { isZh: boolean }) {
  const { theme } = useTheme()
  const arrowAngles = [0, 45, 90, 135, 180, 225, 270, 315]

  return (
    <g>
      {/* 灯泡外发光 */}
      <motion.circle
        cx="0"
        cy="0"
        r="50"
        fill="#ffd700"
        opacity="0.15"
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 灯泡主体 */}
      <circle cx="0" cy="0" r="35" fill="#ffd700" opacity="0.9" />
      <circle cx="0" cy="0" r="25" fill="#fff" opacity="0.8" />

      {/* 灯座 */}
      <rect x="-15" y="32" width="30" height="20" fill="#94a3b8" rx="3" />
      <rect x="-12" y="50" width="24" height="5" fill="#64748b" rx="2" />

      {/* 非偏振光振动方向箭头（多方向） */}
      {arrowAngles.map((angle, i) => (
        <motion.g
          key={angle}
          transform={`rotate(${angle})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        >
          <line
            x1="40"
            y1="0"
            x2="65"
            y2="0"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <polygon points="65,0 58,-4 58,4" fill="#fbbf24" />
        </motion.g>
      ))}

      {/* 标签 */}
      <text
        x="0"
        y="75"
        textAnchor="middle"
        fill={theme === 'dark' ? '#fbbf24' : '#d97706'}
        fontSize="13"
        fontWeight="600"
      >
        {isZh ? '自然光源' : 'Natural Light'}
      </text>
      <text
        x="0"
        y="90"
        textAnchor="middle"
        fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
        fontSize="11"
      >
        {isZh ? '(非偏振光)' : '(Unpolarized)'}
      </text>
    </g>
  )
}

/**
 * 偏振观察镜 - 可旋转的偏振片
 * 栅格线表示透过轴方向
 */
interface PolarizingLensProps {
  angle: number
  onAngleChange: (angle: number) => void
  disabled?: boolean
  isZh: boolean
}

function PolarizingLens({ angle, onAngleChange, disabled, isZh }: PolarizingLensProps) {
  const { theme } = useTheme()
  const containerRef = useRef<SVGGElement>(null)
  const isDragging = useRef(false)
  const startAngle = useRef(0)
  const startMouseAngle = useRef(0)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || !containerRef.current) return

      isDragging.current = true
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      startAngle.current = angle
      startMouseAngle.current = (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI

      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [angle, disabled]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const currentMouseAngle = (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI
      const deltaAngle = currentMouseAngle - startMouseAngle.current

      let newAngle = (startAngle.current + deltaAngle) % 180
      if (newAngle < 0) newAngle += 180

      onAngleChange(Math.round(newAngle))
    },
    [onAngleChange]
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const lineCount = 9
  const radius = 55

  return (
    <g
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ cursor: disabled ? 'not-allowed' : 'grab', touchAction: 'none' }}
    >
      {/* 手柄 */}
      <rect
        x="-8"
        y={radius + 5}
        width="16"
        height="40"
        fill={theme === 'dark' ? '#475569' : '#94a3b8'}
        rx="4"
      />
      <rect
        x="-12"
        y={radius + 40}
        width="24"
        height="15"
        fill={theme === 'dark' ? '#334155' : '#64748b'}
        rx="5"
      />

      {/* 外圈光晕（拖拽提示） */}
      {!disabled && (
        <motion.circle
          cx="0"
          cy="0"
          r={radius + 10}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeDasharray="8 4"
          opacity="0.4"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* 镜框 */}
      <circle
        cx="0"
        cy="0"
        r={radius}
        fill={theme === 'dark' ? 'rgba(34, 211, 238, 0.08)' : 'rgba(34, 211, 238, 0.12)'}
        stroke="#22d3ee"
        strokeWidth="4"
      />

      {/* 栅格线（表示偏振方向） */}
      <motion.g animate={{ rotate: angle }} transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
        {Array.from({ length: lineCount }, (_, i) => {
          const offset = ((i - Math.floor(lineCount / 2)) / (lineCount / 2)) * (radius - 10)
          const lineLength = Math.sqrt((radius - 10) ** 2 - offset ** 2)
          if (lineLength <= 0) return null
          return (
            <line
              key={i}
              x1={-lineLength}
              y1={offset}
              x2={lineLength}
              y2={offset}
              stroke="#22d3ee"
              strokeWidth={i === Math.floor(lineCount / 2) ? 3 : 1.5}
              opacity={i === Math.floor(lineCount / 2) ? 0.9 : 0.5}
            />
          )
        })}

        {/* 透过轴指示箭头 */}
        <polygon points={`0,${-radius - 8} -6,${-radius + 2} 6,${-radius + 2}`} fill="#22d3ee" />
        <polygon points={`0,${radius + 8} -6,${radius - 2} 6,${radius - 2}`} fill="#22d3ee" />
      </motion.g>

      {/* 角度显示 */}
      <circle cx="0" cy="0" r="18" fill={theme === 'dark' ? '#0f172a' : '#f1f5f9'} />
      <text x="0" y="5" textAnchor="middle" fill="#22d3ee" fontSize="14" fontWeight="bold">
        {angle}°
      </text>

      {/* 标签 */}
      <text
        x="0"
        y={radius + 75}
        textAnchor="middle"
        fill="#22d3ee"
        fontSize="13"
        fontWeight="600"
      >
        {isZh ? '偏振观察镜' : 'Polarizer Lens'}
      </text>
      {!disabled && (
        <text
          x="0"
          y={radius + 90}
          textAnchor="middle"
          fill={theme === 'dark' ? '#64748b' : '#94a3b8'}
          fontSize="10"
        >
          {isZh ? '↻ 拖拽旋转' : '↻ Drag to rotate'}
        </text>
      )}
    </g>
  )
}

/**
 * 偏振光箭头 - 通过偏振片后的光
 * 只有一个振动方向
 */
function PolarizedLightArrows({
  angle,
  intensity,
}: {
  angle: number
  intensity: number
}) {
  if (intensity < 0.05) return null

  return (
    <motion.g animate={{ opacity: 0.3 + intensity * 0.7 }} transition={{ duration: 0.3 }}>
      {[0, 20, 40].map((offset, i) => (
        <motion.g
          key={i}
          transform={`translate(${offset}, 0)`}
          initial={{ x: -20 }}
          animate={{ x: 60 }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25, ease: 'linear' }}
        >
          <g transform={`rotate(${angle})`}>
            <line x1="-15" y1="0" x2="15" y2="0" stroke="#22d3ee" strokeWidth="2" opacity={intensity} />
            <polygon points="15,0 10,-4 10,4" fill="#22d3ee" opacity={intensity} />
            <polygon points="-15,0 -10,-4 -10,4" fill="#22d3ee" opacity={intensity} />
          </g>
        </motion.g>
      ))}
    </motion.g>
  )
}

/**
 * 机密文件 - 带偏振隐写密码
 * 密码的可见度取决于偏振镜角度
 */
interface SecretDocumentProps {
  password: string
  contrast: number // 0-1，对比度
  isZh: boolean
}

function SecretDocument({ password, contrast, isZh }: SecretDocumentProps) {
  const { theme } = useTheme()

  // 密码可见度：基于对比度计算
  const passwordOpacity = Math.min(1, contrast * 2)
  const passwordBlur = Math.max(0, (1 - contrast) * 8)

  return (
    <g>
      {/* 文件背景 */}
      <rect
        x="-70"
        y="-80"
        width="140"
        height="160"
        fill={theme === 'dark' ? '#1e293b' : '#f8fafc'}
        stroke={theme === 'dark' ? '#334155' : '#e2e8f0'}
        strokeWidth="2"
        rx="8"
      />

      {/* 文件标题 */}
      <text
        x="0"
        y="-55"
        textAnchor="middle"
        fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
        fontSize="11"
        fontWeight="600"
      >
        {isZh ? '机密文件' : 'CLASSIFIED'}
      </text>
      <line
        x1="-50"
        y1="-45"
        x2="50"
        y2="-45"
        stroke={theme === 'dark' ? '#334155' : '#e2e8f0'}
        strokeWidth="1"
      />

      {/* 装饰线条（模拟文字） */}
      {[-30, -15, 0, 15].map((y) => (
        <rect
          key={y}
          x="-50"
          y={y}
          width={40 + Math.random() * 40}
          height="4"
          fill={theme === 'dark' ? '#334155' : '#e2e8f0'}
          rx="2"
        />
      ))}

      {/* 隐藏密码区域 */}
      <rect
        x="-55"
        y="35"
        width="110"
        height="35"
        fill={theme === 'dark' ? '#0f172a' : '#f1f5f9'}
        stroke={contrast > 0.5 ? '#22c55e' : theme === 'dark' ? '#475569' : '#cbd5e1'}
        strokeWidth="2"
        rx="4"
      />

      {/* 密码文字 */}
      <text
        x="0"
        y="60"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="22"
        fontWeight="bold"
        fill={contrast > 0.5 ? '#22c55e' : '#a855f7'}
        style={{
          opacity: passwordOpacity,
          filter: `blur(${passwordBlur}px)`,
          transition: 'all 0.3s ease',
        }}
      >
        {password}
      </text>

      {/* 密码不可见时的提示 */}
      {contrast < 0.3 && (
        <text
          x="0"
          y="60"
          textAnchor="middle"
          fill={theme === 'dark' ? '#475569' : '#94a3b8'}
          fontSize="12"
        >
          {isZh ? '???' : '???'}
        </text>
      )}

      {/* 标签 */}
      <text
        x="0"
        y="95"
        textAnchor="middle"
        fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
        fontSize="12"
        fontWeight="500"
      >
        {isZh ? '偏振隐写密码' : 'Polarized Secret'}
      </text>
      <text
        x="0"
        y="110"
        textAnchor="middle"
        fill={theme === 'dark' ? '#64748b' : '#94a3b8'}
        fontSize="10"
      >
        ({isZh ? '偏振方向' : 'Polarization'}: {SECRET_POLARIZATION_ANGLE}°)
      </text>
    </g>
  )
}

/**
 * 物理原理说明面板
 */
interface PhysicsExplanationProps {
  filterAngle: number
  contrast: number
  secretTransmission: number
  bgTransmission: number
  isZh: boolean
  showDetails: boolean
  onToggleDetails: () => void
}

function PhysicsExplanation({
  filterAngle,
  contrast,
  secretTransmission,
  bgTransmission,
  isZh,
  showDetails,
  onToggleDetails,
}: PhysicsExplanationProps) {
  const { theme } = useTheme()

  // 计算与密码偏振方向的夹角
  const thetaSecret = Math.abs(SECRET_POLARIZATION_ANGLE - filterAngle)
  const thetaBg = Math.abs(BACKGROUND_POLARIZATION_ANGLE - filterAngle)

  return (
    <div
      className={cn(
        'p-4 rounded-xl border',
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}
    >
      {/* 标题和展开按钮 */}
      <button
        onClick={onToggleDetails}
        className="w-full flex items-center justify-between mb-3"
      >
        <h4
          className={cn('font-semibold flex items-center gap-2', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}
        >
          <Info className="w-4 h-4" />
          {isZh ? '物理原理解析' : 'Physics Explanation'}
        </h4>
        <ChevronRight
          className={cn(
            'w-5 h-5 transition-transform',
            showDetails && 'rotate-90',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}
        />
      </button>

      {/* 核心公式 */}
      <div
        className={cn(
          'p-3 rounded-lg mb-3 text-center',
          theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'
        )}
      >
        <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
          {isZh ? "马吕斯定律 (Malus's Law)" : "Malus's Law"}
        </div>
        <Formula highlight>I = I₀ × cos²(θ)</Formula>
      </div>

      {/* 实时计算结果 */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div
          className={cn('p-2 rounded-lg', theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50')}
        >
          <div className={cn('text-xs', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')}>
            {isZh ? '密码区透过率' : 'Secret Transmission'}
          </div>
          <div className="font-mono font-bold text-purple-500">
            cos²({thetaSecret}°) = {(secretTransmission * 100).toFixed(0)}%
          </div>
        </div>
        <div className={cn('p-2 rounded-lg', theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100')}>
          <div className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            {isZh ? '背景区透过率' : 'Background Transmission'}
          </div>
          <div className={cn('font-mono font-bold', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            cos²({thetaBg}°) = {(bgTransmission * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* 对比度显示 */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            {isZh ? '对比度' : 'Contrast'}
          </span>
          <span
            className={cn(
              'font-mono font-bold',
              contrast > 0.7 ? 'text-green-500' : contrast > 0.4 ? 'text-yellow-500' : 'text-red-500'
            )}
          >
            {(contrast * 100).toFixed(0)}%
          </span>
        </div>
        <div
          className={cn('h-3 rounded-full overflow-hidden', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}
        >
          <motion.div
            className={cn(
              'h-full rounded-full',
              contrast > 0.7 ? 'bg-green-500' : contrast > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
            )}
            animate={{ width: `${contrast * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* 详细解释 */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            <div
              className={cn(
                'p-3 rounded-lg text-sm',
                theme === 'dark' ? 'bg-indigo-900/20 border border-indigo-500/20' : 'bg-indigo-50'
              )}
            >
              <h5
                className={cn(
                  'font-semibold mb-2',
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                )}
              >
                {isZh ? '为什么密码原本看不见？' : 'Why is the password invisible?'}
              </h5>
              <p className={cn('text-xs leading-relaxed', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh
                  ? '自然光是非偏振光，包含所有振动方向。密码用90°偏振材料印刷，背景用0°偏振。在非偏振光下，两者反射的光强相同，看不出差异。'
                  : 'Natural light is unpolarized, containing all vibration directions. The secret is printed with 90° polarized material, background with 0°. Under unpolarized light, both reflect equally, showing no difference.'}
              </p>
            </div>

            <div
              className={cn(
                'p-3 rounded-lg text-sm',
                theme === 'dark' ? 'bg-cyan-900/20 border border-cyan-500/20' : 'bg-cyan-50'
              )}
            >
              <h5
                className={cn('font-semibold mb-2', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}
              >
                {isZh ? '为什么偏振镜能看到密码？' : 'Why can the polarizer reveal it?'}
              </h5>
              <p className={cn('text-xs leading-relaxed', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh
                  ? '偏振镜只允许特定方向的光通过。当偏振镜角度与密码偏振方向匹配时，密码区域透光多；与背景偏振方向不匹配时，背景区域透光少。这种透过率差异产生对比度，密码就显现了。'
                  : "The polarizer only allows light of specific direction to pass. When aligned with the secret's polarization, the secret area transmits more light. When misaligned with background, background transmits less. This difference creates contrast, revealing the password."}
              </p>
            </div>

            <div
              className={cn(
                'p-3 rounded-lg text-sm',
                theme === 'dark' ? 'bg-green-900/20 border border-green-500/20' : 'bg-green-50'
              )}
            >
              <h5
                className={cn('font-semibold mb-2', theme === 'dark' ? 'text-green-400' : 'text-green-600')}
              >
                {isZh ? '最佳观察角度' : 'Optimal Viewing Angle'}
              </h5>
              <p className={cn('text-xs leading-relaxed', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh
                  ? `当偏振镜设为 ${SECRET_POLARIZATION_ANGLE}° 或 ${BACKGROUND_POLARIZATION_ANGLE}° 时，对比度最大。此时一个区域完全透光（cos²0°=100%），另一个完全阻挡（cos²90°=0%）。`
                  : `At ${SECRET_POLARIZATION_ANGLE}° or ${BACKGROUND_POLARIZATION_ANGLE}°, contrast is maximum. One area fully transmits (cos²0°=100%), the other fully blocks (cos²90°=0%).`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * 真实应用场景展示
 */
function RealWorldApplications({ isZh }: { isZh: boolean }) {
  const { theme } = useTheme()

  const applications = [
    {
      icon: '🎫',
      title: isZh ? '防伪标签' : 'Anti-counterfeit',
      desc: isZh ? '证件、钞票上的偏振防伪图案' : 'Polarized patterns on IDs, banknotes',
    },
    {
      icon: '🎬',
      title: isZh ? '3D电影' : '3D Cinema',
      desc: isZh ? '左右眼用不同偏振方向的光' : 'Different polarization for each eye',
    },
    {
      icon: '📺',
      title: isZh ? 'LCD显示器' : 'LCD Display',
      desc: isZh ? '液晶改变偏振方向控制亮度' : 'Liquid crystals rotate polarization',
    },
    {
      icon: '🕶️',
      title: isZh ? '偏振太阳镜' : 'Polarized Sunglasses',
      desc: isZh ? '消除水面、玻璃的眩光' : 'Eliminate glare from water, glass',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {applications.map((app, i) => (
        <div
          key={i}
          className={cn(
            'p-3 rounded-lg text-center',
            theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-gray-50 hover:bg-gray-100',
            'transition-colors cursor-default'
          )}
        >
          <div className="text-2xl mb-1">{app.icon}</div>
          <div className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-200' : 'text-gray-800')}>
            {app.title}
          </div>
          <div className={cn('text-xs mt-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
            {app.desc}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============ 主组件 ============

export function PolarizationLockDemo() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language.startsWith('zh')

  // 状态
  const [filterAngle, setFilterAngle] = useState(45) // 初始45°，对比度适中
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [inputPassword, setInputPassword] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [error, setError] = useState(false)

  const correctPassword = 'POLAR'

  // 计算透过率和对比度
  const secretTransmission = useMemo(
    () => calculateTransmission(SECRET_POLARIZATION_ANGLE, filterAngle),
    [filterAngle]
  )
  const bgTransmission = useMemo(
    () => calculateTransmission(BACKGROUND_POLARIZATION_ANGLE, filterAngle),
    [filterAngle]
  )
  const contrast = useMemo(() => calculateContrast(filterAngle), [filterAngle])

  // 当对比度足够高时，显示输入框
  useEffect(() => {
    if (contrast > 0.7 && !isUnlocked) {
      setShowInput(true)
    }
  }, [contrast, isUnlocked])

  // 提交密码
  const handleSubmit = useCallback(() => {
    if (inputPassword.toUpperCase() === correctPassword) {
      setIsUnlocked(true)
      setShowInput(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 600)
    }
  }, [inputPassword, correctPassword])

  // 重置
  const handleReset = useCallback(() => {
    setFilterAngle(45)
    setIsUnlocked(false)
    setShowInput(false)
    setInputPassword('')
    setError(false)
  }, [])

  return (
    <div className="space-y-6">
      {/* 顶部提示 */}
      <div
        className={cn(
          'flex items-center gap-3 p-4 rounded-xl',
          theme === 'dark' ? 'bg-indigo-900/20 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-200'
        )}
      >
        {isUnlocked ? (
          <Unlock className="w-6 h-6 text-green-500" />
        ) : contrast > 0.7 ? (
          <Eye className="w-6 h-6 text-cyan-500" />
        ) : (
          <EyeOff className="w-6 h-6 text-gray-500" />
        )}
        <div className="flex-1">
          <p className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-200' : 'text-gray-800')}>
            {isUnlocked
              ? isZh
                ? '密码已解锁！'
                : 'Password Unlocked!'
              : contrast > 0.7
                ? isZh
                  ? '密码可见！请输入看到的密码'
                  : 'Password visible! Enter what you see'
                : isZh
                  ? '旋转偏振观察镜，找到能看清密码的角度'
                  : 'Rotate the polarizer to reveal the hidden password'}
          </p>
        </div>
        <button
          onClick={handleReset}
          className={cn(
            'p-2 rounded-lg transition-colors',
            theme === 'dark' ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          )}
          title={isZh ? '重置' : 'Reset'}
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 主可视化区域 */}
      <div className="relative">
        <div
          className={cn(
            'rounded-xl border overflow-hidden',
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-indigo-500/20'
              : 'bg-gradient-to-br from-gray-50 via-white to-blue-50 border-gray-200'
          )}
        >
          <svg viewBox="0 0 800 400" className="w-full h-auto" style={{ minHeight: '350px' }}>
            <defs>
              {/* 网格背景 */}
              <pattern id="steganography-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={theme === 'dark' ? 'rgba(100,150,255,0.05)' : 'rgba(0,0,0,0.03)'}
                  strokeWidth="1"
                />
              </pattern>

              {/* 光束发光 */}
              <filter id="beam-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="800" height="400" fill="url(#steganography-grid)" />

            {/* 标题 */}
            <text
              x="400"
              y="30"
              textAnchor="middle"
              fill={theme === 'dark' ? '#e2e8f0' : '#1e293b'}
              fontSize="18"
              fontWeight="bold"
            >
              {isZh ? '偏振隐写术 - 用光解密' : 'Polarization Steganography - Decode with Light'}
            </text>

            {/* 步骤说明 */}
            <g transform="translate(400, 55)">
              {[
                { x: -250, label: isZh ? '① 自然光照射' : '① Natural Light' },
                { x: -50, label: isZh ? '② 偏振过滤' : '② Polarization Filter' },
                { x: 150, label: isZh ? '③ 密码显现' : '③ Secret Revealed' },
              ].map((step) => (
                <text
                  key={step.x}
                  x={step.x}
                  y="0"
                  textAnchor="middle"
                  fill={theme === 'dark' ? '#64748b' : '#94a3b8'}
                  fontSize="11"
                >
                  {step.label}
                </text>
              ))}
            </g>

            {/* 光源 → 非偏振光 */}
            <g transform="translate(120, 200)">
              <UnpolarizedLightSource isZh={isZh} />
            </g>

            {/* 非偏振光束（多方向振动） */}
            <g filter="url(#beam-glow)">
              <motion.line
                x1="190"
                y1="200"
                x2="280"
                y2="200"
                stroke="#ffd700"
                strokeWidth="8"
                opacity="0.6"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </g>

            {/* 偏振观察镜 */}
            <g transform="translate(350, 200)">
              <PolarizingLens
                angle={filterAngle}
                onAngleChange={setFilterAngle}
                disabled={isUnlocked}
                isZh={isZh}
              />
            </g>

            {/* 偏振光束（单方向振动） */}
            <g transform="translate(450, 200)" filter="url(#beam-glow)">
              <motion.line
                x1="0"
                y1="0"
                x2="100"
                y2="0"
                stroke="#22d3ee"
                strokeWidth={4 + contrast * 6}
                opacity={0.3 + contrast * 0.5}
                animate={{ strokeWidth: 4 + contrast * 6 }}
                transition={{ duration: 0.3 }}
              />
              <PolarizedLightArrows angle={filterAngle} intensity={contrast} />
            </g>

            {/* 机密文件 */}
            <g transform="translate(630, 200)">
              <SecretDocument
                password={correctPassword}
                contrast={contrast}
                isZh={isZh}
              />
            </g>

            {/* 物理公式显示 */}
            <g transform="translate(400, 370)">
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
                fontSize="13"
              >
                {isZh ? '对比度 = |密码透过率 - 背景透过率| = ' : 'Contrast = |Secret - Background| = '}
                |{(secretTransmission * 100).toFixed(0)}% - {(bgTransmission * 100).toFixed(0)}%| ={' '}
                <tspan fill={contrast > 0.7 ? '#22c55e' : contrast > 0.4 ? '#fbbf24' : '#ef4444'} fontWeight="bold">
                  {(contrast * 100).toFixed(0)}%
                </tspan>
              </text>
            </g>

            {/* 解锁成功效果 */}
            <AnimatePresence>
              {isUnlocked && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* 星星效果 */}
                  {[...Array(12)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={630}
                      cy={200}
                      r="4"
                      fill="#22c55e"
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{
                        scale: [0, 1.5, 0],
                        x: Math.cos((i * Math.PI * 2) / 12) * 100,
                        y: Math.sin((i * Math.PI * 2) / 12) * 80,
                      }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                    />
                  ))}
                  <motion.text
                    x="630"
                    y="320"
                    textAnchor="middle"
                    fill="#22c55e"
                    fontSize="16"
                    fontWeight="bold"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {isZh ? '解锁成功！' : 'UNLOCKED!'}
                  </motion.text>
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>

        {/* 密码输入框（浮动在SVG上） */}
        <AnimatePresence>
          {showInput && !isUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                'absolute bottom-4 left-1/2 -translate-x-1/2',
                'flex gap-3 p-3 rounded-xl',
                theme === 'dark' ? 'bg-slate-800/95 border border-green-500/30' : 'bg-white/95 border border-green-200',
                'shadow-lg backdrop-blur-sm',
                error && 'animate-shake'
              )}
            >
              <input
                type="text"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={isZh ? '输入密码...' : 'Enter password...'}
                className={cn(
                  'px-4 py-2 rounded-lg font-mono text-lg uppercase tracking-wider w-36',
                  'focus:outline-none focus:ring-2 focus:ring-green-500/50',
                  theme === 'dark'
                    ? 'bg-slate-700 text-white placeholder:text-gray-500 border border-slate-600'
                    : 'bg-gray-100 text-gray-800 placeholder:text-gray-400 border border-gray-300',
                  error && 'border-red-500'
                )}
                maxLength={correctPassword.length}
                autoFocus
              />
              <button
                onClick={handleSubmit}
                className={cn(
                  'px-6 py-2 rounded-lg font-medium transition-all',
                  'bg-green-500 hover:bg-green-600 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-green-500/50'
                )}
              >
                {isZh ? '确认' : 'Submit'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 角度滑块（备用控制） */}
      <div className={cn('p-4 rounded-xl', theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100')}>
        <SliderControl
          label={isZh ? '偏振镜角度' : 'Polarizer Angle'}
          value={filterAngle}
          min={0}
          max={180}
          step={1}
          unit="°"
          onChange={(v) => !isUnlocked && setFilterAngle(v)}
          color="cyan"
        />
        <div className="mt-2 flex justify-between text-xs">
          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>0°</span>
          <span className={cn(contrast > 0.7 ? 'text-green-500 font-medium' : 'text-gray-400')}>
            {isZh ? '最佳: 0° 或 90°' : 'Optimal: 0° or 90°'}
          </span>
          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>180°</span>
        </div>
      </div>

      {/* 物理原理解释 */}
      <PhysicsExplanation
        filterAngle={filterAngle}
        contrast={contrast}
        secretTransmission={secretTransmission}
        bgTransmission={bgTransmission}
        isZh={isZh}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails(!showDetails)}
      />

      {/* 真实应用场景 */}
      <InfoCard
        title={isZh ? '真实世界中的偏振隐写术' : 'Real-World Polarization Steganography'}
        color="purple"
      >
        <RealWorldApplications isZh={isZh} />
      </InfoCard>

      {/* 知识总结卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title={isZh ? '物理原理闭环' : 'Physics Closed Loop'} color="cyan">
          <ul className={cn('text-xs space-y-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">①</span>
              <span>{isZh ? '自然光包含所有偏振方向 → 无法区分不同偏振材料' : 'Natural light has all polarizations → Cannot distinguish polarized materials'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500">②</span>
              <span>{isZh ? '偏振片过滤出单一方向 → 不同偏振材料透过率不同' : 'Polarizer filters one direction → Different materials have different transmission'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">③</span>
              <span>{isZh ? '透过率差异产生对比度 → 隐藏信息显现' : 'Transmission difference creates contrast → Hidden info revealed'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">④</span>
              <span>{isZh ? '马吕斯定律 I=I₀cos²θ 精确描述透过率变化' : "Malus's Law I=I₀cos²θ precisely describes transmission change"}</span>
            </li>
          </ul>
        </InfoCard>

        <InfoCard title={isZh ? '实验启示' : 'Key Insights'} color="green">
          <ul className={cn('text-xs space-y-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            <li>
              <Lightbulb className="inline w-3 h-3 mr-1 text-yellow-500" />
              {isZh
                ? '最佳观察角度是与密码偏振方向平行或垂直'
                : 'Best viewing angle is parallel or perpendicular to secret polarization'}
            </li>
            <li>
              <CheckCircle2 className="inline w-3 h-3 mr-1 text-green-500" />
              {isZh
                ? '45°时对比度最低，因为两个区域透过率相同(50%)'
                : 'At 45° contrast is minimum because both areas have same transmission (50%)'}
            </li>
            <li>
              <Lock className="inline w-3 h-3 mr-1 text-purple-500" />
              {isZh
                ? '这就是为什么偏振片能用于安全防伪'
                : 'This is why polarizers are used for security anti-counterfeiting'}
            </li>
          </ul>
        </InfoCard>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(-50%); }
          25% { transform: translateX(calc(-50% - 8px)); }
          75% { transform: translateX(calc(-50% + 8px)); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default PolarizationLockDemo
