/**
 * SensorSystem (传感器系统)
 *
 * Implements Pillar 3: The Causal Link between physics and game mechanics.
 *
 * Instead of checking "Is the puzzle solved?", this system asks:
 * "How much energy is hitting the Sensor at position (x,y)?"
 *
 * Design principles:
 * - Game mechanics LISTEN to physics, not user input
 * - Sensor activation is determined ONLY by physical readings from the WorldState
 * - Level completion is triggered ONLY when all sensor thresholds are met
 * - No hardcoded level-specific checks (e.g., no `if (level === 1)` hacks)
 * - The physics engine must be generic enough to solve any arrangement
 *
 * The system provides:
 * - Threshold-based sensor activation from physics data
 * - Level completion detection from sensor readings
 * - Detailed diagnostic reports for debugging/AI
 * - Event callbacks for game logic integration
 */

import type { WorldState, SensorReading } from '../core/simulation/OpticalSimulationLoop';

// ========== Sensor Configuration ==========

/**
 * Configuration for a single sensor's activation requirements.
 * These are the physical thresholds that must be met.
 */
export interface SensorConfig {
  /** Sensor element ID (must match WorldState.sensorReadings key) */
  sensorId: string;
  /** Minimum intensity required for activation (0-1) */
  minIntensity: number;
  /** Required polarization angle in degrees (null = any polarization) */
  requiredPolarizationDeg: number | null;
  /** Angular tolerance for polarization matching (degrees) */
  polarizationToleranceDeg: number;
  /** Minimum degree of polarization required (0-1, null = any) */
  minDoP: number | null;
  /** Required polarization category (null = any) */
  requiredCategory: 'linear' | 'circular' | 'elliptical' | null;
  /** Required handedness for circular/elliptical (null = any) */
  requiredHandedness: 'right' | 'left' | null;
}

/**
 * Create a SensorConfig with sensible defaults.
 */
export function createSensorConfig(
  sensorId: string,
  overrides?: Partial<Omit<SensorConfig, 'sensorId'>>,
): SensorConfig {
  return {
    sensorId,
    minIntensity: 0.05,
    requiredPolarizationDeg: null,
    polarizationToleranceDeg: 15,
    minDoP: null,
    requiredCategory: null,
    requiredHandedness: null,
    ...overrides,
  };
}

// ========== Sensor Check Results ==========

/**
 * Detailed result of checking a single sensor.
 */
export interface SensorCheckResult {
  /** Sensor ID */
  sensorId: string;
  /** Whether all conditions are satisfied */
  satisfied: boolean;
  /** Received intensity */
  receivedIntensity: number;
  /** Whether intensity threshold was met */
  intensityMet: boolean;
  /** Whether polarization requirements were met */
  polarizationMet: boolean;
  /** Whether DoP requirement was met */
  dopMet: boolean;
  /** Whether category requirement was met */
  categoryMet: boolean;
  /** Whether handedness requirement was met */
  handednessMet: boolean;
  /** Detailed failure reasons */
  failureReasons: string[];
  /** Human-readable status */
  statusDescription: string;
}

/**
 * Overall level completion check result.
 */
export interface LevelCheckResult {
  /** Whether all sensors are satisfied (level complete!) */
  complete: boolean;
  /** Individual sensor results */
  sensorResults: SensorCheckResult[];
  /** Number of satisfied sensors */
  satisfiedCount: number;
  /** Total number of sensors */
  totalCount: number;
  /** Progress percentage (0-100) */
  progressPercent: number;
  /** Overall status description */
  statusDescription: string;
}

// ========== Event Types ==========

export type SensorEventType =
  | 'sensor_activated'
  | 'sensor_deactivated'
  | 'level_complete'
  | 'level_incomplete';

export interface SensorEvent {
  type: SensorEventType;
  sensorId?: string;
  timestamp: number;
  worldStateVersion: number;
  details: Record<string, unknown>;
}

export type SensorEventHandler = (event: SensorEvent) => void;

// ========== SensorSystem ==========

/**
 * The SensorSystem monitors WorldState and fires events based on
 * physics-determined sensor readings.
 *
 * Usage:
 * ```ts
 * const system = new SensorSystem();
 *
 * // Configure sensors
 * system.configureSensors([
 *   createSensorConfig('sensor-1', { minIntensity: 0.5, requiredPolarizationDeg: 0 }),
 *   createSensorConfig('sensor-2', { minIntensity: 0.3 }),
 * ]);
 *
 * // Listen for events
 * system.on('level_complete', (event) => {
 *   console.log('Level complete!', event);
 * });
 *
 * // Update with physics state
 * const worldState = simulationLoop.simulate(sceneNodes);
 * system.update(worldState);
 * ```
 */
export class SensorSystem {
  private sensorConfigs: Map<string, SensorConfig> = new Map();
  private previousActivationState: Map<string, boolean> = new Map();
  private eventHandlers: Map<SensorEventType, SensorEventHandler[]> = new Map();
  private lastLevelComplete: boolean = false;

