/**
 * PuzzleGate - 偏振光密码锁组件 (高科技版)
 *
 * 用户需要旋转两个偏振片到正确角度（45° + 90°）才能显示隐藏密码 "POLAR"
 * 密码通过真实的偏振光学效果逐渐显现 - 从模糊到清晰
 *
 * 验证通过后存储到 localStorage，30天内不需要重新验证
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Lock, Unlock, RotateCcw, Eye, EyeOff, Sparkles, ArrowRight, Zap, Radio } from 'lucide-react'

// 配置常量
const CORRECT_ANGLE_1 = 45  // 第一个偏振片正确角度
const CORRECT_ANGLE_2 = 90  // 第二个偏振片正确角度
const ANGLE_TOLERANCE = 3   // 角度容差（±3°）
const SECRET_PASSWORD = 'POLAR'
const STORAGE_KEY = 'polarcraft_access'
const EXPIRY_DAYS = 30

interface PuzzleGateProps {
  onAccessGranted: () => void
}

// 检查访问权限
export function checkAccess(): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return false
    const { verified, expiry } = JSON.parse(data)
    if (expiry && Date.now() > expiry) {
      localStorage.removeItem(STORAGE_KEY)
      return false
    }
    return verified === true
  } catch {
    return false
  }
}

// 保存访问权限
function saveAccess(): void {
  const expiry = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    verified: true,
    timestamp: Date.now(),
    expiry
  }))
}

// 光粒子组件
function LightParticles({ intensity, isActive }: { intensity: number; isActive: boolean }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([])

  useEffect(() => {
    if (isActive && intensity > 10) {
      const count = Math.floor(intensity / 10)
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        delay: Math.random() * 2
      }))
      setParticles(newParticles)
    } else {
      setParticles([])
    }
  }, [intensity, isActive])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-cyan-400"
          initial={{ left: '10%', top: `${p.x}%`, opacity: 0, scale: 0 }}
          animate={{
            left: ['10%', '90%'],
            opacity: [0, intensity / 100, intensity / 100, 0],
            scale: [0, 1, 1, 0]
          }}
          transition={{
            duration: 2,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            boxShadow: `0 0 ${4 + intensity / 20}px ${2 + intensity / 40}px rgba(34, 211, 238, ${intensity / 100})`
          }}
        />
      ))}
    </div>
  )
}

// 全息屏幕效果
function HolographicScreen({
  children,
  clarity,
  isUnlocked,
  theme
}: {
  children: React.ReactNode
  clarity: number
  isUnlocked: boolean
  theme: string
}) {
  const [scanLine, setScanLine] = useState(0)

  useEffect(() => {
    if (clarity < 100) {
      const interval = setInterval(() => {
        setScanLine((prev) => (prev + 2) % 100)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [clarity])

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* 基础背景 */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-500',
          isUnlocked
            ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-green-500/20'
            : theme === 'dark'
              ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800'
              : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100'
        )}
      />

      {/* 扫描线效果 */}
      {!isUnlocked && clarity < 100 && (
        <>
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
            style={{ top: `${scanLine}%` }}
          />
          <motion.div
            className="absolute left-0 right-0 h-8 bg-gradient-to-b from-cyan-400/5 to-transparent"
            style={{ top: `${scanLine}%` }}
          />
        </>
      )}

      {/* CRT网格效果 */}
      {!isUnlocked && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '4px 4px'
          }}
        />
      )}

      {/* 内容 */}
      <div className="relative z-10">{children}</div>

      {/* 边缘发光 */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl pointer-events-none transition-all duration-500',
          isUnlocked
            ? 'shadow-[inset_0_0_30px_rgba(34,197,94,0.3)]'
            : clarity > 80
              ? 'shadow-[inset_0_0_20px_rgba(34,211,238,0.2)]'
              : 'shadow-[inset_0_0_10px_rgba(100,116,139,0.1)]'
        )}
      />
    </div>
  )
}

