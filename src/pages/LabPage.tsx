/**
 * Lab Page - Virtual Research Lab Group
 * 课题组页面 - 虚拟研究实验室
 *
 * Simulated graduate research experience with tasks, experiments,
 * and collaborative learning about polarization physics.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Tabs, Badge } from '@/components/shared'
import {
  Home, FlaskConical, Users, Target, Award,
  BookOpen, CheckCircle2,
  Clock, Lock, ChevronRight, Lightbulb,
  GraduationCap, Beaker, Microscope,
  BarChart3, Sparkles, Newspaper, Calculator,
  TrendingUp, ExternalLink, Puzzle
} from 'lucide-react'

// Research tasks data
interface ResearchTask {
  id: string
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'experiment' | 'simulation' | 'analysis' | 'literature'
  estimatedHours: number
  status: 'available' | 'locked' | 'coming-soon'
  prerequisites?: string[]
  skills: string[]
}

const RESEARCH_TASKS: ResearchTask[] = [
  {
    id: 'polarizer-basics',
    titleEn: 'Polarizer Characterization',
    titleZh: '偏振片特性测定',
    descriptionEn: 'Measure the extinction ratio and transmission axis of polarizers using Malus\'s Law.',
    descriptionZh: '使用马吕斯定律测量偏振片的消光比和透光轴。',
    difficulty: 'beginner',
    category: 'experiment',
    estimatedHours: 2,
    status: 'available',
    skills: ['Malus\'s Law', 'Data fitting', 'Error analysis']
  },
  {
    id: 'brewster-angle',
    titleEn: 'Brewster\'s Angle Measurement',
    titleZh: '布儒斯特角测量',
    descriptionEn: 'Determine Brewster\'s angle for glass and calculate its refractive index.',
    descriptionZh: '测定玻璃的布儒斯特角并计算其折射率。',
    difficulty: 'beginner',
    category: 'experiment',
    estimatedHours: 3,
    status: 'available',
    prerequisites: ['polarizer-basics'],
    skills: ['Brewster\'s angle', 'Reflection measurement', 'Refractive index']
  },
  {
    id: 'waveplate-retardation',
    titleEn: 'Waveplate Retardation Analysis',
    titleZh: '波片相位延迟分析',
    descriptionEn: 'Characterize quarter-wave and half-wave plates by analyzing output polarization states.',
    descriptionZh: '通过分析输出偏振态来表征四分之一波片和半波片。',
    difficulty: 'intermediate',
    category: 'experiment',
    estimatedHours: 4,
    status: 'available',
    prerequisites: ['polarizer-basics'],
    skills: ['Phase retardation', 'Polarization ellipse', 'Jones calculus']
  },
  {
    id: 'stokes-measurement',
    titleEn: 'Stokes Parameter Measurement',
    titleZh: '斯托克斯参数测量',
    descriptionEn: 'Build a polarimeter and measure Stokes parameters for various light sources.',
    descriptionZh: '搭建偏振计并测量各种光源的斯托克斯参数。',
    difficulty: 'intermediate',
    category: 'experiment',
    estimatedHours: 6,
    status: 'locked',
    prerequisites: ['waveplate-retardation'],
    skills: ['Stokes vector', 'Polarimetry', 'Instrument design']
  },
  {
    id: 'stress-birefringence',
    titleEn: 'Photoelastic Stress Analysis',
    titleZh: '光弹应力分析',
    descriptionEn: 'Visualize stress patterns in transparent materials using crossed polarizers.',
    descriptionZh: '使用正交偏振器观察透明材料中的应力图案。',
    difficulty: 'intermediate',
    category: 'analysis',
    estimatedHours: 4,
    status: 'available',
    prerequisites: ['polarizer-basics'],
    skills: ['Birefringence', 'Stress optics', 'Image analysis']
  },
  {
    id: 'mueller-matrix',
    titleEn: 'Mueller Matrix Polarimetry',
    titleZh: '穆勒矩阵偏振测量',
    descriptionEn: 'Implement dual-rotating retarder method for complete Mueller matrix measurement.',
    descriptionZh: '实现双旋转延迟器方法进行完整的穆勒矩阵测量。',
    difficulty: 'advanced',
    category: 'experiment',
    estimatedHours: 10,
    status: 'coming-soon',
    prerequisites: ['stokes-measurement'],
    skills: ['Mueller matrix', 'Polarimetric imaging', 'Advanced optics']
  },
  {
    id: 'lcd-simulation',
    titleEn: 'LCD Display Simulation',
    titleZh: 'LCD显示器仿真',
    descriptionEn: 'Simulate twisted nematic LCD pixel operation using Jones matrix formalism.',
    descriptionZh: '使用琼斯矩阵形式仿真扭曲向列LCD像素工作原理。',
    difficulty: 'advanced',
    category: 'simulation',
    estimatedHours: 8,
    status: 'coming-soon',
    skills: ['Jones calculus', 'Liquid crystals', 'Numerical simulation']
  },
  {
    id: 'literature-review',
    titleEn: 'Literature Review: Polarimetric Remote Sensing',
    titleZh: '文献综述：偏振遥感',
    descriptionEn: 'Review recent advances in polarimetric imaging for atmospheric and Earth observation.',
    descriptionZh: '综述偏振成像在大气和地球观测中的最新进展。',
    difficulty: 'advanced',
    category: 'literature',
    estimatedHours: 12,
    status: 'coming-soon',
    skills: ['Literature search', 'Scientific writing', 'Remote sensing']
  },
]

const DIFFICULTY_LABELS = {
  beginner: { en: 'Beginner', zh: '入门', color: 'green' as const },
  intermediate: { en: 'Intermediate', zh: '进阶', color: 'yellow' as const },
  advanced: { en: 'Advanced', zh: '高级', color: 'red' as const },
}

const CATEGORY_ICONS = {
  experiment: FlaskConical,
  simulation: Beaker,
  analysis: Microscope,
  literature: BookOpen,
}

// Study group data
interface StudyGroup {
  id: string
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  members: number
  focus: string[]
  status: 'open' | 'full' | 'coming-soon'
}

const STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'malus-masters',
    nameEn: 'Malus Masters',
    nameZh: '马吕斯小队',
    descriptionEn: 'Focus on classical polarization fundamentals and basic experiments.',
    descriptionZh: '专注于经典偏振基础和基本实验。',
    members: 12,
    focus: ['Malus\'s Law', 'Brewster\'s angle', 'Basic polarimetry'],
    status: 'coming-soon',
  },
  {
    id: 'jones-club',
    nameEn: 'Jones Calculus Club',
    nameZh: '琼斯矩阵俱乐部',
    descriptionEn: 'Advanced mathematical treatment of polarization with matrix methods.',
    descriptionZh: '用矩阵方法进行偏振的高级数学处理。',
    members: 8,
    focus: ['Jones matrices', 'Mueller matrices', 'Polarization algebra'],
    status: 'coming-soon',
  },
  {
    id: 'application-lab',
    nameEn: 'Applications Lab',
    nameZh: '应用实验室',
    descriptionEn: 'Explore real-world applications from LCD displays to medical imaging.',
    descriptionZh: '探索从LCD显示器到医学成像的实际应用。',
    members: 15,
    focus: ['LCD technology', 'Stress analysis', 'Biomedical optics'],
    status: 'coming-soon',
  },
]

// Tabs configuration
const TABS = [
  { id: 'tasks', label: 'Research Tasks', labelZh: '研究任务', icon: <Target className="w-4 h-4" /> },
  { id: 'analysis', label: 'Data Workbench', labelZh: '数据分析工作台', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'frontier', label: 'Research Frontier', labelZh: '科研前沿', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'workshop', label: 'Creative Workshop', labelZh: '创意工坊', icon: <Puzzle className="w-4 h-4" /> },
  { id: 'groups', label: 'Study Groups', labelZh: '学习小组', icon: <Users className="w-4 h-4" /> },
  { id: 'showcase', label: 'Showcase', labelZh: '成果展示', icon: <Award className="w-4 h-4" /> },
]

// Research frontier data (科研前沿)
interface ResearchNews {
  id: string
  titleEn: string
  titleZh: string
  summaryEn: string
  summaryZh: string
  year: number
  category: 'breakthrough' | 'application' | 'method'
  sourceUrl?: string
}

const RESEARCH_FRONTIER: ResearchNews[] = [
  {
    id: 'quantum-polarimetry-2024',
    titleEn: 'Quantum-Enhanced Polarimetric Sensing',
    titleZh: '量子增强偏振传感技术',
    summaryEn: 'Researchers demonstrated quantum-enhanced polarimetry that surpasses classical sensitivity limits, enabling detection of ultrasmall optical activity changes.',
    summaryZh: '研究人员展示了超越经典灵敏度极限的量子增强偏振测量技术，能够检测超小光学活性变化。',
    year: 2024,
    category: 'breakthrough',
  },
  {
    id: 'polarimetric-ai-2024',
    titleEn: 'AI-Powered Mueller Matrix Imaging',
    titleZh: 'AI驱动的穆勒矩阵成像',
    summaryEn: 'Deep learning methods now enable real-time Mueller matrix decomposition and tissue characterization from polarimetric images.',
    summaryZh: '深度学习方法现已能够从偏振成像中实现实时穆勒矩阵分解和组织表征。',
    year: 2024,
    category: 'method',
  },
  {
    id: 'cancer-detection-2023',
    titleEn: 'Early Cancer Detection via Polarimetry',
    titleZh: '偏振光学早期癌症检测',
    summaryEn: 'Clinical trials show polarimetric imaging can detect cancerous tissue changes before they become visible under conventional microscopy.',
    summaryZh: '临床试验表明，偏振成像能够在传统显微镜下可见之前检测到癌变组织的变化。',
    year: 2023,
    category: 'application',
  },
  {
    id: 'atmospheric-2023',
    titleEn: 'Polarimetric Aerosol Characterization',
    titleZh: '偏振大气气溶胶表征',
    summaryEn: 'New satellite-based polarimeters provide unprecedented detail on aerosol composition and climate effects.',
    summaryZh: '新型卫星偏振仪提供了前所未有的气溶胶成分和气候效应细节。',
    year: 2023,
    category: 'application',
  },
  {
    id: 'metamaterial-2024',
    titleEn: 'Metasurface Polarization Control',
    titleZh: '超表面偏振调控',
    summaryEn: 'Programmable metasurfaces enable dynamic, pixel-level control of light polarization for next-generation displays.',
    summaryZh: '可编程超表面实现了下一代显示器的动态像素级偏振控制。',
    year: 2024,
    category: 'breakthrough',
  },
]

// Creative workshop challenges (创意工坊)
interface Challenge {
  id: string
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  difficulty: 'open' | 'guided' | 'research'
  tags: string[]
  status: 'active' | 'completed' | 'coming-soon'
}

const CHALLENGES: Challenge[] = [
  {
    id: 'underwater-vision',
    titleEn: 'Underwater Polarization Camera',
    titleZh: '水下偏振相机设计',
    descriptionEn: 'Design a polarimetric system to improve underwater visibility by removing scattered light.',
    descriptionZh: '设计一个偏振系统，通过去除散射光来提高水下能见度。',
    difficulty: 'guided',
    tags: ['imaging', 'scattering', 'application'],
    status: 'active',
  },
  {
    id: 'stress-visualization',
    titleEn: 'Stress Visualization App',
    titleZh: '应力可视化应用',
    descriptionEn: 'Create a smartphone app that uses the phone\'s screen and camera to visualize stress patterns in transparent materials.',
    descriptionZh: '创建一个智能手机应用，使用手机屏幕和摄像头来可视化透明材料中的应力图案。',
    difficulty: 'open',
    tags: ['photoelasticity', 'mobile', 'DIY'],
    status: 'active',
  },
  {
    id: 'polarimeter-design',
    titleEn: 'Low-Cost Polarimeter',
    titleZh: '低成本偏振仪设计',
    descriptionEn: 'Build a Stokes polarimeter using inexpensive components that can measure all four Stokes parameters.',
    descriptionZh: '使用低成本组件构建一个能测量全部四个斯托克斯参数的偏振仪。',
    difficulty: 'research',
    tags: ['instrumentation', 'Stokes', 'measurement'],
    status: 'active',
  },
  {
    id: 'bee-simulation',
    titleEn: 'Bee Navigation Simulator',
    titleZh: '蜜蜂导航模拟器',
    descriptionEn: 'Create a simulation of how bees use sky polarization patterns for navigation.',
    descriptionZh: '创建一个模拟蜜蜂如何利用天空偏振图案进行导航的仿真系统。',
    difficulty: 'guided',
    tags: ['biomimetics', 'simulation', 'nature'],
    status: 'coming-soon',
  },
]

// Analysis tools data (数据分析工作台)
interface AnalysisTool {
  id: string
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  icon: React.ReactNode
  available: boolean
}

const ANALYSIS_TOOLS: AnalysisTool[] = [
  {
    id: 'stokes-calc',
    nameEn: 'Stokes Calculator',
    nameZh: '斯托克斯计算器',
    descriptionEn: 'Calculate and visualize Stokes parameters from intensity measurements.',
    descriptionZh: '从强度测量计算和可视化斯托克斯参数。',
    icon: <Calculator className="w-5 h-5" />,
    available: true,
  },
  {
    id: 'mueller-sim',
    nameEn: 'Mueller Matrix Simulator',
    nameZh: '穆勒矩阵模拟器',
    descriptionEn: 'Simulate light propagation through optical elements using Mueller calculus.',
    descriptionZh: '使用穆勒矩阵模拟光通过光学元件的传播。',
    icon: <BarChart3 className="w-5 h-5" />,
    available: true,
  },
  {
    id: 'jones-calc',
    nameEn: 'Jones Vector Calculator',
    nameZh: '琼斯向量计算器',
    descriptionEn: 'Compute Jones vector transformations for fully polarized light.',
    descriptionZh: '计算完全偏振光的琼斯向量变换。',
    icon: <Calculator className="w-5 h-5" />,
    available: true,
  },
  {
    id: 'data-fitting',
    nameEn: 'Malus\'s Law Fitting',
    nameZh: '马吕斯定律拟合',
    descriptionEn: 'Fit experimental data to Malus\'s Law and extract extinction ratio.',
    descriptionZh: '将实验数据拟合到马吕斯定律并提取消光比。',
    icon: <TrendingUp className="w-5 h-5" />,
    available: true,
  },
  {
    id: 'poincare',
    nameEn: 'Poincaré Sphere Viewer',
    nameZh: '庞加莱球可视化',
    descriptionEn: 'Visualize polarization states on the Poincaré sphere.',
    descriptionZh: '在庞加莱球上可视化偏振态。',
    icon: <Sparkles className="w-5 h-5" />,
    available: false,
  },
]

// Task card component
function TaskCard({ task }: { task: ResearchTask }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_LABELS[task.difficulty]
  const CategoryIcon = CATEGORY_ICONS[task.category]
  const isLocked = task.status === 'locked'
  const isComingSoon = task.status === 'coming-soon'

  return (
    <div className={cn(
      'rounded-xl border p-4 transition-all',
      isLocked || isComingSoon
        ? cn(
            'opacity-60',
            theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'
          )
        : cn(
            'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg',
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700 hover:border-yellow-500/50'
              : 'bg-white border-gray-200 hover:border-yellow-400'
          )
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          isLocked || isComingSoon
            ? theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            : theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100'
        )}>
          {isLocked ? (
            <Lock className={cn('w-5 h-5', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')} />
          ) : (
            <CategoryIcon className={cn(
              'w-5 h-5',
              isComingSoon
                ? theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
            )} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge color={difficulty.color} size="sm">
              {isZh ? difficulty.zh : difficulty.en}
            </Badge>
            <div className={cn(
              'flex items-center gap-1 text-xs',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              <Clock className="w-3 h-3" />
              {task.estimatedHours}h
            </div>
            {isComingSoon && (
              <Badge color="gray" size="sm">
                {isZh ? '即将推出' : 'Coming Soon'}
              </Badge>
            )}
          </div>
          <h3 className={cn(
            'font-semibold mb-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? task.titleZh : task.titleEn}
          </h3>
          <p className={cn(
            'text-sm line-clamp-2',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh ? task.descriptionZh : task.descriptionEn}
          </p>
          {!isLocked && !isComingSoon && (
            <div className={cn(
              'mt-3 flex items-center gap-1 text-sm font-medium',
              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
            )}>
              <span>{isZh ? '开始任务' : 'Start Task'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
          {isLocked && task.prerequisites && (
            <div className={cn(
              'mt-2 text-xs',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              {isZh ? '前置任务: ' : 'Prerequisites: '}
              {task.prerequisites.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Study group card component
function GroupCard({ group }: { group: StudyGroup }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const isComingSoon = group.status === 'coming-soon'

  return (
    <div className={cn(
      'rounded-xl border p-4',
      isComingSoon
        ? cn(
            'opacity-60 border-dashed',
            theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-300'
          )
        : cn(
            theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
          )
    )}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn(
          'font-semibold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? group.nameZh : group.nameEn}
        </h3>
        {isComingSoon ? (
          <Badge color="gray" size="sm">
            {isZh ? '即将开放' : 'Coming Soon'}
          </Badge>
        ) : (
          <div className={cn(
            'flex items-center gap-1 text-sm',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            <Users className="w-4 h-4" />
            {group.members}
          </div>
        )}
      </div>
      <p className={cn(
        'text-sm mb-3',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? group.descriptionZh : group.descriptionEn}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {group.focus.map((topic, i) => (
          <span
            key={i}
            className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            )}
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  )
}

export function LabPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [activeTab, setActiveTab] = useState('tasks')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('')

  // Filter tasks
  const filteredTasks = difficultyFilter
    ? RESEARCH_TASKS.filter(t => t.difficulty === difficultyFilter)
    : RESEARCH_TASKS

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fefce8] via-[#fef9c3] to-[#fefce8]'
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
              <span className="text-xl">🔬</span>
              <h1 className={cn(
                'text-lg sm:text-xl font-bold',
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              )}>
                {isZh ? '虚拟课题组' : 'Virtual Lab Group'}
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 text-sm mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>{isZh ? '像研究生一样学习' : 'Learn Like a Graduate Student'}</span>
          </div>
          <h2 className={cn(
            'text-2xl sm:text-3xl font-bold mb-3',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '欢迎加入偏振光课题组' : 'Welcome to the Polarization Lab'}
          </h2>
          <p className={cn(
            'text-base max-w-2xl mx-auto',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '领取研究任务，完成虚拟实验，与同学讨论，产出研究成果。'
              : 'Take on research tasks, complete virtual experiments, discuss with peers, and produce results.'}
          </p>
        </div>

        {/* Progress overview */}
        <div className={cn(
          'grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 rounded-xl',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-white border border-gray-200'
        )}>
          {[
            { icon: Target, label: isZh ? '可用任务' : 'Available', value: RESEARCH_TASKS.filter(t => t.status === 'available').length, color: 'yellow' },
            { icon: CheckCircle2, label: isZh ? '已完成' : 'Completed', value: 0, color: 'green' },
            { icon: Users, label: isZh ? '学习小组' : 'Groups', value: STUDY_GROUPS.length, color: 'blue' },
            { icon: Award, label: isZh ? '获得徽章' : 'Badges', value: 0, color: 'purple' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="text-center">
                <Icon className={cn(
                  'w-6 h-6 mx-auto mb-1',
                  stat.color === 'yellow' && (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'),
                  stat.color === 'green' && (theme === 'dark' ? 'text-green-400' : 'text-green-600'),
                  stat.color === 'blue' && (theme === 'dark' ? 'text-blue-400' : 'text-blue-600'),
                  stat.color === 'purple' && (theme === 'dark' ? 'text-purple-400' : 'text-purple-600')
                )} />
                <div className={cn(
                  'text-2xl font-bold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {stat.value}
                </div>
                <div className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        {activeTab === 'tasks' && (
          <>
            {/* Difficulty filter */}
            <div className={cn(
              'flex flex-wrap gap-2 mb-6 p-3 rounded-lg',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
            )}>
              <button
                onClick={() => setDifficultyFilter('')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  !difficultyFilter
                    ? 'bg-yellow-500 text-white'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                )}
              >
                {isZh ? '全部' : 'All'}
              </button>
              {Object.entries(DIFFICULTY_LABELS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setDifficultyFilter(key)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    difficultyFilter === key
                      ? 'bg-yellow-500 text-white'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  )}
                >
                  {isZh ? val.zh : val.en}
                </button>
              ))}
            </div>

            {/* Tasks grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </>
        )}

        {/* Data Analysis Workbench Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ANALYSIS_TOOLS.map(tool => (
                <div
                  key={tool.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    tool.available
                      ? theme === 'dark'
                        ? 'bg-slate-800/70 border-slate-700 hover:border-yellow-500/50 cursor-pointer'
                        : 'bg-white border-gray-200 hover:border-yellow-400 cursor-pointer'
                      : theme === 'dark'
                        ? 'bg-slate-800/30 border-slate-700/50 opacity-60'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      theme === 'dark' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                    )}>
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={cn(
                          'font-semibold',
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>
                          {isZh ? tool.nameZh : tool.nameEn}
                        </h3>
                        {!tool.available && (
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                          )}>
                            {isZh ? '即将推出' : 'Coming Soon'}
                          </span>
                        )}
                      </div>
                      <p className={cn(
                        'text-sm mt-1',
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {isZh ? tool.descriptionZh : tool.descriptionEn}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className={cn(
              'p-4 rounded-xl border',
              theme === 'dark' ? 'bg-cyan-900/20 border-cyan-700/30' : 'bg-cyan-50 border-cyan-200'
            )}>
              <div className="flex items-start gap-3">
                <BarChart3 className={cn(
                  'w-5 h-5 mt-0.5',
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                )} />
                <div>
                  <h4 className={cn(
                    'font-semibold',
                    theme === 'dark' ? 'text-cyan-300' : 'text-cyan-800'
                  )}>
                    {isZh ? '数据分析工作台' : 'Data Analysis Workbench'}
                  </h4>
                  <p className={cn(
                    'text-sm mt-1',
                    theme === 'dark' ? 'text-cyan-200/70' : 'text-cyan-700'
                  )}>
                    {isZh
                      ? '这里提供偏振光学计算和数据分析工具，帮助你处理实验数据、验证理论公式。'
                      : 'Tools for polarization optics calculations and data analysis, helping you process experimental data and verify theoretical formulas.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Research Frontier Tab */}
        {activeTab === 'frontier' && (
          <div className="space-y-4">
            {RESEARCH_FRONTIER.map(news => (
              <div
                key={news.id}
                className={cn(
                  'p-4 rounded-xl border transition-all hover:-translate-y-0.5',
                  theme === 'dark'
                    ? 'bg-slate-800/70 border-slate-700 hover:border-yellow-500/30'
                    : 'bg-white border-gray-200 hover:border-yellow-300'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    news.category === 'breakthrough' && (theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-100'),
                    news.category === 'application' && (theme === 'dark' ? 'bg-green-500/10' : 'bg-green-100'),
                    news.category === 'method' && (theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100')
                  )}>
                    <Newspaper className={cn(
                      'w-5 h-5',
                      news.category === 'breakthrough' && (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'),
                      news.category === 'application' && (theme === 'dark' ? 'text-green-400' : 'text-green-600'),
                      news.category === 'method' && (theme === 'dark' ? 'text-blue-400' : 'text-blue-600')
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn(
                        'font-semibold',
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {isZh ? news.titleZh : news.titleEn}
                      </h3>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      )}>
                        {news.year}
                      </span>
                    </div>
                    <p className={cn(
                      'text-sm',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {isZh ? news.summaryZh : news.summaryEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Creative Workshop Tab */}
        {activeTab === 'workshop' && (
          <div className="space-y-6">
            {/* Intro */}
            <div className={cn(
              'p-4 rounded-xl border',
              theme === 'dark' ? 'bg-purple-900/20 border-purple-700/30' : 'bg-purple-50 border-purple-200'
            )}>
              <div className="flex items-start gap-3">
                <Puzzle className={cn(
                  'w-5 h-5 mt-0.5',
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                )} />
                <div>
                  <h4 className={cn(
                    'font-semibold',
                    theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
                  )}>
                    {isZh ? '创意工坊：开放问题 × 社区挑战' : 'Creative Workshop: Open Problems × Community Challenges'}
                  </h4>
                  <p className={cn(
                    'text-sm mt-1',
                    theme === 'dark' ? 'text-purple-200/70' : 'text-purple-700'
                  )}>
                    {isZh
                      ? '探索开放性问题，参与社区挑战，将理论知识应用到实际项目中。'
                      : 'Explore open problems, participate in community challenges, and apply theoretical knowledge to real projects.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHALLENGES.map(challenge => (
                <div
                  key={challenge.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    challenge.status === 'active'
                      ? theme === 'dark'
                        ? 'bg-slate-800/70 border-slate-700 hover:border-purple-500/50'
                        : 'bg-white border-gray-200 hover:border-purple-300'
                      : theme === 'dark'
                        ? 'bg-slate-800/30 border-slate-700/50'
                        : 'bg-gray-50 border-gray-200'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={cn(
                      'font-semibold',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {isZh ? challenge.titleZh : challenge.titleEn}
                    </h3>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      challenge.status === 'active'
                        ? 'bg-green-500/10 text-green-500'
                        : challenge.status === 'coming-soon'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-gray-500/10 text-gray-500'
                    )}>
                      {challenge.status === 'active' ? (isZh ? '进行中' : 'Active')
                        : challenge.status === 'coming-soon' ? (isZh ? '即将开始' : 'Coming Soon')
                          : (isZh ? '已完成' : 'Completed')}
                    </span>
                  </div>
                  <p className={cn(
                    'text-sm mb-3',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {isZh ? challenge.descriptionZh : challenge.descriptionEn}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.tags.map(tag => (
                      <span
                        key={tag}
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      challenge.difficulty === 'open' && (theme === 'dark' ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700'),
                      challenge.difficulty === 'guided' && (theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700'),
                      challenge.difficulty === 'research' && (theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-700')
                    )}>
                      {challenge.difficulty === 'open' ? (isZh ? '开放式' : 'Open')
                        : challenge.difficulty === 'guided' ? (isZh ? '引导式' : 'Guided')
                          : (isZh ? '研究级' : 'Research')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STUDY_GROUPS.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}

        {activeTab === 'showcase' && (
          <div className={cn(
            'text-center py-12 rounded-xl border',
            theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
          )}>
            <Award className={cn(
              'w-12 h-12 mx-auto mb-4',
              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
            )} />
            <h3 className={cn(
              'text-xl font-semibold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '成果展示' : 'Research Showcase'}
            </h3>
            <p className={cn(
              'text-sm mb-4 max-w-md mx-auto',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh
                ? '完成研究任务后，你的成果将在这里展示。其他学员可以查看、学习和评论。'
                : 'After completing research tasks, your results will be displayed here. Other learners can view, learn from, and comment on your work.'}
            </p>
            <div className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm',
              theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            )}>
              <Lightbulb className="w-4 h-4" />
              {isZh ? '完成任务以解锁' : 'Complete tasks to unlock'}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
