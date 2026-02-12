/**
 * Physics Interpreter (物理语义桥)
 *
 * The "Semantic Bridge" between the deterministic physics engine and the AI/LLM layer.
 * Translates mathematical state representations (CoherencyMatrix, TraceResult) into
 * human-readable natural language concepts.
 *
 * This is the core of the Neuro-Symbolic World Model:
 * - Symbolic Core: CoherencyMatrix, LightTracer, OpticalSurface (Truth)
 * - Semantic Layer: This interpreter (Math → Natural Language)
 *
 * Design principles:
 * - Strict epsilon thresholds for state classification (no ambiguous outputs)
 * - Energy conservation validation for passive optical systems
 * - Deterministic: same input always produces same semantic label
 */

import { CoherencyMatrix } from './CoherencyMatrix';
import {
  OpticalSurface,
  IdealPolarizer,
  WavePlate,
  IdealMirror,
  OpticalRotator,
  PolarizingBeamSplitter,
  Attenuator,
  Depolarizer,
  DielectricSurface,
} from './OpticalSurface';
import type { TraceResult } from './LightTracer';

// ========== Classification Thresholds ==========
// 严格数值阈值 — 区分偏振态的物理判据

/** Minimum intensity to consider light as "existing" */
const INTENSITY_EPSILON = 1e-8;

/** Threshold for DoP to distinguish polarized vs unpolarized */
const DOP_POLARIZED_THRESHOLD = 0.95;
const DOP_UNPOLARIZED_THRESHOLD = 0.05;

/** Threshold for normalized S3 to distinguish linear from circular/elliptical */
const CIRCULARITY_THRESHOLD = 0.05;

/** Threshold for normalized S1,S2 to distinguish circular from elliptical */
const LINEARITY_THRESHOLD = 0.05;

/** Angular tolerance for named orientation angles (radians) */
const ANGLE_TOLERANCE = Math.PI / 36; // 5°

/** Intensity ratio tolerance for conservation checks */
const CONSERVATION_TOLERANCE = 1e-4;

// ========== Polarization State Enums ==========

/**
 * Coarse polarization category
 */
export type PolarizationCategory =
  | 'linear'
  | 'circular'
  | 'elliptical'
  | 'unpolarized'
  | 'partially-polarized'
  | 'zero';

/**
 * Handedness for circular/elliptical states
 */
export type Handedness = 'right' | 'left' | 'none';

/**
 * Named orientation for linear polarization.
 * "arbitrary" when the angle doesn't match a canonical direction.
 */
export type LinearOrientation =
  | 'horizontal'     // 0°
  | 'vertical'       // 90°
  | 'diagonal'       // +45°
  | 'anti-diagonal'  // -45°
  | 'arbitrary';

/**
 * Complete semantic description of a polarization state.
 * This is the primary output of the interpreter — a fully resolved human-readable label.
 */
export interface PolarizationStateDescription {
  /** Coarse category */
  category: PolarizationCategory;

  /** Canonical label (e.g., "Linear-Horizontal", "Circular-Right", "Elliptical-Left-23deg") */
  label: string;

  /** Degree of polarization [0, 1] */
  dop: number;

  /** Orientation angle in degrees (meaningful for linear/elliptical) */
  orientationDeg: number;

  /** Ellipticity angle in degrees (meaningful for elliptical/circular) */
  ellipticityDeg: number;

  /** Handedness */
  handedness: Handedness;

  /** Named orientation (for linear states) */
  linearOrientation: LinearOrientation;

  /** Total intensity */
  intensity: number;

  /** Stokes parameters [S0, S1, S2, S3] for full context */
  stokes: [number, number, number, number];
}

/**
 * Semantic description of what happened at a single optical interaction.
 */
export interface InteractionEvent {
  /** Human-readable description of the interaction */
  description: string;

  /** The optical element type that caused the interaction */
  elementType: string;

  /** Element ID */
  elementId: string;

