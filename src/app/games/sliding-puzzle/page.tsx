"use client";

import "./styles.css";
import { useGameLogic } from "./hooks/useGameLogic";
import GameHeader from "@/components/games/GameHeader";
import SlidingPuzzleBoard from "./components/SlidingPuzzleBoard";
import SlidingPuzzleToolbar from "./components/SlidingPuzzleToolbar";
import StatsDisplay from "./components/StatsDisplay";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import InstructionsContent from "./components/InstructionsContent";
import WinDialog from "@/components/games/WinDialog";
import { formatTimeMMSS as formatTime } from "@/lib/utils/formatTime";

export default function SlidingPuzzlePage() {
  const {
    gameState,
    bestRecords,
    mounted,
    tilesWithMetadata,
    handleTileClick,
    handleMove,
    handleNewGame,
    shufflePuzzle,
    instructionsDialog,
    winDialog,
  } = useGameLogic();

  const { tiles, gridSize, moves, time, won, difficulty } = gameState;

  // Handle hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="mx-auto w-full max-w-2xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded mb-8 mx-auto w-64" />
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded mb-4 mx-auto w-48" />
            <div className="aspect-square max-w-md mx-auto bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-foreground py-3 sm:py-8 lg:py-12 px-4">
      <div className="mx-auto w-full max-w-2xl px-0 sm:px-4">
        {/* Header */}
        <div className="mb-4 sm:mb-8 flex flex-col gap-3 sm:gap-6">
          {/* Title */}
          <GameHeader title="Sliding Puzzle" />

          {/* Toolbar */}
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <SlidingPuzzleToolbar
              selectedDifficulty={difficulty}
              onDifficultyChange={(newDifficulty) =>
                handleNewGame(newDifficulty)
              }
              onNewGame={() => handleNewGame()}
              onShuffle={shufflePuzzle}
              onHowToPlay={instructionsDialog.open}
            />

            {/* Stats Display */}
            <StatsDisplay
              moves={moves}
              time={time}
              bestRecords={bestRecords}
              difficulty={difficulty}
            />
          </div>
        </div>

        {/* Game Board */}
        <div className="flex flex-col items-center justify-center">
          <SlidingPuzzleBoard
            tilesWithMetadata={tilesWithMetadata}
            gridSize={gridSize}
            won={won}
            onTileClick={handleTileClick}
            onMove={handleMove}
          />
        </div>

        {/* Instructions Dialog */}
        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play Sliding Puzzle"
          description="sr-only"
          maxWidth="lg"
        >
          <InstructionsContent />
        </InstructionsDialog>

        {/* Win Dialog */}
        <WinDialog
          open={winDialog.isOpen}
          onOpenChange={winDialog.setIsOpen}
          time={time}
          difficulty={`${gridSize}×${gridSize}`}
          bestTimes={{
            [`${gridSize}×${gridSize}`]: bestRecords[difficulty]?.time,
          }}
          onNewGame={() => handleNewGame()}
          formatTime={formatTime}
          message={`You solved the puzzle in ${moves} moves!`}
        />
      </div>
    </div>
  );
}
