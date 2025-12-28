// Card types (reuse from blackjack pattern)
export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // Numeric value for comparison (A=1, 2-10=face value, J=11, Q=12, K=13)
  isNew?: boolean;
  isFlipping?: boolean;
}

export type GamePhase = "playing" | "revealing" | "gameOver";
export type GuessResult = "correct" | "wrong" | "tie" | null;

export interface GameState {
  currentCard: Card;
  nextCard: Card | null;
  deck: Card[];
  streak: number;
  bestStreak: number;
  gamePhase: GamePhase;
  lastGuess: "higher" | "lower" | null;
  lastResult: GuessResult;
}

export interface BestScores {
  bestStreak: number;
}
