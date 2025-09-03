// tailwind.config.ts
import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import tailwindcssTypography from '@tailwindcss/typography';

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
  			'background-light': '#F9FAFB',
  			'surface-light': '#FFFFFF',
  			'content-light': '#1A2B42',
  			'subtle-light': '#5A6B82',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent1: '#2AE8FF',
  			warning: '#FBBF24',
  			success: '#34D399',
  			danger: '#F87171',
  			'border-light': '#E5E7EB',
  			'background-dark': '#1A202C',
  			'surface-dark': '#2D3748',
  			'content-dark': '#E2E8F0',
  			'subtle-dark': '#A0AEC0',
  			'primary-dark': '#5A9FFF',
  			'secondary-dark': '#FFA75A',
  			'accent1-dark': '#5AF0FF',
  			'warning-dark': '#FCD34D',
  			'success-dark': '#68D391',
  			'danger-dark': '#FC8181',
  			'border-dark': '#4A5568',
  			'secondary-light-op12': 'rgba(255, 140, 42, 0.12)',
  			'secondary-light-op06': 'rgba(255, 140, 42, 0.06)',
  			'secondary-dark-op12': 'rgba(255, 167, 90, 0.12)',
  			'secondary-dark-op06': 'rgba(255, 167, 90, 0.06)',
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
  		backgroundImage: {},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
};

export default config;
