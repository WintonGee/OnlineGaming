import { Board, Cell } from '../types';

/**
 * Creates an empty cell
 */
export function createEmptyCell(): Cell {
  return {
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    adjacentMines: 0,
  };
}

/**
 * Creates a new board with specified dimensions
 */
export function createEmptyBoard(width: number, height: number): Board {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => createEmptyCell())
  );
}

/**
 * Places mines randomly on the board
 */
export function placeMines(board: Board, mineCount: number): Board {
  const height = board.length;
  const width = board[0].length;
  const totalCells = width * height;

  // Create a copy of the board
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  // Ensure we don't place more mines than possible
  const safeMineCount = Math.min(mineCount, totalCells - 1);

  // Create array of all positions and shuffle
  const positions: { row: number; col: number }[] = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      positions.push({ row, col });
    }
  }

  // Fisher-Yates shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Place mines at first N shuffled positions
  for (let i = 0; i < safeMineCount; i++) {
    const { row, col } = positions[i];
    newBoard[row][col].isMine = true;
  }

  return newBoard;
}

/**
 * Calculates adjacent mine counts for all cells
 */
export function calculateAdjacentMines(board: Board): Board {
  const height = board.length;
  const width = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].adjacentMines = countAdjacentMines(board, row, col);
      }
    }
  }

  return newBoard;
}

/**
 * Counts mines adjacent to a specific cell
 */
export function countAdjacentMines(board: Board, row: number, col: number): number {
  const height = board.length;
  const width = board[0].length;
  let count = 0;

  // Check all 8 adjacent cells
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue; // Skip the cell itself

      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < height &&
        newCol >= 0 &&
        newCol < width &&
        board[newRow][newCol].isMine
      ) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Generates a complete board with mines and adjacent counts
 */
export function generateBoard(width: number, height: number, mineCount: number): Board {
  let board = createEmptyBoard(width, height);
  board = placeMines(board, mineCount);
  board = calculateAdjacentMines(board);
  return board;
}

/**
 * Gets adjacent cell positions
 */
export function getAdjacentPositions(
  row: number,
  col: number,
  height: number,
  width: number
): { row: number; col: number }[] {
  const positions: { row: number; col: number }[] = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
        positions.push({ row: newRow, col: newCol });
      }
    }
  }

  return positions;
}
