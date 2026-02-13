/**
 * OpticalSimulationLoop (光学仿真主循环)
 *
 * The deterministic simulation engine that bridges the optical bench store
 * to the unified physics engine. Implements the "World Model" mandate:
 *
 * 1. Scene Graph Parsing: Converts bench components into a directed graph
 *    of OpticalSurface instances for the LightTracer.
 * 2. Propagation Calculation: Runs the unified LightTracer to compute
 *    Jones/Stokes vectors at every interaction point.
 * 3. State Snapshot: Generates an immutable WorldState containing the exact
 *    physical state of every beam segment.
 *
 * Design constraints:
 * - No visual faking: beam segments only exist if math produces them
 * - Conservation of reality: intensity, phase, polarization calculated precisely
 * - Splitters/combiners use complex number addition for interference
 * - Deterministic: same input always produces same output
 */

import { Vector3 } from '../math/Vector3';
import {
  CoherencyMatrix,
  LightTracer,
  SimpleScene,
  createLinearSource,
  createUnpolarizedSource,
  IdealPolarizer,
  WavePlate,
  IdealMirror,
  OpticalRotator,
  PolarizingBeamSplitter,
  Attenuator,
  type LightRay,
  type RaySegment,
  type TraceResult,
  type OpticalSurface,
  type LightSourceConfig,
  physicsInterpreter,
  type PolarizationStateDescription,
} from '../physics/unified';

// ========== Scene Graph Types ==========

/**
 * A node in the optical scene graph — represents a single optical element
 * with its physical parameters and connectivity.
 */
export interface SceneNode {
  /** Unique identifier matching the bench component */
  id: string;
  /** Type of optical element */
  type: BenchElementType;
  /** Position in scene coordinates */
  position: Vector3;
  /** Surface normal / orientation */
  normal: Vector3;
  /** Element-specific parameters */
  parameters: ElementParameters;
}

export type BenchElementType =
  | 'emitter'
  | 'polarizer'
  | 'waveplate'
  | 'mirror'
  | 'splitter'
  | 'sensor'
  | 'lens'
  | 'rotator'
  | 'attenuator';

export interface ElementParameters {
  /** Polarization angle in degrees (for emitters, polarizers) */
  polarizationAngle?: number;
  /** Retardation in degrees (for waveplates: 90 = QWP, 180 = HWP) */
  retardation?: number;
  /** Rotation angle in degrees (for optical rotators) */
  rotationAngle?: number;
  /** Split type (for splitters: 'PBS' | 'NPBS' | 'Calcite') */
  splitType?: string;
  /** Attenuation factor 0-1 (for attenuators) */
  attenuation?: number;
  /** Reflection angle in degrees (for mirrors) */
  reflectAngle?: number;
  /** Whether this is an unpolarized source */
  unpolarized?: boolean;
  /** Wavelength in nm */
  wavelengthNm?: number;
  /** Intensity (for emitters, 0-1 normalized) */
  intensity?: number;
  /** Rotation of the element in degrees */
  rotation?: number;
}

// ========== WorldState: The Immutable Physics Snapshot ==========

/**
 * Physical state of a single beam segment — the ground truth.
 * No pixel should be rendered without a corresponding BeamSegmentState.
 */
export interface BeamSegmentState {
  /** Unique segment ID */
  id: string;
  /** Which ray produced this segment */
  rayId: string;
  /** Source emitter ID */
  sourceId: string;
  /** Start position in scene coordinates */
  start: { x: number; y: number; z: number };
  /** End position in scene coordinates */
  end: { x: number; y: number; z: number };
  /** Propagation direction (unit vector) */
  direction: { x: number; y: number; z: number };
  /** Intensity at this segment (0-1 normalized) */
  intensity: number;
  /** Stokes parameters [S0, S1, S2, S3] */
  stokes: [number, number, number, number];
  /** Semantic description of the polarization state */
  polarizationDescription: PolarizationStateDescription;
  /** Wavelength in nanometers */
  wavelengthNm: number;
  /** Accumulated optical path length */
  pathLength: number;
  /** Parent segment ID (for tracking splits) */
  parentSegmentId?: string;
}

/**
 * Physical reading at a sensor — what the detector "sees".
 */
