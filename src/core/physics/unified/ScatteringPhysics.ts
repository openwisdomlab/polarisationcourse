/**
 * Scattering Physics Module (散射物理模块)
 *
 * Provides physics calculations for light scattering phenomena,
 * extracted from standalone demo code into the unified engine.
 *
 * Currently implements:
 * 1. Rayleigh Scattering (λ⁻⁴ law, blue sky effect)
 * 2. Mie Scattering (for larger particles, white clouds)
 * 3. Wavelength ↔ Color conversion (visible spectrum)
 * 4. Atmospheric color model (sky color vs. sun elevation)
 *
 * Physics background:
 * - Rayleigh: particle size << λ. I ∝ λ⁻⁴ × (1 + cos²θ).
 *   Polarization degree = sin²θ / (1 + cos²θ).
 * - Mie: particle size ~ λ. Complex angular dependence,
 *   forward-scattering dominant. Minimal wavelength dependence → white.
 *
 * These calculations were previously embedded directly in demo UI components
 * (RayleighScatteringDemo.tsx, MieScatteringDemo.tsx). This module centralizes
 * them so the physics engine is the single source of truth.
 */

import { CoherencyMatrix } from './CoherencyMatrix';

// ========== Rayleigh Scattering ==========

/**
 * Rayleigh scattering intensity relative to a reference wavelength.
 *
 * I(λ) / I(λ_ref) = (λ_ref / λ)⁴
 *
 * @param wavelengthNm Wavelength in nm
 * @param referenceNm Reference wavelength in nm (default: 550nm, green)
 * @returns Relative intensity (1.0 at reference wavelength)
 */
export function rayleighIntensity(
  wavelengthNm: number,
  referenceNm: number = 550
): number {
  const ratio = referenceNm / wavelengthNm;
  return Math.pow(ratio, 4);
}

/**
 * Rayleigh scattering cross section (relative).
 *
 * σ ∝ a⁶ / λ⁴  where a = particle radius
 *
 * @param particleRadiusNm Particle radius in nm
 * @param wavelengthNm Wavelength in nm
 * @returns Relative cross section (arbitrary units, for comparison only)
 */
export function rayleighCrossSection(
  particleRadiusNm: number,
  wavelengthNm: number
): number {
  return Math.pow(particleRadiusNm, 6) / Math.pow(wavelengthNm, 4);
}

/**
 * Rayleigh phase function — angular distribution of scattered light.
 *
 * P(θ) = (3 / 16π) × (1 + cos²θ)
 *
 * Satisfies normalization: ∫ P(θ) dΩ = 1 over full sphere.
 *
 * @param thetaRad Scattering angle in radians (0 = forward, π = backward)
 * @returns Probability density per solid angle
 */
export function rayleighPhaseFunction(thetaRad: number): number {
  const cosTheta = Math.cos(thetaRad);
  return (3 / (16 * Math.PI)) * (1 + cosTheta * cosTheta);
}

/**
 * Degree of linear polarization for Rayleigh-scattered light.
 *
 * DoLP = sin²θ / (1 + cos²θ)
 *
 * - θ = 0° (forward): DoLP = 0 (unpolarized)
 * - θ = 90° (perpendicular): DoLP = 1 (fully polarized)
 * - θ = 180° (backward): DoLP = 0 (unpolarized)
 *
 * @param thetaRad Scattering angle in radians
 * @returns Degree of linear polarization [0, 1]
 */
export function rayleighPolarizationDegree(thetaRad: number): number {
  const sinSq = Math.pow(Math.sin(thetaRad), 2);
  const cosSq = Math.pow(Math.cos(thetaRad), 2);
  const denominator = 1 + cosSq;
  if (denominator < 1e-12) return 0;
  return sinSq / denominator;
}

/**
 * Compute the CoherencyMatrix for Rayleigh-scattered light.
 *
 * Combines intensity (λ⁻⁴) and polarization degree (angle-dependent)
 * into a proper physics state. The scattered light is partially polarized
 * perpendicular to the scattering plane.
 *
 * @param wavelengthNm Wavelength in nm
 * @param thetaRad Scattering angle in radians
 * @param inputIntensity Input light intensity (default: 1)
 * @returns CoherencyMatrix representing the scattered light state
 */
