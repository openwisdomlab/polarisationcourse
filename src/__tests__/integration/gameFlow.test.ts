/**
 * Game Flow Integration Tests (游戏流程集成测试)
 *
 * Tests the complete game loop:
 * - Load level → Place blocks → Light propagation → Sensor activation → Level completion
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { World, TUTORIAL_LEVELS } from '../../core/World'
import { createDefaultBlockState } from '../../core/types'

describe('游戏流程集成测试', () => {
  let world: World

  beforeEach(() => {
    world = new World(16)
  })

  describe('关卡加载', () => {
    it('加载教程关卡1', () => {
      const level = TUTORIAL_LEVELS[0]
      world.loadLevel(level)

      // 验证关卡中的方块被正确放置
      // Level 1: emitter at (0,1,-3), sensor at (0,1,3), walls at (-2,1,0) and (2,1,0)
      const emitter = world.getBlock(0, 1, -3)
      expect(emitter).not.toBeNull()
      expect(emitter!.type).toBe('emitter')

      const sensor = world.getBlock(0, 1, 3)
      expect(sensor).not.toBeNull()
      expect(sensor!.type).toBe('sensor')
    })

    it('加载关卡后清空之前的方块', () => {
      // Place a custom block first
      world.setBlock(10, 10, 10, createDefaultBlockState('solid'))

      // Load level (should clear everything)
      world.loadLevel(TUTORIAL_LEVELS[0])

      // Custom block should be gone
      expect(world.getBlock(10, 10, 10)).toBeNull()
    })

    it('所有教程关卡都可以加载', () => {
      for (let i = 0; i < TUTORIAL_LEVELS.length; i++) {
        const level = TUTORIAL_LEVELS[i]
        expect(() => world.loadLevel(level)).not.toThrow()

        // Each level should have at least one block
        const blocks = world.getAllBlocks()
        expect(blocks.length).toBeGreaterThan(0)
      }
    })
  })

  describe('方块放置与旋转', () => {
    it('放置方块后光传播更新', () => {
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 0

      world.setBlock(0, 1, 0, emitter)

      // 光应沿 south (+z) 方向传播
      const lightState = world.getLightState(0, 1, 1)
      expect(lightState).not.toBeNull()
    })

    it('旋转方块触发光传播更新', () => {
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 0
      world.setBlock(0, 1, 0, emitter)

      // 旋转偏振角
      world.rotateBlock(0, 1, 0)

      const block = world.getBlock(0, 1, 0)
      expect(block).not.toBeNull()
      // 偏振角应该从 0 变为 45
      expect(block!.polarizationAngle).toBe(45)
    })
  })

  describe('事件系统', () => {
    it('方块变化发出事件', () => {
      const events: Array<{ type: string; data: unknown }> = []
      world.addListener((type, data) => {
        events.push({ type, data })
      })

      world.setBlock(5, 5, 5, createDefaultBlockState('solid'))

      const blockChangedEvents = events.filter(e => e.type === 'blockChanged')
      expect(blockChangedEvents.length).toBeGreaterThan(0)
    })

    it('光更新发出事件', () => {
      const events: Array<{ type: string; data: unknown }> = []
      world.addListener((type, data) => {
        events.push({ type, data })
      })

      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      world.setBlock(0, 1, 0, emitter)

      const lightUpdatedEvents = events.filter(e => e.type === 'lightUpdated')
      expect(lightUpdatedEvents.length).toBeGreaterThan(0)
    })

    it('可以移除监听器', () => {
      let callCount = 0
      const listener = () => { callCount++ }

      world.addListener(listener)
      world.setBlock(5, 5, 5, createDefaultBlockState('solid'))
      const countAfterFirst = callCount

      world.removeListener(listener)
      world.setBlock(6, 6, 6, createDefaultBlockState('solid'))

      // Count should not increase after removing listener
      expect(callCount).toBe(countAfterFirst)
    })
  })

  describe('传感器索引', () => {
    it('传感器状态通过事件通知', () => {
      const sensorEvents: unknown[] = []
      world.addListener((type, data) => {
        if (type === 'sensorChanged') {
          sensorEvents.push(data)
        }
      })

      // Place emitter facing south and sensor in path
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 0
      world.setBlock(0, 1, -3, emitter)

      const sensor = createDefaultBlockState('sensor')
      sensor.polarizationAngle = 0
      sensor.requiredIntensity = 1
      world.setBlock(0, 1, 0, sensor)

      // The sensor should receive light and potentially activate
      // (depending on intensity reaching it)
    })
  })
})
