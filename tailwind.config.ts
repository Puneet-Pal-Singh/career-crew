// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class', // Enable class-based dark mode
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
      extend: {
        fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
        // Add your Vercel/Linear inspired color palette here
        // Based on your initial spec:
        // Light bg: #FFFFFF; Dark bg: #1E1E1E.
        // Surfaces: Light #F7F7F8; Dark #2A2A2A.
        // Accent: #64FFDA (primary), #A259FF (secondary).
        // Text: Light mode #111/#444; Dark mode #E0E0E0/#A0A0A0.
        colors: {
          background: {
            light: '#FFFFFF',
            dark: '#0A0A0A', // CHANGED: "Z black" - very dark, near black
          },
          surface: {
            light: '#F7F7F8', // Light mode surface for cards
            dark: '#1C1C1C', // CHANGED: Subtle dark grey for cards on the Z black background
          },
          primary: {
            DEFAULT: '#64FFDA',
          },
          secondary: {
            DEFAULT: '#A259FF',
          },
          content: {
            light: '#111111',
            dark: '#E0E0E0', // Text on dark background
          },
          subtle: {
            light: '#444444',
            dark: '#A0A0A0', // Lighter text on dark background
          },
          // Add a border color for dark mode, often slightly lighter than surface
          borderDark: {
            DEFAULT: '#2D2D2D', // For subtle borders on dark elements
            hover: '#3D3D3D'
          }
        },
      },
    },
    plugins: [],
  };

  export default config;  