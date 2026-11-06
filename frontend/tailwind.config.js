/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        atelier: {
          50: '#FAF9F5',
          100: '#F5F2EB',
          200: '#E8E1D3',
          300: '#D5C7B5',
          400: '#BAA58E',
          500: '#9E856B',
          600: '#7E6852',
          700: '#5E4C3B',
          800: '#3D3126',
          900: '#1C1611',
          950: '#0E0B08',
        },
        noir: {
          DEFAULT: '#141416',
          dark: '#0B0B0C',
          card: '#1C1C20',
          border: '#2A2A30',
          subtle: '#3F3F46',
        },
        warm: {
          paper: '#FAF9F5',
          surface: '#F4F2EC',
          border: '#E7E4DC',
          line: '#D8D4C8',
        }
      },
      boxShadow: {
        'atelier': '0 20px 40px -15px rgba(20, 20, 22, 0.07)',
        'atelier-hover': '0 30px 60px -12px rgba(20, 20, 22, 0.15)',
        'pill': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
