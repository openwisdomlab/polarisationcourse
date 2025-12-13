/**
 * Challenge Panel Component - 挑战面板组件
 *
 * Panel showing current challenge status:
 * - Challenge goal and description
 * - Progress indicator
 * - Hints (expandable)
 * - Success/failure feedback
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/shared'
import {
  Target, X, Lightbulb, ChevronDown, ChevronUp,
  CheckCircle2, RefreshCcw, Eye
} from 'lucide-react'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'
import { DIFFICULTY_CONFIG } from '@/data'

export function ChallengePanel() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [showHints, setShowHints] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)

  const {
    currentChallenge,
    challengeCompleted,
    clearChallenge,
    loadChallenge,
    isSimulating,
    setSimulating,
    sensorReadings,
  } = useOpticalBenchStore()

  if (!currentChallenge) return null

  const difficulty = DIFFICULTY_CONFIG[currentChallenge.difficulty]
  const hints = isZh ? currentChallenge.hints.zh : currentChallenge.hints.en

  // Get current sensor reading for target sensor
  const targetReading = sensorReadings.get(currentChallenge.successCondition.targetSensorId)
  const { successCondition } = currentChallenge

  // Calculate progress
  const getProgress = () => {
    if (!targetReading) return { value: 0, label: '0%' }

    if (successCondition.type === 'intensity' || successCondition.type === 'both') {
      const target = successCondition.minIntensity ?? successCondition.maxIntensity ?? 50
      const progress = Math.min(100, (targetReading.intensity / target) * 100)
      return { value: progress, label: `${targetReading.intensity.toFixed(1)}%` }
    }

    if (successCondition.type === 'polarization') {
      const target = successCondition.targetPolarization ?? 0
      const diff = Math.abs(targetReading.polarization - target)
      const progress = Math.max(0, (1 - diff / 90) * 100)
      return { value: progress, label: `${targetReading.polarization.toFixed(0)}°` }
    }

    return { value: 0, label: '---' }
  }

  const progress = getProgress()

  const handleRetry = () => {
    loadChallenge(currentChallenge)
  }

  const handleNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1)
    }
  }

  return (
    <div className={cn(
      'absolute top-4 right-4 w-80 rounded-xl border shadow-xl z-20',
      challengeCompleted
        ? theme === 'dark'
          ? 'bg-emerald-900/95 border-emerald-500'
          : 'bg-emerald-50/95 border-emerald-400'
        : theme === 'dark'
          ? 'bg-slate-900/95 border-amber-500/50'
          : 'bg-white/95 border-amber-400/50'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between p-3 border-b',
        challengeCompleted
          ? theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-200'
          : theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          {challengeCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Target className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
          )}
          <div>
            <h3 className={cn('font-bold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? currentChallenge.nameZh : currentChallenge.nameEn}
            </h3>
            <Badge color={difficulty.color} size="sm">
              {isZh ? difficulty.labelZh : difficulty.labelEn}
            </Badge>
          </div>
        </div>
        <button
          onClick={clearChallenge}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Description */}
        <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          {isZh ? currentChallenge.descriptionZh : currentChallenge.descriptionEn}
        </p>

        {/* Goal */}
        <div className={cn(
          'p-2 rounded-lg',
          challengeCompleted
            ? theme === 'dark' ? 'bg-emerald-800/50' : 'bg-emerald-100'
            : theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
        )}>
          <p className={cn(
            'text-xs font-medium',
            challengeCompleted
              ? 'text-emerald-400'
              : theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
          )}>
            {isZh ? '目标：' : 'Goal: '}
            {isZh ? currentChallenge.goal.zh : currentChallenge.goal.en}
          </p>
        </div>

        {/* Progress */}
        {isSimulating && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '当前读数' : 'Current Reading'}
              </span>
              <span className={cn(
                'text-sm font-mono font-bold',
                challengeCompleted
                  ? 'text-emerald-400'
                  : theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )}>
                {progress.label}
              </span>
            </div>
            <div className={cn(
              'h-2 rounded-full overflow-hidden',
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            )}>
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  challengeCompleted
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-amber-500 to-amber-400'
                )}
                style={{ width: `${Math.min(100, progress.value)}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Message */}
        {challengeCompleted && (
          <div className={cn(
            'p-3 rounded-lg text-center',
            theme === 'dark' ? 'bg-emerald-800/30' : 'bg-emerald-100'
          )}>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className={cn('text-sm font-bold', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700')}>
              {isZh ? '挑战完成！' : 'Challenge Complete!'}
            </p>
          </div>
        )}

        {/* Hints */}
        {!challengeCompleted && hints.length > 0 && (
          <div>
            <button
              onClick={() => setShowHints(!showHints)}
              className={cn(
                'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
                theme === 'dark'
                  ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              )}
            >
              <span className="flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                {isZh ? '需要提示？' : 'Need a hint?'}
              </span>
              {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showHints && (
              <div className={cn(
                'mt-2 p-2 rounded-lg text-xs',
                theme === 'dark' ? 'bg-yellow-500/10 text-yellow-300' : 'bg-yellow-50 text-yellow-800'
              )}>
                <p className="mb-2">
                  <strong>{isZh ? `提示 ${currentHintIndex + 1}:` : `Hint ${currentHintIndex + 1}:`}</strong>{' '}
                  {hints[currentHintIndex]}
                </p>
                {currentHintIndex < hints.length - 1 && (
                  <button
                    onClick={handleNextHint}
                    className={cn(
                      'text-xs underline',
                      theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                    )}
                  >
                    {isZh ? '下一个提示' : 'Next hint'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={cn(
        'flex items-center gap-2 p-3 border-t',
        challengeCompleted
          ? theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-200'
          : theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        {!isSimulating && (
          <button
            onClick={() => setSimulating(true)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
              'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700'
            )}
          >
            <Eye className="w-4 h-4" />
            {isZh ? '开始模拟' : 'Start Simulation'}
          </button>
        )}
        <button
          onClick={handleRetry}
          className={cn(
            'flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            theme === 'dark'
              ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          <RefreshCcw className="w-4 h-4" />
          {isZh ? '重试' : 'Retry'}
        </button>
      </div>
    </div>
  )
}

export default ChallengePanel
