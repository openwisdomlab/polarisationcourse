/**
 * RouteLoader - 路由级加载指示组件
 *
 * Provides visual feedback during lazy route loading.
 * Used as pendingComponent in TanStack Router file routes.
 */

export function RouteLoader({ label }: { label?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-cyan-400 text-sm">{label ?? 'Loading...'}</span>
      </div>
    </div>
  )
}

export function StudioLoader() {
  return <RouteLoader label="Loading Optical Studio..." />
}

export function GameLoader() {
  return <RouteLoader label="Loading Game..." />
}

export function OdysseyLoader() {
  return <RouteLoader label="Loading Odyssey..." />
}

export function CourseLoader() {
  return <RouteLoader label="Loading Course..." />
}

export function DemosLoader() {
  return <RouteLoader label="Loading Demos..." />
}
