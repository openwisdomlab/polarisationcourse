# Phase 1: Foundation & Minimum Viable Scene - Research

**Researched:** 2026-02-20
**Domain:** 2D Isometric Scene Architecture, SVG Beam Rendering, Click-to-Move Navigation, Polarization Visualization
**Confidence:** HIGH

## Summary

Phase 1 delivers a single playable isometric optical laboratory at `/odyssey/` with click-to-move navigation and a light beam whose visual appearance encodes its polarization state. The technical foundation is 2D-primary: SVG illustrations + CSS 3D transforms for isometric perspective + Framer Motion for animation + Zustand for state. The existing codebase provides a rich foundation: a complete unified physics engine (`@/core/physics/unified/`), SVG beam rendering components (`LightBeamSVG`, `LightBeamDefs`), shared optical component types, and polarization color utilities.

The core technical challenges are: (1) building an isometric coordinate system with reliable screen-to-world and world-to-screen conversion for click targeting, (2) rendering SVG beams with glow effects at 60fps on bright backgrounds, and (3) designing a polarization visual encoding scheme that is scientifically accurate for all polarization types (linear, circular, elliptical) while remaining visually clear. All three challenges are solvable with the existing stack -- no new dependencies needed.

**Primary recommendation:** Build the isometric scene as a single SVG viewport with CSS `transform-style: preserve-3d` for depth illusion, use the existing `PolarizationState` class as the beam data model, render beams with SVG `<path>` + `feGaussianBlur` glow (capped stdDeviation for performance), and implement click-to-move via isometric coordinate math utilities with Framer Motion `animate()` for smooth movement.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Isometric laboratory** -- a bright, clean optical laboratory rendered in isometric perspective
- **Monument Valley-inspired impossible geometry** -- expressed through light paths that appear to follow "impossible" routes (bending, crossing levels), which are actually optical phenomena (refraction, reflection)
- **Bright, fresh color palette** -- white/light background tones, NOT dark room style
- **Rich, multi-layered scene** -- not minimalist; multiple levels of decorative detail, particles, environmental elements creating immersion
- **Optical elements as primary visual elements** -- polarizers, lenses, waveplates, prisms rendered as refined SVG illustrations
- **Multi-level isometric platforms** -- light beam traverses between different height levels
- **Scene boundary extends to other regions** -- edges show distant views of neighboring areas (preparing for Phase 3)
- **Click-to-move** -- student clicks a destination in the isometric scene, viewpoint/character moves there smoothly (Monument Valley tap-to-move model)
- **Scene slightly larger than viewport** -- requires minor panning to explore fully
- **Scroll-wheel zoom** -- student can zoom in/out to inspect details or see overview
- **SVG `<line>`/`<path>` as beam body** + linear gradients + feGaussianBlur filter for glow/halo effect
- **Flowing particles** along beam path indicating light propagation direction
- **Intensity encoding**: Opacity + width combined -- beam becomes thinner and more transparent as intensity decreases
- **Continuous transformation** -- when beam passes through optical elements, visual change is smooth/continuous, not abrupt
- **Full extinction = beam disappears** -- at 0 intensity (crossed polarizers), beam fades to invisible, area behind goes dark
- **Illumination effect** -- beam illuminates surfaces it hits (color/brightness change on objects in beam path)
- **Direct entry** -- no splash screen, no intro animation, student immediately sees the isometric laboratory and beam
- **Subtle animation hints** -- interactive elements have gentle periodic animations (pulsing, slight wobble)
- **Lightweight HUD** -- back button + minimap + settings, semi-transparent, never obscuring the scene

### Claude's Discretion
- Isometric angle (30 degree classic vs other)
- Background visual treatment
- Whether to include a navigable character/avatar or purely viewport-based movement
- Particle animation style along beam
- Beam splitting implementation scope for Phase 1
- Number of initial interactive elements
- SVG vs Canvas 2D for beam glow effects (evaluate performance + visual quality)
- Specific polarization state visual encoding scheme (within scientific accuracy constraint)

