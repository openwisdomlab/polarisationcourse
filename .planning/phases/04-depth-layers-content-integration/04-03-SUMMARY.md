---
phase: 04-depth-layers-content-integration
plan: 03
subsystem: ui
tags: [svg-demos, bidirectional-sync, zustand, constellation-map, lazy-loading, react-suspense]

# Dependency graph
requires:
  - phase: 04-depth-layers-content-integration
    provides: ConceptDefinition with demoComponentId and connections, DepthPanel with demo tab placeholder, store depth panel state and mutual exclusivity
provides:
  - 3 lightweight SVG demo explorers (MalusLaw, CircularPol, Brewster) embedded in depth panel
  - useDemoSync bidirectional hook with 200ms throttled store sync
  - DemoLayer lazy-load container mapping demoComponentId to React.lazy components
  - Concept constellation overlay on WorldMap with categorized connection lines
  - Click constellation node opens depth panel (WorldMap/DepthPanel mutual exclusivity preserved)
affects: [05-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [demo-sync-throttle-pattern, lazy-demo-registry-pattern, concept-constellation-overlay-pattern, deterministic-concept-positioning]

key-files:
  created:
    - src/components/odyssey-world/demos/MalusLawExplorer.tsx
    - src/components/odyssey-world/demos/CircularPolExplorer.tsx
    - src/components/odyssey-world/demos/BrewsterExplorer.tsx
    - src/components/odyssey-world/depth/DemoLayer.tsx
    - src/components/odyssey-world/depth/hooks/useDemoSync.ts
  modified:
    - src/components/odyssey-world/depth/DepthPanelContent.tsx
    - src/components/odyssey-world/WorldMap.tsx

key-decisions:
  - "useDemoSync uses useRef throttle (200ms) + syncImmediate for pointerUp, avoiding lodash/debounce dependency"
  - "Demo explorers are pure SVG (no Canvas/WebGL) matching world's 2D-primary approach and dark panel aesthetic"
  - "DemoLayer uses React.lazy registry pattern for code-splitting -- each explorer loads only when demo tab activated"
  - "Concept node positions deterministic via index-based grid within region rectangle lower half"
  - "Concept connection lines styled by type: causal=solid/amber, analogous=dashed/blue, contrasting=dotted/rose"
  - "WorldMap/DepthPanel mutual exclusivity leverages existing store cross-cleanup (no new wiring needed)"
  - "Side-effect imports in WorldMap.tsx ensure concept registry populated for getConceptsForRegion calls"

patterns-established:
  - "Demo sync pattern: useDemoSync reads sceneElements (not beamSegments) to avoid feedback loops, throttles writes via useRef"
  - "Lazy demo registry: DEMO_COMPONENTS Record maps string IDs to React.lazy(() => import()) for on-demand loading"
  - "Constellation overlay: concept nodes positioned deterministically within parent region shapes, connection lines rendered between discovered concept pairs"

requirements-completed: [CONT-02, CONT-04]

# Metrics
duration: 7min
completed: 2026-02-21
---

# Phase 4 Plan 03: Demo Explorers & Constellation Map Summary

**3 SVG demo explorers with bidirectional world sync (throttled 200ms) and concept constellation overlay on WorldMap with categorized connection lines and depth panel integration**

## Performance

- **Duration:** 7 min
- **Started:** 2026-02-20T19:03:31Z
- **Completed:** 2026-02-20T19:10:45Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- 3 lightweight SVG demo explorers (MalusLaw 161 lines, CircularPol 129 lines, Brewster 173 lines) embedded in depth panel demo tab
- useDemoSync bidirectional hook with 200ms useRef throttle and pointerUp immediate sync, reading sceneElements properties (not beamSegments) to avoid feedback loops
- DemoLayer lazy-load container with Suspense + animated shimmer skeleton
- Concept constellation overlay on WorldMap: discovered concept nodes as colored dots, hover tooltip with translated name, click opens depth panel
- Categorized connection lines between discovered concepts (causal=solid/amber, analogous=dashed/blue, contrasting=dotted/rose)
- Extended WorldMap legend with concept and connection type indicators

## Task Commits

Each task was committed atomically:

1. **Task 1: Build demo explorer components with bidirectional sync** - `36562ca` (feat)
2. **Task 2: Extend WorldMap into concept constellation visualization** - `f17063d` (feat)

## Files Created/Modified
- `src/components/odyssey-world/depth/hooks/useDemoSync.ts` - Bidirectional demo-world sync hook with 200ms throttle
- `src/components/odyssey-world/demos/MalusLawExplorer.tsx` - Malus's Law: rotatable polarizer SVG + cos^2 intensity curve
- `src/components/odyssey-world/demos/CircularPolExplorer.tsx` - Circular polarization: QWP fast axis slider with ellipse morphing
- `src/components/odyssey-world/demos/BrewsterExplorer.tsx` - Brewster angle: incidence slider with Fresnel reflection visualization
- `src/components/odyssey-world/depth/DemoLayer.tsx` - Lazy-load registry with Suspense and shimmer skeleton
- `src/components/odyssey-world/depth/DepthPanelContent.tsx` - Replaced demo tab placeholder with DemoLayer component
- `src/components/odyssey-world/WorldMap.tsx` - Added ConceptNodes, ConceptConnectionLines, updated legend

## Decisions Made
- useDemoSync throttle via useRef (not lodash) matching existing discovery check throttle pattern
- Deterministic concept positions: index-based grid in region rectangle lower half, avoiding name/progress text overlap
- Demo explorers stay under 175 lines each (lightweight panel-sized, not full-page)
- WorldMap mutual exclusivity already wired at store level -- no additional OdysseyWorld or useWorldMap changes needed
- Side-effect imports in WorldMap.tsx ensure concept registry initialization

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 4 complete: all 3 plans (concept model, depth panel UI, demo explorers + constellation) delivered
- All 7 concepts have full depth panel access with three-layer content
- 3 concepts (Malus, Circular, Brewster) have interactive demo explorers with bidirectional world sync
- Constellation map provides spatial + conceptual navigation on WorldMap
- Ready for Phase 5 polish: performance optimization, accessibility, final integration testing

## Self-Check: PASSED

- All 5 created files exist on disk
- Commit 36562ca (Task 1) found in git log
- Commit f17063d (Task 2) found in git log
- Build succeeds with zero errors

---
*Phase: 04-depth-layers-content-integration*
*Completed: 2026-02-21*
