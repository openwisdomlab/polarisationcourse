/**
 * useShortcut - React hook for registering keyboard shortcuts
 *
 * Integrates with the centralized KeyboardManager.
 * Automatically registers on mount and unregisters on unmount.
 *
 * Usage:
 * ```tsx
 * useShortcut({
 *   id: 'game-undo',
 *   key: 'z',
 *   ctrl: true,
 *   scope: 'game',
 *   label: 'Undo',
 *   handler: () => undo(),
 * })
 * ```
 */

import { useEffect, useRef } from 'react'
import { keyboardManager, type ShortcutDefinition } from '@/lib/keyboardManager'

type UseShortcutOptions = Omit<ShortcutDefinition, 'handler'> & {
  handler: (e: KeyboardEvent) => void
  enabled?: boolean
}

/**
 * Register a keyboard shortcut for the lifetime of the component.
 */
export function useShortcut(options: UseShortcutOptions): void {
  const handlerRef = useRef(options.handler)
  handlerRef.current = options.handler

  const { id, key, label, labelZh, ctrl, shift, alt, meta, scope, preventDefault, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    const unregister = keyboardManager.register({
      id,
      key,
      label,
      labelZh,
      ctrl,
      shift,
      alt,
      meta,
      scope,
      preventDefault,
      handler: (e) => handlerRef.current(e),
    })

    return unregister
  }, [id, key, label, labelZh, ctrl, shift, alt, meta, scope, preventDefault, enabled])
}

/**
 * Activate a keyboard scope for the lifetime of the component.
 */
export function useShortcutScope(scope: 'game' | 'studio' | 'demo'): void {
  useEffect(() => {
    keyboardManager.activateScope(scope)
    return () => keyboardManager.deactivateScope(scope)
  }, [scope])
}
