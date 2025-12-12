/**
 * Bench Page - Optical Path Designer
 * 光路设计室 - 搭建光路 × 模拟验证
 *
 * Interactive optical bench where users can:
 * - Drag and drop optical components
 * - Build classic experiments or free designs
 * - See real-time light path simulation
 * - Link to UC2 hardware for real-world builds
 */

import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Tabs, Badge } from '@/components/shared'
import {
  Home, Play, Pause, RotateCcw,
  ChevronRight, Trash2, Eye, EyeOff,
  Lightbulb, Layers, HelpCircle,
  Box, ExternalLink
} from 'lucide-react'

// Component types for the optical bench
type BenchComponentType = 'emitter' | 'polarizer' | 'waveplate' | 'mirror' | 'splitter' | 'sensor' | 'lens'

interface BenchComponent {
  id: string
  type: BenchComponentType
  x: number
  y: number
  rotation: number
  properties: Record<string, number | string>
}

interface ClassicExperiment {
  id: string
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  difficulty: 'easy' | 'medium' | 'hard'
  components: BenchComponent[]
  learningPoints: { en: string[]; zh: string[] }
  linkedDemo?: string
}

// Palette components available for building
const PALETTE_COMPONENTS: { type: BenchComponentType; icon: string; nameEn: string; nameZh: string; color: string }[] = [
  { type: 'emitter', icon: '💡', nameEn: 'Light Source', nameZh: '光源', color: 'yellow' },
  { type: 'polarizer', icon: '◐', nameEn: 'Polarizer', nameZh: '偏振片', color: 'indigo' },
  { type: 'waveplate', icon: '◈', nameEn: 'Wave Plate', nameZh: '波片', color: 'violet' },
  { type: 'mirror', icon: '🪞', nameEn: 'Mirror', nameZh: '反射镜', color: 'cyan' },
  { type: 'splitter', icon: '◇', nameEn: 'Beam Splitter', nameZh: '分束器', color: 'emerald' },
  { type: 'sensor', icon: '📡', nameEn: 'Detector', nameZh: '探测器', color: 'rose' },
  { type: 'lens', icon: '🔍', nameEn: 'Lens', nameZh: '透镜', color: 'amber' },
]

