/**
 * useSimulationWorldState - React Hook for the Simulation-First Pipeline
 *
 * Bridges the OpticalSimulationLoop to React components by:
 * 1. Reading scene nodes from the optical bench store
 * 2. Running the deterministic simulation
 * 3. Producing a WorldState snapshot
 * 4. Converting to render-ready data via the VisualContract
 * 5. Generating the AI Observer PhysicalPhenomenonReport
 *
 * This hook is the single integration point between the simulation layer
 * and the React rendering layer. All downstream consumers (visuals, game
 * logic, AI) read from the WorldState produced here.
 *
 * Usage:
 * ```tsx
 * function OpticalScene() {
 *   const { worldState, renderableSegments, renderableSensors, report } =
 *     useSimulationWorldState();
 *
 *   // Render beams from renderableSegments
 *   // Check sensors from worldState.sensorReadings
 *   // Pass report to AI agent
 * }
 * ```
 */

import { useMemo } from 'react';
import {
  simulationLoop,
  benchComponentToSceneNode,
  worldStateToRenderableSegments,
  worldStateToRenderableSensors,
  generatePhenomenonReport,
  type WorldState,
  type SceneNode,
  type RenderableBeamSegment,
  type RenderableSensor,
  type PhysicalPhenomenonReport,
} from '@/core/simulation';

// ========== Store Adapter Types ==========

/**
 * Minimal interface for bench components.
 * Matches the shape of objects in opticalBenchStore.components[].
 */
export interface BenchComponentInput {
  id: string;
  type: string;
  x: number;
  y: number;
  angle?: number;
  polarization?: number;
  retardation?: number;
  splitType?: string;
  reflectAngle?: number;
  rotation?: number;
  attenuation?: number;
  wavelengthNm?: number;
  intensity?: number;
}

// ========== Hook Output ==========

export interface SimulationWorldStateResult {
  /** The immutable physics WorldState snapshot */
  worldState: WorldState;
  /** Scene nodes used for the simulation */
  sceneNodes: SceneNode[];
  /** Render-ready beam segments (filtered by VisualContract) */
  renderableSegments: RenderableBeamSegment[];
  /** Render-ready sensor states */
  renderableSensors: RenderableSensor[];
  /** AI Observer phenomenon report */
  report: PhysicalPhenomenonReport;
}

// ========== The Hook ==========

/**
 * Runs the OpticalSimulationLoop on a set of bench components
 * and produces the complete simulation pipeline output.
 *
 * Memoized: only recomputes when components change.
 *
 * @param components Array of bench components (from store or props)
 * @param options Simulation options
 */
export function useSimulationWorldState(
  components: BenchComponentInput[],
  options?: {
    useWavelengthColor?: boolean;
    sensorThreshold?: number;
  },
): SimulationWorldStateResult {
  return useMemo(() => {
    // Step 1: Convert store components to SceneNodes
    const sceneNodes = components.map(benchComponentToSceneNode);

    // Step 2: Run the deterministic simulation
    if (options?.sensorThreshold !== undefined) {
      simulationLoop.setSensorThreshold(options.sensorThreshold);
    }
    const worldState = simulationLoop.simulate(sceneNodes);

    // Step 3: Apply VisualContract to produce render-ready data
    const renderableSegments = worldStateToRenderableSegments(
      worldState.segments,
      { useWavelengthColor: options?.useWavelengthColor },
    );
    const renderableSensors = worldStateToRenderableSensors(worldState.sensorReadings);

    // Step 4: Generate AI Observer report
    const report = generatePhenomenonReport(worldState);

    return {
      worldState,
      sceneNodes,
      renderableSegments,
      renderableSensors,
      report,
    };
  }, [components, options?.useWavelengthColor, options?.sensorThreshold]);
}
