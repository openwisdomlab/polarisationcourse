/**
 * StressComparator - 应力对比组件
 *
 * 功能：
 * - Before/After 对比效果（滑动分隔线）
 * - 支持钢化玻璃 vs 普通玻璃对比
 * - 支持平行/正交偏振系统切换
 * - 可选视频模式
 */

import { useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SecureImageViewer, SecureVideoPlayer } from '@/components/shared'
import {
  TEMPERED_GLASS,
  ORDINARY_GLASS,
  PolarizationResource,
} from '@/data/resource-gallery'
import {
  ArrowLeftRight,
  Video,
  SplitSquareVertical,
  Info,
} from 'lucide-react'

interface StressComparatorProps {
  leftResource?: PolarizationResource
  rightResource?: PolarizationResource
  className?: string
  showLabels?: boolean
  showInfo?: boolean
  initialPosition?: number // 0-100 slider position
}

type ViewMode = 'front' | 'parallel' | 'crossed'

export function StressComparator({
  leftResource = TEMPERED_GLASS,
  rightResource = ORDINARY_GLASS,
  className,
  showLabels = true,
  showInfo = true,
  initialPosition = 50,
}: StressComparatorProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [sliderPosition, setSliderPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('crossed')
  const [showVideo, setShowVideo] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Get image URLs based on view mode
  const getImageUrl = useCallback((resource: PolarizationResource, mode: ViewMode): string => {
    if (resource.views) {
      return resource.views[mode] || resource.url
    }
    return resource.url
  }, [])

  const leftImageUrl = useMemo(() => getImageUrl(leftResource, viewMode), [leftResource, viewMode, getImageUrl])
  const rightImageUrl = useMemo(() => getImageUrl(rightResource, viewMode), [rightResource, viewMode, getImageUrl])

  // Handle mouse/touch drag
  const handleDrag = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    handleDrag(e.clientX)
  }, [handleDrag])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      handleDrag(e.clientX)
    }
  }, [isDragging, handleDrag])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    handleDrag(e.touches[0].clientX)
  }, [handleDrag])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging) {
      handleDrag(e.touches[0].clientX)
    }
  }, [isDragging, handleDrag])

  // View mode buttons
  const viewModes: { mode: ViewMode; label: string; labelZh: string }[] = [
    { mode: 'front', label: 'Front', labelZh: '正视图' },
    { mode: 'parallel', label: 'Parallel', labelZh: '平行偏振' },
    { mode: 'crossed', label: 'Crossed', labelZh: '正交偏振' },
  ]

  // Check if either resource has video
  const hasVideo = leftResource.metadata.hasVideo || rightResource.metadata.hasVideo

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <SplitSquareVertical className={cn('w-5 h-5', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')} />
          <h3 className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '应力对比器' : 'Stress Comparator'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode selector */}
          <div className={cn(
            'flex rounded-lg overflow-hidden',
            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
          )}>
            {viewModes.map(({ mode, label, labelZh }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors',
                  viewMode === mode
                    ? theme === 'dark'
                      ? 'bg-purple-500/30 text-purple-300'
                      : 'bg-purple-100 text-purple-700'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {isZh ? labelZh : label}
              </button>
            ))}
          </div>
          {/* Video toggle */}
          {hasVideo && (
            <button
              onClick={() => setShowVideo(!showVideo)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                showVideo
                  ? theme === 'dark' ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'
                  : theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
              )}
              title={isZh ? '查看视频' : 'View video'}
            >
              <Video className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Comparison container */}
      <div
        ref={containerRef}
        className={cn(
          'relative rounded-xl overflow-hidden cursor-ew-resize select-none aspect-[4/3]',
          theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {showVideo ? (
          // Video mode
          <div className="absolute inset-0 flex">
            <div className="w-1/2 relative">
              {leftResource.metadata.videoUrl && (
                <SecureVideoPlayer
                  src={leftResource.metadata.videoUrl}
                  className="w-full h-full"
                  loop
                  muted
                  autoPlay
                />
              )}
            </div>
            <div className="w-1/2 relative">
              {rightResource.metadata.videoUrl && (
                <SecureVideoPlayer
                  src={rightResource.metadata.videoUrl}
                  className="w-full h-full"
                  loop
                  muted
                  autoPlay
                />
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Left image (full width) */}
            <div className="absolute inset-0">
              <SecureImageViewer
                src={leftImageUrl}
                alt={isZh ? leftResource.titleZh : leftResource.title}
                className="w-full h-full"
                objectFit="contain"
              />
            </div>

            {/* Right image (clipped by slider) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <SecureImageViewer
                src={rightImageUrl}
                alt={isZh ? rightResource.titleZh : rightResource.title}
                className="w-full h-full"
                objectFit="contain"
              />
            </div>

            {/* Slider line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-20 cursor-ew-resize"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              {/* Slider handle */}
              <div className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'w-10 h-10 rounded-full flex items-center justify-center',
                'bg-white shadow-lg border-2',
                theme === 'dark' ? 'border-purple-500' : 'border-purple-400'
              )}>
                <ArrowLeftRight className={cn(
                  'w-5 h-5',
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                )} />
              </div>
            </div>
          </>
        )}

        {/* Labels */}
        {showLabels && !showVideo && (
          <>
            <div className={cn(
              'absolute top-3 left-3 px-3 py-1.5 rounded-lg backdrop-blur-sm z-10',
              theme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/80 text-gray-900'
            )}>
              <span className="text-sm font-medium">
                {isZh ? leftResource.titleZh : leftResource.title}
              </span>
            </div>
            <div className={cn(
              'absolute top-3 right-3 px-3 py-1.5 rounded-lg backdrop-blur-sm z-10',
              theme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/80 text-gray-900'
            )}>
              <span className="text-sm font-medium">
                {isZh ? rightResource.titleZh : rightResource.title}
              </span>
            </div>
          </>
        )}

        {/* Drag hint */}
        <AnimatePresence>
          {sliderPosition === initialPosition && !isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                'absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg backdrop-blur-sm z-10',
                theme === 'dark' ? 'bg-black/50 text-gray-300' : 'bg-white/80 text-gray-600'
              )}
            >
              <span className="text-xs">
                {isZh ? '← 拖动对比 →' : '← Drag to compare →'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slider control */}
      <div className="px-2">
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(parseFloat(e.target.value))}
          className={cn(
            'w-full h-2 rounded-lg appearance-none cursor-pointer',
            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:rounded-full',
            theme === 'dark'
              ? '[&::-webkit-slider-thumb]:bg-purple-400'
              : '[&::-webkit-slider-thumb]:bg-purple-600'
          )}
        />
      </div>

      {/* Info panel */}
      {showInfo && (
        <div className="grid grid-cols-2 gap-4">
          {/* Left resource info */}
          <div className={cn(
            'p-3 rounded-lg',
            theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-gray-50 border border-gray-200'
          )}>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                'w-3 h-3 rounded-full',
                theme === 'dark' ? 'bg-cyan-400' : 'bg-cyan-500'
              )} />
              <span className={cn(
                'text-sm font-medium',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? leftResource.titleZh : leftResource.title}
              </span>
            </div>
            <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {isZh ? leftResource.descriptionZh : leftResource.description}
            </p>
          </div>

          {/* Right resource info */}
          <div className={cn(
            'p-3 rounded-lg',
            theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-gray-50 border border-gray-200'
          )}>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                'w-3 h-3 rounded-full',
                theme === 'dark' ? 'bg-orange-400' : 'bg-orange-500'
              )} />
              <span className={cn(
                'text-sm font-medium',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? rightResource.titleZh : rightResource.title}
              </span>
            </div>
            <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {isZh ? rightResource.descriptionZh : rightResource.description}
            </p>
          </div>
        </div>
      )}

      {/* Key differences */}
      <div className={cn(
        'p-4 rounded-lg border-l-4 border-purple-500',
        theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
      )}>
        <div className="flex items-start gap-2">
          <Info className={cn('w-4 h-4 mt-0.5 flex-shrink-0', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')} />
          <div>
            <h4 className={cn('text-sm font-medium mb-1', theme === 'dark' ? 'text-purple-300' : 'text-purple-700')}>
              {isZh ? '关键区别' : 'Key Difference'}
            </h4>
            <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {isZh
                ? '钢化玻璃经过热处理，内部存在预应力，在正交偏振下显示特征性的斑驳图案。普通玻璃内应力很小，几乎不显示颜色。'
                : 'Tempered glass is heat-treated with internal pre-stress, showing characteristic mottled patterns under crossed polarizers. Ordinary glass has minimal internal stress and shows almost no color.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Preset comparisons
export function GlassStressComparator(props: Omit<StressComparatorProps, 'leftResource' | 'rightResource'>) {
  return (
    <StressComparator
      leftResource={TEMPERED_GLASS}
      rightResource={ORDINARY_GLASS}
      {...props}
    />
  )
}