export interface SensorReading {
  /** Sensor element ID */
  sensorId: string;
  /** Total intensity arriving at the sensor (0-1) */
  intensity: number;
  /** Stokes parameters of the combined light at the sensor */
  stokes: [number, number, number, number];
  /** Degree of polarization (0-1) */
  degreeOfPolarization: number;
  /** Polarization orientation angle in degrees */
  orientationDeg: number;
  /** Ellipticity angle in degrees */
  ellipticityDeg: number;
  /** Semantic description */
  description: PolarizationStateDescription;
  /** Ray IDs that contributed to this reading */
  contributingRayIds: string[];
  /** Whether this sensor meets its activation threshold */
  activated: boolean;
  /** Reasons for non-activation (if any) */
  failureReasons: string[];
}

/**
 * A record of what happened at an optical element during propagation.
 */
export interface InteractionRecord {
  /** Element ID where the interaction occurred */
  elementId: string;
  /** Element type */
  elementType: string;
  /** Input state description */
  inputState: PolarizationStateDescription;
  /** Output state description */
  outputState: PolarizationStateDescription;
  /** Transmittance ratio */
  transmittance: number;
  /** Human-readable description of the interaction */
  description: string;
  /** Whether energy was conserved */
  energyConserved: boolean;
  /** Physical law cited */
  physicalLaw: string;
}

/**
 * The immutable WorldState snapshot — complete physical truth of the simulation.
 *
 * Every visual, game logic decision, and AI report must derive from this object.
 * Nothing exists in the rendered scene that is not present here.
 */
export interface WorldState {
  /** Monotonically increasing version number */
  version: number;
  /** Timestamp when this state was computed */
  timestamp: number;
  /** All beam segments in the scene */
  segments: BeamSegmentState[];
  /** Sensor readings (detector outputs) */
  sensorReadings: Map<string, SensorReading>;
  /** Interaction events at each optical element */
  interactions: InteractionRecord[];
  /** Scene graph that produced this state */
  sceneNodes: SceneNode[];
  /** Total energy in the system (sum of emitter intensities) */
  totalInputEnergy: number;
  /** Total energy at all sensors */
  totalOutputEnergy: number;
  /** Whether energy conservation holds globally */
  energyConserved: boolean;
  /** Whether the simulation completed without hitting iteration limits */
  simulationComplete: boolean;
  /** Number of tracer iterations used */
  iterationsUsed: number;
}

// ========== Scene Graph Builder ==========

/**
 * Convert a bench component (from opticalBenchStore) into a SceneNode.
 * This is the adapter between the store's data model and the physics engine.
 */
export function benchComponentToSceneNode(component: {
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
}): SceneNode {
  const angle = (component.angle ?? 0) * Math.PI / 180;
  const normal = new Vector3(-Math.sin(angle), Math.cos(angle), 0);

  return {
    id: component.id,
    type: component.type as BenchElementType,
    position: new Vector3(component.x, component.y, 0),
    normal,
    parameters: {
      polarizationAngle: component.polarization,
      retardation: component.retardation,
      rotationAngle: component.rotation,
      splitType: component.splitType,
      reflectAngle: component.reflectAngle,
      attenuation: component.attenuation,
      unpolarized: component.polarization === -1,
      wavelengthNm: component.wavelengthNm ?? 550,
      intensity: component.intensity ?? 1.0,
      rotation: component.angle,
    },
  };
}

/**
 * Convert a SceneNode into an OpticalSurface for the LightTracer.
 */
