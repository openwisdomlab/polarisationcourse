import { useTranslation } from 'react-i18next'
import { useGameStore } from '@/stores/gameStore'
import { cn } from '@/lib/utils'

export function VisionModeIndicator() {
  const { t } = useTranslation()
  const { visionMode, toggleVisionMode } = useGameStore()

  const isPolarized = visionMode === 'polarized'

  return (
    <button
      onClick={toggleVisionMode}
      aria-label={t('game.toggleVisionMode')}
      aria-pressed={isPolarized}
      className={cn(
        "px-4 py-3 rounded-lg text-sm transition-all duration-300",
        "border cursor-pointer backdrop-blur-md shadow-sm",
        isPolarized
          ? "bg-red-950/80 border-red-500/50 text-red-200 shadow-red-900/20"
          : "bg-void/70 border-laser/30 text-muted-foreground hover:bg-void/80 hover:border-laser/50 hover:text-laser"
      )}
    >
      {isPolarized ? `🔴 ${t('game.polarizedVision')}` : `👁 ${t('game.normalVision')}`}
    </button>
  )
}
