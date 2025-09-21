// src/components/theme/ThemeToggleButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ThemeToggleButtonProps {
  className?: string;
  iconColorClass?: string;
}

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
    return <div className={`w-10 h-10 ${className}`} />;
  }

  const isCurrentlyDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isCurrentlyDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={isCurrentlyDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative h-10 w-10 rounded-full p-0 hover:bg-muted transition-all duration-200 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCurrentlyDark ? (
          <motion.div
            key="moon-icon"
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={18} className="text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="sun-icon"
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={18} className="text-yellow-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}