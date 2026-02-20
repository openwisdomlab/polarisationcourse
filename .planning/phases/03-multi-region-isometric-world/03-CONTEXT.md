# Phase 3: Multi-Region Isometric World - Context

**Gathered:** 2026-02-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Students freely explore 6 interconnected isometric environments with smooth animated transitions. Each region has a distinct visual atmosphere and lab style, with physics concepts interwoven across all regions (not one-concept-per-region). Cross-region beams propagate at boundaries, discoveries connect across regions via visual cues and a constellation map, and session progress persists across browser sessions. No depth layers (Phase 4), no additional unit coverage (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Region Themes & Spatial Layout
- **6 regions** total, each with a distinct visual atmosphere
- **Cross-disciplinary themes** — physics concepts are NOT siloed by course unit; each region naturally interweaves multiple polarization principles (e.g., a "crystal lab" region might involve birefringence AND half-wave rotation AND Brewster's angle)
- **Lab/workbench visual style** throughout — scientific instruments, experimental tables, apparatus — like refined scientific illustrations
- **Strong visual differentiation** — completely different color palettes and decoration styles per region (e.g., ice-blue crystal lab vs warm-orange refraction bench vs deep-purple scattering chamber)
- **Organic/adjacent layout** — regions naturally neighbor each other without a central hub, like Zelda's Hyrule — you can walk in any direction to reach a new region
- **Larger regions (12x12 ~ 15x15)** — significantly bigger than Phase 1's 7x7, giving more exploration space and element placement positions
- **Mixed boundaries** — some region edges have soft gradient transitions, others have explicit entrances (archways, tunnels, bridges) — depends on what's natural for the scene pairing
- **Pre-placed + free placement** — each region has pre-placed light sources and some optical elements, but students can also drag new elements from the equipment palette
- **Per-region equipment palette** — different regions offer different optical elements in their palette, gradually introducing more tools as students explore
- **Light source mobility**: Claude's discretion (fixed vs movable, based on scene design needs)
- **Phase 1 scene fate**: Claude's discretion (keep and expand vs redesign from scratch, based on technical feasibility and design consistency)

### Region Transition Experience
- **Movement trigger**: Combined — walk to region edge for soft transitions AND click explicit entrance objects (doors, archways) for hard transitions
- **Transition animation**: Smooth camera slide (pan to new region), ~0.8-1.2 seconds
- **During transition**: Briefly display region name overlay (like a game area title card)
- **Avatar behavior**: Avatar walks to edge and disappears, then reappears at the entrance point of the new region (not continuous walk-through)
- **World map/navigation**: Yes — students can open a world map showing all 6 regions, click to fast-travel to any previously visited region
- **First discovery animation**: First time entering a new region has a special entrance animation (slightly different camera movement or reveal effect) to emphasize exploration
- **Element persistence**: Elements placed by the student remain when leaving a region — they're still there when you come back

### Cross-Region Beams & Discovery Connections
- **Beam boundary behavior**: Light beams visibly extend at region edges — a visual indicator (glow, arrow, trail) shows "this beam continues into the neighboring region"; entering that region shows the beam arriving from the boundary
- **Discovery connections — dual display**: Both in-scene subtle visual cues (faint glowing lines/particles connecting related discovery points) AND constellation-style connections on the world map
- **Cross-region "big discoveries"**: Yes — some meta-discoveries require combining knowledge/configurations from multiple regions, incentivizing thorough exploration
- **Discovery association logic**: Claude's discretion (hand-curated associations vs physics-based inference)

### Session Persistence & Return Experience
- **Persisted state**: Achieved discoveries + element positions/angles per region + avatar position + camera state + last visited region + environment parameter adjustments + legend state
- **Return experience**: Returning student resumes exactly where they left off — same region, same position, same element arrangements
- **Per-region reset**: Students can reset individual regions to their initial state without affecting other regions' progress
- **Storage mechanism**: Claude's discretion (localStorage vs IndexedDB based on data complexity)

### Claude's Discretion
- Specific visual atmosphere design for each of the 6 regions (color palettes, decoration styles, lab equipment themes)
- Which physics concepts appear in which regions (cross-disciplinary distribution)
- Light source fixed vs movable per region
- Phase 1 scene: keep/expand or redesign
- Discovery association logic (preset vs physics-based)
- Storage technology (localStorage vs IndexedDB)
- World map visual design
- First-entry animation specifics

</decisions>

<specifics>
## Specific Ideas

- Regions are like different labs/workshops in a research institute — each with its own personality but clearly part of the same world
- Cross-region big discoveries create "aha" moments that reward exploration — like The Witness when you realize two puzzle types are connected
- The world map doubles as a progress tracker — students can see which regions they've explored and which discoveries remain
- Equipment palette differences per region encourage revisiting earlier regions with new tools
- Mixed boundaries feel more organic than uniform transitions — an archway into a crystal cave feels different from walking across an open threshold into a refraction bench

</specifics>

<deferred>
## Deferred Ideas

- Depth layers and theory emergence from discoveries — Phase 4
- Embedded demo deep-dives from within the world — Phase 4
- Full 6-unit physics coverage and visual polish — Phase 5
- Cloud sync for cross-device progress — future consideration

</deferred>

---

*Phase: 03-multi-region-isometric-world*
*Context gathered: 2026-02-20*
