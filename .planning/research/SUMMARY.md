# Project Research Summary

**Project:** Odyssey -- Discovery-based Open World for Polarization Optics Education
**Domain:** Educational 3D open-world exploration (web-based, R3F/Three.js)
**Researched:** 2026-02-20
**Confidence:** MEDIUM-HIGH

## Executive Summary

This project is the sixth iteration of PolarCraft's "Theory and Simulation" module, aiming to fuse 23 independent polarization optics demos into a single discovery-based open-world experience inspired by The Witness, Outer Wilds, and Monument Valley. The previous five iterations all failed for the same structural reason: they treated the 23 demos as atomic units and designed containers to arrange them, producing linear demo carousels rather than a unified knowledge experience. Research confirms the design vision is sound -- knowledge-gated "metroidbrainia" progression, environmental puzzle language, and constructivist learning theory are well-validated approaches -- but the implementation must break decisively from the demo-arrangement pattern by designing around composable physics interactions in interconnected environments, not around demo stations.

The recommended approach is to build an "interconnected rooms" experience (not a sprawling open world) with 4-6 distinct environments corresponding to the 6 physics units, connected by smooth camera transitions. The existing stack (React 19 + R3F 9.x + drei 10.x + Zustand 5.x + Framer Motion 12.x) is sufficient with only two new dependencies: `three-custom-shader-material` for polarization-aware material effects and `maath` for smooth interpolation. Three.js should be upgraded from 0.160 to ~0.175 to get shader/performance improvements without the breaking WebGPU changes in 0.178+. The architecture follows a region-based scene partitioning pattern with a reactive physics-visual pipeline that connects the existing unified physics engine to real-time beam rendering via data textures -- a pattern already proven in the v2 and v3 implementations.

The three highest risks are: (1) falling back into the demo carousel trap where the data model organizes around stations rather than physics behaviors, (2) Three.js GPU memory leaks compounding across SPA navigation cycles (the number one production failure for R3F apps), and (3) scope explosion -- "open world" implies vast spaces that are impossible to build and fill at web/R3F scale with a small team. The mitigation for all three is the same discipline: ship a Minimum Viable World (one environment, two interactions, three concepts) within 4 weeks, validate it with students, and expand incrementally. Every phase must produce a playable deliverable. The project has a history of rewriting instead of shipping, and the single most important process decision is to break that cycle.

## Key Findings

### Recommended Stack

The existing stack is mature and nearly complete for this project. No major new framework dependencies are needed. The R3F/drei/postprocessing ecosystem provides all required 3D capabilities, and the existing unified physics engine handles all polarization calculations.

**Core technologies (existing -- keep):**
- **React 19 + TypeScript (strict):** Application framework -- already installed
- **@react-three/fiber 9.x + drei 10.x:** 3D scene rendering, camera controls, instancing, LOD, HTML embedding -- already installed
- **@react-three/postprocessing 3.x:** Bloom and tone mapping for beam visualization -- already installed
- **Zustand 5.x:** State management with `persist` middleware for discovery state -- already installed
- **Framer Motion 12.x:** DOM/2D animations and panel transitions -- already installed
- **Unified Physics Engine:** Mueller/Jones/Stokes/Fresnel calculations in `@/core/physics/unified/` -- already built

**New dependencies (add):**
- **three-custom-shader-material 6.4.0:** Extend PBR materials with polarization visualization shaders without writing full materials from scratch
- **maath 0.10.8:** Math helpers (damping, easing) from the pmndrs ecosystem for smooth 3D value interpolation
- **r3f-perf 7.2.3 (dev only):** Real-time performance monitoring to enforce the 55fps target

**Critical upgrade:**
- **three.js 0.160 -> ~0.175:** The project is 23 minor versions behind. Upgrade to 0.175 (not 0.183) to get shader/performance improvements while avoiding the WebGPU-focused breaking changes in 0.178+. Audit existing shaders for PBR energy conservation changes before upgrading.

**What NOT to install:** Physics engines (rapier/cannon -- optical physics, not rigid body), react-spring (conflicts with framer-motion), GSAP (license concerns, redundant), scroll-hijacking libraries (contradicts open-world design), WebGPU/TSL (R3F v10 still in alpha).

### Expected Features

