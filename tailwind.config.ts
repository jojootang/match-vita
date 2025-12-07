// tailwind.config.ts - อัปเดต
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF6A',
        secondary: '#6BC12F',
        accent: {
          blue: '#6FBFF3',
          green: '#A2DD57',
          yellow: '#FFD166',
          red: '#FF6B6B',
        },
        background: '#FAFAFA',
        text: {
          dark: '#1A1A1A',
          soft: '#6B6B6B',
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;