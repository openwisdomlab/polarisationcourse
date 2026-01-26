/**
 * Legacy Adapter (遗留代码适配器)
 *
 * Provides compatibility layer between the new unified physics engine
 * and existing game/demo code that uses the old LightPacket/WaveLight system.
 *
 * Key conversions:
 * - LightPacket (discrete) <-> CoherencyMatrix
 * - WaveLight (Jones) <-> CoherencyMatrix
 * - Old polarization angles (0,45,90,135) <-> continuous angles
 */

import { Complex } from '../../math/Complex';
import { Vector3 } from '../../math/Vector3';
import { CoherencyMatrix } from './CoherencyMatrix';
import { PolarizationBasis } from './PolarizationBasis';
import {
  LightRay,
  generateRayId
} from './LightSource';

// ========== Legacy Types (from existing codebase) ==========

/**
 * Legacy discrete polarization angles (degrees)
 */
export type LegacyPolarization = 0 | 45 | 90 | 135;

/**
 * Legacy direction type
 */
export type LegacyDirection = 'north' | 'south' | 'east' | 'west' | 'up' | 'down';

/**
 * Legacy LightPacket structure (from types.ts)
 */
export interface LegacyLightPacket {
  direction: LegacyDirection;
  intensity: number;        // 0-15 discrete scale
  polarization: LegacyPolarization;
  phase: 1 | -1;            // Binary phase
}

/**
 * Legacy WaveLight structure (from LightPhysics.ts)
 */
export interface LegacyWaveLight {
  direction: LegacyDirection;
  jones: { ex: Complex; ey: Complex };
  globalPhase: number;      // 0-2π
  sourceId: string;
}

// ========== Direction Mapping ==========

const DIRECTION_TO_VECTOR: Record<LegacyDirection, Vector3> = {
  north: new Vector3(0, 0, -1),
  south: new Vector3(0, 0, 1),
  east: new Vector3(1, 0, 0),
  west: new Vector3(-1, 0, 0),
  up: new Vector3(0, 1, 0),
  down: new Vector3(0, -1, 0)
};

function vectorToDirection(v: Vector3): LegacyDirection {
  const vn = v.normalize();
  let bestDir: LegacyDirection = 'north';
  let bestDot = -2;

  for (const [dir, vec] of Object.entries(DIRECTION_TO_VECTOR)) {
    const dot = vn.dot(vec);
    if (dot > bestDot) {
      bestDot = dot;
      bestDir = dir as LegacyDirection;
    }
  }

  return bestDir;
}

// ========== Conversion Functions ==========

/**
 * Convert legacy LightPacket to CoherencyMatrix
 *
 * @param packet Legacy light packet
 * @returns Coherency matrix representation
 */
export function fromLightPacket(packet: LegacyLightPacket): CoherencyMatrix {
  // Normalize intensity from 0-15 to 0-1
  const intensity = packet.intensity / 15;

  // Convert discrete angle to radians
  const angleRad = packet.polarization * Math.PI / 180;

  // Create fully polarized state
  return CoherencyMatrix.createLinear(intensity, angleRad);
}

/**
 * Convert CoherencyMatrix to legacy LightPacket
 *
 * @param state Coherency matrix
 * @param direction Propagation direction
 * @returns Legacy light packet (with quantized values)
 */
export function toLightPacket(
  state: CoherencyMatrix,
  direction: Vector3
): LegacyLightPacket {
  // Quantize intensity to 0-15
  const intensity = Math.round(state.intensity * 15);

  // Quantize polarization angle to nearest of {0, 45, 90, 135}
  const angleDeg = state.orientationAngle * 180 / Math.PI;
  const normalized = ((angleDeg % 180) + 180) % 180; // 0-180
  const polarization = (Math.round(normalized / 45) * 45 % 180) as LegacyPolarization;

  // DoP determines phase (low DoP = uncertain = neutral phase)
  const phase = state.degreeOfPolarization > 0.5 ? 1 : -1;

  return {
    direction: vectorToDirection(direction),
    intensity,
    polarization,
    phase
  };
}

/**
 * Convert legacy WaveLight to CoherencyMatrix
 *
 * @param wave Legacy wave light
 * @returns Coherency matrix representation
 */
export function fromWaveLight(wave: LegacyWaveLight): CoherencyMatrix {
  const { ex, ey } = wave.jones;
  return CoherencyMatrix.fromJones(ex, ey);
}

/**
 * Convert CoherencyMatrix to legacy WaveLight format
 *
 * @param state Coherency matrix
 * @param direction Propagation direction
 * @param sourceId Source identifier
 * @returns Legacy wave light
 */
