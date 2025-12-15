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
  type JonesMatrix,
  complex,
  polarizationToJonesVector,
  jonesVectorToPolarization,
  jonesIntensity,
  analyzePolarization,
  applyJonesMatrix,
  polarizerMatrix,
  halfWavePlateMatrix,
  quarterWavePlateMatrix,
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
  // Beam geometry (Phase 4: Geometric Optics)
  beamWidth: number            // Beam width in pixels (default ~10)
  beamDivergence: number       // Divergence angle in degrees (positive = spreading)
  ellipticity: number          // Polarization ellipticity: 0 = linear, ±1 = circular
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
// Helper: Light Ray Tracing (Queue-Based with Beam Splitting)
// ============================================

/**
 * Ray state for queue-based tracing
 * Each ray in the queue represents a light path to be traced
 */
interface RayState {
  id: string                    // Unique ray identifier (e.g., "emitter1-ray0-branch1")
  position: Position            // Current position
  direction: Position           // Normalized direction vector
  jonesVector: JonesVector      // Full polarization state
  intensity: number             // Current intensity (0-100%)
  polarization: number          // Legacy angle in degrees
  phase: number                 // Phase for interference
  depth: number                 // Recursion depth (for limiting)
  sourceId: string              // Original emitter ID
  visitedComponents: Set<string> // Components already visited by this ray path
  // Beam geometry (Phase 4: Geometric Optics)
  beamWidth: number             // Current beam width in pixels
  beamDivergence: number        // Current divergence angle in degrees
}

/**
 * Find the next component in the ray's path
 */
function findNextComponent(
  ray: RayState,
  components: BenchComponent[]
): BenchComponent | null {
  let closestComponent: BenchComponent | null = null
  let closestDist = Infinity

  for (const comp of components) {
    // Skip already visited components (prevents infinite loops)
    if (ray.visitedComponents.has(comp.id)) continue

    const dx = comp.x - ray.position.x
    const dy = comp.y - ray.position.y

    // Distance along ray direction
    const dot = dx * ray.direction.x + dy * ray.direction.y
    if (dot <= 10) continue // Must be ahead of current position

    // Perpendicular distance (how close ray passes to component)
    const perpDist = Math.abs(dx * ray.direction.y - dy * ray.direction.x)
    if (perpDist > 50) continue // Too far from ray path

    if (dot < closestDist) {
      closestDist = dot
      closestComponent = comp
    }
  }

  return closestComponent
}

/**
 * Calculate PBS (Polarizing Beam Splitter) output using Jones vector projection
 * p-polarization (parallel to splitter axis) transmits
 * s-polarization (perpendicular to splitter axis) reflects
 */
function calculatePBSSplit(
  inputJones: JonesVector,
  _inputIntensity: number, // Derived from Jones vector now
  splitterRotation: number
): { transmitted: { jones: JonesVector; intensity: number; polarization: number };
     reflected: { jones: JonesVector; intensity: number; polarization: number } } {

  // PBS projects input onto p and s polarization states
  // p-axis is aligned with splitterRotation, s-axis is perpendicular

  const theta = (splitterRotation * Math.PI) / 180
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  // Project input Jones vector onto p-polarization axis (transmitted)
  // p-polarization unit vector in Jones space: [cos(θ), sin(θ)]
  // Projection: (E · p̂) p̂
  const pDotE = complex.add(
    complex.scale(inputJones[0], cosTheta),
    complex.scale(inputJones[1], sinTheta)
  )
  const transmittedJones: JonesVector = [
    complex.scale(pDotE, cosTheta),
    complex.scale(pDotE, sinTheta)
  ]

  // Project input Jones vector onto s-polarization axis (reflected)
  // s-polarization unit vector in Jones space: [-sin(θ), cos(θ)]
  const sDotE = complex.add(
    complex.scale(inputJones[0], -sinTheta),
    complex.scale(inputJones[1], cosTheta)
  )
  const reflectedJones: JonesVector = [
    complex.scale(sDotE, -sinTheta),
    complex.scale(sDotE, cosTheta)
  ]

  // Calculate intensities from Jones vectors
  const transmittedIntensity = jonesIntensity(transmittedJones) * 100
  const reflectedIntensity = jonesIntensity(reflectedJones) * 100

  // Derive polarization angles
  const transmittedPol = transmittedIntensity > 0.01 ? splitterRotation : 0
  const reflectedPol = reflectedIntensity > 0.01 ? (splitterRotation + 90) % 180 : 0

  return {
    transmitted: { jones: transmittedJones, intensity: transmittedIntensity, polarization: transmittedPol },
    reflected: { jones: reflectedJones, intensity: reflectedIntensity, polarization: reflectedPol }
  }
}

