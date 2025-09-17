// src/components/theme/ThemeToggleButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react"; // We can keep icons inside the toggle
import { motion, AnimatePresence } from "framer-motion";

interface ThemeToggleButtonProps {
  className?: string;
  // iconColorClass is less relevant for this style, but kept for potential future use
  iconColorClass?: string; 
}

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 35,
} as const;

export default function ThemeToggleButton({
  className = "",
}: ThemeToggleButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder to maintain layout space and prevent layout shift
    return <div className={`w-[52px] h-7 rounded-full ${className}`} />;
  }

  const isCurrentlyDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isCurrentlyDark ? "light" : "dark");
  };

  return (
    <button
      aria-label={isCurrentlyDark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
      onClick={toggleTheme}
      // Main container for the toggle switch
      className={`relative flex items-center w-[52px] h-7 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  ${isCurrentlyDark ? "bg-primary-dark" : "bg-primary/80"} 
                  ${className}`}
    >
      {/* Inner circle (the switch handle) */}
      <motion.div
        className="absolute h-[22px] w-[22px] rounded-full bg-white shadow-md flex items-center justify-center"
        layout // Animate layout changes
        transition={spring} // Use spring animation for a nice feel
        style={{ 
          left: isCurrentlyDark ? "calc(100% - 22px - 4px)" : "4px", // 4px is padding on each side
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isCurrentlyDark ? (
            <motion.div
              key="moon-icon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <Moon size={14} className="text-primary-dark" />
            </motion.div>
          ) : (
            <motion.div
              key="sun-icon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <Sun size={14} className="text-yellow-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}