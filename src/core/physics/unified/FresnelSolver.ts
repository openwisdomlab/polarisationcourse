/**
 * Fresnel Equation Solver (菲涅尔方程求解器)
 *
 * Computes reflection and transmission coefficients at dielectric interfaces.
 * Handles all cases including:
 * - Normal incidence
 * - Oblique incidence
 * - Total internal reflection (TIR)
 * - Brewster's angle
 *
 * Returns complex amplitude coefficients that preserve phase information,
 * essential for interference and thin-film effects.
 */

import { Complex } from '../../math/Complex';

// Numerical tolerances
const ANGLE_EPSILON = 1e-10;

/**
 * Result of Fresnel equation calculation
 */
export interface FresnelCoefficients {
  /** Complex amplitude reflection coefficient for s-polarization */
  rs: Complex;

  /** Complex amplitude reflection coefficient for p-polarization */
  rp: Complex;

  /** Complex amplitude transmission coefficient for s-polarization */
  ts: Complex;

  /** Complex amplitude transmission coefficient for p-polarization */
  tp: Complex;

  /** Power reflectance for s-polarization: Rs = |rs|² */
  Rs: number;

  /** Power reflectance for p-polarization: Rp = |rp|² */
  Rp: number;

  /** Power transmittance for s-polarization */
  Ts: number;

  /** Power transmittance for p-polarization */
  Tp: number;

  /** Transmission angle (radians), NaN for TIR */
  thetaT: number;

  /** True if total internal reflection occurs */
  isTIR: boolean;
}

/**
 * Solve Fresnel equations for interface between two dielectric media
 *
 * @param n1 Refractive index of incident medium
 * @param n2 Refractive index of transmitted medium
 * @param thetaI Angle of incidence (radians)
 * @returns Complete Fresnel coefficients
 */
export function solveFresnel(
  n1: number,
  n2: number,
  thetaI: number
): FresnelCoefficients {
  // Clamp incidence angle to physical range
  const theta = Math.max(0, Math.min(Math.PI / 2, thetaI));

  const cosI = Math.cos(theta);
  const sinI = Math.sin(theta);

  // Snell's law: n1 sin(θI) = n2 sin(θT)
  const sinT = (n1 / n2) * sinI;
  const sinT2 = sinT * sinT;

  // Check for total internal reflection
  if (sinT2 > 1) {
    return computeTIR(n1, n2, cosI, sinT2);
  }

  // Normal transmission
  const cosT = Math.sqrt(1 - sinT2);
  const thetaT = Math.asin(sinT);

  return computeNormalTransmission(n1, n2, cosI, cosT, thetaT);
}

/**
 * Compute coefficients for total internal reflection
 */
function computeTIR(
  n1: number,
  n2: number,
  cosI: number,
  sinT2: number
): FresnelCoefficients {
  // In TIR, cos(θT) becomes purely imaginary
  // cos(θT) = i√(sin²θT - 1)
  const imagCosT = Math.sqrt(sinT2 - 1);

  // Complex Fresnel coefficients for TIR
  // rs = (n1 cosI - n2 cosT) / (n1 cosI + n2 cosT)
  // rp = (n2 cosI - n1 cosT) / (n2 cosI + n1 cosT)
  // where cosT = i × imagCosT

  const n1CosI = n1 * cosI;
  const n2CosI = n2 * cosI;
  const n2ImCosT = n2 * imagCosT;
  const n1ImCosT = n1 * imagCosT;

  // rs numerator: n1 cosI - i n2 imagCosT
  // rs denominator: n1 cosI + i n2 imagCosT
  const rsNum = new Complex(n1CosI, -n2ImCosT);
  const rsDen = new Complex(n1CosI, n2ImCosT);
  const rs = rsNum.div(rsDen);

  // rp numerator: n2 cosI - i n1 imagCosT
  // rp denominator: n2 cosI + i n1 imagCosT
  const rpNum = new Complex(n2CosI, -n1ImCosT);
  const rpDen = new Complex(n2CosI, n1ImCosT);
  const rp = rpNum.div(rpDen);

  // For TIR: |r|² = 1, but phase varies
  // Transmission coefficients are zero (no energy transmitted)
  return {
    rs,
    rp,
    ts: Complex.ZERO,
    tp: Complex.ZERO,
    Rs: 1,
    Rp: 1,
    Ts: 0,
    Tp: 0,
    thetaT: NaN,
    isTIR: true
  };
}

/**
 * Compute coefficients for normal transmission (no TIR)
 */