### Deferred Ideas (OUT OF SCOPE)
- Optical element placement/rotation interaction -- Phase 2
- Environmental response to correct configurations -- Phase 2
- Multiple interconnected regions -- Phase 3
- Theory/formula depth layers -- Phase 4
- Demo component embedding -- Phase 4
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| WRLD-01 | Click/tap point-and-click navigation in isometric perspective | Isometric coordinate math (screen-to-world/world-to-screen), Framer Motion animate() for smooth movement, click event handling on SVG elements |
| WRLD-04 | Spatial coherence -- all regions feel like same isometric world | Single coordinate system, consistent isometric angle, shared visual language (SVG illustration style), scene edges showing distant regions |
| PHYS-01 | Light beam renders polarization state changes in real-time (color/brightness/shape) | Existing PolarizationState class provides Stokes parameters + ellipse parameters; visual encoding maps orientation angle to hue, ellipticity to shape, DoP to saturation |
| PHYS-02 | Beam responds visually within <16ms after optical element manipulation | Existing unified physics engine calculates Mueller/Jones transformations synchronously; SVG attribute updates are immediate; Zustand subscribeWithSelector for targeted re-renders |
| PHYS-05 | 60fps desktop, 30fps+ mobile performance budget | SVG with capped feGaussianBlur stdDeviation (<=2), CSS transform/opacity for animations (GPU-composited), requestAnimationFrame for particle flow, avoid animating SVG filter properties |
| VISL-02 | Isometric illustration art direction with depth illusion | CSS 3D transforms (rotateX/rotateY) for isometric perspective, SVG depth ordering via z-index layering, parallax layers for background depth |
| VISL-04 | 2D-primary rendering with selective 3D accents | SVG/CSS for world, optional Canvas overlay only for beam glow if SVG filters prove insufficient, no Three.js/WebGL dependency |
| TECH-01 | SVG/CSS-primary scene architecture | React SVG components, Framer Motion for animation, CSS 3D transforms for isometric depth, Canvas only as performance fallback for glow |
| TECH-02 | Isometric geometry system with consistent coordinate mapping | Utility module with worldToScreen/screenToWorld functions, tile-based or free-form coordinate system, hit-target calculation for click detection |
| TECH-03 | Data model around composable physics behaviors in environments | Scene graph with typed nodes (LightSource, OpticalElement, Platform, Decoration), PolarizationState on beam segments, environment as context not station array |
| TECH-04 | Coexists with other PolarCraft modules | Existing TanStack Router lazy route at /odyssey/, self-contained store, no global side effects, cleanup on unmount |
| TECH-05 | Desktop-first (mouse + keyboard) | Click-to-move with mouse, scroll-wheel zoom, keyboard shortcuts for HUD toggle, 2D approach makes future mobile adaptation straightforward |
</phase_requirements>

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.2.1 | UI rendering | Already in project, functional components + hooks |
| TypeScript | ^5.3.3 | Type safety | Already in project, strict mode |
| Framer Motion | ^12.23.25 | SVG animation, gesture handling, layout animation | Already in project; motion.svg, motion.path, motion.g for SVG; useMotionValue for perf |
| Zustand | ^5.0.9 | State management | Already in project; subscribeWithSelector middleware for targeted updates |
| TanStack Router | ^1.159.5 | Routing | Already in project; lazy file routes at /odyssey/ already configured |
| Tailwind CSS | ^4.1.17 | Styling | Already in project; cn() utility for conditional classes |
| Vite | ^5.0.10 | Build tooling | Already in project |

### Supporting (Already in Project)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@/core/physics/unified/` | N/A (internal) | Mueller/Jones/Stokes physics engine | Beam polarization state calculation when light passes through optical elements |
| `@/lib/polarization` | N/A (internal) | Polarization color mapping utilities | Base for visual encoding (will need extension for elliptical/circular states) |
| `@/components/shared/optical/` | N/A (internal) | SVG beam rendering (LightBeamSVG, LightBeamDefs) | Reference patterns for beam glow, flow animation; will need adaptation for isometric context |
| `@/stores/odysseyStore` | N/A (internal) | Existing Odyssey state skeleton | Will be substantially rewritten for new isometric scene architecture |
| lucide-react | ^0.556.0 | Icons | HUD icons (back button, settings gear, etc.) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SVG feGaussianBlur for beam glow | Canvas 2D overlay with radial gradients | Canvas gives finer glow control + better perf for many beams, but adds rendering complexity; SVG is simpler for <10 beams. **Recommendation: Start with SVG, fall back to Canvas overlay if profiling shows filter bottleneck** |
| CSS 3D transforms for isometric | SVG transform matrix on root `<g>` | CSS 3D preserves depth ordering natively; SVG matrix is flatter but simpler. **Recommendation: CSS 3D transforms on container div, SVG inside draws in "flat" isometric space** |
| Framer Motion for particle flow | requestAnimationFrame + direct SVG attribute mutation | Framer Motion is heavier for many particles; rAF is lighter. **Recommendation: Use rAF for beam particles (could be 50-100+), Framer Motion for UI/navigation animations** |
| Free-form coordinate system | Tile-based grid | Tiles simplify pathfinding and click detection but constrain scene design. **Recommendation: Hybrid -- use grid for walkable areas/pathfinding, free-form for decorative elements and beam paths** |

### Installation

