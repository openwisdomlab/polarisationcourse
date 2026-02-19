/**
 * @deprecated **DEPRECATED — Targeted for removal in v2.0 (Q3 2026)**
 *
 * This module is superseded by `src/core/physics/unified` which provides:
 * - CoherencyMatrix for polarization state representation (supports partial polarization)
 * - Matrix2x2 for Jones matrix operations
 * - Complex number class with full arithmetic support
 *
 * For a high-level API, use `createPhysicsAPI()` from `src/core/api.ts`.
 *
 * Migration guide:
 * - Replace JonesVector with CoherencyMatrix.fromJones(ex, ey)
 * - Replace JonesMatrix with Matrix2x2
 * - Replace complex.* functions with Complex class methods
 * - For optical elements, use OpticalSurface subclasses (IdealPolarizer, WavePlate, etc.)
 * - For Malus's Law, use `createPhysicsAPI().applyPolarizer()`
 *
 * Removal timeline:
 * - v1.x: Deprecated, all new code should use unified API
 * - v2.0: Module removed, all references must be migrated
 *
 * @see src/core/api.ts — Public physics API facade
 * @see src/core/physics/unified/CoherencyMatrix.ts
 * @see src/core/math/Matrix2x2.ts
 * @see src/core/math/Complex.ts
 */

/**
 * Jones Calculus - 琼斯矢量/矩阵计算引擎
 *
 * This module provides a complete implementation of Jones calculus for
 * polarized light simulation. Jones vectors represent the complex electric
 * field components (Ex, Ey), and Jones matrices describe how optical
 * elements transform polarization states.
 *
 * Key concepts:
 * - Jones Vector: 2×1 complex vector [Ex, Ey] for fully polarized light
 * - Jones Matrix: 2×2 complex matrix for optical element transformations
 * - Intensity: |Ex|² + |Ey|² (proportional to optical power)
 *
 * Reference: "Polarized Light" by Dennis Goldstein
 */

// ============================================
// Complex Number Types and Operations
// ============================================

/**
 * Complex number representation
 * @property re - Real part
 * @property im - Imaginary part
 */
export interface Complex {
  re: number
  im: number
}

/**
 * Jones Vector: 2×1 complex vector representing polarization state
 * Index 0: Ex (horizontal component)
 * Index 1: Ey (vertical component)
 */
export type JonesVector = [Complex, Complex]

/**
 * Jones Matrix: 2×2 complex matrix for optical transformations
 * [[M00, M01], [M10, M11]]
 */
export type JonesMatrix = [[Complex, Complex], [Complex, Complex]]

/**
 * Complex number arithmetic operations
 */
export const complex = {
  /** Create a complex number from real and imaginary parts */
  create: (re: number, im: number = 0): Complex => ({ re, im }),

  /** Complex zero */
  zero: (): Complex => ({ re: 0, im: 0 }),

  /** Complex one */
  one: (): Complex => ({ re: 1, im: 0 }),

  /** Complex imaginary unit i */
  i: (): Complex => ({ re: 0, im: 1 }),

  /** Addition: a + b */
  add: (a: Complex, b: Complex): Complex => ({
    re: a.re + b.re,
    im: a.im + b.im,
  }),

  /** Subtraction: a - b */
  sub: (a: Complex, b: Complex): Complex => ({
    re: a.re - b.re,
    im: a.im - b.im,
  }),

  /** Multiplication: a × b */
  mul: (a: Complex, b: Complex): Complex => ({
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  }),

  /** Division: a / b */
  div: (a: Complex, b: Complex): Complex => {
    const denom = b.re * b.re + b.im * b.im
    if (denom === 0) return { re: 0, im: 0 }
    return {
      re: (a.re * b.re + a.im * b.im) / denom,
      im: (a.im * b.re - a.re * b.im) / denom,
    }
  },

  /** Scalar multiplication: a × s */
  scale: (a: Complex, s: number): Complex => ({
    re: a.re * s,
    im: a.im * s,
  }),

  /** Complex conjugate: a* */
  conj: (a: Complex): Complex => ({
    re: a.re,
    im: -a.im,
  }),

  /** Magnitude/Absolute value: |a| */
  abs: (a: Complex): number => Math.sqrt(a.re * a.re + a.im * a.im),

  /** Squared magnitude: |a|² (more efficient than abs when squared) */
  abs2: (a: Complex): number => a.re * a.re + a.im * a.im,

  /** Phase angle: arg(a) in radians */
  phase: (a: Complex): number => Math.atan2(a.im, a.re),

  /** Create from polar form: r × e^(iθ) */
  fromPolar: (r: number, theta: number): Complex => ({
    re: r * Math.cos(theta),
    im: r * Math.sin(theta),
  }),

  /** Complex exponential: e^(iθ) */
  exp: (theta: number): Complex => ({
    re: Math.cos(theta),
    im: Math.sin(theta),
  }),

  /** Check if complex number is approximately zero */
  isZero: (a: Complex, epsilon: number = 1e-10): boolean =>
    Math.abs(a.re) < epsilon && Math.abs(a.im) < epsilon,

  /** Check if two complex numbers are approximately equal */
  equals: (a: Complex, b: Complex, epsilon: number = 1e-10): boolean =>
    Math.abs(a.re - b.re) < epsilon && Math.abs(a.im - b.im) < epsilon,

  /** Format complex number as string */
  format: (c: Complex, decimals: number = 3): string => {
    const re = c.re.toFixed(decimals)
    const im = Math.abs(c.im).toFixed(decimals)
    if (Math.abs(c.im) < Math.pow(10, -decimals)) return re
    if (Math.abs(c.re) < Math.pow(10, -decimals))
      return c.im >= 0 ? `${im}i` : `-${im}i`
    return c.im >= 0 ? `${re}+${im}i` : `${re}-${im}i`
  },
}

