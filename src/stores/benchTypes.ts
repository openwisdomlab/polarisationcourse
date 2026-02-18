/**
 * Optical Bench Types (光学工作台类型定义)
 *
 * Extracted from opticalBenchStore.ts to separate type definitions
 * from state management logic.
 */

import type { LegacyComplex, LegacyJonesVector } from '@/core/physics/bridge'
import type { NonIdealPolarizerParams } from '@/core/physics/constants'
import { IDEAL_POLARIZER, TYPICAL_POLARIZER, LOW_QUALITY_POLARIZER } from '@/core/physics/constants'

// ============================================
// Component Types
// ============================================

export type BenchComponentType = 'emitter' | 'polarizer' | 'waveplate' | 'mirror' | 'splitter' | 'sensor' | 'lens'

export interface Position {
  x: number
  y: number
}

/** Device quality level for non-ideal component simulation */
export type DeviceQuality = 'ideal' | 'typical' | 'low-quality'

/** Non-ideal device parameters by quality level */
export const POLARIZER_QUALITY_PARAMS: Record<DeviceQuality, NonIdealPolarizerParams> = {
  'ideal': IDEAL_POLARIZER,
  'typical': TYPICAL_POLARIZER,
  'low-quality': LOW_QUALITY_POLARIZER,
}

export interface BenchComponent {
  id: string
  type: BenchComponentType
  x: number
  y: number
  rotation: number
  properties: {
    polarization?: number
    angle?: number
    retardation?: number
    reflectAngle?: number
    splitType?: 'pbs' | 'npbs' | 'calcite'
    focalLength?: number
    label?: string
    deviceQuality?: DeviceQuality
    [key: string]: number | string | boolean | undefined
  }
}

// ============================================
// Light Types
// ============================================

export interface LightRay {
  id: string
  origin: Position
  direction: Position
  polarization: number
  jonesVector: LegacyJonesVector
  intensity: number
  phase: number
  wavelength: number
  sourceId: string
}

export interface LightSegment {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  polarization: number
  jonesVector: LegacyJonesVector
  intensity: number
  phase: number
  rayId: string
  polarizationType: 'linear' | 'circular' | 'elliptical'
  handedness: 'right' | 'left' | 'none'
  beamWidth: number
  beamDivergence: number
  ellipticity: number
}

// ============================================
// Design & Experiment Types
// ============================================

export interface SavedDesign {
  id: string
  name: string
  description?: string
  components: BenchComponent[]
  createdAt: number
  updatedAt: number
  thumbnail?: string
}

export interface ClassicExperiment {
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

export interface Challenge {
  id: string
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  goal: { en: string; zh: string }
  availableComponents: BenchComponentType[]
  initialSetup: BenchComponent[]
  successCondition: {
    type: 'intensity' | 'polarization' | 'both'
    targetSensorId: string
    minIntensity?: number
    maxIntensity?: number
    targetPolarization?: number
    tolerance?: number
  }
  hints: { en: string[]; zh: string[] }
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
}

export interface TutorialStep {
  id: string
  target?: string
  titleEn: string
  titleZh: string
  contentEn: string
  contentZh: string
  action?: 'click' | 'drag' | 'rotate' | 'observe'
  highlightComponent?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export interface Tutorial {
  id: string
  nameEn: string
  nameZh: string
  steps: TutorialStep[]
}

// ============================================
// Sensor Reading Type
// ============================================

export interface SensorReading {
  intensity: number
  polarization: number
  jonesVector: LegacyJonesVector
  polarizationType: 'linear' | 'circular' | 'elliptical'
  handedness: 'right' | 'left' | 'none'
}

// ============================================
// Re-export for backward compatibility
// ============================================

/** @deprecated Use LegacyComplex from '@/core/physics/bridge' */
export type Complex = LegacyComplex
/** @deprecated Use LegacyJonesVector from '@/core/physics/bridge' */
export type JonesVector = LegacyJonesVector
