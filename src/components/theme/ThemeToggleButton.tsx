// src/components/theme/ThemeToggleButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";


interface ThemeToggleButtonProps {
  className?: string;
  iconColorClass?: string;
}

export default function ThemeToggleButton({
  className = "",
}: ThemeToggleButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder to maintain layout space and prevent layout shift
    return <div className={`w-24 h-8 rounded-full ${className}`} />;
  }

  const getActiveSection = () => {
    if (theme === "system" || (theme !== "light" && theme !== "dark" && resolvedTheme === "dark")) {
      return "system";
    }
    if (theme === "light" || resolvedTheme === "light") {
      return "light";
    }
    return "dark";
  };

  const activeSection = getActiveSection();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative h-8 rounded-full border border-border/40 bg-background/30 backdrop-blur-sm">
        <div className="flex items-center justify-between h-full px-1">
          {/* System Theme Button */}
          <button
            type="button"
            onClick={() => handleThemeChange("system")}
            className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
              activeSection === "system"
                ? "text-foreground"
                : "text-muted-foreground/60 hover:text-muted-foreground"
            }`}
            aria-label="Switch to system theme"
          >
            <Monitor size={14} />
          </button>

          {/* Light Mode Button */}
          <button
            type="button"
            onClick={() => handleThemeChange("light")}
            className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
              activeSection === "light"
                ? "text-foreground"
                : "text-muted-foreground/60 hover:text-muted-foreground"
            }`}
            aria-label="Switch to light mode"
          >
            <Sun size={14} />
          </button>

          {/* Dark Mode Button */}
          <button
            type="button"
            onClick={() => handleThemeChange("dark")}
            className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
              activeSection === "dark"
                ? "text-foreground"
                : "text-muted-foreground/60 hover:text-muted-foreground"
            }`}
            aria-label="Switch to dark mode"
          >
            <Moon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