// ============================================
// Jones Vector Operations
// ============================================

/**
 * Create a Jones vector from two complex numbers
 */
export function jonesVector(ex: Complex, ey: Complex): JonesVector {
  return [ex, ey]
}

/**
 * Create a normalized Jones vector from polarization angle (linear polarization)
 * @param angleDeg - Polarization angle in degrees (0° = horizontal, 90° = vertical)
 * @param intensity - Optional intensity scaling (default 1.0)
 * @returns Normalized Jones vector
 */
export function polarizationToJonesVector(
  angleDeg: number,
  intensity: number = 1.0
): JonesVector {
  const theta = (angleDeg * Math.PI) / 180
  const amplitude = Math.sqrt(intensity)
  return [
    complex.create(amplitude * Math.cos(theta)),
    complex.create(amplitude * Math.sin(theta)),
  ]
}

/**
 * Convert Jones vector back to polarization angle (for linear polarization)
 * @param jones - Jones vector
 * @returns Polarization angle in degrees [0, 180)
 */
export function jonesVectorToPolarization(jones: JonesVector): number {
  const ex = jones[0]
  const ey = jones[1]

  // For linear polarization, the phase difference should be 0 or π
  // The angle is atan2(|Ey|, |Ex|) with sign from phase
  const exAbs = complex.abs(ex)
  const eyAbs = complex.abs(ey)

  if (exAbs < 1e-10 && eyAbs < 1e-10) return 0

  // Calculate angle from magnitudes
  let angle = Math.atan2(eyAbs, exAbs) * (180 / Math.PI)

  // Check phase relationship to determine quadrant
  const phaseDiff = complex.phase(ey) - complex.phase(ex)
  const normalizedPhaseDiff = ((phaseDiff % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)

  // If phase difference is near π, the polarization is in the 90-180° range
  if (normalizedPhaseDiff > Math.PI / 2 && normalizedPhaseDiff < 3 * Math.PI / 2) {
    angle = 180 - angle
  }

  // Normalize to [0, 180)
  return ((angle % 180) + 180) % 180
}

/**
 * Calculate intensity (power) from Jones vector: |Ex|² + |Ey|²
 */
export function jonesIntensity(jones: JonesVector): number {
  return complex.abs2(jones[0]) + complex.abs2(jones[1])
}

/**
 * Normalize a Jones vector to unit intensity
 */
export function normalizeJonesVector(jones: JonesVector): JonesVector {
  const intensity = jonesIntensity(jones)
  if (intensity < 1e-10) return [complex.zero(), complex.zero()]
  const scale = 1 / Math.sqrt(intensity)
  return [complex.scale(jones[0], scale), complex.scale(jones[1], scale)]
}

/**
 * Calculate the degree of polarization ellipticity
 * @returns Object with:
 *   - type: 'linear' | 'circular' | 'elliptical'
 *   - ellipticity: χ in radians (-π/4 to π/4, where 0 = linear, ±π/4 = circular)
 *   - orientation: ψ in degrees (0 to 180, major axis angle)
 *   - handedness: 'right' | 'left' | 'none' (for circular/elliptical)
 */
export function analyzePolarization(jones: JonesVector): {
  type: 'linear' | 'circular' | 'elliptical'
  ellipticity: number
  orientation: number
  handedness: 'right' | 'left' | 'none'
} {
  const ex = jones[0]
  const ey = jones[1]

  const exAbs = complex.abs(ex)
  const eyAbs = complex.abs(ey)
  const delta = complex.phase(ey) - complex.phase(ex)

  // Calculate Stokes parameters (normalized)
  const intensity = exAbs * exAbs + eyAbs * eyAbs
  if (intensity < 1e-10) {
    return { type: 'linear', ellipticity: 0, orientation: 0, handedness: 'none' }
  }

  const s1 = (exAbs * exAbs - eyAbs * eyAbs) / intensity // cos(2ψ)cos(2χ)
  const s2 = (2 * exAbs * eyAbs * Math.cos(delta)) / intensity // sin(2ψ)cos(2χ)
  const s3 = (2 * exAbs * eyAbs * Math.sin(delta)) / intensity // sin(2χ)

  // Calculate ellipticity angle χ
  const chi = 0.5 * Math.asin(Math.max(-1, Math.min(1, s3)))

  // Calculate orientation angle ψ
  const psi = 0.5 * Math.atan2(s2, s1)
  const psiDeg = ((psi * 180) / Math.PI + 180) % 180

  // Determine polarization type
  const chiAbs = Math.abs(chi)
  let type: 'linear' | 'circular' | 'elliptical'
  if (chiAbs < 0.01) {
    type = 'linear'
  } else if (Math.abs(chiAbs - Math.PI / 4) < 0.01) {
    type = 'circular'
  } else {
    type = 'elliptical'
  }

  // Determine handedness (RCP = positive S3, LCP = negative S3)
  let handedness: 'right' | 'left' | 'none'
  if (type === 'linear') {
    handedness = 'none'
  } else {
    handedness = s3 > 0 ? 'right' : 'left'
  }

  return { type, ellipticity: chi, orientation: psiDeg, handedness }
}

/**
 * Standard Jones vectors for common polarization states
 */
export const STANDARD_JONES_VECTORS = {
  /** Horizontal linear polarization (0°) */
  horizontal: (): JonesVector => [complex.one(), complex.zero()],

  /** Vertical linear polarization (90°) */
  vertical: (): JonesVector => [complex.zero(), complex.one()],

  /** +45° linear polarization */
  plus45: (): JonesVector => [
    complex.create(1 / Math.SQRT2),
    complex.create(1 / Math.SQRT2),
  ],

  /** -45° linear polarization (135°) */
  minus45: (): JonesVector => [
    complex.create(1 / Math.SQRT2),
    complex.create(-1 / Math.SQRT2),
  ],

  /** Right circular polarization (RCP) */
  rightCircular: (): JonesVector => [
    complex.create(1 / Math.SQRT2),
    complex.create(0, -1 / Math.SQRT2),
  ],

  /** Left circular polarization (LCP) */
  leftCircular: (): JonesVector => [
    complex.create(1 / Math.SQRT2),
    complex.create(0, 1 / Math.SQRT2),
  ],

  /**
   * ⚠️ DEPRECATED: This is PHYSICALLY INCORRECT representation of unpolarized light!
   *
   * Jones vectors can ONLY represent fully polarized light - they cannot represent
   * unpolarized or partially polarized light. This is a common misconception.
   *
   * For unpolarized light, use CoherencyMatrix.createUnpolarized() instead:
   *   - Unpolarized: J = (I/2) × Identity (Stokes: [1, 0, 0, 0])
   *   - Partially polarized: J = p × J_polarized + (1-p) × J_unpolarized
   *
   * This representation was mistakenly treating unpolarized as the average of H and V,
   * which is physically wrong - it would give DoP = 0 but with non-zero coherency
   * terms that don't represent any real physical state.
   */
  unpolarized: (): JonesVector => [
    complex.create(1 / Math.SQRT2),
    complex.create(1 / Math.SQRT2),
  ],
}

// ============================================
// Jones Matrix Operations
// ============================================

/**
 * Apply Jones matrix to Jones vector: output = M × input
 */
export function applyJonesMatrix(
  matrix: JonesMatrix,
  vec: JonesVector
): JonesVector {
  return [
    complex.add(
      complex.mul(matrix[0][0], vec[0]),
      complex.mul(matrix[0][1], vec[1])
    ),
    complex.add(
      complex.mul(matrix[1][0], vec[0]),
      complex.mul(matrix[1][1], vec[1])
    ),
  ]
}

/**
 * Multiply two Jones matrices: C = A × B
 */
export function multiplyJonesMatrices(
  a: JonesMatrix,
  b: JonesMatrix
): JonesMatrix {
  return [
    [
      complex.add(complex.mul(a[0][0], b[0][0]), complex.mul(a[0][1], b[1][0])),
      complex.add(complex.mul(a[0][0], b[0][1]), complex.mul(a[0][1], b[1][1])),
    ],
    [
      complex.add(complex.mul(a[1][0], b[0][0]), complex.mul(a[1][1], b[1][0])),
      complex.add(complex.mul(a[1][0], b[0][1]), complex.mul(a[1][1], b[1][1])),
    ],
  ]
}

/**
 * Identity matrix (no transformation)
 */
export function identityMatrix(): JonesMatrix {
  return [
    [complex.one(), complex.zero()],
    [complex.zero(), complex.one()],
  ]
}

// ============================================
// Standard Optical Element Jones Matrices
// ============================================

/**
 * Linear polarizer at angle θ (ideal)
 * @param angleDeg - Transmission axis angle in degrees
 */
export function polarizerMatrix(angleDeg: number): JonesMatrix {
  const theta = (angleDeg * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [
    [complex.create(c * c), complex.create(c * s)],
    [complex.create(c * s), complex.create(s * s)],
  ]
}

/**
 * Non-ideal linear polarizer with extinction ratio and transmittance
 * 非理想偏振片，考虑消光比和透过率
 *
 * Real polarizers have:
 * - Finite extinction ratio (ER): some light leaks through perpendicular axis
 * - Principal transmittance < 100%: absorption even for aligned polarization
 *
 * Matrix form: R(-θ) × diag(t1, t2) × R(θ)
 * where t1 = √(principalTransmittance), t2 = t1/√(extinctionRatio)
 *
 * @param angleDeg - Transmission axis angle in degrees
 * @param extinctionRatio - Extinction ratio (e.g., 10000 for 10000:1)
 * @param principalTransmittance - Max transmittance for aligned light (0-1)
 */
export function nonIdealPolarizerMatrix(
  angleDeg: number,
  extinctionRatio: number = 10000,
  principalTransmittance: number = 0.88
): JonesMatrix {
  const theta = (angleDeg * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  const c2 = c * c
  const s2 = s * s
  const cs = c * s

  // Principal transmittance amplitude for passed polarization
  const t1 = Math.sqrt(principalTransmittance)

  // Transmittance amplitude for blocked polarization (leakage)
  const t2 = extinctionRatio === Infinity || extinctionRatio <= 0
    ? 0
    : t1 / Math.sqrt(extinctionRatio)

  // Build matrix: R(-θ) × diag(t1, t2) × R(θ)
  // Result: [t1*c² + t2*s²,  (t1-t2)*cs  ]
  //         [(t1-t2)*cs,     t1*s² + t2*c²]
  return [
    [complex.create(t1 * c2 + t2 * s2), complex.create((t1 - t2) * cs)],
    [complex.create((t1 - t2) * cs), complex.create(t1 * s2 + t2 * c2)],
  ]
}

/**
 * Half-wave plate (λ/2) with fast axis at angle θ
 * Introduces π phase retardation, flips polarization about fast axis
 * @param fastAxisDeg - Fast axis angle in degrees
 */
export function halfWavePlateMatrix(fastAxisDeg: number): JonesMatrix {
  const theta = (fastAxisDeg * Math.PI) / 180
  const c2 = Math.cos(2 * theta)
  const s2 = Math.sin(2 * theta)
  // HWP matrix (ignoring global phase)
  return [
    [complex.create(c2), complex.create(s2)],
    [complex.create(s2), complex.create(-c2)],
  ]
}

/**
 * Quarter-wave plate (λ/4) with fast axis at angle θ
 * Introduces π/2 phase retardation, converts linear ↔ circular
 * @param fastAxisDeg - Fast axis angle in degrees
 */
export function quarterWavePlateMatrix(fastAxisDeg: number): JonesMatrix {
  const theta = (fastAxisDeg * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  const c2 = c * c
  const s2 = s * s
  const cs = c * s

  // QWP introduces π/2 phase delay for slow axis
  // Matrix elements include e^(iπ/4) global phase factor
  return [
    [
      complex.create(c2, s2), // c² + i·s²
      complex.create(cs, -cs), // cs(1-i)
    ],
    [
      complex.create(cs, -cs), // cs(1-i)
      complex.create(s2, c2), // s² + i·c²
    ],
  ]
}

/**
 * General retarder (waveplate) with arbitrary retardation
 *
 * Derived from: M = R(θ) × D(δ) × R(-θ)
 * where R(θ) is rotation and D(δ) = [[e^(-iδ/2), 0], [0, e^(iδ/2)]]
 *
 * Result: [[cos(δ/2) - i·sin(δ/2)·cos(2θ), -i·sin(δ/2)·sin(2θ)],
 *          [-i·sin(δ/2)·sin(2θ), cos(δ/2) + i·sin(δ/2)·cos(2θ)]]
 *
 * @param fastAxisDeg - Fast axis angle in degrees
 * @param retardationDeg - Phase retardation in degrees (90 = λ/4, 180 = λ/2)
 */
export function retarderMatrix(
  fastAxisDeg: number,
  retardationDeg: number
): JonesMatrix {
  const theta = (fastAxisDeg * Math.PI) / 180
  const delta = (retardationDeg * Math.PI) / 180

  // Calculate cos(2θ) and sin(2θ) for the matrix elements
  const cos2theta = Math.cos(2 * theta)
  const sin2theta = Math.sin(2 * theta)

  // Phase retardation components
  const cosHalfDelta = Math.cos(delta / 2)
  const sinHalfDelta = Math.sin(delta / 2)

  // General retarder matrix:
  // M_00 = cos(δ/2) - i·sin(δ/2)·cos(2θ)
  // M_01 = M_10 = -i·sin(δ/2)·sin(2θ)
  // M_11 = cos(δ/2) + i·sin(δ/2)·cos(2θ)
  return [
    [
      complex.create(cosHalfDelta, -sinHalfDelta * cos2theta),
      complex.create(0, -sinHalfDelta * sin2theta),
    ],
    [
      complex.create(0, -sinHalfDelta * sin2theta),
      complex.create(cosHalfDelta, sinHalfDelta * cos2theta),
    ],
  ]
}

/**
 * Optical rotator (Faraday rotator, optically active medium)
 * Rotates polarization plane by angle θ without changing ellipticity
 * @param angleDeg - Rotation angle in degrees
 */
export function rotatorMatrix(angleDeg: number): JonesMatrix {
  const theta = (angleDeg * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [
    [complex.create(c), complex.create(-s)],
    [complex.create(s), complex.create(c)],
  ]
}

/**
 * Partial polarizer (dichroic element) with different transmission for axes
 * @param transmissionX - Amplitude transmission for x-axis (0-1)
 * @param transmissionY - Amplitude transmission for y-axis (0-1)
 * @param angleDeg - Orientation angle in degrees
 */
export function partialPolarizerMatrix(
  transmissionX: number,
  transmissionY: number,
  angleDeg: number = 0
): JonesMatrix {
  const theta = (angleDeg * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)

  // First rotate to element frame, apply transmission, rotate back
  const tx = transmissionX
  const ty = transmissionY

  return [
    [
      complex.create(tx * c * c + ty * s * s),
      complex.create((tx - ty) * c * s),
    ],
    [
      complex.create((tx - ty) * c * s),
      complex.create(tx * s * s + ty * c * c),
    ],
  ]
}

/**
 * Mirror matrix (flips one component, preserves handedness for normal incidence)
 * @param normalAngleDeg - Mirror normal direction in degrees
 */
export function mirrorMatrix(normalAngleDeg: number): JonesMatrix {
  // For a mirror, s-polarization is preserved, p-polarization flips sign
  // This is equivalent to a π phase shift for p-polarized light
  const theta = (normalAngleDeg * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)

  // Reflection matrix in mirror frame then rotated
  return [
    [complex.create(c * c - s * s), complex.create(2 * c * s)],
    [complex.create(2 * c * s), complex.create(s * s - c * c)],
  ]
}

// ============================================
// Utility: Get matrix by component type
// ============================================

export type OpticalElementType =
  | 'polarizer'
  | 'halfWavePlate'
  | 'quarterWavePlate'
  | 'retarder'
  | 'rotator'
  | 'mirror'
  | 'identity'

/**
 * Get Jones matrix for an optical element by type
 * @param type - Element type
 * @param angleDeg - Primary angle (transmission axis, fast axis, etc.)
 * @param retardationDeg - Optional retardation for general retarder
 */
export function getJonesMatrix(
  type: OpticalElementType,
  angleDeg: number,
  retardationDeg?: number
): JonesMatrix {
  switch (type) {
    case 'polarizer':
      return polarizerMatrix(angleDeg)
    case 'halfWavePlate':
      return halfWavePlateMatrix(angleDeg)
    case 'quarterWavePlate':
      return quarterWavePlateMatrix(angleDeg)
    case 'retarder':
      return retarderMatrix(angleDeg, retardationDeg ?? 90)
    case 'rotator':
      return rotatorMatrix(angleDeg)
    case 'mirror':
      return mirrorMatrix(angleDeg)
    case 'identity':
    default:
      return identityMatrix()
  }
}
