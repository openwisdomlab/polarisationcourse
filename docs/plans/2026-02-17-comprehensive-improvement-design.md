# PolarCraft Comprehensive Improvement Design

**Date**: 2026-02-17
**Status**: Approved
**Approach**: Parallel Slices (vertical integration across Physics + UX + Collaboration)

## Problem Statement

PolarCraft has three systemic issues:

1. **Physics fragmentation**: Three disconnected physics engines (Legacy Scalar, Jones Calculus, Unified) produce inconsistent results across games, demos, and Optical Studio
2. **Information overload**: 200+ content elements flat-listed without learning scaffolding, prerequisites, or progress visibility
3. **Collaboration gap**: Backend skeleton exists (NestJS + Colyseus) but zero frontend integration; virtual research group is UI mockup

## Constraints

- 6 homepage modules stay unchanged (structure and navigation)
- Improvements happen *within* each module
- Zero breaking changes to existing game behavior
- localStorage-first collaboration (no server dependency)

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Physics engine | Dual-layer with unified API | Games keep simplified model; demos/studio get accurate science |
| UX guidance | Smart recommendations + prerequisites | Respects exploration freedom while preventing confusion |
| Collaboration | Async (submit → review → feedback → showcase) | Works offline, compatible with any LMS via JSON export |
| Team structure | 4 agents (physics, UX, course/collab, science) | Independent work domains with clear interfaces |
| Rendering engine | Enhance existing Three.js shaders + plan TSL/WebGPU upgrade | PBRT/Mitsuba/DiffTaichi cannot run in browser; existing unified physics is already excellent |

## Rendering Engine Decision (Updated 2026-02-17)

### Evaluated Engines

| Engine | Browser? | Polarization? | Real-time? | Verdict |
|--------|----------|---------------|------------|---------|
| PBRT-v4 | WASM possible but impractical (50x50px max) | No | No (minutes/frame) | NOT RECOMMENDED |
| Mitsuba 3 | Cannot compile to WASM (Dr.Jit/LLVM deps) | Excellent (Stokes transport) | No | NOT RECOMMENDED (use as reference) |
| DiffTaichi | taichi.js exists (WebGPU) | No native support | Possible | OVERKILL for education |

### Recommended Path

**Tier 1 (Now):** Enhance existing `LightBeams.tsx` custom GLSL shaders — full Stokes uniform, Poincare color mapping, E-vector ellipse animation

**Tier 2 (Future):** Upgrade Three.js from 0.160.1 → r171+ for TSL (Three.js Shading Language) + WebGPU compute shaders — enables GPU-accelerated Mueller chain evaluation and interference pattern rendering

**Key insight:** PolarCraft's `src/core/physics/unified/` already implements the same mathematical framework (Jones, Stokes, Mueller, Fresnel) that Mitsuba 3 uses internally. The gap is GPU-accelerated visualization, not physics computation.

---

## Dimension 1: Physics — Unified API Integration

### Current State

| Engine | Location | Used By | Accuracy |
|--------|----------|---------|----------|
| Legacy Scalar | `LightPhysics.ts` | 3D/2D games | Simplified (4 angles, binary phase) |
| Jones Calculus | `WaveOptics.ts`, `JonesCalculus.ts` | Optical Bench Store | Good (Jones vectors) but marked @deprecated |
| Unified System | `src/core/physics/unified/` (17 modules, 6,135 lines) | **Nothing** — complete but unused | Excellent (Coherency, Mueller, Fresnel, dispersion) |

### Design

Create `src/core/api.ts` as a thin facade:

```typescript
// Unified Physics API
interface UnifiedPhysicsAPI {
  mode: 'game' | 'science'

  // Core operations
  trace(scene: OpticalScene): TraceResult
  analyze(state: LightState): PolarizationInfo
  createSource(params: SourceParams): LightState
  getMatrix(component: OpticalComponent): TransferMatrix
}
```

**Routing**:
- `mode: 'game'` → `LegacyAdapter.ts` → existing `LightPhysics.ts` behavior
- `mode: 'science'` → `CoherencyMatrix` + `LightTracer` + `OpticalSurface`

