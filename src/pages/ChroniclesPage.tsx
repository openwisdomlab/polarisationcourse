/**
 * Chronicles Page - History of Light and Polarization
 * 光的编年史 - 双线叙事：广义光学 + 偏振光
 *
 * Interactive dual-timeline showcasing key discoveries:
 * - Left track: General optics history (核心光学发现)
 * - Right track: Polarization-specific history (偏振光专属旅程)
 */

import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { Tabs, Badge, PersistentHeader } from '@/components/shared'
import {
  Clock, MapPin,
  FlaskConical, BookOpen,
  Sun, Sparkles, Camera, Film,
  Beaker,
  RefreshCw
} from 'lucide-react'

// Data imports
import { TIMELINE_EVENTS } from '@/data/timeline-events'
import { CATEGORY_LABELS } from '@/data/chronicles-constants'
import { PSRT_CURRICULUM } from '@/data/psrt-curriculum'

// Component imports
import {
  DualTrackCard,
  StoryModal,
  CenturyNavigator,
  ChapterSelector,
  ChroniclesPSRTView,
  ExperimentResourcesTab,
  DEMO_ITEMS
} from '@/components/chronicles'

// Visible tabs - reordered: resources (default), timeline, psrt
const TABS = [
  { id: 'resources', label: 'Experiment Gallery', labelZh: '实验资源库', icon: <Beaker className="w-4 h-4" /> },
  { id: 'timeline', label: 'Timeline', labelZh: '时间线', icon: <Clock className="w-4 h-4" /> },
  { id: 'psrt', label: 'Course Outline', labelZh: '课程大纲', icon: <BookOpen className="w-4 h-4" /> },
]


// ============================================================
// Cool Facts Section - 偏振光知识和历史事件随机展示
// ============================================================

type CoolFactType = 'knowledge' | 'history' | 'experiment' | 'daily'

interface CoolFact {
  type: CoolFactType
  year?: number
  titleEn: string
  titleZh: string
  contentEn: string
  contentZh: string
  scientistEn?: string
  scientistZh?: string
}

