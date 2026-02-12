/**
 * Unified Polarization State (统一偏振态描述)
 *
 * The single canonical type for describing polarized light state in PolarCraft.
 * Bridges the gap between:
 *   - Jones Calculus: Complex electric-field amplitudes (Ex, Ey) — carries phase info
 *   - Stokes Parameters: Real-valued intensity statistics [S0, S1, S2, S3] — handles partial polarization
 *   - CoherencyMatrix: The internal 2×2 Hermitian matrix — the computational workhorse
 *
 * This module provides:
 * 1. A `PolarizationState` interface that unifies all three representations
 * 2. Factory functions to construct states from any representation
 * 3. Converters between representations (Jones ↔ Stokes ↔ CoherencyMatrix)
 * 4. Physical validation (DoP bounds, intensity positivity, Hermiticity)
 *
 * Design principle: CoherencyMatrix is the ground truth. Jones and Stokes
 * are derived views, computed on access and cached for performance.
 */

import { Complex } from '../../math/Complex';
import { CoherencyMatrix } from './CoherencyMatrix';

// ========== Core Types ==========

/**
 * Jones vector representation: [Ex, Ey] complex amplitudes.
 * Only valid for fully polarized light (DoP = 1).
 * For partially polarized light, this represents the polarized component only.
 */
export interface JonesRepresentation {
  /** Complex amplitude in x (horizontal) direction */
  ex: Complex;
  /** Complex amplitude in y (vertical) direction */
  ey: Complex;
}

/**
 * Stokes vector representation: [S0, S1, S2, S3].
 * Valid for any degree of polarization (0 ≤ DoP ≤ 1).
 *
 * S0 = total intensity
 * S1 = preference for horizontal (>0) vs vertical (<0)
 * S2 = preference for +45° (>0) vs -45° (<0)
 * S3 = preference for right-circular (>0) vs left-circular (<0)
 */
export interface StokesRepresentation {
  s0: number;
  s1: number;
  s2: number;
  s3: number;
}

/**
 * Polarization ellipse parameters — the geometric description of the
 * polarization state on the Poincaré sphere.
 */
export interface EllipseParameters {
  /** Orientation angle of the major axis, degrees [0, 180) */
  orientationDeg: number;
  /** Ellipticity angle, degrees (-45 to +45), positive = right-handed */
  ellipticityDeg: number;
  /** Azimuth on Poincaré sphere: 2ψ in radians */
  azimuth: number;
  /** Elevation on Poincaré sphere: 2χ in radians */
  elevation: number;
}

/**
 * Material context — optional metadata about what produced this state.
 * Used by the PhysicsInterpreter to generate richer semantic descriptions.
 */
export interface MaterialContext {
  /** Material name (e.g., "calcite", "BK7 glass") */
  material?: string;
  /** Thickness in micrometers */
  thicknessUm?: number;
  /** Birefringence Δn */
  birefringence?: number;
  /** Wavelength in nanometers */
  wavelengthNm?: number;
}

// ========== Unified Polarization State ==========

/**
 * The unified polarization state — the single source of truth for any
 * polarized light state in the system.
 *
 * Immutable: all properties are readonly. Create new states via factory functions.
 */
export class PolarizationState {
  /** The internal coherency matrix (ground truth) */
  private readonly _coherency: CoherencyMatrix;

  /** Optional material context for semantic enrichment */
  readonly materialContext?: MaterialContext;

  // Cached derived values (computed lazily)
  private _stokes?: StokesRepresentation;
  private _jones?: JonesRepresentation | null; // null = not extractable (partially polarized)
  private _ellipse?: EllipseParameters;

  private constructor(coherency: CoherencyMatrix, material?: MaterialContext) {
    this._coherency = coherency;
    this.materialContext = material;
  }

  // ========== Factory Methods ==========

  /**
   * Create from a CoherencyMatrix (the most general form).
   */
  static fromCoherency(matrix: CoherencyMatrix, material?: MaterialContext): PolarizationState {
    return new PolarizationState(matrix, material);
  }

  /**
   * Create from Jones vector [Ex, Ey] — fully polarized light only.
   */
  static fromJones(ex: Complex, ey: Complex, material?: MaterialContext): PolarizationState {
    const coherency = CoherencyMatrix.fromJones(ex, ey);
    return new PolarizationState(coherency, material);
  }

