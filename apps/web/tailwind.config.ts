import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans]
      },
      colors: {
        background: '#05060a',
        surface: '#0d0f17',
        accent: '#7e5dff',
        accentMuted: '#4525c7'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
