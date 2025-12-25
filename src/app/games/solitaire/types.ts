export type Suit = "hearts" | "diamonds" | "clubs" | "spades";

export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export type PileType = "tableau" | "foundation" | "stock" | "waste";

export interface CardLocation {
  pile: PileType;
  index: number; // Which pile (0-6 for tableau, 0-3 for foundation)
  cardIndex?: number; // Position within pile for tableau
}

export interface DraggedCards {
  cards: Card[];
  source: CardLocation;
}

export interface GameState {
  tableau: Card[][]; // 7 columns
  foundation: Card[][]; // 4 piles (one per suit order: spades, hearts, diamonds, clubs)
  stock: Card[]; // Draw pile (face down)
  waste: Card[]; // Cards drawn from stock (face up)
  moves: number;
  gameStarted: boolean;
  won: boolean;
  drawCount: 1 | 3; // Draw 1 or 3 cards at a time
}

export interface MoveResult {
  valid: boolean;
  newState?: GameState;
  message?: string;
}

// Suit colors for alternating rule
export type SuitColor = "red" | "black";