const COOL_FACTS: CoolFact[] = [
  // 历史事件
  {
    type: 'history', year: 1669,
    titleEn: 'Discovery of Double Refraction', titleZh: '双折射现象的发现',
    contentEn: 'A calcite crystal splits light in two, revealing polarization',
    contentZh: '方解石将一束光一分为二，偏振首次显现',
    scientistEn: 'Erasmus Bartholin', scientistZh: '巴托林',
  },
  {
    type: 'history', year: 1808,
    titleEn: 'Polarization by Reflection', titleZh: '反射偏振的发现',
    contentEn: 'Light reflected from glass becomes polarized',
    contentZh: '透过方解石观察卢森堡宫窗户的反射光',
    scientistEn: 'Etienne-Louis Malus', scientistZh: '马吕斯',
  },
  {
    type: 'history', year: 1809,
    titleEn: "Malus's Law", titleZh: '马吕斯定律',
    contentEn: 'I = I₀cos²θ — the fundamental law of polarization',
    contentZh: 'I = I₀cos²θ — 偏振光学的基本定律',
    scientistEn: 'Etienne-Louis Malus', scientistZh: '马吕斯',
  },
  {
    type: 'history', year: 1812,
    titleEn: "Brewster's Angle", titleZh: '布儒斯特角',
    contentEn: 'The angle at which reflected light is completely polarized',
    contentZh: '反射光完全偏振的特定角度',
    scientistEn: 'David Brewster', scientistZh: '布儒斯特',
  },
  {
    type: 'history', year: 1817,
    titleEn: 'Transverse Wave Theory', titleZh: '横波理论',
    contentEn: 'Polarization proves light is a transverse wave',
    contentZh: '偏振现象证明光是横波',
    scientistEn: 'Augustin-Jean Fresnel', scientistZh: '菲涅尔',
  },
  {
    type: 'history', year: 1845,
    titleEn: 'Faraday Effect', titleZh: '法拉第效应',
    contentEn: 'Magnetic field rotates polarized light in glass',
    contentZh: '磁场旋转玻璃中偏振光的平面',
    scientistEn: 'Michael Faraday', scientistZh: '法拉第',
  },
  {
    type: 'history', year: 1929,
    titleEn: 'Polaroid Filter', titleZh: '宝丽来偏振片',
    contentEn: 'First synthetic polarizer revolutionizes applications',
    contentZh: '第一种合成偏振片，彻底改变偏振应用',
    scientistEn: 'Edwin Land', scientistZh: '兰德',
  },
  // 偏振光知识
  {
    type: 'knowledge',
    titleEn: 'Why Sunglasses Work', titleZh: '偏振太阳镜原理',
    contentEn: 'Polarized sunglasses block glare because reflected light is horizontally polarized',
    contentZh: '偏振太阳镜能减少眩光，因为反射光是水平偏振的',
  },
  {
    type: 'knowledge',
    titleEn: 'LCD Screen Secret', titleZh: '液晶屏幕的秘密',
    contentEn: 'LCD displays use polarized light — try rotating a polarizer in front of your screen!',
    contentZh: '液晶显示屏利用偏振光工作——试试用偏振片对着屏幕旋转！',
  },
  {
    type: 'knowledge',
    titleEn: '3D Cinema Magic', titleZh: '3D电影的魔法',
    contentEn: '3D movies use circular polarization to send different images to each eye',
    contentZh: '3D电影利用圆偏振光向左右眼分别发送不同图像',
  },
  {
    type: 'knowledge',
    titleEn: 'Bee Navigation', titleZh: '蜜蜂导航术',
    contentEn: 'Bees can see polarized skylight and use it to navigate even on cloudy days',
    contentZh: '蜜蜂能看到天空中的偏振光，即使阴天也能用它导航',
  },
  {
    type: 'knowledge',
    titleEn: 'Stress Photography', titleZh: '应力可视化',
    contentEn: 'Engineers use polarized light to see stress patterns in transparent materials',
    contentZh: '工程师用偏振光观察透明材料中的应力分布',
  },
  {
    type: 'knowledge',
    titleEn: 'Sugar Detection', titleZh: '糖度检测',
    contentEn: 'Sugar solutions rotate polarized light — this is how sugar content is measured',
    contentZh: '糖溶液能旋转偏振光——糖度计就是利用这个原理',
  },
  {
    type: 'knowledge',
    titleEn: 'Rainbow Secrets', titleZh: '彩虹的秘密',
    contentEn: 'Light from rainbows is partially polarized, especially at 42° from the sun',
    contentZh: '彩虹的光是部分偏振的，尤其在与太阳成42°角时',
  },
  // 小实验
  {
    type: 'experiment',
    titleEn: 'Tape Art Experiment', titleZh: '胶带艺术实验',
    contentEn: 'Layer transparent tape on glass, view between crossed polarizers to create colorful birefringence art',
    contentZh: '在玻璃上层叠透明胶带，用交叉偏振片观察，可以创造出彩色双折射艺术',
  },
  {
    type: 'experiment',
    titleEn: 'Screen Polarization Test', titleZh: '屏幕偏振测试',
    contentEn: 'Rotate polarized sunglasses in front of your phone screen — watch it go dark at 90°!',
    contentZh: '在手机屏幕前旋转偏振太阳镜——旋转90°时屏幕会变黑！',
  },
  {
    type: 'experiment',
    titleEn: 'Sugar Water Rotation', titleZh: '糖水旋光实验',
    contentEn: 'Shine light through sugar water between polarizers — different concentrations create different colors',
    contentZh: '让光线穿过偏振片之间的糖水——不同浓度会产生不同颜色',
  },
  {
    type: 'experiment',
    titleEn: 'Plastic Stress Patterns', titleZh: '塑料应力图案',
    contentEn: 'Bend a clear plastic ruler between crossed polarizers to see rainbow stress patterns',
    contentZh: '在交叉偏振片间弯曲透明塑料尺，可以看到彩虹应力图案',
  },
  {
    type: 'experiment',
    titleEn: 'Sky Polarization Map', titleZh: '天空偏振地图',
    contentEn: 'Use polarized sunglasses to scan the sky — the polarization pattern changes with sun position',
    contentZh: '用偏振太阳镜扫描天空——偏振图案会随太阳位置变化',
  },
  // 生活中的偏振
  {
    type: 'daily',
    titleEn: 'Camera Filters', titleZh: '相机偏振滤镜',
    contentEn: 'Photographers use polarizing filters to reduce reflections and enhance sky contrast',
    contentZh: '摄影师使用偏振滤镜减少反射并增强天空对比度',
  },
  {
    type: 'daily',
    titleEn: 'Car Windshields', titleZh: '汽车挡风玻璃',
    contentEn: 'Some car windshields have polarizing layers to reduce dashboard reflections',
    contentZh: '一些汽车挡风玻璃有偏振涂层，用于减少仪表盘反射',
  },
  {
    type: 'daily',
    titleEn: 'Fishing Glasses', titleZh: '钓鱼眼镜',
    contentEn: 'Anglers use polarized glasses to see through water surface glare and spot fish',
    contentZh: '钓鱼者使用偏振眼镜穿透水面眩光来发现鱼',
  },
  {
    type: 'daily',
    titleEn: 'LCD Displays Everywhere', titleZh: '无处不在的液晶屏',
    contentEn: 'Every LCD screen uses two polarizers — your phone, laptop, TV, and digital watch',
    contentZh: '每个液晶屏都使用两个偏振片——你的手机、笔记本、电视和电子手表',
  },
  {
    type: 'daily',
    titleEn: 'Stress Testing Glass', titleZh: '玻璃应力检测',
    contentEn: 'Engineers use polarized light to detect stress in glass windows and safety equipment',
    contentZh: '工程师使用偏振光检测玻璃窗和安全设备中的应力',
  },
  {
    type: 'daily',
    titleEn: 'Scientific Microscopy', titleZh: '科学显微镜',
    contentEn: 'Geologists identify minerals using polarizing microscopes — each crystal has unique patterns',
    contentZh: '地质学家使用偏光显微镜鉴定矿物——每种晶体都有独特图案',
  },
]

