// src/components/landing/StatItem.tsx
'use client'; 

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatItemProps {
  icon: LucideIcon;
  count: number;
  label: string;
  plusSign?: boolean;
  suffix?: string;
  numberAndLabelColorClass?: string; // Color for the number and label text
  iconColorClass?: string;           // Color for the icon itself
}

export default function StatItem({ 
  icon: Icon, 
  count, 
  label, 
  plusSign = false, 
  suffix = '',
  numberAndLabelColorClass = "text-content-light dark:text-content-dark", // Default to standard content color
  iconColorClass = "text-primary dark:text-primary-dark" // Default icon color (can be overridden)
}: StatItemProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
    mass: 1
  });
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(count);
    }
  }, [motionValue, isInView, count]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString() + (plusSign ? '+' : '') + suffix;
      }
    });
    return unsubscribe;
  }, [springValue, plusSign, suffix]);

  return (
    <div className="flex flex-col items-center text-center p-3 md:p-4">
      {/* Icon Container: Background remains semi-transparent white for pop on gradient */}
      <div 
        className={`p-3.5 mb-3 sm:mb-4 rounded-full inline-flex shadow-md
                    bg-white/20 dark:bg-white/15 backdrop-blur-sm`} // Slightly more opaque white bg for icon
      >
        <Icon 
          size={28} 
          strokeWidth={2} 
          className={`${iconColorClass}`} // Icon uses its own color prop
        />
      </div>
      {/* Number: Uses numberAndLabelColorClass */}
      <motion.span 
        ref={ref} 
        className={`font-display text-4xl sm:text-5xl font-bold ${numberAndLabelColorClass} mb-1.5 leading-none`}
      >
        0 
      </motion.span>
      {/* Label: Uses numberAndLabelColorClass */}
      <p 
        className={`text-xs sm:text-sm ${numberAndLabelColorClass} opacity-80 uppercase tracking-wider font-semibold`}
      >
        {label}
      </p>
    </div>
  );
}