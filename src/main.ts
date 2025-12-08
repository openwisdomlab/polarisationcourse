/**
 * PolarCraft - 偏振光体素解谜游戏
 * 主入口文件
 */

import { World, TUTORIAL_LEVELS } from './World';
import { Renderer } from './Renderer';
import { PlayerControls } from './PlayerControls';

/**
 * 游戏主类
 */
class Game {
  private world: World;
  private renderer: Renderer;
  private controls: PlayerControls;
  private lastTime: number = 0;
  private isRunning: boolean = false;

  constructor() {
    // 获取画布
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas not found');
    }

    // 创建世界
    this.world = new World(32);

    // 创建渲染器
    this.renderer = new Renderer(canvas, this.world);

    // 创建玩家控制
    this.controls = new PlayerControls(
      this.renderer.getCamera(),
      this.world,
      this.renderer
    );

    // 设置初始位置
    this.controls.setPosition(5, 3, 10);

    // 初始化UI
    this.initUI();

    // 加载第一个教程关卡
    this.loadTutorialLevel(0);

    // 隐藏加载界面
    setTimeout(() => {
      const loadingEl = document.getElementById('loading');
      if (loadingEl) {
        loadingEl.style.opacity = '0';
        loadingEl.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          loadingEl.style.display = 'none';
        }, 500);
      }
    }, 1000);
  }

  /**
   * 初始化UI
   */
  private initUI(): void {
    // 方块选择器点击事件
    const slots = document.querySelectorAll('.block-slot');
    slots.forEach((slot, index) => {
      slot.addEventListener('click', () => {
        // 模拟数字键按下
        const event = new KeyboardEvent('keydown', { key: String(index + 1) });
        document.dispatchEvent(event);
      });
    });

    // 帮助面板关闭按钮
    const closeBtn = document.querySelector('#help-panel .close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const panel = document.getElementById('help-panel');
        if (panel) {
          panel.classList.remove('visible');
        }
      });
    }

    // 添加关卡选择按钮
    this.createLevelSelector();
  }

  /**
   * 创建关卡选择器
   */
  private createLevelSelector(): void {
    const infoBar = document.getElementById('info-bar');
    if (!infoBar) return;

    const levelSelect = document.createElement('div');
    levelSelect.style.marginTop = '10px';
    levelSelect.innerHTML = `
      <span style="color: #64c8ff; font-size: 12px;">关卡: </span>
      ${TUTORIAL_LEVELS.map((_level, i) => `
        <button class="level-btn" data-level="${i}" style="
          background: rgba(100, 200, 255, 0.2);
          border: 1px solid rgba(100, 200, 255, 0.3);
          color: #fff;
          padding: 4px 8px;
          margin: 2px;
          cursor: pointer;
          font-size: 11px;
          border-radius: 4px;
        ">${i + 1}</button>
      `).join('')}
      <button class="level-btn" data-level="-1" style="
        background: rgba(255, 100, 100, 0.2);
        border: 1px solid rgba(255, 100, 100, 0.3);
        color: #fff;
        padding: 4px 8px;
        margin: 2px;
        cursor: pointer;
        font-size: 11px;
        border-radius: 4px;
      ">沙盒</button>
    `;

    infoBar.appendChild(levelSelect);

    // 添加点击事件
    levelSelect.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const levelIndex = parseInt((e.target as HTMLElement).dataset.level || '0');
        if (levelIndex === -1) {
          this.world.clear();
          this.updateLevelInfo('沙盒模式', '自由建造和实验！');
        } else {
          this.loadTutorialLevel(levelIndex);
        }
      });
    });
  }

  /**
   * 加载教程关卡
   */
  private loadTutorialLevel(index: number): void {
    if (index >= 0 && index < TUTORIAL_LEVELS.length) {
      const level = TUTORIAL_LEVELS[index];
      this.world.loadLevel(level);
      this.updateLevelInfo(level.name, level.description);
      this.controls.setPosition(5, 3, 10);
    }
  }

  /**
   * 更新关卡信息显示
   */
  private updateLevelInfo(name: string, description: string): void {
    const infoBar = document.getElementById('info-bar');
    if (infoBar) {
      const h2 = infoBar.querySelector('h2');
      const p = infoBar.querySelector('p');
      if (h2) h2.textContent = `⟡ ${name}`;
      if (p) {
        p.innerHTML = `${description}<br><br>
        <span style="color: #666;">WASD 移动 | 空格 跳跃 | 左键 放置 | 右键 删除 | R 旋转 | V 偏振视角 | H 帮助</span>`;
      }
    }
  }

  /**
   * 开始游戏循环
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  /**
   * 游戏循环
   */
  private gameLoop(): void {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // 更新
    this.update(deltaTime);

    // 渲染
    this.render();

    // 下一帧
    requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * 更新游戏状态
   */
  private update(deltaTime: number): void {
    this.controls.update(deltaTime);
  }

  /**
   * 渲染
   */
  private render(): void {
    this.renderer.render();
  }

  /**
   * 停止游戏
   */
  stop(): void {
    this.isRunning = false;
  }
}

// 全局帮助切换函数（用于HTML中的onclick）
(window as unknown as { toggleHelp: () => void }).toggleHelp = function() {
  const panel = document.getElementById('help-panel');
  if (panel) {
    panel.classList.toggle('visible');
  }
};

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.start();

  // 调试用
  (window as unknown as { game: Game }).game = game;
});