  /** State before the interaction */
  before: PolarizationStateDescription;

  /** State after the interaction */
  after: PolarizationStateDescription;

  /** Intensity ratio (output / input) */
  transmittance: number;

  /** Whether energy was conserved (for sanity checking) */
  energyConserved: boolean;
}

/**
 * Full semantic analysis of a complete trace.
 */
export interface TraceAnalysis {
  /** Ordered list of interaction events */
  events: InteractionEvent[];

  /** Initial state description */
  initialState: PolarizationStateDescription;

  /** Final state description */
  finalState: PolarizationStateDescription;

  /** Total system transmittance */
  totalTransmittance: number;

  /** Whether energy conservation holds across the entire trace */
  energyConserved: boolean;

  /** Human-readable narrative summary */
  summary: string;
}

/**
 * Result of an energy conservation validation.
 */
export interface ConservationResult {
  /** Whether conservation holds within tolerance */
  valid: boolean;

  /** Input intensity */
  inputIntensity: number;

  /** Output intensity */
  outputIntensity: number;

  /** Ratio (output / input) */
  ratio: number;

  /** Diagnostic message if violated */
  message: string;
}

// ========== Core Interpreter ==========

export class PhysicsInterpreter {
  // ============================
  // 1. Polarization State Analysis
  // ============================

  /**
   * Analyze a CoherencyMatrix and produce a full semantic description.
   *
   * Classification algorithm:
   * 1. Check if intensity ≈ 0 → "zero"
   * 2. Check DoP:
   *    - DoP < 0.05 → "unpolarized"
   *    - DoP < 0.95 → "partially-polarized"
   *    - DoP ≥ 0.95 → fully polarized, proceed to step 3
   * 3. For fully polarized light, use normalized Stokes to classify:
   *    - |S3/S0| < ε → "linear" (resolve named orientation)
   *    - |S1/S0| < ε && |S2/S0| < ε → "circular" (resolve handedness)
   *    - Otherwise → "elliptical" (resolve handedness + orientation)
   */
  analyzeState(state: CoherencyMatrix): PolarizationStateDescription {
    const intensity = state.intensity;
    const stokes = state.toStokes();

    // Zero intensity → no light
    if (intensity < INTENSITY_EPSILON) {
      return this.buildDescription('zero', 'Zero', 0, 0, 0, 'none', 'arbitrary', 0, stokes);
    }

    const dop = state.degreeOfPolarization;
    const orientationRad = state.orientationAngle;
    const ellipticityRad = state.ellipticityAngle;
    const orientationDeg = radToDeg(orientationRad);
    const ellipticityDeg = radToDeg(ellipticityRad);

    // Unpolarized
    if (dop < DOP_UNPOLARIZED_THRESHOLD) {
      return this.buildDescription(
        'unpolarized', 'Unpolarized', dop,
        orientationDeg, ellipticityDeg, 'none', 'arbitrary', intensity, stokes
      );
    }

    // Partially polarized
    if (dop < DOP_POLARIZED_THRESHOLD) {
      const handedness = this.resolveHandedness(stokes);
      const linearOr = this.resolveLinearOrientation(orientationRad);
      const label = `Partially-Polarized (DoP=${(dop * 100).toFixed(0)}%)`;
      return this.buildDescription(
        'partially-polarized', label, dop,
        orientationDeg, ellipticityDeg, handedness, linearOr, intensity, stokes
      );
    }

    // Fully polarized — classify shape
    const [s0, s1, s2, s3] = stokes;

    // Normalized Stokes components on the Poincaré sphere
    const normS1 = Math.abs(s1 / s0);
    const normS2 = Math.abs(s2 / s0);
    const normS3 = Math.abs(s3 / s0);

    // Linear: S3 ≈ 0
    if (normS3 < CIRCULARITY_THRESHOLD) {
      const linearOr = this.resolveLinearOrientation(orientationRad);
      const label = this.buildLinearLabel(linearOr, orientationDeg);
      return this.buildDescription(
        'linear', label, dop,
        orientationDeg, ellipticityDeg, 'none', linearOr, intensity, stokes
      );
    }

    // Circular: S1 ≈ 0 && S2 ≈ 0
    if (normS1 < LINEARITY_THRESHOLD && normS2 < LINEARITY_THRESHOLD) {
      const handedness: Handedness = s3 > 0 ? 'right' : 'left';
      const label = `Circular-${capitalize(handedness)}`;
      return this.buildDescription(
        'circular', label, dop,
        orientationDeg, ellipticityDeg, handedness, 'arbitrary', intensity, stokes
      );
    }

    // Elliptical
    const handedness = this.resolveHandedness(stokes);
    const linearOr = this.resolveLinearOrientation(orientationRad);
    const label = `Elliptical-${capitalize(handedness)}-${Math.round(normalizeAngle(orientationDeg))}deg`;
    return this.buildDescription(
      'elliptical', label, dop,
      orientationDeg, ellipticityDeg, handedness, linearOr, intensity, stokes
    );
  }

