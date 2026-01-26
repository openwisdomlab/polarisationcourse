/**
 * PolarizationLockDemo - 双偏振片密码锁演示
 *
 * 基于图示的设计思路：
 * 1. 灯泡发出非偏振光（自然光，所有方向振动）
 * 2. 第一个偏振片（起偏器）将光变为线偏振光
 * 3. 偏振光通过带有偏振编码密码的屏幕
 * 4. 第二个偏振片（检偏器）旋转来解码密码
 * 5. 马吕斯定律：I = I₀ × cos²(θ) 决定透过强度
 *
 * 核心原理：
 * - 密码用特定偏振方向的材料书写
 * - 只有当检偏器与密码偏振方向匹配时，密码才可见
 * - 旋转两个偏振片观察光强和可见度的变化
 */
import { useState, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  RotateCcw,
  Eye,
  EyeOff,
  Unlock,
  Lock,
  Info,
  ChevronRight,
  Lightbulb,
} from 'lucide-react'
import { InfoCard, Formula, SliderControl } from '../DemoControls'

// ============ 物理常量 ============

// 密码区域的偏振方向（90°垂直偏振）
const PASSWORD_POLARIZATION = 90

/**
 * 马吕斯定律计算透过强度
 * I = I₀ × cos²(θ)
 */
function malusLaw(inputIntensity: number, angleDiff: number): number {
  const theta = angleDiff * (Math.PI / 180)
  return inputIntensity * Math.cos(theta) ** 2
}

// ============ 子组件 ============

/**
 * 灯泡光源 - 发出非偏振光
 */
