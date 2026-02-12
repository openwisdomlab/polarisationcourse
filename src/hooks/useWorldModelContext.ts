/**
 * useWorldModelContext - AI/Debug Context Aggregation Hook (世界模型上下文钩子)
 *
 * Aggregates the complete state of the PolarCraft world into a structured
 * JSON format optimized for LLM consumption. This is the "Semantic Bridge"
 * between the physics engine and AI agents (tutors, hint generators, etc.).
 *
 * The hook combines three layers:
 * 1. Scene Graph: Block layout, positions, orientations, types
 * 2. Simulation Result: Light path data, beam intensities, sensor activations
 * 3. Semantic Interpretation: Human-readable descriptions from PhysicsInterpreter
 *
 * Usage:
 * ```tsx
 * function AITutor() {
 *   const context = useWorldModelContext();
 *   // Pass context.toJSON() to an LLM for generating hints
 *   // or use context.sceneGraph for debug overlays
 * }
 * ```
 *
 * Performance: Recomputes only when the game store's world changes.
 * Uses shallow selectors to avoid unnecessary re-renders.
 */

import { useMemo } from 'react';
import { useGameStore } from '@/stores/gameStore';
import {
  CoherencyMatrix,
  PhysicsInterpreter,
  physicsInterpreter,
  type PolarizationStateDescription,
} from '@/core/physics/unified';
import { PolarizationState, type PolarizationStateJSON } from '@/core/physics/unified/PolarizationState';
import type { BlockState, BlockPosition, LightPacket, LightState } from '@/core/types';

// ========== Output Types ==========

/**
 * A single optical element in the scene graph.
 */
export interface SceneElement {
  /** Position in voxel grid */
  position: { x: number; y: number; z: number };
  /** Block type (emitter, polarizer, sensor, etc.) */
  type: string;
  /** Block rotation in degrees */
  rotation: number;
  /** Polarization angle for applicable blocks */
  polarizationAngle: number;
  /** Direction the block is facing */
  facing: string;
  /** Whether the block is a sensor and is activated */
  activated?: boolean;
  /** For sensors: required intensity to activate */
  requiredIntensity?: number;
  /** Additional properties based on block type */
  properties: Record<string, unknown>;
}

/**
 * A light beam segment in the simulation.
 */
export interface LightBeamContext {
  /** Position of this beam */
  position: { x: number; y: number; z: number };
  /** Light packets at this position */
  packets: Array<{
    direction: string;
    intensity: number;
    normalizedIntensity: number;
    polarizationAngle: number;
    phase: number;
    /** Semantic description from PhysicsInterpreter */
    description: PolarizationStateDescription;
    /** Full polarization state data */
    polarizationState: PolarizationStateJSON;
  }>;
}

/**
 * Summary of the current level state.
 */
export interface LevelContext {
  /** Level index */
  index: number;
  /** Level name */
  name: string;
  /** Whether the level is complete */
  isComplete: boolean;
  /** Number of activated sensors */
  activatedSensors: number;
  /** Total number of sensors */
  totalSensors: number;
}

/**
 * The complete world model context — ready for LLM consumption.
 */
export interface WorldModelContext {
  /** Timestamp of when this context was generated */
  timestamp: number;

  /** Current level information */
  level: LevelContext;

  /** All optical elements in the scene */
  sceneGraph: SceneElement[];

  /** All active light beams with physics data */
  lightBeams: LightBeamContext[];

  /** Player's currently selected tool */
  selectedTool: {
    blockType: string;
    rotation: number;
    polarizationAngle: number;
  };

  /** View settings */
  viewSettings: {
    visionMode: string;
    cameraMode: string;
  };

  /** Global physics summary */
  physicsSummary: {
    /** Total number of active beams */
    totalBeams: number;
    /** Total light energy in the system */
    totalEnergy: number;
    /** Number of beam types by polarization category */
    polarizationDistribution: Record<string, number>;
    /** Any conservation violations detected */
    conservationViolations: string[];
  };
}

// Constants
const MAX_GAME_INTENSITY = 15;

/**
 * Analyze a single light packet and produce full semantic + state data.
 */
function analyzePacketForContext(
  packet: LightPacket,
  interpreter: PhysicsInterpreter,
): {
  description: PolarizationStateDescription;
  polarizationState: PolarizationStateJSON;
} {
  const normalizedIntensity = packet.intensity / MAX_GAME_INTENSITY;
  const polarizationRad = (packet.polarization * Math.PI) / 180;

  const coherency = CoherencyMatrix.createLinear(normalizedIntensity, polarizationRad);
  const description = interpreter.analyzeState(coherency);
  const state = PolarizationState.fromCoherency(coherency);

  return {
    description,
    polarizationState: state.toJSON(),
  };
}

/**
 * Extract scene elements from the world.
 */