No new dependencies required. Everything needed is already in the project.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/odyssey-world/       # New Phase 1 scene components
│   ├── OdysseyWorld.tsx            # Root component: scene container + HUD overlay
│   ├── IsometricScene.tsx          # SVG scene with isometric transform wrapper
│   ├── SceneLayer.tsx              # Depth-ordered layer (background, platforms, objects, beams, foreground)
│   ├── LightBeam.tsx               # Polarization-encoded beam with glow + particles
│   ├── LightSource.tsx             # Emitter SVG with pulse animation
│   ├── OpticalElement.tsx          # Base optical element SVG (polarizer, waveplate, etc.)
│   ├── Platform.tsx                # Isometric platform/surface SVG
│   ├── Decoration.tsx              # Non-interactive environmental detail
│   ├── NavigationTarget.tsx        # Click target indicator (where character/viewport moves)
│   ├── HUD.tsx                     # Semi-transparent overlay (back, minimap, settings)
│   ├── Minimap.tsx                 # Scene overview minimap
│   └── hooks/
│       ├── useIsometricCamera.ts   # Pan/zoom/viewport state
│       ├── useClickToMove.ts       # Screen-to-world click handling + movement animation
│       └── useBeamPhysics.ts       # Physics calculation bridge (PolarizationState -> visual props)
├── lib/
│   └── isometric.ts                # Coordinate math: worldToScreen, screenToWorld, isometric constants
└── stores/
    └── odysseyWorldStore.ts        # Scene state: camera, active elements, beam segments, navigation
```

### Pattern 1: Isometric Coordinate System
**What:** A utility module that handles all coordinate conversions between the logical "world" space (where game logic happens) and the "screen" space (where SVG elements are rendered).
**When to use:** Every click event, every element placement, every camera calculation.
**Example:**
```typescript
// Source: Verified isometric math from clintbellanger.net/articles/isometric_math/

// Isometric constants - true isometric uses 2:1 tile ratio
const TILE_WIDTH = 128;  // pixels
const TILE_HEIGHT = 64;  // pixels (half of width for 2:1 isometric)
const TILE_WIDTH_HALF = TILE_WIDTH / 2;
const TILE_HEIGHT_HALF = TILE_HEIGHT / 2;

/** Convert world (grid) coordinates to screen (pixel) coordinates */
export function worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
  return {
    x: (worldX - worldY) * TILE_WIDTH_HALF,
    y: (worldX + worldY) * TILE_HEIGHT_HALF,
  };
}

/** Convert screen (pixel) coordinates to world (grid) coordinates */
export function screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
  return {
    x: screenX / TILE_WIDTH + screenY / TILE_HEIGHT,
    y: screenY / TILE_HEIGHT - screenX / TILE_WIDTH,
  };
}

/** Convert world coordinates to screen with camera offset and zoom */
export function worldToViewport(
  worldX: number, worldY: number,
  cameraX: number, cameraY: number, zoom: number
): { x: number; y: number } {
  const screen = worldToScreen(worldX, worldY);
  return {
    x: (screen.x - cameraX) * zoom,
    y: (screen.y - cameraY) * zoom,
  };
}
```

### Pattern 2: Layered SVG Scene Composition
**What:** The isometric scene is composed of multiple SVG `<g>` groups ordered by depth (painter's algorithm). Each layer is a React component that renders at a specific z-order.
**When to use:** Scene rendering to achieve depth illusion without WebGL.
**Example:**
```typescript
// Depth ordering in isometric: objects further from camera render first
// For isometric, sort by (worldY + worldX) descending (back-to-front)

function IsometricScene({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden w-full h-full"
      style={{ perspective: 'none' }} // Orthographic -- no vanishing point
    >
      <svg
        viewBox="0 0 1920 1080"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <BeamGlowFilters />
        </defs>
        {/* Layer 0: Background (sky, distant regions) */}
        <g className="layer-background">
          {/* Parallax-shifted background elements */}
        </g>
        {/* Layer 1: Ground / platforms (sorted back-to-front) */}
        <g className="layer-platforms">
          {/* Isometric platforms sorted by depth */}
        </g>
        {/* Layer 2: Objects on platforms (optical elements, decorations) */}
        <g className="layer-objects">
          {/* Sorted by worldY + worldX for correct occlusion */}
        </g>
        {/* Layer 3: Light beams (rendered above objects for visibility) */}
        <g className="layer-beams">
          {/* Beam paths with glow filters */}
        </g>
        {/* Layer 4: Foreground overlays (particles, effects) */}
        <g className="layer-effects">
          {/* Flowing particles, ambient effects */}
        </g>
      </svg>
    </div>
  );
}
```

### Pattern 3: Polarization Visual Encoding
**What:** Maps the mathematical polarization state (from `PolarizationState` class) to visual properties: hue, shape, opacity, width.
**When to use:** Every beam segment render.
**Example:**
```typescript
// Bridge between physics engine and visual rendering
// Uses existing PolarizationState from @/core/physics/unified/

