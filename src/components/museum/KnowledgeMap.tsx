/**
 * KnowledgeMap - 偏振知识星图
 *
 * An interactive constellation-style visualization that maps the entire
 * polarization learning journey, showing connections between concepts
 * and guiding learners through the knowledge landscape.
 */

import { useState, useEffect, useCallback, useMemo, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Lightbulb,
  Waves,
  Layers,
  FlaskConical,
  Atom,
  Microscope,
  Sparkles,
  ChevronRight,
  Play,
  Compass,
  MapPin,
  Route
} from 'lucide-react'

// Unit configuration
const UNITS = [
  { id: 0, name: '光学基础', nameEn: 'Optical Basics', color: '#fbbf24', icon: Lightbulb },
  { id: 1, name: '偏振基础', nameEn: 'Polarization Fundamentals', color: '#22d3ee', icon: Waves },
  { id: 2, name: '界面反射', nameEn: 'Interface Reflection', color: '#a78bfa', icon: Layers },
  { id: 3, name: '透明介质', nameEn: 'Transparent Media', color: '#34d399', icon: FlaskConical },
  { id: 4, name: '散射介质', nameEn: 'Scattering Media', color: '#f472b6', icon: Atom },
  { id: 5, name: '偏振测量', nameEn: 'Polarimetry', color: '#60a5fa', icon: Microscope }
]

// Knowledge nodes - each demo with its position and connections
interface KnowledgeNode {
  id: string
  titleKey: string
  unit: number
  // Position in the map (normalized 0-100)
  x: number
  y: number
  // Importance level affects size
  importance: 'core' | 'main' | 'advanced'
  // Related nodes (prerequisite or related concepts)
  connections: string[]
  // Brief description key
  descKey: string
  // Difficulty level
  difficulty: 'foundation' | 'application' | 'research'
}

