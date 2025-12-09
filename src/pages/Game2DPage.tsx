/**
 * Game2D Page - CSS-based 2D polarization puzzle game
 * Complex open-ended puzzles with mirrors, splitters, rotators and multiple light paths
 * Inspired by Monument Valley and Shadowmatic aesthetics
 */
import { useState, useCallback, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, BookOpen, ChevronLeft, ChevronRight, RotateCcw, Lightbulb, Trophy, Info, Play, Pause, Eye, Zap, Settings2 } from 'lucide-react'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

// Direction type for 2D game
type Direction2D = 'up' | 'down' | 'left' | 'right'

// Extended component types for 2D puzzles
interface OpticalComponent {
  id: string
  type: 'polarizer' | 'mirror' | 'splitter' | 'rotator' | 'emitter' | 'sensor'
  x: number // percentage position
  y: number // percentage position
  angle: number // orientation angle
  polarizationAngle?: number // for polarizers and emitters
  rotationAmount?: number // for rotators (45 or 90)
  locked: boolean
  direction?: Direction2D // for emitters
  requiredIntensity?: number // for sensors
  requiredPolarization?: number // for sensors
}

// Level definition with multiple components
interface Level2D {
  id: number
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  hint?: string
  hintZh?: string
  components: OpticalComponent[]
  gridSize: { width: number; height: number } // for positioning
  openEnded?: boolean // multiple solutions possible
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
}

// Calculate direction vector
const directionVectors: Record<Direction2D, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

// Mirror reflection based on mirror angle
function getMirrorReflection(incomingDir: Direction2D, mirrorAngle: number): Direction2D | null {
  // Mirror at 45° reflects: right<->up, left<->down
  // Mirror at 135° reflects: right<->down, left<->up
  const normalizedAngle = ((mirrorAngle % 180) + 180) % 180

  if (normalizedAngle >= 40 && normalizedAngle <= 50) { // ~45°
    const reflections: Record<Direction2D, Direction2D> = {
      right: 'up', up: 'right', left: 'down', down: 'left'
    }
    return reflections[incomingDir]
  } else if (normalizedAngle >= 130 && normalizedAngle <= 140) { // ~135°
    const reflections: Record<Direction2D, Direction2D> = {
      right: 'down', down: 'right', left: 'up', up: 'left'
    }
    return reflections[incomingDir]
  }
  return null
}

