// src/components/theme/ThemeToggleButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
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
    return <div className={`w-20 h-10 rounded-full ${className}`} />;
  }

  const isCurrentlyDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isCurrentlyDark ? "light" : "dark");
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={toggleTheme}
        aria-label={`Switch to ${isCurrentlyDark ? "light" : "dark"} mode`}
        className="relative h-10 px-4 rounded-full border-2 border-border hover:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm hover:bg-background/80 shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-between w-full gap-2">
          {/* Light Mode Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTheme("light");
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
              !isCurrentlyDark
                ? "bg-primary text-primary-foreground shadow-md scale-110"
                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Switch to light mode"
          >
            <Sun size={16} />
          </button>

          {/* Dark Mode Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTheme("dark");
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
              isCurrentlyDark
                ? "bg-primary text-primary-foreground shadow-md scale-110"
                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Switch to dark mode"
          >
            <Moon size={16} />
          </button>
        </div>
      </Button>

      {/* Active indicator dot */}
      <motion.div
        className="absolute top-1 w-2 h-2 bg-primary rounded-full"
        animate={{
          left: isCurrentlyDark ? "calc(100% - 10px)" : "2px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
}