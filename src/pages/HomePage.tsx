/**
 * HomePage - 偏振光下的新世界
 * 全新设计：融合课程大纲与历史双线的沉浸式探索体验
 *
 * 设计理念：
 * 1. 问题牵引 - 以好奇心驱动学习
 * 2. 双线融合 - 课程内容与历史发现交织
 * 3. 生活连接 - 从日常现象切入科学原理
 * 4. 动手实践 - 强调可操作的实验体验
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { PolarWorldLogo } from '@/components/icons'
import { cn } from '@/lib/utils'
import {
  Lightbulb,
  BookOpen,
  FlaskConical,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Zap,
  Microscope,
  Sun,
  Layers,
  History,
  Calculator,
  Target,
  Eye,
  Palette,
  Users,
  Play,
  HelpCircle,
  Glasses,
  Monitor,
  Droplets,
  Tv,
  Smartphone,
  Gamepad2,
  GraduationCap,
  MapPin,
} from 'lucide-react'

// Note: We don't need timeline events in the new design as we have embedded historical data in COURSE_UNITS

// ============================================================================
// 类型定义
// ============================================================================

interface CourseUnit {
  id: string
  number: number
  titleKey: string
  subtitleKey: string
  descriptionKey: string
  coreQuestion: { zh: string; en: string }
  icon: React.ReactNode
  color: string
  gradient: string
  historicalEvent: {
    year: number
    scientist: { zh: string; en: string }
    discovery: { zh: string; en: string }
  }
  keyExperiment: {
    titleKey: string
    link: string
    icon: React.ReactNode
  }
  lifeConnection: {
    titleKey: string
    icon: React.ReactNode
    descKey: string
  }
  resources: {
    demos: { id: string; titleKey: string; link: string }[]
    tools?: { id: string; titleKey: string; link: string }[]
  }
}

interface LifeScene {
  id: string
  titleKey: string
  descKey: string
  icon: React.ReactNode
  color: string
  image?: string
  demoLink?: string
}

interface HandsOnExperiment {
  id: string
  titleKey: string
  descKey: string
  difficulty: 'easy' | 'medium' | 'hard'
  materials: string[]
  icon: React.ReactNode
  color: string
  link?: string
}

// ============================================================================
// 课程单元数据 - 融合历史与问题牵引
// ============================================================================

const COURSE_UNITS: CourseUnit[] = [
  {
    id: 'unit1',
    number: 1,
    titleKey: 'home.units.unit1.title',
    subtitleKey: 'home.units.unit1.subtitle',
    descriptionKey: 'home.units.unit1.description',
    coreQuestion: {
      zh: '透过冰洲石，为什么会看到两个像？',
      en: 'Why do we see two images through calcite?',
    },
    icon: <Lightbulb className="w-5 h-5" />,
    color: '#22D3EE',
    gradient: 'from-cyan-500 to-blue-500',
    historicalEvent: {
      year: 1669,
      scientist: { zh: '拉斯穆·巴多林', en: 'Rasmus Bartholin' },
      discovery: {
        zh: '发现冰洲石双像现象',
        en: 'Discovered calcite double refraction',
      },
    },
    keyExperiment: {
      titleKey: 'home.units.unit1.keyExp',
      link: '/demos/birefringence',
      icon: <Layers className="w-5 h-5" />,
    },
    lifeConnection: {
      titleKey: 'home.life.screen',
      icon: <Monitor className="w-5 h-5" />,
      descKey: 'home.life.screenDesc',
    },
    resources: {
      demos: [
        { id: 'light-wave', titleKey: 'home.res.lightWave', link: '/demos/light-wave' },
        { id: 'polarization-intro', titleKey: 'home.res.polarIntro', link: '/demos/polarization-intro' },
        { id: 'birefringence', titleKey: 'home.res.birefringence', link: '/demos/birefringence' },
      ],
    },
  },
  {
    id: 'unit2',
    number: 2,
    titleKey: 'home.units.unit2.title',
    subtitleKey: 'home.units.unit2.subtitle',
    descriptionKey: 'home.units.unit2.description',
    coreQuestion: {
      zh: '为什么偏光太阳镜能减少眩光？',
      en: 'Why do polarized sunglasses reduce glare?',
    },
    icon: <Zap className="w-5 h-5" />,
    color: '#A78BFA',
    gradient: 'from-violet-500 to-purple-500',
    historicalEvent: {
      year: 1815,
      scientist: { zh: '大卫·布儒斯特', en: 'David Brewster' },
      discovery: {
        zh: '发现反射光完全偏振的角度',
        en: 'Discovered the angle of complete polarization',
      },
    },
    keyExperiment: {
      titleKey: 'home.units.unit2.keyExp',
      link: '/demos/brewster',
      icon: <Zap className="w-5 h-5" />,
    },
    lifeConnection: {
      titleKey: 'home.life.sunglasses',
      icon: <Glasses className="w-5 h-5" />,
      descKey: 'home.life.sunglassesDesc',
    },
    resources: {
      demos: [
        { id: 'fresnel', titleKey: 'home.res.fresnel', link: '/demos/fresnel' },
        { id: 'brewster', titleKey: 'home.res.brewster', link: '/demos/brewster' },
      ],
    },
  },
  {
    id: 'unit3',
    number: 3,
    titleKey: 'home.units.unit3.title',
    subtitleKey: 'home.units.unit3.subtitle',
    descriptionKey: 'home.units.unit3.description',
    coreQuestion: {
      zh: '为什么透过偏振片看胶带会呈现彩虹色？',
      en: 'Why does tape appear rainbow-colored through a polarizer?',
    },
    icon: <Palette className="w-5 h-5" />,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    historicalEvent: {
      year: 1811,
      scientist: { zh: '阿拉戈 & 比奥', en: 'Arago & Biot' },
      discovery: {
        zh: '发现色偏振和旋光现象',
        en: 'Discovered chromatic polarization and optical rotation',
      },
    },
    keyExperiment: {
      titleKey: 'home.units.unit3.keyExp',
      link: '/demos/chromatic',
      icon: <Sparkles className="w-5 h-5" />,
    },
    lifeConnection: {
      titleKey: 'home.exp.tapeArt',
      icon: <Palette className="w-5 h-5" />,
      descKey: 'home.exp.tapeArtDesc',
    },
    resources: {
      demos: [
        { id: 'chromatic', titleKey: 'home.res.chromatic', link: '/demos/chromatic' },
        { id: 'anisotropy', titleKey: 'home.res.anisotropy', link: '/demos/anisotropy' },
        { id: 'optical-rotation', titleKey: 'home.res.opticalRotation', link: '/demos/optical-rotation' },
      ],
    },
  },
  {
    id: 'unit4',
    number: 4,
    titleKey: 'home.units.unit4.title',
    subtitleKey: 'home.units.unit4.subtitle',
    descriptionKey: 'home.units.unit4.description',
    coreQuestion: {
      zh: '为什么天空是蓝色的？夕阳为什么是红色的？',
      en: 'Why is the sky blue? Why are sunsets red?',
    },
    icon: <Sun className="w-5 h-5" />,
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    historicalEvent: {
      year: 1871,
      scientist: { zh: '瑞利勋爵', en: 'Lord Rayleigh' },
      discovery: {
        zh: '解释天空蓝色的散射原理',
        en: 'Explained why the sky is blue',
      },
    },
    keyExperiment: {
      titleKey: 'home.units.unit4.keyExp',
      link: '/demos/rayleigh',
      icon: <Sun className="w-5 h-5" />,
    },
    lifeConnection: {
      titleKey: 'home.life.sky',
      icon: <Sun className="w-5 h-5" />,
      descKey: 'home.life.skyDesc',
    },
    resources: {
      demos: [
        { id: 'rayleigh', titleKey: 'home.res.rayleigh', link: '/demos/rayleigh' },
        { id: 'mie', titleKey: 'home.res.mie', link: '/demos/mie-scattering' },
        { id: 'monte-carlo', titleKey: 'home.res.monteCarlo', link: '/demos/monte-carlo-scattering' },
      ],
    },
  },
  {
    id: 'unit5',
    number: 5,
    titleKey: 'home.units.unit5.title',
    subtitleKey: 'home.units.unit5.subtitle',
    descriptionKey: 'home.units.unit5.description',
    coreQuestion: {
      zh: '如何用数学完整描述光的偏振状态？',
      en: 'How can we mathematically describe polarization completely?',
    },
    icon: <Microscope className="w-5 h-5" />,
    color: '#8B5CF6',
    gradient: 'from-violet-600 to-indigo-600',
    historicalEvent: {
      year: 1852,
      scientist: { zh: '乔治·斯托克斯', en: 'George Stokes' },
      discovery: {
        zh: '提出偏振光的完整数学描述',
        en: 'Developed complete mathematical description of polarized light',
      },
    },
    keyExperiment: {
      titleKey: 'home.units.unit5.keyExp',
      link: '/demos/mueller',
      icon: <Target className="w-5 h-5" />,
    },
    lifeConnection: {
      titleKey: 'home.units.unit5.life',
      icon: <Microscope className="w-5 h-5" />,
      descKey: 'home.units.unit5.lifeDesc',
    },
    resources: {
      demos: [
        { id: 'stokes', titleKey: 'home.res.stokes', link: '/demos/stokes' },
        { id: 'mueller', titleKey: 'home.res.mueller', link: '/demos/mueller' },
        { id: 'jones', titleKey: 'home.res.jones', link: '/demos/jones' },
      ],
      tools: [
        { id: 'stokes-calc', titleKey: 'home.res.stokesCalc', link: '/calc/stokes' },
        { id: 'mueller-calc', titleKey: 'home.res.muellerCalc', link: '/calc/mueller' },
        { id: 'poincare', titleKey: 'home.res.poincare', link: '/calc/poincare' },
      ],
    },
  },
]

// ============================================================================
// 生活中的偏振场景数据
// ============================================================================

const LIFE_SCENES: LifeScene[] = [
  {
    id: 'sky',
    titleKey: 'home.life.sky',
    descKey: 'home.life.skyDesc',
    icon: <Sun className="w-6 h-6" />,
    color: '#3B82F6',
    demoLink: '/demos/rayleigh',
  },
  {
    id: 'screen',
    titleKey: 'home.life.screen',
    descKey: 'home.life.screenDesc',
    icon: <Tv className="w-6 h-6" />,
    color: '#8B5CF6',
    demoLink: '/demos/polarization-intro',
  },
  {
    id: 'sunglasses',
    titleKey: 'home.life.sunglasses',
    descKey: 'home.life.sunglassesDesc',
    icon: <Glasses className="w-6 h-6" />,
    color: '#F59E0B',
    demoLink: '/demos/brewster',
  },
  {
    id: 'butterfly',
    titleKey: 'home.life.butterfly',
    descKey: 'home.life.butterflyDesc',
    icon: <Sparkles className="w-6 h-6" />,
    color: '#EC4899',
    demoLink: '/demos/chromatic',
  },
]

// ============================================================================
// 动手试一试实验数据
// ============================================================================

const HANDS_ON_EXPERIMENTS: HandsOnExperiment[] = [
  {
    id: 'sugar-rainbow',
    titleKey: 'home.exp.sugarRainbow',
    descKey: 'home.exp.sugarRainbowDesc',
    difficulty: 'easy',
    materials: ['糖水', '透明杯', '偏振片/3D眼镜', '电脑屏幕'],
    icon: <Droplets className="w-6 h-6" />,
    color: '#22D3EE',
    link: '/experiments?exp=sugar',
  },
  {
    id: 'tape-art',
    titleKey: 'home.exp.tapeArt',
    descKey: 'home.exp.tapeArtDesc',
    difficulty: 'easy',
    materials: ['透明胶带', '偏振片', '白纸'],
    icon: <Palette className="w-6 h-6" />,
    color: '#F59E0B',
    link: '/experiments?exp=tape',
  },
  {
    id: 'screen-polarizer',
    titleKey: 'home.exp.screenPolarizer',
    descKey: 'home.exp.screenPolarizerDesc',
    difficulty: 'easy',
    materials: ['手机/电脑屏幕', '偏振片'],
    icon: <Smartphone className="w-6 h-6" />,
    color: '#8B5CF6',
    link: '/demos/polarization-intro',
  },
]

// ============================================================================
// 动画背景组件 - 偏振光效果
// ============================================================================

function PolarizationHeroBackground({ theme }: { theme: 'dark' | 'light' }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 0.5) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 动态光环 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? `conic-gradient(from ${time}deg at 50% 50%,
                rgba(34, 211, 238, 0.08) 0deg,
                rgba(167, 139, 250, 0.06) 90deg,
                rgba(236, 72, 153, 0.06) 180deg,
                rgba(245, 158, 11, 0.06) 270deg,
                rgba(34, 211, 238, 0.08) 360deg)`
            : `conic-gradient(from ${time}deg at 50% 50%,
                rgba(34, 211, 238, 0.05) 0deg,
                rgba(167, 139, 250, 0.04) 90deg,
                rgba(236, 72, 153, 0.04) 180deg,
                rgba(245, 158, 11, 0.04) 270deg,
                rgba(34, 211, 238, 0.05) 360deg)`,
        }}
      />

      {/* 浮动光粒子 */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            'absolute rounded-full blur-sm',
            theme === 'dark' ? 'bg-cyan-400/30' : 'bg-cyan-400/20'
          )}
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// Hero 组件 - 激发好奇心的开场
// ============================================================================

