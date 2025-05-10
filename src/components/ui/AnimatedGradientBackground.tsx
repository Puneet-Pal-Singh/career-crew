// src/components/ui/AnimatedGradientBackground.tsx
'use client'; // May not be needed if pure CSS, but good for potential future JS interaction

import React from 'react';

interface AnimatedGradientBackgroundProps {
  className?: string;
  children?: React.ReactNode; // To wrap content if needed
  type?: 'aurora' | 'beam'; // For different animation styles
}

export default function AnimatedGradientBackground({
  className = '',
  children,
  type = 'aurora'
}: AnimatedGradientBackgroundProps) {
  // Using your theme colors in CSS variables for the gradients
  // These will be defined inline or in globals.css for the animation
  // Primary: var(--color-primary) -> #2A6FFF
  // Secondary: var(--color-secondary) -> #FF8C2A
  // Accent1: var(--color-accent1) -> #2AE8FF

  // --color-primary-dark: #5A9FFF
  // --color-secondary-dark: #FFA75A
  // --color-accent1-dark: #5AF0FF

  const baseClasses = "absolute inset-0 overflow-hidden -z-10"; // -z-10 to be behind content

  // For the "aurora" type, we'll use multiple radial gradients that move and morph
  // For the "beam" type, it might be a more focused, sweeping light effect

  // This will be heavily CSS-driven. The component provides a container.
  return (
    <div className={`${baseClasses} ${className} animated-${type}-bg`}>
      {/* The actual animated elements will be ::before/::after or child divs styled in CSS */}
      <style jsx global>{`
        /* Define CSS variables for colors from Tailwind theme if not already global */
        :root {
          --color-primary-val: 2A6FFF; /* Hex without # for some CSS uses */
          --color-secondary-val: FF8C2A;
          --color-accent1-val: 2AE8FF;
          --color-primary-dark-val: 5A9FFF;
          --color-secondary-dark-val: FFA75A;
          --color-accent1-dark-val: 5AF0FF;
        }
        
        .animated-aurora-bg::before,
        .animated-aurora-bg::after {
          content: "";
          position: absolute;
          filter: blur(80px) opacity(0.3); /* Heavy blur and low opacity for subtlety */
          transform-origin: center;
          border-radius: 50%;
        }

        html:not(.dark) .animated-aurora-bg::before {
          background-image: radial-gradient(circle, #${'var(--color-primary-val)'} 0%, transparent 60%);
          width: 600px;
          height: 600px;
          top: -150px;
          left: -150px;
          animation: auroraMove1 25s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite alternate;
        }
        html:not(.dark) .animated-aurora-bg::after {
          background-image: radial-gradient(circle, #${'var(--color-accent1-val)'} 0%, transparent 60%);
          width: 500px;
          height: 500px;
          bottom: -100px;
          right: -100px;
          animation: auroraMove2 30s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite alternate;
        }

        html.dark .animated-aurora-bg::before {
          background-image: radial-gradient(circle, #${'var(--color-primary-dark-val)'} 0%, transparent 60%);
          filter: blur(100px) opacity(0.25); /* Slightly different for dark */
          width: 700px;
          height: 700px;
          top: -200px;
          left: -200px;
          animation: auroraMove1 28s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite alternate;
        }
        html.dark .animated-aurora-bg::after {
          background-image: radial-gradient(circle, #${'var(--color-accent1-dark-val)'} 0%, transparent 60%);
          filter: blur(100px) opacity(0.25);
          width: 600px;
          height: 600px;
          bottom: -150px;
          right: -150px;
          animation: auroraMove2 33s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite alternate;
        }
        
        /* A third element for more complexity, using secondary color */
        .aurora-element-3 {
          position: absolute;
          filter: blur(90px) opacity(0.2);
          border-radius: 50%;
          width: 450px;
          height: 450px;
          top: 30%;
          left: 40%;
          animation: auroraMove3 35s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite alternate;
        }
        html:not(.dark) .aurora-element-3 {
          background-image: radial-gradient(circle, #${'var(--color-secondary-val)'} 0%, transparent 70%);
        }
        html.dark .aurora-element-3 {
          background-image: radial-gradient(circle, #${'var(--color-secondary-dark-val)'} 0%, transparent 70%);
           filter: blur(110px) opacity(0.2);
        }


        @keyframes auroraMove1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(100px, 50px) scale(1.2); }
          100% { transform: translate(-50px, -100px) scale(0.9); }
        }
        @keyframes auroraMove2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-80px, -60px) scale(1.1); }
          100% { transform: translate(40px, 120px) scale(1); }
        }
        @keyframes auroraMove3 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(50px, -50px) scale(1.1) rotate(20deg); }
          100% { transform: translate(-30px, 30px) scale(0.95) rotate(-10deg); }
        }
      `}</style>
      {/* This is for the aurora effect with pseudo-elements */}
      <div className="aurora-element-3"></div>
      {children}
    </div>
  );
}