/**
 * PolarCraft - 体素世界管理
 * 管理方块和光传播的元胞自动机
 */

import {
  BlockState,
  BlockType,
  BlockPosition,
  LightPacket,
  LightState,
  Direction,
  DIRECTION_VECTORS,
  createDefaultBlockState,
  PolarizationAngle
} from './types';
import { LightPhysics } from './LightPhysics';

// 方块键值生成
function posKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`;
}

// 从键值解析位置
function parseKey(key: string): BlockPosition {
  const [x, y, z] = key.split(',').map(Number);
  return { x, y, z };
}

/**
 * 体素世界类
 */
export class World {
  private blocks: Map<string, BlockState> = new Map();
  private lightStates: Map<string, LightState> = new Map();
  private worldSize: number;
  private listeners: Set<(type: string, data: unknown) => void> = new Set();

  constructor(size: number = 32) {
    this.worldSize = size;
    this.initializeGround();
  }

  /**
   * 初始化地面
   */
  private initializeGround(): void {
    // 创建一个平坦的地面
    for (let x = -this.worldSize / 2; x < this.worldSize / 2; x++) {
      for (let z = -this.worldSize / 2; z < this.worldSize / 2; z++) {
        this.setBlock(x, 0, z, createDefaultBlockState('solid'));
      }
    }
  }

  /**
   * 添加事件监听器
   */
  addListener(callback: (type: string, data: unknown) => void): void {
    this.listeners.add(callback);
  }

  /**
   * 移除事件监听器
   */
  removeListener(callback: (type: string, data: unknown) => void): void {
    this.listeners.delete(callback);
  }

  /**
   * 触发事件
   */
  private emit(type: string, data: unknown): void {
    for (const listener of this.listeners) {
      listener(type, data);
    }
  }

  /**
   * 获取方块
   */
  getBlock(x: number, y: number, z: number): BlockState | null {
    return this.blocks.get(posKey(x, y, z)) || null;
  }

  /**
   * 设置方块
   */
  setBlock(x: number, y: number, z: number, state: BlockState): void {
    const key = posKey(x, y, z);

    if (state.type === 'air') {
      this.blocks.delete(key);
    } else {
      this.blocks.set(key, state);
    }

    this.emit('blockChanged', { x, y, z, state });

    // 重新计算光传播
    this.updateLightPropagation();
  }

  /**
   * 删除方块
   */
  removeBlock(x: number, y: number, z: number): void {
    this.setBlock(x, y, z, createDefaultBlockState('air'));
  }

  /**
   * 获取所有方块
   */
  getAllBlocks(): Array<{ position: BlockPosition; state: BlockState }> {
    const result: Array<{ position: BlockPosition; state: BlockState }> = [];
    for (const [key, state] of this.blocks) {
      result.push({ position: parseKey(key), state });
    }
    return result;
  }

  /**
   * 获取光状态
   */
  getLightState(x: number, y: number, z: number): LightState | null {
    return this.lightStates.get(posKey(x, y, z)) || null;
  }

  /**
   * 获取所有光状态
   */
  getAllLightStates(): Array<{ position: BlockPosition; state: LightState }> {
    const result: Array<{ position: BlockPosition; state: LightState }> = [];
    for (const [key, state] of this.lightStates) {
      if (state.packets.length > 0) {
        result.push({ position: parseKey(key), state });
      }
    }
    return result;
  }

  /**
   * 更新光传播 - 核心的元胞自动机
   */
  updateLightPropagation(): void {
    // 清空当前光状态
    this.lightStates.clear();

    // 收集所有光源
    const emitters: Array<{ position: BlockPosition; state: BlockState }> = [];
    for (const [key, state] of this.blocks) {
      if (state.type === 'emitter') {
        emitters.push({ position: parseKey(key), state });
      }
    }

    // 从每个光源开始传播光线
    for (const emitter of emitters) {
      this.propagateLightFromEmitter(emitter.position, emitter.state);
    }

    // 更新所有感应器状态
    this.updateSensors();

    this.emit('lightUpdated', this.getAllLightStates());
  }

  /**
   * 从光源传播光线
   */
  private propagateLightFromEmitter(position: BlockPosition, state: BlockState): void {
    // 确定光源发射方向
    const emitDirection = LightPhysics.getActualFacing(state.facing, state.rotation);

    // 创建初始光包
    const initialLight: LightPacket = {
      direction: emitDirection,
      intensity: 15, // 最大强度
      polarization: state.polarizationAngle,
      phase: 1
    };

    // 开始传播
    this.propagateLight(position, initialLight);
  }

  /**
   * 递归传播光线
   */
  private propagateLight(fromPosition: BlockPosition, light: LightPacket, depth: number = 0): void {
    // 防止无限递归
    if (depth > 100 || light.intensity <= 0) {
      return;
    }

    // 计算下一个位置
    const dir = DIRECTION_VECTORS[light.direction];
    const nextPos: BlockPosition = {
      x: fromPosition.x + dir.x,
      y: fromPosition.y + dir.y,
      z: fromPosition.z + dir.z
    };

    // 检查是否超出世界边界
    if (Math.abs(nextPos.x) > this.worldSize ||
        Math.abs(nextPos.y) > this.worldSize ||
        Math.abs(nextPos.z) > this.worldSize) {
      return;
    }

    // 在当前位置记录光
    this.addLightToPosition(nextPos, light);

    // 获取下一个位置的方块
    const block = this.getBlock(nextPos.x, nextPos.y, nextPos.z);

    if (!block) {
      // 空气 - 光继续传播
      this.propagateLight(nextPos, light, depth + 1);
      return;
    }

    // 处理不同类型的方块
    switch (block.type) {
      case 'air':
        this.propagateLight(nextPos, light, depth + 1);
        break;

      case 'solid':
        // 实体方块阻挡光线
        break;

      case 'polarizer':
        this.handlePolarizerBlock(nextPos, light, block, depth);
        break;

      case 'rotator':
        this.handleRotatorBlock(nextPos, light, block, depth);
        break;

      case 'splitter':
        this.handleSplitterBlock(nextPos, light, block, depth);
        break;

      case 'mirror':
        this.handleMirrorBlock(nextPos, light, block, depth);
        break;

      case 'sensor':
        // 感应器不阻挡光，但会记录
        this.propagateLight(nextPos, light, depth + 1);
        break;

      case 'emitter':
        // 光源方块阻挡光线（避免干扰）
        break;
    }
  }

  /**
   * 处理偏振片
   */
  private handlePolarizerBlock(
    position: BlockPosition,
    light: LightPacket,
    block: BlockState,
    depth: number
  ): void {
    const result = LightPhysics.processPolarizerBlock(light, block);

    if (result && result.intensity > 0) {
      this.propagateLight(position, result, depth + 1);
    }
  }

  /**
   * 处理波片
   */
  private handleRotatorBlock(
    position: BlockPosition,
    light: LightPacket,
    block: BlockState,
    depth: number
  ): void {
    const result = LightPhysics.processRotatorBlock(light, block);
    this.propagateLight(position, result, depth + 1);
  }

  /**
   * 处理方解石（双折射）
   */
  private handleSplitterBlock(
    position: BlockPosition,
    light: LightPacket,
    block: BlockState,
    depth: number
  ): void {
    const results = LightPhysics.processSplitterBlock(light, block);

    for (const resultLight of results) {
      if (resultLight.intensity > 0) {
        this.propagateLight(position, resultLight, depth + 1);
      }
    }
  }

  /**
   * 处理反射镜
   */
  private handleMirrorBlock(
    position: BlockPosition,
    light: LightPacket,
    block: BlockState,
    depth: number
  ): void {
    const result = LightPhysics.processMirrorBlock(light, block);

    if (result && result.intensity > 0) {
      this.propagateLight(position, result, depth + 1);
    }
  }

  /**
   * 在位置添加光
   */
  private addLightToPosition(position: BlockPosition, light: LightPacket): void {
    const key = posKey(position.x, position.y, position.z);

    if (!this.lightStates.has(key)) {
      this.lightStates.set(key, { packets: [] });
    }

    const state = this.lightStates.get(key)!;
    state.packets.push({ ...light });

    // 计算干涉
    state.packets = LightPhysics.calculateInterference(state.packets);
  }

  /**
   * 更新所有感应器状态
   */
  private updateSensors(): void {
    for (const [key, state] of this.blocks) {
      if (state.type === 'sensor') {
        const pos = parseKey(key);
        const lightState = this.lightStates.get(key);

        let totalIntensity = 0;
        let hasRequiredPolarization = false;

        if (lightState) {
          for (const packet of lightState.packets) {
            totalIntensity += packet.intensity;
            // 检查是否有正确偏振角的光
            if (packet.polarization === state.polarizationAngle) {
              hasRequiredPolarization = true;
            }
          }
        }

        // 更新激活状态
        const wasActivated = state.activated;
        state.activated = totalIntensity >= state.requiredIntensity && hasRequiredPolarization;

        if (wasActivated !== state.activated) {
          this.emit('sensorChanged', { position: pos, activated: state.activated });
        }
      }
    }
  }

  /**
   * 旋转方块
   */
  rotateBlock(x: number, y: number, z: number): void {
    const block = this.getBlock(x, y, z);
    if (!block) return;

    // 对于偏振片和光源，旋转偏振角度
    if (block.type === 'polarizer' || block.type === 'emitter') {
      const angles: PolarizationAngle[] = [0, 45, 90, 135];
      const currentIndex = angles.indexOf(block.polarizationAngle);
      block.polarizationAngle = angles[(currentIndex + 1) % 4];
    }
    // 对于波片，切换旋转量
    else if (block.type === 'rotator') {
      block.rotationAmount = block.rotationAmount === 45 ? 90 : 45;
    }
    // 对于其他方块，旋转朝向
    else {
      block.rotation = (block.rotation + 90) % 360;
      const directions: Direction[] = ['north', 'east', 'south', 'west'];
      const currentIndex = directions.indexOf(block.facing);
      block.facing = directions[(currentIndex + 1) % 4];
    }

    this.emit('blockChanged', { x, y, z, state: block });
    this.updateLightPropagation();
  }

  /**
   * 获取位置的总光强度
   */
  getTotalLightIntensity(x: number, y: number, z: number): number {
    const state = this.lightStates.get(posKey(x, y, z));
    if (!state) return 0;

    let total = 0;
    for (const packet of state.packets) {
      total += packet.intensity;
    }
    return Math.min(total, 15);
  }

  /**
   * 清空世界
   */
  clear(): void {
    this.blocks.clear();
    this.lightStates.clear();
    this.initializeGround();
    this.emit('worldCleared', null);
  }

  /**
   * 加载预设关卡
   */
  loadLevel(level: LevelData): void {
    this.clear();

    for (const block of level.blocks) {
      const state = createDefaultBlockState(block.type);
      Object.assign(state, block.state || {});
      this.setBlock(block.x, block.y, block.z, state);
    }

    this.updateLightPropagation();
  }
}

// 关卡数据接口
export interface LevelData {
  name: string;
  description: string;
  blocks: Array<{
    x: number;
    y: number;
    z: number;
    type: BlockType;
    state?: Partial<BlockState>;
  }>;
  goal?: {
    sensorPositions: BlockPosition[];
  };
}

// 教程关卡
export const TUTORIAL_LEVELS: LevelData[] = [
  {
    name: "第一课：光与门",
    description: "将光源对准感应器以打开门。尝试旋转光源(R)改变偏振角度。",
    blocks: [
      // 地面已由initializeGround创建

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
    name: "第五课：方解石分光",
    description: "方解石将光分裂成两束垂直偏振的光。",
    blocks: [
      { x: 0, y: 1, z: -3, type: 'emitter', state: { facing: 'south', polarizationAngle: 45 } },
      { x: 0, y: 1, z: 0, type: 'splitter', state: { facing: 'east' } },
      { x: 0, y: 1, z: 3, type: 'sensor', state: { polarizationAngle: 0, requiredIntensity: 5 } },
      { x: 3, y: 1, z: 0, type: 'sensor', state: { polarizationAngle: 90, requiredIntensity: 5 } },
    ]
  }
];
