/**
 * DiscoveryTimeline - 随机展示重要偏振光发现的组件
 * 与Logo交互时展示历史发现事件
 *
 * Design concept:
 * - 周期性展示重要的偏振光发现历史
 * - 淡入淡出的优雅过渡效果
 * - 支持语言切换 (中英文)
 * - 悬停logo时暂停自动切换
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Sparkles } from 'lucide-react'

interface DiscoveryEvent {
  year: number
  titleEn: string
  titleZh: string
  scientistEn?: string
  scientistZh?: string
  shortDescEn: string
  shortDescZh: string
  category: 'discovery' | 'theory' | 'experiment' | 'application'
}

// 精选的重要偏振光发现事件（importance: 1, track: polarization 或核心光学事件）
const DISCOVERY_EVENTS: DiscoveryEvent[] = [
  {
    year: 1669,
    titleEn: 'Discovery of Double Refraction',
    titleZh: '双折射现象的发现',
    scientistEn: 'Erasmus Bartholin',
    scientistZh: '巴托林',
    shortDescEn: 'A calcite crystal splits light in two, revealing polarization',
    shortDescZh: '方解石将一束光一分为二，偏振首次显现',
    category: 'discovery',
  },
  {
    year: 1808,
    titleEn: 'Polarization by Reflection',
    titleZh: '反射偏振的发现',
    scientistEn: 'Étienne-Louis Malus',
    scientistZh: '马吕斯',
    shortDescEn: 'Light reflected from glass becomes polarized',
    shortDescZh: '透过方解石观察卢森堡宫窗户的反射光',
    category: 'discovery',
  },
  {
    year: 1809,
    titleEn: "Malus's Law",
    titleZh: '马吕斯定律',
    scientistEn: 'Étienne-Louis Malus',
    scientistZh: '马吕斯',
    shortDescEn: 'I = I₀cos²θ — the fundamental law of polarization',
    shortDescZh: 'I = I₀cos²θ — 偏振光学的基本定律',
    category: 'theory',
  },
  {
    year: 1812,
    titleEn: "Brewster's Angle",
    titleZh: '布儒斯特角',
    scientistEn: 'David Brewster',
    scientistZh: '布儒斯特',
    shortDescEn: 'The angle at which reflected light is completely polarized',
    shortDescZh: '反射光完全偏振的特定角度',
    category: 'discovery',
  },
  {
    year: 1815,
    titleEn: 'Discovery of Optical Activity',
    titleZh: '旋光性的发现',
    scientistEn: 'Jean-Baptiste Biot',
    scientistZh: '毕奥',
    shortDescEn: 'Sugar solutions rotate the plane of polarized light',
    shortDescZh: '糖溶液旋转偏振光的振动平面',
    category: 'discovery',
  },
  {
    year: 1817,
    titleEn: 'Transverse Wave Theory',
    titleZh: '横波理论',
    scientistEn: 'Augustin-Jean Fresnel',
    scientistZh: '菲涅尔',
    shortDescEn: 'Polarization proves light is a transverse wave',
    shortDescZh: '偏振现象证明光是横波',
    category: 'theory',
  },
  {
    year: 1845,
    titleEn: 'Faraday Effect',
    titleZh: '法拉第效应',
    scientistEn: 'Michael Faraday',
    scientistZh: '法拉第',
    shortDescEn: 'Magnetic field rotates polarized light in glass',
    shortDescZh: '磁场旋转玻璃中偏振光的平面',
    category: 'discovery',
  },
  {
    year: 1848,
    titleEn: 'Molecular Chirality',
    titleZh: '分子手性的发现',
    scientistEn: 'Louis Pasteur',
    scientistZh: '巴斯德',
    shortDescEn: 'Mirror-image molecules rotate polarized light differently',
    shortDescZh: '镜像分子以不同方向旋转偏振光',
    category: 'discovery',
  },
  {
    year: 1929,
    titleEn: 'Polaroid Filter',
    titleZh: '宝丽来偏振片',
    scientistEn: 'Edwin Land',
    scientistZh: '兰德',
    shortDescEn: 'First synthetic polarizer revolutionizes applications',
    shortDescZh: '第一种合成偏振片，彻底改变偏振应用',
    category: 'application',
  },
  {
    year: 1960,
    titleEn: 'Invention of the Laser',
    titleZh: '激光的发明',
    scientistEn: 'Theodore Maiman',
    scientistZh: '梅曼',
    shortDescEn: 'Coherent polarized light changes the world',
    shortDescZh: '相干偏振光改变世界',
    category: 'discovery',
  },
  {
    year: 1982,
    titleEn: "Bell's Inequality Tested",
    titleZh: '贝尔不等式验证',
    scientistEn: 'Alain Aspect',
    scientistZh: '阿斯佩',
    shortDescEn: 'Entangled photon polarization proves quantum non-locality',
    shortDescZh: '纠缠光子偏振证实量子非定域性',
    category: 'experiment',
  },
  {
    year: 2021,
    titleEn: 'Metasurface Polarization Control',
    titleZh: '超表面偏振调控',
    shortDescEn: 'Dynamic pixel-level control of light polarization',
    shortDescZh: '可编程超表面实现像素级偏振控制',
    category: 'discovery',
  },
]

interface DiscoveryTimelineProps {
  theme: 'dark' | 'light'
  isLogoHovered?: boolean
  className?: string
}

// 类别颜色映射
const CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  discovery: {
    text: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-100/50 dark:bg-amber-900/30',
    border: 'border-amber-300/50 dark:border-amber-700/50',
  },
  theory: {
    text: 'text-violet-500 dark:text-violet-400',
    bg: 'bg-violet-100/50 dark:bg-violet-900/30',
    border: 'border-violet-300/50 dark:border-violet-700/50',
  },
  experiment: {
    text: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-100/50 dark:bg-emerald-900/30',
    border: 'border-emerald-300/50 dark:border-emerald-700/50',
  },
  application: {
    text: 'text-cyan-500 dark:text-cyan-400',
    bg: 'bg-cyan-100/50 dark:bg-cyan-900/30',
    border: 'border-cyan-300/50 dark:border-cyan-700/50',
  },
}

export function DiscoveryTimeline({
  theme,
  isLogoHovered = false,
  className = '',
}: DiscoveryTimelineProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * DISCOVERY_EVENTS.length))
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // 获取随机下一个事件（不重复当前）
  const getNextIndex = useCallback(() => {
    const nextIndex = Math.floor(Math.random() * (DISCOVERY_EVENTS.length - 1))
    return nextIndex >= currentIndex ? nextIndex + 1 : nextIndex
  }, [currentIndex])

  // 自动切换事件
  useEffect(() => {
    if (isPaused || isLogoHovered) return

    const intervalId = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(getNextIndex())
        setIsTransitioning(false)
      }, 300) // 淡出时间
    }, 6000) // 每6秒切换

    return () => clearInterval(intervalId)
  }, [isPaused, isLogoHovered, getNextIndex])

  const currentEvent = useMemo(() => DISCOVERY_EVENTS[currentIndex], [currentIndex])
  const categoryColor = CATEGORY_COLORS[currentEvent.category]

  // 手动切换到下一个事件
  const handleNext = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(getNextIndex())
      setIsTransitioning(false)
    }, 200)
  }

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 事件卡片 */}
      <div
        className={`
          relative overflow-hidden rounded-xl px-4 py-3
          transition-all duration-300 ease-out
          ${isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}
          ${theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'}
          border ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200/80'}
          backdrop-blur-sm
        `}
      >
        {/* 年份和类别 */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`
              text-lg font-bold tabular-nums
              ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}
            `}
          >
            {currentEvent.year}
          </span>
          <span
            className={`
              px-1.5 py-0.5 text-[10px] font-medium rounded
              ${categoryColor.bg} ${categoryColor.text}
            `}
          >
            {isZh
              ? currentEvent.category === 'discovery'
                ? '发现'
                : currentEvent.category === 'theory'
                  ? '理论'
                  : currentEvent.category === 'experiment'
                    ? '实验'
                    : '应用'
              : currentEvent.category.charAt(0).toUpperCase() + currentEvent.category.slice(1)}
          </span>
          <Sparkles
            className={`w-3 h-3 ${theme === 'dark' ? 'text-amber-400/60' : 'text-amber-500/50'}`}
          />
        </div>

        {/* 标题 */}
        <h4
          className={`
            text-sm font-semibold mb-0.5 leading-tight
            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
          `}
        >
          {isZh ? currentEvent.titleZh : currentEvent.titleEn}
        </h4>

        {/* 描述 */}
        <p
          className={`
            text-xs leading-relaxed mb-1
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          `}
        >
          {isZh ? currentEvent.shortDescZh : currentEvent.shortDescEn}
        </p>

        {/* 科学家 */}
        {currentEvent.scientistEn && (
          <p
            className={`
              text-[10px] italic
              ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}
            `}
          >
            — {isZh ? currentEvent.scientistZh : currentEvent.scientistEn}
          </p>
        )}

        {/* 进度指示器 */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200/30 dark:bg-gray-700/30">
          <div
            className={`
              h-full bg-gradient-to-r from-cyan-500 to-blue-500
              transition-all ease-linear
              ${isPaused || isLogoHovered ? 'w-0' : 'animate-progress-bar'}
            `}
          />
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-between mt-2 px-1">
        {/* 时间线指示器 */}
        <div className="flex items-center gap-1">
          {DISCOVERY_EVENTS.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentIndex(i)
                  setIsTransitioning(false)
                }, 200)
              }}
              className={`
                w-1.5 h-1.5 rounded-full transition-all duration-200
                ${
                  i === currentIndex
                    ? theme === 'dark'
                      ? 'bg-cyan-400 w-3'
                      : 'bg-cyan-600 w-3'
                    : theme === 'dark'
                      ? 'bg-gray-600 hover:bg-gray-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                }
              `}
              aria-label={`Show event ${i + 1}`}
            />
          ))}
          <span className={`text-[10px] ml-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            +{DISCOVERY_EVENTS.length - 5}
          </span>
        </div>

        {/* 更多链接 */}
        <Link
          to="/chronicles"
          className={`
            group flex items-center gap-0.5 text-[10px] font-medium
            transition-colors duration-200
            ${
              theme === 'dark'
                ? 'text-gray-500 hover:text-cyan-400'
                : 'text-gray-400 hover:text-cyan-600'
            }
          `}
        >
          {isZh ? '探索更多历史' : 'Explore more'}
          <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* 下一个按钮 */}
        <button
          onClick={handleNext}
          className={`
            p-1 rounded transition-colors duration-200
            ${
              theme === 'dark'
                ? 'text-gray-500 hover:text-white hover:bg-gray-700/50'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-200/50'
            }
          `}
          aria-label="Next discovery"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 进度条动画样式 */}
      <style>{`
        @keyframes progress-bar {
          from { width: 0; }
          to { width: 100%; }
        }
        .animate-progress-bar {
          animation: progress-bar 6s linear;
        }
      `}</style>
    </div>
  )
}

export default DiscoveryTimeline