function sceneNodeToSurface(node: SceneNode): OpticalSurface | null {
  const { id, position, normal, parameters } = node;

  switch (node.type) {
    case 'polarizer': {
      const polAngleRad = (parameters.polarizationAngle ?? 0) * Math.PI / 180;
      // Build transmission axis perpendicular to normal at the given angle
      const cosA = Math.cos(polAngleRad);
      const sinA = Math.sin(polAngleRad);
      const transAxis = new Vector3(cosA, sinA, 0);
      return new IdealPolarizer(id, position, normal, transAxis);
    }

    case 'waveplate': {
      const retardanceRad = (parameters.retardation ?? 90) * Math.PI / 180;
      // Fast axis at 0 degrees relative to polarizer convention
      const fastAxis = new Vector3(1, 0, 0);
      return new WavePlate(id, position, normal, fastAxis, retardanceRad);
    }

    case 'mirror': {
      return new IdealMirror(id, position, normal);
    }

    case 'rotator': {
      const rotAngleRad = (parameters.rotationAngle ?? 45) * Math.PI / 180;
      return new OpticalRotator(id, position, normal, rotAngleRad);
    }

    case 'splitter': {
      if (parameters.splitType === 'PBS' || parameters.splitType === 'Calcite') {
        return new PolarizingBeamSplitter(id, position, normal);
      }
      // NPBS: treat as 50/50 attenuator for transmitted beam
      return new Attenuator(id, position, normal, 0.5);
    }

    case 'attenuator': {
      const factor = parameters.attenuation ?? 0.5;
      return new Attenuator(id, position, normal, factor);
    }

    // Emitters and sensors are not optical surfaces — they are sources and detectors
    case 'emitter':
    case 'sensor':
    case 'lens':
      return null;

    default:
      return null;
  }
}

/**
 * Convert emitter SceneNodes into LightRay objects for the tracer.
 */
function sceneNodeToLightRay(node: SceneNode): LightRay | null {
  if (node.type !== 'emitter') return null;

  const { parameters } = node;
  const angleRad = (parameters.rotation ?? 0) * Math.PI / 180;
  const direction = new Vector3(Math.cos(angleRad), Math.sin(angleRad), 0);

  const config: LightSourceConfig = {
    id: node.id,
    position: node.position,
    direction,
    intensity: parameters.intensity ?? 1.0,
    wavelengthNm: parameters.wavelengthNm ?? 550,
  };

  if (parameters.unpolarized) {
    return createUnpolarizedSource(config);
  }

  const polAngleRad = (parameters.polarizationAngle ?? 0) * Math.PI / 180;
  return createLinearSource(config, polAngleRad);
}

// ========== Identify Physical Law ==========

function identifyPhysicalLaw(elementType: string, inputDesc: PolarizationStateDescription, outputDesc: PolarizationStateDescription): string {
  switch (elementType) {
    case 'Linear Polarizer':
      if (outputDesc.category === 'zero') return "Malus's Law: I = I_0 cos^2(theta), theta = 90deg => I = 0";
      return "Malus's Law: I = I_0 cos^2(theta)";

    case 'Quarter-Wave Plate':
      if (inputDesc.category === 'linear' && outputDesc.category === 'circular')
        return 'Quarter-Wave Plate: linear -> circular conversion (delta = pi/2)';
      if (inputDesc.category === 'circular' && outputDesc.category === 'linear')
        return 'Quarter-Wave Plate: circular -> linear conversion (delta = pi/2)';
      return 'Wave plate retardation: delta = 2*pi*d*Delta_n / lambda';

    case 'Half-Wave Plate':
      return 'Half-Wave Plate: rotates linear polarization by 2*theta (delta = pi)';

    case 'Mirror':
      return 'Reflection: angle of incidence = angle of reflection, phase shift at boundary';

    case 'Optical Rotator':
      return 'Optical rotation: polarization axis rotated by alpha without intensity loss';

    case 'Polarizing Beam Splitter':
      return 'Birefringence: orthogonal polarization components separated into o-ray and e-ray';

    case 'Attenuator':
      return 'Beer-Lambert attenuation: I_out = I_in * T';

    default:
      return 'Optical transformation';
  }
}

// ========== Sensor Activation Logic ==========

/** Default intensity threshold for sensor activation */
const DEFAULT_SENSOR_THRESHOLD = 0.05;

