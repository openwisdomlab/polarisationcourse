import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a] flex flex-col items-center justify-center p-10">
      {/* Light beam decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[10, 30, 70, 90].map((left, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-screen bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-beam-move"
            style={{
              left: `${left}%`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="text-center mb-16 relative z-10">
        <div className="text-7xl mb-5 animate-pulse-glow">⟡</div>
        <h1 className="text-5xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_30px_rgba(100,200,255,0.5)]">
          偏振光下的新世界
        </h1>
        <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
          从冰洲石实验到全偏振成像，覆盖五大单元的研究型学习课程。
          通过游戏化学习情境与交互式演示，在"玩"中学，在"做"中悟，
          深刻领会"偏振光无处不在"的核心观念。
        </p>
      </header>

      {/* Navigation Cards */}
      <nav className="flex flex-wrap justify-center gap-10 max-w-4xl relative z-10">
        {/* Game Card */}
        <Link
          to="/game"
          className="group relative bg-slate-900/80 border-2 border-orange-400/30 rounded-2xl p-10 w-96 text-center
                     transition-all duration-400 hover:-translate-y-2.5 hover:scale-[1.02]
                     hover:border-orange-400/60 hover:shadow-[0_20px_60px_rgba(255,180,100,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="text-7xl mb-6 block drop-shadow-[0_0_40px_rgba(255,180,100,0.6)]">
            🎮
          </span>
          <h2 className="text-2xl font-bold text-orange-400 mb-4">游戏探索</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            在3D体素世界中，运用偏振光原理解决谜题。
            放置光源、偏振片、波片等光学元件，引导光束到达目标！
          </p>
          <ul className="text-left text-xs text-gray-500 space-y-2 mb-6">
            <li className="pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-orange-400">
              Minecraft风格3D探索
            </li>
            <li className="pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-orange-400">
              马吕斯定律实际应用
            </li>
            <li className="pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-orange-400">
              双折射与光束分裂
            </li>
            <li className="pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-orange-400">
              多关卡递进挑战
            </li>
          </ul>
          <span className="inline-block px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider
                          bg-gradient-to-r from-orange-400 to-orange-500 text-black
                          group-hover:scale-110 group-hover:shadow-lg transition-transform">
            进入游戏
          </span>
        </Link>

        {/* Course Card */}
        <Link
          to="/demos"
          className="group relative bg-slate-900/80 border-2 border-cyan-400/30 rounded-2xl p-10 w-96 text-center
                     transition-all duration-400 hover:-translate-y-2.5 hover:scale-[1.02]
                     hover:border-cyan-400/60 hover:shadow-[0_20px_60px_rgba(100,200,255,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="text-7xl mb-6 block drop-shadow-[0_0_40px_rgba(100,200,255,0.6)]">
            📚
          </span>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">五单元课程</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            11个交互式演示，覆盖偏振态调制、界面反射、透明与浑浊介质偏振、全偏振技术等五大单元。
          </p>
          <ul className="text-left text-xs text-gray-500 space-y-2 mb-6">
            <li className="pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cyan-400">
              第一单元：偏振态调制与测量
            </li>
            <li className="pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cyan-400">
              第二单元：界面反射偏振特征
            </li>
            <li className="pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cyan-400">
              第三单元：透明介质的偏振
            </li>
            <li className="pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cyan-400">
              第四/五单元：散射与全偏振技术
            </li>
          </ul>
          <span className="inline-block px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider
                          bg-gradient-to-r from-cyan-400 to-blue-500 text-black
                          group-hover:scale-110 group-hover:shadow-lg transition-transform">
            开始学习
          </span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-600 text-sm relative z-10">
        <p>
          研究型学习 · PSRT · ESRT · ORIC | 应用领域：海洋 · 生医 · 材料 · 工业检测 · 自动驾驶
        </p>
      </footer>
    </div>
  )
}
