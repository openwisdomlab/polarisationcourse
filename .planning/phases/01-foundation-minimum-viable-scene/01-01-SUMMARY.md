---
phase: 01-foundation-minimum-viable-scene
plan: 01
subsystem: scene-foundation
tags: [isometric, zustand, coordinate-math, tanstack-router, odyssey]

# Dependency graph
requires: []
provides:
  - "Isometric coordinate conversion utilities (worldToScreen, screenToWorld, camera-aware variants, depthSort)"
  - "Odyssey world state store with composable SceneElement/BeamSegment data model"
  - "Route wiring at /odyssey/ with scene initialization on mount"
affects: [01-02, 01-03, phase-02-interaction]

# Tech tracking
tech-stack:
  added: []
  patterns: ["2:1 isometric projection with TILE_WIDTH=128/TILE_HEIGHT=64", "Zustand subscribeWithSelector for scene state", "Composable SceneElement types instead of station arrays"]

key-files:
  created:
    - src/lib/isometric.ts
    - src/stores/odysseyWorldStore.ts
  modified:
    - src/routes/odyssey.index.tsx
    - src/pages/OdysseyPage.tsx
    - src/components/odyssey-lab/LabShell.tsx

key-decisions:
  - "Created new odysseyWorldStore.ts instead of modifying old odysseyStore.ts -- old store designed for abandoned 3D portal model"
  - "Used composable SceneElement types with properties Record instead of fixed station/demo array structure"
  - "Stokes parameters stored directly on BeamSegment for physics-accurate visual encoding"

patterns-established:
  - "WorldPoint/ScreenPoint types distinguish coordinate spaces in function signatures"
  - "Pure function isometric.ts utility module with zero React/state dependencies"
  - "SceneElement.properties Record pattern for element-specific physics data"

requirements-completed: [TECH-02, TECH-03, TECH-04]

# Metrics
duration: 5min
completed: 2026-02-20
---

# Phase 1 Plan 1: Foundation Coordinate System and Scene Store Summary

**Isometric coordinate math utilities with 2:1 projection, Zustand world store with composable SceneElement/BeamSegment data model, and /odyssey/ route wiring with scene initialization**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-20T07:15:04Z
- **Completed:** 2026-02-20T07:20:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Pure-function isometric coordinate conversion module with worldToScreen/screenToWorld round-trip correctness verified
- Zustand store with composable SceneElement types (light-source, polarizer, waveplate, platform, decoration, prism) and BeamSegment with Stokes parameters
- Initial scene populated with 7x7 platform grid, 3 raised platforms, light source, polarizer, quarter-wave plate, 4 decorations, and 3 beam segments showing polarization state changes
- Route at /odyssey/ renders placeholder with store initialization on mount and cleanup on unmount

## Task Commits

Each task was committed atomically:

1. **Task 1: Create isometric coordinate system utilities** - `aa3b992` (feat)
2. **Task 2: Create Odyssey world store and wire route** - `3ed8aed` (feat)

## Files Created/Modified
- `src/lib/isometric.ts` - Isometric coordinate math: worldToScreen, screenToWorld, camera-aware variants, depthSort, clampZoom, tileDistance, WorldPoint/ScreenPoint types
- `src/stores/odysseyWorldStore.ts` - Scene state store: camera, zoom, navigation, SceneElement[], BeamSegment[], initScene with predefined layout
- `src/routes/odyssey.index.tsx` - Simplified route definition (removed old OdysseySearch type with unit/station params)
- `src/pages/OdysseyPage.tsx` - Entry point with store initialization on mount, cleanup on unmount, placeholder UI
- `src/components/odyssey-lab/LabShell.tsx` - Fixed type error from route search type removal (deviation)

## Decisions Made
- Created new `odysseyWorldStore.ts` instead of modifying old `odysseyStore.ts` -- the old store was designed for the abandoned 3D portal transition model and has a fundamentally different data structure
- Used composable `SceneElement` types with a `properties: Record<string, number | string | boolean>` pattern for element-specific data, enabling flexible physics behavior composition without rigid interfaces
- Stored Stokes parameters (`{ s0, s1, s2, s3 }`) directly on `BeamSegment` to maintain physics accuracy and enable future real-time recalculation from `PolarizationState`
- Initial scene layout places optical elements along a single Y=3 line (light source at x=1, polarizer at x=3, waveplate at x=5) for clear beam path demonstration

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed LabShell.tsx type error from route search type removal**
- **Found during:** Task 2 (route file updates)
- **Issue:** Removing the `OdysseySearch` type from `odyssey.index.tsx` caused `LabShell.tsx` to fail type-checking -- it used `search.unit` and `search.station` which no longer existed on the empty search type `{}`
- **Fix:** Changed LabShell to cast `search` as `Record<string, unknown>` before accessing `unit` and `station` properties
- **Files modified:** `src/components/odyssey-lab/LabShell.tsx`
- **Verification:** `pnpm run build` passes with zero type errors
- **Committed in:** `3ed8aed` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary fix to maintain build passing. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Isometric coordinate math is ready for scene rendering (Plan 02) and click-to-move detection (Plan 03)
- Scene state store is ready to drive SVG rendering -- sceneElements and beamSegments are populated with initial data
- Route is wired and rendering placeholder -- Plan 02 replaces placeholder with OdysseyWorld component
- Old `odysseyStore.ts` remains untouched for any existing code that references it

## Self-Check: PASSED

All 5 created/modified files verified on disk. Both task commits (aa3b992, 3ed8aed) found in git log.

---
*Phase: 01-foundation-minimum-viable-scene*
*Completed: 2026-02-20*
