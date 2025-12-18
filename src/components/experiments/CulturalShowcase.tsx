/**
 * Cultural Showcase Component (文创展示组件)
 * Displays cultural creative polarization art with secure video playback
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SecureVideoPlayer, SecureImageViewer } from '@/components/shared'
import {
  CULTURAL_SERIES,
  getMediaBySeries,
  getFeaturedMedia,
  CULTURAL_STATS,
  type CulturalMedia,
  type CulturalSeries,
} from '@/data/cultural-creations'
import {
  Play, Image as ImageIcon, Video, X,
  Sparkles, Film, Palette, Star, Grid3X3, List
} from 'lucide-react'

// ===== Series Card Component =====
interface SeriesCardProps {
  series: CulturalSeries
  onClick: () => void
}

function SeriesCard({ series, onClick }: SeriesCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
        'hover:scale-[1.02] hover:-translate-y-1',
        theme === 'dark'
          ? 'bg-slate-800/50 border border-slate-700 hover:border-pink-500/50 hover:shadow-[0_10px_40px_rgba(236,72,153,0.2)]'
          : 'bg-white border border-gray-200 hover:border-pink-400 hover:shadow-xl'
      )}
    >
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        <SecureImageViewer
          src={series.thumbnail}
          alt={isZh ? series.nameZh : series.name}
          className="w-full h-full"
        />
        {/* Overlay gradient */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        )} />
        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center',
            'bg-pink-500/80 backdrop-blur-sm'
          )}>
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          </div>
        </div>
        {/* Media count badge */}
        <div className={cn(
          'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium',
          'bg-black/50 text-white backdrop-blur-sm'
        )}>
          {series.mediaCount} {isZh ? '个媒体' : 'items'}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className={cn(
          'font-semibold mb-1 group-hover:text-pink-500 transition-colors',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? series.nameZh : series.name}
        </h3>
        <p className={cn(
          'text-sm line-clamp-2',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh ? series.descriptionZh : series.description}
        </p>
      </div>
    </div>
  )
}

// ===== Media Item Card =====
interface MediaCardProps {
  media: CulturalMedia
  onClick: () => void
  viewMode?: 'grid' | 'list'
}

function MediaCard({ media, onClick, viewMode = 'grid' }: MediaCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const isVideo = media.type === 'video'

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className={cn(
          'flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors',
          theme === 'dark'
            ? 'hover:bg-slate-700/50'
            : 'hover:bg-gray-100'
        )}
      >
        {/* Thumbnail */}
        <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
          <SecureImageViewer
            src={isVideo ? (media.thumbnail || '/images/video-placeholder.jpg') : media.path}
            alt={isZh ? media.nameZh : media.name}
            className="w-full h-full"
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="w-6 h-6 text-white" fill="white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-medium truncate',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? media.nameZh : media.name}
          </h4>
          <p className={cn(
            'text-sm truncate',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh ? media.descriptionZh : media.description}
          </p>
        </div>

        {/* Type badge */}
        <div className={cn(
          'px-2 py-1 rounded-full text-xs font-medium flex-shrink-0',
          isVideo
            ? theme === 'dark' ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-700'
            : theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
        )}>
          {isVideo ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-lg overflow-hidden cursor-pointer transition-all',
        'hover:scale-[1.03]',
        theme === 'dark'
          ? 'bg-slate-800/50 border border-slate-700/50 hover:border-pink-500/50'
          : 'bg-white border border-gray-200 hover:border-pink-300'
      )}
    >
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        <SecureImageViewer
          src={isVideo ? (media.thumbnail || '/images/video-placeholder.jpg') : media.path}
          alt={isZh ? media.nameZh : media.name}
          className="w-full h-full"
        />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-transform',
              'bg-white/90 group-hover:scale-110'
            )}>
              <Play className="w-5 h-5 text-pink-500 ml-0.5" fill="currentColor" />
            </div>
          </div>
        )}
        {/* Featured badge */}
        {media.featured && (
          <div className="absolute top-2 left-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>
        )}
        {/* Type badge */}
        <div className={cn(
          'absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs',
          'bg-black/50 text-white backdrop-blur-sm'
        )}>
          {isVideo ? 'VIDEO' : 'IMG'}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className={cn(
          'text-sm font-medium truncate',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? media.nameZh : media.name}
        </h4>
      </div>
    </div>
  )
}

