---
phase: 01-foundation-minimum-viable-scene
plan: 02
subsystem: scene-rendering
tags: [isometric, svg, framer-motion, click-to-move, camera, hud, odyssey]

# Dependency graph
requires:
  - "01-01: Isometric coordinate math utilities and Odyssey world store"
provides:
  - "Complete SVG isometric scene renderer with multi-level platforms and depth sorting"
  - "Camera pan/zoom system using Framer Motion MotionValues (GPU-composited, no React re-renders)"
  - "Click-to-move navigation with screen-to-world coordinate conversion and spring animation"
  - "HUD overlay with back button, minimap, and settings placeholder"
  - "Scene element components: Platform, LightSource, OpticalElement, Decoration, Avatar"
  - "Distant region silhouettes at scene edges preparing for Phase 3"
affects: [01-03, phase-02-interaction, phase-03-multi-region]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Framer Motion useMotionValue for 60fps camera pan (bypasses React rendering)", "SVG layered scene composition with painter's algorithm depth sorting", "CSS transform on motion.div for GPU-composited camera transforms", "React.memo on static scene elements with stable keys"]

key-files:
  created:
    - src/components/odyssey-world/OdysseyWorld.tsx
    - src/components/odyssey-world/IsometricScene.tsx
    - src/components/odyssey-world/SceneLayer.tsx
    - src/components/odyssey-world/Platform.tsx
    - src/components/odyssey-world/Decoration.tsx
    - src/components/odyssey-world/LightSource.tsx
    - src/components/odyssey-world/OpticalElement.tsx
    - src/components/odyssey-world/Avatar.tsx
    - src/components/odyssey-world/HUD.tsx
    - src/components/odyssey-world/hooks/useIsometricCamera.ts
    - src/components/odyssey-world/hooks/useClickToMove.ts
  modified:
    - src/pages/OdysseyPage.tsx

key-decisions:
  - "SVG viewBox 2400x1600 with centered origin for scene larger than viewport"
  - "Camera transform applied via scale() then translate() on motion.div for correct zoom-toward-cursor behavior"
  - "Zoom-toward-cursor algorithm preserves world point under cursor by recalculating camera offset"
  - "Avatar is a glowing photon orb (not character) with MotionValue-driven position for zero React re-renders during animation"
  - "Minimap renders simplified platform outlines with avatar position dot using store data"

patterns-established:
  - "IsometricCamera pattern: useMotionValue for position, useTransform for CSS string, sync to Zustand only on animation complete"
  - "ClickToMove pattern: getBoundingClientRect + screenToWorldWithCamera + animate() with spring config"
  - "SceneElement rendering dispatch: switch on element.type to select component (Platform/LightSource/OpticalElement/Decoration)"
  - "Scene layering: background -> platforms -> objects -> beams (empty) -> avatar in SVG g groups"

requirements-completed: [WRLD-01, WRLD-04, VISL-02, VISL-04, TECH-01, TECH-05]

# Metrics
duration: 6min
completed: 2026-02-20
---

# Phase 1 Plan 2: Isometric Scene Rendering Summary

**SVG isometric laboratory scene with multi-level platforms, click-to-move navigation via spring physics, GPU-composited camera pan/zoom, and HUD overlay with minimap**

## Performance

- **Duration:** 6 min
- **Started:** 2026-02-20T07:23:19Z
- **Completed:** 2026-02-20T07:30:00Z
- **Tasks:** 1
- **Files modified:** 12

