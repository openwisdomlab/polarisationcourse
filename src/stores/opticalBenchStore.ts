/**
 * Optical Bench Store - 光学工作台状态管理
 *
 * Zustand store for managing optical bench state with:
 * - Component management (add, update, delete, move)
 * - Undo/redo history
 * - Simulation state
 * - Design save/load
 *
 * Physics Engine: Jones Calculus for accurate polarization simulation
 * - Jones vectors represent full polarization state (linear, circular, elliptical)
 * - Jones matrices describe optical element transformations
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import {
  type Complex,
  type JonesVector,
  polarizationToJonesVector,
  jonesVectorToPolarization,
  jonesIntensity,
  analyzePolarization,
} from '@/core/JonesCalculus'

// ============================================
// Types
// ============================================

// Re-export Jones types for convenience
export type { Complex, JonesVector }

export type BenchComponentType = 'emitter' | 'polarizer' | 'waveplate' | 'mirror' | 'splitter' | 'sensor' | 'lens'

export interface Position {
  x: number
  y: number
}

export interface BenchComponent {
  id: string
  type: BenchComponentType
  x: number
  y: number
  rotation: number
  properties: {
    polarization?: number      // For emitter: -1 (unpolarized) or 0-180
    angle?: number             // For polarizer: transmission axis angle
    retardation?: number       // For waveplate: 90 (λ/4) or 180 (λ/2)
    reflectAngle?: number      // For mirror: reflection angle
    splitType?: 'pbs' | 'npbs' | 'calcite'  // For splitter
    focalLength?: number       // For lens
    label?: string             // Custom label
    [key: string]: number | string | boolean | undefined
  }
}

export interface LightRay {
  id: string
  origin: Position
  direction: Position  // Normalized direction vector
  polarization: number  // Legacy: angle in degrees (0-180), kept for backward compatibility
  jonesVector: JonesVector  // Full polarization state as Jones vector [Ex, Ey]
  intensity: number  // Derived from |Ex|² + |Ey|², kept for quick access
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
  polarization: number  // Legacy: angle in degrees, derived from jonesVector
  jonesVector: JonesVector  // Full polarization state
  intensity: number  // Derived from jonesVector: |Ex|² + |Ey|²
  phase: number
  rayId: string
  // Polarization analysis (derived from jonesVector)
  polarizationType: 'linear' | 'circular' | 'elliptical'
  handedness: 'right' | 'left' | 'none'
}

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
// Store State Interface
// ============================================

interface OpticalBenchState {
  // Components
  components: BenchComponent[]
  selectedComponentId: string | null
  hoveredComponentId: string | null

  // Simulation
  isSimulating: boolean
  showPolarization: boolean
  lightSegments: LightSegment[]
  sensorReadings: Map<string, {
    intensity: number
    polarization: number
    jonesVector: JonesVector
    polarizationType: 'linear' | 'circular' | 'elliptical'
    handedness: 'right' | 'left' | 'none'
  }>

  // History for undo/redo
  history: BenchComponent[][]
  historyIndex: number
  maxHistorySize: number

  // Current experiment/challenge
  currentExperiment: ClassicExperiment | null
  currentChallenge: Challenge | null
  challengeCompleted: boolean

  // Tutorial
  currentTutorial: Tutorial | null
  tutorialStepIndex: number

  // Saved designs
  savedDesigns: SavedDesign[]
  currentDesignId: string | null
  hasUnsavedChanges: boolean

  // UI state
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
  canvasSize: { width: number; height: number }
  showLabels: boolean
  showAnnotations: boolean

  // Drag state
  isDragging: boolean
  dragOffset: Position | null

  // Formula display
  showFormulas: boolean
  currentFormulas: string[]
}

// ============================================
// Store Actions Interface
// ============================================

interface OpticalBenchActions {
  // Component management
  addComponent: (type: BenchComponentType, position?: Position) => void
  updateComponent: (id: string, updates: Partial<BenchComponent>) => void
  moveComponent: (id: string, position: Position) => void
  rotateComponent: (id: string, deltaAngle: number) => void
  deleteComponent: (id: string) => void
  deleteSelectedComponent: () => void
  duplicateComponent: (id: string) => void
  clearAllComponents: () => void

  // Selection
  selectComponent: (id: string | null) => void
  setHoveredComponent: (id: string | null) => void

  // History
  undo: () => void
  redo: () => void
  saveToHistory: () => void

  // Simulation
  setSimulating: (isSimulating: boolean) => void
  toggleSimulating: () => void
  setShowPolarization: (show: boolean) => void
  toggleShowPolarization: () => void
  calculateLightPaths: () => void

  // Experiments & Challenges
  loadExperiment: (experiment: ClassicExperiment) => void
  clearExperiment: () => void
  loadChallenge: (challenge: Challenge) => void
  clearChallenge: () => void
  checkChallengeCompletion: () => boolean

  // Tutorial
  startTutorial: (tutorial: Tutorial) => void
  nextTutorialStep: () => void
  prevTutorialStep: () => void
  endTutorial: () => void

  // Save/Load
  saveDesign: (name: string, description?: string) => string
  loadDesign: (id: string) => void
  deleteDesign: (id: string) => void
  exportDesign: () => string
  importDesign: (json: string) => boolean
  loadSavedDesigns: () => void

  // UI
  setShowGrid: (show: boolean) => void
  setSnapToGrid: (snap: boolean) => void
  setGridSize: (size: number) => void
  setShowFormulas: (show: boolean) => void
  setShowLabels: (show: boolean) => void
  toggleShowLabels: () => void
  setShowAnnotations: (show: boolean) => void
  toggleShowAnnotations: () => void

  // Drag
  startDrag: (componentId: string, offset: Position) => void
  updateDrag: (position: Position) => void
  endDrag: () => void

  // Reset
  reset: () => void
}

// ============================================
// Helper Functions
// ============================================

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const snapToGridValue = (value: number, gridSize: number, enabled: boolean): number => {
  if (!enabled) return value
  return Math.round(value / gridSize) * gridSize
}

const normalizeAngle = (angle: number): number => {
  let normalized = angle % 360
  if (normalized < 0) normalized += 360
  return normalized
}

// Light physics calculations
const calculateMalusLaw = (intensity: number, angleDiff: number): number => {
  const radians = (angleDiff * Math.PI) / 180
  return intensity * Math.pow(Math.cos(radians), 2)
}

const getPolarizationColor = (angle: number): string => {
  const normalizedAngle = normalizeAngle(angle)
  if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff4444' // 0° - Red
  if (normalizedAngle < 67.5) return '#ffaa00' // 45° - Orange
  if (normalizedAngle < 112.5) return '#44ff44' // 90° - Green
  return '#4444ff' // 135° - Blue
}

const reflectDirection = (direction: Position, normal: Position): Position => {
  // r = d - 2(d·n)n
  const dot = direction.x * normal.x + direction.y * normal.y
  return {
    x: direction.x - 2 * dot * normal.x,
    y: direction.y - 2 * dot * normal.y
  }
}

const rotateVector = (v: Position, angleDeg: number): Position => {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: v.x * Math.cos(rad) - v.y * Math.sin(rad),
    y: v.x * Math.sin(rad) + v.y * Math.cos(rad)
  }
}

// ============================================
// Initial State
// ============================================

const STORAGE_KEY = 'optical-bench-designs'
const MAX_HISTORY = 50

const initialState: OpticalBenchState = {
  components: [],
  selectedComponentId: null,
  hoveredComponentId: null,

  isSimulating: false,
  showPolarization: true,
  lightSegments: [],
  sensorReadings: new Map(),

  history: [[]],
  historyIndex: 0,
  maxHistorySize: MAX_HISTORY,

  currentExperiment: null,
  currentChallenge: null,
  challengeCompleted: false,

  currentTutorial: null,
  tutorialStepIndex: 0,

  savedDesigns: [],
  currentDesignId: null,
  hasUnsavedChanges: false,

  showGrid: true,
  snapToGrid: true,
  gridSize: 20,
  canvasSize: { width: 800, height: 400 },
  showLabels: true,
  showAnnotations: true,

  isDragging: false,
  dragOffset: null,

  showFormulas: true,
  currentFormulas: [],
}

// ============================================
// Store Creation
// ============================================

export const useOpticalBenchStore = create<OpticalBenchState & OpticalBenchActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // ========== Component Management ==========

    addComponent: (type: BenchComponentType, position?: Position) => {
      const state = get()
      const defaultX = position?.x ?? 300 + Math.random() * 100
      const defaultY = position?.y ?? 180 + Math.random() * 40

      const newComponent: BenchComponent = {
        id: generateId(),
        type,
        x: snapToGridValue(defaultX, state.gridSize, state.snapToGrid),
        y: snapToGridValue(defaultY, state.gridSize, state.snapToGrid),
        rotation: 0,
        properties: getDefaultProperties(type),
      }

      set((prev: OpticalBenchState) => ({
        components: [...prev.components, newComponent],
        selectedComponentId: newComponent.id,
        hasUnsavedChanges: true,
      }))

      get().saveToHistory()
    },

    updateComponent: (id: string, updates: Partial<BenchComponent>) => {
      set((prev: OpticalBenchState) => ({
        components: prev.components.map((c: BenchComponent) =>
          c.id === id ? { ...c, ...updates } : c
        ),
        hasUnsavedChanges: true,
      }))
      get().saveToHistory()
    },

    moveComponent: (id: string, position: Position) => {
      const state = get()
      set((prev: OpticalBenchState) => ({
        components: prev.components.map((c: BenchComponent) =>
          c.id === id ? {
            ...c,
            x: snapToGridValue(position.x, state.gridSize, state.snapToGrid),
            y: snapToGridValue(position.y, state.gridSize, state.snapToGrid),
          } : c
        ),
        hasUnsavedChanges: true,
      }))
    },

    rotateComponent: (id: string, deltaAngle: number) => {
      set((prev: OpticalBenchState) => ({
        components: prev.components.map((c: BenchComponent) =>
          c.id === id ? { ...c, rotation: normalizeAngle(c.rotation + deltaAngle) } : c
        ),
        hasUnsavedChanges: true,
      }))
      get().saveToHistory()
    },

    deleteComponent: (id: string) => {
      set((prev: OpticalBenchState) => ({
        components: prev.components.filter((c: BenchComponent) => c.id !== id),
        selectedComponentId: prev.selectedComponentId === id ? null : prev.selectedComponentId,
        hasUnsavedChanges: true,
      }))
      get().saveToHistory()
    },

    deleteSelectedComponent: () => {
      const state = get()
      if (state.selectedComponentId) {
        get().deleteComponent(state.selectedComponentId)
      }
    },

    duplicateComponent: (id: string) => {
      const state = get()
      const component = state.components.find((c: BenchComponent) => c.id === id)
      if (component) {
        const newComponent: BenchComponent = {
          ...component,
          id: generateId(),
          x: component.x + 40,
          y: component.y + 40,
        }
        set((prev: OpticalBenchState) => ({
          components: [...prev.components, newComponent],
          selectedComponentId: newComponent.id,
          hasUnsavedChanges: true,
        }))
        get().saveToHistory()
      }
    },

    clearAllComponents: () => {
      set({
        components: [],
        selectedComponentId: null,
        isSimulating: false,
        lightSegments: [],
        sensorReadings: new Map(),
        currentExperiment: null,
        currentChallenge: null,
        challengeCompleted: false,
        hasUnsavedChanges: true,
      })
      get().saveToHistory()
    },

    // ========== Selection ==========

    selectComponent: (id: string | null) => {
      set({ selectedComponentId: id })
    },

    setHoveredComponent: (id: string | null) => {
      set({ hoveredComponentId: id })
    },

    // ========== History ==========

    saveToHistory: () => {
      set((prev: OpticalBenchState) => {
        const newHistory = prev.history.slice(0, prev.historyIndex + 1)
        newHistory.push([...prev.components])

        // Limit history size
        if (newHistory.length > prev.maxHistorySize) {
          newHistory.shift()
        }

        return {
          history: newHistory,
          historyIndex: newHistory.length - 1,
        }
      })
    },

    undo: () => {
      set((prev: OpticalBenchState) => {
        if (prev.historyIndex <= 0) return prev
        const newIndex = prev.historyIndex - 1
        return {
          components: [...prev.history[newIndex]],
          historyIndex: newIndex,
          selectedComponentId: null,
          hasUnsavedChanges: true,
        }
      })
    },

    redo: () => {
      set((prev: OpticalBenchState) => {
        if (prev.historyIndex >= prev.history.length - 1) return prev
        const newIndex = prev.historyIndex + 1
        return {
          components: [...prev.history[newIndex]],
          historyIndex: newIndex,
          selectedComponentId: null,
          hasUnsavedChanges: true,
        }
      })
    },

    // ========== Simulation ==========

    setSimulating: (isSimulating: boolean) => {
      set({ isSimulating })
      if (isSimulating) {
        get().calculateLightPaths()
      }
    },

    toggleSimulating: () => {
      const state = get()
      get().setSimulating(!state.isSimulating)
    },

    setShowPolarization: (show: boolean) => {
      set({ showPolarization: show })
    },

    toggleShowPolarization: () => {
      set((prev: OpticalBenchState) => ({ showPolarization: !prev.showPolarization }))
    },

    calculateLightPaths: () => {
      const state = get()
      const segments: LightSegment[] = []
      const readings = new Map<string, {
        intensity: number
        polarization: number
        jonesVector: JonesVector
        polarizationType: 'linear' | 'circular' | 'elliptical'
        handedness: 'right' | 'left' | 'none'
      }>()
      const formulas: string[] = []

      // Find all emitters
      const emitters = state.components.filter((c: BenchComponent) => c.type === 'emitter')

      emitters.forEach((emitter: BenchComponent) => {
        const initialPolarization = emitter.properties.polarization ?? 0
        const isUnpolarized = initialPolarization === -1

        // Trace light from this emitter
        const rays = traceLightRays(
          emitter,
          state.components,
          isUnpolarized ? 0 : initialPolarization,
          100, // Initial intensity
          formulas
        )

        segments.push(...rays)

        // Update sensor readings with full Jones vector information
        rays.forEach((seg: LightSegment) => {
          const sensor = state.components.find(
            (c: BenchComponent) => c.type === 'sensor' &&
            Math.abs(c.x - seg.x2) < 40 &&
            Math.abs(c.y - seg.y2) < 40
          )
          if (sensor) {
            readings.set(sensor.id, {
              intensity: seg.intensity,
              polarization: seg.polarization,
              jonesVector: seg.jonesVector,
              polarizationType: seg.polarizationType,
              handedness: seg.handedness,
            })
          }
        })
      })

      set({
        lightSegments: segments,
        sensorReadings: readings,
        currentFormulas: formulas,
      })

      // Check challenge completion
      if (state.currentChallenge) {
        get().checkChallengeCompletion()
      }
    },

    // ========== Experiments & Challenges ==========

    loadExperiment: (experiment: ClassicExperiment) => {
      set({
        components: experiment.components.map((c: BenchComponent) => ({ ...c, id: generateId() })),
        selectedComponentId: null,
        isSimulating: false,
        lightSegments: [],
        sensorReadings: new Map(),
        currentExperiment: experiment,
        currentChallenge: null,
        challengeCompleted: false,
        hasUnsavedChanges: false,
      })
      get().saveToHistory()
    },

    clearExperiment: () => {
      set({ currentExperiment: null })
    },

    loadChallenge: (challenge: Challenge) => {
      set({
        components: challenge.initialSetup.map((c: BenchComponent) => ({ ...c, id: generateId() })),
        selectedComponentId: null,
        isSimulating: false,
        lightSegments: [],
        sensorReadings: new Map(),
        currentExperiment: null,
        currentChallenge: challenge,
        challengeCompleted: false,
        hasUnsavedChanges: false,
      })
      get().saveToHistory()
    },

    clearChallenge: () => {
      set({ currentChallenge: null, challengeCompleted: false })
    },

    checkChallengeCompletion: () => {
      const state = get()
      const challenge = state.currentChallenge
      if (!challenge) return false

      const { successCondition } = challenge
      const reading = state.sensorReadings.get(successCondition.targetSensorId)

      if (!reading) return false

      let completed = true
      const tolerance = successCondition.tolerance ?? 5

      if (successCondition.type === 'intensity' || successCondition.type === 'both') {
        if (successCondition.minIntensity !== undefined) {
          completed = completed && reading.intensity >= successCondition.minIntensity
        }
        if (successCondition.maxIntensity !== undefined) {
          completed = completed && reading.intensity <= successCondition.maxIntensity
        }
      }

      if (successCondition.type === 'polarization' || successCondition.type === 'both') {
        if (successCondition.targetPolarization !== undefined) {
          const diff = Math.abs(reading.polarization - successCondition.targetPolarization)
          completed = completed && (diff <= tolerance || diff >= 180 - tolerance)
        }
      }

      set({ challengeCompleted: completed })
      return completed
    },

    // ========== Tutorial ==========

    startTutorial: (tutorial: Tutorial) => {
      set({
        currentTutorial: tutorial,
        tutorialStepIndex: 0,
      })
    },

    nextTutorialStep: () => {
      set((prev: OpticalBenchState) => {
        if (!prev.currentTutorial) return prev
        const nextIndex = prev.tutorialStepIndex + 1
        if (nextIndex >= prev.currentTutorial.steps.length) {
          return { currentTutorial: null, tutorialStepIndex: 0 }
        }
        return { tutorialStepIndex: nextIndex }
      })
    },

    prevTutorialStep: () => {
      set((prev: OpticalBenchState) => ({
        tutorialStepIndex: Math.max(0, prev.tutorialStepIndex - 1),
      }))
    },

    endTutorial: () => {
      set({ currentTutorial: null, tutorialStepIndex: 0 })
    },

    // ========== Save/Load ==========

    saveDesign: (name: string, description?: string) => {
      const state = get()
      const id = state.currentDesignId || generateId()
      const now = Date.now()

      const design: SavedDesign = {
        id,
        name,
        description,
        components: [...state.components],
        createdAt: state.savedDesigns.find((d: SavedDesign) => d.id === id)?.createdAt || now,
        updatedAt: now,
      }

      set((prev: OpticalBenchState) => {
        const designs = prev.savedDesigns.filter((d: SavedDesign) => d.id !== id)
        designs.push(design)

        // Persist to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
        } catch (e) {
          console.error('Failed to save designs:', e)
        }

        return {
          savedDesigns: designs,
          currentDesignId: id,
          hasUnsavedChanges: false,
        }
      })

      return id
    },

    loadDesign: (id: string) => {
      const state = get()
      const design = state.savedDesigns.find((d: SavedDesign) => d.id === id)
      if (!design) return

      set({
        components: [...design.components],
        selectedComponentId: null,
        isSimulating: false,
        lightSegments: [],
        sensorReadings: new Map(),
        currentExperiment: null,
        currentChallenge: null,
        currentDesignId: id,
        hasUnsavedChanges: false,
      })
      get().saveToHistory()
    },

    deleteDesign: (id: string) => {
      set((prev: OpticalBenchState) => {
        const designs = prev.savedDesigns.filter((d: SavedDesign) => d.id !== id)

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
        } catch (e) {
          console.error('Failed to delete design:', e)
        }

        return {
          savedDesigns: designs,
          currentDesignId: prev.currentDesignId === id ? null : prev.currentDesignId,
        }
      })
    },

    exportDesign: () => {
      const state = get()
      const exportData = {
        version: 1,
        name: 'Optical Bench Design',
        components: state.components,
        exportedAt: new Date().toISOString(),
      }
      return JSON.stringify(exportData, null, 2)
    },

    importDesign: (json: string) => {
      try {
        const data = JSON.parse(json)
        if (!data.components || !Array.isArray(data.components)) {
          return false
        }

        set({
          components: data.components.map((c: BenchComponent) => ({
            ...c,
            id: generateId(),
          })),
          selectedComponentId: null,
          isSimulating: false,
          currentDesignId: null,
          hasUnsavedChanges: true,
        })
        get().saveToHistory()
        return true
      } catch (e) {
        console.error('Failed to import design:', e)
        return false
      }
    },

    loadSavedDesigns: () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const designs = JSON.parse(stored) as SavedDesign[]
          set({ savedDesigns: designs })
        }
      } catch (e) {
        console.error('Failed to load saved designs:', e)
      }
    },

    // ========== UI ==========

    setShowGrid: (show: boolean) => set({ showGrid: show }),
    setSnapToGrid: (snap: boolean) => set({ snapToGrid: snap }),
    setGridSize: (size: number) => set({ gridSize: size }),
    setShowFormulas: (show: boolean) => set({ showFormulas: show }),
    setShowLabels: (show: boolean) => set({ showLabels: show }),
    toggleShowLabels: () => set((prev: OpticalBenchState) => ({ showLabels: !prev.showLabels })),
    setShowAnnotations: (show: boolean) => set({ showAnnotations: show }),
    toggleShowAnnotations: () => set((prev: OpticalBenchState) => ({ showAnnotations: !prev.showAnnotations })),

    // ========== Drag ==========

    startDrag: (componentId: string, offset: Position) => {
      set({
        isDragging: true,
        dragOffset: offset,
        selectedComponentId: componentId,
      })
    },

    updateDrag: (position: Position) => {
      const state = get()
      if (!state.isDragging || !state.selectedComponentId || !state.dragOffset) return

      get().moveComponent(state.selectedComponentId, {
        x: position.x - state.dragOffset.x,
        y: position.y - state.dragOffset.y,
      })
    },

    endDrag: () => {
      set({ isDragging: false, dragOffset: null })
      get().saveToHistory()
    },

    // ========== Reset ==========

    reset: () => {
      set({
        ...initialState,
        savedDesigns: get().savedDesigns, // Preserve saved designs
      })
    },
  }))
)

// ============================================
// Helper: Default Properties by Type
// ============================================

function getDefaultProperties(type: BenchComponentType): BenchComponent['properties'] {
  switch (type) {
    case 'emitter':
      return { polarization: 0 }
    case 'polarizer':
      return { angle: 0 }
    case 'waveplate':
      return { retardation: 90 } // λ/4 by default
    case 'mirror':
      return { reflectAngle: 45 }
    case 'splitter':
      return { splitType: 'pbs' }
    case 'sensor':
      return {}
    case 'lens':
      return { focalLength: 50 }
    default:
      return {}
  }
}

// ============================================
// Helper: Light Ray Tracing
// ============================================

function traceLightRays(
  emitter: BenchComponent,
  allComponents: BenchComponent[],
  initialPolarization: number,
  initialIntensity: number,
  formulas: string[]
): LightSegment[] {
  const segments: LightSegment[] = []
  const maxBounces = 10
  const canvasWidth = 800
  const intensityThreshold = 1 // Stop tracing if intensity drops below 1%

  // Initial ray direction based on emitter rotation
  let direction = rotateVector({ x: 1, y: 0 }, emitter.rotation)
  let currentPos = { x: emitter.x, y: emitter.y }

  // Initialize Jones vector from polarization angle
  // Scale by sqrt(intensity/100) to normalize intensity to 100%
  let currentJonesVector = polarizationToJonesVector(
    initialPolarization,
    initialIntensity / 100
  )
  let currentIntensity = jonesIntensity(currentJonesVector) * 100
  let currentPolarization = jonesVectorToPolarization(currentJonesVector)
  let currentPhase = 1

  // Analyze initial polarization state
  let polarizationAnalysis = analyzePolarization(currentJonesVector)

  // Sort components by distance in ray direction
  const sortedComponents = allComponents
    .filter(c => c.id !== emitter.id)
    .sort((a, b) => {
      const distA = (a.x - currentPos.x) * direction.x + (a.y - currentPos.y) * direction.y
      const distB = (b.x - currentPos.x) * direction.x + (b.y - currentPos.y) * direction.y
      return distA - distB
    })

  for (let bounce = 0; bounce < maxBounces && currentIntensity > intensityThreshold; bounce++) {
    // Find next component in path
    const nextComponent = sortedComponents.find(comp => {
      const dx = comp.x - currentPos.x
      const dy = comp.y - currentPos.y
      const dot = dx * direction.x + dy * direction.y
      const perpDist = Math.abs(dx * direction.y - dy * direction.x)
      return dot > 10 && perpDist < 50
    })

    let endX: number
    let endY: number

    if (nextComponent) {
      endX = nextComponent.x
      endY = nextComponent.y

      // Add segment to next component with full Jones vector information
      segments.push({
        id: `${emitter.id}-seg-${bounce}`,
        x1: currentPos.x + direction.x * 30,
        y1: currentPos.y + direction.y * 30,
        x2: endX - direction.x * 30,
        y2: endY - direction.y * 30,
        polarization: currentPolarization,
        jonesVector: currentJonesVector,
        intensity: currentIntensity,
        phase: currentPhase,
        rayId: emitter.id,
        polarizationType: polarizationAnalysis.type,
        handedness: polarizationAnalysis.handedness,
      })

      // Process component effect
      // NOTE: Phase 1 - Currently using scalar calculations, syncing to Jones vector
      // Phase 3 will replace this with proper Jones matrix transformations
      switch (nextComponent.type) {
        case 'polarizer': {
          const polarizerAngle = nextComponent.properties.angle ?? 0
          const angleDiff = Math.abs(currentPolarization - polarizerAngle)
          const newIntensity = calculateMalusLaw(currentIntensity, angleDiff)
          formulas.push(`I = ${currentIntensity.toFixed(1)} × cos²(${angleDiff.toFixed(0)}°) = ${newIntensity.toFixed(1)}%`)
          currentIntensity = newIntensity
          currentPolarization = polarizerAngle
          // Sync Jones vector with scalar values
          currentJonesVector = polarizationToJonesVector(currentPolarization, currentIntensity / 100)
          break
        }

        case 'waveplate': {
          const retardation = nextComponent.properties.retardation ?? 90
          if (retardation === 90) {
            // λ/4 - converts linear to circular (simplified as 45° rotation)
            // TODO Phase 3: Use quarterWavePlateMatrix for accurate circular polarization
            currentPolarization = (currentPolarization + 45) % 180
            formulas.push(`λ/4: θ → ${currentPolarization}° (circular)`)
          } else if (retardation === 180) {
            // λ/2 - rotates polarization by 2θ relative to fast axis
            // TODO Phase 3: Use halfWavePlateMatrix for accurate transformation
            const fastAxis = nextComponent.rotation
            currentPolarization = (2 * fastAxis - currentPolarization + 360) % 180
            formulas.push(`λ/2: θ = 2×${fastAxis}° - θ_in = ${currentPolarization}°`)
          }
          // Sync Jones vector with scalar values
          currentJonesVector = polarizationToJonesVector(currentPolarization, currentIntensity / 100)
          break
        }

        case 'mirror': {
          // Reflect direction
          const mirrorAngle = nextComponent.rotation
          const normal = rotateVector({ x: 0, y: -1 }, mirrorAngle)
          direction = reflectDirection(direction, normal)
          formulas.push(`Mirror: θ_r = θ_i = ${mirrorAngle}°`)

          // Update sorted components for new direction
          sortedComponents.splice(sortedComponents.indexOf(nextComponent), 1)
          // Mirror preserves polarization state, no Jones vector update needed
          break
        }

        case 'splitter': {
          const splitType = nextComponent.properties.splitType ?? 'pbs'
          if (splitType === 'pbs') {
            // PBS: s-polarization reflects, p-polarization transmits
            // TODO Phase 2: Implement beam branching for both output paths
            currentPolarization = 0 // p-polarization transmitted
            formulas.push(`PBS: p → transmitted, s → reflected (90°)`)
          } else if (splitType === 'calcite') {
            // Calcite: o-ray and e-ray separate
            // TODO Phase 2: Implement beam branching for o-ray and e-ray
            formulas.push(`Calcite: o-ray (0°), e-ray (90°)`)
          }
          // Sync Jones vector with scalar values
          currentJonesVector = polarizationToJonesVector(currentPolarization, currentIntensity / 100)
          break
        }

        case 'lens': {
          // Lens doesn't affect polarization, just continues
          // TODO Phase 4: Implement ABCD matrix for beam width/convergence
          formulas.push(`Lens: f = ${nextComponent.properties.focalLength}mm`)
          break
        }

        case 'sensor': {
          // End of path
          const analysis = analyzePolarization(currentJonesVector)
          formulas.push(`Sensor: I = ${currentIntensity.toFixed(1)}%, θ = ${currentPolarization}° (${analysis.type})`)
          currentIntensity = 0 // Stop tracing
          break
        }
      }

      // Update polarization analysis after component interaction
      polarizationAnalysis = analyzePolarization(currentJonesVector)

      currentPos = { x: nextComponent.x, y: nextComponent.y }

    } else {
      // No more components, extend to canvas edge
      const t = Math.max(
        direction.x > 0 ? (canvasWidth - currentPos.x) / direction.x : 0,
        direction.y !== 0 ? (direction.y > 0 ? 400 : 0 - currentPos.y) / direction.y : 0
      )
      endX = currentPos.x + direction.x * Math.min(t, 500)
      endY = currentPos.y + direction.y * Math.min(t, 500)

      segments.push({
        id: `${emitter.id}-seg-${bounce}`,
        x1: currentPos.x + direction.x * 30,
        y1: currentPos.y + direction.y * 30,
        x2: endX,
        y2: endY,
        polarization: currentPolarization,
        jonesVector: currentJonesVector,
        intensity: currentIntensity,
        phase: currentPhase,
        rayId: emitter.id,
        polarizationType: polarizationAnalysis.type,
        handedness: polarizationAnalysis.handedness,
      })

      break // Exit loop
    }
  }

  return segments
}

// Export utility functions for use in components
export { getPolarizationColor, normalizeAngle, calculateMalusLaw }

// Re-export Jones calculus utilities for use in visualization components
export {
  complex,
  polarizationToJonesVector,
  jonesVectorToPolarization,
  jonesIntensity,
  analyzePolarization,
} from '@/core/JonesCalculus'
