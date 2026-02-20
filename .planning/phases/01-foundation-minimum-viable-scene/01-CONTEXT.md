# Phase 1: Foundation & Minimum Viable Scene - Context

**Gathered:** 2026-02-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver one playable isometric scene at /odyssey/ with: click-to-move navigation, a light source emitting a polarization-encoded beam, stylized SVG environment, and 60fps performance. This is the foundational scene that proves the 2D isometric approach works. No optical element interaction (Phase 2), no multiple regions (Phase 3), no depth layers (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### Scene Visual Style
- **Isometric laboratory** — a bright, clean optical laboratory rendered in isometric perspective
- **Monument Valley-inspired impossible geometry** — expressed through light paths that appear to follow "impossible" routes (bending, crossing levels), which are actually optical phenomena (refraction, reflection)
- **Bright, fresh color palette** — white/light background tones, NOT dark room style
- **Rich, multi-layered scene** — not minimalist; multiple levels of decorative detail, particles, environmental elements creating immersion
- **Optical elements as primary visual elements** — polarizers, lenses, waveplates, prisms rendered as refined SVG illustrations
- **Multi-level isometric platforms** — light beam traverses between different height levels
- **Scene boundary extends to other regions** — edges show distant views of neighboring areas (preparing for Phase 3)
- **Isometric angle**: Claude's discretion (evaluate between classic 30° and higher top-down)
- **Background atmosphere**: Claude's discretion (gradient, subtle pattern, or other)

### Navigation & Movement
- **Click-to-move** — student clicks a destination in the isometric scene, viewpoint/character moves there smoothly (Monument Valley tap-to-move model)
- **Scene slightly larger than viewport** — requires minor panning to explore fully
- **Scroll-wheel zoom** — student can zoom in/out to inspect details or see overview
- **Character presence**: Claude's discretion (evaluate whether a small character/light symbol enhances the experience)

### Beam Visual Encoding
- **SVG `<line>`/`<path>` as beam body** + linear gradients + feGaussianBlur filter for glow/halo effect
- **Flowing particles** along beam path indicating light propagation direction
- **Polarization state encoding**: Must be scientifically accurate — specific visual mapping (color for angle, shape for type, etc.) at Claude's discretion based on comprehensive evaluation of scientific accuracy + visual clarity + aesthetic quality
- **Intensity encoding**: Opacity + width combined — beam becomes thinner and more transparent as intensity decreases
- **Continuous transformation** — when beam passes through optical elements, visual change is smooth/continuous, not abrupt
- **Full extinction = beam disappears** — at 0 intensity (crossed polarizers), beam fades to invisible, area behind goes dark
- **Illumination effect** — beam illuminates surfaces it hits (color/brightness change on objects in beam path)
- **Particle style**: Claude's discretion (evaluate dots vs wave pattern vs other)
- **Beam splitting visual**: Claude's discretion (evaluate based on scientific accuracy and visual impact)
- **Phase 1 beam complexity boundary**: Claude's discretion (single beam + basic transforms vs. including splitting)

### First Impression Experience
- **Direct entry** — no splash screen, no intro animation, student immediately sees the isometric laboratory and beam
- **Subtle animation hints** — interactive elements have gentle periodic animations (pulsing, slight wobble) to suggest interactability without text
- **Initial interactive elements**: Claude's discretion (evaluate number based on scene content and learning goals — at minimum a light source)
- **Lightweight HUD** — back button + minimap + settings, semi-transparent, never obscuring the scene

### Claude's Discretion
- Isometric angle (30° classic vs other)
- Background visual treatment
- Whether to include a navigable character/avatar or purely viewport-based movement
- Particle animation style along beam
- Beam splitting implementation scope for Phase 1
- Number of initial interactive elements
- SVG vs Canvas 2D for beam glow effects (evaluate performance + visual quality)
- Specific polarization state visual encoding scheme (within scientific accuracy constraint)

</decisions>

<specifics>
## Specific Ideas

- "Light paths that look impossible" — the Monument Valley impossible geometry should be expressed through optical phenomena (light bending through prisms, reflecting at angles that seem to defy spatial logic in isometric view), not through architectural impossibility
- The laboratory should feel like a place where light *lives* and *plays* — bright, inviting, curious, not clinical or academic
- Every frame should be worth pausing on — Monument Valley quality bar for visual craft
- Beam glow must stand out on bright backgrounds — use self-luminous beam with soft halo to maintain visibility against light-colored scene elements
- Scene edges showing distant neighboring regions creates anticipation for Phase 3 exploration

</specifics>

<deferred>
## Deferred Ideas

- Optical element placement/rotation interaction — Phase 2
- Environmental response to correct configurations — Phase 2
- Multiple interconnected regions — Phase 3
- Theory/formula depth layers — Phase 4
- Demo component embedding — Phase 4

</deferred>

---

*Phase: 01-foundation-minimum-viable-scene*
*Context gathered: 2026-02-20*
