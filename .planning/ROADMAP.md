# Roadmap: Odyssey -- Polarization Optics Isometric World

## Overview

Transform 23 independent polarization optics demos into a discovery-based isometric world where students explore interconnected optical environments rendered as beautifully crafted 2D illustrations with depth illusion. Students click to navigate between areas, place and manipulate optical elements, and discover physics through observation rather than instruction. The build follows a strict dependency chain: one isometric scene with working beam physics before visual language, one room before many rooms, interactions before world expansion, world before depth layers, polish after validation. The 2D-primary approach (SVG/CSS/Framer Motion) maximizes visual refinement and iterability while minimizing computational overhead -- Canvas/WebGL used sparingly for beam glow effects only. Every phase produces a playable deliverable to break the 5-iteration rewrite cycle.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Minimum Viable Scene** - Single isometric environment with click navigation, SVG light source, beam rendering with polarization encoding, and physics-accurate visualization at 60fps (completed 2026-02-20)
- [ ] **Phase 2: Interaction & Visual Language** - Place/rotate/adjust optical elements with consistent polarization visual encoding and environmental feedback on correct configurations
- [ ] **Phase 3: Multi-Region Isometric World** - 4-6 interconnected isometric environments with smooth animated transitions, cross-region beams, knowledge-gated progression, and session persistence
- [ ] **Phase 4: Depth Layers & Content Integration** - Layered information architecture (intuition to quantitative), embedded demo deep-dives, concept constellation map, and diegetic theory emergence
- [ ] **Phase 5: Visual Polish & Full Coverage** - All 6 physics units covered, per-region visual atmosphere at Monument Valley quality, multi-language support, and production-quality illustration

## Phase Details

### Phase 1: Foundation & Minimum Viable Scene
**Goal**: A student can open /odyssey/ in a browser and explore one beautifully illustrated isometric optical environment by clicking to move, with a light beam that visually encodes its polarization state, running at 60fps on desktop
**Depends on**: Nothing (first phase)
**Requirements**: WRLD-01, WRLD-04, PHYS-01, PHYS-02, PHYS-05, VISL-02, VISL-04, TECH-01, TECH-02, TECH-03, TECH-04, TECH-05
**Success Criteria** (what must be TRUE):
  1. Student clicks on locations within an isometric scene to move a character or viewpoint -- navigation feels like Monument Valley's tap-to-move, not a 3D free camera or scroll-driven rail
  2. A light beam renders in the scene with its polarization state encoded through color, brightness, and shape -- visually distinguishable from unpolarized light, rendered via SVG/Canvas 2D techniques
  3. The environment looks like a coherent illustrated place with isometric perspective and depth illusion (parallax layers, CSS transforms, SVG depth ordering) -- not a demo viewport or flat UI panel
  4. The page loads at /odyssey/ within PolarCraft without breaking other modules (games, studio, calculator), and no memory leaks occur on repeated SPA navigation
  5. Frame rate holds at 60fps on a 2020-era desktop -- the 2D scene architecture should be significantly lighter than the previous 3D approach
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Foundation: isometric coordinate utilities, Zustand scene store, route wiring
- [x] 01-02-PLAN.md — Isometric scene rendering with SVG layers, click-to-move navigation, HUD overlay
- [ ] 01-03-PLAN.md — Light beam rendering with polarization visual encoding, particles, physics bridge

