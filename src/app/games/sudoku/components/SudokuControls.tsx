'use client';

import { CellPosition, Grid, InputMode } from '../types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SudokuControlsProps {
  isGenerating?: boolean;
  selectedCell: CellPosition | null;
  initialGrid: Grid;
  onCellChange: (row: number, col: number, value: number | null) => void;
  inputMode: InputMode;
  onInputModeChange: (mode: InputMode) => void;
  onCandidateToggle: (row: number, col: number, value: number) => void;
  onClearCandidates: (row: number, col: number) => void;
  onUndo: () => void;
  canUndo: boolean;
}

export default function SudokuControls({
  isGenerating = false,
  selectedCell,
  initialGrid,
  onCellChange,
  inputMode,
  onInputModeChange,
  onCandidateToggle,
  onClearCandidates,
  onUndo,
  canUndo,
}: SudokuControlsProps) {

  const isCellInitial = (row: number, col: number): boolean => {
    return initialGrid[row]?.[col] !== null;
  };

  const handleNumberSelect = (num: number) => {
    if (selectedCell && !isCellInitial(selectedCell.row, selectedCell.col)) {
      if (inputMode === 'Candidate') {
        onCandidateToggle(selectedCell.row, selectedCell.col, num);
      } else {
        onCellChange(selectedCell.row, selectedCell.col, num);
      }
    }
  };

  const handleClear = () => {
    if (selectedCell && !isCellInitial(selectedCell.row, selectedCell.col)) {
      if (inputMode === 'Candidate') {
        onClearCandidates(selectedCell.row, selectedCell.col);
      } else {
        onCellChange(selectedCell.row, selectedCell.col, null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <section>
        <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Input Mode
        </Label>
        <div className="mt-3 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden flex bg-white dark:bg-black">
          {(['Normal', 'Candidate'] as InputMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onInputModeChange(mode)}
              className={cn(
                'flex-1 py-3 text-base font-semibold transition-colors focus:outline-none',
                inputMode === mode
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-white text-black hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-800'
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      <section>
        <Label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Number Pad
        </Label>
        <div className="mt-4 grid grid-cols-3 gap-3 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberSelect(num)}
              disabled={
                isGenerating ||
                !selectedCell ||
                isCellInitial(selectedCell.row, selectedCell.col)
              }
              className={cn(
                'aspect-square rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 text-lg sm:text-xl font-semibold text-black dark:text-white shadow-sm transition-colors',
                'hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500',
                'disabled:cursor-not-allowed disabled:opacity-30'
              )}
            >
              {num}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={
            !selectedCell ||
            isCellInitial(selectedCell?.row ?? 0, selectedCell?.col ?? 0)
          }
          className="border border-gray-300 bg-gray-200 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white flex items-center justify-center gap-2 text-base"
        >
          <X className="h-4 w-4" />
          Clear Cell
        </Button>
        <Button
          variant="outline"
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            'border border-gray-300 bg-gray-200 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white',
            !canUndo && 'opacity-50'
          )}
        >
          Undo
        </Button>
      </section>

    </div>
  );
}
