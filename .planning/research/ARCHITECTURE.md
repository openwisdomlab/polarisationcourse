# Architecture Research

**Domain:** Web-based open-world discovery learning for polarization optics
**Researched:** 2026-02-20
**Confidence:** MEDIUM-HIGH (HIGH for R3F patterns, MEDIUM for open-world specifics -- few production web open-worlds exist as references)

## System Overview

```
+---------------------------------------------------------------------+
|                        Presentation Layer                            |
|  +-------------+  +------------------+  +-------------------------+ |
|  | ExplorerHUD |  | TheoryPortal     |  | MiniMap / ProgressUI    | |
|  | (HTML/CSS)  |  | (Html in R3F     |  | (HTML overlay)          | |
|  |             |  |  or RenderTexture)|  |                         | |
|  +------+------+  +--------+---------+  +------------+------------+ |
+---------+-------------------+-----------------------------+---------+
          |                   |                             |
+---------------------------------------------------------------------+
|                        Scene Layer (R3F Canvas)                       |
|  +-------------+  +------------------+  +-------------------------+ |
|  | Camera      |  | RegionManager    |  | LightBeamRenderer       | |
|  | Controller  |  | (load/unload     |  | (custom shaders,        | |
|  | (free move) |  |  region groups)  |  |  data textures)         | |
|  +------+------+  +--------+---------+  +------------+------------+ |
|         |                  |                          |              |
|  +------+------+  +-------+----------+  +------------+------------+ |
|  | Environment |  | InteractionLayer |  | OpticalElementMeshes    | |
|  | (terrain,   |  | (raycasting,     |  | (3D polarizers,         | |
|  |  skybox,    |  |  drag handlers,  |  |  waveplates, crystals,  | |
|  |  atmosphere)|  |  focus zones)    |  |  surfaces -- instanced) | |
|  +-------------+  +------------------+  +-------------------------+ |
+---------+-------------------+-----------------------------+---------+
          |                   |                             |
+---------------------------------------------------------------------+
|                        State Layer (Zustand)                         |
|  +------------------+  +------------------+  +--------------------+ |
|  | WorldStore       |  | ExplorationStore |  | PhysicsResultStore | |
|  | (regions,        |  | (discovered,     |  | (beam segments,    | |
|  |  elements,       |  |  progress,       |  |  visual params,    | |
|  |  environment)    |  |  journal,        |  |  Stokes/Jones      | |
|  |                  |  |  unlocked areas) |  |  per-segment)      | |
|  +--------+---------+  +--------+---------+  +---------+----------+ |
+----------+----------------------+---------------------------+-------+
           |                      |                           |
+---------------------------------------------------------------------+
|                        Physics Layer (Pure)                           |
|  +-------------------+  +-------------------+  +------------------+ |
|  | Unified Physics   |  | LightTracer       |  | PhysicsInterp.   | |
|  | (Mueller/Jones/   |  | (BFS ray tracing, |  | (semantic bridge: | |
|  |  Stokes/Fresnel/  |  |  surface inter-   |  |  physics -> human | |
|  |  Coherency)       |  |  section, split)  |  |  readable desc.)  | |
|  +-------------------+  +-------------------+  +------------------+ |
+---------------------------------------------------------------------+
|                        Data Layer                                    |
|  +-------------------+  +-------------------+  +------------------+ |
|  | RegionDefinitions |  | ElementCatalog    |  | ProgressPersist  | |
|  | (area geometry,   |  | (optical device   |  | (localStorage +  | |
|  |  connections,     |  |  templates, spawn |  |  optional cloud)  | |
|  |  environment cfg) |  |  configs)         |  |                  | |
|  +-------------------+  +-------------------+  +------------------+ |
+---------------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| CameraController | Free WASD/mouse exploration, smooth transitions, zone-aware FOV | Custom hook wrapping `camera-controls` or custom `useFrame` logic; NOT ecctrl (no character needed) |
| RegionManager | Load/unload region scene graphs based on camera proximity | React component using `useMemo` + visibility flags per region group |
| LightBeamRenderer | Visualize light beams with polarization-encoded shaders | Custom ShaderMaterial with data textures (existing beam.glsl.ts pattern) |
| OpticalElementMeshes | Render interactive optical devices (polarizers, waveplates, crystals) | Instanced where possible; individual where interactive |
| InteractionLayer | Raycasting, drag-to-rotate optical elements, click-to-inspect | `useRaycast` + pointer event handlers on R3F meshes |
| ExplorerHUD | Minimal UI: compass, current area hint, interaction prompts | HTML overlay (not drei `<Html>` -- screen-space, not world-space) |
| TheoryPortal | Embed existing 2D demo components when player inspects deeply | drei `<Html occlude="blending">` or `<RenderTexture>` on in-world screen meshes |
| WorldStore | Source of truth for all optical elements, their positions, properties | Zustand store with `subscribeWithSelector` |
| ExplorationStore | Player progress: discovered concepts, visited areas, journal entries | Zustand store with `persist` middleware (localStorage) |
| PhysicsResultStore | Cached beam tracing results, derived visual parameters per segment | Zustand store, recalculated on element mutation (existing v2/v3 pattern) |
| Unified Physics | All polarization calculations: Mueller, Jones, Stokes, Fresnel, scattering | Existing `@/core/physics/unified/` -- no changes needed |
| LightTracer | BFS ray propagation through optical element chains | Existing `LightTracer` from unified physics -- wraps for world use |
| PhysicsInterpreter | Translate physics results into human-readable descriptions | Existing `PhysicsInterpreter` -- feeds theory panel text |
| RegionDefinitions | Static data defining world areas, connections, environment configs | TypeScript data modules, lazy-importable |
| ElementCatalog | Templates for optical devices that can be placed in the world | TypeScript config extending existing `BlockType` patterns |
| ProgressPersist | Save/restore exploration state across sessions | `zustand/persist` with localStorage adapter |

## Recommended Project Structure

```
src/
├── components/
│   └── odyssey-world/              # The open world module
│       ├── OdysseyWorld.tsx         # Root: Canvas + HUD shell
│       ├── WorldScene.tsx           # R3F scene root inside Canvas
│       │
│       ├── camera/
│       │   ├── ExplorationCamera.ts # Free-movement camera controller
│       │   └── CameraZones.ts       # Zone-aware camera behavior (FOV, speed, constraints)
│       │
│       ├── regions/
│       │   ├── RegionManager.tsx     # Load/unload regions by proximity
│       │   ├── RegionBoundary.tsx    # Soft transition between regions
│       │   ├── types.ts             # RegionConfig, AreaConnection interfaces
│       │   └── definitions/         # Per-region data files
│       │       ├── polarization-garden.ts
│       │       ├── crystal-cavern.ts
│       │       ├── reflection-cliffs.ts
│       │       ├── scattering-sky.ts
│       │       ├── birefringent-forest.ts
│       │       └── mueller-observatory.ts
│       │
│       ├── elements/
│       │   ├── OpticalElement3D.tsx   # Base interactive optical element
│       │   ├── Polarizer3D.tsx        # Extends base with polarizer behavior
│       │   ├── Waveplate3D.tsx        # Quarter/half wave plate
│       │   ├── Crystal3D.tsx          # Birefringent crystal
│       │   ├── Surface3D.tsx          # Reflective/refractive surface
│       │   ├── LightSource3D.tsx      # Placeable light emitter
│       │   └── ElementInteraction.tsx # Shared drag/rotate/inspect logic
│       │
│       ├── beams/
│       │   ├── WorldBeamSystem.tsx    # Manages all beams in the world
│       │   ├── BeamSegment.tsx        # Single beam segment mesh
│       │   ├── BeamShader.ts          # Polarization-aware beam shader (evolves v2 shader)
│       │   └── BeamDataTexture.ts     # Physics-to-texture encoder
│       │
│       ├── environment/
│       │   ├── Terrain.tsx            # Ground plane / landscape geometry
│       │   ├── SkySystem.tsx          # Dynamic sky with polarization-aware scattering
│       │   ├── Atmosphere.tsx         # Fog, ambient light, environment maps
│       │   └── EnvironmentEffects.tsx # Post-processing: bloom, tone mapping
│       │
│       ├── theory/
│       │   ├── TheoryPortal.tsx       # In-world theory display (embeds existing demos)
│       │   ├── DemoEmbed.tsx          # Adapter: wraps existing 2D demo in Html/RenderTexture
│       │   ├── InsightPopup.tsx       # Brief discovery notification
│       │   └── JournalEntry.tsx       # Detailed theory accessible from journal
│       │
│       ├── interaction/
│       │   ├── InteractionManager.tsx # Central raycasting + pointer event routing
│       │   ├── PlacementSystem.tsx    # Drop optical elements into the world
│       │   ├── RotationGizmo.tsx      # Visual rotation handle for elements
│       │   └── FocusZone.tsx          # Proximity-triggered interaction areas
│       │
│       ├── hud/
│       │   ├── WorldHUD.tsx           # Root HUD overlay
│       │   ├── Compass.tsx            # Directional awareness
│       │   ├── AreaIndicator.tsx      # Current region name/theme
│       │   ├── ToolPalette.tsx        # Available optical elements to place
│       │   └── DiscoveryNotification.tsx  # Toast for new discoveries
│       │
│       ├── store/
│       │   ├── worldStore.ts          # World state: elements, beams, environment
│       │   ├── explorationStore.ts    # Progress: discoveries, visited, journal
│       │   └── cameraStore.ts         # Camera position, current region, movement state
│       │
│       └── hooks/
│           ├── useWorldPhysics.ts     # Bridge: worldStore elements -> physics calc -> beam segments
│           ├── useRegionProximity.ts  # Which regions are near camera
│           ├── useElementInteraction.ts # Shared pointer/keyboard interaction logic
│           └── useCameraMovement.ts   # WASD + mouse movement with delta-time
│
├── core/physics/unified/             # EXISTING -- no changes needed
├── stores/                           # EXISTING stores (gameStore, etc.)
└── components/demos/                 # EXISTING 23 demo components -- reused as-is
```

### Structure Rationale

- **`odyssey-world/`**: Self-contained module, parallel to existing `odyssey/`, `odyssey-v2/`, `odyssey-v3/`. Does not replace or modify them; the old versions remain as reference and can be removed later.
- **`regions/`**: Each region is a separate data file, lazy-loadable. The RegionManager handles mounting/unmounting. This is the core of the open-world feeling.
- **`elements/`**: Each optical device type gets its own component but shares interaction logic via `ElementInteraction.tsx`. This matches the existing pattern in `odyssey-v3/optics/`.
- **`beams/`**: Evolves the existing v2 beam shader pattern (data texture approach) but extends it to handle multiple independent beams in different regions rather than a single linear beam.
- **`theory/`**: The adapter layer. Wraps existing 23 demo components inside 3D world displays without modifying the demos themselves. This is critical -- demos stay untouched.
- **`store/`**: Three focused stores rather than one monolithic store. Follows the existing codebase pattern of purpose-specific Zustand stores.
- **`hooks/`**: Physics bridge hook (`useWorldPhysics`) is the most critical -- it connects worldStore element mutations to physics calculations to beam visual updates.

## Architectural Patterns

### Pattern 1: Region-Based Scene Partitioning

**What:** Divide the world into 6-8 regions, each a React component tree that mounts/unmounts based on camera distance. Not a traditional chunk system (the world is not infinite) -- think of it as "rooms with soft walls."

**When to use:** Always -- this is the fundamental structure.

**Trade-offs:**
- Pro: Only 2-3 region component trees are mounted at once, keeping draw calls low
- Pro: Natural content organization matches the 6 physics units
- Pro: React Suspense handles lazy loading per region
- Con: Transitions between regions need visual smoothing (fog, blend)
- Con: Beams that cross region boundaries need special handling

**Example:**
```typescript
// regions/types.ts
interface RegionConfig {
  id: string
  name: string
  unitIds: UnitId[]              // Which physics units this region covers
  center: [number, number, number]
  radius: number                  // Activation radius from center
  environment: {
    fog: { color: string; near: number; far: number }
    ambientColor: string
    skyPreset: string
  }
  connections: Array<{
    targetRegionId: string
    direction: [number, number, number]
    transitionType: 'fade' | 'corridor' | 'open'
  }>
  defaultElements: ElementSpawn[] // Optical elements present by default
  discoveryNodes: DiscoveryNode[] // What physics concepts live here
}

