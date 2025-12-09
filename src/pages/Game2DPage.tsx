/**
 * Game2D Page - CSS-based 2D polarization puzzle game
 * Simple interactive game demonstrating Malus's Law and optical principles
 */
import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, BookOpen, ChevronLeft, ChevronRight, RotateCcw, Lightbulb, Trophy, Info, Play, Pause } from 'lucide-react'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

// Level definitions for 2D puzzles
interface Level2D {
  id: number
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  polarizers: PolarizerConfig[]
  targetIntensity: number
  emitterAngle: number
  sensorAngle: number
}

interface PolarizerConfig {
  id: string
  initialAngle: number
  locked: boolean
  y: number // vertical position percentage
}

const LEVELS: Level2D[] = [
  {
    id: 0,
    name: 'First Light',
    nameZh: '初见光芒',
    description: 'Rotate the polarizer to let light through',
    descriptionZh: '旋转偏振片让光通过',
    polarizers: [{ id: 'p1', initialAngle: 90, locked: false, y: 50 }],
    targetIntensity: 80,
    emitterAngle: 0,
    sensorAngle: 0,
  },
  {
    id: 1,
    name: 'Crossed Polarizers',
    nameZh: '正交偏振',
    description: 'Two perpendicular polarizers block all light',
    descriptionZh: '两个垂直的偏振片会阻挡所有光',
    polarizers: [
      { id: 'p1', initialAngle: 0, locked: true, y: 35 },
      { id: 'p2', initialAngle: 90, locked: false, y: 65 },
    ],
    targetIntensity: 50,
    emitterAngle: 0,
    sensorAngle: 0,
  },
  {
    id: 2,
    name: '45 Degree Magic',
    nameZh: '45度魔法',
    description: 'Add a polarizer between crossed polarizers',
    descriptionZh: '在正交偏振片之间添加偏振片',
    polarizers: [
      { id: 'p1', initialAngle: 0, locked: true, y: 25 },
      { id: 'p2', initialAngle: 45, locked: false, y: 50 },
      { id: 'p3', initialAngle: 90, locked: true, y: 75 },
    ],
    targetIntensity: 20,
    emitterAngle: 0,
    sensorAngle: 0,
  },
  {
    id: 3,
    name: 'Triple Filter',
    nameZh: '三重过滤',
    description: 'Fine-tune three polarizers to reach target intensity',
    descriptionZh: '精调三个偏振片达到目标强度',
    polarizers: [
      { id: 'p1', initialAngle: 30, locked: false, y: 25 },
      { id: 'p2', initialAngle: 60, locked: false, y: 50 },
      { id: 'p3', initialAngle: 90, locked: false, y: 75 },
    ],
    targetIntensity: 60,
    emitterAngle: 0,
    sensorAngle: 0,
  },
  {
    id: 4,
    name: 'Precision Control',
    nameZh: '精准控制',
    description: 'Achieve exactly 25% transmission',
    descriptionZh: '精确达到25%透射率',
    polarizers: [
      { id: 'p1', initialAngle: 0, locked: true, y: 30 },
      { id: 'p2', initialAngle: 45, locked: false, y: 60 },
    ],
    targetIntensity: 25,
    emitterAngle: 0,
    sensorAngle: 0,
  },
]

