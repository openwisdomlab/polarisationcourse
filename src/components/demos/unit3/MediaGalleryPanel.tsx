/**
 * 色偏振媒体画廊面板
 * 渐进式呈现色偏振相关的图片和视频资源
 * - 真实实验场景展示（照片/视频）
 * - 关联到文创作品子模块
 */
import type { ComponentType } from 'react'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { useTheme } from '@/contexts/ThemeContext'
import { useDemoTheme } from '../demoThemeColors'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FlaskConical,
  Palette,
  ExternalLink,
  Camera,
  Film
} from 'lucide-react'
import {
  CULTURAL_MEDIA,
  CULTURAL_SERIES,
  type CulturalMedia,
  type CulturalSeries,
} from '@/data/cultural-creations'
import {
  POLARIZATION_RESOURCES,
  type PolarizationResource
} from '@/data/resource-gallery'

// 媒体分类
type MediaCategory = 'art' | 'experiment' | 'all'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  path: string
  thumbnail?: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  category: MediaCategory
}

// 转换文创数据到统一格式
function convertCulturalMedia(media: CulturalMedia): MediaItem {
  return {
    id: media.id,
    type: media.type,
    path: media.path,
    thumbnail: media.thumbnail,
    name: media.name,
    nameZh: media.nameZh,
    description: media.description,
    descriptionZh: media.descriptionZh,
    category: 'art',
  }
}

// 转换实验资源到统一格式
function convertResource(resource: PolarizationResource): MediaItem {
  return {
    id: resource.id,
    type: resource.type === 'video' ? 'video' : 'image',
    path: resource.url,
    thumbnail: resource.thumbnail,
    name: resource.title,
    nameZh: resource.titleZh,
    description: resource.description || '',
    descriptionZh: resource.descriptionZh || '',
    category: 'experiment',
  }
}

// 获取特色媒体（只取有代表性的）
function getFeaturedMedia(): MediaItem[] {
  const artMedia = CULTURAL_MEDIA
    .filter(m => m.featured && m.polarizationSystem === 'crossed')
    .slice(0, 6)
    .map(convertCulturalMedia)

  const experimentMedia = POLARIZATION_RESOURCES
    .filter(r => r.category === 'interference' || r.category === 'stress')
    .slice(0, 6)
    .map(convertResource)

  return [...artMedia, ...experimentMedia]
}

