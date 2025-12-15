/**
 * Game2D Page - CSS-based 2D polarization puzzle game
 * Complex open-ended puzzles with mirrors, splitters, rotators and multiple light paths
 * Inspired by Monument Valley and Shadowmatic aesthetics
 *
 * 重构版本: 使用共享的光学组件库和物理计算库
 *
 * Phase 1 Update: Jones Calculus support for interference and circular polarization
 */

import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Lightbulb,
  Trophy,
  Info,
  Play,
  Pause,
  Eye,
  Zap,
  Settings2,
  RotateCw,
  X,
  Keyboard,
  Atom,
  FlaskConical,
} from 'lucide-react'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useIsMobile'
import { PersistentHeader } from '@/components/shared/PersistentHeader'

// Import shared modules
import { getPolarizationColor, POLARIZATION_DISPLAY_CONFIG } from '@/lib/polarization'
import {
  EmitterSVG,
  PolarizerSVG,
  MirrorSVG,
  SplitterSVG,
  RotatorSVG,
  SensorSVG,
  LightBeamSVG,
  LightBeamDefs,
} from '@/components/shared/optical'
import type { OpticalComponent } from '@/components/shared/optical/types'

// Import both light tracers for comparison/fallback
import { useLightTracer } from '@/hooks/useLightTracer'
import { useJonesLightTracerLegacy } from '@/hooks/useJonesLightTracer'

