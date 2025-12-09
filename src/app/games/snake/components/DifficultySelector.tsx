"use client";

import { Difficulty } from "../types";
import { DIFFICULTY_CONFIG } from "../constants";
import { cn } from "@/lib/utils/cn";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

export default function DifficultySelector({
  difficulty,
  onDifficultyChange,
  disabled = false,
}: DifficultySelectorProps) {
  const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

  return (
    <div className="flex gap-2">
      {difficulties.map((diff) => (
        <button
          key={diff}
          onClick={() => onDifficultyChange(diff)}
          disabled={disabled}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
            "border",
            difficulty === diff
              ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          title={`${DIFFICULTY_CONFIG[diff].gridSize}x${DIFFICULTY_CONFIG[diff].gridSize} grid`}
        >
          {diff}
        </button>
      ))}
    </div>
  );
}
