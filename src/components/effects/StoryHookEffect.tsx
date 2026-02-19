/**
 * StoryHookEffect - 1669年历史故事的优雅展示组件
 *
 * Design concept:
 * - 打字机效果逐字展现历史叙述
 * - 冰岛晶石的视觉元素和光分裂动画
 * - 漂浮的晶体粒子创造氛围感
 * - 微妙的光晕和闪烁效果
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface StoryHookEffectProps {
  theme: 'dark' | 'light'
  className?: string
}

// 冰岛晶石（方解石）组件
function CalciteCrystal({ theme, isAnimating }: { theme: 'dark' | 'light'; isAnimating: boolean }) {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      className={`transition-all duration-1000 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
    >
      <defs>
        <linearGradient id="crystal-face-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme === 'dark' ? '#a5f3fc' : '#67e8f9'} stopOpacity="0.6" />
          <stop offset="100%" stopColor={theme === 'dark' ? '#22d3ee' : '#06b6d4'} stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="crystal-face-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme === 'dark' ? '#c4b5fd' : '#a78bfa'} stopOpacity="0.5" />
          <stop offset="100%" stopColor={theme === 'dark' ? '#818cf8' : '#6366f1'} stopOpacity="0.2" />
        </linearGradient>
        <filter id="crystal-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 菱形晶体主体 - 方解石的典型形状 */}
      <g filter="url(#crystal-glow)">
        {/* 顶面 */}
        <path
          d="M30 8 L48 20 L30 32 L12 20 Z"
          fill="url(#crystal-face-1)"
          stroke={theme === 'dark' ? '#67e8f9' : '#22d3ee'}
          strokeWidth="1"
          opacity="0.8"
        />
        {/* 右侧面 */}
        <path
          d="M48 20 L48 40 L30 52 L30 32 Z"
          fill="url(#crystal-face-2)"
          stroke={theme === 'dark' ? '#a78bfa' : '#818cf8'}
          strokeWidth="1"
          opacity="0.7"
        />
        {/* 左侧面 */}
        <path
          d="M12 20 L12 40 L30 52 L30 32 Z"
          fill="url(#crystal-face-1)"
          stroke={theme === 'dark' ? '#67e8f9' : '#22d3ee'}
          strokeWidth="1"
          opacity="0.6"
        />
      </g>

      {/* 内部折射线条 */}
      <g opacity="0.4">
        <line x1="30" y1="20" x2="30" y2="42" stroke={theme === 'dark' ? '#fff' : '#0e7490'} strokeWidth="0.5" />
        <line x1="20" y1="26" x2="40" y2="26" stroke={theme === 'dark' ? '#fff' : '#0e7490'} strokeWidth="0.5" />
      </g>

      {/* 晶体内的光点 */}
      <circle cx="30" cy="25" r="3" fill={theme === 'dark' ? '#fff' : '#22d3ee'} opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

