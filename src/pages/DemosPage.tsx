/**
 * Demos Page - Interactive physics demonstrations for 5 units + Optical Basics
 * Enhanced with i18n, theme support, and improved interactivity indicators
 */
import { useState, Suspense, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { ListItem } from '@/components/demos/DemoControls'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Home, Gamepad2, BookOpen, Box, BarChart2, Menu, X, ChevronDown, ChevronRight, Lightbulb, HelpCircle } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'

// Demo components
import { MalusLawDemo } from '@/components/demos/unit1/MalusLawDemo'
import { BirefringenceDemo } from '@/components/demos/unit1/BirefringenceDemo'
import { WaveplateDemo } from '@/components/demos/unit1/WaveplateDemo'
import { PolarizationStateDemo } from '@/components/demos/unit1/PolarizationStateDemo'
import { FresnelDemo } from '@/components/demos/unit2/FresnelDemo'
import { BrewsterDemo } from '@/components/demos/unit2/BrewsterDemo'
import { ChromaticDemo } from '@/components/demos/unit3/ChromaticDemo'
import { OpticalRotationDemo } from '@/components/demos/unit3/OpticalRotationDemo'
import { MieScatteringDemo } from '@/components/demos/unit4/MieScatteringDemo'
import { RayleighScatteringDemo } from '@/components/demos/unit4/RayleighScatteringDemo'
import { StokesVectorDemo } from '@/components/demos/unit5/StokesVectorDemo'
import { MuellerMatrixDemo } from '@/components/demos/unit5/MuellerMatrixDemo'

// Optical Basics demos
import { LightWaveDemo } from '@/components/demos/basics/LightWaveDemo'
import { PolarizationIntroDemo } from '@/components/demos/basics/PolarizationIntroDemo'
import { PolarizationTypesDemo } from '@/components/demos/basics/PolarizationTypesDemo'
import { InteractiveOpticalBenchDemo } from '@/components/demos/basics/InteractiveOpticalBenchDemo'

// Icon components
function PhysicsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 10v6M1 12h6m10 0h6" />
      <path d="M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24" />
    </svg>
  )
}

function ExperimentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M9 3h6v8l4 9H5l4-9V3z" />
      <path d="M9 3h6" strokeLinecap="round" />
      <circle cx="10" cy="16" r="1" fill="currentColor" />
      <circle cx="14" cy="14" r="1" fill="currentColor" />
    </svg>
  )
}

function FrontierIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function LifeSceneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}

function DIYIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

// SVG Diagrams
function MalusDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <defs>
        <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="40" r="12" fill="#fbbf24" opacity="0.8" />
      <rect x="35" y="38" width="40" height="4" fill="url(#beamGrad)" />
      <rect x="78" y="25" width="4" height="30" fill="#22d3ee" rx="1" />
      <rect x="85" y="38" width="40" height="4" fill="#22d3ee" opacity="0.8" />
      <rect x="128" y="25" width="4" height="30" fill="#a78bfa" rx="1" />
      <rect x="135" y="38" width="30" height="4" fill="#a78bfa" opacity="0.5" />
      <rect x="168" y="28" width="6" height="24" fill="#64748b" rx="1" />
    </svg>
  )
}

function BirefringenceDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <line x1="20" y1="40" x2="70" y2="40" stroke="#fbbf24" strokeWidth="3" />
      <polygon points="70,40 64,36 64,44" fill="#fbbf24" />
      <path d="M80,20 L120,20 L130,60 L90,60 Z" fill="#22d3ee" opacity="0.3" stroke="#22d3ee" strokeWidth="1" />
      <line x1="130" y1="35" x2="180" y2="30" stroke="#ff4444" strokeWidth="2" />
      <text x="175" y="22" fill="#ff4444" fontSize="8">o</text>
      <line x1="130" y1="45" x2="180" y2="55" stroke="#44ff44" strokeWidth="2" />
      <text x="175" y="68" fill="#44ff44" fontSize="8">e</text>
    </svg>
  )
}

function WaveplateDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <line x1="15" y1="40" x2="55" y2="40" stroke="#fbbf24" strokeWidth="2" />
      <line x1="35" y1="30" x2="35" y2="50" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3" />
      <rect x="60" y="25" width="30" height="30" fill="#a78bfa" opacity="0.3" stroke="#a78bfa" strokeWidth="1" />
      <ellipse cx="130" cy="40" rx="15" ry="15" fill="none" stroke="#22d3ee" strokeWidth="2" />
      <polygon points="145,40 140,35 140,45" fill="#22d3ee" />
      <line x1="90" y1="40" x2="112" y2="40" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3" />
    </svg>
  )
}

function PolarizationStateDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <line x1="25" y1="25" x2="25" y2="55" stroke="#ffaa00" strokeWidth="2" />
      <circle cx="25" cy="40" r="15" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2" />
      <circle cx="100" cy="40" r="15" fill="none" stroke="#44ff44" strokeWidth="2" />
      <polygon points="115,40 110,35 110,45" fill="#44ff44" />
      <ellipse cx="175" cy="40" rx="18" ry="10" fill="none" stroke="#a78bfa" strokeWidth="2" transform="rotate(-30 175 40)" />
    </svg>
  )
}

function FresnelDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <line x1="30" y1="50" x2="170" y2="50" stroke="#64748b" strokeWidth="2" />
      <line x1="50" y1="15" x2="100" y2="50" stroke="#fbbf24" strokeWidth="2" />
      <line x1="100" y1="50" x2="150" y2="15" stroke="#22d3ee" strokeWidth="2" />
      <line x1="100" y1="50" x2="140" y2="78" stroke="#44ff44" strokeWidth="2" opacity="0.7" />
    </svg>
  )
}

function BrewsterDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <line x1="30" y1="50" x2="170" y2="50" stroke="#64748b" strokeWidth="2" />
      <line x1="40" y1="10" x2="100" y2="50" stroke="#fbbf24" strokeWidth="2" />
      <line x1="100" y1="50" x2="160" y2="10" stroke="#22d3ee" strokeWidth="2" />
      <circle cx="130" cy="30" r="4" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
      <circle cx="130" cy="30" r="1" fill="#22d3ee" />
      <path d="M100,50 L100,35" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2" />
      <text x="108" y="38" fill="#a78bfa" fontSize="8">θB</text>
    </svg>
  )
}

function ScatteringDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <line x1="20" y1="40" x2="70" y2="40" stroke="#fbbf24" strokeWidth="2" />
      <polygon points="70,40 64,36 64,44" fill="#fbbf24" />
      <circle cx="100" cy="40" r="15" fill="#64748b" opacity="0.3" stroke="#64748b" />
      <line x1="115" y1="40" x2="160" y2="40" stroke="#22d3ee" strokeWidth="1.5" />
      <line x1="110" y1="28" x2="145" y2="10" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
      <line x1="110" y1="52" x2="145" y2="70" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
      <line x1="100" y1="25" x2="100" y2="5" stroke="#4444ff" strokeWidth="1.5" opacity="0.8" />
    </svg>
  )
}

function StokesDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <circle cx="100" cy="40" r="30" fill="none" stroke="#64748b" strokeWidth="1" />
      <ellipse cx="100" cy="40" rx="30" ry="10" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2" />
      <line x1="65" y1="40" x2="135" y2="40" stroke="#ff4444" strokeWidth="1.5" />
      <text x="140" y="43" fill="#ff4444" fontSize="8">S₁</text>
      <line x1="100" y1="55" x2="100" y2="5" stroke="#44ff44" strokeWidth="1.5" />
      <text x="105" y="10" fill="#44ff44" fontSize="8">S₃</text>
      <circle cx="120" cy="30" r="4" fill="#ffff00" />
      <line x1="100" y1="40" x2="120" y2="30" stroke="#ffff00" strokeWidth="1.5" />
    </svg>
  )
}

function MuellerDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <rect x="15" y="25" width="35" height="30" fill="#22d3ee" opacity="0.2" stroke="#22d3ee" rx="3" />
      <text x="32" y="43" textAnchor="middle" fill="#22d3ee" fontSize="10">S</text>
      <rect x="70" y="15" width="50" height="50" fill="#a78bfa" opacity="0.2" stroke="#a78bfa" rx="3" />
      <text x="95" y="35" textAnchor="middle" fill="#a78bfa" fontSize="8">M</text>
      <text x="95" y="48" textAnchor="middle" fill="#a78bfa" fontSize="7">4×4</text>
      <rect x="140" y="25" width="35" height="30" fill="#44ff44" opacity="0.2" stroke="#44ff44" rx="3" />
      <text x="157" y="43" textAnchor="middle" fill="#44ff44" fontSize="10">S'</text>
      <line x1="52" y1="40" x2="68" y2="40" stroke="#64748b" strokeWidth="1.5" />
      <polygon points="68,40 63,37 63,43" fill="#64748b" />
      <line x1="122" y1="40" x2="138" y2="40" stroke="#64748b" strokeWidth="1.5" />
      <polygon points="138,40 133,37 133,43" fill="#64748b" />
    </svg>
  )
}

function LightWaveDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <path d="M10,40 Q30,20 50,40 T90,40 T130,40 T170,40" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <path d="M10,40 Q30,60 50,40 T90,40 T130,40 T170,40" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4" />
      <line x1="180" y1="40" x2="195" y2="40" stroke="#64748b" strokeWidth="2" />
      <polygon points="195,40 188,36 188,44" fill="#64748b" />
      <text x="100" y="75" textAnchor="middle" fill="#94a3b8" fontSize="8">λ</text>
    </svg>
  )
}

// Demo info interface
interface DemoQuestions {
  leading?: string  // Main leading question - the most engaging question
  guided: string[]
  openEnded: string[]
}

interface DemoInfo {
  questions?: DemoQuestions
  lifeScene?: {
    title: string
    imageAlt: string  // Description for AI-generated image placeholder
    hook: string      // Engaging question or statement
    facts: string[]   // Interesting facts connecting to daily life
  }
  physics: {
    principle: string
    formula?: string
    details: string[]
  }
  experiment: {
    title: string
    example: string
    details: string[]
  }
  frontier: {
    title: string
    example: string
    details: string[]
  }
  diy?: {
    title: string
    materials: string[]
    steps: string[]
    observation: string
  }
  diagram?: ReactNode
  visualType: '2D' | '3D' // Indicates whether demo uses 2D or 3D visualization
}

// Helper to get questions array from translations
const getQuestions = (t: (key: string) => string, basePath: string): DemoQuestions | undefined => {
  try {
    const leading = t(`${basePath}.questions.leading`)
    const hasLeading = leading && !leading.includes('.questions.')
    const guided = [
      t(`${basePath}.questions.guided.0`),
      t(`${basePath}.questions.guided.1`),
    ].filter(q => q && !q.includes('.questions.'))
    const openEnded = [
      t(`${basePath}.questions.openEnded.0`),
      t(`${basePath}.questions.openEnded.1`),
    ].filter(q => q && !q.includes('.questions.'))
    if (hasLeading || guided.length > 0 || openEnded.length > 0) {
      return {
        leading: hasLeading ? leading : undefined,
        guided,
        openEnded
      }
    }
  } catch {
    return undefined
  }
  return undefined
}

// Helper to get lifeScene data from translations
const getLifeScene = (t: (key: string) => string, basePath: string): DemoInfo['lifeScene'] | undefined => {
  try {
    const title = t(`${basePath}.lifeScene.title`)
    const hasTitle = title && !title.includes('.lifeScene.')
    if (!hasTitle) return undefined

    const imageAlt = t(`${basePath}.lifeScene.imageAlt`)
    const hook = t(`${basePath}.lifeScene.hook`)
    const facts = [
      t(`${basePath}.lifeScene.facts.0`),
      t(`${basePath}.lifeScene.facts.1`),
      t(`${basePath}.lifeScene.facts.2`),
    ].filter(f => f && !f.includes('.lifeScene.'))

    return {
      title,
      imageAlt: imageAlt && !imageAlt.includes('.lifeScene.') ? imageAlt : '',
      hook: hook && !hook.includes('.lifeScene.') ? hook : '',
      facts
    }
  } catch {
    return undefined
  }
}

// Helper to get DIY data from translations
const getDiy = (t: (key: string) => string, basePath: string): DemoInfo['diy'] | undefined => {
  try {
    const title = t(`${basePath}.diy.title`)
    const hasTitle = title && !title.includes('.diy.')
    if (!hasTitle) return undefined

    const materials = [
      t(`${basePath}.diy.materials.0`),
      t(`${basePath}.diy.materials.1`),
      t(`${basePath}.diy.materials.2`),
      t(`${basePath}.diy.materials.3`),
    ].filter(m => m && !m.includes('.diy.'))

    const steps = [
      t(`${basePath}.diy.steps.0`),
      t(`${basePath}.diy.steps.1`),
      t(`${basePath}.diy.steps.2`),
      t(`${basePath}.diy.steps.3`),
    ].filter(s => s && !s.includes('.diy.'))

    const observation = t(`${basePath}.diy.observation`)

    return {
      title,
      materials,
      steps,
      observation: observation && !observation.includes('.diy.') ? observation : ''
    }
  } catch {
    return undefined
  }
}

