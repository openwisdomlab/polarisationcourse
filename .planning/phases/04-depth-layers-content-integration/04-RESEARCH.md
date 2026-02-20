# Phase 4: Depth Layers & Content Integration - Research

**Researched:** 2026-02-21
**Domain:** Layered information architecture, panel overlay systems, concept graph visualization, demo embedding, LaTeX rendering
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Three-Layer Content Presentation:**
- Qualitative layer form: Mixed -- primarily SVG diagrams in world-consistent visual style with micro-animations on key physics processes. Not pure text or pure animation, but illustrated explanations with selective motion emphasis
- Quantitative layer form: LaTeX static formulas (rendered, not interactive). Clean mathematical presentation similar to textbook/paper style
- Diagram style: Mixed -- world-style SVG (matching isometric palette and aesthetics) as primary visual language, with more precise textbook-style diagrams for critical physics illustrations where accuracy matters more than atmosphere
- Language: Chinese and English bilingual (i18n) -- all qualitative and quantitative content supports language switching

**Depth Transition Experience:**
- Transition animation: Panel slide-in from the right side, occupying ~60-70% of screen width
- World visibility: World remains visible but dimmed/blurred in the background behind the panel, maintaining spatial context
- Trigger mechanism: Hover tooltip on scene elements -- when mouse hovers over an optical element with a discovered concept, a "深入了解" / "Learn more" tooltip appears; clicking opens the depth panel
- Layer-to-layer transition: Tab switching or vertical sliding within the panel -- qualitative and quantitative as different tabs or scrollable sections within the same panel
- Exit methods: All three supported -- Escape key, close button (x), and clicking the dimmed scene background
- Animation pacing: Elegant ~0.6-1.0s spring animation, matching region transition quality
- Panel scrolling: Supported -- content can exceed one viewport height, scrollable within the panel
- Concurrent panels: One at a time -- opening a new concept's depth panel closes the previous one
- Trigger UI: Hover tooltip appearing near the element, not a permanent icon

**Demo Embedding:**
- Presentation mode: Embedded within the depth panel as the primary interactive content area
- Demo redesign: Demos will be redesigned to fit the world's concept structure -- not necessarily preserving the original 23 as-is. Content is reorganized to be more cross-disciplinary and interconnected, consistent with the world's visual style
- Demo scope: Not bound to the original 23 -- redesigned based on concept coverage needs
- Demo size: Occupies the majority of the depth panel area -- the demo IS the main deep-dive content, not a sidebar widget
- Demo entry: Links within the qualitative/quantitative layer content ("亲自试试" / "Try it yourself") that expand or navigate to the demo within the panel
- Bidirectional sync: Demo parameter changes reflect back to the world scene -- e.g., adjusting a polarizer angle in the demo updates the corresponding element in the isometric scene
- Discovery integration: Achievements within demos count toward the global discovery system (allTimeDiscoveries)
- Demo visual style: Redesigned to match world aesthetic -- consistent color palette, typography, and interaction patterns

**Concept Constellation Map:**
- Relationship to world map: Merged/fused view -- the existing Phase 3 world map is extended with concept nodes overlaid on top of the region layout, creating a single unified view with two information layers (spatial regions + concept graph)
- Connection types: Categorized lines -- different relationship types (causal, analogous, contrasting) use different colors/line styles to express the nature of conceptual connections
- Interactions: Both supported -- clicking a concept node opens the depth panel for that concept; long-press or right-click navigates to the scene region where the concept was discovered

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

