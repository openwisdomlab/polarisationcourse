/**
 * Optical Design Studio V2 - 光学设计室 V2
 *
 * Improved version with:
 * - Modular component architecture
 * - Zustand state management
 * - Drag-and-drop component movement
 * - Undo/Redo support
 * - Keyboard shortcuts
 * - Save/Load designs
 * - Challenge mode
 * - Interactive tutorials
 * - Real-time formula display
 * - Responsive design
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Home, X, Info } from 'lucide-react'
import { DeviceIconMap, DefaultDeviceIcon } from '@/components/icons'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'
import { DIFFICULTY_CONFIG, type Device } from '@/data'
import { Badge } from '@/components/shared'

// Import modular components
import {
  OpticalCanvas,
  CanvasToolbar,
  DeviceLibrary,
  Sidebar,
  ComponentPropertiesPanel,
  ChallengePanel,
  TutorialOverlay,
  FormulaDisplay,
  useKeyboardShortcuts,
} from '@/components/optical-studio'

// ============================================
// Device Detail Panel
// ============================================

interface DeviceDetailPanelProps {
  device: Device
  onClose: () => void
  onAddToBench?: () => void
}

function DeviceDetailPanel({ device, onClose, onAddToBench }: DeviceDetailPanelProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[device.difficulty]
  const IconComponent = DeviceIconMap[device.id] || DefaultDeviceIcon
  const addComponent = useOpticalBenchStore(state => state.addComponent)

  const handleAddToBench = () => {
    if (device.benchComponentType) {
      addComponent(device.benchComponentType as any)
      onAddToBench?.()
    }
  }

  return (
    <div className={cn(
      'absolute right-0 top-0 bottom-0 w-80 border-l overflow-y-auto z-30',
      theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'sticky top-0 flex items-center justify-between p-4 border-b backdrop-blur-sm',
        theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
      )}>
        <span className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          {isZh ? '器件详情' : 'Device Details'}
        </span>
        <button
          onClick={onClose}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Device Header */}
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden',
            theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'
          )}>
            <IconComponent size={48} theme={theme} />
          </div>
          <div>
            <h3 className={cn('font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? device.nameZh : device.nameEn}
            </h3>
            <Badge color={difficulty.color} size="sm">
              {isZh ? difficulty.labelZh : difficulty.labelEn}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className={cn(
            'text-xs font-semibold uppercase tracking-wider mb-1',
            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
          )}>
            {isZh ? '描述' : 'Description'}
          </h4>
          <p className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            {isZh ? device.descriptionZh : device.descriptionEn}
          </p>
        </div>

        {/* Principle */}
        <div>
          <h4 className={cn(
            'text-xs font-semibold uppercase tracking-wider mb-1',
            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
          )}>
            {isZh ? '工作原理' : 'Principle'}
          </h4>
          <p className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            {isZh ? device.principleZh : device.principleEn}
          </p>
          {device.mathFormula && (
            <div className={cn(
              'mt-2 p-2 rounded font-mono text-sm',
              theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-gray-100 text-cyan-700'
            )}>
              {device.mathFormula}
            </div>
          )}
        </div>

        {/* Specifications */}
        {device.specifications && device.specifications.length > 0 && (
          <div>
            <h4 className={cn(
              'text-xs font-semibold uppercase tracking-wider mb-1',
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            )}>
              {isZh ? '技术参数' : 'Specs'}
            </h4>
            <div className={cn(
              'rounded-lg border divide-y text-sm',
              theme === 'dark' ? 'border-slate-700 divide-slate-700' : 'border-gray-200 divide-gray-200'
            )}>
              {device.specifications.map((spec, idx) => (
                <div key={idx} className="flex justify-between p-2">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{spec.key}</span>
                  <span className={cn('font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                    {isZh ? spec.valueZh : spec.valueEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications */}
        {device.applications && (
          <div>
            <h4 className={cn(
              'text-xs font-semibold uppercase tracking-wider mb-1',
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            )}>
              {isZh ? '应用' : 'Applications'}
            </h4>
            <div className="flex flex-wrap gap-1">
              {(isZh ? device.applications.zh : device.applications.en).map((app, idx) => (
                <span
                  key={idx}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs',
                    theme === 'dark' ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  )}
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Add to Bench Button */}
        {device.benchComponentType && (
          <button
            onClick={handleAddToBench}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all',
              'bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700'
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
// Experiment Info Panel
// ============================================

function ExperimentInfoPanel() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const { currentExperiment, clearExperiment } = useOpticalBenchStore()

  if (!currentExperiment) return null

  return (
    <div className={cn(
      'absolute top-20 right-4 w-72 rounded-xl border shadow-xl z-10',
      theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'
    )}>
      <div className={cn(
        'flex items-center justify-between p-3 border-b',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          <Info className={cn('w-4 h-4', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
          <span className={cn('font-semibold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? currentExperiment.nameZh : currentExperiment.nameEn}
          </span>
        </div>
        <button
          onClick={clearExperiment}
          className={cn('p-1 rounded', theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="p-3">
        <p className={cn('text-xs mb-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          {isZh ? currentExperiment.descriptionZh : currentExperiment.descriptionEn}
        </p>
        <div className={cn('p-2 rounded-lg', theme === 'dark' ? 'bg-slate-800' : 'bg-cyan-50')}>
          <h5 className={cn('text-xs font-medium mb-1', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
            {isZh ? '知识要点' : 'Key Points'}
          </h5>
          <ul className="space-y-0.5">
            {(isZh ? currentExperiment.learningPoints.zh : currentExperiment.learningPoints.en).map((point, idx) => (
              <li key={idx} className={cn('text-xs font-mono', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
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
// Main Page Component
// ============================================

export function OpticalDesignStudioPageV2() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  // State
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [deviceLibraryCollapsed, setDeviceLibraryCollapsed] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Initialize store
  const {
    loadSavedDesigns,
    currentChallenge,
    currentTutorial,
    currentExperiment,
  } = useOpticalBenchStore()

  // Load saved designs on mount
  useEffect(() => {
    loadSavedDesigns()
  }, [loadSavedDesigns])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    enabled: true,
    onEscape: () => {
      if (selectedDevice) {
        setSelectedDevice(null)
      }
    },
  })

  return (
    <div className={cn(
      'min-h-screen flex flex-col',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'
      )}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                )}
              >
                <Home className="w-5 h-5" />
              </Link>
              <div>
                <h1 className={cn(
                  'text-lg font-bold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '光学设计室' : 'Optical Design Studio'}
                </h1>
                <p className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {isZh ? '器件图鉴 × 光路设计 × 实验挑战' : 'Device Library × Path Design × Challenges'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Device Library - Top Bar */}
      <DeviceLibrary
        selectedDevice={selectedDevice}
        onSelectDevice={setSelectedDevice}
        collapsed={deviceLibraryCollapsed}
        onToggleCollapse={() => setDeviceLibraryCollapsed(!deviceLibraryCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Canvas Area */}
        <main className="flex-1 relative">
          {/* Toolbar */}
          <CanvasToolbar />

          {/* Canvas */}
          <OpticalCanvas />

          {/* Component Properties Panel */}
          <ComponentPropertiesPanel />

          {/* Experiment Info Panel */}
          {currentExperiment && !currentChallenge && <ExperimentInfoPanel />}

          {/* Challenge Panel */}
          {currentChallenge && <ChallengePanel />}

          {/* Formula Display */}
          <FormulaDisplay />
        </main>

        {/* Right Panel - Device Details */}
        {selectedDevice && (
          <DeviceDetailPanel
            device={selectedDevice}
            onClose={() => setSelectedDevice(null)}
            onAddToBench={() => setSelectedDevice(null)}
          />
        )}
      </div>

      {/* Tutorial Overlay */}
      {currentTutorial && <TutorialOverlay />}
    </div>
  )
}

export default OpticalDesignStudioPageV2
