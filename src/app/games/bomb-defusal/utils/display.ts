import { StripColor, KeypadSymbol } from "../types";
import { STRIP_RELEASE_DIGIT } from "../constants";

/**
 * Get the digit to wait for when releasing based on strip color
 */
export function getReleaseDigit(stripColor: StripColor): string {
  return STRIP_RELEASE_DIGIT[stripColor] || STRIP_RELEASE_DIGIT.default;
}

/**
 * Get the display character for a keypad symbol
 */
export function getSymbolDisplay(symbol: KeypadSymbol): string {
  const SYMBOL_MAP: Record<KeypadSymbol, string> = {
    balloon: "🎈",
    "at-sign": "@",
    lambda: "λ",
    lightning: "⚡",
    kitty: "🐱",
    "h-symbol": "Ͱ",
    "backward-c": "Ↄ",
    "curly-e": "Ɛ",
    "filled-star": "★",
    "hollow-star": "☆",
    "question-mark": "?",
    copyright: "©",
    "curly-w": "Ѿ",
    "double-k": "Җ",
    "squid-knives": "ψ",
    "smiley-face": "☺",
    paragraph: "¶",
    "right-c": "Ͻ",
    "backward-bt": "ϗ",
    "six-note": "♬",
    "upside-bt": "Ϟ",
    omega: "Ω",
    "melted-3": "Ҙ",
    "euro-symbol": "€",
    "circle-star": "✪",
    "n-curly": "Ҋ",
    "alien-a": "Ѧ",
  };

  return SYMBOL_MAP[symbol] || symbol;
}

/**
 * Format frequency for display
 */
export function formatFrequency(frequency: number): string {
  return `${frequency.toFixed(3)} MHz`;
}

/**
 * Get walls for rendering a maze
 * This is display logic that transforms maze data for rendering
 */
import { MAZE_WALLS } from "../constants";
import { MazePosition } from "../types";

/**
 * Convert wall array data to a lookup structure
 */
function buildWallSet(mazeIndex: number): Set<string> {
  const walls = new Set<string>();
  const wallData = MAZE_WALLS[mazeIndex];

  for (const wall of wallData) {
    const [r1, c1, r2, c2] = wall;
    walls.add(`${r1},${c1}-${r2},${c2}`);
    walls.add(`${r2},${c2}-${r1},${c1}`);
  }

  return walls;
}

/**
 * Check if there's a wall between two adjacent cells
 */
function hasWall(wallSet: Set<string>, from: MazePosition, to: MazePosition): boolean {
  return wallSet.has(`${from.row},${from.col}-${to.row},${to.col}`);
}

export function getWallsForRendering(mazeIndex: number): {
  row: number;
  col: number;
  walls: { up: boolean; right: boolean; down: boolean; left: boolean };
}[] {
  const wallSet = buildWallSet(mazeIndex);
  const result: {
    row: number;
    col: number;
    walls: { up: boolean; right: boolean; down: boolean; left: boolean };
  }[] = [];

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      result.push({
        row,
        col,
        walls: {
          up: row === 0 || hasWall(wallSet, { row, col }, { row: row - 1, col }),
          right: col === 5 || hasWall(wallSet, { row, col }, { row, col: col + 1 }),
          down: row === 5 || hasWall(wallSet, { row, col }, { row: row + 1, col }),
          left: col === 0 || hasWall(wallSet, { row, col }, { row, col: col - 1 }),
        },
      });
    }
  }

  return result;
}
