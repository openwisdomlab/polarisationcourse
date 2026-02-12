/**
 * Unified Toolbar Component - 统一工具栏组件
 *
 * Combines header and toolbar into a clean, organized bar with:
 * - Logo and module title
 * - Mode indicator (Design/Experiment/Challenge)
 * - Core tools (Play/Pause, View options)
 * - Component actions (Rotate, Delete)
 * - History (Undo/Redo)
 * - File operations (Save/Load/Export)
 */

import { useState, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Play, Pause, Eye, EyeOff, RotateCcw, RotateCw,
  Trash2, Undo2, Redo2, Save, FolderOpen, Download,
  Upload, Grid3X3, Magnet, X, Keyboard, Tag,
  Home, FlaskConical, Target, Sparkles
} from 'lucide-react'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'

// ============================================
// Tool Button Component
// ============================================

interface ToolButtonProps {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  icon: React.ReactNode
  label?: string
  title: string
  variant?: 'default' | 'danger' | 'success' | 'primary'
  size?: 'sm' | 'md'
}

function ToolButton({
  onClick, disabled, active, icon, label, title,
  variant = 'default', size = 'md'
}: ToolButtonProps) {
  const { theme } = useTheme()

  const getStyles = () => {
    if (disabled) return 'opacity-40 cursor-not-allowed'

    switch (variant) {
      case 'danger':
        return 'text-red-400 hover:bg-red-500/20'
      case 'success':
        return active
          ? 'bg-emerald-500/20 text-emerald-400'
          : theme === 'dark'
            ? 'hover:bg-slate-700 text-gray-400'
            : 'hover:bg-gray-100 text-gray-500'
      case 'primary':
        return active
          ? 'bg-violet-500 text-white'
          : 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
      default:
        return active
          ? 'bg-violet-500/20 text-violet-400'
          : theme === 'dark'
            ? 'hover:bg-slate-700 text-gray-400'
            : 'hover:bg-gray-100 text-gray-500'
    }
  }

  const sizeClass = size === 'sm' ? 'p-1.5' : 'p-2'
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-lg transition-colors flex items-center gap-1.5',
        sizeClass,
        getStyles()
      )}
      title={title}
    >
      <span className={iconSize}>{icon}</span>
      {label && <span className="text-xs font-medium">{label}</span>}
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
// Mode Badge Component
// ============================================

function ModeBadge() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const { currentExperiment, currentChallenge, currentTutorial } = useOpticalBenchStore()

  if (currentTutorial) {
    return (
      <div className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
      )}>
        <Sparkles className="w-3.5 h-3.5" />
        {isZh ? '教程模式' : 'Tutorial'}
      </div>
    )
  }

  if (currentChallenge) {
    return (
      <div className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
      )}>
        <Target className="w-3.5 h-3.5" />
        {isZh ? currentChallenge.nameZh : currentChallenge.nameEn}
      </div>
    )
  }

  if (currentExperiment) {
    return (
      <div className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'
      )}>
        <FlaskConical className="w-3.5 h-3.5" />
        {isZh ? currentExperiment.nameZh : currentExperiment.nameEn}
      </div>
    )
  }

  return (
    <div className={cn(
      'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
      theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
    )}>
      <Sparkles className="w-3.5 h-3.5" />
      {isZh ? '自由设计' : 'Free Design'}
    </div>
  )
}

