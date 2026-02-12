/**
 * LearningPathMap - 学习路径可视化组件
 * Visual learning path map showing unit connections and progress
 */

import React, { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Lightbulb,
  Zap,
  Sparkles,
  Target,
  Telescope,
  BookOpen,
  CheckCircle,
  Lock,
  ChevronRight,
} from 'lucide-react'

interface UnitNode {
  id: string
  unitNum: number
  titleKey: string
  subtitleKey: string
  icon: React.ReactNode
  color: string
  demos: string[]
  prereqs: string[] // 前置单元
  status: 'locked' | 'available' | 'in-progress' | 'completed'
  progress: number // 0-100
}

interface LearningPathMapProps {
  theme: 'dark' | 'light'
  completedDemos: string[]
  onUnitClick?: (unitId: string) => void
}

// 单元定义
const UNITS: Omit<UnitNode, 'status' | 'progress'>[] = [
  {
    id: 'unit0',
    unitNum: 0,
    titleKey: 'course.units.basics.title',
    subtitleKey: 'course.units.basics.description',
    icon: <BookOpen className="w-5 h-5" />,
    color: '#10B981', // emerald
    demos: ['light-wave', 'polarization-intro', 'polarization-types', 'optical-bench'],
    prereqs: [],
  },
  {
    id: 'unit1',
    unitNum: 1,
    titleKey: 'course.units.unit1.title',
    subtitleKey: 'course.units.unit1.subtitle',
    icon: <Lightbulb className="w-5 h-5" />,
    color: '#C9A227', // amber
    demos: ['polarization-state', 'malus', 'birefringence', 'waveplate'],
    prereqs: ['unit0'],
  },
  {
    id: 'unit2',
    unitNum: 2,
    titleKey: 'course.units.unit2.title',
    subtitleKey: 'course.units.unit2.subtitle',
    icon: <Zap className="w-5 h-5" />,
    color: '#6366F1', // indigo
    demos: ['fresnel', 'brewster'],
    prereqs: ['unit1'],
  },
  {
    id: 'unit3',
    unitNum: 3,
    titleKey: 'course.units.unit3.title',
    subtitleKey: 'course.units.unit3.subtitle',
    icon: <Sparkles className="w-5 h-5" />,
    color: '#0891B2', // cyan
    demos: ['anisotropy', 'chromatic', 'optical-rotation'],
    prereqs: ['unit1'],
  },
  {
    id: 'unit4',
    unitNum: 4,
    titleKey: 'course.units.unit4.title',
    subtitleKey: 'course.units.unit4.subtitle',
    icon: <Target className="w-5 h-5" />,
    color: '#F59E0B', // orange
    demos: ['rayleigh', 'mie-scattering', 'monte-carlo-scattering'],
    prereqs: ['unit1'],
  },
  {
    id: 'unit5',
    unitNum: 5,
    titleKey: 'course.units.unit5.title',
    subtitleKey: 'course.units.unit5.subtitle',
    icon: <Telescope className="w-5 h-5" />,
    color: '#8B5CF6', // violet
    demos: ['stokes', 'mueller', 'jones', 'calculator', 'polarimetric-microscopy'],
    prereqs: ['unit2', 'unit3', 'unit4'],
  },
]

