/**
 * Victory System (胜利判定系统)
 *
 * Handles win condition checking for the puzzle game.
 * Maps physics engine results to game logic for sensor activation.
 */

import { Vector3 } from '../../math/Vector3';
import { CoherencyMatrix } from './CoherencyMatrix';
import { LightRay } from './LightSource';

// ========== Target Configuration ==========

/**
 * Configuration for a sensor/target that light must reach
 */
export interface TargetConfig {
  /** Unique identifier */
  id: string;

  /** Position in world space */
  position: Vector3;

  /** Expected polarization direction (radians, in lab frame) */
  polarizationAxis: number;

  /** Angular tolerance for polarization matching (radians) */
  polarizationTolerance: number;

  /** Minimum required intensity (0-1 normalized) */
  minIntensity: number;

  /** Whether partially polarized light is acceptable */
  requireFullPolarization: boolean;

  /** Minimum degree of polarization required (0-1) */
  minDoP: number;
}

/**
 * Default target configuration
 */
export const DEFAULT_TARGET: Omit<TargetConfig, 'id' | 'position' | 'polarizationAxis'> = {
  polarizationTolerance: Math.PI / 12, // 15 degrees
  minIntensity: 0.1,
  requireFullPolarization: true,
  minDoP: 0.9
};

// ========== Victory Check Results ==========

/**
 * Result of checking a single target
 */
export interface TargetCheckResult {
  /** Target ID */
  targetId: string;

  /** Whether this target is satisfied */
  satisfied: boolean;

  /** Actual intensity received */
  receivedIntensity: number;

  /** Actual polarization angle (radians) */
  receivedPolarization: number;

  /** Actual degree of polarization */
  receivedDoP: number;

  /** Detailed failure reasons (if any) */
  failureReasons: string[];
}

/**
 * Overall victory check result
 */
export interface VictoryCheckResult {
  /** Whether all targets are satisfied (victory!) */
  victory: boolean;

  /** Results for each individual target */
  targetResults: TargetCheckResult[];

  /** Number of satisfied targets */
  satisfiedCount: number;

  /** Total number of targets */
  totalCount: number;
}

// ========== Victory System ==========

export class VictorySystem {
  /**
   * Check if a single light ray satisfies a target
   */
  checkTarget(
    ray: LightRay,
    target: TargetConfig
  ): TargetCheckResult {
    const state = ray.state;
    const failureReasons: string[] = [];

    // Get physical properties
    const intensity = state.intensity;
    const dop = state.degreeOfPolarization;
    const polarAngle = state.orientationAngle;

    // Check 1: Intensity threshold
    const intensitySatisfied = intensity >= target.minIntensity;
    if (!intensitySatisfied) {
      failureReasons.push(
        `Intensity ${intensity.toFixed(3)} < required ${target.minIntensity.toFixed(3)}`
      );
    }

    // Check 2: Degree of polarization
    let dopSatisfied = true;
    if (target.requireFullPolarization) {
      dopSatisfied = dop >= target.minDoP;
      if (!dopSatisfied) {
        failureReasons.push(
          `DoP ${dop.toFixed(3)} < required ${target.minDoP.toFixed(3)}`
        );
      }
    }

    // Check 3: Polarization direction (only meaningful for polarized light)
    let polarizationSatisfied = true;
    if (dop > 0.1) { // Only check if there's significant polarization
      const angleDiff = normalizeAngle(polarAngle - target.polarizationAxis);
      const absAngleDiff = Math.min(Math.abs(angleDiff), Math.PI - Math.abs(angleDiff));
      polarizationSatisfied = absAngleDiff <= target.polarizationTolerance;

      if (!polarizationSatisfied) {
        failureReasons.push(
          `Polarization angle ${(polarAngle * 180 / Math.PI).toFixed(1)}° differs from ` +
          `required ${(target.polarizationAxis * 180 / Math.PI).toFixed(1)}° by ` +
          `${(absAngleDiff * 180 / Math.PI).toFixed(1)}° (tolerance: ` +
          `${(target.polarizationTolerance * 180 / Math.PI).toFixed(1)}°)`
        );
      }
    }

    const satisfied = intensitySatisfied && dopSatisfied && polarizationSatisfied;

    return {
      targetId: target.id,
      satisfied,
      receivedIntensity: intensity,
      receivedPolarization: polarAngle,
      receivedDoP: dop,
      failureReasons
    };
  }