### Migration Path

1. Create `src/core/api.ts` facade
2. Wire `LegacyAdapter.ts` (already written) for game mode
3. Rewire `opticalBenchStore.calculateLightPaths()` from `JonesCalculus.ts` to unified API
4. Migrate demos one-by-one to unified API
5. Calculators use unified math modules (`src/core/math/`)

### Scientific Fixes

| Issue | Current | After |
|-------|---------|-------|
| QWP in games | 45-degree rotator | Keep simplified but labeled "Simplified QWP" |
| QWP in demos/studio | Jones matrix | True phase retardation via unified `OpticalSurface.WavePlate` |
| HWP | 90-degree rotator | Same pattern as QWP |
| Phase | Binary ±1 (games) | Game stays binary; science mode uses continuous 0-2π |
| Malus's Law | 3 implementations | One in unified, adapter maps for legacy |

---

## Dimension 2: UX — Guided Learning Within 6 Modules

### Current State

- 21 demos flat-listed without scaffolding
- No "start here" signpost
- Discovery system exists (28 discoveries, `discoveryStore.ts`) but not surfaced in navigation
- Same content accessible via multiple paths without guidance

### Design

#### A. Prerequisites Data Structure

```typescript
// New: src/data/learningPaths.ts
const DEMO_PREREQUISITES: Record<string, string[]> = {
  'light-wave': [],                    // No prereqs — entry point
  'em-wave': ['light-wave'],
  'polarization-intro': ['em-wave'],
  'polarization-types': ['polarization-intro'],
  'malus-law-graph': ['polarization-types'],
  'three-polarizers': ['malus-law-graph'],
  'polarization-state': ['polarization-intro'],
  'malus-law': ['polarization-types'],
  'birefringence': ['malus-law'],
  'waveplate': ['birefringence'],
  // ... all 21 demos mapped
}

const CROSS_MODULE_LINKS: Record<string, CrossModuleLink[]> = {
  'malus-law': [
    { module: 'studio', target: 'experiment-malus', label: 'Try in Optical Studio' },
    { module: 'games', target: 'level-1', label: 'Play Polarizer Puzzle' },
  ],
  // ... contextual links between modules
}
```

#### B. LearningPath Component

Each module page gets a progress bar and "next recommended" indicator:

```
┌─ Module Page Header ──────────────────────┐
│ Progress: ████████░░ 73% (8/11 demos)     │
│ Recommended: "Try Birefringence Demo" →   │
└───────────────────────────────────────────┘
```

Uses `discoveryStore` completion data to calculate progress.

#### C. DemosPage Restructuring

- Group by unit (existing) with collapsible sections
- Each demo card shows: status (completed/available/locked), difficulty, estimated time
- "Start Here" badge on first uncompleted, prerequisites-met demo
- Locked demos show: "Complete [X] first"
- Completed demos show checkmark

#### D. Homepage Progress Rings

Each of the 6 module cards gets a subtle progress ring (SVG circle) showing completion percentage. Module structure stays unchanged.

---

## Dimension 3: Collaboration — Async Model

### Current State

- `server/` has NestJS + Colyseus skeleton (WebSocket handlers, game rooms)
- Frontend has zero integration with backend
- `LabPage.tsx` virtual research group is UI mockup

### Design — Phase 1 (localStorage, no server)

#### A. CollaborationStore

```typescript
// New: src/stores/collaborationStore.ts
interface CollaborationState {
  projects: ResearchProject[]
  pendingReviews: ReviewRequest[]
  completedReviews: ReviewResult[]
  publishedWorks: PublishedWork[]

  // Actions
  createProject: (design: SavedDesign, metadata: ProjectMetadata) => string
  submitForReview: (projectId: string) => string  // Returns export JSON
  importForReview: (json: string) => void
  submitReview: (projectId: string, feedback: ReviewFeedback) => void
  publishToShowcase: (projectId: string) => void

  // Export/Import
  exportProject: (id: string) => string  // JSON blob
  importProject: (json: string) => void
}

interface ResearchProject {
  id: string
  title: string
  description: string
  opticalDesign: SavedDesign       // From opticalBenchStore
  findings: string[]
  simulationResults: LightSegment[]
  status: 'draft' | 'submitted' | 'reviewed' | 'published'
  reviews: ReviewResult[]
  createdAt: number
  updatedAt: number
}
```