## Accomplishments
- Full isometric scene rendering with warm gradient background (#FAFAF5 to #F0EDE6), faint isometric grid at 2% opacity, and distant region silhouettes at edges
- Camera system using Framer Motion useMotionValue for 60fps pan/zoom -- CSS transforms applied to motion.div, zero React re-renders during animation, sync to Zustand only on completion
- Click-to-move navigation converting screen clicks to world coordinates via screenToWorldWithCamera, animating avatar and camera with spring physics (stiffness 80, damping 18)
- Multi-level platforms with Z=0 ground (warm off-white) and Z=1 elevated (glass material with highlights and side faces)
- Scene element components: LightSource with pulsing animation, OpticalElement (polarizer/waveplate) with wobble animation, Decoration (lens-stand, crystal-cluster, prism-display, notebook) with floating animation
- HUD overlay with back button (top-left), settings placeholder (top-right), and minimap (bottom-right) showing platform outlines and avatar position

## Task Commits

Each task was committed atomically:

1. **Task 1: Build isometric scene rendering with SVG layers and camera system** - `7af4523` (feat)

## Files Created/Modified
- `src/components/odyssey-world/OdysseyWorld.tsx` - Root component composing scene + HUD, connects camera/navigation hooks to IsometricScene
- `src/components/odyssey-world/IsometricScene.tsx` - Main SVG viewport with camera transform, layered rendering (background/platforms/objects/beams/avatar), shared defs for gradients and filters
- `src/components/odyssey-world/SceneLayer.tsx` - Depth-sorting wrapper using depthSort() for painter's algorithm ordering
- `src/components/odyssey-world/Platform.tsx` - Isometric diamond platform with side faces for Z>0, glass material variant with highlights
- `src/components/odyssey-world/Decoration.tsx` - Non-interactive decorations (4 variants) with floating idle animation
- `src/components/odyssey-world/LightSource.tsx` - Light emitter with radial glow halo and pulsing scale animation
- `src/components/odyssey-world/OpticalElement.tsx` - Polarizer (parallel lines) and waveplate (diagonal hatching) with wobble animation
- `src/components/odyssey-world/Avatar.tsx` - Photon explorer orb with breathing glow, MotionValue-driven position
- `src/components/odyssey-world/HUD.tsx` - Semi-transparent overlay with back button, settings, minimap (platform outlines + avatar dot)
- `src/components/odyssey-world/hooks/useIsometricCamera.ts` - Camera pan/zoom using MotionValues, zoom-toward-cursor, debounced store sync
- `src/components/odyssey-world/hooks/useClickToMove.ts` - Click handler with coordinate conversion, spring animation for avatar and camera
- `src/pages/OdysseyPage.tsx` - Updated to render OdysseyWorld instead of placeholder

## Decisions Made
- SVG viewBox uses centered origin (-1200, -400, 2400, 1600) for natural scene centering -- scene is larger than viewport for exploration
- Camera transform order is scale() then translate() so zoom operates from top-left origin while translate moves in scaled space
- Zoom-toward-cursor preserves the world point under the cursor by solving for the new camera offset algebraically
- Avatar photon orb uses MotionValue-driven cx/cy attributes for zero React overhead during movement animation
- Minimap subscribes to store avatarX/avatarY directly (simple data, no motion values) for accurate position display
- Distant region silhouettes use 12% opacity with muted colors -- just enough to suggest neighboring areas without drawing attention

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused React import in HUD.tsx**
- **Found during:** Task 1 (build verification)
- **Issue:** TypeScript strict mode flagged `React` as declared but never read in HUD.tsx (React 19 JSX transform doesn't need explicit import)
- **Fix:** Changed `import React, { useMemo }` to `import { useMemo }`
- **Files modified:** `src/components/odyssey-world/HUD.tsx`
- **Verification:** `pnpm run build` passes with zero errors
- **Committed in:** `7af4523` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Trivial TypeScript strict mode compliance. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Scene rendering complete with all element types visible and animated
- Camera system ready for Plan 03 beam rendering (beam layer SVG group and glow filter already defined in defs)
- Click-to-move tested via build -- coordinate conversion chain verified through type-checking
- Avatar position system ready to be enhanced with pathfinding constraints in Phase 2
- HUD minimap ready to show beam paths when added in Plan 03

## Self-Check: PASSED

All 11 created files and 1 modified file verified on disk. Task commit (7af4523) found in git log.

---
*Phase: 01-foundation-minimum-viable-scene*
*Completed: 2026-02-20*
