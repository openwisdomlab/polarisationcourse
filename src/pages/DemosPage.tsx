import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface DemoItem {
  id: string
  title: string
  unit: number
}

const DEMOS: DemoItem[] = [
  { id: 'malus', title: '马吕斯定律', unit: 1 },
  { id: 'birefringence', title: '双折射效应', unit: 1 },
  { id: 'waveplate', title: '波片原理', unit: 1 },
  { id: 'fresnel', title: '菲涅尔方程', unit: 2 },
  { id: 'brewster', title: '布儒斯特角', unit: 2 },
  { id: 'chromatic', title: '色偏振', unit: 3 },
  { id: 'optical-rotation', title: '旋光性', unit: 3 },
  { id: 'mie-scattering', title: '米氏散射', unit: 4 },
  { id: 'rayleigh', title: '瑞利散射', unit: 4 },
  { id: 'stokes', title: '斯托克斯矢量', unit: 5 },
  { id: 'mueller', title: '穆勒矩阵', unit: 5 },
]

const UNITS = [
  { num: 1, title: '偏振态调制与测量' },
  { num: 2, title: '界面反射偏振特征' },
  { num: 3, title: '透明介质的偏振' },
  { num: 4, title: '浑浊介质的偏振' },
  { num: 5, title: '全偏振技术' },
]

