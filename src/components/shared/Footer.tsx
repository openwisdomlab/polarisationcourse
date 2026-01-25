/**
 * Footer Component - Site-wide footer with cool facts and minimal navigation
 * 页脚组件 - 精简版页脚，包含随机偏振光知识/历史事件
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Github, ExternalLink, Mail, Sparkles } from 'lucide-react'

// 偏振光知识和历史事件数据
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
    type: 'history',
    year: 1669,
    titleEn: 'Discovery of Double Refraction',
    titleZh: '双折射现象的发现',
    contentEn: 'A calcite crystal splits light in two, revealing polarization',
    contentZh: '方解石将一束光一分为二，偏振首次显现',
    scientistEn: 'Erasmus Bartholin',
    scientistZh: '巴托林',
  },
  {
    type: 'history',
    year: 1808,
    titleEn: 'Polarization by Reflection',
    titleZh: '反射偏振的发现',
    contentEn: 'Light reflected from glass becomes polarized',
    contentZh: '透过方解石观察卢森堡宫窗户的反射光',
    scientistEn: 'Etienne-Louis Malus',
    scientistZh: '马吕斯',
  },
  {
    type: 'history',
    year: 1809,
    titleEn: "Malus's Law",
    titleZh: '马吕斯定律',
    contentEn: 'I = I₀cos²θ — the fundamental law of polarization',
    contentZh: 'I = I₀cos²θ — 偏振光学的基本定律',
    scientistEn: 'Etienne-Louis Malus',
    scientistZh: '马吕斯',
  },
  {
    type: 'history',
    year: 1812,
    titleEn: "Brewster's Angle",
    titleZh: '布儒斯特角',
    contentEn: 'The angle at which reflected light is completely polarized',
    contentZh: '反射光完全偏振的特定角度',
    scientistEn: 'David Brewster',
    scientistZh: '布儒斯特',
  },
  {
    type: 'history',
    year: 1817,
    titleEn: 'Transverse Wave Theory',
    titleZh: '横波理论',
    contentEn: 'Polarization proves light is a transverse wave',
    contentZh: '偏振现象证明光是横波',
    scientistEn: 'Augustin-Jean Fresnel',
    scientistZh: '菲涅尔',
  },
  {
    type: 'history',
    year: 1845,
    titleEn: 'Faraday Effect',
    titleZh: '法拉第效应',
    contentEn: 'Magnetic field rotates polarized light in glass',
    contentZh: '磁场旋转玻璃中偏振光的平面',
    scientistEn: 'Michael Faraday',
    scientistZh: '法拉第',
  },
  {
    type: 'history',
    year: 1929,
    titleEn: 'Polaroid Filter',
    titleZh: '宝丽来偏振片',
    contentEn: 'First synthetic polarizer revolutionizes applications',
    contentZh: '第一种合成偏振片，彻底改变偏振应用',
    scientistEn: 'Edwin Land',
    scientistZh: '兰德',
  },
  // 偏振光知识
  {
    type: 'knowledge',
    titleEn: 'Why Sunglasses Work',
    titleZh: '偏振太阳镜原理',
    contentEn: 'Polarized sunglasses block glare because reflected light is horizontally polarized',
    contentZh: '偏振太阳镜能减少眩光，因为反射光是水平偏振的',
  },
  {
    type: 'knowledge',
    titleEn: 'LCD Screen Secret',
    titleZh: '液晶屏幕的秘密',
    contentEn: 'LCD displays use polarized light — try rotating a polarizer in front of your screen!',
    contentZh: '液晶显示屏利用偏振光工作——试试用偏振片对着屏幕旋转！',
  },
  {
    type: 'knowledge',
    titleEn: '3D Cinema Magic',
    titleZh: '3D电影的魔法',
    contentEn: '3D movies use circular polarization to send different images to each eye',
    contentZh: '3D电影利用圆偏振光向左右眼分别发送不同图像',
  },
  {
    type: 'knowledge',
    titleEn: 'Bee Navigation',
    titleZh: '蜜蜂导航术',
    contentEn: 'Bees can see polarized skylight and use it to navigate even on cloudy days',
    contentZh: '蜜蜂能看到天空中的偏振光，即使阴天也能用它导航',
  },
  {
    type: 'knowledge',
    titleEn: 'Stress Photography',
    titleZh: '应力可视化',
    contentEn: 'Engineers use polarized light to see stress patterns in transparent materials',
    contentZh: '工程师用偏振光观察透明材料中的应力分布',
  },
  {
    type: 'knowledge',
    titleEn: 'Sugar Detection',
    titleZh: '糖度检测',
    contentEn: 'Sugar solutions rotate polarized light — this is how sugar content is measured',
    contentZh: '糖溶液能旋转偏振光——糖度计就是利用这个原理',
  },
  {
    type: 'knowledge',
    titleEn: 'Rainbow Secrets',
    titleZh: '彩虹的秘密',
    contentEn: 'Light from rainbows is partially polarized, especially at 42° from the sun',
    contentZh: '彩虹的光是部分偏振的，尤其在与太阳成42°角时',
  },
  // 小实验 - Simple experiments
  {
    type: 'experiment',
    titleEn: 'Tape Art Experiment',
    titleZh: '胶带艺术实验',
    contentEn: 'Layer transparent tape on glass, view between crossed polarizers to create colorful birefringence art',
    contentZh: '在玻璃上层叠透明胶带，用交叉偏振片观察，可以创造出彩色双折射艺术',
  },
  {
    type: 'experiment',
    titleEn: 'Screen Polarization Test',
    titleZh: '屏幕偏振测试',
    contentEn: 'Rotate polarized sunglasses in front of your phone screen — watch it go dark at 90°!',
    contentZh: '在手机屏幕前旋转偏振太阳镜——旋转90°时屏幕会变黑！',
  },
  {
    type: 'experiment',
    titleEn: 'Sugar Water Rotation',
    titleZh: '糖水旋光实验',
    contentEn: 'Shine light through sugar water between polarizers — different concentrations create different colors',
    contentZh: '让光线穿过偏振片之间的糖水——不同浓度会产生不同颜色',
  },
  {
    type: 'experiment',
    titleEn: 'Plastic Stress Patterns',
    titleZh: '塑料应力图案',
    contentEn: 'Bend a clear plastic ruler between crossed polarizers to see rainbow stress patterns',
    contentZh: '在交叉偏振片间弯曲透明塑料尺，可以看到彩虹应力图案',
  },
  {
    type: 'experiment',
    titleEn: 'Sky Polarization Map',
    titleZh: '天空偏振地图',
    contentEn: 'Use polarized sunglasses to scan the sky — the polarization pattern changes with sun position',
    contentZh: '用偏振太阳镜扫描天空——偏振图案会随太阳位置变化',
  },
  // 生活中的偏振 - Polarization in daily life
  {
    type: 'daily',
    titleEn: 'Camera Filters',
    titleZh: '相机偏振滤镜',
    contentEn: 'Photographers use polarizing filters to reduce reflections and enhance sky contrast',
    contentZh: '摄影师使用偏振滤镜减少反射并增强天空对比度',
  },
  {
    type: 'daily',
    titleEn: 'Car Windshields',
    titleZh: '汽车挡风玻璃',
    contentEn: 'Some car windshields have polarizing layers to reduce dashboard reflections',
    contentZh: '一些汽车挡风玻璃有偏振涂层，用于减少仪表盘反射',
  },
  {
    type: 'daily',
    titleEn: 'Fishing Glasses',
    titleZh: '钓鱼眼镜',
    contentEn: 'Anglers use polarized glasses to see through water surface glare and spot fish',
    contentZh: '钓鱼者使用偏振眼镜穿透水面眩光来发现鱼',
  },
  {
    type: 'daily',
    titleEn: 'LCD Displays Everywhere',
    titleZh: '无处不在的液晶屏',
    contentEn: 'Every LCD screen uses two polarizers — your phone, laptop, TV, and digital watch',
    contentZh: '每个液晶屏都使用两个偏振片——你的手机、笔记本、电视和电子手表',
  },
  {
    type: 'daily',
    titleEn: 'Stress Testing Glass',
    titleZh: '玻璃应力检测',
    contentEn: 'Engineers use polarized light to detect stress in glass windows and safety equipment',
    contentZh: '工程师使用偏振光检测玻璃窗和安全设备中的应力',
  },
  {
    type: 'daily',
    titleEn: 'Scientific Microscopy',
    titleZh: '科学显微镜',
    contentEn: 'Geologists identify minerals using polarizing microscopes — each crystal has unique patterns',
    contentZh: '地质学家使用偏光显微镜鉴定矿物——每种晶体都有独特图案',
  },
]

// 分类数组
const FACT_CATEGORIES: CoolFactType[] = ['history', 'knowledge', 'experiment', 'daily']

// 获取指定类型的所有facts
function getFactsByType(type: CoolFactType): CoolFact[] {
  return COOL_FACTS.filter(f => f.type === type)
}

// 类型标签配置
const TYPE_LABELS: Record<CoolFactType, { en: string; zh: string }> = {
  history: { en: 'History', zh: '历史' },
  knowledge: { en: 'Fun Fact', zh: '知识' },
  experiment: { en: 'Try It', zh: '小实验' },
  daily: { en: 'Daily Life', zh: '生活应用' },
}

// 根据localStorage存储和时间控制cool fact显示 - 返回两个不同类型的facts
function useCoolFacts(): [CoolFact, CoolFact] {
  const [facts] = useState<[CoolFact, CoolFact]>(() => {
    // 检查localStorage中的存储
    const stored = localStorage.getItem('polarcraft_cool_facts_v2')
    if (stored) {
      const { indices, types, timestamp } = JSON.parse(stored)
      // 如果存储时间小于1小时，使用存储的索引
      if (Date.now() - timestamp < 3600000) {
        const factsByType1 = getFactsByType(types[0])
        const factsByType2 = getFactsByType(types[1])
        if (factsByType1[indices[0]] && factsByType2[indices[1]]) {
          return [factsByType1[indices[0]], factsByType2[indices[1]]]
        }
      }
    }

    // 随机选择两个不同的类型
    const shuffledTypes = [...FACT_CATEGORIES].sort(() => Math.random() - 0.5)
    const type1 = shuffledTypes[0]
    const type2 = shuffledTypes[1]

    // 从每个类型中随机选择一个fact
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
  })

  return facts
}

// About section links
interface FooterLink {
  labelKey: string
  labelZh: string
  path: string
  external?: boolean
  icon?: 'github' | 'mail' | 'external'
}

const ABOUT_LINKS: FooterLink[] = [
  { labelKey: 'GitHub', labelZh: 'GitHub', path: 'https://github.com/openwisdomlab/polarisationcourse', external: true, icon: 'github' },
]

// 单个fact卡片组件
function FactCard({ fact, theme, isZh }: { fact: CoolFact; theme: 'dark' | 'light'; isZh: boolean }) {
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
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          colors.iconBg
        )}
      >
        <Sparkles className={cn('w-4 h-4', colors.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {fact.year && (
            <span className={cn('text-sm font-bold tabular-nums', colors.text)}>
              {fact.year}
            </span>
          )}
          <span className={cn('text-xs px-1.5 py-0.5 rounded', colors.bg)}>
            {isZh ? TYPE_LABELS[fact.type].zh : TYPE_LABELS[fact.type].en}
          </span>
        </div>
        <h4
          className={cn(
            'text-sm font-semibold mb-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}
        >
          {isZh ? fact.titleZh : fact.titleEn}
        </h4>
        <p
          className={cn(
            'text-xs leading-relaxed',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}
        >
          {isZh ? fact.contentZh : fact.contentEn}
        </p>
        {fact.scientistEn && (
          <p
            className={cn(
              'text-[10px] italic mt-1',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}
          >
            — {isZh ? fact.scientistZh : fact.scientistEn}
          </p>
        )}
      </div>
    </div>
  )
}

export function Footer() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [fact1, fact2] = useCoolFacts()

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'github': return <Github className="w-3 h-3" />
      case 'mail': return <Mail className="w-3 h-3" />
      case 'external': return <ExternalLink className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <footer
      className={cn(
        'border-t py-8 px-4 sm:px-6 lg:px-8',
        theme === 'dark'
          ? 'bg-slate-900/50 border-slate-800'
          : 'bg-gray-50 border-gray-200'
      )}
    >
      <div className="max-w-6xl mx-auto">
        {/* Cool Facts Section - Two columns with different categories */}
        <div
          className={cn(
            'mb-6 p-4 rounded-xl',
            theme === 'dark'
              ? 'bg-slate-800/50 border border-slate-700/50'
              : 'bg-white/70 border border-gray-200'
          )}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <FactCard fact={fact1} theme={theme} isZh={isZh} />
            <FactCard fact={fact2} theme={theme} isZh={isZh} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={cn(
            'flex flex-col sm:flex-row items-center justify-between gap-4'
          )}
        >
          {/* Left: Logo and Copyright */}
          <div className="flex items-center gap-4">
            <img
              src="/images/combined-logo.png"
              alt="X-Institute & Open Wisdom Lab"
              className="h-10 w-auto"
            />
            <div className="flex flex-col">
              <p
                className={cn(
                  'text-sm font-medium',
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}
              >
                PolarCraft &copy; 2026
              </p>
              <p
                className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}
              >
                supported by Open Wisdom Lab
              </p>
            </div>
          </div>

          {/* Right: About Links */}
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'text-xs font-medium uppercase tracking-wider',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}
            >
              {isZh ? '关于我们' : 'About'}
            </span>
            <div className="flex items-center gap-3">
              {ABOUT_LINKS.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center gap-1 text-xs transition-colors',
                    theme === 'dark'
                      ? 'text-gray-500 hover:text-cyan-400'
                      : 'text-gray-600 hover:text-cyan-600'
                  )}
                >
                  {isZh ? link.labelZh : link.labelKey}
                  {getIcon(link.icon)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
