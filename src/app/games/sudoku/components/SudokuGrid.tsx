'use client';

import { Grid, CellPosition, CandidatesGrid } from '../types';
import { cn } from '@/lib/utils';

interface SudokuGridProps {
  grid: Grid;
  initialGrid: Grid;
  selectedCell: CellPosition | null;
  onCellSelect: (position: CellPosition) => void;
  onCellChange: (row: number, col: number, value: number | null) => void;
  incorrectCells?: CellPosition[];
  candidates?: CandidatesGrid;
}

export default function SudokuGrid({
  grid,
  initialGrid,
  selectedCell,
  onCellSelect,
  onCellChange,
  incorrectCells = [],
  candidates,
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

  const getCellCandidates = (row: number, col: number): Set<number> => {
    if (!candidates || !candidates[row] || !candidates[row][col]) {
      return new Set();
    }
    return candidates[row][col];
  };

  return (
    <div className="inline-block bg-black dark:bg-white p-3 shadow-lg">
      <div className="grid grid-cols-9 gap-0">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isInitial = isCellInitial(rowIndex, colIndex);
            const isSelected = isCellSelected(rowIndex, colIndex);
            const isHighlighted = isCellHighlighted(rowIndex, colIndex);
            const isIncorrect = isCellIncorrect(rowIndex, colIndex);
            const cellCandidates = getCellCandidates(rowIndex, colIndex);
            const hasCandidates = cellCandidates.size > 0 && cell === null;

            // Border styling for 3x3 boxes
            const borderTop = rowIndex % 3 === 0 ? 'border-t-[1.5px]' : 'border-t';
            const borderLeft = colIndex % 3 === 0 ? 'border-l-[1.5px]' : 'border-l';
            const borderRight = colIndex === 8 ? 'border-r-[1.5px]' : '';
            const borderBottom = rowIndex === 8 ? 'border-b-[1.5px]' : '';

            // Alternating background pattern (beige/grey)
            const isAlternateCell = (rowIndex + colIndex) % 2 === 0;
            
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={cn(
                  'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center text-xl sm:text-2xl font-medium transition-colors relative',
                  'border-black dark:border-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:z-10',
                  borderTop,
                  borderLeft,
                  borderRight,
                  borderBottom,
                  isSelected && 'bg-orange-300 dark:bg-orange-600',
                  !isSelected && isHighlighted && 'bg-gray-100 dark:bg-gray-800',
                  !isSelected && !isHighlighted && isAlternateCell && 'bg-amber-50 dark:bg-amber-950',
                  !isSelected && !isHighlighted && !isAlternateCell && 'bg-gray-100 dark:bg-gray-900',
                  isInitial && 'text-black dark:text-white font-bold',
                  !isInitial && cell !== null && 'text-black dark:text-white',
                  !isInitial && !isSelected && 'hover:bg-gray-200 dark:hover:bg-gray-800',
                  isIncorrect && 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                )}
                disabled={isInitial}
              >
                {cell !== null ? (
                  <span>{cell}</span>
                ) : hasCandidates ? (
                  <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <span
                        key={num}
                        className={cn(
                          'text-[0.5rem] sm:text-[0.6rem] md:text-[0.8rem] leading-none flex items-center justify-center',
                          cellCandidates.has(num)
                            ? 'text-black dark:text-white'
                            : 'text-transparent'
                        )}
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                ) : (
                  ''
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
