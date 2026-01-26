/**
 * PolarizationCipher - 偏振密码锁
 *
 * 简化设计：单阶段多通道解密
 * - 4个通道，每个通道用不同偏振方向编码一个字符
 * - 用户旋转检偏器，当角度匹配时字符显现
 * - 收集所有字符后自动解锁
 *
 * 物理原理：马吕斯定律 I = I₀ × cos²(θ)
 * 当检偏器角度与信号偏振方向一致时，透过率最大，字符清晰可见
 */

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {
  Unlock,
  RotateCcw,
  HelpCircle,
  Zap,
} from 'lucide-react'

// ==========================================
// 物理计算
// ==========================================
const toRad = (deg: number) => (deg * Math.PI) / 180
const normalize = (angle: number) => ((angle % 180) + 180) % 180
const malusIntensity = (targetAngle: number, currentAngle: number) => {
  const diff = toRad(currentAngle - targetAngle)
  return Math.cos(diff) ** 2
}

// ==========================================
// 通道配置
// ==========================================
interface Channel {
  id: string
  symbol: string
  targetAngle: number
  color: string
}

const CHANNELS: Channel[] = [
  { id: 'A', symbol: 'P', targetAngle: 0, color: '#ef4444' },    // 水平 - 红
  { id: 'B', symbol: 'O', targetAngle: 45, color: '#f59e0b' },   // 45° - 橙
  { id: 'C', symbol: 'L', targetAngle: 90, color: '#22c55e' },   // 垂直 - 绿
  { id: 'D', symbol: 'R', targetAngle: 135, color: '#3b82f6' },  // 135° - 蓝
]

const UNLOCK_THRESHOLD = 0.92 // cos²(15°) ≈ 0.93

