/**
 * Timeline Events Data Types
 * 光的编年史 - 时间线事件数据类型定义
 */

export interface TimelineEvent {
  year: number
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  scientistEn?: string
  scientistZh?: string
  category: 'discovery' | 'theory'
  importance: 1 | 2 | 3 // 1 = major milestone, 2 = significant, 3 = notable
  // 双轨分类: 'optics' = 广义光学, 'polarization' = 偏振光专属
  track: 'optics' | 'polarization'
  details?: {
    en: string[]
    zh: string[]
  }
  // 生动的故事叙述
  story?: {
    en: string
    zh: string
  }
  // 科学家生平
  scientistBio?: {
    birthYear?: number
    deathYear?: number
    nationality?: string
    portraitEmoji?: string
    bioEn?: string
    bioZh?: string
  }
  // 历史场景
  scene?: {
    location?: string
    season?: string
    mood?: string
  }
  // 参考文献 (用于事实核查)
  references?: {
    title: string
    url?: string
  }[]
  // 故事真实性标注
  historicalNote?: {
    en: string
    zh: string
  }
  // 思考问题 - 激发学生好奇心
  thinkingQuestion?: {
    en: string
    zh: string
  }
  // 实验配图 - 经典实验的可视化
  illustrationType?: 'prism' | 'double-slit' | 'calcite' | 'reflection' | 'polarizer' | 'lcd' | 'mantis' | 'wave' | 'birefringence' | 'nicol' | 'faraday' | 'chirality' | 'rayleigh' | 'poincare' | 'photoelectric' | 'jones' | 'snell' | 'lightspeed' | 'opticalactivity' | 'transverse' | 'stokes' | 'mueller' | 'medical' | 'metasurface' | 'quantum' | 'chromaticpol'
  // 实验资源 - 关联的图片和视频资源（用于可展开的资源画廊）
  experimentalResources?: {
    // 资源ID数组，引用 resource-gallery.ts 中的资源
    resourceIds?: string[]
    // 特色资源（在时间线卡片中直接展示）
    featuredImages?: {
      url: string
      caption?: string
      captionZh?: string
    }[]
    featuredVideo?: {
      url: string
      title?: string
      titleZh?: string
    }
    // 多个视频资源（用于展示多个相关实验视频）
    featuredVideos?: {
      url: string
      title?: string
      titleZh?: string
    }[]
    // 相关模块链接
    relatedModules?: string[]
  }
  // 双轨连接 - 跨轨道因果关系
  linkTo?: {
    year: number
    trackTarget: 'optics' | 'polarization'
    descriptionEn: string
    descriptionZh: string
  }
}