// 密码字符组件 - 带偏振光解密效果
function PasswordCharacter({
  char,
  index,
  clarity,
  isUnlocked,
  theme
}: {
  char: string
  index: number
  clarity: number
  isUnlocked: boolean
  theme: string
}) {
  // 每个字符有不同的显现阈值，营造逐字解密效果
  const charThreshold = [60, 70, 75, 85, 95][index] || 80
  const charClarity = Math.max(0, Math.min(100, (clarity - charThreshold + 30) * (100 / 30)))

  // 乱码字符集
  const glitchChars = '█▓▒░◈◇◆●○☆★▲△▼▽■□▪▫'

  // 随机乱码
  const [glitchChar, setGlitchChar] = useState(glitchChars[0])

  useEffect(() => {
    if (charClarity < 100 && !isUnlocked) {
      const interval = setInterval(() => {
        setGlitchChar(glitchChars[Math.floor(Math.random() * glitchChars.length)])
      }, 100 + index * 30)
      return () => clearInterval(interval)
    }
  }, [charClarity, isUnlocked, index])

  // 计算模糊度 - 使用 SVG 滤镜的 blur
  const blurAmount = isUnlocked ? 0 : Math.max(0, (100 - charClarity) / 10)

  // 计算不透明度
  const opacity = isUnlocked ? 1 : Math.max(0.1, charClarity / 100)

  // 显示的字符
  const displayChar = isUnlocked || charClarity > 90 ? char : charClarity > 50 ? (Math.random() > 0.5 ? char : glitchChar) : glitchChar

  return (
    <motion.span
      className={cn(
        'inline-block font-mono font-bold text-4xl md:text-5xl relative',
        'transition-all duration-200'
      )}
      style={{
        filter: `blur(${blurAmount}px)`,
        opacity,
        textShadow: isUnlocked
          ? '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.4)'
          : charClarity > 80
            ? '0 0 15px rgba(34, 211, 238, 0.6), 0 0 30px rgba(34, 211, 238, 0.3)'
            : 'none',
        color: isUnlocked
          ? '#22c55e'
          : charClarity > 80
            ? '#22d3ee'
            : theme === 'dark'
              ? '#475569'
              : '#9ca3af'
      }}
      initial={{ y: 10, rotateX: 45 }}
      animate={{
        y: isUnlocked ? [0, -5, 0] : 0,
        rotateX: 0,
        scale: isUnlocked ? [1, 1.1, 1] : 1
      }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        y: { repeat: isUnlocked ? 2 : 0, duration: 0.3 }
      }}
    >
      {displayChar}

      {/* 解密时的光芒效果 */}
      {charClarity > 80 && charClarity < 100 && !isUnlocked && (
        <motion.span
          className="absolute inset-0 text-cyan-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {char}
        </motion.span>
      )}
    </motion.span>
  )
}

