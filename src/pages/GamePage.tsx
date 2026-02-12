import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
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
  ControlHints,
} from '@/components/hud'
import { PersistentHeader, MiniLogo } from '@/components/shared/PersistentHeader'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Home, Menu, X, Info, BookOpen } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'

export function GamePage() {
  const { t } = useTranslation()
  const { initWorld, loadLevel, world } = useGameStore()
  const { isMobile, isTablet } = useIsMobile()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileInfo, setShowMobileInfo] = useState(false)

  const isCompact = isMobile || isTablet

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
    <div className="relative w-full h-dvh min-h-screen overflow-hidden bg-[#0a0a15]">
      {/* 3D Canvas */}
      <GameCanvas />

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Mobile Header - Compact Navigation */}
          {isCompact ? (
            <>
              {/* Mobile top bar with Logo */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                {/* Left: Logo + Menu */}
                <div className="flex items-center gap-1">
                  <MiniLogo size={28} className="p-1 bg-black/70 rounded-lg border border-cyan-400/30" />
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 rounded-lg bg-black/70 border border-cyan-400/30 text-cyan-400"
                  >
                    {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>

                {/* Center - Level info */}
                <div className="flex-1 mx-2">
                  <div className="bg-black/70 px-3 py-1.5 rounded-lg border border-cyan-400/30 text-center">
                    <LevelSelector compact />
                  </div>
                </div>

                {/* Right side buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowMobileInfo(!showMobileInfo)}
                    className={cn(
                      "p-2 rounded-lg border transition-all",
                      showMobileInfo
                        ? "bg-cyan-400/20 border-cyan-400/50 text-cyan-400"
                        : "bg-black/70 border-cyan-400/30 text-cyan-400"
                    )}
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  <LanguageThemeSwitcher compact />
                </div>
              </div>

              {/* Mobile menu dropdown */}
              {showMobileMenu && (
                <div className="absolute top-14 left-2 bg-black/90 rounded-lg border border-cyan-400/30 p-3 space-y-2 z-50">
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-cyan-400 hover:bg-cyan-400/20 transition-all"
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm">{t('common.home')}</span>
                  </Link>
                  <Link
                    to="/demos"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-cyan-400 hover:bg-cyan-400/20 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">{t('common.course')}</span>
                  </Link>
                  <div className="border-t border-cyan-400/20 pt-2 mt-2">
                    <VisionModeIndicator />
                    <CameraModeIndicator />
                  </div>
                </div>
              )}

              {/* Mobile info panel */}
              {showMobileInfo && (
                <div className="absolute top-14 right-2 max-w-[280px] z-50">
                  <InfoBar />
                  <div className="mt-2">
                    <LevelGoal />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Desktop Layout with Persistent Header */}
              {/* Persistent Header with Logo */}
              <PersistentHeader
                moduleKey="polarquest"
                moduleName={t('modules.polarquest.title')}
                variant="transparent"
                showSettings={false}
                className="absolute top-0 left-0 right-0"
                rightContent={
                  <Link
                    to="/demos"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-cyan-400/30
                              text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all text-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{t('common.course')}</span>
                  </Link>
                }
              />

              {/* Left side - Info bar with level selector */}
              <div className="absolute top-14 left-5 space-y-3">
                <InfoBar />
                <div className="bg-black/70 p-3 rounded-lg border border-cyan-400/30">
                  <LevelSelector />
                </div>
              </div>

              {/* Top right - Mode indicators and settings */}
              <div className="absolute top-14 right-5 space-y-2">
                <VisionModeIndicator />
                <CameraModeIndicator />
                <LevelGoal />
              </div>
            </>
          )}

          {/* Center */}
          <Crosshair />

          {/* Bottom center - Block selector and hints */}
          <TutorialHint />
          <ControlHints />
          <BlockSelector />
        </div>
      </div>

      {/* Help Panel (Dialog) */}
      <HelpPanel />
    </div>
  )
}

export default GamePage