function HeroSection({ theme, isZh }: { theme: 'dark' | 'light'; isZh: boolean }) {
  const { t } = useTranslation()
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const curiosityQuestions = [
    { zh: '为什么天空是蓝色的？', en: 'Why is the sky blue?' },
    { zh: '偏光太阳镜是如何工作的？', en: 'How do polarized sunglasses work?' },
    { zh: '透过冰洲石为什么看到两个像？', en: 'Why do we see double through calcite?' },
    { zh: '液晶屏幕为什么需要偏振？', en: 'Why do LCD screens need polarization?' },
    { zh: '蜜蜂如何用偏振光导航？', en: 'How do bees navigate using polarized light?' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuestion(q => (q + 1) % curiosityQuestions.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <PolarizationHeroBackground theme={theme} />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* 课程标签 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span className={cn(
            'text-xs px-4 py-1.5 rounded-full font-medium',
            theme === 'dark'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
          )}>
            {t('home.courseBanner.badge')}
          </span>
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            'text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-8',
            'text-transparent bg-clip-text',
            theme === 'dark'
              ? 'bg-gradient-to-br from-white via-cyan-200 to-violet-300'
              : 'bg-gradient-to-br from-gray-900 via-cyan-700 to-violet-700'
          )}
        >
          {t('home.chronicles.title')}
        </motion.h1>

        {/* 循环问题 - 激发好奇心 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'mb-8 h-16 flex items-center justify-center'
          )}
        >
          <div className="flex items-center gap-3">
            <HelpCircle className={cn(
              'w-6 h-6 flex-shrink-0',
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            )} />
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'text-xl sm:text-2xl font-medium',
                  theme === 'dark' ? 'text-amber-300' : 'text-amber-700'
                )}
              >
                {isZh ? curiosityQuestions[currentQuestion].zh : curiosityQuestions[currentQuestion].en}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 描述文字 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            'text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-10',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}
        >
          {t('home.courseBanner.description')}
        </motion.p>

        {/* 三大入口按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/games/2d"
            className={cn(
              'group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all',
              'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg',
              'hover:shadow-pink-500/30 hover:scale-105'
            )}
          >
            <Gamepad2 className="w-5 h-5" />
            <span>{isZh ? '玩游戏' : 'Play Game'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/experiments"
            className={cn(
              'group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all',
              'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg',
              'hover:shadow-amber-500/30 hover:scale-105'
            )}
          >
            <FlaskConical className="w-5 h-5" />
            <span>{isZh ? '做实验' : 'Do Experiments'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/demos"
            className={cn(
              'group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all',
              'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg',
              'hover:shadow-cyan-500/30 hover:scale-105'
            )}
          >
            <GraduationCap className="w-5 h-5" />
            <span>{isZh ? '学原理' : 'Learn Concepts'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================================================
// 生活中的偏振展示组件
// ============================================================================

function LifeScenesShowcase({ theme, isZh }: { theme: 'dark' | 'light'; isZh: boolean }) {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <h2 className={cn(
              'text-2xl sm:text-3xl font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {t('home.lifeTitle')}
            </h2>
          </div>
          <p className={cn(
            'text-base',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh ? '偏振光就在我们身边，从蓝天到手机屏幕' : 'Polarized light is all around us, from blue skies to phone screens'}
          </p>
        </motion.div>

        {/* 场景卡片网格 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {LIFE_SCENES.map((scene, index) => (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={scene.demoLink || '/demos'}
                className={cn(
                  'group block p-5 rounded-2xl border transition-all h-full',
                  'hover:scale-[1.02] hover:shadow-lg',
                  theme === 'dark'
                    ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
                    : 'bg-white/80 border-gray-200 hover:border-gray-300'
                )}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${scene.color}20`, color: scene.color }}
                >
                  {scene.icon}
                </div>
                <h3 className={cn(
                  'font-bold text-lg mb-2',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {t(scene.titleKey)}
                </h3>
                <p className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {t(scene.descKey)}
                </p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium" style={{ color: scene.color }}>
                  <span>{isZh ? '了解更多' : 'Learn more'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// 动手试一试组件
// ============================================================================

function HandsOnSection({ theme, isZh }: { theme: 'dark' | 'light'; isZh: boolean }) {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const difficultyLabel = {
    easy: { zh: '简单', en: 'Easy', color: '#22C55E' },
    medium: { zh: '中等', en: 'Medium', color: '#F59E0B' },
    hard: { zh: '进阶', en: 'Advanced', color: '#EF4444' },
  }

  return (
    <section ref={ref} className={cn(
      'py-12 px-4',
      theme === 'dark' ? 'bg-slate-900/50' : 'bg-amber-50/50'
    )}>
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <h2 className={cn(
              'text-2xl sm:text-3xl font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {t('home.expTitle')}
            </h2>
          </div>
          <p className={cn(
            'text-base',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh ? '用身边的材料，亲手探索偏振的奥秘' : 'Explore polarization mysteries with everyday materials'}
          </p>
        </motion.div>

        {/* 实验卡片 */}
        <div className="grid sm:grid-cols-3 gap-6">
          {HANDS_ON_EXPERIMENTS.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={exp.link || '/experiments'}
                className={cn(
                  'group block p-6 rounded-2xl border transition-all h-full',
                  'hover:scale-[1.02] hover:shadow-xl',
                  theme === 'dark'
                    ? 'bg-slate-800/80 border-slate-700/50 hover:border-slate-600'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                )}
              >
                {/* 难度标签 */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${exp.color}20`, color: exp.color }}
                  >
                    {exp.icon}
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${difficultyLabel[exp.difficulty].color}20`,
                      color: difficultyLabel[exp.difficulty].color,
                    }}
                  >
                    {isZh ? difficultyLabel[exp.difficulty].zh : difficultyLabel[exp.difficulty].en}
                  </span>
                </div>

                <h3 className={cn(
                  'font-bold text-lg mb-2',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {t(exp.titleKey)}
                </h3>
                <p className={cn(
                  'text-sm mb-4',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {t(exp.descKey)}
                </p>

                {/* 材料列表 */}
                <div className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  <span className="font-medium">{isZh ? '材料：' : 'Materials: '}</span>
                  {exp.materials.join('、')}
                </div>

                <div className="mt-4 flex items-center gap-1 text-sm font-medium" style={{ color: exp.color }}>
                  <Play className="w-4 h-4" />
                  <span>{isZh ? '开始实验' : 'Start Experiment'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// 融合时间线的课程大纲组件
// ============================================================================

function IntegratedCourseTimeline({ theme, isZh }: { theme: 'dark' | 'light'; isZh: boolean }) {
  const { t } = useTranslation()
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className={cn(
              'text-2xl sm:text-3xl font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '探索之旅' : 'Journey of Discovery'}
            </h2>
            <span className={cn(
              'text-xs px-3 py-1 rounded-full font-medium',
              theme === 'dark'
                ? 'bg-violet-500/20 text-violet-400'
                : 'bg-violet-100 text-violet-700'
            )}>
              {isZh ? '历史 × 课程' : 'History × Course'}
            </span>
          </div>
          <p className={cn(
            'text-base max-w-2xl mx-auto',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '跟随历史的脚步，从17世纪的发现到现代应用，一步步揭开偏振光的奥秘'
              : 'Follow the footsteps of history, from 17th-century discoveries to modern applications'}
          </p>
        </motion.div>

        {/* 时间线课程单元 */}
        <div className="relative">
          {/* 中央时间线 */}
          <div className={cn(
            'absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 sm:-translate-x-1/2 rounded-full',
            theme === 'dark'
              ? 'bg-gradient-to-b from-cyan-500/50 via-violet-500/50 to-amber-500/50'
              : 'bg-gradient-to-b from-cyan-300 via-violet-300 to-amber-300'
          )} />

          {/* 单元卡片 */}
          <div className="space-y-8">
            {COURSE_UNITS.map((unit, index) => {
              const isExpanded = expandedUnit === unit.id
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'relative flex items-start gap-4 sm:gap-8',
                    'sm:odd:flex-row sm:even:flex-row-reverse',
                    'pl-16 sm:pl-0'
                  )}
                >
                  {/* 年份节点 */}
                  <div className={cn(
                    'absolute left-0 sm:left-1/2 sm:-translate-x-1/2 z-10',
                    'flex flex-col items-center gap-1'
                  )}>
                    <div
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg',
                        `bg-gradient-to-br ${unit.gradient}`
                      )}
                    >
                      {unit.number}
                    </div>
                    <span className={cn(
                      'text-xs font-mono font-bold',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {unit.historicalEvent.year}
                    </span>
                  </div>

                  {/* 单元卡片 */}
                  <div className={cn(
                    'flex-1 max-w-xl',
                    'sm:odd:text-right sm:even:text-left'
                  )}>
                    <button
                      onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
                      className={cn(
                        'w-full text-left rounded-2xl border p-5 transition-all',
                        'hover:shadow-lg',
                        isExpanded
                          ? theme === 'dark'
                            ? 'bg-slate-800 border-slate-600'
                            : 'bg-white border-gray-300 shadow-lg'
                          : theme === 'dark'
                            ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
                            : 'bg-white/80 border-gray-200 hover:border-gray-300'
                      )}
                      style={{
                        borderColor: isExpanded ? unit.color : undefined,
                        boxShadow: isExpanded ? `0 4px 20px ${unit.color}30` : undefined,
                      }}
                    >
                      {/* 历史发现标签 */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1"
                          style={{ backgroundColor: `${unit.color}20`, color: unit.color }}
                        >
                          <History className="w-3 h-3" />
                          {unit.historicalEvent.year}
                        </span>
                        <span className={cn(
                          'text-xs',
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        )}>
                          {isZh ? unit.historicalEvent.scientist.zh : unit.historicalEvent.scientist.en}
                        </span>
                      </div>

                      {/* 单元标题 */}
                      <h3 className={cn(
                        'font-bold text-lg mb-2',
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {t(unit.titleKey)}
                      </h3>

                      {/* 核心问题 */}
                      <div className={cn(
                        'flex items-start gap-2 p-3 rounded-lg mb-3',
                        theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
                      )}>
                        <HelpCircle className={cn(
                          'w-4 h-4 flex-shrink-0 mt-0.5',
                          theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                        )} />
                        <p className={cn(
                          'text-sm font-medium',
                          theme === 'dark' ? 'text-amber-300' : 'text-amber-700'
                        )}>
                          {isZh ? unit.coreQuestion.zh : unit.coreQuestion.en}
                        </p>
                      </div>

                      {/* 展开指示 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* 生活连接 */}
                          <div className="flex items-center gap-1 text-xs" style={{ color: unit.color }}>
                            {unit.lifeConnection.icon}
                            <span>{t(unit.lifeConnection.titleKey)}</span>
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 transition-transform',
                            isExpanded ? 'rotate-180' : '',
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          )}
                        />
                      </div>

                      {/* 展开内容 */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={cn(
                              'pt-4 mt-4 border-t',
                              theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                            )}>
                              {/* 历史发现 */}
                              <div className="mb-4">
                                <h4 className={cn(
                                  'text-sm font-semibold mb-2 flex items-center gap-2',
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                  <MapPin className="w-4 h-4" style={{ color: unit.color }} />
                                  {isZh ? '历史发现' : 'Historical Discovery'}
                                </h4>
                                <p className={cn(
                                  'text-sm',
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                )}>
                                  {isZh ? unit.historicalEvent.discovery.zh : unit.historicalEvent.discovery.en}
                                </p>
                              </div>

                              {/* 核心实验入口 */}
                              <Link
                                to={unit.keyExperiment.link}
                                onClick={(e) => e.stopPropagation()}
                                className={cn(
                                  'flex items-center gap-3 p-3 rounded-xl mb-4 transition-all hover:scale-[1.01]',
                                  'bg-gradient-to-r text-white shadow-lg',
                                  unit.gradient
                                )}
                              >
                                <div className="p-2 bg-white/20 rounded-lg">
                                  {unit.keyExperiment.icon}
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs opacity-80">{t('home.keyExperiment')}</p>
                                  <p className="font-medium">{t(unit.keyExperiment.titleKey)}</p>
                                </div>
                                <ArrowRight className="w-5 h-5" />
                              </Link>

                              {/* 演示资源 */}
                              <div className="space-y-2">
                                <h4 className={cn(
                                  'text-sm font-semibold flex items-center gap-2',
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                  <Eye className="w-4 h-4" style={{ color: unit.color }} />
                                  {isZh ? '互动演示' : 'Interactive Demos'}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {unit.resources.demos.map((demo) => (
                                    <Link
                                      key={demo.id}
                                      to={demo.link}
                                      onClick={(e) => e.stopPropagation()}
                                      className={cn(
                                        'text-xs px-3 py-1.5 rounded-lg transition-colors',
                                        theme === 'dark'
                                          ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                      )}
                                    >
                                      {t(demo.titleKey)}
                                    </Link>
                                  ))}
                                </div>
                              </div>

                              {/* 计算工具 */}
                              {unit.resources.tools && (
                                <div className="space-y-2 mt-3">
                                  <h4 className={cn(
                                    'text-sm font-semibold flex items-center gap-2',
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                  )}>
                                    <Calculator className="w-4 h-4" style={{ color: unit.color }} />
                                    {isZh ? '计算工具' : 'Calculation Tools'}
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {unit.resources.tools.map((tool) => (
                                      <Link
                                        key={tool.id}
                                        to={tool.link}
                                        onClick={(e) => e.stopPropagation()}
                                        className={cn(
                                          'text-xs px-3 py-1.5 rounded-lg transition-colors',
                                          theme === 'dark'
                                            ? 'bg-violet-500/20 hover:bg-violet-500/30 text-violet-300'
                                            : 'bg-violet-100 hover:bg-violet-200 text-violet-700'
                                        )}
                                      >
                                        {t(tool.titleKey)}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>

                  {/* 占位符（用于布局对称） */}
                  <div className="hidden sm:block flex-1 max-w-xl" />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* 查看完整时间线链接 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link
            to="/chronicles"
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
              'hover:scale-105',
              theme === 'dark'
                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            )}
          >
            <History className="w-5 h-5" />
            <span>{isZh ? '探索完整历史时间线' : 'Explore Full Historical Timeline'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
// 快捷入口组件
// ============================================================================

function QuickAccessSection({ theme, isZh }: { theme: 'dark' | 'light'; isZh: boolean }) {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const quickLinks = [
    {
      id: 'games',
      title: { zh: '偏振光探秘', en: 'Polarization Quest' },
      desc: { zh: '解谜游戏', en: 'Puzzle Games' },
      icon: <Gamepad2 className="w-5 h-5" />,
      link: '/games',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      id: 'demos',
      title: { zh: '偏振演示馆', en: 'Demo Gallery' },
      desc: { zh: '互动演示', en: 'Interactive Demos' },
      icon: <Eye className="w-5 h-5" />,
      link: '/demos',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'optical-studio',
      title: { zh: '光学设计室', en: 'Optical Studio' },
      desc: { zh: '器件与光路', en: 'Devices & Paths' },
      icon: <Layers className="w-5 h-5" />,
      link: '/optical-studio',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      id: 'calc',
      title: { zh: '计算工坊', en: 'Calculation Workshop' },
      desc: { zh: 'Stokes/Mueller/Jones', en: 'Stokes/Mueller/Jones' },
      icon: <Calculator className="w-5 h-5" />,
      link: '/calc',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'experiments',
      title: { zh: '偏振造物局', en: 'Creative Lab' },
      desc: { zh: 'DIY实验', en: 'DIY Experiments' },
      icon: <Palette className="w-5 h-5" />,
      link: '/experiments',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      id: 'lab',
      title: { zh: '虚拟课题组', en: 'Research Lab' },
      desc: { zh: '研究任务', en: 'Research Tasks' },
      icon: <Users className="w-5 h-5" />,
      link: '/lab',
      gradient: 'from-indigo-500 to-blue-500',
    },
  ]

  return (
    <section ref={ref} className={cn(
      'py-12 px-4',
      theme === 'dark' ? 'bg-slate-900/30' : 'bg-gray-50/50'
    )}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8"
        >
          <h2 className={cn(
            'text-xl font-bold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {t('home.quickAccess')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.link}
                className={cn(
                  'group flex flex-col items-center p-4 rounded-xl border transition-all',
                  'hover:scale-105 hover:shadow-lg',
                  theme === 'dark'
                    ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                )}
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-white',
                  'bg-gradient-to-br transition-transform group-hover:scale-110',
                  item.gradient
                )}>
                  {item.icon}
                </div>
                <h3 className={cn(
                  'font-semibold text-sm text-center',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? item.title.zh : item.title.en}
                </h3>
                <p className={cn(
                  'text-xs text-center mt-1',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  {isZh ? item.desc.zh : item.desc.en}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// 主页组件
// ============================================================================

export function HomePage() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fffbeb]'
    )}>
      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className={cn(
          'flex items-center justify-between px-4 py-3',
          theme === 'dark'
            ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50'
            : 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50'
        )}>
          <div className="flex items-center gap-3">
            <PolarWorldLogo size={36} theme={theme} />
            <span className={cn(
              'hidden sm:block font-bold text-base',
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600'
            )}>
              {t('home.chronicles.title')}
            </span>
          </div>
          <LanguageThemeSwitcher />
        </div>
      </header>

      {/* 主要内容 */}
      <main className="pt-16">
        {/* Hero 区域 - 激发好奇心 */}
        <HeroSection theme={theme} isZh={isZh} />

        {/* 生活中的偏振 */}
        <LifeScenesShowcase theme={theme} isZh={isZh} />

        {/* 动手试一试 */}
        <HandsOnSection theme={theme} isZh={isZh} />

        {/* 融合时间线的课程大纲 */}
        <IntegratedCourseTimeline theme={theme} isZh={isZh} />

        {/* 快捷入口 */}
        <QuickAccessSection theme={theme} isZh={isZh} />

        {/* 页脚 */}
        <footer className={cn(
          'py-8 text-center text-xs',
          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
        )}>
          <p className="opacity-60">© 2025 深圳零一学院 · {t('home.chronicles.title')}</p>
        </footer>
      </main>
    </div>
  )
}

export default HomePage
