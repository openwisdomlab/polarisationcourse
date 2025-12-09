/**
 * PolarCraft - 光物理引擎
 * 实现偏振光的四大公理
 */

import {
  LightPacket,
  Direction,
  PolarizationAngle,
  Phase,
  BlockState,
  OPPOSITE_DIRECTION
} from './types';

/**
 * 光物理引擎 - 实现偏振光的核心物理规则
 */
export class LightPhysics {

  /**
   * 公理一：正交不干涉 (Orthogonality)
   * 检查两个偏振角度是否正交（相差90度）
   */
  static isOrthogonal(angle1: PolarizationAngle, angle2: PolarizationAngle): boolean {
    const diff = Math.abs(angle1 - angle2);
    return diff === 90;
  }

  /**
   * 公理二：马吕斯定律 (Malus Law)
   * 计算光通过偏振片后的强度
   * I = I₀ × cos²(θ)
   *
   * @param inputIntensity 输入光强度
   * @param inputAngle 输入光偏振角
   * @param filterAngle 偏振片角度
   * @returns 输出强度（向下取整）
   */
  static applyMalusLaw(
    inputIntensity: number,
    inputAngle: PolarizationAngle,
    filterAngle: PolarizationAngle
  ): number {
    // 计算角度差（以度为单位）
    let angleDiff = Math.abs(inputAngle - filterAngle);
    // 处理大于90度的情况
    if (angleDiff > 90) {
      angleDiff = 180 - angleDiff;
    }

    // 转换为弧度
    const radians = (angleDiff * Math.PI) / 180;

    // 应用马吕斯定律
    const transmissionFactor = Math.pow(Math.cos(radians), 2);

    return Math.floor(inputIntensity * transmissionFactor);
  }

  /**
   * 公理三：双折射分叉 (Birefringence Splitting)
   * 将一束光分解为两束正交偏振的光
   *
   * @param input 输入光包
   * @param crystalFacing 晶体朝向（决定e光折射方向）
   * @returns 两个光包：o光（直射）和e光（折射）
   */
  static splitLight(input: LightPacket, crystalFacing: Direction): [LightPacket, LightPacket] {
    // 将输入光分解为0度和90度两个分量
    // 使用向量分解：分量强度与cos²和sin²成正比
    const radians = (input.polarization * Math.PI) / 180;

    // o光强度（与cos²成正比）
    const oIntensity = Math.floor(input.intensity * Math.pow(Math.cos(radians), 2));
    // e光强度（与sin²成正比）
    const eIntensity = Math.floor(input.intensity * Math.pow(Math.sin(radians), 2));

    // o光：0度偏振，继续原方向
    const oLight: LightPacket = {
      direction: input.direction,
      intensity: oIntensity,
      polarization: 0,
      phase: input.phase
    };

    // e光：90度偏振，折射方向（基于晶体朝向）
    const eLight: LightPacket = {
      direction: this.getRefractedDirection(input.direction, crystalFacing),
      intensity: eIntensity,
      polarization: 90,
      phase: input.phase
    };

    return [oLight, eLight];
  }

