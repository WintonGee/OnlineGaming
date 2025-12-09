// Core game types for Snake

export interface Position {
  row: number;
  col: number;
}

export type Direction = "up" | "down" | "left" | "right";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  gameOver: boolean;
  won: boolean;
  score: number;
  isPaused: boolean;
}

export interface DifficultyConfig {
  gridSize: number;
  speed: number; // milliseconds between moves
  label: string;
}

export interface HighScores {
  Easy?: number;
  Medium?: number;
  Hard?: number;
  [key: string]: number | undefined;
}
