/**
 * Escape Room Page - Polarization Lab Escape Game
 * 密室逃脱页面 - 偏振实验室逃脱游戏
 *
 * A narrative-driven escape room experience using polarized light physics.
 * Players solve 5 increasingly difficult puzzles to escape Dr. Photon's lab.
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useIsMobile } from '@/hooks/useIsMobile'
import {
  DoorOpen,
  Lock,
  Unlock,
  Key,
  Lightbulb,
  Eye,
  EyeOff,
  RotateCcw,
  Trophy,
  BookOpen,
  HelpCircle,
  X,
  Play,
  Pause,
  ArrowLeft,
  Sparkles,
  RotateCw,
  CheckCircle2,
} from 'lucide-react'

// Import shared optical components
import { getPolarizationColor } from '@/lib/polarization'
import {
  EmitterSVG,
  PolarizerSVG,
  MirrorSVG,
  SplitterSVG,
  RotatorSVG,
  SensorSVG,
  LightBeamSVG,
  LightBeamDefs,
} from '@/components/shared/optical'
import type { OpticalComponent } from '@/components/shared/optical/types'

// Import light tracer
import { useLightTracer } from '@/hooks/useLightTracer'

// Import escape room levels
import {
  ESCAPE_ROOM_LEVELS,
  ROOM_THEMES,
  DIFFICULTY_COLORS,
  type EscapeRoomLevel,
} from '@/core/game2d/escapeRoomLevels'

// Game state
interface GameProgress {
  completedRooms: number[]
  currentRoom: number
  hintsUsed: Record<string, number>
  startTime?: number
  endTime?: number
}

const INITIAL_PROGRESS: GameProgress = {
  completedRooms: [],
  currentRoom: 1,
  hintsUsed: {},
}

// Load/save progress from localStorage
function loadProgress(): GameProgress {
  try {
    const saved = localStorage.getItem('escapeRoom_progress')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // ignore
  }
  return INITIAL_PROGRESS
}

function saveProgress(progress: GameProgress) {
  try {
    localStorage.setItem('escapeRoom_progress', JSON.stringify(progress))
  } catch {
    // ignore
  }
}

// Story Dialog Component
function StoryDialog({
  isOpen,
  onClose,
  title,
  content,
  buttonText,
  icon: Icon,
  theme,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  buttonText: string
  icon: typeof DoorOpen
  theme: 'dark' | 'light'
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          'max-w-lg w-full rounded-2xl p-6 shadow-2xl border animate-in fade-in zoom-in duration-300',
          theme === 'dark'
            ? 'bg-slate-900 border-purple-500/30'
            : 'bg-white border-purple-200'
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
            )}
          >
            <Icon
              className={cn(
                'w-6 h-6',
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              )}
            />
          </div>
          <h2
            className={cn(
              'text-xl font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
          >
            {title}
          </h2>
        </div>
        <p
          className={cn(
            'text-base leading-relaxed mb-6',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          {content}
        </p>
        <button
          onClick={onClose}
          className={cn(
            'w-full py-3 px-4 rounded-xl font-semibold transition-all',
            'bg-gradient-to-r from-purple-500 to-violet-600 text-white',
            'hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5'
          )}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

// Victory Overlay Component
function VictoryOverlay({
  isOpen,
  level,
  isZh,
  onNextRoom,
  onReplay,
  isLastRoom,
  theme,
}: {
  isOpen: boolean
  level: EscapeRoomLevel
  isZh: boolean
  onNextRoom: () => void
  onReplay: () => void
  isLastRoom: boolean
  theme: 'dark' | 'light'
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div
        className={cn(
          'max-w-lg w-full rounded-2xl p-8 shadow-2xl border text-center animate-in fade-in zoom-in duration-500',
          theme === 'dark'
            ? 'bg-slate-900 border-emerald-500/30'
            : 'bg-white border-emerald-200'
        )}
      >
        {/* Trophy icon with animation */}
        <div className="relative mb-6">
          <div
            className={cn(
              'w-24 h-24 mx-auto rounded-full flex items-center justify-center',
              'bg-gradient-to-br from-amber-400 to-orange-500',
              'shadow-lg shadow-amber-500/30 animate-bounce'
            )}
          >
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <Sparkles className="absolute top-0 right-1/4 w-6 h-6 text-amber-400 animate-pulse" />
          <Sparkles className="absolute bottom-0 left-1/4 w-5 h-5 text-amber-400 animate-pulse delay-100" />
        </div>

        <h2
          className={cn(
            'text-2xl font-bold mb-2',
            theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
          )}
        >
          {isLastRoom
            ? isZh
              ? '恭喜逃脱！'
              : 'Congratulations! You Escaped!'
            : isZh
            ? '房间已解锁！'
            : 'Room Unlocked!'}
        </h2>

        <p
          className={cn(
            'text-base leading-relaxed mb-6',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          {isZh ? level.storyCompleteZh : level.storyComplete}
        </p>

        {/* Physics concept learned */}
        <div
          className={cn(
            'mb-6 p-4 rounded-xl',
            theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
          )}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen
              className={cn(
                'w-5 h-5',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )}
            />
            <span
              className={cn(
                'font-semibold',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )}
            >
              {isZh ? '掌握概念' : 'Concept Mastered'}
            </span>
          </div>
          <p
            className={cn(
              'font-medium',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
          >
            {isZh ? level.conceptZh : level.concept}
          </p>
          {level.formula && (
            <code
              className={cn(
                'block mt-2 text-sm',
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              )}
            >
              {level.formula}
            </code>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReplay}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl font-semibold transition-all',
              theme === 'dark'
                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {isZh ? '重玩' : 'Replay'}
          </button>
          {!isLastRoom && (
            <button
              onClick={onNextRoom}
              className={cn(
                'flex-1 py-3 px-4 rounded-xl font-semibold transition-all',
                'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
                'hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5'
              )}
            >
              {isZh ? '下一房间' : 'Next Room'}
            </button>
          )}
          {isLastRoom && (
            <Link
              to="/games"
              className={cn(
                'flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-center',
                'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
                'hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5'
              )}
            >
              {isZh ? '返回游戏中心' : 'Back to Games'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// Hint Panel Component
function HintPanel({
  hints,
  currentHintIndex,
  onShowNextHint,
  isZh,
  theme,
}: {
  hints: string[]
  currentHintIndex: number
  onShowNextHint: () => void
  isZh: boolean
  theme: 'dark' | 'light'
}) {
  const visibleHints = hints.slice(0, currentHintIndex + 1)
  const hasMoreHints = currentHintIndex < hints.length - 1

  return (
    <div
      className={cn(
        'rounded-xl p-4 border',
        theme === 'dark'
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-amber-50 border-amber-200'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb
          className={cn(
            'w-5 h-5',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          )}
        />
        <span
          className={cn(
            'font-semibold',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          )}
        >
          {isZh ? '提示' : 'Hints'} ({currentHintIndex + 1}/{hints.length})
        </span>
      </div>
      <div className="space-y-2">
        {visibleHints.map((hint, index) => (
          <p
            key={index}
            className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            )}
          >
            {index + 1}. {hint}
          </p>
        ))}
      </div>
      {hasMoreHints && (
        <button
          onClick={onShowNextHint}
          className={cn(
            'mt-3 text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'text-amber-400 hover:text-amber-300'
              : 'text-amber-600 hover:text-amber-500'
          )}
        >
          {isZh ? '显示下一个提示' : 'Show next hint'}
        </button>
      )}
    </div>
  )
}

// Room Progress Indicator
function RoomProgress({
  totalRooms,
  currentRoom,
  completedRooms,
  onSelectRoom,
  isZh,
  theme,
}: {
  totalRooms: number
  currentRoom: number
  completedRooms: number[]
  onSelectRoom: (room: number) => void
  isZh: boolean
  theme: 'dark' | 'light'
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalRooms }, (_, i) => i + 1).map((room) => {
        const isCompleted = completedRooms.includes(room)
        const isCurrent = room === currentRoom
        const isLocked = room > 1 && !completedRooms.includes(room - 1)

        return (
          <button
            key={room}
            onClick={() => !isLocked && onSelectRoom(room)}
            disabled={isLocked}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-all',
              'border-2 font-semibold text-sm',
              isCompleted
                ? 'bg-emerald-500 border-emerald-400 text-white'
                : isCurrent
                ? theme === 'dark'
                  ? 'bg-purple-500 border-purple-400 text-white'
                  : 'bg-purple-600 border-purple-500 text-white'
                : isLocked
                ? theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed'
                  : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-gray-300 hover:border-purple-500'
                : 'bg-white border-gray-300 text-gray-700 hover:border-purple-500',
              !isLocked && 'cursor-pointer hover:scale-110'
            )}
            title={
              isLocked
                ? isZh
                  ? `完成房间 ${room - 1} 以解锁`
                  : `Complete Room ${room - 1} to unlock`
                : isZh
                ? `房间 ${room}`
                : `Room ${room}`
            }
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              room
            )}
          </button>
        )
      })}
    </div>
  )
}

// Main Escape Room Component
export function EscapeRoomPage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const isDark = theme === 'dark'
  const { isMobile, isTablet } = useIsMobile()
  const isCompact = isMobile || isTablet

  // Game state
  const [progress, setProgress] = useState<GameProgress>(loadProgress)
  const [componentStates, setComponentStates] = useState<
    Record<string, Partial<OpticalComponent>>
  >({})
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  )
  const [isComplete, setIsComplete] = useState(false)
  const [showPolarization, setShowPolarization] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)
  const [currentHintIndex, setCurrentHintIndex] = useState(-1)
  const [showHints, setShowHints] = useState(false)
  const [showIntroDialog, setShowIntroDialog] = useState(true)
  const [showVictory, setShowVictory] = useState(false)

  // Get current level
  const currentLevel = useMemo(
    () =>
      ESCAPE_ROOM_LEVELS.find((l) => l.roomNumber === progress.currentRoom) ||
      ESCAPE_ROOM_LEVELS[0],
    [progress.currentRoom]
  )

  const isLastRoom = progress.currentRoom === ESCAPE_ROOM_LEVELS.length
  const roomTheme = ROOM_THEMES[currentLevel.roomTheme]
  const difficultyStyle = DIFFICULTY_COLORS[currentLevel.difficulty]

  // Initialize component states when level changes
  useEffect(() => {
    const initialStates: Record<string, Partial<OpticalComponent>> = {}
    currentLevel.components.forEach((c) => {
      initialStates[c.id] = {
        angle: c.angle,
        polarizationAngle: c.polarizationAngle,
        rotationAmount: c.rotationAmount,
      }
    })
    setComponentStates(initialStates)
    setIsComplete(false)
    setSelectedComponent(null)
    setCurrentHintIndex(-1)
    setShowHints(false)
    setShowVictory(false)
    setShowIntroDialog(true)
  }, [progress.currentRoom, currentLevel.components])

  // Calculate light paths
  const { beams: lightBeams, sensorStates } = useLightTracer(
    currentLevel.components,
    componentStates
  )

  // Check win condition
  useEffect(() => {
    const allSensorsActivated =
      sensorStates.length > 0 && sensorStates.every((s) => s.activated)
    if (allSensorsActivated && !isComplete) {
      setIsComplete(true)
      // Mark room as completed
      if (!progress.completedRooms.includes(progress.currentRoom)) {
        const newProgress = {
          ...progress,
          completedRooms: [...progress.completedRooms, progress.currentRoom],
        }
        setProgress(newProgress)
        saveProgress(newProgress)
      }
      // Show victory dialog after a short delay
      setTimeout(() => setShowVictory(true), 500)
    }
  }, [sensorStates, isComplete, progress])

  // Get current state of a component
  const getComponentState = useCallback(
    (component: OpticalComponent) => {
      const state = componentStates[component.id] || {}
      return {
        ...component,
        angle: state.angle ?? component.angle,
        polarizationAngle: state.polarizationAngle ?? component.polarizationAngle,
        rotationAmount: state.rotationAmount ?? component.rotationAmount,
      }
    },
    [componentStates]
  )

  // Handle component rotation
  const handleRotate = (
    id: string,
    delta: number,
    property: 'angle' | 'polarizationAngle' | 'rotationAmount'
  ) => {
    const component = currentLevel.components.find((c) => c.id === id)
    if (!component || component.locked) return

    setComponentStates((prev) => {
      const current = prev[id] || {}

      if (property === 'rotationAmount') {
        // Toggle between 45 and 90 for rotators
        const currentValue = current.rotationAmount ?? component.rotationAmount ?? 45
        return {
          ...prev,
          [id]: { ...current, rotationAmount: currentValue === 45 ? 90 : 45 },
        }
      }

      if (property === 'angle') {
        // For mirrors: toggle between 45 and 135
        const currentAngle = current.angle ?? component.angle ?? 45
        return {
          ...prev,
          [id]: { ...current, angle: currentAngle === 45 ? 135 : 45 },
        }
      }

      // For polarizers: rotate by delta
      const currentAngle =
        current.polarizationAngle ?? component.polarizationAngle ?? 0
      let newAngle = currentAngle + delta
      // Normalize to 0-180
      while (newAngle < 0) newAngle += 180
      while (newAngle >= 180) newAngle -= 180
      return {
        ...prev,
        [id]: { ...current, polarizationAngle: newAngle },
      }
    })
  }

  // Handle component click
  const handleComponentClick = (id: string) => {
    const component = currentLevel.components.find((c) => c.id === id)
    if (!component || component.locked) return
    setSelectedComponent(selectedComponent === id ? null : id)
  }

  // Reset level
  const handleReset = () => {
    const initialStates: Record<string, Partial<OpticalComponent>> = {}
    currentLevel.components.forEach((c) => {
      initialStates[c.id] = {
        angle: c.angle,
        polarizationAngle: c.polarizationAngle,
        rotationAmount: c.rotationAmount,
      }
    })
    setComponentStates(initialStates)
    setIsComplete(false)
    setSelectedComponent(null)
    setShowVictory(false)
  }

  // Go to next room
  const handleNextRoom = () => {
    if (progress.currentRoom < ESCAPE_ROOM_LEVELS.length) {
      const newProgress = {
        ...progress,
        currentRoom: progress.currentRoom + 1,
      }
      setProgress(newProgress)
      saveProgress(newProgress)
    }
  }

  // Select specific room
  const handleSelectRoom = (room: number) => {
    const newProgress = {
      ...progress,
      currentRoom: room,
    }
    setProgress(newProgress)
    saveProgress(newProgress)
  }

  // Show next hint
  const handleShowNextHint = () => {
    const hints = isZh ? currentLevel.hintsZh : currentLevel.hints
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1)
      // Track hints used
      const newProgress = {
        ...progress,
        hintsUsed: {
          ...progress.hintsUsed,
          [currentLevel.id]: (progress.hintsUsed[currentLevel.id] || 0) + 1,
        },
      }
      setProgress(newProgress)
      saveProgress(newProgress)
    }
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntroDialog || showVictory) return

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
          if (selectedComponent) {
            const comp = currentLevel.components.find(
              (c) => c.id === selectedComponent
            )
            if (comp?.type === 'polarizer') {
              handleRotate(selectedComponent, -15, 'polarizationAngle')
            } else if (comp?.type === 'mirror') {
              handleRotate(selectedComponent, 0, 'angle')
            }
          }
          break
        case 'arrowright':
          if (selectedComponent) {
            const comp = currentLevel.components.find(
              (c) => c.id === selectedComponent
            )
            if (comp?.type === 'polarizer') {
              handleRotate(selectedComponent, 15, 'polarizationAngle')
            } else if (comp?.type === 'mirror') {
              handleRotate(selectedComponent, 0, 'angle')
            }
          }
          break
        case 'r':
          if (selectedComponent) {
            const comp = currentLevel.components.find(
              (c) => c.id === selectedComponent
            )
            if (comp?.type === 'rotator') {
              handleRotate(selectedComponent, 0, 'rotationAmount')
            }
          } else if (e.ctrlKey || e.metaKey) {
            // Ctrl+R: Reset level
            e.preventDefault()
            handleReset()
          }
          break
        case 'h':
          setShowHints(!showHints)
          if (!showHints && currentHintIndex < 0) {
            setCurrentHintIndex(0)
          }
          break
        case 'v':
          setShowPolarization(!showPolarization)
          break
        case ' ':
          e.preventDefault()
          setIsAnimating(!isAnimating)
          break
        case 'escape':
          setSelectedComponent(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedComponent,
    showHints,
    showPolarization,
    isAnimating,
    currentHintIndex,
    showIntroDialog,
    showVictory,
    currentLevel.components,
  ])

  // Calculate canvas dimensions
  const canvasHeight = isCompact ? 350 : 500

  return (
    <div
      className={cn(
        'min-h-screen',
        isDark
          ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
          : 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc]'
      )}
    >
      {/* Header */}
      <header
        className={cn(
          'sticky top-0 z-40 border-b backdrop-blur-md',
          isDark
            ? 'bg-slate-900/80 border-slate-700'
            : 'bg-white/80 border-gray-200'
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left: Back link */}
            <Link
              to="/games"
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isZh ? '返回' : 'Back'}
              </span>
            </Link>

            {/* Center: Room progress */}
            <RoomProgress
              totalRooms={ESCAPE_ROOM_LEVELS.length}
              currentRoom={progress.currentRoom}
              completedRooms={progress.completedRooms}
              onSelectRoom={handleSelectRoom}
              isZh={isZh}
              theme={theme}
            />

            {/* Right: Settings */}
            <LanguageThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className={cn('flex gap-6', isCompact ? 'flex-col' : 'flex-row')}>
          {/* Left panel: Room info */}
          <div className={cn('space-y-4', isCompact ? 'w-full' : 'w-80')}>
            {/* Room title and difficulty */}
            <div
              className={cn(
                'rounded-xl p-4 border',
                isDark
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-white border-gray-200'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h1
                  className={cn(
                    'text-xl font-bold',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {isZh ? currentLevel.nameZh : currentLevel.name}
                </h1>
                <span
                  className={cn(
                    'px-2 py-1 rounded-md text-xs font-semibold border',
                    difficultyStyle.bg,
                    difficultyStyle.text,
                    difficultyStyle.border
                  )}
                >
                  {currentLevel.difficulty.toUpperCase()}
                </span>
              </div>
              <p
                className={cn(
                  'text-sm',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                {isZh ? currentLevel.descriptionZh : currentLevel.description}
              </p>
            </div>

            {/* Objective */}
            <div
              className={cn(
                'rounded-xl p-4 border',
                isDark
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-white border-gray-200'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Key
                  className={cn(
                    'w-5 h-5',
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  )}
                />
                <span
                  className={cn(
                    'font-semibold',
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  )}
                >
                  {isZh ? '目标' : 'Objective'}
                </span>
              </div>
              <p
                className={cn(
                  'text-sm',
                  isDark ? 'text-gray-300' : 'text-gray-600'
                )}
              >
                {isZh ? currentLevel.objectiveZh : currentLevel.objective}
              </p>

              {/* Sensor status */}
              <div className="mt-3 space-y-2">
                {sensorStates.map((sensor) => (
                  <div
                    key={sensor.id}
                    className={cn(
                      'flex items-center justify-between p-2 rounded-lg text-sm',
                      sensor.activated
                        ? isDark
                          ? 'bg-emerald-500/20'
                          : 'bg-emerald-50'
                        : isDark
                        ? 'bg-slate-700/50'
                        : 'bg-gray-100'
                    )}
                  >
                    <span
                      className={cn(
                        sensor.activated
                          ? isDark
                            ? 'text-emerald-400'
                            : 'text-emerald-600'
                          : isDark
                          ? 'text-gray-400'
                          : 'text-gray-500'
                      )}
                    >
                      {sensor.activated ? (
                        <Unlock className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </span>
                    <span
                      className={cn(
                        'font-mono text-xs',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      )}
                    >
                      {Math.round(sensor.receivedIntensity)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints section */}
            {showHints && currentHintIndex >= 0 && (
              <HintPanel
                hints={isZh ? currentLevel.hintsZh : currentLevel.hints}
                currentHintIndex={currentHintIndex}
                onShowNextHint={handleShowNextHint}
                isZh={isZh}
                theme={theme}
              />
            )}

            {/* Controls info (desktop) */}
            {!isCompact && (
              <div
                className={cn(
                  'rounded-xl p-4 border text-sm',
                  isDark
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-white border-gray-200'
                )}
              >
                <h3
                  className={cn(
                    'font-semibold mb-2',
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  {isZh ? '操作说明' : 'Controls'}
                </h3>
                <div
                  className={cn(
                    'space-y-1 text-xs',
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  )}
                >
                  <p>
                    <kbd className="px-1 rounded bg-slate-700 text-gray-300 font-mono">
                      Click
                    </kbd>{' '}
                    {isZh ? '选择组件' : 'Select component'}
                  </p>
                  <p>
                    <kbd className="px-1 rounded bg-slate-700 text-gray-300 font-mono">
                      ←/→
                    </kbd>{' '}
                    {isZh ? '旋转偏振片' : 'Rotate polarizer'}
                  </p>
                  <p>
                    <kbd className="px-1 rounded bg-slate-700 text-gray-300 font-mono">
                      R
                    </kbd>{' '}
                    {isZh ? '切换旋光器' : 'Toggle rotator'}
                  </p>
                  <p>
                    <kbd className="px-1 rounded bg-slate-700 text-gray-300 font-mono">
                      H
                    </kbd>{' '}
                    {isZh ? '显示/隐藏提示' : 'Show/hide hints'}
                  </p>
                  <p>
                    <kbd className="px-1 rounded bg-slate-700 text-gray-300 font-mono">
                      V
                    </kbd>{' '}
                    {isZh ? '偏振颜色' : 'Polarization colors'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Game canvas */}
          <div className="flex-1">
            {/* Toolbar */}
            <div
              className={cn(
                'flex items-center justify-between mb-4 p-3 rounded-xl border',
                isDark
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-white border-gray-200'
              )}
            >
              <div className="flex items-center gap-2">
                {/* Reset button */}
                <button
                  onClick={handleReset}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isDark
                      ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  )}
                  title={isZh ? '重置' : 'Reset'}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {/* Hint button */}
                <button
                  onClick={() => {
                    setShowHints(!showHints)
                    if (!showHints && currentHintIndex < 0) {
                      setCurrentHintIndex(0)
                    }
                  }}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    showHints
                      ? isDark
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-amber-100 text-amber-600'
                      : isDark
                      ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  )}
                  title={isZh ? '提示' : 'Hints'}
                >
                  <HelpCircle className="w-5 h-5" />
                </button>

                {/* Polarization toggle */}
                <button
                  onClick={() => setShowPolarization(!showPolarization)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    showPolarization
                      ? isDark
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-cyan-100 text-cyan-600'
                      : isDark
                      ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  )}
                  title={isZh ? '偏振颜色' : 'Polarization colors'}
                >
                  {showPolarization ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>

                {/* Animation toggle */}
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isDark
                      ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  )}
                  title={isZh ? '暂停/播放' : 'Pause/Play'}
                >
                  {isAnimating ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Selected component controls */}
              {selectedComponent && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const comp = currentLevel.components.find(
                      (c) => c.id === selectedComponent
                    )
                    if (!comp) return null
                    const state = getComponentState(comp)

                    if (comp.type === 'polarizer') {
                      return (
                        <>
                          <button
                            onClick={() =>
                              handleRotate(
                                selectedComponent,
                                -15,
                                'polarizationAngle'
                              )
                            }
                            className={cn(
                              'p-2 rounded-lg',
                              isDark
                                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                            )}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <span
                            className={cn(
                              'font-mono text-sm min-w-[3rem] text-center',
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            )}
                          >
                            {state.polarizationAngle}°
                          </span>
                          <button
                            onClick={() =>
                              handleRotate(
                                selectedComponent,
                                15,
                                'polarizationAngle'
                              )
                            }
                            className={cn(
                              'p-2 rounded-lg',
                              isDark
                                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                            )}
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                        </>
                      )
                    }

                    if (comp.type === 'mirror') {
                      return (
                        <button
                          onClick={() =>
                            handleRotate(selectedComponent, 0, 'angle')
                          }
                          className={cn(
                            'px-3 py-2 rounded-lg font-medium text-sm',
                            isDark
                              ? 'bg-slate-700 hover:bg-slate-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                          )}
                        >
                          {state.angle}° →{' '}
                          {state.angle === 45 ? '135°' : '45°'}
                        </button>
                      )
                    }

                    if (comp.type === 'rotator') {
                      return (
                        <button
                          onClick={() =>
                            handleRotate(selectedComponent, 0, 'rotationAmount')
                          }
                          className={cn(
                            'px-3 py-2 rounded-lg font-medium text-sm',
                            isDark
                              ? 'bg-slate-700 hover:bg-slate-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                          )}
                        >
                          {state.rotationAmount}° →{' '}
                          {state.rotationAmount === 45 ? '90°' : '45°'}
                        </button>
                      )
                    }

                    return null
                  })()}

                  <button
                    onClick={() => setSelectedComponent(null)}
                    className={cn(
                      'p-2 rounded-lg ml-2',
                      isDark
                        ? 'hover:bg-slate-700 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-600'
                    )}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Game canvas */}
            <div
              className={cn(
                'rounded-2xl border overflow-hidden',
                isDark ? 'border-slate-700' : 'border-gray-200'
              )}
              style={{
                background: isDark
                  ? `linear-gradient(135deg, ${roomTheme.background}dd, ${roomTheme.background})`
                  : '#f8fafc',
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full"
                style={{
                  maxHeight: canvasHeight,
                  aspectRatio: '1 / 1',
                }}
              >
                {/* Defs for light beam gradients */}
                <LightBeamDefs />

                {/* Grid lines */}
                <defs>
                  <pattern
                    id="escapeGrid"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke={isDark ? '#334155' : '#e2e8f0'}
                      strokeWidth="0.2"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#escapeGrid)" />

                {/* Light beams */}
                {lightBeams.map((beam, index) => (
                  <LightBeamSVG
                    key={`beam-${index}`}
                    beam={beam}
                    showPolarization={showPolarization}
                    isAnimating={isAnimating}
                    getPolarizationColor={getPolarizationColor}
                  />
                ))}

                {/* Optical components */}
                {currentLevel.components.map((comp) => {
                  const state = getComponentState(comp)
                  const isSelected = selectedComponent === comp.id

                  return (
                    <g key={comp.id}>
                      {comp.type === 'emitter' && (
                        <EmitterSVG
                          x={comp.x}
                          y={comp.y}
                          polarization={state.polarizationAngle ?? 0}
                          direction={comp.direction ?? 'right'}
                          isAnimating={isAnimating}
                          showPolarization={showPolarization}
                          getPolarizationColor={getPolarizationColor}
                        />
                      )}

                      {comp.type === 'polarizer' && (
                        <PolarizerSVG
                          x={comp.x}
                          y={comp.y}
                          polarizationAngle={state.polarizationAngle ?? 0}
                          locked={comp.locked}
                          selected={isSelected}
                          onClick={() => handleComponentClick(comp.id)}
                          onRotate={(delta) => handleRotate(comp.id, delta, 'polarizationAngle')}
                          getPolarizationColor={getPolarizationColor}
                          isDark={isDark}
                        />
                      )}

                      {comp.type === 'mirror' && (
                        <MirrorSVG
                          x={comp.x}
                          y={comp.y}
                          angle={state.angle ?? 45}
                          locked={comp.locked}
                          selected={isSelected}
                          onClick={() => handleComponentClick(comp.id)}
                          onRotate={(delta) => handleRotate(comp.id, delta, 'angle')}
                          isDark={isDark}
                        />
                      )}

                      {comp.type === 'splitter' && (
                        <SplitterSVG
                          x={comp.x}
                          y={comp.y}
                          isDark={isDark}
                        />
                      )}

                      {comp.type === 'rotator' && (
                        <RotatorSVG
                          x={comp.x}
                          y={comp.y}
                          rotationAmount={state.rotationAmount ?? 45}
                          locked={comp.locked}
                          selected={isSelected}
                          onClick={() => handleComponentClick(comp.id)}
                          onToggle={() => handleRotate(comp.id, 0, 'rotationAmount')}
                          isDark={isDark}
                        />
                      )}

                      {comp.type === 'sensor' && (
                        <SensorSVG
                          x={comp.x}
                          y={comp.y}
                          sensorState={sensorStates.find((s) => s.id === comp.id)}
                          requiredIntensity={comp.requiredIntensity ?? 50}
                          requiredPolarization={comp.requiredPolarization}
                          isDark={isDark}
                          isAnimating={isAnimating}
                          getPolarizationColor={getPolarizationColor}
                        />
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Physics formula display */}
            {currentLevel.formula && (
              <div
                className={cn(
                  'mt-4 p-3 rounded-xl border text-center',
                  isDark
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-white border-gray-200'
                )}
              >
                <span
                  className={cn(
                    'text-xs font-medium',
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  )}
                >
                  {isZh ? currentLevel.conceptZh : currentLevel.concept}:
                </span>
                <code
                  className={cn(
                    'ml-2 text-sm font-mono',
                    isDark ? 'text-cyan-400' : 'text-cyan-600'
                  )}
                >
                  {currentLevel.formula}
                </code>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Story intro dialog */}
      <StoryDialog
        isOpen={showIntroDialog}
        onClose={() => setShowIntroDialog(false)}
        title={`${isZh ? '房间' : 'Room'} ${currentLevel.roomNumber}: ${
          isZh ? currentLevel.nameZh : currentLevel.name
        }`}
        content={isZh ? currentLevel.storyIntroZh : currentLevel.storyIntro}
        buttonText={isZh ? '开始解谜' : 'Start Puzzle'}
        icon={DoorOpen}
        theme={theme}
      />

      {/* Victory overlay */}
      <VictoryOverlay
        isOpen={showVictory}
        level={currentLevel}
        isZh={isZh}
        onNextRoom={handleNextRoom}
        onReplay={handleReset}
        isLastRoom={isLastRoom}
        theme={theme}
      />
    </div>
  )
}
