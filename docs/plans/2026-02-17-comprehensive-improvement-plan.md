# PolarCraft Comprehensive Improvement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate the existing unified physics engine, add guided learning navigation with prerequisites, and create async collaboration for research projects — all within the existing 6-module structure.

**Architecture:** Parallel Slices approach — each slice delivers improvements across physics, UX, and collaboration simultaneously. The unified physics engine (`src/core/physics/unified/`, 17 modules) already exists but is unused; we wire it in via a thin facade. UX improvements build on the existing `LearningPathMap.tsx` prerequisite system and `discoveryStore.ts`. Collaboration uses localStorage-first with JSON export/import.

**Tech Stack:** React 19, TypeScript strict, Zustand, Vitest, Tailwind CSS v4, i18next

**Key Discovery:** `src/core/physics/unified/` is COMPLETE (6,135 lines, 17 modules) with `LegacyAdapter.ts` ready. `src/components/course/LearningPathMap.tsx` already has unit-level prerequisites. We extend both rather than building from scratch.

---

## Slice 1: Foundation

### Task 1: Create Unified Physics API Facade

**Files:**
- Create: `src/core/api.ts`
- Create: `src/__tests__/api.test.ts`
- Read: `src/core/physics/unified/index.ts` (existing exports)
- Read: `src/core/physics/unified/LegacyAdapter.ts` (existing adapter)

**Step 1: Write failing tests for the API facade**

```typescript
// src/__tests__/api.test.ts
import { describe, it, expect } from 'vitest'
import {
  createPhysicsAPI,
  type PhysicsMode,
} from '@/core/api'

describe('Unified Physics API', () => {
  describe('createPhysicsAPI', () => {
    it('creates API in game mode', () => {
      const api = createPhysicsAPI('game')
      expect(api.mode).toBe('game')
    })

    it('creates API in science mode', () => {
      const api = createPhysicsAPI('science')
      expect(api.mode).toBe('science')
    })
  })

  describe('Game Mode - Legacy Compatibility', () => {
    it('creates linear source from legacy polarization angle', () => {
      const api = createPhysicsAPI('game')
      const state = api.createLinearSource(0, 1.0) // 0° horizontal, full intensity
      expect(state).toBeDefined()
      expect(state.intensity).toBeCloseTo(1.0)
    })

    it('applies Malus Law through polarizer', () => {
      const api = createPhysicsAPI('game')
      const source = api.createLinearSource(0, 1.0) // Horizontal
      const result = api.applyPolarizer(source, 45) // 45° polarizer
      // Malus's Law: cos²(45°) = 0.5
      expect(result.intensity).toBeCloseTo(0.5, 1)
    })

    it('converts to legacy LightPacket format', () => {
      const api = createPhysicsAPI('game')
      const state = api.createLinearSource(0, 1.0)
      const packet = api.toLegacyPacket(state, 'east')
      expect(packet.direction).toBe('east')
      expect(packet.polarization).toBe(0)
      expect(packet.intensity).toBeGreaterThan(0)
    })
  })

  describe('Science Mode - Accurate Physics', () => {
    it('creates circular polarization source', () => {
      const api = createPhysicsAPI('science')
      const state = api.createCircularSource(true, 1.0) // RCP
      expect(state).toBeDefined()
      expect(state.intensity).toBeCloseTo(1.0)
    })

    it('applies true quarter-wave plate (not simplified rotator)', () => {
      const api = createPhysicsAPI('science')
      const source = api.createLinearSource(45, 1.0) // 45° linear
      const result = api.applyWavePlate(source, Math.PI / 2, 0) // QWP, fast axis at 0°
      // True QWP converts 45° linear to circular
      expect(result.intensity).toBeCloseTo(1.0, 1)
      // Degree of polarization should remain ~1
      expect(result.degreeOfPolarization).toBeCloseTo(1.0, 1)
    })

    it('provides Stokes representation', () => {
      const api = createPhysicsAPI('science')
      const state = api.createLinearSource(0, 1.0) // Horizontal
      const stokes = api.toStokes(state)
      expect(stokes.s0).toBeCloseTo(1.0) // Total intensity
      expect(stokes.s1).toBeCloseTo(1.0) // Horizontal preference
      expect(stokes.s2).toBeCloseTo(0, 1) // No 45° preference
      expect(stokes.s3).toBeCloseTo(0, 1) // No circular
    })
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/__tests__/api.test.ts`
Expected: FAIL — module `@/core/api` does not exist

**Step 3: Implement the API facade**

