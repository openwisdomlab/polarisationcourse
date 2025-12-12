/**
 * Chronicles Page - History of Polarized Light
 * 编年史页面 - 偏振光发现史
 *
 * Interactive timeline showcasing key discoveries and scientists
 * in the history of polarization physics.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Tabs, Badge } from '@/components/shared'
import {
  Home, Clock, User, Lightbulb,
  FlaskConical, Star, ChevronDown, ChevronUp
} from 'lucide-react'

// Timeline events data
interface TimelineEvent {
  year: number
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  scientistEn?: string
  scientistZh?: string
  category: 'discovery' | 'theory' | 'experiment' | 'application'
  importance: 1 | 2 | 3 // 1 = major milestone, 2 = significant, 3 = notable
  details?: {
    en: string[]
    zh: string[]
  }
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: 1669,
    titleEn: 'Discovery of Double Refraction',
    titleZh: '双折射现象的发现',
    descriptionEn: 'Erasmus Bartholin discovers that calcite crystals produce double images, the first observation of birefringence.',
    descriptionZh: '巴托林发现方解石晶体能产生双像，这是人类首次观察到双折射现象。',
    scientistEn: 'Erasmus Bartholin',
    scientistZh: '伊拉斯谟·巴托林',
    category: 'discovery',
    importance: 1,
    details: {
      en: [
        'Bartholin observed that objects viewed through Iceland spar (calcite) appeared double',
        'He called the phenomenon "strange refraction"',
        'This discovery would later be explained by polarization theory'
      ],
      zh: [
        '巴托林观察到通过冰洲石（方解石）观看物体会出现双像',
        '他称这一现象为"奇异折射"',
        '这一发现后来被偏振理论所解释'
      ]
    }
  },
  {
    year: 1690,
    titleEn: 'Huygens\' Wave Theory',
    titleZh: '惠更斯的波动理论',
    descriptionEn: 'Christiaan Huygens proposes the wave theory of light and attempts to explain double refraction.',
    descriptionZh: '惠更斯提出光的波动理论，并尝试解释双折射现象。',
    scientistEn: 'Christiaan Huygens',
    scientistZh: '克里斯蒂安·惠更斯',
    category: 'theory',
    importance: 1,
    details: {
      en: [
        'Published "Treatise on Light" (Traité de la Lumière)',
        'Introduced the wavelet construction method (Huygens\' principle)',
        'Explained ordinary and extraordinary rays in calcite using different wave velocities'
      ],
      zh: [
        '出版《光论》（Traité de la Lumière）',
        '提出波动构造法（惠更斯原理）',
        '用不同的波速解释了方解石中的寻常光和非常光'
      ]
    }
  },
  {
    year: 1808,
    titleEn: 'Discovery of Polarization by Reflection',
    titleZh: '反射偏振的发现',
    descriptionEn: 'Étienne-Louis Malus discovers that light reflected from glass becomes polarized while observing the Luxembourg Palace.',
    descriptionZh: '马吕斯在观察卢森堡宫时，发现玻璃反射的光会发生偏振。',
    scientistEn: 'Étienne-Louis Malus',
    scientistZh: '艾蒂安-路易·马吕斯',
    category: 'discovery',
    importance: 1,
    details: {
      en: [
        'Malus was looking at the setting sun\'s reflection through a calcite crystal',
        'He noticed the double image intensity changed as he rotated the crystal',
        'Coined the term "polarization" for this phenomenon',
        'This accidental discovery won him the French Academy prize'
      ],
      zh: [
        '马吕斯当时正通过方解石晶体观看夕阳的反射',
        '他注意到旋转晶体时双像的强度会发生变化',
        '他创造了"偏振"一词来描述这一现象',
        '这一偶然发现为他赢得了法国科学院奖'
      ]
    }
  },
  {
    year: 1809,
    titleEn: 'Malus\'s Law',
    titleZh: '马吕斯定律',
    descriptionEn: 'Malus formulates the law describing how polarized light intensity varies with analyzer angle: I = I₀cos²θ.',
    descriptionZh: '马吕斯提出描述偏振光强度随检偏器角度变化的定律：I = I₀cos²θ。',
    scientistEn: 'Étienne-Louis Malus',
    scientistZh: '艾蒂安-路易·马吕斯',
    category: 'theory',
    importance: 1,
    details: {
      en: [
        'The intensity of transmitted light follows a cosine-squared relationship',
        'When θ = 90°, no light passes through (crossed polarizers)',
        'This law is fundamental to all polarization applications'
      ],
      zh: [
        '透射光强度遵循余弦平方关系',
        '当 θ = 90° 时，没有光通过（正交偏振器）',
        '这一定律是所有偏振应用的基础'
      ]
    }
  },
  {
    year: 1811,
    titleEn: 'Brewster\'s Angle',
    titleZh: '布儒斯特角',
    descriptionEn: 'David Brewster discovers the angle at which reflected light is completely polarized.',
    descriptionZh: '布儒斯特发现反射光完全偏振时的特定角度。',
    scientistEn: 'David Brewster',
    scientistZh: '大卫·布儒斯特',
    category: 'discovery',
    importance: 2,
    details: {
      en: [
        'At Brewster\'s angle, reflected light is 100% polarized',
        'The angle depends on the refractive indices of both media',
        'tan(θB) = n₂/n₁',
        'This principle is used in polarizing windows and laser optics'
      ],
      zh: [
        '在布儒斯特角下，反射光100%偏振',
        '该角度取决于两种介质的折射率',
        'tan(θB) = n₂/n₁',
        '这一原理被用于偏振窗和激光光学'
      ]
    }
  },
  {
    year: 1815,
    titleEn: 'Fresnel\'s Wave Theory',
    titleZh: '菲涅尔的波动理论',
    descriptionEn: 'Augustin-Jean Fresnel develops a comprehensive wave theory explaining diffraction and polarization.',
    descriptionZh: '菲涅尔发展出完整的波动理论，解释了衍射和偏振现象。',
    scientistEn: 'Augustin-Jean Fresnel',
    scientistZh: '奥古斯丁-让·菲涅尔',
    category: 'theory',
    importance: 1,
    details: {
      en: [
        'Proposed that light waves are transverse (perpendicular to propagation)',
        'Developed Fresnel equations for reflection and transmission',
        'Explained interference and diffraction mathematically',
        'Invented the Fresnel lens for lighthouses'
      ],
      zh: [
        '提出光波是横波（垂直于传播方向）',
        '推导出菲涅尔反射和透射方程',
        '用数学解释了干涉和衍射',
        '发明了用于灯塔的菲涅尔透镜'
      ]
    }
  },
  {
    year: 1828,
    titleEn: 'Nicol Prism',
    titleZh: '尼科尔棱镜',
    descriptionEn: 'William Nicol invents the first practical polarizing prism using calcite.',
    descriptionZh: '尼科尔发明了第一个实用的偏振棱镜，使用方解石制成。',
    scientistEn: 'William Nicol',
    scientistZh: '威廉·尼科尔',
    category: 'experiment',
    importance: 2,
    details: {
      en: [
        'Made from two calcite prisms cemented with Canada balsam',
        'Ordinary ray is totally internally reflected and absorbed',
        'Extraordinary ray passes through as polarized light',
        'Widely used in microscopy until modern polarizers'
      ],
      zh: [
        '由两个用加拿大树脂胶合的方解石棱镜制成',
        '寻常光全反射被吸收',
        '非常光作为偏振光通过',
        '在现代偏振片出现前广泛用于显微镜'
      ]
    }
  },
  {
    year: 1852,
    titleEn: 'Stokes Parameters',
    titleZh: '斯托克斯参数',
    descriptionEn: 'George Gabriel Stokes introduces a mathematical framework to describe polarization states.',
    descriptionZh: '斯托克斯引入描述偏振态的数学框架。',
    scientistEn: 'George Gabriel Stokes',
    scientistZh: '乔治·加布里埃尔·斯托克斯',
    category: 'theory',
    importance: 2,
    details: {
      en: [
        'Four parameters (S₀, S₁, S₂, S₃) completely describe any polarization state',
        'Can represent partially polarized and unpolarized light',
        'Enables mathematical treatment of polarization measurement',
        'Foundation for modern polarimetry'
      ],
      zh: [
        '四个参数（S₀, S₁, S₂, S₃）完整描述任何偏振态',
        '可以表示部分偏振和非偏振光',
        '使偏振测量的数学处理成为可能',
        '现代偏振测量学的基础'
      ]
    }
  },
  {
    year: 1929,
    titleEn: 'Polaroid Filter',
    titleZh: '宝丽来偏振片',
    descriptionEn: 'Edwin Land invents the first synthetic sheet polarizer, revolutionizing polarization applications.',
    descriptionZh: '埃德温·兰德发明了第一种合成薄片偏振器，彻底改变了偏振应用。',
    scientistEn: 'Edwin Land',
    scientistZh: '埃德温·兰德',
    category: 'application',
    importance: 1,
    details: {
      en: [
        'Created by aligning microscopic crystals in a plastic sheet',
        'Made polarizers cheap and widely available',
        'Enabled polarized sunglasses, camera filters, 3D movies',
        'Land later founded the Polaroid Corporation'
      ],
      zh: [
        '通过在塑料片中排列微小晶体制成',
        '使偏振器变得便宜且广泛可用',
        '使偏振太阳镜、相机滤镜、3D电影成为可能',
        '兰德后来创立了宝丽来公司'
      ]
    }
  },
  {
    year: 1971,
    titleEn: 'LCD Technology',
    titleZh: 'LCD技术',
    descriptionEn: 'First practical liquid crystal display using polarization principles is demonstrated.',
    descriptionZh: '首个使用偏振原理的实用液晶显示器被展示。',
    category: 'application',
    importance: 2,
    details: {
      en: [
        'LCD panels use two crossed polarizers with liquid crystals between them',
        'Electric field controls the rotation of light polarization',
        'Revolutionized displays for watches, calculators, and screens',
        'Now ubiquitous in monitors, TVs, and mobile devices'
      ],
      zh: [
        'LCD面板使用两个正交偏振器，中间夹有液晶',
        '电场控制光偏振的旋转',
        '彻底改变了手表、计算器和屏幕的显示',
        '现在广泛用于显示器、电视和移动设备'
      ]
    }
  },
]

const CATEGORY_LABELS = {
  discovery: { en: 'Discovery', zh: '发现', color: 'blue' as const },
  theory: { en: 'Theory', zh: '理论', color: 'purple' as const },
  experiment: { en: 'Experiment', zh: '实验', color: 'green' as const },
  application: { en: 'Application', zh: '应用', color: 'orange' as const },
}

// Timeline event card component
interface TimelineCardProps {
  event: TimelineEvent
  isExpanded: boolean
  onToggle: () => void
}

function TimelineCard({ event, isExpanded, onToggle }: TimelineCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const category = CATEGORY_LABELS[event.category]

  return (
    <div className={cn(
      'relative pl-8 pb-8 border-l-2 last:pb-0',
      theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
    )}>
      {/* Timeline dot */}
      <div className={cn(
        'absolute -left-2.5 w-5 h-5 rounded-full border-4',
        event.importance === 1
          ? 'bg-amber-500 border-amber-500/30'
          : event.importance === 2
            ? 'bg-cyan-500 border-cyan-500/30'
            : theme === 'dark' ? 'bg-slate-600 border-slate-500' : 'bg-gray-400 border-gray-300'
      )} />

      {/* Year label */}
      <div className={cn(
        'absolute -left-20 w-14 text-right font-mono text-sm font-semibold',
        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
      )}>
        {event.year}
      </div>

      {/* Card */}
      <div
        onClick={onToggle}
        className={cn(
          'rounded-xl border p-4 cursor-pointer transition-all',
          theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50'
            : 'bg-white border-gray-200 hover:border-amber-400 hover:shadow-md'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge color={category.color}>
                {isZh ? category.zh : category.en}
              </Badge>
              {event.importance === 1 && (
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              )}
            </div>
            <h3 className={cn(
              'font-semibold text-lg mb-1',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? event.titleZh : event.titleEn}
            </h3>
            {event.scientistEn && (
              <p className={cn(
                'text-sm mb-2 flex items-center gap-1',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )}>
                <User className="w-3.5 h-3.5" />
                {isZh ? event.scientistZh : event.scientistEn}
              </p>
            )}
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? event.descriptionZh : event.descriptionEn}
            </p>
          </div>
          <div className={cn(
            'flex-shrink-0 p-1 rounded-full transition-colors',
            theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
          )}>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && event.details && (
          <div className={cn(
            'mt-4 pt-4 border-t',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}>
            <h4 className={cn(
              'text-sm font-semibold mb-2 flex items-center gap-2',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              <Lightbulb className="w-4 h-4" />
              {isZh ? '深入了解' : 'Learn More'}
            </h4>
            <ul className={cn(
              'text-sm space-y-1.5 list-disc list-inside',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {(isZh ? event.details.zh : event.details.en).map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// Tabs configuration
const TABS = [
  { id: 'timeline', label: 'Timeline', labelZh: '时间线', icon: <Clock className="w-4 h-4" /> },
  { id: 'scientists', label: 'Scientists', labelZh: '科学家', icon: <User className="w-4 h-4" /> },
  { id: 'experiments', label: 'Key Experiments', labelZh: '关键实验', icon: <FlaskConical className="w-4 h-4" /> },
]

export function ChroniclesPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [activeTab, setActiveTab] = useState('timeline')
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>('')

  // Filter events by category
  const filteredEvents = filter
    ? TIMELINE_EVENTS.filter(e => e.category === filter)
    : TIMELINE_EVENTS

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fffbeb]'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark'
          ? 'bg-slate-900/80 border-slate-700'
          : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: Home link */}
            <Link
              to="/"
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.home')}</span>
            </Link>

            {/* Center: Title */}
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <h1 className={cn(
                'text-lg sm:text-xl font-bold',
                theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
              )}>
                {isZh ? '光的编年史' : 'Chronicles of Light'}
              </h1>
            </div>

            {/* Right: Settings */}
            <LanguageThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero section */}
        <div className="text-center mb-8">
          <h2 className={cn(
            'text-2xl sm:text-3xl font-bold mb-3',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '偏振光的发现之旅' : 'The Journey of Polarization Discovery'}
          </h2>
          <p className={cn(
            'text-base max-w-2xl mx-auto',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '从17世纪的偶然发现到现代液晶显示器，探索三个多世纪的光学奥秘。'
              : 'From 17th-century chance discoveries to modern LCD displays — explore over three centuries of optical mysteries.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        {activeTab === 'timeline' && (
          <>
            {/* Category filters */}
            <div className={cn(
              'flex flex-wrap gap-2 mb-6 p-3 rounded-lg',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
            )}>
              <button
                onClick={() => setFilter('')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  !filter
                    ? 'bg-amber-500 text-white'
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
                      ? 'bg-amber-500 text-white'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  )}
                >
                  {isZh ? val.zh : val.en}
                </button>
              ))}
            </div>

            {/* Timeline */}
            <div className="relative ml-20">
              {filteredEvents.map((event, index) => (
                <TimelineCard
                  key={event.year}
                  event={event}
                  isExpanded={expandedEvent === index}
                  onToggle={() => setExpandedEvent(expandedEvent === index ? null : index)}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'scientists' && (
          <div className={cn(
            'text-center py-12 rounded-xl border',
            theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
          )}>
            <User className={cn(
              'w-12 h-12 mx-auto mb-4',
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            )} />
            <h3 className={cn(
              'text-xl font-semibold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '科学家档案' : 'Scientist Profiles'}
            </h3>
            <p className={cn(
              'text-sm mb-4',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? '即将推出详细的科学家传记...' : 'Detailed scientist biographies coming soon...'}
            </p>
          </div>
        )}

        {activeTab === 'experiments' && (
          <div className={cn(
            'text-center py-12 rounded-xl border',
            theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
          )}>
            <FlaskConical className={cn(
              'w-12 h-12 mx-auto mb-4',
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            )} />
            <h3 className={cn(
              'text-xl font-semibold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '关键实验' : 'Key Experiments'}
            </h3>
            <p className={cn(
              'text-sm mb-4',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? '即将推出重现历史实验的交互式指南...' : 'Interactive guides to recreate historical experiments coming soon...'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
