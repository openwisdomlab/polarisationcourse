---
phase: 04-depth-layers-content-integration
plan: 01
subsystem: ui
tags: [zustand, i18n, typescript, polarization-optics, concept-registry]

# Dependency graph
requires:
  - phase: 03-multi-region-expansion
    provides: regionRegistry with discovery configs, odysseyWorldStore with multi-region state
provides:
  - ConceptDefinition type system with three-layer content model (intuition/qualitative/quantitative)
  - Concept registry with 7 concepts across Crystal Lab (4) and Refraction Bench (3)
  - Store depth panel state (depthPanelConceptId, depthPanelActiveTab, tooltipConceptId, tooltipPosition)
  - Bilingual i18n content under odyssey.concepts for all 7 concepts
affects: [04-02-depth-panel-ui, 04-03-constellation-map, 05-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [concept-registry-pattern, three-layer-content-model, ephemeral-ui-state-in-zustand]

key-files:
  created:
    - src/components/odyssey-world/concepts/conceptRegistry.ts
    - src/components/odyssey-world/concepts/crystalLabConcepts.ts
    - src/components/odyssey-world/concepts/refractionBenchConcepts.ts
  modified:
    - src/stores/odysseyWorldStore.ts
    - src/i18n/locales/en.json
    - src/i18n/locales/zh.json

key-decisions:
  - "4 Crystal Lab concepts (Malus, Crossed, Circular, Three-Polarizer) cover core polarization principles"
  - "3 Refraction Bench concepts (Brewster, Snell Polarization, TIR) cover interface phenomena"
  - "triggerCondition always 'discovered' -- invisible gating per research recommendation"
  - "Depth panel default tab is 'qualitative' -- formulas are deepest layer, never shown first"
  - "Depth panel state excluded from persist partialize (whitelist pattern) -- ephemeral UI state"

patterns-established:
  - "ConceptDefinition three-layer model: intuition (observation) -> qualitative (diagram + explanation) -> quantitative (LaTeX formulas)"
  - "registerRegionConcepts() eager registration pattern -- concept data is lightweight i18n keys"
  - "Cross-region concept connections via targetConceptId with causal/analogous/contrasting types"

requirements-completed: [DISC-03, CONT-03]

# Metrics
duration: 9min
completed: 2026-02-21
---

# Phase 4 Plan 01: Concept Data Model & Store Foundation Summary

**ConceptDefinition type system with 7 physics concepts (4 Crystal Lab + 3 Refraction Bench), three-layer depth content (intuition/qualitative/quantitative), bilingual i18n, and Zustand depth panel state**

## Performance

- **Duration:** 9 min
- **Started:** 2026-02-20T18:33:44Z
- **Completed:** 2026-02-20T18:42:17Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- ConceptDefinition type system with ConceptLayer, RegionConcepts interfaces and 5 utility functions
- 7 physics concepts with full three-layer content (16 LaTeX formulas, bilingual qualitative explanations)
- Store depth panel state (4 fields, 5 actions) with automatic cleanup on region switch
- Cross-region concept graph with 13 connections (causal, analogous, contrasting)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ConceptDefinition type system and registry utilities** - `1c6a1d4` (feat)
2. **Task 2: Populate Crystal Lab and Refraction Bench concepts with store extensions and i18n** - `957a5f0` (feat)

## Files Created/Modified
- `src/components/odyssey-world/concepts/conceptRegistry.ts` - ConceptDefinition types, CONCEPT_REGISTRY Map, 5 utility functions
- `src/components/odyssey-world/concepts/crystalLabConcepts.ts` - 4 Crystal Lab concepts (Malus's Law, Crossed Polarizers, Circular Polarization, Three-Polarizer Surprise)
- `src/components/odyssey-world/concepts/refractionBenchConcepts.ts` - 3 Refraction Bench concepts (Brewster's Angle, Snell's Law Polarization, Total Internal Reflection)
- `src/stores/odysseyWorldStore.ts` - Depth panel state fields, 5 actions, switchRegion cleanup
- `src/i18n/locales/en.json` - English concept content (7 concepts x 3 layers)
- `src/i18n/locales/zh.json` - Chinese concept content with standard optics terminology

## Decisions Made
- Selected 4 of 7 Crystal Lab discoveries for concept definitions (core physics principles, not all discoveries need depth content)
- Selected 3 of 4 Refraction Bench discoveries (angle-dependent polarization excluded as it overlaps with Brewster content)
- switchRegion action clears depth panel state to prevent stale concept display after region transition
- Depth panel state uses whitelist partialize pattern -- automatically excluded from persistence without explicit listing

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added switchRegion depth panel cleanup**
- **Found during:** Task 2 (Store extensions)
- **Issue:** switchRegion action didn't clear depth panel state, which could leave stale concept panels open after region transition
- **Fix:** Added depthPanelConceptId: null, tooltipConceptId: null, tooltipPosition: null to switchRegion's return object
- **Files modified:** src/stores/odysseyWorldStore.ts
- **Verification:** Build passes, state fields reset in switchRegion
- **Committed in:** 957a5f0 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Essential for correct UX -- stale depth panels after region switch would confuse users. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Concept registry populated and ready for depth panel UI consumption (Plan 02)
- Store depth panel state ready for DepthPanel component binding
- i18n content available for immediate rendering in depth panel
- Concept connections ready for constellation map visualization (Plan 03)

## Self-Check: PASSED

- All 3 created files exist on disk
- Commit 1c6a1d4 (Task 1) found in git log
- Commit 957a5f0 (Task 2) found in git log
- Build succeeds with zero errors

---
*Phase: 04-depth-layers-content-integration*
*Completed: 2026-02-21*
