"use client";

import { useState, useEffect } from "react";
import { useGameLogic } from "./hooks/useGameLogic";
import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import { Button } from "@/components/ui/button";
import GameBoard from "./components/GameBoard";
import ColorPalette from "./components/ColorPalette";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import InstructionsContent from "./components/InstructionsContent";
import WinDialog from "@/components/games/WinDialog";
import GameOverDialog from "@/components/games/GameOverDialog";

export default function MastermindPage() {
  const {
    gameState,
    mounted,
    canSubmitGuessGuess,
    selectSlot,
    selectColor,
    submitGuess,
    newGame: originalNewGame,
    revealCode,
    instructionsDialog,
  } = useGameLogic();

  const [showWinDialog, setShowWinDialog] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);

  // Show dialogs when game ends
  useEffect(() => {
    if (gameState.gameOver && gameState.won) {
      setShowWinDialog(true);
    } else if (gameState.gameOver && !gameState.won) {
      setShowGameOverDialog(true);
    }
  }, [gameState.gameOver, gameState.won]);

  // Reset dialog states when starting a new game
  const newGame = () => {
    setShowWinDialog(false);
    setShowGameOverDialog(false);
    originalNewGame();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <GameHeader title="Mastermind" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl pb-[180px] lg:pb-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 mx-auto max-w-sm w-full">
          <GameHeader title="Mastermind" />

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 sm:mt-4">
            <Button
              onClick={newGame}
              className="rounded-full px-5 py-1.5 text-sm font-semibold uppercase tracking-wide bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 transition-all"
            >
              New Game
            </Button>

            <div className="ml-2">
              <GameHelpMenu
                onHowToPlay={instructionsDialog.open}
                onNewGame={newGame}
                onRevealWord={revealCode}
              />
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="mb-4">
          <GameBoard
            guesses={gameState.guesses}
            currentGuess={gameState.currentGuess}
            selectedSlot={gameState.selectedSlot}
            onSlotClick={selectSlot}
            gameOver={gameState.gameOver}
            secretCode={gameState.secretCode}
          />
        </div>

        {/* Legend - Only visible on desktop */}
        <div className="hidden lg:block max-w-sm mx-auto mb-4 px-1">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Correct</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Wrong spot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span>Not in code</span>
            </div>
          </div>
        </div>

        {/* Game Over Message - Desktop only (mobile shows in sticky panel) */}
        {gameState.gameOver && (
          <div className="hidden lg:block max-w-sm mx-auto text-center">
            <div className={`text-lg font-semibold ${gameState.won ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {gameState.won
                ? `You cracked the code in ${gameState.guesses.length} ${gameState.guesses.length === 1 ? "attempt" : "attempts"}!`
                : "Better luck next time!"
              }
            </div>
            <Button
              onClick={newGame}
              className="mt-3 rounded-full px-8 py-2.5 text-sm font-semibold uppercase tracking-wide bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all"
            >
              Play Again
            </Button>
          </div>
        )}
      </div>

      {/* Sticky Controls Panel - Fixed at bottom on mobile, hidden on desktop */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-4 pt-3 pb-safe pb-4 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
        {!gameState.gameOver ? (
          <div className="max-w-sm mx-auto space-y-3">
            {/* Legend - Mobile */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span>Wrong spot</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span>Not in code</span>
              </div>
            </div>

            {/* Color Palette */}
            <ColorPalette
              onColorSelect={selectColor}
              disabled={gameState.gameOver}
            />

            {/* Submit Button */}
            <Button
              onClick={submitGuess}
              disabled={!canSubmitGuess}
              className="w-full rounded-full py-2.5 text-sm font-semibold uppercase tracking-wide bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Guess
            </Button>
          </div>
        ) : (
          <div className="max-w-sm mx-auto text-center space-y-3">
            <div className={`text-base font-semibold ${gameState.won ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {gameState.won
                ? `Cracked in ${gameState.guesses.length} ${gameState.guesses.length === 1 ? "attempt" : "attempts"}!`
                : "Better luck next time!"
              }
            </div>
            <Button
              onClick={newGame}
              className="w-full rounded-full py-2.5 text-sm font-semibold uppercase tracking-wide bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all"
            >
              Play Again
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Controls - Static below board */}
      {!gameState.gameOver && (
        <div className="hidden lg:block container mx-auto px-4 max-w-2xl">
          <div className="max-w-sm mx-auto space-y-3">
            {/* Color Palette */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-3">
                Select a color to place in the highlighted slot
              </p>
              <ColorPalette
                onColorSelect={selectColor}
                disabled={gameState.gameOver}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={submitGuess}
              disabled={!canSubmitGuess}
              className="w-full rounded-full py-2.5 text-sm font-semibold uppercase tracking-wide bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Guess
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <InstructionsDialog
        open={instructionsDialog.isOpen}
        onOpenChange={instructionsDialog.setIsOpen}
        title="How to Play Mastermind"
        description="sr-only"
        maxWidth="lg"
      >
        <InstructionsContent />
      </InstructionsDialog>

      <WinDialog
        open={showWinDialog}
        onOpenChange={setShowWinDialog}
        title="You Win!"
        message={`You cracked the code in ${gameState.guesses.length} ${
          gameState.guesses.length === 1 ? "attempt" : "attempts"
        }!`}
      />

      <GameOverDialog
        open={showGameOverDialog}
        onOpenChange={setShowGameOverDialog}
        title="Game Over"
        message="You ran out of attempts. The secret code has been revealed above."
        onNewGame={newGame}
      />
    </div>
  );
}
