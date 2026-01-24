/**
 * Optical Canvas Component - 光学画布组件
 *
 * Main SVG canvas for optical bench with:
 * - Drag-and-drop component movement
 * - Light path visualization
 * - Component selection
 * - Grid background
 */

import { useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Layers } from 'lucide-react'
import {
  useOpticalBenchStore,
  getPolarizationColor,
  type BenchComponent,
  type LightSegment,
} from '@/stores/opticalBenchStore'
import {
  OpticalComponentMap,
  LightBeam,
  type OpticalComponentType,
} from '@/components/bench'
import { PALETTE_COMPONENTS } from '@/data'

// ============================================
// Component Label Display
// ============================================

interface ComponentLabelProps {
  component: BenchComponent
  showLabels: boolean
}

function ComponentLabel({ component, showLabels }: ComponentLabelProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const paletteItem = PALETTE_COMPONENTS.find(p => p.type === component.type)

  if (!showLabels || !paletteItem) return null

  const name = isZh ? paletteItem.nameZh : paletteItem.nameEn
  const params: string[] = []

  // Add key parameters
  if (component.properties.polarization !== undefined && component.properties.polarization >= 0) {
    params.push(`${component.properties.polarization}°`)
  }
  if (component.properties.angle !== undefined) {
    params.push(`${component.properties.angle}°`)
  }
  if (component.properties.retardation !== undefined) {
    params.push(`λ/${component.properties.retardation === 90 ? '4' : '2'}`)
  }

  const label = params.length > 0 ? `${name} (${params.join(', ')})` : name

  return (
    <g transform={`translate(${component.x}, ${component.y - 50})`}>
      {/* Background */}
      <rect
        x={-label.length * 3.5}
        y="-10"
        width={label.length * 7}
        height="18"
        rx="3"
        fill={theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)'}
        stroke={theme === 'dark' ? '#475569' : '#cbd5e1'}
        strokeWidth="1"
      />
      {/* Label text */}
      <text
        x="0"
        y="2"
        textAnchor="middle"
        fontSize="10"
        fontWeight="500"
        fill={theme === 'dark' ? '#e2e8f0' : '#1e293b'}
      >
        {label}
      </text>
    </g>
  )
}

// ============================================
// Light Path Annotation
// ============================================

interface LightPathAnnotationProps {
  segment: LightSegment
  showAnnotations: boolean
  showPolarization: boolean
}

function LightPathAnnotation({ segment, showAnnotations, showPolarization }: LightPathAnnotationProps) {
  const { theme } = useTheme()

  if (!showAnnotations) return null

  const midX = (segment.x1 + segment.x2) / 2
  const midY = (segment.y1 + segment.y2) / 2
  const angle = Math.atan2(segment.y2 - segment.y1, segment.x2 - segment.x1) * (180 / Math.PI)
  const color = showPolarization ? getPolarizationColor(segment.polarization) : '#22d3ee'

  return (
    <g transform={`translate(${midX}, ${midY})`}>
      {/* Direction arrow */}
      <g transform={`rotate(${angle})`}>
        <path
          d="M -8,0 L 8,0 L 4,-3 M 8,0 L 4,3"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.7"
        />
      </g>
      {/* Intensity badge */}
      <g transform="translate(0, -12)">
        <rect
          x="-18"
          y="-8"
          width="36"
          height="14"
          rx="2"
          fill={theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.85)'}
          stroke={color}
          strokeWidth="1"
        />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          fontSize="8"
          fontWeight="600"
          fontFamily="monospace"
          fill={color}
        >
          {segment.intensity.toFixed(0)}% {showPolarization ? `${segment.polarization}°` : ''}
        </text>
      </g>
    </g>
  )
}

// ============================================
// Sensor Reading Display
// ============================================

interface SensorReadingProps {
  x: number
  y: number
  intensity: number
  polarization: number
  showPolarization: boolean
  polarizationType?: 'linear' | 'circular' | 'elliptical'
  handedness?: 'right' | 'left' | 'none'
}

