# Pitfalls Research

**Domain:** Discovery-based learning open world for polarization optics education (web, R3F/Three.js)
**Researched:** 2026-02-20
**Confidence:** HIGH (grounded in 5 failed iterations of this exact project + verified external research)

---

## Critical Pitfalls

### Pitfall 1: The Demo Carousel Trap -- Rearranging Demos Instead of Fusing Knowledge

**What goes wrong:**
Every previous iteration of this project (v0 through v3) fell into the same structural failure: treating 23 independent demos as atomic units and designing a "container" to arrange them in. v0 put them in a 3D corridor. v1 put them in a three-column lab. The scroll version put them in a scrollable page. v2 put them along a camera spline. v3 put them as 3D optics along a beam. All five failed because they were fundamentally answering "how to arrange 23 demos" rather than "how to fuse polarization concepts into a continuous experience."

**Why it happens:**
The existing codebase has 23 demo components as distinct React components with their own data, controls, and visualizations. The path of least resistance is always to wrap these components in a new layout. The demos become gravitational attractors -- every design inevitably collapses back into "show demo X at location Y." This is a data structure problem masquerading as a design problem: `odysseyData.ts` defines 23 stations as a flat array, and every iteration iterates that array.

**How to avoid:**
Do NOT start from the 23 demos. Start from 5-8 core physical interactions that can be composed. For example:
- "Place a polarizer in a beam path" is one interaction that covers demos 0.1, 0.3, 0.4, 1.0
- "Rotate an optical element and observe intensity change" covers Malus's Law, wave plates, analyzers
- "Change the material a beam passes through" covers birefringence, optical rotation, scattering

The demos should be decomposed into their constituent physics behaviors, not preserved as atomic units. The open world should contain environments where these behaviors naturally emerge, not stations where demos are displayed.

Design the world first (environments, materials, light sources), then map physics behaviors to world elements, then verify that the union of behaviors covers the 6-unit curriculum. The 23 demos become a coverage checklist, not a design input.

**Warning signs:**
- Any data structure that is essentially `stations: Station[]` with sequential indices
- Component names like `StationMapper`, `DemoEmbed`, `StationPanel`
- A progress bar showing "station 7 of 23"
- Design discussions framed as "which demo goes where"

**Phase to address:**
Phase 1 (Architecture/Foundation). This must be solved in the fundamental data model before any rendering code is written. If the data model has `stations[]`, the project will become iteration #6 of the same failure.

---

### Pitfall 2: Discovery Without Scaffolding -- The Witness Works Because Players Signed Up For Puzzles