/**
 * Calculate Calcite birefringence output using Jones vector projection
 * Ordinary ray (o-ray) and extraordinary ray (e-ray) separate spatially
 * o-ray: polarized perpendicular to optic axis (no walk-off)
 * e-ray: polarized parallel to optic axis (spatial walk-off)
 */
function calculateCalciteSplit(
  inputJones: JonesVector,
  _inputIntensity: number, // Derived from Jones vector now
  crystalRotation: number
): { oRay: { jones: JonesVector; intensity: number; polarization: number };
     eRay: { jones: JonesVector; intensity: number; polarization: number } } {

  // Calcite projects input onto orthogonal polarization states
  // o-ray axis is perpendicular to optic axis (crystalRotation)
  // e-ray axis is parallel to optic axis

  const theta = (crystalRotation * Math.PI) / 180
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  // o-ray: perpendicular to optic axis, unit vector: [-sin(θ), cos(θ)]
  const oDotE = complex.add(
    complex.scale(inputJones[0], -sinTheta),
    complex.scale(inputJones[1], cosTheta)
  )
  const oJones: JonesVector = [
    complex.scale(oDotE, -sinTheta),
    complex.scale(oDotE, cosTheta)
  ]

  // e-ray: parallel to optic axis, unit vector: [cos(θ), sin(θ)]
  const eDotE = complex.add(
    complex.scale(inputJones[0], cosTheta),
    complex.scale(inputJones[1], sinTheta)
  )
  const eJones: JonesVector = [
    complex.scale(eDotE, cosTheta),
    complex.scale(eDotE, sinTheta)
  ]

  // Calculate intensities from Jones vectors
  const oIntensity = jonesIntensity(oJones) * 100
  const eIntensity = jonesIntensity(eJones) * 100

  // Derive polarization angles
  const oPol = oIntensity > 0.01 ? (crystalRotation + 90) % 180 : 0
  const ePol = eIntensity > 0.01 ? crystalRotation : 0

  return {
    oRay: { jones: oJones, intensity: oIntensity, polarization: oPol },
    eRay: { jones: eJones, intensity: eIntensity, polarization: ePol }
  }
}

/**
 * Calculate NPBS (Non-Polarizing Beam Splitter) output
 * 50/50 split regardless of polarization, preserving Jones vector state
 */
function calculateNPBSSplit(
  inputJones: JonesVector,
  inputIntensity: number,
  _inputPolarization: number // Kept for backward compatibility
): { transmitted: { jones: JonesVector; intensity: number; polarization: number };
     reflected: { jones: JonesVector; intensity: number; polarization: number } } {

  // NPBS splits intensity 50/50, preserving polarization state
  // Scale Jones vector by 1/√2 for each output (maintains |E|² conservation)
  const scale = 1 / Math.SQRT2

  const transmittedJones: JonesVector = [
    complex.scale(inputJones[0], scale),
    complex.scale(inputJones[1], scale)
  ]
  const reflectedJones: JonesVector = [
    complex.scale(inputJones[0], scale),
    complex.scale(inputJones[1], scale)
  ]

  const halfIntensity = inputIntensity / 2
  const polarization = jonesVectorToPolarization(inputJones)

  return {
    transmitted: { jones: transmittedJones, intensity: halfIntensity, polarization },
    reflected: { jones: reflectedJones, intensity: halfIntensity, polarization }
  }
}

