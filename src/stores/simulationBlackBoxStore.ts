/**
 * Simulation Black Box Store (模拟黑匣子)
 *
 * Records, fingerprints, and replays optical bench simulation states.
 * Enables reproducible bug reports and iterative physics engine improvement.
 *
 * Architecture:
 * 1. RECORD: Captures OpticalBenchLayout snapshot when physics stabilizes
 * 2. FINGERPRINT: Generates a deterministic hash of the simulation result
 * 3. REPLAY: Hydrates opticalBenchStore from a pasted JSON snapshot
 *
 * The black box is append-only during a session. Each snapshot is immutable
 * once recorded. Snapshots can be exported as JSON for bug reports.
 */

import { create } from 'zustand'
import { useOpticalBenchStore, type BenchComponent, type LightSegment } from './opticalBenchStore'
import {
  PhysicsInterpreter,
  type PolarizationStateDescription,
} from '@/core/physics/unified/PhysicsInterpreter'
import { CoherencyMatrix } from '@/core/physics/unified/CoherencyMatrix'
import { logger } from '@/lib/logger'

// ========== Types ==========

/**
 * Complete snapshot of the optical bench at a point in time.
 * This is the unit of recording — everything needed to reproduce a simulation.
 */
export interface SimulationSnapshot {
  /** Unique snapshot ID */
  id: string

  /** ISO 8601 timestamp */
  timestamp: string

  /** Deterministic fingerprint of the simulation result */
  fingerprint: string

  /** The bench layout that produced this result */
  layout: OpticalBenchLayout

  /** Physics result summary (from PhysicsInterpreter) */
  result: SimulationResult

  /** User-added description (optional, for bug reports) */
  description?: string
}

/**
 * The optical bench layout — the "input" to the simulation.
 * Serializable, deterministic, minimal.
 */
export interface OpticalBenchLayout {
  /** Schema version for forward compatibility */
  version: number

  /** All components on the bench */
  components: BenchComponent[]

  /** Canvas dimensions at time of capture */
  canvasSize: { width: number; height: number }
}

/**
 * Physics simulation result — the "output" of the simulation.
 * Captures what the PhysicsInterpreter observed.
 */
export interface SimulationResult {
  /** Number of light segments traced */
  segmentCount: number

  /** Sensor readings: sensorId → analysis */
  sensorAnalysis: Record<string, {
    intensity: number
    polarization: number
    stateDescription: PolarizationStateDescription
  }>

  /** Whether any conservation violations were detected */
  hasConservationViolation: boolean

  /** Total energy in (sum of emitter intensities) */
  totalInputEnergy: number

  /** Total energy out (sum of terminal segment intensities) */
  totalOutputEnergy: number

  /** Violation details (if any) */
  violations: string[]
}

// ========== Store State ==========

interface SimulationBlackBoxState {
  /** All recorded snapshots (append-only during session) */
  snapshots: SimulationSnapshot[]

  /** Maximum snapshots to keep in memory (ring buffer) */
  maxSnapshots: number

  /** Whether auto-recording is enabled */
  autoRecord: boolean

  /** Last recorded fingerprint (to avoid duplicate snapshots) */
  lastFingerprint: string | null
}

interface SimulationBlackBoxActions {
  /** Record the current optical bench state as a snapshot */
  recordSnapshot: (description?: string) => SimulationSnapshot | null

  /** Clear all recorded snapshots */
  clearSnapshots: () => void

  /** Replay a snapshot: hydrate the optical bench and run physics */
  replaySnapshot: (snapshot: SimulationSnapshot) => void

  /** Replay from raw JSON string */
  replayFromJSON: (json: string) => boolean

  /** Export a snapshot as a shareable JSON string */
  exportSnapshot: (snapshotId: string) => string | null

  /** Export the latest snapshot */
  exportLatest: () => string | null

  /** Export current bench state as a report (for "Report Physics Issue") */
  exportCurrentAsReport: (description?: string) => string

  /** Toggle auto-recording */
  setAutoRecord: (enabled: boolean) => void

  /** Remove a specific snapshot */
  removeSnapshot: (id: string) => void
}

// ========== Interpreter Instance ==========

const interpreter = new PhysicsInterpreter()

// ========== Fingerprinting ==========

/**
 * Generate a deterministic fingerprint of a simulation result.
 *
 * The fingerprint is a hex string derived from a simple hash of:
 * - Component count, types, positions, and rotations
 * - Light segment count and endpoint intensities
 * - Sensor reading values
 *
 * Two identical layouts with identical physics output will always
 * produce the same fingerprint. This lets us deduplicate snapshots.
 */
