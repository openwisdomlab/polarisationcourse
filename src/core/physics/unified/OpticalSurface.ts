/**
 * Optical Surface Classes (光学表面类)
 *
 * Defines optical elements that interact with light rays.
 * Each surface transforms the coherency matrix according to its physical properties.
 *
 * Categories:
 * - Polarizers: Selectively transmit based on polarization
 * - Wave plates: Introduce phase retardation
 * - Dielectric surfaces: Fresnel reflection/transmission
 * - Mirrors: Reflect light
 * - Rotators: Rotate polarization without loss
 */

import { Complex } from '../../math/Complex';
import { Matrix2x2 } from '../../math/Matrix2x2';
import { Vector3 } from '../../math/Vector3';
import { CoherencyMatrix } from './CoherencyMatrix';
import { PolarizationBasis, incidenceAngle } from './PolarizationBasis';
import { solveFresnel, REFRACTIVE_INDICES } from './FresnelSolver';

// Numerical tolerances
const INTENSITY_EPSILON = 1e-10;

/**
 * Result of surface interaction
 */
export interface SurfaceInteractionResult {
  /** Transmitted light (through the element) */
  transmitted?: {
    matrix: CoherencyMatrix;
    basis: PolarizationBasis;
    direction: Vector3;
  };

  /** Reflected light (bounced back) */
  reflected?: {
    matrix: CoherencyMatrix;
    basis: PolarizationBasis;
    direction: Vector3;
  };

  /** Whether any light was produced */
  hasOutput: boolean;
}

/**
 * Abstract base class for all optical surfaces
 */
export abstract class OpticalSurface {
  /** Unique identifier for this surface */
  readonly id: string;

  /** Position in world space */
  position: Vector3;

  /** Surface normal (for orientation) */
  normal: Vector3;

  constructor(id: string, position: Vector3, normal: Vector3) {
    this.id = id;
    this.position = position;
    this.normal = normal.normalize();
  }

  /**
   * Interact with incoming light
   *
   * @param input Incoming coherency matrix
   * @param basis Incoming polarization basis
   * @returns Transmitted and/or reflected light
   */
  abstract interact(
    input: CoherencyMatrix,
    basis: PolarizationBasis
  ): SurfaceInteractionResult;
}

// ========== Ideal Polarizer ==========

/**
 * Ideal linear polarizer
 * Transmits only the component along the transmission axis
 */
export class IdealPolarizer extends OpticalSurface {
  /** Transmission axis direction in 3D space */
  transmissionAxis: Vector3;

  constructor(
    id: string,
    position: Vector3,
    normal: Vector3,
    transmissionAxis: Vector3
  ) {
    super(id, position, normal);
    // Ensure transmission axis is perpendicular to normal and normalized
    this.transmissionAxis = transmissionAxis.perpendicular(normal).normalize();
  }

  /**
   * Get the angle of transmission axis relative to the s-direction of the basis
   */
  private getAxisAngle(basis: PolarizationBasis): number {
    // Project transmission axis onto polarization plane (perpendicular to k)
    const projAxis = this.transmissionAxis.perpendicular(basis.k).normalize();
    if (projAxis.isZero()) {
      return 0;
    }

    // Angle from s to projected axis
    return Math.atan2(projAxis.dot(basis.p), projAxis.dot(basis.s));
  }

