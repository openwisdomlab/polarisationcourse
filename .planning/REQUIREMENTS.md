# Requirements: Odyssey -- Polarization Optics Isometric World

**Defined:** 2026-02-20
**Core Value:** Students voluntarily immerse in exploration for 2+ hours -- curiosity-driven discovery learning

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### World Foundation

- [x] **WRLD-01**: World uses click/tap point-and-click navigation in an isometric perspective -- student clicks to move between areas, not WASD free camera or scroll-driven linear path
- [ ] **WRLD-02**: World consists of 4-6 interconnected optical environment regions, each with unique visual style and physics theme
- [ ] **WRLD-03**: Regions connected through animated transitions (parallax shifts, perspective slides, fade-throughs), no page-load interruptions
- [x] **WRLD-04**: World has spatial coherence -- all regions feel like they belong to the same isometric world, not an independent demo gallery
- [ ] **WRLD-05**: Regions lazy-load SVG/scene assets by proximity, maintaining smooth transitions between adjacent regions
- [ ] **WRLD-06**: All regions freely accessible from the start, no mandatory prerequisites

### Light & Physics

- [x] **PHYS-01**: Light beam renders polarization state changes in real-time (color/brightness/shape encodes polarization angle/ellipticity/intensity) using SVG/Canvas beam rendering
- [x] **PHYS-02**: Beam responds visually within <16ms after optical element manipulation, physically accurate (Mueller/Jones calculation)
- [ ] **PHYS-03**: Unified polarization visual language -- all regions use consistent color/shape/animation encoding for polarization states
- [ ] **PHYS-04**: Light beam can propagate across regions -- same beam exhibits different polarization phenomena in different environments
- [x] **PHYS-05**: Maintains 60fps desktop, 30fps+ mobile performance budget (2D rendering is inherently lighter than 3D)

### Interaction

- [ ] **INTR-01**: Student can place optical elements on light path (polarizers, waveplates, crystals, etc.) via drag-and-drop in the isometric scene
- [ ] **INTR-02**: Student can rotate/adjust placed optical elements, observing real-time beam behavior changes
- [ ] **INTR-03**: Student can change environment/material properties (medium type, refractive index, etc.), observing different light behaviors
- [ ] **INTR-04**: Interaction uses click-to-move for navigation and drag for element placement -- no text instructions needed, gestures feel natural in the isometric context
- [ ] **INTR-05**: Optical element interactability communicated through visual cues (glowing edges, hover hints, subtle animation), not UI buttons

### Discovery & Learning

- [ ] **DISC-01**: Core polarization concepts discovered through environmental interaction, not through text explanation
- [ ] **DISC-02**: Knowledge-gated progression -- student advances through understanding, gating is invisible (not locked doors)
- [ ] **DISC-03**: Layered information architecture -- intuition (see phenomenon) -> qualitative (understand why) -> quantitative (mathematical description), student chooses depth
- [ ] **DISC-04**: Correct configurations trigger visible environmental changes -- beam changes, color shifts, patterns appear, regions illuminate
- [ ] **DISC-05**: Cross-concept "aha" connections -- discovery in one region reveals related phenomenon in another region
- [ ] **DISC-06**: Discovery state persists across sessions -- returning students continue from their last understanding

### Visual & Aesthetic

- [ ] **VISL-01**: Each region has unique visual atmosphere (color palette, illustration style, particle effects, geometric motifs), reaching "every frame worth pausing on" quality -- Monument Valley level of visual craft
- [x] **VISL-02**: Isometric illustration art direction -- 2D scenes with perspective/depth illusion (CSS 3D transforms, parallax layers, SVG depth ordering), geometric precision directs attention to physics phenomena
- [ ] **VISL-03**: Light beam is the visually most prominent element -- environmental illustrations never overpower physics signals
- [x] **VISL-04**: 2D-primary rendering with selective 3D accents -- SVG scenes and CSS transforms for the world, optional Canvas/WebGL only for beam glow effects or key visual moments
- [ ] **VISL-05**: Depth layers within the 2D world -- zooming into a phenomenon smoothly reveals deeper information layers (qualitative explanation, then mathematical formalism) without breaking the visual context

### Content Integration

- [ ] **CONT-01**: Covers core polarization concepts across all 6 units (fundamentals/modulation/interfaces/transparent media/scattering media/polarization measurement)
- [ ] **CONT-02**: Existing 23 demo components accessible as "deep exploration" entry points from within the world, seamlessly embedded
- [ ] **CONT-03**: Theory formulas emerge from phenomena -- experience first then formalize, formulas celebrate understanding rather than serve as prerequisites
- [ ] **CONT-04**: Concept constellation map -- visual knowledge graph showing discovered concepts and their connections
- [ ] **CONT-05**: Multi-language support (Chinese/English), reusing existing i18n infrastructure