export function DemosPage() {
  const [activeDemo, setActiveDemo] = useState<string>('malus')

  return (
    <div className="min-h-screen bg-[#121218] text-gray-200">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 border-b border-cyan-400/20 px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors">
          <span className="text-2xl">⟡</span>
          <span className="text-xl font-bold">PolarCraft</span>
        </Link>
        <nav className="flex gap-5">
          <Link
            to="/game"
            className="px-4 py-2 rounded-md text-gray-400 hover:text-white hover:bg-cyan-400/10 transition-all"
          >
            游戏
          </Link>
          <Link
            to="/demos"
            className="px-4 py-2 rounded-md text-cyan-400 bg-cyan-400/15"
          >
            课程
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <div className="flex pt-[70px]">
        {/* Sidebar */}
        <aside className="w-72 fixed left-0 top-[70px] bottom-0 bg-slate-900/80 border-r border-cyan-400/10 overflow-y-auto p-5">
          {UNITS.map((unit) => (
            <div key={unit.num} className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2.5">
                单元 {unit.num}: {unit.title}
              </h3>
              <ul className="space-y-0.5">
                {DEMOS.filter((d) => d.unit === unit.num).map((demo) => (
                  <li key={demo.id}>
                    <button
                      onClick={() => setActiveDemo(demo.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm text-left transition-all",
                        activeDemo === demo.id
                          ? "bg-cyan-400/20 text-cyan-400"
                          : "text-gray-400 hover:bg-cyan-400/10 hover:text-white"
                      )}
                    >
                      <span
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                          activeDemo === demo.id
                            ? "bg-cyan-400 text-black"
                            : "bg-cyan-400/20"
                        )}
                      >
                        {DEMOS.filter((d) => d.unit === demo.unit).indexOf(demo) + 1}
                      </span>
                      {demo.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-cyan-400 mb-6">
              {DEMOS.find((d) => d.id === activeDemo)?.title}
            </h1>

            {/* Demo Canvas Placeholder */}
            <div className="bg-slate-800/50 rounded-xl border border-cyan-400/20 aspect-video flex items-center justify-center mb-8">
              <div className="text-center text-gray-500">
                <div className="text-5xl mb-4">🔬</div>
                <p>交互式演示: {DEMOS.find((d) => d.id === activeDemo)?.title}</p>
                <p className="text-sm mt-2 text-gray-600">
                  (演示内容正在开发中...)
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h2 className="text-lg font-semibold text-white mb-3">概念说明</h2>
              <DemoDescription demoId={activeDemo} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function DemoDescription({ demoId }: { demoId: string }) {
  const descriptions: Record<string, React.ReactNode> = {
    malus: (
      <div className="text-gray-400 space-y-3">
        <p>
          <strong className="text-white">马吕斯定律</strong>描述了偏振光通过偏振片时的强度变化：
        </p>
        <p className="font-mono bg-slate-900/50 px-4 py-2 rounded text-cyan-400">
          I = I₀ × cos²(θ)
        </p>
        <p>
          其中 I₀ 是入射光强度，θ 是入射光偏振方向与偏振片透光轴的夹角。
          当 θ = 0° 时，光完全透过；当 θ = 90° 时，光被完全阻挡。
        </p>
      </div>
    ),
    birefringence: (
      <div className="text-gray-400 space-y-3">
        <p>
          <strong className="text-white">双折射效应</strong>是某些晶体（如方解石）将一束光分裂为两束的现象。
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>o光（寻常光）</strong>：遵循普通折射定律</li>
          <li><strong>e光（非常光）</strong>：折射率随传播方向变化</li>
        </ul>
        <p>两束光具有正交的偏振方向（相差90°）。</p>
      </div>
    ),
    waveplate: (
      <div className="text-gray-400 space-y-3">
        <p>
          <strong className="text-white">波片</strong>是一种利用双折射材料制成的光学元件，
          可以改变通过它的光的偏振状态。
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>四分之一波片</strong>：将线偏振光转换为圆偏振光</li>
          <li><strong>二分之一波片</strong>：旋转线偏振光的偏振方向</li>
        </ul>
      </div>
    ),
    fresnel: (
      <div className="text-gray-400 space-y-3">
        <p>
          <strong className="text-white">菲涅尔方程</strong>描述了光在两种介质界面处的反射和透射系数，
          对于s偏振和p偏振光具有不同的表达式。
        </p>
      </div>
    ),
    brewster: (
      <div className="text-gray-400 space-y-3">
        <p>
          <strong className="text-white">布儒斯特角</strong>是光从一种介质射向另一种介质时，
          反射光为完全s偏振（垂直于入射面）的入射角。
        </p>
        <p className="font-mono bg-slate-900/50 px-4 py-2 rounded text-cyan-400">
          tan(θ_B) = n₂/n₁
        </p>
      </div>
    ),
    chromatic: (
      <div className="text-gray-400 space-y-3">
        <p>
          <strong className="text-white">色偏振</strong>现象发生在双折射材料中，
          由于不同波长的光具有不同的相位延迟，导致白光通过后呈现彩色。
        </p>
      </div>
    ),
    'optical-rotation': (
      <div className="text-gray-400 space-y-3">
        <p>
          <strong className="text-white">旋光性</strong>是某些物质（如糖溶液、石英）
          使线偏振光的偏振面发生旋转的现象。旋转角度与物质浓度和光程成正比。
        </p>
      </div>
    ),
    'mie-scattering': (
      <div className="text-gray-400 space-y-3">
        <p>
          <strong className="text-white">米氏散射</strong>描述了光被与其波长相当或更大的粒子散射的现象。
          散射光的偏振状态取决于粒子的大小、形状和折射率。
        </p>
      </div>
    ),
    rayleigh: (
      <div className="text-gray-400 space-y-3">
        <p>
          <strong className="text-white">瑞利散射</strong>发生在粒子远小于光波长时。
          散射强度与波长的四次方成反比，这解释了为什么天空是蓝色的。
          散射光在垂直于入射方向时为完全线偏振。
        </p>
      </div>
    ),
    stokes: (
      <div className="text-gray-400 space-y-3">
        <p>
          <strong className="text-white">斯托克斯矢量</strong>用四个参数 [S₀, S₁, S₂, S₃]
          完整描述光的偏振状态，包括部分偏振光。
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>S₀：总光强</li>
          <li>S₁：水平/垂直偏振分量之差</li>
          <li>S₂：+45°/-45°偏振分量之差</li>
          <li>S₃：右旋/左旋圆偏振分量之差</li>
        </ul>
      </div>
    ),
    mueller: (
      <div className="text-gray-400 space-y-3">
        <p>
          <strong className="text-white">穆勒矩阵</strong>是一个4×4矩阵，
          描述光学元件对斯托克斯矢量的变换。通过穆勒矩阵可以分析复杂光学系统的偏振特性。
        </p>
      </div>
    ),
  }

  return descriptions[demoId] || <p className="text-gray-500">暂无说明</p>
}
