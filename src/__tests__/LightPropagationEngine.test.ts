/**
 * LightPropagationEngine 单元测试
 * 测试从 World.ts 提取出的光线传播引擎
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { LightPropagationEngine, type BlockAccessor } from '../core/LightPropagationEngine'
import { createDefaultBlockState, type BlockState, type BlockPosition } from '../core/types'

/**
 * Mock BlockAccessor for testing the engine in isolation
 */
class MockBlockAccessor implements BlockAccessor {
  private blocks = new Map<string, BlockState>()

  setBlock(x: number, y: number, z: number, state: BlockState) {
    const key = `${x},${y},${z}`
    if (state.type === 'air') {
      this.blocks.delete(key)
    } else {
      this.blocks.set(key, state)
    }
  }

  getBlock(x: number, y: number, z: number): BlockState | null {
    return this.blocks.get(`${x},${y},${z}`) || null
  }

  getBlocksMap(): Map<string, BlockState> {
    return this.blocks
  }

  findPortalById(portalId: string): { position: BlockPosition; state: BlockState } | null {
    for (const [key, state] of this.blocks) {
      if (state.type === 'portal' && state.linkedPortalId === portalId) {
        const [x, y, z] = key.split(',').map(Number)
        return { position: { x, y, z }, state }
      }
    }
    return null
  }
}

describe('LightPropagationEngine', () => {
  let engine: LightPropagationEngine
  let accessor: MockBlockAccessor

  beforeEach(() => {
    engine = new LightPropagationEngine()
    accessor = new MockBlockAccessor()
  })

  describe('基本传播', () => {
    it('无光源时不产生光线状态', () => {
      const states = engine.propagate(accessor, 16)
      expect(states).toEqual([])
    })

    it('光源发射光线到空气中', () => {
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 0
      accessor.setBlock(0, 1, 0, emitter)

      engine.propagate(accessor, 16)

      // 光应该沿 south 方向（+z）传播
      const lightAt1 = engine.getLightState(0, 1, 1)
      expect(lightAt1).not.toBeNull()
      if (lightAt1) {
        expect(lightAt1.packets.length).toBeGreaterThan(0)
      }
    })

    it('固体方块阻挡光线', () => {
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      accessor.setBlock(0, 1, 0, emitter)

      const solid = createDefaultBlockState('solid')
      accessor.setBlock(0, 1, 1, solid)

      engine.propagate(accessor, 16)

      // 固体后面不应有光
      const lightBehind = engine.getLightState(0, 1, 2)
      expect(lightBehind).toBeNull()
    })
  })

  describe('偏振片处理', () => {
    it('平行偏振片不衰减', () => {
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      emitter.polarizationAngle = 0
      accessor.setBlock(0, 1, 0, emitter)

      const polarizer = createDefaultBlockState('polarizer')
      polarizer.polarizationAngle = 0
      accessor.setBlock(0, 1, 2, polarizer)

      engine.propagate(accessor, 16)

      // 通过平行偏振片后光应保持高强度
      const lightAfter = engine.getLightState(0, 1, 3)
      expect(lightAfter).not.toBeNull()
      if (lightAfter) {
        const totalIntensity = lightAfter.packets.reduce((sum, p) => sum + p.intensity, 0)
        expect(totalIntensity).toBeGreaterThan(0)
      }
    })
  })

  describe('引擎配置', () => {
    it('可以设置和获取配置', () => {
      engine.setConfig({ maxIterations: 5000, useWaveOptics: false })
      const config = engine.getConfig()
      expect(config.maxIterations).toBe(5000)
      expect(config.useWaveOptics).toBe(false)
    })

    it('clear 清空所有状态', () => {
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      accessor.setBlock(0, 1, 0, emitter)

      engine.propagate(accessor, 16)
      engine.clear()

      const states = engine.getAllLightStates()
      expect(states).toEqual([])
    })
  })

  describe('光强度查询', () => {
    it('空位置返回 0 强度', () => {
      expect(engine.getTotalLightIntensity(5, 5, 5)).toBe(0)
    })

    it('光源前方有强度', () => {
      const emitter = createDefaultBlockState('emitter')
      emitter.facing = 'south'
      accessor.setBlock(0, 1, 0, emitter)

      engine.propagate(accessor, 16)

      const intensity = engine.getTotalLightIntensity(0, 1, 1)
      expect(intensity).toBeGreaterThan(0)
    })
  })
})
