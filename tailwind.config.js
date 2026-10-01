/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDFBF7',
          100: '#F7F3EB',
          200: '#EDE4D6',
          300: '#DDCFBD',
          400: '#C7B49B',
          500: '#B0977B',
          600: '#947B60',
          700: '#755F49',
          800: '#584635',
          900: '#3D3025',
          950: '#231A13',
        },
        ivory: {
          DEFAULT: '#FAF7F2',
          light: '#FFFDF9',
          warm: '#F4EFEB',
          dark: '#EAE3D9',
        },
        gold: {
          light: '#EAD7A8',
          DEFAULT: '#C5A059',
          satin: '#B88E3A',
          dark: '#9E7A32',
          rose: '#DCA58C',
          glow: 'rgba(197, 160, 89, 0.18)',
        },
        charcoal: {
          light: '#6E5D53',
          DEFAULT: '#3D312A',
          dark: '#2C2119',
        },
        nude: {
          50: '#FAF6F0',
          100: '#F4ECE1',
          200: '#E8DBC9',
          300: '#D8C3AA',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        brand: ['"Cinzel"', '"Italiana"', '"Cormorant Garamond"', 'serif'],
        stylish: ['"Italiana"', '"Cinzel"', 'serif'],
      },
      boxShadow: {
        'luxury': '0 10px 35px -5px rgba(28, 25, 23, 0.05), 0 0 0 1px rgba(28, 25, 23, 0.03)',
        'luxury-hover': '0 20px 45px -10px rgba(28, 25, 23, 0.10), 0 0 0 1px rgba(212, 175, 55, 0.25)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.2)',
        'gold-glow-lg': '0 0 40px rgba(212, 175, 55, 0.35)',
        'dropdown': '0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        }
      }
    },
  },
  plugins: [],
}
