import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { ModuleIconMap, type ModuleIconKey } from '@/components/icons'

// Polarization angle colors for visual effect (based on polarization physics)
const POLARIZATION_COLORS = [
  'rgba(255, 68, 68, 0.15)',   // 0° - Red
  'rgba(255, 170, 0, 0.15)',   // 45° - Orange
  'rgba(68, 255, 68, 0.15)',   // 90° - Green
  'rgba(68, 68, 255, 0.15)',   // 135° - Blue
]

// Solid polarization colors for glow effects
const POLARIZATION_GLOW_COLORS = [
  'rgba(255, 68, 68, 0.6)',    // 0° - Red
  'rgba(255, 170, 0, 0.6)',    // 45° - Orange
  'rgba(68, 255, 68, 0.6)',    // 90° - Green
  'rgba(68, 136, 255, 0.6)',   // 135° - Blue
]

// Module configuration for the 10 creative hubs
interface ModuleConfig {
  key: string
  icon: string
  colorTheme: {
    border: string
    borderHover: string
    shadow: string
    text: string
    gradientFrom: string
    gradientTo: string
    buttonText: string
  }
  mainRoute: string
  quickLinks: Array<{
    labelKey: string
    route: string
  }>
  comingSoon?: boolean // Mark module as coming soon
}

const MODULES: ModuleConfig[] = [
  {
    // 光的编年史：偏振发现之旅 (Chronicles of Light: Polarization Discovery Journey)
    key: 'chronicles',
    icon: '⏳', // Hourglass - represents history and time
    colorTheme: {
      border: 'amber-warm', // Warm Amber #C9A227 (parchment/historical feel)
      borderHover: 'amber-warm',
      shadow: 'rgba(201,162,39,0.25)',
      text: 'amber-warm',
      gradientFrom: 'amber-warm',
      gradientTo: 'amber-700',
      buttonText: 'black',
    },
    mainRoute: '/chronicles',
    quickLinks: [
      { labelKey: 'link1', route: '/chronicles?event=1808' }, // Malus discovery
      { labelKey: 'link2', route: '/demos?demo=malus-law' }, // Direct to Malus law demo
      { labelKey: 'link3', route: '/chronicles?track=polarization' },
    ],
  },
  {
    // 光学设计室：偏振器件 × 光路设计 (Optical Design Studio: Device Library × Light Path Design)
    // Merged module combining deviceLibrary + opticalBench
    key: 'opticalDesignStudio',
    icon: '⬡', // Hexagon - represents optical components
    colorTheme: {
      border: 'indigo-soft', // Indigo #6366F1
      borderHover: 'indigo-soft',
      shadow: 'rgba(99,102,241,0.25)',
      text: 'indigo-soft',
      gradientFrom: 'indigo-soft',
      gradientTo: 'indigo-700',
      buttonText: 'white',
    },
    mainRoute: '/optical-studio',
    quickLinks: [
      { labelKey: 'link1', route: '/optical-studio?tab=devices' }, // Device library
      { labelKey: 'link2', route: '/optical-studio?tab=experiments' }, // Classic experiments
      { labelKey: 'link3', route: '/optical-studio?tab=design' }, // Free design mode
    ],
  },
  {
    // 偏振演示馆：原理可视化 (Polarization Demo Gallery: Principle Visualization)
    key: 'formulaLab',
    icon: '◐', // Half-filled circle - represents polarizer
    colorTheme: {
      border: 'cyan-deep', // Deep Cyan #0891B2
      borderHover: 'cyan-deep',
      shadow: 'rgba(8,145,178,0.25)',
      text: 'cyan-deep',
      gradientFrom: 'cyan-deep',
      gradientTo: 'cyan-700',
      buttonText: 'white',
    },
    mainRoute: '/demos',
    quickLinks: [
      { labelKey: 'link1', route: '/demos?demo=malus-law' },
      { labelKey: 'link2', route: '/demos?demo=birefringence' },
      { labelKey: 'link3', route: '/demos?demo=stokes-vector' },
    ],
  },
  {
    // 偏振探秘：光之密室 (PolarQuest: The Light Chamber)
    key: 'polarquest',
    icon: '⬢', // Hexagon - represents game/puzzle block
    colorTheme: {
      border: 'orange-warm', // Warm Orange #F59E0B (distinct from amber)
      borderHover: 'orange-warm',
      shadow: 'rgba(245,158,11,0.25)',
      text: 'orange-warm',
      gradientFrom: 'orange-warm',
      gradientTo: 'amber-600',
      buttonText: 'black',
    },
    mainRoute: '/games',
    quickLinks: [
      { labelKey: 'link1', route: '/game2d?level=0' },
      { labelKey: 'link2', route: '/game?level=0' },
      { labelKey: 'link3', route: '/games?mode=challenge' },
    ],
  },
  {
    // 偏振造物局：艺术与DIY (Polarization Workshop: Art & DIY) - MERGED: gallery + experiments + photography
    key: 'creativeLab',
    icon: '✧', // Sparkle - represents art and creativity
    colorTheme: {
      border: 'pink-vivid', // Vivid Pink #EC4899 (more distinct from coral)
      borderHover: 'pink-vivid',
      shadow: 'rgba(236,72,153,0.25)',
      text: 'pink-vivid',
      gradientFrom: 'pink-vivid',
      gradientTo: 'rose-600',
      buttonText: 'white',
    },
    mainRoute: '/creative',
    quickLinks: [
      { labelKey: 'link1', route: '/creative?tab=gallery' }, // Art gallery
      { labelKey: 'link2', route: '/creative?tab=photography' }, // Polarization photography
      { labelKey: 'link3', route: '/creative?tab=diy' }, // DIY experiments
      { labelKey: 'link4', route: '/creative?tab=products' }, // Creative products
    ],
  },
  {
    // 虚拟课题组：光研社 (Virtual Lab Group: Light Research Guild) - Merged with Applications & Calculations
    key: 'labGroup',
    icon: '⚗', // Alembic - represents research/lab
    colorTheme: {
      border: 'emerald-bright', // Bright Emerald #10B981 (more vivid green)
      borderHover: 'emerald-bright',
      shadow: 'rgba(16,185,129,0.25)',
      text: 'emerald-bright',
      gradientFrom: 'emerald-bright',
      gradientTo: 'emerald-600',
      buttonText: 'black',
    },
    mainRoute: '/lab',
    quickLinks: [
      { labelKey: 'link1', route: '/lab?tab=tasks' }, // Research tasks
      { labelKey: 'link2', route: '/lab?tab=applications' }, // Merged: Applications
      { labelKey: 'link3', route: '/lab?tab=calculators' }, // Merged: Calculations
      { labelKey: 'link4', route: '/lab?tab=community' }, // Community forum
    ],
  },
  // 开放数据 (Open Data) - Hidden temporarily
]

