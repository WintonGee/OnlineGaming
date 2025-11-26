import { memo, useMemo } from "react";
import { Board, CellPosition } from "../types";
import {
  getCellClassName,
  getCellContent,
  getFontSizeClass,
} from "../utils/styleUtils";
import { useResponsiveCellSize } from "../hooks/useResponsiveDimensions";

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
  const cols = board[0]?.length || 0;

  // Create a set of incorrect flag positions for quick lookup
  const incorrectFlagSet = useMemo(
    () => new Set(incorrectFlags.map((pos) => `${pos.row},${pos.col}`)),
    [incorrectFlags]
  );

  // Use responsive cell size based on viewport width
  const cellSize = useResponsiveCellSize(cols);
  const fontSizeClass = getFontSizeClass(cellSize);

  return (
    <div className="flex justify-center items-center w-full p-1">
      <div
        className="ms-board-container"
        style={
          {
            "--cell-size": `${cellSize}px`,
          } as React.CSSProperties
        }
      >
        <div
          className="ms-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
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
                  className={`ms-cell ${fontSizeClass} ${getCellClassName(
                    cell,
                    isIncorrectFlag
                  )}`}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onCellRightClick(rowIndex, colIndex);
                  }}
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