function generateFingerprint(layout: OpticalBenchLayout, segments: LightSegment[]): string {
  // Build a deterministic string from layout + result
  const parts: string[] = []

  // Layout signature: sorted components by ID for determinism
  const sortedComponents = [...layout.components].sort((a, b) => a.id.localeCompare(b.id))
  for (const c of sortedComponents) {
    parts.push(`${c.type}:${c.x.toFixed(1)},${c.y.toFixed(1)}:${c.rotation.toFixed(1)}`)
    // Include key properties
    if (c.properties.polarization !== undefined) parts.push(`p=${c.properties.polarization}`)
    if (c.properties.angle !== undefined) parts.push(`a=${c.properties.angle}`)
    if (c.properties.retardation !== undefined) parts.push(`r=${c.properties.retardation}`)
    if (c.properties.splitType) parts.push(`s=${c.properties.splitType}`)
  }

  // Result signature: segment endpoints and intensities
  parts.push(`|segs=${segments.length}`)
  for (const seg of segments) {
    parts.push(`${seg.intensity.toFixed(4)}:${seg.polarization.toFixed(1)}`)
  }

  // Simple FNV-1a 32-bit hash for speed and determinism
  const str = parts.join(';')
  let hash = 0x811c9dc5 | 0
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }

  // Convert to 8-char hex
  return (hash >>> 0).toString(16).padStart(8, '0')
}

// ========== Analysis ==========

/**
 * Analyze current simulation results using PhysicsInterpreter.
 */
function analyzeSimulation(
  components: BenchComponent[],
  segments: LightSegment[],
): SimulationResult {
  const sensorAnalysis: SimulationResult['sensorAnalysis'] = {}
  const violations: string[] = []
  let hasConservationViolation = false

  // Analyze sensor readings from the bench store
  const benchState = useOpticalBenchStore.getState()
  const readings = benchState.sensorReadings

  readings.forEach((reading: { intensity: number; polarization: number; jonesVector: unknown; polarizationType: string; handedness: string }, sensorId: string) => {
    // Convert the reading's Jones-based state to CoherencyMatrix for the interpreter
    const polarizationRad = (reading.polarization * Math.PI) / 180
    const coherencyState = CoherencyMatrix.createLinear(
      reading.intensity / 100, // Normalize from percentage
      polarizationRad
    )
    const stateDesc = interpreter.analyzeState(coherencyState)

    sensorAnalysis[sensorId] = {
      intensity: reading.intensity,
      polarization: reading.polarization,
      stateDescription: stateDesc,
    }
  })

  // Calculate total input/output energy
  const emitters = components.filter(c => c.type === 'emitter')
  const totalInputEnergy = emitters.length * 100 // Each emitter starts at 100%

  // Terminal segments: those that end at sensors or boundaries
  const terminalIntensities = segments
    .filter(seg => {
      // A terminal segment is one where no other segment starts from its endpoint
      const endX = seg.x2
      const endY = seg.y2
      return !segments.some(
        other => other.id !== seg.id &&
        Math.abs(other.x1 - endX) < 2 &&
        Math.abs(other.y1 - endY) < 2
      )
    })
    .map(seg => seg.intensity)

  const totalOutputEnergy = terminalIntensities.reduce((sum, i) => sum + i, 0)

  // Conservation check across the whole system
  if (totalInputEnergy > 0) {
    const conservation = interpreter.validateConservation(totalInputEnergy, totalOutputEnergy)
    if (!conservation.valid) {
      hasConservationViolation = true
      violations.push(conservation.message)
    }
  }

  return {
    segmentCount: segments.length,
    sensorAnalysis,
    hasConservationViolation,
    totalInputEnergy,
    totalOutputEnergy,
    violations,
  }
}

// ========== Store ==========

const generateId = () => `snap-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`

