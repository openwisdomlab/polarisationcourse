/**
 * Optical Bench Store - 光学工作台状态管理
 *
 * Zustand store for managing optical bench state.
 * Physics calculations and types are extracted to separate modules:
 *
 * @see src/stores/benchTypes.ts — Type definitions
 * @see src/stores/benchPhysicsCalc.ts — Ray tracing & physics calculations
 * @see src/core/api.ts — Unified Physics API
 * @see src/core/physics/bridge.ts — Legacy ↔ Unified type conversions
 * @see src/core/physics/constants.ts — Centralized numerical thresholds
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { getStorageJSON, setStorageJSON } from '@/lib/storage'
import { logger } from '@/lib/logger'

// Types from extracted module
import type {
  BenchComponentType,
  BenchComponent,
  Position,
  LightSegment,
  SavedDesign,
  ClassicExperiment,
  Challenge,
  Tutorial,
  SensorReading,
} from './benchTypes'

// Physics calculations from extracted module
import {
  traceLightRays,
  normalizeAngle,
} from './benchPhysicsCalc'

// Re-export benchPhysics from the physics calc module
export { benchPhysics } from './benchPhysicsCalc'

// Re-export all types for backward compatibility
export type {
  BenchComponentType,
  BenchComponent,
  Position,
  DeviceQuality,
  LightRay,
  LightSegment,
  SavedDesign,
  ClassicExperiment,
  Challenge,
  TutorialStep,
  Tutorial,
  Complex,
  JonesVector,
  SensorReading,
} from './benchTypes'
export { POLARIZER_QUALITY_PARAMS } from './benchTypes'

// Re-export physics utilities for use in components
export {
  getPolarizationColor,
  normalizeAngle,
  calculateMalusLaw,
  propagateBeamWidth,
  rotateVector,
} from './benchPhysicsCalc'

// Re-export unified API type
export type { PolarizationInfo } from '@/core/api'

// Re-export bridge utilities for visualization components
export {
  type LegacyComplex,
  type LegacyJonesVector,
  legacyComplex,
  createLegacyJonesVector,
  legacyJonesIntensity,
  legacyJonesToAngle,
  analyzeLegacyJones,
  polarizationInfoToLegacyJones,
} from '@/core/physics/bridge'

// Re-export centralized constants
export {
  type NonIdealPolarizerParams,
  IDEAL_POLARIZER,
  TYPICAL_POLARIZER,
  LOW_QUALITY_POLARIZER,
  DEFAULT_BEAM_WIDTH,
  DEFAULT_BEAM_DIVERGENCE,
} from '@/core/physics/constants'

/**
 * @deprecated Use the bridge utilities above instead.
 */
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
  sensorReadings: Map<string, SensorReading>

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
// Helpers
// ============================================

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const snapToGridValue = (value: number, gridSize: number, enabled: boolean): number => {
  if (!enabled) return value
  return Math.round(value / gridSize) * gridSize
}

function getDefaultProperties(type: BenchComponentType): BenchComponent['properties'] {
  switch (type) {
    case 'emitter':
      return { polarization: 0 }
    case 'polarizer':
      return { angle: 0 }
    case 'waveplate':
      return { retardation: 90 }
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
      const readings = new Map<string, SensorReading>()
      const formulas: string[] = []

      const emitters = state.components.filter((c: BenchComponent) => c.type === 'emitter')

      emitters.forEach((emitter: BenchComponent) => {
        const initialPolarization = emitter.properties.polarization ?? 0
        const isUnpolarized = initialPolarization === -1

        const rays = traceLightRays(
          emitter,
          state.components,
          isUnpolarized ? 0 : initialPolarization,
          100,
          formulas
        )

        segments.push(...rays)

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
      set({ currentTutorial: tutorial, tutorialStepIndex: 0 })
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
        setStorageJSON(STORAGE_KEY, designs)

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
        setStorageJSON(STORAGE_KEY, designs)

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
        logger.error('Failed to import design:', e)
        return false
      }
    },

    loadSavedDesigns: () => {
      const designs = getStorageJSON<SavedDesign[]>(STORAGE_KEY, [])
      if (designs.length > 0) {
        set({ savedDesigns: designs })
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
        savedDesigns: get().savedDesigns,
      })
    },
  }))
)
