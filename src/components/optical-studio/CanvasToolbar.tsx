/**
 * Canvas Toolbar Component - 画布工具栏组件
 *
 * Toolbar for optical bench canvas with:
 * - Play/Pause simulation
 * - Polarization display toggle
 * - Rotate/Delete selected component
 * - Undo/Redo
 * - Save/Load designs
 * - Grid settings
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Play, Pause, Eye, EyeOff, RotateCcw, RotateCw,
  Trash2, Undo2, Redo2, Save, FolderOpen, Download,
  Upload, Grid3X3, Magnet, X, Keyboard, Tag, MessageSquare, Bug
} from 'lucide-react'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'
import { useSimulationBlackBoxStore } from '@/stores/simulationBlackBoxStore'

// ============================================
// Toolbar Button Component
// ============================================

interface ToolbarButtonProps {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  icon: React.ReactNode
  title: string
  variant?: 'default' | 'danger' | 'success'
}

function ToolbarButton({ onClick, disabled, active, icon, title, variant = 'default' }: ToolbarButtonProps) {
  const { theme } = useTheme()

  const getActiveStyles = () => {
    switch (variant) {
      case 'danger':
        return 'text-red-400 hover:bg-red-500/20'
      case 'success':
        return 'bg-cyan-500/20 text-cyan-400'
      default:
        return active
          ? 'bg-violet-500/20 text-violet-400'
          : theme === 'dark'
            ? 'hover:bg-slate-800 text-gray-400'
            : 'hover:bg-gray-100 text-gray-500'
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-2 rounded-lg transition-colors',
        disabled ? 'opacity-40 cursor-not-allowed' : getActiveStyles()
      )}
      title={title}
    >
      {icon}
    </button>
  )
}

// ============================================
// Divider Component
// ============================================

function Divider() {
  const { theme } = useTheme()
  return <div className={cn('w-px h-6 mx-1', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')} />
}

// ============================================
// Save Dialog Component
// ============================================

interface SaveDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, description?: string) => void
}

function SaveDialog({ isOpen, onClose, onSave }: SaveDialogProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), description.trim() || undefined)
      setName('')
      setDescription('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={cn(
        'w-96 rounded-xl border p-6',
        theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
      )}>
        <h3 className={cn('text-lg font-bold mb-4', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          {isZh ? '保存设计' : 'Save Design'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className={cn('text-sm font-medium mb-1 block', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? '名称' : 'Name'} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isZh ? '输入设计名称...' : 'Enter design name...'}
              className={cn(
                'w-full px-3 py-2 rounded-lg border text-sm',
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              )}
              autoFocus
            />
          </div>
          <div>
            <label className={cn('text-sm font-medium mb-1 block', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? '描述' : 'Description'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isZh ? '可选描述...' : 'Optional description...'}
              rows={3}
              className={cn(
                'w-full px-3 py-2 rounded-lg border text-sm resize-none',
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              )}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className={cn(
              'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
              theme === 'dark'
                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {isZh ? '取消' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className={cn(
              'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
              'bg-gradient-to-r from-violet-500 to-violet-600 text-white',
              !name.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:from-violet-600 hover:to-violet-700'
            )}
          >
            {isZh ? '保存' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Load Dialog Component
// ============================================

interface LoadDialogProps {
  isOpen: boolean
  onClose: () => void
}

function LoadDialog({ isOpen, onClose }: LoadDialogProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const { savedDesigns, loadDesign, deleteDesign } = useOpticalBenchStore()

  if (!isOpen) return null

  const handleLoad = (id: string) => {
    loadDesign(id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={cn(
        'w-[480px] max-w-[calc(100vw-32px)] max-h-[80vh] rounded-xl border flex flex-col',
        theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className={cn('text-lg font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '加载设计' : 'Load Design'}
          </h3>
          <button
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {savedDesigns.length === 0 ? (
            <div className={cn('text-center py-8', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
              {isZh ? '没有保存的设计' : 'No saved designs'}
            </div>
          ) : (
            <div className="space-y-2">
              {savedDesigns.map(design => (
                <div
                  key={design.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border transition-colors',
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className={cn('font-medium truncate', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      {design.name}
                    </h4>
                    {design.description && (
                      <p className={cn('text-xs truncate', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                        {design.description}
                      </p>
                    )}
                    <p className={cn('text-xs mt-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                      {new Date(design.updatedAt).toLocaleDateString()} · {design.components.length} {isZh ? '组件' : 'components'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleLoad(design.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
                      )}
                    >
                      {isZh ? '加载' : 'Load'}
                    </button>
                    <button
                      onClick={() => deleteDesign(design.id)}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        'text-red-400 hover:bg-red-500/20'
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Keyboard Shortcuts Dialog
// ============================================

interface KeyboardShortcutsDialogProps {
  isOpen: boolean
  onClose: () => void
}

function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsDialogProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  if (!isOpen) return null

  const shortcuts = [
    { key: 'Space', actionEn: 'Play/Pause simulation', actionZh: '播放/暂停模拟' },
    { key: 'Delete / Backspace', actionEn: 'Delete selected component', actionZh: '删除选中组件' },
    { key: 'R', actionEn: 'Rotate selected component +15°', actionZh: '旋转选中组件 +15°' },
    { key: 'Shift + R', actionEn: 'Rotate selected component -15°', actionZh: '旋转选中组件 -15°' },
    { key: 'Ctrl/Cmd + Z', actionEn: 'Undo', actionZh: '撤销' },
    { key: 'Ctrl/Cmd + Shift + Z', actionEn: 'Redo', actionZh: '重做' },
    { key: 'Ctrl/Cmd + S', actionEn: 'Save design', actionZh: '保存设计' },
    { key: 'V', actionEn: 'Toggle polarization display', actionZh: '切换偏振显示' },
    { key: 'L', actionEn: 'Toggle component labels', actionZh: '切换组件标签' },
    { key: 'A', actionEn: 'Toggle light path annotations', actionZh: '切换光路注释' },
    { key: 'G', actionEn: 'Toggle grid', actionZh: '切换网格' },
    { key: 'Escape', actionEn: 'Deselect / Close dialogs', actionZh: '取消选择/关闭对话框' },
    { key: '1-7', actionEn: 'Add component (Emitter, Polarizer, etc.)', actionZh: '添加组件（光源、偏振片等）' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={cn(
          'w-[400px] max-w-[calc(100vw-32px)] rounded-xl border p-6',
          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn('text-lg font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '键盘快捷键' : 'Keyboard Shortcuts'}
          </h3>
          <button
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((shortcut, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5">
              <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                {isZh ? shortcut.actionZh : shortcut.actionEn}
              </span>
              <kbd className={cn(
                'px-2 py-0.5 rounded text-xs font-mono',
                theme === 'dark' ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              )}>
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Canvas Toolbar Component
// ============================================

export function CanvasToolbar() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const {
    isSimulating,
    toggleSimulating,
    showPolarization,
    toggleShowPolarization,
    showLabels,
    toggleShowLabels,
    showAnnotations,
    toggleShowAnnotations,
    selectedComponentId,
    rotateComponent,
    deleteSelectedComponent,
    clearAllComponents,
    undo,
    redo,
    historyIndex,
    history,
    saveDesign,
    exportDesign,
    importDesign,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    loadSavedDesigns,
  } = useOpticalBenchStore()

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // Load saved designs on mount
  useState(() => {
    loadSavedDesigns()
  })

  const handleSave = useCallback((name: string, description?: string) => {
    saveDesign(name, description)
  }, [saveDesign])

  const handleExport = useCallback(() => {
    const json = exportDesign()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'optical-design.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [exportDesign])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const json = e.target?.result as string
          importDesign(json)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [importDesign])

  const handleReportPhysicsIssue = useCallback(() => {
    const { exportCurrentAsReport } = useSimulationBlackBoxStore.getState()
    const report = exportCurrentAsReport()
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(report).then(() => {
        // Brief visual feedback could be added here
      })
    }
    // Also trigger a download as backup
    const blob = new Blob([report], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `physics-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return (
    <>
      <div className={cn(
        'absolute top-4 left-4 flex items-center gap-1 p-2 rounded-xl border z-20',
        theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
      )}>
        {/* Simulation controls */}
        <ToolbarButton
          onClick={toggleSimulating}
          active={isSimulating}
          icon={isSimulating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          title={isSimulating ? (isZh ? '暂停' : 'Pause') : (isZh ? '模拟' : 'Simulate')}
          variant={isSimulating ? 'success' : 'default'}
        />

        <Divider />

        {/* View controls */}
        <ToolbarButton
          onClick={toggleShowPolarization}
          active={showPolarization}
          icon={showPolarization ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          title={isZh ? '偏振显示' : 'Polarization'}
        />
        <ToolbarButton
          onClick={toggleShowLabels}
          active={showLabels}
          icon={<Tag className="w-5 h-5" />}
          title={isZh ? '组件标签' : 'Labels'}
        />
        <ToolbarButton
          onClick={toggleShowAnnotations}
          active={showAnnotations}
          icon={<MessageSquare className="w-5 h-5" />}
          title={isZh ? '光路注释' : 'Annotations'}
        />
        <ToolbarButton
          onClick={() => setShowGrid(!showGrid)}
          active={showGrid}
          icon={<Grid3X3 className="w-5 h-5" />}
          title={isZh ? '网格' : 'Grid'}
        />
        <ToolbarButton
          onClick={() => setSnapToGrid(!snapToGrid)}
          active={snapToGrid}
          icon={<Magnet className="w-5 h-5" />}
          title={isZh ? '吸附网格' : 'Snap to Grid'}
        />

        <Divider />

        {/* Component controls */}
        <ToolbarButton
          onClick={() => selectedComponentId && rotateComponent(selectedComponentId, -15)}
          disabled={!selectedComponentId}
          icon={<RotateCcw className="w-5 h-5" />}
          title={isZh ? '逆时针旋转' : 'Rotate CCW'}
        />
        <ToolbarButton
          onClick={() => selectedComponentId && rotateComponent(selectedComponentId, 15)}
          disabled={!selectedComponentId}
          icon={<RotateCw className="w-5 h-5" />}
          title={isZh ? '顺时针旋转' : 'Rotate CW'}
        />
        <ToolbarButton
          onClick={deleteSelectedComponent}
          disabled={!selectedComponentId}
          icon={<Trash2 className="w-5 h-5" />}
          title={isZh ? '删除' : 'Delete'}
          variant="danger"
        />

        <Divider />

        {/* History controls */}
        <ToolbarButton
          onClick={undo}
          disabled={!canUndo}
          icon={<Undo2 className="w-5 h-5" />}
          title={isZh ? '撤销' : 'Undo'}
        />
        <ToolbarButton
          onClick={redo}
          disabled={!canRedo}
          icon={<Redo2 className="w-5 h-5" />}
          title={isZh ? '重做' : 'Redo'}
        />

        <Divider />

        {/* Save/Load controls */}
        <ToolbarButton
          onClick={() => setShowSaveDialog(true)}
          icon={<Save className="w-5 h-5" />}
          title={isZh ? '保存' : 'Save'}
        />
        <ToolbarButton
          onClick={() => setShowLoadDialog(true)}
          icon={<FolderOpen className="w-5 h-5" />}
          title={isZh ? '加载' : 'Load'}
        />
        <ToolbarButton
          onClick={handleExport}
          icon={<Download className="w-5 h-5" />}
          title={isZh ? '导出' : 'Export'}
        />
        <ToolbarButton
          onClick={handleImport}
          icon={<Upload className="w-5 h-5" />}
          title={isZh ? '导入' : 'Import'}
        />
        <ToolbarButton
          onClick={handleReportPhysicsIssue}
          icon={<Bug className="w-5 h-5" />}
          title={isZh ? '报告物理问题' : 'Report Physics Issue'}
        />

        <Divider />

        {/* Help */}
        <ToolbarButton
          onClick={() => setShowShortcuts(true)}
          icon={<Keyboard className="w-5 h-5" />}
          title={isZh ? '快捷键' : 'Shortcuts'}
        />
        <ToolbarButton
          onClick={clearAllComponents}
          icon={<X className="w-5 h-5" />}
          title={isZh ? '清空' : 'Clear All'}
          variant="danger"
        />
      </div>

      {/* Dialogs */}
      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSave}
      />
      <LoadDialog
        isOpen={showLoadDialog}
        onClose={() => setShowLoadDialog(false)}
      />
      <KeyboardShortcutsDialog
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </>
  )
}

export default CanvasToolbar
