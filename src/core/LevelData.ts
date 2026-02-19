/**
 * Level Data (关卡数据)
 *
 * Extracted from World.ts to separate level definitions from
 * world management and light propagation logic.
 *
 * Contains:
 * - LevelData interface
 * - Tutorial level definitions
 */

import { BlockType, BlockState, BlockPosition } from './types'

/** Level data definition */
export interface LevelData {
  name: string
  description: string
  blocks: Array<{
    x: number
    y: number
    z: number
    type: BlockType
    state?: Partial<BlockState>
  }>
  goal?: {
    sensorPositions: BlockPosition[]
  }
}

/** Tutorial levels (教程关卡) */
export const TUTORIAL_LEVELS: LevelData[] = [
  {
    name: "第一课：光与门",
    description: "将光源对准感应器以打开门。尝试旋转光源(R)改变偏振角度。",
    blocks: [
      // 光源
      { x: 0, y: 1, z: -3, type: 'emitter', state: { facing: 'south', polarizationAngle: 0 } },
      // 感应器（需要0度偏振）
      { x: 0, y: 1, z: 3, type: 'sensor', state: { polarizationAngle: 0, requiredIntensity: 8 } },
      // 装饰墙
      { x: -2, y: 1, z: 0, type: 'solid' },
      { x: 2, y: 1, z: 0, type: 'solid' },
    ],
    goal: { sensorPositions: [{ x: 0, y: 1, z: 3 }] }
  },
  {
    name: "第二课：偏振片",
    description: "光需要通过偏振片。调整偏振片角度让足够的光通过。",
    blocks: [
      { x: 0, y: 1, z: -3, type: 'emitter', state: { facing: 'south', polarizationAngle: 0 } },
      { x: 0, y: 1, z: 0, type: 'polarizer', state: { polarizationAngle: 45 } },
      { x: 0, y: 1, z: 3, type: 'sensor', state: { polarizationAngle: 45, requiredIntensity: 6 } },
    ]
  },
  {
    name: "第三课：马吕斯定律",
    description: "两个偏振片串联。90度差会完全阻挡光线！",
    blocks: [
      { x: 0, y: 1, z: -4, type: 'emitter', state: { facing: 'south', polarizationAngle: 0 } },
      { x: 0, y: 1, z: -1, type: 'polarizer', state: { polarizationAngle: 0 } },
      { x: 0, y: 1, z: 2, type: 'polarizer', state: { polarizationAngle: 90 } },
      { x: 0, y: 1, z: 5, type: 'sensor', state: { polarizationAngle: 90, requiredIntensity: 1 } },
    ]
  },
  {
    name: "第四课：波片旋转",
    description: "波片可以旋转光的偏振方向而不损失强度。",
    blocks: [
      { x: 0, y: 1, z: -3, type: 'emitter', state: { facing: 'south', polarizationAngle: 0 } },
      { x: 0, y: 1, z: 0, type: 'rotator', state: { rotationAmount: 90 } },
      { x: 0, y: 1, z: 3, type: 'sensor', state: { polarizationAngle: 90, requiredIntensity: 12 } },
    ]
  },
  {
    name: "第五课：偏振分束",
    description: "偏振分束器(PBS)将光分裂成两束垂直偏振的光。",
    blocks: [
      { x: 0, y: 1, z: -3, type: 'emitter', state: { facing: 'south', polarizationAngle: 45 } },
      { x: 0, y: 1, z: 0, type: 'splitter', state: { facing: 'east' } },
      { x: 0, y: 1, z: 3, type: 'sensor', state: { polarizationAngle: 0, requiredIntensity: 5 } },
      { x: 3, y: 1, z: 0, type: 'sensor', state: { polarizationAngle: 90, requiredIntensity: 5 } },
    ]
  }
]