// ===== Media Modal =====
interface MediaModalProps {
  media: CulturalMedia | null
  onClose: () => void
  seriesMedia?: CulturalMedia[]
  onNavigate?: (media: CulturalMedia) => void
}

function MediaModal({ media, onClose, seriesMedia, onNavigate }: MediaModalProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  if (!media) return null

  const isVideo = media.type === 'video'
  const currentIndex = seriesMedia?.findIndex(m => m.id === media.id) ?? -1
  const canGoPrev = currentIndex > 0
  const canGoNext = seriesMedia && currentIndex < seriesMedia.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full max-w-4xl rounded-xl overflow-hidden',
          theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            'absolute top-3 right-3 z-20 p-2 rounded-full transition-colors',
            theme === 'dark'
              ? 'bg-slate-800/80 text-white hover:bg-slate-700'
              : 'bg-gray-100/80 text-gray-900 hover:bg-gray-200'
          )}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media content */}
        <div className="aspect-video">
          {isVideo ? (
            <SecureVideoPlayer
              src={media.path}
              poster={media.thumbnail}
              className="w-full h-full"
              autoPlay
              loop
              muted
            />
          ) : (
            <SecureImageViewer
              src={media.path}
              alt={isZh ? media.nameZh : media.name}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Info panel */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className={cn(
                'text-lg font-semibold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? media.nameZh : media.name}
              </h3>
              <p className={cn(
                'text-sm mt-1',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh ? media.descriptionZh : media.description}
              </p>
            </div>
            <div className={cn(
              'px-2 py-1 rounded-full text-xs font-medium flex-shrink-0',
              media.polarizationSystem === 'crossed'
                ? theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                : media.polarizationSystem === 'parallel'
                  ? theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                  : theme === 'dark' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700'
            )}>
              {media.polarizationSystem === 'crossed' ? (isZh ? '正交偏振' : 'Crossed')
                : media.polarizationSystem === 'parallel' ? (isZh ? '平行偏振' : 'Parallel')
                  : (isZh ? '正视图' : 'Front View')}
            </div>
          </div>

          {/* Navigation within series */}
          {seriesMedia && seriesMedia.length > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={() => canGoPrev && onNavigate?.(seriesMedia[currentIndex - 1])}
                disabled={!canGoPrev}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  canGoPrev
                    ? theme === 'dark'
                      ? 'bg-slate-700 text-white hover:bg-slate-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : 'opacity-30 cursor-not-allowed'
                )}
              >
                ← {isZh ? '上一个' : 'Previous'}
              </button>
              <span className={cn(
                'text-sm',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                {currentIndex + 1} / {seriesMedia.length}
              </span>
              <button
                onClick={() => canGoNext && onNavigate?.(seriesMedia[currentIndex + 1])}
                disabled={!canGoNext}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  canGoNext
                    ? theme === 'dark'
                      ? 'bg-slate-700 text-white hover:bg-slate-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : 'opacity-30 cursor-not-allowed'
                )}
              >
                {isZh ? '下一个' : 'Next'} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ===== Series Detail View =====
interface SeriesDetailProps {
  series: CulturalSeries
  onBack: () => void
}

function SeriesDetail({ series, onBack }: SeriesDetailProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [selectedMedia, setSelectedMedia] = useState<CulturalMedia | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')

  const media = useMemo(() => {
    const seriesMedia = getMediaBySeries(series.id)
    if (filterType === 'all') return seriesMedia
    return seriesMedia.filter(m => m.type === filterType)
  }, [series.id, filterType])

  const allSeriesMedia = useMemo(() => getMediaBySeries(series.id), [series.id])

  return (
    <>
      {/* Back button & header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className={cn(
            'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          )}
        >
          ← {isZh ? '返回' : 'Back'}
        </button>
        <div className="flex-1">
          <h2 className={cn(
            'text-xl font-bold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? series.nameZh : series.name}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Type filter */}
        <div className="flex items-center gap-2">
          {(['all', 'image', 'video'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
                filterType === type
                  ? theme === 'dark'
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                    : 'bg-pink-100 text-pink-700 border border-pink-300'
                  : theme === 'dark'
                    ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              )}
            >
              {type === 'all' && <>{isZh ? '全部' : 'All'}</>}
              {type === 'image' && <><ImageIcon className="w-3.5 h-3.5" />{isZh ? '图片' : 'Images'}</>}
              {type === 'video' && <><Video className="w-3.5 h-3.5" />{isZh ? '视频' : 'Videos'}</>}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'grid'
                ? theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-900'
                : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'list'
                ? theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-900'
                : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Media grid/list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(item => (
            <MediaCard
              key={item.id}
              media={item}
              onClick={() => setSelectedMedia(item)}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className={cn(
          'rounded-xl border divide-y',
          theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700 divide-slate-700'
            : 'bg-white border-gray-200 divide-gray-200'
        )}>
          {media.map(item => (
            <MediaCard
              key={item.id}
              media={item}
              onClick={() => setSelectedMedia(item)}
              viewMode="list"
            />
          ))}
        </div>
      )}

      {/* Media modal */}
      <MediaModal
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        seriesMedia={allSeriesMedia}
        onNavigate={setSelectedMedia}
      />
    </>
  )
}

// ===== Main Cultural Showcase Component =====
export function CulturalShowcase() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [selectedSeries, setSelectedSeries] = useState<CulturalSeries | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<CulturalMedia | null>(null)

  const featuredMedia = useMemo(() => getFeaturedMedia(), [])

  // If a series is selected, show its detail view
  if (selectedSeries) {
    return (
      <SeriesDetail
        series={selectedSeries}
        onBack={() => setSelectedSeries(null)}
      />
    )
  }

  return (
    <>
      {/* Intro Banner */}
      <div className={cn(
        'rounded-2xl p-6 mb-8 border',
        theme === 'dark'
          ? 'bg-gradient-to-r from-pink-900/30 to-violet-900/30 border-pink-700/30'
          : 'bg-gradient-to-r from-pink-50 to-violet-50 border-pink-200'
      )}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
            theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-100'
          )}>
            <Film className={cn('w-7 h-7', theme === 'dark' ? 'text-pink-400' : 'text-pink-600')} />
          </div>
          <div className="flex-1">
            <h2 className={cn(
              'text-lg font-semibold mb-1',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '偏振艺术文创展示' : 'Polarization Art Showcase'}
            </h2>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh
                ? '真实的偏振光文创作品展示，包括图片和视频。通过旋转偏振片或样品，观察美丽的色偏振效果。'
                : 'Real polarization art creations including images and videos. See beautiful chromatic polarization by rotating polarizers or samples.'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className={cn(
              'flex items-center gap-1.5',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              <ImageIcon className="w-4 h-4" />
              <span>{CULTURAL_STATS.totalImages}</span>
            </div>
            <div className={cn(
              'flex items-center gap-1.5',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              <Video className="w-4 h-4" />
              <span>{CULTURAL_STATS.totalVideos}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Media Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Star className={cn('w-5 h-5', theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500')} />
          <h3 className={cn(
            'text-lg font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '精选作品' : 'Featured Works'}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredMedia.slice(0, 8).map(item => (
            <MediaCard
              key={item.id}
              media={item}
              onClick={() => setSelectedMedia(item)}
              viewMode="grid"
            />
          ))}
        </div>
      </div>

      {/* Series Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Palette className={cn('w-5 h-5', theme === 'dark' ? 'text-pink-400' : 'text-pink-500')} />
          <h3 className={cn(
            'text-lg font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '作品系列' : 'Art Series'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CULTURAL_SERIES.map(series => (
            <SeriesCard
              key={series.id}
              series={series}
              onClick={() => setSelectedSeries(series)}
            />
          ))}
        </div>
      </div>

      {/* Science Note */}
      <div className={cn(
        'rounded-xl border p-5',
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
            theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
          )}>
            <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
          </div>
          <div>
            <h4 className={cn(
              'font-semibold mb-1',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '关于色偏振效果' : 'About Chromatic Polarization'}
            </h4>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh
                ? '这些作品利用双折射材料（如透明胶带）在正交偏振片之间产生的干涉效果。当光通过双折射材料时，分解为两个正交偏振态，产生相位差，从而呈现出绚丽的干涉色彩。旋转偏振片或样品会改变颜色，这正是马吕斯定律的完美体现！'
                : 'These artworks utilize the interference effect of birefringent materials (like transparent tape) between crossed polarizers. When light passes through birefringent material, it splits into two orthogonal polarization states, creating phase differences that produce beautiful interference colors. Rotating the polarizer or sample changes the colors - a perfect demonstration of Malus\'s Law!'}
            </p>
          </div>
        </div>
      </div>

      {/* Media Modal */}
      <MediaModal
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </>
  )
}