const COOL_FACT_CATEGORIES: CoolFactType[] = ['history', 'knowledge', 'experiment', 'daily']

function getFactsByType(type: CoolFactType): CoolFact[] {
  return COOL_FACTS.filter(f => f.type === type)
}

const COOL_FACT_TYPE_LABELS: Record<CoolFactType, { en: string; zh: string; color: string }> = {
  history: { en: 'History', zh: '历史', color: 'amber' },
  knowledge: { en: 'Fun Fact', zh: '知识', color: 'cyan' },
  experiment: { en: 'Try It', zh: '小实验', color: 'emerald' },
  daily: { en: 'Daily Life', zh: '生活应用', color: 'violet' },
}

function getRandomFacts(): [CoolFact, CoolFact] {
  const stored = localStorage.getItem('polarcraft_cool_facts_v2')
  if (stored) {
    try {
      const { indices, types, timestamp } = JSON.parse(stored)
      if (Date.now() - timestamp < 3600000) {
        const factsByType1 = getFactsByType(types[0])
        const factsByType2 = getFactsByType(types[1])
        if (factsByType1[indices[0]] && factsByType2[indices[1]]) {
          return [factsByType1[indices[0]], factsByType2[indices[1]]]
        }
      }
    } catch { /* ignore */ }
  }
  return refreshFacts()
}

function refreshFacts(): [CoolFact, CoolFact] {
  const shuffledTypes = [...COOL_FACT_CATEGORIES].sort(() => Math.random() - 0.5)
  const type1 = shuffledTypes[0]
  const type2 = shuffledTypes[1]
  const facts1 = getFactsByType(type1)
  const facts2 = getFactsByType(type2)
  const index1 = Math.floor(Math.random() * facts1.length)
  const index2 = Math.floor(Math.random() * facts2.length)

  localStorage.setItem('polarcraft_cool_facts_v2', JSON.stringify({
    indices: [index1, index2],
    types: [type1, type2],
    timestamp: Date.now()
  }))

  return [facts1[index1], facts2[index2]]
}

