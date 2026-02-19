/**
 * Poincaré Sphere Viewer Page
 * 庞加莱球可视化工具 - 在3D球面上展示所有偏振态
 *
 * The Poincaré sphere is a graphical representation where each point
 * on the sphere corresponds to a unique polarization state.
 */
import { useState, useRef, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { SliderControl, ControlPanel, InfoCard, ValueDisplay } from '@/components/demos/DemoControls'
import { ArrowLeft, RotateCcw, Eye, Info } from 'lucide-react'
import * as THREE from 'three'

// Stokes vector type
interface StokesVector {
  S0: number
  S1: number
  S2: number
  S3: number
}

// Polarization state description
interface PolarizationState {
  id: string
  nameEn: string
  nameZh: string
  S1: number
  S2: number
  S3: number
  color: string
  description?: string
}

// Key polarization states on the sphere
const KEY_STATES: PolarizationState[] = [
  { id: 'H', nameEn: 'Horizontal (H)', nameZh: '水平线偏振 (H)', S1: 1, S2: 0, S3: 0, color: '#ef4444' },
  { id: 'V', nameEn: 'Vertical (V)', nameZh: '垂直线偏振 (V)', S1: -1, S2: 0, S3: 0, color: '#ef4444' },
  { id: 'D', nameEn: 'Diagonal +45° (D)', nameZh: '+45°线偏振 (D)', S1: 0, S2: 1, S3: 0, color: '#22c55e' },
  { id: 'A', nameEn: 'Anti-diagonal -45° (A)', nameZh: '-45°线偏振 (A)', S1: 0, S2: -1, S3: 0, color: '#22c55e' },
  { id: 'R', nameEn: 'Right Circular (R)', nameZh: '右旋圆偏振 (R)', S1: 0, S2: 0, S3: 1, color: '#3b82f6' },
  { id: 'L', nameEn: 'Left Circular (L)', nameZh: '左旋圆偏振 (L)', S1: 0, S2: 0, S3: -1, color: '#f472b6' },
]

// Calculate Stokes from angles
function calculateStokes(azimuth: number, ellipticity: number): StokesVector {
  const psi = (azimuth * Math.PI) / 180 // azimuth angle
  const chi = (ellipticity * Math.PI) / 180 // ellipticity angle (-45 to +45)

  return {
    S0: 1,
    S1: Math.cos(2 * chi) * Math.cos(2 * psi),
    S2: Math.cos(2 * chi) * Math.sin(2 * psi),
    S3: Math.sin(2 * chi),
  }
}

// Calculate angles from Stokes
function stokesToAngles(S1: number, S2: number, S3: number): { azimuth: number; ellipticity: number } {
  const azimuth = (0.5 * Math.atan2(S2, S1) * 180) / Math.PI
  const ellipticity = (0.5 * Math.asin(Math.max(-1, Math.min(1, S3))) * 180) / Math.PI
  return { azimuth, ellipticity }
}

// Get polarization type description
function getPolarizationType(_S1: number, _S2: number, S3: number, isZh: boolean): string {
  const tolerance = 0.01
  if (Math.abs(S3) < tolerance) {
    return isZh ? '线偏振' : 'Linear'
  } else if (Math.abs(S3) > 1 - tolerance) {
    return S3 > 0 ? (isZh ? '右旋圆偏振' : 'Right Circular') : (isZh ? '左旋圆偏振' : 'Left Circular')
  } else {
    return S3 > 0 ? (isZh ? '右旋椭圆偏振' : 'Right Elliptical') : (isZh ? '左旋椭圆偏振' : 'Left Elliptical')
  }
}

// 3D Poincaré Sphere Component
function PoincareSphere({
  selectedState,
  onSelectState,
  showLabels,
  theme
}: {
  selectedState: StokesVector
  onSelectState: (s: StokesVector) => void
  showLabels: boolean
  theme: string
}) {
  const sphereRef = useRef<THREE.Mesh>(null)

  const isDark = theme === 'dark'
  const sphereColor = isDark ? '#1e293b' : '#e2e8f0'
  const wireColor = isDark ? '#334155' : '#cbd5e1'
  const axisOpacity = isDark ? 0.8 : 0.6

  // Draw great circles (equator and meridians)
  const equatorPoints = useMemo(() => {
    const points = []
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2
      points.push(new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta)))
    }
    return points
  }, [])

  const meridian1Points = useMemo(() => {
    const points = []
    for (let i = 0; i <= 64; i++) {
      const phi = (i / 64) * Math.PI * 2
      points.push(new THREE.Vector3(Math.cos(phi), Math.sin(phi), 0))
    }
    return points
  }, [])

  const meridian2Points = useMemo(() => {
    const points = []
    for (let i = 0; i <= 64; i++) {
      const phi = (i / 64) * Math.PI * 2
      points.push(new THREE.Vector3(0, Math.sin(phi), Math.cos(phi)))
    }
    return points
  }, [])

  // Current state position on sphere
  const currentPosition = new THREE.Vector3(
    selectedState.S1,
    selectedState.S3, // S3 is vertical (poles)
    selectedState.S2  // S2 is depth
  )

  return (
    <group>
      {/* Semi-transparent sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color={sphereColor}
          transparent
          opacity={0.15}
          roughness={0.3}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[1.001, 24, 24]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.3} />
      </mesh>

      {/* Great circles */}
      <Line points={equatorPoints} color="#ef4444" lineWidth={2} transparent opacity={axisOpacity} />
      <Line points={meridian1Points} color="#22c55e" lineWidth={2} transparent opacity={axisOpacity} />
      <Line points={meridian2Points} color="#3b82f6" lineWidth={2} transparent opacity={axisOpacity} />

      {/* Axes */}
      <Line points={[[-1.3, 0, 0], [1.3, 0, 0]]} color="#ef4444" lineWidth={3} />
      <Line points={[[0, -1.3, 0], [0, 1.3, 0]]} color="#3b82f6" lineWidth={3} />
      <Line points={[[0, 0, -1.3], [0, 0, 1.3]]} color="#22c55e" lineWidth={3} />

      {/* Axis labels */}
      {showLabels && (
        <>
          <Text position={[1.5, 0, 0]} fontSize={0.15} color="#ef4444" anchorX="center">
            S₁ (H/V)
          </Text>
          <Text position={[-1.5, 0, 0]} fontSize={0.12} color="#ef4444" anchorX="center">
            V
          </Text>
          <Text position={[0, 1.5, 0]} fontSize={0.15} color="#3b82f6" anchorX="center">
            S₃ (R/L)
          </Text>
          <Text position={[0, -1.5, 0]} fontSize={0.12} color="#f472b6" anchorX="center">
            LCP
          </Text>
          <Text position={[0, 0, 1.5]} fontSize={0.15} color="#22c55e" anchorX="center">
            S₂ (+45/-45)
          </Text>
        </>
      )}

      {/* Key polarization state markers */}
      {KEY_STATES.map((state) => (
        <group key={state.id}>
          <mesh
            position={[state.S1, state.S3, state.S2]}
            onClick={(e) => {
              e.stopPropagation()
              onSelectState({ S0: 1, S1: state.S1, S2: state.S2, S3: state.S3 })
            }}
          >
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color={state.color} />
          </mesh>
          {showLabels && (
            <Text
              position={[state.S1 * 1.15, state.S3 * 1.15, state.S2 * 1.15]}
              fontSize={0.1}
              color={state.color}
              anchorX="center"
              anchorY="middle"
            >
              {state.id}
            </Text>
          )}
        </group>
      ))}

      {/* Current state marker */}
      <group>
        {/* Line from center to point */}
        <Line
          points={[[0, 0, 0], [currentPosition.x, currentPosition.y, currentPosition.z]]}
          color="#fbbf24"
          lineWidth={2}
          dashed
          dashSize={0.05}
          gapSize={0.03}
        />
        {/* Point */}
        <mesh position={currentPosition}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
        {/* Glow ring */}
        <mesh position={currentPosition} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 0.15, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Origin point */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={isDark ? '#94a3b8' : '#64748b'} />
      </mesh>
    </group>
  )
}

