import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 ${
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
      <header className="text-center mb-8 sm:mb-12 md:mb-16 relative z-10 px-2">
        <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-5 animate-pulse-glow">⟡</div>
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 ${
          theme === 'dark'
            ? 'text-cyan-400 drop-shadow-[0_0_30px_rgba(100,200,255,0.5)]'
            : 'text-cyan-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]'
        }`}>
          {t('home.title')}
        </h1>
        <h2 className={`text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {t('home.subtitle')}
        </h2>
        <p className={`text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mx-auto ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {t('home.description')}
        </p>
      </header>

      {/* Navigation Cards - Row 1: Games & Course */}
      <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl relative z-10 w-full px-2">
        {/* 3D Game Card */}
        <Link
          to="/game"
          className={`group relative rounded-2xl p-4 sm:p-5 text-center
                     transition-all duration-400 hover:-translate-y-2 hover:scale-[1.02] ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-2 border-orange-400/30 hover:border-orange-400/60 hover:shadow-[0_15px_40px_rgba(255,180,100,0.3)]'
              : 'bg-white/90 border-2 border-orange-400/40 hover:border-orange-400/70 hover:shadow-[0_15px_40px_rgba(255,180,100,0.2)]'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="text-3xl sm:text-4xl mb-2 block drop-shadow-[0_0_30px_rgba(255,180,100,0.6)]">🎮</span>
          <h2 className="text-base sm:text-lg font-bold text-orange-400 mb-1">{t('home.game3d')}</h2>
          <p className={`text-xs mb-2 leading-relaxed line-clamp-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('home.game3dDescription')}
          </p>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                          bg-gradient-to-r from-orange-400 to-orange-500 text-black
                          group-hover:scale-105 transition-transform">
            {t('home.playGame')}
          </span>
        </Link>

        {/* 2D Game Card */}
        <Link
          to="/game2d"
          className={`group relative rounded-2xl p-4 sm:p-5 text-center
                     transition-all duration-400 hover:-translate-y-2 hover:scale-[1.02] ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-2 border-purple-400/30 hover:border-purple-400/60 hover:shadow-[0_15px_40px_rgba(180,100,255,0.3)]'
              : 'bg-white/90 border-2 border-purple-400/40 hover:border-purple-400/70 hover:shadow-[0_15px_40px_rgba(180,100,255,0.2)]'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="text-3xl sm:text-4xl mb-2 block drop-shadow-[0_0_30px_rgba(180,100,255,0.6)]">🔬</span>
          <h2 className="text-base sm:text-lg font-bold text-purple-400 mb-1">{t('home.game2d')}</h2>
          <p className={`text-xs mb-2 leading-relaxed line-clamp-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('home.game2dDescription')}
          </p>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                          bg-gradient-to-r from-purple-400 to-purple-500 text-white
                          group-hover:scale-105 transition-transform">
            {t('home.play2D')}
          </span>
        </Link>

        {/* Course Card */}
        <Link
          to="/demos"
          className={`group relative rounded-2xl p-4 sm:p-5 text-center
                     transition-all duration-400 hover:-translate-y-2 hover:scale-[1.02] ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-2 border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-[0_15px_40px_rgba(100,200,255,0.3)]'
              : 'bg-white/90 border-2 border-cyan-500/40 hover:border-cyan-500/70 hover:shadow-[0_15px_40px_rgba(6,182,212,0.2)]'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="text-3xl sm:text-4xl mb-2 block drop-shadow-[0_0_30px_rgba(100,200,255,0.6)]">📚</span>
          <h2 className={`text-base sm:text-lg font-bold mb-1 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          }`}>
            {t('common.course')}
          </h2>
          <p className={`text-xs mb-2 leading-relaxed line-clamp-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('home.courseDescription')}
          </p>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                          bg-gradient-to-r from-cyan-400 to-blue-500 text-black
                          group-hover:scale-105 transition-transform">
            {t('home.startCourse')}
          </span>
        </Link>

        {/* Hardware UC2 Card */}
        <Link
          to="/hardware"
          className={`group relative rounded-2xl p-4 sm:p-5 text-center
                     transition-all duration-400 hover:-translate-y-2 hover:scale-[1.02] ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-2 border-green-400/30 hover:border-green-400/60 hover:shadow-[0_15px_40px_rgba(100,255,150,0.3)]'
              : 'bg-white/90 border-2 border-green-500/40 hover:border-green-500/70 hover:shadow-[0_15px_40px_rgba(34,197,94,0.2)]'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="text-3xl sm:text-4xl mb-2 block drop-shadow-[0_0_30px_rgba(100,255,150,0.6)]">🔧</span>
          <h2 className="text-base sm:text-lg font-bold text-green-400 mb-1">{t('home.hardware')}</h2>
          <p className={`text-xs mb-2 leading-relaxed line-clamp-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('home.hardwareDescription')}
          </p>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                          bg-gradient-to-r from-green-400 to-emerald-500 text-black
                          group-hover:scale-105 transition-transform">
            {t('home.exploreHardware')}
          </span>
        </Link>

        {/* Card Game */}
        <Link
          to="/cardgame"
          className={`group relative rounded-2xl p-4 sm:p-5 text-center
                     transition-all duration-400 hover:-translate-y-2 hover:scale-[1.02] ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-2 border-yellow-400/30 hover:border-yellow-400/60 hover:shadow-[0_15px_40px_rgba(255,220,100,0.3)]'
              : 'bg-white/90 border-2 border-yellow-500/40 hover:border-yellow-500/70 hover:shadow-[0_15px_40px_rgba(234,179,8,0.2)]'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="text-3xl sm:text-4xl mb-2 block drop-shadow-[0_0_30px_rgba(255,220,100,0.6)]">🎴</span>
          <h2 className="text-base sm:text-lg font-bold text-yellow-400 mb-1">{t('home.cardGame')}</h2>
          <p className={`text-xs mb-2 leading-relaxed line-clamp-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('home.cardGameDescription')}
          </p>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                          bg-gradient-to-r from-yellow-400 to-amber-500 text-black
                          group-hover:scale-105 transition-transform">
            {t('home.playCardGame')}
          </span>
        </Link>

        {/* Merchandise */}
        <Link
          to="/merchandise"
          className={`group relative rounded-2xl p-4 sm:p-5 text-center
                     transition-all duration-400 hover:-translate-y-2 hover:scale-[1.02] ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-2 border-pink-400/30 hover:border-pink-400/60 hover:shadow-[0_15px_40px_rgba(255,100,180,0.3)]'
              : 'bg-white/90 border-2 border-pink-400/40 hover:border-pink-400/70 hover:shadow-[0_15px_40px_rgba(236,72,153,0.2)]'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="text-3xl sm:text-4xl mb-2 block drop-shadow-[0_0_30px_rgba(255,100,180,0.6)]">🎨</span>
          <h2 className="text-base sm:text-lg font-bold text-pink-400 mb-1">{t('home.merchandise')}</h2>
          <p className={`text-xs mb-2 leading-relaxed line-clamp-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('home.merchandiseDescription')}
          </p>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                          bg-gradient-to-r from-pink-400 to-rose-500 text-white
                          group-hover:scale-105 transition-transform">
            {t('home.browseMerch')}
          </span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className={`mt-8 sm:mt-12 md:mt-16 text-center text-xs sm:text-sm relative z-10 ${
        theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
      }`}>
        <p>
          PolarCraft
        </p>
      </footer>
    </div>
  )
}
