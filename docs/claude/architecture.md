# Architecture & Routes

## Directory Structure

```txt
polarisation/
├── src/                          # React application source
│   ├── App.tsx                   # Root component with React Router
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Global styles (Tailwind)
│   │
│   ├── core/                     # Core game logic (framework-agnostic)
│   │   ├── types.ts              # TypeScript types, constants, interfaces
│   │   ├── World.ts              # Voxel world, light propagation, levels
│   │   ├── LightPhysics.ts       # Polarized light physics (four axioms)
│   │   ├── WaveOptics.ts         # Wave optics calculations
│   │   └── JonesCalculus.ts      # Jones vector/matrix calculations
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── gameStore.ts          # Game state, actions, tutorial hints
│   │   ├── opticalBenchStore.ts  # Optical Design Studio state management
│   │   ├── labStore.ts           # Lab module state management
│   │   └── discoveryStore.ts     # Discovery/achievement tracking
│   │
│   ├── pages/                    # Page components
│   │   ├── HomePage.tsx          # Landing page with 6-module navigation
│   │   ├── EducationHubPage.tsx  # Module 1: Education hub
│   │   ├── ArsenalHubPage.tsx    # Module 2: Optical arsenal hub
│   │   ├── TheoryHubPage.tsx     # Module 3: Theory & simulation hub
│   │   ├── GameHubPage.tsx       # Module 4: Games hub
│   │   ├── GalleryHubPage.tsx    # Module 5: Gallery/showcase hub
│   │   ├── ResearchHubPage.tsx   # Module 6: Research hub
│   │   ├── ChroniclesPage.tsx    # Historical chronicles
│   │   ├── CoursePage.tsx        # Structured course content
│   │   ├── LearningHubPage.tsx   # Learning center with progress
│   │   ├── OpticalDesignPage.tsx # Modular optical design studio
│   │   ├── HardwarePage.tsx      # Hardware components guide
│   │   ├── DemosPage.tsx         # Interactive physics demos
│   │   ├── CalculationWorkshopPage.tsx  # Calculator hub
│   │   ├── Jones/Stokes/Mueller/PoincareSphere CalculatorPages
│   │   ├── GamePage.tsx          # Full 3D game with HUD
│   │   ├── Game2DPage.tsx        # 2D CSS/SVG-based puzzle game
│   │   ├── CardGamePage.tsx      # Polarization card game
│   │   ├── EscapeRoomPage.tsx    # Escape room puzzle game
│   │   ├── DetectiveGamePage.tsx # Detective mystery game
│   │   ├── ExperimentsPage.tsx   # Creative experiments module
│   │   ├── MerchandisePage.tsx   # Educational merchandise
│   │   ├── LabPage.tsx           # Research lab simulation
│   │   ├── ApplicationsPage.tsx  # Real-world applications showcase
│   │   └── index.ts              # Barrel export
│   │
│   ├── components/
│   │   ├── game/          # 3D game components (R3F): GameCanvas, Scene, Blocks, LightBeams, SelectionBox
│   │   ├── hud/           # Game HUD: BlockSelector, InfoBar, LevelSelector, LevelGoal, TutorialHint, HelpPanel, etc.
│   │   ├── demos/         # Interactive physics demos (basics/, unit1-5/, DemoCanvas, DemoControls, etc.)
│   │   ├── optical-studio/ # Optical Design Studio: OpticalCanvas, DeviceLibrary, Sidebar, Panels, etc.
│   │   ├── optical-design/ # Modular optical design: FreeDesignModule, OpticalPathsModule, DeviceGalleryModule
│   │   ├── shared/        # Shared components: optical SVGs, SEO, Footer, PersistentHeader, etc.
│   │   ├── course/        # Course: RelatedDemos, LensNavigator, LearningPathMap, PSRTQuestStage, etc.
│   │   ├── lab/           # Lab: ResearchTaskModal, DataChart, DataEntryTable
│   │   ├── experiments/   # Experiments: MichelLevyChart, ExperimentTools, CulturalShowcase, etc.
│   │   ├── gallery/       # Gallery: StressComparator, ThermalStressPlayer, etc.
│   │   ├── detective/     # Detective: DeductionPanel
│   │   ├── chronicles/    # Chronicles: BranchCard, CenturyNavigator, ConceptNetwork, etc.
│   │   ├── museum/        # Museum: GalleryHero, KnowledgeMap, LightPathOdyssey, etc.
│   │   ├── icons/         # Custom icons: ModuleIcons, HomeModuleIcons, DeviceIcons, logos
│   │   └── ui/            # UI primitives: button, dialog, tooltip, ErrorBoundary, etc.
│   │
│   ├── contexts/          # ThemeContext (dark/light)
│   ├── i18n/              # i18next config + locales (en.json, zh.json)
│   └── lib/utils.ts       # Utility functions (cn for classnames)
│
├── server/                # Backend (NestJS + Colyseus) - multiplayer planned
├── docs/claude/           # Detailed Claude documentation
├── index.html, package.json, vite.config.ts, tsconfig.json
├── CLAUDE.md              # Main development guide
├── COURSE.md              # Course curriculum
└── README.md              # Project documentation
```

