/**
 * Thin Film Polarization Module (薄膜偏振模块)
 *
 * Computes the Mueller matrix for a single dielectric thin film layer
 * on a substrate, accounting for multiple-beam interference.
 *
 * This covers basic AR/HR coating pedagogy. Multi-layer films are
 * deferred to the Surrogate Layer (ONNX inference).
 *
 * Physics:
 *   A single layer of thickness d, refractive index n_film, on a substrate
 *   of index n_sub, produces interference between reflections at the
 *   top and bottom interfaces. The total reflection depends on:
 *     - Phase thickness: δ = (2π/λ) × n_film × d × cos(θ_film)
 *     - Fresnel coefficients at air/film and film/substrate interfaces
 *
 * For each polarization component (s and p):
 *   r_total = (r12 + r23 × e^(-2iδ)) / (1 + r12 × r23 × e^(-2iδ))
 *   t_total = (t12 × t23 × e^(-iδ)) / (1 + r12 × r23 × e^(-2iδ))
 *
 * where:
 *   r12, t12 = Fresnel coefficients at interface 1→2 (ambient → film)
 *   r23, t23 = Fresnel coefficients at interface 2→3 (film → substrate)
 *   δ = single-pass phase thickness
 *
 * Convention:
 *   - All angles in RADIANS
 *   - Wavelength in NANOMETERS
 *   - Thickness in NANOMETERS
 *
 * Reference: Born & Wolf, "Principles of Optics", Chapter 7
 */

import type { MuellerMatrix } from './mueller';

// ========== Complex Arithmetic Helpers ==========

type C = [number, number]; // [real, imag]

function cAdd(a: C, b: C): C {
  return [a[0] + b[0], a[1] + b[1]];
}

function cMul(a: C, b: C): C {
  return [
    a[0] * b[0] - a[1] * b[1],
    a[0] * b[1] + a[1] * b[0],
  ];
}

function cDiv(a: C, b: C): C {
  const denom = b[0] * b[0] + b[1] * b[1];
  if (denom < 1e-30) return [0, 0];
  return [
    (a[0] * b[0] + a[1] * b[1]) / denom,
    (a[1] * b[0] - a[0] * b[1]) / denom,
  ];
}

function cExp(theta: number): C {
  return [Math.cos(theta), Math.sin(theta)];
}

function cMagSq(a: C): number {
  return a[0] * a[0] + a[1] * a[1];
}

function cConj(a: C): C {
  return [a[0], -a[1]];
}

// ========== Thin Film Fresnel Coefficients ==========

/**
 * Compute the Fresnel amplitude reflection coefficient (real, for dielectric non-TIR).
 */
function fresnelR_s(n1: number, cosI: number, n2: number, cosT: number): number {
  const num = n1 * cosI - n2 * cosT;
  const den = n1 * cosI + n2 * cosT;
  return Math.abs(den) < 1e-15 ? 0 : num / den;
}

function fresnelR_p(n1: number, cosI: number, n2: number, cosT: number): number {
  const num = n2 * cosI - n1 * cosT;
  const den = n2 * cosI + n1 * cosT;
  return Math.abs(den) < 1e-15 ? 0 : num / den;
}

function fresnelT_s(n1: number, cosI: number, n2: number, cosT: number): number {
  const den = n1 * cosI + n2 * cosT;
  return Math.abs(den) < 1e-15 ? 1 : (2 * n1 * cosI) / den;
}

function fresnelT_p(n1: number, cosI: number, n2: number, cosT: number): number {
  const den = n2 * cosI + n1 * cosT;
  return Math.abs(den) < 1e-15 ? 1 : (2 * n1 * cosI) / den;
}

// ========== Single-Layer Thin Film ==========

/**
 * Compute the Mueller matrix for a single-layer thin film coating.
 *
 * The film is sandwiched between medium 1 (ambient, typically air) and
 * medium 3 (substrate).
 *
 * @param nFilm Refractive index of the thin film layer
 * @param thickness Film thickness in nanometers
 * @param wavelength Light wavelength in nanometers
 * @param incidenceAngle Angle of incidence in radians
 * @param nAmbient Refractive index of ambient medium (default: 1.0 = air)
 * @param nSubstrate Refractive index of substrate (default: 1.5 = glass)
 * @returns Mueller matrix for the thin film system (reflection)
 */
