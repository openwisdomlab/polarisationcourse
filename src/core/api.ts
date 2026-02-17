/**
 * Unified Physics API Facade (统一物理 API 外观层)
 *
 * A thin, ergonomic API over the unified physics engine.
 * Routes all calculations through the CoherencyMatrix-based system
 * regardless of mode ('game' for legacy-compatible, 'science' for full fidelity).
 *
 * Usage:
 * ```ts
 * import { createPhysicsAPI } from '@/core/api';
 *
 * const physics = createPhysicsAPI('game');
 * const source = physics.createLinearSource(45, 1.0);
 * const after = physics.applyPolarizer(source, 0);
 * console.log(after.intensity); // ~0.5 (Malus's Law)
 * ```
 */

import { Vector3 } from './math/Vector3';
import {
  CoherencyMatrix,
  PolarizationBasis,
  PolarizationState,
  IdealPolarizer,
  WavePlate,
  OpticalRotator,
  IdealMirror,
  Attenuator,
  PolarizingBeamSplitter,
  fromLightPacket,
  toLightPacket,
  DIRECTION_TO_VECTOR,
  type LegacyLightPacket,
  type LegacyDirection,
  type StokesRepresentation,
  type JonesRepresentation,
} from './physics/unified';

// ========== Public Types ==========

/** Physics fidelity mode */
export type PhysicsMode = 'game' | 'science';

/** Polarization type classification */
export type PolarizationType = 'linear' | 'circular' | 'elliptical' | 'unpolarized';

/** Handedness for circular/elliptical polarization */
export type PolarizationHandedness = 'right' | 'left' | 'none';

/**
 * Opaque polarization state — the single currency exchanged between all API methods.
 * Internal CoherencyMatrix is hidden behind a WeakMap; consumers only see read-only getters.
 */
export interface PolarizationInfo {
  /** Total intensity (0-1 normalized) */
  readonly intensity: number;
  /** Polarization angle in degrees [0, 180) — meaningful for linear/elliptical */
  readonly angleDeg: number;
  /** Degree of polarization [0, 1] */
  readonly degreeOfPolarization: number;
  /** Classification of the polarization state */
  readonly polarizationType: PolarizationType;
  /** Handedness (right/left/none) */
  readonly handedness: PolarizationHandedness;
}

/**
 * The public physics API surface.
 */
export interface PhysicsAPI {
  /** Current mode */
  readonly mode: PhysicsMode;

  // --- Source creation ---
  createLinearSource(angleDeg: number, intensity?: number): PolarizationInfo;
  createCircularSource(rightHanded: boolean, intensity?: number): PolarizationInfo;
  createUnpolarizedSource(intensity?: number): PolarizationInfo;

  // --- Component interactions ---
  applyPolarizer(state: PolarizationInfo, axisDeg: number): PolarizationInfo;
  applyWavePlate(state: PolarizationInfo, retardationDeg: number, fastAxisDeg: number): PolarizationInfo;
  applyRotator(state: PolarizationInfo, angleDeg: number): PolarizationInfo;
  applyMirror(state: PolarizationInfo): PolarizationInfo;
  applyAttenuation(state: PolarizationInfo, factor: number): PolarizationInfo;
  applyPBS(state: PolarizationInfo): [PolarizationInfo, PolarizationInfo];

  // --- Analysis / conversion ---
  toStokes(state: PolarizationInfo): StokesRepresentation;
  toJones(state: PolarizationInfo): JonesRepresentation | null;
  toLegacyPacket(state: PolarizationInfo, direction: LegacyDirection): LegacyLightPacket;
  fromLegacyPacket(packet: LegacyLightPacket): PolarizationInfo;
}

// Re-export types consumers may need
export type { StokesRepresentation, JonesRepresentation, LegacyLightPacket, LegacyDirection };

// ========== Internal Helpers ==========

/**
 * WeakMap storing internal CoherencyMatrix for each PolarizationInfo.
 * This keeps the internal representation hidden from public API consumers.
 */
const coherencyMap = new WeakMap<PolarizationInfo, CoherencyMatrix>();

/**
 * Retrieve the internal CoherencyMatrix for a PolarizationInfo.
 * Throws if the PolarizationInfo was not created by this API.
 */
function getCoherency(info: PolarizationInfo): CoherencyMatrix {
  const cm = coherencyMap.get(info);
  if (!cm) {
    throw new Error('PolarizationInfo was not created by the Physics API');
  }
  return cm;
}

/** Default basis: light propagating along +Z, s along X, p along Y */
const DEFAULT_BASIS = PolarizationBasis.fromPropagation(Vector3.Z);

/** Default surface position/normal for element construction */
const ORIGIN = Vector3.ZERO;
const NORMAL = new Vector3(0, 0, -1); // facing the incoming +Z light

/**
 * Convert a CoherencyMatrix into the public PolarizationInfo.
 * Stores the CoherencyMatrix in the WeakMap for later retrieval.
 */
function coherencyToInfo(cm: CoherencyMatrix): PolarizationInfo {
  const ps = PolarizationState.fromCoherency(cm);
  const stokes = ps.stokes;

  // Classify polarization type
  let polarizationType: PolarizationType;
  let handedness: PolarizationHandedness = 'none';

  if (ps.isUnpolarized) {
    polarizationType = 'unpolarized';
  } else if (ps.isLinear) {
    polarizationType = 'linear';
  } else if (ps.isCircular) {
    polarizationType = 'circular';
    handedness = stokes.s3 > 0 ? 'right' : 'left';
  } else {
    polarizationType = 'elliptical';
    handedness = stokes.s3 > 0 ? 'right' : stokes.s3 < 0 ? 'left' : 'none';
  }

  const info: PolarizationInfo = {
    intensity: ps.intensity,
    angleDeg: ps.ellipse.orientationDeg,
    degreeOfPolarization: ps.dop,
    polarizationType,
    handedness,
  };
  coherencyMap.set(info, cm);
  return info;
}