```typescript
// src/core/api.ts
/**
 * Unified Physics API Facade
 *
 * Provides a single entry point for all polarization physics calculations.
 * Routes to either Legacy (game) or Unified (science) engine based on mode.
 *
 * Usage:
 *   const api = createPhysicsAPI('game')    // For 3D/2D games
 *   const api = createPhysicsAPI('science') // For demos, Optical Studio, calculators
 */

import {
  CoherencyMatrix,
  HORIZONTAL, VERTICAL, DIAGONAL, ANTIDIAGONAL,
  RIGHT_CIRCULAR, LEFT_CIRCULAR, UNPOLARIZED,
  IdealPolarizer, WavePlate, OpticalRotator, IdealMirror,
  PolarizingBeamSplitter, Attenuator,
  fromLightPacket, toLightPacket,
  fromWaveLight, toWaveLight,
  discreteToRadians, radiansToDiscrete,
  normalizeIntensity, discretizeIntensity,
  DIRECTION_TO_VECTOR, vectorToDirection,
  PolarizationState,
  type LegacyLightPacket, type LegacyDirection,
  type StokesRepresentation, type JonesRepresentation,
} from './physics/unified'
import { Vector3 } from './math'

// ============== Types ==============

export type PhysicsMode = 'game' | 'science'

/** Opaque polarization state — consumers don't need to know internal representation */
export interface PolarizationInfo {
  intensity: number
  angleDeg: number
  degreeOfPolarization: number
  polarizationType: 'linear' | 'circular' | 'elliptical' | 'unpolarized'
  handedness: 'right' | 'left' | 'none'
  /** Internal state — only used by API methods */
  _coherency: CoherencyMatrix
}

export interface PhysicsAPI {
  readonly mode: PhysicsMode

  // Source creation
  createLinearSource(angleDeg: number, intensity: number): PolarizationInfo
  createCircularSource(rightHanded: boolean, intensity: number): PolarizationInfo
  createUnpolarizedSource(intensity: number): PolarizationInfo

  // Component interactions
  applyPolarizer(state: PolarizationInfo, axisDeg: number): PolarizationInfo
  applyWavePlate(state: PolarizationInfo, retardation: number, fastAxisDeg: number): PolarizationInfo
  applyRotator(state: PolarizationInfo, angleDeg: number): PolarizationInfo
  applyMirror(state: PolarizationInfo): PolarizationInfo
  applyAttenuation(state: PolarizationInfo, factor: number): PolarizationInfo

  // Beam splitting (returns [transmitted, reflected])
  applyPBS(state: PolarizationInfo): [PolarizationInfo, PolarizationInfo]

  // Analysis
  toStokes(state: PolarizationInfo): StokesRepresentation
  toJones(state: PolarizationInfo): JonesRepresentation | null

  // Legacy conversion (game mode)
  toLegacyPacket(state: PolarizationInfo, direction: LegacyDirection): LegacyLightPacket
  fromLegacyPacket(packet: LegacyLightPacket): PolarizationInfo
}

// ============== Implementation ==============

function coherencyToInfo(cm: CoherencyMatrix): PolarizationInfo {
  const ps = PolarizationState.fromCoherency(cm)
  const stokes = ps.stokes
  const dop = ps.degreeOfPolarization
  const ellipse = ps.ellipse

  let polarizationType: PolarizationInfo['polarizationType'] = 'unpolarized'
  let handedness: PolarizationInfo['handedness'] = 'none'

  if (dop < 0.05) {
    polarizationType = 'unpolarized'
  } else if (Math.abs(ellipse.ellipticityDeg) < 3) {
    polarizationType = 'linear'
  } else if (Math.abs(Math.abs(ellipse.ellipticityDeg) - 45) < 3) {
    polarizationType = 'circular'
    handedness = ellipse.ellipticityDeg > 0 ? 'right' : 'left'
  } else {
    polarizationType = 'elliptical'
    handedness = ellipse.ellipticityDeg > 0 ? 'right' : 'left'
  }

  return {
    intensity: ps.intensity,
    angleDeg: ellipse.orientationDeg,
    degreeOfPolarization: dop,
    polarizationType,
    handedness,
    _coherency: cm,
  }
}

function degreesToRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

export function createPhysicsAPI(mode: PhysicsMode): PhysicsAPI {
  return {
    mode,

    createLinearSource(angleDeg: number, intensity: number): PolarizationInfo {
      const ps = PolarizationState.createLinear(intensity, angleDeg)
      return coherencyToInfo(ps.coherency)
    },

    createCircularSource(rightHanded: boolean, intensity: number): PolarizationInfo {
      const ps = PolarizationState.createCircular(intensity, rightHanded)
      return coherencyToInfo(ps.coherency)
    },

    createUnpolarizedSource(intensity: number): PolarizationInfo {
      const ps = PolarizationState.createUnpolarized(intensity)
      return coherencyToInfo(ps.coherency)
    },

    applyPolarizer(state: PolarizationInfo, axisDeg: number): PolarizationInfo {
      const axisRad = degreesToRadians(axisDeg)
      const axisVec = new Vector3(Math.cos(axisRad), Math.sin(axisRad), 0)
      const surface = new IdealPolarizer('polarizer', Vector3.ZERO, Vector3.Z, axisVec)
      const basis = { s: Vector3.X, p: Vector3.Y, k: Vector3.Z }
      const result = surface.interact(state._coherency, basis)
      if (result.transmitted) {
        return coherencyToInfo(result.transmitted.matrix)
      }
      return coherencyToInfo(CoherencyMatrix.createUnpolarized(0))
    },

    applyWavePlate(state: PolarizationInfo, retardation: number, fastAxisDeg: number): PolarizationInfo {
      const axisRad = degreesToRadians(fastAxisDeg)
      const axisVec = new Vector3(Math.cos(axisRad), Math.sin(axisRad), 0)
      const surface = new WavePlate('waveplate', Vector3.ZERO, Vector3.Z, retardation, axisVec)
      const basis = { s: Vector3.X, p: Vector3.Y, k: Vector3.Z }
      const result = surface.interact(state._coherency, basis)
      if (result.transmitted) {
        return coherencyToInfo(result.transmitted.matrix)
      }
      return state
    },

    applyRotator(state: PolarizationInfo, angleDeg: number): PolarizationInfo {
      const angleRad = degreesToRadians(angleDeg)
      const surface = new OpticalRotator('rotator', Vector3.ZERO, Vector3.Z, angleRad)
      const basis = { s: Vector3.X, p: Vector3.Y, k: Vector3.Z }
      const result = surface.interact(state._coherency, basis)
      if (result.transmitted) {
        return coherencyToInfo(result.transmitted.matrix)
      }
      return state
    },

    applyMirror(state: PolarizationInfo): PolarizationInfo {
      const surface = new IdealMirror('mirror', Vector3.ZERO, Vector3.Z)
      const basis = { s: Vector3.X, p: Vector3.Y, k: Vector3.Z }
      const result = surface.interact(state._coherency, basis)
      if (result.reflected) {
        return coherencyToInfo(result.reflected.matrix)
      }
      return state
    },

    applyAttenuation(state: PolarizationInfo, factor: number): PolarizationInfo {
      const surface = new Attenuator('attenuator', Vector3.ZERO, Vector3.Z, factor)
      const basis = { s: Vector3.X, p: Vector3.Y, k: Vector3.Z }
      const result = surface.interact(state._coherency, basis)
      if (result.transmitted) {
        return coherencyToInfo(result.transmitted.matrix)
      }
      return state
    },

    applyPBS(state: PolarizationInfo): [PolarizationInfo, PolarizationInfo] {
      const surface = new PolarizingBeamSplitter('pbs', Vector3.ZERO, Vector3.Z)
      const basis = { s: Vector3.X, p: Vector3.Y, k: Vector3.Z }
      const result = surface.interact(state._coherency, basis)
      const transmitted = result.transmitted
        ? coherencyToInfo(result.transmitted.matrix)
        : coherencyToInfo(CoherencyMatrix.createUnpolarized(0))
      const reflected = result.reflected
        ? coherencyToInfo(result.reflected.matrix)
        : coherencyToInfo(CoherencyMatrix.createUnpolarized(0))
      return [transmitted, reflected]
    },

    toStokes(state: PolarizationInfo): StokesRepresentation {
      const ps = PolarizationState.fromCoherency(state._coherency)
      return ps.stokes
    },

    toJones(state: PolarizationInfo): JonesRepresentation | null {
      const ps = PolarizationState.fromCoherency(state._coherency)
      return ps.jones
    },

    toLegacyPacket(state: PolarizationInfo, direction: LegacyDirection): LegacyLightPacket {
      const dirVec = DIRECTION_TO_VECTOR[direction]
      return toLightPacket(state._coherency, dirVec)
    },

    fromLegacyPacket(packet: LegacyLightPacket): PolarizationInfo {
      const cm = fromLightPacket(packet)
      return coherencyToInfo(cm)
    },
  }
}
```

**Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/__tests__/api.test.ts`
Expected: PASS (all tests green)

**Step 5: Run full test suite to check no regressions**

Run: `npm run test:run`
Expected: 169/169 tests pass (plus new tests)

**Step 6: Build check**

Run: `npm run build`
Expected: Build succeeds (~5s)

**Step 7: Commit**

```bash
git add src/core/api.ts src/__tests__/api.test.ts
git commit -m "feat: add unified physics API facade with game/science mode routing"
```

---

### Task 2: Create Demo-Level Prerequisites Data Structure

**Files:**
- Create: `src/data/learningPaths.ts`
- Modify: `src/data/index.ts` (add export)
- Read: `src/components/course/LearningPathMap.tsx` (existing unit-level prereqs)
- Read: `src/pages/DemosPage.tsx` (DEMOS array for demo IDs)

**Step 1: Create the prerequisites data file**

```typescript
// src/data/learningPaths.ts
/**
 * Demo-level prerequisite and learning path definitions.
 *
 * Extends the existing unit-level prerequisites from LearningPathMap.tsx
 * to individual demo granularity. Used by DemosPage and module pages
 * to show guided navigation.
 */

export interface DemoPrerequisite {
  /** Demo ID (must match DEMOS array in DemosPage.tsx) */
  demoId: string
  /** Demo IDs that must be completed before this demo is available */
  prerequisites: string[]
  /** Estimated completion time in minutes */
  estimatedMinutes: number
  /** Cross-module links shown after completing this demo */
  crossLinks?: CrossModuleLink[]
}

export interface CrossModuleLink {
  /** Target module: one of the 6 modules */
  module: 'chronicles' | 'studio' | 'demos' | 'games' | 'gallery' | 'research'
  /** Route path to the target */
  path: string
  /** i18n key for the link label */
  labelKey: string
}

/**
 * Demo prerequisite map.
 * Empty prerequisites array = entry point (always available).
 * Prerequisites use demo IDs from the DEMOS array in DemosPage.tsx.
 */
