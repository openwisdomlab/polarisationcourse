/**
 * CelebrationOverlay - 正确预测微动画
 *
 * ring-pulse boxShadow + checkmark spring 动画
 * 纯Framer Motion实现
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

interface CelebrationOverlayProps {
  show: boolean
  onDismiss: () => void
}

export function CelebrationOverlay({ show, onDismiss }: CelebrationOverlayProps) {
  const { theme } = useTheme()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            // 2秒后自动消失
            setTimeout(onDismiss, 1500)
          }}
        >
          {/* Ring pulse */}
          <motion.div
            className={cn(
              'absolute w-24 h-24 rounded-full',
              theme === 'dark'
                ? 'border-2 border-emerald-400/60'
                : 'border-2 border-emerald-500/60'
            )}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Checkmark circle */}
          <motion.div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center',
              theme === 'dark'
                ? 'bg-emerald-500/20 shadow-[0_0_30px_rgba(52,211,153,0.3)]'
                : 'bg-emerald-100 shadow-[0_0_30px_rgba(52,211,153,0.2)]'
            )}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 15,
            }}
          >
            <motion.svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
              )}
            >
              <motion.path
                d="M5 12l5 5L20 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
