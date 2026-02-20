# Phase 2: Interaction & Visual Language - Research

**Researched:** 2026-02-20
**Domain:** SVG drag-and-drop interaction, polarization physics visualization, discovery-based UI
**Confidence:** HIGH

## Summary

Phase 2 transforms the static Phase 1 isometric scene into an interactive optical laboratory. The core technical challenge is implementing drag-and-drop and rotation of optical elements within an SVG scene that uses CSS transform-based camera panning/zooming, while keeping beam physics recalculation under 16ms. The existing codebase provides strong foundations: `useBeamPhysics` already recalculates when `sceneElements` changes, `MuellerMatrix` has factory methods for all needed optical elements, and `useRotaryDrag` (odyssey-v2) provides a proven rotation-via-pointer pattern (though it's Three.js-based and needs adaptation to SVG).

The main complexity lies in coordinate space management -- SVG drag events return coordinates in SVG viewport space, but the scene has a CSS transform camera applied via `motion.div`. All pointer events must be inverse-transformed through the camera before being converted to world coordinates. The existing `screenToWorldWithCamera` utility handles this but expects raw screen pixels, so a new utility or wrapper is needed for SVG-space coordinates. The secondary complexity is implementing "magnetic snap to beam path" which requires projecting dragged element positions onto the nearest beam segment line and quantizing to world grid positions.

**Primary recommendation:** Build a `useElementInteraction` hook system that intercepts pointer events at the SVG element level (not the scene click handler), converts coordinates through the camera transform, and dispatches granular store actions (`updateElement`, `addElement`, `removeElement`). Use native PointerEvent API with `setPointerCapture` for reliable drag tracking (not Framer Motion's `drag` prop, which fights the camera transform). Rotation uses `atan2`-based angle calculation from the element center. Ghost beam preview renders as a low-opacity duplicate of the beam path recalculated with the element's tentative position.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Element Placement & Rotation:**
- **Both modes** -- pre-placed elements can be repositioned AND a palette provides additional elements
- **Rotation**: Both scroll wheel (fine tuning) AND drag handle (initial discovery) -- handle fades after student learns the gesture
- **Snap behavior**: Elements magnetically snap to the nearest beam path position -- prevents misplaced elements, ensures physics always works
- **Beam preview during drag**: Ghost preview shows what the beam will look like; final physics update on drop (not real-time during drag)
- **Removal**: Drag element off the beam path to remove it -- returns to palette or scene
- **Angle readout**: Subtle on-element degree readout appears when rotating -- bridges intuition to quantitative understanding

**Environment Manipulation:**
- **Hybrid interaction** -- click to select an environment object in-world, then a tooltip-style contextual popup appears attached to it with arrow pointer
- **Transition behavior**: Smooth animation for continuous values (e.g., refractive index slider), instant switch for discrete values (e.g., material type dropdown)

**Environmental Feedback:**
- **Subtlety level**: Subtle and organic -- gentle, not flashy. Like The Witness panels lighting up.
- **Response types** (all four):
  - Light spreads to previously unilluminated areas, revealing hidden details
  - Colors shift on surfaces when beam hits them with specific polarization
  - Interference patterns, rainbow effects, or geometric patterns emerge on surfaces
  - Scene elements react -- crystals sparkle, surfaces shimmer, particles burst
- **Discovery structure**: Multiple small discoveries (3-5 different configurations each trigger their own response) -- continuous reward cycle
- **Persistence**: Persistent visual change -- discoveries are permanently recorded in the scene.

**Visual Interaction Cues:**
- **Interactive vs decorative**: Soft luminous glow outline on hover distinguishes interactive elements from static decorations
- **Drag feedback**: Element glows brightly and the beam path shows a ghost preview of the result
- **Beam dominance**: Beam maintains visual dominance through self-luminosity (always the brightest element via glow effect)
- **Cursor**: Custom cursors -- grab/move cursor on draggable elements, rotate cursor on rotatable elements
- **Selection state**: Bright outline + element name/type label appears -- confirms selection and teaches element names
- **Snap hint during drag**: Beam segment nearest to dragged element brightens/pulses, indicating valid drop zone
- **Polarization legend**: Progressive reveal -- legend items appear one by one as student discovers each encoding aspect through interaction

### Claude's Discretion
- Element palette visual design (diegetic shelf, floating tray, or other)
- Rotation handle design (arc, arrows, or other)
- Which optical elements to include in Phase 2
- Which environment properties are adjustable
- Specific discovery configurations and their environmental responses
- Legend reveal timing and trigger conditions

### Deferred Ideas (OUT OF SCOPE)
- Multiple interconnected regions with cross-region beams -- Phase 3
- Theory/formula depth layers revealed by zooming -- Phase 4
- Demo component deep-dives from within the world -- Phase 4
- Full 6-unit physics coverage -- Phase 5
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INTR-01 | Student can place optical elements on light path via drag-and-drop in isometric scene | Pointer event system with `setPointerCapture`, SVG coordinate conversion through camera transform, magnetic snap to beam path, palette-to-scene drag |
| INTR-02 | Student can rotate/adjust placed optical elements, observing real-time beam behavior changes | `atan2`-based rotation via drag handle + scroll wheel, throttled `updateElement` store action triggers `useBeamPhysics` recalculation, angle readout overlay |
| INTR-03 | Student can change environment/material properties, observing different light behaviors | Contextual popup with sliders/toggles, environment properties stored on SceneElement, `FresnelSolver.REFRACTIVE_INDICES` and `MuellerMatrix` factories provide physics for all property changes |
| INTR-04 | Interaction uses click-to-move for navigation and drag for element placement -- no text instructions | Pointer event differentiation (click vs drag threshold), existing `useClickToMove` preserved for navigation, element events use `stopPropagation` to prevent navigation during manipulation |
| INTR-05 | Optical element interactability communicated through visual cues, not UI buttons | SVG filter-based glow on hover, CSS custom cursors, Framer Motion opacity/scale transitions for selection state, progressive legend reveal via discovery state tracking |
| DISC-01 | Core polarization concepts discovered through environmental interaction, not text explanation | Discovery configuration system: specific element arrangements trigger environmental responses revealing Malus's Law, circular polarization, etc. No text tutorials |
| DISC-04 | Correct configurations trigger visible environmental changes | Discovery state store tracks achieved configurations, SVG environmental response animations (illumination spread, color shift, pattern emergence, particle effects) |
| VISL-03 | Light beam is visually most prominent element -- environment never overpowers physics | Beam glow filter at stdDeviation 1.5 (Phase 1), self-luminosity maintained; environment feedback uses low-opacity subtle effects; z-ordering keeps beam layer above decorations |
| PHYS-03 | Unified polarization visual language -- consistent color/shape/animation encoding | Phase 1's continuous HSL encoding (orientation->hue, ellipticity->shape, intensity->opacity+width) extended to all new elements and ghost previews; progressive legend documents the encoding as students discover each aspect |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | ^12.23.25 | Animation, spring physics, motion values | Already used for camera transforms, avatar animation, element idle wobble; MotionValues for perf-critical animations |
| zustand | ^5.0.9 | State management | Already used for `odysseyWorldStore`; `subscribeWithSelector` enables selective re-renders |
| react | ^19.2.1 | UI framework | Project standard |

### Supporting (already installed, new usage)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^0.556.0 | Icon set | Palette icons, HUD elements (already in project) |

### No New Dependencies Needed

Phase 2 requires **no new npm packages**. All interaction patterns can be built with:
- Native PointerEvent API (browser-native, no library needed)
- Framer Motion (already installed -- for animation, spring physics, motion values)
- SVG native capabilities (filters, transforms, gradients)
- Zustand (already installed -- for state management)

**Why not `@dnd-kit` or `react-dnd`?** These libraries are designed for HTML DOM drag-and-drop (lists, grids, sortable). The Odyssey scene uses SVG elements inside a camera-transformed viewport. DnD libraries don't handle SVG coordinate spaces or camera transforms. The project's own OpticalCanvas already implements SVG drag with raw mouse events + `createSVGPoint`. Using native PointerEvent is the correct approach.

**Why not Framer Motion's `drag` prop?** Framer Motion's `drag` applies CSS transforms to the dragged element, which conflicts with the existing camera transform on the parent `motion.div`. The element would move in screen space, not world space. Raw pointer events with manual coordinate conversion is the correct pattern (same as existing `useClickToMove` and the `OpticalCanvas` in the optical studio).

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw PointerEvent | Framer Motion `drag` | FM drag conflicts with camera transform; would need to fight the library |
| `createSVGPoint().matrixTransform()` | Manual math | SVG native CTM inversion is more reliable than manual matrix math for nested transforms |
| Zustand granular actions | Immutable replace | Replacing entire `sceneElements` array on every frame would cause unnecessary re-renders; granular `updateElement(id, patch)` is needed |

**Installation:**
```bash
# No new packages needed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── stores/
│   └── odysseyWorldStore.ts     # Extended with granular element CRUD + discovery state
├── components/odyssey-world/
│   ├── OdysseyWorld.tsx          # Root (add interaction layer)
│   ├── IsometricScene.tsx        # SVG viewport (add interaction event wiring)
│   ├── OpticalElement.tsx        # Extended: interactive states (hover, selected, dragging)
│   ├── LightBeam.tsx             # Extended: ghost preview mode
│   ├── ElementPalette.tsx        # NEW: draggable element source
│   ├── EnvironmentPopup.tsx      # NEW: contextual property editor
│   ├── DiscoveryFeedback.tsx     # NEW: environmental response animations
│   ├── PolarizationLegend.tsx    # NEW: progressive legend reveal
│   ├── hooks/
│   │   ├── useElementDrag.ts     # NEW: drag-and-drop with snap
│   │   ├── useElementRotation.ts # NEW: scroll + handle rotation
│   │   ├── useElementSelection.ts # NEW: click select, hover, cursor
│   │   ├── useDiscoveryState.ts  # NEW: discovery tracking + feedback triggers
│   │   └── useBeamPreview.ts     # NEW: ghost beam calculation during drag
│   └── ...existing files
└── lib/
    └── isometric.ts              # Extended: beam path projection, snap math
```

### Pattern 1: Pointer Event Coordinate Conversion in Camera-Transformed SVG
**What:** Convert pointer events from browser client space to isometric world space, accounting for the CSS camera transform on the parent `motion.div`.
**When to use:** Every interaction -- drag, rotate, click-to-select, hover detection.
**Example:**
```typescript
// Source: Existing pattern from useClickToMove.ts + OpticalCanvas.tsx

/**
 * Convert a PointerEvent to world coordinates in the camera-transformed SVG scene.
 *
 * The coordinate chain:
 * 1. e.clientX/Y -> browser viewport pixels
 * 2. Subtract container rect -> container-relative pixels
 * 3. Divide by zoom -> unzoomed SVG pixels
 * 4. Add camera offset -> SVG world pixels
 * 5. screenToWorld() -> isometric world grid coordinates
 */
function pointerToWorld(
  e: PointerEvent,
  containerRect: DOMRect,
  cameraX: number,
  cameraY: number,
  zoom: number,
): WorldPoint {
  const screenX = e.clientX - containerRect.left
  const screenY = e.clientY - containerRect.top
  return screenToWorldWithCamera(screenX, screenY, cameraX, cameraY, zoom)
}
```

### Pattern 2: Granular Store Update with Physics Recalculation
**What:** Zustand store actions that update individual scene elements, triggering `useBeamPhysics` recalculation through the existing `sceneElements` selector.
**When to use:** On element rotation, position update, property change.
**Example:**
```typescript
// Source: Pattern derived from existing store + useBeamPhysics dependency chain

// Store action (new):
updateElement: (id: string, patch: Partial<SceneElement>) =>
  set((state) => ({
    sceneElements: state.sceneElements.map((el) =>
      el.id === id ? { ...el, ...patch } : el
    ),
  })),

addElement: (element: SceneElement) =>
  set((state) => ({
    sceneElements: [...state.sceneElements, element],
  })),

removeElement: (id: string) =>
  set((state) => ({
    sceneElements: state.sceneElements.filter((el) => el.id !== id),
  })),

// Physics recalculation happens automatically:
// useBeamPhysics() subscribes to sceneElements via:
//   const sceneElements = useOdysseyWorldStore((s) => s.sceneElements)
// When sceneElements reference changes, useMemo recalculates beam path.
```

### Pattern 3: Rotation via atan2 with Throttled Physics Update
**What:** Track pointer angle relative to element center, compute rotation delta, apply with optional throttling.
**When to use:** Drag handle rotation and scroll wheel fine-tuning.
**Example:**
```typescript
// Source: Adapted from useRotaryDrag.ts (odyssey-v2), converted from Three.js to SVG

const PHYSICS_THRESHOLD_DEG = 0.5 // Only recalculate beam if angle changes > 0.5°

function handleRotationDrag(
  e: PointerEvent,
  elementScreenPos: ScreenPoint,
  containerRect: DOMRect,
  lastAngleRef: React.MutableRefObject<number>,
  onAngleChange: (angleDeg: number) => void,
) {
  const pointerX = e.clientX - containerRect.left
  const pointerY = e.clientY - containerRect.top
  const dx = pointerX - elementScreenPos.x
  const dy = pointerY - elementScreenPos.y
  const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI)

  // Throttle physics updates
  if (Math.abs(angleDeg - lastAngleRef.current) > PHYSICS_THRESHOLD_DEG) {
    lastAngleRef.current = angleDeg
    onAngleChange(angleDeg)
  }
}
```

### Pattern 4: Magnetic Snap to Beam Path
**What:** During drag, project the element position onto the nearest beam segment line, then quantize to the closest grid position on that line.
**When to use:** When element is being dragged and nears a beam path.
**Example:**
```typescript
// Source: Geometric projection math (standard)

function snapToBeamPath(
  worldPos: WorldPoint,
  beamSegments: BeamSegment[],
  snapRadius: number = 1.5, // world units
): WorldPoint | null {
  let closestDist = Infinity
  let snapPoint: WorldPoint | null = null

  for (const seg of beamSegments) {
    // Project point onto segment line
    const dx = seg.toX - seg.fromX
    const dy = seg.toY - seg.fromY
    const len2 = dx * dx + dy * dy
    if (len2 === 0) continue

    const t = Math.max(0, Math.min(1,
      ((worldPos.x - seg.fromX) * dx + (worldPos.y - seg.fromY) * dy) / len2
    ))
    const projX = seg.fromX + t * dx
    const projY = seg.fromY + t * dy

    const dist = Math.hypot(worldPos.x - projX, worldPos.y - projY)
    if (dist < snapRadius && dist < closestDist) {
      closestDist = dist
      // Quantize to nearest 0.5 grid unit for clean positioning
      snapPoint = {
        x: Math.round(projX * 2) / 2,
        y: Math.round(projY * 2) / 2,
      }
    }
  }
  return snapPoint
}
```

### Pattern 5: Ghost Beam Preview During Drag
**What:** Render a low-opacity duplicate of the beam path calculated with the element's tentative (snapped) position, without updating the main store.
**When to use:** While dragging an element, show what the beam *would* look like if dropped here.
**Example:**
```typescript
// Source: Derived from existing calculateBeamPath pattern

function useBeamPreview(
  isDragging: boolean,
  tentativeElements: SceneElement[] | null,
) {
  return useMemo(() => {
    if (!isDragging || !tentativeElements) return null
    // Reuse the same calculateBeamPath function from useBeamPhysics
    return calculateBeamPath(tentativeElements)
  }, [isDragging, tentativeElements])
}

// Rendered in IsometricScene as a separate ghost layer:
// <g className="layer-beam-preview" opacity={0.3} style={{ pointerEvents: 'none' }}>
//   {previewSegments?.map(seg => <LightBeam key={seg.id} segment={seg} />)}
// </g>
```

### Pattern 6: Event Differentiation (Click vs. Drag)
**What:** Distinguish between clicks (navigation/selection) and drags (element movement) using a distance threshold.
**When to use:** On `pointerdown` -- start tracking, on `pointermove` -- if distance > threshold, enter drag mode; on `pointerup` -- if never entered drag, treat as click.
**Example:**
```typescript
const DRAG_THRESHOLD = 5 // pixels

// On pointerdown: record start position
// On pointermove: if distance from start > DRAG_THRESHOLD and target is interactive element:
//   - Enter drag mode
//   - Call e.stopPropagation() to prevent click-to-move navigation
// On pointerup without exceeding threshold:
//   - Treat as click (select element, or fall through to navigation)
```

### Anti-Patterns to Avoid
- **Updating store on every pointermove:** Causes React re-render cascade on every frame. Instead, use `useRef` for intermediate state and only update store on drop/rotation commit. Ghost preview uses a separate local calculation, not the store.
- **Using Framer Motion `drag` on SVG elements inside camera transform:** The `drag` prop applies its own CSS transforms which conflict with the camera. Use raw pointer events.
- **Re-running `calculateBeamPath` on every pixel of drag:** The beam calculation itself is fast (<1ms for 3-5 elements) but triggering a store update + React re-render 60 times/sec is wasteful. Throttle updates during drag (ghost preview is computed locally, not via store).
- **Preventing click-to-move globally during any interaction:** Only prevent navigation for the specific element interaction. Navigation should still work when clicking empty areas.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mueller matrix math | Custom polarization transforms | `MuellerMatrix.linearPolarizer()`, `.waveplate()`, `.rotator()`, `.mirror()`, `.attenuator()` | Already validated, handles all edge cases (TIR, depolarization) |
| Pointer capture during drag | Manual `addEventListener/removeEventListener` on window | `element.setPointerCapture(e.pointerId)` native API | Automatically routes all pointer events to the element, handles multi-touch, works across iframes |
| SVG coordinate conversion | Manual matrix multiplication | `svg.createSVGPoint().matrixTransform(svg.getScreenCTM().inverse())` | SVG native API handles all nested transforms correctly; already used in OpticalCanvas |
| Spring animation | Manual requestAnimationFrame easing | Framer Motion `animate()` with spring config | Already used for camera and avatar; consistent physics feel across all animations |
| Polarization state creation | Manual Stokes vector construction | `PolarizationState.createLinear()`, `.fromStokes()` | Validated implementation with proper normalization and caching |
| Fresnel coefficients | Manual reflection/transmission math | `FresnelSolver.solveFresnel()` with `REFRACTIVE_INDICES` | Complete implementation handling TIR, Brewster's angle, complex amplitude coefficients |

**Key insight:** The unified physics engine (`src/core/physics/unified/`) is the most mature part of the codebase with comprehensive Mueller, Jones, Stokes, Fresnel, and scattering implementations. Phase 2 should use these as black boxes, never reimplementing physics calculations.

## Common Pitfalls

### Pitfall 1: Camera Transform Coordinate Mismatch
**What goes wrong:** Pointer events report positions in browser viewport space, but SVG elements are rendered in a camera-transformed space. Dragging feels "off" -- elements don't follow the cursor.
**Why it happens:** The camera applies `scale(zoom) translate(-cameraX, -cameraY)` via CSS transform on the parent `motion.div`. Raw `e.clientX/Y` values don't account for this.
**How to avoid:** Always convert pointer events through the full coordinate chain: `clientXY -> container-relative -> divide by zoom -> add camera offset -> screenToWorld()`. The existing `screenToWorldWithCamera` utility does this but expects container-relative pixels. Use `getBoundingClientRect()` to get the container offset first.
**Warning signs:** Element jumps to wrong position on first drag; element moves at wrong speed relative to cursor; zoom level affects drag behavior.

### Pitfall 2: Click-vs-Drag Conflict with Navigation
**What goes wrong:** Clicking an optical element to select it also triggers click-to-move navigation, teleporting the avatar to the element's position.
**Why it happens:** Both the element click handler and the scene click handler receive the same event. Without `stopPropagation`, the scene handler treats it as a navigation click.
**How to avoid:** Element pointer handlers must call `e.stopPropagation()` on `pointerdown`. Use a distance threshold to differentiate "click to select" from "drag to move". The element's `pointerdown` prevents the scene click; element's `pointerup` without movement triggers selection.
**Warning signs:** Selecting an element also moves the avatar; clicking near an element has unpredictable behavior.

### Pitfall 3: Store Update During React Render
**What goes wrong:** Calling `store.updateElement()` inside a `useMemo` or during render causes React warnings and potential infinite loops.
**Why it happens:** Phase 1 already hit this with `useBeamPhysics` -- the solution was `queueMicrotask`. Same issue arises if beam preview calculation tries to write to the store.
**How to avoid:** Ghost beam preview should be computed locally (not stored). Store updates only happen in event handlers (pointer events) or in `useEffect`, never during render.
**Warning signs:** React "Cannot update a component while rendering a different component" warning.

### Pitfall 4: SVG Filter Performance with Many Interactive Elements
**What goes wrong:** Adding glow filters to every interactive element on hover causes FPS drops on lower-end devices.
**Why it happens:** SVG `feGaussianBlur` filters are expensive. Phase 1 already caps beam glow at `stdDeviation=1.5`. Adding per-element hover glows multiplies the filter cost.
**How to avoid:** Use a single shared filter definition in SVG `<defs>` referenced by ID. Keep `stdDeviation` low (0.8-1.0 for hover glow). Consider using `box-shadow`-like stroke opacity tricks instead of full gaussian blur for lower-priority elements. Only apply filter to the currently hovered element, not all interactive elements simultaneously.
**Warning signs:** FPS drops when hovering over elements; DevTools Performance shows long "Rendering" frames.

### Pitfall 5: Scroll Wheel Conflict Between Zoom and Rotation
**What goes wrong:** Scroll wheel is used for both camera zoom (existing) and element rotation (Phase 2). Both fire simultaneously.
**Why it happens:** Wheel events bubble up from the element to the scene container.
**How to avoid:** When an element is selected (not just hovered), the element captures wheel events and `stopPropagation` prevents camera zoom. When no element is selected, wheel events reach the camera zoom handler as before. The selection state in the store determines which behavior is active.
**Warning signs:** Rotating an element also zooms the camera; or zooming the camera rotates a selected element.

### Pitfall 6: Ghost Preview Flicker During Drag
**What goes wrong:** The ghost beam preview flashes on and off or shows incorrect state during rapid dragging.
**Why it happens:** Recalculating beam path on every pointermove is fast but React re-rendering the preview segments causes visible flicker if the calculation races the render.
**How to avoid:** Use `useRef` to store the tentative element array, throttle recalculation to every 2-3 frames (using `requestAnimationFrame` or a frame counter), and render the ghost in a stable SVG group that updates via direct DOM mutation (like `useBeamParticles`) or a debounced state update.
**Warning signs:** Ghost beam appears/disappears rapidly; ghost beam shows stale position.

## Code Examples

### SVG Coordinate Conversion Through Camera Transform
```typescript
// Source: Derived from existing OpticalCanvas.tsx pattern (getSVGCoords)
// adapted for the camera-transformed Odyssey scene

function usePointerToWorld(
  cameraX: MotionValue<number>,
  cameraY: MotionValue<number>,
  zoom: MotionValue<number>,
) {
  const containerRef = useRef<HTMLDivElement>(null)

  const toWorld = useCallback(
    (e: PointerEvent | React.PointerEvent): WorldPoint => {
      const rect = containerRef.current!.getBoundingClientRect()
      return screenToWorldWithCamera(
        e.clientX - rect.left,
        e.clientY - rect.top,
        cameraX.get(),
        cameraY.get(),
        zoom.get(),
      )
    },
    [cameraX, cameraY, zoom],
  )

  return { containerRef, toWorld }
}
```

### Custom Cursor Management
```typescript
// Source: Adapted from useRotaryDrag.ts cursor management pattern

const CURSORS = {
  grab: 'grab',
  grabbing: 'grabbing',
  // Custom rotate cursor via CSS url() with SVG data URI
  rotate: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 5V1L7 6l5 5V7a6 6 0 016 6 6 6 0 01-6 6 6 6 0 01-6-6H4a8 8 0 008 8 8 8 0 008-8 8 8 0 00-8-8z' fill='%23333'/%3E%3C/svg%3E") 12 12, auto`,
  default: 'auto',
} as const

function setCursor(type: keyof typeof CURSORS) {
  document.body.style.cursor = CURSORS[type]
}

// Cleanup on unmount (prevent cursor leak):
useEffect(() => () => { document.body.style.cursor = 'auto' }, [])
```

### Element Hover Glow Filter
```typescript
// Source: SVG filter specification, adapted for isometric style

// In SVG <defs> (extend BeamGlowFilters.tsx):
<filter id="element-hover-glow" x="-30%" y="-30%" width="160%" height="160%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
  <feFlood floodColor="#6CB4FF" floodOpacity="0.4" result="color" />
  <feComposite in="color" in2="blur" operator="in" result="glow" />
  <feMerge>
    <feMergeNode in="glow" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>

// Applied conditionally on hover:
<g filter={isHovered ? 'url(#element-hover-glow)' : undefined}>
  {/* element shape */}
</g>
```

### Discovery State Tracking
```typescript
// Source: Derived from design requirements (The Witness-style discovery)

interface DiscoveryConfig {
  id: string
  /** Human-readable name for debugging */
  name: string
  /** Condition function: returns true when this discovery is achieved */
  check: (elements: SceneElement[], beamSegments: BeamSegment[]) => boolean
  /** Environmental response to trigger */
  response: {
    type: 'illuminate' | 'color-shift' | 'pattern' | 'particle-burst'
    target: string // SVG element ID or scene area
    params: Record<string, number | string>
  }
}

// Example: Malus's Law discovery
const MALUS_LAW_DISCOVERY: DiscoveryConfig = {
  id: 'malus-law-basic',
  name: 'Malus\'s Law -- intensity varies with polarizer angle',
  check: (elements, segments) => {
    // True when student has rotated polarizer through 90+ degrees range
    // and observed at least 3 distinct intensity levels
    const polarizer = elements.find(el => el.type === 'polarizer')
    if (!polarizer) return false
    // Check rotation history... (simplified)
    return true
  },
  response: {
    type: 'illuminate',
    target: 'discovery-area-1',
    params: { spreadRadius: 100, color: 'hsl(45, 80%, 60%)', duration: 2 },
  },
}
```

## Discretion Recommendations

### Which Optical Elements to Include in Phase 2

**Recommendation:** 4 elements -- Linear Polarizer, Quarter-Wave Plate, Half-Wave Plate, Analyzer (second polarizer)

**Rationale:**
- These 4 cover the core Malus's Law discovery (two polarizers) and circular/elliptical polarization (waveplates)
- All have existing `MuellerMatrix` factory methods: `linearPolarizer()`, `quarterWavePlate()`, `halfWavePlate()`
- The existing `SceneElementType` already includes `'polarizer'` and `'waveplate'`; no new types needed
- Phase 1 already has a polarizer and QWP in the scene -- students can immediately interact with them
- Adding a half-wave plate introduces the concept of polarization rotation without the complexity of mirrors/prisms

**Excluded for now:** Prism (already in types but complex multi-path refraction), mirror (changes beam direction, needs path-splitting logic not yet built), rotator (too similar to HWP for discovery purposes)

### Which Environment Properties Are Adjustable

**Recommendation:** 3 properties -- Medium type (discrete), Refractive index (continuous), Light source wavelength (continuous)

**Rationale:**
- `REFRACTIVE_INDICES` already has 15 materials in `FresnelSolver.ts` (vacuum, air, water, glass, diamond, calcite, etc.)
- Wavelength affects the visual appearance of the beam and connects to chromatic dispersion
- These three properties are sufficient for the environment manipulation requirement (INTR-03) and provide meaningful physics discovery opportunities
- Medium type as a discrete dropdown lets students see dramatic changes (air vs. water vs. diamond)
- Refractive index slider for fine-tuning connects to Brewster's angle and total internal reflection concepts
- Light source wavelength connects to later units (chromatic polarization) and changes the beam's visual color directly

### Element Palette Design

**Recommendation:** Diegetic shelf -- a small SVG "equipment rack" positioned at the edge of the scene, styled as part of the laboratory environment.

**Rationale:**
- Matches the "interactions feel native to the illustrated world" requirement (INTR-04)
- A floating tray would break the isometric immersion
- The shelf can hold 4-6 elements as small preview icons
- Elements are dragged directly from the shelf into the scene
- When an element is removed from the beam (dragged away), it returns to the shelf with a spring animation
- The shelf can be positioned in the lower-left of the scene (visible but not blocking the main beam path area)

### Rotation Handle Design

**Recommendation:** Arc handle -- a partial circle (90-degree arc) that appears around the selected element, with a draggable dot at the end.

**Rationale:**
- An arc clearly communicates "rotation" without text
- The dot provides a clear grab target
- The arc can show the current angle range with tick marks at 0/45/90 degrees
- After the student learns the rotation gesture, the arc fades to a subtle hint (as per CONTEXT.md decision)
- The angle readout appears near the arc endpoint during rotation

### Discovery Configurations

**Recommendation:** 5 discoveries for Phase 2

1. **Malus's Law intensity** -- Rotate analyzer to see cos^2 intensity law (any polarizer pair)
2. **Complete extinction** -- Cross two polarizers at 90 degrees (beam goes dark)
3. **Circular polarization creation** -- QWP at 45 degrees to linear polarization (helix shape appears)
4. **Half-wave rotation** -- HWP rotates polarization direction (color changes without intensity loss)
5. **Three-polarizer surprise** -- Insert polarizer between crossed pair to restore light

**Environmental responses:**
1. Intensity gradient illuminates a measurement scale area
2. Darkness reveals a previously hidden phosphorescent pattern
3. Helix appearance triggers crystal sparkle effects nearby
4. Color shift causes decorative surfaces to shimmer
5. Light restoration triggers the most dramatic response -- surrounding area brightens

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `addEventListener('mousemove')` on window for drag | `setPointerCapture(pointerId)` on element | PointerEvents spec, widely supported since ~2020 | Simpler, more reliable, handles multi-touch |
| Framer Motion v6 drag: `dragConstraints` with `useRef` | Framer Motion v12: same API but better performance, `dragSnapToOrigin` | framer-motion v12 (current) | No breaking changes; new features available but not needed here |
| Three.js raycasting for interaction in 3D scenes | SVG native hit testing + pointer events in 2D scenes | Project pivot to 2D-primary (Phase 1) | Dramatically simpler interaction code; no raycasting needed |

**Deprecated/outdated:**
- `onMouseDown`/`onMouseMove`/`onMouseUp`: Still works but PointerEvents are strictly superior (combine mouse + touch + pen in one API)
- Three.js `ThreeEvent` interaction pattern (used in `useRotaryDrag.ts`): Not applicable to the new 2D SVG scene

## Open Questions

1. **Scroll Wheel Rotation Sensitivity**
   - What we know: Scroll wheel delta varies by device (trackpad vs. mouse wheel). The existing zoom handler uses `deltaY > 0 ? -0.1 : 0.1` as fixed increment.
   - What's unclear: What degree increment feels natural for rotation? 1 degree per tick? 5 degrees? Should it be configurable?
   - Recommendation: Start with 2 degrees per scroll tick, test in browser, adjust. Track `deltaY` magnitude for proportional rotation on trackpads.

2. **Ghost Preview Performance with Complex Scenes**
   - What we know: `calculateBeamPath` for 3-5 elements takes <1ms. But re-rendering the SVG preview on every drag frame may not be needed.
   - What's unclear: At what element count does the combined calculation + render become perceptible?
   - Recommendation: Throttle ghost preview to every 3rd frame (20fps effective preview update). If profiling shows it's fine at 60fps, remove the throttle.

3. **Discovery State Persistence**
   - What we know: CONTEXT.md says "discoveries are permanently recorded in the scene." The current `odysseyWorldStore` has no persistence mechanism.
   - What's unclear: Should discovery state persist across browser sessions (localStorage) or only within the current session? Phase 3 adds DISC-06 (persist across sessions).
   - Recommendation: Store discovery state in Zustand for now (in-session only). Design the `DiscoveryState` interface to be serializable so Phase 3 can add localStorage persistence without refactoring.

4. **Progressive Legend Reveal Trigger Timing**
   - What we know: Legend items appear one by one as student discovers each encoding aspect.
   - What's unclear: What specific student actions constitute "discovering" an encoding aspect? Is it the first time a beam changes color? The first rotation?
   - Recommendation: Define 4 legend triggers: (1) First time beam color changes visually (orientation encoding), (2) First time beam goes dim (intensity encoding), (3) First time helix shape appears (ellipticity encoding), (4) First time beam brightness changes (intensity-to-opacity encoding). Each triggers after a 1-second delay of the condition being true.

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis: `odysseyWorldStore.ts`, `useBeamPhysics.ts`, `useClickToMove.ts`, `useIsometricCamera.ts`, `OpticalCanvas.tsx`, `useRotaryDrag.ts`, `MuellerMatrix.ts`, `FresnelSolver.ts` -- all read directly
- Context7 `/websites/motion_dev` -- Framer Motion drag API, `useDragControls`, `dragSnapToOrigin`, `onDrag`/`onDragStart`/`onDragEnd` event info, MotionValue for SVG attributes

### Secondary (MEDIUM confidence)
- SVG PointerEvent and `setPointerCapture` -- web standard, widely documented
- SVG `createSVGPoint().matrixTransform()` -- standard SVG API for coordinate conversion

### Tertiary (LOW confidence)
- Discovery configuration design -- based on The Witness analysis and educational theory, needs playtesting validation
- Scroll wheel rotation sensitivity values -- needs empirical testing

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed and proven in Phase 1; no new dependencies
- Architecture: HIGH -- patterns derived from existing working code in the project (OpticalCanvas, useRotaryDrag, useClickToMove, useBeamPhysics)
- Pitfalls: HIGH -- most pitfalls identified from actual code patterns and known SVG/camera-transform issues
- Discretion recommendations: MEDIUM -- optical element selection and discovery design need playtesting validation
- Performance: MEDIUM -- ghost preview throttling and filter performance estimates need runtime profiling

**Research date:** 2026-02-20
**Valid until:** 2026-03-20 (stable domain, existing dependencies)