function CoolFactCard({ fact, theme, isZh }: { fact: CoolFact; theme: 'dark' | 'light'; isZh: boolean }) {
  const typeColors: Record<CoolFactType, { bg: string; text: string; iconBg: string; iconColor: string }> = {
    history: {
      bg: theme === 'dark' ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700',
      text: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
      iconBg: theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100',
      iconColor: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
    },
    knowledge: {
      bg: theme === 'dark' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700',
      text: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
      iconBg: theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100',
      iconColor: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
    },
    experiment: {
      bg: theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
      text: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600',
      iconBg: theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100',
      iconColor: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600',
    },
    daily: {
      bg: theme === 'dark' ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700',
      text: theme === 'dark' ? 'text-violet-400' : 'text-violet-600',
      iconBg: theme === 'dark' ? 'bg-violet-500/20' : 'bg-violet-100',
      iconColor: theme === 'dark' ? 'text-violet-400' : 'text-violet-600',
    },
  }

  const colors = typeColors[fact.type]

  return (
    <div className="flex items-start gap-3">
      <div className={cn('flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center', colors.iconBg)}>
        <Sparkles className={cn('w-4 h-4', colors.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {fact.year && (
            <span className={cn('text-sm font-bold tabular-nums', colors.text)}>{fact.year}</span>
          )}
          <span className={cn('text-xs px-1.5 py-0.5 rounded', colors.bg)}>
            {isZh ? COOL_FACT_TYPE_LABELS[fact.type].zh : COOL_FACT_TYPE_LABELS[fact.type].en}
          </span>
        </div>
        <h4 className={cn('text-sm font-semibold mb-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          {isZh ? fact.titleZh : fact.titleEn}
        </h4>
        <p className={cn('text-xs leading-relaxed', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          {isZh ? fact.contentZh : fact.contentEn}
        </p>
        {fact.scientistEn && (
          <p className={cn('text-[10px] italic mt-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
            — {isZh ? fact.scientistZh : fact.scientistEn}
          </p>
        )}
      </div>
    </div>
  )
}

function CoolFactsSection({ theme, isZh }: { theme: 'dark' | 'light'; isZh: boolean }) {
  const [facts, setFacts] = useState<[CoolFact, CoolFact]>(getRandomFacts)

  const handleRefresh = () => {
    setFacts(refreshFacts())
  }

  return (
    <div className={cn(
      'mt-10 p-5 rounded-xl border',
      theme === 'dark'
        ? 'bg-slate-800/50 border-slate-700/50'
        : 'bg-white/70 border-gray-200'
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn(
          'text-sm font-semibold',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        )}>
          {isZh ? '你知道吗？' : 'Did You Know?'}
        </h3>
        <button
          onClick={handleRefresh}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors',
            theme === 'dark'
              ? 'text-gray-400 hover:text-cyan-400 hover:bg-slate-700'
              : 'text-gray-500 hover:text-cyan-600 hover:bg-gray-100'
          )}
        >
          <RefreshCw className="w-3 h-3" />
          {isZh ? '换一换' : 'Refresh'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <CoolFactCard fact={facts[0]} theme={theme} isZh={isZh} />
        <CoolFactCard fact={facts[1]} theme={theme} isZh={isZh} />
      </div>
    </div>
  )
}

export function ChroniclesPage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const { isMobile, isTablet } = useIsMobile()
  const isZh = i18n.language === 'zh'
  const [activeTab, setActiveTab] = useState('resources')
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>('')
  const [trackFilter, setTrackFilter] = useState<'all' | 'optics' | 'polarization'>('all')
  const [storyModalEvent, setStoryModalEvent] = useState<number | null>(null)
  const [selectedSections, setSelectedSections] = useState<string[]>([]) // P-SRT章节筛选状态
  const [selectedDemos, setSelectedDemos] = useState<string[]>([]) // 演示筛选状态

  // Use single-track layout on mobile/tablet
  const useSingleTrack = isMobile || isTablet

  // 计算被P-SRT章节筛选匹配的事件集合
  const matchedEventKeysFromSections = useMemo(() => {
    if (selectedSections.length === 0) return null

    // Get all events related to selected sections
    const eventKeys = new Set<string>()
    selectedSections.forEach(sectionId => {
      const section = PSRT_CURRICULUM
        .flatMap(unit => unit.sections)
        .find(s => s.id === sectionId)

      if (section) {
        section.relatedEvents.forEach(ref => {
          eventKeys.add(`${ref.year}-${ref.track}`)
        })
      }
    })

    return eventKeys
  }, [selectedSections])

  // 计算被演示筛选匹配的事件集合
  const matchedEventKeysFromDemos = useMemo(() => {
    if (selectedDemos.length === 0) return null

    // Get all events related to selected demos
    const eventKeys = new Set<string>()
    selectedDemos.forEach(demoId => {
      const demo = DEMO_ITEMS.find(d => d.id === demoId)
      if (demo?.relatedEvents) {
        demo.relatedEvents.forEach(ref => {
          eventKeys.add(`${ref.year}-${ref.track}`)
        })
      }
    })

    return eventKeys
  }, [selectedDemos])

  // 合并两种筛选的事件集合 (交集或并集)
  const matchedEventKeys = useMemo(() => {
    // If neither filter is active, return null (show all)
    if (!matchedEventKeysFromSections && !matchedEventKeysFromDemos) return null

    // If only one filter is active, return that one
    if (!matchedEventKeysFromSections) return matchedEventKeysFromDemos
    if (!matchedEventKeysFromDemos) return matchedEventKeysFromSections

    // If both are active, return intersection (events that match both)
    const intersection = new Set<string>()
    matchedEventKeysFromSections.forEach(key => {
      if (matchedEventKeysFromDemos.has(key)) {
        intersection.add(key)
      }
    })
    return intersection
  }, [matchedEventKeysFromSections, matchedEventKeysFromDemos])

  // Filter events by category, track, and selected course modules
  const filteredEvents = useMemo(() => {
    return TIMELINE_EVENTS.filter(e => {
      // 首先排除隐藏的事件（与偏振光关系较远的事件）
      if (e.hidden) return false

      const categoryMatch = !filter || e.category === filter
      const trackMatch = trackFilter === 'all' || e.track === trackFilter

      // 课程筛选：如果有选中的课程模块，只显示匹配的事件
      const courseMatch = matchedEventKeys === null ||
        matchedEventKeys.has(`${e.year}-${e.track}`)

      return categoryMatch && trackMatch && courseMatch
    }).sort((a, b) => a.year - b.year)
  }, [filter, trackFilter, matchedEventKeys])

  // 处理P-SRT章节筛选变化
  const handleFilterChange = useCallback((sections: string[]) => {
    setSelectedSections(sections)
  }, [])


  // 处理从导航点击事件跳转到时间线
  const handleEventClickFromNav = useCallback((year: number, track: 'optics' | 'polarization') => {
    // Reset filters to show all events
    setTrackFilter('all')
    setFilter('')
    setSelectedSections([])
    setSelectedDemos([])

    // Find the target event in the filtered events (excluding hidden events)
    const allEventsSorted = [...TIMELINE_EVENTS].filter(e => !e.hidden).sort((a, b) => a.year - b.year)
    const targetIndex = allEventsSorted.findIndex(
      e => e.year === year && e.track === track
    )

    if (targetIndex !== -1) {
      // Expand the target event
      setExpandedEvent(targetIndex)

      // Scroll to the target event after a short delay to allow re-render
      setTimeout(() => {
        const targetElement = document.querySelector(`[data-event-index="${targetIndex}"]`)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }, [])

  // Story modal navigation
  const handleOpenStory = (index: number) => {
    setStoryModalEvent(index)
  }

  const handleCloseStory = () => {
    setStoryModalEvent(null)
  }

  const handleNextStory = () => {
    if (storyModalEvent !== null && storyModalEvent < filteredEvents.length - 1) {
      setStoryModalEvent(storyModalEvent + 1)
    }
  }

  const handlePrevStory = () => {
    if (storyModalEvent !== null && storyModalEvent > 0) {
      setStoryModalEvent(storyModalEvent - 1)
    }
  }

  // Navigate to linked event
  const handleLinkTo = useCallback((year: number, track: 'optics' | 'polarization') => {
    // Reset filter to show all events
    setTrackFilter('all')
    setFilter('')

    // Find the target event in the full TIMELINE_EVENTS (sorted by year, excluding hidden)
    const allEventsSorted = [...TIMELINE_EVENTS].filter(e => !e.hidden).sort((a, b) => a.year - b.year)
    const targetIndex = allEventsSorted.findIndex(
      e => e.year === year && e.track === track
    )

    if (targetIndex !== -1) {
      // Expand the target event
      setExpandedEvent(targetIndex)

      // Scroll to the target event after a short delay to allow re-render
      setTimeout(() => {
        const targetElement = document.querySelector(`[data-event-index="${targetIndex}"]`)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }, [])

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fffbeb]'
    )}>
      {/* Header with Persistent Logo */}
      <PersistentHeader
        moduleKey="chronicles"
        moduleName={isZh ? '历史与实验' : 'History & Experiments'}
        variant="glass"
        className={cn(
          'sticky top-0 z-40',
          theme === 'dark'
            ? 'bg-slate-900/80 border-b border-slate-700'
            : 'bg-white/80 border-b border-gray-200'
        )}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero section */}
        <div className="text-center mb-8">
          <h2 className={cn(
            'text-2xl sm:text-3xl font-bold mb-3',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '历史和实验' : 'History & Experiments'}
          </h2>
          <p className={cn(
            'text-base max-w-3xl mx-auto mb-4',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '探索偏振光的奇妙世界：从真实实验资源开始你的探索之旅，追溯三个多世纪的光学发现历程，了解系统的课程体系。'
              : 'Explore the wonderful world of polarized light: start your journey with real experiment resources, trace over three centuries of optical discoveries, and learn about the systematic curriculum.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        {activeTab === 'psrt' && (
          <ChroniclesPSRTView
            theme={theme}
            onNavigateToEvent={(year, track) => {
              // Switch to timeline tab and navigate to the event
              setActiveTab('timeline')
              handleEventClickFromNav(year, track)
            }}
          />
        )}

        {activeTab === 'timeline' && (
          <>
            {/* P-SRT Course Chapter Selector - 顶部课程章节选择器 */}
            <ChapterSelector
              selectedSections={selectedSections}
              onFilterChange={handleFilterChange}
              matchedEventCount={filteredEvents.length}
              className="mb-4"
            />

            {/* Track filters */}
            <div className={cn(
              'flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
            )}>
              <span className={cn('text-sm font-medium mr-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '轨道：' : 'Track:'}
              </span>
              <button
                onClick={() => setTrackFilter('all')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                  trackFilter === 'all'
                    ? 'bg-gray-600 text-white'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                )}
              >
                {isZh ? '全部' : 'All'}
              </button>
              <button
                onClick={() => setTrackFilter('optics')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                  trackFilter === 'optics'
                    ? 'bg-amber-500 text-white'
                    : theme === 'dark'
                      ? 'text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/20'
                      : 'text-amber-600 hover:text-amber-700 hover:bg-amber-100'
                )}
              >
                <Sun className="w-3.5 h-3.5" />
                {isZh ? '广义光学' : 'Optics'}
              </button>
              <button
                onClick={() => setTrackFilter('polarization')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                  trackFilter === 'polarization'
                    ? 'bg-cyan-500 text-white'
                    : theme === 'dark'
                      ? 'text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/20'
                      : 'text-cyan-600 hover:text-cyan-700 hover:bg-cyan-100'
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isZh ? '偏振光' : 'Polarization'}
              </button>
            </div>

            {/* Category filters */}
            <div className={cn(
              'flex flex-wrap items-center gap-2 mb-6 p-3 rounded-lg',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
            )}>
              <span className={cn('text-sm font-medium mr-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '类型：' : 'Type:'}
              </span>
              <button
                onClick={() => setFilter('')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  !filter
                    ? 'bg-gray-600 text-white'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                )}
              >
                {isZh ? '全部' : 'All'}
              </button>
              {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    filter === key
                      ? 'bg-gray-600 text-white'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  )}
                >
                  {isZh ? val.zh : val.en}
                </button>
              ))}
            </div>

            {/* Demo Navigator removed - 光学演示馆导航已移除，简化时间线界面 */}

            {/* Century Navigator - 世纪导航 (Desktop only, right side) */}
            {!useSingleTrack && (
              <CenturyNavigator events={filteredEvents} isZh={isZh} />
            )}

            {/* Mobile Single-Track Timeline - 移动端单轨时间线 */}
            {useSingleTrack ? (
              <div className="relative">
                {/* Mobile Track Tabs */}
                <div className={cn(
                  'sticky top-16 z-20 flex items-center justify-center gap-2 mb-4 py-2',
                  theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95',
                  'backdrop-blur-sm'
                )}>
                  <button
                    onClick={() => setTrackFilter('all')}
                    className={cn(
                      'flex-1 max-w-[100px] py-2 px-3 rounded-lg text-sm font-medium transition-all',
                      trackFilter === 'all'
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-amber-500/30 to-cyan-500/30 text-white'
                          : 'bg-gradient-to-r from-amber-100 to-cyan-100 text-gray-900'
                        : theme === 'dark'
                          ? 'bg-slate-800 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {isZh ? '全部' : 'All'}
                  </button>
                  <button
                    onClick={() => setTrackFilter('optics')}
                    className={cn(
                      'flex-1 max-w-[100px] py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5',
                      trackFilter === 'optics'
                        ? 'bg-amber-500 text-white'
                        : theme === 'dark'
                          ? 'bg-slate-800 text-amber-400'
                          : 'bg-amber-50 text-amber-700'
                    )}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    {isZh ? '光学' : 'Optics'}
                  </button>
                  <button
                    onClick={() => setTrackFilter('polarization')}
                    className={cn(
                      'flex-1 max-w-[100px] py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5',
                      trackFilter === 'polarization'
                        ? 'bg-cyan-500 text-white'
                        : theme === 'dark'
                          ? 'bg-slate-800 text-cyan-400'
                          : 'bg-cyan-50 text-cyan-700'
                    )}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isZh ? '偏振' : 'Polar'}
                  </button>
                </div>

                {/* Single-track vertical timeline */}
                <div className="relative pl-8">
                  {/* Left vertical line */}
                  <div className={cn(
                    'absolute left-3 top-0 bottom-0 w-0.5',
                    theme === 'dark'
                      ? 'bg-gradient-to-b from-amber-500/50 via-gray-500/50 to-cyan-500/50'
                      : 'bg-gradient-to-b from-amber-300 via-gray-300 to-cyan-300'
                  )} />

                  {/* Events */}
                  {filteredEvents.map((event, idx) => (
                    <div
                      key={`${event.year}-${event.titleEn}`}
                      id={`timeline-year-${event.year}`}
                      className="relative mb-4 last:mb-0 scroll-mt-32"
                    >
                      {/* Year marker */}
                      <div className={cn(
                        'absolute -left-5 w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2',
                        event.track === 'optics'
                          ? theme === 'dark'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                            : 'bg-amber-100 border-amber-500 text-amber-700'
                          : theme === 'dark'
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                            : 'bg-cyan-100 border-cyan-500 text-cyan-700'
                      )}>
                        {String(event.year).slice(-2)}
                      </div>

                      {/* Track indicator badge */}
                      <div className="mb-1">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                          event.track === 'optics'
                            ? theme === 'dark'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-amber-100 text-amber-700'
                            : theme === 'dark'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-cyan-100 text-cyan-700'
                        )}>
                          {event.track === 'optics' ? (
                            <><Sun className="w-3 h-3" /> {event.year}</>
                          ) : (
                            <><Sparkles className="w-3 h-3" /> {event.year}</>
                          )}
                        </span>
                      </div>

                      {/* Event card */}
                      <DualTrackCard
                        event={event}
                        eventIndex={idx}
                        isExpanded={expandedEvent === idx}
                        onToggle={() => setExpandedEvent(expandedEvent === idx ? null : idx)}
                        onReadStory={() => handleOpenStory(idx)}
                        onLinkTo={handleLinkTo}

                        side={event.track === 'optics' ? 'left' : 'right'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Desktop Dual Track Timeline - 桌面端双轨时间线 */
              <div className="relative">
                {/* Track Labels - 轨道标签 */}
                <div className="flex items-center justify-between mb-6">
                  <div className={cn(
                    'flex-1 text-center py-2 rounded-l-lg border-r',
                    theme === 'dark'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-amber-50 border-amber-200'
                  )}>
                    <div className="flex items-center justify-center gap-2">
                      <Sun className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
                      <span className={cn('font-semibold', theme === 'dark' ? 'text-amber-400' : 'text-amber-700')}>
                        {isZh ? '广义光学' : 'General Optics'}
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    'w-20 text-center py-2',
                    theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                  )}>
                    <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      {isZh ? '年份' : 'Year'}
                    </span>
                  </div>
                  <div className={cn(
                    'flex-1 text-center py-2 rounded-r-lg border-l',
                    theme === 'dark'
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : 'bg-cyan-50 border-cyan-200'
                  )}>
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                      <span className={cn('font-semibold', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700')}>
                        {isZh ? '偏振光' : 'Polarization'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline with center axis */}
                <div className="relative">
                  {/* Center vertical line */}
                  <div className={cn(
                    'absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2',
                    theme === 'dark' ? 'bg-gradient-to-b from-amber-500/50 via-gray-500/50 to-cyan-500/50' : 'bg-gradient-to-b from-amber-300 via-gray-300 to-cyan-300'
                  )} />

                  {/* Events */}
                  {(() => {
                    // Get all unique years from filtered events
                    const years = [...new Set(filteredEvents.map(e => e.year))].sort((a, b) => a - b)

                    return years.map((year) => {
                      // Get ALL events for this year per track (not just the first one)
                      const opticsEvents = filteredEvents.filter(e => e.year === year && e.track === 'optics')
                      const polarizationEvents = filteredEvents.filter(e => e.year === year && e.track === 'polarization')
                      const hasOptics = opticsEvents.length > 0
                      const hasPolarization = polarizationEvents.length > 0

                      return (
                        <div key={year} id={`timeline-year-${year}`} className="relative flex items-stretch mb-6 last:mb-0 scroll-mt-24">
                          {/* Left side - Optics (can have multiple events) */}
                          <div className="flex-1 pr-4 flex justify-end">
                            {hasOptics && (
                              <div className="w-full max-w-md space-y-3">
                                {opticsEvents.map((opticsEvent) => {
                                  const opticsIndex = filteredEvents.findIndex(e => e === opticsEvent)
                                  return (
                                    <DualTrackCard
                                      key={opticsEvent.titleEn}
                                      event={opticsEvent}
                                      eventIndex={opticsIndex}
                                      isExpanded={expandedEvent === opticsIndex}
                                      onToggle={() => setExpandedEvent(expandedEvent === opticsIndex ? null : opticsIndex)}
                                      onReadStory={() => handleOpenStory(opticsIndex)}
                                      onLinkTo={handleLinkTo}
              
                                      side="left"
                                    />
                                  )
                                })}
                              </div>
                            )}
                          </div>

                          {/* Center year marker */}
                          <div className="w-20 flex flex-col items-center justify-start relative z-10 flex-shrink-0">
                            <div className={cn(
                              'w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-sm border-2',
                              hasOptics && hasPolarization
                                ? theme === 'dark'
                                  ? 'bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border-gray-500 text-white'
                                  : 'bg-gradient-to-br from-amber-100 to-cyan-100 border-gray-400 text-gray-800'
                                : hasOptics
                                  ? theme === 'dark'
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                    : 'bg-amber-100 border-amber-500 text-amber-700'
                                  : theme === 'dark'
                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                    : 'bg-cyan-100 border-cyan-500 text-cyan-700'
                            )}>
                              {year}
                            </div>
                            {/* Connector lines */}
                            {hasOptics && (
                              <div className={cn(
                                'absolute top-6 right-full w-4 h-0.5 mr-0',
                                theme === 'dark' ? 'bg-amber-500/50' : 'bg-amber-400'
                              )} />
                            )}
                            {hasPolarization && (
                              <div className={cn(
                                'absolute top-6 left-full w-4 h-0.5 ml-0',
                                theme === 'dark' ? 'bg-cyan-500/50' : 'bg-cyan-400'
                              )} />
                            )}
                          </div>

                          {/* Right side - Polarization (can have multiple events) */}
                          <div className="flex-1 pl-4 flex justify-start">
                            {hasPolarization && (
                              <div className="w-full max-w-md space-y-3">
                                {polarizationEvents.map((polarizationEvent) => {
                                  const polarizationIndex = filteredEvents.findIndex(e => e === polarizationEvent)
                                  return (
                                    <DualTrackCard
                                      key={polarizationEvent.titleEn}
                                      event={polarizationEvent}
                                      eventIndex={polarizationIndex}
                                      isExpanded={expandedEvent === polarizationIndex}
                                      onToggle={() => setExpandedEvent(expandedEvent === polarizationIndex ? null : polarizationIndex)}
                                      onReadStory={() => handleOpenStory(polarizationIndex)}
                                      onLinkTo={handleLinkTo}
              
                                      side="right"
                                    />
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
            )}
          </>
        )}

        {/* Hidden tabs - can be restored later by uncommenting the tabs in TABS array above:
        {activeTab === 'scientists' && (
          <ScientistNetwork
            theme={theme}
            onNavigateToEvent={(year, track) => {
              setActiveTab('timeline')
              handleEventClickFromNav(year, track)
            }}
            externalSelectedScientist={selectedScientistFromExploration}
          />
        )}

        {activeTab === 'concepts' && (
          <ConceptNetwork
            theme={theme}
            onNavigateToEvent={(year, track) => {
              setActiveTab('timeline')
              handleEventClickFromNav(year, track)
            }}
          />
        )}

        {activeTab === 'exploration' && (
          <ExplorationMode
            theme={theme}
            onNavigateToEvent={(year, track) => {
              setActiveTab('timeline')
              handleEventClickFromNav(year, track)
            }}
            onSelectScientist={handleSelectScientistFromExploration}
          />
        )}
        */}

        {activeTab === 'experiments' && (
          <div className="space-y-4">
            {/* Intro */}
            <div className={cn(
              'rounded-xl border p-6 mb-6',
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-amber-50 border-amber-200'
            )}>
              <div className="flex items-start gap-4">
                <FlaskConical className={cn(
                  'w-10 h-10 flex-shrink-0',
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                )} />
                <div>
                  <h3 className={cn(
                    'text-lg font-semibold mb-2',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '历史性实验' : 'Historic Experiments'}
                  </h3>
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {isZh
                      ? '这些实验改变了我们对光的理解。点击每个实验了解其原理和历史意义。'
                      : 'These experiments transformed our understanding of light. Click each experiment to learn about its principles and historical significance.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Experiment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TIMELINE_EVENTS.filter(e => !e.hidden && (e.category === 'experiment' || e.category === 'discovery')).map((event) => (
                <div
                  key={event.year}
                  className={cn(
                    'rounded-xl border p-5 transition-all cursor-pointer hover:shadow-lg',
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50'
                      : 'bg-white border-gray-200 hover:border-cyan-400'
                  )}
                  onClick={() => {
                    const idx = TIMELINE_EVENTS.filter(e => !e.hidden).findIndex(e => e.year === event.year)
                    if (idx >= 0) handleOpenStory(idx)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
                      theme === 'dark' ? 'bg-cyan-900/30' : 'bg-cyan-100'
                    )}>
                      <span className="text-2xl font-bold font-mono text-cyan-500">
                        {event.year.toString().slice(-2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge color={CATEGORY_LABELS[event.category].color}>
                          {isZh ? CATEGORY_LABELS[event.category].zh : CATEGORY_LABELS[event.category].en}
                        </Badge>
                        {event.experimentalResources && (
                          <span className={cn(
                            'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium',
                            theme === 'dark'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-purple-100 text-purple-600'
                          )} title={isZh ? '含实验资源' : 'Has experiment resources'}>
                            <Camera className="w-3 h-3" />
                            <Film className="w-3 h-3" />
                          </span>
                        )}
                        <span className={cn(
                          'text-xs font-mono',
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        )}>
                          {event.year}
                        </span>
                      </div>
                      <h4 className={cn(
                        'font-semibold mb-1',
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {isZh ? event.titleZh : event.titleEn}
                      </h4>
                      {event.scientistEn && (
                        <p className={cn(
                          'text-xs mb-2',
                          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                        )}>
                          {event.scientistBio?.portraitEmoji} {isZh ? event.scientistZh : event.scientistEn}
                        </p>
                      )}
                      <p className={cn(
                        'text-sm line-clamp-2',
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {isZh ? event.descriptionZh : event.descriptionEn}
                      </p>
                      {event.scene?.location && (
                        <p className={cn(
                          'text-xs mt-2 flex items-center gap-1',
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        )}>
                          <MapPin className="w-3 h-3" />
                          {event.scene.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <ExperimentResourcesTab theme={theme} isZh={isZh} />
        )}

        {/* Cool Facts Section - 随机偏振光知识/历史事件/小实验/生活应用 */}
        <CoolFactsSection theme={theme} isZh={isZh} />
      </main>

      {/* Story Modal */}
      {storyModalEvent !== null && filteredEvents[storyModalEvent] && (
        <StoryModal
          event={filteredEvents[storyModalEvent]}
          onClose={handleCloseStory}
          onNext={handleNextStory}
          onPrev={handlePrevStory}
          hasNext={storyModalEvent < filteredEvents.length - 1}
          hasPrev={storyModalEvent > 0}
        />
      )}
    </div>
  )
}

export default ChroniclesPage
