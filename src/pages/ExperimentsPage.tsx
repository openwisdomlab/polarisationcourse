/**
 * Experiments Page - Polarization Creation Bureau (偏振造物局)
 * 偏振造物局 - 艺术与DIY创作中心
 *
 * Sub-modules:
 * 1. DIY实验 - Hands-on experiments with everyday materials
 * 2. 偏振文创 - Polarization-themed creative products
 * 3. 作品展示 - Community gallery and works showcase
 * 4. 创作工坊 - Creative workshop and tutorials
 */

import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Tabs, PersistentHeader } from '@/components/shared'
import { ArtGallery } from '@/components/shared/PolarizationArt'
import { CulturalShowcase } from '@/components/experiments'
import {
  Beaker, Eye, Palette, ImageIcon, Sparkles, Package,
  Scissors, Layers, Wand2
} from 'lucide-react'
import { EXPERIMENTS, VALID_TABS, type TabId, type Difficulty, type Experiment } from '@/data/experiments'


// Tab type definition
export function ExperimentsPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'
  const { tabId } = useParams<{ tabId?: string }>()
  const navigate = useNavigate()

  // Determine active tab from URL param or default to 'diy'
  const getActiveTab = (): TabId => {
    if (tabId && VALID_TABS.includes(tabId as TabId)) {
      return tabId as TabId
    }
    return 'diy'
  }

  const [activeTab, setActiveTab] = useState<TabId>(getActiveTab())
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Sync active tab with URL
  useEffect(() => {
    const newTab = getActiveTab()
    if (newTab !== activeTab) {
      setActiveTab(newTab)
      setFilterCategory('all')
      setFilterDifficulty('all')
    }
  }, [tabId])

  // Handle tab change - navigate to new route
  const handleTabChange = (newTabId: string) => {
    const tab = newTabId as TabId
    setActiveTab(tab)
    setFilterCategory('all')
    setFilterDifficulty('all')
    navigate(`/experiments/${tab}`)
  }

  // Filter experiments
  const filteredExperiments = filterDifficulty === 'all'
    ? EXPERIMENTS
    : EXPERIMENTS.filter(exp => exp.difficulty === filterDifficulty)

  // Filter products by category
  const filteredProducts = filterCategory === 'all'
    ? CREATIVE_PRODUCTS
    : CREATIVE_PRODUCTS.filter(p => p.category === filterCategory)

  // Filter gallery works by category
  const filteredWorks = filterCategory === 'all'
    ? GALLERY_WORKS
    : GALLERY_WORKS.filter(w => w.category === filterCategory)

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
    )}>
      {/* Header with Persistent Logo */}
      <PersistentHeader
        moduleKey="creativeLab"
        moduleNameKey="home.creativeLab.title"
        variant="glass"
        className={cn(
          'sticky top-0 z-40',
          theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'
        )}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Sub-module Tabs */}
        <div className="mb-6">
          <Tabs
            tabs={SUB_MODULE_TABS.map(tab => ({
              ...tab,
              label: isZh ? tab.labelZh : tab.labelEn,
            }))}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        </div>

        {/* Tab-specific content */}
        {activeTab === 'diy' && (
          <>
            {/* Intro Banner */}
            <div className={cn(
              'rounded-2xl p-6 mb-8 border',
              theme === 'dark'
                ? 'bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border-teal-700/30'
                : 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200'
            )}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
                  theme === 'dark' ? 'bg-teal-500/20' : 'bg-teal-100'
                )}>
                  <Beaker className={cn('w-7 h-7', theme === 'dark' ? 'text-teal-400' : 'text-teal-600')} />
                </div>
                <div className="flex-1">
                  <h2 className={cn(
                    'text-lg font-semibold mb-1',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '用身边材料探索偏振光的奥秘' : 'Explore Polarization with Everyday Materials'}
                  </h2>
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {isZh
                      ? '这些实验使用手机、胶带、塑料等日常物品，无需昂贵设备即可在家体验偏振光的魅力。'
                      : 'These experiments use phones, tape, plastic and other household items. No expensive equipment needed!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Difficulty Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterDifficulty('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              filterDifficulty === 'all'
                ? theme === 'dark'
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50'
                  : 'bg-teal-100 text-teal-700 border border-teal-300'
                : theme === 'dark'
                  ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            )}
          >
            {isZh ? '全部' : 'All'}
          </button>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => {
            const config = DIFFICULTY_CONFIG[diff]
            return (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1',
                  filterDifficulty === diff
                    ? theme === 'dark'
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50'
                      : 'bg-teal-100 text-teal-700 border border-teal-300'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
              >
                <span>{config.icon}</span>
                {isZh ? config.labelZh : config.labelEn}
              </button>
            )
          })}
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExperiments.map(experiment => (
            <ExperimentCard
              key={experiment.id}
              experiment={experiment}
              onClick={() => setSelectedExperiment(experiment)}
            />
          ))}
        </div>

        {/* Getting Started Section */}
        <div className={cn(
          'mt-12 rounded-2xl border p-6',
          theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-gray-200'
        )}>
          <h3 className={cn(
            'text-lg font-semibold mb-4',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '如何获取偏振片？' : 'Where to Get Polarizers?'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={cn(
              'p-4 rounded-lg',
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
            )}>
              <span className="text-2xl mb-2 block">🕶️</span>
              <h4 className={cn('font-medium mb-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {isZh ? '偏振太阳镜' : 'Polarized Sunglasses'}
              </h4>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '便宜的偏振太阳镜可以直接使用' : 'Cheap polarized sunglasses work great'}
              </p>
            </div>
            <div className={cn(
              'p-4 rounded-lg',
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
            )}>
              <span className="text-2xl mb-2 block">🖥️</span>
              <h4 className={cn('font-medium mb-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {isZh ? '旧LCD屏幕' : 'Old LCD Screens'}
              </h4>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '从废旧计算器或显示器中取出' : 'Extract from old calculators or monitors'}
              </p>
            </div>
            <div className={cn(
              'p-4 rounded-lg',
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
            )}>
              <span className="text-2xl mb-2 block">🛒</span>
              <h4 className={cn('font-medium mb-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {isZh ? '网上购买' : 'Buy Online'}
              </h4>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '淘宝搜索"偏振片"，价格很便宜' : 'Search for "polarizing film" - very affordable'}
              </p>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Art & Creations Tab - 作品与创意：合并展示真实作品和产品创意 */}
        {activeTab === 'showcase' && (
          <>
            {/* Real Artworks from CulturalShowcase */}
            <CulturalShowcase />

            {/* Product Ideas Section - 产品创意概念（无价格） */}
            <div className="mt-12">
              <div className={cn(
                'flex items-center gap-3 mb-6 pb-4 border-b',
                theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
              )}>
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  theme === 'dark' ? 'bg-violet-500/20' : 'bg-violet-100'
                )}>
                  <Palette className={cn('w-5 h-5', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
                </div>
                <div>
                  <h3 className={cn(
                    'text-lg font-semibold',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '产品创意灵感' : 'Product Ideas & Inspiration'}
                  </h3>
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {isZh ? '偏振光艺术产品创意概念，激发你的创作灵感' : 'Creative concepts for polarization art products'}
                  </p>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                    filterCategory === 'all'
                      ? theme === 'dark'
                        ? 'bg-violet-500/20 text-violet-400 border border-violet-500/50'
                        : 'bg-violet-100 text-violet-700 border border-violet-300'
                      : theme === 'dark'
                        ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                  )}
                >
                  {isZh ? '全部' : 'All'}
                </button>
                {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map(cat => {
                  const config = CATEGORY_CONFIG[cat]
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1',
                        filterCategory === cat
                          ? theme === 'dark'
                            ? 'bg-violet-500/20 text-violet-400 border border-violet-500/50'
                            : 'bg-violet-100 text-violet-700 border border-violet-300'
                          : theme === 'dark'
                            ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                            : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <span>{config.icon}</span>
                      {isZh ? config.labelZh : config.labelEn}
                    </button>
                  )
                })}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <>
            {/* Intro Banner */}
            <div className={cn(
              'rounded-2xl p-6 mb-8 border',
              theme === 'dark'
                ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-700/30'
                : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200'
            )}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
                  theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
                )}>
                  <ImageIcon className={cn('w-7 h-7', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                </div>
                <div className="flex-1">
                  <h2 className={cn(
                    'text-lg font-semibold mb-1',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '偏振艺术作品展示' : 'Polarization Art Gallery'}
                  </h2>
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {isZh
                      ? '来自社区的精彩偏振光艺术作品，包括胶带艺术、摄影和科学项目。'
                      : 'Amazing polarization art from our community - tape art, photography, and science projects.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterCategory('all')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  filterCategory === 'all'
                    ? theme === 'dark'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
              >
                {isZh ? '全部' : 'All'}
              </button>
              {(Object.keys(GALLERY_CATEGORY_CONFIG) as Array<keyof typeof GALLERY_CATEGORY_CONFIG>).map(cat => {
                const config = GALLERY_CATEGORY_CONFIG[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                      filterCategory === cat
                        ? theme === 'dark'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                        : theme === 'dark'
                          ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                          : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {isZh ? config.labelZh : config.labelEn}
                  </button>
                )
              })}
            </div>

            {/* Works Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorks.map(work => (
                <GalleryCard key={work.id} work={work} />
              ))}
            </div>

            {/* Submit Your Work CTA */}
            <div className={cn(
              'mt-12 rounded-2xl border p-6 text-center',
              theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-gray-200'
            )}>
              <Sparkles className={cn(
                'w-10 h-10 mx-auto mb-3',
                theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
              )} />
              <h3 className={cn(
                'text-lg font-semibold mb-2',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '分享你的作品' : 'Share Your Work'}
              </h3>
              <p className={cn(
                'text-sm mb-4 max-w-md mx-auto',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh
                  ? '创作了偏振光艺术作品？提交给我们，有机会在这里展示！'
                  : 'Created a polarization art piece? Submit it and get featured in our gallery!'}
              </p>
              <button
                className={cn(
                  'px-6 py-2.5 rounded-lg font-medium transition-colors',
                  theme === 'dark'
                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                )}
              >
                {isZh ? '提交作品' : 'Submit Work'}
              </button>
            </div>
          </>
        )}

        {/* Workshop Tab */}
        {activeTab === 'workshop' && (
          <>
            {/* Intro Banner */}
            <div className={cn(
              'rounded-2xl p-6 mb-8 border',
              theme === 'dark'
                ? 'bg-gradient-to-r from-pink-900/30 to-rose-900/30 border-pink-700/30'
                : 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200'
            )}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
                  theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-100'
                )}>
                  <Scissors className={cn('w-7 h-7', theme === 'dark' ? 'text-pink-400' : 'text-pink-600')} />
                </div>
                <div className="flex-1">
                  <h2 className={cn(
                    'text-lg font-semibold mb-1',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '创作工坊教程' : 'Creative Workshop Tutorials'}
                  </h2>
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {isZh
                      ? '从基础到进阶的偏振艺术创作教程，学习制作属于你的偏振光艺术品。'
                      : 'Step-by-step tutorials from basics to advanced polarization art creation.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tutorials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {TUTORIALS.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>

            {/* More resources section */}
            <div className={cn(
              'rounded-2xl border p-6',
              theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-gray-200'
            )}>
              <h3 className={cn(
                'text-lg font-semibold mb-4',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '更多创作资源' : 'More Resources'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  to="/demos"
                  className={cn(
                    'p-4 rounded-lg flex items-start gap-3 transition-colors',
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700'
                      : 'bg-gray-50 hover:bg-gray-100'
                  )}
                >
                  <Eye className={cn('w-5 h-5 mt-0.5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                  <div>
                    <h4 className={cn('font-medium mb-0.5', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      {isZh ? '偏振演示馆' : 'Demo Gallery'}
                    </h4>
                    <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      {isZh ? '了解偏振原理' : 'Learn polarization principles'}
                    </p>
                  </div>
                </Link>
                <Link
                  to="/devices"
                  className={cn(
                    'p-4 rounded-lg flex items-start gap-3 transition-colors',
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700'
                      : 'bg-gray-50 hover:bg-gray-100'
                  )}
                >
                  <Package className={cn('w-5 h-5 mt-0.5', theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')} />
                  <div>
                    <h4 className={cn('font-medium mb-0.5', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      {isZh ? '器件图鉴' : 'Device Library'}
                    </h4>
                    <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      {isZh ? '认识光学器件' : 'Learn optical devices'}
                    </p>
                  </div>
                </Link>
                <Link
                  to="/bench"
                  className={cn(
                    'p-4 rounded-lg flex items-start gap-3 transition-colors',
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700'
                      : 'bg-gray-50 hover:bg-gray-100'
                  )}
                >
                  <Layers className={cn('w-5 h-5 mt-0.5', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
                  <div>
                    <h4 className={cn('font-medium mb-0.5', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      {isZh ? '光路设计室' : 'Optical Bench'}
                    </h4>
                    <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      {isZh ? '设计光路实验' : 'Design optical experiments'}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Art Generator Tab - 偏振艺术生成器 */}
        {activeTab === 'generator' && (
          <>
            {/* Intro Banner */}
            <div className={cn(
              'rounded-2xl p-6 mb-8 border',
              theme === 'dark'
                ? 'bg-gradient-to-r from-pink-900/30 to-rose-900/30 border-pink-700/30'
                : 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200'
            )}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
                  theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-100'
                )}>
                  <Wand2 className={cn('w-7 h-7', theme === 'dark' ? 'text-pink-400' : 'text-pink-600')} />
                </div>
                <div className="flex-1">
                  <h2 className={cn(
                    'text-lg font-semibold mb-1',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '偏振艺术生成器' : 'Polarization Art Generator'}
                  </h2>
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  )}>
                    {isZh
                      ? '基于真实偏振光学原理，生成独特的抽象艺术作品。选择不同的物理效应类型、调整复杂度和配色，创造属于你的偏振艺术。'
                      : 'Generate unique abstract artworks based on real polarization optics principles. Choose different physics effect types, adjust complexity and colors to create your own polarization art.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Art Generator Component */}
            <div className={cn(
              'rounded-2xl border p-6',
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-white border-gray-200'
            )}>
              <ArtGenerator />
            </div>

            {/* Art Gallery Section */}
            <div className={cn(
              'rounded-2xl border p-6 mt-8',
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-white border-gray-200'
            )}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-pink-400' : 'text-pink-600')} />
                <h3 className={cn(
                  'text-lg font-semibold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '灵感画廊' : 'Inspiration Gallery'}
                </h3>
              </div>
              <p className={cn(
                'text-sm mb-6',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh
                  ? '浏览程序生成的偏振艺术样例，获取创作灵感。'
                  : 'Browse programmatically generated polarization art samples for inspiration.'}
              </p>
              <ArtGallery count={6} />
            </div>
          </>
        )}
      </main>

      {/* Experiment Detail Modal */}
      {selectedExperiment && (
        <ExperimentDetailModal
          experiment={selectedExperiment}
          onClose={() => setSelectedExperiment(null)}
        />
      )}
    </div>
  )
}

export default ExperimentsPage

// Configuration for UI display
const DIFFICULTY_CONFIG = {
  easy: { labelEn: 'Easy', labelZh: '简单', color: 'green' as const, icon: '🌱' },
  medium: { labelEn: 'Medium', labelZh: '中等', color: 'yellow' as const, icon: '🌿' },
  hard: { labelEn: 'Hard', labelZh: '困难', color: 'red' as const, icon: '🌳' },
}

// @ts-expect-error - Placeholder config for future use
const COST_CONFIG = {
  free: { labelEn: 'Free', labelZh: '免费', icon: '✓' },
  low: { labelEn: '$', labelZh: '低成本', icon: '$' },
  medium: { labelEn: '$$', labelZh: '中等成本', icon: '$$' },
}

// Placeholder data for future modules
const CATEGORY_CONFIG: Record<string, {labelEn: string, labelZh: string, icon: string}> = {
  all: { labelEn: 'All', labelZh: '全部', icon: '🌟' },
}
const GALLERY_CATEGORY_CONFIG: Record<string, {labelEn: string, labelZh: string}> = {}
const TUTORIALS: any[] = []
const CREATIVE_PRODUCTS: any[] = []
const GALLERY_WORKS: any[] = []
const SUB_MODULE_TABS = [
  { id: 'diy', labelEn: 'DIY Experiments', labelZh: 'DIY实验', icon: '🔬' },
  { id: 'showcase', labelEn: 'Showcase', labelZh: '作品展示', icon: '🎨' },
  { id: 'gallery', labelEn: 'Gallery', labelZh: '画廊', icon: '🖼️' },
  { id: 'workshop', labelEn: 'Workshop', labelZh: '工作坊', icon: '🛠️' },
  { id: 'generator', labelEn: 'Generator', labelZh: '生成器', icon: '✨' },
]
// @ts-expect-error - Placeholder component for future use
const ExperimentCard = ({experiment, onClick}: {experiment: any, onClick?: () => void}) => null
// @ts-expect-error - Placeholder component for future use
const ProductCard = ({product}: {product: any}) => null
// @ts-expect-error - Placeholder component for future use
const GalleryCard = ({work}: {work: any}) => null
// @ts-expect-error - Placeholder component for future use
const TutorialCard = ({tutorial}: {tutorial: any}) => null
const ArtGenerator = () => null
// @ts-expect-error - Placeholder component for future use
const ExperimentDetailModal = ({experiment, onClose}: {experiment: any, onClose: () => void}) => null
