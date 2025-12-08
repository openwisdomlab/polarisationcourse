# CLAUDE.md - PolarCraft Development Guide

## Project Overview

PolarCraft is an educational voxel puzzle game based on polarized light physics. It combines real optical principles (Malus's Law, birefringence, interference) with Minecraft-style voxel gameplay. Players manipulate polarized light beams to solve puzzles using various optical components.

**Tech Stack:**
- **Frontend**: React 19 + TypeScript (strict mode)
- **3D Rendering**: React Three Fiber + Three.js + drei
- **State Management**: Zustand with subscribeWithSelector middleware
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **Internationalization**: i18next with language detection
- **Build Tool**: Vite
- **Backend** (planned): NestJS + Colyseus for real-time multiplayer

**Key Features:**
- Interactive 3D puzzle game with 5 tutorial levels
- Educational course platform with interactive physics demos (6 units)
- Multi-language support (English/Chinese)
- Dark/Light theme switching
- Three camera modes (first-person, isometric, top-down)

## Quick Commands

```bash
# Frontend
npm install          # Install dependencies
npm run dev          # Start development server (hot reload)
npm run build        # Production build (tsc && vite build)
npm run preview      # Preview production build

# Backend (in /server directory)
cd server
npm install
npm run start:dev    # Start NestJS server in watch mode
npm run build        # Build for production
```

## Architecture

### Directory Structure

```
polarisation/
├── src/                          # React application source
│   ├── App.tsx                   # Root component with React Router
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Global styles (Tailwind)
│   │
│   ├── core/                     # Core game logic (framework-agnostic)
│   │   ├── types.ts              # TypeScript types, constants, interfaces
│   │   ├── World.ts              # Voxel world, light propagation, levels
│   │   └── LightPhysics.ts       # Polarized light physics (four axioms)
│   │
│   ├── stores/                   # Zustand stores
│   │   └── gameStore.ts          # Game state, actions, tutorial hints
│   │
│   ├── pages/                    # Page components
│   │   ├── HomePage.tsx          # Landing page with navigation
│   │   ├── GamePage.tsx          # Full game with HUD
│   │   ├── DemosPage.tsx         # Interactive physics demos
│   │   └── index.ts              # Barrel export
│   │
│   ├── components/
│   │   ├── game/                 # 3D game components (R3F)
│   │   │   ├── GameCanvas.tsx    # R3F Canvas wrapper
│   │   │   ├── Scene.tsx         # Main scene, controls, lighting
│   │   │   ├── Blocks.tsx        # Block mesh rendering
│   │   │   ├── LightBeams.tsx    # Light beam visualization
│   │   │   └── SelectionBox.tsx  # Block selection indicator
│   │   │
│   │   ├── hud/                  # Game HUD components
│   │   │   ├── BlockSelector.tsx # Block type selection
│   │   │   ├── InfoBar.tsx       # Level info display
│   │   │   ├── LevelSelector.tsx # Level navigation
│   │   │   ├── LevelGoal.tsx     # Sensor activation progress
│   │   │   ├── TutorialHint.tsx  # Hint display
│   │   │   ├── HelpPanel.tsx     # Controls guide (Dialog)
│   │   │   ├── Crosshair.tsx     # FPS crosshair
│   │   │   └── *ModeIndicator.tsx # Vision/Camera mode display
│   │   │
│   │   ├── demos/                # Interactive physics demos
│   │   │   ├── basics/           # Unit 0: Optical basics
│   │   │   ├── unit1/            # Unit 1: Polarization fundamentals
│   │   │   ├── unit2/            # Unit 2: Interface reflection
│   │   │   ├── unit3/            # Unit 3: Transparent media
│   │   │   ├── unit4/            # Unit 4: Scattering
│   │   │   ├── unit5/            # Unit 5: Full polarimetry
│   │   │   ├── DemoCanvas.tsx    # 3D demo wrapper
│   │   │   ├── Demo2DCanvas.tsx  # 2D demo wrapper
│   │   │   └── DemoControls.tsx  # Shared demo UI controls
│   │   │
│   │   └── ui/                   # Reusable UI primitives
│   │       ├── button.tsx        # Button component
│   │       ├── dialog.tsx        # Dialog component
│   │       ├── tooltip.tsx       # Tooltip component
│   │       └── LanguageThemeSwitcher.tsx
│   │
│   ├── contexts/                 # React contexts
│   │   └── ThemeContext.tsx      # Dark/light theme provider
│   │
│   ├── i18n/                     # Internationalization
│   │   ├── index.ts              # i18next configuration
│   │   └── locales/
│   │       ├── en.json           # English translations
│   │       └── zh.json           # Chinese translations
│   │
│   └── lib/
│       └── utils.ts              # Utility functions (cn for classnames)
│
├── server/                       # Backend (NestJS + Colyseus)
│   ├── src/
│   │   ├── main.ts               # Server entry point
│   │   ├── app.module.ts         # Root module
│   │   └── game/                 # Game module
│   │       ├── game.module.ts
│   │       ├── game.gateway.ts   # WebSocket gateway
│   │       ├── game.service.ts
│   │       ├── rooms/            # Colyseus rooms
│   │       └── schemas/          # State schemas
│   ├── package.json
│   └── tsconfig.json
│
├── index.html                    # SPA entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
├── postcss.config.js
├── components.json               # shadcn/ui config
├── CLAUDE.md                     # This file
├── COURSE.md                     # Course curriculum
└── README.md                     # Chinese documentation
```

### Application Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | Landing page with game/course navigation |
| `/game` | `GamePage` | Full 3D puzzle game with HUD |
| `/demos` | `DemosPage` | Interactive physics demos and course content |

### Core Components

| Component | Responsibility |
|-----------|----------------|
| `src/core/types.ts` | Type definitions, direction vectors, polarization colors |
| `src/core/World.ts` | Block storage, light propagation cellular automaton, levels |
| `src/core/LightPhysics.ts` | Static physics methods (four optical axioms) |
| `src/stores/gameStore.ts` | Global game state, actions, subscriptions |
| `src/components/game/Scene.tsx` | R3F scene composition, controls, lighting |
| `src/pages/DemosPage.tsx` | Demo navigation, info cards, SVG diagrams |

## Key Concepts

### Four Physical Axioms

1. **Orthogonality** - Light polarized at 90° difference can coexist without interference
2. **Malus's Law** - `I = I₀ × cos²(θ)` where θ is angle between light polarization and filter
3. **Birefringence** - Calcite splits light into o-ray (0°) and e-ray (90°)
4. **Interference** - Same-phase light adds intensity, opposite-phase cancels

### Core Types (src/core/types.ts)

```typescript
// Light packet - fundamental light unit
interface LightPacket {
  direction: Direction;           // 'north'|'south'|'east'|'west'|'up'|'down'
  intensity: number;              // 0-15
  polarization: PolarizationAngle; // 0|45|90|135
  phase: Phase;                   // 1|-1
}

// Block state
interface BlockState {
  type: BlockType;               // 'air'|'solid'|'emitter'|'polarizer'|'rotator'|'splitter'|'sensor'|'mirror'
  rotation: number;              // 0, 90, 180, 270
  polarizationAngle: PolarizationAngle;
  rotationAmount: number;        // For rotator: 45 or 90
  activated: boolean;            // For sensor
  requiredIntensity: number;     // For sensor
  facing: Direction;
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

## State Management (Zustand)

### Game Store Structure

```typescript
// src/stores/gameStore.ts
interface GameState {
  // World instance
  world: World | null

  // Level state
  currentLevelIndex: number
  currentLevel: LevelData | null
  isLevelComplete: boolean

  // Player state
  selectedBlockType: BlockType
  selectedBlockRotation: number
  selectedPolarizationAngle: PolarizationAngle

  // View state
  visionMode: 'normal' | 'polarized'
  cameraMode: 'first-person' | 'isometric' | 'top-down'
  showGrid: boolean
  showHelp: boolean

  // Tutorial
  tutorialHints: string[]
  currentHintIndex: number
  showHint: boolean

  // Actions
  initWorld: (size?: number) => void
  loadLevel: (index: number) => void
  placeBlock: (position: BlockPosition) => void
  removeBlock: (position: BlockPosition) => void
  rotateBlockAt: (position: BlockPosition) => void
  // ... more actions
}
```

### Using the Store

```tsx
import { useGameStore } from '@/stores/gameStore'

function MyComponent() {
  const { world, visionMode, toggleVisionMode } = useGameStore()
  // or select specific values for performance:
  const visionMode = useGameStore(state => state.visionMode)
}
```

## Game Controls

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

## Tutorial Levels

| Level | Name | Concept |
|-------|------|---------|
| 0 | Light and Gate | Basic emitter → sensor, polarization matching |
| 1 | Polarizer | Light through filter, Malus's Law introduction |
| 2 | Malus's Law | Two polarizers, 90° blocking |
| 3 | Rotator | Wave plate rotates polarization losslessly |
| 4 | Birefringence | Calcite splitter creates two beams |

## Course Structure (Interactive Demos)

| Unit | Topic | Demos |
|------|-------|-------|
| 0 (Basics) | Optical Fundamentals | Light Wave, Polarization Intro, Polarization Types |
| 1 | Light Polarization | Polarization State, Malus's Law, Birefringence, Waveplate |
| 2 | Interface Reflection | Fresnel Equations, Brewster's Angle |
| 3 | Transparent Media | Chromatic Polarization, Optical Rotation |
| 4 | Turbid Media | Mie Scattering, Rayleigh Scattering |
| 5 | Full Polarimetry | Stokes Vectors, Mueller Matrices |

## Development Guidelines

### TypeScript Configuration

- Target: ES2020
- Strict mode enabled
- JSX: react-jsx
- Path alias: `@/*` → `./src/*`
- No unused locals/parameters
- No fallthrough in switch cases

### Code Style

- Use Chinese comments for physics/game logic
- Use English for technical documentation
- Prefer functional components with hooks
- Use Zustand for global state, local state only for UI-specific concerns
- Use `cn()` utility for conditional classnames (Tailwind)
- All angles in degrees (converted to radians when needed)

### Adding a New Demo

1. Create component in appropriate `src/components/demos/unit*/` folder
2. Add demo info to `getDemoInfo()` in `DemosPage.tsx`
3. Add demo entry to `DEMOS` array in `DemosPage.tsx`
4. Add translations to `src/i18n/locales/*.json`

### Adding a New Block Type

1. Add type to `BlockType` union in `src/core/types.ts`
2. Add default handling in `createDefaultBlockState()`
3. Add physics processing in `LightPhysics.ts` (if affects light)
4. Add case in `World.propagateLight()` switch statement
5. Add mesh rendering in `Blocks.tsx`
6. Update `BlockSelector.tsx` UI

### Adding Translations

```json
// src/i18n/locales/en.json
{
  "namespace": {
    "key": "English text"
  }
}

// src/i18n/locales/zh.json
{
  "namespace": {
    "key": "中文文本"
  }
}
```

Usage:
```tsx
const { t } = useTranslation()
return <span>{t('namespace.key')}</span>
```

### Theme Support

```tsx
import { useTheme } from '@/contexts/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>
      {/* Use CSS variables or conditional classes */}
    </div>
  )
}
```

## Build Configuration

### Vite Config

```typescript
// vite.config.ts
{
  plugins: [react(), tailwindcss()],
  base: './',
  resolve: {
    alias: { '@': resolve(__dirname, './src') }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}
```

### Dependencies

**Frontend Production:**
- `react`, `react-dom` - UI framework
- `react-router-dom` - Client-side routing
- `three`, `@react-three/fiber`, `@react-three/drei` - 3D rendering
- `zustand` - State management
- `i18next`, `react-i18next` - Internationalization

**Frontend Development:**
- `typescript` - Type safety
- `vite`, `@vitejs/plugin-react` - Build tool
- `tailwindcss`, `@tailwindcss/vite` - Styling
- `lucide-react` - Icons

**Backend:**
- `@nestjs/*` - Server framework
- `@colyseus/*` - Real-time multiplayer

## Debugging

### Access World State

```javascript
// In browser console
const store = window.__ZUSTAND_DEVTOOLS_GLOBAL_STORE__
// Or import directly in a component for debugging
```

### Light Propagation

The World class exposes methods for debugging:
```typescript
world.getAllBlocks()      // Get all placed blocks
world.getAllLightStates() // Get all light positions and packets
world.getLightState(x, y, z) // Get light at specific position
```

### Visual Debugging

- Press `V` to toggle polarized vision (shows polarization colors)
- Press `G` to toggle grid overlay
- Use isometric/top-down views for better puzzle overview

## Backend Server (Future Multiplayer)

The server is set up but multiplayer features are not yet implemented:

```bash
cd server
npm run start:dev  # Starts on port 3001
```

- API prefix: `/api`
- WebSocket: `ws://localhost:3001`
- CORS enabled for `localhost:5173` and `localhost:3000`

## Legacy Files

The following files in `src/` root are from the previous vanilla TypeScript implementation and are **no longer used**:
- `src/main.ts` - Old game entry point (replaced by `main.tsx`)
- `src/World.ts` - Duplicated in `src/core/World.ts`
- `src/LightPhysics.ts` - Duplicated in `src/core/LightPhysics.ts`
- `src/Renderer.ts` - Replaced by React Three Fiber components
- `src/PlayerControls.ts` - Replaced by R3F controls + Zustand

These can be safely removed in a future cleanup.

## Common Tasks

### Run Development Server

```bash
npm run dev
# Opens at http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview  # Test production build locally
```

### Add New Language

1. Create `src/i18n/locales/{lang}.json`
2. Import and add to `resources` in `src/i18n/index.ts`
3. Add language option to `LanguageThemeSwitcher.tsx`
