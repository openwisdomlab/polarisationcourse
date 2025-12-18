/**
 * 色偏振媒体画廊面板
 * 渐进式呈现色偏振相关的图片和视频资源
 * - 真实实验场景展示（照片/视频）
 * - 关联到文创作品子模块
 */
import type { ComponentType } from 'react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
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
  size?: 'sm' | 'md' | 'lg'
}) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  return (
    <motion.button
      className={`${sizeClasses[size]} relative rounded-lg overflow-hidden border border-slate-600/50
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

// 媒体模态框
function MediaModal({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  item: MediaItem
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  hasPrev?: boolean
  hasNext?: boolean
}) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl max-h-[90vh] w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 媒体内容 */}
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
          {item.type === 'video' ? (
            <video
              src={item.path}
              controls
              autoPlay
              loop
              className="w-full max-h-[70vh] object-contain bg-black"
            />
          ) : (
            <img
              src={item.path}
              alt={isZh ? item.nameZh : item.name}
              className="w-full max-h-[70vh] object-contain"
            />
          )}

          {/* 信息栏 */}
          <div className="p-4 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white">
              {isZh ? item.nameZh : item.name}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {isZh ? item.descriptionZh : item.description}
            </p>
          </div>
        </div>

        {/* 导航按钮 */}
        {hasPrev && onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2
              bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        {hasNext && onNext && (
          <button
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2
              bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </motion.div>
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
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
          : 'bg-slate-700/50 text-gray-400 hover:text-gray-300 hover:bg-slate-600/50'
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
  return (
    <Link
      to={`/experiments?tab=cultural&series=${series.id}`}
      className="group flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50
        hover:border-pink-500/50 hover:bg-slate-800 transition-all"
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900">
        <img
          src={series.thumbnail}
          alt={isZh ? series.nameZh : series.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-medium text-white truncate group-hover:text-pink-300 transition-colors">
          {isZh ? series.nameZh : series.name}
        </h4>
        <p className="text-[10px] text-gray-500 truncate">
          {series.mediaCount} {isZh ? '个媒体' : 'items'}
        </p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-pink-400 transition-colors flex-shrink-0" />
    </Link>
  )
}

// 主组件
export function MediaGalleryPanel() {
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
    <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-purple-950/30
      border border-purple-500/20 overflow-hidden">
      {/* 头部 - 可点击展开/折叠 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">
            {isZh ? '真实实验场景' : 'Real Experiment Scenes'}
          </h3>
          <span className="text-xs text-gray-500">
            ({allMedia.all.length} {isZh ? '个' : 'items'})
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      {/* 折叠状态 - 显示主要内容信息和缩略图 */}
      {!isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* 内容说明 */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
            <Film className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-300 leading-relaxed">
                {isZh
                  ? '包含实验室拍摄的色偏振照片和视频：应力双折射、保鲜膜干涉、透明胶带效果等真实实验记录，以及偏振艺术文创作品展示。'
                  : 'Contains lab-captured chromatic polarization photos and videos: stress birefringence, plastic wrap interference, tape effects, and polarization art creations.'}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
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

          {/* 缩略图预览 */}
          <div>
            <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-wider">
              {isZh ? '精选预览' : 'Featured Preview'}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {featuredMedia.slice(0, 6).map((item, index) => (
                <MediaThumbnail
                  key={item.id}
                  item={item}
                  isVideo={item.type === 'video'}
                  size="sm"
                  onClick={() => handleSelectItem(item, index)}
                />
              ))}
              <motion.button
                className="w-16 h-16 flex-shrink-0 rounded-lg border border-dashed border-slate-600
                  flex flex-col items-center justify-center text-gray-500 hover:text-gray-400
                  hover:border-slate-500 transition-colors gap-0.5"
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsExpanded(true)}
              >
                <span className="text-xs font-medium">+{allMedia.all.length - 6}</span>
                <span className="text-[8px]">{isZh ? '更多' : 'more'}</span>
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
                to="/experiments?tab=cultural"
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

              {/* 媒体网格 */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                {displayedMedia.map((item, index) => (
                  <MediaThumbnail
                    key={item.id}
                    item={item}
                    isVideo={item.type === 'video'}
                    size="sm"
                    onClick={() => handleSelectItem(item, index)}
                  />
                ))}
              </div>

              {/* 文创作品系列链接 */}
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-medium text-gray-400 flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5" />
                    {isZh ? '相关文创作品系列' : 'Related Art Series'}
                  </h4>
                  <Link
                    to="/experiments?tab=cultural"
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
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default MediaGalleryPanel
