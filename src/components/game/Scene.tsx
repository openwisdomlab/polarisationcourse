import { useEffect, useCallback, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls, PointerLockControls, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/stores/gameStore'
import { Blocks } from './Blocks'
import { LightBeams } from './LightBeams'
import { SelectionBox } from './SelectionBox'
import { BlockPosition } from '@/core/types'

export function Scene() {
  const {
    world,
    cameraMode,
    showGrid,
    visionMode,
    placeBlock,
    removeBlock,
    rotateBlockAt,
  } = useGameStore()

  const { gl } = useThree()
  const [targetPosition, setTargetPosition] = useState<BlockPosition | null>(null)
  const [hoveredBlock, setHoveredBlock] = useState<BlockPosition | null>(null)

  // Set up scene background
  useEffect(() => {
    const scene = gl.domElement.parentElement
    if (scene) {
      gl.setClearColor(visionMode === 'polarized' ? 0x150505 : 0x0a0a15)
    }
  }, [visionMode, gl])

  // Handle keyboard input for camera mode toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { setCameraMode, toggleVisionMode, toggleGrid, toggleHelp, rotateSelectedBlock } = useGameStore.getState()

      switch (e.code) {
        case 'KeyC':
          const modes: ('first-person' | 'isometric' | 'top-down')[] = ['first-person', 'isometric', 'top-down']
          const currentMode = useGameStore.getState().cameraMode
          const nextIndex = (modes.indexOf(currentMode) + 1) % modes.length
          setCameraMode(modes[nextIndex])
          break
        case 'KeyV':
          toggleVisionMode()
          break
        case 'KeyG':
          toggleGrid()
          break
        case 'KeyH':
          toggleHelp()
          break
        case 'KeyR':
          if (hoveredBlock) {
            rotateBlockAt(hoveredBlock)
          } else {
            rotateSelectedBlock()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hoveredBlock])

  const handleBlockClick = useCallback((position: BlockPosition, normal: THREE.Vector3, button: number) => {
    if (button === 0) {
      // Left click - place block adjacent to clicked face
      const newPos: BlockPosition = {
        x: position.x + Math.round(normal.x),
        y: position.y + Math.round(normal.y),
        z: position.z + Math.round(normal.z),
      }
      if (newPos.y > 0) {
        placeBlock(newPos)
      }
    } else if (button === 2) {
      // Right click - remove block
      if (position.y > 0) {
        removeBlock(position)
      }
    }
  }, [placeBlock, removeBlock])

  const handleBlockHover = useCallback((position: BlockPosition | null, targetPos: BlockPosition | null) => {
    setHoveredBlock(position)
    setTargetPosition(targetPos)
  }, [])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} color={0x404060} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-10, 10, -10]} intensity={0.3} color={0x6688cc} />

      {/* Fog - only in first-person mode */}
      {cameraMode === 'first-person' && <fog attach="fog" args={[0x0a0a15, 30, 80]} />}

      {/* Grid */}
      {showGrid && (
        <Grid
          args={[20, 20]}
          position={[0, 0.01, 0]}
          cellColor={0x303050}
          sectionColor={0x4080aa}
          fadeDistance={50}
          fadeStrength={1}
          cellThickness={1}
          sectionThickness={1.5}
          infiniteGrid
        />
      )}

      {/* World blocks */}
      {world && (
        <Blocks
          world={world}
          visionMode={visionMode}
          onBlockClick={handleBlockClick}
          onBlockHover={handleBlockHover}
        />
      )}

      {/* Light beams */}
      {world && <LightBeams world={world} visionMode={visionMode} />}

      {/* Selection box */}
      {targetPosition && (
        <SelectionBox position={targetPosition} valid={targetPosition.y > 0} />
      )}

      {/* Camera controls based on mode */}
      {cameraMode === 'first-person' ? (
        <PointerLockControls />
      ) : (
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          enablePan={cameraMode === 'isometric' || cameraMode === 'top-down'}
          enableRotate={cameraMode === 'isometric'}
          maxPolarAngle={cameraMode === 'top-down' ? 0.1 : Math.PI / 2}
          minPolarAngle={cameraMode === 'top-down' ? 0 : 0}
        />
      )}
    </>
  )
}