  // ============================
  // 2. Interaction Event Analysis
  // ============================

  /**
   * Analyze a TraceResult and produce semantic descriptions of each interaction.
   *
   * The algorithm walks consecutive segment pairs. When the rayId matches between
   * adjacent segments, the transition represents a single optical interaction.
   * The surface responsible is identified from the segment endpoint / the next
   * segment's start coinciding with a surface position.
   */
  analyzeTrace(result: TraceResult, surfaces: OpticalSurface[]): TraceAnalysis {
    const { segments } = result;

    if (segments.length === 0) {
      const zeroState = this.analyzeState(CoherencyMatrix.ZERO);
      return {
        events: [],
        initialState: zeroState,
        finalState: zeroState,
        totalTransmittance: 0,
        energyConserved: true,
        summary: 'No light propagated through the system.',
      };
    }

    const initialState = this.analyzeState(segments[0].state);
    const finalSegment = segments[segments.length - 1];
    const finalState = this.analyzeState(finalSegment.state);

    const events: InteractionEvent[] = [];
    let allConserved = true;

    // Walk consecutive segments and match interactions to surfaces
    for (let i = 0; i < segments.length - 1; i++) {
      const before = segments[i];
      const after = segments[i + 1];

      // Find which surface caused this interaction
      const surface = this.findSurfaceAtPoint(before.end, surfaces);
      if (!surface) continue;

      const beforeDesc = this.analyzeState(before.state);
      const afterDesc = this.analyzeState(after.state);

      const transmittance = beforeDesc.intensity > INTENSITY_EPSILON
        ? afterDesc.intensity / beforeDesc.intensity
        : 0;

      const conservation = this.validateConservation(
        beforeDesc.intensity,
        afterDesc.intensity
      );

      if (!conservation.valid) {
        allConserved = false;
      }

      events.push({
        description: this.describeInteraction(surface, beforeDesc, afterDesc, transmittance),
        elementType: this.surfaceTypeName(surface),
        elementId: surface.id,
        before: beforeDesc,
        after: afterDesc,
        transmittance,
        energyConserved: conservation.valid,
      });
    }

    const totalTransmittance = initialState.intensity > INTENSITY_EPSILON
      ? finalState.intensity / initialState.intensity
      : 0;

    return {
      events,
      initialState,
      finalState,
      totalTransmittance,
      energyConserved: allConserved,
      summary: this.buildNarrative(events, initialState, finalState, totalTransmittance),
    };
  }

