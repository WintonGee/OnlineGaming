"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import { Button } from "@/components/ui/button";
import GameBoard from "./components/GameBoard";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import InstructionsContent from "./components/InstructionsContent";
import { DIFFICULTY_LABELS } from "./constants";
import { Difficulty } from "./types";
import { formatTimeMSS } from "@/lib/utils/formatTime";
import "./styles.css";

export default function MemoryPage() {
  const {
    gameState,
    bestScores,
    timer,
    isProcessing,
    isNewBestScore,
    statusMessage,
    handleCardClick,
    handleNewGame,
    handleDifficultyChange,
    instructionsDialog,
  } = useGameLogic();

  const currentBest = bestScores[gameState.difficulty];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
          {/* Title */}
          <GameHeader title="Memory" />

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4 mt-3 sm:mt-7 lg:mt-9">
            {/* Difficulty Toggle */}
            <div className="inline-flex rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5 bg-gray-100 dark:bg-gray-800">
              {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultyChange(diff)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                    gameState.difficulty === diff
                      ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {DIFFICULTY_LABELS[diff]}
                </button>
              ))}
            </div>

            {/* Help Menu */}
            <div className="ml-2">
              <GameHelpMenu
                onHowToPlay={instructionsDialog.open}
                onNewGame={handleNewGame}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-6 mb-4 text-sm">
            <div className="text-center">
              <span className="text-gray-500 dark:text-gray-400">Time</span>
              <p className="font-mono text-lg font-semibold text-black dark:text-white">
                {formatTimeMSS(timer.time)}
              </p>
            </div>
            <div className="text-center">
              <span className="text-gray-500 dark:text-gray-400">Moves</span>
              <p className="font-mono text-lg font-semibold text-black dark:text-white">
                {gameState.moves}
              </p>
            </div>
            <div className="text-center">
              <span className="text-gray-500 dark:text-gray-400">Best</span>
              <p className="font-mono text-lg font-semibold text-black dark:text-white">
                {currentBest ?? "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center mb-6">
          <p
            className={`text-lg font-semibold ${
              gameState.won
                ? "text-green-600 dark:text-green-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {statusMessage}
            {isNewBestScore && gameState.won && (
              <span className="block text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                New best score!
              </span>
            )}
          </p>
        </div>

        {/* Game Board */}
        <GameBoard
          cards={gameState.cards}
          difficulty={gameState.difficulty}
          disabled={isProcessing || gameState.gameOver}
          onCardClick={handleCardClick}
        />

        {/* Game Over Actions */}
        {gameState.gameOver && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleNewGame}
              className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide"
            >
              Play Again
            </Button>
          </div>
        )}

        {/* Instructions Dialog */}
        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play Memory"
          description="sr-only"
          maxWidth="lg"
        >
          <InstructionsContent />
        </InstructionsDialog>
      </div>
    </div>
  );
}