  /**
   * 公理四：干涉叠加 (Interference)
   * 计算两束光的干涉结果
   * 同相叠加，反相抵消
   *
   * @param lights 同一位置的光包数组
   * @returns 干涉后的光包数组
   */
  static calculateInterference(lights: LightPacket[]): LightPacket[] {
    if (lights.length === 0) return [];
    if (lights.length === 1) return lights;

    // 按方向和偏振角分组
    const groups = new Map<string, LightPacket[]>();

    for (const light of lights) {
      // 正交的光不干涉，所以我们按(方向, 偏振角)分组
      const key = `${light.direction}_${light.polarization}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(light);
    }

    const result: LightPacket[] = [];

    for (const [, groupLights] of groups) {
      if (groupLights.length === 1) {
        result.push(groupLights[0]);
        continue;
      }

      // 计算干涉
      // 正相(+1)和正相(+1) = 强度相加
      // 正相(+1)和反相(-1) = 强度相减
      let positiveSum = 0;
      let negativeSum = 0;

      for (const light of groupLights) {
        if (light.phase === 1) {
          positiveSum += light.intensity;
        } else {
          negativeSum += light.intensity;
        }
      }

      const netIntensity = Math.abs(positiveSum - negativeSum);
      const resultPhase: Phase = positiveSum >= negativeSum ? 1 : -1;

      if (netIntensity > 0) {
        result.push({
          direction: groupLights[0].direction,
          intensity: Math.min(netIntensity, 15), // 最大强度15
          polarization: groupLights[0].polarization,
          phase: resultPhase
        });
      }
    }

    return result;
  }

  /**
   * 处理光通过偏振片
   */
  static processPolarizerBlock(input: LightPacket, blockState: BlockState): LightPacket | null {
    const filterAngle = blockState.polarizationAngle;
    const newIntensity = this.applyMalusLaw(input.intensity, input.polarization, filterAngle);

    if (newIntensity <= 0) {
      return null; // 光被完全吸收
    }

    return {
      direction: input.direction,
      intensity: newIntensity,
      polarization: filterAngle, // 光的偏振角变为偏振片角度
      phase: input.phase
    };
  }

  /**
   * 处理光通过波片（旋光器）
   */
  static processRotatorBlock(input: LightPacket, blockState: BlockState): LightPacket {
    const rotationAmount = blockState.rotationAmount;
    let newAngle = (input.polarization + rotationAmount) % 180;

    // 确保角度是有效的PolarizationAngle
    newAngle = this.normalizeAngle(newAngle);

    return {
      direction: input.direction,
      intensity: input.intensity, // 波片不损失强度
      polarization: newAngle as PolarizationAngle,
      phase: input.phase
    };
  }

  /**
   * 处理光通过方解石（双折射晶体）
   */
  static processSplitterBlock(input: LightPacket, blockState: BlockState): LightPacket[] {
    const [oLight, eLight] = this.splitLight(input, blockState.facing);
    const result: LightPacket[] = [];

    if (oLight.intensity > 0) result.push(oLight);
    if (eLight.intensity > 0) result.push(eLight);

    return result;
  }

  /**
   * 处理光通过反射镜
   */
  static processMirrorBlock(input: LightPacket, blockState: BlockState): LightPacket | null {
    // 反射镜只反射从正面来的光
    const mirrorFacing = blockState.facing;
    const inputFrom = OPPOSITE_DIRECTION[input.direction];

    // 检查光是否从镜子正面来
    if (!this.isLightHittingMirror(inputFrom, mirrorFacing)) {
      return null; // 光从背面穿过，不反射
    }

    // 计算反射方向
    const reflectedDirection = this.getReflectedDirection(input.direction, mirrorFacing);

    return {
      direction: reflectedDirection,
      intensity: input.intensity, // 镜面反射不损失强度
      polarization: input.polarization,
      phase: input.phase
    };
  }

  /**
   * 检查光是否击中镜子正面
   */
  private static isLightHittingMirror(lightFrom: Direction, mirrorFacing: Direction): boolean {
    // 简化：镜子面向的方向和光来的方向相同时才反射
    return lightFrom === mirrorFacing;
  }

  /**
   * 计算反射方向
   */
  private static getReflectedDirection(inputDirection: Direction, _mirrorFacing: Direction): Direction {
    // 简化的反射逻辑：根据镜子朝向决定反射方向
    // 镜子面向north，光从south来（向north走），反射后向south走
    // 对于简单的轴对齐镜子，反射方向是入射方向的反方向
    // 更复杂的45度镜子可以稍后实现
    return OPPOSITE_DIRECTION[inputDirection];
  }

  /**
   * 计算折射方向（用于双折射晶体）
   */
  private static getRefractedDirection(inputDirection: Direction, crystalFacing: Direction): Direction {
    // 简化：e光向晶体面向方向的垂直方向折射
    // 实际实现会更复杂，这里用简单的规则
    const horizontalDirs: Direction[] = ['north', 'south', 'east', 'west'];

    if (horizontalDirs.includes(inputDirection)) {
      // 水平入射，e光向右折射（相对于入射方向）
      return this.getPerpendicularDirection(inputDirection);
    } else {
      // 垂直入射，e光向任一水平方向折射
      return crystalFacing;
    }
  }

  /**
   * 获取垂直方向（右手法则）
   */
  private static getPerpendicularDirection(dir: Direction): Direction {
    const perpMap: Record<Direction, Direction> = {
      north: 'east',
      east: 'south',
      south: 'west',
      west: 'north',
      up: 'north',
      down: 'south'
    };
    return perpMap[dir];
  }

  /**
   * 将角度标准化到有效的偏振角度
   */
  private static normalizeAngle(angle: number): PolarizationAngle {
    // 将角度限制在0-180范围内
    angle = ((angle % 180) + 180) % 180;

    // 找到最接近的有效角度
    const validAngles: PolarizationAngle[] = [0, 45, 90, 135];
    let closest = validAngles[0];
    let minDiff = Math.abs(angle - validAngles[0]);

    for (const valid of validAngles) {
      const diff = Math.abs(angle - valid);
      if (diff < minDiff) {
        minDiff = diff;
        closest = valid;
      }
    }

    return closest;
  }

  /**
   * 根据方块旋转获取实际朝向
   */
  static getActualFacing(baseFacing: Direction, rotation: number): Direction {
    if (baseFacing === 'up' || baseFacing === 'down') {
      return baseFacing; // 垂直方向不受水平旋转影响
    }

    const horizontalOrder: Direction[] = ['north', 'east', 'south', 'west'];
    const baseIndex = horizontalOrder.indexOf(baseFacing);
    const rotationSteps = Math.floor(rotation / 90) % 4;
    const newIndex = (baseIndex + rotationSteps) % 4;

    return horizontalOrder[newIndex];
  }

  /**
   * 计算光强度对应的颜色亮度
   */
  static getIntensityBrightness(intensity: number): number {
    return intensity / 15;
  }

  // ============== 高级方块物理处理 ==============

  /**
   * 处理光通过吸收器
   * 吸收器按比例降低光强度
   */
  static processAbsorberBlock(input: LightPacket, blockState: BlockState): LightPacket | null {
    const absorptionRate = blockState.absorptionRate ?? 0.5;
    const transmittedIntensity = Math.floor(input.intensity * (1 - absorptionRate));

    if (transmittedIntensity <= 0) {
      return null;
    }

    return {
      direction: input.direction,
      intensity: transmittedIntensity,
      polarization: input.polarization,
      phase: input.phase
    };
  }

  /**
   * 处理光通过相位调制器
   * 改变光的相位（用于干涉）
   */
  static processPhaseShifterBlock(input: LightPacket, blockState: BlockState): LightPacket {
    const phaseShift = blockState.phaseShift ?? 0;

    // 相位偏移：0° = 无变化，180° = 反相
    // 简化模型：90°和270°暂时不改变相位（更精确的模型需要复数表示）
    let newPhase = input.phase;
    if (phaseShift === 180) {
      newPhase = input.phase === 1 ? -1 : 1;
    }

    return {
      direction: input.direction,
      intensity: input.intensity,
      polarization: input.polarization,
      phase: newPhase
    };
  }

  /**
   * 处理光通过分束器
   * 将光分成两束：一束透射，一束反射
   */
  static processBeamSplitterBlock(
    input: LightPacket,
    blockState: BlockState
  ): LightPacket[] {
    const splitRatio = blockState.splitRatio ?? 0.5;

    // 透射光（继续原方向）
    const transmittedIntensity = Math.floor(input.intensity * splitRatio);
    // 反射光（垂直方向）
    const reflectedIntensity = Math.floor(input.intensity * (1 - splitRatio));

    const result: LightPacket[] = [];

    if (transmittedIntensity > 0) {
      result.push({
        direction: input.direction,
        intensity: transmittedIntensity,
        polarization: input.polarization,
        phase: input.phase
      });
    }

    if (reflectedIntensity > 0) {
      // 反射光方向：垂直于入射方向
      const reflectedDirection = this.getPerpendicularDirection(input.direction);
      result.push({
        direction: reflectedDirection,
        intensity: reflectedIntensity,
        polarization: input.polarization,
        phase: input.phase
      });
    }

    return result;
  }

  /**
   * 处理光通过四分之一波片
   * 将线偏振光转换为圆偏振光（简化模型：旋转45度）
   */
  static processQuarterWaveBlock(input: LightPacket, _blockState: BlockState): LightPacket {
    // 四分之一波片引入90度相位差
    // 简化模型：旋转偏振角45度
    const newAngle = this.normalizeAngle(input.polarization + 45);

    return {
      direction: input.direction,
      intensity: input.intensity,
      polarization: newAngle as PolarizationAngle,
      phase: input.phase
    };
  }

  /**
   * 处理光通过二分之一波片
   * 翻转偏振方向（镜像关于快轴）
   */
  static processHalfWaveBlock(input: LightPacket, _blockState: BlockState): LightPacket {
    // 二分之一波片：偏振角关于快轴镜像
    // 简化模型：旋转90度（相当于翻转）
    const newAngle = this.normalizeAngle(input.polarization + 90);

    return {
      direction: input.direction,
      intensity: input.intensity,
      polarization: newAngle as PolarizationAngle,
      phase: input.phase
    };
  }

  /**
   * 处理光通过棱镜
   * 折射并可选择性地产生色散效果
   * 简化模型：改变光的方向（向facing方向偏折）
   */
  static processPrismBlock(input: LightPacket, blockState: BlockState): LightPacket {
    // 棱镜折射：光线向棱镜朝向方向偏折
    const prismFacing = blockState.facing;
    let newDirection = input.direction;

    // 如果光线与棱镜朝向垂直，则偏折
    if (this.areDirectionsPerpendicular(input.direction, prismFacing)) {
      newDirection = prismFacing;
    }

    return {
      direction: newDirection,
      intensity: input.intensity,
      polarization: input.polarization,
      phase: input.phase
    };
  }

  /**
   * 处理光通过透镜
   * 聚焦（正焦距）或发散（负焦距）光线
   * 简化模型：正焦距保持方向，负焦距可能发散
   */
  static processLensBlock(input: LightPacket, blockState: BlockState): LightPacket[] {
    const focalLength = blockState.focalLength ?? 2;
    const isConverging = focalLength > 0;

    if (isConverging) {
      // 聚焦透镜：光继续原方向（简化模型）
      return [{
        direction: input.direction,
        intensity: input.intensity,
        polarization: input.polarization,
        phase: input.phase
      }];
    } else {
      // 发散透镜：光分成多个方向（简化为两束）
      const intensity1 = Math.floor(input.intensity * 0.5);
      const intensity2 = input.intensity - intensity1;

      const result: LightPacket[] = [];

      if (intensity1 > 0) {
        result.push({
          direction: input.direction,
          intensity: intensity1,
          polarization: input.polarization,
          phase: input.phase
        });
      }

      if (intensity2 > 0) {
        result.push({
          direction: this.getPerpendicularDirection(input.direction),
          intensity: intensity2,
          polarization: input.polarization,
          phase: input.phase
        });
      }

      return result;
    }
  }

  /**
   * 检查两个方向是否垂直
   */
  private static areDirectionsPerpendicular(dir1: Direction, dir2: Direction): boolean {
    const horizontal: Direction[] = ['north', 'south', 'east', 'west'];
    const vertical: Direction[] = ['up', 'down'];

    // 水平和垂直方向互相垂直
    if ((horizontal.includes(dir1) && vertical.includes(dir2)) ||
        (vertical.includes(dir1) && horizontal.includes(dir2))) {
      return true;
    }

    // 水平方向中的垂直关系
    const perpPairs: [Direction, Direction][] = [
      ['north', 'east'], ['north', 'west'],
      ['south', 'east'], ['south', 'west']
    ];

    for (const [a, b] of perpPairs) {
      if ((dir1 === a && dir2 === b) || (dir1 === b && dir2 === a)) {
        return true;
      }
    }

    return false;
  }
}
