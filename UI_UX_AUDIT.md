# PolarCraft UI/UX System Audit Report

**Date**: 2026-02-12
**Auditor**: Lead UI/UX Designer & Creative Frontend Engineer
**Scope**: Full application — Design System, Components, Interactions, Accessibility

---

## Executive Summary

PolarCraft has a **functional but inconsistent** UI layer. The 3D game engine demonstrates excellent physics-driven visual feedback, but the surrounding UI shell (HUD, pages, forms) lacks a unified design language. Key findings:

| Area | Score | Verdict |
|------|-------|---------|
| Design System Foundation | **4/10** | Semantic tokens defined but ~0.6% adoption; raw colors dominate |
| Component Consistency | **5/10** | shadcn/ui primitives exist but HUD reinvents its own patterns |
| Physics Micro-Interactions (3D) | **9/10** | Exceptional — physics-first animations tightly coupled to state |
| Physics Micro-Interactions (UI) | **3/10** | No UI-level reactions to physics events (no screen shake, no meter pulse) |
| Accessibility | **5/10** | Some ARIA support; contrast gaps; no progress-bar semantics |
| Typography | **4/10** | No defined scale; 122+ ad-hoc `text-[Xpx]` instances |

**Bottom line**: The 3D world is polished. The 2D UI around it needs a systematic iteration pass.

---

## Phase 1: Design System Foundation

### 1.1 Color System Audit

#### What Exists

Three color systems coexist without clear hierarchy:

| System | Where Defined | Adoption |
|--------|---------------|----------|
| **shadcn/ui CSS variables** | `src/index.css` lines 4-31 | ~14 component uses (0.6%) |
| **Tailwind config tokens** | `tailwind.config.js` lines 49-82 | Partial (polarization, tech) |
| **Raw Tailwind classes** | Inline in components | ~2,500+ instances (dominant) |

#### Problem: Three Conflicting Color Authorities

```
CSS Variables (index.css)          Tailwind Config              Inline Classes
─────────────────────────         ──────────────────           ────────────────
--color-primary: hsl(199 89% 70%)  tech.cyan: '#00f0ff'        bg-cyan-500/20
--color-background: hsl(222 47% 5%) tech.dark.bg: '#050510'    bg-slate-900
--color-destructive: hsl(0 62% 55%) polarization.0: '#ff4444'  bg-red-500/10
```

A developer styling a button today would not know which system to reach for.

#### Hardcoded Color Audit Results

| Category | Count | Examples |
|----------|-------|---------|
| Raw hex in SVG components | 43 | `#22d3ee`, `#ef4444`, `#fbbf24` in optical SVGs |
| Inline `rgba()` values | 149 | `rgba(34, 211, 238, 0.3)` in chronicles, demos |
| Raw Tailwind colors (`bg-slate-*`, `text-gray-*`) | ~2,500+ | Everywhere |
| Semantic tokens (`bg-primary`, `text-foreground`) | ~14 | button.tsx, dialog.tsx only |

#### Custom Utility Classes: Defined, Never Used

The following classes are defined in `src/index.css` but have **zero** usage in any component:

- `.tech-card` (line 57) — glassmorphism card with cyan glow
- `.tech-text-glow` (line 63) — cyan text shadow
- `.tech-border-glow` (line 67) — cyan box shadow
- `.game-panel` (line 83) — dark blurred panel
- `.game-button` (line 91) — cyan-bordered button

These represent dead code that was meant to be the design language but was never adopted.

#### Polarization Color Variables: Defined, Not Referenced

```css
/* Defined in index.css lines 26-30 */
--color-polarization-0: #ff4444;
--color-polarization-45: #ffaa00;
--color-polarization-90: #44ff44;
--color-polarization-135: #4444ff;
```

Components instead hardcode these same hex values directly (e.g., `BlockSelector.tsx`, `HelpPanel.tsx`, `Blocks.tsx`), creating maintenance risk.

### 1.2 Typography Audit

#### Current State

