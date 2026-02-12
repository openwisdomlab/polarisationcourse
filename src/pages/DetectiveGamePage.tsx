/**
 * DetectiveGamePage - 光学侦探模式
 *
 * Module 1: "Optical Detective" (Black Box Mode)
 *
 * Players probe mystery boxes with different polarization states
 * to deduce the hidden optical element inside.
 *
 * Features:
 * - Mystery box components with hidden transformations
 * - Observation logging of input/output states
 * - Deduction panel for submitting hypotheses
 * - Discovery tracking and achievements
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Lightbulb,
  Trophy,
  Eye,
  Search,
  FileText,
  HelpCircle,
  Target,
  Sparkles,
} from 'lucide-react'
// LanguageThemeSwitcher is handled by PersistentHeader
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useIsMobile'
import { PersistentHeader } from '@/components/shared/PersistentHeader'

// Import optical components
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
  MysteryBoxSVG,
  MysteryBoxDefs,
  CircularFilterSVG,
} from '@/components/shared/optical'
import type { OpticalComponent } from '@/components/shared/optical/types'

// Import Jones light tracer
import { useJonesLightTracerLegacy } from '@/hooks/useJonesLightTracer'

// Import detective components
import { DeductionPanel, validateGuess } from '@/components/detective'
import type { MysteryGuess, ObservationLog, MysteryElementType } from '@/components/detective'

// Import detective levels
import { DETECTIVE_LEVELS } from '@/core/game2d/detectiveLevels'

// Import gallery components and resources for real-world investigation
import { PolarizationSystemToggle } from '@/components/gallery'
import { WATER_BOTTLE, GLASSES } from '@/data/resource-gallery'

// Import stores
import {
  useDiscoveryStore,
  checkPolarizationDiscovery,
  checkDetectiveDiscovery,
} from '@/stores/discoveryStore'

// Import discovery notification component
import { DiscoveryNotification } from '@/components/ui/DiscoveryNotification'

// Import physics for observation logging
import { getJonesPolarizationInfo, jonesIntensity } from '@/core/physics'

// Difficulty colors
const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  expert: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export function DetectiveGamePage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const { isMobile, isTablet } = useIsMobile()
  const isZh = i18n.language === 'zh'
  const isCompact = isMobile || isTablet
  const isDark = theme === 'dark'

  // Discovery store
  const discoveryStore = useDiscoveryStore()

  // Level state
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [componentStates, setComponentStates] = useState<Record<string, Partial<OpticalComponent>>>({})
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(true)
  const [showPolarization, setShowPolarization] = useState(true)
  const [showHint, setShowHint] = useState(false)

  // Detective mode state
  const [selectedMysteryId, setSelectedMysteryId] = useState<string | null>(null)
  const [showDeductionPanel, setShowDeductionPanel] = useState(false)
  const [observations, setObservations] = useState<ObservationLog[]>([])
  const [solvedMysteries, setSolvedMysteries] = useState<Set<string>>(new Set())
  const [mysteryAttempts, setMysteryAttempts] = useState<Record<string, number>>({})
  const [usedHints, setUsedHints] = useState(false)
  const [isLevelComplete, setIsLevelComplete] = useState(false)

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)

  // Real-world investigation state
  const [showRealWorldPanel, setShowRealWorldPanel] = useState(false)
  const [selectedRealObject, setSelectedRealObject] = useState<'bottle' | 'glasses'>('bottle')
  const [hasFoundStressPattern, setHasFoundStressPattern] = useState<Record<string, boolean>>({})

  // Handle real-world object mode change (crossed = stress revealed)
  const handleRealWorldModeChange = (mode: 'parallel' | 'crossed') => {
    if (mode === 'crossed') {
      const objectKey = selectedRealObject
      if (!hasFoundStressPattern[objectKey]) {
        setHasFoundStressPattern(prev => ({ ...prev, [objectKey]: true }))
        showToast(isZh ? '发现应力指纹！' : 'Stress fingerprint revealed!', 'success')
      }
    }
  }

  // Current level
  const currentLevel = DETECTIVE_LEVELS[currentLevelIndex]

  // Get mystery boxes in current level
  const mysteryBoxes = useMemo(() => {
    return currentLevel.components.filter((c) => c.type === 'mysteryBox')
  }, [currentLevel])

  // Initialize component states when level changes
  useEffect(() => {
    const initialStates: Record<string, Partial<OpticalComponent>> = {}
    currentLevel.components.forEach((c) => {
      initialStates[c.id] = {
        angle: c.angle,
        polarizationAngle: c.polarizationAngle,
        rotationAmount: c.rotationAmount,
        phaseShift: c.phaseShift,
        filterHandedness: c.filterHandedness,
      }
    })
    setComponentStates(initialStates)
    setSelectedComponent(null)
    setShowHint(false)
    setObservations([])
    setSolvedMysteries(new Set())
    setMysteryAttempts({})
    setUsedHints(false)
    setIsLevelComplete(false)
  }, [currentLevelIndex, currentLevel.components])

  // Light tracing with Jones calculus
  const { beams: lightBeams, sensorStates } = useJonesLightTracerLegacy(
    currentLevel.components,
    componentStates
  )

  // Log observations when light passes through mystery boxes
  useEffect(() => {
    if (mysteryBoxes.length === 0 || lightBeams.length === 0) return

    // For each mystery box, find beams entering and exiting
    mysteryBoxes.forEach((mystery) => {
      // Find beam entering the mystery box
      const enteringBeam = lightBeams.find(
        (beam) =>
          Math.abs(beam.endX - mystery.x) < 5 &&
          Math.abs(beam.endY - mystery.y) < 5
      )

      // Find beam exiting the mystery box
      const exitingBeam = lightBeams.find(
        (beam) =>
          Math.abs(beam.startX - mystery.x) < 5 &&
          Math.abs(beam.startY - mystery.y) < 5
      )

      if (enteringBeam && exitingBeam && enteringBeam.jonesVector && exitingBeam.jonesVector) {
        const inputInfo = getJonesPolarizationInfo(enteringBeam.jonesVector)
        const outputInfo = getJonesPolarizationInfo(exitingBeam.jonesVector)
        const inputIntensity = jonesIntensity(enteringBeam.jonesVector)
        const outputIntensity = jonesIntensity(exitingBeam.jonesVector)

        // Create observation ID based on input state
        const obsId = `${mystery.id}-${inputInfo.angle.toFixed(0)}-${inputInfo.type}`

        // Check if we already have this observation
        const existingObs = observations.find((o) => o.id === obsId)
        if (!existingObs) {
          setObservations((prev) => [
            ...prev,
            {
              id: obsId,
              inputPolarization: inputInfo,
              inputIntensity,
              outputPolarization: outputInfo,
              outputIntensity,
              timestamp: Date.now(),
            },
          ])

          // Check for new discoveries
          const newDiscoveries = checkPolarizationDiscovery(outputInfo, discoveryStore)
          newDiscoveries.forEach((d) => {
            discoveryStore.unlockDiscovery(d, `detective-${currentLevelIndex}`)
            showToast(isZh ? `发现：${d}` : `Discovery: ${d}`, 'success')
          })
        }
      }
    })
  }, [lightBeams, mysteryBoxes, observations, currentLevelIndex, discoveryStore, isZh])

  // Check if level is complete (all mysteries solved)
  useEffect(() => {
    if (mysteryBoxes.length > 0 && solvedMysteries.size === mysteryBoxes.length && !isLevelComplete) {
      setIsLevelComplete(true)
      showToast(isZh ? '关卡完成！' : 'Level Complete!', 'success')

      // Unlock rewards
      if (currentLevel.rewards) {
        currentLevel.rewards.forEach((reward) => {
          discoveryStore.unlockDiscovery(reward, `detective-${currentLevelIndex}`)
        })
      }
    }
  }, [solvedMysteries, mysteryBoxes.length, isLevelComplete, currentLevel.rewards, discoveryStore, currentLevelIndex, isZh])

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Get current state of a component
  const getComponentState = useCallback(
    (component: OpticalComponent) => {
      const state = componentStates[component.id] || {}
      return {
        ...component,
        angle: state.angle ?? component.angle,
        polarizationAngle: state.polarizationAngle ?? component.polarizationAngle,
        rotationAmount: state.rotationAmount ?? component.rotationAmount,
        filterHandedness: state.filterHandedness ?? component.filterHandedness,
      }
    },
    [componentStates]
  )

  // Handle component rotation
  const handleRotate = (
    id: string,
    delta: number,
    property: 'angle' | 'polarizationAngle' | 'rotationAmount' | 'filterHandedness'
  ) => {
    const component = currentLevel.components.find((c) => c.id === id)
    if (!component || component.locked) return

    setComponentStates((prev) => {
      const current = prev[id] || {}
      let newValue: number | 'left' | 'right'

      if (property === 'rotationAmount') {
        newValue = (current.rotationAmount ?? component.rotationAmount ?? 45) === 45 ? 90 : 45
      } else if (property === 'filterHandedness') {
        newValue = (current.filterHandedness ?? component.filterHandedness ?? 'right') === 'right' ? 'left' : 'right'
      } else {
        // Handle numeric angle properties
        const componentValue = property === 'angle' ? component.angle
          : property === 'polarizationAngle' ? component.polarizationAngle
          : 0
        const currentVal = (current[property] as number | undefined) ?? componentValue ?? 0
        newValue = (currentVal + delta + 360) % 360
        if (property === 'polarizationAngle') {
          newValue = newValue % 180
        }
      }

      return {
        ...prev,
        [id]: {
          ...current,
          [property]: newValue,
        },
      }
    })
  }

  // Handle mystery box guess
  const handleSubmitGuess = useCallback(
    (guess: MysteryGuess): boolean => {
      if (!selectedMysteryId) return false

      const mystery = mysteryBoxes.find((m) => m.id === selectedMysteryId)
      if (!mystery) return false

      const hiddenType = (mystery.hiddenElementType ?? 'polarizer') as MysteryElementType
      const hiddenAngle = mystery.hiddenElementAngle ?? 0
      const hiddenRetardation = mystery.hiddenRetardation

      const isCorrect = validateGuess(guess, hiddenType, hiddenAngle, hiddenRetardation)

      // Update attempts
      const attempts = (mysteryAttempts[selectedMysteryId] ?? 0) + 1
      setMysteryAttempts((prev) => ({
        ...prev,
        [selectedMysteryId]: attempts,
      }))

      if (isCorrect) {
        // Mark as solved
        setSolvedMysteries((prev) => new Set([...prev, selectedMysteryId]))
        showToast(isZh ? '正确！神秘元件已揭示' : 'Correct! Mystery element revealed', 'success')

        // Track discovery achievements
        // Map 'expert' to 'hard' for discovery tracking
        const difficulty = currentLevel.difficulty === 'expert' ? 'hard' : currentLevel.difficulty
        const newDiscoveries = checkDetectiveDiscovery(
          true,
          attempts,
          usedHints,
          difficulty,
          discoveryStore
        )
        newDiscoveries.forEach((d) => {
          discoveryStore.unlockDiscovery(d, `detective-${currentLevelIndex}`)
        })
        discoveryStore.incrementMysteriesSolved(attempts === 1)
      } else {
        showToast(isZh ? '再试一次...' : 'Try again...', 'error')
      }

      return isCorrect
    },
    [
      selectedMysteryId,
      mysteryBoxes,
      mysteryAttempts,
      usedHints,
      currentLevel.difficulty,
      discoveryStore,
      currentLevelIndex,
      isZh,
    ]
  )

  // Reset level
  const handleReset = useCallback(() => {
    const initialStates: Record<string, Partial<OpticalComponent>> = {}
    currentLevel.components.forEach((c) => {
      initialStates[c.id] = {
        angle: c.angle,
        polarizationAngle: c.polarizationAngle,
        rotationAmount: c.rotationAmount,
        filterHandedness: c.filterHandedness,
      }
    })
    setComponentStates(initialStates)
    setObservations([])
    setSelectedComponent(null)
  }, [currentLevel.components])

  // Navigation
  const goToPrevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1)
    }
  }

  const goToNextLevel = () => {
    if (currentLevelIndex < DETECTIVE_LEVELS.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'r':
          handleReset()
          break
        case 'h':
          if (currentLevel.hint) {
            setShowHint((prev) => !prev)
            setUsedHints(true)
          }
          break
        case 'escape':
          setSelectedComponent(null)
          setShowDeductionPanel(false)
          break
        case 'n':
        case ']':
          goToNextLevel()
          break
        case 'p':
        case '[':
          goToPrevLevel()
          break
        case 'v':
          setShowPolarization((prev) => !prev)
          break
        case ' ':
          e.preventDefault()
          setIsAnimating((prev) => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentLevelIndex, currentLevel.hint, handleReset])

  // Get selected mystery box for deduction panel
  const selectedMystery = selectedMysteryId
    ? mysteryBoxes.find((m) => m.id === selectedMysteryId)
    : null

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col',
        isDark
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-950'
          : 'bg-gradient-to-b from-slate-50 to-white'
      )}
    >
      {/* Header */}
      <PersistentHeader
        moduleKey="polarquest"
        moduleName={isZh ? '光学侦探' : 'Optical Detective'}
        compact={isCompact}
        showSettings={!isCompact}
        rightContent={
          <div className="flex items-center gap-2">
            {/* Back button */}
            <Link
              to="/games/2d"
              className={cn(
                'p-2 rounded-lg transition-all',
                isDark ? 'hover:bg-slate-700/50 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            {/* Stats */}
            <div
              className={cn(
                'px-2 py-1 rounded text-xs flex items-center gap-1',
                isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
              )}
              title={isZh ? '已破解神秘黑盒' : 'Mysteries Solved'}
            >
              <Search className="w-3 h-3" />
              {discoveryStore.mysteriesSolved}
            </div>
          </div>
        }
      />

      {/* Main Content */}
      <main className={cn('flex-1 flex flex-col lg:flex-row overflow-hidden', isCompact ? 'gap-2 p-2' : 'gap-6 p-4 lg:p-6')}>
        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center">
          {/* Level Info */}
          <div className={cn('text-center', isCompact ? 'mb-2' : 'mb-4')}>
            <div className="flex items-center justify-center gap-4 mb-2">
              <button
                onClick={goToPrevLevel}
                disabled={currentLevelIndex === 0}
                className={cn(
                  'p-2 rounded-full transition-all',
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 disabled:opacity-30'
                    : 'bg-slate-200 hover:bg-slate-300 disabled:opacity-30'
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <Search className="w-5 h-5 text-purple-400" />
                  <h2 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-800')}>
                    {isZh ? currentLevel.nameZh : currentLevel.name}
                  </h2>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border', difficultyColors[currentLevel.difficulty])}>
                    {isZh
                      ? { easy: '简单', medium: '中等', hard: '困难', expert: '专家' }[currentLevel.difficulty]
                      : currentLevel.difficulty}
                  </span>
                </div>
                <span className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
                  {currentLevelIndex + 1} / {DETECTIVE_LEVELS.length}
                </span>
              </div>
              <button
                onClick={goToNextLevel}
                disabled={currentLevelIndex === DETECTIVE_LEVELS.length - 1}
                className={cn(
                  'p-2 rounded-full transition-all',
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 disabled:opacity-30'
                    : 'bg-slate-200 hover:bg-slate-300 disabled:opacity-30'
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <p className={cn('text-sm max-w-md', isDark ? 'text-slate-400' : 'text-slate-600')}>
              {isZh ? currentLevel.descriptionZh : currentLevel.description}
            </p>
          </div>

          {/* Mystery Progress */}
          {mysteryBoxes.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
                {isZh ? '神秘黑盒' : 'Mystery Boxes'}:
              </span>
              <div className="flex gap-1">
                {mysteryBoxes.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      'w-4 h-4 rounded-sm border',
                      solvedMysteries.has(m.id)
                        ? 'bg-green-500 border-green-400'
                        : 'bg-purple-500/30 border-purple-500'
                    )}
                    title={m.id}
                  />
                ))}
              </div>
              <span className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
                ({solvedMysteries.size}/{mysteryBoxes.length})
              </span>
            </div>
          )}

          {/* Game Canvas */}
          <div
            className={cn(
              'relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden shadow-2xl',
              isDark ? 'bg-slate-900/90 border border-purple-500/20' : 'bg-white border border-slate-200'
            )}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: isDark ? '#0a0a1a' : '#f8fafc' }}>
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="0.2" />
                </pattern>
                <LightBeamDefs />
                <MysteryBoxDefs />
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />

              {/* Light beams */}
              {lightBeams.map((beam, i) => (
                <LightBeamSVG
                  key={i}
                  beam={beam}
                  showPolarization={showPolarization}
                  isAnimating={isAnimating}
                  getPolarizationColor={getPolarizationColor}
                />
              ))}

              {/* Render components */}
              {currentLevel.components.map((component) => {
                const state = getComponentState(component)
                const isSelected = selectedComponent === component.id
                const isMystery = component.type === 'mysteryBox'
                const isMysterySelected = selectedMysteryId === component.id
                const isSolved = solvedMysteries.has(component.id)

                return (
                  <g key={component.id}>
                    {component.type === 'emitter' && (
                      <g
                        onClick={() => !component.locked && setSelectedComponent(component.id)}
                        style={{ cursor: component.locked ? 'not-allowed' : 'pointer' }}
                      >
                        {/* Selection ring */}
                        {isSelected && !component.locked && (
                          <circle cx={state.x} cy={state.y} r="6" fill="none" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="2,1">
                            <animate attributeName="stroke-dashoffset" values="0;6" dur="1s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <EmitterSVG
                          x={state.x}
                          y={state.y}
                          polarization={state.polarizationAngle ?? 0}
                          direction={state.direction ?? 'down'}
                          isAnimating={isAnimating}
                          showPolarization={showPolarization}
                          getPolarizationColor={getPolarizationColor}
                        />
                        {/* Rotation buttons */}
                        {isSelected && !component.locked && (
                          <>
                            <g
                              transform={`translate(${state.x - 8}, ${state.y})`}
                              onClick={(e) => { e.stopPropagation(); handleRotate(component.id, -15, 'polarizationAngle') }}
                              style={{ cursor: 'pointer' }}
                            >
                              <circle r="2" fill="#22d3ee" opacity="0.8" />
                              <text textAnchor="middle" y="0.8" fill="white" fontSize="2.5">↺</text>
                            </g>
                            <g
                              transform={`translate(${state.x + 8}, ${state.y})`}
                              onClick={(e) => { e.stopPropagation(); handleRotate(component.id, 15, 'polarizationAngle') }}
                              style={{ cursor: 'pointer' }}
                            >
                              <circle r="2" fill="#22d3ee" opacity="0.8" />
                              <text textAnchor="middle" y="0.8" fill="white" fontSize="2.5">↻</text>
                            </g>
                          </>
                        )}
                      </g>
                    )}

                    {component.type === 'polarizer' && (
                      <PolarizerSVG
                        x={state.x}
                        y={state.y}
                        polarizationAngle={state.polarizationAngle ?? 0}
                        locked={component.locked}
                        selected={isSelected}
                        onClick={() => !component.locked && setSelectedComponent(component.id)}
                        onRotate={(delta) => handleRotate(component.id, delta, 'polarizationAngle')}
                        getPolarizationColor={getPolarizationColor}
                        isDark={isDark}
                      />
                    )}

                    {component.type === 'mirror' && (
                      <MirrorSVG
                        x={state.x}
                        y={state.y}
                        angle={state.angle}
                        locked={component.locked ?? false}
                        selected={isSelected}
                        onClick={() => !component.locked && setSelectedComponent(component.id)}
                        onRotate={(delta: number) => handleRotate(component.id, delta, 'angle')}
                        isDark={isDark}
                      />
                    )}

                    {component.type === 'splitter' && (
                      <SplitterSVG x={state.x} y={state.y} isDark={isDark} />
                    )}

                    {component.type === 'rotator' && (
                      <RotatorSVG
                        x={state.x}
                        y={state.y}
                        rotationAmount={state.rotationAmount ?? 45}
                        locked={component.locked}
                        selected={isSelected}
                        onClick={() => !component.locked && setSelectedComponent(component.id)}
                        onToggle={() => handleRotate(component.id, 0, 'rotationAmount')}
                        isDark={isDark}
                      />
                    )}

                    {component.type === 'sensor' && (
                      <SensorSVG
                        x={state.x}
                        y={state.y}
                        sensorState={sensorStates.find((s) => s.id === component.id)}
                        requiredIntensity={component.requiredIntensity ?? 0}
                        requiredPolarization={component.requiredPolarization}
                        isDark={isDark}
                      />
                    )}

                    {component.type === 'circularFilter' && (
                      <CircularFilterSVG
                        x={state.x}
                        y={state.y}
                        handedness={state.filterHandedness ?? 'right'}
                        locked={component.locked}
                        selected={isSelected}
                        onClick={() => !component.locked && setSelectedComponent(component.id)}
                        onToggle={() => handleRotate(component.id, 0, 'filterHandedness')}
                        isDark={isDark}
                      />
                    )}

                    {isMystery && (
                      <MysteryBoxSVG
                        x={state.x}
                        y={state.y}
                        locked={component.locked}
                        selected={isMysterySelected}
                        onClick={() => {
                          setSelectedMysteryId(component.id)
                          setSelectedComponent(component.id)
                        }}
                        onGuess={() => setShowDeductionPanel(true)}
                        hiddenElementType={component.hiddenElementType}
                        hiddenElementAngle={component.hiddenElementAngle}
                        isSolved={isSolved}
                        isDark={isDark}
                        showHint={showHint}
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Level Complete Overlay */}
            {isLevelComplete && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {isZh ? '关卡完成！' : 'Level Complete!'}
                  </h3>
                  <p className="text-slate-300 mb-4">
                    {isZh ? '所有神秘黑盒已破解' : 'All mysteries solved'}
                  </p>
                  <button
                    onClick={goToNextLevel}
                    disabled={currentLevelIndex >= DETECTIVE_LEVELS.length - 1}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold disabled:opacity-50"
                  >
                    {isZh ? '下一关' : 'Next Level'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className={cn('flex items-center gap-4 mt-4', isCompact && 'flex-wrap justify-center')}>
            <button
              onClick={handleReset}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              )}
            >
              <RotateCcw className="w-4 h-4" />
              {isZh ? '重置' : 'Reset'}
            </button>

            <button
              onClick={() => setShowPolarization(!showPolarization)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                showPolarization
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  : isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              )}
            >
              <Eye className="w-4 h-4" />
              {isZh ? '偏振色' : 'Colors'}
            </button>

            {currentLevel.hint && (
              <button
                onClick={() => {
                  setShowHint(!showHint)
                  setUsedHints(true)
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                  showHint
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                )}
              >
                <Lightbulb className="w-4 h-4" />
                {isZh ? '提示' : 'Hint'}
              </button>
            )}

            {selectedMysteryId && !solvedMysteries.has(selectedMysteryId) && (
              <button
                onClick={() => setShowDeductionPanel(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all"
              >
                <Target className="w-4 h-4" />
                {isZh ? '推断' : 'Deduce'}
              </button>
            )}

            <button
              onClick={() => setShowRealWorldPanel(!showRealWorldPanel)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                showRealWorldPanel
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              )}
              title={isZh ? '真实物证检验' : 'Real Evidence Examination'}
            >
              <Search className="w-4 h-4" />
              {isZh ? '物证' : 'Evidence'}
            </button>
          </div>

          {/* Hint Display */}
          {showHint && currentLevel.hint && (
            <div
              className={cn(
                'mt-4 p-4 rounded-lg max-w-md text-center',
                isDark ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'
              )}
            >
              <p className={cn('text-sm', isDark ? 'text-amber-200' : 'text-amber-700')}>
                <Lightbulb className="w-4 h-4 inline mr-2" />
                {isZh ? currentLevel.hintZh : currentLevel.hint}
              </p>
            </div>
          )}

          {/* Real World Investigation Panel */}
          {showRealWorldPanel && (
            <div
              className={cn(
                'mt-4 p-4 rounded-xl max-w-lg',
                isDark ? 'bg-slate-800/80 border border-emerald-500/30' : 'bg-white border border-emerald-200'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={cn('font-bold flex items-center gap-2', isDark ? 'text-white' : 'text-slate-800')}>
                  <Search className="w-4 h-4 text-emerald-400" />
                  {isZh ? '物证检验台' : 'Evidence Examination'}
                </h3>
                <div className="flex gap-1">
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      hasFoundStressPattern.bottle
                        ? 'bg-green-500/20 text-green-400'
                        : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                    )}
                  >
                    {isZh ? '瓶' : 'Bottle'}: {hasFoundStressPattern.bottle ? '✓' : '?'}
                  </span>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      hasFoundStressPattern.glasses
                        ? 'bg-green-500/20 text-green-400'
                        : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                    )}
                  >
                    {isZh ? '镜' : 'Glasses'}: {hasFoundStressPattern.glasses ? '✓' : '?'}
                  </span>
                </div>
              </div>

              <p className={cn('text-xs mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>
                {isZh
                  ? '💡 提示：切换到正交偏振（暗场）模式，可以看到透明物体上隐藏的应力指纹！'
                  : '💡 Tip: Switch to crossed polarizers (dark field) to reveal hidden stress fingerprints on transparent objects!'}
              </p>

              {/* Object selector */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setSelectedRealObject('bottle')}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedRealObject === 'bottle'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      : isDark
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  🍶 {isZh ? '矿泉水瓶' : 'Water Bottle'}
                </button>
                <button
                  onClick={() => setSelectedRealObject('glasses')}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedRealObject === 'glasses'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      : isDark
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  👓 {isZh ? '眼镜' : 'Glasses'}
                </button>
              </div>

              {/* PolarizationSystemToggle for the selected object */}
              <div className="rounded-lg overflow-hidden">
                <PolarizationSystemToggle
                  resource={selectedRealObject === 'bottle' ? WATER_BOTTLE : GLASSES}
                  showLabel={false}
                  defaultMode="parallel"
                  onModeChange={handleRealWorldModeChange}
                />
              </div>

              {/* Success message when stress pattern is found */}
              {hasFoundStressPattern[selectedRealObject] && (
                <div
                  className={cn(
                    'mt-3 p-2 rounded-lg text-xs text-center',
                    isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-50 text-green-700'
                  )}
                >
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  {isZh
                    ? `已发现 ${selectedRealObject === 'bottle' ? '矿泉水瓶' : '眼镜'} 的应力指纹！注入成型过程中产生的内应力清晰可见。`
                    : `Stress fingerprint found on ${selectedRealObject}! Internal stress from injection molding is now visible.`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Side Panel - Observations */}
        {!isCompact && (
          <div className={cn('w-80 shrink-0', isDark ? 'bg-slate-800/50' : 'bg-slate-100')}>
            <div className="p-4">
              <h3 className={cn('font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-slate-800')}>
                <FileText className="w-4 h-4" />
                {isZh ? '观测记录' : 'Observations'}
              </h3>
              {observations.length === 0 ? (
                <p className={cn('text-sm', isDark ? 'text-slate-500' : 'text-slate-400')}>
                  {isZh
                    ? '调整发射器的偏振角度，观察通过神秘黑盒后的变化'
                    : 'Adjust emitter polarization and observe changes through mystery box'}
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {observations.map((obs, idx) => (
                    <div
                      key={obs.id}
                      className={cn('p-2 rounded-lg text-xs', isDark ? 'bg-slate-700' : 'bg-white')}
                    >
                      <div className="flex justify-between mb-1">
                        <span className={cn('font-medium', isDark ? 'text-purple-300' : 'text-purple-600')}>
                          #{idx + 1}
                        </span>
                        <span className={cn(isDark ? 'text-slate-500' : 'text-slate-400')}>
                          {obs.inputPolarization.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className={cn(isDark ? 'text-slate-500' : 'text-slate-400')}>In: </span>
                          <span className={cn('font-mono', isDark ? 'text-cyan-300' : 'text-cyan-600')}>
                            {obs.inputPolarization.angle.toFixed(0)}°
                          </span>
                          <span className={cn('ml-1', isDark ? 'text-slate-500' : 'text-slate-400')}>
                            ({obs.inputIntensity.toFixed(0)}%)
                          </span>
                        </div>
                        <div>
                          <span className={cn(isDark ? 'text-slate-500' : 'text-slate-400')}>Out: </span>
                          <span className={cn('font-mono', isDark ? 'text-green-300' : 'text-green-600')}>
                            {obs.outputPolarization?.angle.toFixed(0) ?? '—'}°
                          </span>
                          <span className={cn('ml-1', isDark ? 'text-slate-500' : 'text-slate-400')}>
                            ({obs.outputIntensity.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Learning Objectives */}
              <div className="mt-6">
                <h4 className={cn('font-medium mb-2 text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  {isZh ? '学习目标' : 'Learning Goals'}
                </h4>
                <ul className={cn('text-xs space-y-1', isDark ? 'text-slate-500' : 'text-slate-400')}>
                  {(isZh ? currentLevel.learningObjectivesZh : currentLevel.learningObjectives).map(
                    (obj, idx) => (
                      <li key={idx}>• {obj}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Deduction Panel */}
      {selectedMystery && (
        <DeductionPanel
          isOpen={showDeductionPanel}
          onClose={() => setShowDeductionPanel(false)}
          onSubmitGuess={handleSubmitGuess}
          hiddenType={(selectedMystery.hiddenElementType ?? 'polarizer') as MysteryElementType}
          hiddenAngle={selectedMystery.hiddenElementAngle ?? 0}
          hiddenRetardation={selectedMystery.hiddenRetardation}
          observations={observations}
          mysteryBoxId={selectedMystery.id}
          isDark={isDark}
          maxAttempts={currentLevel.maxAttempts}
          attempts={mysteryAttempts[selectedMystery.id] ?? 0}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2',
            toast.type === 'success' && 'bg-green-500 text-white',
            toast.type === 'info' && 'bg-blue-500 text-white',
            toast.type === 'error' && 'bg-red-500 text-white'
          )}
        >
          {toast.type === 'success' && <Trophy className="w-4 h-4" />}
          {toast.type === 'error' && <HelpCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Discovery Achievement Notifications */}
      <DiscoveryNotification
        discoveries={discoveryStore.pendingNotifications}
        onDismiss={(id) => discoveryStore.dismissNotification(id)}
        autoDismissDelay={6000}
        maxVisible={3}
        position="top-right"
      />
    </div>
  )
}

export default DetectiveGamePage
