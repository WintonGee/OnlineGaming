"use client";

import { useGameLogic } from "./hooks/useGameLogic";
import GameHeader from "@/components/games/GameHeader";
import WordSearchGrid from "./components/WordSearchGrid";
import WordList from "./components/WordList";
import WordSearchToolbar from "./components/WordSearchToolbar";
import CategoryDialog from "./components/CategoryDialog";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import InstructionsContent from "./components/InstructionsContent";
import WinDialog from "@/components/games/WinDialog";

export default function WordSearchPage() {
  const {
    gameState,
    mounted,
    selectionState,
    handleSelectionStart,
    handleSelectionMove,
    onSelectionEnd,
    handleNewGame,
    handleCategoryChange,
    handleDifficultyChange,
    instructionsDialog,
    categoryDialog,
    winDialog,
  } = useGameLogic();

  // Don't render game content until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-3 sm:py-6 max-w-4xl">
          <GameHeader title="Word Search" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-3 sm:py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-3 sm:mb-6">
          <GameHeader title="Word Search" />
        </div>

        {/* Toolbar */}
        <WordSearchToolbar
          category={gameState.category}
          difficulty={gameState.difficulty}
          onCategoryClick={categoryDialog.open}
          onDifficultyChange={handleDifficultyChange}
          onNewGame={handleNewGame}
          onHowToPlay={instructionsDialog.open}
        />

        {/* Game Grid */}
        <WordSearchGrid
          grid={gameState.grid}
          words={gameState.words}
          selectedCells={selectionState.selectedCells}
          onSelectionStart={handleSelectionStart}
          onSelectionMove={handleSelectionMove}
          onSelectionEnd={onSelectionEnd}
          disabled={gameState.gameWon}
        />

        {/* Word List */}
        <WordList words={gameState.words} foundWords={gameState.foundWords} />

        {/* Instructions Dialog */}
        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play Word Search"
          description="sr-only"
        >
          <InstructionsContent />
        </InstructionsDialog>

        {/* Category Dialog */}
        <CategoryDialog
          open={categoryDialog.isOpen}
          onOpenChange={categoryDialog.setIsOpen}
          currentCategory={gameState.category}
          onSelectCategory={handleCategoryChange}
        />

        {/* Win Dialog */}
        <WinDialog
          open={winDialog.isOpen}
          onOpenChange={winDialog.setIsOpen}
          message="Congratulations! You found all the words!"
          onNewGame={handleNewGame}
        />
      </div>
    </div>
  );
}
