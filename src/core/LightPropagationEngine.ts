/**
 * Light Propagation Engine (光线传播引擎)
 *
 * Extracted from World.ts to separate light propagation logic from
 * block storage and world management.
 *
 * Provides:
 * - BFS-based wave optics propagation (Jones Calculus)
 * - Legacy recursive propagation (backward compatibility)
 * - Block interaction processing for all optical element types
 * - Coherent interference calculation
 */

import {
  BlockState,
  BlockPosition,
  LightPacket,
  LightState,
  DIRECTION_VECTORS,
} from './types'
import { LightPhysics, WaveLight } from './LightPhysics'
import { logger } from '@/lib/logger'

// ============================================
// Types
// ============================================

/** Propagation queue item for BFS light propagation */
export interface PropagationItem {
  position: BlockPosition
  light: WaveLight
}

/** Wave light state at a position (for coherent superposition) */
export interface WaveLightState {
  lights: WaveLight[]
}

/** Configuration for light propagation */
export interface PropagationConfig {
  /** Use wave optics (Jones Calculus) instead of legacy scalar model */
  useWaveOptics: boolean
  /** Maximum iterations for BFS (prevents infinite loops) */
  maxIterations: number
  /** Energy threshold for stopping propagation */
  energyThreshold: number
}

export const DEFAULT_PROPAGATION_CONFIG: PropagationConfig = {
  useWaveOptics: true,
  maxIterations: 10000,
  energyThreshold: 0.01,
}

/** 传播性能指标 */
export interface PropagationMetrics {
  iterations: number
  emitterCount: number
  lightStateCount: number
  durationMs: number
  visitedCount: number
}

// ============================================
// High-Performance Deque (环形缓冲区双端队列)
// 替换Array.shift() O(n) -> O(1)摊还
// ============================================

class Deque<T> {
  private buffer: (T | undefined)[]
  private head: number = 0
  private tail: number = 0
  private count: number = 0

  constructor(initialCapacity: number = 64) {
    this.buffer = new Array(initialCapacity)
  }

  get length(): number {
    return this.count
  }

  push(item: T): void {
    if (this.count === this.buffer.length) {
      this.grow()
    }
    this.buffer[this.tail] = item
    this.tail = (this.tail + 1) % this.buffer.length
    this.count++
  }

  shift(): T | undefined {
    if (this.count === 0) return undefined
    const item = this.buffer[this.head]
    this.buffer[this.head] = undefined
    this.head = (this.head + 1) % this.buffer.length
    this.count--
    return item
  }

  private grow(): void {
    const newBuffer = new Array(this.buffer.length * 2)
    for (let i = 0; i < this.count; i++) {
      newBuffer[i] = this.buffer[(this.head + i) % this.buffer.length]
    }
    this.buffer = newBuffer
    this.head = 0
    this.tail = this.count
  }
}