// Import advanced levels
import { ADVANCED_LEVELS, type AdvancedLevel } from '@/core/game2d/advancedLevels'

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
  gridSize: { width: number; height: number }
  openEnded?: boolean
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
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
  // === NEW EXPERT+ LEVELS - Escape Room Style ===
  {
    id: 11,
    name: 'The Locked Room',
    nameZh: '密室逃脱',
    description: 'Navigate light through a complex maze of mirrors to unlock all sensors',
    descriptionZh: '在复杂的镜面迷宫中引导光线，解锁所有传感器',
    hint: 'Think about the light path backwards from each sensor',
    hintZh: '尝试从每个传感器倒推光路',
    difficulty: 'expert',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      { id: 'e1', type: 'emitter', x: 10, y: 15, angle: 0, polarizationAngle: 45, direction: 'right', locked: true },
      { id: 'm1', type: 'mirror', x: 30, y: 15, angle: 45, locked: false },
      { id: 'p1', type: 'polarizer', x: 30, y: 40, angle: 0, polarizationAngle: 45, locked: false },
      { id: 'm2', type: 'mirror', x: 30, y: 65, angle: 135, locked: false },
      { id: 'm3', type: 'mirror', x: 60, y: 65, angle: 45, locked: false },
      { id: 'r1', type: 'rotator', x: 60, y: 40, angle: 0, rotationAmount: 90, locked: false },
      { id: 'm4', type: 'mirror', x: 60, y: 15, angle: 135, locked: false },
      { id: 's1', type: 'sensor', x: 90, y: 15, angle: 0, requiredIntensity: 35, requiredPolarization: 135, locked: true },
      { id: 's2', type: 'sensor', x: 60, y: 90, angle: 0, requiredIntensity: 35, locked: true },
    ],
  },
  {
    id: 12,
    name: 'Triple Lock',
    nameZh: '三重锁',
    description: 'Activate three sensors in sequence - each with different requirements',
    descriptionZh: '依次激活三个传感器——每个都有不同的要求',
    difficulty: 'expert',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      { id: 'e1', type: 'emitter', x: 10, y: 50, angle: 0, polarizationAngle: 0, direction: 'right', locked: true },
      { id: 'sp1', type: 'splitter', x: 30, y: 50, angle: 0, locked: true },
      { id: 'r1', type: 'rotator', x: 30, y: 25, angle: 0, rotationAmount: 45, locked: false },
      { id: 'p1', type: 'polarizer', x: 50, y: 25, angle: 0, polarizationAngle: 45, locked: false },
      { id: 'm1', type: 'mirror', x: 70, y: 25, angle: 45, locked: false },
      { id: 's1', type: 'sensor', x: 70, y: 10, angle: 0, requiredIntensity: 40, requiredPolarization: 45, locked: true },
      { id: 'p2', type: 'polarizer', x: 50, y: 50, angle: 0, polarizationAngle: 0, locked: false },
      { id: 's2', type: 'sensor', x: 70, y: 50, angle: 0, requiredIntensity: 45, requiredPolarization: 0, locked: true },
      { id: 'sp2', type: 'splitter', x: 30, y: 75, angle: 0, locked: true },
      { id: 'm2', type: 'mirror', x: 50, y: 75, angle: 45, locked: false },
      { id: 'p3', type: 'polarizer', x: 50, y: 90, angle: 0, polarizationAngle: 90, locked: false },
      { id: 's3', type: 'sensor', x: 70, y: 90, angle: 0, requiredIntensity: 25, requiredPolarization: 90, locked: true },
    ],
  },
  {
    id: 13,
    name: 'Precision Calibration',
    nameZh: '精密校准',
    description: 'Achieve exactly 25% intensity using cascaded polarizers - mathematical precision required',
    descriptionZh: '使用级联偏振片达到精确的25%强度——需要数学精度',
    hint: 'cos²(45°) × cos²(45°) = 0.5 × 0.5 = 0.25',
    hintZh: 'cos²(45°) × cos²(45°) = 0.5 × 0.5 = 0.25',
    difficulty: 'expert',
    gridSize: { width: 100, height: 100 },
    components: [
      { id: 'e1', type: 'emitter', x: 50, y: 5, angle: 0, polarizationAngle: 0, direction: 'down', locked: true },
      { id: 'p1', type: 'polarizer', x: 50, y: 20, angle: 0, polarizationAngle: 30, locked: false },
      { id: 'p2', type: 'polarizer', x: 50, y: 35, angle: 0, polarizationAngle: 60, locked: false },
      { id: 'p3', type: 'polarizer', x: 50, y: 50, angle: 0, polarizationAngle: 90, locked: false },
      { id: 'p4', type: 'polarizer', x: 50, y: 65, angle: 0, polarizationAngle: 45, locked: false },
      { id: 'p5', type: 'polarizer', x: 50, y: 80, angle: 0, polarizationAngle: 0, locked: false },
      { id: 's1', type: 'sensor', x: 50, y: 95, angle: 0, requiredIntensity: 25, locked: true },
    ],
  },
  {
    id: 14,
    name: 'The Vault',
    nameZh: '光学保险库',
    description: 'Four sensors guard the vault - all must be activated simultaneously with precise polarizations',
    descriptionZh: '四个传感器守护着保险库——必须同时以精确的偏振激活所有传感器',
    difficulty: 'expert',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      { id: 'e1', type: 'emitter', x: 50, y: 50, angle: 0, polarizationAngle: 45, direction: 'right', locked: true },
      { id: 'sp1', type: 'splitter', x: 70, y: 50, angle: 0, locked: true },
      { id: 'm1', type: 'mirror', x: 70, y: 25, angle: 135, locked: false },
      { id: 'p1', type: 'polarizer', x: 50, y: 25, angle: 0, polarizationAngle: 90, locked: false },
      { id: 's1', type: 'sensor', x: 25, y: 25, angle: 0, requiredIntensity: 35, requiredPolarization: 90, locked: true },
      { id: 'm2', type: 'mirror', x: 90, y: 50, angle: 45, locked: false },
      { id: 'r1', type: 'rotator', x: 90, y: 25, angle: 0, rotationAmount: 45, locked: false },
      { id: 's2', type: 'sensor', x: 90, y: 10, angle: 0, requiredIntensity: 35, requiredPolarization: 45, locked: true },
      { id: 'e2', type: 'emitter', x: 50, y: 50, angle: 0, polarizationAngle: 45, direction: 'down', locked: true },
      { id: 'sp2', type: 'splitter', x: 50, y: 70, angle: 0, locked: true },
      { id: 'm3', type: 'mirror', x: 25, y: 70, angle: 45, locked: false },
      { id: 'p2', type: 'polarizer', x: 25, y: 90, angle: 0, polarizationAngle: 0, locked: false },
      { id: 's3', type: 'sensor', x: 10, y: 90, angle: 0, requiredIntensity: 35, requiredPolarization: 0, locked: true },
      { id: 'm4', type: 'mirror', x: 75, y: 70, angle: 135, locked: false },
      { id: 's4', type: 'sensor', x: 90, y: 70, angle: 0, requiredIntensity: 35, locked: true },
    ],
  },
  {
    id: 15,
    name: 'Master of Light',
    nameZh: '光之大师',
    description: 'The ultimate challenge - combine all optical principles in this complex multi-path puzzle',
    descriptionZh: '终极挑战——在这个复杂的多路径谜题中综合运用所有光学原理',
    difficulty: 'expert',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      // Two light sources at different positions
      { id: 'e1', type: 'emitter', x: 10, y: 20, angle: 0, polarizationAngle: 0, direction: 'right', locked: true },
      { id: 'e2', type: 'emitter', x: 10, y: 80, angle: 0, polarizationAngle: 90, direction: 'right', locked: true },
      // Upper path components
      { id: 'sp1', type: 'splitter', x: 30, y: 20, angle: 0, locked: true },
      { id: 'r1', type: 'rotator', x: 30, y: 40, angle: 0, rotationAmount: 45, locked: false },
      { id: 'm1', type: 'mirror', x: 55, y: 20, angle: 45, locked: false },
      { id: 'p1', type: 'polarizer', x: 55, y: 40, angle: 0, polarizationAngle: 45, locked: false },
      // Lower path components
      { id: 'sp2', type: 'splitter', x: 30, y: 80, angle: 0, locked: true },
      { id: 'm2', type: 'mirror', x: 55, y: 80, angle: 135, locked: false },
      { id: 'p2', type: 'polarizer', x: 55, y: 60, angle: 0, polarizationAngle: 90, locked: false },
      // Convergence zone
      { id: 'm3', type: 'mirror', x: 75, y: 40, angle: 45, locked: false },
      { id: 'm4', type: 'mirror', x: 75, y: 60, angle: 135, locked: false },
      { id: 'r2', type: 'rotator', x: 75, y: 50, angle: 0, rotationAmount: 90, locked: false },
      // Five sensors - the ultimate test
      { id: 's1', type: 'sensor', x: 30, y: 5, angle: 0, requiredIntensity: 45, requiredPolarization: 90, locked: true },
      { id: 's2', type: 'sensor', x: 90, y: 20, angle: 0, requiredIntensity: 30, requiredPolarization: 45, locked: true },
      { id: 's3', type: 'sensor', x: 90, y: 50, angle: 0, requiredIntensity: 35, locked: true },
      { id: 's4', type: 'sensor', x: 90, y: 80, angle: 0, requiredIntensity: 30, requiredPolarization: 0, locked: true },
      { id: 's5', type: 'sensor', x: 30, y: 95, angle: 0, requiredIntensity: 45, requiredPolarization: 0, locked: true },
    ],
  },
]

