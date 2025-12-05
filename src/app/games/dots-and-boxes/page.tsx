"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import { Button } from "@/components/ui/button";
import GameBoard from "./components/GameBoard";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import InstructionsContent from "./components/InstructionsContent";
import {
  DIFFICULTY_LABELS,
  GRID_SIZE_LABELS,
  GRID_SIZES,
  PLAYER_COLORS,
} from "./constants";
import { Difficulty, GridSize } from "./types";

export default function DotsAndBoxesPage() {
  const {
    gameState,
    isAIThinking,
    statusMessage,
    handleLineClick,
    handleNewGame,
    handleDifficultyChange,
    handleModeChange,
    handleGridSizeChange,
    instructionsDialog,
  } = useGameLogic();

  const isGameOver = gameState.status === "finished";

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
          {/* Title */}
          <GameHeader title="Dots and Boxes" />

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4 mt-3 sm:mt-7 lg:mt-9">
            {/* Mode Toggle */}
            <div className="inline-flex rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5 bg-gray-100 dark:bg-gray-800">
              <button
                onClick={() => handleModeChange("singleplayer")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                  gameState.mode === "singleplayer"
                    ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                1 Player
              </button>
              <button
                onClick={() => handleModeChange("multiplayer")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                  gameState.mode === "multiplayer"
                    ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                2 Players
              </button>
            </div>

            {/* Help Menu */}
            <div className="ml-2">
              <GameHelpMenu
                onHowToPlay={instructionsDialog.open}
                onNewGame={handleNewGame}
              />
            </div>
          </div>

          {/* Grid Size Toggle */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <div className="inline-flex rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5 bg-gray-100 dark:bg-gray-800">
              {GRID_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handleGridSizeChange(size)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                    gameState.gridSize === size
                      ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {GRID_SIZE_LABELS[size]}
                </button>
              ))}
            </div>
          </div>

          {/* Single Player Options */}
          {gameState.mode === "singleplayer" && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {/* Difficulty Toggle */}
              <div className="inline-flex rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5 bg-gray-100 dark:bg-gray-800">
                {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultyChange(diff)}
                    className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                      gameState.difficulty === diff
                        ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {DIFFICULTY_LABELS[diff]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Score Display */}
        <div className="flex justify-center items-center gap-8 mb-6">
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${PLAYER_COLORS[1].text}`}
            >
              {gameState.scores[1]}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {gameState.mode === "singleplayer" ? "You" : "Red"}
            </div>
          </div>
          <div className="text-gray-400 dark:text-gray-600 text-xl font-semibold">
            vs
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${PLAYER_COLORS[2].text}`}
            >
              {gameState.scores[2]}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {gameState.mode === "singleplayer" ? "Computer" : "Blue"}
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center mb-6">
          <p
            className={`text-lg font-semibold ${
              gameState.status === "finished"
                ? "text-green-600 dark:text-green-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {statusMessage}
          </p>
        </div>

        {/* Game Board */}
        <div className="flex justify-center">
          <GameBoard
            board={gameState.board}
            gridSize={gameState.gridSize}
            disabled={isGameOver || isAIThinking}
            lastMove={gameState.lastMove}
            onLineClick={handleLineClick}
          />
        </div>

        {/* Game Over Actions */}
        {isGameOver && (
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
          title="How to Play Dots and Boxes"
          description="sr-only"
          maxWidth="lg"
        >
          <InstructionsContent />
        </InstructionsDialog>
      </div>
    </div>
  );
}
