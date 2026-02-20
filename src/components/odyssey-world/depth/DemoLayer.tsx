/**
 * DemoLayer.tsx -- Demo 探索器容器 (惰性加载)
 *
 * 将概念的 demoComponentId 映射到实际 React 组件:
 * - 'malus-law-explorer' -> MalusLawExplorer
 * - 'circular-pol-explorer' -> CircularPolExplorer
 * - 'brewster-explorer' -> BrewsterExplorer
 *
 * 使用 React.lazy + Suspense 实现按需加载。
 * 无映射或无 demoComponentId 时显示 "Demo coming soon" 占位。
 */

import React, { Suspense } from 'react'
import type { ConceptDefinition } from '@/components/odyssey-world/concepts/conceptRegistry'

// ── 惰性加载注册表 ──────────────────────────────────────────────────

const DEMO_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<{ conceptId: string; regionId: string }>>> = {
  'malus-law-explorer': React.lazy(() => import('../demos/MalusLawExplorer')),
  'circular-pol-explorer': React.lazy(() => import('../demos/CircularPolExplorer')),
  'brewster-explorer': React.lazy(() => import('../demos/BrewsterExplorer')),
}

// ── 加载骨架 ──────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div
        className="h-32 w-full max-w-[420px] rounded-lg"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }}
      />
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <p className="mt-3 text-xs text-white/30">Loading explorer...</p>
    </div>
  )
}

// ── 主组件 ──────────────────────────────────────────────────────────

interface DemoLayerProps {
  concept: ConceptDefinition
}

/**
 * DemoLayer -- Demo 探索器容器
 *
 * 根据 concept.demoComponentId 惰性加载对应的探索器组件。
 * 若 demoComponentId 不存在或未映射，显示占位符。
 */
export function DemoLayer({ concept }: DemoLayerProps) {
  const demoId = concept.demoComponentId
  const LazyComponent = demoId ? DEMO_COMPONENTS[demoId] : undefined

  if (!LazyComponent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-white/30">
          Demo coming soon
        </p>
      </div>
    )
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LazyComponent conceptId={concept.id} regionId={concept.regionId} />
    </Suspense>
  )
}
