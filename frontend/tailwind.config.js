/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          black: '#05070d',
          900: '#0a0e1a',
          800: '#0f1424',
          700: '#161c30',
          600: '#222b46',
        },
        accent: {
          DEFAULT: '#3b82f6',
          dim: '#1d4ed8',
          glow: '#60a5fa',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(59,130,246,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        floatY: 'floatY 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
