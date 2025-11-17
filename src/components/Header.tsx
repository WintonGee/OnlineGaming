'use client';

import Link from 'next/link';
import { Grid3x3, Coffee } from 'lucide-react';
import { useEffect } from 'react';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  useEffect(() => {
    // Load Buy Me a Coffee script
    const script = document.createElement('script');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'wintongee');
    script.setAttribute('data-color', '#000000');
    script.setAttribute('data-emoji', '☕');
    script.setAttribute('data-font', 'Arial');
    script.setAttribute('data-text', 'Buy me a coffee');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#ffffff');
    script.setAttribute('data-coffee-color', '#ffffff');
    script.async = true;

    const container = document.getElementById('bmc-container');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container && script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <header className="border-b border-gray-300 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-70 transition-opacity">
            <Grid3x3 className="h-6 w-6 text-black dark:text-white" />
            <span className="text-xl font-serif font-bold text-black dark:text-white tracking-tight">
              Puzzles
            </span>
          </Link>

          {/* Navigation and Buy Me a Coffee */}
          <div className="flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/games/sudoku"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                Sudoku
              </Link>
            </nav>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Buy Me a Coffee */}
            <div id="bmc-container" className="flex items-center"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
