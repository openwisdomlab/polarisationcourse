/**
 * VirtualPolarizerLens - 虚拟偏振片镜头组件
 * 模拟偏振滤镜去除反射眩光的效果（如水面反光）
 *
 * 物理原理：
 * - 使用马吕斯定律：I = I₀ × cos²(θ)
 * - 0° 时显示原始图像（全部眩光）
 * - 90° 时显示过滤后图像（无眩光）
 *
 * 交互方式：
 * - 鼠标/触摸移动镜头位置
 * - 滚轮/滑块旋转偏振片角度
 *
 * 游戏化功能：
 * - 任务完成检测（达到目标角度±容差范围）
 * - 成功动画与"查看数学原理"链接
 * - 可选的onTaskComplete回调
 */
import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SliderControl } from '../DemoControls'
import { CheckCircle, ExternalLink, RotateCcw } from 'lucide-react'

// 预设的偏振镜像图组
export interface PolarizerImageSet {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  imageGlare: string
  imageClear: string
  targetAngle: number
  explanation: string
  explanationZh: string
}

// 示例图像集合（用于不同场景）
export const POLARIZER_IMAGE_SETS: PolarizerImageSet[] = [
  {
    id: 'water-reflection',
    name: 'Lake Reflection',
    nameZh: '湖面反射',
    description: 'Reduce glare from water surface to see fish below',
    descriptionZh: '减少水面眩光，看清水下的鱼',
    imageGlare: 'https://placehold.co/800x500/1a365d/ffffff?text=Lake+With+Glare',
    imageClear: 'https://placehold.co/800x500/0d9488/ffffff?text=Clear+View+Below',
    targetAngle: 90,
    explanation: 'Water reflects light that becomes horizontally polarized. A vertical polarizer (90°) blocks this glare.',
    explanationZh: '水面反射的光是水平偏振的，垂直偏振片(90°)可以阻挡这种眩光。'
  },
  {
    id: 'car-window',
    name: 'Car Dashboard',
    nameZh: '汽车仪表盘',
    description: 'Remove dashboard reflection from windshield',
    descriptionZh: '消除挡风玻璃上的仪表盘反射',
    imageGlare: 'https://placehold.co/800x500/334155/ffffff?text=Windshield+Reflection',
    imageClear: 'https://placehold.co/800x500/22c55e/ffffff?text=Clear+Road+View',
    targetAngle: 90,
    explanation: 'Dashboard reflections on windshield are horizontally polarized. Photographers use polarizing filters at ~90° to eliminate them.',
    explanationZh: '仪表盘在挡风玻璃上的反射是水平偏振的。摄影师使用约90°的偏振滤镜来消除它们。'
  },
  {
    id: 'glass-showcase',
    name: 'Glass Showcase',
    nameZh: '玻璃展柜',
    description: 'See through reflective glass display case',
    descriptionZh: '透过反光的玻璃展柜看展品',
    imageGlare: 'https://placehold.co/800x500/64748b/ffffff?text=Glass+Reflection',
    imageClear: 'https://placehold.co/800x500/f59e0b/000000?text=Museum+Artifact',
    targetAngle: 90,
    explanation: 'Museum glass reflects ambient light. Polarizing filters help photographers capture exhibits without reflections.',
    explanationZh: '博物馆玻璃反射环境光。偏振滤镜帮助摄影师拍摄没有反射的展品。'
  }
]

interface VirtualPolarizerLensProps {
  /** 基础图像（有眩光） */
  imageBase: string
  /** 过滤后图像（无眩光） */
  imageFiltered: string
  /** 容器宽度 */
  width?: number | string
  /** 容器高度 */
  height?: number | string
  /** 镜头半径 */
  lensRadius?: number
  /** 初始角度 */
  initialAngle?: number
  /** 是否显示滑块控制 */
  showSlider?: boolean
  /** 是否显示角度指示器 */
  showAngleIndicator?: boolean
  /** 是否显示偏振轴线 */
  showPolarizationAxis?: boolean
  /** 背景暗化程度 (0-1) */
  backgroundDim?: number
  /** 自定义类名 */
  className?: string
  /** === 游戏化功能 === */
  /** 目标角度（达到此角度视为完成任务） */
  targetAngle?: number
  /** 成功容差范围（±度） */
  successTolerance?: number
  /** 任务完成回调 */
  onTaskComplete?: (finalAngle: number) => void
  /** 是否启用游戏化模式 */
  enableGamification?: boolean
  /** 研究链接点击回调 */
  onResearchLinkClick?: () => void
}

