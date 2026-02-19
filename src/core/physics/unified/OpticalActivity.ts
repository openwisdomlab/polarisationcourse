/**
 * Optical Activity Module (旋光性模块)
 *
 * Provides physics calculations for optical rotation in chiral (optically active)
 * materials such as sugar solutions, amino acids, and quartz.
 *
 * Extracted from standalone demo code (OpticalRotationDemo.tsx) into the
 * unified engine so the physics engine is the single source of truth.
 *
 * Physics background:
 * - Chiral molecules rotate the plane of linearly polarized light.
 * - The rotation angle α depends on:
 *   α = [α]_λ × c × l
 *   where:
 *     [α]_λ = specific rotation at wavelength λ (deg/(dm·g/mL))
 *     c = concentration (g/mL)
 *     l = path length (dm)
 *
 * - Wavelength dependence (Drude equation):
 *   [α]_λ ≈ [α]_D × (λ_D / λ)²
 *   where λ_D = 589nm (sodium D-line)
 *
 * - Right-handed (dextrorotatory, d or +): rotates clockwise (looking into beam)
 * - Left-handed (levorotatory, l or -): rotates counterclockwise
 */

import { Complex } from '../../math/Complex';
import { Matrix2x2 } from '../../math/Matrix2x2';
import { CoherencyMatrix } from './CoherencyMatrix';

// ========== Material Database ==========

/**
 * Optical activity properties of a chiral substance.
 */
export interface ChiralMaterial {
  /** Material name */
  name: string;
  /** Chinese name */
  nameZh: string;
  /** Specific rotation [α]_D at sodium D-line (589nm) in deg/(dm·g/mL) */
  specificRotation: number;
  /** Rotation direction: 'd' (dextrorotatory/+) or 'l' (levorotatory/-) */
  direction: 'd' | 'l';
  /** Typical concentration range [min, max] in g/mL */
  concentrationRange: [number, number];
  /** Chemical formula (optional) */
  formula?: string;
}

/**
 * Database of common optically active substances.
 *
 * Specific rotations are at 589nm (Na D-line), 20°C.
 * Positive = dextrorotatory (right-handed rotation).
 */
export const CHIRAL_MATERIALS: Record<string, ChiralMaterial> = {
  sucrose: {
    name: 'Sucrose',
    nameZh: '蔗糖',
    specificRotation: 66.5,
    direction: 'd',
    concentrationRange: [0, 0.5],
    formula: 'C₁₂H₂₂O₁₁',
  },
  glucose: {
    name: 'D-Glucose',
    nameZh: '葡萄糖',
    specificRotation: 52.7,
    direction: 'd',
    concentrationRange: [0, 0.4],
    formula: 'C₆H₁₂O₆',
  },
  fructose: {
    name: 'D-Fructose',
    nameZh: '果糖',
    specificRotation: -92,
    direction: 'l',
    concentrationRange: [0, 0.3],
    formula: 'C₆H₁₂O₆',
  },
  tartaricAcid: {
    name: 'L-Tartaric Acid',
    nameZh: '酒石酸',
    specificRotation: 12,
    direction: 'd',
    concentrationRange: [0, 0.3],
    formula: 'C₄H₆O₆',
  },
  lAlanine: {
    name: 'L-Alanine',
    nameZh: 'L-丙氨酸',
    specificRotation: 2.7,
    direction: 'd',
    concentrationRange: [0, 0.2],
    formula: 'C₃H₇NO₂',
  },
  quartz: {
    name: 'Crystalline Quartz',
    nameZh: '石英晶体',
    specificRotation: 21.7, // per mm, not per dm·g/mL — different convention
    direction: 'd',
    concentrationRange: [1, 1], // Solid — concentration not applicable
  },
};

/**
 * Common spectral lines used in polarimetry.
 */
export interface SpectralLine {
  id: string;
  name: string;
  nameZh: string;
  wavelengthNm: number;
  color: string;
}

