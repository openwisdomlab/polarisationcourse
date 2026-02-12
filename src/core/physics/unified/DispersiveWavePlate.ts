/**
 * Dispersive Wave Plate (色散波片)
 *
 * A physically-accurate wave plate whose retardation is computed dynamically
 * from material properties and wavelength, instead of being a fixed parameter.
 *
 * Physics:
 *   Phase retardation δ(λ) = 2π × d × Δn(λ) / λ
 *
 * where:
 *   d = plate thickness
 *   Δn(λ) = birefringence, optionally wavelength-dependent (dispersion)
 *   λ = wavelength of light
 *
 * This means a "quarter-wave plate for 550nm green" introduces:
 *   - δ(550nm) = π/2 (exactly λ/4 — by design)
 *   - δ(650nm) = 0.85 × π/2 (less than λ/4 — too thin for red)
 *   - δ(450nm) = 1.22 × π/2 (more than λ/4 — too thick for blue)
 *
 * This is the source of chromatic errors in real optical systems,
 * and the reason achromatic wave plates use composite designs.
 *
 * Gap being addressed:
 *   Previously, WavePlate had a fixed `retardance` parameter that ignored
 *   wavelength entirely. A QWP was always exactly π/2 regardless of color.
 *   This new class computes retardation from first principles.
 */

import { Complex } from '../../math/Complex';
import { Matrix2x2 } from '../../math/Matrix2x2';
import { Vector3 } from '../../math/Vector3';
import { CoherencyMatrix } from './CoherencyMatrix';
import { PolarizationBasis } from './PolarizationBasis';
import { OpticalSurface, type SurfaceInteractionResult } from './OpticalSurface';

// ========== Material Database ==========

/**
 * Physical properties of a birefringent material.
 */
export interface BirefringentMaterial {
  /** Material name for display */
  name: string;
  /** Birefringence Δn at reference wavelength (dimensionless) */
  birefringence: number;
  /** Reference wavelength in nm (where birefringence is measured) */
  referenceWavelengthNm: number;
  /** Cauchy coefficients for dispersion: Δn(λ) = A + B/λ² (optional) */
  cauchyA?: number;
  cauchyB?: number; // in nm²
}

/**
 * Common birefringent materials with their optical properties.
 */
export const BIREFRINGENT_MATERIALS: Record<string, BirefringentMaterial> = {
  quartz: {
    name: 'Crystalline Quartz',
    birefringence: 0.009,
    referenceWavelengthNm: 589, // Sodium D-line
    cauchyA: 0.00875,
    cauchyB: 450, // nm²
  },
  calcite: {
    name: 'Calcite (Iceland Spar)',
    birefringence: 0.172,
    referenceWavelengthNm: 589,
    cauchyA: 0.170,
    cauchyB: 660,
  },
  mica: {
    name: 'Muscovite Mica',
    birefringence: 0.036,
    referenceWavelengthNm: 589,
  },
  mgf2: {
    name: 'Magnesium Fluoride',
    birefringence: 0.012,
    referenceWavelengthNm: 589,
  },
  scotchTape: {
    name: 'Scotch Tape (Cellulose Acetate)',
    birefringence: 0.009,
    referenceWavelengthNm: 550,
  },
  polyethylene: {
    name: 'Stretched Polyethylene',
    birefringence: 0.003,
    referenceWavelengthNm: 550,
  },
};

// ========== Core Functions ==========

/**
 * Calculate wavelength-dependent birefringence using Cauchy dispersion.
 *
 * Δn(λ) = A + B/λ²
 *
 * If Cauchy coefficients are not provided, returns the constant birefringence.
 *
 * @param material Material properties
 * @param wavelengthNm Wavelength in nanometers
 * @returns Birefringence at the given wavelength
 */
export function birefringenceAtWavelength(
  material: BirefringentMaterial,
  wavelengthNm: number
): number {
  if (material.cauchyA !== undefined && material.cauchyB !== undefined) {
    return material.cauchyA + material.cauchyB / (wavelengthNm * wavelengthNm);
  }
  return material.birefringence;
}

/**
 * Calculate phase retardation from material properties and wavelength.
 *
 * δ(λ) = 2π × d × Δn(λ) / λ
 *
 * @param thicknessUm Plate thickness in micrometers
 * @param material Material properties
 * @param wavelengthNm Wavelength in nanometers
 * @returns Phase retardation in radians
 */
export function phaseRetardation(
  thicknessUm: number,
  material: BirefringentMaterial,
  wavelengthNm: number
): number {
  const thicknessNm = thicknessUm * 1000;
  const deltaN = birefringenceAtWavelength(material, wavelengthNm);
  return (2 * Math.PI * thicknessNm * deltaN) / wavelengthNm;
}

/**
 * Calculate the thickness needed for a specific retardation order.
 *
 * For a QWP (δ = π/2): d = λ / (4 × Δn)
 * For a HWP (δ = π):   d = λ / (2 × Δn)
 *
 * @param targetRetardation Target retardation in radians
 * @param material Material properties
 * @param wavelengthNm Design wavelength in nanometers
 * @returns Required thickness in micrometers
 */
