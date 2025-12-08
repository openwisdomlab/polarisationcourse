# CLAUDE.md - PolarCraft Development Guide

## Project Overview

PolarCraft is an educational voxel puzzle game based on polarized light physics. It combines real optical principles (Malus's Law, birefringence, interference) with Minecraft-style voxel gameplay. Players manipulate polarized light beams to solve puzzles using various optical components.

**Tech Stack:**
- TypeScript (strict mode enabled)
- Three.js (3D rendering)
- Vite (build tool)

**Project Structure:**
- Interactive 3D puzzle game
- Educational course platform with 5 units covering polarization physics
- Interactive demos for each physics concept

## Quick Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server (hot reload)
npm run build    # Production build (tsc && vite build)
npm run preview  # Preview production build
```

## Architecture

### Directory Structure

```
polarisation/
├── src/                    # TypeScript source code
│   ├── main.ts             # Game entry point, game loop, UI initialization
│   ├── types.ts            # Type definitions, constants, and interfaces
│   ├── World.ts            # Voxel world management, light propagation
│   ├── LightPhysics.ts     # Polarized light physics engine (four axioms)
│   ├── Renderer.ts         # Three.js rendering, cameras, light visualization
│   └── PlayerControls.ts   # Input handling, block placement, player movement
├── index.html              # Landing page (navigation hub)
├── game.html               # Game UI and HUD
├── demos.html              # Interactive demos and course content
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration (multi-entry)
├── CLAUDE.md               # This file
├── COURSE.md               # Course curriculum (5 units)
└── README.md               # Chinese documentation
```

### Multi-Page Application

| Page | Purpose | Entry |
|------|---------|-------|
| `index.html` | Landing page with navigation to game and course | Main entry |
| `game.html` | Full game with HUD, controls, level selector | `/src/main.ts` |
| `demos.html` | Interactive physics demos and 5-unit course | Standalone HTML |

### Core Components

| File | Lines | Responsibility |
|------|-------|----------------|
| `main.ts` | ~441 | Game class, game loop, tutorial hints, level progression, UI binding |
| `types.ts` | ~123 | All TypeScript types, direction vectors, polarization colors, configs |
| `World.ts` | ~516 | Block storage (Map), light propagation cellular automaton, levels |
| `LightPhysics.ts` | ~329 | Static physics methods implementing four optical axioms |
| `Renderer.ts` | ~913 | Three.js scene, multi-camera system, materials, light beams |
| `PlayerControls.ts` | ~561 | Keyboard/mouse input, raycasting, block placement, physics |

## Key Concepts

### Four Physical Axioms

1. **Orthogonality** - Light polarized at 90° difference can coexist without interference
2. **Malus's Law** - `I = I₀ × cos²(θ)` where θ is angle between light polarization and filter
3. **Birefringence** - Calcite splits light into o-ray (0°) and e-ray (90°)
4. **Interference** - Same-phase light adds intensity, opposite-phase cancels

### Light Properties

```typescript
interface LightPacket {
  direction: Direction;           // 'north'|'south'|'east'|'west'|'up'|'down'
  intensity: number;              // 0-15
  polarization: PolarizationAngle; // 0|45|90|135
  phase: Phase;                   // 1|-1
}
```

### Block Types

| Type | Purpose | Key State |
|------|---------|-----------|
| `emitter` | Emits polarized light | `polarizationAngle`, `facing` |
| `polarizer` | Filters light (Malus's Law) | `polarizationAngle` |
| `rotator` | Rotates polarization without loss | `rotationAmount` (45 or 90) |
| `splitter` | Birefringent crystal (calcite) | `facing` |
| `sensor` | Detects light, triggers activation | `polarizationAngle`, `requiredIntensity`, `activated` |
| `mirror` | Reflects light | `facing` |
| `solid` | Blocks light | - |

### Block State Structure

```typescript
interface BlockState {
  type: BlockType;
  rotation: number;              // 0, 90, 180, 270
  polarizationAngle: PolarizationAngle;
  rotationAmount: number;        // For rotator: 45 or 90
  activated: boolean;            // For sensor
  requiredIntensity: number;     // For sensor
  facing: Direction;
}
```

## Game Controls

### Input Mappings

| Input | First-Person | Isometric/Top-Down |
|-------|--------------|-------------------|
| WASD | Move player | Pan camera |
| Space | Jump | - |
| Mouse | Look around | Camera control |
| Left Click | Place block | Place block |
| Right Click | Delete block | Delete block |
| R | Rotate selected block | Rotate selected block |
| V | Toggle polarized vision | Toggle polarized vision |
| C | Cycle camera mode | Cycle camera mode |
| G | Toggle grid | Toggle grid |
| H | Show/hide help | Show/hide help |
| Q/E | - | Rotate view (isometric) |
| 1-7 | Select block type | Select block type |
| Scroll | - | Zoom |

### Camera Modes

- **First-person**: Traditional FPS controls with pointer lock
- **Isometric**: Fixed-angle 3D view with orbit rotation and zoom
- **Top-down**: Orthographic overhead view for puzzle planning

## Code Patterns

### Position Key Convention

Blocks are stored in a Map using string keys:
```typescript
function posKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`;
}
```

### Event System

World uses a simple listener pattern:
```typescript
world.addListener((type: string, data: unknown) => {
  // type: 'blockChanged' | 'lightUpdated' | 'sensorChanged' | 'worldCleared'
});
```

### Light Propagation

Light propagation is a recursive cellular automaton in `World.ts`:
1. Clear all light states
2. Collect all emitters
3. For each emitter, propagate light recursively
4. At each block, process according to block type
5. Calculate interference when multiple light packets overlap
6. Update sensor activation states
7. Max recursion depth: 100 (prevents infinite loops)

### Rendering Flow

```
Game.gameLoop() → Game.update(dt) → Game.render()
                      ↓
          PlayerControls.update(dt)
                      ↓
              Renderer.render()
```

## Tutorial System

### Tutorial Levels (5 levels in `World.ts`)

| Level | Name | Concept |
|-------|------|---------|
| 0 | Light and Gate | Basic emitter → sensor, polarization matching |
| 1 | Polarizer | Light through filter, Malus's Law introduction |
| 2 | Malus's Law | Two polarizers, 90° blocking |
| 3 | Rotator | Wave plate rotates polarization losslessly |
| 4 | Birefringence | Calcite splitter creates two beams |

### Tutorial Hints System

Hints are defined in `main.ts` with timed display:
```typescript
const TUTORIAL_HINTS: Record<number, TutorialHint[]> = {
  0: [
    { text: 'Message...', keys: ['R'], duration: 5000 },
    // ...
  ],
  // per-level hints
};
```

### Adding a New Tutorial Level

Add to `TUTORIAL_LEVELS` array in `World.ts`:
```typescript
{
  name: "Level Name",
  description: "Instructions for the player",
  blocks: [
    { x: 0, y: 1, z: 0, type: 'emitter', state: { facing: 'south', polarizationAngle: 0 } },
    // ... more blocks
  ],
  goal: { sensorPositions: [{ x: 0, y: 1, z: 3 }] }
}
```

Then add corresponding hints in `TUTORIAL_HINTS` in `main.ts`.

## Development Guidelines

### Adding a New Block Type

1. Add type to `BlockType` union in `types.ts`
2. Add default handling in `createDefaultBlockState()`
3. Add physics processing in `LightPhysics.ts` (if affects light)
4. Add case in `World.propagateLight()` switch statement
5. Add material in `Renderer.initMaterials()`
6. Add mesh creation in `Renderer.addBlockMesh()`
7. Update UI in `game.html` block selector

### TypeScript Configuration

- Target: ES2020
- Strict mode enabled
- No unused locals/parameters
- No fallthrough in switch cases
- Module: ESNext with bundler resolution
- Includes: src/ directory only

### Code Style

- Use Chinese comments for game logic documentation
- Use English for technical/code documentation
- Prefer static methods in `LightPhysics` class
- Use `THREE.Vector3` for 3D operations, custom `Vec3` for block positions
- All angles in degrees (converted to radians when needed)

## File-Specific Notes

### types.ts
- Contains all shared types and constants
- `DIRECTION_VECTORS` maps Direction to Vec3
- `POLARIZATION_COLORS` maps angles to hex colors (0°=red, 45°=orange, 90°=green, 135°=blue)
- `DEFAULT_CONFIG`: worldSize=32, chunkSize=16, maxIntensity=15, lightDecay=0

### World.ts
- `updateLightPropagation()` is the main physics tick
- Recursion depth limited to 100 to prevent infinite loops
- Ground auto-initialized at y=0 for world bounds
- `TUTORIAL_LEVELS` array contains all level definitions

### LightPhysics.ts
- All methods are static (stateless physics calculations)
- `normalizeAngle()` snaps to nearest valid PolarizationAngle
- Mirror reflection is simplified (no 45° mirrors yet)
- Key methods: `applyMalusLaw()`, `splitLight()`, `calculateInterference()`

### Renderer.ts
- Largest file (~913 lines)
- Reuses single `BoxGeometry` for all blocks
- `polarizedVision` mode shows polarization colors instead of yellow
- Block meshes stored with `userData` for raycasting
- Multi-camera system with perspective (FPS) and orthographic (iso/top-down)
- Grid system toggled with G key

### PlayerControls.ts
- Requires pointer lock for first-person mouse look
- Raycasting for block targeting and placement
- Simple physics: gravity (20 m/s²), jump velocity, collision detection
- Callbacks: onBlockTypeChange, onVisionModeChange, onCameraModeChange

### main.ts
- Game class orchestrates all components
- Tutorial hint system with timed display
- Level selector UI creation
- Goal tracking and completion detection
- `game` object exposed on `window` for debugging

## Build Configuration

### Vite Config (vite.config.ts)

```typescript
{
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        game: 'game.html',
        demos: 'demos.html'
      }
    }
  }
}
```

### Dependencies

**Production:**
- `three@^0.160.1` - 3D graphics engine

**Development:**
- `typescript@^5.3.3` - Type-safe JavaScript
- `vite@^5.0.10` - Build tool and dev server
- `@types/three@^0.160.0` - TypeScript definitions

## Debugging

### Debug Light Propagation

The `game` object is exposed on `window`:
```javascript
window.game.world.getAllLightStates()
window.game.world.getAllBlocks()
```

### Test Malus's Law

Create an emitter → polarizer → sensor chain and verify intensity decreases according to `cos²(θ)`.

### Test Birefringence

Use 45° polarized light into a splitter - should produce two beams with equal intensity (0° and 90°).

### Visual Debugging

- Press `V` to toggle polarized vision (shows polarization colors)
- Press `G` to toggle grid overlay
- Use isometric/top-down views for better puzzle overview

## Course Structure (COURSE.md)

The project includes a 5-unit educational course on polarized light:

| Unit | Topic | Key Concepts |
|------|-------|--------------|
| 1 | Light Polarization | Birefringence, Malus's Law, calcite experiments |
| 2 | Interface Reflection | Fresnel equations, Brewster's angle |
| 3 | Transparent Media | Chromatic polarization, optical rotation |
| 4 | Turbid Media | Mie/Rayleigh scattering, polarization features |
| 5 | Full Polarimetry | Stokes vectors, Mueller matrices, applications |

## Common Tasks

### Adding New Interactive Demo

Add to `demos.html`:
1. Create a new section with canvas element
2. Add navigation entry in sidebar
3. Implement visualization JavaScript inline or in separate module

### Updating Level Selector

The level selector is created dynamically in `main.ts`:
- Level buttons are numbered 1-5 for tutorial levels
- Sandbox button enables free creation mode
- Buttons are inserted into the info-bar element

### Modifying HUD

Game HUD elements are in `game.html`:
- `#info-bar` - Level name and instructions
- `#vision-mode` - Current vision mode indicator
- `#camera-mode` - Camera mode indicator
- `#level-goal` - Sensor activation progress
- `#tutorial-hint` - Timed hint display
- `#block-selector` - Block type selection
- `#help-panel` - Comprehensive controls guide

## React Three Fiber Evaluation

**Not recommended for this project** because:
1. Current Three.js implementation is clean and performant
2. Game complexity doesn't warrant React's component model
3. Migration cost outweighs benefits for a puzzle game
4. Core game logic (light physics) would remain unchanged

Consider R3F only if adding:
- Level editor with complex UI
- User-generated content system
- Multiplayer features requiring real-time state sync
