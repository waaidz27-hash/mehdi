/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#0a0e1a',
          800: '#0f1525',
          700: '#1a2236',
          600: '#243049',
          500: '#334155',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