| Aspect | Finding |
|--------|---------|
| **Primary font** | `'Segoe UI', 'Microsoft YaHei', sans-serif` — system fonts, no custom import |
| **Monospace** | `font-mono` (Tailwind default) — 1,158 uses across 139 files |
| **Custom sizes** | 122+ instances of `text-[10px]`, `text-[11px]`, `text-[12px]` |
| **Heading hierarchy** | No semantic `<h1>`-`<h6>` system; headings are styled divs |
| **Tailwind config** | Zero typography extensions (no custom fontSize, fontFamily, fontWeight) |

#### Size Distribution

| Size | Occurrences | Role |
|------|-------------|------|
| `text-xs` / `text-[10px]` | Very high | Labels, metadata, HUD |
| `text-sm` | 509 | Primary body text — **de facto base** |
| `text-base` | 22 | Almost unused |
| `text-lg` | 93 | Section headers |
| `text-xl` | 39 | Module headers |
| `text-2xl`+ | Scattered | Hero/page titles |

**Problem**: `text-sm` (14px) is the de facto body text, while `text-base` (16px) is barely used. This inverts the expected hierarchy. The custom pixel sizes (`text-[10px]`) bypass Tailwind's scale entirely, creating an ungoverned micro-typography layer.

#### Weight Distribution

| Weight | Count | Usage |
|--------|-------|-------|
| `font-medium` | 592 | Default emphasis — overused |
| `font-semibold` | 319 | Section headings |
| `font-bold` | 242 | Major headings |

No consistent mapping of weight-to-role exists. Similar elements (section headers) use `font-bold` in some pages and `font-semibold` in others.

### 1.3 Border Radius & Spacing

| Token | Value | Consistency |
|-------|-------|-------------|
| `--radius` | `0.5rem` | Defined but rarely referenced |
| `rounded-lg` | Used in buttons/cards | ~60% consistent |
| `rounded-xl` | Used in some panels | Ad-hoc |
| `rounded-md` | Used in dialogs | Via shadcn |

**Background opacity hierarchy** is undefined — values range from `/50` to `/95` with no rationale:

```
InfoBar:        bg-slate-800/50    (most transparent)
ControlHints:   bg-black/70
LevelGoal:      bg-black/80
TutorialHint:   bg-black/90
HelpPanel:      bg-slate-900/95    (most opaque)
```

### 1.4 Proposed "Optical Lab" Theme Extension

```js
// Proposed addition to tailwind.config.js → theme.extend
{
  colors: {
    // Semantic layer (component-facing)
    'laser': {
      DEFAULT: '#22d3ee',      // Primary beam color
      active: '#00f0ff',       // Activated state
      dim: 'rgba(34,211,238,0.15)', // Subtle backgrounds
      glow: 'rgba(34,211,238,0.5)', // Glow effects
    },
    'sensor': {
      inactive: '#334455',
      active: '#00dd44',
      glow: 'rgba(0,221,68,0.5)',
    },
    'warning': {
      DEFAULT: '#fbbf24',      // Amber warning
      dim: 'rgba(251,191,36,0.15)',
    },
    'violation': {
      DEFAULT: '#ef4444',      // Physics error red
      dim: 'rgba(239,68,68,0.15)',
    },
    // Surfaces
    'panel': {
      DEFAULT: 'rgba(0,0,0,0.75)',    // Standard HUD panel
      solid: 'hsl(222 47% 8%)',        // Opaque card
      hover: 'rgba(0,0,0,0.85)',       // Hovered panel
    },
  },
  fontSize: {
    'micro': ['10px', { lineHeight: '14px' }],   // Replace text-[10px]
    'caption': ['11px', { lineHeight: '16px' }],  // Replace text-[11px]
    'data': ['12px', { lineHeight: '16px', fontFamily: 'monospace' }],
  },
  backdropBlur: {
    'panel': '8px',    // Standard HUD glassmorphism
  },
  boxShadow: {
    'laser': '0 0 15px rgba(34,211,238,0.15)',
    'laser-active': '0 0 25px rgba(34,211,238,0.3)',
    'sensor-active': '0 0 20px rgba(0,221,68,0.3)',
  },
}
```

---

## Phase 2: Component & Pattern Review

### 2.1 UI Primitive Inventory

