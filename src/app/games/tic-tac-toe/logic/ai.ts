import { Board, Player } from "../types";
import { WINNING_LINES } from "../constants";
import { getEmptyCells, checkWinner } from "./game";

/**
 * Easy AI: Makes completely random moves
 */
export function getEasyMove(board: Board): number {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return -1;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

/**
 * Medium AI: Blocks opponent from winning, tries to win if possible,
 * otherwise makes a random move. Does not look ahead.
 */
export function getMediumMove(board: Board, aiPlayer: Player): number {
  const opponent: Player = aiPlayer === "X" ? "O" : "X";
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) return -1;

  // 1. Check if AI can win in one move
  for (const cell of emptyCells) {
    const testBoard = [...board];
    testBoard[cell] = aiPlayer;
    if (checkWinner(testBoard) === aiPlayer) {
      return cell;
    }
  }

  // 2. Block opponent from winning
  for (const cell of emptyCells) {
    const testBoard = [...board];
    testBoard[cell] = opponent;
    if (checkWinner(testBoard) === opponent) {
      return cell;
    }
  }

  // 3. Take center if available
  if (board[4] === null) {
    return 4;
  }

  // 4. Take a corner if available
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((c) => board[c] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // 5. Take any available edge
  return getEasyMove(board);
}

/**
 * Hard AI: Uses Minimax algorithm - unbeatable
 */
export function getHardMove(board: Board, aiPlayer: Player): number {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return -1;

  // For the first move, pick a corner or center for speed
  if (emptyCells.length === 9) {
    const firstMoves = [0, 2, 4, 6, 8];
    return firstMoves[Math.floor(Math.random() * firstMoves.length)];
  }

  let bestScore = -Infinity;
  let bestMove = emptyCells[0];

  for (const cell of emptyCells) {
    const testBoard = [...board];
    testBoard[cell] = aiPlayer;
    const score = minimax(testBoard, 0, false, aiPlayer, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = cell;
    }
  }

  return bestMove;
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  alpha: number,
  beta: number
): number {
  const opponent: Player = aiPlayer === "X" ? "O" : "X";
  const winner = checkWinner(board);

  // Terminal states
  if (winner === aiPlayer) {
    return 10 - depth; // Prefer faster wins
  }
  if (winner === opponent) {
    return depth - 10; // Prefer slower losses
  }
  if (getEmptyCells(board).length === 0) {
    return 0; // Draw
  }

  const emptyCells = getEmptyCells(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const cell of emptyCells) {
      const testBoard = [...board];
      testBoard[cell] = aiPlayer;
      const score = minimax(testBoard, depth + 1, false, aiPlayer, alpha, beta);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const cell of emptyCells) {
      const testBoard = [...board];
      testBoard[cell] = opponent;
      const score = minimax(testBoard, depth + 1, true, aiPlayer, alpha, beta);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minScore;
  }
}

/**
 * Get AI move based on difficulty
 */
export function getAIMove(
  board: Board,
  aiPlayer: Player,
  difficulty: "easy" | "medium" | "hard"
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
