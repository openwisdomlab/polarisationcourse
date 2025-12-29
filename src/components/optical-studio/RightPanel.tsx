/**
 * Right Panel Component - 右侧面板组件
 *
 * Unified panel combining:
 * - Component properties (when selected)
 * - Experiment info (when in experiment mode)
 * - Challenge progress (when in challenge mode)
 * - Device details (when viewing device)
 */

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  X, Copy, Trash2, Info,
  ChevronRight, ChevronLeft, Target, CheckCircle2,
  Lightbulb, AlertCircle, Play
} from 'lucide-react'
import { useOpticalBenchStore, type BenchComponent } from '@/stores/opticalBenchStore'
import { PALETTE_COMPONENTS, DIFFICULTY_CONFIG } from '@/data'
import type { Device } from '@/data'
import { DeviceIconMap, DefaultDeviceIcon } from '@/components/icons'
import { Badge } from '@/components/shared'

// ============================================
// Slider Input Component
// ============================================

interface SliderInputProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}

function SliderInput({ label, value, min, max, step = 1, unit = '°', onChange }: SliderInputProps) {
  const { theme } = useTheme()

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className={cn('text-[10px] font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          {label}
        </label>
        <span className={cn(
          'text-[10px] font-mono px-1.5 py-0.5 rounded',
          theme === 'dark' ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'
        )}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full h-1.5 rounded-full appearance-none cursor-pointer',
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
        )}
        style={{
          background: theme === 'dark'
            ? `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${((value - min) / (max - min)) * 100}%, rgb(51, 65, 85) ${((value - min) / (max - min)) * 100}%, rgb(51, 65, 85) 100%)`
            : `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${((value - min) / (max - min)) * 100}%, rgb(229, 231, 235) ${((value - min) / (max - min)) * 100}%, rgb(229, 231, 235) 100%)`
        }}
      />
    </div>
  )
}

// ============================================
// Select Input Component
// ============================================

interface SelectInputProps {
  label: string
  value: string
  options: { value: string; labelEn: string; labelZh: string }[]
  onChange: (value: string) => void
}

function SelectInput({ label, value, options, onChange }: SelectInputProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="space-y-1">
      <label className={cn('text-[10px] font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-2 py-1 rounded-lg border text-xs',
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700 text-white'
            : 'bg-white border-gray-300 text-gray-900'
        )}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {isZh ? opt.labelZh : opt.labelEn}
          </option>
        ))}
      </select>
    </div>
  )
}

// ============================================
// Component Properties Section
// ============================================

interface ComponentPropertiesSectionProps {
  component: BenchComponent
  onUpdate: (updates: Partial<BenchComponent['properties']>) => void
  onRotationChange: (rotation: number) => void
  onDuplicate: () => void
  onDelete: () => void
  onClose: () => void
}