  /**
   * Create from Stokes parameters [S0, S1, S2, S3].
   */
  static fromStokes(
    s0: number, s1: number, s2: number, s3: number,
    material?: MaterialContext
  ): PolarizationState {
    const coherency = CoherencyMatrix.fromStokes(s0, s1, s2, s3);
    return new PolarizationState(coherency, material);
  }

  /**
   * Create linearly polarized light.
   * @param intensity Total intensity
   * @param angleDeg Polarization angle in degrees (0 = horizontal)
   */
  static createLinear(intensity: number, angleDeg: number, material?: MaterialContext): PolarizationState {
    const angleRad = angleDeg * Math.PI / 180;
    const coherency = CoherencyMatrix.createLinear(intensity, angleRad);
    return new PolarizationState(coherency, material);
  }

  /**
   * Create circularly polarized light.
   * @param intensity Total intensity
   * @param rightHanded True for RCP, false for LCP
   */
  static createCircular(intensity: number, rightHanded: boolean, material?: MaterialContext): PolarizationState {
    const coherency = CoherencyMatrix.createCircular(intensity, rightHanded);
    return new PolarizationState(coherency, material);
  }

  /**
   * Create unpolarized (natural) light.
   */
  static createUnpolarized(intensity: number, material?: MaterialContext): PolarizationState {
    const coherency = CoherencyMatrix.createUnpolarized(intensity);
    return new PolarizationState(coherency, material);
  }

  /**
   * Create partially polarized light.
   * @param intensity Total intensity
   * @param dop Degree of polarization [0, 1]
   * @param angleDeg Angle of polarized component in degrees
   */
  static createPartiallyPolarized(
    intensity: number, dop: number, angleDeg: number,
    material?: MaterialContext
  ): PolarizationState {
    const angleRad = angleDeg * Math.PI / 180;
    const coherency = CoherencyMatrix.createPartiallyPolarized(intensity, dop, angleRad);
    return new PolarizationState(coherency, material);
  }

  /** Zero intensity (vacuum / no light) */
  static readonly ZERO = new PolarizationState(CoherencyMatrix.ZERO);

  // ========== Representation Accessors ==========

  /** Get the underlying CoherencyMatrix (always available, always exact) */
  get coherency(): CoherencyMatrix {
    return this._coherency;
  }

  /** Get Stokes parameters [S0, S1, S2, S3] (always available) */
  get stokes(): StokesRepresentation {
    if (!this._stokes) {
      const [s0, s1, s2, s3] = this._coherency.toStokes();
      this._stokes = { s0, s1, s2, s3 };
    }
    return this._stokes;
  }

  /**
   * Get Jones vector — only meaningful for fully polarized light.
   * Returns null if DoP < 0.95 (partially polarized states cannot be
   * represented by a single Jones vector).
   */
  get jones(): JonesRepresentation | null {
    if (this._jones === undefined) {
      if (this.dop < 0.95) {
        this._jones = null;
      } else {
        // Extract Jones vector from the polarized component
        // For J = |E><E|, E is the eigenvector with the larger eigenvalue
        const angle = this._coherency.orientationAngle;
        const ellipticity = this._coherency.ellipticityAngle;
        const amplitude = Math.sqrt(this.intensity);

        const cosO = Math.cos(angle);
        const sinO = Math.sin(angle);
        const cosE = Math.cos(ellipticity);
        const sinE = Math.sin(ellipticity);

        this._jones = {
          ex: new Complex(amplitude * cosO * cosE, amplitude * sinO * sinE),
          ey: new Complex(amplitude * sinO * cosE, -amplitude * cosO * sinE),
        };
      }
    }
    return this._jones;
  }

  /** Get polarization ellipse parameters (always available for polarized component) */
  get ellipse(): EllipseParameters {
    if (!this._ellipse) {
      const orientationRad = this._coherency.orientationAngle;
      const ellipticityRad = this._coherency.ellipticityAngle;

      this._ellipse = {
        orientationDeg: normalizeAngle(orientationRad * 180 / Math.PI),
        ellipticityDeg: ellipticityRad * 180 / Math.PI,
        azimuth: 2 * orientationRad,
        elevation: 2 * ellipticityRad,
      };
    }
    return this._ellipse;
  }

  // ========== Physical Properties ==========

  /** Total intensity (S0 = Tr(J)) */
  get intensity(): number {
    return this._coherency.intensity;
  }