function LightBulb({ isZh }: { isZh: boolean }) {
  const { theme } = useTheme()

  return (
    <g>
      {/* 灯泡外发光效果 */}
      <motion.circle
        cx="0"
        cy="0"
        r="55"
        fill="url(#bulbGlow)"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 灯泡玻璃部分 */}
      <ellipse cx="0" cy="-5" rx="32" ry="38" fill="#ffd700" opacity="0.95" />
      <ellipse cx="0" cy="-10" rx="22" ry="26" fill="#fff8dc" opacity="0.8" />

      {/* 灯丝 */}
      <path
        d="M -8,-15 Q -5,-8 0,-12 Q 5,-8 8,-15"
        fill="none"
        stroke="#ff8c00"
        strokeWidth="2"
        opacity="0.8"
      />

      {/* 灯座 */}
      <rect x="-18" y="30" width="36" height="8" fill="#a0a0a0" rx="2" />
      <rect x="-15" y="38" width="30" height="15" fill="#808080" rx="2" />
      <path d="M -15,42 L 15,42 M -15,46 L 15,46 M -15,50 L 15,50" stroke="#606060" strokeWidth="1" />

      {/* 非偏振光箭头 - 表示多方向振动 */}
      {[0, 30, 60, 90, 120, 150].map((angle, i) => (
        <motion.g
          key={angle}
          transform={`rotate(${angle})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
        >
          <line
            x1="42"
            y1="0"
            x2="68"
            y2="0"
            stroke="#ffa500"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <polygon points="68,0 60,-4 60,4" fill="#ffa500" />
        </motion.g>
      ))}

      {/* 标签 */}
      <text
        x="0"
        y="72"
        textAnchor="middle"
        fill={theme === 'dark' ? '#fbbf24' : '#d97706'}
        fontSize="12"
        fontWeight="600"
      >
        {isZh ? '自然光' : 'Natural Light'}
      </text>
      <text
        x="0"
        y="86"
        textAnchor="middle"
        fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
        fontSize="10"
      >
        {isZh ? '(非偏振)' : '(Unpolarized)'}
      </text>
    </g>
  )
}

/**
 * 偏振片组件 - 可旋转
 */
interface PolarizerProps {
  angle: number
  onAngleChange: (angle: number) => void
  label: string
  color: string
  disabled?: boolean
  showAngle?: boolean
}

function Polarizer({ angle, onAngleChange, label, color, disabled, showAngle = true }: PolarizerProps) {
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

  const radius = 45
  const lineCount = 11

  return (
    <g
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ cursor: disabled ? 'not-allowed' : 'grab', touchAction: 'none' }}
    >
      {/* 外圈（旋转提示） */}
      {!disabled && (
        <motion.circle
          cx="0"
          cy="0"
          r={radius + 8}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.3"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* 偏振片主体 - 圆形 */}
      <circle
        cx="0"
        cy="0"
        r={radius}
        fill={theme === 'dark' ? `${color}15` : `${color}20`}
        stroke={color}
        strokeWidth="3"
      />

      {/* 栅格线（表示偏振方向） */}
      <motion.g
        animate={{ rotate: angle }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        {Array.from({ length: lineCount }, (_, i) => {
          const offset = ((i - Math.floor(lineCount / 2)) / (lineCount / 2)) * (radius - 8)
          const lineLength = Math.sqrt((radius - 8) ** 2 - offset ** 2)
          if (lineLength <= 0) return null
          return (
            <line
              key={i}
              x1={-lineLength}
              y1={offset}
              x2={lineLength}
              y2={offset}
              stroke={color}
              strokeWidth={i === Math.floor(lineCount / 2) ? 2.5 : 1.5}
              opacity={i === Math.floor(lineCount / 2) ? 1 : 0.6}
            />
          )
        })}

        {/* 透过轴箭头 */}
        <polygon points={`0,${-radius - 6} -5,${-radius + 4} 5,${-radius + 4}`} fill={color} />
        <polygon points={`0,${radius + 6} -5,${radius - 4} 5,${radius - 4}`} fill={color} />
      </motion.g>

      {/* 角度显示 */}
      {showAngle && (
        <>
          <circle cx="0" cy="0" r="16" fill={theme === 'dark' ? '#0f172a' : '#f8fafc'} />
          <text x="0" y="5" textAnchor="middle" fill={color} fontSize="13" fontWeight="bold">
            {angle}°
          </text>
        </>
      )}

      {/* 标签 */}
      <text
        x="0"
        y={radius + 25}
        textAnchor="middle"
        fill={color}
        fontSize="11"
        fontWeight="600"
      >
        {label}
      </text>
      {!disabled && (
        <text
          x="0"
          y={radius + 38}
          textAnchor="middle"
          fill={theme === 'dark' ? '#64748b' : '#94a3b8'}
          fontSize="9"
        >
          ↻ drag
        </text>
      )}
    </g>
  )
}

/**
 * 光束可视化 - 显示偏振方向
 */
interface LightBeamProps {
  startX: number
  endX: number
  y: number
  polarizationAngle?: number // undefined = 非偏振光
  intensity: number
  color: string
  label?: string
}

function LightBeam({ startX, endX, y, polarizationAngle, intensity, color, label }: LightBeamProps) {
  const { theme } = useTheme()
  const isUnpolarized = polarizationAngle === undefined

  if (intensity < 0.01) return null

  return (
    <g>
      {/* 光束主体 */}
      <motion.line
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        stroke={color}
        strokeWidth={4 + intensity * 4}
        opacity={0.15 + intensity * 0.4}
        filter="url(#beamGlow)"
        animate={{ opacity: [0.15 + intensity * 0.3, 0.15 + intensity * 0.5, 0.15 + intensity * 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 偏振方向指示 */}
      {isUnpolarized ? (
        // 非偏振光 - 多方向箭头
        <g>
          {[0, 45, 90, 135].map((ang, i) => (
            <motion.g
              key={ang}
              initial={{ x: startX }}
              animate={{ x: endX - 30 }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'linear' }}
            >
              <g transform={`translate(0, ${y}) rotate(${ang})`}>
                <line x1="-10" y1="0" x2="10" y2="0" stroke={color} strokeWidth="2" opacity={intensity * 0.7} />
              </g>
            </motion.g>
          ))}
        </g>
      ) : (
        // 偏振光 - 单方向振动
        <g>
          {[0, 25, 50].map((offset, i) => (
            <motion.g
              key={i}
              initial={{ x: startX + offset }}
              animate={{ x: endX - 30 }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25, ease: 'linear' }}
            >
              <g transform={`translate(0, ${y}) rotate(${polarizationAngle})`}>
                <line x1="-12" y1="0" x2="12" y2="0" stroke={color} strokeWidth="2.5" opacity={intensity} />
                <polygon points="12,0 8,-3 8,3" fill={color} opacity={intensity} />
                <polygon points="-12,0 -8,-3 -8,3" fill={color} opacity={intensity} />
              </g>
            </motion.g>
          ))}
        </g>
      )}

      {/* 标签 */}
      {label && (
        <text
          x={(startX + endX) / 2}
          y={y + 30}
          textAnchor="middle"
          fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
          fontSize="10"
        >
          {label}
        </text>
      )}
    </g>
  )
}

/**
 * 密码显示屏 - 偏振编码的密码
 */
interface PasswordScreenProps {
  password: string
  visibility: number // 0-1
  isZh: boolean
}

function PasswordScreen({ password, visibility, isZh }: PasswordScreenProps) {
  const { theme } = useTheme()

  const blur = Math.max(0, (1 - visibility) * 12)
  const opacity = Math.min(1, visibility * 1.5)

  return (
    <g>
      {/* 屏幕背景 */}
      <rect
        x="-60"
        y="-70"
        width="120"
        height="140"
        fill={theme === 'dark' ? '#1e293b' : '#f1f5f9'}
        stroke={visibility > 0.6 ? '#22c55e' : theme === 'dark' ? '#475569' : '#cbd5e1'}
        strokeWidth="3"
        rx="8"
      />

      {/* 屏幕标题 */}
      <text
        x="0"
        y="-48"
        textAnchor="middle"
        fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
        fontSize="11"
        fontWeight="600"
      >
        {isZh ? '🔐 机密文件' : '🔐 CLASSIFIED'}
      </text>
      <line
        x1="-45"
        y1="-38"
        x2="45"
        y2="-38"
        stroke={theme === 'dark' ? '#334155' : '#e2e8f0'}
        strokeWidth="1"
      />

      {/* 装饰线条 */}
      {[-22, -8, 6].map((yPos) => (
        <rect
          key={yPos}
          x="-45"
          y={yPos}
          width={30 + Math.random() * 40}
          height="4"
          fill={theme === 'dark' ? '#334155' : '#e2e8f0'}
          rx="2"
        />
      ))}

      {/* 密码区域 */}
      <rect
        x="-50"
        y="25"
        width="100"
        height="35"
        fill={theme === 'dark' ? '#0f172a' : '#fff'}
        stroke={visibility > 0.6 ? '#22c55e' : theme === 'dark' ? '#475569' : '#cbd5e1'}
        strokeWidth="2"
        rx="4"
      />

      {/* 密码文字 */}
      <text
        x="0"
        y="50"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="20"
        fontWeight="bold"
        fill={visibility > 0.6 ? '#22c55e' : '#a855f7'}
        style={{
          opacity: opacity,
          filter: `blur(${blur}px)`,
          transition: 'all 0.3s ease',
        }}
      >
        {password}
      </text>

      {/* 不可见时显示问号 */}
      {visibility < 0.3 && (
        <text
          x="0"
          y="50"
          textAnchor="middle"
          fill={theme === 'dark' ? '#475569' : '#94a3b8'}
          fontSize="16"
        >
          ? ? ? ? ?
        </text>
      )}

      {/* 标签 */}
      <text
        x="0"
        y="82"
        textAnchor="middle"
        fill={theme === 'dark' ? '#64748b' : '#94a3b8'}
        fontSize="10"
      >
        {isZh ? `密码偏振: ${PASSWORD_POLARIZATION}°` : `Password Pol: ${PASSWORD_POLARIZATION}°`}
      </text>
    </g>
  )
}

/**
 * 物理原理面板
 */
interface PhysicsPanelProps {
  polarizer1Angle: number
  polarizer2Angle: number
  intensity2: number
  passwordVisibility: number
  isZh: boolean
  showDetails: boolean
  onToggleDetails: () => void
}

function PhysicsPanel({
  polarizer1Angle,
  polarizer2Angle,
  intensity2,
  passwordVisibility,
  isZh,
  showDetails,
  onToggleDetails,
}: PhysicsPanelProps) {
  const { theme } = useTheme()

  // 两个偏振片之间的夹角
  const angleBetween = Math.abs(polarizer2Angle - polarizer1Angle)
  // 检偏器与密码偏振方向的夹角
  const angleToPassword = Math.abs(polarizer2Angle - PASSWORD_POLARIZATION)

  return (
    <div
      className={cn(
        'p-4 rounded-xl border',
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}
    >
      {/* 标题 */}
      <button onClick={onToggleDetails} className="w-full flex items-center justify-between mb-3">
        <h4
          className={cn(
            'font-semibold flex items-center gap-2',
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          )}
        >
          <Info className="w-4 h-4" />
          {isZh ? '物理原理解析' : 'Physics Analysis'}
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
          'p-3 rounded-lg mb-4 text-center',
          theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'
        )}
      >
        <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
          {isZh ? '马吕斯定律' : "Malus's Law"}
        </div>
        <Formula highlight>I = I₀ × cos²(θ)</Formula>
      </div>

      {/* 实时计算 */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className={cn('p-3 rounded-lg', theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50')}>
          <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-blue-400' : 'text-blue-600')}>
            {isZh ? '经过起偏器' : 'After Polarizer 1'}
          </div>
          <div className="font-mono text-blue-500 font-bold">
            I₁ = 50%
          </div>
          <div className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            {isZh ? '(非偏振→偏振)' : '(Unpolarized→Polarized)'}
          </div>
        </div>

        <div className={cn('p-3 rounded-lg', theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50')}>
          <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')}>
            {isZh ? '经过检偏器' : 'After Polarizer 2'}
          </div>
          <div className="font-mono text-purple-500 font-bold">
            I₂ = {(intensity2 * 100).toFixed(0)}%
          </div>
          <div className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            cos²({angleBetween}°) = {(Math.cos(angleBetween * Math.PI / 180) ** 2 * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* 密码可见度 */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            {isZh ? '密码可见度' : 'Password Visibility'}
          </span>
          <span
            className={cn(
              'font-mono font-bold',
              passwordVisibility > 0.6 ? 'text-green-500' : passwordVisibility > 0.3 ? 'text-yellow-500' : 'text-red-500'
            )}
          >
            {(passwordVisibility * 100).toFixed(0)}%
          </span>
        </div>
        <div className={cn('h-3 rounded-full overflow-hidden', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>
          <motion.div
            className={cn(
              'h-full rounded-full',
              passwordVisibility > 0.6 ? 'bg-green-500' : passwordVisibility > 0.3 ? 'bg-yellow-500' : 'bg-red-500'
            )}
            animate={{ width: `${passwordVisibility * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className={cn('text-xs mt-1 text-center', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
          {isZh
            ? `检偏器与密码偏振的夹角: ${angleToPassword}°`
            : `Angle to password polarization: ${angleToPassword}°`}
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
                theme === 'dark' ? 'bg-amber-900/20 border border-amber-500/20' : 'bg-amber-50'
              )}
            >
              <h5 className={cn('font-semibold mb-2', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')}>
                {isZh ? '① 起偏器的作用' : '① Role of Polarizer 1'}
              </h5>
              <p className={cn('text-xs leading-relaxed', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh
                  ? '自然光包含所有振动方向。起偏器只允许一个方向的光通过，将非偏振光变为线偏振光。强度减半（50%）。'
                  : 'Natural light vibrates in all directions. The polarizer only allows one direction to pass, converting unpolarized to linearly polarized light. Intensity drops to 50%.'}
              </p>
            </div>

            <div
              className={cn(
                'p-3 rounded-lg text-sm',
                theme === 'dark' ? 'bg-purple-900/20 border border-purple-500/20' : 'bg-purple-50'
              )}
            >
              <h5 className={cn('font-semibold mb-2', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')}>
                {isZh ? '② 检偏器的作用' : '② Role of Polarizer 2'}
              </h5>
              <p className={cn('text-xs leading-relaxed', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh
                  ? '检偏器根据马吕斯定律过滤偏振光。当两个偏振片平行（θ=0°）时透过100%；垂直（θ=90°）时透过0%。'
                  : "The analyzer filters polarized light per Malus's Law. When parallel (θ=0°), 100% passes; when perpendicular (θ=90°), 0% passes."}
              </p>
            </div>

            <div
              className={cn(
                'p-3 rounded-lg text-sm',
                theme === 'dark' ? 'bg-green-900/20 border border-green-500/20' : 'bg-green-50'
              )}
            >
              <h5 className={cn('font-semibold mb-2', theme === 'dark' ? 'text-green-400' : 'text-green-600')}>
                {isZh ? '③ 如何看到密码' : '③ How to Reveal Password'}
              </h5>
              <p className={cn('text-xs leading-relaxed', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh
                  ? `密码用 ${PASSWORD_POLARIZATION}° 偏振材料书写。当检偏器也调到 ${PASSWORD_POLARIZATION}° 时，密码区最亮，背景最暗，对比度最大，密码清晰可见！`
                  : `The password is written with ${PASSWORD_POLARIZATION}° polarized material. When the analyzer is also at ${PASSWORD_POLARIZATION}°, the password area is brightest while background is darkest - maximum contrast reveals the password!`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============ 主组件 ============

export function PolarizationLockDemo() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language.startsWith('zh')

  // 状态
  const [polarizer1Angle, setPolarizer1Angle] = useState(0) // 起偏器角度
  const [polarizer2Angle, setPolarizer2Angle] = useState(45) // 检偏器角度（初始45°）
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [inputPassword, setInputPassword] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [error, setError] = useState(false)

  const correctPassword = 'POLAR'

  // 计算光强
  // 1. 非偏振光经过起偏器后强度为50%
  const intensity1 = 0.5

  // 2. 偏振光经过检偏器后，根据马吕斯定律
  const angleBetween = Math.abs(polarizer2Angle - polarizer1Angle)
  const intensity2 = useMemo(() => malusLaw(intensity1, angleBetween), [angleBetween])

  // 3. 密码可见度 = 检偏器与密码偏振方向的匹配程度
  // 密码在90°偏振，当检偏器也是90°时可见度最高
  const passwordVisibility = useMemo(() => {
    const angleToPassword = Math.abs(polarizer2Angle - PASSWORD_POLARIZATION)
    // 当与密码偏振方向平行时(0°或180°)，可见度最高
    // 当垂直时(90°)，可见度最低
    return Math.cos(angleToPassword * Math.PI / 180) ** 2
  }, [polarizer2Angle])

  // 当密码可见度足够高时显示输入框
  const canSeePassword = passwordVisibility > 0.7

  // 提交密码
  const handleSubmit = useCallback(() => {
    if (inputPassword.toUpperCase() === correctPassword) {
      setIsUnlocked(true)
      setShowInput(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 500)
    }
  }, [inputPassword])

  // 重置
  const handleReset = useCallback(() => {
    setPolarizer1Angle(0)
    setPolarizer2Angle(45)
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
          theme === 'dark'
            ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20'
            : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'
        )}
      >
        {isUnlocked ? (
          <Unlock className="w-6 h-6 text-green-500 flex-shrink-0" />
        ) : canSeePassword ? (
          <Eye className="w-6 h-6 text-cyan-500 flex-shrink-0" />
        ) : (
          <Lock className="w-6 h-6 text-gray-500 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className={cn('font-medium', theme === 'dark' ? 'text-gray-200' : 'text-gray-800')}>
            {isUnlocked
              ? isZh
                ? '🎉 密码已解锁！'
                : '🎉 Password Unlocked!'
              : canSeePassword
                ? isZh
                  ? '密码可见！点击输入看到的密码'
                  : 'Password visible! Click to enter what you see'
                : isZh
                  ? '旋转两个偏振片，找到能看清密码的角度组合'
                  : 'Rotate both polarizers to find the angle that reveals the password'}
          </p>
          <p className={cn('text-xs mt-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
            {isZh
              ? '提示：密码用90°偏振材料书写，调整检偏器到相同角度'
              : 'Hint: Password is written with 90° polarized material, align analyzer to match'}
          </p>
        </div>
        <button
          onClick={handleReset}
          className={cn(
            'p-2 rounded-lg transition-colors flex-shrink-0',
            theme === 'dark' ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          )}
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
              ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-slate-700'
              : 'bg-gradient-to-br from-gray-50 via-white to-blue-50 border-gray-200'
          )}
        >
          <svg viewBox="0 0 900 420" className="w-full h-auto" style={{ minHeight: '380px' }}>
            <defs>
              {/* 灯泡发光渐变 */}
              <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
              </radialGradient>

              {/* 光束发光效果 */}
              <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 背景网格 */}
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={theme === 'dark' ? 'rgba(100,150,255,0.05)' : 'rgba(0,0,0,0.03)'}
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <rect width="900" height="420" fill="url(#gridPattern)" />

            {/* 标题 */}
            <text
              x="450"
              y="30"
              textAnchor="middle"
              fill={theme === 'dark' ? '#e2e8f0' : '#1e293b'}
              fontSize="18"
              fontWeight="bold"
            >
              {isZh ? '双偏振片解密原理' : 'Two-Polarizer Decryption Principle'}
            </text>

            {/* 流程步骤标签 */}
            <g fill={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize="11">
              <text x="100" y="55" textAnchor="middle">①</text>
              <text x="290" y="55" textAnchor="middle">②</text>
              <text x="470" y="55" textAnchor="middle">③</text>
              <text x="630" y="55" textAnchor="middle">④</text>
              <text x="790" y="55" textAnchor="middle">⑤</text>
            </g>

            {/* ① 灯泡光源 */}
            <g transform="translate(100, 200)">
              <LightBulb isZh={isZh} />
            </g>

            {/* 非偏振光束 (灯泡 → 起偏器) */}
            <LightBeam
              startX={175}
              endX={250}
              y={200}
              polarizationAngle={undefined}
              intensity={1}
              color="#ffa500"
              label={isZh ? '非偏振光' : 'Unpolarized'}
              />

            {/* ② 起偏器 (Polarizer 1) */}
            <g transform="translate(290, 200)">
              <Polarizer
                angle={polarizer1Angle}
                onAngleChange={setPolarizer1Angle}
                label={isZh ? '起偏器 P₁' : 'Polarizer P₁'}
                color="#3b82f6"
                disabled={isUnlocked}
              />
            </g>

            {/* 偏振光束 (起偏器 → 密码屏) */}
            <LightBeam
              startX={340}
              endX={420}
              y={200}
              polarizationAngle={polarizer1Angle}
              intensity={intensity1}
              color="#3b82f6"
              label={isZh ? `偏振光 ${polarizer1Angle}°` : `Polarized ${polarizer1Angle}°`}
              />

            {/* ③ 密码显示屏 */}
            <g transform="translate(470, 200)">
              <PasswordScreen
                password={correctPassword}
                visibility={passwordVisibility}
                isZh={isZh}
              />
            </g>

            {/* 经过密码屏的光 (密码屏 → 检偏器) */}
            <LightBeam
              startX={540}
              endX={590}
              y={200}
              polarizationAngle={PASSWORD_POLARIZATION}
              intensity={intensity1 * 0.8}
              color="#a855f7"
              />

            {/* ④ 检偏器 (Polarizer 2 / Analyzer) */}
            <g transform="translate(630, 200)">
              <Polarizer
                angle={polarizer2Angle}
                onAngleChange={setPolarizer2Angle}
                label={isZh ? '检偏器 P₂' : 'Analyzer P₂'}
                color="#a855f7"
                disabled={isUnlocked}
              />
            </g>

            {/* 最终透过的光 */}
            <LightBeam
              startX={680}
              endX={750}
              y={200}
              polarizationAngle={polarizer2Angle}
              intensity={intensity2}
              color="#22c55e"
              label={isZh ? `透过光 ${(intensity2 * 100).toFixed(0)}%` : `Output ${(intensity2 * 100).toFixed(0)}%`}
              />

            {/* ⑤ 观察者眼睛 */}
            <g transform="translate(790, 200)">
              {canSeePassword ? (
                <Eye className="w-12 h-12" style={{ transform: 'translate(-24, -24)' }} color="#22c55e" />
              ) : (
                <EyeOff className="w-12 h-12" style={{ transform: 'translate(-24, -24)' }} color="#64748b" />
              )}
              <text
                x="0"
                y="45"
                textAnchor="middle"
                fill={canSeePassword ? '#22c55e' : theme === 'dark' ? '#64748b' : '#94a3b8'}
                fontSize="11"
                fontWeight="600"
              >
                {isZh ? '观察者' : 'Observer'}
              </text>
            </g>

            {/* 底部公式说明 */}
            <g transform="translate(450, 375)">
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
                fontSize="13"
              >
                {isZh ? '马吕斯定律: ' : "Malus's Law: "}
                <tspan fontWeight="bold" fill="#22d3ee">I = I₀ × cos²(θ₂ - θ₁)</tspan>
                {isZh ? ' = 50% × cos²(' : ' = 50% × cos²('}
                {angleBetween}°) =
                <tspan
                  fontWeight="bold"
                  fill={intensity2 > 0.3 ? '#22c55e' : intensity2 > 0.1 ? '#fbbf24' : '#ef4444'}
                >
                  {' '}{(intensity2 * 100).toFixed(0)}%
                </tspan>
              </text>
            </g>

            {/* 解锁成功动画 */}
            <AnimatePresence>
              {isUnlocked && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {[...Array(16)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={470}
                      cy={200}
                      r="5"
                      fill="#22c55e"
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1.5, 0],
                        x: Math.cos((i * Math.PI * 2) / 16) * 120,
                        y: Math.sin((i * Math.PI * 2) / 16) * 80,
                        opacity: [1, 1, 0],
                      }}
                      transition={{ duration: 1, delay: i * 0.03 }}
                    />
                  ))}
                  <motion.text
                    x="450"
                    y="400"
                    textAnchor="middle"
                    fill="#22c55e"
                    fontSize="16"
                    fontWeight="bold"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    🎉 {isZh ? '解密成功！' : 'DECRYPTED!'}
                  </motion.text>
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>

        {/* 密码输入浮层 */}
        <AnimatePresence>
          {showInput && !isUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                'absolute bottom-4 left-1/2 -translate-x-1/2',
                'flex gap-3 p-4 rounded-xl shadow-xl',
                theme === 'dark'
                  ? 'bg-slate-800/95 border border-green-500/30 backdrop-blur-md'
                  : 'bg-white/95 border border-green-300 backdrop-blur-md',
                error && 'animate-shake'
              )}
            >
              <input
                type="text"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={isZh ? '输入密码' : 'Password'}
                className={cn(
                  'px-4 py-2 rounded-lg font-mono text-lg uppercase tracking-wider w-32',
                  'focus:outline-none focus:ring-2 focus:ring-green-500/50',
                  theme === 'dark'
                    ? 'bg-slate-700 text-white placeholder:text-gray-500 border border-slate-600'
                    : 'bg-gray-100 text-gray-800 placeholder:text-gray-400 border border-gray-300',
                  error && 'border-red-500'
                )}
                maxLength={5}
                autoFocus
              />
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                {isZh ? '确认' : 'OK'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 可见时的提交按钮 */}
        {canSeePassword && !isUnlocked && !showInput && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowInput(true)}
            className={cn(
              'absolute bottom-4 left-1/2 -translate-x-1/2',
              'px-6 py-3 rounded-xl font-medium shadow-lg',
              'bg-green-500 hover:bg-green-600 text-white transition-colors'
            )}
          >
            {isZh ? '🔓 输入密码' : '🔓 Enter Password'}
          </motion.button>
        )}
      </div>

      {/* 控制滑块 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={cn('p-4 rounded-xl', theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50')}>
          <SliderControl
            label={isZh ? '起偏器 P₁ 角度' : 'Polarizer P₁ Angle'}
            value={polarizer1Angle}
            min={0}
            max={180}
            step={5}
            unit="°"
            onChange={(v) => !isUnlocked && setPolarizer1Angle(v)}
            color="blue"
          />
        </div>
        <div className={cn('p-4 rounded-xl', theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50')}>
          <SliderControl
            label={isZh ? '检偏器 P₂ 角度' : 'Analyzer P₂ Angle'}
            value={polarizer2Angle}
            min={0}
            max={180}
            step={5}
            unit="°"
            onChange={(v) => !isUnlocked && setPolarizer2Angle(v)}
            color="purple"
          />
          <div className={cn('text-xs mt-2 text-center', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')}>
            {isZh ? `💡 提示: 密码偏振角度是 ${PASSWORD_POLARIZATION}°` : `💡 Hint: Password polarization is ${PASSWORD_POLARIZATION}°`}
          </div>
        </div>
      </div>

      {/* 物理原理面板 */}
      <PhysicsPanel
        polarizer1Angle={polarizer1Angle}
        polarizer2Angle={polarizer2Angle}
        intensity2={intensity2}
        passwordVisibility={passwordVisibility}
        isZh={isZh}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails(!showDetails)}
      />

      {/* 知识总结 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title={isZh ? '双偏振片系统' : 'Two-Polarizer System'} color="cyan">
          <ul className={cn('text-xs space-y-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">P₁</span>
              <span>
                {isZh
                  ? '起偏器：将非偏振光变为线偏振光，强度减半'
                  : 'Polarizer: Converts unpolarized to linear polarized light (50% intensity)'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">P₂</span>
              <span>
                {isZh
                  ? '检偏器：分析偏振方向，透过率遵循 cos²θ'
                  : 'Analyzer: Analyzes polarization, transmission follows cos²θ'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Lightbulb className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
              <span>
                {isZh
                  ? '平行(0°)=全透过 | 垂直(90°)=全阻挡'
                  : 'Parallel(0°)=Full pass | Perpendicular(90°)=Full block'}
              </span>
            </li>
          </ul>
        </InfoCard>

        <InfoCard title={isZh ? '密码解密原理' : 'Password Decryption'} color="green">
          <ul className={cn('text-xs space-y-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            <li>
              {isZh
                ? `🔐 密码用 ${PASSWORD_POLARIZATION}° 偏振材料书写`
                : `🔐 Password written with ${PASSWORD_POLARIZATION}° polarized material`}
            </li>
            <li>
              {isZh
                ? `👀 检偏器调到 ${PASSWORD_POLARIZATION}° 时，密码区最亮`
                : `👀 At ${PASSWORD_POLARIZATION}° analyzer, password area is brightest`}
            </li>
            <li>
              {isZh
                ? '✨ 背景与密码偏振方向不同 → 产生对比度 → 可见'
                : '✨ Background has different polarization → contrast → visible'}
            </li>
          </ul>
        </InfoCard>
      </div>

      {/* 应用场景 */}
      <InfoCard title={isZh ? '真实世界应用' : 'Real-World Applications'} color="purple">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🎫', title: isZh ? '防伪标签' : 'Security Labels', desc: isZh ? '钞票、证件' : 'Banknotes, IDs' },
            { icon: '🎬', title: isZh ? '3D电影' : '3D Cinema', desc: isZh ? '偏振眼镜' : 'Polarized glasses' },
            { icon: '📺', title: isZh ? 'LCD屏幕' : 'LCD Displays', desc: isZh ? '液晶显示' : 'Liquid crystal' },
            { icon: '🕶️', title: isZh ? '偏振墨镜' : 'Sunglasses', desc: isZh ? '消除眩光' : 'Glare reduction' },
          ].map((app, i) => (
            <div
              key={i}
              className={cn(
                'p-3 rounded-lg text-center',
                theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
              )}
            >
              <div className="text-2xl mb-1">{app.icon}</div>
              <div className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-200' : 'text-gray-800')}>
                {app.title}
              </div>
              <div className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                {app.desc}
              </div>
            </div>
          ))}
        </div>
      </InfoCard>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(-50%); }
          20% { transform: translateX(calc(-50% - 6px)); }
          40% { transform: translateX(calc(-50% + 6px)); }
          60% { transform: translateX(calc(-50% - 4px)); }
          80% { transform: translateX(calc(-50% + 4px)); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default PolarizationLockDemo
