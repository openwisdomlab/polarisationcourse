/**
 * ScrollIndicator Component
 * Extracted from HomePage for better organization
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'


function ScrollIndicator({ theme, onClick, isZh }: { theme: 'dark' | 'light', onClick: () => void, isZh: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
    >
      <span className="text-xs font-medium">{isZh ? '向下滚动探索' : 'Scroll to explore'}</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </motion.button>
  )
}

export default ScrollIndicator
