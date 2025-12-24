import { Suit, Rank } from "./types";

export const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];

export const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export const CARD_VALUES: Record<Rank, number> = {
  "A": 11,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  "J": 10,
  "Q": 10,
  "K": 10,
};

export const DEALER_STAND_VALUE = 17;
export const BLACKJACK_VALUE = 21;
export const DEALER_TURN_DELAY = 800;

// Animation timing
export const CARD_DRAW_ANIMATION = 300;
export const CARD_FLIP_ANIMATION = 400;
export const INITIAL_DEAL_DELAY = 200;