### Phase 2: Interaction & Visual Language
**Goal**: A student can place optical elements on a light path, rotate them, and observe real-time polarization changes -- discovering Malus's Law through manipulation without reading any text instructions
**Depends on**: Phase 1
**Requirements**: INTR-01, INTR-02, INTR-03, INTR-04, INTR-05, DISC-01, DISC-04, VISL-03, PHYS-03
**Success Criteria** (what must be TRUE):
  1. Student can drag a polarizer onto the beam path within the isometric scene and rotate it (scroll-wheel or drag handle), watching the beam intensity change continuously and physically accurately (Malus's Law)
  2. Student can change environment/material properties (medium type, refractive index) and observe different polarization behaviors from the same light source
  3. All optical elements signal their interactability through visual cues (glow, hover effects, subtle animation) without any UI buttons or text labels -- interactions feel native to the illustrated world
  4. Achieving a correct optical configuration triggers a visible environmental response -- the illustration changes (light spreads, colors shift, patterns appear in the SVG scene)
  5. The light beam remains the visually dominant element in the scene -- environmental illustrations and decorations never compete with the physics signal
**Plans**: 4 plans

Plans:
- [ ] 02-01-PLAN.md — Store extension with element CRUD, interaction hooks (drag, rotation, selection, beam preview)
- [ ] 02-02-PLAN.md — Interactive OpticalElement UI, element palette, ghost beam preview, visual cues
- [ ] 02-03-PLAN.md — Environment popup with property sliders/dropdowns for material and light source adjustment
- [ ] 02-04-PLAN.md — Discovery system (5 configurations), environmental feedback, progressive polarization legend

### Phase 3: Multi-Region Isometric World
**Goal**: A student can freely move between 4-6 interconnected isometric environments, each with a distinct physics theme, with their discovery progress persisting across sessions
**Depends on**: Phase 2
**Requirements**: WRLD-02, WRLD-03, WRLD-05, WRLD-06, PHYS-04, DISC-02, DISC-05, DISC-06
**Success Criteria** (what must be TRUE):
  1. Student can move between 4-6 distinct isometric regions via smooth animated transitions (parallax slides, perspective shifts, fade-throughs) with no page loads or loading screens interrupting exploration
  2. All regions are accessible from the start -- no locked doors or mandatory prerequisites block any path
  3. A light beam originating in one region visibly propagates into an adjacent region, exhibiting different polarization behavior in the new environment
  4. A discovery made in one region creates a visible connection to a related phenomenon in another region -- the student experiences cross-concept "aha" moments
  5. A returning student finds all their previous discoveries intact and can continue from where they left off
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD
- [ ] 03-03: TBD

### Phase 4: Depth Layers & Content Integration
**Goal**: A student who wants to go deeper can transition from intuitive observation to qualitative understanding to quantitative formalism, accessing existing demo components as "deep dives" from within the world
**Depends on**: Phase 3
**Requirements**: DISC-03, VISL-05, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. Student can choose their depth: observe the phenomenon (intuition), understand why it happens (qualitative), or see the mathematics (quantitative) -- all three layers are available for every concept in the built regions
  2. Transitioning from the isometric world view to a deeper information layer feels like a natural zoom or focus shift within the 2D scene -- not a UI mode switch or page navigation
  3. Mathematical formulas appear as the culmination of understanding -- they emerge from phenomena the student has already observed, never as prerequisites
  4. Student can access existing demo components from within the world as seamless deep-dive explorations, without leaving the world context
  5. A concept constellation map visualizes which concepts the student has discovered and how they connect to each other
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

### Phase 5: Visual Polish & Full Coverage
**Goal**: The experience covers all 6 polarization optics units with production-quality illustrated atmosphere in every region, fully localized in Chinese and English
**Depends on**: Phase 4
**Requirements**: VISL-01, CONT-01, CONT-05
**Success Criteria** (what must be TRUE):
  1. All 6 physics units are represented across the world's regions (fundamentals, modulation, interfaces, transparent media, scattering media, polarization measurement) -- no core concept is missing
  2. Each region has a distinct illustrated atmosphere (color palette, geometric motifs, lighting effects, particle animations) that reaches Monument Valley's "every frame worth pausing on" quality standard -- the 2D approach enables pixel-perfect refinement
  3. All student-facing text, labels, and theory content is available in both Chinese and English, switchable without reloading
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Minimum Viable Scene | 3/3 | Complete    | 2026-02-20 |
| 2. Interaction & Visual Language | 0/4 | Planned | - |
| 3. Multi-Region Isometric World | 0/3 | Not started | - |
| 4. Depth Layers & Content Integration | 0/2 | Not started | - |
| 5. Visual Polish & Full Coverage | 0/2 | Not started | - |
