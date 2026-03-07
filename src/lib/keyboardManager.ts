/**
 * KeyboardManager - 集中式键盘快捷键管理
 *
 * Central registry for keyboard shortcuts across the application.
 * Supports scoped shortcuts (global, game, studio, demo) to prevent conflicts.
 * Provides a registry of all active shortcuts for help dialogs.
 */

export type ShortcutScope = 'global' | 'game' | 'studio' | 'demo'

export interface ShortcutDefinition {
  /** Unique identifier */
  id: string
  /** Key to match (e.g., 'z', 'F9', ' ', 'Delete') */
  key: string
  /** Display label for help UI */
  label: string
  /** Chinese label */
  labelZh?: string
  /** Modifier keys */
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  /** Scope this shortcut belongs to */
  scope: ShortcutScope
  /** Handler function */
  handler: (e: KeyboardEvent) => void
  /** Whether to prevent default browser behavior */
  preventDefault?: boolean
}

class KeyboardManagerImpl {
  private shortcuts: Map<string, ShortcutDefinition> = new Map()
  private activeScopes: Set<ShortcutScope> = new Set(['global'])
  private listening = false

  /**
   * Register a keyboard shortcut.
   * Returns an unregister function.
   */
  register(shortcut: ShortcutDefinition): () => void {
    this.shortcuts.set(shortcut.id, shortcut)
    this.ensureListening()
    return () => this.unregister(shortcut.id)
  }

  /**
   * Unregister a shortcut by ID.
   */
  unregister(id: string): void {
    this.shortcuts.delete(id)
  }

  /**
   * Activate a scope (makes its shortcuts respond to key events).
   */
  activateScope(scope: ShortcutScope): void {
    this.activeScopes.add(scope)
  }

  /**
   * Deactivate a scope.
   */
  deactivateScope(scope: ShortcutScope): void {
    if (scope !== 'global') {
      this.activeScopes.delete(scope)
    }
  }

  /**
   * Get all registered shortcuts (for help dialog).
   */
  getAllShortcuts(): ShortcutDefinition[] {
    return Array.from(this.shortcuts.values())
  }

  /**
   * Get shortcuts for a specific scope.
   */
  getShortcutsForScope(scope: ShortcutScope): ShortcutDefinition[] {
    return Array.from(this.shortcuts.values()).filter(s => s.scope === scope)
  }

  /**
   * Get all currently active scopes.
   */
  getActiveScopes(): ShortcutScope[] {
    return Array.from(this.activeScopes)
  }

  private ensureListening(): void {
    if (this.listening) return
    this.listening = true
    window.addEventListener('keydown', this.handleKeyDown)
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    // Ignore if typing in form elements
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

    for (const shortcut of this.shortcuts.values()) {
      // Skip if scope is not active
      if (!this.activeScopes.has(shortcut.scope)) continue

      // Match key
      if (e.key.toLowerCase() !== shortcut.key.toLowerCase() && e.key !== shortcut.key) continue

      // Match modifiers
      const ctrlMatch = shortcut.ctrl
        ? (isMac ? e.metaKey : e.ctrlKey)
        : !(isMac ? e.metaKey : e.ctrlKey)
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
      const altMatch = shortcut.alt ? e.altKey : !e.altKey

      if (!ctrlMatch || !shiftMatch || !altMatch) continue

      // Match found
      if (shortcut.preventDefault !== false) {
        e.preventDefault()
      }
      shortcut.handler(e)
      return // First match wins
    }
  }

  /**
   * Cleanup: remove global listener.
   */
  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown)
    this.listening = false
    this.shortcuts.clear()
  }
}

// Global singleton
export const keyboardManager = new KeyboardManagerImpl()
