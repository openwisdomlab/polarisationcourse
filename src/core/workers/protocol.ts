/**
 * Worker Communication Protocol (工作线程通信协议)
 *
 * Typed message protocol for Main Thread ↔ Physics Worker communication.
 * The Physics Worker is a pure computation environment — it must NEVER
 * import Three.js, React, or any DOM API.
 *
 * Data flow:
 *   Main Thread → Worker: UPDATE_SCENE, SET_SURROGATE_MODEL, TICK
 *   Worker → Main Thread: WORLD_STATE, DIAGNOSTIC, ERROR
 *
 * Serialization:
 *   - StokesVector → [S0, S1, S2, S3] (number[4])
 *   - MuellerMatrix → number[16] (row-major)
 *   - Use structured clone by default (simpler to debug)
 *   - SharedArrayBuffer + Atomics only if postMessage overhead > 2ms
 */

// ========== Shared Data Types ==========

/**
 * Serialized Stokes vector (plain array for structured clone).
 */
export type SerializedStokes = [number, number, number, number];

/**
 * A serialized optical device in the scene graph.
 */
export interface SerializedDevice {
  /** Unique identifier */
  id: string;
  /** Device type */
  type: DeviceType;
  /** Position [x, y, z] */
  position: [number, number, number];
  /** Orientation normal [nx, ny, nz] */
  normal: [number, number, number];
  /** Device-specific parameters */
  params: DeviceParams;
}

export type DeviceType =
  | 'emitter'
  | 'polarizer'
  | 'quarterWavePlate'
  | 'halfWavePlate'
  | 'generalRetarder'
  | 'rotator'
  | 'mirror'
  | 'splitter'
  | 'attenuator'
  | 'sensor'
  | 'depolarizer'
  | 'lens'
  | 'thinFilm';

export interface DeviceParams {
  /** Angle in radians (transmission axis, fast axis, rotation, etc.) */
  angle?: number;
  /** Retardance in radians (for general retarder) */
  retardance?: number;
  /** Wavelength in nm */
  wavelength?: number;
  /** Intensity (0-1 normalized) */
  intensity?: number;
  /** Whether unpolarized */
  unpolarized?: boolean;
  /** Polarization angle in radians (for emitters) */
  polarizationAngle?: number;
  /** Transmission factor (0-1) */
  transmission?: number;
  /** Depolarization factor (0-1) */
  depolarizationFactor?: number;
  /** Refractive indices [n1, n2] for interfaces */
  refractiveIndices?: [number, number];
  /** Split type for beam splitters */
  splitType?: 'PBS' | 'NPBS' | 'Calcite';
  /** Thin film parameters */
  thinFilm?: {
    nFilm: number;
    thickness: number;
    nSubstrate: number;
  };
}

/**
 * The complete serialized scene graph sent to the worker.
 */
export interface SerializedSceneGraph {
  /** Scene version (monotonically increasing) */
  version: number;
  /** All devices in the scene */
  devices: SerializedDevice[];
  /** Global simulation parameters */
  config: SimulationConfig;
}

export interface SimulationConfig {
  /** Maximum number of ray bounces */
  maxBounces: number;
  /** Minimum intensity threshold for ray termination */
  intensityThreshold: number;
  /** Scene boundary size */
  sceneBoundary: number;
  /** Whether to run surrogate models for complex materials */
  enableSurrogate: boolean;
}

// ========== Light Segment (Output) ==========

/**
 * A single light segment in the computed WorldState.
 */
export interface LightSegment {
  /** Segment ID */
  id: string;
  /** Source emitter ID */
  sourceId: string;
  /** Start position [x, y, z] */
  start: [number, number, number];
  /** End position [x, y, z] */
  end: [number, number, number];
  /** Stokes vector at this segment */
  stokes: SerializedStokes;
  /** Wavelength in nm */
  wavelength: number;
  /** Intensity (S0) */
  intensity: number;
}

/**
 * State of a device after simulation (what happened at this device).
 */
export interface DeviceState {
  /** Device ID */
  id: string;
  /** Device type */
  type: DeviceType;
  /** Device parameters */
  params: DeviceParams;
  /** Input Stokes vector (null if no light arrived) */
  inputStokes: SerializedStokes | null;
  /** Output Stokes vector(s) (null if blocked, array for splitters) */
  outputStokes: SerializedStokes[] | null;
}

/**
 * Diagnostic information about the simulation run.
 */
export interface DiagnosticInfo {
  /** Number of iterations used */
  iterations: number;
  /** Whether the simulation completed before hitting limits */
  completed: boolean;
  /** Constraint violations detected */
  violations: ConstraintViolation[];
  /** Surrogate model fallback activations */
  surrogateFallbacks: string[];
  /** Performance timing in ms */
  timingMs: number;
}

export interface ConstraintViolation {
  /** Where the violation occurred */
  location: string;
  /** Description of the violation */
  message: string;
  /** The invalid Stokes vector */
  stokes: SerializedStokes;
  /** The clamped (corrected) Stokes vector */
  clampedStokes: SerializedStokes;
}

// ========== WorldState (The Inter-Layer Data Contract) ==========

/**
 * The immutable WorldState — sole bridge between physics and rendering.
 * The Visualization Layer must NEVER import from physics directly.
 */
export interface WorldState {
  /** Monotonically increasing timestamp */
  timestamp: number;
  /** All light segments in the scene */
  segments: LightSegment[];
  /** Device states after simulation */
  devices: DeviceState[];
  /** Optional diagnostic information */
  diagnostics?: DiagnosticInfo;
}

// ========== Worker Command Messages (Main → Worker) ==========

export interface UpdateSceneCommand {
  type: 'UPDATE_SCENE';
  payload: SerializedSceneGraph;
}

export interface SetSurrogateModelCommand {
  type: 'SET_SURROGATE_MODEL';
  /** ONNX model bytes (transferred, not copied) */
  payload: ArrayBuffer;
}

export interface TickCommand {
  type: 'TICK';
}

export type WorkerCommand =
  | UpdateSceneCommand
  | SetSurrogateModelCommand
  | TickCommand;

// ========== Worker Response Messages (Worker → Main) ==========

export interface WorldStateResponse {
  type: 'WORLD_STATE';
  payload: WorldState;
}

export interface DiagnosticResponse {
  type: 'DIAGNOSTIC';
  payload: DiagnosticInfo;
}

export interface ErrorResponse {
  type: 'ERROR';
  payload: {
    code: string;
    message: string;
  };
}

export type WorkerResponse =
  | WorldStateResponse
  | DiagnosticResponse
  | ErrorResponse;

// ========== Type Guards ==========

export function isWorldStateResponse(msg: WorkerResponse): msg is WorldStateResponse {
  return msg.type === 'WORLD_STATE';
}

export function isDiagnosticResponse(msg: WorkerResponse): msg is DiagnosticResponse {
  return msg.type === 'DIAGNOSTIC';
}

export function isErrorResponse(msg: WorkerResponse): msg is ErrorResponse {
  return msg.type === 'ERROR';
}