  // ========== Configuration ==========

  /**
   * Set sensor configurations for the current level.
   * Resets activation state tracking.
   */
  configureSensors(configs: SensorConfig[]): void {
    this.sensorConfigs.clear();
    this.previousActivationState.clear();
    this.lastLevelComplete = false;

    for (const config of configs) {
      this.sensorConfigs.set(config.sensorId, config);
      this.previousActivationState.set(config.sensorId, false);
    }
  }

  /**
   * Add or update a single sensor configuration.
   */
  configureSensor(config: SensorConfig): void {
    this.sensorConfigs.set(config.sensorId, config);
    if (!this.previousActivationState.has(config.sensorId)) {
      this.previousActivationState.set(config.sensorId, false);
    }
  }

  // ========== Event System ==========

  /**
   * Register an event handler.
   */
  on(type: SensorEventType, handler: SensorEventHandler): void {
    const handlers = this.eventHandlers.get(type) ?? [];
    handlers.push(handler);
    this.eventHandlers.set(type, handlers);
  }

  /**
   * Remove an event handler.
   */
  off(type: SensorEventType, handler: SensorEventHandler): void {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index >= 0) handlers.splice(index, 1);
    }
  }

  private emit(event: SensorEvent): void {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  // ========== Core Update ==========

  /**
   * Update the sensor system with a new WorldState.
   *
   * Checks all configured sensors against their physics readings
   * and fires events for state changes.
   *
   * Returns the level check result for immediate use.
   */
  update(worldState: WorldState): LevelCheckResult {
    const result = this.checkLevel(worldState);

    // Detect state changes and fire events
    for (const sensorResult of result.sensorResults) {
      const prev = this.previousActivationState.get(sensorResult.sensorId) ?? false;
      const current = sensorResult.satisfied;

      if (!prev && current) {
        this.emit({
          type: 'sensor_activated',
          sensorId: sensorResult.sensorId,
          timestamp: worldState.timestamp,
          worldStateVersion: worldState.version,
          details: {
            intensity: sensorResult.receivedIntensity,
          },
        });
      } else if (prev && !current) {
        this.emit({
          type: 'sensor_deactivated',
          sensorId: sensorResult.sensorId,
          timestamp: worldState.timestamp,
          worldStateVersion: worldState.version,
          details: {
            reasons: sensorResult.failureReasons,
          },
        });
      }

      this.previousActivationState.set(sensorResult.sensorId, current);
    }

    // Level completion events
    if (result.complete && !this.lastLevelComplete) {
      this.emit({
        type: 'level_complete',
        timestamp: worldState.timestamp,
        worldStateVersion: worldState.version,
        details: {
          satisfiedCount: result.satisfiedCount,
          totalCount: result.totalCount,
        },
      });
    } else if (!result.complete && this.lastLevelComplete) {
      this.emit({
        type: 'level_incomplete',
        timestamp: worldState.timestamp,
        worldStateVersion: worldState.version,
        details: {
          satisfiedCount: result.satisfiedCount,
          totalCount: result.totalCount,
        },
      });
    }

    this.lastLevelComplete = result.complete;
    return result;
  }

  // ========== Level Check ==========

  /**
   * Check all sensors against a WorldState without firing events.
   * Useful for preview/debug.
   */
  checkLevel(worldState: WorldState): LevelCheckResult {
    const sensorResults: SensorCheckResult[] = [];
    let satisfiedCount = 0;

    for (const [sensorId, config] of this.sensorConfigs) {
      const reading = worldState.sensorReadings.get(sensorId);
      const result = this.checkSensor(config, reading ?? null);
      sensorResults.push(result);
      if (result.satisfied) satisfiedCount++;
    }

    const totalCount = this.sensorConfigs.size;
    const complete = totalCount > 0 && satisfiedCount === totalCount;
    const progressPercent = totalCount > 0 ? (satisfiedCount / totalCount) * 100 : 0;

    let statusDescription: string;
    if (complete) {
      statusDescription = `Level complete! All ${totalCount} sensors activated.`;
    } else if (satisfiedCount > 0) {
      statusDescription = `${satisfiedCount}/${totalCount} sensors activated (${progressPercent.toFixed(0)}% progress).`;
    } else {
      statusDescription = `No sensors activated. ${totalCount} sensor${totalCount !== 1 ? 's' : ''} remaining.`;
    }

    return {
      complete,
      sensorResults,
      satisfiedCount,
      totalCount,
      progressPercent,
      statusDescription,
    };
  }

  /**
   * Check a single sensor against its config.
   */
  private checkSensor(
    config: SensorConfig,
    reading: SensorReading | null,
  ): SensorCheckResult {
    const failureReasons: string[] = [];

    // No reading = no light
    if (!reading || reading.intensity === 0) {
      return {
        sensorId: config.sensorId,
        satisfied: false,
        receivedIntensity: 0,
        intensityMet: false,
        polarizationMet: config.requiredPolarizationDeg === null,
        dopMet: config.minDoP === null,
        categoryMet: config.requiredCategory === null,
        handednessMet: config.requiredHandedness === null,
        failureReasons: ['No light reached this sensor'],
        statusDescription: 'No light reaching sensor',
      };
    }

    // Check 1: Intensity threshold
    const intensityMet = reading.intensity >= config.minIntensity;
    if (!intensityMet) {
      failureReasons.push(
        `Intensity ${(reading.intensity * 100).toFixed(1)}% below required ${(config.minIntensity * 100).toFixed(1)}%`,
      );
    }

    // Check 2: Polarization angle (if required)
    let polarizationMet = true;
    if (config.requiredPolarizationDeg !== null) {
      const angleDiff = Math.abs(reading.orientationDeg - config.requiredPolarizationDeg);
      const normalizedDiff = Math.min(angleDiff, 180 - angleDiff);
      polarizationMet = normalizedDiff <= config.polarizationToleranceDeg;
      if (!polarizationMet) {
        failureReasons.push(
          `Polarization at ${reading.orientationDeg.toFixed(1)}deg, required ${config.requiredPolarizationDeg}deg (tolerance: +-${config.polarizationToleranceDeg}deg)`,
        );
      }
    }

    // Check 3: Degree of polarization (if required)
    let dopMet = true;
    if (config.minDoP !== null) {
      dopMet = reading.degreeOfPolarization >= config.minDoP;
      if (!dopMet) {
        failureReasons.push(
          `DoP ${(reading.degreeOfPolarization * 100).toFixed(0)}% below required ${(config.minDoP * 100).toFixed(0)}%`,
        );
      }
    }

    // Check 4: Polarization category (if required)
    let categoryMet = true;
    if (config.requiredCategory !== null) {
      categoryMet = reading.description.category === config.requiredCategory;
      if (!categoryMet) {
        failureReasons.push(
          `Polarization is ${reading.description.category}, required ${config.requiredCategory}`,
        );
      }
    }

    // Check 5: Handedness (if required)
    let handednessMet = true;
    if (config.requiredHandedness !== null) {
      handednessMet = reading.description.handedness === config.requiredHandedness;
      if (!handednessMet) {
        failureReasons.push(
          `Handedness is ${reading.description.handedness}, required ${config.requiredHandedness}`,
        );
      }
    }

    const satisfied = intensityMet && polarizationMet && dopMet && categoryMet && handednessMet;

    let statusDescription: string;
    if (satisfied) {
      statusDescription = `Sensor activated: receiving ${(reading.intensity * 100).toFixed(0)}% intensity, ${reading.description.label}`;
    } else {
      statusDescription = `Sensor not activated: ${failureReasons[0] ?? 'unknown reason'}`;
    }

    return {
      sensorId: config.sensorId,
      satisfied,
      receivedIntensity: reading.intensity,
      intensityMet,
      polarizationMet,
      dopMet,
      categoryMet,
      handednessMet,
      failureReasons,
      statusDescription,
    };
  }

  // ========== Diagnostics ==========

  /**
   * Generate a diagnostic report for all sensors.
   * Useful for debugging and AI context.
   */
  generateDiagnostics(worldState: WorldState): string {
    const result = this.checkLevel(worldState);
    const lines: string[] = [
      `=== Sensor System Diagnostics ===`,
      `Level Status: ${result.statusDescription}`,
      `Energy Conservation: ${worldState.energyConserved ? 'OK' : 'VIOLATION'}`,
      `Simulation Complete: ${worldState.simulationComplete ? 'Yes' : 'Iteration limit reached'}`,
      ``,
    ];

    for (const sr of result.sensorResults) {
      lines.push(`--- Sensor: ${sr.sensorId} ---`);
      lines.push(`  Status: ${sr.satisfied ? 'ACTIVATED' : 'NOT ACTIVATED'}`);
      lines.push(`  Intensity: ${(sr.receivedIntensity * 100).toFixed(1)}%`);
      lines.push(`  Checks: intensity=${sr.intensityMet}, polarization=${sr.polarizationMet}, DoP=${sr.dopMet}, category=${sr.categoryMet}, handedness=${sr.handednessMet}`);
      if (sr.failureReasons.length > 0) {
        lines.push(`  Failure Reasons:`);
        for (const reason of sr.failureReasons) {
          lines.push(`    - ${reason}`);
        }
      }
      lines.push(``);
    }

    return lines.join('\n');
  }

  /**
   * Reset the sensor system (for level transitions).
   */
  reset(): void {
    this.previousActivationState.clear();
    this.lastLevelComplete = false;
  }
}

// ========== Singleton ==========

/**
 * Default SensorSystem instance for the application.
 */
export const sensorSystem = new SensorSystem();
