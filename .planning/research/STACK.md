# Stack Research

**Domain:** Discovery-based learning open world for polarization optics education
**Researched:** 2026-02-20
**Confidence:** HIGH

## Current Project Baseline

The project already has a mature stack. The Odyssey module builds on top of it, not beside it.

| Already Installed | Version in package.json | Latest Verified | Action |
|-------------------|------------------------|-----------------|--------|
| react | ^19.2.1 | 19.2.1 | Keep |
| three | ^0.160.1 | 0.183.0 | **UPGRADE** |
| @react-three/fiber | ^9.4.2 | 9.5.0 | Upgrade |
| @react-three/drei | ^10.7.7 | 10.7.7 | Keep |
| @react-three/postprocessing | ^3.0.4 | 3.0.4 | Keep |
| postprocessing | ^6.38.2 | 6.38.2 | Keep |
| framer-motion | ^12.23.25 | 12.34.2 | Upgrade |
| zustand | ^5.0.9 | 5.0.11 | Upgrade |
| lenis | ^1.3.17 | 1.3.17 | Keep |
| i18next | ^25.7.2 | 25.7.2 | Keep |

### Critical: three.js Upgrade from 0.160 to ~0.175

**Why:** The project is 23 minor versions behind. While R3F 9.x peer-requires `>=0.156` and drei requires `>=0.159`, staying on 0.160 means missing critical shader fixes, WebGPU readiness, and performance improvements. However, jumping all the way to 0.183 risks breaking existing game components that use older APIs.

**Recommendation:** Upgrade to **~0.175** as a balanced target. This gets most shader/performance improvements without the breaking WebGPU-focused changes in 0.178+. The project does NOT need WebGPU yet (WebGL 2.0 is the requirement per PROJECT.md).

**Breaking changes to audit (0.160 to 0.175):**
- PBR material energy conservation changes (rough materials render brighter)
- `WebGLRenderer.copyTextureToTexture3D()` deprecated -> use `copyTextureToTexture()`
- TransformControls API changes (if used)
- Various shader uniform changes

**Confidence:** HIGH -- verified from three.js migration guide and npm registry.

## Recommended Stack (New Dependencies for Odyssey)

### Camera & Navigation System

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| camera-controls | 3.1.2 | Programmatic camera transitions | drei's `<CameraControls>` wraps this. Supports `setLookAt()` with smooth SmoothDamp transitions, promise-based animation chaining, and `smoothTime` tuning. Essential for "fly to region" open-world navigation. Already a transitive dependency of drei -- just use the drei wrapper. |

**How to use:** drei already exports `<CameraControls />`. No separate install needed. Use `ref.current.setLookAt(posX, posY, posZ, targetX, targetY, targetZ, true)` for smooth camera flights between regions.

**Confidence:** HIGH -- verified in drei docs and camera-controls npm.

### Custom Shaders (Light Beam Visualization)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| three-custom-shader-material | 6.4.0 | Extend MeshStandardMaterial with custom GLSL | Lets you add polarization visualization shaders on TOP of PBR lighting, without writing a full material from scratch. Output variables like `csm_FragColor`, `csm_Emissive`, `csm_Roughness` let you inject interference patterns while keeping physically correct lighting. |
| drei `shaderMaterial` | (bundled) | Pure custom shader materials | For beam/ray shaders that need full control (not extending a standard material). Already used in the project's existing `beam.glsl.ts`. |

**Recommendation:** Use `three-custom-shader-material` for environment materials that need polarization-dependent visual effects (birefringent crystals, stressed glass, etc.) and `shaderMaterial` from drei for the light beam rays themselves.

**Confidence:** HIGH -- CSM verified at npm 6.4.0 with peerDep three>=0.159.

### Math Utilities

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| maath | 0.10.8 | Math helpers: damping, easing, random distributions | From pmndrs ecosystem (same team as R3F). `damp`, `damp3` for smooth value transitions, `inSphere`/`inBox` for particle distributions. Tiny footprint, avoids reinventing interpolation math. |

**Confidence:** HIGH -- verified at npm, peerDep three>=0.134.

