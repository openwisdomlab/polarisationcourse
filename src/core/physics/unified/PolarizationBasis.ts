/**
 * Polarization Basis System (偏振基底系统)
 *
 * Handles the geometric representation of polarization in 3D space.
 * When light propagates or interacts with surfaces, the polarization state
 * must be expressed in a consistent local coordinate system.
 *
 * The s-p basis:
 * - ŝ (senkrecht/perpendicular): Perpendicular to plane of incidence
 * - p̂ (parallel): In the plane of incidence
 * - k̂ (propagation): Light ray direction
 *
 * These form a right-handed orthonormal system: ŝ × p̂ = k̂
 *
 * Critical: Handles singularities at normal incidence where k × n = 0
 */

import { Vector3, buildOrthonormalBasis, rotateAroundAxis, signedAngle } from '../../math/Vector3';
import { Complex } from '../../math/Complex';
import { Matrix2x2 } from '../../math/Matrix2x2';
import { CoherencyMatrix } from './CoherencyMatrix';

// Numerical tolerance for geometric calculations
const GEOMETRIC_EPSILON = 1e-8;

export class PolarizationBasis {
  /** S-polarization direction (perpendicular to plane of incidence) */
  readonly s: Vector3;

  /** P-polarization direction (parallel to plane of incidence) */
  readonly p: Vector3;

  /** Propagation direction */
  readonly k: Vector3;

  private constructor(s: Vector3, p: Vector3, k: Vector3) {
    this.s = s;
    this.p = p;
    this.k = k;
  }

  // ========== Static Factories ==========

  /**
   * Compute s-p basis for light hitting an interface
   *
   * @param k Propagation direction (unit vector, pointing INTO surface)
   * @param normal Surface normal (unit vector, pointing OUT of surface)
   * @returns PolarizationBasis with s perpendicular to plane of incidence
   *
   * 关键: 处理垂直入射 (k ∥ n) 的奇异情况
   */
  static computeInterfaceBasis(k: Vector3, normal: Vector3): PolarizationBasis {
    // Ensure inputs are normalized
    const kNorm = k.normalize();
    const nNorm = normal.normalize();

    // s = k × n (perpendicular to plane of incidence)
    let cross = kNorm.cross(nNorm);
    const crossLength = cross.length;

    // 奇异点处理: 垂直入射或共线情况
    if (crossLength < GEOMETRIC_EPSILON) {
      // k ∥ n: 平面入射不存在, 需要人为指定一个参考方向
      // 策略: 选择一个与 n 不平行的参考轴

      // 找到与 n 最不平行的坐标轴
      const absNx = Math.abs(nNorm.x);
      const absNy = Math.abs(nNorm.y);
      const absNz = Math.abs(nNorm.z);

      let reference: Vector3;
      if (absNx <= absNy && absNx <= absNz) {
        // n 主要在 y-z 平面, 用 x 轴
        reference = Vector3.X;
      } else if (absNy <= absNz) {
        // n 主要在 x-z 平面, 用 y 轴
        reference = Vector3.Y;
      } else {
        // n 主要在 x-y 平面, 用 z 轴
        reference = Vector3.Z;
      }

      // 构造 s 与 p
      // s = reference - (reference · n)n, 然后归一化
      const sRaw = reference.perpendicular(nNorm);
      const s = sRaw.normalize();
      // p = n × s (确保右手系)
      const p = nNorm.cross(s);

      return new PolarizationBasis(s, p, kNorm);
    }

    // 正常情况: s = (k × n) / |k × n|
    const s = cross.scale(1 / crossLength);
    // p 在入射面内, 垂直于 k
    // p = s × k (确保右手系: s × p = k)
    const p = s.cross(kNorm);

    return new PolarizationBasis(s, p, kNorm);
  }

  /**
   * Create basis for free-space propagation (no interface)
   * Default orientation with s horizontal for horizontal propagation
   *
   * @param k Propagation direction
   */
  static fromPropagation(k: Vector3): PolarizationBasis {
    const kNorm = k.normalize();

    // 默认选择: 当光沿 z 轴传播时, s 沿 x, p 沿 y
    // 使用 "up" 向量来定义 s 平面
    let up = Vector3.Y;

    // 如果 k 几乎与 y 轴平行, 改用 z 轴作为参考
    if (Math.abs(kNorm.dot(Vector3.Y)) > 0.99) {
      up = Vector3.Z;
    }

    // s 垂直于 k 和 up
    const sRaw = up.cross(kNorm);
    if (sRaw.isZero()) {
      // k 与 up 平行, 使用备选
      const [s, p] = buildOrthonormalBasis(kNorm);
      return new PolarizationBasis(s, p, kNorm);
    }

    const s = sRaw.normalize();
    const p = kNorm.cross(s);

    return new PolarizationBasis(s, p, kNorm);
  }

  /**
   * Create basis with specified s and k vectors
   * p is computed to complete the right-handed system
   */
  static fromSAndK(s: Vector3, k: Vector3): PolarizationBasis {
    const kNorm = k.normalize();
    const sNorm = s.normalize();

    // Ensure s is perpendicular to k
    const sPerp = sNorm.perpendicular(kNorm).normalizeOr(
      buildOrthonormalBasis(kNorm)[0]
    );

    const p = kNorm.cross(sPerp);

    return new PolarizationBasis(sPerp, p, kNorm);
  }

  // ========== Basis Transformations ==========

  /**
   * Compute transformation matrix from this basis to another
   * Returns 2×2 rotation matrix that rotates polarization state
   *
   * @param target Target basis
   * @returns Jones rotation matrix
   */
  transformTo(target: PolarizationBasis): Matrix2x2 {
    // The rotation angle is the angle between s vectors
    // projected onto the plane perpendicular to k
    const angle = this.angleTo(target);
    return this.createRotationMatrix(angle);
  }

