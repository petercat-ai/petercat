import {
  isolateInsideOfContainer,
  scopedPreflightStyles,
} from 'tailwindcss-scoped-preflight';

module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%': {
            transform: 'translate3d(100%, 100%, 0) scale(0.3)',
            opacity: '0',
          },
          '5%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          '6%': { transform: 'rotate(-5deg)', opacity: '1' },
          '6.4%': { transform: 'rotate(5deg)', opacity: '1' },
          '6.8%': { transform: 'rotate(-5deg)', opacity: '1' },
          '7.2%': { transform: 'rotate(5deg)', opacity: '1' },
          '7.4%': { transform: 'rotate(-5deg)', opacity: '1' },
          '7.8%': { transform: 'rotate(5deg)', opacity: '1' },
          '8.2%': { transform: 'rotate(-5deg)', opacity: '1' },
          '8.4%': { transform: 'rotate(5deg)', opacity: '1' },
          '33.33%': {
            transform: 'translate3d(0, 0, 0) scale(1)',
            opacity: '1',
          },
          '40%, 100%': {
            transform: 'translate3d(100%, 100%, 0) scale(0.3)',
            opacity: '0',
          },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-50%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      fontFamily: {
        sf: ['SF Pro'],
      },
      animation: {
        shake: 'shake 15s infinite',
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'fade-in-left': 'fadeInLeft 0.5s ease-out forwards',
      },
      
    },
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer('.petercat-lui'),
    }),
  ],
};
