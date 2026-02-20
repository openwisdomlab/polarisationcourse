# Phase 3: Multi-Region Isometric World - Research

**Researched:** 2026-02-20
**Domain:** Multi-region scene management, animated transitions, cross-region beam physics, discovery persistence, lazy asset loading
**Confidence:** HIGH

## Summary

Phase 3 transforms the single 7x7 isometric scene from Phase 1-2 into 6 interconnected optical laboratory regions, each 12x12-15x15 tiles, with smooth animated transitions, cross-region beam propagation, cross-concept discovery connections, and session persistence. The existing codebase provides a strong foundation: the isometric coordinate system (`isometric.ts`), the composable `SceneElement` data model, the Mueller matrix physics pipeline (`useBeamPhysics.ts`), and the MotionValue-driven camera system (`useIsometricCamera.ts`) are all designed for extension rather than replacement.

The core architectural challenge is the **region management layer** -- introducing a `RegionDefinition` data structure that holds per-region scene elements, discoveries, equipment palettes, and visual themes, with a `RegionManager` orchestrating which region(s) are loaded and rendered at any time. The current `odysseyWorldStore` manages a single flat `sceneElements` array; Phase 3 must restructure this into per-region state while maintaining backward compatibility with all Phase 1-2 hooks (drag, rotation, beam physics, discovery). The approach is to keep the "active scene" pattern -- the store always holds the current region's elements as the active working set, with a region registry holding the full state for all regions.

The second major challenge is **cross-region beam propagation** (PHYS-04). When a beam reaches a region boundary, it must produce a visual indicator (glow/trail) at the edge, and when the student enters the adjacent region, the beam arrives from that boundary. This is conceptually simpler than real-time multi-region physics: each region calculates its own beam path independently, with boundary beams stored as "incoming beam" metadata on the adjacent region. The existing `calculateBeamPath` function needs extension to detect boundary intersections and emit boundary beam records.

The third challenge is **session persistence** (DISC-06). The store currently uses in-memory `Set<string>` for discoveries and `Map<string, number[]>` for rotation history -- neither is JSON-serializable. Zustand's `persist` middleware with a custom storage handler (converting Set to Array, Map to entries) solves this cleanly. Given the data volume (6 regions x ~60-80 elements + discoveries + camera state), localStorage's 5MB limit is sufficient; IndexedDB via `idb-keyval` is the recommended fallback if data grows beyond 2MB, but starting with localStorage is pragmatic.