### Performance Monitoring (Dev Only)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| r3f-perf | 7.2.3 | In-scene FPS/draw-call/shader monitor | Critical for the 55fps performance target. Shows draw calls, shader count, texture memory, vertex count in real-time overlay. Use during development, strip from production via tree-shaking or conditional import. |

**Confidence:** HIGH -- verified at npm, peerDep react>=18.

### State Persistence (Exploration Progress)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| zustand/middleware (persist) | (bundled with zustand 5.x) | Save exploration state to localStorage | Already have zustand. The `persist` middleware saves discovery state (visited regions, unlocked areas, interaction history) to localStorage automatically. No new dependency needed. |

**Confidence:** HIGH -- zustand persist middleware is well-documented and already part of the installed package.

## What NOT to Install

### Physics Engine (@react-three/rapier)

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| @react-three/rapier | This is a polarization optics educational tool, NOT a physics game. Rapier adds ~500KB WASM bundle for rigid-body physics (gravity, collision, forces) that are irrelevant here. The "physics" in this project is OPTICAL physics (Mueller matrices, Jones vectors) which is already implemented in `src/core/physics/`. | Custom raycasting via three.js `Raycaster` for click/hover detection on optical elements. drei's `<BBAnchor>` and bounding-box helpers for interaction zones. |

### React Spring / @react-spring/three

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| @react-spring/three | The project already uses framer-motion extensively. Adding react-spring creates two competing animation systems. Framer Motion 12.x supports React 19 and has first-class R3F support via `motion` components. | `framer-motion` for DOM/2D animations, `maath.damp` + `useFrame` for 3D value interpolation, `camera-controls` smoothTime for camera animations. |

### Cannon.js / @react-three/cannon

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| @react-three/cannon | Same rationale as rapier -- no rigid-body physics needed. Cannon is also less maintained than rapier. | N/A |

### GSAP / Anime.js

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| gsap / animejs | License concerns (GSAP Business license for some features), unnecessary weight when framer-motion + maath cover all needs. Adding a third animation library fragments the codebase. | framer-motion + maath |

### WebGPU / TSL (Three Shading Language)

| Avoid (for now) | Why | Use Instead |
|-----------------|-----|-------------|
| WebGPURenderer / TSL | The project targets WebGL 2.0 per constraints. While WebGPU is production-ready as of 2026, adopting it means rewriting ALL existing shaders to TSL, and R3F v10 (which adds first-class WebGPU) is still in alpha. The cost-benefit ratio is terrible for this milestone. | WebGL 2.0 + standard GLSL shaders. Revisit WebGPU after R3F v10 stabilizes. |

### Scroll-Hijacking Libraries (locomotive-scroll, scrollmagic)

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| locomotive-scroll, scrollmagic | The open world is NOT scroll-driven (that was the failed odyssey-scroll approach). The world is click/drag/keyboard navigated in 3D space. Scroll hijacking libraries are for linear scrollytelling, which contradicts the open-world design philosophy. | drei `<CameraControls>` for camera navigation. Lenis ONLY if needed for 2D theory overlay panels that have internal scrolling. |

## Stack Patterns by Scenario

**For 3D immersive scenes (regions/zones):**
- drei `<CameraControls>` for navigation between regions
- drei `<Environment>`, `<Sky>`, `<Cloud>` for atmosphere
- drei `<Instances>` for repeated optical elements (multiple polarizers, crystals)
- drei `<Detailed>` (LOD) for distant environment geometry
- `three-custom-shader-material` for polarization-dependent material effects
- `@react-three/postprocessing` Bloom + Vignette for atmosphere
- `useFrame` + `maath.damp` for smooth per-frame animations

**For 2D theory overlay panels (when student dives deeper):**
- drei `<Html>` component to project HTML into 3D space, or
- Standard React DOM overlay on top of the canvas (via CSS `position: fixed`)
- `framer-motion` for panel enter/exit animations
- `katex` (already installed) for math formula rendering
- Existing demo components can be embedded directly

