/**
 * PolarCraft - Wave Optics Engine
 * Jones Calculus implementation for accurate polarization simulation
 *
 * This module provides:
 * - Complex number arithmetic
 * - Jones Vector representation for polarized light
 * - Jones Matrix operations for optical elements
 */

// ============== Complex Number Class ==============

/**
 * Complex number representation for wave optics calculations
 * z = real + i * imag
 */
export class Complex {
  constructor(
    public readonly real: number,
    public readonly imag: number = 0
  ) {}

  // Factory methods
  static fromPolar(magnitude: number, phase: number): Complex {
    return new Complex(
      magnitude * Math.cos(phase),
      magnitude * Math.sin(phase)
    );
  }

  static readonly ZERO = new Complex(0, 0);
  static readonly ONE = new Complex(1, 0);
  static readonly I = new Complex(0, 1);

  // Basic operations
  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  subtract(other: Complex): Complex {
    return new Complex(this.real - other.real, this.imag - other.imag);
  }

  multiply(other: Complex): Complex {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  scale(scalar: number): Complex {
    return new Complex(this.real * scalar, this.imag * scalar);
  }

  divide(other: Complex): Complex {
    const denominator = other.real * other.real + other.imag * other.imag;
    if (denominator === 0) {
      throw new Error('Division by zero in complex number');
    }
    return new Complex(
      (this.real * other.real + this.imag * other.imag) / denominator,
      (this.imag * other.real - this.real * other.imag) / denominator
    );
  }

  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }

  // Properties
  get magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  get magnitudeSquared(): number {
    return this.real * this.real + this.imag * this.imag;
  }

  get phase(): number {
    return Math.atan2(this.imag, this.real);
  }

  // Utility
  isZero(tolerance: number = 1e-10): boolean {
    return this.magnitudeSquared < tolerance;
  }

  equals(other: Complex, tolerance: number = 1e-10): boolean {
    return Math.abs(this.real - other.real) < tolerance &&
           Math.abs(this.imag - other.imag) < tolerance;
  }

  toString(): string {
    if (this.imag >= 0) {
      return `${this.real.toFixed(4)} + ${this.imag.toFixed(4)}i`;
    }
    return `${this.real.toFixed(4)} - ${Math.abs(this.imag).toFixed(4)}i`;
  }
}

// ============== Jones Vector ==============

/**
 * Jones Vector representation for polarized light
 * E = [Ex, Ey]^T where Ex and Ey are complex amplitudes
 *
 * The Jones vector fully describes the polarization state:
 * - Linear polarization: phase difference = 0 or π
 * - Circular polarization: |Ex| = |Ey| and phase difference = ±π/2
 * - Elliptical: all other cases
 */
export class JonesVector {
  constructor(
    public readonly Ex: Complex,
    public readonly Ey: Complex
  ) {}

  // Factory methods for common polarization states

  /**
   * Linear polarization at angle θ (in radians)
   * E = [cos(θ), sin(θ)]^T
   */
  static linearPolarization(angleRadians: number, amplitude: number = 1): JonesVector {
    return new JonesVector(
      new Complex(amplitude * Math.cos(angleRadians)),
      new Complex(amplitude * Math.sin(angleRadians))
    );
  }

  /**
   * Linear polarization at angle θ (in degrees)
   */
  static linearPolarizationDegrees(angleDegrees: number, amplitude: number = 1): JonesVector {
    return JonesVector.linearPolarization(angleDegrees * Math.PI / 180, amplitude);
  }

  /**
   * Horizontal linear polarization (0°)
   */
  static horizontal(amplitude: number = 1): JonesVector {
    return new JonesVector(new Complex(amplitude), Complex.ZERO);
  }

  /**
   * Vertical linear polarization (90°)
   */
  static vertical(amplitude: number = 1): JonesVector {
    return new JonesVector(Complex.ZERO, new Complex(amplitude));
  }

  /**
   * 45° linear polarization
   */
  static diagonal(amplitude: number = 1): JonesVector {
    const component = amplitude / Math.SQRT2;
    return new JonesVector(new Complex(component), new Complex(component));
  }

