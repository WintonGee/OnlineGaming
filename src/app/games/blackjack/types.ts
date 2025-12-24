export type Suit = "hearts" | "diamonds" | "clubs" | "spades";

export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  isNew?: boolean;
  isFlipping?: boolean;
}

export interface Hand {
  cards: Card[];
  score: number;
  isBust: boolean;
  isBlackjack: boolean;
}

export type GamePhase = "dealing" | "playing" | "dealerTurn" | "gameOver";

export type GameResult = "playerWin" | "dealerWin" | "push" | "blackjack" | null;

export interface GameState {
  playerHand: Hand;
  dealerHand: Hand;
  deck: Card[];
  gamePhase: GamePhase;
  gameResult: GameResult;
}
