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
    keyboardStatuses,
    addLetter,
    removeLetter,
    submitGuess,
    newGame,
    instructionsDialog,
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <GameHeader
          onShowInstructions={instructionsDialog.open}
          onNewGame={newGame}
        />

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
          open={gameState.gameOver}
          onOpenChange={(open) => {
            if (!open) {
              newGame();
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
      <div className="mt-6 px-10 py-4 sm:px-4 sm:py-0">
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
