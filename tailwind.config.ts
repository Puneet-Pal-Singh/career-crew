// src/tailwind.config.ts
import tailwindcssAnimate from 'tailwindcss-animate';
import tailwindcssTypography from '@tailwindcss/typography';

const config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'var(--font-geist-sans)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
        display: [
          'var(--font-geist-sans)',
          'var(--font-inter)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ]
      },
      colors: {
        // RESTORED ORIGINAL LIGHT MODE COLORS
        'background-light': '#F9FAFB',
        'surface-light': '#FFFFFF',
        'content-light': '#1A2B42',
        'subtle-light': '#5A6B82',
        primary: {
          DEFAULT: 'hsl(var(--primary))', // #2A6FFF
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))', // #FF8C2A
          foreground: 'hsl(var(--secondary-foreground))'
        },
        accent1: '#2AE8FF',
        warning: '#FBBF24',
        success: '#34D399',
        danger: '#F87171',
        'border-light': '#E5E7EB',
        
        // NEW DARK MODE COLORS - Linear/Vercel inspired
        'background-dark': '#0A0A0A',        // Pure black for sidebar
        'surface-dark': '#151515',           // Dark grey for main content
        'content-dark': '#FAFAFA',
        'subtle-dark': '#A1A1AA',
        'primary-dark': '#2A6FFF',           // Keep original blue primary in dark mode
        'secondary-dark': '#FFA75A',         // Keep original secondary-dark orange
        'accent1-dark': '#5AF0FF',
        'warning-dark': '#FCD34D',
        'success-dark': '#68D391',
        'danger-dark': '#FC8181',
        'border-dark': '#262626',
        
        // Opacity variants
        'secondary-light-op12': 'rgba(255, 140, 42, 0.12)',
        'secondary-light-op06': 'rgba(255, 140, 42, 0.06)',
        'secondary-dark-op12': 'rgba(255, 167, 90, 0.12)',
        'secondary-dark-op06': 'rgba(255, 167, 90, 0.06)',
        
        // Theme-aware colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(to bottom, hsl(var(--background)), hsl(var(--muted) / 0.2))',
      },
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      
      boxShadow: {
        'elegant': '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'elegant-lg': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
      },
    }
  },
  plugins: [
    tailwindcssAnimate, 
    tailwindcssTypography,
  ],
};

export default config;