export function Game2DPage() {
  const { t, i18n } = useTranslation()
  void t // t is available for future use if needed
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [polarizerAngles, setPolarizerAngles] = useState<Record<string, number>>({})
  const [selectedPolarizer, setSelectedPolarizer] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [showFormula, setShowFormula] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)

  const currentLevel = LEVELS[currentLevelIndex]

  // Initialize polarizer angles when level changes
  useEffect(() => {
    const initialAngles: Record<string, number> = {}
    currentLevel.polarizers.forEach((p) => {
      initialAngles[p.id] = p.initialAngle
    })
    setPolarizerAngles(initialAngles)
    setIsComplete(false)
    setSelectedPolarizer(null)
  }, [currentLevelIndex])

  // Calculate light intensity through polarizers using Malus's Law
  const calculateIntensity = useCallback(() => {
    let intensity = 100
    let prevAngle = currentLevel.emitterAngle

    // Apply Malus's Law for each polarizer
    for (const polarizer of currentLevel.polarizers) {
      const angle = polarizerAngles[polarizer.id] ?? polarizer.initialAngle
      const angleDiff = Math.abs(angle - prevAngle) % 180
      const radians = (angleDiff * Math.PI) / 180
      intensity *= Math.cos(radians) ** 2
      prevAngle = angle
    }

    return Math.round(intensity)
  }, [polarizerAngles, currentLevel])

  const intensity = calculateIntensity()

  // Check win condition
  useEffect(() => {
    const targetMet = Math.abs(intensity - currentLevel.targetIntensity) <= 5
    if (targetMet && !isComplete) {
      setIsComplete(true)
    }
  }, [intensity, currentLevel.targetIntensity, isComplete])

  const handlePolarizerRotate = (id: string, delta: number) => {
    const polarizer = currentLevel.polarizers.find((p) => p.id === id)
    if (polarizer?.locked) return

    setPolarizerAngles((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) + delta + 180) % 180,
    }))
    setIsComplete(false)
  }

  const handleReset = () => {
    const initialAngles: Record<string, number> = {}
    currentLevel.polarizers.forEach((p) => {
      initialAngles[p.id] = p.initialAngle
    })
    setPolarizerAngles(initialAngles)
    setIsComplete(false)
  }

  const goToNextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1)
    }
  }

  const goToPrevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1)
    }
  }

  const isDark = theme === 'dark'

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col',
        isDark
          ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
          : 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100'
      )}
    >
      {/* Header */}
      <header
        className={cn(
          'flex items-center justify-between p-4 border-b',
          isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200 bg-white/80'
        )}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={cn(
              'p-2 rounded-lg transition-colors',
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
            )}
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            to="/demos"
            className={cn(
              'p-2 rounded-lg transition-colors',
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
            )}
          >
            <BookOpen className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-slate-500/30 mx-2" />
          <h1 className={cn('text-xl font-bold', isDark ? 'text-cyan-400' : 'text-cyan-600')}>
            PolarCraft 2D
          </h1>
        </div>
        <LanguageThemeSwitcher />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Level Info */}
          <div className="text-center mb-6">
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
              <h2 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-800')}>
                {isZh
                  ? `第 ${currentLevelIndex + 1} 关: ${currentLevel.nameZh}`
                  : `Level ${currentLevelIndex + 1}: ${currentLevel.name}`}
              </h2>
              <button
                onClick={goToNextLevel}
                disabled={currentLevelIndex === LEVELS.length - 1}
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
            <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
              {isZh ? currentLevel.descriptionZh : currentLevel.description}
            </p>
          </div>

          {/* Game Container */}
          <div
            className={cn(
              'relative w-80 h-[500px] rounded-2xl overflow-hidden shadow-2xl',
              isDark ? 'bg-slate-900/80 border border-cyan-500/20' : 'bg-white border border-slate-200'
            )}
          >
            {/* Light Source */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br from-yellow-300 to-orange-400',
                  'shadow-[0_0_30px_rgba(255,200,0,0.6)]',
                  isAnimating && 'animate-pulse'
                )}
              >
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <span className={cn('text-xs mt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
                {isZh ? '光源' : 'Light'} (0°)
              </span>
            </div>

            {/* Light Beam Segments */}
            <LightBeam
              intensity={100}
              top={60}
              height={currentLevel.polarizers[0]?.y ? `${currentLevel.polarizers[0].y - 12}%` : '20%'}
              isAnimating={isAnimating}
              isDark={isDark}
            />

            {/* Polarizers and beam segments between them */}
            {currentLevel.polarizers.map((polarizer, index) => {
              const angle = polarizerAngles[polarizer.id] ?? polarizer.initialAngle
              // prevAngle is calculated but not directly used here as intensity calculation is done in the loop below
              const _prevAngle =
                index === 0
                  ? currentLevel.emitterAngle
                  : polarizerAngles[currentLevel.polarizers[index - 1].id] ??
                    currentLevel.polarizers[index - 1].initialAngle
              void _prevAngle // suppress unused variable warning

              // Calculate intensity up to this point
              let intensityAtPoint = 100
              for (let i = 0; i <= index; i++) {
                const pAngle = polarizerAngles[currentLevel.polarizers[i].id] ?? currentLevel.polarizers[i].initialAngle
                const pPrevAngle =
                  i === 0
                    ? currentLevel.emitterAngle
                    : polarizerAngles[currentLevel.polarizers[i - 1].id] ??
                      currentLevel.polarizers[i - 1].initialAngle
                const angleDiff = Math.abs(pAngle - pPrevAngle) % 180
                intensityAtPoint *= Math.cos((angleDiff * Math.PI) / 180) ** 2
              }

              const nextY =
                index < currentLevel.polarizers.length - 1 ? currentLevel.polarizers[index + 1].y : 88

              return (
                <div key={polarizer.id}>
                  {/* Beam after this polarizer */}
                  <LightBeam
                    intensity={intensityAtPoint}
                    top={`${polarizer.y + 8}%`}
                    height={`${nextY - polarizer.y - 8}%`}
                    isAnimating={isAnimating}
                    isDark={isDark}
                  />

                  {/* Polarizer */}
                  <Polarizer2D
                    angle={angle}
                    y={polarizer.y}
                    locked={polarizer.locked}
                    selected={selectedPolarizer === polarizer.id}
                    onClick={() => !polarizer.locked && setSelectedPolarizer(polarizer.id)}
                    onRotate={(delta) => handlePolarizerRotate(polarizer.id, delta)}
                    isDark={isDark}
                    isZh={isZh}
                  />
                </div>
              )
            })}

            {/* Sensor */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
              <div
                className={cn(
                  'w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300',
                  isComplete
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-[0_0_30px_rgba(0,255,100,0.6)]'
                    : intensity >= currentLevel.targetIntensity - 5
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-[0_0_20px_rgba(255,200,0,0.4)]'
                      : isDark
                        ? 'bg-slate-700 border border-slate-600'
                        : 'bg-slate-200 border border-slate-300'
                )}
              >
                {isComplete ? <Trophy className="w-7 h-7 text-white" /> : <span className="text-2xl">🎯</span>}
              </div>
              <span className={cn('text-xs mt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
                {isZh ? '目标' : 'Target'}: ≥{currentLevel.targetIntensity}%
              </span>
            </div>

            {/* Intensity Display */}
            <div
              className={cn(
                'absolute top-4 right-4 px-3 py-2 rounded-lg text-sm font-mono',
                isDark ? 'bg-slate-800/80 text-cyan-400' : 'bg-slate-100 text-cyan-600'
              )}
            >
              I = {intensity}%
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleReset}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              )}
            >
              <RotateCcw className="w-4 h-4" />
              {isZh ? '重置' : 'Reset'}
            </button>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              )}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAnimating ? (isZh ? '暂停' : 'Pause') : isZh ? '播放' : 'Play'}
            </button>
            {isComplete && currentLevelIndex < LEVELS.length - 1 && (
              <button
                onClick={goToNextLevel}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                {isZh ? '下一关' : 'Next Level'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Win Message */}
          {isComplete && (
            <div
              className={cn(
                'mt-4 px-6 py-3 rounded-xl text-center animate-bounce-in',
                'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
              )}
            >
              <span className="text-green-400 font-bold text-lg">
                {isZh ? '🎉 关卡完成！' : '🎉 Level Complete!'}
              </span>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div
          className={cn(
            'w-full lg:w-96 rounded-2xl p-6',
            isDark ? 'bg-slate-900/60 border border-slate-700/50' : 'bg-white/80 border border-slate-200'
          )}
        >
          {/* Formula Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowFormula(!showFormula)}
              className={cn(
                'flex items-center gap-2 w-full text-left font-bold mb-3',
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              )}
            >
              <Info className="w-5 h-5" />
              {isZh ? '马吕斯定律' : "Malus's Law"}
            </button>
            {showFormula && (
              <div className={cn('p-4 rounded-lg', isDark ? 'bg-slate-800/50' : 'bg-slate-100')}>
                <div className="text-center mb-4">
                  <span className={cn('text-2xl font-mono', isDark ? 'text-cyan-300' : 'text-cyan-600')}>
                    I = I₀ × cos²θ
                  </span>
                </div>
                <ul className={cn('text-sm space-y-2', isDark ? 'text-slate-400' : 'text-slate-600')}>
                  <li>
                    <strong>I₀</strong>: {isZh ? '入射光强度' : 'Incident intensity'}
                  </li>
                  <li>
                    <strong>I</strong>: {isZh ? '透射光强度' : 'Transmitted intensity'}
                  </li>
                  <li>
                    <strong>θ</strong>: {isZh ? '偏振方向与透光轴夹角' : 'Angle between polarization and axis'}
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Current Calculation */}
          <div className="mb-6">
            <h3 className={cn('font-bold mb-3', isDark ? 'text-white' : 'text-slate-800')}>
              {isZh ? '当前计算' : 'Current Calculation'}
            </h3>
            <div className={cn('p-4 rounded-lg space-y-2', isDark ? 'bg-slate-800/50' : 'bg-slate-100')}>
              {currentLevel.polarizers.map((p, i) => {
                const angle = polarizerAngles[p.id] ?? p.initialAngle
                const prevAngle =
                  i === 0
                    ? currentLevel.emitterAngle
                    : polarizerAngles[currentLevel.polarizers[i - 1].id] ??
                      currentLevel.polarizers[i - 1].initialAngle
                const diff = Math.abs(angle - prevAngle) % 180
                const transmission = Math.cos((diff * Math.PI) / 180) ** 2

                return (
                  <div
                    key={p.id}
                    className={cn(
                      'flex justify-between items-center text-sm',
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    )}
                  >
                    <span>
                      P{i + 1}: {angle}°
                      {p.locked && <span className="text-xs text-slate-500 ml-1">({isZh ? '锁定' : 'locked'})</span>}
                    </span>
                    <span className={cn('font-mono', isDark ? 'text-cyan-400' : 'text-cyan-600')}>
                      ×{transmission.toFixed(2)}
                    </span>
                  </div>
                )
              })}
              <div className={cn('border-t pt-2 mt-2', isDark ? 'border-slate-700' : 'border-slate-300')}>
                <div className="flex justify-between items-center font-bold">
                  <span className={isDark ? 'text-white' : 'text-slate-800'}>
                    {isZh ? '最终强度' : 'Final Intensity'}
                  </span>
                  <span
                    className={cn(
                      'text-lg',
                      intensity >= currentLevel.targetIntensity - 5 ? 'text-green-400' : 'text-orange-400'
                    )}
                  >
                    {intensity}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className={cn('font-bold mb-3', isDark ? 'text-white' : 'text-slate-800')}>
              {isZh ? '操作说明' : 'Instructions'}
            </h3>
            <ul className={cn('text-sm space-y-2', isDark ? 'text-slate-400' : 'text-slate-600')}>
              <li>• {isZh ? '点击偏振片选中它' : 'Click a polarizer to select it'}</li>
              <li>• {isZh ? '使用 ← → 键或点击按钮旋转' : 'Use ← → keys or buttons to rotate'}</li>
              <li>
                • {isZh ? '锁定的偏振片（带🔒）无法旋转' : 'Locked polarizers (with 🔒) cannot be rotated'}
              </li>
              <li>• {isZh ? `达到 ≥${currentLevel.targetIntensity}% 强度过关` : `Reach ≥${currentLevel.targetIntensity}% intensity to win`}</li>
            </ul>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <h3 className={cn('font-bold mb-3', isDark ? 'text-white' : 'text-slate-800')}>
              {isZh ? '关卡进度' : 'Level Progress'}
            </h3>
            <div className="flex gap-2 flex-wrap">
              {LEVELS.map((level, i) => (
                <button
                  key={level.id}
                  onClick={() => setCurrentLevelIndex(i)}
                  className={cn(
                    'w-10 h-10 rounded-lg font-bold transition-all',
                    currentLevelIndex === i
                      ? 'bg-cyan-500 text-white shadow-lg scale-110'
                      : isDark
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Light Beam Component
interface LightBeamProps {
  intensity: number
  top: number | string
  height: string
  isAnimating: boolean
  isDark: boolean
}

function LightBeam({ intensity, top, height, isAnimating, isDark: _isDark }: LightBeamProps) {
  void _isDark // suppress unused variable warning - reserved for future theme-specific styling
  const opacity = Math.max(0.1, intensity / 100)
  const width = Math.max(4, (intensity / 100) * 20)

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 transition-all duration-300"
      style={{
        top: typeof top === 'number' ? `${top}px` : top,
        height,
        width: `${width}px`,
        background: `linear-gradient(to bottom,
          rgba(255, 255, 150, ${opacity * 0.9}),
          rgba(255, 200, 100, ${opacity * 0.7}))`,
        boxShadow: intensity > 10 ? `0 0 ${intensity / 5}px rgba(255, 220, 100, ${opacity * 0.8})` : 'none',
        opacity: opacity,
      }}
    >
      {isAnimating && intensity > 5 && (
        <div
          className="absolute inset-0 animate-beam-flow"
          style={{
            background: `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.3) 10px,
              rgba(255, 255, 255, 0.3) 15px
            )`,
          }}
        />
      )}
    </div>
  )
}

// Polarizer Component
interface Polarizer2DProps {
  angle: number
  y: number
  locked: boolean
  selected: boolean
  onClick: () => void
  onRotate: (delta: number) => void
  isDark: boolean
  isZh: boolean
}

function Polarizer2D({ angle, y, locked, selected, onClick, onRotate, isDark, isZh }: Polarizer2DProps) {
  // Handle keyboard rotation when selected
  useEffect(() => {
    if (!selected) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onRotate(-5)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onRotate(5)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selected, onRotate])

  // Color based on angle
  const hue = (angle / 180) * 360

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-20"
      style={{ top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      {/* Rotation buttons */}
      {selected && !locked && (
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          <button
            onClick={() => onRotate(-15)}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all',
              isDark ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-white'
            )}
          >
            -
          </button>
        </div>
      )}

      {/* Polarizer body */}
      <button
        onClick={onClick}
        disabled={locked}
        className={cn(
          'relative w-24 h-16 rounded-xl transition-all duration-200',
          'flex flex-col items-center justify-center',
          selected && !locked && 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-transparent',
          locked
            ? isDark
              ? 'bg-slate-700/80 cursor-not-allowed'
              : 'bg-slate-300 cursor-not-allowed'
            : isDark
              ? 'bg-slate-800/80 hover:bg-slate-700/80 cursor-pointer'
              : 'bg-white hover:bg-slate-50 cursor-pointer shadow-md'
        )}
        style={{
          borderColor: locked ? (isDark ? '#475569' : '#94a3b8') : `hsl(${hue}, 70%, 50%)`,
          borderWidth: '3px',
          borderStyle: 'solid',
        }}
      >
        {/* Grid lines representing polarization axis */}
        <div
          className="absolute inset-2 overflow-hidden rounded"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-0.5"
              style={{
                left: `${(i + 1) * 12.5}%`,
                background: locked
                  ? isDark
                    ? 'rgba(100, 116, 139, 0.5)'
                    : 'rgba(148, 163, 184, 0.5)'
                  : `hsla(${hue}, 70%, 50%, 0.6)`,
              }}
            />
          ))}
        </div>

        {/* Lock icon */}
        {locked && (
          <span className="absolute -top-2 -right-2 text-sm">🔒</span>
        )}

        {/* Angle display */}
        <span
          className={cn(
            'relative z-10 font-mono font-bold text-sm',
            isDark ? 'text-white' : 'text-slate-800'
          )}
        >
          {angle}°
        </span>
      </button>

      {/* Rotation buttons (right side) */}
      {selected && !locked && (
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          <button
            onClick={() => onRotate(15)}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all',
              isDark ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-white'
            )}
          >
            +
          </button>
        </div>
      )}

      {/* Label */}
      <span
        className={cn(
          'absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap',
          isDark ? 'text-slate-500' : 'text-slate-400'
        )}
      >
        {locked ? (isZh ? '偏振片(锁定)' : 'Polarizer (locked)') : isZh ? '偏振片' : 'Polarizer'}
      </span>
    </div>
  )
}
