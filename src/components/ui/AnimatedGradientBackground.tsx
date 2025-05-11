// src/components/ui/AnimatedGradientBackground.tsx
'use client';

import React from 'react';

interface AnimatedGradientBackgroundProps {
  className?: string;
  /** 
   * When true, the component attempts to fill the entire viewport.
   * Useful for top-level backgrounds like the Hero section.
   * When false (default), it's absolute to its parent.
   */
  isHeroBackground?: boolean;
}

export default function AnimatedGradientBackground({
  className = '',
  isHeroBackground = false, // Default to false, set true for Hero
}: AnimatedGradientBackgroundProps) {
  
  // Base classes for the main div that holds the ::before, ::after, and .aurora-element-3-item
  // If it's for the hero, we ensure it's fixed and covers the viewport.
  // Otherwise, it's absolute to its parent section.
  const containerClasses = isHeroBackground
    ? "fixed inset-0 w-screen h-screen overflow-hidden -z-10" // Covers viewport
    : "absolute inset-0 overflow-hidden -z-10"; // Covers parent

  const colorStyles = `
    :root { 
      --cc-color-primary-val: ${'#2A6FFF'};
      --cc-color-secondary-val: ${'#FF8C2A'};
      --cc-color-accent1-val: ${'#2AE8FF'};
      --cc-color-primary-dark-val: ${'#5A9FFF'};
      --cc-color-secondary-dark-val: ${'#FFA75A'};
      --cc-color-accent1-dark-val: ${'#5AF0FF'};
    }
  `;

  return (
    // This div is the one that gets 'fixed' or 'absolute'
    <div className={`${containerClasses} ${className}`}>
      <style jsx global>{`
        ${colorStyles}

        /* These pseudo-elements and class are on the div above */
        /* Their parent (the div with containerClasses) is what ensures full coverage */
        .${className}::before, /* Target based on passed className */
        .${className}::after,
        .${className} .aurora-element-3-item { /* Target child based on parent's className */
          content: "";
          position: absolute;
          border-radius: 50%;
          will-change: transform, opacity, background-image;
          /* Orbs will be very large, positioned relative to the full screen/section div */
          /* Make radial gradient extend very far before becoming transparent */
          filter: blur(80px) opacity(0.6); /* Fine-tune blur and opacity */
        }

        /* Light Mode - Ensure orbs are massive */
        html:not(.dark) .${className}::before {
          background-image: radial-gradient(circle, var(--cc-color-primary-val) 0%, transparent 75%); /* Color extends far */
          width: 200vw; /* Use vw/vh for extreme aspect ratios */
          height: 200vh;
          top: 50%;    
          left: 50%;
          transform: translate(-100vw, -120vh); /* Offset by half their size to ensure edge coverage */
          animation: auroraMoveL1 30s ease-in-out infinite alternate;
        }
        html:not(.dark) .${className}::after {
          background-image: radial-gradient(circle, var(--cc-color-accent1-val) 0%, transparent 75%);
          width: 180vw; 
          height: 180vh;
          top: 50%; 
          left: 50%;
          transform: translate(30vw, 40vh);
          animation: auroraMoveL2 35s ease-in-out infinite alternate .7s;
        }
        html:not(.dark) .${className} .aurora-element-3-item {
          background-image: radial-gradient(circle, var(--cc-color-secondary-val) 0%, transparent 75%);
          width: 160vw; 
          height: 160vh;
          top: 50%; 
          left: 50%;   
          transform: translate(-40vw, -30vh);
          animation: auroraMoveL3 40s ease-in-out infinite alternate 1.2s;
        }

        /* Dark Mode */
        html.dark .${className}::before,
        html.dark .${className}::after,
        html.dark .${className} .aurora-element-3-item {
            filter: blur(90px) opacity(0.55);
        }
        html.dark .${className}::before {
          background-image: radial-gradient(circle, var(--cc-color-primary-dark-val) 0%, transparent 75%);
          width: 210vw; height: 210vh; top: 50%; left: 50%; transform: translate(-110vw, -110vh);
          animation: auroraMoveD1 32s ease-in-out infinite alternate;
        }
        html.dark .${className}::after {
          background-image: radial-gradient(circle, var(--cc-color-accent1-dark-val) 0%, transparent 75%);
          width: 190vw; height: 190vh; top: 50%; left: 50%; transform: translate(35vw, 35vh);
          animation: auroraMoveD2 37s ease-in-out infinite alternate .7s;
        }
        html.dark .${className} .aurora-element-3-item {
          background-image: radial-gradient(circle, var(--cc-color-secondary-dark-val) 0%, transparent 75%);
          width: 170vw; height: 170vh; top: 50%; left: 50%; transform: translate(-30vw, -40vh);
          animation: auroraMoveD3 42s ease-in-out infinite alternate 1.2s;
        }
        
        /* Keyframes for Light Mode */
        @keyframes auroraMoveL1 {
          0%   { transform: translate(-100vw, -120vh) scale(1); opacity: 0.55; }
          50%  { transform: translate(60vw, 50vh) scale(1.2); opacity: 0.75; } 
          100% { transform: translate(-90vw, -110vh) scale(0.9); opacity: 0.6; }
        }
        @keyframes auroraMoveL2 { /* Similar adjustments */ }
        @keyframes auroraMoveL3 { /* Similar adjustments */ }

        /* Keyframes for Dark Mode */
        @keyframes auroraMoveD1 { /* Similar adjustments */ }
        @keyframes auroraMoveD2 { /* Similar adjustments */ }
        @keyframes auroraMoveD3 { /* Similar adjustments */ }

        /* Placeholder for other keyframes - ensure all 6 are defined or copy L1 structure */
        @keyframes auroraMoveL2 { 0% {transform: translate(30vw, 40vh) scale(1);opacity: .5;} 50% {transform: translate(-60vw, -50vh) scale(1.2);opacity: .7;} 100% {transform: translate(20vw, 30vh) scale(.9);opacity: .55;} }
        @keyframes auroraMoveL3 { 0% {transform: translate(-40vw, -30vh) scale(1) rotate(0deg);opacity: .45;} 50% {transform: translate(50vw, 40vh) scale(1.1) rotate(10deg);opacity: .65;} 100% {transform: translate(-50vw, -40vh) scale(.95) rotate(-5deg);opacity: .5;} }
        @keyframes auroraMoveD1 { 0% {transform: translate(-110vw, -110vh) scale(1);opacity: .5;} 50% {transform: translate(50vw, 60vh) scale(1.2);opacity: .7;} 100% {transform: translate(-100vw, -100vh) scale(.9);opacity: .55;} }
        @keyframes auroraMoveD2 { 0% {transform: translate(35vw, 35vh) scale(1);opacity: .45;} 50% {transform: translate(-50vw, -60vh) scale(1.2);opacity: .65;} 100% {transform: translate(25vw, 25vh) scale(.95);opacity: .5;} }
        @keyframes auroraMoveD3 { 0% {transform: translate(-30vw, -40vh) scale(1) rotate(0deg);opacity: .4;} 50% {transform: translate(40vw, 50vh) scale(1.1) rotate(-10deg);opacity: .6;} 100% {transform: translate(-40vw, -50vh) scale(.95) rotate(5deg);opacity: .45;} }

      `}</style>
      {/* This div must exist for the .aurora-element-3-item styles to apply */}
      <div className="aurora-element-3-item"></div>
    </div>
  );
}