## Application Routes

### Home & 6 Core Modules

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | Landing page with 6-module cards + Course section |
| `/chronicles` | `ChroniclesPage` | **Module 1**: Historical stories & experiments |
| `/studio` | `OpticalDesignPage` | **Module 2**: Device library & optical bench |
| `/demos` | `DemosPage` | **Module 3**: Interactive physics demos |
| `/demos/:demoId` | `DemosPage` | Deep link to specific demo |
| `/games` | `GameHubPage` | **Module 4**: Games hub |
| `/games/2d` | `Game2DPage` | 2D SVG-based puzzle game |
| `/games/3d` | `GamePage` | Full 3D voxel puzzle game |
| `/games/card` | `CardGamePage` | Polarization card game |
| `/games/escape` | `EscapeRoomPage` | Escape room puzzle game |
| `/games/detective` | `DetectiveGamePage` | Detective mystery game |
| `/gallery` | `ExperimentsPage` | **Module 5**: Creative gallery & experiments |
| `/gallery/:tabId` | `ExperimentsPage` | Deep link to specific tab |
| `/research` | `LabPage` | **Module 6**: Virtual research lab |
| `/research/applications` | `ApplicationsPage` | Real-world applications |

### Course & Utility Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/course` | `CoursePage` | P-SRT structured course content |
| `/learn` | `LearningHubPage` | Learning center with progress tracking |
| `/calc` | `CalculationWorkshopPage` | Calculator hub |
| `/calc/jones` | `JonesCalculatorPage` | Jones matrix calculator |
| `/calc/stokes` | `StokesCalculatorPage` | Stokes vector calculator |
| `/calc/mueller` | `MuellerCalculatorPage` | Mueller matrix calculator |
| `/calc/poincare` | `PoincareSphereViewerPage` | Poincare sphere visualization |
| `/hardware` | `HardwarePage` | Hardware components guide |
| `/merchandise` | `MerchandisePage` | Educational merchandise |

### Legacy Route Redirects

| Old Route | Redirects To |
|-----------|-------------|
| `/education` | `/chronicles` |
| `/arsenal` | `/studio` |
| `/theory` | `/demos` |
| `/optical-studio` | `/studio` |
| `/experiments` | `/gallery` |
| `/lab` | `/research` |
| `/applications` | `/research/applications` |
| `/game` | `/games/3d` |
| `/game2d` | `/games/2d` |
| `/cardgame` | `/games/card` |
| `/escape` | `/games/escape` |
| `/devices`, `/bench`, `/optics`, `/optical-studio-v2` | `/studio` |
| `/creative` | `/gallery` |
| `/simulation` | `/research` |
| `/lab/poincare`, `/lab/jones`, `/lab/stokes`, `/lab/mueller` | `/calc/*` |

## 6-Module Architecture

### Module 1: Education (实验内容与历史故事)
**Entry**: `/chronicles` - Chronicles, P-SRT Course, Learning Hub

### Module 2: Optical Arsenal (光学器件和典型光路)
**Entry**: `/studio` - Optical Studio, Device Library (80+), Hardware Guide

### Module 3: Theory & Simulation (基本理论和计算模拟)
**Entry**: `/demos` - 20+ Interactive Demos (6 units), Calculation Workshop, Poincare Sphere

### Module 4: Games (游戏化模块)
**Entry**: `/games` - 2D Puzzles (11 levels), 3D Voxel (5 levels), Card Game, Escape Room, Detective

### Module 5: Gallery (成果展示)
**Entry**: `/gallery` - Experiments, Merchandise, Student Showcases

### Module 6: Research (虚拟课题组)
**Entry**: `/research` - Virtual Lab, Applications, Collaboration

## Core Components

| Component | Responsibility |
|-----------|----------------|
| `src/core/types.ts` | Type definitions, direction vectors, polarization colors |
| `src/core/World.ts` | Block storage, light propagation cellular automaton, levels |
| `src/core/LightPhysics.ts` | Static physics methods (four optical axioms) |
| `src/core/WaveOptics.ts` | Wave optics calculations |
| `src/core/JonesCalculus.ts` | Jones vector/matrix calculations |
| `src/stores/gameStore.ts` | Global game state, actions, subscriptions |
| `src/stores/opticalBenchStore.ts` | Optical Design Studio state, light path calculation |
| `src/stores/labStore.ts` | Lab module state management |
| `src/stores/discoveryStore.ts` | Discovery/achievement tracking |
| `src/components/game/Scene.tsx` | R3F scene composition, controls, lighting |
| `src/pages/Game2DPage.tsx` | 2D puzzle game logic, SVG rendering, level definitions |
| `src/pages/DemosPage.tsx` | Demo navigation, info cards, SVG diagrams |
| `src/pages/OpticalDesignPage.tsx` | Modular optical design studio |
| `src/pages/HomePage.tsx` | 6-module landing page with Course section |
| `src/components/shared/Footer.tsx` | Site-wide footer navigation |
| `src/components/ui/ErrorBoundary.tsx` | React error boundary for graceful failures |
