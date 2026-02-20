# Phase 4: Depth Layers & Content Integration - Context

**Gathered:** 2026-02-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Students who want to go deeper can transition from intuitive observation (the existing isometric world) to qualitative understanding to quantitative formalism, all within the world context. Existing demo components are accessible as deep-dive explorations embedded in the depth layers. A concept constellation map visualizes discovered concepts and their connections. No new physics units (Phase 5), no production-quality visual polish (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Three-Layer Content Presentation
- **Qualitative layer form**: Mixed — primarily SVG diagrams in world-consistent visual style with micro-animations on key physics processes. Not pure text or pure animation, but illustrated explanations with selective motion emphasis
- **Quantitative layer form**: LaTeX static formulas (rendered, not interactive). Clean mathematical presentation similar to textbook/paper style
- **Diagram style**: Mixed — world-style SVG (matching isometric palette and aesthetics) as the primary visual language, with more precise textbook-style diagrams for critical physics illustrations where accuracy matters more than atmosphere
- **Information density gradient**: Claude's discretion — adjust per concept complexity and importance
- **Content volume per concept**: Claude's discretion — flexible based on concept difficulty and significance
- **Formula depth**: Claude's discretion — decide whether to include derivation steps based on formula complexity (some formulas benefit from seeing the reasoning, others are better as clean results)
- **Content organization**: Claude's discretion — whether to organize by physics concept or by discovery, based on content structure
- **Language**: Chinese and English bilingual (i18n) — all qualitative and quantitative content supports language switching

### Depth Transition Experience
- **Transition animation**: Panel slide-in from the right side, occupying ~60-70% of screen width
- **World visibility**: World remains visible but dimmed/blurred in the background behind the panel, maintaining spatial context
- **Trigger mechanism**: Hover tooltip on scene elements — when mouse hovers over an optical element with a discovered concept, a "深入了解" / "Learn more" tooltip appears; clicking opens the depth panel
- **Undiscovered concepts**: Claude's discretion — whether to show triggers for undiscovered concepts (locked/hidden)
- **Layer-to-layer transition**: Tab switching or vertical sliding within the panel — qualitative and quantitative as different tabs or scrollable sections within the same panel
- **Exit methods**: All three supported — Escape key, close button (×), and clicking the dimmed scene background
- **Animation pacing**: Elegant ~0.6-1.0s spring animation, matching region transition quality
- **Beam state during depth view**: Claude's discretion — whether beams stay active or freeze based on performance and visual considerations
- **Panel scrolling**: Supported — content can exceed one viewport height, scrollable within the panel
- **Concurrent panels**: One at a time — opening a new concept's depth panel closes the previous one
- **Trigger UI**: Hover tooltip appearing near the element, not a permanent icon

### Demo Embedding
- **Presentation mode**: Embedded within the depth panel as the primary interactive content area
- **Demo redesign**: Demos will be redesigned to fit the world's concept structure — not necessarily preserving the original 23 as-is. Content is reorganized to be more cross-disciplinary and interconnected, consistent with the world's visual style
- **Demo scope**: Not bound to the original 23 — redesigned based on concept coverage needs. Claude decides which demos to create/adapt based on the concepts discovered in each region
- **Demo size**: Occupies the majority of the depth panel area — the demo IS the main deep-dive content, not a sidebar widget
- **Demo entry**: Links within the qualitative/quantitative layer content ("亲自试试" / "Try it yourself") that expand or navigate to the demo within the panel
- **Bidirectional sync**: Demo parameter changes reflect back to the world scene — e.g., adjusting a polarizer angle in the demo updates the corresponding element in the isometric scene
- **Discovery integration**: Achievements within demos count toward the global discovery system (allTimeDiscoveries)
- **Demo visual style**: Redesigned to match world aesthetic — consistent color palette, typography, and interaction patterns

### Concept Constellation Map
- **Relationship to world map**: Merged/fused view — the existing Phase 3 world map is extended with concept nodes overlaid on top of the region layout, creating a single unified view with two information layers (spatial regions + concept graph)
- **Node presentation**: Claude's discretion — based on concept count and visual density (could be star points with labels, small cards, or other forms)
- **Connection types**: Categorized lines — different relationship types (causal, analogous, contrasting) use different colors/line styles to express the nature of conceptual connections
- **Interactions**: Both supported — clicking a concept node opens the depth panel for that concept; long-press or right-click navigates to the scene region where the concept was discovered

### Claude's Discretion
- Information density gradient across three layers
- Content volume per concept
- Formula derivation depth
- Content organization (by concept vs by discovery)
- Whether undiscovered concepts show locked triggers or are invisible
- Beam behavior during depth panel view
- Concept node visual form in constellation map
- Which demos to create/adapt for each concept
- Specific animation details for panel transitions

</decisions>

<specifics>
## Specific Ideas

- Demos are NOT a simple embed of existing 23 components — they are redesigned interactive explorations that align with the world's cross-disciplinary, discovery-based philosophy
- "更交叉打通" — the demo content should bridge concepts across regions, not be siloed per original course unit
- The depth panel should feel like a natural extension of the world, not a UI mode switch — the world dimming in the background maintains the sense of place
- Bidirectional demo-world sync creates a powerful feedback loop: manipulate in the demo, see the effect in the world
- The constellation map as a fused layer on the world map creates a dual-purpose navigation tool: spatial + conceptual

</specifics>

<deferred>
## Deferred Ideas

- Production-quality visual atmosphere per region (Monument Valley quality) — Phase 5
- Full 6-unit coverage and multi-language polish — Phase 5
- Cloud sync for cross-device progress — v2
- Guided exploration mode with adjustable hints — v2

</deferred>

---

*Phase: 04-depth-layers-content-integration*
*Context gathered: 2026-02-21*