const KNOWLEDGE_NODES: KnowledgeNode[] = [
  // Unit 0: Optical Basics - Starting region (left side)
  {
    id: 'em-wave',
    titleKey: 'demos.emWave.title',
    unit: 0,
    x: 8,
    y: 35,
    importance: 'core',
    connections: ['polarization-intro'],
    descKey: 'knowledgeMap.nodes.emWave',
    difficulty: 'foundation'
  },
  {
    id: 'polarization-intro',
    titleKey: 'demos.polarizationIntro.title',
    unit: 0,
    x: 18,
    y: 28,
    importance: 'core',
    connections: ['polarization-types-unified', 'polarization-state'],
    descKey: 'knowledgeMap.nodes.polarizationIntro',
    difficulty: 'foundation'
  },
  {
    id: 'polarization-types-unified',
    titleKey: 'demos.polarizationTypes.title',
    unit: 0,
    x: 18,
    y: 48,
    importance: 'main',
    connections: ['malus', 'waveplate'],
    descKey: 'knowledgeMap.nodes.polarizationTypes',
    difficulty: 'application'
  },
  {
    id: 'optical-bench',
    titleKey: 'demos.opticalBench.title',
    unit: 0,
    x: 10,
    y: 60,
    importance: 'main',
    connections: ['malus', 'birefringence'],
    descKey: 'knowledgeMap.nodes.opticalBench',
    difficulty: 'application'
  },

  // Unit 1: Polarization Fundamentals - Central hub
  {
    id: 'polarization-state',
    titleKey: 'demos.polarizationState.title',
    unit: 1,
    x: 32,
    y: 22,
    importance: 'main',
    connections: ['stokes', 'jones'],
    descKey: 'knowledgeMap.nodes.polarizationState',
    difficulty: 'foundation'
  },
  {
    id: 'malus',
    titleKey: 'demos.malus.title',
    unit: 1,
    x: 38,
    y: 38,
    importance: 'core',
    connections: ['birefringence', 'brewster', 'fresnel'],
    descKey: 'knowledgeMap.nodes.malus',
    difficulty: 'application'
  },
  {
    id: 'birefringence',
    titleKey: 'demos.birefringence.title',
    unit: 1,
    x: 35,
    y: 55,
    importance: 'main',
    connections: ['waveplate', 'chromatic', 'anisotropy'],
    descKey: 'knowledgeMap.nodes.birefringence',
    difficulty: 'application'
  },
  {
    id: 'waveplate',
    titleKey: 'demos.waveplate.title',
    unit: 1,
    x: 30,
    y: 70,
    importance: 'advanced',
    connections: ['mueller', 'jones'],
    descKey: 'knowledgeMap.nodes.waveplate',
    difficulty: 'research'
  },

  // Unit 2: Interface Reflection - Upper right
  {
    id: 'fresnel',
    titleKey: 'demos.fresnel.title',
    unit: 2,
    x: 55,
    y: 25,
    importance: 'main',
    connections: ['brewster'],
    descKey: 'knowledgeMap.nodes.fresnel',
    difficulty: 'research'
  },
  {
    id: 'brewster',
    titleKey: 'demos.brewster.title',
    unit: 2,
    x: 62,
    y: 35,
    importance: 'core',
    connections: ['rayleigh'],
    descKey: 'knowledgeMap.nodes.brewster',
    difficulty: 'application'
  },

  // Unit 3: Transparent Media - Center right
  {
    id: 'anisotropy',
    titleKey: 'demos.anisotropy.title',
    unit: 3,
    x: 50,
    y: 48,
    importance: 'main',
    connections: ['chromatic'],
    descKey: 'knowledgeMap.nodes.anisotropy',
    difficulty: 'foundation'
  },
  {
    id: 'chromatic',
    titleKey: 'demos.chromatic.title',
    unit: 3,
    x: 55,
    y: 60,
    importance: 'main',
    connections: ['optical-rotation', 'mueller'],
    descKey: 'knowledgeMap.nodes.chromatic',
    difficulty: 'application'
  },
  {
    id: 'optical-rotation',
    titleKey: 'demos.opticalRotation.title',
    unit: 3,
    x: 48,
    y: 72,
    importance: 'advanced',
    connections: ['mueller'],
    descKey: 'knowledgeMap.nodes.opticalRotation',
    difficulty: 'application'
  },

  // Unit 4: Scattering - Lower right
  {
    id: 'rayleigh',
    titleKey: 'demos.rayleigh.title',
    unit: 4,
    x: 72,
    y: 45,
    importance: 'core',
    connections: ['mie-scattering'],
    descKey: 'knowledgeMap.nodes.rayleigh',
    difficulty: 'foundation'
  },
  {
    id: 'mie-scattering',
    titleKey: 'demos.mieScattering.title',
    unit: 4,
    x: 78,
    y: 58,
    importance: 'advanced',
    connections: ['monte-carlo-scattering'],
    descKey: 'knowledgeMap.nodes.mieScattering',
    difficulty: 'research'
  },
  {
    id: 'monte-carlo-scattering',
    titleKey: 'demos.monteCarloScattering.title',
    unit: 4,
    x: 75,
    y: 72,
    importance: 'advanced',
    connections: ['polarimetric-microscopy'],
    descKey: 'knowledgeMap.nodes.monteCarloScattering',
    difficulty: 'research'
  },

  // Unit 5: Polarimetry - Far right (advanced destination)
  {
    id: 'stokes',
    titleKey: 'demos.stokes.title',
    unit: 5,
    x: 88,
    y: 30,
    importance: 'core',
    connections: ['mueller', 'polarimetric-microscopy'],
    descKey: 'knowledgeMap.nodes.stokes',
    difficulty: 'research'
  },
  {
    id: 'jones',
    titleKey: 'demos.jones.title',
    unit: 5,
    x: 90,
    y: 45,
    importance: 'main',
    connections: ['mueller'],
    descKey: 'knowledgeMap.nodes.jones',
    difficulty: 'research'
  },
  {
    id: 'mueller',
    titleKey: 'demos.mueller.title',
    unit: 5,
    x: 92,
    y: 60,
    importance: 'core',
    connections: ['polarimetric-microscopy'],
    descKey: 'knowledgeMap.nodes.mueller',
    difficulty: 'research'
  },
  {
    id: 'polarimetric-microscopy',
    titleKey: 'demos.polarimetricMicroscopy.title',
    unit: 5,
    x: 88,
    y: 78,
    importance: 'advanced',
    connections: [],
    descKey: 'knowledgeMap.nodes.polarimetricMicroscopy',
    difficulty: 'research'
  }
]

