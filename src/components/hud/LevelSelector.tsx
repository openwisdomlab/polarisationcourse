import { useTranslation } from 'react-i18next'
import { useGameStore } from '@/stores/gameStore'
import { TUTORIAL_LEVELS } from '@/core/World'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LevelSelectorProps {
  compact?: boolean
}

export function LevelSelector({ compact = false }: LevelSelectorProps) {
  const { t } = useTranslation()
  const { currentLevelIndex, loadLevel } = useGameStore()

  // Compact mode for mobile - shows current level with prev/next buttons
  if (compact) {
    const canGoPrev = currentLevelIndex > 0
    const canGoNext = currentLevelIndex < TUTORIAL_LEVELS.length - 1

    return (
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => canGoPrev && loadLevel(currentLevelIndex - 1)}
          disabled={!canGoPrev}
          className={cn(
            "w-8 h-8 rounded",
            canGoPrev ? "text-laser hover:text-laser-active hover:bg-laser-dim" : "text-muted-foreground"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-xs text-laser min-w-[80px] text-center font-medium">
          {t('game.level')} {currentLevelIndex + 1}/{TUTORIAL_LEVELS.length}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => canGoNext && loadLevel(currentLevelIndex + 1)}
          disabled={!canGoNext}
          className={cn(
            "w-8 h-8 rounded",
            canGoNext ? "text-laser hover:text-laser-active hover:bg-laser-dim" : "text-muted-foreground"
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  // Desktop mode - original layout
  return (
    <div className="flex gap-1.5">
      {TUTORIAL_LEVELS.map((_, index) => (
        <Button
          key={index}
          onClick={() => loadLevel(index)}
          variant={currentLevelIndex === index ? "game" : "outline"}
          className={cn(
            "w-8 h-8 rounded-lg text-xs font-medium p-0",
            currentLevelIndex !== index && "bg-void/50 border-white/10 text-muted-foreground hover:border-laser/50 hover:text-white"
          )}
          title={t(`game.tutorials.${index}.name`)}
        >
          {index + 1}
        </Button>
      ))}
      <Button
        onClick={() => {
          const { world } = useGameStore.getState()
          if (world) {
            world.clear()
          }
        }}
        variant="outline"
        className="px-3 h-8 rounded-lg text-xs font-medium bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500 hover:text-orange-300"
        title={t('game.sandboxMode')}
      >
        {t('game.sandbox')}
      </Button>
    </div>
  )
}