// 缩略图组件
function MediaThumbnail({
  item,
  onClick,
  isVideo = false,
  size = 'md'
}: {
  item: MediaItem
  onClick: () => void
  isVideo?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const dt = useDemoTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
    xl: 'w-44 h-44',
  }

  return (
    <motion.button
      className={`${sizeClasses[size]} relative rounded-lg overflow-hidden border ${dt.isDark ? 'border-slate-600/50' : 'border-slate-300/50'}
        hover:border-purple-500/50 transition-all group cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <img
        src={item.thumbnail || item.path}
        alt={isZh ? item.nameZh : item.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1">
        <p className="text-[10px] text-white truncate">
          {isZh ? item.nameZh : item.name}
        </p>
      </div>
    </motion.button>
  )
}

// 媒体模态框 - 优化版本
// 移除黑框，自适应比例，支持手势导航
function MediaModal({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  currentIndex,
  totalCount,
}: {
  item: MediaItem
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  hasPrev?: boolean
  hasNext?: boolean
  currentIndex?: number
  totalCount?: number
}) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [showInfo, setShowInfo] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev()
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext()
      if (e.key === 'Escape') onClose()
      if (e.key === 'i') setShowInfo(prev => !prev)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasPrev, hasNext, onPrev, onNext, onClose])

  // 触摸手势
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext && onNext) {
        onNext()
      } else if (diff < 0 && hasPrev && onPrev) {
        onPrev()
      }
    }
    setTouchStart(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 顶部工具栏 */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          {currentIndex !== undefined && totalCount !== undefined && (
            <span className="text-white/80 text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
              {currentIndex + 1} / {totalCount}
            </span>
          )}
          <span className="text-white/60 text-xs hidden sm:inline">
            {isZh ? '← → 切换 | ESC 关闭 | I 信息' : '← → Navigate | ESC Close | I Info'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setShowInfo(prev => !prev) }}
            className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60 hover:text-white'}`}
            title={isZh ? '切换信息显示' : 'Toggle info'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 媒体内容 - 自适应无黑框 */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 媒体容器 - 自适应比例 */}
        <div className="relative flex-1 w-full flex items-center justify-center min-h-0">
          {item.type === 'video' ? (
            <video
              src={item.path}
              controls
              autoPlay
              loop
              playsInline
              className="max-w-full max-h-full w-auto h-auto rounded-lg shadow-2xl object-contain"
              style={{ maxHeight: showInfo ? 'calc(100vh - 200px)' : 'calc(100vh - 120px)' }}
            />
          ) : (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <motion.img
                src={item.path}
                alt={isZh ? item.nameZh : item.name}
                className="max-w-full max-h-full w-auto h-auto rounded-lg shadow-2xl object-contain"
                style={{
                  maxHeight: showInfo ? 'calc(100vh - 200px)' : 'calc(100vh - 120px)',
                  opacity: imageLoaded ? 1 : 0
                }}
                onLoad={() => setImageLoaded(true)}
                layoutId={`media-${item.id}`}
              />
            </>
          )}
        </div>

        {/* 信息面板 - 可折叠 */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl mt-4 p-4 bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-700/50"
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {item.category === 'art' ? (
                  <Palette className="w-4 h-4 text-pink-400" />
                ) : (
                  <FlaskConical className="w-4 h-4 text-cyan-400" />
                )}
                {isZh ? item.nameZh : item.name}
              </h3>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                {isZh ? item.descriptionZh : item.description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.category === 'art'
                    ? 'bg-pink-500/20 text-pink-300'
                    : 'bg-cyan-500/20 text-cyan-300'
                }`}>
                  {item.category === 'art'
                    ? (isZh ? '艺术创作' : 'Art')
                    : (isZh ? '实验记录' : 'Experiment')}
                </span>
                <span className="text-xs text-gray-400">
                  {item.type === 'video' ? (isZh ? '视频' : 'Video') : (isZh ? '图片' : 'Image')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 导航按钮 - 优化响应式 */}
      {hasPrev && onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4
            bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full transition-all
            hover:scale-110 active:scale-95 group"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-purple-300" />
        </button>
      )}
      {hasNext && onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4
            bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full transition-all
            hover:scale-110 active:scale-95 group"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-purple-300" />
        </button>
      )}

      {/* 底部导航指示器 */}
      {totalCount && totalCount > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-2 bg-black/50 rounded-full">
          {Array.from({ length: Math.min(totalCount, 10) }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === (currentIndex || 0) ? 'bg-purple-400 w-3' : 'bg-white/30'
              }`}
            />
          ))}
          {totalCount > 10 && (
            <span className="text-xs text-white/50 ml-1">+{totalCount - 10}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}

// 分类标签
function CategoryTab({
  icon: Icon,
  label,
  active,
  onClick,
  count,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
  count: number
}) {
  const dt = useDemoTheme()
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
          : `${dt.isDark ? 'bg-slate-700/50 text-gray-400 hover:text-gray-300 hover:bg-slate-600/50' : 'bg-slate-100 text-gray-500 hover:text-gray-700 hover:bg-slate-200/50'}`
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
      <span className="text-[10px] opacity-70">({count})</span>
    </button>
  )
}

// 文创系列链接卡片
function SeriesLinkCard({
  series,
  isZh,
}: {
  series: CulturalSeries
  isZh: boolean
}) {
  const dt = useDemoTheme()
  return (
    <Link
      to="/gallery/$tabId" params={{ tabId: 'showcase' }}
      className={`group flex items-center gap-3 p-2.5 rounded-lg ${dt.panelClass} border
        hover:border-pink-500/50 transition-all ${dt.isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
    >
      <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${dt.isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <img
          src={series.thumbnail}
          alt={isZh ? series.nameZh : series.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-xs font-medium truncate group-hover:text-pink-300 transition-colors ${dt.isDark ? 'text-white' : 'text-gray-800'}`}>
          {isZh ? series.nameZh : series.name}
        </h4>
        <p className={`text-[10px] ${dt.mutedTextClass} truncate`}>
          {series.mediaCount} {isZh ? '个媒体' : 'items'}
        </p>
      </div>
      <ExternalLink className={`w-3.5 h-3.5 group-hover:text-pink-400 transition-colors flex-shrink-0 ${dt.isDark ? 'text-gray-600' : 'text-gray-500'}`} />
    </Link>
  )
}

