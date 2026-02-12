/**
 * WorldMap - 游戏化学习地图组件
 * 将学习路径转化为游戏世界地图
 *
 * 设计特点：
 * - 未解锁关卡显示为"迷雾"或"上锁的宝箱"
 * - 已完成关卡显示为"点亮的灯塔"或"获得的宝石"
 * - 使用 framer-motion 添加诱惑性动效
 * - 星星路径和进度动画
 */

import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb,
  Zap,
  Sparkles,
  Target,
  Telescope,
  BookOpen,
  ChevronRight,
} from 'lucide-react'

interface WorldNode {
  id: string
  unitNum: number
  titleKey: string
  subtitleKey: string
  mysteryQuestion?: { en: string; zh: string } // 核心谜题
  icon: React.ReactNode
  color: string
  demos: string[]
  prereqs: string[]
  status: 'available' | 'in-progress' | 'completed'
  progress: number
  // 地图位置（相对于 SVG 视口）
  x: number
  y: number
}

interface WorldMapProps {
  theme: 'dark' | 'light'
  completedDemos: string[]
  onNodeClick?: (nodeId: string) => void
  variant?: 'default' | 'compact'
}

// 单元定义 - 增加地图坐标和谜题问题
const WORLD_NODES: Omit<WorldNode, 'status' | 'progress'>[] = [
  {
    id: 'unit0',
    unitNum: 0,
    titleKey: 'course.units.basics.title',
    subtitleKey: 'course.units.basics.description',
    mysteryQuestion: {
      en: 'What makes light a wave?',
      zh: '光为什么是波？'
    },
    icon: <BookOpen className="w-5 h-5" />,
    color: '#10B981',
    demos: ['light-wave', 'polarization-intro', 'polarization-types', 'optical-bench'],
    prereqs: [],
    x: 200, y: 60,
  },
  {
    id: 'unit1',
    unitNum: 1,
    titleKey: 'course.units.unit1.title',
    subtitleKey: 'course.units.unit1.subtitle',
    mysteryQuestion: {
      en: 'Why does Iceland spar create double images?',
      zh: '为什么冰洲石能看到两个像？'
    },
    icon: <Lightbulb className="w-5 h-5" />,
    color: '#C9A227',
    demos: ['polarization-state', 'malus', 'birefringence', 'waveplate'],
    prereqs: ['unit0'],
    x: 200, y: 170,
  },
  {
    id: 'unit2',
    unitNum: 2,
    titleKey: 'course.units.unit2.title',
    subtitleKey: 'course.units.unit2.subtitle',
    mysteryQuestion: {
      en: 'Why do windows act like mirrors at an angle?',
      zh: '为什么斜着看玻璃会反光？'
    },
    icon: <Zap className="w-5 h-5" />,
    color: '#6366F1',
    demos: ['fresnel', 'brewster'],
    prereqs: ['unit1'],
    x: 80, y: 280,
  },
  {
    id: 'unit3',
    unitNum: 3,
    titleKey: 'course.units.unit3.title',
    subtitleKey: 'course.units.unit3.subtitle',
    mysteryQuestion: {
      en: 'Why does sugar water create rainbows?',
      zh: '为什么糖水能产生彩虹？'
    },
    icon: <Sparkles className="w-5 h-5" />,
    color: '#0891B2',
    demos: ['anisotropy', 'chromatic', 'optical-rotation'],
    prereqs: ['unit1'],
    x: 200, y: 280,
  },
  {
    id: 'unit4',
    unitNum: 4,
    titleKey: 'course.units.unit4.title',
    subtitleKey: 'course.units.unit4.subtitle',
    mysteryQuestion: {
      en: 'Why is the sky blue and sunset red?',
      zh: '天空为什么是蓝色的，日落为什么是红色的？'
    },
    icon: <Target className="w-5 h-5" />,
    color: '#F59E0B',
    demos: ['rayleigh', 'mie-scattering', 'monte-carlo-scattering'],
    prereqs: ['unit1'],
    x: 320, y: 280,
  },
  {
    id: 'unit5',
    unitNum: 5,
    titleKey: 'course.units.unit5.title',
    subtitleKey: 'course.units.unit5.subtitle',
    mysteryQuestion: {
      en: 'How can we see the invisible?',
      zh: '如何让不可见的变得可见？'
    },
    icon: <Telescope className="w-5 h-5" />,
    color: '#8B5CF6',
    demos: ['stokes', 'mueller', 'jones', 'calculator', 'polarimetric-microscopy'],
    prereqs: ['unit2', 'unit3', 'unit4'],
    x: 200, y: 390,
  },
]

