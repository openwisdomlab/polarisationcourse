/**
 * Lab Page - Research Lab (科研实战营)
 * 不是学科研，而是做科研
 *
 * Real research challenges with open-ended exploration,
 * authentic data, and complete research workflows.
 */

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Tabs, Badge, PersistentHeader, SEO } from '@/components/shared'
import { ResearchTaskModal } from '@/components/lab'
import { useLabStore } from '@/stores/labStore'
import {
  FlaskConical, Users, Target, Award,
  BookOpen, CheckCircle2,
  Clock, Lock, ChevronRight, Lightbulb,
  Beaker, Microscope,
  BarChart3, Sparkles, Newspaper, Calculator,
  TrendingUp, PlayCircle, Rocket,
  Search, Eye, Brain, Dna, TreePine
} from 'lucide-react'
import { RESEARCH_CHALLENGES, type ResearchChallenge } from '@/data/research-challenges'

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

// Tabs configuration - 重新排序，开放挑战优先
// Hidden tabs: 'analysis' (数据工作台), 'frontier' (科研前沿) - temporarily hidden to reduce information overload
const TABS = [
  { id: 'challenges', label: 'Open Challenges', labelZh: '开放挑战', icon: <Rocket className="w-4 h-4" /> },
  { id: 'tasks', label: 'Guided Tasks', labelZh: '引导任务', icon: <Target className="w-4 h-4" /> },
  // { id: 'analysis', label: 'Data Workbench', labelZh: '数据工作台', icon: <BarChart3 className="w-4 h-4" /> },
  // { id: 'frontier', label: 'Research Frontier', labelZh: '科研前沿', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'collaboration', label: 'Collaboration Hub', labelZh: '协作空间', icon: <Users className="w-4 h-4" /> },
  { id: 'showcase', label: 'Showcase Gallery', labelZh: '成果展示', icon: <Award className="w-4 h-4" /> },
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

// Removed old CHALLENGES data - now using RESEARCH_CHALLENGES from separate file

// Analysis tools data (数据分析工作台)
interface AnalysisTool {
  id: string
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  icon: React.ReactNode
  available: boolean
  link?: string
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
    link: '/lab/stokes',
  },
  {
    id: 'mueller-sim',
    nameEn: 'Mueller Matrix Calculator',
    nameZh: '穆勒矩阵计算器',
    descriptionEn: 'Calculate Stokes vector transformations using Mueller matrix calculus. Supports partially polarized light.',
    descriptionZh: '使用穆勒矩阵计算斯托克斯矢量变换，支持部分偏振光。',
    icon: <BarChart3 className="w-5 h-5" />,
    available: true,
    link: '/lab/mueller',
  },
  {
    id: 'jones-calc',
    nameEn: 'Jones Vector Calculator',
    nameZh: '琼斯向量计算器',
    descriptionEn: 'Compute Jones vector transformations for fully polarized light.',
    descriptionZh: '计算完全偏振光的琼斯向量变换。',
    icon: <Calculator className="w-5 h-5" />,
    available: true,
    link: '/lab/jones',
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
    available: true,
    link: '/lab/poincare',
  },
]

