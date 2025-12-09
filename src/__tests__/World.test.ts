/**
 * World 单元测试
 * 测试体素世界和光传播系统
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { World, TUTORIAL_LEVELS } from '../core/World'
import { createDefaultBlockState } from '../core/types'

describe('World', () => {
  let world: World

  beforeEach(() => {
    world = new World(16) // 使用较小的世界尺寸加快测试
  })

  describe('方块操作', () => {
    it('可以设置和获取方块', () => {
      const state = createDefaultBlockState('solid')
      world.setBlock(5, 5, 5, state)

      const retrieved = world.getBlock(5, 5, 5)
      expect(retrieved).not.toBeNull()
      expect(retrieved!.type).toBe('solid')
    })

    it('空位置返回null', () => {
      const block = world.getBlock(5, 10, 5) // 地面以上的空气
      expect(block).toBeNull()
    })

    it('设置air类型会删除方块', () => {
      const state = createDefaultBlockState('solid')
      world.setBlock(5, 5, 5, state)

      const airState = createDefaultBlockState('air')
      world.setBlock(5, 5, 5, airState)

      const retrieved = world.getBlock(5, 5, 5)
      expect(retrieved).toBeNull()
    })

    it('removeBlock可以删除方块', () => {
      const state = createDefaultBlockState('solid')
      world.setBlock(5, 5, 5, state)
      world.removeBlock(5, 5, 5)

      expect(world.getBlock(5, 5, 5)).toBeNull()
    })
  })

  describe('地面初始化', () => {
    it('地面层应该有solid方块', () => {
      const groundBlock = world.getBlock(0, 0, 0)
      expect(groundBlock).not.toBeNull()
      expect(groundBlock!.type).toBe('solid')
    })
  })

  describe('获取所有方块', () => {
    it('getAllBlocks返回所有方块', () => {
      const blocks = world.getAllBlocks()
      expect(blocks.length).toBeGreaterThan(0)

      // 所有地面方块应该是solid
      const solidBlocks = blocks.filter(b => b.state.type === 'solid')
      expect(solidBlocks.length).toBeGreaterThan(0)
    })
  })

  describe('光传播', () => {
    it('光源发射光线', () => {
      // 清空世界
      world.clear()

      // 添加光源
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 0
      world.setBlock(0, 1, 0, emitter)

      const lightStates = world.getAllLightStates()
      expect(lightStates.length).toBeGreaterThan(0)

      // 光应该向南传播
      const southLight = lightStates.find(l => l.position.z > 0)
      expect(southLight).toBeDefined()
    })

    it('solid方块阻挡光线', () => {
      world.clear()

      // 光源
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      world.setBlock(0, 1, 0, emitter)

      // 在光路上放置solid方块
      world.setBlock(0, 1, 2, createDefaultBlockState('solid'))

      const lightStates = world.getAllLightStates()

      // solid方块后面不应该有光
      const lightBeyondSolid = lightStates.find(l => l.position.x === 0 && l.position.z > 2)
      expect(lightBeyondSolid).toBeUndefined()
    })

    it('偏振片过滤光线', () => {
      world.clear()

      // 光源 (0度偏振)
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 0
      world.setBlock(0, 1, 0, emitter)

      // 偏振片 (45度)
      const polarizer = createDefaultBlockState('polarizer')
      polarizer.polarizationAngle = 45
      world.setBlock(0, 1, 2, polarizer)

      const lightStates = world.getAllLightStates()
      const lightAfterPolarizer = lightStates.find(l => l.position.z > 2)

      expect(lightAfterPolarizer).toBeDefined()
      if (lightAfterPolarizer) {
        const packet = lightAfterPolarizer.state.packets[0]
        expect(packet.polarization).toBe(45)
        expect(packet.intensity).toBeLessThan(15)
      }
    })

    it('波片旋转偏振角', () => {
      world.clear()

      // 光源 (0度偏振)
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 0
      world.setBlock(0, 1, 0, emitter)

      // 波片 (旋转90度)
      const rotator = createDefaultBlockState('rotator')
      rotator.rotationAmount = 90
      world.setBlock(0, 1, 2, rotator)

      const lightStates = world.getAllLightStates()
      const lightAfterRotator = lightStates.find(l => l.position.z > 2)

      expect(lightAfterRotator).toBeDefined()
      if (lightAfterRotator) {
        const packet = lightAfterRotator.state.packets[0]
        expect(packet.polarization).toBe(90)
        expect(packet.intensity).toBe(15) // 强度不变
      }
    })

    it('方解石分裂光线', () => {
      world.clear()

      // 光源 (45度偏振)
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 45
      world.setBlock(0, 1, 0, emitter)

      // 方解石
      const splitter = createDefaultBlockState('splitter')
      splitter.facing = 'east'
      world.setBlock(0, 1, 2, splitter)

      const lightStates = world.getAllLightStates()

      // 应该有两束光
      const oLight = lightStates.find(l =>
        l.state.packets.some(p => p.polarization === 0 && l.position.z > 2)
      )
      const eLight = lightStates.find(l =>
        l.state.packets.some(p => p.polarization === 90)
      )

      expect(oLight).toBeDefined()
      expect(eLight).toBeDefined()
    })
  })

  describe('感应器', () => {
    it('正确偏振和强度激活感应器', () => {
      world.clear()

      // 光源
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 0
      world.setBlock(0, 1, 0, emitter)

      // 感应器 (需要0度偏振，强度8)
      const sensor = createDefaultBlockState('sensor')
      sensor.polarizationAngle = 0
      sensor.requiredIntensity = 8
      world.setBlock(0, 1, 3, sensor)

      const sensorBlock = world.getBlock(0, 1, 3)
      expect(sensorBlock!.activated).toBe(true)
    })

    it('错误偏振不激活感应器', () => {
      world.clear()

      // 光源 (0度偏振)
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 0
      world.setBlock(0, 1, 0, emitter)

      // 感应器 (需要90度偏振)
      const sensor = createDefaultBlockState('sensor')
      sensor.polarizationAngle = 90
      sensor.requiredIntensity = 8
      world.setBlock(0, 1, 3, sensor)

      const sensorBlock = world.getBlock(0, 1, 3)
      expect(sensorBlock!.activated).toBe(false)
    })

    it('强度不足不激活感应器', () => {
      world.clear()

      // 光源
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 0
      world.setBlock(0, 1, 0, emitter)

      // 偏振片 (45度，会降低强度)
      const polarizer = createDefaultBlockState('polarizer')
      polarizer.polarizationAngle = 45
      world.setBlock(0, 1, 2, polarizer)

      // 感应器 (需要0度偏振和高强度)
      const sensor = createDefaultBlockState('sensor')
      sensor.polarizationAngle = 0
      sensor.requiredIntensity = 12
      world.setBlock(0, 1, 4, sensor)

      const sensorBlock = world.getBlock(0, 1, 4)
      expect(sensorBlock!.activated).toBe(false)
    })
  })

  describe('方块旋转', () => {
    it('旋转偏振片改变偏振角', () => {
      const polarizer = createDefaultBlockState('polarizer')
      polarizer.polarizationAngle = 0
      world.setBlock(5, 5, 5, polarizer)

      world.rotateBlock(5, 5, 5)

      const rotated = world.getBlock(5, 5, 5)
      expect(rotated!.polarizationAngle).toBe(45)
    })

    it('旋转波片切换旋转量', () => {
      const rotator = createDefaultBlockState('rotator')
      rotator.rotationAmount = 45
      world.setBlock(5, 5, 5, rotator)

      world.rotateBlock(5, 5, 5)

      const rotated = world.getBlock(5, 5, 5)
      expect(rotated!.rotationAmount).toBe(90)
    })

    it('旋转其他方块改变朝向', () => {
      const mirror = createDefaultBlockState('mirror')
      mirror.facing = 'north'
      world.setBlock(5, 5, 5, mirror)

      world.rotateBlock(5, 5, 5)

      const rotated = world.getBlock(5, 5, 5)
      expect(rotated!.facing).toBe('east')
    })
  })

  describe('光强度查询', () => {
    it('getTotalLightIntensity返回正确值', () => {
      world.clear()

      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      world.setBlock(0, 1, 0, emitter)

      const intensity = world.getTotalLightIntensity(0, 1, 1)
      expect(intensity).toBe(15)
    })

    it('无光位置返回0', () => {
      const intensity = world.getTotalLightIntensity(100, 100, 100)
      expect(intensity).toBe(0)
    })
  })

  describe('事件系统', () => {
    it('方块改变时触发事件', () => {
      const listener = vi.fn()
      world.addListener(listener)

      const state = createDefaultBlockState('solid')
      world.setBlock(5, 5, 5, state)

      expect(listener).toHaveBeenCalled()
      const call = listener.mock.calls.find(c => c[0] === 'blockChanged')
      expect(call).toBeDefined()
    })

    it('可以移除监听器', () => {
      const listener = vi.fn()
      world.addListener(listener)
      world.removeListener(listener)

      const state = createDefaultBlockState('solid')
      world.setBlock(5, 5, 5, state)

      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('关卡加载', () => {
    it('可以加载教程关卡', () => {
      const level = TUTORIAL_LEVELS[0]
      world.loadLevel(level)

      // 检查是否有光源
      const blocks = world.getAllBlocks()
      const emitter = blocks.find(b => b.state.type === 'emitter')
      expect(emitter).toBeDefined()

      // 检查是否有感应器
      const sensor = blocks.find(b => b.state.type === 'sensor')
      expect(sensor).toBeDefined()
    })

    it('clear清空世界保留地面', () => {
      const state = createDefaultBlockState('solid')
      world.setBlock(5, 10, 5, state)

      world.clear()

      // 自定义方块应该被删除
      expect(world.getBlock(5, 10, 5)).toBeNull()

      // 地面应该保留
      expect(world.getBlock(0, 0, 0)).not.toBeNull()
    })
  })
})

describe('TUTORIAL_LEVELS', () => {
  it('应该有5个教程关卡', () => {
    expect(TUTORIAL_LEVELS.length).toBe(5)
  })

  it('所有关卡都有名称和描述', () => {
    for (const level of TUTORIAL_LEVELS) {
      expect(level.name).toBeTruthy()
      expect(level.description).toBeTruthy()
    }
  })

  it('所有关卡都有方块定义', () => {
    for (const level of TUTORIAL_LEVELS) {
      expect(level.blocks.length).toBeGreaterThan(0)
    }
  })
})
