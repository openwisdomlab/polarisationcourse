# AI Code Generation Prompts for Polarization Demos
# 偏振光演示程序AI生成提示词

**Purpose**: Use these prompts with LLMs (Claude, GPT-4, etc.) to generate similar polarization optics demonstrations.

**Target Audience**: Educators, students, researchers who want to create or modify polarization visualization tools.

**Date**: 2026-01-14

---

## Table of Contents / 目录

### Stage 1: Basic Phenomena
1. [Malus's Law](#1-maluss-law-马吕斯定律)
2. [Birefringence](#2-birefringence-双折射)
3. [Fresnel Equations](#3-fresnel-equations-菲涅尔方程)
4. [Waveplate](#4-waveplate-波片)
5. [Brewster's Angle](#5-brewsters-angle-布儒斯特角)
6. [Optical Rotation](#6-optical-rotation-旋光性)
7. [Rayleigh Scattering](#7-rayleigh-scattering-瑞利散射)

### Stage 2: Mathematical Tools
8. [Jones Matrix](#8-jones-matrix-琼斯矩阵)
9. [Stokes Vector](#9-stokes-vector-斯托克斯矢量)
10. [Mueller Matrix](#10-mueller-matrix-缪勒矩阵)

---

## Stage 1: Basic Phenomena / 基础现象

---

### 1. Malus's Law (马吕斯定律)

#### 📋 Prompt for AI Model

```markdown
Create an interactive Python demo for Malus's Law in polarization optics with the following specifications:

**Physical Principle**:
Malus's Law describes the intensity of polarized light after passing through a polarizer:
I = I₀ × cos²(θ)
where I₀ is incident intensity and θ is the angle between light polarization and polarizer axis.

**Requirements**:

1. **Core Physics**:
   - Implement Malus's Law formula: I = I₀ × cos²(θ)
   - Visualize intensity vs angle relationship
   - Show both linear and circular plots
   - Real-time calculation as angle changes

2. **Visualization** (using matplotlib):
   - Panel 1: Linear plot (Intensity vs Angle, 0-180°)
   - Panel 2: Polar plot showing cos²θ pattern
   - Panel 3: Schematic diagram showing:
     * Light source (unpolarized)
     * First polarizer (vertical)
     * Second polarizer (rotatable)
     * Transmitted light intensity
   - Use arrows for polarization direction
   - Color-code: incident (cyan), transmitted (yellow/dim based on intensity)

3. **Interactive Controls**:
   - Slider: Polarizer angle (0-180°, step=1°)
   - Slider: Incident intensity I₀ (0-100, step=1)
   - Display: Current transmitted intensity value
   - Display: Relative intensity percentage
   - Reset button

4. **Technical Specs**:
   - Language: Python 3.8+
   - Libraries: numpy, matplotlib
   - Figure size: 15×5 inches (3 panels side-by-side)
   - Dark theme: background #0f172a, text white
   - Update rate: Real-time with slider movement
   - No external dependencies beyond numpy/matplotlib

5. **Code Structure**:
   ```python
   class MalusLawDemo:
       def __init__(self):
           # Initialize figure and axes

       def calculate_intensity(self, angle_deg):
           # I = I₀ × cos²(θ)

       def update_visualization(self):
           # Update all three panels

       def run(self):
           # Main event loop
   ```

6. **Additional Features**:
   - Annotations for key angles (0°, 45°, 90°)
   - Show special cases:
     * 0°: Maximum transmission (I = I₀)
     * 45°: Half intensity (I = I₀/2)
     * 90°: Zero transmission (crossed polarizers)
   - Physics info card with formula explanation
   - Bilingual labels (English + Chinese)

7. **Validation**:
   - Verify I(0°) = I₀
   - Verify I(90°) = 0
   - Verify I(45°) = I₀/2
   - Energy conservation: I ≤ I₀ always

**Expected Output**: ~400-500 lines of clean, documented Python code with interactive visualization.

**Reference**: Hecht, Optics, 5th Edition, Section 8.4
```

---

### 2. Birefringence (双折射)

#### 📋 Prompt for AI Model

```markdown
Create an interactive Python demo for birefringence in calcite crystals with the following specifications:

**Physical Principle**:
Birefringent crystals (e.g., calcite) have two different refractive indices, causing incident light to split into:
- Ordinary ray (o-ray): Follows Snell's law, polarized perpendicular to optic axis
- Extraordinary ray (e-ray): Does not follow Snell's law, polarized parallel to optic axis

Refractive indices: n_o ≈ 1.658, n_e ≈ 1.486 (for calcite)

**Requirements**:

1. **Core Physics**:
   - Snell's law for o-ray: n₁ sin(θ₁) = n_o sin(θ_o)
   - e-ray refraction using extraordinary index n_e
   - Calculate ray separation distance
   - Polarization: o-ray at 0°, e-ray at 90°

2. **Visualization** (using matplotlib + 3D):
   - Panel 1: 3D view of ray paths through crystal
     * Incident beam (white)
     * Crystal block (transparent gray)
     * o-ray (red) and e-ray (green)
     * Polarization arrows
   - Panel 2: Top view (XY plane) showing ray separation
   - Panel 3: Side view (XZ plane) showing refraction
   - Panel 4: Refractive index ellipsoid visualization

3. **Interactive Controls**:
   - Slider: Incident angle (0-60°, step=1°)
   - Slider: Crystal thickness (1-10 mm, step=0.5)
   - Slider: Crystal rotation (optic axis orientation, 0-90°)
   - Dropdown: Crystal type (Calcite, Quartz, others)
   - Toggle: Show/hide polarization arrows
   - Display: Ray separation distance (in mm)

4. **Technical Specs**:
   - Language: Python 3.8+
   - Libraries: numpy, matplotlib, mpl_toolkits.mplot3d
   - Figure size: 16×8 inches (4 panels)
   - Dark theme: #0f172a background
   - 3D rotation enabled (azimuth, elevation controls)
   - MATLAB version compatible (use same algorithms)

5. **Code Structure**:
   ```python
   class BirefringenceDemo:
       def __init__(self):
           self.n_o = 1.658  # Ordinary index
           self.n_e = 1.486  # Extraordinary index

       def calculate_o_ray(self, incident_angle):
           # Snell's law for ordinary ray

       def calculate_e_ray(self, incident_angle, crystal_rotation):
           # Extraordinary ray calculation

       def calculate_separation(self, thickness):
           # Distance between o and e rays

       def plot_3d_rays(self, ax):
           # 3D visualization

       def update_all_views(self):
           # Update all 4 panels
   ```

6. **Additional Features**:
   - Show optic axis direction in crystal
   - Display refractive index values
   - Phase difference between o and e rays
   - Walk-off angle calculation
   - Polarization state visualization (arrows)
   - Physics principle explanation card

7. **Validation**:
   - o-ray follows Snell's law
   - e-ray and o-ray are orthogonally polarized
   - Ray separation increases with crystal thickness
   - Energy conservation: I_o + I_e = I_incident

**Expected Output**: ~450-500 lines of Python code with 3D visualization.

**Reference**: Born & Wolf, Principles of Optics, Section 15.3
```

---

### 3. Fresnel Equations (菲涅尔方程)

#### 📋 Prompt for AI Model

```markdown
Create an interactive Python demo for Fresnel equations describing reflection and transmission at interfaces:

**Physical Principle**:
Fresnel equations describe amplitude reflection (r) and transmission (t) coefficients for light at an interface between two media:

**For s-polarization (TE)**:
r_s = (n₁cosθᵢ - n₂cosθₜ) / (n₁cosθᵢ + n₂cosθₜ)
t_s = 2n₁cosθᵢ / (n₁cosθᵢ + n₂cosθₜ)

**For p-polarization (TM)**:
r_p = (n₂cosθᵢ - n₁cosθₜ) / (n₂cosθᵢ + n₁cosθₜ)
t_p = 2n₁cosθᵢ / (n₂cosθᵢ + n₁cosθₜ)

Reflectance R = |r|², Transmittance T = (n₂cosθₜ)/(n₁cosθᵢ) × |t|²

**Requirements**:

1. **Core Physics**:
   - Implement all 4 Fresnel coefficients (r_s, r_p, t_s, t_p)
   - Calculate reflectance R and transmittance T
   - Apply Snell's law: n₁sinθᵢ = n₂sinθₜ
   - Handle total internal reflection (θᵢ > θ_c)
   - Identify Brewster's angle where R_p = 0

2. **Visualization** (6 panels):
   - Panel 1: Reflectance R_s vs angle (0-90°)
   - Panel 2: Reflectance R_p vs angle (0-90°)
   - Panel 3: Transmittance T_s vs angle
   - Panel 4: Transmittance T_p vs angle
   - Panel 5: Schematic diagram (incident, reflected, transmitted rays)
   - Panel 6: Phase shift diagram

3. **Interactive Controls**:
   - Slider: n₁ (1.0-3.0, step=0.1) - first medium index
   - Slider: n₂ (1.0-3.0, step=0.1) - second medium index
   - Slider: Incident angle θᵢ (0-90°, step=1°)
   - Radio buttons: Polarization (s/p/unpolarized)
   - Presets: Air→Glass, Glass→Air, Water→Glass
   - Display: Critical angle, Brewster's angle
   - Display: Current R and T values

4. **Technical Specs**:
   - Language: Python 3.8+
   - Libraries: numpy, matplotlib
   - Figure size: 18×10 inches (2 rows, 3 columns)
   - Dark theme with cyan/magenta for TE/TM
   - Mark special angles (Brewster, critical) on plots

5. **Code Structure**:
   ```python
   class FresnelDemo:
       def __init__(self):
           self.n1 = 1.0  # First medium
           self.n2 = 1.5  # Second medium

       def fresnel_coefficients(self, theta_i, polarization):
           # Calculate r_s, r_p, t_s, t_p

       def calculate_brewster_angle(self):
           # θ_B = arctan(n₂/n₁)

       def calculate_critical_angle(self):
           # θ_c = arcsin(n₂/n₁) if n₁ > n₂

       def plot_reflectance(self, ax):
           # R vs angle

       def plot_transmittance(self, ax):
           # T vs angle

       def plot_schematic(self, ax):
           # Ray diagram
   ```

6. **Additional Features**:
   - Highlight Brewster's angle (R_p = 0)
   - Show total internal reflection region
   - Phase shift at interface (0 or π)
   - Energy conservation check: R + T = 1
   - Special case indicators
   - Formula display with current values

7. **Validation**:
   - R + T = 1 (energy conservation)
   - R_p(θ_B) = 0 (Brewster's angle)
   - R = 1 for θ > θ_c (total internal reflection)
   - Normal incidence: R = ((n₁-n₂)/(n₁+n₂))²

**Expected Output**: ~520-570 lines of Python code with comprehensive visualization.

**Reference**: Hecht, Optics, Section 4.7; Born & Wolf, Section 1.5
```

---

### 4. Waveplate (波片)

#### 📋 Prompt for AI Model

```markdown
Create an interactive Python demo for waveplates (quarter-wave and half-wave plates) in polarization optics:

**Physical Principle**:
Waveplates introduce phase retardation δ between ordinary and extraordinary ray components:
- Quarter-wave plate (QWP): δ = π/2 (90°) → Converts linear ↔ circular polarization
- Half-wave plate (HWP): δ = π (180°) → Rotates linear polarization by 2θ

Jones matrix for waveplate:
```
J = [e^(iδ/2)    0        ]
    [0           e^(-iδ/2) ]
```
(in fast/slow axis basis)

**Requirements**:

1. **Core Physics**:
   - Phase retardation: δ = 2π(n_e - n_o)d/λ
   - QWP: Linear (45°) → Circular (RCP/LCP)
   - HWP: Linear (θ) → Linear (-θ relative to fast axis)
   - Jones calculus for polarization transformation
   - Poincaré sphere trajectory

2. **Visualization** (6 panels):
   - Panel 1: Input polarization state (linear arrow)
   - Panel 2: Waveplate schematic (fast/slow axes)
   - Panel 3: Output polarization state (ellipse/circle/linear)
   - Panel 4: Poincaré sphere showing transformation
   - Panel 5: Phase vs position through waveplate
   - Panel 6: Ellipse parameters (a, b, orientation, chirality)

3. **Interactive Controls**:
   - Slider: Waveplate type (retardation 0-360°, or presets QWP/HWP)
   - Slider: Waveplate rotation angle (0-180°, step=1°)
   - Slider: Input polarization angle (0-180°, step=1°)
   - Slider: Wavelength λ (400-700 nm for chromatic effects)
   - Radio buttons: Plate type (QWP λ/4 / HWP λ/2 / Custom)
   - Toggle: Show Poincaré sphere
   - Display: Output polarization type (linear/circular/elliptical)
   - Display: Ellipse parameters

4. **Technical Specs**:
   - Language: Python 3.8+
   - Libraries: numpy, matplotlib, mpl_toolkits.mplot3d
   - Figure size: 16×10 inches
   - Dark theme #0f172a
   - Animate waveplate rotation if desired
   - 3D Poincaré sphere with trajectory line

5. **Code Structure**:
   ```python
   class WaveplateDemo:
       def __init__(self):
           self.retardation = 90  # degrees (QWP default)

       def jones_waveplate(self, retardation_deg, rotation_deg):
           # Jones matrix with rotation

       def apply_waveplate(self, input_jones):
           # Transform input state

       def jones_to_polarization_type(self, jones):
           # Classify as linear/circular/elliptical

       def plot_polarization_state(self, ax, jones, title):
           # Draw polarization ellipse

       def plot_poincare_sphere(self, ax):
           # 3D sphere with states

       def calculate_ellipse_params(self, jones):
           # Major/minor axes, orientation, chirality
   ```

6. **Additional Features**:
   - Show fast and slow axes on waveplate diagram
   - Animate electric field rotation
   - Multiple wavelength comparison
   - Achromatic waveplate option
   - Physics principle card
   - Special transformations:
     * Linear 0° + QWP(45°) → LCP
     * Linear 0° + HWP(22.5°) → Linear 45°
   - Stokes parameter display

7. **Validation**:
   - QWP: Linear 45° → Circular (S₃ = ±1)
   - HWP: Linear 0° → Linear 0° when aligned
   - HWP: Linear 0° at 45° → Linear 90°
   - Energy conservation: |output|² = |input|²

**Expected Output**: ~590-610 lines of Python with 3D visualization and Jones calculus.

**Reference**: Goldstein, Polarized Light, Chapter 5
```

---

### 5. Brewster's Angle (布儒斯特角)

#### 📋 Prompt for AI Model

```markdown
Create an interactive Python demo for Brewster's angle, where p-polarized light has zero reflectance:

**Physical Principle**:
Brewster's angle θ_B is the incident angle at which p-polarized (TM) light is completely transmitted with no reflection:
θ_B = arctan(n₂/n₁)

At Brewster's angle:
- Reflected and refracted rays are perpendicular (90° separation)
- R_p = 0 (no reflection of p-polarized light)
- R_s ≠ 0 (s-polarized light still reflects)
- Reflected light becomes fully s-polarized

**Requirements**:

1. **Core Physics**:
   - Calculate θ_B = arctan(n₂/n₁)
   - Fresnel equations for R_p and R_s vs angle
   - Verify θ_r + θ_t = 90° at Brewster's angle
   - Degree of polarization in reflected light

2. **Visualization** (4 panels):
   - Panel 1: Reflectance R_s and R_p vs angle (0-90°)
     * Highlight θ_B where R_p = 0
   - Panel 2: Schematic ray diagram
     * Show incident, reflected, transmitted rays
     * Display 90° angle between reflected/transmitted
     * Polarization arrows (s: dots, p: arrows)
   - Panel 3: Degree of Polarization (DOP) in reflected light
   - Panel 4: Practical applications illustration

3. **Interactive Controls**:
   - Slider: n₁ (1.0-2.5, step=0.1) - incident medium
   - Slider: n₂ (1.0-3.0, step=0.1) - transmitted medium
   - Slider: Incident angle (0-90°, step=0.5°)
   - Presets:
     * Air → Glass (1.0 → 1.5): θ_B = 56.3°
     * Air → Water (1.0 → 1.33): θ_B = 53.1°
     * Water → Glass (1.33 → 1.5): θ_B = 48.4°
   - Toggle: Show Brewster angle indicator
   - Display: θ_B value, current R_p and R_s

4. **Technical Specs**:
   - Language: Python 3.8+
   - Libraries: numpy, matplotlib
   - Figure size: 14×8 inches (2×2 grid)
   - Dark theme with red (s) and blue (p) color coding
   - Vertical line marking θ_B on reflectance plot

5. **Code Structure**:
   ```python
   class BrewsterAngleDemo:
       def __init__(self):
           self.n1 = 1.0
           self.n2 = 1.5

       def calculate_brewster_angle(self):
           # θ_B = arctan(n₂/n₁)

       def fresnel_rs_rp(self, theta_i):
           # R_s and R_p using Fresnel equations

       def degree_of_polarization(self, theta_i):
           # DOP = (R_s - R_p) / (R_s + R_p)

       def plot_reflectance(self, ax):
           # R vs angle with θ_B marked

       def plot_ray_diagram(self, ax):
           # Show geometry at θ_B

       def plot_dop(self, ax):
           # DOP vs angle
   ```

6. **Additional Features**:
   - Annotations for key angles
   - Show perpendicular relationship at θ_B
   - Polarization state of reflected light (fully s at θ_B)
   - Applications:
     * Polarizing filters
     * Anti-glare coatings
     * Brewster windows in lasers
     * Polarized sunglasses principle
   - Formula display panel
   - Physics explanation card

7. **Validation**:
   - R_p(θ_B) = 0 exactly
   - R_s(θ_B) > 0
   - θ_reflected + θ_transmitted = 90° at θ_B
   - DOP → 1 (100% polarized) at θ_B

**Expected Output**: ~260-300 lines of concise Python code.

**Reference**: Hecht, Optics, Section 4.8
```

---

### 6. Optical Rotation (旋光性)

#### 📋 Prompt for AI Model

```markdown
Create an interactive Python demo for optical rotation (optical activity) in chiral materials:

**Physical Principle**:
Chiral molecules rotate the plane of polarized light as it propagates:
θ = α × L × C
where:
- θ = rotation angle (degrees)
- α = specific rotation (deg·mL/g·dm)
- L = path length (dm)
- C = concentration (g/mL)

For glucose: α ≈ +52.7° (dextrorotatory at 589 nm)
For fructose: α ≈ -92.4° (levorotatory at 589 nm)

**Requirements**:

1. **Core Physics**:
   - Rotation formula: θ = αLC
   - Wavelength dependence (optical rotatory dispersion)
   - Circular birefringence: n_L ≠ n_R
   - Decompose linear into LCP + RCP
   - Different phase velocities cause rotation

2. **Visualization** (5 panels):
   - Panel 1: Polarization rotation animation
     * Input linear polarization (vertical)
     * Progressive rotation through sample
     * Output rotated polarization
   - Panel 2: Top view showing rotation vs distance
   - Panel 3: Rotation angle vs concentration (linear)
   - Panel 4: Rotation vs wavelength (ORD curve)
   - Panel 5: Circular birefringence explanation diagram

3. **Interactive Controls**:
   - Slider: Concentration (0-1 g/mL, step=0.01)
   - Slider: Path length (0-10 dm, step=0.5)
   - Slider: Wavelength (400-700 nm, step=10)
   - Dropdown: Material type (Glucose, Fructose, Quartz, Turpentine)
   - Toggle: Show LCP/RCP decomposition
   - Display: Total rotation angle
   - Display: Specific rotation α for selected material

4. **Technical Specs**:
   - Language: Python 3.8+
   - Libraries: numpy, matplotlib
   - Figure size: 16×9 inches (5 panels)
   - Dark theme #0f172a
   - Animate rotation (optional playback)
   - Color-code: LCP (blue), RCP (red)

5. **Code Structure**:
   ```python
   class OpticalRotationDemo:
       def __init__(self):
           self.materials = {
               'glucose': {'alpha': 52.7, 'name': 'D-Glucose'},
               'fructose': {'alpha': -92.4, 'name': 'D-Fructose'},
               # ... more materials
           }

       def calculate_rotation(self, alpha, length, concentration):
           # θ = α × L × C

       def wavelength_dependence(self, wavelength):
           # ORD: α(λ) ≈ A / (λ² - λ₀²)

       def decompose_to_circular(self, linear_angle):
           # Linear = (LCP + RCP) / 2

       def plot_rotation_animation(self, ax):
           # Show progressive rotation

       def plot_rotation_vs_concentration(self, ax):
           # Linear relationship
   ```

6. **Additional Features**:
   - Show molecular chirality (L/D isomers)
   - Practical applications:
     * Sugar concentration measurement (polarimetry)
     * Pharmaceutical quality control
     * Chiral molecule detection
   - Comparison table for different materials
   - ORD (Optical Rotatory Dispersion) curve
   - Formula explanation panel
   - Enantiomer comparison (D vs L)

7. **Validation**:
   - Linear relationship: θ ∝ C (at fixed L, λ)
   - Opposite rotation for enantiomers
   - θ(glucose, 1g/mL, 1dm, 589nm) = 52.7°
   - Rotation increases with path length

**Expected Output**: ~270-320 lines of Python code with animation.

**Reference**: Goldstein, Polarized Light, Chapter 8
```

---

### 7. Rayleigh Scattering (瑞利散射)

#### 📋 Prompt for AI Model

```markdown
Create an interactive Python demo for Rayleigh scattering explaining sky polarization:

**Physical Principle**:
Rayleigh scattering occurs when light interacts with particles much smaller than wavelength (d << λ):

Intensity: I ∝ 1/λ⁴ (strong wavelength dependence → blue sky)
Scattering angle dependence: I(θ) ∝ (1 + cos²θ)
Degree of Polarization: DOP(θ) = sin²θ / (1 + cos²θ)

Maximum polarization (DOP = 1) occurs at 90° from the sun.

**Requirements**:

1. **Core Physics**:
   - Rayleigh formula: I_scattered ∝ (1/λ⁴) × (1 + cos²θ)
   - Degree of polarization: DOP = sin²θ / (1 + cos²θ)
   - Wavelength dependence (blue >> red scattering)
   - Sky color calculation based on scattering
   - Polarization pattern in sky

2. **Visualization** (6 panels):
   - Panel 1: Sky dome with polarization pattern
     * Sun position indicator
     * Color-coded DOP (0 to 1)
     * Polarization arrows at various angles
   - Panel 2: Scattering intensity vs angle (polar plot)
   - Panel 3: DOP vs scattering angle (0-180°)
   - Panel 4: Wavelength dependence (I vs λ)
   - Panel 5: Sky color simulation (scattered spectrum)
   - Panel 6: Schematic: sunlight, air molecules, observer

3. **Interactive Controls**:
   - Slider: Sun elevation angle (-90° to +90°, sunrise to sunset)
   - Slider: Observation angle relative to sun (0-180°)
   - Slider: Wavelength for single-color mode (400-700 nm)
   - Toggle: Full spectrum / Single wavelength
   - Toggle: Show polarization vectors
   - Display: DOP at current observation angle
   - Display: Scattering intensity relative to forward

4. **Technical Specs**:
   - Language: Python 3.8+
   - Libraries: numpy, matplotlib
   - Figure size: 18×10 inches (2 rows, 3 columns)
   - Dark theme with sky gradient simulation
   - Polar plots for angular distribution
   - Color mapping for wavelength (spectral colormap)

5. **Code Structure**:
   ```python
   class RayleighScatteringDemo:
       def __init__(self):
           self.wavelength_range = np.linspace(400, 700, 100)

       def rayleigh_intensity(self, wavelength, scattering_angle):
           # I ∝ (1/λ⁴) × (1 + cos²θ)

       def degree_of_polarization(self, scattering_angle):
           # DOP = sin²θ / (1 + cos²θ)

       def calculate_sky_color(self, sun_angle, view_angle):
           # Integrate scattered spectrum

       def plot_sky_dome(self, ax):
           # 2D sky map with polarization

       def plot_polar_intensity(self, ax):
           # I(θ) in polar coordinates

       def plot_dop_vs_angle(self, ax):
           # DOP curve
   ```

6. **Additional Features**:
   - Show Neutral Points (Brewster, Babinet, Arago points)
   - Sunset/sunrise color explanation (long path → more scattering)
   - Compare Rayleigh vs Mie scattering
   - Applications:
     * Sky polarization for navigation (animals)
     * Remote sensing
     * Atmospheric science
   - Physics principle card with formulas
   - Interactive sky color at different sun angles
   - Wavelength color scale bar

7. **Validation**:
   - DOP(90°) = 1 (maximum polarization)
   - DOP(0°) = DOP(180°) = 0 (forward/backward)
   - Blue light scattered ~10× more than red
   - Sky is polarized perpendicular to sun direction

**Expected Output**: ~290-340 lines of Python code with sky simulation.

**Reference**: Born & Wolf, Principles of Optics, Section 13.5; Bohren & Huffman, Absorption and Scattering of Light by Small Particles
```

---

## Stage 2: Mathematical Tools / 数学工具

---

### 8. Jones Matrix (琼斯矩阵)

#### 📋 Prompt for AI Model

```markdown
Create a comprehensive interactive Python demo for Jones matrix calculus in polarization optics:

**Physical Principle**:
Jones calculus uses complex 2×2 matrices to describe polarization transformations for fully polarized light:

E_out = J × E_in

where E = [E_x, E_y]^T is the Jones vector and J is the Jones matrix.

Common Jones matrices:
- Linear polarizer (θ): [cos²θ, cosθsinθ; cosθsinθ, sin²θ]
- QWP: [1, 0; 0, i] (fast axis along x)
- HWP: [1, 0; 0, -1]
- Rotator (φ): [cos(φ), sin(φ); -sin(φ), cos(φ)]

**Requirements**:

1. **Core Physics**:
   - Implement 6+ optical elements as Jones matrices:
     1. Linear Polarizer (angle θ)
     2. Quarter-Wave Plate (QWP, retardation 90°)
     3. Half-Wave Plate (HWP, retardation 180°)
     4. Optical Rotator (rotation angle φ)
     5. Mirror (reflection)
     6. Phase Shifter
   - Matrix rotation: J'(θ) = R(-θ) J R(θ)
   - Matrix cascade: J_total = J_n @ J_(n-1) @ ... @ J_1
   - Eigenvalue analysis for eigenpolarizations
   - Conversion to Stokes parameters

2. **Visualization** (6 panels):
   - Panel 1: Jones matrix display (2×2 heatmap, complex values)
   - Panel 2: Input polarization state (ellipse)
   - Panel 3: Output polarization state (ellipse)
   - Panel 4: Poincaré sphere transformation (3D)
   - Panel 5: Cascade chain diagram (multiple elements)
   - Panel 6: Eigenvalue/eigenvector display

3. **Interactive Controls**:
   - Dropdown: Element type (6 types)
   - Slider: Element angle/rotation (0-180°, step=1°)
   - Slider: Input polarization angle (0-180°)
   - Slider: Input ellipticity (-45° to +45°)
   - Buttons: Add element to cascade, Remove, Clear all
   - Toggle: Show real/imaginary parts separately
   - Display: Matrix elements (formatted complex numbers)
   - Display: Output state parameters (orientation, ellipticity, chirality)

4. **Technical Specs**:
   - Language: Python 3.8+
   - Libraries: numpy, matplotlib, mpl_toolkits.mplot3d
   - Complex number support (numpy complex128)
   - Figure size: 18×12 inches (2 rows, 3 columns)
   - Dark theme #0f172a
   - 3D Poincaré sphere with interactive rotation
   - Matrix displayed with real and imaginary color-coding

5. **Code Structure**:
   ```python
   class JonesVector:
       def __init__(self, Ex, Ey):
           self.E = np.array([Ex, Ey], dtype=complex)

       def intensity(self):
           return np.sum(np.abs(self.E)**2)

       def to_stokes(self):
           # Convert to Stokes vector

   class JonesMatrix:
       def __init__(self, matrix):
           self.J = np.array(matrix, dtype=complex)

       @classmethod
       def linear_polarizer(cls, angle_deg):
           # Polarizer matrix

       @classmethod
       def quarter_wave_plate(cls, angle_deg):
           # QWP matrix with rotation

       def rotate(self, angle_deg):
           # Rotate optical element

       def __matmul__(self, other):
           # Matrix multiplication or apply to vector

       def eigenanalysis(self):
           # Eigenvalues and eigenvectors

   class JonesMatrixDemo:
       def __init__(self):
           self.elements = []  # Cascade chain

       def add_element(self, element_type, angle):
           # Add to cascade

       def calculate_cascade(self):
           # J_total = J_n @ ... @ J_1

       def update_all_visualizations(self):
           # Update all 6 panels
   ```

6. **Additional Features**:
   - Preset configurations:
     * Malus's Law: Polarizer → Polarizer (crossed)
     * Linear to circular: Linear + QWP(45°)
     * Polarization rotation: HWP at angle
   - Save/Load cascade configurations
   - Export Jones matrix as LaTeX or NumPy
   - Show intermediate states in cascade
   - Formula display for each element
   - Physics principles card
   - Polarization ellipse parameters (a, b, ψ, χ)
   - Stokes parameter comparison

7. **Validation Tests**:
   - Identity: I(2×2) gives no change
   - Polarizer: Reduces intensity by cos²θ
   - QWP: Linear 45° → Circular (|E_x| = |E_y|, phase diff 90°)
   - HWP: Flips polarization across fast axis
   - Cascade: (J₂ @ J₁) × E = J₂ × (J₁ × E)
   - Energy conservation: |E_out|² ≤ |E_in|²
   - Orthogonality: Eigenpolarizations perpendicular

**Expected Output**: ~1,200-1,300 lines of comprehensive Python code with complex visualization.

**Reference**:
- Goldstein, Polarized Light, Chapter 2
- Jones, R.C. (1941). "A New Calculus for the Treatment of Optical Systems"
```

---

### 9. Stokes Vector (斯托克斯矢量)

#### 📋 Prompt for AI Model

```markdown
Create an interactive Python demo for Stokes vector representation of polarization states:

**Physical Principle**:
Stokes parameters are four real numbers describing any polarization state (including partial):

S = [S₀, S₁, S₂, S₃]^T

where:
- S₀ = I_total = I_H + I_V (total intensity)
- S₁ = I_H - I_V (horizontal vs vertical preference)
- S₂ = I_+45 - I_-45 (diagonal preference)
- S₃ = I_RCP - I_LCP (circular handedness)

Degree of Polarization: DOP = √(S₁² + S₂² + S₃²) / S₀
- DOP = 0: Unpolarized
- 0 < DOP < 1: Partially polarized
- DOP = 1: Fully polarized

**Requirements**:

1. **Core Physics**:
   - Calculate Stokes vector from intensity measurements
   - Calculate DOP, ellipse parameters
   - Map to Poincaré sphere: (S₁, S₂, S₃) on sphere of radius S₀
   - Decompose into polarized + unpolarized components
   - Convert from/to Jones vector
   - Mueller matrix transformations: S_out = M × S_in

2. **Visualization** (6 panels):
   - Panel 1: Stokes parameters bar chart (S₀, S₁, S₂, S₃)
   - Panel 2: Polarization ellipse with parameters
   - Panel 3: Poincaré sphere (3D) with current state marked
   - Panel 4: DOP indicator (circular gauge)
   - Panel 5: Decomposition: Polarized + Unpolarized
   - Panel 6: Intensity measurements (I_H, I_V, I_+45, I_-45, I_R, I_L)

3. **Interactive Controls**:
   - Slider: S₀ (total intensity, 0-100)
   - Slider: S₁ (-100 to +100, H/V preference)
   - Slider: S₂ (-100 to +100, diagonal)
   - Slider: S₃ (-100 to +100, circular)
   - Constraint: S₁² + S₂² + S₃² ≤ S₀² (physical realizability)
   - Presets:
     * Horizontal linear (S = [1, 1, 0, 0])
     * Vertical linear (S = [1, -1, 0, 0])
     * +45° linear (S = [1, 0, 1, 0])
     * RCP (S = [1, 0, 0, 1])
     * LCP (S = [1, 0, 0, -1])
     * Unpolarized (S = [1, 0, 0, 0])
   - Display: DOP, ellipse orientation, ellipticity, chirality
   - Toggle: Normalized (S₀ = 1) vs absolute values

4. **Technical Specs**:
   - Language: Python 3.8+
   - Libraries: numpy, matplotlib, mpl_toolkits.mplot3d
   - Figure size: 18×12 inches (2 rows, 3 columns)
   - Dark theme #0f172a
   - 3D Poincaré sphere with rotation
   - Color-code: Positive (green), Negative (red), Zero (gray)
   - Real-time constraint checking (physical realizability)

5. **Code Structure**:
   ```python
   class StokesVector:
       def __init__(self, S0, S1, S2, S3):
           self.S = np.array([S0, S1, S2, S3])
           self.validate()  # Check S₁² + S₂² + S₃² ≤ S₀²

       def degree_of_polarization(self):
           return np.sqrt(self.S[1]**2 + self.S[2]**2 + self.S[3]**2) / self.S[0]

       def ellipse_parameters(self):
           # Orientation: ψ = 0.5 * arctan(S₂/S₁)
           # Ellipticity: χ = 0.5 * arcsin(S₃/√(S₁²+S₂²+S₃²))

       def to_jones(self):
           # Convert to Jones vector (if DOP = 1)

       def decompose(self):
           # Polarized + unpolarized components

       @classmethod
       def from_jones(cls, jones_vector):
           # Jones → Stokes conversion

   class StokesVectorDemo:
       def __init__(self):
           self.stokes = StokesVector(1, 0, 0, 0)

       def plot_stokes_bar(self, ax):
           # Bar chart for S₀, S₁, S₂, S₃

       def plot_poincare_sphere(self, ax):
           # 3D sphere with state

       def plot_polarization_ellipse(self, ax):
           # Ellipse visualization

       def plot_dop_gauge(self, ax):
           # Circular DOP indicator
   ```

6. **Additional Features**:
   - Show intensity measurements needed for Stokes determination
   - Polarimeter simulation (6 measurements)
   - Physics formula card with definitions
   - Poincaré sphere regions:
     * Equator: Linear polarization
     * North pole: RCP
     * South pole: LCP
     * Interior: Partially polarized
   - Trajectory animation (optional)
   - Comparison with Jones representation
   - Malus's Law verification using Stokes

7. **Validation Tests**:
   - Physical realizability: S₁² + S₂² + S₃² ≤ S₀²
   - DOP ∈ [0, 1]
   - Horizontal linear: S = [1, 1, 0, 0], DOP = 1
   - Unpolarized: S = [1, 0, 0, 0], DOP = 0
   - RCP: S = [1, 0, 0, 1], circular
   - Orthogonal states: antipodal on Poincaré sphere
   - Jones-Stokes consistency for fully polarized light

**Expected Output**: ~840-880 lines of Python code with 3D Poincaré sphere.

**Reference**:
- Goldstein, Polarized Light, Chapter 3
- Stokes, G.G. (1852). "On the Composition and Resolution of Streams of Polarized Light"
```

---

### 10. Mueller Matrix (缪勒矩阵)

#### 📋 Prompt for AI Model

```markdown
Create a comprehensive interactive Python demo for Mueller matrix calculus, the most general polarization formalism:

**Physical Principle**:
Mueller matrices are 4×4 real matrices that transform Stokes vectors:

S_out = M × S_in

Unlike Jones matrices, Mueller matrices can handle:
- Partially polarized light
- Depolarization effects
- Incoherent superposition

Key Mueller matrices:
- Linear polarizer: M₀₀ = 1/2, M₀₁ = M₁₀ = 1/2 cos(2θ), ...
- Retarder (retardation δ): Mixes S₁, S₂, S₃ components
- Depolarizer: Reduces DOP

Lu-Chipman decomposition: M = M_Δ × M_R × M_D
- M_Δ: Depolarization
- M_R: Retardance (phase)
- M_D: Diattenuation (amplitude)

**Requirements**:

1. **Core Physics**:
   - Implement 6+ optical elements as Mueller matrices:
     1. Linear Polarizer (angle θ)
     2. Quarter-Wave Plate (QWP)
     3. Half-Wave Plate (HWP)
     4. Optical Rotator (angle φ)
     5. Partial Polarizer (diattenuation D)
     6. Depolarizer (depolarization factor Δ)
   - Matrix rotation: M'(θ) = R(θ) M R(-θ)
   - Matrix cascade: M_total = M_n @ M_(n-1) @ ... @ M_1
   - Lu-Chipman decomposition
   - Calculate characteristic parameters:
     * Diattenuation: D = √(M₀₁² + M₀₂² + M₀₃²) / M₀₀
     * Polarizance: P = √(M₁₀² + M₂₀² + M₃₀²) / M₀₀
     * Depolarization index: Δ = 1 - √(Tr(M^T M) - M₀₀²) / (√3 M₀₀)

2. **Visualization** (6 panels):
   - Panel 1: Mueller matrix heatmap (4×4, normalized)
   - Panel 2: Input Stokes vector (bar chart)
   - Panel 3: Output Stokes vector (bar chart)
   - Panel 4: Poincaré sphere transformation (3D)
   - Panel 5: Parameters table (D, P, Δ, det, trace)
   - Panel 6: DOP comparison (input vs output)

3. **Interactive Controls**:
   - Dropdown: Element type (6 types)
   - Slider: Element angle/rotation (0-180°, step=1°)
   - Slider: Retardation (0-360° for custom retarder)
   - Slider: Diattenuation D (0-1 for partial polarizer)
   - Slider: Depolarization Δ (0-1 for depolarizer)
   - Input state presets (6 polarization states)
   - Buttons: Add element to cascade, Clear
   - Toggle: Show normalized matrix (M₀₀ = 1)
   - Display: All matrix elements with 3 decimal places
   - Display: D, P, Δ values

4. **Technical Specs**:
   - Language: Python 3.8+
   - Libraries: numpy, matplotlib, mpl_toolkits.mplot3d
   - Figure size: 18×12 inches (2 rows, 3 columns)
   - Dark theme #0f172a
   - Heatmap colormap: RdBu_r (red-blue diverging)
   - 3D Poincaré sphere showing transformation
   - Matrix element precision: 3 decimal places

5. **Code Structure**:
   ```python
   class MuellerMatrix:
       def __init__(self, matrix=None):
           if matrix is None:
               self.M = np.eye(4)  # Identity
           else:
               self.M = np.array(matrix, dtype=float)

       @classmethod
       def linear_polarizer(cls, angle_deg):
           # Mueller matrix for linear polarizer
           theta = np.radians(angle_deg)
           M = 0.5 * np.array([
               [1,      np.cos(2*theta), np.sin(2*theta), 0],
               [np.cos(2*theta), np.cos(2*theta)**2, ..., 0],
               # ... complete matrix
           ])
           return cls(M)

       @classmethod
       def quarter_wave_plate(cls, angle_deg):
           # QWP Mueller matrix

       @classmethod
       def depolarizer(cls, depolarization_factor):
           # Δ: 0 (no depolarization) to 1 (complete)

       def rotate(self, angle_deg):
           # M'(θ) = R(θ) M R(-θ)

       def diattenuation(self):
           # D = √(M₀₁² + M₀₂² + M₀₃²) / M₀₀

       def polarizance(self):
           # P = √(M₁₀² + M₂₀² + M₃₀²) / M₀₀

       def depolarization_index(self):
           # Δ = 1 - √(Tr(M^T M) - M₀₀²) / (√3 M₀₀)

       def apply(self, stokes_vector):
           # S_out = M × S_in
           return self.M @ stokes_vector.S

       def __matmul__(self, other):
           # Matrix multiplication (cascade)

   class MuellerMatrixDemo:
       def __init__(self):
           self.elements = []
           self.input_stokes = StokesVector(1, 1, 0, 0)

       def calculate_cascade(self):
           # M_total = M_n @ ... @ M_1

       def plot_matrix_heatmap(self, ax):
           # 4×4 heatmap with annotations

       def plot_stokes_bar(self, ax, stokes, title):
           # Bar chart for Stokes parameters

       def plot_poincare(self, ax):
           # 3D transformation on sphere
   ```

6. **Additional Features**:
   - Preset configurations:
     * Malus's Law (two polarizers)
     * Linear to circular (polarizer + QWP)
     * Depolarization example
   - Show Lu-Chipman decomposition M = M_Δ × M_R × M_D
   - Physics formula card for each element
   - Comparison with Jones matrices (for fully polarized)
   - Experimental realizability: 16 measurements needed
   - Applications:
     * Polarimetric imaging
     * Material characterization
     * Biomedical diagnostics
   - Save/Load configurations
   - Export matrix as CSV/LaTeX

7. **Validation Tests**:
   - Identity: M = I(4×4) → no change
   - Polarizer transmission: H polarizer on H light → S₁ = S₀
   - Cascade: Two parallel polarizers → light passes
   - Cascade: Two crossed polarizers → S = [0, 0, 0, 0]
   - QWP: Linear 45° → Circular (S₃ = ±S₀)
   - HWP: Linear H → Linear V
   - Rotator: Rotates S₁, S₂ (preserves S₃)
   - Diattenuation: Perfect polarizer D = 1, rotator D = 0
   - Depolarization: Δ > 0 reduces output DOP
   - Malus's Law: I_out = I₀ cos²θ

**Expected Output**: ~840-880 lines of comprehensive Python code with 4×4 matrix visualization.

**Reference**:
- Goldstein, Polarized Light, Chapter 4
- Lu, S.-Y., & Chipman, R.A. (1996). "Interpretation of Mueller matrices based on polar decomposition"
- Chipman, R.A., et al. (2018). Polarized Light and Optical Systems
```

---

## How to Use These Prompts / 如何使用这些提示词

### Method 1: Direct Copy-Paste
1. Copy the entire prompt for your desired demo
2. Paste into Claude, GPT-4, or other LLM
3. The model will generate the code based on specifications

### Method 2: Customize Before Generation
1. Read through the prompt
2. Modify parameters:
   - Adjust figure sizes
   - Change color schemes
   - Add/remove features
   - Simplify for educational level
3. Submit modified prompt to LLM

### Method 3: Iterative Refinement
1. Start with basic prompt
2. Generate initial version
3. Ask for specific modifications:
   - "Add a feature to export data as CSV"
   - "Make the visualization more colorful"
   - "Add keyboard shortcuts"

### Method 4: Create Variations
Use prompts as templates to create new demos:
```
Based on the [Malus's Law] prompt above, create a demo for:
- Photoelasticity (stress-induced birefringence)
- Circular dichroism
- Faraday rotation
```

---

## Best Practices for Prompt Engineering / 提示词工程最佳实践

### ✅ Do's (推荐做法)

1. **Be Specific About Physics**
   - Include exact formulas
   - Cite references
   - Specify validation criteria

2. **Define Technical Requirements**
   - Language version
   - Library constraints
   - Performance expectations

3. **Describe Visualizations Clearly**
   - Number of panels
   - Plot types (line, bar, 3D, polar)
   - Color schemes
   - Annotations

4. **Structure Code Requirements**
   - Class hierarchy
   - Method signatures
   - Expected line count

5. **Include Validation**
   - Test cases
   - Physical constraints
   - Edge cases

### ❌ Don'ts (避免事项)

1. **Don't Be Vague**
   - ❌ "Make a polarization demo"
   - ✅ "Create Malus's Law demo with I = I₀cos²θ, showing intensity vs angle plot"

2. **Don't Omit Physics**
   - Always include formulas
   - Specify units
   - Define symbols

3. **Don't Ignore Platform**
   - Specify Python/MATLAB
   - State version requirements
   - Note library availability

4. **Don't Skip Visualization Details**
   - Describe each panel
   - Specify color coding
   - Define interactivity

---

## Customization Templates / 自定义模板

### Template 1: Change Programming Language

```markdown
Convert the [Demo Name] prompt above to [Target Language]:
- Language: MATLAB/Julia/JavaScript/etc.
- Use equivalent libraries
- Maintain same physics and features
- Adapt UI controls to platform conventions
```

### Template 2: Simplify for Education

```markdown
Create a simplified version of [Demo Name] for undergraduate students:
- Remove advanced features
- Simplify visualizations (2-3 panels max)
- Add more explanatory text
- Include step-by-step tutorials
- Limit parameter ranges for clarity
```

### Template 3: Add Advanced Features

```markdown
Enhance the [Demo Name] with:
- 3D visualization using three.js
- Real-time animation
- Export to video (MP4)
- Machine learning integration
- Multi-threading for performance
```

### Template 4: Create Web Version

```markdown
Convert [Demo Name] to a web application:
- Frontend: React + TypeScript
- Visualization: D3.js or Plotly.js
- Styling: Tailwind CSS
- State management: Redux/Zustand
- Deploy to: Vercel/Netlify
```

---

## Prompt Quality Checklist / 提示词质量检查

Before submitting your prompt, verify:

- [ ] **Physics formulas included** (with symbol definitions)
- [ ] **Visualization specified** (number of panels, plot types)
- [ ] **Interactivity defined** (sliders, buttons, toggles)
- [ ] **Technical stack stated** (language, libraries, versions)
- [ ] **Code structure outlined** (classes, methods)
- [ ] **Validation tests listed** (expected behaviors)
- [ ] **References provided** (textbooks, papers)
- [ ] **Expected output quantified** (line count, file size)
- [ ] **Edge cases considered** (error handling, constraints)
- [ ] **Documentation requested** (comments, docstrings)

---

## Example: Using a Prompt / 示例：使用提示词

**User → LLM**:
```
[Paste Malus's Law prompt from above]
```

**LLM Response**:
```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, Button

class MalusLawDemo:
    def __init__(self):
        # [Generated implementation following specifications]
        ...

    def calculate_intensity(self, angle_deg):
        theta_rad = np.radians(angle_deg)
        return self.I0 * np.cos(theta_rad)**2

    # [More methods as specified in prompt]
```

**User Follow-up** (optional):
```
Great! Now add a feature to compare with experimental data:
- Load CSV file with angle, intensity columns
- Overlay experimental points on theoretical curve
- Calculate R² goodness of fit
```

---

## Integration with Existing Codebase / 与现有代码库集成

These prompts generate standalone demos. To integrate with the main project:

### Option 1: Generate and Copy
1. Use prompt to generate code
2. Review and test output
3. Copy into `src/demo-sources/python/` or `matlab/`
4. Update `README.md` and `PHYSICS_VALIDATION.md`

### Option 2: Generate and Adapt
1. Generate code using prompt
2. Modify to match project style (dark theme, bilingual)
3. Add to existing files or create new
4. Run test suite (`test_demos.py`)

### Option 3: Prompt for Direct Integration
Add to prompt:
```
Generate this code to integrate with existing project at:
[repository path]

Follow these style guidelines:
- Dark theme: background #0f172a
- Bilingual comments (English + Chinese)
- Match existing class structure in [related_demo.py]
```

---

## Advanced: Multi-Step Generation / 高级：多步骤生成

For complex demos, break into phases:

### Phase 1: Core Physics
```
First, create just the physics calculation functions for [Demo]:
- calculate_[formula_name]()
- validate_[physical_constraint]()
- No visualization yet
```

### Phase 2: Visualization
```
Now add visualization to the physics code:
- [Specify panels]
- [Specify plots]
- Use the existing calculation functions
```

### Phase 3: Interactivity
```
Finally, add interactive controls:
- [Specify widgets]
- Connect to visualization update
- Add real-time responsiveness
```

---

## Troubleshooting Generated Code / 生成代码故障排除

### Issue 1: Physics Inaccurate
**Solution**: Add more specific formulas and validation in prompt
```
Ensure formula is exactly: I = I₀ × cos²(θ)
Validate with test cases:
- I(0°) must equal I₀
- I(90°) must equal 0
```

### Issue 2: Visualization Too Complex
**Solution**: Simplify panel requirements
```
Reduce to 3 panels:
1. Main plot
2. Control panel
3. Info card
```

### Issue 3: Poor Code Structure
**Solution**: Specify class hierarchy explicitly
```
Use this exact structure:
class Demo:
    def __init__(): ...
    def calculate(): ...
    def plot(): ...
    def update(): ...
    def run(): ...
```

---

## Resources / 资源

### LLM Platforms for Code Generation
- **Claude** (Anthropic): Excellent for scientific code
- **GPT-4** (OpenAI): Strong general-purpose generation
- **Gemini** (Google): Good for multimodal (code + diagrams)
- **LLaMA** (Meta): Open-source alternative

### Testing Generated Code
```bash
# Python
python3 -m py_compile generated_demo.py
python3 generated_demo.py

# MATLAB
matlab -nodisplay -r "run('generated_demo.m'); exit"
```

### Validation
- Compare output with reference implementations
- Check physics formulas against textbooks
- Test edge cases (0°, 90°, 180°)
- Verify energy conservation

---

## Appendix: Physics Formula Reference / 附录：物理公式参考

Quick reference for formulas used in prompts:

| Demo | Key Formula | Variables |
|------|-------------|-----------|
| Malus's Law | I = I₀ cos²θ | I: intensity, θ: angle |
| Birefringence | n₁sinθ₁ = n_o sinθ_o | n: refractive index |
| Fresnel | r_s = (n₁cosθᵢ - n₂cosθₜ)/(n₁cosθᵢ + n₂cosθₜ) | r: reflection coefficient |
| Brewster | θ_B = arctan(n₂/n₁) | θ_B: Brewster angle |
| Optical Rotation | θ = αLC | α: specific rotation, L: length, C: concentration |
| Rayleigh | I ∝ 1/λ⁴ | λ: wavelength |
| Jones | E_out = J × E_in | J: Jones matrix (2×2 complex) |
| Stokes | DOP = √(S₁²+S₂²+S₃²)/S₀ | S: Stokes parameters |
| Mueller | S_out = M × S_in | M: Mueller matrix (4×4 real) |

---

## Contributing / 贡献

Improvements to these prompts are welcome! Consider:
- Adding more advanced features
- Simplifying for different education levels
- Creating prompts for new demos (Stage 3-4)
- Translating to other languages
- Adding domain-specific variations (astronomy, biology, materials science)

---

**Document Version**: 1.0
**Date**: 2026-01-14
**Prompts For**: 10 polarization optics demos
**Total Prompt Count**: 10 comprehensive prompts
**Estimated Total Output**: ~5,000-6,000 lines of code if all generated

**Usage**: Free for educational and research purposes
**Attribution**: Please cite this document if using prompts for publications

---

## Quick Prompt Index / 快速提示词索引

| # | Demo | Lines | Complexity | Prompt Length |
|---|------|-------|------------|---------------|
| 1 | Malus's Law | ~450 | ⭐⭐ | ~600 words |
| 2 | Birefringence | ~460 | ⭐⭐⭐ | ~700 words |
| 3 | Fresnel Equations | ~530 | ⭐⭐⭐ | ~750 words |
| 4 | Waveplate | ~600 | ⭐⭐⭐⭐ | ~850 words |
| 5 | Brewster's Angle | ~270 | ⭐⭐ | ~550 words |
| 6 | Optical Rotation | ~280 | ⭐⭐ | ~600 words |
| 7 | Rayleigh Scattering | ~300 | ⭐⭐⭐ | ~650 words |
| 8 | Jones Matrix | ~1,280 | ⭐⭐⭐⭐⭐ | ~1,100 words |
| 9 | Stokes Vector | ~840 | ⭐⭐⭐⭐ | ~950 words |
| 10 | Mueller Matrix | ~840 | ⭐⭐⭐⭐⭐ | ~1,050 words |

**Total**: ~5,850 lines of code potential | ~8,400 words of prompts

---

**End of Document**
