import { Difficulty as SharedDifficulty } from "@/lib/types/shared";

export type Difficulty = SharedDifficulty | "custom";

export type CardStatus = "hidden" | "flipped" | "matched";

export interface Card {
  id: number;
  symbol: string;
  pairId: number;
  status: CardStatus;
}

export interface CustomSettings {
  rows: number;
  cols: number;
}

export interface GameState {
  cards: Card[];
  flippedCards: number[]; // Indices of currently flipped cards (max 2)
  moves: number;
  matches: number;
  totalPairs: number;
  difficulty: Difficulty;
  customSettings?: CustomSettings;
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
