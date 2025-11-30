"use client";

import { Button } from "@/components/ui/button";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import { MAX_GUESSES } from "../constants";

interface GameHeaderProps {
  onShowInstructions: () => void;
  onNewGame: () => void;
  attempt: number;
}

export default function GameHeader({
  onShowInstructions,
  onNewGame,
  attempt,
}: GameHeaderProps) {
  return (
    <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
      {/* Title */}
      <div className="text-center mb-3 sm:mb-7 lg:mb-9">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black dark:text-white">
          Wordle
        </h1>
      </div>

      {/* Buttons and guess counter row */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex gap-2 sm:gap-3 flex-1 min-w-0 items-center">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-[100px] flex-shrink-0">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Guess
            </div>
            <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">
              {attempt}/{MAX_GUESSES}
            </div>
          </div>
          <Button
            onClick={onNewGame}
            className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 transition-all self-center"
          >
            New Game
          </Button>
        </div>

        <div className="flex-shrink-0">
          <GameHelpMenu
            onHowToPlay={onShowInstructions}
            onNewGame={onNewGame}
          />
        </div>
      </div>
    </div>
  );
}
