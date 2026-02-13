/**
 * Simulation Module (仿真模块)
 *
 * The "World Model" — the single source of truth for all physics-driven
 * systems in PolarCraft.
 *
 * Architecture:
 * - OpticalSimulationLoop: Deterministic simulation engine
 * - VisualContract: Strict rules for rendering from physics data
 * - PhysicalPhenomenonReport: AI Observer interface
 *
 * Downstream consumers:
 * - SensorSystem (src/systems/): Reads WorldState for game logic
 * - LightBeams.tsx: Reads WorldState for visual rendering
 * - useWorldModelContext: Reads WorldState for AI/debug context
 */

// ========== Core Simulation ==========
export {
  OpticalSimulationLoop,
  simulationLoop,
  benchComponentToSceneNode,
  type SceneNode,
  type BenchElementType,
  type ElementParameters,
  type BeamSegmentState,
  type SensorReading,
  type InteractionRecord,
  type WorldState,
} from './OpticalSimulationLoop';

// ========== Visual Contract ==========
export {
  RENDER_INTENSITY_THRESHOLD,
  VISUAL_UPDATE_EPSILON,
  wavelengthToColor,
  getPolarizationAwareColor,
  toRenderableSegment,
  toRenderableSensor,
  worldStateToRenderableSegments,
  worldStateToRenderableSensors,
  type RenderableBeamSegment,
  type RenderableSensor,
} from './VisualContract';

// ========== AI Observer ==========
export {
  generatePhenomenonReport,
  serializeReport,
  type PhysicalPhenomenonReport,
  type PhenomenonEvent,
  type SensorEvent as PhenomenonSensorEvent,
  type EnergyFlowSummary,
  type BeamTopology,
} from './PhysicalPhenomenonReport';
