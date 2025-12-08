/**
 * PolarCraft - 偏振光体素游戏类型定义
 */

// 光的传播方向（6个离散方向）
export type Direction = 'north' | 'south' | 'east' | 'west' | 'up' | 'down';

// 偏振角度（离散化为4个基础态）
export type PolarizationAngle = 0 | 45 | 90 | 135;

// 相位（用于干涉计算）
export type Phase = 1 | -1;

// 光数据包 - 光的基本粒子
export interface LightPacket {
  direction: Direction;
  intensity: number;        // 0-15
  polarization: PolarizationAngle;
  phase: Phase;
}

// 方块类型
export type BlockType =
  | 'air'
  | 'solid'
  | 'emitter'      // 光源
  | 'polarizer'    // 偏振片
  | 'rotator'      // 波片（旋光器）
  | 'splitter'     // 方解石（双折射晶体）
  | 'sensor'       // 光感应器
  | 'mirror';      // 反射镜

// 方块状态
export interface BlockState {
  type: BlockType;
  rotation: number;           // 方块朝向（0, 90, 180, 270度）
  polarizationAngle: PolarizationAngle;  // 对于偏振片/光源：偏振角度
  rotationAmount: number;     // 对于波片：旋转量（45或90度）
  activated: boolean;         // 对于感应器：是否被激活
  requiredIntensity: number;  // 对于感应器：所需强度阈值
  facing: Direction;          // 方块面向的方向
}

// 方块在世界中的位置
export interface BlockPosition {
  x: number;
  y: number;
  z: number;
}

// 世界中的方块
export interface WorldBlock {
  position: BlockPosition;
  state: BlockState;
}

// 光线在某个方块中的状态
export interface LightState {
  packets: LightPacket[];     // 该方块中存在的光包
}

// 三维向量
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

// 方向向量映射
export const DIRECTION_VECTORS: Record<Direction, Vec3> = {
  north: { x: 0, y: 0, z: -1 },
  south: { x: 0, y: 0, z: 1 },
  east: { x: 1, y: 0, z: 0 },
  west: { x: -1, y: 0, z: 0 },
  up: { x: 0, y: 1, z: 0 },
  down: { x: 0, y: -1, z: 0 }
};

// 反方向映射
export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
  up: 'down',
  down: 'up'
};

// 偏振角度对应的颜色（用于可视化）
export const POLARIZATION_COLORS: Record<PolarizationAngle, number> = {
  0: 0xff4444,    // 红色 - 水平
  45: 0xffaa00,   // 橙黄色 - 45度
  90: 0x44ff44,   // 绿色 - 垂直
  135: 0x4444ff   // 蓝色 - 135度
};

// 默认方块状态
export function createDefaultBlockState(type: BlockType): BlockState {
  return {
    type,
    rotation: 0,
    polarizationAngle: 0,
    rotationAmount: 45,
    activated: false,
    requiredIntensity: 8,
    facing: 'north'
  };
}

// 游戏配置
export interface GameConfig {
  worldSize: number;
  chunkSize: number;
  maxLightIntensity: number;
  lightDecayPerBlock: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  worldSize: 32,
  chunkSize: 16,
  maxLightIntensity: 15,
  lightDecayPerBlock: 0  // 光在空气中不衰减
};