interface BeamVisualProps {
  color: string;         // HSL color encoding orientation angle
  opacity: number;       // 0-1, maps to intensity
  strokeWidth: number;   // thinner = lower intensity
  shape: 'line' | 'helix' | 'ellipse-markers'; // polarization type indicator
  handedness: 'cw' | 'ccw' | 'none'; // particle rotation direction
  glowIntensity: number; // 0-1, for feGaussianBlur stdDeviation
}

function polarizationToVisual(state: PolarizationState): BeamVisualProps {
  const stokes = state.stokes;
  const ellipse = state.ellipse;
  const intensity = stokes.s0;
  const dop = state.dop;

  // Orientation angle -> Hue (continuous, not 4-color discrete)
  // 0 deg = 0 hue (red), 90 deg = 120 hue (green), 180 deg wraps to 0
  const hue = (ellipse.orientationDeg / 180) * 360;

  // Ellipticity -> shape indicator
  // |ellipticityDeg| < 5 -> linear (straight line)
  // |ellipticityDeg| > 40 -> circular (helix pattern)
  // between -> elliptical (ellipse markers along path)
  const absEllipticity = Math.abs(ellipse.ellipticityDeg);
  const shape = absEllipticity < 5 ? 'line'
    : absEllipticity > 40 ? 'helix'
    : 'ellipse-markers';

  // Handedness from ellipticity sign
  const handedness = ellipse.ellipticityDeg > 2 ? 'cw'
    : ellipse.ellipticityDeg < -2 ? 'ccw' : 'none';

  return {
    color: `hsl(${hue}, ${80 + dop * 20}%, 55%)`,
    opacity: Math.max(0.05, intensity) * dop,  // Unpolarized light is dimmer
    strokeWidth: Math.max(1, intensity * 4),
    shape,
    handedness,
    glowIntensity: intensity * dop,
  };
}
```

### Pattern 4: Click-to-Move with Framer Motion
**What:** User clicks on the isometric scene; click coordinates are converted to world space; a movement animation smoothly pans the viewport or moves a character.
**When to use:** Primary navigation mechanic.
**Example:**
```typescript
// Source: Framer Motion docs (motion.dev/docs/animate)
import { useMotionValue, animate } from 'framer-motion';

function useClickToMove() {
  const cameraX = useMotionValue(0);
  const cameraY = useMotionValue(0);

  const handleSceneClick = useCallback((event: React.MouseEvent<SVGElement>) => {
    const svgRect = event.currentTarget.getBoundingClientRect();
    const clickScreenX = event.clientX - svgRect.left;
    const clickScreenY = event.clientY - svgRect.top;

    // Convert screen click to world coordinates
    const worldTarget = screenToWorld(clickScreenX, clickScreenY);

    // Animate camera to center on clicked location
    // useMotionValue + animate = no React re-renders during animation
    animate(cameraX, worldTarget.x, {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    });
    animate(cameraY, worldTarget.y, {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    });
  }, [cameraX, cameraY]);

  return { cameraX, cameraY, handleSceneClick };
}
```

### Pattern 5: Zustand Store with subscribeWithSelector
**What:** Scene state in Zustand with selective subscriptions to avoid unnecessary re-renders.
**When to use:** All scene state management.
**Example:**
```typescript
// Source: Context7 /pmndrs/zustand subscribeWithSelector docs
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface OdysseyWorldState {
  // Camera
  cameraX: number;
  cameraY: number;
  zoom: number;

  // Scene
  beamSegments: BeamSegmentData[];
  sceneElements: SceneElement[];

  // Navigation
  navigationTarget: { x: number; y: number } | null;
  isMoving: boolean;

  // Actions
  setCamera: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
  navigateTo: (x: number, y: number) => void;
  recalculateBeams: () => void;
}