function buildSceneGraph(
  blocks: Array<{ position: BlockPosition; state: BlockState }>,
): SceneElement[] {
  return blocks
    .filter(({ state }) => state.type !== 'air')
    .map(({ position, state }) => {
      const element: SceneElement = {
        position: { x: position.x, y: position.y, z: position.z },
        type: state.type,
        rotation: state.rotation,
        polarizationAngle: state.polarizationAngle,
        facing: state.facing,
        properties: {},
      };

      // Add type-specific properties
      switch (state.type) {
        case 'sensor':
          element.activated = state.activated;
          element.requiredIntensity = state.requiredIntensity;
          break;
        case 'rotator':
          element.properties.rotationAmount = state.rotationAmount;
          break;
        case 'absorber':
          element.properties.absorptionRate = state.absorptionRate;
          break;
        case 'phaseShifter':
          element.properties.phaseShift = state.phaseShift;
          break;
        case 'portal':
          element.properties.linkedPortalId = state.linkedPortalId;
          break;
        case 'beamSplitter':
          element.properties.splitRatio = state.splitRatio;
          break;
        case 'lens':
          element.properties.focalLength = state.focalLength;
          break;
        case 'prism':
          element.properties.dispersive = state.dispersive;
          break;
      }

      return element;
    });
}

/**
 * Build light beam context from the world's light states.
 */
function buildLightBeams(
  lightStates: Array<{ position: BlockPosition; state: LightState }>,
  interpreter: PhysicsInterpreter,
): LightBeamContext[] {
  return lightStates
    .filter(({ state }) => state.packets.length > 0)
    .map(({ position, state }) => ({
      position: { x: position.x, y: position.y, z: position.z },
      packets: state.packets.map((packet) => {
        const { description, polarizationState } = analyzePacketForContext(packet, interpreter);
        return {
          direction: packet.direction,
          intensity: packet.intensity,
          normalizedIntensity: packet.intensity / MAX_GAME_INTENSITY,
          polarizationAngle: packet.polarization,
          phase: packet.phase,
          description,
          polarizationState,
        };
      }),
    }));
}

/**
 * Compute global physics summary.
 */
function computePhysicsSummary(
  lightBeams: LightBeamContext[],
): WorldModelContext['physicsSummary'] {
  const distribution: Record<string, number> = {};
  let totalBeams = 0;
  let totalEnergy = 0;

  for (const beam of lightBeams) {
    for (const packet of beam.packets) {
      totalBeams++;
      totalEnergy += packet.normalizedIntensity;

      const category = packet.description.category;
      distribution[category] = (distribution[category] || 0) + 1;
    }
  }

  return {
    totalBeams,
    totalEnergy: Math.round(totalEnergy * 1000) / 1000,
    polarizationDistribution: distribution,
    conservationViolations: [],
  };
}

// ========== The Hook ==========

/**
 * Aggregates the complete world model state for AI/debug consumption.
 *
 * Returns a `WorldModelContext` object that can be serialized to JSON
 * and passed to an LLM for generating hints, explanations, or feedback.
 *
 * Only recomputes when the world instance or level state changes.
 */
export function useWorldModelContext(): WorldModelContext | null {
  const world = useGameStore((s) => s.world);
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const isLevelComplete = useGameStore((s) => s.isLevelComplete);
  const selectedBlockType = useGameStore((s) => s.selectedBlockType);
  const selectedBlockRotation = useGameStore((s) => s.selectedBlockRotation);
  const selectedPolarizationAngle = useGameStore((s) => s.selectedPolarizationAngle);
  const visionMode = useGameStore((s) => s.visionMode);
  const cameraMode = useGameStore((s) => s.cameraMode);

  return useMemo(() => {
    if (!world) return null;

    const interpreter = physicsInterpreter;

    // 1. Scene Graph
    const blocks = world.getAllBlocks();
    const sceneGraph = buildSceneGraph(blocks);

    // 2. Light Beams
    const lightStates = world.getAllLightStates();
    const lightBeams = buildLightBeams(lightStates, interpreter);

    // 3. Level Context
    const sensors = blocks.filter(({ state }) => state.type === 'sensor');
    const activatedSensors = sensors.filter(({ state }) => state.activated).length;

    const level: LevelContext = {
      index: currentLevelIndex,
      name: currentLevel?.name ?? `Level ${currentLevelIndex}`,
      isComplete: isLevelComplete,
      activatedSensors,
      totalSensors: sensors.length,
    };

    // 4. Physics Summary
    const physicsSummary = computePhysicsSummary(lightBeams);

    return {
      timestamp: Date.now(),
      level,
      sceneGraph,
      lightBeams,
      selectedTool: {
        blockType: selectedBlockType,
        rotation: selectedBlockRotation,
        polarizationAngle: selectedPolarizationAngle,
      },
      viewSettings: {
        visionMode,
        cameraMode,
      },
      physicsSummary,
    };
  }, [
    world,
    currentLevelIndex,
    currentLevel,
    isLevelComplete,
    selectedBlockType,
    selectedBlockRotation,
    selectedPolarizationAngle,
    visionMode,
    cameraMode,
  ]);
}
