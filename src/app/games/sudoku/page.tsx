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
import {
  Trophy,
  Info,
  Target,
  Gamepad2,
  PenLine,
  Sparkles,
  Lightbulb,
  Grid3x3,
  MousePointer,
  Keyboard,
  ArrowUp,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
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
  const [showInstructions, setShowInstructions] = useState(false);

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
      // Handle Ctrl+Z (Windows/Linux) or Cmd+Z (Mac) for undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (canUndo) {
          handleUndo();
          e.preventDefault();
        }
        return;
      }

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
    canUndo,
    handleUndo,
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
      className="min-h-screen bg-white dark:bg-black py-3 sm:py-8 lg:py-12 px-4"
      data-game-page="sudoku"
    >
      <div
        className="mx-auto w-full max-w-6xl px-0 sm:px-4 lg:px-12"
        data-game-section="sudoku"
      >
        {/* Header */}
        <div className="mb-3 sm:mb-8 lg:mb-12 flex flex-col gap-2 sm:gap-4 lg:gap-6">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black dark:text-white mb-1 sm:mb-3">
              Sudoku
            </h1>
          </div>
          {/* Difficulty Toolbar */}
          <div className="flex flex-col gap-2 sm:gap-4">
            <div className="flex flex-col lg:flex-row w-full items-center gap-2 lg:gap-4 justify-between">
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
                  onHowToPlay={() => setShowInstructions(true)}
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

      {/* Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-3xl bg-white dark:bg-black border-gray-300 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-bold text-black dark:text-white flex items-center gap-3">
              <div className="bg-black dark:bg-white rounded-lg p-2">
                <Info className="h-6 w-6 text-white dark:text-black" />
              </div>
              How to Play Sudoku
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-400 pt-2">
              Master the classic puzzle game with this comprehensive guide
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 py-4">
            {/* Objective */}
            <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2 mt-0.5">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    Game Objective
                  </h3>
                  <p className="leading-relaxed">
                    Fill the 9×9 grid so that every row, column, and 3×3 box
                    contains the digits 1-9 exactly once, without any
                    repetition. Some cells are pre-filled to give you a starting
                    point.
                  </p>
                </div>
              </div>
            </section>

            {/* Basic Controls */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2">
                  <Gamepad2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Basic Controls
                </h3>
              </div>
              <div className="grid gap-3 ml-11">
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                  <MousePointer className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      Selecting Cells
                    </p>
                    <p className="text-sm mt-0.5">
                      Click or tap any empty cell to select it. The selected
                      cell will be highlighted.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                  <Grid3x3 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      Entering Numbers
                    </p>
                    <p className="text-sm mt-0.5">
                      Use the number pad below the grid or type 1-9 directly on
                      your keyboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                  <Keyboard className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      Keyboard Navigation
                    </p>
                    <p className="text-sm mt-0.5">
                      Use{" "}
                      <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                        ←
                      </kbd>
                      <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                        ↑
                      </kbd>
                      <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                        →
                      </kbd>
                      <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                        ↓
                      </kbd>
                      arrow keys to move between cells
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                  <RotateCcw className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      Undo & Clear
                    </p>
                    <p className="text-sm mt-0.5">
                      Press{" "}
                      <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                        Backspace
                      </kbd>{" "}
                      or
                      <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                        Delete
                      </kbd>{" "}
                      to clear a cell. Use{" "}
                      <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                        Ctrl+Z
                      </kbd>{" "}
                      (
                      <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                        ⌘Z
                      </kbd>{" "}
                      on Mac) to undo moves.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Input Modes */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2">
                  <PenLine className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Input Modes
                </h3>
              </div>
              <div className="grid gap-3 ml-11">
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                  <p className="font-medium text-black dark:text-white mb-1">
                    Normal Mode
                  </p>
                  <p className="text-sm">
                    Enter your final answer for a cell. The number will appear
                    large and centered in the cell.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                  <p className="font-medium text-black dark:text-white mb-1">
                    Candidate Mode
                  </p>
                  <p className="text-sm">
                    Add small pencil marks to track possible numbers for a cell.
                    This is essential for advanced solving techniques. Toggle
                    between modes using the buttons below the grid.
                  </p>
                </div>
              </div>
            </section>

            {/* Advanced Features */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2">
                  <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Advanced Features
                </h3>
              </div>
              <div className="space-y-2 ml-11 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-black dark:text-white">
                      Auto Candidate Mode:
                    </strong>{" "}
                    Automatically fills in all possible candidates for empty
                    cells based on Sudoku rules. Toggle this feature using the
                    checkbox in the toolbar.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-black dark:text-white">
                      Check Cell:
                    </strong>{" "}
                    Verify if the currently selected cell has the correct value.
                    Incorrect cells will be highlighted in red.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-black dark:text-white">
                      Check Puzzle:
                    </strong>{" "}
                    Check all cells at once to see if any of your entries are
                    incorrect.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-black dark:text-white">
                      Reveal Cell:
                    </strong>{" "}
                    Shows the correct value for the selected cell when
                    you&apos;re stuck.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-black dark:text-white">
                      Reveal Puzzle:
                    </strong>{" "}
                    Fills in the entire solution. Useful if you want to see the
                    answer.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-black dark:text-white">
                      Reset Puzzle:
                    </strong>{" "}
                    Clears all your entries and notes to start fresh with the
                    same puzzle.
                  </p>
                </div>
              </div>
            </section>

            {/* Strategy Tips */}
            <section className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2 mt-0.5">
                  <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                    Solving Strategies & Tips
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                        •
                      </span>
                      <span>
                        <strong className="text-black dark:text-white">
                          Start with the obvious:
                        </strong>{" "}
                        Look for rows, columns, or 3×3 boxes that already have
                        many numbers filled in. These are easier to complete.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                        •
                      </span>
                      <span>
                        <strong className="text-black dark:text-white">
                          Use candidates wisely:
                        </strong>{" "}
                        When you&apos;re unsure, switch to Candidate Mode and
                        mark all possible numbers for a cell. This helps
                        visualize your options.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                        •
                      </span>
                      <span>
                        <strong className="text-black dark:text-white">
                          Find naked singles:
                        </strong>{" "}
                        Look for cells that can only contain one possible number
                        based on the numbers already in its row, column, and
                        box.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                        •
                      </span>
                      <span>
                        <strong className="text-black dark:text-white">
                          Hidden singles:
                        </strong>{" "}
                        Sometimes a number can only go in one cell within a row,
                        column, or box, even if that cell has other candidates.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                        •
                      </span>
                      <span>
                        <strong className="text-black dark:text-white">
                          Work systematically:
                        </strong>{" "}
                        Focus on one section at a time rather than jumping
                        around randomly. This helps you spot patterns more
                        easily.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                        •
                      </span>
                      <span>
                        <strong className="text-black dark:text-white">
                          Use the help menu:
                        </strong>{" "}
                        Don&apos;t hesitate to use &quot;Check Cell&quot; or
                        &quot;Check Puzzle&quot; if you&apos;re stuck. Learning
                        from mistakes is part of the process!
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Difficulty Levels */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2">
                  <ArrowUp className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Difficulty Levels
                </h3>
              </div>
              <div className="grid gap-2 ml-11 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p>
                    <strong className="text-black dark:text-white">
                      Easy:
                    </strong>{" "}
                    Perfect for beginners. Fewer empty cells and straightforward
                    logic.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p>
                    <strong className="text-black dark:text-white">
                      Medium:
                    </strong>{" "}
                    Requires some strategy and candidate tracking.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p>
                    <strong className="text-black dark:text-white">
                      Hard:
                    </strong>{" "}
                    Challenging puzzles that need advanced techniques and
                    patience.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <DialogFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <Button
              onClick={() => setShowInstructions(false)}
              className="w-full sm:w-auto bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
            >
              Got it! Let&apos;s Play
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
