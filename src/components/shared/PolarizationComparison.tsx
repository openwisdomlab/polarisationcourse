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
  Play,
  Pause,
  RotateCcw,
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
// 互动偏振片模拟器 - 增强版双偏振片演示
// ============================================================================
interface InteractivePolarizerProps {
  theme: 'dark' | 'light'
  isZh: boolean
}

function InteractivePolarizer({ theme, isZh }: InteractivePolarizerProps) {
  const [analyzerAngle, setAnalyzerAngle] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // 计算马吕斯定律下的透射强度
  const lightIntensity = Math.round(100 * Math.cos((analyzerAngle * Math.PI) / 180) ** 2)

  // 自动旋转
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setAnalyzerAngle(prev => (prev + 3) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [isPlaying])

  // 圆形拖拽角度控制
  const handleDrag = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const angle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI + 90
    setAnalyzerAngle((angle + 360) % 360)
    setIsPlaying(false)
  }, [isDragging])

  // 快捷角度按钮
  const presetAngles = [
    { angle: 0, label: '0°', color: 'text-green-500' },
    { angle: 45, label: '45°', color: 'text-yellow-500' },
    { angle: 90, label: '90°', color: 'text-red-500' },
  ]

  return (
    <div className={cn(
      'rounded-2xl border p-5',
      theme === 'dark'
        ? 'bg-gradient-to-br from-cyan-900/20 via-slate-800/80 to-violet-900/20 border-cyan-500/30'
        : 'bg-gradient-to-br from-cyan-50 via-white to-violet-50 border-cyan-200'
    )}>
      {/* 可视化区域 - 光学路径 */}
      <div className="relative">
        {/* 主演示区 */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-4">
          {/* 光源 */}
          <div className="flex flex-col items-center gap-1">
            <motion.div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(250, 204, 21, 0.4)',
                  '0 0 35px rgba(250, 204, 21, 0.7)',
                  '0 0 20px rgba(250, 204, 21, 0.4)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sun className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-900" />
            </motion.div>
            <span className={cn(
              'text-[10px] sm:text-xs font-medium',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '自然光' : 'Natural Light'}
            </span>
          </div>

          {/* 光线 (入射 - 非偏振) */}
          <div className="relative w-8 sm:w-12 h-4 flex items-center">
            {/* 多彩光线表示非偏振 */}
            {[0, 45, 90, 135].map((rot, i) => (
              <motion.div
                key={rot}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent, hsl(${rot * 2}, 70%, 60%), transparent)`,
                  height: 2,
                  top: '50%',
                  marginTop: -1,
                }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>

          {/* 第一偏振片 (固定0°) */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 overflow-hidden',
                theme === 'dark' ? 'border-violet-500/70 bg-violet-900/30' : 'border-violet-400 bg-violet-50'
              )}
            >
              {/* 固定垂直栅格线 */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'absolute h-full w-0.5',
                    theme === 'dark' ? 'bg-violet-400/60' : 'bg-violet-500/50'
                  )}
                  style={{ left: `${(i + 1) * 14}%` }}
                />
              ))}
              <div className={cn(
                'absolute inset-0 flex items-center justify-center text-[8px] font-bold',
                theme === 'dark' ? 'text-violet-300' : 'text-violet-600'
              )}>
                P1
              </div>
            </div>
            <span className={cn(
              'text-[10px] sm:text-xs font-medium',
              theme === 'dark' ? 'text-violet-400' : 'text-violet-600'
            )}>
              {isZh ? '起偏器' : 'Polarizer'}
            </span>
          </div>

          {/* 偏振光 (竖直偏振) */}
          <div className="relative w-8 sm:w-12 h-4 flex items-center">
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, #8b5cf6, #22d3ee)',
                height: 3,
                top: '50%',
                marginTop: -1.5,
                borderRadius: 2,
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                boxShadow: ['0 0 4px #8b5cf6', '0 0 10px #22d3ee', '0 0 4px #8b5cf6'],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          {/* 第二偏振片 (可旋转分析器) - 交互式 */}
          <div className="flex flex-col items-center gap-1">
            <motion.div
              className={cn(
                'relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 cursor-grab active:cursor-grabbing',
                theme === 'dark'
                  ? 'border-cyan-500 bg-gradient-to-br from-slate-800 to-slate-900'
                  : 'border-cyan-500 bg-gradient-to-br from-white to-gray-50',
                isDragging && 'ring-4 ring-cyan-500/30'
              )}
              style={{ touchAction: 'none' }}
              onMouseDown={() => { setIsDragging(true); setIsPlaying(false) }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleDrag}
              onTouchStart={() => { setIsDragging(true); setIsPlaying(false) }}
              onTouchEnd={() => setIsDragging(false)}
              onTouchMove={handleDrag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 旋转的栅格线 */}
              <motion.div
                className="absolute inset-2"
                animate={{ rotate: analyzerAngle }}
              >
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'absolute h-full w-0.5 left-1/2 -ml-0.5',
                      theme === 'dark' ? 'bg-cyan-400/60' : 'bg-cyan-500/50'
                    )}
                    style={{ transform: `translateX(${(i - 3) * 4}px)` }}
                  />
                ))}
              </motion.div>
              {/* 角度指示箭头 */}
              <motion.div
                className="absolute inset-0 flex items-start justify-center"
                animate={{ rotate: analyzerAngle }}
              >
                <div
                  className={cn(
                    'w-1 h-5 rounded-full -mt-1',
                    theme === 'dark' ? 'bg-cyan-400' : 'bg-cyan-600'
                  )}
                />
              </motion.div>
              {/* 中心标签 */}
              <div className={cn(
                'absolute inset-0 flex items-center justify-center text-[8px] font-bold',
                theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'
              )}>
                P2
              </div>
              {/* 拖拽提示 */}
              <motion.div
                className={cn(
                  'absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] whitespace-nowrap px-1.5 py-0.5 rounded',
                  theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
                )}
                animate={{ opacity: isDragging ? 0 : [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isZh ? '拖动旋转' : 'Drag'}
              </motion.div>
            </motion.div>
            <span className={cn(
              'text-[10px] sm:text-xs font-medium',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )}>
              {isZh ? '检偏器' : 'Analyzer'}
            </span>
          </div>

          {/* 透射光线 */}
          <div className="relative w-8 sm:w-12 h-4 flex items-center">
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, #22d3ee, transparent)`,
                height: 3,
                top: '50%',
                marginTop: -1.5,
                borderRadius: 2,
                opacity: lightIntensity / 100,
              }}
              animate={{
                opacity: [lightIntensity / 100 * 0.7, lightIntensity / 100, lightIntensity / 100 * 0.7],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          {/* 检测器/屏幕 */}
          <div className="flex flex-col items-center gap-1">
            <motion.div
              className={cn(
                'w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center border-2 transition-all duration-300',
                theme === 'dark' ? 'border-slate-600' : 'border-gray-300'
              )}
              style={{
                background: lightIntensity > 50
                  ? `linear-gradient(135deg, rgba(34, 211, 238, ${lightIntensity / 100 * 0.8}), rgba(139, 92, 246, ${lightIntensity / 100 * 0.5}))`
                  : lightIntensity > 10
                    ? `rgba(34, 211, 238, ${lightIntensity / 100 * 0.5})`
                    : theme === 'dark' ? '#1e293b' : '#f1f5f9',
                boxShadow: lightIntensity > 20
                  ? `0 0 ${lightIntensity / 3}px rgba(34, 211, 238, ${lightIntensity / 100})`
                  : 'none',
              }}
            >
              <Eye
                className={cn(
                  'w-6 h-6 sm:w-7 sm:h-7 transition-all duration-300',
                  lightIntensity > 50 ? 'text-white' : lightIntensity > 10 ? 'text-cyan-400' : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                )}
              />
            </motion.div>
            <span className={cn(
              'text-[10px] sm:text-xs font-medium',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '屏幕' : 'Screen'}
            </span>
          </div>
        </div>

        {/* 强度条和数值 */}
        <div className={cn(
          'mt-4 p-4 rounded-xl',
          theme === 'dark' ? 'bg-slate-800/60' : 'bg-gray-100/80'
        )}>
          <div className="flex items-center gap-4">
            {/* 强度进度条 */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  'text-xs font-medium',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {isZh ? '透射光强' : 'Transmitted Intensity'}
                </span>
                <motion.span
                  className={cn(
                    'text-lg font-bold font-mono',
                    lightIntensity > 70 ? 'text-green-500' :
                    lightIntensity > 30 ? 'text-yellow-500' : 'text-red-500'
                  )}
                  key={lightIntensity}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {lightIntensity}%
                </motion.span>
              </div>
              <div className={cn(
                'h-4 rounded-full overflow-hidden',
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
              )}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: lightIntensity > 70
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                      : lightIntensity > 30
                        ? 'linear-gradient(90deg, #eab308, #facc15)'
                        : 'linear-gradient(90deg, #ef4444, #f87171)',
                  }}
                  initial={false}
                  animate={{ width: `${lightIntensity}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>
            </div>

            {/* 角度显示 */}
            <div className={cn(
              'text-center px-4 py-2 rounded-lg',
              theme === 'dark' ? 'bg-slate-700/50' : 'bg-white'
            )}>
              <div className={cn(
                'text-[10px] mb-0.5',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                {isZh ? '夹角' : 'Angle'}
              </div>
              <div className="text-cyan-500 font-bold font-mono text-lg">
                {Math.round(analyzerAngle % 180)}°
              </div>
            </div>
          </div>

          {/* 公式显示 */}
          <div className={cn(
            'mt-3 text-center text-xs font-mono py-2 rounded-lg',
            theme === 'dark' ? 'bg-slate-900/50 text-gray-400' : 'bg-white text-gray-500'
          )}>
            I = I₀ × cos²({Math.round(analyzerAngle % 180)}°) = I₀ × {(Math.cos((analyzerAngle % 180) * Math.PI / 180) ** 2).toFixed(2)} = <span className="text-cyan-500 font-bold">{lightIntensity}%</span>
          </div>
        </div>

        {/* 快捷按钮和控制 */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {/* 预设角度按钮 */}
          {presetAngles.map(preset => (
            <button
              key={preset.angle}
              onClick={() => { setAnalyzerAngle(preset.angle); setIsPlaying(false) }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                analyzerAngle % 180 === preset.angle
                  ? theme === 'dark'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-cyan-100 border-cyan-400 text-cyan-700'
                  : theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-gray-400 hover:text-white hover:border-slate-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
              )}
            >
              <span className={preset.color}>{preset.label}</span>
              {preset.angle === 0 && <span className="ml-1 opacity-60">({isZh ? '最亮' : 'Max'})</span>}
              {preset.angle === 90 && <span className="ml-1 opacity-60">({isZh ? '全黑' : 'Dark'})</span>}
            </button>
          ))}
          <div className={cn('w-px h-6 mx-1', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')} />
          {/* 播放/暂停按钮 */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              isPlaying
                ? theme === 'dark'
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'bg-violet-100 text-violet-700'
                : theme === 'dark'
                  ? 'bg-slate-800 text-gray-400 hover:text-white'
                  : 'bg-white text-gray-600 hover:text-gray-900'
            )}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isPlaying ? (isZh ? '暂停' : 'Stop') : (isZh ? '自动旋转' : 'Auto')}
          </button>
          {/* 重置按钮 */}
          <button
            onClick={() => { setAnalyzerAngle(0); setIsPlaying(false) }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              theme === 'dark'
                ? 'bg-slate-800 text-gray-400 hover:text-white'
                : 'bg-white text-gray-600 hover:text-gray-900'
            )}
          >
            <RotateCcw className="w-3 h-3" />
            {isZh ? '重置' : 'Reset'}
          </button>
        </div>
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
// 主组件
// ============================================================================
export function PolarizationComparison() {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [polarizationAngle, setPolarizationAngle] = useState(0)
  const [activeTab, setActiveTab] = useState<'comparison' | 'interactive'>('comparison')

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

    </div>
  )
}

export default PolarizationComparison