// RegionManager.tsx
function RegionManager() {
  const cameraPos = useCameraStore(s => s.position)
  const regions = useWorldStore(s => s.regions)

  // Calculate which regions should be active (within 1.5x radius)
  const activeRegionIds = useMemo(() =>
    regions
      .filter(r => distance(cameraPos, r.center) < r.radius * 1.5)
      .map(r => r.id),
    [cameraPos, regions]
  )

  return (
    <>
      {regions.map(region => (
        <RegionGroup
          key={region.id}
          config={region}
          active={activeRegionIds.includes(region.id)}
        />
      ))}
    </>
  )
}

// RegionGroup mounts/unmounts its subtree
function RegionGroup({ config, active }: { config: RegionConfig; active: boolean }) {
  if (!active) return null
  return (
    <Suspense fallback={<RegionPlaceholder config={config} />}>
      <group position={config.center}>
        <RegionTerrain config={config} />
        <RegionElements config={config} />
        <RegionAtmosphere config={config} />
      </group>
    </Suspense>
  )
}
```

### Pattern 2: Physics-Visual Pipeline (Reactive Beam Tracing)

**What:** When any optical element changes (rotation, position, property), the physics engine re-traces affected beams and pushes results to a data texture consumed by the beam shader. This is a unidirectional data flow: `Element Mutation -> Store Update -> Physics Calc -> Beam Segments -> Shader Uniforms`.

**When to use:** Every frame that an element changes (drag operations), or on mount/unmount.

**Trade-offs:**
- Pro: Decouples physics from rendering -- physics runs at its own pace
- Pro: Existing unified physics engine is already designed for this
- Pro: Data texture approach (from v2 shader) handles per-segment visualization efficiently
- Con: Full retrace on every element change may be expensive with many elements
- Con: Need debouncing or throttling during drag operations

**Example:**
```typescript
// hooks/useWorldPhysics.ts
function useWorldPhysics() {
  const elements = useWorldStore(s => s.elements)
  const setBeamSegments = useWorldStore(s => s.setBeamSegments)

  // Debounced retrace when elements change
  useEffect(() => {
    const timer = setTimeout(() => {
      // Group elements by beam path (each light source starts a path)
      const sources = elements.filter(e => e.type === 'source')

      const allSegments: BeamSegment[] = []
      for (const source of sources) {
        // Use existing LightTracer from unified physics
        const tracer = createTracer({ maxBounces: 20, minIntensity: 0.01 })
        const ray = createLinearSource({
          id: source.id,
          position: new Vector3(...source.position),
          direction: new Vector3(...source.direction),
          intensity: source.properties.intensity
        }, source.properties.polarizationAngle)

        // Collect optical surfaces from nearby elements
        const surfaces = elements
          .filter(e => e.type !== 'source')
          .map(e => elementToOpticalSurface(e))

        const result = tracer.traceLinear(ray, surfaces)
        allSegments.push(...result.segments.map(segmentToVisual))
      }

      setBeamSegments(allSegments)
    }, 16) // ~60fps throttle

    return () => clearTimeout(timer)
  }, [elements, setBeamSegments])
}
```

### Pattern 3: Hybrid 2D-in-3D Embedding

**What:** Existing 2D demo components (SVG, Canvas, HTML) are embedded into the 3D world using drei's `<Html>` component with `occlude="blending"` for world-integrated panels, or using `<RenderTexture>` for demos projected onto in-world screen meshes (like a holographic display or a glowing tablet in the world).

**When to use:** When the player enters a "deep dive" zone and wants quantitative/theoretical detail beyond what the 3D environment shows.

**Trade-offs:**
- Pro: Zero modification to existing 23 demo components
- Pro: `<Html occlude="blending">` makes the panel feel like part of the 3D world
- Pro: `<RenderTexture>` renders React content as a true 3D texture (no DOM overlay)
- Con: `<Html>` can blur on some devices in `transform` mode
- Con: `<RenderTexture>` requires fixed dimensions and has limited interactivity
- Con: Multiple simultaneous `<Html>` elements degrade performance

**Recommended approach:** Use `<Html>` for the primary theory portal (one at a time, fullscreen-ish panel). Use simple 3D geometry + shaders for in-world visual cues. Never have more than 1-2 `<Html>` elements active simultaneously.

**Example:**
```typescript
// theory/TheoryPortal.tsx
function TheoryPortal({ stationConfig }: { stationConfig: DemoStationConfig }) {
  const DemoComponent = stationConfig.component

  return (
    <Html
      occlude="blending"
      transform
      distanceFactor={10}
      position={[0, 2, 0]}
      center
      className="pointer-events-auto"
    >
      <div className="w-[800px] h-[600px] bg-gray-900/90 backdrop-blur rounded-xl p-6 overflow-auto">
        <Suspense fallback={<TheoryLoadingPlaceholder />}>
          <DemoComponent difficultyLevel="foundation" />
        </Suspense>
        <TheoryText theory={stationConfig.theory} />
      </div>
    </Html>
  )
}
```

### Pattern 4: Camera-as-Explorer (No Character Model)

**What:** The camera IS the player. No visible character, no physics body. Movement uses WASD keys with smooth acceleration/deceleration. Mouse controls look direction. This matches The Witness's first-person perspective and keeps the focus on the environment, not on an avatar.

**When to use:** The primary (and only) movement system.

**Trade-offs:**
- Pro: Simplest implementation -- no character model, animation, collision mesh
- Pro: Maximum immersion -- player IS the observer
- Pro: Matches educational context (you are a scientist exploring)
- Con: No physics collision (player can walk through walls) -- must use soft boundaries
- Con: No jump/gravity -- vertical movement needs constraints
- Con: Motion sickness risk at high speeds -- must limit velocity and add smooth damping

**Why not ecctrl/rapier:** Ecctrl requires a visible character capsule and rapier physics. This adds complexity (physics WASM, collision meshes for all terrain) without benefit. The world is not physics-simulated for the player -- only light obeys physics. Soft zone boundaries (camera speed reduction + visual fog) are simpler and fit the contemplative exploration style.

**Example:**
```typescript
// camera/ExplorationCamera.ts
function ExplorationCamera() {
  const { camera, gl } = useThree()
  const velocity = useRef(new THREE.Vector3())
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const keys = useKeyboardControls()

  useFrame((_, delta) => {
    // Mouse look (when pointer locked)
    // ... apply mouse deltas to euler, then to camera quaternion

    // WASD movement relative to camera facing
    const moveDir = new THREE.Vector3()
    if (keys.forward)  moveDir.z -= 1
    if (keys.backward) moveDir.z += 1
    if (keys.left)     moveDir.x -= 1
    if (keys.right)    moveDir.x += 1
    moveDir.normalize().applyQuaternion(camera.quaternion)
    moveDir.y = 0 // Lock to ground plane

    // Smooth acceleration
    const ACCELERATION = 8
    const DAMPING = 5
    const MAX_SPEED = 6

    velocity.current.add(moveDir.multiplyScalar(ACCELERATION * delta))
    velocity.current.multiplyScalar(1 - DAMPING * delta)
    velocity.current.clampLength(0, MAX_SPEED)

    camera.position.add(velocity.current.clone().multiplyScalar(delta))

    // Soft height constraint (hover at fixed Y)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 2.0, 4, delta)
  })

  return null
}
```

### Pattern 5: Discovery State Machine

**What:** Each physics concept has a discovery state: `hidden -> hinted -> discovered -> mastered`. The world reveals content progressively based on what the player has done. This is NOT a quest/task system -- it is a passive tracker that responds to player experimentation.

**When to use:** Drives progressive content revelation and journal entries.

**Trade-offs:**
- Pro: No explicit "complete this task" -- matches discovery-based learning philosophy
- Pro: Simple state machine, easy to persist and restore
- Pro: Can drive subtle environmental changes (new beam appears when concept discovered)
- Con: Player may miss content if not exploring thoroughly
- Con: Needs careful tuning of what triggers transitions

**Example:**
```typescript
// store/explorationStore.ts
interface DiscoveryNode {
  conceptId: string          // e.g. 'malus-law', 'brewster-angle'
  state: 'hidden' | 'hinted' | 'discovered' | 'mastered'
  prerequisites: string[]    // conceptIds that must be 'discovered' first
  regionId: string           // where this lives in the world
  triggerCondition: TriggerCondition // what causes state transitions
}

