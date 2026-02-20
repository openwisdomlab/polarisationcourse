---
phase: 03-multi-region-isometric-world
plan: 03
subsystem: physics, discovery, ui
tags: [beam-propagation, stokes-parameters, cross-region, world-map, fast-travel, meta-discovery, knowledge-gating, svg, framer-motion, zustand]

# Dependency graph
requires:
  - phase: 03-multi-region-isometric-world (plan 01)
    provides: Region registry with 6 RegionDefinitions, multi-region Zustand store with persistence
  - phase: 03-multi-region-isometric-world (plan 02)
    provides: Region transition system (camera slides, boundary detection, avatar teleport)
provides:
  - Cross-region beam propagation with Stokes parameter preservation at boundaries
  - Boundary beam visual indicators (pulsing SVG gradients at exit/entry points)
  - Cross-region discovery connections (~18 curated connections across 6 regions)
  - 4 meta-discoveries requiring combined multi-region knowledge
  - Knowledge-gated palette enrichment (10 rules, invisible progression per DISC-02)
  - Constellation-style world map overlay with fast-travel to visited regions
  - Per-region discovery configurations replacing hardcoded global list
affects: [phase-04-depth-layers, phase-05-visual-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Parametric line-rectangle clipping for beam boundary detection"
    - "BoundaryBeam records stored on adjacent regions for lazy physics evaluation"
    - "queueMicrotask for store writes triggered by render-phase computations"
    - "CSS @keyframes for lightweight SVG animations (boundary indicators, discovery connections)"
    - "HTML overlay world map with Framer Motion AnimatePresence (not SVG scene element)"
    - "PALETTE_ENRICHMENTS map for invisible knowledge gating"

key-files:
  created:
    - src/components/odyssey-world/hooks/useBoundaryBeams.ts
    - src/components/odyssey-world/BoundaryIndicator.tsx
    - src/components/odyssey-world/hooks/useDiscoveryConnections.ts
    - src/components/odyssey-world/DiscoveryConnection.tsx
    - src/components/odyssey-world/hooks/useWorldMap.ts
    - src/components/odyssey-world/WorldMap.tsx
  modified:
    - src/lib/isometric.ts
    - src/components/odyssey-world/hooks/useBeamPhysics.ts
    - src/components/odyssey-world/IsometricScene.tsx
    - src/components/odyssey-world/OdysseyWorld.tsx
    - src/components/odyssey-world/ElementPalette.tsx
    - src/components/odyssey-world/hooks/useDiscoveryState.ts
    - src/components/odyssey-world/regions/regionRegistry.ts
    - src/components/odyssey-world/regions/crystalLab.ts
    - src/components/odyssey-world/regions/refractionBench.ts
    - src/components/odyssey-world/regions/scatteringChamber.ts
    - src/components/odyssey-world/regions/wavePlatform.ts
    - src/components/odyssey-world/regions/interfaceLab.ts
    - src/components/odyssey-world/regions/measurementStudio.ts
    - src/stores/odysseyWorldStore.ts

key-decisions:
  - "Lazy evaluation for cross-region beams: only active region runs physics, boundary beams stored as metadata"
  - "World map as lightweight HTML overlay (not SVG scene element) to avoid performance pitfall 5"
  - "Invisible palette gating per DISC-02: items appear without locked state, no visible progression barriers"
  - "Meta-discoveries auto-achieved via queueMicrotask when all prerequisites met"
  - "Per-region discovery configs replace hardcoded global list for scalable region content"
  - "CSS animations (not Framer Motion) for boundary indicators to maintain beam layer lightweight pattern"

patterns-established:
  - "clipBeamToRegion: parametric clipping for any beam-boundary intersection detection"
  - "BoundaryBeam record pattern: carry Stokes parameters and direction across region boundaries"
  - "PALETTE_ENRICHMENTS: declarative discovery-to-palette-item mapping for invisible progression"
  - "META_DISCOVERIES: multi-region achievement requiring combined knowledge from 2-3 regions"
  - "getConnectionDirection: spatial layout inference from region grid positions"

requirements-completed: [PHYS-04, DISC-02, DISC-05]

# Metrics
duration: 15min
completed: 2026-02-21
---

# Phase 3 Plan 03: Cross-Region Physics & Discovery Summary

**Cross-region beam propagation with Stokes preservation, 18 discovery connections across 6 regions with 4 meta-discoveries, constellation-style world map with fast-travel, and invisible knowledge-gated palette enrichment**

## Performance

- **Duration:** 15 min
- **Started:** 2026-02-21
- **Completed:** 2026-02-21
- **Tasks:** 3
- **Files modified:** 20 (2083 lines added)

## Accomplishments
- Beams propagate across region boundaries with full Stokes parameter preservation, exhibiting different polarization behavior in each region's optical environment (PHYS-04)
- 18 hand-curated discovery connections plus 4 meta-discoveries create cross-region "aha" moments spanning all 6 regions (DISC-05)
- Constellation-style world map overlay with fast-travel to visited regions, discovery progress per region, and constellation connection lines
- Equipment palettes enriched by 10 discovery-based rules with invisible gating -- items appear without locked state (DISC-02)

## Task Commits

Each task was committed atomically:

1. **Task 1: Cross-region beam boundary detection and visual indicators** - `3ee5c91` (feat)
2. **Task 2: Discovery connections and knowledge-gated equipment palettes** - `4480e9b` (feat)
3. **Task 3: Constellation-style world map with fast-travel and discovery overlay** - `a3a583e` (feat)

**Plan metadata:** (pending)

## Files Created/Modified

**Created:**
- `src/components/odyssey-world/hooks/useBoundaryBeams.ts` - Detects beam exits from region, writes incomingBeams to adjacent regions
- `src/components/odyssey-world/BoundaryIndicator.tsx` - SVG pulsing gradient indicators at boundary exit/entry points
- `src/components/odyssey-world/hooks/useDiscoveryConnections.ts` - Tracks cross-region discovery connection activation and meta-discoveries
- `src/components/odyssey-world/DiscoveryConnection.tsx` - SVG faint dotted lines showing cross-region discovery links in scene
- `src/components/odyssey-world/hooks/useWorldMap.ts` - World map open/close, fast-travel, M key shortcut
- `src/components/odyssey-world/WorldMap.tsx` - HTML overlay world map with 6 region shapes, constellation lines, fast-travel

**Modified:**
- `src/lib/isometric.ts` - Added `clipBeamToRegion` (parametric line-rectangle clipping) and `ClipBeamResult` interface
- `src/components/odyssey-world/hooks/useBeamPhysics.ts` - Added `calculateIncomingBeamPaths` for cross-region beam sources
- `src/components/odyssey-world/IsometricScene.tsx` - Wired BoundaryIndicators (beam layer) and DiscoveryConnections (L2.5 layer)
- `src/components/odyssey-world/OdysseyWorld.tsx` - Wired WorldMap overlay with useWorldMap and useDiscoveryConnections
- `src/components/odyssey-world/ElementPalette.tsx` - Per-region items with discovery-based enrichment via PALETTE_ENRICHMENTS
- `src/components/odyssey-world/hooks/useDiscoveryState.ts` - Per-region discovery configs from regionRegistry
- `src/components/odyssey-world/regions/regionRegistry.ts` - Added connectionTag, MetaDiscovery, PaletteEnrichment types; META_DISCOVERIES (4) and PALETTE_ENRICHMENTS (10)
- `src/components/odyssey-world/regions/crystalLab.ts` - Added connectionTags and 2 additional discoveryConnections
- `src/components/odyssey-world/regions/refractionBench.ts` - Added connectionTags and 1 additional discoveryConnection
- `src/components/odyssey-world/regions/scatteringChamber.ts` - Added connectionTag and 1 additional discoveryConnection
- `src/components/odyssey-world/regions/wavePlatform.ts` - Added connectionTags and 1 additional discoveryConnection
- `src/components/odyssey-world/regions/interfaceLab.ts` - Added connectionTags and 1 additional discoveryConnection
- `src/components/odyssey-world/regions/measurementStudio.ts` - Added connectionTags and 1 additional discoveryConnection
- `src/stores/odysseyWorldStore.ts` - Added `updateBoundaryBeams` action

## Decisions Made
- **Lazy evaluation for cross-region beams:** Only the active region runs physics. Boundary beams are stored as metadata records (BoundaryBeam) on adjacent regions, recalculated on region entry. This avoids running 6 simultaneous physics engines.
- **World map as HTML overlay:** Used `fixed inset-0 z-40` with Framer Motion AnimatePresence, not an SVG scene element, per research pitfall 5 about map performance.
- **Invisible gating per DISC-02:** Palette items simply appear when discoveries unlock them. No "locked" visual state, no visible progression barriers. Students never feel blocked.
- **CSS animations for boundary indicators:** Used `@keyframes boundary-pulse` (not Framer Motion) to match the Phase 1 pattern of lightweight beam layer animations.
- **Meta-discoveries via queueMicrotask:** Auto-achieved when all prerequisites are met, written to store via `queueMicrotask` to avoid render-phase store mutations.
- **Per-region discovery configs:** Each region's `discoveryConfigs` in regionRegistry replace the hardcoded global list, enabling scalable per-region content.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed useEffect return type in DiscoveryConnection.tsx**
- **Found during:** Task 2 (discovery connections)
- **Issue:** TS7030 "Not all code paths return a value" -- conditional cleanup return without explicit `return undefined` on else branch
- **Fix:** Added `return undefined` to the else branch of the useEffect callback
- **Files modified:** src/components/odyssey-world/DiscoveryConnection.tsx
- **Verification:** `pnpm run build` passes
- **Committed in:** 4480e9b (Task 2 commit)

**2. [Rule 1 - Bug] Removed unused import in useDiscoveryConnections.ts**
- **Found during:** Task 2 (discovery connections)
- **Issue:** TS6133 'DiscoveryConnection' imported from regionRegistry but never used
- **Fix:** Removed the unused import from the destructured imports
- **Files modified:** src/components/odyssey-world/hooks/useDiscoveryConnections.ts
- **Verification:** `pnpm run build` passes
- **Committed in:** 4480e9b (Task 2 commit)

**3. [Rule 1 - Bug] Removed unused useRef import in useWorldMap.ts**
- **Found during:** Task 3 (world map)
- **Issue:** TS6133 'useRef' imported but not used in the hook
- **Fix:** Removed `useRef` from the import statement
- **Files modified:** src/components/odyssey-world/hooks/useWorldMap.ts
- **Verification:** `pnpm run build` passes
- **Committed in:** a3a583e (Task 3 commit)

---

**Total deviations:** 3 auto-fixed (3 Rule 1 bugs -- all TypeScript strict mode violations)
**Impact on plan:** Minor type errors fixed inline. No scope creep.

## Issues Encountered
None -- all tasks completed as planned with only minor TypeScript strict mode fixes.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 3 is now complete: 6 regions with transitions, cross-region physics, discovery connections, world map, and persistence
- Ready for Phase 4 (Depth Layers & Content Integration): layered information architecture, demo deep-dives, concept constellation map
- The discovery connection system and world map constellation provide the foundation for Phase 4's concept constellation map (CONT-04)
- Per-region discovery configs enable Phase 4's per-concept depth layers

## Self-Check: PASSED

All 15 key files verified present. All 3 task commits (3ee5c91, 4480e9b, a3a583e) verified in git log.

---
*Phase: 03-multi-region-isometric-world*
*Completed: 2026-02-21*
