import { Board, Player, Difficulty } from "../types";
import { ROWS, COLS, WIN_LENGTH } from "../constants";
import {
  getAvailableColumns,
  dropPiece,
  checkWinner,
  getNextPlayer,
} from "./gameLogic";

/**
 * Easy AI: Makes completely random moves
 */
export function getEasyMove(board: Board): number {
  const available = getAvailableColumns(board);
  if (available.length === 0) return -1;
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Medium AI: Blocks opponent from winning, tries to win if possible,
 * prefers center columns, otherwise makes a random move.
 */
export function getMediumMove(board: Board, aiPlayer: Player): number {
  const opponent = getNextPlayer(aiPlayer);
  const available = getAvailableColumns(board);

  if (available.length === 0) return -1;

  // 1. Check if AI can win in one move
  for (const col of available) {
    const testBoard = dropPiece(board, col, aiPlayer);
    if (testBoard && checkWinner(testBoard) === aiPlayer) {
      return col;
    }
  }

  // 2. Block opponent from winning
  for (const col of available) {
    const testBoard = dropPiece(board, col, opponent);
    if (testBoard && checkWinner(testBoard) === opponent) {
      return col;
    }
  }

  // 3. Check for two-move win setups (creating a situation where AI can win on next turn)
  for (const col of available) {
    const testBoard = dropPiece(board, col, aiPlayer);
    if (testBoard) {
      let winningMoves = 0;
      const nextAvailable = getAvailableColumns(testBoard);
      for (const nextCol of nextAvailable) {
        const nextBoard = dropPiece(testBoard, nextCol, aiPlayer);
        if (nextBoard && checkWinner(nextBoard) === aiPlayer) {
          winningMoves++;
        }
      }
      // If this creates multiple winning threats, take it
      if (winningMoves >= 2) {
        return col;
      }
    }
  }

  // 4. Prefer center columns (better strategically)
  const centerPreference = [3, 2, 4, 1, 5, 0, 6];
  for (const col of centerPreference) {
    if (available.includes(col)) {
      return col;
    }
  }

  // 5. Random fallback
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Evaluate a window of 4 cells for scoring
 */
function evaluateWindow(window: (Player | null)[], player: Player): number {
  const opponent = getNextPlayer(player);
  let score = 0;

  const playerCount = window.filter((c) => c === player).length;
  const emptyCount = window.filter((c) => c === null).length;
  const opponentCount = window.filter((c) => c === opponent).length;

  if (playerCount === 4) {
    score += 100;
  } else if (playerCount === 3 && emptyCount === 1) {
    score += 5;
  } else if (playerCount === 2 && emptyCount === 2) {
    score += 2;
  }

  if (opponentCount === 3 && emptyCount === 1) {
    score -= 4;
  }

  return score;
}

/**
 * Score the entire board position for a player
 */
function scorePosition(board: Board, player: Player): number {
  let score = 0;

  // Center column preference
  const centerCol = Math.floor(COLS / 2);
  let centerCount = 0;
  for (let row = 0; row < ROWS; row++) {
    if (board[row][centerCol] === player) {
      centerCount++;
    }
  }
  score += centerCount * 3;

  // Horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const window = [
        board[row][col],
        board[row][col + 1],
        board[row][col + 2],
        board[row][col + 3],
      ];
      score += evaluateWindow(window, player);
    }
  }

  // Vertical
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
      const window = [
        board[row][col],
        board[row + 1][col],
        board[row + 2][col],
        board[row + 3][col],
      ];
      score += evaluateWindow(window, player);
    }
  }

  // Diagonal (positive slope)
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const window = [
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3],
      ];
      score += evaluateWindow(window, player);
    }
  }

  // Diagonal (negative slope)
  for (let row = WIN_LENGTH - 1; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const window = [
        board[row][col],
        board[row - 1][col + 1],
        board[row - 2][col + 2],
        board[row - 3][col + 3],
      ];
      score += evaluateWindow(window, player);
    }
  }

  return score;
}

/**
 * Check if position is terminal (game over)
 */
function isTerminal(board: Board): boolean {
  return (
    checkWinner(board) !== null || getAvailableColumns(board).length === 0
  );
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  const winner = checkWinner(board);
  const opponent = getNextPlayer(aiPlayer);

  // Terminal states
  if (winner === aiPlayer) {
    return 100000 + depth; // Prefer faster wins
  }
  if (winner === opponent) {
    return -100000 - depth; // Prefer slower losses
  }
  if (isTerminal(board) || depth === 0) {
    return scorePosition(board, aiPlayer);
  }

  const available = getAvailableColumns(board);

  // Order columns by center preference for better pruning
  const orderedCols = [...available].sort(
    (a, b) => Math.abs(3 - a) - Math.abs(3 - b)
  );

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const col of orderedCols) {
      const newBoard = dropPiece(board, col, aiPlayer);
      if (newBoard) {
        const evalScore = minimax(
          newBoard,
          depth - 1,
          alpha,
          beta,
          false,
          aiPlayer
        );
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const col of orderedCols) {
      const newBoard = dropPiece(board, col, opponent);
      if (newBoard) {
        const evalScore = minimax(
          newBoard,
          depth - 1,
          alpha,
          beta,
          true,
          aiPlayer
        );
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}

/**
 * Hard AI: Uses Minimax algorithm with alpha-beta pruning
 */
export function getHardMove(board: Board, aiPlayer: Player): number {
  const available = getAvailableColumns(board);
  if (available.length === 0) return -1;

  // Use depth 5 for a good balance of difficulty and performance
  const depth = 5;

  let bestScore = -Infinity;
  let bestCol = available[0];

  // Order columns by center preference
  const orderedCols = [...available].sort(
    (a, b) => Math.abs(3 - a) - Math.abs(3 - b)
  );

  for (const col of orderedCols) {
    const newBoard = dropPiece(board, col, aiPlayer);
    if (newBoard) {
      // Check for immediate win
      if (checkWinner(newBoard) === aiPlayer) {
        return col;
      }

      const score = minimax(
        newBoard,
        depth - 1,
        -Infinity,
        Infinity,
        false,
        aiPlayer
      );

      if (score > bestScore) {
        bestScore = score;
        bestCol = col;
      }
    }
  }

  return bestCol;
}

/**
 * Get AI move based on difficulty
 */
export function getAIMove(
  board: Board,
  aiPlayer: Player,
  difficulty: Difficulty
): number {
  switch (difficulty) {
    case "easy":
      return getEasyMove(board);
    case "medium":
      return getMediumMove(board, aiPlayer);
    case "hard":
      return getHardMove(board, aiPlayer);
    default:
      return getMediumMove(board, aiPlayer);
  }
}
