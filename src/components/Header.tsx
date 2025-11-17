"use client";

import Link from "next/link";
import { Grid3x3 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="border-b border-gray-300 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-70 transition-opacity"
          >
            <Grid3x3 className="h-6 w-6 text-black dark:text-white" />
            <span className="text-xl font-serif font-bold text-black dark:text-white tracking-tight">
              Home
            </span>
          </Link>

          {/* Buy Me a Coffee and Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Buy Me a Coffee */}
            <a
              href="https://www.buymeacoffee.com/wintongee"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
            >
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                style={{ height: "40px", width: "auto" }}
              />
            </a>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
