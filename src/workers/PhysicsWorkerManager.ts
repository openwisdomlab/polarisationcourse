/**
 * PhysicsWorkerManager - 物理Worker管理器
 *
 * 封装Web Worker通信，提供Promise-based API。
 * 支持降级到主线程计算(Worker不可用时)。
 */

import type { BlockState, BlockPosition, LightState } from '@/core/types'
import type { PropagationConfig, PropagationMetrics } from '@/core/LightPropagationEngine'
import type { WorkerRequest, WorkerResponse } from './physicsWorker'
import { logger } from '@/lib/logger'

interface PropagationResult {
  lightStates: Array<{ position: BlockPosition; state: LightState }>
  metrics: PropagationMetrics | null
}

type PendingRequest = {
  resolve: (result: PropagationResult) => void
  reject: (error: Error) => void
}

export class PhysicsWorkerManager {
  private worker: Worker | null = null
  private requestId = 0
  private pendingRequests = new Map<number, PendingRequest>()
  private available = false

  constructor() {
    this.initWorker()
  }

  private initWorker(): void {
    try {
      this.worker = new Worker(
        new URL('./physicsWorker.ts', import.meta.url),
        { type: 'module' }
      )

      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const { id, lightStates, metrics } = event.data
        const pending = this.pendingRequests.get(id)
        if (pending) {
          pending.resolve({ lightStates, metrics })
          this.pendingRequests.delete(id)
        }
      }

      this.worker.onerror = (error) => {
        logger.error('[PhysicsWorkerManager] Worker error:', error)
        // 拒绝所有待处理请求
        for (const [id, pending] of this.pendingRequests) {
          pending.reject(new Error('Worker error'))
          this.pendingRequests.delete(id)
        }
      }

      this.available = true
      logger.info('[PhysicsWorkerManager] Worker initialized successfully')
    } catch {
      logger.warn('[PhysicsWorkerManager] Worker not available, will use main thread fallback')
      this.available = false
    }
  }

  /** Worker是否可用 */
  get isAvailable(): boolean {
    return this.available
  }

  /** 在Worker中计算光线传播 */
  propagate(
    blocks: Map<string, BlockState>,
    worldSize: number,
    config?: Partial<PropagationConfig>
  ): Promise<PropagationResult> {
    if (!this.worker || !this.available) {
      return Promise.reject(new Error('Worker not available'))
    }

    const id = ++this.requestId

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject })

      const request: WorkerRequest = {
        type: 'propagate',
        id,
        blocks: Array.from(blocks.entries()),
        worldSize,
        config,
      }

      this.worker!.postMessage(request)

      // 超时保护 (5秒)
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id)
          reject(new Error('Worker request timed out'))
        }
      }, 5000)
    })
  }

  /** 销毁Worker */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
      this.available = false
    }
    // 拒绝所有待处理请求
    for (const [, pending] of this.pendingRequests) {
      pending.reject(new Error('Worker terminated'))
    }
    this.pendingRequests.clear()
  }
}

/** 全局单例 */
let instance: PhysicsWorkerManager | null = null

export function getPhysicsWorkerManager(): PhysicsWorkerManager {
  if (!instance) {
    instance = new PhysicsWorkerManager()
  }
  return instance
}
