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
      <div className="text-center mb-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black dark:text-white mb-4">
          2048
        </h1>
      </div>

      {/* Buttons and scores row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-4 py-2 min-w-[100px]">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Score
            </div>
            <div className="text-2xl font-bold text-black dark:text-white">
              {score}
            </div>
          </div>

          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-4 py-2 min-w-[100px]">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Best
            </div>
            <div className="text-2xl font-bold text-black dark:text-white">
              {bestScore}
            </div>
          </div>
        </div>

        <GameHelpMenu onHowToPlay={onShowInstructions} onNewGame={onNewGame} />
      </div>
    </div>
  );
}
