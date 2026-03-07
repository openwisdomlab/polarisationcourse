/**
 * Physics Worker - 物理计算Web Worker
 *
 * 将光线传播等CPU密集计算移到后台线程，避免阻塞UI渲染。
 * 通过消息协议与主线程通信。
 */

import {
  BlockState,
  BlockPosition,
  LightState,
} from '@/core/types'
import {
  LightPropagationEngine,
  type BlockAccessor,
  type PropagationConfig,
  type PropagationMetrics,
} from '@/core/LightPropagationEngine'

// ============================================
// Worker消息协议
// ============================================

export interface WorkerRequest {
  type: 'propagate'
  id: number
  blocks: Array<[string, BlockState]>
  worldSize: number
  config?: Partial<PropagationConfig>
}

export interface WorkerResponse {
  type: 'propagateResult'
  id: number
  lightStates: Array<{ position: BlockPosition; state: LightState }>
  metrics: PropagationMetrics | null
}

// ============================================
// Worker内部块访问器
// ============================================

class WorkerBlockAccessor implements BlockAccessor {
  private blocks: Map<string, BlockState>

  constructor(blocks: Array<[string, BlockState]>) {
    this.blocks = new Map(blocks)
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
        const parts = key.split(',')
        return {
          position: { x: Number(parts[0]), y: Number(parts[1]), z: Number(parts[2]) },
          state,
        }
      }
    }
    return null
  }
}

// ============================================
// Worker主逻辑
// ============================================

const engine = new LightPropagationEngine()

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { type, id, blocks, worldSize, config } = event.data

  if (type === 'propagate') {
    if (config) {
      engine.setConfig(config)
    }

    const accessor = new WorkerBlockAccessor(blocks)
    const lightStates = engine.propagate(accessor, worldSize)
    const metrics = engine.getLastMetrics()

    const response: WorkerResponse = {
      type: 'propagateResult',
      id,
      lightStates,
      metrics,
    }

    self.postMessage(response)
  }
}
