/**
 * Data Analysis Tools - Scientific Curve Fitting
 * 数据分析工具 - 科学曲线拟合
 *
 * Implements least-squares fitting for:
 * - Linear regression: y = mx + b
 * - Cosine-squared (Malus's Law): I = I₀ × cos²(θ - θ₀) + offset
 */

import { DataPoint, FitResult } from '@/stores/labStore'

/**
 * Linear least-squares fit: y = slope * x + intercept
 * 线性最小二乘拟合
 */
export function linearFit(data: DataPoint[]): FitResult | null {
  if (data.length < 2) return null

  const n = data.length
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0

  for (const point of data) {
    sumX += point.angle
    sumY += point.intensity
    sumXY += point.angle * point.intensity
    sumX2 += point.angle * point.angle
    sumY2 += point.intensity * point.intensity
  }

  const denominator = n * sumX2 - sumX * sumX
  if (Math.abs(denominator) < 1e-10) return null

  const slope = (n * sumXY - sumX * sumY) / denominator
  const intercept = (sumY * sumX2 - sumX * sumXY) / denominator

  // Calculate R² (coefficient of determination)
  const meanY = sumY / n
  let ssTot = 0, ssRes = 0

  const modelValues: number[] = []
  const residuals: number[] = []

  for (const point of data) {
    const predicted = slope * point.angle + intercept
    modelValues.push(predicted)
    residuals.push(point.intensity - predicted)
    ssTot += (point.intensity - meanY) ** 2
    ssRes += (point.intensity - predicted) ** 2
  }

  const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0

  return {
    type: 'linear',
    params: { slope, intercept },
    rSquared,
    residuals,
    modelValues,
  }
}

/**
 * Cosine-squared fit for Malus's Law: I = I₀ × cos²(θ - θ₀) + offset
 * 马吕斯定律余弦平方拟合
 *
 * Uses grid search + Newton-Raphson optimization for robust fitting.
 */
export function cosineFit(data: DataPoint[]): FitResult | null {
  if (data.length < 3) return null

  // Convert angles to radians for fitting
  const toRad = (deg: number) => deg * Math.PI / 180

  // Model function: I = amplitude * cos²(θ - phase) + offset
  const model = (angle: number, amp: number, phase: number, offset: number) => {
    const theta = toRad(angle - phase)
    return amp * Math.cos(theta) ** 2 + offset
  }

  // Calculate sum of squared residuals
  const ssr = (amp: number, phase: number, offset: number) => {
    return data.reduce((sum, p) => {
      const pred = model(p.angle, amp, phase, offset)
      return sum + (p.intensity - pred) ** 2
    }, 0)
  }

  // Initial guesses from data statistics
  const intensities = data.map(p => p.intensity)
  const maxI = Math.max(...intensities)
  const minI = Math.min(...intensities)
  const meanI = intensities.reduce((a, b) => a + b, 0) / intensities.length

  // Grid search for initial phase estimate
  let bestPhase = 0
  let bestSSR = Infinity

  for (let phase = 0; phase < 180; phase += 5) {
    const amp = (maxI - minI)
    const offset = minI
    const currentSSR = ssr(amp, phase, offset)
    if (currentSSR < bestSSR) {
      bestSSR = currentSSR
      bestPhase = phase
    }
  }

  // Refine with gradient descent
  let amplitude = maxI - minI
  let phase = bestPhase
  let offset = minI

  const learningRate = 0.1
  const iterations = 500
  const epsilon = 1e-6

  for (let iter = 0; iter < iterations; iter++) {
    // Numerical gradients
    const dAmp = (ssr(amplitude + epsilon, phase, offset) - ssr(amplitude - epsilon, phase, offset)) / (2 * epsilon)
    const dPhase = (ssr(amplitude, phase + epsilon, offset) - ssr(amplitude, phase - epsilon, offset)) / (2 * epsilon)
    const dOffset = (ssr(amplitude, phase, offset + epsilon) - ssr(amplitude, phase, offset - epsilon)) / (2 * epsilon)

    amplitude -= learningRate * dAmp * 0.01
    phase -= learningRate * dPhase * 0.1
    offset -= learningRate * dOffset * 0.01

    // Constrain parameters
    amplitude = Math.max(0, amplitude)
    offset = Math.max(0, offset)

    // Normalize phase to 0-180 range
    while (phase < 0) phase += 180
    while (phase >= 180) phase -= 180
  }

  // Calculate final statistics
  const modelValues: number[] = []
  const residuals: number[] = []
  let ssTot = 0, ssRes = 0

  for (const point of data) {
    const predicted = model(point.angle, amplitude, phase, offset)
    modelValues.push(predicted)
    residuals.push(point.intensity - predicted)
    ssTot += (point.intensity - meanI) ** 2
    ssRes += (point.intensity - predicted) ** 2
  }

  const rSquared = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0

  return {
    type: 'cosine',
    params: {
      amplitude,
      phase,
      offset,
    },
    rSquared,
    residuals,
    modelValues,
  }
}

/**
 * Generate model curve points for plotting
 * 生成模型曲线点用于绘图
 */
