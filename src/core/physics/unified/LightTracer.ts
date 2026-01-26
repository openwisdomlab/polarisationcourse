/**
 * Light Ray Tracer (光线追踪引擎)
 *
 * The core simulation engine that traces light rays through optical scenes.
 * Handles:
 * - Ray-surface intersection
 * - Surface interactions (reflection, transmission, polarization changes)
 * - Ray splitting (at beam splitters, birefringent elements)
 * - Energy conservation and termination conditions
 *
 * Key features:
 * - Basis consistency: maintains proper s-p basis through all interactions
 * - Numerical stability: handles edge cases (normal incidence, TIR, zero intensity)
 * - Performance: BFS-based iteration to prevent stack overflow
 */

import { Vector3 } from '../../math/Vector3';
import { CoherencyMatrix } from './CoherencyMatrix';
import { PolarizationBasis } from './PolarizationBasis';
import { OpticalSurface } from './OpticalSurface';
import {
  LightRay,
  createChildRay,
  advanceRay,
  isRayValid
} from './LightSource';

// ========== Configuration ==========

export interface TracerConfig {
  /** Maximum number of iterations (prevents infinite loops) */
  maxIterations: number;

  /** Maximum bounces per ray */
  maxBounces: number;

  /** Minimum intensity threshold */
  intensityThreshold: number;

  /** Step size for ray marching (scene units) */
  stepSize: number;

  /** Scene boundary (box from -bound to +bound on each axis) */
  sceneBoundary: number;
}

const DEFAULT_CONFIG: TracerConfig = {
  maxIterations: 10000,
  maxBounces: 50,
  intensityThreshold: 1e-6,
  stepSize: 0.1,
  sceneBoundary: 1000
};

// ========== Tracer Types ==========

/**
 * Result of a completed ray trace
 */
export interface TraceResult {
  /** All ray segments generated during tracing */
  segments: RaySegment[];

  /** Final states at sensors/detectors */
  detections: Detection[];

  /** Total iterations used */
  iterations: number;

  /** Whether max iterations was reached */
  completed: boolean;
}

/**
 * A segment of a light ray path
 */
export interface RaySegment {
  /** Starting position */
  start: Vector3;

  /** Ending position */
  end: Vector3;

  /** Propagation direction */
  direction: Vector3;

  /** Intensity at start */
  intensity: number;

  /** Polarization state at start */
  state: CoherencyMatrix;

  /** Source ray ID */
  rayId: string;

  /** Source identifier */
  sourceId: string;
}

/**
 * Detection at a sensor
 */
export interface Detection {
  /** Sensor/detector ID */
  sensorId: string;

  /** Position of detection */
  position: Vector3;

  /** Incoming direction */
  direction: Vector3;

  /** Detected coherency matrix */
  state: CoherencyMatrix;

  /** Accumulated path length */
  pathLength: number;

  /** Ray ID that was detected */
  rayId: string;

  /** Source identifier */
  sourceId: string;
}

/**
 * Scene geometry for collision detection
 */
export interface SceneGeometry {
  /** Optical surfaces in the scene */
  surfaces: OpticalSurface[];

  /** Check if a point is inside any surface's collision volume */
  intersect(
    rayOrigin: Vector3,
    rayDirection: Vector3,
    maxDistance: number
  ): SurfaceIntersection | null;
}

/**
 * Result of ray-surface intersection
 */
export interface SurfaceIntersection {
  /** Surface that was hit */
  surface: OpticalSurface;

  /** Distance from ray origin to intersection */
  distance: number;

  /** Point of intersection */
  point: Vector3;

  /** Surface normal at intersection point */
  normal: Vector3;
}

// ========== Simple Scene Implementation ==========

/**
 * Simple scene with sphere-based collision for optical elements
 */
export class SimpleScene implements SceneGeometry {
  surfaces: OpticalSurface[];

  /** Collision radius for each surface */
  private collisionRadius: number;

  constructor(surfaces: OpticalSurface[], collisionRadius: number = 0.5) {
    this.surfaces = surfaces;
    this.collisionRadius = collisionRadius;
  }

  intersect(
    rayOrigin: Vector3,
    rayDirection: Vector3,
    maxDistance: number
  ): SurfaceIntersection | null {
    let closest: SurfaceIntersection | null = null;

    for (const surface of this.surfaces) {
      const intersection = this.raySphereIntersect(
        rayOrigin,
        rayDirection,
        surface.position,
        this.collisionRadius
      );

      if (intersection !== null && intersection < maxDistance) {
        if (closest === null || intersection < closest.distance) {
          const point = rayOrigin.add(rayDirection.scale(intersection));
          closest = {
            surface,
            distance: intersection,
            point,
            normal: surface.normal
          };
        }
      }
    }

    return closest;
  }

  /**
   * Ray-sphere intersection test
   * Returns distance to intersection or null if no hit
   */
  private raySphereIntersect(
    origin: Vector3,
    direction: Vector3,
    center: Vector3,
    radius: number
  ): number | null {
    const oc = origin.sub(center);
    const a = direction.dot(direction);
    const b = 2 * oc.dot(direction);
    const c = oc.dot(oc) - radius * radius;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      return null;
    }

    const sqrtD = Math.sqrt(discriminant);
    let t = (-b - sqrtD) / (2 * a);

    if (t < 0.001) {
      t = (-b + sqrtD) / (2 * a);
    }

    if (t < 0.001) {
      return null;
    }

    return t;
  }
}

// ========== Light Tracer ==========

export class LightTracer {
  private config: TracerConfig;

