/**
 * PolarCraft - 3D渲染器
 * 使用Three.js渲染体素世界和光效
 */

import * as THREE from 'three';
import {
  BlockState,
  BlockPosition,
  LightState,
  LightPacket,
  POLARIZATION_COLORS,
  DIRECTION_VECTORS
} from './types';
import { World } from './World';

// 方块材质定义
interface BlockMaterials {
  solid: THREE.MeshStandardMaterial;
  emitter: THREE.MeshStandardMaterial;
  polarizer: THREE.MeshStandardMaterial;
  rotator: THREE.MeshStandardMaterial;
  splitter: THREE.MeshStandardMaterial;
  sensor: THREE.MeshStandardMaterial;
  sensorActive: THREE.MeshStandardMaterial;
  mirror: THREE.MeshStandardMaterial;
  ground: THREE.MeshStandardMaterial;
}

/**
 * 游戏渲染器
 */
export class Renderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private world: World;

  // 方块网格
  private blockMeshes: Map<string, THREE.Mesh> = new Map();
  // 光线可视化
  private lightBeams: THREE.Group = new THREE.Group();
  // 选中高亮
  private selectionBox: THREE.LineSegments | null = null;
  // 预览方块
  private previewMesh: THREE.Mesh | null = null;

  // 材质
  private materials!: BlockMaterials;

  // 视角模式
  private polarizedVision: boolean = false;

  // 方块几何体（复用）
  private blockGeometry: THREE.BoxGeometry;

  constructor(canvas: HTMLCanvasElement, world: World) {
    this.world = world;
    this.blockGeometry = new THREE.BoxGeometry(1, 1, 1);

    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a15);
    this.scene.fog = new THREE.Fog(0x0a0a15, 20, 60);

    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 8, 10);
    this.camera.lookAt(0, 1, 0);

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 初始化材质
    this.initMaterials();

    // 添加灯光
    this.setupLighting();

    // 添加光线组到场景
    this.scene.add(this.lightBeams);

    // 监听窗口大小变化
    window.addEventListener('resize', this.onResize.bind(this));

    // 监听世界变化
    this.world.addListener(this.onWorldChange.bind(this));

    // 初始渲染所有方块
    this.renderAllBlocks();
  }

  /**
   * 初始化材质
   */
  private initMaterials(): void {
    this.materials = {
      solid: new THREE.MeshStandardMaterial({
        color: 0x444455,
        roughness: 0.8,
        metalness: 0.1
      }),
      emitter: new THREE.MeshStandardMaterial({
        color: 0xffffaa,
        emissive: 0xffff00,
        emissiveIntensity: 0.5,
        roughness: 0.3
      }),
      polarizer: new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        metalness: 0.3
      }),
      rotator: new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.5,
        roughness: 0.3
      }),
      splitter: new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.5
      }),
      sensor: new THREE.MeshStandardMaterial({
        color: 0x333344,
        roughness: 0.5,
        metalness: 0.2
      }),
      sensorActive: new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        roughness: 0.3
      }),
      mirror: new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.05,
        metalness: 0.95
      }),
      ground: new THREE.MeshStandardMaterial({
        color: 0x222233,
        roughness: 0.9,
        metalness: 0.0
      })
    };
  }

  /**
   * 设置灯光
   */
  private setupLighting(): void {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404060, 0.4);
    this.scene.add(ambientLight);

    // 主方向光
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    this.scene.add(mainLight);

    // 补光
    const fillLight = new THREE.DirectionalLight(0x6688cc, 0.3);
    fillLight.position.set(-10, 10, -10);
    this.scene.add(fillLight);

    // 点光源（用于光源方块的发光效果）
    // 这些会在渲染光源方块时动态添加
  }

  /**
   * 世界变化回调
   */
  private onWorldChange(type: string, _data: unknown): void {
    if (type === 'blockChanged' || type === 'worldCleared') {
      this.renderAllBlocks();
    }
    if (type === 'lightUpdated' || type === 'blockChanged' || type === 'worldCleared') {
      this.renderLightBeams();
    }
  }

  /**
   * 渲染所有方块
   */
  private renderAllBlocks(): void {
    // 清除现有方块网格
    for (const mesh of this.blockMeshes.values()) {
      this.scene.remove(mesh);
    }
    this.blockMeshes.clear();

    // 重新添加所有方块
    const blocks = this.world.getAllBlocks();
    for (const { position, state } of blocks) {
      this.addBlockMesh(position, state);
    }
  }

  /**
   * 添加方块网格
   */
  private addBlockMesh(position: BlockPosition, state: BlockState): void {
    const key = `${position.x},${position.y},${position.z}`;

    // 选择材质
    let material: THREE.MeshStandardMaterial;
    let geometry: THREE.BufferGeometry = this.blockGeometry;

    switch (state.type) {
      case 'solid':
        material = position.y === 0 ? this.materials.ground : this.materials.solid;
        break;
      case 'emitter':
        material = this.materials.emitter;
        break;
      case 'polarizer':
        material = this.materials.polarizer;
        // 偏振片使用扁平几何体
        geometry = new THREE.BoxGeometry(0.9, 0.9, 0.1);
        break;
      case 'rotator':
        material = this.materials.rotator;
        geometry = new THREE.BoxGeometry(0.8, 0.8, 0.2);
        break;
      case 'splitter':
        material = this.materials.splitter;
        // 菱形几何体
        geometry = new THREE.OctahedronGeometry(0.5);
        break;
      case 'sensor':
        material = state.activated ? this.materials.sensorActive : this.materials.sensor;
        break;
      case 'mirror':
        material = this.materials.mirror;
        geometry = new THREE.BoxGeometry(0.1, 0.9, 0.9);
        break;
      default:
        return; // 空气不渲染
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);

    // 根据方块朝向旋转
    if (state.type !== 'solid') {
      mesh.rotation.y = (state.rotation * Math.PI) / 180;
    }

    // 添加方块朝向指示器（用于偏振片）
    if (state.type === 'polarizer' || state.type === 'emitter') {
      this.addPolarizationIndicator(mesh, state);
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { position, state };

    this.scene.add(mesh);
    this.blockMeshes.set(key, mesh);
  }

  /**
   * 添加偏振方向指示器
   */
  private addPolarizationIndicator(parentMesh: THREE.Mesh, state: BlockState): void {
    // 创建表示偏振方向的线条
    const angle = (state.polarizationAngle * Math.PI) / 180;
    const length = 0.4;

    const points = [
      new THREE.Vector3(-Math.cos(angle) * length, -Math.sin(angle) * length, 0.06),
      new THREE.Vector3(Math.cos(angle) * length, Math.sin(angle) * length, 0.06)
    ];

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: POLARIZATION_COLORS[state.polarizationAngle],
      linewidth: 2
    });

    const line = new THREE.Line(lineGeometry, lineMaterial);
    parentMesh.add(line);

    // 添加角度文字指示器（用圆点代替）
    const dotGeometry = new THREE.SphereGeometry(0.05);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: POLARIZATION_COLORS[state.polarizationAngle]
    });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    dot.position.set(Math.cos(angle) * length, Math.sin(angle) * length, 0.08);
    parentMesh.add(dot);
  }

  /**
   * 渲染光线
   */
  private renderLightBeams(): void {
    // 清除现有光线
    while (this.lightBeams.children.length > 0) {
      const child = this.lightBeams.children[0];
      this.lightBeams.remove(child);
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        child.geometry.dispose();
      }
    }

    // 获取所有光状态
    const lightStates = this.world.getAllLightStates();

    for (const { position, state } of lightStates) {
      this.renderLightAtPosition(position, state);
    }
  }

  /**
   * 在指定位置渲染光
   */
  private renderLightAtPosition(position: BlockPosition, lightState: LightState): void {
    for (const packet of lightState.packets) {
      this.renderLightPacket(position, packet);
    }
  }

  /**
   * 渲染单个光包
   */
  private renderLightPacket(position: BlockPosition, packet: LightPacket): void {
    const brightness = packet.intensity / 15;
    const color = this.polarizedVision
      ? POLARIZATION_COLORS[packet.polarization]
      : 0xffffaa;

    // 创建光线几何体
    const dir = DIRECTION_VECTORS[packet.direction];
    const startPoint = new THREE.Vector3(
      position.x - dir.x * 0.5,
      position.y - dir.y * 0.5,
      position.z - dir.z * 0.5
    );
    const endPoint = new THREE.Vector3(
      position.x + dir.x * 0.5,
      position.y + dir.y * 0.5,
      position.z + dir.z * 0.5
    );

    // 主光束
    const beamGeometry = new THREE.CylinderGeometry(
      0.02 + brightness * 0.03,
      0.02 + brightness * 0.03,
      1,
      8
    );

    const beamMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3 + brightness * 0.5
    });

    const beam = new THREE.Mesh(beamGeometry, beamMaterial);

    // 计算光束位置和旋转
    beam.position.copy(startPoint.clone().add(endPoint).multiplyScalar(0.5));

    // 计算旋转以对齐光束方向
    const direction = new THREE.Vector3(dir.x, dir.y, dir.z);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    beam.quaternion.copy(quaternion);

    this.lightBeams.add(beam);

    // 发光效果（更大的半透明圆柱体）
    const glowGeometry = new THREE.CylinderGeometry(
      0.05 + brightness * 0.08,
      0.05 + brightness * 0.08,
      1,
      8
    );

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.1 + brightness * 0.2
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(beam.position);
    glow.quaternion.copy(beam.quaternion);

    this.lightBeams.add(glow);

    // 偏振视角模式下添加偏振方向指示
    if (this.polarizedVision) {
      this.addPolarizationArrow(position, packet);
    }
  }

  /**
   * 添加偏振方向箭头
   */
  private addPolarizationArrow(position: BlockPosition, packet: LightPacket): void {
    const angle = (packet.polarization * Math.PI) / 180;
    const color = POLARIZATION_COLORS[packet.polarization];

    // 创建小箭头指示偏振方向
    const arrowLength = 0.2;
    const arrowGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -Math.cos(angle) * arrowLength, -Math.sin(angle) * arrowLength, 0,
      Math.cos(angle) * arrowLength, Math.sin(angle) * arrowLength, 0
    ]);
    arrowGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const arrowMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8
    });

    const arrow = new THREE.Line(arrowGeometry, arrowMaterial);
    arrow.position.set(position.x, position.y, position.z);

    // 根据光传播方向旋转箭头
    const dir = DIRECTION_VECTORS[packet.direction];
    if (dir.y !== 0) {
      arrow.rotation.x = Math.PI / 2;
    } else if (dir.x !== 0) {
      arrow.rotation.y = Math.PI / 2;
    }

    this.lightBeams.add(arrow);
  }

  /**
   * 切换偏振视角模式
   */
  togglePolarizedVision(): boolean {
    this.polarizedVision = !this.polarizedVision;
    this.renderLightBeams();

    // 更新场景背景色
    if (this.polarizedVision) {
      this.scene.background = new THREE.Color(0x150505);
    } else {
      this.scene.background = new THREE.Color(0x0a0a15);
    }

    return this.polarizedVision;
  }

  /**
   * 获取偏振视角状态
   */
  isPolarizedVision(): boolean {
    return this.polarizedVision;
  }

  /**
   * 显示选择框
   */
  showSelectionBox(position: BlockPosition): void {
    this.hideSelectionBox();

    const geometry = new THREE.BoxGeometry(1.02, 1.02, 1.02);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
      color: 0x64c8ff,
      linewidth: 2
    });

    this.selectionBox = new THREE.LineSegments(edges, material);
    this.selectionBox.position.set(position.x, position.y, position.z);
    this.scene.add(this.selectionBox);
  }

  /**
   * 隐藏选择框
   */
  hideSelectionBox(): void {
    if (this.selectionBox) {
      this.scene.remove(this.selectionBox);
      this.selectionBox = null;
    }
  }

  /**
   * 显示预览方块
   */
  showPreviewBlock(position: BlockPosition, _blockType: string): void {
    this.hidePreviewBlock();

    const geometry = new THREE.BoxGeometry(0.98, 0.98, 0.98);
    const material = new THREE.MeshBasicMaterial({
      color: 0x64c8ff,
      transparent: true,
      opacity: 0.3,
      wireframe: false
    });

    this.previewMesh = new THREE.Mesh(geometry, material);
    this.previewMesh.position.set(position.x, position.y, position.z);
    this.scene.add(this.previewMesh);
  }

  /**
   * 隐藏预览方块
   */
  hidePreviewBlock(): void {
    if (this.previewMesh) {
      this.scene.remove(this.previewMesh);
      this.previewMesh = null;
    }
  }

  /**
   * 获取相机
   */
  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  /**
   * 获取场景
   */
  getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * 窗口大小变化处理
   */
  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * 渲染帧
   */
  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 射线检测
   */
  raycast(screenX: number, screenY: number): { position: BlockPosition; state: BlockState } | null {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (screenX / window.innerWidth) * 2 - 1,
      -(screenY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, this.camera);

    const meshes = Array.from(this.blockMeshes.values());
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const userData = hit.object.userData;
      if (userData && userData.position && userData.state) {
        return {
          position: userData.position,
          state: userData.state
        };
      }
    }

    return null;
  }

  /**
   * 从相机射线获取放置位置
   */
  getPlacementPosition(screenX: number, screenY: number): BlockPosition | null {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (screenX / window.innerWidth) * 2 - 1,
      -(screenY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, this.camera);

    const meshes = Array.from(this.blockMeshes.values());
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const normal = hit.face?.normal;

      if (normal && hit.object.userData?.position) {
        const blockPos = hit.object.userData.position as BlockPosition;

        // 根据击中面的法线计算放置位置
        return {
          x: blockPos.x + Math.round(normal.x),
          y: blockPos.y + Math.round(normal.y),
          z: blockPos.z + Math.round(normal.z)
        };
      }
    }

    return null;
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.renderer.dispose();
    this.blockGeometry.dispose();

    for (const mat of Object.values(this.materials)) {
      mat.dispose();
    }
  }
}