// ==========================================
// 主组件
// ==========================================
export function PasswordLock({ onUnlock }: { onUnlock: () => void }) {
  const { i18n } = useTranslation()
  const isZh = i18n.language.startsWith('zh')

  const [analyzerAngle, setAnalyzerAngle] = useState(20)
  const [decodedChannels, setDecodedChannels] = useState<Set<string>>(new Set())
  const [isComplete, setIsComplete] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // 计算每个通道的可见度
  const channelVisibilities = useMemo(() => {
    return CHANNELS.map(ch => ({
      ...ch,
      visibility: malusIntensity(ch.targetAngle, analyzerAngle),
    }))
  }, [analyzerAngle])

  // 检测通道解锁
  useEffect(() => {
    channelVisibilities.forEach(ch => {
      if (ch.visibility >= UNLOCK_THRESHOLD && !decodedChannels.has(ch.id)) {
        setDecodedChannels(prev => new Set([...prev, ch.id]))
      }
    })
  }, [channelVisibilities, decodedChannels])

  // 检测完成
  useEffect(() => {
    if (decodedChannels.size === 4 && !isComplete) {
      setIsComplete(true)
      localStorage.setItem('polarcraft_unlocked', 'true')
      setTimeout(onUnlock, 2000)
    }
  }, [decodedChannels, isComplete, onUnlock])

  // 拖拽旋转
  const handleDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isComplete) return
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI + 90
    setAnalyzerAngle(normalize(angle))
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (isComplete) return
    e.preventDefault()
    setAnalyzerAngle(prev => normalize(prev + (e.deltaY > 0 ? 3 : -3)))
  }

  const handleReset = () => {
    setAnalyzerAngle(20)
    setDecodedChannels(new Set())
    setIsComplete(false)
  }

  const collectedSymbols = CHANNELS.filter(ch => decodedChannels.has(ch.id)).map(ch => ch.symbol).join('')

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* 背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-zinc-950 to-black" />

      {/* 标题 */}
      <div className="relative z-10 text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          {isZh ? '偏振密码锁' : 'Polarization Cipher'}
        </h1>
        <p className="text-sm text-gray-500">
          {isZh ? '旋转检偏器，扫描出隐藏的字符' : 'Rotate the analyzer to reveal hidden symbols'}
        </p>
      </div>

      {/* 主界面 */}
      <div className="relative z-10 flex items-center gap-8">
        {/* 光源 */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center mb-2">
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <span className="text-xs text-gray-500">{isZh ? '偏振光源' : 'Source'}</span>
        </div>

        {/* 光束 */}
        <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-cyan-500 rounded-full" />

        {/* 检偏器（可旋转） */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "relative w-32 h-32 rounded-full border-4 cursor-grab active:cursor-grabbing transition-colors",
              isComplete ? "border-emerald-500" : "border-cyan-500"
            )}
            style={{
              background: `conic-gradient(from ${analyzerAngle}deg, rgba(34,211,238,0.3), transparent 90deg, rgba(34,211,238,0.3) 180deg, transparent 270deg)`,
            }}
            onPointerDown={handleDrag}
            onPointerMove={(e) => e.buttons === 1 && handleDrag(e)}
            onWheel={handleWheel}
          >
            {/* 栅格线 */}
            <div
              className="absolute inset-4 flex items-center justify-center"
              style={{ transform: `rotate(${analyzerAngle}deg)` }}
            >
              {[-2, -1, 0, 1, 2].map(i => (
                <div
                  key={i}
                  className={cn(
                    "absolute w-full h-0.5 rounded-full",
                    isComplete ? "bg-emerald-400" : "bg-cyan-400"
                  )}
                  style={{
                    transform: `translateY(${i * 6}px)`,
                    opacity: i === 0 ? 1 : 0.4,
                  }}
                />
              ))}
            </div>
            {/* 角度显示 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn(
                "font-mono font-bold text-xl",
                isComplete ? "text-emerald-400" : "text-cyan-400"
              )}>
                {Math.round(normalize(analyzerAngle))}°
              </span>
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-2">{isZh ? '检偏器' : 'Analyzer'}</span>
        </div>

        {/* 光束 */}
        <div className="w-8 h-1 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />

        {/* 显示屏 */}
        <div className="w-48 h-32 bg-black/80 border-2 border-gray-700 rounded-lg p-3 flex flex-col">
          <div className="text-xs text-gray-600 mb-2">{isZh ? '解密通道' : 'CHANNELS'}</div>
          <div className="flex-1 grid grid-cols-4 gap-1">
            {channelVisibilities.map(ch => {
              const isDecoded = decodedChannels.has(ch.id)
              return (
                <div
                  key={ch.id}
                  className="flex flex-col items-center justify-center rounded"
                  style={{
                    background: isDecoded ? `${ch.color}20` : 'transparent',
                  }}
                >
                  <span
                    className="text-2xl font-black transition-all duration-200"
                    style={{
                      color: ch.color,
                      opacity: isDecoded ? 1 : ch.visibility,
                      filter: `blur(${isDecoded ? 0 : (1 - ch.visibility) * 8}px)`,
                    }}
                  >
                    {ch.symbol}
                  </span>
                  <span className="text-[10px] text-gray-600">{ch.targetAngle}°</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 马吕斯定律显示 */}
      <div className="relative z-10 mt-6 text-center">
        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800">
          <span className="text-xs text-gray-500">{isZh ? '马吕斯定律' : "Malus's Law"}:</span>
          <span className="font-mono text-cyan-400">I = I₀ × cos²(θ)</span>
        </div>
      </div>

      {/* 收集进度 */}
      <div className="relative z-10 mt-8">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">{isZh ? '已收集' : 'Collected'}:</span>
          <div className="flex gap-1">
            {CHANNELS.map((ch) => (
              <div
                key={ch.id}
                className={cn(
                  "w-10 h-10 rounded border-2 flex items-center justify-center font-mono font-bold text-lg transition-all",
                  decodedChannels.has(ch.id)
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                    : "border-gray-700 bg-gray-900 text-gray-600"
                )}
              >
                {decodedChannels.has(ch.id) ? ch.symbol : '?'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 帮助提示 */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="relative z-10 mt-6 max-w-md p-4 rounded-xl bg-indigo-900/30 border border-indigo-500/30"
          >
            <p className="text-sm text-gray-300 leading-relaxed">
              {isZh
                ? '每个字符用不同的偏振方向编码（0°、45°、90°、135°）。当检偏器角度与字符的偏振方向一致时，该字符会清晰显现。慢慢旋转检偏器，收集所有4个字符即可解锁。'
                : 'Each symbol is encoded with a different polarization angle (0°, 45°, 90°, 135°). When the analyzer angle matches the symbol\'s polarization, it becomes visible. Slowly rotate the analyzer to collect all 4 symbols.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 控制按钮 */}
      <div className="relative z-10 mt-6 flex items-center gap-4">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            showHelp ? "bg-indigo-500/20 text-indigo-400" : "hover:bg-gray-800 text-gray-500"
          )}
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 完成动画 */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Unlock className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isZh ? '解锁成功！' : 'UNLOCKED!'}
              </h2>
              <p className="text-emerald-400 font-mono text-lg tracking-widest mb-4">
                {collectedSymbols}
              </p>
              <p className="text-sm text-gray-500">
                {isZh ? '正在进入...' : 'Entering...'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PasswordLock