function computeNormalTransmission(
  n1: number,
  n2: number,
  cosI: number,
  cosT: number,
  thetaT: number
): FresnelCoefficients {
  const n1CosI = n1 * cosI;
  const n1CosT = n1 * cosT;
  const n2CosI = n2 * cosI;
  const n2CosT = n2 * cosT;

  // Fresnel amplitude coefficients (real for dielectrics without TIR)

  // s-polarization (TE, perpendicular)
  // rs = (n1 cosI - n2 cosT) / (n1 cosI + n2 cosT)
  const rsDenom = n1CosI + n2CosT;
  const rsVal = Math.abs(rsDenom) < ANGLE_EPSILON
    ? 0
    : (n1CosI - n2CosT) / rsDenom;
  const rs = new Complex(rsVal, 0);

  // ts = 2 n1 cosI / (n1 cosI + n2 cosT)
  const tsVal = Math.abs(rsDenom) < ANGLE_EPSILON
    ? 1
    : (2 * n1CosI) / rsDenom;
  const ts = new Complex(tsVal, 0);

  // p-polarization (TM, parallel)
  // rp = (n2 cosI - n1 cosT) / (n2 cosI + n1 cosT)
  const rpDenom = n2CosI + n1CosT;
  const rpVal = Math.abs(rpDenom) < ANGLE_EPSILON
    ? 0
    : (n2CosI - n1CosT) / rpDenom;
  const rp = new Complex(rpVal, 0);

  // tp = 2 n1 cosI / (n2 cosI + n1 cosT)
  const tpVal = Math.abs(rpDenom) < ANGLE_EPSILON
    ? 1
    : (2 * n1CosI) / rpDenom;
  const tp = new Complex(tpVal, 0);

  // Power coefficients (reflectance and transmittance)
  const Rs = rsVal * rsVal;
  const Rp = rpVal * rpVal;

  // Transmittance includes the ratio of beam cross-sections and refractive indices
  // T = (n2 cosT / n1 cosI) × |t|²
  const ratio = (n2 * cosT) / (n1 * cosI);
  const Ts = ratio * tsVal * tsVal;
  const Tp = ratio * tpVal * tpVal;

  return {
    rs, rp, ts, tp,
    Rs, Rp, Ts, Tp,
    thetaT,
    isTIR: false
  };
}

/**
 * Compute Brewster's angle for a given interface
 * At Brewster's angle, p-polarized light has zero reflection
 *
 * tan(θB) = n2/n1
 */
export function brewsterAngle(n1: number, n2: number): number {
  return Math.atan(n2 / n1);
}

/**
 * Compute critical angle for total internal reflection
 * Returns NaN if n1 < n2 (TIR not possible)
 *
 * sin(θc) = n2/n1
 */
export function criticalAngle(n1: number, n2: number): number {
  if (n1 <= n2) return NaN;
  return Math.asin(n2 / n1);
}

/**
 * Average reflectance for unpolarized light
 */
export function averageReflectance(coeffs: FresnelCoefficients): number {
  return (coeffs.Rs + coeffs.Rp) / 2;
}

/**
 * Average transmittance for unpolarized light
 */
export function averageTransmittance(coeffs: FresnelCoefficients): number {
  return (coeffs.Ts + coeffs.Tp) / 2;
}

// ========== Common Materials ==========

/** Refractive indices for common materials at visible wavelengths */
export const REFRACTIVE_INDICES = {
  vacuum: 1.0,
  air: 1.00029,
  water: 1.333,
  glass: 1.5,       // Generic crown glass
  bk7: 1.5168,      // Schott BK7
  diamond: 2.417,
  sapphire: 1.77,
  calciteO: 1.6584, // Ordinary ray
  calciteE: 1.4864, // Extraordinary ray
  quartz: 1.544,
  ice: 1.31,
  acrylic: 1.49,
  polycarbonate: 1.586,
  crown: 1.52,
  flint: 1.65
} as const;

/**
 * Wavelength-dependent refractive index using Sellmeier equation
 * For BK7 glass
 *
 * @param wavelength Wavelength in micrometers
 */
export function sellmeierBK7(wavelength: number): number {
  const l2 = wavelength * wavelength;

  // Sellmeier coefficients for BK7
  const B1 = 1.03961212;
  const B2 = 0.231792344;
  const B3 = 1.01046945;
  const C1 = 0.00600069867;
  const C2 = 0.0200179144;
  const C3 = 103.560653;

  const n2 = 1 +
    (B1 * l2) / (l2 - C1) +
    (B2 * l2) / (l2 - C2) +
    (B3 * l2) / (l2 - C3);

  return Math.sqrt(n2);
}

/**
 * Cauchy approximation for refractive index
 * n(λ) = A + B/λ²
 *
 * @param wavelength Wavelength in micrometers
 * @param A Cauchy coefficient A
 * @param B Cauchy coefficient B (μm²)
 */
export function cauchyApprox(
  wavelength: number,
  A: number,
  B: number
): number {
  return A + B / (wavelength * wavelength);
}
