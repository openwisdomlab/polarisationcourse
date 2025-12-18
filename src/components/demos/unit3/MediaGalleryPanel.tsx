/**
 * 色偏振媒体画廊面板
 * 渐进式呈现色偏振相关的图片和视频资源
 */
import type { ComponentType } from 'react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FlaskConical,
  Palette
} from 'lucide-react'
import {
  CULTURAL_MEDIA,
  type CulturalMedia,
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
      {/* 头部 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">
            {isZh ? '色偏振实例展示' : 'Chromatic Polarization Examples'}
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

      {/* 精选预览（始终显示） */}
      {!isExpanded && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 mb-3">
            {isZh ? '点击查看色偏振艺术与实验实例' : 'Click to explore chromatic polarization art and experiments'}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {featuredMedia.slice(0, 8).map((item, index) => (
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
                flex items-center justify-center text-gray-500 hover:text-gray-400
                hover:border-slate-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsExpanded(true)}
            >
              <span className="text-xs">+{allMedia.all.length - 8}</span>
            </motion.button>
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

              {/* 提示 */}
              <p className="text-xs text-gray-500 mt-3 text-center">
                {isZh
                  ? '点击图片/视频查看详情，探索色偏振的美丽世界'
                  : 'Click to view details and explore the beautiful world of chromatic polarization'}
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
