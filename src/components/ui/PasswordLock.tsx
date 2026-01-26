/**
 * PolarizationCipher - 多通道偏振认证系统
 *
 * 设计理念：
 * 这是一个基于真实偏振光物理原理的三阶段认证系统。
 * 每个阶段都要求用户理解并应用特定的偏振概念才能解锁。
 *
 * 物理背景叙事：
 * 偏振光在安全领域有真实应用（钞票防伪、LCD显示、3D电影）。
 * 本系统模拟一个使用偏振编码的安全设施入口。
 *
 * 三阶段设计：
 * 1. 通道解密 - 找到正确的偏振角度来显示隐藏符号（学习偏振片对准）
 * 2. 强度校准 - 调整多个偏振片达到精确强度（学习马吕斯定律定量计算）
 * 3. 相位认证 - 处理圆偏振光通道（学习波片概念）
 *
 * 教育目标：
 * - 理解线偏振光与偏振片的相互作用
 * - 掌握马吕斯定律 I = I₀ × cos²(θ)
 * - 初步了解波片和圆偏振光
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  HelpCircle,
  Zap,
  Target,
  Waves,
  Eye,
  Lightbulb,
} from 'lucide-react'

// ==========================================
// 物理计算
// ==========================================
const toRad = (deg: number) => (deg * Math.PI) / 180
const normalize = (angle: number) => ((angle % 180) + 180) % 180
const malusIntensity = (angle1: number, angle2: number, intensity: number = 1) => {
  const diff = toRad(angle2 - angle1)
  return intensity * Math.cos(diff) ** 2
}

// ==========================================
// 类型定义
// ==========================================
interface Channel {
  id: string
  symbol: string          // 隐藏的符号
  targetAngle: number     // 解锁角度
  description: string
  descriptionZh: string
  hint: string
  hintZh: string
}

interface Stage {
  id: number
  title: string
  titleZh: string
  description: string
  descriptionZh: string
  icon: React.ComponentType<{ className?: string }>
}

// ==========================================
// 游戏配置
// ==========================================
const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Channel Decryption',
    titleZh: '通道解密',
    description: 'Align polarizers to reveal hidden symbols in each channel',
    descriptionZh: '调整偏振片角度，在每个通道中显示隐藏的符号',
    icon: Eye,
  },
  {
    id: 2,
    title: 'Intensity Calibration',
    titleZh: '强度校准',
    description: 'Use Malus\'s Law to achieve precise intensity levels',
    descriptionZh: '运用马吕斯定律，达到精确的光强等级',
    icon: Target,
  },
  {
    id: 3,
    title: 'Phase Authentication',
    titleZh: '相位认证',
    description: 'Convert circular polarization to decode final symbol',
    descriptionZh: '转换圆偏振光，解码最终符号',
    icon: Waves,
  },
]

// 阶段1的通道配置 - 每个通道有不同的目标角度
const CHANNELS: Channel[] = [
  {
    id: 'A',
    symbol: 'P',
    targetAngle: 0,
    description: 'Horizontal polarization channel',
    descriptionZh: '水平偏振通道',
    hint: 'Symbol visible when analyzer is horizontal (0°)',
    hintZh: '当检偏器水平(0°)时符号可见',
  },
  {
    id: 'B',
    symbol: 'O',
    targetAngle: 45,
    description: 'Diagonal polarization channel',
    descriptionZh: '对角偏振通道',
    hint: 'Symbol visible at 45° diagonal',
    hintZh: '在45°对角线方向时符号可见',
  },
  {
    id: 'C',
    symbol: 'L',
    targetAngle: 90,
    description: 'Vertical polarization channel',
    descriptionZh: '垂直偏振通道',
    hint: 'Symbol visible when analyzer is vertical (90°)',
    hintZh: '当检偏器垂直(90°)时符号可见',
  },
  {
    id: 'D',
    symbol: 'A',
    targetAngle: 135,
    description: 'Anti-diagonal polarization channel',
    descriptionZh: '反对角偏振通道',
    hint: 'Symbol visible at 135° anti-diagonal',
    hintZh: '在135°反对角线方向时符号可见',
  },
]

// 阶段2的强度目标
const INTENSITY_TARGETS = [
  { level: 0.75, tolerance: 0.05, symbol: 'R', hint: 'cos²(30°) = 0.75' },
  { level: 0.50, tolerance: 0.05, symbol: 'I', hint: 'cos²(45°) = 0.50' },
  { level: 0.25, tolerance: 0.05, symbol: 'S', hint: 'cos²(60°) = 0.25' },
]

// 最终密码
const FINAL_PASSWORD = 'POLARIS' // P-O-L-A (Stage 1) + R-I-S (Stage 2)

// ==========================================
// 子组件
// ==========================================

// 旋转控制盘
interface DialProps {
  angle: number
  onChange: (angle: number) => void
  color: string
  label: string
  disabled?: boolean
  size?: number
}

function RotaryDial({ angle, onChange, color, label, disabled, size = 100 }: DialProps) {
  const handleWheel = (e: React.WheelEvent) => {
    if (disabled) return
    e.preventDefault()
    onChange(angle + (e.deltaY > 0 ? 5 : -5))
  }

  const handleDrag = (e: React.PointerEvent) => {
    if (disabled) return
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const newAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI + 90
    onChange(normalize(newAngle))
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "relative rounded-full border-4 transition-all cursor-grab active:cursor-grabbing",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{
          width: size,
          height: size,
          borderColor: color,
          background: `conic-gradient(from ${angle}deg, ${color}33, transparent 90deg, ${color}33 180deg, transparent 270deg, ${color}33)`,
        }}
        onWheel={handleWheel}
        onPointerMove={(e) => e.buttons === 1 && handleDrag(e)}
        onPointerDown={handleDrag}
      >
        {/* 指示线 */}
        <div
          className="absolute top-0 left-1/2 w-1 h-1/2 -translate-x-1/2 origin-bottom"
          style={{
            background: `linear-gradient(to top, ${color}, ${color}00)`,
            transform: `translateX(-50%) rotate(${angle}deg)`,
          }}
        />
        {/* 中心角度显示 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-bold text-lg" style={{ color }}>
            {Math.round(normalize(angle))}°
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-400">{label}</span>
    </div>
  )
}

// 偏振通道显示
interface ChannelDisplayProps {
  channel: Channel
  currentAngle: number
  isDecoded: boolean
  isZh: boolean
}

function ChannelDisplay({ channel, currentAngle, isDecoded, isZh }: ChannelDisplayProps) {
  const angleDiff = Math.abs(normalize(currentAngle) - channel.targetAngle)
  const visibility = malusIntensity(channel.targetAngle, currentAngle)
  const isAligned = angleDiff < 10 || angleDiff > 170

  return (
    <motion.div
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all",
        isDecoded
          ? "border-emerald-500/50 bg-emerald-900/20"
          : isAligned
            ? "border-cyan-500/50 bg-cyan-900/20"
            : "border-gray-700 bg-gray-900/50"
      )}
      animate={{ scale: isDecoded ? 1.02 : 1 }}
    >
      {/* 通道标识 */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          "text-xs font-bold px-2 py-0.5 rounded",
          isDecoded ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700 text-gray-400"
        )}>
          CH-{channel.id}
        </span>
        <span className="text-xs text-gray-500">
          {isZh ? channel.descriptionZh : channel.description}
        </span>
      </div>

      {/* 符号显示区域 */}
      <div className="relative h-20 flex items-center justify-center overflow-hidden rounded-lg bg-black/50">
        {/* 背景噪点 */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(100,100,100,0.1) 2px, rgba(100,100,100,0.1) 4px)',
          }}
        />

        {/* 符号 - 根据偏振对准程度显示 */}
        <motion.span
          className={cn(
            "text-5xl font-black transition-all",
            isDecoded ? "text-emerald-400" : "text-cyan-400"
          )}
          style={{
            opacity: isDecoded ? 1 : visibility,
            filter: `blur(${isDecoded ? 0 : (1 - visibility) * 10}px)`,
            textShadow: isDecoded ? '0 0 20px rgba(52,211,153,0.5)' : 'none',
          }}
        >
          {channel.symbol}
        </motion.span>

        {/* 锁定图标 */}
        {!isDecoded && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: 1 - visibility }}
          >
            <Lock className="w-8 h-8 text-gray-600" />
          </motion.div>
        )}
      </div>

      {/* 状态指示 */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              isDecoded ? "bg-emerald-500" : isAligned ? "bg-cyan-500 animate-pulse" : "bg-gray-600"
            )}
          />
          <span className={cn(
            "text-xs",
            isDecoded ? "text-emerald-400" : isAligned ? "text-cyan-400" : "text-gray-500"
          )}>
            {isDecoded ? (isZh ? '已解密' : 'DECODED') : `${Math.round(visibility * 100)}%`}
          </span>
        </div>

        {!isDecoded && (
          <span className="text-xs text-gray-600">
            θ = {channel.targetAngle}°
          </span>
        )}
      </div>
    </motion.div>
  )
}

