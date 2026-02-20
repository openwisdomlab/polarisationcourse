---
phase: 02-interaction-visual-language
plan: 01
subsystem: ui
tags: [zustand, hooks, isometric, drag-drop, rotation, beam-physics, pointer-events]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "odysseyWorldStore with SceneElement/BeamSegment types, isometric.ts coordinate utilities, useBeamPhysics with calculateBeamPath"
provides:
  - "Granular element CRUD store actions (updateElement, addElement, removeElement)"
  - "Selection/hover state management (selectElement, hoverElement)"
  - "Interaction mode tracking (navigate/drag/rotate/idle)"
  - "Drag preview position for ghost beam calculation"
  - "useElementDrag hook with pointer capture and magnetic beam snap"
  - "useElementRotation hook with atan2 drag handle and scroll wheel input"
  - "useElementSelection hook with click-vs-drag differentiation"
  - "useBeamPreview hook for ghost beam path preview during drag"
  - "snapToBeamPath utility for projecting points onto beam segments"
affects: [02-02-PLAN, 02-03-PLAN, 02-04-PLAN]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Granular Zustand CRUD with .map() for immutable array updates that trigger downstream recalculation"
    - "useRef for per-frame interaction state (no React re-renders during pointer tracking)"
    - "setPointerCapture for reliable cross-element drag tracking"
    - "Parametric segment projection for magnetic beam path snapping"
    - "Shared calculateBeamPath between useBeamPhysics and useBeamPreview (single source of truth)"

key-files:
  created:
    - src/components/odyssey-world/hooks/useElementDrag.ts
    - src/components/odyssey-world/hooks/useElementRotation.ts
    - src/components/odyssey-world/hooks/useElementSelection.ts
    - src/components/odyssey-world/hooks/useBeamPreview.ts
  modified:
    - src/stores/odysseyWorldStore.ts
    - src/lib/isometric.ts

key-decisions:
  - "snapToBeamPath uses parametric projection with 0.5 grid quantization for clean element placement"
  - "Rotation sync updates both rotation and physics properties (transmissionAxis/fastAxis) for real-time beam updates"
  - "useBeamPreview imports calculateBeamPath from useBeamPhysics rather than duplicating physics logic"

patterns-established:
  - "Interaction hooks pattern: useRef for per-frame state, store.getState() for reads during events, set actions for commits"
  - "Click-vs-drag differentiation: 5px DRAG_THRESHOLD shared across useElementDrag and useElementSelection"
  - "Throttled store updates: only commit when value change exceeds threshold (0.5 degrees for rotation, position equality for snap)"

requirements-completed: [INTR-01, INTR-02, INTR-04]

# Metrics
duration: 4min
completed: 2026-02-20
---

# Phase 2 Plan 1: Store Extension and Interaction Hooks Summary

**Zustand store extended with granular element CRUD and 4 interaction hooks (drag/rotate/select/beam-preview) using pointer capture and magnetic beam path snapping**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-20T12:32:02Z
- **Completed:** 2026-02-20T12:36:40Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Extended odysseyWorldStore with 7 new actions (updateElement, addElement, removeElement, selectElement, hoverElement, setInteractionMode, setDragPreviewPos) and 4 new state fields
- Added snapToBeamPath to isometric.ts with parametric segment projection and 0.5 grid quantization
- Created 4 interaction hooks that use useRef for per-frame tracking and setPointerCapture for reliable drag
- Ensured calculateBeamPath is shared (not duplicated) between useBeamPhysics and useBeamPreview

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend store with element CRUD, selection state, and interaction tracking** - `4291e26` (feat)
2. **Task 2: Create interaction hooks (drag, rotation, selection, beam preview)** - `6d42183` (feat)

## Files Created/Modified
- `src/stores/odysseyWorldStore.ts` - Added InteractionMode type, 4 state fields, 7 actions for element CRUD and interaction
- `src/lib/isometric.ts` - Added snapToBeamPath with parametric projection, quantize helper, SnapResult type
- `src/components/odyssey-world/hooks/useElementDrag.ts` - Pointer capture drag with screen-to-world conversion and beam snap
- `src/components/odyssey-world/hooks/useElementRotation.ts` - atan2 drag handle rotation + scroll wheel rotation with physics sync
- `src/components/odyssey-world/hooks/useElementSelection.ts` - Click-vs-drag differentiation + hover tracking via store selectors
- `src/components/odyssey-world/hooks/useBeamPreview.ts` - Ghost beam path calculation using shared calculateBeamPath

## Decisions Made
- snapToBeamPath uses parametric projection (clamp t to [0,1]) with 0.5 grid quantization -- ensures clean element placement on beam paths
- Rotation hook synchronizes both `rotation` and physics properties (`transmissionAxis` for polarizers, `fastAxis` for waveplates) -- real-time beam updates during rotation per user decision
- useBeamPreview imports calculateBeamPath from useBeamPhysics.ts rather than duplicating -- single source of truth for physics calculations
- worldToScreenWithCamera already existed in isometric.ts from Phase 1, so no additional function was needed

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All interaction hooks and store actions are ready for 02-02-PLAN.md (Interactive OpticalElement UI, element palette, ghost beam preview, visual cues)
- Hooks accept containerRef and MotionValue camera parameters -- ready to wire into IsometricScene component
- No blockers for next plan

## Self-Check: PASSED

All 6 files verified present. Both task commits (4291e26, 6d42183) verified in git log. Build passes with zero errors.

---
*Phase: 02-interaction-visual-language*
*Completed: 2026-02-20*
