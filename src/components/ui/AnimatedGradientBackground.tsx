// src/components/ui/AnimatedGradientBackground.tsx
'use client';

import React from 'react';

interface AnimatedGradientBackgroundProps {
  className?: string;
}

export default function AnimatedGradientBackground({
  className = '',
}: AnimatedGradientBackgroundProps) {
  const baseClasses = "absolute inset-0 overflow-hidden -z-10";

  // Ensure these CSS variables are defined, e.g., in a global style sheet or a parent component.
  // They should correspond to your Tailwind theme colors.
  // For this component to be self-contained with its styles,
  // we define them here. Make sure these hex values match your tailwind.config.ts.
  const colorStyles = `
    :root { /* Or a more specific parent selector if not using :root */
      --cc-color-primary-val: ${'#2A6FFF'}; /* From your primary color */
      --cc-color-secondary-val: ${'#FF8C2A'}; /* From your secondary color */
      --cc-color-accent1-val: ${'#2AE8FF'}; /* From your accent1 color */
      
      --cc-color-primary-dark-val: ${'#5A9FFF'}; /* From your primary-dark color */
      --cc-color-secondary-dark-val: ${'#FFA75A'}; /* From your secondary-dark color */
      --cc-color-accent1-dark-val: ${'#5AF0FF'}; /* From your accent1-dark color */
    }
  `;

  return (
    <div className={`${baseClasses} ${className}`}>
      <style jsx global>{`
        ${colorStyles}

        .animated-aurora-bg::before,
        .animated-aurora-bg::after,
        .aurora-element-3-item {
          content: "";
          position: absolute;
          border-radius: 50%;
          will-change: transform, opacity, background-image;
          /* VIBRANCY CHANGES: Reduced blur, increased base opacity */
          filter: blur(60px) opacity(0.6); /* Original: blur(80px) opacity(0.45) */
        }

        /* Light Mode - More vibrant */
        html:not(.dark) .animated-aurora-bg::before {
          background-image: radial-gradient(circle, var(--cc-color-primary-val) 0%, transparent 65%); /* Color extends further */
          width: 160vmin; 
          height: 160vmin;
          top: -60vmin;    
          left: -60vmin;
          animation: auroraMove1 22s ease-in-out infinite alternate;
        }
        html:not(.dark) .animated-aurora-bg::after {
          background-image: radial-gradient(circle, var(--cc-color-accent1-val) 0%, transparent 65%);
          width: 140vmin; 
          height: 140vmin;
          bottom: -50vmin; 
          right: -50vmin;
          animation: auroraMove2 27s ease-in-out infinite alternate .7s;
        }
        html:not(.dark) .aurora-element-3-item {
          background-image: radial-gradient(circle, var(--cc-color-secondary-val) 0%, transparent 65%);
          width: 120vmin; 
          height: 120vmin;
          top: 50%; 
          left: 50%;   
          transform: translate(-50%, -50%); 
          animation: auroraMove3 32s ease-in-out infinite alternate 1.2s;
        }

        /* Dark Mode - Also more vibrant, slightly different params if needed */
        html.dark .animated-aurora-bg::before,
        html.dark .animated-aurora-bg::after,
        html.dark .aurora-element-3-item {
            /* VIBRANCY CHANGES for dark: Reduced blur, increased opacity */
            filter: blur(70px) opacity(0.55); /* Original: blur(100px) opacity(0.35) */
        }
        html.dark .animated-aurora-bg::before {
          background-image: radial-gradient(circle, var(--cc-color-primary-dark-val) 0%, transparent 65%);
          width: 170vmin;
          height: 170vmin;
          top: -65vmin;
          left: -65vmin;
          animation: auroraMove1 25s ease-in-out infinite alternate;
        }
        html.dark .animated-aurora-bg::after {
          background-image: radial-gradient(circle, var(--cc-color-accent1-dark-val) 0%, transparent 65%);
          width: 150vmin;
          height: 150vmin;
          bottom: -55vmin;
          right: -55vmin;
          animation: auroraMove2 30s ease-in-out infinite alternate .7s;
        }
        html.dark .aurora-element-3-item {
          background-image: radial-gradient(circle, var(--cc-color-secondary-dark-val) 0%, transparent 65%);
          width: 130vmin;
          height: 130vmin;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: auroraMove3 35s ease-in-out infinite alternate 1.2s;
        }
        
        /* Keyframes - Opacity during animation also contributes to vibrancy */
        @keyframes auroraMove1 {
          0%   { transform: translate(-15vmin, -15vmin) scale(1); opacity: 0.5; } /* Increased base opacity in animation */
          50%  { transform: translate(40vmin, 30vmin) scale(1.3); opacity: 0.75; } /* Increased mid opacity */
          100% { transform: translate(-10vmin, -20vmin) scale(0.9); opacity: 0.55; }
        }
        @keyframes auroraMove2 {
          0%   { transform: translate(15vmin, 15vmin) scale(1); opacity: 0.45; }
          50%  { transform: translate(-35vmin, -25vmin) scale(1.2); opacity: 0.7; }
          100% { transform: translate(10vmin, 20vmin) scale(0.95); opacity: 0.5; }
        }
        @keyframes auroraMove3 {
          0%   { transform: translate(-50%, -50%) translate(0, 0) scale(1) rotate(0deg); opacity: 0.5; }
          50%  { transform: translate(-50%, -50%) translate(20vmin, -15vmin) scale(1.15) rotate(10deg); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) translate(-15vmin, 10vmin) scale(0.9) rotate(-10deg); opacity: 0.5; }
        }
      `}</style>
      {/* This third element is crucial for the three-color blend */}
      <div className="aurora-element-3-item"></div>
    </div>
  );
}