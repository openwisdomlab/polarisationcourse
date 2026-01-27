/**
 * DeductionPanel - 光学侦探推理面板
 *
 * A dialog component for the Optical Detective mode where players
 * submit their hypothesis about what optical element is hidden
 * inside a mystery box.
 *
 * Features:
 * - Element type selection (Polarizer, HWP, QWP, Rotator)
 * - Angle input with presets
 * - Visual feedback on guess result
 * - Observation log showing probe results
 */

import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Lightbulb, Check, AlertTriangle, HelpCircle, Eye } from 'lucide-react'
import type { PolarizationInfo } from '@/core/physics'

// Types for mystery element options
export type MysteryElementType =
  | 'polarizer'
  | 'halfWavePlate'
  | 'quarterWavePlate'
  | 'rotator'
  | 'opticalRotator'
  | 'retarder'

export interface MysteryGuess {
  elementType: MysteryElementType
  angle: number
  retardation?: number // For general retarder
}

export interface ObservationLog {
  id: string
  inputPolarization: PolarizationInfo
  inputIntensity: number
  outputPolarization: PolarizationInfo | null
  outputIntensity: number
  timestamp: number
}

export interface DeductionPanelProps {
  /** Whether the panel is open */
  isOpen: boolean
  /** Callback to close the panel */
  onClose: () => void
  /** Callback when player submits a guess */
  onSubmitGuess: (guess: MysteryGuess) => boolean // Returns true if correct
  /** The actual hidden element (for validation) */
  hiddenType: MysteryElementType
  /** The actual hidden angle */
  hiddenAngle: number
  /** Hidden retardation (for general retarder) */
  hiddenRetardation?: number
  /** Observation log from probing */
  observations: ObservationLog[]
  /** Mystery box ID being deduced */
  mysteryBoxId: string
  /** Dark mode */
  isDark?: boolean
  /** Number of guess attempts allowed */
  maxAttempts?: number
  /** Current attempt count */
  attempts?: number
}

// Element type options with display names
const ELEMENT_OPTIONS: Array<{
  value: MysteryElementType
  label: string
  labelZh: string
  description: string
  descriptionZh: string
  icon: string
}> = [
  {
    value: 'polarizer',
    label: 'Linear Polarizer',
    labelZh: '线偏振片',
    description: 'Transmits light at specific angle (Malus Law)',
    descriptionZh: '按特定角度透射光（马吕斯定律）',
    icon: '|||',
  },
  {
    value: 'halfWavePlate',
    label: 'Half-Wave Plate (λ/2)',
    labelZh: '半波片 (λ/2)',
    description: 'Flips polarization about fast axis',
    descriptionZh: '绕快轴翻转偏振方向',
    icon: '⟲',
  },
  {
    value: 'quarterWavePlate',
    label: 'Quarter-Wave Plate (λ/4)',
    labelZh: '四分之一波片 (λ/4)',
    description: 'Converts linear ↔ circular polarization',
    descriptionZh: '线偏振↔圆偏振转换',
    icon: '◔',
  },
  {
    value: 'rotator',
    label: 'Optical Rotator',
    labelZh: '旋光器',
    description: 'Rotates polarization plane uniformly',
    descriptionZh: '均匀旋转偏振平面',
    icon: '↻',
  },
  {
    value: 'opticalRotator',
    label: 'Sugar Solution',
    labelZh: '糖溶液',
    description: 'Natural optical activity',
    descriptionZh: '天然旋光性物质',
    icon: '🍬',
  },
]

// Common angle presets
const ANGLE_PRESETS = [0, 15, 22.5, 30, 45, 60, 67.5, 90, 135]

