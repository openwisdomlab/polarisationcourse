/**
 * Footer Component - Site-wide footer with cool facts and minimal navigation
 * 页脚组件 - 精简版页脚，包含随机偏振光知识/历史事件
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Github, ExternalLink, Mail, Sparkles } from 'lucide-react'
import { OpenWisdomLabLogo } from '@/components/icons'

// 偏振光知识和历史事件数据
interface CoolFact {
  type: 'knowledge' | 'history'
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
]

// 根据localStorage存储和时间控制cool fact显示
function useCoolFact() {
  const [factIndex] = useState<number>(() => {
    // 检查localStorage中的存储
    const stored = localStorage.getItem('polarcraft_cool_fact')
    if (stored) {
      const { index, timestamp } = JSON.parse(stored)
      // 如果存储时间小于1小时，使用存储的索引
      if (Date.now() - timestamp < 3600000) {
        return index
      }
    }
    // 否则生成新的随机索引
    const newIndex = Math.floor(Math.random() * COOL_FACTS.length)
    localStorage.setItem('polarcraft_cool_fact', JSON.stringify({
      index: newIndex,
      timestamp: Date.now()
    }))
    return newIndex
  })

  return COOL_FACTS[factIndex]
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
  { labelKey: 'Open Wisdom Lab', labelZh: '开悟工坊', path: 'https://openwisdom.cn', external: true, icon: 'external' },
  { labelKey: 'GitHub', labelZh: 'GitHub', path: 'https://github.com/openwisdomlab/polarisationcourse', external: true, icon: 'github' },
  { labelKey: 'Feedback', labelZh: '反馈建议', path: 'https://github.com/openwisdomlab/polarisationcourse/issues', external: true, icon: 'mail' },
]

export function Footer() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const coolFact = useCoolFact()

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
      <div className="max-w-4xl mx-auto">
        {/* Cool Fact Section */}
        <div
          className={cn(
            'mb-6 p-4 rounded-xl',
            theme === 'dark'
              ? 'bg-slate-800/50 border border-slate-700/50'
              : 'bg-white/70 border border-gray-200'
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                coolFact.type === 'history'
                  ? theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
                  : theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
              )}
            >
              <Sparkles
                className={cn(
                  'w-4 h-4',
                  coolFact.type === 'history'
                    ? theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                    : theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {coolFact.year && (
                  <span
                    className={cn(
                      'text-sm font-bold tabular-nums',
                      theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                    )}
                  >
                    {coolFact.year}
                  </span>
                )}
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded',
                    coolFact.type === 'history'
                      ? theme === 'dark' ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
                      : theme === 'dark' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                  )}
                >
                  {coolFact.type === 'history'
                    ? (isZh ? '历史' : 'History')
                    : (isZh ? '知识' : 'Fun Fact')}
                </span>
              </div>
              <h4
                className={cn(
                  'text-sm font-semibold mb-1',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}
              >
                {isZh ? coolFact.titleZh : coolFact.titleEn}
              </h4>
              <p
                className={cn(
                  'text-xs leading-relaxed',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                {isZh ? coolFact.contentZh : coolFact.contentEn}
              </p>
              {coolFact.scientistEn && (
                <p
                  className={cn(
                    'text-[10px] italic mt-1',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}
                >
                  — {isZh ? coolFact.scientistZh : coolFact.scientistEn}
                </p>
              )}
            </div>
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
            <OpenWisdomLabLogo height={40} theme={theme} />
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