/**
 * Build a transmission-axis Vector3 from an angle in degrees.
 * The axis lies in the X-Y plane (perpendicular to Z propagation).
 */
function axisFromDeg(deg: number): Vector3 {
  const rad = deg * Math.PI / 180;
  return new Vector3(Math.cos(rad), Math.sin(rad), 0);
}

// ========== Factory ==========

/**
 * Create a PhysicsAPI instance.
 *
 * Both modes use the full unified engine internally.
 * 'game' mode exists to signal intent — future optimizations
 * (e.g., caching, reduced precision) could be gated on this.
 */
export function createPhysicsAPI(mode: PhysicsMode = 'science'): PhysicsAPI {
  return {
    mode,

    // --- Source creation ---

    createLinearSource(angleDeg: number, intensity: number = 1.0): PolarizationInfo {
      const cm = CoherencyMatrix.createLinear(intensity, angleDeg * Math.PI / 180);
      return coherencyToInfo(cm);
    },

    createCircularSource(rightHanded: boolean, intensity: number = 1.0): PolarizationInfo {
      const cm = CoherencyMatrix.createCircular(intensity, rightHanded);
      return coherencyToInfo(cm);
    },

    createUnpolarizedSource(intensity: number = 1.0): PolarizationInfo {
      const cm = CoherencyMatrix.createUnpolarized(intensity);
      return coherencyToInfo(cm);
    },

    // --- Component interactions ---

    applyPolarizer(state: PolarizationInfo, axisDeg: number): PolarizationInfo {
      const polarizer = new IdealPolarizer('pol', ORIGIN, NORMAL, axisFromDeg(axisDeg));
      const result = polarizer.interact(getCoherency(state), DEFAULT_BASIS);
      if (!result.hasOutput || !result.transmitted) {
        return coherencyToInfo(CoherencyMatrix.ZERO);
      }
      return coherencyToInfo(result.transmitted.matrix);
    },

    applyWavePlate(state: PolarizationInfo, retardationDeg: number, fastAxisDeg: number): PolarizationInfo {
      const retardanceRad = retardationDeg * Math.PI / 180;
      const wp = new WavePlate('wp', ORIGIN, NORMAL, axisFromDeg(fastAxisDeg), retardanceRad);
      const result = wp.interact(getCoherency(state), DEFAULT_BASIS);
      if (!result.hasOutput || !result.transmitted) {
        return coherencyToInfo(CoherencyMatrix.ZERO);
      }
      return coherencyToInfo(result.transmitted.matrix);
    },

    applyRotator(state: PolarizationInfo, angleDeg: number): PolarizationInfo {
      const rotator = new OpticalRotator('rot', ORIGIN, NORMAL, angleDeg * Math.PI / 180);
      const result = rotator.interact(getCoherency(state), DEFAULT_BASIS);
      if (!result.hasOutput || !result.transmitted) {
        return coherencyToInfo(CoherencyMatrix.ZERO);
      }
      return coherencyToInfo(result.transmitted.matrix);
    },

    applyMirror(state: PolarizationInfo): PolarizationInfo {
      const mirror = new IdealMirror('mirror', ORIGIN, NORMAL);
      const result = mirror.interact(getCoherency(state), DEFAULT_BASIS);
      if (!result.hasOutput || !result.reflected) {
        return coherencyToInfo(CoherencyMatrix.ZERO);
      }
      return coherencyToInfo(result.reflected.matrix);
    },

    applyAttenuation(state: PolarizationInfo, factor: number): PolarizationInfo {
      const attenuator = new Attenuator('att', ORIGIN, NORMAL, factor);
      const result = attenuator.interact(getCoherency(state), DEFAULT_BASIS);
      if (!result.hasOutput || !result.transmitted) {
        return coherencyToInfo(CoherencyMatrix.ZERO);
      }
      return coherencyToInfo(result.transmitted.matrix);
    },

    applyPBS(state: PolarizationInfo): [PolarizationInfo, PolarizationInfo] {
      const pbs = new PolarizingBeamSplitter('pbs', ORIGIN, NORMAL);
      const result = pbs.interact(getCoherency(state), DEFAULT_BASIS);
      const transmitted = result.transmitted
        ? coherencyToInfo(result.transmitted.matrix)
        : coherencyToInfo(CoherencyMatrix.ZERO);
      const reflected = result.reflected
        ? coherencyToInfo(result.reflected.matrix)
        : coherencyToInfo(CoherencyMatrix.ZERO);
      return [transmitted, reflected];
    },

    // --- Analysis / conversion ---

    toStokes(state: PolarizationInfo): StokesRepresentation {
      return PolarizationState.fromCoherency(getCoherency(state)).stokes;
    },

    toJones(state: PolarizationInfo): JonesRepresentation | null {
      return PolarizationState.fromCoherency(getCoherency(state)).jones;
    },

    toLegacyPacket(state: PolarizationInfo, direction: LegacyDirection): LegacyLightPacket {
      const dirVec = DIRECTION_TO_VECTOR[direction];
      return toLightPacket(getCoherency(state), dirVec);
    },

    fromLegacyPacket(packet: LegacyLightPacket): PolarizationInfo {
      const cm = fromLightPacket(packet);
      return coherencyToInfo(cm);
    },
  };
}
