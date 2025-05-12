// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'background-light': '#F9FAFB',
        'surface-light': '#FFFFFF',
        'content-light': '#1A2B42',
        'subtle-light': '#5A6B82',
        'primary': '#2A6FFF',
        'secondary': '#FF8C2A', // RGB: 255, 140, 42
        'accent1': '#2AE8FF',
        'warning': '#FBBF24',
        'success': '#34D399',
        'danger': '#F87171',
        'border-light': '#E5E7EB',

        'background-dark': '#1A202C',
        'surface-dark': '#2D3748',
        'content-dark': '#E2E8F0',
        'subtle-dark': '#A0AEC0',
        'primary-dark': '#5A9FFF',
        'secondary-dark': '#FFA75A', // RGB: 255, 167, 90
        'accent1-dark': '#5AF0FF',
        'warning-dark': '#FCD34D',
        'success-dark': '#68D391',
        'danger-dark': '#FC8181',
        'border-dark': '#4A5568',

        // NEW: Explicit semi-transparent orange colors for the gradient
        'secondary-light-op12': 'rgba(255, 140, 42, 0.12)', // secondary with 12% opacity
        'secondary-light-op06': 'rgba(255, 140, 42, 0.06)', // secondary with 6% opacity
        'secondary-dark-op12': 'rgba(255, 167, 90, 0.12)', // secondary-dark with 12% opacity
        'secondary-dark-op06': 'rgba(255, 167, 90, 0.06)', // secondary-dark with 6% opacity
      },
      backgroundImage: {
        // You can keep this empty if you are not defining named complex gradients here
      }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
  ],
};

export default config;