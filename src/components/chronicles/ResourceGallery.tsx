/**
 * ResourceGallery - 可展开的资源画廊
 * 展示与时间线事件相关的实验图片和视频
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Image, Film, ChevronLeft, ChevronRight, ChevronDown, Camera, Beaker } from 'lucide-react'
import { getResourceById, type PolarizationResource } from '@/data/resource-gallery'
import type { TimelineEvent } from '@/data/timeline-events'

export interface ResourceGalleryProps {
  resources: TimelineEvent['experimentalResources']
  isZh: boolean
  theme: 'dark' | 'light'
  compact?: boolean // 紧凑模式用于卡片内展示
}

export function ResourceGallery({ resources, isZh, theme, compact = false }: ResourceGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'images' | 'video'>('images')

  if (!resources) return null

  // 获取关联的资源数据
  const linkedResources = resources.resourceIds
    ?.map(id => getResourceById(id))
    .filter((r): r is PolarizationResource => r !== undefined) || []

  // 图片类型定义
  type ImageItem = {
    url: string
    caption: string | undefined
    type: 'featured' | 'sequence' | 'linked'
  }

  // 合并特色图片和资源库图片
  const featuredImgs: ImageItem[] = (resources.featuredImages || []).map(img => ({
    url: img.url,
    caption: isZh ? img.captionZh : img.caption,
    type: 'featured' as const
  }))

  const linkedImgs: ImageItem[] = linkedResources
    .filter(r => r.type === 'image' || r.type === 'sequence')
    .reduce<ImageItem[]>((acc, r) => {
      if (r.type === 'sequence' && r.frames) {
        const sequenceItems: ImageItem[] = r.frames.map(f => ({
          url: f.url,
          caption: isZh ? f.labelZh : f.label,
          type: 'sequence' as const
        }))
        return [...acc, ...sequenceItems]
      }
      return [...acc, {
        url: r.url,
        caption: isZh ? r.titleZh : r.title,
        type: 'linked' as const
      }]
    }, [])

  const allImages: ImageItem[] = [...featuredImgs, ...linkedImgs]

  // 获取视频资源
  const videoResource = resources.featuredVideo || linkedResources.find(r => r.type === 'video')
  const videoUrl = resources.featuredVideo?.url || (videoResource as PolarizationResource | undefined)?.url
  const videoTitle = resources.featuredVideo
    ? (isZh ? resources.featuredVideo.titleZh : resources.featuredVideo.title)
    : videoResource
      ? (isZh ? videoResource.titleZh : videoResource.title)
      : undefined

  const hasContent = allImages.length > 0 || videoUrl

  if (!hasContent) return null

  // 紧凑模式 - 用于时间线卡片展开时的内嵌展示
  if (compact) {
    return (
      <div className={cn(
        'mt-3 rounded-lg overflow-hidden border',
        theme === 'dark'
          ? 'bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border-cyan-800/50'
          : 'bg-gradient-to-r from-cyan-50 to-purple-50 border-cyan-200'
      )}>
        {/* 展开按钮 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 transition-colors',
            theme === 'dark'
              ? 'hover:bg-white/5'
              : 'hover:bg-black/5'
          )}
        >
          <div className="flex items-center gap-2">
            <div className={cn(
              'p-1.5 rounded-md',
              theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
            )}>
              <Camera className={cn(
                'w-3.5 h-3.5',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )} />
            </div>
            <span className={cn(
              'text-xs font-medium',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
            )}>
              {isZh ? '实验资源' : 'Experimental Resources'}
            </span>
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-full',
              theme === 'dark'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'bg-cyan-100 text-cyan-600'
            )}>
              {allImages.length} {isZh ? '图' : 'img'}{videoUrl ? ` + 1 ${isZh ? '视频' : 'vid'}` : ''}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className={cn(
              'w-4 h-4',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )} />
          </motion.div>
        </button>

        {/* 展开的内容 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3">
                {/* Tab 切换 */}
                {videoUrl && allImages.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setActiveTab('images')}
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
                        activeTab === 'images'
                          ? theme === 'dark'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-cyan-100 text-cyan-700'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-gray-300'
                            : 'text-gray-500 hover:text-gray-700'
                      )}
                    >
                      <Image className="w-3 h-3" />
                      {isZh ? '图片' : 'Images'} ({allImages.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('video')}
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
                        activeTab === 'video'
                          ? theme === 'dark'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-purple-100 text-purple-700'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-gray-300'
                            : 'text-gray-500 hover:text-gray-700'
                      )}
                    >
                      <Film className="w-3 h-3" />
                      {isZh ? '视频' : 'Video'}
                    </button>
                  </div>
                )}

                {/* 图片展示 */}
                {(activeTab === 'images' || !videoUrl) && allImages.length > 0 && (
                  <div>
                    {/* 主图 */}
                    <div className={cn(
                      'relative rounded-lg overflow-hidden mb-2',
                      theme === 'dark' ? 'bg-black/50' : 'bg-gray-100'
                    )}>
                      <img
                        src={allImages[selectedImage].url}
                        alt={allImages[selectedImage].caption || ''}
                        className="w-full h-48 object-contain"
                      />
                      {allImages[selectedImage].caption && (
                        <div className={cn(
                          'absolute bottom-0 left-0 right-0 px-2 py-1.5 text-xs',
                          theme === 'dark'
                            ? 'bg-gradient-to-t from-black/90 via-black/70 to-transparent text-gray-200'
                            : 'bg-gradient-to-t from-white/95 via-white/80 to-transparent text-gray-700'
                        )}>
                          {allImages[selectedImage].caption}
                        </div>
                      )}
                    </div>
                    {/* 缩略图轮播 */}
                    {allImages.length > 1 && (
                      <div className="flex gap-1 overflow-x-auto pb-1">
                        {allImages.slice(0, 8).map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedImage(i)}
                            className={cn(
                              'flex-shrink-0 w-12 h-9 rounded overflow-hidden border-2 transition-all',
                              selectedImage === i
                                ? theme === 'dark'
                                  ? 'border-cyan-400'
                                  : 'border-cyan-500'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            )}
                          >
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                        {allImages.length > 8 && (
                          <span className={cn(
                            'flex items-center justify-center w-12 h-9 text-xs rounded',
                            theme === 'dark'
                              ? 'bg-slate-700 text-gray-400'
                              : 'bg-gray-100 text-gray-500'
                          )}>
                            +{allImages.length - 8}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 视频展示 */}
                {activeTab === 'video' && videoUrl && (
                  <div className={cn(
                    'relative rounded-lg overflow-hidden',
                    theme === 'dark' ? 'bg-black/50' : 'bg-black'
                  )}>
                    <video
                      src={videoUrl}
                      className="w-full h-48 object-contain bg-black"
                      controls
                      preload="metadata"
                    />
                    {videoTitle && (
                      <div className={cn(
                        'px-2 py-1.5 text-xs',
                        theme === 'dark'
                          ? 'bg-slate-800/90 text-gray-200'
                          : 'bg-gray-100 text-gray-700'
                      )}>
                        <Film className="w-3 h-3 inline mr-1.5 text-purple-400" />
                        {videoTitle}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // 完整模式 - 用于 StoryModal 中的展示
  return (
    <div className={cn(
      'rounded-xl border overflow-hidden',
      theme === 'dark'
        ? 'bg-gradient-to-br from-cyan-900/20 via-slate-800/50 to-purple-900/20 border-cyan-800/50'
        : 'bg-gradient-to-br from-cyan-50 via-white to-purple-50 border-cyan-200'
    )}>
      {/* 标题栏 */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 border-b',
        theme === 'dark'
          ? 'border-cyan-800/50 bg-black/20'
          : 'border-cyan-200 bg-white/50'
      )}>
        <div className={cn(
          'p-2 rounded-lg',
          theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
        )}>
          <Beaker className={cn(
            'w-5 h-5',
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          )} />
        </div>
        <div>
          <h4 className={cn(
            'text-sm font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '实验资源画廊' : 'Experimental Resources Gallery'}
          </h4>
          <p className={cn(
            'text-xs',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {isZh
              ? `${allImages.length} 张图片${videoUrl ? '，1 个视频' : ''}`
              : `${allImages.length} images${videoUrl ? ', 1 video' : ''}`
            }
          </p>
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-4">
        {/* Tab 切换 */}
        {videoUrl && allImages.length > 0 && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('images')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === 'images'
                  ? theme === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <Image className="w-4 h-4" />
              {isZh ? '实验图片' : 'Experiment Photos'} ({allImages.length})
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === 'video'
                  ? theme === 'dark'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-purple-100 text-purple-700 border border-purple-300'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <Film className="w-4 h-4" />
              {isZh ? '实验视频' : 'Experiment Video'}
            </button>
          </div>
        )}

        {/* 图片画廊 */}
        {(activeTab === 'images' || !videoUrl) && allImages.length > 0 && (
          <div>
            {/* 主图展示 */}
            <div className={cn(
              'relative rounded-xl overflow-hidden mb-4',
              theme === 'dark' ? 'bg-black/40' : 'bg-white shadow-md'
            )}>
              <motion.img
                key={selectedImage}
                src={allImages[selectedImage].url}
                alt={allImages[selectedImage].caption || ''}
                className="w-full h-64 object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {allImages[selectedImage].caption && (
                <div className={cn(
                  'absolute bottom-0 left-0 right-0 px-4 py-3',
                  theme === 'dark'
                    ? 'bg-gradient-to-t from-black/80 to-transparent'
                    : 'bg-gradient-to-t from-black/60 to-transparent'
                )}>
                  <p className="text-sm text-white">
                    {allImages[selectedImage].caption}
                  </p>
                </div>
              )}
              {/* 导航按钮 */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(i => (i - 1 + allImages.length) % allImages.length)}
                    className={cn(
                      'absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full',
                      'bg-black/50 hover:bg-black/70 text-white transition-colors'
                    )}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(i => (i + 1) % allImages.length)}
                    className={cn(
                      'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full',
                      'bg-black/50 hover:bg-black/70 text-white transition-colors'
                    )}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {/* 图片计数 */}
              <div className={cn(
                'absolute top-3 right-3 px-2 py-1 rounded-full text-xs',
                'bg-black/50 text-white'
              )}>
                {selectedImage + 1} / {allImages.length}
              </div>
            </div>

            {/* 缩略图网格 */}
            <div className="grid grid-cols-6 gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'aspect-video rounded-lg overflow-hidden border-2 transition-all',
                    selectedImage === i
                      ? theme === 'dark'
                        ? 'border-cyan-400 ring-2 ring-cyan-400/30'
                        : 'border-cyan-500 ring-2 ring-cyan-500/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 视频播放 */}
        {activeTab === 'video' && videoUrl && (
          <div className={cn(
            'relative rounded-xl overflow-hidden',
            theme === 'dark' ? 'bg-black' : 'bg-black'
          )}>
            <video
              src={videoUrl}
              className="w-full h-64 object-contain bg-black"
              controls
              preload="metadata"
            />
            {videoTitle && (
              <div className={cn(
                'px-4 py-2 text-sm',
                theme === 'dark' ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'
              )}>
                <Film className="w-4 h-4 inline mr-2 text-purple-400" />
                {videoTitle}
              </div>
            )}
          </div>
        )}

        {/* 相关模块链接 */}
        {resources.relatedModules && resources.relatedModules.length > 0 && (
          <div className={cn(
            'mt-4 pt-4 border-t',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}>
            <p className={cn(
              'text-xs mb-2',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '相关学习模块：' : 'Related Learning Modules:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {resources.relatedModules.map((module, i) => (
                <span
                  key={i}
                  className={cn(
                    'px-2 py-1 text-xs rounded-full',
                    theme === 'dark'
                      ? 'bg-slate-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {module}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

