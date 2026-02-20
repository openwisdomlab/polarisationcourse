---
phase: 05-visual-polish-full-coverage
plan: 01
subsystem: content
tags: [concepts, i18n, svg-demos, depth-panel, physics-education, bilingual]

# Dependency graph
requires:
  - phase: 04-depth-layers-content-integration
    provides: concept registry, depth panel system, demo explorer pattern, constellation map
provides:
  - 11 concept definitions across 4 new regions (wave-platform, scattering-chamber, interface-lab, measurement-studio)
  - 4 interactive SVG demo explorers (RetardationExplorer, RayleighExplorer, FresnelExplorer, StokesExplorer)
  - ~200 bilingual i18n keys (en + zh) for all new concepts
  - Full 6-unit physics coverage in depth content system
affects: [05-02, 05-03, visual-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [region-concept-definition-pattern, demo-explorer-svg-pattern, side-effect-concept-import]

key-files:
  created:
    - src/components/odyssey-world/concepts/wavePlatformConcepts.ts
    - src/components/odyssey-world/concepts/scatteringChamberConcepts.ts
    - src/components/odyssey-world/concepts/interfaceLabConcepts.ts
    - src/components/odyssey-world/concepts/measurementStudioConcepts.ts
    - src/components/odyssey-world/demos/RetardationExplorer.tsx
    - src/components/odyssey-world/demos/RayleighExplorer.tsx
    - src/components/odyssey-world/demos/FresnelExplorer.tsx
    - src/components/odyssey-world/demos/StokesExplorer.tsx
  modified:
    - src/components/odyssey-world/depth/DemoLayer.tsx
    - src/components/odyssey-world/depth/DepthPanel.tsx
    - src/components/odyssey-world/WorldMap.tsx
    - src/i18n/locales/en.json
    - src/i18n/locales/zh.json

key-decisions:
  - "Cross-region connections link Phase 5 concepts to existing Phase 4 concepts (retardation->circular, fresnel->brewster, stokes->poincare, polarimetry->malus)"
  - "Rayleigh DOP formula rendered as polar scatter diagram with vertical DOP indicator bar"
  - "Stokes explorer auto-records measurements when slider passes within 4-degree threshold of measurement positions"
  - "Fresnel explorer shows both Rs/Rp curves above a ray diagram with Brewster angle annotation"

patterns-established:
  - "Region concept file pattern: export const + registerRegionConcepts() at module bottom"
  - "Demo explorer pattern: pure SVG, useDemoSync hook, single slider, ~150-200 lines"
  - "Side-effect import pattern: DepthPanel and WorldMap both import all concept files"

requirements-completed: [CONT-01, CONT-05]

# Metrics
duration: 12min
completed: 2026-02-21
---

# Phase 5 Plan 1: Full Concept Coverage Summary

**11 concept definitions across 4 regions with bilingual depth content and 4 interactive SVG demo explorers covering all 6 physics units**

## Performance

- **Duration:** 12 min
- **Started:** 2026-02-20T19:58:28Z
- **Completed:** 2026-02-20T20:11:04Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- Expanded concept coverage from 2 regions (7 concepts) to 6 regions (18 concepts total)
- Created 4 new interactive SVG demo explorers with real-time physics visualization and useDemoSync integration
- Added ~200 bilingual i18n keys with academic-accessible physics explanations in English and Chinese
- All 6 physics units (polarizers, modulation, interfaces, transparent media, scattering, measurement) now have depth content

## Task Commits

Each task was committed atomically:

1. **Task 1: Create 4 region concept definitions with bilingual i18n** - `38f126b` (feat)
2. **Task 2: Build 4 demo explorers and wire registrations** - `3411a09` (feat)

## Files Created/Modified

- `src/components/odyssey-world/concepts/wavePlatformConcepts.ts` - 3 concepts: retardation series, waveplate compensation, Poincare sphere
- `src/components/odyssey-world/concepts/scatteringChamberConcepts.ts` - 2 concepts: Rayleigh polarization, sky polarization pattern
- `src/components/odyssey-world/concepts/interfaceLabConcepts.ts` - 3 concepts: Fresnel reflection, medium comparison, stacked interfaces
- `src/components/odyssey-world/concepts/measurementStudioConcepts.ts` - 3 concepts: Stokes measurement, DOP, full polarimetry
- `src/components/odyssey-world/demos/RetardationExplorer.tsx` - Waveplate retardation slider with polarization ellipse morphing
- `src/components/odyssey-world/demos/RayleighExplorer.tsx` - Rayleigh scattering polar diagram with DOP indicator
- `src/components/odyssey-world/demos/FresnelExplorer.tsx` - Rs/Rp reflection coefficient curves with ray diagram
- `src/components/odyssey-world/demos/StokesExplorer.tsx` - Rotating analyzer with auto-recording Stokes measurement
- `src/components/odyssey-world/depth/DemoLayer.tsx` - Added 4 new lazy component entries (7 total)
- `src/components/odyssey-world/depth/DepthPanel.tsx` - Added 4 new side-effect concept imports (6 total)
- `src/components/odyssey-world/WorldMap.tsx` - Added 4 new side-effect concept imports (6 total)
- `src/i18n/locales/en.json` - ~100 new concept content keys
- `src/i18n/locales/zh.json` - ~100 new concept content keys (Chinese translations)

## Decisions Made

- Cross-region connections link new concepts bidirectionally: retardation-series connects to circular-polarization (causal), poincare-sphere to stokes-measurement (analogous), rayleigh-polarization to fresnel-reflection (analogous), fresnel-reflection to brewster-angle (causal), stokes-measurement to degree-of-polarization (causal), full-polarimetry to malus-law (analogous)
- Rayleigh DOP formula visualized as polar scatter diagram with a vertical bar indicator rather than a curve plot, matching the angular nature of scattering
- Stokes explorer uses auto-recording approach: sliding through measurement angles (0/45/90/135) within 4-degree threshold automatically captures the intensity reading
- Fresnel explorer uses dual visualization: Rs/Rp curves on top + incident/reflected/refracted ray diagram below, extending the Brewster concept by showing both polarization components

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 6 physics units now have depth content with three-layer explanations
- 7 demo explorers total provide interactive visualization for key concepts
- Constellation map will show all 18 concepts with cross-region connection lines
- Ready for Phase 5 Plan 2 (visual polish and performance optimization)

## Self-Check: PASSED

- All 8 created files verified present on disk
- Task 1 commit `38f126b` verified in git log
- Task 2 commit `3411a09` verified in git log
- Build passes with zero TypeScript errors

---
*Phase: 05-visual-polish-full-coverage*
*Completed: 2026-02-21*