// ============================================
// Jones Matrix Component Transformations
// ============================================

/**
 * Get the Jones matrix for an optical component
 * This enables accurate polarization state transformations
 */
function getComponentJonesMatrix(
  component: BenchComponent
): JonesMatrix | null {
  switch (component.type) {
    case 'polarizer': {
      const angle = component.properties.angle ?? 0
      return polarizerMatrix(angle)
    }

    case 'waveplate': {
      const retardation = component.properties.retardation ?? 90
      const fastAxis = component.rotation

      if (retardation === 90) {
        // Quarter-wave plate (λ/4)
        return quarterWavePlateMatrix(fastAxis)
      } else if (retardation === 180) {
        // Half-wave plate (λ/2)
        return halfWavePlateMatrix(fastAxis)
      }
      // For other retardations, would need general retarder matrix
      return null
    }

    default:
      // Mirror, splitter, lens, sensor don't have simple Jones matrices
      // (they require special handling for direction changes or branching)
      return null
  }
}

/**
 * Apply Jones matrix transformation to a ray
 * Returns the transformed Jones vector and derived quantities
 */
function applyJonesTransformation(
  inputJones: JonesVector,
  matrix: JonesMatrix
): { jones: JonesVector; intensity: number; polarization: number } {
  const outputJones = applyJonesMatrix(matrix, inputJones)
  const intensity = jonesIntensity(outputJones) * 100 // Convert to percentage
  const polarization = jonesVectorToPolarization(outputJones)

  return { jones: outputJones, intensity, polarization }
}

// ============================================
// Geometric Optics: Thin Lens Equation
// ============================================

/**
 * Default beam parameters
 */
const DEFAULT_BEAM_WIDTH = 10        // pixels
const DEFAULT_BEAM_DIVERGENCE = 0    // degrees (collimated)

/**
 * Calculate beam transformation through a thin lens using paraxial approximation
 *
 * The thin lens equation relates the beam properties before and after the lens:
 * - For a collimated beam (divergence = 0), the lens focuses it to a waist at f
 * - For a diverging beam, the lens can collimate or focus it depending on geometry
 *
 * Using the ABCD matrix formalism for thin lens:
 * | A  B |   | 1      0  |
 * | C  D | = | -1/f   1  |
 *
 * Where f is focal length (positive for convex, negative for concave)
 *
 * Beam parameters transform as:
 * - θ_out = θ_in - h/f  (paraxial ray angle)
 * - For Gaussian beam: w(z) = w0 * sqrt(1 + (z/zR)²)
 *
 * Simplified model for visualization:
 * - Tracks beam width and divergence angle
 * - Positive f (convex): converges parallel rays to focus
 * - Negative f (concave): diverges rays
 */