// 方块键值生成
function posKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`
}

// 数值化visited key - 比字符串拼接更快
function numericVisitKey(sourceHash: number, x: number, y: number, z: number, dirIndex: number): number {
  // 使用位运算生成紧凑hash (假设坐标范围 ±512, 6个方向)
  return ((sourceHash & 0xFFF) << 20) |
         (((x + 512) & 0x3FF) << 10) |
         (((y + 512) & 0x3FF)) |
         ((z + 512) << 22) |
         (dirIndex << 30)
}

// 方向索引映射
const DIRECTION_INDEX: Record<string, number> = {
  north: 0, south: 1, east: 2, west: 3, up: 4, down: 5
}

/** Block access interface for the propagation engine */
export interface BlockAccessor {
  getBlock(x: number, y: number, z: number): BlockState | null
  getBlocksMap(): Map<string, BlockState>
  findPortalById(portalId: string): { position: BlockPosition; state: BlockState } | null
}

/**
 * Light Propagation Engine
 *
 * Responsible for BFS and legacy light propagation through optical elements.
 * Receives block data through BlockAccessor interface for decoupling.
 */
export class LightPropagationEngine {
  private lightStates: Map<string, LightState> = new Map()
  private waveLightStates: Map<string, WaveLightState> = new Map()
  private config: PropagationConfig = { ...DEFAULT_PROPAGATION_CONFIG }
  private emitterCounter: number = 0
  private lastMetrics: PropagationMetrics | null = null

  setConfig(config: Partial<PropagationConfig>): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): PropagationConfig {
    return { ...this.config }
  }

  /** 获取上次传播的性能指标 */
  getLastMetrics(): PropagationMetrics | null {
    return this.lastMetrics
  }

  getLightState(x: number, y: number, z: number): LightState | null {
    return this.lightStates.get(posKey(x, y, z)) || null
  }

  getAllLightStates(): Array<{ position: BlockPosition; state: LightState }> {
    const result: Array<{ position: BlockPosition; state: LightState }> = []
    for (const [key, state] of this.lightStates) {
      if (state.packets.length > 0) {
        result.push({ position: parseKey(key), state })
      }
    }
    return result
  }

  getTotalLightIntensity(x: number, y: number, z: number): number {
    const state = this.lightStates.get(posKey(x, y, z))
    if (!state) return 0
    let total = 0
    for (const packet of state.packets) {
      total += packet.intensity
    }
    return Math.min(total, 15)
  }

  /**
   * Run full light propagation recalculation.
   * Clears existing states and repropagate from all emitters.
   */
  propagate(accessor: BlockAccessor, worldSize: number): Array<{ position: BlockPosition; state: LightState }> {
    this.lightStates.clear()
    this.waveLightStates.clear()

    if (this.config.useWaveOptics) {
      this.propagateLightBFS(accessor, worldSize)
    } else {
      this.propagateLightLegacy(accessor, worldSize)
    }

    return this.getAllLightStates()
  }

  clear(): void {
    this.lightStates.clear()
    this.waveLightStates.clear()
  }

  // ============================================
  // BFS Wave Optics Propagation
  // ============================================

  private propagateLightBFS(accessor: BlockAccessor, worldSize: number): void {
    const startTime = performance.now()
    const blocks = accessor.getBlocksMap()

    // Collect all emitters
    const emitters: Array<{ position: BlockPosition; state: BlockState }> = []
    for (const [key, state] of blocks) {
      if (state.type === 'emitter') {
        emitters.push({ position: parseKey(key), state })
      }
    }

    // 使用高性能Deque替代Array (shift从O(n)降为O(1))
    const queue = new Deque<PropagationItem>(Math.max(64, emitters.length * 4))
    const sourceHashes = new Map<string, number>()

    for (const emitter of emitters) {
      const sourceId = `emitter_${this.emitterCounter++}`
      sourceHashes.set(sourceId, this.emitterCounter)
      const initialLight = LightPhysics.createEmitterWave(emitter.state, sourceId)
      queue.push({ position: emitter.position, light: initialLight })
    }

    // 双层visited追踪: 数值hash快速路径 + 字符串Set精确回退
    const visitedFast = new Set<number>()
    const visitedExact = new Set<string>()
    let iterations = 0
    const { maxIterations, energyThreshold } = this.config

    // BFS propagation loop with O(1) dequeue
    while (queue.length > 0 && iterations < maxIterations) {
      iterations++
      const item = queue.shift()!
      const { position, light } = item

      if (light.jones.intensity < energyThreshold) continue

      const dir = DIRECTION_VECTORS[light.direction]
      if (!dir) {
        logger.error(`Invalid light direction: "${light.direction}". Skipping.`)
        continue
      }

      const nextPos: BlockPosition = {
        x: position.x + dir.x,
        y: position.y + dir.y,
        z: position.z + dir.z,
      }

      if (Math.abs(nextPos.x) > worldSize ||
          Math.abs(nextPos.y) > worldSize ||
          Math.abs(nextPos.z) > worldSize) {
        continue
      }

      // 快速数值hash检查 (大部分情况下足够)
      const srcHash = sourceHashes.get(light.sourceId) ?? 0
      const dirIdx = DIRECTION_INDEX[light.direction] ?? 0
      const fastKey = numericVisitKey(srcHash, nextPos.x, nextPos.y, nextPos.z, dirIdx)

      if (visitedFast.has(fastKey)) {
        // Hash冲突时回退到精确字符串检查
        const exactKey = `${light.sourceId}_${nextPos.x},${nextPos.y},${nextPos.z}_${light.direction}`
        if (visitedExact.has(exactKey)) continue
        visitedExact.add(exactKey)
      } else {
        visitedFast.add(fastKey)
      }

      const advancedLight = LightPhysics.advanceWaveLight(light)
      this.addWaveLightToPosition(nextPos, advancedLight)

      const block = accessor.getBlock(nextPos.x, nextPos.y, nextPos.z)
      const outputLights = this.processBlockWave(nextPos, advancedLight, block, accessor)

      for (const outputLight of outputLights) {
        if (LightPhysics.isAboveThreshold(outputLight)) {
          // 缓存新source的hash
          if (!sourceHashes.has(outputLight.sourceId)) {
            sourceHashes.set(outputLight.sourceId, sourceHashes.size + 1)
          }
          queue.push({ position: nextPos, light: outputLight })
        }
      }
    }

    if (iterations >= maxIterations) {
      logger.warn(`Light propagation reached maximum iterations (${maxIterations}).`)
    }

    this.finalizeWaveLightStates()

    // 记录性能指标
    this.lastMetrics = {
      iterations,
      emitterCount: emitters.length,
      lightStateCount: this.lightStates.size,
      durationMs: performance.now() - startTime,
      visitedCount: visitedFast.size + visitedExact.size,
    }
  }

  private processBlockWave(
    position: BlockPosition,
    light: WaveLight,
    block: BlockState | null,
    accessor: BlockAccessor
  ): WaveLight[] {
    if (!block || block.type === 'air') return [light]

    switch (block.type) {
      case 'solid':
      case 'emitter':
        return []
      case 'polarizer': {
        const result = LightPhysics.processPolarizerWave(light, block)
        return result ? [result] : []
      }
      case 'rotator':
        return [LightPhysics.processRotatorWave(light, block)]
      case 'splitter':
        return LightPhysics.processSplitterWave(light, block)
      case 'mirror': {
        const result = LightPhysics.processMirrorWave(light, block)
        return result ? [result] : []
      }
      case 'sensor':
        return [light]
      case 'absorber': {
        const result = LightPhysics.processAbsorberWave(light, block)
        return result ? [result] : []
      }
      case 'phaseShifter':
        return [LightPhysics.processPhaseShifterWave(light, block)]
      case 'beamSplitter':
        return LightPhysics.processBeamSplitterWave(light, block)
      case 'quarterWave':
        return [LightPhysics.processQuarterWaveWave(light, block)]
      case 'halfWave':
        return [LightPhysics.processHalfWaveWave(light, block)]
      case 'prism':
        return [LightPhysics.processPrismWave(light, block)]
      case 'lens':
        return LightPhysics.processLensWave(light, block)
      case 'portal':
        return this.handlePortalBlockWave(position, light, block, accessor)
      default:
        return [light]
    }
  }

  private handlePortalBlockWave(
    _position: BlockPosition,
    light: WaveLight,
    block: BlockState,
    accessor: BlockAccessor
  ): WaveLight[] {
    const linkedId = block.linkedPortalId
    if (!linkedId) return [light]

    const linkedPortal = accessor.findPortalById(linkedId)
    if (linkedPortal) {
      return [{ ...light }]
    }
    return [light]
  }

  private addWaveLightToPosition(position: BlockPosition, light: WaveLight): void {
    const key = posKey(position.x, position.y, position.z)
    if (!this.waveLightStates.has(key)) {
      this.waveLightStates.set(key, { lights: [] })
    }
    this.waveLightStates.get(key)!.lights.push(light)
  }

  private finalizeWaveLightStates(): void {
    for (const [key, waveState] of this.waveLightStates) {
      const superposedLights = LightPhysics.calculateInterferenceWave(waveState.lights)
      const packets: LightPacket[] = []
      for (const light of superposedLights) {
        if (LightPhysics.isAboveThreshold(light)) {
          packets.push(LightPhysics.toLightPacket(light))
        }
      }
      if (packets.length > 0) {
        const finalPackets = LightPhysics.calculateInterference(packets)
        this.lightStates.set(key, { packets: finalPackets })
      }
    }
  }

  // ============================================
  // Legacy Recursive Propagation
  // ============================================

  private propagateLightLegacy(accessor: BlockAccessor, worldSize: number): void {
    const blocks = accessor.getBlocksMap()
    const emitters: Array<{ position: BlockPosition; state: BlockState }> = []
    for (const [key, state] of blocks) {
      if (state.type === 'emitter') {
        emitters.push({ position: parseKey(key), state })
      }
    }
    for (const emitter of emitters) {
      this.propagateFromEmitterLegacy(emitter.position, emitter.state, accessor, worldSize)
    }
  }

  private propagateFromEmitterLegacy(
    position: BlockPosition,
    state: BlockState,
    accessor: BlockAccessor,
    worldSize: number
  ): void {
    const emitDirection = LightPhysics.getActualFacing(state.facing, state.rotation)
    const initialLight: LightPacket = {
      direction: emitDirection,
      intensity: 15,
      polarization: state.polarizationAngle,
      phase: 1,
    }
    this.propagateRecursive(position, initialLight, 0, accessor, worldSize)
  }

  private propagateRecursive(
    fromPosition: BlockPosition,
    light: LightPacket,
    depth: number,
    accessor: BlockAccessor,
    worldSize: number
  ): void {
    if (depth > 100 || light.intensity <= 0) return

    const dir = DIRECTION_VECTORS[light.direction]
    if (!dir) {
      logger.error(`Invalid light direction: "${light.direction}". Light propagation stopped.`)
      return
    }

    const nextPos: BlockPosition = {
      x: fromPosition.x + dir.x,
      y: fromPosition.y + dir.y,
      z: fromPosition.z + dir.z,
    }

    if (Math.abs(nextPos.x) > worldSize ||
        Math.abs(nextPos.y) > worldSize ||
        Math.abs(nextPos.z) > worldSize) {
      return
    }

    this.addLightToPosition(nextPos, light)
    const block = accessor.getBlock(nextPos.x, nextPos.y, nextPos.z)

    if (!block) {
      this.propagateRecursive(nextPos, light, depth + 1, accessor, worldSize)
      return
    }

    switch (block.type) {
      case 'air':
        this.propagateRecursive(nextPos, light, depth + 1, accessor, worldSize)
        break
      case 'solid':
      case 'emitter':
        break
      case 'polarizer': {
        const result = LightPhysics.processPolarizerBlock(light, block)
        if (result && result.intensity > 0)
          this.propagateRecursive(nextPos, result, depth + 1, accessor, worldSize)
        break
      }
      case 'rotator': {
        const result = LightPhysics.processRotatorBlock(light, block)
        this.propagateRecursive(nextPos, result, depth + 1, accessor, worldSize)
        break
      }
      case 'splitter': {
        const results = LightPhysics.processSplitterBlock(light, block)
        for (const r of results) {
          if (r.intensity > 0) this.propagateRecursive(nextPos, r, depth + 1, accessor, worldSize)
        }
        break
      }
      case 'mirror': {
        const result = LightPhysics.processMirrorBlock(light, block)
        if (result && result.intensity > 0)
          this.propagateRecursive(nextPos, result, depth + 1, accessor, worldSize)
        break
      }
      case 'sensor':
        this.propagateRecursive(nextPos, light, depth + 1, accessor, worldSize)
        break
      case 'absorber': {
        const result = LightPhysics.processAbsorberBlock(light, block)
        if (result && result.intensity > 0)
          this.propagateRecursive(nextPos, result, depth + 1, accessor, worldSize)
        break
      }
      case 'phaseShifter': {
        const result = LightPhysics.processPhaseShifterBlock(light, block)
        this.propagateRecursive(nextPos, result, depth + 1, accessor, worldSize)
        break
      }
      case 'beamSplitter': {
        const results = LightPhysics.processBeamSplitterBlock(light, block)
        for (const r of results) {
          if (r.intensity > 0) this.propagateRecursive(nextPos, r, depth + 1, accessor, worldSize)
        }
        break
      }
      case 'quarterWave': {
        const result = LightPhysics.processQuarterWaveBlock(light, block)
        this.propagateRecursive(nextPos, result, depth + 1, accessor, worldSize)
        break
      }
      case 'halfWave': {
        const result = LightPhysics.processHalfWaveBlock(light, block)
        this.propagateRecursive(nextPos, result, depth + 1, accessor, worldSize)
        break
      }
      case 'prism': {
        const result = LightPhysics.processPrismBlock(light, block)
        this.propagateRecursive(nextPos, result, depth + 1, accessor, worldSize)
        break
      }
      case 'lens': {
        const results = LightPhysics.processLensBlock(light, block)
        for (const r of results) {
          if (r.intensity > 0) this.propagateRecursive(nextPos, r, depth + 1, accessor, worldSize)
        }
        break
      }
      case 'portal': {
        const linkedId = block.linkedPortalId
        if (!linkedId) {
          this.propagateRecursive(nextPos, light, depth + 1, accessor, worldSize)
        } else {
          const linkedPortal = accessor.findPortalById(linkedId)
          if (linkedPortal) {
            this.propagateRecursive(linkedPortal.position, light, depth + 1, accessor, worldSize)
          }
        }
        break
      }
    }
  }

  private addLightToPosition(position: BlockPosition, light: LightPacket): void {
    const key = posKey(position.x, position.y, position.z)
    if (!this.lightStates.has(key)) {
      this.lightStates.set(key, { packets: [] })
    }
    const state = this.lightStates.get(key)!
    state.packets.push({ ...light })
    state.packets = LightPhysics.calculateInterference(state.packets)
  }
}

// 从键值解析位置
function parseKey(key: string): BlockPosition {
  const parts = key.split(',')
  if (parts.length !== 3) {
    logger.error(`Invalid position key format: "${key}".`)
    return { x: 0, y: 0, z: 0 }
  }
  const [xStr, yStr, zStr] = parts
  const x = Number(xStr)
  const y = Number(yStr)
  const z = Number(zStr)
  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    logger.error(`Invalid position key values: "${key}".`)
    return { x: 0, y: 0, z: 0 }
  }
  return { x, y, z }
}