// Suggested learning paths
interface LearningPath {
  id: string
  nameKey: string
  descKey: string
  color: string
  nodes: string[]
  icon: typeof Compass
}

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'quick-start',
    nameKey: 'knowledgeMap.paths.quickStart.name',
    descKey: 'knowledgeMap.paths.quickStart.desc',
    color: '#22d3ee',
    nodes: ['em-wave', 'polarization-intro', 'malus', 'birefringence'],
    icon: Play
  },
  {
    id: 'deep-dive',
    nameKey: 'knowledgeMap.paths.deepDive.name',
    descKey: 'knowledgeMap.paths.deepDive.desc',
    color: '#a78bfa',
    nodes: ['em-wave', 'polarization-intro', 'polarization-types-unified', 'malus', 'birefringence', 'waveplate', 'stokes', 'mueller'],
    icon: Route
  },
  {
    id: 'applications',
    nameKey: 'knowledgeMap.paths.applications.name',
    descKey: 'knowledgeMap.paths.applications.desc',
    color: '#f59e0b',
    nodes: ['malus', 'brewster', 'anisotropy', 'chromatic', 'rayleigh'],
    icon: MapPin
  }
]

// Animated particle that travels along connections
interface Particle {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  progress: number
  color: string
  size: number
}

// SVG-based Knowledge Map visualization
function MapVisualization({
  nodes,
  highlightedPath,
  hoveredNode,
  selectedNode,
  onNodeHover,
  onNodeClick
}: {
  nodes: KnowledgeNode[]
  highlightedPath: string[] | null
  hoveredNode: string | null
  selectedNode: string | null
  onNodeHover: (id: string | null) => void
  onNodeClick: (id: string) => void
}) {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [particles, setParticles] = useState<Particle[]>([])
  const [time, setTime] = useState(0)

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 1) % 1000)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Generate particles for connections
  useEffect(() => {
    const newParticles: Particle[] = []
    let particleId = 0

    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const targetNode = nodes.find(n => n.id === targetId)
        if (targetNode) {
          // Create 2-3 particles per connection
          for (let i = 0; i < 2; i++) {
            const progress = ((time / 100 + i * 0.5) % 1)
            newParticles.push({
              id: particleId++,
              x: node.x + (targetNode.x - node.x) * progress,
              y: node.y + (targetNode.y - node.y) * progress,
              targetX: targetNode.x,
              targetY: targetNode.y,
              progress,
              color: UNITS[node.unit].color,
              size: 2 + Math.sin(progress * Math.PI) * 2
            })
          }
        }
      })
    })

    setParticles(newParticles)
  }, [time, nodes])

  // Get node size based on importance
  const getNodeSize = (importance: string) => {
    switch (importance) {
      case 'core': return 12
      case 'main': return 9
      case 'advanced': return 7
      default: return 8
    }
  }

  // Check if a connection should be highlighted
  const isConnectionHighlighted = (fromId: string, toId: string) => {
    if (!highlightedPath) return false
    const fromIndex = highlightedPath.indexOf(fromId)
    const toIndex = highlightedPath.indexOf(toId)
    return fromIndex !== -1 && toIndex !== -1 && Math.abs(fromIndex - toIndex) === 1
  }

  // Check if a node is in the highlighted path
  const isNodeInPath = (nodeId: string) => {
    return highlightedPath?.includes(nodeId) ?? false
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      style={{ minHeight: 400 }}
    >
      <defs>
        {/* Glow filters for each unit */}
        {UNITS.map(unit => (
          <filter key={unit.id} id={`glow-${unit.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}

        {/* Path glow filter */}
        <filter id="path-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.8" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Radial gradient for background regions */}
        {UNITS.map(unit => (
          <radialGradient key={`grad-${unit.id}`} id={`region-${unit.id}`}>
            <stop offset="0%" stopColor={unit.color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={unit.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Background grid pattern */}
      <pattern id="knowledge-grid" width="5" height="5" patternUnits="userSpaceOnUse">
        <circle
          cx="2.5"
          cy="2.5"
          r="0.2"
          fill={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
        />
      </pattern>
      <rect width="100" height="100" fill="url(#knowledge-grid)" />

      {/* Unit region backgrounds */}
      {UNITS.map(unit => {
        const unitNodes = nodes.filter(n => n.unit === unit.id)
        if (unitNodes.length === 0) return null
        const avgX = unitNodes.reduce((sum, n) => sum + n.x, 0) / unitNodes.length
        const avgY = unitNodes.reduce((sum, n) => sum + n.y, 0) / unitNodes.length
        return (
          <circle
            key={`region-${unit.id}`}
            cx={avgX}
            cy={avgY}
            r="18"
            fill={`url(#region-${unit.id})`}
            className="transition-opacity duration-300"
            opacity={hoveredNode && nodes.find(n => n.id === hoveredNode)?.unit === unit.id ? 0.8 : 0.4}
          />
        )
      })}

      {/* Connections */}
      {nodes.map(node =>
        node.connections.map(targetId => {
          const targetNode = nodes.find(n => n.id === targetId)
          if (!targetNode) return null

          const isHighlighted = isConnectionHighlighted(node.id, targetId)
          const isHoveredConnection =
            hoveredNode === node.id ||
            hoveredNode === targetId

          return (
            <g key={`${node.id}-${targetId}`}>
              {/* Connection line */}
              <line
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isHighlighted ? highlightedPath ? LEARNING_PATHS.find(p => p.nodes.includes(node.id))?.color || '#fff' : '#fff' : theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}
                strokeWidth={isHighlighted ? 0.6 : isHoveredConnection ? 0.4 : 0.2}
                strokeDasharray={isHighlighted ? 'none' : '0.5,0.5'}
                filter={isHighlighted ? 'url(#path-glow)' : 'none'}
                className="transition-all duration-300"
              />
            </g>
          )
        })
      )}

      {/* Animated particles */}
      {particles.map(particle => (
        <circle
          key={particle.id}
          cx={particle.x}
          cy={particle.y}
          r={particle.size * 0.15}
          fill={particle.color}
          opacity={0.6}
        />
      ))}

      {/* Nodes - base layer (non-hovered) */}
      {nodes.map(node => {
        const unit = UNITS[node.unit]
        const size = getNodeSize(node.importance)
        const isHovered = hoveredNode === node.id
        const isSelected = selectedNode === node.id
        const isInPath = isNodeInPath(node.id)

        // Skip hovered node in base layer, render it in top layer
        if (isHovered) return null

        return (
          <g
            key={node.id}
            transform={`translate(${node.x}, ${node.y})`}
            className="cursor-pointer"
            onMouseEnter={() => onNodeHover(node.id)}
            onMouseLeave={() => onNodeHover(null)}
            onClick={() => onNodeClick(node.id)}
          >
            {/* Outer glow ring for core nodes */}
            {node.importance === 'core' && (
              <circle
                r={size * 0.18}
                fill="none"
                stroke={unit.color}
                strokeWidth="0.3"
                opacity={0.3 + Math.sin(time * 0.05) * 0.2}
              />
            )}

            {/* Main node circle */}
            <circle
              r={size * 0.12 * (isSelected ? 1.3 : 1)}
              fill={theme === 'dark' ? '#1e293b' : '#ffffff'}
              stroke={unit.color}
              strokeWidth={isSelected || isInPath ? 0.5 : 0.3}
              filter={isSelected ? `url(#glow-${unit.id})` : 'none'}
              className="transition-all duration-200"
            />

            {/* Inner colored dot */}
            <circle
              r={size * 0.06 * (isSelected ? 1.2 : 1)}
              fill={unit.color}
              opacity={isSelected || isInPath ? 1 : 0.7}
              className="transition-all duration-200"
            />

            {/* Node label - only show if it's a core node or selected */}
            {(isSelected || node.importance === 'core') && (
              <g>
                {/* Text background for better readability */}
                <rect
                  x={-15}
                  y={size * 0.2 + 0.5}
                  width={30}
                  height={3.5}
                  rx={0.5}
                  fill={theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)'}
                  className="pointer-events-none"
                />
                <text
                  y={size * 0.2 + 3}
                  textAnchor="middle"
                  fill={theme === 'dark' ? '#e2e8f0' : '#334155'}
                  fontSize="2.5"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  className="pointer-events-none select-none"
                >
                  {t(node.titleKey)}
                </text>
              </g>
            )}
          </g>
        )
      })}

      {/* Hovered node - rendered on top layer for proper z-order */}
      {hoveredNode && (() => {
        const node = nodes.find(n => n.id === hoveredNode)
        if (!node) return null

        const unit = UNITS[node.unit]
        const size = getNodeSize(node.importance)
        return (
          <g
            key={`hovered-${node.id}`}
            transform={`translate(${node.x}, ${node.y})`}
            className="cursor-pointer"
            onMouseEnter={() => onNodeHover(node.id)}
            onMouseLeave={() => onNodeHover(null)}
            onClick={() => onNodeClick(node.id)}
          >
            {/* Outer glow ring for core nodes */}
            {node.importance === 'core' && (
              <circle
                r={size * 0.18}
                fill="none"
                stroke={unit.color}
                strokeWidth="0.3"
                opacity={0.3 + Math.sin(time * 0.05) * 0.2}
              />
            )}

            {/* Main node circle - larger on hover */}
            <circle
              r={size * 0.12 * 1.3}
              fill={theme === 'dark' ? '#1e293b' : '#ffffff'}
              stroke={unit.color}
              strokeWidth={0.5}
              filter={`url(#glow-${unit.id})`}
              className="transition-all duration-200"
            />

            {/* Inner colored dot */}
            <circle
              r={size * 0.06 * 1.2}
              fill={unit.color}
              opacity={1}
              className="transition-all duration-200"
            />

            {/* Node label with background - always show on hover */}
            <g>
              {/* Text background for better readability */}
              <rect
                x={-18}
                y={size * 0.25}
                width={36}
                height={4}
                rx={1}
                fill={theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'}
                stroke={unit.color}
                strokeWidth={0.2}
                className="pointer-events-none"
              />
              <text
                y={size * 0.25 + 3}
                textAnchor="middle"
                fill={theme === 'dark' ? '#e2e8f0' : '#334155'}
                fontSize="2.8"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {t(node.titleKey)}
              </text>
            </g>

            {/* Difficulty badge */}
            <g transform="translate(2.5, -2.5)">
              <circle
                r="1.8"
                fill={
                  node.difficulty === 'foundation' ? '#22c55e' :
                  node.difficulty === 'application' ? '#3b82f6' : '#a855f7'
                }
                stroke={theme === 'dark' ? '#1e293b' : '#ffffff'}
                strokeWidth={0.3}
              />
            </g>
          </g>
        )
      })()}

      {/* Unit labels */}
      {UNITS.map(unit => {
        const unitNodes = nodes.filter(n => n.unit === unit.id)
        if (unitNodes.length === 0) return null
        const minX = Math.min(...unitNodes.map(n => n.x)) - 3
        const minY = Math.min(...unitNodes.map(n => n.y)) - 6
        return (
          <text
            key={`label-${unit.id}`}
            x={minX}
            y={minY}
            fill={unit.color}
            fontSize="2.5"
            fontWeight="bold"
            opacity={0.7}
            className="pointer-events-none select-none"
          >
            {unit.name}
          </text>
        )
      })}
    </svg>
  )
}

