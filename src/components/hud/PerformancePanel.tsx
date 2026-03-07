/**
 * PerformancePanel - 性能监控HUD面板
 *
 * 显示FPS、帧时间、光线传播指标等性能数据。
 * 仅在开发模式或按快捷键(F9)时显示。
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/stores/gameStore'
import type { PropagationMetrics } from '@/core/LightPropagationEngine'

interface PerformancePanelProps {
  /** 是否显示 */
  visible?: boolean
}

/** R3F场景内的FPS采样器 (必须在Canvas内使用) */
export function FPSSampler({ onFrame }: { onFrame: (dt: number) => void }) {
  useFrame((_, delta) => {
    onFrame(delta)
  })
  return null
}

/** HUD面板 (在Canvas外使用) */
export function PerformancePanel({ visible = false }: PerformancePanelProps) {
  const [show, setShow] = useState(visible)
  const [fps, setFps] = useState(0)
  const [frameTime, setFrameTime] = useState(0)
  const [metrics, setMetrics] = useState<PropagationMetrics | null>(null)

  const fpsHistory = useRef<number[]>([])
  const lastUpdate = useRef(0)

  // 快捷键 F9 切换面板
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        e.preventDefault()
        setShow(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 从物理引擎获取传播指标
  useEffect(() => {
    if (!show) return

    const interval = setInterval(() => {
      const world = useGameStore.getState().world
      if (world) {
        // 访问引擎指标 (通过World暴露的接口)
        const engine = (world as unknown as { propagationEngine?: { getLastMetrics?: () => PropagationMetrics | null } }).propagationEngine
        if (engine?.getLastMetrics) {
          setMetrics(engine.getLastMetrics())
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [show])

  const handleFrame = useCallback((delta: number) => {
    if (!show) return

    const now = performance.now()
    const currentFps = 1 / Math.max(delta, 0.001)
    fpsHistory.current.push(currentFps)

    // 每500ms更新一次显示
    if (now - lastUpdate.current > 500) {
      const history = fpsHistory.current
      const avgFps = history.reduce((a, b) => a + b, 0) / history.length
      setFps(Math.round(avgFps))
      setFrameTime(Math.round((1000 / avgFps) * 100) / 100)
      fpsHistory.current = []
      lastUpdate.current = now
    }
  }, [show])

  if (!show) {
    return <FPSSampler onFrame={handleFrame} />
  }

  const fpsColor = fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'

  return (
    <>
      <FPSSampler onFrame={handleFrame} />
      <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs font-mono text-white border border-gray-700 min-w-[180px]">
        <div className="text-gray-400 mb-1 text-[10px] uppercase tracking-wider">Performance</div>

        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-400">FPS</span>
          <span className={fpsColor}>{fps}</span>
        </div>

        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-400">Frame</span>
          <span className="text-gray-300">{frameTime}ms</span>
        </div>

        {metrics && (
          <>
            <div className="border-t border-gray-700 my-1.5" />
            <div className="text-gray-400 mb-1 text-[10px] uppercase tracking-wider">Light Engine</div>

            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400">Iterations</span>
              <span className="text-cyan-400">{metrics.iterations}</span>
            </div>

            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400">Emitters</span>
              <span className="text-gray-300">{metrics.emitterCount}</span>
            </div>

            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400">Light States</span>
              <span className="text-gray-300">{metrics.lightStateCount}</span>
            </div>

            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400">Visited</span>
              <span className="text-gray-300">{metrics.visitedCount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Duration</span>
              <span className={metrics.durationMs > 16 ? 'text-red-400' : 'text-green-400'}>
                {metrics.durationMs.toFixed(2)}ms
              </span>
            </div>
          </>
        )}

        <div className="border-t border-gray-700 mt-1.5 pt-1 text-[9px] text-gray-500 text-center">
          Press F9 to toggle
        </div>
      </div>
    </>
  )
}

export default PerformancePanel
