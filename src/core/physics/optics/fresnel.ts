/**
 * Fresnel Polarization Module (菲涅尔偏振模块)
 *
 * Computes Mueller matrices for reflection and transmission at dielectric
 * interfaces. Handles all cases:
 *   - Normal incidence
 *   - Oblique incidence (including near-grazing)
 *   - Total Internal Reflection (TIR) with complex phase shifts
 *   - Brewster's angle (zero p-reflection)
 *
 * Convention:
 *   - All angles in RADIANS
 *   - s-polarization: perpendicular to plane of incidence (TE)
 *   - p-polarization: parallel to plane of incidence (TM)
 *   - Refractive indices are real (dielectric, no absorption)
 *
 * Reference: Hecht, "Optics", 5th ed., Chapter 8
 */

import type { MuellerMatrix } from './mueller';

// ========== Amplitude Coefficients ==========

/**
 * Fresnel amplitude reflection and transmission coefficients.
 */
export interface FresnelAmplitudes {
  /** Amplitude reflection coefficient for s-polarization */
  rs: number;
  /** Amplitude reflection coefficient for p-polarization */
  rp: number;
  /** Amplitude transmission coefficient for s-polarization */
  ts: number;
  /** Amplitude transmission coefficient for p-polarization */
  tp: number;
  /** Transmission angle in radians (NaN for TIR) */
  thetaT: number;
  /** Whether total internal reflection occurs */
  isTIR: boolean;
}

/**
 * Fresnel amplitude coefficients with complex values (for TIR).
 */
export interface FresnelAmplitudesComplex {
  /** Complex rs: [real, imag] */
  rs: [number, number];
  /** Complex rp: [real, imag] */
  rp: [number, number];
  /** Complex ts: [real, imag] */
  ts: [number, number];
  /** Complex tp: [real, imag] */
  tp: [number, number];
  /** Transmission angle in radians (NaN for TIR) */
  thetaT: number;
  /** Whether total internal reflection occurs */
  isTIR: boolean;
}

// ========== Core Fresnel Solver ==========

/**
 * Compute Fresnel amplitude coefficients for a dielectric interface.
 * Returns real coefficients (for non-TIR) or complex coefficients (for TIR).
 *
 * @param n1 Refractive index of incident medium
 * @param n2 Refractive index of transmitted medium
 * @param thetaI Angle of incidence in radians [0, π/2]
 */
export function fresnelAmplitudes(
  n1: number,
  n2: number,
  thetaI: number,
): FresnelAmplitudesComplex {
  const cosI = Math.cos(thetaI);
  const sinI = Math.sin(thetaI);

  // Snell's law: n1 sin(θI) = n2 sin(θT)
  const sinT = (n1 / n2) * sinI;
  const sinT2 = sinT * sinT;

  // Check for TIR
  if (sinT2 > 1) {
    return fresnelTIR(n1, n2, cosI, sinT2);
  }

  const cosT = Math.sqrt(1 - sinT2);
  const thetaT = Math.asin(Math.min(1, sinT));

  const n1CosI = n1 * cosI;
  const n1CosT = n1 * cosT;
  const n2CosI = n2 * cosI;
  const n2CosT = n2 * cosT;

  // s-polarization (TE)
  const rsDenom = n1CosI + n2CosT;
  const rsVal = Math.abs(rsDenom) < 1e-15 ? 0 : (n1CosI - n2CosT) / rsDenom;
  const tsVal = Math.abs(rsDenom) < 1e-15 ? 1 : (2 * n1CosI) / rsDenom;

  // p-polarization (TM)
  const rpDenom = n2CosI + n1CosT;
  const rpVal = Math.abs(rpDenom) < 1e-15 ? 0 : (n2CosI - n1CosT) / rpDenom;
  const tpVal = Math.abs(rpDenom) < 1e-15 ? 1 : (2 * n1CosI) / rpDenom;

  return {
    rs: [rsVal, 0],
    rp: [rpVal, 0],
    ts: [tsVal, 0],
    tp: [tpVal, 0],
    thetaT,
    isTIR: false,
  };
}