  /**
   * Analyze a pair of before/after CoherencyMatrix states at a known surface.
   * Use this for single-element analysis outside of a full trace.
   */
  analyzeInteraction(
    inputState: CoherencyMatrix,
    outputState: CoherencyMatrix,
    surface: OpticalSurface
  ): InteractionEvent {
    const before = this.analyzeState(inputState);
    const after = this.analyzeState(outputState);
    const transmittance = before.intensity > INTENSITY_EPSILON
      ? after.intensity / before.intensity
      : 0;
    const conservation = this.validateConservation(before.intensity, after.intensity);

    return {
      description: this.describeInteraction(surface, before, after, transmittance),
      elementType: this.surfaceTypeName(surface),
      elementId: surface.id,
      before,
      after,
      transmittance,
      energyConserved: conservation.valid,
    };
  }

  // ============================
  // 3. Energy Conservation Check
  // ============================

  /**
   * Validate that output intensity does not exceed input intensity.
   * In passive optics (no gain medium), output ≤ input is a hard physical law.
   *
   * If violated, logs a console.error with the full state for debugging.
   */
  validateConservation(inputIntensity: number, outputIntensity: number): ConservationResult {
    // Skip check for zero/negligible input
    if (inputIntensity < INTENSITY_EPSILON) {
      return {
        valid: true,
        inputIntensity,
        outputIntensity,
        ratio: 0,
        message: 'Input intensity below threshold; conservation check skipped.',
      };
    }

    const ratio = outputIntensity / inputIntensity;

    if (ratio > 1 + CONSERVATION_TOLERANCE) {
      const message =
        `ENERGY CONSERVATION VIOLATION: output (${outputIntensity.toExponential(6)}) > ` +
        `input (${inputIntensity.toExponential(6)}), ratio = ${ratio.toFixed(6)}. ` +
        `This is physically impossible in passive optics.`;

      console.error(
        `[PhysicsInterpreter] ${message}\n` +
        `  Input intensity:  ${inputIntensity}\n` +
        `  Output intensity: ${outputIntensity}\n` +
        `  Ratio:            ${ratio}`
      );

      return {
        valid: false,
        inputIntensity,
        outputIntensity,
        ratio,
        message,
      };
    }

    return {
      valid: true,
      inputIntensity,
      outputIntensity,
      ratio,
      message: `Energy conserved: transmittance = ${(ratio * 100).toFixed(2)}%.`,
    };
  }

  // ============================
  // Private Helpers
  // ============================

  private buildDescription(
    category: PolarizationCategory,
    label: string,
    dop: number,
    orientationDeg: number,
    ellipticityDeg: number,
    handedness: Handedness,
    linearOrientation: LinearOrientation,
    intensity: number,
    stokes: [number, number, number, number],
  ): PolarizationStateDescription {
    return {
      category,
      label,
      dop,
      orientationDeg: normalizeAngle(orientationDeg),
      ellipticityDeg,
      handedness,
      linearOrientation,
      intensity,
      stokes,
    };
  }

  /**
   * Resolve handedness from Stokes S3 component.
   * S3 > 0 → right-handed, S3 < 0 → left-handed.
   */
  private resolveHandedness(stokes: [number, number, number, number]): Handedness {
    const [s0, , , s3] = stokes;
    if (s0 < INTENSITY_EPSILON) return 'none';
    const normS3 = s3 / s0;
    if (Math.abs(normS3) < CIRCULARITY_THRESHOLD) return 'none';
    return normS3 > 0 ? 'right' : 'left';
  }

  /**
   * Map orientation angle to a named linear direction.
   * Tolerances: ±5° around each canonical angle.
   */
  private resolveLinearOrientation(orientationRad: number): LinearOrientation {
    // Normalize to [0, π)
    let angle = orientationRad % Math.PI;
    if (angle < 0) angle += Math.PI;

    if (angle < ANGLE_TOLERANCE || angle > Math.PI - ANGLE_TOLERANCE) return 'horizontal';
    if (Math.abs(angle - Math.PI / 4) < ANGLE_TOLERANCE) return 'diagonal';
    if (Math.abs(angle - Math.PI / 2) < ANGLE_TOLERANCE) return 'vertical';
    if (Math.abs(angle - 3 * Math.PI / 4) < ANGLE_TOLERANCE) return 'anti-diagonal';

    return 'arbitrary';
  }