export const SPECTRAL_LINES: SpectralLine[] = [
  { id: 'na-d', name: '589 nm (D-line)', nameZh: '589 nm 黄光', wavelengthNm: 589, color: '#fbbf24' },
  { id: 'h-alpha', name: '656 nm (Hα)', nameZh: '656 nm 红光 (Hα)', wavelengthNm: 656, color: '#ef4444' },
  { id: 'hg-green', name: '546 nm (Hg)', nameZh: '546 nm 绿光', wavelengthNm: 546, color: '#22c55e' },
  { id: 'h-beta', name: '486 nm (Hβ)', nameZh: '486 nm 蓝光 (Hβ)', wavelengthNm: 486, color: '#3b82f6' },
  { id: 'hg-violet', name: '436 nm (Hg)', nameZh: '436 nm 紫光', wavelengthNm: 436, color: '#a855f7' },
];

// ========== Core Calculations ==========

/**
 * Calculate specific rotation at a given wavelength using the Drude equation.
 *
 * [α]_λ ≈ [α]_D × (589 / λ)²
 *
 * This is a simplified single-term Drude model. More accurate models use
 * [α]_λ = A / (λ² - λ₀²) but this approximation is sufficient for education.
 *
 * @param specificRotationD Specific rotation at Na D-line (589nm)
 * @param wavelengthNm Target wavelength in nm
 * @returns Specific rotation at the target wavelength
 */
export function specificRotationAtWavelength(
  specificRotationD: number,
  wavelengthNm: number
): number {
  return specificRotationD * Math.pow(589 / wavelengthNm, 2);
}

/**
 * Calculate the optical rotation angle for a chiral solution.
 *
 * α = [α]_λ × c × l
 *
 * @param specificRotation Specific rotation at the operating wavelength (deg/(dm·g/mL))
 * @param concentration Solution concentration (g/mL)
 * @param pathLengthDm Path length through the solution (dm)
 * @returns Rotation angle in degrees (positive = clockwise looking into beam)
 */
export function rotationAngle(
  specificRotation: number,
  concentration: number,
  pathLengthDm: number
): number {
  return specificRotation * concentration * pathLengthDm;
}

/**
 * Full calculation: material + wavelength + solution → rotation angle.
 *
 * @param material Chiral material from database
 * @param wavelengthNm Light wavelength in nm
 * @param concentration Solution concentration in g/mL
 * @param pathLengthDm Path length in dm
 * @returns Rotation angle in degrees
 */
export function calculateOpticalRotation(
  material: ChiralMaterial,
  wavelengthNm: number,
  concentration: number,
  pathLengthDm: number
): number {
  const specRot = specificRotationAtWavelength(material.specificRotation, wavelengthNm);
  return rotationAngle(specRot, concentration, pathLengthDm);
}

// ========== Jones Matrix Representation ==========

/**
 * Create a Jones rotation matrix for optical activity.
 *
 * An optically active medium rotates the polarization plane by angle α:
 * M = [cos α  -sin α]
 *     [sin α   cos α]
 *
 * This is a pure rotation — no intensity loss, no ellipticity introduced.
 *
 * @param rotationDeg Rotation angle in degrees
 * @returns 2×2 Jones rotation matrix
 */
export function opticalActivityMatrix(rotationDeg: number): Matrix2x2 {
  const rad = rotationDeg * Math.PI / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  return new Matrix2x2(
    new Complex(c), new Complex(-s),
    new Complex(s), new Complex(c)
  );
}

/**
 * Apply optical rotation to a CoherencyMatrix.
 *
 * @param state Input polarization state
 * @param rotationDeg Rotation angle in degrees
 * @returns Rotated polarization state
 */
export function applyOpticalRotation(
  state: CoherencyMatrix,
  rotationDeg: number
): CoherencyMatrix {
  const matrix = opticalActivityMatrix(rotationDeg);
  return state.applyOperator(matrix);
}

// ========== Polarimetric System ==========

/**
 * Result of a complete polarimetric measurement.
 */
