/**
 * 双折射效应演示 - Unit 1
 * 演示方解石晶体将一束光分裂为o光和e光
 */
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line, Text, Box } from '@react-three/drei'
import * as THREE from 'three'
import { SliderControl, ControlPanel, ValueDisplay, ButtonGroup, InfoPanel } from '../DemoControls'

// 方解石晶体组件
function CalciteCrystal({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, (rotation * Math.PI) / 180, 0]}>
      {/* 晶体本体 */}
      <mesh>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshStandardMaterial
          color="#a8d8ea"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 晶体边框 */}
      <Box args={[1.5, 2, 1.5]}>
        <meshBasicMaterial color="#67e8f9" wireframe />
      </Box>
      {/* 光轴指示 */}
      <Line
        points={[
          [-0.8, -1.2, 0],
          [0.8, 1.2, 0],
        ]}
        color="#fbbf24"
        lineWidth={2}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      <Text position={[0, -1.8, 0]} fontSize={0.25} color="#94a3b8">
        方解石
      </Text>
    </group>
  )
}

// 光束组件
function PolarizedBeam({
  start,
  end,
  color,
  intensity,
  label,
}: {
  start: [number, number, number]
  end: [number, number, number]
  color: string
  intensity: number
  label?: string
}) {
  if (intensity <= 0) return null

  const midPoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2 + 0.5,
    (start[2] + end[2]) / 2,
  ]

  return (
    <group>
      <Line
        points={[start, end]}
        color={color}
        lineWidth={3 * intensity}
        transparent
        opacity={Math.max(0.3, intensity)}
      />
      {label && (
        <Text position={midPoint} fontSize={0.2} color={color}>
          {label}
        </Text>
      )}
    </group>
  )
}

// 屏幕组件 - 显示双像
function BirefringenceScreen({
  position,
  oIntensity,
  eIntensity,
  separation,
}: {
  position: [number, number, number]
  oIntensity: number
  eIntensity: number
  separation: number
}) {
  return (
    <group position={position}>
      {/* 屏幕背景 */}
      <mesh>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#1e293b" side={THREE.DoubleSide} />
      </mesh>
      {/* o光像点 */}
      <mesh position={[0, -separation / 2, 0.01]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff4444"
          emissiveIntensity={oIntensity * 0.5}
        />
      </mesh>
      {/* e光像点 */}
      <mesh position={[0, separation / 2, 0.01]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial
          color="#44ff44"
          emissive="#44ff44"
          emissiveIntensity={eIntensity * 0.5}
        />
      </mesh>
      <Text position={[0.5, -separation / 2, 0.02]} fontSize={0.15} color="#ff4444">
        o光
      </Text>
      <Text position={[0.5, separation / 2, 0.02]} fontSize={0.15} color="#44ff44">
        e光
      </Text>
      <Text position={[0, -1.8, 0]} fontSize={0.25} color="#94a3b8">
        屏幕
      </Text>
    </group>
  )
}

// 3D场景
function BirefringenceScene({
  inputPolarization,
  crystalRotation,
}: {
  inputPolarization: number
  crystalRotation: number
}) {
  const radians = (inputPolarization * Math.PI) / 180
  const oIntensity = Math.pow(Math.cos(radians), 2)
  const eIntensity = Math.pow(Math.sin(radians), 2)
  const separation = 0.8

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, 5]} intensity={0.4} />

      {/* 光源 */}
      <group position={[-4, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
        <pointLight color="#fbbf24" intensity={1} distance={3} />
        <Text position={[0, -0.8, 0]} fontSize={0.25} color="#94a3b8">
          偏振光源
        </Text>
      </group>

      {/* 输入光束 */}
      <PolarizedBeam start={[-3.5, 0, 0]} end={[-1, 0, 0]} color="#ffaa00" intensity={1} />

      {/* 方解石晶体 */}
      <CalciteCrystal position={[0, 0, 0]} rotation={crystalRotation} />

      {/* o光 */}
      <PolarizedBeam
        start={[1, -separation / 2, 0]}
        end={[4, -separation / 2, 0]}
        color="#ff4444"
        intensity={oIntensity}
        label="o光 (0°)"
      />

      {/* e光 */}
      <PolarizedBeam
        start={[1, separation / 2, 0]}
        end={[4, separation / 2, 0]}
        color="#44ff44"
        intensity={eIntensity}
        label="e光 (90°)"
      />

      {/* 屏幕 */}
      <BirefringenceScreen
        position={[5, 0, 0]}
        oIntensity={oIntensity}
        eIntensity={eIntensity}
        separation={separation}
      />

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 主演示组件
export function BirefringenceDemo() {
  const [inputPolarization, setInputPolarization] = useState(45)
  const [crystalRotation, setCrystalRotation] = useState(0)

  const radians = (inputPolarization * Math.PI) / 180
  const oIntensity = Math.pow(Math.cos(radians), 2)
  const eIntensity = Math.pow(Math.sin(radians), 2)

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D 可视化 */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden min-h-[400px]">
        <Canvas camera={{ position: [0, 6, 12], fov: 45 }} gl={{ antialias: true }}>
          <BirefringenceScene inputPolarization={inputPolarization} crystalRotation={crystalRotation} />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-80 space-y-4">
        <ControlPanel title="参数控制">
          <SliderControl
            label="入射光偏振角度"
            value={inputPolarization}
            min={0}
            max={90}
            step={5}
            unit="°"
            onChange={setInputPolarization}
          />
          <SliderControl
            label="晶体旋转角度"
            value={crystalRotation}
            min={0}
            max={360}
            step={15}
            unit="°"
            onChange={setCrystalRotation}
          />
          <ButtonGroup
            label="快速设置"
            options={[
              { value: 0, label: '0°' },
              { value: 45, label: '45°' },
              { value: 90, label: '90°' },
            ]}
            value={inputPolarization}
            onChange={(v) => setInputPolarization(v as number)}
          />
        </ControlPanel>

        <ControlPanel title="分量强度">
          <ValueDisplay label="o光强度 (cos²θ)" value={(oIntensity * 100).toFixed(1)} unit="%" color="red" />
          <ValueDisplay label="e光强度 (sin²θ)" value={(eIntensity * 100).toFixed(1)} unit="%" color="green" />
          <ValueDisplay label="总强度" value="100" unit="%" color="cyan" />
        </ControlPanel>

        <InfoPanel title="方解石参数">
          <div className="space-y-1 text-xs">
            <p>No = 1.6584 (o光折射率)</p>
            <p>Ne = 1.4864 (e光折射率)</p>
            <p>双折射率差: 0.172</p>
          </div>
        </InfoPanel>
      </div>
    </div>
  )
}
