# CLAUDE.md - PolarCraft Development Guide

## Project Overview

PolarCraft is a voxel puzzle game based on polarized light physics. It combines real optical principles (Malus's Law, birefringence, interference) with Minecraft-style voxel gameplay. Players manipulate polarized light beams to solve puzzles using various optical components.

**Tech Stack:**
- TypeScript (strict mode enabled)
- Three.js (3D rendering)
- Vite (build tool)

## Quick Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Production build (tsc && vite build)
npm run preview  # Preview production build
```

## Architecture

```
src/
├── main.ts          # Game entry point, game loop, UI initialization
├── types.ts         # Type definitions, constants, and interfaces
├── World.ts         # Voxel world management, light propagation (cellular automaton)
├── LightPhysics.ts  # Polarized light physics engine (four axioms)
├── Renderer.ts      # Three.js rendering, block meshes, light visualization
└── PlayerControls.ts # First-person controls, block placement/interaction
```

### Core Components

| File | Responsibility |
|------|----------------|
| `main.ts` | Game class, game loop, tutorial level loading, UI event binding |
| `types.ts` | All TypeScript types, direction vectors, polarization colors, default configs |
| `World.ts` | Block storage (Map), light state computation, sensor activation, level loading |
| `LightPhysics.ts` | Static physics methods implementing the four optical axioms |
| `Renderer.ts` | Three.js scene, camera, materials, block meshes, light beam visualization |
| `PlayerControls.ts` | Keyboard/mouse input, pointer lock, block placement, player movement |

## Key Concepts

### Four Physical Axioms

1. **Orthogonality** - Light polarized at 90° difference can coexist without interference
2. **Malus's Law** - `I = I₀ × cos²(θ)` where θ is angle between light polarization and filter
3. **Birefringence** - Calcite splits light into o-ray (0°) and e-ray (90°)
4. **Interference** - Same-phase light adds intensity, opposite-phase cancels

### Light Properties

```typescript
interface LightPacket {
  direction: Direction;        // 'north'|'south'|'east'|'west'|'up'|'down'
  intensity: number;           // 0-15
  polarization: PolarizationAngle;  // 0|45|90|135
  phase: Phase;                // 1|-1
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

### Rendering Flow

```
Game.gameLoop() → Game.update(dt) → Game.render()
                      ↓
          PlayerControls.update(dt)
                      ↓
              Renderer.render()
```

## Development Guidelines

### Adding a New Block Type

1. Add type to `BlockType` union in `types.ts`
2. Add default handling in `createDefaultBlockState()`
3. Add physics processing in `LightPhysics.ts` (if affects light)
4. Add case in `World.propagateLight()` switch statement
5. Add material in `Renderer.initMaterials()`
6. Add mesh creation in `Renderer.addBlockMesh()`
7. Update UI in `index.html` block selector

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

### TypeScript Configuration

- Target: ES2020
- Strict mode enabled
- No unused locals/parameters
- Module: ESNext with bundler resolution

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
- `POLARIZATION_COLORS` maps angles to hex colors for visualization

### World.ts
- `updateLightPropagation()` is the main physics tick
- Recursion depth limited to 100 to prevent infinite loops
- Ground is auto-initialized at y=0

### LightPhysics.ts
- All methods are static (stateless physics calculations)
- `normalizeAngle()` snaps to nearest valid PolarizationAngle
- Mirror reflection is simplified (no 45° mirrors yet)

### Renderer.ts
- Reuses single `BoxGeometry` for performance
- `polarizedVision` mode shows polarization colors instead of default yellow
- Block meshes stored with `userData` for raycasting

### PlayerControls.ts
- Requires pointer lock for mouse look
- WASD movement, Space jump, R rotate, V vision mode, H help
- Number keys 1-7 select block types

## Common Tasks

### Debug Light Propagation
The `game` object is exposed on `window` for debugging:
```javascript
window.game.world.getAllLightStates()
```

### Test Malus's Law
Create an emitter → polarizer → sensor chain and verify intensity decreases according to `cos²(θ)`.

### Test Birefringence
Use 45° polarized light into a splitter - should produce two beams with equal intensity (0° and 90°).

## Build Output

Production builds go to `dist/` with:
- Sourcemaps enabled
- Base path `./` for relative asset loading