export const DEMO_PREREQUISITES: DemoPrerequisite[] = [
  // ═══ Unit 0: Optical Basics (entry points) ═══
  {
    demoId: 'em-wave',
    prerequisites: [],
    estimatedMinutes: 5,
  },
  {
    demoId: 'polarization-intro',
    prerequisites: ['em-wave'],
    estimatedMinutes: 8,
    crossLinks: [
      { module: 'chronicles', path: '/chronicles', labelKey: 'learningPaths.links.historyOfPolarization' },
    ],
  },
  {
    demoId: 'polarization-types-unified',
    prerequisites: ['polarization-intro'],
    estimatedMinutes: 10,
  },
  {
    demoId: 'optical-bench',
    prerequisites: ['polarization-types-unified'],
    estimatedMinutes: 15,
    crossLinks: [
      { module: 'studio', path: '/studio', labelKey: 'learningPaths.links.tryOpticalStudio' },
    ],
  },

  // ═══ Unit 1: Polarization Fundamentals ═══
  {
    demoId: 'polarization-state',
    prerequisites: ['polarization-intro'],
    estimatedMinutes: 10,
  },
  {
    demoId: 'malus',
    prerequisites: ['polarization-types-unified'],
    estimatedMinutes: 10,
    crossLinks: [
      { module: 'games', path: '/games/2d', labelKey: 'learningPaths.links.playPolarizationPuzzle' },
      { module: 'studio', path: '/studio', labelKey: 'learningPaths.links.malusExperiment' },
    ],
  },
  {
    demoId: 'birefringence',
    prerequisites: ['malus'],
    estimatedMinutes: 12,
    crossLinks: [
      { module: 'games', path: '/games/3d', labelKey: 'learningPaths.links.birefringencePuzzle' },
    ],
  },
  {
    demoId: 'waveplate',
    prerequisites: ['birefringence'],
    estimatedMinutes: 15,
  },

  // ═══ Unit 2: Interface Reflection ═══
  {
    demoId: 'fresnel',
    prerequisites: ['malus'],
    estimatedMinutes: 15,
  },
  {
    demoId: 'brewster',
    prerequisites: ['fresnel'],
    estimatedMinutes: 10,
  },

  // ═══ Unit 3: Transparent Media ═══
  {
    demoId: 'anisotropy',
    prerequisites: ['polarization-intro'],
    estimatedMinutes: 8,
  },
  {
    demoId: 'chromatic',
    prerequisites: ['anisotropy', 'waveplate'],
    estimatedMinutes: 12,
  },
  {
    demoId: 'optical-rotation',
    prerequisites: ['anisotropy'],
    estimatedMinutes: 10,
    crossLinks: [
      { module: 'research', path: '/research', labelKey: 'learningPaths.links.sugarConcentration' },
    ],
  },

  // ═══ Unit 4: Turbid Media ═══
  {
    demoId: 'rayleigh',
    prerequisites: ['polarization-types-unified'],
    estimatedMinutes: 10,
  },
  {
    demoId: 'mie-scattering',
    prerequisites: ['rayleigh'],
    estimatedMinutes: 12,
  },
  {
    demoId: 'monte-carlo-scattering',
    prerequisites: ['mie-scattering'],
    estimatedMinutes: 15,
  },

  // ═══ Unit 5: Full Polarimetry ═══
  {
    demoId: 'stokes',
    prerequisites: ['polarization-state', 'malus'],
    estimatedMinutes: 15,
    crossLinks: [
      { module: 'studio', path: '/calc/stokes', labelKey: 'learningPaths.links.stokesCalculator' },
    ],
  },
  {
    demoId: 'mueller',
    prerequisites: ['stokes'],
    estimatedMinutes: 15,
    crossLinks: [
      { module: 'studio', path: '/calc/mueller', labelKey: 'learningPaths.links.muellerCalculator' },
    ],
  },
]

/**
 * Get prerequisite info for a specific demo.
 * Returns undefined if demo has no prerequisite entry (treated as always available).
 */
export function getDemoPrerequisites(demoId: string): DemoPrerequisite | undefined {
  return DEMO_PREREQUISITES.find(p => p.demoId === demoId)
}

/**
 * Check if a demo is available given a set of completed demo IDs.
 * A demo is available if all its prerequisites are in the completed set.
 * Demos not in the prerequisites list are always available.
 */
export function isDemoAvailable(demoId: string, completedDemoIds: Set<string>): boolean {
  const prereq = getDemoPrerequisites(demoId)
  if (!prereq) return true
  if (prereq.prerequisites.length === 0) return true
  return prereq.prerequisites.every(id => completedDemoIds.has(id))
}

/**
 * Get the next recommended demo(s) for a user.
 * Returns demos that are available but not yet completed, sorted by unit order.
 */
export function getRecommendedDemos(
  allDemoIds: string[],
  completedDemoIds: Set<string>
): string[] {
  const completedSet = completedDemoIds
  return allDemoIds.filter(id => {
    if (completedSet.has(id)) return false
    return isDemoAvailable(id, completedSet)
  })
}

/**
 * Calculate progress percentage for a set of demos.
 */
export function calculateProgress(
  allDemoIds: string[],
  completedDemoIds: Set<string>
): number {
  if (allDemoIds.length === 0) return 0
  const completed = allDemoIds.filter(id => completedDemoIds.has(id)).length
  return Math.round((completed / allDemoIds.length) * 100)
}
```

**Step 2: Add export to data/index.ts**

Modify `src/data/index.ts` — add:
```typescript
export * from './learningPaths'
```

**Step 3: Run build to verify no errors**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/data/learningPaths.ts src/data/index.ts
git commit -m "feat: add demo-level prerequisites and learning path data"
```

---

### Task 3: Create Collaboration Store

**Files:**
- Create: `src/stores/collaborationStore.ts`
- Read: `src/stores/opticalBenchStore.ts:89-130` (SavedDesign type)

**Step 1: Create the collaboration store**