#### B. Workflow

1. **Create**: In Optical Studio, "Save as Research Project" button → opens project form
2. **Export**: "Export for Review" → downloads JSON file
3. **Import**: In Research module, "Import Project" → loads peer's project, runs simulation
4. **Review**: Write feedback form (observations, suggestions, rating)
5. **Showcase**: Published projects appear in Gallery module showcase tab

#### C. Sharing Mechanism

JSON export/import — works with any communication channel:
- WeChat file sharing
- Email attachment
- LMS upload
- USB drive

When backend is ready: same store interface, switch persistence from localStorage to REST API.

---

## Dimension 4: Science Verification (Cross-cutting)

### Per-Demo Verification

Each demo gets reviewed against:
1. Formulas match textbook definitions
2. Visualizations correctly represent the phenomenon
3. Slider ranges are physically meaningful
4. Edge cases handled (0° polarizer, crossed polarizers, etc.)
5. Units and labels correct
6. Jones/Mueller/Stokes representations consistent

### Implementation

- Verified demos get `// @verified: YYYY-MM-DD` comment header
- Unverified demos show subtle "Under Review" indicator
- Science advisor creates `docs/physics-verification.md` tracking status

---

## Slice Execution Plan

### Slice 1: Foundation

| Agent | Task | Key Files |
|-------|------|-----------|
| Physics Architect | Create `src/core/api.ts` facade, wire LegacyAdapter | `src/core/api.ts`, `src/core/physics/unified/LegacyAdapter.ts` |
| UX Architect | Create prerequisites data structure, LearningPath component | `src/data/learningPaths.ts`, `src/components/shared/LearningPath.tsx` |
| Course/Collab Designer | Create `collaborationStore.ts` with project data model | `src/stores/collaborationStore.ts` |
| Science Advisor | Audit Unit 0 demos (10 demos) for scientific accuracy | `src/components/demos/basics/*.tsx` |

### Slice 2: Core Features

| Agent | Task | Key Files |
|-------|------|-----------|
| Physics Architect | Migrate OpticalBench to unified API | `src/stores/opticalBenchStore.ts` |
| UX Architect | DemosPage guided view + progress indicators | `src/pages/DemosPage.tsx` |
| Course/Collab Designer | Research project create/export/import UI | `src/pages/LabPage.tsx` |
| Science Advisor | Audit Unit 1-2 demos for scientific accuracy | `src/components/demos/unit1/*.tsx`, `unit2/*.tsx` |

### Slice 3: Integration

| Agent | Task | Key Files |
|-------|------|-----------|
| Physics Architect | Migrate first batch of demos to unified API | Demo components |
| UX Architect | Cross-module recommendations + discoveryStore integration | Module hub pages |
| Course/Collab Designer | Peer review workflow + Gallery showcase section | `src/pages/ExperimentsPage.tsx` |
| Science Advisor | Audit Unit 3-5 demos | Remaining demo components |

### Slice 4: Polish

| Agent | Task | Key Files |
|-------|------|-----------|
| Physics Architect | Game physics labels (QWP/HWP), calculator migration | Game components, calculator pages |
| UX Architect | Homepage progress rings + final polish | `src/pages/HomePage.tsx` |
| Course/Collab Designer | JSON sharing documentation, UX refinement | Documentation |
| Science Advisor | Final consistency pass, physics-verification.md | Cross-cutting |

---

## Success Criteria

1. **Physics**: All demos and Optical Studio use unified API; games unchanged but labeled
2. **UX**: Every demo has prerequisites; every module shows progress; "start here" is clear
3. **Collaboration**: Students can create, export, import, review, and showcase research projects
4. **Science**: All 21 demos verified with `@verified` tags; `physics-verification.md` complete
5. **Zero regressions**: 169/169 tests pass; build succeeds; all existing functionality preserved
