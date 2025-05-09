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
          dark: '#111111', // CHANGED HERE - Vercel-like deep black/dark gray
          },
          surface: { // Surface for cards, modals etc.
            light: '#F7F7F8',
            dark: '#1E1E1E', // CHANGED HERE - Making this the previous background color, or keep #2A2A2A. Let's try #1E1E1E for slightly less contrast between bg and surface first.
                            // If you want more separation like Vercel, #2A2A2A is also good.
          },
          primary: {
            DEFAULT: '#64FFDA',
          },
          secondary: {
            DEFAULT: '#A259FF',
          },
          content: { // For main text content
            light: '#111111',
            dark: '#E0E0E0', // This should still provide good contrast on #111111
          },
          subtle: { // For less prominent text
            light: '#444444',
            dark: '#A0A0A0', // This should also be fine
          }
        },
      },
    },
    plugins: [],
  };

  export default config;  