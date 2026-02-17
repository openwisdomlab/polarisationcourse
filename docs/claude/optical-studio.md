# Optical Design Studio Reference

The Optical Design Studio (`/studio`) combines a Device Library with an interactive Optical Bench for creating and simulating optical systems.

## Features

- **Device Library** - 80+ optical devices with specifications, principles, formulas, applications
- **Optical Bench** - Interactive SVG canvas with drag-and-drop for custom optical paths
- **Classic Experiments** - Pre-configured setups (Malus's Law, birefringence, etc.)
- **Challenge Mode** - Goal-based puzzles with success conditions and hints
- **Interactive Tutorials** - Step-by-step learning guides
- **Save/Load** - Persist to localStorage, export/import as JSON
- **First Principles Panel** - Quick reference for four optical axioms

## Component Types (Optical Bench)

| Component | Function | Key Properties |
|-----------|----------|----------------|
| `emitter` | Light source | `polarization` (0-180 degree or -1 for unpolarized) |
| `polarizer` | Linear polarizer filter | `angle` (transmission axis) |
| `waveplate` | Phase retarder | `retardation` (90 for lambda/4, 180 for lambda/2) |
| `mirror` | Reflects light | `reflectAngle`, `rotation` |
| `splitter` | Beam splitter | `splitType` (PBS/NPBS/Calcite) |
| `sensor` | Detects light | Reads intensity & polarization |
| `lens` | Focus/defocus | `focalLength` |

## Optical Bench Store (src/stores/opticalBenchStore.ts)

```typescript
interface OpticalBenchState {
  components: BenchComponent[]
  selectedComponentId: string | null
  lightSegments: LightSegment[]
  isSimulating: boolean
  showPolarization: boolean
  showGrid: boolean
  snapToGrid: boolean
  showLabels: boolean
  showAnnotations: boolean
  showFormulas: boolean
  history: HistoryState[]       // undo/redo
  historyIndex: number
  savedDesigns: SavedDesign[]
  currentExperiment: ClassicExperiment | null
  currentChallenge: Challenge | null
  currentTutorial: Tutorial | null
  // Actions: addComponent, updateComponent, moveComponent, rotateComponent,
  //          deleteComponent, duplicateComponent, calculateLightPaths,
  //          saveDesign, loadDesign, loadExperiment, loadChallenge, undo, redo
}
```

## Light Path Calculation

Recursive ray tracing algorithm:
1. Start from emitter with initial polarization
2. Trace ray until it hits a component or boundary
3. Apply component effect (Malus's Law for polarizer, reflection for mirror, etc.)
4. Continue tracing each output ray
5. Stop at sensors or after max bounces (10)

## Controls

| Input | Action |
|-------|--------|
| Click + Drag | Move component |
| Click | Select component |
| Double-click | Open properties panel |
| Delete/Backspace | Remove selected |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+D | Duplicate selected |
| Space | Toggle simulation |

## Adding a New Experiment

Define in `opticalBenchStore.ts`:

```typescript
const experiment: ClassicExperiment = {
  id: 'malus-law',
  name: "Malus's Law",
  nameZh: '...',
  description: '...',
  descriptionZh: '...',
  difficulty: 'easy',
  components: [
    { type: 'emitter', x: 100, y: 200, polarization: 0 },
    { type: 'polarizer', x: 300, y: 200, angle: 45 },
    { type: 'sensor', x: 500, y: 200 },
  ],
  learningPoints: ['...'],
}
```

## Adding a New Challenge

```typescript
const challenge: Challenge = {
  id: 'challenge-1',
  name: 'Light Maze',
  nameZh: '...',
  description: '...',
  difficulty: 'medium',
  initialComponents: [...],
  availableComponents: ['polarizer', 'mirror'],
  successConditions: {
    sensorIntensity: { min: 45, max: 55 },
    sensorPolarization: 90,
  },
  hints: ['Try using a 45 degree polarizer first'],
}
```