  /**
   * Angle between this basis and another (radians)
   * Measured as rotation around k axis
   */
  angleTo(other: PolarizationBasis): number {
    // Project other.s onto plane perpendicular to this.k
    const otherSProj = other.s.perpendicular(this.k);
    if (otherSProj.isZero()) {
      return 0;
    }
    return signedAngle(this.s, otherSProj.normalize(), this.k);
  }

  /**
   * Create Jones rotation matrix for angle θ
   * R(θ) = [cos θ  -sin θ]
   *        [sin θ   cos θ]
   */
  createRotationMatrix(angle: number): Matrix2x2 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix2x2(
      new Complex(c), new Complex(-s),
      new Complex(s), new Complex(c)
    );
  }

  /**
   * Rotate this basis around k by angle θ
   */
  rotate(angle: number): PolarizationBasis {
    const newS = rotateAroundAxis(this.s, this.k, angle);
    const newP = rotateAroundAxis(this.p, this.k, angle);
    return new PolarizationBasis(newS, newP, this.k);
  }

  // ========== Coherency Matrix Transformations ==========

  /**
   * Transform a coherency matrix from this basis to another
   *
   * @param J Coherency matrix in this basis
   * @param target Target basis
   * @returns Coherency matrix in target basis
   */
  transformCoherency(J: CoherencyMatrix, target: PolarizationBasis): CoherencyMatrix {
    const R = this.transformTo(target);
    return J.applyOperator(R);
  }

  /**
   * Transform coherency matrix to interface basis for interaction
   *
   * @param J Coherency matrix in current basis
   * @param normal Surface normal for computing s-p basis
   */
  toInterfaceBasis(J: CoherencyMatrix, normal: Vector3): {
    matrix: CoherencyMatrix;
    basis: PolarizationBasis;
  } {
    const interfaceBasis = PolarizationBasis.computeInterfaceBasis(this.k, normal);
    const transformed = this.transformCoherency(J, interfaceBasis);
    return { matrix: transformed, basis: interfaceBasis };
  }

  // ========== Reflected/Refracted Basis ==========

  /**
   * Compute basis for reflected ray
   * s remains the same, p reverses component perpendicular to surface
   *
   * @param normal Surface normal
   */
  computeReflectedBasis(normal: Vector3): PolarizationBasis {
    // Reflected direction
    const kReflected = this.k.reflect(normal);

    // s remains perpendicular to plane of incidence
    // For reflection, s direction is preserved
    const sReflected = this.s;

    // p must be recalculated to maintain right-handed system
    const pReflected = sReflected.cross(kReflected);

    return new PolarizationBasis(sReflected, pReflected, kReflected);
  }

  /**
   * Compute basis for refracted ray
   *
   * @param normal Surface normal
   * @param n1 Incident medium refractive index
   * @param n2 Transmitted medium refractive index
   * @returns Basis for refracted ray, or null for TIR
   */
  computeRefractedBasis(
    normal: Vector3,
    n1: number,
    n2: number
  ): PolarizationBasis | null {
    const eta = n1 / n2;
    const kRefracted = this.k.refract(normal, eta);

    if (kRefracted === null) {
      // Total internal reflection
      return null;
    }

    // s remains perpendicular to plane of incidence
    const sRefracted = this.s;

    // p recalculated for new direction
    const pRefracted = sRefracted.cross(kRefracted);

    return new PolarizationBasis(sRefracted, pRefracted, kRefracted);
  }

  // ========== Utility ==========

  /**
   * Verify basis is orthonormal
   */
  isValid(tolerance: number = GEOMETRIC_EPSILON): boolean {
    // Check unit length
    if (Math.abs(this.s.lengthSquared - 1) > tolerance) return false;
    if (Math.abs(this.p.lengthSquared - 1) > tolerance) return false;
    if (Math.abs(this.k.lengthSquared - 1) > tolerance) return false;

    // Check orthogonality
    if (Math.abs(this.s.dot(this.p)) > tolerance) return false;
    if (Math.abs(this.s.dot(this.k)) > tolerance) return false;
    if (Math.abs(this.p.dot(this.k)) > tolerance) return false;

    // Check right-handed: s × p = k
    const cross = this.s.cross(this.p);
    if (!cross.equals(this.k, tolerance)) return false;

    return true;
  }

  /**
   * Clone this basis
   */
  clone(): PolarizationBasis {
    return new PolarizationBasis(this.s, this.p, this.k);
  }

  /**
   * String representation for debugging
   */
  toString(): string {
    return `PolarizationBasis(\n` +
           `  s=${this.s.toString()}\n` +
           `  p=${this.p.toString()}\n` +
           `  k=${this.k.toString()}\n)`;
  }
}

// ========== Helper Functions ==========

/**
 * Compute the angle of incidence (radians)
 * @param k Propagation direction (into surface)
 * @param normal Surface normal (out of surface)
 */
export function incidenceAngle(k: Vector3, normal: Vector3): number {
  // cos(θ) = -k · n (negative because k points into surface)
  const cosTheta = -k.normalize().dot(normal.normalize());
  // Clamp to handle numerical errors
  return Math.acos(Math.max(-1, Math.min(1, cosTheta)));
}

/**
 * Check if total internal reflection will occur
 */
export function willTIR(
  incAngle: number,
  n1: number,
  n2: number
): boolean {
  if (n1 <= n2) return false;
  const criticalAngle = Math.asin(n2 / n1);
  return incAngle > criticalAngle;
}
