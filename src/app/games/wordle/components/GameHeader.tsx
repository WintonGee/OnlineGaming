"use client";

import { Button } from "@/components/ui/button";
import GameHelpMenu from "@/components/games/GameHelpMenu";

interface GameHeaderProps {
  onShowInstructions: () => void;
  onNewGame: () => void;
}

export default function GameHeader({
  onShowInstructions,
  onNewGame,
}: GameHeaderProps) {
  return (
    <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
      {/* Title */}
      <div className="text-center mb-3 sm:mb-7 lg:mb-9">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black dark:text-white">
          Wordle
        </h1>
      </div>

      {/* Buttons row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <Button
          onClick={onNewGame}
          className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 transition-all"
        >
          New Game
        </Button>

        <GameHelpMenu
          onHowToPlay={onShowInstructions}
          onNewGame={onNewGame}
        />
      </div>
    </div>
  );
}
