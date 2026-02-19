/**
 * OdysseyDemoEmbed - 懒加载演示组件包装器
 * 隐藏内嵌演示的原始标题栏，提供加载占位骨架
 */
import { Suspense } from 'react'
import type React from 'react'

// ── Loading skeleton ────────────────────────────────────────
function DemoSkeleton({ color }: { color: string }) {
  return (
    <div
      className="rounded-2xl bg-white/5 border border-white/10 aspect-[16/9] animate-pulse flex flex-col items-center justify-center gap-3"
      style={{ borderColor: `${color}15` }}
    >
      <span className="text-3xl opacity-40">&#9879;</span>
      <span className="text-xs font-mono tracking-widest uppercase opacity-40">
        Loading...
      </span>
    </div>
  )
}

// ── Props ────────────────────────────────────────────────────
interface OdysseyDemoEmbedProps {
  component: React.LazyExoticComponent<React.ComponentType<{ difficultyLevel?: string }>>
  color: string
  difficultyLevel?: string
}

// ── Component ────────────────────────────────────────────────
export function OdysseyDemoEmbed({
  component: DemoComponent,
  color,
  difficultyLevel = 'foundation',
}: OdysseyDemoEmbedProps) {
  return (
    <div className="relative [&_[data-demo-header]]:hidden">
      <Suspense fallback={<DemoSkeleton color={color} />}>
        <DemoComponent difficultyLevel={difficultyLevel} />
      </Suspense>
    </div>
  )
}