function calculateLensTransformation(
  inputWidth: number,
  inputDivergence: number,  // degrees
  focalLength: number,      // mm (positive = convex, negative = concave)
  rayHeight: number = 0     // Height of ray from optical axis (pixels)
): { width: number; divergence: number } {

  // Pixel to mm conversion (approximate for visualization)
  const PIXELS_PER_MM = 2

  // Convert divergence to radians
  const inputDivRad = (inputDivergence * Math.PI) / 180

  // Effective focal length in pixels
  const fPixels = focalLength * PIXELS_PER_MM

  // Paraxial approximation: ray angle changes by -h/f
  // θ_out = θ_in - y/f
  const rayHeightContribution = rayHeight / fPixels

  // For collimated beam entering lens: divergence becomes -1/f (focusing angle)
  // For diverging beam: adds to existing divergence
  let outputDivRad: number

  if (Math.abs(focalLength) < 1) {
    // Very short focal length - strong lens effect
    outputDivRad = inputDivRad + Math.sign(-focalLength) * 0.2
  } else {
    // Apply thin lens formula
    // Δθ = -h/f for a ray at height h
    // For the beam envelope, use typical ray height (half beam width)
    const typicalHeight = inputWidth / 2
    const angleChange = -typicalHeight / fPixels

    outputDivRad = inputDivRad + angleChange - rayHeightContribution
  }

  // Convert back to degrees
  const outputDivergence = (outputDivRad * 180) / Math.PI

  // Beam width immediately after lens (minimal change at lens plane)
  // Width change occurs as beam propagates
  const outputWidth = inputWidth

  // Clamp divergence to reasonable range for visualization
  const clampedDivergence = Math.max(-30, Math.min(30, outputDivergence))

  return {
    width: outputWidth,
    divergence: clampedDivergence
  }
}

/**
 * Calculate beam width after propagating a distance with given divergence
 * w(z) = w0 + z * tan(θ)
 */
function propagateBeamWidth(
  initialWidth: number,
  divergenceDeg: number,
  distance: number
): number {
  const divRad = (divergenceDeg * Math.PI) / 180
  const widthChange = distance * Math.tan(divRad)
  const newWidth = initialWidth + widthChange

  // Clamp to reasonable range for visualization
  return Math.max(2, Math.min(50, newWidth))
}

/**
 * Queue-based ray tracing with beam splitting support
 *
 * This function traces light rays through the optical system, supporting:
 * - Multiple bounces (mirrors)
 * - Beam splitting (PBS, calcite, NPBS)
 * - Intensity threshold cutoff
 * - Maximum recursion depth
 */