// Task card component
function TaskCard({ task, onStart }: { task: ResearchTask; onStart?: (taskId: string) => void }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_LABELS[task.difficulty]
  const CategoryIcon = CATEGORY_ICONS[task.category]
  const isLocked = task.status === 'locked'
  const isComingSoon = task.status === 'coming-soon'

  // Get task progress from store
  const taskProgress = useLabStore(state => state.taskProgress[task.id])
  const taskStatus = taskProgress?.status

  const handleClick = () => {
    if (!isLocked && !isComingSoon && onStart) {
      onStart(task.id)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
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
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          isLocked || isComingSoon
            ? theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            : taskStatus === 'submitted' || taskStatus === 'published'
              ? theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
              : taskStatus === 'in-progress'
                ? theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
                : theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100'
        )}>
          {isLocked ? (
            <Lock className={cn('w-5 h-5', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')} />
          ) : taskStatus === 'submitted' || taskStatus === 'published' ? (
            <CheckCircle2 className={cn('w-5 h-5', theme === 'dark' ? 'text-green-400' : 'text-green-600')} />
          ) : taskStatus === 'in-progress' ? (
            <PlayCircle className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
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
            {taskStatus === 'in-progress' && (
              <Badge color="cyan" size="sm">
                {isZh ? '进行中' : 'In Progress'}
              </Badge>
            )}
            {taskStatus === 'submitted' && (
              <Badge color="green" size="sm">
                {isZh ? '已提交' : 'Submitted'}
              </Badge>
            )}
            {taskStatus === 'published' && (
              <Badge color="purple" size="sm">
                {isZh ? '已发表' : 'Published'}
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
              taskStatus === 'in-progress'
                ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                : taskStatus === 'submitted' || taskStatus === 'published'
                  ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
            )}>
              <span>
                {taskStatus === 'in-progress'
                  ? (isZh ? '继续任务' : 'Continue')
                  : taskStatus === 'submitted' || taskStatus === 'published'
                    ? (isZh ? '查看结果' : 'View Results')
                    : (isZh ? '开始任务' : 'Start Task')}
              </span>
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
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [activeTab, setActiveTab] = useState('challenges') // Default to challenges
  const [difficultyFilter, setDifficultyFilter] = useState<string>('')

  // Lab store
  const { openTask, taskProgress, publications } = useLabStore()

  // Calculate progress statistics
  const stats = useMemo(() => {
    const progressEntries = Object.values(taskProgress)
    const completedCount = progressEntries.filter(
      p => p.status === 'submitted' || p.status === 'published'
    ).length
    const inProgressCount = progressEntries.filter(
      p => p.status === 'in-progress'
    ).length
    const availableTasks = RESEARCH_TASKS.filter(t => t.status === 'available').length

    return {
      available: availableTasks - completedCount - inProgressCount,
      completed: completedCount,
      inProgress: inProgressCount,
      publications: publications.length,
    }
  }, [taskProgress, publications])

  // Filter tasks
  const filteredTasks = difficultyFilter
    ? RESEARCH_TASKS.filter(t => t.difficulty === difficultyFilter)
    : RESEARCH_TASKS

  // Handle starting a task
  const handleStartTask = (taskId: string) => {
    openTask(taskId)
  }

  return (
    <>
      <SEO
        title="Research Lab - PolarCraft"
        titleZh="虚拟课题组 - PolarCraft"
        description="Join real research projects with open-ended exploration, authentic data, and complete research workflows. Learn and explore in cutting-edge research."
        descriptionZh="加入真实科研课题，体验完整研究流程。在真实前沿的研究中学习和探索。真实数据、开放探索、无标准答案。"
      />
      <div className={cn(
        'min-h-screen',
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
          : 'bg-gradient-to-br from-[#fefce8] via-[#fef9c3] to-[#fefce8]'
      )}>
        {/* Header with Persistent Logo */}
        <PersistentHeader
        moduleKey="labGroup"
        moduleName={isZh ? '虚拟课题组' : 'Research Lab'}
        variant="glass"
        className={cn(
          'sticky top-0 z-40',
          theme === 'dark'
            ? 'bg-slate-900/80 border-b border-slate-700'
            : 'bg-white/80 border-b border-gray-200'
        )}
      />

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-500 text-sm mb-4">
            <Rocket className="w-4 h-4" />
            <span className="font-semibold">{isZh ? '在真实前沿的研究中学习和探索' : 'Learn and Explore in Cutting-Edge Research'}</span>
          </div>
          <h2 className={cn(
            'text-2xl sm:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r',
            theme === 'dark'
              ? 'from-cyan-400 via-violet-400 to-pink-400'
              : 'from-cyan-600 via-violet-600 to-pink-600'
          )}>
            {isZh ? '欢迎来到虚拟课题组' : 'Welcome to the Research Lab'}
          </h2>
          <p className={cn(
            'text-base max-w-2xl mx-auto mb-2',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '加入真实科研课题，体验完整研究流程，探索未知问题，产出真正的研究成果。'
              : 'Join real research projects, experience complete research workflows, explore open questions, and produce genuine research outcomes.'}
          </p>
          <div className={cn(
            'flex flex-wrap items-center justify-center gap-2 text-xs',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {isZh ? '真实数据' : 'Real Data'}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Search className="w-3 h-3" />
              {isZh ? '开放探索' : 'Open Exploration'}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              {isZh ? '无标准答案' : 'No Fixed Answers'}
            </span>
          </div>
        </div>

        {/* Progress overview */}
        <div className={cn(
          'grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 rounded-xl',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-white border border-gray-200'
        )}>
          {[
            { icon: Target, label: isZh ? '可用任务' : 'Available', value: stats.available, color: 'yellow' },
            { icon: CheckCircle2, label: isZh ? '已完成' : 'Completed', value: stats.completed, color: 'green' },
            { icon: PlayCircle, label: isZh ? '进行中' : 'In Progress', value: stats.inProgress, color: 'cyan' },
            { icon: Award, label: isZh ? '发表成果' : 'Published', value: stats.publications, color: 'purple' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="text-center">
                <Icon className={cn(
                  'w-6 h-6 mx-auto mb-1',
                  stat.color === 'yellow' && (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'),
                  stat.color === 'green' && (theme === 'dark' ? 'text-green-400' : 'text-green-600'),
                  stat.color === 'cyan' && (theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'),
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
        {/* Open Challenges Tab - 开放挑战 */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {/* Intro Banner */}
            <div className={cn(
              'p-6 rounded-2xl border-2',
              theme === 'dark'
                ? 'bg-gradient-to-br from-orange-900/20 via-yellow-900/20 to-red-900/20 border-yellow-500/30'
                : 'bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 border-yellow-300'
            )}>
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100'
                )}>
                  <Rocket className={cn('w-6 h-6', theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600')} />
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    'text-lg font-bold mb-2',
                    theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
                  )}>
                    {isZh ? '🔥 真实课题 · 开放探索 · 你就是科研者' : '🔥 Real Projects · Open Exploration · You Are the Researcher'}
                  </h3>
                  <p className={cn(
                    'text-sm leading-relaxed',
                    theme === 'dark' ? 'text-yellow-200/80' : 'text-yellow-700'
                  )}>
                    {isZh
                      ? '这里的每个挑战都来自正在进行的真实科研项目。你将使用真实的实验数据，面对真实的不确定性，没有标准答案等着你——只有等待发现的未知。这不是演示实验，而是真正的科研探索。'
                      : 'Every challenge here comes from ongoing real research projects. You\'ll work with authentic experimental data, face real uncertainties, and there are no standard answers waiting for you — only unknowns waiting to be discovered. This is not a demonstration experiment, but genuine scientific exploration.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 gap-6">
              {RESEARCH_CHALLENGES.map(challenge => {
                const categoryIcons: Record<ResearchChallenge['category'], React.ReactNode> = {
                  biomedical: <Dna className="w-5 h-5" />,
                  environmental: <TreePine className="w-5 h-5" />,
                  materials: <Microscope className="w-5 h-5" />,
                  fundamental: <Sparkles className="w-5 h-5" />
                }

                const categoryColors: Record<ResearchChallenge['category'], string> = {
                  biomedical: '#EC4899',
                  environmental: '#10B981',
                  materials: '#8B5CF6',
                  fundamental: '#3B82F6'
                }

                const difficultyLabels = {
                  beginner: { zh: '入门', en: 'Beginner' },
                  intermediate: { zh: '进阶', en: 'Intermediate' },
                  advanced: { zh: '高级', en: 'Advanced' }
                }

                const statusLabels = {
                  active: { zh: '进行中', en: 'Active' },
                  completed: { zh: '已完成', en: 'Completed' },
                  'coming-soon': { zh: '即将开放', en: 'Coming Soon' }
                }

                const color = categoryColors[challenge.category]

                return (
                  <div
                    key={challenge.id}
                    className={cn(
                      'rounded-2xl border-2 overflow-hidden transition-all duration-300',
                      challenge.status === 'active'
                        ? theme === 'dark'
                          ? 'bg-slate-800/70 border-slate-700 hover:border-yellow-500/50 hover:shadow-2xl hover:-translate-y-1'
                          : 'bg-white border-gray-200 hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-1'
                        : theme === 'dark'
                          ? 'bg-slate-800/30 border-slate-700/50 opacity-60'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                    )}
                    style={{
                      boxShadow: challenge.status === 'active' ? `0 8px 32px ${color}10` : undefined
                    }}
                  >
                    {/* Header with gradient */}
                    <div
                      className="h-2"
                      style={{
                        background: `linear-gradient(to right, ${color}, ${color}88)`
                      }}
                    />

                    <div className="p-6">
                      {/* Title & Metadata */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span style={{ color }}>{categoryIcons[challenge.category]}</span>
                            <Badge color="yellow" size="sm">
                              {isZh ? difficultyLabels[challenge.difficulty].zh : difficultyLabels[challenge.difficulty].en}
                            </Badge>
                            <Badge
                              color={challenge.status === 'active' ? 'green' : challenge.status === 'completed' ? 'blue' : 'gray'}
                              size="sm"
                            >
                              {isZh ? statusLabels[challenge.status].zh : statusLabels[challenge.status].en}
                            </Badge>
                            <div className={cn(
                              'flex items-center gap-1 text-xs',
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            )}>
                              <Clock className="w-3 h-3" />
                              {challenge.estimatedWeeks} {isZh ? '周' : 'weeks'}
                            </div>
                          </div>
                          <h3 className={cn(
                            'text-xl font-bold mb-1',
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          )}>
                            {isZh ? challenge.titleZh : challenge.titleEn}
                          </h3>
                          <p className={cn(
                            'text-sm italic',
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          )}>
                            {isZh ? challenge.subtitleZh : challenge.subtitleEn}
                          </p>
                        </div>
                      </div>

                      {/* Core Question */}
                      <div className={cn(
                        'p-4 rounded-xl mb-4',
                        theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
                      )}>
                        <h4 className={cn(
                          'text-xs font-semibold uppercase tracking-wider mb-2',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>
                          {isZh ? '核心问题' : 'Core Question'}
                        </h4>
                        <p className={cn(
                          'text-sm font-medium',
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>
                          {isZh ? challenge.coreQuestionZh : challenge.coreQuestionEn}
                        </p>
                      </div>

                      {/* Objectives */}
                      <div className="mb-4">
                        <h4 className={cn(
                          'text-xs font-semibold uppercase tracking-wider mb-2',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>
                          {isZh ? '学习目标' : 'Learning Objectives'}
                        </h4>
                        <ul className="space-y-2">
                          {(isZh ? challenge.objectivesZh : challenge.objectivesEn).slice(0, 3).map((obj, i) => (
                            <li key={i} className={cn(
                              'text-sm flex items-start gap-2',
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            )}>
                              <span className="text-yellow-500 flex-shrink-0">•</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {challenge.tags.map(tag => (
                          <span
                            key={tag}
                            className={cn(
                              'text-xs px-2 py-1 rounded-full',
                              theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Button */}
                      {challenge.status === 'active' && (
                        <button
                          onClick={() => {
                            // TODO: Open challenge detail modal
                            console.log('Open challenge:', challenge.id)
                          }}
                          className={cn(
                            'w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
                            'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
                            'text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                          )}
                        >
                          <span>{isZh ? '开始挑战' : 'Start Challenge'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}

                      {challenge.status === 'coming-soon' && (
                        <div className={cn(
                          'w-full py-3 px-4 rounded-xl font-medium text-center',
                          theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                        )}>
                          {isZh ? '即将开放' : 'Coming Soon'}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Note */}
            <div className={cn(
              'p-4 rounded-xl border',
              theme === 'dark' ? 'bg-cyan-900/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'
            )}>
              <p className={cn(
                'text-sm italic',
                theme === 'dark' ? 'text-cyan-300/80' : 'text-cyan-700'
              )}>
                💡 {isZh
                  ? '科研从来不是知道答案的人在讲解，而是不知道答案的人在一起探索。如果你愿意参与这场探索，那么从现在开始，你已经是这个课题组的一部分了。'
                  : 'Research is never about those who know the answer explaining it, but about those who don\'t know the answer exploring together. If you\'re willing to join this exploration, you\'re already part of this research group.'}
              </p>
            </div>
          </div>
        )}

        {/* Guided Tasks Tab */}
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
                <TaskCard key={task.id} task={task} onStart={handleStartTask} />
              ))}
            </div>
          </>
        )}

        {/* Data Analysis Workbench Tab - Hidden to reduce information overload */}
        {/* {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ANALYSIS_TOOLS.map(tool => {
                const cardContent = (
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
                      {tool.available && tool.link && (
                        <div className={cn(
                          'mt-2 flex items-center gap-1 text-sm font-medium',
                          theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                        )}>
                          <span>{isZh ? '打开工具' : 'Open Tool'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                )

                const cardClassName = cn(
                  'p-4 rounded-xl border transition-all block',
                  tool.available
                    ? theme === 'dark'
                      ? 'bg-slate-800/70 border-slate-700 hover:border-yellow-500/50 cursor-pointer hover:-translate-y-0.5'
                      : 'bg-white border-gray-200 hover:border-yellow-400 cursor-pointer hover:-translate-y-0.5'
                    : theme === 'dark'
                      ? 'bg-slate-800/30 border-slate-700/50 opacity-60'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                )

                return tool.available && tool.link ? (
                  <Link key={tool.id} to={tool.link} className={cardClassName}>
                    {cardContent}
                  </Link>
                ) : (
                  <div key={tool.id} className={cardClassName}>
                    {cardContent}
                  </div>
                )
              })}
            </div>

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
        )} */}

        {/* Research Frontier Tab - Hidden to reduce information overload */}
        {/* {activeTab === 'frontier' && (
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
        )} */}

        {/* Collaboration Hub Tab - 协作空间 */}
        {activeTab === 'collaboration' && (
          <div className="space-y-6">
            {/* Intro */}
            <div className={cn(
              'p-6 rounded-2xl border',
              theme === 'dark' ? 'bg-violet-900/20 border-violet-700/30' : 'bg-violet-50 border-violet-200'
            )}>
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  theme === 'dark' ? 'bg-violet-500/20' : 'bg-violet-100'
                )}>
                  <Users className={cn('w-6 h-6', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
                </div>
                <div>
                  <h4 className={cn(
                    'text-lg font-semibold mb-2',
                    theme === 'dark' ? 'text-violet-300' : 'text-violet-800'
                  )}>
                    {isZh ? '协作空间：与同行交流，共同成长' : 'Collaboration Hub: Exchange with Peers, Grow Together'}
                  </h4>
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-violet-200/70' : 'text-violet-700'
                  )}>
                    {isZh
                      ? '加入虚拟学习小组，与志同道合的伙伴讨论科研问题，分享研究心得，相互启发。'
                      : 'Join virtual study groups, discuss research questions with like-minded partners, share insights, and inspire each other.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Study Groups Grid */}
            <div>
              <h3 className={cn(
                'text-lg font-semibold mb-4 flex items-center gap-2',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                <Users className="w-5 h-5 text-violet-500" />
                {isZh ? '虚拟学习小组' : 'Virtual Study Groups'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {STUDY_GROUPS.map(group => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </div>

            {/* Discussion & Q&A */}
            <div className={cn(
              'p-6 rounded-2xl border text-center',
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
            )}>
              <Lightbulb className={cn(
                'w-12 h-12 mx-auto mb-4',
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              )} />
              <h3 className={cn(
                'text-xl font-semibold mb-2',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '讨论区 & 问答社区' : 'Discussion & Q&A Community'}
              </h3>
              <p className={cn(
                'text-sm mb-4 max-w-md mx-auto',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh
                  ? '在这里提出你的科研问题，与导师和同学互动，获得及时反馈。社区功能即将上线。'
                  : 'Ask your research questions here, interact with mentors and peers, and get timely feedback. Community features coming soon.'}
              </p>
              <div className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm',
                theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              )}>
                <span>{isZh ? '即将推出' : 'Coming Soon'}</span>
              </div>
            </div>
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

        {/* Research Task Modal */}
        <ResearchTaskModal />
      </div>
    </>
  )
}

export default LabPage
