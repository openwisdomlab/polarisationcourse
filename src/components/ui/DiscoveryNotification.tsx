/**
 * DiscoveryNotification - 发现成就通知组件
 *
 * Displays animated toast notifications when players unlock new discoveries.
 * Uses Framer Motion for smooth entrance/exit animations with a celebratory feel.
 */

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import type { Discovery } from '@/stores/discoveryStore'

interface NotificationItem {
  id: string
  discovery: Discovery
  timestamp: number
}

interface DiscoveryNotificationProps {
  /** Discoveries to show notifications for */
  discoveries: Discovery[]
  /** Called when a notification is dismissed */
  onDismiss?: (discoveryId: string) => void
  /** Auto-dismiss delay in milliseconds (default: 5000) */
  autoDismissDelay?: number
  /** Maximum notifications to show at once */
  maxVisible?: number
  /** Position on screen */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

// Category color mapping
const categoryColors: Record<string, { bg: string; border: string; icon: string }> = {
  polarization: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-400/50',
    icon: 'text-cyan-400',
  },
  interference: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-400/50',
    icon: 'text-purple-400',
  },
  components: {
    bg: 'bg-green-500/20',
    border: 'border-green-400/50',
    icon: 'text-green-400',
  },
  phenomena: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-400/50',
    icon: 'text-amber-400',
  },
  techniques: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-400/50',
    icon: 'text-blue-400',
  },
  detective: {
    bg: 'bg-rose-500/20',
    border: 'border-rose-400/50',
    icon: 'text-rose-400',
  },
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
}

export function DiscoveryNotification({
  discoveries,
  onDismiss,
  autoDismissDelay = 5000,
  maxVisible = 3,
  position = 'top-right',
}: DiscoveryNotificationProps) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  // Add new discoveries to notification queue
  useEffect(() => {
    const newNotifications = discoveries
      .filter((d) => !notifications.some((n) => n.discovery.id === d.id))
      .map((d) => ({
        id: `${d.id}-${Date.now()}`,
        discovery: d,
        timestamp: Date.now(),
      }))

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...prev, ...newNotifications])
    }
  }, [discoveries])

  // Auto-dismiss notifications — interval runs persistently, only updates state when items expire.
  // Returning `prev` unchanged lets React bail out of re-renders, preventing a 500ms render loop.
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      setNotifications((prev) => {
        const filtered = prev.filter((n) => now - n.timestamp < autoDismissDelay)
        return filtered.length === prev.length ? prev : filtered
      })
    }, 500)

    return () => clearInterval(timer)
  }, [autoDismissDelay])

  const handleDismiss = useCallback(
    (notification: NotificationItem) => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      onDismiss?.(notification.discovery.id)
    },
    [onDismiss]
  )

  const visibleNotifications = notifications.slice(0, maxVisible)

  return (
    <div className={cn('fixed z-50 flex flex-col gap-3', positionClasses[position])}>
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification, index) => {
          const { discovery } = notification
          const colors = categoryColors[discovery.category] || categoryColors.phenomena
          const isSecret = discovery.secret

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 300,
                delay: index * 0.1,
              }}
              className={cn(
                'relative min-w-[300px] max-w-[400px] rounded-lg border backdrop-blur-md shadow-lg',
                colors.bg,
                colors.border,
                isSecret && 'ring-2 ring-yellow-400/50'
              )}
            >
              {/* Sparkle effect for secret discoveries */}
              {isSecret && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                </motion.div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between p-3 pb-2">
                <div className="flex items-center gap-2">
                  <motion.span
                    className={cn('text-2xl', colors.icon)}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {discovery.icon}
                  </motion.span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400">
                      {isSecret ? t('discovery.secretDiscovery') : t('discovery.newDiscovery')}
                    </div>
                    <h4 className="font-semibold text-white">
                      {isZh ? discovery.nameZh : discovery.name}
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => handleDismiss(notification)}
                  className="rounded p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Description */}
              <div className="px-3 pb-3">
                <p className="text-sm text-slate-300">
                  {isZh ? discovery.descriptionZh : discovery.description}
                </p>

                {/* Unlocks */}
                {discovery.unlocks && discovery.unlocks.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                    <span>{t('discovery.unlocks')}</span>
                    <span className={cn('font-medium', colors.icon)}>
                      {discovery.unlocks.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar for auto-dismiss */}
              <motion.div
                className={cn('absolute bottom-0 left-0 h-0.5 rounded-b-lg', colors.icon.replace('text-', 'bg-'))}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: autoDismissDelay / 1000, ease: 'linear' }}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Overflow indicator */}
      {notifications.length > maxVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-slate-400"
        >
          +{notifications.length - maxVisible} {t('discovery.moreDiscoveries')}
        </motion.div>
      )}
    </div>
  )
}

/**
 * Hook to manage discovery notifications with automatic triggering
 */
export function useDiscoveryNotifications() {
  const [pendingNotifications, setPendingNotifications] = useState<Discovery[]>([])
  const [shownDiscoveryIds, setShownDiscoveryIds] = useState<Set<string>>(new Set())

  const showNotification = useCallback((discovery: Discovery) => {
    if (shownDiscoveryIds.has(discovery.id)) return

    setPendingNotifications((prev) => [...prev, discovery])
    setShownDiscoveryIds((prev) => new Set([...prev, discovery.id]))
  }, [shownDiscoveryIds])

  const showNotifications = useCallback((discoveries: Discovery[]) => {
    const newDiscoveries = discoveries.filter((d) => !shownDiscoveryIds.has(d.id))
    if (newDiscoveries.length === 0) return

    setPendingNotifications((prev) => [...prev, ...newDiscoveries])
    setShownDiscoveryIds((prev) => new Set([...prev, ...newDiscoveries.map((d) => d.id)]))
  }, [shownDiscoveryIds])

  const clearNotifications = useCallback(() => {
    setPendingNotifications([])
  }, [])

  const dismissNotification = useCallback((discoveryId: string) => {
    setPendingNotifications((prev) =>
      prev.filter((d) => d.id !== discoveryId)
    )
  }, [])

  return {
    pendingNotifications,
    showNotification,
    showNotifications,
    clearNotifications,
    dismissNotification,
  }
}