export function generateModelCurve(
  fitResult: FitResult,
  minAngle: number = 0,
  maxAngle: number = 180,
  numPoints: number = 100
): { angle: number; intensity: number }[] {
  const points: { angle: number; intensity: number }[] = []
  const step = (maxAngle - minAngle) / (numPoints - 1)

  for (let i = 0; i < numPoints; i++) {
    const angle = minAngle + i * step
    let intensity: number

    if (fitResult.type === 'linear') {
      const { slope = 0, intercept = 0 } = fitResult.params
      intensity = slope * angle + intercept
    } else {
      // Cosine fit
      const { amplitude = 0, phase = 0, offset = 0 } = fitResult.params
      const theta = (angle - phase) * Math.PI / 180
      intensity = amplitude * Math.cos(theta) ** 2 + offset
    }

    points.push({ angle, intensity })
  }

  return points
}

/**
 * Calculate theoretical Malus's Law value
 * 计算马吕斯定律理论值
 */
export function malusLaw(
  inputIntensity: number,
  polarizerAngle: number,
  lightPolarization: number = 0
): number {
  const angleDiff = (polarizerAngle - lightPolarization) * Math.PI / 180
  return inputIntensity * Math.cos(angleDiff) ** 2
}

/**
 * Generate theoretical Malus's Law data for comparison
 * 生成马吕斯定律理论数据用于对比
 */
export function generateTheoreticalMalusData(
  I0: number = 100,
  polarizationOffset: number = 0,
  numPoints: number = 37 // 0° to 180° in 5° steps
): DataPoint[] {
  const data: DataPoint[] = []

  for (let i = 0; i < numPoints; i++) {
    const angle = (i * 180) / (numPoints - 1)
    const intensity = malusLaw(I0, angle, polarizationOffset)
    data.push({
      id: `theory-${i}`,
      angle,
      intensity,
    })
  }

  return data
}

/**
 * Box-Muller transform for Gaussian random numbers
 * Box-Muller变换生成高斯随机数
 */
function gaussianRandom(mean: number = 0, stdDev: number = 1): number {
  const u1 = Math.random()
  const u2 = Math.random()
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  return z0 * stdDev + mean
}

/**
 * Noise model parameters for realistic experimental simulation
 * 真实实验模拟的噪声模型参数
 */
export interface NoiseParams {
  /** Read noise (Gaussian, detector electronics) - 读出噪声 */
  readNoise: number
  /** Shot noise factor (√I dependence) - 散粒噪声系数 */
  shotNoiseFactor: number
  /** Systematic bias (calibration error) - 系统偏移 */
  systematicBias: number
}

/** Default noise parameters matching typical photodetector */
export const DEFAULT_NOISE_PARAMS: NoiseParams = {
  readNoise: 2.0,        // ±2% baseline noise
  shotNoiseFactor: 0.1,  // Shot noise proportional to √intensity
  systematicBias: 0,     // No systematic error by default
}

/**
 * Add realistic noise to data (for simulation mode)
 * 添加真实噪声到数据（用于模拟模式）
 *
 * Uses physically accurate noise model:
 * - Shot noise: σ_shot = k × √I (Poisson statistics)
 * - Read noise: σ_read = constant (Gaussian, detector electronics)
 * - Total: σ_total = √(σ_shot² + σ_read²)
 *
 * @deprecated Use addRealisticNoise for more accurate simulation
 */
export function addNoise(data: DataPoint[], noiseLevel: number = 5): DataPoint[] {
  // Legacy function now uses Gaussian noise instead of uniform
  return data.map(point => {
    const noise = gaussianRandom(0, noiseLevel)
    const newIntensity = Math.max(0, point.intensity + noise)
    return {
      ...point,
      intensity: newIntensity,
      uncertainty: noiseLevel,
    }
  })
}

/**
 * Add realistic experimental noise with proper physics model
 * 添加具有正确物理模型的真实实验噪声
 *
 * Noise sources in optical experiments:
 * 1. Shot noise (散粒噪声): From quantum nature of light, follows √I
 * 2. Read noise (读出噪声): Electronic noise in detector, Gaussian
 * 3. Systematic bias (系统偏移): Calibration errors
 */
export function addRealisticNoise(
  data: DataPoint[],
  params: NoiseParams = DEFAULT_NOISE_PARAMS
): DataPoint[] {
  return data.map(point => {
    // Shot noise: proportional to √intensity (Poisson → Gaussian for large N)
    const shotNoiseStd = params.shotNoiseFactor * Math.sqrt(Math.max(1, point.intensity))
    const shotNoise = gaussianRandom(0, shotNoiseStd)

    // Read noise: constant Gaussian (thermal noise in electronics)
    const readNoise = gaussianRandom(0, params.readNoise)

    // Systematic bias: constant offset (e.g., dark current, stray light)
    const bias = params.systematicBias

    // Total noise (independent sources add in quadrature for uncertainty)
    const totalNoise = shotNoise + readNoise + bias
    const uncertainty = Math.sqrt(shotNoiseStd ** 2 + params.readNoise ** 2)

    const newIntensity = Math.max(0, Math.min(100, point.intensity + totalNoise))

    return {
      ...point,
      intensity: newIntensity,
      uncertainty: uncertainty,
    }
  })
}

/**
 * Calculate extinction ratio from fit
 * 从拟合结果计算消光比
 */
export function calculateExtinctionRatio(fitResult: FitResult): number | null {
  if (fitResult.type !== 'cosine') return null

  const { amplitude = 0, offset = 0 } = fitResult.params
  const Imax = amplitude + offset
  const Imin = offset

  if (Imin <= 0) return Infinity
  return Imax / Imin
}