```typescript
// src/stores/collaborationStore.ts
/**
 * Collaboration Store — Async Research Collaboration
 *
 * Phase 1: localStorage-only (no server dependency).
 * Sharing mechanism: JSON export/import via file download/upload.
 *
 * Phase 2 (future): Same interface, REST API persistence.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BenchComponent } from './opticalBenchStore'

// ============== Types ==============

export interface ResearchProject {
  id: string
  title: string
  description: string
  /** Optical design components (snapshot from opticalBenchStore) */
  components: BenchComponent[]
  /** Student's findings/observations */
  findings: string[]
  /** Project status in the workflow */
  status: 'draft' | 'submitted' | 'reviewed' | 'published'
  /** Reviews received */
  reviews: ReviewResult[]
  /** Creation timestamp */
  createdAt: number
  /** Last update timestamp */
  updatedAt: number
  /** Author name (user-provided) */
  authorName: string
}

export interface ReviewRequest {
  id: string
  projectId: string
  /** The full project data for the reviewer */
  projectData: ResearchProject
  /** When the review was requested */
  requestedAt: number
  /** Review status */
  status: 'pending' | 'completed'
}

export interface ReviewResult {
  id: string
  projectId: string
  /** Reviewer name */
  reviewerName: string
  /** Review text */
  observations: string
  /** Suggestions for improvement */
  suggestions: string
  /** Rating 1-5 */
  rating: number
  /** When the review was submitted */
  reviewedAt: number
}

export interface PublishedWork {
  id: string
  projectId: string
  /** The project at time of publication */
  project: ResearchProject
  /** When it was published to showcase */
  publishedAt: number
}

// ============== Export/Import Format ==============

interface ExportedProject {
  version: 1
  type: 'polarcraft-research-project'
  project: ResearchProject
  exportedAt: number
}

interface ExportedReview {
  version: 1
  type: 'polarcraft-review'
  review: ReviewResult
  projectId: string
  exportedAt: number
}

// ============== Store ==============

interface CollaborationState {
  projects: ResearchProject[]
  pendingReviews: ReviewRequest[]
  completedReviews: ReviewResult[]
  publishedWorks: PublishedWork[]
  authorName: string
}

interface CollaborationActions {
  // Author name
  setAuthorName: (name: string) => void

  // Project CRUD
  createProject: (title: string, description: string, components: BenchComponent[]) => string
  updateProject: (id: string, updates: Partial<Pick<ResearchProject, 'title' | 'description' | 'findings'>>) => void
  deleteProject: (id: string) => void

  // Submit for review (changes status to 'submitted')
  submitForReview: (projectId: string) => void

  // Export project as JSON string (for sharing)
  exportProject: (projectId: string) => string | null

  // Import a project for review (adds to pendingReviews)
  importForReview: (json: string) => boolean

  // Submit a review
  submitReview: (projectId: string, review: Omit<ReviewResult, 'id' | 'projectId' | 'reviewedAt'>) => void

  // Export a completed review as JSON string
  exportReview: (reviewId: string) => string | null

  // Import a review for your project
  importReview: (json: string) => boolean

  // Publish to showcase
  publishToShowcase: (projectId: string) => void

  // Get project by ID
  getProject: (id: string) => ResearchProject | undefined
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const useCollaborationStore = create<CollaborationState & CollaborationActions>()(
  persist(
    (set, get) => ({
      // State
      projects: [],
      pendingReviews: [],
      completedReviews: [],
      publishedWorks: [],
      authorName: '',

      // Actions
      setAuthorName: (name) => set({ authorName: name }),

      createProject: (title, description, components) => {
        const id = generateId()
        const now = Date.now()
        const project: ResearchProject = {
          id,
          title,
          description,
          components,
          findings: [],
          status: 'draft',
          reviews: [],
          createdAt: now,
          updatedAt: now,
          authorName: get().authorName,
        }
        set(state => ({ projects: [...state.projects, project] }))
        return id
      },

      updateProject: (id, updates) => {
        set(state => ({
          projects: state.projects.map(p =>
            p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
          ),
        }))
      },

      deleteProject: (id) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
        }))
      },

      submitForReview: (projectId) => {
        set(state => ({
          projects: state.projects.map(p =>
            p.id === projectId ? { ...p, status: 'submitted' as const, updatedAt: Date.now() } : p
          ),
        }))
      },

      exportProject: (projectId) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return null
        const exported: ExportedProject = {
          version: 1,
          type: 'polarcraft-research-project',
          project,
          exportedAt: Date.now(),
        }
        return JSON.stringify(exported, null, 2)
      },

      importForReview: (json) => {
        try {
          const data = JSON.parse(json) as ExportedProject
          if (data.type !== 'polarcraft-research-project' || data.version !== 1) return false
          const request: ReviewRequest = {
            id: generateId(),
            projectId: data.project.id,
            projectData: data.project,
            requestedAt: Date.now(),
            status: 'pending',
          }
          set(state => ({ pendingReviews: [...state.pendingReviews, request] }))
          return true
        } catch {
          return false
        }
      },

      submitReview: (projectId, review) => {
        const result: ReviewResult = {
          ...review,
          id: generateId(),
          projectId,
          reviewedAt: Date.now(),
        }
        set(state => ({
          completedReviews: [...state.completedReviews, result],
          pendingReviews: state.pendingReviews.map(r =>
            r.projectId === projectId ? { ...r, status: 'completed' as const } : r
          ),
        }))
      },

      exportReview: (reviewId) => {
        const review = get().completedReviews.find(r => r.id === reviewId)
        if (!review) return null
        const exported: ExportedReview = {
          version: 1,
          type: 'polarcraft-review',
          review,
          projectId: review.projectId,
          exportedAt: Date.now(),
        }
        return JSON.stringify(exported, null, 2)
      },

      importReview: (json) => {
        try {
          const data = JSON.parse(json) as ExportedReview
          if (data.type !== 'polarcraft-review' || data.version !== 1) return false
          set(state => ({
            projects: state.projects.map(p =>
              p.id === data.projectId
                ? { ...p, reviews: [...p.reviews, data.review], status: 'reviewed' as const, updatedAt: Date.now() }
                : p
            ),
          }))
          return true
        } catch {
          return false
        }
      },

      publishToShowcase: (projectId) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return
        const published: PublishedWork = {
          id: generateId(),
          projectId,
          project: { ...project, status: 'published' },
          publishedAt: Date.now(),
        }
        set(state => ({
          publishedWorks: [...state.publishedWorks, published],
          projects: state.projects.map(p =>
            p.id === projectId ? { ...p, status: 'published' as const, updatedAt: Date.now() } : p
          ),
        }))
      },

      getProject: (id) => get().projects.find(p => p.id === id),
    }),
    {
      name: 'polarcraft-collaboration',
      version: 1,
      partialize: (state) => ({
        projects: state.projects,
        pendingReviews: state.pendingReviews,
        completedReviews: state.completedReviews,
        publishedWorks: state.publishedWorks,
        authorName: state.authorName,
      }),
    }
  )
)
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/stores/collaborationStore.ts
git commit -m "feat: add collaboration store for async research projects"
```