// Polarization Ellipse 2D visualization
function PolarizationEllipse({
  azimuth,
  ellipticity,
  theme
}: {
  azimuth: number
  ellipticity: number
  theme: string
}) {
  const isDark = theme === 'dark'
  const bgColor = isDark ? '#0f172a' : '#f1f5f9'
  const axisColor = isDark ? '#374151' : '#cbd5e1'
  const ellipseColor = ellipticity > 0 ? '#22d3ee' : ellipticity < 0 ? '#f472b6' : '#fbbf24'

  const width = 200
  const height = 200
  const cx = width / 2
  const cy = height / 2
  const maxR = 70

  // Generate ellipse path
  const a = maxR
  const b = Math.abs(Math.tan((ellipticity * Math.PI) / 180)) * maxR || 2
  const angle = (azimuth * Math.PI) / 180

  let path = ''
  for (let i = 0; i <= 64; i++) {
    const t = (i / 64) * 2 * Math.PI
    const ex = a * Math.cos(t)
    const ey = b * Math.sin(t)
    const x = cx + ex * Math.cos(angle) - ey * Math.sin(angle)
    const y = cy - (ex * Math.sin(angle) + ey * Math.cos(angle))
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  path += ' Z'

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <rect x={0} y={0} width={width} height={height} fill={bgColor} rx={10} />

      {/* Reference circle */}
      <circle cx={cx} cy={cy} r={maxR} fill="none" stroke={axisColor} strokeWidth={1} strokeDasharray="4,4" />

      {/* Axes */}
      <line x1={20} y1={cy} x2={width - 20} y2={cy} stroke={axisColor} strokeWidth={1} />
      <line x1={cx} y1={20} x2={cx} y2={height - 20} stroke={axisColor} strokeWidth={1} />

      {/* Ellipse */}
      <path
        d={path}
        fill={`${ellipseColor}20`}
        stroke={ellipseColor}
        strokeWidth={2.5}
      />

      {/* Major axis */}
      <line
        x1={cx - maxR * 1.1 * Math.cos(angle)}
        y1={cy + maxR * 1.1 * Math.sin(angle)}
        x2={cx + maxR * 1.1 * Math.cos(angle)}
        y2={cy - maxR * 1.1 * Math.sin(angle)}
        stroke="#fbbf24"
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />

      {/* Handedness arrow */}
      {Math.abs(ellipticity) > 0.5 && (
        <path
          d={ellipticity > 0
            ? `M ${cx + 25} ${cy} A 25 25 0 0 1 ${cx} ${cy - 25}`
            : `M ${cx + 25} ${cy} A 25 25 0 0 0 ${cx} ${cy + 25}`}
          fill="none"
          stroke={ellipseColor}
          strokeWidth={2}
          markerEnd="url(#arrow)"
        />
      )}

      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={ellipseColor} />
        </marker>
      </defs>

      {/* Angle label */}
      <text x={cx + 50} y={cy - 5} fill="#fbbf24" fontSize={12}>{azimuth.toFixed(0)}°</text>
    </svg>
  )
}