**Must have (table stakes):**
- T1: Knowledge-gated progression -- progress by understanding, not by clicking buttons
- T2: Environmental puzzle language -- learn through interaction, not text
- T3: Physics-accurate real-time visual feedback -- the foundation everything depends on
- T4: Non-linear exploration -- students choose their own path through 3-5 regions
- T5: Layered information depth -- Intuition > Qualitative > Quantitative, student-controlled
- T6: Spatial coherence -- the world feels like a place, not a menu of demos
- T7: Manipulable optical components -- drag, rotate, place polarizers/waveplates/crystals
- T8: Ambient environmental response -- the world visually changes when students achieve correct configurations
- T9: Smooth scene transitions -- continuous camera flights, no page-load jarring
- T10: Persistence of discovery state -- returning students resume where they left off

**Should have (differentiators):**
- D1: Cross-concept "aha" connections -- same beam reveals different physics in different regions
- D3: Mixed 2D/3D information architecture -- 3D for immersion, 2D for theory and precision
- D4: Diegetic theory -- formulas emerge from phenomena, not prerequisites for them
- D5: Environmental beauty -- every frame worth pausing on (Monument Valley standard)
- D6: Concept constellation map -- visual knowledge graph showing discovered connections
- D10: Seamless demo embedding -- existing 23 demos accessible as "deep dives" from within the world

**Defer (post-MVP):**
- D2: Three-layer depth (Animal Well model) -- Layers 2 and 3 only after Layer 1 is proven
- D7: Ambient soundscape -- high polish, add after visual experience is solid
- D8: Guided exploration mode -- build after playtesting reveals where students get stuck
- D9: Real-world context anchors -- content exists in odysseyData.ts, presentation later
- Multiplayer/social features -- single-player discovery must be validated first

**Anti-features (deliberately avoid):**
- Scoring/grading/XP systems -- extrinsic rewards undermine intrinsic curiosity
- Linear tutorial sequences -- contradicts discovery learning
- Text-heavy explanations as primary teaching -- text is Layer 2+, not Layer 1
- Locked regions / mandatory prerequisites -- all regions accessible from start
- Photorealistic environments -- stylization directs attention to physics, not scenery
- Rebuilding existing demos -- embed them, do not rewrite them

### Architecture Approach

The architecture uses a five-layer stack: Presentation (HTML HUD overlays), Scene (R3F Canvas with region-based scene partitioning), State (three focused Zustand stores: world, exploration, camera), Physics (existing unified engine), and Data (region definitions, element catalog, localStorage persistence). The world is divided into 4-6 regions, each a React component tree that mounts/unmounts based on camera proximity via a RegionManager. The camera is the player (no character model) with WASD+mouse free movement. Light beams are rendered through a reactive physics-visual pipeline: element mutations trigger physics recalculation via the existing LightTracer, results are encoded into data textures, and a custom beam shader renders the polarization state in real-time. Existing 2D demos are embedded via drei `<Html>` without modification.

**Major components:**
1. **RegionManager** -- loads/unloads region scene graphs based on camera distance (2-3 active at once)
2. **WorldBeamSystem** -- reactive beam tracing pipeline connecting worldStore elements to physics calculations to shader uniforms
3. **ExplorationCamera** -- WASD+mouse free movement with smooth damping, zone-aware behavior
4. **InteractionManager** -- raycasting + pointer event routing for drag-to-rotate optical elements
5. **TheoryPortal** -- adapter wrapping existing demo components in `<Html>` for 3D world embedding
6. **ExplorationStore** -- discovery state machine tracking `hidden -> hinted -> discovered -> mastered` per concept
7. **WorldStore** -- source of truth for all optical elements, positions, and properties

### Critical Pitfalls

1. **Demo Carousel Trap** -- Every previous iteration collapsed into "arrange 23 demos in a container." Avoid by designing around composable physics interactions in environments, not around demo stations. The data model must NOT have a `stations[]` array. Start from 5-8 core interactions (place polarizer, rotate element, change material), not from the 23 demo list. **Address in Phase 1.**

2. **Eternal Rewrite Cycle** -- 5 iterations, none shipped. The vision-implementation gap creates perpetual dissatisfaction. Mitigate by shipping the Minimum Viable World in 4 weeks, time-boxing all phases, and deleting dead code from old iterations. Every phase must end with a playable deliverable. **Address in every phase.**

3. **Three.js Memory Leak Cascade** -- GPU resources are not garbage collected. SPA navigation creates compounding leaks. Mitigate with single-Canvas architecture, explicit disposal protocol, `useDisposable` hook, and automated memory monitoring via `renderer.info.memory`. **Address in Phase 1.**