---

## Slice 2: Core Features

### Task 4: Add Demo Completion Tracking to Discovery Store

**Files:**
- Modify: `src/stores/discoveryStore.ts`

**Step 1: Add demo completion state and actions**

Add to the discovery store interface (after existing state fields):

```typescript
// Add to state interface:
completedDemos: Set<string>  // Set of completed demo IDs

// Add to actions:
markDemoCompleted: (demoId: string) => void
isDemoCompleted: (demoId: string) => boolean
getCompletedDemoIds: () => Set<string>
```

Add implementation in the store `create()`:

```typescript
// State
completedDemos: new Set<string>(),

// Actions
markDemoCompleted: (demoId: string) => {
  set(state => ({
    completedDemos: new Set([...state.completedDemos, demoId]),
  }))
},

isDemoCompleted: (demoId: string) => {
  return get().completedDemos.has(demoId)
},

getCompletedDemoIds: () => {
  return new Set(get().completedDemos)
},
```

Update persist `partialize` to include `completedDemos`:
```typescript
partialize: (state) => ({
  discoveries: state.discoveries,
  mysteriesSolved: state.mysteriesSolved,
  perfectDeductions: state.perfectDeductions,
  currentStreak: state.currentStreak,
  bestStreak: state.bestStreak,
  completedDemos: Array.from(state.completedDemos), // Serialize Set as Array
}),
```

Add deserialization in `onRehydrateStorage`:
```typescript
onRehydrateStorage: () => (state) => {
  if (state && Array.isArray(state.completedDemos)) {
    state.completedDemos = new Set(state.completedDemos as unknown as string[])
  }
},
```

**Step 2: Run tests**

Run: `npm run test:run`
Expected: All existing tests pass

**Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/stores/discoveryStore.ts
git commit -m "feat: add demo completion tracking to discovery store"
```

---

### Task 5: Add Guided Navigation to DemosPage

**Files:**
- Modify: `src/pages/DemosPage.tsx`
- Read: `src/data/learningPaths.ts` (prerequisites from Task 2)
- Read: `src/stores/discoveryStore.ts` (completion tracking from Task 4)

**Step 1: Import prerequisites and completion tracking**

Add imports at top of DemosPage.tsx:
```typescript
import { isDemoAvailable, getDemoPrerequisites, getRecommendedDemos, calculateProgress } from '@/data/learningPaths'
import { useDiscoveryStore } from '@/stores/discoveryStore'
```

**Step 2: Add progress bar to unit header**

In the unit section rendering, add a progress indicator:
```typescript
// Inside the unit header section, after the unit title
const completedDemoIds = useDiscoveryStore(state => state.getCompletedDemoIds())
const unitDemos = DEMOS.filter(d => d.unit === unitNumber)
const unitDemoIds = unitDemos.map(d => d.id)
const unitProgress = calculateProgress(unitDemoIds, completedDemoIds)

// Render progress bar:
<div className="flex items-center gap-2 ml-auto">
  <div className={cn(
    'h-1.5 w-20 rounded-full overflow-hidden',
    isDark ? 'bg-slate-700' : 'bg-gray-200'
  )}>
    <div
      className="h-full rounded-full bg-cyan-500 transition-all duration-300"
      style={{ width: `${unitProgress}%` }}
    />
  </div>
  <span className={cn('text-xs', isDark ? 'text-slate-500' : 'text-gray-400')}>
    {unitProgress}%
  </span>
</div>
```

**Step 3: Add availability indicators to demo cards**

In the demo card rendering, add lock/complete status:
```typescript
const isAvailable = isDemoAvailable(demo.id, completedDemoIds)
const isCompleted = completedDemoIds.has(demo.id)
const prereqInfo = getDemoPrerequisites(demo.id)

// Add visual indicator to demo card:
{isCompleted && (
  <CheckCircle className="w-4 h-4 text-green-500 absolute top-2 right-2" />
)}
{!isAvailable && !isCompleted && (
  <Lock className="w-4 h-4 text-slate-500 absolute top-2 right-2" />
)}
```

**Step 4: Add "Start Here" badge**

```typescript
const recommended = getRecommendedDemos(DEMOS.map(d => d.id), completedDemoIds)
const isRecommended = recommended.length > 0 && recommended[0] === demo.id