const useOdysseyWorldStore = create<OdysseyWorldState>()(
  subscribeWithSelector((set, get) => ({
    cameraX: 0,
    cameraY: 0,
    zoom: 1,
    beamSegments: [],
    sceneElements: [],
    navigationTarget: null,
    isMoving: false,

    setCamera: (x, y) => set({ cameraX: x, cameraY: y }),
    setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(2, zoom)) }),
    navigateTo: (x, y) => set({ navigationTarget: { x, y }, isMoving: true }),
    recalculateBeams: () => {
      // Use existing unified physics engine
      // This runs synchronously, well under 16ms for <20 elements
      const elements = get().sceneElements;
      const newSegments = calculateBeamPath(elements);
      set({ beamSegments: newSegments });
    },
  }))
);
```

### Anti-Patterns to Avoid
- **Animating SVG filter properties (stdDeviation, etc.):** Causes CPU-bound repaints every frame. Set filter values statically; animate only transform and opacity.
- **Re-rendering entire SVG on camera move:** Use CSS transform on the SVG container for panning, not SVG viewBox changes. CSS transforms are GPU-composited.
- **Using Three.js/R3F for the isometric scene:** Explicitly out of scope. The project already has R3F for the 3D game; adding it here creates unnecessary bundle weight and complexity for what is fundamentally a 2D scene.
- **Discrete 4-color polarization mapping:** The existing `getPolarizationColor()` uses 4 discrete colors (red/orange/green/blue). For Odyssey, use continuous hue mapping for scientific accuracy and visual richness.
- **Global store updates on every mouse move:** Use `useMotionValue` for camera position during animations -- it bypasses React entirely. Only sync to Zustand store on animation completion.
- **Creating new odysseyStore from scratch without cleaning up the old one:** The existing `odysseyStore.ts` and `odyssey-v2/store.ts` are dead code from previous iterations. Create a clean new store; do not try to extend the old ones.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Polarization state math | Custom Jones/Mueller math | `@/core/physics/unified/PolarizationState` | 15+ module physics engine already handles all polarization types, validated with tests |
| SVG beam glow | Custom Canvas pixel shader | SVG `feGaussianBlur` + `feMerge` filter (existing `LightBeamDefs` pattern) | Browser-optimized filter pipeline, already proven in project's optical bench and 2D game |
| Spring/tween animations | Manual easing with rAF | Framer Motion `animate()` + `useMotionValue` | Handles interruption, spring physics, gesture cancellation; already in project |
| Coordinate transforms | Ad-hoc pixel math | Dedicated `isometric.ts` utility module | Isometric math is well-defined (2:1 ratio); encapsulation prevents bugs across 10+ consumers |
| Polarization color | New color scheme from scratch | Extend existing `@/lib/polarization.ts` with continuous HSL mapping | Maintains consistency with rest of PolarCraft; 4-color scheme is the base, continuous is the enhancement |
| Route setup | New router config | Existing `/odyssey/` lazy route (already configured in TanStack Router) | Route files already exist: `odyssey.index.tsx` + `odyssey.index.lazy.tsx` |
| State management patterns | Custom pub/sub system | Zustand `subscribeWithSelector` middleware | Already used in project's `gameStore.ts` and existing `odysseyStore.ts`; pattern is proven |

**Key insight:** This project already has ~80% of the technical foundation. The novel work is the isometric scene composition, the coordinate system, and the polarization visual encoding. Everything else is integration of existing systems.

## Common Pitfalls

### Pitfall 1: SVG Filter Performance on Animated Elements
**What goes wrong:** Using `feGaussianBlur` with high `stdDeviation` values (>3) on multiple animated elements tanks frame rate below 30fps. Each filter application triggers a full rasterization pass.
**Why it happens:** SVG filters are CPU-rasterized (not GPU-composited). The blur kernel computation scales with stdDeviation^2 * element_area.
**How to avoid:**
- Cap `stdDeviation` at 1.5-2.0 for beam glow filters
- Use a single shared `<filter>` definition in `<defs>`, referenced by all beams
- For the outer glow halo, use a wider semi-transparent stroke (existing `LightBeamSVG` pattern) instead of a second filter pass
- If >5 beams are visible simultaneously, consider a single Canvas 2D overlay for all glow effects
**Warning signs:** Frame drops when zooming into beam-dense areas; high CPU usage in browser DevTools Performance tab under "Rendering > Paint"

### Pitfall 2: Click Detection in Isometric Space
**What goes wrong:** Mouse clicks land on the wrong tile/location because the conversion between screen coordinates and world coordinates doesn't account for camera offset, zoom level, or SVG viewBox scaling.
**Why it happens:** Multiple coordinate spaces are involved: browser client coordinates -> SVG viewport coordinates -> isometric world coordinates. Missing any transform in the chain produces off-by-one-tile errors.
**How to avoid:**
- Always use `SVGElement.getBoundingClientRect()` for client-to-SVG conversion
- Apply inverse camera transform before isometric conversion
- Write unit tests for coordinate round-trips: `screenToWorld(worldToScreen(x, y))` must equal `(x, y)` within epsilon
- Use `event.currentTarget` (not `event.target`) to get the SVG root for coordinate calculation
**Warning signs:** Clicking near tile edges moves to wrong location; click accuracy degrades at high zoom levels

### Pitfall 3: React Re-Renders Killing 60fps During Camera Pan
**What goes wrong:** Moving camera position through React state causes the entire SVG scene to re-render on every frame, dropping to <20fps with 100+ SVG elements.
**Why it happens:** Zustand state changes trigger React re-renders. Camera pan at 60fps = 60 state updates/second = 60 full re-renders.
**How to avoid:**
- Use Framer Motion's `useMotionValue` for camera position during animation -- it updates DOM directly without React re-render
- Apply camera offset via CSS `transform: translate(x, y)` on the SVG container (GPU-composited)
- Only sync camera position to Zustand store when animation completes (for minimap, click detection, etc.)
- Use `React.memo` on static scene elements (platforms, decorations) with stable keys
**Warning signs:** DevTools Profiler showing 60+ renders/second during pan; visible jank when dragging

### Pitfall 4: Memory Leaks on SPA Navigation
**What goes wrong:** Navigating away from `/odyssey/` and back causes memory growth because animation timers, event listeners, or Zustand subscriptions are not cleaned up.
**Why it happens:** `requestAnimationFrame` loops, `setTimeout` chains (for particle animation), and manual DOM event listeners persist after component unmount if not properly cleaned up.
**How to avoid:**
- All `requestAnimationFrame` loops must use a ref-based cancel pattern with `useEffect` cleanup
- All `useMotionValue` instances are automatically cleaned up by React
- Zustand subscriptions outside React must call the returned unsubscribe function in cleanup
- Test by navigating /odyssey/ -> /games/ -> /odyssey/ 10 times and checking memory in DevTools
**Warning signs:** Chrome DevTools Memory tab showing monotonically increasing heap size; "Detached DOM tree" warnings

### Pitfall 5: Isometric Depth Ordering Complexity
**What goes wrong:** Objects appear in front of/behind each other incorrectly, breaking the 3D illusion. A beam that should pass behind a platform renders on top of it.
**Why it happens:** Isometric rendering uses painter's algorithm (back-to-front), and sorting by a single axis is insufficient when objects span multiple tiles or have different heights.
**How to avoid:**
- Sort scene elements by `(worldY + worldX)` for base depth ordering (back-to-front in isometric)
- For multi-tile objects, use the object's front-most tile for sort key
- Light beams render in a dedicated layer ABOVE scene objects (they are self-luminous, occlusion would be wrong)
- For height levels, add `worldZ * DEPTH_MULTIPLIER` to the sort key
**Warning signs:** Visual "popping" where elements switch order during pan; beams disappearing behind platforms

### Pitfall 6: Bright Background vs. Beam Visibility
**What goes wrong:** Light beams (which are bright/light-colored) are invisible or washed out against the bright laboratory background that the user specified.
**Why it happens:** Additive glow effects assume dark background. On white/light backgrounds, light-colored beams have no contrast.
**How to avoid:**
- Use saturated, distinct hues for beams (not white/yellow)
- Beam body should be a semi-opaque colored stroke, not a transparent glow
- The glow effect is a SOFT HALO around a solid core, not the beam itself
- Add a very subtle dark outline (0.5px, low opacity) around the glow region as a "light shadow" separator
- Test beam visibility against `#F5F5F0` (warm white), `#E8EDF2` (cool white) backgrounds
**Warning signs:** Beams only visible when zoomed in; users can't distinguish beam from background at overview zoom