// 强度校准器
interface IntensityCalibrationProps {
  targetIntensity: number
  tolerance: number
  currentIntensity: number
  symbol: string
  hint: string
  isCalibrated: boolean
  isZh: boolean
}

function IntensityCalibration({
  targetIntensity,
  tolerance,
  currentIntensity,
  symbol,
  hint,
  isCalibrated,
  isZh,
}: IntensityCalibrationProps) {
  const diff = Math.abs(currentIntensity - targetIntensity)
  const isClose = diff < tolerance * 2
  const isExact = diff < tolerance

  return (
    <div className={cn(
      "p-4 rounded-xl border-2 transition-all",
      isCalibrated
        ? "border-emerald-500/50 bg-emerald-900/20"
        : isExact
          ? "border-yellow-500/50 bg-yellow-900/20 animate-pulse"
          : "border-gray-700 bg-gray-900/50"
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">
          {isZh ? '目标强度' : 'Target'}: {(targetIntensity * 100).toFixed(0)}%
        </span>
        <span className="text-xs font-mono text-cyan-400">{hint}</span>
      </div>

      {/* 强度条 */}
      <div className="relative h-8 bg-black/50 rounded-lg overflow-hidden">
        {/* 目标区域 */}
        <div
          className="absolute h-full bg-emerald-500/20 border-x-2 border-emerald-500"
          style={{
            left: `${(targetIntensity - tolerance) * 100}%`,
            width: `${tolerance * 2 * 100}%`,
          }}
        />

        {/* 当前强度 */}
        <motion.div
          className={cn(
            "absolute top-0 left-0 h-full",
            isExact ? "bg-emerald-500" : isClose ? "bg-yellow-500" : "bg-cyan-500"
          )}
          animate={{ width: `${currentIntensity * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* 符号显示 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "text-2xl font-bold transition-all",
              isCalibrated ? "text-emerald-400" : "text-white/50"
            )}
            style={{
              opacity: isCalibrated ? 1 : isExact ? 0.8 : 0.3,
              filter: `blur(${isCalibrated ? 0 : isExact ? 0 : 4}px)`,
            }}
          >
            {symbol}
          </span>
        </div>
      </div>

      <div className="mt-2 flex justify-between text-xs">
        <span className={cn(
          isCalibrated ? "text-emerald-400" : isExact ? "text-yellow-400" : "text-gray-500"
        )}>
          {isCalibrated
            ? (isZh ? '✓ 校准完成' : '✓ CALIBRATED')
            : `${(currentIntensity * 100).toFixed(0)}%`}
        </span>
        <span className="text-gray-600">
          Δ = {(diff * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

// 圆偏振转换器
interface CircularConverterProps {
  waveplateFast: number
  onWaveplateChange: (angle: number) => void
  inputAngle: number
  isConverted: boolean
  isZh: boolean
}

function CircularConverter({
  waveplateFast,
  onWaveplateChange,
  inputAngle,
  isConverted,
  isZh,
}: CircularConverterProps) {
  // 圆偏振转线偏振需要快轴在45°时效果最佳
  const conversionEfficiency = Math.abs(Math.sin(2 * toRad(waveplateFast - inputAngle)))
  const isOptimal = Math.abs(normalize(waveplateFast) - 45) < 10 || Math.abs(normalize(waveplateFast) - 135) < 10

  return (
    <div className={cn(
      "p-6 rounded-xl border-2 transition-all",
      isConverted
        ? "border-emerald-500/50 bg-emerald-900/20"
        : isOptimal
          ? "border-purple-500/50 bg-purple-900/20"
          : "border-gray-700 bg-gray-900/50"
    )}>
      <div className="text-center mb-4">
        <h4 className={cn(
          "font-semibold",
          isConverted ? "text-emerald-400" : "text-purple-400"
        )}>
          {isZh ? 'λ/4 波片转换器' : 'λ/4 Waveplate Converter'}
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          {isZh
            ? '调整波片快轴角度，将圆偏振光转换为线偏振光'
            : 'Adjust waveplate fast axis to convert circular to linear polarization'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-8">
        {/* 输入：圆偏振 */}
        <div className="text-center">
          <motion.div
            className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Waves className="w-8 h-8 text-purple-400" />
          </motion.div>
          <span className="text-xs text-purple-400 mt-2 block">
            {isZh ? '圆偏振' : 'Circular'}
          </span>
        </div>

        {/* 波片控制 */}
        <div className="flex flex-col items-center">
          <RotaryDial
            angle={waveplateFast}
            onChange={onWaveplateChange}
            color={isOptimal ? '#a855f7' : '#6b7280'}
            label={isZh ? '快轴角度' : 'Fast Axis'}
            size={80}
          />
          <div className="text-xs text-gray-500 mt-2">
            {isZh ? '最佳: 45° 或 135°' : 'Optimal: 45° or 135°'}
          </div>
        </div>

        {/* 输出：线偏振 */}
        <div className="text-center">
          <motion.div
            className={cn(
              "w-16 h-16 rounded-full border-4 flex items-center justify-center",
              isOptimal ? "border-emerald-500" : "border-gray-600"
            )}
          >
            <motion.div
              className={cn(
                "w-12 h-1 rounded-full",
                isOptimal ? "bg-emerald-400" : "bg-gray-600"
              )}
              animate={{ rotate: isOptimal ? 45 : 0 }}
            />
          </motion.div>
          <span className={cn(
            "text-xs mt-2 block",
            isOptimal ? "text-emerald-400" : "text-gray-500"
          )}>
            {isZh ? '线偏振' : 'Linear'}
          </span>
        </div>
      </div>

      {/* 转换效率 */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">{isZh ? '转换效率' : 'Conversion'}</span>
          <span className={isOptimal ? "text-emerald-400" : "text-gray-400"}>
            {(conversionEfficiency * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full",
              conversionEfficiency > 0.9 ? "bg-emerald-500" : conversionEfficiency > 0.5 ? "bg-purple-500" : "bg-gray-600"
            )}
            animate={{ width: `${conversionEfficiency * 100}%` }}
          />
        </div>
      </div>

      {/* 最终符号 */}
      {isOptimal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <span className={cn(
            "text-4xl font-black",
            isConverted ? "text-emerald-400" : "text-purple-400"
          )}>
            {isConverted ? 'S' : '?'}
          </span>
          {!isConverted && (
            <p className="text-xs text-purple-400 mt-1">
              {isZh ? '保持此位置并确认' : 'Hold position and confirm'}
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}

// 物理原理提示面板
interface PhysicsHintProps {
  stage: number
  isZh: boolean
}

function PhysicsHint({ stage, isZh }: PhysicsHintProps) {
  const hints = {
    1: {
      title: isZh ? '偏振片对准原理' : 'Polarizer Alignment Principle',
      content: isZh
        ? '当检偏器的透过轴与入射光的偏振方向平行时，光能完全通过。角度差越大，透过率越低（遵循马吕斯定律）。'
        : 'When the analyzer transmission axis is parallel to the incident polarization, light passes completely. Greater angle difference = lower transmission (Malus\'s Law).',
      formula: 'I = I₀ × cos²(θ)',
    },
    2: {
      title: isZh ? '马吕斯定律应用' : 'Malus\'s Law Application',
      content: isZh
        ? '通过两个偏振片的光强为 I = I₀ × cos²(θ)，其中θ是两偏振片透过轴的夹角。调整角度可以精确控制输出强度。'
        : 'Light intensity through two polarizers is I = I₀ × cos²(θ), where θ is the angle between transmission axes. Adjust angle to precisely control output.',
      formula: 'cos²(30°)=0.75, cos²(45°)=0.50, cos²(60°)=0.25',
    },
    3: {
      title: isZh ? '波片与圆偏振光' : 'Waveplates & Circular Polarization',
      content: isZh
        ? 'λ/4波片可以将线偏振光转换为圆偏振光，反过来也可以将圆偏振光转换为线偏振光。关键是快轴方向需要在45°。'
        : 'A λ/4 waveplate converts linear to circular polarization and vice versa. The key is aligning the fast axis at 45° to the polarization.',
      formula: 'Circular → λ/4 plate (45°) → Linear',
    },
  }

  const hint = hints[stage as keyof typeof hints]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30"
    >
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-indigo-300 mb-2">{hint.title}</h4>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">{hint.content}</p>
          <div className="font-mono text-sm text-cyan-400 bg-black/30 px-3 py-1 rounded inline-block">
            {hint.formula}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ==========================================
// 主组件
// ==========================================

export function PasswordLock({ onUnlock }: { onUnlock: () => void }) {
  const { i18n } = useTranslation()
  const isZh = i18n.language.startsWith('zh')

  // 阶段状态
  const [currentStage, setCurrentStage] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // 阶段1: 通道解密状态
  const [analyzerAngle, setAnalyzerAngle] = useState(20)
  const [decodedChannels, setDecodedChannels] = useState<string[]>([])

  // 阶段2: 强度校准状态
  const [polarizerAngle, setPolarizerAngle] = useState(0)
  const [calibratedLevels, setCalibratedLevels] = useState<number[]>([])
  const [currentCalibrationIndex, setCurrentCalibrationIndex] = useState(0)

  // 阶段3: 相位认证状态
  const [waveplateAngle, setWaveplateAngle] = useState(0)
  const [phaseConverted, setPhaseConverted] = useState(false)

  // 收集的符号
  const collectedSymbols = useMemo(() => {
    const stage1Symbols = decodedChannels.map(id =>
      CHANNELS.find(c => c.id === id)?.symbol || ''
    ).join('')
    const stage2Symbols = calibratedLevels.map(i =>
      INTENSITY_TARGETS[i]?.symbol || ''
    ).join('')
    const stage3Symbol = phaseConverted ? 'S' : ''
    return stage1Symbols + stage2Symbols + stage3Symbol
  }, [decodedChannels, calibratedLevels, phaseConverted])

  // 阶段1: 检查通道解密
  useEffect(() => {
    CHANNELS.forEach(channel => {
      if (decodedChannels.includes(channel.id)) return

      const angleDiff = Math.abs(normalize(analyzerAngle) - channel.targetAngle)
      if ((angleDiff < 8 || angleDiff > 172) && malusIntensity(channel.targetAngle, analyzerAngle) > 0.95) {
        setDecodedChannels(prev => {
          if (prev.includes(channel.id)) return prev
          return [...prev, channel.id]
        })
      }
    })
  }, [analyzerAngle, decodedChannels])

  // 阶段2: 计算当前强度
  const currentIntensity = useMemo(() => {
    return malusIntensity(0, polarizerAngle)
  }, [polarizerAngle])

  // 阶段2: 检查强度校准
  const handleCalibrate = useCallback(() => {
    if (currentCalibrationIndex >= INTENSITY_TARGETS.length) return

    const target = INTENSITY_TARGETS[currentCalibrationIndex]
    const diff = Math.abs(currentIntensity - target.level)

    if (diff < target.tolerance) {
      setCalibratedLevels(prev => [...prev, currentCalibrationIndex])
      setCurrentCalibrationIndex(prev => prev + 1)
    }
  }, [currentCalibrationIndex, currentIntensity])

  // 阶段3: 检查相位转换
  const handlePhaseConfirm = useCallback(() => {
    const normalizedAngle = normalize(waveplateAngle)
    if (Math.abs(normalizedAngle - 45) < 10 || Math.abs(normalizedAngle - 135) < 10) {
      setPhaseConverted(true)
    }
  }, [waveplateAngle])

  // 检查阶段完成并推进
  useEffect(() => {
    if (currentStage === 1 && decodedChannels.length === 4) {
      setTimeout(() => setCurrentStage(2), 1000)
    } else if (currentStage === 2 && calibratedLevels.length === 3) {
      setTimeout(() => setCurrentStage(3), 1000)
    } else if (currentStage === 3 && phaseConverted) {
      setTimeout(() => {
        setIsComplete(true)
        localStorage.setItem('polarcraft_unlocked', 'true')
        setTimeout(onUnlock, 2000)
      }, 1000)
    }
  }, [currentStage, decodedChannels, calibratedLevels, phaseConverted, onUnlock])

  // 重置
  const handleReset = useCallback(() => {
    setCurrentStage(1)
    setAnalyzerAngle(20)
    setDecodedChannels([])
    setPolarizerAngle(0)
    setCalibratedLevels([])
    setCurrentCalibrationIndex(0)
    setWaveplateAngle(0)
    setPhaseConverted(false)
    setIsComplete(false)
  }, [])

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col overflow-hidden select-none">
      {/* 背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-zinc-950 to-black" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIiBmaWxsPSJyZ2JhKDEwMCwxNTAsMjU1LDAuMSkiLz4KPC9zdmc+')] opacity-50" />

      {/* 顶部导航 */}
      <header className="relative z-10 px-6 py-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-bold tracking-wider uppercase">
                {isZh ? '安全认证' : 'SECURITY AUTH'}
              </span>
            </div>
            <div className="h-6 w-px bg-gray-700" />
            <h1 className="text-lg font-bold text-white">
              {isZh ? '多通道偏振认证系统' : 'Multi-Channel Polarization Auth'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showHint ? "bg-indigo-500/20 text-indigo-400" : "hover:bg-gray-800 text-gray-400"
              )}
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 进度条 */}
      <div className="relative z-10 px-6 py-3 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            {STAGES.map((stage, index) => {
              const isActive = stage.id === currentStage
              const isCompleted = stage.id < currentStage
              const Icon = stage.icon

              return (
                <div key={stage.id} className="flex items-center gap-2 flex-1">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all flex-1",
                    isActive && "bg-indigo-500/20 border border-indigo-500/50",
                    isCompleted && "bg-emerald-500/10 border border-emerald-500/30",
                    !isActive && !isCompleted && "opacity-40"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      isActive && "bg-indigo-500 text-white",
                      isCompleted && "bg-emerald-500 text-white",
                      !isActive && !isCompleted && "bg-gray-700 text-gray-400"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className={cn(
                        "text-sm font-medium",
                        isActive && "text-indigo-300",
                        isCompleted && "text-emerald-400",
                        !isActive && !isCompleted && "text-gray-500"
                      )}>
                        {isZh ? stage.titleZh : stage.title}
                      </div>
                      <div className="text-xs text-gray-500 hidden md:block">
                        {isZh ? stage.descriptionZh : stage.description}
                      </div>
                    </div>
                  </div>
                  {index < STAGES.length - 1 && (
                    <ChevronRight className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isCompleted ? "text-emerald-500" : "text-gray-600"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="relative z-10 flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* 完成画面 */}
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <motion.div
                  className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center mb-6"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Unlock className="w-12 h-12 text-emerald-400" />
                </motion.div>

                <h2 className="text-3xl font-black text-white mb-2">
                  {isZh ? '认证成功' : 'AUTHENTICATION COMPLETE'}
                </h2>
                <p className="text-gray-400 mb-6">
                  {isZh ? '正在进入系统...' : 'Entering system...'}
                </p>

                <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-emerald-400 font-mono text-lg tracking-[0.3em]">
                    {collectedSymbols}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-4">
                  {isZh
                    ? '你已掌握：偏振片对准 · 马吕斯定律 · 波片转换'
                    : 'Mastered: Polarizer alignment · Malus\'s Law · Waveplate conversion'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`stage-${currentStage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* 左侧：物理提示 */}
                {showHint && (
                  <div className="lg:col-span-1">
                    <PhysicsHint stage={currentStage} isZh={isZh} />
                  </div>
                )}

                {/* 中/右：主交互区 */}
                <div className={cn(
                  "space-y-6",
                  showHint ? "lg:col-span-2" : "lg:col-span-3"
                )}>
                  {/* 阶段1: 通道解密 */}
                  {currentStage === 1 && (
                    <>
                      <div className="flex items-center justify-center gap-8 p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                        <div className="text-center">
                          <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                          <span className="text-xs text-gray-500">
                            {isZh ? '偏振光源' : 'Polarized Source'}
                          </span>
                        </div>

                        <div className="flex-1 h-2 bg-gradient-to-r from-yellow-500 via-cyan-500 to-transparent rounded-full" />

                        <RotaryDial
                          angle={analyzerAngle}
                          onChange={setAnalyzerAngle}
                          color="#22d3ee"
                          label={isZh ? '检偏器角度' : 'Analyzer Angle'}
                          size={120}
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {CHANNELS.map(channel => (
                          <ChannelDisplay
                            key={channel.id}
                            channel={channel}
                            currentAngle={analyzerAngle}
                            isDecoded={decodedChannels.includes(channel.id)}
                            isZh={isZh}
                          />
                        ))}
                      </div>

                      <div className="text-center text-sm text-gray-500">
                        {isZh
                          ? `已解密 ${decodedChannels.length}/4 个通道 | 收集符号: ${decodedChannels.map(id => CHANNELS.find(c => c.id === id)?.symbol).join('') || '---'}`
                          : `Decoded ${decodedChannels.length}/4 channels | Collected: ${decodedChannels.map(id => CHANNELS.find(c => c.id === id)?.symbol).join('') || '---'}`}
                      </div>
                    </>
                  )}

                  {/* 阶段2: 强度校准 */}
                  {currentStage === 2 && (
                    <>
                      <div className="flex items-center justify-center gap-8 p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-4 border-cyan-500 flex items-center justify-center mb-2">
                            <div className="w-10 h-1 bg-cyan-400 rounded-full" style={{ transform: 'rotate(0deg)' }} />
                          </div>
                          <span className="text-xs text-gray-500">
                            {isZh ? '起偏器 (0°)' : 'Polarizer (0°)'}
                          </span>
                        </div>

                        <div className="flex-1 flex flex-col items-center">
                          <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
                            <motion.div
                              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                              animate={{ width: `${currentIntensity * 100}%` }}
                            />
                          </div>
                          <span className="text-lg font-mono font-bold text-cyan-400">
                            I = {(currentIntensity * 100).toFixed(0)}%
                          </span>
                        </div>

                        <RotaryDial
                          angle={polarizerAngle}
                          onChange={setPolarizerAngle}
                          color="#a855f7"
                          label={isZh ? '检偏器角度' : 'Analyzer Angle'}
                          size={120}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {INTENSITY_TARGETS.map((target, index) => (
                          <IntensityCalibration
                            key={index}
                            targetIntensity={target.level}
                            tolerance={target.tolerance}
                            currentIntensity={currentIntensity}
                            symbol={target.symbol}
                            hint={target.hint}
                            isCalibrated={calibratedLevels.includes(index)}
                            isZh={isZh}
                          />
                        ))}
                      </div>

                      {currentCalibrationIndex < INTENSITY_TARGETS.length && (
                        <div className="text-center">
                          <button
                            onClick={handleCalibrate}
                            className={cn(
                              "px-8 py-3 rounded-xl font-medium transition-all",
                              Math.abs(currentIntensity - INTENSITY_TARGETS[currentCalibrationIndex].level) < INTENSITY_TARGETS[currentCalibrationIndex].tolerance
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            )}
                          >
                            {isZh ? `校准目标 ${currentCalibrationIndex + 1}` : `Calibrate Target ${currentCalibrationIndex + 1}`}
                          </button>
                          <p className="text-xs text-gray-600 mt-2">
                            {isZh
                              ? `调整检偏器使强度达到 ${(INTENSITY_TARGETS[currentCalibrationIndex].level * 100).toFixed(0)}%`
                              : `Adjust analyzer to achieve ${(INTENSITY_TARGETS[currentCalibrationIndex].level * 100).toFixed(0)}% intensity`}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* 阶段3: 相位认证 */}
                  {currentStage === 3 && (
                    <>
                      <CircularConverter
                        waveplateFast={waveplateAngle}
                        onWaveplateChange={setWaveplateAngle}
                        inputAngle={45}
                        isConverted={phaseConverted}
                        isZh={isZh}
                      />

                      {!phaseConverted && (
                        <div className="text-center">
                          <button
                            onClick={handlePhaseConfirm}
                            className={cn(
                              "px-8 py-3 rounded-xl font-medium transition-all",
                              Math.abs(normalize(waveplateAngle) - 45) < 10 || Math.abs(normalize(waveplateAngle) - 135) < 10
                                ? "bg-purple-500 hover:bg-purple-600 text-white"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            )}
                          >
                            {isZh ? '确认转换' : 'Confirm Conversion'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 底部状态栏 */}
      <footer className="relative z-10 px-6 py-3 border-t border-white/5 bg-black/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">
              {isZh ? '已收集符号' : 'Collected'}:
            </span>
            <div className="flex gap-1">
              {FINAL_PASSWORD.split('').map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-8 h-8 rounded border-2 flex items-center justify-center font-mono font-bold",
                    index < collectedSymbols.length
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                      : "border-gray-700 bg-gray-900 text-gray-600"
                  )}
                >
                  {collectedSymbols[index] || '?'}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Lock className="w-4 h-4" />
            <span>
              {isZh ? '基于偏振光物理原理的安全认证' : 'Physics-based polarization security'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PasswordLock