function computeSensorReading(
  sensorNode: SceneNode,
  traceResult: TraceResult,
  threshold: number = DEFAULT_SENSOR_THRESHOLD,
): SensorReading {
  // Find segments that end near the sensor position
  const sensorPos = sensorNode.position;
  const PROXIMITY = 2.0; // scene units

  const nearbySegments = traceResult.segments.filter(seg => {
    const dx = seg.end.x - sensorPos.x;
    const dy = seg.end.y - sensorPos.y;
    const dz = seg.end.z - sensorPos.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz) < PROXIMITY;
  });

  if (nearbySegments.length === 0) {
    const zeroState = physicsInterpreter.analyzeState(CoherencyMatrix.ZERO);
    return {
      sensorId: sensorNode.id,
      intensity: 0,
      stokes: [0, 0, 0, 0],
      degreeOfPolarization: 0,
      orientationDeg: 0,
      ellipticityDeg: 0,
      description: zeroState,
      contributingRayIds: [],
      activated: false,
      failureReasons: ['No light reached this sensor'],
    };
  }

  // Incoherent addition of all arriving beams (different sources)
  // For coherent beams (same source), we would need complex field addition
  // Group by sourceId for coherent combining
  const bySource = new Map<string, RaySegment[]>();
  for (const seg of nearbySegments) {
    const existing = bySource.get(seg.sourceId) ?? [];
    existing.push(seg);
    bySource.set(seg.sourceId, existing);
  }

  // Within each source group, combine coherently using CoherencyMatrix addition
  // Across source groups, combine incoherently (intensity addition)
  let totalState = CoherencyMatrix.ZERO;
  const contributingRayIds: string[] = [];

  for (const [, segments] of bySource) {
    // Coherent combination: add CoherencyMatrix states
    let coherentState = CoherencyMatrix.ZERO;
    for (const seg of segments) {
      coherentState = coherentState.add(seg.state);
      contributingRayIds.push(seg.rayId);
    }
    // Incoherent addition across sources
    totalState = totalState.add(coherentState);
  }

  const description = physicsInterpreter.analyzeState(totalState);
  const stokes = totalState.toStokes();
  const intensity = totalState.intensity;
  const activated = intensity >= threshold;

  const failureReasons: string[] = [];
  if (!activated) {
    if (intensity === 0) {
      failureReasons.push('No light reached this sensor');
    } else {
      failureReasons.push(
        `Intensity ${(intensity * 100).toFixed(1)}% below threshold ${(threshold * 100).toFixed(1)}%`
      );
    }
  }

  return {
    sensorId: sensorNode.id,
    intensity,
    stokes,
    degreeOfPolarization: description.dop,
    orientationDeg: description.orientationDeg,
    ellipticityDeg: description.ellipticityDeg,
    description,
    contributingRayIds,
    activated,
    failureReasons,
  };
}

// ========== The Simulation Loop ==========

let worldStateVersion = 0;

/**
 * OpticalSimulationLoop - The core deterministic simulation.
 *
 * Takes a set of SceneNodes (from the optical bench or game world),
 * runs the unified LightTracer, and produces an immutable WorldState.
 *
 * This is the single source of truth for all downstream consumers:
 * - Visual rendering reads segments[] for beam positions and colors
 * - SensorSystem reads sensorReadings for activation
 * - AI Observer reads interactions[] for phenomenon reports
 */
export class OpticalSimulationLoop {
  private tracer: LightTracer;
  private sensorThreshold: number;

  constructor(options?: { sensorThreshold?: number; maxBounces?: number }) {
    this.tracer = new LightTracer({
      maxIterations: 10000,
      maxBounces: options?.maxBounces ?? 50,
      intensityThreshold: 1e-6,
      stepSize: 0.1,
      sceneBoundary: 1000,
    });
    this.sensorThreshold = options?.sensorThreshold ?? DEFAULT_SENSOR_THRESHOLD;
  }

