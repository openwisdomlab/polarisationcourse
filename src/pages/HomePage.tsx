import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-10 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
    }`}>
      {/* Settings */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageThemeSwitcher />
      </div>

      {/* Light beam decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[10, 30, 70, 90].map((left, i) => (
          <div
            key={i}
            className={`absolute w-0.5 h-screen bg-gradient-to-b from-transparent to-transparent animate-beam-move ${
              theme === 'dark' ? 'via-cyan-400/30' : 'via-cyan-500/20'
            }`}
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
        <h1 className={`text-5xl font-bold mb-4 ${
          theme === 'dark'
            ? 'text-cyan-400 drop-shadow-[0_0_30px_rgba(100,200,255,0.5)]'
            : 'text-cyan-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]'
        }`}>
          {t('home.title')}
        </h1>
        <h2 className={`text-2xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {t('home.subtitle')}
        </h2>
        <p className={`text-lg max-w-xl leading-relaxed ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {t('home.description')}
        </p>
      </header>

      {/* Navigation Cards */}
      <nav className="flex flex-wrap justify-center gap-10 max-w-4xl relative z-10">
        {/* Game Card */}
        <Link
          to="/game"
          className={`group relative rounded-2xl p-10 w-96 text-center
                     transition-all duration-400 hover:-translate-y-2.5 hover:scale-[1.02] ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-2 border-orange-400/30 hover:border-orange-400/60 hover:shadow-[0_20px_60px_rgba(255,180,100,0.3)]'
              : 'bg-white/90 border-2 border-orange-400/40 hover:border-orange-400/70 hover:shadow-[0_20px_60px_rgba(255,180,100,0.2)]'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="text-7xl mb-6 block drop-shadow-[0_0_40px_rgba(255,180,100,0.6)]">
            🎮
          </span>
          <h2 className="text-2xl font-bold text-orange-400 mb-4">{t('common.game')}</h2>
          <p className={`text-sm mb-6 leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('home.gameDescription')}
          </p>
          <span className="inline-block px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider
                          bg-gradient-to-r from-orange-400 to-orange-500 text-black
                          group-hover:scale-110 group-hover:shadow-lg transition-transform">
            {t('home.playGame')}
          </span>
        </Link>

        {/* Course Card */}
        <Link
          to="/demos"
          className={`group relative rounded-2xl p-10 w-96 text-center
                     transition-all duration-400 hover:-translate-y-2.5 hover:scale-[1.02] ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-2 border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-[0_20px_60px_rgba(100,200,255,0.3)]'
              : 'bg-white/90 border-2 border-cyan-500/40 hover:border-cyan-500/70 hover:shadow-[0_20px_60px_rgba(6,182,212,0.2)]'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="text-7xl mb-6 block drop-shadow-[0_0_40px_rgba(100,200,255,0.6)]">
            📚
          </span>
          <h2 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          }`}>
            {t('common.course')}
          </h2>
          <p className={`text-sm mb-6 leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('home.courseDescription')}
          </p>
          <span className={`inline-block px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider
                          bg-gradient-to-r from-cyan-400 to-blue-500 text-black
                          group-hover:scale-110 group-hover:shadow-lg transition-transform`}>
            {t('home.startCourse')}
          </span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className={`mt-16 text-center text-sm relative z-10 ${
        theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
      }`}>
        <p>
          PolarCraft | PSRT · ESRT · ORIC
        </p>
      </footer>
    </div>
  )
}
