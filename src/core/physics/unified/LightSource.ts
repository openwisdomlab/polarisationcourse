/**
 * Light Source Definitions (光源定义)
 *
 * Defines various types of light sources with their polarization states.
 * All sources produce LightRay objects that can be traced through the scene.
 */

import { Vector3 } from '../../math/Vector3';
import { CoherencyMatrix } from './CoherencyMatrix';
import { PolarizationBasis } from './PolarizationBasis';

/**
 * A ray of light with position, direction, polarization state, and metadata
 */
export interface LightRay {
  /** Unique identifier for this ray (for tracking through splits) */
  id: string;

  /** Source identifier (for coherence grouping) */
  sourceId: string;

  /** Current position in 3D space */
  position: Vector3;

  /** Propagation direction (unit vector) */
  direction: Vector3;

  /** Polarization state as coherency matrix */
  state: CoherencyMatrix;

  /** Current polarization basis */
  basis: PolarizationBasis;

  /** Accumulated optical path length (for phase/interference) */
  pathLength: number;

  /** Wavelength in meters (for dispersion) */
  wavelength: number;

  /** Number of surface interactions */
  bounceCount: number;

  /** Parent ray ID (for split tracking) */
  parentId?: string;

  /** Whether this ray is still active */
  active: boolean;
}

/**
 * Configuration for a light source
 */
export interface LightSourceConfig {
  /** Unique identifier */
  id: string;

  /** Position in 3D space */
  position: Vector3;

  /** Emission direction */
  direction: Vector3;

  /** Total intensity (power) */
  intensity: number;

  /** Wavelength in nanometers (default: 550nm, green) */
  wavelengthNm?: number;
}

// Default wavelength: 550nm (green, middle of visible spectrum)
const DEFAULT_WAVELENGTH_NM = 550;

// Convert nm to meters
function nmToMeters(nm: number): number {
  return nm * 1e-9;
}

/**
 * Generate unique ray ID
 */
let rayIdCounter = 0;
export function generateRayId(prefix: string = 'ray'): string {
  return `${prefix}_${++rayIdCounter}`;
}

/**
 * Reset ray ID counter (for testing)
 */
export function resetRayIdCounter(): void {
  rayIdCounter = 0;
}

// ========== Light Source Factory ==========

/**
 * Create a linearly polarized light source
 *
 * @param config Source configuration
 * @param polarizationAngle Angle of polarization from horizontal (radians)
 */
export function createLinearSource(
  config: LightSourceConfig,
  polarizationAngle: number
): LightRay {
  const direction = config.direction.normalize();
  const wavelength = nmToMeters(config.wavelengthNm ?? DEFAULT_WAVELENGTH_NM);

  // Create polarization state
  const state = CoherencyMatrix.createLinear(config.intensity, polarizationAngle);

  // Create basis from propagation direction
  const basis = PolarizationBasis.fromPropagation(direction);

  return {
    id: generateRayId('lin'),
    sourceId: config.id,
    position: config.position,
    direction,
    state,
    basis,
    pathLength: 0,
    wavelength,
    bounceCount: 0,
    active: true
  };
}

/**
 * Create an unpolarized light source (natural light)
 */
export function createUnpolarizedSource(config: LightSourceConfig): LightRay {
  const direction = config.direction.normalize();
  const wavelength = nmToMeters(config.wavelengthNm ?? DEFAULT_WAVELENGTH_NM);

  const state = CoherencyMatrix.createUnpolarized(config.intensity);
  const basis = PolarizationBasis.fromPropagation(direction);

  return {
    id: generateRayId('unp'),
    sourceId: config.id,
    position: config.position,
    direction,
    state,
    basis,
    pathLength: 0,
    wavelength,
    bounceCount: 0,
    active: true
  };
}

/**
 * Create a circularly polarized light source
 *
 * @param config Source configuration
 * @param rightHanded True for right-circular, false for left-circular
 */
