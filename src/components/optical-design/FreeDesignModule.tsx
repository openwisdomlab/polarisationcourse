/**
 * FreeDesignModule - 自由设计模块
 *
 * 精简的自由设计画布，包括:
 * - 组件拖放
 * - 光路模拟
 * - 简化的工具栏
 * - 保存/加载设计
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'react-router-dom'
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Grid3X3,
  Trash2,
  RotateCw,
  Undo2,
  Redo2,
  ChevronLeft,
  ChevronRight,
  Info,
  HelpCircle,
  Keyboard,
} from 'lucide-react'
import { useOpticalBenchStore, type BenchComponentType } from '@/stores/opticalBenchStore'
import { OpticalCanvas } from '@/components/optical-studio/OpticalCanvas'
import { useKeyboardShortcuts } from '@/components/optical-studio/useKeyboardShortcuts'

// ============================================
// Component Palette
// ============================================

interface PaletteItem {
  type: BenchComponentType
  icon: string
  labelKey: string
  shortcut?: string
}

const PALETTE_ITEMS: PaletteItem[] = [
  { type: 'emitter', icon: '💡', labelKey: 'opticalDesign.components.emitter', shortcut: '1' },
  { type: 'polarizer', icon: '📊', labelKey: 'opticalDesign.components.polarizer', shortcut: '2' },
  { type: 'waveplate', icon: '🔲', labelKey: 'opticalDesign.components.waveplate', shortcut: '3' },
  { type: 'mirror', icon: '🪞', labelKey: 'opticalDesign.components.mirror', shortcut: '4' },
  { type: 'splitter', icon: '◇', labelKey: 'opticalDesign.components.splitter', shortcut: '5' },
  { type: 'lens', icon: '🔍', labelKey: 'opticalDesign.components.lens', shortcut: '6' },
  { type: 'sensor', icon: '📟', labelKey: 'opticalDesign.components.sensor', shortcut: '7' },
]

// ============================================
// Compact Toolbar Component
// ============================================

function CompactToolbar() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const {
    isSimulating,
    toggleSimulating,
    showPolarization,
    toggleShowPolarization,
    showGrid,
    setShowGrid,
    selectedComponentId,
    rotateComponent,
    deleteSelectedComponent,
    undo,
    redo,
    clearAllComponents,
  } = useOpticalBenchStore()

  const canUndo = useOpticalBenchStore((state) => state.history.length > 0 && state.historyIndex > 0)
  const canRedo = useOpticalBenchStore((state) => state.historyIndex < state.history.length - 1)

  const buttonClass = cn(
    'p-2 rounded-lg transition-all',
    theme === 'dark'
      ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
      : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
  )

  const activeButtonClass = cn(
    'p-2 rounded-lg transition-all',
    theme === 'dark'
      ? 'bg-cyan-400/20 text-cyan-400'
      : 'bg-cyan-100 text-cyan-700'
  )

  return (
    <div className={cn(
      'flex items-center gap-1 p-2 border-b',
      theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-gray-200'
    )}>
      {/* Simulation Controls */}
      <div className="flex items-center gap-1 pr-2 border-r border-slate-700/50">
        <button
          onClick={toggleSimulating}
          className={isSimulating ? activeButtonClass : buttonClass}
          title={isSimulating ? t('opticalDesign.pause') : t('opticalDesign.play')}
        >
          {isSimulating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

      {/* View Controls */}
      <div className="flex items-center gap-1 px-2 border-r border-slate-700/50">
        <button
          onClick={toggleShowPolarization}
          className={showPolarization ? activeButtonClass : buttonClass}
          title={t('opticalDesign.togglePolarization')}
        >
          {showPolarization ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={showGrid ? activeButtonClass : buttonClass}
          title={t('opticalDesign.toggleGrid')}
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
      </div>

      {/* Component Actions */}
      <div className="flex items-center gap-1 px-2 border-r border-slate-700/50">
        <button
          onClick={() => selectedComponentId && rotateComponent(selectedComponentId, -15)}
          disabled={!selectedComponentId}
          className={cn(buttonClass, !selectedComponentId && 'opacity-40 cursor-not-allowed')}
          title={t('opticalDesign.rotateCCW')}
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => selectedComponentId && rotateComponent(selectedComponentId, 15)}
          disabled={!selectedComponentId}
          className={cn(buttonClass, !selectedComponentId && 'opacity-40 cursor-not-allowed')}
          title={t('opticalDesign.rotateCW')}
        >
          <RotateCw className="w-5 h-5" />
        </button>
        <button
          onClick={() => deleteSelectedComponent()}
          disabled={!selectedComponentId}
          className={cn(buttonClass, !selectedComponentId && 'opacity-40 cursor-not-allowed')}
          title={t('opticalDesign.delete')}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* History */}
      <div className="flex items-center gap-1 px-2 border-r border-slate-700/50">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={cn(buttonClass, !canUndo && 'opacity-40 cursor-not-allowed')}
          title={t('opticalDesign.undo')}
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={cn(buttonClass, !canRedo && 'opacity-40 cursor-not-allowed')}
          title={t('opticalDesign.redo')}
        >
          <Redo2 className="w-5 h-5" />
        </button>
      </div>

      {/* Clear */}
      <button
        onClick={clearAllComponents}
        className={buttonClass}
        title={t('opticalDesign.clearAll')}
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Keyboard Shortcuts Help */}
      <button
        className={buttonClass}
        title={t('opticalDesign.keyboardShortcuts')}
      >
        <Keyboard className="w-5 h-5" />
      </button>
    </div>
  )
}