// Demo info data - using i18n keys
const getDemoInfo = (t: (key: string) => string): Record<string, DemoInfo> => ({
  'light-wave': {
    questions: getQuestions(t, 'basics.demos.lightWave'),
    lifeScene: getLifeScene(t, 'basics.demos.lightWave'),
    physics: {
      principle: t('basics.demos.lightWave.physics.principle'),
      formula: t('basics.demos.lightWave.physics.formula'),
      details: [
        t('basics.demos.lightWave.physics.details.0'),
        t('basics.demos.lightWave.physics.details.1'),
        t('basics.demos.lightWave.physics.details.2'),
      ],
    },
    experiment: {
      title: t('basics.demos.lightWave.title'),
      example: t('basics.demos.lightWave.description'),
      details: [],
    },
    frontier: {
      title: t('basics.demos.lightWave.title'),
      example: t('basics.demos.lightWave.description'),
      details: [],
    },
    diy: getDiy(t, 'basics.demos.lightWave'),
    diagram: <LightWaveDiagram />,
    visualType: '2D',
  },
  'polarization-intro': {
    questions: getQuestions(t, 'basics.demos.polarizationIntro'),
    lifeScene: getLifeScene(t, 'basics.demos.polarizationIntro'),
    physics: {
      principle: t('basics.demos.polarizationIntro.physics.principle'),
      details: [
        t('basics.demos.polarizationIntro.physics.details.0'),
        t('basics.demos.polarizationIntro.physics.details.1'),
        t('basics.demos.polarizationIntro.physics.details.2'),
      ],
    },
    experiment: {
      title: t('basics.demos.polarizationIntro.title'),
      example: t('basics.demos.polarizationIntro.description'),
      details: [],
    },
    frontier: {
      title: t('basics.demos.polarizationIntro.title'),
      example: t('basics.demos.polarizationIntro.description'),
      details: [],
    },
    diy: getDiy(t, 'basics.demos.polarizationIntro'),
    visualType: '2D',
  },
  'polarization-types': {
    questions: getQuestions(t, 'basics.demos.polarizationTypes'),
    lifeScene: getLifeScene(t, 'basics.demos.polarizationTypes'),
    physics: {
      principle: t('basics.demos.polarizationTypes.physics.principle'),
      details: [
        t('basics.demos.polarizationTypes.physics.details.0'),
        t('basics.demos.polarizationTypes.physics.details.1'),
        t('basics.demos.polarizationTypes.physics.details.2'),
      ],
    },
    experiment: {
      title: t('basics.demos.polarizationTypes.title'),
      example: t('basics.demos.polarizationTypes.description'),
      details: [],
    },
    frontier: {
      title: t('basics.demos.polarizationTypes.title'),
      example: t('basics.demos.polarizationTypes.description'),
      details: [],
    },
    diy: getDiy(t, 'basics.demos.polarizationTypes'),
    diagram: <PolarizationStateDiagram />,
    visualType: '2D',
  },
  'optical-bench': {
    questions: getQuestions(t, 'basics.demos.opticalBench'),
    lifeScene: getLifeScene(t, 'basics.demos.opticalBench'),
    physics: {
      principle: t('basics.demos.opticalBench.physics.principle'),
      details: [
        t('basics.demos.opticalBench.physics.details.0'),
        t('basics.demos.opticalBench.physics.details.1'),
        t('basics.demos.opticalBench.physics.details.2'),
      ],
    },
    experiment: {
      title: t('basics.demos.opticalBench.title'),
      example: t('basics.demos.opticalBench.description'),
      details: [],
    },
    frontier: {
      title: t('basics.demos.opticalBench.title'),
      example: t('basics.demos.opticalBench.description'),
      details: [],
    },
    diy: getDiy(t, 'basics.demos.opticalBench'),
    visualType: '2D',
  },
  'polarization-state': {
    questions: getQuestions(t, 'demos.polarizationState'),
    lifeScene: getLifeScene(t, 'demos.polarizationState'),
    physics: {
      principle: t('demos.polarizationState.physics.principle'),
      formula: t('demos.polarizationState.physics.formula'),
      details: [
        t('demos.polarizationState.physics.details.0'),
        t('demos.polarizationState.physics.details.1'),
        t('demos.polarizationState.physics.details.2'),
      ],
    },
    experiment: {
      title: t('demos.polarizationState.experiment.title'),
      example: t('demos.polarizationState.experiment.example'),
      details: [
        t('demos.polarizationState.experiment.details.0'),
        t('demos.polarizationState.experiment.details.1'),
        t('demos.polarizationState.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.polarizationState.frontier.title'),
      example: t('demos.polarizationState.frontier.example'),
      details: [
        t('demos.polarizationState.frontier.details.0'),
        t('demos.polarizationState.frontier.details.1'),
        t('demos.polarizationState.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.polarizationState'),
    diagram: <PolarizationStateDiagram />,
    visualType: '3D',
  },
  malus: {
    questions: getQuestions(t, 'demos.malus'),
    lifeScene: getLifeScene(t, 'demos.malus'),
    physics: {
      principle: t('demos.malus.physics.principle'),
      formula: t('demos.malus.physics.formula'),
      details: [
        t('demos.malus.physics.details.0'),
        t('demos.malus.physics.details.1'),
        t('demos.malus.physics.details.2'),
      ],
    },
    experiment: {
      title: t('demos.malus.experiment.title'),
      example: t('demos.malus.experiment.example'),
      details: [
        t('demos.malus.experiment.details.0'),
        t('demos.malus.experiment.details.1'),
        t('demos.malus.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.malus.frontier.title'),
      example: t('demos.malus.frontier.example'),
      details: [
        t('demos.malus.frontier.details.0'),
        t('demos.malus.frontier.details.1'),
        t('demos.malus.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.malus'),
    diagram: <MalusDiagram />,
    visualType: '2D',
  },
  birefringence: {
    questions: getQuestions(t, 'demos.birefringence'),
    lifeScene: getLifeScene(t, 'demos.birefringence'),
    physics: {
      principle: t('demos.birefringence.physics.principle'),
      formula: t('demos.birefringence.physics.formula'),
      details: [
        t('demos.birefringence.physics.details.0'),
        t('demos.birefringence.physics.details.1'),
        t('demos.birefringence.physics.details.2'),
      ],
    },
    experiment: {
      title: t('demos.birefringence.experiment.title'),
      example: t('demos.birefringence.experiment.example'),
      details: [
        t('demos.birefringence.experiment.details.0'),
        t('demos.birefringence.experiment.details.1'),
        t('demos.birefringence.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.birefringence.frontier.title'),
      example: t('demos.birefringence.frontier.example'),
      details: [
        t('demos.birefringence.frontier.details.0'),
        t('demos.birefringence.frontier.details.1'),
        t('demos.birefringence.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.birefringence'),
    diagram: <BirefringenceDiagram />,
    visualType: '3D',
  },
  waveplate: {
    questions: getQuestions(t, 'demos.waveplate'),
    lifeScene: getLifeScene(t, 'demos.waveplate'),
    physics: {
      principle: t('demos.waveplate.physics.principle'),
      formula: t('demos.waveplate.physics.formula'),
      details: [
        t('demos.waveplate.physics.details.0'),
        t('demos.waveplate.physics.details.1'),
        t('demos.waveplate.physics.details.2'),
      ],
    },
    experiment: {
      title: t('demos.waveplate.experiment.title'),
      example: t('demos.waveplate.experiment.example'),
      details: [
        t('demos.waveplate.experiment.details.0'),
        t('demos.waveplate.experiment.details.1'),
        t('demos.waveplate.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.waveplate.frontier.title'),
      example: t('demos.waveplate.frontier.example'),
      details: [
        t('demos.waveplate.frontier.details.0'),
        t('demos.waveplate.frontier.details.1'),
        t('demos.waveplate.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.waveplate'),
    diagram: <WaveplateDiagram />,
    visualType: '3D',
  },
  fresnel: {
    questions: getQuestions(t, 'demos.fresnel'),
    lifeScene: getLifeScene(t, 'demos.fresnel'),
    physics: {
      principle: t('demos.fresnel.physics.principle'),
      formula: t('demos.fresnel.physics.formula'),
      details: [
        t('demos.fresnel.physics.details.0'),
        t('demos.fresnel.physics.details.1'),
        t('demos.fresnel.physics.details.2'),
      ],
    },
    experiment: {
      title: t('demos.fresnel.experiment.title'),
      example: t('demos.fresnel.experiment.example'),
      details: [
        t('demos.fresnel.experiment.details.0'),
        t('demos.fresnel.experiment.details.1'),
        t('demos.fresnel.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.fresnel.frontier.title'),
      example: t('demos.fresnel.frontier.example'),
      details: [
        t('demos.fresnel.frontier.details.0'),
        t('demos.fresnel.frontier.details.1'),
        t('demos.fresnel.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.fresnel'),
    diagram: <FresnelDiagram />,
    visualType: '2D',
  },
  brewster: {
    questions: getQuestions(t, 'demos.brewster'),
    lifeScene: getLifeScene(t, 'demos.brewster'),
    physics: {
      principle: t('demos.brewster.physics.principle'),
      formula: t('demos.brewster.physics.formula'),
      details: [
        t('demos.brewster.physics.details.0'),
        t('demos.brewster.physics.details.1'),
        t('demos.brewster.physics.details.2'),
      ],
    },
    experiment: {
      title: t('demos.brewster.experiment.title'),
      example: t('demos.brewster.experiment.example'),
      details: [
        t('demos.brewster.experiment.details.0'),
        t('demos.brewster.experiment.details.1'),
        t('demos.brewster.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.brewster.frontier.title'),
      example: t('demos.brewster.frontier.example'),
      details: [
        t('demos.brewster.frontier.details.0'),
        t('demos.brewster.frontier.details.1'),
        t('demos.brewster.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.brewster'),
    diagram: <BrewsterDiagram />,
    visualType: '2D',
  },
  chromatic: {
    questions: getQuestions(t, 'demos.chromatic'),
    lifeScene: getLifeScene(t, 'demos.chromatic'),
    physics: {
      principle: t('demos.chromatic.physics.principle'),
      formula: t('demos.chromatic.physics.formula'),
      details: [
        t('demos.chromatic.physics.details.0'),
        t('demos.chromatic.physics.details.1'),
        t('demos.chromatic.physics.details.2'),
      ],
    },
    experiment: {
      title: t('demos.chromatic.experiment.title'),
      example: t('demos.chromatic.experiment.example'),
      details: [
        t('demos.chromatic.experiment.details.0'),
        t('demos.chromatic.experiment.details.1'),
        t('demos.chromatic.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.chromatic.frontier.title'),
      example: t('demos.chromatic.frontier.example'),
      details: [
        t('demos.chromatic.frontier.details.0'),
        t('demos.chromatic.frontier.details.1'),
        t('demos.chromatic.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.chromatic'),
    visualType: '2D',
  },
  'optical-rotation': {
    questions: getQuestions(t, 'demos.opticalRotation'),
    lifeScene: getLifeScene(t, 'demos.opticalRotation'),
    physics: {
      principle: t('demos.opticalRotation.physics.principle'),
      formula: t('demos.opticalRotation.physics.formula'),
      details: [
        t('demos.opticalRotation.physics.details.0'),
        t('demos.opticalRotation.physics.details.1'),
        t('demos.opticalRotation.physics.details.2'),
      ],
    },
    experiment: {
      title: t('demos.opticalRotation.experiment.title'),
      example: t('demos.opticalRotation.experiment.example'),
      details: [
        t('demos.opticalRotation.experiment.details.0'),
        t('demos.opticalRotation.experiment.details.1'),
        t('demos.opticalRotation.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.opticalRotation.frontier.title'),
      example: t('demos.opticalRotation.frontier.example'),
      details: [
        t('demos.opticalRotation.frontier.details.0'),
        t('demos.opticalRotation.frontier.details.1'),
        t('demos.opticalRotation.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.opticalRotation'),
    visualType: '2D',
  },
  'mie-scattering': {
    questions: getQuestions(t, 'demos.mieScattering'),
    lifeScene: getLifeScene(t, 'demos.mieScattering'),
    physics: {
      principle: t('demos.mieScattering.physics.principle'),
      formula: t('demos.mieScattering.physics.formula'),
      details: [
        t('demos.mieScattering.physics.details.0'),
        t('demos.mieScattering.physics.details.1'),
        t('demos.mieScattering.physics.details.2'),
      ],
    },
    experiment: {
      title: t('demos.mieScattering.experiment.title'),
      example: t('demos.mieScattering.experiment.example'),
      details: [
        t('demos.mieScattering.experiment.details.0'),
        t('demos.mieScattering.experiment.details.1'),
        t('demos.mieScattering.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.mieScattering.frontier.title'),
      example: t('demos.mieScattering.frontier.example'),
      details: [
        t('demos.mieScattering.frontier.details.0'),
        t('demos.mieScattering.frontier.details.1'),
        t('demos.mieScattering.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.mieScattering'),
    diagram: <ScatteringDiagram />,
    visualType: '2D',
  },
  rayleigh: {
    questions: getQuestions(t, 'demos.rayleigh'),
    lifeScene: getLifeScene(t, 'demos.rayleigh'),
    physics: {
      principle: t('demos.rayleigh.physics.principle'),
      formula: t('demos.rayleigh.physics.formula'),
      details: [
        t('demos.rayleigh.physics.details.0'),
        t('demos.rayleigh.physics.details.1'),
        t('demos.rayleigh.physics.details.2'),
      ],
    },
    experiment: {
      title: t('demos.rayleigh.experiment.title'),
      example: t('demos.rayleigh.experiment.example'),
      details: [
        t('demos.rayleigh.experiment.details.0'),
        t('demos.rayleigh.experiment.details.1'),
        t('demos.rayleigh.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.rayleigh.frontier.title'),
      example: t('demos.rayleigh.frontier.example'),
      details: [
        t('demos.rayleigh.frontier.details.0'),
        t('demos.rayleigh.frontier.details.1'),
        t('demos.rayleigh.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.rayleigh'),
    diagram: <ScatteringDiagram />,
    visualType: '2D',
  },
  stokes: {
    questions: getQuestions(t, 'demos.stokes'),
    lifeScene: getLifeScene(t, 'demos.stokes'),
    physics: {
      principle: t('demos.stokes.physics.principle'),
      formula: t('demos.stokes.physics.formula'),
      details: [
        t('demos.stokes.physics.details.0'),
        t('demos.stokes.physics.details.1'),
        t('demos.stokes.physics.details.2'),
        t('demos.stokes.physics.details.3'),
      ],
    },
    experiment: {
      title: t('demos.stokes.experiment.title'),
      example: t('demos.stokes.experiment.example'),
      details: [
        t('demos.stokes.experiment.details.0'),
        t('demos.stokes.experiment.details.1'),
        t('demos.stokes.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.stokes.frontier.title'),
      example: t('demos.stokes.frontier.example'),
      details: [
        t('demos.stokes.frontier.details.0'),
        t('demos.stokes.frontier.details.1'),
        t('demos.stokes.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.stokes'),
    diagram: <StokesDiagram />,
    visualType: '3D',
  },
  mueller: {
    questions: getQuestions(t, 'demos.mueller'),
    lifeScene: getLifeScene(t, 'demos.mueller'),
    physics: {
      principle: t('demos.mueller.physics.principle'),
      formula: t('demos.mueller.physics.formula'),
      details: [
        t('demos.mueller.physics.details.0'),
        t('demos.mueller.physics.details.1'),
        t('demos.mueller.physics.details.2'),
      ],
    },
    experiment: {
      title: t('demos.mueller.experiment.title'),
      example: t('demos.mueller.experiment.example'),
      details: [
        t('demos.mueller.experiment.details.0'),
        t('demos.mueller.experiment.details.1'),
        t('demos.mueller.experiment.details.2'),
      ],
    },
    frontier: {
      title: t('demos.mueller.frontier.title'),
      example: t('demos.mueller.frontier.example'),
      details: [
        t('demos.mueller.frontier.details.0'),
        t('demos.mueller.frontier.details.1'),
        t('demos.mueller.frontier.details.2'),
      ],
    },
    diy: getDiy(t, 'demos.mueller'),
    diagram: <MuellerDiagram />,
    visualType: '2D',
  },
})

interface DemoItem {
  id: string
  titleKey: string
  unit: number // 0 = basics
  component: React.ComponentType
  descriptionKey: string
  visualType: '2D' | '3D'
}

const DEMOS: DemoItem[] = [
  // Unit 0 - Optical Basics
  {
    id: 'light-wave',
    titleKey: 'basics.demos.lightWave.title',
    unit: 0,
    component: LightWaveDemo,
    descriptionKey: 'basics.demos.lightWave.description',
    visualType: '2D',
  },
  {
    id: 'polarization-intro',
    titleKey: 'basics.demos.polarizationIntro.title',
    unit: 0,
    component: PolarizationIntroDemo,
    descriptionKey: 'basics.demos.polarizationIntro.description',
    visualType: '2D',
  },
  {
    id: 'polarization-types',
    titleKey: 'basics.demos.polarizationTypes.title',
    unit: 0,
    component: PolarizationTypesDemo,
    descriptionKey: 'basics.demos.polarizationTypes.description',
    visualType: '2D',
  },
  {
    id: 'optical-bench',
    titleKey: 'basics.demos.opticalBench.title',
    unit: 0,
    component: InteractiveOpticalBenchDemo,
    descriptionKey: 'basics.demos.opticalBench.description',
    visualType: '2D',
  },
  // Unit 1
  {
    id: 'polarization-state',
    titleKey: 'demos.polarizationState.title',
    unit: 1,
    component: PolarizationStateDemo,
    descriptionKey: 'demos.polarizationState.description',
    visualType: '3D',
  },
  {
    id: 'malus',
    titleKey: 'demos.malus.title',
    unit: 1,
    component: MalusLawDemo,
    descriptionKey: 'demos.malus.description',
    visualType: '2D',
  },
  {
    id: 'birefringence',
    titleKey: 'demos.birefringence.title',
    unit: 1,
    component: BirefringenceDemo,
    descriptionKey: 'demos.birefringence.description',
    visualType: '3D',
  },
  {
    id: 'waveplate',
    titleKey: 'demos.waveplate.title',
    unit: 1,
    component: WaveplateDemo,
    descriptionKey: 'demos.waveplate.description',
    visualType: '3D',
  },
  // Unit 2
  {
    id: 'fresnel',
    titleKey: 'demos.fresnel.title',
    unit: 2,
    component: FresnelDemo,
    descriptionKey: 'demos.fresnel.description',
    visualType: '2D',
  },
  {
    id: 'brewster',
    titleKey: 'demos.brewster.title',
    unit: 2,
    component: BrewsterDemo,
    descriptionKey: 'demos.brewster.description',
    visualType: '2D',
  },
  // Unit 3
  {
    id: 'chromatic',
    titleKey: 'demos.chromatic.title',
    unit: 3,
    component: ChromaticDemo,
    descriptionKey: 'demos.chromatic.description',
    visualType: '2D',
  },
  {
    id: 'optical-rotation',
    titleKey: 'demos.opticalRotation.title',
    unit: 3,
    component: OpticalRotationDemo,
    descriptionKey: 'demos.opticalRotation.description',
    visualType: '2D',
  },
  // Unit 4
  {
    id: 'mie-scattering',
    titleKey: 'demos.mieScattering.title',
    unit: 4,
    component: MieScatteringDemo,
    descriptionKey: 'demos.mieScattering.description',
    visualType: '2D',
  },
  {
    id: 'rayleigh',
    titleKey: 'demos.rayleigh.title',
    unit: 4,
    component: RayleighScatteringDemo,
    descriptionKey: 'demos.rayleigh.description',
    visualType: '2D',
  },
  // Unit 5
  {
    id: 'stokes',
    titleKey: 'demos.stokes.title',
    unit: 5,
    component: StokesVectorDemo,
    descriptionKey: 'demos.stokes.description',
    visualType: '3D',
  },
  {
    id: 'mueller',
    titleKey: 'demos.mueller.title',
    unit: 5,
    component: MuellerMatrixDemo,
    descriptionKey: 'demos.mueller.description',
    visualType: '2D',
  },
]

interface UnitInfo {
  num: number
  titleKey: string
  color: string
}

const UNITS: UnitInfo[] = [
  { num: 0, titleKey: 'course.units.basics.title', color: 'yellow' },
  { num: 1, titleKey: 'course.units.1.title', color: 'cyan' },
  { num: 2, titleKey: 'course.units.2.title', color: 'purple' },
  { num: 3, titleKey: 'course.units.3.title', color: 'green' },
  { num: 4, titleKey: 'course.units.4.title', color: 'orange' },
  { num: 5, titleKey: 'course.units.5.title', color: 'pink' },
]

function DemoLoading() {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-4" />
        <p className="text-gray-400">{t('common.loading')}</p>
      </div>
    </div>
  )
}

// Visual type badge component
function VisualTypeBadge({ type }: { type: '2D' | '3D' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
        type === '3D'
          ? 'bg-purple-400/20 text-purple-400 border border-purple-400/30'
          : 'bg-green-400/20 text-green-400 border border-green-400/30'
      )}
    >
      {type === '3D' ? <Box className="w-3 h-3" /> : <BarChart2 className="w-3 h-3" />}
      {type}
    </span>
  )
}

// Collapsible card component with enhanced interactions
function CollapsibleCard({
  title,
  icon,
  color,
  isExpanded,
  onToggle,
  children,
}: {
  title: string
  icon: ReactNode
  color: string
  isExpanded: boolean
  onToggle: () => void
  children: ReactNode
}) {
  const { theme } = useTheme()

  const colorClasses = {
    orange: {
      header: theme === 'dark'
        ? 'bg-orange-400/10 border-orange-400/30 hover:bg-orange-400/20 hover:shadow-[0_0_15px_rgba(251,146,60,0.15)]'
        : 'bg-orange-50 border-orange-200 hover:bg-orange-100 hover:shadow-md',
      icon: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
      expandedBorder: theme === 'dark' ? 'border-orange-400/50' : 'border-orange-300',
    },
    cyan: {
      header: theme === 'dark'
        ? 'bg-cyan-400/10 border-cyan-400/30 hover:bg-cyan-400/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]'
        : 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100 hover:shadow-md',
      icon: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
      expandedBorder: theme === 'dark' ? 'border-cyan-400/50' : 'border-cyan-300',
    },
    green: {
      header: theme === 'dark'
        ? 'bg-green-400/10 border-green-400/30 hover:bg-green-400/20 hover:shadow-[0_0_15px_rgba(74,222,128,0.15)]'
        : 'bg-green-50 border-green-200 hover:bg-green-100 hover:shadow-md',
      icon: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      expandedBorder: theme === 'dark' ? 'border-green-400/50' : 'border-green-300',
    },
    purple: {
      header: theme === 'dark'
        ? 'bg-purple-400/10 border-purple-400/30 hover:bg-purple-400/20 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)]'
        : 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:shadow-md',
      icon: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
      expandedBorder: theme === 'dark' ? 'border-purple-400/50' : 'border-purple-300',
    },
    yellow: {
      header: theme === 'dark'
        ? 'bg-yellow-400/10 border-yellow-400/30 hover:bg-yellow-400/20 hover:shadow-[0_0_15px_rgba(250,204,21,0.15)]'
        : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:shadow-md',
      icon: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
      expandedBorder: theme === 'dark' ? 'border-yellow-400/50' : 'border-yellow-300',
    },
  }

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan

  return (
    <div className={cn(
      'rounded-xl border overflow-hidden transition-all duration-300',
      theme === 'dark' ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white border-gray-200',
      isExpanded && colors.expandedBorder,
      isExpanded && (theme === 'dark' ? 'shadow-lg' : 'shadow-md')
    )}>
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 border-b transition-all duration-200 cursor-pointer',
          'active:scale-[0.99]',
          colors.header
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn(colors.icon, 'transition-transform duration-200', isExpanded && 'scale-110')}>{icon}</span>
          <span className={cn(
            'font-semibold text-sm transition-colors',
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          )}>
            {title}
          </span>
        </div>
        <ChevronRight className={cn(
          'w-4 h-4 transition-transform duration-300',
          isExpanded && 'rotate-90',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        )} />
      </button>
      <div className={cn(
        'transition-all duration-300 ease-in-out overflow-hidden',
        isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export function DemosPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile, isTablet } = useIsMobile()
  const [activeDemo, setActiveDemo] = useState<string>('light-wave')
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [expandedUnit, setExpandedUnit] = useState<number | null>(0)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    lifeScene: true,  // Life scene card expanded by default
    physics: false,
    experiment: false,
    frontier: false,
    diy: false,
  })

  // Reset card states when switching demos - cards should be collapsed on first visit to each demo
  const [visitedDemos, setVisitedDemos] = useState<Set<string>>(new Set())

  const handleDemoChange = (demoId: string) => {
    setActiveDemo(demoId)
    // Reset cards to collapsed when switching to a new (not previously visited) demo
    if (!visitedDemos.has(demoId)) {
      setExpandedCards({
        lifeScene: true,  // Life scene card expanded by default
        physics: false,
        experiment: false,
        frontier: false,
        diy: false,
      })
      setVisitedDemos(prev => new Set(prev).add(demoId))
    }
  }

  const toggleCard = (card: string) => {
    setExpandedCards(prev => ({ ...prev, [card]: !prev[card] }))
  }

  const isCompact = isMobile || isTablet
  const currentDemo = DEMOS.find((d) => d.id === activeDemo)
  const DemoComponent = currentDemo?.component
  const demoInfo = getDemoInfo(t)[activeDemo]

  return (
    <div
      className={cn(
        'min-h-screen',
        theme === 'dark' ? 'bg-[#0a0a0f] text-gray-200' : 'bg-[#f8fafc] text-gray-800'
      )}
    >
      {/* Navigation Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between backdrop-blur-sm',
          isCompact ? 'px-3 py-2' : 'px-6 py-3',
          theme === 'dark'
            ? 'bg-slate-900/95 border-b border-cyan-400/20'
            : 'bg-white/95 border-b border-cyan-500/20'
        )}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu button */}
          {isCompact && (
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                theme === 'dark'
                  ? 'text-cyan-400 hover:bg-cyan-400/10'
                  : 'text-cyan-600 hover:bg-cyan-100'
              )}
            >
              {showMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
          <Link
            to="/"
            className={cn(
              'flex items-center gap-2 transition-colors',
              theme === 'dark'
                ? 'text-cyan-400 hover:text-cyan-300'
                : 'text-cyan-600 hover:text-cyan-500'
            )}
          >
            <Home className={cn(isCompact ? 'w-4 h-4' : 'w-5 h-5')} />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className={cn(isCompact ? 'text-xl' : 'text-2xl')}>⟡</span>
            <span
              className={cn(
                'font-bold',
                isCompact ? 'text-base' : 'text-xl',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )}
            >
              PolarCraft
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4">
          {!isCompact && (
            <>
              <Link
                to="/game"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-cyan-400/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-cyan-100'
                )}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>{t('common.game')}</span>
              </Link>
              <Link
                to="/demos"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg',
                  theme === 'dark' ? 'text-cyan-400 bg-cyan-400/15' : 'text-cyan-600 bg-cyan-100'
                )}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('common.course')}</span>
              </Link>
            </>
          )}
          <LanguageThemeSwitcher />
        </nav>
      </header>

      {/* Main Container */}
      <div className={cn("flex", isCompact ? "pt-[52px]" : "pt-[60px]")}>
        {/* Sidebar - Desktop always visible, Mobile slide-in */}
        <aside
          className={cn(
            'fixed top-0 bottom-0 border-r overflow-y-auto transition-transform duration-300 z-40',
            isCompact
              ? cn(
                  'w-72 left-0',
                  showMobileSidebar ? 'translate-x-0' : '-translate-x-full',
                  'pt-14'
                )
              : 'w-64 left-0 top-[60px]',
            theme === 'dark'
              ? 'bg-slate-900/95 border-cyan-400/10'
              : 'bg-white/95 border-cyan-200'
          )}
        >
          <div className="p-4">
            {UNITS.map((unit) => {
              const unitDemos = DEMOS.filter((d) => d.unit === unit.num)
              const isExpanded = !isCompact || expandedUnit === unit.num

              return (
                <div key={unit.num} className="mb-3">
                  <button
                    onClick={() => isCompact && setExpandedUnit(expandedUnit === unit.num ? null : unit.num)}
                    className={cn(
                      'w-full text-[10px] uppercase tracking-wider mb-2 px-2 font-semibold flex items-center gap-2',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
                      isCompact && (theme === 'dark' ? 'hover:text-cyan-400' : 'hover:text-cyan-600'),
                      'transition-colors'
                    )}
                  >
                    {unit.num === 0 ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className={`text-${unit.color}-400`}>●</span>
                    )}
                    <span className="flex-1 text-left">
                      {unit.num === 0 ? t('basics.title') : `${t('game.level')} ${unit.num}`} ·{' '}
                      {t(unit.titleKey)}
                    </span>
                    {isCompact && (
                      <ChevronDown className={cn(
                        "w-3 h-3 transition-transform",
                        isExpanded && "rotate-180"
                      )} />
                    )}
                  </button>
                  {isExpanded && (
                    <ul className="space-y-0.5">
                      {unitDemos.map((demo) => (
                        <li key={demo.id}>
                          <button
                            onClick={() => {
                              handleDemoChange(demo.id)
                              if (isCompact) setShowMobileSidebar(false)
                            }}
                            className={cn(
                              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all duration-200',
                              'hover:translate-x-1 active:scale-[0.98]',
                              activeDemo === demo.id
                                ? theme === 'dark'
                                  ? 'bg-gradient-to-r from-cyan-400/20 to-blue-400/10 text-cyan-400 border-l-2 border-cyan-400'
                                  : 'bg-gradient-to-r from-cyan-100 to-blue-50 text-cyan-700 border-l-2 border-cyan-500'
                                : theme === 'dark'
                                  ? 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                          >
                            <span
                              className={cn(
                                'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0',
                                activeDemo === demo.id
                                  ? theme === 'dark'
                                    ? 'bg-cyan-400 text-black'
                                    : 'bg-cyan-500 text-white'
                                  : theme === 'dark'
                                    ? 'bg-slate-700 text-gray-400'
                                    : 'bg-gray-200 text-gray-500'
                              )}
                            >
                              {unitDemos.indexOf(demo) + 1}
                            </span>
                            <span className="truncate flex-1">{t(demo.titleKey)}</span>
                            <VisualTypeBadge type={demo.visualType} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>

          {/* Interaction guide - hide on mobile to save space */}
          {!isCompact && (
            <div
              className={cn(
                'p-4 border-t',
                theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
              )}
            >
              <div
                className={cn(
                  'p-3 rounded-lg border',
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50'
                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
                )}
              >
                <h4
                  className={cn(
                    'text-xs font-semibold mb-2',
                    theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                  )}
                >
                  {t('course.interactionGuide')}
                </h4>
                <ul
                  className={cn(
                    'text-[11px] space-y-1.5',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  )}
                >
                  <li className="flex items-center gap-2">
                    <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-500'}>◎</span>
                    {t('course.dragToRotate')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-500'}>◎</span>
                    {t('course.scrollToZoom')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-500'}>◎</span>
                    {t('course.slidersAdjust')}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </aside>

        {/* Mobile sidebar overlay */}
        {isCompact && showMobileSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1",
          isCompact ? "ml-0 p-3" : "ml-64 p-6"
        )}>
          <div className="max-w-[1400px] mx-auto">
            {/* Title and description */}
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={cn(
                    'px-2.5 py-1 text-xs rounded-lg border',
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-cyan-400/20 to-blue-400/20 text-cyan-400 border-cyan-400/30'
                      : 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border-cyan-300'
                  )}
                >
                  {currentDemo?.unit === 0
                    ? t('basics.title')
                    : `${t('game.level')} ${currentDemo?.unit}`}
                </span>
                <VisualTypeBadge type={currentDemo?.visualType || '2D'} />
                <h1
                  className={cn(
                    'text-2xl font-bold',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {t(currentDemo?.titleKey || '')}
                </h1>
              </div>
              <p className={theme === 'dark' ? 'text-gray-400 text-sm' : 'text-gray-700 text-sm'}>
                {t(currentDemo?.descriptionKey || '')}
              </p>
            </div>

            {/* Thinking Questions Section - Before Demo */}
            {demoInfo?.questions && (demoInfo.questions.leading || demoInfo.questions.guided.length > 0 || demoInfo.questions.openEnded.length > 0) && (
              <div
                className={cn(
                  'mb-5 rounded-xl border p-4',
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-amber-400/5 to-orange-400/5 border-amber-400/20'
                    : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className={cn(
                    'w-5 h-5',
                    theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                  )} />
                  <h3 className={cn(
                    'text-lg font-bold',
                    theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
                  )}>
                    {t('course.questions.title')}
                  </h3>
                </div>
                {/* Leading Question - Main engaging question */}
                {demoInfo.questions.leading && (
                  <div
                    className={cn(
                      'mb-4 p-4 rounded-lg border-2 border-dashed transition-all duration-300',
                      'hover:scale-[1.01] hover:shadow-lg cursor-default',
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-amber-400/10 to-orange-400/10 border-amber-400/40 hover:border-amber-400/60'
                        : 'bg-gradient-to-r from-amber-100/80 to-orange-100/80 border-amber-400 hover:border-amber-500'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className={cn(
                        'text-2xl flex-shrink-0 animate-pulse',
                        theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                      )}>?</span>
                      <p className={cn(
                        'text-base font-medium leading-relaxed',
                        theme === 'dark' ? 'text-amber-200' : 'text-amber-900'
                      )}>
                        {demoInfo.questions.leading}
                      </p>
                    </div>
                  </div>
                )}
                <div className={cn(
                  'grid gap-4',
                  isCompact ? 'grid-cols-1' : 'grid-cols-2'
                )}>
                  {/* Guided Questions */}
                  {demoInfo.questions.guided.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className={cn(
                          'w-4 h-4',
                          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                        )} />
                        <span className={cn(
                          'text-sm font-semibold',
                          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
                        )}>
                          {t('course.questions.guided')}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {demoInfo.questions.guided.map((q, i) => (
                          <li
                            key={i}
                            className={cn(
                              'text-sm pl-3 border-l-2 py-1 transition-all duration-200',
                              'hover:pl-4 hover:border-l-4 cursor-default',
                              theme === 'dark'
                                ? 'text-gray-300 border-cyan-400/40 hover:border-cyan-400 hover:text-cyan-100'
                                : 'text-gray-800 border-cyan-500 hover:border-cyan-600 hover:bg-cyan-50/50'
                            )}
                          >
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Open-ended Questions */}
                  {demoInfo.questions.openEnded.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className={cn(
                          'w-4 h-4',
                          theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                        )} />
                        <span className={cn(
                          'text-sm font-semibold',
                          theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
                        )}>
                          {t('course.questions.openEnded')}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {demoInfo.questions.openEnded.map((q, i) => (
                          <li
                            key={i}
                            className={cn(
                              'text-sm pl-3 border-l-2 py-1 transition-all duration-200',
                              'hover:pl-4 hover:border-l-4 cursor-default',
                              theme === 'dark'
                                ? 'text-gray-300 border-purple-400/40 hover:border-purple-400 hover:text-purple-100'
                                : 'text-gray-800 border-purple-500 hover:border-purple-600 hover:bg-purple-50/50'
                            )}
                          >
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Demo area */}
            <div
              className={cn(
                'rounded-2xl border overflow-hidden',
                theme === 'dark'
                  ? 'bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.1)]'
                  : 'bg-gradient-to-br from-white to-gray-50 border-cyan-200 shadow-lg'
              )}
            >
              <div className="p-5 min-h-[550px]">
                <Suspense fallback={<DemoLoading />}>
                  {DemoComponent && <DemoComponent />}
                </Suspense>
              </div>
            </div>

            {/* Collapsible Info cards - responsive grid layout */}
            {demoInfo && (
              <div className="mt-5 space-y-4">
                {/* Life Scene card - full width, at top */}
                {demoInfo.lifeScene && (
                  <CollapsibleCard
                    title={t('course.cards.lifeScene')}
                    icon={<LifeSceneIcon />}
                    color="orange"
                    isExpanded={expandedCards.lifeScene}
                    onToggle={() => toggleCard('lifeScene')}
                  >
                    <div className="space-y-4">
                      {/* Image placeholder */}
                      <div
                        className={cn(
                          'rounded-lg p-4 border-2 border-dashed flex items-center justify-center min-h-[120px]',
                          theme === 'dark'
                            ? 'bg-orange-400/5 border-orange-400/30'
                            : 'bg-orange-50 border-orange-300'
                        )}
                      >
                        <div className="text-center">
                          <div className={cn(
                            'text-4xl mb-2',
                            theme === 'dark' ? 'text-orange-400/50' : 'text-orange-400'
                          )}>
                            🖼️
                          </div>
                          <p className={cn(
                            'text-xs italic',
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          )}>
                            {demoInfo.lifeScene.imageAlt}
                          </p>
                        </div>
                      </div>

                      {/* Hook question/statement */}
                      <p className={cn(
                        'text-base font-medium leading-relaxed',
                        theme === 'dark' ? 'text-orange-200' : 'text-orange-900'
                      )}>
                        {demoInfo.lifeScene.hook}
                      </p>

                      {/* Facts list */}
                      <div className="space-y-2">
                        {demoInfo.lifeScene.facts.map((fact, i) => (
                          <ListItem
                            key={i}
                            icon={
                              <span className={theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}>
                                ★
                              </span>
                            }
                          >
                            {fact}
                          </ListItem>
                        ))}
                      </div>
                    </div>
                  </CollapsibleCard>
                )}

                {/* Physics, Experiment, Frontier cards in a grid */}
                <div className={cn(
                  "grid gap-3",
                  isCompact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3 gap-4"
                )}>
                {/* Physics principle */}
                <CollapsibleCard
                  title={t('course.cards.physics')}
                  icon={<PhysicsIcon />}
                  color="cyan"
                  isExpanded={expandedCards.physics}
                  onToggle={() => toggleCard('physics')}
                >
                  <div className="space-y-4">
                    {demoInfo.diagram && (
                      <div
                        className={cn(
                          'rounded-lg p-3 border',
                          theme === 'dark'
                            ? 'bg-slate-900/50 border-slate-700/50'
                            : 'bg-gray-50 border-gray-200'
                        )}
                      >
                        {demoInfo.diagram}
                      </div>
                    )}
                    <p
                      className={cn(
                        'text-sm leading-relaxed',
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                      )}
                    >
                      {demoInfo.physics.principle}
                    </p>
                    {demoInfo.physics.formula && (
                      <div
                        className={cn(
                          'font-mono px-3 py-2 rounded-lg text-center text-sm border',
                          theme === 'dark'
                            ? 'text-cyan-400 bg-slate-900/70 border-cyan-400/20'
                            : 'text-cyan-700 bg-cyan-50 border-cyan-200'
                        )}
                      >
                        {demoInfo.physics.formula}
                      </div>
                    )}
                    <div className="space-y-2">
                      {demoInfo.physics.details.map((detail, i) => (
                        <ListItem key={i} icon="•">
                          {detail}
                        </ListItem>
                      ))}
                    </div>
                  </div>
                </CollapsibleCard>

                {/* Experimental application */}
                <CollapsibleCard
                  title={t('course.cards.experiment')}
                  icon={<ExperimentIcon />}
                  color="green"
                  isExpanded={expandedCards.experiment}
                  onToggle={() => toggleCard('experiment')}
                >
                  <div className="space-y-4">
                    <div
                      className={cn(
                        'rounded-lg px-3 py-2 border',
                        theme === 'dark'
                          ? 'bg-green-400/10 border-green-400/20'
                          : 'bg-green-50 border-green-200'
                      )}
                    >
                      <h5
                        className={cn(
                          'font-semibold text-sm',
                          theme === 'dark' ? 'text-green-400' : 'text-green-700'
                        )}
                      >
                        {demoInfo.experiment.title}
                      </h5>
                      <p
                        className={cn(
                          'text-xs mt-1',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                        )}
                      >
                        {demoInfo.experiment.example}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {demoInfo.experiment.details.map((detail, i) => (
                        <ListItem
                          key={i}
                          icon={
                            <span className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
                              ✓
                            </span>
                          }
                        >
                          {detail}
                        </ListItem>
                      ))}
                    </div>
                  </div>
                </CollapsibleCard>

                {/* Frontier application */}
                <CollapsibleCard
                  title={t('course.cards.frontier')}
                  icon={<FrontierIcon />}
                  color="purple"
                  isExpanded={expandedCards.frontier}
                  onToggle={() => toggleCard('frontier')}
                >
                  <div className="space-y-4">
                    <div
                      className={cn(
                        'rounded-lg px-3 py-2 border',
                        theme === 'dark'
                          ? 'bg-purple-400/10 border-purple-400/20'
                          : 'bg-purple-50 border-purple-200'
                      )}
                    >
                      <h5
                        className={cn(
                          'font-semibold text-sm',
                          theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
                        )}
                      >
                        {demoInfo.frontier.title}
                      </h5>
                      <p
                        className={cn(
                          'text-xs mt-1',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                        )}
                      >
                        {demoInfo.frontier.example}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {demoInfo.frontier.details.map((detail, i) => (
                        <ListItem
                          key={i}
                          icon={
                            <span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}>
                              →
                            </span>
                          }
                        >
                          {detail}
                        </ListItem>
                      ))}
                    </div>
                  </div>
                </CollapsibleCard>
                </div>

                {/* DIY card - full width, at bottom */}
                {demoInfo.diy && (
                  <CollapsibleCard
                    title={t('course.cards.diy')}
                    icon={<DIYIcon />}
                    color="yellow"
                    isExpanded={expandedCards.diy}
                    onToggle={() => toggleCard('diy')}
                  >
                    <div className="space-y-4">
                      {/* Materials list */}
                      <div
                        className={cn(
                          'rounded-lg px-4 py-3 border',
                          theme === 'dark'
                            ? 'bg-yellow-400/5 border-yellow-400/20'
                            : 'bg-yellow-50 border-yellow-200'
                        )}
                      >
                        <h5
                          className={cn(
                            'font-semibold text-sm mb-2 flex items-center gap-2',
                            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                          )}
                        >
                          📦 Materials
                        </h5>
                        <ul className="space-y-1">
                          {demoInfo.diy.materials.map((material, i) => (
                            <li
                              key={i}
                              className={cn(
                                'text-sm flex items-center gap-2',
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              )}
                            >
                              <span className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}>•</span>
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Steps */}
                      <div>
                        <h5
                          className={cn(
                            'font-semibold text-sm mb-2 flex items-center gap-2',
                            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                          )}
                        >
                          📝 Steps
                        </h5>
                        <ol className="space-y-2">
                          {demoInfo.diy.steps.map((step, i) => (
                            <li
                              key={i}
                              className={cn(
                                'text-sm flex items-start gap-3',
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              )}
                            >
                              <span
                                className={cn(
                                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                                  theme === 'dark'
                                    ? 'bg-yellow-400/20 text-yellow-400'
                                    : 'bg-yellow-200 text-yellow-800'
                                )}
                              >
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Observation */}
                      <div
                        className={cn(
                          'rounded-lg px-4 py-3 border-2 border-dashed',
                          theme === 'dark'
                            ? 'bg-yellow-400/5 border-yellow-400/40'
                            : 'bg-yellow-100/50 border-yellow-400'
                        )}
                      >
                        <h5
                          className={cn(
                            'font-semibold text-sm mb-1 flex items-center gap-2',
                            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                          )}
                        >
                          💡 What you'll observe
                        </h5>
                        <p className={cn(
                          'text-sm',
                          theme === 'dark' ? 'text-yellow-200' : 'text-yellow-900'
                        )}>
                          {demoInfo.diy.observation}
                        </p>
                      </div>
                    </div>
                  </CollapsibleCard>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