export interface PolarimetricResult {
  /** Rotation angle produced by the sample (degrees) */
  rotationAngle: number;
  /** Analyzer angle that maximizes transmission (null point) */
  nullPointAngle: number;
  /** Transmitted intensity for a given analyzer angle */
  transmittedIntensity: number;
  /** Output CoherencyMatrix */
  outputState: CoherencyMatrix;
  /** Whether rotation is dextrorotatory (positive) */
  isDextrorotatory: boolean;
  /** Specific rotation computed from measurement */
  measuredSpecificRotation: number;
}

/**
 * Simulate a complete polarimeter measurement.
 *
 * Optical train: Light → Polarizer → Sample (rotation) → Analyzer → Detector
 *
 * Malus's Law after rotation:
 * I = I₀ × cos²(α - β)
 * where α = rotation by sample, β = analyzer angle
 *
 * @param material Chiral material
 * @param wavelengthNm Light wavelength in nm
 * @param concentration Solution concentration in g/mL
 * @param pathLengthDm Path length in dm
 * @param analyzerAngleDeg Analyzer angle in degrees
 * @param inputIntensity Input light intensity (default: 1)
 * @returns Complete polarimetric result
 */
export function simulatePolarimeter(
  material: ChiralMaterial,
  wavelengthNm: number,
  concentration: number,
  pathLengthDm: number,
  analyzerAngleDeg: number,
  inputIntensity: number = 1.0
): PolarimetricResult {
  // Step 1: Compute rotation angle
  const alpha = calculateOpticalRotation(material, wavelengthNm, concentration, pathLengthDm);

  // Step 2: Apply polarizer (creates horizontal polarization)
  const afterPolarizer = CoherencyMatrix.createLinear(inputIntensity, 0);

  // Step 3: Apply optical rotation
  const afterSample = applyOpticalRotation(afterPolarizer, alpha);

  // Step 4: Apply analyzer (another polarizer at given angle)
  const analyzerRad = analyzerAngleDeg * Math.PI / 180;
  const c = Math.cos(analyzerRad);
  const s = Math.sin(analyzerRad);
  const analyzerMatrix = new Matrix2x2(
    new Complex(c * c), new Complex(c * s),
    new Complex(c * s), new Complex(s * s)
  );
  const outputState = afterSample.applyOperator(analyzerMatrix);

  // Null point: analyzer at α° (or α + 180°)
  const nullAngle = ((alpha % 360) + 360) % 360;

  return {
    rotationAngle: alpha,
    nullPointAngle: nullAngle,
    transmittedIntensity: outputState.intensity,
    outputState,
    isDextrorotatory: alpha >= 0,
    measuredSpecificRotation: (concentration > 0 && pathLengthDm > 0)
      ? alpha / (concentration * pathLengthDm)
      : 0,
  };
}

/**
 * Compute rotatory dispersion curve — rotation angle as a function of wavelength.
 *
 * This generates the data for an Optical Rotatory Dispersion (ORD) plot.
 *
 * @param material Chiral material
 * @param concentration Solution concentration in g/mL
 * @param pathLengthDm Path length in dm
 * @param minWavelength Start wavelength in nm (default: 400)
 * @param maxWavelength End wavelength in nm (default: 700)
 * @param step Wavelength step in nm (default: 5)
 * @returns Array of { wavelength, rotation } data points
 */
export function rotatoryDispersionCurve(
  material: ChiralMaterial,
  concentration: number,
  pathLengthDm: number,
  minWavelength: number = 400,
  maxWavelength: number = 700,
  step: number = 5
): Array<{ wavelengthNm: number; rotationDeg: number }> {
  const curve: Array<{ wavelengthNm: number; rotationDeg: number }> = [];

  for (let lambda = minWavelength; lambda <= maxWavelength; lambda += step) {
    curve.push({
      wavelengthNm: lambda,
      rotationDeg: calculateOpticalRotation(material, lambda, concentration, pathLengthDm),
    });
  }

  return curve;
}