// 解锁进度环
function UnlockProgressRing({ progress, isUnlocked }: { progress: number; isUnlocked: boolean }) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="absolute -top-2 -right-2 w-20 h-20">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* 背景环 */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-slate-700/30"
        />
        {/* 进度环 */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {/* 渐变定义 */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isUnlocked ? '#22c55e' : '#22d3ee'} />
            <stop offset="100%" stopColor={isUnlocked ? '#10b981' : '#a855f7'} />
          </linearGradient>
        </defs>
      </svg>
      {/* 百分比显示 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            'text-xs font-mono font-bold',
            isUnlocked ? 'text-green-500' : 'text-cyan-400'
          )}
        >
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}

// 偏振片3D可视化
function Polarizer3D({
  angle,
  isCorrect,
  color,
  label
}: {
  angle: number
  isCorrect: boolean
  color: 'cyan' | 'purple'
  label: string
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* 外圈发光 */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-xl',
            isCorrect
              ? 'bg-green-500/30'
              : color === 'cyan'
                ? 'bg-cyan-500/20'
                : 'bg-purple-500/20'
          )}
          animate={{
            scale: isCorrect ? [1, 1.1, 1] : 1,
            opacity: isCorrect ? [0.5, 1, 0.5] : 0.5
          }}
          transition={{
            duration: 1,
            repeat: isCorrect ? Infinity : 0
          }}
          style={{ filter: 'blur(8px)' }}
        />

        {/* 偏振片本体 */}
        <motion.div
          className={cn(
            'relative w-14 h-14 rounded-xl border-2 flex items-center justify-center',
            'bg-gradient-to-br backdrop-blur-sm',
            isCorrect
              ? 'from-green-500/40 to-green-500/20 border-green-500'
              : color === 'cyan'
                ? 'from-cyan-500/40 to-cyan-500/20 border-cyan-500'
                : 'from-purple-500/40 to-purple-500/20 border-purple-500'
          )}
          style={{
            perspective: '200px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* 偏振条纹 */}
          <motion.div
            className="absolute inset-2 overflow-hidden rounded-lg"
            animate={{ rotate: angle }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'absolute h-px w-full',
                  isCorrect
                    ? 'bg-green-400/60'
                    : color === 'cyan'
                      ? 'bg-cyan-400/60'
                      : 'bg-purple-400/60'
                )}
                style={{ top: `${20 + i * 15}%` }}
              />
            ))}
          </motion.div>

          {/* 旋转指示线 */}
          <motion.div
            className={cn(
              'absolute w-10 h-0.5 rounded-full',
              isCorrect
                ? 'bg-green-400'
                : color === 'cyan'
                  ? 'bg-cyan-400'
                  : 'bg-purple-400'
            )}
            animate={{ rotate: angle }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </motion.div>

        {/* 角度标签 */}
        <motion.div
          className={cn(
            'absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-xs font-mono font-bold',
            isCorrect
              ? 'bg-green-500 text-white'
              : color === 'cyan'
                ? 'bg-cyan-500/80 text-white'
                : 'bg-purple-500/80 text-white'
          )}
          animate={{ scale: isCorrect ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {angle}°
        </motion.div>
      </div>

      <span className="text-xs mt-2 font-mono text-gray-400">{label}</span>
    </div>
  )
}

// 光束可视化
function LightBeamVisualization({
  intensity
}: {
  intensity: number
}) {
  return (
    <div className="relative flex-1 mx-3 h-12 flex items-center">
      {/* 背景虚线 */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-slate-600/30" />

      {/* 光束主体 */}
      <motion.div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full overflow-hidden"
        style={{
          background: `linear-gradient(90deg,
            rgba(34, 211, 238, 0.9) 0%,
            rgba(34, 211, 238, ${intensity / 100}) 50%,
            rgba(168, 85, 247, ${intensity / 100}) 100%
          )`
        }}
      >
        {/* 流动光效 */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.4) 50%,
              transparent 100%
            )`,
            backgroundSize: '50% 100%'
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </motion.div>

      {/* 波形可视化 */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
      >
        <motion.path
          d={`M 0,20 ${Array.from({ length: 20 })
            .map(
              (_, i) =>
                `Q ${i * 10 + 5},${20 - Math.sin((i + Date.now() / 200) * 0.5) * 8 * (intensity / 100)} ${(i + 1) * 10},20`
            )
            .join(' ')}`}
          fill="none"
          stroke={`rgba(34, 211, 238, ${intensity / 200})`}
          strokeWidth="1"
          animate={{
            d: [
              `M 0,20 ${Array.from({ length: 20 })
                .map((_, i) => `Q ${i * 10 + 5},${20 - 8 * (intensity / 100)} ${(i + 1) * 10},20`)
                .join(' ')}`,
              `M 0,20 ${Array.from({ length: 20 })
                .map((_, i) => `Q ${i * 10 + 5},${20 + 8 * (intensity / 100)} ${(i + 1) * 10},20`)
                .join(' ')}`
            ]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      </svg>

      {/* 光粒子 */}
      <LightParticles intensity={intensity} isActive={intensity > 20} />
    </div>
  )
}

export function PuzzleGate({ onAccessGranted }: PuzzleGateProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  // 偏振片角度状态
  const [angle1, setAngle1] = useState(0)
  const [angle2, setAngle2] = useState(0)

  // 密码输入状态
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  // 动画状态
  const [isRevealing, setIsRevealing] = useState(false)

  // 计算角度1的准确度 (0-100)
  const accuracy1 = useMemo(() => {
    const diff = Math.abs(angle1 - CORRECT_ANGLE_1)
    return Math.max(0, 100 - diff * 2)
  }, [angle1])

  // 计算角度2的准确度 (0-100)
  const accuracy2 = useMemo(() => {
    const diff = Math.abs(angle2 - CORRECT_ANGLE_2)
    return Math.max(0, 100 - diff * 2)
  }, [angle2])

  // 综合清晰度 (0-100) - 用于密码显示
  const clarity = useMemo(() => {
    return (accuracy1 + accuracy2) / 2
  }, [accuracy1, accuracy2])

  // 解锁进度 (0-100)
  const unlockProgress = useMemo(() => {
    const angle1Correct = Math.abs(angle1 - CORRECT_ANGLE_1) <= ANGLE_TOLERANCE
    const angle2Correct = Math.abs(angle2 - CORRECT_ANGLE_2) <= ANGLE_TOLERANCE
    if (angle1Correct && angle2Correct) return 100
    return clarity
  }, [angle1, angle2, clarity])

  // 是否角度完全正确
  const isAngleCorrect = unlockProgress === 100

  // 计算透过率（马吕斯定律）
  const transmission = useMemo(() => {
    const angleDiff = Math.abs(angle2 - angle1)
    const radians = (angleDiff * Math.PI) / 180
    return Math.pow(Math.cos(radians), 2) * 100
  }, [angle1, angle2])

  // 监听角度变化，触发揭示动画
  useEffect(() => {
    if (isAngleCorrect && !isRevealing) {
      setIsRevealing(true)
    }
  }, [isAngleCorrect])

  // 处理密码提交
  const handleSubmit = useCallback(() => {
    if (password.toUpperCase() === SECRET_PASSWORD) {
      setUnlocked(true)
      saveAccess()
      setTimeout(() => {
        onAccessGranted()
      }, 2000)
    } else {
      setError(true)
      setTimeout(() => setError(false), 1000)
    }
  }, [password, onAccessGranted])

  // 重置谜题
  const handleReset = () => {
    setAngle1(0)
    setAngle2(0)
    setPassword('')
    setError(false)
    setIsRevealing(false)
  }

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && password.length > 0) {
        handleSubmit()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [password, handleSubmit])

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-gradient-to-br overflow-hidden',
        theme === 'dark'
          ? 'from-slate-950 via-slate-900 to-slate-950'
          : 'from-slate-100 via-white to-slate-100'
      )}
    >
      {/* 动态背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 网格背景 */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* 动态光晕 */}
        <motion.div
          className={cn(
            'absolute w-[600px] h-[600px] rounded-full blur-3xl',
            isAngleCorrect ? 'bg-green-500/20' : 'bg-cyan-500/20'
          )}
          animate={{
            top: ['20%', '30%', '20%'],
            left: ['20%', '30%', '20%'],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={cn(
            'absolute w-[500px] h-[500px] rounded-full blur-3xl',
            isAngleCorrect ? 'bg-emerald-500/20' : 'bg-purple-500/20'
          )}
          animate={{
            bottom: ['20%', '30%', '20%'],
            right: ['20%', '30%', '20%'],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* 解锁成功的粒子爆炸效果 */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-green-400"
                initial={{
                  top: '50%',
                  left: '50%',
                  scale: 0
                }}
                animate={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.02,
                  ease: 'easeOut'
                }}
                style={{
                  boxShadow: '0 0 10px 5px rgba(34, 197, 94, 0.5)'
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={cn(
          'relative max-w-lg w-full rounded-3xl p-6 md:p-8 shadow-2xl border',
          theme === 'dark'
            ? 'bg-slate-900/95 border-slate-700/50 backdrop-blur-xl'
            : 'bg-white/95 border-gray-200/50 backdrop-blur-xl'
        )}
      >
        {/* 解锁进度环 */}
        <UnlockProgressRing progress={unlockProgress} isUnlocked={unlocked} />

        {/* 标题区域 */}
        <div className="text-center mb-6">
          <motion.div
            animate={{
              rotate: unlocked ? [0, 360] : [0, -5, 5, 0],
              scale: unlocked ? [1, 1.2, 1] : 1
            }}
            transition={{
              duration: unlocked ? 0.5 : 0.5,
              repeat: unlocked ? 0 : Infinity,
              repeatDelay: 3
            }}
            className={cn(
              'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4',
              'transition-all duration-500',
              unlocked
                ? 'bg-green-500/30 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.5)]'
                : isAngleCorrect
                  ? 'bg-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                  : theme === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-cyan-500/20 text-cyan-600'
            )}
          >
            {unlocked ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </motion.div>

          <h1
            className={cn(
              'text-2xl font-bold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
          >
            {isZh ? '偏振光密码锁' : 'Polarization Lock'}
          </h1>

          <p
            className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}
          >
            {isZh
              ? '调整偏振片角度，解开隐藏的密码'
              : 'Adjust the polarizers to reveal the hidden password'}
          </p>
        </div>

        {/* 光学系统可视化 */}
        <div
          className={cn(
            'relative rounded-2xl p-4 md:p-6 mb-6 border',
            theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-50 border-gray-200'
          )}
        >
          {/* 光路可视化 */}
          <div className="flex items-center justify-between mb-6">
            {/* 光源 */}
            <div className="flex flex-col items-center">
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500/20"
                animate={{
                  boxShadow: [
                    '0 0 10px 5px rgba(234, 179, 8, 0.2)',
                    '0 0 20px 10px rgba(234, 179, 8, 0.4)',
                    '0 0 10px 5px rgba(234, 179, 8, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </motion.div>
              <span className="text-xs mt-1 text-gray-500">{isZh ? '光源' : 'Light'}</span>
            </div>

            {/* 偏振片1 */}
            <Polarizer3D
              angle={angle1}
              isCorrect={Math.abs(angle1 - CORRECT_ANGLE_1) <= ANGLE_TOLERANCE}
              color="cyan"
              label="P₁"
            />

            {/* 光束可视化 */}
            <LightBeamVisualization intensity={transmission} />

            {/* 偏振片2 */}
            <Polarizer3D
              angle={angle2}
              isCorrect={Math.abs(angle2 - CORRECT_ANGLE_2) <= ANGLE_TOLERANCE}
              color="purple"
              label="P₂"
            />

            {/* 探测器/屏幕 */}
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  'transition-all duration-500',
                  isAngleCorrect
                    ? 'bg-green-500/30 text-green-400'
                    : theme === 'dark'
                      ? 'bg-slate-700 text-gray-500'
                      : 'bg-gray-200 text-gray-400'
                )}
                animate={
                  isAngleCorrect
                    ? {
                        boxShadow: [
                          '0 0 10px 5px rgba(34, 197, 94, 0.2)',
                          '0 0 20px 10px rgba(34, 197, 94, 0.4)',
                          '0 0 10px 5px rgba(34, 197, 94, 0.2)'
                        ]
                      }
                    : {}
                }
                transition={{ duration: 1, repeat: isAngleCorrect ? Infinity : 0 }}
              >
                {isAngleCorrect ? <Radio className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
              </motion.div>
              <span className="text-xs mt-1 text-gray-500">{isZh ? '屏幕' : 'Screen'}</span>
            </div>
          </div>

          {/* 密码显示区 - 全息屏幕效果 */}
          <HolographicScreen clarity={clarity} isUnlocked={unlocked} theme={theme}>
            <div className="py-6 px-4 text-center">
              {/* 密码字符 */}
              <div className="flex justify-center gap-2 md:gap-4 mb-3">
                {SECRET_PASSWORD.split('').map((char, index) => (
                  <PasswordCharacter
                    key={index}
                    char={char}
                    index={index}
                    clarity={clarity}
                    isUnlocked={unlocked}
                    theme={theme}
                  />
                ))}
              </div>

              {/* 状态提示 */}
              <motion.p
                className={cn(
                  'text-xs font-mono',
                  unlocked
                    ? 'text-green-400'
                    : isAngleCorrect
                      ? 'text-cyan-400'
                      : theme === 'dark'
                        ? 'text-gray-600'
                        : 'text-gray-400'
                )}
                animate={isAngleCorrect && !unlocked ? { opacity: [0.5, 1, 0.5] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {unlocked
                  ? isZh
                    ? '>>> 解密成功 <<<'
                    : '>>> DECRYPTED <<<'
                  : isAngleCorrect
                    ? isZh
                      ? '[ 密码已解锁 - 请输入 ]'
                      : '[ PASSWORD UNLOCKED - ENTER BELOW ]'
                    : isZh
                      ? `[ 解密进度: ${Math.round(clarity)}% ]`
                      : `[ DECRYPTION: ${Math.round(clarity)}% ]`}
              </motion.p>
            </div>
          </HolographicScreen>

          {/* 偏振片控制滑块 */}
          <div className="mt-6 space-y-4">
            {/* 偏振片1控制 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className={cn(
                    'text-sm font-medium flex items-center gap-2',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      Math.abs(angle1 - CORRECT_ANGLE_1) <= ANGLE_TOLERANCE
                        ? 'bg-green-500'
                        : 'bg-cyan-500'
                    )}
                  />
                  {isZh ? '偏振片 1' : 'Polarizer 1'} (P₁)
                </label>
                <span
                  className={cn(
                    'text-sm font-mono px-2 py-0.5 rounded transition-all duration-300',
                    Math.abs(angle1 - CORRECT_ANGLE_1) <= ANGLE_TOLERANCE
                      ? 'bg-green-500/20 text-green-400'
                      : theme === 'dark'
                        ? 'bg-slate-700 text-cyan-400'
                        : 'bg-gray-100 text-cyan-600'
                  )}
                >
                  {angle1}°
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={angle1}
                  onChange={(e) => setAngle1(Number(e.target.value))}
                  className={cn(
                    'w-full h-2 rounded-full appearance-none cursor-pointer',
                    'bg-gradient-to-r from-cyan-500/30 via-cyan-500/50 to-cyan-500/30',
                    '[&::-webkit-slider-thumb]:appearance-none',
                    '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
                    '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500',
                    '[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.5)]',
                    '[&::-webkit-slider-thumb]:cursor-pointer',
                    '[&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125'
                  )}
                />
                {/* 目标位置指示器 */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-green-500/50 rounded pointer-events-none"
                  style={{ left: `${(CORRECT_ANGLE_1 / 180) * 100}%` }}
                />
              </div>
            </div>

            {/* 偏振片2控制 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className={cn(
                    'text-sm font-medium flex items-center gap-2',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      Math.abs(angle2 - CORRECT_ANGLE_2) <= ANGLE_TOLERANCE
                        ? 'bg-green-500'
                        : 'bg-purple-500'
                    )}
                  />
                  {isZh ? '偏振片 2' : 'Polarizer 2'} (P₂)
                </label>
                <span
                  className={cn(
                    'text-sm font-mono px-2 py-0.5 rounded transition-all duration-300',
                    Math.abs(angle2 - CORRECT_ANGLE_2) <= ANGLE_TOLERANCE
                      ? 'bg-green-500/20 text-green-400'
                      : theme === 'dark'
                        ? 'bg-slate-700 text-purple-400'
                        : 'bg-gray-100 text-purple-600'
                  )}
                >
                  {angle2}°
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={angle2}
                  onChange={(e) => setAngle2(Number(e.target.value))}
                  className={cn(
                    'w-full h-2 rounded-full appearance-none cursor-pointer',
                    'bg-gradient-to-r from-purple-500/30 via-purple-500/50 to-purple-500/30',
                    '[&::-webkit-slider-thumb]:appearance-none',
                    '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
                    '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500',
                    '[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)]',
                    '[&::-webkit-slider-thumb]:cursor-pointer',
                    '[&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125'
                  )}
                />
                {/* 目标位置指示器 */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-green-500/50 rounded pointer-events-none"
                  style={{ left: `${(CORRECT_ANGLE_2 / 180) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 物理公式显示 */}
          <div
            className={cn(
              'mt-4 text-center text-xs font-mono',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}
          >
            <span className="text-cyan-400">I</span> ={' '}
            <span className="text-yellow-400">I₀</span> × cos²(
            <span className="text-purple-400">{Math.abs(angle2 - angle1)}°</span>) ={' '}
            <span
              className={cn(
                'font-bold',
                transmission > 80 ? 'text-green-400' : transmission > 40 ? 'text-yellow-400' : 'text-red-400'
              )}
            >
              {transmission.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* 密码输入区 */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
              placeholder={isZh ? '输入解密后的密码...' : 'Enter the decrypted password...'}
              maxLength={10}
              disabled={unlocked}
              className={cn(
                'w-full px-4 py-3 rounded-xl text-center text-lg font-mono tracking-[0.3em]',
                'border-2 transition-all duration-300 outline-none',
                error
                  ? 'border-red-500 bg-red-500/10 animate-shake'
                  : unlocked
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-white focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                      : 'border-gray-300 bg-white text-gray-900 focus:border-cyan-500'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors',
                theme === 'dark' ? 'text-gray-400 hover:text-gray-300 hover:bg-slate-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              )}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={unlocked}
              className={cn(
                'flex-none px-4 py-3 rounded-xl border-2 transition-all duration-300',
                'flex items-center justify-center gap-2',
                theme === 'dark'
                  ? 'border-slate-600 text-gray-400 hover:border-slate-500 hover:text-gray-300 hover:bg-slate-800'
                  : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50',
                unlocked && 'opacity-50 cursor-not-allowed'
              )}
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <motion.button
              onClick={handleSubmit}
              disabled={password.length === 0 || unlocked}
              className={cn(
                'flex-1 py-3 rounded-xl font-medium transition-all duration-300',
                'flex items-center justify-center gap-2',
                unlocked
                  ? 'bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)]'
                  : password.length === 0
                    ? theme === 'dark'
                      ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
              )}
              whileHover={password.length > 0 && !unlocked ? { scale: 1.02 } : {}}
              whileTap={password.length > 0 && !unlocked ? { scale: 0.98 } : {}}
            >
              {unlocked ? (
                <>
                  <Zap className="w-5 h-5" />
                  {isZh ? '验证成功！进入中...' : 'Access Granted! Entering...'}
                </>
              ) : (
                <>
                  {isZh ? '验证密码' : 'Verify'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* 提示文字 */}
        <motion.p
          className={cn(
            'text-center text-xs mt-6',
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          )}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {isZh
            ? '💡 提示：观察滑块上的绿色标记，那是正确角度的位置'
            : '💡 Hint: Look for the green markers on the sliders - they indicate the correct angles'}
        </motion.p>
      </motion.div>

      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default PuzzleGate
