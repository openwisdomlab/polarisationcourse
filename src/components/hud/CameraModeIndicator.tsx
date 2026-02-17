import { useTranslation } from 'react-i18next'
import { useGameStore, CameraMode } from '@/stores/gameStore'
import { Camera, Gamepad2, Grid3X3 } from 'lucide-react'

const MODE_ICONS: Record<CameraMode, React.ReactNode> = {
  'first-person': <Gamepad2 className="w-4 h-4" />,
  'isometric': <Camera className="w-4 h-4" />,
  'top-down': <Grid3X3 className="w-4 h-4" />,
}

const MODE_KEYS: Record<CameraMode, string> = {
  'first-person': 'game.firstPerson',
  'isometric': 'game.isometric',
  'top-down': 'game.topDown',
}

export function CameraModeIndicator() {
  const { t } = useTranslation()
  const { cameraMode, setCameraMode } = useGameStore()

  const cycleMode = () => {
    const modes: CameraMode[] = ['first-person', 'isometric', 'top-down']
    const currentIndex = modes.indexOf(cameraMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setCameraMode(nextMode)
  }

  return (
    <button
      onClick={cycleMode}
      aria-label={`${t('game.cameraMode')}: ${t(MODE_KEYS[cameraMode])}. ${t('game.pressCToChange')}`}
      title="Press C to cycle camera modes"
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm
                 bg-void/70 border border-laser/30 text-muted-foreground
                 transition-all duration-300 cursor-pointer
                 hover:bg-void/80 hover:border-laser/50 hover:text-laser
                 group backdrop-blur-md shadow-sm"
    >
      <span className="text-laser group-hover:scale-110 transition-transform">
        {MODE_ICONS[cameraMode]}
      </span>
      <span className="font-medium">{t(MODE_KEYS[cameraMode])}</span>
      <span className="text-micro text-muted-foreground/50 ml-1 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
        [C]
      </span>
    </button>
  )
}
