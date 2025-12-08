import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import {
  BlockType,
  BlockState,
  BlockPosition,
  PolarizationAngle,
  createDefaultBlockState
} from '@/core/types'
import { World, TUTORIAL_LEVELS, LevelData } from '@/core/World'

export type CameraMode = 'first-person' | 'isometric' | 'top-down'
export type VisionMode = 'normal' | 'polarized'

interface GameState {
  // World instance
  world: World | null

  // Level state
  currentLevelIndex: number
  currentLevel: LevelData | null
  isLevelComplete: boolean

  // Player state
  selectedBlockType: BlockType
  selectedBlockRotation: number
  selectedPolarizationAngle: PolarizationAngle

  // View state
  visionMode: VisionMode
  cameraMode: CameraMode
  showGrid: boolean
  showHelp: boolean

  // Tutorial hints
  tutorialHints: string[]
  currentHintIndex: number
  showHint: boolean

  // Actions
  initWorld: (size?: number) => void
  loadLevel: (index: number) => void
  nextLevel: () => void
  resetLevel: () => void

  setSelectedBlockType: (type: BlockType) => void
  rotateSelectedBlock: () => void

  placeBlock: (position: BlockPosition) => void
  removeBlock: (position: BlockPosition) => void
  rotateBlockAt: (position: BlockPosition) => void

  toggleVisionMode: () => void
  setCameraMode: (mode: CameraMode) => void
  toggleGrid: () => void
  toggleHelp: () => void

  showNextHint: () => void
  hideHint: () => void

  checkLevelCompletion: () => boolean
}

// Tutorial hints per level
const TUTORIAL_HINTS: Record<number, string[]> = {
  0: [
    '光源正在发射偏振光。观察光线是否到达感应器。',
    '按 R 旋转光源改变偏振角度，使感应器激活。',
    '按 V 切换偏振视角，可以看到光的偏振颜色。'
  ],
  1: [
    '光需要通过偏振片。按 R 调整偏振片角度。',
    '马吕斯定律：光强 = 原强度 × cos²(角度差)'
  ],
  2: [
    '两个偏振片串联时，90°角度差会完全阻挡光线！',
    '尝试找到让光通过的角度组合。'
  ],
  3: [
    '波片可以旋转光的偏振方向而不损失强度。',
    '按 R 改变波片的旋转量（45°或90°）'
  ],
  4: [
    '方解石（双折射晶体）将光分裂成两束垂直偏振的光。',
    '尝试激活两个不同偏振角度的感应器。'
  ]
}

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    world: null,
    currentLevelIndex: 0,
    currentLevel: null,
    isLevelComplete: false,

    selectedBlockType: 'emitter',
    selectedBlockRotation: 0,
    selectedPolarizationAngle: 0,

    visionMode: 'normal',
    cameraMode: 'first-person',
    showGrid: true,
    showHelp: false,

    tutorialHints: [],
    currentHintIndex: 0,
    showHint: false,

    // Actions
    initWorld: (size = 32) => {
      const world = new World(size)
      set({ world })
    },

    loadLevel: (index: number) => {
      const { world } = get()
      if (!world) return

      const level = TUTORIAL_LEVELS[index]
      if (!level) return

      world.loadLevel(level)

      set({
        currentLevelIndex: index,
        currentLevel: level,
        isLevelComplete: false,
        tutorialHints: TUTORIAL_HINTS[index] || [],
        currentHintIndex: 0,
        showHint: true
      })
    },

    nextLevel: () => {
      const { currentLevelIndex, loadLevel } = get()
      if (currentLevelIndex < TUTORIAL_LEVELS.length - 1) {
        loadLevel(currentLevelIndex + 1)
      }
    },

    resetLevel: () => {
      const { currentLevelIndex, loadLevel } = get()
      loadLevel(currentLevelIndex)
    },

    setSelectedBlockType: (type: BlockType) => {
      set({ selectedBlockType: type, selectedBlockRotation: 0 })
    },

    rotateSelectedBlock: () => {
      set(state => ({
        selectedBlockRotation: (state.selectedBlockRotation + 90) % 360
      }))
    },

    placeBlock: (position: BlockPosition) => {
      const { world, selectedBlockType, selectedBlockRotation, selectedPolarizationAngle } = get()
      if (!world) return

      const blockState = createDefaultBlockState(selectedBlockType)
      blockState.rotation = selectedBlockRotation
      blockState.polarizationAngle = selectedPolarizationAngle

      world.setBlock(position.x, position.y, position.z, blockState)
      get().checkLevelCompletion()
    },

    removeBlock: (position: BlockPosition) => {
      const { world } = get()
      if (!world) return

      // Don't remove ground blocks
      if (position.y === 0) return

      world.setBlock(position.x, position.y, position.z, createDefaultBlockState('air'))
      get().checkLevelCompletion()
    },

    rotateBlockAt: (position: BlockPosition) => {
      const { world } = get()
      if (!world) return

      const block = world.getBlock(position.x, position.y, position.z)
      if (!block || block.type === 'solid' || block.type === 'air') return

      // Create a copy and rotate
      const newState: BlockState = { ...block }

      // For polarizers and emitters, rotate polarization angle
      if (block.type === 'polarizer' || block.type === 'emitter' || block.type === 'sensor') {
        newState.polarizationAngle = ((block.polarizationAngle + 45) % 180) as PolarizationAngle
      }
      // For rotators, toggle rotation amount
      else if (block.type === 'rotator') {
        newState.rotationAmount = block.rotationAmount === 45 ? 90 : 45
      }
      // For mirrors and splitters, rotate facing
      else {
        newState.rotation = (block.rotation + 90) % 360
      }

      world.setBlock(position.x, position.y, position.z, newState)
      get().checkLevelCompletion()
    },

    toggleVisionMode: () => {
      set(state => ({
        visionMode: state.visionMode === 'normal' ? 'polarized' : 'normal'
      }))
    },

    setCameraMode: (mode: CameraMode) => {
      set({ cameraMode: mode })
    },

    toggleGrid: () => {
      set(state => ({ showGrid: !state.showGrid }))
    },

    toggleHelp: () => {
      set(state => ({ showHelp: !state.showHelp }))
    },

    showNextHint: () => {
      const { tutorialHints, currentHintIndex } = get()
      if (currentHintIndex < tutorialHints.length - 1) {
        set({ currentHintIndex: currentHintIndex + 1, showHint: true })
      } else {
        set({ showHint: false })
      }
    },

    hideHint: () => {
      set({ showHint: false })
    },

    checkLevelCompletion: () => {
      const { world, currentLevel } = get()
      if (!world || !currentLevel) return false

      // Check if all required sensors are activated
      const goal = currentLevel.goal
      if (!goal?.sensorPositions) return false

      const allActivated = goal.sensorPositions.every(pos => {
        const block = world.getBlock(pos.x, pos.y, pos.z)
        return block?.type === 'sensor' && block.activated
      })

      if (allActivated) {
        set({ isLevelComplete: true })
      }

      return allActivated
    }
  }))
)

// Subscribe to world changes
export const subscribeToWorldChanges = (callback: () => void) => {
  const { world } = useGameStore.getState()
  if (world) {
    world.addListener(() => {
      callback()
    })
  }
}
