
import {
  scopedPreflightStyles,
  isolateInsideOfContainer,
} from 'tailwindcss-scoped-preflight';

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
   plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer('.petercat-lui'),
    }),
  ],
}

