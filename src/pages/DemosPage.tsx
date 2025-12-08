/**
 * 演示页面 - 五个单元的交互式演示
 * 增强版 - 包含详细的物理原理、实验应用和前沿应用
 */
import { useState, Suspense, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { InfoCard, ListItem } from '@/components/demos/DemoControls'

// 演示组件
import { MalusLawDemo } from '@/components/demos/unit1/MalusLawDemo'
import { BirefringenceDemo } from '@/components/demos/unit1/BirefringenceDemo'
import { WaveplateDemo } from '@/components/demos/unit1/WaveplateDemo'
import { PolarizationStateDemo } from '@/components/demos/unit1/PolarizationStateDemo'
import { FresnelDemo } from '@/components/demos/unit2/FresnelDemo'
import { BrewsterDemo } from '@/components/demos/unit2/BrewsterDemo'
import { ChromaticDemo } from '@/components/demos/unit3/ChromaticDemo'
import { OpticalRotationDemo } from '@/components/demos/unit3/OpticalRotationDemo'
import { MieScatteringDemo } from '@/components/demos/unit4/MieScatteringDemo'
import { RayleighScatteringDemo } from '@/components/demos/unit4/RayleighScatteringDemo'
import { StokesVectorDemo } from '@/components/demos/unit5/StokesVectorDemo'
import { MuellerMatrixDemo } from '@/components/demos/unit5/MuellerMatrixDemo'

// 图标组件
function PhysicsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 10v6M1 12h6m10 0h6" />
      <path d="M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24" />
    </svg>
  )
}

function ExperimentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M9 3h6v8l4 9H5l4-9V3z" />
      <path d="M9 3h6" strokeLinecap="round" />
      <circle cx="10" cy="16" r="1" fill="currentColor" />
      <circle cx="14" cy="14" r="1" fill="currentColor" />
    </svg>
  )
}

function FrontierIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

// SVG 示意图组件
function MalusDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <defs>
        <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      {/* 光源 */}
      <circle cx="20" cy="40" r="12" fill="#fbbf24" opacity="0.8" />
      <text x="20" y="65" textAnchor="middle" fill="#94a3b8" fontSize="8">光源</text>
      {/* 光束 */}
      <rect x="35" y="38" width="40" height="4" fill="url(#beamGrad)" />
      {/* 偏振片 */}
      <rect x="78" y="25" width="4" height="30" fill="#22d3ee" rx="1" />
      <line x1="80" y1="20" x2="80" y2="60" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2" />
      <text x="80" y="72" textAnchor="middle" fill="#94a3b8" fontSize="8">偏振片</text>
      {/* 光束 */}
      <rect x="85" y="38" width="40" height="4" fill="#22d3ee" opacity="0.8" />
      {/* 检偏器 */}
      <rect x="128" y="25" width="4" height="30" fill="#a78bfa" rx="1" />
      <line x1="130" y1="22" x2="130" y2="58" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2" transform="rotate(45 130 40)" />
      <text x="130" y="72" textAnchor="middle" fill="#94a3b8" fontSize="8">检偏器</text>
      {/* 出射光 */}
      <rect x="135" y="38" width="30" height="4" fill="#a78bfa" opacity="0.5" />
      {/* 屏幕 */}
      <rect x="168" y="28" width="6" height="24" fill="#64748b" rx="1" />
      <text x="171" y="65" textAnchor="middle" fill="#94a3b8" fontSize="8">屏幕</text>
    </svg>
  )
}

function BirefringenceDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      {/* 入射光 */}
      <line x1="20" y1="40" x2="70" y2="40" stroke="#fbbf24" strokeWidth="3" />
      <polygon points="70,40 64,36 64,44" fill="#fbbf24" />
      {/* 方解石晶体 */}
      <path d="M80,20 L120,20 L130,60 L90,60 Z" fill="#22d3ee" opacity="0.3" stroke="#22d3ee" strokeWidth="1" />
      <text x="105" y="75" textAnchor="middle" fill="#94a3b8" fontSize="8">方解石</text>
      {/* o光 */}
      <line x1="130" y1="35" x2="180" y2="30" stroke="#ff4444" strokeWidth="2" />
      <polygon points="180,30 174,27 174,33" fill="#ff4444" />
      <text x="175" y="22" fill="#ff4444" fontSize="8">o光</text>
      {/* e光 */}
      <line x1="130" y1="45" x2="180" y2="55" stroke="#44ff44" strokeWidth="2" />
      <polygon points="180,55 174,52 174,58" fill="#44ff44" />
      <text x="175" y="68" fill="#44ff44" fontSize="8">e光</text>
    </svg>
  )
}

function WaveplateDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      {/* 入射线偏振光 */}
      <line x1="15" y1="40" x2="55" y2="40" stroke="#fbbf24" strokeWidth="2" />
      <line x1="35" y1="30" x2="35" y2="50" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3" />
      <text x="35" y="65" textAnchor="middle" fill="#94a3b8" fontSize="7">线偏振</text>
      {/* 波片 */}
      <rect x="60" y="25" width="30" height="30" fill="#a78bfa" opacity="0.3" stroke="#a78bfa" strokeWidth="1" />
      <line x1="65" y1="28" x2="85" y2="52" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2" />
      <text x="75" y="68" textAnchor="middle" fill="#94a3b8" fontSize="7">λ/4波片</text>
      {/* 出射圆偏振光 */}
      <ellipse cx="130" cy="40" rx="15" ry="15" fill="none" stroke="#22d3ee" strokeWidth="2" />
      <polygon points="145,40 140,35 140,45" fill="#22d3ee" />
      <text x="130" y="68" textAnchor="middle" fill="#94a3b8" fontSize="7">圆偏振</text>
      {/* 连接线 */}
      <line x1="90" y1="40" x2="112" y2="40" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3" />
    </svg>
  )
}

function PolarizationStateDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      {/* 线偏振 */}
      <line x1="25" y1="25" x2="25" y2="55" stroke="#ffaa00" strokeWidth="2" />
      <circle cx="25" cy="40" r="15" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2" />
      <text x="25" y="75" textAnchor="middle" fill="#94a3b8" fontSize="7">线偏振</text>
      {/* 圆偏振 */}
      <circle cx="100" cy="40" r="15" fill="none" stroke="#44ff44" strokeWidth="2" />
      <polygon points="115,40 110,35 110,45" fill="#44ff44" />
      <text x="100" y="75" textAnchor="middle" fill="#94a3b8" fontSize="7">圆偏振</text>
      {/* 椭圆偏振 */}
      <ellipse cx="175" cy="40" rx="18" ry="10" fill="none" stroke="#a78bfa" strokeWidth="2" transform="rotate(-30 175 40)" />
      <text x="175" y="75" textAnchor="middle" fill="#94a3b8" fontSize="7">椭圆偏振</text>
    </svg>
  )
}

function FresnelDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      {/* 界面 */}
      <line x1="30" y1="50" x2="170" y2="50" stroke="#64748b" strokeWidth="2" />
      <text x="100" y="72" textAnchor="middle" fill="#64748b" fontSize="8">n₁ | n₂</text>
      {/* 入射光 */}
      <line x1="50" y1="15" x2="100" y2="50" stroke="#fbbf24" strokeWidth="2" />
      <polygon points="100,50 92,42 88,48" fill="#fbbf24" />
      {/* 反射光 */}
      <line x1="100" y1="50" x2="150" y2="15" stroke="#22d3ee" strokeWidth="2" />
      <polygon points="150,15 142,19 146,25" fill="#22d3ee" />
      {/* 折射光 */}
      <line x1="100" y1="50" x2="140" y2="78" stroke="#44ff44" strokeWidth="2" opacity="0.7" />
      <text x="60" y="22" fill="#fbbf24" fontSize="8">入射</text>
      <text x="145" y="10" fill="#22d3ee" fontSize="8">反射</text>
    </svg>
  )
}

function BrewsterDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      {/* 界面 */}
      <line x1="30" y1="50" x2="170" y2="50" stroke="#64748b" strokeWidth="2" />
      {/* 入射光 - 布儒斯特角 */}
      <line x1="40" y1="10" x2="100" y2="50" stroke="#fbbf24" strokeWidth="2" />
      <polygon points="100,50 90,42 86,50" fill="#fbbf24" />
      {/* 反射光 - 完全s偏振 */}
      <line x1="100" y1="50" x2="160" y2="10" stroke="#22d3ee" strokeWidth="2" />
      {/* s偏振符号 */}
      <circle cx="130" cy="30" r="4" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
      <circle cx="130" cy="30" r="1" fill="#22d3ee" />
      {/* 角度标注 */}
      <path d="M100,50 L100,35" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2" />
      <text x="108" y="38" fill="#a78bfa" fontSize="8">θB</text>
      <text x="100" y="72" textAnchor="middle" fill="#94a3b8" fontSize="8">tan(θB)=n₂/n₁</text>
    </svg>
  )
}

function ChromaticDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      {/* 白光 */}
      <line x1="20" y1="40" x2="50" y2="40" stroke="#ffffff" strokeWidth="3" />
      {/* 偏振片 */}
      <rect x="55" y="28" width="4" height="24" fill="#22d3ee" />
      {/* 双折射材料 */}
      <rect x="70" y="25" width="40" height="30" fill="#a78bfa" opacity="0.3" stroke="#a78bfa" />
      <text x="90" y="70" textAnchor="middle" fill="#94a3b8" fontSize="7">双折射材料</text>
      {/* 检偏器 */}
      <rect x="120" y="28" width="4" height="24" fill="#22d3ee" />
      {/* 彩色光谱 */}
      <rect x="135" y="35" width="8" height="10" fill="#ff0000" />
      <rect x="145" y="35" width="8" height="10" fill="#ffaa00" />
      <rect x="155" y="35" width="8" height="10" fill="#00ff00" />
      <rect x="165" y="35" width="8" height="10" fill="#0066ff" />
      <rect x="175" y="35" width="8" height="10" fill="#9900ff" />
    </svg>
  )
}

function OpticalRotationDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      {/* 入射偏振光 */}
      <line x1="20" y1="40" x2="50" y2="40" stroke="#fbbf24" strokeWidth="2" />
      <line x1="35" y1="30" x2="35" y2="50" stroke="#fbbf24" strokeWidth="2" />
      {/* 旋光物质 */}
      <ellipse cx="100" cy="40" rx="35" ry="20" fill="#44ff44" opacity="0.2" stroke="#44ff44" />
      <text x="100" y="42" textAnchor="middle" fill="#44ff44" fontSize="8">糖溶液</text>
      {/* 出射旋转后的偏振光 */}
      <line x1="150" y1="40" x2="180" y2="40" stroke="#a78bfa" strokeWidth="2" />
      <line x1="165" y1="28" x2="165" y2="52" stroke="#a78bfa" strokeWidth="2" transform="rotate(30 165 40)" />
      {/* 旋转角度标注 */}
      <path d="M55,30 Q75,25 95,30" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2" />
      <text x="75" y="22" fill="#64748b" fontSize="7">α</text>
    </svg>
  )
}

function ScatteringDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      {/* 入射光 */}
      <line x1="20" y1="40" x2="70" y2="40" stroke="#fbbf24" strokeWidth="2" />
      <polygon points="70,40 64,36 64,44" fill="#fbbf24" />
      {/* 散射粒子 */}
      <circle cx="100" cy="40" r="15" fill="#64748b" opacity="0.3" stroke="#64748b" />
      {/* 散射光线 */}
      <line x1="115" y1="40" x2="160" y2="40" stroke="#22d3ee" strokeWidth="1.5" />
      <line x1="110" y1="28" x2="145" y2="10" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
      <line x1="110" y1="52" x2="145" y2="70" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
      <line x1="100" y1="25" x2="100" y2="5" stroke="#4444ff" strokeWidth="1.5" opacity="0.8" />
      <line x1="90" y1="52" x2="75" y2="70" stroke="#4444ff" strokeWidth="1.5" opacity="0.5" />
      <text x="100" y="75" textAnchor="middle" fill="#94a3b8" fontSize="8">散射</text>
    </svg>
  )
}

function StokesDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      {/* Poincaré球简化 */}
      <circle cx="100" cy="40" r="30" fill="none" stroke="#64748b" strokeWidth="1" />
      <ellipse cx="100" cy="40" rx="30" ry="10" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2" />
      {/* S1轴 */}
      <line x1="65" y1="40" x2="135" y2="40" stroke="#ff4444" strokeWidth="1.5" />
      <text x="140" y="43" fill="#ff4444" fontSize="8">S₁</text>
      {/* S2轴 */}
      <line x1="100" y1="55" x2="100" y2="5" stroke="#44ff44" strokeWidth="1.5" />
      <text x="105" y="10" fill="#44ff44" fontSize="8">S₃</text>
      {/* 偏振态点 */}
      <circle cx="120" cy="30" r="4" fill="#ffff00" />
      {/* 矢量 */}
      <line x1="100" y1="40" x2="120" y2="30" stroke="#ffff00" strokeWidth="1.5" />
      <text x="165" y="40" fill="#94a3b8" fontSize="7">S = [S₀,S₁,S₂,S₃]</text>
    </svg>
  )
}

function MuellerDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      {/* 输入斯托克斯矢量 */}
      <rect x="15" y="25" width="35" height="30" fill="#22d3ee" opacity="0.2" stroke="#22d3ee" rx="3" />
      <text x="32" y="43" textAnchor="middle" fill="#22d3ee" fontSize="10">S</text>
      {/* 穆勒矩阵 */}
      <rect x="70" y="15" width="50" height="50" fill="#a78bfa" opacity="0.2" stroke="#a78bfa" rx="3" />
      <text x="95" y="35" textAnchor="middle" fill="#a78bfa" fontSize="8">M</text>
      <text x="95" y="48" textAnchor="middle" fill="#a78bfa" fontSize="7">4×4</text>
      {/* 输出斯托克斯矢量 */}
      <rect x="140" y="25" width="35" height="30" fill="#44ff44" opacity="0.2" stroke="#44ff44" rx="3" />
      <text x="157" y="43" textAnchor="middle" fill="#44ff44" fontSize="10">S'</text>
      {/* 箭头 */}
      <line x1="52" y1="40" x2="68" y2="40" stroke="#64748b" strokeWidth="1.5" />
      <polygon points="68,40 63,37 63,43" fill="#64748b" />
      <line x1="122" y1="40" x2="138" y2="40" stroke="#64748b" strokeWidth="1.5" />
      <polygon points="138,40 133,37 133,43" fill="#64748b" />
      <text x="95" y="75" textAnchor="middle" fill="#94a3b8" fontSize="8">S' = M · S</text>
    </svg>
  )
}

// 演示信息数据类型
interface DemoInfo {
  physics: {
    principle: string
    formula?: string
    details: string[]
  }
  experiment: {
    title: string
    example: string
    details: string[]
  }
  frontier: {
    title: string
    example: string
    details: string[]
  }
  diagram?: ReactNode
}

