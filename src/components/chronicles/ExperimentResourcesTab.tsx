/**
 * ExperimentResourcesTab - 真实实验资源展示
 * 展示所有上传的实验图片和视频资源
 *
 * 设计目标：
 * 1. 按类别组织展示（应力分析、干涉效应、双折射等）
 * 2. 支持图片/视频切换
 * 3. 提供筛选和搜索功能
 * 4. 可查看序列动画和多视图对比
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Camera, Film, Play, Pause, ChevronLeft, ChevronRight,
  X, Maximize2, Filter, Grid, List, Eye,
  Flame, Layers, Hexagon, Glasses, Beaker, Sun, RotateCcw
} from 'lucide-react'
import {
  POLARIZATION_RESOURCES,
  getResourcesByCategory,
  type PolarizationResource,
  type ResourceCategory
} from '@/data/resource-gallery'

interface ExperimentResourcesTabProps {
  theme: 'dark' | 'light'
  isZh: boolean
}

// 类别配置
const CATEGORY_CONFIG: Record<ResourceCategory, {
  labelEn: string
  labelZh: string
  icon: React.ReactNode
  color: string
}> = {
  stress: {
    labelEn: 'Stress Analysis',
    labelZh: '应力分析',
    icon: <Flame className="w-4 h-4" />,
    color: 'orange'
  },
  interference: {
    labelEn: 'Interference Effects',
    labelZh: '干涉效应',
    icon: <Layers className="w-4 h-4" />,
    color: 'cyan'
  },
  birefringence: {
    labelEn: 'Birefringence',
    labelZh: '双折射',
    icon: <Hexagon className="w-4 h-4" />,
    color: 'purple'
  },
  daily: {
    labelEn: 'Daily Objects',
    labelZh: '日常物品',
    icon: <Glasses className="w-4 h-4" />,
    color: 'green'
  },
  brewster: {
    labelEn: "Brewster's Angle",
    labelZh: '布儒斯特角',
    icon: <Sun className="w-4 h-4" />,
    color: 'yellow'
  },
  rotation: {
    labelEn: 'Optical Rotation',
    labelZh: '旋光性',
    icon: <RotateCcw className="w-4 h-4" />,
    color: 'pink'
  },
  scattering: {
    labelEn: 'Scattering',
    labelZh: '散射',
    icon: <Sun className="w-4 h-4" />,
    color: 'blue'
  },
  art: {
    labelEn: 'Polarization Art',
    labelZh: '偏振艺术',
    icon: <Camera className="w-4 h-4" />,
    color: 'rose'
  }
}

// 获取颜色类名
function getColorClasses(color: string, theme: 'dark' | 'light', isActive: boolean) {
  const colorMap: Record<string, { active: string; inactive: string }> = {
    orange: {
      active: theme === 'dark' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' : 'bg-orange-100 text-orange-700 border-orange-300',
      inactive: theme === 'dark' ? 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/10' : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
    },
    cyan: {
      active: theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-cyan-100 text-cyan-700 border-cyan-300',
      inactive: theme === 'dark' ? 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10' : 'text-gray-500 hover:text-cyan-600 hover:bg-cyan-50'
    },
    purple: {
      active: theme === 'dark' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-purple-100 text-purple-700 border-purple-300',
      inactive: theme === 'dark' ? 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10' : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
    },
    green: {
      active: theme === 'dark' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-green-100 text-green-700 border-green-300',
      inactive: theme === 'dark' ? 'text-gray-400 hover:text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
    },
    yellow: {
      active: theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-yellow-100 text-yellow-700 border-yellow-300',
      inactive: theme === 'dark' ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10' : 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-50'
    },
    pink: {
      active: theme === 'dark' ? 'bg-pink-500/20 text-pink-400 border-pink-500/50' : 'bg-pink-100 text-pink-700 border-pink-300',
      inactive: theme === 'dark' ? 'text-gray-400 hover:text-pink-400 hover:bg-pink-500/10' : 'text-gray-500 hover:text-pink-600 hover:bg-pink-50'
    },
    blue: {
      active: theme === 'dark' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-blue-100 text-blue-700 border-blue-300',
      inactive: theme === 'dark' ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
    },
    rose: {
      active: theme === 'dark' ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 'bg-rose-100 text-rose-700 border-rose-300',
      inactive: theme === 'dark' ? 'text-gray-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50'
    }
  }
  return colorMap[color]?.[isActive ? 'active' : 'inactive'] || colorMap.cyan[isActive ? 'active' : 'inactive']
}

// 资源卡片组件
function ResourceCard({
  resource,
  theme,
  isZh,
  onClick
}: {
  resource: PolarizationResource
  theme: 'dark' | 'light'
  isZh: boolean
  onClick: () => void
}) {
  const hasVideo = resource.metadata?.hasVideo || resource.type === 'video'
  const isSequence = resource.type === 'sequence'
  const hasViews = resource.views && (resource.views.parallel || resource.views.crossed)

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative group rounded-xl overflow-hidden border text-left w-full',
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50'
          : 'bg-white border-gray-200 hover:border-cyan-400',
        'transition-all duration-200'
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 缩略图 */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={resource.thumbnail || resource.url}
          alt={isZh ? resource.titleZh : resource.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* 渐变遮罩 */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity',
          theme === 'dark'
            ? 'from-slate-900/80 via-transparent to-transparent'
            : 'from-black/50 via-transparent to-transparent'
        )} />

        {/* 类型标签 */}
        <div className="absolute top-2 left-2 flex gap-1">
          {hasVideo && (
            <span className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
              theme === 'dark' ? 'bg-purple-500/80 text-white' : 'bg-purple-500 text-white'
            )}>
              <Film className="w-3 h-3" />
              {isZh ? '视频' : 'Video'}
            </span>
          )}
          {isSequence && (
            <span className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
              theme === 'dark' ? 'bg-cyan-500/80 text-white' : 'bg-cyan-500 text-white'
            )}>
              <Layers className="w-3 h-3" />
              {isZh ? '序列' : 'Sequence'}
            </span>
          )}
          {hasViews && (
            <span className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
              theme === 'dark' ? 'bg-amber-500/80 text-white' : 'bg-amber-500 text-white'
            )}>
              <Eye className="w-3 h-3" />
              {isZh ? '多视图' : 'Views'}
            </span>
          )}
        </div>

        {/* 放大图标 */}
        <div className={cn(
          'absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity',
          theme === 'dark' ? 'bg-black/60 text-white' : 'bg-white/80 text-gray-700'
        )}>
          <Maximize2 className="w-4 h-4" />
        </div>
      </div>

      {/* 信息 */}
      <div className="p-3">
        <h4 className={cn(
          'text-sm font-medium line-clamp-1',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? resource.titleZh : resource.title}
        </h4>
        {resource.descriptionZh && (
          <p className={cn(
            'text-xs mt-1 line-clamp-2',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {isZh ? resource.descriptionZh : resource.description}
          </p>
        )}
      </div>
    </motion.button>
  )
}

// 资源详情模态框
function ResourceModal({
  resource,
  theme,
  isZh,
  onClose
}: {
  resource: PolarizationResource
  theme: 'dark' | 'light'
  isZh: boolean
  onClose: () => void
}) {
  const [activeView, setActiveView] = useState<'main' | 'parallel' | 'crossed'>('main')
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const hasViews = resource.views && (resource.views.parallel || resource.views.crossed)
  const isSequence = resource.type === 'sequence' && resource.frames && resource.frames.length > 0
  const hasVideo = resource.metadata?.hasVideo && resource.metadata?.videoUrl

  // 序列自动播放
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // 获取当前显示的图片URL
  const getCurrentImageUrl = () => {
    if (isSequence && resource.frames) {
      return resource.frames[currentFrame]?.url || resource.url
    }
    if (hasViews && activeView !== 'main') {
      return resource.views?.[activeView] || resource.url
    }
    return resource.url
  }

  // 序列播放效果
  useState(() => {
    if (!isPlaying || !isSequence || !resource.frames) return

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % (resource.frames?.length || 1))
    }, 1000)

    return () => clearInterval(interval)
  })

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={cn(
          'relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl',
          theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className={cn(
            'absolute top-4 right-4 z-10 p-2 rounded-full',
            theme === 'dark'
              ? 'bg-slate-800 text-white hover:bg-slate-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          <X className="w-5 h-5" />
        </button>

        {/* 主图/视频区域 */}
        <div className={cn(
          'relative flex items-center justify-center min-h-[300px]',
          theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
        )}>
          {showVideo && hasVideo ? (
            <video
              src={resource.metadata?.videoUrl}
              className="max-w-full max-h-[60vh] w-auto h-auto"
              controls
              autoPlay
            />
          ) : (
            <img
              src={getCurrentImageUrl()}
              alt={isZh ? resource.titleZh : resource.title}
              className="max-w-full max-h-[60vh] w-auto h-auto object-contain"
            />
          )}

          {/* 序列控制 */}
          {isSequence && resource.frames && !showVideo && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <button
                onClick={() => setCurrentFrame(prev => (prev - 1 + resource.frames!.length) % resource.frames!.length)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setCurrentFrame(prev => (prev + 1) % resource.frames!.length)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                {currentFrame + 1} / {resource.frames.length}
              </span>
            </div>
          )}
        </div>

        {/* 视图切换和信息 */}
        <div className="p-6">
          {/* 视图切换按钮 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {hasViews && (
              <>
                <button
                  onClick={() => { setActiveView('main'); setShowVideo(false) }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    activeView === 'main' && !showVideo
                      ? theme === 'dark'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-cyan-100 text-cyan-700'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  {isZh ? '正视图' : 'Front View'}
                </button>
                {resource.views?.parallel && (
                  <button
                    onClick={() => { setActiveView('parallel'); setShowVideo(false) }}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      activeView === 'parallel' && !showVideo
                        ? theme === 'dark'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-amber-100 text-amber-700'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    {isZh ? '平行偏振' : 'Parallel'}
                  </button>
                )}
                {resource.views?.crossed && (
                  <button
                    onClick={() => { setActiveView('crossed'); setShowVideo(false) }}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      activeView === 'crossed' && !showVideo
                        ? theme === 'dark'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-purple-100 text-purple-700'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    {isZh ? '正交偏振' : 'Crossed'}
                  </button>
                )}
              </>
            )}
            {hasVideo && (
              <button
                onClick={() => setShowVideo(true)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
                  showVideo
                    ? theme === 'dark'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-purple-100 text-purple-700'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <Film className="w-4 h-4" />
                {isZh ? '观看视频' : 'Watch Video'}
              </button>
            )}
          </div>

          {/* 序列帧缩略图 */}
          {isSequence && resource.frames && !showVideo && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {resource.frames.map((frame, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentFrame(i)}
                  className={cn(
                    'flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all',
                    currentFrame === i
                      ? 'border-cyan-400 ring-2 ring-cyan-400/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img src={frame.url} alt={frame.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* 标题和描述 */}
          <h3 className={cn(
            'text-xl font-bold mb-2',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? resource.titleZh : resource.title}
          </h3>
          {resource.description && (
            <p className={cn(
              'text-sm mb-4',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? resource.descriptionZh : resource.description}
            </p>
          )}

          {/* 相关模块 */}
          {resource.relatedModules && resource.relatedModules.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resource.relatedModules.map(module => (
                <span
                  key={module}
                  className={cn(
                    'px-2 py-1 rounded-full text-xs',
                    theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {module}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ExperimentResourcesTab({ theme, isZh }: ExperimentResourcesTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedResource, setSelectedResource] = useState<PolarizationResource | null>(null)

  // 获取有资源的类别
  const categoriesWithResources = useMemo(() => {
    const categories = Object.keys(CATEGORY_CONFIG) as ResourceCategory[]
    return categories.filter(cat => getResourcesByCategory(cat).length > 0)
  }, [])

  // 筛选资源
  const filteredResources = useMemo(() => {
    if (selectedCategory === 'all') {
      return POLARIZATION_RESOURCES
    }
    return getResourcesByCategory(selectedCategory)
  }, [selectedCategory])

  // 按类别分组
  const resourcesByCategory = useMemo(() => {
    const grouped: Record<ResourceCategory, PolarizationResource[]> = {} as Record<ResourceCategory, PolarizationResource[]>
    filteredResources.forEach(resource => {
      if (!grouped[resource.category]) {
        grouped[resource.category] = []
      }
      grouped[resource.category].push(resource)
    })
    return grouped
  }, [filteredResources])

  return (
    <div className="space-y-6">
      {/* 介绍 */}
      <div className={cn(
        'rounded-xl border p-6',
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-amber-50 border-amber-200'
      )}>
        <div className="flex items-start gap-4">
          <Beaker className={cn(
            'w-10 h-10 flex-shrink-0',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          )} />
          <div>
            <h3 className={cn(
              'text-lg font-semibold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '真实实验资源库' : 'Real Experiment Gallery'}
            </h3>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh
                ? '这里收集了各类偏振实验的真实拍摄图片和视频，包括应力分析、双折射、布儒斯特角等经典实验。点击查看详情，体验平行/正交偏振系统的对比效果。'
                : 'This gallery contains real photographs and videos of polarization experiments, including stress analysis, birefringence, Brewster\'s angle, and more. Click to view details and compare parallel/crossed polarizer effects.'}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}>
                <Camera className="w-4 h-4 inline mr-1" />
                {POLARIZATION_RESOURCES.filter(r => r.type === 'image').length} {isZh ? '张图片' : 'images'}
              </span>
              <span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}>
                <Film className="w-4 h-4 inline mr-1" />
                {POLARIZATION_RESOURCES.filter(r => r.type === 'video' || r.metadata?.hasVideo).length} {isZh ? '个视频' : 'videos'}
              </span>
              <span className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}>
                <Layers className="w-4 h-4 inline mr-1" />
                {POLARIZATION_RESOURCES.filter(r => r.type === 'sequence').length} {isZh ? '个序列' : 'sequences'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className={cn(
        'flex flex-wrap items-center gap-3 p-4 rounded-xl border',
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          <Filter className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
          <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            {isZh ? '类别：' : 'Category:'}
          </span>
        </div>

        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border',
            selectedCategory === 'all'
              ? theme === 'dark'
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-gray-900 text-white border-gray-900'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 border-transparent'
          )}
        >
          {isZh ? '全部' : 'All'} ({POLARIZATION_RESOURCES.length})
        </button>

        {categoriesWithResources.map(category => {
          const config = CATEGORY_CONFIG[category]
          const count = getResourcesByCategory(category).length
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border flex items-center gap-1.5',
                getColorClasses(config.color, theme, selectedCategory === category),
                selectedCategory === category ? 'border-current' : 'border-transparent'
              )}
            >
              {config.icon}
              {isZh ? config.labelZh : config.labelEn} ({count})
            </button>
          )
        })}

        {/* 视图切换 */}
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'grid'
                ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-900'
                : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'list'
                ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-900'
                : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 资源展示 */}
      {selectedCategory === 'all' ? (
        // 按类别分组展示
        Object.entries(resourcesByCategory).map(([category, resources]) => {
          const config = CATEGORY_CONFIG[category as ResourceCategory]
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <span className={cn(
                  'p-2 rounded-lg',
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                )}>
                  {config.icon}
                </span>
                <h3 className={cn(
                  'text-lg font-semibold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? config.labelZh : config.labelEn}
                </h3>
                <span className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  ({resources.length})
                </span>
              </div>
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
                  : 'space-y-3'
              )}>
                {resources.map(resource => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    theme={theme}
                    isZh={isZh}
                    onClick={() => setSelectedResource(resource)}
                  />
                ))}
              </div>
            </div>
          )
        })
      ) : (
        // 单类别展示
        <div className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
            : 'space-y-3'
        )}>
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              theme={theme}
              isZh={isZh}
              onClick={() => setSelectedResource(resource)}
            />
          ))}
        </div>
      )}

      {/* 资源详情模态框 */}
      <AnimatePresence>
        {selectedResource && (
          <ResourceModal
            resource={selectedResource}
            theme={theme}
            isZh={isZh}
            onClose={() => setSelectedResource(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExperimentResourcesTab
