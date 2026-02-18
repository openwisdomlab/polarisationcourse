/**
 * PolarCraft - 体素世界管理
 *
 * Core voxel world with block storage, events, and light propagation.
 *
 * Delegates to:
 * - LightPropagationEngine: BFS/legacy light propagation
 * - LevelData: Level definitions and tutorial levels
 *
 * Performance optimizations:
 * - Sensor index: O(1) sensor lookup instead of O(n) full scan
 * - Debounced propagation: batches rapid block changes
 * - Emitter cache: avoids rescanning all blocks
 */

import {
  BlockState,
  BlockPosition,
  LightState,
  Direction,
  createDefaultBlockState,
  PolarizationAngle
} from './types';
import { LightPropagationEngine, type BlockAccessor, type PropagationConfig } from './LightPropagationEngine';
import { type LevelData } from './LevelData';
import { logger } from '@/lib/logger';

// Re-export for backward compatibility
export type { LevelData } from './LevelData';
export { TUTORIAL_LEVELS } from './LevelData';

// 方块键值生成
function posKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`;
}

// 从键值解析位置
function parseKey(key: string): BlockPosition {
  const parts = key.split(',');
  if (parts.length !== 3) {
    logger.error(`Invalid position key format: "${key}". Expected "x,y,z" format.`);
    return { x: 0, y: 0, z: 0 };
  }

  const [xStr, yStr, zStr] = parts;
  const x = Number(xStr);
  const y = Number(yStr);
  const z = Number(zStr);

  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    logger.error(`Invalid position key values: "${key}". Coordinates must be valid numbers.`);
    return { x: 0, y: 0, z: 0 };
  }

  return { x, y, z };
}

/**
 * 体素世界类
 *
 * Manages block storage, events, sensor state, and delegates light
 * propagation to LightPropagationEngine.
 */
export class World implements BlockAccessor {
  private blocks: Map<string, BlockState> = new Map();
  private worldSize: number;
  private listeners: Set<(type: string, data: unknown) => void> = new Set();

  // Delegated light propagation engine
  private propagationEngine: LightPropagationEngine = new LightPropagationEngine();

  // Performance: sensor position index for O(1) lookup
  private sensorPositions: Set<string> = new Set();

  // Performance: emitter position cache
  private emitterPositions: Set<string> = new Set();

  // Performance: debounce timer for light propagation
  private propagationTimer: ReturnType<typeof setTimeout> | null = null;
  private propagationDebounceMs: number = 0;

  constructor(size: number = 32) {
    this.worldSize = size;
    this.initializeGround();
  }

  /**
   * Enable debounced light propagation for performance.
   */
  setDebounceMs(ms: number): void {
    this.propagationDebounceMs = ms;
  }

  /**
   * Configure propagation behavior
   */
  setPropagationConfig(config: Partial<PropagationConfig>): void {
    this.propagationEngine.setConfig(config);
  }

  /**
   * Get current propagation configuration
   */
  getPropagationConfig(): PropagationConfig {
    return this.propagationEngine.getConfig();
  }

  /**
   * 初始化地面
   */
  private initializeGround(): void {
    for (let x = -this.worldSize / 2; x < this.worldSize / 2; x++) {
      for (let z = -this.worldSize / 2; z < this.worldSize / 2; z++) {
        this.setBlock(x, 0, z, createDefaultBlockState('solid'));
      }
    }
  }

  // ============================================
  // Event System
  // ============================================

  addListener(callback: (type: string, data: unknown) => void): void {
    this.listeners.add(callback);
  }

  removeListener(callback: (type: string, data: unknown) => void): void {
    this.listeners.delete(callback);
  }

  private emit(type: string, data: unknown): void {
    for (const listener of this.listeners) {
      listener(type, data);
    }
  }

  // ============================================
  // Block Management
  // ============================================

  getBlock(x: number, y: number, z: number): BlockState | null {
    return this.blocks.get(posKey(x, y, z)) || null;
  }

  /**
   * Get the internal blocks map (used by LightPropagationEngine)
   */
  getBlocksMap(): Map<string, BlockState> {
    return this.blocks;
  }

  setBlock(x: number, y: number, z: number, state: BlockState): void {
    const key = posKey(x, y, z);

    // Update sensor/emitter indices
    const oldBlock = this.blocks.get(key);
    if (oldBlock?.type === 'sensor') this.sensorPositions.delete(key);
    if (oldBlock?.type === 'emitter') this.emitterPositions.delete(key);

    if (state.type === 'air') {
      this.blocks.delete(key);
    } else {
      this.blocks.set(key, state);
      if (state.type === 'sensor') this.sensorPositions.add(key);
      if (state.type === 'emitter') this.emitterPositions.add(key);
    }

    this.emit('blockChanged', { x, y, z, state });
    this.schedulePropagation();
  }

  removeBlock(x: number, y: number, z: number): void {
    this.setBlock(x, y, z, createDefaultBlockState('air'));
  }

  getAllBlocks(): Array<{ position: BlockPosition; state: BlockState }> {
    const result: Array<{ position: BlockPosition; state: BlockState }> = [];
    for (const [key, state] of this.blocks) {
      result.push({ position: parseKey(key), state });
    }
    return result;
  }

  // ============================================
  // BlockAccessor Interface (for LightPropagationEngine)
  // ============================================

  findPortalById(portalId: string): { position: BlockPosition; state: BlockState } | null {
    for (const [key, state] of this.blocks) {
      if (state.type === 'portal' && state.linkedPortalId === portalId) {
        const position = parseKey(key);
        return { position, state };
      }
    }
    return null;
  }

  // ============================================
  // Light State Access (delegated to engine)
  // ============================================

  getLightState(x: number, y: number, z: number): LightState | null {
    return this.propagationEngine.getLightState(x, y, z);
  }

  getAllLightStates(): Array<{ position: BlockPosition; state: LightState }> {
    return this.propagationEngine.getAllLightStates();
  }

  getTotalLightIntensity(x: number, y: number, z: number): number {
    return this.propagationEngine.getTotalLightIntensity(x, y, z);
  }

  // ============================================
  // Light Propagation
  // ============================================

  /**
   * Schedule light propagation recalculation.
   */
  private schedulePropagation(): void {
    if (this.propagationDebounceMs <= 0) {
      this.updateLightPropagation();
      return;
    }

    if (this.propagationTimer !== null) {
      clearTimeout(this.propagationTimer);
    }
    this.propagationTimer = setTimeout(() => {
      this.propagationTimer = null;
      this.updateLightPropagation();
    }, this.propagationDebounceMs);
  }

  /**
   * 更新光传播 - delegates to LightPropagationEngine
   */
  updateLightPropagation(): void {
    this.propagationEngine.propagate(this, this.worldSize);
    this.updateSensors();
    this.emit('lightUpdated', this.getAllLightStates());
  }

  // ============================================
  // Sensor Management
  // ============================================

  /**
   * 更新所有感应器状态
   * Optimized: Uses sensor index for O(k) lookup.
   */
  private updateSensors(): void {
    for (const key of this.sensorPositions) {
      const state = this.blocks.get(key);
      if (!state || state.type !== 'sensor') {
        this.sensorPositions.delete(key);
        continue;
      }

      const pos = parseKey(key);
      const lightState = this.propagationEngine.getLightState(pos.x, pos.y, pos.z);

      let totalIntensity = 0;
      let hasRequiredPolarization = false;

      if (lightState) {
        for (const packet of lightState.packets) {
          totalIntensity += packet.intensity;
          if (packet.polarization === state.polarizationAngle) {
            hasRequiredPolarization = true;
          }
        }
      }

      const wasActivated = state.activated;
      state.activated = totalIntensity >= state.requiredIntensity && hasRequiredPolarization;

      if (wasActivated !== state.activated) {
        this.emit('sensorChanged', { position: pos, activated: state.activated });
      }
    }
  }

  // ============================================
  // Block Rotation
  // ============================================

  rotateBlock(x: number, y: number, z: number): void {
    const block = this.getBlock(x, y, z);
    if (!block) return;

    if (block.type === 'polarizer' || block.type === 'emitter') {
      const angles: PolarizationAngle[] = [0, 45, 90, 135];
      const currentIndex = angles.indexOf(block.polarizationAngle);
      block.polarizationAngle = angles[(currentIndex + 1) % 4];
    } else if (block.type === 'rotator') {
      block.rotationAmount = block.rotationAmount === 45 ? 90 : 45;
    } else {
      block.rotation = (block.rotation + 90) % 360;
      const directions: Direction[] = ['north', 'east', 'south', 'west'];
      const currentIndex = directions.indexOf(block.facing);
      block.facing = directions[(currentIndex + 1) % 4];
    }

    this.emit('blockChanged', { x, y, z, state: block });
    this.schedulePropagation();
  }

  // ============================================
  // World Management
  // ============================================

  clear(): void {
    this.blocks.clear();
    this.propagationEngine.clear();
    this.sensorPositions.clear();
    this.emitterPositions.clear();
    if (this.propagationTimer !== null) {
      clearTimeout(this.propagationTimer);
      this.propagationTimer = null;
    }
    this.initializeGround();
    this.emit('worldCleared', null);
  }

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