| Component | File | Used By | Quality |
|-----------|------|---------|---------|
| `Button` | `ui/button.tsx` | Mostly pages, NOT HUD | Has `game` variant (good) |
| `Dialog` | `ui/dialog.tsx` | `HelpPanel` only | Custom impl, no Radix |
| `Tooltip` | `ui/tooltip.tsx` | Limited | Custom impl, no delay support |
| `ErrorBoundary` | `ui/ErrorBoundary.tsx` | App-level | Uses raw Tailwind, no tokens |
| `DiscoveryNotification` | `ui/DiscoveryNotification.tsx` | Discovery system | Best-in-class Framer Motion |

### 2.2 HUD vs UI Primitive Divergence

The HUD components (`src/components/hud/`) do **not** use the shared UI primitives. Every HUD component reinvents button styling:

```tsx
// BlockSelector.tsx — custom button
<button className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-700/80 ...">

// CameraModeIndicator.tsx — custom button
<button className="flex items-center gap-2 px-4 py-2.5 bg-black/70 ...">

// LevelGoal.tsx — custom button
<button className="w-full px-3 py-2 bg-green-500/20 border border-green-500/50 ...">

// Meanwhile, Button component has a "game" variant that goes unused:
// variant: "game" → "bg-cyan-400/20 border border-cyan-400/50 text-cyan-400"
```

**Impact**: Inconsistent padding, radius, hover states, and focus rings across the game UI.

### 2.3 Button State Audit

| State | `Button` (ui/) | HUD Buttons | Assessment |
|-------|----------------|-------------|------------|
| Hover | `hover:bg-primary/90` | Various hover patterns | Inconsistent |
| Active | None defined | `transform: scale(0.95)` in CSS only | Missing in most |
| Disabled | `disabled:opacity-50 disabled:pointer-events-none` | Ad-hoc (`text-gray-600`) | Inconsistent |
| Loading | Not defined | Not defined | **Missing entirely** |
| Focus | `focus-visible:ring-2` | Not applied | **Missing in HUD** |

### 2.4 Feedback Consistency

| Pattern | Implementation | Consistent? |
|---------|----------------|-------------|
| Success notification | `DiscoveryNotification` (Framer Motion toast) | Isolated to discoveries |
| Error display | `ErrorBoundary` (full-page fallback) | No inline error toasts |
| Level complete | Inline text "Level Complete!" in `LevelGoal` | No celebration animation |
| Physics error | Red flash in 3D world only | No HUD-level error indicator |

**Gap**: There is no shared toast/notification system. `DiscoveryNotification` is well-built (Framer Motion, auto-dismiss, positioning) but is the only notification component. Errors, successes, and warnings elsewhere use ad-hoc inline text.

### 2.5 Glassmorphism Audit

| Component | Has Backdrop Blur? | Recommendation |
|-----------|-------------------|----------------|
| BlockSelector | No | Add `backdrop-blur-sm` |
| CameraModeIndicator | No | Add `backdrop-blur-sm` |
| ControlHints | Yes (`backdrop-blur-sm`) | Keep |
| HelpPanel | No (`bg-slate-900/95`) | Add, reduce opacity |
| InfoBar | Partial (`bg-slate-800/50`) | Add explicit blur |
| LevelGoal | No (`bg-black/80`) | Add `backdrop-blur-sm` |
| TutorialHint | No (`bg-black/90`) | Add `backdrop-blur-sm` |
| DiscoveryNotification | Yes (`backdrop-blur-md`) | Keep — reference implementation |

`DiscoveryNotification` is the **gold standard** for the glassmorphism pattern in this codebase. Other HUD panels should match it.

---

## Phase 3: Physics-Aware Micro-Interactions

### 3.1 What Works (3D Game Layer — Score: 9/10)

The 3D game layer is exceptionally well-designed. All visual feedback derives from physics state:

| Physics Event | Visual Feedback | File |
|---------------|----------------|------|
| Light intensity change | Beam radius + opacity scales proportionally | `LightBeams.tsx:258-261` |
| Polarization angle change | Beam color + E-vector arrow reorients | `LightBeams.tsx:123-155` |
| Conservation violation | Red flashing beam at 4Hz | `LightBeams.tsx:319-343` |
| Sensor activation | Color shift + LED + glow ring + label update | `Blocks.tsx:701-803` |
| Block rotation | Grid lines rotate, arrow reorients, light recalculates | `Blocks.tsx:457-514` |
| Vision mode toggle | Scene background color shifts | `Scene.tsx:31` |

