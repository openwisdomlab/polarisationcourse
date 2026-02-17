/** @type {import('tailwindcss').Config} */

// 这是 Tailwind CSS 配置文件
// 它定义了项目中使用的样式和主题扩展
// 有关配置选项的详细信息，请参阅 https://tailwindcss.com/docs/configuration

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // --- PolarCraft Semantic Palette ---
        // Primary Brand / Laser Color
        laser: {
          DEFAULT: '#22d3ee',      // Primary beam color (matches tailwind cyan-400)
          active: '#00f0ff',       // High energy state
          dim: 'rgba(34,211,238,0.15)', // Subtle backgrounds
          glow: 'rgba(34,211,238,0.5)', // Glow effects
        },
        // Secondary / UI Accents
        void: {
          DEFAULT: '#050510',      // Deep space background
          panel: 'rgba(10, 10, 25, 0.8)', // HUD panels
          border: 'rgba(100, 200, 255, 0.1)', // Subtle borders
        },
        // Physics Semantics (Polarization States)
        polarization: {
          0: '#ff4444',    // 0°
          45: '#ffaa00',   // 45°
          90: '#44ff44',   // 90°
          135: '#4444ff',  // 135°
        },
        // Legacy/Compatibility (Mapped to new system where possible)
        tech: {
          cyan: {
            DEFAULT: '#00f0ff',
            dim: 'rgba(0, 240, 255, 0.1)',
            glow: 'rgba(0, 240, 255, 0.5)',
          },
          violet: {
            DEFAULT: '#7000ff',
            dim: 'rgba(112, 0, 255, 0.1)',
            glow: 'rgba(112, 0, 255, 0.5)',
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Typography Scale for High-Density UI
      fontSize: {
        'micro': ['10px', { lineHeight: '14px' }],
        'caption': ['11px', { lineHeight: '16px' }],
        'data': ['12px', { lineHeight: '16px', fontFamily: 'monospace' }],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
        'fade-in-up': 'fadeInUp 0.3s ease',
        'beam-move': 'beamMove 8s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        beamMove: {
          '0%, 100%': { opacity: '0.3', transform: 'scaleY(0.8)' },
          '50%': { opacity: '0.8', transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