### Deferred Ideas (OUT OF SCOPE)
- Production-quality visual atmosphere per region (Monument Valley quality) -- Phase 5
- Full 6-unit coverage and multi-language polish -- Phase 5
- Cloud sync for cross-device progress -- v2
- Guided exploration mode with adjustable hints -- v2

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DISC-03 | Layered information architecture -- intuition (see phenomenon) -> qualitative (understand why) -> quantitative (mathematical description), student chooses depth | Three-layer content system: store concept definitions, depth panel with tab/scroll navigation, KaTeX for formulas, SVG diagrams for qualitative content |
| VISL-05 | Depth layers within the 2D world -- zooming into a phenomenon smoothly reveals deeper information layers without breaking the visual context | Right-side panel slide-in with Framer Motion spring animation, world dimmed/blurred behind panel, EnvironmentPopup-style HTML overlay pattern |
| CONT-02 | Existing 23 demo components accessible as "deep exploration" entry points from within the world, seamlessly embedded | Redesigned demo components embedded in depth panel, bidirectional store sync, lazy-loaded per-concept demos |
| CONT-03 | Theory formulas emerge from phenomena -- experience first then formalize, formulas celebrate understanding rather than serve as prerequisites | Content ordering: intuition layer (always visible) -> qualitative (SVG diagrams + explanations) -> quantitative (KaTeX formulas), discovery-gated visibility |
| CONT-04 | Concept constellation map -- visual knowledge graph showing discovered concepts and their connections | Extended WorldMap with concept nodes, categorized connection lines, click-to-open-depth-panel interaction |

</phase_requirements>

## Summary

Phase 4 introduces a layered information architecture on top of the existing isometric world built in Phases 1-3. The core challenge is creating a right-side depth panel that feels like a natural extension of the world (not a page navigation), embedding redesigned interactive demos within it, and extending the existing world map into a concept constellation visualization. All content must be bilingual (ZH/EN).

The existing codebase provides strong foundations: the EnvironmentPopup pattern (HTML overlay over SVG scene), Framer Motion AnimatePresence for panel animations, KaTeX already installed for LaTeX rendering, the MathRenderer component, Zustand store with discovery system and allTimeDiscoveries, and a WorldMap component ready to be extended with concept graph nodes.

The primary technical challenge is the bidirectional demo-world sync: when a student adjusts a parameter in an embedded demo, the corresponding scene element in the isometric world should update. This requires a carefully designed sync layer between the depth panel's demo state and the odysseyWorldStore. The secondary challenge is the concept content system -- defining a data model for concepts that maps discoveries to three-layer content (intuition/qualitative/quantitative) with i18n support.

**Primary recommendation:** Build a ConceptRegistry data model mapping discoveries to three-layer content, a DepthPanel overlay component using the EnvironmentPopup HTML-overlay pattern with Framer Motion slide-in, and extend the existing WorldMap component with concept graph nodes. Redesign demos as lightweight concept-specific interactive components (not the full existing demo infrastructure).

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | ^12.23.25 | Panel slide-in animation, AnimatePresence for mount/unmount, spring physics | Already used throughout odyssey-world, provides spring transitions matching region transition quality |
| katex | ^0.16.8 | LaTeX formula rendering for quantitative layer | Already installed, MathRenderer component exists, handles static math display |
| zustand | ^5.0.9 | Depth panel state, concept discovery tracking, bidirectional sync | Already manages world state, subscribeWithSelector for efficient cross-store sync |
| react-i18next | ^16.4.0 | Bilingual content (ZH/EN) for all three layers | Already in project, demos use useTranslation, i18n keys in en.json/zh.json |
| lucide-react | ^0.556.0 | Icons for depth panel UI (close button, tabs, navigation) | Already used in HUD and WorldMap |

### Supporting (Already in Project)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | ^4.1.17 | Depth panel styling, responsive layout | All UI components |
| clsx + tailwind-merge | via cn() | Conditional classnames in depth panel components | Component variant styling |

### No New Dependencies Needed

