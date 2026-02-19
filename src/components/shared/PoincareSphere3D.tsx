/**
 * PoincareSphere3D - 可复用的3D庞加莱球组件
 * 基于 React Three Fiber 在3D球面上展示偏振态
 *
 * 球面坐标约定：
 * - S1 (x轴): 水平/垂直线偏振 (H/V)
 * - S3 (y轴): 右旋/左旋圆偏振 (R/L) - 垂直方向(两极)
 * - S2 (z轴): +45°/-45°线偏振 (D/A) - 深度方向
 */
import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import { useTheme } from '@/contexts/ThemeContext'
import * as THREE from 'three'

export interface PoincareSphere3DProps {
  /** 归一化 Stokes 参数 S1 (-1 ~ 1) */
  s1: number
  /** 归一化 Stokes 参数 S2 (-1 ~ 1) */
  s2: number
  /** 归一化 Stokes 参数 S3 (-1 ~ 1) */
  s3: number
  /** 容器尺寸（像素），默认 300 */
  size?: number
  /** 是否显示 S1/S2/S3 轴标签 */
  showLabels?: boolean
  /** 是否显示经纬线 */
  showGrid?: boolean
  /** 是否允许鼠标旋转，默认 true */
  interactive?: boolean
}

// 球面内部3D场景
function SphereScene({
  s1,
  s2,
  s3,
  showLabels,
  showGrid,
  isDark,
}: {
  s1: number
  s2: number
  s3: number
  showLabels: boolean
  showGrid: boolean
  isDark: boolean
}) {
  const sphereColor = isDark ? '#1e293b' : '#e2e8f0'
  const wireColor = isDark ? '#334155' : '#cbd5e1'
  const axisOpacity = isDark ? 0.8 : 0.6

  // 大圆（赤道和经线）
  const equatorPoints = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta)))
    }
    return pts
  }, [])

  const meridian1Points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 64; i++) {
      const phi = (i / 64) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(phi), Math.sin(phi), 0))
    }
    return pts
  }, [])

  const meridian2Points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 64; i++) {
      const phi = (i / 64) * Math.PI * 2
      pts.push(new THREE.Vector3(0, Math.sin(phi), Math.cos(phi)))
    }
    return pts
  }, [])

  // 当前状态在球面上的位置：S1→x, S3→y(垂直), S2→z(深度)
  const currentPosition = new THREE.Vector3(s1, s3, s2)

  return (
    <group>
      {/* 半透明球体 */}
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial
          color={sphereColor}
          transparent
          opacity={0.12}
          roughness={0.3}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 线框 */}
      {showGrid && (
        <mesh>
          <sphereGeometry args={[1.001, 16, 16]} />
          <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.2} />
        </mesh>
      )}

      {/* 大圆 */}
      <Line points={equatorPoints} color="#ef4444" lineWidth={1.5} transparent opacity={axisOpacity} />
      <Line points={meridian1Points} color="#22c55e" lineWidth={1.5} transparent opacity={axisOpacity} />
      <Line points={meridian2Points} color="#3b82f6" lineWidth={1.5} transparent opacity={axisOpacity} />

      {/* 坐标轴 */}
      <Line points={[[-1.3, 0, 0], [1.3, 0, 0]]} color="#ef4444" lineWidth={2} />
      <Line points={[[0, -1.3, 0], [0, 1.3, 0]]} color="#3b82f6" lineWidth={2} />
      <Line points={[[0, 0, -1.3], [0, 0, 1.3]]} color="#22c55e" lineWidth={2} />

      {/* 轴标签 */}
      {showLabels && (
        <>
          <Text position={[1.45, 0, 0]} fontSize={0.13} color="#ef4444" anchorX="center">
            S1
          </Text>
          <Text position={[0, 1.45, 0]} fontSize={0.13} color="#3b82f6" anchorX="center">
            S3
          </Text>
          <Text position={[0, 0, 1.45]} fontSize={0.13} color="#22c55e" anchorX="center">
            S2
          </Text>
        </>
      )}

      {/* 关键偏振态标记点 */}
      {[
        { pos: [1, 0, 0] as const, color: '#ef4444' },   // H
        { pos: [-1, 0, 0] as const, color: '#ef4444' },  // V
        { pos: [0, 0, 1] as const, color: '#22c55e' },   // +45
        { pos: [0, 0, -1] as const, color: '#22c55e' },  // -45
        { pos: [0, 1, 0] as const, color: '#3b82f6' },   // RCP
        { pos: [0, -1, 0] as const, color: '#f472b6' },  // LCP
      ].map((marker, i) => (
        <mesh key={i} position={marker.pos}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={marker.color} />
        </mesh>
      ))}

      {/* 从原点到当前状态点的虚线 */}
      <Line
        points={[[0, 0, 0], [currentPosition.x, currentPosition.y, currentPosition.z]]}
        color="#fbbf24"
        lineWidth={1.5}
        dashed
        dashSize={0.05}
        gapSize={0.03}
      />

      {/* 当前状态点 */}
      <mesh position={currentPosition}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>

      {/* 原点 */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial color={isDark ? '#94a3b8' : '#64748b'} />
      </mesh>
    </group>
  )
}

export function PoincareSphere3D({
  s1,
  s2,
  s3,
  size = 300,
  showLabels = true,
  showGrid = true,
  interactive = true,
}: PoincareSphere3DProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div style={{ width: size, height: size }}>
      <Canvas camera={{ position: [2.2, 1.3, 2.2], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <SphereScene
          s1={s1}
          s2={s2}
          s3={s3}
          showLabels={showLabels}
          showGrid={showGrid}
          isDark={isDark}
        />
        {interactive && (
          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={5}
            enableDamping
            dampingFactor={0.05}
          />
        )}
      </Canvas>
    </div>
  )
}

export default PoincareSphere3D