**What goes wrong:**
Pure discovery-based learning fails for educational contexts because students lack the prior knowledge framework to make intended discoveries. Research consistently shows that novices cannot discover patterns that experts find obvious. The Witness works because (a) players voluntarily chose a puzzle game, (b) all puzzles use the same maze-line mechanic, and (c) failure has zero stakes. Physics education is different: students MUST learn specific concepts (Malus's Law, Fresnel equations, Mueller matrices), misunderstandings have real consequences (exam failure, flawed lab work), and the "puzzle mechanic" (polarization physics) is genuinely complex.

Students in a pure discovery environment will either:
1. Get stuck and give up (The Witness has only 3.3% completion for its hardest content)
2. Discover incorrect patterns ("light disappears because the polarizer is special, not because of cos-squared")
3. Skip content they find frustrating and miss foundational concepts needed later

**Why it happens:**
The Witness is an inspirational reference, but it targets gamers seeking challenge. This project targets physics students seeking understanding. Conflating the two audiences leads to an experience that is too opaque for students (who need to learn specific things) and too constrained for gamers (who want creative freedom).

**How to avoid:**
Implement **guided discovery** rather than pure discovery. The key design pattern is the "invisible guardrail":

1. **Progression gates based on demonstrated understanding**, not puzzle solving. Before a student can access birefringence environments, they must have successfully manipulated polarizers (proving they understand the prerequisite).
2. **Three-layer information architecture** (already in the project's design): Intuition -> Qualitative -> Quantitative. Default to intuition layer. Make deeper layers accessible but not required.
3. **Contextual hints that activate on struggle**, not on request. If a student rotates a polarizer randomly for 30 seconds without finding the extinction angle, the environment subtly highlights the angle readout or dims non-relevant controls.
4. **Observable invariants**: When a student changes one variable, ensure the cause-effect relationship is visually unambiguous. If rotating a polarizer changes intensity, ONLY intensity should change -- no simultaneous color shifts, particle effects, or camera movements that muddy the signal.

**Warning signs:**
- No analytics or telemetry for where students get stuck
- Students spending >3 minutes on a single interaction without any state change
- Design discussions that say "the student will discover..." without specifying what happens if they don't
- No fallback path from discovery to explanation

**Phase to address:**
Phase 2 (Core Interactions) and Phase 3 (Content Mapping). The hint/scaffolding system must be designed alongside the interactions, not bolted on afterward.

---

### Pitfall 3: R3F/Three.js Memory Leak Cascade in SPA Navigation

**What goes wrong:**
Three.js resources (geometries, materials, textures, shaders, render targets) are GPU-allocated and NOT garbage collected by JavaScript. In a React SPA, navigating away from the Odyssey page and back creates new WebGL contexts and objects without properly disposing the old ones. After 3-5 navigation cycles, GPU memory exhausts, causing frame drops, shader compilation failures, and eventually browser tab crashes. This is the #1 production failure mode for R3F applications beyond "hello world."

**Why it happens:**
React's component lifecycle (mount/unmount) does not map to Three.js's resource lifecycle (create/dispose). React unmounts the component tree, removing JS references, but the GPU buffers persist until explicitly `.dispose()`d. R3F handles basic cleanup for objects it creates, but custom shaders, render targets, post-processing effects, and anything created in `useMemo` or `useRef` requires manual disposal.

The project already has multiple R3F canvases (3D game, optical studio, Poincare sphere viewer, demos with 3D content) and will add the Odyssey open world. Navigation between these creates compounding resource leaks.

**How to avoid:**
1. **Single Canvas architecture**: Use ONE persistent `<Canvas>` for the entire application, with scene content swapped via React component trees. This avoids WebGL context creation/destruction entirely. drei's `<View>` component enables this pattern.
2. **Explicit disposal protocol**: Every custom material, geometry, and render target must have a cleanup function called in `useEffect` return. Create a `useDisposable` hook that wraps this pattern.
3. **Resource pooling**: Share geometries and materials across components via a global resource cache (`useLoader` for textures, shared material refs for common materials).
4. **Memory monitoring**: Integrate `r3f-perf` in development builds. Add a custom memory watcher that logs `renderer.info.memory` on each navigation event. Set hard thresholds: >50 geometries or >30 textures in memory after page unmount = failing test.
5. **Texture budget**: Cap total texture memory at 64MB. Use compressed textures (KTX2/Basis) for anything larger than 256x256.

**Warning signs:**
- `renderer.info.memory.geometries` increasing across navigation events
- Chrome DevTools "Performance" tab showing increasing JS heap size over time
- Frame rate degrading after navigating away and back to the 3D page
- WebGL warnings: "too many active WebGL contexts"

**Phase to address:**
Phase 1 (Foundation). The Canvas architecture decision and disposal infrastructure must be in place before any 3D content is built. Retrofitting disposal into an existing scene graph is extremely painful.

---

### Pitfall 4: The "Eternal Rewrite" -- Iteration 6 of a Never-Shipped Feature

**What goes wrong:**
This project has had 5 iterations of the same module, each more ambitious than the last, none shipped to students. Each rewrite feels productive initially because the codebase is small and fresh, but complexity catches up. The team then becomes dissatisfied with the current approach, identifies fundamental flaws, and starts a new rewrite. The existing codebase accumulates 5 abandoned implementations (`odyssey/`, `odyssey-lab/`, `odyssey-scroll/`, `odyssey-v2/`, `odyssey-v3/`) that create confusion, dead code, and psychological weight.

The danger for iteration 6 is repeating this cycle with a more ambitious scope (open world) that takes even longer, leading to abandonment at the "80% done, 80% remaining" stage.

**Why it happens:**
Three compounding factors:
1. **Vision-implementation gap**: The vision (The Witness-like open world) is so compelling that any concrete implementation feels inadequate by comparison. This creates perpetual dissatisfaction.
2. **No external accountability**: Without students actually using the product, there is no feedback loop to validate whether the current approach works. Internal aesthetic judgment substitutes for user testing.
3. **Sunk cost blindness**: The existing 5 implementations represent significant work, but each rewrite discards it. Each rewrite feels justified ("this time we'll get it right"), but the pattern reveals that the problem isn't the implementation -- it's the lack of a shipping discipline.

**How to avoid:**
1. **Ship v1-lab (odyssey-lab) NOW as the baseline.** It is functionally complete, covers all 23 stations, and works. It may be "boring," but it exists and students can use it. Every future iteration is measured against this shipped baseline, not against an imaginary ideal.
2. **Define a Minimum Viable World** (MVW) for the open world: ONE environment (e.g., a room with polarizers), TWO interactions (place polarizer, rotate polarizer), covering THREE physics concepts (linear polarization, Malus's Law, extinction). Ship this in 4 weeks. If it doesn't feel better than v1-lab for those 3 concepts, the open world approach may not be the right answer.
3. **Time-box ruthlessly**: Any phase that takes more than 2x its estimate gets a "ship or kill" review. No phase exceeds 4 weeks without a playable deliverable.
4. **Delete dead code**: Remove `odyssey/`, `odyssey-scroll/`, `odyssey-v2/`, `odyssey-v3/` from the codebase. Their existence creates the illusion that "the old approaches are still available as fallback," which reduces commitment to the new approach.

**Warning signs:**
- "We should probably rethink the architecture" discussions before the first playable exists
- More than 2 weeks of "infrastructure work" without any visible interaction
- Comparing the current build unfavorably to The Witness (a game that took 8 years and $6M)
- A `src/components/odyssey-v4/` directory appearing in the project

**Phase to address:**
Every phase. This is a process discipline, not a technical decision. Every phase must end with a playable increment that students could theoretically use.

---

### Pitfall 5: Scope Explosion -- The Witness Took 7 Years With a Full Team

**What goes wrong:**
"Open world" implies vast, interconnected spaces with emergent gameplay. The Witness had ~650 puzzles, a custom engine, a team of architects and artists, and took from 2008 to 2016. Attempting to build an open world in a web browser with a React stack, covering 6 units of university-level physics, as a single developer or small team, will result in either a tiny world that doesn't feel "open" or a sprawling world that is mostly empty and unfinished.

Specifically for this project, the 23 demo coverage requirement means the world must contain enough environmental diversity to naturally present: electromagnetic wave basics, polarizer behavior, birefringence, wave plates, Fresnel equations, Brewster's angle, chromatic polarization, optical rotation, Rayleigh/Mie scattering, Stokes vectors, Mueller matrices, and polarimetric measurement. Each of these requires distinct visual representations and interaction mechanics. This is not "one puzzle mechanic in different environments" (The Witness) -- it is "many different physics phenomena in different environments."

**Why it happens:**
The term "open world" creates implicit expectations about scale and freedom. Monument Valley and The Witness are referenced as inspirations, but both had multi-year development cycles. The project conflates "non-linear exploration" (achievable) with "large open world" (not achievable in web/R3F within a reasonable timeline).

**How to avoid:**
1. **Reframe from "open world" to "interconnected rooms."** Think Metroidvania, not Skyrim. 4-6 distinct environments (Crystal Lab, Glass Canyon, Fog Chamber, Observatory, etc.) connected by portals/corridors. Each environment is small (one screen / one camera orbit) but dense with interactions. Students can visit in any order.
2. **Start with 1 room, make it excellent.** The first deliverable is a single environment containing polarizer interactions. Test with 3 students. Iterate. Then add room 2.
3. **Content budget**: Cap at 6 environments (one per unit). Each environment has 3-4 interactive elements. Total interactive elements: ~20, covering the 23 demo curriculum through compositional physics rather than 1:1 mapping.
4. **Reuse environments**: The same room can teach different concepts at different "times of day" or with different materials loaded. A beam passing through a glass surface teaches Fresnel at normal incidence AND Brewster's angle at the magic angle -- two demos, one environment.

**Warning signs:**
- World map designs showing >6 distinct areas
- "We need a terrain system" or "procedural generation" discussions
- Individual rooms taking >1 week to build
- Physics concepts being deferred because "we haven't built that area yet"

**Phase to address:**
Phase 1 (Architecture/Scoping). The environment count and content budget must be locked before any 3D modeling begins. Scope is the single most important decision for this project.

---

### Pitfall 6: drei `<Html>` Performance Collapse in Information-Dense Scenes

**What goes wrong:**
The v2 design relies heavily on drei's `<Html>` component for holographic HUDs, formula displays, theory panels, and interactive controls overlaid on the 3D scene. Each `<Html>` instance creates a separate DOM portal with its own CSS transform pipeline, synchronized to the 3D camera every frame. With 23 stations each having 2-3 HUD elements, that is 50-70 `<Html>` instances. This causes:
- CSS transform recalculation for every portal on every frame (even if off-screen)
- DOM reflow cascades when HUD content changes
- Z-ordering conflicts between overlapping `<Html>` portals
- Mobile Safari specifically struggles with `backdrop-filter: blur()` on transformed elements

Benchmarks show performance degradation starting at ~10 simultaneous `<Html>` instances, with severe frame drops at 20+.

**Why it happens:**
`<Html>` is the easiest way to put DOM content in a 3D scene, and the design calls for rich text, formulas (KaTeX), and interactive controls that are impractical to render in WebGL. The temptation is to use `<Html>` for everything, but it doesn't scale.

**How to avoid:**
1. **Strict culling**: Only mount `<Html>` components for the current station +/- 1. All others must be fully unmounted (not just hidden). Use the camera Z position to determine which stations are "active."
2. **WebGL text rendering for non-interactive content**: Use drei's `<Text>` (SDF text) or `troika-three-text` for station labels, simple formulas, and readings. Reserve `<Html>` exclusively for interactive controls (sliders, buttons) and complex formatted content (multi-line theory with LaTeX).
3. **Limit concurrent `<Html>` to 5 maximum**: Design the UI so that only the active station's interactive panel is mounted as `<Html>`. Everything else is either WebGL text or not rendered.
4. **Avoid `backdrop-filter`** on `<Html>` elements in the 3D scene. The glassmorphism aesthetic from the v2 design must use solid semi-transparent backgrounds instead, or be implemented as a WebGL post-processing effect.

**Warning signs:**
- Frame rate drops when scrolling past stations with visible HUDs
- CSS "Layout" or "Recalculate Style" appearing as >5ms blocks in Chrome Performance timeline
- `<Html>` components rendering when off-screen (check with React DevTools)

**Phase to address:**
Phase 2 (Core Interactions). The HUD strategy must be validated with a performance test: render the maximum number of concurrent HUDs and verify 55fps on a mid-range laptop before building content for all stations.

---

### Pitfall 7: Physics Signal Buried in Visual Noise

**What goes wrong:**
The v2 design specifies: bloom effects, chromatic aberration, vignette, particle systems, holographic HUD animations, environment fog transitions, "death" effects when light extinguishes, "rebirth" effects with gold pulses, volumetric scattering, spiral E-field arrows, neon arc angle readouts, and ambient environmental particles. When a student rotates a polarizer, they need to see ONE thing clearly: the intensity change following cos-squared theta. If that signal is competing with bloom glow, particle bursts, and HUD animations, the physics becomes invisible.

This is the educational equivalent of chartjunk -- decorative elements that obscure the data. Discovery-based learning requires that cause-and-effect relationships are visually unambiguous. If students cannot isolate "I rotated this, and THAT changed," they cannot discover the underlying law.

**Why it happens:**
The aesthetic vision (Monument Valley, The Witness) values atmosphere and visual polish. These games can afford visual richness because their "signal" (maze solution) is binary and obvious. Physics education has continuous, quantitative signals (intensity varies as cos-squared, not on/off) that require visual clarity. The desire to create a "stunning experience" conflicts with the need for clean visual communication of physics.

**How to avoid:**
1. **"Physicist's view" design principle**: For every visual effect, ask: "Does this help the student see the physics, or does it distract from the physics?" If the answer is "atmosphere," defer it to a polish phase after the physics communication is validated.
2. **Signal-to-noise hierarchy**: The light beam itself is the primary visual channel. Its brightness, color, and shape must be the loudest signal in the scene. Everything else (particles, fog, glow) must be at least 50% dimmer than the beam.
3. **Effect budget**: Maximum 2 post-processing effects (bloom at low intensity for the beam, tone mapping). No chromatic aberration (it degrades text readability). No vignette (it reduces the visible area for physics).
4. **Validate with "squint test"**: If you squint at the screen, can you still see the beam and understand its state? If particles and fog dominate the squinted view, reduce them.

**Warning signs:**
- Students reporting that the experience is "beautiful but confusing"
- Playtesting reveals students cannot describe what changed when they manipulated a control
- More shader code for effects than for physics visualization
- A/B test showing v1-lab (plain SVG) produces better learning outcomes than the open world

**Phase to address:**
Phase 2 (Core Interactions) and Phase 4 (Polish). Build physics visualization FIRST with minimal effects. Add atmosphere ONLY after validating that the physics communication works in user testing.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Mounting all 23 stations' 3D elements at once | Simpler code, no culling logic | GPU memory exhaustion, frame drops on scroll | Never. Frustum culling is mandatory from day 1. |
| Using `setState` in `useFrame` for beam physics | Reactive updates propagate to UI easily | 60 setState calls/sec causes React re-render storms | Never. Mutate Three.js objects directly in useFrame, sync to Zustand only on interaction end. |
| Keeping v0-v3 code "for reference" | Psychological safety, can "go back" | 10K+ lines of dead code, confusion about which imports are live, import cycles | MVP only. Delete dead iterations before Phase 2. |
| Hardcoding station positions along Z-axis | Simple linear layout, easy camera math | Cannot support non-linear world topology (rooms, branches, portals) | Phase 1 prototype only. Must be replaced with a graph-based spatial model. |
| Using `<Html>` for all text and UI | Fast prototyping, familiar React patterns | Performance collapse at scale (see Pitfall 6) | Phase 1 prototype only. Must audit and replace before Phase 3. |
| Custom shader per visual effect | Maximum visual control | Shader compilation time grows, WebGL program switching overhead | Phase 4 polish only. Merge shaders where possible. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Post-processing effect stacking | Frame rate drops 10-20fps per added effect | Limit to 2 effects maximum (bloom + tone mapping). Use `PerformanceMonitor` to auto-disable on low-end devices. | >3 effects active simultaneously |
| Particle system without instancing | Frame rate scales linearly with particle count | Use `InstancedBufferGeometry` or `THREE.Points` with shader materials. Never use individual `<mesh>` per particle. | >200 particles as individual meshes |
| Beam shader recalculation on every frame | GPU-bound rendering, heat/battery drain | Only recalculate beam shader uniforms when optic state actually changes. Use dirty flags. | Continuous shader parameter updates without user interaction |
| Texture creation in useFrame/render loop | GC pauses every few seconds, stuttering | Pre-allocate all textures at load time. Pool data textures and update via `needsUpdate`. | Any `new THREE.Texture()` or `new Float32Array()` in a per-frame callback |
| `drei <Detailed />` LOD without distance tuning | Constant geometry swapping causes pop-in | Tune LOD distances to match camera movement speed. Use hysteresis (different switch-in vs switch-out distances). | Camera moving faster than LOD transition distance |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No indication of interactable objects | Students stare at a beautiful scene and don't know they can touch anything | Subtle hover glow on interactable elements. First-time pulse animation. Environmental "affordance lighting" pointing at the next interaction. |
| Theory text in 3D space following camera transforms | Text becomes unreadable at oblique angles, motion sickness from moving text | Pin theory panels to screen-space (fixed DOM overlay), not world-space. Only station labels should be in 3D. |
| Scroll hijacking for camera movement | Students accidentally zoom past content, cannot scroll the page normally, mobile pinch-zoom conflicts | Provide explicit "enter/exit" for the 3D experience. Inside: scroll controls camera. Outside: scroll is normal page scroll. Clear visual boundary. |
| Non-linear access without orientation | Students feel lost, don't know what they've seen vs. what remains | Persistent mini-map or progress indicator showing explored vs. unexplored areas. "You've discovered 4/6 environments" counter. |
| Formula rendering lag in KaTeX | Visible layout shift when formulas appear, breaking the "discovery moment" | Pre-render all formulas at load time. Cache rendered formula images/SVGs. Use `<Text>` for simple expressions (theta = 45 degrees). |

## "Looks Done But Isn't" Checklist

- [ ] **3D Scene**: Often missing proper `dispose()` calls for custom materials/geometries -- verify with `renderer.info.memory` after unmount
- [ ] **Beam Physics**: Often missing edge cases (zero intensity propagation, degenerate Jones vectors, undefined Stokes for unpolarized light) -- verify with unit tests for all 23 station configurations
- [ ] **Discovery Interactions**: Often missing the "student gives up" path -- verify that every interaction has a hint system that activates after N seconds of no progress
- [ ] **Scroll Camera**: Often missing momentum/inertia feel -- verify by recording scroll input vs. camera position and checking for smooth damping curve
- [ ] **Mobile**: Often missing touch gesture handling for 3D rotation -- verify that pinch-zoom does not conflict with browser zoom, that two-finger rotate works for optical elements
- [ ] **Accessibility**: Often missing keyboard navigation for 3D interactions -- verify that every interactive optical element can be selected with Tab and rotated with Arrow keys
- [ ] **i18n**: Often missing dynamic content strings (physics values, generated descriptions) -- verify that ALL user-visible text including computed strings goes through i18next
- [ ] **Loading**: Often missing loading state for heavy 3D scenes -- verify that a meaningful loading indicator appears within 100ms of navigation, and content loads progressively

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Demo Carousel Trap (Pitfall 1) | HIGH | Requires data model redesign. Extract physics behaviors from demos into composable interaction primitives. Redesign world structure around environments, not stations. 2-3 week refactor. |
| Discovery Without Scaffolding (Pitfall 2) | MEDIUM | Add hint system and analytics layer. Can be retrofit without changing core interactions. 1 week to add basic scaffolding, ongoing tuning based on analytics. |
| Memory Leak Cascade (Pitfall 3) | HIGH | Requires audit of every component for disposal. May need Canvas architecture change. If single-Canvas wasn't chosen initially, migration is 1-2 weeks of risky refactoring. |
| Eternal Rewrite (Pitfall 4) | LOW (process change) | Ship what exists. Set time boxes. Delete dead code. This is a decision, not a technical task. |
| Scope Explosion (Pitfall 5) | MEDIUM | Cut environments from N to 6. Merge physics concepts into shared environments. Re-scope takes 1-2 days, but may require discarding partially-built environments. |
| Html Performance (Pitfall 6) | MEDIUM | Replace non-interactive `<Html>` with `<Text>`. Implement strict culling. 1 week refactor if caught early, 2+ weeks if content is already built for 23 stations. |
| Physics Signal vs Visual Noise (Pitfall 7) | LOW | Reduce effect intensities. Remove non-essential post-processing. Can be done in a single focused session, but requires designer buy-in to sacrifice atmosphere. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Demo Carousel Trap | Phase 1: Architecture | Data model review: no `stations[]` array. World defined by environments and physics behaviors, not by demo indices. |
| Discovery Without Scaffolding | Phase 2: Core Interactions | Playtest with 3 students: >80% successfully discover Malus's Law within 5 minutes without any text instruction. Those who struggle receive auto-hints. |
| Memory Leak Cascade | Phase 1: Foundation | Navigate to Odyssey page, interact for 2 min, navigate away, navigate back. Repeat 5x. `renderer.info.memory` values must not grow. Automated CI test. |
| Eternal Rewrite | Every Phase | Each phase ends with a deployable build that students could access. Phase retrospective includes "would we ship this?" question. |
| Scope Explosion | Phase 1: Scoping | Environment count locked at 6 maximum. Each environment spec must fit on 1 page. No environment takes >1 week to build to playable state. |
| Html Performance | Phase 2: Core Interactions | Stress test: render 5 concurrent `<Html>` panels with KaTeX formulas + interactive sliders. Must sustain 55fps on 2020 MacBook Air (integrated GPU). |
| Physics Signal vs Visual Noise | Phase 3: Content, Phase 4: Polish | "Squint test" on every environment. User testing: students must correctly identify the physics variable that changed in >90% of interactions. |

## Sources

- [R3F Official Pitfalls Documentation](https://r3f.docs.pmnd.rs/advanced/pitfalls) -- HIGH confidence
- [R3F Scaling Performance Guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance) -- HIGH confidence
- [drei Html Performance Discussion #3130](https://github.com/pmndrs/react-three-fiber/discussions/3130) -- HIGH confidence (official repo)
- [Why Gamification Fails in Education (Springer)](https://link.springer.com/chapter/10.1007/978-3-319-51645-5_22) -- MEDIUM confidence
- [Why Gamification Fails: New Findings for 2026 (Medium)](https://medium.com/design-bootcamp/why-gamification-fails-new-findings-for-2026-fff0d186722f) -- MEDIUM confidence
- [The Seductive Appeal of Discovery Learning (Kirschner)](https://www.kirschnered.nl/2025/03/30/the-seductive-myth-of-discovery-learning/) -- MEDIUM confidence
- [Discovery Learning (Wikipedia)](https://en.wikipedia.org/wiki/Discovery_learning) -- MEDIUM confidence (verified across multiple sources)
- [The Witness Game Design Philosophy (Medium)](https://medium.com/@zackmullinbernstein/the-witness-game-design-and-philosophy-53202e591c0d) -- MEDIUM confidence
- [Avoiding the Rewrite Trap (Camille Fournier)](https://skamille.medium.com/avoiding-the-rewrite-trap-b1283b8dd39e) -- MEDIUM confidence
- [The Rewrite Trap (Phil Giese)](https://www.philgiese.com/post/the-rewrite-trap) -- MEDIUM confidence
- [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/) -- HIGH confidence (industry standard)
- [Inclusive Learning Design Handbook - Web Games](https://handbook.floeproject.org/approaches/web-games-and-simulations/) -- MEDIUM confidence
- [Building Efficient Three.js Scenes (Codrops)](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/) -- MEDIUM confidence
- Project iteration history: `odyssey/`, `odyssey-lab/`, `odyssey-scroll/`, `odyssey-v2/`, `odyssey-v3/` -- HIGH confidence (direct codebase analysis)
- `docs/claude/odyssey-v2-design.md`, `docs/claude/odyssey-iteration-prompt.md` -- HIGH confidence (project documentation)

---
*Pitfalls research for: Discovery-based learning open world for polarization optics education*
*Researched: 2026-02-20*