The project has everything required. KaTeX is installed but currently only used in older odyssey/lab components -- the MathRenderer wrapper component is ready. Framer Motion 12 has all needed animation capabilities (AnimatePresence, spring, layout animations). No graph visualization library is needed because the constellation map extends the existing SVG-based WorldMap with additional nodes/edges -- this is a simple SVG overlay, not a force-directed graph.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/odyssey-world/
│   ├── depth/                       # New: depth panel system
│   │   ├── DepthPanel.tsx           # Main panel overlay (slide-in from right)
│   │   ├── DepthPanelContent.tsx    # Content renderer (tabs/scroll for layers)
│   │   ├── ConceptTooltip.tsx       # Hover tooltip trigger on scene elements
│   │   ├── QualitativeLayer.tsx     # SVG diagrams + explanations
│   │   ├── QuantitativeLayer.tsx    # KaTeX formulas + derivations
│   │   ├── DemoLayer.tsx            # Embedded demo container with sync
│   │   └── hooks/
│   │       ├── useDepthPanel.ts     # Panel open/close state management
│   │       └── useDemoSync.ts       # Bidirectional demo-world sync
│   ├── concepts/                    # New: concept content data
│   │   ├── conceptRegistry.ts       # Concept definitions + content mapping
│   │   ├── crystalLabConcepts.ts    # Crystal Lab concept content
│   │   ├── wavePlatformConcepts.ts  # Wave Platform concept content
│   │   ├── refractionBenchConcepts.ts
│   │   ├── scatteringChamberConcepts.ts
│   │   ├── interfaceLabConcepts.ts
│   │   └── measurementStudioConcepts.ts
│   ├── demos/                       # New: redesigned concept demos
│   │   ├── MalusLawExplorer.tsx     # Compact Malus's Law demo for panel
│   │   ├── CircularPolExplorer.tsx  # Circular polarization interactive
│   │   ├── BrewsterExplorer.tsx     # Brewster angle interactive
│   │   └── ...                      # Per-concept explorers
│   ├── WorldMap.tsx                 # Extended: constellation map overlay
│   ├── OdysseyWorld.tsx             # Extended: depth panel integration
│   └── ...existing files...
├── stores/
│   └── odysseyWorldStore.ts         # Extended: depth panel state + concept tracking
└── i18n/locales/
    ├── en.json                      # Extended: concept content translations
    └── zh.json                      # Extended: concept content translations