export function thinFilmMuellerReflect(
  nFilm: number,
  thickness: number,
  wavelength: number,
  incidenceAngle: number,
  nAmbient: number = 1.0,
  nSubstrate: number = 1.5,
): MuellerMatrix {
  const n1 = nAmbient;
  const n2 = nFilm;
  const n3 = nSubstrate;

  const sinI = Math.sin(incidenceAngle);
  const cosI = Math.cos(incidenceAngle);

  // Snell's law at interface 1→2
  const sinT2 = (n1 / n2) * sinI;
  const sinT2Sq = sinT2 * sinT2;
  if (sinT2Sq > 1) {
    // TIR at the film interface — treat as total reflection
    return new Float64Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }
  const cosT2 = Math.sqrt(1 - sinT2Sq);

  // Snell's law at interface 2→3
  const sinT3 = (n2 / n3) * sinT2;
  const sinT3Sq = sinT3 * sinT3;
  const cosT3 = sinT3Sq > 1 ? 0 : Math.sqrt(1 - sinT3Sq);

  // Phase thickness: δ = (2π/λ) × n_film × d × cos(θ_film)
  const delta = (2 * Math.PI / wavelength) * n2 * thickness * cosT2;

  // Fresnel coefficients at each interface
  const r12s = fresnelR_s(n1, cosI, n2, cosT2);
  const r23s = fresnelR_s(n2, cosT2, n3, cosT3);

  const r12p = fresnelR_p(n1, cosI, n2, cosT2);
  const r23p = fresnelR_p(n2, cosT2, n3, cosT3);

  // Total reflection coefficient (Airy formula):
  // r_total = (r12 + r23 × e^(-2iδ)) / (1 + r12 × r23 × e^(-2iδ))
  const phase: C = cExp(-2 * delta);

  // s-polarization
  const numS: C = cAdd([r12s, 0], cMul([r23s, 0], phase));
  const denS: C = cAdd([1, 0], cMul([r12s * r23s, 0], phase));
  const rTotalS = cDiv(numS, denS);

  // p-polarization
  const numP: C = cAdd([r12p, 0], cMul([r23p, 0], phase));
  const denP: C = cAdd([1, 0], cMul([r12p * r23p, 0], phase));
  const rTotalP = cDiv(numP, denP);

  // Build Mueller matrix from complex reflection coefficients
  const Rs = cMagSq(rTotalS);
  const Rp = cMagSq(rTotalP);

  // Cross term: rs × rp*
  const cross = cMul(rTotalS, cConj(rTotalP));

  return new Float64Array([
    0.5 * (Rs + Rp),  0.5 * (Rs - Rp),  0,          0,
    0.5 * (Rs - Rp),  0.5 * (Rs + Rp),  0,          0,
    0,                 0,                 cross[0],   cross[1],
    0,                 0,                -cross[1],   cross[0],
  ]);
}

/**
 * Compute the Mueller matrix for transmission through a single-layer thin film.
 *
 * @param nFilm Refractive index of the thin film layer
 * @param thickness Film thickness in nanometers
 * @param wavelength Light wavelength in nanometers
 * @param incidenceAngle Angle of incidence in radians
 * @param nAmbient Refractive index of ambient medium (default: 1.0)
 * @param nSubstrate Refractive index of substrate (default: 1.5)
 * @returns Mueller matrix for the thin film system (transmission)
 */