  /**
   * Check victory condition from a coherency matrix directly
   */
  checkCoherency(
    state: CoherencyMatrix,
    target: TargetConfig
  ): TargetCheckResult {
    const failureReasons: string[] = [];

    const intensity = state.intensity;
    const dop = state.degreeOfPolarization;
    const polarAngle = state.orientationAngle;

    // Check 1: Intensity
    const intensitySatisfied = intensity >= target.minIntensity;
    if (!intensitySatisfied) {
      failureReasons.push(`Intensity too low: ${intensity.toFixed(3)}`);
    }

    // Check 2: DoP
    let dopSatisfied = true;
    if (target.requireFullPolarization) {
      dopSatisfied = dop >= target.minDoP;
      if (!dopSatisfied) {
        failureReasons.push(`Light not fully polarized: DoP = ${dop.toFixed(3)}`);
      }
    }

    // Check 3: Polarization angle
    let polarizationSatisfied = true;
    if (dop > 0.1) {
      const angleDiff = normalizeAngle(polarAngle - target.polarizationAxis);
      const absAngleDiff = Math.min(Math.abs(angleDiff), Math.PI - Math.abs(angleDiff));
      polarizationSatisfied = absAngleDiff <= target.polarizationTolerance;

      if (!polarizationSatisfied) {
        failureReasons.push(
          `Polarization misaligned: ${(absAngleDiff * 180 / Math.PI).toFixed(1)}° off`
        );
      }
    }

    return {
      targetId: target.id,
      satisfied: intensitySatisfied && dopSatisfied && polarizationSatisfied,
      receivedIntensity: intensity,
      receivedPolarization: polarAngle,
      receivedDoP: dop,
      failureReasons
    };
  }

  /**
   * Check multiple targets at once
   */
  checkAllTargets(
    raysByTarget: Map<string, LightRay>,
    targets: TargetConfig[]
  ): VictoryCheckResult {
    const targetResults: TargetCheckResult[] = [];
    let satisfiedCount = 0;

    for (const target of targets) {
      const ray = raysByTarget.get(target.id);

      if (!ray) {
        // No light reached this target
        targetResults.push({
          targetId: target.id,
          satisfied: false,
          receivedIntensity: 0,
          receivedPolarization: 0,
          receivedDoP: 0,
          failureReasons: ['No light reached this sensor']
        });
        continue;
      }

      const result = this.checkTarget(ray, target);
      targetResults.push(result);
      if (result.satisfied) satisfiedCount++;
    }

    return {
      victory: satisfiedCount === targets.length,
      targetResults,
      satisfiedCount,
      totalCount: targets.length
    };
  }
}

// ========== Utilities ==========

/**
 * Normalize angle to [-π, π]
 */
function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

/**
 * Create a target with default settings
 */
export function createTarget(
  id: string,
  position: Vector3,
  polarizationAngle: number,
  options: Partial<TargetConfig> = {}
): TargetConfig {
  return {
    id,
    position,
    polarizationAxis: polarizationAngle,
    ...DEFAULT_TARGET,
    ...options
  };
}

/**
 * Convert legacy game sensor to target config
 */
export function targetFromLegacy(
  id: string,
  position: { x: number; y: number; z: number },
  polarizationDegrees: number,
  requiredIntensity: number
): TargetConfig {
  return createTarget(
    id,
    new Vector3(position.x, position.y, position.z),
    polarizationDegrees * Math.PI / 180,
    {
      minIntensity: requiredIntensity / 15, // Legacy uses 0-15 scale
      minDoP: 0.8, // Be slightly lenient for game fun
      polarizationTolerance: Math.PI / 8 // 22.5 degrees
    }
  );
}

// ========== Singleton Instance ==========

export const victorySystem = new VictorySystem();
