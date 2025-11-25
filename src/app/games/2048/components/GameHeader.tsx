"use client";

import GameHelpMenu from "./GameHelpMenu";

interface GameHeaderProps {
  score: number;
  bestScore: number;
  onNewGame: () => void;
  onShowInstructions: () => void;
}

export default function GameHeader({
  score,
  bestScore,
  onNewGame,
  onShowInstructions,
}: GameHeaderProps) {
  return (
    <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
      {/* Title */}
      <div className="text-center mb-3 sm:mb-7 lg:mb-9">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black dark:text-white">
          2048
        </h1>
      </div>

      {/* Buttons and scores row */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-[100px] flex-shrink-0">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Score
            </div>
            <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">
              {score}
            </div>
          </div>

          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-[100px] flex-shrink-0">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Best
            </div>
            <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">
              {bestScore}
            </div>
          </div>
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
