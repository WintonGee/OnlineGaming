"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import { Button } from "@/components/ui/button";
import WordleBoard from "./components/WordleBoard";
import Keyboard from "./components/Keyboard";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import InstructionsContent from "./components/InstructionsContent";
import WinDialog from "@/components/games/WinDialog";
import { GameMode } from "./types";

export default function WordlePage() {
  const {
    gameState,
    errorMessage,
    shake,
    dailyCompleted,
    justCompleted,
    keyboardStatuses,
    addLetter,
    removeLetter,
    submitGuess,
    newGame,
    setMode,
    dismissResult,
    revealWord,
    instructionsDialog,
  } = useGameLogic();

  const isDailyAndCompleted = gameState.mode === "daily" && dailyCompleted;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
          {/* Title */}
          <GameHeader title="Wordle" />

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4 mt-3 sm:mt-7 lg:mt-9">
            {/* Mode Toggle and New Game Group */}
            <div className="flex items-center gap-2">
              {/* Mode Toggle */}
              <div className="inline-flex rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5 bg-gray-100 dark:bg-gray-800">
                <button
                  onClick={() => setMode("daily")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                    gameState.mode === "daily"
                      ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setMode("random")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                    gameState.mode === "random"
                      ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Random
                </button>
              </div>

              {/* New Game Button */}
              <Button
                onClick={newGame}
                className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 transition-all"
              >
                New Game
              </Button>
            </div>

            {/* Help Menu */}
            <div className="ml-4 sm:ml-6">
              <GameHelpMenu
                onHowToPlay={instructionsDialog.open}
                onNewGame={newGame}
                onRevealWord={revealWord}
              />
            </div>
          </div>
        </div>

        {/* Daily Completed Banner */}
        {isDailyAndCompleted && (
          <div className="text-center py-3 mb-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700">
              <span className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                {dailyCompleted.won
                  ? `Daily completed in ${dailyCompleted.guesses.length} ${dailyCompleted.guesses.length === 1 ? "try" : "tries"}!`
                  : `Daily completed — the word was ${dailyCompleted.solution}`}
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
              Come back tomorrow for a new daily puzzle, or try Random mode
            </p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="text-center py-2">
            <p className="text-red-600 dark:text-red-400 text-sm font-semibold">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Game Board */}
        <WordleBoard
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess}
          shake={shake}
        />

        {/* Dialogs */}
        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play Wordle"
          description="sr-only"
          maxWidth="lg"
        >
          <InstructionsContent />
        </InstructionsDialog>

        {/* Win/Loss Dialog */}
        <WinDialog
          open={justCompleted}
          onOpenChange={(open) => {
            if (!open) {
              dismissResult();
            }
          }}
          title={gameState.won ? "You Win!" : "Game Over"}
          message={
            gameState.won
              ? `You guessed "${gameState.solution}" in ${gameState.guesses.length} ${
                  gameState.guesses.length === 1 ? "try" : "tries"
                }!`
              : `The word was: ${gameState.solution}`
          }
        />
      </div>

      {/* Keyboard - outside container for full-width control */}
      <div className="mt-2 px-10 py-4 sm:px-4 sm:py-0 md:pb-[30px]">
        <Keyboard
          onKeyPress={addLetter}
          onEnter={submitGuess}
          onBackspace={removeLetter}
          keyStatuses={keyboardStatuses}
          disabled={gameState.gameOver}
        />
      </div>
    </div>
  );
}