  /** Degree of polarization [0, 1] */
  get dop(): number {
    return this._coherency.degreeOfPolarization;
  }

  /** Whether the light is fully polarized (DoP ≥ 0.95) */
  get isFullyPolarized(): boolean {
    return this.dop >= 0.95;
  }

  /** Whether the light is essentially unpolarized (DoP ≤ 0.05) */
  get isUnpolarized(): boolean {
    return this.dop <= 0.05;
  }

  /** Whether the light is partially polarized (0.05 < DoP < 0.95) */
  get isPartiallyPolarized(): boolean {
    return this.dop > 0.05 && this.dop < 0.95;
  }

  /** Whether the light is linearly polarized (S3/S0 ≈ 0 and DoP ≈ 1) */
  get isLinear(): boolean {
    return this._coherency.isLinear() && this.isFullyPolarized;
  }

  /** Whether the light is circularly polarized */
  get isCircular(): boolean {
    return this._coherency.isCircular() && this.isFullyPolarized;
  }

  /** Whether any light exists (intensity > threshold) */
  get exists(): boolean {
    return this._coherency.isAboveThreshold();
  }

  // ========== Validation ==========

  /**
   * Validate physical consistency of this state.
   * Returns an array of violation messages (empty = valid).
   */
  validate(): string[] {
    const violations: string[] = [];

    if (this.intensity < -1e-10) {
      violations.push(`Negative intensity: ${this.intensity}`);
    }

    if (this.dop < -1e-10 || this.dop > 1 + 1e-10) {
      violations.push(`DoP out of range [0, 1]: ${this.dop}`);
    }

    const { s0, s1, s2, s3 } = this.stokes;
    const polarizedIntensity = Math.sqrt(s1 * s1 + s2 * s2 + s3 * s3);
    if (polarizedIntensity > s0 + 1e-8) {
      violations.push(
        `Stokes constraint violated: √(S1²+S2²+S3²)=${polarizedIntensity.toFixed(6)} > S0=${s0.toFixed(6)}`
      );
    }

    if (!this._coherency.isPhysical()) {
      violations.push('Coherency matrix is not positive semi-definite');
    }

    return violations;
  }

  /** Whether this state is physically valid */
  get isPhysical(): boolean {
    return this.validate().length === 0;
  }

  // ========== Serialization ==========

  /**
   * Serialize to a JSON-compatible object suitable for LLM consumption.
   * This is the format used by `useWorldModelContext()`.
   */
  toJSON(): PolarizationStateJSON {
    const s = this.stokes;
    const e = this.ellipse;
    const j = this.jones;

    return {
      intensity: roundTo(this.intensity, 6),
      dop: roundTo(this.dop, 4),
      stokes: [roundTo(s.s0, 6), roundTo(s.s1, 6), roundTo(s.s2, 6), roundTo(s.s3, 6)],
      ellipse: {
        orientationDeg: roundTo(e.orientationDeg, 2),
        ellipticityDeg: roundTo(e.ellipticityDeg, 2),
      },
      jones: j ? {
        ex: { re: roundTo(j.ex.real, 6), im: roundTo(j.ex.imag, 6) },
        ey: { re: roundTo(j.ey.real, 6), im: roundTo(j.ey.imag, 6) },
      } : null,
      flags: {
        isFullyPolarized: this.isFullyPolarized,
        isUnpolarized: this.isUnpolarized,
        isLinear: this.isLinear,
        isCircular: this.isCircular,
      },
      material: this.materialContext ?? null,
    };
  }

  /**
   * Deserialize from JSON.
   */
  static fromJSON(data: PolarizationStateJSON): PolarizationState {
    const [s0, s1, s2, s3] = data.stokes;
    return PolarizationState.fromStokes(
      s0, s1, s2, s3,
      data.material ?? undefined
    );
  }

  /**
   * Human-readable string representation for debugging.
   */
  toString(): string {
    const s = this.stokes;
    return `PolarizationState(I=${this.intensity.toFixed(4)}, ` +
           `DoP=${this.dop.toFixed(3)}, ` +
           `ψ=${this.ellipse.orientationDeg.toFixed(1)}°, ` +
           `χ=${this.ellipse.ellipticityDeg.toFixed(1)}°, ` +
           `S=[${s.s0.toFixed(3)}, ${s.s1.toFixed(3)}, ${s.s2.toFixed(3)}, ${s.s3.toFixed(3)}])`;
  }
}