export function thinFilmMuellerTransmit(
  nFilm: number,
  thickness: number,
  wavelength: number,
  incidenceAngle: number,
  nAmbient: number = 1.0,
  nSubstrate: number = 1.5,
): MuellerMatrix {
  const n1 = nAmbient;
  const n2 = nFilm;
  const n3 = nSubstrate;

  const sinI = Math.sin(incidenceAngle);
  const cosI = Math.cos(incidenceAngle);

  // Snell's law
  const sinT2 = (n1 / n2) * sinI;
  const sinT2Sq = sinT2 * sinT2;
  if (sinT2Sq > 1) {
    // TIR: no transmission
    return new Float64Array(16);
  }
  const cosT2 = Math.sqrt(1 - sinT2Sq);

  const sinT3 = (n2 / n3) * sinT2;
  const sinT3Sq = sinT3 * sinT3;
  if (sinT3Sq > 1) {
    // TIR at film/substrate interface
    return new Float64Array(16);
  }
  const cosT3 = Math.sqrt(1 - sinT3Sq);

  // Phase thickness
  const delta = (2 * Math.PI / wavelength) * n2 * thickness * cosT2;

  // Fresnel coefficients
  const r12s = fresnelR_s(n1, cosI, n2, cosT2);
  const r23s = fresnelR_s(n2, cosT2, n3, cosT3);
  const t12s = fresnelT_s(n1, cosI, n2, cosT2);
  const t23s = fresnelT_s(n2, cosT2, n3, cosT3);

  const r12p = fresnelR_p(n1, cosI, n2, cosT2);
  const r23p = fresnelR_p(n2, cosT2, n3, cosT3);
  const t12p = fresnelT_p(n1, cosI, n2, cosT2);
  const t23p = fresnelT_p(n2, cosT2, n3, cosT3);

  // Total transmission coefficient (Airy formula):
  // t_total = (t12 × t23 × e^(-iδ)) / (1 + r12 × r23 × e^(-2iδ))
  const phase1: C = cExp(-delta);
  const phase2: C = cExp(-2 * delta);

  // s-polarization
  const numTs: C = cMul([t12s * t23s, 0], phase1);
  const denTs: C = cAdd([1, 0], cMul([r12s * r23s, 0], phase2));
  const tTotalS = cDiv(numTs, denTs);

  // p-polarization
  const numTp: C = cMul([t12p * t23p, 0], phase1);
  const denTp: C = cAdd([1, 0], cMul([r12p * r23p, 0], phase2));
  const tTotalP = cDiv(numTp, denTp);

  // Beam cross-section correction factor
  const eta = (n3 * cosT3) / (n1 * cosI);

  const Ts = eta * cMagSq(tTotalS);
  const Tp = eta * cMagSq(tTotalP);

  // Cross term: ts × tp* (accounting for eta)
  const crossRaw = cMul(tTotalS, cConj(tTotalP));
  const crossFactor = eta;

  return new Float64Array([
    0.5 * (Ts + Tp),   0.5 * (Ts - Tp),   0,                              0,
    0.5 * (Ts - Tp),   0.5 * (Ts + Tp),   0,                              0,
    0,                  0,                  crossFactor * crossRaw[0],      crossFactor * crossRaw[1],
    0,                  0,                 -crossFactor * crossRaw[1],      crossFactor * crossRaw[0],
  ]);
}

// ========== Convenience Functions ==========

/**
 * Compute the single-pass phase thickness of a thin film.
 *
 * δ = (2π/λ) × n × d × cos(θ)
 *
 * @param nFilm Film refractive index
 * @param thickness Film thickness in nm
 * @param wavelength Light wavelength in nm
 * @param angleInFilm Angle of propagation inside the film in radians
 */
export function phaseThickness(
  nFilm: number,
  thickness: number,
  wavelength: number,
  angleInFilm: number,
): number {
  return (2 * Math.PI / wavelength) * nFilm * thickness * Math.cos(angleInFilm);
}

/**
 * Quarter-wave optical thickness at normal incidence.
 * Returns the physical thickness (in nm) needed for a λ/4 layer.
 *
 * d = λ / (4 × n_film)
 *
 * @param wavelength Design wavelength in nm
 * @param nFilm Film refractive index
 */
export function quarterWaveThickness(wavelength: number, nFilm: number): number {
  return wavelength / (4 * nFilm);
}

/**
 * Ideal AR coating: single-layer quarter-wave thickness at normal incidence.
 * Zero reflection when n_film = √(n1 × n3).
 *
 * @param wavelength Design wavelength in nm
 * @param nAmbient Ambient refractive index
 * @param nSubstrate Substrate refractive index
 * @returns { nFilm: ideal film index, thickness: in nm }
 */
export function idealARCoating(
  wavelength: number,
  nAmbient: number = 1.0,
  nSubstrate: number = 1.5,
): { nFilm: number; thickness: number } {
  const nFilm = Math.sqrt(nAmbient * nSubstrate);
  const thickness = quarterWaveThickness(wavelength, nFilm);
  return { nFilm, thickness };
}
