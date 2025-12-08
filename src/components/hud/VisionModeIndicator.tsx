import { useGameStore } from '@/stores/gameStore'
import { cn } from '@/lib/utils'

export function VisionModeIndicator() {
  const { visionMode, toggleVisionMode } = useGameStore()

  const isPolarized = visionMode === 'polarized'

  return (
    <button
      onClick={toggleVisionMode}
      className={cn(
        "absolute top-5 right-5 px-4 py-3 rounded-lg text-sm transition-all duration-300",
        "border cursor-pointer",
        isPolarized
          ? "bg-red-900/70 border-red-500/50 text-red-200"
          : "bg-black/70 border-cyan-400/30 text-gray-300"
      )}
    >
      {isPolarized ? '🔴 偏振视角' : '👁 普通视角'}
    </button>
  )
}
