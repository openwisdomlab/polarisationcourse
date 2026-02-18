/**
 * Physics Accuracy Benchmarks (物理精度基准测试)
 *
 * Golden test cases verifying correctness of:
 * - Malus's Law (偏振片强度计算)
 * - Jones Vector operations
 * - Beam splitting energy conservation
 */

import { describe, it, expect } from 'vitest'
import {
  createLegacyJonesVector,
  legacyJonesIntensity,
  legacyJonesToAngle,
  analyzeLegacyJones,
  legacyComplex,
} from '../../core/physics/bridge'
import {
  calculatePBSSplit,
  calculateCalciteSplit,
  calculateNPBSSplit,
  calculateMalusLaw,
} from '../../stores/benchPhysicsCalc'

describe('马吕斯定律精度测试', () => {
  it('平行偏振器: cos²(0°) = 1.0', () => {
    const result = calculateMalusLaw(100, 0)
    expect(result).toBeCloseTo(100, 5)
  })

  it('正交偏振器: cos²(90°) = 0.0', () => {
    const result = calculateMalusLaw(100, 90)
    expect(result).toBeCloseTo(0, 5)
  })

  it('45度: cos²(45°) = 0.5', () => {
    const result = calculateMalusLaw(100, 45)
    expect(result).toBeCloseTo(50, 1)
  })

  it('30度: cos²(30°) = 0.75', () => {
    const result = calculateMalusLaw(100, 30)
    expect(result).toBeCloseTo(75, 1)
  })

  it('60度: cos²(60°) = 0.25', () => {
    const result = calculateMalusLaw(100, 60)
    expect(result).toBeCloseTo(25, 1)
  })
})

describe('Jones 向量运算精度', () => {
  it('水平偏振: (1, 0)', () => {
    const jones = createLegacyJonesVector(0, 1)
    expect(jones[0].re).toBeCloseTo(1, 5)
    expect(jones[0].im).toBeCloseTo(0, 5)
    expect(jones[1].re).toBeCloseTo(0, 5)
    expect(jones[1].im).toBeCloseTo(0, 5)
  })

  it('垂直偏振: (0, 1)', () => {
    const jones = createLegacyJonesVector(90, 1)
    expect(jones[0].re).toBeCloseTo(0, 5)
    expect(jones[1].re).toBeCloseTo(1, 5)
  })

  it('45度偏振: (1/√2, 1/√2)', () => {
    const jones = createLegacyJonesVector(45, 1)
    const expected = 1 / Math.SQRT2
    expect(jones[0].re).toBeCloseTo(expected, 5)
    expect(jones[1].re).toBeCloseTo(expected, 5)
  })

  it('强度归一化: |E|² = normalizedIntensity', () => {
    const jones = createLegacyJonesVector(30, 0.5)
    const intensity = legacyJonesIntensity(jones)
    expect(intensity).toBeCloseTo(0.5, 5)
  })

  it('零强度返回零向量', () => {
    const jones = createLegacyJonesVector(45, 0)
    expect(legacyJonesIntensity(jones)).toBeCloseTo(0, 10)
  })

  it('角度提取往返精度', () => {
    const testAngles = [0, 15, 30, 45, 60, 75, 90]
    for (const angle of testAngles) {
      const jones = createLegacyJonesVector(angle, 1)
      const extracted = legacyJonesToAngle(jones)
      expect(extracted).toBeCloseTo(angle, 3)
    }
  })
})

describe('偏振分析精度', () => {
  it('水平线偏振识别', () => {
    const jones = createLegacyJonesVector(0, 1)
    const analysis = analyzeLegacyJones(jones)
    expect(analysis.type).toBe('linear')
    expect(analysis.handedness).toBe('none')
    expect(analysis.angle).toBeCloseTo(0, 3)
  })

  it('45度线偏振识别', () => {
    const jones = createLegacyJonesVector(45, 1)
    const analysis = analyzeLegacyJones(jones)
    expect(analysis.type).toBe('linear')
    expect(analysis.angle).toBeCloseTo(45, 3)
  })

  it('零强度为线偏振', () => {
    const jones = createLegacyJonesVector(0, 0)
    const analysis = analyzeLegacyJones(jones)
    expect(analysis.type).toBe('linear')
    expect(analysis.ellipticity).toBe(0)
  })
})