// 每个演示的详细信息
const DEMO_INFO: Record<string, DemoInfo> = {
  'polarization-state': {
    physics: {
      principle: '偏振态由两个正交电场分量的振幅比和相位差决定',
      formula: 'E = Ex·cos(ωt) x̂ + Ey·cos(ωt+δ) ŷ',
      details: [
        '当 δ=0° 或 180° 时为线偏振',
        '当 δ=90° 且 Ex=Ey 时为圆偏振',
        '其他情况为椭圆偏振',
      ],
    },
    experiment: {
      title: '偏振态转换实验',
      example: '使用波片将线偏振转为圆偏振',
      details: [
        '四分之一波片可将45°线偏振转为圆偏振',
        '二分之一波片可旋转线偏振方向',
        '液晶可电控偏振态变换',
      ],
    },
    frontier: {
      title: '量子光学与通信',
      example: 'BB84量子密钥分发协议',
      details: [
        '偏振态编码量子比特',
        '单光子偏振用于量子通信',
        '偏振纠缠态实现量子隐形传态',
      ],
    },
    diagram: <PolarizationStateDiagram />,
  },
  malus: {
    physics: {
      principle: '偏振光通过偏振片时的强度变化遵循马吕斯定律',
      formula: 'I = I₀ × cos²(θ)',
      details: [
        'θ 为光偏振方向与偏振片透光轴夹角',
        '平行时(θ=0°)透过率最大',
        '垂直时(θ=90°)完全阻挡',
      ],
    },
    experiment: {
      title: '偏振片组合实验',
      example: '两块偏振片验证马吕斯定律',
      details: [
        '旋转检偏器测量透射光强',
        '使用光电探测器定量测量',
        '可验证 cos² 关系曲线',
      ],
    },
    frontier: {
      title: 'LCD 显示技术',
      example: '液晶显示器的工作原理',
      details: [
        '液晶分子控制偏振态旋转',
        '配合偏振片实现亮度调制',
        '广泛应用于手机、电视屏幕',
      ],
    },
    diagram: <MalusDiagram />,
  },
  birefringence: {
    physics: {
      principle: '双折射晶体将入射光分裂为寻常光(o光)和非寻常光(e光)',
      formula: 'Io = I₀·cos²(θ), Ie = I₀·sin²(θ)',
      details: [
        'o光和e光的偏振方向互相垂直',
        '两光传播速度不同造成相位差',
        '方解石是典型的双折射材料',
      ],
    },
    experiment: {
      title: '方解石双像观察',
      example: '透过方解石观察文字产生双像',
      details: [
        '旋转晶体可看到一个像不动一个像旋转',
        '用偏振片可分别消除两个像',
        '可测量晶体的双折射率差',
      ],
    },
    frontier: {
      title: '偏振光学元件',
      example: '渥拉斯顿棱镜分光',
      details: [
        '用于制作高精度偏振分束器',
        '光通信中的偏振复用技术',
        '偏振干涉测量仪器',
      ],
    },
    diagram: <BirefringenceDiagram />,
  },
  waveplate: {
    physics: {
      principle: '波片利用双折射效应引入可控的相位延迟',
      formula: 'δ = 2π(ne-no)d/λ',
      details: [
        '四分之一波片：δ = π/2 (90°)',
        '二分之一波片：δ = π (180°)',
        '可将线偏振转换为圆偏振或旋转偏振方向',
      ],
    },
    experiment: {
      title: '波片偏振态转换',
      example: '使用波片产生不同偏振态',
      details: [
        '45°线偏振 + λ/4波片 = 圆偏振',
        'λ/2波片可将偏振方向旋转2θ',
        '组合波片可产生任意偏振态',
      ],
    },
    frontier: {
      title: '3D电影与VR显示',
      example: 'RealD 3D圆偏振技术',
      details: [
        '左右眼图像使用不同旋向圆偏振',
        '圆偏振眼镜分离左右图像',
        '倾斜头部不影响3D效果',
      ],
    },
    diagram: <WaveplateDiagram />,
  },
  fresnel: {
    physics: {
      principle: '菲涅尔方程描述光在界面的反射和透射系数',
      formula: 'rs = (n₁cosθᵢ-n₂cosθₜ)/(n₁cosθᵢ+n₂cosθₜ)',
      details: [
        's偏振和p偏振的反射率不同',
        '存在全内反射临界角',
        '布儒斯特角时p偏振反射为零',
      ],
    },
    experiment: {
      title: '界面反射偏振测量',
      example: '测量玻璃表面的偏振反射',
      details: [
        '使用旋转检偏器测量反射偏振度',
        '验证布儒斯特角约为56.3°(玻璃)',
        '可精确测定材料折射率',
      ],
    },
    frontier: {
      title: '减反射涂层',
      example: '相机镜头多层镀膜',
      details: [
        '利用干涉减少表面反射',
        '提高光学系统透过率',
        '应用于眼镜、太阳能电池',
      ],
    },
    diagram: <FresnelDiagram />,
  },
  brewster: {
    physics: {
      principle: '布儒斯特角是p偏振反射率为零的入射角',
      formula: 'tan(θB) = n₂/n₁',
      details: [
        '此角度下反射光为完全s偏振',
        '折射光和反射光垂直',
        '玻璃的布儒斯特角约56.3°',
      ],
    },
    experiment: {
      title: '布儒斯特角偏振实验',
      example: '观察水面的偏振反射',
      details: [
        '水面布儒斯特角约53°',
        '可用偏振片消除水面反光',
        '摄影师常用偏振滤镜',
      ],
    },
    frontier: {
      title: '偏振摄影',
      example: '偏振滤镜消除反光',
      details: [
        '消除玻璃橱窗反光',
        '增强天空蓝色对比度',
        '水下摄影减少水面反射',
      ],
    },
    diagram: <BrewsterDiagram />,
  },
  chromatic: {
    physics: {
      principle: '双折射材料中不同波长光的相位延迟不同',
      formula: 'δ(λ) = 2π(ne-no)d/λ',
      details: [
        '白光经过会产生彩色干涉',
        '颜色取决于材料厚度和双折射率',
        '正交偏振片间显示互补色',
      ],
    },
    experiment: {
      title: '偏光显微镜观察',
      example: '观察透明胶带的应力分布',
      details: [
        '透明塑料片呈现彩虹色带',
        '应力双折射显示应力分布',
        '可检测材料内部缺陷',
      ],
    },
    frontier: {
      title: '光弹性应力分析',
      example: '工程结构应力检测',
      details: [
        '制作透明模型研究应力分布',
        '航空航天结构设计验证',
        '建筑结构安全评估',
      ],
    },
    diagram: <ChromaticDiagram />,
  },
  'optical-rotation': {
    physics: {
      principle: '手性分子使线偏振光的偏振面旋转',
      formula: 'α = [α]·l·c',
      details: [
        '[α]为比旋光度(手性分子特性)',
        'l为样品路径长度',
        'c为溶液浓度',
      ],
    },
    experiment: {
      title: '旋光仪测量糖浓度',
      example: '使用旋光仪测定糖度',
      details: [
        '葡萄糖为右旋糖(+52.7°)',
        '果糖为左旋糖(-92°)',
        '食品工业常用糖度测量',
      ],
    },
    frontier: {
      title: '手性药物检测',
      example: '药物对映体分析',
      details: [
        '许多药物有左旋右旋两种形式',
        '不同旋向可能有不同药效/毒性',
        '制药行业必须区分对映体',
      ],
    },
    diagram: <OpticalRotationDiagram />,
  },
  'mie-scattering': {
    physics: {
      principle: '粒径与波长相当时的散射，散射强度与波长关系复杂',
      formula: '散射效率 Qsca ≈ 2 (大粒子极限)',
      details: [
        '散射光谱较平坦',
        '白云呈白色是米氏散射结果',
        '前向散射占主导',
      ],
    },
    experiment: {
      title: '牛奶稀释散射实验',
      example: '观察牛奶的散射现象',
      details: [
        '稀释牛奶呈现淡蓝色(瑞利)',
        '浓牛奶呈白色(米氏)',
        '可观察散射颜色变化',
      ],
    },
    frontier: {
      title: '大气气溶胶监测',
      example: '激光雷达测量PM2.5',
      details: [
        '大气颗粒物属于米氏散射',
        '激光雷达反演粒子浓度',
        '空气质量实时监测',
      ],
    },
    diagram: <ScatteringDiagram />,
  },
  rayleigh: {
    physics: {
      principle: '粒径远小于波长时的散射，强度与λ⁻⁴成正比',
      formula: 'I ∝ 1/λ⁴',
      details: [
        '短波长(蓝光)散射更强',
        '这是天空呈蓝色的原因',
        '日落时红色是因蓝光被散射掉',
      ],
    },
    experiment: {
      title: '天空蓝色实验',
      example: '水中加入少量牛奶模拟',
      details: [
        '侧向观察呈淡蓝色',
        '透射光呈橙红色',
        '模拟日落天空颜色',
      ],
    },
    frontier: {
      title: '遥感大气校正',
      example: '卫星图像大气校正',
      details: [
        '去除大气散射影响',
        '获得地表真实反射率',
        '提高遥感图像质量',
      ],
    },
    diagram: <ScatteringDiagram />,
  },
  stokes: {
    physics: {
      principle: '斯托克斯矢量用四个参数完整描述偏振态',
      formula: 'S = [S₀, S₁, S₂, S₃]ᵀ',
      details: [
        'S₀: 总光强',
        'S₁: 水平vs垂直偏振',
        'S₂: +45°vs-45°偏振',
        'S₃: 右旋vs左旋圆偏振',
      ],
    },
    experiment: {
      title: '斯托克斯参数测量',
      example: '四次测量确定偏振态',
      details: [
        '使用旋转检偏器测量',
        '配合波片测量圆偏振分量',
        '可测量任意偏振态',
      ],
    },
    frontier: {
      title: '偏振遥感',
      example: '卫星偏振成像',
      details: [
        '测量地表偏振特性',
        '区分水体、植被、建筑',
        '大气气溶胶反演',
      ],
    },
    diagram: <StokesDiagram />,
  },
  mueller: {
    physics: {
      principle: '穆勒矩阵描述光学元件对偏振态的变换',
      formula: "S' = M · S",
      details: [
        '4×4矩阵描述线性变换',
        '可级联多个光学元件',
        '包含16个独立参数',
      ],
    },
    experiment: {
      title: '光学元件穆勒矩阵测量',
      example: '测量偏振片的穆勒矩阵',
      details: [
        '使用偏振态发生器',
        '测量多组输入输出',
        '反演得到穆勒矩阵',
      ],
    },
    frontier: {
      title: '生物医学成像',
      example: '穆勒矩阵偏振成像',
      details: [
        '皮肤癌早期筛查',
        '眼底病变检测',
        '组织结构定量分析',
      ],
    },
    diagram: <MuellerDiagram />,
  },
}

