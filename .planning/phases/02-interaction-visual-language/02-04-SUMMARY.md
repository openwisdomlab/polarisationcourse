---
phase: 02-interaction-visual-language
plan: 04
subsystem: ui
tags: [zustand, framer-motion, svg, discovery-system, polarization-legend, stokes-parameters, environmental-feedback]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "odysseyWorldStore with SceneElement/BeamSegment types, isometric.ts coordinate utilities, worldToScreen"
  - phase: 02-interaction-visual-language
    plan: 01
    provides: "Interaction hooks (useElementDrag, useElementRotation, useElementSelection), store CRUD actions"
  - phase: 02-interaction-visual-language
    plan: 02
    provides: "Interactive OpticalElement with rotation handle, BeamGlowFilters visual hierarchy"
  - phase: 02-interaction-visual-language
    plan: 03
    provides: "EnvironmentPopup, environment element type, property editing"
provides:
  - "Discovery state system with 5 physics-based configurations (Malus's Law, Crossed Polarizers, Circular Polarization, Half-Wave Rotation, Three-Polarizer Surprise)"
  - "DiscoveryFeedback SVG component with 4 environmental response types (illuminate, color-shift, pattern, particle-burst)"
  - "PolarizationLegend HTML overlay with 4 progressive legend items (orientation, intensity, ellipticity, intensity-opacity)"
  - "useDiscoveryState hook with throttled discovery checking (200ms) and delayed encoding detection (1s)"
  - "Store extensions: achievedDiscoveries Set, discoveredEncodings, rotationHistory Map, achieve/discover/record actions"
  - "Rotation history tracking in useElementRotation for Malus's Law discovery detection"
affects: [03-multi-region]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Discovery config pattern: check function with Stokes parameter thresholds + response definition with SVG animation type"
    - "Set-based discovery tracking with immutable updates (new Set on each achieve) for Zustand compatibility"
    - "Map-based rotation history with immutable updates for per-element angle tracking"
    - "SVG layer ordering: L2 objects > L2.5 discovery feedback > L3 beam for visual dominance (VISL-03)"
    - "Throttled discovery checking (setTimeout 200ms) to avoid expensive checks on every frame during rotation"
    - "Progressive legend reveal via AnimatePresence with spring animation and glass-morphism backdrop"

key-files:
  created:
    - src/components/odyssey-world/hooks/useDiscoveryState.ts
    - src/components/odyssey-world/DiscoveryFeedback.tsx
    - src/components/odyssey-world/PolarizationLegend.tsx
  modified:
    - src/stores/odysseyWorldStore.ts
    - src/components/odyssey-world/IsometricScene.tsx
    - src/components/odyssey-world/OdysseyWorld.tsx
    - src/components/odyssey-world/hooks/useElementRotation.ts

key-decisions:
  - "Discovery checks throttled to 200ms via setTimeout -- avoids expensive Stokes comparisons on every frame during rapid rotation"
  - "Encoding discoveries delayed 1 second per research recommendation -- prevents premature legend reveal before student notices the change"
  - "DiscoveryFeedback layer inserted as L2.5 (between objects and beam) to maintain beam visual dominance (VISL-03)"
  - "Discovery area groups positioned at fixed worldToScreen coordinates near relevant optical elements"
  - "PolarizationLegend as HTML overlay (not SVG) -- consistent with EnvironmentPopup pattern for reliable text rendering"
  - "Each discovery area renders its own DiscoveryFeedback instance filtered to its discovery ID for clean SVG positioning"

patterns-established:
  - "Discovery config pattern: interface with id, name, check function (elements, segments, history) => boolean, response definition"
  - "Progressive reveal pattern: HTML overlay with AnimatePresence items that appear as store flags flip true"
  - "Rotation history tracking: recordRotation called on every commitRotation for discovery condition analysis"

requirements-completed: [DISC-01, DISC-04, PHYS-03]

# Metrics
duration: 7min
completed: 2026-02-20
---

# Phase 2 Plan 4: Discovery & Feedback System Summary