/**
 * Compute Fresnel coefficients under TIR conditions.
 * Returns complex reflection coefficients with unit magnitude.
 */
function fresnelTIR(
  n1: number,
  n2: number,
  cosI: number,
  sinT2: number,
): FresnelAmplitudesComplex {
  const imagCosT = Math.sqrt(sinT2 - 1);

  const n1CosI = n1 * cosI;
  const n2CosI = n2 * cosI;
  const n2ImCosT = n2 * imagCosT;
  const n1ImCosT = n1 * imagCosT;

  // rs = (n1 cosI - i n2 imagCosT) / (n1 cosI + i n2 imagCosT)
  // Complex division: (a - ib) / (a + ib) where a = n1CosI, b = n2ImCosT
  const rsDenom = n1CosI * n1CosI + n2ImCosT * n2ImCosT;
  const rs_re = (n1CosI * n1CosI - n2ImCosT * n2ImCosT) / rsDenom;
  const rs_im = (-2 * n1CosI * n2ImCosT) / rsDenom;

  // rp = (n2 cosI - i n1 imagCosT) / (n2 cosI + i n1 imagCosT)
  const rpDenom = n2CosI * n2CosI + n1ImCosT * n1ImCosT;
  const rp_re = (n2CosI * n2CosI - n1ImCosT * n1ImCosT) / rpDenom;
  const rp_im = (-2 * n2CosI * n1ImCosT) / rpDenom;

  return {
    rs: [rs_re, rs_im],
    rp: [rp_re, rp_im],
    ts: [0, 0],
    tp: [0, 0],
    thetaT: NaN,
    isTIR: true,
  };
}

// ========== Mueller Matrices for Fresnel ==========

/**
 * Mueller matrix for Fresnel reflection at a dielectric interface.
 *
 * For real (non-TIR) case:
 *   M_reflect = (1/2) ×
 *   [rs²+rp²,  rs²-rp²,  0,         0        ]
 *   [rs²-rp²,  rs²+rp²,  0,         0        ]
 *   [0,        0,         2·rs·rp,   0        ]
 *   [0,        0,         0,         2·rs·rp  ]
 *
 * For TIR (complex amplitudes):
 *   M_reflect = (1/2) ×
 *   [|rs|²+|rp|²,  |rs|²-|rp|²,  0,                           0                          ]
 *   [|rs|²-|rp|²,  |rs|²+|rp|²,  0,                           0                          ]
 *   [0,            0,             2·Re(rs·rp*),                2·Im(rs·rp*)               ]
 *   [0,            0,            -2·Im(rs·rp*),                2·Re(rs·rp*)               ]
 *
 * @param n1 Refractive index of incident medium
 * @param n2 Refractive index of transmitted medium
 * @param thetaI Angle of incidence in radians
 */
export function fresnelMuellerReflect(
  n1: number,
  n2: number,
  thetaI: number,
): MuellerMatrix {
  const coeffs = fresnelAmplitudes(n1, n2, thetaI);

  // |rs|² and |rp|²
  const Rs = coeffs.rs[0] * coeffs.rs[0] + coeffs.rs[1] * coeffs.rs[1];
  const Rp = coeffs.rp[0] * coeffs.rp[0] + coeffs.rp[1] * coeffs.rp[1];

  // rs × rp* (complex multiplication with conjugate of rp)
  const cross_re = coeffs.rs[0] * coeffs.rp[0] + coeffs.rs[1] * coeffs.rp[1];
  const cross_im = coeffs.rs[1] * coeffs.rp[0] - coeffs.rs[0] * coeffs.rp[1];

  return new Float64Array([
    0.5 * (Rs + Rp),   0.5 * (Rs - Rp),   0,               0,
    0.5 * (Rs - Rp),   0.5 * (Rs + Rp),   0,               0,
    0,                  0,                  cross_re,        cross_im,
    0,                  0,                 -cross_im,        cross_re,
  ]);
}

