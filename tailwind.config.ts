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
        // Light Mode Palette
        'background-light': '#F9FAFB',
        'surface-light': '#FFFFFF',
        'content-light': '#1A2B42',
        'subtle-light': '#5A6B82',
        'primary': '#2A6FFF', // Main primary
        'secondary': '#FF8C2A',
        'accent1': '#2AE8FF',
        'success': '#34D399',
        'warning': '#FBBF24',
        'danger': '#F87171',
        'border-light': '#E5E7EB', // For subtle borders in light mode

        // Dark Mode Palette
        'background-dark': '#1A202C',
        'surface-dark': '#2D3748',
        'content-dark': '#E2E8F0',
        'subtle-dark': '#A0AEC0',
        'primary-dark': '#5A9FFF', // Primary for dark mode
        'secondary-dark': '#FFA75A',
        'accent1-dark': '#5AF0FF',
        'success-dark': '#68D391',
        'warning-dark': '#FCD34D',
        'danger-dark': '#FC8181',
        'border-dark': '#4A5568', // For subtle borders in dark mode
      },
      // Example for gradients (can be defined as utilities or directly)
      backgroundImage: {
        'gradient-primary-secondary': 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
        'gradient-accent-flow': 'linear-gradient(to right, var(--color-primary), var(--color-accent1), var(--color-secondary))',
        // Dark mode versions
        'gradient-primary-secondary-dark': 'linear-gradient(to right, var(--color-primary-dark), var(--color-secondary-dark))',
        'gradient-accent-flow-dark': 'linear-gradient(to right, var(--color-primary-dark), var(--color-accent1-dark), var(--color-secondary-dark))',
      }
    },
  },
  plugins: [
    // You might consider adding require('@tailwindcss/forms') if not already for better form styling
  ],
};

export default config;