// ========== JSON Schema ==========

/**
 * JSON-serializable format for PolarizationState.
 * Designed to be self-describing for LLM consumption.
 */
export interface PolarizationStateJSON {
  /** Total intensity */
  intensity: number;
  /** Degree of polarization [0, 1] */
  dop: number;
  /** Stokes parameters [S0, S1, S2, S3] */
  stokes: [number, number, number, number];
  /** Polarization ellipse */
  ellipse: {
    orientationDeg: number;
    ellipticityDeg: number;
  };
  /** Jones vector (null if DoP < 0.95) */
  jones: {
    ex: { re: number; im: number };
    ey: { re: number; im: number };
  } | null;
  /** Quick boolean flags */
  flags: {
    isFullyPolarized: boolean;
    isUnpolarized: boolean;
    isLinear: boolean;
    isCircular: boolean;
  };
  /** Material context */
  material: MaterialContext | null;
}

// ========== Conversion Utilities ==========

/**
 * Convert a Stokes vector to Jones vector (only valid for DoP ≈ 1).
 * Returns null if the state is partially polarized.
 *
 * Algorithm: Extract orientation ψ and ellipticity χ from Stokes,
 * then construct J = √I × [cos(ψ)cos(χ) + i sin(ψ)sin(χ),
 *                           sin(ψ)cos(χ) - i cos(ψ)sin(χ)]
 */
export function stokesToJones(s: StokesRepresentation): JonesRepresentation | null {
  const { s0, s1, s2, s3 } = s;

  if (s0 < 1e-10) {
    return { ex: Complex.ZERO, ey: Complex.ZERO };
  }

  // Compute DoP
  const polarizedI = Math.sqrt(s1 * s1 + s2 * s2 + s3 * s3);
  const dop = polarizedI / s0;

  if (dop < 0.95) {
    return null; // Cannot represent as single Jones vector
  }

  // Orientation angle ψ = atan2(S2, S1) / 2
  const psi = Math.atan2(s2, s1) / 2;

  // Ellipticity angle χ = asin(S3 / polarizedI) / 2
  const sin2chi = Math.max(-1, Math.min(1, s3 / polarizedI));
  const chi = Math.asin(sin2chi) / 2;

  const amplitude = Math.sqrt(s0);
  const cosP = Math.cos(psi);
  const sinP = Math.sin(psi);
  const cosC = Math.cos(chi);
  const sinC = Math.sin(chi);

  return {
    ex: new Complex(amplitude * cosP * cosC, amplitude * sinP * sinC),
    ey: new Complex(amplitude * sinP * cosC, -amplitude * cosP * sinC),
  };
}

/**
 * Convert a Jones vector to Stokes parameters.
 * Always valid (Jones → fully polarized Stokes).
 */
export function jonesToStokes(j: JonesRepresentation): StokesRepresentation {
  const exMagSq = j.ex.magnitudeSquared;
  const eyMagSq = j.ey.magnitudeSquared;

  // ⟨Ex Ey*⟩
  const cross = j.ex.mul(j.ey.conjugate());

  return {
    s0: exMagSq + eyMagSq,
    s1: exMagSq - eyMagSq,
    s2: 2 * cross.real,
    s3: 2 * cross.imag,
  };
}

/**
 * Validate energy conservation between input and output states.
 * For passive optical systems, output intensity ≤ input intensity.
 *
 * @returns Object with validation result and diagnostic info
 */
export function validateConservation(
  input: PolarizationState,
  output: PolarizationState,
  tolerance: number = 1e-4
): { valid: boolean; ratio: number; message: string } {
  const inI = input.intensity;
  const outI = output.intensity;

  if (inI < 1e-10) {
    return { valid: true, ratio: 0, message: 'Input below threshold.' };
  }

  const ratio = outI / inI;

  if (ratio > 1 + tolerance) {
    return {
      valid: false,
      ratio,
      message: `ENERGY CONSERVATION VIOLATION: output/input = ${ratio.toFixed(6)} > 1. ` +
               `This is physically impossible in passive optics.`,
    };
  }

  return {
    valid: true,
    ratio,
    message: `Transmittance: ${(ratio * 100).toFixed(2)}%.`,
  };
}

// ========== Helpers ==========

function normalizeAngle(deg: number): number {
  let a = deg % 180;
  if (a < 0) a += 180;
  return a;
}

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
