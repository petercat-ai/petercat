
import {
  scopedPreflightStyles,
  isolateInsideOfContainer,
} from 'tailwindcss-scoped-preflight';

module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'rotate(-6deg)'},
          '50%': { transform: 'rotate(6deg)'},
        },
       
      },
      animation: {
        shake: 'shake 0.2s linear infinite',
      }
    },
  },
   plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer('.petercat-lui'),
    }),
  ],
}
