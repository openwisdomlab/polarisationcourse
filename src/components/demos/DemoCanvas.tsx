/**
 * DemoCanvas - 演示用的R3F画布包装器
 */
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { ReactNode } from 'react'

interface DemoCanvasProps {
  children: ReactNode
  showGrid?: boolean
  cameraPosition?: [number, number, number]
  orthographic?: boolean
}

export function DemoCanvas({
  children,
  showGrid = true,
  cameraPosition = [5, 5, 5],
  orthographic = false,
}: DemoCanvasProps) {
  return (
    <Canvas
      shadows
      camera={
        orthographic
          ? {
              position: cameraPosition,
              zoom: 50,
              near: 0.1,
              far: 1000,
            }
          : {
              position: cameraPosition,
              fov: 50,
              near: 0.1,
              far: 1000,
            }
      }
      orthographic={orthographic}
      gl={{
        antialias: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      }}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '0.75rem',
      }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {children}

      {showGrid && (
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#1e3a5f"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#2d5a87"
          fadeDistance={30}
          fadeStrength={1}
          position={[0, -0.01, 0]}
        />
      )}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.8}
        panSpeed={0.8}
        zoomSpeed={1.2}
        screenSpacePanning
      />
    </Canvas>
  )
}
