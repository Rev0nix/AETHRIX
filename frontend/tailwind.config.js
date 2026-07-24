/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // Existing storefront components use the accent palette. Keep it while
        // also exposing the newer brand tokens below.
        accent: {
          DEFAULT: '#3b82f6',
          dim: '#1d4ed8',
          glow: '#60a5fa',
        },
        brand: {
          gold: '#D4AF37',
          black: '#0B0B0B',
          white: '#FFFFFF',
          gray: '#6B7280',

          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
        },

        base: {
          black: '#05070d',
          900: '#0a0e1a',
          800: '#0f1424',
          700: '#161c30',
          600: '#222b46',
        },
      },

      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        price: ['Montserrat', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },

      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },

      boxShadow: {
        glow: '0 0 40px rgba(59,130,246,0.25)',
        card: '0 8px 30px rgba(0,0,0,.08)',
        hover: '0 12px 40px rgba(0,0,0,.12)',
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
