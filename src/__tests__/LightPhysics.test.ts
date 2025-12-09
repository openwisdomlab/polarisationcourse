/**
 * LightPhysics 单元测试
 * 测试偏振光的四大物理公理
 */

import { describe, it, expect } from 'vitest'
import { LightPhysics } from '../core/LightPhysics'
import { LightPacket, createDefaultBlockState } from '../core/types'

describe('LightPhysics', () => {
  describe('公理一：正交不干涉 (Orthogonality)', () => {
    it('0度和90度应该正交', () => {
      expect(LightPhysics.isOrthogonal(0, 90)).toBe(true)
    })

    it('45度和135度应该正交', () => {
      expect(LightPhysics.isOrthogonal(45, 135)).toBe(true)
    })

    it('0度和45度不正交', () => {
      expect(LightPhysics.isOrthogonal(0, 45)).toBe(false)
    })

    it('0度和0度不正交', () => {
      expect(LightPhysics.isOrthogonal(0, 0)).toBe(false)
    })
  })

  describe('公理二：马吕斯定律 (Malus Law)', () => {
    it('相同角度时光强不损失', () => {
      const intensity = LightPhysics.applyMalusLaw(15, 0, 0)
      expect(intensity).toBe(15)
    })

    it('90度差时光强为0', () => {
      const intensity = LightPhysics.applyMalusLaw(15, 0, 90)
      expect(intensity).toBe(0)
    })

    it('45度差时光强约为一半', () => {
      const intensity = LightPhysics.applyMalusLaw(15, 0, 45)
      // cos²(45°) = 0.5，15 * 0.5 = 7.5，向下取整为7
      expect(intensity).toBe(7)
    })

    it('135度与45度正交，光强为0', () => {
      const intensity = LightPhysics.applyMalusLaw(15, 45, 135)
      expect(intensity).toBe(0)
    })

    it('处理大于90度的角度差', () => {
      // 0度和135度，差135度，等效于45度差
      const intensity = LightPhysics.applyMalusLaw(15, 0, 135)
      expect(intensity).toBe(7)
    })
  })

  describe('公理三：双折射分叉 (Birefringence)', () => {
    it('45度偏振光分裂为相等的o光和e光', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 45,
        phase: 1
      }
      const [oLight, eLight] = LightPhysics.splitLight(input, 'east')

      // 45度时 cos²(45°) = sin²(45°) = 0.5
      expect(oLight.polarization).toBe(0)
      expect(eLight.polarization).toBe(90)
      expect(oLight.intensity).toBe(7) // floor(15 * 0.5)
      expect(eLight.intensity).toBe(7)
    })

    it('0度偏振光全部变为o光', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0,
        phase: 1
      }
      const [oLight, eLight] = LightPhysics.splitLight(input, 'east')

      expect(oLight.intensity).toBe(15)
      expect(eLight.intensity).toBe(0)
    })

    it('90度偏振光全部变为e光', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 90,
        phase: 1
      }
      const [oLight, eLight] = LightPhysics.splitLight(input, 'east')

      expect(oLight.intensity).toBe(0)
      expect(eLight.intensity).toBe(15)
    })

    it('o光保持原方向', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 45,
        phase: 1
      }
      const [oLight] = LightPhysics.splitLight(input, 'east')
      expect(oLight.direction).toBe('south')
    })
  })

  describe('公理四：干涉叠加 (Interference)', () => {
    it('空数组返回空数组', () => {
      expect(LightPhysics.calculateInterference([])).toEqual([])
    })

    it('单个光包直接返回', () => {
      const lights: LightPacket[] = [{
        direction: 'south',
        intensity: 10,
        polarization: 0,
        phase: 1
      }]
      const result = LightPhysics.calculateInterference(lights)
      expect(result).toEqual(lights)
    })

    it('同相同方向的光叠加', () => {
      const lights: LightPacket[] = [
        { direction: 'south', intensity: 5, polarization: 0, phase: 1 },
        { direction: 'south', intensity: 5, polarization: 0, phase: 1 }
      ]
      const result = LightPhysics.calculateInterference(lights)
      expect(result.length).toBe(1)
      expect(result[0].intensity).toBe(10)
    })

    it('反相同方向的光相消', () => {
      const lights: LightPacket[] = [
        { direction: 'south', intensity: 5, polarization: 0, phase: 1 },
        { direction: 'south', intensity: 5, polarization: 0, phase: -1 }
      ]
      const result = LightPhysics.calculateInterference(lights)
      expect(result.length).toBe(0) // 完全相消
    })

    it('反相不等强度的光部分相消', () => {
      const lights: LightPacket[] = [
        { direction: 'south', intensity: 10, polarization: 0, phase: 1 },
        { direction: 'south', intensity: 3, polarization: 0, phase: -1 }
      ]
      const result = LightPhysics.calculateInterference(lights)
      expect(result.length).toBe(1)
      expect(result[0].intensity).toBe(7)
      expect(result[0].phase).toBe(1)
    })

    it('正交偏振的光不干涉', () => {
      const lights: LightPacket[] = [
        { direction: 'south', intensity: 10, polarization: 0, phase: 1 },
        { direction: 'south', intensity: 10, polarization: 90, phase: 1 }
      ]
      const result = LightPhysics.calculateInterference(lights)
      expect(result.length).toBe(2)
    })

    it('强度不超过15', () => {
      const lights: LightPacket[] = [
        { direction: 'south', intensity: 10, polarization: 0, phase: 1 },
        { direction: 'south', intensity: 10, polarization: 0, phase: 1 }
      ]
      const result = LightPhysics.calculateInterference(lights)
      expect(result[0].intensity).toBe(15) // 被限制在15
    })
  })

  describe('偏振片处理 (Polarizer)', () => {
    it('正常过滤光线', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('polarizer')
      block.polarizationAngle = 45

      const result = LightPhysics.processPolarizerBlock(input, block)
      expect(result).not.toBeNull()
      expect(result!.intensity).toBe(7)
      expect(result!.polarization).toBe(45) // 偏振角变为偏振片角度
    })

    it('90度阻挡返回null', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('polarizer')
      block.polarizationAngle = 90

      const result = LightPhysics.processPolarizerBlock(input, block)
      expect(result).toBeNull()
    })
  })

  describe('波片处理 (Rotator)', () => {
    it('45度波片旋转偏振角45度', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('rotator')
      block.rotationAmount = 45

      const result = LightPhysics.processRotatorBlock(input, block)
      expect(result.intensity).toBe(15) // 强度不变
      expect(result.polarization).toBe(45)
    })

    it('90度波片旋转偏振角90度', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('rotator')
      block.rotationAmount = 90

      const result = LightPhysics.processRotatorBlock(input, block)
      expect(result.polarization).toBe(90)
    })

    it('旋转角度超过180度时正确处理', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 135,
        phase: 1
      }
      const block = createDefaultBlockState('rotator')
      block.rotationAmount = 90

      const result = LightPhysics.processRotatorBlock(input, block)
      // 135 + 90 = 225，225 % 180 = 45
      expect(result.polarization).toBe(45)
    })
  })

  describe('方解石处理 (Splitter)', () => {
    it('正确分裂光线', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 45,
        phase: 1
      }
      const block = createDefaultBlockState('splitter')
      block.facing = 'east'

      const results = LightPhysics.processSplitterBlock(input, block)
      expect(results.length).toBe(2)

      const oLight = results.find(l => l.polarization === 0)
      const eLight = results.find(l => l.polarization === 90)

      expect(oLight).toBeDefined()
      expect(eLight).toBeDefined()
    })

    it('强度为0的光不在结果中', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0, // 全部是o光
        phase: 1
      }
      const block = createDefaultBlockState('splitter')

      const results = LightPhysics.processSplitterBlock(input, block)
      expect(results.length).toBe(1)
      expect(results[0].polarization).toBe(0)
    })
  })

  describe('镜子处理 (Mirror)', () => {
    it('从正面反射光线', () => {
      const input: LightPacket = {
        direction: 'south', // 向南走
        intensity: 15,
        polarization: 45,
        phase: 1
      }
      const block = createDefaultBlockState('mirror')
      block.facing = 'north' // 镜子面向北（光从南来）

      const result = LightPhysics.processMirrorBlock(input, block)
      expect(result).not.toBeNull()
      expect(result!.direction).toBe('north') // 反射向北
      expect(result!.intensity).toBe(15) // 强度不变
    })

    it('从背面不反射', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 45,
        phase: 1
      }
      const block = createDefaultBlockState('mirror')
      block.facing = 'south' // 镜子面向南（光也从南来，从背面穿过）

      const result = LightPhysics.processMirrorBlock(input, block)
      expect(result).toBeNull()
    })
  })

  describe('方向计算', () => {
    it('正确计算旋转后的朝向', () => {
      expect(LightPhysics.getActualFacing('north', 0)).toBe('north')
      expect(LightPhysics.getActualFacing('north', 90)).toBe('east')
      expect(LightPhysics.getActualFacing('north', 180)).toBe('south')
      expect(LightPhysics.getActualFacing('north', 270)).toBe('west')
    })

    it('垂直方向不受旋转影响', () => {
      expect(LightPhysics.getActualFacing('up', 90)).toBe('up')
      expect(LightPhysics.getActualFacing('down', 180)).toBe('down')
    })
  })

  describe('强度亮度计算', () => {
    it('最大强度返回1', () => {
      expect(LightPhysics.getIntensityBrightness(15)).toBe(1)
    })

    it('零强度返回0', () => {
      expect(LightPhysics.getIntensityBrightness(0)).toBe(0)
    })

    it('中等强度正确计算', () => {
      expect(LightPhysics.getIntensityBrightness(7.5)).toBeCloseTo(0.5)
    })
  })

  // ============== 高级方块测试 ==============

  describe('吸收器处理 (Absorber)', () => {
    it('按比例降低光强度', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 10,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('absorber')
      block.absorptionRate = 0.5

      const result = LightPhysics.processAbsorberBlock(input, block)
      expect(result).not.toBeNull()
      expect(result!.intensity).toBe(5) // 50% 透过
    })

    it('完全吸收返回null', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 10,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('absorber')
      block.absorptionRate = 1.0

      const result = LightPhysics.processAbsorberBlock(input, block)
      expect(result).toBeNull()
    })

    it('保持偏振角度和相位不变', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 10,
        polarization: 45,
        phase: -1
      }
      const block = createDefaultBlockState('absorber')
      block.absorptionRate = 0.3

      const result = LightPhysics.processAbsorberBlock(input, block)
      expect(result!.polarization).toBe(45)
      expect(result!.phase).toBe(-1)
    })
  })

  describe('相位调制器处理 (PhaseShifter)', () => {
    it('180度相位偏移反转相位', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('phaseShifter')
      block.phaseShift = 180

      const result = LightPhysics.processPhaseShifterBlock(input, block)
      expect(result.phase).toBe(-1)
    })

    it('0度相位偏移不改变相位', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('phaseShifter')
      block.phaseShift = 0

      const result = LightPhysics.processPhaseShifterBlock(input, block)
      expect(result.phase).toBe(1)
    })

    it('保持强度和偏振不变', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 12,
        polarization: 45,
        phase: 1
      }
      const block = createDefaultBlockState('phaseShifter')
      block.phaseShift = 180

      const result = LightPhysics.processPhaseShifterBlock(input, block)
      expect(result.intensity).toBe(12)
      expect(result.polarization).toBe(45)
    })
  })

  describe('分束器处理 (BeamSplitter)', () => {
    it('50/50分光产生两束光', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 10,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('beamSplitter')
      block.splitRatio = 0.5

      const results = LightPhysics.processBeamSplitterBlock(input, block)
      expect(results.length).toBe(2)

      const transmitted = results.find(r => r.direction === 'south')
      const reflected = results.find(r => r.direction !== 'south')

      expect(transmitted!.intensity).toBe(5)
      expect(reflected!.intensity).toBe(5)
    })

    it('非对称分光比例正确', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 10,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('beamSplitter')
      block.splitRatio = 0.7

      const results = LightPhysics.processBeamSplitterBlock(input, block)
      const transmitted = results.find(r => r.direction === 'south')
      const reflected = results.find(r => r.direction !== 'south')

      expect(transmitted!.intensity).toBe(7)
      expect(reflected!.intensity).toBe(3)
    })
  })

  describe('四分之一波片处理 (QuarterWave)', () => {
    it('旋转偏振角45度', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('quarterWave')

      const result = LightPhysics.processQuarterWaveBlock(input, block)
      expect(result.polarization).toBe(45)
      expect(result.intensity).toBe(15)
    })
  })

  describe('二分之一波片处理 (HalfWave)', () => {
    it('旋转偏振角90度', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('halfWave')

      const result = LightPhysics.processHalfWaveBlock(input, block)
      expect(result.polarization).toBe(90)
      expect(result.intensity).toBe(15)
    })

    it('45度变为135度', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 45,
        phase: 1
      }
      const block = createDefaultBlockState('halfWave')

      const result = LightPhysics.processHalfWaveBlock(input, block)
      expect(result.polarization).toBe(135)
    })
  })

  describe('棱镜处理 (Prism)', () => {
    it('垂直入射时偏折光线', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('prism')
      block.facing = 'east'

      const result = LightPhysics.processPrismBlock(input, block)
      expect(result.direction).toBe('east')
    })

    it('保持偏振和强度不变', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 12,
        polarization: 45,
        phase: 1
      }
      const block = createDefaultBlockState('prism')
      block.facing = 'east'

      const result = LightPhysics.processPrismBlock(input, block)
      expect(result.intensity).toBe(12)
      expect(result.polarization).toBe(45)
    })
  })

  describe('透镜处理 (Lens)', () => {
    it('聚焦透镜保持光线方向', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 15,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('lens')
      block.focalLength = 2 // 正焦距

      const results = LightPhysics.processLensBlock(input, block)
      expect(results.length).toBe(1)
      expect(results[0].direction).toBe('south')
      expect(results[0].intensity).toBe(15)
    })

    it('发散透镜分裂光线', () => {
      const input: LightPacket = {
        direction: 'south',
        intensity: 10,
        polarization: 0,
        phase: 1
      }
      const block = createDefaultBlockState('lens')
      block.focalLength = -2 // 负焦距

      const results = LightPhysics.processLensBlock(input, block)
      expect(results.length).toBe(2)

      const totalIntensity = results.reduce((sum, r) => sum + r.intensity, 0)
      expect(totalIntensity).toBe(10)
    })
  })
})