```

### Pattern 1: HTML Overlay Panel (Established Pattern)
**What:** Depth panel rendered as HTML div positioned absolutely over the SVG scene, consistent with EnvironmentPopup and WorldMap patterns.
**When to use:** For the main depth panel, concept tooltips, and constellation map.
**Why:** The project already uses this pattern for EnvironmentPopup (HTML over SVG with pointer-events management) and WorldMap (fixed overlay with backdrop blur). The depth panel follows the same architecture but occupies the right 60-70% of the viewport.

```typescript
// Pattern: HTML overlay panel (from EnvironmentPopup.tsx and WorldMap.tsx)
export function DepthPanel() {
  const { activeConcept, closePanel } = useDepthPanel()

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    if (activeConcept) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeConcept, closePanel])

  return (
    <AnimatePresence>
      {activeConcept && (
        <>
          {/* Dimmed/blurred backdrop -- clicking closes panel */}
          <motion.div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
          />
          {/* Panel slides in from right */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-40 w-[65vw] overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, duration: 0.8 }}
            style={{ background: 'rgba(20, 20, 30, 0.92)', backdropFilter: 'blur(12px)' }}
          >
            {/* Panel content */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### Pattern 2: Concept Registry (Data-Driven Content)
**What:** A typed data structure mapping discovery IDs to three-layer content with i18n keys.
**When to use:** For defining all concept content per region.
**Why:** The project already uses per-region discovery configs (DiscoveryConfig[]). The concept registry extends this with content layers, avoiding hardcoded content in components.

```typescript
// Pattern: Concept definition with three layers
export interface ConceptDefinition {
  id: string                        // Matches discovery ID from region config
  discoveryId: string               // Maps to existing discovery system
  regionId: string
  // i18n keys for each layer
  titleKey: string                  // e.g. 'odyssey.concepts.malusLaw.title'
  // Intuition layer: always visible once discovered (the phenomenon the student already saw)
  intuitionKey: string              // Short observational description
  // Qualitative layer: SVG diagram + explanation
  qualitativeDiagramId: string      // Maps to SVG diagram component
  qualitativeKey: string            // Explanation text i18n key
  // Quantitative layer: LaTeX formulas
  formulas: {
    main: string                    // Primary formula LaTeX string (e.g. 'I = I_0 \\cos^2\\theta')
    derivationKey?: string          // Optional derivation steps i18n key
  }
  // Demo
  demoComponentId?: string          // Optional: which explorer demo to embed
  // Element trigger: which scene element types show the tooltip
  triggerElementTypes: SceneElementType[]
  triggerCondition?: 'discovered' | 'always' // Claude's discretion: discovered-only or always
  // Constellation connections
  relatedConcepts: {
    conceptId: string
    relationship: 'causal' | 'analogous' | 'contrasting'
    labelKey: string
  }[]
}
```

### Pattern 3: Bidirectional Demo-World Sync
**What:** A hook that connects an embedded demo's parameter state to the odysseyWorldStore, so changes in the demo update the world scene and vice versa.
**When to use:** For every embedded demo that has a corresponding scene element.
**Why:** CONTEXT.md locks this: "Demo parameter changes reflect back to the world scene."

```typescript
// Pattern: Bidirectional sync hook
function useDemoSync(elementId: string) {
  const updateElement = useOdysseyWorldStore((s) => s.updateElement)
  const element = useOdysseyWorldStore((s) =>
    s.sceneElements.find(el => el.id === elementId)
  )

  // Demo -> World: when student adjusts demo parameter
  const syncToWorld = useCallback((property: string, value: number) => {
    updateElement(elementId, {
      properties: { ...element?.properties, [property]: value },
      rotation: property === 'transmissionAxis' ? value : element?.rotation ?? 0,
    })
  }, [elementId, element, updateElement])

  // World -> Demo: element state as initial/current values
  return {
    worldState: element?.properties ?? {},
    worldRotation: element?.rotation ?? 0,
    syncToWorld,
  }
}
```

### Pattern 4: Extended WorldMap as Constellation
**What:** Add concept nodes and categorized connection lines to the existing WorldMap SVG.
**When to use:** For CONT-04 concept constellation map.
**Why:** The WorldMap already renders region shapes, boundary lines, and discovery connection lines as an SVG overlay. Adding concept nodes (small circles/dots positioned within each region shape) and categorized edges (styled by relationship type) is a natural extension -- no new rendering technology needed.

### Anti-Patterns to Avoid
- **Full demo embed (importing existing DemosPage components directly):** The existing demos (MalusLawDemo, ThreePolarizersDemo, etc.) are designed as full-page experiences with DemoHeader, DemoMainLayout, ControlPanel, ChartPanel, etc. They include difficulty tiers, audio, and complex layout. Embedding these directly would create visual clashes and bloat. Instead, create lightweight "Explorer" versions designed for the panel width.
- **Separate router page for depth content:** The depth panel must be an overlay within /odyssey/, not a route navigation. No React Router changes needed.
- **SVG foreignObject for panel content:** Previous project decisions (02-03) explicitly chose HTML overlay over SVG foreignObject for reliable native controls. The depth panel must be HTML.
- **Force-directed graph library (D3-force, reagraph):** The constellation map is a static concept graph overlaid on the existing region layout. The positions are deterministic (concepts belong to regions, regions have fixed positions). Force simulation is overkill and introduces jitter.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| LaTeX rendering | Custom math parser | KaTeX via existing MathRenderer component | Already in project, handles edge cases, proper rendering |
| Panel slide-in animation | CSS transitions or manual requestAnimationFrame | Framer Motion AnimatePresence + spring | Already used for region transitions, WorldMap; spring physics feels natural |
| i18n bilingual content | Manual language switching logic | react-i18next useTranslation + JSON locale files | Already configured, existing infrastructure |
| Scroll management in panel | Custom scroll implementation | Native CSS overflow-y-auto with optional scroll-behavior: smooth | Browser native scroll is reliable, well-optimized |
| Backdrop blur behind panel | Custom filter/shader | CSS backdrop-filter: blur() | Already used in WorldMap and HUD, GPU-composited |

**Key insight:** This phase is primarily a content architecture + UI overlay challenge, not a new technology challenge. Every rendering technology, animation library, and state management pattern already exists in the project. The complexity is in content design, data modeling, and integration seams -- not in finding new libraries.

## Common Pitfalls

### Pitfall 1: Panel Blocking Scene Interaction
**What goes wrong:** The depth panel's backdrop captures all pointer events, making the world completely non-interactive. When the panel is open, students can't see the beam changes caused by bidirectional sync.
**Why it happens:** The dimmed backdrop uses pointer-events: auto and covers the entire viewport.
**How to avoid:** The dimmed backdrop should cover only the left portion (not overlapping the panel). The world scene should remain partially visible and responsive to store updates (beam rendering continues). Use `pointer-events: none` on non-interactive parts, `pointer-events: auto` only on the backdrop (for click-to-close) and the panel.
**Warning signs:** Opening the depth panel makes the world freeze visually.

### Pitfall 2: Store Update Storms from Bidirectional Sync
**What goes wrong:** Demo slider adjustments fire rapid store updates, each triggering beam physics recalculation, which triggers demo re-render, creating a feedback loop.
**Why it happens:** useBeamPhysics subscribes to sceneElements changes. Demo sync writes to sceneElements. Beam segments update triggers demo re-render if it reads beamSegments.
**How to avoid:** Throttle demo-to-world sync (200ms, matching existing discovery check throttle). Use useRef for intermediate slider values, only commit to store on pointerUp or throttled intervals. Demo should read element properties from a snapshot, not subscribe to real-time beam segments.
**Warning signs:** Slider drag feels laggy or jittery; CPU usage spikes during demo interaction.

### Pitfall 3: Concept Tooltip Z-Index Conflicts
**What goes wrong:** Hover tooltips on scene elements conflict with ElementPalette (L5), PolarizationLegend, HUD, or the depth panel itself.
**Why it happens:** Multiple HTML overlays compete at z-10 to z-50.
**How to avoid:** Establish clear z-index hierarchy: HUD (z-10), tooltips (z-20), dimmed backdrop (z-30), depth panel (z-40), WorldMap (z-40 -- but panel and WorldMap never coexist open simultaneously).
**Warning signs:** Tooltips appear behind other UI elements or cause flickering.

### Pitfall 4: KaTeX CSS Not Loaded
**What goes wrong:** LaTeX formulas render as unstyled text or broken layout.
**Why it happens:** KaTeX requires its CSS stylesheet to be imported. The existing MathRenderer component renders HTML but may not include the CSS.
**How to avoid:** Verify that `katex/dist/katex.min.css` is imported in main.tsx or the QuantitativeLayer component. Check the existing main.tsx for KaTeX CSS import.
**Warning signs:** Formulas appear but look wrong (no proper sizing, spacing, or symbols).

### Pitfall 5: Content Volume Explosion
**What goes wrong:** Trying to write comprehensive qualitative explanations and LaTeX formulas for every discovery across 6 regions in a single plan.
**Why it happens:** 6 regions x ~5-7 discoveries each = 30-42 concepts. Full three-layer content for each is massive.
**How to avoid:** Phase 4 should build the infrastructure (panel, concept registry, constellation map) and populate content for 2-3 regions (Crystal Lab + 1-2 others). Phase 5 completes all 6 regions. Content for each concept should be concise (1-2 SVG diagrams, 1-3 formulas, 1 short demo).
**Warning signs:** Plan estimates exceed 30 minutes; content creation dominates over infrastructure.

### Pitfall 6: Constellation Map Overcomplicating WorldMap
**What goes wrong:** Adding concept graph nodes makes the WorldMap unreadable -- too many nodes, overlapping labels, complex interaction handlers.
**Why it happens:** Each region has 5-7 discoveries, so the full graph could have 30-42 nodes in a small SVG.
**How to avoid:** Only show discovered concepts (progressively revealed). Group concepts by region (positioned within/near the region rectangle). Use small dots with labels that appear on hover, not permanent text. Keep the existing WorldMap's clean aesthetic.
**Warning signs:** The constellation map feels cluttered or overwhelms the region layout.

### Pitfall 7: Demo Components Too Heavy for Panel
**What goes wrong:** Embedded demos include R3F Canvas, complex charts, or heavy physics simulations that cause the panel to lag.
**Why it happens:** Existing demo components were designed for full-page rendering.
**How to avoid:** Create new lightweight "Explorer" components specifically for the depth panel. Use SVG-only rendering (matching the world's 2D-primary approach). Keep interactions simple: 1-2 sliders, immediate visual feedback via SVG.
**Warning signs:** Panel scroll stutters when a demo is active; memory usage spikes.

## Code Examples

### Concept Registry Type Definition
```typescript
// Source: Custom pattern based on existing DiscoveryConfig + RegionDefinition patterns

/** Concept content for one layer */
export interface ConceptLayer {
  titleKey: string           // i18n key for layer title
  contentKey: string         // i18n key for main explanation text
}

/** Full concept definition mapping a discovery to three-layer content */
export interface ConceptDefinition {
  id: string                              // Unique concept ID
  discoveryId: string                     // Maps to existing discovery system ID
  regionId: string                        // Which region this concept belongs to
  nameKey: string                         // i18n key: 'odyssey.concepts.malusLaw.name'
  iconVariant: string                     // Visual icon identifier

  // Three layers
  intuition: ConceptLayer                 // "What you saw" -- brief observational description
  qualitative: ConceptLayer & {
    diagramComponent: string              // React component ID for SVG diagram
    animationHints?: string[]             // Which parts get micro-animation
  }
  quantitative: ConceptLayer & {
    formulas: { latex: string; labelKey: string }[]
    derivationStepsKey?: string           // Optional step-by-step derivation
  }

  // Demo
  demoComponentId?: string                // Lazy-loaded explorer component

  // Scene trigger
  triggerElements: string[]               // Scene element IDs that show tooltip

  // Constellation graph
  connections: {
    targetConceptId: string
    type: 'causal' | 'analogous' | 'contrasting'
    labelKey: string
  }[]
}

/** Per-region concept registry */
export interface RegionConcepts {
  regionId: string
  concepts: ConceptDefinition[]
}
```

### Depth Panel Store Extension
```typescript
// Source: Pattern from existing odysseyWorldStore.ts (Phase 2-3 store extensions)

// New fields to add to OdysseyWorldState:
interface DepthPanelState {
  // Depth panel
  depthPanelConceptId: string | null     // Currently open concept (null = closed)
  depthPanelActiveTab: 'qualitative' | 'quantitative' | 'demo'

  // Tooltip
  tooltipConceptId: string | null        // Currently showing hover tooltip
  tooltipPosition: { x: number; y: number } | null

  // Actions
  openDepthPanel: (conceptId: string) => void
  closeDepthPanel: () => void
  setDepthPanelTab: (tab: 'qualitative' | 'quantitative' | 'demo') => void
  showConceptTooltip: (conceptId: string, x: number, y: number) => void
  hideConceptTooltip: () => void
}
```

### KaTeX Rendering in Quantitative Layer
```typescript
// Source: Existing MathRenderer.tsx pattern
import MathRenderer from '@/components/MathRenderer'

function QuantitativeLayer({ concept }: { concept: ConceptDefinition }) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 px-6 py-4">
      <h3 className="text-lg font-light tracking-wide text-white/90">
        {t(concept.quantitative.titleKey)}
      </h3>

      {/* Main formulas */}
      {concept.quantitative.formulas.map((formula, i) => (
        <div key={i} className="rounded-lg bg-white/5 px-4 py-3">
          <div className="mb-1 text-xs text-white/50">
            {t(formula.labelKey)}
          </div>
          <MathRenderer
            latex={formula.latex}
            displayMode={true}
            className="text-white/90"
          />
        </div>
      ))}

      {/* Optional derivation */}
      {concept.quantitative.derivationStepsKey && (
        <div className="text-sm leading-relaxed text-white/70">
          {t(concept.quantitative.derivationStepsKey)}
        </div>
      )}
    </div>
  )
}
```

### Spring Animation Parameters for Panel
```typescript
// Source: Verified against existing project patterns
// Region transitions use stiffness 40-60, damping 15-20 (from STATE.md)
// WorldMap uses stiffness 200, damping 25 (from WorldMap.tsx)
// Depth panel should feel elegant, ~0.6-1.0s (from CONTEXT.md)

const DEPTH_PANEL_SPRING = {
  type: 'spring' as const,
  stiffness: 120,    // Between WorldMap (200) and region transition (60)
  damping: 20,       // Matching region transition feel
  // Results in ~0.7s settle time -- within 0.6-1.0s target
}

const BACKDROP_FADE = {
  duration: 0.3,
  ease: 'easeOut' as const,
}
```

### Concept Tooltip on Scene Element
```typescript
// Source: Pattern from OpticalElement.tsx hover handling + EnvironmentPopup positioning

function useConceptTooltip(
  element: SceneElement,
  containerRef: RefObject<HTMLDivElement | null>,
  cameraX: MotionValue<number>,
  cameraY: MotionValue<number>,
  zoom: MotionValue<number>,
) {
  const showTooltip = useOdysseyWorldStore((s) => s.showConceptTooltip)
  const hideTooltip = useOdysseyWorldStore((s) => s.hideConceptTooltip)
  const allTimeDiscoveries = useOdysseyWorldStore((s) => s.allTimeDiscoveries)

  // Find concept linked to this element
  const linkedConcept = useMemo(() => {
    return getConceptForElement(element.id, element.type)
  }, [element.id, element.type])

  // Only show tooltip if concept is discovered
  const isDiscovered = linkedConcept && allTimeDiscoveries.has(linkedConcept.discoveryId)

  const handleMouseEnter = useCallback(() => {
    if (!isDiscovered || !linkedConcept || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const screenPos = worldToScreenWithCamera(
      element.worldX, element.worldY,
      cameraX.get(), cameraY.get(), zoom.get(),
    )
    showTooltip(linkedConcept.id, rect.left + screenPos.x, rect.top + screenPos.y)
  }, [isDiscovered, linkedConcept, element, cameraX, cameraY, zoom, containerRef, showTooltip])

  const handleMouseLeave = useCallback(() => {
    hideTooltip()
  }, [hideTooltip])

  return { handleMouseEnter, handleMouseLeave, hasConceptTooltip: isDiscovered }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion separate package | motion package (v12+) | Late 2024 | Import from 'framer-motion' still works; motion.dev is the new home. No migration needed for this project since ^12 is installed |
| KaTeX 0.15.x | KaTeX 0.16.8 | 2023 | Better font rendering, more symbols. Project already has 0.16.8 |
| Zustand v4 | Zustand v5 | 2024 | Project already on v5.0.9. No migration needed |

**Deprecated/outdated:**
- The old odyssey components (src/components/odyssey/, odyssey-v2/, odyssey-v3/) are abandoned iterations. Do NOT import from them. Only odyssey-world/ is the current active codebase.
- The old odysseyStore.ts (src/stores/odysseyStore.ts) is for the abandoned 3D portal model. Only odysseyWorldStore.ts is current.

## Recommendations for Claude's Discretion Areas

### Information Density Gradient
**Recommendation:** Light to dense. Intuition layer: 1-2 sentences + a small illustration snippet. Qualitative layer: 1 SVG diagram + 2-3 paragraphs. Quantitative layer: 1-3 formulas + optional derivation. This matches textbook "margin note -> section -> appendix" progressions.

### Undiscovered Concept Triggers
**Recommendation:** Invisible until discovered. Showing locked triggers would require explaining "why" something is locked, which contradicts the discovery learning philosophy (DISC-02: invisible gating). When a student discovers a phenomenon through interaction, the tooltip trigger appears on the relevant element -- this creates a satisfying "new ability unlocked" feeling without explicit locked states.

### Beam Behavior During Depth Panel
**Recommendation:** Beams stay active (not frozen). The world remains dimmed but live behind the panel. This enables the bidirectional sync feedback loop -- when the student adjusts a demo parameter, they can see the beam update in the dimmed background. Freezing beams would make the sync feel disconnected. Performance impact is minimal since beamSegments are already computed via rAF and the panel is HTML (not competing for SVG rendering budget).

### Content Organization
**Recommendation:** Organize by physics concept (not by discovery order). Each concept has a clear identity ("Malus's Law", "Circular Polarization", "Brewster's Angle") regardless of which order the student discovered them. The constellation map provides the discovery-order narrative.

### Concept Node Visual Form
**Recommendation:** Small colored dots (6-8px radius) positioned within each region rectangle on the constellation map, with labels appearing on hover. Dot color matches the region's accent color. Discovered dots are filled; undiscovered dots are hidden (per invisible gating recommendation). This keeps the map clean while allowing progressive density as the student explores.

### Which Demos to Create/Adapt per Region
**Recommendation (initial set for Phase 4 infrastructure validation):**
- **Crystal Lab:** Malus's Law Explorer (rotation slider -> intensity curve), Circular Polarization Explorer (QWP angle -> Poincare sphere position)
- **Refraction Bench:** Brewster Angle Explorer (incidence angle -> reflected intensity + polarization)
- Additional region demos can follow the same pattern in Phase 5

## Open Questions

1. **KaTeX CSS Import Status**
   - What we know: katex ^0.16.8 is in dependencies, MathRenderer.tsx exists
   - What's unclear: Whether katex/dist/katex.min.css is already imported in main.tsx
   - Recommendation: Verify during implementation; add import if missing

2. **i18n Namespace for Concept Content**
   - What we know: en.json and zh.json are flat JSON files with nested keys
   - What's unclear: Whether the concept content volume will make the JSON files too large (30+ concepts x 3 layers x 2 languages)
   - Recommendation: Start with inline keys in the main locale files. If they grow too large, split into a separate `odyssey-concepts` namespace with lazy loading. This decision can be deferred until content volume is clear.

3. **Demo Component Code Sharing with Existing Demos**
   - What we know: Existing demos use PolarizationPhysics engine, DemoLayout, DemoControls
   - What's unclear: How much physics logic can be shared between full demos and lightweight panel explorers
   - Recommendation: Import PolarizationPhysics for calculations but do NOT import DemoLayout/DemoControls. Build fresh SVG-based UI for panel explorers that matches world aesthetic. Share the physics engine, not the presentation layer.

## Sources

### Primary (HIGH confidence)
- Codebase analysis: odysseyWorldStore.ts -- complete store interface, discovery system, region state, persistence
- Codebase analysis: WorldMap.tsx -- existing constellation/graph UI pattern (SVG overlay)
- Codebase analysis: EnvironmentPopup.tsx -- HTML overlay panel pattern over SVG scene
- Codebase analysis: MathRenderer.tsx -- KaTeX integration pattern
- Codebase analysis: regionRegistry.ts -- region definitions, discovery configs, connection types
- Codebase analysis: useDiscoveryState.ts -- discovery check patterns, throttling
- Codebase analysis: IsometricScene.tsx -- layer hierarchy (L0-L5)
- Codebase analysis: package.json -- all dependency versions verified

### Secondary (MEDIUM confidence)
- [Framer Motion docs](https://www.framer.com/motion/) -- AnimatePresence, spring transitions verified
- [Framer Motion sliding panel tutorial](https://egghead.io/blog/how-to-create-a-sliding-sidebar-menu-with-framer-motion) -- Confirmed slide-in pattern with exit animations

### Tertiary (LOW confidence)
- None -- all findings verified against codebase or official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already in project, versions verified from package.json
- Architecture: HIGH -- all patterns derived from existing codebase patterns (EnvironmentPopup, WorldMap, regionRegistry)
- Pitfalls: HIGH -- derived from accumulated project decisions in STATE.md and existing code patterns
- Content model: MEDIUM -- concept registry is a new design, but follows established pattern from DiscoveryConfig/RegionDefinition

**Research date:** 2026-02-21
**Valid until:** 2026-03-21 (stable stack, no moving targets)
