# Phase 5: Visual Polish & Full Coverage - Context

**Gathered:** 2026-02-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Expand the existing 2-region content (Crystal Lab + Refraction Bench) to full 6-region coverage across all polarization optics units. Give each region a distinct illustrated atmosphere reaching Monument Valley quality. Ensure all student-facing text is fully bilingual (ZH/EN). Add responsive design for desktop/tablet/mobile. No new gameplay mechanics or new depth panel features (those would be future work).

</domain>

<decisions>
## Implementation Decisions

### Region Visual Atmosphere
- **Differentiation level**: Subtle differences — unified base color tone across all regions, differentiated by accent colors and light decorative motifs (not dramatically different visual languages per region)
- **Color system**: Cool/scientific palette — predominantly blue/purple/cyan cold tones, laboratory/tech feel
- **Particle density**: Restrained — minimal floating particles + subtle environmental animation, never competing with beam for visual attention (VISL-03 beam dominance preserved)
- **Floor/platform textures**: Illustrated quality — each region has unique illustrated floor textures (crystal patterns, wave ripples, scattering textures) but within the unified cool-toned aesthetic

### Remaining 4 Regions Content Coverage
- **Unit-to-region mapping**: Cross-disciplinary fusion — each region primarily covers one physics unit but includes cross-unit concepts (consistent with Phase 4 "更交叉打通" philosophy). Claude determines the optimal mapping based on physics content
- **Content density**: Claude's discretion — adjust per region based on concept complexity and unit significance
- **Demo explorers**: Claude's discretion — create demos where concepts are naturally interactive, don't force coverage
- **New element types**: Claude's discretion — add new SceneElementType (detector, scatterer, etc.) if physics requires it, otherwise reuse existing types with different properties

### Visual Polish Details
- **Decoration layer**: Rich illustrations — each region has specific decorative objects (lab equipment, bookshelves, tools, etc.) similar to Monument Valley's attention to detail
- **Beam effects**: Fine-tuning on existing SVG stroke + glow — polish glow, particles, color transitions without major rework
- **Transition animations**: Fine-tuning — adjust timing curves, add subtle reveal nuances for first-time region entry, but no fundamental rework
- **Responsive design**: Full responsive — desktop/tablet/mobile all considered. Phase 5 ensures the experience works across screen sizes

### Claude's Discretion
- Bilingual localization approach (academic vs conversational tone, terminology consistency)
- Exact unit-to-region concept mapping
- Content density per region
- Which concepts get demo explorers
- Whether new element types are needed
- Specific decoration objects per region
- Beam effect polish scope
- Animation timing adjustments
- Mobile interaction adaptations

</decisions>

<specifics>
## Specific Ideas

- Unified cool-toned scientific aesthetic across all regions — the world should feel like one cohesive environment, not 6 separate levels
- Rich illustrated decorations give each region personality without breaking the overall visual language
- "每个区域自然地覆盖自己的物理主题，同时和其他区域的概念有交叉联系" — cross-disciplinary connections between regions are as important as within-region content
- Responsive design is a full requirement, not an afterthought — mobile users should be able to explore the world

</specifics>

<deferred>
## Deferred Ideas

- Cloud sync for cross-device progress — v2
- Guided exploration mode with adjustable hints — v2
- Additional physics units beyond the 6 core — v2
- Sound design and ambient audio — v2

</deferred>

---

*Phase: 05-visual-polish-full-coverage*
*Context gathered: 2026-02-21*
