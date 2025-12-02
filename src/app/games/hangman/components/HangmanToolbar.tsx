"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";
import GameHelpMenu from "@/components/games/GameHelpMenu";

interface HangmanToolbarProps {
  currentCategory: string;
  onCategoryClick: () => void;
  onNewGame: () => void;
  onHowToPlay: () => void;
  onRevealWord?: () => void;
}

export default function HangmanToolbar({
  currentCategory,
  onCategoryClick,
  onNewGame,
  onHowToPlay,
  onRevealWord,
}: HangmanToolbarProps) {
  // Check if multiple categories are selected (comma-separated)
  const isMultipleCategories = currentCategory.includes(", ");

  return (
    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
      {/* Category and New Game Group */}
      <div className="flex items-center gap-2">
        {/* Category Button - Opens category dialog directly */}
        <button
          onClick={onCategoryClick}
          className={cn(
            "rounded-full border px-6 py-2 text-sm font-semibold transition-colors flex items-center gap-2",
            "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white hover:opacity-90"
          )}
        >
          {isMultipleCategories ? "All Categories" : currentCategory}
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* New Game Button */}
        <Button
          onClick={onNewGame}
          className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 transition-all"
        >
          New Game
        </Button>
      </div>

      {/* Help Menu */}
      <div className="ml-4 sm:ml-6">
        <GameHelpMenu
          onHowToPlay={onHowToPlay}
          onNewGame={onNewGame}
          onRevealWord={onRevealWord}
          variant="rounded"
        />
      </div>
    </div>
  );
}