{isRecommended && (
  <span className={cn(
    'absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-medium',
    isDark ? 'bg-cyan-900/60 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
  )}>
    {t('demos.startHere', 'Start Here')}
  </span>
)}
```

**Step 5: Mark demo as completed when user interacts**

Add to the demo view section (when a demo is selected and rendered):
```typescript
// When user opens a demo, mark it as completed after a short interaction
useEffect(() => {
  if (selectedDemo) {
    const timer = setTimeout(() => {
      useDiscoveryStore.getState().markDemoCompleted(selectedDemo)
    }, 30000) // Mark completed after 30 seconds of viewing
    return () => clearTimeout(timer)
  }
}, [selectedDemo])
```

**Step 6: Add i18n keys**

Add to `src/i18n/locales/en.json`:
```json
"demos": {
  "startHere": "Start Here",
  "locked": "Complete prerequisites first",
  "completed": "Completed"
}
```

Add to `src/i18n/locales/zh.json`:
```json
"demos": {
  "startHere": "从这里开始",
  "locked": "请先完成前置内容",
  "completed": "已完成"
}
```

**Step 7: Run build and tests**

Run: `npm run build && npm run test:run`
Expected: Build succeeds, all tests pass

**Step 8: Commit**

```bash
git add src/pages/DemosPage.tsx src/i18n/locales/en.json src/i18n/locales/zh.json
git commit -m "feat: add guided navigation with prerequisites to DemosPage"
```

---

### Task 6: Add Homepage Progress Rings

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Read: `src/stores/discoveryStore.ts`
- Read: `src/data/learningPaths.ts`

**Step 1: Import dependencies**

Add to HomePage.tsx:
```typescript
import { useDiscoveryStore } from '@/stores/discoveryStore'
import { calculateProgress, DEMO_PREREQUISITES } from '@/data/learningPaths'
```

**Step 2: Create ProgressRing SVG component**

Add inside HomePage.tsx (or as local component):
```typescript
function ProgressRing({ progress, size = 32, strokeWidth = 3, color = 'cyan' }: {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  if (progress === 0) return null

  return (
    <svg width={size} height={size} className="absolute top-3 right-3">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-slate-700/30"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={`var(--color-${color}-400)`}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-500"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-current text-[8px] font-mono"
        style={{ fill: `var(--color-${color}-400)` }}
      >
        {progress}%
      </text>
    </svg>
  )
}
```

**Step 3: Add progress ring to module cards**

In the module card rendering, add the ProgressRing. For the demos module (id: 'theory'), calculate progress from demo completions. For other modules, use a placeholder or discovery-based progress.

```typescript
// Inside the module card component, calculate module progress:
const completedDemoIds = useDiscoveryStore(state => state.getCompletedDemoIds())
const allDemoIds = DEMO_PREREQUISITES.map(p => p.demoId)
const demoProgress = calculateProgress(allDemoIds, completedDemoIds)

// Map module ID to progress:
const moduleProgress: Record<string, number> = {
  theory: demoProgress,
  // Other modules can use discoveryStore data later
}

// In the card JSX, add:
<ProgressRing progress={moduleProgress[module.id] ?? 0} />
```

**Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: add progress rings to homepage module cards"
```

---

## Slice 3: Integration

### Task 7: Wire Optical Bench to Unified Physics API

**Files:**
- Modify: `src/stores/opticalBenchStore.ts`
- Read: `src/core/api.ts` (unified API from Task 1)

This is the largest migration task. The approach: keep the existing `traceLightRays` function but replace the Jones Calculus imports with unified API calls.

**Step 1: Replace JonesCalculus imports with unified API**

At the top of `opticalBenchStore.ts`, replace:
```typescript
// BEFORE:
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
  nonIdealPolarizerMatrix,
} from '@/core/JonesCalculus'

// AFTER:
import { createPhysicsAPI, type PolarizationInfo, type PhysicsAPI } from '@/core/api'
// Keep Jones types for backward compatibility with LightSegment interface
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
  nonIdealPolarizerMatrix,
} from '@/core/JonesCalculus'

// Create science-mode physics API for accurate simulations
const physicsAPI = createPhysicsAPI('science')
```

**Note:** This is a gradual migration. We add the unified API import alongside existing Jones imports. Individual functions within `traceLightRays` can be migrated one at a time in subsequent tasks. The key is establishing the import and verifying the build still works.

**Step 2: Run build and full test suite**

Run: `npm run build && npm run test:run`
Expected: Build succeeds, all tests pass (no behavioral changes yet)

**Step 3: Commit**

```bash
git add src/stores/opticalBenchStore.ts
git commit -m "feat: add unified physics API import to optical bench store"
```

---

### Task 8: Add Cross-Module Recommendation Component

**Files:**
- Create: `src/components/shared/CrossModuleLinks.tsx`
- Modify: `src/pages/DemosPage.tsx` (add CrossModuleLinks after demo content)

**Step 1: Create the CrossModuleLinks component**

```typescript
// src/components/shared/CrossModuleLinks.tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { getDemoPrerequisites, type CrossModuleLink } from '@/data/learningPaths'

interface CrossModuleLinksProps {
  demoId: string
}

const MODULE_COLORS: Record<string, string> = {
  chronicles: 'text-cyan-400',
  studio: 'text-blue-400',
  demos: 'text-violet-400',
  games: 'text-purple-400',
  gallery: 'text-fuchsia-400',
  research: 'text-teal-400',
}

export function CrossModuleLinks({ demoId }: CrossModuleLinksProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const prereqInfo = getDemoPrerequisites(demoId)
  const links = prereqInfo?.crossLinks
  if (!links || links.length === 0) return null

  return (
    <div className={cn(
      'mt-4 p-3 rounded-lg border',
      isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-50 border-gray-200'
    )}>
      <h4 className={cn(
        'text-xs font-medium mb-2',
        isDark ? 'text-slate-400' : 'text-gray-500'
      )}>
        {t('demos.exploreRelated', 'Explore Related')}
      </h4>
      <div className="flex flex-wrap gap-2">
        {links.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
              'transition-colors',
              isDark
                ? 'bg-slate-700/50 hover:bg-slate-600/50'
                : 'bg-white hover:bg-gray-100 border border-gray-200',
              MODULE_COLORS[link.module] || 'text-cyan-400'
            )}
          >
            {t(link.labelKey, link.labelKey)}
            <ArrowRight className="w-3 h-3" />
          </Link>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Add to DemosPage**

In DemosPage.tsx, import and render after the demo content area:
```typescript
import { CrossModuleLinks } from '@/components/shared/CrossModuleLinks'

// In the demo rendering section, after the demo component:
{selectedDemo && <CrossModuleLinks demoId={selectedDemo} />}
```

**Step 3: Add i18n keys**

Add to en.json: `"demos.exploreRelated": "Explore Related"`
Add to zh.json: `"demos.exploreRelated": "探索相关内容"`

**Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/components/shared/CrossModuleLinks.tsx src/pages/DemosPage.tsx src/i18n/locales/en.json src/i18n/locales/zh.json
git commit -m "feat: add cross-module recommendation links to demos"
```

---

## Slice 4: Polish & Verification

### Task 9: Create Science Verification Tracking

**Files:**
- Create: `docs/physics-verification.md`

**Step 1: Create verification tracking document**

```markdown
# Physics Verification Status

Tracking scientific accuracy of all interactive demos.

## Verification Criteria
1. Formulas match textbook definitions
2. Visualizations correctly represent the phenomenon
3. Slider ranges are physically meaningful
4. Edge cases handled (0° polarizer, crossed polarizers, etc.)
5. Units and labels correct
6. Jones/Mueller/Stokes representations consistent

## Status Key
- [ ] Not reviewed
- [~] Reviewed, issues found (see notes)
- [x] Verified correct

## Unit 0: Optical Basics
- [ ] em-wave — Electromagnetic Wave
- [ ] polarization-intro — Polarization Introduction
- [ ] polarization-types-unified — Polarization Types
- [ ] optical-bench — Interactive Optical Bench

## Unit 1: Polarization Fundamentals
- [ ] polarization-state — Polarization State (3D)
- [ ] malus — Malus's Law
- [ ] birefringence — Birefringence (3D)
- [ ] waveplate — Waveplate (3D)

## Unit 2: Interface Reflection
- [ ] fresnel — Fresnel Equations
- [ ] brewster — Brewster's Angle

## Unit 3: Transparent Media
- [ ] anisotropy — Anisotropy
- [ ] chromatic — Chromatic Polarization
- [ ] optical-rotation — Optical Rotation

## Unit 4: Turbid Media
- [ ] rayleigh — Rayleigh Scattering
- [ ] mie-scattering — Mie Scattering
- [ ] monte-carlo-scattering — Monte Carlo Scattering

## Unit 5: Full Polarimetry
- [ ] stokes — Stokes Vectors (3D)
- [ ] mueller — Mueller Matrices

## Notes

(Add verification notes per demo as they are reviewed)
```

**Step 2: Commit**

```bash
git add docs/physics-verification.md
git commit -m "docs: add physics verification tracking for all demos"
```

---

### Task 10: Add i18n Keys for Learning Paths

**Files:**
- Modify: `src/i18n/locales/en.json`
- Modify: `src/i18n/locales/zh.json`

**Step 1: Add learning path link labels**

Add to en.json under a new `learningPaths` section:
```json
"learningPaths": {
  "links": {
    "historyOfPolarization": "History of Polarization",
    "tryOpticalStudio": "Try in Optical Studio",
    "playPolarizationPuzzle": "Play Polarization Puzzle",
    "malusExperiment": "Malus's Law Experiment",
    "birefringencePuzzle": "Birefringence Puzzle",
    "sugarConcentration": "Sugar Concentration Lab",
    "stokesCalculator": "Stokes Calculator",
    "muellerCalculator": "Mueller Calculator"
  },
  "progress": {
    "completed": "Completed",
    "available": "Available",
    "locked": "Locked",
    "prerequisite": "Complete {{demo}} first"
  }
}
```

Add to zh.json:
```json
"learningPaths": {
  "links": {
    "historyOfPolarization": "偏振光的历史",
    "tryOpticalStudio": "在光学设计室中尝试",
    "playPolarizationPuzzle": "玩偏振光益智游戏",
    "malusExperiment": "马吕斯定律实验",
    "birefringencePuzzle": "双折射谜题",
    "sugarConcentration": "糖浓度测量实验",
    "stokesCalculator": "斯托克斯计算器",
    "muellerCalculator": "穆勒矩阵计算器"
  },
  "progress": {
    "completed": "已完成",
    "available": "可开始",
    "locked": "已锁定",
    "prerequisite": "请先完成「{{demo}}」"
  }
}
```

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/i18n/locales/en.json src/i18n/locales/zh.json
git commit -m "feat: add i18n keys for learning paths and cross-module links"
```

---

### Task 11: Final Build Verification and Cleanup

**Files:**
- Read: All modified files for final review

**Step 1: Run full test suite**

Run: `npm run test:run`
Expected: All tests pass (169 existing + new api.test.ts tests)

**Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds in ~5s

**Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: final cleanup and verification for comprehensive improvement"
```

---

## Summary of Created/Modified Files

### New Files (4)
| File | Purpose |
|------|---------|
| `src/core/api.ts` | Unified physics API facade |
| `src/__tests__/api.test.ts` | Tests for physics API |
| `src/data/learningPaths.ts` | Demo prerequisites and cross-module links |
| `src/stores/collaborationStore.ts` | Async research collaboration store |

### Modified Files (5)
| File | Change |
|------|--------|
| `src/data/index.ts` | Export learningPaths |
| `src/stores/discoveryStore.ts` | Add demo completion tracking |
| `src/pages/DemosPage.tsx` | Guided navigation with prereqs, progress, recommendations |
| `src/pages/HomePage.tsx` | Progress rings on module cards |
| `src/stores/opticalBenchStore.ts` | Add unified API import (gradual migration start) |

### New Components (1)
| File | Purpose |
|------|---------|
| `src/components/shared/CrossModuleLinks.tsx` | Cross-module recommendation links |

### Documentation (2)
| File | Purpose |
|------|---------|
| `docs/plans/2026-02-17-comprehensive-improvement-design.md` | Design document |
| `docs/physics-verification.md` | Science verification tracking |