export function createCircularSource(
  config: LightSourceConfig,
  rightHanded: boolean
): LightRay {
  const direction = config.direction.normalize();
  const wavelength = nmToMeters(config.wavelengthNm ?? DEFAULT_WAVELENGTH_NM);

  const state = CoherencyMatrix.createCircular(config.intensity, rightHanded);
  const basis = PolarizationBasis.fromPropagation(direction);

  return {
    id: generateRayId('circ'),
    sourceId: config.id,
    position: config.position,
    direction,
    state,
    basis,
    pathLength: 0,
    wavelength,
    bounceCount: 0,
    active: true
  };
}

/**
 * Create an elliptically polarized light source
 */
export function createEllipticalSource(
  config: LightSourceConfig,
  orientation: number,
  ellipticity: number
): LightRay {
  const direction = config.direction.normalize();
  const wavelength = nmToMeters(config.wavelengthNm ?? DEFAULT_WAVELENGTH_NM);

  const state = CoherencyMatrix.createElliptical(
    config.intensity,
    orientation,
    ellipticity
  );
  const basis = PolarizationBasis.fromPropagation(direction);

  return {
    id: generateRayId('ell'),
    sourceId: config.id,
    position: config.position,
    direction,
    state,
    basis,
    pathLength: 0,
    wavelength,
    bounceCount: 0,
    active: true
  };
}

/**
 * Create a partially polarized light source
 */
export function createPartiallyPolarizedSource(
  config: LightSourceConfig,
  degreeOfPolarization: number,
  polarizationAngle: number
): LightRay {
  const direction = config.direction.normalize();
  const wavelength = nmToMeters(config.wavelengthNm ?? DEFAULT_WAVELENGTH_NM);

  const state = CoherencyMatrix.createPartiallyPolarized(
    config.intensity,
    degreeOfPolarization,
    polarizationAngle
  );
  const basis = PolarizationBasis.fromPropagation(direction);

  return {
    id: generateRayId('part'),
    sourceId: config.id,
    position: config.position,
    direction,
    state,
    basis,
    pathLength: 0,
    wavelength,
    bounceCount: 0,
    active: true
  };
}

// ========== Standard Sources (convenience) ==========

/**
 * Create horizontal linearly polarized source (0°)
 */
export function createHorizontalSource(config: LightSourceConfig): LightRay {
  return createLinearSource(config, 0);
}

/**
 * Create vertical linearly polarized source (90°)
 */
export function createVerticalSource(config: LightSourceConfig): LightRay {
  return createLinearSource(config, Math.PI / 2);
}

/**
 * Create diagonal (+45°) linearly polarized source
 */
export function createDiagonalSource(config: LightSourceConfig): LightRay {
  return createLinearSource(config, Math.PI / 4);
}

/**
 * Create anti-diagonal (-45°) linearly polarized source
 */
export function createAntiDiagonalSource(config: LightSourceConfig): LightRay {
  return createLinearSource(config, -Math.PI / 4);
}

/**
 * Create right-circular polarized source
 */
export function createRCPSource(config: LightSourceConfig): LightRay {
  return createCircularSource(config, true);
}

/**
 * Create left-circular polarized source
 */
export function createLCPSource(config: LightSourceConfig): LightRay {
  return createCircularSource(config, false);
}

// ========== Ray Utilities ==========

/**
 * Clone a ray with new properties
 */
export function cloneRay(ray: LightRay, updates: Partial<LightRay> = {}): LightRay {
  return {
    ...ray,
    id: generateRayId('clone'),
    ...updates
  };
}

/**
 * Create a child ray (from splitting)
 */
export function createChildRay(
  parent: LightRay,
  direction: Vector3,
  state: CoherencyMatrix,
  basis: PolarizationBasis
): LightRay {
  return {
    id: generateRayId('child'),
    sourceId: parent.sourceId,
    position: parent.position,
    direction,
    state,
    basis,
    pathLength: parent.pathLength,
    wavelength: parent.wavelength,
    bounceCount: parent.bounceCount + 1,
    parentId: parent.id,
    active: true
  };
}

/**
 * Advance a ray by a distance along its direction
 */
export function advanceRay(ray: LightRay, distance: number): void {
  ray.position = ray.position.add(ray.direction.scale(distance));
  ray.pathLength += distance;
}

/**
 * Check if a ray is still valid (above intensity threshold)
 */
export function isRayValid(ray: LightRay, threshold: number = 1e-6): boolean {
  return ray.active && ray.state.intensity > threshold;
}