function ComponentPropertiesSection({
  component, onUpdate, onRotationChange, onDuplicate, onDelete, onClose
}: ComponentPropertiesSectionProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const paletteItem = PALETTE_COMPONENTS.find(p => p.type === component.type)
  if (!paletteItem) return null

  const renderTypeProperties = () => {
    switch (component.type) {
      case 'emitter': {
        const polarization = component.properties.polarization as number ?? 0
        return (
          <>
            <SliderInput
              label={isZh ? '偏振角度' : 'Polarization'}
              value={polarization === -1 ? 0 : polarization}
              min={0} max={180} step={5}
              onChange={(v) => onUpdate({ polarization: v })}
            />
            <SelectInput
              label={isZh ? '偏振态' : 'State'}
              value={polarization === -1 ? 'unpolarized' : 'linear'}
              options={[
                { value: 'linear', labelEn: 'Linear', labelZh: '线偏振' },
                { value: 'unpolarized', labelEn: 'Unpolarized', labelZh: '自然光' },
              ]}
              onChange={(v) => onUpdate({ polarization: v === 'unpolarized' ? -1 : 0 })}
            />
          </>
        )
      }
      case 'polarizer': {
        const angle = component.properties.angle as number ?? 0
        return (
          <SliderInput
            label={isZh ? '透光轴' : 'Axis'}
            value={angle}
            min={0} max={180} step={5}
            onChange={(v) => onUpdate({ angle: v })}
          />
        )
      }
      case 'waveplate': {
        const retardation = component.properties.retardation as number ?? 90
        return (
          <SelectInput
            label={isZh ? '相位延迟' : 'Retardation'}
            value={String(retardation)}
            options={[
              { value: '90', labelEn: 'λ/4', labelZh: 'λ/4' },
              { value: '180', labelEn: 'λ/2', labelZh: 'λ/2' },
            ]}
            onChange={(v) => onUpdate({ retardation: Number(v) })}
          />
        )
      }
      case 'mirror': {
        const reflectAngle = component.properties.reflectAngle as number ?? 45
        return (
          <SliderInput
            label={isZh ? '反射角' : 'Angle'}
            value={reflectAngle}
            min={0} max={90} step={5}
            onChange={(v) => onUpdate({ reflectAngle: v })}
          />
        )
      }
      case 'splitter': {
        const splitType = component.properties.splitType as string ?? 'pbs'
        return (
          <SelectInput
            label={isZh ? '类型' : 'Type'}
            value={splitType}
            options={[
              { value: 'pbs', labelEn: 'PBS', labelZh: 'PBS' },
              { value: 'npbs', labelEn: 'NPBS', labelZh: 'NPBS' },
              { value: 'calcite', labelEn: 'Calcite', labelZh: '方解石' },
            ]}
            onChange={(v) => onUpdate({ splitType: v as 'pbs' | 'npbs' | 'calcite' })}
          />
        )
      }
      case 'lens': {
        const focalLength = component.properties.focalLength as number ?? 50
        return (
          <SliderInput
            label={isZh ? '焦距' : 'Focal'}
            value={focalLength}
            min={10} max={200} step={10} unit="mm"
            onChange={(v) => onUpdate({ focalLength: v })}
          />
        )
      }
      default:
        return null
    }
  }

  return (
    <div className={cn(
      'rounded-lg border',
      theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between p-2 border-b',
        theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          <span className="text-base">{paletteItem.icon}</span>
          <div>
            <h4 className={cn('font-semibold text-xs', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? paletteItem.nameZh : paletteItem.nameEn}
            </h4>
          </div>
        </div>
        <button
          onClick={onClose}
          className={cn(
            'p-1 rounded transition-colors',
            theme === 'dark' ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Properties */}
      <div className="p-2 space-y-3">
        <SliderInput
          label={isZh ? '旋转' : 'Rotation'}
          value={component.rotation}
          min={0} max={359} step={15}
          onChange={onRotationChange}
        />
        {renderTypeProperties()}

        {/* Position */}
        <div className={cn(
          'p-1.5 rounded text-[10px] font-mono',
          theme === 'dark' ? 'bg-slate-800/50 text-gray-500' : 'bg-gray-100 text-gray-500'
        )}>
          X: {component.x.toFixed(0)} | Y: {component.y.toFixed(0)}
        </div>
      </div>

      {/* Actions */}
      <div className={cn(
        'flex items-center gap-1 p-2 border-t',
        theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'
      )}>
        <button
          onClick={onDuplicate}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 p-1.5 rounded text-[10px] font-medium',
            theme === 'dark' ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          <Copy className="w-3 h-3" />
          {isZh ? '复制' : 'Copy'}
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center p-1.5 rounded text-red-400 hover:bg-red-500/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ============================================
// Experiment Info Section
// ============================================

function ExperimentInfoSection() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const { currentExperiment, clearExperiment } = useOpticalBenchStore()

  if (!currentExperiment) return null

  return (
    <div className={cn(
      'rounded-lg border',
      theme === 'dark' ? 'bg-violet-500/10 border-violet-500/30' : 'bg-violet-50 border-violet-200'
    )}>
      <div className={cn(
        'flex items-center justify-between p-2 border-b',
        theme === 'dark' ? 'border-violet-500/30' : 'border-violet-200'
      )}>
        <div className="flex items-center gap-2">
          <Info className={cn('w-4 h-4', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
          <span className={cn('font-semibold text-xs', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? currentExperiment.nameZh : currentExperiment.nameEn}
          </span>
        </div>
        <button
          onClick={clearExperiment}
          className={cn('p-1 rounded', theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-violet-100')}
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
      <div className="p-2">
        <p className={cn('text-[10px] mb-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          {isZh ? currentExperiment.descriptionZh : currentExperiment.descriptionEn}
        </p>
        <div className={cn('p-2 rounded', theme === 'dark' ? 'bg-slate-800/50' : 'bg-white')}>
          <h5 className={cn('text-[10px] font-medium mb-1', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')}>
            {isZh ? '知识要点' : 'Key Points'}
          </h5>
          <ul className="space-y-0.5">
            {(isZh ? currentExperiment.learningPoints.zh : currentExperiment.learningPoints.en).map((point, idx) => (
              <li key={idx} className={cn('text-[10px]', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                • {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Challenge Progress Section
// ============================================

function ChallengeProgressSection() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const {
    currentChallenge,
    challengeCompleted,
    sensorReadings,
    isSimulating,
    toggleSimulating,
    clearChallenge,
  } = useOpticalBenchStore()

  if (!currentChallenge) return null

  // Calculate progress based on successCondition
  const sensorId = currentChallenge.successCondition.targetSensorId || 'sensor-0'
  const reading = sensorReadings.get(sensorId)
  const condition = currentChallenge.successCondition

  let intensityProgress = 0
  let polarizationProgress = 0

  if (reading) {
    if (condition.minIntensity !== undefined) {
      intensityProgress = Math.min(100, (reading.intensity / condition.minIntensity) * 100)
    }
    if (condition.targetPolarization !== undefined) {
      const diff = Math.abs(reading.polarization - condition.targetPolarization)
      const tolerance = condition.tolerance || 5
      polarizationProgress = Math.max(0, 100 - (diff / tolerance) * 100)
    }
  }

  return (
    <div className={cn(
      'rounded-lg border',
      challengeCompleted
        ? theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
        : theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
    )}>
      <div className={cn(
        'flex items-center justify-between p-2 border-b',
        challengeCompleted
          ? theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-200'
          : theme === 'dark' ? 'border-amber-500/30' : 'border-amber-200'
      )}>
        <div className="flex items-center gap-2">
          {challengeCompleted
            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            : <Target className={cn('w-4 h-4', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
          }
          <span className={cn('font-semibold text-xs', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? currentChallenge.nameZh : currentChallenge.nameEn}
          </span>
        </div>
        <button
          onClick={clearChallenge}
          className={cn('p-1 rounded', theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-amber-100')}
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      <div className="p-2 space-y-2">
        {/* Goal */}
        <div className={cn(
          'p-2 rounded text-[10px]',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
        )}>
          <Target className="w-3 h-3 inline mr-1 text-amber-500" />
          {isZh ? currentChallenge.goal.zh : currentChallenge.goal.en}
        </div>

        {/* Progress Bars */}
        {condition.minIntensity !== undefined && (
          <div className="space-y-0.5">
            <div className="flex justify-between text-[10px]">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {isZh ? '强度' : 'Intensity'}
              </span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {reading?.intensity.toFixed(0) ?? 0} / {condition.minIntensity}%
              </span>
            </div>
            <div className={cn('h-1.5 rounded-full', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  intensityProgress >= 95 ? 'bg-emerald-500' : 'bg-amber-500'
                )}
                style={{ width: `${Math.min(100, intensityProgress)}%` }}
              />
            </div>
          </div>
        )}

        {condition.targetPolarization !== undefined && (
          <div className="space-y-0.5">
            <div className="flex justify-between text-[10px]">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {isZh ? '偏振' : 'Polarization'}
              </span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {reading?.polarization.toFixed(0) ?? 0}° / {condition.targetPolarization}°
              </span>
            </div>
            <div className={cn('h-1.5 rounded-full', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  polarizationProgress >= 95 ? 'bg-emerald-500' : 'bg-amber-500'
                )}
                style={{ width: `${Math.min(100, polarizationProgress)}%` }}
              />
            </div>
          </div>
        )}

        {/* Success/Simulation Button */}
        {challengeCompleted ? (
          <div className={cn(
            'flex items-center justify-center gap-1 p-2 rounded text-xs font-medium',
            'bg-emerald-500/20 text-emerald-400'
          )}>
            <CheckCircle2 className="w-4 h-4" />
            {isZh ? '挑战完成！' : 'Challenge Complete!'}
          </div>
        ) : !isSimulating ? (
          <button
            onClick={toggleSimulating}
            className={cn(
              'w-full flex items-center justify-center gap-1 p-2 rounded text-xs font-medium',
              'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
            )}
          >
            <Play className="w-3.5 h-3.5" />
            {isZh ? '开始模拟' : 'Start Simulation'}
          </button>
        ) : null}

        {/* Hints */}
        {currentChallenge.hints && (isZh ? currentChallenge.hints.zh : currentChallenge.hints.en).length > 0 && !challengeCompleted && (
          <div className={cn(
            'p-2 rounded',
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-amber-100/50'
          )}>
            <div className="flex items-center gap-1 mb-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span className={cn('text-[10px] font-medium', theme === 'dark' ? 'text-amber-400' : 'text-amber-700')}>
                {isZh ? '提示' : 'Hint'}
              </span>
            </div>
            <p className={cn('text-[10px]', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {isZh ? currentChallenge.hints.zh[0] : currentChallenge.hints.en[0]}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Device Detail Section
// ============================================

interface DeviceDetailSectionProps {
  device: Device
  onClose: () => void
  onAddToBench?: () => void
}

function DeviceDetailSection({ device, onClose, onAddToBench }: DeviceDetailSectionProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[device.difficulty]
  const IconComponent = DeviceIconMap[device.id] || DefaultDeviceIcon
  const addComponent = useOpticalBenchStore(state => state.addComponent)

  const handleAddToBench = () => {
    if (device.benchComponentType) {
      addComponent(device.benchComponentType)
      onAddToBench?.()
    }
  }

  return (
    <div className={cn(
      'rounded-lg border',
      theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between p-2 border-b',
        theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-8 h-8 rounded flex items-center justify-center',
            theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'
          )}>
            <IconComponent size={24} theme={theme} />
          </div>
          <div>
            <h4 className={cn('font-semibold text-xs', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? device.nameZh : device.nameEn}
            </h4>
            <Badge color={difficulty.color} size="sm">
              {isZh ? difficulty.labelZh : difficulty.labelEn}
            </Badge>
          </div>
        </div>
        <button
          onClick={onClose}
          className={cn(
            'p-1 rounded transition-colors',
            theme === 'dark' ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-2 space-y-2 text-[10px] max-h-64 overflow-y-auto">
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          {isZh ? device.descriptionZh : device.descriptionEn}
        </p>

        {device.mathFormula && (
          <div className={cn(
            'p-1.5 rounded font-mono text-[10px]',
            theme === 'dark' ? 'bg-slate-800/50 text-cyan-400' : 'bg-cyan-50 text-cyan-700'
          )}>
            {device.mathFormula}
          </div>
        )}

        {device.benchComponentType && (
          <button
            onClick={handleAddToBench}
            className={cn(
              'w-full flex items-center justify-center gap-1 p-1.5 rounded text-[10px] font-medium',
              'bg-violet-500 text-white hover:bg-violet-600'
            )}
          >
            {isZh ? '添加到光路' : 'Add to Bench'}
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================
// Main Right Panel Component
// ============================================

interface RightPanelProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
  selectedDevice?: Device | null
  onCloseDevice?: () => void
}

export function RightPanel({
  collapsed = false,
  onToggleCollapse,
  selectedDevice,
  onCloseDevice
}: RightPanelProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const {
    components,
    selectedComponentId,
    selectComponent,
    updateComponent,
    duplicateComponent,
    deleteComponent,
    currentExperiment,
    currentChallenge,
  } = useOpticalBenchStore()

  const selectedComponent = components.find(c => c.id === selectedComponentId)

  const handleUpdateProperties = useCallback((updates: Partial<BenchComponent['properties']>) => {
    if (selectedComponentId) {
      const current = components.find(c => c.id === selectedComponentId)
      if (current) {
        updateComponent(selectedComponentId, {
          properties: { ...current.properties, ...updates }
        })
      }
    }
  }, [selectedComponentId, components, updateComponent])

  const handleRotationChange = useCallback((rotation: number) => {
    if (selectedComponentId) {
      updateComponent(selectedComponentId, { rotation })
    }
  }, [selectedComponentId, updateComponent])

  // Determine if panel has content
  const hasContent = selectedComponent || currentExperiment || currentChallenge || selectedDevice

  return (
    <aside className={cn(
      'flex flex-col flex-shrink-0 border-l transition-all duration-300',
      collapsed ? 'w-14' : 'w-64',
      theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between p-2 border-b',
        theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
      )}>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500',
              collapsed && 'mx-auto'
            )}
          >
            {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        {!collapsed && (
          <span className={cn('font-semibold text-xs', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '属性' : 'Properties'}
          </span>
        )}
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {/* Device Details (priority 1) */}
          {selectedDevice && (
            <DeviceDetailSection
              device={selectedDevice}
              onClose={onCloseDevice || (() => {})}
              onAddToBench={onCloseDevice}
            />
          )}

          {/* Component Properties (priority 2) */}
          {selectedComponent && !selectedDevice && (
            <ComponentPropertiesSection
              component={selectedComponent}
              onUpdate={handleUpdateProperties}
              onRotationChange={handleRotationChange}
              onDuplicate={() => selectedComponentId && duplicateComponent(selectedComponentId)}
              onDelete={() => selectedComponentId && deleteComponent(selectedComponentId)}
              onClose={() => selectComponent(null)}
            />
          )}

          {/* Challenge Progress */}
          {currentChallenge && <ChallengeProgressSection />}

          {/* Experiment Info */}
          {currentExperiment && !currentChallenge && <ExperimentInfoSection />}

          {/* Empty State */}
          {!hasContent && (
            <div className={cn(
              'flex flex-col items-center justify-center py-8 text-center',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">
                {isZh ? '选择组件查看属性' : 'Select a component'}
              </p>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

export default RightPanel
