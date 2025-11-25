"use client";

import { RotateCcw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="mb-6">
      {/* Title and buttons row */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 dark:text-gray-100">
          2048
        </h1>

        <div className="flex gap-2">
          <Button
            onClick={onShowInstructions}
            variant="outline"
            size="icon"
            className="h-10 w-10"
            title="How to play"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button
            onClick={onNewGame}
            variant="default"
            size="icon"
            className="h-10 w-10"
            title="New game"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Scores row */}
      <div className="flex gap-3">
        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg px-4 py-2 min-w-[100px]">
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Score
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {score}
          </div>
        </div>

        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg px-4 py-2 min-w-[100px]">
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Best
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {bestScore}
          </div>
        </div>
      </div>
    </div>
  );
}