// Node detail panel
function NodeDetailPanel({
  node,
  onNavigate
}: {
  node: KnowledgeNode | null
  onNavigate: (id: string) => void
}) {
  const { t } = useTranslation()
  const { theme } = useTheme()

  if (!node) return null

  const unit = UNITS[node.unit]
  const Icon = unit.icon

  return (
    <div
      className={cn(
        "absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 rounded-xl p-4 z-20",
        "animate-in slide-in-from-bottom-4 duration-200",
        theme === 'dark'
          ? "bg-slate-800/95 border border-slate-700 backdrop-blur-sm"
          : "bg-white/95 border border-slate-200 backdrop-blur-sm shadow-lg"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${unit.color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: unit.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Unit badge */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${unit.color}20`, color: unit.color }}
            >
              Unit {unit.id}
            </span>
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                node.difficulty === 'foundation' ? "bg-green-500/20 text-green-500" :
                node.difficulty === 'application' ? "bg-blue-500/20 text-blue-500" :
                "bg-purple-500/20 text-purple-500"
              )}
            >
              {node.difficulty === 'foundation' ? '🌱 ' : node.difficulty === 'application' ? '🔬 ' : '🚀 '}
              {t(`knowledgeMap.difficulty.${node.difficulty}`)}
            </span>
          </div>

          {/* Title */}
          <h3 className={cn(
            "text-base font-semibold mb-1",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t(node.titleKey)}
          </h3>

          {/* Description */}
          <p className={cn(
            "text-sm mb-3",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {t(node.descKey)}
          </p>

          {/* Connected nodes */}
          {node.connections.length > 0 && (
            <div className="mb-3">
              <span className={cn(
                "text-xs",
                theme === 'dark' ? "text-slate-500" : "text-slate-400"
              )}>
                {t('knowledgeMap.nextSteps')}:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {node.connections.map(connId => {
                  const connNode = KNOWLEDGE_NODES.find(n => n.id === connId)
                  return connNode ? (
                    <button
                      key={connId}
                      onClick={() => onNavigate(connId)}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full transition-colors",
                        theme === 'dark'
                          ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {t(connNode.titleKey)}
                    </button>
                  ) : null
                })}
              </div>
            </div>
          )}

          {/* Navigate button */}
          <button
            onClick={() => onNavigate(node.id)}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium",
              "transition-all duration-200 hover:scale-[1.02]"
            )}
            style={{
              backgroundColor: `${unit.color}20`,
              color: unit.color
            }}
          >
            <Play className="w-4 h-4" />
            {t('knowledgeMap.startDemo')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Learning path selector
function PathSelector({
  paths,
  selectedPath,
  onSelectPath
}: {
  paths: LearningPath[]
  selectedPath: string | null
  onSelectPath: (pathId: string | null) => void
}) {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <div className="flex flex-wrap gap-2">
      {paths.map(path => {
        const Icon = path.icon
        const isSelected = selectedPath === path.id

        return (
          <button
            key={path.id}
            onClick={() => onSelectPath(isSelected ? null : path.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
              "transition-all duration-200",
              isSelected
                ? "ring-2 ring-offset-2 ring-offset-transparent"
                : "opacity-70 hover:opacity-100"
            )}
            style={{
              backgroundColor: isSelected ? `${path.color}30` : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: isSelected ? path.color : theme === 'dark' ? '#e2e8f0' : '#334155',
              '--tw-ring-color': isSelected ? path.color : 'transparent'
            } as CSSProperties}
          >
            <Icon className="w-4 h-4" />
            {t(path.nameKey)}
          </button>
        )
      })}
    </div>
  )
}

// Main Knowledge Map Component
export function KnowledgeMap() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { theme } = useTheme()

  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  // Get the highlighted path nodes
  const highlightedPathNodes = useMemo(() => {
    if (!selectedPath) return null
    const path = LEARNING_PATHS.find(p => p.id === selectedPath)
    return path?.nodes ?? null
  }, [selectedPath])

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string) => {
    if (selectedNode === nodeId) {
      // Double click - navigate to demo
      navigate(`/demos/${nodeId}`)
    } else {
      setSelectedNode(nodeId)
    }
  }, [selectedNode, navigate])

  // Handle navigate from panel
  const handleNavigate = useCallback((nodeId: string) => {
    navigate(`/demos/${nodeId}`)
  }, [navigate])

  // Get selected node data
  const selectedNodeData = useMemo(() => {
    return KNOWLEDGE_NODES.find(n => n.id === selectedNode) ?? null
  }, [selectedNode])

  return (
    <section className={cn(
      "py-16 px-6 relative overflow-hidden",
      theme === 'dark' ? "bg-slate-900/50" : "bg-slate-50"
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-8">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4",
            theme === 'dark'
              ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30"
              : "bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200"
          )}>
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span className={cn(
              "text-sm font-medium",
              theme === 'dark' ? "text-cyan-400" : "text-cyan-600"
            )}>
              {t('knowledgeMap.badge')}
            </span>
          </div>

          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('knowledgeMap.title')}
          </h2>

          <p className={cn(
            "text-lg max-w-2xl mx-auto mb-6",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {t('knowledgeMap.description')}
          </p>

          {/* Learning path selector */}
          <div className="flex flex-col items-center gap-2">
            <span className={cn(
              "text-sm",
              theme === 'dark' ? "text-slate-500" : "text-slate-400"
            )}>
              {t('knowledgeMap.choosePath')}
            </span>
            <PathSelector
              paths={LEARNING_PATHS}
              selectedPath={selectedPath}
              onSelectPath={setSelectedPath}
            />
          </div>
        </div>

        {/* Map visualization */}
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden",
            theme === 'dark'
              ? "bg-slate-800/50 border border-slate-700"
              : "bg-white/50 border border-slate-200"
          )}
          style={{ minHeight: 450 }}
        >
          <MapVisualization
            nodes={KNOWLEDGE_NODES}
            highlightedPath={highlightedPathNodes}
            hoveredNode={hoveredNode}
            selectedNode={selectedNode}
            onNodeHover={setHoveredNode}
            onNodeClick={handleNodeClick}
          />

          {/* Node detail panel */}
          <NodeDetailPanel
            node={selectedNodeData}
            onNavigate={handleNavigate}
          />

          {/* Legend */}
          <div className={cn(
            "absolute top-4 left-4 p-3 rounded-lg",
            theme === 'dark' ? "bg-slate-900/80" : "bg-white/80"
          )}>
            <div className={cn(
              "text-xs font-medium mb-2",
              theme === 'dark' ? "text-slate-400" : "text-slate-500"
            )}>
              {t('knowledgeMap.legend.title')}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className={cn("text-xs", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                  {t('knowledgeMap.legend.foundation')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className={cn("text-xs", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                  {t('knowledgeMap.legend.application')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className={cn("text-xs", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                  {t('knowledgeMap.legend.research')}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className={cn(
            "absolute top-4 right-4 p-3 rounded-lg text-xs",
            theme === 'dark' ? "bg-slate-900/80 text-slate-400" : "bg-white/80 text-slate-500"
          )}>
            {t('knowledgeMap.instructions')}
          </div>
        </div>

        {/* Path description when a path is selected */}
        {selectedPath && (
          <div className={cn(
            "mt-4 p-4 rounded-xl text-center",
            theme === 'dark'
              ? "bg-slate-800/50 border border-slate-700"
              : "bg-white/50 border border-slate-200"
          )}>
            {(() => {
              const path = LEARNING_PATHS.find(p => p.id === selectedPath)
              if (!path) return null
              return (
                <div>
                  <p className={cn(
                    "text-sm mb-3",
                    theme === 'dark' ? "text-slate-300" : "text-slate-700"
                  )}>
                    {t(path.descKey)}
                  </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {path.nodes.map((nodeId, index) => {
                      const node = KNOWLEDGE_NODES.find(n => n.id === nodeId)
                      if (!node) return null
                      const unit = UNITS[node.unit]
                      return (
                        <div key={nodeId} className="flex items-center gap-1">
                          <button
                            onClick={() => handleNavigate(nodeId)}
                            className={cn(
                              "px-2 py-1 rounded text-xs font-medium transition-colors",
                              "hover:opacity-80"
                            )}
                            style={{ backgroundColor: `${unit.color}20`, color: unit.color }}
                          >
                            {t(node.titleKey)}
                          </button>
                          {index < path.nodes.length - 1 && (
                            <ChevronRight
                              className="w-3 h-3"
                              style={{ color: path.color }}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </section>
  )
}

export default KnowledgeMap
