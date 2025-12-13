/**
 * Keyboard Shortcuts Hook - 键盘快捷键钩子
 *
 * Handles keyboard shortcuts for the optical bench:
 * - Space: Play/Pause simulation
 * - Delete/Backspace: Delete selected component
 * - R: Rotate selected component +15°
 * - Shift+R: Rotate selected component -15°
 * - Ctrl+Z: Undo
 * - Ctrl+Shift+Z: Redo
 * - Ctrl+S: Save design (prevents browser save)
 * - V: Toggle polarization display
 * - G: Toggle grid
 * - Escape: Deselect / Close dialogs
 * - 1-7: Add components
 */

import { useEffect, useCallback } from 'react'
import { useOpticalBenchStore, type BenchComponentType } from '@/stores/opticalBenchStore'

const COMPONENT_HOTKEYS: Record<string, BenchComponentType> = {
  '1': 'emitter',
  '2': 'polarizer',
  '3': 'waveplate',
  '4': 'mirror',
  '5': 'splitter',
  '6': 'sensor',
  '7': 'lens',
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  onSave?: () => void
  onEscape?: () => void
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
  const { enabled = true, onSave, onEscape } = options

  const {
    selectedComponentId,
    toggleSimulating,
    toggleShowPolarization,
    rotateComponent,
    deleteSelectedComponent,
    undo,
    redo,
    selectComponent,
    addComponent,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
  } = useOpticalBenchStore()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if typing in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey

    // Handle keyboard shortcuts
    switch (e.key.toLowerCase()) {
      case ' ': // Space - Play/Pause
        e.preventDefault()
        toggleSimulating()
        break

      case 'delete':
      case 'backspace':
        if (selectedComponentId) {
          e.preventDefault()
          deleteSelectedComponent()
        }
        break

      case 'r': // Rotate
        if (selectedComponentId) {
          e.preventDefault()
          rotateComponent(selectedComponentId, e.shiftKey ? -15 : 15)
        }
        break

      case 'z': // Undo/Redo
        if (cmdOrCtrl) {
          e.preventDefault()
          if (e.shiftKey) {
            redo()
          } else {
            undo()
          }
        }
        break

      case 'y': // Redo (Ctrl+Y)
        if (cmdOrCtrl) {
          e.preventDefault()
          redo()
        }
        break

      case 's': // Save
        if (cmdOrCtrl) {
          e.preventDefault()
          onSave?.()
        }
        break

      case 'v': // Toggle polarization
        if (!cmdOrCtrl) {
          e.preventDefault()
          toggleShowPolarization()
        }
        break

      case 'g': // Toggle grid
        e.preventDefault()
        setShowGrid(!showGrid)
        break

      case 'n': // Toggle snap to grid
        if (cmdOrCtrl) {
          e.preventDefault()
          setSnapToGrid(!snapToGrid)
        }
        break

      case 'escape':
        e.preventDefault()
        if (selectedComponentId) {
          selectComponent(null)
        } else {
          onEscape?.()
        }
        break

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
        if (!cmdOrCtrl && !e.altKey) {
          e.preventDefault()
          const componentType = COMPONENT_HOTKEYS[e.key]
          if (componentType) {
            addComponent(componentType)
          }
        }
        break
    }
  }, [
    selectedComponentId,
    toggleSimulating,
    toggleShowPolarization,
    rotateComponent,
    deleteSelectedComponent,
    undo,
    redo,
    selectComponent,
    addComponent,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    onSave,
    onEscape,
  ])

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, handleKeyDown])

  return null
}

export default useKeyboardShortcuts