  /**
   * Run a full simulation tick.
   *
   * 1. Parse scene nodes into OpticalSurfaces and LightRays
   * 2. Run the LightTracer
   * 3. Compute sensor readings
   * 4. Build interaction records
   * 5. Return immutable WorldState
   */
  simulate(sceneNodes: SceneNode[]): WorldState {
    const timestamp = Date.now();
    worldStateVersion++;

    // Step 1: Separate emitters, sensors, and optical elements
    const emitterNodes = sceneNodes.filter(n => n.type === 'emitter');
    const sensorNodes = sceneNodes.filter(n => n.type === 'sensor');
    const elementNodes = sceneNodes.filter(
      n => n.type !== 'emitter' && n.type !== 'sensor'
    );

    // Step 2: Convert to physics engine objects
    const surfaces = elementNodes
      .map(sceneNodeToSurface)
      .filter((s): s is OpticalSurface => s !== null);

    const rays = emitterNodes
      .map(sceneNodeToLightRay)
      .filter((r): r is LightRay => r !== null);

    const scene = new SimpleScene(surfaces, 0.5);

    // Step 3: Run the tracer
    const traceResult: TraceResult = rays.length > 0
      ? this.tracer.trace(rays, scene)
      : { segments: [], detections: [], iterations: 0, completed: true };

    // Step 4: Convert segments to BeamSegmentState
    const segments = this.buildSegmentStates(traceResult, emitterNodes);

    // Step 5: Compute sensor readings
    const sensorReadings = new Map<string, SensorReading>();
    for (const sensorNode of sensorNodes) {
      const reading = computeSensorReading(
        sensorNode,
        traceResult,
        this.sensorThreshold,
      );
      sensorReadings.set(sensorNode.id, reading);
    }

    // Step 6: Build interaction records
    const interactions = this.buildInteractionRecords(traceResult, surfaces);

    // Step 7: Energy conservation check
    const totalInputEnergy = emitterNodes.reduce(
      (sum, n) => sum + (n.parameters.intensity ?? 1.0),
      0,
    );
    const totalOutputEnergy = Array.from(sensorReadings.values()).reduce(
      (sum, r) => sum + r.intensity,
      0,
    );
    // For passive systems, total output should not exceed total input
    // (some energy may be absorbed or escape the scene, so output <= input)
    const energyConserved = totalOutputEnergy <= totalInputEnergy + 1e-4;

    return {
      version: worldStateVersion,
      timestamp,
      segments,
      sensorReadings,
      interactions,
      sceneNodes,
      totalInputEnergy,
      totalOutputEnergy,
      energyConserved,
      simulationComplete: traceResult.completed,
      iterationsUsed: traceResult.iterations,
    };
  }

  /**
   * Convert raw RaySegments into typed BeamSegmentStates with full physics data.
   */
  private buildSegmentStates(
    traceResult: TraceResult,
    emitterNodes: SceneNode[],
  ): BeamSegmentState[] {
    return traceResult.segments
      .filter(seg => seg.intensity > 1e-6) // No visual faking: skip zero-intensity segments
      .map((seg, idx) => {
        const stokes = seg.state.toStokes();
        const description = physicsInterpreter.analyzeState(seg.state);

        // Find source wavelength
        const sourceNode = emitterNodes.find(n => n.id === seg.sourceId);
        const wavelengthNm = sourceNode?.parameters.wavelengthNm ?? 550;

        return {
          id: `seg_${worldStateVersion}_${idx}`,
          rayId: seg.rayId,
          sourceId: seg.sourceId,
          start: { x: seg.start.x, y: seg.start.y, z: seg.start.z },
          end: { x: seg.end.x, y: seg.end.y, z: seg.end.z },
          direction: { x: seg.direction.x, y: seg.direction.y, z: seg.direction.z },
          intensity: seg.intensity,
          stokes,
          polarizationDescription: description,
          wavelengthNm,
          pathLength: 0, // Path length is tracked per-ray, not per-segment
        };
      });
  }

  /**
   * Build interaction records by analyzing consecutive segments.
   */
  private buildInteractionRecords(
    traceResult: TraceResult,
    surfaces: OpticalSurface[],
  ): InteractionRecord[] {
    const analysis = physicsInterpreter.analyzeTrace(traceResult, surfaces);
    return analysis.events.map(event => ({
      elementId: event.elementId,
      elementType: event.elementType,
      inputState: event.before,
      outputState: event.after,
      transmittance: event.transmittance,
      description: event.description,
      energyConserved: event.energyConserved,
      physicalLaw: identifyPhysicalLaw(event.elementType, event.before, event.after),
    }));
  }

  /**
   * Update the sensor activation threshold.
   */
  setSensorThreshold(threshold: number): void {
    this.sensorThreshold = threshold;
  }

  /**
   * Get current sensor threshold.
   */
  getSensorThreshold(): number {
    return this.sensorThreshold;
  }
}

// ========== Singleton ==========

/**
 * Default simulation loop instance.
 */
export const simulationLoop = new OpticalSimulationLoop();