function traceLightRays(
  emitter: BenchComponent,
  allComponents: BenchComponent[],
  initialPolarization: number,
  initialIntensity: number,
  formulas: string[]
): LightSegment[] {
  const segments: LightSegment[] = []

  // Configuration
  const MAX_DEPTH = 10          // Maximum recursion depth
  const INTENSITY_THRESHOLD = 1 // Stop if intensity < 1%
  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 400

  // Initialize the ray queue with the emitter's output
  const initialJones = polarizationToJonesVector(initialPolarization, initialIntensity / 100)
  const initialDirection = rotateVector({ x: 1, y: 0 }, emitter.rotation)

  const rayQueue: RayState[] = [{
    id: `${emitter.id}-ray0`,
    position: { x: emitter.x, y: emitter.y },
    direction: initialDirection,
    jonesVector: initialJones,
    intensity: initialIntensity,
    polarization: initialPolarization,
    phase: 1,
    depth: 0,
    sourceId: emitter.id,
    visitedComponents: new Set([emitter.id]),
    beamWidth: DEFAULT_BEAM_WIDTH,
    beamDivergence: DEFAULT_BEAM_DIVERGENCE,
  }]

  let segmentCounter = 0
  let rayBranchCounter = 0

  // Process rays until queue is empty
  while (rayQueue.length > 0) {
    const ray = rayQueue.shift()!

    // Skip rays below intensity threshold or max depth
    if (ray.intensity < INTENSITY_THRESHOLD || ray.depth >= MAX_DEPTH) {
      continue
    }

    // Find next component in this ray's path
    const nextComponent = findNextComponent(ray, allComponents)

    if (nextComponent) {
      const endX = nextComponent.x
      const endY = nextComponent.y
      const analysis = analyzePolarization(ray.jonesVector)

      // Calculate segment length for beam propagation
      const segStartX = ray.position.x + ray.direction.x * 30
      const segStartY = ray.position.y + ray.direction.y * 30
      const segEndX = endX - ray.direction.x * 30
      const segEndY = endY - ray.direction.y * 30
      const segmentLength = Math.sqrt(
        Math.pow(segEndX - segStartX, 2) + Math.pow(segEndY - segStartY, 2)
      )

      // Calculate beam width at end of segment (propagation with divergence)
      const endBeamWidth = propagateBeamWidth(ray.beamWidth, ray.beamDivergence, segmentLength)

      // Create segment from current position to component
      segments.push({
        id: `${ray.id}-seg${segmentCounter++}`,
        x1: segStartX,
        y1: segStartY,
        x2: segEndX,
        y2: segEndY,
        polarization: ray.polarization,
        jonesVector: ray.jonesVector,
        intensity: ray.intensity,
        phase: ray.phase,
        rayId: ray.sourceId,
        polarizationType: analysis.type,
        handedness: analysis.handedness,
        beamWidth: ray.beamWidth,
        beamDivergence: ray.beamDivergence,
        ellipticity: analysis.ellipticity,
      })

      // Mark component as visited for this ray path
      const newVisited = new Set(ray.visitedComponents)
      newVisited.add(nextComponent.id)

      // Process component and potentially create new rays
      switch (nextComponent.type) {
        case 'polarizer': {
          // Use Jones matrix for accurate polarizer transformation
          const polarizerAngle = nextComponent.properties.angle ?? 0
          const matrix = polarizerMatrix(polarizerAngle)
          const result = applyJonesTransformation(ray.jonesVector, matrix)

          // Generate formula for educational display
          const angleDiff = Math.abs(ray.polarization - polarizerAngle)
          formulas.push(`Polarizer(${polarizerAngle}°): I = ${ray.intensity.toFixed(1)}% × cos²(${angleDiff.toFixed(0)}°) = ${result.intensity.toFixed(1)}%`)

          // Continue with filtered ray if above threshold
          if (result.intensity >= INTENSITY_THRESHOLD) {
            rayQueue.push({
              ...ray,
              id: ray.id,
              position: { x: endX, y: endY },
              jonesVector: result.jones,
              intensity: result.intensity,
              polarization: result.polarization,
              depth: ray.depth + 1,
              visitedComponents: newVisited,
            })
          }
          break
        }

        case 'waveplate': {
          // Use Jones matrices for accurate waveplate transformations
          const retardation = nextComponent.properties.retardation ?? 90
          const fastAxis = nextComponent.rotation
          const matrix = getComponentJonesMatrix(nextComponent)

          if (matrix) {
            const result = applyJonesTransformation(ray.jonesVector, matrix)
            const analysis = analyzePolarization(result.jones)

            if (retardation === 90) {
              // Quarter-wave plate - can create circular polarization
              formulas.push(`λ/4(${fastAxis}°): ${ray.polarization.toFixed(0)}° → ${analysis.type} (${analysis.handedness})`)
            } else if (retardation === 180) {
              // Half-wave plate - rotates linear polarization
              formulas.push(`λ/2(${fastAxis}°): ${ray.polarization.toFixed(0)}° → ${result.polarization.toFixed(0)}°`)
            }

            rayQueue.push({
              ...ray,
              id: ray.id,
              position: { x: endX, y: endY },
              jonesVector: result.jones,
              intensity: result.intensity,
              polarization: result.polarization,
              depth: ray.depth + 1,
              visitedComponents: newVisited,
            })
          } else {
            // Fallback for unsupported retardation values
            rayQueue.push({
              ...ray,
              id: ray.id,
              position: { x: endX, y: endY },
              depth: ray.depth + 1,
              visitedComponents: newVisited,
            })
          }
          break
        }

        case 'mirror': {
          const mirrorAngle = nextComponent.rotation
          const normal = rotateVector({ x: 0, y: -1 }, mirrorAngle)
          const reflectedDir = reflectDirection(ray.direction, normal)
          formulas.push(`Mirror: reflection at ${mirrorAngle}°`)

          rayQueue.push({
            ...ray,
            id: ray.id,
            position: { x: endX, y: endY },
            direction: reflectedDir,
            depth: ray.depth + 1,
            visitedComponents: newVisited,
          })
          break
        }

        case 'splitter': {
          const splitType = nextComponent.properties.splitType ?? 'pbs'
          const splitterRotation = nextComponent.rotation

          if (splitType === 'pbs') {
            // Polarizing Beam Splitter: p transmits, s reflects
            const { transmitted, reflected } = calculatePBSSplit(
              ray.jonesVector, ray.intensity, splitterRotation
            )

            formulas.push(`PBS: p(${transmitted.intensity.toFixed(1)}%) → transmitted, s(${reflected.intensity.toFixed(1)}%) → reflected`)

            // Transmitted ray (continues in same direction)
            if (transmitted.intensity >= INTENSITY_THRESHOLD) {
              rayQueue.push({
                id: `${ray.id}-t${rayBranchCounter}`,
                position: { x: endX, y: endY },
                direction: ray.direction,
                jonesVector: transmitted.jones,
                intensity: transmitted.intensity,
                polarization: transmitted.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }

            // Reflected ray (perpendicular direction)
            if (reflected.intensity >= INTENSITY_THRESHOLD) {
              const reflectedDir = rotateVector(ray.direction, 90)
              rayQueue.push({
                id: `${ray.id}-r${rayBranchCounter}`,
                position: { x: endX, y: endY },
                direction: reflectedDir,
                jonesVector: reflected.jones,
                intensity: reflected.intensity,
                polarization: reflected.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }
            rayBranchCounter++

          } else if (splitType === 'calcite') {
            // Calcite birefringence: o-ray and e-ray separate
            const { oRay, eRay } = calculateCalciteSplit(
              ray.jonesVector, ray.intensity, splitterRotation
            )

            formulas.push(`Calcite: o-ray(${oRay.intensity.toFixed(1)}%), e-ray(${eRay.intensity.toFixed(1)}%)`)

            // o-ray (ordinary ray - continues straight)
            if (oRay.intensity >= INTENSITY_THRESHOLD) {
              rayQueue.push({
                id: `${ray.id}-o${rayBranchCounter}`,
                position: { x: endX, y: endY },
                direction: ray.direction,
                jonesVector: oRay.jones,
                intensity: oRay.intensity,
                polarization: oRay.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }

            // e-ray (extraordinary ray - displaced, slight angle change)
            if (eRay.intensity >= INTENSITY_THRESHOLD) {
              // e-ray is displaced and has slight angular deviation
              const eRayDir = rotateVector(ray.direction, 5) // Small deviation
              const displacement = 15 // Spatial displacement in pixels
              rayQueue.push({
                id: `${ray.id}-e${rayBranchCounter}`,
                position: {
                  x: endX + ray.direction.y * displacement,
                  y: endY - ray.direction.x * displacement
                },
                direction: eRayDir,
                jonesVector: eRay.jones,
                intensity: eRay.intensity,
                polarization: eRay.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }
            rayBranchCounter++

          } else if (splitType === 'npbs') {
            // Non-polarizing beam splitter: 50/50 split
            const { transmitted, reflected } = calculateNPBSSplit(
              ray.jonesVector, ray.intensity, ray.polarization
            )

            formulas.push(`NPBS: 50/50 split (${transmitted.intensity.toFixed(1)}% each)`)

            // Transmitted ray
            if (transmitted.intensity >= INTENSITY_THRESHOLD) {
              rayQueue.push({
                id: `${ray.id}-t${rayBranchCounter}`,
                position: { x: endX, y: endY },
                direction: ray.direction,
                jonesVector: transmitted.jones,
                intensity: transmitted.intensity,
                polarization: transmitted.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }

            // Reflected ray
            if (reflected.intensity >= INTENSITY_THRESHOLD) {
              const reflectedDir = rotateVector(ray.direction, 90)
              rayQueue.push({
                id: `${ray.id}-r${rayBranchCounter}`,
                position: { x: endX, y: endY },
                direction: reflectedDir,
                jonesVector: reflected.jones,
                intensity: reflected.intensity,
                polarization: reflected.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }
            rayBranchCounter++
          }
          break
        }

        case 'lens': {
          // Apply thin lens transformation to beam geometry
          const focalLength = nextComponent.properties.focalLength ?? 50
          const lensResult = calculateLensTransformation(
            endBeamWidth, // Use propagated beam width at lens position
            ray.beamDivergence,
            focalLength,
            0 // On-axis ray (ray height = 0)
          )

          // Generate educational formula
          const lensType = focalLength > 0 ? 'convex' : 'concave'
          const focusEffect = focalLength > 0 ? 'converging' : 'diverging'
          formulas.push(`Lens(${lensType}, f=${focalLength}mm): θ = ${ray.beamDivergence.toFixed(1)}° → ${lensResult.divergence.toFixed(1)}° (${focusEffect})`)

          // Lens doesn't affect polarization, only beam geometry
          rayQueue.push({
            ...ray,
            id: ray.id,
            position: { x: endX, y: endY },
            depth: ray.depth + 1,
            visitedComponents: newVisited,
            beamWidth: lensResult.width,
            beamDivergence: lensResult.divergence,
          })
          break
        }

        case 'sensor': {
          // End of path - sensor absorbs light
          const analysis = analyzePolarization(ray.jonesVector)
          formulas.push(`Sensor: I = ${ray.intensity.toFixed(1)}%, θ = ${ray.polarization.toFixed(0)}° (${analysis.type})`)
          // Don't add to queue - ray terminates here
          break
        }
      }

    } else {
      // No component found - extend ray to canvas edge
      const analysis = analyzePolarization(ray.jonesVector)

      // Calculate intersection with canvas boundary
      let t = Infinity
      if (ray.direction.x > 0) {
        t = Math.min(t, (CANVAS_WIDTH - ray.position.x) / ray.direction.x)
      } else if (ray.direction.x < 0) {
        t = Math.min(t, -ray.position.x / ray.direction.x)
      }
      if (ray.direction.y > 0) {
        t = Math.min(t, (CANVAS_HEIGHT - ray.position.y) / ray.direction.y)
      } else if (ray.direction.y < 0) {
        t = Math.min(t, -ray.position.y / ray.direction.y)
      }

      t = Math.min(t, 500) // Limit maximum extension

      const edgeEndX = ray.position.x + ray.direction.x * t
      const edgeEndY = ray.position.y + ray.direction.y * t

      segments.push({
        id: `${ray.id}-seg${segmentCounter++}`,
        x1: ray.position.x + ray.direction.x * 30,
        y1: ray.position.y + ray.direction.y * 30,
        x2: edgeEndX,
        y2: edgeEndY,
        polarization: ray.polarization,
        jonesVector: ray.jonesVector,
        intensity: ray.intensity,
        phase: ray.phase,
        rayId: ray.sourceId,
        polarizationType: analysis.type,
        handedness: analysis.handedness,
        beamWidth: ray.beamWidth,
        beamDivergence: ray.beamDivergence,
        ellipticity: analysis.ellipticity,
      })
    }
  }

  return segments
}

// Export utility functions for use in components
export { getPolarizationColor, normalizeAngle, calculateMalusLaw }

// Export beam geometry utilities for visualization (Phase 4)
export { propagateBeamWidth, DEFAULT_BEAM_WIDTH, DEFAULT_BEAM_DIVERGENCE }

// Re-export Jones calculus utilities for use in visualization components
export {
  type JonesMatrix,
  complex,
  polarizationToJonesVector,
  jonesVectorToPolarization,
  jonesIntensity,
  analyzePolarization,
  applyJonesMatrix,
  polarizerMatrix,
  halfWavePlateMatrix,
  quarterWavePlateMatrix,
  rotatorMatrix,
} from '@/core/JonesCalculus'
