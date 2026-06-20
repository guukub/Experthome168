/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sarabun: ['Sarabun', 'sans-serif'],
        thai: ['Sarabun', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        forest: {
          50:  '#f6faf6',
          100: '#e8f4e8',
          200: '#cce5cc',
          300: '#a0cfa0',
          400: '#6db36d',
          500: '#4a9a4a',
          600: '#2d6a4f',
          700: '#1e5438',
          800: '#163d29',
          900: '#0f2a1c',
        },
        gold: {
          50:  '#fdfbf0',
          100: '#faf3d0',
          200: '#f4e4a0',
          300: '#eccf68',
          400: '#e2b840',
          500: '#d4a017',
          600: '#b8880f',
          700: '#926b0c',
          800: '#6e500d',
          900: '#4a360e',
        },
        warm: {
          50:  '#fdfdf8',
          100: '#faf8ee',
          200: '#f3f0d8',
          300: '#e8e3bc',
          400: '#d9d29a',
          500: '#c4bc74',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