/**
 * Mueller matrix for Fresnel transmission at a dielectric interface.
 *
 * The transmission Mueller matrix includes the beam cross-section correction
 * factor η = (n2 cos θT) / (n1 cos θI).
 *
 * @param n1 Refractive index of incident medium
 * @param n2 Refractive index of transmitted medium
 * @param thetaI Angle of incidence in radians
 * @returns Mueller matrix, or null if TIR (no transmission)
 */
export function fresnelMuellerTransmit(
  n1: number,
  n2: number,
  thetaI: number,
): MuellerMatrix | null {
  const coeffs = fresnelAmplitudes(n1, n2, thetaI);

  if (coeffs.isTIR) return null;

  const cosI = Math.cos(thetaI);
  const cosT = Math.cos(coeffs.thetaT);

  // Beam cross-section correction
  const eta = (n2 * cosT) / (n1 * cosI);

  // ts and tp are real for non-TIR case
  const ts = coeffs.ts[0];
  const tp = coeffs.tp[0];

  const Ts = eta * ts * ts;
  const Tp = eta * tp * tp;
  const TsTp = eta * ts * tp;

  return new Float64Array([
    0.5 * (Ts + Tp),   0.5 * (Ts - Tp),   0,       0,
    0.5 * (Ts - Tp),   0.5 * (Ts + Tp),   0,       0,
    0,                  0,                  TsTp,    0,
    0,                  0,                  0,       TsTp,
  ]);
}

// ========== Derived Quantities ==========

/**
 * Brewster's angle for a given interface.
 * At Brewster's angle, p-polarized light has zero reflection.
 *
 * tan(θ_B) = n2 / n1
 *
 * @param n1 Refractive index of incident medium
 * @param n2 Refractive index of transmitted medium
 * @returns Brewster's angle in radians
 */
export function brewsterAngle(n1: number, n2: number): number {
  return Math.atan(n2 / n1);
}

/**
 * Critical angle for total internal reflection.
 * Returns NaN if n1 ≤ n2 (TIR not possible).
 *
 * sin(θ_c) = n2 / n1
 *
 * @param n1 Refractive index of incident medium
 * @param n2 Refractive index of transmitted medium
 * @returns Critical angle in radians, or NaN
 */
export function criticalAngle(n1: number, n2: number): number {
  if (n1 <= n2) return NaN;
  return Math.asin(n2 / n1);
}

/**
 * Power reflectance for s-polarization: Rs = |rs|²
 */
export function reflectanceS(n1: number, n2: number, thetaI: number): number {
  const c = fresnelAmplitudes(n1, n2, thetaI);
  return c.rs[0] * c.rs[0] + c.rs[1] * c.rs[1];
}

/**
 * Power reflectance for p-polarization: Rp = |rp|²
 */
export function reflectanceP(n1: number, n2: number, thetaI: number): number {
  const c = fresnelAmplitudes(n1, n2, thetaI);
  return c.rp[0] * c.rp[0] + c.rp[1] * c.rp[1];
}

/**
 * Average reflectance for unpolarized light: R = (Rs + Rp) / 2
 */
export function reflectanceAvg(n1: number, n2: number, thetaI: number): number {
  return (reflectanceS(n1, n2, thetaI) + reflectanceP(n1, n2, thetaI)) / 2;
}

// ========== Common Materials ==========

/** Refractive indices at ~550nm (visible light) */
export const REFRACTIVE_INDICES = {
  vacuum: 1.0,
  air: 1.00029,
  water: 1.333,
  glass: 1.5,
  bk7: 1.5168,
  diamond: 2.417,
  sapphire: 1.77,
  calciteO: 1.6584,
  calciteE: 1.4864,
  quartz: 1.544,
  ice: 1.31,
  acrylic: 1.49,
  polycarbonate: 1.586,
} as const;
