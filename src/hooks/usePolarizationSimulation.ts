/**
 * usePolarizationSimulation - React hook for polarization physics calculations
 *
 * This hook provides a clean interface to the unified physics engine for demos.
 * It handles common polarization calculations without requiring full ray tracing.
 *
 * Usage:
 * ```tsx
 * const { simulatePolarizer, simulatePolarizerChain } = usePolarizationSimulation()
 *
 * // Single polarizer (Malus's Law)
 * const result = simulatePolarizer(inputAngle, polarizerAngle, inputIntensity)
 * // result.intensity = inputIntensity * cos²(inputAngle - polarizerAngle)
 *
 * // Chain of polarizers
 * const chainResult = simulatePolarizerChain(polarizerAngles, isUnpolarizedInput)
 * ```
 */

import { useCallback } from 'react'
import { CoherencyMatrix } from '@/core/physics/unified/CoherencyMatrix'
import { Matrix2x2 } from '@/core/math/Matrix2x2'
import { Complex } from '@/core/math/Complex'

// Degree to radian conversion
const DEG_TO_RAD = Math.PI / 180

export interface PolarizationResult {
  /** Output intensity (0-1 normalized) */
  intensity: number
  /** Output polarization angle in degrees */
  polarizationAngle: number
  /** Degree of polarization (0-1) */
  dop: number
  /** Stokes parameters [S0, S1, S2, S3] */
  stokes: [number, number, number, number]
  /** Transmission ratio (output/input) */
  transmission: number
}

export interface PolarizerChainResult {
  /** Final result after all polarizers */
  final: PolarizationResult
  /** Intermediate results after each polarizer */
  stages: PolarizationResult[]
}

/**
 * Create Jones matrix for linear polarizer at given angle
 */
function createPolarizerMatrix(angleDeg: number): Matrix2x2 {
  const theta = angleDeg * DEG_TO_RAD
  const c = Math.cos(theta)
  const s = Math.sin(theta)

  // Jones matrix: P(θ) = [c² cs; cs s²]
  return new Matrix2x2(
    new Complex(c * c), new Complex(c * s),
    new Complex(c * s), new Complex(s * s)
  )
}

/**
 * Convert CoherencyMatrix to PolarizationResult
 */
function toResult(matrix: CoherencyMatrix, inputIntensity: number): PolarizationResult {
  const stokes = matrix.toStokes()
  return {
    intensity: matrix.intensity,
    polarizationAngle: matrix.orientationAngle * 180 / Math.PI,
    dop: matrix.degreeOfPolarization,
    stokes,
    transmission: inputIntensity > 0 ? matrix.intensity / inputIntensity : 0
  }
}

