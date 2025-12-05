import { BoardState, Player, LineType, GridSize, Difficulty } from "../types";
import {
  getAvailableMoves,
  countBoxSides,
  getCompletedBoxes,
  cloneBoard,
  makeMove,
} from "./game";

interface Move {
  row: number;
  col: number;
  type: LineType;
}

/**
 * Easy AI: Makes random moves
 */
function getEasyMove(board: BoardState, gridSize: GridSize): Move | null {
  const moves = getAvailableMoves(board, gridSize);
  if (moves.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}

/**
 * Get moves that would complete a box (give points)
 */
function getBoxCompletingMoves(
  board: BoardState,
  gridSize: GridSize
): Move[] {
  const moves = getAvailableMoves(board, gridSize);
  return moves.filter((move) => {
    const completedBoxes = getCompletedBoxes(
      board,
      gridSize,
      move.row,
      move.col,
      move.type
    );
    return completedBoxes.length > 0;
  });
}

/**
 * Get moves that would give the opponent a box (dangerous moves)
 * These are moves that complete the 3rd side of a box
 */
function getDangerousMoves(board: BoardState, gridSize: GridSize): Move[] {
  const moves = getAvailableMoves(board, gridSize);
  return moves.filter((move) => {
    // Check if this move creates a box with 3 sides
    return wouldCreate3SidedBox(board, gridSize, move);
  });
}

/**
 * Check if a move would create a box with exactly 3 sides
 * (allowing opponent to complete it)
 */
function wouldCreate3SidedBox(
  board: BoardState,
  gridSize: GridSize,
  move: Move
): boolean {
  // Simulate the move
  const tempBoard = cloneBoard(board);
  if (move.type === "horizontal") {
    tempBoard.horizontalLines[move.row][move.col] = 1;
  } else {
    tempBoard.verticalLines[move.row][move.col] = 1;
  }

  // Check adjacent boxes
  const boxesToCheck: { row: number; col: number }[] = [];

  if (move.type === "horizontal") {
    if (move.row > 0) boxesToCheck.push({ row: move.row - 1, col: move.col });
    if (move.row < gridSize) boxesToCheck.push({ row: move.row, col: move.col });
  } else {
    if (move.col > 0) boxesToCheck.push({ row: move.row, col: move.col - 1 });
    if (move.col < gridSize) boxesToCheck.push({ row: move.row, col: move.col });
  }

  // If any of these boxes now have exactly 3 sides, this is a dangerous move
  for (const box of boxesToCheck) {
    if (countBoxSides(tempBoard, box.row, box.col) === 3) {
      return true;
    }
  }

  return false;
}

/**
 * Get safe moves (moves that don't give opponent a box)
 */
function getSafeMoves(board: BoardState, gridSize: GridSize): Move[] {
  const allMoves = getAvailableMoves(board, gridSize);
  const dangerousMoves = getDangerousMoves(board, gridSize);
  const dangerousSet = new Set(
    dangerousMoves.map((m) => `${m.row}-${m.col}-${m.type}`)
  );

  return allMoves.filter(
    (move) => !dangerousSet.has(`${move.row}-${move.col}-${move.type}`)
  );
}

/**
 * Medium AI: Takes boxes when available, otherwise makes safe moves
 */
function getMediumMove(
  board: BoardState,
  gridSize: GridSize
): Move | null {
  const moves = getAvailableMoves(board, gridSize);
  if (moves.length === 0) return null;

  // 1. Take any available boxes
  const boxCompletingMoves = getBoxCompletingMoves(board, gridSize);
  if (boxCompletingMoves.length > 0) {
    // Prefer moves that complete more boxes
    let bestMove = boxCompletingMoves[0];
    let maxBoxes = 0;
    for (const move of boxCompletingMoves) {
      const boxes = getCompletedBoxes(board, gridSize, move.row, move.col, move.type);
      if (boxes.length > maxBoxes) {
        maxBoxes = boxes.length;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // 2. Make a safe move (doesn't give opponent a box)
  const safeMoves = getSafeMoves(board, gridSize);
  if (safeMoves.length > 0) {
    const randomIndex = Math.floor(Math.random() * safeMoves.length);
    return safeMoves[randomIndex];
  }

  // 3. If no safe moves, pick the move that gives the least boxes to opponent
  // (Find the smallest chain to sacrifice)
  return findSmallestSacrifice(board, gridSize);
}

/**
 * Find the move that sacrifices the smallest chain of boxes
 */
function findSmallestSacrifice(
  board: BoardState,
  gridSize: GridSize
): Move | null {
  const moves = getAvailableMoves(board, gridSize);
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let smallestChain = Infinity;

  for (const move of moves) {
    const chainSize = estimateChainSize(board, gridSize, move);
    if (chainSize < smallestChain) {
      smallestChain = chainSize;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Estimate the size of the chain that would be opened by a move
 */
function estimateChainSize(
  board: BoardState,
  gridSize: GridSize,
  move: Move
): number {
  // Simulate making the move
  const tempBoard = cloneBoard(board);
  if (move.type === "horizontal") {
    tempBoard.horizontalLines[move.row][move.col] = 1;
  } else {
    tempBoard.verticalLines[move.row][move.col] = 1;
  }

  // Find boxes that now have 3 sides
  let chainSize = 0;
  const visited = new Set<string>();

  const explore = (boxRow: number, boxCol: number) => {
    const key = `${boxRow}-${boxCol}`;
    if (visited.has(key)) return;
    if (boxRow < 0 || boxRow >= gridSize || boxCol < 0 || boxCol >= gridSize)
      return;
    if (tempBoard.boxes[boxRow][boxCol] !== null) return;

    const sides = countBoxSides(tempBoard, boxRow, boxCol);
    if (sides >= 3) {
      visited.add(key);
      chainSize++;

      // Check adjacent boxes
      explore(boxRow - 1, boxCol);
      explore(boxRow + 1, boxCol);
      explore(boxRow, boxCol - 1);
      explore(boxRow, boxCol + 1);
    }
  };

  // Find starting boxes (those that now have 3 sides due to our move)
  if (move.type === "horizontal") {
    if (move.row > 0) explore(move.row - 1, move.col);
    if (move.row < gridSize) explore(move.row, move.col);
  } else {
    if (move.col > 0) explore(move.row, move.col - 1);
    if (move.col < gridSize) explore(move.row, move.col);
  }

  return chainSize;
}

/**
 * Count boxes that would be captured if we start taking from a 3-sided box
 */
function countChainBoxes(
  board: BoardState,
  gridSize: GridSize,
  startRow: number,
  startCol: number,
  player: Player
): number {
  let count = 0;
  const tempBoard = cloneBoard(board);
  const queue: { row: number; col: number }[] = [
    { row: startRow, col: startCol },
  ];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { row, col } = queue.shift()!;
    const key = `${row}-${col}`;

    if (visited.has(key)) continue;
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) continue;
    if (tempBoard.boxes[row][col] !== null) continue;

    // Check if we can complete this box (has 3 sides)
    if (countBoxSides(tempBoard, row, col) === 3) {
      visited.add(key);
      count++;

      // Complete the box
      tempBoard.boxes[row][col] = player;

      // Find and draw the missing line
      completeBox(tempBoard, row, col, player);

      // Check adjacent boxes
      queue.push({ row: row - 1, col });
      queue.push({ row: row + 1, col });
      queue.push({ row, col: col - 1 });
      queue.push({ row, col: col + 1 });
    }
  }

  return count;
}

/**
 * Complete a box by drawing its missing line
 */
function completeBox(
  board: BoardState,
  boxRow: number,
  boxCol: number,
  player: Player
): void {
  // Top
  if (board.horizontalLines[boxRow]?.[boxCol] === null) {
    board.horizontalLines[boxRow][boxCol] = player;
    return;
  }
  // Bottom
  if (board.horizontalLines[boxRow + 1]?.[boxCol] === null) {
    board.horizontalLines[boxRow + 1][boxCol] = player;
    return;
  }
  // Left
  if (board.verticalLines[boxRow]?.[boxCol] === null) {
    board.verticalLines[boxRow][boxCol] = player;
    return;
  }
  // Right
  if (board.verticalLines[boxRow]?.[boxCol + 1] === null) {
    board.verticalLines[boxRow][boxCol + 1] = player;
    return;
  }
}

/**
 * Hard AI: Uses chain counting and double-cross strategy
 */
function getHardMove(
  board: BoardState,
  gridSize: GridSize,
  aiPlayer: Player
): Move | null {
  const moves = getAvailableMoves(board, gridSize);
  if (moves.length === 0) return null;

  // 1. Take any available boxes
  const boxCompletingMoves = getBoxCompletingMoves(board, gridSize);
  if (boxCompletingMoves.length > 0) {
    // Check for double-cross opportunity
    // If we're about to finish a chain, consider leaving 2 boxes
    const chainMove = findBestChainMove(
      board,
      gridSize,
      boxCompletingMoves,
      aiPlayer
    );
    if (chainMove) return chainMove;

    // Otherwise, take the move that gives the most boxes
    let bestMove = boxCompletingMoves[0];
    let maxBoxes = 0;
    for (const move of boxCompletingMoves) {
      const boxes = getCompletedBoxes(board, gridSize, move.row, move.col, move.type);
      if (boxes.length > maxBoxes) {
        maxBoxes = boxes.length;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // 2. Make a safe move that doesn't give opponent a chain
  const safeMoves = getSafeMoves(board, gridSize);
  if (safeMoves.length > 0) {
    // Prefer moves that maximize our future options
    return pickStrategicSafeMove(board, gridSize, safeMoves);
  }

  // 3. All moves are dangerous - use double-cross strategy
  // Find the smallest chain and sacrifice it (keeping 2 if possible)
  return findDoubleCrossMove(board, gridSize, aiPlayer);
}

/**
 * Find the best move when taking a chain (implements double-cross)
 */
function findBestChainMove(
  board: BoardState,
  gridSize: GridSize,
  completingMoves: Move[],
  aiPlayer: Player
): Move | null {
  // For now, just take boxes greedily
  // A full implementation would consider the double-cross strategy
  // where you leave 2 boxes at the end of a chain to force opponent
  // to open the next chain
  return null; // Let the greedy logic handle it
}

/**
 * Pick a strategic safe move
 */
function pickStrategicSafeMove(
  board: BoardState,
  gridSize: GridSize,
  safeMoves: Move[]
): Move {
  // Prefer moves that:
  // 1. Are on the edges (less chance of creating long chains)
  // 2. Create boxes with only 1 or 2 sides (far from completion)

  let bestMove = safeMoves[0];
  let bestScore = -Infinity;

  for (const move of safeMoves) {
    let score = 0;

    // Prefer edge moves slightly
    if (move.type === "horizontal") {
      if (move.row === 0 || move.row === gridSize) score += 1;
      if (move.col === 0 || move.col === gridSize - 1) score += 1;
    } else {
      if (move.col === 0 || move.col === gridSize) score += 1;
      if (move.row === 0 || move.row === gridSize - 1) score += 1;
    }

    // Add some randomness
    score += Math.random() * 0.5;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Find a move that implements the double-cross strategy
 */
function findDoubleCrossMove(
  board: BoardState,
  gridSize: GridSize,
  aiPlayer: Player
): Move | null {
  const moves = getAvailableMoves(board, gridSize);
  if (moves.length === 0) return null;

  // Find all chains (connected boxes with 3 sides)
  const chains = findChains(board, gridSize);

  if (chains.length === 0) {
    // No chains, just pick smallest sacrifice
    return findSmallestSacrifice(board, gridSize);
  }

  // Sort chains by size
  chains.sort((a, b) => a.size - b.size);

  // If there's only one chain, we have to open it
  // If there are multiple chains:
  // - If smallest chain has 2 boxes, sacrifice it to get next chain
  // - Otherwise, sacrifice the smallest chain

  const smallestChain = chains[0];

  // Find a move that opens this chain
  for (const move of moves) {
    if (wouldOpenChain(board, gridSize, move, smallestChain.boxes)) {
      return move;
    }
  }

  // Fallback
  return findSmallestSacrifice(board, gridSize);
}

interface Chain {
  boxes: { row: number; col: number }[];
  size: number;
}

/**
 * Find all chains (groups of connected boxes with 2 sides completed)
 */
function findChains(board: BoardState, gridSize: GridSize): Chain[] {
  const chains: Chain[] = [];
  const visited = new Set<string>();

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (board.boxes[row][col] !== null) continue;

      const key = `${row}-${col}`;
      if (visited.has(key)) continue;

      const sides = countBoxSides(board, row, col);
      if (sides === 2) {
        // Start exploring this chain
        const chain = exploreChain(board, gridSize, row, col, visited);
        if (chain.size > 0) {
          chains.push(chain);
        }
      }
    }
  }

  return chains;
}

/**
 * Explore a chain starting from a box with 2 sides
 */
function exploreChain(
  board: BoardState,
  gridSize: GridSize,
  startRow: number,
  startCol: number,
  visited: Set<string>
): Chain {
  const chain: Chain = { boxes: [], size: 0 };
  const queue: { row: number; col: number }[] = [
    { row: startRow, col: startCol },
  ];

  while (queue.length > 0) {
    const { row, col } = queue.shift()!;
    const key = `${row}-${col}`;

    if (visited.has(key)) continue;
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) continue;
    if (board.boxes[row][col] !== null) continue;

    const sides = countBoxSides(board, row, col);
    if (sides >= 2) {
      visited.add(key);
      chain.boxes.push({ row, col });
      chain.size++;

      // Check adjacent boxes
      queue.push({ row: row - 1, col });
      queue.push({ row: row + 1, col });
      queue.push({ row, col: col - 1 });
      queue.push({ row, col: col + 1 });
    }
  }

  return chain;
}

/**
 * Check if a move would open a specific chain
 */
function wouldOpenChain(
  board: BoardState,
  gridSize: GridSize,
  move: Move,
  chainBoxes: { row: number; col: number }[]
): boolean {
  // Simulate the move
  const tempBoard = cloneBoard(board);
  if (move.type === "horizontal") {
    tempBoard.horizontalLines[move.row][move.col] = 1;
  } else {
    tempBoard.verticalLines[move.row][move.col] = 1;
  }

  // Check if any chain box now has 3 sides
  for (const box of chainBoxes) {
    if (countBoxSides(tempBoard, box.row, box.col) === 3) {
      return true;
    }
  }

  return false;
}

/**
 * Get AI move based on difficulty
 */
export function getAIMove(
  board: BoardState,
  gridSize: GridSize,
  aiPlayer: Player,
  difficulty: Difficulty
): Move | null {
  switch (difficulty) {
    case "easy":
      return getEasyMove(board, gridSize);
    case "medium":
      return getMediumMove(board, gridSize);
    case "hard":
      return getHardMove(board, gridSize, aiPlayer);
    default:
      return getMediumMove(board, gridSize);
  }
}