type TriggerCondition =
  | { type: 'proximity'; position: [number, number, number]; radius: number }
  | { type: 'element-interaction'; elementType: string; action: string }
  | { type: 'beam-result'; condition: (segments: BeamSegment[]) => boolean }
  | { type: 'observation-time'; minSeconds: number }

interface ExplorationState {
  discoveries: Map<string, DiscoveryNode>
  journal: JournalEntry[]
  visitedRegions: Set<string>
  totalDiscoveryCount: number

  // Actions
  checkTriggers: (context: TriggerContext) => void
  advanceDiscovery: (conceptId: string) => void
}
```

## Data Flow

### Primary Loop: Element Interaction -> Visual Feedback

```
Player drags polarizer rotation handle
    |
    v
InteractionManager dispatches updateElement(id, { rotation: newAngle })
    |
    v
worldStore.elements updated (Zustand set)
    |
    v
useWorldPhysics hook reacts (subscribeWithSelector)
    |
    v
LightTracer re-traces affected beam paths
    |   uses: MuellerMatrix, PolarizationState, FresnelSolver, etc.
    |   from: @/core/physics/unified/
    |
    v
PhysicsResultStore.beamSegments updated
    |
    v
BeamShader uniforms updated (data texture re-encoded)
    |
    v
Visual: beam color, intensity, DoP change in real-time
    |
    v
