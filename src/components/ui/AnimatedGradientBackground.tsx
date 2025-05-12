// src/components/ui/AnimatedGradientBackground.tsx
'use client';
import React from 'react';

interface AnimatedGradientBackgroundProps {
  className?: string;
  isHeroBackground?: boolean; // To control fixed vs absolute positioning
}

export default function AnimatedGradientBackground({
  className = '',
  isHeroBackground = false,
}: AnimatedGradientBackgroundProps) {
  
  const containerClasses = isHeroBackground
    ? "fixed inset-0 w-screen h-screen overflow-hidden -z-10"
    : "absolute inset-0 overflow-hidden -z-10";

  // Define colors directly here
  const primaryLight = '#2A6FFF';
  const secondaryLight = '#FF8C2A';
  const accent1Light = '#2AE8FF';
  const primaryDark = '#5A9FFF';
  const secondaryDark = '#FFA75A';
  const accent1Dark = '#5AF0FF';

  return (
    <div className={`${containerClasses} ${className}`}>
      <style jsx global>{`
        .${className} > div { /* Target direct children divs (the orbs) */
          content: "";
          position: absolute;
          border-radius: 50%;
          will-change: transform, opacity, background-image;
          width: 250vmax; /* Keep them very large */
          height: 250vmax;
          /* VIBRANCY ADJUSTMENT: Increased base opacity, ensure blur isn't excessive */
          filter: blur(80px) opacity(0.65); /* Base opacity higher */
        }

        /* Light Mode Orbs - More saturated gradient stops */
        html:not(.dark) .${className} .orb1 {
          /* Color is solid for longer (e.g., 30%) before starting to fade (to transparent at 70%) */
          background-image: radial-gradient(circle, ${primaryLight} 30%, transparent 70%);
          top: -80vmax; left: -90vmax;
          animation: moveOrbL1 30s ease-in-out infinite alternate;
        }
        html:not(.dark) .${className} .orb2 {
          background-image: radial-gradient(circle, ${accent1Light} 30%, transparent 70%);
          bottom: -100vmax; right: -110vmax;
          animation: moveOrbL2 35s ease-in-out infinite alternate 0.7s;
        }
        html:not(.dark) .${className} .orb3 {
          background-image: radial-gradient(circle, ${secondaryLight} 30%, transparent 70%);
          top: -40vmax; right: -120vmax; 
          animation: moveOrbL3 40s ease-in-out infinite alternate 1.2s;
        }

        /* Dark Mode Orbs - Similarly adjusted for vibrancy */
        html.dark .${className} > div {
            filter: blur(90px) opacity(0.6); /* Slightly different params for dark if needed */
        }
        html.dark .${className} .orb1 {
          background-image: radial-gradient(circle, ${primaryDark} 30%, transparent 70%);
          animation-name: moveOrbD1;
        }
        html.dark .${className} .orb2 {
          background-image: radial-gradient(circle, ${accent1Dark} 30%, transparent 70%);
          animation-name: moveOrbD2;
        }
        html.dark .${className} .orb3 {
          background-image: radial-gradient(circle, ${secondaryDark} 30%, transparent 70%);
          animation-name: moveOrbD3;
        }
        
        /* Animations - Ensure opacity values in keyframes don't dip too low */
        /* Light Mode Keyframes */
        @keyframes moveOrbL1 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.6; } /* Maintain decent opacity */
          50%  { transform: translate(80vmax, 70vmax) scale(1.25); opacity: 0.8; } /* Higher peak opacity */
          100% { transform: translate(10vmax, 20vmax) scale(0.9); opacity: 0.65; } /* Maintain decent opacity */
        }
        @keyframes moveOrbL2 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.55; }
          50%  { transform: translate(-70vmax, -90vmax) scale(1.2); opacity: 0.75; }
          100% { transform: translate(-20vmax, -30vmax) scale(0.95); opacity: 0.6; }
        }
        @keyframes moveOrbL3 {
          0%   { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.6; }
          50%  { transform: translate(-100vmax, 60vmax) scale(1.15) rotate(10deg); opacity: 0.7; }
          100% { transform: translate(-40vmax, 5vmax) scale(0.9); opacity: 0.65; }
        }

        /* Dark Mode Keyframes (can be similar or adjusted) */
        @keyframes moveOrbD1 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.55; }
          50%  { transform: translate(85vmax, 75vmax) scale(1.25); opacity: 0.75; }
          100% { transform: translate(15vmax, 25vmax) scale(0.9); opacity: 0.6; }
        }
        @keyframes moveOrbD2 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50%  { transform: translate(-75vmax, -95vmax) scale(1.2); opacity: 0.7; }
          100% { transform: translate(-25vmax, -35vmax) scale(0.95); opacity: 0.55; }
        }
        @keyframes moveOrbD3 {
          0%   { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.55; }
          50%  { transform: translate(-105vmax, 65vmax) scale(1.15) rotate(-5deg); opacity: 0.65; }
          100% { transform: translate(-45vmax, 0vmax) scale(0.9) rotate(5deg); opacity: 0.6; }
        }
      `}</style>
      <div className="orb1"></div>
      <div className="orb2"></div>
      <div className="orb3"></div>
    </div>
  );
}