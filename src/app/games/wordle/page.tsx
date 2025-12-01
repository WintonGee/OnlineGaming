"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import GameHeader from "./components/GameHeader";
import WordleBoard from "./components/WordleBoard";
import Keyboard from "./components/Keyboard";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import InstructionsContent from "./components/InstructionsContent";
import WinDialog from "@/components/games/WinDialog";

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
        <GameHeader
          onShowInstructions={instructionsDialog.open}
          onNewGame={newGame}
          mode={gameState.mode}
          onModeChange={setMode}
          onRevealWord={revealWord}
        />

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
              if (isDailyAndCompleted) {
                // Just close the dialog, don't start new game for daily
                dismissResult();
              } else {
                newGame();
              }
            }
          }}
          title={gameState.won ? "You Win!" : "Game Over"}
          message={
            gameState.won
              ? `You guessed the word in ${gameState.guesses.length} ${
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
