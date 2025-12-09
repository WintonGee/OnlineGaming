export type Difficulty = "easy" | "medium" | "hard";

export type CardStatus = "hidden" | "flipped" | "matched";

export interface Card {
  id: number;
  symbol: string;
  pairId: number;
  status: CardStatus;
}

export interface GameState {
  cards: Card[];
  flippedCards: number[]; // Indices of currently flipped cards (max 2)
  moves: number;
  matches: number;
  totalPairs: number;
  difficulty: Difficulty;
  gameStarted: boolean;
  gameOver: boolean;
  won: boolean;
}

export interface BestScores {
  easy?: number;
  medium?: number;
  hard?: number;
  [key: string]: number | undefined;
}

export interface DifficultyConfig {
  rows: number;
  cols: number;
  pairs: number;
}