ExplorationStore.checkTriggers evaluates beam result conditions
    |
    v
(Optional) Discovery state advances, journal entry added, new hint revealed
```

### Secondary Loop: Camera Movement -> Region Loading

```
Player moves camera (WASD/mouse)
    |
    v
cameraStore.position updated each frame
    |
    v
useRegionProximity calculates active region set
    |
    v
RegionManager conditionally mounts/unmounts region components
    |   React Suspense lazy-loads region definitions
    |
    v
Mounted region spawns its default elements into worldStore
Unmounted region removes its elements from worldStore
    |
    v
useWorldPhysics recalculates beams (fewer elements = faster)
```

### Tertiary Loop: Discovery -> Content Revelation

```
ExplorationStore periodically evaluates trigger conditions
    |  (on element interaction, on beam result change, on proximity change)
    |
    v
Discovery node transitions: hidden -> hinted -> discovered
    |
    v
World responds:
  - 'hinted': subtle glow/particle at relevant location
  - 'discovered': theory insight popup, journal entry
  - 'mastered': new region connection unlocked, new elements available
    |
    v
HUD shows non-intrusive notification
```

### Key Data Flows

1. **Element -> Physics -> Visual**: Core loop. Element changes trigger physics recalculation which drives beam shader updates. Latency budget: <16ms for interactive feel during dragging.
2. **Camera -> Regions -> Elements**: Region loading loop. Camera position determines which regions are mounted. Loaded regions inject their elements into the world store.
3. **Observation -> Discovery -> Revelation**: Learning loop. Player actions and observations are passively tracked and trigger progressive content unlocking.
4. **Persist -> Restore**: On page load, `explorationStore` restores from localStorage. On significant state changes, auto-saves.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 6 regions, ~50 elements | Current design. All elements in one flat array, full retrace on change. Works fine at <16ms. |
| 12+ regions, ~200 elements | Partition elements by region for tracing. Only retrace beams in the active region + cross-boundary beams. Use `useDeferredValue` for non-critical visual updates. |
| Complex geometry per region | Use `<Detailed>` (drei LOD) for terrain meshes. Compress textures to KTX2. Merge static geometry with `BufferGeometryUtils.mergeGeometries`. Target <500 draw calls total. |
| Many simultaneous beams (>20) | Batch beam segments into a single InstancedMesh with per-instance attributes rather than individual meshes. The shader already supports per-segment data textures. |

### Scaling Priorities

1. **First bottleneck: Draw calls.** Each optical element, beam segment, and terrain piece is a draw call. Mitigation: instancing for repeated elements, geometry merging for static terrain, region unloading for distant content. Target: <300 draw calls with 2 active regions.
2. **Second bottleneck: Physics retrace.** With many elements, the LightTracer must trace more intersections. Mitigation: scope tracing to the active region, cache results for unchanged beam paths, throttle during drag (trace at 30fps, render at 60fps).
3. **Third bottleneck: Html overlays.** Each drei `<Html>` element creates a DOM node projected into 3D. More than 2-3 simultaneously causes layout thrashing. Mitigation: only one theory portal open at a time, use simple 3D text/sprites for labels.

## Anti-Patterns

### Anti-Pattern 1: One Giant Scene Graph

**What people do:** Put all 23 demo environments, all optical elements, all terrain into one always-mounted scene.
**Why it's wrong:** WebGL draw calls explode (>2000), GPU memory saturates, frame rate drops below 30fps. Three.js frustum culling helps but does not eliminate the overhead of scene graph traversal.
**Do this instead:** Region-based mounting. Only 2-3 regions mounted at a time. Unmounted regions have zero GPU cost.

### Anti-Pattern 2: Separate Canvas Per Region

**What people do:** Create a new `<Canvas>` for each region or demo embed.
**Why it's wrong:** Each Canvas creates a separate WebGL context. Browsers limit to ~8 contexts. Context switching is expensive. State cannot be shared.
**Do this instead:** One Canvas for the entire world. Use `<group>` components for regions within the single scene graph. Use `<Html>` or `<RenderTexture>` for 2D content.

### Anti-Pattern 3: Physics in the Render Loop

**What people do:** Run full beam tracing inside `useFrame` every frame.
**Why it's wrong:** The unified physics engine (Mueller matrices, Fresnel equations) is CPU-intensive. Running at 60fps with 50+ elements will stall the main thread.
**Do this instead:** Run physics in a `useEffect` triggered by element changes, debounced to ~30fps max during drag operations. Cache beam segments. Only the shader (GPU) runs every frame.

### Anti-Pattern 4: Scroll-Driven Camera (The Previous Mistake)

**What people do:** Map scroll position to camera Z position (exactly what v2 and v3 did).
**Why it's wrong:** Creates a linear, guided experience. The player cannot deviate, backtrack freely, or explore laterally. Fundamentally incompatible with open-world design. This was the root cause of dissatisfaction with all previous versions.
**Do this instead:** Free WASD+mouse camera control. No scroll mapping. The camera moves in 3D space under direct player control.

### Anti-Pattern 5: Modifying Existing Demo Components

**What people do:** Refactor the 23 existing demo components to work in 3D.
**Why it's wrong:** The demos are battle-tested 2D SVG/Canvas/HTML components. Rewriting them as 3D would take months and introduce regressions. The demos ARE the deep content -- they should be embedded, not rebuilt.
**Do this instead:** Wrap demos in `<Html>` or `<RenderTexture>` adapters. The demos receive props (e.g., `difficultyLevel`) and render exactly as they do in the current `/demos` page.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| OdysseyWorld <-> Existing App Router | Route: `/odyssey` renders `OdysseyWorld` | Standard React Router integration. Odyssey is a full-screen experience within the existing app shell. |
| WorldStore <-> Unified Physics | Function calls: `createTracer()`, `traceLinear()` | Physics engine is pure TypeScript, no state. Store calls it and stores results. |
| WorldStore <-> PhysicsResultStore | `subscribeWithSelector` on elements array | PhysicsResultStore subscribes to element changes and recalculates. |
| TheoryPortal <-> Existing Demos | `React.lazy()` + `<Suspense>` | Demos are lazy-loaded exactly as in `odysseyData.ts`. Zero coupling. |
| ExplorationStore <-> localStorage | `zustand/persist` middleware | Auto-saves exploration progress. Restore on mount. |
| CameraStore <-> RegionManager | Read-only subscription | RegionManager reads camera position to determine active regions. |
| WorldStore <-> RegionManager | Region mount/unmount triggers addElements/removeElements | Regions own their default elements. Mounting a region adds them to the world. |

### External Dependencies (New)

| Dependency | Purpose | Why |
|------------|---------|-----|
| `camera-controls` (yomotsu) | Smooth camera movement with damping | More capable than drei's built-in controls. Supports smooth transitions, bounds, dolly. Already peer-compatible with three.js. MEDIUM confidence -- may be sufficient to build custom from `useFrame` instead. |
| `@react-three/postprocessing` | Bloom, tone mapping, selective glow | Already used in v3. Essential for making beams look good. |
| drei `<Html>` | 2D demo embedding in 3D | Already a dependency. Core feature of the architecture. |
| drei `<Detailed>` | LOD for terrain meshes | Already a dependency. Needed if regions have complex geometry. |
| drei `<KeyboardControls>` | WASD input abstraction | Already a dependency. Clean keyboard input for camera movement. |

No new major dependencies required. The architecture is built entirely on the existing stack.

## Build Order Implications

The components have the following dependency chain:

```
Phase 1: Foundation (can be built independently)
├── camera/ExplorationCamera.ts     (depends on: nothing -- pure useFrame)
├── store/worldStore.ts              (depends on: nothing -- pure Zustand)
├── store/explorationStore.ts        (depends on: nothing -- pure Zustand)
├── store/cameraStore.ts             (depends on: nothing -- pure Zustand)
└── regions/types.ts                 (depends on: nothing -- pure types)