// Game mode type
type GameMode = 'classic' | 'advanced'

export function Game2DPage() {
  const { t, i18n } = useTranslation()
  void t
  const { theme } = useTheme()
  const { isMobile, isTablet } = useIsMobile()
  const isZh = i18n.language === 'zh'
  const isCompact = isMobile || isTablet

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [componentStates, setComponentStates] = useState<Record<string, Partial<OpticalComponent>>>({})
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)
  const [showPolarization, setShowPolarization] = useState(true)
  const [showMobileInfo, setShowMobileInfo] = useState(false)

  // NEW: Game mode toggle (classic vs advanced Jones physics)
  const [gameMode, setGameMode] = useState<GameMode>('advanced')
  const [showAdvancedLevels, setShowAdvancedLevels] = useState(false)
  const [currentAdvancedIndex, setCurrentAdvancedIndex] = useState(0)

  // Current level based on mode
  const currentLevel = showAdvancedLevels
    ? ADVANCED_LEVELS[currentAdvancedIndex]
    : LEVELS[currentLevelIndex]
  const isDark = theme === 'dark'

  // Initialize component states when level changes
  useEffect(() => {
    const initialStates: Record<string, Partial<OpticalComponent>> = {}
    currentLevel.components.forEach((c) => {
      initialStates[c.id] = {
        angle: c.angle,
        polarizationAngle: c.polarizationAngle,
        rotationAmount: c.rotationAmount,
        phaseShift: (c as any).phaseShift,
      }
    })
    setComponentStates(initialStates)
    setIsComplete(false)
    setSelectedComponent(null)
    setShowHint(false)
  }, [currentLevelIndex, currentAdvancedIndex, showAdvancedLevels, currentLevel.components])

  // Use appropriate light tracer based on game mode
  // Classic mode: original scalar physics
  // Advanced mode: full Jones calculus with interference
  const classicResult = useLightTracer(
    currentLevel.components,
    componentStates
  )
  const jonesResult = useJonesLightTracerLegacy(
    currentLevel.components,
    componentStates
  )

  // Select tracer result based on mode
  const { beams: lightBeams, sensorStates } = gameMode === 'advanced' ? jonesResult : classicResult

  // Check win condition
  useEffect(() => {
    const allSensorsActivated = sensorStates.length > 0 && sensorStates.every((s) => s.activated)
    if (allSensorsActivated && !isComplete) {
      setIsComplete(true)
    }
  }, [sensorStates, isComplete])

  // Get current state of a component
  const getComponentState = useCallback(
    (component: OpticalComponent) => {
      const state = componentStates[component.id] || {}
      return {
        ...component,
        angle: state.angle ?? component.angle,
        polarizationAngle: state.polarizationAngle ?? component.polarizationAngle,
        rotationAmount: state.rotationAmount ?? component.rotationAmount,
      }
    },
    [componentStates]
  )

  // Handle component rotation
  const handleRotate = (
    id: string,
    delta: number,
    property: 'angle' | 'polarizationAngle' | 'rotationAmount'
  ) => {
    const component = currentLevel.components.find((c) => c.id === id)
    if (!component || component.locked) return

    setComponentStates((prev) => {
      const current = prev[id] || {}
      let newValue: number

      if (property === 'rotationAmount') {
        // Toggle between 45 and 90
        newValue = (current.rotationAmount ?? component.rotationAmount ?? 45) === 45 ? 90 : 45
      } else {
        const currentVal = current[property] ?? (component[property as keyof OpticalComponent] as number) ?? 0
        newValue = (currentVal + delta + 360) % 360
        if (property === 'polarizationAngle') {
          newValue = newValue % 180
        }
      }

      return {
        ...prev,
        [id]: {
          ...current,
          [property]: newValue,
        },
      }
    })
    setIsComplete(false)
  }

  const handleReset = useCallback(() => {
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
  }, [currentLevel.components])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'r':
          // Reset level
          handleReset()
          break
        case 'h':
          // Toggle hint (if available)
          if (currentLevel.hint) {
            setShowHint((prev) => !prev)
          }
          break
        case 'escape':
          // Deselect component
          setSelectedComponent(null)
          break
        case 'n':
        case ']':
          // Next level
          if (showAdvancedLevels) {
            if (currentAdvancedIndex < ADVANCED_LEVELS.length - 1) {
              setCurrentAdvancedIndex(currentAdvancedIndex + 1)
            }
          } else {
            if (currentLevelIndex < LEVELS.length - 1) {
              setCurrentLevelIndex(currentLevelIndex + 1)
            }
          }
          break
        case 'p':
        case '[':
          // Previous level
          if (showAdvancedLevels) {
            if (currentAdvancedIndex > 0) {
              setCurrentAdvancedIndex(currentAdvancedIndex - 1)
            }
          } else {
            if (currentLevelIndex > 0) {
              setCurrentLevelIndex(currentLevelIndex - 1)
            }
          }
          break
        case 'm':
          // Toggle game mode
          setGameMode((prev) => (prev === 'classic' ? 'advanced' : 'classic'))
          break
        case 'v':
          // Toggle polarization colors
          setShowPolarization((prev) => !prev)
          break
        case ' ':
          // Toggle animation
          e.preventDefault()
          setIsAnimating((prev) => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentLevelIndex, currentAdvancedIndex, showAdvancedLevels, currentLevel.hint, handleReset])

  const goToNextLevel = () => {
    if (showAdvancedLevels) {
      if (currentAdvancedIndex < ADVANCED_LEVELS.length - 1) {
        setCurrentAdvancedIndex(currentAdvancedIndex + 1)
      }
    } else {
      if (currentLevelIndex < LEVELS.length - 1) {
        setCurrentLevelIndex(currentLevelIndex + 1)
      }
    }
  }

  const goToPrevLevel = () => {
    if (showAdvancedLevels) {
      if (currentAdvancedIndex > 0) {
        setCurrentAdvancedIndex(currentAdvancedIndex - 1)
      }
    } else {
      if (currentLevelIndex > 0) {
        setCurrentLevelIndex(currentLevelIndex - 1)
      }
    }
  }

  // Current level index for display
  const displayLevelIndex = showAdvancedLevels ? currentAdvancedIndex : currentLevelIndex
  const totalLevels = showAdvancedLevels ? ADVANCED_LEVELS.length : LEVELS.length

  // Difficulty colors (extended for advanced levels)
  const difficultyColors: Record<string, string> = {
    easy: 'text-green-400 bg-green-500/20 border-green-500/30',
    medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    hard: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    expert: 'text-red-400 bg-red-500/20 border-red-500/30',
    // Advanced difficulty levels
    master: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    grandmaster: 'text-pink-400 bg-pink-500/20 border-pink-500/30',
    legendary: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
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
      {/* Header with Persistent Logo */}
      <PersistentHeader
        moduleKey="polarquest"
        moduleName="PolarCraft 2D"
        variant="solid"
        compact={isCompact}
        showSettings={!isCompact}
        rightContent={
          <div className="flex items-center gap-2">
            {!isCompact && (
              <>
                <Link
                  to="/game"
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
                  )}
                  title={t('game.title')}
                >
                  <Zap className="w-5 h-5" />
                </Link>
                <Link
                  to="/demos"
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
                  )}
                  title={t('demos.title')}
                >
                  <BookOpen className="w-5 h-5" />
                </Link>
              </>
            )}
            {isCompact && (
              <button
                onClick={() => setShowMobileInfo(!showMobileInfo)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showMobileInfo
                    ? isDark ? 'bg-cyan-400/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
                    : isDark ? 'text-slate-300' : 'text-slate-600'
                )}
              >
                <Info className="w-4 h-4" />
              </button>
            )}
            {isCompact && <LanguageThemeSwitcher compact />}
          </div>
        }
      />

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col lg:flex-row overflow-hidden",
        isCompact ? "gap-2 p-2" : "gap-6 p-4 lg:p-6"
      )}>
        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center">
          {/* Level Info */}
          <div className={cn("text-center", isCompact ? "mb-2" : "mb-4")}>
            {/* Mode Toggle */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <button
                onClick={() => setShowAdvancedLevels(false)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                  !showAdvancedLevels
                    ? 'bg-cyan-500 text-white'
                    : isDark
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                )}
              >
                {isZh ? '经典关卡' : 'Classic'}
              </button>
              <button
                onClick={() => setShowAdvancedLevels(true)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1',
                  showAdvancedLevels
                    ? 'bg-purple-500 text-white'
                    : isDark
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                )}
              >
                <Atom className="w-3 h-3" />
                {isZh ? '量子物理' : 'Quantum'}
              </button>
              {/* Physics Mode Indicator */}
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-xs',
                  gameMode === 'advanced'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                )}
                title={gameMode === 'advanced' ? 'Jones Calculus (Full Physics)' : 'Scalar Physics (Simplified)'}
              >
                {gameMode === 'advanced' ? 'Jones' : 'Scalar'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 mb-2">
              <button
                onClick={goToPrevLevel}
                disabled={displayLevelIndex === 0}
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
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full border',
                      difficultyColors[currentLevel.difficulty]
                    )}
                  >
                    {isZh
                      ? {
                          easy: '简单',
                          medium: '中等',
                          hard: '困难',
                          expert: '专家',
                          master: '大师',
                          grandmaster: '宗师',
                          legendary: '传奇',
                        }[currentLevel.difficulty] ?? currentLevel.difficulty
                      : currentLevel.difficulty}
                  </span>
                </div>
                <span className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
                  {displayLevelIndex + 1} / {totalLevels}
                  {showAdvancedLevels && (
                    <span className="ml-2 text-purple-400">
                      ({(currentLevel as AdvancedLevel).category})
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={goToNextLevel}
                disabled={displayLevelIndex === totalLevels - 1}
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
            {/* Show concepts for advanced levels */}
            {showAdvancedLevels && (currentLevel as AdvancedLevel).concepts && (
              <div className={cn('mt-2 text-xs', isDark ? 'text-purple-300/70' : 'text-purple-600/70')}>
                <FlaskConical className="w-3 h-3 inline mr-1" />
                {isZh
                  ? (currentLevel as AdvancedLevel).conceptsZh?.slice(0, 2).join(' • ')
                  : (currentLevel as AdvancedLevel).concepts?.slice(0, 2).join(' • ')}
              </div>
            )}
          </div>

          {/* Game Canvas - SVG-based */}
          <div
            className={cn(
              'relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden shadow-2xl',
              isDark
                ? 'bg-slate-900/90 border border-cyan-500/20'
                : 'bg-white border border-slate-200'
            )}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              style={{ background: isDark ? '#0a0a1a' : '#f8fafc' }}
            >
              {/* Grid background and filters */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke={isDark ? '#1e293b' : '#e2e8f0'}
                    strokeWidth="0.2"
                  />
                </pattern>
                {/* 使用共享的滤镜和渐变定义 */}
                <LightBeamDefs />
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />

              {/* Light beams - 使用共享组件 */}
              {lightBeams.map((beam, i) => (
                <LightBeamSVG
                  key={i}
                  beam={beam}
                  showPolarization={showPolarization}
                  isAnimating={isAnimating}
                  getPolarizationColor={getPolarizationColor}
                />
              ))}

              {/* Render components - 使用共享组件 */}
              {currentLevel.components.map((component) => {
                const state = getComponentState(component)
                const isSelected = selectedComponent === component.id

                return (
                  <g key={component.id}>
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
                      <SplitterSVG x={state.x} y={state.y} isDark={isDark} />
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
                        sensorState={sensorStates.find((s) => s.id === component.id)}
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
            <div className={cn('absolute top-3 left-3 flex flex-col gap-2 text-xs')}>
              {/* Polarization toggle */}
              <button
                onClick={() => setShowPolarization(!showPolarization)}
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all',
                  showPolarization
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : isDark
                      ? 'bg-slate-800/80 text-slate-400'
                      : 'bg-slate-200 text-slate-600'
                )}
              >
                <Eye className="w-3 h-3" />
                {isZh ? '偏振色' : 'Polarization'}
              </button>
            </div>

            {/* Sensors status */}
            <div
              className={cn(
                'absolute top-3 right-3 px-3 py-2 rounded-lg text-xs font-mono',
                isDark ? 'bg-slate-800/90 text-slate-300' : 'bg-white/90 text-slate-700'
              )}
            >
              {sensorStates.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <span
                    className={cn('w-2 h-2 rounded-full', s.activated ? 'bg-green-400' : 'bg-slate-500')}
                  />
                  <span>
                    S{i + 1}: {Math.round(s.receivedIntensity)}%
                  </span>
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
                      {isZh
                        ? '这是开放性关卡，可能有多种解法'
                        : 'Open-ended puzzle - multiple solutions exist'}
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
          <div className={cn(
            "flex items-center flex-wrap justify-center",
            isCompact ? "gap-2 mt-2" : "gap-3 mt-4"
          )}>
            {/* Mobile rotation controls - show when component is selected */}
            {isCompact && selectedComponent && (() => {
              const component = currentLevel.components.find((c) => c.id === selectedComponent)
              if (!component || component.locked) return null

              const isRotator = component.type === 'rotator'
              const isMirror = component.type === 'mirror'

              return (
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg",
                  isDark ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-cyan-100 border border-cyan-300'
                )}>
                  <span className={cn("text-xs mr-1", isDark ? 'text-cyan-400' : 'text-cyan-600')}>
                    {isZh ? '旋转' : 'Rotate'}:
                  </span>
                  {isRotator ? (
                    <button
                      onClick={() => handleRotate(selectedComponent, 0, 'rotationAmount')}
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        isDark ? 'bg-cyan-400/30 text-cyan-300' : 'bg-cyan-200 text-cyan-700'
                      )}
                    >
                      {getComponentState(component).rotationAmount === 45 ? '45° → 90°' : '90° → 45°'}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRotate(selectedComponent, isMirror ? -45 : -15, isMirror ? 'angle' : 'polarizationAngle')}
                        className={cn(
                          "p-1.5 rounded",
                          isDark ? 'bg-cyan-400/30 text-cyan-300' : 'bg-cyan-200 text-cyan-700'
                        )}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRotate(selectedComponent, isMirror ? 45 : 15, isMirror ? 'angle' : 'polarizationAngle')}
                        className={cn(
                          "p-1.5 rounded",
                          isDark ? 'bg-cyan-400/30 text-cyan-300' : 'bg-cyan-200 text-cyan-700'
                        )}
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )
            })()}

            <button
              onClick={handleReset}
              className={cn(
                'flex items-center gap-2 rounded-lg transition-colors',
                isCompact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2',
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              )}
            >
              <RotateCcw className={cn(isCompact ? "w-3 h-3" : "w-4 h-4")} />
              {!isCompact && (isZh ? '重置' : 'Reset')}
            </button>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={cn(
                'flex items-center gap-2 rounded-lg transition-colors',
                isCompact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2',
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              )}
            >
              {isAnimating ? <Pause className={cn(isCompact ? "w-3 h-3" : "w-4 h-4")} /> : <Play className={cn(isCompact ? "w-3 h-3" : "w-4 h-4")} />}
              {!isCompact && (isAnimating ? (isZh ? '暂停' : 'Pause') : isZh ? '播放' : 'Play')}
            </button>
            {currentLevel.hint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={cn(
                  'flex items-center gap-2 rounded-lg transition-colors',
                  isCompact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2',
                  showHint
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                )}
              >
                <Lightbulb className={cn(isCompact ? "w-3 h-3" : "w-4 h-4")} />
                {!isCompact && (isZh ? '提示' : 'Hint')}
              </button>
            )}
          </div>

          {/* Hint display */}
          {showHint && currentLevel.hint && (
            <div
              className={cn(
                'mt-3 px-4 py-2 rounded-lg text-sm max-w-md text-center',
                'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300'
              )}
            >
              {isZh ? currentLevel.hintZh : currentLevel.hint}
            </div>
          )}
        </div>

        {/* Info Panel - Desktop always visible, Mobile toggle */}
        <div
          className={cn(
            'rounded-2xl overflow-y-auto',
            isCompact
              ? showMobileInfo
                ? 'fixed inset-x-2 top-16 bottom-2 z-50 p-3'
                : 'hidden'
              : 'w-full lg:w-80 p-4 lg:p-6 lg:max-h-[calc(100vh-120px)]',
            isDark
              ? 'bg-slate-900/95 border border-slate-700/50'
              : 'bg-white/95 border border-slate-200'
          )}
        >
          {/* Close button for mobile */}
          {isCompact && showMobileInfo && (
            <button
              onClick={() => setShowMobileInfo(false)}
              className={cn(
                "absolute top-2 right-2 p-1 rounded-lg",
                isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-200'
              )}
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {/* Component Guide */}
          <div className="mb-6">
            <h3
              className={cn(
                'font-bold mb-3 flex items-center gap-2',
                isDark ? 'text-white' : 'text-slate-800'
              )}
            >
              <Settings2 className="w-4 h-4" />
              {isZh ? '元件说明' : 'Components'}
            </h3>
            <div className={cn('space-y-2 text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs">
                  S
                </span>
                <span>{isZh ? '光源 - 发射偏振光' : 'Emitter - emits polarized light'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-blue-500/30 border border-blue-500 flex items-center justify-center text-xs">
                  P
                </span>
                <span>{isZh ? '偏振片 - 过滤偏振方向' : 'Polarizer - filters polarization'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-slate-400/30 border border-slate-400 flex items-center justify-center text-xs">
                  M
                </span>
                <span>{isZh ? '镜子 - 反射光线' : 'Mirror - reflects light'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-cyan-500/30 border border-cyan-500 flex items-center justify-center text-xs">
                  B
                </span>
                <span>{isZh ? '分光器 - 分离偏振' : 'Splitter - separates polarizations'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-purple-500/30 border border-purple-500 flex items-center justify-center text-xs">
                  R
                </span>
                <span>{isZh ? '波片 - 旋转偏振方向' : 'Rotator - rotates polarization'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-500/30 border border-green-500 flex items-center justify-center text-xs">
                  D
                </span>
                <span>{isZh ? '传感器 - 检测光线' : 'Sensor - detects light'}</span>
              </div>
            </div>
          </div>

          {/* Physics Info */}
          <div className="mb-6">
            <h3
              className={cn(
                'font-bold mb-3 flex items-center gap-2',
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              )}
            >
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

          {/* Keyboard Shortcuts - only show on desktop */}
          {!isCompact && (
            <div className="mb-6">
              <h3
                className={cn(
                  'font-bold mb-3 flex items-center gap-2',
                  isDark ? 'text-white' : 'text-slate-800'
                )}
              >
                <Keyboard className="w-4 h-4" />
                {isZh ? '快捷键' : 'Shortcuts'}
              </h3>
              <div className={cn('space-y-1 text-xs', isDark ? 'text-slate-400' : 'text-slate-600')}>
                <div className="flex justify-between">
                  <span>← →</span>
                  <span>{isZh ? '旋转选中元件' : 'Rotate component'}</span>
                </div>
                <div className="flex justify-between">
                  <span>R</span>
                  <span>{isZh ? '重置关卡' : 'Reset level'}</span>
                </div>
                <div className="flex justify-between">
                  <span>H</span>
                  <span>{isZh ? '显示提示' : 'Toggle hint'}</span>
                </div>
                <div className="flex justify-between">
                  <span>V</span>
                  <span>{isZh ? '切换偏振色' : 'Toggle colors'}</span>
                </div>
                <div className="flex justify-between">
                  <span>N / ]</span>
                  <span>{isZh ? '下一关' : 'Next level'}</span>
                </div>
                <div className="flex justify-between">
                  <span>P / [</span>
                  <span>{isZh ? '上一关' : 'Prev level'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Esc</span>
                  <span>{isZh ? '取消选择' : 'Deselect'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isZh ? '空格' : 'Space'}</span>
                  <span>{isZh ? '暂停/播放' : 'Pause/Play'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Polarization colors - 使用共享配置 */}
          {showPolarization && (
            <div className="mb-6">
              <h3 className={cn('font-bold mb-3', isDark ? 'text-white' : 'text-slate-800')}>
                {isZh ? '偏振颜色' : 'Polarization Colors'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {POLARIZATION_DISPLAY_CONFIG.map(({ angle, label, color }) => (
                  <div key={angle} className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
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