// Enhanced levels with open-ended puzzles
const LEVELS: Level2D[] = [
  // === EASY LEVELS ===
  {
    id: 0,
    name: 'First Light',
    nameZh: '初见光芒',
    description: 'Rotate the polarizer to let light through to the sensor',
    descriptionZh: '旋转偏振片让光通过并到达传感器',
    hint: 'Match the polarizer angle with the light polarization',
    hintZh: '将偏振片角度与光的偏振方向对齐',
    difficulty: 'easy',
    gridSize: { width: 100, height: 100 },
    components: [
      { id: 'e1', type: 'emitter', x: 50, y: 10, angle: 0, polarizationAngle: 0, direction: 'down', locked: true },
      { id: 'p1', type: 'polarizer', x: 50, y: 50, angle: 0, polarizationAngle: 90, locked: false },
      { id: 's1', type: 'sensor', x: 50, y: 90, angle: 0, requiredIntensity: 80, requiredPolarization: 0, locked: true },
    ],
  },
  {
    id: 1,
    name: 'The Mirror',
    nameZh: '镜面反射',
    description: 'Use the mirror to redirect light to the sensor',
    descriptionZh: '使用镜子将光重新引导至传感器',
    difficulty: 'easy',
    gridSize: { width: 100, height: 100 },
    components: [
      { id: 'e1', type: 'emitter', x: 20, y: 20, angle: 0, polarizationAngle: 0, direction: 'right', locked: true },
      { id: 'm1', type: 'mirror', x: 80, y: 20, angle: 45, locked: false },
      { id: 's1', type: 'sensor', x: 80, y: 80, angle: 0, requiredIntensity: 80, locked: true },
    ],
  },
  {
    id: 2,
    name: 'Crossed Polarizers',
    nameZh: '正交偏振',
    description: 'Two perpendicular polarizers block all light. Find a way through!',
    descriptionZh: '两个垂直的偏振片会阻挡所有光。找到通过的方法！',
    hint: 'A 45° polarizer between crossed polarizers allows some light through',
    hintZh: '在正交偏振片之间放置45°偏振片可以让部分光通过',
    difficulty: 'easy',
    gridSize: { width: 100, height: 100 },
    components: [
      { id: 'e1', type: 'emitter', x: 50, y: 8, angle: 0, polarizationAngle: 0, direction: 'down', locked: true },
      { id: 'p1', type: 'polarizer', x: 50, y: 30, angle: 0, polarizationAngle: 0, locked: true },
      { id: 'p2', type: 'polarizer', x: 50, y: 50, angle: 0, polarizationAngle: 45, locked: false },
      { id: 'p3', type: 'polarizer', x: 50, y: 70, angle: 0, polarizationAngle: 90, locked: true },
      { id: 's1', type: 'sensor', x: 50, y: 92, angle: 0, requiredIntensity: 20, locked: true },
    ],
  },
  // === MEDIUM LEVELS ===
  {
    id: 3,
    name: 'L-Shaped Path',
    nameZh: 'L形路径',
    description: 'Guide light around the corner to reach the sensor',
    descriptionZh: '引导光线绕过转角到达传感器',
    difficulty: 'medium',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      { id: 'e1', type: 'emitter', x: 15, y: 20, angle: 0, polarizationAngle: 45, direction: 'right', locked: true },
      { id: 'm1', type: 'mirror', x: 75, y: 20, angle: 45, locked: false },
      { id: 'p1', type: 'polarizer', x: 75, y: 50, angle: 0, polarizationAngle: 45, locked: false },
      { id: 's1', type: 'sensor', x: 75, y: 85, angle: 0, requiredIntensity: 60, requiredPolarization: 45, locked: true },
    ],
  },
  {
    id: 4,
    name: 'Rotator Magic',
    nameZh: '旋光魔法',
    description: 'Use the wave plate to rotate polarization without losing intensity',
    descriptionZh: '使用波片旋转偏振方向而不损失强度',
    difficulty: 'medium',
    gridSize: { width: 100, height: 100 },
    components: [
      { id: 'e1', type: 'emitter', x: 50, y: 10, angle: 0, polarizationAngle: 0, direction: 'down', locked: true },
      { id: 'r1', type: 'rotator', x: 50, y: 40, angle: 0, rotationAmount: 45, locked: false },
      { id: 'p1', type: 'polarizer', x: 50, y: 65, angle: 0, polarizationAngle: 45, locked: true },
      { id: 's1', type: 'sensor', x: 50, y: 90, angle: 0, requiredIntensity: 90, requiredPolarization: 45, locked: true },
    ],
  },
  {
    id: 5,
    name: 'Split Decision',
    nameZh: '分光选择',
    description: 'The splitter creates two beams with perpendicular polarizations',
    descriptionZh: '分光器产生两束偏振方向垂直的光',
    hint: 'Choose which beam to direct to the sensor',
    hintZh: '选择哪束光引导至传感器',
    difficulty: 'medium',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      { id: 'e1', type: 'emitter', x: 15, y: 50, angle: 0, polarizationAngle: 45, direction: 'right', locked: true },
      { id: 'sp1', type: 'splitter', x: 50, y: 50, angle: 0, locked: true },
      { id: 'm1', type: 'mirror', x: 50, y: 20, angle: 135, locked: false },
      { id: 's1', type: 'sensor', x: 85, y: 50, angle: 0, requiredIntensity: 40, requiredPolarization: 0, locked: true },
    ],
  },
  // === HARD LEVELS ===
  {
    id: 6,
    name: 'Dual Sensors',
    nameZh: '双传感器',
    description: 'Activate both sensors with different polarizations',
    descriptionZh: '用不同偏振方向激活两个传感器',
    difficulty: 'hard',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      { id: 'e1', type: 'emitter', x: 15, y: 50, angle: 0, polarizationAngle: 45, direction: 'right', locked: true },
      { id: 'sp1', type: 'splitter', x: 45, y: 50, angle: 0, locked: true },
      { id: 'm1', type: 'mirror', x: 45, y: 20, angle: 135, locked: false },
      { id: 'm2', type: 'mirror', x: 85, y: 50, angle: 45, locked: false },
      { id: 's1', type: 'sensor', x: 85, y: 20, angle: 0, requiredIntensity: 40, requiredPolarization: 90, locked: true },
      { id: 's2', type: 'sensor', x: 85, y: 80, angle: 0, requiredIntensity: 40, requiredPolarization: 0, locked: true },
    ],
  },
  {
    id: 7,
    name: 'Maze of Light',
    nameZh: '光之迷宫',
    description: 'Navigate through multiple mirrors and polarizers',
    descriptionZh: '在多个镜子和偏振片之间导航',
    difficulty: 'hard',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      { id: 'e1', type: 'emitter', x: 10, y: 10, angle: 0, polarizationAngle: 0, direction: 'right', locked: true },
      { id: 'm1', type: 'mirror', x: 50, y: 10, angle: 45, locked: false },
      { id: 'p1', type: 'polarizer', x: 50, y: 35, angle: 0, polarizationAngle: 0, locked: false },
      { id: 'm2', type: 'mirror', x: 50, y: 55, angle: 135, locked: false },
      { id: 'r1', type: 'rotator', x: 75, y: 55, angle: 0, rotationAmount: 90, locked: false },
      { id: 'm3', type: 'mirror', x: 90, y: 55, angle: 45, locked: false },
      { id: 's1', type: 'sensor', x: 90, y: 90, angle: 0, requiredIntensity: 50, requiredPolarization: 90, locked: true },
    ],
  },
  {
    id: 8,
    name: 'Precision Cascade',
    nameZh: '精确级联',
    description: 'Fine-tune multiple polarizers to achieve exact intensity',
    descriptionZh: '精调多个偏振片达到精确强度',
    difficulty: 'hard',
    gridSize: { width: 100, height: 100 },
    components: [
      { id: 'e1', type: 'emitter', x: 50, y: 5, angle: 0, polarizationAngle: 0, direction: 'down', locked: true },
      { id: 'p1', type: 'polarizer', x: 50, y: 22, angle: 0, polarizationAngle: 20, locked: false },
      { id: 'p2', type: 'polarizer', x: 50, y: 40, angle: 0, polarizationAngle: 40, locked: false },
      { id: 'p3', type: 'polarizer', x: 50, y: 58, angle: 0, polarizationAngle: 60, locked: false },
      { id: 'p4', type: 'polarizer', x: 50, y: 76, angle: 0, polarizationAngle: 80, locked: false },
      { id: 's1', type: 'sensor', x: 50, y: 95, angle: 0, requiredIntensity: 50, locked: true },
    ],
  },
  // === EXPERT LEVELS ===
  {
    id: 9,
    name: 'Quantum Interference',
    nameZh: '量子干涉',
    description: 'Advanced puzzle: route light through complex optical system',
    descriptionZh: '高级关卡：通过复杂光学系统引导光线',
    difficulty: 'expert',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      { id: 'e1', type: 'emitter', x: 10, y: 25, angle: 0, polarizationAngle: 45, direction: 'right', locked: true },
      { id: 'e2', type: 'emitter', x: 10, y: 75, angle: 0, polarizationAngle: 45, direction: 'right', locked: true },
      { id: 'sp1', type: 'splitter', x: 35, y: 25, angle: 0, locked: true },
      { id: 'sp2', type: 'splitter', x: 35, y: 75, angle: 0, locked: true },
      { id: 'm1', type: 'mirror', x: 65, y: 25, angle: 45, locked: false },
      { id: 'm2', type: 'mirror', x: 65, y: 75, angle: 135, locked: false },
      { id: 'p1', type: 'polarizer', x: 65, y: 50, angle: 0, polarizationAngle: 45, locked: false },
      { id: 's1', type: 'sensor', x: 90, y: 50, angle: 0, requiredIntensity: 60, locked: true },
    ],
  },
  {
    id: 10,
    name: 'The Grand Challenge',
    nameZh: '终极挑战',
    description: 'Master all optical principles to complete this puzzle',
    descriptionZh: '掌握所有光学原理来完成这个谜题',
    difficulty: 'expert',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      { id: 'e1', type: 'emitter', x: 5, y: 50, angle: 0, polarizationAngle: 0, direction: 'right', locked: true },
      { id: 'r1', type: 'rotator', x: 20, y: 50, angle: 0, rotationAmount: 45, locked: false },
      { id: 'sp1', type: 'splitter', x: 40, y: 50, angle: 0, locked: true },
      { id: 'm1', type: 'mirror', x: 40, y: 20, angle: 135, locked: false },
      { id: 'p1', type: 'polarizer', x: 65, y: 20, angle: 0, polarizationAngle: 90, locked: false },
      { id: 'm2', type: 'mirror', x: 80, y: 20, angle: 45, locked: false },
      { id: 'm3', type: 'mirror', x: 65, y: 50, angle: 45, locked: false },
      { id: 'p2', type: 'polarizer', x: 65, y: 75, angle: 0, polarizationAngle: 0, locked: false },
      { id: 's1', type: 'sensor', x: 80, y: 50, angle: 0, requiredIntensity: 30, requiredPolarization: 90, locked: true },
      { id: 's2', type: 'sensor', x: 65, y: 90, angle: 0, requiredIntensity: 30, requiredPolarization: 0, locked: true },
    ],
  },
]

