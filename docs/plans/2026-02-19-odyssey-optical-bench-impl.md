# Odyssey v3 — Optical Bench Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 2D scroll-driven immersive polarization optics course — a sci-fi optical bench where a beam of light flows through stations, each hosting an interactive physics demo.

**Architecture:** Vertical Lenis scroll drives the page. Each station has a horizontal BeamPathBar (SVG beam + optical element + physics readouts) at top, the existing demo component in the middle, and a progressive theory block at bottom. A fixed background with dot-grid and ambient particles creates the lab atmosphere. Zustand store manages scroll progress and a physics chain (Stokes vectors propagated through Mueller matrices station by station).

**Tech Stack:** React 19, Framer Motion (scroll animations), SVG (beam/elements), Tailwind v4, Lenis (smooth scroll), Zustand, KaTeX, existing `@/core/physics/unified` Mueller/Stokes engine.

---

## Task 1: Store + Smooth Scroll Hook

**Files:**
- Create: `src/components/odyssey-scroll/store.ts`
- Create: `src/components/odyssey-scroll/hooks/useSmoothScroll.ts`

**Step 1: Create the Zustand store**

```typescript
// src/components/odyssey-scroll/store.ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface BeamState {
  stokes: [number, number, number, number] // S0, S1, S2, S3
  intensity: number
}

export interface OpticalBenchState {
  // Scroll
  scrollProgress: number
  currentUnit: number
  currentStation: number

  // Physics chain: index = station global index, value = OUTPUT beam state
  beamStates: BeamState[]
  // Per-station adjustable parameter (e.g., polarizer angle in degrees)
  stationParams: Record<string, number>

  // Interaction
  isDragging: boolean
  activeStation: string | null

  // Navigation
  isNavExpanded: boolean

  // Actions
  setScrollProgress: (p: number) => void
  setCurrentPosition: (unit: number, station: number) => void
  setStationParam: (stationId: string, value: number) => void
  setBeamStates: (states: BeamState[]) => void
  setDragging: (d: boolean) => void
  setActiveStation: (id: string | null) => void
  setNavExpanded: (e: boolean) => void
}

const INITIAL_BEAM: BeamState = {
  stokes: [1, 0, 0, 0], // unpolarized, full intensity
  intensity: 1,
}

export const useOpticalBenchStore = create<OpticalBenchState>()(
  subscribeWithSelector((set) => ({
    scrollProgress: 0,
    currentUnit: 0,
    currentStation: 0,
    beamStates: [INITIAL_BEAM],
    stationParams: {},
    isDragging: false,
    activeStation: null,
    isNavExpanded: true,

    setScrollProgress: (p) => set({ scrollProgress: p }),
    setCurrentPosition: (unit, station) =>
      set({ currentUnit: unit, currentStation: station }),
    setStationParam: (stationId, value) =>
      set((s) => ({
        stationParams: { ...s.stationParams, [stationId]: value },
      })),
    setBeamStates: (states) => set({ beamStates: states }),
    setDragging: (d) => set({ isDragging: d }),
    setActiveStation: (id) => set({ activeStation: id }),
    setNavExpanded: (e) => set({ isNavExpanded: e }),
  }))
)
```

**Step 2: Create the Lenis smooth scroll hook**

```typescript
// src/components/odyssey-scroll/hooks/useSmoothScroll.ts
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useOpticalBenchStore } from '../store'

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    lenis.on('scroll', (e: { progress: number }) => {
      useOpticalBenchStore.getState().setScrollProgress(e.progress)
    })

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return lenisRef
}
```

**Step 3: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`
Expected: PASS (zero errors)

**Step 4: Commit**
```
feat(odyssey): add optical bench store and smooth scroll hook
```

---

## Task 2: ScrollBackground — Grid + Particles + Atmosphere

**Files:**
- Create: `src/components/odyssey-scroll/ScrollBackground.tsx`

**Step 1: Build the background component**

Three layers — dot grid (CSS radial-gradient), ambient particles (CSS-only animated divs), atmosphere glow (radial gradient keyed to current unit color).

```typescript
// src/components/odyssey-scroll/ScrollBackground.tsx
import { useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useOpticalBenchStore } from './store'

