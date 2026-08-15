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
        // Fuel planner — same steel blue as the workout tracker, so the two
        // read as one app once they are merged. 600 is the tracker's #7ba4c4.
        steel: {
          50:  '#f5f8fb',
          100: '#e9f0f6',
          200: '#d5e3ed',
          300: '#b3cfe1',
          400: '#97bcd4',
          500: '#8aafca',
          600: '#7ba4c4',
          700: '#6b8fae',
          800: '#5a7a96',
          900: '#47617a',
        },
      },
      // One family, matching the workout tracker's system stack — no webfont.
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