4. **Scope Explosion** -- "Open world" implies vast spaces impossible to build. Reframe as "interconnected rooms" (Metroidvania, not Skyrim). Cap at 6 environments, each buildable in less than 1 week. Start with 1 room, make it excellent. **Address in Phase 1.**

5. **Physics Signal Buried in Visual Noise** -- Bloom, particles, fog, and HUD animations compete with the physics signal students need to see. Apply "physicist's view" principle: beam brightness/color/shape must be the loudest signal. Maximum 2 post-processing effects. Validate with "squint test." **Address in Phase 2, validated in Phase 3.**

6. **drei `<Html>` Performance Collapse** -- More than approximately 10 simultaneous `<Html>` instances cause frame drops from CSS transform recalculation. Limit to 5 concurrent max. Use drei `<Text>` for non-interactive content. Only mount `<Html>` for the active interaction point. **Address in Phase 2.**

7. **Discovery Without Scaffolding** -- Pure discovery fails for educational contexts because students lack the prior knowledge framework. Implement guided discovery with invisible guardrails: contextual hints on struggle, observable invariants (one variable changes at a time), and fallback paths from discovery to explanation. **Address in Phase 2-3.**

## Implications for Roadmap

Based on the combined research, the dependency chain is clear: physics rendering must work before visual language can be established, visual language before manipulation makes sense, manipulation before the world can respond, and world response before knowledge-gating can function. The architecture research confirms a 6-phase build order. The features research provides a 3-phase MVP plan. The pitfalls research demands that Phase 1 solve the foundational architectural decisions (data model, Canvas strategy, scope lock) before any content is built.

### Phase 1: Foundation and Minimum Viable World
**Rationale:** Break the rewrite cycle by producing a playable deliverable fast. Solve the three Phase-1 pitfalls (demo carousel trap, memory leaks, scope explosion) in the data model and Canvas architecture before writing rendering code. The v2/v3 codebase proves that rendering features built on a flawed foundation get discarded.
**Delivers:** One complete environment ("Origin Clearing" or "Crystal Cavern") with: free camera movement, 2-3 placeable/rotatable polarizers, one light source, real-time beam rendering with polarization-encoded shaders, basic Malus's Law discovery through manipulation. Playable in a browser at 55fps.
**Addresses features:** T3 (physics feedback), T7 (manipulable components), T2 (environmental puzzle language), T6 (spatial coherence for one region)
**Avoids pitfalls:** Demo Carousel (data model has no `stations[]`), Memory Leaks (single Canvas, disposal protocol), Scope Explosion (one room only), Eternal Rewrite (4-week timebox, playable deliverable)
**Stack elements:** Existing R3F/drei, three.js upgrade to ~0.175, three-custom-shader-material, maath, r3f-perf (dev)

### Phase 2: Core Interactions and Visual Language
**Rationale:** With the foundation proven in one room, refine the interaction model and establish the visual language for polarization states. This is where the "environmental puzzle" design is validated -- students must be able to discover Malus's Law through manipulation without text instruction. Also the phase to stress-test `<Html>` performance and beam shader clarity.
**Delivers:** Complete interaction system (drag-to-place, scroll-to-rotate, click-to-inspect), visual language for all polarization states (color + shape + animation), basic environmental response (world changes when correct configuration achieved), scaffolding system (contextual hints on struggle). First student playtest.
**Addresses features:** T2 (refined), T7 (refined), T8 (ambient response), D5 (environmental beauty for one region)
**Avoids pitfalls:** Physics Signal vs Noise (beam is the loudest signal, squint test), Html Performance (stress test 5 concurrent panels at 55fps), Discovery Without Scaffolding (hint system designed alongside interactions)
**Uses:** Existing beam.glsl.ts patterns, existing physics engine, camera-controls via drei

### Phase 3: Multi-Region Open World
**Rationale:** Architecture dependency: non-linear exploration requires multiple regions (T4), which requires smooth transitions (T9) and region-based loading. Knowledge-gating (T1) only becomes meaningful with 3+ regions. This is the phase where "interconnected rooms" becomes real.
**Delivers:** 3-5 regions (Origin Clearing, Crystal Cavern, Glass Boundary, plus 1-2 more), camera flights between regions, lazy loading with Suspense, LOD for distant geometry, cross-region beam connections (D1 basic), persistence of discovery state (T10), concept constellation map (D6 basic).
**Addresses features:** T4 (non-linear exploration), T9 (smooth transitions), T1 (knowledge-gating), T10 (persistence), D1 (cross-concept connections basic)
**Avoids pitfalls:** Scope Explosion (cap at 6 regions, each under 1 week build), Demo Carousel (regions defined by physics theme, not demo index)
**Implements:** RegionManager, region-based scene partitioning, ExplorationStore discovery state machine

