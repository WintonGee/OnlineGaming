"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import GameOverDialog from "@/components/games/GameOverDialog";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import { Button } from "@/components/ui/button";
import GameBoard from "./components/GameBoard";
import InstructionsContent from "./components/InstructionsContent";
import "./styles.css";

export default function HigherOrLowerPage() {
  const {
    gameState,
    bestScores,
    statusMessage,
    handleGuess,
    handleNewGame,
    instructionsDialog,
    gameOverDialog,
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
          <GameHeader title="Higher or Lower" />

          <div className="flex justify-center mt-3 sm:mt-7 lg:mt-9">
            <GameHelpMenu
              onHowToPlay={instructionsDialog.open}
              onNewGame={handleNewGame}
            />
          </div>
        </div>

        {/* Stats Display */}
        <div className="flex gap-4 justify-center mb-8">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-4 py-2 text-center">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Streak
            </div>
            <div className="text-2xl font-bold text-black dark:text-white font-mono">
              {gameState.streak}
            </div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-4 py-2 text-center">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Best
            </div>
            <div className="text-2xl font-bold text-black dark:text-white font-mono">
              {bestScores.bestStreak}
            </div>
          </div>
        </div>

        {/* Status Message */}
        {gameState.gamePhase !== "playing" && (
          <div className="text-center mb-6">
            <span className={`text-xl font-semibold ${
              gameState.lastResult === "wrong"
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}>
              {statusMessage}
            </span>
          </div>
        )}

        <GameBoard
          currentCard={gameState.currentCard}
          nextCard={gameState.nextCard}
          gamePhase={gameState.gamePhase}
          lastResult={gameState.lastResult}
          streak={gameState.streak}
          onGuess={handleGuess}
        />

        {gameState.gamePhase === "gameOver" && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleNewGame}
              className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide"
            >
              Play Again
            </Button>
          </div>
        )}

        <GameOverDialog
          open={gameOverDialog.isOpen}
          onOpenChange={gameOverDialog.setIsOpen}
          icon="frown"
          message={`Your streak: ${gameState.streak}`}
          score={gameState.streak}
          highScore={bestScores.bestStreak}
          onNewGame={handleNewGame}
        />

        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play Higher or Lower"
          description="sr-only"
          maxWidth="lg"
        >
          <InstructionsContent />
        </InstructionsDialog>
      </div>
    </div>
  );
}
