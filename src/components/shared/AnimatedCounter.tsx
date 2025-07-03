// src/components/shared/AnimatedCounter.tsx
"use client";

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
}

export default function AnimatedCounter({ value }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  
  // useSpring adds a nice "bouncy" effect to the animation
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 400,
  });

  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    // This transforms the springValue to a rounded integer and updates the display
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US').format(
          Math.round(latest)
        );
      }
    });
    return () => unsubscribe();
  }, [springValue]);

  return <span ref={ref} />;
}