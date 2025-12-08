import { useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { GameCanvas } from '@/components/game'
import {
  BlockSelector,
  InfoBar,
  VisionModeIndicator,
  CameraModeIndicator,
  LevelGoal,
  TutorialHint,
  HelpPanel,
  LevelSelector,
  Crosshair,
} from '@/components/hud'

export function GamePage() {
  const { initWorld, loadLevel, world } = useGameStore()

  // Initialize world on mount
  useEffect(() => {
    if (!world) {
      initWorld(32)
    }
  }, [initWorld, world])

  // Load first level after world is ready
  useEffect(() => {
    if (world) {
      loadLevel(0)
    }
  }, [world, loadLevel])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a15]">
      {/* 3D Canvas */}
      <GameCanvas />

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Top left - Info bar with level selector */}
          <div className="absolute top-5 left-5 space-y-3">
            <InfoBar />
            <div className="bg-black/70 p-3 rounded-lg border border-cyan-400/30">
              <LevelSelector />
            </div>
          </div>

          {/* Top right - Mode indicators */}
          <VisionModeIndicator />
          <CameraModeIndicator />
          <LevelGoal />

          {/* Center */}
          <Crosshair />

          {/* Bottom center - Block selector and hints */}
          <TutorialHint />
          <BlockSelector />
        </div>
      </div>

      {/* Help Panel (Dialog) */}
      <HelpPanel />
    </div>
  )
}