// ============================================
// Save/Load Dialogs (kept from original)
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
        'w-[480px] max-h-[80vh] rounded-xl border flex flex-col',
        theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
      )}>
        <div className={cn(
          'flex items-center justify-between p-4 border-b',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
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
            <div className={cn('text-center py-8', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
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
                    <p className={cn('text-xs mt-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                      {new Date(design.updatedAt).toLocaleDateString()} · {design.components.length} {isZh ? '组件' : 'components'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleLoad(design.id)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
                    >
                      {isZh ? '加载' : 'Load'}
                    </button>
                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="p-1.5 rounded-lg transition-colors text-red-400 hover:bg-red-500/20"
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

function KeyboardShortcutsDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  if (!isOpen) return null

  const shortcuts = [
    { key: 'Space', actionEn: 'Play/Pause', actionZh: '播放/暂停' },
    { key: 'Delete', actionEn: 'Delete component', actionZh: '删除组件' },
    { key: 'R / Shift+R', actionEn: 'Rotate ±15°', actionZh: '旋转 ±15°' },
    { key: 'Ctrl+Z', actionEn: 'Undo', actionZh: '撤销' },
    { key: 'Ctrl+Shift+Z', actionEn: 'Redo', actionZh: '重做' },
    { key: 'V', actionEn: 'Toggle polarization', actionZh: '切换偏振显示' },
    { key: 'G', actionEn: 'Toggle grid', actionZh: '切换网格' },
    { key: '1-7', actionEn: 'Add component', actionZh: '添加组件' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={cn(
          'w-80 rounded-xl border p-4',
          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn('font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '快捷键' : 'Shortcuts'}
          </h3>
          <button
            onClick={onClose}
            className={cn(
              'p-1 rounded transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1.5">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between py-1">
              <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? s.actionZh : s.actionEn}
              </span>
              <kbd className={cn(
                'px-1.5 py-0.5 rounded text-[10px] font-mono',
                theme === 'dark' ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              )}>
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Unified Toolbar Component
// ============================================

export function UnifiedToolbar() {
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
  } = useOpticalBenchStore()

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

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

  return (
    <>
      <header className={cn(
        'h-14 flex items-center justify-between px-4 border-b flex-shrink-0',
        theme === 'dark'
          ? 'bg-slate-900/95 border-slate-800 backdrop-blur-sm'
          : 'bg-white/95 border-gray-200 backdrop-blur-sm'
      )}>
        {/* Left Section: Logo + Mode */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={cn(
              'flex items-center gap-2 px-2 py-1 rounded-lg transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
            )}
          >
            <Home className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
          </Link>

          <div className="flex items-center gap-2">
            <h1 className={cn(
              'font-bold text-sm',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '光学设计室' : 'Optical Studio'}
            </h1>
            <ModeBadge />
          </div>
        </div>

        {/* Center Section: Main Tools */}
        <div className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-xl',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100/50'
        )}>
          {/* Simulation */}
          <ToolButton
            onClick={toggleSimulating}
            active={isSimulating}
            icon={isSimulating ? <Pause className="w-full h-full" /> : <Play className="w-full h-full" />}
            title={isSimulating ? (isZh ? '暂停' : 'Pause') : (isZh ? '模拟' : 'Simulate')}
            variant={isSimulating ? 'success' : 'primary'}
          />

          <Divider />

          {/* View Options */}
          <ToolButton
            onClick={toggleShowPolarization}
            active={showPolarization}
            icon={showPolarization ? <Eye className="w-full h-full" /> : <EyeOff className="w-full h-full" />}
            title={isZh ? '偏振显示' : 'Polarization'}
            size="sm"
          />
          <ToolButton
            onClick={toggleShowLabels}
            active={showLabels}
            icon={<Tag className="w-full h-full" />}
            title={isZh ? '标签' : 'Labels'}
            size="sm"
          />
          <ToolButton
            onClick={() => setShowGrid(!showGrid)}
            active={showGrid}
            icon={<Grid3X3 className="w-full h-full" />}
            title={isZh ? '网格' : 'Grid'}
            size="sm"
          />
          <ToolButton
            onClick={() => setSnapToGrid(!snapToGrid)}
            active={snapToGrid}
            icon={<Magnet className="w-full h-full" />}
            title={isZh ? '吸附' : 'Snap'}
            size="sm"
          />

          <Divider />

          {/* Component Actions */}
          <ToolButton
            onClick={() => selectedComponentId && rotateComponent(selectedComponentId, -15)}
            disabled={!selectedComponentId}
            icon={<RotateCcw className="w-full h-full" />}
            title={isZh ? '逆时针' : 'CCW'}
            size="sm"
          />
          <ToolButton
            onClick={() => selectedComponentId && rotateComponent(selectedComponentId, 15)}
            disabled={!selectedComponentId}
            icon={<RotateCw className="w-full h-full" />}
            title={isZh ? '顺时针' : 'CW'}
            size="sm"
          />
          <ToolButton
            onClick={deleteSelectedComponent}
            disabled={!selectedComponentId}
            icon={<Trash2 className="w-full h-full" />}
            title={isZh ? '删除' : 'Delete'}
            variant="danger"
            size="sm"
          />

          <Divider />

          {/* History */}
          <ToolButton
            onClick={undo}
            disabled={!canUndo}
            icon={<Undo2 className="w-full h-full" />}
            title={isZh ? '撤销' : 'Undo'}
            size="sm"
          />
          <ToolButton
            onClick={redo}
            disabled={!canRedo}
            icon={<Redo2 className="w-full h-full" />}
            title={isZh ? '重做' : 'Redo'}
            size="sm"
          />
        </div>

        {/* Right Section: File Operations + Settings */}
        <div className="flex items-center gap-1">
          <ToolButton
            onClick={() => setShowSaveDialog(true)}
            icon={<Save className="w-full h-full" />}
            title={isZh ? '保存' : 'Save'}
            size="sm"
          />
          <ToolButton
            onClick={() => setShowLoadDialog(true)}
            icon={<FolderOpen className="w-full h-full" />}
            title={isZh ? '加载' : 'Load'}
            size="sm"
          />
          <ToolButton
            onClick={handleExport}
            icon={<Download className="w-full h-full" />}
            title={isZh ? '导出' : 'Export'}
            size="sm"
          />
          <ToolButton
            onClick={handleImport}
            icon={<Upload className="w-full h-full" />}
            title={isZh ? '导入' : 'Import'}
            size="sm"
          />

          <Divider />

          <ToolButton
            onClick={() => setShowShortcuts(true)}
            icon={<Keyboard className="w-full h-full" />}
            title={isZh ? '快捷键' : 'Shortcuts'}
            size="sm"
          />
          <ToolButton
            onClick={clearAllComponents}
            icon={<X className="w-full h-full" />}
            title={isZh ? '清空' : 'Clear'}
            variant="danger"
            size="sm"
          />
        </div>
      </header>

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

export default UnifiedToolbar