  /**
   * 135° linear polarization (anti-diagonal)
   */
  static antiDiagonal(amplitude: number = 1): JonesVector {
    const component = amplitude / Math.SQRT2;
    return new JonesVector(new Complex(component), new Complex(-component));
  }

  /**
   * Right circular polarization
   * E = [1, -i]^T / √2
   */
  static rightCircular(amplitude: number = 1): JonesVector {
    const component = amplitude / Math.SQRT2;
    return new JonesVector(
      new Complex(component),
      new Complex(0, -component)
    );
  }

  /**
   * Left circular polarization
   * E = [1, i]^T / √2
   */
  static leftCircular(amplitude: number = 1): JonesVector {
    const component = amplitude / Math.SQRT2;
    return new JonesVector(
      new Complex(component),
      new Complex(0, component)
    );
  }

  /**
   * Unpolarized light cannot be represented by a single Jones vector.
   * For simulation purposes, we create a "pseudo-unpolarized" state
   * by averaging over many polarization states during propagation.
   * This factory creates a random linear polarization for stochastic simulation.
   */
  static randomLinear(amplitude: number = 1): JonesVector {
    const angle = Math.random() * Math.PI;
    return JonesVector.linearPolarization(angle, amplitude);
  }

  // Operations

  /**
   * Add two Jones vectors (superposition)
   */
  add(other: JonesVector): JonesVector {
    return new JonesVector(
      this.Ex.add(other.Ex),
      this.Ey.add(other.Ey)
    );
  }

  /**
   * Scale the Jones vector
   */
  scale(scalar: number): JonesVector {
    return new JonesVector(
      this.Ex.scale(scalar),
      this.Ey.scale(scalar)
    );
  }

  /**
   * Scale by complex number (for phase shifts)
   */
  scaleComplex(c: Complex): JonesVector {
    return new JonesVector(
      this.Ex.multiply(c),
      this.Ey.multiply(c)
    );
  }

  // Properties

  /**
   * Total intensity: I = |Ex|² + |Ey|²
   */
  get intensity(): number {
    return this.Ex.magnitudeSquared + this.Ey.magnitudeSquared;
  }

  /**
   * Convert intensity to game integer scale (0-15)
   */
  getIntensityScaled(maxIntensity: number = 15): number {
    // Normalize assuming max amplitude of ~1 per component
    // Intensity max would be ~2 for max amplitude 1 per component
    const normalizedIntensity = Math.min(this.intensity, 2) / 2;
    return Math.floor(normalizedIntensity * maxIntensity);
  }

  /**
   * Get the primary polarization angle (for linear or near-linear polarization)
   * Returns angle in degrees (0-180)
   */
  getPolarizationAngle(): number {
    // For linear polarization, the angle is atan2(|Ey|, |Ex|)
    // But for elliptical, we need to find the major axis angle
    // Simplified: use the phase relationship
    const exMag = this.Ex.magnitude;
    const eyMag = this.Ey.magnitude;

    if (exMag < 1e-10 && eyMag < 1e-10) {
      return 0;
    }

    // Use the major axis of the polarization ellipse
    let angle = Math.atan2(eyMag, exMag) * 180 / Math.PI;

    // Normalize to 0-180 range
    while (angle < 0) angle += 180;
    while (angle >= 180) angle -= 180;

    return angle;
  }

  /**
   * Quantize polarization angle to discrete game values
   */
  getDiscretePolarization(): 0 | 45 | 90 | 135 {
    const angle = this.getPolarizationAngle();
    const validAngles: (0 | 45 | 90 | 135)[] = [0, 45, 90, 135];

    let closest = validAngles[0];
    let minDiff = Math.abs(angle - validAngles[0]);

    for (const valid of validAngles) {
      // Handle wrap-around at 180 -> 0
      let diff = Math.abs(angle - valid);
      if (diff > 90) diff = 180 - diff;

      if (diff < minDiff) {
        minDiff = diff;
        closest = valid;
      }
    }

    return closest;
  }

