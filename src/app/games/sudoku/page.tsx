"use client";

import { useCallback, useEffect, useState } from "react";
import { Difficulty } from "./types";
import SudokuGrid from "./components/SudokuGrid";
import SudokuControls from "./components/SudokuControls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSudokuGame } from "./hooks/useSudokuGame";
import SudokuHintMenu from "./components/SudokuHintMenu";
import SudokuHelperToast from "./components/SudokuHelperToast";
import { HelperActionResult } from "./types";

const DIFFICULTY_OPTIONS: Difficulty[] = ["Easy", "Medium", "Hard"];

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
  const [helperResult, setHelperResult] = useState<HelperActionResult | null>(
    null
  );
  const [pendingConfirm, setPendingConfirm] = useState<
    "reveal" | "reset" | null
  >(null);
  const [helperToastOpen, setHelperToastOpen] = useState(false);

  const runHelperAction = (action: () => HelperActionResult) => {
    const result = action();
    setHelperResult(result);
    setHelperToastOpen(true);
  };

  const handleToastClose = useCallback(() => {
    setHelperToastOpen(false);
    setHelperResult(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;

      if (e.key === "ArrowUp" && row > 0) {
        setSelectedCell({ row: row - 1, col });
        e.preventDefault();
      } else if (e.key === "ArrowDown" && row < 8) {
        setSelectedCell({ row: row + 1, col });
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && col > 0) {
        setSelectedCell({ row, col: col - 1 });
        e.preventDefault();
      } else if (e.key === "ArrowRight" && col < 8) {
        setSelectedCell({ row, col: col + 1 });
        e.preventDefault();
      } else if (e.key >= "1" && e.key <= "9") {
        if (initialGrid[row]?.[col] === null) {
          const numericValue = parseInt(e.key, 10);
          if (inputMode === "Candidate") {
            handleCandidateToggle(row, col, numericValue);
          } else {
            handleCellChange(row, col, numericValue);
          }
        }
      } else if (e.key === "Backspace" || e.key === "Delete") {
        if (initialGrid[row]?.[col] === null) {
          handleClearCell(row, col);
        }
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedCell,
    initialGrid,
    inputMode,
    handleCandidateToggle,
    handleCellChange,
    handleClearCell,
    setSelectedCell,
  ]);

  const isSelectedCellEditable =
    selectedCell && initialGrid[selectedCell.row]?.[selectedCell.col] === null;
  const canRevealCell = Boolean(
    isSelectedCellEditable && currentGrid.length > 0 && hasSolution
  );
  const isMenuDisabled = isGenerating || currentGrid.length === 0;
  const disablePuzzleWideActions = !hasSolution || currentGrid.length === 0;
  const confirmContent =
    pendingConfirm === "reveal"
      ? {
          title: "Reveal the entire puzzle?",
          description:
            "This will fill in every cell with the solution. You can still undo, but your current progress will be overwritten.",
          actionLabel: "Reveal Puzzle",
        }
      : {
          title: "Reset this puzzle?",
          description:
            "This clears all of your entries and notes so you can start over from the original puzzle.",
          actionLabel: "Reset Puzzle",
        };

  const handleConfirmAction = () => {
    if (!pendingConfirm) return;

    if (pendingConfirm === "reveal") {
      runHelperAction(handleRevealPuzzle);
    } else {
      runHelperAction(handleResetPuzzle);
    }
    setPendingConfirm(null);
  };

  return (
    <div
      className="min-h-screen bg-white dark:bg-black py-12 px-4"
      data-game-page="sudoku"
    >
      <div
        className="mx-auto w-full max-w-6xl px-0 sm:px-4 lg:px-12"
        data-game-section="sudoku"
      >
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white mb-3">
              Sudoku
            </h1>
          </div>
          {/* Difficulty Toolbar */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row w-full items-center gap-4 justify-between">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="flex items-center gap-2">
                  {DIFFICULTY_OPTIONS.map((level) => (
                    <button
                      key={level}
                      onClick={() => handleDifficultyChange(level)}
                      className={cn(
                        "rounded-full border px-6 py-2 text-sm font-semibold transition-colors",
                        level === selectedDifficulty
                          ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                          : "bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleNewGame}
                  disabled={isGenerating}
                  className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide ml-2 lg:ml-4 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 transition-all"
                >
                  {isGenerating ? "Preparing..." : "New Puzzle"}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <SudokuHintMenu
                  disabled={isMenuDisabled}
                  disableRevealCell={!canRevealCell}
                  disablePuzzleWideActions={disablePuzzleWideActions}
                  onCheckCell={() => runHelperAction(handleCheckCell)}
                  onCheckPuzzle={() => runHelperAction(handleCheckPuzzle)}
                  onRevealCell={() => runHelperAction(handleRevealCell)}
                  onRevealPuzzle={() => setPendingConfirm("reveal")}
                  onResetPuzzle={() => setPendingConfirm("reset")}
                />
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/40 px-4 py-2">
                  <Checkbox
                    id="auto-candidate-toolbar"
                    checked={autoCandidateMode}
                    onCheckedChange={(checked) =>
                      setAutoCandidateMode(checked === true)
                    }
                  />
                  <Label
                    htmlFor="auto-candidate-toolbar"
                    className="text-sm font-medium text-black dark:text-white cursor-pointer"
                  >
                    Auto Candidate Mode
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div
          className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start gap-6 lg:gap-16 pb-[420px] sm:pb-[450px] lg:pb-0"
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
          <div className="fixed bottom-0 left-0 right-0 lg:static w-full max-w-full lg:max-w-md lg:self-start lg:pl-6 bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700 lg:border-t-0 px-4 pt-4 pb-safe pb-6 lg:p-0 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3)] lg:shadow-none">
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
      <Dialog open={showWinDialog} onOpenChange={setShowWinDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-black border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-black dark:bg-white rounded-full p-3">
                <Trophy className="h-12 w-12 text-white dark:text-black" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-serif text-black dark:text-white">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-center text-base text-gray-700 dark:text-gray-300">
              You solved the puzzle correctly!
              <br />
              <br />
              Click &quot;New Game&quot; to try another puzzle.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog
        open={pendingConfirm !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingConfirm(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-white dark:bg-black border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black dark:text-white">
              {confirmContent.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
              {confirmContent.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setPendingConfirm(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={
                pendingConfirm === "reveal"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : ""
              }
            >
              {confirmContent.actionLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SudokuHelperToast
        result={helperResult}
        open={helperToastOpen}
        onClose={handleToastClose}
      />
    </div>
  );
}