export function rayleighScatteredState(
  wavelengthNm: number,
  thetaRad: number,
  inputIntensity: number = 1.0
): CoherencyMatrix {
  const relativeI = rayleighIntensity(wavelengthNm);
  const dop = rayleighPolarizationDegree(thetaRad);
  const scatteredI = inputIntensity * relativeI * rayleighPhaseFunction(thetaRad) * 4 * Math.PI;

  // Scattered polarization is perpendicular to scattering plane (s-polarized)
  // Orientation angle = π/2 (vertical/perpendicular to scattering plane)
  return CoherencyMatrix.createPartiallyPolarized(scatteredI, dop, Math.PI / 2);
}

// ========== Mie Scattering ==========

/**
 * Mie size parameter x = 2πa/λ.
 * Determines the scattering regime:
 * - x << 1: Rayleigh regime
 * - x ~ 1: Mie regime (resonance)
 * - x >> 1: Geometric optics regime
 *
 * @param particleRadiusNm Particle radius in nm
 * @param wavelengthNm Wavelength in nm
 * @returns Dimensionless size parameter
 */
export function mieSizeParameter(
  particleRadiusNm: number,
  wavelengthNm: number
): number {
  return (2 * Math.PI * particleRadiusNm) / wavelengthNm;
}

/**
 * Simplified Mie scattering efficiency (Qsca) approximation.
 *
 * For x << 1: Qsca ≈ (8/3)x⁴ (Rayleigh limit)
 * For x ~ 1: Qsca oscillates (resonances)
 * For x >> 1: Qsca → 2 (extinction paradox)
 *
 * This is a smooth approximation — full Mie theory requires
 * computing Bessel functions which is beyond our scope.
 *
 * @param x Size parameter
 * @returns Scattering efficiency (dimensionless, 0 to ~4)
 */
export function mieScatteringEfficiency(x: number): number {
  if (x < 0.01) {
    // Rayleigh limit
    return (8 / 3) * Math.pow(x, 4);
  }

  if (x > 20) {
    // Geometric limit with extinction paradox
    return 2.0;
  }

  // Transition regime: smooth interpolation with oscillations
  const rayleigh = (8 / 3) * Math.pow(x, 4);

  // Damped oscillation around the geometric limit (Qsca → 2)
  const dampedOsc = 2.0 + 2.0 * Math.exp(-0.5 * x) * Math.cos(2 * x - Math.PI / 4);

  // Blend between Rayleigh and Mie
  const t = 1 / (1 + Math.exp(-3 * (x - 1))); // Sigmoid transition
  return (1 - t) * Math.min(rayleigh, 4) + t * dampedOsc;
}

/**
 * Simplified Mie phase function (Henyey-Greenstein approximation).
 *
 * P(θ) = (1 - g²) / (4π(1 + g² - 2g cosθ)^(3/2))
 *
 * @param thetaRad Scattering angle in radians
 * @param g Asymmetry parameter: -1 (backscatter) to +1 (forward scatter)
 * @returns Phase function value
 */
export function henyeyGreensteinPhase(
  thetaRad: number,
  g: number
): number {
  const cosTheta = Math.cos(thetaRad);
  const g2 = g * g;
  const denom = 1 + g2 - 2 * g * cosTheta;
  return (1 - g2) / (4 * Math.PI * Math.pow(denom, 1.5));
}

/**
 * Estimate asymmetry parameter g from Mie size parameter.
 * Larger particles scatter more forward.
 *
 * @param x Size parameter
 * @returns Asymmetry parameter g [0, 1)
 */
export function mieAsymmetryParameter(x: number): number {
  if (x < 0.01) return 0; // Rayleigh: symmetric
  // Empirical fit: g increases with size and saturates near ~0.85
  return 0.85 * (1 - Math.exp(-0.5 * x));
}

// ========== Wavelength ↔ Color Conversion ==========

/**
 * Convert a visible wavelength to approximate sRGB color.
 *
 * Uses piecewise linear approximation of CIE color matching functions.
 * Valid for 380-780 nm range.
 *
 * @param wavelengthNm Wavelength in nanometers
 * @param intensity Brightness multiplier (0-1, default 1)
 * @returns RGB object with values 0-255
 */