export function VirtualPolarizerLens({
  imageBase,
  imageFiltered,
  width = '100%',
  height = 400,
  lensRadius = 80,
  initialAngle = 0,
  showSlider = true,
  showAngleIndicator = true,
  showPolarizationAxis = true,
  backgroundDim = 0.3,
  className,
  // 游戏化功能
  targetAngle = 90,
  successTolerance = 5,
  onTaskComplete,
  enableGamification = false,
  onResearchLinkClick,
}: VirtualPolarizerLensProps) {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  // 状态
  const [angle, setAngle] = useState(initialAngle)
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 })
  const [isLensActive, setIsLensActive] = useState(false)

  // 游戏化状态
  const [showSuccess, setShowSuccess] = useState(false)
  const [taskCompleted, setTaskCompleted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // 使用马吕斯定律计算透射率
  // 0° = 完全显示 imageBase (cos²0° = 1 → glare = 100%)
  // 90° = 完全显示 imageFiltered (cos²90° = 0 → glare = 0%)
  const glareOpacity = useMemo(() => {
    return Math.pow(Math.cos(angle * Math.PI / 180), 2)
  }, [angle])

  // filteredOpacity 是 glareOpacity 的反向
  const filteredOpacity = 1 - glareOpacity

  // 检查是否达到目标角度（游戏化）
  const isAtTarget = useMemo(() => {
    return Math.abs(angle - targetAngle) <= successTolerance
  }, [angle, targetAngle, successTolerance])

  // 游戏化：成功检测
  useEffect(() => {
    if (enableGamification && isAtTarget && !taskCompleted && hasInteracted) {
      setShowSuccess(true)
      setTaskCompleted(true)
      onTaskComplete?.(angle)

      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [enableGamification, isAtTarget, taskCompleted, hasInteracted, angle, onTaskComplete])

  // 重置任务
  const resetTask = useCallback(() => {
    setAngle(initialAngle)
    setTaskCompleted(false)
    setShowSuccess(false)
    setHasInteracted(false)
  }, [initialAngle])

  // 监控容器尺寸并初始化镜头位置
  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        // 初始化镜头位置到中心
        if (!isLensActive) {
          setLensPosition({ x: rect.width / 2, y: rect.height / 2 })
        }
      }
    }

    updateSize()
    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [isLensActive])

  // 处理鼠标移动
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(lensRadius, Math.min(rect.width - lensRadius, e.clientX - rect.left))
    const y = Math.max(lensRadius, Math.min(rect.height - lensRadius, e.clientY - rect.top))
    setLensPosition({ x, y })
    setIsLensActive(true)
    if (!hasInteracted) setHasInteracted(true)
  }, [lensRadius, hasInteracted])

  // 处理触摸移动
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(lensRadius, Math.min(rect.width - lensRadius, touch.clientX - rect.left))
    const y = Math.max(lensRadius, Math.min(rect.height - lensRadius, touch.clientY - rect.top))
    setLensPosition({ x, y })
    setIsLensActive(true)
    if (!hasInteracted) setHasInteracted(true)
  }, [lensRadius, hasInteracted])

  // 处理滚轮旋转
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!hasInteracted) setHasInteracted(true)
    setAngle(prev => {
      const delta = e.deltaY > 0 ? 5 : -5
      let newAngle = prev + delta
      // 限制在 0-90 度范围内
      newAngle = Math.max(0, Math.min(90, newAngle))
      return newAngle
    })
  }, [hasInteracted])

  // 处理鼠标离开
  const handleMouseLeave = useCallback(() => {
    setIsLensActive(false)
  }, [])

  // 计算镜头的 clip-path
  const lensClipPath = useMemo(() => {
    return `circle(${lensRadius}px at ${lensPosition.x}px ${lensPosition.y}px)`
  }, [lensRadius, lensPosition])

  return (
    <div className={cn('space-y-4', className)}>
      {/* 主视觉区域 */}
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden rounded-xl cursor-none select-none',
          theme === 'dark'
            ? 'border border-slate-700/50'
            : 'border border-gray-200 shadow-lg'
        )}
        style={{
          width,
          height,
        }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        {/* 背景图层 - 基础图像（带暗化） */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-200"
          style={{
            backgroundImage: `url(${imageBase})`,
            opacity: 1 - backgroundDim,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
            opacity: backgroundDim,
          }}
        />

        {/* 镜头内部 - 图像混合区域 */}
        <AnimatePresence>
          {isLensActive && (
            <>
              {/* 镜头内的基础图像层 */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage: `url(${imageBase})`,
                  clipPath: lensClipPath,
                  opacity: glareOpacity,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: glareOpacity }}
                transition={{ duration: 0.1 }}
              />

              {/* 镜头内的过滤图像层 */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage: `url(${imageFiltered})`,
                  clipPath: lensClipPath,
                  opacity: filteredOpacity,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: filteredOpacity }}
                transition={{ duration: 0.1 }}
              />

              {/* 镜头边框 */}
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  left: lensPosition.x - lensRadius,
                  top: lensPosition.y - lensRadius,
                  width: lensRadius * 2,
                  height: lensRadius * 2,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* 外环 */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-full border-2',
                    theme === 'dark'
                      ? 'border-cyan-400/70 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                      : 'border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  )}
                />

                {/* 内环装饰 */}
                <div
                  className={cn(
                    'absolute inset-2 rounded-full border',
                    theme === 'dark'
                      ? 'border-cyan-400/30'
                      : 'border-cyan-400/40'
                  )}
                />

                {/* 偏振轴线 */}
                {showPolarizationAxis && (
                  <motion.div
                    className="absolute left-1/2 top-1/2 w-full"
                    style={{
                      height: 2,
                      marginLeft: '-50%',
                      marginTop: -1,
                    }}
                    animate={{ rotate: angle }}
                    transition={{ duration: 0.1 }}
                  >
                    <div
                      className={cn(
                        'w-full h-full rounded-full',
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent'
                          : 'bg-gradient-to-r from-transparent via-purple-500 to-transparent'
                      )}
                    />
                    {/* 轴端点标记 */}
                    <div
                      className={cn(
                        'absolute -left-1 -top-1 w-2 h-2 rounded-full',
                        theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
                      )}
                    />
                    <div
                      className={cn(
                        'absolute -right-1 -top-1 w-2 h-2 rounded-full',
                        theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
                      )}
                    />
                  </motion.div>
                )}

                {/* 角度指示器 */}
                {showAngleIndicator && (
                  <motion.div
                    className={cn(
                      'absolute -bottom-8 left-1/2 -translate-x-1/2',
                      'px-2 py-1 rounded-md text-xs font-mono whitespace-nowrap',
                      theme === 'dark'
                        ? 'bg-slate-800/90 text-cyan-400 border border-cyan-400/30'
                        : 'bg-white/90 text-cyan-600 border border-cyan-200 shadow-sm'
                    )}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    θ = {angle.toFixed(0)}° | I/I₀ = {glareOpacity.toFixed(2)}
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 提示文字 - 无镜头时显示 */}
        {!isLensActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className={cn(
                'px-4 py-2 rounded-lg text-sm',
                theme === 'dark'
                  ? 'bg-slate-800/80 text-gray-300 border border-slate-600/50'
                  : 'bg-white/80 text-gray-600 border border-gray-200'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              移动鼠标/触摸屏幕查看偏振效果
            </motion.div>
          </div>
        )}

        {/* 滚轮提示 */}
        {isLensActive && (
          <motion.div
            className={cn(
              'absolute bottom-3 right-3 px-2 py-1 rounded text-xs',
              theme === 'dark'
                ? 'bg-slate-800/80 text-gray-400 border border-slate-600/50'
                : 'bg-white/80 text-gray-500 border border-gray-200'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            滚轮旋转偏振片
          </motion.div>
        )}

        {/* 游戏化：成功动画 */}
        <AnimatePresence>
          {enableGamification && showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                className={cn(
                  'flex flex-col items-center gap-3 px-8 py-6 rounded-2xl shadow-2xl',
                  theme === 'dark' ? 'bg-green-900/90' : 'bg-green-100/95'
                )}
              >
                <CheckCircle className="w-16 h-16 text-green-500" />
                <span className={cn('text-xl font-bold', theme === 'dark' ? 'text-green-300' : 'text-green-700')}>
                  完美! 🎉
                </span>
                <span className={cn('text-sm', theme === 'dark' ? 'text-green-400' : 'text-green-600')}>
                  在 {Math.round(angle)}° 时消除眩光
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 游戏化：控制按钮 */}
        {enableGamification && (
          <div className="absolute top-3 left-3 flex gap-2">
            <button
              onClick={resetTask}
              className={cn(
                'p-2 rounded-lg transition-colors',
                theme === 'dark'
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-gray-200'
                  : 'bg-white/80 hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              )}
              title="重置"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 游戏化：研究链接（任务完成后显示） */}
        <AnimatePresence>
          {enableGamification && taskCompleted && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={onResearchLinkClick}
              className={cn(
                'absolute bottom-3 left-3 flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                theme === 'dark'
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              )}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm font-medium">查看数学原理</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 控制滑块 */}
      {showSlider && (
        <div
          className={cn(
            'p-4 rounded-xl',
            theme === 'dark'
              ? 'bg-slate-800/70 border border-cyan-400/20'
              : 'bg-white border border-gray-200 shadow-sm'
          )}
        >
          <SliderControl
            label="偏振片角度 θ"
            value={angle}
            min={0}
            max={90}
            step={1}
            unit="°"
            onChange={setAngle}
            color="purple"
          />

          {/* 马吕斯定律实时计算 */}
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <div className="flex justify-between items-center text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                马吕斯定律: I/I₀ = cos²θ
              </span>
              <span className={cn('font-mono', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
                cos²({angle}°) = {glareOpacity.toFixed(3)}
              </span>
            </div>

            {/* 光强条 */}
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className={cn('text-xs w-16', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                  眩光
                </span>
                <div className={cn('flex-1 h-2 rounded-full overflow-hidden', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-400"
                    animate={{ width: `${glareOpacity * 100}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className={cn('text-xs w-12 text-right font-mono', theme === 'dark' ? 'text-orange-400' : 'text-orange-600')}>
                  {(glareOpacity * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-xs w-16', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                  清晰度
                </span>
                <div className={cn('flex-1 h-2 rounded-full overflow-hidden', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-green-400"
                    animate={{ width: `${filteredOpacity * 100}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className={cn('text-xs w-12 text-right font-mono', theme === 'dark' ? 'text-green-400' : 'text-green-600')}>
                  {(filteredOpacity * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* 物理解释 */}
          <div className={cn(
            'mt-3 p-2 rounded-lg text-xs',
            theme === 'dark'
              ? 'bg-purple-500/10 border border-purple-500/20 text-purple-300'
              : 'bg-purple-50 border border-purple-100 text-purple-700'
          )}>
            {angle < 10 && '偏振片与反射光偏振方向平行，眩光完全通过'}
            {angle >= 10 && angle < 40 && '偏振片开始过滤部分反射光，眩光逐渐减弱'}
            {angle >= 40 && angle < 50 && '偏振片与反射光成45°角，过滤一半眩光'}
            {angle >= 50 && angle < 80 && '偏振片接近垂直于反射光偏振方向，大部分眩光被过滤'}
            {angle >= 80 && '偏振片垂直于反射光偏振方向，眩光几乎完全被消除'}
          </div>
        </div>
      )}
    </div>
  )
}

export default VirtualPolarizerLens
