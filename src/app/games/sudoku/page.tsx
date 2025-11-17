'use client';

import { useState, useEffect } from 'react';
import { Grid, Difficulty, CellPosition } from './types';
import { generatePuzzle, checkSolution, copyGrid } from './logic/sudokuLogic';
import SudokuGrid from './components/SudokuGrid';
import SudokuControls from './components/SudokuControls';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [initialGrid, setInitialGrid] = useState<Grid>([]);
  const [currentGrid, setCurrentGrid] = useState<Grid>([]);
  const [solution, setSolution] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [incorrectCells, setIncorrectCells] = useState<CellPosition[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Dialog states
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [showCheckDialog, setShowCheckDialog] = useState(false);
  const [checkMessage, setCheckMessage] = useState('');
  const [checkType, setCheckType] = useState<'success' | 'error' | 'info'>('info');

  // Initialize game on mount
  useEffect(() => {
    initializeGame(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeGame = (diff: Difficulty) => {
    setIsGenerating(true);
    setIncorrectCells([]);
    setSelectedCell(null);

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const { puzzle, solution: sol } = generatePuzzle(diff);
      setInitialGrid(puzzle);
      setCurrentGrid(copyGrid(puzzle));
      setSolution(sol);
      setIsGenerating(false);
    }, 100);
  };

  const handleNewGame = () => {
    initializeGame(difficulty);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  const handleCellChange = (row: number, col: number, value: number | null) => {
    const newGrid = copyGrid(currentGrid);
    newGrid[row][col] = value;
    setCurrentGrid(newGrid);
    setIncorrectCells([]); // Clear incorrect cells when user makes changes
  };

  const handleCheckSolution = () => {
    const result = checkSolution(currentGrid, solution);

    if (result.isCorrect) {
      setShowWinDialog(true);
      setIncorrectCells([]);
    } else if (!result.isComplete) {
      setCheckMessage('The puzzle is not complete yet. Keep going!');
      setCheckType('info');
      setShowCheckDialog(true);
      setIncorrectCells([]);
    } else {
      setCheckMessage(`You have ${result.incorrectCells.length} incorrect ${result.incorrectCells.length === 1 ? 'cell' : 'cells'}. They are highlighted in red.`);
      setCheckType('error');
      setShowCheckDialog(true);
      setIncorrectCells(result.incorrectCells);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;

      // Arrow keys navigation
      if (e.key === 'ArrowUp' && row > 0) {
        setSelectedCell({ row: row - 1, col });
        e.preventDefault();
      } else if (e.key === 'ArrowDown' && row < 8) {
        setSelectedCell({ row: row + 1, col });
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' && col > 0) {
        setSelectedCell({ row, col: col - 1 });
        e.preventDefault();
      } else if (e.key === 'ArrowRight' && col < 8) {
        setSelectedCell({ row, col: col + 1 });
        e.preventDefault();
      }
      // Number keys
      else if (e.key >= '1' && e.key <= '9') {
        if (initialGrid[row]?.[col] === null) {
          handleCellChange(row, col, parseInt(e.key));
        }
      }
      // Backspace or Delete to clear
      else if (e.key === 'Backspace' || e.key === 'Delete') {
        if (initialGrid[row]?.[col] === null) {
          handleCellChange(row, col, null);
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, initialGrid, currentGrid]);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white mb-3">
            Sudoku
          </h1>
          <p className="text-base text-gray-700 dark:text-gray-300">
            Fill the grid so each row, column, and 3×3 box contains the numbers 1-9
          </p>
        </div>

        {/* Main Game Area */}
        <div className="flex flex-col items-center gap-10">
          {/* Grid */}
          <div className="flex-shrink-0">
            {currentGrid.length > 0 && (
              <SudokuGrid
                grid={currentGrid}
                initialGrid={initialGrid}
                selectedCell={selectedCell}
                onCellSelect={setSelectedCell}
                onCellChange={handleCellChange}
                incorrectCells={incorrectCells}
              />
            )}
          </div>

          {/* Controls */}
          <div className="w-full max-w-md">
            <SudokuControls
              difficulty={difficulty}
              onDifficultyChange={handleDifficultyChange}
              onNewGame={handleNewGame}
              onCheckSolution={handleCheckSolution}
              isGenerating={isGenerating}
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

      {/* Check Solution Dialog */}
      <Dialog open={showCheckDialog} onOpenChange={setShowCheckDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-black border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-black dark:bg-white rounded-full p-3">
                {checkType === 'error' ? (
                  <AlertCircle className="h-12 w-12 text-white dark:text-black" />
                ) : checkType === 'success' ? (
                  <CheckCircle2 className="h-12 w-12 text-white dark:text-black" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-white dark:text-black" />
                )}
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-serif text-black dark:text-white">
              {checkType === 'error' ? 'Not Quite!' : 'Keep Going!'}
            </DialogTitle>
            <DialogDescription className="text-center text-base text-gray-700 dark:text-gray-300">
              {checkMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