export function DeductionPanel({
  isOpen,
  onClose,
  onSubmitGuess,
  hiddenRetardation,
  observations,
  mysteryBoxId,
  isDark = true,
  maxAttempts = 3,
  attempts = 0,
}: DeductionPanelProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // State for the guess
  const [selectedType, setSelectedType] = useState<MysteryElementType>('polarizer')
  const [selectedAngle, setSelectedAngle] = useState(0)
  const [customAngle, setCustomAngle] = useState('')
  const [useCustomAngle, setUseCustomAngle] = useState(false)
  const [guessResult, setGuessResult] = useState<'correct' | 'incorrect' | null>(null)
  const [showHint, setShowHint] = useState(false)

  // Get the actual angle value
  const actualAngle = useMemo(() => {
    if (useCustomAngle && customAngle !== '') {
      return parseFloat(customAngle)
    }
    return selectedAngle
  }, [useCustomAngle, customAngle, selectedAngle])

  // Handle guess submission
  const handleSubmit = useCallback(() => {
    const guess: MysteryGuess = {
      elementType: selectedType,
      angle: actualAngle,
      retardation: selectedType === 'retarder' ? hiddenRetardation : undefined,
    }

    const isCorrect = onSubmitGuess(guess)
    setGuessResult(isCorrect ? 'correct' : 'incorrect')

    // Auto-close on correct guess after delay
    if (isCorrect) {
      setTimeout(onClose, 1500)
    }
  }, [selectedType, actualAngle, hiddenRetardation, onSubmitGuess, onClose])

  // Generate hint based on observations
  const generateHint = useCallback((): string => {
    if (observations.length === 0) {
      return isZh
        ? '提示：用不同偏振态的光探测黑盒，观察输出变化！'
        : 'Hint: Probe the black box with different polarization states!'
    }

    // Analyze the observations
    const hasIntensityChange = observations.some(
      (o) => Math.abs(o.outputIntensity - o.inputIntensity) > 10
    )
    const hasPolarizationChange = observations.some((o) => {
      if (!o.outputPolarization) return false
      return Math.abs(o.outputPolarization.angle - o.inputPolarization.angle) > 5
    })
    const hasCircularOutput = observations.some(
      (o) => o.outputPolarization?.type === 'circular'
    )

    if (hasCircularOutput) {
      return isZh
        ? '观察到圆偏振光输出，可能是四分之一波片！'
        : 'Circular polarization detected - could be a quarter-wave plate!'
    }

    if (hasIntensityChange && !hasPolarizationChange) {
      return isZh
        ? '强度变化但偏振方向不变，可能是偏振片！'
        : 'Intensity changed but polarization angle preserved - could be a polarizer!'
    }

    if (hasPolarizationChange && !hasIntensityChange) {
      return isZh
        ? '偏振方向改变但强度不变，可能是旋光器或波片！'
        : 'Polarization rotated without intensity loss - could be a rotator or waveplate!'
    }

    return isZh ? '继续探测以收集更多线索！' : 'Keep probing to gather more clues!'
  }, [observations, isZh])

  // Format polarization info for display
  const formatPolarization = (info: PolarizationInfo | null): string => {
    if (!info) return '—'
    if (info.type === 'circular') {
      return isZh
        ? `${info.handedness === 'right' ? '右' : '左'}旋圆偏振`
        : `${info.handedness === 'right' ? 'RCP' : 'LCP'}`
    }
    if (info.type === 'elliptical') {
      return isZh
        ? `椭圆偏振 ${info.angle.toFixed(0)}°`
        : `Elliptical ${info.angle.toFixed(0)}°`
    }
    return `${info.angle.toFixed(0)}°`
  }

  if (!isOpen) return null

  const bgColor = isDark ? 'bg-slate-800' : 'bg-white'
  const textColor = isDark ? 'text-white' : 'text-slate-900'
  const borderColor = isDark ? 'border-slate-600' : 'border-slate-300'
  const mutedColor = isDark ? 'text-slate-400' : 'text-slate-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`${bgColor} ${textColor} rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b ${borderColor}">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isZh ? '光学侦探' : 'Optical Detective'}
              </h2>
              <p className={`text-sm ${mutedColor}`}>
                {isZh ? `神秘黑盒 #${mysteryBoxId}` : `Mystery Box #${mysteryBoxId}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-slate-700/50 transition-colors ${mutedColor}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Observation Log */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {isZh ? '观测记录' : 'Observation Log'}
            </h3>
            <div
              className={`rounded-lg border ${borderColor} overflow-hidden ${
                observations.length === 0 ? 'p-4' : ''
              }`}
            >
              {observations.length === 0 ? (
                <p className={`text-center ${mutedColor} text-sm`}>
                  {isZh
                    ? '还没有观测数据。在游戏中调整发射器观察输出！'
                    : 'No observations yet. Adjust emitters in the game to observe output!'}
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-slate-700' : 'bg-slate-100'}>
                    <tr>
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">
                        {isZh ? '输入' : 'Input'}
                      </th>
                      <th className="px-3 py-2 text-left">
                        {isZh ? '输出' : 'Output'}
                      </th>
                      <th className="px-3 py-2 text-left">
                        {isZh ? '强度' : 'I'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {observations.slice(-5).map((obs, idx) => (
                      <tr
                        key={obs.id}
                        className={idx % 2 === 0 ? '' : isDark ? 'bg-slate-700/30' : 'bg-slate-50'}
                      >
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2 font-mono">
                          {formatPolarization(obs.inputPolarization)}
                        </td>
                        <td className="px-3 py-2 font-mono">
                          {formatPolarization(obs.outputPolarization)}
                        </td>
                        <td className="px-3 py-2">
                          <span className={mutedColor}>{obs.inputIntensity.toFixed(0)}%</span>
                          {' → '}
                          <span
                            className={
                              obs.outputIntensity < obs.inputIntensity * 0.5
                                ? 'text-red-400'
                                : obs.outputIntensity > obs.inputIntensity * 0.9
                                  ? 'text-green-400'
                                  : 'text-yellow-400'
                            }
                          >
                            {obs.outputIntensity.toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Hint Section */}
          <div
            className={`p-3 rounded-lg ${
              isDark ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'
            } border`}
          >
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              <span className="font-medium">{isZh ? '需要提示？' : 'Need a hint?'}</span>
            </button>
            {showHint && (
              <p className={`mt-2 text-sm ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>
                {generateHint()}
              </p>
            )}
          </div>

          {/* Element Type Selection */}
          <div>
            <h3 className="font-semibold mb-2">
              {isZh ? '猜测元件类型' : 'Guess Element Type'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ELEMENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedType(option.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedType === option.value
                      ? 'border-purple-500 bg-purple-500/20'
                      : `${borderColor} hover:border-purple-400/50`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{option.icon}</span>
                    <span className="font-medium text-sm">
                      {isZh ? option.labelZh : option.label}
                    </span>
                  </div>
                  <p className={`text-xs ${mutedColor} mt-1`}>
                    {isZh ? option.descriptionZh : option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Angle Selection */}
          <div>
            <h3 className="font-semibold mb-2">
              {isZh ? '猜测角度' : 'Guess Angle'}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {ANGLE_PRESETS.map((angle) => (
                <button
                  key={angle}
                  onClick={() => {
                    setSelectedAngle(angle)
                    setUseCustomAngle(false)
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-mono transition-all ${
                    !useCustomAngle && selectedAngle === angle
                      ? 'border-purple-500 bg-purple-500/20'
                      : `${borderColor} hover:border-purple-400/50`
                  }`}
                >
                  {angle}°
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="customAngle"
                checked={useCustomAngle}
                onChange={(e) => setUseCustomAngle(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="customAngle" className="text-sm">
                {isZh ? '自定义角度：' : 'Custom angle:'}
              </label>
              <input
                type="number"
                value={customAngle}
                onChange={(e) => setCustomAngle(e.target.value)}
                placeholder="0-180"
                min={0}
                max={180}
                step={0.5}
                className={`w-24 px-2 py-1 rounded border ${borderColor} ${bgColor} text-sm font-mono`}
                disabled={!useCustomAngle}
              />
              <span className="text-sm">°</span>
            </div>
          </div>

          {/* Guess Result Feedback */}
          {guessResult && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                guessResult === 'correct'
                  ? 'bg-green-500/20 border border-green-500'
                  : 'bg-red-500/20 border border-red-500'
              }`}
            >
              {guessResult === 'correct' ? (
                <>
                  <Check className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-bold text-green-500">
                      {isZh ? '正确！' : 'Correct!'}
                    </p>
                    <p className="text-sm text-green-400">
                      {isZh ? '你成功破解了神秘黑盒！' : 'You solved the mystery!'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-bold text-red-500">
                      {isZh ? '不对...' : 'Not quite...'}
                    </p>
                    <p className="text-sm text-red-400">
                      {isZh
                        ? `还剩 ${maxAttempts - attempts - 1} 次机会`
                        : `${maxAttempts - attempts - 1} attempts remaining`}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-between items-center pt-4 border-t ${borderColor}">
            <p className={`text-sm ${mutedColor}`}>
              {isZh
                ? `尝试次数：${attempts}/${maxAttempts}`
                : `Attempts: ${attempts}/${maxAttempts}`}
            </p>
            <button
              onClick={handleSubmit}
              disabled={attempts >= maxAttempts || guessResult === 'correct'}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                attempts >= maxAttempts || guessResult === 'correct'
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {isZh ? '提交猜测' : 'Submit Guess'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Validate a player's guess against the hidden element
 */
export function validateGuess(
  guess: MysteryGuess,
  hiddenType: MysteryElementType,
  hiddenAngle: number,
  hiddenRetardation?: number,
  angleTolerance: number = 5
): boolean {
  // Type must match exactly
  if (guess.elementType !== hiddenType) {
    // Special case: rotator and opticalRotator are functionally equivalent
    if (
      (guess.elementType === 'rotator' && hiddenType === 'opticalRotator') ||
      (guess.elementType === 'opticalRotator' && hiddenType === 'rotator')
    ) {
      // Continue to angle check
    } else {
      return false
    }
  }

  // For polarizers, angle wraps at 180°
  // For waveplates and rotators, angle wraps at 180° (fast axis symmetry)
  const normalizedGuessAngle = ((guess.angle % 180) + 180) % 180
  const normalizedHiddenAngle = ((hiddenAngle % 180) + 180) % 180

  const angleDiff = Math.abs(normalizedGuessAngle - normalizedHiddenAngle)
  const angleMatch = angleDiff <= angleTolerance || 180 - angleDiff <= angleTolerance

  // For general retarders, also check retardation
  if (hiddenType === 'retarder' && hiddenRetardation !== undefined) {
    const retardMatch = Math.abs((guess.retardation ?? 0) - hiddenRetardation) <= 10
    return angleMatch && retardMatch
  }

  return angleMatch
}
