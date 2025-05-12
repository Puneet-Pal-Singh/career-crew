// src/components/theme/ThemeToggleButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeToggleButtonProps {
  className?: string;
  iconColorClass?: string; // Prop to control icon color
}

export default function ThemeToggleButton({ className = '', iconColorClass }: ThemeToggleButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null on the server to avoid hydration mismatch
    // as theme is only known on client
    return <div className={`w-9 h-9 rounded-md ${className}`} />; // Placeholder to maintain layout space
  }

  const isCurrentlyDark = resolvedTheme === 'dark';

  // Determine icon color: use prop if provided, otherwise default
  const currentIconColor = iconColorClass 
    ? iconColorClass 
    : 'text-content-light dark:text-content-dark'; // Default if prop not passed

  return (
    <button
      aria-label="Toggle dark mode"
      type="button"
      className={`p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${currentIconColor} ${className}`}
      onClick={() => setTheme(isCurrentlyDark ? 'light' : 'dark')}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCurrentlyDark ? (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}