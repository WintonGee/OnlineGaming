import { Card } from "../types";
import { SUITS, RANKS } from "../constants";

/**
 * Creates a standard 52-card deck with all cards face down
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
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
 * Draws the top card from the deck face up
 * Returns the drawn card and the remaining deck
 */
export function drawCard(deck: Card[]): { card: Card; remainingDeck: Card[] } {
  if (deck.length === 0) {
    throw new Error("Cannot draw from an empty deck");
  }

  const [topCard, ...remainingDeck] = deck;
  const card = { ...topCard, faceUp: true };

  return { card, remainingDeck };
}

/**
 * Deals initial cards for a new round of Blackjack
 * - Player receives 2 cards face up
 * - Dealer receives 2 cards (first face down, second face up - "hole card" rule)
 * Returns the dealt hands and remaining deck
 */
export function dealInitialCards(deck: Card[]): {
  playerHand: Card[];
  dealerHand: Card[];
  remainingDeck: Card[];
} {
  if (deck.length < 4) {
    throw new Error("Not enough cards in deck to deal initial hands");
  }

  // Deal first card to player (face up)
  const { card: playerCard1, remainingDeck: deck1 } = drawCard(deck);

  // Deal first card to dealer (face down - hole card)
  const [dealerCard1Raw, ...deck2] = deck1;
  const dealerCard1 = { ...dealerCard1Raw, faceUp: false };

  // Deal second card to player (face up)
  const { card: playerCard2, remainingDeck: deck3 } = drawCard(deck2);

  // Deal second card to dealer (face up)
  const { card: dealerCard2, remainingDeck: remainingDeck } = drawCard(deck3);

  return {
    playerHand: [playerCard1, playerCard2],
    dealerHand: [dealerCard1, dealerCard2],
    remainingDeck,
  };
}
