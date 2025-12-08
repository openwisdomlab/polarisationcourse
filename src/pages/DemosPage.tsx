/**
 * Demos Page - Interactive physics demonstrations for 5 units + Optical Basics
 * Enhanced with i18n, theme support, and improved interactivity indicators
 */
import { useState, Suspense, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { InfoCard, ListItem } from '@/components/demos/DemoControls'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Home, Gamepad2, BookOpen, Box, BarChart2 } from 'lucide-react'

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
interface DemoInfo {
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
  diagram?: ReactNode
  visualType: '2D' | '3D' // Indicates whether demo uses 2D or 3D visualization
}

// Demo info data - using i18n keys
const getDemoInfo = (t: (key: string) => string): Record<string, DemoInfo> => ({
  'light-wave': {
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
    diagram: <LightWaveDiagram />,
    visualType: '2D',
  },
  'polarization-intro': {
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
    visualType: '2D',
  },
  'polarization-types': {
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
    diagram: <PolarizationStateDiagram />,
    visualType: '2D',
  },
  'polarization-state': {
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
    diagram: <PolarizationStateDiagram />,
    visualType: '3D',
  },
  malus: {
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
    diagram: <MalusDiagram />,
    visualType: '2D',
  },
  birefringence: {
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
    diagram: <BirefringenceDiagram />,
    visualType: '3D',
  },
  waveplate: {
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
    diagram: <WaveplateDiagram />,
    visualType: '3D',
  },
  fresnel: {
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
    diagram: <FresnelDiagram />,
    visualType: '2D',
  },
  brewster: {
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
    diagram: <BrewsterDiagram />,
    visualType: '2D',
  },
  chromatic: {
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
    visualType: '2D',
  },
  'optical-rotation': {
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
    visualType: '2D',
  },
  'mie-scattering': {
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
    diagram: <ScatteringDiagram />,
    visualType: '2D',
  },
  rayleigh: {
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
    diagram: <ScatteringDiagram />,
    visualType: '2D',
  },
  stokes: {
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
    diagram: <StokesDiagram />,
    visualType: '3D',
  },
  mueller: {
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

export function DemosPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [activeDemo, setActiveDemo] = useState<string>('light-wave')

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
          'fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between backdrop-blur-sm',
          theme === 'dark'
            ? 'bg-slate-900/95 border-b border-cyan-400/20'
            : 'bg-white/95 border-b border-cyan-500/20'
        )}
      >
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={cn(
              'flex items-center gap-2 transition-colors',
              theme === 'dark'
                ? 'text-cyan-400 hover:text-cyan-300'
                : 'text-cyan-600 hover:text-cyan-500'
            )}
          >
            <Home className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⟡</span>
            <span
              className={cn(
                'text-xl font-bold',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )}
            >
              PolarCraft
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-4">
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
          <LanguageThemeSwitcher />
        </nav>
      </header>

      {/* Main Container */}
      <div className="flex pt-[60px]">
        {/* Sidebar */}
        <aside
          className={cn(
            'w-64 fixed left-0 top-[60px] bottom-0 border-r overflow-y-auto',
            theme === 'dark'
              ? 'bg-slate-900/90 border-cyan-400/10'
              : 'bg-white/90 border-cyan-200'
          )}
        >
          <div className="p-4">
            {UNITS.map((unit) => (
              <div key={unit.num} className="mb-5">
                <h3
                  className={cn(
                    'text-[10px] uppercase tracking-wider mb-2 px-2 font-semibold flex items-center gap-2',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}
                >
                  {unit.num === 0 ? (
                    <span className="text-yellow-400">★</span>
                  ) : (
                    <span className={`text-${unit.color}-400`}>●</span>
                  )}
                  {unit.num === 0 ? t('basics.title') : `${t('game.level')} ${unit.num}`} ·{' '}
                  {t(unit.titleKey)}
                </h3>
                <ul className="space-y-0.5">
                  {DEMOS.filter((d) => d.unit === unit.num).map((demo) => (
                    <li key={demo.id}>
                      <button
                        onClick={() => setActiveDemo(demo.id)}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all',
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
                          {DEMOS.filter((d) => d.unit === demo.unit).indexOf(demo) + 1}
                        </span>
                        <span className="truncate flex-1">{t(demo.titleKey)}</span>
                        <VisualTypeBadge type={demo.visualType} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Interaction guide */}
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
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
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
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6">
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
              <p className={theme === 'dark' ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>
                {t(currentDemo?.descriptionKey || '')}
              </p>
            </div>

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

            {/* Info cards - three column layout */}
            {demoInfo && (
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Physics principle */}
                <InfoCard title={t('course.cards.physics')} icon={<PhysicsIcon />} color="cyan">
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
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
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
                </InfoCard>

                {/* Experimental application */}
                <InfoCard title={t('course.cards.experiment')} icon={<ExperimentIcon />} color="green">
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
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
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
                </InfoCard>

                {/* Frontier application */}
                <InfoCard title={t('course.cards.frontier')} icon={<FrontierIcon />} color="purple">
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
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
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
                </InfoCard>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
