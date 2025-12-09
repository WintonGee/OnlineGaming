"use client";

import { Difficulty } from "../types";
import { DIFFICULTY_LABELS } from "../constants";
import { getCategoryDisplayName } from "../data/categories";
import GameHelpMenu from "@/components/games/GameHelpMenu";

interface WordSearchToolbarProps {
  category: string;
  difficulty: Difficulty;
  onCategoryClick: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onHowToPlay: () => void;
}

export default function WordSearchToolbar({
  category,
  difficulty,
  onCategoryClick,
  onDifficultyChange,
  onNewGame,
  onHowToPlay,
}: WordSearchToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
      {/* Category Button */}
      <button
        onClick={onCategoryClick}
        className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg
          border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800
          hover:bg-gray-50 dark:hover:bg-gray-700
          text-gray-800 dark:text-gray-200
          transition-colors"
      >
        {getCategoryDisplayName(category)}
      </button>

      {/* Difficulty Selector */}
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
        {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((diff) => (
          <button
            key={diff}
            onClick={() => onDifficultyChange(diff)}
            className={`
              px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium
              transition-colors
              ${
                difficulty === diff
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }
            `}
          >
            {DIFFICULTY_LABELS[diff]}
          </button>
        ))}
      </div>

      {/* Help Menu */}
      <GameHelpMenu onHowToPlay={onHowToPlay} onNewGame={onNewGame} />
    </div>
  );
}
