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
import {
  OpticalComponentMap,
  LightBeam,
  type OpticalComponentType
} from '@/components/bench'

// Component types for the optical bench
type BenchComponentType = 'emitter' | 'polarizer' | 'waveplate' | 'mirror' | 'splitter' | 'sensor' | 'lens'

interface BenchComponent {
  id: string
  type: BenchComponentType
  x: number
  y: number
  rotation: number
  properties: Record<string, number | string | boolean>
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
  // New experiments added
  {
    id: 'half-wave-rotation',
    nameEn: 'Half-Wave Plate Rotation',
    nameZh: '半波片偏振旋转',
    descriptionEn: 'Use a half-wave plate to rotate polarization direction by 2θ.',
    descriptionZh: '使用半波片将偏振方向旋转2θ角。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'w1', type: 'waveplate', x: 320, y: 200, rotation: 0, properties: { retardation: 180, fastAxis: 22.5 } },
      { id: 'p2', type: 'polarizer', x: 460, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['λ/2 plate rotates polarization by 2θ', 'Output remains linear polarization', 'Fast axis at θ → rotation by 2θ'],
      zh: ['λ/2波片使偏振旋转2θ', '输出仍为线偏振', '快轴在θ角→偏振旋转2θ'],
    },
    linkedDemo: 'waveplate',
  },
  {
    id: 'optical-isolator',
    nameEn: 'Optical Isolator',
    nameZh: '光学隔离器',
    descriptionEn: 'Build a one-way optical path using polarizers and a Faraday rotator.',
    descriptionZh: '使用偏振片和法拉第旋转器构建单向光路。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 150, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'w1', type: 'waveplate', x: 280, y: 200, rotation: 0, properties: { retardation: 45, faraday: true } },
      { id: 'p2', type: 'polarizer', x: 410, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'm1', type: 'mirror', x: 520, y: 200, rotation: 0, properties: {} },
      { id: 's1', type: 'sensor', x: 60, y: 300, rotation: 0, properties: { mode: 'isolation' } },
    ],
    learningPoints: {
      en: ['Faraday rotation is non-reciprocal', 'Forward: 0° → 45° → passes', 'Backward: 45° → 90° → blocked'],
      zh: ['法拉第旋转是非互易的', '正向: 0° → 45° → 通过', '反向: 45° → 90° → 阻挡'],
    },
  },
  {
    id: 'polarization-interferometer',
    nameEn: 'Polarization Interferometer',
    nameZh: '偏振干涉仪',
    descriptionEn: 'Create interference using orthogonally polarized beams.',
    descriptionZh: '使用正交偏振光束产生干涉。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 200, rotation: 0, properties: { polarization: 45 } },
      { id: 'c1', type: 'splitter', x: 180, y: 200, rotation: 0, properties: { type: 'pbs' } },
      { id: 'm1', type: 'mirror', x: 180, y: 100, rotation: 90, properties: {} },
      { id: 'm2', type: 'mirror', x: 320, y: 200, rotation: 0, properties: {} },
      { id: 'c2', type: 'splitter', x: 320, y: 100, rotation: 0, properties: { type: 'pbs' } },
      { id: 'p1', type: 'polarizer', x: 450, y: 100, rotation: 0, properties: { angle: 45 } },
      { id: 's1', type: 'sensor', x: 550, y: 100, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['PBS splits by polarization', 'Recombined beams interfere with analyzer', 'Phase sensitive measurement'],
      zh: ['PBS按偏振分光', '重组光束经检偏器干涉', '相位敏感测量'],
    },
    linkedDemo: 'polarization-state',
  },
  {
    id: 'ellipsometry',
    nameEn: 'Ellipsometry Setup',
    nameZh: '椭偏仪配置',
    descriptionEn: 'Measure thin film properties using polarization state changes.',
    descriptionZh: '利用偏振态变化测量薄膜特性。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 150, rotation: 56, properties: { polarization: 45 } },
      { id: 'p1', type: 'polarizer', x: 140, y: 180, rotation: 56, properties: { angle: 45 } },
      { id: 'sample', type: 'mirror', x: 280, y: 250, rotation: 0, properties: { type: 'thin-film' } },
      { id: 'w1', type: 'waveplate', x: 420, y: 180, rotation: -56, properties: { retardation: 90 } },
      { id: 'p2', type: 'polarizer', x: 500, y: 150, rotation: -56, properties: { angle: 0, rotatable: true } },
      { id: 's1', type: 'sensor', x: 580, y: 120, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['Ψ: amplitude ratio change', 'Δ: phase difference change', 'Film thickness & refractive index'],
      zh: ['Ψ: 振幅比变化', 'Δ: 相位差变化', '薄膜厚度与折射率'],
    },
  },
  {
    id: 'polarimeter',
    nameEn: 'Polarimeter',
    nameZh: '旋光仪',
    descriptionEn: 'Measure optical rotation of chiral substances.',
    descriptionZh: '测量手性物质的旋光度。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: -1, wavelength: 589 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'sample', type: 'lens', x: 330, y: 200, rotation: 0, properties: { type: 'sugar-solution', concentration: 0.1 } },
      { id: 'p2', type: 'polarizer', x: 480, y: 200, rotation: 0, properties: { angle: 10, rotatable: true } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['α = [α] × c × L', 'D-glucose rotates right', 'L-glucose rotates left'],
      zh: ['α = [α] × c × L', 'D-葡萄糖右旋', 'L-葡萄糖左旋'],
    },
    linkedDemo: 'optical-rotation',
  },
  {
    id: 'wollaston-prism',
    nameEn: 'Wollaston Prism Separator',
    nameZh: '渥拉斯顿棱镜分束',
    descriptionEn: 'Split light into two diverging orthogonally polarized beams.',
    descriptionZh: '将光分成两束发散的正交偏振光。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: 45 } },
      { id: 'c1', type: 'splitter', x: 250, y: 200, rotation: 0, properties: { type: 'wollaston', angle: 15 } },
      { id: 's1', type: 'sensor', x: 500, y: 130, rotation: 0, properties: {} },
      { id: 's2', type: 'sensor', x: 500, y: 270, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['Two calcite prisms with perpendicular axes', 'Both beams exit at equal angles', 'Angular separation depends on wedge angle'],
      zh: ['两块方解石棱镜光轴垂直', '两束光以相等角度出射', '分离角取决于楔角'],
    },
    linkedDemo: 'birefringence',
  },
  {
    id: 'senarmont-compensator',
    nameEn: 'Sénarmont Compensator',
    nameZh: '塞纳蒙补偿器',
    descriptionEn: 'Precise phase measurement using quarter-wave plate and analyzer.',
    descriptionZh: '使用四分之一波片和检偏器精确测量相位。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 140, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'sample', type: 'lens', x: 260, y: 200, rotation: 0, properties: { type: 'birefringent', retardation: 30 } },
      { id: 'w1', type: 'waveplate', x: 380, y: 200, rotation: 0, properties: { retardation: 90, fastAxis: 0 } },
      { id: 'p2', type: 'polarizer', x: 500, y: 200, rotation: 0, properties: { angle: 15, rotatable: true } },
      { id: 's1', type: 'sensor', x: 600, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['Elliptical → circular → linear', 'Analyzer angle = δ/2', 'Precise retardation measurement'],
      zh: ['椭圆→圆→线偏振', '检偏器角度 = δ/2', '精确测量延迟量'],
    },
    linkedDemo: 'waveplate',
  },
  {
    id: 'three-polarizer-paradox',
    nameEn: 'Three Polarizer Paradox',
    nameZh: '三偏振片悖论',
    descriptionEn: 'Demonstrate how adding a third polarizer can increase transmitted light.',
    descriptionZh: '演示添加第三块偏振片如何增加透射光强。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 160, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'p2', type: 'polarizer', x: 300, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'p3', type: 'polarizer', x: 440, y: 200, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 560, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['0° and 90° polarizers block all light', 'Adding 45° polarizer allows some through', 'I = I₀ × cos²45° × cos²45° = I₀/4'],
      zh: ['0°和90°偏振片阻挡所有光', '添加45°偏振片允许部分通过', 'I = I₀ × cos²45° × cos²45° = I₀/4'],
    },
    linkedDemo: 'malus-law',
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

