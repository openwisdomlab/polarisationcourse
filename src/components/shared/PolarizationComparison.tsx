/**
 * PolarizationComparison - 偏振光对比展示组件 (增强版)
 * 用于首页展示非偏振光和偏振光的区别
 * 包含：互动演示、生活应用、类比解释
 */
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  Sun,
  Glasses,
  Monitor,
  Camera,
  Microscope,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Info,
  Lightbulb,
  ChevronRight,
  Waves,
  Eye,
} from 'lucide-react'

// ============================================================================
// 电场矢量组件
// ============================================================================
function EFieldVector({
  angle,
  length,
  color,
  animate = true,
  delay = 0,
  opacity = 1,
}: {
  angle: number
  length: number
  color: string
  animate?: boolean
  delay?: number
  opacity?: number
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 origin-center"
      style={{
        width: length * 2,
        height: 3,
        marginLeft: -length,
        marginTop: -1.5,
        rotate: angle,
        opacity,
      }}
      initial={{ scaleX: 0 }}
      animate={animate ? {
        scaleX: [0, 1, 0, -1, 0],
      } : { scaleX: 1 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      {/* 箭头 */}
      <motion.div
        className="absolute right-0 top-1/2"
        style={{
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: `8px solid ${color}`,
          marginTop: -5,
          marginRight: -4,
        }}
        animate={animate ? {
          opacity: [0, 1, 0, 0, 0],
        } : { opacity: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

// ============================================================================
// 互动偏振片模拟器
// ============================================================================
interface InteractivePolarizerProps {
  theme: 'dark' | 'light'
  isZh: boolean
}

function InteractivePolarizer({ theme, isZh }: InteractivePolarizerProps) {
  const [polarizerAngle, setPolarizerAngle] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [lightIntensity, setLightIntensity] = useState(100)

  // 计算马吕斯定律下的透射强度
  const calculateIntensity = useCallback((angle: number) => {
    // I = I₀ × cos²(θ)
    const rad = (angle * Math.PI) / 180
    return Math.round(100 * Math.cos(rad) ** 2)
  }, [])

  useEffect(() => {
    setLightIntensity(calculateIntensity(polarizerAngle))
  }, [polarizerAngle, calculateIntensity])

  // 自动旋转
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setPolarizerAngle(prev => (prev + 5) % 360)
    }, 100)
    return () => clearInterval(interval)
  }, [isPlaying])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPolarizerAngle(Number(e.target.value))
    setIsPlaying(false)
  }

  return (
    <div className={cn(
      'rounded-2xl border p-5',
      theme === 'dark'
        ? 'bg-gradient-to-br from-cyan-900/20 via-slate-800/80 to-violet-900/20 border-cyan-500/30'
        : 'bg-gradient-to-br from-cyan-50 via-white to-violet-50 border-cyan-200'
    )}>
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
          )}>
            <Play className="w-4 h-4 text-cyan-500" />
          </div>
          <div>
            <h4 className={cn(
              'font-semibold text-sm',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '互动实验：旋转偏振片' : 'Interactive: Rotate Polarizer'}
            </h4>
            <p className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '观察马吕斯定律 I = I₀ × cos²θ' : 'Observe Malus\'s Law: I = I₀ × cos²θ'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setPolarizerAngle(0)
              setIsPlaying(false)
            }}
            className={cn(
              'p-2 rounded-lg transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 可视化区域 */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* 光源 → 偏振片 → 检测器 */}
        <div className="flex-1 flex items-center justify-center gap-4">
          {/* 光源 */}
          <div className="flex flex-col items-center gap-1">
            <motion.div
              className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(250, 204, 21, 0.5)',
                  '0 0 40px rgba(250, 204, 21, 0.8)',
                  '0 0 20px rgba(250, 204, 21, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sun className="w-6 h-6 text-yellow-900" />
            </motion.div>
            <span className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '光源' : 'Light'}
            </span>
          </div>

          {/* 光线 (入射) */}
          <motion.div
            className="w-16 h-2 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #facc15, #22d3ee)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* 偏振片 */}
          <div className="flex flex-col items-center gap-1">
            <motion.div
              className="relative w-16 h-16 rounded-xl border-2 border-cyan-500 overflow-hidden"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))'
                  : 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))'
              }}
            >
              {/* 偏振片栅格线 */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 w-full h-0.5 bg-cyan-500/60"
                  style={{
                    top: `${(i + 1) * 12.5}%`,
                    transformOrigin: 'center',
                  }}
                  animate={{ rotate: polarizerAngle }}
                />
              ))}
              {/* 中心指示器 */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: polarizerAngle }}
              >
                <div className="w-12 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50" />
              </motion.div>
            </motion.div>
            <span className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '偏振片' : 'Polarizer'}
            </span>
          </div>

          {/* 光线 (透射) */}
          <motion.div
            className="w-16 h-2 rounded-full"
            style={{
              background: `linear-gradient(90deg, #22d3ee, transparent)`,
              opacity: lightIntensity / 100,
            }}
            animate={{ opacity: [lightIntensity / 100 * 0.7, lightIntensity / 100, lightIntensity / 100 * 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* 检测器 */}
          <div className="flex flex-col items-center gap-1">
            <motion.div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center border-2',
                theme === 'dark' ? 'border-slate-600' : 'border-gray-300'
              )}
              style={{
                background: `rgba(34, 211, 238, ${lightIntensity / 100 * 0.8})`,
                boxShadow: `0 0 ${lightIntensity / 5}px rgba(34, 211, 238, ${lightIntensity / 100})`,
              }}
            >
              <Eye className="w-5 h-5" style={{ opacity: Math.max(0.3, lightIntensity / 100) }} />
            </motion.div>
            <span className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '检测' : 'Detect'}
            </span>
          </div>
        </div>

        {/* 控制和数据 */}
        <div className={cn(
          'w-full md:w-48 p-4 rounded-xl',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
        )}>
          {/* 角度控制 */}
          <div className="mb-4">
            <label className={cn(
              'text-xs font-medium block mb-2',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            )}>
              {isZh ? '偏振片角度' : 'Polarizer Angle'}
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={polarizerAngle}
              onChange={handleSliderChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(90deg, #334155, #22d3ee)'
                  : 'linear-gradient(90deg, #e5e7eb, #22d3ee)'
              }}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>0°</span>
              <span className="text-cyan-500 font-mono font-bold">{polarizerAngle}°</span>
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>360°</span>
            </div>
          </div>

          {/* 强度显示 */}
          <div className={cn(
            'p-3 rounded-lg text-center',
            theme === 'dark' ? 'bg-slate-700/50' : 'bg-white'
          )}>
            <div className={cn(
              'text-xs mb-1',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '透射强度' : 'Transmitted Intensity'}
            </div>
            <motion.div
              className="text-2xl font-bold text-cyan-500"
              key={lightIntensity}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {lightIntensity}%
            </motion.div>
            <div className={cn(
              'text-[10px] mt-1 font-mono',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              I = I₀ × cos²({polarizerAngle}°)
            </div>
          </div>
        </div>
      </div>

      {/* 提示 */}
      <div className={cn(
        'mt-4 p-3 rounded-lg flex items-start gap-2',
        theme === 'dark' ? 'bg-cyan-900/20' : 'bg-cyan-50'
      )}>
        <Info className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
        <p className={cn(
          'text-xs',
          theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'
        )}>
          {isZh
            ? '当偏振片旋转到 90° 或 270° 时，透射强度最低；0° 或 180° 时最高。这就是马吕斯定律！'
            : 'When the polarizer rotates to 90° or 270°, transmission is minimum; at 0° or 180°, it\'s maximum. This is Malus\'s Law!'}
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 生活应用展示卡片
// ============================================================================
interface ApplicationCardProps {
  icon: React.ReactNode
  titleZh: string
  titleEn: string
  descZh: string
  descEn: string
  color: string
  theme: 'dark' | 'light'
  isZh: boolean
  delay: number
}

function ApplicationCard({
  icon,
  titleZh,
  titleEn,
  descZh,
  descEn,
  color,
  theme,
  isZh,
  delay,
}: ApplicationCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn(
        'relative rounded-xl border p-4 cursor-pointer overflow-hidden',
        'transition-all duration-300',
        theme === 'dark'
          ? 'bg-slate-800/60 border-slate-700 hover:border-opacity-80'
          : 'bg-white/80 border-gray-200 hover:border-opacity-80'
      )}
      style={{
        borderColor: isHovered ? color : undefined,
        boxShadow: isHovered ? `0 8px 30px -10px ${color}40` : undefined,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      {/* 背景光效 */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: `radial-gradient(circle at center, ${color}20, transparent 70%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      <div className="relative z-10">
        {/* 图标 */}
        <motion.div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
          style={{ backgroundColor: `${color}20` }}
          animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ color }}>{icon}</div>
        </motion.div>

        {/* 标题 */}
        <h5 className={cn(
          'font-semibold text-sm mb-1',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? titleZh : titleEn}
        </h5>

        {/* 描述 */}
        <p className={cn(
          'text-xs leading-relaxed',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        )}>
          {isZh ? descZh : descEn}
        </p>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 绳子穿过栅栏类比动画
// ============================================================================
function RopeFenceAnalogy({ theme, isZh }: { theme: 'dark' | 'light'; isZh: boolean }) {
  const [isAnimating, setIsAnimating] = useState(true)

  return (
    <div className={cn(
      'rounded-2xl border p-5',
      theme === 'dark'
        ? 'bg-gradient-to-br from-amber-900/20 via-slate-800/80 to-orange-900/20 border-amber-500/30'
        : 'bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-200'
    )}>
      <div className="flex items-center gap-2 mb-4">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
        )}>
          <Lightbulb className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h4 className={cn(
            'font-semibold text-sm',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '形象类比：绳子穿过栅栏' : 'Analogy: Rope Through Fence'}
          </h4>
          <p className={cn(
            'text-xs',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {isZh ? '理解偏振的最简单方式' : 'The simplest way to understand polarization'}
          </p>
        </div>
      </div>

      {/* 动画区域 */}
      <div className="relative h-32 overflow-hidden rounded-xl bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50">
        {/* 栅栏 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-4 -ml-2 flex flex-col justify-center gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-full h-2 rounded-full',
                theme === 'dark' ? 'bg-amber-700' : 'bg-amber-600'
              )}
            />
          ))}
        </div>

        {/* 栅栏标签 */}
        <div className="absolute left-1/2 -ml-12 top-2 text-xs text-amber-500 font-medium">
          {isZh ? '偏振片' : 'Polarizer'}
        </div>

        {/* 绳子 (上下振动 - 可通过) */}
        <motion.div
          className="absolute left-0 right-1/2 top-1/2 h-1 rounded-full origin-right"
          style={{
            background: 'linear-gradient(90deg, transparent, #22c55e)',
          }}
          animate={isAnimating ? {
            scaleY: [1, 3, 1, 3, 1],
            y: [0, -15, 0, 15, 0],
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* 绳子通过后 */}
        <motion.div
          className="absolute left-1/2 right-0 top-1/2 h-1 rounded-full origin-left"
          style={{
            background: 'linear-gradient(90deg, #22c55e, transparent)',
          }}
          animate={isAnimating ? {
            scaleY: [1, 3, 1, 3, 1],
            y: [0, -15, 0, 15, 0],
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* 标签 - 通过 */}
        <div className="absolute right-4 top-1/2 -mt-8">
          <span className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span>✓</span>
            {isZh ? '上下振动通过' : 'Vertical passes'}
          </span>
        </div>

        {/* 水平振动的绳子 (被阻挡) - 下方 */}
        <motion.div
          className="absolute left-0 top-3/4 h-1 rounded-full"
          style={{
            width: '45%',
            background: 'linear-gradient(90deg, transparent, #ef4444)',
          }}
          animate={isAnimating ? {
            scaleX: [1, 1.5, 1, 1.5, 1],
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* 阻挡标记 */}
        <motion.div
          className="absolute left-1/2 top-3/4 -ml-4 -mt-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-red-500 text-lg">✕</span>
        </motion.div>

        {/* 标签 - 阻挡 */}
        <div className="absolute left-4 top-3/4 mt-2">
          <span className="text-xs text-red-400 font-medium flex items-center gap-1">
            <span>✕</span>
            {isZh ? '水平振动被挡' : 'Horizontal blocked'}
          </span>
        </div>
      </div>

      {/* 解释文字 */}
      <div className={cn(
        'mt-4 p-3 rounded-lg',
        theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
      )}>
        <p className={cn(
          'text-xs leading-relaxed',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        )}>
          {isZh
            ? '想象一根绳子穿过栅栏的缝隙：如果绳子上下振动（垂直于栅栏），它可以顺利通过；但如果绳子左右振动（平行于栅栏），就会被挡住。偏振片对光的作用就像栅栏对绳子一样！'
            : 'Imagine a rope passing through fence slats: if the rope vibrates up and down (perpendicular to the slats), it passes through; but if it vibrates left and right (parallel to the slats), it gets blocked. A polarizer acts on light just like the fence acts on the rope!'}
        </p>
      </div>

      {/* 播放控制 */}
      <div className="flex justify-center mt-3">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors',
            theme === 'dark'
              ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          )}
        >
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isAnimating ? (isZh ? '暂停' : 'Pause') : (isZh ? '播放' : 'Play')}
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// 主组件
// ============================================================================
export function PolarizationComparison() {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [polarizationAngle, setPolarizationAngle] = useState(0)
  const [activeTab, setActiveTab] = useState<'comparison' | 'interactive' | 'analogy'>('comparison')

  // 非偏振光的随机角度
  const randomAngles = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350]

  // 自动旋转偏振角度
  useEffect(() => {
    const interval = setInterval(() => {
      setPolarizationAngle(prev => (prev + 15) % 180)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // 生活应用数据
  const applications = [
    {
      icon: <Glasses className="w-5 h-5" />,
      titleZh: '偏光太阳镜',
      titleEn: 'Polarized Sunglasses',
      descZh: '消除眩光，保护眼睛，开车钓鱼必备',
      descEn: 'Eliminate glare, protect eyes, essential for driving and fishing',
      color: '#22c55e',
    },
    {
      icon: <Monitor className="w-5 h-5" />,
      titleZh: 'LCD 显示屏',
      titleEn: 'LCD Displays',
      descZh: '手机、电视、电脑屏幕都依赖偏振光',
      descEn: 'Phones, TVs, and computer screens all rely on polarization',
      color: '#3b82f6',
    },
    {
      icon: <Camera className="w-5 h-5" />,
      titleZh: '摄影滤镜',
      titleEn: 'Photography Filters',
      descZh: '减少反射，增强色彩饱和度',
      descEn: 'Reduce reflections, enhance color saturation',
      color: '#f59e0b',
    },
    {
      icon: <Microscope className="w-5 h-5" />,
      titleZh: '偏光显微镜',
      titleEn: 'Polarizing Microscope',
      descZh: '地质、材料、生物研究的重要工具',
      descEn: 'Essential tool for geology, materials, and biology research',
      color: '#ec4899',
    },
  ]

  return (
    <div className={cn(
      'rounded-3xl border overflow-hidden',
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-800/90 border-slate-700'
        : 'bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 border-gray-200'
    )}>
      {/* 装饰性顶部横条 */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-500" />

      {/* 标题区 */}
      <div className="p-6 pb-4 text-center relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, ${theme === 'dark' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(34, 211, 238, 0.05)'}, transparent)`,
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, ${theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)'}, transparent)`,
            }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Waves className="w-8 h-8 text-cyan-500" />
            </motion.div>
            <h2 className={cn(
              'text-2xl sm:text-3xl font-bold',
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-violet-600 to-amber-600'
            )}>
              {t('home.polarizationDemo.title', '什么是偏振？')}
            </h2>
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-8 h-8 text-violet-500" />
            </motion.div>
          </div>
          <p className={cn(
            'text-sm max-w-2xl mx-auto',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '光是一种电磁波，电场振动的方向决定了偏振状态。让我们通过可视化和互动来理解这个概念！'
              : 'Light is an electromagnetic wave, and the direction of electric field vibration determines its polarization state. Let\'s understand this concept through visualization and interaction!'}
          </p>
        </motion.div>

        {/* 标签切换 */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[
            { id: 'comparison', labelZh: '对比展示', labelEn: 'Comparison', icon: <Eye className="w-4 h-4" /> },
            { id: 'interactive', labelZh: '互动实验', labelEn: 'Interactive', icon: <Play className="w-4 h-4" /> },
            { id: 'analogy', labelZh: '形象类比', labelEn: 'Analogy', icon: <Lightbulb className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.id
                  ? theme === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              {tab.icon}
              {isZh ? tab.labelZh : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-6 pt-2">
        <AnimatePresence mode="wait">
          {/* 对比展示 */}
          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 两面板对比 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* 非偏振光面板 */}
                <div className={cn(
                  'rounded-2xl border p-5',
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-yellow-900/20 via-slate-800/80 to-orange-900/20 border-yellow-500/30'
                    : 'bg-gradient-to-br from-yellow-50 via-white to-orange-50 border-yellow-200'
                )}>
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sun className="w-5 h-5 text-yellow-500" />
                      <h4 className="text-lg font-bold text-yellow-500">
                        {t('demoUi.polarizationIntro.unpolarizedLight', '非偏振光')}
                      </h4>
                    </div>
                    <p className={cn(
                      'text-xs',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      Unpolarized Light
                    </p>
                  </div>

                  {/* 电场矢量可视化 */}
                  <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
                    <div className={cn(
                      'absolute inset-0 rounded-full border-2',
                      theme === 'dark'
                        ? 'border-yellow-500/30 bg-slate-900/50'
                        : 'border-yellow-300 bg-yellow-50/50'
                    )} />

                    <motion.div
                      className="absolute left-1/2 top-1/2 w-5 h-5 rounded-full -ml-2.5 -mt-2.5 bg-yellow-400"
                      animate={{
                        boxShadow: [
                          '0 0 15px #fbbf24',
                          '0 0 30px #fbbf24',
                          '0 0 15px #fbbf24',
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    {randomAngles.map((angle, i) => (
                      <EFieldVector
                        key={i}
                        angle={angle}
                        length={70}
                        color={`hsl(${angle}, 70%, 60%)`}
                        animate={true}
                        delay={i * 0.1}
                        opacity={0.8}
                      />
                    ))}
                  </div>

                  <div className={cn(
                    'text-center p-3 rounded-lg',
                    theme === 'dark' ? 'bg-slate-800/50' : 'bg-yellow-50'
                  )}>
                    <p className={cn(
                      'text-xs',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    )}>
                      {isZh
                        ? '📍 电场在所有方向随机振动'
                        : '📍 Electric field vibrates randomly in all directions'}
                    </p>
                  </div>
                </div>

                {/* 偏振光面板 */}
                <div className={cn(
                  'rounded-2xl border p-5',
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-cyan-900/20 via-slate-800/80 to-blue-900/20 border-cyan-500/30'
                    : 'bg-gradient-to-br from-cyan-50 via-white to-blue-50 border-cyan-200'
                )}>
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-cyan-500" />
                      <h4 className="text-lg font-bold text-cyan-500">
                        {t('demoUi.polarizationIntro.polarizedLight', '偏振光')}
                      </h4>
                    </div>
                    <p className={cn(
                      'text-xs',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      Polarized Light
                    </p>
                  </div>

                  {/* 电场矢量可视化 */}
                  <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
                    <div className={cn(
                      'absolute inset-0 rounded-full border-2',
                      theme === 'dark'
                        ? 'border-cyan-500/30 bg-slate-900/50'
                        : 'border-cyan-300 bg-cyan-50/50'
                    )} />

                    <motion.div
                      className="absolute left-1/2 top-1/2 w-5 h-5 rounded-full -ml-2.5 -mt-2.5 bg-cyan-400"
                      animate={{
                        boxShadow: [
                          '0 0 15px #22d3ee',
                          '0 0 30px #22d3ee',
                          '0 0 15px #22d3ee',
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    <EFieldVector
                      angle={polarizationAngle}
                      length={85}
                      color="#22d3ee"
                      animate={true}
                    />

                    <motion.div
                      className={cn(
                        'absolute left-1/2 top-1/2 w-[180px] h-[1px] -ml-[90px] border-t-2 border-dashed',
                        theme === 'dark' ? 'border-cyan-500/30' : 'border-cyan-400/30'
                      )}
                      style={{ rotate: polarizationAngle }}
                    />
                  </div>

                  <div className={cn(
                    'text-center p-3 rounded-lg',
                    theme === 'dark' ? 'bg-slate-800/50' : 'bg-cyan-50'
                  )}>
                    <p className={cn(
                      'text-xs mb-2',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    )}>
                      {isZh
                        ? '📍 电场只在单一方向振动'
                        : '📍 Electric field vibrates in a single direction'}
                    </p>
                    <motion.div
                      className="text-cyan-500 font-mono text-sm font-bold"
                      key={polarizationAngle}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      θ = {polarizationAngle}°
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* 关键概念总结 */}
              <div className={cn(
                'p-4 rounded-xl',
                theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
              )}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      <span className="text-yellow-500 font-medium">{isZh ? '非偏振光' : 'Unpolarized'}</span>
                      {isZh ? ' = 电场方向随机' : ' = Random E-field direction'}
                    </span>
                  </div>
                  <div className={cn(
                    'hidden sm:block w-px h-6',
                    theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                  )} />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      <span className="text-cyan-500 font-medium">{isZh ? '偏振光' : 'Polarized'}</span>
                      {isZh ? ' = 电场方向确定' : ' = Fixed E-field direction'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 互动实验 */}
          {activeTab === 'interactive' && (
            <motion.div
              key="interactive"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <InteractivePolarizer theme={theme} isZh={isZh} />
            </motion.div>
          )}

          {/* 形象类比 */}
          {activeTab === 'analogy' && (
            <motion.div
              key="analogy"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <RopeFenceAnalogy theme={theme} isZh={isZh} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 生活应用区 */}
      <div className={cn(
        'p-6 border-t',
        theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50/50'
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <h3 className={cn(
              'font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '偏振光在生活中的应用' : 'Polarization in Daily Life'}
            </h3>
          </div>
          <Link
            to="/applications"
            className={cn(
              'flex items-center gap-1 text-sm font-medium transition-colors',
              theme === 'dark'
                ? 'text-cyan-400 hover:text-cyan-300'
                : 'text-cyan-600 hover:text-cyan-700'
            )}
          >
            {isZh ? '查看更多' : 'See more'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {applications.map((app, index) => (
            <ApplicationCard
              key={app.titleEn}
              {...app}
              theme={theme}
              isZh={isZh}
              delay={index}
            />
          ))}
        </div>
      </div>

      {/* 底部 CTA */}
      <div className={cn(
        'p-6 text-center border-t',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <p className={cn(
          'text-sm mb-4',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        )}>
          {isZh
            ? '想深入了解偏振光的奥秘？探索我们的互动演示！'
            : 'Want to dive deeper into the mysteries of polarization? Explore our interactive demos!'}
        </p>
        <Link
          to="/demos"
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold',
            'bg-gradient-to-r from-cyan-500 to-violet-500 text-white',
            'hover:from-cyan-600 hover:to-violet-600 transition-all',
            'shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
          )}
        >
          <Play className="w-5 h-5" />
          {isZh ? '开始探索偏振世界' : 'Start Exploring Polarization'}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}

export default PolarizationComparison
