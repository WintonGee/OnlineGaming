import {
  GridCell,
  PlacedWord,
  Direction,
  CellPosition,
  Difficulty,
} from "../types";
import {
  ALPHABET,
  DIFFICULTY_CONFIG,
  getDirectionsForDifficulty,
} from "../constants";

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Creates an empty grid of the specified size
 */
function createEmptyGrid(size: number): GridCell[][] {
  const grid: GridCell[][] = [];
  for (let row = 0; row < size; row++) {
    grid[row] = [];
    for (let col = 0; col < size; col++) {
      grid[row][col] = {
        letter: "",
        row,
        col,
        isPartOfWord: false,
        wordIndices: [],
      };
    }
  }
  return grid;
}

/**
 * Checks if a word can be placed at the given position and direction
 */
function canPlaceWord(
  grid: GridCell[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: Direction
): boolean {
  const gridSize = grid.length;

  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * direction.dy;
    const col = startCol + i * direction.dx;

    // Check bounds
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
      return false;
    }

    // Check if cell is empty or has the same letter (overlap allowed)
    const cell = grid[row][col];
    if (cell.letter !== "" && cell.letter !== word[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Places a word in the grid at the specified position and direction
 */
function placeWord(
  grid: GridCell[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: Direction,
  wordIndex: number
): void {
  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * direction.dy;
    const col = startCol + i * direction.dx;

    grid[row][col].letter = word[i];
    grid[row][col].isPartOfWord = true;
    if (!grid[row][col].wordIndices.includes(wordIndex)) {
      grid[row][col].wordIndices.push(wordIndex);
    }
  }
}

/**
 * Attempts to place a word in the grid with random position and direction
 * Returns the placement details if successful, null otherwise
 */
function tryPlaceWord(
  grid: GridCell[][],
  word: string,
  directions: Direction[],
  wordIndex: number,
  maxAttempts: number = 100
): PlacedWord | null {
  const gridSize = grid.length;
  const shuffledDirections = shuffleArray(directions);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const direction =
      shuffledDirections[Math.floor(Math.random() * shuffledDirections.length)];
    const startRow = Math.floor(Math.random() * gridSize);
    const startCol = Math.floor(Math.random() * gridSize);

    if (canPlaceWord(grid, word, startRow, startCol, direction)) {
      placeWord(grid, word, startRow, startCol, direction, wordIndex);
      return {
        word,
        startRow,
        startCol,
        direction,
        found: false,
      };
    }
  }

  return null;
}

/**
 * Fills empty cells with random letters
 */
function fillEmptyCells(grid: GridCell[][]): void {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].letter === "") {
        grid[row][col].letter =
          ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }
}

/**
 * Generates a complete word search puzzle
 */
export function generateWordSearchGrid(
  words: string[],
  difficulty: Difficulty
): { grid: GridCell[][]; placedWords: PlacedWord[] } {
  const config = DIFFICULTY_CONFIG[difficulty];
  const directions = getDirectionsForDifficulty(difficulty);

  // Normalize words: uppercase and filter out words that are too long
  const normalizedWords = words
    .map((w) => w.toUpperCase().replace(/[^A-Z]/g, ""))
    .filter((w) => w.length > 0 && w.length <= config.gridSize)
    .slice(0, config.wordCount);

  // Sort by length descending (place longer words first)
  const sortedWords = [...normalizedWords].sort((a, b) => b.length - a.length);

  const grid = createEmptyGrid(config.gridSize);
  const placedWords: PlacedWord[] = [];

  for (let i = 0; i < sortedWords.length; i++) {
    const word = sortedWords[i];
    const placement = tryPlaceWord(grid, word, directions, placedWords.length);
    if (placement) {
      placedWords.push(placement);
    }
  }

  fillEmptyCells(grid);

  return { grid, placedWords };
}

/**
 * Gets the cells between two positions (for highlighting selection)
 * Returns empty array if the positions don't form a valid line
 */
export function getCellsBetween(
  start: CellPosition,
  end: CellPosition,
  gridSize: number
): CellPosition[] {
  const cells: CellPosition[] = [];

  const dRow = end.row - start.row;
  const dCol = end.col - start.col;

  // Check if it's a valid line (horizontal, vertical, or diagonal)
  const absRow = Math.abs(dRow);
  const absCol = Math.abs(dCol);

  // Must be a straight line
  if (absRow !== 0 && absCol !== 0 && absRow !== absCol) {
    return [];
  }

  const steps = Math.max(absRow, absCol);
  if (steps === 0) {
    return [{ row: start.row, col: start.col }];
  }

  const stepRow = dRow / steps;
  const stepCol = dCol / steps;

  for (let i = 0; i <= steps; i++) {
    const row = start.row + Math.round(i * stepRow);
    const col = start.col + Math.round(i * stepCol);

    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      cells.push({ row, col });
    }
  }

  return cells;
}

/**
 * Checks if the selected cells match any of the words
 * Returns the word if found, null otherwise
 */
export function checkWordMatch(
  selectedCells: CellPosition[],
  grid: GridCell[][],
  words: PlacedWord[]
): string | null {
  if (selectedCells.length < 2) return null;

  // Get the selected letters in order
  const selectedWord = selectedCells
    .map((pos) => grid[pos.row][pos.col].letter)
    .join("");

  // Also check reverse
  const reversedWord = selectedWord.split("").reverse().join("");

  // Check against all unfound words
  for (const placedWord of words) {
    if (placedWord.found) continue;

    if (placedWord.word === selectedWord || placedWord.word === reversedWord) {
      return placedWord.word;
    }
  }

  return null;
}

/**
 * Validates that a selection forms a valid straight line
 */
export function isValidSelection(
  start: CellPosition,
  end: CellPosition
): boolean {
  const dRow = Math.abs(end.row - start.row);
  const dCol = Math.abs(end.col - start.col);

  // Horizontal, vertical, or perfect diagonal
  return dRow === 0 || dCol === 0 || dRow === dCol;
}