// Color mapping for Tailwind classes - using distinct, visually-friendly colors
// 9 distinct colors spread across the spectrum for maximum differentiation
const getColorClasses = (module: ModuleConfig, theme: 'dark' | 'light') => {
  const colorMap: Record<string, { dark: string; light: string; shadow: string }> = {
    // 1. Warm Amber #C9A227 - Chronicles of Light (historical parchment feel)
    'amber-warm': {
      dark: 'border-[#C9A227]/30 hover:border-[#C9A227]/60',
      light: 'border-[#C9A227]/40 hover:border-[#C9A227]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(201,162,39,0.25)]',
    },
    // 2. Sapphire Blue #4169E1 - Device Library (crystal/prism blue)
    'sapphire-soft': {
      dark: 'border-[#4169E1]/30 hover:border-[#4169E1]/60',
      light: 'border-[#4169E1]/40 hover:border-[#4169E1]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(65,105,225,0.25)]',
    },
    // 2b. Indigo #6366F1 - Optical Bench (light path design)
    'indigo-soft': {
      dark: 'border-[#6366F1]/30 hover:border-[#6366F1]/60',
      light: 'border-[#6366F1]/40 hover:border-[#6366F1]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(99,102,241,0.25)]',
    },
    // 3. Deep Cyan #0891B2 - Demo Gallery (scientific/technical)
    'cyan-deep': {
      dark: 'border-[#0891B2]/30 hover:border-[#0891B2]/60',
      light: 'border-[#0891B2]/40 hover:border-[#0891B2]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(8,145,178,0.25)]',
    },
    // 4. Warm Orange #F59E0B - PolarQuest (gaming orange, distinct from amber)
    'orange-warm': {
      dark: 'border-[#F59E0B]/30 hover:border-[#F59E0B]/60',
      light: 'border-[#F59E0B]/40 hover:border-[#F59E0B]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(245,158,11,0.25)]',
    },
    // 5. Vivid Pink #EC4899 - Creative Lab/偏振造物局 (distinct from red)
    'pink-vivid': {
      dark: 'border-[#EC4899]/30 hover:border-[#EC4899]/60',
      light: 'border-[#EC4899]/40 hover:border-[#EC4899]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(236,72,153,0.25)]',
    },
    // 6. Bright Emerald #10B981 - Lab Group (vivid green)
    'emerald-bright': {
      dark: 'border-[#10B981]/30 hover:border-[#10B981]/60',
      light: 'border-[#10B981]/40 hover:border-[#10B981]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(16,185,129,0.25)]',
    },
    // 7. Vivid Red #EF4444 - Applications (bright red, distinct from pink)
    'red-vivid': {
      dark: 'border-[#EF4444]/30 hover:border-[#EF4444]/60',
      light: 'border-[#EF4444]/40 hover:border-[#EF4444]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(239,68,68,0.25)]',
    },
    // 8. Soft Violet #8B5CF6 - Simulation Lab (purple)
    'violet-soft': {
      dark: 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60',
      light: 'border-[#8B5CF6]/40 hover:border-[#8B5CF6]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(139,92,246,0.25)]',
    },
    // 9. Cool Slate #64748B - Open Data (neutral gray-blue)
    'slate-cool': {
      dark: 'border-[#64748B]/30 hover:border-[#64748B]/60',
      light: 'border-[#64748B]/40 hover:border-[#64748B]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(100,116,139,0.25)]',
    },
  }

  const color = colorMap[module.colorTheme.border]
  return {
    border: theme === 'dark' ? color.dark : color.light,
    shadow: theme === 'dark' ? color.shadow : color.shadow.replace('0.25', '0.2'),
  }
}