// Light beam segment for rendering
interface LightBeamSegment {
  startX: number
  startY: number
  endX: number
  endY: number
  intensity: number
  polarization: number
  direction: Direction2D
}

// Sensor activation state
interface SensorState {
  id: string
  activated: boolean
  receivedIntensity: number
  receivedPolarization: number | null
}

export function Game2DPage() {
  const { t, i18n } = useTranslation()
  void t
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [componentStates, setComponentStates] = useState<Record<string, Partial<OpticalComponent>>>({})
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)
  const [showPolarization, setShowPolarization] = useState(true)

  const currentLevel = LEVELS[currentLevelIndex]

  // Initialize component states when level changes
  useEffect(() => {
    const initialStates: Record<string, Partial<OpticalComponent>> = {}
    currentLevel.components.forEach((c) => {
      initialStates[c.id] = {
        angle: c.angle,
        polarizationAngle: c.polarizationAngle,
        rotationAmount: c.rotationAmount,
      }
    })
    setComponentStates(initialStates)
    setIsComplete(false)
    setSelectedComponent(null)
    setShowHint(false)
  }, [currentLevelIndex])

  // Get current state of a component
  const getComponentState = useCallback((component: OpticalComponent) => {
    const state = componentStates[component.id] || {}
    return {
      ...component,
      angle: state.angle ?? component.angle,
      polarizationAngle: state.polarizationAngle ?? component.polarizationAngle,
      rotationAmount: state.rotationAmount ?? component.rotationAmount,
    }
  }, [componentStates])

  // Calculate light paths and sensor states
  const { lightBeams, sensorStates } = useMemo(() => {
    const beams: LightBeamSegment[] = []
    const sensors: SensorState[] = []

    // Initialize sensor states
    currentLevel.components.filter(c => c.type === 'sensor').forEach(s => {
      sensors.push({
        id: s.id,
        activated: false,
        receivedIntensity: 0,
        receivedPolarization: null,
      })
    })

    // Process each emitter
    const emitters = currentLevel.components.filter(c => c.type === 'emitter')

    for (const emitter of emitters) {
      const state = getComponentState(emitter)
      if (!state.direction) continue

      // Trace light path from this emitter
      traceLightPath(
        state.x,
        state.y,
        state.direction,
        100, // initial intensity
        state.polarizationAngle ?? 0,
        beams,
        sensors,
        currentLevel.components,
        getComponentState,
        0
      )
    }

    return { lightBeams: beams, sensorStates: sensors }
  }, [currentLevel, componentStates, getComponentState])

  // Trace light path recursively
  function traceLightPath(
    startX: number,
    startY: number,
    direction: Direction2D,
    intensity: number,
    polarization: number,
    beams: LightBeamSegment[],
    sensors: SensorState[],
    components: OpticalComponent[],
    getState: (c: OpticalComponent) => OpticalComponent,
    depth: number
  ) {
    if (depth > 20 || intensity < 1) return

    const { dx, dy } = directionVectors[direction]

    // Find the next component in this direction
    let nextComponent: OpticalComponent | null = null
    let minDist = Infinity

    for (const comp of components) {
      if (comp.type === 'emitter') continue

      const state = getState(comp)

      // Check if component is in the path
      const toCompX = state.x - startX
      const toCompY = state.y - startY

      // Component must be in the direction we're traveling
      if (dx !== 0 && Math.sign(toCompX) !== Math.sign(dx)) continue
      if (dy !== 0 && Math.sign(toCompY) !== Math.sign(dy)) continue

      // For horizontal movement, check Y alignment
      if (dx !== 0 && Math.abs(toCompY) > 8) continue
      // For vertical movement, check X alignment
      if (dy !== 0 && Math.abs(toCompX) > 8) continue

      const dist = Math.abs(toCompX) + Math.abs(toCompY)
      if (dist < minDist && dist > 2) {
        minDist = dist
        nextComponent = comp
      }
    }

    // Calculate end position
    let endX: number, endY: number

    if (nextComponent) {
      const state = getState(nextComponent)
      endX = state.x
      endY = state.y
    } else {
      // Light goes to edge
      if (dx > 0) endX = 100
      else if (dx < 0) endX = 0
      else endX = startX

      if (dy > 0) endY = 100
      else if (dy < 0) endY = 0
      else endY = startY
    }

    // Add beam segment
    beams.push({
      startX,
      startY,
      endX,
      endY,
      intensity,
      polarization,
      direction,
    })

    if (!nextComponent) return

    const compState = getState(nextComponent)

    // Process the component
    switch (nextComponent.type) {
      case 'polarizer': {
        const polAngle = compState.polarizationAngle ?? 0
        const angleDiff = Math.abs(polarization - polAngle) % 180
        const transmission = Math.cos((angleDiff * Math.PI) / 180) ** 2
        const newIntensity = intensity * transmission

        if (newIntensity >= 1) {
          traceLightPath(endX, endY, direction, newIntensity, polAngle, beams, sensors, components, getState, depth + 1)
        }
        break
      }

      case 'mirror': {
        const mirrorAngle = compState.angle ?? 45
        const reflectedDir = getMirrorReflection(direction, mirrorAngle)

        if (reflectedDir) {
          traceLightPath(endX, endY, reflectedDir, intensity * 0.95, polarization, beams, sensors, components, getState, depth + 1)
        }
        break
      }

      case 'splitter': {
        // Splitter creates two beams with orthogonal polarizations
        // O-ray continues straight with 0° polarization
        // E-ray deflects up with 90° polarization
        const oRayIntensity = intensity * Math.cos(((polarization - 0) * Math.PI) / 180) ** 2
        const eRayIntensity = intensity * Math.cos(((polarization - 90) * Math.PI) / 180) ** 2

        // O-ray continues in same direction
        if (oRayIntensity >= 1) {
          traceLightPath(endX, endY, direction, oRayIntensity * 0.95, 0, beams, sensors, components, getState, depth + 1)
        }

        // E-ray deflects perpendicular (up if going right, right if going down, etc.)
        const eRayDir: Direction2D = direction === 'right' ? 'up' : direction === 'left' ? 'down' : direction === 'down' ? 'right' : 'left'
        if (eRayIntensity >= 1) {
          traceLightPath(endX, endY, eRayDir, eRayIntensity * 0.95, 90, beams, sensors, components, getState, depth + 1)
        }
        break
      }

      case 'rotator': {
        const rotAmount = compState.rotationAmount ?? 45
        const newPolarization = (polarization + rotAmount) % 180
        traceLightPath(endX, endY, direction, intensity * 0.98, newPolarization, beams, sensors, components, getState, depth + 1)
        break
      }

      case 'sensor': {
        // Update sensor state
        const sensorIdx = sensors.findIndex(s => s.id === nextComponent!.id)
        if (sensorIdx !== -1) {
          sensors[sensorIdx].receivedIntensity += intensity
          sensors[sensorIdx].receivedPolarization = polarization

          const reqIntensity = nextComponent.requiredIntensity ?? 50
          const reqPol = nextComponent.requiredPolarization

          const intensityOk = sensors[sensorIdx].receivedIntensity >= reqIntensity
          const polOk = reqPol === undefined || Math.abs(polarization - reqPol) <= 5 || Math.abs(polarization - reqPol - 180) <= 5

          sensors[sensorIdx].activated = intensityOk && polOk
        }
        break
      }
    }
  }

  // Check win condition
  useEffect(() => {
    const allSensorsActivated = sensorStates.length > 0 && sensorStates.every(s => s.activated)
    if (allSensorsActivated && !isComplete) {
      setIsComplete(true)
    }
  }, [sensorStates, isComplete])

  // Handle component rotation
  const handleRotate = (id: string, delta: number, property: 'angle' | 'polarizationAngle' | 'rotationAmount') => {
    const component = currentLevel.components.find(c => c.id === id)
    if (!component || component.locked) return

    setComponentStates(prev => {
      const current = prev[id] || {}
      let newValue: number

      if (property === 'rotationAmount') {
        // Toggle between 45 and 90
        newValue = (current.rotationAmount ?? component.rotationAmount ?? 45) === 45 ? 90 : 45
      } else {
        const currentVal = current[property] ?? (component as any)[property] ?? 0
        newValue = ((currentVal + delta + 360) % 360)
        if (property === 'polarizationAngle') {
          newValue = newValue % 180
        }
      }

      return {
        ...prev,
        [id]: {
          ...current,
          [property]: newValue,
        }
      }
    })
    setIsComplete(false)
  }

  const handleReset = () => {
    const initialStates: Record<string, Partial<OpticalComponent>> = {}
    currentLevel.components.forEach((c) => {
      initialStates[c.id] = {
        angle: c.angle,
        polarizationAngle: c.polarizationAngle,
        rotationAmount: c.rotationAmount,
      }
    })
    setComponentStates(initialStates)
    setIsComplete(false)
  }

  const goToNextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1)
    }
  }

  const goToPrevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1)
    }
  }

  const isDark = theme === 'dark'

  // Difficulty colors
  const difficultyColors: Record<string, string> = {
    easy: 'text-green-400 bg-green-500/20 border-green-500/30',
    medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    hard: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    expert: 'text-red-400 bg-red-500/20 border-red-500/30',
  }

  // Polarization color mapping
  const getPolarizationColor = (angle: number): string => {
    const normalizedAngle = ((angle % 180) + 180) % 180
    if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff4444' // 0° red
    if (normalizedAngle < 67.5) return '#ffaa00' // 45° orange
    if (normalizedAngle < 112.5) return '#44ff44' // 90° green
    return '#4444ff' // 135° blue
  }

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col',
        isDark
          ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
          : 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100'
      )}
    >
      {/* Header */}
      <header
        className={cn(
          'flex items-center justify-between p-4 border-b',
          isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200 bg-white/80'
        )}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={cn(
              'p-2 rounded-lg transition-colors',
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
            )}
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            to="/game"
            className={cn(
              'p-2 rounded-lg transition-colors',
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
            )}
          >
            <Zap className="w-5 h-5" />
          </Link>
          <Link
            to="/demos"
            className={cn(
              'p-2 rounded-lg transition-colors',
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
            )}
          >
            <BookOpen className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-slate-500/30 mx-2" />
          <h1 className={cn('text-xl font-bold', isDark ? 'text-cyan-400' : 'text-cyan-600')}>
            PolarCraft 2D
          </h1>
        </div>
        <LanguageThemeSwitcher />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-6 overflow-hidden">
        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center">
          {/* Level Info */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <button
                onClick={goToPrevLevel}
                disabled={currentLevelIndex === 0}
                className={cn(
                  'p-2 rounded-full transition-all',
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 disabled:opacity-30'
                    : 'bg-slate-200 hover:bg-slate-300 disabled:opacity-30'
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-800')}>
                    {isZh ? currentLevel.nameZh : currentLevel.name}
                  </h2>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border', difficultyColors[currentLevel.difficulty])}>
                    {isZh ? { easy: '简单', medium: '中等', hard: '困难', expert: '专家' }[currentLevel.difficulty] : currentLevel.difficulty}
                  </span>
                </div>
                <span className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
                  {currentLevelIndex + 1} / {LEVELS.length}
                </span>
              </div>
              <button
                onClick={goToNextLevel}
                disabled={currentLevelIndex === LEVELS.length - 1}
                className={cn(
                  'p-2 rounded-full transition-all',
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 disabled:opacity-30'
                    : 'bg-slate-200 hover:bg-slate-300 disabled:opacity-30'
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <p className={cn('text-sm max-w-md', isDark ? 'text-slate-400' : 'text-slate-600')}>
              {isZh ? currentLevel.descriptionZh : currentLevel.description}
            </p>
          </div>

          {/* Game Canvas - SVG-based */}
          <div
            className={cn(
              'relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden shadow-2xl',
              isDark ? 'bg-slate-900/90 border border-cyan-500/20' : 'bg-white border border-slate-200'
            )}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: isDark ? '#0a0a1a' : '#f8fafc' }}>
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="0.2" />
                </pattern>
                {/* Glow filter for beams */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Animation for beam flow */}
                <linearGradient id="beamFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,150,0.3)">
                    <animate attributeName="offset" values="-1;1" dur="2s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%" stopColor="rgba(255,255,255,0.8)">
                    <animate attributeName="offset" values="-0.5;1.5" dur="2s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="rgba(255,255,150,0.3)">
                    <animate attributeName="offset" values="0;2" dur="2s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />

              {/* Light beams */}
              {lightBeams.map((beam, i) => {
                const opacity = Math.max(0.2, beam.intensity / 100)
                const strokeWidth = Math.max(0.5, (beam.intensity / 100) * 2)
                const color = showPolarization ? getPolarizationColor(beam.polarization) : '#ffffaa'

                return (
                  <g key={i}>
                    {/* Main beam */}
                    <line
                      x1={beam.startX}
                      y1={beam.startY}
                      x2={beam.endX}
                      y2={beam.endY}
                      stroke={color}
                      strokeWidth={strokeWidth}
                      strokeOpacity={opacity}
                      filter="url(#glow)"
                      strokeLinecap="round"
                    />
                    {/* Glow effect */}
                    <line
                      x1={beam.startX}
                      y1={beam.startY}
                      x2={beam.endX}
                      y2={beam.endY}
                      stroke={color}
                      strokeWidth={strokeWidth * 3}
                      strokeOpacity={opacity * 0.3}
                      strokeLinecap="round"
                    />
                    {/* Animated flow */}
                    {isAnimating && beam.intensity > 10 && (
                      <line
                        x1={beam.startX}
                        y1={beam.startY}
                        x2={beam.endX}
                        y2={beam.endY}
                        stroke="url(#beamFlow)"
                        strokeWidth={strokeWidth * 0.5}
                        strokeOpacity={0.5}
                        strokeLinecap="round"
                      />
                    )}
                  </g>
                )
              })}

              {/* Render components */}
              {currentLevel.components.map((component) => {
                const state = getComponentState(component)
                const isSelected = selectedComponent === component.id

                return (
                  <g key={component.id}>
                    {/* Component based on type */}
                    {component.type === 'emitter' && (
                      <EmitterSVG
                        x={state.x}
                        y={state.y}
                        polarization={state.polarizationAngle ?? 0}
                        direction={state.direction ?? 'down'}
                        isAnimating={isAnimating}
                        showPolarization={showPolarization}
                        getPolarizationColor={getPolarizationColor}
                      />
                    )}

                    {component.type === 'polarizer' && (
                      <PolarizerSVG
                        x={state.x}
                        y={state.y}
                        polarizationAngle={state.polarizationAngle ?? 0}
                        locked={component.locked}
                        selected={isSelected}
                        onClick={() => !component.locked && setSelectedComponent(component.id)}
                        onRotate={(delta) => handleRotate(component.id, delta, 'polarizationAngle')}
                        getPolarizationColor={getPolarizationColor}
                        isDark={isDark}
                      />
                    )}

                    {component.type === 'mirror' && (
                      <MirrorSVG
                        x={state.x}
                        y={state.y}
                        angle={state.angle ?? 45}
                        locked={component.locked}
                        selected={isSelected}
                        onClick={() => !component.locked && setSelectedComponent(component.id)}
                        onRotate={(delta) => handleRotate(component.id, delta, 'angle')}
                        isDark={isDark}
                      />
                    )}

                    {component.type === 'splitter' && (
                      <SplitterSVG
                        x={state.x}
                        y={state.y}
                        isDark={isDark}
                      />
                    )}

                    {component.type === 'rotator' && (
                      <RotatorSVG
                        x={state.x}
                        y={state.y}
                        rotationAmount={state.rotationAmount ?? 45}
                        locked={component.locked}
                        selected={isSelected}
                        onClick={() => !component.locked && setSelectedComponent(component.id)}
                        onToggle={() => handleRotate(component.id, 0, 'rotationAmount')}
                        isDark={isDark}
                      />
                    )}

                    {component.type === 'sensor' && (
                      <SensorSVG
                        x={state.x}
                        y={state.y}
                        sensorState={sensorStates.find(s => s.id === component.id)}
                        requiredIntensity={component.requiredIntensity ?? 50}
                        requiredPolarization={component.requiredPolarization}
                        isDark={isDark}
                        isAnimating={isAnimating}
                        getPolarizationColor={getPolarizationColor}
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Overlay info */}
            <div className={cn(
              'absolute top-3 left-3 flex flex-col gap-2 text-xs',
            )}>
              {/* Polarization toggle */}
              <button
                onClick={() => setShowPolarization(!showPolarization)}
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all',
                  showPolarization
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-200 text-slate-600'
                )}
              >
                <Eye className="w-3 h-3" />
                {isZh ? '偏振色' : 'Polarization'}
              </button>
            </div>

            {/* Sensors status */}
            <div className={cn(
              'absolute top-3 right-3 px-3 py-2 rounded-lg text-xs font-mono',
              isDark ? 'bg-slate-800/90 text-slate-300' : 'bg-white/90 text-slate-700'
            )}>
              {sensorStates.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full', s.activated ? 'bg-green-400' : 'bg-slate-500')} />
                  <span>S{i + 1}: {Math.round(s.receivedIntensity)}%</span>
                </div>
              ))}
            </div>

            {/* Win overlay */}
            {isComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 animate-fade-in-up">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-8 py-6 rounded-2xl shadow-2xl text-center">
                  <Trophy className="w-12 h-12 text-white mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {isZh ? '关卡完成！' : 'Level Complete!'}
                  </h3>
                  {currentLevel.openEnded && (
                    <p className="text-green-100 text-sm mb-3">
                      {isZh ? '这是开放性关卡，可能有多种解法' : 'Open-ended puzzle - multiple solutions exist'}
                    </p>
                  )}
                  {currentLevelIndex < LEVELS.length - 1 && (
                    <button
                      onClick={goToNextLevel}
                      className="mt-2 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
                    >
                      {isZh ? '下一关' : 'Next Level'} →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4 flex-wrap justify-center">
            <button
              onClick={handleReset}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              )}
            >
              <RotateCcw className="w-4 h-4" />
              {isZh ? '重置' : 'Reset'}
            </button>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              )}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAnimating ? (isZh ? '暂停' : 'Pause') : isZh ? '播放' : 'Play'}
            </button>
            {currentLevel.hint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  showHint
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                )}
              >
                <Lightbulb className="w-4 h-4" />
                {isZh ? '提示' : 'Hint'}
              </button>
            )}
          </div>

          {/* Hint display */}
          {showHint && currentLevel.hint && (
            <div className={cn(
              'mt-3 px-4 py-2 rounded-lg text-sm max-w-md text-center',
              'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300'
            )}>
              💡 {isZh ? currentLevel.hintZh : currentLevel.hint}
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div
          className={cn(
            'w-full lg:w-80 rounded-2xl p-4 lg:p-6 lg:max-h-[calc(100vh-120px)] overflow-y-auto',
            isDark ? 'bg-slate-900/60 border border-slate-700/50' : 'bg-white/80 border border-slate-200'
          )}
        >
          {/* Component Guide */}
          <div className="mb-6">
            <h3 className={cn('font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-slate-800')}>
              <Settings2 className="w-4 h-4" />
              {isZh ? '元件说明' : 'Components'}
            </h3>
            <div className={cn('space-y-2 text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs">💡</span>
                <span>{isZh ? '光源 - 发射偏振光' : 'Emitter - emits polarized light'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-blue-500/30 border border-blue-500 flex items-center justify-center text-xs">▤</span>
                <span>{isZh ? '偏振片 - 过滤偏振方向' : 'Polarizer - filters polarization'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-slate-400/30 border border-slate-400 flex items-center justify-center text-xs">◢</span>
                <span>{isZh ? '镜子 - 反射光线' : 'Mirror - reflects light'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-cyan-500/30 border border-cyan-500 flex items-center justify-center text-xs">◇</span>
                <span>{isZh ? '分光器 - 分离偏振' : 'Splitter - separates polarizations'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-purple-500/30 border border-purple-500 flex items-center justify-center text-xs">↻</span>
                <span>{isZh ? '波片 - 旋转偏振方向' : 'Rotator - rotates polarization'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-500/30 border border-green-500 flex items-center justify-center text-xs">◎</span>
                <span>{isZh ? '传感器 - 检测光线' : 'Sensor - detects light'}</span>
              </div>
            </div>
          </div>

          {/* Physics Info */}
          <div className="mb-6">
            <h3 className={cn('font-bold mb-3 flex items-center gap-2', isDark ? 'text-cyan-400' : 'text-cyan-600')}>
              <Info className="w-4 h-4" />
              {isZh ? '物理原理' : 'Physics'}
            </h3>
            <div className={cn('p-3 rounded-lg text-sm', isDark ? 'bg-slate-800/50' : 'bg-slate-100')}>
              <div className="text-center mb-2">
                <span className={cn('text-lg font-mono', isDark ? 'text-cyan-300' : 'text-cyan-600')}>
                  I = I₀ × cos²θ
                </span>
              </div>
              <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-600')}>
                {isZh
                  ? '马吕斯定律：光通过偏振片时，强度按角度差的余弦平方衰减'
                  : "Malus's Law: Light intensity decreases by cos²θ through a polarizer"}
              </p>
            </div>
          </div>

          {/* Polarization colors */}
          {showPolarization && (
            <div className="mb-6">
              <h3 className={cn('font-bold mb-3', isDark ? 'text-white' : 'text-slate-800')}>
                {isZh ? '偏振颜色' : 'Polarization Colors'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { angle: 0, label: '0°' },
                  { angle: 45, label: '45°' },
                  { angle: 90, label: '90°' },
                  { angle: 135, label: '135°' },
                ].map(({ angle, label }) => (
                  <div key={angle} className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: getPolarizationColor(angle) }}
                    />
                    <span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-600')}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level Progress */}
          <div>
            <h3 className={cn('font-bold mb-3', isDark ? 'text-white' : 'text-slate-800')}>
              {isZh ? '关卡选择' : 'Level Select'}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {LEVELS.map((level, i) => (
                <button
                  key={level.id}
                  onClick={() => setCurrentLevelIndex(i)}
                  className={cn(
                    'aspect-square rounded-lg font-bold transition-all text-sm',
                    currentLevelIndex === i
                      ? 'bg-cyan-500 text-white shadow-lg scale-105'
                      : isDark
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300',
                    level.difficulty === 'hard' && !isDark && 'border-l-2 border-orange-400',
                    level.difficulty === 'expert' && !isDark && 'border-l-2 border-red-400',
                    level.difficulty === 'hard' && isDark && 'border-l-2 border-orange-500/50',
                    level.difficulty === 'expert' && isDark && 'border-l-2 border-red-500/50'
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// SVG Components for 2D Game

// Emitter SVG Component
interface EmitterSVGProps {
  x: number
  y: number
  polarization: number
  direction: Direction2D
  isAnimating: boolean
  showPolarization: boolean
  getPolarizationColor: (angle: number) => string
}

function EmitterSVG({ x, y, polarization, direction, isAnimating, showPolarization, getPolarizationColor }: EmitterSVGProps) {
  const color = showPolarization ? getPolarizationColor(polarization) : '#ffdd00'
  const directionRotation = { up: 0, right: 90, down: 180, left: 270 }[direction]

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer glow */}
      <circle r="5" fill={color} opacity={isAnimating ? 0.3 : 0.2}>
        {isAnimating && (
          <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
        )}
      </circle>
      {/* Main body */}
      <circle r="3.5" fill="#1a1a2e" stroke={color} strokeWidth="0.6" />
      {/* Inner core */}
      <circle r="2" fill={color}>
        {isAnimating && (
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
        )}
      </circle>
      {/* Direction indicator */}
      <g transform={`rotate(${directionRotation})`}>
        <path d="M 0 2.5 L 0 5 M -1 4 L 0 5 L 1 4" stroke={color} strokeWidth="0.5" fill="none" />
      </g>
      {/* Polarization label */}
      <text y="-6" textAnchor="middle" fill={color} fontSize="2.5" fontWeight="bold">
        {polarization}°
      </text>
    </g>
  )
}

// Polarizer SVG Component
interface PolarizerSVGProps {
  x: number
  y: number
  polarizationAngle: number
  locked: boolean
  selected: boolean
  onClick: () => void
  onRotate: (delta: number) => void
  getPolarizationColor: (angle: number) => string
  isDark: boolean
}

function PolarizerSVG({ x, y, polarizationAngle, locked, selected, onClick, onRotate, getPolarizationColor, isDark }: PolarizerSVGProps) {
  const color = getPolarizationColor(polarizationAngle)
  const bgColor = isDark ? '#1e293b' : '#e2e8f0'

  // Handle keyboard when selected
  useEffect(() => {
    if (!selected || locked) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); onRotate(-15) }
      if (e.key === 'ArrowRight') { e.preventDefault(); onRotate(15) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, locked, onRotate])

  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: locked ? 'not-allowed' : 'pointer' }} onClick={onClick}>
      {/* Selection ring */}
      {selected && !locked && (
        <rect x="-5.5" y="-5.5" width="11" height="11" rx="2" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2,1">
          <animate attributeName="stroke-dashoffset" values="0;6" dur="1s" repeatCount="indefinite" />
        </rect>
      )}
      {/* Background */}
      <rect x="-4" y="-4" width="8" height="8" rx="1" fill={bgColor} stroke={locked ? '#64748b' : color} strokeWidth="0.4" />
      {/* Grid lines */}
      <g transform={`rotate(${polarizationAngle})`}>
        {[-2.5, -1.25, 0, 1.25, 2.5].map((offset, i) => (
          <line key={i} x1={offset} y1="-3" x2={offset} y2="3" stroke={color} strokeWidth="0.3" opacity="0.7" />
        ))}
      </g>
      {/* Lock indicator */}
      {locked && (
        <text x="3" y="-3" fontSize="2.5">🔒</text>
      )}
      {/* Angle label */}
      <text y="7" textAnchor="middle" fill={color} fontSize="2" fontWeight="bold">
        {polarizationAngle}°
      </text>
      {/* Rotation buttons when selected */}
      {selected && !locked && (
        <>
          <g transform="translate(-8, 0)" onClick={(e) => { e.stopPropagation(); onRotate(-15) }} style={{ cursor: 'pointer' }}>
            <circle r="2.5" fill="#22d3ee" opacity="0.8" />
            <text textAnchor="middle" y="0.8" fill="white" fontSize="3" fontWeight="bold">-</text>
          </g>
          <g transform="translate(8, 0)" onClick={(e) => { e.stopPropagation(); onRotate(15) }} style={{ cursor: 'pointer' }}>
            <circle r="2.5" fill="#22d3ee" opacity="0.8" />
            <text textAnchor="middle" y="0.8" fill="white" fontSize="3" fontWeight="bold">+</text>
          </g>
        </>
      )}
    </g>
  )
}

// Mirror SVG Component
interface MirrorSVGProps {
  x: number
  y: number
  angle: number
  locked: boolean
  selected: boolean
  onClick: () => void
  onRotate: (delta: number) => void
  isDark: boolean
}

function MirrorSVG({ x, y, angle, locked, selected, onClick, onRotate, isDark }: MirrorSVGProps) {
  useEffect(() => {
    if (!selected || locked) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); onRotate(-45) }
      if (e.key === 'ArrowRight') { e.preventDefault(); onRotate(45) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, locked, onRotate])

  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: locked ? 'not-allowed' : 'pointer' }} onClick={onClick}>
      {/* Selection ring */}
      {selected && !locked && (
        <circle r="5" fill="none" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="2,1">
          <animate attributeName="stroke-dashoffset" values="0;6" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Mirror surface */}
      <g transform={`rotate(${angle})`}>
        <rect x="-4" y="-0.5" width="8" height="1" fill={isDark ? '#e2e8f0' : '#94a3b8'} rx="0.2" />
        {/* Reflection highlight */}
        <rect x="-3.5" y="-0.3" width="7" height="0.3" fill="white" opacity="0.6" />
        {/* Back of mirror */}
        <rect x="-4" y="0.5" width="8" height="0.4" fill={isDark ? '#64748b' : '#475569'} rx="0.1" />
      </g>
      {/* Lock indicator */}
      {locked && <text x="3" y="-3" fontSize="2.5">🔒</text>}
      {/* Angle label */}
      <text y="6" textAnchor="middle" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="2">
        {angle}°
      </text>
      {/* Rotation buttons */}
      {selected && !locked && (
        <>
          <g transform="translate(-7, 0)" onClick={(e) => { e.stopPropagation(); onRotate(-45) }} style={{ cursor: 'pointer' }}>
            <circle r="2" fill="#22d3ee" opacity="0.8" />
            <text textAnchor="middle" y="0.8" fill="white" fontSize="2.5">↺</text>
          </g>
          <g transform="translate(7, 0)" onClick={(e) => { e.stopPropagation(); onRotate(45) }} style={{ cursor: 'pointer' }}>
            <circle r="2" fill="#22d3ee" opacity="0.8" />
            <text textAnchor="middle" y="0.8" fill="white" fontSize="2.5">↻</text>
          </g>
        </>
      )}
    </g>
  )
}

// Splitter SVG Component
interface SplitterSVGProps {
  x: number
  y: number
  isDark: boolean
}

function SplitterSVG({ x, y, isDark }: SplitterSVGProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Diamond shape */}
      <polygon
        points="0,-4 4,0 0,4 -4,0"
        fill={isDark ? '#0e7490' : '#06b6d4'}
        opacity="0.7"
        stroke="#22d3ee"
        strokeWidth="0.4"
      />
      {/* Split direction indicators */}
      <line x1="1" y1="0" x2="5" y2="0" stroke="#ff4444" strokeWidth="0.4" opacity="0.8" />
      <line x1="0" y1="-1" x2="0" y2="-5" stroke="#44ff44" strokeWidth="0.4" opacity="0.8" />
      {/* Label */}
      <text y="7" textAnchor="middle" fill="#22d3ee" fontSize="2">
        Splitter
      </text>
    </g>
  )
}

// Rotator SVG Component
interface RotatorSVGProps {
  x: number
  y: number
  rotationAmount: number
  locked: boolean
  selected: boolean
  onClick: () => void
  onToggle: () => void
  isDark: boolean
}

function RotatorSVG({ x, y, rotationAmount, locked, selected, onClick, onToggle, isDark }: RotatorSVGProps) {
  const color = rotationAmount === 90 ? '#a855f7' : '#ec4899'

  useEffect(() => {
    if (!selected || locked) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        onToggle()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, locked, onToggle])

  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: locked ? 'not-allowed' : 'pointer' }} onClick={onClick}>
      {/* Selection ring */}
      {selected && !locked && (
        <circle r="5.5" fill="none" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="2,1">
          <animate attributeName="stroke-dashoffset" values="0;6" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Hexagon body */}
      <polygon
        points="0,-4 3.5,-2 3.5,2 0,4 -3.5,2 -3.5,-2"
        fill={isDark ? '#2d1b4e' : '#f3e8ff'}
        stroke={color}
        strokeWidth="0.5"
      />
      {/* Spiral indicator */}
      <path
        d={rotationAmount === 90
          ? "M -2 0 Q -2 -2 0 -2 Q 2 -2 2 0 Q 2 2 0 2"
          : "M -1.5 0 Q -1.5 -1.5 0 -1.5 Q 1.5 -1.5 1.5 0"}
        fill="none"
        stroke={color}
        strokeWidth="0.5"
      />
      {/* Arrow head */}
      <g transform={`rotate(${rotationAmount === 90 ? 180 : 90})`}>
        <path d="M 0 2 L -0.8 1 M 0 2 L 0.8 1" stroke={color} strokeWidth="0.4" fill="none" />
      </g>
      {/* Lock indicator */}
      {locked && <text x="3" y="-3" fontSize="2.5">🔒</text>}
      {/* Rotation amount label */}
      <text y="7" textAnchor="middle" fill={color} fontSize="2" fontWeight="bold">
        {rotationAmount}°
      </text>
      {/* Toggle button when selected */}
      {selected && !locked && (
        <g transform="translate(7, 0)" onClick={(e) => { e.stopPropagation(); onToggle() }} style={{ cursor: 'pointer' }}>
          <circle r="2.5" fill={color} opacity="0.8" />
          <text textAnchor="middle" y="0.8" fill="white" fontSize="2">⟳</text>
        </g>
      )}
    </g>
  )
}

// Sensor SVG Component
interface SensorSVGProps {
  x: number
  y: number
  sensorState: SensorState | undefined
  requiredIntensity: number
  requiredPolarization: number | undefined
  isDark: boolean
  isAnimating: boolean
  getPolarizationColor: (angle: number) => string
}

function SensorSVG({ x, y, sensorState, requiredIntensity, requiredPolarization, isDark, isAnimating, getPolarizationColor }: SensorSVGProps) {
  const activated = sensorState?.activated ?? false
  const intensity = sensorState?.receivedIntensity ?? 0

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Activation glow */}
      {activated && (
        <circle r="6" fill="#22c55e" opacity="0.3">
          {isAnimating && (
            <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
          )}
        </circle>
      )}
      {/* Main body */}
      <rect
        x="-4"
        y="-4"
        width="8"
        height="8"
        rx="1.5"
        fill={activated ? '#166534' : isDark ? '#1e293b' : '#e2e8f0'}
        stroke={activated ? '#22c55e' : '#64748b'}
        strokeWidth="0.5"
      />
      {/* Lens */}
      <circle
        r="2.5"
        fill={activated ? '#4ade80' : isDark ? '#334155' : '#cbd5e1'}
        stroke={activated ? '#86efac' : '#94a3b8'}
        strokeWidth="0.3"
      >
        {activated && isAnimating && (
          <animate attributeName="opacity" values="0.8;1;0.8" dur="0.5s" repeatCount="indefinite" />
        )}
      </circle>
      {/* Status LED */}
      <circle cx="3" cy="-3" r="0.8" fill={activated ? '#22c55e' : '#ef4444'}>
        {isAnimating && (
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
        )}
      </circle>
      {/* Required intensity label */}
      <text y="7" textAnchor="middle" fill={activated ? '#22c55e' : '#94a3b8'} fontSize="1.8">
        ≥{requiredIntensity}%
      </text>
      {/* Received intensity */}
      <text y="-6" textAnchor="middle" fill={activated ? '#22c55e' : '#f97316'} fontSize="2" fontWeight="bold">
        {Math.round(intensity)}%
      </text>
      {/* Required polarization indicator */}
      {requiredPolarization !== undefined && (
        <circle
          cx="-3"
          cy="-3"
          r="1"
          fill={getPolarizationColor(requiredPolarization)}
          opacity="0.8"
        />
      )}
    </g>
  )
}