## Code Examples

Verified patterns from official sources and existing codebase:

### CSS Isometric Transform (for container)
```css
/* Source: Web research on CSS 3D isometric transforms */
/* Note: We do NOT use CSS 3D transforms on the SVG itself.
   Instead, the SVG is drawn in pre-computed isometric coordinates.
   CSS transforms are only for parallax layers and depth effects. */

.isometric-container {
  /* Orthographic projection -- no vanishing point */
  perspective: none;
  transform-style: preserve-3d;
}

.parallax-background {
  /* Slight offset for depth illusion during pan */
  transform: translateZ(-100px) scale(1.1);
}

.parallax-foreground {
  transform: translateZ(50px) scale(0.95);
}
```

### SVG Beam with Glow (extending existing LightBeamSVG pattern)
```typescript
// Source: Existing src/components/shared/optical/LightBeamSVG.tsx + new encoding

// Shared filter definition -- ONE instance, all beams reference it
function BeamGlowFilters() {
  return (
    <defs>
      {/* Soft glow -- capped at stdDeviation=1.5 for performance */}
      <filter id="beam-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}
```

### Beam Particle Flow with requestAnimationFrame
```typescript
// Source: Performance best practice -- rAF instead of Framer Motion for many particles

function useBeamParticles(
  pathPoints: { x: number; y: number }[],
  speed: number,
  count: number
) {
  const particlesRef = useRef<{ offset: number }[]>(
    Array.from({ length: count }, (_, i) => ({ offset: i / count }))
  );
  const rafRef = useRef<number>(0);
  const svgGroupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let lastTime = 0;
    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Update particle positions along path
      for (const p of particlesRef.current) {
        p.offset = (p.offset + dt * speed) % 1;
      }

      // Direct DOM mutation -- no React re-render
      if (svgGroupRef.current) {
        const circles = svgGroupRef.current.children;
        for (let i = 0; i < circles.length; i++) {
          const pos = getPointAtOffset(pathPoints, particlesRef.current[i].offset);
          (circles[i] as SVGCircleElement).setAttribute('cx', String(pos.x));
          (circles[i] as SVGCircleElement).setAttribute('cy', String(pos.y));
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current); // Cleanup!
  }, [pathPoints, speed, count]);

  return svgGroupRef;
}
```