**For exploration state (discovery tracking):**
- zustand store with `persist` middleware
- Track: visited regions, interacted elements, discovered phenomena, time spent
- No server needed -- all localStorage for this milestone

**For performance-critical scenes (many optical elements):**
- drei `<Instances>` for batching identical geometries
- drei `<Detailed>` for LOD on distant elements
- Demand rendering (`frameloop="demand"`) when scene is static
- `<PerformanceMonitor>` from drei for adaptive DPR

## Version Compatibility Matrix

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| @react-three/fiber@^9.5 | three@>=0.156, react@^19 | Verified from npm registry |
| @react-three/drei@^10.7 | three@>=0.159, @react-three/fiber@^9 | Verified from npm registry |
| @react-three/postprocessing@^3.0 | three@>=0.156, @react-three/fiber@^9 | Verified from npm registry |
| three-custom-shader-material@^6.4 | three@>=0.159 | React/R3F optional peers |
| framer-motion@^12.34 | react@^18 or ^19 | Verified -- React 19 support confirmed Dec 2025 |
| maath@^0.10 | three@>=0.134 | Very permissive three.js peer |
| r3f-perf@^7.2 | react@>=18, three@>=0.133 | Dev dependency only |
| zustand@^5.0 | react@^18 or ^19 | Already installed and working |
| lenis@^1.3 | No framework peer deps | Pure JS, already installed |

**All packages are compatible with the project's React 19 + three.js 0.160+ stack.** No conflicts detected.

## Installation

```bash
# New dependencies
pnpm add three-custom-shader-material maath

# Dev dependencies
pnpm add -D r3f-perf

# Upgrades (run after auditing existing shaders for breaking changes)
pnpm add three@~0.175.0 @types/three@~0.175.0

# Optional upgrades (safe, no breaking changes)
pnpm add @react-three/fiber@^9.5.0 framer-motion@^12.34.0 zustand@^5.0.11
```

## Sources

- [@react-three/fiber npm registry](https://www.npmjs.com/package/@react-three/fiber) -- version 9.5.0, peerDeps verified (HIGH confidence)
- [@react-three/drei npm registry](https://www.npmjs.com/package/@react-three/drei) -- version 10.7.7 (HIGH confidence)
- [@react-three/postprocessing npm registry](https://www.npmjs.com/package/@react-three/postprocessing) -- version 3.0.4 (HIGH confidence)
- [three npm registry](https://www.npmjs.com/package/three) -- version 0.183.0 (HIGH confidence)
- [three-custom-shader-material npm](https://www.npmjs.com/package/three-custom-shader-material) -- version 6.4.0 (HIGH confidence)
- [maath GitHub](https://github.com/pmndrs/maath) -- version 0.10.8 (HIGH confidence)
- [r3f-perf npm](https://www.npmjs.com/package/r3f-perf) -- version 7.2.3 (HIGH confidence)
- [camera-controls npm](https://www.npmjs.com/package/camera-controls) -- version 3.1.2, SmoothDamp transitions (HIGH confidence)
- [framer-motion npm](https://www.npmjs.com/package/framer-motion) -- version 12.34.2, React 19 confirmed (HIGH confidence)
- [zustand npm](https://www.npmjs.com/package/zustand) -- version 5.0.11 (HIGH confidence)
- [lenis npm](https://www.npmjs.com/package/lenis) -- version 1.3.17 (HIGH confidence)
- [drei CameraControls docs](https://drei.docs.pmnd.rs/controls/introduction) -- wraps camera-controls (HIGH confidence)
- [drei Html docs](https://drei.docs.pmnd.rs/misc/html) -- 2D overlay in 3D space (HIGH confidence)
- [R3F scaling performance guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance) -- LOD, instancing, demand rendering (HIGH confidence)
- [three.js migration guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide) -- breaking changes 0.160 to latest (HIGH confidence)
- [React Postprocessing Bloom docs](https://react-postprocessing.docs.pmnd.rs/effects/bloom) -- selective bloom (HIGH confidence)

---
*Stack research for: Odyssey -- Discovery-based learning open world for polarization optics education*
*Researched: 2026-02-20*
