/**
 * CommandHistory - 命令历史系统 (撤销/重做)
 *
 * 实现命令模式(Command Pattern)，记录所有方块操作。
 * 支持无限撤销/重做栈和操作回放。
 */

import { BlockState, BlockPosition, createDefaultBlockState } from './types'

/** 单个操作命令 */
export interface GameCommand {
  /** 操作类型 */
  type: 'place' | 'remove' | 'rotate'
  /** 操作位置 */
  position: BlockPosition
  /** 执行前的方块状态 (用于撤销) */
  previousState: BlockState | null
  /** 执行后的方块状态 (用于重做) */
  newState: BlockState | null
  /** 操作时间戳 */
  timestamp: number
}

/** 操作历史管理器 */
export class CommandHistory {
  private undoStack: GameCommand[] = []
  private redoStack: GameCommand[] = []
  private maxHistorySize: number

  constructor(maxHistorySize: number = 500) {
    this.maxHistorySize = maxHistorySize
  }

  /** 记录一个新操作 */
  push(command: GameCommand): void {
    this.undoStack.push(command)
    // 新操作清空redo栈
    this.redoStack.length = 0

    // 防止历史过大
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift()
    }
  }

  /** 撤销上一个操作，返回需要恢复的命令 */
  undo(): GameCommand | null {
    const command = this.undoStack.pop()
    if (!command) return null
    this.redoStack.push(command)
    return command
  }

  /** 重做上一个撤销的操作 */
  redo(): GameCommand | null {
    const command = this.redoStack.pop()
    if (!command) return null
    this.undoStack.push(command)
    return command
  }

  /** 是否可以撤销 */
  get canUndo(): boolean {
    return this.undoStack.length > 0
  }

  /** 是否可以重做 */
  get canRedo(): boolean {
    return this.redoStack.length > 0
  }

  /** 撤销栈大小 */
  get undoCount(): number {
    return this.undoStack.length
  }

  /** 重做栈大小 */
  get redoCount(): number {
    return this.redoStack.length
  }

  /** 获取完整操作历史 (用于回放) */
  getHistory(): readonly GameCommand[] {
    return this.undoStack
  }

  /** 清空历史 */
  clear(): void {
    this.undoStack.length = 0
    this.redoStack.length = 0
  }

  /** 创建放置命令 */
  static createPlaceCommand(
    position: BlockPosition,
    previousState: BlockState | null,
    newState: BlockState
  ): GameCommand {
    return {
      type: 'place',
      position: { ...position },
      previousState: previousState ? { ...previousState } : null,
      newState: { ...newState },
      timestamp: Date.now(),
    }
  }

  /** 创建删除命令 */
  static createRemoveCommand(
    position: BlockPosition,
    previousState: BlockState
  ): GameCommand {
    return {
      type: 'remove',
      position: { ...position },
      previousState: { ...previousState },
      newState: createDefaultBlockState('air'),
      timestamp: Date.now(),
    }
  }

  /** 创建旋转命令 */
  static createRotateCommand(
    position: BlockPosition,
    previousState: BlockState,
    newState: BlockState
  ): GameCommand {
    return {
      type: 'rotate',
      position: { ...position },
      previousState: { ...previousState },
      newState: { ...newState },
      timestamp: Date.now(),
    }
  }
}
