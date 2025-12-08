import { useGameStore, CameraMode } from '@/stores/gameStore'

const MODE_NAMES: Record<CameraMode, string> = {
  'first-person': '🎮 第一人称',
  'isometric': '🔷 等轴测',
  'top-down': '📐 俯视图',
}

export function CameraModeIndicator() {
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
      className="absolute top-[70px] right-5 px-4 py-3 rounded-lg text-sm
                 bg-black/70 border border-cyan-400/30 text-gray-300
                 transition-all duration-300 cursor-pointer
                 hover:bg-black/80 hover:border-cyan-400/50"
    >
      {MODE_NAMES[cameraMode]}
    </button>
  )
}
