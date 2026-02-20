---
phase: 04-depth-layers-content-integration
plan: 02
subsystem: ui
tags: [framer-motion, katex, svg-diagrams, depth-panel, i18n, zustand]

# Dependency graph
requires:
  - phase: 04-depth-layers-content-integration
    provides: ConceptDefinition type system, concept registry (7 concepts), store depth panel state, i18n concept content
provides:
  - DepthPanel right-side slide-in overlay with spring animation and three exit methods
  - ConceptTooltip hover trigger on discovered optical elements
  - QualitativeLayer with 7 inline SVG physics diagrams (animated)
  - QuantitativeLayer with KaTeX formula cards and collapsible derivation
  - OpticalElement and LightSource wired with concept hover triggers
affects: [04-03-constellation-map, 05-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [depth-panel-overlay-pattern, svg-physics-diagram-pattern, concept-tooltip-trigger-pattern]

key-files:
  created:
    - src/components/odyssey-world/depth/DepthPanel.tsx
    - src/components/odyssey-world/depth/DepthPanelContent.tsx
    - src/components/odyssey-world/depth/ConceptTooltip.tsx
    - src/components/odyssey-world/depth/QualitativeLayer.tsx
    - src/components/odyssey-world/depth/QuantitativeLayer.tsx
  modified:
    - src/components/odyssey-world/OdysseyWorld.tsx
    - src/components/odyssey-world/OpticalElement.tsx
    - src/components/odyssey-world/LightSource.tsx
    - src/components/odyssey-world/IsometricScene.tsx
    - src/stores/odysseyWorldStore.ts
    - src/i18n/locales/en.json
    - src/i18n/locales/zh.json

key-decisions:
  - "Side-effect imports in DepthPanel.tsx to ensure concept registry initialization (crystalLabConcepts, refractionBenchConcepts)"
  - "WorldMap and DepthPanel mutually exclusive via store action cross-cleanup (openDepthPanel closes worldMap, toggleWorldMap closes depthPanel)"
  - "Container rect offset compensation for tooltip positioning (worldToScreenWithCamera + getBoundingClientRect)"
  - "Spring animation stiffness 120, damping 20 for ~0.7s panel settle time (research-validated)"
  - "Qualitative text split by double-newline into paragraphs for prose-like layout"
  - "Derivation section uses simple useState toggle (not heavy accordion library) per plan spec"

patterns-established:
  - "DepthPanel overlay pattern: fixed z-30 backdrop + fixed z-40 panel, AnimatePresence for enter/exit, Escape+close+backdrop dismiss"
  - "Concept hover trigger: getConceptForElement + allTimeDiscoveries check + worldToScreenWithCamera position"
  - "SVG physics diagrams: inline SVG with Framer Motion micro-animations, dark aesthetic, 440x200 viewBox"

requirements-completed: [VISL-05, DISC-03]

# Metrics
duration: 12min
completed: 2026-02-21
---

# Phase 4 Plan 02: Depth Panel UI & Content Layers Summary

**Right-side slide-in depth panel with 7 SVG physics diagrams, KaTeX formula rendering, hover tooltips on discovered elements, and three-layer content navigation (intuition/qualitative/quantitative)**

## Performance

- **Duration:** 12 min
- **Started:** 2026-02-20T18:46:21Z
- **Completed:** 2026-02-20T18:58:21Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- DepthPanel slide-in overlay (65vw, spring animation stiffness 120/damping 20) with backdrop blur and three exit methods
- ConceptTooltip hover trigger on optical elements with invisible gating (only discovered concepts show tooltip)
- 7 inline SVG physics diagrams with Framer Motion micro-animations matching the dark isometric aesthetic
- KaTeX formula rendering in styled cards with collapsible derivation sections
- Full integration: OdysseyWorld, OpticalElement, LightSource, IsometricScene all wired

## Task Commits

Each task was committed atomically:

1. **Task 1: Create DepthPanel overlay with ConceptTooltip trigger** - `59afebd` (feat)
2. **Task 2: Implement QualitativeLayer and QuantitativeLayer content renderers** - `096b82e` (feat)

## Files Created/Modified
- `src/components/odyssey-world/depth/DepthPanel.tsx` - Main overlay: backdrop z-30, panel z-40, Escape/close/backdrop dismiss
- `src/components/odyssey-world/depth/DepthPanelContent.tsx` - Tab navigation (qualitative/quantitative/demo), concept header with intuition
- `src/components/odyssey-world/depth/ConceptTooltip.tsx` - Hover tooltip at z-20, positioned near element, "Learn more" click opens panel
- `src/components/odyssey-world/depth/QualitativeLayer.tsx` - 7 SVG diagrams (Malus, Crossed, Circular, Three-Polarizer, Brewster, Snell, TIR) with animations
- `src/components/odyssey-world/depth/QuantitativeLayer.tsx` - KaTeX formula cards, collapsible derivation, bilingual labels
- `src/components/odyssey-world/OdysseyWorld.tsx` - Added ConceptTooltip and DepthPanel overlays
- `src/components/odyssey-world/OpticalElement.tsx` - Added concept hover trigger via getConceptForElement + allTimeDiscoveries gating
- `src/components/odyssey-world/LightSource.tsx` - Added concept hover trigger (same pattern as OpticalElement)
- `src/components/odyssey-world/IsometricScene.tsx` - Pass camera props to LightSource for tooltip positioning
- `src/stores/odysseyWorldStore.ts` - WorldMap/DepthPanel mutual exclusivity in openDepthPanel and toggleWorldMap
- `src/i18n/locales/en.json` - Added tryItYourself, showDerivation, hideDerivation keys
- `src/i18n/locales/zh.json` - Added tryItYourself, showDerivation, hideDerivation keys (Chinese)

## Decisions Made
- Side-effect imports ensure concept registries load before DepthPanel renders
- WorldMap and DepthPanel mutually exclusive at store level (not just UI)
- Tooltip position calculated from worldToScreenWithCamera + container offset
- Diagrams use 440px-wide viewBox to fit within 65vw panel content area
- Derivation toggle uses useState (lightweight) not an accordion library

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Side-effect imports for concept registry initialization**
- **Found during:** Task 1 (DepthPanel creation)
- **Issue:** crystalLabConcepts.ts and refractionBenchConcepts.ts call registerRegionConcepts() at module level, but are not imported anywhere -- CONCEPT_REGISTRY would be empty at runtime
- **Fix:** Added side-effect imports in DepthPanel.tsx: `import '@/components/odyssey-world/concepts/crystalLabConcepts'` and `import '@/components/odyssey-world/concepts/refractionBenchConcepts'`
- **Files modified:** src/components/odyssey-world/depth/DepthPanel.tsx
- **Verification:** Build passes, concepts available at runtime
- **Committed in:** 59afebd (Task 1 commit)

**2. [Rule 2 - Missing Critical] WorldMap/DepthPanel mutual exclusivity**
- **Found during:** Task 1 (Wiring into OdysseyWorld)
- **Issue:** Plan specifies WorldMap and DepthPanel never coexist open, but store actions don't enforce this
- **Fix:** openDepthPanel sets worldMapOpen: false; toggleWorldMap sets depthPanelConceptId: null when opening
- **Files modified:** src/stores/odysseyWorldStore.ts
- **Verification:** Build passes, opening one panel closes the other
- **Committed in:** 59afebd (Task 1 commit)

**3. [Rule 3 - Blocking] LightSource camera props for tooltip positioning**
- **Found during:** Task 1 (LightSource hover trigger wiring)
- **Issue:** LightSource not receiving containerRef/cameraX/cameraY/zoom props needed for worldToScreenWithCamera tooltip positioning
- **Fix:** Extended LightSourceProps interface and updated IsometricScene.tsx to pass camera props
- **Files modified:** src/components/odyssey-world/LightSource.tsx, src/components/odyssey-world/IsometricScene.tsx
- **Verification:** Build passes, LightSource receives positioning data
- **Committed in:** 59afebd (Task 1 commit)

---

**Total deviations:** 3 auto-fixed (1 missing critical, 2 blocking)
**Impact on plan:** All essential for correct runtime behavior. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Depth panel UI complete and ready for DemoLayer integration (Plan 03)
- All 7 concept SVG diagrams render with animations
- Concept hover triggers active on optical elements and light sources
- Store mutual exclusivity ensures clean panel transitions
- Constellation map (Plan 03) can reuse concept registry connections data

## Self-Check: PASSED

- All 5 created files exist on disk
- Commit 59afebd (Task 1) found in git log
- Commit 096b82e (Task 2) found in git log
- Build succeeds with zero errors

---
*Phase: 04-depth-layers-content-integration*
*Completed: 2026-02-21*