  /**
   * Get effective phase (1 or -1) based on the sign of the real part of Ex
   * This is a simplified model for game compatibility
   */
  getDiscretePhase(): 1 | -1 {
    // Use the phase of the dominant component
    if (this.Ex.magnitudeSquared >= this.Ey.magnitudeSquared) {
      return this.Ex.real >= 0 ? 1 : -1;
    }
    return this.Ey.real >= 0 ? 1 : -1;
  }

  /**
   * Check if intensity is above threshold
   */
  isAboveThreshold(threshold: number = 0.01): boolean {
    return this.intensity > threshold;
  }

  /**
   * Check if this is essentially zero (absorbed)
   */
  isZero(tolerance: number = 1e-10): boolean {
    return this.Ex.isZero(tolerance) && this.Ey.isZero(tolerance);
  }

  /**
   * Normalize to unit intensity
   */
  normalize(): JonesVector {
    const intensity = this.intensity;
    if (intensity < 1e-10) {
      return JonesVector.horizontal(0);
    }
    const scale = 1 / Math.sqrt(intensity);
    return this.scale(scale);
  }

  toString(): string {
    return `JonesVector([${this.Ex}], [${this.Ey}]) I=${this.intensity.toFixed(4)}`;
  }
}

// ============== Jones Matrix ==============

/**
 * 2x2 Jones Matrix for optical elements
 * [a b]   [Ex]   [Ex']
 * [c d] × [Ey] = [Ey']
 */
export class JonesMatrix {
  constructor(
    public readonly a: Complex,
    public readonly b: Complex,
    public readonly c: Complex,
    public readonly d: Complex
  ) {}

  // Factory methods for common optical elements

  /**
   * Identity matrix (no change)
   */
  static identity(): JonesMatrix {
    return new JonesMatrix(
      Complex.ONE, Complex.ZERO,
      Complex.ZERO, Complex.ONE
    );
  }

  /**
   * Linear polarizer at angle θ (in radians)
   * Projects onto the polarization axis
   */
  static linearPolarizer(angleRadians: number): JonesMatrix {
    const c = Math.cos(angleRadians);
    const s = Math.sin(angleRadians);
    return new JonesMatrix(
      new Complex(c * c), new Complex(c * s),
      new Complex(c * s), new Complex(s * s)
    );
  }

  /**
   * Linear polarizer at angle θ (in degrees)
   */
  static linearPolarizerDegrees(angleDegrees: number): JonesMatrix {
    return JonesMatrix.linearPolarizer(angleDegrees * Math.PI / 180);
  }

  /**
   * Horizontal polarizer (0°)
   */
  static horizontalPolarizer(): JonesMatrix {
    return new JonesMatrix(
      Complex.ONE, Complex.ZERO,
      Complex.ZERO, Complex.ZERO
    );
  }

  /**
   * Vertical polarizer (90°)
   */
  static verticalPolarizer(): JonesMatrix {
    return new JonesMatrix(
      Complex.ZERO, Complex.ZERO,
      Complex.ZERO, Complex.ONE
    );
  }

  /**
   * Wave plate (retarder) with given retardation and fast axis angle
   * @param retardation Phase retardation in radians (π/2 for quarter-wave, π for half-wave)
   * @param fastAxisAngle Angle of fast axis in radians
   */
  static waveplate(retardation: number, fastAxisAngle: number): JonesMatrix {
    const c = Math.cos(fastAxisAngle);
    const s = Math.sin(fastAxisAngle);
    const c2 = c * c;
    const s2 = s * s;
    const cs = c * s;

    const expPlus = Complex.fromPolar(1, retardation / 2);
    const expMinus = Complex.fromPolar(1, -retardation / 2);

    // Wave plate matrix in rotated coordinates:
    // R(-θ) × diag(e^{iδ/2}, e^{-iδ/2}) × R(θ)
    const a = new Complex(c2).multiply(expPlus).add(new Complex(s2).multiply(expMinus));
    const b = new Complex(cs).multiply(expPlus.subtract(expMinus));
    const cMat = new Complex(cs).multiply(expPlus.subtract(expMinus));
    const d = new Complex(s2).multiply(expPlus).add(new Complex(c2).multiply(expMinus));

    return new JonesMatrix(a, b, cMat, d);
  }

