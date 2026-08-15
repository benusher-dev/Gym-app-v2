/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './fuel/index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        // Rugby fuel planner — deep maroon
        rdc: {
          50:  '#faf4f5',
          100: '#f3e7ea',
          200: '#e6ccd2',
          300: '#cf9ba7',
          400: '#a85a6c',
          500: '#8a2f45',
          600: '#6e1d2f',
          700: '#5c1826',
          800: '#48121d',
          900: '#2e0b13',
        },
      },
      fontFamily: {
        display: ['Oswald', 'Haettenschweiler', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