export function usePolarizationSimulation() {
  /**
   * Simulate light passing through a single polarizer (Malus's Law)
   *
   * @param inputAngleDeg - Input polarization angle in degrees (0 = horizontal)
   * @param polarizerAngleDeg - Polarizer transmission axis angle in degrees
   * @param inputIntensity - Input light intensity (default 1.0)
   * @returns PolarizationResult with output intensity and state
   */
  const simulatePolarizer = useCallback((
    inputAngleDeg: number,
    polarizerAngleDeg: number,
    inputIntensity: number = 1.0
  ): PolarizationResult => {
    // Create input state as linearly polarized light
    const inputState = CoherencyMatrix.createLinear(
      inputIntensity,
      inputAngleDeg * DEG_TO_RAD
    )

    // Apply polarizer using Jones matrix
    const polarizerMatrix = createPolarizerMatrix(polarizerAngleDeg)
    const outputState = inputState.applyOperator(polarizerMatrix)

    return toResult(outputState, inputIntensity)
  }, [])

  /**
   * Simulate unpolarized light through a single polarizer
   * (Always produces 50% intensity, polarized along transmission axis)
   *
   * @param polarizerAngleDeg - Polarizer transmission axis angle in degrees
   * @param inputIntensity - Input light intensity (default 1.0)
   */
  const simulateUnpolarizedThroughPolarizer = useCallback((
    polarizerAngleDeg: number,
    inputIntensity: number = 1.0
  ): PolarizationResult => {
    // Unpolarized light through polarizer gives 50% intensity
    const inputState = CoherencyMatrix.createUnpolarized(inputIntensity)
    const polarizerMatrix = createPolarizerMatrix(polarizerAngleDeg)
    const outputState = inputState.applyOperator(polarizerMatrix)

    return toResult(outputState, inputIntensity)
  }, [])

  /**
   * Simulate light through a chain of polarizers
   *
   * @param polarizerAnglesDeg - Array of polarizer angles in degrees
   * @param options - Configuration options
   * @returns PolarizerChainResult with final and intermediate results
   */
  const simulatePolarizerChain = useCallback((
    polarizerAnglesDeg: (number | null)[],
    options: {
      isUnpolarizedInput?: boolean
      inputIntensity?: number
      inputAngleDeg?: number
    } = {}
  ): PolarizerChainResult => {
    const {
      isUnpolarizedInput = true,
      inputIntensity = 1.0,
      inputAngleDeg = 0
    } = options

    // Filter out null values (disabled polarizers)
    const activeAngles = polarizerAnglesDeg.filter((a): a is number => a !== null)

    if (activeAngles.length === 0) {
      const noChangeState = isUnpolarizedInput
        ? CoherencyMatrix.createUnpolarized(inputIntensity)
        : CoherencyMatrix.createLinear(inputIntensity, inputAngleDeg * DEG_TO_RAD)
      const result = toResult(noChangeState, inputIntensity)
      return { final: result, stages: [] }
    }

    // Start with input state
    let currentState = isUnpolarizedInput
      ? CoherencyMatrix.createUnpolarized(inputIntensity)
      : CoherencyMatrix.createLinear(inputIntensity, inputAngleDeg * DEG_TO_RAD)

    const stages: PolarizationResult[] = []

    // Apply each polarizer
    for (const angleDeg of activeAngles) {
      const polarizerMatrix = createPolarizerMatrix(angleDeg)
      currentState = currentState.applyOperator(polarizerMatrix)
      stages.push(toResult(currentState, inputIntensity))
    }

    return {
      final: stages[stages.length - 1],
      stages
    }
  }, [])

  /**
   * Calculate Malus's Law curve data points
   * Returns array of {angle, transmission} for plotting
   *
   * @param inputAngleDeg - Input polarization angle in degrees
   * @param startAngle - Start angle for curve (default 0)
   * @param endAngle - End angle for curve (default 180)
   * @param steps - Number of data points (default 181)
   */
  const calculateMalusCurve = useCallback((
    inputAngleDeg: number,
    startAngle: number = 0,
    endAngle: number = 180,
    steps: number = 181
  ): Array<{ angle: number; transmission: number }> => {
    const data: Array<{ angle: number; transmission: number }> = []
    const inputState = CoherencyMatrix.createLinear(1.0, inputAngleDeg * DEG_TO_RAD)

    for (let i = 0; i < steps; i++) {
      const polarizerAngle = startAngle + (endAngle - startAngle) * (i / (steps - 1))
      const polarizerMatrix = createPolarizerMatrix(polarizerAngle)
      const outputState = inputState.applyOperator(polarizerMatrix)

      data.push({
        angle: polarizerAngle,
        transmission: outputState.intensity
      })
    }

    return data
  }, [])

  /**
   * Simulate waveplate effect on polarized light
   *
   * @param inputAngleDeg - Input polarization angle in degrees
   * @param fastAxisAngleDeg - Fast axis angle in degrees
   * @param retardance - Phase retardance in radians (π/2 for QWP, π for HWP)
   * @param inputIntensity - Input intensity
   */
  const simulateWaveplate = useCallback((
    inputAngleDeg: number,
    fastAxisAngleDeg: number,
    retardance: number,
    inputIntensity: number = 1.0
  ): PolarizationResult => {
    const inputState = CoherencyMatrix.createLinear(
      inputIntensity,
      inputAngleDeg * DEG_TO_RAD
    )

    const theta = fastAxisAngleDeg * DEG_TO_RAD
    const c = Math.cos(theta)
    const s = Math.sin(theta)
    const c2 = c * c
    const s2 = s * s
    const cs = c * s

    // Waveplate Jones matrix in lab frame
    const eid = Complex.exp(retardance)
    const eidm1 = eid.sub(Complex.ONE)

    const a00 = new Complex(c2).add(eid.scale(s2))
    const a01 = new Complex(cs).mul(eidm1)
    const a11 = new Complex(s2).add(eid.scale(c2))

    const waveplateMatrix = new Matrix2x2(a00, a01, a01, a11)
    const outputState = inputState.applyOperator(waveplateMatrix)

    return toResult(outputState, inputIntensity)
  }, [])

  /**
   * Simulate birefringent crystal (calcite-like)
   * Splits input into o-ray and e-ray based on polarization relative to optical axis
   *
   * @param inputAngleDeg - Input polarization angle in degrees
   * @param opticalAxisAngleDeg - Optical axis angle in degrees
   * @param inputIntensity - Input intensity
   */
  const simulateBirefringence = useCallback((
    inputAngleDeg: number,
    opticalAxisAngleDeg: number,
    inputIntensity: number = 1.0
  ): { oRay: PolarizationResult; eRay: PolarizationResult } => {
    const inputState = CoherencyMatrix.createLinear(
      inputIntensity,
      inputAngleDeg * DEG_TO_RAD
    )

    // O-ray: perpendicular to optical axis
    const oAxisAngle = opticalAxisAngleDeg + 90
    const oPolarizerMatrix = createPolarizerMatrix(oAxisAngle)
    const oRayState = inputState.applyOperator(oPolarizerMatrix)

    // E-ray: parallel to optical axis
    const ePolarizerMatrix = createPolarizerMatrix(opticalAxisAngleDeg)
    const eRayState = inputState.applyOperator(ePolarizerMatrix)

    return {
      oRay: toResult(oRayState, inputIntensity),
      eRay: toResult(eRayState, inputIntensity)
    }
  }, [])

  return {
    simulatePolarizer,
    simulateUnpolarizedThroughPolarizer,
    simulatePolarizerChain,
    calculateMalusCurve,
    simulateWaveplate,
    simulateBirefringence
  }
}