  /**
   * Build a canonical label for linear polarization.
   */
  private buildLinearLabel(orientation: LinearOrientation, angleDeg: number): string {
    if (orientation === 'arbitrary') {
      return `Linear-${Math.round(normalizeAngle(angleDeg))}deg`;
    }
    return `Linear-${capitalize(orientation)}`;
  }

  /**
   * Resolve the human-readable type name for an OpticalSurface.
   */
  private surfaceTypeName(surface: OpticalSurface): string {
    if (surface instanceof IdealPolarizer) return 'Linear Polarizer';
    if (surface instanceof WavePlate) {
      const retardanceDeg = radToDeg(surface.retardance);
      if (Math.abs(retardanceDeg - 90) < 1) return 'Quarter-Wave Plate';
      if (Math.abs(retardanceDeg - 180) < 1) return 'Half-Wave Plate';
      return `Wave Plate (${retardanceDeg.toFixed(0)}°)`;
    }
    if (surface instanceof IdealMirror) return 'Mirror';
    if (surface instanceof OpticalRotator) return 'Optical Rotator';
    if (surface instanceof PolarizingBeamSplitter) return 'Polarizing Beam Splitter';
    if (surface instanceof Attenuator) return 'Attenuator';
    if (surface instanceof Depolarizer) return 'Depolarizer';
    if (surface instanceof DielectricSurface) return 'Dielectric Surface';
    return 'Optical Element';
  }

  /**
   * Generate a human-readable description of what an optical element did.
   */
  private describeInteraction(
    surface: OpticalSurface,
    before: PolarizationStateDescription,
    after: PolarizationStateDescription,
    transmittance: number,
  ): string {
    const elementName = this.surfaceTypeName(surface);
    const intensityPct = (transmittance * 100).toFixed(1);

    // Zero output → absorbed
    if (after.category === 'zero') {
      return `The ${elementName} completely blocked the light (0% transmitted).`;
    }

    // Specific descriptions by element type
    if (surface instanceof IdealPolarizer) {
      return this.describePolarizer(elementName, before, after, intensityPct);
    }
    if (surface instanceof WavePlate) {
      return this.describeWavePlate(surface, elementName, before, after);
    }
    if (surface instanceof OpticalRotator) {
      return this.describeRotator(surface, before, after);
    }
    if (surface instanceof IdealMirror) {
      return `The ${elementName} reflected the light. Polarization: ${before.label} → ${after.label}.`;
    }
    if (surface instanceof PolarizingBeamSplitter) {
      return `The ${elementName} split the beam. Transmitted component: ${after.label} at ${intensityPct}% intensity.`;
    }
    if (surface instanceof Attenuator) {
      return `The ${elementName} attenuated the light to ${intensityPct}% of its original intensity. Polarization unchanged: ${after.label}.`;
    }
    if (surface instanceof Depolarizer) {
      return `The ${elementName} depolarized the light. DoP changed from ${(before.dop * 100).toFixed(0)}% to ${(after.dop * 100).toFixed(0)}%.`;
    }
    if (surface instanceof DielectricSurface) {
      return `The Dielectric Surface (n₁=${surface.n1}, n₂=${surface.n2}) transmitted ${intensityPct}% of the light. State: ${before.label} → ${after.label}.`;
    }

    return `The ${elementName} transformed the light: ${before.label} → ${after.label} (${intensityPct}% transmitted).`;
  }