interface DemoItem {
  id: string
  title: string
  unit: number
  component: React.ComponentType
  description: string
}

const DEMOS: DemoItem[] = [
  {
    id: 'polarization-state',
    title: '偏振态与波合成',
    unit: 1,
    component: PolarizationStateDemo,
    description: '光波合成产生不同偏振态：线偏振、圆偏振、椭圆偏振',
  },
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
  const [activeDemo, setActiveDemo] = useState<string>('polarization-state')

  const currentDemo = DEMOS.find((d) => d.id === activeDemo)
  const DemoComponent = currentDemo?.component
  const demoInfo = DEMO_INFO[activeDemo]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 border-b border-cyan-400/20 px-6 py-3 flex items-center justify-between backdrop-blur-sm">
        <Link
          to="/"
          className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span className="text-2xl">⟡</span>
          <span className="text-xl font-bold">PolarCraft</span>
        </Link>
        <nav className="flex gap-4">
          <Link
            to="/game"
            className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-cyan-400/10 transition-all"
          >
            游戏
          </Link>
          <Link to="/demos" className="px-4 py-2 rounded-lg text-cyan-400 bg-cyan-400/15">
            课程
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <div className="flex pt-[60px]">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 top-[60px] bottom-0 bg-slate-900/90 border-r border-cyan-400/10 overflow-y-auto">
          <div className="p-4">
            {UNITS.map((unit) => (
              <div key={unit.num} className="mb-5">
                <h3 className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 px-2 font-semibold">
                  单元 {unit.num} · {unit.title}
                </h3>
                <ul className="space-y-0.5">
                  {DEMOS.filter((d) => d.unit === unit.num).map((demo) => (
                    <li key={demo.id}>
                      <button
                        onClick={() => setActiveDemo(demo.id)}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all',
                          activeDemo === demo.id
                            ? 'bg-gradient-to-r from-cyan-400/20 to-blue-400/10 text-cyan-400 border-l-2 border-cyan-400'
                            : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                        )}
                      >
                        <span
                          className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0',
                            activeDemo === demo.id
                              ? 'bg-cyan-400 text-black'
                              : 'bg-slate-700 text-gray-400'
                          )}
                        >
                          {DEMOS.filter((d) => d.unit === demo.unit).indexOf(demo) + 1}
                        </span>
                        <span className="truncate">{demo.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 底部说明 */}
          <div className="p-4 border-t border-slate-800">
            <div className="p-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/50">
              <h4 className="text-xs font-semibold text-cyan-400 mb-2">交互说明</h4>
              <ul className="text-[11px] text-gray-500 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">◎</span>
                  拖拽旋转3D视图
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">◎</span>
                  滚轮缩放画面
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">◎</span>
                  滑块调整参数
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6">
          <div className="max-w-[1400px] mx-auto">
            {/* 标题和描述 */}
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 text-xs bg-gradient-to-r from-cyan-400/20 to-blue-400/20 text-cyan-400 rounded-lg border border-cyan-400/30">
                  单元 {currentDemo?.unit}
                </span>
                <h1 className="text-2xl font-bold text-white">{currentDemo?.title}</h1>
              </div>
              <p className="text-gray-400 text-sm">{currentDemo?.description}</p>
            </div>

            {/* 演示区域 */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-2xl border border-cyan-400/20 overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.1)]">
              <div className="p-5 min-h-[550px]">
                <Suspense fallback={<DemoLoading />}>
                  {DemoComponent && <DemoComponent />}
                </Suspense>
              </div>
            </div>

            {/* 底部信息卡片 - 三列布局 */}
            {demoInfo && (
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* 物理原理 */}
                <InfoCard title="物理原理" icon={<PhysicsIcon />} color="cyan">
                  <div className="space-y-4">
                    {/* 示意图 */}
                    {demoInfo.diagram && (
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                        {demoInfo.diagram}
                      </div>
                    )}
                    {/* 原理说明 */}
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {demoInfo.physics.principle}
                    </p>
                    {/* 公式 */}
                    {demoInfo.physics.formula && (
                      <div className="font-mono text-cyan-400 bg-slate-900/70 px-3 py-2 rounded-lg text-center text-sm border border-cyan-400/20">
                        {demoInfo.physics.formula}
                      </div>
                    )}
                    {/* 详细说明 */}
                    <div className="space-y-2">
                      {demoInfo.physics.details.map((detail, i) => (
                        <ListItem key={i} icon="•">
                          {detail}
                        </ListItem>
                      ))}
                    </div>
                  </div>
                </InfoCard>

                {/* 实验应用 */}
                <InfoCard title="实验应用" icon={<ExperimentIcon />} color="green">
                  <div className="space-y-4">
                    {/* 实验标题 */}
                    <div className="bg-green-400/10 rounded-lg px-3 py-2 border border-green-400/20">
                      <h5 className="text-green-400 font-semibold text-sm">
                        {demoInfo.experiment.title}
                      </h5>
                      <p className="text-xs text-gray-400 mt-1">{demoInfo.experiment.example}</p>
                    </div>
                    {/* 实验步骤/说明 */}
                    <div className="space-y-2">
                      {demoInfo.experiment.details.map((detail, i) => (
                        <ListItem key={i} icon={<span className="text-green-400">✓</span>}>
                          {detail}
                        </ListItem>
                      ))}
                    </div>
                  </div>
                </InfoCard>

                {/* 前沿应用 */}
                <InfoCard title="前沿应用" icon={<FrontierIcon />} color="purple">
                  <div className="space-y-4">
                    {/* 应用标题 */}
                    <div className="bg-purple-400/10 rounded-lg px-3 py-2 border border-purple-400/20">
                      <h5 className="text-purple-400 font-semibold text-sm">
                        {demoInfo.frontier.title}
                      </h5>
                      <p className="text-xs text-gray-400 mt-1">{demoInfo.frontier.example}</p>
                    </div>
                    {/* 前沿细节 */}
                    <div className="space-y-2">
                      {demoInfo.frontier.details.map((detail, i) => (
                        <ListItem key={i} icon={<span className="text-purple-400">→</span>}>
                          {detail}
                        </ListItem>
                      ))}
                    </div>
                  </div>
                </InfoCard>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
