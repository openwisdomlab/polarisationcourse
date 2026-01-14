/**
 * PuzzleGate - 偏振光密码锁组件
 *
 * 用户需要旋转两个偏振片到正确角度（45° + 90°）才能显示隐藏密码 "POLAR"
 * 然后输入密码才能进入网站
 *
 * 验证通过后存储到 localStorage，30天内不需要重新验证
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Lock, Unlock, RotateCcw, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'

// 配置常量
const CORRECT_ANGLE_1 = 45  // 第一个偏振片正确角度
const CORRECT_ANGLE_2 = 90  // 第二个偏振片正确角度
const ANGLE_TOLERANCE = 3   // 角度容差（±3°）
const SECRET_PASSWORD = 'POLAR'
const STORAGE_KEY = 'polarcraft_access'
const EXPIRY_DAYS = 30

interface PuzzleGateProps {
  onAccessGranted: () => void
}

// 检查访问权限
export function checkAccess(): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return false
    const { verified, expiry } = JSON.parse(data)
    if (expiry && Date.now() > expiry) {
      localStorage.removeItem(STORAGE_KEY)
      return false
    }
    return verified === true
  } catch {
    return false
  }
}

// 保存访问权限
function saveAccess(): void {
  const expiry = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    verified: true,
    timestamp: Date.now(),
    expiry
  }))
}

export function PuzzleGate({ onAccessGranted }: PuzzleGateProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  // 偏振片角度状态
  const [angle1, setAngle1] = useState(0)
  const [angle2, setAngle2] = useState(0)

  // 密码输入状态
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  // 计算是否角度正确（显示密码）
  const isAngleCorrect = useMemo(() => {
    const diff1 = Math.abs(angle1 - CORRECT_ANGLE_1)
    const diff2 = Math.abs(angle2 - CORRECT_ANGLE_2)
    return diff1 <= ANGLE_TOLERANCE && diff2 <= ANGLE_TOLERANCE
  }, [angle1, angle2])

  // 计算透过率（用于视觉效果）
  const transmission = useMemo(() => {
    // 简化的马吕斯定律计算
    const angleDiff = Math.abs(angle2 - angle1)
    const radians = (angleDiff * Math.PI) / 180
    return Math.pow(Math.cos(radians), 2) * 100
  }, [angle1, angle2])

  // 显示的密码字符（根据角度正确程度显示）
  const revealedPassword = useMemo(() => {
    if (!isAngleCorrect) {
      // 随机乱码
      const chars = '█▓▒░◈◇◆●○☆★▲△▼▽'
      return Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
    }
    return SECRET_PASSWORD
  }, [isAngleCorrect])

  // 处理密码提交
  const handleSubmit = useCallback(() => {
    if (password.toUpperCase() === SECRET_PASSWORD) {
      setUnlocked(true)
      saveAccess()
      setTimeout(() => {
        onAccessGranted()
      }, 1500)
    } else {
      setError(true)
      setTimeout(() => setError(false), 1000)
    }
  }, [password, onAccessGranted])

  // 重置谜题
  const handleReset = () => {
    setAngle1(0)
    setAngle2(0)
    setPassword('')
    setError(false)
  }

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && password.length > 0) {
        handleSubmit()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [password, handleSubmit])

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center p-4',
      'bg-gradient-to-br',
      theme === 'dark'
        ? 'from-slate-950 via-slate-900 to-slate-950'
        : 'from-slate-100 via-white to-slate-100'
    )}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          'absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20',
          theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'
        )} />
        <div className={cn(
          'absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20',
          theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'
        )} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'relative max-w-lg w-full rounded-3xl p-8 shadow-2xl border',
          theme === 'dark'
            ? 'bg-slate-900/90 border-slate-700 backdrop-blur-xl'
            : 'bg-white/90 border-gray-200 backdrop-blur-xl'
        )}
      >
        {/* 标题 */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: unlocked ? 0 : [0, -5, 5, 0] }}
            transition={{ duration: 0.5, repeat: unlocked ? 0 : Infinity, repeatDelay: 3 }}
            className={cn(
              'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4',
              unlocked
                ? 'bg-green-500/20 text-green-500'
                : theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-cyan-500/20 text-cyan-600'
            )}
          >
            {unlocked ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </motion.div>

          <h1 className={cn(
            'text-2xl font-bold mb-2',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '偏振光密码锁' : 'Polarization Lock'}
          </h1>

          <p className={cn(
            'text-sm',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '调整偏振片角度，解开隐藏的密码'
              : 'Adjust the polarizers to reveal the hidden password'}
          </p>
        </div>

        {/* 偏振片可视化区域 */}
        <div className={cn(
          'relative rounded-2xl p-6 mb-6 border',
          theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700'
            : 'bg-gray-50 border-gray-200'
        )}>
          {/* 光路示意 */}
          <div className="flex items-center justify-between mb-6">
            {/* 光源 */}
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                'bg-yellow-500/20 text-yellow-500'
              )}>
                <Sparkles className="w-5 h-5" />
              </div>
              <span className={cn(
                'text-xs mt-1',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                {isZh ? '光源' : 'Light'}
              </span>
            </div>

            {/* 偏振片1 */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: angle1 }}
                className={cn(
                  'w-12 h-12 rounded-lg border-2 flex items-center justify-center',
                  'bg-gradient-to-br',
                  Math.abs(angle1 - CORRECT_ANGLE_1) <= ANGLE_TOLERANCE
                    ? 'from-green-500/30 to-green-500/10 border-green-500'
                    : theme === 'dark'
                      ? 'from-cyan-500/30 to-cyan-500/10 border-cyan-500'
                      : 'from-cyan-500/30 to-cyan-500/10 border-cyan-500'
                )}
              >
                <div className="w-8 h-0.5 bg-current rounded-full" />
              </motion.div>
              <span className={cn(
                'text-xs mt-1 font-mono',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                P₁
              </span>
            </div>

            {/* 光束 */}
            <motion.div
              className="flex-1 mx-2 h-1 rounded-full"
              style={{
                background: `linear-gradient(90deg,
                  ${theme === 'dark' ? 'rgba(34,211,238,0.8)' : 'rgba(6,182,212,0.8)'} 0%,
                  ${theme === 'dark' ? `rgba(34,211,238,${transmission/100})` : `rgba(6,182,212,${transmission/100})`} 100%)`
              }}
            />

            {/* 偏振片2 */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: angle2 }}
                className={cn(
                  'w-12 h-12 rounded-lg border-2 flex items-center justify-center',
                  'bg-gradient-to-br',
                  Math.abs(angle2 - CORRECT_ANGLE_2) <= ANGLE_TOLERANCE
                    ? 'from-green-500/30 to-green-500/10 border-green-500'
                    : theme === 'dark'
                      ? 'from-purple-500/30 to-purple-500/10 border-purple-500'
                      : 'from-purple-500/30 to-purple-500/10 border-purple-500'
                )}
              >
                <div className="w-8 h-0.5 bg-current rounded-full" />
              </motion.div>
              <span className={cn(
                'text-xs mt-1 font-mono',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                P₂
              </span>
            </div>

            {/* 屏幕/密码显示 */}
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                isAngleCorrect
                  ? 'bg-green-500/20 text-green-500'
                  : theme === 'dark'
                    ? 'bg-slate-700 text-gray-500'
                    : 'bg-gray-200 text-gray-400'
              )}>
                {isAngleCorrect ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </div>
              <span className={cn(
                'text-xs mt-1',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                {isZh ? '屏幕' : 'Screen'}
              </span>
            </div>
          </div>

          {/* 密码显示区 */}
          <div className={cn(
            'text-center py-4 rounded-xl mb-6 border-2 border-dashed transition-all duration-500',
            isAngleCorrect
              ? 'border-green-500/50 bg-green-500/10'
              : theme === 'dark'
                ? 'border-slate-600 bg-slate-800/50'
                : 'border-gray-300 bg-gray-100'
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isAngleCorrect ? 'revealed' : 'hidden'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'text-3xl font-mono font-bold tracking-[0.5em] pl-[0.5em]',
                  isAngleCorrect
                    ? 'text-green-500'
                    : theme === 'dark'
                      ? 'text-slate-600'
                      : 'text-gray-300'
                )}
              >
                {revealedPassword}
              </motion.div>
            </AnimatePresence>
            <p className={cn(
              'text-xs mt-2',
              isAngleCorrect
                ? 'text-green-500/70'
                : theme === 'dark'
                  ? 'text-gray-600'
                  : 'text-gray-400'
            )}>
              {isAngleCorrect
                ? (isZh ? '密码已显现！' : 'Password revealed!')
                : (isZh ? '调整角度以显示密码' : 'Adjust angles to reveal')}
            </p>
          </div>

          {/* 偏振片控制滑块 */}
          <div className="space-y-4">
            {/* 偏振片1 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={cn(
                  'text-sm font-medium',
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {isZh ? '偏振片 1' : 'Polarizer 1'} (P₁)
                </label>
                <span className={cn(
                  'text-sm font-mono px-2 py-0.5 rounded',
                  Math.abs(angle1 - CORRECT_ANGLE_1) <= ANGLE_TOLERANCE
                    ? 'bg-green-500/20 text-green-500'
                    : theme === 'dark'
                      ? 'bg-slate-700 text-cyan-400'
                      : 'bg-gray-100 text-cyan-600'
                )}>
                  {angle1}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={angle1}
                onChange={(e) => setAngle1(Number(e.target.value))}
                className={cn(
                  'w-full h-2 rounded-full appearance-none cursor-pointer',
                  'bg-gradient-to-r from-cyan-500/30 to-cyan-500/60',
                  '[&::-webkit-slider-thumb]:appearance-none',
                  '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
                  '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500',
                  '[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer',
                  '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110'
                )}
              />
            </div>

            {/* 偏振片2 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={cn(
                  'text-sm font-medium',
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {isZh ? '偏振片 2' : 'Polarizer 2'} (P₂)
                </label>
                <span className={cn(
                  'text-sm font-mono px-2 py-0.5 rounded',
                  Math.abs(angle2 - CORRECT_ANGLE_2) <= ANGLE_TOLERANCE
                    ? 'bg-green-500/20 text-green-500'
                    : theme === 'dark'
                      ? 'bg-slate-700 text-purple-400'
                      : 'bg-gray-100 text-purple-600'
                )}>
                  {angle2}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={angle2}
                onChange={(e) => setAngle2(Number(e.target.value))}
                className={cn(
                  'w-full h-2 rounded-full appearance-none cursor-pointer',
                  'bg-gradient-to-r from-purple-500/30 to-purple-500/60',
                  '[&::-webkit-slider-thumb]:appearance-none',
                  '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
                  '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500',
                  '[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer',
                  '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110'
                )}
              />
            </div>
          </div>

          {/* 透过率显示 */}
          <div className={cn(
            'mt-4 text-center text-xs',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            {isZh ? '透过率' : 'Transmission'}: {transmission.toFixed(1)}%
            <span className="mx-2">|</span>
            I = I₀ × cos²({Math.abs(angle2 - angle1)}°)
          </div>
        </div>

        {/* 密码输入区 */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
              placeholder={isZh ? '输入密码...' : 'Enter password...'}
              maxLength={10}
              disabled={unlocked}
              className={cn(
                'w-full px-4 py-3 rounded-xl text-center text-lg font-mono tracking-widest',
                'border-2 transition-all duration-200 outline-none',
                error
                  ? 'border-red-500 bg-red-500/10 animate-shake'
                  : unlocked
                    ? 'border-green-500 bg-green-500/10 text-green-500'
                    : theme === 'dark'
                      ? 'border-slate-600 bg-slate-800 text-white focus:border-cyan-500'
                      : 'border-gray-300 bg-white text-gray-900 focus:border-cyan-500'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded',
                theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={unlocked}
              className={cn(
                'flex-none px-4 py-3 rounded-xl border-2 transition-all duration-200',
                'flex items-center justify-center gap-2',
                theme === 'dark'
                  ? 'border-slate-600 text-gray-400 hover:border-slate-500 hover:text-gray-300'
                  : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700',
                unlocked && 'opacity-50 cursor-not-allowed'
              )}
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleSubmit}
              disabled={password.length === 0 || unlocked}
              className={cn(
                'flex-1 py-3 rounded-xl font-medium transition-all duration-200',
                'flex items-center justify-center gap-2',
                unlocked
                  ? 'bg-green-500 text-white'
                  : password.length === 0
                    ? theme === 'dark'
                      ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90'
              )}
            >
              {unlocked ? (
                <>
                  <Unlock className="w-5 h-5" />
                  {isZh ? '验证成功！' : 'Access Granted!'}
                </>
              ) : (
                <>
                  {isZh ? '进入' : 'Enter'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* 提示文字 */}
        <p className={cn(
          'text-center text-xs mt-6',
          theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
        )}>
          {isZh
            ? '提示：调整两个偏振片到正确角度，密码就会显现'
            : 'Hint: Adjust both polarizers to the correct angles to reveal the password'}
        </p>
      </motion.div>

      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default PuzzleGate
