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
    handleGuess,
    handleNewGame,
    instructionsDialog,
    gameOverDialog,
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <GameHeader title="Higher or Lower" />

        {/* Controls Row */}
        <div className="flex items-center justify-between mb-6 mt-4">
          {/* Stats Display */}
          <div className="flex gap-3">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 py-1.5 text-center min-w-[70px]">
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Streak
              </div>
              <div className="text-xl font-bold text-black dark:text-white font-mono">
                {gameState?.streak ?? 0}
              </div>
            </div>
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 py-1.5 text-center min-w-[70px]">
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Best
              </div>
              <div className="text-xl font-bold text-black dark:text-white font-mono">
                {bestScores.bestStreak}
              </div>
            </div>
          </div>

          <GameHelpMenu
            onHowToPlay={instructionsDialog.open}
            onNewGame={handleNewGame}
          />
        </div>

        {/* Game Board */}
        {!gameState ? (
          <div className="w-full max-w-md mx-auto">
            <div className="rounded-2xl p-6 bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 min-h-[420px] flex items-center justify-center">
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
          </div>
        ) : (
          <GameBoard
            currentCard={gameState.currentCard}
            nextCard={gameState.nextCard}
            gamePhase={gameState.gamePhase}
            lastResult={gameState.lastResult}
            onGuess={handleGuess}
          />
        )}

        {/* Play Again Button */}
        {gameState?.gamePhase === "gameOver" && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleNewGame}
              className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide"
            >
              Play Again
            </Button>
          </div>
        )}

        {/* Dialogs */}
        <GameOverDialog
          open={gameOverDialog.isOpen}
          onOpenChange={gameOverDialog.setIsOpen}
          icon="frown"
          message={`Your streak: ${gameState?.streak ?? 0}`}
          score={gameState?.streak ?? 0}
          highScore={bestScores.bestStreak}
          onNewGame={handleNewGame}
        />

        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play"
        >
          <InstructionsContent />
        </InstructionsDialog>
      </div>
    </div>
  );
}
