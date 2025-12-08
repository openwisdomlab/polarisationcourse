import { useGameStore } from '@/stores/gameStore'
import { TUTORIAL_LEVELS } from '@/core/World'
import { cn } from '@/lib/utils'

export function LevelSelector() {
  const { currentLevelIndex, loadLevel } = useGameStore()

  return (
    <div className="flex gap-1.5">
      {TUTORIAL_LEVELS.map((level, index) => (
        <button
          key={index}
          onClick={() => loadLevel(index)}
          className={cn(
            "w-8 h-8 rounded-lg text-xs font-medium transition-all",
            "border",
            currentLevelIndex === index
              ? "bg-cyan-400/20 border-cyan-400 text-cyan-400"
              : "bg-slate-800/50 border-slate-600/50 text-gray-400 hover:border-cyan-400/50 hover:text-gray-200"
          )}
          title={level.name}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => {
          const { world } = useGameStore.getState()
          if (world) {
            world.clear()
          }
        }}
        className="px-3 h-8 rounded-lg text-xs font-medium transition-all
                   bg-orange-400/20 border border-orange-400/50 text-orange-400
                   hover:bg-orange-400/30 hover:border-orange-400"
        title="自由沙盒模式"
      >
        沙盒
      </button>
    </div>
  )
}