// 主组件
export function MediaGalleryPanel() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [isExpanded, setIsExpanded] = useState(false)
  const [activeCategory, setActiveCategory] = useState<MediaCategory>('all')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  // 获取所有媒体
  const allMedia = useMemo(() => {
    const art = CULTURAL_MEDIA
      .filter(m => m.polarizationSystem === 'crossed' || m.featured)
      .map(convertCulturalMedia)

    const experiments = POLARIZATION_RESOURCES
      .filter(r => r.type !== 'sequence')
      .map(convertResource)

    return { art, experiments, all: [...art, ...experiments] }
  }, [])

  // 当前显示的媒体
  const displayedMedia = useMemo(() => {
    switch (activeCategory) {
      case 'art':
        return allMedia.art
      case 'experiment':
        return allMedia.experiments
      default:
        return allMedia.all
    }
  }, [activeCategory, allMedia])

  // 精选媒体（折叠时显示）
  const featuredMedia = useMemo(() => getFeaturedMedia(), [])

  // 处理媒体选择
  const handleSelectItem = (item: MediaItem, index: number) => {
    setSelectedItem(item)
    setSelectedIndex(index)
  }

  // 导航
  const handlePrev = () => {
    const items = isExpanded ? displayedMedia : featuredMedia
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
      setSelectedItem(items[selectedIndex - 1])
    }
  }

  const handleNext = () => {
    const items = isExpanded ? displayedMedia : featuredMedia
    if (selectedIndex < items.length - 1) {
      setSelectedIndex(selectedIndex + 1)
      setSelectedItem(items[selectedIndex + 1])
    }
  }

  return (
    <div className={cn(
      "rounded-xl border overflow-hidden",
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900/80 to-purple-950/30 border-purple-500/20'
        : 'bg-gradient-to-br from-slate-50 to-purple-50 border-purple-200'
    )}>
      {/* 头部 - 可点击展开/折叠 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between p-4 transition-colors",
          theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-purple-50'
        )}
      >
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-purple-400" />
          <h3 className={cn("text-sm font-semibold", theme === 'dark' ? 'text-white' : 'text-gray-800')}>
            {isZh ? '真实实验场景' : 'Real Experiment Scenes'}
          </h3>
          <span className={cn("text-xs", theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
            ({allMedia.all.length} {isZh ? '个' : 'items'})
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={cn("w-5 h-5", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
        </motion.div>
      </button>

      {/* 折叠状态 - 显示主要内容信息和缩略图 */}
      {!isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* 内容说明 */}
          <div className={cn(
            "flex items-start gap-3 p-3 rounded-lg border",
            theme === 'dark'
              ? 'bg-slate-800/30 border-slate-700/30'
              : 'bg-white/50 border-gray-200'
          )}>
            <Film className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className={cn("text-xs leading-relaxed", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                {isZh
                  ? '包含实验室拍摄的色偏振照片和视频：应力双折射、保鲜膜干涉、透明胶带效果等真实实验记录，以及偏振艺术文创作品展示。'
                  : 'Contains lab-captured chromatic polarization photos and videos: stress birefringence, plastic wrap interference, tape effects, and polarization art creations.'}
              </p>
              <div className={cn("flex items-center gap-3 mt-2 text-[10px]", theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                <span className="flex items-center gap-1">
                  <FlaskConical className="w-3 h-3" />
                  {allMedia.experiments.length} {isZh ? '实验记录' : 'experiments'}
                </span>
                <span className="flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  {allMedia.art.length} {isZh ? '艺术作品' : 'artworks'}
                </span>
              </div>
            </div>
          </div>

          {/* 缩略图预览 - 使用更大的网格布局 */}
          <div>
            <p className={cn("text-[10px] mb-3 uppercase tracking-wider", theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
              {isZh ? '精选预览' : 'Featured Preview'}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {featuredMedia.slice(0, 5).map((item, index) => (
                <MediaThumbnail
                  key={item.id}
                  item={item}
                  isVideo={item.type === 'video'}
                  size="md"
                  onClick={() => handleSelectItem(item, index)}
                />
              ))}
              <motion.button
                className={cn(
                  "w-28 h-28 flex-shrink-0 rounded-lg border border-dashed flex flex-col items-center justify-center transition-colors gap-1",
                  theme === 'dark'
                    ? 'border-slate-600 text-gray-500 hover:text-gray-400 hover:border-purple-500/50 hover:bg-purple-500/5'
                    : 'border-gray-300 text-gray-500 hover:text-gray-600 hover:border-purple-400 hover:bg-purple-50'
                )}
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsExpanded(true)}
              >
                <span className="text-lg font-medium">+{allMedia.all.length - 5}</span>
                <span className="text-xs">{isZh ? '查看更多' : 'View more'}</span>
              </motion.button>
            </div>
          </div>

          {/* 文创作品链接 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                {isZh ? '文创作品系列' : 'Art Series'}
              </p>
              <Link
                to="/gallery/$tabId" params={{ tabId: 'showcase' }}
                className="text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
              >
                {isZh ? '查看全部' : 'View all'}
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CULTURAL_SERIES.slice(0, 2).map(series => (
                <SeriesLinkCard
                  key={series.id}
                  series={series}
                  isZh={isZh}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 展开内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {/* 分类标签 */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <CategoryTab
                  icon={Sparkles}
                  label={isZh ? '全部' : 'All'}
                  active={activeCategory === 'all'}
                  onClick={() => setActiveCategory('all')}
                  count={allMedia.all.length}
                />
                <CategoryTab
                  icon={Palette}
                  label={isZh ? '艺术创作' : 'Art'}
                  active={activeCategory === 'art'}
                  onClick={() => setActiveCategory('art')}
                  count={allMedia.art.length}
                />
                <CategoryTab
                  icon={FlaskConical}
                  label={isZh ? '实验演示' : 'Experiments'}
                  active={activeCategory === 'experiment'}
                  onClick={() => setActiveCategory('experiment')}
                  count={allMedia.experiments.length}
                />
              </div>

              {/* 媒体网格 - 使用更大的尺寸 */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-80 overflow-y-auto pr-1">
                {displayedMedia.map((item, index) => (
                  <MediaThumbnail
                    key={item.id}
                    item={item}
                    isVideo={item.type === 'video'}
                    size="md"
                    onClick={() => handleSelectItem(item, index)}
                  />
                ))}
              </div>

              {/* 文创作品系列链接 */}
              <div className={cn("mt-4 pt-4 border-t", theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200')}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={cn("text-xs font-medium flex items-center gap-2", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                    <Palette className="w-3.5 h-3.5" />
                    {isZh ? '相关文创作品系列' : 'Related Art Series'}
                  </h4>
                  <Link
                    to="/gallery/$tabId" params={{ tabId: 'showcase' }}
                    className="text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
                  >
                    {isZh ? '浏览全部文创展示' : 'Browse all artworks'}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {CULTURAL_SERIES.map(series => (
                    <SeriesLinkCard
                      key={series.id}
                      series={series}
                      isZh={isZh}
                    />
                  ))}
                </div>
              </div>

              {/* 提示 */}
              <p className="text-xs text-gray-500 mt-3 text-center">
                {isZh
                  ? '点击图片/视频查看详情，或访问文创展示浏览更多作品'
                  : 'Click to view details, or visit the art showcase for more'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 媒体模态框 */}
      <AnimatePresence>
        {selectedItem && (
          <MediaModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={selectedIndex > 0}
            hasNext={selectedIndex < (isExpanded ? displayedMedia : featuredMedia).length - 1}
            currentIndex={selectedIndex}
            totalCount={(isExpanded ? displayedMedia : featuredMedia).length}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default MediaGalleryPanel