  /**
   * Quarter-wave plate (λ/4) with fast axis at given angle
   */
  static quarterWavePlate(fastAxisAngleRadians: number): JonesMatrix {
    return JonesMatrix.waveplate(Math.PI / 2, fastAxisAngleRadians);
  }

  /**
   * Quarter-wave plate with fast axis at given angle in degrees
   */
  static quarterWavePlateDegrees(fastAxisAngleDegrees: number): JonesMatrix {
    return JonesMatrix.quarterWavePlate(fastAxisAngleDegrees * Math.PI / 180);
  }

  /**
   * Half-wave plate (λ/2) with fast axis at given angle
   * Rotates polarization by 2θ
   */
  static halfWavePlate(fastAxisAngleRadians: number): JonesMatrix {
    return JonesMatrix.waveplate(Math.PI, fastAxisAngleRadians);
  }

  /**
   * Half-wave plate with fast axis at given angle in degrees
   */
  static halfWavePlateDegrees(fastAxisAngleDegrees: number): JonesMatrix {
    return JonesMatrix.halfWavePlate(fastAxisAngleDegrees * Math.PI / 180);
  }

  /**
   * Optical rotator (e.g., Faraday rotator, optically active medium)
   * Rotates polarization by angle θ
   */
  static rotator(angleRadians: number): JonesMatrix {
    const c = Math.cos(angleRadians);
    const s = Math.sin(angleRadians);
    return new JonesMatrix(
      new Complex(c), new Complex(-s),
      new Complex(s), new Complex(c)
    );
  }

  /**
   * Optical rotator with angle in degrees
   */
  static rotatorDegrees(angleDegrees: number): JonesMatrix {
    return JonesMatrix.rotator(angleDegrees * Math.PI / 180);
  }

  /**
   * Attenuator (reduces amplitude by factor)
   * @param transmittance Amplitude transmittance (0-1)
   */
  static attenuator(transmittance: number): JonesMatrix {
    const t = new Complex(Math.sqrt(Math.max(0, Math.min(1, transmittance))));
    return new JonesMatrix(t, Complex.ZERO, Complex.ZERO, t);
  }

  /**
   * Phase shifter (adds phase to both components)
   */
  static phaseShifter(phaseRadians: number): JonesMatrix {
    const phase = Complex.fromPolar(1, phaseRadians);
    return new JonesMatrix(phase, Complex.ZERO, Complex.ZERO, phase);
  }

  /**
   * Mirror reflection (flips one component)
   * Assumes mirror is aligned with x-axis
   */
  static mirror(): JonesMatrix {
    return new JonesMatrix(
      Complex.ONE, Complex.ZERO,
      Complex.ZERO, new Complex(-1)
    );
  }

  // Operations

  /**
   * Apply matrix to Jones vector: E' = M × E
   */
  apply(vector: JonesVector): JonesVector {
    const newEx = this.a.multiply(vector.Ex).add(this.b.multiply(vector.Ey));
    const newEy = this.c.multiply(vector.Ex).add(this.d.multiply(vector.Ey));
    return new JonesVector(newEx, newEy);
  }

  /**
   * Matrix multiplication: M1 × M2
   */
  multiply(other: JonesMatrix): JonesMatrix {
    return new JonesMatrix(
      this.a.multiply(other.a).add(this.b.multiply(other.c)),
      this.a.multiply(other.b).add(this.b.multiply(other.d)),
      this.c.multiply(other.a).add(this.d.multiply(other.c)),
      this.c.multiply(other.b).add(this.d.multiply(other.d))
    );
  }

  /**
   * Scale matrix by scalar
   */
  scale(scalar: number): JonesMatrix {
    return new JonesMatrix(
      this.a.scale(scalar),
      this.b.scale(scalar),
      this.c.scale(scalar),
      this.d.scale(scalar)
    );
  }