const getTextColorClass = (color: string, theme: 'dark' | 'light') => {
  // Distinct color text classes matching the new palette
  const textMap: Record<string, { dark: string; light: string }> = {
    'amber-warm': { dark: 'text-[#C9A227]', light: 'text-[#A68620]' },
    'sapphire-soft': { dark: 'text-[#4169E1]', light: 'text-[#3558C4]' },
    'indigo-soft': { dark: 'text-[#6366F1]', light: 'text-[#4F46E5]' },
    'cyan-deep': { dark: 'text-[#0891B2]', light: 'text-[#067B96]' },
    'orange-warm': { dark: 'text-[#F59E0B]', light: 'text-[#D97706]' },
    'pink-vivid': { dark: 'text-[#EC4899]', light: 'text-[#DB2777]' },
    'emerald-bright': { dark: 'text-[#10B981]', light: 'text-[#059669]' },
    'red-vivid': { dark: 'text-[#EF4444]', light: 'text-[#DC2626]' },
    'violet-soft': { dark: 'text-[#8B5CF6]', light: 'text-[#7C3AED]' },
    'slate-cool': { dark: 'text-[#64748B]', light: 'text-[#475569]' },
  }
  return theme === 'dark' ? textMap[color].dark : textMap[color].light
}

const getGradientClass = (from: string, to: string) => {
  // Distinct gradient classes matching the new palette
  const gradientMap: Record<string, string> = {
    'amber-warm-amber-700': 'from-[#C9A227] to-[#92650F]',
    'sapphire-soft-blue-700': 'from-[#4169E1] to-[#1D4ED8]',
    'indigo-soft-indigo-700': 'from-[#6366F1] to-[#4338CA]',
    'cyan-deep-cyan-700': 'from-[#0891B2] to-[#0E7490]',
    'orange-warm-amber-600': 'from-[#F59E0B] to-[#D97706]',
    'pink-vivid-rose-600': 'from-[#EC4899] to-[#DB2777]',
    'emerald-bright-emerald-600': 'from-[#10B981] to-[#059669]',
    'red-vivid-red-600': 'from-[#EF4444] to-[#DC2626]',
    'violet-soft-violet-600': 'from-[#8B5CF6] to-[#7C3AED]',
    'slate-cool-slate-600': 'from-[#64748B] to-[#475569]',
  }
  return gradientMap[`${from}-${to}`] || 'from-gray-400 to-gray-500'
}

const getGlowClass = (from: string) => {
  // Glow effects matching the new distinct color palette
  const glowMap: Record<string, string> = {
    'amber-warm': 'drop-shadow-[0_0_20px_rgba(201,162,39,0.4)]',
    'sapphire-soft': 'drop-shadow-[0_0_20px_rgba(65,105,225,0.4)]',
    'indigo-soft': 'drop-shadow-[0_0_20px_rgba(99,102,241,0.4)]',
    'cyan-deep': 'drop-shadow-[0_0_20px_rgba(8,145,178,0.4)]',
    'orange-warm': 'drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    'pink-vivid': 'drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]',
    'emerald-bright': 'drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    'red-vivid': 'drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    'violet-soft': 'drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]',
    'slate-cool': 'drop-shadow-[0_0_20px_rgba(100,116,139,0.4)]',
  }
  return glowMap[from] || ''
}

