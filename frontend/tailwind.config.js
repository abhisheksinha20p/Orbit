/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      colors: {
        orbit: {
          blue: {
            DEFAULT: '#06b6d4',
            light: '#22d3ee',
            dark: '#0891b2',
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63',
          },
          purple: {
            DEFAULT: '#a855f7',
            light: '#c084fc',
            dark: '#9333ea',
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
          },
          teal: {
            DEFAULT: '#14b8a6',
            light: '#2dd4bf',
            dark: '#0d9488',
          },
          glass: {
            white: 'rgba(255, 255, 255, 0.1)',
            'white-20': 'rgba(255, 255, 255, 0.2)',
            slate: 'rgba(148, 163, 184, 0.4)',
            'slate-20': 'rgba(148, 163, 184, 0.2)',
          }
        },
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        accent: {
          cyan: '#06b6d4',
          purple: '#a855f7',
          teal: '#14b8a6',
          pink: '#ec4899',
        }
      },
      backgroundImage: {
        'gradient-oceanic': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-nebula': 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
        'gradient-primary': 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        'gradient-main': 'linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #ec4899 100%)',
        'gradient-radial': 'radial-gradient(circle at top right, #06b6d4 0%, #a855f7 50%, #ec4899 100%)',
        'gradient-radial-blue': 'radial-gradient(circle at center, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
        'gradient-radial-purple': 'radial-gradient(circle at center, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
        'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.45)',
        'glass-xl': '0 20px 64px 0 rgba(31, 38, 135, 0.55)',
        'neon': '0 0 20px rgba(6, 182, 212, 0.5)',
        'neon-lg': '0 0 30px rgba(6, 182, 212, 0.6)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'neon-teal': '0 0 20px rgba(20, 184, 166, 0.5)',
      },
    },
  },
  plugins: [],
}
