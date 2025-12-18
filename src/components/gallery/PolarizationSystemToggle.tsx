/**
 * PolarizationSystemToggle - 偏振系统切换器
 *
 * 功能：
 * - 在平行偏振和正交偏振系统之间切换
 * - CrossFade 平滑过渡效果
 * - 浮动切换按钮 (|| vs ⊥)
 * - 直观展示"暗场"如何揭示不可见应力
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SecureImageViewer } from '@/components/shared'
import { PolarizationResource, hasViewPair, TEMPERED_GLASS } from '@/data/resource-gallery'

type PolarizationMode = 'parallel' | 'crossed'

interface PolarizationSystemToggleProps {
  resource: PolarizationResource
  className?: string
  showLabel?: boolean
  defaultMode?: PolarizationMode
  onModeChange?: (mode: PolarizationMode) => void
}

export function PolarizationSystemToggle({
  resource,
  className,
  showLabel = true,
  defaultMode = 'parallel',
  onModeChange,
}: PolarizationSystemToggleProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [mode, setMode] = useState<PolarizationMode>(defaultMode)

  // Check if resource has view pairs
  if (!hasViewPair(resource)) {
    return (
      <div className={cn(
        'rounded-xl p-4 text-center',
        theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100',
        className
      )}>
        <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
          {isZh ? '此资源没有成对的偏振系统图片' : 'No view pairs available for this resource'}
        </p>
      </div>
    )
  }

  // Get image URL based on mode
  const imageUrl = mode === 'parallel'
    ? resource.views?.parallel || resource.url
    : resource.views?.crossed || resource.url

  // Toggle mode
  const toggleMode = useCallback(() => {
    const newMode = mode === 'parallel' ? 'crossed' : 'parallel'
    setMode(newMode)
    onModeChange?.(newMode)
  }, [mode, onModeChange])

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Header with label */}
      {showLabel && (
        <div className="flex items-center justify-between">
          <h3 className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? resource.titleZh : resource.title}
          </h3>
          <div className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            mode === 'crossed'
              ? 'bg-purple-500/20 text-purple-400'
              : 'bg-cyan-500/20 text-cyan-400'
          )}>
            {mode === 'crossed'
              ? (isZh ? '正交偏振' : 'Crossed')
              : (isZh ? '平行偏振' : 'Parallel')
            }
          </div>
        </div>
      )}

      {/* Image container with toggle */}
      <div className={cn(
        'relative rounded-xl overflow-hidden aspect-[4/3]',
        theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
      )}>
        {/* Image with crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <SecureImageViewer
              src={imageUrl}
              alt={`${isZh ? resource.titleZh : resource.title} - ${mode}`}
              className="w-full h-full"
              objectFit="contain"
            />
          </motion.div>
        </AnimatePresence>

        {/* Toggle button (floating) */}
        <motion.button
          onClick={toggleMode}
          className={cn(
            'absolute bottom-3 right-3 p-3 rounded-full shadow-lg backdrop-blur-sm transition-colors z-10',
            mode === 'crossed'
              ? 'bg-purple-500/80 hover:bg-purple-500 text-white'
              : 'bg-cyan-500/80 hover:bg-cyan-500 text-white'
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={mode === 'crossed'
            ? (isZh ? '切换到平行偏振' : 'Switch to Parallel')
            : (isZh ? '切换到正交偏振' : 'Switch to Crossed')
          }
        >
          {/* Toggle icon: || for parallel, ⊥ for crossed */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            {mode === 'parallel' ? (
              // Parallel lines ||
              <>
                <line x1="8" y1="4" x2="8" y2="20" />
                <line x1="16" y1="4" x2="16" y2="20" />
              </>
            ) : (
              // Perpendicular ⊥
              <>
                <line x1="12" y1="4" x2="12" y2="20" />
                <line x1="4" y1="12" x2="20" y2="12" />
              </>
            )}
          </svg>
        </motion.button>

        {/* Mode indicator overlay */}
        <div className={cn(
          'absolute top-3 left-3 px-2 py-1 rounded backdrop-blur-sm text-xs font-medium',
          mode === 'crossed'
            ? 'bg-purple-500/30 text-white'
            : 'bg-cyan-500/30 text-white'
        )}>
          {mode === 'crossed'
            ? (isZh ? '⊥ 正交' : '⊥ Crossed')
            : (isZh ? '|| 平行' : '|| Parallel')
          }
        </div>

        {/* Visual hint for dark field */}
        <AnimatePresence>
          {mode === 'crossed' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                'absolute bottom-3 left-3 px-3 py-1.5 rounded-lg backdrop-blur-sm',
                'bg-purple-500/30 text-white text-xs'
              )}
            >
              {isZh ? '暗场 - 应力可见' : 'Dark Field - Stress Visible'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info text */}
      <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {mode === 'crossed'
          ? (isZh
              ? '正交偏振系统（暗场）：背景暗，应力双折射产生的颜色清晰可见'
              : 'Crossed polarizers (dark field): background is dark, stress birefringence colors are clearly visible')
          : (isZh
              ? '平行偏振系统（亮场）：背景亮，主要看到物体的形状和透明度'
              : 'Parallel polarizers (bright field): background is bright, mainly shows object shape and transparency')
        }
      </p>
    </div>
  )
}

// Quick preset for common use case
export function GlassSystemToggle(props: Omit<PolarizationSystemToggleProps, 'resource'>) {
  return <PolarizationSystemToggle resource={TEMPERED_GLASS} {...props} />
}
