import { Card, Suit, Rank } from "../types";
import { SUITS, RANKS } from "../constants";

let cardIdCounter = 0;

/**
 * Generates a unique card ID
 */
function generateCardId(): string {
  return `card-${++cardIdCounter}`;
}

/**
 * Resets the card ID counter (for new games)
 */
export function resetCardIdCounter(): void {
  cardIdCounter = 0;
}

/**
 * Creates a standard 52-card deck with all cards face down
 */
export function createDeck(): Card[] {
  resetCardIdCounter();
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: generateCardId(),
        suit,
        rank,
        faceUp: false,
      });
    }
  }

  return deck;
}

/**
 * Shuffles a deck using the Fisher-Yates shuffle algorithm
 * Returns a new shuffled deck without mutating the original
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Creates a shuffled deck ready for dealing
 */
export function createShuffledDeck(): Card[] {
  return shuffleDeck(createDeck());
}
