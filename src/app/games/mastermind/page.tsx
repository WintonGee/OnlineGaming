"use client";

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
import { isGuessComplete } from "./logic/validation";

export default function MastermindPage() {
  const {
    gameState,
    mounted,
    selectSlot,
    selectColor,
    submitGuess,
    newGame,
    revealCode,
    instructionsDialog,
  } = useGameLogic();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <GameHeader title="Mastermind" />
        </div>
      </div>
    );
  }

  const canSubmit = isGuessComplete(gameState.currentGuess);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-3 sm:py-8 lg:py-12 px-4">
      <div className="mx-auto w-full max-w-6xl px-0 sm:px-4 lg:px-12">
        {/* Header */}
        <div className="mb-3 sm:mb-8 lg:mb-12 flex flex-col gap-2 sm:gap-4 lg:gap-6">
          <GameHeader title="Mastermind" />

          {/* Top Controls */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <Button
              onClick={newGame}
              className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 transition-all"
            >
              New Game
            </Button>

            <div className="ml-4 sm:ml-6">
              <GameHelpMenu
                onHowToPlay={instructionsDialog.open}
                onNewGame={newGame}
                onRevealWord={revealCode}
              />
            </div>
          </div>
        </div>

        {/* Main Game Area - Side by side on desktop, stacked on mobile */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start gap-6 lg:gap-16 pb-[200px] lg:pb-0">
          {/* Game Board */}
          <div className="flex-shrink-0 lg:self-start">
            <GameBoard
              guesses={gameState.guesses}
              currentGuess={gameState.currentGuess}
              selectedSlot={gameState.selectedSlot}
              onSlotClick={selectSlot}
              gameOver={gameState.gameOver}
              secretCode={gameState.secretCode}
            />
          </div>

          {/* Controls Panel - Fixed at bottom on mobile, static on desktop */}
          <div className="fixed bottom-0 left-0 right-0 lg:static w-full lg:w-auto lg:max-w-xs lg:self-start bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700 lg:border-t-0 lg:border lg:rounded-xl px-4 pt-4 pb-safe pb-6 lg:p-6 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3)] lg:shadow-lg">
            <div className="flex flex-col gap-4">
              {/* Color Palette */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center lg:text-left">
                  Choose a Color
                </h3>
                <ColorPalette
                  onColorSelect={selectColor}
                  disabled={gameState.gameOver}
                />
              </div>

              {/* Submit Button */}
              {!gameState.gameOver && (
                <Button
                  onClick={submitGuess}
                  disabled={!canSubmit}
                  className="w-full rounded-full px-8 py-3 text-base font-semibold uppercase tracking-wide bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white border-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Guess
                </Button>
              )}

              {/* Game Over message */}
              {gameState.gameOver && (
                <div className="text-center">
                  <p className={`text-lg font-semibold ${gameState.won ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {gameState.won ? 'You Win!' : 'Game Over'}
                  </p>
                  <Button
                    onClick={newGame}
                    className="mt-3 w-full rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white border-0 transition-all"
                  >
                    Play Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
        open={gameState.gameOver && gameState.won}
        onOpenChange={() => {}}
        title="You Win!"
        message={`You cracked the code in ${gameState.guesses.length} ${
          gameState.guesses.length === 1 ? "attempt" : "attempts"
        }!`}
      />

      <GameOverDialog
        open={gameState.gameOver && !gameState.won}
        onOpenChange={() => {}}
        title="Game Over"
        message="You ran out of attempts. The secret code has been revealed above."
        onNewGame={newGame}
      />
    </div>
  );
}