// ============================================
// Component Palette Panel
// ============================================

interface ComponentPaletteProps {
  collapsed: boolean
  onToggle: () => void
}

function ComponentPalette({ collapsed, onToggle }: ComponentPaletteProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { addComponent } = useOpticalBenchStore()

  const handleAddComponent = (type: BenchComponentType) => {
    // Add component at center of canvas
    addComponent(type, { x: 350, y: 200 })
  }

  return (
    <div className={cn(
      'flex flex-col border-r transition-all duration-300',
      theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-gray-200',
      collapsed ? 'w-12' : 'w-56'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between p-2 border-b',
        theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
      )}>
        {!collapsed && (
          <span className={cn(
            'text-sm font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {t('opticalDesign.components.title')}
          </span>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Component List */}
      <div className={cn(
        'flex-1 overflow-y-auto p-2',
        collapsed ? 'space-y-2' : 'space-y-1'
      )}>
        {PALETTE_ITEMS.map((item) => (
          <button
            key={item.type}
            onClick={() => handleAddComponent(item.type)}
            className={cn(
              'w-full rounded-lg transition-all',
              'hover:scale-105',
              collapsed
                ? 'p-2 flex items-center justify-center'
                : 'p-3 flex items-center gap-3',
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
            )}
            title={collapsed ? t(item.labelKey) : undefined}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && (
              <>
                <span className={cn(
                  'flex-1 text-left text-sm font-medium',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {t(item.labelKey)}
                </span>
                {item.shortcut && (
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-xs font-mono',
                    theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                  )}>
                    {item.shortcut}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Hint */}
      {!collapsed && (
        <div className={cn(
          'p-3 border-t text-xs',
          theme === 'dark' ? 'border-slate-800 text-gray-500' : 'border-gray-200 text-gray-400'
        )}>
          <div className="flex items-center gap-1.5 mb-1">
            <Info className="w-3.5 h-3.5" />
            {t('opticalDesign.hint')}
          </div>
          <p>{t('opticalDesign.dragToPlace')}</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// Properties Panel
// ============================================

function PropertiesPanel() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const {
    selectedComponentId,
    components,
    updateComponent,
    deleteSelectedComponent,
    duplicateComponent,
  } = useOpticalBenchStore()

  const selectedComponent = components.find((c) => c.id === selectedComponentId)

  if (!selectedComponent) {
    return (
      <div className={cn(
        'w-64 flex flex-col items-center justify-center p-6 border-l text-center',
        theme === 'dark' ? 'bg-slate-900/50 border-slate-800 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400'
      )}>
        <HelpCircle className="w-10 h-10 mb-3 opacity-50" />
        <p className="text-sm font-medium">{t('opticalDesign.selectComponent')}</p>
        <p className="text-xs mt-1">{t('opticalDesign.selectComponentHint')}</p>
      </div>
    )
  }

  return (
    <div className={cn(
      'w-64 flex flex-col border-l overflow-hidden',
      theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'p-3 border-b',
        theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
      )}>
        <h3 className={cn(
          'font-semibold text-sm',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {t(`opticalDesign.components.${selectedComponent.type}`)}
        </h3>
        <p className={cn(
          'text-xs',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>
          ID: {selectedComponent.id}
        </p>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Rotation */}
        <div>
          <label className={cn(
            'block text-xs font-medium mb-1.5',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {t('opticalDesign.rotation')}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="360"
              value={selectedComponent.rotation}
              onChange={(e) => updateComponent(selectedComponent.id, { rotation: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className={cn(
              'text-xs font-mono w-10 text-right',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              {selectedComponent.rotation}°
            </span>
          </div>
        </div>

        {/* Type-specific properties */}
        {selectedComponent.type === 'emitter' && (
          <div>
            <label className={cn(
              'block text-xs font-medium mb-1.5',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {t('opticalDesign.polarization')}
            </label>
            <select
              value={selectedComponent.properties.polarization ?? -1}
              onChange={(e) => updateComponent(selectedComponent.id, {
                properties: { ...selectedComponent.properties, polarization: parseInt(e.target.value) }
              })}
              className={cn(
                'w-full p-2 rounded-lg border text-sm',
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              )}
            >
              <option value={-1}>{t('opticalDesign.unpolarized')}</option>
              <option value={0}>0° ({t('opticalDesign.horizontal')})</option>
              <option value={45}>45°</option>
              <option value={90}>90° ({t('opticalDesign.vertical')})</option>
              <option value={135}>135°</option>
            </select>
          </div>
        )}

        {selectedComponent.type === 'polarizer' && (
          <div>
            <label className={cn(
              'block text-xs font-medium mb-1.5',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {t('opticalDesign.transmissionAxis')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="180"
                value={selectedComponent.properties.angle ?? 0}
                onChange={(e) => updateComponent(selectedComponent.id, {
                  properties: { ...selectedComponent.properties, angle: parseInt(e.target.value) }
                })}
                className="flex-1"
              />
              <span className={cn(
                'text-xs font-mono w-10 text-right',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                {selectedComponent.properties.angle ?? 0}°
              </span>
            </div>
          </div>
        )}

        {selectedComponent.type === 'waveplate' && (
          <div>
            <label className={cn(
              'block text-xs font-medium mb-1.5',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {t('opticalDesign.retardation')}
            </label>
            <select
              value={selectedComponent.properties.retardation ?? 90}
              onChange={(e) => updateComponent(selectedComponent.id, {
                properties: { ...selectedComponent.properties, retardation: parseInt(e.target.value) }
              })}
              className={cn(
                'w-full p-2 rounded-lg border text-sm',
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              )}
            >
              <option value={90}>λ/4 (90°)</option>
              <option value={180}>λ/2 (180°)</option>
            </select>
          </div>
        )}

        {selectedComponent.type === 'splitter' && (
          <div>
            <label className={cn(
              'block text-xs font-medium mb-1.5',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {t('opticalDesign.splitterType')}
            </label>
            <select
              value={selectedComponent.properties.splitType ?? 'calcite'}
              onChange={(e) => updateComponent(selectedComponent.id, {
                properties: { ...selectedComponent.properties, splitType: e.target.value as 'pbs' | 'npbs' | 'calcite' }
              })}
              className={cn(
                'w-full p-2 rounded-lg border text-sm',
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              )}
            >
              <option value="calcite">{t('opticalDesign.calcite')}</option>
              <option value="pbs">PBS</option>
              <option value="npbs">NPBS (50/50)</option>
            </select>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={cn(
        'p-3 border-t flex gap-2',
        theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
      )}>
        <button
          onClick={() => duplicateComponent(selectedComponent.id)}
          className={cn(
            'flex-1 p-2 rounded-lg text-xs font-medium transition-colors',
            theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}
        >
          {t('opticalDesign.duplicate')}
        </button>
        <button
          onClick={() => deleteSelectedComponent()}
          className={cn(
            'p-2 rounded-lg transition-colors',
            theme === 'dark'
              ? 'bg-red-400/20 hover:bg-red-400/30 text-red-400'
              : 'bg-red-100 hover:bg-red-200 text-red-600'
          )}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ============================================
// Main Module Component
// ============================================

export function FreeDesignModule() {
  const [searchParams] = useSearchParams()

  const [paletteCollapsed, setPaletteCollapsed] = useState(false)
  const { loadSavedDesigns, setSimulating } = useOpticalBenchStore()

  // Load saved designs on mount
  useEffect(() => {
    loadSavedDesigns()
  }, [loadSavedDesigns])

  // Check for component parameter from URL
  useEffect(() => {
    const componentType = searchParams.get('component') as BenchComponentType | null
    if (componentType) {
      const { addComponent } = useOpticalBenchStore.getState()
      addComponent(componentType, { x: 350, y: 200 })
    }
  }, [searchParams])

  // Start simulation by default
  useEffect(() => {
    setSimulating(true)
  }, [setSimulating])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    enabled: true,
    onEscape: () => {
      useOpticalBenchStore.getState().selectComponent(null)
    },
  })

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Toolbar */}
      <CompactToolbar />

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Palette */}
        <ComponentPalette
          collapsed={paletteCollapsed}
          onToggle={() => setPaletteCollapsed(!paletteCollapsed)}
        />

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <OpticalCanvas />
        </div>

        {/* Properties Panel */}
        <PropertiesPanel />
      </div>
    </div>
  )
}

export default FreeDesignModule