const UNIT_COLORS = ['#fbbf24', '#22d3ee', '#a78bfa', '#34d399', '#f472b6', '#60a5fa']
const PARTICLE_COUNT = 50

export function ScrollBackground() {
  const currentUnit = useOpticalBenchStore((s) => s.currentUnit)
  const color = UNIT_COLORS[currentUnit] ?? '#fbbf24'

  // Generate particle positions once
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2,
        duration: 15 + Math.random() * 25,
        delay: Math.random() * -20,
        opacity: 0.02 + Math.random() * 0.06,
      })),
    []
  )

  const { scrollYProgress } = useScroll()
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '-2%'])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dot grid — optical table M6 holes */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: gridY,
          backgroundImage: `radial-gradient(circle, ${color}08 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Atmosphere glow — follows current unit */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-[2000ms]"
        style={{
          width: '120vmax',
          height: '120vmax',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}05 0%, transparent 60%)`,
        }}
      />

      {/* CSS-only ambient particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-[drift_linear_infinite]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Inject the drift keyframes via style tag */}
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -15px); }
          50% { transform: translate(-8px, 5px); }
          75% { transform: translate(12px, 10px); }
        }
      `}</style>
    </div>
  )
}
```

**Step 2: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`

**Step 3: Commit**
```
feat(odyssey): add ScrollBackground with grid, particles, atmosphere
```

---

## Task 3: ScrollHero — Cinematic First Screen

**Files:**
- Modify: `src/components/odyssey-scroll/ScrollHero.tsx` (replace existing)

**Step 1: Rewrite the hero with beam animation preview**

Replace the current generic hero with one that features a horizontal beam animation preview — a miniature demo of light passing through a polarizer, the whole course in one visual.

Key elements: animated SVG beam (left→right), a small polarizer icon in the path, the beam dimming after the polarizer, title typography, scroll prompt.

The SVG beam uses CSS animation for the "flowing light" effect (moving gradient).

**Step 2: Verify TypeScript + build**

Run: `pnpm exec tsc --noEmit && pnpm run build`

**Step 3: Commit**
```
feat(odyssey): redesign ScrollHero with beam animation preview
```

---

## Task 4: BeamPathBar — The Core Scene Element

**Files:**
- Create: `src/components/odyssey-scroll/BeamPathBar.tsx`
- Create: `src/components/odyssey-scroll/optical-elements/PolarizerSVG.tsx`

**Step 1: Build the PolarizerSVG component**

SVG polarizer icon: disc with parallel grid lines, metal mount, rotatable. Receives `angle` (degrees) and `color` props. Uses `<g transform="rotate(...)">` for rotation.

**Step 2: Build the BeamPathBar component**

The horizontal beam path bar (~160px height) that appears at each station:

Layout:
```
[Input readout] ═══beam═══ [SVG element] ═══beam═══ [Output readout]
```

Props:
- `inputBeam: BeamState` — incoming Stokes/intensity
- `outputBeam: BeamState` — outgoing (computed)
- `elementType: 'polarizer' | 'crystal' | 'surface' | 'scatter' | 'generic'`
- `color: string` — unit color
- `paramValue: number` — current adjustable parameter (e.g., angle)
- `onParamChange: (v: number) => void` — drag/scroll callback
- `stationId: string`

Beam rendering: Two `<div>` rectangles (input beam, output beam) with:
- Width = fixed for input, width scaled by `outputBeam.intensity / inputBeam.intensity` for output
- CSS `box-shadow` for glow
- Background gradient = unit color
- CSS `animation: flowBeam 2s linear infinite` for flowing particle effect

The element SVG sits between the two beams. Input/output readout labels show `I/I₀` and angle in `font-mono` style.

Drag interaction: `onPointerDown` → `onPointerMove` → `onPointerUp` on the element SVG to control `paramValue`.

**Step 3: Verify TypeScript**

**Step 4: Commit**
```
feat(odyssey): add BeamPathBar with polarizer SVG and beam visuals
```

---

## Task 5: useBeamPhysics Hook — Physics Chain

**Files:**
- Create: `src/components/odyssey-scroll/hooks/useBeamPhysics.ts`

**Step 1: Build the physics chain hook**

Uses `MuellerMatrix` from `@/core/physics/unified/MuellerMatrix` and Stokes vectors. When `stationParams` change, recalculate the beam state chain:

```
Input (unpolarized) → Station 0 element → output 0 → Station 1 element → output 1 → ...
```

Each station type maps to a Mueller matrix:
- `polarizer` → `MuellerMatrix.linearPolarizer(angleDeg)`
- `crystal` → `MuellerMatrix.waveplate(retardanceDeg, axisDeg)`
- `surface` → `MuellerMatrix.linearPolarizer(0)` with custom Fresnel calculation
- `scatter` → `MuellerMatrix.partialDepolarizer(factor)`
- `generic` → `MuellerMatrix.identity()`

The hook subscribes to `stationParams` and recalculates `beamStates[]` via `setBeamStates()`.

**Step 2: Verify TypeScript**

**Step 3: Commit**
```
feat(odyssey): add useBeamPhysics hook for Stokes/Mueller chain
```

---

## Task 6: StationSection — Container + Header + Theory

**Files:**
- Modify: `src/components/odyssey-scroll/StationSection.tsx` (replace existing)
- Create: `src/components/odyssey-scroll/TheoryBlock.tsx`
- Create: `src/components/odyssey-scroll/OdysseyDemoEmbed.tsx`

**Step 1: Build TheoryBlock (progressive disclosure)**

Shows key insight by default. "Go deeper" link expands foundation text. Another link expands application. Another expands research. Uses `AnimatePresence` + `motion.div` with spring height animation. All levels accumulate (don't replace). KaTeX renders formulas.

**Step 2: Build OdysseyDemoEmbed (demo wrapper)**

Wraps a lazy demo component. Adds CSS overrides to suppress the demo's own `DemoHeader` and adjust padding/background for seamless integration:

```tsx
<div className="[&_[data-demo-header]]:hidden bg-transparent">
  <Suspense fallback={<DemoLoadingSkeleton color={color} />}>
    <DemoComponent difficultyLevel="foundation" />
  </Suspense>
