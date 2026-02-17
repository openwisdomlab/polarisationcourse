# Physics Verification Status

Tracking scientific accuracy of all interactive demos in PolarCraft.

## Verification Criteria

Each demo is reviewed against:
1. Formulas match textbook definitions
2. Visualizations correctly represent the phenomenon
3. Slider ranges are physically meaningful
4. Edge cases handled (0 degree polarizer, crossed polarizers, etc.)
5. Units and labels correct
6. Jones/Mueller/Stokes representations consistent with unified physics engine

## Status Key
- [ ] Not reviewed
- [~] Reviewed, issues found (see notes)
- [x] Verified correct

## Unit 0: Optical Basics

| Status | Demo ID | Name | Visual Type | Difficulty |
|--------|---------|------|-------------|------------|
| [ ] | `em-wave` | Electromagnetic Waves | 2D | Foundation |
| [ ] | `polarization-intro` | What is Polarization? | 2D | Foundation |
| [ ] | `polarization-types-unified` | Polarization & The Three-Polarizer Paradox | 2D | Application |
| [ ] | `optical-bench` | Interactive Optical Bench | 2D | Application |

## Unit 1: Polarization Fundamentals

| Status | Demo ID | Name | Visual Type | Difficulty |
|--------|---------|------|-------------|------------|
| [ ] | `polarization-state` | Polarization State & Wave Synthesis | 3D | Foundation |
| [ ] | `malus` | Malus's Law | 2D | Application |
| [ ] | `birefringence` | Birefringence Effect | 3D | Application |
| [ ] | `waveplate` | Wave Plate Principle | 3D | Research |

## Unit 2: Interface Reflection

| Status | Demo ID | Name | Visual Type | Difficulty |
|--------|---------|------|-------------|------------|
| [ ] | `fresnel` | Fresnel Equations | 2D | Research |
| [ ] | `brewster` | Brewster's Angle | 2D | Application |

## Unit 3: Transparent Media

| Status | Demo ID | Name | Visual Type | Difficulty |
|--------|---------|------|-------------|------------|
| [ ] | `anisotropy` | Optical Anisotropy | 2D | Foundation |
| [ ] | `chromatic` | Chromatic Polarization | 2D | Application |
| [ ] | `optical-rotation` | Optical Rotation | 2D | Application |

## Unit 4: Turbid Media

| Status | Demo ID | Name | Visual Type | Difficulty |
|--------|---------|------|-------------|------------|
| [ ] | `mie-scattering` | Mie Scattering | 2D | Research |
| [ ] | `rayleigh` | Rayleigh Scattering | 2D | Foundation |
| [ ] | `monte-carlo-scattering` | Monte Carlo Scattering Simulation | 2D | Research |

## Unit 5: Full Polarimetry

| Status | Demo ID | Name | Visual Type | Difficulty |
|--------|---------|------|-------------|------------|
| [ ] | `stokes` | Stokes Vector | 3D | Research |
| [ ] | `mueller` | Mueller Matrix | 2D | Research |
| [ ] | `jones` | Jones Matrix | 2D | Research |
| [ ] | `calculator` | Polarization Calculator | 2D | Application |
| [ ] | `polarimetric-microscopy` | Full Polarimetric Microscopy | 2D | Research |

## Verification Notes

(Add detailed notes per demo as they are reviewed)

### Template for per-demo notes:

```
### [demo-id] - Demo Name
- Reviewer:
- Date:
- Formulas checked: [ ]
- Visualization accuracy: [ ]
- Slider ranges: [ ]
- Edge cases: [ ]
- Units/labels: [ ]
- Issues found:
- Recommendations:
```

## Unified Physics API Integration Status

Tracking whether each demo uses the unified physics engine (`src/core/LightPhysics.ts`, `src/core/WaveOptics.ts`, `src/core/JonesCalculus.ts`) or implements its own calculations inline.

| Demo | Uses Unified API | Notes |
|------|-----------------|-------|
| `em-wave` | No | Migration planned |
| `polarization-intro` | No | Migration planned |
| `polarization-types-unified` | No | Migration planned |
| `optical-bench` | No | Migration planned |
| `polarization-state` | No | Migration planned |
| `malus` | No | Migration planned |
| `birefringence` | No | Migration planned |
| `waveplate` | No | Migration planned |
| `fresnel` | No | Migration planned |
| `brewster` | No | Migration planned |
| `anisotropy` | No | Migration planned |
| `chromatic` | No | Migration planned |
| `optical-rotation` | No | Migration planned |
| `mie-scattering` | No | Migration planned |
| `rayleigh` | No | Migration planned |
| `monte-carlo-scattering` | No | Migration planned |
| `stokes` | No | Migration planned |
| `mueller` | No | Migration planned |
| `jones` | No | Migration planned |
| `calculator` | No | Migration planned |
| `polarimetric-microscopy` | No | Migration planned |
