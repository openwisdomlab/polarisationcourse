/**
 * ThicknessVisualizer - 保鲜膜/透明胶厚度实验可视化
 *
 * 功能：
 * - 展示保鲜膜不同层数重叠时的颜色变化
 * - 显示理论色阶条与当前层数对应位置
 * - 支持平行/正交偏振系统切换
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SecureImageViewer, SecureVideoPlayer } from '@/components/shared'
import { PLASTIC_WRAP_THICKNESS, PolarizationResource } from '@/data/resource-gallery'
import { Layers, Eye, EyeOff, ChevronLeft, ChevronRight, Video } from 'lucide-react'

interface ThicknessVisualizerProps {
  resource?: PolarizationResource
  className?: string
  showTheoryBar?: boolean
  showVideoButton?: boolean
}

// 理论干涉色色阶（Michel-Lévy色阶的简化版本）
const INTERFERENCE_COLORS = [
  { retardation: 0, color: '#1a1a1a', label: '0nm' },
  { retardation: 50, color: '#4a4a4a', label: '50nm' },
  { retardation: 100, color: '#8a8a8a', label: '100nm' },
  { retardation: 200, color: '#fef3c7', label: '200nm' }, // pale yellow
  { retardation: 300, color: '#fbbf24', label: '300nm' }, // yellow
  { retardation: 400, color: '#f97316', label: '400nm' }, // orange
  { retardation: 500, color: '#ef4444', label: '500nm' }, // red
  { retardation: 550, color: '#a855f7', label: '550nm' }, // purple/violet
  { retardation: 600, color: '#3b82f6', label: '600nm' }, // blue
  { retardation: 700, color: '#22c55e', label: '700nm' }, // green
  { retardation: 800, color: '#fef08a', label: '800nm' }, // yellow-green
  { retardation: 900, color: '#fcd34d', label: '900nm' }, // yellow
  { retardation: 1000, color: '#f472b6', label: '1000nm' }, // pink
  { retardation: 1100, color: '#6366f1', label: '1100nm' }, // indigo
  { retardation: 1200, color: '#06b6d4', label: '1200nm' }, // cyan
]

// 每层保鲜膜约100-150nm延迟
const RETARDATION_PER_LAYER = 120 // nm

export function ThicknessVisualizer({
  resource = PLASTIC_WRAP_THICKNESS,
  className,
  showTheoryBar = true,
  showVideoButton = true,
}: ThicknessVisualizerProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [selectedLayer, setSelectedLayer] = useState(1)
  const [showVideo, setShowVideo] = useState(false)
  const [showPolarization, setShowPolarization] = useState(true)

  // Get frames from resource
  const frames = useMemo(() => {
    return resource.frames || []
  }, [resource])

  // Get current frame based on selected layer
  const currentFrame = useMemo(() => {
    if (frames.length === 0) return null
    const index = Math.min(selectedLayer - 1, frames.length - 1)
    return frames[index]
  }, [frames, selectedLayer])

  // Calculate theoretical retardation
  const theoreticalRetardation = selectedLayer * RETARDATION_PER_LAYER

  // Find closest color in the scale
  const currentColorIndex = useMemo(() => {
    let closest = 0
    let minDiff = Infinity
    INTERFERENCE_COLORS.forEach((c, i) => {
      const diff = Math.abs(c.retardation - theoreticalRetardation)
      if (diff < minDiff) {
        minDiff = diff
        closest = i
      }
    })
    return closest
  }, [theoreticalRetardation])

  const maxLayers = frames.length || 5

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
          <h3 className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? resource.titleZh : resource.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Polarization toggle */}
          <button
            onClick={() => setShowPolarization(!showPolarization)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              showPolarization
                ? theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
                : theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
            )}
            title={isZh ? '切换偏振视图' : 'Toggle polarization view'}
          >
            {showPolarization ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          {/* Video button */}
          {showVideoButton && resource.metadata.hasVideo && (
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

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Image/Video display */}
        <div className="flex-1">
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
                    autoPlay
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`image-${selectedLayer}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
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

            {/* Layer indicator overlay */}
            <div className={cn(
              'absolute top-3 left-3 px-3 py-1.5 rounded-lg backdrop-blur-sm',
              theme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/80 text-gray-900'
            )}>
              <span className="font-semibold">{selectedLayer}</span>
              <span className="text-sm ml-1 opacity-70">
                {isZh ? '层' : selectedLayer === 1 ? 'layer' : 'layers'}
              </span>
            </div>
          </div>

          {/* Layer selector buttons */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setSelectedLayer(Math.max(1, selectedLayer - 1))}
              disabled={selectedLayer === 1}
              className={cn(
                'p-2 rounded-lg transition-colors disabled:opacity-30',
                theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: maxLayers }, (_, i) => i + 1).map((layer) => (
              <motion.button
                key={layer}
                onClick={() => setSelectedLayer(layer)}
                className={cn(
                  'w-10 h-10 rounded-lg font-semibold transition-colors',
                  selectedLayer === layer
                    ? theme === 'dark'
                      ? 'bg-cyan-500/30 text-cyan-300 border-2 border-cyan-500'
                      : 'bg-cyan-100 text-cyan-700 border-2 border-cyan-500'
                    : theme === 'dark'
                      ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {layer}
              </motion.button>
            ))}
            <button
              onClick={() => setSelectedLayer(Math.min(maxLayers, selectedLayer + 1))}
              disabled={selectedLayer === maxLayers}
              className={cn(
                'p-2 rounded-lg transition-colors disabled:opacity-30',
                theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Theory panel */}
        {showTheoryBar && (
          <div className={cn(
            'lg:w-64 rounded-xl p-4',
            theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'
          )}>
            <h4 className={cn(
              'text-sm font-semibold mb-3',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )}>
              {isZh ? '理论干涉色阶' : 'Theoretical Interference Colors'}
            </h4>

            {/* Color scale */}
            <div className="relative mb-4">
              <div className="h-8 rounded-lg overflow-hidden flex">
                {INTERFERENCE_COLORS.map((c, i) => (
                  <div
                    key={i}
                    className="flex-1 relative"
                    style={{ backgroundColor: c.color }}
                  >
                    {i === currentColorIndex && (
                      <motion.div
                        layoutId="color-indicator"
                        className="absolute inset-0 border-2 border-white shadow-lg"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>
                ))}
              </div>
              {/* Scale labels */}
              <div className="flex justify-between mt-1">
                <span className={cn('text-[10px]', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                  0nm
                </span>
                <span className={cn('text-[10px]', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                  1200nm
                </span>
              </div>
            </div>

            {/* Current values */}
            <div className="space-y-3">
              <div className={cn(
                'p-3 rounded-lg',
                theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
              )}>
                <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                  {isZh ? '理论延迟量' : 'Theoretical Retardation'}
                </div>
                <div className={cn('text-lg font-mono font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {theoreticalRetardation} nm
                </div>
              </div>

              <div className={cn(
                'p-3 rounded-lg',
                theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
              )}>
                <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                  {isZh ? '预期颜色' : 'Expected Color'}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2"
                    style={{
                      backgroundColor: INTERFERENCE_COLORS[currentColorIndex].color,
                      borderColor: theme === 'dark' ? '#475569' : '#d1d5db',
                    }}
                  />
                  <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                    {INTERFERENCE_COLORS[currentColorIndex].label}
                  </span>
                </div>
              </div>

              {/* Formula */}
              <div className={cn(
                'p-3 rounded-lg border-l-4 border-cyan-500',
                theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50'
              )}>
                <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
                  {isZh ? '计算公式' : 'Formula'}
                </div>
                <div className={cn('text-sm font-mono', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                  R = n × d × (n<sub>e</sub> - n<sub>o</sub>)
                </div>
                <div className={cn('text-xs mt-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                  {isZh ? 'n=层数, d=厚度, n=双折射率' : 'n=layers, d=thickness, n=birefringence'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {isZh ? resource.descriptionZh : resource.description}
      </p>
    </div>
  )
}
