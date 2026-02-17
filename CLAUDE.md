# CLAUDE.md - PolarCraft Development Guide

## Project Overview

PolarCraft is an educational platform combining polarized light physics (Malus's Law, birefringence, interference) with interactive games, simulations, and course modules. Players manipulate polarized light beams to solve puzzles using optical components.

**Tech Stack:** React 19 + TypeScript (strict) | React Three Fiber + Three.js + drei | Framer Motion | Zustand | React Router v7 | Tailwind CSS v4 | i18next | Vite | Vitest | Backend (planned): NestJS + Colyseus

**Key Features:** 3D voxel puzzle (5 levels) | 2D puzzle (11 levels) | 20+ interactive demos (6 units) | Optical Design Studio (80+ devices) | Calculation Workshop (Jones/Stokes/Mueller/Poincare) | 6-module architecture | Multi-language (EN/ZH) | Dark/Light theme

## Quick Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server (http://localhost:5173)
npm run build        # Production build (tsc && vite build)
npm run preview      # Preview production build
npm run test         # Run tests (vitest watch)
npm run test:run     # Run tests once
npm run test:coverage # Tests with coverage
```

## Git Workflow

- Merge to `main` after completion; create feature branches from `main`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- English commit messages; reference issue numbers when applicable

## Code Style

- Chinese comments for physics/game logic; English for technical docs
- Functional components with hooks; Zustand for global state
- `cn()` utility for conditional Tailwind classnames
- All angles in degrees (convert to radians when needed)
- Path alias: `@/*` maps to `./src/*`
- TypeScript strict mode, no unused locals/parameters

## CSS Pitfalls

- **Tailwind variant escaping**: Use single backslash in raw CSS (`.print\:block`), NOT double (`\\:`), which causes lightningcss parse errors
- **pnpm strict resolution**: Add Vite plugin peer dependencies directly to `devDependencies`

## Detailed Documentation

For in-depth references, see the files in `docs/claude/`:

| Document | Contents |
|----------|----------|
| [architecture.md](docs/claude/architecture.md) | Directory structure, all routes (with legacy redirects), 6-module architecture, core components |
| [game-systems.md](docs/claude/game-systems.md) | Core types (LightPacket, BlockType, BlockState), physics axioms, block types, game controls, 2D/3D game details, state management, debugging |
| [optical-studio.md](docs/claude/optical-studio.md) | Optical Design Studio features, bench component types, store structure, light path calculation, adding experiments/challenges |
| [course-demos.md](docs/claude/course-demos.md) | Demo units (0-5), 3-tier difficulty system (Foundation/Application/Research), Calculation Workshop |
| [development-guide.md](docs/claude/development-guide.md) | How to add: hub pages, demos, block types, 2D levels, translations, languages, themes. Build config, dependencies, backend server |