### Scroll-Wheel Zoom Handler
```typescript
// Source: Standard wheel event pattern for zoom

function useZoomHandler(
  svgRef: React.RefObject<SVGSVGElement>,
  onZoom: (delta: number, centerX: number, centerY: number) => void
) {
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Prevent page scroll
      const rect = svg.getBoundingClientRect();
      const centerX = e.clientX - rect.left;
      const centerY = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? -0.1 : 0.1; // Zoom in/out
      onZoom(delta, centerX, centerY);
    };

    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheel);
  }, [svgRef, onZoom]);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion v6-10 `motion.svg` | Framer Motion v12 `motion.svg` with `useMotionValue` | 2024-2025 | Same API, better performance; `useMotionValue` avoids re-renders |
| Zustand v4 `subscribeWithSelector` import | Zustand v5 same middleware, TypeScript generics improved | 2024 | Cleaner types, same usage pattern |
| TanStack Router v1 lazy routes | Same (`createLazyFileRoute`) | Stable since v1 | Already configured in project |
| SVG filters universally slow | Browser SVG filter GPU acceleration improving | 2024-2025 | `feGaussianBlur` is faster in modern Chrome/Firefox/Safari but still not GPU-composited on all platforms |
| Three.js for isometric | 2D SVG/CSS isometric is mature alternative | Always available | 2D approach chosen for this project for visual polish and performance |

**Deprecated/outdated:**
- Previous odyssey iterations (v0-v3) all used different approaches; all are effectively dead code and should not be extended
- `odysseyStore.ts` in current form is designed for the old 3D portal transition model; needs replacement not modification
- `odyssey-v2/store.ts` uses `benchPhysicsCalc` bridge; new store should use `@/core/physics/unified/` directly

## Discretion Recommendations

Based on research findings, here are recommendations for areas marked as Claude's discretion:

### Isometric Angle: Use True Isometric (30 degree / 2:1 Ratio)
**Recommendation:** Use the standard 2:1 isometric tile ratio (effectively ~26.57 degree from horizontal, commonly called "30 degree isometric"). This is the most recognizable isometric style (used by Monument Valley, SimCity, etc.), has the most tooling/documentation support, and the coordinate math is cleanest with integer pixel values.

### Background Visual Treatment: Warm Gradient with Subtle Grid
**Recommendation:** A warm off-white gradient (`#FAFAF5` to `#F0EDE6`) with a very faint isometric grid pattern (2% opacity). This creates depth without competing with optical elements. The grid also subtly communicates the navigable space.

### Character vs. Viewport Movement: Small Light-Particle Avatar
**Recommendation:** Include a small, glowing particle/orb avatar (not a human character). It serves as a focal point, provides immediate feedback for click-to-move, and thematically fits as a "photon explorer." When the avatar reaches a new location, the camera follows. This is more engaging than bare viewport panning and lighter than a full character model.

### Particle Animation Style: Small Dots Flowing Along Path
**Recommendation:** Small circular dots (r=2-3px) flowing along the beam path at constant speed. Simpler than wave patterns, performant with rAF direct DOM mutation, and clearly communicates propagation direction. Particle color matches beam color at reduced opacity.

### Beam Splitting Scope for Phase 1: Single Beam Only
**Recommendation:** Phase 1 should render a single beam from a single source. Beam splitting (through beam splitters, birefringent crystals) adds significant complexity to the visual encoding (multiple beam paths, coherence tracking, interference). Defer to Phase 2 when optical element interaction is introduced. The single beam demonstrates the polarization encoding system effectively.

