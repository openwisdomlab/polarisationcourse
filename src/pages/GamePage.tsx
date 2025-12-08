import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { ArrowLeft, Home } from 'lucide-react'

export function GamePage() {
  const { t } = useTranslation()
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
          {/* Top left - Back button, Info bar with level selector */}
          <div className="absolute top-5 left-5 space-y-3">
            {/* Back and Home buttons */}
            <div className="flex items-center gap-2 mb-3">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/70 border border-cyan-400/30
                          text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">{t('common.home')}</span>
              </Link>
              <Link
                to="/demos"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/70 border border-cyan-400/30
                          text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">{t('common.course')}</span>
              </Link>
            </div>

            <InfoBar />
            <div className="bg-black/70 p-3 rounded-lg border border-cyan-400/30">
              <LevelSelector />
            </div>
          </div>

          {/* Top right - Mode indicators and settings */}
          <div className="absolute top-5 right-5 space-y-2">
            <div className="flex justify-end mb-2">
              <LanguageThemeSwitcher compact />
            </div>
            <VisionModeIndicator />
            <CameraModeIndicator />
            <LevelGoal />
          </div>

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
