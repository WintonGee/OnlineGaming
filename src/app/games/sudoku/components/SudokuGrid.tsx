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
      <div className="inline-block bg-black dark:bg-white p-3 shadow-lg">
        <div className="grid grid-cols-9 gap-0">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isInitial = isCellInitial(rowIndex, colIndex);
              const isSelected = isCellSelected(rowIndex, colIndex);
              const isHighlighted = isCellHighlighted(rowIndex, colIndex);
              const isIncorrect = isCellIncorrect(rowIndex, colIndex);

              // Border styling for 3x3 boxes
              const borderTop = rowIndex % 3 === 0 ? 'border-t-[3px]' : 'border-t';
              const borderLeft = colIndex % 3 === 0 ? 'border-l-[3px]' : 'border-l';
              const borderRight = colIndex === 8 ? 'border-r-[3px]' : '';
              const borderBottom = rowIndex === 8 ? 'border-b-[3px]' : '';

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={cn(
                    'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center text-lg sm:text-xl font-medium transition-colors',
                    'border-black dark:border-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:z-10',
                    borderTop,
                    borderLeft,
                    borderRight,
                    borderBottom,
                    isSelected && 'bg-gray-300 dark:bg-gray-700',
                    !isSelected && isHighlighted && 'bg-gray-100 dark:bg-gray-800',
                    !isSelected && !isHighlighted && 'bg-white dark:bg-black',
                    isInitial && 'text-black dark:text-white font-bold',
                    !isInitial && cell !== null && 'text-black dark:text-white',
                    !isInitial && !isSelected && 'hover:bg-gray-50 dark:hover:bg-gray-900',
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
                'h-12 sm:h-14 font-medium text-lg sm:text-xl transition-colors',
                'bg-white dark:bg-black border-2 border-black dark:border-white',
                'hover:bg-gray-100 dark:hover:bg-gray-900',
                'disabled:opacity-30 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-gray-500',
                'text-black dark:text-white'
              )}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={!selectedCell || isCellInitial(selectedCell?.row ?? 0, selectedCell?.col ?? 0)}
            className={cn(
              'h-12 sm:h-14 font-medium text-base sm:text-lg transition-colors col-span-5',
              'bg-white dark:bg-black border-2 border-black dark:border-white',
              'hover:bg-gray-100 dark:hover:bg-gray-900',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'focus:outline-none focus:ring-2 focus:ring-gray-500',
              'text-black dark:text-white'
            )}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
