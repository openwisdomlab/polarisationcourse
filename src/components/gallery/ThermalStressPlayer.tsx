/**
 * ThermalStressPlayer - 热应力演变播放器
 *
 * 功能：
 * - 带时间轴的图片序列播放器
 * - 支持播放/暂停和拖动进度条
 * - 关键时间点标注（Tooltip）
 * - 支持视频回退
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SecureImageViewer, SecureVideoPlayer } from '@/components/shared'
import { GLASS_HEATING_SEQUENCE, PolarizationResource } from '@/data/resource-gallery'
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  ImageIcon,
  Thermometer,
  Clock,
  SkipBack,
  SkipForward,
} from 'lucide-react'

interface ThermalStressPlayerProps {
  resource?: PolarizationResource
  className?: string
  autoPlay?: boolean
  showAnnotations?: boolean
}

// Key time point annotations
interface TimeAnnotation {
  time: number
  label: string
  labelZh: string
  description: string
  descriptionZh: string
  color: string
}

const TIME_ANNOTATIONS: TimeAnnotation[] = [
  {
    time: 0,
    label: 'Just Heated',
    labelZh: '刚加热完',
    description: 'Maximum thermal stress visible as bright colors',
    descriptionZh: '热应力最大，显示为明亮的颜色',
    color: '#ef4444', // red
  },
  {
    time: 10,
    label: 'Cooling',
    labelZh: '冷却中',
    description: 'Stress begins to redistribute',
    descriptionZh: '应力开始重新分布',
    color: '#f97316', // orange
  },
  {
    time: 20,
    label: 'Near Equilibrium',
    labelZh: '接近平衡',
    description: 'Stress patterns stabilizing',
    descriptionZh: '应力图案趋于稳定',
    color: '#22c55e', // green
  },
  {
    time: 30,
    label: 'Cooled',
    labelZh: '已冷却',
    description: 'Residual stress remaining',
    descriptionZh: '残余应力保持',
    color: '#3b82f6', // blue
  },
]

export function ThermalStressPlayer({
  resource = GLASS_HEATING_SEQUENCE,
  className,
  autoPlay = false,
  showAnnotations = true,
}: ThermalStressPlayerProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [showVideo, setShowVideo] = useState(false)
  const [hoveredAnnotation, setHoveredAnnotation] = useState<TimeAnnotation | null>(null)
  const [playbackSpeed, setPlaybackSpeed] = useState(1) // 1x, 0.5x, 2x

  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Get frames from resource
  const frames = useMemo(() => {
    return resource.frames || []
  }, [resource])

  // Calculate total timeline duration (in seconds)
  const totalDuration = useMemo(() => {
    if (frames.length === 0) return 0
    return frames[frames.length - 1].time
  }, [frames])

  // Current frame
  const currentFrame = frames[currentFrameIndex]

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 1500 / playbackSpeed) // 1.5 seconds per frame
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [isPlaying, frames.length, playbackSpeed])

  // Handle play/pause toggle
  const togglePlay = useCallback(() => {
    if (currentFrameIndex >= frames.length - 1) {
      setCurrentFrameIndex(0)
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, currentFrameIndex, frames.length])

  // Handle restart
  const handleRestart = useCallback(() => {
    setCurrentFrameIndex(0)
    setIsPlaying(true)
  }, [])

  // Handle timeline click
  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || frames.length === 0) return

    const rect = progressRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width

    // Find closest frame
    const targetTime = percentage * totalDuration
    let closestIndex = 0
    let minDiff = Infinity

    frames.forEach((frame, index) => {
      const diff = Math.abs(frame.time - targetTime)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = index
      }
    })

    setCurrentFrameIndex(closestIndex)
    setIsPlaying(false)
  }, [frames, totalDuration])

  // Step forward/backward
  const stepForward = useCallback(() => {
    setCurrentFrameIndex((prev) => Math.min(frames.length - 1, prev + 1))
    setIsPlaying(false)
  }, [frames.length])

  const stepBackward = useCallback(() => {
    setCurrentFrameIndex((prev) => Math.max(0, prev - 1))
    setIsPlaying(false)
  }, [])

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (frames.length === 0 || !currentFrame) return 0
    return (currentFrame.time / totalDuration) * 100
  }, [currentFrame, totalDuration, frames.length])

  // Get annotation for current frame
  const currentAnnotation = useMemo(() => {
    if (!currentFrame) return null
    return TIME_ANNOTATIONS.find((a) => a.time === currentFrame.time)
  }, [currentFrame])

  if (frames.length === 0) {
    return (
      <div className={cn(
        'rounded-xl p-8 text-center',
        theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100',
        className
      )}>
        <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
          {isZh ? '无可用帧' : 'No frames available'}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className={cn('w-5 h-5', theme === 'dark' ? 'text-orange-400' : 'text-orange-600')} />
          <h3 className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? resource.titleZh : resource.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle video/images */}
          {resource.metadata.hasVideo && (
            <button
              onClick={() => setShowVideo(!showVideo)}
              className={cn(
                'p-2 rounded-lg transition-colors flex items-center gap-1',
                showVideo
                  ? theme === 'dark' ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'
                  : theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
              )}
              title={showVideo ? (isZh ? '查看图片序列' : 'View image sequence') : (isZh ? '查看视频' : 'View video')}
            >
              {showVideo ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>
          )}
          {/* Playback speed */}
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className={cn(
              'px-2 py-1 rounded-lg text-sm border-none outline-none',
              theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            )}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>

      {/* Main display */}
      <div className={cn(
        'relative rounded-xl overflow-hidden aspect-[4/3]',
        theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
      )}>
        <AnimatePresence mode="wait">
          {showVideo && resource.metadata.videoUrl ? (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <SecureVideoPlayer
                src={resource.metadata.videoUrl}
                className="w-full h-full"
                loop
                muted
              />
            </motion.div>
          ) : (
            <motion.div
              key={`frame-${currentFrameIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {currentFrame && (
                <SecureImageViewer
                  src={currentFrame.url}
                  alt={isZh ? currentFrame.labelZh : currentFrame.label}
                  className="w-full h-full"
                  objectFit="contain"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Time overlay */}
        <div className={cn(
          'absolute top-3 left-3 px-3 py-2 rounded-lg backdrop-blur-sm',
          theme === 'dark' ? 'bg-black/50' : 'bg-white/80'
        )}>
          <div className="flex items-center gap-2">
            <Clock className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
            <span className={cn('font-mono font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {currentFrame ? currentFrame.time : 0}s
            </span>
          </div>
          {currentFrame && (
            <p className={cn('text-sm mt-1', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
              {isZh ? currentFrame.labelZh : currentFrame.label}
            </p>
          )}
        </div>

        {/* Current annotation badge */}
        {showAnnotations && currentAnnotation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'absolute top-3 right-3 px-3 py-2 rounded-lg backdrop-blur-sm',
              theme === 'dark' ? 'bg-black/50' : 'bg-white/80'
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentAnnotation.color }}
              />
              <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {isZh ? currentAnnotation.descriptionZh : currentAnnotation.description}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Timeline */}
      {!showVideo && (
        <div className="space-y-2">
          {/* Progress bar with annotations */}
          <div
            ref={progressRef}
            className={cn(
              'relative h-3 rounded-full cursor-pointer',
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            )}
            onClick={handleTimelineClick}
          >
            {/* Progress fill */}
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-blue-500"
              initial={false}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />

            {/* Frame markers */}
            {frames.map((frame, index) => {
              const position = (frame.time / totalDuration) * 100
              const annotation = TIME_ANNOTATIONS.find((a) => a.time === frame.time)
              return (
                <div
                  key={index}
                  className="absolute top-0 h-full"
                  style={{ left: `${position}%` }}
                >
                  {/* Marker dot */}
                  <div
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 cursor-pointer transition-transform hover:scale-125',
                      index === currentFrameIndex
                        ? 'border-white bg-white scale-125'
                        : theme === 'dark'
                          ? 'border-slate-500 bg-slate-600'
                          : 'border-gray-300 bg-gray-400'
                    )}
                    style={{
                      backgroundColor: annotation ? annotation.color : undefined,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentFrameIndex(index)
                      setIsPlaying(false)
                    }}
                    onMouseEnter={() => annotation && setHoveredAnnotation(annotation)}
                    onMouseLeave={() => setHoveredAnnotation(null)}
                  />
                </div>
              )
            })}

            {/* Annotation tooltip */}
            <AnimatePresence>
              {hoveredAnnotation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={cn(
                    'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg whitespace-nowrap z-10',
                    theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-lg'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: hoveredAnnotation.color }}
                    />
                    <span className={cn('font-medium text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      {isZh ? hoveredAnnotation.labelZh : hoveredAnnotation.label}
                    </span>
                    <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      {hoveredAnnotation.time}s
                    </span>
                  </div>
                  <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                    {isZh ? hoveredAnnotation.descriptionZh : hoveredAnnotation.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Time labels */}
          <div className="flex justify-between px-1">
            <span className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
              0s
            </span>
            <span className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
              {totalDuration}s
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleRestart}
              className={cn(
                'p-2 rounded-lg transition-colors',
                theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              )}
              title={isZh ? '重新开始' : 'Restart'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={stepBackward}
              disabled={currentFrameIndex === 0}
              className={cn(
                'p-2 rounded-lg transition-colors disabled:opacity-30',
                theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              )}
              title={isZh ? '上一帧' : 'Previous frame'}
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <motion.button
              onClick={togglePlay}
              className={cn(
                'p-3 rounded-full transition-colors',
                isPlaying
                  ? theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                  : theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </motion.button>
            <button
              onClick={stepForward}
              disabled={currentFrameIndex === frames.length - 1}
              className={cn(
                'p-2 rounded-lg transition-colors disabled:opacity-30',
                theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              )}
              title={isZh ? '下一帧' : 'Next frame'}
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Description */}
      <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {isZh ? resource.descriptionZh : resource.description}
      </p>
    </div>
  )
}
