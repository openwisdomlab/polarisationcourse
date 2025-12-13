/**
 * Component Properties Panel - 组件属性面板
 *
 * Panel for editing selected optical component properties:
 * - Polarization angle
 * - Wave plate retardation
 * - Splitter type
 * - Component rotation
 * - Custom labels
 */

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { X, RotateCcw, Copy, Trash2 } from 'lucide-react'
import { useOpticalBenchStore, type BenchComponent } from '@/stores/opticalBenchStore'
import { PALETTE_COMPONENTS } from '@/data'

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
  color?: string
}

function SliderInput({ label, value, min, max, step = 1, unit = '°', onChange, color = 'violet' }: SliderInputProps) {
  const { theme } = useTheme()

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className={cn('text-xs font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          {label}
        </label>
        <span className={cn(
          'text-xs font-mono px-1.5 py-0.5 rounded',
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
          'w-full h-2 rounded-full appearance-none cursor-pointer',
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200',
          `accent-${color}-500`
        )}
        style={{
          background: theme === 'dark'
            ? `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${((value - min) / (max - min)) * 100}%, rgb(51, 65, 85) ${((value - min) / (max - min)) * 100}%, rgb(51, 65, 85) 100%)`
            : `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${((value - min) / (max - min)) * 100}%, rgb(229, 231, 235) ${((value - min) / (max - min)) * 100}%, rgb(229, 231, 235) 100%)`
        }}
      />
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
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
    <div className="space-y-1.5">
      <label className={cn('text-xs font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-1.5 rounded-lg border text-sm',
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
// Text Input Component
// ============================================

interface TextInputProps {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

function TextInput({ label, value, placeholder, onChange }: TextInputProps) {
  const { theme } = useTheme()

  return (
    <div className="space-y-1.5">
      <label className={cn('text-xs font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-1.5 rounded-lg border text-sm',
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
        )}
      />
    </div>
  )
}

// ============================================
// Properties by Component Type
// ============================================

interface ComponentPropertiesProps {
  component: BenchComponent
  onUpdate: (updates: Partial<BenchComponent['properties']>) => void
}

function EmitterProperties({ component, onUpdate }: ComponentPropertiesProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const polarization = component.properties.polarization as number ?? 0

  return (
    <div className="space-y-4">
      <SliderInput
        label={isZh ? '偏振角度' : 'Polarization Angle'}
        value={polarization === -1 ? 0 : polarization}
        min={0}
        max={180}
        step={5}
        onChange={(v) => onUpdate({ polarization: v })}
      />
      <SelectInput
        label={isZh ? '偏振态' : 'Polarization State'}
        value={polarization === -1 ? 'unpolarized' : 'linear'}
        options={[
          { value: 'linear', labelEn: 'Linear Polarized', labelZh: '线偏振' },
          { value: 'unpolarized', labelEn: 'Unpolarized', labelZh: '自然光' },
        ]}
        onChange={(v) => onUpdate({ polarization: v === 'unpolarized' ? -1 : 0 })}
      />
    </div>
  )
}

function PolarizerProperties({ component, onUpdate }: ComponentPropertiesProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const angle = component.properties.angle as number ?? 0

  return (
    <SliderInput
      label={isZh ? '透光轴角度' : 'Transmission Axis'}
      value={angle}
      min={0}
      max={180}
      step={5}
      onChange={(v) => onUpdate({ angle: v })}
    />
  )
}

function WaveplateProperties({ component, onUpdate }: ComponentPropertiesProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const retardation = component.properties.retardation as number ?? 90

  return (
    <SelectInput
      label={isZh ? '相位延迟' : 'Phase Retardation'}
      value={String(retardation)}
      options={[
        { value: '90', labelEn: 'λ/4 (Quarter-Wave)', labelZh: 'λ/4（四分之一波片）' },
        { value: '180', labelEn: 'λ/2 (Half-Wave)', labelZh: 'λ/2（二分之一波片）' },
      ]}
      onChange={(v) => onUpdate({ retardation: Number(v) })}
    />
  )
}

function MirrorProperties({ component, onUpdate }: ComponentPropertiesProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const reflectAngle = component.properties.reflectAngle as number ?? 45

  return (
    <SliderInput
      label={isZh ? '反射面角度' : 'Mirror Angle'}
      value={reflectAngle}
      min={0}
      max={90}
      step={5}
      onChange={(v) => onUpdate({ reflectAngle: v })}
    />
  )
}

function SplitterProperties({ component, onUpdate }: ComponentPropertiesProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const splitType = component.properties.splitType as string ?? 'pbs'

  return (
    <SelectInput
      label={isZh ? '分束器类型' : 'Splitter Type'}
      value={splitType}
      options={[
        { value: 'pbs', labelEn: 'PBS (Polarizing)', labelZh: 'PBS（偏振分束）' },
        { value: 'npbs', labelEn: 'NPBS (Non-Polarizing)', labelZh: 'NPBS（非偏振分束）' },
        { value: 'calcite', labelEn: 'Calcite (Birefringent)', labelZh: '方解石（双折射）' },
      ]}
      onChange={(v) => onUpdate({ splitType: v as 'pbs' | 'npbs' | 'calcite' })}
    />
  )
}

function LensProperties({ component, onUpdate }: ComponentPropertiesProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const focalLength = component.properties.focalLength as number ?? 50

  return (
    <SliderInput
      label={isZh ? '焦距' : 'Focal Length'}
      value={focalLength}
      min={10}
      max={200}
      step={10}
      unit="mm"
      onChange={(v) => onUpdate({ focalLength: v })}
    />
  )
}

// ============================================
// Main Component Properties Panel
// ============================================

export function ComponentPropertiesPanel() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const {
    components,
    selectedComponentId,
    selectComponent,
    updateComponent,
    rotateComponent,
    duplicateComponent,
    deleteComponent,
  } = useOpticalBenchStore()

  const selectedComponent = components.find(c => c.id === selectedComponentId)
  const paletteItem = selectedComponent
    ? PALETTE_COMPONENTS.find(p => p.type === selectedComponent.type)
    : null

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

  const handleLabelChange = useCallback((label: string) => {
    if (selectedComponentId) {
      const current = components.find(c => c.id === selectedComponentId)
      if (current) {
        updateComponent(selectedComponentId, {
          properties: { ...current.properties, label }
        })
      }
    }
  }, [selectedComponentId, components, updateComponent])

  if (!selectedComponent || !paletteItem) {
    return null
  }

  const renderProperties = () => {
    switch (selectedComponent.type) {
      case 'emitter':
        return <EmitterProperties component={selectedComponent} onUpdate={handleUpdateProperties} />
      case 'polarizer':
        return <PolarizerProperties component={selectedComponent} onUpdate={handleUpdateProperties} />
      case 'waveplate':
        return <WaveplateProperties component={selectedComponent} onUpdate={handleUpdateProperties} />
      case 'mirror':
        return <MirrorProperties component={selectedComponent} onUpdate={handleUpdateProperties} />
      case 'splitter':
        return <SplitterProperties component={selectedComponent} onUpdate={handleUpdateProperties} />
      case 'lens':
        return <LensProperties component={selectedComponent} onUpdate={handleUpdateProperties} />
      case 'sensor':
        return null // Sensors don't have editable properties
      default:
        return null
    }
  }

  return (
    <div className={cn(
      'absolute bottom-4 right-4 w-72 rounded-xl border shadow-xl z-20',
      theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between p-3 border-b',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{paletteItem.icon}</span>
          <div>
            <h4 className={cn('font-semibold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? paletteItem.nameZh : paletteItem.nameEn}
            </h4>
            <p className={cn('text-xs font-mono', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
              {isZh ? paletteItem.principleZh : paletteItem.principleEn}
            </p>
          </div>
        </div>
        <button
          onClick={() => selectComponent(null)}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Properties */}
      <div className="p-3 space-y-4">
        {/* Rotation */}
        <SliderInput
          label={isZh ? '组件旋转' : 'Component Rotation'}
          value={selectedComponent.rotation}
          min={0}
          max={359}
          step={15}
          onChange={handleRotationChange}
        />

        {/* Type-specific properties */}
        {renderProperties()}

        {/* Label */}
        <TextInput
          label={isZh ? '标签' : 'Label'}
          value={(selectedComponent.properties.label as string) || ''}
          placeholder={isZh ? '可选标签...' : 'Optional label...'}
          onChange={handleLabelChange}
        />

        {/* Position info */}
        <div className={cn(
          'p-2 rounded-lg text-xs font-mono',
          theme === 'dark' ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'
        )}>
          X: {selectedComponent.x.toFixed(0)} | Y: {selectedComponent.y.toFixed(0)}
        </div>
      </div>

      {/* Actions */}
      <div className={cn(
        'flex items-center gap-2 p-3 border-t',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <button
          onClick={() => selectedComponentId && rotateComponent(selectedComponentId, -15)}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
            theme === 'dark'
              ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
          title={isZh ? '逆时针旋转 15°' : 'Rotate CCW 15°'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          -15°
        </button>
        <button
          onClick={() => selectedComponentId && duplicateComponent(selectedComponentId)}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            theme === 'dark'
              ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
          title={isZh ? '复制' : 'Duplicate'}
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => selectedComponentId && deleteComponent(selectedComponentId)}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            'text-red-400 hover:bg-red-500/20'
          )}
          title={isZh ? '删除' : 'Delete'}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default ComponentPropertiesPanel
