/**
 * 旋光性演示 - Unit 3
 * 演示糖溶液等手性物质对偏振面的旋转
 * 采用纯DOM + SVG + Framer Motion一体化设计
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'

// 旋光率数据 (deg/(dm·g/mL))
const SPECIFIC_ROTATIONS: Record<string, { value: number; direction: 'd' | 'l' }> = {
  sucrose: { value: 66.5, direction: 'd' }, // 蔗糖 (右旋)
  glucose: { value: 52.7, direction: 'd' }, // 葡萄糖 (右旋)
  fructose: { value: -92, direction: 'l' }, // 果糖 (左旋)
  tartaric: { value: 12, direction: 'd' }, // 酒石酸 (右旋)
}

// 计算旋光角度
function calculateRotation(specificRotation: number, concentration: number, pathLength: number): number {
  // α = [α] × c × l
  return specificRotation * concentration * pathLength
}

// 旋光仪光路图
function OpticalRotationDiagram({
  substance,
  concentration,
  pathLength,
  analyzerAngle,
}: {
  substance: string
  concentration: number
  pathLength: number
  analyzerAngle: number
}) {
  const specificRotation = SPECIFIC_ROTATIONS[substance]?.value || 66.5
  const rotationAngle = calculateRotation(specificRotation, concentration, pathLength)
  const isRightRotation = rotationAngle >= 0

  // 检偏器与偏振光的角度差
  const angleDiff = Math.abs(rotationAngle - analyzerAngle)
  const intensity = Math.pow(Math.cos((angleDiff * Math.PI) / 180), 2)

  return (
    <svg viewBox="0 0 700 300" className="w-full h-auto">
      <defs>
        <linearGradient id="tubeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="solutionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.2 + concentration * 0.4} />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.3 + concentration * 0.5} />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.2 + concentration * 0.4} />
        </linearGradient>
        <filter id="lightGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect x="0" y="0" width="700" height="300" fill="#0f172a" rx="8" />

      {/* 单色光源 */}
      <g transform="translate(50, 150)">
        <motion.circle
          r="20"
          fill="#fbbf24"
          filter="url(#lightGlow)"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="0" y="45" textAnchor="middle" fill="#94a3b8" fontSize="11">单色光源</text>
      </g>

      {/* 光束到起偏器 */}
      <motion.rect
        x="70"
        y="145"
        width="50"
        height="10"
        fill="#fbbf24"
        opacity="0.7"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* 起偏器 */}
      <g transform="translate(130, 150)">
        <rect x="-8" y="-40" width="16" height="80" fill="#1e3a5f" stroke="#22d3ee" strokeWidth="2" rx="3" />
        <line x1="0" y1="-30" x2="0" y2="30" stroke="#22d3ee" strokeWidth="3" />
        <text x="0" y="55" textAnchor="middle" fill="#22d3ee" fontSize="11">起偏器</text>
        <text x="0" y="68" textAnchor="middle" fill="#94a3b8" fontSize="10">0°</text>
      </g>

      {/* 偏振光 (水平偏振) */}
      <rect x="146" y="146" width="50" height="8" fill="#22d3ee" opacity="0.8" />

      {/* 偏振指示器 - 入射 */}
      <g transform="translate(175, 150)">
        <line x1="-12" y1="0" x2="12" y2="0" stroke="#22d3ee" strokeWidth="2" />
        <text x="0" y="-20" textAnchor="middle" fill="#22d3ee" fontSize="9">0°</text>
      </g>

      {/* 样品管 */}
      <g transform="translate(315, 150)">
        {/* 管壁 */}
        <rect
          x={-80}
          y="-30"
          width={160 + pathLength * 60}
          height="60"
          fill="url(#tubeGradient)"
          stroke="#67e8f9"
          strokeWidth="2"
          rx="30"
        />
        {/* 溶液 */}
        <rect
          x={-75}
          y="-25"
          width={150 + pathLength * 60}
          height="50"
          fill="url(#solutionGradient)"
          rx="25"
        />
        {/* 标注 */}
        <text x={(pathLength * 60) / 2} y="50" textAnchor="middle" fill="#67e8f9" fontSize="11">
          样品管 (L={pathLength.toFixed(1)} dm)
        </text>
        <text x={(pathLength * 60) / 2} y="65" textAnchor="middle" fill="#94a3b8" fontSize="10">
          c={concentration.toFixed(2)} g/mL
        </text>
      </g>

      {/* 偏振面旋转指示 - 沿管路 */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const x = 240 + t * (100 + pathLength * 60)
        const currentAngle = rotationAngle * t
        const color = isRightRotation ? '#22d3ee' : '#f472b6'
        return (
          <g key={i} transform={`translate(${x}, 150)`}>
            <motion.line
              x1="-10"
              y1="0"
              x2="10"
              y2="0"
              stroke={color}
              strokeWidth="2"
              transform={`rotate(${currentAngle})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: i * 0.1 }}
            />
          </g>
        )
      })}

      {/* 出射偏振光 */}
      <rect
        x={410 + pathLength * 60}
        y="146"
        width="60"
        height="8"
        fill={isRightRotation ? '#22d3ee' : '#f472b6'}
        opacity="0.8"
      />

      {/* 偏振指示器 - 出射 */}
      <g transform={`translate(${440 + pathLength * 60}, 150)`}>
        <motion.line
          x1="-12"
          y1="0"
          x2="12"
          y2="0"
          stroke={isRightRotation ? '#22d3ee' : '#f472b6'}
          strokeWidth="2.5"
          transform={`rotate(${rotationAngle})`}
        />
        <text x="0" y="-20" textAnchor="middle" fill={isRightRotation ? '#22d3ee' : '#f472b6'} fontSize="9">
          {rotationAngle >= 0 ? '+' : ''}{rotationAngle.toFixed(1)}°
        </text>
      </g>

      {/* 检偏器 */}
      <g transform={`translate(${500 + pathLength * 60}, 150)`}>
        <rect x="-8" y="-40" width="16" height="80" fill="#1e3a5f" stroke="#a78bfa" strokeWidth="2" rx="3" />
        <motion.line
          x1="0"
          y1="-30"
          x2="0"
          y2="30"
          stroke="#a78bfa"
          strokeWidth="3"
          transform={`rotate(${analyzerAngle})`}
        />
        <text x="0" y="55" textAnchor="middle" fill="#a78bfa" fontSize="11">检偏器</text>
        <text x="0" y="68" textAnchor="middle" fill="#94a3b8" fontSize="10">{analyzerAngle.toFixed(0)}°</text>
      </g>

      {/* 到屏幕的光束 */}
      <rect
        x={516 + pathLength * 60}
        y="146"
        width="40"
        height="8"
        fill="#a78bfa"
        opacity={Math.max(0.2, intensity)}
      />

      {/* 屏幕/探测器 */}
      <g transform={`translate(${580 + pathLength * 60}, 150)`}>
        <motion.rect
          x="-25"
          y="-35"
          width="50"
          height="70"
          fill={`rgba(255, 255, 255, ${intensity * 0.8})`}
          stroke="#475569"
          strokeWidth="2"
          rx="6"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <text x="0" y="55" textAnchor="middle" fill="#94a3b8" fontSize="11">
          {(intensity * 100).toFixed(0)}%
        </text>
      </g>

      {/* 旋转方向标注 */}
      <g transform="translate(350, 230)">
        <rect x="-80" y="-15" width="160" height="30" fill="rgba(30,41,59,0.8)" rx="6" />
        <text x="0" y="5" textAnchor="middle" fill={isRightRotation ? '#22d3ee' : '#f472b6'} fontSize="13" fontWeight="500">
          {isRightRotation ? '右旋 (d/+)' : '左旋 (l/-)'}: α = {rotationAngle.toFixed(1)}°
        </text>
      </g>

      {/* 旋转弧线指示 */}
      <g transform={`translate(${440 + pathLength * 60}, 90)`}>
        <path
          d={`M 0 0 A 25 25 0 ${Math.abs(rotationAngle) > 180 ? 1 : 0} ${isRightRotation ? 1 : 0} ${25 * Math.sin((rotationAngle * Math.PI) / 180)} ${25 - 25 * Math.cos((rotationAngle * Math.PI) / 180)}`}
          fill="none"
          stroke={isRightRotation ? '#22d3ee' : '#f472b6'}
          strokeWidth="2"
          strokeDasharray="4 2"
        />
        <motion.polygon
          points="-4,-8 4,0 -4,8"
          fill={isRightRotation ? '#22d3ee' : '#f472b6'}
          transform={`translate(${25 * Math.sin((rotationAngle * Math.PI) / 180)}, ${25 - 25 * Math.cos((rotationAngle * Math.PI) / 180)}) rotate(${rotationAngle + 90})`}
        />
      </g>
    </svg>
  )
}

// 浓度-旋光角曲线
function RotationChart({
  substance,
  pathLength,
  currentConcentration,
}: {
  substance: string
  pathLength: number
  currentConcentration: number
}) {
  const specificRotation = SPECIFIC_ROTATIONS[substance]?.value || 66.5
  const isPositive = specificRotation >= 0
  const maxRotation = Math.abs(specificRotation * 1.0 * pathLength)

  const { pathData } = useMemo(() => {
    const points: string[] = []

    for (let c = 0; c <= 1; c += 0.05) {
      const rotation = calculateRotation(specificRotation, c, pathLength)
      const x = 40 + c * 220
      const y = 100 - (rotation / maxRotation) * 60

      points.push(`${c === 0 ? 'M' : 'L'} ${x},${y}`)
    }

    return { pathData: points.join(' ') }
  }, [specificRotation, pathLength, maxRotation])

  const currentRotation = calculateRotation(specificRotation, currentConcentration, pathLength)
  const currentX = 40 + currentConcentration * 220
  const currentY = 100 - (currentRotation / maxRotation) * 60

  return (
    <svg viewBox="0 0 300 160" className="w-full h-auto">
      <rect x="40" y="30" width="220" height="100" fill="#1e293b" rx="4" />

      {/* 坐标轴 */}
      <line x1="40" y1="100" x2="270" y2="100" stroke="#475569" strokeWidth="1" />
      <line x1="40" y1="30" x2="40" y2="130" stroke="#475569" strokeWidth="1" />

      {/* X轴刻度 */}
      {[0, 0.5, 1].map((c) => {
        const x = 40 + c * 220
        return (
          <g key={c}>
            <line x1={x} y1="130" x2={x} y2="135" stroke="#94a3b8" strokeWidth="1" />
            <text x={x} y="147" textAnchor="middle" fill="#94a3b8" fontSize="10">{c}</text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      <text x="30" y="104" textAnchor="end" fill="#94a3b8" fontSize="10">0°</text>
      <text x="30" y="44" textAnchor="end" fill="#94a3b8" fontSize="10">
        {isPositive ? '+' : ''}{maxRotation.toFixed(0)}°
      </text>

      {/* 曲线 */}
      <path
        d={pathData}
        fill="none"
        stroke={isPositive ? '#22d3ee' : '#f472b6'}
        strokeWidth="2.5"
      />

      {/* 当前点 */}
      <motion.circle
        cx={currentX}
        cy={currentY}
        r="6"
        fill="#fbbf24"
        animate={{ cx: currentX, cy: currentY }}
        transition={{ duration: 0.2 }}
      />

      {/* 轴标签 */}
      <text x="155" y="158" textAnchor="middle" fill="#94a3b8" fontSize="11">浓度 c (g/mL)</text>
      <text x="15" y="70" fill="#94a3b8" fontSize="10" transform="rotate(-90 15 70)">α</text>
    </svg>
  )
}

// 主演示组件
export function OpticalRotationDemo() {
  const [substance, setSubstance] = useState('sucrose')
  const [concentration, setConcentration] = useState(0.3)
  const [pathLength, setPathLength] = useState(1.0)
  const [analyzerAngle, setAnalyzerAngle] = useState(0)

  const specificRotation = SPECIFIC_ROTATIONS[substance]?.value || 66.5
  const rotationAngle = calculateRotation(specificRotation, concentration, pathLength)

  // 透过强度
  const angleDiff = Math.abs(rotationAngle - analyzerAngle)
  const intensity = Math.pow(Math.cos((angleDiff * Math.PI) / 180), 2)

  // 物质选项
  const substances = [
    { value: 'sucrose', label: '蔗糖', rotation: '+66.5°' },
    { value: 'glucose', label: '葡萄糖', rotation: '+52.7°' },
    { value: 'fructose', label: '果糖', rotation: '-92.0°' },
    { value: 'tartaric', label: '酒石酸', rotation: '+12.0°' },
  ]

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
          旋光性交互演示
        </h2>
        <p className="text-gray-400 mt-1">
          α = [α] × c × L —— 探索手性物质对偏振面的旋转效应
        </p>
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-cyan-950/90 border border-cyan-500/30 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <OpticalRotationDiagram
              substance={substance}
              concentration={concentration}
              pathLength={pathLength}
              analyzerAngle={analyzerAngle}
            />
          </div>

          {/* 测量结果摘要 */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-600/30 p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <div className="text-gray-500 text-xs mb-1">旋光角 α</div>
                <div className={`font-mono text-xl ${rotationAngle >= 0 ? 'text-cyan-400' : 'text-pink-400'}`}>
                  {rotationAngle >= 0 ? '+' : ''}{rotationAngle.toFixed(1)}°
                </div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <div className="text-gray-500 text-xs mb-1">旋光方向</div>
                <div className={`font-bold text-lg ${rotationAngle >= 0 ? 'text-cyan-400' : 'text-pink-400'}`}>
                  {rotationAngle >= 0 ? '右旋 (d)' : '左旋 (l)'}
                </div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <div className="text-gray-500 text-xs mb-1">透过强度</div>
                <div className="font-mono text-xl text-purple-400">
                  {(intensity * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：控制与学习 */}
        <div className="space-y-4">
          {/* 物质选择 */}
          <ControlPanel title="物质选择">
            <div className="space-y-2">
              {substances.map((s) => (
                <motion.button
                  key={s.value}
                  className={`w-full py-2 px-3 rounded-lg flex justify-between items-center transition-colors ${
                    substance === s.value
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:bg-slate-700/50'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSubstance(s.value)}
                >
                  <span className="font-medium">{s.label}</span>
                  <span className={`font-mono text-sm ${s.rotation.startsWith('-') ? 'text-pink-400' : 'text-cyan-400'}`}>
                    [α] = {s.rotation}
                  </span>
                </motion.button>
              ))}
            </div>
          </ControlPanel>

          {/* 实验参数 */}
          <ControlPanel title="实验参数">
            <SliderControl
              label="溶液浓度 c"
              value={concentration}
              min={0.05}
              max={1.0}
              step={0.05}
              unit=" g/mL"
              onChange={setConcentration}
              color="orange"
            />
            <SliderControl
              label="光程长度 L"
              value={pathLength}
              min={0.5}
              max={2.0}
              step={0.1}
              unit=" dm"
              onChange={setPathLength}
              color="cyan"
            />
            <SliderControl
              label="检偏器角度"
              value={analyzerAngle}
              min={-90}
              max={90}
              step={1}
              unit="°"
              onChange={setAnalyzerAngle}
              color="purple"
            />

            <motion.button
              className="w-full py-2 mt-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAnalyzerAngle(Math.round(rotationAngle))}
            >
              对准消光位置
            </motion.button>
          </ControlPanel>

          {/* 公式与参数 */}
          <ControlPanel title="计算公式">
            <div className="p-3 bg-slate-900/50 rounded-lg text-center">
              <div className="font-mono text-lg text-white mb-2">
                α = [α] × c × L
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <p>α = {specificRotation.toFixed(1)} × {concentration.toFixed(2)} × {pathLength.toFixed(1)}</p>
                <p className={`font-mono ${rotationAngle >= 0 ? 'text-cyan-400' : 'text-pink-400'}`}>
                  α = {rotationAngle.toFixed(2)}°
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <p>[α] = 比旋光度 (°/(dm·g/mL))</p>
              <p>c = 浓度 (g/mL)</p>
              <p>L = 光程 (dm)</p>
            </div>
          </ControlPanel>

          {/* 浓度-旋光角曲线 */}
          <ControlPanel title="浓度-旋光角关系">
            <RotationChart
              substance={substance}
              pathLength={pathLength}
              currentConcentration={concentration}
            />
          </ControlPanel>
        </div>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="旋光性原理" color="cyan">
          <p className="text-xs text-gray-300">
            手性分子具有不重合的镜像结构，可使线偏振光的偏振面发生旋转。右旋(d/+)为顺时针，左旋(l/-)为逆时针。
          </p>
        </InfoCard>
        <InfoCard title="比旋光度" color="purple">
          <p className="text-xs text-gray-300">
            [α]是物质的特征常数，定义为单位浓度(1 g/mL)和单位光程(1 dm)时的旋光角。依赖于波长和温度。
          </p>
        </InfoCard>
        <InfoCard title="应用场景" color="orange">
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• 糖度计测量糖浓度</li>
            <li>• 手性药物对映体鉴定</li>
            <li>• 食品工业质量控制</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
