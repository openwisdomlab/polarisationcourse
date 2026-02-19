/**
 * GameOriginBanner - 游戏来源提示横幅
 *
 * 当用户从游戏导航到演示页面时 (?from=game)，
 * 显示一个提示横幅，解释游戏中的简化模型与真实物理的区别。
 *
 * 使用方式:
 * <GameOriginBanner
 *   fromGame={searchParams?.from === 'game'}
 *   simplification="游戏中偏振片使用了简化的Malus定律..."
 *   calculatorPath="/calc/jones"
 * />
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useDemoTheme } from './demoThemeColors'
import { X, Gamepad2, ArrowRight, Calculator } from 'lucide-react'

interface GameOriginBannerProps {
  /** 是否来自游戏 (由调用方从URL参数判断) */
  fromGame?: boolean
  /** 当前演示对应的游戏简化说明 */
  simplification?: string
  /** 对应的计算器路径 (Calculation Workshop) */
  calculatorPath?: string
  /** 额外 CSS 类名 */
  className?: string
}

export function GameOriginBanner({
  fromGame = false,
  simplification,
  calculatorPath,
  className,
}: GameOriginBannerProps) {
  const dt = useDemoTheme()
  const [dismissed, setDismissed] = useState(false)

  if (!fromGame || dismissed) return null

  const defaultSimplification =
    '游戏中的光学元件使用了简化模型以便于游戏操作。这里展示的是完整的物理原理。'

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          'rounded-xl border-2 p-4 relative',
          dt.isDark
            ? 'bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-500/30'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300',
          className
        )}
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 关闭按钮 */}
        <button
          onClick={() => setDismissed(true)}
          className={cn(
            'absolute top-2 right-2 p-1 rounded-lg transition-colors',
            dt.isDark
              ? 'text-gray-500 hover:text-gray-300 hover:bg-slate-700/50'
              : 'text-gray-500 hover:text-gray-600 hover:bg-gray-200/50'
          )}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className={cn(
            'flex-shrink-0 p-2 rounded-lg',
            dt.isDark ? 'bg-amber-500/20' : 'bg-amber-100'
          )}>
            <Gamepad2 className={cn(
              'w-5 h-5',
              dt.isDark ? 'text-amber-400' : 'text-amber-600'
            )} />
          </div>

          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-sm font-medium mb-1',
              dt.isDark ? 'text-amber-400' : 'text-amber-700'
            )}>
              从游戏来到这里？
            </p>
            <p className={cn('text-xs', dt.bodyClass)}>
              {simplification || defaultSimplification}
            </p>

            {/* 操作链接 */}
            <div className="flex flex-wrap gap-2 mt-2">
              <a
                href="/games"
                className={cn(
                  'inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors',
                  dt.isDark
                    ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                )}
              >
                <Gamepad2 className="w-3 h-3" />
                返回游戏
              </a>
              {calculatorPath && (
                <a
                  href={calculatorPath}
                  className={cn(
                    'inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors',
                    dt.isDark
                      ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                      : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                  )}
                >
                  <Calculator className="w-3 h-3" />
                  计算工具
                  <ArrowRight className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