function ModuleCard({ module, index }: { module: ModuleConfig; index: number }) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [polarAngle, setPolarAngle] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const animationRef = useRef<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const colorClasses = getColorClasses(module, theme)
  const textColorClass = getTextColorClass(module.colorTheme.text, theme)
  const gradientClass = getGradientClass(module.colorTheme.gradientFrom, module.colorTheme.gradientTo)
  const glowClass = getGlowClass(module.colorTheme.gradientFrom)

  // Track mouse position for dynamic polarization effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setMousePos({ x, y })
    }
  }

  // Animate polarization angle on hover - simulates rotating polarizer
  useEffect(() => {
    if (isHovered) {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        // Slow rotation: 360° in 6 seconds for smoother effect
        const angle = (elapsed / 6000) * 360 % 360
        setPolarAngle(angle)
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      // Reset to initial angle based on module index
      setPolarAngle(index * 40 % 180)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered, index])

  // Calculate Malus's Law intensity: I = I₀ × cos²(θ)
  // This creates the "polarizer rotation" effect where brightness varies
  const malusIntensity = Math.pow(Math.cos((polarAngle * Math.PI) / 180), 2)

  // Get current polarization color based on angle quadrant (smooth transition)
  const colorIndex = Math.floor((polarAngle / 45) % 4)
  const nextColorIndex = (colorIndex + 1) % 4
  const polarizationColor = POLARIZATION_COLORS[colorIndex]
  const polarizationGlowColor = POLARIZATION_GLOW_COLORS[colorIndex]
  const nextPolarizationColor = POLARIZATION_COLORS[nextColorIndex]

  // Calculate overlay opacity based on Malus's Law (inverted for visibility effect)
  const overlayOpacity = isHovered ? 0.25 + 0.35 * (1 - malusIntensity) : 0

  // Calculate icon rotation: icon rotates same as polarization angle (simulating analyzer)
  const iconRotation = isHovered ? polarAngle * 0.5 : 0

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-2xl p-4 sm:p-5 text-center
                 transition-all duration-400 hover:-translate-y-2 hover:scale-[1.02] ${
        theme === 'dark'
          ? `bg-slate-900/80 border-2 ${colorClasses.border} ${colorClasses.shadow}`
          : `bg-white/90 border-2 ${colorClasses.border} ${colorClasses.shadow}`
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        // Add subtle brightness variation based on Malus's Law
        filter: isHovered ? `brightness(${0.92 + 0.16 * malusIntensity})` : 'none',
      }}
    >
      {/* Polarization gradient overlay - simulates viewing through rotating polarizer */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: isHovered
            ? `conic-gradient(from ${polarAngle}deg at ${mousePos.x * 100}% ${mousePos.y * 100}%,
                ${polarizationColor} 0deg,
                ${nextPolarizationColor} 90deg,
                ${polarizationColor} 180deg,
                ${nextPolarizationColor} 270deg,
                ${polarizationColor} 360deg)`
            : 'none',
          opacity: overlayOpacity,
        }}
      />

      {/* Polarization wave pattern overlay - simulates light wave oscillation */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        style={{
          opacity: isHovered ? 0.12 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              ${polarAngle}deg,
              transparent,
              transparent 3px,
              ${polarizationGlowColor} 3px,
              ${polarizationGlowColor} 4px
            )`,
            transform: `translateX(${Math.sin(polarAngle * Math.PI / 180) * 10}px)`,
          }}
        />
      </div>

      {/* Cross-polarization effect - perpendicular lines for interference pattern */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        style={{
          opacity: isHovered ? 0.05 * (1 - malusIntensity) : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              ${polarAngle + 90}deg,
              transparent,
              transparent 6px,
              ${theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'} 6px,
              ${theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'} 7px
            )`,
          }}
        />
      </div>

      {/* Polarization glow ring - appears at extinction positions */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: isHovered
            ? `inset 0 0 ${20 + 15 * malusIntensity}px ${polarizationGlowColor.replace('0.6', String(0.2 * malusIntensity))}`
            : 'none',
          transition: 'box-shadow 0.1s ease',
        }}
      />

      {/* Icon with synchronized rotation effect */}
      <div className="mb-2 flex justify-center relative z-10">
        {(() => {
          const IconComponent = ModuleIconMap[module.key as ModuleIconKey]
          if (IconComponent) {
            return (
              <div
                className="relative"
                style={{
                  transform: isHovered ? `rotate(${iconRotation}deg) scale(1.1)` : 'none',
                  transition: isHovered ? 'transform 0.05s linear' : 'transform 0.3s ease',
                }}
              >
                <IconComponent
                  size={48}
                  className={`transition-none ${glowClass}`}
                />
                {/* Polarization indicator ring around icon */}
                {isHovered && (
                  <div
                    className="absolute -inset-2 rounded-full border-2 pointer-events-none"
                    style={{
                      borderColor: polarizationGlowColor.replace('0.6', '0.4'),
                      borderStyle: 'dashed',
                      animation: 'spin 4s linear infinite',
                    }}
                  />
                )}
              </div>
            )
          }
          return (
            <span
              className={`text-3xl sm:text-4xl ${glowClass}`}
              style={{
                transform: isHovered ? `rotate(${iconRotation}deg) scale(1.1)` : 'none',
                transition: isHovered ? 'transform 0.05s linear' : 'transform 0.3s ease',
                display: 'inline-block',
              }}
            >
              {module.icon}
            </span>
          )
        })()}
      </div>

      {/* Title */}
      <h2 className={`text-base sm:text-lg font-bold ${textColorClass} mb-0.5 relative z-10`}>
        {t(`home.${module.key}.title`)}
      </h2>

      {/* Subtitle */}
      <p className={`text-xs font-medium mb-1.5 relative z-10 ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
      }`}>
        {t(`home.${module.key}.subtitle`)}
      </p>

      {/* Description */}
      <p className={`text-xs mb-3 leading-relaxed line-clamp-2 relative z-10 text-left ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {t(`home.${module.key}.description`)}
      </p>

      {/* Quick Links - only show if not coming soon */}
      {!module.comingSoon && module.quickLinks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mb-3 relative z-10">
          {module.quickLinks.map((link, linkIndex) => (
            <Link
              key={linkIndex}
              to={link.route}
              className={`text-[10px] px-2 py-0.5 rounded-full transition-all
                         hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {t(`home.${module.key}.${link.labelKey}`)}
            </Link>
          ))}
        </div>
      )}

      {/* Coming Soon badge or Main CTA Button */}
      {module.comingSoon ? (
        <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider relative z-10 mt-3
                       ${theme === 'dark' ? 'bg-slate-700/50 text-slate-400' : 'bg-slate-200/80 text-slate-500'}`}>
          {t('common.comingSoon')}
        </div>
      ) : (
        <Link
          to={module.mainRoute}
          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider relative z-10
                     bg-gradient-to-r ${gradientClass} text-${module.colorTheme.buttonText}
                     transition-transform ${isHovered ? 'scale-105' : ''}`}
        >
          {t(`home.${module.key}.cta`)}
        </Link>
      )}

      {/* Polarization angle indicator (subtle, only on hover) */}
      {isHovered && (
        <div
          className={`absolute top-2 right-2 text-[8px] px-1.5 py-0.5 rounded-full z-20 ${
            theme === 'dark' ? 'bg-slate-800/80 text-cyan-400' : 'bg-white/80 text-cyan-600'
          }`}
          style={{ fontFamily: 'monospace' }}
        >
          {Math.round(polarAngle)}°
        </div>
      )}
    </div>
  )
}

