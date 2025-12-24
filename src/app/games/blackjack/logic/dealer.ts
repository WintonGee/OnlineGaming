import { Card } from "../types";
import { DEALER_STAND_VALUE } from "../constants";
import { calculateHandScore } from "./game";
import { drawCard } from "./deck";

export function executeDealerTurn(
  dealerCards: Card[],
  deck: Card[]
): { finalHand: Card[]; remainingDeck: Card[] } {
  let currentHand = dealerCards.map(card => ({ ...card, faceUp: true }));
  let currentDeck = [...deck];

  while (calculateHandScore(currentHand).score < DEALER_STAND_VALUE && currentDeck.length > 0) {
    const { card, remainingDeck } = drawCard(currentDeck);
    currentHand = [...currentHand, card];
    currentDeck = remainingDeck;
  }

  return { finalHand: currentHand, remainingDeck: currentDeck };
}
