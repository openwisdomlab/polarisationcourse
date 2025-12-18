/**
 * DynamicStrainViewer - 动态应变查看器
 *
 * 功能：
 * - 视频播放器 + 侧边注解面板
 * - 视频播放时高亮对应时间点的注解
 * - 支持保鲜膜拉伸等动态实验视频
 * - 解释光轴、厚度变化等概念
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SecureVideoPlayer } from '@/components/shared'
import {
  PLASTIC_WRAP_STRETCHING,
  PolarizationResource,
  VideoAnnotation,
} from '@/data/resource-gallery'
import {
  Play,
  BookOpen,
  Lightbulb,
  Eye,
  ChevronRight,
} from 'lucide-react'

interface DynamicStrainViewerProps {
  resource?: PolarizationResource
  className?: string
  showAnnotations?: boolean
  autoPlay?: boolean
}

// Annotation type colors and icons
const ANNOTATION_STYLES: Record<string, { color: string; icon: typeof Lightbulb; bgColor: string }> = {
  info: {
    color: 'text-cyan-400',
    icon: BookOpen,
    bgColor: 'bg-cyan-500/10 border-cyan-500/30',
  },
  important: {
    color: 'text-amber-400',
    icon: Lightbulb,
    bgColor: 'bg-amber-500/10 border-amber-500/30',
  },
  observation: {
    color: 'text-purple-400',
    icon: Eye,
    bgColor: 'bg-purple-500/10 border-purple-500/30',
  },
}

export function DynamicStrainViewer({
  resource = PLASTIC_WRAP_STRETCHING,
  className,
  showAnnotations = true,
  autoPlay = false,
}: DynamicStrainViewerProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [currentTime, setCurrentTime] = useState(0)
  const [activeAnnotationIndex, setActiveAnnotationIndex] = useState<number | null>(null)

  // Get annotations from resource
  const annotations = resource.videoAnnotations || []

  // Find the currently active annotation based on video time
  useEffect(() => {
    if (annotations.length === 0) return

    // Find the annotation that matches the current time
    let activeIdx: number | null = null
    for (let i = annotations.length - 1; i >= 0; i--) {
      if (currentTime >= annotations[i].time) {
        activeIdx = i
        break
      }
    }
    setActiveAnnotationIndex(activeIdx)
  }, [currentTime, annotations])

  // Jump to annotation time
  const jumpToAnnotation = useCallback((annotation: VideoAnnotation) => {
    // This would require access to the video element
    // For now, we'll just highlight the annotation
    setCurrentTime(annotation.time)
  }, [])

  // Get video URL
  const videoUrl = resource.metadata.videoUrl || resource.url

  if (!videoUrl) {
    return (
      <div className={cn(
        'rounded-xl p-8 text-center',
        theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100',
        className
      )}>
        <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
          {isZh ? '无可用视频' : 'No video available'}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className={cn('w-5 h-5', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')} />
          <h3 className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? resource.titleZh : resource.title}
          </h3>
        </div>
        <div className={cn(
          'px-2 py-1 rounded text-xs font-medium',
          'bg-emerald-500/20 text-emerald-400'
        )}>
          {isZh ? '动态实验' : 'Dynamic Experiment'}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Video player */}
        <div className="flex-1">
          <div className={cn(
            'relative rounded-xl overflow-hidden aspect-video',
            theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
          )}>
            <SecureVideoPlayer
              src={videoUrl}
              className="w-full h-full"
              loop
              muted={false}
              autoPlay={autoPlay}
            />

            {/* Current annotation overlay */}
            <AnimatePresence>
              {activeAnnotationIndex !== null && annotations[activeAnnotationIndex] && (
                <motion.div
                  key={activeAnnotationIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    'absolute bottom-4 left-4 right-4 px-4 py-3 rounded-lg backdrop-blur-sm',
                    theme === 'dark' ? 'bg-black/70' : 'bg-white/90'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {(() => {
                      const annotation = annotations[activeAnnotationIndex]
                      const style = ANNOTATION_STYLES[annotation.type] || ANNOTATION_STYLES.info
                      const Icon = style.icon
                      return (
                        <>
                          <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', style.color)} />
                          <div>
                            <div className={cn('font-medium text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                              {isZh ? annotation.labelZh : annotation.label}
                            </div>
                            <div className={cn('text-xs mt-1', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                              {isZh ? annotation.descriptionZh : annotation.description}
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Annotations panel */}
        {showAnnotations && annotations.length > 0 && (
          <div className={cn(
            'lg:w-72 rounded-xl overflow-hidden',
            theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'
          )}>
            <div className={cn(
              'px-4 py-3 border-b',
              theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'
            )}>
              <h4 className={cn(
                'text-sm font-semibold flex items-center gap-2',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                <BookOpen className="w-4 h-4" />
                {isZh ? '实验注解' : 'Experiment Notes'}
              </h4>
            </div>

            <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
              {annotations.map((annotation, idx) => {
                const style = ANNOTATION_STYLES[annotation.type] || ANNOTATION_STYLES.info
                const Icon = style.icon
                const isActive = idx === activeAnnotationIndex

                return (
                  <motion.button
                    key={idx}
                    onClick={() => jumpToAnnotation(annotation)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-all',
                      isActive
                        ? style.bgColor
                        : theme === 'dark'
                          ? 'bg-slate-700/30 border-slate-700 hover:bg-slate-700/50'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    )}
                    animate={{
                      scale: isActive ? 1.02 : 1,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', isActive ? style.color : 'text-gray-400')} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn(
                            'text-xs font-medium truncate',
                            isActive
                              ? (theme === 'dark' ? 'text-white' : 'text-gray-900')
                              : (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')
                          )}>
                            {isZh ? annotation.labelZh : annotation.label}
                          </span>
                          <span className={cn(
                            'text-xs font-mono flex-shrink-0',
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          )}>
                            {annotation.time}s
                          </span>
                        </div>
                        <p className={cn(
                          'text-xs mt-1 line-clamp-2',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>
                          {isZh ? annotation.descriptionZh : annotation.description}
                        </p>
                      </div>
                      {isActive && (
                        <ChevronRight className={cn('w-4 h-4 flex-shrink-0', style.color)} />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Legend */}
            <div className={cn(
              'px-4 py-3 border-t',
              theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
            )}>
              <div className={cn('text-xs mb-2', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                {isZh ? '图例' : 'Legend'}
              </div>
              <div className="flex flex-wrap gap-3">
                {Object.entries(ANNOTATION_STYLES).map(([type, style]) => {
                  const Icon = style.icon
                  return (
                    <div key={type} className="flex items-center gap-1">
                      <Icon className={cn('w-3 h-3', style.color)} />
                      <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                        {type === 'info'
                          ? (isZh ? '信息' : 'Info')
                          : type === 'important'
                            ? (isZh ? '重点' : 'Key')
                            : (isZh ? '观察' : 'Observe')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {isZh ? resource.descriptionZh : resource.description}
      </p>

      {/* Key concepts summary */}
      <div className={cn(
        'p-4 rounded-lg border-l-4 border-emerald-500',
        theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
      )}>
        <div className="flex items-start gap-2">
          <Lightbulb className={cn('w-4 h-4 mt-0.5 flex-shrink-0', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')} />
          <div>
            <h5 className={cn('text-sm font-medium mb-1', theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700')}>
              {isZh ? '关键概念' : 'Key Concepts'}
            </h5>
            <ul className={cn('text-xs space-y-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              <li>• {isZh ? '拉伸产生分子排列，形成光轴（Optical Axis）' : 'Stretching aligns molecules, creating an optical axis'}</li>
              <li>• {isZh ? '厚度变化改变延迟量，影响干涉色' : 'Thickness changes alter retardation, affecting interference colors'}</li>
              <li>• {isZh ? '颜色随旋转角度周期性变化' : 'Colors change periodically with rotation angle'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