</div>
```

Note: The existing demos don't have `data-demo-header` attribute yet. We add it to `DemoHeader` component in DemoLayout.tsx (a 1-line change: add `data-demo-header` to the root div). If that's not desired, use a class-based selector on the known header structure instead.

**Step 3: Build StationSection (full station container)**

Composes: `BeamPathBar` (top) → `StationHeader` (inline) → `OdysseyDemoEmbed` (middle) → `TheoryBlock` (bottom) → scale ruler (decorative bottom line).

Station header: station number (mono, small), title EN (bold, large), title ZH (light, muted), KaTeX formula (unit color, right-aligned on desktop).

**Step 4: Verify TypeScript**

**Step 5: Commit**
```
feat(odyssey): add StationSection, TheoryBlock, OdysseyDemoEmbed
```

---

## Task 7: OdysseyScrollExperience — Wire Everything

**Files:**
- Modify: `src/components/odyssey-scroll/OdysseyScrollExperience.tsx` (replace existing)

**Step 1: Rewrite the main experience component**

Compose all pieces:
1. `useSmoothScroll()` — init Lenis
2. `useBeamPhysics()` — init physics chain
3. `<ScrollBackground />` — fixed background
4. `<ScrollHero />` — first screen
5. For each unit in `UNIT_DATA`:
   - `<UnitTransition>` (between units)
   - For each station:
     - `<StationSection>` with `BeamPathBar` + `OdysseyDemoEmbed` + `TheoryBlock`
6. Footer

Scroll position → determine `currentUnit` / `currentStation` via `IntersectionObserver` on station refs.

**Step 2: Verify TypeScript + full build**

Run: `pnpm exec tsc --noEmit && pnpm run build`

**Step 3: Commit**
```
feat(odyssey): wire OdysseyScrollExperience with all components
```

---

## Task 8: UnitTransition + BeamConnector

**Files:**
- Create: `src/components/odyssey-scroll/UnitTransition.tsx`
- Create: `src/components/odyssey-scroll/BeamConnector.tsx`

**Step 1: Build UnitTransition**

Full-screen section between units. Large unit title (EN, semi-transparent), subtitle, station count. Background color transition (radial gradient from previous unit color to next). Framer Motion `whileInView` for fade-in.

**Step 2: Build BeamConnector**

SVG curved arc connecting one station's output beam to the next station's input beam. An S-curve path drawn with SVG `<path>` and animated `pathLength` via Framer Motion `useScroll`/`useTransform`.

**Step 3: Commit**
```
feat(odyssey): add UnitTransition and BeamConnector
```

---

## Task 9: SideNav — Progress Navigation

**Files:**
- Create: `src/components/odyssey-scroll/SideNav.tsx`

**Step 1: Build the fixed right-side navigation**

6 dots (one per unit), connected by a thin line. Current unit dot glows with unit color. Hover expands to show unit name. Click scrolls to unit. Auto-collapses after 3s idle (Framer Motion animate).

Hidden on mobile (md:block).

**Step 2: Commit**
```
feat(odyssey): add SideNav progress navigation
```

---

## Task 10: Additional SVG Elements + Polish

**Files:**
- Create: `src/components/odyssey-scroll/optical-elements/CrystalSVG.tsx`
- Create: `src/components/odyssey-scroll/optical-elements/GlassSurfaceSVG.tsx`
- Create: `src/components/odyssey-scroll/optical-elements/WaveplateSVG.tsx`
- Create: `src/components/odyssey-scroll/optical-elements/ScatterMediumSVG.tsx`

**Step 1: Build remaining optical element SVGs**

Each follows the same pattern as PolarizerSVG: stroke-based, receives `color`/`angle`/`size` props, uses unit color for accents, has hover glow effect.

**Step 2: Wire into BeamPathBar**

Map `station.config.id` → element type → SVG component (same mapping table from the v2 design).

**Step 3: Full integration test**

Run: `pnpm exec tsc --noEmit && pnpm run build`
Manual: Open `/odyssey`, scroll through. Verify beam responds to stations, demos load, theory expands.

**Step 4: Commit**
```
feat(odyssey): add all SVG optical elements and complete integration
```

---

## Task 11: Add data-demo-header Attribute

**Files:**
- Modify: `src/components/demos/DemoLayout.tsx` (1 line change)

**Step 1: Add data attribute to DemoHeader**

In `DemoHeader` component, add `data-demo-header` to the root element so `OdysseyDemoEmbed` can target it with CSS:

Find the root div/header in `DemoHeader` and add the attribute.

**Step 2: Verify no regressions**

Run: `pnpm exec tsc --noEmit && pnpm run build`
Check that existing `/demos/:demoId` routes still render normally.

**Step 3: Commit**
```
fix(demos): add data-demo-header attribute for Odyssey embed styling
```

---

## Dependency Graph

```
Task 1 (Store + Scroll) ─────┬──→ Task 5 (Physics)
                              │
Task 2 (Background) ──────┐  │
                           ├──┼──→ Task 7 (Wire All) ──→ Task 8 (Transitions)
Task 3 (Hero) ─────────────┤  │                      ──→ Task 9 (SideNav)
                           │  │                      ──→ Task 10 (SVG Elements)
Task 4 (BeamPathBar) ──────┤  │
                           │  │
Task 6 (Station+Theory) ───┘──┘

Task 11 (data attribute) ──→ can be done anytime
```

Tasks 1-6 can be parallelized. Task 7 depends on all of 1-6. Tasks 8-10 depend on 7.