**5 physics discovery configurations with Stokes-parameter-based checks, SVG environmental responses (illuminate/pattern/color-shift/particle-burst), and progressive polarization legend revealing encoding aspects through interaction**

## Performance

- **Duration:** 7 min
- **Started:** 2026-02-20T12:59:26Z
- **Completed:** 2026-02-20T13:06:59Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Built 5 discovery configurations with physics-based check functions using Stokes parameter thresholds: Malus's Law (rotation range >= 90 deg, 3+ distinct intensity levels), Crossed Polarizers (85-95 deg axis difference, s0 < 0.05), Circular Polarization (|s3| > 0.4 + helix shape), Half-Wave Rotation (color change without intensity loss), Three-Polarizer Surprise (3 polarizers with first/last crossed but light restored)
- Created DiscoveryFeedback SVG component with 4 environmental response types: illuminate (radial gradient glow), pattern (phosphorescent geometric reveal), color-shift (surface color transition), particle-burst (orbital shimmer particles)
- Built PolarizationLegend HTML overlay with 4 progressive items (Color=Direction, Brightness=Intensity, Shape=Polarization Type, Width=Strength) that reveal through interaction
- Extended odysseyWorldStore with achievedDiscoveries (Set), discoveredEncodings, and rotationHistory (Map) state plus corresponding actions
- Wired rotation history tracking into useElementRotation for Malus's Law discovery detection

## Task Commits

Each task was committed atomically:

1. **Task 1: Build discovery state system with 5 physics configurations and environmental responses** - `505e401` (feat)
2. **Task 2: Build progressive polarization legend and wire everything into the scene** - `8393b88` (feat)

## Files Created/Modified
- `src/components/odyssey-world/hooks/useDiscoveryState.ts` - 5 DiscoveryConfig definitions with Stokes-based check functions, useDiscoveryState hook with throttled checking and encoding tracking
- `src/components/odyssey-world/DiscoveryFeedback.tsx` - SVG environmental response animations (illuminate, color-shift, pattern, particle-burst) with Framer Motion spring animations
- `src/components/odyssey-world/PolarizationLegend.tsx` - Progressive HTML overlay legend with 4 encoding items, glass-morphism backdrop, AnimatePresence reveal
- `src/stores/odysseyWorldStore.ts` - Added achievedDiscoveries Set, discoveredEncodings object, rotationHistory Map, and achieve/discover/record actions
- `src/components/odyssey-world/IsometricScene.tsx` - Added Layer 2.5 discovery feedback with 5 positioned area groups, DiscoveryFeedback import
- `src/components/odyssey-world/OdysseyWorld.tsx` - Wired useDiscoveryState hook, PolarizationLegend overlay, passes discovery state to IsometricScene
- `src/components/odyssey-world/hooks/useElementRotation.ts` - Added recordRotation calls to commitRotation for discovery history tracking

## Decisions Made
- Discovery checks throttled to 200ms to avoid expensive Stokes comparisons during rapid rotation
- Encoding discoveries delayed 1 second per research recommendation to let students notice changes before legend reveals
- DiscoveryFeedback layer at L2.5 (between objects L2 and beam L3) maintains beam visual dominance per VISL-03
- PolarizationLegend uses HTML overlay (not SVG) consistent with established EnvironmentPopup pattern
- Each discovery area group renders its own filtered DiscoveryFeedback instance for clean SVG transform positioning
- Environmental responses use subtle spring animations (stiffness 40-60, damping 15-20) with 15-40% opacity for The Witness quality

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 2 (Interaction & Visual Language) fully complete with all 4 plans executed
- Complete interaction flow wired: hover -> select -> rotate -> discovery triggers -> environmental response -> legend reveal
- 5 physics discoveries with specific Stokes parameter thresholds ready for playtesting
- Progressive legend teaches visual encoding through doing, not reading
- Ready for Phase 3 (Multi-Region expansion)
- No blockers

## Self-Check: PASSED

All 7 files verified present. Both task commits (505e401, 8393b88) verified in git log. Build passes with zero TypeScript errors.

---
*Phase: 02-interaction-visual-language*
*Completed: 2026-02-20*
