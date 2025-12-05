import { BoardState, Player, LineType, GridSize } from "../types";

/**
 * Check if a line is already drawn
 */
export function isLineDrawn(
  board: BoardState,
  row: number,
  col: number,
  type: LineType
): boolean {
  if (type === "horizontal") {
    return board.horizontalLines[row]?.[col] !== null;
  } else {
    return board.verticalLines[row]?.[col] !== null;
  }
}

/**
 * Check if a line position is valid
 */
export function isValidLinePosition(
  gridSize: GridSize,
  row: number,
  col: number,
  type: LineType
): boolean {
  if (type === "horizontal") {
    return row >= 0 && row <= gridSize && col >= 0 && col < gridSize;
  } else {
    return row >= 0 && row < gridSize && col >= 0 && col <= gridSize;
  }
}

/**
 * Check if a move is valid (line exists and is not already drawn)
 */
export function isValidMove(
  board: BoardState,
  gridSize: GridSize,
  row: number,
  col: number,
  type: LineType
): boolean {
  if (!isValidLinePosition(gridSize, row, col, type)) {
    return false;
  }
  return !isLineDrawn(board, row, col, type);
}

/**
 * Get all available moves (lines that haven't been drawn yet)
 */
export function getAvailableMoves(
  board: BoardState,
  gridSize: GridSize
): { row: number; col: number; type: LineType }[] {
  const moves: { row: number; col: number; type: LineType }[] = [];

  // Horizontal lines
  for (let row = 0; row <= gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (board.horizontalLines[row][col] === null) {
        moves.push({ row, col, type: "horizontal" });
      }
    }
  }

  // Vertical lines
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col <= gridSize; col++) {
      if (board.verticalLines[row][col] === null) {
        moves.push({ row, col, type: "vertical" });
      }
    }
  }

  return moves;
}

/**
 * Count how many sides a box has completed
 */
export function countBoxSides(
  board: BoardState,
  boxRow: number,
  boxCol: number
): number {
  let count = 0;

  // Top side (horizontal line at row = boxRow)
  if (board.horizontalLines[boxRow]?.[boxCol] !== null) count++;

  // Bottom side (horizontal line at row = boxRow + 1)
  if (board.horizontalLines[boxRow + 1]?.[boxCol] !== null) count++;

  // Left side (vertical line at col = boxCol)
  if (board.verticalLines[boxRow]?.[boxCol] !== null) count++;

  // Right side (vertical line at col = boxCol + 1)
  if (board.verticalLines[boxRow]?.[boxCol + 1] !== null) count++;

  return count;
}

/**
 * Check which boxes would be completed by drawing a line
 * Returns array of box positions [{ row, col }, ...]
 */
export function getCompletedBoxes(
  board: BoardState,
  gridSize: GridSize,
  lineRow: number,
  lineCol: number,
  lineType: LineType
): { row: number; col: number }[] {
  const completedBoxes: { row: number; col: number }[] = [];

  // Create a temporary board with the new line
  const tempBoard = cloneBoard(board);
  if (lineType === "horizontal") {
    tempBoard.horizontalLines[lineRow][lineCol] = 1; // Temporarily mark as drawn
  } else {
    tempBoard.verticalLines[lineRow][lineCol] = 1;
  }

  // A horizontal line at (row, col) affects:
  // - Box above: (row - 1, col) if row > 0
  // - Box below: (row, col) if row < gridSize
  if (lineType === "horizontal") {
    // Box above
    if (lineRow > 0 && countBoxSides(tempBoard, lineRow - 1, lineCol) === 4) {
      completedBoxes.push({ row: lineRow - 1, col: lineCol });
    }
    // Box below
    if (lineRow < gridSize && countBoxSides(tempBoard, lineRow, lineCol) === 4) {
      completedBoxes.push({ row: lineRow, col: lineCol });
    }
  }

  // A vertical line at (row, col) affects:
  // - Box to the left: (row, col - 1) if col > 0
  // - Box to the right: (row, col) if col < gridSize
  if (lineType === "vertical") {
    // Box to the left
    if (lineCol > 0 && countBoxSides(tempBoard, lineRow, lineCol - 1) === 4) {
      completedBoxes.push({ row: lineRow, col: lineCol - 1 });
    }
    // Box to the right
    if (lineCol < gridSize && countBoxSides(tempBoard, lineRow, lineCol) === 4) {
      completedBoxes.push({ row: lineRow, col: lineCol });
    }
  }

  return completedBoxes;
}

/**
 * Deep clone the board state
 */
export function cloneBoard(board: BoardState): BoardState {
  return {
    horizontalLines: board.horizontalLines.map((row) => [...row]),
    verticalLines: board.verticalLines.map((row) => [...row]),
    boxes: board.boxes.map((row) => [...row]),
  };
}

/**
 * Make a move on the board
 * Returns { newBoard, boxesCompleted } where boxesCompleted is the number of boxes
 * completed by this move (player gets another turn if > 0)
 */
export function makeMove(
  board: BoardState,
  gridSize: GridSize,
  row: number,
  col: number,
  type: LineType,
  player: Player
): { newBoard: BoardState; boxesCompleted: number } | null {
  if (!isValidMove(board, gridSize, row, col, type)) {
    return null;
  }

  const newBoard = cloneBoard(board);

  // Draw the line
  if (type === "horizontal") {
    newBoard.horizontalLines[row][col] = player;
  } else {
    newBoard.verticalLines[row][col] = player;
  }

  // Check for completed boxes
  const completedBoxes = getCompletedBoxes(board, gridSize, row, col, type);

  // Mark completed boxes with the player
  for (const box of completedBoxes) {
    newBoard.boxes[box.row][box.col] = player;
  }

  return { newBoard, boxesCompleted: completedBoxes.length };
}

/**
 * Check if the game is over (all boxes are filled)
 */
export function isGameOver(board: BoardState, gridSize: GridSize): boolean {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (board.boxes[row][col] === null) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Calculate scores from the board
 */
export function calculateScores(board: BoardState): { 1: number; 2: number } {
  const scores = { 1: 0, 2: 0 };

  for (const row of board.boxes) {
    for (const cell of row) {
      if (cell === 1) scores[1]++;
      if (cell === 2) scores[2]++;
    }
  }

  return scores;
}

/**
 * Get the winner (player with most boxes) or null if tied
 */
export function getWinner(scores: { 1: number; 2: number }): Player | null {
  if (scores[1] > scores[2]) return 1;
  if (scores[2] > scores[1]) return 2;
  return null;
}

/**
 * Get the next player
 */
export function getNextPlayer(currentPlayer: Player): Player {
  return currentPlayer === 1 ? 2 : 1;
}