  toString(): string {
    return `JonesMatrix([[${this.a}, ${this.b}], [${this.c}, ${this.d}]])`;
  }
}

// ============== Wave Optics Light State ==============

/**
 * Enhanced light representation for wave optics simulation
 * Combines Jones vector with propagation metadata
 */
export interface WaveLight {
  // Core wave optics state
  jones: JonesVector;

  // Propagation direction
  direction: 'north' | 'south' | 'east' | 'west' | 'up' | 'down';

  // Global phase for interference (accumulated phase from path length)
  globalPhase: number;

  // Source ID for coherence tracking (lights from same source can interfere)
  sourceId: string;

  // Path length traveled (in blocks)
  pathLength: number;
}

/**
 * Create a WaveLight from basic parameters
 */
export function createWaveLight(
  direction: WaveLight['direction'],
  polarizationAngleDegrees: number,
  amplitude: number = 1,
  sourceId: string = 'default'
): WaveLight {
  return {
    jones: JonesVector.linearPolarizationDegrees(polarizationAngleDegrees, amplitude),
    direction,
    globalPhase: 0,
    sourceId,
    pathLength: 0
  };
}

/**
 * Coherent superposition of multiple wave lights at same position
 * Only lights from the same source with same direction can interfere
 */
export function superposeLights(lights: WaveLight[]): WaveLight[] {
  if (lights.length === 0) return [];
  if (lights.length === 1) return lights;

  // Group by (sourceId, direction) for coherent superposition
  const groups = new Map<string, WaveLight[]>();

  for (const light of lights) {
    const key = `${light.sourceId}_${light.direction}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(light);
  }

  const result: WaveLight[] = [];

  for (const [, groupLights] of groups) {
    if (groupLights.length === 1) {
      result.push(groupLights[0]);
      continue;
    }

    // Coherent superposition: add Jones vectors with phase
    let superposedJones = new JonesVector(Complex.ZERO, Complex.ZERO);
    let totalPathLength = 0;

    for (const light of groupLights) {
      // Apply global phase before superposition
      const phaseShift = Complex.fromPolar(1, light.globalPhase);
      const phasedJones = light.jones.scaleComplex(phaseShift);
      superposedJones = superposedJones.add(phasedJones);
      totalPathLength += light.pathLength;
    }

    // Only include if intensity is above threshold
    if (superposedJones.intensity > 0.01) {
      result.push({
        jones: superposedJones,
        direction: groupLights[0].direction,
        globalPhase: 0, // Phase is now encoded in the Jones vector
        sourceId: groupLights[0].sourceId,
        pathLength: totalPathLength / groupLights.length
      });
    }
  }

  return result;
}

// ============== Conversion Functions ==============

import type { LightPacket, PolarizationAngle, Phase } from './types';

/**
 * Convert legacy LightPacket to WaveLight
 */
export function lightPacketToWaveLight(packet: LightPacket, sourceId: string = 'legacy'): WaveLight {
  // Convert intensity 0-15 to amplitude 0-1
  const amplitude = Math.sqrt(packet.intensity / 15);

  // Convert discrete phase to global phase
  const globalPhase = packet.phase === -1 ? Math.PI : 0;

  return {
    jones: JonesVector.linearPolarizationDegrees(packet.polarization, amplitude),
    direction: packet.direction,
    globalPhase,
    sourceId,
    pathLength: 0
  };
}

/**
 * Convert WaveLight to legacy LightPacket for backward compatibility
 */
export function waveLightToLightPacket(light: WaveLight): LightPacket {
  return {
    direction: light.direction,
    intensity: Math.min(15, light.jones.getIntensityScaled()),
    polarization: light.jones.getDiscretePolarization() as PolarizationAngle,
    phase: light.jones.getDiscretePhase() as Phase
  };
}

/**
 * Convert multiple WaveLights to LightPackets
 */
export function waveLightsToLightPackets(lights: WaveLight[]): LightPacket[] {
  return lights
    .filter(l => l.jones.intensity > 0.01)
    .map(waveLightToLightPacket);
}