// Main Page Component
export function PoincareSphereViewerPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  // State for polarization parameters
  const [azimuth, setAzimuth] = useState(0) // -90 to 90
  const [ellipticity, setEllipticity] = useState(0) // -45 to 45
  const [showLabels, setShowLabels] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  // Calculate Stokes vector from angles
  const stokes = useMemo(() => calculateStokes(azimuth, ellipticity), [azimuth, ellipticity])

  // Handle state selection from sphere clicks
  const handleSelectState = (s: StokesVector) => {
    const angles = stokesToAngles(s.S1, s.S2, s.S3)
    setAzimuth(angles.azimuth)
    setEllipticity(angles.ellipticity)
  }

  // Reset to horizontal linear
  const handleReset = () => {
    setAzimuth(0)
    setEllipticity(0)
  }

  // Get polarization type
  const polarizationType = getPolarizationType(stokes.S1, stokes.S2, stokes.S3, isZh)

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fefce8] via-[#fef9c3] to-[#fefce8]'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark'
          ? 'bg-slate-900/80 border-slate-700'
          : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <Link
                to="/research"
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors',
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{isZh ? '返回实验室' : 'Back to Lab'}</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl">🔮</span>
              <h1 className={cn(
                'text-lg sm:text-xl font-bold',
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              )}>
                {isZh ? '庞加莱球可视化' : 'Poincaré Sphere Viewer'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  theme === 'dark'
                    ? 'hover:bg-slate-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                )}
              >
                <Info className="w-5 h-5" />
              </button>
              <LanguageThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <div className={cn(
              'rounded-2xl border overflow-hidden',
              theme === 'dark'
                ? 'bg-slate-900/50 border-purple-400/20'
                : 'bg-white border-purple-200 shadow-lg'
            )}>
              <div className="h-[500px] sm:h-[600px]">
                <Canvas camera={{ position: [2.5, 1.5, 2.5], fov: 45 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  <PoincareSphere
                    selectedState={stokes}
                    onSelectState={handleSelectState}
                    showLabels={showLabels}
                    theme={theme}
                  />
                  <OrbitControls
                    enablePan={false}
                    minDistance={2}
                    maxDistance={5}
                    enableDamping
                    dampingFactor={0.05}
                  />
                </Canvas>
              </div>

              {/* Toolbar */}
              <div className={cn(
                'flex items-center justify-between px-4 py-3 border-t',
                theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
              )}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLabels(!showLabels)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                      showLabels
                        ? theme === 'dark'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-purple-100 text-purple-700'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:bg-slate-700'
                          : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <Eye className="w-4 h-4" />
                    {isZh ? '标签' : 'Labels'}
                  </button>
                  <button
                    onClick={handleReset}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                      theme === 'dark'
                        ? 'text-gray-400 hover:bg-slate-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <RotateCcw className="w-4 h-4" />
                    {isZh ? '重置' : 'Reset'}
                  </button>
                </div>
                <div className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  {isZh ? '拖动旋转 · 滚轮缩放' : 'Drag to rotate · Scroll to zoom'}
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Polarization Ellipse */}
            <div className={cn(
              'rounded-xl border p-4',
              theme === 'dark'
                ? 'bg-slate-900/50 border-purple-400/20'
                : 'bg-white border-purple-200 shadow-sm'
            )}>
              <h3 className={cn(
                'text-sm font-semibold mb-3',
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              )}>
                {isZh ? '偏振椭圆' : 'Polarization Ellipse'}
              </h3>
              <PolarizationEllipse azimuth={azimuth} ellipticity={ellipticity} theme={theme} />
              <div className={cn(
                'text-center mt-2 text-sm font-medium',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                {polarizationType}
              </div>
            </div>

            {/* Parameter Controls */}
            <ControlPanel title={isZh ? '偏振参数' : 'Polarization Parameters'}>
              <SliderControl
                label={isZh ? '方位角 ψ' : 'Azimuth ψ'}
                value={azimuth}
                min={-90}
                max={90}
                step={1}
                unit="°"
                onChange={setAzimuth}
                color="orange"
              />
              <SliderControl
                label={isZh ? '椭圆度角 χ' : 'Ellipticity χ'}
                value={ellipticity}
                min={-45}
                max={45}
                step={1}
                unit="°"
                onChange={setEllipticity}
                color="cyan"
              />
            </ControlPanel>

            {/* Stokes Vector Display */}
            <ControlPanel title={isZh ? '斯托克斯参数' : 'Stokes Parameters'}>
              <ValueDisplay label="S₀" value="1.000" color="purple" />
              <ValueDisplay label="S₁" value={stokes.S1.toFixed(3)} color="red" />
              <ValueDisplay label="S₂" value={stokes.S2.toFixed(3)} color="green" />
              <ValueDisplay label="S₃" value={stokes.S3.toFixed(3)} color="blue" />
            </ControlPanel>

            {/* Preset States */}
            <ControlPanel title={isZh ? '常见偏振态' : 'Common States'}>
              <div className="grid grid-cols-2 gap-2">
                {KEY_STATES.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => handleSelectState({ S0: 1, S1: state.S1, S2: state.S2, S3: state.S3 })}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                      theme === 'dark'
                        ? 'bg-slate-700/50 hover:bg-slate-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    )}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: state.color }}
                    />
                    <span className="truncate">{isZh ? state.nameZh.split(' ')[0] : state.nameEn.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </ControlPanel>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard title={isZh ? '庞加莱球简介' : 'About the Poincaré Sphere'} color="purple">
              <ul className={cn(
                'text-xs space-y-1.5',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                <li>• {isZh
                  ? '庞加莱球是一种将所有偏振态映射到球面的几何表示方法'
                  : 'The Poincaré sphere maps all polarization states onto a sphere surface'}</li>
                <li>• <strong className="text-red-400">{isZh ? '赤道' : 'Equator'}</strong>: {isZh ? '线偏振态 (H, V, ±45°)' : 'Linear polarizations (H, V, ±45°)'}</li>
                <li>• <strong className="text-blue-400">{isZh ? '北极' : 'North Pole'}</strong>: {isZh ? '右旋圆偏振 (RCP)' : 'Right circular polarization (RCP)'}</li>
                <li>• <strong className="text-pink-400">{isZh ? '南极' : 'South Pole'}</strong>: {isZh ? '左旋圆偏振 (LCP)' : 'Left circular polarization (LCP)'}</li>
                <li>• {isZh
                  ? '其他点表示各种椭圆偏振态'
                  : 'Other points represent elliptical polarization states'}</li>
              </ul>
            </InfoCard>

            <InfoCard title={isZh ? '坐标与斯托克斯参数' : 'Coordinates & Stokes Parameters'} color="cyan">
              <ul className={cn(
                'text-xs space-y-1.5',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                <li>• <strong className="text-red-400">S₁</strong>: {isZh ? 'X轴 - 水平/垂直线偏振分量差' : 'X-axis - H/V linear preference'}</li>
                <li>• <strong className="text-green-400">S₂</strong>: {isZh ? 'Z轴 - ±45°线偏振分量差' : 'Z-axis - ±45° linear preference'}</li>
                <li>• <strong className="text-blue-400">S₃</strong>: {isZh ? 'Y轴 - 圆偏振分量差 (旋向)' : 'Y-axis - Circular preference (handedness)'}</li>
                <li>• {isZh
                  ? '球面上任意点: S₁² + S₂² + S₃² = 1 (完全偏振)'
                  : 'On sphere surface: S₁² + S₂² + S₃² = 1 (fully polarized)'}</li>
              </ul>
            </InfoCard>
          </div>
        )}
      </main>
    </div>
  )
}

export default PoincareSphereViewerPage
