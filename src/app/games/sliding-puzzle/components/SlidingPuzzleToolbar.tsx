"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";
import { ChevronDown, Check } from "lucide-react";
import { Difficulty } from "../types";
import { DIFFICULTY_LABELS } from "../constants";
import GameHelpMenu from "@/components/games/GameHelpMenu";

interface SlidingPuzzleToolbarProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onShuffle: () => void;
  onHowToPlay: () => void;
}

const ALL_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export default function SlidingPuzzleToolbar({
  selectedDifficulty,
  onDifficultyChange,
  onNewGame,
  onShuffle,
  onHowToPlay,
}: SlidingPuzzleToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {/* Difficulty and New Game Group */}
      <div className="flex items-center gap-2">
        {/* Difficulty Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "rounded-full border px-6 py-2 text-sm font-semibold transition-colors flex items-center gap-2",
                "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
              )}
            >
              {DIFFICULTY_LABELS[selectedDifficulty]}
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {ALL_DIFFICULTIES.map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() => onDifficultyChange(level)}
                className="flex items-center justify-between cursor-pointer"
              >
                {DIFFICULTY_LABELS[level]}
                {level === selectedDifficulty && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New Game Button */}
        <Button
          onClick={onNewGame}
          className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 transition-all"
        >
          New Game
        </Button>
      </div>

      {/* Help Menu */}
      <div className="ml-2 sm:ml-4">
        <GameHelpMenu
          onHowToPlay={onHowToPlay}
          onNewGame={onShuffle}
          variant="rounded"
        />
      </div>
    </div>
  );
}
