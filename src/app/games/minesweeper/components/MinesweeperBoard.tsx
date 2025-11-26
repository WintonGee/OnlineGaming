import { memo } from "react";
import { Board, CellPosition } from "../types";
import { getCellClassName, getCellContent } from "../utils/styleUtils";

interface MinesweeperBoardProps {
  board: Board;
  incorrectFlags: CellPosition[];
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
}

const MinesweeperBoard = memo(function MinesweeperBoard({
  board,
  incorrectFlags,
  onCellClick,
  onCellRightClick,
}: MinesweeperBoardProps) {
  const height = board.length;
  const width = board[0]?.length || 0;

  // Create a set of incorrect flag positions for quick lookup
  const incorrectFlagSet = new Set(
    incorrectFlags.map((pos) => `${pos.row},${pos.col}`)
  );

  const handleCellClick = (row: number, col: number) => {
    onCellClick(row, col);
  };

  const handleCellRightClick = (
    e: React.MouseEvent,
    row: number,
    col: number
  ) => {
    e.preventDefault();
    onCellRightClick(row, col);
  };

  // Calculate cell size based on board dimensions
  const getCellSize = () => {
    // For mobile, ensure board fits within screen
    if (width <= 9) return "w-8 h-8 sm:w-9 sm:h-9 text-base sm:text-lg";
    if (width <= 16) return "w-7 h-7 sm:w-8 sm:h-8 text-sm sm:text-base";
    return "w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm";
  };

  const cellSizeClass = getCellSize();

  return (
    <div className="flex justify-center items-center w-full overflow-auto p-1">
      <div className="ms-board-container inline-block">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
            gap: 0,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isIncorrectFlag = incorrectFlagSet.has(
                `${rowIndex},${colIndex}`
              );
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`${cellSizeClass} ${getCellClassName(
                    cell,
                    isIncorrectFlag
                  )}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) =>
                    handleCellRightClick(e, rowIndex, colIndex)
                  }
                  aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}`}
                >
                  {getCellContent(cell)}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
});

export default MinesweeperBoard;