  constructor(config: Partial<TracerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Trace light rays through a scene
   *
   * @param rays Initial rays to trace
   * @param scene Scene geometry
   * @returns Complete trace results
   */
  trace(rays: LightRay[], scene: SceneGeometry): TraceResult {
    const segments: RaySegment[] = [];
    const detections: Detection[] = [];

    // Ray queue for BFS traversal
    const queue: LightRay[] = [...rays];

    let iterations = 0;

    while (queue.length > 0 && iterations < this.config.maxIterations) {
      iterations++;

      const ray = queue.shift()!;

      // Skip invalid rays
      if (!isRayValid(ray, this.config.intensityThreshold)) {
        ray.active = false;
        continue;
      }

      // Check bounce limit
      if (ray.bounceCount >= this.config.maxBounces) {
        ray.active = false;
        continue;
      }

      // Find next surface intersection
      const intersection = scene.intersect(
        ray.position,
        ray.direction,
        this.config.sceneBoundary
      );

      if (intersection === null) {
        // Ray escapes scene
        ray.active = false;

        // Record final segment to boundary
        const endPos = ray.position.add(
          ray.direction.scale(this.config.sceneBoundary)
        );
        segments.push({
          start: ray.position,
          end: endPos,
          direction: ray.direction,
          intensity: ray.state.intensity,
          state: ray.state,
          rayId: ray.id,
          sourceId: ray.sourceId
        });
        continue;
      }

      // Record segment to intersection
      segments.push({
        start: ray.position,
        end: intersection.point,
        direction: ray.direction,
        intensity: ray.state.intensity,
        state: ray.state,
        rayId: ray.id,
        sourceId: ray.sourceId
      });

      // Move ray to intersection point
      ray.position = intersection.point;
      ray.pathLength += intersection.distance;

      // Transform to surface s-p basis for interaction
      const surfaceBasis = PolarizationBasis.computeInterfaceBasis(
        ray.direction,
        intersection.normal
      );

      // Transform coherency matrix to surface basis
      const transformedState = ray.basis.transformCoherency(ray.state, surfaceBasis);

      // Interact with surface
      const result = intersection.surface.interact(transformedState, surfaceBasis);

      if (!result.hasOutput) {
        // Light absorbed
        ray.active = false;
        continue;
      }

      // Handle transmitted light
      if (result.transmitted) {
        const transRay = createChildRay(
          ray,
          result.transmitted.direction,
          result.transmitted.matrix,
          result.transmitted.basis
        );

        // Slightly advance to avoid self-intersection
        advanceRay(transRay, 0.001);
        queue.push(transRay);
      }

      // Handle reflected light
      if (result.reflected) {
        const reflRay = createChildRay(
          ray,
          result.reflected.direction,
          result.reflected.matrix,
          result.reflected.basis
        );

        // Slightly advance to avoid self-intersection
        advanceRay(reflRay, 0.001);
        queue.push(reflRay);
      }

      // Deactivate original ray
      ray.active = false;
    }

    return {
      segments,
      detections,
      iterations,
      completed: queue.length === 0
    };
  }

  /**
   * Simple trace for a single ray through a linear sequence of elements
   * Useful for demos and simple optical paths
   */
  traceLinear(
    ray: LightRay,
    elements: OpticalSurface[]
  ): { states: CoherencyMatrix[]; finalRay: LightRay } {
    const states: CoherencyMatrix[] = [ray.state.clone()];
    let currentRay = { ...ray };

    for (const element of elements) {
      // Compute basis at element
      const basis = PolarizationBasis.computeInterfaceBasis(
        currentRay.direction,
        element.normal
      );

      // Transform to element basis
      const inputState = currentRay.basis.transformCoherency(
        currentRay.state,
        basis
      );

      // Interact with element
      const result = element.interact(inputState, basis);

      if (!result.hasOutput || !result.transmitted) {
        // Ray blocked
        states.push(CoherencyMatrix.ZERO);
        currentRay.state = CoherencyMatrix.ZERO;
        currentRay.active = false;
        break;
      }

      // Update ray state
      currentRay.state = result.transmitted.matrix;
      currentRay.basis = result.transmitted.basis;
      currentRay.direction = result.transmitted.direction;
      currentRay.bounceCount++;

      states.push(currentRay.state.clone());
    }

    return { states, finalRay: currentRay as LightRay };
  }

  /**
   * Update configuration
   */
  configure(updates: Partial<TracerConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Get current configuration
   */
  getConfig(): TracerConfig {
    return { ...this.config };
  }
}

// ========== Convenience Functions ==========

/**
 * Create a tracer with default configuration
 */
export function createTracer(config?: Partial<TracerConfig>): LightTracer {
  return new LightTracer(config);
}

/**
 * Simple linear trace (no scene, just element sequence)
 */
export function traceThrough(
  initialState: CoherencyMatrix,
  direction: Vector3,
  elements: OpticalSurface[]
): CoherencyMatrix {
  let state = initialState;
  let basis = PolarizationBasis.fromPropagation(direction);

  for (const element of elements) {
    const surfaceBasis = PolarizationBasis.computeInterfaceBasis(
      direction,
      element.normal
    );

    const transformed = basis.transformCoherency(state, surfaceBasis);
    const result = element.interact(transformed, surfaceBasis);

    if (!result.hasOutput || !result.transmitted) {
      return CoherencyMatrix.ZERO;
    }

    state = result.transmitted.matrix;
    basis = result.transmitted.basis;
    direction = result.transmitted.direction;
  }

  return state;
}