// Classic experiments catalog
const CLASSIC_EXPERIMENTS: ClassicExperiment[] = [
  {
    id: 'malus-law',
    nameEn: 'Malus\'s Law Verification',
    nameZh: '马吕斯定律验证',
    descriptionEn: 'Measure intensity through two polarizers as function of angle.',
    descriptionZh: '测量光通过两块偏振片时强度随角度的变化。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 250, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'p2', type: 'polarizer', x: 400, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 's1', type: 'sensor', x: 550, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['I = I₀ cos²θ', 'Crossed polarizers block light', 'Intensity varies smoothly with angle'],
      zh: ['I = I₀ cos²θ', '正交偏振片阻挡光线', '强度随角度平滑变化'],
    },
    linkedDemo: 'malus-law',
  },
  {
    id: 'brewster-angle',
    nameEn: 'Brewster\'s Angle',
    nameZh: '布儒斯特角实验',
    descriptionEn: 'Find the angle where reflected light is completely polarized.',
    descriptionZh: '寻找反射光完全偏振的入射角。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 150, rotation: 56, properties: { polarization: -1 } },
      { id: 'm1', type: 'mirror', x: 300, y: 250, rotation: 0, properties: { material: 'glass' } },
      { id: 'p1', type: 'polarizer', x: 450, y: 150, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 550, y: 150, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['tan θ_B = n₂/n₁', 'Reflected light is s-polarized', 'Used for polarizer-free polarization'],
      zh: ['tan θ_B = n₂/n₁', '反射光为s偏振', '用于无偏振片的偏振获取'],
    },
    linkedDemo: 'brewster-angle',
  },
  {
    id: 'quarter-wave',
    nameEn: 'Circular Polarization Generation',
    nameZh: '圆偏振光产生',
    descriptionEn: 'Use linear polarizer and quarter-wave plate to create circular polarization.',
    descriptionZh: '使用线偏振片和四分之一波片产生圆偏振光。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 220, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'w1', type: 'waveplate', x: 340, y: 200, rotation: 0, properties: { retardation: 90, fastAxis: 0 } },
      { id: 's1', type: 'sensor', x: 480, y: 200, rotation: 0, properties: { mode: 'polarization' } },
    ],
    learningPoints: {
      en: ['45° linear + λ/4 → circular', 'Phase difference creates rotation', 'Handedness depends on orientation'],
      zh: ['45°线偏振 + λ/4 → 圆偏振', '相位差产生旋转', '旋向取决于取向'],
    },
    linkedDemo: 'waveplate',
  },
  {
    id: 'birefringence',
    nameEn: 'Birefringent Crystal',
    nameZh: '双折射晶体',
    descriptionEn: 'Split light into ordinary and extraordinary rays using calcite.',
    descriptionZh: '使用方解石将光分裂为寻常光和非常光。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 45 } },
      { id: 'c1', type: 'splitter', x: 280, y: 200, rotation: 0, properties: { type: 'calcite' } },
      { id: 's1', type: 'sensor', x: 450, y: 150, rotation: 0, properties: {} },
      { id: 's2', type: 'sensor', x: 450, y: 250, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['O-ray: nₒ constant', 'E-ray: nₑ varies with angle', 'Beams have orthogonal polarizations'],
      zh: ['o光：折射率nₒ恒定', 'e光：折射率nₑ随角度变化', '两束光偏振正交'],
    },
    linkedDemo: 'birefringence',
  },
  {
    id: 'stress-analysis',
    nameEn: 'Photoelastic Stress Analysis',
    nameZh: '光弹应力分析',
    descriptionEn: 'Visualize stress in transparent materials between crossed polarizers.',
    descriptionZh: '在正交偏振片之间观察透明材料的应力分布。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: -1, spectrum: 'white' } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'sample', type: 'lens', x: 320, y: 200, rotation: 0, properties: { type: 'sample' } },
      { id: 'p2', type: 'polarizer', x: 460, y: 200, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: { mode: 'imaging' } },
    ],
    learningPoints: {
      en: ['Stress induces birefringence', 'Isochromatic fringes show stress levels', 'Used in engineering design'],
      zh: ['应力诱导双折射', '等色线显示应力水平', '用于工程设计'],
    },
    linkedDemo: 'stress-birefringence',
  },
]

// UC2 hardware mapping
const UC2_COMPONENT_MAP: Record<BenchComponentType, { uc2Id: string; nameEn: string; nameZh: string; stlUrl?: string }> = {
  emitter: { uc2Id: 'UC2-LED', nameEn: 'UC2 LED Module', nameZh: 'UC2 LED模块' },
  polarizer: { uc2Id: 'UC2-POL', nameEn: 'UC2 Polarizer Cube', nameZh: 'UC2 偏振片模块' },
  waveplate: { uc2Id: 'UC2-WP', nameEn: 'UC2 Waveplate Holder', nameZh: 'UC2 波片支架' },
  mirror: { uc2Id: 'UC2-MIR', nameEn: 'UC2 Mirror Mount', nameZh: 'UC2 反射镜支架' },
  splitter: { uc2Id: 'UC2-BS', nameEn: 'UC2 Beam Splitter Cube', nameZh: 'UC2 分束器模块' },
  sensor: { uc2Id: 'UC2-CAM', nameEn: 'UC2 Camera Module', nameZh: 'UC2 相机模块' },
  lens: { uc2Id: 'UC2-LENS', nameEn: 'UC2 Lens Holder', nameZh: 'UC2 透镜支架' },
}

const DIFFICULTY_CONFIG = {
  easy: { labelEn: 'Easy', labelZh: '简单', color: 'green' as const },
  medium: { labelEn: 'Medium', labelZh: '中等', color: 'yellow' as const },
  hard: { labelEn: 'Hard', labelZh: '困难', color: 'red' as const },
}

