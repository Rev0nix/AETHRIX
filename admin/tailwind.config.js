/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: { black: '#05070d', 900: '#0a0e1a', 800: '#0f1424', 700: '#161c30' },
        accent: { DEFAULT: '#3b82f6', dim: '#1d4ed8', glow: '#60a5fa' },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
