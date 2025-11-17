'use client';

import { Grid, CellPosition } from '../types';
import { cn } from '@/lib/utils';

interface SudokuGridProps {
  grid: Grid;
  initialGrid: Grid;
  selectedCell: CellPosition | null;
  onCellSelect: (position: CellPosition) => void;
  onCellChange: (row: number, col: number, value: number | null) => void;
  incorrectCells?: CellPosition[];
}

export default function SudokuGrid({
  grid,
  initialGrid,
  selectedCell,
  onCellSelect,
  onCellChange,
  incorrectCells = [],
}: SudokuGridProps) {
  const isCellInitial = (row: number, col: number): boolean => {
    return initialGrid[row][col] !== null;
  };

  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCell?.row === row && selectedCell?.col === col;
  };

  const isCellHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false;

    // Same row or column
    if (selectedCell.row === row || selectedCell.col === col) return true;

    // Same 3x3 box
    const boxRow = Math.floor(selectedCell.row / 3);
    const boxCol = Math.floor(selectedCell.col / 3);
    const cellBoxRow = Math.floor(row / 3);
    const cellBoxCol = Math.floor(col / 3);

    return boxRow === cellBoxRow && boxCol === cellBoxCol;
  };

  const isCellIncorrect = (row: number, col: number): boolean => {
    return incorrectCells.some(cell => cell.row === row && cell.col === col);
  };

  const handleCellClick = (row: number, col: number) => {
    onCellSelect({ row, col });
  };

  const handleNumberSelect = (num: number) => {
    if (selectedCell && !isCellInitial(selectedCell.row, selectedCell.col)) {
      onCellChange(selectedCell.row, selectedCell.col, num);
    }
  };

  const handleClear = () => {
    if (selectedCell && !isCellInitial(selectedCell.row, selectedCell.col)) {
      onCellChange(selectedCell.row, selectedCell.col, null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Sudoku Grid */}
      <div className="inline-block bg-gray-900 p-2 rounded-lg shadow-2xl">
        <div className="grid grid-cols-9 gap-0 bg-gray-700">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isInitial = isCellInitial(rowIndex, colIndex);
              const isSelected = isCellSelected(rowIndex, colIndex);
              const isHighlighted = isCellHighlighted(rowIndex, colIndex);
              const isIncorrect = isCellIncorrect(rowIndex, colIndex);

              // Border styling for 3x3 boxes
              const borderTop = rowIndex % 3 === 0 ? 'border-t-2' : 'border-t';
              const borderLeft = colIndex % 3 === 0 ? 'border-l-2' : 'border-l';
              const borderRight = colIndex === 8 ? 'border-r-2' : '';
              const borderBottom = rowIndex === 8 ? 'border-b-2' : '';

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={cn(
                    'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center text-lg sm:text-xl font-semibold transition-colors',
                    'border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10',
                    borderTop,
                    borderLeft,
                    borderRight,
                    borderBottom,
                    isSelected && 'bg-blue-200 dark:bg-blue-900',
                    !isSelected && isHighlighted && 'bg-blue-50 dark:bg-blue-950',
                    !isSelected && !isHighlighted && 'bg-white dark:bg-gray-800',
                    isInitial && 'text-gray-900 dark:text-gray-100 font-bold',
                    !isInitial && cell !== null && 'text-blue-600 dark:text-blue-400',
                    !isInitial && !isSelected && 'hover:bg-gray-100 dark:hover:bg-gray-700',
                    isIncorrect && 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                  )}
                  disabled={isInitial}
                >
                  {cell || ''}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Number Palette */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <div className="grid grid-cols-5 gap-2 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberSelect(num)}
              disabled={!selectedCell || isCellInitial(selectedCell.row, selectedCell.col)}
              className={cn(
                'h-12 sm:h-14 rounded-lg font-semibold text-lg sm:text-xl transition-colors',
                'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600',
                'hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={!selectedCell || isCellInitial(selectedCell?.row ?? 0, selectedCell?.col ?? 0)}
            className={cn(
              'h-12 sm:h-14 rounded-lg font-semibold text-lg sm:text-xl transition-colors col-span-5',
              'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600',
              'hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-400',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              'text-red-600 dark:text-red-400'
            )}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