  private describePolarizer(
    elementName: string,
    before: PolarizationStateDescription,
    after: PolarizationStateDescription,
    intensityPct: string,
  ): string {
    if (before.category === 'linear' && after.category === 'linear') {
      const angleDiff = Math.abs(before.orientationDeg - after.orientationDeg);
      if (angleDiff < 1) {
        return `The ${elementName} transmitted the light with minimal loss (${intensityPct}%). Polarization aligned with transmission axis.`;
      }
    }
    return `The ${elementName} filtered the light from ${before.label} to ${after.label}, transmitting ${intensityPct}% (Malus's Law).`;
  }

  private describeWavePlate(
    surface: WavePlate,
    elementName: string,
    before: PolarizationStateDescription,
    after: PolarizationStateDescription,
  ): string {
    const retDeg = radToDeg(surface.retardance);

    // HWP: rotates linear polarization axis
    if (Math.abs(retDeg - 180) < 1) {
      if (before.category === 'linear' && after.category === 'linear') {
        const rotation = after.orientationDeg - before.orientationDeg;
        const normRotation = ((rotation % 180) + 180) % 180;
        return `The ${elementName} rotated the polarization axis by ${normRotation.toFixed(0)}° (${before.label} → ${after.label}).`;
      }
      if (before.category === 'circular' && after.category === 'circular') {
        return `The ${elementName} reversed the handedness of the circular polarization (${before.label} → ${after.label}).`;
      }
    }

    // QWP: linear ↔ circular conversion
    if (Math.abs(retDeg - 90) < 1) {
      if (before.category === 'linear' && after.category === 'circular') {
        return `The ${elementName} converted linear to circular polarization (${before.label} → ${after.label}).`;
      }
      if (before.category === 'circular' && after.category === 'linear') {
        return `The ${elementName} converted circular to linear polarization (${before.label} → ${after.label}).`;
      }
    }

    return `The ${elementName} (retardance ${retDeg.toFixed(0)}°) transformed the polarization: ${before.label} → ${after.label}.`;
  }

  private describeRotator(
    surface: OpticalRotator,
    before: PolarizationStateDescription,
    after: PolarizationStateDescription,
  ): string {
    const rotDeg = radToDeg(surface.rotationAngle);
    return `The Optical Rotator rotated the polarization by ${rotDeg.toFixed(0)}° without intensity loss (${before.label} → ${after.label}).`;
  }

  /**
   * Find the surface closest to a point (within collision radius).
   */
  private findSurfaceAtPoint(
    point: { x: number; y: number; z: number },
    surfaces: OpticalSurface[],
  ): OpticalSurface | null {
    let closest: OpticalSurface | null = null;
    let minDist = Infinity;

    for (const surface of surfaces) {
      const dx = surface.position.x - point.x;
      const dy = surface.position.y - point.y;
      const dz = surface.position.z - point.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < minDist) {
        minDist = dist;
        closest = surface;
      }
    }

    // Only match if within reasonable collision distance
    return minDist < 2.0 ? closest : null;
  }

  /**
   * Build a narrative summary of the full trace.
   */
  private buildNarrative(
    events: InteractionEvent[],
    initial: PolarizationStateDescription,
    final: PolarizationStateDescription,
    totalTransmittance: number,
  ): string {
    if (events.length === 0) {
      return `Light entered as ${initial.label} and propagated freely without interaction.`;
    }

    const parts: string[] = [];
    parts.push(`Light entered the system as ${initial.label} (intensity: ${initial.intensity.toFixed(4)}).`);

    for (const event of events) {
      parts.push(event.description);
    }

    parts.push(
      `Light exited as ${final.label} with ${(totalTransmittance * 100).toFixed(1)}% ` +
      `of the original intensity (${final.intensity.toFixed(4)}).`
    );

    return parts.join(' ');
  }
}

// ========== Utility Functions ==========

function radToDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

function normalizeAngle(deg: number): number {
  let a = deg % 180;
  if (a < 0) a += 180;
  return a;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ========== Singleton Instance ==========

/**
 * Default PhysicsInterpreter instance for convenience.
 * Stateless, so a singleton is safe.
 */
export const physicsInterpreter = new PhysicsInterpreter();