export function requiredThickness(
  targetRetardation: number,
  material: BirefringentMaterial,
  wavelengthNm: number
): number {
  const deltaN = birefringenceAtWavelength(material, wavelengthNm);
  if (Math.abs(deltaN) < 1e-12) return Infinity;
  const thicknessNm = (targetRetardation * wavelengthNm) / (2 * Math.PI * deltaN);
  return thicknessNm / 1000; // Convert to μm
}

// ========== Dispersive Wave Plate Class ==========

/**
 * A wave plate whose retardation is computed from material physics.
 *
 * Unlike the base `WavePlate` which uses a fixed retardance parameter,
 * this class computes δ(λ) = 2π × d × Δn(λ) / λ from physical properties.
 *
 * Usage:
 * ```typescript
 * // Create a "quarter-wave plate for green light" from quartz
 * const qwp = DispersiveWavePlate.designQWP(
 *   'qwp1',
 *   position, normal, fastAxis,
 *   BIREFRINGENT_MATERIALS.quartz,
 *   550 // design wavelength
 * );
 *
 * // At 550nm: retardation ≈ π/2 (exact QWP)
 * // At 650nm: retardation ≈ 1.31 rad (not quite λ/4 for red)
 * ```
 */
export class DispersiveWavePlate extends OpticalSurface {
  /** Fast axis direction in 3D space */
  fastAxis: Vector3;

  /** Plate thickness in micrometers */
  readonly thicknessUm: number;

  /** Material properties */
  readonly material: BirefringentMaterial;

  /** Design wavelength in nm (where the target retardation is exact) */
  readonly designWavelengthNm: number;

  /** Operating wavelength in nm (current light) */
  private _wavelengthNm: number;

  constructor(
    id: string,
    position: Vector3,
    normal: Vector3,
    fastAxis: Vector3,
    thicknessUm: number,
    material: BirefringentMaterial,
    designWavelengthNm: number = 550,
  ) {
    super(id, position, normal);
    this.fastAxis = fastAxis.perpendicular(normal).normalize();
    this.thicknessUm = thicknessUm;
    this.material = material;
    this.designWavelengthNm = designWavelengthNm;
    this._wavelengthNm = designWavelengthNm;
  }

  /**
   * Set the operating wavelength (e.g., when tracing a specific color channel).
   */
  setWavelength(nm: number): void {
    this._wavelengthNm = nm;
  }

  /**
   * Get the phase retardation at the current operating wavelength.
   */
  get retardance(): number {
    return phaseRetardation(this.thicknessUm, this.material, this._wavelengthNm);
  }

  /**
   * Get the phase retardation at a specific wavelength.
   */
  retardanceAt(wavelengthNm: number): number {
    return phaseRetardation(this.thicknessUm, this.material, wavelengthNm);
  }

  /**
   * Get the retardation at the design wavelength (the "ideal" value).
   */
  get designRetardance(): number {
    return phaseRetardation(this.thicknessUm, this.material, this.designWavelengthNm);
  }

  // ========== Factory Methods ==========

  /**
   * Design a quarter-wave plate for a specific wavelength.
   */
  static designQWP(
    id: string,
    position: Vector3,
    normal: Vector3,
    fastAxis: Vector3,
    material: BirefringentMaterial,
    designWavelengthNm: number = 550,
  ): DispersiveWavePlate {
    const thickness = requiredThickness(Math.PI / 2, material, designWavelengthNm);
    return new DispersiveWavePlate(
      id, position, normal, fastAxis, thickness, material, designWavelengthNm
    );
  }

  /**
   * Design a half-wave plate for a specific wavelength.
   */
  static designHWP(
    id: string,
    position: Vector3,
    normal: Vector3,
    fastAxis: Vector3,
    material: BirefringentMaterial,
    designWavelengthNm: number = 550,
  ): DispersiveWavePlate {
    const thickness = requiredThickness(Math.PI, material, designWavelengthNm);
    return new DispersiveWavePlate(
      id, position, normal, fastAxis, thickness, material, designWavelengthNm
    );
  }

  // ========== Optical Interaction ==========

  private getFastAxisAngle(basis: PolarizationBasis): number {
    const projAxis = this.fastAxis.perpendicular(basis.k).normalize();
    if (projAxis.isZero()) return 0;
    return Math.atan2(projAxis.dot(basis.p), projAxis.dot(basis.s));
  }

  interact(
    input: CoherencyMatrix,
    basis: PolarizationBasis
  ): SurfaceInteractionResult {
    const theta = this.getFastAxisAngle(basis);
    const delta = this.retardance; // Wavelength-dependent!

    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const c2 = c * c;
    const s2 = s * s;
    const cs = c * s;

    // Phase factor for slow axis
    const eid = Complex.exp(delta);
    const eidm1 = eid.sub(Complex.ONE);

    // Rotated wave plate Jones matrix
    const a00 = new Complex(c2).add(eid.scale(s2));
    const a01 = new Complex(cs).mul(eidm1);
    const a10 = a01.clone();
    const a11 = new Complex(s2).add(eid.scale(c2));

    const jonesMatrix = new Matrix2x2(a00, a01, a10, a11);
    const output = input.applyOperator(jonesMatrix);

    if (!output.isAboveThreshold()) {
      return { hasOutput: false };
    }

    return {
      transmitted: {
        matrix: output,
        basis: basis.clone(),
        direction: basis.k
      },
      hasOutput: true
    };
  }
}