  interact(
    input: CoherencyMatrix,
    basis: PolarizationBasis
  ): SurfaceInteractionResult {
    const theta = this.getAxisAngle(basis);
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    // Jones matrix for linear polarizer at angle θ:
    // P(θ) = [c²  cs]
    //        [cs  s²]
    const jonesMatrix = new Matrix2x2(
      new Complex(c * c), new Complex(c * s),
      new Complex(c * s), new Complex(s * s)
    );

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

// ========== Wave Plate ==========

/**
 * Wave plate (retarder)
 * Introduces phase difference between fast and slow axis components
 */
export class WavePlate extends OpticalSurface {
  /** Fast axis direction in 3D space */
  fastAxis: Vector3;

  /** Phase retardance in radians (π/2 for QWP, π for HWP) */
  retardance: number;

  constructor(
    id: string,
    position: Vector3,
    normal: Vector3,
    fastAxis: Vector3,
    retardance: number
  ) {
    super(id, position, normal);
    this.fastAxis = fastAxis.perpendicular(normal).normalize();
    this.retardance = retardance;
  }

  /**
   * Create quarter-wave plate (λ/4)
   */
  static quarterWave(
    id: string,
    position: Vector3,
    normal: Vector3,
    fastAxis: Vector3
  ): WavePlate {
    return new WavePlate(id, position, normal, fastAxis, Math.PI / 2);
  }

  /**
   * Create half-wave plate (λ/2)
   */
  static halfWave(
    id: string,
    position: Vector3,
    normal: Vector3,
    fastAxis: Vector3
  ): WavePlate {
    return new WavePlate(id, position, normal, fastAxis, Math.PI);
  }

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
    const delta = this.retardance;

    // Wave plate Jones matrix in fast-axis frame:
    // W = [1        0      ]
    //     [0   e^(iδ)]
    //
    // In lab frame:
    // W(θ) = R(-θ) × W × R(θ)

    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const c2 = c * c;
    const s2 = s * s;
    const cs = c * s;

    // Phase factor for slow axis
    const eid = Complex.exp(delta);
    const eidm1 = eid.sub(Complex.ONE);

    // Elements of rotated wave plate matrix
    const a00 = new Complex(c2).add(eid.scale(s2));
    const a01 = new Complex(cs).mul(eidm1);
    const a10 = a01.clone(); // symmetric for wave plate
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

// ========== Dielectric Surface ==========

/**
 * Dielectric interface (e.g., glass/air boundary)
 * Uses Fresnel equations for reflection and transmission
 */
export class DielectricSurface extends OpticalSurface {
  /** Refractive index on incident side */
  n1: number;

  /** Refractive index on transmitted side */
  n2: number;

  constructor(
    id: string,
    position: Vector3,
    normal: Vector3,
    n1: number = REFRACTIVE_INDICES.air,
    n2: number = REFRACTIVE_INDICES.glass
  ) {
    super(id, position, normal);
    this.n1 = n1;
    this.n2 = n2;
  }

  interact(
    input: CoherencyMatrix,
    basis: PolarizationBasis
  ): SurfaceInteractionResult {
    // Compute incidence angle
    const theta = incidenceAngle(basis.k, this.normal);

    // Solve Fresnel equations
    const fresnel = solveFresnel(this.n1, this.n2, theta);

    const result: SurfaceInteractionResult = { hasOutput: false };

    // Apply Fresnel coefficients to coherency matrix
    // In s-p basis: J' = F × J × F†
    // where F = diag(rs/ts, rp/tp) for reflection/transmission

    // Reflected light
    if (fresnel.Rs > INTENSITY_EPSILON || fresnel.Rp > INTENSITY_EPSILON) {
      const reflectMatrix = new Matrix2x2(
        fresnel.rs, Complex.ZERO,
        Complex.ZERO, fresnel.rp
      );

      const reflectedJ = input.applyOperator(reflectMatrix);

      if (reflectedJ.isAboveThreshold()) {
        const reflectedBasis = basis.computeReflectedBasis(this.normal);
        result.reflected = {
          matrix: reflectedJ,
          basis: reflectedBasis,
          direction: reflectedBasis.k
        };
        result.hasOutput = true;
      }
    }

    // Transmitted light (unless TIR)
    if (!fresnel.isTIR) {
      const transmitMatrix = new Matrix2x2(
        fresnel.ts, Complex.ZERO,
        Complex.ZERO, fresnel.tp
      );

      // Note: The amplitude coefficients need to be scaled by
      // √(n2 cosT / n1 cosI) for energy conservation, but this is already
      // accounted for in the power transmittance Ts, Tp

      const transmittedJ = input.applyOperator(transmitMatrix);

      if (transmittedJ.isAboveThreshold()) {
        const refractedBasis = basis.computeRefractedBasis(
          this.normal,
          this.n1,
          this.n2
        );

        if (refractedBasis) {
          result.transmitted = {
            matrix: transmittedJ,
            basis: refractedBasis,
            direction: refractedBasis.k
          };
          result.hasOutput = true;
        }
      }
    }

    return result;
  }
}

// ========== Mirror ==========

/**
 * Ideal mirror (perfect reflector)
 */
export class IdealMirror extends OpticalSurface {
  /** Phase shift on reflection (default: π for metallic mirror) */
  phaseShift: number;

  constructor(
    id: string,
    position: Vector3,
    normal: Vector3,
    phaseShift: number = Math.PI
  ) {
    super(id, position, normal);
    this.phaseShift = phaseShift;
  }

  interact(
    input: CoherencyMatrix,
    basis: PolarizationBasis
  ): SurfaceInteractionResult {
    // Mirror reflection: r = 1 for both polarizations
    // with possible phase shift

    const phaseS = Complex.exp(this.phaseShift);
    const phaseP = Complex.exp(this.phaseShift);

    const mirrorMatrix = new Matrix2x2(
      phaseS, Complex.ZERO,
      Complex.ZERO, phaseP
    );

    const reflectedJ = input.applyOperator(mirrorMatrix);
    const reflectedBasis = basis.computeReflectedBasis(this.normal);

    return {
      reflected: {
        matrix: reflectedJ,
        basis: reflectedBasis,
        direction: reflectedBasis.k
      },
      hasOutput: true
    };
  }
}

// ========== Optical Rotator ==========

/**
 * Optical rotator (e.g., Faraday rotator, optically active material)
 * Rotates polarization without introducing ellipticity
 */
export class OpticalRotator extends OpticalSurface {
  /** Rotation angle in radians (positive = counterclockwise looking against k) */
  rotationAngle: number;

  constructor(
    id: string,
    position: Vector3,
    normal: Vector3,
    rotationAngle: number
  ) {
    super(id, position, normal);
    this.rotationAngle = rotationAngle;
  }

  interact(
    input: CoherencyMatrix,
    basis: PolarizationBasis
  ): SurfaceInteractionResult {
    // Rotation matrix
    const c = Math.cos(this.rotationAngle);
    const s = Math.sin(this.rotationAngle);

    const rotMatrix = new Matrix2x2(
      new Complex(c), new Complex(-s),
      new Complex(s), new Complex(c)
    );

    const output = input.applyOperator(rotMatrix);

    // Also rotate the basis to maintain consistent reference
    const rotatedBasis = basis.rotate(this.rotationAngle);

    return {
      transmitted: {
        matrix: output,
        basis: rotatedBasis,
        direction: basis.k
      },
      hasOutput: true
    };
  }
}

// ========== Polarizing Beam Splitter ==========

/**
 * Polarizing beam splitter (PBS)
 * Transmits p-polarization, reflects s-polarization
 */
export class PolarizingBeamSplitter extends OpticalSurface {
  /** Splitting ratio (1.0 = perfect PBS) */
  efficiency: number;

  constructor(
    id: string,
    position: Vector3,
    normal: Vector3,
    efficiency: number = 1.0
  ) {
    super(id, position, normal);
    this.efficiency = Math.max(0, Math.min(1, efficiency));
  }

  interact(
    input: CoherencyMatrix,
    basis: PolarizationBasis
  ): SurfaceInteractionResult {
    const result: SurfaceInteractionResult = { hasOutput: false };

    const e = this.efficiency;
    const leak = 1 - e;

    // Transmitted: mostly p-polarization
    // Jones matrix: diag(√leak, √e)
    const transmitMatrix = new Matrix2x2(
      new Complex(Math.sqrt(leak)), Complex.ZERO,
      Complex.ZERO, new Complex(Math.sqrt(e))
    );

    const transmittedJ = input.applyOperator(transmitMatrix);
    if (transmittedJ.isAboveThreshold()) {
      result.transmitted = {
        matrix: transmittedJ,
        basis: basis.clone(),
        direction: basis.k
      };
      result.hasOutput = true;
    }

    // Reflected: mostly s-polarization
    // Jones matrix: diag(√e, √leak)
    const reflectMatrix = new Matrix2x2(
      new Complex(Math.sqrt(e)), Complex.ZERO,
      Complex.ZERO, new Complex(Math.sqrt(leak))
    );

    const reflectedJ = input.applyOperator(reflectMatrix);
    if (reflectedJ.isAboveThreshold()) {
      const reflectedBasis = basis.computeReflectedBasis(this.normal);
      result.reflected = {
        matrix: reflectedJ,
        basis: reflectedBasis,
        direction: reflectedBasis.k
      };
      result.hasOutput = true;
    }

    return result;
  }
}

// ========== Attenuator ==========

/**
 * Neutral density filter / attenuator
 * Reduces intensity uniformly for all polarizations
 */
export class Attenuator extends OpticalSurface {
  /** Transmission factor (0 to 1) */
  transmission: number;

  constructor(
    id: string,
    position: Vector3,
    normal: Vector3,
    transmission: number
  ) {
    super(id, position, normal);
    this.transmission = Math.max(0, Math.min(1, transmission));
  }

  interact(
    input: CoherencyMatrix,
    basis: PolarizationBasis
  ): SurfaceInteractionResult {
    // Scale intensity by transmission factor
    // Amplitude scales by √T
    const ampFactor = Math.sqrt(this.transmission);

    const attMatrix = Matrix2x2.scaledIdentity(new Complex(ampFactor));
    const output = input.applyOperator(attMatrix);

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

// ========== Depolarizer ==========

/**
 * Depolarizing element
 * Converts polarized light to (partially) unpolarized
 */
export class Depolarizer extends OpticalSurface {
  /** Depolarization factor (0 = no effect, 1 = fully unpolarized output) */
  factor: number;

  constructor(
    id: string,
    position: Vector3,
    normal: Vector3,
    factor: number = 1.0
  ) {
    super(id, position, normal);
    this.factor = Math.max(0, Math.min(1, factor));
  }

  interact(
    input: CoherencyMatrix,
    basis: PolarizationBasis
  ): SurfaceInteractionResult {
    const output = input.depolarize(this.factor);

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
