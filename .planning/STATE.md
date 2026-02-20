# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-20)

**Core value:** Students voluntarily immerse in exploration for 2+ hours -- curiosity-driven discovery learning where polarization knowledge is a natural byproduct of exploring the world
**Current focus:** Phase 3 complete -- ready for Phase 4: Depth Layers & Content Integration

## Current Position

Phase: 3 of 5 (Multi-Region Isometric World) -- COMPLETE
Plan: 3 of 3 in current phase (03-03 complete)
Status: Phase Complete
Last activity: 2026-02-21 -- Completed 03-03-PLAN.md (cross-region physics & discovery)

Progress: [########..] 80%

## Performance Metrics

**Velocity:**
- Total plans completed: 10
- Average duration: 9 min
- Total execution time: 1.45 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 3 | 18 min | 6 min |
| 2 | 4 | 30 min | 8 min |
| 3 | 3 | 40 min | 13 min |

**Recent Trend:**
- Last 5 plans: 02-04 (7 min), 03-01 (13 min), 03-02 (12 min), 03-03 (15 min)
- Trend: Consistent at ~13 min for multi-region phase

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: 5 phases derived from 37 requirements -- Foundation, Interaction, Multi-Region, Depth, Polish
- [Roadmap]: One-scene-first strategy to break 5-iteration rewrite cycle -- Phase 1 delivers a single playable isometric environment
- [Revision]: 2D isometric primary, minimize 3D -- SVG/CSS/Framer Motion for world, Canvas/WebGL only for beam glow effects if needed
- [Revision]: Click/tap navigation replaces WASD free camera -- Monument Valley interaction model
- [Revision]: Removed three.js upgrade requirement (TECH-02) -- replaced with isometric geometry system requirement
- [01-01]: New odysseyWorldStore.ts created instead of modifying old odysseyStore.ts -- old store for abandoned 3D portal model
- [01-01]: Composable SceneElement types with properties Record pattern for element-specific physics data
- [01-01]: Stokes parameters stored directly on BeamSegment for physics-accurate visual encoding
- [01-02]: SVG viewBox 2400x1600 with centered origin for scene larger than viewport
- [01-02]: Camera transform uses scale() then translate() on motion.div for GPU-composited pan/zoom
- [01-02]: Zoom-toward-cursor preserves world point under cursor by recalculating camera offset
- [01-02]: Avatar photon orb uses MotionValue-driven position for zero React re-renders during movement
- [01-03]: Continuous HSL polarization encoding (not discrete 4-color) -- orientation 0-180 deg maps to hue 0-360
- [01-03]: rAF + direct DOM mutation for beam particles -- not Framer Motion (better for 50-100+ particles)
- [01-03]: Waveplate fastAxis=0 (not 22.5) for physically correct circular polarization demonstration
- [02-01]: snapToBeamPath uses parametric projection with 0.5 grid quantization for clean element placement
- [02-01]: Rotation hook syncs both rotation and physics properties (transmissionAxis/fastAxis) for real-time beam updates
- [02-01]: useBeamPreview imports calculateBeamPath from useBeamPhysics rather than duplicating physics logic
- [02-01]: Interaction hooks use useRef for per-frame state, store.getState() for event reads, set actions for commits
- [02-03]: HTML overlay popup (not SVG foreignObject) for reliable native form controls over SVG scene
- [02-03]: Popup positioned via worldToScreenWithCamera with viewport clamping for all camera positions
- [02-03]: Medium type dropdown auto-updates refractive index to standard physical values for discovery learning
- [02-03]: Outside-click dismissal uses setTimeout(0) to prevent opening click from immediately closing popup
- [02-02]: SVG filter visual hierarchy: beam-glow (1.5) > element-select-glow (1.2) > element-hover-glow (0.8) for VISL-03 beam dominance
- [02-02]: Ghost beam uses dashed stroke-dasharray with no glow filter -- visually distinct preview without competing with real beam
- [02-02]: ElementPalette at fixed SVG coordinates as diegetic shelf (not HTML overlay) for immersive design
- [02-02]: Removed broken EnvironmentElement import from pre-existing out-of-order commit to unblock build
- [02-04]: Discovery checks throttled to 200ms via setTimeout to avoid expensive Stokes comparisons during rapid rotation
- [02-04]: Encoding discoveries delayed 1 second per research recommendation -- prevents premature legend reveal
- [02-04]: DiscoveryFeedback SVG layer at L2.5 (between objects and beam) maintains beam visual dominance per VISL-03
- [02-04]: PolarizationLegend as HTML overlay consistent with EnvironmentPopup pattern for reliable text rendering
- [02-04]: Environmental responses use subtle spring animations (stiffness 40-60, damping 15-20) with 15-40% opacity
- [03-01]: Custom PersistStorage (not createJSONStorage) for direct Set/Map serialization control
- [03-01]: Crystal Lab preserves all Phase 1/2 elements expanded to 13x13 -- no scene rewrite
- [03-01]: Atomic switchRegion via single set() call to prevent stale beam physics
- [03-01]: Rotation history capped at 20 entries per element during deserialization
- [03-01]: Hydration-aware initScene via onFinishHydration + hasHydrated guard
- [03-02]: Ref-based callback pattern for useRegionTransition/useClickToMove to avoid circular initialization
- [03-02]: Boundary proximity radius 0.8 grid units -- triggers region transition when avatar walks near exit point
- [03-02]: First-entry zoom arc (0.8 -> 1.0, stiffness 40) vs normal spring (stiffness 60) for reveal feeling
- [03-02]: MotionValue-driven avatar opacity for consistent Framer Motion animation during transitions
- [03-02]: Decoration layer at L1.5 (between platforms and objects) for correct visual layering
- [03-02]: preloadAdjacentRegions via switch-case explicit imports for reliable Vite chunk splitting
- [03-03]: Lazy evaluation for cross-region beams -- only active region runs physics, boundary beams stored as metadata
- [03-03]: World map as lightweight HTML overlay (not SVG scene element) per research pitfall 5
- [03-03]: Invisible palette gating per DISC-02 -- items appear without locked state
- [03-03]: Meta-discoveries auto-achieved via queueMicrotask when all prerequisites met
- [03-03]: Per-region discovery configs replace hardcoded global list for scalable region content
- [03-03]: CSS animations (not Framer Motion) for boundary indicators to maintain beam layer lightweight pattern
- [03-03]: allTimeDiscoveries Set for global discovery accumulation -- switchRegion only overwrites per-region achievedDiscoveries, not the global set

### Pending Todos

None yet.

### Blockers/Concerns

- [Research]: Isometric coordinate system design -- need consistent mapping between visual isometric space and interaction hit-targets
- [Research]: SVG beam rendering performance -- animated SVG paths with real-time physics updates need profiling to confirm 60fps target
- [Research]: Discovery-without-scaffolding balance requires playtesting -- cannot be fully designed upfront

## Session Continuity

Last session: 2026-02-21
Stopped at: Completed 03-03-PLAN.md (cross-region physics & discovery) -- Phase 3 complete
Resume file: None