**Primary recommendation:** Introduce a `RegionDefinition` type and `RegionRegistry` in the store; extend `odysseyWorldStore` with `activeRegionId`, `regions: Map<string, RegionState>`, and region transition actions; implement transitions as smooth camera slide animations using the existing `animate()` + `useMotionValue` pattern; add Zustand `persist` middleware with custom Set/Map serialization; extend `calculateBeamPath` with boundary detection for cross-region beams; use `React.lazy()` for per-region SVG decoration components to keep initial bundle size constant.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Region Themes & Spatial Layout:**
- **6 regions** total, each with a distinct visual atmosphere
- **Cross-disciplinary themes** -- physics concepts are NOT siloed by course unit; each region naturally interweaves multiple polarization principles (e.g., a "crystal lab" region might involve birefringence AND half-wave rotation AND Brewster's angle)
- **Lab/workbench visual style** throughout -- scientific instruments, experimental tables, apparatus -- like refined scientific illustrations
- **Strong visual differentiation** -- completely different color palettes and decoration styles per region (e.g., ice-blue crystal lab vs warm-orange refraction bench vs deep-purple scattering chamber)
- **Organic/adjacent layout** -- regions naturally neighbor each other without a central hub, like Zelda's Hyrule -- you can walk in any direction to reach a new region
- **Larger regions (12x12 ~ 15x15)** -- significantly bigger than Phase 1's 7x7, giving more exploration space and element placement positions
- **Mixed boundaries** -- some region edges have soft gradient transitions, others have explicit entrances (archways, tunnels, bridges) -- depends on what's natural for the scene pairing
- **Pre-placed + free placement** -- each region has pre-placed light sources and some optical elements, but students can also drag new elements from the equipment palette
- **Per-region equipment palette** -- different regions offer different optical elements in their palette, gradually introducing more tools as students explore
- **Light source mobility**: Claude's discretion (fixed vs movable, based on scene design needs)
- **Phase 1 scene fate**: Claude's discretion (keep and expand vs redesign from scratch, based on technical feasibility and design consistency)

**Region Transition Experience:**
- **Movement trigger**: Combined -- walk to region edge for soft transitions AND click explicit entrance objects (doors, archways) for hard transitions
- **Transition animation**: Smooth camera slide (pan to new region), ~0.8-1.2 seconds
- **During transition**: Briefly display region name overlay (like a game area title card)
- **Avatar behavior**: Avatar walks to edge and disappears, then reappears at the entrance point of the new region (not continuous walk-through)
- **World map/navigation**: Yes -- students can open a world map showing all 6 regions, click to fast-travel to any previously visited region
- **First discovery animation**: First time entering a new region has a special entrance animation (slightly different camera movement or reveal effect) to emphasize exploration
- **Element persistence**: Elements placed by the student remain when leaving a region -- they're still there when you come back

**Cross-Region Beams & Discovery Connections:**
- **Beam boundary behavior**: Light beams visibly extend at region edges -- a visual indicator (glow, arrow, trail) shows "this beam continues into the neighboring region"; entering that region shows the beam arriving from the boundary
- **Discovery connections -- dual display**: Both in-scene subtle visual cues (faint glowing lines/particles connecting related discovery points) AND constellation-style connections on the world map
- **Cross-region "big discoveries"**: Yes -- some meta-discoveries require combining knowledge/configurations from multiple regions, incentivizing thorough exploration
- **Discovery association logic**: Claude's discretion (hand-curated associations vs physics-based inference)

**Session Persistence & Return Experience:**
- **Persisted state**: Achieved discoveries + element positions/angles per region + avatar position + camera state + last visited region + environment parameter adjustments + legend state
- **Return experience**: Returning student resumes exactly where they left off -- same region, same position, same element arrangements
- **Per-region reset**: Students can reset individual regions to their initial state without affecting other regions' progress
- **Storage mechanism**: Claude's discretion (localStorage vs IndexedDB based on data complexity)

### Claude's Discretion
- Specific visual atmosphere design for each of the 6 regions (color palettes, decoration styles, lab equipment themes)
- Which physics concepts appear in which regions (cross-disciplinary distribution)
- Light source fixed vs movable per region
- Phase 1 scene: keep/expand or redesign
- Discovery association logic (preset vs physics-based)
- Storage technology (localStorage vs IndexedDB)
- World map visual design
- First-entry animation specifics

### Deferred Ideas (OUT OF SCOPE)
- Depth layers and theory emergence from discoveries -- Phase 4
- Embedded demo deep-dives from within the world -- Phase 4
- Full 6-unit physics coverage and visual polish -- Phase 5
- Cloud sync for cross-device progress -- future consideration
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| WRLD-02 | World consists of 4-6 interconnected optical environment regions, each with unique visual style and physics theme | RegionDefinition type with per-region theme config (colorPalette, decorationSet, platformMaterial), 6 region definitions with cross-disciplinary physics concept assignment, organic adjacency graph |
| WRLD-03 | Regions connected through animated transitions (parallax shifts, perspective slides), no page-load interruptions | Camera slide transition using existing `animate()` + `useMotionValue` pattern (~0.8-1.2s spring), region name overlay via AnimatePresence, avatar fade-out/fade-in at boundary points, all in-memory with no route changes |
| WRLD-05 | Regions lazy-load SVG/scene assets by proximity, maintaining smooth transitions between adjacent regions | `React.lazy()` for per-region decoration SVG components, preload adjacent regions when student enters a region, Suspense fallback with skeleton platforms during load |
| WRLD-06 | All regions freely accessible from the start, no mandatory prerequisites | No unlock/gate logic in region registry, world map shows all 6 regions clickable from first visit, adjacency graph has no blocked edges |
| PHYS-04 | Light beam can propagate across regions -- same beam exhibits different polarization phenomena in different environments | Boundary beam detection in `calculateBeamPath` (beam segment intersecting region bounds), `BoundaryBeam` record stored on adjacent region as incoming beam source, per-region physics recalculation produces different polarization behavior based on region's optical elements |
| DISC-02 | Knowledge-gated progression -- student advances through understanding, gating is invisible | Cross-region discoveries act as soft progression markers; new equipment appears in palettes as discoveries are made (not locked regions, but enriched palettes), giving returning students more tools |
| DISC-05 | Cross-concept "aha" connections -- discovery in one region reveals related phenomenon in another region | `DiscoveryConnection` type linking discovery pairs across regions, in-scene visual cues (faint glowing particles between connected points), constellation map on world map overlay showing connections |
| DISC-06 | Discovery state persists across sessions -- returning students continue from last understanding | Zustand `persist` middleware with custom Set/Map serialization to localStorage, full state restoration on page load including activeRegionId, per-region elements, discoveries, camera, avatar position |
</phase_requirements>

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.2.1 | UI rendering, `React.lazy()` for region code splitting | Already in project; lazy + Suspense for per-region decoration loading |
| Framer Motion | ^12.23.25 | Transition animations, AnimatePresence for region overlays, animate() for camera slide | Already in project; MotionValue camera system from Phase 1 handles transitions natively |
| Zustand | ^5.0.9 | State management with `persist` middleware for session persistence | Already in project; `persist` + `subscribeWithSelector` compose cleanly |
| Vite | ^5.0.10 | Build with automatic code splitting on dynamic `import()` | Already in project; Vite detects `React.lazy()` imports and creates separate chunks |

### Supporting (New -- 1 small dependency)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| idb-keyval | ^6.2.1 | IndexedDB key-value wrapper | Only if localStorage proves insufficient (>2MB persisted state); provides async get/set/del with <1KB bundle cost |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| localStorage for persistence | IndexedDB via idb-keyval | IndexedDB handles larger data and structured types natively, but has ~10x slower writes (0.17ms vs 0.017ms per write). For 6 regions of scene data (~50-200KB total), localStorage is sufficient. **Recommendation: Start with localStorage, add idb-keyval fallback if serialized state exceeds 2MB** |
| Zustand persist middleware | Manual localStorage read/write | Zustand persist handles hydration, merge strategies, versioning, and migration automatically. Manual approach is error-prone for complex nested state. **Recommendation: Use Zustand persist** |
| Single monolithic SVG for all regions | Per-region React.lazy SVG components | Monolithic SVG would be massive (6 x 15x15 regions = ~1350 tiles + decorations). Lazy loading keeps initial bundle constant. **Recommendation: Lazy load per-region decorations; platforms can share a single component** |
| GSAP for transition animations | Framer Motion animate() | GSAP has richer timeline control but is not in the project. Framer Motion's `animate()` + spring physics already powers the camera system. **Recommendation: Stay with Framer Motion -- the camera slide is a simple animate() call** |
| Route-based region navigation | In-memory region switching | Route changes would cause React unmount/remount, losing MotionValue camera state and causing visible flicker. **Recommendation: All regions share a single /odyssey/ route; region switching is store state change + camera animation** |

### Installation
```bash
# Only if localStorage proves insufficient (defer until needed):
pnpm add idb-keyval
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── stores/
│   └── odysseyWorldStore.ts        # Extended: activeRegionId, regions Map, persist middleware,
│                                   # region transition actions, boundary beam records
├── components/odyssey-world/
│   ├── OdysseyWorld.tsx            # Extended: region transition orchestration, world map overlay
│   ├── IsometricScene.tsx          # Extended: renders active region's elements, boundary indicators
│   ├── RegionTransition.tsx        # NEW: transition overlay (region name card, fade effects)
│   ├── WorldMap.tsx                # NEW: constellation-style map with fast-travel
│   ├── BoundaryIndicator.tsx       # NEW: SVG glow/arrow at region edges showing beam continuation
│   ├── DiscoveryConnection.tsx     # NEW: faint glowing lines between connected discovery points
│   ├── regions/
│   │   ├── regionRegistry.ts       # NEW: 6 RegionDefinition configs (themes, elements, adjacency)
│   │   ├── RegionDecorations.tsx   # NEW: lazy-loaded per-region decoration SVG components
│   │   ├── crystalLab.ts           # NEW: Crystal Lab region definition
│   │   ├── refractionBench.ts      # NEW: Refraction Bench region definition
│   │   ├── scatteringChamber.ts    # NEW: Scattering Chamber region definition
│   │   ├── wavePlatform.ts         # NEW: Wave Platform region definition
│   │   ├── interfaceLab.ts         # NEW: Interface Lab region definition
│   │   └── measurementStudio.ts    # NEW: Measurement Studio region definition
│   ├── hooks/
│   │   ├── useRegionTransition.ts  # NEW: region change detection, camera slide, avatar teleport
│   │   ├── useBoundaryBeams.ts     # NEW: cross-region beam boundary detection + indicator state
│   │   ├── useWorldMap.ts          # NEW: world map open/close, fast-travel, visited regions
│   │   ├── useSessionPersistence.ts # NEW: Zustand persist config with custom serialization
│   │   ├── useDiscoveryConnections.ts # NEW: cross-region discovery link tracking
│   │   └── ...existing hooks
│   └── ...existing components
└── lib/
    └── isometric.ts                # Extended: region bounds checking, boundary intersection math
```

### Pattern 1: Region Definition & Registry
**What:** A typed configuration object defining each region's theme, initial elements, boundary connections, equipment palette, and visual atmosphere.
**When to use:** Scene initialization, region transitions, world map rendering.
**Example:**
```typescript
// Source: Derived from existing SceneElement pattern in odysseyWorldStore.ts

/** Region visual theme configuration */
interface RegionTheme {
  id: string
  name: string  // Display name for title card
  nameKey: string  // i18n key for multi-language
  colorPalette: {
    background: [string, string]  // gradient stops
    platformFill: string
    platformStroke: string
    accentColor: string  // For decorations, glow tints
  }
  gridOpacity: number  // 0.01-0.04, varies per region atmosphere
}

/** Region adjacency definition */
interface RegionBoundary {
  direction: 'north' | 'south' | 'east' | 'west'
  targetRegionId: string
  type: 'soft' | 'archway' | 'tunnel' | 'bridge'
  /** Entry point in the target region (world coordinates) */
  entryPoint: { x: number; y: number }
  /** Exit point in this region (world coordinates) */
  exitPoint: { x: number; y: number }
}

/** Full region definition */
interface RegionDefinition {
  id: string
  theme: RegionTheme
  /** Grid dimensions (e.g., 13x13, 15x12) */
  gridWidth: number
  gridHeight: number
  /** World coordinate offset (for organic/adjacent layout) */
  worldOffsetX: number
  worldOffsetY: number
  /** Initial scene elements (platforms, light sources, pre-placed optics, decorations) */
  initialElements: SceneElement[]
  /** Available equipment palette items for this region */
  paletteItems: SceneElementType[]
  /** Boundary connections to other regions */
  boundaries: RegionBoundary[]
  /** Discovery configurations specific to this region */
  discoveries: DiscoveryConfig[]
  /** Cross-region discovery connections originating from this region */
  discoveryConnections: { fromDiscoveryId: string; toDiscoveryId: string; toRegionId: string }[]
}
```

### Pattern 2: Active Region Store Slice
**What:** The store manages one "active" region's elements as the working set, while maintaining a registry of all regions' persisted state. When switching regions, the active set is saved back and the new region's state is loaded.
**When to use:** Every region transition, scene initialization, persistence.
**Example:**
```typescript
// Source: Derived from existing odysseyWorldStore pattern + Zustand persist docs

interface RegionState {
  elements: SceneElement[]
  beamSegments: BeamSegment[]
  discoveries: Set<string>
  discoveredEncodings: DiscoveredEncodings
  rotationHistory: Map<string, number[]>
  incomingBeams: BoundaryBeam[]  // Beams arriving from adjacent regions
}

// New store state additions (extend existing OdysseyWorldState):
interface MultiRegionState {
  // Region management
  activeRegionId: string
  regions: Map<string, RegionState>
  visitedRegions: Set<string>

  // Transition state
  isTransitioning: boolean
  transitionTarget: string | null

  // World map
  worldMapOpen: boolean

  // Actions
  switchRegion: (regionId: string, entryPoint?: { x: number; y: number }) => void
  saveActiveRegion: () => void
  loadRegion: (regionId: string) => void
  resetRegion: (regionId: string) => void
  toggleWorldMap: () => void
}
```

### Pattern 3: Region Transition Animation
**What:** When the student triggers a region change (walking to edge or clicking entrance), the camera slides smoothly to the new region, a title card displays briefly, and the avatar teleports to the entry point.
**When to use:** Every region boundary crossing and fast-travel.
**Example:**
```typescript
// Source: Existing useClickToMove animate() pattern extended for region transitions

async function transitionToRegion(
  targetRegionId: string,
  entryPoint: { x: number; y: number },
  cameraX: MotionValue<number>,
  cameraY: MotionValue<number>,
  zoom: MotionValue<number>,
) {
  const store = useOdysseyWorldStore.getState()

  // 1. Mark transition start
  store.setTransitioning(true, targetRegionId)

  // 2. Fade avatar out at current position (opacity animation)
  // ... avatar fade handled by Avatar component reacting to isTransitioning

  // 3. Save current region state
  store.saveActiveRegion()

  // 4. Load target region
  store.loadRegion(targetRegionId)

  // 5. Calculate camera target for entry point
  const entryScreen = worldToScreen(entryPoint.x, entryPoint.y)
  const viewportW = window.innerWidth
  const viewportH = window.innerHeight
  const currentZoom = zoom.get()
  const camTargetX = entryScreen.x - viewportW / (2 * currentZoom)
  const camTargetY = entryScreen.y - viewportH / (2 * currentZoom)

  // 6. Smooth camera slide (~0.8-1.2s)
  const springConfig = { type: 'spring' as const, stiffness: 60, damping: 20 }
  await Promise.all([
    animate(cameraX, camTargetX, springConfig),
    animate(cameraY, camTargetY, springConfig),
  ])

  // 7. Complete transition
  store.setTransitioning(false, null)
  store.markRegionVisited(targetRegionId)
}
```

### Pattern 4: Zustand Persist with Custom Serialization
**What:** Zustand `persist` middleware with a custom storage handler that serializes `Set` to `Array` and `Map` to entries array, enabling localStorage persistence of the full multi-region state.
**When to use:** Store initialization (automatic), every state change (debounced).
**Example:**
```typescript
// Source: Context7 /pmndrs/zustand persist middleware docs (verified)

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { subscribeWithSelector } from 'zustand/middleware'

// Custom serialization for Set and Map
const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name)
    if (!str) return null
    const parsed = JSON.parse(str)
    // Reconstruct non-JSON types
    if (parsed.state) {
      if (parsed.state.achievedDiscoveries) {
        parsed.state.achievedDiscoveries = new Set(parsed.state.achievedDiscoveries)
      }
      if (parsed.state.visitedRegions) {
        parsed.state.visitedRegions = new Set(parsed.state.visitedRegions)
      }
      if (parsed.state.regions) {
        const regionsMap = new Map<string, RegionState>()
        for (const [key, value] of parsed.state.regions) {
          regionsMap.set(key, {
            ...value,
            discoveries: new Set(value.discoveries),
            rotationHistory: new Map(value.rotationHistory),
          })
        }
        parsed.state.regions = regionsMap
      }
    }
    return parsed
  },
  setItem: (name: string, value: any) => {
    // Convert Set/Map to serializable forms
    const serializable = {
      ...value,
      state: {
        ...value.state,
        achievedDiscoveries: value.state.achievedDiscoveries
          ? [...value.state.achievedDiscoveries]
          : [],
        visitedRegions: value.state.visitedRegions
          ? [...value.state.visitedRegions]
          : [],
        regions: value.state.regions
          ? [...value.state.regions].map(([key, region]) => [
              key,
              {
                ...region,
                discoveries: [...region.discoveries],
                rotationHistory: [...region.rotationHistory],
              },
            ])
          : [],
      },
    }
    localStorage.setItem(name, JSON.stringify(serializable))
  },
  removeItem: (name: string) => localStorage.removeItem(name),
}

// Persist wraps subscribeWithSelector:
const useOdysseyWorldStore = create<OdysseyWorldState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // ...existing state + new multi-region state
      }),
      {
        name: 'odyssey-world-v3',
        storage: createJSONStorage(() => customStorage),
        partialize: (state) => ({
          // Only persist what matters (exclude transient UI state)
          activeRegionId: state.activeRegionId,
          regions: state.regions,
          visitedRegions: state.visitedRegions,
          achievedDiscoveries: state.achievedDiscoveries,
          discoveredEncodings: state.discoveredEncodings,
          avatarX: state.avatarX,
          avatarY: state.avatarY,
          cameraX: state.cameraX,
          cameraY: state.cameraY,
          zoom: state.zoom,
        }),
        version: 1, // For future migrations
      },
    ),
  ),
)
```

### Pattern 5: Cross-Region Beam Boundary Detection
**What:** Extend `calculateBeamPath` to detect when a beam segment exits the current region's bounds. When it does, create a `BoundaryBeam` record that the adjacent region can use as an incoming beam source.
**When to use:** Beam physics recalculation in any region with a beam that reaches the edge.
**Example:**
```typescript
// Source: Extension of existing calculateBeamPath in useBeamPhysics.ts

interface BoundaryBeam {
  /** Which boundary edge the beam exits from */
  exitDirection: 'north' | 'south' | 'east' | 'west'
  /** World coordinates of exit point (on the boundary) */
  exitPoint: { x: number; y: number }
  /** Stokes parameters at exit (carried into next region) */
  stokes: { s0: number; s1: number; s2: number; s3: number }
  /** Propagation direction (unit vector) */
  direction: { dx: number; dy: number }
}

/** Check if a beam segment exits region bounds */
function detectBoundaryExit(
  fromX: number, fromY: number,
  toX: number, toY: number,
  regionBounds: { minX: number; maxX: number; minY: number; maxY: number },
): { exits: boolean; exitPoint: { x: number; y: number }; direction: string } | null {
  // Line-rectangle intersection test
  // Check each boundary edge for intersection with the beam segment
  // Return the first intersection point and the exit direction
  // Standard parametric line-segment intersection math
  // ...
}
```

### Pattern 6: Lazy-Loaded Region Decorations
**What:** Each region's decorative SVG elements (non-interactive scenery) are defined in separate files and loaded via `React.lazy()`, keeping the initial bundle size constant regardless of region count.
**When to use:** Region-specific decoration rendering.
**Example:**
```typescript
// Source: React.lazy() official docs + Vite code splitting

// regionRegistry.ts
const CrystalLabDecorations = React.lazy(
  () => import('./regions/CrystalLabDecorations')
)
const RefractionBenchDecorations = React.lazy(
  () => import('./regions/RefractionBenchDecorations')
)
// ...etc for each region

// In IsometricScene.tsx, render active region's decorations:
<Suspense fallback={<RegionSkeleton gridWidth={region.gridWidth} gridHeight={region.gridHeight} />}>
  <ActiveRegionDecorations regionId={activeRegionId} />
</Suspense>

// Preload adjacent regions when entering a new region:
function preloadAdjacentRegions(regionId: string) {
  const region = getRegionDefinition(regionId)
  for (const boundary of region.boundaries) {
    // Dynamic import triggers Vite chunk creation
    import(`./regions/${boundary.targetRegionId}Decorations.tsx`)
  }
}
```

### Anti-Patterns to Avoid
- **Rendering all 6 regions simultaneously in the SVG:** With 6 regions x 150-225 tiles each = 900-1350 platform elements. Only render the active region's elements. The camera viewport only shows one region at a time.
- **Changing routes for region transitions:** This would unmount the entire OdysseyWorld component, losing MotionValue state, animation continuity, and causing a visible flash. Region switching must be a store state change within the same component tree.
- **Persisting the entire store including transient state:** Use Zustand `partialize` to exclude `isTransitioning`, `isMoving`, `navigationTarget`, `dragPreviewPos`, `hoveredElementId`, `interactionMode`, and other UI-only state from persistence.
- **Running beam physics for all 6 regions on every frame:** Only the active region runs `useBeamPhysics`. Adjacent regions' boundary beams are recalculated only when the student transitions into them or when a beam configuration changes in a connected region.
- **Hardcoding region positions in pixel coordinates:** All region layouts should use world grid coordinates (same as Phase 1). The `worldOffsetX/Y` on `RegionDefinition` translates between per-region local coordinates and global world coordinates for the adjacency graph.
- **Blocking the main thread during persistence writes:** Zustand persist debounces writes automatically. If switching to idb-keyval, all operations are async and non-blocking.
- **Rebuilding the Phase 1 scene from scratch:** The Phase 1 7x7 scene should become one of the 6 regions (expanded to 12x12-15x15). Existing elements, beam physics, and discovery configurations should be preserved and extended, not discarded.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| State persistence with Set/Map | Custom localStorage read/write with manual versioning | Zustand `persist` middleware with custom storage + `partialize` + `version` | Zustand persist handles hydration timing, merge strategy, migration, and partialize for excluding transient state; manual approach misses edge cases (tab close during write, corrupted state recovery) |
| Transition spring physics | Manual requestAnimationFrame easing for camera slide | Framer Motion `animate()` with spring config | Already proven in `useClickToMove` for camera movement; spring interruption handling is free |
| Code splitting for region assets | Manual dynamic `import()` with loading state management | `React.lazy()` + `<Suspense>` | React handles loading states, error boundaries, and concurrent rendering; Vite auto-splits chunks on lazy boundaries |
| Cross-region beam physics | Full simultaneous 6-region physics simulation | Per-region `calculateBeamPath` with `BoundaryBeam` message passing | Real-time multi-region physics is unnecessary and expensive; students see one region at a time; boundary beams only need recalculation on region entry |
| IndexedDB interaction | Raw IndexedDB API with transactions and versioning | `idb-keyval` (if needed) | idb-keyval is <1KB, promise-based, handles DB creation and versioning automatically; raw IndexedDB API is 50+ lines of boilerplate |
| World coordinate offset math | Per-region coordinate translation in every component | Extend `isometric.ts` with `regionToWorld` / `worldToRegion` utilities | Centralizes coordinate translation; prevents bugs when multiple components need region-aware coordinates |

**Key insight:** The existing architecture from Phase 1-2 was designed for this extension. The composable `SceneElement` type, the MotionValue camera, the store-driven beam physics, and the discovery system all support multi-region operation by swapping the active element set. The novel work is the region registry, transition orchestration, persistence serialization, and cross-region beam boundary detection.

## Common Pitfalls

### Pitfall 1: Store Hydration Race Condition
**What goes wrong:** The Zustand persist middleware loads saved state asynchronously. If `initScene()` runs before hydration completes, it overwrites the persisted state with defaults.
**Why it happens:** `useEffect` in `OdysseyPage.tsx` calls `initScene()` on mount. With `persist`, the store is created with default values first, then hydrated from localStorage. If `initScene()` runs between creation and hydration, the saved state is lost.
**How to avoid:** Use Zustand persist's `onRehydrateStorage` callback to detect when hydration is complete. Only call `initScene()` if no persisted state was found. The `hasHydrated` pattern from the Zustand docs is the standard approach:
```typescript
// In persist config:
onRehydrateStorage: () => (state) => {
  if (state) {
    // Persisted state was loaded -- do NOT reinitialize
    state.sceneLoaded = true
  }
}
// In OdysseyPage.tsx:
useEffect(() => {
  // Wait for hydration before deciding whether to init
  const unsub = useOdysseyWorldStore.persist.onFinishHydration(() => {
    if (!useOdysseyWorldStore.getState().sceneLoaded) {
      useOdysseyWorldStore.getState().initScene()
    }
  })
  return unsub
}, [])
```
**Warning signs:** Returning student sees default scene instead of their progress; console shows `initScene` running after `persist` hydration.

### Pitfall 2: State Mutation During Region Transition
**What goes wrong:** While the transition animation is running (~0.8-1.2s), the student can still click in the scene, triggering navigation or element interaction in a half-loaded state.
**Why it happens:** The camera slide animation runs asynchronously. Unless interaction is explicitly blocked during the transition, pointer events still fire on the SVG scene.
**How to avoid:** Set `isTransitioning: true` in the store before starting the transition. All interaction hooks (`useClickToMove`, `useElementDrag`, `useElementRotation`, `useElementSelection`) must check `isTransitioning` and return early. The transition overlay component should also have `pointerEvents: 'all'` to capture and swallow clicks.
**Warning signs:** Elements from the old region are visible during transition and can be clicked; avatar teleports unexpectedly; beam physics errors during transition.

### Pitfall 3: Serialized State Size Exceeding localStorage Limit
**What goes wrong:** With 6 regions each having 100+ elements with properties, plus rotation history maps, the serialized JSON exceeds localStorage's 5MB limit, and writes silently fail or throw.
**Why it happens:** Rotation history (`Map<string, number[]>`) grows unbounded -- every rotation tick appends to the history array. With 6 regions and active rotation, this can grow to megabytes.
**How to avoid:** Cap rotation history to the last 20 entries per element (sufficient for discovery detection). Use `partialize` to exclude non-essential data from persistence. Measure serialized state size periodically (in dev mode) with `new Blob([JSON.stringify(state)]).size`. If approaching 2MB, switch to idb-keyval.
**Warning signs:** `QuotaExceededError` in console; state not restored on page reload; only partial state persisted.

### Pitfall 4: Beam Physics Calculating on Stale Region Elements
**What goes wrong:** After switching regions, `useBeamPhysics` briefly calculates with the previous region's elements before the new region's elements are loaded into the store, producing incorrect beam segments.
**Why it happens:** Store updates are batched by React. If `saveActiveRegion` and `loadRegion` are separate store actions, there's a render cycle between them where the store has a mix of old and new state.
**How to avoid:** Make `switchRegion` a single atomic store action that saves the old region state and loads the new region state in one `set()` call. This ensures `useBeamPhysics` only sees consistent state:
```typescript
switchRegion: (regionId, entryPoint) => set((state) => {
  // Save current region
  const savedRegion = { elements: state.sceneElements, ... }
  const newRegions = new Map(state.regions)
  newRegions.set(state.activeRegionId, savedRegion)

  // Load target region
  const targetRegion = newRegions.get(regionId)
  return {
    regions: newRegions,
    activeRegionId: regionId,
    sceneElements: targetRegion?.elements ?? [],
    beamSegments: [], // Will be recalculated by useBeamPhysics
    avatarX: entryPoint?.x ?? 7,
    avatarY: entryPoint?.y ?? 7,
  }
})
```
**Warning signs:** Brief visual glitch of wrong beams during transition; console errors about missing beam segments.

### Pitfall 5: World Map SVG Performance
**What goes wrong:** The world map overlay renders simplified versions of all 6 regions simultaneously, with discovery connection lines and visited indicators. If each region miniature has too many elements, the map overlay lags.
**Why it happens:** Even simplified, 6 regions x ~30 miniature elements + connection lines + animations can overwhelm the browser's SVG renderer, especially with glow filters.
**How to avoid:** The world map should render pre-generated static thumbnails (or very simplified shapes -- just colored rectangles/polygons representing regions) rather than actual scene elements. Discovery connection lines use simple SVG `<line>` with no filters. Visited regions are indicated by a color fill change, not animation. The map is HTML overlay (not inside the scene SVG) to avoid competing with scene rendering.
**Warning signs:** Dropping frames when opening world map; world map takes >100ms to appear.

### Pitfall 6: Discovery Connection Timing Across Regions
**What goes wrong:** A student makes a discovery in Region A that should reveal a connection in Region B, but Region B's discovery check doesn't run because Region B is not the active region.
**Why it happens:** `useDiscoveryState` only monitors the active region's beam segments and elements. Cross-region effects happen in regions that are not currently rendered.
**How to avoid:** Cross-region discovery connections should be data-driven (stored in the region registry), not computed in real-time. When a discovery is achieved, check the `discoveryConnections` array for that discovery -- if a connection exists, store the connection state globally (not per-region). The connection visual indicator in the target region activates when that region becomes active and the connection state is present.
**Warning signs:** Student discovers something but the cross-region indicator never appears; connections only work if visiting regions in a specific order.

## Code Examples

### Region Transition Hook (Core Orchestration)
```typescript
// Source: Extension of existing useClickToMove pattern

export function useRegionTransition(
  cameraX: MotionValue<number>,
  cameraY: MotionValue<number>,
  zoom: MotionValue<number>,
  avatarScreenX: MotionValue<number>,
  avatarScreenY: MotionValue<number>,
) {
  const isTransitioning = useOdysseyWorldStore((s) => s.isTransitioning)
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)

  const initiateTransition = useCallback(
    async (targetRegionId: string, entryPoint: { x: number; y: number }) => {
      const store = useOdysseyWorldStore.getState()
      if (store.isTransitioning) return

      // 1. Begin transition (blocks all interaction)
      store.setTransitioning(true, targetRegionId)

      // 2. Fade avatar out
      await animate(avatarScreenX, avatarScreenX.get(), { duration: 0 }) // ensure settled
      // Avatar opacity handled by component reacting to isTransitioning

      // 3. Atomic region switch in store
      store.switchRegion(targetRegionId, entryPoint)

      // 4. Set avatar to new entry point
      const entryScreen = worldToScreen(entryPoint.x, entryPoint.y)
      avatarScreenX.set(entryScreen.x)
      avatarScreenY.set(entryScreen.y)

      // 5. Camera slide to new region
      const viewportW = window.innerWidth
      const viewportH = window.innerHeight
      const currentZoom = zoom.get()
      const camTargetX = entryScreen.x - viewportW / (2 * currentZoom)
      const camTargetY = entryScreen.y - viewportH / (2 * currentZoom)

      await Promise.all([
        animate(cameraX, camTargetX, {
          type: 'spring', stiffness: 60, damping: 20,
          duration: 1.0, // ~0.8-1.2s per CONTEXT.md
        }),
        animate(cameraY, camTargetY, {
          type: 'spring', stiffness: 60, damping: 20,
          duration: 1.0,
        }),
      ])

      // 6. End transition
      store.setTransitioning(false, null)
      store.markRegionVisited(targetRegionId)

      // Sync camera to store
      store.setCamera(cameraX.get(), cameraY.get())
    },
    [cameraX, cameraY, zoom, avatarScreenX, avatarScreenY],
  )

  return { initiateTransition, isTransitioning, activeRegionId }
}
```

### Boundary Detection in Beam Path
```typescript
// Source: Extension of existing calculateBeamPath

interface RegionBounds {
  minX: number; maxX: number
  minY: number; maxY: number
}

/** Clip a beam segment to region bounds, returning the exit point if it exits */
function clipBeamToRegion(
  fromX: number, fromY: number,
  toX: number, toY: number,
  bounds: RegionBounds,
): { clippedToX: number; clippedToY: number; exits: boolean; exitDirection: string } {
  // If toX/toY is within bounds, no clipping needed
  if (toX >= bounds.minX && toX <= bounds.maxX &&
      toY >= bounds.minY && toY <= bounds.maxY) {
    return { clippedToX: toX, clippedToY: toY, exits: false, exitDirection: '' }
  }

  // Parametric line clipping (Cohen-Sutherland or simple parametric)
  const dx = toX - fromX
  const dy = toY - fromY

  let tMin = 0, tMax = 1
  let exitDir = ''

  // Check each boundary
  if (dx !== 0) {
    const tLeft = (bounds.minX - fromX) / dx
    const tRight = (bounds.maxX - fromX) / dx
    if (dx > 0) { tMax = Math.min(tMax, tRight); exitDir = 'east' }
    else { tMax = Math.min(tMax, tLeft); exitDir = 'west' }
  }
  if (dy !== 0) {
    const tTop = (bounds.minY - fromY) / dy
    const tBottom = (bounds.maxY - fromY) / dy
    if (dy > 0) { tMax = Math.min(tMax, tBottom); exitDir = 'south' }
    else { tMax = Math.min(tMax, tTop); exitDir = 'north' }
  }

  const clippedToX = fromX + dx * tMax
  const clippedToY = fromY + dy * tMax

  return { clippedToX, clippedToY, exits: true, exitDirection: exitDir }
}
```

### Region Name Title Card Overlay
```typescript
// Source: Framer Motion AnimatePresence pattern (Context7 verified)

function RegionTransitionOverlay() {
  const isTransitioning = useOdysseyWorldStore((s) => s.isTransitioning)
  const transitionTarget = useOdysseyWorldStore((s) => s.transitionTarget)
  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    if (isTransitioning && transitionTarget) {
      setShowTitle(true)
      const timer = setTimeout(() => setShowTitle(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning, transitionTarget])

  const region = transitionTarget ? getRegionDefinition(transitionTarget) : null

  return (
    <AnimatePresence>
      {showTitle && region && (
        <motion.div
          key={region.id}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2
            className="text-3xl font-light tracking-widest text-gray-600/80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {region.theme.name}
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual localStorage with JSON.parse/stringify | Zustand `persist` middleware with `createJSONStorage` | Zustand v4 (2023), stable in v5 | Automatic hydration, partialize, versioning, migration support; eliminates manual serialization bugs |
| Separate route per game region | Single-page region switching with store state change | Industry practice for web games | Avoids React unmount/remount, preserves animation state, eliminates loading screen |
| Load all assets upfront | React.lazy() + Suspense for per-region assets | React 18+ (2022), mature in React 19 | Constant initial bundle size; Vite auto-splits chunks; Suspense shows skeleton during load |
| GSAP for complex scene transitions | Framer Motion animate() with spring physics | Framer Motion v12 (current project) | Already in project; spring interruption handling; MotionValue integration with camera system |
| IndexedDB raw API | idb-keyval wrapper (if needed) | idb-keyval v6 (2023, stable) | <1KB, promise-based, no transaction management; only needed if data exceeds localStorage limits |

**Deprecated/outdated:**
- Previous `odysseyStore.ts`: Dead code from the abandoned 3D portal model; should not be extended. The current `odysseyWorldStore.ts` is the active store and should be extended for multi-region.
- `createInitialSceneElements()` in store: Currently hardcodes the single 7x7 scene. Phase 3 replaces this with region registry initialization -- the function should become `createRegionInitialElements(regionId)` pulling from the registry.
- The `DistantSilhouettes` component in `IsometricScene.tsx`: Currently renders static placeholder silhouettes hinting at adjacent regions. Phase 3 replaces these with actual `BoundaryIndicator` components showing real neighboring region previews.

## Discretion Recommendations

### Storage Technology: Start with localStorage, idb-keyval as Fallback
**Recommendation:** Use localStorage via Zustand `persist` middleware with custom serialization. Estimated data per region: ~5-10KB (elements + discoveries). Total for 6 regions: ~30-60KB (far below 5MB limit). Rotation history capped at 20 entries per element keeps growth bounded. Only add `idb-keyval` if actual measurement shows data approaching 2MB.

**Rationale:**
- localStorage writes are ~10x faster than IndexedDB (0.017ms vs 0.17ms)
- localStorage is synchronous, avoiding hydration complexity
- Zustand persist handles all the serialization/hydration boilerplate
- 6 regions x 200 elements x ~50 bytes/element = ~60KB -- well within limits
- Rotation history cap prevents unbounded growth

### Phase 1 Scene Fate: Keep and Expand
**Recommendation:** The existing Phase 1 7x7 scene becomes one of the 6 regions, expanded to 13x13. Keep the existing light source, polarizer, waveplate, and all Phase 2 discoveries. Add more platforms, new optical elements, and new decorations to fill the larger area.

**Rationale:**
- Preserves all tested Phase 1-2 code paths without regression
- Students who played Phase 1-2 see their familiar scene enriched, not replaced
- The coordinate system, beam physics, and discovery checks all work on the existing elements
- Expanding from 7x7 to 13x13 means adding ~120 new platform tiles and ~10-15 new elements -- incremental, not rewrite

### Discovery Association Logic: Hand-Curated Associations
**Recommendation:** Pre-define cross-region discovery connections as static data in the region registry. Each connection links a specific discovery in one region to a related discovery in another region, with a human-authored "why they connect" tag (used for the constellation map tooltip).

**Rationale:**
- Physics-based inference would require running beam physics across regions simultaneously, which contradicts the per-region physics model
- Hand-curated connections ensure pedagogically meaningful "aha" moments (e.g., Malus's Law in Region A connects to Brewster's angle in Region B because both involve cos^2 relationships)
- The connection data is small (20-30 pairs) and easy to tune based on playtesting
- The constellation map needs human-readable descriptions anyway

### Light Source Mobility: Fixed Per Region
**Recommendation:** Light sources are fixed (not movable) in each region. Students can adjust their wavelength, intensity, and polarization via the environment popup, but cannot reposition them.

**Rationale:**
- Fixed light sources define the region's "puzzle structure" -- where beams go determines what physics phenomena are observable
- Moving light sources would require full beam path recalculation on every drag frame (already validated as fast for <10 elements, but adds interaction complexity)
- The equipment palette already provides free placement of optical elements -- students have enough degrees of freedom
- Fixed sources simplify cross-region beam boundary detection (source positions are known at design time)

### World Map Visual Design: Constellation-Style Abstract Map
**Recommendation:** The world map is an HTML overlay (not in the SVG scene) showing 6 abstract region shapes (colored polygons matching each region's accent color) arranged in their spatial layout, connected by lines representing boundaries. Discovered connections between regions are shown as glowing dotted lines between specific points within regions. Unvisited regions are shown as dimmed outlines; visited regions are filled.

**Rationale:**
- HTML overlay avoids competing with the scene's SVG rendering pipeline
- Abstract shapes avoid the World Map SVG performance pitfall (rendering actual scene elements)
- Constellation-style connections naturally visualize the "knowledge graph" concept from CONT-04 (Phase 4)
- Fast-travel: click any visited region to transition directly

## Open Questions

1. **Region size consistency vs. variety**
   - What we know: CONTEXT.md says "12x12 ~ 15x15" per region. 6 regions at 15x15 = 1350 platform tiles + decorations.
   - What's unclear: Should all regions be the same size, or should some be larger (main lab) and some smaller (specialized chambers)?
   - Recommendation: Vary sizes between 12x12 and 15x15 based on content needs. The "Fundamentals Lab" (expanded Phase 1) should be 13x13. Specialized regions (Scattering Chamber) can be smaller (12x12). Open regions (Wave Platform) can be larger (15x12). This variation adds organic feel.

2. **Cross-region beam recalculation trigger**
   - What we know: When a student modifies an optical element in Region A, the beam path changes. If the beam exits Region A into Region B, Region B's incoming beam should update.
   - What's unclear: Should Region B's beams recalculate immediately (while the student is still in Region A)? Or only when the student enters Region B?
   - Recommendation: Recalculate boundary beams for adjacent regions lazily -- only when the student transitions into Region B. Store the boundary beam record when Region A's beam exits, but don't run Region B's full physics until Region B becomes active. This keeps per-frame physics cost constant at one region.

3. **Boundary visualization specifics**
   - What we know: CONTEXT.md says "visual indicator (glow, arrow, trail)" at region edges. The beam should visibly extend to the boundary.
   - What's unclear: The exact visual treatment. A glowing orb at the boundary? An arrow? A pulsing dot?
   - Recommendation: Use a pulsing gradient fade at the boundary edge -- the beam gradually becomes a soft glow/trail that extends to the boundary line, with a subtle animated pulse indicating "this continues." When entering the adjacent region, the beam appears from the corresponding boundary with a matching glow. No arrow (too game-like for The Witness aesthetic).

4. **First-entry animation vs. repeat-entry**
   - What we know: CONTEXT.md says "first time entering a new region has a special entrance animation."
   - What's unclear: How different should first-entry be from subsequent entries? A longer camera sweep? A brief zoom-out-then-in? Sound?
   - Recommendation: First entry uses a slightly slower camera transition (1.5s instead of 1.0s) with a brief zoom-out-zoom-in arc (zoom to 0.8 then back to 1.0 during the pan), giving a "revealing the new space" feeling. The region name title card is slightly larger and stays visible 0.5s longer on first entry. Repeat entries use the standard 1.0s camera slide. No sound (DPTH-02 is v2 scope).

## Sources

### Primary (HIGH confidence)
- Context7 `/pmndrs/zustand` - persist middleware with custom storage, Set/Map serialization, createJSONStorage, partialize, onRehydrateStorage callback
- Context7 `/websites/motion_dev` - AnimatePresence for exit animations, animate() spring config, layout animations
- Context7 `/jakearchibald/idb-keyval` - get/set/del/keys API, createStore for custom DB
- Existing codebase `src/stores/odysseyWorldStore.ts` - Current store structure (484 lines), SceneElement types, all Phase 1-2 actions
- Existing codebase `src/components/odyssey-world/hooks/useBeamPhysics.ts` - calculateBeamPath algorithm, polarizationToVisual encoding
- Existing codebase `src/components/odyssey-world/hooks/useClickToMove.ts` - Camera animation pattern with animate() + MotionValue
- Existing codebase `src/components/odyssey-world/hooks/useIsometricCamera.ts` - MotionValue camera system, svgTransform, zoom-toward-cursor
- Existing codebase `src/components/odyssey-world/hooks/useDiscoveryState.ts` - Discovery configuration system, throttled checking
- Existing codebase `src/lib/isometric.ts` - Coordinate conversion, snapToBeamPath, depthSort

### Secondary (MEDIUM confidence)
- [Zustand persist middleware docs](https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md) - Custom storage engines, Map/Set serialization patterns
- [React lazy() docs](https://react.dev/reference/react/lazy) - Code splitting with dynamic import
- [SVG Animation Encyclopedia 2025](https://www.svgai.org/blog/research/svg-animation-encyclopedia-complete-guide) - SVG animation performance: transform/opacity are GPU-composited
- [RxDB localStorage vs IndexedDB comparison](https://rxdb.info/articles/localstorage-indexeddb-cookies-opfs-sqlite-wasm.html) - Write latency benchmarks: localStorage 0.017ms vs IndexedDB 0.17ms
- [MDN Storage quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) - localStorage 5-10MB per origin, IndexedDB up to several GB

### Tertiary (LOW confidence)
- General isometric game architecture patterns from web search -- patterns validated against existing codebase implementation
- Camera transition timing (0.8-1.2s spring) -- derived from CONTEXT.md specification, needs playtesting validation
- Data size estimates (30-60KB for 6 regions) -- based on current single-region store state analysis, needs runtime measurement

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All core libraries already in project; Zustand persist is well-documented and verified via Context7; React.lazy is a first-party React API
- Architecture: HIGH - Patterns derived from existing working codebase (MotionValue camera, store-driven beam physics, discovery system); multi-region extension follows the same composable SceneElement pattern
- Pitfalls: HIGH - Identified from concrete analysis of the existing store structure (Set/Map serialization), hydration timing (verified in Zustand docs), and interaction blocking (derived from Phase 2 isTransitioning pattern)
- Persistence: HIGH - Zustand persist with custom storage for Set/Map is a documented pattern with code examples in official docs
- Cross-region beams: MEDIUM - Boundary detection math is standard (line-rectangle clipping), but the full UX of boundary beam visualization needs implementation experimentation
- Region content design: MEDIUM - 6 region themes and physics concept distribution require pedagogical design decisions that cannot be fully researched; need playtesting
- Transition feel: LOW - The exact spring config (stiffness 60, damping 20) and timing (1.0s) for region transitions needs runtime tuning; values are starting points

**Research date:** 2026-02-20
**Valid until:** 2026-03-20 (stable domain -- Zustand persist, React.lazy, Framer Motion animate are all mature, stable APIs)