export function LearningPathMap({ theme, completedDemos, onUnitClick }: LearningPathMapProps) {
  const { t } = useTranslation()

  // 计算每个单元的状态和进度
  const unitsWithProgress = useMemo(() => {
    return UNITS.map(unit => {
      const completedInUnit = unit.demos.filter(d => completedDemos.includes(d)).length
      const progress = unit.demos.length > 0
        ? Math.round((completedInUnit / unit.demos.length) * 100)
        : 0

      // 检查前置条件是否满足
      const prereqsMet = unit.prereqs.every(prereqId => {
        const prereqUnit = UNITS.find(u => u.id === prereqId)
        if (!prereqUnit) return true
        const prereqCompleted = prereqUnit.demos.filter(d => completedDemos.includes(d)).length
        return prereqCompleted >= prereqUnit.demos.length * 0.5 // 50% 完成即可解锁
      })

      let status: UnitNode['status'] = 'locked'
      if (unit.prereqs.length === 0 || prereqsMet) {
        if (progress === 100) {
          status = 'completed'
        } else if (progress > 0) {
          status = 'in-progress'
        } else {
          status = 'available'
        }
      }

      return { ...unit, status, progress }
    }) as UnitNode[]
  }, [completedDemos])

  // SVG 路径连接
  const renderConnections = () => {
    const connections: React.ReactElement[] = []

    // Unit 0 -> Unit 1
    connections.push(
      <motion.path
        key="0-1"
        d="M 150 90 L 150 150"
        stroke={unitsWithProgress[1].status !== 'locked' ? UNITS[1].color : '#64748b'}
        strokeWidth="3"
        strokeDasharray={unitsWithProgress[1].status === 'locked' ? '5,5' : '0'}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    )

    // Unit 1 -> Unit 2, 3, 4 (分叉)
    const unit1Branches = [
      { target: 2, x: 80 },
      { target: 3, x: 150 },
      { target: 4, x: 220 },
    ]

    unit1Branches.forEach(({ target, x }) => {
      const targetUnit = unitsWithProgress[target]
      connections.push(
        <motion.path
          key={`1-${target}`}
          d={`M 150 220 Q ${x === 150 ? 150 : (150 + x) / 2} 260 ${x} 290`}
          stroke={targetUnit.status !== 'locked' ? UNITS[target].color : '#64748b'}
          strokeWidth="3"
          strokeDasharray={targetUnit.status === 'locked' ? '5,5' : '0'}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + target * 0.1 }}
        />
      )
    })

    // Unit 2, 3, 4 -> Unit 5 (汇聚)
    const unit5Sources = [
      { source: 2, x: 80 },
      { source: 3, x: 150 },
      { source: 4, x: 220 },
    ]

    unit5Sources.forEach(({ source, x }) => {
      const unit5 = unitsWithProgress[5]
      connections.push(
        <motion.path
          key={`${source}-5`}
          d={`M ${x} 360 Q ${x === 150 ? 150 : (150 + x) / 2} 400 150 430`}
          stroke={unit5.status !== 'locked' ? UNITS[5].color : '#64748b'}
          strokeWidth="3"
          strokeDasharray={unit5.status === 'locked' ? '5,5' : '0'}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.6 + source * 0.05 }}
        />
      )
    })

    return connections
  }

  // 渲染单元节点
  const renderUnitNode = (unit: UnitNode, x: number, y: number, delay: number) => {
    const isClickable = unit.status !== 'locked'
    const firstDemoId = unit.demos[0]

    return (
      <motion.g
        key={unit.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay }}
      >
        {/* 进度环 */}
        <circle
          cx={x}
          cy={y}
          r="35"
          fill="none"
          stroke={theme === 'dark' ? '#334155' : '#e2e8f0'}
          strokeWidth="4"
        />
        <motion.circle
          cx={x}
          cy={y}
          r="35"
          fill="none"
          stroke={unit.color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(unit.progress / 100) * 220} 220`}
          transform={`rotate(-90 ${x} ${y})`}
          initial={{ strokeDasharray: '0 220' }}
          animate={{ strokeDasharray: `${(unit.progress / 100) * 220} 220` }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
        />

        {/* 节点主体 */}
        <Link
          to={isClickable ? '/demos/$demoId' : '/'}
          params={isClickable ? { demoId: firstDemoId! } : undefined}
          onClick={(e) => {
            if (!isClickable) {
              e.preventDefault()
            } else if (onUnitClick) {
              e.preventDefault()
              onUnitClick(unit.id)
            }
          }}
        >
          <circle
            cx={x}
            cy={y}
            r="28"
            fill={theme === 'dark' ? '#1e293b' : '#ffffff'}
            stroke={unit.status === 'locked' ? '#64748b' : unit.color}
            strokeWidth="2"
            className={isClickable ? 'cursor-pointer hover:brightness-110' : 'cursor-not-allowed'}
          />

          {/* 图标或状态 */}
          <foreignObject x={x - 12} y={y - 12} width="24" height="24">
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: unit.status === 'locked' ? '#64748b' : unit.color }}
            >
              {unit.status === 'locked' ? (
                <Lock className="w-5 h-5" />
              ) : unit.status === 'completed' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                unit.icon
              )}
            </div>
          </foreignObject>
        </Link>

        {/* 单元编号 */}
        <text
          x={x + 45}
          y={y - 15}
          fill={theme === 'dark' ? '#f8fafc' : '#1e293b'}
          fontSize="12"
          fontWeight="bold"
        >
          {unit.unitNum === 0 ? t('course.units.basics.title') : `${t('course.unit')} ${unit.unitNum}`}
        </text>

        {/* 单元标题 */}
        <text
          x={x + 45}
          y={y + 2}
          fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
          fontSize="10"
        >
          {t(unit.subtitleKey).slice(0, 20)}{t(unit.subtitleKey).length > 20 ? '...' : ''}
        </text>

        {/* 进度文字 */}
        <text
          x={x + 45}
          y={y + 18}
          fill={unit.color}
          fontSize="10"
          fontWeight="500"
        >
          {unit.status === 'locked'
            ? t('course.path.locked')
            : unit.status === 'completed'
              ? t('course.path.completed')
              : `${unit.progress}%`
          }
        </text>
      </motion.g>
    )
  }

  return (
    <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t('course.path.title')}
        </h3>
        <Link
          to="/demos"
          className={`text-sm flex items-center gap-1 ${
            theme === 'dark' ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'
          }`}
        >
          {t('course.path.viewAll')}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 300 520" className="w-full max-w-md mx-auto" style={{ minWidth: '280px' }}>
          {/* 背景 */}
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
              <stop offset="100%" stopColor={theme === 'dark' ? '#0f172a' : '#e2e8f0'} />
            </linearGradient>
          </defs>

          {/* 连接线 */}
          {renderConnections()}

          {/* 单元节点 */}
          {/* Unit 0 - 顶部中央 */}
          {renderUnitNode(unitsWithProgress[0], 150, 55, 0)}

          {/* Unit 1 - 第二层中央 */}
          {renderUnitNode(unitsWithProgress[1], 150, 185, 0.1)}

          {/* Unit 2, 3, 4 - 第三层左中右 */}
          {renderUnitNode(unitsWithProgress[2], 80, 325, 0.2)}
          {renderUnitNode(unitsWithProgress[3], 150, 325, 0.25)}
          {renderUnitNode(unitsWithProgress[4], 220, 325, 0.3)}

          {/* Unit 5 - 底部中央 */}
          {renderUnitNode(unitsWithProgress[5], 150, 465, 0.4)}
        </svg>
      </div>

      {/* 图例 */}
      <div className={`mt-4 flex flex-wrap justify-center gap-4 text-xs ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>{t('course.path.completed')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>{t('course.path.inProgress')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span>{t('course.path.locked')}</span>
        </div>
      </div>
    </div>
  )
}

export default LearningPathMap
