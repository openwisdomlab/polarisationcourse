# Phase 2: Interaction & Visual Language - Context

**Gathered:** 2026-02-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Students can place/rotate optical elements on the light path, change environment/material properties, and observe real-time polarization changes — discovering Malus's Law and other phenomena through manipulation. Correct configurations trigger visible environmental responses. All interaction feels native to the illustrated world (no text instructions). No multiple regions (Phase 3), no depth layers (Phase 4), no additional units (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Element Placement & Rotation
- **Both modes** — pre-placed elements can be repositioned AND a palette provides additional elements
- **Palette design**: Claude's discretion (evaluate diegetic shelf vs floating tray vs other approach for visual integration and usability)
- **Rotation**: Both scroll wheel (fine tuning) AND drag handle (initial discovery) — handle fades after student learns the gesture
- **Snap behavior**: Elements magnetically snap to the nearest beam path position — prevents misplaced elements, ensures physics always works
- **Beam preview during drag**: Ghost preview shows what the beam will look like; final physics update on drop (not real-time during drag)
- **Removal**: Drag element off the beam path to remove it — returns to palette or scene
- **Angle readout**: Subtle on-element degree readout appears when rotating — bridges intuition to quantitative understanding
- **Element scope**: Claude's discretion (evaluate which optical elements best serve Phase 2 discovery goals)

### Environment Manipulation
- **Hybrid interaction** — click to select an environment object in-world, then a tooltip-style contextual popup appears attached to it with arrow pointer
- **Adjustable properties**: Claude's discretion (evaluate which properties best serve Phase 2 discovery goals — consider medium type, refractive index, light source wavelength/polarization/intensity)
- **Popup style**: Tooltip with arrow pointer, compact sliders/toggles, disappears on click-away
- **Transition behavior**: Smooth animation for continuous values (e.g., refractive index slider), instant switch for discrete values (e.g., material type dropdown)

### Environmental Feedback
- **Subtlety level**: Subtle and organic — gentle, not flashy. Like The Witness panels lighting up.
- **Response types** (all four):
  - Light spreads to previously unilluminated areas, revealing hidden details
  - Colors shift on surfaces when beam hits them with specific polarization
  - Interference patterns, rainbow effects, or geometric patterns emerge on surfaces
  - Scene elements react — crystals sparkle, surfaces shimmer, particles burst
- **Discovery structure**: Multiple small discoveries (3-5 different configurations each trigger their own response) — continuous reward cycle
- **Persistence**: Persistent visual change — a previously dark area remains illuminated, showing the student "unlocked" something. Discoveries are permanently recorded in the scene.

### Visual Interaction Cues
- **Interactive vs decorative**: Soft luminous glow outline on hover distinguishes interactive elements from static decorations
- **Drag feedback**: Element glows brightly and the beam path shows a ghost preview of the result
- **Beam dominance**: Beam maintains visual dominance through self-luminosity (always the brightest element via glow effect) — no dimming of environment needed
- **Cursor**: Custom cursors — grab/move cursor on draggable elements, rotate cursor on rotatable elements
- **Selection state**: Bright outline + element name/type label appears — confirms selection and teaches element names
- **Snap hint during drag**: Beam segment nearest to dragged element brightens/pulses, indicating valid drop zone
- **Rotation handle design**: Claude's discretion (design to match isometric aesthetic and be intuitively discoverable)
- **Polarization legend**: Progressive reveal — legend items appear one by one as student discovers each encoding aspect through interaction (not shown upfront)

### Claude's Discretion
- Element palette visual design (diegetic shelf, floating tray, or other)
- Rotation handle design (arc, arrows, or other)
- Which optical elements to include in Phase 2
- Which environment properties are adjustable
- Specific discovery configurations and their environmental responses
- Legend reveal timing and trigger conditions

</decisions>

<specifics>
## Specific Ideas

- "Like The Witness panels lighting up" — environmental feedback should feel like a natural consequence of correct physics, not a game reward animation
- Beam preview during drag creates a "what would happen if..." teaching moment — student sees the ghost before committing
- Progressive legend reveal teaches the visual encoding system through doing, not reading — consistent with discovery-based learning philosophy
- Persistent environmental changes give students a sense of "mapping" the physics space — they can see what they've explored
- Custom cursors provide system-level affordance that works universally, complementing the in-world visual cues

</specifics>

<deferred>
## Deferred Ideas

- Multiple interconnected regions with cross-region beams — Phase 3
- Theory/formula depth layers revealed by zooming — Phase 4
- Demo component deep-dives from within the world — Phase 4
- Full 6-unit physics coverage — Phase 5

</deferred>

---

*Phase: 02-interaction-visual-language*
*Context gathered: 2026-02-20*
