/**
 * PolarCraft - 玩家控制系统
 * 第一人称相机控制和方块交互
 */

import * as THREE from 'three';
import { BlockPosition, BlockType, createDefaultBlockState, Direction } from './types';
import { World } from './World';
import { Renderer } from './Renderer';

/**
 * 玩家控制类
 */
export class PlayerControls {
  private camera: THREE.PerspectiveCamera;
  private world: World;
  private renderer: Renderer;

  // 玩家状态
  private position: THREE.Vector3 = new THREE.Vector3(5, 5, 10);
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private rotation: { x: number; y: number } = { x: 0, y: 0 };

  // 运动参数
  private moveSpeed: number = 8;
  private jumpSpeed: number = 8;
  private gravity: number = 20;
  private mouseSensitivity: number = 0.002;

  // 输入状态
  private keys: Set<string> = new Set();
  private isPointerLocked: boolean = false;

  // 当前选中的方块类型
  private selectedBlockType: BlockType = 'emitter';

  // 回调函数
  private onBlockTypeChange?: (type: BlockType) => void;
  private onVisionModeChange?: (polarized: boolean) => void;

  constructor(camera: THREE.PerspectiveCamera, world: World, renderer: Renderer) {
    this.camera = camera;
    this.world = world;
    this.renderer = renderer;

    this.setupEventListeners();
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    // 键盘事件
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));

    // 鼠标事件
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mousedown', this.onMouseDown.bind(this));

    // 指针锁定
    document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this));

    // 点击画布请求指针锁定
    const canvas = document.getElementById('canvas');
    if (canvas) {
      canvas.addEventListener('click', () => {
        if (!this.isPointerLocked) {
          canvas.requestPointerLock();
        }
      });
    }
  }

  /**
   * 键盘按下
   */
  private onKeyDown(event: KeyboardEvent): void {
    this.keys.add(event.code);

    // 数字键选择方块
    const blockTypes: BlockType[] = ['emitter', 'polarizer', 'rotator', 'splitter', 'sensor', 'mirror', 'solid'];
    const keyNum = parseInt(event.key);
    if (keyNum >= 1 && keyNum <= 7) {
      this.selectedBlockType = blockTypes[keyNum - 1];
      this.onBlockTypeChange?.(this.selectedBlockType);
      this.updateBlockSelector();
    }

    // V键切换偏振视角
    if (event.code === 'KeyV') {
      const polarized = this.renderer.togglePolarizedVision();
      this.updateVisionModeUI(polarized);
      this.onVisionModeChange?.(polarized);
    }

    // R键旋转选中的方块
    if (event.code === 'KeyR') {
      this.rotateSelectedBlock();
    }

    // H键显示/隐藏帮助
    if (event.code === 'KeyH') {
      this.toggleHelp();
    }

    // ESC键退出指针锁定
    if (event.code === 'Escape') {
      // 浏览器会自动处理
    }
  }

  /**
   * 键盘松开
   */
  private onKeyUp(event: KeyboardEvent): void {
    this.keys.delete(event.code);
  }

  /**
   * 鼠标移动
   */
  private onMouseMove(event: MouseEvent): void {
    if (!this.isPointerLocked) return;

    // 更新视角旋转
    this.rotation.y -= event.movementX * this.mouseSensitivity;
    this.rotation.x -= event.movementY * this.mouseSensitivity;

    // 限制垂直视角
    this.rotation.x = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, this.rotation.x));

    // 更新相机旋转
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.rotation.y;
    this.camera.rotation.x = this.rotation.x;
  }

  /**
   * 鼠标点击
   */
  private onMouseDown(event: MouseEvent): void {
    if (!this.isPointerLocked) return;

    const screenCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    if (event.button === 0) {
      // 左键：放置方块
      this.placeBlock(screenCenter.x, screenCenter.y);
    } else if (event.button === 2) {
      // 右键：删除方块
      this.removeBlock(screenCenter.x, screenCenter.y);
    }
  }

  /**
   * 指针锁定状态变化
   */
  private onPointerLockChange(): void {
    this.isPointerLocked = document.pointerLockElement !== null;
  }

  /**
   * 放置方块
   */
  private placeBlock(screenX: number, screenY: number): void {
    const placement = this.renderer.getPlacementPosition(screenX, screenY);

    if (placement) {
      // 检查位置是否已有方块
      const existing = this.world.getBlock(placement.x, placement.y, placement.z);
      if (existing) return;

      // 不允许在玩家脚下放置
      const playerBlockX = Math.floor(this.position.x);
      const playerBlockY = Math.floor(this.position.y);
      const playerBlockZ = Math.floor(this.position.z);

      if (placement.x === playerBlockX &&
          (placement.y === playerBlockY || placement.y === playerBlockY - 1) &&
          placement.z === playerBlockZ) {
        return;
      }

      const state = createDefaultBlockState(this.selectedBlockType);

      // 设置方块朝向为玩家面对的方向
      state.facing = this.getPlayerFacingDirection();
      state.rotation = this.getPlayerFacingRotation();

      this.world.setBlock(placement.x, placement.y, placement.z, state);
    }
  }

  /**
   * 删除方块
   */
  private removeBlock(screenX: number, screenY: number): void {
    const hit = this.renderer.raycast(screenX, screenY);

    if (hit && hit.state.type !== 'solid') {
      // 不删除地面
      if (hit.position.y === 0) return;

      this.world.removeBlock(hit.position.x, hit.position.y, hit.position.z);
    }
  }

  /**
   * 旋转选中的方块
   */
  private rotateSelectedBlock(): void {
    const screenCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const hit = this.renderer.raycast(screenCenter.x, screenCenter.y);

    if (hit && hit.state.type !== 'solid' && hit.state.type !== 'air') {
      this.world.rotateBlock(hit.position.x, hit.position.y, hit.position.z);
      this.updateSelectedInfo(hit);
    }
  }

  /**
   * 获取玩家面对的方向
   */
  private getPlayerFacingDirection(): Direction {
    const yaw = this.rotation.y;
    const normalized = ((yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    if (normalized < Math.PI / 4 || normalized >= Math.PI * 7 / 4) {
      return 'south';
    } else if (normalized < Math.PI * 3 / 4) {
      return 'west';
    } else if (normalized < Math.PI * 5 / 4) {
      return 'north';
    } else {
      return 'east';
    }
  }

  /**
   * 获取玩家面对方向对应的旋转角度
   */
  private getPlayerFacingRotation(): number {
    const dir = this.getPlayerFacingDirection();
    const rotations: Record<Direction, number> = {
      north: 0,
      east: 90,
      south: 180,
      west: 270,
      up: 0,
      down: 0
    };
    return rotations[dir];
  }

  /**
   * 更新方块选择器UI
   */
  private updateBlockSelector(): void {
    const slots = document.querySelectorAll('.block-slot');
    slots.forEach(slot => {
      const blockType = (slot as HTMLElement).dataset.block;
      slot.classList.toggle('selected', blockType === this.selectedBlockType);
    });
  }

  /**
   * 更新视角模式UI
   */
  private updateVisionModeUI(polarized: boolean): void {
    const indicator = document.getElementById('vision-mode');
    if (indicator) {
      if (polarized) {
        indicator.textContent = '🔴 偏振视角';
        indicator.classList.add('polarized');
      } else {
        indicator.textContent = '👁 普通视角';
        indicator.classList.remove('polarized');
      }
    }
  }

  /**
   * 更新选中方块信息
   */
  private updateSelectedInfo(hit: { position: BlockPosition; state: import('./types').BlockState }): void {
    const infoEl = document.getElementById('selected-info');
    if (!infoEl) return;

    const state = hit.state;
    let info = `${state.type}`;

    if (state.type === 'polarizer' || state.type === 'emitter') {
      info += ` | 偏振角: ${state.polarizationAngle}°`;
    } else if (state.type === 'rotator') {
      info += ` | 旋转量: ${state.rotationAmount}°`;
    } else if (state.type === 'sensor') {
      info += ` | 需要: ${state.polarizationAngle}° | ${state.activated ? '激活' : '未激活'}`;
    }

    infoEl.textContent = info;
    infoEl.classList.add('visible');

    // 3秒后隐藏
    setTimeout(() => {
      infoEl.classList.remove('visible');
    }, 3000);
  }

  /**
   * 切换帮助面板
   */
  private toggleHelp(): void {
    const panel = document.getElementById('help-panel');
    if (panel) {
      panel.classList.toggle('visible');
    }
  }

  /**
   * 更新玩家位置
   */
  update(deltaTime: number): void {
    if (!this.isPointerLocked) return;

    // 移动方向
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    // 计算前进方向（忽略垂直分量）
    forward.set(
      -Math.sin(this.rotation.y),
      0,
      -Math.cos(this.rotation.y)
    ).normalize();

    // 计算右方向
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // 处理输入
    const moveDirection = new THREE.Vector3();

    if (this.keys.has('KeyW')) moveDirection.add(forward);
    if (this.keys.has('KeyS')) moveDirection.sub(forward);
    if (this.keys.has('KeyD')) moveDirection.add(right);
    if (this.keys.has('KeyA')) moveDirection.sub(right);

    if (moveDirection.length() > 0) {
      moveDirection.normalize();
    }

    // 应用移动
    this.velocity.x = moveDirection.x * this.moveSpeed;
    this.velocity.z = moveDirection.z * this.moveSpeed;

    // 跳跃
    if (this.keys.has('Space') && this.isOnGround()) {
      this.velocity.y = this.jumpSpeed;
    }

    // 重力
    this.velocity.y -= this.gravity * deltaTime;

    // 更新位置
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.position.z += this.velocity.z * deltaTime;

    // 简单碰撞检测（地面）
    const groundY = this.getGroundHeight(this.position.x, this.position.z);
    if (this.position.y < groundY + 1.7) {
      this.position.y = groundY + 1.7;
      this.velocity.y = 0;
    }

    // 更新相机位置
    this.camera.position.copy(this.position);

    // 更新选择框
    this.updateSelectionBox();
  }

  /**
   * 检查是否在地面上
   */
  private isOnGround(): boolean {
    const groundY = this.getGroundHeight(this.position.x, this.position.z);
    return this.position.y <= groundY + 1.75;
  }

  /**
   * 获取地面高度
   */
  private getGroundHeight(x: number, z: number): number {
    const blockX = Math.floor(x);
    const blockZ = Math.floor(z);

    // 从上往下检查方块
    for (let y = 20; y >= 0; y--) {
      const block = this.world.getBlock(blockX, y, blockZ);
      if (block && block.type === 'solid') {
        return y + 1;
      }
    }

    return 1; // 默认地面高度
  }

  /**
   * 更新选择框
   */
  private updateSelectionBox(): void {
    const screenCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const hit = this.renderer.raycast(screenCenter.x, screenCenter.y);

    if (hit && hit.state.type !== 'air') {
      this.renderer.showSelectionBox(hit.position);
    } else {
      this.renderer.hideSelectionBox();
    }

    // 显示预览方块
    const placement = this.renderer.getPlacementPosition(screenCenter.x, screenCenter.y);
    if (placement && !this.world.getBlock(placement.x, placement.y, placement.z)) {
      this.renderer.showPreviewBlock(placement, this.selectedBlockType);
    } else {
      this.renderer.hidePreviewBlock();
    }
  }

  /**
   * 设置回调函数
   */
  setOnBlockTypeChange(callback: (type: BlockType) => void): void {
    this.onBlockTypeChange = callback;
  }

  setOnVisionModeChange(callback: (polarized: boolean) => void): void {
    this.onVisionModeChange = callback;
  }

  /**
   * 获取当前选中的方块类型
   */
  getSelectedBlockType(): BlockType {
    return this.selectedBlockType;
  }

  /**
   * 设置玩家位置
   */
  setPosition(x: number, y: number, z: number): void {
    this.position.set(x, y, z);
    this.camera.position.copy(this.position);
  }
}