Phase 2: Core Scene (depends on Phase 1)
├── OdysseyWorld.tsx                 (depends on: all stores, Canvas setup)
├── WorldScene.tsx                   (depends on: camera, environment)
├── regions/RegionManager.tsx        (depends on: cameraStore, worldStore)
└── environment/Terrain.tsx          (depends on: nothing)

Phase 3: Physics Integration (depends on Phase 1 + existing physics)
├── hooks/useWorldPhysics.ts         (depends on: worldStore, unified physics)
├── beams/WorldBeamSystem.tsx        (depends on: useWorldPhysics, BeamShader)
├── beams/BeamShader.ts              (depends on: existing v2 shader as base)
└── beams/BeamDataTexture.ts         (depends on: unified physics types)

Phase 4: Interaction (depends on Phase 2 + 3)
├── elements/OpticalElement3D.tsx    (depends on: worldStore, interaction)
├── elements/Polarizer3D.tsx         (depends on: OpticalElement3D)
├── interaction/InteractionManager.tsx (depends on: worldStore)
├── interaction/RotationGizmo.tsx    (depends on: pointer events)
└── hud/ToolPalette.tsx              (depends on: worldStore element catalog)

Phase 5: Content & Discovery (depends on Phase 4)
├── theory/TheoryPortal.tsx          (depends on: Html, existing demos)
├── theory/DemoEmbed.tsx             (depends on: existing demo components)
├── regions/definitions/*.ts         (depends on: types, element catalog)
└── store/explorationStore triggers  (depends on: all stores)

Phase 6: Polish (depends on all above)
├── environment/SkySystem.tsx        (depends on: scattering physics)
├── hud/MiniMap.tsx                  (depends on: cameraStore, regions)
├── region transitions               (depends on: RegionManager, camera)
└── discovery reveal animations      (depends on: explorationStore)
```

**Critical path:** Phase 1 -> Phase 2 -> Phase 3 -> Phase 4. The camera and world stores must exist before anything renders. Physics integration must work before interaction makes sense. Theory embedding (Phase 5) can happen in parallel with Phase 4.

**Highest risk:** Phase 3 (physics integration). Connecting the existing unified physics engine to a real-time 3D world with multiple beams is the most technically uncertain part. The v2 and v3 stores provide proven patterns (beam segment calculation, data texture encoding) but those were for a single linear beam. Multiple beams in a 2D/3D world require multi-path tracing.

## Sources

- [React Three Fiber - Scaling Performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) -- HIGH confidence
- [Drei Html Component](https://drei.docs.pmnd.rs/misc/html) -- HIGH confidence
- [Drei RenderTexture Source](https://github.com/pmndrs/drei/blob/master/src/core/RenderTexture.tsx) -- HIGH confidence
- [Building Efficient Three.js Scenes (Codrops, 2025)](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/) -- MEDIUM confidence
- [100 Three.js Tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips) -- MEDIUM confidence
- [Ecctrl Character Controller](https://github.com/pmndrs/ecctrl) -- HIGH confidence (evaluated and rejected for this use case)
- [The Witness Environment Design (Fletcher Studio)](https://www.fletcher.studio/blog/2017/5/26/the-witness-designing-video-game-environments) -- MEDIUM confidence (design philosophy, not code)
- [The Witness Puzzle Design Analysis (Medium)](https://medium.com/game-design-fundamentals/the-witness-and-the-art-of-environmental-puzzles-af661f6dfff0) -- MEDIUM confidence
- [Framerate-Independent Movement in R3F](https://kylemadkins.com/blog/movement-react-three-fiber/) -- HIGH confidence
- [WebGL Render Targets (Maxime Heckel)](https://blog.maximeheckel.com/posts/beautiful-and-mind-bending-effects-with-webgl-render-targets/) -- MEDIUM confidence
- Existing codebase: `odyssey-v2/store.ts`, `odyssey-v3/store.ts`, `odyssey-v2/shaders/beam.glsl.ts` -- HIGH confidence (first-party code analysis)
- Existing codebase: `core/physics/unified/index.ts` -- HIGH confidence (first-party code)

---
*Architecture research for: Odyssey Open World -- Polarization Optics Discovery Experience*
*Researched: 2026-02-20*
