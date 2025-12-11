# CLAUDE.md - PolarCraft Development Guide

## Project Overview

PolarCraft is an educational voxel puzzle game based on polarized light physics. It combines real optical principles (Malus's Law, birefringence, interference) with Minecraft-style voxel gameplay. Players manipulate polarized light beams to solve puzzles using various optical components.

**Tech Stack:**
- **Frontend**: React 19 + TypeScript (strict mode)
- **3D Rendering**: React Three Fiber + Three.js + drei
- **2D Animations**: Framer Motion (for course demo visualizations)
- **State Management**: Zustand with subscribeWithSelector middleware
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **Internationalization**: i18next with language detection
- **Build Tool**: Vite
- **Backend** (planned): NestJS + Colyseus for real-time multiplayer

**Key Features:**
- Interactive 3D voxel puzzle game with 5 tutorial levels
- **NEW**: 2D puzzle game with 11 levels across 4 difficulty tiers (easy/medium/hard/expert)
- Educational course platform with 15 interactive physics demos across 6 units
- Multi-language support (English/Chinese)
- Dark/Light theme switching
- Three camera modes in 3D game (first-person, isometric, top-down)

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

## Git Workflow

**Branch Strategy:**
- All development work should be merged to `main` branch after completion
- Create feature branches from `main` for new features or fixes
- After code review/testing, merge feature branches directly to `main`
- Keep `main` branch always deployable

**Commit Guidelines:**
- Use conventional commit format: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- Write clear, concise commit messages in English
- Reference issue numbers when applicable

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
│   │   ├── GamePage.tsx          # Full 3D game with HUD
│   │   ├── Game2DPage.tsx        # 2D CSS/SVG-based puzzle game
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
│   │   │   ├── ControlHints.tsx  # On-screen control hints
│   │   │   ├── Crosshair.tsx     # FPS crosshair
│   │   │   ├── VisionModeIndicator.tsx
│   │   │   └── CameraModeIndicator.tsx
│   │   │
│   │   ├── demos/                # Interactive physics demos
│   │   │   ├── basics/           # Unit 0: Optical basics (3 demos)
│   │   │   │   ├── LightWaveDemo.tsx
│   │   │   │   ├── PolarizationIntroDemo.tsx
│   │   │   │   └── PolarizationTypesDemo.tsx
│   │   │   ├── unit1/            # Unit 1: Polarization fundamentals (4 demos)
│   │   │   ├── unit2/            # Unit 2: Interface reflection (2 demos)
│   │   │   ├── unit3/            # Unit 3: Transparent media (2 demos)
│   │   │   ├── unit4/            # Unit 4: Scattering (2 demos)
│   │   │   ├── unit5/            # Unit 5: Full polarimetry (2 demos)
│   │   │   ├── DemoCanvas.tsx    # 3D demo wrapper (R3F)
│   │   │   ├── Demo2DCanvas.tsx  # 2D demo wrapper (Canvas)
│   │   │   ├── DemoControls.tsx  # Shared demo UI controls
│   │   │   └── index.ts          # Barrel export
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
├── tailwind.config.js            # Tailwind CSS configuration
├── components.json               # shadcn/ui config
├── CLAUDE.md                     # This file
├── COURSE.md                     # Course curriculum
└── README.md                     # Chinese documentation
```

### Application Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | Landing page with game/course navigation |
| `/game` | `GamePage` | Full 3D voxel puzzle game with HUD |
| `/game2d` | `Game2DPage` | 2D SVG-based puzzle game (Monument Valley-style) |
| `/demos` | `DemosPage` | Interactive physics demos and course content |

### Core Components

| Component | Responsibility |
|-----------|----------------|
| `src/core/types.ts` | Type definitions, direction vectors, polarization colors |
| `src/core/World.ts` | Block storage, light propagation cellular automaton, levels |
| `src/core/LightPhysics.ts` | Static physics methods (four optical axioms) |
| `src/stores/gameStore.ts` | Global game state, actions, subscriptions |
| `src/components/game/Scene.tsx` | R3F scene composition, controls, lighting |
| `src/pages/Game2DPage.tsx` | 2D puzzle game logic, SVG rendering, level definitions |
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

// Block types - expanded for advanced puzzles
type BlockType =
  | 'air' | 'solid' | 'emitter' | 'polarizer' | 'rotator'
  | 'splitter' | 'sensor' | 'mirror'
  // Advanced optical components
  | 'prism'          // Dispersive refraction
  | 'lens'           // Focus/defocus light
  | 'beamSplitter'   // 50/50 split
  | 'quarterWave'    // Linear → circular polarization
  | 'halfWave'       // Flip polarization direction
  | 'absorber'       // Partial absorption
  | 'phaseShifter'   // Phase modulation
  | 'portal'         // Teleport light

// Block state - extended with advanced properties
interface BlockState {
  type: BlockType;
  rotation: number;              // 0, 90, 180, 270
  polarizationAngle: PolarizationAngle;
  rotationAmount: number;        // For rotator: 45 or 90
  activated: boolean;            // For sensor
  requiredIntensity: number;     // For sensor
  facing: Direction;
  // Extended properties
  absorptionRate: number;        // For absorber: 0-1
  phaseShift: number;            // For phaseShifter: 0, 90, 180, 270
  linkedPortalId: string | null; // For portal: linked portal ID
  splitRatio: number;            // For beamSplitter: 0-1 (default 0.5)
  focalLength: number;           // For lens: positive=convex, negative=concave
  dispersive: boolean;           // For prism: enable dispersion effect
}
```

### Block Types

**Core Blocks:**

| Type | Purpose | Key State |
|------|---------|-----------|
| `emitter` | Emits polarized light | `polarizationAngle`, `facing` |
| `polarizer` | Filters light (Malus's Law) | `polarizationAngle` |
| `rotator` | Rotates polarization without loss | `rotationAmount` (45 or 90) |
| `splitter` | Birefringent crystal (calcite) | `facing` |
| `sensor` | Detects light, triggers activation | `polarizationAngle`, `requiredIntensity`, `activated` |
| `mirror` | Reflects light | `facing` |
| `solid` | Blocks light | - |

**Advanced Blocks (extended system):**

| Type | Purpose | Key State |
|------|---------|-----------|
| `prism` | Refracts and disperses light | `dispersive` |
| `lens` | Focuses or diverges light | `focalLength` |
| `beamSplitter` | Splits beam 50/50 | `splitRatio` |
| `quarterWave` | Converts linear ↔ circular polarization | `rotationAmount` (90) |
| `halfWave` | Flips polarization direction | `rotationAmount` (180) |
| `absorber` | Partially absorbs light intensity | `absorptionRate` |
| `phaseShifter` | Shifts light phase | `phaseShift` |
| `portal` | Teleports light to linked portal | `linkedPortalId` |

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

## Tutorial Levels (3D Game)

| Level | Name | Concept |
|-------|------|---------|
| 0 | Light and Gate | Basic emitter → sensor, polarization matching |
| 1 | Polarizer | Light through filter, Malus's Law introduction |
| 2 | Malus's Law | Two polarizers, 90° blocking |
| 3 | Rotator | Wave plate rotates polarization losslessly |
| 4 | Birefringence | Calcite splitter creates two beams |

## 2D Puzzle Game

The 2D game (`/game2d`) offers a simplified, more accessible puzzle experience using SVG-based visuals inspired by Monument Valley and Shadowmatic aesthetics.

### 2D Game Features

- **SVG-based rendering** with animated light beams
- **Real-time light path calculation** using recursive ray tracing
- **Polarization color visualization** toggle
- **Keyboard controls** for component rotation (Arrow keys when selected)
- **Open-ended puzzles** - many levels have multiple valid solutions

### 2D Level Difficulty

| Difficulty | Levels | Complexity |
|------------|--------|------------|
| Easy | 0-2 | Basic polarizer/mirror mechanics |
| Medium | 3-5 | Rotators, splitters, L-shaped paths |
| Hard | 6-8 | Multiple sensors, maze navigation |
| Expert | 9-10 | Multiple light sources, complex routing |

### 2D Component Types

| Component | Interaction | Behavior |
|-----------|-------------|----------|
| Emitter | Locked (view only) | Emits polarized light in one direction |
| Polarizer | Click to select, rotate with ±15° | Filters light by Malus's Law |
| Mirror | Click to select, rotate 45°/135° | Reflects light at specified angle |
| Splitter | Locked (view only) | Creates o-ray (0°) and e-ray (90°) |
| Rotator | Click to toggle 45°/90° | Rotates polarization without intensity loss |
| Sensor | Locked (view only) | Activates when intensity/polarization match |

### 2D Controls

- **Click** - Select unlocked component
- **Arrow Left/Right** - Rotate selected component
- **Eye button** - Toggle polarization color display
- **Reset** - Restore level to initial state

## Course Structure (Interactive Demos)

The demos use two visualization approaches:
- **2D**: SVG + Framer Motion animations (clearer for wave/diagram visualizations)
- **3D**: React Three Fiber (for spatial relationships and 3D components)

| Unit | Topic | Demos | Visual Type |
|------|-------|-------|-------------|
| 0 (Basics) | Optical Fundamentals | Light Wave, Polarization Intro, Polarization Types | 2D |
| 1 | Light Polarization | Polarization State (3D), Malus's Law (2D), Birefringence (3D), Waveplate (3D) | Mixed |
| 2 | Interface Reflection | Fresnel Equations, Brewster's Angle | 2D |
| 3 | Transparent Media | Chromatic Polarization, Optical Rotation | 2D |
| 4 | Turbid Media | Mie Scattering, Rayleigh Scattering | 2D |
| 5 | Full Polarimetry | Stokes Vectors (3D), Mueller Matrices (2D) | Mixed |

### Course Difficulty Levels

The course implements a **3-tier difficulty system** based on research-oriented learning philosophy from COURSE.md:

| Difficulty Level | Icon | Target Audience | Learning Mode | Content Focus |
|------------------|------|----------------|---------------|---------------|
| **Foundation** (基础层) | 🌱 | Beginners, early undergraduates | PSRT: Problem-driven research introduction | Discover phenomena through simple explanations. No formulas required! Emphasizes "why" over "how to calculate" |
| **Application** (应用层) | 🔬 | Learners with basic knowledge | ESRT: Rotational research training | Hands-on experiments with quantitative formulas. Focus on measurement principles and experimental design |
| **Research** (研究层) | 🚀 | Advanced learners, graduate students | ORIC/SURF: Independent original research | Frontier research methods with rigorous academic treatment. Advanced theory and research perspective |

**Content Adaptation by Difficulty:**

Each demo adapts its content based on the selected difficulty level:

- **Foundation Level:**
  - Hides mathematical formulas
  - Uses simplified language and everyday analogies
  - Focuses on visual understanding and life scene connections
  - Maximum 2 physics details, 1 frontier application
  - Questions emphasize observation ("What do you see?")

- **Application Level:**
  - Shows key formulas (e.g., Malus's Law: I = I₀ × cos²θ)
  - Includes mathematical symbols and quantitative relationships
  - Emphasizes experimental design and measurement techniques
  - Maximum 3 physics details, 2 frontier applications
  - Questions emphasize design ("How can we measure?")

- **Research Level:**
  - Shows complete formula derivations
  - Uses rigorous academic terminology
  - Includes advanced concepts (Mueller matrices, Stokes vectors)
  - Maximum 4 physics details, 3 frontier applications
  - Questions emphasize exploration ("What if? How to improve?")

**Demo Difficulty Distribution:**

| Demo | Difficulty | Unit | Rationale |
|------|-----------|------|-----------|
| Light Wave | Foundation | 0 | Basic wave concepts, visual phenomena |
| Polarization Intro | Foundation | 0 | Introduction to polarization through life scenes |
| Polarization Types | Application | 0 | Quantitative distinction of three polarization states |
| Interactive Optical Bench | Application | 0 | Interactive experimental design |
| Polarization State | Foundation | 1 | 3D visualization for intuitive understanding |
| Malus's Law | Application | 1 | Quantitative measurement with cos² formula |
| Birefringence | Application | 1 | Calcite experiment phenomena and principles |
| Waveplate | Research | 1 | Phase retardation theory and calculations |
| Fresnel Equations | Research | 2 | Complex Fresnel formula derivation |
| Brewster's Angle | Application | 2 | Brewster angle measurement experiment |
| Anisotropy (Stress) | Foundation | 3 | Chromatic polarization in everyday stress visualization |
| Chromatic Polarization | Application | 3 | Experimental chromatic polarization and measurement |
| Optical Rotation | Application | 3 | Optical rotation experiment and sugar concentration |
| Rayleigh Scattering | Foundation | 4 | Natural phenomena: blue sky and white clouds |
| Mie Scattering | Research | 4 | Complex Mie scattering theory |
| Stokes Vector | Research | 5 | Mathematical representation of Stokes vectors |
| Mueller Matrix | Research | 5 | Complete characterization using Mueller matrices |

**Distribution Statistics:**
- Foundation: 5 demos (29%)
- Application: 7 demos (41%)
- Research: 5 demos (29%)

### Demo Controls Components

The `DemoControls.tsx` file provides shared UI components for all demos:

```tsx
// Slider with label and value display
<SliderControl
  label="Wavelength (λ)"
  value={wavelength}
  min={380}
  max={700}
  step={5}
  unit=" nm"
  onChange={setWavelength}
  color="cyan"
/>

// Toggle switch
<Toggle label="Show B Field" checked={showBField} onChange={setShowBField} />

// Control panel container
<ControlPanel title="Wave Parameters">
  {/* controls */}
</ControlPanel>

// Info card for explanations
<InfoCard title="Physics Principle" color="cyan">
  <p>Explanation text...</p>
</InfoCard>

// Value display
<ValueDisplay label="Frequency" value="5.45 × 10¹⁴ Hz" />
```

## Development Guidelines

### TypeScript Configuration

- Target: ES2020
- Strict mode enabled
- JSX: react-jsx
- Path alias: `@/*` → `./src/*`
- No unused locals/parameters
- No fallthrough in switch cases

### Code Style

- Use Chinese comments for physics/game logic explanations
- Use English for technical documentation
- Prefer functional components with hooks
- Use Zustand for global state, local state only for UI-specific concerns
- Use `cn()` utility for conditional classnames (Tailwind)
- All angles in degrees (converted to radians when needed)

### Adding a New Demo

1. Create component in appropriate `src/components/demos/unit*/` folder
2. Import component in `DemosPage.tsx`
3. Add demo info to `getDemoInfo()` function in `DemosPage.tsx`
4. Add demo entry to `DEMOS` array in `DemosPage.tsx`:
   ```typescript
   {
     id: 'my-demo',
     titleKey: 'demos.myDemo.title',
     unit: 1,
     component: MyDemoComponent,
     descriptionKey: 'demos.myDemo.description',
     visualType: '2D', // or '3D'
   }
   ```
5. Add translations to `src/i18n/locales/en.json` and `zh.json`
6. Export from `src/components/demos/index.ts`

### Adding a New Block Type (3D Game)

1. Add type to `BlockType` union in `src/core/types.ts`
2. Add default handling in `createDefaultBlockState()`
3. Add physics processing in `LightPhysics.ts` (if affects light)
4. Add case in `World.propagateLight()` switch statement
5. Add mesh rendering in `Blocks.tsx`
6. Update `BlockSelector.tsx` UI

### Adding a New 2D Level

All 2D levels are defined in `src/pages/Game2DPage.tsx` in the `LEVELS` array:

```typescript
{
  id: 11,                           // Unique level ID
  name: 'Level Name',               // English name
  nameZh: '关卡名称',                // Chinese name
  description: 'Level description', // English description
  descriptionZh: '关卡描述',         // Chinese description
  hint: 'Optional hint',            // English hint (optional)
  hintZh: '可选提示',                // Chinese hint (optional)
  difficulty: 'medium',             // 'easy'|'medium'|'hard'|'expert'
  gridSize: { width: 100, height: 100 },
  openEnded: true,                  // Multiple solutions possible
  components: [
    { id: 'e1', type: 'emitter', x: 15, y: 50, angle: 0,
      polarizationAngle: 0, direction: 'right', locked: true },
    { id: 'p1', type: 'polarizer', x: 50, y: 50, angle: 0,
      polarizationAngle: 45, locked: false },
    { id: 's1', type: 'sensor', x: 85, y: 50, angle: 0,
      requiredIntensity: 50, requiredPolarization: 45, locked: true },
  ],
}
```

**Component Position**: `x` and `y` are percentages (0-100) of the grid area.

**Locked Components**: Set `locked: true` for components players cannot modify.

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
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    }
  }
}
```

### Dependencies

**Frontend Production:**
- `react`, `react-dom` (v19) - UI framework
- `react-router-dom` (v7) - Client-side routing
- `three`, `@react-three/fiber`, `@react-three/drei` - 3D rendering
- `framer-motion` - 2D animations for course demos
- `zustand` - State management
- `i18next`, `react-i18next`, `i18next-browser-languagedetector` - Internationalization

**Frontend Development:**
- `typescript` - Type safety
- `vite`, `@vitejs/plugin-react` - Build tool
- `tailwindcss`, `@tailwindcss/vite` - Styling
- `lucide-react` - Icons
- `class-variance-authority`, `clsx`, `tailwind-merge` - Utility classes

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
- `src/types.ts` - Duplicated in `src/core/types.ts`

These files remain in the repository but can be safely removed in a future cleanup.

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

### Create a New Demo with Framer Motion

For 2D SVG-based demos with smooth animations:

```tsx
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'

export function MyDemo() {
  const [value, setValue] = useState(50)
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <div className="flex gap-6">
      {/* Visualization */}
      <div className="flex-1">
        <svg viewBox="0 0 700 300" className="w-full">
          <motion.path
            d="M 0,150 Q 100,50 200,150 T 400,150"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            animate={isPlaying ? { d: [...paths] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Controls */}
      <ControlPanel title="Parameters">
        <SliderControl
          label="Value"
          value={value}
          min={0}
          max={100}
          onChange={setValue}
        />
      </ControlPanel>
    </div>
  )
}
```

## Physics Reference

### Polarization Colors (Vision Mode)

| Angle | Color | Hex |
|-------|-------|-----|
| 0° (Horizontal) | Red | `#ff4444` |
| 45° | Orange/Yellow | `#ffaa00` |
| 90° (Vertical) | Green | `#44ff44` |
| 135° | Blue | `#4444ff` |

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
// When light passes through a polarizer
const outputIntensity = inputIntensity * Math.cos(angleDiff * Math.PI / 180) ** 2
```
