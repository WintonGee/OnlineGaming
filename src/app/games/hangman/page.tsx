"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import GameHeader from "./components/GameHeader";
import HangmanToolbar from "./components/HangmanToolbar";
import HangmanDrawing from "./components/HangmanDrawing";
import WordDisplay from "./components/WordDisplay";
import Keyboard from "./components/Keyboard";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import InstructionsContent from "./components/InstructionsContent";
import WinDialog from "@/components/games/WinDialog";
import GameOverDialog from "./components/GameOverDialog";
import CategoryDialog from "./components/CategoryDialog";
import { MAX_INCORRECT_GUESSES } from "./constants";

export default function HangmanPage() {
  const {
    gameState,
    guessLetter,
    newGame,
    newGameWithCategory,
    revealWord,
    instructionsDialog,
    categoryDialog,
    winDialog,
    mounted,
  } = useGameLogic();

  // Don't render game content until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-3 sm:py-6 max-w-4xl">
          <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
            <div className="text-center mb-1 sm:mb-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black dark:text-white">
                Hangman
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const incorrectGuessCount = gameState.incorrectGuesses.length;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-3 sm:py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-3 sm:mb-8 lg:mb-12 flex flex-col gap-2 sm:gap-4 lg:gap-6">
          <GameHeader />

          {/* Category Toolbar */}
          <div className="flex flex-col gap-2 sm:gap-4">
            <div className="flex flex-col lg:flex-row w-full items-center gap-2 lg:gap-4 justify-center">
              <HangmanToolbar
                currentCategory={gameState.category}
                onCategoryClick={categoryDialog.open}
                onNewGame={newGame}
                onHowToPlay={instructionsDialog.open}
                onRevealWord={revealWord}
              />
            </div>
          </div>
        </div>

        {/* Hangman Drawing */}
        <HangmanDrawing incorrectGuessCount={incorrectGuessCount} />

        {/* Word Display */}
        <WordDisplay
          solution={gameState.solution}
          guessedLetters={gameState.guessedLetters}
          gameOver={gameState.gameOver}
          category={gameState.category}
        />

        {/* Keyboard */}
        <Keyboard
          guessedLetters={gameState.guessedLetters}
          incorrectGuesses={gameState.incorrectGuesses}
          onGuess={guessLetter}
          disabled={gameState.gameOver}
        />

        {/* Instructions Dialog */}
        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play Hangman"
          description="sr-only"
        >
          <InstructionsContent />
        </InstructionsDialog>

        {/* Category Selection Dialog */}
        <CategoryDialog
          open={categoryDialog.isOpen}
          onOpenChange={categoryDialog.setIsOpen}
          onSelectCategories={newGameWithCategory}
        />

        {/* Win Dialog */}
        <WinDialog
          open={winDialog.isOpen}
          onOpenChange={winDialog.setIsOpen}
          message="Congratulations! You guessed the word!"
          solution={gameState.solution}
        />

        {/* Game Over Dialog */}
        <GameOverDialog
          open={gameState.gameOver && !gameState.won}
          onOpenChange={() => {}}
          solution={gameState.solution}
          onNewGame={newGame}
        />
      </div>
    </div>
  );
}