### Phase 4: Depth Layers and Demo Embedding
**Rationale:** With the spatial world working, add the information depth architecture. Students who want to go deeper can access qualitative explanations and quantitative formalism. This is where the existing 23 demos are leveraged as "deep dives" accessible from within the world, maximizing the return on existing content investment.
**Delivers:** Layered information depth (Intuition > Qualitative > Quantitative) for all built regions, seamless demo embedding via `<Html>` adapters, diegetic theory emergence (formulas crystallize from phenomena), refined concept constellation map.
**Addresses features:** T5 (layered depth), D3 (mixed 2D/3D), D4 (diegetic theory), D10 (demo embedding)
**Avoids pitfalls:** Html Performance (one theory portal at a time), Demo Carousel (demos are depth layers, not the world structure)

### Phase 5: Polish, Guided Exploration, and Remaining Regions
**Rationale:** Complete the remaining environments (Sky Terrace, Living Gallery, Measurement Chamber), add the guided exploration system based on playtest data, and polish visual effects. This is where environmental beauty (D5) gets full attention -- only after the physics communication is validated.
**Delivers:** All 6 regions complete, guided exploration mode with adjustable hint intensity, refined environmental response and ambient effects, real-world context anchors, accessibility features (keyboard navigation, screen reader hints).
**Addresses features:** D8 (guided exploration), D5 (environmental beauty full), D9 (real-world anchors), remaining regions
**Avoids pitfalls:** Physics Signal vs Noise (effects added only after physics communication validated), Scope Explosion (remaining regions built on proven patterns)

### Phase 6: Post-MVP Depth and Community
**Rationale:** Only after the single-player discovery experience is validated with students. Animal Well's Layer 2/3 community features came after the core was proven.
**Delivers:** Three-layer depth architecture (D2), ambient soundscape (D7), community/sharing features, mobile adaptation research.
**Addresses features:** D2 (three-layer depth), D7 (ambient soundscape), A6 deferred features

### Phase Ordering Rationale

