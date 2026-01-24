/**
 * AmbientParticles - 首页背景环境粒子特效
 *
 * Design concept:
 * - 漂浮的光粒子创造氛围感
 * - 偏振色彩的微光粒子
 * - 缓慢、温和的动画避免分散注意力
 * - 支持暗/亮主题
 */

import { useMemo, useRef, useEffect, useState } from 'react'

interface AmbientParticlesProps {
  theme: 'dark' | 'light'
  /** 粒子数量 */
  count?: number
  /** 是否启用 */
  enabled?: boolean
}

interface Particle {
  id: number
  x: number // 百分比位置
  y: number
  size: number
  color: string
  duration: number // 动画周期
  delay: number // 动画延迟
  driftX: number // X方向漂移幅度
  driftY: number // Y方向漂移幅度
  opacity: number
}

// 偏振颜色
const POLARIZATION_COLORS = {
  deg0: { dark: 'rgba(255, 68, 68, 0.3)', light: 'rgba(239, 68, 68, 0.25)' },      // 红
  deg45: { dark: 'rgba(255, 170, 0, 0.3)', light: 'rgba(245, 158, 11, 0.25)' },    // 橙
  deg90: { dark: 'rgba(68, 255, 68, 0.3)', light: 'rgba(34, 197, 94, 0.25)' },     // 绿
  deg135: { dark: 'rgba(68, 136, 255, 0.3)', light: 'rgba(59, 130, 246, 0.25)' },  // 蓝
  cyan: { dark: 'rgba(34, 211, 238, 0.25)', light: 'rgba(6, 182, 212, 0.2)' },     // 青
  violet: { dark: 'rgba(139, 92, 246, 0.25)', light: 'rgba(124, 58, 237, 0.2)' }, // 紫
}

export function AmbientParticles({
  theme,
  count = 20,
  enabled = true
}: AmbientParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // 监听可见性以延迟加载动画
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // 生成粒子配置
  const particles = useMemo<Particle[]>(() => {
    const colorKeys = Object.keys(POLARIZATION_COLORS) as (keyof typeof POLARIZATION_COLORS)[]

    return Array.from({ length: count }, (_, i) => {
      const colorKey = colorKeys[i % colorKeys.length]
      const color = POLARIZATION_COLORS[colorKey][theme]

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        color,
        duration: 15 + Math.random() * 20, // 15-35秒周期，非常慢
        delay: Math.random() * 10, // 0-10秒延迟
        driftX: 10 + Math.random() * 30, // 漂移幅度
        driftY: 10 + Math.random() * 25,
        opacity: 0.15 + Math.random() * 0.25, // 低透明度
      }
    })
  }, [count, theme])

  if (!enabled || !isVisible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ opacity: 0.8 }}
    >
      {/* 背景光晕层 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34, 211, 238, 0.03) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(6, 182, 212, 0.02) 0%, transparent 50%)',
        }}
      />

      {/* 粒子层 */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease-out' }}
      >
        <defs>
          {/* 粒子发光滤镜 */}
          <filter id="ambient-particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {particles.map((p) => (
          <circle
            key={p.id}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={p.size}
            fill={p.color}
            filter="url(#ambient-particle-glow)"
            style={{
              opacity: p.opacity,
              animation: `
                ambient-float-${p.id % 4} ${p.duration}s ease-in-out ${p.delay}s infinite
              `,
            }}
          />
        ))}
      </svg>

      {/* 动画样式 - 4种不同的漂移模式 */}
      <style>{`
        @keyframes ambient-float-0 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: var(--particle-opacity, 0.2);
          }
          25% {
            transform: translate(20px, -15px) scale(1.1);
            opacity: calc(var(--particle-opacity, 0.2) * 1.3);
          }
          50% {
            transform: translate(10px, -30px) scale(0.95);
            opacity: var(--particle-opacity, 0.2);
          }
          75% {
            transform: translate(-15px, -10px) scale(1.05);
            opacity: calc(var(--particle-opacity, 0.2) * 0.8);
          }
        }

        @keyframes ambient-float-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: var(--particle-opacity, 0.2);
          }
          25% {
            transform: translate(-25px, 10px) scale(0.9);
            opacity: calc(var(--particle-opacity, 0.2) * 0.7);
          }
          50% {
            transform: translate(-10px, 25px) scale(1.15);
            opacity: calc(var(--particle-opacity, 0.2) * 1.2);
          }
          75% {
            transform: translate(15px, 5px) scale(1);
            opacity: var(--particle-opacity, 0.2);
          }
        }

        @keyframes ambient-float-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: var(--particle-opacity, 0.2);
          }
          33% {
            transform: translate(30px, 20px) scale(1.2);
            opacity: calc(var(--particle-opacity, 0.2) * 1.4);
          }
          66% {
            transform: translate(-20px, -25px) scale(0.85);
            opacity: calc(var(--particle-opacity, 0.2) * 0.6);
          }
        }

        @keyframes ambient-float-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: var(--particle-opacity, 0.2);
          }
          20% {
            transform: translate(-10px, -20px) scale(1.1);
            opacity: calc(var(--particle-opacity, 0.2) * 1.1);
          }
          40% {
            transform: translate(25px, -10px) scale(0.95);
            opacity: var(--particle-opacity, 0.2);
          }
          60% {
            transform: translate(15px, 30px) scale(1.05);
            opacity: calc(var(--particle-opacity, 0.2) * 1.3);
          }
          80% {
            transform: translate(-20px, 15px) scale(0.9);
            opacity: calc(var(--particle-opacity, 0.2) * 0.8);
          }
        }
      `}</style>

      {/* 装饰性光点连线 - 非常微弱 */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        style={{ opacity: isVisible ? 0.15 : 0, transition: 'opacity 2s ease-out' }}
      >
        <defs>
          <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme === 'dark' ? '#22d3ee' : '#06b6d4'} stopOpacity="0.1" />
            <stop offset="50%" stopColor={theme === 'dark' ? '#818cf8' : '#6366f1'} stopOpacity="0.05" />
            <stop offset="100%" stopColor={theme === 'dark' ? '#22d3ee' : '#06b6d4'} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* 几条微弱的连接线，创造光学实验的感觉 */}
        <path
          d="M 10% 20% Q 30% 15%, 50% 25% T 90% 30%"
          fill="none"
          stroke="url(#connection-gradient)"
          strokeWidth="1"
          opacity="0.3"
        />
        <path
          d="M 5% 60% Q 25% 70%, 50% 55% T 95% 65%"
          fill="none"
          stroke="url(#connection-gradient)"
          strokeWidth="1"
          opacity="0.2"
        />
        <path
          d="M 15% 85% Q 40% 90%, 60% 80% T 85% 85%"
          fill="none"
          stroke="url(#connection-gradient)"
          strokeWidth="1"
          opacity="0.25"
        />
      </svg>
    </div>
  )
}

export default AmbientParticles
