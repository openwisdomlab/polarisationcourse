# Game Systems & Physics Reference

## Core Types (src/core/types.ts)

```typescript
interface LightPacket {
  direction: Direction;           // 'north'|'south'|'east'|'west'|'up'|'down'
  intensity: number;              // 0-15
  polarization: PolarizationAngle; // 0|45|90|135
  phase: Phase;                   // 1|-1
}

type BlockType =
  | 'air' | 'solid' | 'emitter' | 'polarizer' | 'rotator'
  | 'splitter' | 'sensor' | 'mirror'
  | 'prism' | 'lens' | 'beamSplitter' | 'quarterWave'
  | 'halfWave' | 'absorber' | 'phaseShifter' | 'portal'

interface BlockState {
  type: BlockType;
  rotation: number;              // 0, 90, 180, 270
  polarizationAngle: PolarizationAngle;
  rotationAmount: number;        // For rotator: 45 or 90
  activated: boolean;            // For sensor
  requiredIntensity: number;     // For sensor
  facing: Direction;
  absorptionRate: number;        // For absorber: 0-1
  phaseShift: number;            // For phaseShifter: 0, 90, 180, 270
  linkedPortalId: string | null; // For portal
  splitRatio: number;            // For beamSplitter: 0-1 (default 0.5)
  focalLength: number;           // For lens: positive=convex, negative=concave
  dispersive: boolean;           // For prism
}
```

## Block Types

### Core Blocks

| Type | Purpose | Key State |
|------|---------|-----------|
| `emitter` | Emits polarized light | `polarizationAngle`, `facing` |
| `polarizer` | Filters light (Malus's Law) | `polarizationAngle` |
| `rotator` | Rotates polarization without loss | `rotationAmount` (45 or 90) |
| `splitter` | Birefringent crystal (calcite) | `facing` |
| `sensor` | Detects light, triggers activation | `polarizationAngle`, `requiredIntensity`, `activated` |
| `mirror` | Reflects light | `facing` |
| `solid` | Blocks light | - |

### Advanced Blocks

| Type | Purpose | Key State |
|------|---------|-----------|
| `prism` | Refracts and disperses light | `dispersive` |
| `lens` | Focuses or diverges light | `focalLength` |
| `beamSplitter` | Splits beam 50/50 | `splitRatio` |
| `quarterWave` | Linear to circular polarization | `rotationAmount` (90) |
| `halfWave` | Flips polarization direction | `rotationAmount` (180) |
| `absorber` | Partially absorbs intensity | `absorptionRate` |
| `phaseShifter` | Shifts light phase | `phaseShift` |
| `portal` | Teleports light | `linkedPortalId` |

## Four Physical Axioms

1. **Orthogonality** - Light polarized at 90 degree difference can coexist without interference
2. **Malus's Law** - `I = I_0 * cos^2(theta)` where theta is angle between light polarization and filter
3. **Birefringence** - Calcite splits light into o-ray (0 degree) and e-ray (90 degree)
4. **Interference** - Same-phase light adds intensity, opposite-phase cancels

## Physics Constants

### Polarization Colors (Vision Mode)

| Angle | Color | Hex |
|-------|-------|-----|
| 0 degree (Horizontal) | Red | `#ff4444` |
| 45 degree | Orange/Yellow | `#ffaa00` |
| 90 degree (Vertical) | Green | `#44ff44` |
| 135 degree | Blue | `#4444ff` |

### Direction Vectors

```typescript
const DIRECTION_VECTORS = {
  north: { x: 0, y: 0, z: -1 },
  south: { x: 0, y: 0, z: 1 },
  east:  { x: 1, y: 0, z: 0 },
  west:  { x: -1, y: 0, z: 0 },
  up:    { x: 0, y: 1, z: 0 },
  down:  { x: 0, y: -1, z: 0 }
}
```

### Intensity Calculation (Malus's Law)

```typescript
const outputIntensity = inputIntensity * Math.cos(angleDiff * Math.PI / 180) ** 2
```

## 3D Game

### Controls

| Input | First-Person | Isometric/Top-Down |
|-------|--------------|-------------------|
| WASD | Move player | Pan camera |
| Space | Jump | - |
| Mouse | Look around | Camera control |
| Left Click | Place block | Place block |
| Right Click | Delete block | Delete block |
| R | Rotate hovered/selected block | Same |
| V | Toggle polarized vision | Same |
| C | Cycle camera mode | Same |
| G | Toggle grid | Same |
| H | Show/hide help | Same |
| 1-7 | Select block type | Same |

### Tutorial Levels

| Level | Name | Concept |
|-------|------|---------|
| 0 | Light and Gate | Basic emitter to sensor, polarization matching |
| 1 | Polarizer | Light through filter, Malus's Law introduction |
| 2 | Malus's Law | Two polarizers, 90 degree blocking |
| 3 | Rotator | Wave plate rotates polarization losslessly |
| 4 | Birefringence | Calcite splitter creates two beams |

## 2D Puzzle Game

SVG-based puzzle game at `/games/2d` with Monument Valley-inspired aesthetics.

### Features
- SVG-based rendering with animated light beams
- Real-time recursive ray tracing for light path calculation
- Polarization color visualization toggle
- Open-ended puzzles with multiple valid solutions

### Difficulty Tiers

| Difficulty | Levels | Complexity |
|------------|--------|------------|
| Easy | 0-2 | Basic polarizer/mirror mechanics |
| Medium | 3-5 | Rotators, splitters, L-shaped paths |
| Hard | 6-8 | Multiple sensors, maze navigation |
| Expert | 9-10 | Multiple light sources, complex routing |

### 2D Component Interactions

| Component | Interaction | Behavior |
|-----------|-------------|----------|
| Emitter | Locked | Emits polarized light in one direction |
| Polarizer | Click + rotate +/-15 degree | Filters light by Malus's Law |
| Mirror | Click + rotate 45/135 degree | Reflects light |
| Splitter | Locked | Creates o-ray (0 degree) and e-ray (90 degree) |
| Rotator | Click to toggle 45/90 degree | Rotates polarization without loss |
| Sensor | Locked | Activates when intensity/polarization match |

### 2D Controls
- **Click** - Select unlocked component
- **Arrow Left/Right** - Rotate selected component
- **Eye button** - Toggle polarization color display
- **Reset** - Restore level to initial state

## State Management (Zustand)

### Game Store (src/stores/gameStore.ts)

```typescript
interface GameState {
  world: World | null
  currentLevelIndex: number
  currentLevel: LevelData | null
  isLevelComplete: boolean
  selectedBlockType: BlockType
  selectedBlockRotation: number
  selectedPolarizationAngle: PolarizationAngle
  visionMode: 'normal' | 'polarized'
  cameraMode: 'first-person' | 'isometric' | 'top-down'
  showGrid: boolean
  showHelp: boolean
  tutorialHints: string[]
  currentHintIndex: number
  showHint: boolean
  // Actions: initWorld, loadLevel, placeBlock, removeBlock, rotateBlockAt, etc.
}
```

### Using the Store

```tsx
import { useGameStore } from '@/stores/gameStore'
const visionMode = useGameStore(state => state.visionMode)
```

## Debugging

```javascript
// Browser console - access world state
world.getAllBlocks()
world.getAllLightStates()
world.getLightState(x, y, z)
```

- Press `V` to toggle polarized vision (shows polarization colors)
- Press `G` to toggle grid overlay
- Use isometric/top-down views for better puzzle overview
