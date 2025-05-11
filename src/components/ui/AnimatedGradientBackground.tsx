// src/components/ui/AnimatedGradientBackground.tsx
'use client';
import React from 'react';

interface AnimatedGradientBackgroundProps {
  className?: string;
  isHeroBackground?: boolean;
}

export default function AnimatedGradientBackground({
  className = '',
  isHeroBackground = false,
}: AnimatedGradientBackgroundProps) {
  
  const containerClasses = isHeroBackground
    ? "fixed inset-0 w-screen h-screen overflow-hidden -z-10"
    : "absolute inset-0 overflow-hidden -z-10";

  // Define colors directly here to simplify and ensure they are always available
  const primaryLight = '#2A6FFF';
  const secondaryLight = '#FF8C2A';
  const accent1Light = '#2AE8FF';
  const primaryDark = '#5A9FFF';
  const secondaryDark = '#FFA75A';
  const accent1Dark = '#5AF0FF';

  return (
    <div className={`${containerClasses} ${className}`}>
      <style jsx global>{`
        /* 
          The key for extreme aspect ratios is ensuring the orbs are always 
          larger than the LONGEST possible dimension the viewport might stretch to
          AND that their radial gradients extend very far.
        */
        .${className} > div { /* Target direct children divs (the orbs) */
          content: "";
          position: absolute;
          border-radius: 50%;
          will-change: transform, opacity, background-image;
          /* Make orbs incredibly large, min 200% of longest screen edge */
          width: 300vmax; 
          height: 300vmax;
          /* Ensure gradient core is solid for a good portion */
          /* Opacity and blur are critical for appearance */
          filter: blur(100px) opacity(0.5); /* Start with a more visible setup */
        }

        /* Light Mode Orbs */
        html:not(.dark) .${className} .orb1 {
          background-image: radial-gradient(circle, ${primaryLight} 20%, transparent 70%);
          top: -100vmax; left: -100vmax; /* Positioned to cover top-leftish */
          animation: moveOrb1 35s ease-in-out infinite alternate;
        }
        html:not(.dark) .${className} .orb2 {
          background-image: radial-gradient(circle, ${accent1Light} 20%, transparent 70%);
          bottom: -120vmax; right: -130vmax; /* Positioned to cover bottom-rightish */
          animation: moveOrb2 40s ease-in-out infinite alternate 0.7s;
        }
        html:not(.dark) .${className} .orb3 {
          background-image: radial-gradient(circle, ${secondaryLight} 20%, transparent 70%);
          top: -50vmax; right: -150vmax; /* Positioned to cover top-rightish */
          animation: moveOrb3 45s ease-in-out infinite alternate 1.2s;
        }

        /* Dark Mode Orbs */
        html.dark .${className} > div {
            filter: blur(120px) opacity(0.45);
        }
        html.dark .${className} .orb1 {
          background-image: radial-gradient(circle, ${primaryDark} 20%, transparent 70%);
          animation-name: moveOrb1Dark; /* Can use different animation paths if desired */
        }
        html.dark .${className} .orb2 {
          background-image: radial-gradient(circle, ${accent1Dark} 20%, transparent 70%);
           animation-name: moveOrb2Dark;
        }
        html.dark .${className} .orb3 {
          background-image: radial-gradient(circle, ${secondaryDark} 20%, transparent 70%);
           animation-name: moveOrb3Dark;
        }
        
        /* Animations - ensure they move across potential viewport area */
        @keyframes moveOrb1 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50%  { transform: translate(100vmax, 80vmax) scale(1.3); opacity: 0.7; }
          100% { transform: translate(20vmax, 30vmax) scale(0.9); opacity: 0.55; }
        }
        @keyframes moveOrb2 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.45; }
          50%  { transform: translate(-90vmax, -110vmax) scale(1.2); opacity: 0.65; }
          100% { transform: translate(-30vmax, -40vmax) scale(0.95); opacity: 0.5; }
        }
        @keyframes moveOrb3 {
          0%   { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.5; }
          50%  { transform: translate(-120vmax, 70vmax) scale(1.15) rotate(15deg); opacity: 0.6; }
          100% { transform: translate(-50vmax, 10vmax) scale(0.9) rotate(-10deg); opacity: 0.5; }
        }
        /* Dark mode animations can be copies or variations */
        @keyframes moveOrb1Dark { /* ... similar to moveOrb1 ... */ 0% {transform: translate(0,0) scale(1);opacity: .5;} 50% {transform: translate(100vmax,80vmax) scale(1.3);opacity: .7;} 100% {transform: translate(20vmax,30vmax) scale(.9);opacity: .55;} }
        @keyframes moveOrb2Dark { /* ... similar to moveOrb2 ... */ 0% {transform: translate(0,0) scale(1);opacity: .45;} 50% {transform: translate(-90vmax,-110vmax) scale(1.2);opacity: .65;} 100% {transform: translate(-30vmax,-40vmax) scale(.95);opacity: .5;} }
        @keyframes moveOrb3Dark { /* ... similar to moveOrb3 ... */ 0% {transform: translate(0,0) scale(1) rotate(0deg);opacity: .5;} 50% {transform: translate(-120vmax,70vmax) scale(1.15) rotate(15deg);opacity: .6;} 100% {transform: translate(-50vmax,10vmax) scale(.9) rotate(-10deg);opacity: .5;} }

      `}</style>
      {/* Explicitly create three div elements for the orbs */}
      <div className="orb1"></div>
      <div className="orb2"></div>
      <div className="orb3"></div>
    </div>
  );
}