### Technical Foundation

- [x] **TECH-01**: SVG/CSS-primary scene architecture -- scenes built with SVG illustrations, CSS 3D transforms for depth, Framer Motion for animations; Canvas/WebGL used sparingly for beam effects only
- [x] **TECH-02**: Isometric geometry system -- consistent coordinate mapping between isometric visual space and interaction hit-targets, reusable across all regions
- [x] **TECH-03**: Data model designed around "composable physics behaviors in environments", not "stations array"
- [x] **TECH-04**: Coexists with other PolarCraft modules (games, studio, calculator), accessed via /odyssey/ route
- [x] **TECH-05**: Desktop-first (mouse + keyboard), but 2D-primary approach makes mobile adaptation significantly easier for v2

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Depth & Polish

- **DPTH-01**: Three-layer depth architecture (Animal Well model) -- Layer 2 hidden connections + Layer 3 research-level challenges
- **DPTH-02**: Ambient soundscape responsive to optical state (atmosphere, not game-like sound effects)
- **DPTH-03**: Guided exploration mode -- adjustable hint intensity (off/subtle/medium/explicit), designed from playtest data
- **DPTH-04**: Real-world context anchors -- each phenomenon connects to real applications (LCD, stress analysis, sky polarization, etc.)
- **DPTH-05**: Mobile adaptation (now much more feasible with 2D-primary architecture)

### Community

- **CMTY-01**: Discovery state sharing/comparison
- **CMTY-02**: Community challenges / research-level puzzles

## Out of Scope

| Feature | Reason |
|---------|--------|
| Scoring/grades/XP system | Extrinsic rewards undermine intrinsic curiosity, violates discovery learning philosophy |
| Linear tutorial sequence | Violates open exploration core design, the fundamental error of 5 previous iterations |
| Text-dominant teaching | Text is Layer 2+ depth choice, not Layer 1 primary teaching method |
| Mandatory prerequisites / locked regions | Violates non-linear exploration, some students have prior knowledge |
| R3F/Three.js as primary rendering layer | 2D isometric approach chosen for visual polish, performance, and iterability; 3D used sparingly if at all |
| WASD + mouse free camera 3D navigation | Replaced by click/tap point-and-click in isometric world; more intuitive, lower barrier |
| 3D postprocessing pipeline | Unnecessary with 2D-primary approach; visual quality comes from illustration craft |
| Rewriting existing 23 demos | Existing components are functionally complete, embed and reuse rather than rebuild |
| Physics engine (rapier/cannon) | Project's "physics" is optical calculation, not rigid body collision |
| Scroll-driven camera | 5 iterations proved linear scrolling cannot achieve open exploration |
| Multiplayer/social features (v1) | Validate single-player experience first |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| WRLD-01 | Phase 1 | Complete |
| WRLD-02 | Phase 3 | Pending |
| WRLD-03 | Phase 3 | Pending |
| WRLD-04 | Phase 1 | Complete |
| WRLD-05 | Phase 3 | Pending |
| WRLD-06 | Phase 3 | Pending |
| PHYS-01 | Phase 1 | Complete |
| PHYS-02 | Phase 1 | Complete |
| PHYS-03 | Phase 2 | Pending |
| PHYS-04 | Phase 3 | Pending |
| PHYS-05 | Phase 1 | Complete |
| INTR-01 | Phase 2 | In Progress |
| INTR-02 | Phase 2 | In Progress |
| INTR-03 | Phase 2 | Pending |
| INTR-04 | Phase 2 | In Progress |
| INTR-05 | Phase 2 | Pending |
| DISC-01 | Phase 2 | Pending |
| DISC-02 | Phase 3 | Pending |
| DISC-03 | Phase 4 | Pending |
| DISC-04 | Phase 2 | Pending |
| DISC-05 | Phase 3 | Pending |
| DISC-06 | Phase 3 | Pending |
| VISL-01 | Phase 5 | Pending |
| VISL-02 | Phase 1 | Complete |
| VISL-03 | Phase 2 | Pending |
| VISL-04 | Phase 1 | Complete |
| VISL-05 | Phase 4 | Pending |
| CONT-01 | Phase 5 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-03 | Phase 4 | Pending |
| CONT-04 | Phase 4 | Pending |
| CONT-05 | Phase 5 | Pending |
| TECH-01 | Phase 1 | Complete |
| TECH-02 | Phase 1 | Complete |
| TECH-03 | Phase 1 | Complete |
| TECH-04 | Phase 1 | Complete |
| TECH-05 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 37
- Unmapped: 0

---
*Requirements defined: 2026-02-20*
*Last updated: 2026-02-20 after roadmap revision (2D-primary pivot)*
