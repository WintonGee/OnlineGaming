"use client";

import SudokuGrid from "./components/SudokuGrid";
import SudokuControls from "./components/SudokuControls";
import InstructionsDialog from "./components/InstructionsDialog";
import ConfirmationDialog from "./components/ConfirmationDialog";
import SudokuHelperToast from "./components/SudokuHelperToast";
import WinDialog from "@/components/games/WinDialog";
import GameHeader from "@/components/games/GameHeader";
import SudokuToolbar from "./components/SudokuToolbar";
import SudokuActionBar from "./components/SudokuActionBar";
import { useSudokuGame } from "./hooks/useSudokuGame";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useSudokuDialogs } from "./hooks/useSudokuDialogs";

export default function SudokuPage() {
  const {
    autoCandidateMode,
    candidates,
    canUndo,
    handleCheckCell,
    handleCheckPuzzle,
    currentGrid,
    handleCandidateToggle,
    handleCellChange,
    handleClearCell,
    handleDifficultyChange,
    handleNewGame,
    handleResetPuzzle,
    handleRevealCell,
    handleRevealPuzzle,
    handleUndo,
    hasSolution,
    incorrectCells,
    initialGrid,
    inputMode,
    isGenerating,
    selectedCell,
    selectedDifficulty,
    setAutoCandidateMode,
    setInputMode,
    setSelectedCell,
    setShowWinDialog,
    showWinDialog,
  } = useSudokuGame();

  const {
    helperResult,
    helperToastOpen,
    runHelperAction,
    handleToastClose,
    pendingConfirm,
    showConfirmDialog,
    hideConfirmDialog,
    showInstructions,
    showInstructionsDialog,
    setShowInstructions,
  } = useSudokuDialogs();

  // Use the keyboard navigation hook
  useKeyboardNavigation({
    selectedCell,
    setSelectedCell,
    initialGrid,
    inputMode,
    onCandidateToggle: handleCandidateToggle,
    onCellChange: handleCellChange,
    onClearCell: handleClearCell,
    canUndo,
    onUndo: handleUndo,
  });

  const handleConfirmAction = () => {
    if (!pendingConfirm) return;

    if (pendingConfirm === "reveal") {
      runHelperAction(handleRevealPuzzle);
    } else {
      runHelperAction(handleResetPuzzle);
    }
    hideConfirmDialog();
  };

  const isSelectedCellEditable =
    selectedCell && initialGrid[selectedCell.row]?.[selectedCell.col] === null;
  const canRevealCell = Boolean(
    isSelectedCellEditable && currentGrid.length > 0 && hasSolution
  );
  const isMenuDisabled = isGenerating || currentGrid.length === 0;
  const disablePuzzleWideActions = !hasSolution || currentGrid.length === 0;

  return (
    <div
      className="min-h-screen bg-white dark:bg-black py-3 sm:py-8 lg:py-12 px-4"
      data-game-page="sudoku"
    >
      <div
        className="mx-auto w-full max-w-6xl px-0 sm:px-4 lg:px-12"
        data-game-section="sudoku"
      >
        {/* Header */}
        <div className="mb-3 sm:mb-8 lg:mb-12 flex flex-col gap-2 sm:gap-4 lg:gap-6">
          <GameHeader title="Sudoku" />

          {/* Difficulty Toolbar */}
          <div className="flex flex-col gap-2 sm:gap-4">
            <div className="flex flex-col lg:flex-row w-full items-center gap-2 lg:gap-4 justify-between">
              <SudokuToolbar
                selectedDifficulty={selectedDifficulty}
                onDifficultyChange={handleDifficultyChange}
                onNewGame={handleNewGame}
                isGenerating={isGenerating}
              />

              <SudokuActionBar
                isMenuDisabled={isMenuDisabled}
                canRevealCell={canRevealCell}
                disablePuzzleWideActions={disablePuzzleWideActions}
                autoCandidateMode={autoCandidateMode}
                onAutoCandidateModeChange={setAutoCandidateMode}
                onHowToPlay={showInstructionsDialog}
                onCheckCell={() => runHelperAction(handleCheckCell)}
                onCheckPuzzle={() => runHelperAction(handleCheckPuzzle)}
                onRevealCell={() => runHelperAction(handleRevealCell)}
                onRevealPuzzle={() => showConfirmDialog("reveal")}
                onResetPuzzle={() => showConfirmDialog("reset")}
              />
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div
          className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-6 lg:gap-16 pb-[230px] sm:pb-[250px] lg:pb-0"
          data-game-layout="sudoku"
        >
          {/* Grid */}
          <div
            className="flex-shrink-0 lg:self-start"
            data-game-board="sudoku"
            style={{ marginLeft: "var(--game-home-offset, 0px)" }}
          >
            {currentGrid.length > 0 && (
              <SudokuGrid
                grid={currentGrid}
                initialGrid={initialGrid}
                selectedCell={selectedCell}
                onCellSelect={setSelectedCell}
                onCellChange={handleCellChange}
                incorrectCells={incorrectCells}
                candidates={candidates}
              />
            )}
          </div>

          {/* Controls - Fixed at bottom on mobile, static on desktop */}
          <div className="fixed bottom-0 left-0 right-0 lg:static w-full max-w-full lg:max-w-md lg:self-start lg:pl-6 bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700 lg:border-t-0 px-3 pt-2.5 pb-safe pb-3 lg:p-0 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3)] lg:shadow-none">
            <SudokuControls
              isGenerating={isGenerating}
              selectedCell={selectedCell}
              initialGrid={initialGrid}
              onCellChange={handleCellChange}
              inputMode={inputMode}
              onInputModeChange={setInputMode}
              onCandidateToggle={handleCandidateToggle}
              onClearCell={handleClearCell}
              onUndo={handleUndo}
              canUndo={canUndo}
            />
          </div>
        </div>
      </div>

      {/* Win Dialog */}
      <WinDialog open={showWinDialog} onOpenChange={setShowWinDialog} />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={pendingConfirm !== null}
        type={pendingConfirm}
        onConfirm={handleConfirmAction}
        onCancel={hideConfirmDialog}
      />

      {/* Helper Toast */}
      <SudokuHelperToast
        result={helperResult}
        open={helperToastOpen}
        onClose={handleToastClose}
      />

      {/* Instructions Dialog */}
      <InstructionsDialog
        open={showInstructions}
        onOpenChange={setShowInstructions}
      />
    </div>
  );
}