**Architecture**: `useFrame` hooks with imperative Three.js updates — correct choice over Framer Motion for frame-synchronized physics rendering.

### 3.2 What's Missing (UI/HUD Layer — Score: 3/10)

The HUD does not react to physics events. When a sensor activates, the 3D block glows green, but the `LevelGoal` panel merely changes a CSS class with no animation:

```tsx
// LevelGoal.tsx:55-68 — Static class toggle, no motion
<div className={cn(
  "flex items-center gap-2 text-xs",
  sensor.activated ? "text-green-400" : "text-gray-400"
)}>
```

**Missing micro-interactions:**

| Event | Current UI Response | Proposed Response |
|-------|--------------------|--------------------|
| Sensor activates | Class toggle (green text) | Framer Motion scale pulse + glow flash |
| All sensors active (level complete) | Inline text "Level Complete!" | Full-screen harmonic ripple + confetti |
| Intensity drops below threshold | Nothing | Meter shake + amber pulse |
| Block placed successfully | Nothing | Subtle pop animation on BlockSelector |
| Block placement blocked | Nothing | Red flash on attempted position |

### 3.3 Proposed Framer Motion Variants

#### Animation 1: Sensor Activation Pulse

When a sensor goes from `activated: false` to `activated: true`, the corresponding LevelGoal indicator should pulse:

```tsx
// Proposed for LevelGoal.tsx
import { motion } from 'framer-motion'

const sensorVariants = {
  inactive: { scale: 1, boxShadow: '0 0 0px rgba(0,221,68,0)' },
  active: {
    scale: [1, 1.3, 1],
    boxShadow: [
      '0 0 0px rgba(0,221,68,0)',
      '0 0 20px rgba(0,221,68,0.8)',
      '0 0 8px rgba(0,221,68,0.3)',
    ],
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

<motion.div
  variants={sensorVariants}
  animate={sensor.activated ? 'active' : 'inactive'}
  className={cn("w-4 h-4 rounded-full border-2 ...", ...)}
>
```

#### Animation 2: Level Complete Celebration

When `isLevelComplete` transitions to `true`, trigger a screen-edge ripple effect:

```tsx
// Proposed physics-resonance victory effect
const victoryVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200,
    },
  },
}

// Radial light burst overlay
const rippleVariants = {
  initial: { scale: 0, opacity: 0.8 },
  animate: {
    scale: 4,
    opacity: 0,
    transition: { duration: 1.2, ease: 'easeOut' },
  },
}
```

#### Animation 3: Intensity Danger Feedback

When light intensity at a sensor falls below required threshold (close but not enough), the progress bar should visually warn:

```tsx
// Proposed for LevelGoal progress bar
const progressVariants = {
  normal: { x: 0 },
  danger: {
    x: [-2, 2, -2, 2, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
}

// Trigger when activatedCount > 0 but < totalCount and no recent progress
```

---

## Phase 4: Accessibility & Heuristics

### 4.1 Contrast Audit

| Element | Foreground | Background | Ratio | WCAG AA |
|---------|-----------|------------|-------|---------|
| HUD labels (`text-gray-400`) | `#9ca3af` | `rgba(0,0,0,0.8)` | ~6.5:1 | Pass |
| Muted text (`text-gray-500`) | `#6b7280` | `rgba(0,0,0,0.8)` | ~4.2:1 | Pass (large) |
| Disabled buttons (`text-gray-600`) | `#4b5563` | `rgba(0,0,0,0.7)` | ~2.8:1 | **Fail** |
| Tutorial hint text | `text-gray-300` on `bg-black/90` | ~9:1 | Pass |
| Error details (`text-xs`) | `text-gray-500` on `bg-slate-900` | ~3.5:1 | **Fail (small text)** |

**Failing elements**: Disabled button text and small error detail text do not meet WCAG AA 4.5:1 for normal text.

### 4.2 Keyboard Navigation Audit