// Component on bench visualization - now rendered as part of SVG canvas
// This function is kept for legacy purposes but the main rendering is done in the canvas SVG

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
            {/* Full SVG Canvas for optical bench */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke={theme === 'dark' ? '#334155' : '#94a3b8'}
                    strokeWidth="1"
                    opacity="0.3"
                  />
                </pattern>
                <pattern id="grid-dots" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="0" cy="0" r="1.5" fill={theme === 'dark' ? '#475569' : '#94a3b8'} opacity="0.3" />
                </pattern>
                {/* Optical table surface gradient */}
                <linearGradient id="table-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={theme === 'dark' ? '#0f172a' : '#f8fafc'} />
                  <stop offset="100%" stopColor={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
                </linearGradient>
              </defs>

              {/* Optical table surface */}
              <rect width="100%" height="100%" fill="url(#table-grad)" />
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#grid-dots)" />

              {/* Optical rail visualization */}
              <rect x="60" y="196" width="680" height="8" rx="2"
                fill={theme === 'dark' ? '#334155' : '#94a3b8'} opacity="0.5" />
              <rect x="60" y="198" width="680" height="4" rx="1"
                fill={theme === 'dark' ? '#1e293b' : '#cbd5e1'} opacity="0.8" />

              {/* Light beams (rendered first, behind components) */}
              {isSimulating && components.length > 0 && (
                <g className="light-beams">
                  {components.filter(c => c.type === 'emitter').map(emitter => {
                    // Calculate light path through components
                    const beamEndX = Math.min(emitter.x + 500, 750)
                    const polarAngle = (emitter.properties.polarization as number) || 0

                    // Find components in the beam path
                    const componentsInPath = components
                      .filter(c => c.type !== 'emitter' && c.x > emitter.x && Math.abs(c.y - emitter.y) < 40)
                      .sort((a, b) => a.x - b.x)

                    // Generate beam segments
                    const segments: { x1: number; y1: number; x2: number; y2: number; polarAngle: number; intensity: number }[] = []
                    let currentX = emitter.x
                    let currentPolarAngle = polarAngle
                    let currentIntensity = 100

                    componentsInPath.forEach((comp) => {
                      // Beam to component
                      segments.push({
                        x1: currentX + 30,
                        y1: emitter.y,
                        x2: comp.x - 30,
                        y2: comp.y,
                        polarAngle: currentPolarAngle,
                        intensity: currentIntensity
                      })

                      // Modify polarization based on component type
                      if (comp.type === 'polarizer') {
                        const polarizerAngle = (comp.properties.angle as number) || 0
                        const angleDiff = Math.abs(currentPolarAngle - polarizerAngle)
                        currentIntensity *= Math.pow(Math.cos(angleDiff * Math.PI / 180), 2)
                        currentPolarAngle = polarizerAngle
                      } else if (comp.type === 'waveplate') {
                        currentPolarAngle = (currentPolarAngle + 45) % 180
                      }

                      currentX = comp.x
                    })

                    // Final beam segment to end
                    if (currentIntensity > 5) {
                      segments.push({
                        x1: currentX + 30,
                        y1: emitter.y,
                        x2: beamEndX,
                        y2: emitter.y,
                        polarAngle: currentPolarAngle,
                        intensity: currentIntensity
                      })
                    }

                    return segments.map((seg, idx) => (
                      <LightBeam
                        key={`${emitter.id}-beam-${idx}`}
                        x1={seg.x1}
                        y1={seg.y1}
                        x2={seg.x2}
                        y2={seg.y2}
                        polarizationAngle={seg.polarAngle}
                        intensity={seg.intensity}
                        showPolarization={showPolarization}
                        animated={true}
                      />
                    ))
                  })}
                </g>
              )}

              {/* Optical components */}
              <g className="optical-components">
                {components.map(component => {
                  const ComponentViz = OpticalComponentMap[component.type as OpticalComponentType]
                  if (ComponentViz) {
                    return (
                      <ComponentViz
                        key={component.id}
                        x={component.x}
                        y={component.y}
                        rotation={component.rotation}
                        selected={component.id === selectedId}
                        polarizationAngle={(component.properties.angle as number) || (component.properties.polarization as number) || 0}
                        onClick={(e) => {
                          e?.stopPropagation()
                          setSelectedId(component.id)
                        }}
                      />
                    )
                  }
                  return null
                })}
              </g>
            </svg>

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