- **Physics rendering before visual language:** You cannot establish a visual language for polarization states without accurate physics rendering. T3 is the non-negotiable foundation.
- **One room before many rooms:** The rewrite cycle broke because each iteration built infrastructure for a full experience before validating the core loop. Phase 1 deliberately constrains scope to one room.
- **Interactions before world expansion:** The interaction model (drag, rotate, place) must feel right in one room before being replicated across 6 rooms. Retrofitting interaction patterns is expensive.
- **World before depth layers:** The spatial world is the innovation. Depth layers (theory panels, demo embedding) are adaptation of existing content. Build the new thing first, adapt the old content second.
- **Polish after validation:** Environmental beauty, soundscape, and guided exploration depend on playtest feedback. Building polish before testing is premature optimization of the wrong things.
- **Pitfall avoidance drives Phase 1 scope:** The three critical Phase-1 pitfalls (demo carousel, memory leaks, scope explosion) must be solved in the foundation before any content is built. This is the lesson of five failed iterations.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** three.js 0.160-to-0.175 upgrade audit -- need to test existing shaders against PBR energy conservation changes and deprecated API calls. Run existing game/demo test suite after upgrade.
- **Phase 2:** Environmental puzzle design -- sparse documentation on translating physics education into wordless environmental teaching. The Witness is the only strong reference, and it teaches simple binary puzzles, not continuous physics. Playtest-driven iteration is the only reliable method.
- **Phase 3:** Cross-region beam connections (D1) -- few web-based R3F projects have implemented beams that span multiple lazy-loaded scene regions. The existing physics engine handles multi-surface tracing, but the visual rendering across region boundaries is technically uncertain.
- **Phase 5:** Guided exploration calibration -- hint timing and intensity require student testing data. No amount of upfront research replaces observing real students interact.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Canvas/store setup):** Well-documented R3F patterns. Single Canvas, Zustand stores, camera controls -- all have extensive community examples and official docs.
- **Phase 4 (demo embedding):** drei `<Html>` and `React.lazy` are mature, well-documented patterns. The existing odysseyData.ts already has lazy-loaded component references.
- **Phase 6:** Defer research until post-MVP.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions verified from npm registry. Compatibility matrix confirmed. Only 2 new dependencies needed. three.js upgrade path is well-documented in migration guide. |
| Features | MEDIUM-HIGH | Table stakes well-grounded in game design analysis (The Witness, Outer Wilds, Animal Well) and PhET education research. Feature dependencies clearly mapped. Content mapping to 6 physics units is sound. Medium confidence on calibrating the guided-discovery balance -- this requires playtesting. |
| Architecture | MEDIUM-HIGH | HIGH for R3F patterns (region-based partitioning, reactive beam pipeline, single Canvas). MEDIUM for open-world specifics -- few production web open-worlds exist as references. The v2/v3 beam shader and store patterns provide proven foundations for the physics-visual pipeline. |
| Pitfalls | HIGH | Grounded in 5 failed iterations of this exact project plus verified R3F community knowledge. The demo carousel trap and eternal rewrite cycle are directly observed from project history, not theoretical risks. Memory leak patterns confirmed by R3F official pitfalls documentation. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Environmental puzzle design methodology:** No established framework for translating continuous physics phenomena into wordless environmental puzzles. The Witness's approach (binary line puzzles) does not transfer directly. This gap must be addressed through rapid prototyping and playtesting in Phase 2, not upfront research.
- **Cross-region beam rendering:** Beams that originate in one lazy-loaded region and terminate in another present a rendering challenge not covered by existing R3F documentation. The physics layer handles this (LightTracer is region-agnostic), but the visual layer needs a beam system that renders segments across mounted/unmounted region boundaries. Investigate in Phase 3 planning.
- **Guided discovery calibration:** The balance between "too opaque" (students give up) and "too guided" (students don't discover) cannot be determined from research alone. Plan for 3+ playtest cycles in Phases 2-3 with real physics students.
- **three.js 0.175 compatibility with existing shaders:** The project has custom GLSL shaders (beam.glsl.ts, chamberBeam.glsl.ts) that may be affected by PBR energy conservation changes in the 0.160-0.175 range. Must audit before upgrading. Run the existing visual test suite (if any) or manual visual comparison.
- **Performance on mid-range hardware:** The 55fps target on "2020 MacBook Air (integrated GPU)" is stated as a constraint but not validated for the proposed architecture (2-3 regions loaded, multiple beam segments, 1-2 Html panels). Must be benchmarked in Phase 1 with representative scene complexity.

## Sources

### Primary (HIGH confidence)
- R3F official documentation: scaling performance, pitfalls -- r3f.docs.pmnd.rs
- drei documentation: CameraControls, Html, Detailed, Text -- drei.docs.pmnd.rs
- npm registry: version verification for all packages (three, R3F, drei, postprocessing, CSM, maath, r3f-perf, framer-motion, zustand)
- three.js migration guide: breaking changes 0.160-0.183 -- GitHub wiki
- PhET Interactive Simulations research: implicit scaffolding design principles -- phet.colorado.edu
- Game Accessibility Guidelines -- gameaccessibilityguidelines.com
- Existing PolarCraft codebase: odysseyData.ts, unified physics engine, v2/v3 stores and shaders, demo components
- R3F official pitfalls documentation -- r3f.docs.pmnd.rs/advanced/pitfalls

### Secondary (MEDIUM confidence)
- The Witness environmental puzzle analysis -- design patterns for wordless teaching
- Outer Wilds emotional design -- knowledge as the only progression mechanic
- Animal Well three-layer architecture -- hidden depth as engagement driver
- Monument Valley design philosophy -- environmental beauty as pedagogical tool
- Constructivism and video games -- active knowledge construction through interaction
- Building Efficient Three.js Scenes (Codrops 2025) -- performance optimization techniques
- Kirschner on discovery learning -- limits of pure discovery without scaffolding
- Rewrite trap analysis (Fournier, Giese) -- process discipline for shipping
- Scaffolding in simulations (SpringerOpen 2024) -- embedded scaffolding research

### Tertiary (LOW confidence)
- Discovery mechanics taxonomy (NumberAnalytics) -- needs validation against educational contexts
- R3F vs Three.js 2026 WebGPU readiness claims (GraffersID) -- vendor marketing, not verified

---
*Research completed: 2026-02-20*
*Ready for roadmap: yes*