| Feature | Keyboard Support | Assessment |
|---------|-----------------|------------|
| Block selection (1-7 keys) | Yes | Good |
| Block rotation (R key) | Yes | Good |
| Vision mode (V key) | Yes | Good |
| Camera cycle (C key) | Yes | Good |
| Polarizer rotation in 2D | Arrow keys when selected | Good |
| HUD button focus rings | **Missing** in most HUD components | Needs fix |
| Dialog close (Escape) | Not implemented (Dialog uses click-overlay) | Needs fix |
| Tab navigation through HUD | Not tested/implemented | Needs fix |
| Level selector navigation | Buttons have titles but no focus indicators | Needs fix |

**Critical gap**: The custom `Dialog` component (`ui/dialog.tsx`) does not trap focus or respond to Escape key. It relies on click-to-close overlay only.

### 4.3 ARIA & Semantic HTML

| Component | ARIA Status | Issues |
|-----------|-------------|--------|
| `BlockSelector` | Good (`aria-label`, `aria-expanded`, `aria-pressed`) | — |
| `CameraModeIndicator` | Good (`aria-label`) | — |
| `VisionModeIndicator` | Good (`aria-label`, `aria-pressed`) | — |
| `LevelGoal` progress bar | **Missing** | No `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| `TutorialHint` progress dots | **Missing** | No progress semantics |
| `InfoBar` SVG diagrams | **Missing** | No `role="img"`, no `<title>` or `<desc>` |
| `HelpPanel` color swatches | **Missing** | Color-only differentiation without text labels |

### 4.4 Error Prevention

| Scenario | Current Behavior | Recommendation |
|----------|-----------------|----------------|
| Reset level | Immediate reset, no confirmation | Add confirmation dialog for levels with placed blocks |
| Delete block (right-click) | Immediate, no undo | Consider Ctrl+Z undo stack for block operations |
| Navigate away from unsolved level | No warning | Store partial progress in localStorage |

### 4.5 Tooltip Coverage

| Toolbar Element | Has Tooltip? | Content |
|----------------|-------------|---------|
| Block types (1-7) | Names shown in selector | No physics diagram on hover |
| Emitter | Label only | Should show: emission direction, polarization angle |
| Polarizer | Label only | Should show: Malus's Law mini-diagram |
| Quarter Wave Plate | Label only | Should show: linear-to-circular conversion diagram |
| Rotator | Label only | Should show: rotation amount visual |
| Mirror | Label only | Should show: reflection angle visual |

**Recommendation**: Implement rich tooltips using the existing `Tooltip` component that show a small SVG physics diagram for each optical component, similar to the diagrams already in `InfoBar.tsx`.

---

## Priority Action Items

### Tier 1: Foundation (High Impact, Moderate Effort)

| # | Action | Files | Impact |
|---|--------|-------|--------|
| 1 | **Consolidate color constants** — Extract polarization colors, laser colors, sensor colors to `src/core/colors.ts` and reference everywhere | `types.ts`, `Blocks.tsx`, `BlockSelector.tsx`, `HelpPanel.tsx`, all optical SVGs | Eliminates 50+ hardcoded hex values |
| 2 | **Adopt semantic tokens in HUD** — Replace `bg-black/80` with `bg-panel`, `text-green-400` with `text-sensor-active` etc. using proposed theme extension | All `hud/` components | Enables future theming |
| 3 | **Unify HUD buttons** — Use `Button` component with `game` variant instead of custom classes | `BlockSelector`, `LevelSelector`, `LevelGoal`, `CameraModeIndicator` | Consistent hover/focus/disabled states |

### Tier 2: Interaction Polish (High Impact, Low-Moderate Effort)

| # | Action | Files | Impact |
|---|--------|-------|--------|
| 4 | **Add sensor activation pulse** — Framer Motion variant on LevelGoal sensor indicators | `LevelGoal.tsx` | Connects HUD to physics events |
| 5 | **Add level-complete celebration** — Framer Motion overlay with spring animation | New `VictoryOverlay.tsx` | Improves game feel significantly |
| 6 | **Add glassmorphism to all HUD panels** — `backdrop-blur-sm bg-panel` | `BlockSelector`, `LevelGoal`, `TutorialHint`, `InfoBar` | Visual cohesion |

### Tier 3: Accessibility (Medium Impact, Low Effort)

| # | Action | Files | Impact |
|---|--------|-------|--------|
| 7 | **Add ARIA to progress bars** — `role="progressbar"` + `aria-valuenow` | `LevelGoal.tsx`, `TutorialHint.tsx` | Screen reader support |
| 8 | **Add focus-visible rings to HUD buttons** — `focus-visible:ring-2 focus-visible:ring-cyan-400` | All `hud/` interactive elements | Keyboard navigation |
| 9 | **Fix contrast on disabled states** — Use `text-gray-500` minimum (not `text-gray-600`) | `LevelSelector.tsx`, `ErrorBoundary.tsx` | WCAG AA compliance |
| 10 | **Add Escape key to Dialog** — Keyboard event listener for close | `ui/dialog.tsx` | Standard dialog behavior |

### Tier 4: Typography & Polish (Lower Impact, Higher Effort)

| # | Action | Files | Impact |
|---|--------|-------|--------|
| 11 | **Extend Tailwind typography scale** — Add `text-micro`, `text-caption`, `text-data` | `tailwind.config.js` | Eliminates 122+ `text-[Xpx]` |
| 12 | **Define heading hierarchy** — Create `text-h1` through `text-h4` utilities | `tailwind.config.js`, page components | Consistent visual hierarchy |
| 13 | **Add rich tooltips to toolbar** — Physics diagrams on hover for each block type | `BlockSelector.tsx`, `Tooltip.tsx` | Educational value |
| 14 | **Remove dead CSS** — Delete unused `.tech-card`, `.game-panel`, `.game-button` classes | `index.css` | Code hygiene |

---

## Appendix A: File-Level Findings

### HUD Component Grades

| Component | Code | A11y | Design | Responsive | Overall |
|-----------|------|------|--------|------------|---------|
| `BlockSelector.tsx` | A- | A | A | A | **A** |
| `CameraModeIndicator.tsx` | A | A | A | A- | **A** |
| `ControlHints.tsx` | A- | B | A- | A | **A-** |
| `Crosshair.tsx` | A | A | N/A | A | **A** |
| `HelpPanel.tsx` | A | C | A- | A- | **B+** |
| `InfoBar.tsx` | B+ | C | B+ | B | **B** |
| `LevelGoal.tsx` | A- | B | A | B+ | **B+** |
| `LevelSelector.tsx` | A | A | A | A+ | **A** |
| `TutorialHint.tsx` | B+ | C | A | A- | **B+** |
| `VisionModeIndicator.tsx` | A | A | A | B+ | **A-** |

### 3D Game Component Grades

| Component | Physics Coupling | Visual Polish | Animation | Overall |
|-----------|-----------------|---------------|-----------|---------|
| `LightBeams.tsx` | 10/10 | 9/10 | 9/10 | **A+** |
| `Blocks.tsx` | 9/10 | 9/10 | 8/10 | **A** |
| `Scene.tsx` | 8/10 | 8/10 | 7/10 | **A-** |
| `LightBeamEffect.tsx` | N/A (homepage) | 8/10 | 8/10 | **A-** |

### Best-in-Class Reference Components

These components demonstrate the target quality level:

1. **`DiscoveryNotification.tsx`** — Framer Motion spring animations, auto-dismiss timer bar, category colors, glassmorphism, `AnimatePresence` for exit animations. This is what all toast/notification patterns should look like.

2. **`LightBeams.tsx`** — Physics-first rendering where every visual property (radius, color, opacity, glow) is a direct function of `LightPacket` state. Zero decorative animation — everything communicates physics.

3. **`Blocks.tsx` SensorBlock** — Multi-channel feedback: color shift + LED + glow ring + label change + point light. Demonstrates how game events should drive multiple simultaneous visual responses.

---

## Appendix B: Design System Adoption Roadmap

```
Phase 1 (Foundation)     Phase 2 (Components)    Phase 3 (Juice)
─────────────────────    ────────────────────    ─────────────────
 colors.ts constants  →   Button unification  →   Sensor pulse anim
 Theme extension      →   HUD glassmorphism   →   Victory overlay
 Typography scale     →   Tooltip enrichment  →   Intensity warnings
 Dead CSS cleanup     →   ARIA compliance     →   Block place feedback
```

Each phase can be executed independently. Phase 1 is prerequisite for Phase 2 to have maximum impact.