/**
 * Direct calculation functions for use outside React components
 * These can be used in useMemo without hook rules violations
 */
export const PolarizationPhysics = {
  /**
   * Calculate intensity after polarizer (Malus's Law)
   * I = I₀ × cos²(θ₁ - θ₂)
   */
  malusIntensity(inputAngleDeg: number, polarizerAngleDeg: number, inputIntensity = 1.0): number {
    const inputState = CoherencyMatrix.createLinear(inputIntensity, inputAngleDeg * DEG_TO_RAD)
    const polarizerMatrix = createPolarizerMatrix(polarizerAngleDeg)
    return inputState.applyOperator(polarizerMatrix).intensity
  },

  /**
   * Unpolarized light through polarizer
   * Always 50% of input intensity
   */
  unpolarizedThroughPolarizer(polarizerAngleDeg: number, inputIntensity = 1.0): number {
    const inputState = CoherencyMatrix.createUnpolarized(inputIntensity)
    const polarizerMatrix = createPolarizerMatrix(polarizerAngleDeg)
    return inputState.applyOperator(polarizerMatrix).intensity
  },

  /**
   * Full polarizer chain calculation
   */
  polarizerChain(
    angles: (number | null)[],
    isUnpolarizedInput = true,
    inputIntensity = 1.0,
    inputAngleDeg = 0
  ): { intensity: number; polarizationAngle: number; stages: number[] } {
    const activeAngles = angles.filter((a): a is number => a !== null)

    if (activeAngles.length === 0) {
      return { intensity: inputIntensity, polarizationAngle: inputAngleDeg, stages: [] }
    }

    let currentState = isUnpolarizedInput
      ? CoherencyMatrix.createUnpolarized(inputIntensity)
      : CoherencyMatrix.createLinear(inputIntensity, inputAngleDeg * DEG_TO_RAD)

    const stages: number[] = []

    for (const angleDeg of activeAngles) {
      const polarizerMatrix = createPolarizerMatrix(angleDeg)
      currentState = currentState.applyOperator(polarizerMatrix)
      stages.push(currentState.intensity)
    }

    return {
      intensity: currentState.intensity,
      polarizationAngle: currentState.orientationAngle * 180 / Math.PI,
      stages
    }
  },

  /**
   * Birefringence split (o-ray and e-ray intensities)
   */
  birefringenceSplit(
    inputAngleDeg: number,
    opticalAxisAngleDeg: number,
    inputIntensity = 1.0
  ): { oIntensity: number; eIntensity: number } {
    const inputState = CoherencyMatrix.createLinear(inputIntensity, inputAngleDeg * DEG_TO_RAD)

    const oPolarizerMatrix = createPolarizerMatrix(opticalAxisAngleDeg + 90)
    const ePolarizerMatrix = createPolarizerMatrix(opticalAxisAngleDeg)

    return {
      oIntensity: inputState.applyOperator(oPolarizerMatrix).intensity,
      eIntensity: inputState.applyOperator(ePolarizerMatrix).intensity
    }
  }
}

export default usePolarizationSimulation
