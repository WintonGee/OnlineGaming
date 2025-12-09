"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import { Button } from "@/components/ui/button";
import GameBoard from "./components/GameBoard";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import InstructionsContent from "./components/InstructionsContent";
import { DIFFICULTY_LABELS } from "./constants";
import { Difficulty, Player } from "./types";

export default function ConnectFourPage() {
  const {
    gameState,
    isAIThinking,
    statusMessage,
    handleColumnClick,
    handleNewGame,
    handleDifficultyChange,
    handleModeChange,
    handlePlayerNumberChange,
    instructionsDialog,
  } = useGameLogic();

  const isGameOver = gameState.status !== "playing";

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
          {/* Title */}
          <GameHeader title="Connect Four" />

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

              {/* Play As Toggle */}
              <div className="inline-flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Play as:
                </span>
                <div className="inline-flex rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5 bg-gray-100 dark:bg-gray-800">
                  {([1, 2] as Player[]).map((playerNum) => (
                    <button
                      key={playerNum}
                      onClick={() => handlePlayerNumberChange(playerNum)}
                      className={`px-3 py-1 text-sm font-medium rounded-full transition-all flex items-center gap-1 ${
                        gameState.playerNumber === playerNum
                          ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full ${
                          playerNum === 1
                            ? "bg-red-500"
                            : "bg-yellow-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Message */}
        <div className="text-center mb-6">
          <p
            className={`text-lg font-semibold ${
              gameState.status === "won"
                ? "text-green-600 dark:text-green-400"
                : gameState.status === "draw"
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {statusMessage}
          </p>
        </div>

        {/* Game Board */}
        <GameBoard
          board={gameState.board}
          currentPlayer={gameState.currentPlayer}
          winningLine={gameState.winningLine}
          lastMove={gameState.lastMove}
          disabled={isGameOver || isAIThinking}
          onColumnClick={handleColumnClick}
        />

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
          title="How to Play Connect Four"
          description="sr-only"
          maxWidth="lg"
        >
          <InstructionsContent />
        </InstructionsDialog>
      </div>
    </div>
  );
}