// 光束分裂动画组件
function LightSplitAnimation({ theme, isActive }: { theme: 'dark' | 'light'; isActive: boolean }) {
  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 120 40"
      className={`transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
    >
      <defs>
        <linearGradient id="incoming-light" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={theme === 'dark' ? '#fef3c7' : '#fde68a'} stopOpacity="0" />
          <stop offset="50%" stopColor={theme === 'dark' ? '#fbbf24' : '#f59e0b'} stopOpacity="0.8" />
          <stop offset="100%" stopColor={theme === 'dark' ? '#fbbf24' : '#f59e0b'} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="o-ray" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={theme === 'dark' ? '#fbbf24' : '#f59e0b'} stopOpacity="0.6" />
          <stop offset="100%" stopColor={theme === 'dark' ? '#fbbf24' : '#f59e0b'} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="e-ray" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={theme === 'dark' ? '#c084fc' : '#a855f7'} stopOpacity="0.6" />
          <stop offset="100%" stopColor={theme === 'dark' ? '#c084fc' : '#a855f7'} stopOpacity="0" />
        </linearGradient>
        <filter id="light-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 入射光束 */}
      <line
        x1="0"
        y1="20"
        x2="45"
        y2="20"
        stroke="url(#incoming-light)"
        strokeWidth="3"
        filter="url(#light-glow)"
        strokeLinecap="round"
      >
        <animate attributeName="x2" values="0;45" dur="0.8s" fill="freeze" />
      </line>

      {/* o光（寻常光）- 直线传播 */}
      <line
        x1="45"
        y1="20"
        x2="120"
        y2="20"
        stroke="url(#o-ray)"
        strokeWidth="2.5"
        filter="url(#light-glow)"
        strokeLinecap="round"
        className={isActive ? 'animate-pulse' : ''}
      >
        <animate attributeName="x2" values="45;120" dur="0.6s" begin="0.8s" fill="freeze" />
      </line>

      {/* e光（非寻常光）- 偏折传播 */}
      <line
        x1="45"
        y1="20"
        x2="120"
        y2="8"
        stroke="url(#e-ray)"
        strokeWidth="2.5"
        filter="url(#light-glow)"
        strokeLinecap="round"
        className={isActive ? 'animate-pulse' : ''}
      >
        <animate attributeName="x2" values="45;120" dur="0.6s" begin="0.8s" fill="freeze" />
        <animate attributeName="y2" values="20;8" dur="0.6s" begin="0.8s" fill="freeze" />
      </line>

      {/* 分裂点光晕 */}
      <circle cx="45" cy="20" r="4" fill={theme === 'dark' ? '#fbbf24' : '#f59e0b'} opacity="0.5">
        <animate attributeName="r" values="2;5;2" dur="1.5s" repeatCount="indefinite" begin="0.8s" />
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" begin="0.8s" />
      </circle>
    </svg>
  )
}

// 漂浮粒子组件
function FloatingParticles({ theme, count = 8 }: { theme: 'dark' | 'light'; count?: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    })), [count]
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: theme === 'dark' ? 'rgba(34, 211, 238, 0.4)' : 'rgba(6, 182, 212, 0.3)',
            boxShadow: theme === 'dark'
              ? '0 0 6px rgba(34, 211, 238, 0.6)'
              : '0 0 4px rgba(6, 182, 212, 0.4)',
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
          25% { transform: translateY(-10px) translateX(5px) scale(1.1); opacity: 0.6; }
          50% { transform: translateY(-5px) translateX(-3px) scale(0.9); opacity: 0.4; }
          75% { transform: translateY(-15px) translateX(8px) scale(1.05); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

// 打字机效果 Hook
function useTypewriter(text: string, speed: number = 50, startDelay: number = 500) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)

    const startTimeout = setTimeout(() => {
      let currentIndex = 0

      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(interval)
          setIsComplete(true)
        }
      }, speed)

      return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(startTimeout)
  }, [text, speed, startDelay])

  return { displayedText, isComplete }
}

export function StoryHookEffect({ theme, className = '' }: StoryHookEffectProps) {
  const { i18n } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // 根据语言获取故事文本的各个部分
  const isZh = i18n.language === 'zh'

  // 分段文本便于动画控制
  const storyParts = isZh ? {
    year: '1669年',
    location: '丹麦',
    action: '一块来自冰岛的透明晶体将一束光一分为二',
    revelation: '光的隐藏维度首次显现——偏振',
    timeGap: '三百多年后的今天',
    conclusion: '我们把这个传奇放在你手中',
  } : {
    year: '1669',
    location: 'Denmark',
    action: 'A transparent crystal from Iceland split a beam of light in two',
    revelation: "revealing light's hidden dimension for the first time — polarization",
    timeGap: 'Three hundred years later',
    conclusion: 'we put this legend in your hands',
  }

  // 组合完整文本
  const fullStoryText = isZh
    ? `${storyParts.year}，${storyParts.location}。${storyParts.action}，${storyParts.revelation}。${storyParts.timeGap}，${storyParts.conclusion}。`
    : `${storyParts.year}, ${storyParts.location}. ${storyParts.action}, ${storyParts.revelation}. ${storyParts.timeGap}, ${storyParts.conclusion}.`

  // 打字机效果
  const { displayedText, isComplete } = useTypewriter(fullStoryText, 40, 800)

  // 监听可见性
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // 高亮关键词
  const highlightText = (text: string) => {
    const keywords = isZh
      ? ['1669年', '冰岛', '一分为二', '偏振', '传奇']
      : ['1669', 'Iceland', 'split', 'polarization', 'legend']

    let result = text
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi')
      result = result.replace(
        regex,
        `<span class="text-transparent bg-clip-text bg-gradient-to-r ${
          theme === 'dark'
            ? 'from-cyan-400 to-blue-400'
            : 'from-cyan-600 to-blue-600'
        } font-medium">$1</span>`
      )
    })
    return result
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 背景装饰 */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.05) 0%, rgba(129, 140, 248, 0.05) 50%, rgba(34, 211, 238, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(99, 102, 241, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%)',
        }}
      />

      {/* 漂浮粒子 */}
      {isVisible && <FloatingParticles theme={theme} count={6} />}

      {/* 主内容区 */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* 顶部装饰：晶体和光分裂动画 */}
        <div
          className={`flex items-center justify-center gap-4 mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <CalciteCrystal theme={theme} isAnimating={isVisible} />
          <LightSplitAnimation theme={theme} isActive={isVisible} />
        </div>

        {/* 故事文本 - 打字机效果 */}
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p
            className={`text-sm sm:text-base leading-relaxed italic ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
            dangerouslySetInnerHTML={{
              __html: highlightText(displayedText) + (isComplete ? '' : '<span class="animate-pulse">|</span>')
            }}
          />
        </div>

        {/* 底部装饰线 */}
        <div
          className={`mt-6 flex items-center justify-center gap-3 transition-all duration-1000 delay-500 ${
            isComplete ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`h-px w-16 bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-transparent via-cyan-500/50 to-transparent'
                : 'from-transparent via-cyan-600/40 to-transparent'
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full ${
              theme === 'dark' ? 'bg-cyan-400/60' : 'bg-cyan-600/50'
            }`}
            style={{
              boxShadow: theme === 'dark'
                ? '0 0 8px rgba(34, 211, 238, 0.5)'
                : '0 0 6px rgba(6, 182, 212, 0.4)',
            }}
          />
          <div
            className={`h-px w-16 bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-transparent via-violet-500/50 to-transparent'
                : 'from-transparent via-violet-600/40 to-transparent'
            }`}
          />
        </div>

        {/* 悬停时显示的额外信息 */}
        <div
          className={`mt-4 text-center transition-all duration-500 ${
            isHovered && isComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span
            className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}
          >
            {isZh ? '—— 埃拉斯谟·巴托林发现双折射现象' : '—— Erasmus Bartholin discovers birefringence'}
          </span>
        </div>
      </div>

      {/* 边框光晕效果 */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-700 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          boxShadow: theme === 'dark'
            ? 'inset 0 0 20px rgba(34, 211, 238, 0.1), 0 0 30px rgba(34, 211, 238, 0.05)'
            : 'inset 0 0 15px rgba(6, 182, 212, 0.08), 0 0 20px rgba(6, 182, 212, 0.03)',
        }}
      />
    </div>
  )
}

export default StoryHookEffect