function SensorReading({
  x,
  y,
  intensity,
  polarization,
  showPolarization,
  polarizationType = 'linear',
  handedness = 'none',
}: SensorReadingProps) {
  const { theme } = useTheme()

  // Color based on polarization type
  const getTypeColor = () => {
    if (!showPolarization) return '#22d3ee'
    if (polarizationType === 'circular') {
      return handedness === 'right' ? '#3b82f6' : '#ec4899'
    }
    if (polarizationType === 'elliptical') return '#a855f7'
    return getPolarizationColor(polarization)
  }
  const color = getTypeColor()

  return (
    <g transform={`translate(${x}, ${y - 45})`}>
      {/* Background */}
      <rect
        x="-40"
        y="-12"
        width="80"
        height="24"
        rx="4"
        fill={theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)'}
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Intensity text */}
      <text
        x="-10"
        y="4"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fontFamily="monospace"
        fill={color}
      >
        {intensity.toFixed(1)}%
      </text>
      {/* Polarization type indicator */}
      {showPolarization && (
        <g transform="translate(22, 0)">
          {polarizationType === 'circular' ? (
            // Circular indicator with rotation
            <g>
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray="2 1"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fontSize="7"
                fontWeight="bold"
                fill={color}
              >
                {handedness === 'right' ? 'R' : 'L'}
              </text>
            </g>
          ) : polarizationType === 'elliptical' ? (
            // Elliptical indicator
            <ellipse
              cx="0"
              cy="0"
              rx="8"
              ry="4"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
            />
          ) : (
            // Linear indicator - arrow
            <g transform={`rotate(${polarization - 90})`}>
              <line
                x1="0"
                y1="-6"
                x2="0"
                y2="6"
                stroke={color}
                strokeWidth="2"
              />
              <polygon
                points="0,-8 -2,-4 2,-4"
                fill={color}
              />
            </g>
          )}
        </g>
      )}
    </g>
  )
}

// ============================================
// Empty State Component
// ============================================

