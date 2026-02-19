/**
 * LensNavigator - 镜头转盘导航组件
 *
 * 模拟显微镜物镜转盘或相机滤镜轮的交互方式
 * 用于在 PSRT 四个阶段之间切换
 *
 * 交互方式：
 * - 拖动旋转：用户可以拖动转盘旋转
 * - 点击切换：点击特定槽位直接切换
 * - 弹簧动画：使用 framer-motion 的弹簧物理效果
 */

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion'
import { Eye, Scroll, FlaskConical, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

// PSRT 模式类型
export type PSRTMode = 'phenomenon' | 'story' | 'reasoning' | 'theory'

// 槽位配置
interface SlotConfig {
  id: PSRTMode
  label: string
  shortLabel: string
  icon: React.ReactNode
  color: string
  gradient: string
  description: string
}

const SLOTS: SlotConfig[] = [
  {
    id: 'phenomenon',
    label: 'Phenomenon',
    shortLabel: 'P',
    icon: <Eye className="w-5 h-5" />,
    color: '#f59e0b', // amber
    gradient: 'from-amber-500 to-orange-600',
    description: '观察现象',
  },
  {
    id: 'story',
    label: 'Story',
    shortLabel: 'S',
    icon: <Scroll className="w-5 h-5" />,
    color: '#8b5cf6', // violet
    gradient: 'from-violet-500 to-purple-600',
    description: '探索历史',
  },
  {
    id: 'reasoning',
    label: 'Reasoning',
    shortLabel: 'R',
    icon: <FlaskConical className="w-5 h-5" />,
    color: '#06b6d4', // cyan
    gradient: 'from-cyan-500 to-teal-600',
    description: '实验推理',
  },
  {
    id: 'theory',
    label: 'Theory',
    shortLabel: 'T',
    icon: <Award className="w-5 h-5" />,
    color: '#22c55e', // green
    gradient: 'from-green-500 to-emerald-600',
    description: '掌握理论',
  },
]

interface LensNavigatorProps {
  /** 当前激活的模式 */
  activeMode: PSRTMode
  /** 模式切换回调 */
  onModeChange: (mode: PSRTMode) => void
  /** 主题 */
  theme?: 'dark' | 'light'
  /** 是否显示在底部（默认）还是侧边 */
  position?: 'bottom' | 'right'
  /** 转盘半径 */
  radius?: number
  /** 是否显示标签 */
  showLabels?: boolean
  /** 是否启用触觉反馈 */
  enableHaptic?: boolean
  /** 点击音效回调（可选） */
  onClickSound?: () => void
  /** 自定义类名 */
  className?: string
}

export function LensNavigator({
  activeMode,
  onModeChange,
  theme = 'dark',
  position = 'bottom',
  radius = 120,
  showLabels = true,
  enableHaptic = true,
  onClickSound,
  className,
}: LensNavigatorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lastSnapIndex, setLastSnapIndex] = useState(() =>
    SLOTS.findIndex(s => s.id === activeMode)
  )

  // 每个槽位之间的角度（90度）
  const anglePerSlot = 360 / SLOTS.length

  // 当前激活槽位的索引
  const activeIndex = useMemo(
    () => SLOTS.findIndex(s => s.id === activeMode),
    [activeMode]
  )

  // 旋转角度（motion value）
  const rawRotation = useMotionValue(activeIndex * -anglePerSlot)

  // 弹簧动画配置
  const springConfig = { stiffness: 300, damping: 30, mass: 1 }
  const rotation = useSpring(rawRotation, springConfig)

  // 计算每个槽位的变换
  const getSlotTransform = useCallback(
    (index: number) => {
      const angle = index * anglePerSlot
      const rad = (angle * Math.PI) / 180
      // 槽位在转盘边缘的位置
      const x = Math.sin(rad) * radius
      const y = -Math.cos(rad) * radius
      return { x, y, angle }
    },
    [anglePerSlot, radius]
  )

  // 触发触觉反馈
  const triggerHaptic = useCallback(() => {
    if (!enableHaptic) return
    // 使用 Vibration API（如果可用）
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }, [enableHaptic])

  // 播放点击音效
  const playClickSound = useCallback(() => {
    if (onClickSound) {
      onClickSound()
    }
    // 可选：使用 Web Audio API 生成简单的点击音
    // 这里提供一个结构，实际音效可以后续添加
  }, [onClickSound])

  // 处理拖动
  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const sensitivity = 0.5
      const delta = position === 'bottom' ? -info.delta.x : info.delta.y
      rawRotation.set(rawRotation.get() + delta * sensitivity)
    },
    [rawRotation, position]
  )

  // 处理拖动结束 - 吸附到最近的槽位
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)

    const currentRotation = rawRotation.get()
    // 计算最近的槽位
    const normalizedRotation = ((currentRotation % 360) + 360) % 360
    const closestIndex = Math.round(normalizedRotation / anglePerSlot) % SLOTS.length
    const targetIndex = (SLOTS.length - closestIndex) % SLOTS.length

    // 吸附到最近的槽位
    const targetRotation = -targetIndex * anglePerSlot

    // 处理环绕
    let finalRotation = targetRotation
    const diff = targetRotation - currentRotation
    if (Math.abs(diff) > 180) {
      finalRotation = targetRotation + (diff > 0 ? -360 : 360)
    }

    rawRotation.set(finalRotation)

    // 如果槽位改变了，触发回调
    if (targetIndex !== lastSnapIndex) {
      triggerHaptic()
      playClickSound()
      setLastSnapIndex(targetIndex)
      onModeChange(SLOTS[targetIndex].id)
    }
  }, [rawRotation, anglePerSlot, lastSnapIndex, triggerHaptic, playClickSound, onModeChange])

  // 点击槽位
  const handleSlotClick = useCallback(
    (index: number) => {
      if (isDragging) return

      const targetRotation = -index * anglePerSlot
      rawRotation.set(targetRotation)

      if (index !== activeIndex) {
        triggerHaptic()
        playClickSound()
        setLastSnapIndex(index)
        onModeChange(SLOTS[index].id)
      }
    },
    [isDragging, anglePerSlot, rawRotation, activeIndex, triggerHaptic, playClickSound, onModeChange]
  )

  // 同步外部 activeMode 变化
  useEffect(() => {
    const newIndex = SLOTS.findIndex(s => s.id === activeMode)
    if (newIndex !== -1 && newIndex !== lastSnapIndex) {
      rawRotation.set(-newIndex * anglePerSlot)
      setLastSnapIndex(newIndex)
    }
  }, [activeMode, anglePerSlot, lastSnapIndex, rawRotation])

  // 当前激活的槽位配置
  const activeSlot = SLOTS[activeIndex]

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative select-none touch-none',
        position === 'bottom' ? 'w-full' : 'h-full',
        className
      )}
    >
      {/* 转盘容器 */}
      <div
        className={cn(
          'relative overflow-hidden',
          position === 'bottom'
            ? 'h-32 flex justify-center'
            : 'w-32 h-full flex items-center'
        )}
        style={{
          clipPath:
            position === 'bottom'
              ? `inset(0 0 ${radius - 80}px 0)`
              : `inset(0 ${radius - 80}px 0 0)`,
        }}
      >
        {/* 背景光晕 */}
        <motion.div
          className="absolute rounded-full blur-xl"
          style={{
            width: radius * 1.5,
            height: radius * 1.5,
            background: `radial-gradient(circle, ${activeSlot.color}30, transparent 70%)`,
          }}
          animate={{
            opacity: isDragging ? 0.8 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* 转盘主体 */}
        <motion.div
          className={cn(
            'absolute cursor-grab active:cursor-grabbing',
            position === 'bottom' ? 'top-16' : 'left-16'
          )}
          style={{
            width: radius * 2,
            height: radius * 2,
            rotate: rotation,
          }}
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0}
          onDragStart={() => setIsDragging(true)}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          {/* 转盘背景圆环 */}
          <div
            className={cn(
              'absolute inset-0 rounded-full border-4',
              theme === 'dark'
                ? 'border-slate-700/50 bg-slate-800/80'
                : 'border-gray-300 bg-white/80'
            )}
            style={{
              boxShadow:
                theme === 'dark'
                  ? 'inset 0 2px 10px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)'
                  : 'inset 0 2px 10px rgba(0,0,0,0.1), 0 4px 20px rgba(0,0,0,0.1)',
            }}
          />

          {/* 中心轴承 */}
          <div
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-12 h-12 rounded-full border-2',
              theme === 'dark'
                ? 'border-slate-600 bg-slate-700'
                : 'border-gray-400 bg-gray-200'
            )}
            style={{
              boxShadow:
                theme === 'dark'
                  ? 'inset 0 2px 5px rgba(0,0,0,0.5)'
                  : 'inset 0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            {/* 轴承刻痕 */}
            {[0, 45, 90, 135].map(angle => (
              <div
                key={angle}
                className={cn(
                  'absolute left-1/2 top-1/2 w-full h-0.5 -translate-x-1/2 -translate-y-1/2',
                  theme === 'dark' ? 'bg-slate-500' : 'bg-gray-300'
                )}
                style={{ rotate: `${angle}deg` }}
              />
            ))}
          </div>

          {/* 槽位 */}
          {SLOTS.map((slot, index) => {
            const { x, y, angle } = getSlotTransform(index)
            const isActive = index === activeIndex

            return (
              <motion.button
                key={slot.id}
                className={cn(
                  'absolute flex items-center justify-center',
                  'rounded-full border-2 transition-all duration-200',
                  isActive
                    ? 'scale-110 z-10'
                    : 'scale-100 hover:scale-105'
                )}
                style={{
                  width: 48,
                  height: 48,
                  left: radius + x - 24,
                  top: radius + y - 24,
                  rotate: `${-angle}deg`, // 反向旋转保持图标正向
                  backgroundColor: isActive
                    ? slot.color
                    : theme === 'dark'
                    ? 'rgba(30, 41, 59, 0.9)'
                    : 'rgba(255, 255, 255, 0.9)',
                  borderColor: isActive
                    ? slot.color
                    : theme === 'dark'
                    ? 'rgba(71, 85, 105, 0.5)'
                    : 'rgba(156, 163, 175, 0.5)',
                  boxShadow: isActive
                    ? `0 0 20px ${slot.color}60, inset 0 2px 4px rgba(255,255,255,0.2)`
                    : 'none',
                  color: isActive
                    ? 'white'
                    : theme === 'dark'
                    ? slot.color
                    : slot.color,
                }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  handleSlotClick(index)
                }}
                whileHover={{ scale: isActive ? 1.1 : 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* 槽位内容需要反向旋转来抵消转盘旋转 */}
                <motion.div
                  style={{
                    rotate: useTransform(rotation, (r: number) => -r),
                  }}
                  className="flex flex-col items-center justify-center"
                >
                  {slot.icon}
                  {showLabels && (
                    <span className="text-[10px] font-bold mt-0.5">
                      {slot.shortLabel}
                    </span>
                  )}
                </motion.div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      {/* 激活指示器（三角形） */}
      <div
        className={cn(
          'absolute',
          position === 'bottom'
            ? 'top-0 left-1/2 -translate-x-1/2'
            : 'left-0 top-1/2 -translate-y-1/2'
        )}
      >
        <motion.div
          className="relative"
          animate={{
            y: isDragging ? -2 : 0,
          }}
        >
          <svg
            width="24"
            height="16"
            viewBox="0 0 24 16"
            className={cn(
              position === 'bottom' ? '' : 'rotate-90'
            )}
          >
            <path
              d="M12 14L2 2h20L12 14z"
              fill={activeSlot.color}
              stroke={theme === 'dark' ? '#1e293b' : '#fff'}
              strokeWidth="2"
            />
          </svg>
        </motion.div>
      </div>

      {/* 当前模式信息面板 */}
      <motion.div
        className={cn(
          'absolute flex items-center gap-3 px-4 py-2 rounded-full',
          theme === 'dark'
            ? 'bg-slate-800/90 border border-slate-700'
            : 'bg-white/90 border border-gray-200 shadow-md',
          position === 'bottom'
            ? 'top-2 left-1/2 -translate-x-1/2'
            : 'top-1/2 left-36 -translate-y-1/2'
        )}
        animate={{
          borderColor: activeSlot.color + '50',
          boxShadow: `0 0 20px ${activeSlot.color}20`,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* 模式图标 */}
        <motion.div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            `bg-gradient-to-br ${activeSlot.gradient}`
          )}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ color: 'white' }}
        >
          {activeSlot.icon}
        </motion.div>

        {/* 模式标签 */}
        <div className="flex flex-col">
          <span
            className="text-sm font-bold"
            style={{ color: activeSlot.color }}
          >
            {activeSlot.label}
          </span>
          <span
            className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}
          >
            {activeSlot.description}
          </span>
        </div>

        {/* 进度指示点 */}
        <div className="flex gap-1.5 ml-2">
          {SLOTS.map((slot, i) => (
            <motion.div
              key={slot.id}
              className="w-2 h-2 rounded-full cursor-pointer"
              style={{
                backgroundColor:
                  i <= activeIndex
                    ? SLOTS[i].color
                    : theme === 'dark'
                    ? '#475569'
                    : '#d1d5db',
              }}
              whileHover={{ scale: 1.3 }}
              onClick={() => handleSlotClick(i)}
            />
          ))}
        </div>
      </motion.div>

      {/* 拖动提示 */}
      {!isDragging && (
        <motion.div
          className={cn(
            'absolute text-xs',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
            position === 'bottom'
              ? 'bottom-2 left-1/2 -translate-x-1/2'
              : 'bottom-4 left-1/2 -translate-x-1/2'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ← 拖动或点击切换 →
        </motion.div>
      )}
    </div>
  )
}

// 简化版本：仅显示当前模式的紧凑导航
export function CompactLensNavigator({
  activeMode,
  onModeChange,
  theme = 'dark',
  className,
}: Pick<LensNavigatorProps, 'activeMode' | 'onModeChange' | 'theme' | 'className'>) {
  const activeIndex = SLOTS.findIndex(s => s.id === activeMode)
  const activeSlot = SLOTS[activeIndex]

  const handlePrev = useCallback(() => {
    const newIndex = (activeIndex - 1 + SLOTS.length) % SLOTS.length
    onModeChange(SLOTS[newIndex].id)
  }, [activeIndex, onModeChange])

  const handleNext = useCallback(() => {
    const newIndex = (activeIndex + 1) % SLOTS.length
    onModeChange(SLOTS[newIndex].id)
  }, [activeIndex, onModeChange])

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 rounded-full',
        theme === 'dark'
          ? 'bg-slate-800/80 border border-slate-700'
          : 'bg-white/80 border border-gray-200 shadow-sm',
        className
      )}
    >
      {/* 上一个按钮 */}
      <button
        onClick={handlePrev}
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
          theme === 'dark'
            ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
        )}
      >
        ‹
      </button>

      {/* 槽位列表 */}
      <div className="flex items-center gap-1">
        {SLOTS.map((slot, index) => {
          const isActive = index === activeIndex
          return (
            <motion.button
              key={slot.id}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                isActive ? 'scale-110' : 'scale-100 opacity-60 hover:opacity-100'
              )}
              style={{
                backgroundColor: isActive ? slot.color : 'transparent',
                color: isActive
                  ? 'white'
                  : theme === 'dark'
                  ? slot.color
                  : slot.color,
              }}
              onClick={() => onModeChange(slot.id)}
              whileHover={{ scale: isActive ? 1.1 : 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              {slot.icon}
            </motion.button>
          )
        })}
      </div>

      {/* 下一个按钮 */}
      <button
        onClick={handleNext}
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
          theme === 'dark'
            ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
        )}
      >
        ›
      </button>

      {/* 当前模式标签 */}
      <motion.div
        className={cn(
          'px-3 py-1 rounded-full text-sm font-medium',
          `bg-gradient-to-r ${activeSlot.gradient} text-white`
        )}
        layout
      >
        {activeSlot.shortLabel}: {activeSlot.description}
      </motion.div>
    </div>
  )
}

export default LensNavigator
