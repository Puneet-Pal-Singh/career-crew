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
            dark: '#1E1E1E',
          },
          surface: {
            light: '#F7F7F8',
            dark: '#2A2A2A',
          },
          primary: {
            DEFAULT: '#64FFDA', // Your primary accent
            // You can add shades if needed: e.g., light, dark
          },
          secondary: {
            DEFAULT: '#A259FF', // Your secondary accent
          },
          content: { // For main text content
            light: '#111111',
            dark: '#E0E0E0',
          },
          subtle: { // For less prominent text
              light: '#444444',
              dark: '#A0A0A0',
          }
        },
      },
    },
    plugins: [],
  };

  export default config;  