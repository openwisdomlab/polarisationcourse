/**
 * Polarization Grand Unified Physics Engine (偏振光统一物理引擎)
 *
 * A comprehensive, high-fidelity optical physics engine built on:
 *
 * 1. Mathematical Foundation:
 *    - Complex: High-precision complex arithmetic with exp(), sqrt(), pow()
 *    - Matrix2x2: 2×2 complex matrices with adjoint, trace, determinant
 *    - Vector3: 3D spatial vectors for ray tracing
 *
 * 2. Physical State (Coherency Matrix):
 *    - Represents ALL light states: polarized, unpolarized, partial
 *    - Natural handling of depolarization
 *    - Direct mapping to Stokes parameters
 *    - Robust numerical stability (DoP calculation protected)
 *
 * 3. Geometric Framework (Polarization Basis):
 *    - Proper s-p basis for interface interactions
 *    - Singularity handling for normal incidence
 *    - Basis transport through optical systems
 *
 * 4. Physical Laws:
 *    - Fresnel equations with TIR support
 *    - Wave plates (QWP, HWP) with proper Jones matrices
 *    - Polarizers, rotators, beam splitters
 *
 * 5. Ray Tracing Engine:
 *    - BFS-based propagation (no stack overflow)
 *    - Surface intersection and interaction
 *    - Ray splitting and energy tracking
 *
 * 6. Game Integration:
 *    - Victory system for puzzle checking
 *    - Legacy adapter for backward compatibility
 *
 * Usage:
 * ```typescript
 * import {
 *   CoherencyMatrix,
 *   createLinearSource,
 *   IdealPolarizer,
 *   LightTracer
 * } from '@/core/physics/unified';
 *
 * // Create light source
 * const ray = createLinearSource({
 *   id: 'source1',
 *   position: Vector3.ZERO,
 *   direction: Vector3.Z,
 *   intensity: 1.0
 * }, 0); // Horizontal polarization
 *
 * // Create polarizer at 45°
 * const polarizer = new IdealPolarizer(
 *   'pol1',
 *   new Vector3(0, 0, 1),
 *   Vector3.NEG_Z,
 *   new Vector3(1, 1, 0).normalize()
 * );
 *
 * // Trace through system
 * const tracer = new LightTracer();
 * const result = tracer.traceLinear(ray, [polarizer]);
 *
 * // Check output: intensity should be 0.5 (Malus's Law: cos²(45°) = 0.5)
 * console.log(result.finalRay.state.intensity); // ~0.5
 * ```
 */

// ========== Math Core ==========
export { Complex, complexMul, complexAdd, complexMagSq } from '../../math/Complex';
export { Matrix2x2, jonesLinearPolarizer, jonesWavePlate, jonesRotator } from '../../math/Matrix2x2';
export { Vector3, buildOrthonormalBasis, rotateAroundAxis, signedAngle } from '../../math/Vector3';

// ========== Physics State ==========
export {
  CoherencyMatrix,
  HORIZONTAL,
  VERTICAL,
  DIAGONAL,
  ANTIDIAGONAL,
  RIGHT_CIRCULAR,
  LEFT_CIRCULAR,
  UNPOLARIZED
} from './CoherencyMatrix';

// ========== Geometry ==========
export {
  PolarizationBasis,
  incidenceAngle,
  willTIR
} from './PolarizationBasis';

// ========== Fresnel Equations ==========
export {
  solveFresnel,
  brewsterAngle,
  criticalAngle,
  averageReflectance,
  averageTransmittance,
  sellmeierBK7,
  cauchyApprox,
  REFRACTIVE_INDICES,
  type FresnelCoefficients
} from './FresnelSolver';

// ========== Optical Elements ==========
export {
  OpticalSurface,
  IdealPolarizer,
  WavePlate,
  DielectricSurface,
  IdealMirror,
  OpticalRotator,
  PolarizingBeamSplitter,
  Attenuator,
  Depolarizer,
  type SurfaceInteractionResult
} from './OpticalSurface';

// ========== Light Sources ==========
export {
  createLinearSource,
  createUnpolarizedSource,
  createCircularSource,
  createEllipticalSource,
  createPartiallyPolarizedSource,
  createHorizontalSource,
  createVerticalSource,
  createDiagonalSource,
  createAntiDiagonalSource,
  createRCPSource,
  createLCPSource,
  cloneRay,
  createChildRay,
  advanceRay,
  isRayValid,
  generateRayId,
  resetRayIdCounter,
  type LightRay,
  type LightSourceConfig
} from './LightSource';

// ========== Ray Tracer ==========
export {
  LightTracer,
  SimpleScene,
  createTracer,
  traceThrough,
  type TracerConfig,
  type TraceResult,
  type RaySegment,
  type Detection,
  type SceneGeometry,
  type SurfaceIntersection
} from './LightTracer';

// ========== Victory System ==========
export {
  VictorySystem,
  victorySystem,
  createTarget,
  targetFromLegacy,
  DEFAULT_TARGET,
  type TargetConfig,
  type TargetCheckResult,
  type VictoryCheckResult
} from './VictorySystem';

// ========== Physics Interpreter (Semantic Bridge) ==========
export {
  PhysicsInterpreter,
  physicsInterpreter,
  type PolarizationCategory,
  type Handedness,
  type LinearOrientation,
  type PolarizationStateDescription,
  type InteractionEvent,
  type TraceAnalysis,
  type ConservationResult
} from './PhysicsInterpreter';

// ========== Dispersive Wave Plate (Material Physics) ==========
export {
  DispersiveWavePlate,
  birefringenceAtWavelength,
  phaseRetardation,
  requiredThickness,
  BIREFRINGENT_MATERIALS,
  type BirefringentMaterial
} from './DispersiveWavePlate';

// ========== Unified Polarization State ==========
export {
  PolarizationState,
  stokesToJones,
  jonesToStokes,
  validateConservation,
  type JonesRepresentation,
  type StokesRepresentation,
  type EllipseParameters,
  type MaterialContext,
  type PolarizationStateJSON
} from './PolarizationState';

// ========== Legacy Adapter ==========
export {
  fromLightPacket,
  toLightPacket,
  fromWaveLight,
  toWaveLight,
  fromLegacyState,
  rayFromPacket,
  rayFromWaveLight,
  positionFromBlock,
  blockFromPosition,
  normalizeIntensity,
  discretizeIntensity,
  discreteToRadians,
  radiansToDiscrete,
  DIRECTION_TO_VECTOR,
  vectorToDirection,
  type LegacyPolarization,
  type LegacyDirection,
  type LegacyLightPacket,
  type LegacyWaveLight
} from './LegacyAdapter';
