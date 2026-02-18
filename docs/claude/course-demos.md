# Course & Demo System

## Interactive Demo Units

Two visualization approaches:
- **2D**: SVG + Framer Motion (wave/diagram visualizations)
- **3D**: React Three Fiber (spatial relationships)

| Unit | Topic | Demos | Visual |
|------|-------|-------|--------|
| 0 (Basics) | Optical Fundamentals | Light Wave, EM Wave, EM Spectrum, Polarization Intro/Types, Malus Graph, Three Polarizers, Polarizer Scenarios, Virtual Lens, Interactive Bench | Mixed |
| 1 | Light Polarization | Polarization State (3D), Malus's Law (2D), Birefringence (3D), Waveplate (3D), Arago-Fresnel | Mixed |
| 2 | Interface Reflection | Fresnel Equations, Brewster's Angle | 2D |
| 3 | Transparent Media | Chromatic Polarization, Anisotropy, Optical Rotation, Media Gallery | 2D |
| 4 | Turbid Media | Rayleigh Scattering, Mie Scattering, Monte Carlo Scattering | 2D |
| 5 | Full Polarimetry | Stokes Vectors (3D), Mueller Matrices (2D), Jones Matrices, Polarization Calculator, Polarimetric Microscopy | Mixed |

## 3-Tier Difficulty System

Based on research-oriented learning philosophy (see COURSE.md):

| Level | Target | Content |
|-------|--------|---------|
| **Foundation** | Beginners | No formulas, simplified language, everyday analogies, visual understanding. Max 2 physics details, 1 frontier application. Questions: "What do you see?" |
| **Application** | Intermediate | Key formulas shown (e.g. Malus's Law), mathematical symbols, experimental design emphasis. Max 3 physics details, 2 frontier applications. Questions: "How can we measure?" |
| **Research** | Advanced/Graduate | Complete derivations, rigorous academic terminology, advanced concepts (Mueller, Stokes). Max 4 physics details, 3 frontier applications. Questions: "What if? How to improve?" |

## Calculation Workshop

| Calculator | Route | Purpose |
|------------|-------|---------|
| Jones | `/calc/jones` | Jones vector/matrix operations |
| Stokes | `/calc/stokes` | Stokes parameter calculations |
| Mueller | `/calc/mueller` | Mueller matrix operations |
| Poincare Sphere | `/calc/poincare` | 3D polarization state visualization |