describe('分光器能量守恒', () => {
  it('PBS 能量守恒: 透射 + 反射 ≈ 输入', () => {
    const inputJones = createLegacyJonesVector(45, 1) // 45° input for maximal split
    const inputIntensity = legacyJonesIntensity(inputJones) * 100

    const { transmitted, reflected } = calculatePBSSplit(inputJones, inputIntensity, 0)

    // Total output should approximately equal input
    const totalOutput = transmitted.intensity + reflected.intensity
    expect(totalOutput).toBeCloseTo(inputIntensity, 0)
  })

  it('PBS 0° 输入: 全部透射', () => {
    const inputJones = createLegacyJonesVector(0, 1) // Horizontal = p-polarization
    const { transmitted, reflected } = calculatePBSSplit(inputJones, 100, 0)

    expect(transmitted.intensity).toBeCloseTo(100, 0)
    expect(reflected.intensity).toBeCloseTo(0, 0)
  })

  it('PBS 90° 输入: 全部反射', () => {
    const inputJones = createLegacyJonesVector(90, 1) // Vertical = s-polarization
    const { transmitted, reflected } = calculatePBSSplit(inputJones, 100, 0)

    expect(transmitted.intensity).toBeCloseTo(0, 0)
    expect(reflected.intensity).toBeCloseTo(100, 0)
  })

  it('方解石能量守恒: o光 + e光 ≈ 输入', () => {
    const inputJones = createLegacyJonesVector(45, 1)
    const inputIntensity = legacyJonesIntensity(inputJones) * 100

    const { oRay, eRay } = calculateCalciteSplit(inputJones, inputIntensity, 0)

    const totalOutput = oRay.intensity + eRay.intensity
    expect(totalOutput).toBeCloseTo(inputIntensity, 0)
  })

  it('NPBS 50/50 分光', () => {
    const inputJones = createLegacyJonesVector(0, 1)
    const inputIntensity = 100

    const { transmitted, reflected } = calculateNPBSSplit(inputJones, inputIntensity, 0)

    expect(transmitted.intensity).toBeCloseTo(50, 0)
    expect(reflected.intensity).toBeCloseTo(50, 0)

    // Total output equals input
    expect(transmitted.intensity + reflected.intensity).toBeCloseTo(inputIntensity, 0)
  })

  it('NPBS 保持偏振态', () => {
    const inputJones = createLegacyJonesVector(30, 1)
    const { transmitted, reflected } = calculateNPBSSplit(inputJones, 100, 30)

    // Both outputs should have same polarization angle as input
    expect(transmitted.polarization).toBeCloseTo(30, 0)
    expect(reflected.polarization).toBeCloseTo(30, 0)
  })
})

describe('数值稳定性', () => {
  it('极小强度不产生 NaN', () => {
    const jones = createLegacyJonesVector(45, 1e-15)
    const intensity = legacyJonesIntensity(jones)
    expect(isNaN(intensity)).toBe(false)
    expect(isFinite(intensity)).toBe(true)
  })

  it('极端角度不产生 NaN', () => {
    const extremeAngles = [0, 0.0001, 89.9999, 90, 179.9999, 180, 359.9999]
    for (const angle of extremeAngles) {
      const jones = createLegacyJonesVector(angle, 1)
      const analysis = analyzeLegacyJones(jones)
      expect(isNaN(analysis.ellipticity)).toBe(false)
      expect(isNaN(analysis.angle)).toBe(false)
    }
  })

  it('复数乘法精度', () => {
    // (3+4i)(3-4i) = 9+16 = 25
    const a = legacyComplex.create(3, 4)
    const b = legacyComplex.conjugate(a)
    const result = legacyComplex.mul(a, b)
    expect(result.re).toBeCloseTo(25, 10)
    expect(result.im).toBeCloseTo(0, 10)
  })
})