// 节点间连接关系
const CONNECTIONS: { from: string; to: string }[] = [
  { from: 'unit0', to: 'unit1' },
  { from: 'unit1', to: 'unit2' },
  { from: 'unit1', to: 'unit3' },
  { from: 'unit1', to: 'unit4' },
  { from: 'unit2', to: 'unit5' },
  { from: 'unit3', to: 'unit5' },
  { from: 'unit4', to: 'unit5' },
]

// 浮动粒子组件
function FloatingParticles({ color, count = 5 }: { color: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={i}
          r="2"
          fill={color}
          opacity="0.6"
          animate={{
            cx: [0, Math.random() * 20 - 10, 0],
            cy: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </>
  )
}

// 节点组件 - 游戏化设计
function MapNode({
  node,
  theme,
  isHovered,
  onHover,
  onClick,
}: {
  node: WorldNode
  theme: 'dark' | 'light'
  isHovered: boolean
  onHover: (hovered: boolean) => void
  onClick: () => void
}) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'zh' ? 'zh' : 'en'
  const isClickable = true // All nodes are accessible for open exploration

  // 根据状态选择不同的视觉效果 - 所有节点默认可访问
  const nodeVisual = useMemo(() => {
    switch (node.status) {
      case 'available':
        // 可用：发光的入口
        return {
          bgColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          borderColor: node.color,
          iconColor: node.color,
          glowColor: `${node.color}40`,
          emoji: '🔮',
        }
      case 'in-progress':
        // 进行中：闪烁的信标
        return {
          bgColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          borderColor: node.color,
          iconColor: node.color,
          glowColor: `${node.color}60`,
          emoji: '⚡',
        }
      case 'completed':
        // 完成：点亮的灯塔/宝石
        return {
          bgColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          borderColor: '#22c55e',
          iconColor: '#22c55e',
          glowColor: '#22c55e40',
          emoji: '💎',
        }
    }
  }, [node.status, node.color, theme])

  return (
    <motion.g
      style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={isClickable ? onClick : undefined}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, delay: node.unitNum * 0.1 }}
    >
      {/* 发光效果 - 所有节点可见 */}
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={isHovered ? 50 : 40}
        fill={nodeVisual.glowColor}
        animate={
          node.status === 'in-progress'
            ? { r: [40, 50, 40], opacity: [0.3, 0.6, 0.3] }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 进度环 */}
      <circle
        cx={node.x}
        cy={node.y}
        r="32"
        fill="none"
        stroke={theme === 'dark' ? '#334155' : '#e2e8f0'}
        strokeWidth="4"
      />
      <motion.circle
        cx={node.x}
        cy={node.y}
        r="32"
        fill="none"
        stroke={nodeVisual.borderColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${(node.progress / 100) * 201} 201`}
        transform={`rotate(-90 ${node.x} ${node.y})`}
        initial={{ strokeDasharray: '0 201' }}
        animate={{ strokeDasharray: `${(node.progress / 100) * 201} 201` }}
        transition={{ duration: 1, delay: node.unitNum * 0.1 + 0.3 }}
      />

      {/* 节点主体 */}
      <motion.circle
        cx={node.x}
        cy={node.y}
        r="26"
        fill={nodeVisual.bgColor}
        stroke={nodeVisual.borderColor}
        strokeWidth="2"
        animate={isHovered && isClickable ? { scale: 1.1 } : { scale: 1 }}
      />

      {/* 节点图标/状态 */}
      <foreignObject
        x={node.x - 12}
        y={node.y - 12}
        width="24"
        height="24"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ color: nodeVisual.iconColor }}
        >
          {node.status === 'completed' ? (
            <motion.span
              className="text-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              💎
            </motion.span>
          ) : node.status === 'in-progress' ? (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {node.icon}
            </motion.span>
          ) : (
            node.icon
          )}
        </div>
      </foreignObject>

      {/* 浮动星星（完成状态） */}
      {node.status === 'completed' && (
        <g transform={`translate(${node.x}, ${node.y})`}>
          <FloatingParticles color={node.color} count={3} />
        </g>
      )}

      {/* 悬停提示框 */}
      <AnimatePresence>
        {isHovered && (
          <motion.g
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <rect
              x={node.x - 90}
              y={node.y + 40}
              width="180"
              height={node.mysteryQuestion ? 70 : 50}
              rx="8"
              fill={theme === 'dark' ? '#1e293b' : '#ffffff'}
              stroke={node.color}
              strokeWidth="1"
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
            />
            {/* 箭头 */}
            <polygon
              points={`${node.x - 8},${node.y + 40} ${node.x + 8},${node.y + 40} ${node.x},${node.y + 32}`}
              fill={theme === 'dark' ? '#1e293b' : '#ffffff'}
              stroke={node.color}
              strokeWidth="1"
            />
            {/* 单元标题 */}
            <text
              x={node.x}
              y={node.y + 58}
              textAnchor="middle"
              fill={theme === 'dark' ? '#f8fafc' : '#1e293b'}
              fontSize="11"
              fontWeight="bold"
            >
              {node.unitNum === 0 ? t('course.units.basics.title') : `${t('course.unit')} ${node.unitNum}`}
            </text>
            {/* 谜题问题 */}
            {node.mysteryQuestion && (
              <text
                x={node.x}
                y={node.y + 75}
                textAnchor="middle"
                fill={node.color}
                fontSize="9"
              >
                {node.mysteryQuestion[lang].slice(0, 25)}
                {node.mysteryQuestion[lang].length > 25 ? '...' : ''}
              </text>
            )}
            {/* 进度 */}
            <text
              x={node.x}
              y={node.y + (node.mysteryQuestion ? 92 : 75)}
              textAnchor="middle"
              fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
              fontSize="10"
            >
              {node.status === 'completed'
                ? `✓ ${t('course.path.completed')}`
                : node.status === 'in-progress'
                  ? `${node.progress}% ${t('course.path.inProgress')}`
                  : t('course.worldMap.available')
              }
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </motion.g>
  )
}

export function WorldMap({
  theme,
  completedDemos,
  onNodeClick,
  variant = 'default',
}: WorldMapProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const isCompact = variant === 'compact'

  // 计算每个节点的状态和进度 - 所有节点默认可访问
  const nodesWithProgress = useMemo(() => {
    return WORLD_NODES.map(node => {
      const completedInUnit = node.demos.filter(d => completedDemos.includes(d)).length
      const progress = node.demos.length > 0
        ? Math.round((completedInUnit / node.demos.length) * 100)
        : 0

      // 所有节点默认可访问，不再有锁定状态
      let status: WorldNode['status'] = 'available'
      if (progress === 100) {
        status = 'completed'
      } else if (progress > 0) {
        status = 'in-progress'
      }

      return { ...node, status, progress } as WorldNode
    })
  }, [completedDemos])

  // 处理节点点击 - 所有节点可点击
  const handleNodeClick = (nodeId: string) => {
    const node = nodesWithProgress.find(n => n.id === nodeId)
    if (node) {
      if (onNodeClick) {
        onNodeClick(nodeId)
      } else {
        navigate({ to: `/demos/${node.demos[0]}` as string })
      }
    }
  }

  // 渲染连接线 - 所有连接线默认可见
  const renderConnections = () => {
    return CONNECTIONS.map(conn => {
      const fromNode = nodesWithProgress.find(n => n.id === conn.from)
      const toNode = nodesWithProgress.find(n => n.id === conn.to)
      if (!fromNode || !toNode) return null

      const isCompleted = fromNode.status === 'completed' && toNode.status === 'completed'

      // 计算贝塞尔曲线控制点
      const midX = (fromNode.x + toNode.x) / 2
      const midY = (fromNode.y + toNode.y) / 2

      return (
        <motion.path
          key={`${conn.from}-${conn.to}`}
          d={`M ${fromNode.x} ${fromNode.y + 32}
              Q ${midX} ${midY}
              ${toNode.x} ${toNode.y - 32}`}
          fill="none"
          stroke={isCompleted ? '#22c55e' : toNode.color}
          strokeWidth={isCompact ? 2 : 3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      )
    })
  }

  return (
    <div className={`rounded-2xl ${isCompact ? 'p-4' : 'p-6'} ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className={`${isCompact ? 'text-sm' : 'text-lg'} font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('course.worldMap.title')}
          </h3>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'
          }`}>
            {t('course.worldMap.badge')}
          </span>
        </div>
        <Link
          to="/demos"
          className={`text-xs flex items-center gap-0.5 ${
            theme === 'dark' ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'
          }`}
        >
          {t('course.path.viewAll')}
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 地图主体 - 压缩版本使用更小的视口 */}
      <div className={`overflow-x-auto ${isCompact ? 'max-h-[280px]' : ''}`}>
        <svg
          viewBox="0 0 400 460"
          className={`w-full ${isCompact ? 'max-w-xs' : 'max-w-lg'} mx-auto`}
          style={{ minWidth: isCompact ? '200px' : '300px' }}
        >
          {/* 背景装饰 */}
          <defs>
            <linearGradient id="mapBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme === 'dark' ? '#0f172a' : '#f8fafc'} stopOpacity="0.5" />
              <stop offset="100%" stopColor={theme === 'dark' ? '#1e293b' : '#e2e8f0'} stopOpacity="0.3" />
            </linearGradient>
            {/* 星星图案 */}
            <pattern id="stars" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill={theme === 'dark' ? '#475569' : '#cbd5e1'} opacity="0.5" />
              <circle cx="30" cy="25" r="0.5" fill={theme === 'dark' ? '#475569' : '#cbd5e1'} opacity="0.3" />
              <circle cx="20" cy="35" r="0.8" fill={theme === 'dark' ? '#475569' : '#cbd5e1'} opacity="0.4" />
            </pattern>
          </defs>

          <rect x="0" y="0" width="400" height="460" fill="url(#mapBg)" />
          <rect x="0" y="0" width="400" height="460" fill="url(#stars)" />

          {/* 连接线 */}
          <g>{renderConnections()}</g>

          {/* 节点 */}
          {nodesWithProgress.map(node => (
            <MapNode
              key={node.id}
              node={node}
              theme={theme}
              isHovered={hoveredNode === node.id}
              onHover={(hovered) => setHoveredNode(hovered ? node.id : null)}
              onClick={() => handleNodeClick(node.id)}
            />
          ))}
        </svg>
      </div>

      {/* 图例 - 压缩版本使用更紧凑的布局 */}
      <div className={`${isCompact ? 'mt-2' : 'mt-4'} flex flex-wrap justify-center gap-3 text-[10px] ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <div className="flex items-center gap-1">
          <span className={isCompact ? 'text-xs' : 'text-base'}>💎</span>
          <span>{t('course.path.completed')}</span>
        </div>
        <div className="flex items-center gap-1">
          <motion.span
            className={isCompact ? 'text-xs' : ''}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⚡
          </motion.span>
          <span>{t('course.path.inProgress')}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={isCompact ? 'text-xs' : ''}>🔮</span>
          <span>{t('course.worldMap.available')}</span>
        </div>
      </div>
    </div>
  )
}

export default WorldMap