export function toWaveLight(
  state: CoherencyMatrix,
  direction: Vector3,
  sourceId: string
): LegacyWaveLight {
  // Extract Jones vector from coherency matrix
  // For fully polarized: J = |E><E|, so E can be recovered
  // For partially polarized: use the polarized component

  const intensity = state.intensity;
  const dop = state.degreeOfPolarization;
  const angle = state.orientationAngle;

  // Amplitude of polarized component
  const polAmp = Math.sqrt(intensity * dop);

  const ex = new Complex(polAmp * Math.cos(angle), 0);
  const ey = new Complex(polAmp * Math.sin(angle), 0);

  return {
    direction: vectorToDirection(direction),
    jones: { ex, ey },
    globalPhase: 0,
    sourceId
  };
}

/**
 * Convert legacy state with coherence factor to CoherencyMatrix
 *
 * This handles the case where old code used a separate "coherency" value
 * to track partial polarization.
 *
 * @param intensity Light intensity (0-1)
 * @param jonesVector Jones vector [ex, ey] or null for legacy packet
 * @param coherency Coherence factor (0 = unpolarized, 1 = polarized)
 */
export function fromLegacyState(
  intensity: number,
  jonesVector: { ex: Complex; ey: Complex } | null,
  coherency: number
): CoherencyMatrix {
  const clampedCoherency = Math.max(0, Math.min(1, coherency));

  if (jonesVector === null) {
    // Pure unpolarized light
    return CoherencyMatrix.createUnpolarized(intensity);
  }

  if (clampedCoherency >= 1 - 1e-6) {
    // Fully polarized
    return CoherencyMatrix.fromJones(jonesVector.ex, jonesVector.ey);
  }

  if (clampedCoherency < 1e-6) {
    // Fully unpolarized
    return CoherencyMatrix.createUnpolarized(intensity);
  }

  // Partially polarized: mix polarized and unpolarized components
  // J = coherency × J_polarized + (1-coherency) × (I/2) × Identity

  const polarized = CoherencyMatrix.fromJones(jonesVector.ex, jonesVector.ey);
  const unpolarized = CoherencyMatrix.createUnpolarized(intensity);

  // Scale and add
  const scaledPol = polarized.scale(clampedCoherency);
  const scaledUnpol = unpolarized.scale(1 - clampedCoherency);

  return scaledPol.add(scaledUnpol);
}

// ========== LightRay Adapters ==========

/**
 * Create a LightRay from legacy LightPacket
 */
export function rayFromPacket(
  packet: LegacyLightPacket,
  position: Vector3,
  sourceId?: string
): LightRay {
  const state = fromLightPacket(packet);
  const direction = DIRECTION_TO_VECTOR[packet.direction];
  const basis = PolarizationBasis.fromPropagation(direction);

  return {
    id: generateRayId('legacy'),
    sourceId: sourceId ?? 'legacy',
    position,
    direction,
    state,
    basis,
    pathLength: 0,
    wavelength: 550e-9,
    bounceCount: 0,
    active: true
  };
}

/**
 * Create a LightRay from legacy WaveLight
 */
export function rayFromWaveLight(
  wave: LegacyWaveLight,
  position: Vector3
): LightRay {
  const state = fromWaveLight(wave);
  const direction = DIRECTION_TO_VECTOR[wave.direction];
  const basis = PolarizationBasis.fromPropagation(direction);

  return {
    id: generateRayId('wave'),
    sourceId: wave.sourceId,
    position,
    direction,
    state,
    basis,
    pathLength: 0,
    wavelength: 550e-9,
    bounceCount: 0,
    active: true
  };
}

// ========== Block Position Adapter ==========

/**
 * Convert legacy block position to Vector3
 */
export function positionFromBlock(
  x: number,
  y: number,
  z: number
): Vector3 {
  return new Vector3(x, y, z);
}

/**
 * Convert Vector3 to legacy block position
 */
export function blockFromPosition(
  pos: Vector3
): { x: number; y: number; z: number } {
  return {
    x: Math.round(pos.x),
    y: Math.round(pos.y),
    z: Math.round(pos.z)
  };
}

// ========== Intensity Conversions ==========

/**
 * Convert legacy discrete intensity (0-15) to normalized (0-1)
 */
export function normalizeIntensity(legacyIntensity: number): number {
  return Math.max(0, Math.min(1, legacyIntensity / 15));
}

/**
 * Convert normalized intensity (0-1) to legacy discrete (0-15)
 */
export function discretizeIntensity(normalizedIntensity: number): number {
  return Math.round(Math.max(0, Math.min(15, normalizedIntensity * 15)));
}

// ========== Angle Conversions ==========

/**
 * Convert legacy discrete polarization (0,45,90,135) to radians
 */
export function discreteToRadians(angle: LegacyPolarization): number {
  return angle * Math.PI / 180;
}

/**
 * Convert continuous angle (radians) to legacy discrete (degrees)
 */
export function radiansToDiscrete(radians: number): LegacyPolarization {
  const degrees = radians * 180 / Math.PI;
  const normalized = ((degrees % 180) + 180) % 180;
  const quantized = Math.round(normalized / 45) * 45;
  return (quantized % 180) as LegacyPolarization;
}

// ========== Direction Exports ==========

export { DIRECTION_TO_VECTOR, vectorToDirection };