// Component on bench visualization
function BenchComponentViz({
  component,
  selected,
  onClick,
}: {
  component: BenchComponent
  selected: boolean
  onClick: () => void
}) {
  const { theme } = useTheme()
  const paletteItem = PALETTE_COMPONENTS.find(p => p.type === component.type)

  return (
    <div
      onClick={onClick}
      className={cn(
        'absolute w-14 h-14 rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all',
        'hover:scale-110',
        selected && 'ring-2 ring-offset-2',
        theme === 'dark'
          ? cn('bg-slate-800 border border-slate-600', selected && 'ring-cyan-400 ring-offset-slate-900')
          : cn('bg-white border border-gray-300 shadow-md', selected && 'ring-cyan-500 ring-offset-white')
      )}
      style={{
        left: component.x - 28,
        top: component.y - 28,
        transform: `rotate(${component.rotation}deg)`,
      }}
    >
      {paletteItem?.icon || '?'}
    </div>
  )
}

// Experiment card component
function ExperimentCard({
  experiment,
  onLoad,
}: {
  experiment: ClassicExperiment
  onLoad: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[experiment.difficulty]

  return (
    <div className={cn(
      'rounded-xl border p-4 transition-all hover:shadow-md',
      theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className={cn(
          'font-semibold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? experiment.nameZh : experiment.nameEn}
        </h4>
        <Badge color={difficulty.color} size="sm">
          {isZh ? difficulty.labelZh : difficulty.labelEn}
        </Badge>
      </div>
      <p className={cn(
        'text-sm mb-3 line-clamp-2',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? experiment.descriptionZh : experiment.descriptionEn}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onLoad}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
              : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
          )}
        >
          <Play className="w-4 h-4" />
          {isZh ? '加载' : 'Load'}
        </button>
        {experiment.linkedDemo && (
          <Link
            to={`/demos?demo=${experiment.linkedDemo}`}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              theme === 'dark' ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            )}
            title={isZh ? '查看演示' : 'View Demo'}
          >
            <Eye className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

// UC2 Hardware Panel
function UC2Panel({
  components,
  onClose,
}: {
  components: BenchComponent[]
  onClose: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Group components by type and count
  const componentCounts = components.reduce((acc, comp) => {
    acc[comp.type] = (acc[comp.type] || 0) + 1
    return acc
  }, {} as Record<BenchComponentType, number>)

  return (
    <div className={cn(
      'absolute right-4 top-4 w-80 rounded-xl border shadow-xl z-20',
      theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <div className={cn(
        'flex items-center justify-between p-4 border-b',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          <Box className={cn('w-5 h-5', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')} />
          <h3 className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? 'UC2 零件清单' : 'UC2 Parts List'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className={cn(
            'p-1 rounded transition-colors',
            theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {Object.entries(componentCounts).map(([type, count]) => {
          const uc2Info = UC2_COMPONENT_MAP[type as BenchComponentType]
          return (
            <div
              key={type}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg',
                theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {PALETTE_COMPONENTS.find(p => p.type === type)?.icon}
                </span>
                <div>
                  <p className={cn(
                    'text-sm font-medium',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? uc2Info.nameZh : uc2Info.nameEn}
                  </p>
                  <p className={cn(
                    'text-xs',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {uc2Info.uc2Id}
                  </p>
                </div>
              </div>
              <Badge color="green">×{count}</Badge>
            </div>
          )
        })}
      </div>

      <div className={cn(
        'p-4 border-t',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <a
          href="https://github.com/openUC2/UC2-GIT"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-medium transition-colors',
            'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
          )}
        >
          <ExternalLink className="w-4 h-4" />
          {isZh ? '获取 UC2 模块' : 'Get UC2 Modules'}
        </a>
      </div>
    </div>
  )
}

// Main page tabs
const PAGE_TABS = [
  { id: 'classic', labelEn: 'Classic Setups', labelZh: '经典光路', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'free', labelEn: 'Free Design', labelZh: '自由设计', icon: <Layers className="w-4 h-4" /> },
]

export function BenchPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [activeTab, setActiveTab] = useState<'classic' | 'free'>('classic')
  const [components, setComponents] = useState<BenchComponent[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showUC2Panel, setShowUC2Panel] = useState(false)
  const [showPolarization, setShowPolarization] = useState(true)

  // Load classic experiment
  const loadExperiment = useCallback((experiment: ClassicExperiment) => {
    setComponents([...experiment.components])
    setSelectedId(null)
    setIsSimulating(false)
  }, [])

  // Add component to bench
  const addComponent = useCallback((type: BenchComponentType) => {
    const newComponent: BenchComponent = {
      id: `${type}-${Date.now()}`,
      type,
      x: 300 + Math.random() * 100,
      y: 200 + Math.random() * 50,
      rotation: 0,
      properties: {},
    }
    setComponents(prev => [...prev, newComponent])
    setSelectedId(newComponent.id)
  }, [])

  // Delete selected component
  const deleteSelected = useCallback(() => {
    if (selectedId) {
      setComponents(prev => prev.filter(c => c.id !== selectedId))
      setSelectedId(null)
    }
  }, [selectedId])

  // Clear all components
  const clearBench = useCallback(() => {
    setComponents([])
    setSelectedId(null)
    setIsSimulating(false)
  }, [])

  // Rotate selected component
  const rotateSelected = useCallback((delta: number) => {
    if (selectedId) {
      setComponents(prev => prev.map(c =>
        c.id === selectedId ? { ...c, rotation: (c.rotation + delta) % 360 } : c
      ))
    }
  }, [selectedId])

  const selectedComponent = components.find(c => c.id === selectedId)

  return (
    <div className={cn(
      'min-h-screen flex flex-col',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                )}
              >
                <Home className="w-5 h-5" />
              </Link>
              <div>
                <h1 className={cn(
                  'text-xl font-bold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '光路设计室' : 'Optical Path Designer'}
                </h1>
                <p className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {isZh ? '搭建光路 × 模拟验证' : 'Build Light Paths × Simulate Results'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* UC2 Hardware Button */}
              <button
                onClick={() => setShowUC2Panel(!showUC2Panel)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  showUC2Panel
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-gray-300 hover:text-white'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
                disabled={components.length === 0}
              >
                <Box className="w-4 h-4" />
                <span className="hidden sm:inline">{isZh ? 'UC2 硬件' : 'UC2 Hardware'}</span>
              </button>
              <LanguageThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar - Tabs & Components */}
        <aside className={cn(
          'w-72 border-r flex flex-col',
          theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-gray-200'
        )}>
          {/* Tab Selector */}
          <Tabs
            tabs={PAGE_TABS.map(tab => ({
              ...tab,
              label: isZh ? tab.labelZh : tab.labelEn,
            }))}
            activeTab={activeTab}
            onChange={(id: string) => setActiveTab(id as 'classic' | 'free')}
            className="p-3"
          />

          {/* Content based on tab */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'classic' ? (
              <div className="space-y-3">
                <p className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  {isZh ? '选择一个经典实验开始学习' : 'Select a classic experiment to start learning'}
                </p>
                {CLASSIC_EXPERIMENTS.map(exp => (
                  <ExperimentCard
                    key={exp.id}
                    experiment={exp}
                    onLoad={() => loadExperiment(exp)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  {isZh ? '点击器件添加到光学平台' : 'Click a component to add it to the bench'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {PALETTE_COMPONENTS.map(item => (
                    <button
                      key={item.type}
                      onClick={() => addComponent(item.type)}
                      className={cn(
                        'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all hover:scale-105',
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 hover:border-violet-500/50'
                          : 'bg-white border-gray-200 hover:border-violet-400'
                      )}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className={cn(
                        'text-xs font-medium',
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        {isZh ? item.nameZh : item.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Link to Device Library */}
          <div className={cn(
            'p-3 border-t',
            theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
          )}>
            <Link
              to="/devices"
              className={cn(
                'flex items-center gap-2 text-sm',
                theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
              )}
            >
              <HelpCircle className="w-4 h-4" />
              {isZh ? '查看器件原理详解' : 'Learn device principles'}
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Link>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative">
          {/* Toolbar */}
          <div className={cn(
            'absolute top-4 left-4 flex items-center gap-2 p-2 rounded-xl border z-10',
            theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
          )}>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isSimulating
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isSimulating ? (isZh ? '暂停' : 'Pause') : (isZh ? '开始模拟' : 'Start Simulation')}
            >
              {isSimulating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className={cn('w-px h-6', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')} />
            <button
              onClick={() => setShowPolarization(!showPolarization)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                showPolarization
                  ? 'bg-violet-500/20 text-violet-400'
                  : theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '显示偏振' : 'Show Polarization'}
            >
              {showPolarization ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => rotateSelected(-15)}
              disabled={!selectedId}
              className={cn(
                'p-2 rounded-lg transition-colors',
                selectedId
                  ? theme === 'dark' ? 'hover:bg-slate-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  : 'opacity-40 cursor-not-allowed',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}
              title={isZh ? '逆时针旋转' : 'Rotate CCW'}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={deleteSelected}
              disabled={!selectedId}
              className={cn(
                'p-2 rounded-lg transition-colors',
                selectedId
                  ? 'text-red-400 hover:bg-red-500/20'
                  : 'opacity-40 cursor-not-allowed text-gray-500'
              )}
              title={isZh ? '删除' : 'Delete'}
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className={cn('w-px h-6', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')} />
            <button
              onClick={clearBench}
              className={cn(
                'p-2 rounded-lg transition-colors',
                theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '清空' : 'Clear'}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* UC2 Panel */}
          {showUC2Panel && components.length > 0 && (
            <UC2Panel
              components={components}
              onClose={() => setShowUC2Panel(false)}
            />
          )}

          {/* Canvas */}
          <div
            className={cn(
              'absolute inset-0 overflow-hidden',
              theme === 'dark' ? 'bg-slate-950/50' : 'bg-gray-50/50'
            )}
            onClick={() => setSelectedId(null)}
          >
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke={theme === 'dark' ? '#334155' : '#94a3b8'}
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Light beam visualization (simplified) */}
            {isSimulating && components.length > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Simple beam from emitter */}
                {components.filter(c => c.type === 'emitter').map(emitter => (
                  <line
                    key={emitter.id}
                    x1={emitter.x}
                    y1={emitter.y}
                    x2={emitter.x + 400}
                    y2={emitter.y}
                    stroke={showPolarization ? '#22d3ee' : '#fbbf24'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.7"
                    style={{
                      filter: 'drop-shadow(0 0 8px currentColor)',
                    }}
                  />
                ))}
              </svg>
            )}

            {/* Components */}
            {components.map(component => (
              <BenchComponentViz
                key={component.id}
                component={component}
                selected={component.id === selectedId}
                onClick={() => setSelectedId(component.id)}
              />
            ))}

            {/* Empty state */}
            {components.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
                    theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                  )}>
                    <Layers className={cn('w-10 h-10', theme === 'dark' ? 'text-gray-600' : 'text-gray-400')} />
                  </div>
                  <h3 className={cn(
                    'text-lg font-semibold mb-2',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '开始设计你的光路' : 'Start designing your optical path'}
                  </h3>
                  <p className={cn(
                    'text-sm max-w-sm mx-auto',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {isZh
                      ? '从左侧选择一个经典实验，或切换到自由设计模式添加器件'
                      : 'Select a classic experiment from the left, or switch to free design mode to add components'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Selected component properties panel */}
          {selectedComponent && (
            <div className={cn(
              'absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 rounded-xl border p-4 z-10',
              theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'
            )}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">
                  {PALETTE_COMPONENTS.find(p => p.type === selectedComponent.type)?.icon}
                </span>
                <div>
                  <h4 className={cn(
                    'font-semibold',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh
                      ? PALETTE_COMPONENTS.find(p => p.type === selectedComponent.type)?.nameZh
                      : PALETTE_COMPONENTS.find(p => p.type === selectedComponent.type)?.nameEn}
                  </h4>
                  <p className={cn(
                    'text-xs',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {isZh ? `角度: ${selectedComponent.rotation}°` : `Angle: ${selectedComponent.rotation}°`}
                  </p>
                </div>
              </div>

              {/* Properties would go here in a full implementation */}
              <div className={cn(
                'text-sm p-3 rounded-lg',
                theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
              )}>
                <p className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  {isZh ? '拖拽移动位置，使用工具栏旋转或删除' : 'Drag to move, use toolbar to rotate or delete'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