export function wavelengthToRGB(
  wavelengthNm: number,
  intensity: number = 1.0
): { r: number; g: number; b: number; css: string } {
  let R = 0, G = 0, B = 0;

  if (wavelengthNm >= 380 && wavelengthNm < 440) {
    R = -(wavelengthNm - 440) / (440 - 380);
    B = 1;
  } else if (wavelengthNm >= 440 && wavelengthNm < 490) {
    G = (wavelengthNm - 440) / (490 - 440);
    B = 1;
  } else if (wavelengthNm >= 490 && wavelengthNm < 510) {
    G = 1;
    B = -(wavelengthNm - 510) / (510 - 490);
  } else if (wavelengthNm >= 510 && wavelengthNm < 580) {
    R = (wavelengthNm - 510) / (580 - 510);
    G = 1;
  } else if (wavelengthNm >= 580 && wavelengthNm < 645) {
    R = 1;
    G = -(wavelengthNm - 645) / (645 - 580);
  } else if (wavelengthNm >= 645 && wavelengthNm <= 780) {
    R = 1;
  }

  // Apply intensity attenuation at edges of visible spectrum
  let edgeFactor = 1.0;
  if (wavelengthNm >= 380 && wavelengthNm < 420) {
    edgeFactor = 0.3 + 0.7 * (wavelengthNm - 380) / (420 - 380);
  } else if (wavelengthNm > 700 && wavelengthNm <= 780) {
    edgeFactor = 0.3 + 0.7 * (780 - wavelengthNm) / (780 - 700);
  }

  R = Math.round(Math.min(255, Math.max(0, R * edgeFactor * intensity * 255)));
  G = Math.round(Math.min(255, Math.max(0, G * edgeFactor * intensity * 255)));
  B = Math.round(Math.min(255, Math.max(0, B * edgeFactor * intensity * 255)));

  return {
    r: R,
    g: G,
    b: B,
    css: `rgb(${R}, ${G}, ${B})`,
  };
}

// ========== Atmospheric Model ==========

/**
 * Compute sky color based on sun elevation angle.
 *
 * Models the effect of atmospheric path length on scattered color:
 * - Low sun (sunrise/sunset): long path → blue scattered away → orange/red
 * - High sun (noon): short path → strong Rayleigh scattering → blue sky
 *
 * @param sunElevationDeg Sun elevation angle in degrees (0 = horizon, 90 = zenith)
 * @returns CSS rgb color string
 */
export function skyColor(sunElevationDeg: number): string {
  const factor = Math.max(0, Math.min(90, sunElevationDeg)) / 90;

  if (factor < 0.2) {
    // Sunrise/sunset — orange/red
    const r = 255;
    const g = Math.round(100 + factor * 200);
    const b = Math.round(factor * 255);
    return `rgb(${r}, ${g}, ${b})`;
  } else if (factor < 0.5) {
    // Morning/evening — transition to blue
    const t = (factor - 0.2) / 0.3;
    const r = Math.round(255 * (1 - t));
    const g = Math.round(150 + 50 * t);
    const b = Math.round(200 + 55 * t);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Noon — blue
    return 'rgb(100, 180, 255)';
  }
}

/**
 * Compute the atmospheric optical depth for a given sun elevation.
 *
 * Optical depth ∝ 1/sin(elevation) (air mass factor).
 * At zenith (90°): optical depth = 1 (reference).
 * At horizon (0°): optical depth ≈ 38 (atmospheric refraction limit).
 *
 * @param elevationDeg Sun elevation in degrees
 * @returns Relative optical depth
 */
export function atmosphericOpticalDepth(elevationDeg: number): number {
  const elevationRad = Math.max(0.5, elevationDeg) * Math.PI / 180;
  // Kasten-Young formula approximation
  return 1 / (Math.sin(elevationRad) + 0.50572 * Math.pow(elevationDeg + 6.07995, -1.6364));
}

/**
 * Compute RGB transmission of white light through atmosphere.
 *
 * Each color channel has different Rayleigh scattering loss:
 * I(λ) = I₀ × exp(-τ × (550/λ)⁴)
 *
 * @param opticalDepth Atmospheric optical depth
 * @param referenceOpticalDepth Optical depth at which sunlight appears white (default: 1.0)
 * @returns RGB transmission factors [0, 1] for R, G, B
 */
export function atmosphericTransmission(
  opticalDepth: number,
  referenceOpticalDepth: number = 1.0
): { r: number; g: number; b: number } {
  const tau = opticalDepth / referenceOpticalDepth;

  // Rayleigh extinction at representative wavelengths
  // R=650nm, G=550nm, B=450nm
  const tauR = tau * Math.pow(550 / 650, 4); // ~0.51 × τ
  const tauG = tau * Math.pow(550 / 550, 4); // 1.0 × τ
  const tauB = tau * Math.pow(550 / 450, 4); // ~2.24 × τ

  return {
    r: Math.exp(-tauR),
    g: Math.exp(-tauG),
    b: Math.exp(-tauB),
  };
}
