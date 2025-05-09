// src/components/theme/ThemeToggleButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
// You'll need icons. Example using simple text, replace with SVG icons.
// For example, react-icons: npm install react-icons
// import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // or from react-icons

export default function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or nothing on the server to avoid hydration mismatch
    return <div className="w-10 h-10"></div>; // Placeholder to maintain layout space
  }

  const toggleTheme = () => {
    // If system is current, and resolved is dark, next should be light.
    // If system is current, and resolved is light, next should be dark.
    // Otherwise, toggle between light and dark directly.
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      onClick={toggleTheme}
    >
      {/* Replace with actual SVG icons */}
      {resolvedTheme === 'dark' ? (
        // <SunIcon className="h-6 w-6 text-yellow-400" />
        <span className="text-yellow-400">☀️</span>
      ) : (
        // <MoonIcon className="h-6 w-6 text-gray-600" />
        <span className="text-gray-600">🌙</span>
      )}
    </button>
  );
}