function EmptyState() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center">
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
          theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
        )}>
          <Layers className={cn('w-8 h-8', theme === 'dark' ? 'text-gray-600' : 'text-gray-400')} />
        </div>
        <h3 className={cn('text-lg font-semibold mb-2', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          {isZh ? '开始设计光路' : 'Start Designing'}
        </h3>
        <p className={cn('text-sm max-w-sm mx-auto', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
          {isZh
            ? '从左侧浏览器件、选择实验，或自由添加组件'
            : 'Browse devices, select experiments, or freely add components'}
        </p>
      </div>
    </div>
  )
}

// ============================================
// Selected Component Info
// ============================================

interface SelectedComponentInfoProps {
  component: BenchComponent
}

function SelectedComponentInfo({ component }: SelectedComponentInfoProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const paletteItem = PALETTE_COMPONENTS.find(p => p.type === component.type)

  if (!paletteItem) return null

  return (
    <div className={cn(
      'absolute bottom-4 left-4 rounded-xl border p-3 z-10',
      theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'
    )}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{paletteItem.icon}</span>
        <div>
          <h4 className={cn('font-semibold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? paletteItem.nameZh : paletteItem.nameEn}
          </h4>
          <p className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            {isZh ? `角度: ${component.rotation}°` : `Angle: ${component.rotation}°`}
            {component.properties.angle !== undefined && (
              <span className="ml-2">
                {isZh ? `偏振: ${component.properties.angle}°` : `Pol: ${component.properties.angle}°`}
              </span>
            )}
          </p>
          <p className={cn('text-xs font-mono', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
            {isZh ? paletteItem.principleZh : paletteItem.principleEn}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Optical Canvas Component
// ============================================

export function OpticalCanvas() {
  const { theme } = useTheme()
  const svgRef = useRef<SVGSVGElement>(null)

  const {
    components,
    selectedComponentId,
    selectComponent,
    isSimulating,
    showPolarization,
    showLabels,
    showAnnotations,
    lightSegments,
    sensorReadings,
    isDragging,
    snapToGrid,
    gridSize,
    startDrag,
    updateDrag,
    endDrag,
    calculateLightPaths,
  } = useOpticalBenchStore()

  const selectedComponent = components.find(c => c.id === selectedComponentId)

  // Get SVG coordinates from mouse event
  const getSVGCoords = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    const svg = svgRef.current
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    return { x: svgP.x, y: svgP.y }
  }, [])

  // Handle mouse down on component
  const handleComponentMouseDown = useCallback((e: React.MouseEvent, componentId: string) => {
    e.stopPropagation()
    const coords = getSVGCoords(e)
    const component = components.find(c => c.id === componentId)
    if (component) {
      const offset = {
        x: coords.x - component.x,
        y: coords.y - component.y,
      }
      startDrag(componentId, offset)
    }
  }, [components, getSVGCoords, startDrag])

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const coords = getSVGCoords(e)
      updateDrag(coords)
    }
  }, [isDragging, getSVGCoords, updateDrag])

  // Handle mouse up to end drag
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      endDrag()
      // Recalculate light paths after drag
      if (isSimulating) {
        calculateLightPaths()
      }
    }
  }, [isDragging, endDrag, isSimulating, calculateLightPaths])

  // Handle canvas click (deselect)
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as SVGElement).closest('.canvas-background')) {
      selectComponent(null)
    }
  }, [selectComponent])

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
    return undefined
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Recalculate light paths when simulation starts or components change
  useEffect(() => {
    if (isSimulating) {
      calculateLightPaths()
    }
  }, [isSimulating, components, calculateLightPaths])

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', theme === 'dark' ? 'bg-slate-950/50' : 'bg-gray-50/50')}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        onClick={handleCanvasClick}
        style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      >
        {/* Background */}
        <defs>
          <pattern id="optical-grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={theme === 'dark' ? '#334155' : '#94a3b8'}
              strokeWidth="1"
              opacity="0.3"
            />
          </pattern>
          <linearGradient id="table-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme === 'dark' ? '#0f172a' : '#f8fafc'} />
            <stop offset="100%" stopColor={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
          </linearGradient>
          {/* Light beam glow filter */}
          <filter id="beam-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background fill */}
        <rect
          className="canvas-background"
          width="100%"
          height="100%"
          fill="url(#table-gradient)"
        />
        <rect
          className="canvas-background"
          width="100%"
          height="100%"
          fill="url(#optical-grid)"
        />

        {/* Optical rail */}
        <rect
          x="60"
          y="196"
          width="680"
          height="8"
          rx="2"
          fill={theme === 'dark' ? '#334155' : '#94a3b8'}
          opacity="0.5"
        />

        {/* Snap grid indicators when dragging */}
        {isDragging && snapToGrid && (
          <g className="snap-indicators" opacity="0.5">
            {Array.from({ length: Math.floor(800 / gridSize) }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * gridSize}
                y1="0"
                x2={i * gridSize}
                y2="400"
                stroke={theme === 'dark' ? '#4f46e5' : '#818cf8'}
                strokeWidth="0.5"
                strokeDasharray="2,4"
              />
            ))}
            {Array.from({ length: Math.floor(400 / gridSize) }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * gridSize}
                x2="800"
                y2={i * gridSize}
                stroke={theme === 'dark' ? '#4f46e5' : '#818cf8'}
                strokeWidth="0.5"
                strokeDasharray="2,4"
              />
            ))}
          </g>
        )}

        {/* Light beams */}
        {isSimulating && lightSegments.length > 0 && (
          <g className="light-beams" filter="url(#beam-glow)">
            {lightSegments.map(segment => (
              <LightBeam
                key={segment.id}
                x1={segment.x1}
                y1={segment.y1}
                x2={segment.x2}
                y2={segment.y2}
                polarizationAngle={segment.polarization}
                intensity={segment.intensity}
                showPolarization={showPolarization}
                animated={true}
                // Enhanced polarization visualization from Jones vector analysis
                polarizationType={segment.polarizationType}
                handedness={segment.handedness}
                ellipticity={segment.ellipticity}
              />
            ))}
          </g>
        )}

        {/* Light path annotations */}
        {isSimulating && lightSegments.length > 0 && (
          <g className="light-annotations">
            {lightSegments.map(segment => (
              <LightPathAnnotation
                key={`annotation-${segment.id}`}
                segment={segment}
                showAnnotations={showAnnotations}
                showPolarization={showPolarization}
              />
            ))}
          </g>
        )}

        {/* Sensor readings */}
        {isSimulating && (
          <g className="sensor-readings">
            {components
              .filter(c => c.type === 'sensor')
              .map(sensor => {
                const reading = sensorReadings.get(sensor.id)
                if (reading) {
                  return (
                    <SensorReading
                      key={`reading-${sensor.id}`}
                      x={sensor.x}
                      y={sensor.y}
                      intensity={reading.intensity}
                      polarization={reading.polarization}
                      showPolarization={showPolarization}
                      polarizationType={reading.polarizationType}
                      handedness={reading.handedness}
                    />
                  )
                }
                return null
              })}
          </g>
        )}

        {/* Optical components */}
        <g className="optical-components">
          {components.map(component => {
            const ComponentViz = OpticalComponentMap[component.type as OpticalComponentType]
            if (ComponentViz) {
              return (
                <g key={component.id}>
                  <g
                    style={{ cursor: isDragging && selectedComponentId === component.id ? 'grabbing' : 'grab' }}
                    onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                  >
                    <ComponentViz
                      x={component.x}
                      y={component.y}
                      rotation={component.rotation}
                      selected={component.id === selectedComponentId}
                      polarizationAngle={
                        (component.properties.angle as number) ||
                        (component.properties.polarization as number) ||
                        0
                      }
                      onClick={(e) => {
                        e?.stopPropagation()
                        selectComponent(component.id)
                      }}
                    />
                  </g>
                  {/* Component label */}
                  <ComponentLabel component={component} showLabels={showLabels} />
                </g>
              )
            }
            return null
          })}
        </g>
      </svg>

      {/* Empty state */}
      {components.length === 0 && <EmptyState />}

      {/* Selected component info */}
      {selectedComponent && <SelectedComponentInfo component={selectedComponent} />}
    </div>
  )
}

export default OpticalCanvas
