"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import SnakeGameBoard from "./components/SnakeGameBoard";
import DifficultySelector from "./components/DifficultySelector";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import InstructionsContent from "./components/InstructionsContent";
import GameOverDialog from "@/components/games/GameOverDialog";
import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import WinDialog from "@/components/games/WinDialog";

export default function SnakePage() {
  const {
    snake,
    food,
    score,
    gameOver,
    won,
    isRunning,
    difficulty,
    gridSize,
    highScore,
    handleMove,
    startNewGame,
    changeDifficulty,
    showInstructions,
    openInstructions,
    closeInstructions,
    showWinDialog,
    setShowWinDialog,
    showGameOverDialog,
    setShowGameOverDialog,
  } = useGameLogic();

  return (
    <div className="bg-white dark:bg-black pt-8 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
          {/* Title */}
          <GameHeader title="Snake" />

          {/* Controls row */}
          <div className="flex items-center justify-between gap-3 mb-4 mt-3 sm:mt-7 lg:mt-9">
            <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
              {/* Score */}
              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 min-w-[70px] sm:min-w-[90px] flex-shrink-0">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Score
                </div>
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                  {score}
                </div>
              </div>

              {/* High Score */}
              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 min-w-[70px] sm:min-w-[90px] flex-shrink-0">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Best
                </div>
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                  {highScore}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <GameHelpMenu
                onHowToPlay={openInstructions}
                onNewGame={startNewGame}
              />
            </div>
          </div>

          {/* Difficulty selector */}
          <div className="flex justify-center mb-4">
            <DifficultySelector
              difficulty={difficulty}
              onDifficultyChange={changeDifficulty}
              disabled={isRunning && !gameOver}
            />
          </div>
        </div>

        {/* Game Board */}
        <div className="flex justify-center">
          <SnakeGameBoard
            snake={snake}
            food={food}
            gridSize={gridSize}
            gameOver={gameOver}
            isRunning={isRunning}
            onMove={handleMove}
          />
        </div>

        {/* Instructions hint */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          {!isRunning && !gameOver
            ? "Press arrow keys or swipe to start"
            : gameOver
            ? "Game Over! Click New Game to play again"
            : "Use arrow keys or swipe to change direction"}
        </p>

        {/* Win Dialog */}
        <WinDialog
          open={showWinDialog}
          onOpenChange={setShowWinDialog}
          title="You Win!"
          message={`Amazing! You filled the entire ${gridSize}x${gridSize} grid with your snake!`}
        />

        {/* Game Over Dialog */}
        <GameOverDialog
          open={showGameOverDialog}
          onOpenChange={setShowGameOverDialog}
          icon="skull"
          message="The snake crashed!"
          score={score}
          highScore={highScore}
          onNewGame={startNewGame}
        />

        {/* Instructions Dialog */}
        <InstructionsDialog
          open={showInstructions}
          onOpenChange={closeInstructions}
          title="How to Play Snake"
          description="sr-only"
          maxWidth="md"
        >
          <InstructionsContent />
        </InstructionsDialog>
      </div>
    </div>
  );
}
