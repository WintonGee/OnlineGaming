import { Card, Suit, SuitColor } from "../types";
import { SUIT_COLORS, RANK_VALUES } from "../constants";

/**
 * Gets the color of a suit
 */
export function getSuitColor(suit: Suit): SuitColor {
  return SUIT_COLORS[suit];
}

/**
 * Gets the numeric value of a rank (A=1, K=13)
 */
export function getRankValue(rank: Card["rank"]): number {
  return RANK_VALUES[rank];
}

/**
 * Checks if two cards have opposite colors
 */
export function areOppositeColors(card1: Card, card2: Card): boolean {
  return getSuitColor(card1.suit) !== getSuitColor(card2.suit);
}

/**
 * Checks if card1 can be placed on card2 in a tableau column
 * Rules: card1 must be one rank lower and opposite color
 */
export function canPlaceOnTableau(card: Card, targetCard: Card): boolean {
  const cardValue = getRankValue(card.rank);
  const targetValue = getRankValue(targetCard.rank);

  // Must be one rank lower
  if (cardValue !== targetValue - 1) {
    return false;
  }

  // Must be opposite color
  return areOppositeColors(card, targetCard);
}

/**
 * Checks if a card can be placed on an empty tableau column
 * Only Kings can start empty columns
 */
export function canPlaceOnEmptyTableau(card: Card): boolean {
  return card.rank === "K";
}

/**
 * Checks if a card can be placed on a foundation pile
 * Rules: Same suit, one rank higher (Ace starts empty)
 */
export function canPlaceOnFoundation(card: Card, foundationTop: Card | null): boolean {
  const cardValue = getRankValue(card.rank);

  if (foundationTop === null) {
    // Only Aces can start a foundation
    return card.rank === "A";
  }

  // Must be same suit
  if (card.suit !== foundationTop.suit) {
    return false;
  }

  // Must be one rank higher
  const topValue = getRankValue(foundationTop.rank);
  return cardValue === topValue + 1;
}

/**
 * Checks if a sequence of cards is valid for moving in tableau
 * Valid sequence: descending ranks with alternating colors
 */
export function isValidTableauSequence(cards: Card[]): boolean {
  if (cards.length === 0) return false;
  if (cards.length === 1) return true;

  for (let i = 0; i < cards.length - 1; i++) {
    if (!canPlaceOnTableau(cards[i + 1], cards[i])) {
      return false;
    }
  }

  return true;
}

/**
 * Checks if the game is won (all cards in foundation)
 */
export function checkWinCondition(foundation: Card[][]): boolean {
  // All 4 foundation piles must have 13 cards (A through K)
  return foundation.every(pile => pile.length === 13);
}
