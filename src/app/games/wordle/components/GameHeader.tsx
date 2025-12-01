"use client";

import { Button } from "@/components/ui/button";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import { GameMode } from "../types";

interface GameHeaderProps {
  onShowInstructions: () => void;
  onNewGame: () => void;
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onRevealWord?: () => void;
}

export default function GameHeader({
  onShowInstructions,
  onNewGame,
  mode,
  onModeChange,
  onRevealWord,
}: GameHeaderProps) {
  return (
    <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
      {/* Title */}
      <div className="text-center mb-3 sm:mb-7 lg:mb-9">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black dark:text-white">
          Wordle
        </h1>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
        {/* Mode Toggle and New Game Group */}
        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <div className="inline-flex rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5 bg-gray-100 dark:bg-gray-800">
            <button
              onClick={() => onModeChange("daily")}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                mode === "daily"
                  ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => onModeChange("random")}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                mode === "random"
                  ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Random
            </button>
          </div>

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
            onHowToPlay={onShowInstructions}
            onNewGame={onNewGame}
            onRevealWord={onRevealWord}
          />
        </div>
      </div>
    </div>
  );
}