export const useSimulationBlackBoxStore = create<SimulationBlackBoxState & SimulationBlackBoxActions>()(
  (set, get) => ({
    // ========== State ==========
    snapshots: [],
    maxSnapshots: 100,
    autoRecord: false,
    lastFingerprint: null,

    // ========== Actions ==========

    recordSnapshot: (description?: string) => {
      const benchState = useOpticalBenchStore.getState()
      const { components, lightSegments, canvasSize } = benchState

      // Build layout
      const layout: OpticalBenchLayout = {
        version: 1,
        components: components.map(c => ({ ...c })), // Deep copy
        canvasSize: { ...canvasSize },
      }

      // Generate fingerprint
      const fingerprint = generateFingerprint(layout, lightSegments)

      // Skip if identical to last recording (avoid spam)
      if (fingerprint === get().lastFingerprint) {
        return null
      }

      // Analyze simulation
      const result = analyzeSimulation(components, lightSegments)

      const snapshot: SimulationSnapshot = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        fingerprint,
        layout,
        result,
        description,
      }

      set(state => {
        const snapshots = [...state.snapshots, snapshot]
        // Ring buffer: keep only the most recent N snapshots
        if (snapshots.length > state.maxSnapshots) {
          snapshots.splice(0, snapshots.length - state.maxSnapshots)
        }
        return { snapshots, lastFingerprint: fingerprint }
      })

      logger.info(`[BlackBox] Recorded snapshot ${snapshot.id} (fingerprint: ${fingerprint})`)
      return snapshot
    },

    clearSnapshots: () => {
      set({ snapshots: [], lastFingerprint: null })
      logger.info('[BlackBox] Cleared all snapshots')
    },

    replaySnapshot: (snapshot: SimulationSnapshot) => {
      const benchStore = useOpticalBenchStore.getState()

      // Hydrate the optical bench with the snapshot's layout
      const success = benchStore.importDesign(JSON.stringify({
        version: snapshot.layout.version,
        components: snapshot.layout.components,
      }))

      if (success) {
        // Run the simulation
        benchStore.setSimulating(true)
        logger.info(`[BlackBox] Replayed snapshot ${snapshot.id} (fingerprint: ${snapshot.fingerprint})`)
      } else {
        logger.error(`[BlackBox] Failed to replay snapshot ${snapshot.id}`)
      }
    },

    replayFromJSON: (json: string) => {
      try {
        const parsed = JSON.parse(json)

        // Accept both full snapshot format and bare layout format
        let layout: OpticalBenchLayout
        if (parsed.layout && parsed.layout.components) {
          // Full snapshot format
          layout = parsed.layout
        } else if (parsed.components && Array.isArray(parsed.components)) {
          // Bare layout or export format
          layout = {
            version: parsed.version ?? 1,
            components: parsed.components,
            canvasSize: parsed.canvasSize ?? { width: 800, height: 400 },
          }
        } else {
          logger.error('[BlackBox] Invalid JSON format: no components found')
          return false
        }

        const benchStore = useOpticalBenchStore.getState()
        const success = benchStore.importDesign(JSON.stringify({
          version: layout.version,
          components: layout.components,
        }))

        if (success) {
          benchStore.setSimulating(true)
          logger.info('[BlackBox] Replayed from JSON input')
          // Record a snapshot of the replayed state after physics settles
          setTimeout(() => {
            get().recordSnapshot('Replayed from pasted JSON')
          }, 100)
          return true
        }

        return false
      } catch (e) {
        logger.error('[BlackBox] Failed to parse replay JSON:', e)
        return false
      }
    },

    exportSnapshot: (snapshotId: string) => {
      const snapshot = get().snapshots.find(s => s.id === snapshotId)
      if (!snapshot) return null

      return JSON.stringify({
        _type: 'PolarCraft-SimulationSnapshot',
        _version: 1,
        ...snapshot,
      }, null, 2)
    },

    exportLatest: () => {
      const { snapshots } = get()
      if (snapshots.length === 0) return null
      return get().exportSnapshot(snapshots[snapshots.length - 1].id)
    },

    exportCurrentAsReport: (description?: string) => {
      // Record current state first
      const snapshot = get().recordSnapshot(description)

      const benchState = useOpticalBenchStore.getState()

      const report = {
        _type: 'PolarCraft-PhysicsReport',
        _version: 1,
        reportedAt: new Date().toISOString(),
        description: description ?? 'Physics issue reported by user',
        // Environment info
        environment: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        },
        // Current layout
        layout: {
          version: 1,
          components: benchState.components,
          canvasSize: benchState.canvasSize,
        },
        // Simulation result
        simulation: {
          segmentCount: benchState.lightSegments.length,
          isSimulating: benchState.isSimulating,
          formulas: benchState.currentFormulas,
        },
        // PhysicsInterpreter analysis (if snapshot was created)
        analysis: snapshot?.result ?? null,
        // Fingerprint for deduplication
        fingerprint: snapshot?.fingerprint ?? 'not-recorded',
      }

      return JSON.stringify(report, null, 2)
    },

    setAutoRecord: (enabled: boolean) => {
      set({ autoRecord: enabled })
    },

    removeSnapshot: (id: string) => {
      set(state => ({
        snapshots: state.snapshots.filter(s => s.id !== id),
      }))
    },
  })
)

// ========== Auto-Record Subscription ==========

/**
 * Subscribe to optical bench store changes.
 * When auto-record is enabled and the simulation recalculates,
 * automatically capture a snapshot.
 */
let unsubscribe: (() => void) | null = null

export function enableAutoRecording() {
  if (unsubscribe) return // Already subscribed

  unsubscribe = useOpticalBenchStore.subscribe(
    (state) => state.lightSegments,
    (segments) => {
      const blackBox = useSimulationBlackBoxStore.getState()
      if (blackBox.autoRecord && segments.length > 0) {
        blackBox.recordSnapshot()
      }
    }
  )
}

export function disableAutoRecording() {
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }
}