// Animated polarization background component
function PolarizationBackground({ theme }: { theme: 'dark' | 'light' }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Primary rotating polarization gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? `conic-gradient(from ${time}deg at 50% 50%,
                rgba(255, 68, 68, 0.03) 0deg,
                rgba(255, 170, 0, 0.03) 90deg,
                rgba(68, 255, 68, 0.03) 180deg,
                rgba(68, 136, 255, 0.03) 270deg,
                rgba(255, 68, 68, 0.03) 360deg)`
            : `conic-gradient(from ${time}deg at 50% 50%,
                rgba(255, 68, 68, 0.02) 0deg,
                rgba(255, 170, 0, 0.02) 90deg,
                rgba(68, 255, 68, 0.02) 180deg,
                rgba(68, 136, 255, 0.02) 270deg,
                rgba(255, 68, 68, 0.02) 360deg)`,
        }}
      />

      {/* Secondary counter-rotating gradient for interference effect */}
      <div
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? `conic-gradient(from ${360 - time}deg at 30% 70%,
                rgba(68, 136, 255, 0.02) 0deg,
                rgba(68, 255, 68, 0.02) 90deg,
                rgba(255, 170, 0, 0.02) 180deg,
                rgba(255, 68, 68, 0.02) 270deg,
                rgba(68, 136, 255, 0.02) 360deg)`
            : `conic-gradient(from ${360 - time}deg at 30% 70%,
                rgba(68, 136, 255, 0.015) 0deg,
                rgba(68, 255, 68, 0.015) 90deg,
                rgba(255, 170, 0, 0.015) 180deg,
                rgba(255, 68, 68, 0.015) 270deg,
                rgba(68, 136, 255, 0.015) 360deg)`,
        }}
      />

      {/* Animated polarization wave lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity: 0.15 }}>
        <defs>
          <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme === 'dark' ? '#ff4444' : '#ff6666'} stopOpacity="0.3" />
            <stop offset="50%" stopColor={theme === 'dark' ? '#44ff44' : '#66ff66'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={theme === 'dark' ? '#4488ff' : '#6699ff'} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Horizontal wave lines simulating E-field */}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((yPos, i) => {
          const y = yPos * 100
          const yOffset = Math.sin((time + i * 30) * Math.PI / 180) * 3
          return (
            <path
              key={`h-${i}`}
              d={`M 0 ${y} Q 25 ${y + yOffset}, 50 ${y} T 100 ${y}`}
              fill="none"
              stroke="url(#wave-grad-1)"
              strokeWidth="0.5"
              style={{
                transform: `translateX(${Math.sin((time + i * 60) * Math.PI / 180) * 2}%)`,
              }}
            />
          )
        })}
        {/* Vertical wave lines simulating B-field (perpendicular) */}
        {[0.15, 0.4, 0.6, 0.85].map((xPos, i) => {
          const x = xPos * 100
          const xOffset = Math.cos((time + i * 45) * Math.PI / 180) * 2
          return (
            <path
              key={`v-${i}`}
              d={`M ${x} 0 Q ${x + xOffset} 50, ${x} 100`}
              fill="none"
              stroke={theme === 'dark' ? 'rgba(100, 200, 255, 0.15)' : 'rgba(50, 150, 200, 0.1)'}
              strokeWidth="0.5"
              style={{
                transform: `translateY(${Math.cos((time + i * 45) * Math.PI / 180) * 1.5}%)`,
              }}
            />
          )
        })}
      </svg>

      {/* Light beam decorations with polarization colors */}
      {[
        { left: 10, color: 'rgba(255, 68, 68, 0.2)', delay: 0 },
        { left: 30, color: 'rgba(255, 170, 0, 0.2)', delay: 1.5 },
        { left: 70, color: 'rgba(68, 255, 68, 0.2)', delay: 3 },
        { left: 90, color: 'rgba(68, 136, 255, 0.2)', delay: 4.5 },
      ].map((beam, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-screen animate-beam-move"
          style={{
            left: `${beam.left}%`,
            background: `linear-gradient(to bottom, transparent 0%, ${beam.color} 50%, transparent 100%)`,
            animationDelay: `${beam.delay}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Floating polarization particles */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full animate-float"
          style={{
            width: `${4 + i * 2}px`,
            height: `${4 + i * 2}px`,
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            background: POLARIZATION_GLOW_COLORS[i % 4].replace('0.6', '0.3'),
            filter: 'blur(2px)',
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
    </div>
  )
}

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

      {/* Animated polarization background */}
      <PolarizationBackground theme={theme} />

      {/* Header */}
      <header className="text-center mb-6 sm:mb-10 md:mb-12 relative z-10 px-2">
        {/* Logo temporarily removed */}
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
        <p className={`text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mx-auto ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {t('home.description')}
        </p>
      </header>

      {/* Navigation Cards - 9 Creative Modules with polarization effects */}
      <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl relative z-10 w-full px-2">
        {MODULES.map((module, index) => (
          <ModuleCard key={module.key} module={module} index={index} />
        ))}
      </nav>

      {/* Footer */}
      <footer className={`mt-6 sm:mt-10 md:mt-12 text-center text-xs sm:text-sm relative z-10 ${
        theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
      }`}>
        <p>
          PolarCraft support by Open Wisdom Lab
        </p>
      </footer>
    </div>
  )
}
