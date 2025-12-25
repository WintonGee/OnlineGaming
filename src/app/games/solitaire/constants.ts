import { Suit, Rank, SuitColor } from "./types";

// Storage keys
export const GAME_STATE_KEY = "solitaire-state";
export const STATS_KEY = "solitaire-stats";

// Suits and ranks
export const SUITS: Suit[] = ["spades", "hearts", "diamonds", "clubs"];
export const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Suit colors
export const SUIT_COLORS: Record<Suit, SuitColor> = {
  hearts: "red",
  diamonds: "red",
  clubs: "black",
  spades: "black",
};

// Rank values for comparison (A=1 for foundation, K=13)
export const RANK_VALUES: Record<Rank, number> = {
  A: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
};

// Animation timings
export const CARD_MOVE_DURATION = 200;
export const CARD_FLIP_DURATION = 300;
export const AUTO_COMPLETE_DELAY = 100;

// Layout
export const CARD_WIDTH = 70;
export const CARD_HEIGHT = 100;
export const CARD_OVERLAP = 25; // Vertical overlap for tableau stacks
export const CARD_OVERLAP_FACEDOWN = 8; // Less overlap for face-down cards
