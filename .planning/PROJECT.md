# Odyssey -- Polarization Optics Isometric World

## What This Is

PolarCraft's "Theory & Simulation" module reimagined -- transforming 23 independent polarization optics demos into a beautifully crafted isometric exploration world. Inspired by Monument Valley's visual craft and The Witness's discovery design: students explore interconnected optical environments rendered as 2D isometric illustrations with depth illusion, placing and adjusting optical elements to observe polarization behavior, discovering physics through observation rather than instruction. For students and teachers in higher physics polarization optics courses.

## Core Value

**Students voluntarily immerse in exploration for 2+ hours** -- curiosity-driven discovery learning where polarization knowledge is a natural byproduct of exploring the world.

## Requirements

### Validated

<!-- Existing infrastructure -->

- Validated: Unified physics engine (Mueller/Jones/Stokes matrix calculation) -- existing
- Validated: 23 Demo components (deep content sources) -- existing
- Validated: Light path tracing system (2D/3D) -- existing
- Validated: Multi-language support (EN/ZH) -- existing
- Validated: Dark/Light theme -- existing

### Active

- [ ] Open world architecture -- free exploration, non-linear, natural scene transitions
- [ ] Environment-as-curriculum -- polarization phenomena embedded in scenes, not standalone "stations"
- [ ] Core interaction: place/adjust optical elements + change environment/materials
- [ ] Unified light behavior -- one beam shows different polarization phenomena in different environments
- [ ] Layered information architecture -- intuition -> qualitative -> quantitative, student chooses depth
- [ ] 2D-primary isometric visual world -- SVG/CSS scenes with depth illusion, selective 3D accents for beam effects only
- [ ] Environmental feedback system -- world visually responds to optical element manipulation
- [ ] Discovery-based learning -- no text tutorials, learn through observation and experimentation
- [ ] Knowledge fusion -- cross-connections between polarization concepts, not isolated modules
- [ ] Progressive information presentation -- avoid information overload
- [ ] Gamified design elements -- exploration-driven, not task-driven
- [ ] High-quality visual and interaction design -- every frame worth pausing on, Monument Valley aesthetic

### Out of Scope

- Rewriting existing 23 Demo components -- reuse as deep-dive content sources, not rebuild
- Traditional courseware/textbook presentation -- this is an experience, not slides
- Linear forced path -- violates open exploration core design
- Scoring/grading system -- exploration-driven, not exam-driven
- Mobile-first -- desktop-first web, mobile adaptation deferred (but 2D makes it much easier)
- R3F/Three.js as primary rendering -- 2D isometric chosen for visual polish and iterability

## Context

### Iteration History

5 versions iterated, with the core problem always being **design philosophy** not technology:

| Version | Approach | Why Unsatisfying |
|---------|----------|-----------------|
| v0 (odyssey) | Content data layer | Data definitions only, no interactive experience |
| v1 (odyssey-lab) | Three-column lab layout | Functionally complete but flat experience -- "physics formula spreadsheet" |
| odyssey-scroll | Scroll-driven | Still "scrolling through a Demo list" at its core |
| v2 | 3D corridor design | Grand vision but only skeleton, still linear scrolling |
| v3 | Compromise approach | Low content integration, sparse experience |

**Root problem**: All versions were solving "how to arrange 23 independent demos" instead of "how to fuse knowledge into a whole."

### Existing Technical Assets

- `odysseyData.ts`: 23-station content definitions (39.7KB), usable as content source
- `benchPhysicsCalc.ts`: Light path physics calculation engine
- `@/core/physics/unified/`: Mueller/Jones/Stokes unified physics system
- `odyssey-lab/`: Complete 23-station implementation (reference for interaction patterns)
- `odyssey-v2/shaders/`: Beam shaders, holographic HUD visual assets (may selectively adapt for Canvas beam effects)

### Design References

- **The Witness**: Environment-as-tutorial, no text teaching, puzzles interrelate, learn rules through observation and experimentation
- **Monument Valley**: Every frame is art, minimal UI, serene yet stunning, isometric perspective, impossible geometry
- **Animal Crossing**: Isometric exploration, click/tap navigation, gentle discovery pace
- **Constructivist education theory**: Learners build knowledge through active construction, not passive reception

## Constraints

- **Tech stack**: React 19 + TypeScript + SVG/CSS 3D transforms + Framer Motion + Zustand + Tailwind -- 2D-primary; Canvas/WebGL only for beam glow effects
- **Performance**: >=60fps desktop, >=30fps mobile (2D scenes are inherently lighter)
- **Browser**: Modern browsers, SVG 2.0 support, CSS transforms
- **Content**: Must cover all 6 units' core polarization concepts (can reorganize, cannot omit)
- **Integration**: Coexists with other PolarCraft modules (games, studio, calculator)
- **Visual**: Isometric illustration style -- geometric precision, every scene hand-craftable and incrementally refinable

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Open world not linear scrolling | Previous 5 versions' linear designs all unsatisfying, The Witness open exploration matches learning essence | -- Pending |
| Knowledge fusion not standalone stations | Polarization phenomena are inherently about light behavior in different environments, artificial separation violates knowledge essence | -- Pending |
| Discovery-based not lecture-based | Constructivist education + The Witness design philosophy + 2-hour immersion goal | -- Pending |
| **2D isometric primary, minimize 3D** | Monument Valley aesthetic; 2D allows much more refined, precise visual design than rough 3D; eliminates GPU overhead; scenes are incrementally refinable; SVG/CSS is lighter than R3F Canvas; only use WebGL sparingly for beam glow effects if needed | -- Pending |
| Click/tap navigation not WASD free camera | Isometric world suits point-and-click; lower barrier to entry; more intuitive; matches Monument Valley interaction model | -- Pending |
| Progressive expansion strategy | Build core framework + benchmark region first, design expansion patterns, then gradually fill content | -- Pending |

---
*Last updated: 2026-02-20 after roadmap revision (2D-primary pivot)*
