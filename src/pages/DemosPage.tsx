/**
 * 演示页面 - 五个单元的交互式演示
 */
import { useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

// 演示组件
import { MalusLawDemo } from '@/components/demos/unit1/MalusLawDemo'
import { BirefringenceDemo } from '@/components/demos/unit1/BirefringenceDemo'
import { WaveplateDemo } from '@/components/demos/unit1/WaveplateDemo'
import { FresnelDemo } from '@/components/demos/unit2/FresnelDemo'
import { BrewsterDemo } from '@/components/demos/unit2/BrewsterDemo'
import { ChromaticDemo } from '@/components/demos/unit3/ChromaticDemo'
import { OpticalRotationDemo } from '@/components/demos/unit3/OpticalRotationDemo'
import { MieScatteringDemo } from '@/components/demos/unit4/MieScatteringDemo'
import { RayleighScatteringDemo } from '@/components/demos/unit4/RayleighScatteringDemo'
import { StokesVectorDemo } from '@/components/demos/unit5/StokesVectorDemo'
import { MuellerMatrixDemo } from '@/components/demos/unit5/MuellerMatrixDemo'

interface DemoItem {
  id: string
  title: string
  unit: number
  component: React.ComponentType
  description: string
}

const DEMOS: DemoItem[] = [
  {
    id: 'malus',
    title: '马吕斯定律',
    unit: 1,
    component: MalusLawDemo,
    description: '偏振光通过偏振片时的强度变化规律：I = I₀ × cos²(θ)',
  },
  {
    id: 'birefringence',
    title: '双折射效应',
    unit: 1,
    component: BirefringenceDemo,
    description: '方解石等晶体将一束光分裂为o光和e光的现象',
  },
  {
    id: 'waveplate',
    title: '波片原理',
    unit: 1,
    component: WaveplateDemo,
    description: '四分之一波片和二分之一波片对偏振态的影响',
  },
  {
    id: 'fresnel',
    title: '菲涅尔方程',
    unit: 2,
    component: FresnelDemo,
    description: 's偏振和p偏振的反射/透射系数随入射角的变化',
  },
  {
    id: 'brewster',
    title: '布儒斯特角',
    unit: 2,
    component: BrewsterDemo,
    description: '反射光为完全s偏振的特殊入射角：tan(θB) = n₂/n₁',
  },
  {
    id: 'chromatic',
    title: '色偏振',
    unit: 3,
    component: ChromaticDemo,
    description: '双折射材料中白光的彩色干涉效应',
  },
  {
    id: 'optical-rotation',
    title: '旋光性',
    unit: 3,
    component: OpticalRotationDemo,
    description: '糖溶液等手性物质使偏振面旋转的现象',
  },
  {
    id: 'mie-scattering',
    title: '米氏散射',
    unit: 4,
    component: MieScatteringDemo,
    description: '粒径与波长相当时的散射特性（白云效应）',
  },
  {
    id: 'rayleigh',
    title: '瑞利散射',
    unit: 4,
    component: RayleighScatteringDemo,
    description: '粒径远小于波长时的散射特性（蓝天效应）',
  },
  {
    id: 'stokes',
    title: '斯托克斯矢量',
    unit: 5,
    component: StokesVectorDemo,
    description: '用四个参数完整描述光的偏振状态',
  },
  {
    id: 'mueller',
    title: '穆勒矩阵',
    unit: 5,
    component: MuellerMatrixDemo,
    description: '4×4矩阵描述光学元件对偏振态的变换',
  },
]

const UNITS = [
  { num: 1, title: '偏振态调制与测量', color: 'cyan' },
  { num: 2, title: '界面反射偏振特征', color: 'purple' },
  { num: 3, title: '透明介质的偏振', color: 'green' },
  { num: 4, title: '浑浊介质的偏振', color: 'orange' },
  { num: 5, title: '全偏振技术', color: 'pink' },
]

// 加载占位组件
function DemoLoading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-4" />
        <p className="text-gray-400">加载演示中...</p>
      </div>
    </div>
  )
}

export function DemosPage() {
  const [activeDemo, setActiveDemo] = useState<string>('malus')

  const currentDemo = DEMOS.find((d) => d.id === activeDemo)
  const DemoComponent = currentDemo?.component

  return (
    <div className="min-h-screen bg-[#121218] text-gray-200">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 border-b border-cyan-400/20 px-8 py-4 flex items-center justify-between backdrop-blur-sm">
        <Link
          to="/"
          className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
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
          <Link to="/demos" className="px-4 py-2 rounded-md text-cyan-400 bg-cyan-400/15">
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
                        'w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm text-left transition-all',
                        activeDemo === demo.id
                          ? 'bg-cyan-400/20 text-cyan-400'
                          : 'text-gray-400 hover:bg-cyan-400/10 hover:text-white'
                      )}
                    >
                      <span
                        className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center text-[10px]',
                          activeDemo === demo.id ? 'bg-cyan-400 text-black' : 'bg-cyan-400/20'
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

          {/* 底部说明 */}
          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <h4 className="text-xs font-semibold text-cyan-400 mb-2">交互说明</h4>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>- 拖拽旋转3D视图</li>
              <li>- 滚轮缩放</li>
              <li>- 调整参数观察变化</li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            {/* 标题和描述 */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 text-xs bg-cyan-400/20 text-cyan-400 rounded">
                  单元 {currentDemo?.unit}
                </span>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {currentDemo?.title}
                </h1>
              </div>
              <p className="text-gray-400">{currentDemo?.description}</p>
            </div>

            {/* 演示区域 */}
            <div className="bg-slate-800/30 rounded-xl border border-cyan-400/20 p-4 lg:p-6 min-h-[500px]">
              <Suspense fallback={<DemoLoading />}>
                {DemoComponent && <DemoComponent />}
              </Suspense>
            </div>

            {/* 底部信息 */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-sm font-semibold text-cyan-400 mb-2">物理原理</h3>
                <p className="text-xs text-gray-400">
                  {currentDemo?.unit === 1 && '偏振光的基本性质和马吕斯定律'}
                  {currentDemo?.unit === 2 && '光在界面反射时的偏振特性'}
                  {currentDemo?.unit === 3 && '透明介质中的偏振效应'}
                  {currentDemo?.unit === 4 && '散射过程中的偏振特征'}
                  {currentDemo?.unit === 5 && '全偏振分析技术'}
                </p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-sm font-semibold text-green-400 mb-2">实验应用</h3>
                <p className="text-xs text-gray-400">
                  {currentDemo?.unit === 1 && '偏光显微镜、光学仪器'}
                  {currentDemo?.unit === 2 && '减反射涂层、偏振滤镜'}
                  {currentDemo?.unit === 3 && '旋光仪、糖度测量'}
                  {currentDemo?.unit === 4 && '大气光学、海洋探测'}
                  {currentDemo?.unit === 5 && '偏振成像、材料检测'}
                </p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-sm font-semibold text-purple-400 mb-2">前沿应用</h3>
                <p className="text-xs text-gray-400">
                  {currentDemo?.unit === 1 && '量子通信、光学信息处理'}
                  {currentDemo?.unit === 2 && '光子晶体、纳米光学'}
                  {currentDemo?.unit === 3 && '手性药物检测、生物成像'}
                  {currentDemo?.unit === 4 && '遥感探测、自动驾驶'}
                  {currentDemo?.unit === 5 && '癌症早筛、材料无损检测'}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