### Number of Initial Interactive Elements: 3 Elements
**Recommendation:** One light source (always active, emitting a polarized beam) + two pre-placed optical elements (e.g., a polarizer and a quarter-wave plate) that the beam passes through. The student sees the beam change as it passes through each element. Elements are NOT movable in Phase 1 (that's Phase 2), but they have subtle idle animations (gentle wobble, glow) indicating they are special objects. This gives enough visual variety to demonstrate the polarization encoding without requiring interaction code.

### SVG vs. Canvas for Beam Glow: SVG First, Canvas Fallback
**Recommendation:** Start with SVG `feGaussianBlur` (stdDeviation capped at 1.5). The existing `LightBeamSVG` component already uses this pattern successfully. With only 1-3 beams in Phase 1, SVG filters will easily maintain 60fps. If profiling shows issues (unlikely with <5 beams), add a Canvas 2D overlay for glow only. This avoids premature optimization.

### Polarization Visual Encoding: Continuous HSL + Shape
**Recommendation:** Use continuous HSL hue mapping for orientation angle (0-180 degree -> 0-360 hue), with shape variation for polarization type (straight line = linear, helix = circular, ellipse markers = elliptical), and opacity/width for intensity. This is more scientifically accurate than the existing 4-color discrete mapping and more visually rich. The existing `PolarizationState.ellipse` property provides all needed parameters. See Pattern 3 in Architecture Patterns above for the detailed mapping.

## Open Questions

1. **Exact scene content and layout**
   - What we know: It's a "bright, clean optical laboratory" with "multi-level isometric platforms" and "optical elements as primary visual elements"
   - What's unclear: The specific arrangement of platforms, where the light source sits, what decorative elements fill the scene, how many platforms/levels
   - Recommendation: The planner should define a simple 5x5 or 7x7 walkable area with 2-3 height levels. Detailed scene design (decorative elements, specific aesthetic choices) can be iteratively refined during implementation. Start with structural layout, add decoration incrementally.

2. **"Impossible geometry" expressed through optics**
   - What we know: Monument Valley impossible geometry should be expressed through "light bending through prisms, reflecting at angles that seem to defy spatial logic"
   - What's unclear: How to visually achieve this in Phase 1 with only a single beam and pre-placed elements
   - Recommendation: For Phase 1, have the beam path cross between height levels (going "up" through a prism on one level and "down" to another) creating a visually impossible-looking path that is physically explained by refraction. This establishes the visual language without requiring interaction. Full impossible geometry expression expands in Phase 2+.

3. **Scene edges showing distant regions**
   - What we know: Edges should "show distant views of neighboring areas (preparing for Phase 3)"
   - What's unclear: How detailed these distant views need to be in Phase 1
   - Recommendation: Use simple silhouette/outline SVG shapes at reduced opacity on the scene boundaries. Just enough to suggest "there's more world out there." These are static decorative elements, not functional.

4. **Mobile performance baseline**
   - What we know: Target is 30fps+ on mobile, 60fps desktop
   - What's unclear: Whether SVG filters (even capped) maintain 30fps on mobile Safari/Chrome
   - Recommendation: Desktop-first for Phase 1 (TECH-05). Profile on a mid-range phone after desktop implementation is solid. If mobile filters are slow, the Canvas 2D glow fallback becomes the mobile rendering path.

## Sources

### Primary (HIGH confidence)
- Context7 `/websites/motion_dev` - SVG animation, useMotionValue performance, drag gesture handling
- Context7 `/pmndrs/zustand` - subscribeWithSelector middleware patterns, TypeScript usage
- Context7 `/tanstack/router` - createLazyFileRoute, cleanup patterns, code splitting
- Existing codebase `src/core/physics/unified/` - Complete physics engine API surface, PolarizationState class
- Existing codebase `src/components/shared/optical/LightBeamSVG.tsx` - Beam rendering with feGaussianBlur and flow animation pattern
- Existing codebase `src/lib/polarization.ts` - Polarization color mapping utilities
- Existing codebase `src/stores/odysseyStore.ts` - Zustand store pattern with subscribeWithSelector

### Secondary (MEDIUM confidence)
- [Isometric Tiles Math](https://clintbellanger.net/articles/isometric_math/) - Verified isometric coordinate conversion formulas
- [SVG Animation Encyclopedia 2025](https://www.svgai.org/blog/research/svg-animation-encyclopedia-complete-guide) - SVG animation performance benchmarks (CSS transform 60fps / CSS fill 58fps desktop)
- [Pikuma Isometric Projection](https://pikuma.com/blog/isometric-projection-in-games) - Isometric projection fundamentals in game development
- [Envato Tuts+ Isometric Layout](https://webdesign.tutsplus.com/create-an-isometric-layout-with-3d-transforms--cms-27134t) - CSS 3D transform values for isometric (rotateY 45deg, rotateX 35.264deg, scaleY 0.864)
- [MDN feGaussianBlur](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feGaussianBlur) - SVG filter specification and stdDeviation behavior

### Tertiary (LOW confidence)
- General web search results on SVG filter GPU acceleration trends (browsers improving but not universally GPU-composited)
- GitHub isometric library survey (react-isometric-projection, isometric-css) -- useful for patterns but likely not worth adding as dependencies

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in the project, versions verified, API patterns confirmed via Context7
- Architecture: HIGH - Isometric coordinate math is well-established, SVG layering is proven in existing codebase, patterns adapted from existing optical bench and 2D game
- Pitfalls: HIGH - Performance pitfalls identified from both web research and existing project experience (LightBeamSVG, AmbientParticles already demonstrate the patterns and their limits)
- Visual encoding: MEDIUM - The continuous HSL mapping is a novel design for this project; the physics-to-visual bridge is well-supported by the existing PolarizationState API but the specific visual result needs iteration during implementation
- Isometric scene design: MEDIUM - The coordinate math is certain, but the artistic composition (how the laboratory looks, platform arrangement, decorative detail level) requires design iteration

**Research date:** 2026-02-20
**Valid until:** 2026-03-20 (stable domain -- 2D SVG/CSS patterns and existing physics engine are not changing)
