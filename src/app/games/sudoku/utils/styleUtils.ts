import { cn } from "@/lib/utils";

/**
 * Cell state for className generation
 */
export interface CellState {
  isInitial: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isIncorrect: boolean;
  isSameValue: boolean;
  hasValue: boolean;
  borderTop: string;
  borderLeft: string;
  borderRight: string;
  borderBottom: string;
}

/**
 * Generate className string for a Sudoku grid cell
 * 
 * @param state - The state of the cell
 * @returns Combined className string
 */
export function getCellClassName(state: CellState): string {
  const {
    isInitial,
    isSelected,
    isHighlighted,
    isIncorrect,
    isSameValue,
    hasValue,
    borderTop,
    borderLeft,
    borderRight,
    borderBottom,
  } = state;

  return cn(
    // Base styles
    "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16",
    "flex items-center justify-center",
    "text-lg sm:text-xl md:text-2xl font-medium",
    "transition-colors relative overflow-hidden",
    "border-black dark:border-white",
    "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:z-10",
    "bg-white dark:bg-gray-900",
    
    // Border classes
    borderTop,
    borderLeft,
    borderRight,
    borderBottom,
    
    // Highlighted state (not selected)
    isHighlighted && !isSelected && "!bg-blue-50 dark:!bg-slate-800/80",
    
    // Initial cell styles
    isInitial && "text-black dark:text-white font-bold",
    isInitial && !isSelected && "bg-gray-200 dark:bg-gray-800",
    
    // User-filled cell styles
    !isInitial &&
      hasValue &&
      !isSelected &&
      !isIncorrect &&
      "bg-blue-50/80 dark:bg-blue-900/40 text-black dark:text-white",
    !isInitial && hasValue && !isIncorrect && "text-black dark:text-white",
    
    // Selected state
    isSelected && "!bg-orange-300 dark:!bg-orange-600",
    
    // Empty cell hover
    !isInitial &&
      !hasValue &&
      !isSelected &&
      "hover:bg-gray-100 dark:hover:bg-gray-800",
    !isInitial &&
      !hasValue &&
      !isHighlighted &&
      "text-black dark:text-white",
    
    // Incorrect state
    isIncorrect && "!bg-red-50 dark:!bg-red-900",
    
    // Same value highlighting
    isSameValue &&
      !isIncorrect &&
      "!bg-amber-100 dark:!bg-amber-900/70 text-black dark:text-white"
  );
}

