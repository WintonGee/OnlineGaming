"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  Difficulty,
  CellPosition,
  InputMode,
  CandidatesGrid,
} from "./types";
import { generatePuzzle, checkSolution, copyGrid } from "./logic/sudokuLogic";
import SudokuGrid from "./components/SudokuGrid";
import SudokuControls from "./components/SudokuControls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper function to create an empty candidates grid
function createEmptyCandidatesGrid(): CandidatesGrid {
  return Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => new Set<number>())
    );
}

const computeIncorrectCells = (
  grid: Grid,
  solutionGrid: Grid
): CellPosition[] => {
  if (!grid.length || !solutionGrid.length) {
    return [];
  }

  const incorrect: CellPosition[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const current = grid[row]?.[col];
      const correct = solutionGrid[row]?.[col];

      if (current !== null && correct !== null && current !== correct) {
        incorrect.push({ row, col });
      }
    }
  }

  return incorrect;
};

const DIFFICULTY_OPTIONS: Difficulty[] = ["Easy", "Medium", "Hard"];

interface HistoryState {
  grid: Grid;
  candidates: CandidatesGrid;
}

export default function SudokuPage() {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("Medium");
  const [activeDifficulty, setActiveDifficulty] =
    useState<Difficulty>("Medium");
  const [initialGrid, setInitialGrid] = useState<Grid>([]);
  const [currentGrid, setCurrentGrid] = useState<Grid>([]);
  const [solution, setSolution] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [incorrectCells, setIncorrectCells] = useState<CellPosition[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("Normal");
  const [candidates, setCandidates] = useState<CandidatesGrid>(
    createEmptyCandidatesGrid()
  );
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [autoCandidateMode, setAutoCandidateMode] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Dialog states
  const [showWinDialog, setShowWinDialog] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    initializeGame(selectedDifficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update candidates when auto candidate mode is toggled
  useEffect(() => {
    if (autoCandidateMode && currentGrid.length > 0) {
      updateAllCandidates(currentGrid);
    } else if (!autoCandidateMode) {
      // Clear all candidates when auto mode is disabled
      setCandidates(createEmptyCandidatesGrid());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCandidateMode]);

  // Update candidates when grid changes (only if auto candidate mode is enabled)
  useEffect(() => {
    if (autoCandidateMode && currentGrid.length > 0) {
      updateAllCandidates(currentGrid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGrid]);

  const initializeGame = (diff: Difficulty) => {
    setIsGenerating(true);
    setIncorrectCells([]);
    setSelectedCell(null);
    setCandidates(createEmptyCandidatesGrid());
    setHasCompleted(false);
    setShowWinDialog(false);
    setActiveDifficulty(diff);

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const { puzzle, solution: sol } = generatePuzzle(diff);
      setInitialGrid(puzzle);
      setCurrentGrid(copyGrid(puzzle));
      setSolution(sol);
      setIsGenerating(false);
      // The useEffect will handle updating candidates if auto candidate mode is enabled
    }, 100);
  };

  const handleNewGame = () => {
    initializeGame(selectedDifficulty);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setSelectedDifficulty(newDifficulty);
  };

  const saveToHistory = () => {
    const newHistory = [
      ...history,
      {
        grid: copyGrid(currentGrid),
        candidates: candidates.map((r) => r.map((c) => new Set(c))),
      },
    ];
    // Keep only last 50 moves
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    setHistory(newHistory);
  };

  // Calculate valid candidates for a specific cell
  const calculateValidCandidates = (
    row: number,
    col: number,
    grid: Grid
  ): Set<number> => {
    const validCandidates = new Set<number>();

    // Skip if cell already has a value
    if (grid[row][col] !== null) {
      return validCandidates;
    }

    for (let num = 1; num <= 9; num++) {
      let isValid = true;

      // Check row
      for (let c = 0; c < 9; c++) {
        if (grid[row][c] === num) {
          isValid = false;
          break;
        }
      }

      // Check column
      if (isValid) {
        for (let r = 0; r < 9; r++) {
          if (grid[r][col] === num) {
            isValid = false;
            break;
          }
        }
      }

      // Check 3x3 box
      if (isValid) {
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
          for (let c = boxCol; c < boxCol + 3; c++) {
            if (grid[r][c] === num) {
              isValid = false;
              break;
            }
          }
          if (!isValid) break;
        }
      }

      if (isValid) {
        validCandidates.add(num);
      }
    }

    return validCandidates;
  };

  // Update all candidates based on auto candidate mode
  const updateAllCandidates = (grid: Grid) => {
    const newCandidates = createEmptyCandidatesGrid();

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        // Only update candidates for empty cells that are not initial
        if (grid[row][col] === null && initialGrid[row][col] === null) {
          newCandidates[row][col] = calculateValidCandidates(row, col, grid);
        }
        // Otherwise, candidates remain empty (default)
      }
    }

    setCandidates(newCandidates);
  };

  const handleCellChange = (row: number, col: number, value: number | null) => {
    saveToHistory();

    const newGrid = copyGrid(currentGrid);
    newGrid[row][col] = value;
    setCurrentGrid(newGrid);

    if (solution.length) {
      setIncorrectCells(computeIncorrectCells(newGrid, solution));
    } else {
      setIncorrectCells([]);
    }

    // If auto candidate mode is off, clear candidates for this cell when a value is set
    if (!autoCandidateMode) {
      const newCandidates = candidates.map((r) => r.map((c) => new Set(c)));
      if (value !== null) {
        newCandidates[row][col] = new Set<number>();
      }
      setCandidates(newCandidates);
    }
    // If auto candidate mode is on, the useEffect will handle updating all candidates
  };

  const handleCandidateToggle = (row: number, col: number, value: number) => {
    // Don't allow candidates on initial cells or cells with values
    if (initialGrid[row][col] !== null || currentGrid[row][col] !== null) {
      return;
    }

    // In auto candidate mode, don't allow manual candidate toggling
    if (autoCandidateMode) {
      return;
    }

    saveToHistory();

    const newCandidates = candidates.map((r) => r.map((c) => new Set(c)));
    const cellCandidates = newCandidates[row][col];

    if (cellCandidates.has(value)) {
      cellCandidates.delete(value);
    } else {
      cellCandidates.add(value);
    }

    setCandidates(newCandidates);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setCurrentGrid(previousState.grid);
      setCandidates(previousState.candidates);
      setHistory(history.slice(0, -1));

      if (solution.length) {
        setIncorrectCells(computeIncorrectCells(previousState.grid, solution));
      } else {
        setIncorrectCells([]);
      }
    }
  };

  const handleClearCell = (row: number, col: number) => {
    if (initialGrid[row][col] !== null) {
      return;
    }

    const cellValue = currentGrid[row]?.[col] ?? null;
    const cellCandidates = candidates[row]?.[col] ?? new Set<number>();
    const hasValue = cellValue !== null;
    const hasCandidates = cellCandidates.size > 0;

    if (!hasValue && !hasCandidates) {
      return;
    }

    saveToHistory();

    const newGrid = copyGrid(currentGrid);
    newGrid[row][col] = null;
    setCurrentGrid(newGrid);

    if (solution.length) {
      setIncorrectCells(computeIncorrectCells(newGrid, solution));
    } else {
      setIncorrectCells([]);
    }

    if (!autoCandidateMode) {
      const newCandidates = candidates.map((r) => r.map((c) => new Set(c)));
      newCandidates[row][col] = new Set<number>();
      setCandidates(newCandidates);
    }
  };

  // Auto-check completion once the grid is full
  useEffect(() => {
    if (hasCompleted || !currentGrid.length || !solution.length) {
      return;
    }

    const result = checkSolution(currentGrid, solution);

    if (!result.isComplete) {
      return;
    }

    if (result.isCorrect) {
      setShowWinDialog(true);
      setHasCompleted(true);
      setIncorrectCells([]);
    } else {
      setIncorrectCells(result.incorrectCells);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGrid, solution, hasCompleted]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;

      // Arrow keys navigation
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
      }
      // Number keys
      else if (e.key >= "1" && e.key <= "9") {
        if (initialGrid[row]?.[col] === null) {
          if (inputMode === "Candidate") {
            handleCandidateToggle(row, col, parseInt(e.key));
          } else {
            handleCellChange(row, col, parseInt(e.key));
          }
        }
      }
      // Backspace or Delete to clear
      else if (e.key === "Backspace" || e.key === "Delete") {
        if (initialGrid[row]?.[col] === null) {
          handleClearCell(row, col);
        }
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, initialGrid, currentGrid, inputMode, candidates]);

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

        {/* Main Game Area */}
        <div
          className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start gap-10 lg:gap-16"
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

          {/* Controls */}
          <div className="w-full max-w-md lg:self-start lg:pl-6">
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
              canUndo={history.length > 0}
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
    </div>
  );
}
